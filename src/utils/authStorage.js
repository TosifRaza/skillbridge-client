/**
 * Role-Aware Auth Storage Utility
 * Allows Customer, Worker (Provider), and Admin portals to run simultaneously
 * in separate browser tabs without overwriting or redirecting each other on reload.
 */

export const getRoleFromPath = (pathname = '') => {
  if (pathname.startsWith('/worker')) return 'provider';
  if (pathname.startsWith('/customer')) return 'customer';
  if (pathname.startsWith('/admin')) return 'admin';
  return null;
};

export const getAuthForRole = (role) => {
  try {
    if (role === 'provider') {
      const token = localStorage.getItem('provider_accessToken');
      const user = localStorage.getItem('provider_user');
      if (token && user) return { token, user: JSON.parse(user) };
    } else if (role === 'customer') {
      const token = localStorage.getItem('customer_accessToken');
      const user = localStorage.getItem('customer_user');
      if (token && user) return { token, user: JSON.parse(user) };
    } else if (role === 'admin') {
      const token = localStorage.getItem('admin_accessToken');
      const user = localStorage.getItem('admin_user');
      if (token && user) return { token, user: JSON.parse(user) };
    }
  } catch (e) {
    console.error('getAuthForRole error:', e);
  }
  return null;
};

export const getActiveAuth = () => {
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  const role = getRoleFromPath(path);

  if (role) {
    const roleAuth = getAuthForRole(role);
    if (roleAuth) {
      return { token: roleAuth.token, user: roleAuth.user, role };
    }
  }

  // Fallback to legacy/general storage
  try {
    const token = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('skillbridge_user');
    if (token && userStr) {
      const user = JSON.parse(userStr);
      // Auto backfill role-specific storage
      if (user.role) {
        saveAuthForRole(user, token);
      }
      return { token, user, role: user.role };
    }
  } catch (e) {
    console.error('getActiveAuth error:', e);
  }

  return { token: null, user: null, role: null };
};

export const saveAuthForRole = (user, token) => {
  if (!user || !token) return;
  const role = user.role;

  if (role === 'customer') {
    localStorage.setItem('customer_accessToken', token);
    localStorage.setItem('customer_user', JSON.stringify(user));
  } else if (role === 'provider') {
    localStorage.setItem('provider_accessToken', token);
    localStorage.setItem('provider_user', JSON.stringify(user));
  } else if (role === 'admin') {
    localStorage.setItem('admin_accessToken', token);
    localStorage.setItem('admin_user', JSON.stringify(user));
  }

  // Keep legacy single-role keys for backward compatibility
  localStorage.setItem('accessToken', token);
  localStorage.setItem('skillbridge_user', JSON.stringify(user));
};

export const clearAuthForRole = (role) => {
  if (role === 'customer') {
    localStorage.removeItem('customer_accessToken');
    localStorage.removeItem('customer_user');
  } else if (role === 'provider') {
    localStorage.removeItem('provider_accessToken');
    localStorage.removeItem('provider_user');
  } else if (role === 'admin') {
    localStorage.removeItem('admin_accessToken');
    localStorage.removeItem('admin_user');
  }

  try {
    const legacyUser = JSON.parse(localStorage.getItem('skillbridge_user') || '{}');
    if (legacyUser.role === role) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('skillbridge_user');
    }
  } catch {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('skillbridge_user');
  }
};
