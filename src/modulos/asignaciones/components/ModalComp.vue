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
          {{
            !isEditar && !isShow
              ? "Registrar de asignación"
              : isEditar
              ? "Editar asignación"
              : "Ver asignación"
          }}
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
                v-if="!isShow"
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
                v-if="habilitar === true || (!isEditar && !isShow)"
                label="Empleado"
                v-model="empleadoId"
                :options="listEmpleados"
                hint="Selecciona una empleado"
              >
              </q-select>
              <q-input
                v-if="isEditar && habilitar == false"
                v-model="asignacion.empleado"
                label="Empleado"
                @click="cambiar"
              >
              </q-input>
              <q-input
                v-if="isShow"
                readonly
                v-model="asignacion.empleado"
                label="Empleado"
              >
              </q-input>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-input
                v-if="habilitar === true || (!isEditar && !isShow)"
                readonly
                label="Puesto"
                v-model="puesto"
                hint="Puesto"
              >
              </q-input>
              <q-input
                v-if="(isEditar && habilitar == false) || isShow"
                readonly
                v-model="asignacion.puesto"
                label="Puesto"
              >
              </q-input>
            </div>

            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-select
                v-show="!isShow"
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
                v-show="!isShow"
                v-model="inventarioId"
                :options="opcionesInventario"
                use-input
                @filter="filterInventario"
                label="Productos"
                hint="Selecciona un producto"
              >
              </q-select>
            </div>
            <q-space />
            <div class="col-12 justify-end">
              <div class="text-right q-gutter-xs">
                <q-btn
                  v-if="!isShow"
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
                v-if="!isShow"
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
const { listCatalogo } = storeToRefs(catalogoStore);
const {
  modal,
  asignacion,
  areas,
  puestos,
  listaAsignacionInventario,
  listEmpleados,
  isEditar,
  isShow,
} = storeToRefs(asignacionStore);

const estatus_Id = ref(null);
const area_Id = ref(null);
const puesto_Id = ref(null);
const puesto = ref(null);
const inventarioId = ref(null);
const empleadoId = ref(null);
const catalogoId = ref(null);
const opcionesInventario = ref([...inventarios.value]);
const habilitarButton = ref(null);
const habilitar = ref(false);
//-----------------------------------------------------------
//Get fecha actual
const dateActual = new Date();
const year = dateActual.getFullYear();
const month = String(dateActual.getMonth() + 1).padStart(2, "0");
const day = String(dateActual.getDate()).padStart(2, "0");
const hours = String(dateActual.getHours());
const minutes = String(dateActual.getMinutes());
const seconds = String(dateActual.getSeconds());
const date = ref(`${year}/${month}/${day} ${hours}:${minutes}:${seconds}`);

const isSmallScreen = ref(window.matchMedia("(max-width: 768px)").matches);
const editar = ref(false);
//-----------------------------------------------------------

onBeforeMount(() => {
  inventarioStore.loadListInventario(0);
  estatusStore.loadInformacionEstatus();
  catalogoStore.loadCatalogoListNormal();
  catalogoId.value = { value: 0, label: "Todos" };
  //getDateActual();
});

//-----------------------------------------------------------
watch(
  () => window.innerWidth,
  (width) => {
    isSmallScreen.value = width <= 768;
  }
);

watch(asignacion.value, (val) => {
  if (val.id != null) {
    cargarEstatus(val);
    cargarArea(val);
    cargarPuestos(val);
    cargarFecha(val);
    empleadoId.value = val.empleado_Id;
    puesto_Id.value = val.puesto_Id;
    editar.value = true;
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
    asignacionStore.loadEmpleadosByArea(area_Id.value.value, false);
    empleadoId.value = null;
    cargarEmpleado(empleadoId);
  }
});

watch(empleadoId, (val) => {
  if (val != null) {
    puesto.value = empleadoId.value.puesto;
    puesto_Id.value = val.puesto_Id;
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
const cambiar = () => {
  habilitar.value = true;
};
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

const cargarEmpleado = async (val) => {
  if (empleadoId.value == null) {
    let empleadoFiltrado = listEmpleados.value.find(
      (x) => x.value == `${val.empleado_Id}`
    );
    empleadoId.value = empleadoFiltrado;
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
  habilitar.value = false;
  editar.value = false;
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
    if (editar.value == true) {
      await asignacionStore.createDetalleAsignacion(inventarioId.value);
      await asignacionStore.addInventario(inventarioId.value);
    } else {
      await asignacionStore.addInventario(inventarioId.value);
    }

    inventarioId.value = null;
  } else {
    let filtro = listaAsignacionInventario.value.find(
      (x) => x.inventario_Id == inventarioId.value.value
    );
    if (filtro == undefined) {
      if (editar.value == true) {
        await asignacionStore.createDetalleAsignacion(inventarioId.value);
        await asignacionStore.addInventario(inventarioId.value);
      } else {
        await asignacionStore.addInventario(inventarioId.value);
      }
      inventarioId.value = null;
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
  if (empleadoId.value == undefined) {
    asignacion.value.empleado_Id = asignacion.value.empleado_Id;
    asignacion.value.puesto_Id = asignacion.value.puesto_Id;
  } else {
    asignacion.value.empleado_Id = empleadoId.value.value;
    asignacion.value.puesto_Id = puesto_Id.value;
  }
  asignacion.value.eliminado = false;
  asignacion.value.fecha_Asignacion = date.value;
  asignacion.value.detalle = listaAsignacionInventario.value;
  if (isEditar.value == true) {
    resp = await asignacionStore.updateAsignacion(asignacion.value);
  } else {
    resp = await asignacionStore.createAsignacion(asignacion.value);
    editar.value = false;
  }
  if (resp.success) {
    $q.notify({
      position: "top-right",
      type: "positive",
      message: resp.data,
    });
    actualizarModal(false);
    asignacionStore.loadInformacionAsignaciones();
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

<style></style>
