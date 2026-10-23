<script>
  import { translations } from '#lib/translations.js';
  import Navbar from '#lib/components/Navbar.svelte';
  import Hero from '#lib/components/Hero.svelte';
  import About from '#lib/components/About.svelte';
  import StatsCounter from '#lib/components/StatsCounter.svelte';
  import Instruments from '#lib/components/Instruments.svelte';
  import GeezMezmur from '#lib/components/GeezMezmur.svelte';
  import OrderInstrument from '#lib/components/OrderInstrument.svelte';
  import Instructors from '#lib/components/Instructors.svelte';
  import ClassSchedule from '#lib/components/ClassSchedule.svelte';
  import WorkProcess from '#lib/components/WorkProcess.svelte';
  import Pricing from '#lib/components/Pricing.svelte';
  import StudentGallery from '#lib/components/StudentGallery.svelte';
  import Testimonials from '#lib/components/Testimonials.svelte';
  import Faq from '#lib/components/Faq.svelte';
  import Contact from '#lib/components/Contact.svelte';
  import Footer from '#lib/components/Footer.svelte';
  import BookingModal from '#lib/components/BookingModal.svelte';
  import Chatbot from '#lib/components/Chatbot.svelte';
  import ScrollToTop from '#lib/components/ScrollToTop.svelte';
  import StickyCtaBar from '#lib/components/StickyCtaBar.svelte';

  let currentLang = $state('en');
  let isBookingOpen = $state(false);
  let selectedPlanName = $state('');

  function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'am' : 'en';
  }

  function openBooking(planName = '') {
    selectedPlanName = planName;
    isBookingOpen = true;
  }

  function closeBooking() {
    isBookingOpen = false;
  }

  let t = $derived(translations[currentLang]);
</script>

<svelte:head>
  <title>
    {currentLang === 'am' 
      ? 'ቤተ አርሴማ | የኦንላይን መንፈሳዊና የባሕላዊ ዜማ መሣሪያዎች አካዳሚ' 
      : 'Bete Arsema | Online Sacred & Traditional Instrument Academy'}
  </title>
  <meta 
    name="description" 
    content="Learn Begena (King David's Harp), Krar, Washint, and Ethiopian Orthodox spiritual hymns online with certified masters. Flexible schedules for local & diaspora students."
  />
  <!-- High Priority Preloads for Instant FCP & LCP -->
  <link rel="preload" as="image" href="/assets/images/bete-arsema-logo.png" fetchpriority="high" />
  <link rel="preload" as="image" href="/assets/begena/begena-hero.jpg" fetchpriority="high" />
</svelte:head>

<div class="min-h-screen flex flex-col font-sans selection:bg-amber-200 selection:text-amber-950">
  <!-- Sticky "Book Now" CTA Bar (appears after 600px scroll) -->
  <StickyCtaBar {t} lang={currentLang} onOpenBooking={openBooking} />

  <!-- Sticky Header Navigation -->
  <Navbar 
    lang={currentLang} 
    onToggleLang={toggleLanguage} 
    onOpenBooking={openBooking}
    {t} 
  />

  <main class="flex-1">
    <!-- Hero Section -->
    <Hero 
      {t} 
      lang={currentLang}
      onOpenBooking={openBooking} 
    />

    <!-- About Section -->
    <About 
      {t} 
    />

    <!-- Stats Counter (Impact Numbers) -->
    <StatsCounter {t} />

    <!-- Instruments & Audio Section -->
    <Instruments 
      {t} 
      lang={currentLang}
      onOpenBooking={openBooking} 
    />

    <!-- Instructors & Faculty Showcase Carousel -->
    <Instructors 
      {t} 
      lang={currentLang}
      onOpenBooking={openBooking}
    />

    <!-- Live Class Schedule / Timetable -->
    <ClassSchedule {t} lang={currentLang} onOpenBooking={openBooking} />

    <!-- Ge'ez Language & Orthodox Mezmur Lectures Section -->
    <GeezMezmur 
      {t} 
      lang={currentLang}
      onOpenBooking={openBooking} 
    />

    <!-- Instrument Ordering & Worldwide Shipping Section -->
    <OrderInstrument 
      {t} 
      lang={currentLang}
    />

    <!-- Work Process Section -->
    <WorkProcess 
      {t} 
    />

    <!-- Pricing & Packages Section -->
    <Pricing 
      {t} 
      lang={currentLang}
      onOpenBooking={openBooking} 
    />

    <!-- Student Gallery / Success Stories -->
    <StudentGallery {t} />

    <!-- Testimonials Section (Authentic Stories) -->
    <Testimonials 
      {t} 
    />

    <!-- Frequently Asked Questions (FAQ) Section -->
    <Faq 
      {t} 
    />

    <!-- Contact & Direct Telegram/WhatsApp Section -->
    <Contact 
      {t} 
      lang={currentLang}
    />
  </main>

  <!-- Footer -->
  <Footer 
    {t} 
    lang={currentLang}
  />

  <!-- Interactive Booking & Registration Modal -->
  <BookingModal 
    isOpen={isBookingOpen} 
    selectedPlan={selectedPlanName} 
    onClose={closeBooking} 
    {t} 
    lang={currentLang}
  />

  <!-- Interactive Spiritual & Academy Assistant Chatbot -->
  <Chatbot 
    lang={currentLang} 
    onOpenBooking={openBooking} 
  />

  <!-- Scroll to Top Button -->
  <ScrollToTop />
</div>
