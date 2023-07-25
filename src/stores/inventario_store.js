import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useInventarioStore = defineStore("inventario", {
  state: () => ({
    modal: false,
    modalFotos: false,
    modalPDF: false,
    isEditar: false,
    cantidad: null,
    listInventario: [],
    inventarios: [],
    listaNumeroSerie: [
      {
        id: null,
        numero_serie: null,
      },
    ],
    listaNumeroSerie_a: [
      {
        numero_serie: null,
      },
    ],
    listaNumeroSerie_b: [
      {
        numero_serie: null,
      },
    ],
    listaNumeroSerie_c: [
      {
        numero_serie: null,
      },
    ],
    inventario: {
      id: null,
      catalogo_id: null,
      catalogo: null,
      estatus: null,
      bodega_id: null,
      bodega: null,
      descripcion: null,
      nombre_corto: null,
      marca_id: null,
      marca: null,
      modelo_id: null,
      modelo: null,
      color: null,
      foto_1: null,
      foto_2: null,
      foto_3: null,
      foto_4: null,
      numero_Serie: null,
      clave: null,
      empleado: null,
      ruta_PDF: null,
      fecha_compra: null,
      factura: null,
      importe: null,
      //-----------------------------
      descripcion_a: null,
      nombre_corto_a: null,
      marca_id_a: null,
      modelo_id_a: null,
      color_a: null,
      clave_a: null,
      numero_serie_a: null,
      //-----------------------------
      descripcion_b: null,
      nombre_corto_b: null,
      marca_id_b: null,
      modelo_id_b: null,
      color_b: null,
      clave_b: null,
      numero_serie_b: null,
      //-----------------------------
      descripcion_c: null,
      nombre_corto_c: null,
      marca_id_c: null,
      modelo_id_c: null,
      color_c: null,
      clave_c: null,
      numero_serie_c: null,
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
      this.inventario.descripcion_a = null;
      this.inventario.descripcion_b = null;
      this.inventario.descripcion_c = null;

      this.inventario.nombre_corto = null;
      this.inventario.nombre_corto_a = null;
      this.inventario.nombre_corto_b = null;
      this.inventario.nombre_corto_c = null;

      this.inventario.marca_id = null;
      this.inventario.marca = null;
      this.inventario.modelo_id = null;
      this.inventario.modelo = null;
      this.inventario.numero_Serie = null;

      this.inventario.color = null;
      this.inventario.color_a = null;
      this.inventario.color_b = null;
      this.inventario.color_c = null;

      this.inventario.foto_1 = null;
      this.inventario.foto_2 = null;
      this.inventario.foto_3 = null;
      this.inventario.foto_4 = null;

      this.inventario.empleado = null;
    },

    //-----------------------------------------------------------
    async loadInformacionInventarios() {
      try {
        let resp = await api.get("/Inventarios");
        let { data } = resp.data;
        let listInventario = data.map((inventario) => {
          return {
            id: inventario.id,
            catalogo_id: inventario.catalogo_id,
            catalogo: inventario.catalago,
            bodega_id: inventario.bodega_id,
            bodega: inventario.bodega,
            descripcion: inventario.descripcion,
            nombre_corto: inventario.nombre_Corto,
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
        this.listInventario = listInventario;
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
      try {
        const resp = await api.post("/Inventarios", inventarioFormData, {
          headers: {
            "Conten-Type": "multipart/form-data",
          },
        });
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

    async createInventarioPaquete(inventarioPaqueteFormData) {
      try {
        const resp = await api.post(
          "/Inventarios/Paquete",
          inventarioPaqueteFormData,
          {
            headers: {
              "Conten-Type": "multipart/form-data",
            },
          }
        );
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

    async loadInventario(id) {
      try {
        let resp = await api.get(`/Inventarios/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            this.inventario.id = data.id;
            this.inventario.foto_1 = data.foto_1_URL;
            this.inventario.foto_2 = data.foto_2_URL;
            this.inventario.foto_3 = data.foto_3_URL;
            this.inventario.foto_4 = data.foto_4_URL;
            this.inventario.catalogo_id = data.catalago_Id;
            this.inventario.catalogo = data.catalago;
            this.inventario.modelo_id = data.modelo_Id;
            this.inventario.modelo = data.modelo;
            this.inventario.marca_id = data.marca_Id;
            this.inventario.marca = data.marca;
            this.inventario.clave = data.clave;
            this.inventario.bodega_id = data.bodega_Id;
            this.inventario.bodega = data.bodega;
            this.inventario.catalogo = data.catalago;
            this.inventario.descripcion = data.descripcion;
            this.inventario.nombre_corto = data.nombre_Corto;
            this.inventario.color = data.color;
            this.inventario.cantidad = data.cantidad;
            this.inventario.numero_Serie = data.numero_Serie;
          }
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async loadListInventario(id) {
      try {
        let resp = await api.get("/Inventarios");
        let { data } = resp.data;
        let ListaFiltro = [];

        if (id == 0) {
          ListaFiltro = data;
        } else {
          ListaFiltro = data.filter((x) => x.catalago_Id == id);
        }

        let listInvenatrio = ListaFiltro.map((inventario) => {
          return {
            value: inventario.id,
            label: `${inventario.clave} - ${inventario.nombre_Corto}`,
            id: inventario.id,
            catalogo_id: inventario.catalogo_id,
            catalogo: inventario.catalago,
            bodega_id: inventario.bodega_id,
            bodega: inventario.bodega,
            descripcion: inventario.descripcion,
            nombre_corto: inventario.nombre_Corto,
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
        this.listInventario = listInvenatrio;
      } catch (error) {}
    },

    //-----------------------------------------------------------

    async updateInventario(inventario, editarInventarioFormData) {
      try {
        const resp = await api.put(
          `/Inventarios/${inventario.value.id}`,
          editarInventarioFormData,
          {
            headers: {
              "Conten-Type": "multipart/form-data",
            },
          }
        );
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
          (_, index) => ({
            id: index + 1,
            numero_serie: "",
          })
        );

        this.listaNumeroSerie_a = Array.from(
          { length: cantidad },
          (_, index) => ({
            id: index + 1,
            numero_serie: "",
          })
        );
        this.listaNumeroSerie_b = Array.from(
          { length: cantidad },
          (_, index) => ({
            id: index + 1,
            numero_serie: "",
          })
        );
        this.listaNumeroSerie_c = Array.from(
          { length: cantidad },
          (_, index) => ({
            id: index + 1,
            numero_serie: "",
          })
        );
      } catch (error) {
        console.log(error);
      }
    },

    //-----------------------------------------------------------

    async generarPDF(id) {
      try {
        let resp = null;
        resp = await api.get(`/Inventarios/GeneraPDF/${id}`);
        if (resp.status == 200) {
          let ruta_PDF = resp.data;
          this.inventario.ruta_PDF = ruta_PDF.ruta_PDF;
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

    async inventarioByCatalogo(id) {
      try {
        const resp = await api.get(`/Inventarios/ByCatalogo/${id}`);
        if (resp.status == 200) {
          let { data } = resp.data;
          let listInventario = data.map((inventario) => {
            return {
              id: inventario.id,
              catalogo_id: inventario.catalogo_id,
              catalogo: inventario.catalago,
              bodega_id: inventario.bodega_id,
              bodega: inventario.bodega,
              descripcion: inventario.descripcion,
              nombre_corto: inventario.nombre_Corto,
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
          this.listInventario = listInventario;
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
    actualizarModalFotos(valor) {
      this.modalFotos = valor;
    },
    actualizarModalPDF(valor) {
      this.modalPDF = valor;
    },
    updateEditar(valor) {
      this.isEditar = valor;
    },
  },
});
