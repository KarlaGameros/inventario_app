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
    <ModalFotos />
    <ModalVerInventario />
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../../../stores/auth_store";
import { useMovimientoInventario } from "src/stores/movimiento_inventario";
import { onBeforeMount } from "vue";
import TablaComp from "../components/TablaComp.vue";
import ModalComp from "../components/ModalComp.vue";
import ModalVerInventario from "src/modulos/entrega_recepcion/components/ModalVerInventario.vue";
import ModalFotos from "../components/ModalFotos.vue";

//-----------------------------------------------------------

const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const $q = useQuasar();
const movimientoInventarioStore = useMovimientoInventario();
const siglas = "SI-MOV-INV";

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
  movimientoInventarioStore.actualizarModal(valor);
  $q.loading.hide();
};
</script>

<style></style>
