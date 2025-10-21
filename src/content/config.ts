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

const italianToursGallery = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/italianToursGallery",
  }),
  schema: ({ image }) =>
    z.object({
      themeColor: z.number().min(0).max(360).default(260),
      tours: z.array(
        z.object({
          title: z.string(),
          slug: z.string(),
          category: z
            .enum(["city", "coastal", "cultural", "history"])
            .default("city"),
          description: z.string(),
          fullDescription: z.string(),
          points: z.array(z.string()),
          duration: z.string().optional(),
          price: z.string().optional(),
          images: z.array(
            z.object({
              image: image(),
              alt: z.string(),
            })
          ),
        })
      ),
    }),
});

export const collections = {
  hero: heroCollection,
  italianToursGallery,
};
