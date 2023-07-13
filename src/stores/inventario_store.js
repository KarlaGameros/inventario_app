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
      catalogo: null,
      estatus: null,
      bodega_id: null,
      bodega: null,
      descripcion: null,
      nombre_Corto: null,
      marca_id: null,
      marca: null,
      modelo_id: null,
      modelo: null,
      color: null,
      img: null,
      numero_Serie: null,
      clave: null,
      empleado: null,
      ruta_PDF: null,
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
      this.inventario.catalogo = null;
      this.inventario.bodega_id = null;
      this.inventario.bodega = null;
      this.inventario.clave = null;
      this.inventario.descripcion = null;
      this.inventario.nombre_Corto = null;
      this.inventario.marca_id = null;
      this.inventario.marca = null;
      this.inventario.modelo_id = null;
      this.inventario.modelo = null;
      this.inventario.numero_Serie = null;
      this.inventario.color = null;
      this.inventario.img = null;
      this.inventario.empleado = null;
    },

    //-----------------------------------------------------------
    async loadInformacionInventarios() {
      try {
        let resp = await api.get("/Inventarios");
        let { data } = resp.data;
        console.log("resp inventarios", data);
        let listInventario = data.map((inventario) => {
          return {
            id: inventario.id,
            catalogo_id: inventario.catalogo_id,
            catalogo: inventario.catalago,
            bodega_id: inventario.bodega_id,
            bodega: inventario.bodega,
            descripcion: inventario.descripcion,
            nombre_Corto: inventario.nombre_Corto,
            marca_id: inventario.marca_id,
            marca: inventario.marca,
            modelo_id: inventario.modelo_id,
            modelo: inventario.modelo,
            color: inventario.color,
            estatus: inventario.estatus,
            clave: inventario.clave,
            numero_Serie: inventario.numero_Serie,
            empleado: inventario.empleado,
          };
        });
        this.inventarios = listInventario;
      } catch (error) {
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
        };
      }
    },

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

    async generarPDF(id) {
      try {
        let resp = null;
        resp = await api.get(`/Inventarios/GeneraPDF/${id}`);
        if (resp.status == 200) {
          console.log(resp.data);
          let ruta_PDF = resp.data;
          if (ruta_PDF) {
            return ruta_PDF;
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

    async deleteInventario(id) {
      try {
        const resp = await api.delete(`/Inventarios/${id}`);
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
    updateConsulta(valor) {
      this.isConsulta = valor;
    },
  },
});
