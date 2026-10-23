<script>
  /** @type {{ t: any, lang?: string, onOpenBooking?: () => void }} */
  let { t, lang = 'en', onOpenBooking = () => {} } = $props();

  // Subject definitions with emoji, label key, and Tailwind colour classes
  const SUBJECTS = [
    {
      key: 'begena',
      emoji: '🪘',
      label: 'Begena',
      tag: 'bg-amber-100 text-amber-800 border border-amber-300',
      dot: 'bg-amber-400'
    },
    {
      key: 'krar',
      emoji: '🎵',
      label: 'Krar',
      tag: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
      dot: 'bg-emerald-400'
    },
    {
      key: 'washint',
      emoji: '🪈',
      label: 'Washint',
      tag: 'bg-sky-100 text-sky-800 border border-sky-300',
      dot: 'bg-sky-400'
    },
    {
      key: 'geez',
      emoji: '📖',
      label: "Ge'ez",
      tag: 'bg-purple-100 text-purple-800 border border-purple-300',
      dot: 'bg-purple-400'
    },
    {
      key: 'mezmur',
      emoji: '🎶',
      label: 'Mezmur',
      tag: 'bg-rose-100 text-rose-800 border border-rose-300',
      dot: 'bg-rose-400'
    }
  ];

  // Realistic fictional schedule
  // Rows = time slots [morning, afternoon, evening], Cols = days [Mon..Sun]
  // Each cell is an array of subject keys (empty = no class)
  const SCHEDULE = [
    // Morning (6–9 AM)
    [
      ['begena'],          // Mon
      ['krar'],            // Tue
      ['begena'],          // Wed
      ['krar'],            // Thu
      ['begena'],          // Fri
      ['washint', 'geez'], // Sat
      []                   // Sun – rest
    ],
    // Afternoon (12–3 PM)
    [
      ['geez'],               // Mon
      ['mezmur'],             // Tue
      ['geez'],               // Wed
      ['mezmur'],             // Thu
      ['geez'],               // Fri
      ['begena', 'mezmur'],   // Sat
      []                      // Sun – rest
    ],
    // Evening (6–9 PM)
    [
      ['begena', 'geez'],     // Mon
      ['krar', 'mezmur'],     // Tue
      ['begena', 'geez'],     // Wed
      ['krar', 'mezmur'],     // Thu
      ['washint'],            // Fri
      ['krar', 'washint'],    // Sat
      []                      // Sun – rest
    ]
  ];

  /** Look up a subject definition by key */
  function getSubject(key) {
    return SUBJECTS.find(s => s.key === key);
  }

  /** True if a column (day index) is Sunday (index 6) */
  function isSunday(dayIdx) {
    return dayIdx === 6;
  }
</script>

<section id="schedule" class="py-24 bg-white border-b border-amber-900/10">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <!-- Section Header -->
    <div class="text-center mb-14">
      <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-semibold tracking-wide mb-4">
        📅 {t.schedule.badge}
      </span>
      <h2 class="font-serif font-bold text-3xl sm:text-4xl text-stone-900 mb-4">
        {t.schedule.title}
      </h2>
      <p class="text-stone-500 max-w-2xl mx-auto text-base leading-relaxed">
        {t.schedule.subtitle}
      </p>
    </div>

    <!-- Schedule Table — horizontally scrollable on mobile -->
    <div class="overflow-x-auto rounded-2xl border border-amber-900/10 shadow-sm">
      <table class="min-w-full border-collapse">
        <thead>
          <tr class="bg-linear-to-r from-amber-950 via-stone-900 to-amber-950">
            <!-- Sticky time-slot header corner -->
            <th class="sticky left-0 z-10 bg-stone-950 px-4 py-4 text-left text-xs font-semibold text-amber-300 uppercase tracking-widest min-w-[130px] border-r border-amber-900/30">
              EAT (UTC+3)
            </th>
            {#each t.schedule.days as day, i}
              <th
                class="px-3 py-4 text-center text-sm font-bold min-w-[110px] border-r border-amber-900/20 last:border-r-0
                  {isSunday(i) ? 'text-stone-400 italic' : 'text-amber-100'}"
              >
                {day}
              </th>
            {/each}
          </tr>
        </thead>

        <tbody>
          {#each t.schedule.timeSlots as slot, rowIdx}
            <tr class="group {rowIdx % 2 === 0 ? 'bg-white' : 'bg-stone-50/60'}">

              <!-- Sticky first column: time slot label -->
              <td class="sticky left-0 z-10 px-4 py-4 text-xs font-semibold text-stone-600 bg-amber-50 border-r border-amber-900/10 whitespace-nowrap align-middle">
                <div class="flex items-center gap-2">
                  <span class="text-amber-500 text-base">
                    {rowIdx === 0 ? '🌅' : rowIdx === 1 ? '☀️' : '🌙'}
                  </span>
                  <span>{slot}</span>
                </div>
              </td>

              <!-- Day cells -->
              {#each SCHEDULE[rowIdx] as cellSubjects, dayIdx}
                <td
                  class="px-3 py-4 align-top border-r border-stone-100 last:border-r-0
                    {isSunday(dayIdx) ? 'bg-stone-50/80' : ''}"
                >
                  {#if isSunday(dayIdx)}
                    <!-- Sunday rest indicator -->
                    <div class="flex items-center justify-center h-full min-h-[40px]">
                      <span class="text-stone-300 text-xs italic select-none">
                        {t.schedule.restDay}
                      </span>
                    </div>
                  {:else if cellSubjects.length === 0}
                    <!-- Empty slot -->
                    <div class="flex items-center justify-center h-full min-h-[40px]">
                      <span class="text-stone-200 text-sm select-none">—</span>
                    </div>
                  {:else}
                    <!-- Subject tags -->
                    <div class="flex flex-col gap-1.5">
                      {#each cellSubjects as subjectKey}
                        {@const subj = getSubject(subjectKey)}
                        {#if subj}
                          <span
                            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap {subj.tag}"
                          >
                            <span>{subj.emoji}</span>
                            <span>{subj.label}</span>
                          </span>
                        {/if}
                      {/each}
                    </div>
                  {/if}
                </td>
              {/each}

            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Legend -->
    <div class="mt-8">
      <p class="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3 text-center">
        {t.schedule.legend}
      </p>
      <div class="flex flex-wrap justify-center gap-3">
        {#each SUBJECTS as subj}
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold {subj.tag}">
            <span class="w-2 h-2 rounded-full {subj.dot} shrink-0"></span>
            <span>{subj.emoji} {subj.label}</span>
          </span>
        {/each}
      </div>
    </div>

    <!-- Note + CTA -->
    <div class="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 px-6 py-6 rounded-2xl bg-linear-to-br from-stone-950 via-amber-950 to-stone-900 border border-amber-900/30">
      <p class="text-sm text-stone-300 leading-relaxed max-w-xl text-center sm:text-left">
        <span class="text-amber-400 font-semibold">ℹ️</span>
        {t.schedule.note}
      </p>
      <button
        onclick={onOpenBooking}
        class="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-bold text-sm transition-all duration-200 shadow-lg shadow-amber-900/30"
      >
        📅 {t.schedule.bookBtn}
      </button>
    </div>

  </div>
</section>
