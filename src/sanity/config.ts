import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";

export const sanityStudioConfig = defineConfig({
  name: "default",
  title: "Charl's Flowers Studio",
  projectId: "8326wvly",
  dataset: "production",
  basePath: "/studio",
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});

export default sanityStudioConfig;