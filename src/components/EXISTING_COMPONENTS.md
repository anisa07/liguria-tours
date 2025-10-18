# Existing Components Documentation

> **AI Assistant Instructions**: This document contains a complete inventory of reusable components. When a user requests creating a new component, ALWAYS search this document first to find existing alternatives. Look for components with similar purposes, props, or functionality. Suggest reusing or extending existing components before creating new ones.

## 🤖 AI-Friendly Component Index

```yaml
# Component Summary for AI Processing
total_components: 49
categories:
  layout: 12 # Structure, navigation, containers
  content: 10 # Hero, cards, testimonials, etc.
  interactive: 6 # React components with state
  ui: 16 # Form inputs, buttons, alerts
  state: 6 # Loading, error, empty states
  accessibility: 1 # A11y tools
  global: 4 # Theme, language, forms

# Common Use Cases - AI Search Patterns
navigation:
  ["Header.astro", "NavBar.astro", "MobileMenu.astro", "Breadcrumb.astro"]
forms:
  ["ContactForm.tsx", "button.tsx", "input.tsx", "textarea.tsx", "form.tsx"]
cards:
  [
    "Card.astro",
    "BlogCard.astro",
    "PricingCard.astro",
    "TeamMember.astro",
    "TestimonialCard.astro",
  ]
layout:
  [
    "Container.astro",
    "Grid.astro",
    "Flex.astro",
    "Section.astro",
    "Stack.astro",
  ]
interactive:
  ["Accordion.tsx", "Carousel.tsx", "Tabs.tsx", "Tooltip.tsx", "Dropdown.tsx"]
feedback:
  [
    "Alert.astro",
    "ToastNotification.astro",
    "LoadingSpinner.astro",
    "message.tsx",
  ]
```

## 📋 Component Categories

