<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Registro de asignaciones</div>
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
          <div class="row q-col-gutter-xs">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-select
                label="Área"
                v-model="area_Id"
                :options="areas"
                hint="Selecciona una área"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'El área es requerida']"
              >
              </q-select>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-select
                label="Empleado"
                v-model="empleadoId"
                :options="listEmpleados"
                hint="Selecciona una empleado"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'El empleado es requerido']"
              >
              </q-select>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-input
                readonly
                label="Puesto"
                v-model="puesto_Id"
                hint="Puesto"
              >
              </q-input>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-select
                v-model="estatus_Id"
                :options="estatus"
                label="Estatus"
                hint="Selecciona un estatus"
                lazy-rules
                :rules="[(val) => !!val || 'El estatus es requerido']"
              >
              </q-select>
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

            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-select
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
        <q-separator></q-separator>
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
import { useAuthStore } from "src/stores/auth_store";
import { useCatalogoProductoStore } from "src/stores/catalogos_producto_store";
import { useEstatusStore } from "src/stores/estatus_store";
import { useInventarioStore } from "src/stores/inventario_store";
import { onBeforeMount, ref, watch } from "vue";
import { useAsignacionStore } from "../../../stores/asignacion_store";
import TablaAsignacionInventario from "./TablaAsignacionInventario.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const asignacionStore = useAsignacionStore();
const estatusStore = useEstatusStore();
const catalogoStore = useCatalogoProductoStore();
const inventarioStore = useInventarioStore();

const { estatus } = storeToRefs(estatusStore);
const { inventarios, listInventario } = storeToRefs(inventarioStore);
const { listCatalogo } = storeToRefs(catalogoStore);
const {
  modal,
  asignacion,
  areas,
  puestos,
  listaAsignacionInventario,
  listEmpleados,
} = storeToRefs(asignacionStore);

const estatus_Id = ref(null);
const area_Id = ref(null);
const puesto_Id = ref(null);
const inventarioId = ref(null);
const empleadoId = ref(null);
const catalogoId = ref(null);
const opcionesInventario = ref([...listInventario.value]);
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
  inventarioStore.loadInformacionInventarios();
  estatusStore.loadInformacionEstatus();
  asignacionStore.loadAreasList();
  catalogoStore.loadCatalogoList(true);
  catalogoId.value = { value: 0, label: "Todos" };
});

//-----------------------------------------------------------

watch(asignacion.value, (val) => {
  if (val.id != null) {
    cargarEstatus(val);
    cargarArea(val);
    cargarPuestos(val);
  }
});

watch(catalogoId, (val) => {
  inventarioStore.loadListInventario(catalogoId.value.value);
});

watch(area_Id, (val) => {
  if (val != null) {
    asignacionStore.loadEmpleadosByArea(area_Id.value.value);
  }
});

watch(empleadoId, (val) => {
  puesto_Id.value = empleadoId.value.puesto;
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
    let puestoFiltrado = puestos.id.find((x) => x.value == `${val.puesto_Id}`);
    puesto_Id.value = puestoFiltrado;
  }
};

const actualizarModal = (valor) => {
  asignacionStore.actualizarModal(valor);
  asignacionStore.initAsignacion();
  catalogoId.value = { value: 0, label: "Todos" };
};

const limpiarRegistro = () => {
  inventarioId.value = null;
};

//-----------------------------------------------------------

const filterInventario = (val, update) => {
  if (val === "") {
    update(() => {
      opcionesInventario.value = listInventario.value;
    });
    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    opcionesInventario.value = listInventario.value.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
};

const agregarProducto = async () => {
  if (listaAsignacionInventario.value.length == 0) {
    let resp = await asignacionStore.addInventario(inventarioId.value);
    limpiarRegistro();
  } else {
    let filtro = listaAsignacionInventario.value.find(
      (x) => x.inventario_Id == inventarioId.value.value
    );
    if (filtro == undefined) {
      let resp = await asignacionStore.addInventario(inventarioId.value);
      limpiarRegistro();
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
</script>

<style></style>
