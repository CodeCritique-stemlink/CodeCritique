import "dotenv/config";
import express, { type Request, type Response } from "express";
import { clerkMiddleware } from '@clerk/express';
import globalRouter from "./routes/index.js";
import cors from "cors";

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(express.json());

app.use(cors({
origin: "http://localhost:3000",
credentials: true,
}));
// app.use(cors({
//   origin: (origin, callback) => {
  
//     if (!origin || origin.startsWith("http://localhost:") || origin.endsWith(".vercel.app")) {
//       callback(null, true);
//     } else {
//       callback(null, true); 
//     }
//   },
//   credentials: true,
// }));


app.use(clerkMiddleware({}));

app.use("/api", globalRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.listen(PORT, "0.0.0.0",() => {
    console.log(`Server is running on ⚡ http://localhost:${PORT}`);
});