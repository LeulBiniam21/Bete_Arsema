// Centralized Teachers & Faculty Data Store for Bete Arsema
// Supports both default mock data and browser localStorage persistence

export const defaultTeachers = [
  {
    id: "yohannes-gebre",
    name: "Kesis / Memhir Yohannes Gebre",
    nameAm: "ቄስ / መምህር ዮሐንስ ገብሬ",
    role: "Ge'ez Liturgical Scholar & Philologist",
    roleAm: "የግዕዝ ቋንቋ ሊቅና ተመራማሪ",
    origin: "Gondar Debre Birhan Selassie & St. Yared Academy",
    originAm: "ከጎንደር ደብረ ብርሃን ሥላሴ እና ያሬዳዊ የዜማ ቤት",
    originIcon: "🏛️",
    teaching: "Classical Ge'ez Grammar (Sewasew), Ancient Fidel Liturgy Reading & Sacred Translation",
    teachingAm: "የግዕዝ ቋንቋ ሰዋስው (ሕግጋት)፣ የብራና መጻሕፍት ንባብ እና የቅዳሴ ትርጓሜ",
    category: "geez",
    categoryLabel: "Ge'ez Language & Liturgy",
    categoryLabelAm: "ግዕዝ ቋንቋና ሥርዓተ ቅዳሴ",
    exp: "14+ Years Scholarship",
    expAm: "ከ14 ዓመት በላይ ልምድ",
    studentsCount: 320,
    rating: 4.9,
    bio: "Expert in liturgical syntax, church literature, and decoding centuries-old Ethiopian Orthodox manuscripts. Born into a priestly family in Gondar, he has spent over a decade teaching both young deacons and university scholars the timeless beauty of Ge'ez.",
    bioAm: "የጥንታዊውን የግዕዝ ቋንቋ ሰዋስው እና የጸሎት መጻሕፍትን ምስጢር በቀላሉ ለማስረዳት ጥልቅ እውቀት ያላቸው። በጎንደር ደብረ ብርሃን ሥላሴ ያደጉና ያገለገሉ፣ በዘመናዊና ባህላዊ የማስተማር ሥነ-ዘዴ የተመሰገኑ።",
    image: "/assets/teachers/teacher-2.jpg",
    curriculum: [
      {
        titleEn: "Fidel & Phonetics Fundamentals",
        titleAm: "የግዕዝ ፊደላትና ትክክለኛ የድምፅ አወጣጥ",
        descEn: "Mastering the 7 vowel orders, ancient diphthongs, and accurate church pronunciation.",
        descAm: "7ቱ የፊደላት ባሕርያት፣ ድምጾች እና ትክክለኛ የቤተክርስቲያን ንባብ ዘይቤ።"
      },
      {
        titleEn: "Ge'ez Sewasew (Grammar Rules)",
        titleAm: "የግዕዝ ሰዋስው (ሕግጋተ ቋንቋ)",
        descEn: "Noun declensions, verb conjugations (Westa Azen, Ziyad), and liturgical sentence construction.",
        descAm: "ስሞች፣ ግሦች (ውሳጣዊ አዘን፣ ዚያድ) እና የዓረፍተ ነገር አወቃቀር ሕጎች።"
      },
      {
        titleEn: "Liturgical Manuscript Translation",
        titleAm: "የብራና መጻሕፍትና የጸሎት ትርጓሜ",
        descEn: "Direct translation of Wuddase Maryam, Kidase, and biblical passages from Ge'ez to Amharic & English.",
        descAm: "ውዳሴ ማርያም፣ ቅዳሴ እና መጽሐፍ ቅዱሳዊ ምንባባትን በቀጥታ መተርጎም።"
      }
    ],
    scheduleEn: "Tuesdays & Thursdays (6:00 PM – 9:00 PM EAT), Saturdays (Morning)",
    scheduleAm: "ማክሰኞ እና ሐሙስ (ከምሽቱ 12:00 – 3:00)፣ ቅዳሜ (ጠዋት)",
    verified: true,
    active: true
  },
  {
    id: "daniel-assefa",
    name: "Memhir Daniel Assefa",
    nameAm: "መምህር ዳንኤል አሰፋ",
    role: "Traditional Instrumentalist & Virtuoso",
    roleAm: "የባሕላዊ ዜማ መሣሪያዎች አሰልጣኝ",
    origin: "Lalibela Bet Giyorgis Heritage Center",
    originAm: "ከላሊበላ ቅዱስ ጊዮርጊስ እና ባህላዊ ሙዚቃ ቅርስ ማዕከል",
    originIcon: "🎵",
    teaching: "Acoustic & Electric Krar (Choche, Kererto) and Traditional Bamboo Washint",
    teachingAm: "ባህላዊና ኤሌክትሪክ ክራር (ጮጬ፣ ቀረርቶ) እንዲሁም ባህላዊ የቀርከሃ ዋሽንት",
    category: "krar",
    categoryLabel: "Krar & Washint",
    categoryLabelAm: "ክራር እና ዋሽንት",
    exp: "10+ Years Traditional Zema",
    expAm: "ከ10 ዓመት በላይ ልምድ",
    studentsCount: 280,
    rating: 4.95,
    bio: "Specialist in Ethiopian pentatonic scalar modes (Tizita, Bati, Ambassel, Anchihoye), finger-picking styles, and sacred/cultural music harmony. Raised in Lalibela, he bridges authentic highland acoustics with modern diaspora learners.",
    bioAm: "በኢትዮጵያ አምስቱ የዜማ ቅኝቶች (ትዝታ፣ ባቲ፣ አምባሰል፣ አንቺሆዬ) እና የጣት አያያዝ ቴክኒክ ላይ የካበተ ልምድ ያላቸው። ከላሊበላ እስከ አዲስ አበባ ባሕላዊ ዜማን በከፍተኛ ጥበብ ሲያስተምሩ ቆይተዋል።",
    image: "/assets/teachers/teacher-3.jpg",
    curriculum: [
      {
        titleEn: "Krar Anatomy & Tuning Mastery",
        titleAm: "የክራር አካላት እና የ5ቱ ቅኝቶች አቃኛኘት",
        descEn: "Setting string tensions, electronic tuner synchronization, and tonal ear training.",
        descAm: "አውታሮችን ማስተካከል፣ በጆሮና በቲውነር ቅኝቶችን በትክክል መያዝ።"
      },
      {
        titleEn: "Finger-Picking & Strumming (Kererto)",
        titleAm: "የጣት ድርደራና የግርፍ ስልት (ቀረርቶ)",
        descEn: "Independent finger coordination, rhythmic muting, and spiritual accompaniment patterns.",
        descAm: "ፈጣንና የተረጋጋ የጣት ቅልጥፍና እንዲሁም ለመንፈሳዊ መዝሙራት የሚሆኑ አጨዋወቶች።"
      },
      {
        titleEn: "Traditional Bamboo Washint Breathing",
        titleAm: "የዋሽንት አነፋፈስ እና ድምፅ አመራረት",
        descEn: "Embouchure control, continuous breathing, and pentatonic note bending.",
        descAm: "ትክክለኛ የአየር አጠቃቀም እና 4ቱን የዋሽንት ቀዳዳዎች በማስተባበር ጥዑም ዜማ ማውጣት።"
      }
    ],
    scheduleEn: "Mondays, Wednesdays & Fridays (7:00 PM – 9:30 PM EAT)",
    scheduleAm: "ሰኞ፣ ረቡዕ እና ዓርብ (ከምሽቱ 1:00 – 3:30)",
    verified: true,
    active: true
  },
  {
    id: "samuel-bekele",
    name: "Deacon Samuel Bekele",
    nameAm: "ዲያቆን ሳሙኤል በቀለ",
    role: "Liturgical Choral Director & Zema Lead",
    roleAm: "የተዋሕዶ መዝሙርና የዜማ አሰልጣኝ",
    origin: "Debre Libanos Monastery & Holy Trinity Cathedral",
    originAm: "ከደብረ ሊባኖስ ገዳም እና ቅድስት ሥላሴ ካቴድራል",
    originIcon: "📖",
    teaching: "Orthodox Tewahedo Mezmur, Yaredic Vocal Harmonies (Ge'ez, Ezel, Araray)",
    teachingAm: "የኦርቶዶክስ ተዋሕዶ መዝሙራት፣ ያሬዳዊ የድምፅ ቅኝቶች (ግዕዝ፣ ዕዝል፣ አራራይ)",
    category: "mezmur",
    categoryLabel: "Orthodox Mezmur & Vocal Zema",
    categoryLabelAm: "የተዋሕዶ መዝሙርና ዜማ",
    exp: "9+ Years Choir Directorship",
    expAm: "ከ9 ዓመት በላይ ልምድ",
    studentsCount: 410,
    rating: 4.88,
    bio: "Passionate vocal trainer coaching students in sacred resonance, hymn breathing, and instrument synchronization. Trained under senior cathedral chant masters, Deacon Samuel turns timid beginners into confident liturgical singers.",
    bioAm: "የድምፅ ልምምድ፣ የመተንፈስ ሥነ-ዘዴ እና ከመሣሪያዎች ጋር ተስማምቶ የመዘመር ጥበብን በከፍተኛ ፍቅር የሚያስተምሩ። በበርካታ አድባራት የሰንበት ትምህርት ቤት መዘምራንን ያሰለጠኑ።",
    image: "/assets/teachers/teacher-4.jpg",
    curriculum: [
      {
        titleEn: "Yaredic 3-Tone Vocal Scales",
        titleAm: "3ቱ ያሬዳዊ የዜማ ስልቶች (ግዕዝ፣ ዕዝል፣ አራራይ)",
        descEn: "Understanding liturgical melody shifts, prayer tones, and festive hymn intonation.",
        descAm: "የዜማ ልዩነቶች፣ የጾም እና የደስታ ወቅቶች የዜማ ስልቶች።"
      },
      {
        titleEn: "Choral Harmony & Breath Control",
        titleAm: "የድምፅ ቅንብርና የመተንፈስ ቴክኒክ",
        descEn: "Diaphragmatic singing, sustain control, and group pitch alignment.",
        descAm: "ረጅም ዜማዎችን ያለ ድካም ለማሰማት የሚያስችል የአተነፋፈስ ሥልጠና።"
      },
      {
        titleEn: "Instrument-Synchronized Mezmur",
        titleAm: "መዝሙርን ከመሣሪያ ጋር አዋህዶ መዘመር",
        descEn: "Singing seamlessly while plucking the Begena or strumming the Krar.",
        descAm: "በገናን እየደረደሩ ወይም ክራርን እየመቱ ያለምንም መዛባት መዘመር።"
      }
    ],
    scheduleEn: "Tuesdays & Saturdays (All day time slots available)",
    scheduleAm: "ማክሰኞ እና ቅዳሜ (ሙሉ ቀን በተለያዩ ሰዓታት)",
    verified: true,
    active: true
  },
  {
    id: "martha-tesfaye",
    name: "Memhirt Martha Tesfaye",
    nameAm: "መምህርት ማርታ ተስፋዬ",
    role: "Youth Begena & Sacred Music Mentor",
    roleAm: "የጀማሪዎችና የህፃናት በገና አሰልጣኝ",
    origin: "Addis Ababa St. Mary & Diaspora Online Faculty",
    originAm: "ከአዲስ አበባ ቅድስት ማርያም እና የኦንላይን አካዳሚ",
    originIcon: "🕊️",
    teaching: "Beginner Begena Finger-Plucking, Fasting Chants & Spiritual Meditation",
    teachingAm: "የጀማሪ በገና ድርደራ፣ የጾም ዜማዎች እና መንፈሳዊ ማሰላሰያ",
    category: "begena",
    categoryLabel: "10-String Begena",
    categoryLabelAm: "የ10 አውታር በገና",
    exp: "6+ Years Mentorship",
    expAm: "ከ6 ዓመት በላይ ልምድ",
    studentsCount: 240,
    rating: 4.96,
    bio: "Patient instructor specially beloved by children, youth, and diaspora beginners starting from zero musical background. She creates a warm, encouraging atmosphere where anyone can connect deeply with the harp of King David.",
    bioAm: "በተለይም ለጀማሪዎች፣ ለህፃናትና በውጭ ሀገር ለሚኖሩ ተማሪዎች በትዕግስትና በደግነት የበገናን ድርደራ ከዜሮ ጀምረው በማስጨበጥ የተመሰገኑ መምህርት።",
    image: "/assets/teachers/teacher-5.jpg",
    curriculum: [
      {
        titleEn: "10-String Plucking & Hand Posture",
        titleAm: "የ10ሩ አውታሮች የጣት አቀማመጥ",
        descEn: "Correct left-hand palm damping and right-hand rhythmic plucking.",
        descAm: "ትክክለኛው የግራና የቀኝ እጅ አቀማመጥ እና የንክኪ ስልት።"
      },
      {
        titleEn: "Spiritual Fasting Zema (Tizita Minor)",
        titleAm: "የጾም ዜማዎች እና የትዝታ ቅኝት",
        descEn: "Learning classic hymns such as 'Kidase Tsion' and fasting spiritual chants.",
        descAm: "የጾም መዝሙራትንና ልብ የሚነኩ መንፈሳዊ ዜማዎችን በቅደም ተከተል መማር።"
      },
      {
        titleEn: "Ear Training & Prayer Accompaniment",
        titleAm: "የጆሮ ልምምድ እና ለጸሎት ማዘጋጀት",
        descEn: "Developing the ability to tune by ear and play peacefully during private prayer.",
        descAm: "በራስ ጆሮ ቅኝትን መያዝ እና ለግል ጸሎት ሰዓት የበገና ድርደራን መጠቀም።"
      }
    ],
    scheduleEn: "Fridays, Saturdays & Sundays (Flexible timezone slots)",
    scheduleAm: "ዓርብ፣ ቅዳሜ እና እሑድ (ለዲያስፖራ ተማሪዎች ምቹ ሰዓት)",
    verified: true,
    active: true
  }
];

