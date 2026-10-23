import { json } from '@sveltejs/kit';
import { 
  initDatabase, 
  getBookingsTurso, 
  saveBookingTurso, 
  updateBookingStatusTurso, 
  deleteBookingTurso 
} from '#lib/server/turso.js';

export async function GET() {
  try {
    await initDatabase();
    const bookings = await getBookingsTurso();
    return json(bookings);
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    await initDatabase();
    const body = await request.json();
    if (!body.studentName || !body.phone) {
      return json({ error: 'Student name and phone number are required' }, { status: 400 });
    }
    const saved = await saveBookingTurso(body);
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
      return json({ error: 'Booking ID and status are required' }, { status: 400 });
    }
    await updateBookingStatusTurso(id, status);
    return json({ success: true });
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE({ request }) {
  try {
    await initDatabase();
    const { id } = await request.json();
    if (!id) return json({ error: 'Booking ID required' }, { status: 400 });
    await deleteBookingTurso(id);
    return json({ success: true });
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}
