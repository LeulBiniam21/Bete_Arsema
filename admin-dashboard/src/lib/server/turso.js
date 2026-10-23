import { createClient } from '@libsql/client';
import { generateSalt, hashPassword } from '../authCrypto.js';
import { defaultTeachers } from '../teachersData.js';

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

let client = null;

function loadEnvConfig() {
  let url = process.env.TURSO_DATABASE_URL;
  let authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url && existsSync(resolve('.env'))) {
    try {
      const content = readFileSync(resolve('.env'), 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...rest] = trimmed.split('=');
          const val = rest.join('=').trim().replace(/(^"|"$|^'|'$)/g, '');
          if (key.trim() === 'TURSO_DATABASE_URL' && val) url = val;
          if (key.trim() === 'TURSO_AUTH_TOKEN' && val) authToken = val;
        }
      }
    } catch (e) {}
  }

  return {
    url: url || 'file:local_database.db',
    authToken: authToken || undefined
  };
}

export function getTursoClient() {
  if (client) return client;

  const config = loadEnvConfig();
  client = createClient({
    url: config.url,
    authToken: config.authToken
  });

  return client;
}

export function isTursoCloud() {
  const config = loadEnvConfig();
  return config.url.startsWith('libsql://') || config.url.includes('turso.io');
}

