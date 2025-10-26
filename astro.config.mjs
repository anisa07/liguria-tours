// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import purgecss from "astro-purgecss";

// https://astro.build/config
export default defineConfig({
  site: "https://liguria-tours.com",
  build: {
    inlineStylesheets: 'auto', // Reduces processing
  },
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
    sitemap({
      // Custom filter to exclude certain pages
      filter: (page) => {
        // Exclude any test or draft pages
        return !page.includes("/test/") && !page.includes("/draft/");
      },
      // Custom serialize function for better URL handling
      serialize: (item) => {
        // Add lastmod date as ISO string
        item.lastmod = new Date().toISOString();

        // Set priority based on page type
        if (item.url.includes("/blog/")) {
          item.priority = 0.8;
        } else if (item.url.endsWith("/")) {
          // Main pages get higher priority
          item.priority = item.url === "https://liguria-tours.com/" ? 1.0 : 0.9;
        } else {
          item.priority = 0.7;
        }

        return item;
      },
    }),
    robotsTxt({
      // Configure robots.txt generation
      policy: [
        {
          userAgent: "*",
          allow: "/",
          disallow: ["/api/", "/*.json$", "/src/", "/.env", "/node_modules/"],
        },
      ],
      sitemap: true, // Automatically includes sitemap reference
    }),
    (await import("@playform/compress")).default({
      Image: false, // Skip image compression - already optimized (AVIF/WebP)
      CSS: true,
      HTML: true,
      JavaScript: true,
      SVG: true,
    }),
    purgecss({
      content: [
        "./src/**/*.{astro,html,js,jsx,ts,tsx}",
        // Removed "./public/**/*.html" - not needed for build optimization
      ],
      extractors: [
        {
          extractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
          extensions: ['astro', 'html', 'js', 'ts', 'jsx', 'tsx']
        }
      ],
      safelist: {
        // Preserve dynamic classes that might be added by JavaScript
        standard: [
          /^fade-/,
          /^slide-/,
          /^opacity-/,
          /^transform/,
          /^transition/,
          // Preserve classes used in React components
          /^react-/,
          // Preserve Tailwind's arbitrary value classes
          /^\[.*\]$/,
        ],
        deep: [
          // Preserve classes within specific components
          /data-/,
          /aria-/,
        ],
        greedy: [
          // Preserve classes that match patterns
          /^btn-/,
          /^card-/,
          /^nav-/,
        ],
      },
      // Don't purge CSS variables
      variables: true,
      // Keep keyframes for animations
      keyframes: true,
    }),
  ],
  vite: {
    build: {
      target: 'esnext',
      cssCodeSplit: true, // Better caching
      modulePreload: {
        polyfill: false, // Faster builds
      },
      rollupOptions: {
        output: {
          manualChunks: {
            // Split vendor code for better caching
            'react-vendor': ['react', 'react-dom'],
            'radix-vendor': [
              '@radix-ui/react-dialog',
              '@radix-ui/react-label',
              '@radix-ui/react-popover',
              '@radix-ui/react-slot'
            ],
          },
        },
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom'], // Pre-bundle dependencies
    },
    resolve: {
      alias: {
        "@": "/src",
        "@/components": "/src/components",
        "@/layouts": "/src/layouts",
        "@/utils": "/src/utils",
        "@/types": "/src/types",
        "@/styles": "/src/styles",
        "@/i18n": "/src/i18n",
        "@/hooks": "/src/hooks",
        "@/services": "/src/services",
        "@/config": "/src/config",
      },
    },
  },
});
