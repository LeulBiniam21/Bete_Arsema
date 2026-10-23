<script>
  import { onMount } from 'svelte';
  import { getPlatformStats } from '#lib/teachersData.js';

  let { t } = $props();

  let liveStats = $state({
    studentsCount: 155,
    countriesCount: 20,
    yearsCount: 8,
    instrumentsCount: 4
  });

  function reloadStats() {
    liveStats = getPlatformStats();
  }

  onMount(() => {
    reloadStats();
    window.addEventListener('storage', reloadStats);
    return () => window.removeEventListener('storage', reloadStats);
  });

  /** @type {{ icon: string, target: number, suffix: string, label: string }[]} */
  const stats = $derived([
    { icon: '🎓', target: liveStats.studentsCount, suffix: '+', label: t.stats.students },
    { icon: '🌍', target: liveStats.countriesCount, suffix: '+', label: t.stats.countries },
    { icon: '📅', target: liveStats.yearsCount, suffix: '+', label: t.stats.years },
    { icon: '🎵', target: liveStats.instrumentsCount, suffix: '', label: t.stats.instruments },
  ]);

  /** Current displayed values (one per stat) */
  let counts = $state([0, 0, 0, 0]);

  /** Whether the animation has already played */
  let animated = $state(false);

  /** Root element ref for IntersectionObserver */
  let sectionEl = $state(null);

  /**
   * Smoothly animate a single counter from 0 → target over ~1500 ms
   * using requestAnimationFrame.
   * @param {number} index - index into counts[]
   * @param {number} target - final value
   */
  function animateCounter(index, target) {
    const duration = 1500;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      counts[index] = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  $effect(() => {
    if (!sectionEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animated) {
          animated = true;
          stats.forEach((s, i) => animateCounter(i, s.target));
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(sectionEl);
    return () => observer.disconnect();
  });
</script>

<!-- ============================================================
     STATS SECTION
     ============================================================ -->
<section
  id="stats"
  bind:this={sectionEl}
  class="relative w-full overflow-hidden bg-linear-to-r from-stone-900 via-amber-950 to-stone-900 py-16 sm:py-20"
  aria-label="Impact statistics"
>
  <!-- Decorative watermark cross -->
  <span
    class="pointer-events-none absolute inset-0 flex select-none items-center justify-center text-[22rem] font-bold leading-none text-amber-500/5"
    aria-hidden="true"
  >
    ✝
  </span>

  <div class="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

    <!-- Badge + heading -->
    <div class="mb-12 text-center">
      <span class="mb-4 inline-block rounded-full bg-amber-500/15 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-amber-400 ring-1 ring-amber-500/30">
        {t.stats.badge}
      </span>
      <h2 class="font-serif text-2xl font-bold text-white sm:text-3xl">
        {t.stats.title}
      </h2>
    </div>

    <!-- Stats grid -->
    <div class="grid grid-cols-2 gap-0 divide-x-0 lg:grid-cols-4">
      {#each stats as stat, i}
        <div
          class="group relative flex flex-col items-center gap-3 px-6 py-8 text-center
                 {i < stats.length - 1 ? 'lg:border-r lg:border-amber-500/20' : ''}
                 {i % 2 === 0 ? 'border-b border-amber-500/10 lg:border-b-0' : 'border-b border-amber-500/10 lg:border-b-0'}"
        >
          <!-- Icon -->
          <span class="text-3xl sm:text-4xl" aria-hidden="true">{stat.icon}</span>

          <!-- Animated number -->
          <p class="font-serif text-4xl font-bold text-amber-400 sm:text-5xl tabular-nums">
            {counts[i]}{stat.suffix}
          </p>

          <!-- Label -->
          <p class="text-xs font-semibold uppercase tracking-wider text-stone-300 sm:text-sm">
            {stat.label}
          </p>

          <!-- Subtle hover glow -->
          <span
            class="pointer-events-none absolute inset-0 rounded-xl opacity-0 ring-1 ring-amber-400/20 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden="true"
          ></span>
        </div>
      {/each}
    </div>

  </div>
</section>
