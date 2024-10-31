<template>
  <q-dialog
    v-model="modalRecibio"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h5 text-purple-ieen text-bold absolute-center">
          Seleccione personal que recibe
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
      <q-form @submit="onSubmit">
        <q-card-section>
          <div
            class="row"
            v-if="
              movimiento.concepto != null &&
              (movimiento.concepto.includes('Pendiente') ||
                movimiento.concepto == 'Traspaso bodegas')
            "
          >
            <div class="col-12 text-bold">
              Seleccione personal que elaboró traspaso
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pr-sm">
              <q-select
                color="purple-ieen"
                v-model="area_Id_Elaboro"
                :options="list_Areas"
                label="Área que elaboró"
                hint="Seleccione la área que elaboró el traspaso"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'El área es requerida']"
              >
              </q-select>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-select
                color="purple-ieen"
                v-model="personal_Id_Elaboro"
                :options="list_Empleados"
                label="Personal que elaboró"
                hint="Seleccione el personal que elaboró el traspaso"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'El personal es requerido']"
              >
              </q-select>
            </div>
          </div>
          <div class="row">
            <div
              v-if="
                movimiento.concepto != null &&
                (movimiento.concepto.includes('Pendiente') ||
                  movimiento.concepto == 'Traspaso bodegas')
              "
              class="col-12 text-bold"
            >
              <br />
              Seleccione personal que dará visto bueno
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pr-sm">
              <q-select
                color="purple-ieen"
                v-model="area_Id"
                :options="list_Areas"
                label="Área"
                hint="Seleccione una área"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'El área es requerida']"
              >
              </q-select>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-select
                color="purple-ieen"
                v-model="personal_Id"
                :options="list_Empleados"
                label="Personal"
                hint="Seleccione un personal"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'El personal es requerido']"
              >
              </q-select>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-space />
          <div class="col-12 justify-end">
            <div class="text-right q-gutter-xs">
              <q-btn
                label="Cancelar"
                type="reset"
                color="red"
                @click="actualizarModal(false)"
              />
              <q-btn
                label="Descargar"
                icon="download"
                type="submit"
                color="secondary"
                class="q-ml-sm"
              />
            </div>
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar, QSpinnerFacebook } from "quasar";
import { useEmpleadosStore } from "src/stores/empleados_store";
import { onBeforeMount, ref, watch } from "vue";
import { useMovimientoInventario } from "../../../stores/movimiento_inventario";
import EntregaRecepcion from "src/helpers/ValeEntregaRecepcion";

//-----------------------------------------------------------

const $q = useQuasar();
const movimientoInventarioStore = useMovimientoInventario();
const empleadosStore = useEmpleadosStore();
const { modalRecibio, movimiento } = storeToRefs(movimientoInventarioStore);
const { list_Areas, list_Empleados, personal_Id, personal_Id_Elaboro } =
  storeToRefs(empleadosStore);
const area_Id = ref(null);
const area_Id_Elaboro = ref(null);

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------

watch(area_Id, (val) => {
  if (val != null) {
    personal_Id.value = null;
    getEmpleadosByArea(val);
  }
});

watch(area_Id_Elaboro, (val) => {
  if (val != null) {
    personal_Id_Elaboro.value = null;
    getEmpleadosByArea(val);
  }
});

//-----------------------------------------------------------

const cargarData = async () => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  await empleadosStore.loadAreasList();
  $q.loading.hide();
};

const getEmpleadosByArea = async (val) => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  await empleadosStore.loadEmpleadosByArea(val.value, false);
  $q.loading.hide();
};

const actualizarModal = (valor) => {
  movimientoInventarioStore.actualizarModalRecibio(valor);
  area_Id.value = null;
  personal_Id.value = null;
};

const onSubmit = async () => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  await EntregaRecepcion();
  actualizarModal(false);
  $q.loading.hide();
};
</script>
