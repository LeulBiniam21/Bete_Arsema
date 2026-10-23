<script>
  let { t, lang = 'en', onOpenBooking = () => {} } = $props();
</script>

<section id="video-demo" class="py-24 bg-white border-b border-amber-900/10">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <!-- Section Header -->
    <div class="text-center mb-14">
      <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-semibold tracking-wide mb-4">
        🎬 {t.videoDemo.badge}
      </span>
      <h2 class="font-serif font-bold text-3xl sm:text-4xl text-stone-900 mb-4">
        {t.videoDemo.title}
      </h2>
      <p class="text-stone-600 text-lg max-w-2xl mx-auto leading-relaxed">
        {t.videoDemo.subtitle}
      </p>
    </div>

    <!-- 2-Column Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

      <!-- Left Column: YouTube Embed -->
      <div>
        <div class="aspect-video rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30">
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Bete Arsema Sample Lesson"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="w-full h-full"
          ></iframe>
        </div>
        <p class="mt-3 text-center text-xs text-stone-400 italic">
          ⚙️ Replace with your actual YouTube video ID
        </p>
      </div>

      <!-- Right Column: Feature Points + CTA -->
      <div class="flex flex-col gap-6">
        <h3 class="font-serif font-bold text-2xl sm:text-3xl text-stone-900 leading-snug">
          {t.videoDemo.rightTitle}
        </h3>

        <ul class="flex flex-col gap-4">
          {#each [
            t.videoDemo.point1,
            t.videoDemo.point2,
            t.videoDemo.point3,
            t.videoDemo.point4
          ] as point}
            <li class="flex items-start gap-3">
              <span class="mt-0.5 text-xl shrink-0">✅</span>
              <span class="text-stone-700 text-base leading-relaxed">{point}</span>
            </li>
          {/each}
        </ul>

        <div class="pt-2">
          <button
            onclick={onOpenBooking}
            class="inline-flex items-center justify-center px-7 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-900 font-semibold text-base shadow-lg hover:shadow-amber-400/40 transition-all duration-200"
          >
            {t.videoDemo.ctaBtn}
          </button>
        </div>
      </div>

    </div>
  </div>
</section>
