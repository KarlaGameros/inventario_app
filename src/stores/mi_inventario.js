import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useMiInventarioStore = defineStore("mi_inventario", {
  state: () => ({
    listMiInventario: [],
    nombre_completo: null,
    miInventario: {
      id: null,
      descripcion: null,
      clave: null,
      catalogo: null,
      bodega: null,
      marca: null,
      modelo: null,
      numero_serie: null,
      color: null,
      empleado: null,
      importe: null,
      area: null,
      nombre_completo: null,
      area: null,
      nombres: null,
      apellido_Paterno: null,
      apellido_Materno: null,
      puesto: null,
    },
  }),
  actions: {
    //-----------------------------------------------------------

    async loadMiInventario() {
      try {
        let resp = await api.get("/Inventarios/MiInventario");
        let { data } = resp.data;
        this.listMiInventario = data.map((miInventario) => {
          return {
            id: miInventario.id,
            descripcion: miInventario.descripcion,
            clave: miInventario.clave,
            catalogo: miInventario.catalago,
            bodega: miInventario.bodega,
            marca: miInventario.marca,
            modelo: miInventario.modelo,
            numero_Serie: miInventario.numero_Serie,
            color: miInventario.color,
            importe:
              miInventario.importe == null
                ? "SIN IMPORTE"
                : `$${miInventario.importe}`,
            empleado: miInventario.empleado,
            empleado_Id: miInventario.empleado_Id,
          };
        });
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------

    async loadUser() {
      try {
        let resp = await api.get("/Empleados/ByUsuario");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            this.miInventario.nombre_completo = data.nombre_Completo;
            this.miInventario.area = data.area;
            this.miInventario.nombres = data.nombres;
            this.miInventario.apellido_Paterno = data.apellido_Paterno;
            this.miInventario.apellido_Materno = data.apellido_Materno;
            this.miInventario.puesto = data.puesto;
          }
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },
  },
});
