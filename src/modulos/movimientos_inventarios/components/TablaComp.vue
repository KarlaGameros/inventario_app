<template>
  <div class="row">
    <div class="col">
      <q-table
        :rows="list_Movimientos_Filtro"
        :columns="columns"
        :filter="filter"
        :pagination="pagination"
        row-key="id"
        rows-per-page-label="Filas por pagina"
        no-data-label="No hay registros"
        class="my-sticky-last-column-table"
      >
        <template v-slot:top-left>
          <q-select
            class="q-pr-xs"
            color="purple-ieen"
            style="width: 250px"
            filled
            v-model="movimiento_Id"
            :options="tipos_Movimientos"
            label="Tipo de movimiento"
            hint="Seleccione una opción"
          />
          <q-select
            class="q-pr-xs"
            color="purple-ieen"
            style="width: 250px"
            filled
            v-model="estatus_Id"
            :options="list_Estatus"
            label="Estatus"
            hint="Seleccione estatus"
          />
        </template>
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
                  v-if="modulo.actualizar && props.row.estatus == 'Afectado'"
                  flat
                  round
                  color="purple-ieen"
                  icon="print"
                  @click="descargarVale(props.row)"
                >
                  <q-tooltip>Vale movimiento</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="
                    modulo.actualizar &&
                    props.row.estatus == 'Afectado' &&
                    props.row.tipo_Movimiento == 'Salida'
                  "
                  flat
                  round
                  color="purple-ieen"
                  icon="add_a_photo"
                  @click="verFotos(col.value)"
                >
                  <q-tooltip>Fotos</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="modulo.actualizar && props.row.estatus == 'Pendiente'"
                  flat
                  round
                  color="purple-ieen"
                  icon="edit"
                  @click="editar(col.value)"
                >
                  <q-tooltip>Afectar movimiento</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="modulo.actualizar && props.row.estatus == 'Pendiente'"
                  flat
                  round
                  color="purple-ieen"
                  icon="send"
                  @click="afectar(col.value)"
                >
                  <q-tooltip>Afectar movimiento</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="modulo.actualizar && props.row.estatus == 'Pendiente'"
                  flat
                  round
                  color="purple-ieen"
                  icon="cancel"
                  @click="cancelar(col.value)"
                >
                  <q-tooltip>Afectar movimiento</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="modulo.actualizar && props.row.estatus != 'Pendiente'"
                  flat
                  round
                  color="purple-ieen"
                  icon="search"
                  @click="verMovimiento(col.value)"
                >
                  <q-tooltip>Ver movimiento</q-tooltip>
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
import { onBeforeMount, ref, watchEffect } from "vue";
import { useAuthStore } from "../../../stores/auth_store";
import { useMovimientoInventario } from "../../../stores/movimiento_inventario";
import { useMiInventarioStore } from "src/stores/mi_inventario";
import { useEmpleadosStore } from "src/stores/empleados_store";
import EntregaRecepcion from "src/helpers/ValeEntregaRecepcion";
import ValeSalida from "src/helpers/ValeSalida";

//-----------------------------------------------------------

const $q = useQuasar();
const authStore = useAuthStore();
const movimientoStore = useMovimientoInventario();
const miInventarioStore = useMiInventarioStore();
const empleadoStore = useEmpleadosStore();
const { movimientos, movimiento } = storeToRefs(movimientoStore);
const { modulo } = storeToRefs(authStore);
const tipos_Movimientos = ref([
  "Todos",
  "Traspaso",
  "Entrega Recepción",
  "Salida",
]);
const list_Estatus = ref(["Todos", "Pendiente", "Afectado", "Cancelado"]);
const movimiento_Id = ref("Todos");
const estatus_Id = ref("Todos");
const list_Movimientos_Filtro = ref([]);

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------

const cargarData = async () => {
  $q.loading.show();
  await movimientoStore.loadInformacionMovimientos();
  await movimientoStore.loadBodegas();
  $q.loading.hide();
};

const descargarVale = async (row) => {
  $q.loading.show();
  await movimientoStore.loadMovimiento(row.id);
  await movimientoStore.loadDetalleMovimiento(row.id);
  await miInventarioStore.loadUser();
  if (row.tipo_Movimiento == "Salida") {
    await ValeSalida();
  } else {
    await empleadoStore.loadResponsableByArea(row.area_Id);
    if (movimiento.value.tipo_Movimiento == "Traspaso") {
      movimientoStore.actualizarModalRecibio(true);
    } else {
      await EntregaRecepcion();
      movimientoStore.limpiarInf(true);
    }
  }
  $q.loading.hide();
};

