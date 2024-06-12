<template>
  <q-dialog
    v-model="modalByEmpleado"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-subtitle1 text-bold">
          Seleccionar personal para descargar el vale
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
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-select filled v-model="area_Id" :options="areas" label="Area" />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-select
              filled
              v-model="empleado_Id"
              :options="listEmpleados"
              label="Personal"
            />
          </div>
          <div class="col-12 justify-end">
            <br />
            <div class="text-right q-gutter-xs">
              <q-btn
                icon-right="close"
                label="Cancelar"
                type="reset"
                color="red"
                @click="actualizarModal(false)"
              />
              <q-btn
                :disable="empleado_Id == null"
                label="Descargar"
                type="submit"
                icon-right="download"
                color="secondary"
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
import { useAsignacionStore } from "src/stores/asignacion_store";
import { useEmpleadosStore } from "src/stores/empleados_store";
import { onBeforeMount, ref, watch } from "vue";
import ValeGeneralResguardo from "../../../helpers/ValeGeneralResguardo";

//-----------------------------------------------------------

const $q = useQuasar();
const asignacionStore = useAsignacionStore();
const empleadosStore = useEmpleadosStore();
const { modalByEmpleado, areas, listEmpleados } = storeToRefs(asignacionStore);
const area_Id = ref(null);
const empleado_Id = ref(null);

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

watch(area_Id, (val) => {
  if (val != null) {
    asignacionStore.loadEmpleadosByArea(val.value);
  }
});

const cargarData = async () => {
  await asignacionStore.loadAreasList();
};

const onSubmit = async () => {
  empleadosStore.initEmpleado();
  await empleadosStore.loadEmpleadoById(empleado_Id.value.value);
  await asignacionStore.loadInventarioByEmpleado(empleado_Id.value.value);
  await ValeGeneralResguardo();
};

const actualizarModal = (valor) => {
  asignacionStore.actualizarModalVale(valor);
};
</script>
