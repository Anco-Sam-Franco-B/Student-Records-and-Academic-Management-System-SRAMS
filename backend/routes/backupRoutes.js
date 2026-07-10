import express from "express";
import pool from "../config/db.js";
import path from "path";
import fs from "fs-extra";

import createBackup, {
    restoreBackup
} from "../cron/databaseBackup.js";


const BackupRouter = express.Router();



// Get all backups

BackupRouter.get("/", async(req,res)=>{

    try {

        const result =
        await pool.query(
            `
            SELECT *
            FROM database_backups
            ORDER BY created_at DESC
            `
        );


        res.json({

            success:true,
            data:result.rows

        });


    }catch(error){

        res.status(500)
        .json({

            success:false,
            message:error.message

        });

    }

});





// Trigger backup manually

BackupRouter.post("/trigger",async(req,res)=>{


    try {


        const backup =
        await createBackup();



        res.status(200)
        .json({

            success:true,

            message:
            "Database backup created successfully",

            data:backup

        });



    }catch(error){


        res.status(500)
        .json({

            success:false,

            message:error.message

        });


    }


});






// Download backup JSON file

BackupRouter.get(
"/download/:id",
async(req,res)=>{


try{


const result =
await pool.query(

`
SELECT 
file_name,
file_path

FROM database_backups

WHERE id=$1
`,

[
req.params.id
]

);



if(result.rows.length===0){

return res.status(404)
.json({

message:"Backup not found"

});


}



const backup =
result.rows[0];



res.download(

path.resolve(
backup.file_path
),

backup.file_name

);



}catch(error){


res.status(500)
.json({

message:error.message

});


}


});







// View JSON backup content

BackupRouter.get(
"/view/:id",
async(req,res)=>{


try{


const result =
await pool.query(

`
SELECT file_path

FROM database_backups

WHERE id=$1

`,

[
req.params.id
]

);



if(result.rows.length===0){

return res.status(404)
.json({

message:"Backup not found"

});

}





const backup =
await fs.readJson(
result.rows[0].file_path
);



res.json(backup);



}catch(error){


res.status(500)
.json({

message:error.message

});


}


});









// Restore backup

BackupRouter.post(
"/restore/:id",
async(req,res)=>{


try{


const result =
await pool.query(

`
SELECT file_path

FROM database_backups

WHERE id=$1

`,

[
req.params.id
]

);




if(result.rows.length===0){

return res.status(404)
.json({

message:"Backup not found"

});

}





await restoreBackup(
result.rows[0].file_path
);




res.json({

success:true,

message:
"Database restored successfully"

});





}catch(error){


res.status(500)
.json({

message:error.message

});


}


});




export default BackupRouter;