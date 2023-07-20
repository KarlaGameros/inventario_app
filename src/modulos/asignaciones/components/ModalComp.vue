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
      <q-card-section>
        <q-form class="row q-col-gutter-xs" @submit="onSubmit">
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
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
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-select
              label="Puesto"
              v-model="puesto_Id"
              :options="estatus"
              hint="Selecciona una puesto"
              :lazy-rules="true"
              :rules="[(val) => !!val || 'El puesto es requerido']"
            >
            </q-select>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-select
              v-model="estatus.nombre"
              :options="estatus"
              label="Estatus"
              hint="Selecciona un estatus"
              lazy-rules
              :rules="[(val) => !!val || 'El estatus es requerido']"
            >
            </q-select>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input v-model="date" label="Fecha de caducidad del producto">
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
              v-model="id"
              :options="inventarios"
              :disable="habilitarCombo"
              label="Filtrar inventarios"
              hint="Selecciona un tipo de clasificación"
              :readonly="isConsulta"
            >
            </q-select>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-select
              v-model="id"
              :options="inventarios"
              :disable="habilitarCombo"
              use-input
              @filter="filterConsumible"
              label="mibles"
              hint="Selecciona un consumible"
              :readonly="isConsulta"
            >
            </q-select>
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
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useAuthStore } from "src/stores/auth_store";
import { useEstatusStore } from "src/stores/estatus_store";
import { useInventarioStore } from "src/stores/inventario_store";
import { onBeforeMount, ref, watch } from "vue";
import { useAsignacionStore } from "../../../stores/asignacion_store";

//-----------------------------------------------------------

const estatusStore = useEstatusStore();
const inventarioStore = useInventarioStore();
const { estatus } = storeToRefs(estatusStore);
const { inventarios } = storeToRefs(inventarioStore);
const $q = useQuasar();
const asignacionStore = useAsignacionStore();
const { modal, asignacion, areas, puestos } = storeToRefs(asignacionStore);
const estatus_Id = ref(null);
const area_Id = ref(null);
const puesto_Id = ref(null);
const id = ref(null);

//-----------------------------------------------------------
//Get fecha actual
const dateActual = new Date();
const year = dateActual.getFullYear();
const month = String(dateActual.getMonth() + 1).padStart(2, "0");
const day = String(dateActual.getDate()).padStart(2, "0");
const date = `${year}/${month}/${day}`;

//-----------------------------------------------------------

onBeforeMount(() => {
  estatusStore.loadInformacionEstatus();
  asignacionStore.loadAreasList();
});

//-----------------------------------------------------------

watch(asignacion.value, (val) => {
  if (val.id != null) {
    cargarEstatus(val);
    cargarArea(val);
    cargarPuestos(val);
    cargarInventarios(val);
  }
});

const cargarInventarios = async (val) => {
  if (id.value == null) {
    let inventarioFiltrado = id.value.find((x) => x.value == `${val.id}`);
    id.value = inventarioFiltrado;
  }
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
    let puestoFiltrado = puestos.id.find((x) => x.value == `${val.puesto_Id}`);
    puesto_Id.value = puestoFiltrado;
  }
};

const actualizarModal = (valor) => {
  asignacionStore.actualizarModal(valor);
};
//-----------------------------------------------------------
</script>

<style></style>