export async function initDatabase() {
  const db = getTursoClient();

  // Enable foreign key enforcement
  try {
    await db.execute("PRAGMA foreign_keys = ON;");
  } catch (e) {
    // Some cloud drivers might handle pragma differently
  }

  // Create core tables
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS roles (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      hierarchy_level INTEGER NOT NULL DEFAULT 10,
      is_system INTEGER NOT NULL DEFAULT 1 CHECK(is_system IN (0, 1)),
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS permissions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS role_permissions (
      role_id TEXT NOT NULL,
      permission_id TEXT NOT NULL,
      PRIMARY KEY (role_id, permission_id),
      FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
      FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS teachers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_am TEXT,
      role TEXT NOT NULL,
      role_am TEXT,
      bio TEXT NOT NULL,
      bio_am TEXT,
      experience TEXT,
      instruments TEXT,
      image TEXT,
      rating REAL NOT NULL DEFAULT 5.0 CHECK(rating >= 1.0 AND rating <= 5.0),
      reviews_count INTEGER NOT NULL DEFAULT 0 CHECK(reviews_count >= 0),
      active INTEGER NOT NULL DEFAULT 1 CHECK(active IN (0, 1)),
      badge TEXT,
      phone TEXT,
      email TEXT,
      fee_per_hour INTEGER NOT NULL DEFAULT 25 CHECK(fee_per_hour >= 0),
      data_json TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'Super Admin',
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      teacher_id TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      instrument TEXT NOT NULL,
      level TEXT NOT NULL DEFAULT 'Beginner',
      timezone TEXT NOT NULL DEFAULT 'UTC+3',
      status TEXT NOT NULL DEFAULT 'Active',
      joined_date TEXT NOT NULL,
      teacher_id TEXT,
      FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      instrument TEXT NOT NULL,
      experience TEXT NOT NULL,
      bio TEXT,
      audio_link TEXT,
      status TEXT NOT NULL DEFAULT 'Pending Review',
      notes TEXT,
      submitted_at TEXT NOT NULL,
      reviewed_at TEXT
    );

    CREATE TABLE IF NOT EXISTS platform_stats (
      id TEXT PRIMARY KEY,
      base_students_count INTEGER NOT NULL DEFAULT 150,
      countries_count INTEGER NOT NULL DEFAULT 20,
      years_count INTEGER NOT NULL DEFAULT 8,
      instruments_count INTEGER NOT NULL DEFAULT 4,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      student_name TEXT NOT NULL,
      email TEXT,
      phone TEXT NOT NULL,
      instrument TEXT NOT NULL,
      plan_name TEXT NOT NULL DEFAULT 'Online Classes',
      preferred_schedule TEXT,
      timezone TEXT NOT NULL DEFAULT 'UTC+3',
      teacher_id TEXT,
      status TEXT NOT NULL DEFAULT 'Pending',
      notes TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS instrument_orders (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      email TEXT,
      phone TEXT NOT NULL,
      instrument_type TEXT NOT NULL,
      wood_type TEXT,
      strings_count INTEGER,
      shipping_address TEXT,
      country TEXT NOT NULL DEFAULT 'Ethiopia',
      price REAL,
      currency TEXT NOT NULL DEFAULT 'USD',
      status TEXT NOT NULL DEFAULT 'Pending',
      notes TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      channel TEXT DEFAULT 'Web Form',
      status TEXT NOT NULL DEFAULT 'New',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      student_name TEXT NOT NULL,
      student_country TEXT,
      rating REAL NOT NULL DEFAULT 5.0 CHECK(rating >= 1.0 AND rating <= 5.0),
      comment TEXT NOT NULL,
      instrument TEXT,
      teacher_id TEXT,
      is_featured INTEGER NOT NULL DEFAULT 0 CHECK(is_featured IN (0, 1)),
      is_approved INTEGER NOT NULL DEFAULT 1 CHECK(is_approved IN (0, 1)),
      created_at TEXT NOT NULL,
      FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS class_schedules (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      teacher_id TEXT NOT NULL,
      title TEXT NOT NULL,
      start_time TEXT NOT NULL,
      duration_minutes INTEGER NOT NULL DEFAULT 60,
      meeting_link TEXT,
      status TEXT NOT NULL DEFAULT 'Scheduled',
      created_at TEXT NOT NULL,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
    );

    -- High performance Indexes
    CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(name);
    CREATE INDEX IF NOT EXISTS idx_permissions_category ON permissions(category);
    CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username);
    CREATE INDEX IF NOT EXISTS idx_students_teacher_id ON students(teacher_id);
    CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
    CREATE INDEX IF NOT EXISTS idx_teachers_active ON teachers(active);
    CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
    CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
    CREATE INDEX IF NOT EXISTS idx_bookings_teacher_id ON bookings(teacher_id);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON instrument_orders(status);
    CREATE INDEX IF NOT EXISTS idx_reviews_teacher_id ON reviews(teacher_id);
    CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved);
    CREATE INDEX IF NOT EXISTS idx_schedules_teacher ON class_schedules(teacher_id);
    CREATE INDEX IF NOT EXISTS idx_schedules_student ON class_schedules(student_id);
  `);

  // Seed default Roles if empty
  const rolesCountRes = await db.execute("SELECT COUNT(*) as c FROM roles");
  if (Number(rolesCountRes.rows[0]?.c ?? 0) === 0) {
    const defaultRoles = [
      { id: 'super_admin', name: 'Super Admin', description: 'Full administrative access across all modules, teachers, and system settings', hierarchy: 100 },
      { id: 'coordinator', name: 'Academy Coordinator', description: 'Handles admissions, student enrollments, teacher applications, and store orders', hierarchy: 50 },
      { id: 'teacher_admin', name: 'Teacher Admin', description: 'Instructor access to manage assigned students, lesson schedules, and reviews', hierarchy: 20 }
    ];
    for (const r of defaultRoles) {
      await db.execute({
        sql: `INSERT OR IGNORE INTO roles (id, name, description, hierarchy_level, is_system, created_at)
              VALUES (?, ?, ?, ?, 1, ?)`,
        args: [r.id, r.name, r.description, r.hierarchy, new Date().toISOString()]
      });
    }

    const defaultPerms = [
      { id: 'admins:manage', name: 'Manage Admins', category: 'Administration', description: 'Create and edit staff/admin accounts' },
      { id: 'teachers:manage', name: 'Manage Teachers', category: 'Faculty', description: 'Add and edit teacher profiles and rates' },
      { id: 'students:manage', name: 'Manage Students', category: 'Academics', description: 'Enroll, assign, and update students' },
      { id: 'bookings:manage', name: 'Manage Bookings', category: 'Academics', description: 'Confirm and reschedule lesson bookings' },
      { id: 'orders:manage', name: 'Manage Orders', category: 'Store', description: 'Process traditional instrument orders' },
      { id: 'applications:manage', name: 'Manage Applications', category: 'Faculty', description: 'Review instructor applications' },
      { id: 'reviews:manage', name: 'Manage Reviews', category: 'Quality', description: 'Moderate student ratings and feedback' }
    ];
    for (const p of defaultPerms) {
      await db.execute({
        sql: `INSERT OR IGNORE INTO permissions (id, name, category, description, created_at)
              VALUES (?, ?, ?, ?, ?)`,
        args: [p.id, p.name, p.category, p.description, new Date().toISOString()]
      });
    }

    // Assign Super Admin all permissions
    for (const p of defaultPerms) {
      await db.execute({
        sql: `INSERT OR IGNORE INTO role_permissions (role_id, permission_id) VALUES ('super_admin', ?)`,
        args: [p.id]
      });
    }
  }

  // Check if platform_stats initialized
  const statsRes = await db.execute("SELECT id FROM platform_stats WHERE id = 'main'");
  if (statsRes.rows.length === 0) {
    await db.execute({
      sql: `INSERT INTO platform_stats (id, base_students_count, countries_count, years_count, instruments_count, updated_at) 
            VALUES ('main', 150, 20, 8, 4, ?)`,
      args: [new Date().toISOString()]
    });
  }

  // Check if teachers initialized
  const teachersRes = await db.execute("SELECT COUNT(*) as count FROM teachers");
  const count = Number(teachersRes.rows[0].count);
  if (count === 0 && defaultTeachers?.length > 0) {
    for (const t of defaultTeachers) {
      await db.execute({
        sql: `INSERT OR REPLACE INTO teachers 
              (id, name, name_am, role, role_am, bio, bio_am, experience, instruments, image, rating, reviews_count, active, badge, phone, email, fee_per_hour, data_json, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          t.id ?? '',
          t.name ?? '',
          t.nameAm ?? '',
          t.role ?? '',
          t.roleAm ?? '',
          t.bio ?? '',
          t.bioAm ?? '',
          t.exp ?? t.experience ?? '',
          Array.isArray(t.instruments) ? JSON.stringify(t.instruments) : (t.teaching ?? ''),
          t.image ?? '',
          t.rating ?? 5.0,
          t.studentsCount ?? 0,
          t.active === false ? 0 : 1,
          t.badge ?? '',
          t.phone ?? '',
          t.email ?? '',
          t.feePerHour ?? 25,
          JSON.stringify(t),
          new Date().toISOString()
        ]
      });
    }
  }

  return { success: true, message: 'Database initialized successfully' };
}

