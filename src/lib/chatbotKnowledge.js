/**
 * Bete Arsema Intelligent Spiritual & Academy Knowledge Base
 * Covers: Ethiopian Orthodox Thought, St. Yared Zema, Ge'ez Language, Sacred Instruments, Academy Courses, Tuition, and Human Handoff.
 */

export const CHATBOT_KNOWLEDGE = {
  // Common keywords to intent mapping
  intents: [
    {
      id: "greeting",
      keywords: ["hello", "hi", "hey", "selam", "ሰላም", "እንደምን", "greeting", "start", "welcome", "tena yistillign", "ጤና ይስጥልኝ"],
      responseEn: "Selam! Peace be with you. Welcome to Bete Arsema Online Academy. I am your spiritual guide and assistant. How can I help you today? You can ask about our online Begena/Krar classes, Ge'ez language lectures, Orthodox Mezmur, tuition, or instrument shipping.",
      responseAm: "ሰላመ እግዚአብሔር ከእርስዎ ጋር ይሁን! ወደ ቤተ አርሴማ የኦንላይን መንፈሳዊ አካዳሚ በደህና መጡ። እኔ የበይነ-መረብ ረዳትዎ ነኝ። ስለ በገና፣ ስለ ክራር፣ ስለ ግዕዝ ቋንቋ ትምህርት፣ ስለ ኦርቶዶክስ መዝሙር ወይም ስለ ክፍያ ምን ማወቅ ይፈልጋሉ?",
      suggestionsEn: ["What is the Begena?", "How do classes work?", "Teach me about Ge'ez", "Tuition & USDT"],
      suggestionsAm: ["የበገና ትምህርት", "ትምህርቱ እንዴት ይሰጣል?", "ስለ ግዕዝ ቋንቋ", "የክፍያ አማራጮች"]
    },
    {
      id: "begena_info",
      keywords: ["begena", "harp", "david", "በገና", "10 string", "አውታር", "ensera", "እንሰራ", "buzz", "strings"],
      responseEn: "The Begena (በገና) is an ancient 10-string box lyre known as the 'Harp of King David'. In the Ethiopian Orthodox Tewahedo Church, it is strictly dedicated to prayer, meditation, repentance (ነሴሐ), and fasting seasons (ዓቢይ ጾም). Its unique acoustic buzz comes from 'ensera' (small leather pieces on the bridge) which symbolizes trembling in awe and humility before God.",
      responseAm: "በገና በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ለጸሎት፣ ለአስተንትኖ፣ ለንስሐ እና ለጾም ወራት (በተለይ ለዓቢይ ጾም) ብቻ የሚያገለግል ባለ 10 አውታር ጥንታዊ የተቀደሰ መሣሪያ ነው። በእንሰሮቹ አማካኝነት የሚፈጠረው ዝግ ያለ የድምፅ ቃና በፈጣሪ ፊት በፍርሃትና በመንቀጥቀጥ መቆምን የሚያመላክት መንፈሳዊ ምሥጢር አለው።",
      action: "open_instruments",
      suggestionsEn: ["How to tune the Begena?", "Listen to Begena audio", "Order a handcrafted Begena"],
      suggestionsAm: ["የበገና አቃናናት", "የበገና ድምፅ ናሙና", "በገና ማዘዝ እፈልጋለሁ"]
    },
    {
      id: "begena_tuning",
      keywords: ["tune", "tuning", "scale", "ቅኝት", "አቃናናት", "ትዝታ", "tizita", "bati", "pitch"],
      responseEn: "The Begena is tuned to ancient Ethiopian pentatonic scales—most commonly Tizita (ትዝታ) and Bati (ባቲ). The 10 strings have traditional names: 1st (Girba/ጊርባ), 2nd, 3rd, 4th, 5th (Ma'ekel/ማዕከል), 6th, 7th, 8th, 9th, and 10th. In our courses, our instructors guide you step-by-step to train your ear and tune each gut string accurately.",
      responseAm: "በገና በዋነኝነት በትዝታ እና በባቲ የቅኝት ስልቶች ይቃኛል። 10ሩ አውታሮች የየራሳቸው ጥንታዊ ስያሜ ያላቸው ሲሆን (ለምሳሌ 1ኛው ጊርባ፣ 5ኛው ማዕከል)፣ በእኛ የኦንላይን ትምህርት መምህራኑ ጆሮዎን በማለማመድ አውታሮቹን ደረጃ በደረጃ እንዴት መቃኘት እንዳለብዎት ያስተምሩዎታል።",
      suggestionsEn: ["Meet our Begena Teachers", "Register for Begena Class"],
      suggestionsAm: ["የመምህራን ማስተዋወቂያ", "በበገና ትምህርት ይመዝገቡ"]
    },
    {
      id: "krar_washint",
      keywords: ["krar", "kirar", "washint", "ክራር", "ዋሽንት", "flute", "bowl lyre"],
      responseEn: "The Krar (ክራር) is a 5 or 6-stringed bowl lyre used for liturgical hymns and spiritual Zema across the four scales (Tizita, Bati, Ambassel, Anchihoye). The Washint (ዋሽንት) is a four-hole bamboo flute producing soulful, breathy pastoral melodies that accompany sacred hymns.",
      responseAm: "ክራር ባለ 5 ወይም 6 አውታር መሣሪያ ሲሆን በአራቱ የዜማ ስልቶች (ትዝታ፣ ባቲ፣ አምባሰል፣ አንቺሆዬ) ለመንፈሳዊ መዝሙራት ያገለግላል። ዋሽንት ደግሞ ከተፈጥሮ ደጋ ቀርከሃ በ4 ቀዳዳዎች ተበስቶ የሚዘጋጅ፣ ልብን የሚነካ መንፈሳዊ ቅላጼ ያለው መሣሪያ ነው።",
      suggestionsEn: ["Krar Course Details", "Order an Instrument"],
      suggestionsAm: ["የክራር ትምህርት", "መሣሪያ ማዘዝ"]
    },
    {
      id: "geez_language",
      keywords: ["geez", "ge'ez", "ግዕዝ", "grammar", "fidel", "ሰዋስው", "ትርጓሜ", "language", "learn geez"],
      responseEn: "Ge'ez (ግዕዝ) is the sacred classical Semitic language of the Ethiopian Orthodox Tewahedo Church and ancient Aksumite civilization. Our lectures cover: 1) Fidel & liturgical reading (ንባብ), 2) Grammar and sentence syntax (ሰዋስው), and 3) Translating traditional prayers, the Psalms of David, and the Divine Liturgy (ቅዳሴ). Beginners are warmly welcomed!",
      responseAm: "ግዕዝ የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን የነገረ-መለኮት፣ የቅዳሴና የጥንታውያን ብራናዎች ቋንቋ ነው። ትምህርታችን 1) የግዕዝ ንባብና አደማመጥ፣ 2) የግዕዝ ሰዋስው (ሕግጋት)፣ እና 3) የጸሎትና የቅዳሴ መጻሕፍት ትርጓሜን ያካትታል። ምንም የቀደመ እውቀት ሳይኖርዎት መጀመር ይችላሉ!",
      suggestionsEn: ["Ge'ez Syllabus", "Enroll in Ge'ez"],
      suggestionsAm: ["የግዕዝ ሥርዓተ-ትምህርት", "በግዕዝ ይመዝገቡ"]
    },
    {
      id: "mezmur_zema",
      keywords: ["mezmur", "mezmure", "zema", "yared", "መዝሙር", "ዜማ", "ያሬድ", "chant", "hymn", "singing", "araray", "ezel"],
      responseEn: "Orthodox Mezmur is rooted in the divine 6th-century musical system revealed to Saint Yared (ቅዱስ ያሬድ). It features three sacred modes: 1) Ge'ez (ግዕዝ - plain/stately), 2) Ezel (ዕዝል - solemn/fasting), and 3) Araray (አራራይ - joyful/melodic). In our academy, you learn vocal control, traditional hymnal chants, and how to sing while accompanying yourself on the Begena or Krar.",
      responseAm: "የተዋሕዶ መዝሙር በ6ኛው መቶ ክፍለ ዘመን ለቅዱስ ያሬድ በተገለጸው ሰማያዊ ዜማ ላይ የተመሠረተ ነው። ሦስቱ የዜማ ስልቶች ግዕዝ (የተረጋጋ)፣ ዕዝል (ለጾምና ለልቅሶ)፣ እና አራራይ (ደስ የሚል የደስታ ዜማ) ይባላሉ። በእኛ ትምህርት የድምፅ አወጣጥን፣ ያሬዳዊ ዜማዎችን እና ከመሣሪያ ጋር አቀናጅቶ መዘመርን ይማራሉ።",
      suggestionsEn: ["Mezmur Class Schedule", "Listen to Audio Samples"],
      suggestionsAm: ["የመዝሙር ትምህርት ሰዓት", "የድምፅ ናሙናዎች"]
    },
    {
      id: "class_format",
      keywords: ["how class", "zoom", "google meet", "how it works", "schedule", "online class", "ትምህርቱ እንዴት", "ሰዓት", "ጊዜ", "format", "process"],
      responseEn: "Classes are conducted 100% online through live, interactive video sessions on Google Meet or Zoom. Your instructor watches your finger technique and vocal delivery in real time, offers instant corrections, and provides practice audio recordings after every class. Schedules are personalized to match your timezone (Ethiopia EAT, US EST/PST, Europe CET).",
      responseAm: "ትምህርቱ በቀጥታ በGoogle Meet ወይም በZoom በቪዲዮ ይሰጣል። መምህሩ የእጅዎን አያያዝ፣ የጣት አጨዋወትዎንና ድምፅዎን በቀጥታ እየተከታተለ ፈጣን እርማት ይሰጣል። በየክፍለ ጊዜው ማጠቃለያ ላይ የድምፅና የቪዲዮ መልመጃዎች ይሰጣሉ። የትምህርት ሰዓቱ ከእርስዎ የነጻ ጊዜ (በኢትዮጵያ፣ በሰሜን አሜሪካ ወይም በአውሮፓ) ጋር ተጣጥሞ ይመደባል።",
      suggestionsEn: ["Book Free Consultation", "View Tuition Pricing"],
      suggestionsAm: ["የነጻ ምክክር ጊዜ ይያዙ", "ክፍያዎችን ይመልከቱ"]
    },
    {
      id: "tuition_pricing",
      keywords: ["price", "cost", "fee", "tuition", "payment", "birr", "usd", "usdt", "crypto", "telebirr", "cbe", "ክፍያ", "ስንት", "ዋጋ", "ብር", "ቴሌብር"],
      responseEn: "We offer 3 transparent monthly packages: \n• Starter: 3,999 Birr / $45 USD (45 USDT) — 2 hrs live/wk\n• Premium: 7,499 Birr / $75 USD (75 USDT) — 4 hrs live/wk + Mezmur & Ge'ez\n• Advanced: 10,999 Birr / $110 USD (110 USDT) — 5+ hrs live/wk Masterclass\nWe accept Telebirr & CBE Bank in Ethiopia, and USDT (TRC-20/TON), PayPal, or Zelle for diaspora learners.",
      responseAm: "3 የወር የትምህርት ጥቅሎች አሉን:\n• ጀማሪ (Starter): 3,999 ብር / $45 USD (45 USDT) — በሳምንት 2 ሰዓት የቀጥታ ትምህርት\n• መካከለኛ (Premium): 7,499 ብር / $75 USD (75 USDT) — በሳምንት 4 ሰዓት + መዝሙርና ግዕዝ\n• ከፍተኛ (Advanced): 10,999 ብር / $110 USD (110 USDT) — በሳምንት 5+ ሰዓት ሙሉ ማስተርክላስ\nክፍያ በሀገር ውስጥ በቴሌብር እና በንግድ ባንክ፤ በውጭ ሀገር በUSDT (Crypto)፣ በPayPal ወይም በZelle ይፈጸማል።",
      action: "open_pricing",
      suggestionsEn: ["Enroll Now", "Pay with USDT / Telebirr", "Talk to Coordinator"],
      suggestionsAm: ["አሁኑኑ ይመዝገቡ", "በUSDT ወይም በቴሌብር መክፈል", "ከአስተባባሪ ጋር ያውሩ"]
    },
    {
      id: "order_instrument",
      keywords: ["buy", "order", "purchase", "ship", "delivery", "shipping", "diaspora delivery", "መሣሪያ መግዛት", "ማዘዝ", "መላክ"],
      responseEn: "Yes! If you don't own an instrument, Bete Arsema custom-crafts authentic 10-string Begena, traditional Krar, and bamboo Washint using seasoned Wanza wood and natural goat parchment. We ship securely with protective bags across all regions of Ethiopia and via express air delivery to the USA, Canada, Europe, Australia, and worldwide.",
      responseAm: "አዎ! መሣሪያ ለሌላቸው ተማሪዎቻችን ከደረቀ የዋንዛ እንጨትና ከፍየል ቆዳ የተሰሩ ጥራት ያላቸውን በገናዎች፣ ክራሮችን እና ዋሽንቶችን አዘጋጅተን በሀገር ውስጥም ሆነ በውጭ ሀገር (ወደ አሜሪካ፣ ካናዳ፣ አውሮፓ፣ አውስትራሊያ) በታማኝነት እንልካለን።",
      suggestionsEn: ["Order Begena on WhatsApp", "Order Krar on WhatsApp"],
      suggestionsAm: ["በገና በዋትስአፕ ማዘዝ", "ክራር በዋትስአፕ ማዘዝ"]
    },
    {
      id: "children_beginners",
      keywords: ["child", "children", "kid", "kids", "beginner", "zero", "age", "ህፃናት", "ልጆች", "ጀማሪ", "ምንም እውቀት"],
      responseEn: "Absolutely! We teach students from complete zero. No prior background in music, instruments, or Ge'ez is needed. We have specialized, patient teaching tracks for children (ages 7 and up) as well as youth and adults, designed to make learning spiritual, engaging, and memorable.",
      responseAm: "በፍጹም ይችላሉ! ትምህርቱ የሚጀምረው ከመሠረቱ (ከዜሮ) በመሆኑ ምንም ዓይነት የቀደመ እውቀት አይጠይቅም። ከ7 ዓመት በላይ ለሆኑ ህፃናት፣ ለወጣቶችና ለአዋቂዎች ምቹና አሳታፊ ሆኖ የተዘጋጀ ሥርዓተ-ትምህርት አለን።",
      suggestionsEn: ["Book a Free Trial Session", "View Syllabus"],
      suggestionsAm: ["የሙከራ ጊዜ ይያዙ", "የትምህርት ዝርዝር"]
    },
    {
      id: "teachers_faculty",
      keywords: ["teacher", "teachers", "instructor", "instructors", "faculty", "memhir", "kesis", "deacon", "መምህር", "መምህራን", "ማን ያስተምራል", "አስተማሪ", "leul", "yohannes", "daniel", "samuel", "martha"],
      responseEn: "Our academy is led by respected church scholars and virtuoso musicians:\n• Memhir Leul Biniam (From Addis Ababa Diocese & Debre Mewi) — Teaches 10-String Begena & Sacred Zema\n• Kesis / Memhir Yohannes Gebre (From Gondar Debre Birhan Selassie) — Teaches Ge'ez Grammar & Ancient Liturgical Texts\n• Memhir Daniel Assefa (From Lalibela Bet Giyorgis) — Teaches Traditional Krar & Bamboo Washint\n• Deacon Samuel Bekele (From Debre Libanos Monastery) — Teaches Orthodox Mezmur & Sacred Harmonies\n• Memhirt Martha Tesfaye (From Addis Ababa St. Mary) — Teaches Beginner Begena & Spiritual Reflection\nYou can explore their rotating showcase on the page or book a session directly!",
      responseAm: "አካዳሚያችን በታላላቅ የቤተክርስቲያን ሊቃውንትና የዜማ ባለሙያዎች የሚመራ ነው:\n• መምህር ልዑል ቢንያም (ከአዲስ አበባ ሀገረ ስብከት እና ደብረ መዊዕ) — የ10 አውታር በገናና መንፈሳዊ ዜማ\n• ቄስ / መምህር ዮሐንስ ገብሬ (ከጎንደር ደብረ ብርሃን ሥላሴ) — የግዕዝ ቋንቋ ሰዋስው እና ጥንታዊ ብራናዎች\n• መምህር ዳንኤል አሰፋ (ከላሊበላ ቅዱስ ጊዮርጊስ) — ባሕላዊ ክራር እና የቀርከሃ ዋሽንት\n• ዲያቆን ሳሙኤል በቀለ (ከደብረ ሊባኖስ ገዳም) — የኦርቶዶክስ ተዋሕዶ መዝሙራት እና ያሬዳዊ ዜማ\n• መምህርት ማርታ ተስፋዬ (ከአዲስ አበባ ቅድስት ማርያም) — የጀማሪ በገና ጣት አደራረግ እና መንፈሳዊ አስተንትኖ\nበድረ-ገጻችን ላይ የመምህራኑን የተሟላ ዝርዝር መመልከት ወይም ቀጥታ መመዝገብ ይችላሉ!",
      suggestionsEn: ["Book Class with Teacher", "View Pricing Plans", "Talk to Coordinator"],
      suggestionsAm: ["ከመምህሩ ጋር ይማሩ", "የትምህርት ክፍያዎች", "ከአስተባባሪ ጋር ያውሩ"]
    },
    {
      id: "contact_human",
      keywords: ["human", "person", "phone", "call", "whatsapp", "telegram", "coordinator", "teacher", "talk", "መምህር", "ስልክ", "ሰው", "አስተባባሪ"],
      responseEn: "You can connect directly with our human coordinators right now:\n📞 Phone: +251 968 590 145\n✉️ Email: leulbiniam2@gmail.com\n💬 WhatsApp: https://wa.me/251968590145\n✈️ Telegram: https://t.me/CEOJAPIBR2",
      responseAm: "አሁኑኑ በቀጥታ ከአስተባባሪያችን ጋር መገናኘት ይችላሉ:\n📞 ስልክ: +251 968 590 145\n✉️ ኢሜይል: leulbiniam2@gmail.com\n💬 ዋትስአፕ: https://wa.me/251968590145\n✈️ ቴሌግራም: https://t.me/CEOJAPIBR2",
      action: "open_contact",
      suggestionsEn: ["Chat on WhatsApp", "Chat on Telegram"],
      suggestionsAm: ["በዋትስአፕ ይጻፉ", "በቴሌግራም ያውሩ"]
    }
  ],

  // Fallback response when no specific intent matched
  fallbackEn: "That is a wonderful question about our spiritual academy. To give you the exact details tailored to your schedule or learning goals, you can choose one of the topics below or speak directly with our head coordinator via WhatsApp or Telegram (+251 968 590 145).",
  fallbackAm: "ስለ አካዳሚያችን ላነሱት ጥያቄ እናመሰግናለን። ለእርስዎ ምቹ የሆነ ትክክለኛ መረጃ ለማግኘት ከታች ካሉት አማራጮች አንዱን መምረጥ ወይም በቀጥታ ከመምህሩ ጋር በዋትስአፕ ወይም በስልክ (+251 968 590 145) መነጋገር ይችላሉ።"
};

