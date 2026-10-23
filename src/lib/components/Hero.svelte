<script>
  import { onMount } from 'svelte';
  import { playInstrumentMelody, stopMelody } from '#lib/audioEngine.js';
  import { getPlatformStats } from '#lib/teachersData.js';

  let { t, lang = 'en', onOpenBooking = () => {} } = $props();

  let isPlayingAudio = $state(false);
  let activeView = $state('instrument'); // 'instrument' | 'prayer'
  let liveStats = $state({ studentsCount: 155 });

  function reloadStats() {
    liveStats = getPlatformStats();
  }

  onMount(() => {
    reloadStats();
    window.addEventListener('storage', reloadStats);
    return () => window.removeEventListener('storage', reloadStats);
  });

  function toggleBegenaAudio() {
    if (isPlayingAudio) {
      stopMelody();
      isPlayingAudio = false;
    } else {
      isPlayingAudio = true;
      playInstrumentMelody(
        'begena',
        (step, total) => {},
        () => {
          isPlayingAudio = false;
        }
      );
    }
  }
</script>

<section id="welcome" class="relative overflow-hidden pt-8 pb-16 md:py-20 bg-linear-to-b from-amber-100/50 via-amber-50/20 to-white">
  <!-- Subtle decorative ambient background glow -->
  <div class="absolute inset-0 pointer-events-none opacity-25">
    <div class="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-amber-400 blur-3xl"></div>
    <div class="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-amber-600 blur-3xl"></div>
  </div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
      
      <!-- Text Column (7 cols) -->
      <div class="lg:col-span-7 text-center lg:text-left space-y-6">
        
        <!-- Sacred Badge -->
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-xs sm:text-sm font-semibold tracking-wide shadow-2xs">
          <span class="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
          <span>{t.hero.badge}</span>
        </div>

        <!-- Hero Headline -->
        <h1 class="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-serif font-bold text-stone-900 tracking-tight leading-[1.15]">
          {t.hero.title}
        </h1>

        <!-- Subtitle -->
        <p class="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
          {t.hero.subtitle}
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
          <a 
            href="#instruments" 
            class="w-full sm:w-auto px-7 py-3.5 text-center text-sm font-bold text-white bg-linear-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 rounded-full shadow-lg shadow-amber-900/15 hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            {t.hero.discoverBtn} &darr;
          </a>
          <button 
            onclick={() => onOpenBooking('Free Consultation')}
            class="w-full sm:w-auto px-7 py-3.5 text-center text-sm font-bold text-amber-950 bg-amber-100/90 hover:bg-amber-200 border border-amber-300/80 rounded-full transition-all cursor-pointer shadow-xs hover:shadow-md"
          >
            {t.hero.bookBtn}
          </button>
        </div>

        <!-- Trust Stats Badges -->
        <div class="pt-8 border-t border-amber-900/10 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
          <div class="text-center lg:text-left">
            <span class="block text-2xl sm:text-3xl font-extrabold text-amber-800 font-serif">{liveStats.studentsCount}+</span>
            <span class="text-xs text-stone-600 font-medium">{t.hero.stat1_lbl}</span>
          </div>
          <div class="text-center lg:text-left border-x border-amber-200/60 px-2">
            <span class="block text-2xl sm:text-3xl font-extrabold text-amber-800 font-serif">{t.hero.stat2_num}</span>
            <span class="text-xs text-stone-600 font-medium">{t.hero.stat2_lbl}</span>
          </div>
          <div class="text-center lg:text-left">
            <span class="block text-2xl sm:text-3xl font-extrabold text-amber-800 font-serif">{t.hero.stat3_num}</span>
            <span class="text-xs text-stone-600 font-medium">{t.hero.stat3_lbl}</span>
          </div>
        </div>

      </div>

      <!-- Hero Visual Card (5 cols) - Masterpiece UI/UX Card -->
      <div class="lg:col-span-5">
        <div class="relative mx-auto max-w-md lg:max-w-none">
          
          <!-- Golden Ambient Backlight Glow -->
          <div class="absolute -inset-2 bg-linear-to-tr from-amber-500/30 via-amber-400/20 to-amber-600/30 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
          
          <!-- Main Card Container -->
          <div class="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-300/70 bg-stone-950 group">
            
            <!-- Top Controls Overlay Bar -->
            <div class="absolute top-3 inset-x-3 z-20 flex items-center justify-between gap-2 pointer-events-auto">
              
              <!-- Left Pill: Instrument Type & Strings -->
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md text-amber-200 border border-amber-400/40 text-[11px] font-bold shadow-md">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span>{lang === 'am' ? 'የዳዊት በገና • 10 አውታሮች' : "King David's Begena • 10 Strings"}</span>
              </span>

              <!-- Right Switcher: Instrument / In Prayer View -->
              <div class="inline-flex p-0.5 rounded-full bg-stone-950/80 backdrop-blur-md border border-amber-400/30 text-[10px] font-bold text-stone-300 shadow-md">
                <button 
                  onclick={() => (activeView = 'instrument')}
                  class={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                    activeView === 'instrument' 
                      ? 'bg-amber-600 text-white shadow-xs' 
                      : 'hover:text-amber-200'
                  }`}
                  aria-label="View Handcrafted Begena Instrument"
                >
                  {lang === 'am' ? 'መሣሪያው' : 'Instrument'}
                </button>
                <button 
                  onclick={() => (activeView = 'prayer')}
                  class={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                    activeView === 'prayer' 
                      ? 'bg-amber-600 text-white shadow-xs' 
                      : 'hover:text-amber-200'
                  }`}
                  aria-label="View Begena in Spiritual Prayer"
                >
                  {lang === 'am' ? 'በጸሎት' : 'In Prayer'}
                </button>
              </div>

            </div>

            <!-- Image Stage with Cross Window Backdrop -->
            <div class="relative h-[360px] sm:h-[400px] overflow-hidden bg-stone-900">
              <img 
                src={activeView === 'instrument' ? '/assets/begena/begena-hero.jpg' : '/assets/begena/begena-prayer.jpg'} 
                alt="Sacred Begena (King David's Harp)" 
                width="600"
                height="500"
                fetchpriority="high"
                loading="eager"
                decoding="async"
                class="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
              />
              
              <!-- Subtle bottom gradient feathering -->
              <div class="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-stone-950 via-stone-950/60 to-transparent pointer-events-none"></div>

              <!-- Interactive Floating Audio Play/Pause Button on Image -->
              <div class="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between gap-2">
                <button 
                  onclick={toggleBegenaAudio}
                  class={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xl cursor-pointer backdrop-blur-md border ${
                    isPlayingAudio 
                      ? 'bg-amber-500 text-stone-950 border-amber-300 ring-2 ring-amber-300/60 scale-102' 
                      : 'bg-stone-900/90 text-amber-200 hover:bg-amber-700 hover:text-white border-amber-400/40'
                  }`}
                  aria-label="Listen to Begena acoustic sound sample"
                >
                  {#if isPlayingAudio}
                    <span class="text-sm">⏹️</span>
                    <span>{lang === 'am' ? 'ድምፅ አቁም' : 'Stop Audio'}</span>
                    <!-- Animated soundwave equalizer bars -->
                    <span class="flex items-end gap-0.5 h-3 ml-1">
                      <span class="w-1 bg-stone-950 rounded-full animate-[soundwave_0.8s_ease-in-out_infinite] h-3"></span>
                      <span class="w-1 bg-stone-950 rounded-full animate-[soundwave_1.1s_ease-in-out_infinite] h-2"></span>
                      <span class="w-1 bg-stone-950 rounded-full animate-[soundwave_0.9s_ease-in-out_infinite] h-3.5"></span>
                    </span>
                  {:else}
                    <span class="text-sm">▶️</span>
                    <span>{lang === 'am' ? 'የበገናውን ዜማ ያዳምጡ' : 'Listen Begena Acoustic'}</span>
                  {/if}
                </button>

                <!-- Rating Pill -->
                <span class="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-stone-950/80 backdrop-blur-md text-amber-300 text-[11px] font-bold border border-amber-400/30">
                  <span>⭐ 4.9</span>
                  <span class="text-stone-300 font-normal">| {lang === 'am' ? 'ተመራጭ' : 'Top Choice'}</span>
                </span>
              </div>

            </div>
            
            <!-- Bottom Content Card: Pristine Layout with Features -->
            <div class="p-5 sm:p-6 bg-linear-to-b from-stone-950 via-stone-900 to-stone-950 text-white border-t border-amber-500/30 space-y-3">
              
              <!-- Badge Row -->
              <div class="flex items-center justify-between gap-2">
                <span class="inline-block px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-amber-500 text-stone-950 rounded-md shadow-xs">
                  {lang === 'am' ? 'በገና • የንጉሥ ዳዊት በገና' : 'በገና • THE HARP OF KING DAVID'}
                </span>
                <span class="text-xs font-semibold text-amber-300">
                  10 {lang === 'am' ? 'አውታሮች' : 'Strings'}
                </span>
              </div>

              <!-- Main Caption -->
              <p class="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {lang === 'am'
                  ? 'ለጸሎት፣ ለመንፈሳዊ አስተንትኖ እና ለጾም ወራት ዜማ ብቻ የሚያገለግል የተቀደሰ መሣሪያ።'
                  : 'Sacred instrument dedicated for prayer, spiritual fasting Zema, and deep reflection.'}
              </p>

              <!-- Feature Highlights -->
              <div class="pt-2 flex flex-wrap items-center gap-2 text-[11px] font-medium text-amber-200/90 border-t border-white/10">
                <span class="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">✓ {lang === 'am' ? '10 የአንጀት አውታሮች' : '10 Gut Strings'}</span>
                <span class="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">✓ {lang === 'am' ? 'የዋንዛ እንጨትና ቆዳ' : 'Wanza Wood & Parchment'}</span>
                <span class="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">✓ {lang === 'am' ? '1-ለ-1 የቪዲዮ ስልጠና' : '1-on-1 Online Class'}</span>
              </div>

            </div>

          </div>
        </div>
      </div>

    </div>
  </div>
</section>

<style>
  @keyframes soundwave {
    0%, 100% { height: 4px; }
    50% { height: 14px; }
  }
</style>
