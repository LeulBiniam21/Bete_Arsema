import { json } from '@sveltejs/kit';
import { initDatabase, getTeachersTurso, saveTeacherTurso, deleteTeacherTurso } from '#lib/server/turso.js';

export async function GET() {
  try {
    await initDatabase();
    const teachers = await getTeachersTurso();
    return json(teachers);
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    await initDatabase();
    const teacher = await request.json();
    const saved = await saveTeacherTurso(teacher);
    return json(saved);
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE({ url }) {
  try {
    await initDatabase();
    const id = url.searchParams.get('id');
    if (!id) return json({ error: 'ID required' }, { status: 400 });

    await deleteTeacherTurso(id);
    return json({ success: true });
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}
