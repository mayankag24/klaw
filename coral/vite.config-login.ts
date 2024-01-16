import { defineConfig, loadEnv, PluginOption, ProxyOptions } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import svgr from "vite-plugin-svgr";
import { resolve } from "path";
import fs from "fs";

/**
 * Get basename for React router.
 *
 * @param  {[Record<string, string>]} environment
 *
 * Picks first encountered value:
 * 1. $VITE_ROUTER_BASENAME
 * 2. $BASE_URL
 * 3. undefined (default)
 */

/**
 * Get base url for Klaw API client.
 *
 * @param  {[type]} environment
 *
 * The $VITE_API_BASE_URL variable allows API to be consumed from another origin.
 * Also, this make it easy to override the API base url for unittests.
 */

console.log("correct");
function getApiBaseUrl(
  environment: Record<string, string>
): string | undefined {
  return environment.VITE_API_BASE_URL ?? undefined;
}

function getProxyTarget(environment: Record<string, string>): string {
  const origin = environment.VITE_PROXY_TARGET ?? "http://localhost:9097";
  return `${new URL(origin).origin}`;
}

function getServerProxyConfig(
  environment: Record<string, string>
): Record<string, string | ProxyOptions> | undefined {
  const LEGACY_LOGIN_RESOURCES = [
    // "/login",
    // "/lib/angular.min.js",
    // "/lib/angular-route.min.js",
    // "/js/loginSaas.js",
    // "/assets/css/",
    // "/assets/js/",
    // "/assets/plugins/",
    // "/assets/images/",
  ];
  const target = getProxyTarget(environment);
  const secure = false;
  return {
    "/api": {
      target,
      rewrite: (path) => path.replace(/^\/api/, ""),
      secure,
    },
    ...LEGACY_LOGIN_RESOURCES.reduce(
      (acc, current) => ({
        ...acc,
        [current]: {
          target,
          secure,
        },
      }),
      {}
    ),
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, process.cwd(), "");

  console.log("mode", mode);

  return {
    root: "login",
    plugins: [react(), svgr()],
    define: {
      // Vite does not use process.env (see https://vitejs.dev/guide/env-and-mode.html).
      // If a library depends on process.env (like "@aivenio/aquarium").
      // ⛔ Note: there are stackoverflow answers / GitHub issues that recommend e.g
      // ⛔ 'process.env': process.env or
      // ⛔ 'process.env': { ...process.env}
      // ⛔️ Don't do that! This can expose unwanted env vars in production builds.
      "process.env": {
        API_BASE_URL: getApiBaseUrl(environment),
      },
    },
    css: {
      modules: {
        localsConvention: "camelCaseOnly",
      },
    },
    resolve: {
      alias: {
        src: resolve(__dirname, "./src"),
        "/src": resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 1111,
      proxy: getServerProxyConfig(environment),
    },
    build: {
      rollupOptions: {
        input: { app: "login/index.html" },
      },
    },
    base: "/",
  };
});
