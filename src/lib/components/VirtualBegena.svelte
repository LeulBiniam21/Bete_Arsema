<script>
  import { onMount } from 'svelte';
  import { BEGENA_STRINGS, playBegenaString } from '#lib/audioEngine.js';

  let { t, lang = 'en' } = $props();

  let activeStringIndex = $state(null);
  let activeStringInfo = $state(null);

  function pluck(str) {
    activeStringIndex = str.index;
    activeStringInfo = str;
    playBegenaString(str.freq, 3.0);
    setTimeout(() => {
      if (activeStringIndex === str.index) {
        activeStringIndex = null;
      }
    }, 450);
  }

  // Handle keyboard numbers 1-9 and 0
  function handleKeyDown(event) {
    const key = event.key;
    let idx = -1;
    if (key >= '1' && key <= '9') {
      idx = parseInt(key, 10);
    } else if (key === '0') {
      idx = 10;
    }
    if (idx !== -1 && idx <= 10) {
      const str = BEGENA_STRINGS[idx - 1];
      if (str) {
        pluck(str);
      }
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });
</script>

<div class="mt-14 bg-linear-to-b from-stone-900 via-stone-950 to-stone-900 rounded-3xl p-6 sm:p-10 border border-amber-500/30 shadow-2xl text-white relative overflow-hidden">
  
  <!-- Subtle Header -->
  <div class="text-center max-w-2xl mx-auto mb-8 space-y-2">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-widest border border-amber-500/30">
      <span>🎼</span>
      <span>{t.instruments.virtualBegena.title}</span>
    </div>
    <p class="text-stone-300 text-sm">
      {t.instruments.virtualBegena.desc}
    </p>
    {#if activeStringInfo}
      <div class="inline-block px-4 py-1.5 mt-2 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-mono">
        Active: {lang === 'am' ? activeStringInfo.amharicName : activeStringInfo.name} ({activeStringInfo.note} • {activeStringInfo.freq} Hz)
      </div>
    {/if}
  </div>

  <!-- Begena Harp Wooden Frame Mockup -->
  <div class="max-w-4xl mx-auto relative bg-gradient-to-b from-amber-950/80 to-stone-900/90 rounded-2xl p-6 border-4 border-amber-800/60 shadow-inner">
    
    <!-- Top Crossbar (Yoke / ብርኩማ) -->
    <div class="h-6 bg-linear-to-r from-amber-900 via-amber-700 to-amber-900 rounded-md border-b-2 border-amber-600/40 flex items-center justify-around px-4 shadow-md">
      {#each BEGENA_STRINGS as str}
        <div class="w-2.5 h-2.5 rounded-full bg-amber-300/80 shadow-xs ring-1 ring-amber-950"></div>
      {/each}
    </div>

    <!-- 10 Strings Area -->
    <div class="py-10 px-2 sm:px-6 grid grid-cols-10 gap-1.5 sm:gap-3 items-center justify-items-center">
      {#each BEGENA_STRINGS as str}
        {@const isActive = activeStringIndex === str.index}
        <button
          onclick={() => pluck(str)}
          aria-label={`String ${str.index}`}
          class="group flex flex-col items-center cursor-pointer focus:outline-hidden transition-all relative w-full"
        >
          <!-- Top string key number -->
          <span class="text-[10px] sm:text-xs font-mono font-bold text-amber-400/80 group-hover:text-amber-200 mb-2 transition-colors">
            {str.index === 10 ? '0' : str.index}
          </span>

          <!-- The String Graphic -->
          <div class="relative w-full flex justify-center py-2">
            <div 
              class={`w-1 sm:w-1.5 h-44 sm:h-56 rounded-full transition-all duration-75 ${
                isActive 
                  ? 'bg-amber-300 shadow-[0_0_15px_#f59e0b] scale-x-150 animate-vibrate' 
                  : 'bg-linear-to-b from-amber-600/60 via-amber-200/50 to-amber-600/70 group-hover:bg-amber-300/80'
              }`}
            ></div>
            
            <!-- Bridge Leather Pad ("Ensera") Indicator -->
            <div class="absolute bottom-6 w-3 h-2 bg-amber-900 rounded-xs border border-amber-600/50"></div>
          </div>

          <!-- Bottom Note Label -->
          <span class="mt-2 text-[9px] sm:text-[11px] font-sans font-medium text-stone-400 group-hover:text-amber-300">
            {lang === 'am' ? str.amharicName : str.label}
          </span>
        </button>
      {/each}
    </div>

    <!-- Bottom Soundbox Bridge (ብርክ / ድልድይ) -->
    <div class="h-8 bg-linear-to-r from-amber-900 via-amber-800 to-amber-900 rounded-lg border-t-2 border-amber-600/60 flex items-center justify-center shadow-lg">
      <span class="text-[11px] uppercase tracking-widest text-amber-200/70 font-serif">
        {lang === 'am' ? 'የዳዊት በገና 10 አውታሮች' : 'Sacred Begena 10-String Bridge'}
      </span>
    </div>

  </div>

  <div class="text-center mt-4 text-xs text-stone-400">
    💡 <span class="font-medium text-amber-300">{lang === 'am' ? 'ምክር:' : 'Tip:'}</span> {lang === 'am' ? 'በኮምፒውተርዎ ላይ ቁልፎችን 1 እስከ 0 በመንካት አውታሮቹን በቀጥታ መጫወት ይችላሉ።' : 'You can also press keyboard keys 1 through 0 to pluck the strings directly.'}
  </div>

</div>
