import { trpc } from "src/lib/trpc";
import {
  Loader,
  LoaderClient,
  LoaderClientProvider,
  useLoaderClient,
  useLoaderInstance,
} from '@tanstack/react-loaders'
import { eventLoader } from ".";


export default function Event() {
  const {data } = trpc.hello.useQuery()

  return <>Event, {JSON.stringify(data)}</>;
}
