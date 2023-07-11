import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useInventarioStore = defineStore("inventario", {
  state: () => ({
    modal: false,
    isEditar: false,
    isConsulta: false,
    isSurtit: false,
    cantidad: null,
    listInventario: [],
    inventarios: [],
    listaNumeroSerie: [],
    numeroSerie: {
      id: null,
      cantidad: null,
      catalogo_id: null,
    },
    inventario: {
      id: null,
      catalogo_id: null,
      estatus_id: null,
      bodega_id: null,
      clave: null,
      descripcion: null,
      nombre_corto: null,
      marca_id: null,
      numero_serie: null,
      modelo_id: null,
      color: null,
      qr: null,
      qr_url: null,
      pdf_url: null,
      eliminado: null,
      empleado_id: null,
      empleado_registro_id: null,
    },
  }),
  actions: {
    //-----------------------------------------------------------
    initInventario() {
      this.inventario.id = null;
    },

    //-----------------------------------------------------------
    async loadInventarios() {},

    //-----------------------------------------------------------
    async createInventario(inventario) {
      try {
        const resp = await api.post("/Inventarios", inventario);
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
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async addCantidad(cantidad, catalogoId) {
      try {
        this.listaNumeroSerie = Array.from(
          { length: cantidad },
          (_, index) => index + 1
        );

        console.log("listaNumeroSerie", this.listaNumeroSerie);
      } catch (error) {
        console, log(error);
      }
    },

    //-----------------------------------------------------------
    actualizarModal(valor) {
      this.modal = valor;
    },
    updateConsulta(valor) {
      this.isConsulta = valor;
    },
  },
});
