import { json } from '@sveltejs/kit';
import { initDatabase, getAdminsTurso, createAdminTurso, deleteAdminTurso } from '#lib/server/turso.js';
import { generateSalt, hashPassword } from '#lib/authCrypto.js';

export async function GET() {
  try {
    await initDatabase();
    const admins = await getAdminsTurso();
    // Return sanitized list (strip passwordHash and salt)
    const sanitized = admins.map(a => ({
      id: a.id,
      username: a.username,
      role: a.role,
      name: a.name,
      email: a.email,
      phone: a.phone,
      teacherId: a.teacherId,
      createdAt: a.createdAt
    }));
    return json(sanitized);
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    await initDatabase();
    const body = await request.json();
    const { username, password, name, role, email, phone, teacherId } = body;

    if (!username || !password) {
      return json({ error: 'Username and password are required' }, { status: 400 });
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(password, salt);

    const newAdmin = {
      id: 'admin-' + Date.now(),
      username: username.trim().toLowerCase(),
      passwordHash,
      salt,
      role: role || 'Admin',
      name: name?.trim() || username.trim(),
      email: email?.trim() || '',
      phone: phone?.trim() || '',
      teacherId: teacherId || '',
      createdAt: new Date().toISOString()
    };

    await createAdminTurso(newAdmin);

    return json({
      success: true,
      admin: {
        id: newAdmin.id,
        username: newAdmin.username,
        role: newAdmin.role,
        name: newAdmin.name,
        email: newAdmin.email,
        phone: newAdmin.phone,
        teacherId: newAdmin.teacherId,
        createdAt: newAdmin.createdAt
      }
    });
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE({ url }) {
  try {
    await initDatabase();
    const id = url.searchParams.get('id');
    if (!id) return json({ error: 'ID required' }, { status: 400 });

    await deleteAdminTurso(id);
    return json({ success: true });
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}
