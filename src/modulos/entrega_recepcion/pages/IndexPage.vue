<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" to="/" />
            <q-breadcrumbs-el
              label="Entrega a recepción"
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
import { useAuthStore } from "../../../stores/auth_store";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useEntregaRecepcionStore } from "src/stores/entrega-recepcion-store";
import TablaComp from "../components/TablaComp.vue";
import ModalComp from "../components/ModalComp.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const authStore = useAuthStore();
const entregaRecepcionStore = useEntregaRecepcionStore();
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
  entregaRecepcionStore.actualizarModal(valor);
  $q.loading.hide();
};

//-----------------------------------------------------------
</script>

<style></style>
