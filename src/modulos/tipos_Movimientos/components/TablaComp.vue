<template>
  <div class="row q-pl-lg q-pr-lg">
    <div class="col">
      <q-table
        :grid="$q.screen.xs"
        :rows="list_Movimientos"
        :columns="columns"
        :filter="filter"
        :pagination="pagination"
        row-key="id"
        rows-per-page-label="Filas por pagina"
        no-data-label="No hay registros"
      >
        <template v-slot:top-right>
          <q-input
            outlined
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
        <!--TEMPLATE SCREEN XS-->
        <template v-if="$q.screen.xs" v-slot:item="props">
          <div
            class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
          >
            <q-card bordered class="no-shadow">
              <q-list dense>
                <q-item v-for="col in props.cols" :key="col.name">
                  <q-item-section>
                    <q-item-label class="text-bold"
                      >{{ col.label }}:</q-item-label
                    >
                  </q-item-section>
                  <q-item-section>
                    <div v-if="col.name == 'id'">
                      <q-btn
                        v-if="modulo == null ? false : modulo.actualizar"
                        flat
                        round
                        color="purple-ieen"
                        icon="add_circle"
                        @click="addConceptos(col.value)"
                      />
                      <q-btn
                        v-if="modulo == null ? false : modulo.actualizar"
                        flat
                        round
                        color="purple-ieen"
                        icon="visibility"
                        @click="editar(col.value)"
                      />
                    </div>
                    <q-item-label v-else>{{ col.value }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>
        </template>
        <!--TEMPLATE SCREEN DESKTOP-->
        <template v-slot:body="props" v-else>
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <div v-if="col.name === 'id'">
                <q-btn
                  v-if="modulo == null ? false : modulo.actualizar"
                  flat
                  round
                  color="purple-ieen"
                  icon="add_circle"
                  @click="addConceptos(col.value)"
                >
                  <q-tooltip>Agregar conceptos</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="modulo == null ? false : modulo.actualizar"
                  flat
                  round
                  color="purple-ieen"
                  icon="visibility"
                  @click="editar(col.value)"
                >
                  <q-tooltip>Ver tipo de movimiento</q-tooltip>
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
import { useTiposConceptosMovimientos } from "../../../stores/tipos-conceptos-movimientos";

//-----------------------------------------------------------

const $q = useQuasar();
const authStore = useAuthStore();
const tiposConceptosMovStore = useTiposConceptosMovimientos();
const { list_Movimientos } = storeToRefs(tiposConceptosMovStore);
const { modulo } = storeToRefs(authStore);

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------

const cargarData = async () => {
  $q.loading.show();
  await tiposConceptosMovStore.loadTiposMovimientos();
  $q.loading.hide();
};

const editar = async (id) => {
  $q.loading.show();
  await tiposConceptosMovStore.loadMovimiento(id);
  tiposConceptosMovStore.actualizarModal(true);
  $q.loading.hide();
};

const addConceptos = async (id) => {
  await tiposConceptosMovStore.loadMovimiento(id);
  await tiposConceptosMovStore.loadConceptosMovimientos(id);
  tiposConceptosMovStore.actualizarModalConceptos(true);
};

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
    name: "naturaleza",
    align: "center",
    label: "Naturaleza",
    field: "naturaleza",
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
  page: 1,
  rowsPerPage: 5,
  sortBy: "name",
  descending: false,
});

const filter = ref("");
</script>
