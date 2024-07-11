<template v-if="modulo">
  <div class="row">
    <div class="col">
      <q-table
        :rows="proveedores"
        :visible-columns="visible_columns"
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
                  v-if="modulo.actualizar"
                  flat
                  round
                  color="purple-ieen"
                  icon="edit"
                  @click="editar(col.value)"
                >
                  <q-tooltip>Editar proveedor</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="modulo.eliminar"
                  flat
                  round
                  color="purple-ieen"
                  icon="delete"
                  @click="eliminar(col.value)"
                >
                  <q-tooltip>Eliminar proveedor</q-tooltip>
                </q-btn>
              </div>
              <div v-else-if="col.name == 'razon_Social'">
                <label>{{ col.value }} </label>
                <q-tooltip
                  :offset="[10, 10]"
                  v-if="
                    col.value.length !=
                    props.row['razon_Social_completo'].length
                  "
                >
                  {{ props.row["razon_Social_completo"] }}
                </q-tooltip>
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
import { useProvedores } from "../../../stores/provedores_store";

//-----------------------------------------------------------

const $q = useQuasar();
const authStore = useAuthStore();
const proveedoresStore = useProvedores();
const { proveedores } = storeToRefs(proveedoresStore);
const { modulo } = storeToRefs(authStore);

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------

const cargarData = async () => {
  $q.loading.show();
  await proveedoresStore.loadInformacionProvedores();
  $q.loading.hide();
};

const editar = async (id) => {
  $q.loading.show();
  await proveedoresStore.loadProveedor(id);
  proveedoresStore.actualizarModal(true);
  proveedoresStore.updateEditar(true);
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
    const resp = await proveedoresStore.deleteProveedor(id);
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "positive",
        message: resp.data,
      });
      proveedoresStore.loadInformacionProvedores();
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

//-----------------------------------------------------------

const columns = [
  {
    name: "nombre",
    align: "center",
    label: "Nombre",
    field: "nombre",
    sortable: true,
  },
  {
    name: "razon_Social",
    align: "center",
    label: "Razón social",
    field: "razon_Social",
    sortable: true,
  },
  {
    name: "razon_Social_completo",
    align: "center",
    label: "Razón social",
    field: "razon_Social_completo",
    sortable: true,
  },
  {
    name: "rfc",
    align: "center",
    label: "RFC",
    field: "rfc",
    sortable: true,
  },
  {
    name: "telefono",
    align: "center",
    label: "Teléfono",
    field: "telefono",
    sortable: true,
  },
  {
    name: "eMail",
    align: "center",
    label: "Email",
    field: "eMail",
    sortable: true,
  },
  {
    name: "direccion",
    align: "center",
    label: "Dirección",
    field: "direccion",
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

const visible_columns = [
  "nombre",
  "razon_Social",
  "rfc",
  "telefono",
  "eMail",
  "direccion",
  "id",
];

const pagination = ref({
  page: 1,
  rowsPerPage: 25,
  sortBy: "name",
  descending: false,
});

const filter = ref("");
</script>
