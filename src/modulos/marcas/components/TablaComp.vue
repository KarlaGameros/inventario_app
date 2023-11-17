<template>
  <div class="row">
    <div class="col">
      <q-table
        :rows="marcas"
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
                  v-if="modulo.registrar"
                  flat
                  round
                  color="purple-ieen"
                  icon="add_circle"
                  @click="addModelo(true, col.value)"
                >
                  <q-tooltip>Agregar modelo</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="modulo.actualizar"
                  flat
                  round
                  color="purple-ieen"
                  icon="edit"
                  @click="editar(col.value)"
                >
                  <q-tooltip>Editar marca</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="modulo.eliminar"
                  flat
                  round
                  color="purple-ieen"
                  icon="delete"
                  @click="eliminar(col.value)"
                >
                  <q-tooltip>Eliminar marca</q-tooltip>
                </q-btn>
              </div>
              <label v-else>{{ col.value }}</label>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <ModalModeloComp />
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { onBeforeMount, ref } from "vue";
import { useMarcaStore } from "../../../stores/marcas_store";
import { useModeloStore } from "../../../stores/modelo_store";
import ModalModeloComp from "../../modelos/components/ModalComp.vue";
import { useAuthStore } from "../../../stores/auth_store";

//-----------------------------------------------------------

const $q = useQuasar();
const marcaStore = useMarcaStore();
const modeloStore = useModeloStore();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const { marcas } = storeToRefs(marcaStore);

//-----------------------------------------------------------

onBeforeMount(() => {
  marcaStore.loadInformacionMarca();
});

//-----------------------------------------------------------

const columns = [
  {
    name: "clave",
    align: "center",
    label: "Clave de la marca",
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
  await marcaStore.loadMarca(id);
  marcaStore.updateEditar(true);
  marcaStore.actualizarModal(true);
  $q.loading.hide();
};

const eliminar = async (id) => {
  $q.dialog({
    title: "Eliminar marca",
    message: "¿Está seguro de eliminar la marca?",
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
    const resp = await marcaStore.deleteMarca(id);
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "positive",
        message: resp.data,
      });
      marcaStore.loadInformacionMarca();
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

const addModelo = (valor, id) => {
  $q.loading.show();
  modeloStore.actualizarModal(valor);
  modeloStore.modeloByMarca(id);
  modeloStore.initModelo();
  $q.loading.hide();
};
</script>

<style></style>
