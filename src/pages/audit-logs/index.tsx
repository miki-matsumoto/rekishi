import { Button, Text } from "@tremor/react";
import { trpc } from "src/lib/trpc";
import { useRouter } from "@tanstack/react-router";

export const AuditLogsPage = () => {
  const { navigate } = useRouter();
  const { data, isLoading } = trpc.hello.useQuery(
    // @ts-ignore
    {},
    {
      onError({ data }) {
        if (data?.code === "UNAUTHORIZED") {
          navigate({ to: "/expired" });
        }
      },
    }
  );
  if (isLoading) return <>Loading.....</>;

  return (
    <div>
      <div className="border-b-gray-200 border">
        <div className="my-0 mx-auto max-w-5xl h-16 flex justify-between items-center">
          <Button
            text="Back to App"
            color="gray"
            importance="secondary"
            size="sm"
          />
          <Text>Powerd by Rekishi</Text>
          <Text>{data?.hello}</Text>
        </div>
      </div>
    </div>
  );
};
