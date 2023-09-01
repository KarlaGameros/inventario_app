import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useEntregaRecepcionStore = defineStore("entrega-recepcion", {
  state: () => ({
    modal: false,
    modalVerInventario: false,
    areas: [],
    listEmpleados: [],
  }),
  actions: {
    actualizarModal(valor) {
      this.modal = valor;
    },
    actualizarModalVerInventario(valor) {
      this.modalVerInventario = valor;
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

    async loadEmpleadosByArea(id) {
      try {
        let detalle = await api.get(`/Empleados/ByArea/${id}`);

        this.listEmpleados = detalle.data.data.map((detalle) => {
          return {
            puesto_Id: detalle.puesto_Id,
            label: detalle.nombre_Completo,
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
  },
});
