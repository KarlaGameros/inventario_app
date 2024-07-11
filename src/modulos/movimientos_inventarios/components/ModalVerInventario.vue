<template>
  <q-dialog
    v-model="modalVerInv"
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
        <q-avatar rounded size="150px" v-if="inventario.foto_1_URL != null">
          <img :src="inventario.foto_1_URL" />
        </q-avatar>
        <q-timeline color="purple-4">
          <q-timeline-entry title="Clave">
            <div>{{ inventario.clave }}</div>
          </q-timeline-entry>
          <q-timeline-entry title="Número de serie">
            <div>{{ inventario.numero_Serie }}</div>
          </q-timeline-entry>
          <q-timeline-entry title="Descripción">
            <div>{{ inventario.descripcion }}</div>
          </q-timeline-entry>
          <q-timeline-entry title="Marca">
            <div>{{ inventario.marca }}</div>
          </q-timeline-entry>
          <q-timeline-entry title="Modelo">
            <div>{{ inventario.modelo }}</div>
          </q-timeline-entry>
          <q-timeline-entry title="Color">
            <div>{{ inventario.color }}</div>
          </q-timeline-entry>
        </q-timeline>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useMovimientoInventario } from "src/stores/movimiento_inventario";

//-----------------------------------------------------------

const movimientoInventarioStore = useMovimientoInventario();
const { modalVerInv, inventario } = storeToRefs(movimientoInventarioStore);

//-----------------------------------------------------------

const actualizarModal = (valor) => {
  movimientoInventarioStore.actualizarVerInventario(valor);
};
</script>
