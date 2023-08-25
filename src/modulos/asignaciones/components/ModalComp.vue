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
          {{ !isEditar ? "Registrar de asignación" : "Editar asignación" }}
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
      <q-form @submit="registrar">
        <q-card-section>
          <div class="row q-col-gutter-xs">
            <div v-if="isEditar" class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-input readonly v-model="asignacion.estatus" label="Estatus">
              </q-input>
            </div>

            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-input v-model="date" label="Fecha de asignación">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="date" color="purple-3">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Cerrar"
                            color="purple-3"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-select
                v-if="!isEditar"
                label="Área"
                v-model="area_Id"
                :options="areas"
                hint="Selecciona una área"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'El área es requerida']"
              >
              </q-select>
              <q-input v-else readonly v-model="asignacion.area" label="Área">
              </q-input>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-select
                v-if="!isEditar"
                label="Empleado"
                v-model="empleadoId"
                :options="listEmpleados"
                hint="Selecciona una empleado"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'El empleado es requerido']"
              >
              </q-select>
              <q-input
                v-else
                readonly
                v-model="asignacion.empleado"
                label="Empleado"
              >
              </q-input>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-input
                v-if="!isEditar"
                readonly
                label="Puesto"
                v-model="puesto_Id"
                hint="Puesto"
              >
              </q-input>
              <q-input
                v-else
                readonly
                v-model="asignacion.puesto"
                label="Puesto"
              >
              </q-input>
            </div>

            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-select
                v-if="!isEditar"
                v-model="catalogoId"
                :options="listCatalogo"
                label="Catálogo perteneciente del inventario"
                hint="Selecciona una catalogo"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'El catálogo es requerido']"
              >
              </q-select>
            </div>

            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-select
                v-if="!isEditar"
                v-model="inventarioId"
                :options="opcionesInventario"
                use-input
                @filter="filterInventario"
                label="Productos"
                hint="Selecciona un producto"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'El inventario es requerido']"
              >
              </q-select>
            </div>
            <q-space />
            <div class="col-12 justify-end">
              <div class="text-right q-gutter-xs">
                <q-btn
                  v-if="!isEditar"
                  icon-right="add"
                  label="Agregar"
                  color="positive"
                  class="q-ml-sm"
                  @click="agregarProducto()"
                />
              </div>
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <TablaAsignacionInventario />
        </q-card-section>
        <q-card-section>
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
                v-if="!isEditar"
                :disable="habilitarButton"
                label="Guardar"
                type="submit"
                color="positive"
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
import { useCatalogoProductoStore } from "src/stores/catalogos_producto_store";
import { useEstatusStore } from "src/stores/estatus_store";
import { useInventarioStore } from "src/stores/inventario_store";
import { onBeforeMount, ref, watch, watchEffect } from "vue";
import { useAsignacionStore } from "../../../stores/asignacion_store";
import TablaAsignacionInventario from "./TablaAsignacionInventario.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const asignacionStore = useAsignacionStore();
const estatusStore = useEstatusStore();
const catalogoStore = useCatalogoProductoStore();
const inventarioStore = useInventarioStore();

const { estatus } = storeToRefs(estatusStore);
const { inventarios } = storeToRefs(inventarioStore);
const { catalogos, listCatalogo } = storeToRefs(catalogoStore);
const { listMarca } = storeToRefs();
const {
  modal,
  asignacion,
  areas,
  puestos,
  listaAsignacionInventario,
  listEmpleados,
  isEditar,
} = storeToRefs(asignacionStore);

const estatus_Id = ref(null);
const area_Id = ref(null);
const puesto_Id = ref(null);
const inventarioId = ref(null);
const empleadoId = ref(null);
const catalogoId = ref(null);
const opcionesInventario = ref([...inventarios.value]);
const habilitarButton = ref(null);
//-----------------------------------------------------------
//Get fecha actual
const dateActual = new Date();
const year = dateActual.getFullYear();
const month = String(dateActual.getMonth() + 1).padStart(2, "0");
const day = String(dateActual.getDate()).padStart(2, "0");
const date = ref(`${year}/${month}/${day}`);
//-----------------------------------------------------------

onBeforeMount(() => {
  inventarioStore.loadListInventario(0);
  estatusStore.loadInformacionEstatus();
  asignacionStore.loadAreasList();
  catalogoStore.loadCatalogoListNormal();
  catalogoId.value = { value: 0, label: "Todos" };
  //getDateActual();
});

