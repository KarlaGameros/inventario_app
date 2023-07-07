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
      (this.estatu.id = null), (this.estatu.nombre = null);
    },

    //-----------------------------------------------------------
    async loadInformacionEstatus() {
      try {
        let resp = await api.get("/EstatusInventarios");
        let { data } = resp.data;
        let listEstatus = data.map((estatu) => {
          return {
            id: estatu.id,
            nombre: estatu.nombre,
          };
        });
        this.estatus = listEstatus;
      } catch (error) {
        console.log(error);
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
        console.log(error);
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
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    //carga el estatus con el id que se mando para mostrarlo y asi poder editarlo
    async loadEstatu(id) {
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
        console.log(error);
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
        console.log(error);
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
