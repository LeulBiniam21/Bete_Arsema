<script>
  import { onMount } from 'svelte';
  import { translations } from '#lib/translations.js';
  import { getTeachers } from '#lib/teachersData.js';

  let currentLang = $state('en');
  let t = $derived(translations[currentLang]);

  function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'am' : 'en';
  }

  let selectedCategory = $state('all');
  let teachersList = $state([]);

  onMount(() => {
    teachersList = getTeachers();
  });

  let filteredTeachers = $derived(
    selectedCategory === 'all'
      ? teachersList
      : teachersList.filter(teacher => teacher.category === selectedCategory)
  );
</script>

<svelte:head>
  <title>
    {currentLang === 'am'
      ? 'የአካዳሚው መምህራን | ቤተ አርሴማ'
      : 'Master Faculty Directory | Bete Arsema'}
  </title>
  <meta 
    name="description" 
    content="Browse all certified instructors at Bete Arsema. Learn Begena, Krar, Washint, Ge'ez, and Orthodox Mezmur directly from authentic masters."
  />
</svelte:head>

<div class="min-h-screen bg-stone-50 font-sans selection:bg-amber-200 selection:text-amber-950 flex flex-col">

  <!-- Header -->
  <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-900/10 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        
        <a href="/" class="flex items-center gap-3 group">
          <div class="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden ring-2 ring-amber-500/30 group-hover:ring-amber-500 transition-all bg-amber-50 p-0.5">
            <img 
              src="/assets/images/bete-arsema-logo.png" 
              alt="Bete Arsema Logo" 
              class="w-full h-full object-cover rounded-full"
              onerror={(e) => { e.currentTarget.src = '/assets/images/logo.png'; }}
            />
          </div>
          <div>
            <span class="block text-lg sm:text-xl font-bold font-serif text-stone-900 tracking-wide group-hover:text-amber-800 transition-colors leading-tight">
              {currentLang === 'am' ? 'ቤተ አርሴማ' : 'Bete Arsema'}
            </span>
            <span class="block text-[10px] sm:text-xs font-semibold text-amber-700 uppercase tracking-widest leading-tight">
              {currentLang === 'am' ? 'የመምህራን ማውጫ' : 'Faculty Directory'}
            </span>
          </div>
        </a>

        <div class="flex items-center gap-3">
          <a 
            href="/teach"
            class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-full bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors"
          >
            <span>✍️</span>
            <span>{currentLang === 'am' ? 'አስተምሩ' : 'Teach With Us'}</span>
          </a>

          <button 
            onclick={toggleLanguage}
            class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase rounded-full border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 transition-all shadow-xs cursor-pointer"
          >
            <span>{currentLang === 'en' ? '🇪🇹' : '🇬🇧'}</span>
            <span>{t.langName}</span>
          </button>

          <a 
            href="/"
            class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full bg-stone-100 hover:bg-amber-100 text-stone-800 border border-stone-200 transition-colors"
          >
            <span>←</span>
            <span>{currentLang === 'am' ? 'መነሻ' : 'Home'}</span>
          </a>
        </div>

      </div>
    </div>
  </header>

  <main class="flex-1 py-14 sm:py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      <!-- Page Title -->
      <div class="text-center max-w-3xl mx-auto space-y-4">
        <div class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
          <span>🎓</span>
          <span>{t.teachersDir.badge}</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight">
          {t.teachersDir.title}
        </h1>
        <p class="text-base sm:text-lg text-stone-600 leading-relaxed">
          {t.teachersDir.subtitle}
        </p>
      </div>

      <!-- Filter Tabs -->
      <div class="flex flex-wrap items-center justify-center gap-2 pt-2">
        <button 
          onclick={() => selectedCategory = 'all'}
          class="px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer {selectedCategory === 'all' ? 'bg-amber-800 text-white shadow-md' : 'bg-white text-stone-700 hover:bg-amber-50 border border-stone-200'}"
        >
          {t.teachersDir.filterAll}
        </button>

        <button 
          onclick={() => selectedCategory = 'begena'}
          class="px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer {selectedCategory === 'begena' ? 'bg-amber-800 text-white shadow-md' : 'bg-white text-stone-700 hover:bg-amber-50 border border-stone-200'}"
        >
          {t.teachersDir.filterBegena}
        </button>

        <button 
          onclick={() => selectedCategory = 'krar'}
          class="px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer {selectedCategory === 'krar' ? 'bg-amber-800 text-white shadow-md' : 'bg-white text-stone-700 hover:bg-amber-50 border border-stone-200'}"
        >
          {t.teachersDir.filterKrar}
        </button>

        <button 
          onclick={() => selectedCategory = 'geez'}
          class="px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer {selectedCategory === 'geez' ? 'bg-amber-800 text-white shadow-md' : 'bg-white text-stone-700 hover:bg-amber-50 border border-stone-200'}"
        >
          {t.teachersDir.filterGeez}
        </button>

        <button 
          onclick={() => selectedCategory = 'mezmur'}
          class="px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer {selectedCategory === 'mezmur' ? 'bg-amber-800 text-white shadow-md' : 'bg-white text-stone-700 hover:bg-amber-50 border border-stone-200'}"
        >
          {t.teachersDir.filterMezmur}
        </button>
      </div>

      <!-- Teachers Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {#each filteredTeachers as teacher (teacher.id)}
          <div class="bg-white rounded-3xl border border-amber-200/60 shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group">
            
            <div class="p-6 sm:p-8 space-y-6">
              
              <!-- Top Row: Photo & Basic Details -->
              <div class="flex items-start gap-5">
                <div class="relative w-24 h-28 sm:w-28 sm:h-32 rounded-2xl overflow-hidden shrink-0 border-2 border-amber-400/40 bg-stone-900 shadow-md">
                  <img 
                    src={teacher.image} 
                    alt={teacher.name} 
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div class="absolute bottom-1 right-1 bg-amber-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm">
                    ⭐ {teacher.rating}
                  </div>
                </div>

                <div class="space-y-1.5 flex-1 min-w-0">
                  <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
                    <span>{teacher.originIcon}</span>
                    <span class="truncate">{currentLang === 'am' ? teacher.categoryLabelAm : teacher.categoryLabel}</span>
                  </span>

                  <h3 class="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
                    <a href="/teachers/{teacher.id}" class="hover:text-amber-700 transition-colors">
                      {currentLang === 'am' ? teacher.nameAm : teacher.name}
                    </a>
                  </h3>

                  <p class="text-xs text-amber-800 font-semibold leading-tight">
                    {currentLang === 'am' ? teacher.roleAm : teacher.role}
                  </p>

                  <p class="text-[11px] text-stone-500 flex items-center gap-1 pt-1">
                    <span>🏛️</span>
                    <span class="truncate">{currentLang === 'am' ? teacher.originAm : teacher.origin}</span>
                  </p>
                </div>
              </div>

              <!-- Teaching Focus -->
              <div class="bg-amber-50/60 rounded-xl p-3.5 border border-amber-100 text-xs space-y-1">
                <span class="block text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  {currentLang === 'am' ? 'የሚያስተምሩት ትምህርት:' : 'Focus Curriculum:'}
                </span>
                <p class="text-stone-700 font-medium leading-relaxed">
                  {currentLang === 'am' ? teacher.teachingAm : teacher.teaching}
                </p>
              </div>

              <!-- Bio excerpt -->
              <p class="text-xs sm:text-sm text-stone-600 line-clamp-3 leading-relaxed italic">
                "{currentLang === 'am' ? teacher.bioAm : teacher.bio}"
              </p>

              <!-- Stats Pill Row -->
              <div class="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                <span class="font-medium">
                  ⏳ {currentLang === 'am' ? teacher.expAm : teacher.exp}
                </span>
                <span class="font-medium text-amber-800">
                  👥 {teacher.studentsCount}+ {t.teachersDir.studentsCount}
                </span>
              </div>

            </div>

            <!-- Action Buttons Footer -->
            <div class="bg-stone-50 px-6 py-4 border-t border-stone-100 flex items-center justify-between gap-3">
              <a 
                href="/teachers/{teacher.id}"
                class="flex-1 text-center py-2.5 px-4 rounded-full bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-md transition-all"
              >
                {t.teachersDir.viewProfile} →
              </a>
              
              <a 
                href="https://t.me/CEOJAPIBR2"
                target="_blank"
                class="px-4 py-2.5 rounded-full bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 font-semibold text-xs transition-colors shrink-0"
              >
                ✈️ Telegram
              </a>
            </div>

          </div>
        {/each}
      </div>

      <!-- Recruitment CTA Banner -->
      <div class="mt-16 max-w-4xl mx-auto bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 border border-amber-500/30 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div class="space-y-2">
          <span class="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
            <span>✨</span> {t.instructors.joinFacultyBadge}
          </span>
          <h3 class="text-2xl font-serif font-bold text-stone-100">
            {t.instructors.joinFacultyTitle}
          </h3>
          <p class="text-xs sm:text-sm text-stone-300 max-w-xl">
            {t.instructors.joinFacultySubtitle}
          </p>
        </div>
        <a 
          href="/teach" 
          class="shrink-0 px-6 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-lg transition-transform hover:scale-105"
        >
          {t.instructors.joinFacultyBtn}
        </a>
      </div>

    </div>
  </main>

  <!-- Footer -->
  <footer class="bg-stone-950 text-white border-t border-stone-800 py-8 text-center text-xs text-stone-400">
    <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <span>© 2026 Bete Arsema Online Academy</span>
      <div class="flex items-center gap-4">
        <a href="/" class="hover:text-amber-300">Home</a>
        <a href="/teach" class="hover:text-amber-300">Teach With Us</a>
        <a href="/admin" class="hover:text-amber-300 text-stone-600">Admin</a>
      </div>
    </div>
  </footer>

</div>
