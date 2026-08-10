import { prisma } from "../config/prisma.js";

export async function getAllSubmissions() {
    const submissions = await prisma.submission.findMany();
    return submissions;
}