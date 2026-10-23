import { json } from '@sveltejs/kit';
import { initDatabase, getStudentsTurso, saveStudentTurso, deleteStudentTurso } from '#lib/server/turso.js';

export async function GET() {
  try {
    await initDatabase();
    const students = await getStudentsTurso();
    return json(students);
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    await initDatabase();
    const student = await request.json();
    const saved = await saveStudentTurso(student);
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

    await deleteStudentTurso(id);
    return json({ success: true });
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}
