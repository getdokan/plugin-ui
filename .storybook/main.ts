import type { StorybookConfig } from "@storybook/react-webpack5";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Base path for deployment to subpath (e.g. GitHub Pages: https://owner.github.io/repo/)
const basePath = process.env.STORYBOOK_BASE_PATH || "/";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx|js|jsx)"],

  addons: ["@storybook/addon-a11y", "@chromatic-com/storybook"],

  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },

  webpackFinal: async (config) => {
    if (basePath !== "/" && config.output) {
      config.output.publicPath = basePath.startsWith("/") ? basePath : `/${basePath}`;
    }
    config.resolve = config.resolve ?? {};

    const projectRoot = path.resolve(__dirname, "..");

    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(projectRoot, "src"),

      // Ensure a SINGLE React instance (prevents hook + context crashes)
      react: path.resolve(projectRoot, "node_modules/react"),
      "react-dom": path.resolve(projectRoot, "node_modules/react-dom"),
    };

    // --------------------------------------------------
    // POSTCSS (Tailwind) support
    // --------------------------------------------------
    const postcssLoader = {
      loader: require.resolve("postcss-loader"),
      options: { postcssOptions: require("../postcss.config.js") },
    };

    const rules = config.module?.rules ?? [];

    for (const rule of rules) {
      if (
        rule &&
        typeof rule === "object" &&
        rule.test instanceof RegExp &&
        rule.test.test("x.css")
      ) {
        const use = Array.isArray(rule.use) ? rule.use : [rule.use].filter(Boolean);

        const hasPostcss = use.some(
          (u: unknown) =>
            typeof u === "object" &&
            u &&
            "loader" in (u as object) &&
            String((u as { loader?: string }).loader).includes("postcss")
        );

        if (!hasPostcss) rule.use = [...use, postcssLoader];
        break;
      }
    }

    // --------------------------------------------------
    // Transpile JSX/TS in story files so "Show code" shows readable JSX.
    // Run Babel as a pre-loader so it runs before csf-plugin/export-order on story files.
    // --------------------------------------------------
    const babelLoaderForStories = {
      loader: require.resolve("babel-loader"),
      options: {
        presets: [
          [require.resolve("@babel/preset-react"), { runtime: "automatic" }],
          [require.resolve("@babel/preset-typescript"), { allowDeclareFields: true }],
        ],
      },
    };
    config.module?.rules?.unshift({
      test: /\.stories\.(jsx|tsx)$/,
      use: [babelLoaderForStories],
      enforce: "pre" as const,
    });

    // Transpile TS/TSX from src (components imported by stories)
    config.module?.rules?.push({
      test: /\.(ts|tsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: require.resolve("babel-loader"),
          options: {
            presets: [
              [require.resolve("@babel/preset-react"), { runtime: "automatic" }],
              [require.resolve("@babel/preset-typescript"), { allowDeclareFields: true }],
            ],
          },
        },
      ],
    });

    return config;
  },
};

export default config;