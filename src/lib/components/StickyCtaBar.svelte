<script>
  /**
   * StickyCtaBar.svelte
   * Slim sticky banner that slides down below the navbar (z-30) after
   * the user scrolls past 600 px. Dismisses for the session.
   *
   * Props:
   *   t              – translations object (must contain t.ctaBar.message & t.ctaBar.btn)
   *   lang           – active language ('en' | 'am'), default 'en'
   *   onOpenBooking  – callback fired when the CTA button is clicked
   */

  let { t, lang = 'en', onOpenBooking = () => {} } = $props();

  /** Whether the user has dismissed the bar for this session */
  let dismissed = $state(false);

  /** Whether we've scrolled past the threshold */
  let pastThreshold = $state(false);

  $effect(() => {
    const THRESHOLD = 600;

    function onScroll() {
      pastThreshold = window.scrollY > THRESHOLD;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // Run once immediately in case page loads already scrolled
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  });

  /** Bar is visible when scrolled past threshold AND not dismissed */
  let visible = $derived(pastThreshold && !dismissed);
</script>

<!--
  Outer wrapper: fixed at top-0, full width, sits below the navbar (z-30 vs z-50).
  The inner div carries the slide-down transition via CSS transform.
  pointer-events:none on wrapper so it doesn't block clicks when hidden.
-->
<div
  class="fixed top-0 left-0 right-0 z-30 pointer-events-none"
  aria-live="polite"
  aria-atomic="true"
>
  <div
    class={[
      'pointer-events-auto',
      'bg-amber-700 text-white',
      'py-2.5 px-4',
      'flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5',
      'text-sm font-medium',
      'transition-transform duration-500 ease-out',
      'shadow-md shadow-amber-900/30',
      visible ? 'translate-y-0' : '-translate-y-full',
    ].join(' ')}
    role="banner"
  >
    <!-- Message -->
    <span class="text-center leading-snug tracking-wide">
      {t.ctaBar.message}
    </span>

    <!-- CTA Button -->
    <button
      onclick={onOpenBooking}
      class="shrink-0 rounded-full bg-white text-amber-800 font-semibold text-xs px-4 py-1.5 hover:bg-amber-50 active:scale-95 transition-all duration-150 shadow-sm"
      aria-label={t.ctaBar.btn}
    >
      {t.ctaBar.btn}
    </button>

    <!-- Dismiss button -->
    <button
      onclick={() => (dismissed = true)}
      class="absolute right-3 top-1/2 -translate-y-1/2 shrink-0 rounded-full p-1 hover:bg-amber-600/50 active:scale-90 transition-all duration-150"
      aria-label="Dismiss"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="size-4"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>
</div>
