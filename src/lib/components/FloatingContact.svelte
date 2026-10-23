<script>
  /** @type {{ lang?: string }} */
  let { lang = 'en' } = $props();

  let expanded = $state(false);

  function toggle() {
    expanded = !expanded;
  }

  const contacts = [
    {
      id: 'telegram',
      label: 'Telegram',
      icon: '✈️',
      href: 'https://t.me/CEOJAPIBR2',
      bg: 'bg-sky-500 hover:bg-sky-400',
      shadow: 'shadow-sky-500/40',
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: '📱',
      href: 'https://wa.me/251711890131',
      bg: 'bg-green-500 hover:bg-green-400',
      shadow: 'shadow-green-500/40',
    },
  ];
</script>

<!-- Floating Contact FAB (stacked above Chatbot button) -->
<div class="fixed bottom-22 right-6 z-50 flex flex-col items-end gap-3">

  <!-- Sub-buttons (WhatsApp & Telegram) -->
  {#each contacts as contact (contact.id)}
    <div
      class="flex items-center gap-2 transition-all duration-300 ease-out {expanded
        ? 'opacity-100 translate-y-0 pointer-events-auto'
        : 'opacity-0 translate-y-4 pointer-events-none'}"
    >
      <!-- Tooltip label (hidden on mobile) -->
      <span
        class="
          hidden sm:block
          bg-stone-900 text-white text-xs font-medium
          px-3 py-1.5 rounded-full shadow-lg
          whitespace-nowrap
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
        "
        aria-hidden="true"
      >
        {contact.label}
      </span>

      <!-- Contact button -->
      <div class="group relative flex items-center">
        <!-- Tooltip (appears on hover, visible sm+) -->
        <span
          class="
            hidden sm:block
            absolute right-full mr-3
            bg-stone-900 text-white text-xs font-medium
            px-3 py-1.5 rounded-full shadow-lg
            whitespace-nowrap
            opacity-0 group-hover:opacity-100
            pointer-events-none
            transition-opacity duration-200
          "
        >
          {contact.label}
        </span>

        <a
          href={contact.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={contact.label}
          class="
            flex items-center justify-center
            w-12 h-12 rounded-full
            {contact.bg}
            text-white text-xl
            shadow-lg {contact.shadow}
            transition-all duration-200
            hover:scale-110 active:scale-95
          "
        >
          {contact.icon}
        </a>
      </div>
    </div>
  {/each}

  <!-- Main toggle button -->
  <div class="relative">
    <!-- Pulse ring (shown only when collapsed) -->
    {#if !expanded}
      <span
        class="
          absolute inset-0 rounded-full
          bg-amber-500 opacity-60
          animate-ping
        "
        aria-hidden="true"
      ></span>
    {/if}

    <button
      onclick={toggle}
      aria-label={expanded ? 'Close contact menu' : 'Open contact menu'}
      aria-expanded={expanded}
      class="
        relative flex items-center justify-center
        w-14 h-14 rounded-full
        bg-amber-600 hover:bg-amber-500
        text-white text-2xl
        shadow-2xl shadow-amber-600/50
        transition-all duration-300
        hover:scale-105 active:scale-95
        focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2
      "
    >
      <span
        class="transition-transform duration-300 {expanded ? 'rotate-0' : 'rotate-0'} select-none"
        aria-hidden="true"
      >
        {#if expanded}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
          </svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path fill-rule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223 3.977 3.977 0 00.744.044 6.647 6.647 0 002.656-.572z" clip-rule="evenodd" />
          </svg>
        {/if}
      </span>
    </button>
  </div>
</div>
