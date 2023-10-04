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
          <q-avatar
            v-if="modulo == null ? false : modulo.registrar"
            color="purple-ieen"
            text-color="white"
            icon="receipt_long"
            class="q-ma-sm"
            @click="generarResguardoBodega()"
          >
            <q-tooltip>Generar resguardo por bodega</q-tooltip>
          </q-avatar>

          <q-btn
            v-if="modulo == null ? false : modulo.registrar"
            type="button"
            class="q-ma-sm"
            color="purple-ieen"
            icon-right="add_circle_outline"
            label="Nuevo"
            @click="actualizarModal(true)"
          />
        </div>
      </div>
    </div>
    <TablaComp />
    <ModalComp />
    <ModalValeBodega />
  </q-page>
</template>

<script setup>
import { onBeforeMount } from "vue";
import { useQuasar } from "quasar";
import { useAuthStore } from "../../../stores/auth_store";
import { storeToRefs } from "pinia";
import { useAsignacionStore } from "src/stores/asignacion_store";
import ModalValeBodega from "../components/ModalValeBodega.vue";
import TablaComp from "../components/TablaComp.vue";
import ModalComp from "../components/ModalComp.vue";

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
  asignacionStore.updateVisualizar(false);
  asignacionStore.initAsignacion();
  asignacionStore.loadEmpleadosByArea(0, false);
  $q.loading.hide();
};

const generarResguardoBodega = async () => {
  asignacionStore.actualizarModalValeBodega(true);
};
//-----------------------------------------------------------
</script>
