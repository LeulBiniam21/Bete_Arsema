<script>
  let { t, lang = 'en' } = $props();

  async function orderViaWhatsApp(item) {
    try {
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'WhatsApp Customer Lead',
          phone: 'WhatsApp / Pending',
          instrumentType: item,
          country: 'International',
          notes: `Initiated via Order Section (Language: ${lang})`
        })
      }).catch(() => {});
    } catch (e) {}

    const text = encodeURIComponent(
      `Hello Bete Arsema Academy!\nI would like to order an instrument:\nItem: ${item}\nLanguage: ${lang === 'am' ? 'Amharic' : 'English'}\nPlease provide delivery details & pricing.`
    );
    window.open(`https://wa.me/251968590145?text=${text}`, '_blank');
  }
</script>

<section id="order-instrument" class="py-24 bg-white border-b border-amber-900/10 relative overflow-hidden">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    <!-- Section Header -->
    <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
        <span>📦</span>
        <span>{t.order.badge}</span>
      </div>
      <h2 class="text-3xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight">
        {t.order.title}
      </h2>
      <p class="text-base sm:text-lg text-stone-600 leading-relaxed">
        {t.order.subtitle}
      </p>
    </div>

    <!-- 3 Instrument Order Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      <!-- Begena Order Card -->
      <div class="bg-amber-50/40 rounded-3xl p-8 border border-amber-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
        <div class="space-y-4">
          <div class="w-14 h-14 rounded-2xl bg-amber-800 text-amber-100 flex items-center justify-center text-2xl shadow-md shadow-amber-950/10 group-hover:scale-110 transition-transform">
            🎻
          </div>
          <span class="inline-block text-[11px] font-bold uppercase tracking-widest text-amber-800 bg-amber-200/60 px-2.5 py-0.5 rounded-full">
            {t.order.begenaCard.idealFor}
          </span>
          <h3 class="text-2xl font-serif font-bold text-stone-900">
            {t.order.begenaCard.title}
          </h3>
          <p class="text-sm text-stone-600 leading-relaxed">
            {t.order.begenaCard.desc}
          </p>
        </div>

        <div class="pt-6 mt-6 border-t border-amber-200/60">
          <button 
            onclick={() => orderViaWhatsApp('10-String Begena')}
            class="w-full py-3.5 px-4 rounded-full bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>💬</span>
            <span>{t.order.begenaCard.btn}</span>
          </button>
        </div>
      </div>

      <!-- Krar Order Card -->
      <div class="bg-amber-50/40 rounded-3xl p-8 border border-amber-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
        <div class="space-y-4">
          <div class="w-14 h-14 rounded-2xl bg-stone-900 text-amber-300 flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform">
            🪕
          </div>
          <span class="inline-block text-[11px] font-bold uppercase tracking-widest text-amber-800 bg-amber-200/60 px-2.5 py-0.5 rounded-full">
            {t.order.krarCard.idealFor}
          </span>
          <h3 class="text-2xl font-serif font-bold text-stone-900">
            {t.order.krarCard.title}
          </h3>
          <p class="text-sm text-stone-600 leading-relaxed">
            {t.order.krarCard.desc}
          </p>
        </div>

        <div class="pt-6 mt-6 border-t border-amber-200/60">
          <button 
            onclick={() => orderViaWhatsApp('Traditional Krar')}
            class="w-full py-3.5 px-4 rounded-full bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>💬</span>
            <span>{t.order.krarCard.btn}</span>
          </button>
        </div>
      </div>

      <!-- Washint Order Card -->
      <div class="bg-amber-50/40 rounded-3xl p-8 border border-amber-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
        <div class="space-y-4">
          <div class="w-14 h-14 rounded-2xl bg-amber-900 text-amber-100 flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform">
            🪈
          </div>
          <span class="inline-block text-[11px] font-bold uppercase tracking-widest text-amber-800 bg-amber-200/60 px-2.5 py-0.5 rounded-full">
            {t.order.washintCard.idealFor}
          </span>
          <h3 class="text-2xl font-serif font-bold text-stone-900">
            {t.order.washintCard.title}
          </h3>
          <p class="text-sm text-stone-600 leading-relaxed">
            {t.order.washintCard.desc}
          </p>
        </div>

        <div class="pt-6 mt-6 border-t border-amber-200/60">
          <button 
            onclick={() => orderViaWhatsApp('Bamboo Washint')}
            class="w-full py-3.5 px-4 rounded-full bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>💬</span>
            <span>{t.order.washintCard.btn}</span>
          </button>
        </div>
      </div>

    </div>

    <!-- Worldwide Shipping Notice -->
    <div class="mt-12 bg-linear-to-r from-amber-100/90 via-amber-50 to-amber-100/90 rounded-2xl p-4 sm:p-6 border border-amber-300/80 text-center text-stone-800 text-xs sm:text-sm font-semibold shadow-xs">
      {t.order.deliveryNotice}
    </div>

  </div>
</section>
