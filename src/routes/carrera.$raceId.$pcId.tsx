import { createFileRoute } from "@tanstack/react-router";
import { RallyDashboard } from "../components/RallyDashboard";

export const Route = createFileRoute("/carrera/$raceId/$pcId")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    chain: search.chain === true || search.chain === "true",
  }),
});

function RouteComponent() {
  const { raceId, pcId } = Route.useParams();
  const { chain } = Route.useSearch();
  return <RallyDashboard key={pcId} raceId={Number(raceId)} pcId={Number(pcId)} chain={chain} />;
}
