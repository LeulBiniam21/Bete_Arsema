import { json } from '@sveltejs/kit';
import { initDatabase, getStatsTurso, saveStatsTurso } from '#lib/server/turso.js';

export async function GET() {
  try {
    await initDatabase();
    const stats = await getStatsTurso();
    return json(stats);
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    await initDatabase();
    const body = await request.json();
    await saveStatsTurso(body);
    const updated = await getStatsTurso();
    return json(updated);
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}
