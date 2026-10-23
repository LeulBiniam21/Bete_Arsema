<script>
  let { t, lang = 'en', onOpenBooking = () => {} } = $props();
</script>

<section id="geez-mezmur" class="py-24 bg-linear-to-b from-white via-amber-50/20 to-white border-b border-amber-900/10">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    <!-- Section Header -->
    <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
      <div class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
        <span>📜</span>
        <span>{t.geezMezmur.badge}</span>
      </div>
      <h2 class="text-3xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight">
        {t.geezMezmur.title}
      </h2>
      <p class="text-base sm:text-lg text-stone-600 leading-relaxed">
        {t.geezMezmur.subtitle}
      </p>
    </div>

    <!-- 2 Featured Large Cards Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
      
      <!-- Card 1: Ge'ez Language -->
      <div class="bg-gradient-to-br from-amber-950 via-stone-900 to-amber-950 text-white rounded-3xl p-8 sm:p-10 border border-amber-500/30 shadow-2xl flex flex-col justify-between relative overflow-hidden group">
        
        <!-- Watermark ornament background -->
        <div class="absolute -right-8 -bottom-8 text-9xl font-serif text-amber-500/10 select-none pointer-events-none font-bold">
          ግዕዝ
        </div>

        <div class="space-y-6 relative z-10">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center text-3xl shadow-lg">
              📜
            </div>
            <div>
              <span class="inline-block text-[11px] font-bold uppercase tracking-widest text-amber-400">
                Liturgy & Ancient Grammar
              </span>
              <h3 class="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
                {t.geezMezmur.geezTitle}
              </h3>
            </div>
          </div>

          <p class="text-sm sm:text-base text-stone-300 leading-relaxed">
            {t.geezMezmur.geezDesc}
          </p>

          <!-- Core Curriculum Points -->
          <div class="space-y-3 pt-2">
            <h4 class="text-xs font-bold uppercase tracking-widest text-amber-400 font-mono">
              {lang === 'am' ? 'የትምህርቱ ዋና ዋና ነጥቦች:' : 'Course Highlights:'}
            </h4>
            <ul class="space-y-2.5 text-sm text-stone-200">
              {#each t.geezMezmur.geezFeatures as feat}
                <li class="flex items-start gap-2.5">
                  <span class="text-amber-400 font-bold">✦</span>
                  <span>{feat}</span>
                </li>
              {/each}
            </ul>
          </div>
        </div>

        <div class="pt-8 mt-8 border-t border-amber-800/60 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="text-xs text-amber-200/80">
            {lang === 'am' ? 'ከጀማሪ ፊደላት እስከ ጥልቅ ሰዋስው' : 'From beginner letters to advanced grammar'}
          </div>
          <button 
            onclick={() => onOpenBooking('Ge\'ez Language Course')}
            class="w-full sm:w-auto px-6 py-3 rounded-full bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all transform hover:scale-105 cursor-pointer"
          >
            {t.geezMezmur.btn} &rarr;
          </button>
        </div>

      </div>

      <!-- Card 2: Orthodox Mezmur & Yaredic Zema -->
      <div class="bg-gradient-to-br from-stone-900 via-amber-950 to-stone-900 text-white rounded-3xl p-8 sm:p-10 border border-amber-500/30 shadow-2xl flex flex-col justify-between relative overflow-hidden group">
        
        <!-- Watermark ornament background -->
        <div class="absolute -right-8 -bottom-8 text-9xl font-serif text-amber-500/10 select-none pointer-events-none font-bold">
          ዜማ
        </div>

        <div class="space-y-6 relative z-10">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center text-3xl shadow-lg">
              🎶
            </div>
            <div>
              <span class="inline-block text-[11px] font-bold uppercase tracking-widest text-amber-400">
                St. Yared Hymnody & Chanting
              </span>
              <h3 class="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
                {t.geezMezmur.mezmurTitle}
              </h3>
            </div>
          </div>

          <p class="text-sm sm:text-base text-stone-300 leading-relaxed">
            {t.geezMezmur.mezmurDesc}
          </p>

          <!-- Core Curriculum Points -->
          <div class="space-y-3 pt-2">
            <h4 class="text-xs font-bold uppercase tracking-widest text-amber-400 font-mono">
              {lang === 'am' ? 'የትምህርቱ ዋና ዋና ነጥቦች:' : 'Course Highlights:'}
            </h4>
            <ul class="space-y-2.5 text-sm text-stone-200">
              {#each t.geezMezmur.mezmurFeatures as feat}
                <li class="flex items-start gap-2.5">
                  <span class="text-amber-400 font-bold">✦</span>
                  <span>{feat}</span>
                </li>
              {/each}
            </ul>
          </div>
        </div>

        <div class="pt-8 mt-8 border-t border-amber-800/60 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="text-xs text-amber-200/80">
            {lang === 'am' ? 'የዓቢይ ጾምና የዓመቱ በዓላት ዝማሬዎች' : 'Fasting hymns, feast days & vocal accompaniment'}
          </div>
          <button 
            onclick={() => onOpenBooking('Orthodox Mezmur & Zema')}
            class="w-full sm:w-auto px-6 py-3 rounded-full bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all transform hover:scale-105 cursor-pointer"
          >
            {t.geezMezmur.btn} &rarr;
          </button>
        </div>

      </div>

    </div>

  </div>
</section>
