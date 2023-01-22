import { run, Workflow, Test } from "@stepci/runner";
import { expect, it } from "vitest";
import { config } from "src/tests/functions/utils";

const create = (organization_id: string): Test => {
  return {
    steps: [
      {
        name: "Create user",
        http: {
          url: "/api/v1/users",
          method: "POST",
          json: {
            organization_id,
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
          organization_id: "dummy_org_id",
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
  const organization_id = "NqD_ePpO2Dvkvq11xxsssxxQjcq-ms";

  const workflow: Workflow = {
    name: "Create user",
    version: "1",
    config,
    tests: {
      create: create(organization_id),
      noExistOrganiaztion,
    },
  };
  const { result } = await run(workflow);
  expect(result.passed).toBe(true);
});
