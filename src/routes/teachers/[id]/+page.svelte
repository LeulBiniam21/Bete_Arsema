<script>
  import { onMount } from 'svelte';
  import { translations } from '#lib/translations.js';
  import { getTeacherById, defaultTeachers } from '#lib/teachersData.js';

  let { data } = $props();

  let currentLang = $state('en');
  let t = $derived(translations[currentLang]);

  function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'am' : 'en';
  }

  // Load teacher data with fallback
  let teacher = $derived(
    getTeacherById(data.id) || defaultTeachers.find(item => item.id === data.id) || defaultTeachers[0]
  );

  // Booking Form State
  let studentName = $state('');
  let studentPhone = $state('');
  let studentGoal = $state('');
  let selectedSlot = $state('');
  let bookingSuccess = $state(false);

  function handleBook(e) {
    e.preventDefault();
    if (!studentName || !studentPhone) return;

    const teacherName = currentLang === 'am' ? teacher.nameAm : teacher.name;
    const msg = `📅 *DIRECT CLASS BOOKING - BETE ARSEMA*%0A%0A` +
      `*Teacher:* ${encodeURIComponent(teacherName)}%0A` +
      `*Student Name:* ${encodeURIComponent(studentName)}%0A` +
      `*Phone/WhatsApp:* ${encodeURIComponent(studentPhone)}%0A` +
      `*Selected Slot:* ${encodeURIComponent(selectedSlot || 'Flexible')}%0A` +
      `*Goals/Notes:* ${encodeURIComponent(studentGoal || 'Beginner Lessons')}%0A%0A` +
      `_Direct Booking from Teacher Profile Page_`;

    bookingSuccess = true;
    setTimeout(() => {
      window.open(`https://wa.me/251711890131?text=${msg}`, '_blank');
    }, 400);
  }
</script>

<svelte:head>
  <title>
    {currentLang === 'am' ? teacher.nameAm : teacher.name} | {currentLang === 'am' ? 'መምህር' : 'Faculty'} | Bete Arsema
  </title>
  <meta 
    name="description" 
    content="Study sacred Begena, Krar, Washint, or Ge'ez directly with {teacher.name}. Live 1-on-1 personalized lessons online."
  />
</svelte:head>

