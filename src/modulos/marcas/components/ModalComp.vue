<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">
          {{ !isEditar ? "Registrar marca" : "Editar marca" }}
        </div>
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
              v-model.trim="marca.clave"
              label="Nombre de la marca"
              hint="Ingrese nombre de la marca"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'El nombre de la marca es requerido']"
            >
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              v-model.trim="marca.descripcion"
              label="Descripción de la marca"
              hint="Ingrese una descripción"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'La descripción es requerido']"
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
import { useAuthStore } from "../../../stores/auth_store";

const $q = useQuasar();
const marcaStore = useMarcaStore();
const authStore = useAuthStore();

const { marca, modal, isEditar } = storeToRefs(marcaStore);

const actualizarModal = (valor) => {
  marcaStore.actualizarModal(valor);
  marcaStore.updateEditar(valor);
  marcaStore.initMarca();
};

const onSubmit = async () => {
  let resp = null;
  $q.loading.show();
  if (isEditar.value == true) {
    resp = await marcaStore.updateMarca(marca.value);
  } else {
    resp = await marcaStore.createMarca(marca.value);
  }
  if (resp.success) {
    $q.notify({
      type: "positive",
      message: resp.data,
    });
    marcaStore.loadInformacionMarca();
    actualizarModal(false);
  } else {
    $q.notify({
      type: "negative",
      message: resp.data,
    });
  }
  $q.loading.hide();
};
</script>

<style></style>
