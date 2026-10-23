<script>
  let { t } = $props();

  let openFaq = $state(0); // index of currently open FAQ

  function toggleFaq(index) {
    openFaq = openFaq === index ? -1 : index;
  }

  const faqList = [
    { qKey: "q1", aKey: "a1" },
    { qKey: "q2", aKey: "a2" },
    { qKey: "q3", aKey: "a3" },
    { qKey: "q4", aKey: "a4" },
    { qKey: "q5", aKey: "a5" }
  ];
</script>

<section id="faq" class="py-24 bg-white border-b border-amber-900/10">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    
    <!-- Section Header -->
    <div class="text-center mb-16 space-y-4">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
        <span>❓</span>
        <span>{t.faq.badge}</span>
      </div>
      <h2 class="text-3xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight">
        {t.faq.title}
      </h2>
      <p class="text-base sm:text-lg text-stone-600 leading-relaxed">
        {t.faq.subtitle}
      </p>
    </div>

    <!-- Accordion List -->
    <div class="space-y-4">
      {#each faqList as item, index}
        {@const isOpen = openFaq === index}
        <div class="rounded-2xl border border-amber-200/80 overflow-hidden bg-amber-50/30 transition-all duration-200">
          <!-- Accordion Header Button -->
          <button 
            onclick={() => toggleFaq(index)}
            class="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-serif font-bold text-base sm:text-lg text-stone-900 hover:text-amber-800 transition-colors cursor-pointer"
          >
            <span>{t.faq[item.qKey]}</span>
            <span class="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-900 text-sm font-bold shrink-0 transition-transform duration-200" class:rotate-180={isOpen}>
              {isOpen ? '−' : '+'}
            </span>
          </button>

          <!-- Accordion Body -->
          {#if isOpen}
            <div class="px-6 pb-6 pt-1 text-sm sm:text-base text-stone-600 leading-relaxed border-t border-amber-200/50">
              {t.faq[item.aKey]}
            </div>
          {/if}
        </div>
      {/each}
    </div>

  </div>
</section>
