import { QueryClientProvider } from "@tanstack/react-query";
import { render, RenderOptions } from "@testing-library/react";
import { ReactElement, ReactNode } from "react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { Context as AquariumContext } from "@aivenio/aquarium";
import { getQueryClientForTests } from "src/services/test-utils/query-client-tests";
import { AtLeastOneProperty } from "types/utils";

type RenderConfigOptions = {
  queryClient: boolean;
  memoryRouter: boolean;
  browserRouter: boolean;
  aquariumContext: boolean;
  customRoutePath: string;
};

/***
 * browserRouter: Only use if needed, e.g., for testing URL states (i.e., search params)
 * in general, prefer memoryRouter for tests.
 */
type RenderConfig = AtLeastOneProperty<RenderConfigOptions>;

type WrapperProps = {
  children?: ReactNode;
};

function createWrapper(
  ui: ReactElement,
  config: RenderConfig,
  options?: RenderOptions
) {
  const {
    queryClient,
    memoryRouter,
    browserRouter,
    aquariumContext,
    customRoutePath,
  } = config;

  const wrappers: React.FC<WrapperProps>[] = [];

  if (queryClient) {
    const queryClientWrapper: React.FC<WrapperProps> = ({ children }) => (
      <QueryClientProvider client={getQueryClientForTests()}>
        {children}
      </QueryClientProvider>
    );
    wrappers.push(queryClientWrapper);
  }

  if (memoryRouter) {
    const memoryRouterWrapper: React.FC<WrapperProps> = ({ children }) => (
      <MemoryRouter initialEntries={[customRoutePath || ""]}>
        {children}
      </MemoryRouter>
    );
    wrappers.push(memoryRouterWrapper);
  }

  if (browserRouter) {
    const browserRouterWrapper: React.FC<WrapperProps> = ({ children }) => (
      <BrowserRouter>{children}</BrowserRouter>
    );
    wrappers.push(browserRouterWrapper);
  }

  if (aquariumContext) {
    const aquariumWrapper: React.FC<WrapperProps> = ({ children }) => (
      <AquariumContext>{children}</AquariumContext>
    );
    wrappers.push(aquariumWrapper);
  }

  return render(ui, {
    wrapper: ({ children }) => (
      <>
        {wrappers.reduceRight(
          (acc, Wrapper) => (
            <Wrapper>{acc}</Wrapper>
          ),
          children
        )}
      </>
    ),
    ...options,
  });
}

function customRender(
  ui: ReactElement,
  config: RenderConfig,
  options?: RenderOptions
) {
  return createWrapper(ui, config, options);
}

export { customRender };
