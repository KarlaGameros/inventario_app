import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useEstatusStore = defineStore("estatus", {
  state: () => ({
    modal: false,
    isEditar: false,
    listEstatus: [],
    estatus: [],
    estatu: {
      id: null,
      nombre: null,
    },
  }),
  actions: {
    //-----------------------------------------------------------
    initEstatus() {
      this.estatu.id = null;
      this.estatu.nombre = null;
    },

    //-----------------------------------------------------------
    async loadInformacionEstatus() {
      try {
        let resp = await api.get("/EstatusInventarios");
        let { data } = resp.data;
        let listEstatus = data.map((estatu) => {
          return {
            value: estatu.id,
            label: estatu.nombre,
          };
        });
        this.estatus = listEstatus;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async loadEstatusList(especial) {
      try {
        let resp = await api.get("/EstatusInventarios");
        let { data } = resp.data;

        let listEstatus = data.map((estatu) => {
          return {
            value: estatu.id,
            label: estatu.nombre,
          };
        });
        if (especial == true) {
          listEstatus.splice(0, 0, {
            value: 0,
            label: "Todos",
          });
        }
        this.estatus = listEstatus;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async createEstatu(estatu) {
      try {
        const resp = await api.post("/EstatusInventarios", estatu);
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
    async updateEstatus(estatu) {
      try {
        const resp = await api.put(`/EstatusInventarios/${estatu.id}`, estatu);
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
    async loadEstatus(id) {
      try {
        let resp = null;
        resp = await api.get(`/EstatusInventarios/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            this.estatu.id = data.id;
            this.estatu.nombre = data.nombre;
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
    async deleteEstatu(id) {
      try {
        const resp = await api.delete(`/EstatusInventarios/${id}`);
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
    updateEditar(valor) {
      this.isEditar = valor;
    },
  },
});