// Admin Operations
export async function getAdminsTurso() {
  const db = getTursoClient();
  const res = await db.execute("SELECT id, username, password_hash, salt, role, name, email, phone, teacher_id, created_at FROM admins");
  return res.rows.map(r => ({
    id: r.id,
    username: r.username,
    passwordHash: r.password_hash,
    salt: r.salt,
    role: r.role,
    name: r.name,
    email: r.email,
    phone: r.phone,
    teacherId: r.teacher_id,
    createdAt: r.created_at
  }));
}

export async function createAdminTurso(admin) {
  const db = getTursoClient();
  await db.execute({
    sql: `INSERT INTO admins (id, username, password_hash, salt, role, name, email, phone, teacher_id, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      admin.id ?? 'admin-' + Date.now(),
      admin.username,
      admin.passwordHash,
      admin.salt,
      admin.role ?? 'Super Admin',
      admin.name,
      admin.email ?? '',
      admin.phone ?? '',
      admin.teacherId ?? '',
      admin.createdAt ?? new Date().toISOString()
    ]
  });
  return admin;
}

export async function updateAdminTurso(id, updates) {
  const db = getTursoClient();
  const fields = [];
  const args = [];

  if (updates.name !== undefined) { fields.push('name = ?'); args.push(updates.name); }
  if (updates.email !== undefined) { fields.push('email = ?'); args.push(updates.email); }
  if (updates.phone !== undefined) { fields.push('phone = ?'); args.push(updates.phone); }
  if (updates.role !== undefined) { fields.push('role = ?'); args.push(updates.role); }
  if (updates.teacherId !== undefined) { fields.push('teacher_id = ?'); args.push(updates.teacherId); }
  if (updates.passwordHash && updates.salt) {
    fields.push('password_hash = ?', 'salt = ?');
    args.push(updates.passwordHash, updates.salt);
  }

  if (fields.length > 0) {
    args.push(id);
    await db.execute({
      sql: `UPDATE admins SET ${fields.join(', ')} WHERE id = ?`,
      args
    });
  }
}

export async function deleteAdminTurso(id) {
  const db = getTursoClient();
  await db.execute({ sql: "DELETE FROM admins WHERE id = ?", args: [id] });
}

// Teacher Operations
export async function getTeachersTurso() {
  const db = getTursoClient();
  const res = await db.execute("SELECT * FROM teachers ORDER BY active DESC");
  return res.rows.map(r => {
    let extra = {};
    if (r.data_json) {
      try { extra = JSON.parse(r.data_json); } catch (e) {}
    }
    return {
      ...extra,
      id: r.id,
      name: r.name,
      nameAm: r.name_am,
      role: r.role,
      roleAm: r.role_am,
      bio: r.bio,
      bioAm: r.bio_am,
      experience: r.experience,
      image: r.image,
      rating: Number(r.rating),
      active: Number(r.active) === 1,
      badge: r.badge,
      phone: r.phone,
      email: r.email,
      feePerHour: Number(r.fee_per_hour)
    };
  });
}

export async function saveTeacherTurso(t) {
  const db = getTursoClient();
  const id = t.id || 'teacher-' + Date.now();
  await db.execute({
    sql: `INSERT OR REPLACE INTO teachers 
          (id, name, name_am, role, role_am, bio, bio_am, experience, instruments, image, rating, reviews_count, active, badge, phone, email, fee_per_hour, data_json, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      t.name ?? '',
      t.nameAm ?? '',
      t.role ?? '',
      t.roleAm ?? '',
      t.bio ?? '',
      t.bioAm ?? '',
      t.experience ?? t.exp ?? '',
      Array.isArray(t.instruments) ? JSON.stringify(t.instruments) : (t.teaching ?? ''),
      t.image ?? '',
      t.rating ?? 5.0,
      t.reviewsCount ?? t.studentsCount ?? 0,
      t.active === false ? 0 : 1,
      t.badge ?? '',
      t.phone ?? '',
      t.email ?? '',
      t.feePerHour ?? 25,
      JSON.stringify(t),
      t.createdAt ?? new Date().toISOString()
    ]
  });
  return { ...t, id };
}

