<script>
  let { t, lang = 'en' } = $props();

  let formName = $state('');
  let formEmail = $state('');
  let formPhone = $state('');
  let formCourse = $state('Begena (በገና)');
  let formMessage = $state('');
  let isSubmitted = $state(false);
  let isSending = $state(false);

  async function handleSubmit(event) {
    event.preventDefault();
    isSending = true;
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName || 'Website Visitor',
          email: formEmail,
          phone: formPhone,
          subject: `Interested in: ${formCourse}`,
          message: formMessage || 'Inquiry sent from website contact form.',
          channel: 'Contact Form'
        })
      });
    } catch (e) {
      console.error('Contact form submission error:', e);
    } finally {
      isSending = false;
      isSubmitted = true;
    }
  }

  function sendViaTelegram() {
    window.open('https://t.me/CEOJAPIBR2', '_blank');
  }

  function sendViaWhatsApp() {
    const text = encodeURIComponent(
      `Hello Bete Arsema Academy!\nName: ${formName || 'A Student'}\nPhone: ${formPhone || 'Not provided'}\nInterested in: ${formCourse}\nMessage: ${formMessage || 'I would like to enroll in your online classes.'}`
    );
    window.open(`https://wa.me/251968590145?text=${text}`, '_blank');
  }
</script>

<section id="contact" class="py-24 bg-amber-50/30">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    <!-- Section Header -->
    <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
        <span>📬</span>
        <span>{t.contact.badge}</span>
      </div>
      <h2 class="text-3xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight">
        {t.contact.title}
      </h2>
      <p class="text-base sm:text-lg text-stone-600 leading-relaxed">
        {t.contact.subtitle}
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      
      <!-- Contact Info Cards (5 cols) -->
      <div class="lg:col-span-5 space-y-6">
        
        <!-- Phone Card -->
        <div class="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-xs flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl shrink-0">
            📞
          </div>
          <div>
            <h4 class="text-sm font-bold text-stone-900 mb-1">{t.contact.callTitle}</h4>
            <div class="space-y-0.5 text-sm text-stone-600">
              <a href="tel:+251968590145" class="block hover:text-amber-700 font-medium">+251 968 590 145</a>
            </div>
          </div>
        </div>

        <!-- Email Card -->
        <div class="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-xs flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl shrink-0">
            ✉️
          </div>
          <div>
            <h4 class="text-sm font-bold text-stone-900 mb-1">{t.contact.emailTitle}</h4>
            <a href="mailto:leulbiniam2@gmail.com" class="text-sm font-medium text-stone-600 hover:text-amber-700 break-all">
              leulbiniam2@gmail.com
            </a>
          </div>
        </div>

        <!-- Instant Messaging Quick Actions -->
        <div class="bg-linear-to-br from-stone-900 to-amber-950 text-white rounded-2xl p-6 shadow-xl space-y-4">
          <h4 class="text-base font-serif font-bold text-amber-300">
            {lang === 'am' ? 'ፈጣን መልዕክት መላኪያ' : 'Instant Chat Channels'}
          </h4>
          <p class="text-xs text-stone-300">
            {lang === 'am' ? 'በቀጥታ በቴሌግራም ወይም በዋትስአፕ መልዕክት በመላክ ወዲያውኑ መረጃ ያግኙ።' : 'Chat with us directly on Telegram or WhatsApp for immediate class coordination.'}
          </p>
          <div class="grid grid-cols-2 gap-3 pt-2">
            <button 
              onclick={sendViaTelegram}
              class="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <span>✈️</span>
              <span>Telegram</span>
            </button>
            <button 
              onclick={sendViaWhatsApp}
              class="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <span>💬</span>
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

      </div>

      <!-- Contact / Inquiry Form (7 cols) -->
      <div class="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-amber-200/80 shadow-xl">
        <h3 class="text-2xl font-serif font-bold text-stone-900 mb-2">
          {t.contact.formTitle}
        </h3>
        <p class="text-xs sm:text-sm text-stone-500 mb-8">
          {lang === 'am' ? 'ቅጹን በመሙላት ፍላጎትዎን ያሳውቁን፤ በቅርቡ እናገኝዎታለን።' : 'Fill in the details below and our coordinator will connect with you.'}
        </p>

        {#if isSubmitted}
          <div class="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 text-center space-y-4">
            <div class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 text-2xl flex items-center justify-center mx-auto">
              ✓
            </div>
            <h4 class="text-lg font-bold text-emerald-900">{t.contact.successMsg}</h4>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button 
                onclick={sendViaTelegram}
                class="w-full sm:w-auto px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-500 cursor-pointer"
              >
                {t.contact.telegramQuick} &rarr;
              </button>
              <button 
                onclick={sendViaWhatsApp}
                class="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 cursor-pointer"
              >
                {t.contact.whatsappQuick} &rarr;
              </button>
            </div>
          </div>
        {:else}
          <form onsubmit={handleSubmit} class="space-y-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label for="form-name" class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  {t.contact.fullName} *
                </label>
                <input 
                  id="form-name"
                  type="text" 
                  required
                  bind:value={formName}
                  placeholder="e.g. Yohannes / ዮሐንስ"
                  class="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-sm outline-hidden transition-all"
                />
              </div>

              <div>
                <label for="form-email" class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  {t.contact.email} *
                </label>
                <input 
                  id="form-email"
                  type="email" 
                  required
                  bind:value={formEmail}
                  placeholder="name@example.com"
                  class="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-sm outline-hidden transition-all"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label for="form-phone" class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  {t.contact.phone} *
                </label>
                <input 
                  id="form-phone"
                  type="tel" 
                  required
                  bind:value={formPhone}
                  placeholder="+251 9... / WhatsApp"
                  class="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-sm outline-hidden transition-all"
                />
              </div>

              <div>
                <label for="form-course" class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  {t.contact.courseInterest}
                </label>
                <select 
                  id="form-course"
                  bind:value={formCourse}
                  class="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-sm outline-hidden transition-all bg-white"
                >
                  <option value="Begena (በገና)">{t.contact.begenaOption}</option>
                  <option value="Krar (ክራር)">{t.contact.krarOption}</option>
                  <option value="Washint (ዋሽንት)">{t.contact.washintOption}</option>
                  <option value="Ge'ez Language (ግዕዝ ቋንቋ)">{t.contact.geezOption}</option>
                  <option value="Orthodox Mezmur (የተዋሕዶ መዝሙር)">{t.contact.mezmurOption}</option>
                  <option value="Complete Track (Instruments + Ge'ez + Mezmur)">{t.contact.combinedOption}</option>
                </select>
              </div>
            </div>

            <div>
              <label for="form-msg" class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                {t.contact.message}
              </label>
              <textarea 
                id="form-msg"
                rows="4" 
                bind:value={formMessage}
                placeholder={lang === 'am' ? 'ስለሚፈልጉት የሰዓት አመዳደብ ወይም ጥያቄ እዚህ ይጻፉ...' : 'Tell us about your schedule preference, timezone, or any questions...'}
                class="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-sm outline-hidden transition-all"
              ></textarea>
            </div>

            <div class="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <button 
                type="submit"
                class="w-full sm:w-auto px-8 py-3.5 rounded-full bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                {t.contact.submitBtn}
              </button>
              <div class="text-xs text-stone-500">
                🔒 {lang === 'am' ? 'መረጃዎ በጥንቃቄ የተጠበቀ ነው።' : 'Your information is private and secure.'}
              </div>
            </div>
          </form>
        {/if}

      </div>

    </div>

  </div>
</section>
