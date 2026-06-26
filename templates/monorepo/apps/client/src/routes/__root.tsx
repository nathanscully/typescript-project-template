import type { QueryClient } from "@tanstack/react-query";
import { Link, Outlet, createRootRouteWithContext } from "@tanstack/react-router";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="flex gap-4 border-b border-gray-200 bg-white px-6 py-4">
        <Link to="/" className="font-medium" activeProps={{ className: "font-bold text-blue-600" }}>
          Home
        </Link>
        <Link
          to="/about"
          className="font-medium"
          activeProps={{ className: "font-bold text-blue-600" }}
        >
          About
        </Link>
      </nav>
      <main className="mx-auto max-w-2xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