// LocalStorage Keys
const TEACHERS_STORAGE_KEY = 'bete_arsema_teachers_roster_v1';
const APPLICATIONS_STORAGE_KEY = 'bete_arsema_teacher_applications_v1';
const ADMINS_STORAGE_KEY = 'bete_arsema_admins_v1';
const STUDENTS_STORAGE_KEY = 'bete_arsema_students_v1';

// Default Admins / Teacher Admins
export const defaultAdmins = [
  {
    id: 'admin_1',
    name: 'Chief Academy Director',
    role: 'Super Admin',
    pin: '2026',
    email: 'admin@betearsema.org',
    phone: '+251 711 890 131',
    assignedTeacherId: '',
    createdAt: '2026-01-01'
  },
  {
    id: 'admin_2',
    name: 'Kesis / Memhir Yohannes Gebre',
    role: 'Teacher Admin',
    pin: '1234',
    email: 'yohannes@betearsema.org',
    phone: '+251 911 234 567',
    assignedTeacherId: 'yohannes-gebre',
    createdAt: '2026-02-15'
  }
];

// Default Initial Students
export const defaultStudents = [
  {
    id: 'stu_1',
    name: 'Yared Teshome',
    teacherId: 'yohannes-gebre',
    teacherName: 'Kesis / Memhir Yohannes Gebre',
    course: "Classical Ge'ez Grammar (Sewasew)",
    instrument: "Ge'ez Language",
    phone: '+1 416 555 0192',
    location: 'Toronto, Canada (Diaspora)',
    plan: 'Mastery / Diaspora Plan',
    status: 'Active',
    enrolledDate: '2026-02-10'
  },
  {
    id: 'stu_2',
    name: 'Selamawit Bekele',
    teacherId: 'martha-tesfaye',
    teacherName: 'Memhirt Martha Tesfaye',
    course: 'Beginner 10-String Begena Finger-Plucking',
    instrument: 'Begena',
    phone: '+1 703 555 0148',
    location: 'Washington D.C., USA (Diaspora)',
    plan: 'Starter Plan',
    status: 'Active',
    enrolledDate: '2026-03-01'
  },
  {
    id: 'stu_3',
    name: 'Dawit Mengistu',
    teacherId: 'daniel-assefa',
    teacherName: 'Memhir Daniel Assefa',
    course: 'Traditional Krar (Tizita & Bati Tunings)',
    instrument: 'Krar',
    phone: '+251 911 445 566',
    location: 'Addis Ababa, Ethiopia',
    plan: 'Standard Plan',
    status: 'Active',
    enrolledDate: '2026-03-15'
  },
  {
    id: 'stu_4',
    name: 'Ruth Haile',
    teacherId: 'samuel-bekele',
    teacherName: 'Deacon Samuel Bekele',
    course: 'Orthodox Tewahedo Mezmur & Yaredic Zema',
    instrument: 'Mezmur & Vocal',
    phone: '+44 20 7946 0912',
    location: 'London, UK (Diaspora)',
    plan: 'Mastery Plan',
    status: 'Active',
    enrolledDate: '2026-03-20'
  },
  {
    id: 'stu_5',
    name: 'Abel Girma',
    teacherId: 'daniel-assefa',
    teacherName: 'Memhir Daniel Assefa',
    course: 'Traditional Bamboo Washint Breathing & Scales',
    instrument: 'Washint',
    phone: '+251 922 778 899',
    location: 'Bahir Dar, Ethiopia',
    plan: 'Starter Plan',
    status: 'Active',
    enrolledDate: '2026-04-02'
  }
];

