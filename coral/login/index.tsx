import { Context as AquariumContext } from "@aivenio/aquarium";
import "@aivenio/aquarium/dist/styles.css";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { useRef } from "react";
import { createRoot } from "react-dom/client";
//eslint-disable-next-line
import "../src/app/accessibility.module.css";
//eslint-disable-next-line
import "../src/app/main.module.css";
//eslint-disable-next-line
import { LoginPage } from "./login-page";
import {
  createBrowserRouter,
  Outlet,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
//eslint-disable-next-line
import { SignInPage } from "./sign-in";
//eslint-disable-next-line
import LayoutWithoutNav from "../src/app/layout/LayoutWithoutNav";
import SkipLink from "src/app/layout/skip-link/SkipLink";
import { BasePageWithoutNav } from "src/app/layout/page/BasePageWithoutNav";
import HeaderNavigation from "src/app/layout/header/HeaderNavigation";

// https://github.com/microsoft/monaco-editor/tree/main/samples/browser-esm-vite-react

const root = createRoot(document.getElementById("root") as HTMLElement);

const routes: Array<RouteObject> = [
  {
    path: "/",
    element: (
      <BasePageWithoutNav headerContent={<div></div>} content={<Outlet />} />
    ),
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/sign-in", element: <SignInPage /> },
    ],
  },
];

const router = createBrowserRouter(routes);
console.log("index");
const queryClient = new QueryClient({
  queryCache: new QueryCache({}),
  defaultOptions: {
    queries: {
      retry: (failureCount: number) => {
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
  },
});

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AquariumContext>
        <ReactQueryDevtools />
        <RouterProvider router={router} />
      </AquariumContext>
    </QueryClientProvider>
  </React.StrictMode>
);
