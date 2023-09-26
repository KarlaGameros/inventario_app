import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useAsignacionStore = defineStore("asignacion", {
  state: () => ({
    modal: false,
    modalVale: false,
    isEditar: false,
    isShow: false,
    rutaVale: null,
    asignaciones: [],
    listaAsignacionInventario: [],
    listEmpleados: [],
    listFiltroAsignaciones: [],
    areas: [],
    puestos: [],
    empleado_Id: null,
    asignacion: {
      id: null,
      area_Id: null,
      empleado_Id: null,
      puesto_Id: null,
      puesto: null,
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

    updateEditar(valor) {
      this.isEditar = valor;
    },

    updateVisualizar(valor) {
      this.isShow = valor;
    },

    initAsignacion() {
      this.asignacion.id = null;
      this.asignacion.area_Id = null;
      this.asignacion.empleado_Id = null;
      this.asignacion.puesto_Id = null;
      this.asignacion.estatus_Id = null;
      this.asignacion.fecha_Asignacion = null;
      this.asignacion.fecha_Registro = null;
      this.isEditar = false;
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
        this.areas = data.map((area) => {
          return {
            label: area.label,
            value: area.value,
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

    async loadPuestosList() {
      try {
        let resp = await api.get("/Puestos/GetLista");
        let { data } = resp.data;
        this.puestos = data.map((puesto) => {
          return {
            label: puesto.label,
            value: puesto.value,
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

    async loadEmpleadosByArea(id) {
      try {
        let detalle = await api.get(`/Empleados/ByArea/${id}`);
        this.listEmpleados = detalle.data.data.map((detalle) => {
          return {
            puesto_Id: detalle.puesto_Id,
            label: `${detalle.nombres} ${detalle.apellido_Paterno} ${detalle.apellido_Materno}`,
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
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------

    async cancelarAsignacion(id) {
      try {
        const resp = await api.get(`/AsignacionesInventarios/Cancelar/${id}`);
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
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            this.asignacion.id = data.id;
            this.asignacion.area_Id = data.area_Id;
            this.asignacion.area = data.area;
            this.asignacion.estatus = data.estatus;
            this.asignacion.empleado_Id = data.empleado_Id;
            this.asignacion.empleado = data.empleado;
            this.asignacion.fecha_Asignacion = data.fecha_Asignacion;
            this.asignacion.fecha_Registro = data.fecha_Registro;
            this.asignacion.folio = data.folio;
            this.asignacion.puesto = data.puesto;
            this.asignacion.puesto_Id = data.puesto_Id;

            return { success };
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
        let { data } = resp.data;
        this.listaAsignacionInventario = data.map((asignacion) => {
          return {
            clave: asignacion.inventario.clave,
            descripcion: asignacion.inventario.descripcion,
            inventario_Id: asignacion.inventario.id,
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
    async updateAsignacion(id) {
      try {
        const resp = await api.put(`/AsignacionesInventarios/${id}`);
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
    async asignacionByEmpleado(id) {
      try {
        const resp = await api.get(
          `/AsignacionesInventarios/GetByEmpleado/${id}`
        );
        let { data } = resp.data;
        console.log(data);
        this.listaAsignacionInventario = data.map((asignacion) => {
          return {
            empleado: asignacion.empleado,
            puesto: asignacion.puesto,
            estatus: asignacion.estatus,
            fecha_Asignacion: asignacion.fecha_Asignacion,
            fecha_Registro: asignacion.fecha_Registro,
          };
        });
        console.log(this.listaAsignacionInventario);
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },
  },
});
