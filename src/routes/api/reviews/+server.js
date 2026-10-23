import { json } from '@sveltejs/kit';
import { 
  initDatabase, 
  getReviewsTurso, 
  saveReviewTurso, 
  updateReviewStatusTurso, 
  deleteReviewTurso 
} from '#lib/server/turso.js';

export async function GET({ url }) {
  try {
    await initDatabase();
    const all = url.searchParams.get('all') === 'true';
    const reviews = await getReviewsTurso(!all);
    return json(reviews);
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    await initDatabase();
    const body = await request.json();
    if (!body.studentName || !body.comment) {
      return json({ error: 'Student name and review comment are required' }, { status: 400 });
    }
    const saved = await saveReviewTurso(body);
    return json(saved);
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}

export async function PUT({ request }) {
  try {
    await initDatabase();
    const { id, isApproved, isFeatured } = await request.json();
    if (!id) return json({ error: 'Review ID required' }, { status: 400 });
    await updateReviewStatusTurso(id, { isApproved, isFeatured });
    return json({ success: true });
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE({ request }) {
  try {
    await initDatabase();
    const { id } = await request.json();
    if (!id) return json({ error: 'Review ID required' }, { status: 400 });
    await deleteReviewTurso(id);
    return json({ success: true });
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}
