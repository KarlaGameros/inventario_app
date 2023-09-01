<template>
  <q-dialog
    v-model="modalVerInventario"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 400px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Ver inventario</div>
        <q-space />

        <q-btn
          icon="close"
          @click="actualizarModal(false)"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-section>
      <q-card-section>
        <q-avatar
          rounded
          size="100px"
          font-size="82px"
          color="grey"
          class="position-center"
          text-color="white"
          icon="laptop_mac"
        />
        <q-timeline color="purple">
          <q-timeline-entry title="Clave">
            <div>abc</div>
          </q-timeline-entry>

          <q-timeline-entry title="Número de serie">
            <div>Lorem</div>
          </q-timeline-entry>

          <q-timeline-entry title="Descripción">
            <div>Lorem</div>
          </q-timeline-entry>

          <q-timeline-entry title="Marca">
            <div>Lorem</div>
          </q-timeline-entry>

          <q-timeline-entry title="Modelo">
            <div>Lorem</div>
          </q-timeline-entry>

          <q-timeline-entry title="Color">
            <div>Lorem</div>
          </q-timeline-entry>
        </q-timeline>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useEntregaRecepcionStore } from "src/stores/entrega-recepcion-store";

const entregaRecepcionStore = useEntregaRecepcionStore();
const { modalVerInventario } = storeToRefs(entregaRecepcionStore);

const actualizarModal = (valor) => {
  entregaRecepcionStore.actualizarModalVerInventario(valor);
};
</script>

<style></style>
