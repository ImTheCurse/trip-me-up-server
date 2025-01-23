import  jwt  from "jsonwebtoken";
import {sql} from "../index.js";


export async function registerUser(req,res){
    const {name,email,username, password} = req.body;
    try{
        const passToken = jwt.sign({password},process.env.JWT_SECRET)
        const result = await sql`
            insert into users(name,username,email,password)
            values(${name},${username},${email},${passToken})
            returning id;
        `

        if(result.length == 0){
            res.status(400).send();
            return;
        }
        res.cookie('tmu-token',passToken);
        res.status(200).send();

    }catch(err){
        console.error(err);
    }
}

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
  
    //Extracting token from authorization header
    const token = authHeader && authHeader.split(" ")[1];
  
    //Checking if the token is null
    if (!token) {
      return res.status(401).send("Authorization failed. No access token.");
    }
  
    //Verifying if the token is valid.
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log(err);
        return res.status(403).send("Could not verify token");
      }
      req.user = user;
    });
    next();
  };