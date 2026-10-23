<script>
  let { isOpen = false, selectedPlan = '', onClose = () => {}, t, lang = 'en' } = $props();

  let studentName = $state('');
  let studentPhone = $state('');
  let studentTimezone = $state('Ethiopia (EAT)');
  let preferredChannel = $state('telegram'); // 'telegram', 'whatsapp', 'call'

  let isSaving = $state(false);

  async function handleEnroll(channel) {
    if (studentName || studentPhone) {
      isSaving = true;
      try {
        await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentName: studentName || 'New Student',
            phone: studentPhone || 'Not provided',
            timezone: studentTimezone,
            planName: selectedPlan || 'Online Classes',
            instrument: selectedPlan.includes('Krar') ? 'Krar' : (selectedPlan.includes('Masinko') ? 'Masinko' : 'Begena'),
            notes: `Channel: ${channel}`
          })
        });
      } catch (e) {
        console.error('Failed to log booking:', e);
      } finally {
        isSaving = false;
      }
    }

    const text = encodeURIComponent(
      `Hello Bete Arsema Academy!\nI would like to enroll in: ${selectedPlan || 'Online Classes'}\nName: ${studentName || 'New Student'}\nPhone/WhatsApp: ${studentPhone || 'Not provided'}\nTimezone: ${studentTimezone}`
    );

    if (channel === 'telegram') {
      window.open('https://t.me/CEOJAPIBR2', '_blank');
    } else if (channel === 'whatsapp') {
      window.open(`https://wa.me/251968590145?text=${text}`, '_blank');
    } else {
      window.location.href = 'tel:+251968590145';
    }
    onClose();
  }
</script>

{#if isOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs transition-opacity animate-fade-in">
    
    <!-- Modal Card -->
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-amber-300 relative space-y-6">
      
      <!-- Close Button -->
      <button 
        onclick={onClose}
        aria-label="Close modal"
        class="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
      >
        ✕
      </button>

      <!-- Modal Header -->
      <div class="space-y-1">
        <div class="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
          {selectedPlan || 'Bete Arsema Online'}
        </div>
        <h3 class="text-2xl font-serif font-bold text-stone-900">
          {t.modal.title}
        </h3>
        <p class="text-xs sm:text-sm text-stone-500">
          {t.modal.subtitle}
        </p>
      </div>

      <!-- Quick Fields -->
      <div class="space-y-4">
        <div>
          <label for="student-name" class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
            {t.contact.fullName}
          </label>
          <input 
            id="student-name"
            type="text" 
            bind:value={studentName}
            placeholder="e.g. Dawit / ዳዊት"
            class="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-sm outline-hidden"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="student-phone" class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              {t.contact.phone}
            </label>
            <input 
              id="student-phone"
              type="tel" 
              bind:value={studentPhone}
              placeholder="+251 9... / WhatsApp"
              class="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-sm outline-hidden"
            />
          </div>

          <div>
            <label for="student-tz" class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Timezone / Location
            </label>
            <select 
              id="student-tz"
              bind:value={studentTimezone}
              class="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-sm outline-hidden bg-white"
            >
              <option value="Ethiopia (EAT)">Ethiopia (EAT)</option>
              <option value="USA / Canada (EST)">USA / Canada (EST)</option>
              <option value="USA / Canada (PST)">USA / Canada (PST)</option>
              <option value="Europe (CET / GMT)">Europe (CET / GMT)</option>
              <option value="Middle East">Middle East</option>
              <option value="Other">Other / International</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="pt-2 space-y-3">
        <p class="text-xs font-bold text-stone-600 uppercase tracking-wider text-center">
          {lang === 'am' ? 'በሚከተሉት ፈጣን መንገዶች ይመዝገቡ:' : 'Complete Registration Via:'}
        </p>

        <div class="grid grid-cols-2 gap-3">
          <button 
            onclick={() => handleEnroll('telegram')}
            class="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <span>✈️</span>
            <span>Telegram</span>
          </button>
          
          <button 
            onclick={() => handleEnroll('whatsapp')}
            class="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <span>💬</span>
            <span>WhatsApp</span>
          </button>
        </div>

        <button 
          onclick={() => handleEnroll('call')}
          class="w-full py-2.5 px-4 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>📞</span>
          <span>{lang === 'am' ? 'በቀጥታ በስልክ ይደውሉ (+251 968 590 145)' : 'Direct Phone Call (+251 968 590 145)'}</span>
        </button>
      </div>

    </div>

  </div>
{/if}
