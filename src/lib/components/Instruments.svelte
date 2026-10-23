<script>
  import { 
    playInstrumentMelody, 
    stopMelody, 
    getPlayingInstrument 
  } from '#lib/audioEngine.js';

  let { t, lang = 'en', onOpenBooking = () => {} } = $props();

  let currentPlaying = $state(null); // 'begena', 'krar', 'washint', or null

  function handleAudioToggle(instrumentKey) {
    if (currentPlaying === instrumentKey) {
      stopMelody();
      currentPlaying = null;
    } else {
      currentPlaying = instrumentKey;
      playInstrumentMelody(
        instrumentKey,
        (step, total) => {
          // progress update if needed
        },
        () => {
          currentPlaying = null;
        }
      );
    }
  }
</script>

<section id="instruments" class="py-24 bg-amber-50/20 border-b border-amber-900/10">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    <!-- Section Header -->
    <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
        <span>🎵</span>
        <span>{t.instruments.badge}</span>
      </div>
      <h2 class="text-3xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight">
        {t.instruments.title}
      </h2>
      <p class="text-base sm:text-lg text-stone-600 leading-relaxed">
        {t.instruments.subtitle}
      </p>
    </div>

    <!-- 3 Instrument Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      <!-- 1. BEGENA -->
      <div class="bg-white rounded-3xl overflow-hidden border border-amber-200/80 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col group">
        <div class="relative h-64 overflow-hidden bg-stone-900">
          <img 
            src="/assets/begena/begena-hero.jpg" 
            alt={t.instruments.begena.name} 
            loading="lazy"
            decoding="async"
            width="400"
            height="256"
            class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div class="absolute top-4 left-4 bg-amber-700/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
            {t.instruments.begena.strings}
          </div>
          {#if currentPlaying === 'begena'}
            <div class="absolute top-4 right-4 flex items-center gap-1.5 bg-amber-900/90 backdrop-blur-xs text-amber-200 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              <span class="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>{t.instruments.playing}</span>
            </div>
          {/if}
        </div>
        
        <div class="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
          <div class="space-y-3">
            <h3 class="text-2xl font-serif font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
              {t.instruments.begena.name}
            </h3>
            <p class="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              {t.instruments.begena.subname}
            </p>
            <p class="text-sm text-stone-600 leading-relaxed">
              {t.instruments.begena.desc}
            </p>
          </div>

          <div class="pt-4 border-t border-amber-100 flex items-center justify-between gap-3">
            <!-- Audio Play Button -->
            <button 
              onclick={() => handleAudioToggle('begena')}
              aria-label="Play Begena Sound"
              class={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                currentPlaying === 'begena'
                  ? 'bg-amber-900 text-white ring-2 ring-amber-500'
                  : 'bg-amber-100 text-amber-950 hover:bg-amber-200'
              }`}
            >
              <span>{currentPlaying === 'begena' ? '⏹️' : '▶️'}</span>
              <span>{currentPlaying === 'begena' ? t.instruments.pauseSample : t.instruments.playSample}</span>
            </button>

            <!-- Book Class Link -->
            <button 
              onclick={() => onOpenBooking('Begena Class')}
              class="text-xs font-bold text-amber-700 hover:text-amber-900 hover:underline cursor-pointer"
            >
              {lang === 'am' ? 'ይማሩ →' : 'Learn This →'}
            </button>
          </div>
        </div>
      </div>

      <!-- 2. KRAR -->
      <div class="bg-white rounded-3xl overflow-hidden border border-amber-200/80 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col group">
        <div class="relative h-64 overflow-hidden bg-stone-900">
          <img 
            src="/assets/begena/krar-opt.jpg" 
            alt={t.instruments.krar.name} 
            loading="lazy"
            decoding="async"
            width="400"
            height="256"
            class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
          <div class="absolute top-4 left-4 bg-amber-700/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
            {t.instruments.krar.strings}
          </div>
          {#if currentPlaying === 'krar'}
            <div class="absolute top-4 right-4 flex items-center gap-1.5 bg-amber-900/90 backdrop-blur-xs text-amber-200 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              <span class="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>{t.instruments.playing}</span>
            </div>
          {/if}
        </div>
        
        <div class="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
          <div class="space-y-3">
            <h3 class="text-2xl font-serif font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
              {t.instruments.krar.name}
            </h3>
            <p class="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              {t.instruments.krar.subname}
            </p>
            <p class="text-sm text-stone-600 leading-relaxed">
              {t.instruments.krar.desc}
            </p>
          </div>

          <div class="pt-4 border-t border-amber-100 flex items-center justify-between gap-3">
            <!-- Audio Play Button -->
            <button 
              onclick={() => handleAudioToggle('krar')}
              aria-label="Play Krar Sound"
              class={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                currentPlaying === 'krar'
                  ? 'bg-amber-900 text-white ring-2 ring-amber-500'
                  : 'bg-amber-100 text-amber-950 hover:bg-amber-200'
              }`}
            >
              <span>{currentPlaying === 'krar' ? '⏹️' : '▶️'}</span>
              <span>{currentPlaying === 'krar' ? t.instruments.pauseSample : t.instruments.playSample}</span>
            </button>

            <!-- Book Class Link -->
            <button 
              onclick={() => onOpenBooking('Krar Class')}
              class="text-xs font-bold text-amber-700 hover:text-amber-900 hover:underline cursor-pointer"
            >
              {lang === 'am' ? 'ይማሩ →' : 'Learn This →'}
            </button>
          </div>
        </div>
      </div>

      <!-- 3. WASHINT -->
      <div class="bg-white rounded-3xl overflow-hidden border border-amber-200/80 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col group">
        <div class="relative h-64 overflow-hidden bg-stone-900">
          <img 
            src="/assets/begena/download (2).jpeg" 
            alt={t.instruments.washint.name} 
            loading="lazy"
            decoding="async"
            width="400"
            height="256"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div class="absolute top-4 left-4 bg-amber-700/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
            {t.instruments.washint.strings}
          </div>
          {#if currentPlaying === 'washint'}
            <div class="absolute top-4 right-4 flex items-center gap-1.5 bg-amber-900/90 backdrop-blur-xs text-amber-200 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              <span class="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>{t.instruments.playing}</span>
            </div>
          {/if}
        </div>
        
        <div class="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
          <div class="space-y-3">
            <h3 class="text-2xl font-serif font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
              {t.instruments.washint.name}
            </h3>
            <p class="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              {t.instruments.washint.subname}
            </p>
            <p class="text-sm text-stone-600 leading-relaxed">
              {t.instruments.washint.desc}
            </p>
          </div>

          <div class="pt-4 border-t border-amber-100 flex items-center justify-between gap-3">
            <!-- Audio Play Button -->
            <button 
              onclick={() => handleAudioToggle('washint')}
              aria-label="Play Washint Sound"
              class={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                currentPlaying === 'washint'
                  ? 'bg-amber-900 text-white ring-2 ring-amber-500'
                  : 'bg-amber-100 text-amber-950 hover:bg-amber-200'
              }`}
            >
              <span>{currentPlaying === 'washint' ? '⏹️' : '▶️'}</span>
              <span>{currentPlaying === 'washint' ? t.instruments.pauseSample : t.instruments.playSample}</span>
            </button>

            <!-- Book Class Link -->
            <button 
              onclick={() => onOpenBooking('Washint Class')}
              class="text-xs font-bold text-amber-700 hover:text-amber-900 hover:underline cursor-pointer"
            >
              {lang === 'am' ? 'ይማሩ →' : 'Learn This →'}
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>
