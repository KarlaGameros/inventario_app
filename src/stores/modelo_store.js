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
      marca_id: null,
      nombre: null,
    },
  }),
  actions: {
    initModelo() {
      this.modelo.id = null;
      this.modelo.nombre = null;
      this.modelo.marca_id = null;
    },

    //-----------------------------------------------------------
    async loadInformacionModelo() {
      try {
        let resp = await fetch("apiModelo.json");
        let data = await resp.json();
        console.log("data", data);
        let listModelo = data.map((modelo) => {
          return {
            id: modelo.id,
            nombre: modelo.name,
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
    actualizarModal(valor) {
      this.modal = valor;
    },
  },
});
