import { run, Workflow, Test } from "@stepci/runner";
import { nanoid } from "nanoid";
import { expect, it } from "vitest";
import { config } from "src/tests/functions/utils";

const create = (organization_id: string): Test => {
  return {
    steps: [
      {
        name: "Create organization",
        http: {
          url: "/api/v1/organizations",
          method: "POST",
          json: {
            organization_id,
            name: "Rekishi",
            avatar:
              "https://gravatar.com/avatar/fb3ace824d8755df27cbbe2adf0dbcc9?s=400&d=robohash&r=x",
          },
          check: {
            status: 200,
            jsonpath: {
              organization_id: organization_id,
              name: "Rekishi",
              avatar:
                "https://gravatar.com/avatar/fb3ace824d8755df27cbbe2adf0dbcc9?s=400&d=robohash&r=x",
            },
          },
        },
      },
    ],
  };
};

const update = (organization_id: string): Test => {
  return {
    steps: [
      {
        name: "Create organization",
        http: {
          url: "/api/v1/organizations",
          method: "POST",
          json: {
            organization_id,
            name: "Rekishi inc",
            avatar:
              "https://gravatar.com/avatar/fb3ace824d8755df27cbbe2adf0dbcc9?s=400&d=robohash&r=x",
          },
          check: {
            status: 200,
            jsonpath: {
              organization_id,
              name: "Rekishi inc",
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
  const organization_id = nanoid();

  const workflow: Workflow = {
    name: "Create organization",
    version: "1",
    config,
    tests: {
      create: create(organization_id),
      update: update(organization_id),
    },
  };
  const { result } = await run(workflow);
  expect(result.passed).toBe(true);
});
