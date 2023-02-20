import { trpc } from "src/lib/trpc";
import { Link, useRouter } from "@tanstack/react-router";
import { Outputs } from "src/server/trpc";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import { Suspense } from "react";
import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { ListIcon } from "lucide-react";

type AuditLog = Outputs["auditLogEvents"][0];

export default function EventsPage() {
  return (
    <div>
      <div className="max-w-5xl mx-auto">
        <h3 className="my-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          Audit Logs
        </h3>
        <Suspense fallback={<EventTableSkelton />}>
          <EventTable />
        </Suspense>
      </div>
    </div>
  );
}

const EventTableSkelton = () => (
  <div className="max-w-5xl mx-auto">
    <div className="relative overflow-x-auto sm:rounded-md border-t border-l border-r">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <TableHeader />
        <tbody>
          {Array.from({ length: 10 }, (_, i) => i + 1).map(() => (
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 group animate-pulse">
              <th
                scope="row"
                className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
              >
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gray-200"></AvatarFallback>
                </Avatar>
                <div className="w-full pl-3 gap-1 inline-grid">
                  <p className="h-2.5 bg-gray-200 rounded-full w-full"></p>
                  <p className="h-1.5 bg-gray-200 rounded-full w-6/12"></p>
                </div>
              </th>
              <td className="px-6 py-4">
                <div className="w-full gap-1 inline-grid">
                  <p className="h-2.5 bg-gray-200 rounded-full w-full"></p>
                  <code className="relative rounded bg-slate-100 py-[0.2rem] px-[0.3rem] font-mono text-xs font-normaltext-slate-900 dark:bg-slate-800 dark:text-slate-400 w-1/3">
                    <p className="h-1.5 bg-gray-200 rounded-full w-full"></p>
                  </code>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="w-full gap-1 inline-grid">
                  <p className="h-2.5 bg-gray-200 rounded-full w-full"></p>
                  <p className="h-1.5 bg-gray-200 rounded-full w-6/12"></p>
                </div>
              </td>
              <td className="px-6 py-4"></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const EventTable = () => {
  const { navigate } = useRouter();
  const [data] = trpc.auditLogEvents.useSuspenseQuery(
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

  return <>{data.length ? <Table auditLogs={data} /> : <EmptyState />}</>;
};

type Props = {
  auditLogs: AuditLog[];
};

const Table = ({ auditLogs }: Props) => (
  <div className="relative overflow-x-auto sm:rounded-md border-t border-l border-r">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <TableHeader />
      <tbody>
        {auditLogs.map(({ user, id, action, occurredAt }) => (
          <tr
            key={id}
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 group"
          >
            <th
              scope="row"
              className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
            >
              <Avatar>
                <AvatarImage />
                <AvatarFallback>
                  {/* 
                      TODO: replace user email
                      {user.name[0] ?? user.email[0] ?? ""}
                   */}
                  {user.name ? user.name[0] : ""}
                </AvatarFallback>
              </Avatar>
              <div className="pl-3">
                <p className="font-medium">{user.name}</p>
                <p className="font-normal text-gray-500 text-xs">
                  {user.email}
                </p>
              </div>
            </th>
            <td className="px-6 py-4">
              <div>
                <p className="font-medium text-gray-900">{action.title}</p>
                <code className="relative rounded bg-slate-100 py-[0.2rem] px-[0.3rem] font-mono text-xs font-normaltext-slate-900 dark:bg-slate-800 dark:text-slate-400">
                  {action.code}
                </code>
              </div>
            </td>
            <td className="px-6 py-4">
              <div>
                <p className="text-gray-900">
                  {format(new Date(occurredAt), "MM/dd/yyyy")}
                </p>
                <p className="text-xs">
                  {format(
                    utcToZonedTime(
                      new Date(occurredAt),
                      Intl.DateTimeFormat().resolvedOptions().timeZone
                    ),
                    "HH:mm:ss xxx"
                  )}
                </p>
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
        Actor
      </th>
      <th scope="col" className="px-6 py-3">
        Event
      </th>
      <th scope="col" className="px-6 py-3">
        Date
      </th>
      <th scope="col" className="px-6 py-3"></th>
    </tr>
  </thead>
);

const EmptyState = () => (
  <div className="border sm:rounded-md min-h-[60vh] flex justify-center items-center">
    <div className="flex flex-col items-center">
      <ListIcon className="h-10 w-10" />
      <h4 className="mt-4 scroll-m-20 text-md font-semibold tracking-tight text-gray-600">
        You don't have any audit log events.
      </h4>
    </div>
  </div>
);
