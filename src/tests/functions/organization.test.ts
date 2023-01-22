import { run, Workflow, Test, WorkflowConfig } from "@stepci/runner";
import { nanoid } from "nanoid";
import { expect, it } from "vitest";

const config: WorkflowConfig = {
  http: { baseURL: "http://127.0.0.1:8788" },
};

const create = (org_id: string): Test => {
  return {
    steps: [
      {
        name: "Create organization",
        http: {
          url: "/api/v1/organizations",
          method: "POST",
          json: {
            org_id,
            name: "Rekishi",
            avatar:
              "https://gravatar.com/avatar/fb3ace824d8755df27cbbe2adf0dbcc9?s=400&d=robohash&r=x",
          },
          check: {
            status: 200,
            jsonpath: {
              "$.org_id": org_id,
              "$.name": "Rekishi",
              avatar:
                "https://gravatar.com/avatar/fb3ace824d8755df27cbbe2adf0dbcc9?s=400&d=robohash&r=x",
            },
          },
        },
      },
    ],
  };
};

const update = (org_id: string): Test => {
  return {
    steps: [
      {
        name: "Create organization",
        http: {
          url: "/api/v1/organizations",
          method: "POST",
          json: {
            org_id,
            name: "Rekishi inc",
            avatar:
              "https://gravatar.com/avatar/fb3ace824d8755df27cbbe2adf0dbcc9?s=400&d=robohash&r=x",
          },
          check: {
            status: 200,
            jsonpath: {
              "$.org_id": org_id,
              "$.name": "Rekishi inc",
              avatar:
                "https://gravatar.com/avatar/fb3ace824d8755df27cbbe2adf0dbcc9?s=400&d=robohash&r=x",
            },
          },
        },
      },
    ],
  };
};

it("Organization", async () => {
  const org_id = nanoid();

  const workflow: Workflow = {
    name: "Create organization",
    version: "1",
    config,
    tests: {
      create: create(org_id),
      update: update(org_id),
    },
  };
  const { result } = await run(workflow);
  expect(result.passed).toBe(true);
});
