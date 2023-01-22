import { run, Workflow, Test } from "@stepci/runner";
import { nanoid } from "nanoid";
import { expect, it } from "vitest";
import { config } from "src/tests/functions/utils";

const create = (org_id: string): Test => {
  return {
    steps: [
      {
        name: "Create user",
        http: {
          url: "/api/v1/users",
          method: "POST",
          json: {
            org_id,
            user_id: "user_id",
            name: "Rekishi user",
            avatar:
              "https://gravatar.com/avatar/fb3ace824d8755df27cbbe2adf0dbcc9?s=400&d=robohash&r=x",
          },
          check: {
            status: 200,
            jsonpath: {
              user_id: "user_id",
              name: "Rekishi user",
              avatar:
                "https://gravatar.com/avatar/fb3ace824d8755df27cbbe2adf0dbcc9?s=400&d=robohash&r=x",
            },
          },
        },
      },
    ],
  };
};

const noExistOrganiaztion: Test = {
  steps: [
    {
      name: "Create user",
      http: {
        url: "/api/v1/users",
        method: "POST",
        json: {
          org_id: "dummy_org_id",
          user_id: "user_id",
          name: "Rekishi user",
          avatar:
            "https://gravatar.com/avatar/fb3ace824d8755df27cbbe2adf0dbcc9?s=400&d=robohash&r=x",
        },
        check: {
          status: 404,
          jsonpath: {
            message: "No such organization 'dummy_org_id'",
          },
        },
      },
    },
  ],
};

it("Users", async () => {
  // TODO
  const org_id = "CfPFd1wE6ssPjHhQrK6FD";

  const workflow: Workflow = {
    name: "Create user",
    version: "1",
    config,
    tests: {
      create: create(org_id),
      noExistOrganiaztion,
    },
  };
  const { result } = await run(workflow);
  expect(result.passed).toBe(true);
});
