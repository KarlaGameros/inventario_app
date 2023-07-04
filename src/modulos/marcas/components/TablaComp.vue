<template>
  <div class="row">
    <div class="col">
      <q-table
        :rows="marcas"
        :columns="columns"
        :loading="loading"
        row-key="id"
        rows-per-page-label="Filas por pagina"
        no-data-label="No hay registros"
      >
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" placeholder="Buscar..">
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
                  <q-tooltip>Editar marca</q-tooltip>
                </q-btn>
                <q-btn flat round color="purple-ieen" icon="delete">
                  <q-tooltip>Eliminar marca</q-tooltip>
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
import { onBeforeMount } from "vue";
import { useMarcaStore } from "../../../stores/marcas_store";

const $q = useQuasar();
const marcaStore = useMarcaStore();
const { marcas } = storeToRefs(marcaStore);

onBeforeMount(() => {
  marcaStore.loadInformacionMarca();
});

const columns = [
  {
    name: "nombre",
    align: "center",
    label: "Nombre de la marca",
    field: "nombre",
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

const editar = async (id) => {
  console.log("editar", id);
};
</script>

<style></style>
