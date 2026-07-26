/*
  Warnings:

  - The values [APPROVED,REJECTED] on the enum `SubmissionStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SubmissionStatus_new" AS ENUM ('PENDING', 'REVIEWED');
ALTER TABLE "public"."submissions" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "submissions" ALTER COLUMN "status" TYPE "SubmissionStatus_new" USING ("status"::text::"SubmissionStatus_new");
ALTER TYPE "SubmissionStatus" RENAME TO "SubmissionStatus_old";
ALTER TYPE "SubmissionStatus_new" RENAME TO "SubmissionStatus";
DROP TYPE "public"."SubmissionStatus_old";
ALTER TABLE "submissions" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- CreateTable
CREATE TABLE "review_criteria" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "submissionId" INTEGER NOT NULL,

    CONSTRAINT "review_criteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ratings" (
    "id" SERIAL NOT NULL,
    "score" INTEGER NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "criteriaId" INTEGER NOT NULL,

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "review_criteria" ADD CONSTRAINT "review_criteria_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_criteriaId_fkey" FOREIGN KEY ("criteriaId") REFERENCES "review_criteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;
