import { Button, Card, Text, List, ListItem, Title, Flex } from "@tremor/react";
import { Link } from "@tanstack/react-router";

export const AuditLogsPage = () => {
  return (
    <div>
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
      <Card>card</Card>
      <ListComponent />
    </div>
  );
};

const data = [
  {
    name: "Viola Amherd",
    Role: "Federal Councillor",
    departement:
      "The Federal Department of Defence, Civil Protection and Sport (DDPS)",
    status: "active",
  },
  {
    name: "Simonetta Sommaruga",
    Role: "Federal Councillor",
    departement:
      "The Federal Department of the Environment, Transport, Energy and Communications (DETEC)",
    status: "active",
  },
  {
    name: "Alain Berset",
    Role: "Federal Councillor",
    departement: "The Federal Department of Home Affairs (FDHA)",
    status: "active",
  },
  {
    name: "Ignazio Cassis",
    Role: "Federal Councillor",
    departement: "The Federal Department of Foreign Affairs (FDFA)",
    status: "active",
  },
  {
    name: "Ueli Maurer",
    Role: "Federal Councillor",
    departement: "The Federal Department of Finance (FDF)",
    status: "active",
  },
  {
    name: "Guy Parmelin",
    Role: "Federal Councillor",
    departement:
      "The Federal Department of Economic Affairs, Education and Research (EAER)",
    status: "active",
  },
  {
    name: "Karin Keller-Sutter",
    Role: "Federal Councillor",
    departement: "The Federal Department of Justice and Police (FDJP)",
    status: "active",
  },
];

const cities = [
  {
    city: "Athens",
    rating: "2 open PR",
    hello: "world",
  },
  {
    city: "Luzern",
    rating: "1 open PR",
    hello: "world",
  },
  {
    city: "Zürich",
    rating: "0 open PR",
    hello: "world",
  },
  {
    city: "Vienna",
    rating: "1 open PR",
    hello: "world",
  },
  {
    city: "Ermatingen",
    rating: "0 open PR",
    hello: "world",
  },
  {
    city: "Lisbon",
    rating: "0 open PR",
    hello: "world",
  },
];

const ListComponent = () => (
  <Card maxWidth="max-w-4xl">
    <Title>Tremor's Hometowns</Title>
    <List>
      {cities.map((item) => (
        <ListItem spaceX="space-x-0">
          <div className="w-full py-2">
            <Link>
              <Flex>
                <span className="flex-1">{item.city}</span>
                <span className="flex-auto">{item.rating}</span>
                <span>{item.hello}</span>
              </Flex>
            </Link>
          </div>
        </ListItem>
      ))}
    </List>
  </Card>
);
