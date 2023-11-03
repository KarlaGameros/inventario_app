import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useProvedores = defineStore("provedores", {
  state: () => ({
    modal: false,
    isEditar: false,
    proveedores: [],
    proveedor: {
      id: null,
      nombre: null,
      razon_Social: null,
      rfc: null,
      telefono: null,
      eMail: null,
      direccion: null,
    },
  }),
  actions: {
    initProvedor() {
      this.proveedor.id = null;
      this.proveedor.nombre = null;
      this.proveedor.razon_Social = null;
      this.proveedor.rfc = null;
      this.proveedor.telefono = null;
      this.proveedor.eMail = null;
      this.proveedor.direccion = null;
    },
    //-----------------------------------------------------------
    async loadInformacionProvedores() {
      try {
        let resp = await api.get("/Proveedores");
        let { data } = resp.data;
        let listProvedores = data.map((proveedor) => {
          return {
            id: proveedor.id,
            nombre: proveedor.nombre,
            razon_Social:
              proveedor.razon_Social.length >= 50
                ? proveedor.razon_Social.slice(0, 50) + "..."
                : proveedor.razon_Social,
            razon_Social_completo: proveedor.razon_Social,
            rfc: proveedor.rfc,
            telefono: proveedor.telefono,
            eMail: proveedor.eMail,
            direccion: proveedor.direccion,
            label: proveedor.nombre,
          };
        });
        this.proveedores = listProvedores;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
        };
      }
    },
    //-----------------------------------------------------------

    async createProveedor(proveedor) {
      try {
        const resp = await api.post("/Proveedores", proveedor);
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

    async loadProveedor(id) {
      try {
        const resp = await api.get(`/Proveedores/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            this.proveedor.id = data.id;
            this.proveedor.nombre = data.nombre;
            this.proveedor.razon_Social = data.razon_Social;
            this.proveedor.rfc = data.rfc;
            this.proveedor.eMail = data.eMail;
            this.proveedor.direccion = data.direccion;
            this.proveedor.telefono = data.telefono;
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

    async updateProveedor(proveedor) {
      try {
        const resp = await api.put(`/Proveedores/${proveedor.id}`, proveedor);
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

    async deleteProveedor(id) {
      try {
        const resp = await api.delete(`/Proveedores/${id}`);
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
    updateEditar(valor) {
      this.isEditar = valor;
    },
  },
});
