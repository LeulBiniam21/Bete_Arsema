<script>
  import { translations } from '#lib/translations.js';
  import { saveApplication } from '#lib/teachersData.js';

  let currentLang = $state('en');
  let t = $derived(translations[currentLang]);

  function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'am' : 'en';
  }

  // Form State
  let fullName = $state('');
  let phone = $state('');
  let telegram = $state('');
  let diocese = $state('');
  let specialty = $state('10-String Begena (በገና)');
  let experience = $state('3-5 Years');
  let bio = $state('');
  let isSubmitting = $state(false);
  let submissionSuccess = $state(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!fullName || !phone) return;

    isSubmitting = true;

    // Save to local storage for Admin dashboard
    const appRecord = {
      fullName,
      phone,
      telegram,
      diocese,
      specialty,
      experience,
      bio
    };
    saveApplication(appRecord);

    // Also persist to Turso Database via API
    fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: fullName,
        phone,
        email: telegram, // telegram handle or contact
        instrument: specialty,
        experience,
        bio
      })
    }).catch(err => console.warn('Turso API save notice:', err));

    // Format structured application message for WhatsApp & Telegram
    const msgText = `🎓 *NEW TEACHER APPLICATION - BETE ARSEMA*%0A%0A` +
      `*Name:* ${encodeURIComponent(fullName)}%0A` +
      `*Phone/WhatsApp:* ${encodeURIComponent(phone)}%0A` +
      `*Telegram:* ${encodeURIComponent(telegram || 'N/A')}%0A` +
      `*Diocese/Church:* ${encodeURIComponent(diocese || 'N/A')}%0A` +
      `*Specialty:* ${encodeURIComponent(specialty)}%0A` +
      `*Experience:* ${encodeURIComponent(experience)}%0A` +
      `*Bio/Background:* ${encodeURIComponent(bio || 'N/A')}%0A%0A` +
      `_Sent from Bete Arsema Teacher Portal_`;

    setTimeout(() => {
      isSubmitting = false;
      submissionSuccess = true;
      // Auto open WhatsApp with the structured message
      window.open(`https://wa.me/251711890131?text=${msgText}`, '_blank');
    }, 600);
  }
</script>

<svelte:head>
  <title>
    {currentLang === 'am'
      ? 'በቤተ አርሴማ ያስተምሩ | የመምህራን ማመልከቻ'
      : 'Teach With Us | Bete Arsema Online Academy'}
  </title>
  <meta 
    name="description" 
    content="Join our global faculty. Teach Begena, Krar, Washint, Ge'ez, and Orthodox Mezmur online with flexible hours and competitive compensation."
  />
</svelte:head>

