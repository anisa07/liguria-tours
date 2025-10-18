/**
 * Accessibility Development Tools
 *
 * This module provides development tools for accessibility testing and validation.
 * Accessibility should be built into components themselves, not added as enhancement scripts.
 *
 * Available Development Tools:
 *
 * 1. AccessibilityAuditor: Development-only tool for automated accessibility testing with axe-core
 *
 * Usage:
 *
 * Use in your DevLayout for development-time accessibility testing:
 *
 * ```astro
 * ---
 * import AccessibilityAuditor from "@/components/accessibility/AccessibilityAuditor.astro";
 * ---
 *
 * <!-- Only shows in development mode -->
 * <AccessibilityAuditor />
 * ```
 *
 * Standards Compliance Testing:
 *
 * - WCAG 2.1 AA compliance validation
 * - Section 508 compliance checking
 * - Real-time accessibility violation detection
 * - Development-only with zero production impact
 *
 * Best Practices:
 *
 * ✅ Build accessibility into components from the start
 * ✅ Use semantic HTML elements
 * ✅ Provide proper ARIA labels and descriptions
 * ✅ Ensure keyboard navigation works
 * ✅ Test with real screen readers
 * ✅ Use AccessibilityAuditor to catch issues early
 *
 * ❌ Don't rely on runtime JavaScript to "fix" accessibility
 * ❌ Don't use generic enhancement scripts
 * ❌ Don't add accessibility as an afterthought
 */

// Type exports
export type { Props as AccessibilityAuditorProps } from "./AccessibilityAuditor.types";

// Note: To use AccessibilityAuditor component, import it directly:
// import AccessibilityAuditor from "@/components/accessibility/AccessibilityAuditor.astro";
