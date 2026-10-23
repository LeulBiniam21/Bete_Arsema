<script>
  import { onMount } from 'svelte';

  let visible = $state(false);

  onMount(() => {
    function handleScroll() {
      visible = window.scrollY > 400;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount in case page is already scrolled
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<div class="fixed bottom-6 left-6 z-40">
  <div class="group relative">
    <!-- Tooltip -->
    <span
      class="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-stone-900 px-2.5 py-1 text-xs font-medium text-amber-100 opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100"
    >
      Back to top
    </span>

    <!-- Button -->
    <button
      onclick={scrollToTop}
      aria-label="Back to top"
      class="flex h-11 w-11 items-center justify-center rounded-full border border-amber-500/30 bg-amber-700 text-white shadow-xl transition-all duration-300 hover:bg-amber-600 hover:shadow-amber-900/40
        {visible
          ? 'pointer-events-auto opacity-100 translate-y-0'
          : 'pointer-events-none opacity-0 translate-y-2'}"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="h-5 w-5"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0 1 10 17Z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>
</div>
