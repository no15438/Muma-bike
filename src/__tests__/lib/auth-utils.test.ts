import { hasPermission, Role, Permission, getUserPermissions } from '@/lib/auth/permissions';
import { isAdmin } from '@/lib/auth/auth-utils';

// 模拟prisma客户端
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn()
    }
  }
}));

import { prisma } from '@/lib/prisma';

describe('Auth Utils', () => {
  describe('hasPermission function', () => {
    it('should return true when user has the permission', () => {
      // Admin should have all permissions
      expect(hasPermission(Role.ADMIN, Permission.VIEW_USERS)).toBe(true);
      expect(hasPermission(Role.ADMIN, Permission.MANAGE_SETTINGS)).toBe(true);
      
      // Manager should have specific permissions
      expect(hasPermission(Role.MANAGER, Permission.VIEW_ORDERS)).toBe(true);
      expect(hasPermission(Role.MANAGER, Permission.MANAGE_REPAIRS)).toBe(true);
      
      // Technician should have repair-related permissions
      expect(hasPermission(Role.TECHNICIAN, Permission.VIEW_REPAIRS)).toBe(true);
      expect(hasPermission(Role.TECHNICIAN, Permission.MANAGE_REPAIRS)).toBe(true);
    });

    it('should return false when user does not have the permission', () => {
      // Technician should not have order management permissions
      expect(hasPermission(Role.TECHNICIAN, Permission.MANAGE_ORDERS)).toBe(false);
      
      // Sales should not have user management permissions
      expect(hasPermission(Role.SALES, Permission.MANAGE_USERS)).toBe(false);
      
      // Receptionist should not have settings permissions
      expect(hasPermission(Role.RECEPTIONIST, Permission.MANAGE_SETTINGS)).toBe(false);
    });

    it('should handle invalid or undefined roles/permissions', () => {
      // @ts-ignore - Testing invalid inputs
      expect(hasPermission(undefined, Permission.VIEW_ORDERS)).toBe(false);
      
      // @ts-ignore - Testing invalid inputs
      expect(hasPermission(Role.ADMIN, undefined)).toBe(false);
      
      // @ts-ignore - Testing invalid inputs
      expect(hasPermission('invalid-role', 'invalid-permission')).toBe(false);
    });
  });

  describe('getUserPermissions function', () => {
    it('should return all permissions for admin role', () => {
      const user = { id: '1', name: 'Admin', email: 'admin@example.com', role: Role.ADMIN };
      const permissions = getUserPermissions(user);
      
      expect(permissions).toContain(Permission.VIEW_USERS);
      expect(permissions).toContain(Permission.MANAGE_USERS);
      expect(permissions).toContain(Permission.MANAGE_SETTINGS);
      expect(permissions.length).toBeGreaterThan(5); // Admin should have many permissions
    });
    
    it('should return limited permissions for receptionist role', () => {
      const user = { id: '1', name: 'Front Desk', email: 'front@example.com', role: Role.RECEPTIONIST };
      const permissions = getUserPermissions(user);
      
      expect(permissions).toContain(Permission.VIEW_ORDERS);
      expect(permissions).toContain(Permission.VIEW_REPAIRS);
      expect(permissions).not.toContain(Permission.MANAGE_SETTINGS);
      expect(permissions.length).toBeLessThan(5); // Receptionist should have limited permissions
    });
    
    it('should return empty array for invalid role', () => {
      // @ts-ignore - Testing invalid role
      const user = { id: '1', name: 'Test', email: 'test@example.com', role: 'invalid-role' };
      const permissions = getUserPermissions(user);
      
      expect(permissions).toEqual([]);
    });
  });

  describe('isAdmin function', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    
    it('should return true for admin users', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        isStaff: true
      });
      
      const result = await isAdmin('1');
      expect(result).toBe(true);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        select: { isStaff: true }
      });
    });
    
    it('should return false for non-admin users', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: '2',
        isStaff: false
      });
      
      const result = await isAdmin('2');
      expect(result).toBe(false);
    });
    
    it('should return false when user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      
      const result = await isAdmin('999');
      expect(result).toBe(false);
    });
    
    it('should handle database errors', async () => {
      (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      const result = await isAdmin('1');
      expect(result).toBe(false);
    });
  });
}); 