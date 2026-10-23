<script>
  import { onMount } from 'svelte';
  import { findChatbotResponse } from '#lib/chatbotKnowledge.js';

  let { lang = 'en', onOpenBooking = () => {} } = $props();

  let isOpen = $state(false);
  let userInput = $state('');
  let messagesContainer = $state(null);
  let hasInteracted = $state(false);

  let initialGreetingEn = 'Selam! Peace be with you. Welcome to Bete Arsema Online Academy. I am your spiritual guide and assistant. How can I help you today? Ask me anything about our Begena, Krar, Ge\'ez language lectures, or Orthodox Mezmur.';
  let initialGreetingAm = 'ሰላመ እግዚአብሔር ከእርስዎ ጋር ይሁን! ወደ ቤተ አርሴማ የኦንላይን መንፈሳዊ አካዳሚ በደህና መጡ። እኔ የበይነ-መረብ ረዳትዎ ነኝ። ስለ በገና፣ ስለ ክራር፣ ስለ ግዕዝ ቋንቋ ወይም ስለ ኦርቶዶክስ መዝሙር ምን ማወቅ ይፈልጋሉ?';

  let messages = $state([]);

  $effect(() => {
    // If conversation is just starting, update greeting to match active language
    if (messages.length === 0) {
      messages = [
        {
          sender: 'bot',
          text: lang === 'am' ? initialGreetingAm : initialGreetingEn,
          suggestions: lang === 'am'
            ? ['የበገና ትምህርት', 'የግዕዝ ቋንቋ', 'የትምህርት ክፍያ በUSDT/ቴሌብር', 'ከአስተባባሪ ጋር መነጋገር']
            : ['What is the Begena?', 'How do classes work?', 'Teach me about Ge\'ez', 'Tuition & USDT']
        }
      ];
    }
  });

  function toggleChat() {
    isOpen = !isOpen;
    hasInteracted = true;
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }

  function scrollToBottom() {
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  function handleSend(textToSend) {
    const query = textToSend || userInput;
    if (!query || query.trim() === '') return;

    // Add user message
    messages.push({
      sender: 'user',
      text: query.trim()
    });

    userInput = '';
    setTimeout(scrollToBottom, 50);

    // Compute bot response
    setTimeout(() => {
      const response = findChatbotResponse(query, lang);
      messages.push({
        sender: 'bot',
        text: response.text,
        suggestions: response.suggestions,
        action: response.action
      });
      setTimeout(scrollToBottom, 50);
    }, 300);
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSend();
    }
  }

  function openWhatsAppHuman() {
    window.open('https://wa.me/251968590145?text=Hello%20Bete%20Arsema%20Academy!%20I%20have%20questions%20about%20your%20classes.', '_blank');
  }

  function openTelegramHuman() {
    window.open('https://t.me/CEOJAPIBR2', '_blank');
  }
</script>

