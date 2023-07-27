import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useAsignacionStore = defineStore("asignacion", {
  state: () => ({
    modal: false,
    modalVale: false,
    isEditar: false,
    rutaVale: null,
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
      eliminado: null,
      fecha_Asignacion: null,
      folio: null,
      detalle: [],
    },
  }),
  actions: {
    actualizarModal(valor) {
      this.modal = valor;
    },

    actualizarModalVale(valor) {
      this.modalVale = valor;
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

    async loadInformacionAsignaciones() {
      try {
        let resp = await api.get("/AsignacionesInventarios");
        let { data } = resp.data;

        let listaAsignacionInventario = data.map((asignacion) => {
          return {
            id: asignacion.id,
            area_Id: asignacion.area_Id,
            area: asignacion.area,
            empleado_Id: asignacion.empleado_Id,
            empleado: asignacion.empleado,
            puesto: asignacion.puesto,
            estatus: asignacion.estatus,
            fecha_Registro: asignacion.fecha_Registro,
            fecha_Asignacion: asignacion.fecha_Asignacion,
          };
        });
        this.asignaciones = listaAsignacionInventario;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
        };
      }
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
            puesto_Id: detalle.puesto_Id,
            label: detalle.nombre_Completo,
            value: detalle.id,
            puesto: detalle.puesto,
          };
        });
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

    async createAsignacion(asignacion) {
      try {
        const resp = await api.post("/AsignacionesInventarios", asignacion);
        if (resp.status == 200) {
          const { data, success } = resp.data;
          if (success === true) {
            return { success, data };
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------

    async afectarAsignacion(id) {
      try {
        const resp = await api.get(`/AsignacionesInventarios/Afectar/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            return { success, data };
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------

    async cancelarAsignacion(id) {
      console.log("id", id);
      try {
        const resp = await api.get(`/AsignacionesInventarios/Cancelar/${id}`);
        console.log("resp", resp);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            return { success, data };
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
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

    //-----------------------------------------------------------

    async loadAsignacion(id) {
      this.asignacion = [];
      try {
        let resp = await api.get(`/AsignacionesInventarios/${id}`);
        console.log("load", resp);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.asignacion.id = data.id;
            this.asignacion.area_Id = data.area_Id;
            this.asignacion.empleado_Id = data.empleado_Id;
            this.asignacion.puesto_Id = data.puesto_Id;
            this.asignacion.fecha_Asignacion = data.fecha_Asignacion;
            this.asignacion.fecha_Registro = data.fecha_Registro;
            this.asignacion.empleado = data.empleado;
            this.asignacion.area = data.area;
            this.asignacion.puesto = data.puesto;
            this.asignacion.folio = data.folio;
            //this.detalleAsignacion(data.id);
            console.log("asignacion", this.asignacion);
            return { success, data };
          }
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------

    async detalleAsignacion(id) {
      try {
        let resp = await api.get(`/DetalleAsignaciones/BySolicitud/${id}`);
        console.log("resp detalle", resp);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.asignacion.detalle = data;
          }
        }
      } catch (error) {}
    },
  },
});
