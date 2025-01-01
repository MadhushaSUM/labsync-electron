import pkg from 'pg';
import dotenv from 'dotenv';
import { formatISO } from 'date-fns';

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
export async function getTestRegistrations(
    offset: number,
    limit: number,
    fromDate?: Date,
    toDate?: Date,
    patientId?: number,
    refNumber?: number
) {
    let baseQuery = `
        SELECT 
            tr.id AS test_register_id,
            tr.date,
            tr.ref_number,
            tr.total_cost,
            tr.paid_price,
            p.id AS patient_id,
            p.name AS patient_name,
            p.gender AS patient_gender,
            p.date_of_birth AS patient_date_of_birth,
            p.contact_number AS patient_contact_number,
            t.id AS test_id,
            t.name AS test_name,
            t.code AS test_code,
            t.price AS test_price,
            d.id AS doctor_id,
            d.name AS doctor_name,
            trt.data,
            trt.data_added,
            trt.printed
        FROM test_register AS tr
        INNER JOIN patients AS p ON tr.patient_id = p.id
        INNER JOIN test_register_tests AS trt ON tr.id = trt.test_register_id
        INNER JOIN tests AS t ON trt.test_id = t.id
        LEFT JOIN doctors AS d ON trt.doctor_id = d.id
    `;

    const conditions: string[] = [];
    const params: any[] = [];

    if (fromDate) {
        conditions.push(`tr.date >= $${params.length + 1}`);
        params.push(fromDate);
    }
    if (toDate) {
        conditions.push(`tr.date <= $${params.length + 1}`);
        params.push(toDate);
    }
    if (patientId) {
        conditions.push(`tr.patient_id = $${params.length + 1}`);
        params.push(patientId);
    }
    if (refNumber) {
        conditions.push(`tr.ref_number = $${params.length + 1}`);
        params.push(refNumber);
    }

    const filteredRegisterConditions = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
        WITH filtered_registers AS (
            SELECT tr.id
            FROM test_register AS tr
            ${filteredRegisterConditions}
            ORDER BY tr.id
            LIMIT $${params.length + 1} OFFSET $${params.length + 2}
        ),
        filtered_data AS (
            ${baseQuery}
        )
        SELECT 
            (SELECT COUNT(*) FROM test_register AS tr ${filteredRegisterConditions}) AS total_count,
            fd.*
        FROM filtered_data AS fd
        WHERE fd.test_register_id IN (SELECT id FROM filtered_registers)
        ORDER BY fd.test_register_id;
    `;

    params.push(limit, offset);

    const { rows } = await pool.query(query, params);

    if (rows.length === 0) {
        return { totalCount: 0, registrations: [] };
    }

    const totalCount = parseInt(rows[0].total_count, 10);

    const registrations: Registration[] = [];
    const registrationMap = new Map<number, Registration>();

    rows.forEach(row => {
        if (!registrationMap.has(row.test_register_id)) {
            const registration: Registration = {
                id: row.test_register_id,
                date: row.date,
                patient: {
                    id: row.patient_id,
                    name: row.patient_name,
                    gender: row.patient_gender,
                    date_of_birth: row.patient_date_of_birth,
                    contact_number: row.patient_contact_number,
                },
                ref_number: row.ref_number,
                total_cost: row.total_cost,
                paid_price: row.paid_price,
                registeredTests: [],
            };
            registrationMap.set(row.test_register_id, registration);
            registrations.push(registration);
        }

        const registration: Registration = registrationMap.get(row.test_register_id)!;
        registration.registeredTests.push({
            test: {
                id: row.test_id,
                name: row.test_name,
                code: row.test_code,
                price: row.test_price,
            },
            doctor: row.doctor_id
                ? {
                    id: row.doctor_id,
                    name: row.doctor_name,
                }
                : null,
            data: row.data,
            data_added: row.data_added,
            printed: row.printed,
        });
    });

    return { totalCount, registrations };
}
export async function getTestRegistrationById(testRegisterId: number) {
    const query = `
        SELECT 
            tr.id AS test_register_id,
            tr.date,
            tr.ref_number,
            tr.total_cost,
            tr.paid_price,
            p.id AS patient_id,
            p.name AS patient_name,
            p.gender AS patient_gender,
            p.date_of_birth AS patient_date_of_birth,
            p.contact_number AS patient_contact_number,
            t.id AS test_id,
            t.name AS test_name,
            t.code AS test_code,
            t.price AS test_price,
            d.id AS doctor_id,
            d.name AS doctor_name,
            trt.data,
            trt.data_added,
            trt.printed
        FROM test_register AS tr
        INNER JOIN patients AS p ON tr.patient_id = p.id
        INNER JOIN test_register_tests AS trt ON tr.id = trt.test_register_id
        INNER JOIN tests AS t ON trt.test_id = t.id
        LEFT JOIN doctors AS d ON trt.doctor_id = d.id
        WHERE tr.id = $1;
    `;

    const { rows } = await pool.query(query, [testRegisterId]);

    if (rows.length === 0) {
        return null;
    }

    const registration: Registration = {
        id: rows[0].test_register_id,
        date: rows[0].date,
        patient: {
            id: rows[0].patient_id,
            name: rows[0].patient_name,
            gender: rows[0].patient_gender,
            date_of_birth: rows[0].patient_date_of_birth,
            contact_number: rows[0].patient_contact_number,
        },
        ref_number: rows[0].ref_number,
        total_cost: rows[0].total_cost,
        paid_price: rows[0].paid_price,
        registeredTests: rows.map(row => ({
            test: {
                id: row.test_id,
                name: row.test_name,
                code: row.test_code,
                price: row.test_price,
            },
            doctor: row.doctor_id
                ? {
                    id: row.doctor_id,
                    name: row.doctor_name,
                }
                : null,
            data: row.data,
            data_added: row.data_added,
            printed: row.printed,
        })),
    };

    return registration;
}
export async function updateTestRegister(data: {
    id: number;
    patientId: number;
    doctorId: number | null;
    refNumber: number | null;
    date: Date;
    testIds: number[];
    dataAddedTestIds: number[];
    previousTestIds: number[];
    totalCost: number;
    paidPrice: number;
}) {
    const { id, patientId, doctorId, refNumber, date, testIds, dataAddedTestIds, previousTestIds, totalCost, paidPrice } = data;
    const dateOfTest = formatISO(date, { representation: "date" });

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Update test register details
        await client.query(
            `
            UPDATE test_register
            SET "patient_id" = $1, "ref_number" = $2, "date" = $3, "total_cost" = $4, "paid_price" = $5
            WHERE "id" = $6;
            `,
            [patientId, refNumber || null, dateOfTest, totalCost, paidPrice, id]
        );

        const dataEmptyTestsToRemove = previousTestIds.filter(
            testId => !dataAddedTestIds.includes(testId)
        );

        if (dataEmptyTestsToRemove.length > 0) {
            await client.query(
                `
                DELETE FROM test_register_tests
                WHERE "test_register_id" = $1 AND "test_id" = ANY($2::int[]);
                `,
                [id, dataEmptyTestsToRemove]
            );
        }

        // Identify tests to add (new or edited tests)
        const testsToAdd = testIds.filter(testId => !dataAddedTestIds.includes(testId));
        const testRegisterTestsValues = testsToAdd
            .map(testId => `(${id}, ${testId}, ${doctorId || 'NULL'})`)
            .join(',');

        if (testsToAdd.length > 0) {
            await client.query(
                `
                INSERT INTO test_register_tests ("test_register_id", "test_id", "doctor_id")
                VALUES ${testRegisterTestsValues};
                `
            );
        }

        await client.query('COMMIT');

        return { success: true };
    } catch (error: any) {
        await client.query('ROLLBACK');
        throw new Error(`Transaction failed: ${error.message}`);
    } finally {
        client.release();
    }
}
