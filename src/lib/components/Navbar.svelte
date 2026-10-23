<script>
  let { lang = 'en', onToggleLang = () => {}, onOpenBooking = () => {}, t } = $props();
  let mobileMenuOpen = $state(false);

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  function closeMobileMenu() {
    mobileMenuOpen = false;
  }
</script>

<header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-900/10 shadow-xs">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-20 gap-4">
      
      <!-- Brand Logo (Never shrink) -->
      <a href="#welcome" class="flex items-center gap-3 shrink-0 group" onclick={closeMobileMenu}>
        <div class="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden ring-2 ring-amber-500/30 group-hover:ring-amber-500 transition-all bg-amber-50 p-0.5">
          <img 
            src="/assets/images/bete-arsema-logo.png" 
            alt="Bete Arsema Logo" 
            width="48"
            height="48"
            loading="eager"
            decoding="async"
            fetchpriority="high"
            class="w-full h-full object-cover rounded-full"
            onerror={(e) => { e.currentTarget.src = '/assets/images/logo.png'; }}
          />
        </div>
        <div>
          <span class="block text-lg sm:text-xl font-bold font-serif text-stone-900 tracking-wide group-hover:text-amber-800 transition-colors leading-tight">
            {lang === 'am' ? 'ቤተ አርሴማ' : 'Bete Arsema'}
          </span>
          <span class="block text-[10px] sm:text-xs font-semibold text-amber-700 uppercase tracking-widest leading-tight">
            {lang === 'am' ? 'የመንፈሳዊ ዜማ አካዳሚ' : 'Sacred Music Academy'}
          </span>
        </div>
      </a>

      <!-- Desktop Navigation Links (Clean, Streamlined, No Duplicates) -->
      <nav class="hidden lg:flex items-center gap-5 xl:gap-6 2xl:gap-7">
        <a href="#about" class="text-sm font-semibold text-stone-700 hover:text-amber-700 transition-colors whitespace-nowrap">{t.nav.about}</a>
        
        <a href="#instruments" class="text-sm font-semibold text-stone-700 hover:text-amber-700 transition-colors whitespace-nowrap">{t.nav.instruments}</a>

        <a href="#instructors" class="text-sm font-semibold text-stone-700 hover:text-amber-700 transition-colors whitespace-nowrap">{t.nav.instructors}</a>

        <a href="#pricing" class="text-sm font-semibold text-stone-700 hover:text-amber-700 transition-colors whitespace-nowrap">{t.nav.pricing}</a>

        <a href="/teach" class="text-xs font-bold text-amber-800 hover:text-amber-900 bg-amber-100/80 hover:bg-amber-100 px-3 py-1.5 rounded-full border border-amber-300/80 transition-colors whitespace-nowrap">✍️ {t.nav.teach || 'Teach With Us'}</a>

        <a href="#contact" class="text-sm font-semibold text-stone-700 hover:text-amber-700 transition-colors whitespace-nowrap">{t.nav.contact}</a>
      </nav>

      <!-- Language Switcher & Action CTA (Never shrink) -->
      <div class="hidden sm:flex items-center gap-2.5 shrink-0">
        <!-- Language Switcher -->
        <button 
          onclick={onToggleLang}
          aria-label="Switch Language"
          class="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase rounded-full border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 transition-all shadow-xs cursor-pointer whitespace-nowrap"
        >
          <span class="text-sm">{lang === 'en' ? '🇪🇹' : '🇬🇧'}</span>
          <span>{t.langName}</span>
        </button>

        <!-- Enroll Now Button -->
        <button 
          onclick={() => onOpenBooking('General Inquiry')}
          class="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-linear-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-stone-900 rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
        >
          {t.nav.enrollBtn}
        </button>
      </div>

      <!-- Mobile/Tablet Hamburger Trigger -->
      <div class="flex items-center gap-2 lg:hidden shrink-0">
        <!-- Quick Language Switcher on Mobile/Tablet -->
        <button 
          onclick={onToggleLang}
          class="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-amber-300 bg-amber-50 text-amber-900 cursor-pointer"
        >
          {lang === 'en' ? '🇪🇹 አማርኛ' : '🇬🇧 EN'}
        </button>
        
        <button 
          onclick={toggleMobileMenu}
          aria-label="Toggle Menu"
          class="p-2 rounded-lg text-stone-700 hover:text-stone-900 hover:bg-amber-100/50 cursor-pointer"
        >
          {#if mobileMenuOpen}
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          {:else}
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          {/if}
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile / Tablet Drawer Menu -->
  {#if mobileMenuOpen}
    <div class="lg:hidden border-t border-amber-900/10 bg-white/98 px-4 pt-3 pb-6 shadow-xl space-y-2">
      <a href="#about" onclick={closeMobileMenu} class="block px-3 py-2 rounded-lg text-base font-semibold text-stone-800 hover:bg-amber-50 hover:text-amber-800">{t.nav.about}</a>
      <a href="#instruments" onclick={closeMobileMenu} class="block px-3 py-2 rounded-lg text-base font-semibold text-stone-800 hover:bg-amber-50 hover:text-amber-800">{t.nav.instruments}</a>
      <a href="#pricing" onclick={closeMobileMenu} class="block px-3 py-2 rounded-lg text-base font-semibold text-stone-800 hover:bg-amber-50 hover:text-amber-800">{t.nav.pricing}</a>
      <a href="#order-instrument" onclick={closeMobileMenu} class="block px-3 py-2 rounded-lg text-base font-semibold text-stone-800 hover:bg-amber-50 hover:text-amber-800">{t.nav.order}</a>
      <a href="/teachers" onclick={closeMobileMenu} class="block px-3 py-2 rounded-lg text-base font-bold text-amber-900 bg-amber-50/70 hover:bg-amber-100">{t.nav.teachers || 'Our Faculty'} →</a>
      <a href="/teach" onclick={closeMobileMenu} class="block px-3 py-2 rounded-lg text-base font-bold text-amber-800 bg-amber-100/50 hover:bg-amber-100">✍️ {t.nav.teach || 'Teach With Us'}</a>
      <a href="#faq" onclick={closeMobileMenu} class="block px-3 py-2 rounded-lg text-base font-semibold text-stone-800 hover:bg-amber-50 hover:text-amber-800">{t.nav.faq}</a>
      <a href="#contact" onclick={closeMobileMenu} class="block px-3 py-2 rounded-lg text-base font-semibold text-stone-800 hover:bg-amber-50 hover:text-amber-800">{t.nav.contact}</a>
      
      <div class="pt-4 border-t border-amber-100">
        <button 
          onclick={() => { closeMobileMenu(); onOpenBooking('General Inquiry'); }}
          class="w-full py-3 text-center text-sm font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-xl shadow-md cursor-pointer"
        >
          {t.nav.enrollBtn}
        </button>
      </div>
    </div>
  {/if}
</header>
