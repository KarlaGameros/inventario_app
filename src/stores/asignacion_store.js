import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useAsignacionStore = defineStore("asignacion", {
  state: () => ({
    modal: false,
    asignaciones: [],
    areas: [],
    puestos: [],
    asignacion: {
      id: null,
      area_Id: null,
      empleado_Id: null,
      puesto_Id: null,
      estatus_Id: null,
      fecha_Registro: null,
      eliminado: null,
      fecha_Asignacion: null,
    },
  }),
  actions: {
    actualizarModal(valor) {
      this.modal = valor;
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
  },
});
