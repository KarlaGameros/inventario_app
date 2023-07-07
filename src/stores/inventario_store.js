import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useInventarioStore = defineStore("inventario", {
  state: () => ({
    modal: false,
    isEditar: false,
    listInventario: [],
    inventarios: [],
    inventario: {
      id: null,
      catalogo_id: null,
      estatus_id: null,
      bodega_id: null,
      clave: null,
      descripcion: null,
      nombre_corto: null,
      marca_id: null,
      numero_serie: null,
      modelo_id: null,
      color: null,
      qr: null,
      qr_url: null,
      pdf_url: null,
      eliminado: null,
      empleado_id: null,
      empleado_registro_id: null,
    },
  }),
  actions: {
    //-----------------------------------------------------------
    initInventario() {
      this.inventario.id = null;
    },

    //-----------------------------------------------------------
    async loadInventarios() {},

    //-----------------------------------------------------------
    actualizarModal(valor) {
      console.log("2", valor);
      this.modal = valor;
    },
  },
});
