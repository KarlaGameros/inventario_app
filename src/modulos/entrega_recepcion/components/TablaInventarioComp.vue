<template>
  <div class="row">
    <div class="col">
      <q-table
        :rows="list_Inventario"
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
              <div v-if="col.name === 'descripcion'">
                {{ props.row.descripcion }}
              </div>
              <div v-if="col.name === 'asignar'">
                <q-radio
                  checked-icon="task_alt"
                  v-model="props.row.asignar"
                  unchecked-icon="panorama_fish_eye"
                  val="bodega"
                  label="Bodega"
                />
                <q-radio
                  checked-icon="task_alt"
                  v-model="props.row.asignar"
                  unchecked-icon="panorama_fish_eye"
                  val="personal"
                  label="Personal"
                />
              </div>
              <div v-if="col.name === 'asignar_a'">
                <q-select
                  v-if="props.row.asignar == 'personal'"
                  label="Personal"
                  :options="listEmpleados"
                  hint="Selecciona personal"
                  :lazy-rules="true"
                  :rules="[(val) => !!val || 'El personal es requerido']"
                >
                </q-select>
              </div>
              <div v-if="col.name === 'inventario_Id'">
                <q-btn
                  flat
                  round
                  color="purple-ieen"
                  icon="visibility"
                  @click="actualizarModalVer(true)"
                >
                  <q-tooltip>Ver inventario</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  color="purple-ieen"
                  icon="cancel"
                  @click="eliminar(col.value)"
                >
                  <q-tooltip>Eliminar inventario</q-tooltip>
                </q-btn>
              </div>
            </q-td>

            <!-- <q-td key="asignar_a" :props="props">
              <q-select
                v-if="props.row.asignar == 'bodega'"
                label="Bodega"
                v-model="props.row.asignar"
                :options="listEmpleados"
                hint="Selecciona una bodega"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'La bodega es requerida']"
              >
              </q-select>
              <q-select
                v-else
                label="Personal"
                v-model="props.row.asignar"
                :options="listEmpleados"
                hint="Selecciona personal"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'El personal es requerido']"
              >
              </q-select>
            </q-td> -->

            <!-- <q-td key="inventario_Id" :props="props">
              <q-btn
                flat
                round
                color="purple-ieen"
                icon="visibility"
                @click="actualizarModalVer(true)"
              >
                <q-tooltip>Ver inventario</q-tooltip>
              </q-btn>
              <TablaVerInventario />
              <q-btn
                flat
                round
                color="purple-ieen"
                icon="cancel"
                @click="eliminar(col.value)"
              >
                <q-tooltip>Eliminar inventario</q-tooltip>
              </q-btn>
            </q-td> -->
            <!-- <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <div v-if="col.name === 'inventario_Id'">
                <q-btn
                  disable
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
            </q-td> -->
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useEntregaRecepcionStore } from "src/stores/entrega-recepcion-store";
import { ref, watch } from "vue";

//-----------------------------------------------------------
const entregaRecepcionStore = useEntregaRecepcionStore();
const { modalVerInventario, list_Inventario } = storeToRefs(
  entregaRecepcionStore
);

const columns = [
  {
    name: "descripcion",
    align: "center",
    label: "Descripción",
    field: "descripcion",
    sortable: false,
  },
  {
    name: "asignar",
    align: "center",
    label: "Asignar a ",
    field: "asignar",
    sortable: false,
  },
  {
    name: "asignar_a",
    align: "center",
    label: "Asignar a",
    field: "asignar_a",
    sortable: false,
  },
  {
    name: "inventario_Id",
    align: "center",
    label: "Acciones",
    field: "inventario_Id",
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

const actualizarModalVer = (valor) => {
  entregaRecepcionStore.actualizarModalVerInventario(valor);
};
</script>

<style></style>
