import { json } from '@sveltejs/kit';
import { initDatabase, getAdminsTurso, createAdminTurso } from '#lib/server/turso.js';
import { generateSalt, hashPassword } from '#lib/authCrypto.js';

export async function POST({ request }) {
  try {
    await initDatabase();
    const body = await request.json();
    const { username, password, name, email, phone, role } = body;

    if (!username || !password) {
      return json({ error: 'Username and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    const existingAdmins = await getAdminsTurso();
    const normalizedUsername = username.trim().toLowerCase();

    if (existingAdmins.some(a => a.username.toLowerCase() === normalizedUsername)) {
      return json({ error: 'An admin with this username already exists' }, { status: 400 });
    }

    // Generate cryptographic salt & SHA-256 hash
    const salt = generateSalt();
    const passwordHash = await hashPassword(password, salt);

    const isFirstAdmin = existingAdmins.length === 0;

    const newAdmin = {
      id: 'admin-' + Date.now(),
      username: normalizedUsername,
      passwordHash,
      salt,
      role: role || (isFirstAdmin ? 'Super Admin' : 'Admin'),
      name: name?.trim() || username.trim(),
      email: email?.trim() || '',
      phone: phone?.trim() || '',
      teacherId: body.teacherId || '',
      createdAt: new Date().toISOString()
    };

    await createAdminTurso(newAdmin);

    return json({
      success: true,
      message: 'Admin account created and password securely hashed',
      admin: {
        id: newAdmin.id,
        username: newAdmin.username,
        name: newAdmin.name,
        role: newAdmin.role,
        email: newAdmin.email,
        phone: newAdmin.phone,
        teacherId: newAdmin.teacherId
      }
    });
  } catch (err) {
    console.error('Failed to setup admin:', err);
    return json({ error: err.message }, { status: 500 });
  }
}
