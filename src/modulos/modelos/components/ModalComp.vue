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
          {{ !isEditar ? "Registrar modelos" : "Editar modelos" }}
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
              v-model.trim="modelo.clave"
              label="Clave del modelo"
              hint="Ingrese clave"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'La clave es requerido']"
            >
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              v-model.trim="modelo.descripcion"
              label="Descripción"
              hint="Ingrese una descripción"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'La descripción es requerida']"
            >
            </q-input>
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

      <q-card-section>
        <TablaModelo />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useModeloStore } from "../../../stores/modelo_store";
import TablaModelo from "./TablaComp.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const modeloStore = useModeloStore();
const { modal, modelo, isEditar, marca_id } = storeToRefs(modeloStore);

//-----------------------------------------------------------

const actualizarModal = (valor) => {
  modeloStore.actualizarModal(valor);
  modeloStore.initModelo();
};

const onSubmit = async () => {
  let resp = null;
  $q.loading.show();
  if (isEditar.value == true) {
    resp = await modeloStore.updateModelo(modelo.value);
  } else {
    resp = await modeloStore.createModelo(modelo.value);
  }
  if (resp.success) {
    $q.notify({
      position: "top-right",
      type: "positive",
      message: resp.data,
    });
    modeloStore.modeloByMarca(marca_id.value);
    modeloStore.initModelo();
    modeloStore.updateEditar(false);
  } else {
    $q.notify({
      position: "top-right",
      type: "negative",
      message: resp.data,
    });
  }
  $q.loading.hide();
};
</script>
