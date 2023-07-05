<template>
  <div class="row">
    <div class="col">
      <q-table
        :rows="modelos"
        :columns="columns"
        :filter="filter"
        :loading="loading"
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
                  icon="edit"
                  @click="editar(col.value)"
                >
                  <q-tooltip>Editar bodega</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  color="purple-ieen"
                  icon="delete"
                  @click="eliminar(col.value)"
                >
                  <q-tooltip>Eliminar bodega</q-tooltip>
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
import { useModeloStore } from "../../../stores/modelo_store";
import { useQuasar } from "quasar";
import { onBeforeMount, ref } from "vue";

const $q = useQuasar();
const modeloStore = useModeloStore();
const { modelos } = storeToRefs(modeloStore);

onBeforeMount(() => {
  modeloStore.loadInformacionModelo();
});

const columns = [
  {
    name: "nombre",
    align: "center",
    label: "Nombre del modelo",
    field: "nombre",
    sortable: true,
  },
  {
    name: "marca",
    align: "center",
    label: "Marca",
    field: "Marca",
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

const editar = async (id) => {
  $q.loading.show();
  //await marcaStore.loadMarca(id)
  modeloStore.actualizarModal(true);
  $q.loading.hide();
};

const eliminar = async (id) => {
  $q.dialog({
    title: "Eliminar marca",
    message: "¿Está seguro de eliminar el modelo?",
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
    console.log("eliminar", id);
  });
};
</script>

<style></style>
