import { json } from '@sveltejs/kit';
import { initDatabase, getAdminsTurso, isTursoCloud } from '#lib/server/turso.js';

export async function GET() {
  try {
    await initDatabase();
    const admins = await getAdminsTurso();
    return json({
      initialized: admins.length > 0,
      adminCount: admins.length,
      hasTursoUrl: isTursoCloud()
    });
  } catch (err) {
    console.error('Failed to check auth status:', err);
    return json({ error: err.message }, { status: 500 });
  }
}
