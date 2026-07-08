import pool from '../config/db.js'
import logger from '../config/logger.js';
import { sendEmail } from '../services/emailService.js';
import bcrypt from 'bcrypt'

export const createAccount=async(req, res)=>{
    const { fname, lname, email, password } = req.body

    // Validate fields
    if(!fname || !lname || !email || !password){
        logger.warn("All fields are required")
        return res.status(400).json({
            message:"All fields are required"
        });

    }

    // Check existing email
    const existingUser = await pool.query(`SELECT id FROM users WHERE email=$1`,[email]);
    if(existingUser.rows.length > 0){  
        logger.warn("Email already exists") 
        return res.status(409).json({
            message:"Email already exists"
        });
    }

    try {
        //Get default role
        const roles= await pool.query(`SELECT id, name FROM roles WHERE name='Visitor'`);
        const role=roles.rows[0]

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password,saltRounds);

        //store user data
        const result = await pool.query(`INSERT INTO users(role_id,first_name,last_name,email,password_hash) VALUES($1,$2,$3,$4,$5) RETURNING id,first_name,last_name,email,role_id`,[role.id,fname,lname,email,passwordHash]);

        logger.info("Account created successfully")

        await sendEmail({
            to: email,
            subject: "👏 Account Created Successfully",
            template: 'account-created',
            data: {
                name: fname + ' ' + lname,
                email: email,
                role: role.name,
                loginUrl: 'http://localhost:5173/login'
            }
        })

        return res.status(201).json({
            message:"Account created successfully",
            user:result.rows[0]
        });
    } catch (error) {
        logger.error("Create Account Error:")
        logger.error(error.message)
        res.status(500).json({
            message:"Internal server error",
            errorMessage: error.message
        });
    }

}