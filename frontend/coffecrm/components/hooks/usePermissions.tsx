'use client';

import { useMemo } from 'react';

interface ParsedToken {
  payload?: any;
}

function parseJwt(token: string | null): ParsedToken | null {
  if (!token) return null;
  try {
    const [, payloadEncoded] = token.split('.');
    if (!payloadEncoded) return null;
    const payload = JSON.parse(atob(payloadEncoded));
    return { payload };
  } catch (e) {
    console.error('Failed to parse token', e);
    return null;
  }
}

export function usePermissions() {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('access_token') : null;
  const parsed = useMemo(() => parseJwt(token), [token]);
  const role: string | null = parsed?.payload?.role ?? null;
  const userId: string | null = parsed?.payload?.sub ?? parsed?.payload?.id ?? null;

  // Basic permission rules
  const can = useMemo(() => ({
    isAdmin: role === 'ADMIN',
    isEditor: role === 'EDITE' || role === 'EDITOR' || role === 'MOD',
    isReader: role === 'READ',
    // Can edit users: admin or editor can edit any user; owner can edit themselves
    canEditUser: (targetUserId?: string) => {
      if (!role) return false;
      if (role === 'ADMIN') return true;
      if (role === 'EDITE' || role === 'EDITOR') return true;
      if (targetUserId && userId && targetUserId === userId) return true; // own profile
      return false;
    },
    // Can delete users: only admin
    canDeleteUser: (targetUserId?: string) => {
      if (!role) return false;
      if (role === 'ADMIN') return true;
      // don't allow editors/delete non-admin
      return false;
    },
    // Generic helpers for forms
    canEditResource: (resource: string, targetId?: string) => {
      // resource-based rules
      if (role === 'ADMIN') return true;
      if (resource === 'user') return (can.canEditUser(targetId));
      if (resource === 'role') return role === 'ADMIN'; // only admin can manage roles
      if (resource === 'customer') return (role === 'EDITE' || role === 'ADMIN');
      if (resource === 'product') return (role === 'EDITE' || role === 'ADMIN');
      if (resource === 'category') return (role === 'EDITE' || role === 'ADMIN');
      if (resource === 'order') return (role === 'EDITE' || role === 'ADMIN');
      if (resource === 'branch') return (role === 'EDITE' || role === 'ADMIN');
      if (resource === 'employee') return (role === 'EDITE' || role === 'ADMIN');
      if (resource === 'inventory') return (role === 'EDITE' || role === 'ADMIN');
      if (resource === 'booking') return (role === 'EDITE' || role === 'ADMIN');
      // fallback to editors
      return role === 'EDITE';
    },
    // Can delete resources: make deletions admin-only. Editors cannot delete.
    canDeleteResource: (resource: string, targetId?: string) => {
      if (!role) return false;
      // Admin is the only role allowed to delete sensitive resources
      if (role === 'ADMIN') return true;
      // No other role is allowed to delete by default
      return false;
    },
    // Can create resources: admin and editors can create most resources; readers cannot.
    canCreateResource: (resource: string) => {
      if (!role) return false;
      if (role === 'ADMIN') return true;
      // Editors can create many resources but not change roles
      if (role === 'EDITE' || role === 'EDITOR' || role === 'MOD') {
        if (resource === 'role') return false; // only admins manage roles
        return true;
      }
      // Read-only users cannot create
      return false;
    },
  }), [role, userId]);

  return {
    role,
    userId,
    ...can,
  };
}
