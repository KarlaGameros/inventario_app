<template>
  <div class="row">
    <div class="col">
      <q-table
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
        <template>
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
                  <q-tooltip>Editar asignación</q-tooltip>
                </q-btn>
                <q-btn
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
import { ref } from "vue";

//-----------------------------------------------------------

const $q = useQuasar();

//-----------------------------------------------------------

const columns = [
  {
    name: "tipo_movimiento",
    align: "center",
    label: "Tipo de movimiento",
    field: "tipo_movimiento",
    sortable: true,
  },
  {
    name: "estatus",
    align: "center",
    label: "Estatus",
    field: "estatus",
    sortable: true,
  },
  ,
  {
    name: "fecha_movimiento",
    align: "center",
    label: "Fecha Movimiento",
    field: "fecha_movimiento",
    sortable: true,
  },
  {
    name: "bodega_origen",
    align: "center",
    label: "Bodega origen",
    field: "bodega_origen",
    sortable: true,
  },
  {
    name: "bodega_destino",
    align: "center",
    label: "Bodega destino",
    field: "bodega_destino",
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
</script>

<style></style>
