import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { Home } from "./components/home.tsx";

test("home renders the heading", () => {
  render(<Home />);
  expect(screen.getByRole("heading", { name: "spa" })).toBeInTheDocument();
});
