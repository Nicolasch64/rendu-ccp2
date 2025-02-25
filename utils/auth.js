const bcrypt=require ('bcryptjs');
const jwt =require ('jsonwebtoken');
const sqlite3=require ('sqlite3').verbose();
const dotenv= require ('dotenv');
dotenv.config();

const db = new sqlite3.Database("./plateforme_msision.db");

const inscription=(req,res)=>{
    const{nom,email,motdepasse,role}=req.body;

    bcrypt.hash(motdepasse,10,(err,hashedmotdepasse)=>{
        if(err) return rmessage: es.status(500).json({'problème lors du hachage du mot de passe'});

        db.run()
    })
}