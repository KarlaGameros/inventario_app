<template>
  <q-dialog
    v-model="modalFotos"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
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
        <iframe :src="inventario.ruta_PDF" width="100%" height="500"></iframe>
      </q-card-section>
      <q-card-section>
        <div class="col-12 justify-end">
          <div class="text-right q-gutter-xs">
            <q-btn
              label="Cancelar"
              type="reset"
              color="negative"
              @click="actualizarModal(false)"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useAsignacionStore } from "src/stores/asignacion_store";
import { ref } from "vue";

//-----------------------------------------------------------

const asignacionStore = useAsignacionStore();
const { modalVale } = storeToRefs(asignacionStore);

//-----------------------------------------------------------

const actualizarModal = (valor) => {
  asignacionStore.actualizarModalVale(valor);
};
</script>

<style></style>
