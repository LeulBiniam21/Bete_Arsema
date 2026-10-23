<script>
  let { t } = $props();

  const placeholderCards = [
    {
      emoji: '🎵',
      gradient: 'from-amber-900 via-amber-800 to-stone-900',
      name: 'Yohannes Tekeste',
      location: 'Washington D.C., USA',
      quote: 'Learning Begena online felt impossible — until Bete Arsema made it real.'
    },
    {
      emoji: '🎓',
      gradient: 'from-stone-900 via-amber-950 to-amber-900',
      name: 'Selam Haile',
      location: 'Stockholm, Sweden',
      quote: 'My Ge\'ez reading improved tremendously within just three months.'
    },
    {
      emoji: '📖',
      gradient: 'from-amber-800 via-stone-900 to-amber-950',
      name: 'Dawit Mengistu',
      location: 'Addis Ababa, Ethiopia',
      quote: 'The Washint lessons are beautifully structured, step by step.'
    },
    {
      emoji: '⛪',
      gradient: 'from-stone-950 via-amber-900 to-stone-900',
      name: 'Miriam Alemu',
      location: 'Toronto, Canada',
      quote: 'I can now lead Mezmur at my local church — a dream come true.'
    },
    {
      emoji: '🕊️',
      gradient: 'from-amber-950 via-stone-800 to-amber-900',
      name: 'Bereket Woldemichael',
      location: 'Melbourne, Australia',
      quote: 'The instructors are genuinely knowledgeable and deeply caring.'
    },
    {
      emoji: '🙏',
      gradient: 'from-stone-900 via-amber-800 to-stone-950',
      name: 'Tigist Girma',
      location: 'London, UK',
      quote: 'Bete Arsema reconnected me with my spiritual roots from afar.'
    }
  ];
</script>

<section
  id="gallery"
  class="py-24 bg-linear-to-b from-amber-50/30 to-stone-50 border-b border-amber-900/10"
>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

    <!-- Section Header -->
    <div class="text-center mb-14">
      <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-semibold tracking-wide mb-4">
        📸 {t.gallery.badge}
      </span>
      <h2 class="font-serif font-bold text-3xl sm:text-4xl text-stone-900 mb-4 leading-tight">
        {t.gallery.title}
      </h2>
      <p class="text-stone-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
        {t.gallery.subtitle}
      </p>
    </div>

    <!-- Masonry-style Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each placeholderCards as card}
        <div
          class="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-amber-100 hover:border-amber-300 transition-all duration-300 group hover:-translate-y-1"
        >
          <!-- Placeholder image area -->
          <div
            class="aspect-square bg-gradient-to-br {card.gradient} flex items-center justify-center relative overflow-hidden"
          >
            <!-- Subtle texture overlay -->
            <div class="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_white,_transparent_70%)]"></div>
            <span class="text-7xl drop-shadow-lg select-none" role="img" aria-hidden="true">
              {card.emoji}
            </span>
            <!-- Corner accent -->
            <div class="absolute bottom-0 right-0 w-16 h-16 bg-amber-500/20 rounded-tl-3xl"></div>
          </div>

          <!-- Card content -->
          <div class="p-5">
            <div class="flex items-start justify-between gap-2 mb-2">
              <h3 class="font-semibold text-stone-900 text-base leading-snug group-hover:text-amber-700 transition-colors">
                {card.name}
              </h3>
              <span class="shrink-0 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5 font-medium mt-0.5">
                ✈️
              </span>
            </div>
            <p class="text-xs text-stone-400 mb-3 flex items-center gap-1">
              <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {card.location}
            </p>
            <blockquote class="text-stone-600 text-sm leading-relaxed italic border-l-2 border-amber-300 pl-3">
              "{card.quote}"
            </blockquote>
          </div>
        </div>
      {/each}
    </div>

    <!-- Coming soon note -->
    <p class="mt-10 text-center text-sm text-stone-400 italic">
      {t.gallery.comingSoon}
    </p>

  </div>
</section>
