<template>
  <q-btn @click="downloadPDF">Descargar PDF</q-btn>
  <q-btn @click="downloadXML">Descargar Excel</q-btn>
  <div class="row">
    <div class="col">
      <q-table
        :rows="asignaciones"
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
import { useAsignacionStore } from "src/stores/asignacion_store";
import { useInventarioStore } from "../../../stores/inventario_store";
import { ref } from "vue";
import jsPDF from "jspdf";

const $q = useQuasar();
const asignacionStore = useAsignacionStore();
const inventarioStore = useInventarioStore();
const { inventarios } = storeToRefs(inventarioStore);
const { asignaciones } = storeToRefs(asignacionStore);

const columns = [
  {
    name: "empleado",
    align: "center",
    label: "Empleado",
    field: "empleado",
    sortable: true,
  },
  {
    name: "area",
    align: "center",
    label: "Area",
    field: "area",
    sortable: true,
  },
  ,
  {
    name: "puesto",
    align: "center",
    label: "Puesto",
    field: "puesto",
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
    name: "fecha_Registro",
    align: "center",
    label: "Fecha de registro",
    field: "fecha_registro",
    sortable: true,
  },
  {
    name: "fecha_Asignacion",
    align: "center",
    label: "Fecha de asignación",
    field: "fecha_Asigncion",
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

const downloadPDF = () => {
  let pdf = new jsPDF();

  pdf.text("Hola", 10, 10);
  pdf.save("info.pdf");
};

const downloadXML = async () => {
  import("../../../plugins/ExportExcel").then((excel) => {
    inventarioStore.loadInformacionInventarios().then((resp) => {
      console.log("resp", resp);
    });
  });
};
const pagination = ref({
  //********** */
  page: 1,
  rowsPerPage: 25,
  sortBy: "name",
  descending: false,
});

const filter = ref("");

const editar = async (id) => {
  $q.loading.show();
  bodegaStore.actualizarModal(true);
  $q.loading.hide();
};

const eliminar = async (id) => {
  $q.dialog({
    title: "Eliminar asignación",
    message: "¿Está seguro de eliminar la asignación?",
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
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        type: "positive",
        message: resp.data,
      });
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

<style></style>
