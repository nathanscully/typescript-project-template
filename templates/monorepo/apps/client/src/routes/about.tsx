import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

interface Health {
  status: string;
  uptime: number;
}

// Calls the Fastify server in apps/server. In dev, "/api" is proxied to
// http://localhost:3001 (see vite.config.ts). Run both with `pnpm dev`.
async function fetchHealth(): Promise<Health> {
  const res = await fetch("/api/health");
  if (!res.ok) {
    throw new Error(`Server responded ${res.status}`);
  }
  return res.json() as Promise<Health>;
}

export const Route = createFileRoute("/about")({
  component: AboutComponent,
});

function AboutComponent() {
  const query = useQuery({ queryKey: ["health"], queryFn: fetchHealth });

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">About</h1>
      <p className="text-gray-600">
        This page calls the Fastify server's <code>/health</code> endpoint through TanStack Query.
        Start both apps with <code>pnpm dev</code>.
      </p>
      {query.isPending ? (
        <p>Loading…</p>
      ) : query.isError ? (
        <p className="text-red-600">
          Could not reach the server. Is it running on <code>:3001</code>?
        </p>
      ) : (
        <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-1">
          <dt className="text-gray-500">status</dt>
          <dd className="font-mono">{query.data.status}</dd>
          <dt className="text-gray-500">uptime</dt>
          <dd className="font-mono">{query.data.uptime.toFixed(2)}s</dd>
        </dl>
      )}
    </section>
  );
}
