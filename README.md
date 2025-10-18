# Mega Template - Advanced Astro Starter

A powerful, production-ready Astro template featuring React integration, TypeScript, Tailwind CSS v3, internationalization (i18n), and comprehensive development tools.

## How to use

- Copy files from this template project
- Replace content in REQUIREMENTS.md file with your project requirements
- Delete README.MD file
- Open project in Cursor or Co-Pilot. Open LLM integrated to IDE
- Copy-paste following prompt in LLM Agent (For best result recommended to use Claude Thinking model) and execute prompt

```text
Goal: Create website for project described in @REQUIREMENTS.md
 
Follow steps below:

Project Setup:
- Use the existing Astro + React + TypeScript project structure
- Follow all rules from @RULES.md strictly
```

## ✨ Features

- **🚀 Astro v5.13.3** - The modern web framework for content-driven websites
- **⚛️ React v19.1.1** - Full React integration with client-side hydration
- **📘 TypeScript** - Strict type checking with comprehensive type definitions
- **🎨 Tailwind CSS v3.4.17** - Utility-first CSS with custom theming
- **🌍 Internationalization** - Complete i18n system with fallbacks and server-side translation
- **🎭 CSS Variables Theming** - Dark/light mode support with custom color systems
- **🔒 Security Middleware** - Authentication, rate limiting, and secure cookie handling
- **🧩 Component Library** - Reusable components with translation support
- **📱 Responsive Design** - Mobile-first approach with modern UI patterns
- **🛠️ Developer Experience** - Hot reload, TypeScript support, and comprehensive tooling

## 🏗️ Architecture

### Project Structure

```text
/
├── public/                    # Static assets
├── src/
│   ├── components/           # Reusable components (Astro & React)
│   │   ├── ui/              # UI component library
│   │   ├── ThemeToggle.tsx  # Theme switching component
│   │   └── ContactForm.tsx  # Contact form with i18n
│   ├── hooks/               # React hooks
│   │   └── useTranslation.ts # Client-side translation hook
│   ├── i18n/                # Internationalization system
│   │   ├── config.ts        # i18n configuration
│   │   ├── utils.ts         # Translation utilities
│   │   ├── t.ts             # Core translation function
│   │   └── messages/        # Translation files (en, nl)
│   ├── layouts/             # Page layouts
│   │   └── IntlBaseLayout.astro # Base layout with i18n
│   ├── middleware.ts        # Server middleware (auth, rate limiting, i18n)
│   ├── pages/               # File-based routing
│   │   ├── en/              # English pages
│   │   └── nl/              # Dutch pages
│   ├── styles/              # Global styles and CSS variables
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
└── package.json
```

### Key Technologies

- **Frontend**: Astro + React with TypeScript
- **Styling**: Tailwind CSS v3 with CSS variables for theming
- **Internationalization**: Custom i18n system with server-side translation
- **State Management**: React hooks for client-side state
- **Build Tool**: Vite with Astro optimizations

## 🌐 Internationalization

The template includes a comprehensive i18n system:

- **Multiple Languages**: English and Dutch out of the box
- **Server-Side Translation**: Translations resolved at build/request time
- **Fallback System**: Graceful degradation to default language
- **Nested Translation Keys**: Support for complex translation structures
- **React Integration**: Custom hooks for client-side translations
- **SEO Friendly**: Proper hreflang tags and localized URLs

## 🎨 Theming System

- **CSS Variables**: Dynamic theming without runtime overhead
- **Color Palette**: Comprehensive color system with semantic naming
- **Dark/Light Mode**: Toggle between themes with persistent state
- **Component Variants**: Pre-built component styles (buttons, cards, forms)
- **Responsive Design**: Mobile-first approach with breakpoint system

## 🔒 Security Features

- **Rate Limiting**: API protection against abuse
- **Input Validation**: Form validation and sanitization

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
