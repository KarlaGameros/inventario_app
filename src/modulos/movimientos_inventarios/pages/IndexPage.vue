<template>
  <q-page>
    <div class="row bg-grey-1">
      <div class="col-9">
        <div class="q-pa-md q-gutter-sm">
          <div class="text-gray-ieen-1 text-h6">Movimientos Inventario</div>
          <q-breadcrumbs>
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="primary" />
            </template>
            <q-breadcrumbs-el icon="home" label="Inicio" to="/" />
            <q-breadcrumbs-el
              icon="library_books"
              class="text-grey-7"
              label="Movimientos Inventario"
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
    <ModalRecibio />
    <ModalAddAsignacion />
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
import ModalRecibio from "../components/ModalRecibio.vue";
import ModalAddAsignacion from "../components/ModalAddAsignacion.vue";

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
  movimientoInventarioStore.initMovimiento();
  movimientoInventarioStore.initDetalleMovimiento();
  movimientoInventarioStore.actualizarModal(valor);
  $q.loading.hide();
};
</script>
