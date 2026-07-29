import "dotenv/config";
import express, { type Request, type Response } from "express";
import { clerkMiddleware } from '@clerk/express'
import globalRouter from "./routes/index.js";

const app = express();
const PORT =3000;
app.use(express.json());

app.use(clerkMiddleware());

app.use("/api", globalRouter);

app.listen(PORT, ()=> {
    console.log(`Server is running on ⚡ http://localhost:${PORT}`);
})