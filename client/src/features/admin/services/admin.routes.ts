export const ADMIN_ROUTES = {
  users: '/users',
  roles: '/users/role',
  email: (id: string) => `/users/${encodeURIComponent(id)}/email`,
} as const;
