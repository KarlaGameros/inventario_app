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
    async addProduct(numero_serie, id, cantidad) {
      try {
        console.log("entro");
        this.listaNumeroSerie.push({
          numero_serie: numero_serie,
          inventari_Id: id,
          id: 0,
          cantidad: cantidad,
        });
        console.log("listaNumeroSerie", this.listaNumeroSerie);
      } catch (error) {
        console, log(error);
      }
    },

    //-----------------------------------------------------------
    async addCantidad(cantidad) {
      console.log("store", cantidad);
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
