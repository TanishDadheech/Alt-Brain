import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { UserModel } from "./db";
import { z } from "zod";
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());

//Validation object
const signupSchema = z.object({
    username : z.string().min(3,"Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

app.post("/api/v1/signup", async (req,res) => {

    try{
        //Validating inputs
        const {username, password}= signupSchema.parse(req.body);

        //Hashing password
        const hashedPassword= await bcrypt.hash(password,5);

        await UserModel.create({
        username,
        password: hashedPassword //saving the hashed pssword in the database.
        });

        return res.json({
        message: "User Signed up!!"
        });
    }catch(e){

        if (e instanceof z.ZodError) {
      // Validation error
      return res.status(400).json({
        message: "Invalid input",
        errors: e.issues
      });
    }
       return res.status(411).json({
            message: "User already exists!"
        })
    }
});

app.post("/api/v1/signin", (req,res) => {
    const username = req.body.username;
    res.json({ message: `Hello ${username}, signed in!` });
});

app.post("/api/v1/content", (req,res) => {
    res.json({ message: "Content created" });
});

app.get("/api/v1/content", (req,res) => {
    res.json({ message: "Here is your content" });
});

app.delete("/api/v1/content", (req,res) => {
    res.json({ message: "Content deleted" });
});

app.post("/api/v1/brain/share", (req,res) => {
    res.json({ message: "Brain shared!" });
});

app.post("/api/v1/brain/:shareLink", (req,res) => {
    res.json({ message: `Brain link: ${req.params.shareLink}` });
});


app.listen(3000);