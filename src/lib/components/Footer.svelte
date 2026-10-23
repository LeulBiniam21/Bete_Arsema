<script>
  let { t, lang = 'en' } = $props();
</script>

<footer class="bg-stone-950 text-white border-t border-amber-900/40 pt-16 pb-12">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-stone-800">
      
      <!-- Brand column (5 cols) -->
      <div class="lg:col-span-5 space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full overflow-hidden ring-2 ring-amber-500/50 bg-amber-100 p-0.5">
            <img 
              src="/assets/images/bete-arsema-logo.png" 
              alt="Bete Arsema" 
              class="w-full h-full object-cover rounded-full"
              onerror={(e) => { e.currentTarget.src = '/assets/images/logo.png'; }}
            />
          </div>
          <div>
            <span class="block text-xl font-serif font-bold text-amber-200">
              {lang === 'am' ? 'ቤተ አርሴማ' : 'Bete Arsema'}
            </span>
            <span class="block text-[11px] text-amber-400/80 uppercase tracking-widest font-semibold">
              {lang === 'am' ? 'የመንፈሳዊ ዜማ አካዳሚ' : 'Sacred Music Academy'}
            </span>
          </div>
        </div>

        <p class="text-sm text-stone-400 max-w-sm leading-relaxed">
          {t.footer.desc}
        </p>

        <div class="flex items-center gap-3 pt-2">
          <a href="https://t.me/CEOJAPIBR2" target="_blank" rel="noreferrer" class="w-9 h-9 rounded-full bg-stone-900 hover:bg-sky-600 flex items-center justify-center text-sm transition-colors text-stone-300 hover:text-white" title="Telegram">
            ✈️
          </a>
          <a href="https://wa.me/251968590145" target="_blank" rel="noreferrer" class="w-9 h-9 rounded-full bg-stone-900 hover:bg-emerald-600 flex items-center justify-center text-sm transition-colors text-stone-300 hover:text-white" title="WhatsApp">
            💬
          </a>
          <a href="tel:+251968590145" class="w-9 h-9 rounded-full bg-stone-900 hover:bg-amber-600 flex items-center justify-center text-sm transition-colors text-stone-300 hover:text-white" title="Call">
            📞
          </a>
        </div>
      </div>

      <!-- Quick Nav (3 cols) -->
      <div class="lg:col-span-3 space-y-3">
        <h4 class="text-xs font-bold uppercase tracking-widest text-amber-400 font-serif">
          {t.footer.quickLinks}
        </h4>
        <ul class="space-y-2 text-sm text-stone-400">
          <li><a href="#welcome" class="hover:text-amber-300 transition-colors">{t.nav.home}</a></li>
          <li><a href="/teachers" class="hover:text-amber-300 transition-colors">{t.nav.teachers || 'Our Faculty'}</a></li>
          <li><a href="/teach" class="text-amber-400 hover:text-amber-300 transition-colors font-medium">✍️ {t.nav.teach || 'Teach With Us'}</a></li>
          <li><a href="#about" class="hover:text-amber-300 transition-colors">{t.nav.about}</a></li>
          <li><a href="#instruments" class="hover:text-amber-300 transition-colors">{t.nav.instruments}</a></li>
          <li><a href="#pricing" class="hover:text-amber-300 transition-colors">{t.nav.pricing}</a></li>
          <li><a href="#contact" class="hover:text-amber-300 transition-colors">{t.nav.contact}</a></li>
          <li><a href="/admin" class="text-stone-600 hover:text-stone-400 text-xs transition-colors">🔐 Faculty Admin</a></li>
        </ul>
      </div>

      <!-- Instruments & Tradition (4 cols) -->
      <div class="lg:col-span-4 space-y-3">
        <h4 class="text-xs font-bold uppercase tracking-widest text-amber-400 font-serif">
          {t.footer.instrumentsTitle}
        </h4>
        <ul class="space-y-2.5 text-sm text-stone-400">
          <li class="flex items-center gap-2">
            <span class="text-amber-500">✦</span>
            <span>Begena / በገና (10-String David's Harp)</span>
          </li>
          <li class="flex items-center gap-2">
            <span class="text-amber-500">✦</span>
            <span>Krar / ክራር (5/6-String Lyre)</span>
          </li>
          <li class="flex items-center gap-2">
            <span class="text-amber-500">✦</span>
            <span>Washint / ዋሽንት (Bamboo Flute)</span>
          </li>
          <li class="flex items-center gap-2">
            <span class="text-amber-500">✦</span>
            <span>Zema Chants & Speaking Skills</span>
          </li>
        </ul>

        <div class="pt-4">
          <p class="text-xs text-stone-400">
            {lang === 'am' ? 'ለበለጠ መረጃ በስልክ ያግኙን:' : 'Direct enrollment helpline:'}
          </p>
          <a href="tel:+251968590145" class="text-sm font-bold text-amber-300 hover:text-amber-200">
            +251 968 590 145
          </a>
        </div>
      </div>

    </div>

    <!-- Copyright -->
    <div class="pt-8 text-center text-xs text-stone-400">
      {t.footer.copyright}
    </div>

  </div>
</footer>
