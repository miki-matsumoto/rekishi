-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "org_id" TEXT NOT NULL,
    "name" TEXT,
    "avatar" TEXT
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "name" TEXT,
    "avatar" TEXT,
    "organization_id" TEXT NOT NULL,
    CONSTRAINT "users_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "occurred_at" DATETIME NOT NULL,
    "user_id" TEXT NOT NULL,
    "contextId" TEXT NOT NULL,
    "actionName" TEXT NOT NULL,
    CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "audit_logs_contextId_fkey" FOREIGN KEY ("contextId") REFERENCES "context" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "audit_logs_actionName_fkey" FOREIGN KEY ("actionName") REFERENCES "actions" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "actions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "title" TEXT
);

-- CreateTable
CREATE TABLE "targets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "targets_on_actions" (
    "target_id" TEXT NOT NULL,
    "action_id" TEXT NOT NULL,

    PRIMARY KEY ("target_id", "action_id"),
    CONSTRAINT "targets_on_actions_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "targets" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "targets_on_actions_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "actions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "context" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "location" TEXT,
    "user_agent" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_org_id_key" ON "organizations"("org_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_user_id_key" ON "users"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "actions_name_key" ON "actions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "targets_name_key" ON "targets"("name");

