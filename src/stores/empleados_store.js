import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useEmpleadosStore = defineStore("empleados", {
  state: () => ({
    listEmpleados: [],
    empleados: [],
    list_Areas: [],
    list_Empleados: [],
    personal_Id: null,
    empleado: {
      id: null,
      nombres: null,
      apellido_Materno: null,
      apellido_Paterno: null,
      puesto: null,
      puesto_Id: null,
      area_Id: null,
      area: null,
      tratamiento: null,
    },
  }),
  actions: {
    initEmpleado() {
      this.empleado.id = null;
      this.empleado.nombres = null;
      this.empleado.apellido_Materno = null;
      this.empleado.apellido_Paterno = null;
      this.empleado.puesto = null;
      this.empleado.puesto_Id = null;
      this.empleado.area_Id = null;
      this.empleado.area = null;
      this.empleado.tratamiento = null;
    },
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

    //-----------------------------------------------------------
    async loadResponsableByArea(id) {
      try {
        let resp = await api.get(`/Empleados/GetResponsableByArea/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            this.empleado.id = data.id;
            this.empleado.puesto = data.puesto;
            this.empleado.nombres = `${data.nombres} ${data.apellido_Paterno} ${data.apellido_Materno}`;
            this.empleado.puesto_Id = data.puesto_Id;
            this.empleado.area_Id = data.area_Id;
            this.empleado.area = data.area;
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
    async loadEmpleadoById(id) {
      try {
        let resp = await api.get(`/Empleados/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            this.empleado.id = data.id;
            this.empleado.puesto = data.puesto;
            this.empleado.nombres = `${data.nombres} ${data.apellido_Paterno} ${data.apellido_Materno}`;
            this.empleado.puesto_Id = data.puesto_Id;
            this.empleado.area_Id = data.area_Id;
            this.empleado.area = data.area;
            this.empleado.tratamiento = data.tratamiento;
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
    async loadAreasList() {
      try {
        let resp = await api.get("/Areas/GetLista");
        let { data } = resp.data;
        this.list_Areas = data.map((area) => {
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
        let resp = await api.get(`/Empleados/ByArea/${id}`);
        let { data } = resp.data;
        this.list_Empleados = data.map((detalle) => {
          return {
            puesto_Id: detalle.puesto_Id,
            label: `${detalle.nombres} ${detalle.apellido_Paterno} ${detalle.apellido_Materno}`,
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
