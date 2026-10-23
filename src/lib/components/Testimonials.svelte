<script>
  let { t } = $props();

  const reviews = [
    {
      quoteKey: "t1_quote",
      nameKey: "t1_name",
      roleKey: "t1_role",
      avatarBg: "bg-amber-700",
      initials: "YT"
    },
    {
      quoteKey: "t2_quote",
      nameKey: "t2_name",
      roleKey: "t2_role",
      avatarBg: "bg-stone-800",
      initials: "SG"
    },
    {
      quoteKey: "t3_quote",
      nameKey: "t3_name",
      roleKey: "t3_role",
      avatarBg: "bg-amber-900",
      initials: "DR"
    }
  ];
</script>

<section id="testimonials" class="py-24 bg-white border-b border-amber-900/10">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    <!-- Section Header -->
    <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
        <span>💬</span>
        <span>{t.testimonials.badge}</span>
      </div>
      <h2 class="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
        {t.testimonials.title}
      </h2>
      <p class="text-base sm:text-lg text-stone-600 leading-relaxed">
        {t.testimonials.subtitle}
      </p>
    </div>

    <!-- 3 Testimonial Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      {#each reviews as r}
        <div class="bg-amber-50/40 rounded-3xl p-8 border border-amber-200/60 shadow-xs hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col justify-between group">
          
          <div class="space-y-4">
            <!-- 5-Star Rating -->
            <div class="flex items-center gap-1 text-amber-500 text-sm">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>

            <!-- Quote -->
            <p class="text-sm sm:text-base text-stone-700 leading-relaxed italic">
              "{t.testimonials[r.quoteKey]}"
            </p>
          </div>

          <!-- Student Profile -->
          <div class="pt-6 mt-6 border-t border-amber-200/50 flex items-center gap-3.5">
            <div class={`w-11 h-11 rounded-full ${r.avatarBg} text-amber-100 font-bold flex items-center justify-center text-sm shadow-md`}>
              {r.initials}
            </div>
            <div>
              <h4 class="text-sm font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                {t.testimonials[r.nameKey]}
              </h4>
              <p class="text-xs text-stone-500">
                {t.testimonials[r.roleKey]}
              </p>
            </div>
          </div>

        </div>
      {/each}
    </div>

  </div>
</section>
