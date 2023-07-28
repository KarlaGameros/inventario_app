import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useMarcaStore = defineStore("marcas", {
  state: () => ({
    modal: false,
    isEditar: false,
    listMarca: [],
    marcas: [],
    marca: {
      id: null,
      clave: null,
      descripcion: null,
    },
  }),
  actions: {
    //-----------------------------------------------------------
    initMarca() {
      this.marca.id = null;
      this.marca.clave = null;
      this.marca.descripcion = null;
    },

    //-----------------------------------------------------------
    async loadInformacionMarca() {
      try {
        let resp = await api.get("/Marcas");
        let { data } = resp.data;
        let listMarca = data.map((marca) => {
          return {
            id: marca.id,
            clave: marca.clave,
            descripcion: marca.descripcion,
          };
        });
        this.marcas = listMarca;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async loadMarca(id) {
      try {
        let resp = null;
        resp = await api.get(`/Marcas/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            this.marca.id = data.id;
            this.marca.clave = data.clave;
            this.marca.descripcion = data.descripcion;
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
    async loadMarcaList() {
      try {
        let resp = await api.get("/Marcas/GetLista");
        let { data } = resp.data;
        let listMarca = data.map((marca) => {
          return {
            label: marca.label,
            value: marca.value,
          };
        });
        this.listMarca = listMarca;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async createMarca(marca) {
      try {
        const resp = await api.post("/Marcas", marca);
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
    async updateMarca(marca) {
      try {
        const resp = await api.put(`/Marcas/${marca.id}`, marca);
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
    async deleteMarca(id) {
      try {
        const resp = await api.delete(`/Marcas/${id}`);
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
