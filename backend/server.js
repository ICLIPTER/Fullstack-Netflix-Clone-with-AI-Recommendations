import express from 'express';
import dotenv from 'dotenv';
import { connectToDB } from './config/db.js';
import User from './models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import cors from 'cors';




dotenv.config();

const bcrypt = bcryptjs;
const app = express();

// Middlewares

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hey Buddy! Welcome to the backend server.');
});

app.post('/api/signup', async (req, res) => {
const {username, email, password} = req.body;

try{
    if(!username || !email || !password){
        throw new Error("All feilds are required");
    }

    const emailExists = await User.findOne({email});

    if(emailExists){
        return res.status(400).json({ messege: "email already exists"})
    }

     const usernameExists = await User.findOne({username});

    if(usernameExists){
        return res.status(400).json({ messege: "Username is taken try another name"})
    }
    
    const hashedPassword = await bcrypt.hash(password, 10)

    const userDoc = await User.create({
        username,
        email,
        password: hashedPassword
    });

    //JWT

    if(userDoc){
        const token = jwt.sign({ id: userDoc._id },
            process.env.JWT_SECRET,{
                expiresIn:'7d',
            });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",

    });
    }
    
 return res.status(201).json({ message: userDoc, message: "User created successfully" });
} catch (error) {

    res.status(400).json({message: error.message});
}
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await bcryptjs.compare(password, userDoc.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    //JWT
    const token = jwt.sign({ id: userDoc._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Login successful", user: userDoc });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

app.get('/api/fetch-user', async (req, res) => {
    const { token } = req.cookies;

    if(!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded || !decoded.id) {
         return res.status(401).json({ message: "No token provided" });
    }

      const userDoc = await User.findById(decoded.id).select("-password");

    if(!userDoc) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: userDoc });
    } catch (error) {
        console.error("Error fetching user:", error.message);
        res.status(500).json({ message: "Server error. Please try again." });
        
    }

});

app.post('/api/logout', async (req, res) => {
    res.clearCookie("token"); 
    res.status(200).json({ message: "Logged out successful" });
});


app.listen(PORT, () => {
    connectToDB();
    console.log(`Server is running on http://localhost:${PORT}`);
});