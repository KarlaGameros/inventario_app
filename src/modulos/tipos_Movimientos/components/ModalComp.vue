<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 90vw">
      <q-card-section class="row">
        <q-img src="../../../assets/IEEN300.png" width="70px" />
        <div
          class="text-h6 text-gray-ieen-1 text-bold absolute-center text-center"
        >
          {{ movimiento.id == null ? "REGISTRAR TIPO " : "VER TIPO" }}
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
              :disable="movimiento.id != null"
              color="purple-ieen"
              v-model.trim="movimiento.tipo_Movimiento"
              label="Nombre del tipo de movimiento"
              hint="Ingrese tipo de movimiento"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'El tipo de movimiento es requerido']"
            >
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              :disable="movimiento.id != null"
              color="purple-ieen"
              v-model.trim="movimiento.naturaleza"
              label="Naturaleza"
              hint="Ingrese naturaleza"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'La naturaleza es requerido']"
            >
            </q-input>
          </div>
          <div class="col-12 justify-end q-pt-lg">
            <div class="text-right q-gutter-xs">
              <q-btn
                label="Cancelar"
                type="reset"
                color="red"
                icon-right="close"
                @click="actualizarModal(false)"
              />
              <q-btn
                v-if="movimiento.id == null"
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
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useTiposConceptosMovimientos } from "src/stores/tipos-conceptos-movimientos";

//-----------------------------------------------------------

const $q = useQuasar();
const tiposConceptosStore = useTiposConceptosMovimientos();
const { modal, movimiento } = storeToRefs(tiposConceptosStore);

//-----------------------------------------------------------

const actualizarModal = (valor) => {
  tiposConceptosStore.actualizarModal(valor);
  tiposConceptosStore.initMovimiento();
};

const onSubmit = async () => {
  $q.loading.show();
  let resp = await tiposConceptosStore.createTipoMovimiento(movimiento.value);
  if (resp.success) {
    $q.notify({
      position: "top-right",
      type: "positive",
      message: resp.data,
    });
    tiposConceptosStore.loadTiposMovimientos();
    actualizarModal(false);
  } else {
    $q.notify({
      position: "top-right",
      type: "negative",
      message: resp.data,
    });
  }
};
</script>
