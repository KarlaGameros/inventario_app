<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" to="/" />
            <q-breadcrumbs-el label="Inventario" icon="library_books" />
          </q-breadcrumbs>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="text-right q-pa-md items-start q-gutter-md">
          <q-avatar
            v-if="modulo == null ? false : modulo.registrar"
            type="button"
            class="q-ma-sm"
            color="purple-ieen"
            label="Nuevo"
            @click="actualizarModal(true)"
            text-color="white"
            icon="add"
          >
            <q-tooltip>Nuevo</q-tooltip>
          </q-avatar>

          <q-avatar
            color="purple-ieen"
            text-color="white"
            icon="print"
            class="q-ma-sm"
            @click="generar()"
          >
            <q-tooltip>Imprimir listado de inventario</q-tooltip>
          </q-avatar>

          <q-avatar
            color="purple-ieen"
            text-color="white"
            icon="qr_code_2"
            class="q-ma-sm"
            @click="generarQR()"
          >
            <q-tooltip>Generar QR nuevos</q-tooltip>
          </q-avatar>

          <q-avatar
            v-if="modulo == null ? false : modulo.registrar"
            type="button"
            class="q-ma-sm"
            color="purple-ieen"
            label="Nuevo"
            @click="asignarFactura(true)"
            text-color="white"
            icon="fact_check"
          >
            <q-tooltip>Asignar factura</q-tooltip>
          </q-avatar>
        </div>
      </div>
    </div>
    <TablaComp />
    <ModalComp />
    <ModalFactura />
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../../../stores/auth_store";
import { useInventarioStore } from "src/stores/inventario_store";
import { onBeforeMount, ref } from "vue";
import ReporteListadoInventario from "../../../helpers/ListadoInventario";
import TablaComp from "../components/TablaComp.vue";
import ModalComp from "../components/ModalComp.vue";
import ModalFactura from "../components/ModalFactura.vue";

const $q = useQuasar();
const authStore = useAuthStore();
const inventarioStore = useInventarioStore();
const { modulo, inventario } = storeToRefs(authStore);
const siglas = "SI-CAT-INV";
const botonQR = ref(true);

onBeforeMount(() => {
  leerPermisos();
});

const leerPermisos = async () => {
  $q.loading.show();
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};

const actualizarModal = (valor) => {
  $q.loading.show();
  inventarioStore.actualizarModal(valor);
  inventarioStore.updateEditar(false);
  inventarioStore.initInventario();
  $q.loading.hide();
};

const generar = async () => {
  $q.loading.show({
    message: "Cargando...",
  });
  setTimeout(() => {
    $q.loading.hide();
    ReporteListadoInventario();
  }, 1000);
};

const generarQR = async () => {
  $q.loading.show();
  let resp = null;
  resp = await inventarioStore.generarPDFmasivo();
  if (resp.success == true) {
    inventarioStore.actualizarModalPDF(true);
  } else {
    $q.dialog({
      title: "Atención",
      message: "No hay códigos QR nuevos",
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
    });
  }

  $q.loading.hide();
};

const asignarFactura = async (valor) => {
  $q.loading.show();
  inventarioStore.loadSinFactura();
  inventarioStore.actualizarModalFactura(valor);
  $q.loading.hide();
};
</script>

<style></style>
