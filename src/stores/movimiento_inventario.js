import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useMovimientoInventario = defineStore("movimiento_inventario", {
  state: () => ({
    modal: false,
  }),
  actions: {
    actualizarModal(valor) {
      this.modal = valor;
    },
  },
});
