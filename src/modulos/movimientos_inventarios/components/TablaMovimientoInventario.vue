<template>
  <div class="row">
    <div class="col">
      <q-table
        class="my-sticky-header-table"
        :rows="list_Detalle"
        :columns="columns"
        :filter="filter"
        :pagination="pagination"
        row-key="id"
        rows-per-page-label="Filas por pagina"
        no-data-label="No hay registros"
        binary-state-sort
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
              <div v-if="col.name === 'destino'">
                <q-radio
                  :disable="visualizar"
                  checked-icon="task_alt"
                  v-model="props.row.destino"
                  unchecked-icon="panorama_fish_eye"
                  val="Bodega"
                  label="Bodega"
                />
                <q-radio
                  :disable="visualizar"
                  checked-icon="task_alt"
                  v-model="props.row.destino"
                  unchecked-icon="panorama_fish_eye"
                  val="Personal"
                  label="Personal"
                />
              </div>
              <div v-else-if="col.name === 'empleado'">
                <q-select
                  :disable="visualizar"
                  v-if="props.row.destino == 'Personal'"
                  label="Personal"
                  v-model="props.row.empleado"
                  :options="list_Empleados"
                  hint="Selecciona personal"
                  :lazy-rules="true"
                  :rules="[(val) => !!val || 'El personal es requerido']"
                >
                </q-select>
                <q-select
                  :disable="visualizar"
                  v-if="props.row.destino == 'Bodega'"
                  label="Bodega"
                  v-model="props.row.bodega_Destino"
                  :options="list_Bodegas"
                  hint="Selecciona bodega"
                  :lazy-rules="true"
                  :rules="[(val) => !!val || 'La bodega es requerido']"
                >
                </q-select>
              </div>
              <div v-else-if="col.name === 'inventario_Id'">
                <q-btn
                  flat
                  round
                  color="purple-ieen"
                  icon="search"
                  @click="actualizarModalVer(true, col.value)"
                >
                  <q-tooltip>Ver inventario</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="!visualizar"
                  flat
                  round
                  color="purple-ieen"
                  icon="edit_note"
                  @click="agregarObservacion(col.value)"
                >
                  <q-tooltip>Agregar observación</q-tooltip>
                </q-btn>
              </div>
              <label v-else>{{ col.value }}</label>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <ModalVerInventario />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useMovimientoInventario } from "src/stores/movimiento_inventario";
import ModalVerInventario from "./ModalVerInventario.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const movimientoStore = useMovimientoInventario();
const { list_Detalle, list_Empleados, visualizar, list_Bodegas } =
  storeToRefs(movimientoStore);

//-----------------------------------------------------------

const columns = [
  {
    name: "clave",
    align: "center",
    label: "Clave",
    field: "clave",
    sortable: true,
  },
  {
    name: "inventario",
    align: "center",
    label: "Nombre del inventario",
    field: "inventario",
    sortable: true,
  },
  {
    name: "destino",
    align: "center",
    label: "Asignar a ",
    field: "destino",
    sortable: false,
  },
  {
    name: "empleado",
    align: "center",
    label: "Asignar a",
    field: "empleado",
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
  rowsPerPage: 10,
  sortBy: "name",
  descending: false,
});

const filter = ref("");

//-----------------------------------------------------------

const agregarObservacion = (id) => {
  let elemento = list_Detalle.value.findIndex((x) => x.inventario_Id == id);
  $q.dialog({
    title: "Agregar observacion",
    message: "Escribe la observación",
    prompt: {
      model: list_Detalle.value[elemento].observaciones,
      type: "text", // optional
    },
    cancel: true,
    persistent: true,
  })
    .onOk((data) => {
      movimientoStore.addObservacion(id, data);
    })
    .onCancel(() => {})
    .onDismiss(() => {});
};

const actualizarModalVer = (valor, value) => {
  $q.loading.show();
  movimientoStore.actualizarVerInventario(valor);
  movimientoStore.loadInventario(value);
  $q.loading.hide();
};

const eliminar = async (id) => {
  $q.dialog({
    title: "Eliminar producto",
    message: "¿Está seguro de eliminar el producto del listado?",
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
    let resp = null;
    resp = await movimientoStore.deleteProducto(id);
    $q.loading.hide();

    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "positive",
        message: resp.data,
      });
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
<style lang="sass">
.my-sticky-header-table
  .q-table__top,
  thead tr:first-child th
    background-color: #DCDADD
</style>
