<template>
  <q-page>
    <div class="row bg-grey-1">
      <div class="col-9">
        <div class="q-pa-md q-gutter-sm">
          <div class="text-gray-ieen-1 text-h6">Asignaciones</div>
          <q-breadcrumbs>
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="primary" />
            </template>
            <q-breadcrumbs-el icon="home" label="Inicio" to="/" />
            <q-breadcrumbs-el
              icon="library_books"
              class="text-grey-7"
              label="Asignaciones"
            />
          </q-breadcrumbs>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="text-right q-pa-md items-start q-gutter-md">
        <q-btn
          v-if="modulo == null ? false : modulo.registrar"
          type="button"
          label="Vale empleado"
          icon-right="list_alt"
          color="purple-ieen"
          text-color="white"
          class="q-ma-sm"
          @click="generarValeByEmpleado(true)"
        >
        </q-btn>
        <q-btn
          v-if="modulo == null ? false : modulo.registrar"
          type="button"
          icon-right="receipt_long"
          color="purple-ieen"
          text-color="white"
          class="q-ma-sm"
          @click="generarResguardoBodega"
          label="Resguardo por bodega"
        />
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
    <TablaComp />
    <ModalComp />
    <ModalValeBodega />
    <ModalByEmpleado />
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
import ModalByEmpleado from "../components/ModalByEmpleado.vue";

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

const generarValeByEmpleado = async (valor) => {
  asignacionStore.actualizarModalByEmpleado(valor);
};
//-----------------------------------------------------------
</script>
