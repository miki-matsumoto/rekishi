import { Suspense } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";
import { Button } from "src/components/ui/button";
import { Calendar, ChevronLeft, Crosshair, Globe, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import { trpc } from "src/lib/trpc";
import Highlight, { defaultProps } from "prism-react-renderer";
import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

export default function EventPage() {
  return (
    <div>
      <div className="max-w-5xl mx-auto">
        <div className="mt-8">
          <Button
            variant="link"
            size="sm"
            className="text-blue-600 font-normal p-0 hover:no-underline"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            <Link to="/audit-logs/events">Audit Logs</Link>
          </Button>
        </div>
        <Suspense fallback={<div>Loading... from suspense</div>}>
          <EventDetail />
        </Suspense>
      </div>
    </div>
  );
}

const EventHeader = ({ title, name }: { title: string; name: string }) => (
  <div className="mb-8">
    <h4 className="scroll-m-20 text-2xl font-semibold tracking-tight flex items-center">
      {title ?? name}
    </h4>
    <code className="relative rounded bg-slate-100 py-[0.2rem] px-[0.3rem] font-mono text-xs font-normal text-slate-900 dark:bg-slate-800 dark:text-slate-400">
      {name}
    </code>
  </div>
);

const EventDetail = () => {
  const { navigate } = useRouter();
  const { event } = useParams();
  const [data] = trpc.findEventById.useSuspenseQuery(
    {
      eventId: event as string,
    },
    {
      onError({ data }) {
        if (data?.code === "UNAUTHORIZED") {
          navigate({ to: "/expired" });
        }
      },
    }
  );

  const textColors = {
    string: "#16a34a",
    number: "#16a34a",
    property: "#6366f1",
    operator: "#6b7280",
    plain: "#6b7280",
    punctuation: "#6b7280",
  };

  return (
    <div>
      <div>
        <EventHeader title={data.action?.title ?? ""} name={data.action.name} />
      </div>
      <div className="max-w-5xl mx-auto border sm:rounded-md">
        <div className="flex">
          <div className="basis-1/3 border-r p-4">
            <div className="border-b mb-4 pb-4">
              <div className="flex items-center">
                <Avatar>
                  <AvatarImage />
                  <AvatarFallback>
                    {data.actor.name ? data.actor.name[0] : ""}
                  </AvatarFallback>
                </Avatar>
                <div className="pl-3">
                  <div className="text-base font-medium">
                    {data.actor.name || data.actor.email}
                  </div>
                  {data.actor.email && (
                    <div className="font-normal text-gray-500 text-xs">
                      {data.actor.email}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <DetailItem>
                <div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-700" />
                    <p className="font-medium text-sm text-gray-700">Date</p>
                  </div>
                  <div>
                    <p className="font-normal ml-6 text-gray-600 text-sm">
                      {format(
                        utcToZonedTime(
                          new Date(data.occurred_at),
                          Intl.DateTimeFormat().resolvedOptions().timeZone
                        ),
                        "MM/dd/yyy HH:mm:ss xxx"
                      )}
                    </p>
                  </div>
                </div>
              </DetailItem>

              <DetailItem>
                <div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-700" />
                    <p className="font-medium text-sm text-gray-700">
                      Location
                    </p>
                  </div>
                  <p className="text-sm font-normal text-gray-600 ml-6">
                    {data.context.location ? data.context.location : "-"}
                  </p>
                </div>
              </DetailItem>

              <DetailItem>
                <div>
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-gray-700" />
                    <p className="font-medium text-sm text-gray-700">
                      User agenet
                    </p>
                  </div>
                  <p className="font-normal ml-6 text-gray-600 text-sm">
                    {data.context.userAgent ? data.context.userAgent : "-"}
                  </p>
                </div>
              </DetailItem>

              <DetailItem>
                <div>
                  <div className="flex items-center">
                    <Crosshair className="h-4 w-4 mr-2 text-gray-700" />
                    <p className="font-medium text-sm text-gray-700">Targets</p>
                  </div>
                  <p className="font-normal ml-6 text-gray-600 text-sm">
                    {data.targets
                      .map((target) => `${target.count} ${target.name}`)
                      .join(", ")}
                  </p>
                </div>
              </DetailItem>
            </div>
          </div>
          <div className="flex-auto p-4 h-full bg-gray-50">
            <Highlight {...defaultProps} code={`${data.json}`} language="json">
              {({ tokens, getLineProps, getTokenProps }) => (
                <pre className="text-sm bg-gray-50">
                  {tokens.map((line, i) => (
                    <div {...getLineProps({ line, key: i })}>
                      {line.map((token, key) => (
                        <>
                          <span
                            {...getTokenProps({ token, key })}
                            style={{
                              color:
                                textColors[
                                  token.types[0] as "string" | "property"
                                ],
                            }}
                          />
                        </>
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center text-gray-900 whitespace-nowrap dark:text-white">
    {children}
  </div>
);

// type Props = { children: React.ReactNode; spacing?: number };
// const VStack = ({ children, spacing = 1 }: Props) => (
//   <div className={cn(`flex flex-col gap-[${spacing}]`)}>{children}</div>
// );