export async function deleteTeacherTurso(id) {
  const db = getTursoClient();
  await db.execute({ sql: "DELETE FROM teachers WHERE id = ?", args: [id] });
}

// Student Operations
export async function getStudentsTurso() {
  const db = getTursoClient();
  const res = await db.execute("SELECT * FROM students ORDER BY joined_date DESC");
  return res.rows.map(r => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    instrument: r.instrument,
    level: r.level,
    timezone: r.timezone,
    status: r.status,
    joinedDate: r.joined_date,
    teacherId: r.teacher_id
  }));
}

export async function saveStudentTurso(s) {
  const db = getTursoClient();
  const id = s.id || 'std-' + Date.now();
  await db.execute({
    sql: `INSERT OR REPLACE INTO students 
          (id, name, email, phone, instrument, level, timezone, status, joined_date, teacher_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      s.name ?? '',
      s.email ?? '',
      s.phone ?? '',
      s.instrument ?? 'Begena',
      s.level ?? 'Beginner',
      s.timezone ?? 'UTC+3',
      s.status ?? 'Active',
      s.joinedDate ?? new Date().toISOString().split('T')[0],
      s.teacherId ?? ''
    ]
  });
  return { ...s, id };
}

export async function deleteStudentTurso(id) {
  const db = getTursoClient();
  await db.execute({ sql: "DELETE FROM students WHERE id = ?", args: [id] });
}

// Platform Stats Operations
export async function getStatsTurso() {
  const db = getTursoClient();
  const res = await db.execute("SELECT * FROM platform_stats WHERE id = 'main'");
  if (res.rows.length === 0) {
    return {
      studentsCount: 155,
      baseStudentsCount: 150,
      countriesCount: 20,
      yearsCount: 8,
      instrumentsCount: 4
    };
  }
  const row = res.rows[0];
  const stdCountRes = await db.execute("SELECT COUNT(*) as c FROM students WHERE status = 'Active'");
  const registeredCount = Number(stdCountRes.rows[0]?.c ?? 0);
  const base = Number(row.base_students_count);

  return {
    studentsCount: base + registeredCount,
    baseStudentsCount: base,
    countriesCount: Number(row.countries_count),
    yearsCount: Number(row.years_count),
    instrumentsCount: Number(row.instruments_count),
    updatedAt: row.updated_at
  };
}

export async function saveStatsTurso(stats) {
  const db = getTursoClient();
  await db.execute({
    sql: `INSERT OR REPLACE INTO platform_stats 
          (id, base_students_count, countries_count, years_count, instruments_count, updated_at)
          VALUES ('main', ?, ?, ?, ?, ?)`,
    args: [
      Number(stats.baseStudentsCount ?? 150),
      Number(stats.countriesCount ?? 20),
      Number(stats.yearsCount ?? 8),
      Number(stats.instrumentsCount ?? 4),
      new Date().toISOString()
    ]
  });
}

// Teacher Application Operations
export async function getApplicationsTurso() {
  const db = getTursoClient();
  const res = await db.execute("SELECT * FROM applications ORDER BY submitted_at DESC");
  return res.rows.map(r => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    instrument: r.instrument,
    experience: r.experience,
    bio: r.bio,
    audioLink: r.audio_link,
    status: r.status,
    submittedAt: r.submitted_at
  }));
}

export async function saveApplicationTurso(app) {
  const db = getTursoClient();
  const id = app.id || 'app-' + Date.now();
  await db.execute({
    sql: `INSERT INTO applications (id, name, email, phone, instrument, experience, bio, audio_link, status, submitted_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      app.name ?? '',
      app.email ?? '',
      app.phone ?? '',
      app.instrument ?? '',
      app.experience ?? '',
      app.bio ?? '',
      app.audioLink ?? '',
      app.status ?? 'Pending Review',
      app.submittedAt ?? new Date().toISOString()
    ]
  });
  return { ...app, id };
}

