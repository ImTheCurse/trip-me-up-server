import {sql} from "../../index.js";
import * as jwt from "jsonwebtoken"


export async function getUser(req,res){
    const {username, password } = req.body;
    try{
        const users = await sql`
            select name,email,username from users where 
            username like ${username} and password like ${password}
        `

        if (users.length === 0){
            return res.status(400).send()
        }

        return res.status(200).send(users[0])
    }catch(err){
        console.error(err)
        return res.status(400)
    }
}
