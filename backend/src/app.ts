import express, { type Request, type Response } from "express";
// import { clerkMiddleware } from '@clerk/express';
import { getAllSubmissionsService } from "./service/submissionService.js";

const app = express();
const PORT = 3000;
app.use(express.json());
// app.use(clerkMiddleware());

app.get("/api/submissions", async (req: Request, res: Response) => {
    try {
        const submissions = await getAllSubmissionsService();
        res.json(submissions);
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch submissions" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on ⚡ http://localhost:${PORT}`);
});