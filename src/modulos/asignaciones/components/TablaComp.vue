<template>
  <div class="row">
    <div class="col">
      <q-table
        :rows="asignaciones"
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
              <div v-if="col.name === 'id'">
                <q-btn
                  flat
                  round
                  color="purple-ieen"
                  icon="search"
                  @click="visualizar(col.value)"
                >
                  <q-tooltip>Editar asignación</q-tooltip>
                </q-btn>

                <q-btn
                  v-if="modulo.actualizar && props.row.estatus == 'Pendiente'"
                  flat
                  round
                  color="purple-ieen"
                  icon="send"
                  @click="afectar(col.value)"
                >
                  <q-tooltip>Afectar asignación</q-tooltip>
                </q-btn>

                <q-btn
                  v-if="modulo.actualizar && props.row.estatus == 'Afectado'"
                  flat
                  round
                  color="purple-ieen"
                  icon="print"
                  @click="GenerarVale(col.value)"
                >
                  <q-tooltip>Afectar asignación</q-tooltip>
                </q-btn>

                <q-btn
                  v-if="modulo.actualizar && props.row.estatus == 'Pendiente'"
                  flat
                  round
                  color="purple-ieen"
                  icon="cancel"
                  @click="cancelar(col.value)"
                >
                  <q-tooltip>Cancelar asignación</q-tooltip>
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
import { useAuthStore } from "../../../stores/auth_store";
import { useAsignacionStore } from "src/stores/asignacion_store";
import { onBeforeMount, ref } from "vue";
import ValeResguardo from "../../../helpers/ValeResguardo";

//-----------------------------------------------------------

const $q = useQuasar();
const asignacionStore = useAsignacionStore();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const { asignaciones } = storeToRefs(asignacionStore);

//-----------------------------------------------------------

onBeforeMount(() => {
  asignacionStore.loadInformacionAsignaciones();
});
//-----------------------------------------------------------

const columns = [
  {
    name: "empleado",
    align: "center",
    label: "Empleado asignación",
    field: "empleado",
    sortable: true,
  },
  {
    name: "area",
    align: "center",
    label: "Area",
    field: "area",
    sortable: true,
  },
  {
    name: "puesto",
    align: "center",
    label: "Puesto",
    field: "puesto",
    sortable: true,
  },
  {
    name: "estatus",
    align: "center",
    label: "Estatus",
    field: "estatus",
    sortable: true,
  },
  {
    name: "fecha_Registro",
    align: "center",
    label: "Fecha de registro",
    field: "fecha_Registro",
    sortable: true,
  },
  {
    name: "fecha_Asignacion",
    align: "center",
    label: "Fecha de asignación",
    field: "fecha_Asignacion",
    sortable: true,
  },
  {
    name: "id",
    align: "center",
    label: "Acciones",
    field: "id",
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

const afectar = async (id) => {
  $q.dialog({
    title: "Afectar asignación",
    message: "Al aceptar, se ejecutaran los movimientos realizados",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "positive",
      label: "Si, Aceptar",
    },
    cancel: {
      color: "negative",
      label: "No cancelar",
    },
  }).onOk(async () => {
    $q.loading.show();
    const resp = await asignacionStore.afectarAsignacion(id);
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "positive",
        message: resp.data,
      });
      asignacionStore.loadInformacionAsignaciones();
    } else {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "negative",
        message: resp.data,
      });
    }
  });
};

const cancelar = async (id) => {
  $q.dialog({
    title: "Cancelar asignación",
    message: "Al aceptar, se cancelará la asignación",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "positive",
      label: "Si, Aceptar",
    },
    cancel: {
      color: "negative",
      label: "No cancelar",
    },
  }).onOk(async () => {
    $q.loading.show();
    const resp = await asignacionStore.cancelarAsignacion(id);
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "positive",
        message: resp.data,
      });
      asignacionStore.loadInformacionAsignaciones();
    } else {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "negative",
        message: resp.data,
      });
    }
  });
};
const visualizar = async (id) => {
  $q.loading.show();
  await asignacionStore.loadAsignacion(id);
  await asignacionStore.detalleAsignacion(id);
  asignacionStore.updateEditar(true);
  asignacionStore.actualizarModal(true);
  $q.loading.hide();
};

const GenerarVale = async (id) => {
  let resp = null;
  $q.loading.show();
  resp = await asignacionStore.loadAsignacion(id);
  if (resp.success === true) {
    ValeResguardo();
  }

  $q.loading.hide();
};
</script>

<style></style>
