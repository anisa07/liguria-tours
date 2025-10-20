import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const heroCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/hero" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      mainTitle: z.string(),
      subtitle: z.string(),
      description: z.string(),
      themeColor: z.number().min(0).max(360).default(260),
      images: z.array(
        z.object({
          image: image(),
          alt: z.string(),
          title: z.string(),
          description: z.string(),
        })
      ),
    }),
});

export const collections = {
  hero: heroCollection,
};
