<script>
  let { t } = $props();
</script>

<section id="about" class="py-20 bg-white border-y border-amber-900/5">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    <!-- Section Header -->
    <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
        <span>✦</span>
        <span>{t.about.badge}</span>
      </div>
      <h2 class="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
        {t.about.title}
      </h2>
      <p class="text-base sm:text-lg text-stone-600 leading-relaxed">
        {t.about.desc1}
      </p>
    </div>

    <!-- 3 Core Feature Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      <!-- Card 1 -->
      <div class="relative bg-amber-50/40 rounded-2xl p-8 border border-amber-200/60 hover:border-amber-400 hover:shadow-xl transition-all duration-300 group">
        <div class="w-14 h-14 rounded-xl bg-amber-700 text-white flex items-center justify-center text-2xl mb-6 shadow-md shadow-amber-900/10 group-hover:scale-110 transition-transform">
          📜
        </div>
        <h3 class="text-xl font-serif font-bold text-stone-900 mb-3 group-hover:text-amber-800 transition-colors">
          {t.about.card1_title}
        </h3>
        <p class="text-sm text-stone-600 leading-relaxed">
          {t.about.card1_desc}
        </p>
      </div>

      <!-- Card 2 -->
      <div class="relative bg-amber-50/40 rounded-2xl p-8 border border-amber-200/60 hover:border-amber-400 hover:shadow-xl transition-all duration-300 group">
        <div class="w-14 h-14 rounded-xl bg-amber-700 text-white flex items-center justify-center text-2xl mb-6 shadow-md shadow-amber-900/10 group-hover:scale-110 transition-transform">
          🕒
        </div>
        <h3 class="text-xl font-serif font-bold text-stone-900 mb-3 group-hover:text-amber-800 transition-colors">
          {t.about.card2_title}
        </h3>
        <p class="text-sm text-stone-600 leading-relaxed">
          {t.about.card2_desc}
        </p>
      </div>

      <!-- Card 3 -->
      <div class="relative bg-amber-50/40 rounded-2xl p-8 border border-amber-200/60 hover:border-amber-400 hover:shadow-xl transition-all duration-300 group">
        <div class="w-14 h-14 rounded-xl bg-amber-700 text-white flex items-center justify-center text-2xl mb-6 shadow-md shadow-amber-900/10 group-hover:scale-110 transition-transform">
          🎓
        </div>
        <h3 class="text-xl font-serif font-bold text-stone-900 mb-3 group-hover:text-amber-800 transition-colors">
          {t.about.card3_title}
        </h3>
        <p class="text-sm text-stone-600 leading-relaxed">
          {t.about.card3_desc}
        </p>
      </div>

    </div>

    <!-- Secondary highlight showcase banner -->
    <div class="mt-16 bg-linear-to-r from-stone-900 via-amber-950 to-stone-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
      <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div class="lg:col-span-8 space-y-4">
          <span class="text-amber-400 text-xs font-bold uppercase tracking-widest">Spiritual & Cultural Mission</span>
          <h3 class="text-2xl sm:text-3xl font-serif font-bold">
            "Connecting Our Youth and Community with Sacred Roots"
          </h3>
          <p class="text-stone-300 text-sm sm:text-base leading-relaxed">
            {t.about.desc2}
          </p>
        </div>
        <div class="lg:col-span-4 flex justify-center lg:justify-end">
          <a 
            href="#pricing"
            class="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-full shadow-lg transition-all transform hover:-translate-y-0.5 text-sm"
          >
            {t.nav.pricing} &rarr;
          </a>
        </div>
      </div>
    </div>

  </div>
</section>
