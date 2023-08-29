<template>
  <div class="row">
    <div class="col">
      <q-table
        :rows="movimientos"
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
                  v-if="modulo.actualizar"
                  flat
                  round
                  color="purple-ieen"
                  icon="edit"
                  @click="editar(col.value)"
                >
                  <q-tooltip>Editar asignación</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="modulo.eliminar"
                  flat
                  round
                  color="purple-ieen"
                  icon="delete"
                  @click="eliminar(col.value)"
                >
                  <q-tooltip>Eliminar asignación</q-tooltip>
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
import { onBeforeMount, ref } from "vue";
import { useAuthStore } from "../../../stores/auth_store";
import { useMovimientoInventario } from "../../../stores/movimiento_inventario";

//-----------------------------------------------------------

const $q = useQuasar();
const authStore = useAuthStore();
const movimientoStore = useMovimientoInventario();
const { movimientos } = storeToRefs(movimientoStore);
const { modulo } = storeToRefs(authStore);

//-----------------------------------------------------------

onBeforeMount(() => {
  movimientoStore.loadInformacionMovimientos();
});

//-----------------------------------------------------------

const columns = [
  {
    name: "tipo_Movimiento",
    align: "center",
    label: "Tipo de movimiento",
    field: "tipo_Movimiento",
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
    name: "fecha_Movimiento",
    align: "center",
    label: "Fecha Movimiento",
    field: "fecha_Movimiento",
    sortable: true,
  },
  {
    name: "bodega_Origen",
    align: "center",
    label: "Bodega origen",
    field: "bodega_Origen",
    sortable: true,
  },
  {
    name: "bodega_Destino",
    align: "center",
    label: "Bodega destino",
    field: "bodega_Destino",
    sortable: true,
  },
  {
    name: "provedor",
    align: "center",
    label: "Provedor",
    field: "provedor",
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

const editar = async (id) => {
  $q.loading.show();
  await movimientoStore.loadMovimiento(id);
  movimientoStore.updateEditar(true);
  movimientoStore.actualizarModal(true);
  $q.loading.hide();
};

const eliminar = async (id) => {
  $q.dialog({
    title: "Eliminar movimiento",
    message: "¿Está seguro de eliminar el movimiento?",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "positive",
      label: "¡Sí!, eliminar",
    },
    cancel: {
      color: "negative",
      label: " No Cancelar",
    },
  }).onOk(async () => {
    $q.loading.show();
    //const resp = await bodegaStore.deleteBodega(id);
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        type: "positive",
        message: resp.data,
      });
      //bodegaStore.loadInformacionBodega();
    } else {
      $q.loading.hide();
      $q.notify({
        type: "negative",
        message: resp.data,
      });
    }
  });
};
</script>

<style></style>
