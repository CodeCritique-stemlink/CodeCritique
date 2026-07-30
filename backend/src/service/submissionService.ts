import { getAllSubmissions } from "../repository/submissionRepository.js";

export async function getAllSubmissionsService() {
    const submissions = await getAllSubmissions();
    return submissions;
}