const verFotos = async (id) => {
  $q.loading.show();
  await movimientoStore.loadMovimiento(id);
  await movimientoStore.loadDetalleMovimiento(id);
  movimientoStore.actualizarModalFotos(true);
  $q.loading.hide();
};

const editar = async (id) => {
  $q.loading.show();
  movimientoStore.updateEditar(true);
  movimientoStore.updateVisualizar(false);
  movimientoStore.actualizarModal(true);
  await movimientoStore.loadMovimiento(id);
  await movimientoStore.loadDetalleMovimiento(id);
  $q.loading.hide();
};

const afectar = async (id) => {
  await movimientoStore.loadMovimiento(id);
  $q.dialog({
    title: "Afectar movimiento",
    message: "¿Está seguro de afectar el movimiento?",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "secondary",
      label: "¡Sí!, afectar",
    },
    cancel: {
      color: "red",
      label: " No Cancelar",
    },
  }).onOk(async () => {
    $q.loading.show();
    let resp = await movimientoStore.afectarMovimiento(
      id,
      movimiento.value.tipo_Movimiento
    );
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "positive",
        message: resp.data,
      });
      movimientoStore.loadInformacionMovimientos();
    } else {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "negative",
        message: resp.data,
      });
    }
    movimientoStore.limpiarInf(true);
  });
};

const verMovimiento = async (id) => {
  $q.loading.show();
  movimientoStore.updateVisualizar(true);
  movimientoStore.actualizarModal(true);
  await movimientoStore.loadMovimiento(id);
  await movimientoStore.loadDetalleMovimiento(id);
  $q.loading.hide();
};

const cancelar = async (id) => {
  $q.dialog({
    title: "Cancelar movimiento",
    message: "¿Está seguro de cancelar el movimiento?",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "secondary",
      label: "¡Sí!, cancelar movimiento",
    },
    cancel: {
      color: "red",
      label: " No Cancelar",
    },
  }).onOk(async () => {
    $q.loading.show();
    const resp = await movimientoStore.cancelarMovimiento(id);
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "positive",
        message: resp.data,
      });
      await movimientoStore.loadInformacionMovimientos();
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

const filtrar = (movimientos, filtro) => {
  list_Movimientos_Filtro.value = movimientos.filter((item) => {
    let cumple = true;
    if (filtro.movimiento !== undefined) {
      if (filtro.movimiento == "Todos") {
        cumple = cumple && item.tipo_Movimiento === item.tipo_Movimiento;
      } else {
        cumple = cumple && item.tipo_Movimiento === filtro.movimiento;
      }
    }
    if (filtro.estatus !== undefined) {
      if (filtro.estatus == "Todos") {
        cumple = cumple && item.estatus === item.estatus;
      } else {
        cumple = cumple && item.estatus === filtro.estatus;
      }
    }
    return cumple;
  });
};

watchEffect(() => {
  const filtro = {};
  if (movimiento_Id.value != null) filtro.movimiento = movimiento_Id.value;
  if (estatus_Id.value != null) filtro.estatus = estatus_Id.value;
  filtrar(movimientos.value, filtro);
});

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
    name: "folio",
    align: "center",
    label: "Folio",
    field: "folio",
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
    name: "capturista",
    align: "center",
    label: "Capturista",
    field: "capturista",
    sortable: true,
  },
  {
    name: "area_Capturista",
    align: "center",
    label: "Área capturista",
    field: "area_Capturista",
    sortable: true,
  },
  {
    name: "empleado",
    align: "center",
    label: "Personal",
    field: "empleado",
    sortable: true,
  },
  {
    name: "area",
    align: "center",
    label: "Área personal",
    field: "area",
    sortable: true,
  },
  {
    name: "fecha_Registro",
    align: "center",
    label: "Fecha registro",
    field: "fecha_Registro",
    sortable: true,
  },
  {
    name: "fecha_Afecto",
    align: "center",
    label: "Fecha afecto",
    field: "fecha_Afecto",
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

const pagination = ref({
  page: 1,
  rowsPerPage: 25,
  sortBy: "name",
  descending: false,
});

const filter = ref("");
</script>
<style lang="sass">
.my-sticky-last-column-table
  thead tr:last-child th:last-child
    /* bg color is important for th; just specify one */
    background-color: white

  td:last-child
    background-color: white

  th:last-child,
  td:last-child
    position: sticky
    right: 0
    z-index: 1
</style>
