import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { EncryptStorage } from "storage-encryption";

const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
export const useBodegaStore = defineStore("bodega", {
  state: () => ({
    modal: false,
    isEditar: false,
    listBodega: [],
    bodegas: [],
    areas: [],
    bodega: {
      id: null,
      area_Id: null,
      area: null,
      nombre: null,
      eliminado: null,
    },
  }),
  actions: {
    //-----------------------------------------------------------
    initBodega() {
      this.bodega.id = null;
      this.bodega.area_Id = null;
      this.bodega.area = null;
      this.bodega.nombre = null;
      this.bodega.eliminado = null;
    },

    //-----------------------------------------------------------
    async loadInformacionBodega() {
      try {
        let resp = await api.get("/Bodegas");
        let { data } = resp.data;
        this.bodegas = data.map((bodega) => {
          return {
            value: bodega.id,
            label: bodega.nombre,
            id: bodega.id,
            area: bodega.area,
            nombre: bodega.nombre,
            siglas: bodega.siglas,
            area_Id: bodega.area_Id,
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
    async loadBodega(id) {
      try {
        let resp = null;
        resp = await api.get(`/Bodegas/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            this.bodega.id = data.id;
            this.bodega.area_Id = data.area_Id;
            this.bodega.area = data.area;
            this.bodega.nombre = data.nombre;
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
    async loadAreasList() {
      try {
        let resp = await api.get("/Areas/GetLista");
        let { data } = resp.data;
        let listaArea = data.map((area) => {
          return {
            label: area.label,
            value: area.value,
          };
        });
        this.areas = listaArea;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async loadBodegasList() {
      try {
        let resp = await api.get("/Bodegas");
        let { data } = resp.data;
        let filtro = [];
        if (encryptStorage.decrypt("perfil") == "Personal sin UTIE") {
          filtro = data.filter(
            (x) => x.area != "Unidad Técnica de Informática y Estadística"
          );
        } else {
          filtro = data;
        }
        let list = filtro.map((bodega) => {
          return {
            id: bodega.id,
            area: bodega.area,
            area_Id: bodega.area_Id,
            nombre: bodega.nombre,
            value: bodega.id,
            label: `${bodega.nombre} - ${bodega.siglas}`,
            siglas: bodega.siglas,
          };
        });
        this.listBodega = list.sort((a, b) => a.area_Id - b.area_Id);
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async createBodega(bodega) {
      try {
        const resp = await api.post("/Bodegas", bodega);
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
    async updateBodega(bodega) {
      try {
        const resp = await api.put(`/Bodegas/${bodega.id}`, bodega);
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
    async deleteBodega(id) {
      try {
        const resp = await api.delete(`/Bodegas/${id}`);
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
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    actualizarModal(valor) {
      this.modal = valor;
    },
    updateEditar(valor) {
      this.isEditar = valor;
    },
  },
});
