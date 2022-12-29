import { z } from "zod";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";

const organizationTable = z.object({
  id: z.string(),
  org_id: z.string(),
  name: z.string().optional(),
});

type OrganizationTable = z.infer<typeof organizationTable>;

type Database = {
  organizations: OrganizationTable;
};

export const database = (d1: D1Database) =>
  new Kysely<Database>({ dialect: new D1Dialect({ database: d1 }) });
