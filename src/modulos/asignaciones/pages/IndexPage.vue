<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" to="/" />
            <q-breadcrumbs-el label="Asignaciones" icon="library_books" />
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
            label="Vale resguardo"
            @click="generarVale()"
          />

          <q-btn
            type="button"
            class="q-ma-sm"
            color="purple-ieen"
            icon-right="print"
            label="Vale prestamo"
            @click="generarValePrestamo()"
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
import { useAuthStore } from "../../../stores/auth_store";
import { storeToRefs } from "pinia";
import TablaComp from "../components/TablaComp.vue";
import ModalComp from "../components/ModalComp.vue";
import { useAsignacionStore } from "src/stores/asignacion_store";
import { onBeforeMount } from "vue";
import ValeResguardo from "../../../helpers/ValeResguardo";
import ValePrestamo from "../../../helpers/ValePrestamo";

//-----------------------------------------------------------

const $q = useQuasar();
const authStore = useAuthStore();
const asignacionStore = useAsignacionStore();
const { modulo } = storeToRefs(authStore);
const siglas = "SI-CAT-ASI";

//-----------------------------------------------------------

onBeforeMount(() => {
  leerPermisos();
});

//-----------------------------------------------------------

const leerPermisos = async () => {
  $q.loading.show();
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};

const actualizarModal = (valor) => {
  $q.loading.show();
  asignacionStore.actualizarModal(valor);
  asignacionStore.initAsignacion();
  $q.loading.hide();
};

const generarVale = async () => {
  ValeResguardo();
};

const generarValePrestamo = async () => {
  ValePrestamo();
};

//-----------------------------------------------------------
</script>
