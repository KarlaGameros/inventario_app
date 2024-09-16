import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useInventarioStore = defineStore("inventario", {
  state: () => ({
    modal: false,
    modalFotos: false,
    modalPDF: false,
    modalValeBodega: false,
    modalFactura: false,
    isEditar: false,
    cantidad: null,
    excelIventario: null,
    list_Kardex: [],
    listInventario: [],
    listSinFactura: [],
    listFiltroInventario: [],
    listFiltroInventarioFactura: [],
    listInventarioByBodega: [],
    listInventarioAsignacion: [],
    inventarios: [],
    list_Inventario_By_Catalogo: [],
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
      paquete_Id: null,
      catalogo: null,
      estatus: null,
      bodega_id: null,
      bodega: null,
      responsable_Id: null,
      responsable: null,
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
      fecha_Registro: null,
      fecha_compra: null,
      numero_factura: null,
      importe: null,
      uuid: null,
      ruta_PDF_masivo: null,
      empleado_Registra: null,
      //-----------------------------
      descripcion_a: null,
      nombre_corto_a: null,
      marca_id_a: null,
      modelo_id_a: null,
      color_a: null,
      clave_a: null,
      numero_serie_a: null,
      numero_factura_a: null,
      importe_a: null,
      uuid_a: null,
      //-----------------------------
      descripcion_b: null,
      nombre_corto_b: null,
      marca_id_b: null,
      modelo_id_b: null,
      color_b: null,
      clave_b: null,
      numero_serie_b: null,
      numero_factura_b: null,
      importe_b: null,
      uuid_b: null,
      //-----------------------------
      descripcion_c: null,
      nombre_corto_c: null,
      marca_id_c: null,
      modelo_id_c: null,
      color_c: null,
      clave_c: null,
      numero_serie_c: null,
      numero_factura_c: null,
      importe_c: null,
      uuid_c: null,
    },
    factura: {
      inventarios_Generales_Id: [],
      inventarios_Generales_A_Id: [],
      inventarios_Generales_B_Id: [],
      inventarios_Generales_C_Id: [],
      costo_General: null,
      costo_A: null,
      costo_B: null,
      costo_C: null,
      factura: null,
      uuid: null,
      fecha_Compra: null,
    },
  }),
  actions: {
    //-----------------------------------------------------------
    initInventario() {
      this.inventario.id = null;
      this.inventario.catalogo_id = null;
      this.inventario.fecha_Registro = null;
      this.inventario.empleado_Registra = null;

      this.inventario.catalogo = null;
      this.inventario.bodega_id = null;
      this.inventario.bodega = null;
      this.inventario.clave = null;
      this.inventario.responsable_Id = null;
      this.inventario.responsable = null;

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

      this.inventario.importe = null;
      this.inventario.importe_a = null;
      this.inventario.importe_b = null;
      this.inventario.importe_c = null;

      this.inventario.numero_factura = null;
      this.inventario.numero_factura_a = null;
      this.inventario.numero_factura_b = null;
      this.inventario.numero_factura_c = null;

      this.inventario.uuid = null;
      this.inventario.uuid_a = null;
      this.inventario.uuid_b = null;
      this.inventario.uuid_c = null;

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
            catalogo_id: inventario.catalago_Id,
            catalogo: inventario.catalago,
            bodega_id: inventario.bodega_id,
            bodega: inventario.bodega,
            descripcion:
              inventario.descripcion.length >= 30
                ? inventario.descripcion.slice(0, 30) + "..."
                : inventario.descripcion,
            descripcion_completo: inventario.descripcion,
            nombre_corto: inventario.nombre_Corto,
            marca_id: inventario.marca_id,
            marca: inventario.marca,
            modelo_id: inventario.modelo_id,
            modelo: inventario.modelo,
            color: inventario.color == "null" ? "Sin color" : inventario.color,
            estatus: inventario.estatus,
            clave: inventario.clave,
            numero_Serie: inventario.numero_Serie,
            empleado: inventario.empleado,
            ruta_PDF: inventario.pdF_URL,
            fecha_Registro: inventario.fecha_Registro,
            fecha_compra: inventario.fecha_Compra,
            factura: inventario.factura,
            importe:
              inventario.importe == null ? "" : `$ ${inventario.importe}`,
            uuid: inventario.uuiD_Factura,
            paquete_Id: inventario.paquete_Id,
            value: inventario.id,
            label: `${inventario.clave}-${inventario.nombre_Corto}`,
            fecha_Baja: inventario.fecha_Baja,
            fecha_Comodato: inventario.fecha_Comodato,
            fecha_Donacion: inventario.fecha_Donacion,
            fecha_Movimiento:
              inventario.estatus == "Baja"
                ? inventario.fecha_Baja
                : inventario.estatus == "Comodato"
                ? inventario.fecha_Comodato
                : inventario.estatus == "Donación"
                ? inventario.fecha_Donacion
                : "",
          };
        });
        this.listInventario = listInventario.sort((a, b) => a.id - b.id);
        this.inventarios = listInventario;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------

    async loadSinFactura() {
      try {
        const resp = await api.get("/Inventarios/GetSinFactura");
        let { data } = resp.data;
        let listSinFactura = data.map((inventario) => {
          return {
            id: inventario.id,
            catalogo_id: inventario.catalago_Id,
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
            ruta_PDF: inventario.pdF_URL,
            fecha_Registro: inventario.fecha_Registro,
            fecha_compra: inventario.fecha_Compra,
            factura: inventario.factura,
            importe:
              inventario.importe == null ? "" : `$ ${inventario.importe}`,
            uuid: inventario.uuiD_Factura,
            paquete_Id: inventario.paquete_Id,
          };
        });
        this.listSinFactura = listSinFactura;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------

    async loadKardex(id) {
      try {
        const resp = await api.get(`/Inventarios/Kardex/${id}`);
        let { data } = resp.data;
        let listCompra = [];
        listCompra.push({
          folio_Movimiento: "Sin folio",
          tipo_Movimiento: "Compra",
          concepto: "Compra",
          capturista: this.inventario.empleado_Registra,
          fecha_Registro: this.inventario.fecha_Registro,
          fecha_Movimiento: this.inventario.fecha_compra,
        });
        let list_Kardex = data.map((movimiento) => {
          return {
            movimiento_Id: movimiento.movimiento_Id,
            folio_Movimiento: movimiento.folio_Movimiento,
            tipo_Movimiento: movimiento.tipo_Movimiento,
            concepto: movimiento.concepto,
            empleado: movimiento.empleado,
            capturista: movimiento.capturista,
            bodega_Origen: movimiento.bodega_Origen,
            bodega_Destino: movimiento.bodega_Destino,
            destino: movimiento.destino,
            observaciones: movimiento.observaciones,
            estado_Fisico: movimiento.estado_Fisico,
            fecha_Registro: movimiento.fecha_Registro,
            fecha_Movimiento: movimiento.fecha_Movimiento,
            timeStamp: movimiento.timeStamp,
          };
        });
        list_Kardex.sort((a, b) => {
          return new Date(a.fecha_Registro) - new Date(b.fecha_Registro);
        });
        this.list_Kardex = listCompra.concat(list_Kardex);
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------

    async createAsignacionFactura(asignacionFactura) {
      try {
        const resp = await api.post(
          "/Inventarios/AsignacionFactura",
          asignacionFactura
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
            this.inventario.descripcion = data.descripcion;
            this.inventario.nombre_corto = data.nombre_Corto;
            this.inventario.color = data.color;
            this.inventario.cantidad = data.cantidad;
            this.inventario.numero_Serie = data.numero_Serie;
            this.inventario.ruta_PDF = data.pdF_URL;
            this.inventario.importe = data.importe;
            this.inventario.uuid = data.uuiD_Factura;
            this.inventario.numero_factura = data.factura;
            this.inventario.estatus = data.estatus;
            this.inventario.fecha_compra = data.fecha_Compra;
            this.inventario.fecha_Registro = data.fecha_Registro;
            this.inventario.empleado_Registra = data.empleado_Registra;
            return { success };
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
        let resp = await api.get("/Inventarios/GetDisponibles");
        let { data } = resp.data;
        let ListaFiltro = [];
        if (id == 0) {
          ListaFiltro = data.filter((x) => x.estatus == "Activo");
        } else {
          ListaFiltro = data.filter(
            (x) => x.catalago_Id == id && x.estatus == "Activo"
          );
        }
        let listInvenatrio = ListaFiltro.map((inventario) => {
          return {
            value: inventario.id,
            label: `${inventario.clave} - ${inventario.nombre_Corto}`,
            descripcion: inventario.descripcion,
            clave: inventario.clave,
            estatus: inventario.estatus,
          };
        });
        this.inventarios = listInvenatrio;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------

    async loadInventarioByCatalogo(id) {
      try {
        let resp = await api.get(`/Inventarios/ByCatalogo/${id}`);
        let { data } = resp.data;
        let filtro = [];
        if (localStorage.getItem("perfil") == "Personal sin UTIE") {
          filtro = data.filter(
            (x) => x.estatus == "Activo" && x.bodega != "Bodega UTIE"
          );
        } else {
          filtro = data.filter((x) => x.estatus == "Activo");
        }
        this.list_Inventario_By_Catalogo = filtro.map((inventario) => {
          return {
            value: inventario.id,
            label: `${inventario.clave} - ${inventario.nombre_Corto}`,
            descripcion: inventario.descripcion,
            clave: inventario.clave,
            estatus: inventario.estatus,
            catalago_Id: inventario.catalago_Id,
          };
        });
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
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

    async addCantidad(cantidad) {
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
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
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

    async inventarioByBodega(id) {
      try {
        const resp = await api.get(`/Inventarios/ByBodega/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.listInventarioByBodega = data.map((inventario) => {
              return {
                clave: inventario.clave,
                descripcion: inventario.descripcion,
                numero_Serie: inventario.numero_Serie,
                marca: inventario.marca,
                modelo: inventario.modelo,
                color: inventario.color,
                importe: inventario.importe,
              };
            });
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

    async generarPDFmasivo() {
      try {
        let resp = await api.get("/Inventarios/GeneraPDFMasivo");
        let { ruta } = resp.data;
        if (resp.status == 200) {
          this.inventario.ruta_PDF = ruta;
          return { success: true };
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

    async downloadExcelInventario() {
      try {
        this.excelIventario = "";
        const resp = await api.get("/Inventarios/GenerarExcelInventarios", {
          responseType: "blob",
        });
        if (resp.status == 200) {
          let blob = new window.Blob([resp.data], {
            type: "application/xlsx",
          });
          this.excelIventario = window.URL.createObjectURL(blob);
          return { success: true };
        } else {
          return {
            success: false,
            data: "Error al descargar archivo, intentelo de nuevo",
          };
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrio un error, intentelo de nuevo. Si el error persiste contacte a soporte",
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
    actualizarModalFactura(valor) {
      this.modalFactura = valor;
    },
  },
});
