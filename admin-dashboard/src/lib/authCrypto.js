/**
 * Cryptographic Utility for Admin Authentication
 * Uses Web Crypto API (SHA-256 with cryptographic salt)
 * Runs in both browser and Node.js environments
 */

export function generateSalt() {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback random salt
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function hashPassword(password, salt) {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + ':' + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Node.js crypto fallback
  try {
    const { createHash } = await import('node:crypto');
    return createHash('sha256').update(password + ':' + salt).digest('hex');
  } catch (e) {
    throw new Error('No crypto engine available to hash password');
  }
}

export async function verifyPassword(password, salt, expectedHash) {
  if (!password || !salt || !expectedHash) return false;
  const computedHash = await hashPassword(password, salt);
  return computedHash === expectedHash;
}
