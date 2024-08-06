import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useTiposConceptosMovimientos = defineStore(
  "useTiposConceptosMovimientos",
  {
    state: () => ({
      modal: false,
      modalConceptos: false,
      list_Movimientos: [],
      list_Conceptos_Movimientos: [],
      movimiento: {
        id: null,
        tipo_Movimiento: null,
        naturaleza: null,
      },
      concepto: {
        tipo_Movimiento_Inventario_Id: null,
        concepto: null,
        descripcion: null,
      },
    }),
    actions: {
      //-----------------------------------------------------------
      initMovimiento() {
        this.movimiento.id = null;
        this.movimiento.tipo_Movimiento = null;
        this.movimiento.naturaleza = null;
      },

      initConcepto() {
        this.concepto.id = null;
        this.concepto.tipo_Movimiento_Inventario_Id = null;
        this.concepto.concepto = null;
        this.concepto.descripcion = null;
      },

      //-----------------------------------------------------------
      async loadTiposMovimientos() {
        try {
          let resp = await api.get("/TiposMovimientosInventarios");
          let { data } = resp.data;
          this.list_Movimientos = data.map((movimiento) => {
            return {
              id: movimiento.id,
              tipo_Movimiento: movimiento.tipo_Movimiento,
              naturaleza: movimiento.naturaleza,
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
      async loadMovimiento(id) {
        try {
          let resp = await api.get(`/TiposMovimientosInventarios/${id}`);
          if (resp.status == 200) {
            const { success, data } = resp.data;
            if (success == true) {
              this.movimiento.id = data.id;
              this.movimiento.tipo_Movimiento = data.tipo_Movimiento;
              this.movimiento.naturaleza = data.naturaleza;
            }
          }
        } catch (error) {
          return {
            success: false,
            data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
          };
        }
      },

      //-----------------------------------------------------------
      async createTipoMovimiento(movimiento) {
        try {
          const resp = await api.post(
            "/TiposMovimientosInventarios",
            movimiento
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
              data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
            };
          }
        } catch (error) {
          return {
            success: false,
            data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
          };
        }
      },

      //-----------------------------------------------------------
      async createConceptoMovimiento(concepto) {
        try {
          const resp = await api.post(
            "/ConceptosMovimientosInventarios",
            concepto
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
              data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
            };
          }
        } catch (error) {
          return {
            success: false,
            data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
          };
        }
      },

      //-----------------------------------------------------------
      async loadConceptosMovimientos(tipo_Movimiento) {
        try {
          this.list_Conceptos_Movimientos = [];
          let resp = await api.get("/ConceptosMovimientosInventarios");
          let { data } = resp.data;
          let filtro = data.filter(
            (x) => x.tipo_Movimiento_Inventario_Id == tipo_Movimiento
          );
          this.list_Conceptos_Movimientos = filtro.map((concepto) => {
            return {
              id: concepto.id,
              tipo_Movimiento_Inventario_Id:
                concepto.tipo_Movimiento_Inventario_Id,
              tipo_Movimiento_Inventario: concepto.tipo_Movimiento_Inventario,
              concepto: concepto.concepto,
              descripcion: concepto.descripcion,
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
      async deleteConcepto(id) {
        try {
          const resp = await api.delete(
            `/ConceptosMovimientosInventarios/${id}`
          );
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
              data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
            };
          }
        } catch (error) {
          return {
            success: false,
            data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
          };
        }
      },

      //-----------------------------------------------------------
      actualizarModal(valor) {
        this.modal = valor;
      },

      actualizarModalConceptos(valor) {
        this.modalConceptos = valor;
      },
    },
  }
);
