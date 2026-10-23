<script>
  let { t } = $props();

  const steps = [
    { num: "01", icon: "📅", titleKey: "step1_title", descKey: "step1_desc" },
    { num: "02", icon: "🎻", titleKey: "step2_title", descKey: "step2_desc" },
    { num: "03", icon: "📹", titleKey: "step3_title", descKey: "step3_desc" },
    { num: "04", icon: "🔄", titleKey: "step4_title", descKey: "step4_desc" },
    { num: "05", icon: "⏳", titleKey: "step5_title", descKey: "step5_desc" },
    { num: "06", icon: "🏆", titleKey: "step6_title", descKey: "step6_desc" }
  ];
</script>

<section id="process" class="py-24 bg-white border-b border-amber-900/10 relative overflow-hidden">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    <!-- Section Header -->
    <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
        <span>✨</span>
        <span>{t.process.badge}</span>
      </div>
      <h2 class="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
        {t.process.title}
      </h2>
      <p class="text-base sm:text-lg text-stone-600 leading-relaxed">
        {t.process.subtitle}
      </p>
    </div>

    <!-- 6-Step Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {#each steps as s}
        <div class="relative bg-amber-50/40 rounded-2xl p-7 border border-amber-200/60 hover:border-amber-400 hover:bg-white hover:shadow-xl transition-all duration-300 group">
          <!-- Step Top Badge -->
          <div class="flex items-center justify-between mb-5">
            <span class="text-2xl">{s.icon}</span>
            <span class="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 group-hover:bg-amber-700 group-hover:text-white transition-colors">
              Step {s.num}
            </span>
          </div>

          <!-- Step Title -->
          <h3 class="text-lg font-serif font-bold text-stone-900 mb-2 group-hover:text-amber-800 transition-colors">
            {t.process[s.titleKey]}
          </h3>

          <!-- Step Description -->
          <p class="text-sm text-stone-600 leading-relaxed">
            {t.process[s.descKey]}
          </p>
        </div>
      {/each}
    </div>

  </div>
</section>
