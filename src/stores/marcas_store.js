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
      name: null,
    },
  }),
  actions: {
    initMarca() {
      this.marca.id = null;
      this.marca.nombre = null;
    },

    //-----------------------------------------------------------
    async loadInformacionMarca() {
      try {
        let resp = await fetch("api.json");
        let data = await resp.json();
        console.log("data", data);
        let listMarca = data.map((marca) => {
          return {
            id: marca.id,
            nombre: marca.name,
          };
        });
        this.marcas = listMarca;
      } catch (errror) {
        console.log(errror);
        return {
          success: false,
          data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async loadMarca(id) {},
    //-----------------------------------------------------------
    actualizarModal(valor) {
      this.modal = valor;
    },
  },
});
