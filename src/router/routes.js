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
      {
        path: "/proveedores",
        name: "proveedores",
        component: () => import("../modulos/proveedores/pages/IndexPage"),
      },
      {
        path: "/estatus",
        name: "estatus",
        component: () => import("../modulos/estatus/pages/IndexPage"),
      },
      {
        path: "/movimiento_inventario",
        name: "movimiento_inventario",
        component: () =>
          import("../modulos/movimientos_inventarios/pages/IndexPage"),
      },
      {
        path: "/mi_inventario",
        name: "mi_inventario",
        component: () => import("../modulos/mi_inventario/pages/IndexPage"),
      },
      {
        path: "/entrega_recepcion",
        name: "entrega_recepcion",
        component: () => import("../modulos/entrega_recepcion/pages/IndexPage"),
      },
      {
        path: "/historial_Inventario",
        name: "historial_Inventario",
        component: () => import("../modulos/historialProducto/pages/IndexPage"),
      },
      {
        path: "/tipos_Movimientos",
        name: "tipos_Movimientos",
        component: () => import("../modulos/tipos_Movimientos/pages/IndexPage"),
      },
      {
        path: "/notificaciones",
        name: "notificaciones",
        component: () =>
          import("../modulos/notificaciones/pages/IndexPage.vue"),
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
