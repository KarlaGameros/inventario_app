<template>
  <div class="row">
    <div class="col">
      <q-table
        :rows="listModelo"
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
              <div v-if="col.name === 'value'">
                <q-btn
                  v-if="modulo.actualizar"
                  flat
                  round
                  color="purple-ieen"
                  icon="edit"
                  @click="editar(col.value)"
                >
                  <q-tooltip>Editar modelo</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="modulo.eliminar"
                  flat
                  round
                  color="purple-ieen"
                  icon="delete"
                  @click="eliminar(col.value)"
                >
                  <q-tooltip>Eliminar modelo</q-tooltip>
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
import { ref } from "vue";
import { useAuthStore } from "../../../stores/auth_store";

//-----------------------------------------------------------

const $q = useQuasar();
const modeloStore = useModeloStore();
const { listModelo, marca_id } = storeToRefs(modeloStore);
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);

//-----------------------------------------------------------

const columns = [
  {
    name: "label",
    align: "center",
    label: "Clave del modelo",
    field: "label",
    sortable: true,
  },
  {
    name: "value",
    align: "center",
    label: "Acciones",
    field: "value",
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
  await modeloStore.loadModelo(id);
  modeloStore.updateEditar(true);
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
    $q.loading.show();
    const resp = await modeloStore.deleteModelo(id);
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "positive",
        message: resp.data,
      });
      modeloStore.modeloByMarca(marca_id.value);
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

<style></style>
