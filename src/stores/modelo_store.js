import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useModeloStore = defineStore("modelos", {
  state: () => ({
    modal: false,
    isEditar: false,
    listModelo: [],
    modelos: [],
    marcas: [],
    modelo: {
      id: null,
      marca_Id: null,
      clave: null,
      descripcion: null,
    },
  }),
  actions: {
    initModelo() {
      this.modelo.id = null;
      this.modelo.nombre = null;
      this.modelo.marca_Id = null;
      this.modelo.descripcion = null;
    },

    //-----------------------------------------------------------
    async loadInformacionModelo() {
      try {
        let resp = await api.get("/Modelos");
        let { data } = resp.data;
        console.log("data", data);
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
    async createModelo(modelo) {
      try {
        console.log("modelo", modelo);
        const resp = await api.post(`/Modelos`, modelo);
        console.log("create modelo", resp);
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
    actualizarModal(valor, props, clave) {
      this.modal = valor;
      this.marcas = clave;
      this.modelo.marca_Id = props;
    },
  },
});
