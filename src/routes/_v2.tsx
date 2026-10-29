import { Outlet, ScriptOnce, createFileRoute } from "@tanstack/react-router";
import v2Css from "../styles/v2.css?url";
import { themeScript } from "@/components/v2/shell";

/* The minimal site: its own stylesheet, faces and theme, kept off /v1. */
export const Route = createFileRoute("/_v2")({
  head: () => ({
    meta: [{ name: "theme-color", content: "#0b0c0e" }],
    links: [
      { rel: "stylesheet", href: v2Css },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@400;500&family=Atkinson+Hyperlegible+Mono:wght@400&display=swap",
      },
    ],
  }),
  component: V2Layout,
});

function V2Layout() {
  return (
    <>
      <ScriptOnce>{themeScript}</ScriptOnce>
      <Outlet />
    </>
  );
}
