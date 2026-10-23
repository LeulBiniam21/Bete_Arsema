<script>
  import { onMount } from 'svelte';
  import { getTeachers } from '#lib/teachersData.js';

  let { t, lang = 'en', onOpenBooking = () => {} } = $props();

  let currentIndex = $state(0);
  let isPaused = $state(false);
  let touchStartX = 0;
  let touchEndX = 0;

  let dynamicTeachers = $state([]);

  function reloadTeachers() {
    const loaded = getTeachers();
    if (loaded && loaded.length > 0) {
      dynamicTeachers = loaded.filter(item => item.active !== false);
    }
  }

  onMount(() => {
    reloadTeachers();
    window.addEventListener('storage', reloadTeachers);
    return () => window.removeEventListener('storage', reloadTeachers);
  });

  let teachers = $derived.by(() => {
    if (dynamicTeachers.length > 0) {
      return dynamicTeachers.map(item => ({
        ...item,
        name: (lang === 'am' && item.nameAm) ? item.nameAm : item.name,
        role: (lang === 'am' && item.roleAm) ? item.roleAm : item.role,
        origin: (lang === 'am' && item.originAm) ? item.originAm : item.origin,
        teaching: (lang === 'am' && item.teachingAm) ? item.teachingAm : item.teaching,
        bio: (lang === 'am' && item.bioAm) ? item.bioAm : item.bio,
        exp: (lang === 'am' && item.expAm) ? item.expAm : item.exp
      }));
    }
    return t.instructors.list || [];
  });

  let currentTeacher = $derived(teachers[currentIndex] || {});

  function nextSlide() {
    if (teachers.length === 0) return;
    currentIndex = (currentIndex + 1) % teachers.length;
  }

  function prevSlide() {
    if (teachers.length === 0) return;
    currentIndex = (currentIndex - 1 + teachers.length) % teachers.length;
  }

  function goToSlide(index) {
    currentIndex = index;
  }

  // Auto-circulate every 4.5 seconds
  $effect(() => {
    if (isPaused || teachers.length <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(interval);
  });

  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
  }

  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      nextSlide();
    } else if (touchEndX - touchStartX > 50) {
      prevSlide();
    }
  }

  function handleKeydown(e) {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  }

  function getTeacherSlug(tObj) {
    if (!tObj || !tObj.name) return 'yohannes-gebre';
    const n = tObj.name.toLowerCase();
    if (n.includes('yohannes') || n.includes('ዮሐንስ')) return 'yohannes-gebre';
    if (n.includes('daniel') || n.includes('ዳንኤል')) return 'daniel-assefa';
    if (n.includes('samuel') || n.includes('ሳሙኤል')) return 'samuel-bekele';
    if (n.includes('martha') || n.includes('ማርታ')) return 'martha-tesfaye';
    return 'yohannes-gebre';
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<section id="instructors" class="py-24 bg-linear-to-b from-stone-50 via-amber-50/25 to-stone-50 border-b border-amber-900/10">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    <!-- Section Header -->
    <div class="text-center max-w-3xl mx-auto mb-14 space-y-4">
      <div class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
        <span>🎓</span>
        <span>{t.instructors.badge}</span>
      </div>
      <h2 class="text-3xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight">
        {t.instructors.title}
      </h2>
      <p class="text-base sm:text-lg text-stone-600 leading-relaxed">
        {t.instructors.subtitle}
      </p>

      <!-- Auto-Circulation Indicator Pill -->
      <div class="pt-2 flex items-center justify-center gap-2">
        <span class="inline-flex items-center gap-2 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200/80 px-3.5 py-1 rounded-full shadow-xs">
          <span class={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-emerald-500 animate-ping'}`}></span>
          <span>{isPaused ? (t.instructors.pausedLabel || 'Paused on hover') : (t.instructors.autoCirculating || 'Auto-sliding')}</span>
        </span>
      </div>
    </div>

    <!-- Slidable Box Carousel Container -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div 
      class="relative max-w-5xl mx-auto group"
      onmouseenter={() => (isPaused = true)}
      onmouseleave={() => (isPaused = false)}
      ontouchstart={handleTouchStart}
      ontouchend={handleTouchEnd}
    >
      <!-- Main Featured Slidable Box -->
      <div class="relative bg-linear-to-br from-stone-950 via-amber-950 to-stone-900 text-white rounded-3xl sm:rounded-4xl p-6 sm:p-10 lg:p-12 border border-amber-500/30 shadow-2xl overflow-hidden transition-all duration-500">
        
        <!-- Subtle Watermark Background Symbol -->
        <div class="absolute -right-6 -bottom-6 text-9xl font-serif text-amber-400/5 select-none pointer-events-none font-bold">
          ⛪
        </div>

        <!-- 2-Column Responsive Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          <!-- Column 1: Teacher Portrait Image (5 Cols) -->
          <div class="lg:col-span-5 flex flex-col items-center">
            <div class="relative w-full max-w-xs sm:max-w-sm aspect-square sm:aspect-4/5 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-amber-400/40 shadow-2xl bg-stone-900 group/img">
              <img 
                src={currentTeacher.image} 
                alt={currentTeacher.name}
                loading="eager"
                decoding="async"
                width="400"
                height="500"
                class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/img:scale-105"
              />
              
              <!-- Dark gradient overlay at bottom of photo -->
              <div class="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-stone-950 via-stone-950/50 to-transparent"></div>

              <!-- Top Left: Experience Badge -->
              <div class="absolute top-4 left-4 bg-amber-700/90 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md border border-amber-400/30">
                {currentTeacher.exp}
              </div>

              <!-- Top Right: Index Counter (e.g. 01 / 05) -->
              <div class="absolute top-4 right-4 bg-stone-950/80 backdrop-blur-xs text-amber-300 font-mono text-xs font-bold px-2.5 py-1 rounded-full border border-amber-500/20">
                0{currentIndex + 1} / 0{teachers.length}
              </div>

              <!-- Bottom Overlay: Name Preview on Mobile -->
              <div class="absolute bottom-4 inset-x-4 block lg:hidden text-center">
                <span class="text-sm font-bold text-amber-200 bg-stone-950/80 px-3 py-1 rounded-full border border-amber-500/30">
                  {currentTeacher.role}
                </span>
              </div>
            </div>
          </div>

          <!-- Column 2: Teacher Name, Origin & Teaching Details (7 Cols) -->
          <div class="lg:col-span-7 space-y-6 flex flex-col justify-between">
            
            <!-- Header: Name & Role -->
            <div class="space-y-2">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
                <span>{currentTeacher.originIcon || '⭐'}</span>
                <span>{currentTeacher.role}</span>
              </div>
              
              <h3 class="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-100 tracking-tight">
                {currentTeacher.name}
              </h3>
            </div>

            <!-- Detail Box 1: WHERE THEY CAME FROM (Origin) -->
            <div class="bg-amber-900/30 hover:bg-amber-900/40 transition-colors border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-xl shrink-0">
                🏛️
              </div>
              <div class="space-y-1">
                <span class="block text-xs font-bold uppercase tracking-wider text-amber-300">
                  {t.instructors.originLabel || 'Origin / Tradition'}
                </span>
                <p class="text-sm sm:text-base font-medium text-stone-100 leading-snug">
                  {currentTeacher.origin}
                </p>
              </div>
            </div>

            <!-- Detail Box 2: WHAT THEY TEACH (Curriculum / Specialty) -->
            <div class="bg-amber-900/30 hover:bg-amber-900/40 transition-colors border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-xl shrink-0">
                🎵
              </div>
              <div class="space-y-1">
                <span class="block text-xs font-bold uppercase tracking-wider text-amber-300">
                  {t.instructors.teachingLabel || 'What They Teach'}
                </span>
                <p class="text-sm sm:text-base font-semibold text-amber-200 leading-snug">
                  {currentTeacher.teaching}
                </p>
              </div>
            </div>

            <!-- Teacher Bio -->
            <p class="text-sm sm:text-base text-stone-300 leading-relaxed italic border-l-2 border-amber-500/40 pl-4 py-1">
              "{currentTeacher.bio}"
            </p>

            <!-- Actions Row -->
            <div class="pt-2 flex flex-wrap items-center gap-4">
              <!-- Book Class with This Teacher -->
              <button 
                onclick={() => onOpenBooking(`Class with ${currentTeacher.name}`)}
                class="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-sm shadow-xl hover:shadow-amber-500/20 transition-all cursor-pointer"
              >
                <span>📅</span>
                <span>{t.instructors.bookTeacherBtn || 'Book Class with Teacher'}</span>
                <span>→</span>
              </button>

              <!-- View Individual Profile Page -->
              <a 
                href={`/teachers/${getTeacherSlug(currentTeacher)}`}
                class="inline-flex items-center gap-1.5 px-5 py-3.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold text-xs border border-amber-400/40 transition-colors"
              >
                <span>👁️</span>
                <span>{t.instructors.viewProfileBtn || 'View Full Profile →'}</span>
              </a>

              <!-- Telegram direct inquiry -->
              <a 
                href="https://t.me/CEOJAPIBR2" 
                target="_blank" 
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-stone-200 font-semibold text-xs transition-colors border border-white/10"
              >
                <span>✈️</span>
                <span>{lang === 'am' ? 'በቴሌግራም አነጋግሩን' : 'Inquire on Telegram'}</span>
              </a>
            </div>

          </div>

        </div>

        <!-- Animated Progress Line indicating 4.5s slide countdown -->
        <div class="absolute bottom-0 inset-x-0 h-1 bg-white/10 overflow-hidden">
          {#key currentIndex}
            <div 
              class={`h-full bg-linear-to-r from-amber-500 to-amber-300 ${isPaused ? '' : 'animate-[carousel-progress_4.5s_linear_infinite]'}`}
              style="width: 100%; transform-origin: left;"
            ></div>
          {/key}
        </div>

      </div>

      <!-- Arrow Controls (Next / Prev) -->
      <button 
        onclick={prevSlide}
        aria-label={t.instructors.prevSlide || "Previous teacher"}
        class="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-stone-900/90 hover:bg-amber-600 text-amber-200 hover:text-white border border-amber-400/40 shadow-xl flex items-center justify-center text-xl transition-all cursor-pointer z-20 group-hover:scale-110 active:scale-95"
      >
        ❮
      </button>

      <button 
        onclick={nextSlide}
        aria-label={t.instructors.nextSlide || "Next teacher"}
        class="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-stone-900/90 hover:bg-amber-600 text-amber-200 hover:text-white border border-amber-400/40 shadow-xl flex items-center justify-center text-xl transition-all cursor-pointer z-20 group-hover:scale-110 active:scale-95"
      >
        ❯
      </button>

      <!-- Thumbnails / Navigation Indicators Below Box -->
      <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
        {#each teachers as teacher, idx}
          <button 
            onclick={() => goToSlide(idx)}
            aria-label={`Go to slide ${idx + 1}: ${teacher.name}`}
            class={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
              currentIndex === idx 
                ? 'bg-amber-900 text-amber-100 border-amber-500 shadow-md ring-2 ring-amber-400/30' 
                : 'bg-white text-stone-600 hover:bg-amber-50 border-stone-200 hover:border-amber-300'
            }`}
          >
            <!-- Mini Avatar -->
            <img 
              src={teacher.image} 
              alt={teacher.name}
              width="24"
              height="24"
              class="w-6 h-6 rounded-full object-cover border border-amber-300/60"
            />
            <span class="truncate max-w-[120px] sm:max-w-none">{teacher.name.split(' ')[0]} {teacher.name.split(' ')[1] || ''}</span>
            {#if currentIndex === idx}
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            {/if}
          </button>
        {/each}
      </div>

      <!-- Action Row: View All Directory Link -->
      <div class="mt-8 text-center">
        <a 
          href="/teachers" 
          class="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-amber-50 text-amber-900 font-bold text-xs border border-amber-300 shadow-sm transition-all"
        >
          <span>👥</span>
          <span>{t.instructors.viewAllBtn || 'View All Faculty Members'}</span>
          <span>→</span>
        </a>
      </div>

      <!-- Join Faculty Recruitment Callout Banner -->
      <div class="mt-14 max-w-4xl mx-auto bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div class="space-y-1.5">
          <span class="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
            <span>✨</span> {t.instructors.joinFacultyBadge || 'Faculty Opportunities'}
          </span>
          <h3 class="text-xl sm:text-2xl font-serif font-bold text-stone-100">
            {t.instructors.joinFacultyTitle}
          </h3>
          <p class="text-xs sm:text-sm text-stone-300 max-w-xl">
            {t.instructors.joinFacultySubtitle}
          </p>
        </div>
        <a 
          href="/teach" 
          class="shrink-0 px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-lg transition-transform hover:scale-105"
        >
          {t.instructors.joinFacultyBtn || 'Apply to Teach With Us →'}
        </a>
      </div>

    </div>

  </div>
</section>

<style>
  @keyframes carousel-progress {
    0% { transform: scaleX(0); }
    100% { transform: scaleX(1); }
  }
</style>
