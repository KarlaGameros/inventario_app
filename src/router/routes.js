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
