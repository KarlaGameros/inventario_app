<template>
  <q-dialog
    v-model="modalValeBodega"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 400px; max-width: 40vw">
      <q-card-section class="row">
        <div class="text-h6">Seleccione una bodega</div>
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
              v-model="bodega_Id"
              :options="listBodega"
              label="Bodega"
              hint="Selecciona una bodega"
              lazy-rules
              :rules="[(val) => !!val || 'La bodega es requerida']"
            >
            </q-select>
          </div>
          <div class="col-12 justify-end">
            <div class="text-right q-gutter-xs">
              <q-btn
                label="Cancelar"
                type="reset"
                color="red"
                @click="actualizarModal(false)"
              />
              <q-btn
                label="Generar"
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
import { useAsignacionStore } from "src/stores/asignacion_store";
import { useBodegaStore } from "src/stores/bodega_store";
import { onBeforeMount, ref, watch } from "vue";
import { useEmpleadosStore } from "src/stores/empleados_store";
import ReporteBodega from "../../../helpers/ValeByBodega";
//-----------------------------------------------------------

const $q = useQuasar();
const bodegaStore = useBodegaStore();
const asignacionStore = useAsignacionStore();
const empleadoStore = useEmpleadosStore();
const { listBodega } = storeToRefs(bodegaStore);
const { asignacion, modalValeBodega } = storeToRefs(asignacionStore);
const { empleado } = storeToRefs(empleadoStore);
const bodega_Id = ref(null);
//Get fecha actual
const dateActual = new Date();
const year = dateActual.getFullYear();
const month = String(dateActual.getMonth() + 1).padStart(2, "0");
const day = String(dateActual.getDate()).padStart(2, "0");
const hours = String(dateActual.getHours()).padStart(2, "0");
const minutes = String(dateActual.getMinutes()).padStart(2, "0");
const seconds = String(dateActual.getSeconds()).padStart(2, "0");
const date = ref(`${year}/${month}/${day} ${hours}:${minutes}:${seconds}`);

//-----------------------------------------------------------

onBeforeMount(() => {
  bodegaStore.loadBodegasList();
});

watch(bodega_Id, (val) => {
  if (val != null) {
    cargarResponsable(val);
  }
});
//-----------------------------------------------------------

const cargarResponsable = async (val) => {
  $q.loading.show();
  await empleadoStore.loadResponsableByArea(val.area_Id);
  $q.loading.hide();
};

const actualizarModal = (valor) => {
  empleadoStore.initEmpleado();
  asignacionStore.actualizarModalValeBodega(valor);
};

const onSubmit = async () => {
  let resp = null;
  let respVale = null;
  let fecha = null;
  $q.loading.show();
  if (bodega_Id.value != null) {
    asignacion.value.empleado_Id = empleado.value.id;
    asignacion.value.fecha_Asignacion = date.value;
    asignacion.value.puesto_Id = empleado.value.puesto_Id;
    asignacion.value.area_Id = empleado.value.area_Id;
    asignacion.value.area = empleado.value.area;
    asignacion.value.empleado = empleado.value.nombres;
    asignacion.value.puesto = empleado.value.puesto;
    asignacion.value.tipo = "Bodega";
    asignacion.value.bodega_Id = bodega_Id.value.value;
    resp = await asignacionStore.createAsignacion(asignacion.value);
    fecha = resp.fecha;
    await asignacionStore.valeByBodega(bodega_Id.value.value, fecha);
    asignacionStore.loadAsignacion(resp.id);
  }
  if (resp.success === true) {
    respVale = await asignacionStore.inventariosByFecha(fecha);
    if (respVale.success === true) {
      asignacionStore.actualizarModalValeBodega(false);
      asignacionStore.loadInformacionAsignaciones();
      ReporteBodega();
    }
  } else {
    $q.notify({
      position: "top-right",
      type: "negative",
      message: "Ocurrió un problema",
    });
  }
  $q.loading.hide();
};
</script>
