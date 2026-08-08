-- CreateTable
CREATE TABLE "ParentAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'trial',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "LessonProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "childId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'locked',
    "score" REAL NOT NULL DEFAULT 0,
    "completedAt" DATETIME,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LessonProgress_childId_fkey" FOREIGN KEY ("childId") REFERENCES "ChildProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChildProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "parentId" TEXT,
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
    "currentUnitId" TEXT NOT NULL DEFAULT 'unit.read.1',
    "streakDays" INTEGER NOT NULL DEFAULT 0,
    "bestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastPracticeDate" TEXT,
    "totalMinutes" INTEGER NOT NULL DEFAULT 0,
    "stars" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ChildProfile_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ParentAccount" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ChildProfile" ("ageBand", "celebrationLevel", "createdAt", "displayName", "dyslexiaFont", "id", "interestPack", "motionEnabled", "placed", "sensoryMode", "sessionMinutes", "soundEnabled", "updatedAt") SELECT "ageBand", "celebrationLevel", "createdAt", "displayName", "dyslexiaFont", "id", "interestPack", "motionEnabled", "placed", "sensoryMode", "sessionMinutes", "soundEnabled", "updatedAt" FROM "ChildProfile";
DROP TABLE "ChildProfile";
ALTER TABLE "new_ChildProfile" RENAME TO "ChildProfile";
CREATE TABLE "new_Session" (
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
    "starsEarned" INTEGER NOT NULL DEFAULT 0,
    "summaryJson" TEXT NOT NULL DEFAULT '{}',
    CONSTRAINT "Session_childId_fkey" FOREIGN KEY ("childId") REFERENCES "ChildProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("adaptations", "childId", "domain", "endedAt", "id", "itemsDone", "itemsPlanned", "moodEnd", "moodStart", "startedAt", "summaryJson") SELECT "adaptations", "childId", "domain", "endedAt", "id", "itemsDone", "itemsPlanned", "moodEnd", "moodStart", "startedAt", "summaryJson" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ParentAccount_email_key" ON "ParentAccount"("email");

-- CreateIndex
CREATE INDEX "LessonProgress_childId_unitId_idx" ON "LessonProgress"("childId", "unitId");

-- CreateIndex
CREATE UNIQUE INDEX "LessonProgress_childId_lessonId_key" ON "LessonProgress"("childId", "lessonId");
