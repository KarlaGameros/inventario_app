<template>
  <div class="row">
    <div class="col">
      <q-table
        :rows="listaAsignacionInventario"
        :columns="columns"
        :filter="filter"
        :pagination="pagination"
        row-key="id"
        rows-per-page-label="Filas por pagina"
        no-data-label="No hay registros"
      >
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            v-model="filter"
            placeholder="Buscar.."
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <div v-if="col.name === 'inventario_Id'">
                <q-btn
                  :disable="isShow == true"
                  flat
                  round
                  color="purple-ieen"
                  icon="cancel"
                  @click="eliminar(col.value)"
                >
                  <q-tooltip>Eliminar inventario</q-tooltip>
                </q-btn>
              </div>
              <label v-else>{{ col.value }}</label>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useAsignacionStore } from "src/stores/asignacion_store";
import { onBeforeMount, ref, watch } from "vue";

//-----------------------------------------------------------

const $q = useQuasar();
const asignacionStore = useAsignacionStore();
const { listaAsignacionInventario, isEditar, isShow, areas, listEmpleados } =
  storeToRefs(asignacionStore);
const area_Id = ref(null);
const empleado_Id = ref(null);

//-----------------------------------------------------------

onBeforeMount(() => {
  asignacionStore.loadAreasList();
});

//-----------------------------------------------------------

watch(area_Id, (val) => {
  if (val != null) {
    asignacionStore.loadEmpleadosByArea(area_Id.value.value);
    empleado_Id.value = null;
  }
});

watch(empleado_Id, (val) => {
  if (val != null) {
    asignacionStore.asignacionByEmpleado(val.value);
  }
});

//-----------------------------------------------------------
const columns = [
  {
    name: "empleado",
    align: "center",
    label: "Empleado",
    field: "empleado",
    sortable: true,
  },
  {
    name: "estatus",
    align: "center",
    label: "Estatus",
    field: "estatus",
    sortable: false,
  },
  {
    name: "fecha_Asignacion",
    align: "center",
    label: "Fecha de asignación",
    field: "fecha_Asignacion",
    sortable: false,
  },
  {
    name: "fecha_Registro",
    align: "center",
    label: "Fecha de registro",
    field: "fecha_Registro",
    sortable: false,
  },
];
const pagination = ref({
  //********** */
  page: 1,
  rowsPerPage: 25,
  sortBy: "name",
  descending: false,
});

const filter = ref("");

//-----------------------------------------------------------
</script>

<style></style>
