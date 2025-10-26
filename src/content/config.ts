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
      chips: z.array(z.string()),
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
      tours: z.array(
        z.object({
          title: z.string(),
          slug: z.string(),
          categories: z
            .array(z.enum(["city", "coastal", "cultural", "history"]))
            .min(1)
            .default(["city"]),
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

const boatTourCollection = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/boatTourCollection",
  }),
  schema: ({ image }) =>
    z.object({
      tours: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          description: z.string(),
          price: z.string().optional(),
          duration: z.string().optional(),
          badge: z.string().optional(),
          tourPoints: z.array(
            z.object({
              id: z.string(),
              image: image(),
              alt: z.string(),
              title: z.string(),
              description: z.string(),
            })
          ),
        })
      ),
    }),
});

const aboutMeCollection = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/aboutMe",
  }),
  schema: ({ image }) =>
    z.object({
      guide: z.object({
        name: z.string(),
        title: z.string(),
        profileImage: image(),
        alt: z.string(),
        introduction: z.string(),
        highlights: z.array(
          z.object({
            label: z.string(),
          })
        ),
      }),
      story: z.object({
        title: z.string(),
        sections: z.array(
          z.object({
            title: z.string(),
            content: z.string(),
            image: image(),
            alt: z.string(),
          })
        ),
        quote: z.object({
          text: z.string(),
          author: z.string(),
        }),
      }),
      personalTouch: z.object({
        citation: z.string(),
        title: z.string(),
        interests: z.object({
          title: z.string(),
          items: z.array(z.string()),
        }),
        philosophy: z.object({
          title: z.string(),
          paragraphs: z.array(z.string()),
        }),
      }),
      cta: z.object({
        title: z.string(),
        description: z.string(),
      }),
      seoData: z.object({
        title: z.string(),
        description: z.string(),
      }),
    }),
});

export const collections = {
  hero: heroCollection,
  italianToursGallery,
  boatTourCollection,
  aboutMe: aboutMeCollection,
};
