import { json } from '@sveltejs/kit';
import { 
  initDatabase, 
  getApplicationsTurso, 
  saveApplicationTurso, 
  updateApplicationStatusTurso 
} from '#lib/server/turso.js';

export async function GET() {
  try {
    await initDatabase();
    const apps = await getApplicationsTurso();
    return json(apps);
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    await initDatabase();
    const body = await request.json();
    const saved = await saveApplicationTurso(body);
    return json(saved);
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}

export async function PUT({ request }) {
  try {
    await initDatabase();
    const { id, status } = await request.json();
    if (!id || !status) return json({ error: 'ID and status required' }, { status: 400 });

    await updateApplicationStatusTurso(id, status);
    return json({ success: true });
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}
