const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      {
        path: "/marcas",
        name: "marcas",
        component: () => import("../modulos/marcas/pages/IndexPage"),
      },
      {
        path: "/bodegas",
        name: "bodegas",
        component: () => import("../modulos/bodegas/pages/IndexPage"),
      },
      {
        path: "/modelos",
        name: "modelos",
        component: () => import("../modulos/modelos/pages/IndexPage"),
      },
      {
        path: "/inventario",
        name: "inventario",
        component: () => import("../modulos/inventario/pages/IndexPage"),
      },
      {
        path: "/catalogos",
        name: "catalogos",
        component: () =>
          import("../modulos/catalogos_productos/pages/IndexPage"),
      },
      {
        path: "/asignaciones",
        name: "asignaciones",
        component: () => import("../modulos/asignaciones/pages/IndexPage"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
