<template>
  <q-btn
    flat
    round
    color="purple-ieen"
    icon="qr_code_scanner"
    @click="mostrarPDF(true)"
  >
    <q-tooltip>Generar PDF</q-tooltip>
  </q-btn>
  <div class="row">
    <div class="col">
      <q-table
        :rows="inventarios"
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
                  flat
                  round
                  color="purple-ieen"
                  icon="image"
                  @click="loadFotos(col.value, true)"
                >
                </q-btn>
                <!-- <q-btn
                  flat
                  round
                  color="purple-ieen"
                  icon="qr_code_scanner"
                  @click="generarPDF(col.value)"
                >
                  <q-tooltip>Generar PDF</q-tooltip>
                </q-btn> -->

                <q-btn
                  flat
                  round
                  color="purple-ieen"
                  icon="edit"
                  @click="editar(col.value)"
                >
                  <q-tooltip>Editar inventario</q-tooltip>
                </q-btn>

                <q-btn
                  flat
                  round
                  color="purple-ieen"
                  icon="delete"
                  @click="eliminar(col.value)"
                >
                  <q-tooltip>Eliminar inventario</q-tooltip>
                </q-btn>
              </div>
              <label v-else>{{ col.value }}</label>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <ModalFotos />
      <ModalPDF />
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { onBeforeMount, ref } from "vue";
import { useAuthStore } from "../../../stores/auth_store";
import { useInventarioStore } from "../../../stores/inventario_store";
import ModalFotos from "../components/ModalViewFotos.vue";
import ModalPDF from "../components/ModalPDF.vue";
//-----------------------------------------------------------

const $q = useQuasar();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const inventarioStore = useInventarioStore();
const { inventarios } = storeToRefs(inventarioStore);
let dialogVisible = false;
let pdfUrl = "";
//-----------------------------------------------------------

onBeforeMount(() => {
  inventarioStore.loadInformacionInventarios();
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
    name: "estatus",
    align: "center",
    label: "Estatus",
    field: "estatus",
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
    name: "nombre_corto",
    align: "center",
    label: "Nombre",
    field: "nombre_corto",
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
    name: "numero_Serie",
    align: "center",
    label: "Número de serie",
    field: "numero_Serie",
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
    name: "color",
    align: "center",
    label: "Color",
    field: "color",
    sortable: true,
  },
  {
    name: "emplado",
    align: "center",
    label: "Empleado",
    field: "empleado",
    sortable: true,
  },
  {
    name: "id",
    align: "center",
    label: "Acciones",
    field: "id",
    sortable: true,
  },
];

//-----------------------------------------------------------

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
  await inventarioStore.loadInventario(id);
  inventarioStore.updateEditar(true);
  inventarioStore.actualizarModal(true);
  $q.loading.hide();
};

//-----------------------------------------------------------

const loadFotos = (id, valor) => {
  inventarioStore.loadInventario(id);
  inventarioStore.actualizarModalFotos(valor);
};

//-----------------------------------------------------------

const generarPDF = async (id) => {
  $q.loading.show();
  var { ruta_PDF } = await inventarioStore.generarPDF(id);
  window.open(ruta_PDF, "_blank");
  $q.loading.hide();
};

const openPdfDialog = () => {
  // Establecer la URL del PDF que deseas mostrar
  dialogVisible = true;
  console.log("entro", pdfUrl, dialogVisible);
  pdfUrl =
    "https://www.turnerlibros.com/wp-content/uploads/2021/02/ejemplo.pdf";
  console.log(pdfUrl);
};
const closePdfDialog = () => {
  // Limpiar la URL del PDF al cerrar el diálogo para evitar que se cargue nuevamente al abrirlo.
  pdfUrl = "";
};

const mostrarPDF = (valor) => {
  $q.loading.show();
  inventarioStore.actualizarModalPDF(valor);
  $q.loading.hide();
};

//-----------------------------------------------------------

const eliminar = async (id) => {
  $q.dialog({
    title: "Eliminar inventario",
    message: "¿Está seguro de eliminar el inventario?",
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
    const resp = await inventarioStore.deleteInventario(id);
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        type: "positive",
        message: resp.data,
      });
      inventarioStore.loadInformacionInventarios();
    } else {
      $q.loading.hide();
      $q.notify({
        type: "negative",
        message: resp.data,
      });
    }
  });
};
</script>

<style>
.pdf-dialog-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}
</style>
