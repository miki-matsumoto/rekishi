import { trpc } from "src/lib/trpc";
import { Link, useRouter } from "@tanstack/react-router";
import { Outputs } from "src/server/trpc";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";

type AuditLog = Outputs["auditLogEvents"][0];

export default function AuditLogsPage() {
  const { navigate } = useRouter();
  const { data, isLoading } = trpc.auditLogEvents.useQuery(
    // @ts-ignore
    {},
    {
      onError({ data }) {
        console.log(data);
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
      <div className="max-w-5xl mx-auto">
        <h3 className="my-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          Audit Logs
        </h3>
        <Table auditLogs={data} />
      </div>
    </div>
  );
}

type Props = {
  auditLogs: AuditLog[];
};

const Table = ({ auditLogs }: Props) => (
  <div className="relative overflow-x-auto sm:rounded-md border-t border-l border-r">
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
              <Link
                to="/audit-logs/events/$event"
                params={{ event: id }}
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >
                View detail
              </Link>
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