/**
 * Intelligent query solver
 */
export function findChatbotResponse(query, lang = 'en') {
  if (!query || query.trim() === '') {
    return {
      text: lang === 'am' ? CHATBOT_KNOWLEDGE.intents[0].responseAm : CHATBOT_KNOWLEDGE.intents[0].responseEn,
      suggestions: lang === 'am' ? CHATBOT_KNOWLEDGE.intents[0].suggestionsAm : CHATBOT_KNOWLEDGE.intents[0].suggestionsEn,
      action: null
    };
  }

  const cleanQuery = query.toLowerCase().trim();

  // Score each intent based on matched keywords
  let bestIntent = null;
  let maxScore = 0;

  for (const intent of CHATBOT_KNOWLEDGE.intents) {
    let score = 0;
    for (const kw of intent.keywords) {
      if (cleanQuery.includes(kw.toLowerCase())) {
        score += kw.length; // weight longer specific keywords more
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestIntent = intent;
    }
  }

  if (bestIntent && maxScore > 0) {
    return {
      text: lang === 'am' ? bestIntent.responseAm : bestIntent.responseEn,
      suggestions: lang === 'am' ? bestIntent.suggestionsAm : bestIntent.suggestionsEn,
      action: bestIntent.action || null
    };
  }

  // Fallback
  return {
    text: lang === 'am' ? CHATBOT_KNOWLEDGE.fallbackAm : CHATBOT_KNOWLEDGE.fallbackEn,
    suggestions: lang === 'am' 
      ? ["የበገና ትምህርት", "የግዕዝ ቋንቋ", "የትምህርት ክፍያ በUSDT/ቴሌብር", "ከአስተባባሪ ጋር መነጋገር"]
      : ["Begena Classes", "Ge'ez Language", "Tuition in USD/USDT", "Speak with Coordinator"],
    action: "open_contact"
  };
}
