import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useAsignacionStore = defineStore("asignacion", {
  state: () => ({
    modal: false,
    asignaciones: [],
    asignacion: {
      id: null,
      empleado_Id: null,
      puesto_Id: null,
      estatus: null,
      fecha_Registro: null,
      eliminado: null,
      fecha_Asignacion: null,
    },
  }),
  actions: {
    actualizarModal(valor) {
      this.modal = valor;
    },
  },
});
