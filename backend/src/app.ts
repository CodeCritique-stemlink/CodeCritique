import express, { type Request, type Response } from "express";
import { clerkMiddleware } from '@clerk/express'

const app = express();
const PORT =3000;
app.use(express.json());
app.use(clerkMiddleware());

app.listen(PORT, ()=> {
    console.log(`Server is running on ⚡ http://localhost:${PORT}`);
})