<div class="min-h-screen bg-stone-50 font-sans selection:bg-amber-200 selection:text-amber-950 flex flex-col">

  <!-- Top Header -->
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
              {currentLang === 'am' ? 'የመምህራን ማውጫ' : 'Faculty Profile'}
            </span>
          </div>
        </a>

        <div class="flex items-center gap-3">
          <button 
            onclick={toggleLanguage}
            class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase rounded-full border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 transition-all shadow-xs cursor-pointer"
          >
            <span>{currentLang === 'en' ? '🇪🇹' : '🇬🇧'}</span>
            <span>{t.langName}</span>
          </button>

          <a 
            href="/teachers"
            class="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold rounded-full bg-stone-100 hover:bg-amber-100 text-stone-800 border border-stone-200 transition-colors"
          >
            <span>←</span>
            <span>{t.teacherProfile.backToDir}</span>
          </a>
        </div>

      </div>
    </div>
  </header>

  <main class="flex-1 py-10 sm:py-16">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

      <!-- Breadcrumbs -->
      <nav class="flex items-center gap-2 text-xs text-stone-500 font-medium">
        <a href="/" class="hover:text-amber-700">Home</a>
        <span>/</span>
        <a href="/teachers" class="hover:text-amber-700">Faculty</a>
        <span>/</span>
        <span class="text-amber-900 font-bold">{currentLang === 'am' ? teacher.nameAm : teacher.name}</span>
      </nav>

      <!-- Main Profile Featured Card -->
      <div class="bg-gradient-to-br from-stone-950 via-amber-950 to-stone-900 rounded-3xl sm:rounded-4xl p-6 sm:p-10 lg:p-12 text-white border border-amber-500/30 shadow-2xl relative overflow-hidden">
        
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          <!-- Column 1: Portrait Image -->
          <div class="lg:col-span-5 flex flex-col items-center">
            <div class="relative w-full max-w-sm aspect-4/5 rounded-3xl overflow-hidden border-2 border-amber-400/50 shadow-2xl bg-stone-900">
              <img 
                src={teacher.image} 
                alt={teacher.name} 
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent"></div>
              
              <!-- Verified Badge -->
              <div class="absolute top-4 left-4 bg-amber-700/90 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-full shadow-md border border-amber-400/30 flex items-center gap-1.5">
                <span>✓</span>
                <span>{t.teacherProfile.verified}</span>
              </div>

              <!-- Rating Badge -->
              <div class="absolute top-4 right-4 bg-stone-950/80 backdrop-blur-xs text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30">
                ⭐ {teacher.rating} / 5.0
              </div>
            </div>
          </div>

          <!-- Column 2: Header Info & Metrics -->
          <div class="lg:col-span-7 space-y-6">
            
            <div class="space-y-2">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
                <span>{teacher.originIcon}</span>
                <span>{currentLang === 'am' ? teacher.categoryLabelAm : teacher.categoryLabel}</span>
              </div>

              <h1 class="text-3xl sm:text-5xl font-serif font-bold text-stone-100 tracking-tight leading-tight">
                {currentLang === 'am' ? teacher.nameAm : teacher.name}
              </h1>

              <p class="text-lg text-amber-300 font-serif font-medium">
                {currentLang === 'am' ? teacher.roleAm : teacher.role}
              </p>
            </div>

            <!-- Origin Box -->
            <div class="bg-amber-900/30 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-2xl shrink-0">
                🏛️
              </div>
              <div>
                <span class="block text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  {currentLang === 'am' ? 'የትምህርት መነሻ / ገዳም:' : 'Parish & Ecclesiastical Heritage:'}
                </span>
                <p class="text-sm font-semibold text-stone-100">
                  {currentLang === 'am' ? teacher.originAm : teacher.origin}
                </p>
              </div>
            </div>

            <!-- Quick Metrics 3-Col Row -->
            <div class="grid grid-cols-3 gap-3 text-center border-y border-amber-500/20 py-4">
              <div>
                <span class="block text-2xl font-serif font-bold text-amber-400">
                  {currentLang === 'am' ? teacher.expAm.split(' ')[0] : teacher.exp.split(' ')[0]}
                </span>
                <span class="block text-[10px] uppercase text-stone-300 tracking-wider">
                  {t.teacherProfile.experienceLabel}
                </span>
              </div>

              <div>
                <span class="block text-2xl font-serif font-bold text-amber-400">
                  {teacher.studentsCount}+
                </span>
                <span class="block text-[10px] uppercase text-stone-300 tracking-wider">
                  {t.teacherProfile.studentsLabel}
                </span>
              </div>

              <div>
                <span class="block text-2xl font-serif font-bold text-amber-400">
                  {teacher.rating}
                </span>
                <span class="block text-[10px] uppercase text-stone-300 tracking-wider">
                  {t.teacherProfile.ratingLabel}
                </span>
              </div>
            </div>

            <!-- CTA Row -->
            <div class="flex flex-wrap items-center gap-3 pt-2">
              <a 
                href="#book-session"
                class="flex-1 sm:flex-initial px-8 py-3.5 rounded-full bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-sm shadow-xl transition-transform hover:scale-105 text-center"
              >
                📅 {t.teacherProfile.bookBtn} →
              </a>

              <a 
                href="https://t.me/CEOJAPIBR2"
                target="_blank"
                class="px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-stone-200 border border-white/20 font-semibold text-xs transition-colors flex items-center gap-2"
              >
                <span>✈️</span>
                <span>{t.teacherProfile.inquireTelegram}</span>
              </a>

              <a 
                href="https://wa.me/251711890131"
                target="_blank"
                class="px-5 py-3.5 rounded-full bg-green-600/80 hover:bg-green-600 text-white font-semibold text-xs transition-colors flex items-center gap-2"
              >
                <span>💬</span>
                <span>{t.teacherProfile.inquireWhatsApp}</span>
              </a>
            </div>

          </div>

        </div>

      </div>

      <!-- 2-Column Content Layout: Left Details, Right Booking Card -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <!-- Left: Bio & Curriculum (7 Cols) -->
        <div class="lg:col-span-7 space-y-10">
          
          <!-- Section 1: Detailed Bio -->
          <div class="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-4">
            <h2 class="text-2xl font-serif font-bold text-stone-900 border-b border-stone-100 pb-3">
              {t.teacherProfile.aboutTitle}
            </h2>
            <p class="text-stone-700 leading-relaxed text-sm sm:text-base">
              {currentLang === 'am' ? teacher.bioAm : teacher.bio}
            </p>
          </div>

          <!-- Section 2: Structured Curriculum Modules -->
          <div class="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6">
            <h2 class="text-2xl font-serif font-bold text-stone-900 border-b border-stone-100 pb-3">
              {t.teacherProfile.curriculumTitle}
            </h2>

            <div class="space-y-4">
              {#each teacher.curriculum as module, idx}
                <div class="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/60 space-y-1.5">
                  <div class="flex items-center gap-2.5">
                    <span class="w-6 h-6 rounded-full bg-amber-700 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      0{idx + 1}
                    </span>
                    <h4 class="font-serif font-bold text-stone-900 text-base">
                      {currentLang === 'am' ? module.titleAm : module.titleEn}
                    </h4>
                  </div>
                  <p class="text-xs sm:text-sm text-stone-600 pl-8 leading-relaxed">
                    {currentLang === 'am' ? module.descAm : module.descEn}
                  </p>
                </div>
              {/each}
            </div>
          </div>

          <!-- Section 3: Schedule Availability -->
          <div class="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-4">
            <h2 class="text-2xl font-serif font-bold text-stone-900 border-b border-stone-100 pb-3">
              {t.teacherProfile.scheduleTitle}
            </h2>
            <div class="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span class="text-2xl">🕒</span>
              <div class="space-y-1">
                <span class="block text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  {currentLang === 'am' ? 'የቀጥታ ትምህርት ሰዓታት:' : 'Available Time Slots (Zoom / Meet):'}
                </span>
                <p class="text-sm font-semibold text-emerald-800">
                  {currentLang === 'am' ? teacher.scheduleAm : teacher.scheduleEn}
                </p>
              </div>
            </div>
          </div>

        </div>

        <!-- Right: Direct Booking Form Card (5 Cols) -->
        <div id="book-session" class="lg:col-span-5">
          <div class="sticky top-24 bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-400/80 shadow-2xl space-y-6">
            
            <div class="space-y-2 border-b border-stone-100 pb-4">
              <span class="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                <span>📅</span>
                <span>{currentLang === 'am' ? 'ቀጥታ ምዝገባ' : 'Direct Booking'}</span>
              </span>
              <h3 class="text-xl sm:text-2xl font-serif font-bold text-stone-900 leading-tight">
                {t.teacherProfile.bookTitle} {currentLang === 'am' ? teacher.nameAm : teacher.name}
              </h3>
              <p class="text-xs text-stone-500 leading-relaxed">
                {t.teacherProfile.bookSubtitle}
              </p>
            </div>

            {#if bookingSuccess}
              <div class="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-3">
                <div class="text-3xl">✅</div>
                <h4 class="font-bold text-emerald-900 text-sm">
                  {currentLang === 'am' ? 'ጥያቄዎ ተልኳል!' : 'Request Dispatched!'}
                </h4>
                <p class="text-xs text-emerald-700">
                  {currentLang === 'am' 
                    ? 'የአካዳሚው አስተባባሪ የመማሪያ ክፍሉን ሊንክና የክፍያ ዝርዝር በዋትስአፕ ይልክልዎታል።' 
                    : 'Opening WhatsApp to confirm your slot with the academy coordinator...'}
                </p>
                <button 
                  onclick={() => bookingSuccess = false}
                  class="text-xs text-emerald-800 underline font-semibold cursor-pointer"
                >
                  {currentLang === 'am' ? 'ሌላ ማስያዝ ይፈልጋሉ?' : 'Book another session'}
                </button>
              </div>
            {:else}
              <form onsubmit={handleBook} class="space-y-4">
                
                <div class="space-y-1">
                  <label for="book-name" class="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    {currentLang === 'am' ? 'የተማሪው ሙሉ ስም' : 'Your Full Name'} *
                  </label>
                  <input 
                    id="book-name"
                    type="text" 
                    required
                    bind:value={studentName}
                    placeholder="e.g. Daniel / Sarah"
                    class="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-xs sm:text-sm outline-hidden"
                  />
                </div>

                <div class="space-y-1">
                  <label for="book-phone" class="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    {currentLang === 'am' ? 'ስልክ / ዋትስአፕ' : 'Phone / WhatsApp'} *
                  </label>
                  <input 
                    id="book-phone"
                    type="tel" 
                    required
                    bind:value={studentPhone}
                    placeholder="+251 9... or +1..."
                    class="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-xs sm:text-sm outline-hidden"
                  />
                </div>

                <div class="space-y-1">
                  <label for="book-slot" class="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    {currentLang === 'am' ? 'የሚመርጡት የትምህርት ሰዓት' : 'Preferred Schedule Time'}
                  </label>
                  <select 
                    id="book-slot"
                    bind:value={selectedSlot}
                    class="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-xs sm:text-sm outline-hidden bg-white"
                  >
                    <option value="Weekday Evenings (6-9 PM EAT)">{currentLang === 'am' ? 'የሳምንቱ ቀናት ምሽት (ከ12:00 – 3:00)' : 'Weekday Evenings (6-9 PM EAT)'}</option>
                    <option value="Weekend Mornings (8-12 AM EAT)">{currentLang === 'am' ? 'ቅዳሜና እሑድ ጠዋት (ከ2:00 – 6:00)' : 'Weekend Mornings (8-12 AM EAT)'}</option>
                    <option value="Weekend Afternoons (2-6 PM EAT)">{currentLang === 'am' ? 'ቅዳሜና እሑድ ከሰዓት (ከ8:00 – 12:00)' : 'Weekend Afternoons (2-6 PM EAT)'}</option>
                    <option value="Flexible / Negotiable">{currentLang === 'am' ? 'ተለዋዋጭ / በምክክር የሚወሰን' : 'Flexible / Diaspora Timezone'}</option>
                  </select>
                </div>

                <div class="space-y-1">
                  <label for="book-goal" class="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    {currentLang === 'am' ? 'የትምህርት ደረጃዎ ወይም ዓላማዎ' : 'Your Learning Level / Goal'}
                  </label>
                  <textarea 
                    id="book-goal"
                    rows="2"
                    bind:value={studentGoal}
                    placeholder={currentLang === 'am' ? 'ጀማሪ ነኝ፣ በገና ከዜሮ መማር እፈልጋለሁ...' : 'e.g. Complete beginner starting Begena, or want to improve Ge\'ez grammar...'}
                    class="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-xs sm:text-sm outline-hidden"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  class="w-full py-3.5 rounded-full bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>📅</span>
                  <span>{t.teacherProfile.bookBtn}</span>
                  <span>→</span>
                </button>

              </form>
            {/if}

            <div class="pt-2 text-center text-xs text-stone-400">
              <span>✈️ Prefer Telegram? </span>
              <a href="https://t.me/CEOJAPIBR2" target="_blank" class="text-amber-800 font-bold hover:underline">
                Chat with Coordinator
              </a>
            </div>

          </div>
        </div>

      </div>

    </div>
  </main>

  <!-- Clean Footer -->
  <footer class="bg-stone-950 text-white border-t border-stone-800 py-8 text-center text-xs text-stone-400">
    <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <span>© 2026 Bete Arsema Online Academy</span>
      <div class="flex items-center gap-4">
        <a href="/" class="hover:text-amber-300">Home</a>
        <a href="/teachers" class="hover:text-amber-300">All Faculty</a>
        <a href="/teach" class="hover:text-amber-300">Teach With Us</a>
        <a href="/admin" class="hover:text-amber-300 text-stone-600">Admin</a>
      </div>
    </div>
  </footer>

</div>
