import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useAsignacionStore = defineStore("asignacion", {
  state: () => ({
    modal: false,
    asignaciones: [],
    listaAsignacionInventario: [],
    listEmpleados: [],
    areas: [],
    puestos: [],
    empleado_Id: null,
    asignacion: {
      id: null,
      area_Id: null,
      empleado_Id: null,
      puesto_Id: null,
      estatus_Id: null,
      fecha_Registro: null,
      eliminado: null,
      fecha_Asignacion: null,
    },
  }),
  actions: {
    actualizarModal(valor) {
      this.modal = valor;
    },

    initAsignacion() {
      this.asignacion.id = null;
      this.asignacion.area_Id = null;
      this.asignacion.empleado_Id = null;
      this.asignacion.puesto_Id = null;
      this.asignacion.estatus_Id = null;
      this.asignacion.fecha_Asignacion = null;
      this.asignacion.fecha_Registro = null;
      this.listaAsignacionInventario = [];
    },

    //-----------------------------------------------------------

    async loadAreasList() {
      try {
        let resp = await api.get("/Areas/GetLista");
        let { data } = resp.data;
        let listaArea = data.map((area) => {
          return {
            label: area.label,
            value: area.value,
          };
        });
        this.areas = listaArea;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------

    async loadPuestosList() {
      try {
        let resp = await api.get("/Puestos/GetLista");
        let { data } = resp.data;
        let listaPuesto = data.map((puesto) => {
          return {
            label: puesto.label,
            value: puesto.value,
          };
        });
        this.puestos = listaPuesto;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------

    async loadEmpleadosByArea(id) {
      try {
        let detalle = await api.get(`/Empleados/ByArea/${id}`);

        this.listEmpleados = detalle.data.data.map((detalle) => {
          return {
            label: detalle.nombre_Completo,
            value: detalle.id,
            puesto: detalle.puesto,
          };
        });

        console.log("lis", this.listEmpleados);
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------

    async addInventario(id) {
      try {
        console.log("request", id);
        this.listaAsignacionInventario.push({
          inventario_Id: id.value,
          nombre_producto: id.label,
          descripcion: id.descripcion,
          clave: id.clave,
        });
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async deleteProducto(id) {
      try {
        let nIndex = this.listaAsignacionInventario.findIndex(
          (x) => x.inventario_Id == id
        );

        this.listaAsignacionInventario.splice(nIndex, 1);
        console.log("eliminar", this.listaAsignacionInventario);
        return {
          success: true,
          data: "Producto eliminado de la lista",
        };
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },
  },
});
