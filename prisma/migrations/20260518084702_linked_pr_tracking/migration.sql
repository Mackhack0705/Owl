-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "hasLinkedPr" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "linkedPrState" TEXT,
ADD COLUMN     "linkedPrUrl" TEXT;
