import { json } from '@sveltejs/kit';
import { 
  initDatabase, 
  getContactMessagesTurso, 
  saveContactMessageTurso, 
  updateContactMessageStatusTurso, 
  deleteContactMessageTurso 
} from '#lib/server/turso.js';

export async function GET() {
  try {
    await initDatabase();
    const messages = await getContactMessagesTurso();
    return json(messages);
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    await initDatabase();
    const body = await request.json();
    if (!body.name || !body.message) {
      return json({ error: 'Name and message are required' }, { status: 400 });
    }
    const saved = await saveContactMessageTurso(body);
    return json(saved);
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}

export async function PUT({ request }) {
  try {
    await initDatabase();
    const { id, status } = await request.json();
    if (!id || !status) {
      return json({ error: 'Message ID and status are required' }, { status: 400 });
    }
    await updateContactMessageStatusTurso(id, status);
    return json({ success: true });
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE({ request }) {
  try {
    await initDatabase();
    const { id } = await request.json();
    if (!id) return json({ error: 'Message ID required' }, { status: 400 });
    await deleteContactMessageTurso(id);
    return json({ success: true });
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}
