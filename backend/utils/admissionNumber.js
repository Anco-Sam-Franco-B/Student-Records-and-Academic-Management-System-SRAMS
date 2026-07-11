import pool from "../config/db.js";

export const generateAdmissionNumber = async()=>{
    const year = new Date()
        .getFullYear();
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const result =
        await client.query(
        `
        SELECT last_number
        FROM admission_sequences
        WHERE admission_year=$1
        FOR UPDATE
        `,
        [
            year
        ]);
        let nextNumber;
        if(result.rows.length === 0){
            nextNumber = 1;
            await client.query(
            `
            INSERT INTO admission_sequences
            (
                admission_year,
                last_number
            )
            VALUES($1,$2)
            `,
            [
                year,
                nextNumber
            ]);
        }else{
            nextNumber =
            result.rows[0].last_number + 1;
            await client.query(
            `
            UPDATE admission_sequences
            SET last_number=$1
            WHERE admission_year=$2
            `,
            [
                nextNumber,
                year
            ]);
        }
        await client.query("COMMIT");
        return `ADM-${year}-${String(nextNumber).padStart(4,"0")}`;
    }catch(error){
        await client.query("ROLLBACK");
        throw error;
    }finally{
        client.release();
    }
};