<div class="min-h-screen bg-stone-50 font-sans selection:bg-amber-200 selection:text-amber-950 flex flex-col">

  <!-- Top Navigation Header -->
  <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-900/10 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        
        <!-- Brand Logo linking back home -->
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
              {currentLang === 'am' ? 'የመምህራን ማዕከል' : 'Faculty Portal'}
            </span>
          </div>
        </a>

        <!-- Controls -->
        <div class="flex items-center gap-3">
          <button 
            onclick={toggleLanguage}
            class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase rounded-full border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 transition-all shadow-xs cursor-pointer"
          >
            <span>{currentLang === 'en' ? '🇪🇹' : '🇬🇧'}</span>
            <span>{t.langName}</span>
          </button>

          <a 
            href="/"
            class="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full bg-stone-100 hover:bg-amber-100 text-stone-800 border border-stone-200 transition-colors"
          >
            <span>←</span>
            <span>{t.teachPage.backHome}</span>
          </a>
        </div>

      </div>
    </div>
  </header>

  <main class="flex-1">

    <!-- Hero Section -->
    <section class="relative py-20 lg:py-28 bg-gradient-to-br from-stone-950 via-amber-950 to-stone-900 text-white overflow-hidden">
      <!-- Watermark Background Symbol -->
      <div class="absolute -right-8 -bottom-12 text-[18rem] select-none pointer-events-none opacity-5 font-serif">
        ⛪
      </div>

      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
        
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider">
          <span>🎓</span>
          <span>{t.teachPage.badge}</span>
        </div>

        <h1 class="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-100 tracking-tight max-w-4xl mx-auto leading-tight">
          {t.teachPage.title}
        </h1>

        <p class="text-base sm:text-xl text-stone-300 max-w-3xl mx-auto leading-relaxed">
          {t.teachPage.subtitle}
        </p>

        <!-- CTA Buttons -->
        <div class="pt-4 flex flex-wrap items-center justify-center gap-4">
          <a 
            href="#apply-form"
            class="px-8 py-4 rounded-full bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-sm shadow-2xl transition-transform hover:scale-105"
          >
            {t.teachPage.applyNowBtn}
          </a>

          <a 
            href="/teachers"
            class="px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 text-stone-200 border border-white/20 font-semibold text-sm transition-colors"
          >
            {currentLang === 'am' ? 'የአሁን መምህራንን ይመልከቱ →' : 'View Current Faculty →'}
          </a>
        </div>

        <!-- Trust Badges Row -->
        <div class="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-t border-amber-500/20 mt-12">
          <div class="p-3">
            <span class="block text-2xl mb-1">🕒</span>
            <span class="block text-xs font-bold text-amber-300 uppercase tracking-wider">{currentLang === 'am' ? 'ተለዋዋጭ ሰዓት' : 'Flexible Hours'}</span>
          </div>
          <div class="p-3">
            <span class="block text-2xl mb-1">🌍</span>
            <span class="block text-xs font-bold text-amber-300 uppercase tracking-wider">{currentLang === 'am' ? 'ዓለም አቀፍ ተደራሽነት' : 'Global Reach'}</span>
          </div>
          <div class="p-3">
            <span class="block text-2xl mb-1">💰</span>
            <span class="block text-xs font-bold text-amber-300 uppercase tracking-wider">{currentLang === 'am' ? 'አስተማማኝ ክፍያ' : 'Fair Payment'}</span>
          </div>
          <div class="p-3">
            <span class="block text-2xl mb-1">🛠️</span>
            <span class="block text-xs font-bold text-amber-300 uppercase tracking-wider">{currentLang === 'am' ? 'የቴክኖሎጂ ድጋፍ' : 'Full Support'}</span>
          </div>
        </div>

      </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-20 bg-white border-b border-amber-900/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span class="text-amber-800 text-xs font-bold uppercase tracking-wider bg-amber-100 px-3.5 py-1 rounded-full">
            ✦ {currentLang === 'am' ? 'ጥቅሞች' : 'Advantages'}
          </span>
          <h2 class="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
            {t.teachPage.benefitsTitle}
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <!-- Benefit 1 -->
          <div class="p-6 rounded-2xl bg-amber-50/50 border border-amber-200/60 hover:shadow-xl transition-all space-y-3">
            <div class="w-12 h-12 rounded-xl bg-amber-700 text-white flex items-center justify-center text-2xl shadow-md">
              🕒
            </div>
            <h3 class="text-lg font-serif font-bold text-stone-900">{t.teachPage.benefit1_title}</h3>
            <p class="text-xs sm:text-sm text-stone-600 leading-relaxed">{t.teachPage.benefit1_desc}</p>
          </div>

          <!-- Benefit 2 -->
          <div class="p-6 rounded-2xl bg-amber-50/50 border border-amber-200/60 hover:shadow-xl transition-all space-y-3">
            <div class="w-12 h-12 rounded-xl bg-amber-700 text-white flex items-center justify-center text-2xl shadow-md">
              🌍
            </div>
            <h3 class="text-lg font-serif font-bold text-stone-900">{t.teachPage.benefit2_title}</h3>
            <p class="text-xs sm:text-sm text-stone-600 leading-relaxed">{t.teachPage.benefit2_desc}</p>
          </div>

          <!-- Benefit 3 -->
          <div class="p-6 rounded-2xl bg-amber-50/50 border border-amber-200/60 hover:shadow-xl transition-all space-y-3">
            <div class="w-12 h-12 rounded-xl bg-amber-700 text-white flex items-center justify-center text-2xl shadow-md">
              💰
            </div>
            <h3 class="text-lg font-serif font-bold text-stone-900">{t.teachPage.benefit3_title}</h3>
            <p class="text-xs sm:text-sm text-stone-600 leading-relaxed">{t.teachPage.benefit3_desc}</p>
          </div>

          <!-- Benefit 4 -->
          <div class="p-6 rounded-2xl bg-amber-50/50 border border-amber-200/60 hover:shadow-xl transition-all space-y-3">
            <div class="w-12 h-12 rounded-xl bg-amber-700 text-white flex items-center justify-center text-2xl shadow-md">
              🛠️
            </div>
            <h3 class="text-lg font-serif font-bold text-stone-900">{t.teachPage.benefit4_title}</h3>
            <p class="text-xs sm:text-sm text-stone-600 leading-relaxed">{t.teachPage.benefit4_desc}</p>
          </div>

        </div>

      </div>
    </section>

    <!-- Required Specialties Section -->
    <section class="py-20 bg-stone-50 border-b border-amber-900/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span class="text-amber-800 text-xs font-bold uppercase tracking-wider bg-amber-100 px-3.5 py-1 rounded-full">
            ✦ {currentLang === 'am' ? 'የትምህርት ዘርፎች' : 'Disciplines'}
          </span>
          <h2 class="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
            {t.teachPage.requirementsTitle}
          </h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-2.5">
            <div class="text-3xl">🪘</div>
            <h4 class="font-serif font-bold text-stone-900 text-base">{t.teachPage.req1_title}</h4>
            <p class="text-xs text-stone-600 leading-relaxed">{t.teachPage.req1_desc}</p>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-2.5">
            <div class="text-3xl">🎵</div>
            <h4 class="font-serif font-bold text-stone-900 text-base">{t.teachPage.req2_title}</h4>
            <p class="text-xs text-stone-600 leading-relaxed">{t.teachPage.req2_desc}</p>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-2.5">
            <div class="text-3xl">📖</div>
            <h4 class="font-serif font-bold text-stone-900 text-base">{t.teachPage.req3_title}</h4>
            <p class="text-xs text-stone-600 leading-relaxed">{t.teachPage.req3_desc}</p>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-2.5">
            <div class="text-3xl">🎶</div>
            <h4 class="font-serif font-bold text-stone-900 text-base">{t.teachPage.req4_title}</h4>
            <p class="text-xs text-stone-600 leading-relaxed">{t.teachPage.req4_desc}</p>
          </div>

        </div>

      </div>
    </section>

    <!-- Application Form Section -->
    <section id="apply-form" class="py-24 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="bg-gradient-to-br from-amber-50/50 via-white to-amber-50/30 rounded-3xl p-6 sm:p-12 border-2 border-amber-300/80 shadow-2xl space-y-8">
          
          <!-- Header -->
          <div class="text-center space-y-3">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
              <span>✍️</span>
              <span>{currentLang === 'am' ? 'የማመልከቻ ቅጽ' : 'Application'}</span>
            </div>
            <h3 class="text-2xl sm:text-4xl font-serif font-bold text-stone-900">
              {t.teachPage.formTitle}
            </h3>
            <p class="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
              {t.teachPage.formSubtitle}
            </p>
          </div>

          {#if submissionSuccess}
            <div class="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-4 animate-fade-in">
              <div class="text-4xl">✅</div>
              <h4 class="text-xl font-serif font-bold text-emerald-900">
                {currentLang === 'am' ? 'ማመልከቻዎ በተሳካ ሁኔታ ተልኳል!' : 'Application Submitted Successfully!'}
              </h4>
              <p class="text-sm text-emerald-700 max-w-lg mx-auto">
                {currentLang === 'am' 
                  ? 'መረጃዎ ተመዝግቧል። የአካዳሚው አስተባባሪዎች በዋትስአፕ ወይም በቴሌግራም መልስ ይሰጡዎታል።' 
                  : 'Your details have been saved. Our coordinator will contact you directly on WhatsApp / Telegram.'}
              </p>
              <div class="pt-2 flex flex-wrap justify-center gap-3">
                <a 
                  href="https://t.me/CEOJAPIBR2" 
                  target="_blank" 
                  class="px-5 py-2.5 rounded-full bg-sky-600 text-white font-bold text-xs hover:bg-sky-500 transition-colors inline-flex items-center gap-2"
                >
                  <span>✈️</span>
                  <span>{currentLang === 'am' ? 'በቴሌግራም ይደውሉልን' : 'Follow Up on Telegram'}</span>
                </a>
                <button 
                  onclick={() => submissionSuccess = false} 
                  class="px-5 py-2.5 rounded-full bg-stone-200 text-stone-800 font-semibold text-xs hover:bg-stone-300"
                >
                  {currentLang === 'am' ? 'ሌላ ማመልከቻ ይሙሉ' : 'Submit Another'}
                </button>
              </div>
            </div>
          {:else}
            <!-- The Form -->
            <form onsubmit={handleSubmit} class="space-y-6">
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <!-- Full Name -->
                <div class="space-y-1.5">
                  <label for="teach-fullname" class="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    {t.teachPage.fullName} *
                  </label>
                  <input 
                    id="teach-fullname"
                    type="text" 
                    required
                    bind:value={fullName}
                    placeholder="e.g. Memhir Hailemariam Tadesse"
                    class="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-sm outline-hidden bg-white"
                  />
                </div>

                <!-- Phone / WhatsApp -->
                <div class="space-y-1.5">
                  <label for="teach-phone" class="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    {t.teachPage.phone} *
                  </label>
                  <input 
                    id="teach-phone"
                    type="tel" 
                    required
                    bind:value={phone}
                    placeholder="+251 9... or +1..."
                    class="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-sm outline-hidden bg-white"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <!-- Telegram -->
                <div class="space-y-1.5">
                  <label for="teach-telegram" class="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    {t.teachPage.telegram}
                  </label>
                  <input 
                    id="teach-telegram"
                    type="text" 
                    bind:value={telegram}
                    placeholder="@your_username"
                    class="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-sm outline-hidden bg-white"
                  />
                </div>

                <!-- Diocese / Church Origin -->
                <div class="space-y-1.5">
                  <label for="teach-diocese" class="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    {t.teachPage.diocese}
                  </label>
                  <input 
                    id="teach-diocese"
                    type="text" 
                    bind:value={diocese}
                    placeholder="e.g. Addis Ababa / Gondar / Debre Libanos"
                    class="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-sm outline-hidden bg-white"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <!-- Specialty Dropdown -->
                <div class="space-y-1.5">
                  <label for="teach-specialty" class="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    {t.teachPage.specialty} *
                  </label>
                  <select 
                    id="teach-specialty"
                    bind:value={specialty}
                    class="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-sm outline-hidden bg-white"
                  >
                    {#each t.teachPage.specialtyOptions as opt}
                      <option value={opt}>{opt}</option>
                    {/each}
                  </select>
                </div>

                <!-- Experience -->
                <div class="space-y-1.5">
                  <label for="teach-experience" class="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    {t.teachPage.experience} *
                  </label>
                  <select 
                    id="teach-experience"
                    bind:value={experience}
                    class="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-sm outline-hidden bg-white"
                  >
                    <option value="1-2 Years">{currentLang === 'am' ? '1 - 2 ዓመት' : '1 - 2 Years'}</option>
                    <option value="3-5 Years">{currentLang === 'am' ? '3 - 5 ዓመት' : '3 - 5 Years'}</option>
                    <option value="6-10 Years">{currentLang === 'am' ? '6 - 10 ዓመት' : '6 - 10 Years'}</option>
                    <option value="10+ Years">{currentLang === 'am' ? 'ከ10 ዓመት በላይ' : '10+ Years'}</option>
                  </select>
                </div>
              </div>

              <!-- Short Bio / Intro -->
              <div class="space-y-1.5">
                <label for="teach-bio" class="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  {t.teachPage.bio}
                </label>
                <textarea 
                  id="teach-bio"
                  rows="3"
                  bind:value={bio}
                  placeholder={currentLang === 'am' ? 'የትምህርት ቤትዎ መነሻ፣ የዜማ ልምድዎና የማስተማር ፍላጎትዎ...' : 'Tell us about your church education background, teachers, and teaching philosophy...'}
                  class="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-sm outline-hidden bg-white"
                ></textarea>
              </div>

              <!-- Submit Button -->
              <button 
                type="submit"
                disabled={isSubmitting}
                class="w-full py-4 rounded-full bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-base shadow-xl hover:shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isSubmitting ? '⏳' : '🚀'}</span>
                <span>{t.teachPage.submitBtn}</span>
                <span>→</span>
              </button>

            </form>
          {/if}

          <!-- Direct Coordinator Inquiries -->
          <div class="pt-6 border-t border-amber-200/60 text-center space-y-3">
            <span class="text-xs text-stone-500 font-medium">
              {t.teachPage.directInquiry}
            </span>
            <div class="flex flex-wrap items-center justify-center gap-4 text-xs font-bold">
              <a 
                href="https://wa.me/251711890131" 
                target="_blank" 
                class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors"
              >
                <span>💬</span>
                <span>WhatsApp (+251 711 890 131)</span>
              </a>
              <a 
                href="https://t.me/CEOJAPIBR2" 
                target="_blank" 
                class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 transition-colors"
              >
                <span>✈️</span>
                <span>Telegram (@CEOJAPIBR2)</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>

  </main>

  <!-- Clean Footer -->
  <footer class="bg-stone-950 text-white border-t border-stone-800 py-8 text-center text-xs text-stone-400">
    <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <span>© 2026 Bete Arsema Online Academy — Faculty Department</span>
      <div class="flex items-center gap-4">
        <a href="/" class="hover:text-amber-300">Home</a>
        <a href="/teachers" class="hover:text-amber-300">All Faculty</a>
        <a href="/admin" class="hover:text-amber-300 text-stone-600">Admin</a>
      </div>
    </div>
  </footer>

</div>
