import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { EncryptStorage } from "storage-encryption";

const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
export const useCatalogoProductoStore = defineStore("catalogo", {
  state: () => ({
    modal: false,
    isEditar: false,
    catalogos: [],
    listCatalogo: [],
    listCatalogoFiltro: [],
    listCatalogosTodos: [],
    catalogo: {
      id: null,
      nombre: null,
      clave: null,
      nombre_Corto: null,
    },
  }),
  actions: {
    //-----------------------------------------------------------
    initCatalago() {
      this.catalogo.id = null;
      this.catalogo.nombre = null;
      this.catalogo.clave = null;
      this.catalogo.nombre_Corto = null;
    },

    //-----------------------------------------------------------
    async loadInformacionCatalago() {
      try {
        let resp = await api.get("/Catalagos");
        let { data } = resp.data;
        let listCatalogo = data.map((catalogo) => {
          return {
            id: catalogo.id,
            nombre: catalogo.nombre,
            clave: catalogo.clave,
            nombre_Corto: catalogo.nombre_Corto,
          };
        });
        this.catalogos = listCatalogo;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------

    async loadCatalogoListNormal() {
      try {
        this.listCatalogo = [];
        let resp = await api.get("/Catalagos");
        let { data } = resp.data;

        let listCatalogo = data.map((catalogo) => {
          return {
            label: `${catalogo.clave} - ${catalogo.nombre}`,
            value: catalogo.id,
          };
        });
        // Encontrar el índice del elemento con label "consumible"
        const indexConsumible = listCatalogo.findIndex(
          (element) => element.label === "EY-99 - Consumibles"
        );

        if (indexConsumible !== -1) {
          // Eliminar la lista "consumible" si se encontró en la lista
          listCatalogo.splice(indexConsumible, 1);
        }

        this.listCatalogo = listCatalogo;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------

    async loadCatalogoFiltro() {
      try {
        this.listCatalogoFiltro = [];
        let resp = await api.get("/Catalagos");
        let { data } = resp.data;

        let listCatalogo = data.map((catalogo) => {
          return {
            label: `${catalogo.clave} - ${catalogo.nombre}`,
            value: catalogo.id,
          };
        });
        const indexConsumible = listCatalogo.findIndex(
          (element) => element.label === "EY-99 - Consumibles"
        );

        if (indexConsumible !== -1) {
          listCatalogo.splice(indexConsumible, 1);
        }

        listCatalogo.splice(0, 0, {
          value: 0,
          label: "Todos",
        });
        this.listCatalogoFiltro = listCatalogo;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async loadCatalago(id) {
      try {
        let resp = null;
        resp = await api.get(`/Catalagos/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            this.catalogo.id = data.id;
            this.catalogo.nombre = data.nombre;
            this.catalogo.clave = data.clave;
            this.catalogo.nombre_Corto = data.nombre_Corto;
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

    async loadCatalogoList(especial) {
      try {
        this.listCatalogosTodos = [];
        let resp = await api.get("/Catalagos");
        let { data } = resp.data;
        let filtro = [];
        if (encryptStorage.decrypt("perfil") == "Personal sin UTIE") {
          filtro = data.filter((x) => x.clave != "EY-02");
        } else {
          filtro = data;
        }
        let listCatalogo = filtro.map((catalogo) => {
          return {
            label: `${catalogo.clave} - ${catalogo.nombre}`,
            value: catalogo.id,
          };
        });
        if (especial == true) {
          listCatalogo.splice(0, 0, {
            value: 0,
            label: "Todos",
          });
        }
        // Encontrar el índice del elemento con label "consumible"
        const indexConsumible = listCatalogo.findIndex(
          (element) => element.label === "EY-99 - Consumibles"
        );
        if (indexConsumible !== -1) {
          // Eliminar la lista "consumible" si se encontró en la lista
          listCatalogo.splice(indexConsumible, 1);
        }
        this.listCatalogosTodos = listCatalogo;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------

    async createCatalogo(catalogo) {
      try {
        const resp = await api.post("/Catalagos", catalogo);
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
    async updateCatalogo(catalogo) {
      try {
        const resp = await api.put(`/Catalagos/${catalogo.id}`, catalogo);
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
    async deleteCatalogo(id) {
      try {
        const resp = await api.delete(`/Catalagos/${id}`);
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
