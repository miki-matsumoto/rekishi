import { trpc } from "src/lib/trpc";
import { Link, useRouter } from "@tanstack/react-router";
import { Button } from "src/components/ui/button";
import { ChevronLeft } from "lucide-react";

export const AuditLogsPage = () => {
  const { navigate } = useRouter();
  const { data, isLoading } = trpc.auditLogEvents.useQuery(
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
      <Header />
    </div>
  );
};

const Header = () => (
  <div className="border-b-gray-200 border">
    <div className="my-0 mx-auto max-w-5xl h-16 flex justify-between items-center">
      <Button variant="outline" size="sm">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to App
      </Button>
      <small className="text-sm font-medium leading-none">
        Powerd by Rekishi
      </small>
    </div>
  </div>
);
