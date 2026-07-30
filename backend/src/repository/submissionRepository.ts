import {prisma} from "../config/prisma.js";
export async function getAllsubmissions() {
    const submissions = await prisma.submission.findMany();
    return submissions;
}