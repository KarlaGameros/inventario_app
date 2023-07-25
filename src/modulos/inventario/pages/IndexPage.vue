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
          <q-btn
            v-if="modulo == null ? false : modulo.registrar"
            type="button"
            class="q-ma-sm"
            color="purple-ieen"
            icon-right="add_circle_outline"
            label="Nuevo"
            @click="actualizarModal(true)"
          />

          <q-btn
            type="button"
            class="q-ma-sm"
            color="purple-ieen"
            icon-right="print"
            label="Listado de inventario"
            @click="generar()"
          />

          <q-btn
            type="button"
            class="q-ma-sm"
            color="purple-ieen"
            icon-right="print"
            label="Vale resguardo"
            @click="generarVale()"
          />
        </div>
      </div>
    </div>
    <TablaComp />
    <ModalComp />
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../../../stores/auth_store";
import { useInventarioStore } from "src/stores/inventario_store";
import TablaComp from "../components/TablaComp.vue";
import ModalComp from "../components/ModalComp.vue";
import { onBeforeMount } from "vue";
import ReporteListadoInventario from "../../../helpers/ListadoInventario";
import ValeResguardo from "../../../helpers/ValeResguardo";

const $q = useQuasar();
const authStore = useAuthStore();
const inventarioStore = useInventarioStore();
const { modulo } = storeToRefs(authStore);
const siglas = "SI-CAT-INV";

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
  $q.loading.hide();
};

const generar = async () => {
  ReporteListadoInventario();
};

const generarVale = async () => {
  ValeResguardo();
};
</script>

<style></style>
