import { json } from '@sveltejs/kit';
import { initDatabase, getAdminsTurso } from '#lib/server/turso.js';
import { verifyPassword } from '#lib/authCrypto.js';

export async function POST({ request }) {
  try {
    await initDatabase();
    const { username, password } = await request.json();

    if (!username || !password) {
      return json({ error: 'Username and password are required' }, { status: 400 });
    }

    const admins = await getAdminsTurso();
    const normalizedUsername = username.trim().toLowerCase();

    // Support username match or master PIN fallback if migrating
    const admin = admins.find(a => a.username.toLowerCase() === normalizedUsername);

    if (!admin) {
      return json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, admin.salt, admin.passwordHash);

    if (!isValid) {
      return json({ error: 'Invalid username or password' }, { status: 401 });
    }

    return json({
      success: true,
      admin: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        role: admin.role,
        email: admin.email,
        phone: admin.phone,
        teacherId: admin.teacherId
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return json({ error: err.message }, { status: 500 });
  }
}
