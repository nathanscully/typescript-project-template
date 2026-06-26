import { useState } from "react";

// Presentational home content. Kept out of the route file so the route stays
// code-splittable, and so it can be unit-tested directly.
export function Home() {
  const [count, setCount] = useState(0);

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">spa</h1>
      <p className="text-gray-600">
        A Vite + TanStack Router single-page app, with React Query and Tailwind wired up. Tooling is
        the vite+ toolchain; the runtime is pinned by Nix.
      </p>
      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
      >
        count is {count}
      </button>
      <p className="text-sm text-gray-500">
        Edit <code className="rounded bg-gray-200 px-1">src/components/home.tsx</code> and save to
        hot-reload.
      </p>
    </section>
  );
}
