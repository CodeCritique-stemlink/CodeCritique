import {getAllsubmissions} from "../repository/submissionRepository.js";
export async function getAllSubmissionsService() {
    const submissions = await getAllsubmissions();
    return submissions;
}