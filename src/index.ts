import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { ContentModel, UserModel } from "./db";
import { z } from "zod";
import bcrypt from "bcrypt";
import { AuthRequest, userMiddleware } from "./middleware";


const app = express();
app.use(express.json());

//Validation object
const validSchema = z.object({
    username : z.string().min(3,"Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

app.post("/api/v1/signup", async (req,res) => {

    try{
        //Validating inputs
        const {username, password}= validSchema.parse(req.body);

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

app.post("/api/v1/signin", async (req,res) => {
    try{
        //Validating inputs
        const {username, password}= validSchema.parse(req.body);

        const user = await UserModel.findOne({username});

        if(!user){
            return res.status(401).json({
                message: "Invalid username or password",
            })
        }

        //Comparing the hashedpassword
        const isPasswordvalid= await bcrypt.compare(password, user.password as string);

        if(!isPasswordvalid){
            return res.status(401).json({
                message: "Invalid username or password",
            })
        }

        const token = jwt.sign( {userId: user._id}, process.env.JWT_SECRET as string);

        return res.json({
            token
        });



    }catch(e){
        if(e instanceof z.ZodError){
            return res.status(401).json({
                message: "Invalid username or password",
            })
        }

        return res.status(500).json({
            message: "Internal Server Error."
        })
    }
});

app.post("/api/v1/content", userMiddleware, async (req: AuthRequest,res) => {
    try {
        const { link, type, title, tags } = req.body;

        const content = await ContentModel.create({
        link,
        type,
        title,
        tags,
        userId: req.userId, // attach the logged-in user
        });

        return res.json({
        message: "Content created successfully",
        });
    } catch (err) {
        return res.status(500).json({ message: "Failed to create content", error: err });
    }
});

app.get("/api/v1/content", userMiddleware, async (req: AuthRequest,res) => {

    const userId= req.userId;
    const content= await ContentModel.find({userId: userId}).populate("userId", "username");

    res.json({ content });
});

app.delete("/api/v1/content", userMiddleware, async (req: AuthRequest,res) => {
    const contentId= req.body.contentId;

    await ContentModel.deleteMany({
        contentId: contentId,
        userId: req.userId
    })
    res.json({ message: "Content deleted" });
});

app.post("/api/v1/brain/share", (req,res) => {
    res.json({ message: "Brain shared!" });
});

app.post("/api/v1/brain/:shareLink", (req,res) => {
    res.json({ message: `Brain link: ${req.params.shareLink}` });
});


app.listen(3000);