// Get all active teachers
export function getTeachers() {
  if (typeof window === 'undefined') return defaultTeachers;
  try {
    const raw = localStorage.getItem(TEACHERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(TEACHERS_STORAGE_KEY, JSON.stringify(defaultTeachers));
      return defaultTeachers;
    }
    return JSON.parse(raw);
  } catch (e) {
    return defaultTeachers;
  }
}

// Get single teacher by ID
export function getTeacherById(id) {
  const list = getTeachers();
  return list.find(t => t.id === id) || null;
}

// Save/Update teacher (Admin)
export function saveTeacher(teacher) {
  if (typeof window === 'undefined') return;
  const list = getTeachers();
  const idx = list.findIndex(t => t.id === teacher.id);
  if (idx >= 0) {
    list[idx] = teacher;
  } else {
    list.unshift(teacher);
  }
  localStorage.setItem(TEACHERS_STORAGE_KEY, JSON.stringify(list));
}

// Delete teacher (Admin)
export function deleteTeacher(id) {
  if (typeof window === 'undefined') return;
  const list = getTeachers().filter(t => t.id !== id);
  localStorage.setItem(TEACHERS_STORAGE_KEY, JSON.stringify(list));
}

// --- Teacher Applications Management ---

export function getApplications() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveApplication(appData) {
  if (typeof window === 'undefined') return;
  const list = getApplications();
  const newApp = {
    id: 'app_' + Date.now(),
    date: new Date().toISOString(),
    status: 'Pending', // Pending, Contacted, Approved, Declined
    ...appData
  };
  list.unshift(newApp);
  localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(list));
  return newApp;
}