- [🏗️ Layout Components](#️-layout-components)
- [📄 Content Components](#-content-components)
- [🎛️ Interactive Components](#️-interactive-components)
- [🎨 UI Components](#-ui-components)
- [🔄 State Components](#-state-components)
- [♿ Accessibility Components](#-accessibility-components)
- [🌐 Global Components](#-global-components)

## 🔍 AI Quick Reference Guide

### When User Wants → Suggest These Components

| **User Request**      | **Existing Components**                                | **Import Path**                              |
| --------------------- | ------------------------------------------------------ | -------------------------------------------- |
| "navigation menu"     | `Header.astro`, `NavBar.astro`, `MobileMenu.astro`     | `@/components/layout/`                       |
| "hero section"        | `Hero.astro`                                           | `@/components/content/Hero.astro`            |
| "contact form"        | `ContactForm.tsx`                                      | `@/components/ContactForm.tsx`               |
| "card/box design"     | `Card.astro`, `BlogCard.astro`, `PricingCard.astro`    | `@/components/content/`                      |
| "button"              | `button.tsx`                                           | `@/components/ui/button`                     |
| "input field"         | `input.tsx`, `textarea.tsx`, `form.tsx`                | `@/components/ui/`                           |
| "loading state"       | `LoadingSpinner.astro`, `Skeleton.astro`               | `@/components/state/`                        |
| "error handling"      | `ErrorBoundary.tsx`, `NotFoundContent.astro`           | `@/components/state/`                        |
| "dropdown/select"     | `Dropdown.tsx`, `command.tsx`                          | `@/components/interactive/`                  |
| "tabs interface"      | `Tabs.tsx`                                             | `@/components/interactive/Tabs.tsx`          |
| "accordion/collapse"  | `Accordion.tsx`                                        | `@/components/interactive/Accordion.tsx`     |
| "carousel/slider"     | `Carousel.tsx`, `ImageGallery.tsx`                     | `@/components/interactive/`                  |
| "modal/popup"         | `dialog.tsx`, `popover.tsx`                            | `@/components/ui/`                           |
| "notifications"       | `Alert.astro`, `ToastNotification.astro`, `sonner.tsx` | `@/components/ui/`                           |
| "team member display" | `TeamMember.astro`                                     | `@/components/content/TeamMember.astro`      |
| "testimonial"         | `TestimonialCard.astro`                                | `@/components/content/TestimonialCard.astro` |
| "pricing table"       | `PricingCard.astro`                                    | `@/components/content/PricingCard.astro`     |
| "footer"              | `Footer.astro`                                         | `@/components/layout/Footer.astro`           |
| "theme switcher"      | `ThemeToggle.astro`                                    | `@/components/ThemeToggle.astro`             |
| "language switcher"   | `LanguageSwitcher.astro`                               | `@/components/LanguageSwitcher.astro`        |

### Component Selection Logic for AI

```
1. SEARCH FIRST: Always check above table before suggesting new components
2. FRAMEWORK CHOICE:
   - Static content → .astro component
   - Interactive/state → .tsx component
3. REUSE STRATEGY:
   - Exact match → Use as-is
   - Similar purpose → Suggest extending existing
   - No match → Create new with proper naming
4. ALWAYS mention existing alternatives even if creating new
```

---

## 🏗️ Layout Components

**Category**: `layout` | **Count**: `12` | **Framework**: `astro`  
**Use Case**: Page structure, navigation, responsive containers, grid systems

```yaml
# AI Parsing: Layout Components
category: layout
components:
  - Header.astro: ["navigation", "logo", "menu", "responsive"]
  - Footer.astro: ["links", "newsletter", "social", "site-info"]
  - NavBar.astro: ["navigation", "dropdown", "menu"]
  - Container.astro: ["wrapper", "responsive", "max-width"]
  - Grid.astro: ["layout", "responsive", "css-grid"]
  - Flex.astro: ["layout", "flexbox", "alignment"]
```

### `Header.astro`

**Purpose**: Main site header with navigation, logo, and optional controls  
**Framework**: Astro | **Type**: Layout | **Interactive**: No  
**Props**: `fixed`, `transparent`, `navItems`, `logoText`, `logoHref`, `logoImage`, `logoAlt`, `showMobileMenu`, `showThemeToggle`, `showSearch`, `showLanguageSwitcher`, `currentLocale`, `class`  
**Usage**: Primary navigation header with responsive design  
**Keywords**: navigation, header, menu, logo, responsive

### `Footer.astro`

**Purpose**: Site footer with links, newsletter, and social media  
**Props**: Various footer configuration options  
**Usage**: Consistent site footer across all pages

### `NavBar.astro`

**Purpose**: Navigation bar component with dropdown support  
**Props**: `navItems`, navigation configuration  
**Usage**: Main navigation with responsive dropdowns

### `MobileMenu.astro`

**Purpose**: Mobile-optimized navigation menu  
**Props**: Mobile menu configuration  
**Usage**: Responsive mobile navigation overlay

### `Container.astro`

**Purpose**: Responsive container with consistent max-widths and padding  
**Props**: `size`, `padding`, `class`  
**Usage**: Wrapping content with responsive constraints

### `Section.astro`

**Purpose**: Semantic section wrapper with optional backgrounds  
**Props**: Section styling options  
**Usage**: Page sections with consistent spacing

### `Grid.astro`

**Purpose**: CSS Grid layout component  
**Props**: Grid configuration  
**Usage**: Responsive grid layouts

### `Flex.astro`

**Purpose**: Flexbox layout component  
**Props**: Flex configuration  
**Usage**: Flexible layouts and alignment

### `Stack.astro`

**Purpose**: Vertical stacking layout  
**Props**: Spacing and alignment options  
**Usage**: Vertical content stacking

### `Breadcrumb.astro`

**Purpose**: Breadcrumb navigation component  
**Props**: Breadcrumb items  
**Usage**: Page hierarchy navigation

### `Pagination.astro`

**Purpose**: Pagination controls for content  
**Props**: Pagination configuration  
**Usage**: Multi-page content navigation

### `Sidebar.astro`

**Purpose**: Sidebar layout component  
**Props**: Sidebar configuration  
**Usage**: Secondary navigation or content

---

## 📄 Content Components

Components for displaying structured content and information.

### `Hero.astro`

**Purpose**: Hero section with title, description, and call-to-action buttons  
**Props**: `title`, `subtitle`, `description`, `actions`, `variant`, `backgroundImage`, `backgroundVideo`, `overlayOpacity`, `textAlign`, `maxWidth`, `class`, `locale`  
**Usage**: Landing page hero sections with multiple layout variants

### `Card.astro`

**Purpose**: Versatile card component with various styles and layouts  
**Props**: Card configuration and styling options  
**Usage**: Content cards, feature highlights, product displays

### `CallToAction.astro`

**Purpose**: Call-to-action section with buttons and messaging  
**Props**: CTA configuration  
**Usage**: Conversion-focused sections

### `TeamMember.astro`

**Purpose**: Team member profile card  
**Props**: Member information and styling  
**Usage**: Team/about pages

### `TestimonialCard.astro`

**Purpose**: Customer testimonial display  
**Props**: Testimonial content and author info  
**Usage**: Social proof sections

### `PricingCard.astro`

**Purpose**: Pricing plan display with features  
**Props**: Pricing information and features  
**Usage**: Pricing pages and sections

### `BlogCard.astro`

**Purpose**: Blog post preview card  
**Props**: Post metadata and content  
**Usage**: Blog listings and related posts

### `LocationCard.astro`

**Purpose**: Location/office information display  
**Props**: Location details  
**Usage**: Contact pages, office locations

### `Newsletter.astro`

**Purpose**: Newsletter signup form  
**Props**: Newsletter configuration  
**Usage**: Email collection forms

### `prose.astro`

**Purpose**: Typography wrapper for markdown content  
**Props**: Typography styling options  
**Usage**: Blog posts, documentation, rich text content

---

## 🎛️ Interactive Components

React components for dynamic user interactions.

### `Accordion.tsx`

**Purpose**: Collapsible content sections  
**Props**: `items`, `allowMultiple`, `defaultOpenItems`, `variant`, `className`  
**Usage**: FAQ sections, expandable content areas

### `Carousel.tsx`

**Purpose**: Image/content carousel with navigation  
**Props**: `items`, `autoplay`, `interval`, `showDots`, `showArrows`, `className`  
**Usage**: Image galleries, featured content rotation

### `Tabs.tsx`

**Purpose**: Tabbed content interface  
**Props**: `tabs`, `defaultTab`, `variant`, `orientation`, `className`  
**Usage**: Organized content sections, settings panels

### `Tooltip.tsx`

**Purpose**: Contextual information tooltips  
**Props**: `content`, `placement`, `trigger`, `delay`, `className`  
**Usage**: Help text, additional information display

### `Dropdown.tsx`

**Purpose**: Dropdown menu with options  
**Props**: `items`, `trigger`, `placement`, `className`  
**Usage**: Action menus, option selection

### `ImageGallery.tsx`

**Purpose**: Interactive image gallery with lightbox  
**Props**: Gallery configuration and images  
**Usage**: Photo galleries, portfolio displays

---

## 🎨 UI Components

Low-level UI primitives and form components.

### Form Components

- **`button.tsx`**: Configurable button component with variants
- **`input.tsx`**: Text input with validation states
- **`textarea.tsx`**: Multi-line text input
- **`label.tsx`**: Form label component
- **`form.tsx`**: Form wrapper with validation

### Feedback Components

- **`alert.tsx`**: Alert/notification component (React)
- **`Alert.astro`**: Alert/notification component (Astro)
- **`message.tsx`**: Message display component
- **`loading.tsx`**: Loading indicator component
- **`sonner.tsx`**: Toast notification system

### Layout UI

- **`dialog.tsx`**: Modal dialog component
- **`popover.tsx`**: Popover content component
- **`command.tsx`**: Command palette component

### Notification Components

- **`Banner.astro`**: Site-wide banner notifications
- **`ToastNotification.astro`**: Toast notification system (Astro)

---

## 🔄 State Components

Components for handling different application states.

### `LoadingSpinner.astro`

**Purpose**: Loading state indicator  
**Props**: Size and styling options  
**Usage**: Async operations, page loading

### `Skeleton.astro`

**Purpose**: Content placeholder during loading  
**Props**: Skeleton configuration  
**Usage**: Loading states for cards, lists

### `EmptyState.astro`

**Purpose**: Empty content state display  
**Props**: Empty state messaging and actions  
**Usage**: No results, empty collections

### `NotFoundContent.astro`

**Purpose**: 404 error page content  
**Props**: Error messaging and navigation  
**Usage**: 404 pages, missing content

### `ProgressBar.astro`

**Purpose**: Progress indication  
**Props**: Progress value and styling  
**Usage**: Multi-step processes, loading progress

### `ErrorBoundary.tsx`

**Purpose**: React error boundary for graceful error handling  
**Props**: Error handling configuration  
**Usage**: Wrapping React components for error catching

---

## ♿ Accessibility Components

Components focused on accessibility and inclusive design.

### `AccessibilityAuditor.astro`

**Purpose**: Development-time accessibility testing with axe-core  
**Props**: Auditing configuration  
**Usage**: Development environments only  
**Import**: `import AccessibilityAuditor from "@/components/accessibility/AccessibilityAuditor.astro"`

---

## 🌐 Global Components

Top-level components used across the application.

### `ThemeToggle.astro`

**Purpose**: Dark/light theme switching  
**Props**: `className`, `locale`  
**Usage**: Theme switching in header/navigation

### `LanguageSwitcher.astro`

**Purpose**: Language/locale selection  
**Props**: Language switching configuration  
**Usage**: International sites, header navigation

### `ContactForm.tsx`

**Purpose**: Contact form with validation and submission  
**Props**: `locale`, `emailApiAccessKey`  
**Usage**: Contact pages, lead generation

### `ImageGallery.astro`

**Purpose**: Static image gallery display  
**Props**: Gallery images and configuration  
**Usage**: Photo galleries, portfolio sections

---

## 🚀 Usage Guidelines

### Framework Selection

- **Astro Components (`.astro`)**: Static content, SEO-critical pages, server-side rendering
- **React Components (`.tsx`)**: Interactive features, client-side state, complex user interactions

### Import Patterns

```astro
---
// Layout components
import Header from "@/components/layout/Header.astro";
import Container from "@/components/layout/Container.astro";

// Content components
import Hero from "@/components/content/Hero.astro";
import Card from "@/components/content/Card.astro";

// UI components (React)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
---
```

### Component Composition

```astro
<Header
  fixed={true}
  showThemeToggle={true}
  showLanguageSwitcher={true}
  currentLocale={locale}
  navItems={navigationItems}
/>

<main>
  <Hero
    title={t("hero.title", "Welcome")}
    subtitle={t("hero.subtitle", "Subtitle")}
    actions={heroActions}
    variant="centered"
  />

  <Container size="xl" padding="lg">
    <Card variant="elevated">
      <!-- Content -->
    </Card>
  </Container>
</main>
```

### Best Practices

1. **Always use translations**: Every user-facing text should use `t()` function
2. **Component reuse**: Check existing components before creating new ones
3. **Proper props**: Use TypeScript interfaces for all component props
4. **Accessibility**: Ensure proper ARIA labels, semantic HTML, and keyboard navigation
5. **Responsive design**: All components should work across device sizes
6. **Performance**: Use Astro for static content, React only when interactivity is needed

---

---

## 🤖 AI Assistant Guidelines

### Mandatory Actions Before Creating Components

1. **SEARCH THIS DOCUMENT**: Use Ctrl+F to search for keywords related to user request
2. **CHECK QUICK REFERENCE**: Review the table in "AI Quick Reference Guide" section
3. **ANALYZE EXISTING**: Look for components with similar purpose/functionality
4. **SUGGEST ALTERNATIVES**: Always mention existing components that could work
5. **JUSTIFY NEW CREATION**: Only create new components when no suitable alternative exists

### AI Response Template

```markdown
## Component Analysis

**User Request**: [summarize what user wants]
**Existing Alternatives Found**:

- Component1.astro: [why it could work / why it doesn't]
- Component2.tsx: [analysis]

**Recommendation**:

- ✅ REUSE: [existing component] with [modifications needed]
- ⚠️ EXTEND: [existing component] by adding [specific props/features]
- 🆕 CREATE: New component needed because [specific justification]

**Implementation**: [provide code/guidance]
```

### Search Keywords for AI Processing

**Navigation**: header, nav, menu, navigation, breadcrumb, mobile-menu  
**Forms**: form, input, button, textarea, contact, submit, validation  
**Content**: card, hero, content, blog, team, testimonial, pricing  
**Layout**: container, grid, flex, section, layout, wrapper  
**Interactive**: accordion, carousel, tabs, tooltip, dropdown, modal  
**Feedback**: alert, toast, loading, error, success, message  
**State**: loading, skeleton, empty, error, progress, spinner

### Component Naming Patterns

- **Astro Components**: `PascalCase.astro` (e.g., `Header.astro`)
- **React Components**: `PascalCase.tsx` (e.g., `ContactForm.tsx`)
- **UI Primitives**: `lowercase.tsx` (e.g., `button.tsx`)

---

## 📚 Additional Resources

- **[RULES.md](../../RULES.md)**: Development rules and guidelines
- **[CHECKLIST.md](../../CHECKLIST.md)**: Development checklist and validation
- **Component Types**: Check `src/types/` for TypeScript interfaces
- **Styling**: Global styles in `src/styles/global.css`
- **Translations**: Translation files in `src/i18n/messages/`
