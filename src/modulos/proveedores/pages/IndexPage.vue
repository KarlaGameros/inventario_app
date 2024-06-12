<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" to="/" />
            <q-breadcrumbs-el
              label="Movimiento_Inventario"
              icon="library_books"
            />
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
        </div>
      </div>
    </div>
    <TablaComp />
    <ModalComp />
  </q-page>
</template>

<script setup>
import { onBeforeMount } from "vue";
import { useQuasar } from "quasar";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../../../stores/auth_store";
import { useProvedores } from "src/stores/provedores_store";
import ModalComp from "../components/ModalComp.vue";
import TablaComp from "../components/TablaComp.vue";

//-----------------------------------------------------------

const authStore = useAuthStore();
const proveedoresStore = useProvedores();
const { modulo } = storeToRefs(authStore);
const $q = useQuasar();
const siglas = "SI-CAT-PRO";

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
  proveedoresStore.actualizarModal(valor);
  proveedoresStore.updateEditar(false);
  proveedoresStore.initProvedor();
  $q.loading.hide();
};
</script>
