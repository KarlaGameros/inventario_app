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
      <q-form @submit="onSubmit" ref="RegistroMovimiento">
        <q-card-section>
          <div class="row">
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
import { useQuasar } from "quasar";
import { useEmpleadosStore } from "src/stores/empleados_store";
import { onBeforeMount, ref, watch } from "vue";
import { useMovimientoInventario } from "../../../stores/movimiento_inventario";
import EntregaRecepcion from "src/helpers/ValeEntregaRecepcion";

//-----------------------------------------------------------

const $q = useQuasar();
const movimientoInventarioStore = useMovimientoInventario();
const empleadosStore = useEmpleadosStore();
const { modalRecibio, movimiento } = storeToRefs(movimientoInventarioStore);
const { list_Areas, list_Empleados, personal_Id } = storeToRefs(empleadosStore);
const area_Id = ref(null);

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------

watch(area_Id, async (val) => {
  if (val != null) {
    personal_Id.value = null;
    await empleadosStore.loadEmpleadosByArea(val.value);
  }
});

//-----------------------------------------------------------

const cargarData = async () => {
  $q.loading.show();
  await empleadosStore.loadAreasList();
  $q.loading.hide();
};

const actualizarModal = (valor) => {
  movimientoInventarioStore.actualizarModalRecibio(valor);
  area_Id.value = null;
  personal_Id.value = null;
};

const onSubmit = async () => {
  $q.loading.show();
  await EntregaRecepcion();
  actualizarModal(false);
  $q.loading.hide();
};
</script>
