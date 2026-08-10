/*
  Warnings:

  - A unique constraint covering the columns `[submissionId,name]` on the table `review_criteria` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "review_criteria_submissionId_name_key" ON "review_criteria"("submissionId", "name");