//-----------------------------------------------------------

watch(asignacion.value, (val) => {
  if (val.id != null) {
    cargarEstatus(val);
    cargarArea(val);
    cargarPuestos(val);
    cargarFecha(val);
  }
});

watch(catalogoId, (val) => {
  if (val != null) {
    inventarioId.value = null;
    inventarioStore.loadListInventario(val.value);
  }
});

watch(area_Id, (val) => {
  if (val != null) {
    asignacionStore.loadEmpleadosByArea(area_Id.value.value);
  }
});

watch(empleadoId, (val) => {
  if (val != null) {
    puesto_Id.value = empleadoId.value.puesto;
  }
});

watchEffect(() => {
  if (listaAsignacionInventario.value.length > 0) {
    habilitarButton.value = false;
  } else {
    habilitarButton.value = true;
  }
});

//-----------------------------------------------------------

const cargarEstatus = async (val) => {
  if (estatus_Id.value == null) {
    let estatusFiltrado = estatus.value.find(
      (x) => x.value == `${val.estatus_Id}`
    );
    estatus_Id.value = estatusFiltrado;
  }
};

const cargarArea = async (val) => {
  if (area_Id.value == null) {
    let areaFiltrado = areas.value.find((x) => x.value == `${val.area_Id}`);
    area_Id.value = areaFiltrado;
  }
};

const cargarPuestos = async (val) => {
  if (puesto_Id.value == null) {
    let puestoFiltrado = puestos.value.find(
      (x) => x.value == `${val.puesto_Id}`
    );
    puesto_Id.value = puestoFiltrado;
  }
};

const cargarFecha = async () => {
  const fechaOriginal = asignacion.value.fecha_Asignacion;
  const dateActual = fechaOriginal.split(/[/ ]/);
  const day = dateActual[0];
  const month = dateActual[1];
  const year = dateActual[2];
  date.value = `${year}/${month}/${day}`;
};

// const getDateActual = async () => {
//   const dateActual = new Date();
//   const year = dateActual.getFullYear();
//   const month = String(dateActual.getMonth() + 1).padStart(2, "0");
//   const day = String(dateActual.getDate()).padStart(2, "0");
//   date.value = ref(`${year}/${month}/${day}`);
// };

const actualizarModal = (valor) => {
  area_Id.value = null;
  empleadoId.value = null;
  puesto_Id.value = null;
  catalogoId.value = null;
  inventarioId.value = null;
  opcionesInventario.value = null;
  //getDateActual();
  catalogoId.value = { value: 0, label: "Todos" };
  asignacionStore.actualizarModal(valor);
  asignacionStore.initAsignacion();
};
//-----------------------------------------------------------

const filterInventario = (val, update) => {
  if (val === "") {
    update(() => {
      opcionesInventario.value = inventarios.value;
    });
    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    opcionesInventario.value = inventarios.value.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
};

const agregarProducto = async () => {
  if (listaAsignacionInventario.value.length == 0) {
    await asignacionStore.addInventario(inventarioId.value);
  } else {
    let filtro = listaAsignacionInventario.value.find(
      (x) => x.inventario_Id == inventarioId.value.value
    );
    if (filtro == undefined) {
      await asignacionStore.addInventario(inventarioId.value);
    } else {
      $q.dialog({
        title: "Atención",
        message: "El producto ya se agrego",
        icon: "Warning",
        persistent: true,
        transitionShow: "scale",
        transitionHide: "scale",
      });
    }
  }
};

//-----------------------------------------------------------

const registrar = async () => {
  let resp = null;
  $q.loading.show();
  asignacion.value.area_Id = area_Id.value.value;
  asignacion.value.empleado_Id = empleadoId.value.value;
  asignacion.value.puesto_Id = empleadoId.value.puesto_Id;
  asignacion.value.eliminado = false;
  asignacion.value.fecha_Asignacion = date.value;
  asignacion.value.detalle = listaAsignacionInventario.value;
  if (isEditar == true) {
  } else {
    resp = await asignacionStore.createAsignacion(asignacion.value);
  }

  if (resp.success) {
    $q.notify({
      type: "positive",
      message: resp.data,
    });
    //actualizarModal(false);
    asignacionStore.loadInformacionAsignaciones();
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
