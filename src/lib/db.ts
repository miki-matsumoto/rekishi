import { z } from "zod";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";

const organizationTable = z.object({
  id: z.string(),
  org_id: z.string(),
  name: z.string().optional(),
  avatar: z.string().url().optional(),
});

type OrganizationTable = z.infer<typeof organizationTable>;

const userTable = z.object({
  id: z.string(),
  organization_id: z.string(),
  user_id: z.string(),
  avatar: z.string().url().optional(),
  name: z.string().url().optional(),
});

type UserTable = z.infer<typeof userTable>;

const targetTable = z.object({
  id: z.string(),
  name: z.string(),
});

type TargetTable = z.infer<typeof targetTable>;

const actionTable = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string().optional(),
});

type ActionTable = z.infer<typeof actionTable>;

const targetsOnActionsTable = z.object({
  target_id: z.string(),
  action_id: z.string(),
});
type TargetsOnActionTable = z.infer<typeof targetsOnActionsTable>;

type Database = {
  organizations: OrganizationTable;
  users: UserTable;
  actions: ActionTable;
  targets: TargetTable;
  targets_on_actions: TargetsOnActionTable;
};

export const database = (d1: D1Database) =>
  new Kysely<Database>({ dialect: new D1Dialect({ database: d1 }) });
