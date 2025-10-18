/**
 * Simple scroll animations fallback for older browsers
 * Modern browsers use CSS animation-timeline, this is just a progressive enhancement
 */

let observer: any;

export function initSimpleScrollAnimations(): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  // Check if modern CSS animations are supported
  try {
    if (
      window.CSS &&
      window.CSS.supports &&
      window.CSS.supports("animation-timeline", "view()")
    ) {
      return; // Use CSS animations, no JS needed
    }
  } catch {
    // Continue with JS fallback
  }

  // Clean up existing observer
  if (observer) observer.disconnect();

  const elements = document.querySelectorAll(
    ".animate-fade-up, .animate-fade-in, .animate-slide-left"
  );
  if (elements.length === 0) return;

  observer = new window.IntersectionObserver(
    (entries: any[]) => {
      entries.forEach((entry: any) => {
        if (entry.isIntersecting) {
          const delay = getElementDelay(entry.target);
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  elements.forEach((element: any) => observer.observe(element));
}

function getElementDelay(element: any): number {
  const classList = element.classList;
  if (classList.contains("animate-delay-1")) return 100;
  if (classList.contains("animate-delay-2")) return 200;
  if (classList.contains("animate-delay-3")) return 300;
  if (classList.contains("animate-delay-4")) return 400;
  if (classList.contains("animate-delay-5")) return 500;
  return 0;
}

export function initScrollAnimationsWhenReady(): void {
  if (typeof window === "undefined") return;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSimpleScrollAnimations);
  } else {
    initSimpleScrollAnimations();
  }
}

// Auto-initialize
initScrollAnimationsWhenReady();

// Re-initialize on SPA navigation
document.addEventListener("astro:page-load", initSimpleScrollAnimations);
