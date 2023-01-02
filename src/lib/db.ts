import { z } from "zod";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";

// Organization
const organizationTable = z.object({
  id: z.string(),
  org_id: z.string(),
  name: z.string().optional(),
  avatar: z.string().url().optional(),
});
type OrganizationTable = z.infer<typeof organizationTable>;

// User
const userTable = z.object({
  id: z.string(),
  organization_id: z.string(),
  user_id: z.string(),
  avatar: z.string().url().optional(),
  name: z.string().url().optional(),
});
type UserTable = z.infer<typeof userTable>;

// Target
const targetTable = z.object({
  id: z.string(),
  name: z.string(),
});
type TargetTable = z.infer<typeof targetTable>;

// Action
const actionTable = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string().optional(),
});
type ActionTable = z.infer<typeof actionTable>;

// Target on Action
const targetsOnActionsTable = z.object({
  target_id: z.string(),
  action_id: z.string(),
});
type TargetsOnActionTable = z.infer<typeof targetsOnActionsTable>;

// Audit log
const auditLogTable = z.object({
  id: z.string(),
  occurred_at: z.string(),
  user_id: z.string(),
  context_id: z.string(),
  action_id: z.string(),
});
type AuditLogTable = z.infer<typeof auditLogTable>;

// Context
const contextTable = z.object({
  id: z.string(),
  location: z.string().optional(),
  user_agent: z.string().optional(),
});
type ContextTable = z.infer<typeof contextTable>;

// Event Target
const eventTargetTable = z.object({
  id: z.string(),
  target_id: z.string(),
  audit_log_id: z.string(),
});
type EventTargetTable = z.infer<typeof eventTargetTable>;

type Database = {
  organizations: OrganizationTable;
  users: UserTable;
  actions: ActionTable;
  targets: TargetTable;
  targets_on_actions: TargetsOnActionTable;
  audit_logs: AuditLogTable;
  context: ContextTable;
  event_target: EventTargetTable;
};

export const database = (d1: D1Database) =>
  new Kysely<Database>({ dialect: new D1Dialect({ database: d1 }) });
