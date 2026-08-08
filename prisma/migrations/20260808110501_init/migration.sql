-- CreateTable
CREATE TABLE "ChildProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "displayName" TEXT NOT NULL,
    "ageBand" TEXT NOT NULL,
    "sensoryMode" TEXT NOT NULL DEFAULT 'balanced',
    "interestPack" TEXT NOT NULL DEFAULT 'space',
    "dyslexiaFont" BOOLEAN NOT NULL DEFAULT false,
    "soundEnabled" BOOLEAN NOT NULL DEFAULT true,
    "motionEnabled" BOOLEAN NOT NULL DEFAULT true,
    "celebrationLevel" TEXT NOT NULL DEFAULT 'medium',
    "sessionMinutes" INTEGER NOT NULL DEFAULT 15,
    "placed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SkillMastery" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "childId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "alpha" REAL NOT NULL DEFAULT 1,
    "beta" REAL NOT NULL DEFAULT 1,
    "level" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SkillMastery_childId_fkey" FOREIGN KEY ("childId") REFERENCES "ChildProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "childId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "moodStart" TEXT,
    "moodEnd" TEXT,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" DATETIME,
    "itemsPlanned" INTEGER NOT NULL DEFAULT 0,
    "itemsDone" INTEGER NOT NULL DEFAULT 0,
    "adaptations" INTEGER NOT NULL DEFAULT 0,
    "summaryJson" TEXT NOT NULL DEFAULT '{}',
    CONSTRAINT "Session_childId_fkey" FOREIGN KEY ("childId") REFERENCES "ChildProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LearnerEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "childId" TEXT NOT NULL,
    "sessionId" TEXT,
    "type" TEXT NOT NULL,
    "payload" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LearnerEvent_childId_fkey" FOREIGN KEY ("childId") REFERENCES "ChildProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LearnerEvent_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "SkillMastery_childId_idx" ON "SkillMastery"("childId");

-- CreateIndex
CREATE UNIQUE INDEX "SkillMastery_childId_skillId_key" ON "SkillMastery"("childId", "skillId");

-- CreateIndex
CREATE INDEX "LearnerEvent_childId_createdAt_idx" ON "LearnerEvent"("childId", "createdAt");

-- CreateIndex
CREATE INDEX "LearnerEvent_sessionId_idx" ON "LearnerEvent"("sessionId");
