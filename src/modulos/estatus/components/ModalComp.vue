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
          {{ !isEditar ? "Registrar estatus" : "Editar estatus" }}
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
              v-model.trim="estatu.nombre"
              label="Estatus"
              hint="Ingrese estatus"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'El estatus es requerido']"
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
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useQuasar } from "quasar";
import { storeToRefs } from "pinia";
import { useEstatusStore } from "src/stores/estatus_store";

//-----------------------------------------------------------

const $q = useQuasar();
const estatusStore = useEstatusStore();
const { estatu, modal, isEditar } = storeToRefs(estatusStore);

//-----------------------------------------------------------

const actualizarModal = (valor) => {
  estatusStore.actualizarModal(valor);
  estatusStore.updateEditar(valor);
  estatusStore.initEstatus();
};

const onSubmit = async () => {
  let resp = null;
  $q.loading.show();
  if (isEditar.value == true) {
    resp = await estatusStore.updateEstatus(estatu.value);
  } else {
    resp = await estatusStore.createEstatu(estatu.value);
  }

  if (resp.success) {
    $q.notify({
      type: "positive",
      message: resp.data,
    });
    estatusStore.loadInformacionEstatus();
    actualizarModal(false);
  } else {
    $q.notify({
      type: "negative",
      message: resp.data,
    });
    //loading.value = false;
  }
  $q.loading.hide();
};
</script>

<style></style>
