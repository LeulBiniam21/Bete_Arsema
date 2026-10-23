import { json } from '@sveltejs/kit';
import { 
  initDatabase, 
  getRolesTurso, 
  getRolePermissionsTurso 
} from '#lib/server/turso.js';

export async function GET({ url }) {
  try {
    await initDatabase();
    const roleId = url.searchParams.get('roleId');
    if (roleId) {
      const perms = await getRolePermissionsTurso(roleId);
      return json(perms);
    }
    const roles = await getRolesTurso();
    return json(roles);
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}