export function updateApplicationStatus(id, newStatus) {
  if (typeof window === 'undefined') return;
  const list = getApplications();
  const target = list.find(a => a.id === id);
  if (target) {
    target.status = newStatus;
    localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(list));
  }
}

export function deleteApplication(id) {
  if (typeof window === 'undefined') return;
  const list = getApplications().filter(a => a.id !== id);
  localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(list));
}

// --- Admin Accounts & Teacher Admins Management ---

export function getAdmins() {
  if (typeof window === 'undefined') return defaultAdmins;
  try {
    const raw = localStorage.getItem(ADMINS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(defaultAdmins));
      return defaultAdmins;
    }
    return JSON.parse(raw);
  } catch (e) {
    return defaultAdmins;
  }
}

export function saveAdmin(adminData) {
  if (typeof window === 'undefined') return;
  const list = getAdmins();
  const idx = list.findIndex(a => a.id === adminData.id);
  if (idx >= 0) {
    list[idx] = adminData;
  } else {
    list.unshift({
      ...adminData,
      id: adminData.id || 'admin_' + Date.now(),
      createdAt: new Date().toISOString().slice(0, 10)
    });
  }
  localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(list));
}

export function deleteAdmin(id) {
  if (typeof window === 'undefined') return;
  const list = getAdmins().filter(a => a.id !== id);
  localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(list));
}

