<script>
  let { t, lang = 'en', onOpenBooking = () => {} } = $props();

  let showDiasporaCurrency = $state(false);
</script>

<section id="pricing" class="py-24 bg-linear-to-b from-amber-50/40 via-white to-amber-50/30 border-b border-amber-900/10">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    <!-- Section Header -->
    <div class="text-center max-w-3xl mx-auto mb-12 space-y-4">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
        <span>💎</span>
        <span>{t.pricing.badge}</span>
      </div>
      <h2 class="text-3xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight">
        {t.pricing.title}
      </h2>
      <p class="text-base sm:text-lg text-stone-600 leading-relaxed">
        {t.pricing.subtitle}
      </p>

      <!-- Currency Switcher Pill -->
      <div class="inline-flex items-center gap-2 p-1 bg-amber-100/70 border border-amber-300 rounded-full text-xs font-bold mt-4">
        <button 
          onclick={() => showDiasporaCurrency = false}
          class={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
            !showDiasporaCurrency ? 'bg-amber-800 text-white shadow-xs' : 'text-stone-700 hover:text-stone-900'
          }`}
        >
          {lang === 'am' ? 'የኢትዮጵያ ብር (ETB)' : 'Ethiopian Birr (ETB)'}
        </button>
        <button 
          onclick={() => showDiasporaCurrency = true}
          class={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
            showDiasporaCurrency ? 'bg-amber-800 text-white shadow-xs' : 'text-stone-700 hover:text-stone-900'
          }`}
        >
          {lang === 'am' ? 'የውጭ ሀገር (USD / USDT)' : 'Diaspora (USD / USDT)'}
        </button>
      </div>
    </div>

    <!-- 3 Pricing Cards -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
      
      <!-- Tier 1: Starter -->
      <div class="bg-white rounded-3xl p-8 border border-amber-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
        <div class="space-y-6">
          <div>
            <h3 class="text-2xl font-serif font-bold text-stone-900 mb-1">{t.pricing.starter.name}</h3>
            <p class="text-xs text-stone-500">{t.pricing.starter.desc}</p>
          </div>

          <div class="flex items-baseline gap-2">
            {#if showDiasporaCurrency}
              <span class="text-4xl font-extrabold text-stone-900 font-serif">{t.pricing.starter.diasporaPrice}</span>
            {:else}
              <span class="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif">{t.pricing.starter.price}</span>
              <span class="text-sm font-bold text-stone-500">{t.pricing.starter.currency}</span>
            {/if}
            <span class="text-xs text-stone-400">{t.pricing.period}</span>
          </div>

          <ul class="space-y-3 pt-4 border-t border-amber-100 text-sm text-stone-600">
            {#each t.pricing.starter.features as f}
              <li class="flex items-start gap-2.5">
                <span class="text-amber-700 font-bold">✓</span>
                <span>{f}</span>
              </li>
            {/each}
          </ul>
        </div>

        <div class="pt-8 mt-6 border-t border-amber-100">
          <button 
            onclick={() => onOpenBooking(t.pricing.starter.name)}
            class="w-full py-3.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-sm transition-all shadow-xs cursor-pointer"
          >
            {t.pricing.starter.btn}
          </button>
        </div>
      </div>

      <!-- Tier 2: Premium (Featured) -->
      <div class="bg-linear-to-b from-amber-950 via-stone-900 to-amber-950 text-white rounded-3xl p-8 border-2 border-amber-400 shadow-2xl relative flex flex-col justify-between transform lg:-translate-y-2">
        <!-- Floating popular badge -->
        <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-stone-950 text-xs uppercase font-extrabold px-4 py-1 rounded-full shadow-md">
          {t.pricing.premium.badge}
        </div>

        <div class="space-y-6">
          <div class="pt-2">
            <h3 class="text-2xl font-serif font-bold text-white mb-1">{t.pricing.premium.name}</h3>
            <p class="text-xs text-amber-200/80">{t.pricing.premium.desc}</p>
          </div>

          <div class="flex items-baseline gap-2">
            {#if showDiasporaCurrency}
              <span class="text-4xl font-extrabold text-amber-300 font-serif">{t.pricing.premium.diasporaPrice}</span>
            {:else}
              <span class="text-3xl sm:text-4xl font-extrabold text-amber-300 font-serif">{t.pricing.premium.price}</span>
              <span class="text-sm font-bold text-amber-200">{t.pricing.premium.currency}</span>
            {/if}
            <span class="text-xs text-stone-300">{t.pricing.period}</span>
          </div>

          <ul class="space-y-3 pt-4 border-t border-amber-800/60 text-sm text-stone-200">
            {#each t.pricing.premium.features as f}
              <li class="flex items-start gap-2.5">
                <span class="text-amber-400 font-bold">✓</span>
                <span>{f}</span>
              </li>
            {/each}
          </ul>
        </div>

        <div class="pt-8 mt-6 border-t border-amber-800/60">
          <button 
            onclick={() => onOpenBooking(t.pricing.premium.name)}
            class="w-full py-3.5 rounded-full bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-sm transition-all shadow-lg cursor-pointer transform hover:scale-[1.02]"
          >
            {t.pricing.premium.btn}
          </button>
        </div>
      </div>

      <!-- Tier 3: Advanced -->
      <div class="bg-white rounded-3xl p-8 border border-amber-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
        <div class="space-y-6">
          <div>
            <h3 class="text-2xl font-serif font-bold text-stone-900 mb-1">{t.pricing.advanced.name}</h3>
            <p class="text-xs text-stone-500">{t.pricing.advanced.desc}</p>
          </div>

          <div class="flex items-baseline gap-2">
            {#if showDiasporaCurrency}
              <span class="text-4xl font-extrabold text-stone-900 font-serif">{t.pricing.advanced.diasporaPrice}</span>
            {:else}
              <span class="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif">{t.pricing.advanced.price}</span>
              <span class="text-sm font-bold text-stone-500">{t.pricing.advanced.currency}</span>
            {/if}
            <span class="text-xs text-stone-400">{t.pricing.period}</span>
          </div>

          <ul class="space-y-3 pt-4 border-t border-amber-100 text-sm text-stone-600">
            {#each t.pricing.advanced.features as f}
              <li class="flex items-start gap-2.5">
                <span class="text-amber-700 font-bold">✓</span>
                <span>{f}</span>
              </li>
            {/each}
          </ul>
        </div>

        <div class="pt-8 mt-6 border-t border-amber-100">
          <button 
            onclick={() => onOpenBooking(t.pricing.advanced.name)}
            class="w-full py-3.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-sm transition-all shadow-xs cursor-pointer"
          >
            {t.pricing.advanced.btn}
          </button>
        </div>
      </div>

    </div>

    <!-- Supported Payment Methods Banner -->
    <div class="mt-12 bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
      <div class="flex items-center gap-2 text-stone-700 font-medium">
        <span class="text-base">💳</span>
        <span>
          {lang === 'am' 
            ? 'ተቀባይነት ያላቸው የመክፈያ አማራጮች: ቴሌብር (Telebirr)፣ የኢትዮጵያ ንግድ ባንክ (CBE)፣ USDT (TRC-20/TON)፣ PayPal እና Zelle' 
            : 'Accepted Payment Methods: Telebirr & CBE Bank (Local) | USDT (TRC-20 / TON Crypto), PayPal, Zelle & Wire (Diaspora)'}
        </span>
      </div>
      <div class="flex items-center gap-2 font-bold text-amber-800">
        <span class="px-2.5 py-1 rounded-md bg-amber-100">Telebirr</span>
        <span class="px-2.5 py-1 rounded-md bg-amber-100">CBE</span>
        <span class="px-2.5 py-1 rounded-md bg-amber-100">USDT</span>
        <span class="px-2.5 py-1 rounded-md bg-amber-100">PayPal</span>
      </div>
    </div>

  </div>
</section>
