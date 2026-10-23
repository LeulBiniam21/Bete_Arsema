/**
 * Bete Arsema - Database Seeder Script
 * Seeds initial teachers, students, platform metrics, and admin account into Turso/SQLite
 * Run via: npm run db:seed
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

// Parse .env manually if dotenv isn't installed
if (existsSync(resolve('.env'))) {
  const envContent = readFileSync(resolve('.env'), 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...rest] = trimmed.split('=');
      const val = rest.join('=').trim().replace(/(^"|"$|^'|'$)/g, '');
      if (key && !process.env[key.trim()]) {
        process.env[key.trim()] = val;
      }
    }
  }
}

import { 
  initDatabase, 
  getTursoClient, 
  getAdminsTurso, 
  createAdminTurso,
  saveStudentTurso,
  getStudentsTurso,
  getTeachersTurso
} from '../src/lib/server/turso.js';
import { generateSalt, hashPassword } from '../src/lib/authCrypto.js';
import { defaultStudents } from '../src/lib/teachersData.js';

async function seed() {
  console.log('\n=============================================');
  console.log('🌱 Starting Bete Arsema Database Seeder...');
  console.log('=============================================');

  const dbUrl = process.env.TURSO_DATABASE_URL || 'file:local_database.db';
  console.log('📡 Database Target:', dbUrl.startsWith('libsql://') ? '🟢 Turso Cloud Database' : '🔵 Local SQLite Database');

  // 1. Initialize Tables & Seed Default Faculty
  console.log('\n[1/4] Initializing Database Tables & Faculty Roster...');
  await initDatabase();
  const teachers = await getTeachersTurso();
  console.log(`✅ Loaded ${teachers.length} certified teachers in database.`);

  // 2. Seed Default Enrolled Students
  console.log('\n[2/4] Seeding Student Enrollments...');
  const existingStudents = await getStudentsTurso();
  if (existingStudents.length === 0) {
    for (const s of defaultStudents) {
      await saveStudentTurso({
        id: s.id,
        name: s.name,
        email: (s.name.toLowerCase().replace(/\s+/g, '.') + '@example.com'),
        phone: s.phone,
        instrument: s.instrument,
        level: 'Intermediate',
        timezone: 'UTC+3',
        status: s.status || 'Active',
        joinedDate: s.enrolledDate || '2026-02-15',
        teacherId: s.teacherId
      });
    }
    console.log(`✅ Seeded ${defaultStudents.length} default students into database.`);
  } else {
    console.log(`ℹ️ Students already present (${existingStudents.length} found). Skipping.`);
  }

  // 3. Seed Default Master Administrator (if no admin exists)
  console.log('\n[3/4] Checking Administrator Accounts...');
  const admins = await getAdminsTurso();
  if (admins.length === 0) {
    const salt = generateSalt();
    const passwordHash = await hashPassword('MasterPassword2026', salt);

    await createAdminTurso({
      id: 'admin-master',
      username: 'admin',
      passwordHash,
      salt,
      role: 'Super Admin',
      name: 'Academy Master Director',
      email: 'admin@betearsema.org',
      phone: '+251 711 890 131',
      teacherId: '',
      createdAt: new Date().toISOString()
    });

    console.log('✅ Created Master Admin:');
    console.log('   • Username: admin');
    console.log('   • Password: MasterPassword2026');
    console.log('   • Password Security: Salted SHA-256 Hash');
  } else {
    console.log(`ℹ️ ${admins.length} Admin account(s) already exist.`);
  }

  // 4. Verify Final State
  console.log('\n[4/4] Verifying Database Summary:');
  const db = getTursoClient();
  const [tCount, sCount, aCount] = await Promise.all([
    db.execute('SELECT COUNT(*) as c FROM teachers'),
    db.execute('SELECT COUNT(*) as c FROM students'),
    db.execute('SELECT COUNT(*) as c FROM admins')
  ]);

  console.log('---------------------------------------------');
  console.log(`👨‍🏫 Teachers in DB:  ${tCount.rows[0].c}`);
  console.log(`🎓 Students in DB:  ${sCount.rows[0].c}`);
  console.log(`🛡️ Admins in DB:    ${aCount.rows[0].c}`);
  console.log('---------------------------------------------');
  console.log('🎉 Seeding completed successfully!\n');
  process.exit(0);
}

seed().catch(err => {
  console.error('\n❌ Seeding failed:', err);
  process.exit(1);
});
