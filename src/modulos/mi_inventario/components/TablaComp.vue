<template>
  <br />
  <q-card bordered class="my-card">
    <q-card-section>
      <div class="text-h6">MI INVENTARIO</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="text-h7">{{ miInventario.nombre_completo }}</div>
      <br>
      <div class="text-h7">{{ miInventario.area }}</div>
    </q-card-section>
  </q-card>
  <br />
  <div class="row">
    <div class="col">
      <q-table
        :rows="listMiInventario"
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
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { onBeforeMount, ref } from "vue";
import { useAuthStore } from "../../../stores/auth_store";
import { useMiInventarioStore } from "../../../stores/mi_inventario";

//-----------------------------------------------------------

const $q = useQuasar();
const authStore = useAuthStore();
const miInventarioStore = useMiInventarioStore();
const { modulo } = storeToRefs(authStore);
const { listMiInventario, miInventario } = storeToRefs(miInventarioStore);

onBeforeMount(() => {
  miInventarioStore.loadMiInventario();
  miInventarioStore.loadUser();
});
//-----------------------------------------------------------

const columns = [
  {
    name: "catalogo",
    align: "center",
    label: "Catálogo perteneciente",
    field: "catalogo",
    sortable: true,
  },
  {
    name: "bodega",
    align: "center",
    label: "Bodega perteneciente",
    field: "bodega",
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
  {
    name: "numero_serie",
    align: "center",
    label: "Número de serie",
    field: "numero_serie",
    sortable: true,
  },
  {
    name: "color",
    align: "center",
    label: "Color",
    field: "color",
    sortable: true,
  },
  {
    name: "importe",
    align: "center",
    label: "Importe",
    field: "importe",
    sortable: true,
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
