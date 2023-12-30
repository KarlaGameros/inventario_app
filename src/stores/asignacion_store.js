import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useAsignacionStore = defineStore("asignacion", {
  state: () => ({
    modal: false,
    modalVale: false,
    modalValeBodega: false,
    isByBodega: false,
    isEditar: false,
    isShow: false,
    rutaVale: null,
    asignaciones: [],
    listaAsignacionInventario: [],
    listInventarioByBodega: [],
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
      area: null,
      empleado_Id: null,
      empleado: null,
      puesto_Id: null,
      puesto: null,
      eliminado: null,
      fecha_Asignacion: null,
      folio: null,
      tipo: null,
      detalle: [],
    },
    inventario: {
      id: null,
      estatus: null,
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

    updateIsBodega(valor) {
      this.isByBodega = valor;
    },

    actualizarModalValeBodega(valor) {
      this.modalValeBodega = valor;
    },
    initAsignacion() {
      this.asignacion.id = null;
      this.asignacion.area_Id = null;
      this.asignacion.area = null;
      this.asignacion.empleado_Id = null;
      this.asignacion.empleado = null;
      this.asignacion.puesto_Id = null;
      this.asignacion.puesto = null;
      this.asignacion.estatus = null;
      this.asignacion.fecha_Asignacion = null;
      this.asignacion.fecha_Registro = null;
      this.asignacion.folio = null;
      this.tipo = null;
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
            tipo: asignacion.tipo,
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

    async addInventario(id, inventario) {
      try {
        this.listaAsignacionInventario.push({
          asignacion_Id: id,
          inventario_Id: inventario.value,
          nombre_producto: inventario.label,
          descripcion: inventario.descripcion,
          clave: inventario.clave,
        });
        this.listaAsignacionInventario.sort((a, b) =>
          a.clave.localeCompare(b.clave)
        );
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
          const { data, success, fecha, id } = resp.data;
          if (success === true) {
            return { success, data, fecha, id };
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
        if (id == null) {
          let nIndex = this.listaAsignacionInventario.findIndex(
            (x) => x.inventario_Id == id
          );
          this.listaAsignacionInventario.splice(nIndex, 1);
          return { success: true, data: "Se elimino de la lista" };
        } else {
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
            this.asignacion.tipo = data.tipo;
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
            id: asignacion.id,
            asignacion_Id: asignacion.asignacion_Id,
            clave: asignacion.inventario,
            descripcion: asignacion.descripcion,
            inventario_Id: asignacion.inventario_Id,
            inventario: asignacion.inventario,
            numero_Serie: asignacion.numero_Serie,
            marca: asignacion.marca,
            modelo: asignacion.modelo,
            color: asignacion.color,
            importe: asignacion.importe,
          };
        });
        this.listaAsignacionInventario.sort((a, b) =>
          a.clave.localeCompare(b.clave)
        );
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async deleteDetalle(id, idasignacion) {
      try {
        let resp = await api.delete(`/DetalleAsignaciones/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            let resp = await api.get(
              `/DetalleAsignaciones/BySolicitud/${idasignacion}`
            );
            let { data } = resp.data;
            this.listaAsignacionInventario = data.map((asignacion) => {
              return {
                id: asignacion.id,
                asignacion_Id: asignacion.asignacion_Id,
                clave: asignacion.inventario,
                descripcion: asignacion.descripcion,
                inventario_Id: asignacion.inventario_Id,
              };
            });
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

    //-----------------------------------------------------------

    async createDetalleAsignacion(id, detalle) {
      try {
        const resp = await api.post(`/DetalleAsignaciones/${id}`, detalle);
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

    async valeByBodega(id, fecha) {
      try {
        let resp = await api.get(`/Inventarios/Imprimir/${id}/${fecha}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.listInventarioByBodega = data.map((inventario) => {
              return {
                clave: inventario.clave,
                descripcion: inventario.descripcion,
                numero_Serie: inventario.numero_Serie,
                marca: inventario.marca,
                modelo: inventario.modelo,
                color: inventario.color,
                importe: inventario.importe,
                impreso: inventario.impreso,
                fecha_Registro: inventario.fecha_Registro,
              };
            });
          }
        } else {
          return {
            success: false,
            data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
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

    async inventariosByFecha(fecha) {
      try {
        let resp = await api.get(`/Inventarios/GetByFecha/${fecha}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.listInventarioByBodega = data.map((inventario) => {
              return {
                id: inventario.id,
                clave: inventario.clave,
                descripcion: inventario.descripcion,
                numero_Serie: inventario.numero_Serie,
                marca: inventario.marca,
                modelo: inventario.modelo,
                color: inventario.color,
                importe: inventario.importe,
              };
            });
            return { success };
          }
        } else {
          return {
            success: false,
            data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
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
  },
});
