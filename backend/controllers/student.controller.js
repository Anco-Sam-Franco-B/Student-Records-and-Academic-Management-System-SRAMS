import pool from "../config/db.js";
import {
    generateAdmissionNumber
} from "../utils/admissionNumber.js";

export const createStudent = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            gender,
            date_of_birth
        } = req.body;
        // Generate ADM Number
        const admissionNo = await generateAdmissionNumber();
        const result =await pool.query(
                `
                INSERT INTO students
                (
                    admission_no,
                    first_name,
                    last_name,
                    gender,
                    date_of_birth
                )
                VALUES($1,$2,$3,$4,$5)
                RETURNING *
                `, [admissionNo,first_name,last_name,gender,date_of_birth] );
        res.status(201).json({
            success: true,
            message: "Student created successfully",
            student: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message
        });
    }
};