<template>
  <q-dialog
    v-model="modalByEmpleado"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <q-img src="../../../assets/IEEN300.png" width="70px" />
        <div
          class="text-h6 text-center text-gray-ieen-1 text-bold absolute-center"
        >
          INVENTARIO ASIGNADO
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
            <q-select
              :lazy-rules="true"
              :rules="[(val) => !!val || 'El área es requerida']"
              v-model="area_Id"
              :options="areas"
              label="Área"
              color="purple-ieen"
            />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-select
              v-model="empleado_Id"
              :options="list_Empleados"
              label="Personal"
              :lazy-rules="true"
              :rules="[(val) => !!val || 'El personal es requerido']"
              color="purple-ieen"
            />
          </div>
          <div v-if="empleado_Id != null" class="col-12">
            <q-table
              :rows="list_Inventario_By_Empleado"
              row-key="name"
              flat
              :columns="columns"
              bordered
              :filter="filter"
            >
              <template v-slot:top-right>
                <q-input
                  borderless
                  dense
                  debounce="300"
                  v-model="filter"
                  placeholder="Search"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template>
            </q-table>
          </div>
          <div class="col-12 justify-end">
            <br />
            <div class="text-right q-gutter-xs">
              <q-btn
                icon-right="close"
                label="Salir"
                type="reset"
                color="red"
                @click="actualizarModal(false)"
              />
              <q-btn
                v-if="empleado_Id != null"
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
const { list_Empleados } = storeToRefs(empleadosStore);
const { modalByEmpleado, areas, list_Inventario_By_Empleado } =
  storeToRefs(asignacionStore);
const area_Id = ref(null);
const empleado_Id = ref(null);
const filter = ref("");

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------

watch(area_Id, (val) => {
  if (val != null) {
    empleado_Id.value = null;
    getEmpleadosByArea(val);
  }
});

watch(empleado_Id, (val) => {
  if (val != null) {
    getInventarioByEmpleado(val);
  }
});

//-----------------------------------------------------------

const cargarData = async () => {
  await asignacionStore.loadAreasList();
};

const onSubmit = async () => {
  await ValeGeneralResguardo();
};

const getEmpleadosByArea = async (val) => {
  await empleadosStore.loadEmpleadosByArea(val.value, false);
};

const getInventarioByEmpleado = async () => {
  empleadosStore.initEmpleado();
  await empleadosStore.loadEmpleadoById(empleado_Id.value.value);
  await asignacionStore.loadInventarioByEmpleado(empleado_Id.value.value);
};

const actualizarModal = (valor) => {
  area_Id.value = null;
  empleado_Id.value = null;
  list_Inventario_By_Empleado.value = [];
  asignacionStore.actualizarModalVale(valor);
};

const columns = [
  {
    name: "folio_Asignacion",
    align: "center",
    label: "Folio de asignación",
    field: "folio_Asignacion",
    sortable: true,
  },
  {
    name: "catalago",
    align: "center",
    label: "Catalago",
    field: "catalago",
    sortable: true,
  },
  {
    name: "clave",
    align: "center",
    label: "Clave",
    field: "clave",
    sortable: true,
  },
  {
    name: "nombre_Corto",
    align: "center",
    label: "Nombre Corto",
    field: "nombre_Corto",
    sortable: true,
  },
  {
    name: "descripcion",
    align: "center",
    label: "Descripcion",
    field: "descripcion",
    sortable: true,
  },
  {
    name: "numero_Serie",
    align: "center",
    label: "Numero Serie",
    field: "numero_Serie",
    sortable: true,
  },
  {
    name: "bodega",
    align: "center",
    label: "Bodega",
    field: "bodega",
    sortable: true,
  },
  {
    name: "marca",
    align: "center",
    label: "Marca",
    field: "marca",
    sortable: true,
  },
  {
    name: "modelo",
    align: "center",
    label: "Modelo",
    field: "modelo",
    sortable: true,
  },
];
</script>
