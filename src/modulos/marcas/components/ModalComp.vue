<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Registro de marca</div>
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
            <q-input
              v-model="marca.nombre"
              label="Nombre de bodega"
              hint="Ingrese nombre de la marca"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'El nombre es requerido']"
            >
            </q-input>
          </div>
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
import { useQuasar } from "quasar";
import { storeToRefs } from "pinia";
import { useMarcaStore } from "src/stores/marcas_store";
import { watch } from "vue";

const $q = useQuasar();
const marcaStore = useMarcaStore();
const { marca, modal, isEditar } = storeToRefs(marcaStore);

const actualizarModal = (valor) => {
  marcaStore.actualizarModal(valor);
  //marcaStore.initMarca();
};

watch(marca.value, (val) => {
  if (val.id != null) {
    console.log("watch", val);
    cargarArea(val);
  }
});

const cargarArea = async (val) => {
  if (marca.nombre == null) {
    console.log("Esto es value, desde cargar area", val);
  }
};
</script>

<style></style>