export function authenticateAdmin(pin) {
  const admins = getAdmins();
  const trimmed = (pin || '').trim();
  // Fallback support for default 2026 PIN
  if (trimmed === '2026') {
    return admins[0] || { name: 'Academy Director', role: 'Super Admin', pin: '2026' };
  }
  return admins.find(a => a.pin === trimmed) || null;
}

// --- Students Management ---

export function getStudents() {
  if (typeof window === 'undefined') return defaultStudents;
  try {
    const raw = localStorage.getItem(STUDENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(defaultStudents));
      return defaultStudents;
    }
    return JSON.parse(raw);
  } catch (e) {
    return defaultStudents;
  }
}

export function saveStudent(studentData) {
  if (typeof window === 'undefined') return;
  const list = getStudents();
  const idx = list.findIndex(s => s.id === studentData.id);
  if (idx >= 0) {
    list[idx] = studentData;
  } else {
    list.unshift({
      ...studentData,
      id: studentData.id || 'stu_' + Date.now(),
      enrolledDate: studentData.enrolledDate || new Date().toISOString().slice(0, 10)
    });
  }
  localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(list));
}

export function deleteStudent(id) {
  if (typeof window === 'undefined') return;
  const list = getStudents().filter(s => s.id !== id);
  localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(list));
}

