import { run, Workflow, Test } from "@stepci/runner";
import { expect, it } from "vitest";
import { config } from "src/tests/functions/utils";

const create: Test = {
  steps: [
    {
      name: "Create target",
      http: {
        url: "/api/v1/targets",
        method: "POST",
        json: {
          name: "hello",
        },
        check: {
          status: 200,
          jsonpath: {
            name: "hello",
          },
        },
      },
    },
  ],
};

const emptyName: Test = {
  steps: [
    {
      http: {
        url: "/api/v1/targets",
        method: "POST",
        json: {
          name: "",
        },
        check: {
          status: 400,
        },
      },
    },
  ],
};

it("Targets", async () => {
  const workflow: Workflow = {
    name: "Create target",
    version: "1",
    config,
    tests: {
      create,
      emptyName,
    },
  };
  const { result } = await run(workflow);
  expect(result.passed).toBe(true);
});
