import pkg from 'pg';
import dotenv from 'dotenv';
import { formatISO } from 'date-fns';
import { log } from 'console';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PW,
    port: Number(process.env.DB_PORT),
});


// Patient database operations
export async function getPatients(offset: number, limit: number, search: string) {
    const searchCondition = search ? `%${search.toLowerCase()}%` : '%';

    try {
        const result = await pool.query(
            `SELECT * FROM patients 
             WHERE LOWER(TRIM(name)) LIKE $1
             ORDER BY id 
             LIMIT $2 OFFSET $3`,
            [searchCondition, limit, offset]
        );

        const totalResult = await pool.query(
            `SELECT COUNT(*) FROM patients WHERE LOWER(TRIM(name)) LIKE $1`,
            [searchCondition]
        );

        return {
            patients: result.rows as Patient[],
            total: parseInt(totalResult.rows[0].count, 10),
        };
    } catch (error) {
        console.error("Error fetching patients:", error);
        throw error;
    }
}
export async function insertPatient(patient: Omit<Patient, 'id'>) {
    const { name, date_of_birth, gender, contact_number } = patient;
    const dob = formatISO(date_of_birth, { representation: "date" });

    await pool.query('INSERT INTO patients (\"name\", \"date_of_birth\", \"gender\", \"contact_number\") VALUES ($1, $2, $3, $4)', [name, dob, gender, contact_number]);
}
export async function updatePatient(id: number, patient: Patient) {
    const { name, date_of_birth, gender, contact_number } = patient;
    await pool.query('UPDATE patients SET \"name\" = $1, \"date_of_birth\" = $2, \"gender\" = $3, \"contact_number\" = $4 WHERE \"id\" = $5',
        [name, date_of_birth, gender, contact_number, id]
    );
}
export async function deletePatient(id: number) {
    await pool.query('DELETE FROM patients WHERE id = $1', [id]);
}


// Test database operations
export async function getTests(offset: number, limit: number, search: string) {
    const searchCondition = search ? `%${search.toLowerCase()}%` : '%';
    try {
        const result = await pool.query(
            `SELECT * FROM tests
             WHERE LOWER(TRIM(name)) LIKE $1
             ORDER BY id 
             LIMIT $2 OFFSET $3`,
            [searchCondition, limit, offset]
        );

        const totalResult = await pool.query(
            `SELECT COUNT(*) FROM tests WHERE LOWER(TRIM(name)) LIKE $1`,
            [searchCondition]
        );

        return {
            tests: result.rows as Test[],
            total: parseInt(totalResult.rows[0].count, 10),
        };
    } catch (error) {
        console.error("Error fetching tests:", error);
        throw error;
    }
}
export async function updateTestPrice(id: number, price: number) {
    await pool.query('UPDATE tests SET \"price\" = $1 WHERE \"id\" = $2',
        [price, id]
    );
}


// Doctor database operations
export async function getDoctors(offset: number, limit: number, search: string) {
    const searchCondition = search ? `%${search.toLowerCase()}%` : '%';

    try {
        const result = await pool.query(
            `SELECT * FROM doctors 
             WHERE LOWER(TRIM(name)) LIKE $1
             ORDER BY id 
             LIMIT $2 OFFSET $3`,
            [searchCondition, limit, offset]
        );

        const totalResult = await pool.query(
            `SELECT COUNT(*) FROM doctors WHERE LOWER(TRIM(name)) LIKE $1`,
            [searchCondition]
        );

        return {
            doctors: result.rows as Doctor[],
            total: parseInt(totalResult.rows[0].count, 10),
        };
    } catch (error) {
        console.error("Error fetching patients:", error);
        throw error;
    }
}
export async function insertDoctor(doctor: Omit<Doctor, 'id'>) {
    const { name } = doctor;
    await pool.query('INSERT INTO doctors (\"name\") VALUES ($1)', [name]);
}
export async function updateDoctor(id: number, doctor: Doctor) {
    const { name } = doctor;
    await pool.query('UPDATE doctors SET \"name\" = $1 WHERE \"id\" = $2',
        [name, id]
    );
}
export async function deleteDoctor(id: number) {
    await pool.query('DELETE FROM doctors WHERE id = $1', [id]);
}

// Test fields database operations
export async function getFieldsOfTheTest(testId: number) {
    try {
        const result = await pool.query(
            `SELECT * FROM test_fields 
             WHERE test_id=$1`,
            [testId]
        );

        return {
            test_fields: result.rows as TestField[]
        };
    } catch (error) {
        console.error("Error fetching patients:", error);
        throw error;
    }
}

// Normal ranges database operations
export async function getNormalRangesForTestField(testFieldId: number) {
    try {
        const result = await pool.query(
            `SELECT * FROM normal_ranges
             WHERE test_field_id=$1`,
            [testFieldId]
        );

        return {
            normalRanges: result.rows as NormalRange[]
        };
    } catch (error) {
        console.error("Error fetching normal ranges for a test field id:", error);
        throw error;
    }
}
export async function getNormalRangesForTest(testId: number) {
    try {
        const result = await pool.query(
            `SELECT * FROM normal_ranges
             WHERE test_id=$1`,
            [testId]
        );

        return {
            normalRanges: result.rows as NormalRange[]
        };
    } catch (error) {
        console.error("Error fetching normal ranges for a test id:", error);
        throw error;
    }
}
export async function insertOrUpdateNormalRange(
    testId: number,
    testFieldId: number,
    rules: object
) {

    await pool.query(
        `
        INSERT INTO normal_ranges ("test_id", "test_field_id", "rules")
        VALUES ($1, $2, $3)
        ON CONFLICT ("test_field_id", "test_id")
        DO UPDATE SET "rules" = EXCLUDED."rules"
        `,
        [testId, testFieldId, JSON.stringify(rules)]
    );
}

// Test register database operations
export async function addTestRegisterWithTests(data: {
    patientId: number;
    doctorId?: number | null;
    refNumber?: number | null;
    date: Date;
    testIds: number[];
    totalCost: number;
    paidPrice: number;
}) {
    const { patientId, doctorId, refNumber, date, testIds, totalCost, paidPrice } = data;
    const dateOfTest = formatISO(date, { representation: "date" });

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const testRegisterResult = await client.query(
            `
            INSERT INTO test_register ("patient_id", "ref_number", "date", "total_cost", "paid_price")
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
            `,
            [patientId, refNumber || null, dateOfTest, totalCost, paidPrice]
        );
        const testRegisterId = testRegisterResult.rows[0].id;

        const testRegisterTestsValues = testIds.map(
            (testId) => `(${testRegisterId}, ${testId}, ${doctorId || 'NULL'})`
        ).join(',');

        await client.query(
            `
            INSERT INTO test_register_tests ("test_register_id", "test_id", "doctor_id")
            VALUES ${testRegisterTestsValues};
            `
        );

        await client.query('COMMIT');

        return { success: true };
    } catch (error: any) {
        await client.query('ROLLBACK');
        throw new Error(`Transaction failed: ${error.message}`);
    } finally {
        client.release();
    }
}