export async function updateApplicationStatusTurso(id, status) {
  const db = getTursoClient();
  await db.execute({
    sql: "UPDATE applications SET status = ?, reviewed_at = ? WHERE id = ?",
    args: [status, new Date().toISOString(), id]
  });
}

// Bookings Operations
export async function getBookingsTurso() {
  const db = getTursoClient();
  const res = await db.execute("SELECT * FROM bookings ORDER BY created_at DESC");
  return res.rows.map(r => ({
    id: r.id,
    studentName: r.student_name,
    email: r.email,
    phone: r.phone,
    instrument: r.instrument,
    planName: r.plan_name,
    preferredSchedule: r.preferred_schedule,
    timezone: r.timezone,
    teacherId: r.teacher_id,
    status: r.status,
    notes: r.notes,
    createdAt: r.created_at
  }));
}

export async function saveBookingTurso(b) {
  const db = getTursoClient();
  const id = b.id || 'book-' + Date.now();
  await db.execute({
    sql: `INSERT OR REPLACE INTO bookings 
          (id, student_name, email, phone, instrument, plan_name, preferred_schedule, timezone, teacher_id, status, notes, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      b.studentName ?? '',
      b.email ?? '',
      b.phone ?? '',
      b.instrument ?? 'Begena',
      b.planName ?? 'Online Classes',
      b.preferredSchedule ?? '',
      b.timezone ?? 'UTC+3',
      b.teacherId ?? null,
      b.status ?? 'Pending',
      b.notes ?? '',
      b.createdAt ?? new Date().toISOString()
    ]
  });
  return { ...b, id };
}

export async function updateBookingStatusTurso(id, status) {
  const db = getTursoClient();
  await db.execute({
    sql: "UPDATE bookings SET status = ? WHERE id = ?",
    args: [status, id]
  });
}

export async function deleteBookingTurso(id) {
  const db = getTursoClient();
  await db.execute({ sql: "DELETE FROM bookings WHERE id = ?", args: [id] });
}

// Instrument Orders Operations
export async function getOrdersTurso() {
  const db = getTursoClient();
  const res = await db.execute("SELECT * FROM instrument_orders ORDER BY created_at DESC");
  return res.rows.map(r => ({
    id: r.id,
    customerName: r.customer_name,
    email: r.email,
    phone: r.phone,
    instrumentType: r.instrument_type,
    woodType: r.wood_type,
    stringsCount: r.strings_count ? Number(r.strings_count) : null,
    shippingAddress: r.shipping_address,
    country: r.country,
    price: r.price ? Number(r.price) : null,
    currency: r.currency,
    status: r.status,
    notes: r.notes,
    createdAt: r.created_at
  }));
}

export async function saveOrderTurso(order) {
  const db = getTursoClient();
  const id = order.id || 'ord-' + Date.now();
  await db.execute({
    sql: `INSERT OR REPLACE INTO instrument_orders 
          (id, customer_name, email, phone, instrument_type, wood_type, strings_count, shipping_address, country, price, currency, status, notes, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      order.customerName ?? '',
      order.email ?? '',
      order.phone ?? '',
      order.instrumentType ?? '',
      order.woodType ?? '',
      order.stringsCount ?? null,
      order.shippingAddress ?? '',
      order.country ?? 'Ethiopia',
      order.price ?? null,
      order.currency ?? 'USD',
      order.status ?? 'Pending',
      order.notes ?? '',
      order.createdAt ?? new Date().toISOString()
    ]
  });
  return { ...order, id };
}

