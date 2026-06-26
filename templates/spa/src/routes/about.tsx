import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

// Stand-in for a real API call. Swap for `fetch("/api/...")` against your
// backend. Kept local so the starter runs with no server attached.
async function fetchStats(): Promise<{ stars: number; downloads: number }> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return { stars: 42, downloads: 1337 };
}

export const Route = createFileRoute("/about")({
  component: AboutComponent,
});

function AboutComponent() {
  const query = useQuery({ queryKey: ["stats"], queryFn: fetchStats });

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">About</h1>
      <p className="text-gray-600">
        This page fetches data with TanStack Query. Replace <code>fetchStats</code> with a real
        request to your API.
      </p>
      {query.isPending ? (
        <p>Loading…</p>
      ) : query.isError ? (
        <p className="text-red-600">Failed to load.</p>
      ) : (
        <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-1">
          <dt className="text-gray-500">stars</dt>
          <dd className="font-mono">{query.data.stars}</dd>
          <dt className="text-gray-500">downloads</dt>
          <dd className="font-mono">{query.data.downloads}</dd>
        </dl>
      )}
    </section>
  );
}
