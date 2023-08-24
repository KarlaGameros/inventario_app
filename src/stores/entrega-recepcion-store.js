import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useEntregaRecepcionStore = defineStore("entrega-recepcion", {
  state: () => ({
    modal: false,
  }),
  actions: {
    actualizarModal(valor) {
      this.modal = valor;
    },
  },
});
