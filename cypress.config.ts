import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineConfig({
  chromeWebSecurity: false,
  env: {
    SITE_NAME: "http://localhost:3000",
  },
  e2e: {
    specPattern: "**/*.feature",
    // How setupNodeEvents work - https://docs.cypress.io/api/plugins/writing-a-plugin#Execution-context
    async setupNodeEvents(
      on: Cypress.PluginEvents,
      config: Cypress.PluginConfigOptions
    ): Promise<Cypress.PluginConfigOptions> {
      // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
      await addCucumberPreprocessorPlugin(on, config);

      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );
      on("task", {
        async removeAllTasks() {
          return await prisma.task.deleteMany();
        },
      });

      // Make sure to return the config object as it might have been modified by the plugin.
      return config;
    },
  },
});
