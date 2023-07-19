import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useModeloStore = defineStore("modelos", {
  state: () => ({
    modal: false,
    isEditar: false,
    listModelo: [],
    modelos: [],
    marca_id: null,
    modelos: [],
    modelo: {
      id: null,
      marca_id: null,
      clave: null,
      descripcion: null,
    },
  }),
  actions: {
    //-----------------------------------------------------------
    initModelo() {
      this.modelo.id = null;
      this.modelo.clave = null;
      this.modelo.marca_id = null;
      this.modelo.descripcion = null;
    },

    //-----------------------------------------------------------
    async loadInformacionModelo() {
      try {
        let resp = await api.get("/Modelos");
        let { data } = resp.data;
        let listModelo = data.map((modelo) => {
          return {
            id: modelo.id,
            clave: modelo.clave,
            descripcion: modelo.descripcion,
            marca_Id: modelo.marca_Id,
          };
        });
        this.modelos = listModelo;
      } catch (error) {
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async loadModelo(id) {
      try {
        let resp = null;
        resp = await api.get(`/Modelos/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.modelo.id = data.id;
            this.modelo.clave = data.clave;
            this.modelo.descripcion = data.descripcion;
            this.modelo.marca_id = data.marca_Id;
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
    async loadModeloList() {
      try {
        let resp = await api.get("/Modelos/GetLista");
        let { data } = resp.data;
        let listModelo = data.map((modelo) => {
          return {
            label: modelo.label,
            value: modelo.value,
          };
        });
        this.listModelo = listModelo;
      } catch (error) {
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async modeloByMarca(id) {
      this.marca_id = id;
      try {
        let detalle = await api.get(`/Modelos/ByMarca/${id}`);
        this.listModelo = detalle.data.data.map((detalle) => {
          return {
            label: `${detalle.clave} - ${detalle.descripcion}`,
            value: detalle.id,
          };
        });
      } catch (error) {
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------

    async createModelo(modelo) {
      try {
        modelo.marca_Id = this.marca_id;
        const resp = await api.post(`/Modelos`, modelo);
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
    async updateModelo(modelo) {
      try {
        const resp = await api.put(`/Modelos/${modelo.id}`, modelo);
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
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      } catch (error) {
        console.group(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async deleteModelo(id) {
      try {
        const resp = await api.delete(`/Modelos/${id}`);
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
            data: "Ocurrio un error, intentelo de nuevo",
          };
        }
      } catch (error) {
        console.log(error);
        return {
          success: false,
          data: "Ocurrio un error, intentelo de nuevo",
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
