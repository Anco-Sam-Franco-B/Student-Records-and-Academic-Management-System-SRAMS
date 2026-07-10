import pool from '../config/db.js'
import logger from '../config/logger.js';
import { sendEmail } from '../services/emailService.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

//Create new account
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

//Login
export const login = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {

        logger.warn("Email and password are required");

        return res.status(400).json({
            message: "Email and password are required"
        });

    }

    try {

        const result = await pool.query(
            `
            SELECT
                users.id,
                users.first_name,
                users.last_name,
                users.email,
                users.password_hash,
                users.role_id,
                roles.name AS role
            FROM users
            LEFT JOIN roles
            ON users.role_id = roles.id
            WHERE users.email = $1
            `,
            [email]
        );

        if (result.rows.length === 0) {

            logger.warn("Invalid credentials");

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }

        const user = result.rows[0];

        const validPassword = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!validPassword) {

            logger.warn("Invalid password");

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }

        const accessToken = jwt.sign(
            {
                id: user.id,
                role: user.role,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        logger.info(`${user.email} logged in`);

        return res.status(200).json({

            message: "Login successful",

            user: {

                id: user.id,

                first_name: user.first_name,

                last_name: user.last_name,

                email: user.email,

                role: user.role

            }

        });

    } catch (error) {

        logger.error(error.message);

        return res.status(500).json({

            message: "Internal Server Error"

        });

    }

};

//Logout
export const logout = (req, res) => {

    res.clearCookie("accessToken", {

        httpOnly: true,

        sameSite: "lax",

        secure: process.env.NODE_ENV === "production"

    });

    return res.status(200).json({

        message: "Logged out successfully"

    });

};

//Get Current User Info
export const getCurrentUser = async (req, res) => {

    try {

        const result = await pool.query(

            `
            SELECT
                users.id,
                users.first_name,
                users.last_name,
                users.email,
                roles.name AS role
            FROM users
            LEFT JOIN roles
            ON roles.id = users.role_id
            WHERE users.id = $1
            `,

            [req.user.id]

        );

        res.status(200).json({

            user: result.rows[0]

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};