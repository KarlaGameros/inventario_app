<template>
  <q-dialog
    v-model="modalPDF"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 1000px; max-width: 80vw">
      <q-card-section class="row">
        <q-space />
        <q-btn
          icon="close"
          @click="mostrarPDF(false)"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-section>

      <q-card-section>
        <iframe :src="pdf" width="100%" height="500"></iframe>
        <div class="col-12 justify-end">
          <div class="text-right q-gutter-xs">
            <q-btn
              label="Cancelar"
              type="reset"
              color="negative"
              @click="mostrarPDF(false)"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useInventarioStore } from "../../../stores/inventario_store";

//-----------------------------------------------------------

const inventarioStore = useInventarioStore();
const { modalPDF, inventario } = storeToRefs(inventarioStore);
const pdf = ref(null);

//-----------------------------------------------------------

watch(inventario.value, (val) => {
  if (val != null) {
    pdf.value = val.ruta_PDF;
  }
});

//-----------------------------------------------------------

const mostrarPDF = (valor) => {
  inventarioStore.actualizarModalPDF(valor);
};
</script>
