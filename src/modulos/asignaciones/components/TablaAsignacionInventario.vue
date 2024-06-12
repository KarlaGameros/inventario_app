<template>
  <div class="row">
    <div class="col">
      <q-table
        :rows="listaAsignacionInventario"
        :columns="columns"
        :filter="filter"
        :pagination="pagination"
        :visible-columns="columnasVisibles"
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
const { listaAsignacionInventario, isEditar, isShow, asignacion } =
  storeToRefs(asignacionStore);
let columnasVisibles = [];

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarColumnas();
});

//-----------------------------------------------------------

const columns = [
  {
    name: "id",
    align: "center",
    label: "Acciones",
    field: "id",
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
    name: "descripcion",
    align: "center",
    label: "Descripción",
    field: "descripcion",
    sortable: true,
  },
];
const pagination = ref({
  page: 1,
  rowsPerPage: 25,
  sortBy: "name",
  descending: false,
});

const filter = ref("");

const cargarColumnas = async () => {
  if (isShow.value == true) {
    columnasVisibles = ["clave", "descripcion"];
  } else {
    columnasVisibles = ["clave", "descripcion", "id"];
  }
};

const eliminar = async (id) => {
  $q.dialog({
    title: "Eliminar producto",
    message: "¿Está seguro de eliminar el producto del listado?",
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
    let resp = null;
    resp = await asignacionStore.deleteProducto(id);
    $q.loading.hide();

    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "positive",
        message: resp.data,
      });
      if (isEditar.value == true) {
        asignacionStore.detalleAsignacion(asignacion.value.id);
      }
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
</script>
