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
          @click="actualizarModalFotos(false)"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-section>

      <q-card-section>
        <div
          class="q-pa-md"
          v-if="
            inventario.foto_1 ||
            inventario.foto_2 ||
            inventario.foto_3 ||
            inventario.foto_4
          "
        >
          <q-responsive :ratio="1" class="col">
            <q-carousel
              swipeable
              animated
              v-model="slide"
              thumbnails
              infinite
              class="shadow-10"
            >
              <q-carousel-slide :name="1" :img-src="inventario.foto_1" />
              <q-carousel-slide :name="2" :img-src="inventario.foto_2" />
              <q-carousel-slide :name="3" :img-src="inventario.foto_3" />
              <q-carousel-slide :name="4" :img-src="inventario.foto_4" />
            </q-carousel>
          </q-responsive>
        </div>
        <div v-else class="text-h6">No hay fotos</div>
        <q-space />
        <div class="col-12 justify-end">
          <div class="text-right q-gutter-xs">
            <q-btn
              label="Cancelar"
              type="reset"
              color="negative"
              @click="actualizarModalFotos(false)"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useInventarioStore } from "../../../stores/inventario_store";

//-----------------------------------------------------------

const inventarioStore = useInventarioStore();

const { modalFotos, inventario } = storeToRefs(inventarioStore);
const slide = ref(1);

//-----------------------------------------------------------

const actualizarModalFotos = (valor) => {
  inventarioStore.actualizarModalFotos(valor);
};
</script>
