// src/routes.js

export const routes = {
  test: "/test",
  home: "/",
  login: "/login",
  forgotPassword: "/forgot-password",
  dashboard: "/dashboard",
  profile: "/profile",
  ownerVehicles: {
    list: "/owner/vehicles",
    create: "/owner/vehicles/create",
    view: (id) => `/owner/vehicles/${id}`,
    edit: (id) => `/owner/vehicles/${id}/edit`,
  },
  pendingVehicles: {
    list: "/admin/vehicles",
    view: (id) => `/admin/vehicles/${id}`,
  },
  pilots: {
    list: "/admin/pilots",
    create: "/admin/pilots/create",
    view: (id) => `/admin/pilots/${id}`,
    edit: (id) => `/admin/pilots/${id}/edit`,
  },
};
