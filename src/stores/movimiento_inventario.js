import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useMovimientoInventario = defineStore("movimiento_inventario", {
  state: () => ({
    modal: false,
    listaMovimientoInventario: [],
    listTipoMovimientos: [],
    listConceptoMovimiento: [],
    movimientos: [],
    movimiento: {
      id: null,
    },
  }),
  actions: {
    initMovimiento() {
      this.movimiento.id = null;
    },
    //-----------------------------------------------------------

    async addMovimiento(id) {
      try {
        this.listaMovimientoInventario.push({
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
        let nIndex = this.listaMovimientoInventario.findIndex(
          (x) => x.inventario_Id == id
        );

        this.listaMovimientoInventario.splice(nIndex, 1);
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
    async loadTipoMovimientos() {
      try {
        let resp = await api.get("/TiposMovimientosInventarios");
        let { data } = resp.data;
        this.listTipoMovimientos = data.map((tipo) => {
          return {
            value: tipo.id,
            label: tipo.tipo_Movimiento,
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
    async loadConceptoMovimientoListFiltro(filtro) {
      try {
        let resp = await api.get("/ConceptosMovimientosInventarios");
        let { data } = resp.data;
        let listData = data.filter(
          (x) => x.tipo_Movimiento_Inventario == filtro
        );
        this.listConceptoMovimiento = listData.map((concepto) => {
          return {
            label: concepto.concepto,
            value: concepto.id,
          };
        });
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },
    //-----------------------------------------------------------
    actualizarModal(valor) {
      this.modal = valor;
    },
  },
});
