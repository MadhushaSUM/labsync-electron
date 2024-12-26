import pkg from 'pg';
import dotenv from 'dotenv';


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
export async function getPatients() {
    const result = await pool.query('SELECT * FROM patients');
    return result.rows as Patient[];
}

export async function insertPatient(patient: Omit<Patient, 'id'>) {
    const { name, date_of_birth, gender, contact_number } = patient;
    await pool.query('INSERT INTO patients (name, date_of_birth, gender, contact_number) VALUES ($1, $2, $3, $4)', [name, date_of_birth, gender, contact_number]);
}

export async function updatePatient(patient: Patient) {
    const { id, name, date_of_birth, gender, contact_number } = patient;
    await pool.query('UPDATE patients SET name = $1, date_of_birth = $2, gender = $3, contact_number = $4 WHERE id = $5', [name, date_of_birth, gender, contact_number, id]);
}

export async function deletePatient(id: number) {
    await pool.query('DELETE FROM patients WHERE id = $1', [id]);
}
