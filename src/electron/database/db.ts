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

export async function updatePatient(patient: Patient) {
    const { id, name, date_of_birth, gender, contact_number } = patient;
    await pool.query('UPDATE patients SET name = $1, date_of_birth = $2, gender = $3, contact_number = $4 WHERE id = $5', [name, date_of_birth, gender, contact_number, id]);
}

export async function deletePatient(id: number) {
    await pool.query('DELETE FROM patients WHERE id = $1', [id]);
}