export function updateStudentStatus(id, newStatus) {
  if (typeof window === 'undefined') return;
  const list = getStudents();
  const target = list.find(s => s.id === id);
  if (target) {
    target.status = newStatus;
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(list));
  }
}

// --- Platform Stats & Homepage Synchronization ---
const PLATFORM_STATS_KEY = 'bete_arsema_platform_stats_v1';

export const defaultPlatformStats = {
  baseStudentsCount: 150,
  countriesCount: 20,
  yearsCount: 8,
  instrumentsCount: 4
};

export function getPlatformStats() {
  if (typeof window === 'undefined') {
    return {
      studentsCount: 150,
      activeEnrolledCount: 5,
      teachersCount: 4,
      countriesCount: 20,
      yearsCount: 8,
      instrumentsCount: 4
    };
  }
  try {
    const raw = localStorage.getItem(PLATFORM_STATS_KEY);
    const custom = raw ? JSON.parse(raw) : defaultPlatformStats;
    const studentsList = getStudents();
    const teachersList = getTeachers();
    
    // Total students = base student count + count of enrolled students in DB
    const baseCount = Number(custom.baseStudentsCount ?? 150);
    const enrolledCount = studentsList.length;
    const totalStudents = baseCount + enrolledCount;

    return {
      baseStudentsCount: baseCount,
      studentsCount: totalStudents,
      activeEnrolledCount: studentsList.filter(s => s.status === 'Active').length,
      teachersCount: teachersList.filter(t => t.active !== false).length,
      totalTeachersCount: teachersList.length,
      countriesCount: Number(custom.countriesCount ?? 20),
      yearsCount: Number(custom.yearsCount ?? 8),
      instrumentsCount: 4
    };
  } catch (e) {
    return {
      studentsCount: 150,
      activeEnrolledCount: 5,
      teachersCount: 4,
      countriesCount: 20,
      yearsCount: 8,
      instrumentsCount: 4
    };
  }
}

export function savePlatformStats(newStats) {
  if (typeof window === 'undefined') return;
  try {
    const current = getPlatformStats();
    const toSave = {
      baseStudentsCount: Number(newStats.baseStudentsCount ?? current.baseStudentsCount ?? 150),
      countriesCount: Number(newStats.countriesCount ?? current.countriesCount ?? 20),
      yearsCount: Number(newStats.yearsCount ?? current.yearsCount ?? 8)
    };
    localStorage.setItem(PLATFORM_STATS_KEY, JSON.stringify(toSave));
    // Trigger storage event for other tabs/components
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('Failed to save platform stats', e);
  }
}
