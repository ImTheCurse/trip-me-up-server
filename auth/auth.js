import  jwt  from "jsonwebtoken";
import {sql} from "../index.js";
import * as bcrypt from "bcrypt"

export async function registerUser(req, res) {
  const { name, email, username, password } = req.body;

  if (!name || !email || !username || !password) {
    return res.status(400).send("All fields are required.");
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store user in the database
    const result = await sql`
      INSERT INTO users (name, username, email, password)
      VALUES (${name}, ${username}, ${email}, ${hashedPassword})
      RETURNING id;
    `;

    if (result.length === 0) {
      return res.status(400).send("User registration failed.");
    }

    // Generate a token for the user
    const token = jwt.sign({ id: result[0].id, username }, process.env.JWT_SECRET);

    // Set token as a cookie
    res.cookie("tmu-token", token, { httpOnly: true, secure: true });
    res.status(201).send("User registered successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error.");
  }
}

// Authenticate Token Middleware
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send("Authorization failed. No access token.");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(403).send("Token verification failed.");
    }
    req.user = user;
    next();
  });
};

// Login User
export async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required.");
  }

  try {
    // Fetch the user from the database
    const result = await sql`
      SELECT id, password FROM users WHERE username = ${username};
    `;

    if (result.length === 0) {
      return res.status(401).send("Invalid username or password.");
    }

    const user = result[0];

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send({err:"Invalid username or password."});
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET);

    // Set token as a cookie
    res.cookie("tmu-token", token, { httpOnly: true, secure: true,sameSite:'None' });
    res.status(200).send({err:""});
  } catch (err) {
    console.error(err);
    res.status(500).send({err:"Server error."});
  }
}

// Function to get user information from JWT
export function getUserFromJWT(req,res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).send({err:"No jwt provided."}) 
    return;
  }

  try {
    // Verify and decode the token
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).send(decodedUser)
  } catch (err) {
    console.error("Invalid or expired token:", err.message);
    res.status(500).send();
  }
}