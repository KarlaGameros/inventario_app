<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 90vw">
      <q-card-section class="row"
        ><q-img src="../../../assets/IEEN300.png" width="70px" />
        <div
          class="text-h6 text-gray-ieen-1 text-bold absolute-center text-center"
        >
          {{ !isEditar ? "REGISTRAR ESTATUS" : "EDITAR ESTATUS" }}
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
              color="purple-ieen"
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
          <div class="col-12 justify-end q-pt-lg">
            <div class="text-right q-gutter-xs">
              <q-btn
                icon-right="close"
                label="Cancelar"
                type="reset"
                color="red"
                @click="actualizarModal(false)"
              />
              <q-btn
                icon-right="save"
                label="Guardar"
                type="submit"
                color="secondary"
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
      position: "top-right",
      type: "positive",
      message: resp.data,
    });
    estatusStore.loadInformacionEstatus();
    actualizarModal(false);
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