<!-- Floating Chat Widget -->
<aside class="fixed bottom-5 right-5 z-50 flex flex-col items-end" aria-label="Bete Arsema Spiritual Assistant">
  

  <!-- Main Chat Window (When Opened) -->
  {#if isOpen}
    <div class="w-[92vw] sm:w-[380px] md:w-[420px] h-[520px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border-2 border-amber-300 flex flex-col overflow-hidden mb-3 animate-fade-in transition-all">
      
      <!-- Chat Header -->
      <div class="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white p-4 flex items-center justify-between shadow-md">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-xl shadow-xs">
            ⛪
          </div>
          <div>
            <h3 class="text-sm font-serif font-bold text-amber-200 leading-tight">
              {lang === 'am' ? 'የቤተ አርሴማ ረዳት' : 'Bete Arsema Assistant'}
            </h3>
            <p class="text-[10px] text-amber-400/90 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{lang === 'am' ? 'ዝግጁ ነው • መንፈሳዊ መመሪያ' : 'Online • Spiritual & Course Guide'}</span>
            </p>
          </div>
        </div>

        <button 
          onclick={toggleChat}
          aria-label="Close Chat"
          class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
        >
          ✕
        </button>
      </div>

      <!-- Messages Body -->
      <div 
        bind:this={messagesContainer}
        class="flex-1 overflow-y-auto p-4 space-y-4 bg-amber-50/20 text-xs sm:text-sm"
      >
        {#each messages as msg}
          {#if msg.sender === 'user'}
            <div class="flex justify-end">
              <div class="max-w-[80%] bg-amber-700 text-white rounded-2xl rounded-tr-xs px-4 py-2.5 shadow-xs leading-relaxed">
                {msg.text}
              </div>
            </div>
          {:else}
            <div class="flex flex-col items-start space-y-2.5">
              <div class="max-w-[88%] bg-white rounded-2xl rounded-tl-xs p-4 border border-amber-200/80 shadow-xs text-stone-800 leading-relaxed whitespace-pre-line">
                {msg.text}
              </div>

              <!-- Action buttons if triggered by intent -->
              {#if msg.action === 'open_pricing'}
                <div class="flex items-center gap-2 pl-1">
                  <a href="#pricing" onclick={() => isOpen = false} class="px-3 py-1.5 rounded-full bg-amber-700 hover:bg-amber-800 text-white text-[11px] font-bold shadow-xs">
                    {lang === 'am' ? 'ክፍያዎችን ይመልከቱ' : 'View Tuition Plans'} &rarr;
                  </a>
                  <button onclick={() => onOpenBooking('Tuition Inquiry')} class="px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
                    {lang === 'am' ? 'ይመዝገቡ' : 'Enroll Now'}
                  </button>
                </div>
              {:else if msg.action === 'open_instruments'}
                <div class="flex items-center gap-2 pl-1">
                  <a href="#instruments" onclick={() => isOpen = false} class="px-3 py-1.5 rounded-full bg-amber-700 hover:bg-amber-800 text-white text-[11px] font-bold shadow-xs">
                    {lang === 'am' ? 'የመሣሪያ ድምፅ ይስማ' : 'Test Virtual Begena'} &rarr;
                  </a>
                </div>
              {:else if msg.action === 'open_contact'}
                <div class="flex items-center gap-2 pl-1">
                  <button onclick={openWhatsAppHuman} class="px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs flex items-center gap-1">
                    <span>💬</span>
                    <span>WhatsApp</span>
                  </button>
                  <button onclick={openTelegramHuman} class="px-3 py-1.5 rounded-full bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-bold shadow-xs flex items-center gap-1">
                    <span>✈️</span>
                    <span>Telegram</span>
                  </button>
                </div>
              {/if}

              <!-- Suggested Next Questions Chips -->
              {#if msg.suggestions && msg.suggestions.length > 0}
                <div class="flex flex-wrap gap-1.5 pt-1">
                  {#each msg.suggestions as chip}
                    <button 
                      onclick={() => handleSend(chip)}
                      class="px-2.5 py-1 rounded-full bg-amber-100/90 hover:bg-amber-200 text-amber-950 text-[10px] sm:text-[11px] font-semibold border border-amber-300/80 transition-all cursor-pointer text-left"
                    >
                      {chip}
                    </button>
                  {/each}
                </div>
              {/if}
            </div>
          {/if}
        {/each}
      </div>

      <!-- Human Support Quick Bar -->
      <div class="bg-amber-100/60 px-4 py-2 border-t border-amber-200/80 flex items-center justify-between text-[11px]">
        <span class="text-stone-600 font-medium">
          {lang === 'am' ? 'ከሰው ጋር መነጋገር ይፈልጋሉ?' : 'Need human coordinator?'}
        </span>
        <div class="flex items-center gap-2">
          <button 
            onclick={openWhatsAppHuman}
            class="text-emerald-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>💬</span>
            <span>WhatsApp (+251 968 590 145)</span>
          </button>
        </div>
      </div>

      <!-- Input Bar -->
      <div class="p-3 bg-white border-t border-amber-200/80 flex items-center gap-2">
        <input 
          type="text"
          bind:value={userInput}
          onkeydown={handleKeyDown}
          placeholder={lang === 'am' ? 'ስለ በገና፣ ግዕዝ፣ መዝሙር ወይም ክፍያ ይጠይቁ...' : 'Ask about Begena, Ge\'ez, Mezmur, pricing...'}
          class="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-xs sm:text-sm outline-hidden"
        />
        <button 
          onclick={() => handleSend()}
          aria-label="Send message"
          class="w-10 h-10 rounded-xl bg-amber-700 hover:bg-amber-800 text-white flex items-center justify-center text-sm shadow-md transition-all cursor-pointer shrink-0"
        >
          ➤
        </button>
      </div>

    </div>
  {/if}

  <!-- Floating Toggle Button -->
  <button 
    onclick={toggleChat}
    aria-label="Open Chat Assistant"
    class="relative w-14 h-14 rounded-full bg-linear-to-tr from-amber-700 via-amber-800 to-amber-900 text-white flex items-center justify-center text-2xl shadow-2xl hover:shadow-amber-900/30 ring-4 ring-white hover:scale-110 transition-all cursor-pointer"
  >
    {#if isOpen}
      <span class="text-lg font-bold">✕</span>
    {:else}
      <span>💬</span>
      <!-- Pulsing green notification dot -->
      <span class="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full ring-2 ring-white animate-pulse"></span>
    {/if}
  </button>

</aside>
