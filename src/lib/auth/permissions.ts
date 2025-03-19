// Permission types
export enum Permission {
  // Order permissions
  VIEW_ORDERS = 'view_orders',
  MANAGE_ORDERS = 'manage_orders',
  
  // Repair permissions
  VIEW_REPAIRS = 'view_repairs',
  MANAGE_REPAIRS = 'manage_repairs',
  ASSIGN_REPAIRS = 'assign_repairs',
  
  // User permissions
  VIEW_USERS = 'view_users',
  MANAGE_USERS = 'manage_users',
  
  // Content permissions
  VIEW_CONTENT = 'view_content',
  MANAGE_CONTENT = 'manage_content',
  
  // System permissions
  VIEW_REPORTS = 'view_reports',
  MANAGE_SETTINGS = 'manage_settings',
}

// User roles
export enum Role {
  ADMIN = 'admin',
  MANAGER = 'manager',
  TECHNICIAN = 'technician',
  SALES = 'sales',
  RECEPTIONIST = 'receptionist',
}

// Define permissions for each role
export const rolePermissions: Record<Role, Permission[]> = {
  [Role.ADMIN]: [
    // Admins have all permissions
    Permission.VIEW_ORDERS,
    Permission.MANAGE_ORDERS,
    Permission.VIEW_REPAIRS,
    Permission.MANAGE_REPAIRS,
    Permission.ASSIGN_REPAIRS,
    Permission.VIEW_USERS,
    Permission.MANAGE_USERS,
    Permission.VIEW_CONTENT,
    Permission.MANAGE_CONTENT,
    Permission.VIEW_REPORTS,
    Permission.MANAGE_SETTINGS,
  ],
  [Role.MANAGER]: [
    // Managers have most permissions except some sensitive user management
    Permission.VIEW_ORDERS,
    Permission.MANAGE_ORDERS,
    Permission.VIEW_REPAIRS,
    Permission.MANAGE_REPAIRS,
    Permission.ASSIGN_REPAIRS,
    Permission.VIEW_USERS,
    Permission.VIEW_CONTENT,
    Permission.MANAGE_CONTENT,
    Permission.VIEW_REPORTS,
  ],
  [Role.TECHNICIAN]: [
    // Technicians focus on repairs
    Permission.VIEW_REPAIRS,
    Permission.MANAGE_REPAIRS,
  ],
  [Role.SALES]: [
    // Sales staff focus on orders
    Permission.VIEW_ORDERS,
    Permission.MANAGE_ORDERS,
    Permission.VIEW_CONTENT,
  ],
  [Role.RECEPTIONIST]: [
    // Receptionists have limited view permissions
    Permission.VIEW_ORDERS,
    Permission.VIEW_REPAIRS,
    Permission.VIEW_USERS,
  ],
};

// Helper function to check if a user with a given role has a specific permission
export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) || false;
}

// User type with role and permissions
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

// Helper to get all permissions for a user
export function getUserPermissions(user: User): Permission[] {
  return rolePermissions[user.role] || [];
}

// Sample staff members for development/testing
export const sampleStaff: User[] = [
  {
    id: '1',
    name: '管理员',
    email: 'admin@mumabike.com',
    role: Role.ADMIN,
  },
  {
    id: '2',
    name: '店长',
    email: 'manager@mumabike.com',
    role: Role.MANAGER,
  },
  {
    id: '3',
    name: '技师小王',
    email: 'tech1@mumabike.com',
    role: Role.TECHNICIAN,
  },
  {
    id: '4',
    name: '技师小李',
    email: 'tech2@mumabike.com',
    role: Role.TECHNICIAN,
  },
  {
    id: '5',
    name: '销售小张',
    email: 'sales1@mumabike.com',
    role: Role.SALES,
  },
  {
    id: '6',
    name: '前台小刘',
    email: 'receptionist@mumabike.com',
    role: Role.RECEPTIONIST,
  },
]; 