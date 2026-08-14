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
};
