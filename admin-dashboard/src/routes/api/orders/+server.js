import { json } from '@sveltejs/kit';
import { 
  initDatabase, 
  getOrdersTurso, 
  saveOrderTurso, 
  updateOrderStatusTurso, 
  deleteOrderTurso 
} from '#lib/server/turso.js';

export async function GET() {
  try {
    await initDatabase();
    const orders = await getOrdersTurso();
    return json(orders);
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    await initDatabase();
    const body = await request.json();
    if (!body.customerName || !body.phone || !body.instrumentType) {
      return json({ error: 'Customer name, phone, and instrument type are required' }, { status: 400 });
    }
    const saved = await saveOrderTurso(body);
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
      return json({ error: 'Order ID and status are required' }, { status: 400 });
    }
    await updateOrderStatusTurso(id, status);
    return json({ success: true });
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE({ request }) {
  try {
    await initDatabase();
    const { id } = await request.json();
    if (!id) return json({ error: 'Order ID required' }, { status: 400 });
    await deleteOrderTurso(id);
    return json({ success: true });
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}
