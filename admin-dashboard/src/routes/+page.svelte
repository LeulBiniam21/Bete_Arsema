<script>
  import { onMount } from 'svelte';
  import { 
    getTeachers, 
    saveTeacher, 
    deleteTeacher, 
    getApplications, 
    updateApplicationStatus, 
    deleteApplication,
    getAdmins,
    saveAdmin,
    deleteAdmin,
    authenticateAdmin,
    getStudents,
    saveStudent,
    deleteStudent,
    updateStudentStatus,
    getPlatformStats,
    savePlatformStats
  } from '#lib/teachersData.js';

  // Admin Authentication State
  let usernameInput = $state('');
  let passwordInput = $state('');
  let rememberMe = $state(true);
  let showPassword = $state(false);
  let currentAdmin = $state(null);
  let isAuthenticated = $state(false);
  let authError = $state('');
  let authLoading = $state(false);

  // First-Time Master Admin Setup State
  let isFirstTimeSetup = $state(false);
  let setupForm = $state({
    username: 'admin',
    fullName: 'Platform Master',
    password: '',
    confirmPassword: '',
    email: 'admin@betearsema.org',
    phone: '+251 711 890 131',
    rememberMe: true
  });
  let setupError = $state('');
  let setupLoading = $state(false);
  let showSetupPassword = $state(false);

  // Database Connection Status
  let dbStatus = $state({
    hasTursoUrl: false,
    checked: false
  });

  // Active Tab
  let activeTab = $state('overview'); // 'overview', 'teachers', 'students', 'admins', 'applications', 'bookings', 'orders', 'messages'

  // Data State
  let applications = $state([]);
  let teachers = $state([]);
  let students = $state([]);
  let admins = $state([]);
  let bookings = $state([]);
  let orders = $state([]);
  let contactMessages = $state([]);
  let dbRoles = $state([]);
  let platformStats = $state({
    studentsCount: 155,
    baseStudentsCount: 150,
    teachersCount: 4,
    countriesCount: 20,
    yearsCount: 8
  });
  let editStats = $state({
    baseStudentsCount: 150,
    countriesCount: 20,
    yearsCount: 8
  });
  let statsSyncMessage = $state('');

  // Filters
  let studentTeacherFilter = $state('all');
  let teacherCategoryFilter = $state('all');

  // Modals State
  let isAddTeacherOpen = $state(false);
  let isEditTeacherOpen = $state(false);
  let isAddStudentOpen = $state(false);
  let isAddAdminOpen = $state(false);

  // Teacher Form State
  let teacherForm = $state({
    id: '',
    name: '',
    nameAm: '',
    role: '',
    roleAm: '',
    origin: '',
    originAm: '',
    originIcon: '⛪',
    category: 'begena',
    categoryLabel: '10-String Begena',
    categoryLabelAm: 'የ10 አውታር በገና',
    teaching: '',
    teachingAm: '',
    exp: '5+ Years',
    expAm: 'ከ5 ዓመት በላይ',
    studentsCount: 25,
    rating: 4.9,
    bio: '',
    bioAm: '',
    image: '/assets/teachers/teacher-1.jpg',
    curriculum: [
      {
        titleEn: "Foundations & Sacred Posture",
        titleAm: "መሠረታዊ አያያዝና ሥርዓተ ድርደራ",
        descEn: "Step-by-step introduction to tuning, finger posture, and spiritual context.",
        descAm: "የቅኝት አያያዝ፣ የጣት አቀማመጥ እና መንፈሳዊ ሥርዓተ ትምህርት።"
      }
    ],
    scheduleEn: "Flexible online schedule",
    scheduleAm: "ተለዋዋጭ የኦንላይን ሰዓታት",
    active: true
  });

  // Student Form State
  let studentForm = $state({
    id: '',
    name: '',
    teacherId: '',
    teacherName: '',
    course: '',
    instrument: 'Begena',
    phone: '',
    location: '',
    plan: 'Starter Plan',
    status: 'Active'
  });

  // Admin Form State
  let adminForm = $state({
    id: '',
    name: '',
    username: '',
    password: '',
    role: 'Teacher Admin', // 'Super Admin', 'Teacher Admin', 'Coordinator'
    email: '',
    phone: '',
    assignedTeacherId: ''
  });

  onMount(async () => {
    // 1. Check database auth status
    try {
      const res = await fetch('/api/auth/status');
      if (res.ok) {
        const data = await res.json();
        dbStatus.hasTursoUrl = data.hasTursoUrl;
        dbStatus.checked = true;
        if (!data.initialized) {
          isFirstTimeSetup = true;
        }
      }
    } catch (e) {
      console.warn('API status check error:', e);
    }

    // 2. Check saved session
    const savedSession = localStorage.getItem('bete_admin_saved_session') || sessionStorage.getItem('bete_admin_saved_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed && (parsed.username || parsed.id)) {
          currentAdmin = parsed;
          isAuthenticated = true;
          await loadAllData();
          return;
        }
      } catch (e) {}
    }

    // Prefill remembered username
    const rememberedUser = localStorage.getItem('bete_admin_remembered_username');
    if (rememberedUser) {
      usernameInput = rememberedUser;
    }
  });

  async function handleLogin(e) {
    if (e) e.preventDefault();
    if (!usernameInput || !passwordInput) {
      authError = 'Please enter both username and password.';
      return;
    }

    authLoading = true;
    authError = '';

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput.trim(),
          password: passwordInput
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        currentAdmin = data.admin;
        isAuthenticated = true;
        authError = '';

        if (rememberMe) {
          localStorage.setItem('bete_admin_saved_session', JSON.stringify(data.admin));
          localStorage.setItem('bete_admin_remembered_username', data.admin.username);
        } else {
          localStorage.removeItem('bete_admin_saved_session');
          sessionStorage.setItem('bete_admin_saved_session', JSON.stringify(data.admin));
        }

        await loadAllData();
      } else {
        authError = data.error || 'Invalid username or password.';
      }
    } catch (err) {
      authError = 'Failed to connect to authentication server: ' + err.message;
    } finally {
      authLoading = false;
    }
  }

  async function handleFirstTimeSetup(e) {
    if (e) e.preventDefault();
    setupError = '';

    if (!setupForm.username || !setupForm.password) {
      setupError = 'Please provide a username and password.';
      return;
    }

    if (setupForm.password.length < 6) {
      setupError = 'Password must be at least 6 characters.';
      return;
    }

    if (setupForm.password !== setupForm.confirmPassword) {
      setupError = 'Passwords do not match. Please re-enter carefully.';
      return;
    }

    setupLoading = true;

    try {
      const res = await fetch('/api/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: setupForm.username.trim(),
          password: setupForm.password,
          name: setupForm.fullName.trim(),
          email: setupForm.email.trim(),
          phone: setupForm.phone.trim(),
          role: 'Super Admin'
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        currentAdmin = data.admin;
        isAuthenticated = true;
        isFirstTimeSetup = false;

        if (setupForm.rememberMe) {
          localStorage.setItem('bete_admin_saved_session', JSON.stringify(data.admin));
          localStorage.setItem('bete_admin_remembered_username', data.admin.username);
        } else {
          sessionStorage.setItem('bete_admin_saved_session', JSON.stringify(data.admin));
        }

        await loadAllData();
      } else {
        setupError = data.error || 'Failed to complete initial setup.';
      }
    } catch (err) {
      setupError = 'Error during setup: ' + err.message;
    } finally {
      setupLoading = false;
    }
  }

  function handleLogout() {
    isAuthenticated = false;
    currentAdmin = null;
    passwordInput = '';
    localStorage.removeItem('bete_admin_saved_session');
    sessionStorage.removeItem('bete_admin_saved_session');
  }

  async function loadAllData() {
    // Local fallback/cache
    applications = getApplications();
    teachers = getTeachers();
    students = getStudents();
    admins = getAdmins();
    platformStats = getPlatformStats();
    editStats = {
      baseStudentsCount: platformStats.baseStudentsCount,
      countriesCount: platformStats.countriesCount,
      yearsCount: platformStats.yearsCount
    };

    // Fresh fetch from Turso API
    try {
      const [tRes, sRes, stRes, aRes, apRes, bkRes, ordRes, msgRes, rolRes] = await Promise.allSettled([
        fetch('/api/teachers').then(r => r.json()),
        fetch('/api/students').then(r => r.json()),
        fetch('/api/stats').then(r => r.json()),
        fetch('/api/admins').then(r => r.json()),
        fetch('/api/applications').then(r => r.json()),
        fetch('/api/bookings').then(r => r.json()),
        fetch('/api/orders').then(r => r.json()),
        fetch('/api/contact').then(r => r.json()),
        fetch('/api/roles').then(r => r.json())
      ]);

      if (tRes.status === 'fulfilled' && Array.isArray(tRes.value) && tRes.value.length > 0) {
        teachers = tRes.value;
      }
      if (sRes.status === 'fulfilled' && Array.isArray(sRes.value) && sRes.value.length > 0) {
        students = sRes.value;
      }
      if (stRes.status === 'fulfilled' && stRes.value && !stRes.value.error) {
        platformStats = stRes.value;
        editStats = {
          baseStudentsCount: platformStats.baseStudentsCount,
          countriesCount: platformStats.countriesCount,
          yearsCount: platformStats.yearsCount
        };
      }
      if (aRes.status === 'fulfilled' && Array.isArray(aRes.value) && aRes.value.length > 0) {
        admins = aRes.value;
      }
      if (apRes.status === 'fulfilled' && Array.isArray(apRes.value) && apRes.value.length > 0) {
        applications = apRes.value;
      }
      if (bkRes.status === 'fulfilled' && Array.isArray(bkRes.value)) {
        bookings = bkRes.value;
      }
      if (ordRes.status === 'fulfilled' && Array.isArray(ordRes.value)) {
        orders = ordRes.value;
      }
      if (msgRes.status === 'fulfilled' && Array.isArray(msgRes.value)) {
        contactMessages = msgRes.value;
      }
      if (rolRes.status === 'fulfilled' && Array.isArray(rolRes.value)) {
        dbRoles = rolRes.value;
      }
    } catch (e) {
      console.warn('API sync notice:', e);
    }

    // Default studentForm teacherId
    if (teachers.length > 0 && !studentForm.teacherId) {
      studentForm.teacherId = teachers[0].id;
      studentForm.teacherName = teachers[0].name;
    }
  }

  function handleSavePlatformStats(e) {
    e.preventDefault();
    savePlatformStats(editStats);
    loadAllData();
    statsSyncMessage = `✅ Live Sync Activated! The public homepage now displays ${platformStats.studentsCount}+ students and ${platformStats.teachersCount} active teachers.`;
    setTimeout(() => statsSyncMessage = '', 6000);
  }

  // --- TEACHER ACTIONS ---

  function openAddTeacher() {
    teacherForm = {
      id: '',
      name: '',
      nameAm: '',
      role: 'Master Instructor',
      roleAm: 'የዜማ መምህር',
      origin: 'Addis Ababa Diocese',
      originAm: 'ከአዲስ አበባ ሀገረ ስብከት',
      originIcon: '⛪',
      category: 'begena',
      categoryLabel: '10-String Begena',
      categoryLabelAm: 'የ10 አውታር በገና',
      teaching: '10-String Begena Sacred Zema & Tizita Tuning',
      teachingAm: 'የ10 አውታር በገና ድርደራና የትዝታ ቅኝት',
      exp: '5+ Years',
      expAm: 'ከ5 ዓመት በላይ',
      studentsCount: 20,
      rating: 4.95,
      bio: '',
      bioAm: '',
      image: '/assets/teachers/teacher-1.jpg',
      curriculum: [
        {
          titleEn: "Foundations & Sacred Posture",
          titleAm: "መሠረታዊ አያያዝና ሥርዓተ ድርደራ",
          descEn: "Tuning, finger placement, and sacred prayer resonance.",
          descAm: "ቅኝት፣ የጣት አቀማመጥ እና የጸሎት ዜማዎች።"
        }
      ],
      scheduleEn: "Flexible online hours",
      scheduleAm: "ተለዋዋጭ የኦንላይን ሰዓት",
      active: true
    };
    isAddTeacherOpen = true;
  }

  function openEditTeacher(teacher) {
    teacherForm = JSON.parse(JSON.stringify(teacher));
    isEditTeacherOpen = true;
  }

  function handleSaveTeacher(e) {
    e.preventDefault();
    if (!teacherForm.name) return;

    let slug = teacherForm.id;
    if (!slug) {
      slug = teacherForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || ('teacher-' + Date.now());
    }

    const toSave = {
      ...teacherForm,
      id: slug
    };

    saveTeacher(toSave);
    isAddTeacherOpen = false;
    isEditTeacherOpen = false;
    loadAllData();
  }

  function toggleTeacherActive(teacher) {
    teacher.active = !teacher.active;
    saveTeacher(teacher);
    loadAllData();
  }

  function handleRemoveTeacher(id) {
    if (confirm('Are you sure you want to remove this teacher from the academy roster?')) {
      deleteTeacher(id);
      loadAllData();
    }
  }

  // --- STUDENT ACTIONS ---

  function openAddStudent() {
    studentForm = {
      id: '',
      name: '',
      teacherId: teachers[0]?.id || '',
      teacherName: teachers[0]?.name || '',
      course: 'Beginner Sacred Instrument & Zema',
      instrument: 'Begena',
      phone: '',
      location: '',
      plan: 'Starter Plan',
      status: 'Active'
    };
    isAddStudentOpen = true;
  }

  function handleSaveStudent(e) {
    e.preventDefault();
    if (!studentForm.name || !studentForm.phone) return;

    const matchedTeacher = teachers.find(t => t.id === studentForm.teacherId);
    const toSave = {
      ...studentForm,
      teacherName: matchedTeacher ? matchedTeacher.name : 'Academy Instructor'
    };

    saveStudent(toSave);

    // Update teacher's student count if matched
    if (matchedTeacher) {
      matchedTeacher.studentsCount = (matchedTeacher.studentsCount || 0) + 1;
      saveTeacher(matchedTeacher);
    }

    isAddStudentOpen = false;
    loadAllData();
  }

  function handleRemoveStudent(id) {
    if (confirm('Are you sure you want to delete this student record?')) {
      deleteStudent(id);
      loadAllData();
    }
  }

  function handleSetStudentStatus(id, newStatus) {
    updateStudentStatus(id, newStatus);
    loadAllData();
  }

  // --- ADMIN & TEACHER ADMIN ACTIONS ---

  function openAddAdmin() {
    adminForm = {
      id: '',
      name: '',
      username: '',
      password: '',
      role: 'Teacher Admin',
      email: '',
      phone: '',
      assignedTeacherId: teachers[0]?.id || ''
    };
    isAddAdminOpen = true;
  }

  async function handleSaveAdmin(e) {
    e.preventDefault();
    if (!adminForm.username || !adminForm.password || !adminForm.name) {
      alert('Please fill in Name, Username, and Password.');
      return;
    }

    try {
      const res = await fetch('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: adminForm.username.trim(),
          password: adminForm.password,
          name: adminForm.name.trim(),
          role: adminForm.role,
          email: adminForm.email.trim(),
          phone: adminForm.phone.trim(),
          teacherId: adminForm.assignedTeacherId
        })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to create administrator account.');
        return;
      }

      // Also update local store
      saveAdmin({
        id: data.admin.id,
        name: data.admin.name,
        role: data.admin.role,
        username: data.admin.username,
        email: data.admin.email,
        phone: data.admin.phone,
        assignedTeacherId: data.admin.teacherId,
        createdAt: data.admin.createdAt
      });

      isAddAdminOpen = false;
      await loadAllData();
      alert('Administrator created successfully with cryptographic password hashing (SHA-256 + Salt)!');
    } catch (err) {
      alert('Error creating administrator: ' + err.message);
    }
  }

  async function handleRemoveAdmin(id) {
    if (confirm('Are you sure you want to remove this administrator account?')) {
      try {
        await fetch(`/api/admins?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      } catch (e) {}
      deleteAdmin(id);
      await loadAllData();
    }
  }

  // --- APPLICATION ACTIONS ---

  function setAppStatus(id, status) {
    updateApplicationStatus(id, status);
    loadAllData();
  }

  function removeApp(id) {
    if (confirm('Are you sure you want to delete this application record?')) {
      deleteApplication(id);
      loadAllData();
    }
  }

  // --- BOOKING ACTIONS ---
  async function setBookingStatus(id, status) {
    try {
      await fetch('/api/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      await loadAllData();
    } catch (e) {
      console.error(e);
    }
  }

  async function removeBooking(id) {
    if (confirm('Are you sure you want to delete this booking entry?')) {
      try {
        await fetch('/api/bookings', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        await loadAllData();
      } catch (e) {
        console.error(e);
      }
    }
  }

  // --- ORDER ACTIONS ---
  async function setOrderStatus(id, status) {
    try {
      await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      await loadAllData();
    } catch (e) {
      console.error(e);
    }
  }

  async function removeOrder(id) {
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        await fetch('/api/orders', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        await loadAllData();
      } catch (e) {
        console.error(e);
      }
    }
  }

  // --- MESSAGE ACTIONS ---
  async function setMessageStatus(id, status) {
    try {
      await fetch('/api/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      await loadAllData();
    } catch (e) {
      console.error(e);
    }
  }

  async function removeMessage(id) {
    if (confirm('Are you sure you want to delete this inquiry?')) {
      try {
        await fetch('/api/contact', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        await loadAllData();
      } catch (e) {
        console.error(e);
      }
    }
  }

  function approveAndConvertToTeacher(app) {
    const slug = app.fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || ('teacher-' + Date.now());
    const newT = {
      id: slug,
      name: app.fullName,
      nameAm: app.fullName,
      role: 'Instructor of ' + app.specialty,
      roleAm: 'መምህር',
      origin: app.diocese || 'Orthodox Parish',
      originAm: app.diocese || 'ኦርቶዶክስ ሀገረ ስብከት',
      originIcon: '⛪',
      category: 'begena',
      categoryLabel: app.specialty,
      categoryLabelAm: app.specialty,
      teaching: app.specialty,
      teachingAm: app.specialty,
      exp: app.experience || '3+ Years',
      expAm: app.experience || '3+ ዓመት',
      studentsCount: 0,
      rating: 5.0,
      bio: app.bio || 'Dedicated sacred instructor newly joined to Bete Arsema Online Academy.',
      bioAm: app.bio || 'በቤተ አርሴማ ኦንላይን አካዳሚ የተቀላቀሉ አዲስ መምህር።',
      image: '/assets/teachers/teacher-1.jpg',
      curriculum: [
        {
          titleEn: "Foundation & Instrument Technique",
          titleAm: "መሠረታዊ አያያዝና ድርደራ",
          descEn: "Comprehensive introduction to liturgical practice and hymnody.",
          descAm: "የዜማ መሠረቶችና የጸሎት መዝሙራት።"
        }
      ],
      scheduleEn: "Flexible online hours",
      scheduleAm: "ተለዋዋጭ የኦንላይን ሰዓት",
      active: true
    };

    saveTeacher(newT);
    updateApplicationStatus(app.id, 'Approved');
    loadAllData();
    alert(`Success! "${app.fullName}" has been approved and added to the Faculty Roster!`);
  }

  function exportBackup() {
    const backup = {
      exportedAt: new Date().toISOString(),
      teachers,
      students,
      admins,
      applications
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `bete_arsema_complete_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
  }

  // Filtered lists
  let filteredStudents = $derived(
    studentTeacherFilter === 'all'
      ? students
      : students.filter(s => s.teacherId === studentTeacherFilter)
  );

  let filteredTeachers = $derived(
    teacherCategoryFilter === 'all'
      ? teachers
      : teachers.filter(t => t.category === teacherCategoryFilter)
  );
</script>

<svelte:head>
  <title>Admin Portal | Bete Arsema Online Academy</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="min-h-screen bg-stone-100 font-sans text-stone-900 selection:bg-amber-200 flex flex-col">

  <!-- Top Navigation Header -->
  <header class="bg-stone-950 text-white border-b border-stone-800 shadow-xl sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      
      <div class="flex items-center gap-3.5">
        <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-700 to-amber-500 flex items-center justify-center font-bold text-2xl shadow-lg ring-2 ring-amber-400/30">
          ⛪
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="block text-lg font-serif font-bold text-amber-200 leading-tight">
              Bete Arsema Management
            </span>
            <span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-widest">
              Admin Side
            </span>
          </div>
          {#if currentAdmin}
            <span class="block text-xs text-stone-400">
              Active: <strong class="text-amber-300">{currentAdmin.name}</strong> ({currentAdmin.role})
            </span>
          {:else}
            <span class="block text-[10px] text-stone-400 uppercase tracking-widest font-mono">
              Secure Central Administration
            </span>
          {/if}
        </div>
      </div>

      <div class="flex items-center gap-3">
        <a 
          href="http://localhost:5173/" 
          target="_blank"
          class="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-stone-200 transition-colors"
        >
          <span>👁️</span>
          <span>View Public Website ↗</span>
        </a>

        {#if isAuthenticated}
          <button 
            onclick={handleLogout}
            class="px-4 py-2 rounded-full text-xs font-bold bg-rose-600/80 hover:bg-rose-600 text-white transition-colors cursor-pointer shadow-sm"
          >
            🔒 Lock / Sign Out
          </button>
        {/if}
      </div>

    </div>
  </header>

  <main class="flex-1 py-8 sm:py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {#if !isAuthenticated}
        {#if isFirstTimeSetup}
          <!-- FIRST-TIME MASTER ADMIN SETUP SCREEN -->
          <div class="max-w-md mx-auto mt-8 bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-stone-200 text-left space-y-6">
            <div class="w-16 h-16 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center text-3xl mx-auto shadow-sm">
              🛡️
            </div>

            <div class="text-center space-y-1.5">
              <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 inline-block">
                Initial System Setup
              </span>
              <h2 class="text-2xl font-serif font-bold text-stone-900">
                Setup Master Administrator
              </h2>
              <p class="text-xs text-stone-500 leading-relaxed">
                Welcome! Create your master admin credentials. Your password will be cryptographically salted and hashed (SHA-256) into your database.
              </p>
            </div>

            <form onsubmit={handleFirstTimeSetup} class="space-y-4 text-xs">
              <div>
                <label for="su-name" class="block font-bold text-stone-700 mb-1">Full Name *</label>
                <input 
                  id="su-name"
                  type="text" 
                  required 
                  bind:value={setupForm.fullName}
                  placeholder="e.g. Platform Director / Leul Biniam"
                  class="w-full p-3 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-hidden bg-stone-50 font-medium text-sm"
                />
              </div>

              <div>
                <label for="su-user" class="block font-bold text-stone-700 mb-1">Admin Username *</label>
                <input 
                  id="su-user"
                  type="text" 
                  required 
                  bind:value={setupForm.username}
                  placeholder="e.g. admin or leulbiniam"
                  class="w-full p-3 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-hidden bg-stone-50 font-mono text-sm"
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label for="su-email" class="block font-bold text-stone-700 mb-1">Email</label>
                  <input 
                    id="su-email"
                    type="email" 
                    bind:value={setupForm.email}
                    placeholder="admin@betearsema.org"
                    class="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50"
                  />
                </div>
                <div>
                  <label for="su-phone" class="block font-bold text-stone-700 mb-1">Phone</label>
                  <input 
                    id="su-phone"
                    type="tel" 
                    bind:value={setupForm.phone}
                    placeholder="+251 711 890 131"
                    class="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50"
                  />
                </div>
              </div>

              <div>
                <div class="flex items-center justify-between mb-1">
                  <label for="su-pass" class="font-bold text-stone-700">Master Password (min 6 chars) *</label>
                  <button 
                    type="button" 
                    onclick={() => showSetupPassword = !showSetupPassword} 
                    class="text-[10px] text-amber-800 font-bold hover:underline"
                  >
                    {showSetupPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input 
                  id="su-pass"
                  type={showSetupPassword ? 'text' : 'password'}
                  required 
                  minlength="6"
                  bind:value={setupForm.password}
                  placeholder="Enter strong password"
                  class="w-full p-3 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-hidden bg-stone-50 font-mono text-sm"
                />
              </div>

              <div>
                <label for="su-cpass" class="block font-bold text-stone-700 mb-1">Confirm Master Password *</label>
                <input 
                  id="su-cpass"
                  type={showSetupPassword ? 'text' : 'password'}
                  required 
                  minlength="6"
                  bind:value={setupForm.confirmPassword}
                  placeholder="Re-enter password"
                  class="w-full p-3 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-hidden bg-stone-50 font-mono text-sm"
                />
              </div>

              <div class="flex items-center gap-2 pt-1">
                <input 
                  id="su-remember" 
                  type="checkbox" 
                  bind:checked={setupForm.rememberMe}
                  class="w-4 h-4 rounded-sm text-amber-700 focus:ring-amber-500 border-stone-300"
                />
                <label for="su-remember" class="text-xs font-semibold text-stone-700 cursor-pointer">
                  Save credentials & stay signed in on this device
                </label>
              </div>

              {#if setupError}
                <p class="text-xs font-bold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
                  {setupError}
                </p>
              {/if}

              <button 
                type="submit"
                disabled={setupLoading}
                class="w-full py-4 rounded-xl bg-linear-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-stone-900 text-white font-bold text-sm shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {setupLoading ? 'Encrypting & Saving...' : 'Save Master Admin & Open Dashboard →'}
              </button>
            </form>

            <div class="text-center pt-2">
              <button 
                type="button" 
                onclick={() => isFirstTimeSetup = false}
                class="text-xs font-bold text-stone-500 hover:text-amber-800 underline"
              >
                Already have credentials? Sign in instead
              </button>
            </div>
          </div>

        {:else}
          <!-- USERNAME & HASHED PASSWORD LOGIN GATE -->
          <div class="max-w-md mx-auto mt-12 bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-stone-200 text-center space-y-6">
            <div class="w-16 h-16 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center text-3xl mx-auto shadow-sm">
              🛡️
            </div>

            <div class="space-y-1.5">
              <h2 class="text-2xl font-serif font-bold text-stone-900">
                Academy Administrator Login
              </h2>
              <p class="text-xs text-stone-500 leading-relaxed">
                Enter your authorized username and password. Passwords are securely verified against cryptographic hashes.
              </p>
            </div>

            <form onsubmit={handleLogin} class="space-y-4 text-left">
              <div>
                <label for="login-user" class="block text-xs font-bold text-stone-700 mb-1">Username</label>
                <input 
                  id="login-user"
                  type="text" 
                  required
                  bind:value={usernameInput}
                  placeholder="e.g. admin or leulbiniam21"
                  class="w-full px-4 py-3 rounded-xl border-2 border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-hidden bg-stone-50 text-sm font-medium"
                />
              </div>

              <div>
                <div class="flex items-center justify-between mb-1">
                  <label for="login-pass" class="text-xs font-bold text-stone-700">Password</label>
                  <button 
                    type="button" 
                    onclick={() => showPassword = !showPassword}
                    class="text-[10px] text-amber-800 font-bold hover:underline"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input 
                  id="login-pass"
                  type={showPassword ? 'text' : 'password'}
                  required
                  bind:value={passwordInput}
                  placeholder="Enter your admin password"
                  class="w-full px-4 py-3 rounded-xl border-2 border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-hidden bg-stone-50 text-sm font-mono"
                />
              </div>

              <div class="flex items-center justify-between pt-1">
                <label class="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700">
                  <input 
                    type="checkbox" 
                    bind:checked={rememberMe}
                    class="w-4 h-4 rounded-sm text-amber-700 focus:ring-amber-500 border-stone-300"
                  />
                  <span>Save password on this computer</span>
                </label>
              </div>

              {#if authError}
                <p class="text-xs font-bold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
                  {authError}
                </p>
              {/if}

              <button 
                type="submit"
                disabled={authLoading}
                class="w-full py-4 rounded-xl bg-linear-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-stone-900 text-white font-bold text-sm shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {authLoading ? 'Verifying Credentials...' : 'Sign In to Dashboard →'}
              </button>
            </form>

            <div class="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <button 
                type="button" 
                onclick={() => isFirstTimeSetup = true}
                class="font-bold text-amber-800 hover:underline"
              >
                ⚙️ Setup New Admin Account
              </button>
              <span class="text-[10px] text-stone-400">Turso Database Active</span>
            </div>
          </div>
        {/if}

      {:else}
        <!-- UNLOCKED DASHBOARD -->
        <div class="space-y-8">
          
          <!-- Top KPI Metrics Counters -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            <!-- Teachers Count -->
            <div class="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-sm flex items-center justify-between">
              <div class="space-y-1">
                <div class="flex items-center gap-1.5">
                  <span class="block text-xs uppercase font-bold text-stone-400 tracking-wider">Total Teachers</span>
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live synced to Homepage Carousel"></span>
                </div>
                <div class="flex items-baseline gap-2">
                  <span class="text-3xl sm:text-4xl font-serif font-bold text-stone-900">{teachers.length}</span>
                  <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {teachers.filter(t => t.active !== false).length} Live on Main Page
                  </span>
                </div>
                <span class="block text-[11px] text-emerald-700 font-medium">Synced with Main Page Carousel</span>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl shrink-0">
                👨‍🏫
              </div>
            </div>

            <!-- Students Count -->
            <div class="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-sm flex items-center justify-between">
              <div class="space-y-1">
                <div class="flex items-center gap-1.5">
                  <span class="block text-xs uppercase font-bold text-stone-400 tracking-wider">Total Students</span>
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live synced to Homepage Hero and Stats"></span>
                </div>
                <div class="flex items-baseline gap-2">
                  <span class="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
                    {platformStats.studentsCount}+
                  </span>
                  <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {students.length} Enrolled in System
                  </span>
                </div>
                <span class="block text-[11px] text-emerald-700 font-medium">Synced with Hero & Stats Counter</span>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl shrink-0">
                🎓
              </div>
            </div>

            <!-- Admins Count -->
            <div class="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-sm flex items-center justify-between">
              <div class="space-y-1">
                <span class="block text-xs uppercase font-bold text-stone-400 tracking-wider">Admins / Staff</span>
                <div class="flex items-baseline gap-2">
                  <span class="text-3xl sm:text-4xl font-serif font-bold text-stone-900">{admins.length}</span>
                  <span class="text-xs font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                    {admins.filter(a => a.role === 'Teacher Admin').length} Teacher Admins
                  </span>
                </div>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center text-2xl shrink-0">
                🛡️
              </div>
            </div>

            <!-- Applications Count -->
            <div class="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-sm flex items-center justify-between">
              <div class="space-y-1">
                <span class="block text-xs uppercase font-bold text-stone-400 tracking-wider">Teacher Applicants</span>
                <div class="flex items-baseline gap-2">
                  <span class="text-3xl sm:text-4xl font-serif font-bold text-stone-900">{applications.length}</span>
                  <span class="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                    {applications.filter(a => a.status === 'Pending').length} Pending
                  </span>
                </div>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center text-2xl shrink-0">
                📝
              </div>
            </div>

          </div>

          <!-- Tab Bar & Action Controls -->
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            
            <!-- Tabs -->
            <div class="flex flex-wrap items-center gap-2">
              <button 
                onclick={() => activeTab = 'overview'}
                class="px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer {activeTab === 'overview' ? 'bg-amber-800 text-white shadow-md' : 'bg-white text-stone-700 hover:bg-stone-200'}"
              >
                📊 Overview
              </button>

              <button 
                onclick={() => activeTab = 'teachers'}
                class="px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer {activeTab === 'teachers' ? 'bg-amber-800 text-white shadow-md' : 'bg-white text-stone-700 hover:bg-stone-200'}"
              >
                👨‍🏫 Teachers ({teachers.length})
              </button>

              <button 
                onclick={() => activeTab = 'students'}
                class="px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer {activeTab === 'students' ? 'bg-amber-800 text-white shadow-md' : 'bg-white text-stone-700 hover:bg-stone-200'}"
              >
                🎓 Students ({students.length})
              </button>

              <button 
                onclick={() => activeTab = 'admins'}
                class="px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer {activeTab === 'admins' ? 'bg-amber-800 text-white shadow-md' : 'bg-white text-stone-700 hover:bg-stone-200'}"
              >
                🛡️ Admins & Teacher Admins ({admins.length})
              </button>

              <button 
                onclick={() => activeTab = 'applications'}
                class="px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer {activeTab === 'applications' ? 'bg-amber-800 text-white shadow-md' : 'bg-white text-stone-700 hover:bg-stone-200'}"
              >
                📝 Applications ({applications.length})
              </button>

              <button 
                onclick={() => activeTab = 'bookings'}
                class="px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer {activeTab === 'bookings' ? 'bg-amber-800 text-white shadow-md' : 'bg-white text-stone-700 hover:bg-stone-200'}"
              >
                📅 Bookings ({bookings.length})
              </button>

              <button 
                onclick={() => activeTab = 'orders'}
                class="px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer {activeTab === 'orders' ? 'bg-amber-800 text-white shadow-md' : 'bg-white text-stone-700 hover:bg-stone-200'}"
              >
                📦 Orders ({orders.length})
              </button>

              <button 
                onclick={() => activeTab = 'messages'}
                class="px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer {activeTab === 'messages' ? 'bg-amber-800 text-white shadow-md' : 'bg-white text-stone-700 hover:bg-stone-200'}"
              >
                💬 Inquiries ({contactMessages.length})
              </button>
            </div>

            <!-- Right Action Buttons -->
            <div class="flex flex-wrap items-center gap-2">
              {#if activeTab === 'teachers'}
                <button 
                  onclick={openAddTeacher}
                  class="px-5 py-2.5 rounded-full text-xs font-bold bg-amber-700 hover:bg-amber-800 text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>+</span>
                  <span>Add New Teacher</span>
                </button>
              {/if}

              {#if activeTab === 'students'}
                <button 
                  onclick={openAddStudent}
                  class="px-5 py-2.5 rounded-full text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>+</span>
                  <span>Enroll New Student</span>
                </button>
              {/if}

              {#if activeTab === 'admins'}
                <button 
                  onclick={openAddAdmin}
                  class="px-5 py-2.5 rounded-full text-xs font-bold bg-sky-700 hover:bg-sky-800 text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>+</span>
                  <span>Add New Admin / Teacher Admin</span>
                </button>
              {/if}

              <button 
                onclick={exportBackup}
                class="px-4 py-2.5 rounded-full text-xs font-semibold bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 transition-colors cursor-pointer"
                title="Download JSON data snapshot"
              >
                💾 Backup Data
              </button>
            </div>

          </div>

          <!-- ========================================== -->
          <!-- TAB 1: OVERVIEW & QUICK ACTIONS -->
          <!-- ========================================== -->
          {#if activeTab === 'overview'}
            <div class="space-y-8">
              
              <!-- Quick Welcome Banner -->
              <div class="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 rounded-3xl p-6 sm:p-8 text-white border border-amber-500/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div class="space-y-2 text-center sm:text-left">
                  <span class="text-amber-400 text-xs font-bold uppercase tracking-widest">
                    ✨ Welcome, {currentAdmin.name} ({currentAdmin.role})
                  </span>
                  <h3 class="text-2xl sm:text-3xl font-serif font-bold">
                    Bete Arsema Management Center
                  </h3>
                  <p class="text-xs sm:text-sm text-stone-300 max-w-xl">
                    You have full authority to add and edit teachers, assign students to faculty mentors, review recruitment submissions, and invite new teacher admins.
                  </p>
                </div>
                <div class="flex flex-wrap items-center gap-3">
                  <button 
                    onclick={openAddTeacher}
                    class="px-5 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md"
                  >
                    + Add Teacher
                  </button>
                  <button 
                    onclick={openAddStudent}
                    class="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20"
                  >
                    + Enroll Student
                  </button>
                </div>
              </div>

              <!-- Turso Database & Security Status Panel -->
              <div class="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div class="flex items-start gap-3.5">
                    <div class="w-12 h-12 rounded-2xl {dbStatus.hasTursoUrl ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'} flex items-center justify-center text-2xl shrink-0">
                      💾
                    </div>
                    <div class="space-y-1">
                      <div class="flex items-center gap-2">
                        <span class="text-xs uppercase font-bold tracking-wider text-stone-400">Database Engine</span>
                        {#if dbStatus.hasTursoUrl}
                          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            🟢 Turso Cloud Connected
                          </span>
                        {:else}
                          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                            🔵 Embedded SQLite Active (Turso-Ready)
                          </span>
                        {/if}
                      </div>
                      <h4 class="text-base font-serif font-bold text-stone-900">
                        Turso LibSQL Database Management
                      </h4>
                      <p class="text-xs text-stone-500 max-w-xl">
                        All admin passwords are cryptographically salted and hashed using SHA-256 before being written to the database. All teachers, students, and application records are persisted securely.
                      </p>
                    </div>
                  </div>

                  <a 
                    href="https://app.turso.tech/leulbiniam21" 
                    target="_blank" 
                    rel="noreferrer"
                    class="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs inline-flex items-center gap-2 whitespace-nowrap shadow-sm"
                  >
                    <span>⚡ Turso Dashboard</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>

              <!-- Main Page & Admin Synchronization Panel -->
              <div class="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-md space-y-5">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                  <div class="space-y-1">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                      <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Live Main Page Synchronization</span>
                    </div>
                    <h4 class="text-xl font-serif font-bold text-stone-900">
                      Public Homepage Statistics & Carousel Sync
                    </h4>
                    <p class="text-xs text-stone-500 max-w-xl">
                      The numbers below are broadcast live to all visitors on the homepage Hero and Impact Stats counters. Any change here updates the public site immediately.
                    </p>
                  </div>

                  <div class="flex items-center gap-3">
                    <a 
                      href="http://localhost:5173/" 
                      target="_blank" 
                      class="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold inline-flex items-center gap-1.5"
                    >
                      <span>👁️</span> Check Live Homepage ↗
                    </a>
                  </div>
                </div>

                {#if statsSyncMessage}
                  <div class="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold animate-fade-in">
                    {statsSyncMessage}
                  </div>
                {/if}

                <form onsubmit={handleSavePlatformStats} class="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                  <div class="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-1.5">
                    <label for="sync-students" class="block font-bold text-xs text-stone-700">
                      🎓 Baseline Student Counter
                    </label>
                    <input 
                      id="sync-students"
                      type="number" 
                      bind:value={editStats.baseStudentsCount}
                      class="w-full p-2.5 bg-white rounded-xl border border-stone-300 font-bold text-lg text-amber-900"
                    />
                    <span class="block text-[11px] text-stone-500">
                      + {students.length} system enrolled = <strong class="text-emerald-800">{editStats.baseStudentsCount + students.length}+ displayed on Main Page</strong>
                    </span>
                  </div>

                  <div class="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-1.5">
                    <label for="sync-countries" class="block font-bold text-xs text-stone-700">
                      🌍 Countries Reached
                    </label>
                    <input 
                      id="sync-countries"
                      type="number" 
                      bind:value={editStats.countriesCount}
                      class="w-full p-2.5 bg-white rounded-xl border border-stone-300 font-bold text-lg text-amber-900"
                    />
                    <span class="block text-[11px] text-stone-500">
                      Displayed as <strong class="text-emerald-800">{editStats.countriesCount}+ Countries</strong> on Main Page
                    </span>
                  </div>

                  <div class="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-1.5">
                    <label for="sync-years" class="block font-bold text-xs text-stone-700">
                      📅 Years of Teaching
                    </label>
                    <input 
                      id="sync-years"
                      type="number" 
                      bind:value={editStats.yearsCount}
                      class="w-full p-2.5 bg-white rounded-xl border border-stone-300 font-bold text-lg text-amber-900"
                    />
                    <span class="block text-[11px] text-stone-500">
                      Displayed as <strong class="text-emerald-800">{editStats.yearsCount}+ Years</strong> on Main Page
                    </span>
                  </div>

                  <div class="sm:col-span-3 flex justify-end">
                    <button 
                      type="submit"
                      class="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                    >
                      <span>🔄</span>
                      <span>Save & Sync Directly to Main Page</span>
                    </button>
                  </div>
                </form>
              </div>

              <!-- Two-Column Breakdown -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                <!-- Faculty Load Summary -->
                <div class="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-md space-y-5">
                  <div class="flex items-center justify-between border-b border-stone-100 pb-3">
                    <h4 class="font-serif font-bold text-stone-900 text-lg">
                      👨‍🏫 Faculty Roster & Student Load
                    </h4>
                    <button onclick={() => activeTab = 'teachers'} class="text-xs font-bold text-amber-800 hover:underline">
                      Manage All →
                    </button>
                  </div>

                  <div class="divide-y divide-stone-100">
                    {#each teachers as teacher}
                      {@const teacherStudents = students.filter(s => s.teacherId === teacher.id)}
                      <div class="py-3 flex items-center justify-between gap-4">
                        <div class="flex items-center gap-3">
                          <img src={teacher.image} alt={teacher.name} class="w-10 h-10 rounded-full object-cover border border-amber-300" />
                          <div>
                            <span class="block text-sm font-bold text-stone-900 leading-tight">{teacher.name}</span>
                            <span class="block text-xs text-stone-500">{teacher.categoryLabel}</span>
                          </div>
                        </div>
                        <div class="text-right">
                          <span class="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                            {teacherStudents.length} Active Students
                          </span>
                        </div>
                      </div>
                    {/each}
                  </div>
                </div>

                <!-- Recent Enrolled Students -->
                <div class="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-md space-y-5">
                  <div class="flex items-center justify-between border-b border-stone-100 pb-3">
                    <h4 class="font-serif font-bold text-stone-900 text-lg">
                      🎓 Recently Enrolled Students
                    </h4>
                    <button onclick={() => activeTab = 'students'} class="text-xs font-bold text-emerald-800 hover:underline">
                      View All Students →
                    </button>
                  </div>

                  <div class="divide-y divide-stone-100">
                    {#each students.slice(0, 5) as student}
                      <div class="py-3 flex items-center justify-between gap-4">
                        <div>
                          <span class="block text-sm font-bold text-stone-900 leading-tight">{student.name}</span>
                          <span class="block text-xs text-stone-500">
                            {student.instrument} • Mentored by <strong class="text-stone-700">{student.teacherName}</strong>
                          </span>
                        </div>
                        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {student.status}
                        </span>
                      </div>
                    {/each}
                  </div>
                </div>

              </div>

            </div>
          {/if}

          <!-- ========================================== -->
          <!-- TAB 2: TEACHERS MANAGEMENT -->
          <!-- ========================================== -->
          {#if activeTab === 'teachers'}
            <div class="space-y-6">
              
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-stone-200">
                <div>
                  <h3 class="text-xl font-serif font-bold text-stone-900">
                    Instructor Roster Management
                  </h3>
                  <p class="text-xs text-stone-500">
                    Add new instructors, edit biographies, assign student quotas, and toggle visibility on the public website.
                  </p>
                </div>
                
                <div class="flex items-center gap-3">
                  <select 
                    bind:value={teacherCategoryFilter}
                    class="px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold bg-white"
                  >
                    <option value="all">All Disciplines</option>
                    <option value="begena">Begena (በገና)</option>
                    <option value="krar">Krar & Washint</option>
                    <option value="geez">Ge'ez Language</option>
                    <option value="mezmur">Orthodox Mezmur</option>
                  </select>

                  <button 
                    onclick={openAddTeacher}
                    class="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <span>+</span>
                    <span>Add Teacher</span>
                  </button>
                </div>
              </div>

              <!-- Teachers Cards Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each filteredTeachers as teacher (teacher.id)}
                  {@const teacherStudents = students.filter(s => s.teacherId === teacher.id)}
                  <div class="bg-white rounded-3xl border border-stone-200 shadow-md p-6 space-y-5 flex flex-col justify-between hover:border-amber-400 transition-all">
                    
                    <div class="space-y-4">
                      <!-- Teacher Top Info -->
                      <div class="flex items-start gap-4">
                        <img 
                          src={teacher.image} 
                          alt={teacher.name} 
                          class="w-16 h-20 rounded-2xl object-cover border-2 border-amber-300/80 shrink-0 shadow-sm"
                        />
                        <div class="min-w-0 flex-1">
                          <span class="inline-block px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[9px] uppercase tracking-wider mb-1">
                            {teacher.originIcon} {teacher.categoryLabel}
                          </span>
                          <h4 class="font-serif font-bold text-stone-900 text-base leading-tight truncate">
                            {teacher.name}
                          </h4>
                          <p class="text-xs text-amber-800 font-medium truncate">{teacher.role}</p>
                          <p class="text-[11px] text-stone-400 truncate mt-0.5">🏛️ {teacher.origin}</p>
                        </div>
                      </div>

                      <!-- Stats Mini Grid -->
                      <div class="grid grid-cols-2 gap-2 text-xs bg-stone-50 p-3 rounded-2xl border border-stone-100">
                        <div>
                          <span class="text-stone-400 block text-[10px] uppercase">Active Students</span>
                          <span class="font-bold text-emerald-800 text-sm">{teacherStudents.length} Students</span>
                        </div>
                        <div>
                          <span class="text-stone-400 block text-[10px] uppercase">Rating / Exp</span>
                          <span class="font-bold text-stone-800">⭐ {teacher.rating} • {teacher.exp.split(' ')[0]}</span>
                        </div>
                      </div>

                      <p class="text-xs text-stone-600 line-clamp-2 italic leading-relaxed">
                        "{teacher.bio}"
                      </p>
                    </div>

                    <!-- Bottom Controls -->
                    <div class="pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                      <button 
                        onclick={() => toggleTeacherActive(teacher)}
                        class="px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer {teacher.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'}"
                      >
                        {teacher.active ? '● Live on Site' : '○ Hidden'}
                      </button>

                      <div class="flex items-center gap-1.5">
                        <a 
                          href="http://localhost:5173/teachers/{teacher.id}" 
                          target="_blank"
                          class="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
                          title="View public profile"
                        >
                          👁️
                        </a>

                        <button 
                          onclick={() => openEditTeacher(teacher)}
                          class="px-2.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold cursor-pointer"
                          title="Edit details"
                        >
                          ✏️ Edit
                        </button>

                        <button 
                          onclick={() => handleRemoveTeacher(teacher.id)}
                          class="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold cursor-pointer"
                          title="Delete instructor"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                  </div>
                {/each}
              </div>

            </div>
          {/if}

          <!-- ========================================== -->
          <!-- TAB 3: STUDENTS MANAGEMENT -->
          <!-- ========================================== -->
          {#if activeTab === 'students'}
            <div class="bg-white rounded-3xl border border-stone-200 shadow-md overflow-hidden space-y-4">
              
              <div class="p-6 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 class="text-xl font-serif font-bold text-stone-900">
                    Enrolled Student Directory
                  </h3>
                  <p class="text-xs text-stone-500">
                    Track student progress, assigned teachers, instruments, contact information, and plans.
                  </p>
                </div>

                <div class="flex items-center gap-3">
                  <select 
                    bind:value={studentTeacherFilter}
                    class="px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold bg-white"
                  >
                    <option value="all">Filter by Teacher: All</option>
                    {#each teachers as t}
                      <option value={t.id}>{t.name}</option>
                    {/each}
                  </select>

                  <button 
                    onclick={openAddStudent}
                    class="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer shadow-md flex items-center gap-1.5"
                  >
                    <span>+</span>
                    <span>Enroll Student</span>
                  </button>
                </div>
              </div>

              {#if filteredStudents.length === 0}
                <div class="p-12 text-center text-stone-400 space-y-2">
                  <span class="text-4xl block">🎓</span>
                  <p class="text-sm font-medium">No students found matching this criteria.</p>
                </div>
              {:else}
                <div class="overflow-x-auto">
                  <table class="w-full text-left text-xs text-stone-700">
                    <thead class="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200 font-bold">
                      <tr>
                        <th class="p-4">Student</th>
                        <th class="p-4">Instrument / Course</th>
                        <th class="p-4">Assigned Teacher</th>
                        <th class="p-4">Contact (WhatsApp)</th>
                        <th class="p-4">Location</th>
                        <th class="p-4">Plan & Status</th>
                        <th class="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-stone-100">
                      {#each filteredStudents as student (student.id)}
                        <tr class="hover:bg-amber-50/20 transition-colors">
                          <td class="p-4 font-bold text-stone-900">
                            <div>{student.name}</div>
                            <div class="text-[10px] text-stone-400 font-normal">Since {student.enrolledDate}</div>
                          </td>
                          <td class="p-4">
                            <span class="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold text-[10px]">
                              {student.instrument}
                            </span>
                            <div class="text-[10px] text-stone-500 mt-0.5 max-w-xs truncate">{student.course}</div>
                          </td>
                          <td class="p-4 font-semibold text-stone-800">
                            {student.teacherName}
                          </td>
                          <td class="p-4">
                            <a 
                              href="https://wa.me/{student.phone.replace(/[^0-9]/g, '')}" 
                              target="_blank"
                              class="text-emerald-700 font-bold hover:underline inline-flex items-center gap-1"
                            >
                              <span>💬</span>
                              <span>{student.phone}</span>
                            </a>
                          </td>
                          <td class="p-4 text-stone-600">
                            {student.location || '—'}
                          </td>
                          <td class="p-4 space-y-1">
                            <div class="text-[10px] font-semibold text-stone-500">{student.plan}</div>
                            <select 
                              value={student.status}
                              onchange={(e) => handleSetStudentStatus(student.id, e.target.value)}
                              class="px-2 py-0.5 rounded-md text-[10px] font-bold outline-hidden border border-stone-200 {
                                student.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                                student.status === 'Paused' ? 'bg-amber-100 text-amber-800' :
                                'bg-stone-100 text-stone-800'
                              }"
                            >
                              <option value="Active">Active</option>
                              <option value="Paused">Paused</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </td>
                          <td class="p-4 text-right">
                            <button 
                              onclick={() => handleRemoveStudent(student.id)}
                              class="text-rose-500 hover:text-rose-700 text-xs font-bold p-1 cursor-pointer"
                              title="Delete student"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                </div>
              {/if}

            </div>
          {/if}

          <!-- ========================================== -->
          <!-- TAB 4: ADMINS & TEACHER ADMINS MANAGEMENT -->
          <!-- ========================================== -->
          {#if activeTab === 'admins'}
            <div class="space-y-6">
              
              <div class="bg-white p-6 rounded-3xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 class="text-xl font-serif font-bold text-stone-900">
                    Administrator & Teacher Admin Accounts
                  </h3>
                  <p class="text-xs text-stone-500">
                    Grant administrative privileges to teachers or staff coordinators with personalized PIN codes.
                  </p>
                </div>
                <button 
                  onclick={openAddAdmin}
                  class="px-4 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <span>+</span>
                  <span>Add Admin / Teacher Admin</span>
                </button>
              </div>

              <!-- Admins List Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each admins as admin (admin.id)}
                  <div class="bg-white rounded-3xl border border-stone-200 shadow-md p-6 space-y-4 flex flex-col justify-between">
                    
                    <div class="space-y-3">
                      <div class="flex items-center justify-between">
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider {
                          admin.role === 'Super Admin' ? 'bg-amber-100 text-amber-900' :
                          admin.role === 'Teacher Admin' ? 'bg-emerald-100 text-emerald-900' :
                          'bg-sky-100 text-sky-900'
                        }">
                          🛡️ {admin.role}
                        </span>
                        <span class="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                          🔒 SHA-256 Hashed
                        </span>
                      </div>

                      <div>
                        <h4 class="font-serif font-bold text-stone-900 text-base leading-tight">
                          {admin.name}
                        </h4>
                        <div class="flex items-center gap-1.5 mt-1 text-xs text-stone-500 font-mono">
                          <span>User:</span>
                          <strong class="text-stone-800 bg-stone-100 px-1.5 py-0.5 rounded-md">{admin.username || admin.id}</strong>
                        </div>
                        {#if admin.assignedTeacherId || admin.teacherId}
                          {@const teacherId = admin.assignedTeacherId || admin.teacherId}
                          {@const assigned = teachers.find(t => t.id === teacherId)}
                          <p class="text-xs text-amber-800 font-semibold mt-1">
                            Linked Teacher: {assigned ? assigned.name : teacherId}
                          </p>
                        {/if}
                      </div>

                      <div class="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl space-y-1">
                        {#if admin.email}<div>✉️ {admin.email}</div>{/if}
                        {#if admin.phone}<div>📞 {admin.phone}</div>{/if}
                        <div class="text-[10px] text-stone-400">Security: <span class="text-emerald-700 font-semibold">Salted & Hashed Database Password</span></div>
                      </div>
                    </div>

                    <div class="pt-3 border-t border-stone-100 flex items-center justify-between">
                      <span class="text-[10px] text-stone-400">Created: {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'Active'}</span>
                      {#if admin.id !== 'admin_1' && admin.username !== 'admin'}
                        <button 
                          onclick={() => handleRemoveAdmin(admin.id)}
                          class="text-rose-600 hover:text-rose-800 text-xs font-bold cursor-pointer"
                        >
                          🗑️ Remove Admin
                        </button>
                      {:else}
                        <span class="text-[10px] font-bold text-amber-800">Master Account</span>
                      {/if}
                    </div>

                  </div>
                {/each}
              </div>

            </div>
          {/if}

          <!-- ========================================== -->
          <!-- TAB 5: APPLICATIONS FROM /TEACH -->
          <!-- ========================================== -->
          {#if activeTab === 'applications'}
            <div class="bg-white rounded-3xl border border-stone-200 shadow-md overflow-hidden space-y-4">
              
              <div class="p-6 border-b border-stone-100 flex items-center justify-between">
                <div>
                  <h3 class="text-xl font-serif font-bold text-stone-900">
                    Incoming Teacher Applications
                  </h3>
                  <p class="text-xs text-stone-500">
                    Direct recruitment submissions from <a href="http://localhost:5173/teach" target="_blank" class="text-amber-700 underline">/teach</a>.
                  </p>
                </div>
                <button onclick={exportBackup} class="text-xs font-bold text-stone-600 hover:text-amber-800">
                  📥 Export Records
                </button>
              </div>

              {#if applications.length === 0}
                <div class="p-12 text-center text-stone-400 space-y-2">
                  <span class="text-4xl block">📭</span>
                  <p class="text-sm font-medium">No teacher applications received yet.</p>
                  <p class="text-xs">When an instructor applies on <a href="http://localhost:5173/teach" target="_blank" class="text-amber-800 underline">/teach</a>, it will appear here immediately.</p>
                </div>
              {:else}
                <div class="overflow-x-auto">
                  <table class="w-full text-left text-xs text-stone-700">
                    <thead class="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200 font-bold">
                      <tr>
                        <th class="p-4">Date</th>
                        <th class="p-4">Applicant</th>
                        <th class="p-4">Specialty & Exp</th>
                        <th class="p-4">Diocese / Origin</th>
                        <th class="p-4">Contact</th>
                        <th class="p-4">Status</th>
                        <th class="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-stone-100">
                      {#each applications as app (app.id)}
                        <tr class="hover:bg-amber-50/20 transition-colors">
                          <td class="p-4 text-stone-400 whitespace-nowrap">
                            {new Date(app.date).toLocaleDateString()}
                          </td>
                          <td class="p-4 font-bold text-stone-900">
                            <div>{app.fullName}</div>
                            {#if app.bio}
                              <div class="text-[10px] text-stone-400 font-normal line-clamp-1 italic max-w-xs">"{app.bio}"</div>
                            {/if}
                          </td>
                          <td class="p-4">
                            <span class="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold text-[10px]">
                              {app.specialty}
                            </span>
                            <div class="text-[10px] text-stone-500 mt-0.5">{app.experience}</div>
                          </td>
                          <td class="p-4 text-stone-600">
                            {app.diocese || '—'}
                          </td>
                          <td class="p-4 space-y-1">
                            <a 
                              href="https://wa.me/{app.phone.replace(/[^0-9]/g, '')}" 
                              target="_blank"
                              class="text-emerald-700 font-bold hover:underline block"
                            >
                              💬 {app.phone}
                            </a>
                            {#if app.telegram}
                              <a 
                                href="https://t.me/{app.telegram.replace('@', '')}" 
                                target="_blank"
                                class="text-sky-700 hover:underline block text-[10px]"
                              >
                                ✈️ {app.telegram}
                              </a>
                            {/if}
                          </td>
                          <td class="p-4">
                            <select 
                              value={app.status}
                              onchange={(e) => setAppStatus(app.id, e.target.value)}
                              class="px-2 py-1 rounded-md text-[11px] font-bold outline-hidden border border-stone-200 {
                                app.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                                app.status === 'Contacted' ? 'bg-sky-100 text-sky-800' :
                                app.status === 'Declined' ? 'bg-rose-100 text-rose-800' :
                                'bg-amber-100 text-amber-800'
                              }"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Approved">Approved</option>
                              <option value="Declined">Declined</option>
                            </select>
                          </td>
                          <td class="p-4 text-right space-x-2">
                            {#if app.status !== 'Approved'}
                              <button 
                                onclick={() => approveAndConvertToTeacher(app)}
                                class="px-2.5 py-1 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] cursor-pointer"
                                title="Add as live teacher on website"
                              >
                                ✓ Approve & Add Teacher
                              </button>
                            {/if}
                            <button 
                              onclick={() => removeApp(app.id)}
                              class="text-rose-500 hover:text-rose-700 text-xs font-bold p-1 cursor-pointer"
                              title="Delete record"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                </div>
              {/if}

            </div>
          {/if}

          <!-- ========================================== -->
          <!-- TAB 6: STUDENT BOOKINGS & ENROLLMENT LEADS -->
          <!-- ========================================== -->
          {#if activeTab === 'bookings'}
            <div class="bg-white rounded-3xl border border-stone-200 shadow-md overflow-hidden space-y-4">
              <div class="p-6 border-b border-stone-100 flex items-center justify-between">
                <div>
                  <h3 class="text-xl font-serif font-bold text-stone-900">
                    Student Course & Assessment Bookings
                  </h3>
                  <p class="text-xs text-stone-500">
                    Live booking leads captured from the tuition modal and assessment requests.
                  </p>
                </div>
                <span class="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full">
                  Total: {bookings.length}
                </span>
              </div>

              {#if bookings.length === 0}
                <div class="p-12 text-center text-stone-400 space-y-2">
                  <span class="text-4xl block">📅</span>
                  <p class="text-sm font-medium">No bookings logged yet.</p>
                  <p class="text-xs">When students submit the "Enroll Now" or "Book Assessment" form, records appear here.</p>
                </div>
              {:else}
                <div class="overflow-x-auto">
                  <table class="w-full text-left text-xs text-stone-700">
                    <thead class="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200 font-bold">
                      <tr>
                        <th class="p-4">Date</th>
                        <th class="p-4">Student</th>
                        <th class="p-4">Phone / WhatsApp</th>
                        <th class="p-4">Plan & Instrument</th>
                        <th class="p-4">Timezone</th>
                        <th class="p-4">Status</th>
                        <th class="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-stone-100">
                      {#each bookings as b (b.id)}
                        <tr class="hover:bg-amber-50/20 transition-colors">
                          <td class="p-4 text-stone-400 whitespace-nowrap">
                            {new Date(b.createdAt).toLocaleDateString()}
                          </td>
                          <td class="p-4 font-bold text-stone-900">
                            <div>{b.studentName}</div>
                            {#if b.notes}
                              <div class="text-[10px] text-stone-400 font-normal">{b.notes}</div>
                            {/if}
                          </td>
                          <td class="p-4">
                            <a 
                              href="https://wa.me/{b.phone.replace(/[^0-9]/g, '')}" 
                              target="_blank"
                              class="text-emerald-700 font-bold hover:underline"
                            >
                              💬 {b.phone}
                            </a>
                          </td>
                          <td class="p-4">
                            <span class="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold text-[10px]">
                              {b.planName} • {b.instrument}
                            </span>
                          </td>
                          <td class="p-4 text-stone-600">
                            {b.timezone || 'UTC+3'}
                          </td>
                          <td class="p-4">
                            <select 
                              value={b.status} 
                              onchange={(e) => setBookingStatus(b.id, e.target.value)}
                              class="px-2.5 py-1 rounded-md text-[11px] font-bold outline-hidden border border-stone-200 {
                                b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                                b.status === 'Completed' ? 'bg-sky-100 text-sky-800' :
                                b.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                                'bg-amber-100 text-amber-800'
                              }"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td class="p-4 text-right">
                            <button 
                              onclick={() => removeBooking(b.id)} 
                              class="text-rose-500 hover:text-rose-700 text-xs font-bold p-1 cursor-pointer"
                              title="Delete record"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                </div>
              {/if}
            </div>
          {/if}

          <!-- ========================================== -->
          <!-- TAB 7: INSTRUMENT ORDERS (STORE) -->
          <!-- ========================================== -->
          {#if activeTab === 'orders'}
            <div class="bg-white rounded-3xl border border-stone-200 shadow-md overflow-hidden space-y-4">
              <div class="p-6 border-b border-stone-100 flex items-center justify-between">
                <div>
                  <h3 class="text-xl font-serif font-bold text-stone-900">
                    Handcrafted Traditional Instrument Orders
                  </h3>
                  <p class="text-xs text-stone-500">
                    Begena, Krar, and Masenqo purchase requests from worldwide patrons.
                  </p>
                </div>
                <span class="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full">
                  Total: {orders.length}
                </span>
              </div>

              {#if orders.length === 0}
                <div class="p-12 text-center text-stone-400 space-y-2">
                  <span class="text-4xl block">📦</span>
                  <p class="text-sm font-medium">No instrument orders received yet.</p>
                  <p class="text-xs">Incoming orders from the "Order Instrument" section will appear here.</p>
                </div>
              {:else}
                <div class="overflow-x-auto">
                  <table class="w-full text-left text-xs text-stone-700">
                    <thead class="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200 font-bold">
                      <tr>
                        <th class="p-4">Date</th>
                        <th class="p-4">Customer</th>
                        <th class="p-4">Instrument</th>
                        <th class="p-4">Country & Address</th>
                        <th class="p-4">Contact</th>
                        <th class="p-4">Status</th>
                        <th class="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-stone-100">
                      {#each orders as ord (ord.id)}
                        <tr class="hover:bg-amber-50/20 transition-colors">
                          <td class="p-4 text-stone-400 whitespace-nowrap">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </td>
                          <td class="p-4 font-bold text-stone-900">
                            <div>{ord.customerName}</div>
                            {#if ord.notes}
                              <div class="text-[10px] text-stone-400 font-normal">{ord.notes}</div>
                            {/if}
                          </td>
                          <td class="p-4">
                            <span class="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold text-[10px]">
                              {ord.instrumentType}
                            </span>
                          </td>
                          <td class="p-4 text-stone-600">
                            <div>{ord.country}</div>
                            {#if ord.shippingAddress}
                              <div class="text-[10px] text-stone-400">{ord.shippingAddress}</div>
                            {/if}
                          </td>
                          <td class="p-4">
                            {#if ord.phone && ord.phone !== 'WhatsApp / Pending'}
                              <a 
                                href="https://wa.me/{ord.phone.replace(/[^0-9]/g, '')}" 
                                target="_blank"
                                class="text-emerald-700 font-bold hover:underline"
                              >
                                💬 {ord.phone}
                              </a>
                            {:else}
                              <span class="text-stone-400 italic">WhatsApp Lead</span>
                            {/if}
                          </td>
                          <td class="p-4">
                            <select 
                              value={ord.status} 
                              onchange={(e) => setOrderStatus(ord.id, e.target.value)}
                              class="px-2.5 py-1 rounded-md text-[11px] font-bold outline-hidden border border-stone-200 {
                                ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                                ord.status === 'Shipped' ? 'bg-sky-100 text-sky-800' :
                                ord.status === 'In Crafting' ? 'bg-purple-100 text-purple-800' :
                                'bg-amber-100 text-amber-800'
                              }"
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Crafting">In Crafting</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td class="p-4 text-right">
                            <button 
                              onclick={() => removeOrder(ord.id)} 
                              class="text-rose-500 hover:text-rose-700 text-xs font-bold p-1 cursor-pointer"
                              title="Delete record"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                </div>
              {/if}
            </div>
          {/if}

          <!-- ========================================== -->
          <!-- TAB 8: CONTACT INQUIRIES & CHATBOT LEADS -->
          <!-- ========================================== -->
          {#if activeTab === 'messages'}
            <div class="bg-white rounded-3xl border border-stone-200 shadow-md overflow-hidden space-y-4">
              <div class="p-6 border-b border-stone-100 flex items-center justify-between">
                <div>
                  <h3 class="text-xl font-serif font-bold text-stone-900">
                    Contact Form Messages & Inquiries
                  </h3>
                  <p class="text-xs text-stone-500">
                    General questions and inquiries submitted through the contact section.
                  </p>
                </div>
                <span class="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full">
                  Total: {contactMessages.length}
                </span>
              </div>

              {#if contactMessages.length === 0}
                <div class="p-12 text-center text-stone-400 space-y-2">
                  <span class="text-4xl block">💬</span>
                  <p class="text-sm font-medium">No contact messages received yet.</p>
                  <p class="text-xs">Submissions from the Contact Us form will appear here.</p>
                </div>
              {:else}
                <div class="overflow-x-auto">
                  <table class="w-full text-left text-xs text-stone-700">
                    <thead class="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200 font-bold">
                      <tr>
                        <th class="p-4">Date</th>
                        <th class="p-4">Sender</th>
                        <th class="p-4">Subject</th>
                        <th class="p-4">Message</th>
                        <th class="p-4">Channel</th>
                        <th class="p-4">Status</th>
                        <th class="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-stone-100">
                      {#each contactMessages as msg (msg.id)}
                        <tr class="hover:bg-amber-50/20 transition-colors">
                          <td class="p-4 text-stone-400 whitespace-nowrap">
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </td>
                          <td class="p-4 font-bold text-stone-900">
                            <div>{msg.name}</div>
                            {#if msg.phone}
                              <div class="text-[10px] text-stone-500">{msg.phone}</div>
                            {/if}
                            {#if msg.email}
                              <div class="text-[10px] text-stone-400">{msg.email}</div>
                            {/if}
                          </td>
                          <td class="p-4 font-semibold text-amber-950">
                            {msg.subject || 'General Inquiry'}
                          </td>
                          <td class="p-4 text-stone-600 max-w-xs">
                            <p class="line-clamp-2">{msg.message}</p>
                          </td>
                          <td class="p-4 text-stone-400">
                            {msg.channel || 'Web Form'}
                          </td>
                          <td class="p-4">
                            <select 
                              value={msg.status} 
                              onchange={(e) => setMessageStatus(msg.id, e.target.value)}
                              class="px-2.5 py-1 rounded-md text-[11px] font-bold outline-hidden border border-stone-200 {
                                msg.status === 'Replied' ? 'bg-emerald-100 text-emerald-800' :
                                msg.status === 'Read' ? 'bg-sky-100 text-sky-800' :
                                'bg-amber-100 text-amber-800'
                              }"
                            >
                              <option value="New">New</option>
                              <option value="Read">Read</option>
                              <option value="Replied">Replied</option>
                            </select>
                          </td>
                          <td class="p-4 text-right">
                            <button 
                              onclick={() => removeMessage(msg.id)} 
                              class="text-rose-500 hover:text-rose-700 text-xs font-bold p-1 cursor-pointer"
                              title="Delete inquiry"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                </div>
              {/if}
            </div>
          {/if}

        </div>
      {/if}

    </div>
  </main>

  <!-- ========================================== -->
  <!-- MODAL: ADD / EDIT TEACHER -->
  <!-- ========================================== -->
  {#if isAddTeacherOpen || isEditTeacherOpen}
    <div class="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        <div class="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 class="text-lg font-serif font-bold text-stone-900">
            {isEditTeacherOpen ? 'Edit Teacher Details' : 'Add New Teacher to Faculty'}
          </h3>
          <button 
            onclick={() => { isAddTeacherOpen = false; isEditTeacherOpen = false; }}
            class="text-stone-400 hover:text-stone-700 font-bold"
          >
            ✕
          </button>
        </div>

        <form onsubmit={handleSaveTeacher} class="space-y-4 text-xs">
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="tf-name" class="block font-bold text-stone-700 mb-1">Full Name (English) *</label>
              <input id="tf-name" type="text" required bind:value={teacherForm.name} placeholder="e.g. Memhir Daniel Assefa" class="w-full p-2.5 rounded-xl border border-stone-300" />
            </div>
            <div>
              <label for="tf-nameam" class="block font-bold text-stone-700 mb-1">Full Name (Amharic) *</label>
              <input id="tf-nameam" type="text" required bind:value={teacherForm.nameAm} placeholder="e.g. መምህር ዳንኤል አሰፋ" class="w-full p-2.5 rounded-xl border border-stone-300" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="tf-role" class="block font-bold text-stone-700 mb-1">Role / Title (English)</label>
              <input id="tf-role" type="text" bind:value={teacherForm.role} placeholder="Traditional Instrument Virtuoso" class="w-full p-2.5 rounded-xl border border-stone-300" />
            </div>
            <div>
              <label for="tf-roleam" class="block font-bold text-stone-700 mb-1">Role / Title (Amharic)</label>
              <input id="tf-roleam" type="text" bind:value={teacherForm.roleAm} placeholder="የባሕላዊ ዜማ መሣሪያዎች አሰልጣኝ" class="w-full p-2.5 rounded-xl border border-stone-300" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="tf-origin" class="block font-bold text-stone-700 mb-1">Parish / Diocese Origin (English)</label>
              <input id="tf-origin" type="text" bind:value={teacherForm.origin} placeholder="Gondar / Lalibela / Addis Ababa" class="w-full p-2.5 rounded-xl border border-stone-300" />
            </div>
            <div>
              <label for="tf-originam" class="block font-bold text-stone-700 mb-1">Parish / Diocese Origin (Amharic)</label>
              <input id="tf-originam" type="text" bind:value={teacherForm.originAm} placeholder="ከላሊበላ / ከጎንደር" class="w-full p-2.5 rounded-xl border border-stone-300" />
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div>
              <label for="tf-cat" class="block font-bold text-stone-700 mb-1">Category</label>
              <select id="tf-cat" bind:value={teacherForm.category} class="w-full p-2.5 rounded-xl border border-stone-300 bg-white">
                <option value="begena">Begena (በገና)</option>
                <option value="krar">Krar & Washint</option>
                <option value="geez">Ge'ez Language</option>
                <option value="mezmur">Orthodox Mezmur</option>
              </select>
            </div>
            <div>
              <label for="tf-exp" class="block font-bold text-stone-700 mb-1">Experience</label>
              <input id="tf-exp" type="text" bind:value={teacherForm.exp} placeholder="8+ Years" class="w-full p-2.5 rounded-xl border border-stone-300" />
            </div>
            <div>
              <label for="tf-img" class="block font-bold text-stone-700 mb-1">Portrait Image</label>
              <select id="tf-img" bind:value={teacherForm.image} class="w-full p-2.5 rounded-xl border border-stone-300 bg-white">
                <option value="/assets/teachers/teacher-1.jpg">Portrait 1 (Traditional)</option>
                <option value="/assets/teachers/teacher-2.jpg">Portrait 2 (Priestly/Liturgical)</option>
                <option value="/assets/teachers/teacher-3.jpg">Portrait 3 (Instrumentalist)</option>
                <option value="/assets/teachers/teacher-4.jpg">Portrait 4 (Choir Master)</option>
                <option value="/assets/teachers/teacher-5.jpg">Portrait 5 (Female Begena Mentor)</option>
              </select>
            </div>
          </div>

          <div>
            <label for="tf-teaching" class="block font-bold text-stone-700 mb-1">Teaching Focus & Curriculum (English)</label>
            <input id="tf-teaching" type="text" bind:value={teacherForm.teaching} placeholder="10-String Begena Sacred Zema, Tizita & Bati Tunings..." class="w-full p-2.5 rounded-xl border border-stone-300" />
          </div>

          <div>
            <label for="tf-bio" class="block font-bold text-stone-700 mb-1">Biography (English)</label>
            <textarea id="tf-bio" rows="3" bind:value={teacherForm.bio} placeholder="Enter full biography and background..." class="w-full p-2.5 rounded-xl border border-stone-300"></textarea>
          </div>

          <div>
            <label for="tf-bioam" class="block font-bold text-stone-700 mb-1">Biography (Amharic)</label>
            <textarea id="tf-bioam" rows="3" bind:value={teacherForm.bioAm} placeholder="የመምህሩ ሙሉ የሕይወትና የዜማ ታሪክ..." class="w-full p-2.5 rounded-xl border border-stone-300"></textarea>
          </div>

          <div class="pt-3 flex justify-end gap-3 border-t border-stone-100">
            <button type="button" onclick={() => { isAddTeacherOpen = false; isEditTeacherOpen = false; }} class="px-5 py-2.5 rounded-xl bg-stone-200 font-bold">
              Cancel
            </button>
            <button type="submit" class="px-6 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold">
              {isEditTeacherOpen ? 'Update Teacher' : 'Save New Teacher'}
            </button>
          </div>

        </form>

      </div>
    </div>
  {/if}

  <!-- ========================================== -->
  <!-- MODAL: ENROLL STUDENT -->
  <!-- ========================================== -->
  {#if isAddStudentOpen}
    <div class="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
        
        <div class="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 class="text-lg font-serif font-bold text-stone-900">
            Enroll New Student
          </h3>
          <button onclick={() => isAddStudentOpen = false} class="text-stone-400 hover:text-stone-700 font-bold">✕</button>
        </div>

        <form onsubmit={handleSaveStudent} class="space-y-4 text-xs">
          <div>
            <label for="sf-name" class="block font-bold text-stone-700 mb-1">Student Full Name *</label>
            <input id="sf-name" type="text" required bind:value={studentForm.name} placeholder="e.g. Yared Tadesse" class="w-full p-2.5 rounded-xl border border-stone-300" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="sf-phone" class="block font-bold text-stone-700 mb-1">WhatsApp / Phone *</label>
              <input id="sf-phone" type="tel" required bind:value={studentForm.phone} placeholder="+1... or +251..." class="w-full p-2.5 rounded-xl border border-stone-300" />
            </div>
            <div>
              <label for="sf-loc" class="block font-bold text-stone-700 mb-1">Location / Country</label>
              <input id="sf-loc" type="text" bind:value={studentForm.location} placeholder="USA / Canada / Ethiopia" class="w-full p-2.5 rounded-xl border border-stone-300" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="sf-inst" class="block font-bold text-stone-700 mb-1">Instrument / Study</label>
              <select id="sf-inst" bind:value={studentForm.instrument} class="w-full p-2.5 rounded-xl border border-stone-300 bg-white">
                <option value="Begena">10-String Begena</option>
                <option value="Krar">Traditional Krar</option>
                <option value="Washint">Bamboo Washint</option>
                <option value="Ge'ez Language">Ge'ez Language</option>
                <option value="Mezmur & Vocal">Orthodox Mezmur</option>
              </select>
            </div>
            <div>
              <label for="sf-teach" class="block font-bold text-stone-700 mb-1">Assign Teacher *</label>
              <select id="sf-teach" bind:value={studentForm.teacherId} class="w-full p-2.5 rounded-xl border border-stone-300 bg-white">
                {#each teachers as t}
                  <option value={t.id}>{t.name}</option>
                {/each}
              </select>
            </div>
          </div>

          <div>
            <label for="sf-plan" class="block font-bold text-stone-700 mb-1">Tuition Plan</label>
            <select id="sf-plan" bind:value={studentForm.plan} class="w-full p-2.5 rounded-xl border border-stone-300 bg-white">
              <option value="Starter Plan">Starter Plan (Foundation)</option>
              <option value="Standard Plan">Standard Plan (Bi-Weekly)</option>
              <option value="Mastery / Diaspora Plan">Mastery / Diaspora Plan</option>
            </select>
          </div>

          <div class="pt-3 flex justify-end gap-3 border-t border-stone-100">
            <button type="button" onclick={() => isAddStudentOpen = false} class="px-4 py-2 rounded-xl bg-stone-200 font-bold">Cancel</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold">Enroll Student</button>
          </div>
        </form>

      </div>
    </div>
  {/if}

  <!-- ========================================== -->
  <!-- MODAL: ADD ADMIN / TEACHER ADMIN -->
  <!-- ========================================== -->
  {#if isAddAdminOpen}
    <div class="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
        
        <div class="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 class="text-lg font-serif font-bold text-stone-900">
            Add Admin or Teacher Admin
          </h3>
          <button onclick={() => isAddAdminOpen = false} class="text-stone-400 hover:text-stone-700 font-bold">✕</button>
        </div>

        <form onsubmit={handleSaveAdmin} class="space-y-4 text-xs">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="af-name" class="block font-bold text-stone-700 mb-1">Full Name *</label>
              <input id="af-name" type="text" required bind:value={adminForm.name} placeholder="e.g. Kesis Yohannes Gebre" class="w-full p-2.5 rounded-xl border border-stone-300" />
            </div>
            <div>
              <label for="af-user" class="block font-bold text-stone-700 mb-1">Login Username *</label>
              <input id="af-user" type="text" required bind:value={adminForm.username} placeholder="e.g. yohannes" class="w-full p-2.5 rounded-xl border border-stone-300 font-mono" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="af-role" class="block font-bold text-stone-700 mb-1">Administrative Role *</label>
              <select id="af-role" bind:value={adminForm.role} class="w-full p-2.5 rounded-xl border border-stone-300 bg-white">
                {#if dbRoles.length > 0}
                  {#each dbRoles as r}
                    <option value={r.name}>{r.name} (Lvl {r.hierarchyLevel})</option>
                  {/each}
                {:else}
                  <option value="Teacher Admin">Teacher Admin</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Academy Coordinator">Academy Coordinator</option>
                {/if}
              </select>
            </div>
            <div>
              <label for="af-pass" class="block font-bold text-stone-700 mb-1">Password (min 6 chars) *</label>
              <input id="af-pass" type="password" required minlength="6" bind:value={adminForm.password} placeholder="••••••••" class="w-full p-2.5 rounded-xl border border-stone-300 font-mono" />
            </div>
          </div>

          <div>
            <label for="af-teach" class="block font-bold text-stone-700 mb-1">Link to Instructor (Optional)</label>
            <select id="af-teach" bind:value={adminForm.assignedTeacherId} class="w-full p-2.5 rounded-xl border border-stone-300 bg-white">
              <option value="">None (General Admin)</option>
              {#each teachers as t}
                <option value={t.id}>{t.name} ({t.categoryLabel})</option>
              {/each}
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="af-phone" class="block font-bold text-stone-700 mb-1">Phone Number</label>
              <input id="af-phone" type="tel" bind:value={adminForm.phone} placeholder="+251 9..." class="w-full p-2.5 rounded-xl border border-stone-300" />
            </div>
            <div>
              <label for="af-email" class="block font-bold text-stone-700 mb-1">Email Address</label>
              <input id="af-email" type="email" bind:value={adminForm.email} placeholder="teacher@betearsema.org" class="w-full p-2.5 rounded-xl border border-stone-300" />
            </div>
          </div>

          <div class="pt-3 flex justify-end gap-3 border-t border-stone-100">
            <button type="button" onclick={() => isAddAdminOpen = false} class="px-4 py-2 rounded-xl bg-stone-200 font-bold">Cancel</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold">Save Admin User</button>
          </div>
        </form>

      </div>
    </div>
  {/if}

</div>
