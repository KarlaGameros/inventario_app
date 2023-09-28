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
    detalleAsignaciones: {
      inventario_Id: null,
    },
    asignacion: {
      id: null,
      area_Id: null,
      empleado_Id: null,
      puesto_Id: null,
      puesto: null,
      eliminado: null,
      fecha_Asignacion: null,
      folio: null,
      asignacion_Id: null,
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
            folio: asignacion.folio,
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

    async loadAreasList(especial) {
      try {
        let resp = await api.get("/Areas/GetLista");
        let { data } = resp.data;
        let listAreas = data.map((area) => {
          return {
            label: area.label,
            value: area.value,
          };
        });
        if (especial == true) {
          listAreas.splice(0, 0, {
            value: 0,
            label: "Todos",
          });
        }
        this.areas = listAreas;
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

    async loadEmpleadosByArea(id, especial) {
      try {
        let detalle = await api.get(`/Empleados/ByArea/${id}`);
        let listEmpleados = detalle.data.data.map((detalle) => {
          return {
            puesto_Id: detalle.puesto_Id,
            label: `${detalle.nombres} ${detalle.apellido_Paterno} ${detalle.apellido_Materno}`,
            value: detalle.id,
            puesto: detalle.puesto,
          };
        });
        if (especial == true) {
          listEmpleados.splice(0, 0, {
            value: 0,
            label: "Todos",
          });
        }
        this.listEmpleados = listEmpleados;
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
          asignacion_Id: this.asignacion.id,
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
        let resp = await api.delete(`/DetalleAsignaciones/${id}`);
        if (resp.status == 200) {
          let { success, data } = resp.data;
          if (success === true) {
            return { success, data };
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrio un error, intentelo de nuevo",
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

    async loadAsignacion(id) {
      // this.asignacion = [];
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
        if (id == null) {
          let resp = await api.get(
            `/DetalleAsignaciones/BySolicitud/${this.asignacion.id}`
          );
          let { data } = resp.data;
          this.listaAsignacionInventario = data.map((asignacion) => {
            return {
              asignacion_Id: asignacion.id,
              clave: asignacion.inventario,
              descripcion: asignacion.descripcion,
              inventario_Id: asignacion.inventario_Id,
            };
          });
        } else {
          let resp = await api.get(`/DetalleAsignaciones/BySolicitud/${id}`);
          let { data } = resp.data;
          this.listaAsignacionInventario = data.map((asignacion) => {
            return {
              asignacion_Id: asignacion.id,
              clave: asignacion.inventario,
              descripcion: asignacion.descripcion,
              inventario_Id: asignacion.inventario_Id,
            };
          });
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async updateAsignacion(asignacion) {
      try {
        const resp = await api.put(
          `/AsignacionesInventarios/${asignacion.id}`,
          asignacion
        );
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

    async createDetalleAsignacion(detalle) {
      this.detalleAsignaciones.inventario_Id = detalle.value;
      try {
        let resp = await api.post(
          `/DetalleAsignaciones/${this.asignacion.id}`,
          this.detalleAsignaciones
        );
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
  },
});
