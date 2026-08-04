import type { CreateSubmissionInput, GetSubmissionsQueryInput, UpdateSubmissionInput } from "../models/submission.schema.js";
import { SubmissionRepository } from "../repository/submission.repository.js";

const submissionRepository =new SubmissionRepository();

export class SubmissionService {
    async createSubmission(userId: number, data: CreateSubmissionInput){
        const submission = await submissionRepository.create(userId , data)
        return submission;
    }
    async getAllSubmissions(filters:GetSubmissionsQueryInput){
        return await submissionRepository.getAll(filters)
    }
    async getSubmissionById(id: number){
        const submission = await submissionRepository.findById(id);
        if(!submission){
            throw new Error("Submission not found")
        }
        return submission
    }
        async updateSubmission(id: number, userId: number, data: UpdateSubmissionInput) {
        const submission = await submissionRepository.findById(id);
        if (!submission) {
            throw new Error("Submission not found");
        }
        if (submission.userId !== userId) {
            throw new Error("You are not authorized to alter this submission");
        }
        return await submissionRepository.update(id, data);
    }
        async deleteSubmission(id: number, userId: number) {
        const submission = await submissionRepository.findById(id);
        if (!submission) {
            throw new Error("Submission not found");
        }
        if (submission.userId !== userId) {
            throw new Error("You are not authorized to alter this submission");
        }
        return await submissionRepository.delete(id);
    }

}