<template>
  <div class="row q-pl-lg q-pr-lg">
    <div class="col">
      <q-table
        :grid="$q.screen.xs"
        :rows="estatus"
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
                        icon="edit"
                        @click="editar(col.value)"
                      />
                      <q-btn
                        v-if="modulo == null ? false : modulo.eliminar"
                        flat
                        round
                        color="purple-ieen"
                        icon="delete"
                        @click="eliminar(col.value)"
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
                  icon="edit"
                  @click="editar(col.value)"
                >
                  <q-tooltip>Editar estatus</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="modulo == null ? false : modulo.eliminar"
                  flat
                  round
                  color="purple-ieen"
                  icon="delete"
                  @click="eliminar(col.value)"
                >
                  <q-tooltip>Eliminar estatus</q-tooltip>
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
import { useEstatusStore } from "src/stores/estatus_store";
import { onBeforeMount, ref } from "vue";
import { useAuthStore } from "../../../stores/auth_store";

//-----------------------------------------------------------

const $q = useQuasar();
const estatusStore = useEstatusStore();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const { estatus } = storeToRefs(estatusStore);

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------

const columns = [
  {
    name: "label",
    align: "center",
    label: "Estatus",
    field: "label",
    sortable: true,
  },
  {
    name: "id",
    align: "center",
    label: "Acciones",
    field: "value",
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

//-----------------------------------------------------------

const cargarData = async () => {
  $q.loading.show();
  await estatusStore.loadInformacionEstatus();
  $q.loading.hide();
};

const editar = async (id) => {
  $q.loading.show();
  await estatusStore.loadEstatus(id);
  estatusStore.actualizarModal(true);
  estatusStore.updateEditar(true);
  $q.loading.hide();
};

const eliminar = async (id) => {
  $q.dialog({
    title: "Eliminar bodega",
    message: "¿Está seguro de eliminar el estatus?",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "secondary",
      label: "¡Sí!, eliminar",
    },
    cancel: {
      color: "red",
      label: " No Cancelar",
    },
  }).onOk(async () => {
    $q.loading.show();
    const resp = await estatusStore.deleteEstatu(id);
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "positive",
        message: resp.data,
      });
      estatusStore.loadInformacionEstatus();
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