export async function updateOrderStatusTurso(id, status) {
  const db = getTursoClient();
  await db.execute({
    sql: "UPDATE instrument_orders SET status = ? WHERE id = ?",
    args: [status, id]
  });
}

export async function deleteOrderTurso(id) {
  const db = getTursoClient();
  await db.execute({ sql: "DELETE FROM instrument_orders WHERE id = ?", args: [id] });
}

// Contact Messages Operations
export async function getContactMessagesTurso() {
  const db = getTursoClient();
  const res = await db.execute("SELECT * FROM contact_messages ORDER BY created_at DESC");
  return res.rows.map(r => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    subject: r.subject,
    message: r.message,
    channel: r.channel,
    status: r.status,
    createdAt: r.created_at
  }));
}

export async function saveContactMessageTurso(msg) {
  const db = getTursoClient();
  const id = msg.id || 'msg-' + Date.now();
  await db.execute({
    sql: `INSERT INTO contact_messages (id, name, email, phone, subject, message, channel, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      msg.name ?? '',
      msg.email ?? '',
      msg.phone ?? '',
      msg.subject ?? '',
      msg.message ?? '',
      msg.channel ?? 'Web Form',
      msg.status ?? 'New',
      msg.createdAt ?? new Date().toISOString()
    ]
  });
  return { ...msg, id };
}

export async function updateContactMessageStatusTurso(id, status) {
  const db = getTursoClient();
  await db.execute({
    sql: "UPDATE contact_messages SET status = ? WHERE id = ?",
    args: [status, id]
  });
}

export async function deleteContactMessageTurso(id) {
  const db = getTursoClient();
  await db.execute({ sql: "DELETE FROM contact_messages WHERE id = ?", args: [id] });
}

// Reviews Operations
export async function getReviewsTurso(approvedOnly = true) {
  const db = getTursoClient();
  const sql = approvedOnly 
    ? "SELECT * FROM reviews WHERE is_approved = 1 ORDER BY is_featured DESC, created_at DESC"
    : "SELECT * FROM reviews ORDER BY created_at DESC";
  const res = await db.execute(sql);
  return res.rows.map(r => ({
    id: r.id,
    studentName: r.student_name,
    studentCountry: r.student_country,
    rating: Number(r.rating),
    comment: r.comment,
    instrument: r.instrument,
    teacherId: r.teacher_id,
    isFeatured: Number(r.is_featured) === 1,
    isApproved: Number(r.is_approved) === 1,
    createdAt: r.created_at
  }));
}

export async function saveReviewTurso(rev) {
  const db = getTursoClient();
  const id = rev.id || 'rev-' + Date.now();
  await db.execute({
    sql: `INSERT OR REPLACE INTO reviews 
          (id, student_name, student_country, rating, comment, instrument, teacher_id, is_featured, is_approved, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      rev.studentName ?? '',
      rev.studentCountry ?? '',
      Number(rev.rating ?? 5.0),
      rev.comment ?? '',
      rev.instrument ?? '',
      rev.teacherId ?? null,
      rev.isFeatured ? 1 : 0,
      rev.isApproved === false ? 0 : 1,
      rev.createdAt ?? new Date().toISOString()
    ]
  });
  return { ...rev, id };
}

