<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Registro de inventario</div>
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
        <q-form class="row q-col-gutter-xs" @submit="onSubmit">
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-select
              label="Catálogo perteneciente del inventario"
              hint="Selecciona una catalogo"
              lazy-rules
              :rules="[(val) => !!val || 'El catálogo es requerido']"
            >
            </q-select>
          </div>

          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-select
              label="Bodega de resguardo"
              hint="Selecciona una bodega"
              lazy-rules
              :rules="[(val) => !!val || 'La bodega es requerida']"
            >
            </q-select>
          </div>

          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              label="Clave del producto"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'La clave es requerido']"
            >
            </q-input>
          </div>

          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input label="Nombre corto"> </q-input>
          </div>

          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input label="Descripción del producto" autogrow> </q-input>
          </div>

          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-select
              label="Marca"
              hint="Selecciona una marca"
              lazy-rules
              :rules="[(val) => !!val || 'La marca es requerida']"
            >
            </q-select>
          </div>

          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-select
              label="Modelo"
              hint="Selecciona modelo"
              lazy-rules
              :rules="[(val) => !!val || 'El modelo es requerida']"
            >
            </q-select>
          </div>

          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input label="Número de serie"> </q-input>
          </div>

          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input label="Color"> </q-input>
          </div>

          <q-space />
          <div class="col-12 justify-end">
            <div class="text-right q-gutter-xs">
              <q-btn
                label="Cancelar"
                type="reset"
                color="negative"
                @click="actualizarModal(false)"
              />
              <q-btn
                label="Guardar"
                type="submit"
                color="positive"
                class="q-ml-sm"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { onBeforeMount, ref } from "vue";
import { useAuthStore } from "../../../stores/auth_store";
import { useInventarioStore } from "../../../stores/inventario_store";

const $q = useQuasar();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const inventarioStore = useInventarioStore();
const { inventarios } = storeToRefs(inventarioStore);

const { inventario, modal } = storeToRefs(inventarioStore);

const actualizarModal = (valor) => {
  inventarioStore.actualizarModal(valor);
};
</script>

<style></style>
