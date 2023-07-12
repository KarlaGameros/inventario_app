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
    inventario: {
      id: null,
      catalogo_id: null,
      estatus: null,
      bodega_id: null,
      descripcion: null,
      nombre_corto: null,
      marca_id: null,
      modelo_id: null,
      color: null,
      img: null,
      //empleado_registro_id: null,
      // extencionA: {
      //   descripcion_extencion_a: null,
      //   nombre_corto_extencion_a: null,
      //   marca_id_extencion_a: null,
      //   modelo_id_extencion_a: null,
      //   color_extencion_a: null,
      // },
      // extencionB: {
      //   descripcion_extencion_b: null,
      //   nombre_corto_extencion_b: null,
      //   marca_id_extencion_b: null,
      //   modelo_id_extencion_b: null,
      //   color_extencion_b: null,
      // },
      // extencionC: {
      //   descripcion_extencion_c: null,
      //   nombre_corto_extencion_c: null,
      //   marca_id_extencion_c: null,
      //   modelo_id_extencion_c: null,
      //   color_extencion_c: null,
      // },
    },
  }),
  actions: {
    //-----------------------------------------------------------
    initInventario() {
      this.inventario.id = null;
      this.inventario.catalogo_id = null;
      this.inventario.bodega_id = null;
      this.inventario.clave = null;
      this.inventario.descripcion = null;
      this.inventario.nombre_corto = null;
      this.inventario.marca_id = null;
      this.inventario.modelo_id = null;
      this.inventario.numero_serie = null;
      this.inventario.color = null;
      this.inventario.img = null;
    },

    //-----------------------------------------------------------
    async loadInventarios() {},

    //-----------------------------------------------------------
    async createInventario(inventarioFormData) {
      console.log("createInventario", inventarioFormData);
      try {
        const resp = await api.post("/Inventarios", inventarioFormData, {
          headers: {
            "Conten-Type": "multipart/form-data",
          },
        });
        console.log("resp", resp);
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
