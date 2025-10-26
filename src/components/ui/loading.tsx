import { Loader2 } from "@lucide/astro";

export const Loading = () => (
  <button
    className={`btn btn-outline btn-md flex items-center gap-2`}
    disabled
    aria-label="Toggle theme"
  >
    <Loader2 class="h-4 w-4 animate-spin" />
  </button>
);
