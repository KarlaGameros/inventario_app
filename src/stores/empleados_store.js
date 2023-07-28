import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useEmpleadosStore = defineStore("empleados", {
  state: () => ({
    listEmpleados: [],
    empleados: [],
    empleado: {
      id: null,
      nombres: null,
      apellido_Materno: null,
      apellido_Paterno: null,
    },
  }),
  actions: {
    //-----------------------------------------------------------

    async loadEmpleadosList() {
      try {
        let resp = await api.get("/Empleados/GetLista");
        let { data } = resp.data;
        let listEmpleados = data.map((empleado) => {
          return {
            label: empleado.label,
            value: empleado.value,
          };
        });
        this.listEmpleados = listEmpleados;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
        };
      }
    },
  },
});
