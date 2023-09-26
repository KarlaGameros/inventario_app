import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useMovimientoInventario = defineStore("movimiento_inventario", {
  state: () => ({
    modal: false,
    isEditar: false,
    isCompra: false,
    listaMovimientoInventario: [],
    listTipoMovimientos: [],
    listConceptoMovimiento: [],
    movimientos: [],
    movimiento: {
      id: null,
      tipo_Movimiento_Id: null,
      tipo_Movimiento: null,
      concepto_Movimiento: null,
      concepto_Movimiento_Id: null,
      fecha_Movimiento: null,
      estatus: null,
      bodega_Origen_Id: null,
      bodega_Origen: null,
      bodega_Destino_Id: null,
      bodega_Destino: null,
      provedor_Id: null,
      proveedor: null,
      empleado_Registra_Id: null,
      empleado_Registra: null,
      provedor: null,
      pdf_Url: null,
      xml_Url: null,
      uuid: null,
      no_Factura: null,
      area_Empleado_Registra_Id: null,
      area_Empleado_Registra: null,
      detalle: [],
    },
  }),
  actions: {
    initMovimiento() {
      this.movimiento.id = null;
      this.movimiento.tipo_Movimiento = null;
      this.movimiento.tipo_Movimiento_Id = null;
      this.movimiento.concepto_Movimiento = null;
      this.movimiento.concepto_Movimiento_Id = null;
      this.movimiento.fecha_Movimiento = null;
      this.movimiento.estatus = null;
      this.movimiento.bodega_Origen_Id = null;
      this.movimiento.bodega_Origen = null;
      this.movimiento.bodega_Destino_Id = null;
      this.movimiento.bodega_Destino = null;
      this.movimiento.provedor_Id = null;
      this.movimiento.empleado_Registra = null;
      this.movimiento.empleado_Registra_Id = null;
      this.movimiento.provedor = null;
      this.movimiento.provedor_Id = null;
      this.movimiento.proveedor = null;
      this.movimiento.uuid = null;
      this.movimiento.no_Factura = null;
      this.listaMovimientoInventario = [];
    },

    //-----------------------------------------------------------
    async loadInformacionMovimientos() {
      try {
        let resp = await api.get("/MovimientosInventarios");
        let { data } = resp.data;
        let listaMovimientos = data.map((movimiento) => {
          return {
            id: movimiento.id,
            tipo_Movimiento_Id: movimiento.tipo_Movimiento_Id,
            tipo_Movimiento: movimiento.tipo_Movimiento,
            concepto_Movimiento: movimiento.concepto_Movimiento,
            concepto_Movimiento_Id: movimiento.concepto_Movimiento_Id,
            fecha_Movimiento: movimiento.fecha_Movimiento,
            estatus: movimiento.estatus,
            bodega_Destino: movimiento.bodega_Destino,
            bodega_Destino_Id: movimiento.bodega_Destino_Id,
            bodega_Origen: movimiento.bodega_Origen,
            bodega_Origen_Id: movimiento.bodega_Origen_Id,
            proveedor: movimiento.proveedor,
            provedor_Id: movimiento.provedor_Id,
            empleado_Registra: movimiento.empleado_Registra,
            empleado_Registra_Id: movimiento.empleado_Registra_Id,
            uuid: movimiento.uuid,
            no_Factura: movimiento.no_Factura,
          };
        });
        this.movimientos = listaMovimientos;
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
            this.movimiento.tipo_Movimiento_Id = data.tipo_Movimiento_Id;
            this.movimiento.tipo_Movimiento = data.tipo_Movimiento;
            this.movimiento.bodega_Origen_Id = data.bodega_Origen_Id;
            this.movimiento.bodega_Origen = data.bodega_Origen;
            this.movimiento.bodega_Destino_Id = data.bodega_Destino_Id;
            this.movimiento.bodega_Destino = data.bodega_Destino;
            this.movimiento.provedor_Id = data.provedor_Id;
            this.movimiento.proveedor = data.proveedor;
            this.movimiento.fecha_Movimiento = data.fecha_Movimiento;
            this.movimiento.estatus = data.estatus;
            this.movimiento.concepto_Movimiento_Id =
              data.concepto_Movimiento_Id;
            this.movimiento.concepto_Movimiento = data.concepto_Movimiento;
            this.movimiento.uuid = data.uuid;
            this.movimiento.no_Factura = data.no_Factura;
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

    async createMovimiento(movimientoInventario) {
      try {
        const resp = await api.post(
          "/MovimientosInventarios",
          movimientoInventario,
          {
            headers: {
              "Content-Type": "multipart/form-data",
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

    async addMovimiento(id, cantidad, precio_Unitario, importe) {
      try {
        this.listaMovimientoInventario.push({
          inventario_Id: id.value,
          nombre_producto: id.label,
          descripcion: id.descripcion,
          clave: id.clave,
          cantidad: cantidad,
          precio_Unitario: precio_Unitario,
          importe: importe,
        });
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
        let nIndex = this.listaMovimientoInventario.findIndex(
          (x) => x.inventario_Id == id
        );

        this.listaMovimientoInventario.splice(nIndex, 1);
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
    async loadTipoMovimientos() {
      try {
        let resp = await api.get("/TiposMovimientosInventarios");
        let { data } = resp.data;
        this.listTipoMovimientos = data.map((tipo) => {
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
          (x) => x.tipo_Movimiento_Inventario_Id == filtro
        );
        this.listConceptoMovimiento = listData.map((concepto) => {
          return {
            label: concepto.concepto,
            value: concepto.id,
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
    async deleteMovimiento(id) {
      try {
      } catch (error) {}
    },

    //-----------------------------------------------------------
    actualizarModal(valor) {
      this.modal = valor;
    },
    updateEditar(valor) {
      this.isEditar = valor;
    },
    updateCompra(valor) {
      this.isCompra = valor;
    },
  },
});
