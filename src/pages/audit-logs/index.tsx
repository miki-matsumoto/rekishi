import { Block, Button, Text, List, ListItem } from "@tremor/react";
import { trpc } from "src/lib/trpc";
import { Link, useRouter } from "@tanstack/react-router";

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
      <AuditLogList />
    </div>
  );
};

const Header = () => (
  <div className="border-b-gray-200 border">
    <div className="my-0 mx-auto max-w-5xl h-16 flex justify-between items-center">
      <Button
        text="Back to App"
        color="gray"
        importance="secondary"
        size="xs"
      />
      <Text>Powerd by Rekishi</Text>
    </div>
  </div>
);

const AuditLogList = () => {
  return (
    <Block marginTop="mt-8">
      <div className="my-0 mx-auto max-w-5xl border rounded-md">
        <List>
          <div className="bg-slate-50 px-4">
            <ListItem>
              <span className="flex-1">city</span>
              <span className="flex-1">rating</span>
              <span className="flex-2">rating</span>
            </ListItem>
          </div>
          {cities.map((item) => (
            <div className="">
              <Link>
                <ListItem>
                  <span className="flex-1 py-2 px-4">{item.city}</span>
                  <span className="flex-1 py-2 px-4">{item.rating}</span>
                  <span className="flex-2 py-2 px-4">{item.rating}</span>
                </ListItem>
              </Link>
            </div>
          ))}
        </List>
      </div>
    </Block>
  );
};

const cities = [
  {
    city: "Athens",
    rating: "2 open PR",
  },
  {
    city: "Luzern",
    rating: "1 open PR",
  },
  {
    city: "Zürich",
    rating: "0 open PR",
  },
  {
    city: "Vienna",
    rating: "1 open PR",
  },
  {
    city: "Ermatingen",
    rating: "0 open PR",
  },
  {
    city: "Lisbon",
    rating: "0 open PR",
  },
];
