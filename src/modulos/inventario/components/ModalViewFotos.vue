<template>
  <q-dialog
    v-model="modalFotos"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Fotos</div>
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
        <div class="q-col-gutter-md row items-start">
          <div
            v-if="inventario.foto_1"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-img :src="inventario.foto_1">
              <div class="absolute-bottom text-subtitle1 text-center">
                Foto 1
              </div>
            </q-img>
          </div>

          <div
            v-if="inventario.foto_2"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-img :src="inventario.foto_2">
              <div class="absolute-bottom text-subtitle1 text-center">
                Foto 2
              </div>
            </q-img>
          </div>

          <div
            v-if="inventario.foto_3"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-img :src="inventario.foto_3">
              <div class="absolute-bottom text-subtitle1 text-center">
                Foto 3
              </div>
            </q-img>
          </div>

          <div
            v-if="inventario.foto_4"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-img :src="inventario.foto_4">
              <div class="absolute-bottom text-subtitle1 text-center">
                Foto 4
              </div>
            </q-img>
          </div>
        </div>

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
import { useInventarioStore } from "../../../stores/inventario_store";

//-----------------------------------------------------------

const inventarioStore = useInventarioStore();

const { modalFotos, inventario } = storeToRefs(inventarioStore);

//-----------------------------------------------------------

const actualizarModalFotos = (valor) => {
  inventarioStore.actualizarModalFotos(valor);
};
</script>

<style></style>
