-- AlterTable
ALTER TABLE "EventType" ADD COLUMN     "bufferAfterMinutes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "bufferBeforeMinutes" INTEGER NOT NULL DEFAULT 0;
