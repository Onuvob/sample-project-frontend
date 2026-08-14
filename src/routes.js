// src/routes.js

export const routes = {
  test: "/test",
  home: "/",
  login: "/login",
  forgotPassword: "/forgot-password",
  dashboard: "/dashboard",
  profile: "/profile",
  organizations: {
    list: "/organizations",
    create: "/organizations/create",
    view: (id) => `/organizations/${id}`,
    edit: (id) => `/organizations/${id}/edit`,
  },
  businesses: {
    list: "/businesses",
    create: "/businesses/create",
    view: (id) => `/businesses/${id}`,
    edit: (id) => `/businesses/${id}/edit`,
  },
  branches: {
    list: "/branches",
    create: "/branches/create",
    view: (id) => `/branches/${id}`,
    edit: (id) => `/branches/${id}/edit`,
  },
  users: {
    list: "/users",
    create: "/users/create",
    view: (id) => `/users/${id}`,
    edit: (id) => `/users/${id}/edit`,
  },
  products: {
    list: "/products",
    create: "/products/create",
    view: (id) => `/products/${id}`,
    edit: (id) => `/products/${id}/edit`,
  },
  tasks: {
    list: "/tasks",
    create: "/tasks/create",
    view: (id) => `/tasks/${id}`,
    edit: (id) => `/tasks/${id}/edit`,
  },
  userAccess: {
    resourcePermissions: "/user-access/resource-permissions",
    menus: {
      list: "/user-access/menus",
      create: "/user-access/menus/create",
      view: (id) => `/user-access/menus/${id}`,
      edit: (id) => `/user-access/menus/${id}/edit`,
    },
    roles: {
      list: "/user-access/roles",
      create: "/user-access/roles/create",
      view: (id) => `/user-access/roles/${id}`,
      edit: (id) => `/user-access/roles/${id}/edit`,
    },
    permissions: {
      list: "/user-access/permissions",
      create: "/user-access/permissions/create",
      view: (id) => `/user-access/permissions/${id}`,
      edit: (id) => `/user-access/permissions/${id}/edit`,
    },
  },
  organization: {
    products: {
      list: "/organization/products",
      create: "/organization/products/create",
      view: (id) => `/organization/products/${id}`,
      edit: (id) => `/organization/products/${id}/edit`,
    },
    tasks: {
      list: "/organization/tasks",
      create: "/organization/tasks/create",
      view: (id) => `/organization/tasks/${id}`,
      edit: (id) => `/organization/tasks/${id}/edit`,
    },
    packages: {
      list: "/organization/packages",
      create: "/organization/packages/create",
      view: (packageId) => `/organization/packages/${packageId}`,
      edit: (packageId) => `/organization/packages/${packageId}/edit`,

      version: {
        create: (packageId) => `/organization/packages/${packageId}/version/create`,
        view: (packageId, versionId) => `/organization/packages/${packageId}/version/${versionId}`,
        edit: (packageId, versionId) => `/organization/packages/${packageId}/version/${versionId}/edit`,
      },
    },
  },
  branch: {
    products: {
      list: "/branch/products",
      create: "/branch/products/create",
      view: (id) => `/branch/products/${id}`,
      edit: (id) => `/branch/products/${id}/edit`,
    },
    packages: {
      list: "/branch/packages",
      create: "/branch/packages/create",
      view: (id) => `/branch/packages/${id}`,
      edit: (id) => `/branch/packages/${id}/edit`,
    },
    slots: {
      list: "/branch/slots",
      create: "/branch/slots/create",
      view: (id) => `/branch/slots/${id}`,
      edit: (id) => `/branch/slots/${id}/edit`,
    },
  },
  reservations: {
    list: "/reservations",
    create: "/reservations/create",
    view: (id) => `/reservations/${id}`,
    edit: (id) => `/reservations/${id}/edit`,
  },
  invoices: {
    list: "/invoices",
    create: "/invoices/create",
    view: (id) => `/invoices/${id}`,
    edit: (id) => `/invoices/${id}/edit`,
  },
};
