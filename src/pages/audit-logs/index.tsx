import { trpc } from "src/lib/trpc";
import { Link, useRouter } from "@tanstack/react-router";
import { Button } from "src/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Outputs } from "src/server/trpc";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";

type AuditLog = Outputs["auditLogEvents"][0];

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
  if (!data) return null;

  return (
    <div>
      <Header />
      <Table auditLogs={data} />
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

type Props = {
  auditLogs: AuditLog[];
};

const Table = ({ auditLogs }: Props) => (
  <div className="relative overflow-x-auto sm:rounded-md max-w-5xl mx-auto border-t border-l border-r my-6">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <TableHeader />
      <tbody>
        {auditLogs.map(({ user, id, action }) => (
          <tr
            key={id}
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer group"
          >
            <th
              scope="row"
              className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
            >
              <Avatar>
                <AvatarImage />
                <AvatarFallback>
                  {user.name ? user.name[0] : "k"}
                </AvatarFallback>
              </Avatar>
              <div className="pl-3">
                <div className="text-base font-medium">{user.name}</div>
                <div className="font-normal text-gray-500 text-xs">
                  neil.sims@flowbite.com
                </div>
              </div>
            </th>
            <td className="px-6 py-4">
              <div>
                <div className="text-base font-medium text-gray-900">
                  {action.title}
                </div>
                <code className="relative rounded bg-slate-100 py-[0.2rem] px-[0.3rem] font-mono text-xs font-normaltext-slate-900 dark:bg-slate-800 dark:text-slate-400">
                  {action.name}
                </code>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center">
                <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>{" "}
                Online
              </div>
            </td>
            <td className="px-6 py-4 opacity-0 group-hover:opacity-100">
              <a
                href="#"
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >
                View detail
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const TableHeader = () => (
  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
    <tr>
      <th scope="col" className="px-6 py-3">
        Event
      </th>
      <th scope="col" className="px-6 py-3">
        Actor
      </th>
      <th scope="col" className="px-6 py-3">
        Date
      </th>
      <th scope="col" className="px-6 py-3"></th>
    </tr>
  </thead>
);
