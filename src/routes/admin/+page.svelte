<script>
  // Dedicated Admin Portal Redirect & Gateway
  const adminUrl = 'http://localhost:5174';
</script>

<svelte:head>
  <title>Bete Arsema | Admin Portal Access</title>
</svelte:head>

<div class="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-4">
  <div class="max-w-md w-full bg-stone-900 border border-amber-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6 relative overflow-hidden">
    <div class="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="w-20 h-20 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-4xl shadow-inner shadow-amber-500/20">
      🛡️
    </div>

    <div class="space-y-2">
      <span class="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold tracking-widest uppercase">
        Standalone Admin Service
      </span>
      <h1 class="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
        Management Portal
      </h1>
      <p class="text-xs sm:text-sm text-stone-400 leading-relaxed">
        The admin dashboard is now separated into a dedicated standalone application running securely on port 5174.
      </p>
    </div>

    <div class="pt-2 space-y-3">
      <a 
        href={adminUrl} 
        target="_blank"
        class="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>Open Admin Dashboard</span>
        <span>↗</span>
      </a>

      <a 
        href="/" 
        class="block text-xs font-semibold text-stone-400 hover:text-white transition-colors py-2"
      >
        ← Return to Main Website
      </a>
    </div>

    <div class="pt-4 border-t border-stone-800 text-[11px] text-stone-500 font-mono">
      Standalone service path: <span class="text-amber-400/80">/admin-dashboard</span>
    </div>
  </div>
</div>
