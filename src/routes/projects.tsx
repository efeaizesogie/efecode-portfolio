import { createFileRoute, redirect } from "@tanstack/react-router";

/* The full project index now lives with the interactive version. */
export const Route = createFileRoute("/projects")({
  beforeLoad: () => {
    throw redirect({ to: "/v1/projects", statusCode: 301 });
  },
});
