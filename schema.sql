-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organization_id" TEXT NOT NULL,
    "name" TEXT,
    "avatar" TEXT,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "avatar" TEXT,
    "email" TEXT,
    "user_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "users_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "occurred_at" DATETIME NOT NULL,
    "user_id" TEXT,
    "context_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "action_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    CONSTRAINT "events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "events_context_id_fkey" FOREIGN KEY ("context_id") REFERENCES "context" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "events_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "events_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "actions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "event_target" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "event_target_id" TEXT NOT NULL,
    "audit_log_id" TEXT NOT NULL,
    "target_id" TEXT NOT NULL,
    CONSTRAINT "event_target_audit_log_id_fkey" FOREIGN KEY ("audit_log_id") REFERENCES "events" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "event_target_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "targets" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "actions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "title" TEXT,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "targets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "targets_on_actions" (
    "target_id" TEXT NOT NULL,
    "action_id" TEXT NOT NULL,
    CONSTRAINT "targets_on_actions_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "targets" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "targets_on_actions_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "actions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "context" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "location" TEXT,
    "user_agent" TEXT,
    "device" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_organization_id_key" ON "organizations"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_user_id_key" ON "users"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "events_context_id_key" ON "events"("context_id");

-- CreateIndex
CREATE UNIQUE INDEX "actions_code_key" ON "actions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "targets_name_key" ON "targets"("name");

-- CreateIndex
CREATE UNIQUE INDEX "targets_on_actions_target_id_action_id_key" ON "targets_on_actions"("target_id", "action_id");