export async function updateReviewStatusTurso(id, { isApproved, isFeatured }) {
  const db = getTursoClient();
  const fields = [];
  const args = [];
  if (isApproved !== undefined) {
    fields.push("is_approved = ?");
    args.push(isApproved ? 1 : 0);
  }
  if (isFeatured !== undefined) {
    fields.push("is_featured = ?");
    args.push(isFeatured ? 1 : 0);
  }
  if (fields.length > 0) {
    args.push(id);
    await db.execute({
      sql: `UPDATE reviews SET ${fields.join(', ')} WHERE id = ?`,
      args
    });
  }
}

export async function deleteReviewTurso(id) {
  const db = getTursoClient();
  await db.execute({ sql: "DELETE FROM reviews WHERE id = ?", args: [id] });
}

// Roles & Permissions Operations
export async function getRolesTurso() {
  const db = getTursoClient();
  const res = await db.execute("SELECT * FROM roles ORDER BY hierarchy_level DESC");
  return res.rows.map(r => ({
    id: r.id,
    name: r.name,
    description: r.description,
    hierarchyLevel: Number(r.hierarchy_level),
    isSystem: Number(r.is_system) === 1,
    createdAt: r.created_at
  }));
}

export async function getRolePermissionsTurso(roleId) {
  const db = getTursoClient();
  const res = await db.execute({
    sql: `SELECT p.* FROM permissions p 
          JOIN role_permissions rp ON p.id = rp.permission_id 
          WHERE rp.role_id = ?`,
    args: [roleId]
  });
  return res.rows.map(r => ({
    id: r.id,
    name: r.name,
    category: r.category,
    description: r.description
  }));
}
