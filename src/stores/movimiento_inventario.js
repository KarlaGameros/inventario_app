import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useMovimientoInventario = defineStore("movimiento_inventario", {
  state: () => ({
    modal: false,
    modalVerInv: false,
    modalFotos: false,
    modalRecibio: false,
    modalTraspaso: false,
    modalAddAsignacion: false,
    isEditar: false,
    visualizar: false,
    list_Traspaso: [],
    list_Movimientos_Pendiente: [],
    list_Movimiento_Inventario: [],
    list_Detalle_By_Movimiento: [],
    list_Detalle: [],
    list_Areas: [],
    list_Empleados: [],
    listTipoMovimientos: [],
    listConceptoMovimiento: [],
    list_Areas: [],
    list_Bodegas: [],
    list_Inventario: [],
    list_Inventario_By_Empleado: [],
    movimientos: [],
    movimiento: {
      id: null,
      tipo_Movimiento_Id: null,
      tipo_Movimiento: null,
      concepto_Id: null,
      concepto: null,
      empleado_Id: null,
      puesto_Id: null,
      area_Id: null,
      area: null,
      folio: null,
      folio_Dictamen_Baja: null,
      foto_1_URL: null,
      foto_2_URL: null,
      foto_3_URL: null,
      foto_4_URL: null,
      capturista_Id: null,
      capturista: null,
      puesto_Capturista_Id: null,
      puesto_Capturista: null,
      area_Capturista_Id: null,
      area_Capturista: null,
      empleado: null,
      puesto: null,
      fecha_Registro: null,
      fecha_Movimiento: null,
      estatus: null,
      afectado: null,
      fecha_Afecto: null,
      observaciones: null,
      detalle: [],
    },
    inventario: {
      id: null,
      clave: null,
      descripcion: null,
      nombre_Corto: null,
      numero_Serie: null,
      color: null,
      marca: null,
      modelo: null,
      foto_1_URL: null,
    },
    asignacion: {
      id: null,
      area_Id: null,
      area: null,
      empleado_Id: null,
      empleado: null,
      puesto_Id: null,
      puesto: null,
      eliminado: null,
      fecha_Asignacion: null,
      folio: null,
      tipo: null,
      detalle: [],
    },
    detalle_Movimiento: {
      id: null,
      movimiento_Inventario_Id: null,
      inventario_Id: null,
      inventario: null,
      destino: null,
      observaciones: null,
      folio_Dictamen_Baja: null,
      foto_1_URL: null,
      foto_2_URL: null,
      foto_3_URL: null,
      foto_4_URL: null,
      empleado_Id: null,
      empleado: null,
      bodega_Origen_Id: null,
      bodega_Origen_Nombre: null,
      bodega_Origen: null,
      bodega_Destino_Id: null,
      bodega_Destino_Nombre: null,
      bodega_Destino: null,
      estatus: null,
      fecha_Registro: null,
      afectado: null,
      fecha_Afecto: null,
      estado_Fisico: null,
    },
    responsable: {
      id: null,
      empleado_Id: null,
      area_Id: null,
      puesto_Id: null,
      activo: null,
      created_at: null,
      fecha_Asignacion: null,
      fecha_destitucion: null,
      empleado: null,
      area: null,
      puesto: null,
    },
  }),
  actions: {
    actualizarModalTraspaso(valor) {
      this.modalTraspaso = valor;
    },

    actualizarModalAddAsignacion(valor) {
      this.modalAddAsignacion = valor;
    },

    initMovimiento() {
      this.movimiento.id = null;
      this.movimiento.tipo_Movimiento = null;
      this.movimiento.tipo_Movimiento_Id = null;
      this.movimiento.empleado_Id = null;
      this.movimiento.empleado = null;
      this.movimiento.puesto_Id = null;
      this.movimiento.puesto = null;
      this.movimiento.area_Id = null;
      this.movimiento.area = null;
      this.movimiento.folio = null;
      this.movimiento.folio_Dictamen_Baja = null;
      this.movimiento.capturista_Id = null;
      this.movimiento.capturista = null;
      this.movimiento.puesto_Capturista_Id = null;
      this.movimiento.puesto_Capturista = null;
      this.movimiento.area_Capturista_Id = null;
      this.movimiento.area_Capturista = null;
      this.movimiento.fecha_Registro = null;
      this.movimiento.estatus = null;
      this.movimiento.afectado = null;
      this.movimiento.fecha_Afecto = null;
      this.movimiento.detalle = null;
      this.list_Detalle = [];
      this.list_Traspaso = [];
      this.list_Detalle_By_Movimiento = null;
    },

    initDetalleMovimiento() {
      this.detalle_Movimiento.id = null;
      this.detalle_Movimiento.movimiento_Inventario_Id = null;
      this.detalle_Movimiento.inventario_Id = null;
      this.detalle_Movimiento.inventario = null;
      this.detalle_Movimiento.destino = null;
      this.detalle_Movimiento.observaciones = null;
      this.detalle_Movimiento.folio_Dictamen_Baja = null;
      this.detalle_Movimiento.foto_1_URL = null;
      this.detalle_Movimiento.foto_2_URL = null;
      this.detalle_Movimiento.foto_3_URL = null;
      this.detalle_Movimiento.foto_4_URL = null;
      this.detalle_Movimiento.empleado_Id = null;
      this.detalle_Movimiento.empleado = null;
      this.detalle_Movimiento.bodega_Origen_Id = null;
      this.detalle_Movimiento.bodega_Origen_Nombre = null;
      this.detalle_Movimiento.bodega_Origen = null;
      this.detalle_Movimiento.bodega_Destino_Id = null;
      this.detalle_Movimiento.bodega_Destino_Nombre = null;
      this.detalle_Movimiento.bodega_Destino = null;
      this.detalle_Movimiento.estatus = null;
      this.detalle_Movimiento.fecha_Registro = null;
      this.detalle_Movimiento.afectado = null;
      this.detalle_Movimiento.fecha_Afecto = null;
    },

    //-----------------------------------------------------------
    async loadInformacionMovimientos() {
      try {
        let resp = await api.get("/MovimientosInventarios");
        let { data } = resp.data;
        this.movimientos = data.map((movimiento) => {
          return {
            id: movimiento.id,
            tipo_Movimiento_Id: movimiento.tipo_Movimiento_Id,
            tipo_Movimiento: movimiento.tipo_Movimiento,
            folio: movimiento.folio,
            capturista_Id: movimiento.capturista_Id,
            capturista: movimiento.capturista,
            puesto_Capturista_Id: movimiento.puesto_Capturista_Id,
            puesto_Capturista: movimiento.puesto_Capturista,
            area_Capturista_Id: movimiento.area_Capturista_Id,
            area_Capturista: movimiento.area_Capturista,
            empleado_Id: movimiento.empleado_Id,
            empleado: movimiento.empleado,
            puesto_Id: movimiento.puesto_Id,
            puesto: movimiento.puesto,
            area_Id: movimiento.area_Id,
            area: movimiento.area,
            fecha_Registro: movimiento.fecha_Registro,
            estatus: movimiento.estatus,
            afectado: movimiento.afectado,
            fecha_Afecto: movimiento.fecha_Afecto,
            fecha_Movimiento: movimiento.fecha_Movimiento,
            concepto: movimiento.concepto,
            value: movimiento.id,
            label: movimiento.folio,
          };
        });
        this.movimientos.sort((a, b) => b.id - a.id);
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async loadInformacionMovimientosPendientes(tipo) {
      try {
        let resp = await api.get("/MovimientosInventarios");
        let { data } = resp.data;
        let list = data.map((movimiento) => {
          return {
            id: movimiento.id,
            tipo_Movimiento_Id: movimiento.tipo_Movimiento_Id,
            tipo_Movimiento: movimiento.tipo_Movimiento,
            folio: movimiento.folio,
            capturista_Id: movimiento.capturista_Id,
            capturista: movimiento.capturista,
            puesto_Capturista_Id: movimiento.puesto_Capturista_Id,
            puesto_Capturista: movimiento.puesto_Capturista,
            area_Capturista_Id: movimiento.area_Capturista_Id,
            area_Capturista: movimiento.area_Capturista,
            empleado_Id: movimiento.empleado_Id,
            empleado: movimiento.empleado,
            puesto_Id: movimiento.puesto_Id,
            puesto: movimiento.puesto,
            area_Id: movimiento.area_Id,
            area: movimiento.area,
            fecha_Registro: movimiento.fecha_Registro,
            estatus: movimiento.estatus,
            afectado: movimiento.afectado,
            fecha_Afecto: movimiento.fecha_Afecto,
            fecha_Movimiento: movimiento.fecha_Movimiento,
            concepto: movimiento.concepto,
            value: movimiento.id,
            label: movimiento.folio,
          };
        });
        this.list_Movimientos_Pendiente = list.filter(
          (x) =>
            x.estatus == "Afectado" &&
            x.concepto ==
              (tipo == "Baja"
                ? "Pendiente Baja"
                : tipo == "Comodato"
                ? "Pendiente Comodato"
                : "Pendiente Donación")
        );
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async loadInventarioByEmpleado(id) {
      try {
        let resp = await api.get(`/Inventarios/GetByEmpleado/${id}`);
        let { data } = resp.data;
        let list = data.map((inventario) => {
          return {
            id: inventario.id,
            paquete_Id: inventario.paquete_Id,
            estatus_Id: inventario.catalago_Id,
            estatus: inventario.estatus,
            marca_Id: inventario.marca_Id,
            marca: inventario.marca,
            modelo_Id: inventario.modelo_Id,
            modelo: inventario.modelo,
            inventario: inventario.nombre_Corto,
            bodega_Id: inventario.bodega_Id,
            clave: inventario.clave,
            descripcion: inventario.descripcion,
            nombre_Corto: inventario.nombre_Corto,
            numero_Serie: inventario.numero_Serie,
            color: inventario.color,
            foto_1_URL: inventario.foto_1_URL,
            foto_2_URL: inventario.foto_2_URL,
            foto_3_URL: inventario.foto_3_URL,
            foto_4_URL: inventario.foto_4_URL,
            inventario_Id: inventario.id,
            destino: "Bodega",
            observaciones: null,
            empleado_Id: null,
            catalago_Id: inventario.catalago_Id,
            bodega_Destino_Id: inventario.bodega_Id,
            bodega: inventario.bodega,
            value: inventario.id,
            label: `${inventario.clave} ${inventario.nombre_Corto}`,
            activo: false,
          };
        });
        this.list_Inventario_By_Empleado = list;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async createMovimiento(movimientoInventario) {
      try {
        const resp = await api.post(
          "/MovimientosInventarios",
          movimientoInventario
        );
        if (resp.status == 200) {
          const { success, data, id } = resp.data;
          if (success === true) {
            return { success, data, id };
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
    async createDetalleMovimiento(detalle) {
      try {
        const resp = await api.post(
          `/DetalleMovimientosInventarios/AgregarDetalle/${detalle.movimiento_Inventario_Id}`,
          detalle
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
    async updateDetalleMovimiento(detalle) {
      try {
        const resp = await api.put(
          `/DetalleMovimientosInventarios/${detalle.id}`,
          detalle
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
    async loadDetalleMovimiento(id) {
      try {
        let resp = await api.get(
          `/DetalleMovimientosInventarios/ByMovimiento/${id}`
        );
        let { data } = resp.data;
        this.list_Detalle = data.map((movimiento) => {
          return {
            id: movimiento.id,
            movimiento_Inventario_Id: movimiento.movimiento_Inventario_Id,
            concepto_Id: movimiento.concepto_Id,
            concepto: movimiento.concepto,
            inventario_Id: movimiento.inventario_Id,
            inventario: movimiento.inventario,
            clave: movimiento.clave,
            marca: movimiento.marca,
            modelo: movimiento.modelo,
            importe: movimiento.importe,
            descripcion: movimiento.descripcion,
            no_Serie: movimiento.no_Serie,
            observaciones: movimiento.observaciones,
            estado_Fisico: movimiento.estado_Fisico,
            color: movimiento.color,
            folio_Dictamen_Baja: movimiento.folio_Dictamen_Baja,
            foto_1_URL: movimiento.foto_1_URL,
            foto_2_URL: movimiento.foto_2_URL,
            foto_3_URL: movimiento.foto_3_URL,
            foto_4_URL: movimiento.foto_4_URL,
            empleado_Id: movimiento.empleado_Id,
            empleado: movimiento.empleado,
            bodega_Origen_Id: movimiento.bodega_Origen_Id,
            bodega_Origen_Nombre: movimiento.bodega_Origen_Nombre,
            bodega_Origen: movimiento.bodega_Origen,
            destino: movimiento.destino,
            bodega_Destino_Id: movimiento.bodega_Destino_Id,
            bodega_Destino: movimiento.bodega_Destino,
            bodega: movimiento.bodega_Destino,
            estatus: movimiento.estatus,
            fecha_Registro: movimiento.fecha_Registro,
            afectado: movimiento.afectado,
            fecha_Afecto: movimiento.fecha_Afecto,
            value: movimiento.id,
            label: movimiento.inventario,
          };
        });
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async loadDetalleMovimientoById(id) {
      try {
        let resp = await api.get(`/DetalleMovimientosInventarios/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            this.detalle_Movimiento.id = data.id;
            this.detalle_Movimiento.movimiento_Inventario_Id =
              data.movimiento_Inventario_Id;
            this.detalle_Movimiento.inventario_Id = data.inventario_Id;
            this.detalle_Movimiento.inventario = data.inventario;
            this.detalle_Movimiento.destino = data.destino;
            this.detalle_Movimiento.observaciones = data.observaciones;
            this.detalle_Movimiento.folio_Dictamen_Baja =
              data.folio_Dictamen_Baja;
            this.detalle_Movimiento.foto_1_URL = data.foto_1_URL;
            this.detalle_Movimiento.foto_2_URL = data.foto_2_URL;
            this.detalle_Movimiento.foto_3_URL = data.foto_3_URL;
            this.detalle_Movimiento.foto_4_URL = data.foto_4_URL;
            this.detalle_Movimiento.empleado_Id = data.empleado_Id;
            this.detalle_Movimiento.empleado = data.empleado;
            this.detalle_Movimiento.bodega_Origen_Id = data.bodega_Origen_Id;
            this.detalle_Movimiento.bodega_Destino_Nombre =
              data.bodega_Destino_Nombre;
            this.detalle_Movimiento.bodega_Origen = data.bodega_Origen;
            this.detalle_Movimiento.bodega_Destino_Id = data.bodega_Destino_Id;
            this.detalle_Movimiento.bodega_Destino_Nombre =
              data.bodega_Destino_Nombre;
            this.detalle_Movimiento.bodega_Destino = data.bodega_Destino;
            this.detalle_Movimiento.estatus = data.estatus;
            this.detalle_Movimiento.fecha_Registro = data.fecha_Registro;
            this.detalle_Movimiento.afectado = data.afectado;
            this.detalle_Movimiento.fecha_Afecto = data.fecha_Afecto;
          }
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async loadMovimiento(id) {
      try {
        const resp = await api.get(`/MovimientosInventarios/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            this.movimiento.id = data.id;
            this.movimiento.concepto = data.concepto;
            this.movimiento.observaciones = data.observaciones;
            this.movimiento.tipo_Movimiento_Id = data.tipo_Movimiento_Id;
            this.movimiento.tipo_Movimiento = data.tipo_Movimiento;
            this.movimiento.concepto_Id = data.concepto_Id;
            this.movimiento.folio = data.folio;
            this.movimiento.capturista_Id = data.capturista_Id;
            this.movimiento.capturista = data.capturista;
            this.movimiento.puesto_Capturista_Id = data.puesto_Capturista_Id;
            this.movimiento.puesto_Capturista = data.puesto_Capturista;
            this.movimiento.area_Capturista_Id = data.area_Capturista_Id;
            this.movimiento.area_Capturista = data.area_Capturista;
            this.movimiento.empleado_Id = data.empleado_Id;
            this.movimiento.empleado = data.empleado;
            this.movimiento.puesto_Id = data.puesto_Id;
            this.movimiento.puesto = data.puesto;
            this.movimiento.area_Id = data.area_Id;
            this.movimiento.area = data.area;
            this.movimiento.fecha_Registro = data.fecha_Registro;
            this.movimiento.estatus = data.estatus;
            this.movimiento.afectado = data.afectado;
            this.movimiento.fecha_Afecto = data.fecha_Afecto;
            this.movimiento.folio_Dictamen_Baja = data.folio_Dictamen_Baja;
            this.movimiento.fecha_Movimiento = data.fecha_Movimiento;
          }
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async agregarFotografias(id, fotografias) {
      try {
        const resp = await api.post(
          `/DetalleMovimientosInventarios/Agregar_Fotografias/${id}`,
          fotografias,
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
    async deleteProducto(id) {
      try {
        let nIndex = this.list_Movimiento_Inventario.findIndex(
          (x) => x.inventario_Id == id
        );
        this.list_Movimiento_Inventario.splice(nIndex, 1);
        return {
          success: true,
          data: "Producto eliminado de la lista",
        };
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async deleteInventario(id) {
      try {
        if (this.isEditar == false) {
          this.list_Detalle = this.list_Detalle.filter(
            (x) => x.inventario_Id !== id
          );
          return { success: true, data: "Se eliminó correctamente" };
        } else {
          let resp = await api.delete(`/DetalleMovimientosInventarios/${id}`);
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
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async loadTipoMovimientos() {
      try {
        let resp = await api.get("/TiposMovimientosInventarios");
        let { data } = resp.data;
        let filtro = data.filter((x) => x.tipo_Movimiento != "Entrada");
        this.listTipoMovimientos = filtro.map((tipo) => {
          return {
            value: tipo.id,
            label: tipo.tipo_Movimiento,
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
    async loadConceptoMovimientoListFiltro(filtro) {
      try {
        let resp = await api.get("/ConceptosMovimientosInventarios");
        let { data } = resp.data;
        let listData = data.filter(
          (x) => x.tipo_Movimiento_Inventario_Id == filtro.value
        );
        let list = listData.map((concepto) => {
          return {
            label: concepto.concepto,
            value: concepto.id,
          };
        });
        if (
          filtro.label == "Salida" &&
          this.isEditar == false &&
          this.visualizar == false
        ) {
          this.listConceptoMovimiento = list.filter(
            (x) => !x.label.includes("Pendiente") && !x.label.includes("Salida")
          );
        } else {
          this.listConceptoMovimiento = list;
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async loadInventarioByBodega(id) {
      try {
        let resp = await api.get(`/Inventarios/ByBodega/${id}`);
        let { data } = resp.data;
        let list = data.map((inventario) => {
          return {
            value: inventario.id,
            label: `${inventario.clave} - ${inventario.nombre_Corto}`,
            id: inventario.id,
            bodega_Id: inventario.bodega_Id,
            descripcion: inventario.descripcion,
            nombre_Corto: inventario.nombre_Corto,
            clave: inventario.clave,
            estatus: inventario.estatus,
          };
        });
        this.list_Inventario = list.filter((x) => x.estatus == "Activo");
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async loadBodegas() {
      try {
        let resp = await api.get("/Bodegas/GetLista");
        let { data } = resp.data;
        this.list_Bodegas = data.map((bodega) => {
          return {
            value: bodega.value,
            label: bodega.text,
          };
        });
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async loadAreas() {
      try {
        let resp = await api.get("/Areas/GetLista");
        let { data } = resp.data;
        this.list_Areas = data.map((area) => {
          return {
            value: area.value,
            label: area.label,
          };
        });
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async loadEmpleadosByArea(id) {
      try {
        let resp = await api.get(`/Empleados/ByArea/${id}`);
        let { data } = resp.data;
        this.list_Empleados = data.map((empleado) => {
          return {
            puesto_Id: empleado.puesto_Id,
            value: empleado.id,
            label: `${empleado.nombres} ${empleado.apellido_Paterno} ${empleado.apellido_Materno}`,
          };
        });
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
        const resp = await api.get(`/Inventarios/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            this.inventario.id = data.id;
            this.inventario.clave = data.clave;
            this.inventario.descripcion = data.descripcion;
            this.inventario.nombre_Corto = data.nombre_Corto;
            this.inventario.numero_Serie = data.numero_Serie;
            this.inventario.color = data.color;
            this.inventario.marca = data.marca;
            this.inventario.modelo = data.modelo;
            this.inventario.foto_1_URL = data.foto_1_URL;
          }
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async addObservacion(id, observavacion) {
      try {
        let elemento = this.list_Detalle.findIndex(
          (x) => x.inventario_Id == id
        );
        this.list_Detalle[elemento].observaciones = observavacion;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async addInventario(
      inventario,
      observacion,
      estado_Fisico,
      destino,
      empleado_Id,
      bodega_Destino_Id
    ) {
      try {
        this.list_Detalle.push({
          inventario_Id: inventario.value,
          inventario: inventario.label,
          descripcion: inventario.descripcion,
          clave: inventario.clave,
          observaciones: observacion,
          estado_Fisico: estado_Fisico,
          destino: destino,
          empleado_Id:
            destino == "Personal" && empleado_Id != null
              ? empleado_Id.value
              : null,
          empleado: empleado_Id != null ? empleado_Id.label : null,
          bodega_Destino_Id:
            destino == "Bodega" && bodega_Destino_Id != null
              ? bodega_Destino_Id.value
              : null,
          bodega: bodega_Destino_Id != null ? bodega_Destino_Id.label : null,
        });
        return { success: true };
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async afectarMovimiento(id, tipo_Movimiento) {
      try {
        const resp = await api.get(`/MovimientosInventarios/Afectar/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true && tipo_Movimiento == "Salida") {
            return { success, data };
          } else if (success === true && tipo_Movimiento != "Salida") {
            if (success === true) {
              data.forEach(async (element) => {
                let respAsignacion = null;
                this.asignacion.empleado_Id = element.empleado_Id;
                this.asignacion.area_Id = element.area_Id;
                this.asignacion.puesto_Id = element.puesto_Id;
                this.asignacion.fecha_Asignacion = element.fecha_Asignacion;
                this.asignacion.tipo = element.tipo;
                this.asignacion.detalle = element.detalle;
                this.asignacion.bodega_Id = element.bodega_Id;
                if (element.tipo != "Bodega") {
                  respAsignacion = await api.post(
                    "/AsignacionesInventarios",
                    this.asignacion
                  );
                }
              });
              return { success: true, data: data };
            }
          } else {
            return {
              success: false,
              data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
            };
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
    async cancelarMovimiento(id) {
      try {
        const resp = await api.get(`/MovimientosInventarios/Cancelar/${id}`);
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
    async loadResponsableByUsuario() {
      try {
        const resp = await api.get("/ResponsablesAreas/ResposableByUsuario");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            this.responsable.id = data.id;
            this.responsable.empleado_Id = data.empleado_Id;
            this.responsable.area_Id = data.area_Id;
            this.responsable.puesto_Id = data.puesto_Id;
            this.responsable.activo = data.activo;
            this.responsable.created_at = data.created_at;
            this.responsable.fecha_Asignacion = data.fecha_Asignacion;
            this.responsable.fecha_destitucion = data.fecha_destitucion;
            this.responsable.empleado = data.empleado;
            this.responsable.area = data.area;
            this.responsable.puesto = data.puesto;
          }
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async cancelarAfectadoMovimiento(id) {
      try {
        const resp = await api.get(
          `/MovimientosInventarios/CancelarAfectado/${id}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            return { success, data };
          } else {
            return { success, data };
          }
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
    actualizarModalRecibio(valor) {
      this.modalRecibio = valor;
    },
    actualizarVerInventario(valor) {
      this.modalVerInv = valor;
    },
    actualizarModalFotos(valor) {
      this.modalFotos = valor;
    },
    updateEditar(valor) {
      this.isEditar = valor;
    },
    updateVisualizar(valor) {
      this.visualizar = valor;
    },
  },
});
