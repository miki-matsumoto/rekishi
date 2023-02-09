import { Suspense } from "react";
import { Link } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";
import { Button } from "src/components/ui/button";
import { Activity, ChevronLeft, Globe, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import { trpc } from "src/lib/trpc";

export default function EventPage() {
  return (
    <div>
      <div className="max-w-5xl mx-auto">
        <div className="my-8">
          <Button
            variant="link"
            size="sm"
            className="text-blue-600 font-normal p-0 hover:no-underline"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            <Link to="/audit-logs/events">Audit Logs</Link>
          </Button>
          <h4 className="scroll-m-20 text-2xl font-semibold tracking-tight flex items-center">
            Action Title
          </h4>
          <code className="relative rounded bg-slate-100 py-[0.2rem] px-[0.3rem] font-mono text-xs font-normal text-slate-900 dark:bg-slate-800 dark:text-slate-400">
            Action.Name
          </code>
        </div>
        <Suspense fallback={<div>Loading... from suspense</div>}>
          <EventDetail />
        </Suspense>
      </div>
    </div>
  );
}

const EventDetail = () => {
  const { event } = useParams();
  const [data] = trpc.findEventById.useSuspenseQuery({
    eventId: event as string,
  });

  return (
    <div className="max-w-5xl mx-auto border sm:rounded-md">
      <div className="flex">
        <div className="basis-1/3 border-r p-4">
          <div className="border-b mb-4 pb-4">
            <div className="flex items-center">
              <Avatar>
                <AvatarImage />
                <AvatarFallback>
                  {data.user?.name ? data.user.name[0] : ""}
                </AvatarFallback>
              </Avatar>
              <div className="pl-3">
                <div className="text-base font-medium">{data.user.name}</div>
                <div className="font-normal text-gray-500 text-xs">
                  neil.sims@flowbite.com
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <DetailItem>
              <div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <p className="font-medium text-sm">Location</p>
                </div>
                <p className="text-sm font-normal text-gray-600 ml-6">
                  {data.context.location ? data.context.location : "-"}
                </p>
              </div>
            </DetailItem>

            <DetailItem>
              <div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  <p className="font-medium text-sm">Browser</p>
                </div>
                <p className="font-normal ml-6 text-gray-600 text-sm">
                  {data.context.userAgent ? data.context.userAgent : "-"}
                </p>
              </div>
            </DetailItem>

            <DetailItem>
              <div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <p className="font-medium text-sm">Location</p>
                </div>
                <p className="font-normal ml-6 text-gray-600 text-sm">
                  {data.context.userAgent}
                </p>
              </div>
            </DetailItem>
          </div>
        </div>
        <div className="flex-auto p-4">hello</div>
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
