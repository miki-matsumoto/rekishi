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
  const {state: {data}} = useLoaderInstance({key: eventLoader.key})

  return <>Event, {JSON.stringify(data)}</>;
}
