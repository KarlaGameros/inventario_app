<template>
  <div class="row q-pl-lg q-pr-lg">
    <div class="col">
      <q-table
        :grid="$q.screen.xs"
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
            outlined
            dense
            class="q-pr-xs"
            color="purple-ieen"
            style="width: 250px"
            v-model="movimiento_Id"
            :options="tipos_Movimientos"
            label="Tipo de movimiento"
            hint="Seleccione una opción"
          />
          <q-select
            outlined
            dense
            class="q-pr-xs"
            color="purple-ieen"
            style="width: 250px"
            v-model="estatus_Id"
            :options="list_Estatus"
            label="Estatus"
            hint="Seleccione estatus"
          />
        </template>
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
                        v-if="
                          modulo == null
                            ? false
                            : modulo.actualizar &&
                              props.row.estatus == 'Afectado'
                        "
                        flat
                        round
                        color="purple-ieen"
                        icon="print"
                        @click="descargarVale(props.row)"
                      />
                      <q-btn
                        v-if="
                          modulo == null
                            ? false
                            : modulo.actualizar &&
                              props.row.estatus == 'Afectado' &&
                              props.row.tipo_Movimiento == 'Salida'
                        "
                        flat
                        round
                        color="purple-ieen"
                        icon="add_a_photo"
                        @click="verFotos(col.value)"
                      />
                      <q-btn
                        v-if="
                          modulo == null
                            ? false
                            : modulo.actualizar &&
                              props.row.estatus == 'Pendiente'
                        "
                        flat
                        round
                        color="purple-ieen"
                        icon="edit"
                        @click="editar(col.value)"
                      />
                      <q-btn
                        v-if="
                          modulo == null
                            ? false
                            : modulo.actualizar &&
                              props.row.estatus == 'Pendiente'
                        "
                        flat
                        round
                        color="purple-ieen"
                        icon="send"
                        @click="afectar(col.value)"
                      />
                      <q-btn
                        v-if="
                          modulo == null
                            ? false
                            : modulo.actualizar &&
                              props.row.estatus == 'Pendiente'
                        "
                        flat
                        round
                        color="purple-ieen"
                        icon="cancel"
                        @click="cancelar(col.value)"
                      />
                      <q-btn
                        v-if="
                          modulo == null
                            ? false
                            : modulo.actualizar &&
                              props.row.estatus != 'Pendiente'
                        "
                        flat
                        round
                        color="purple-ieen"
                        icon="search"
                        @click="verMovimiento(col.value)"
                      />
                    </div>
                    <q-item-label v-else>{{ col.value }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
              <q-separator />
            </q-card>
          </div>
        </template>
        <!--TEMPLATE SCREEN DESKTOP-->
        <template v-slot:body="props" v-else>
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <div v-if="col.name === 'id'">
                <q-btn
                  v-if="
                    modulo == null
                      ? false
                      : modulo.actualizar && props.row.estatus == 'Afectado'
                  "
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
                    modulo == null
                      ? false
                      : modulo.actualizar &&
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
                  v-if="
                    modulo == null
                      ? false
                      : modulo.actualizar && props.row.estatus == 'Pendiente'
                  "
                  flat
                  round
                  color="purple-ieen"
                  icon="edit"
                  @click="editar(col.value)"
                >
                  <q-tooltip>Editar movimiento</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="
                    modulo == null
                      ? false
                      : modulo.actualizar && props.row.estatus == 'Pendiente'
                  "
                  flat
                  round
                  color="purple-ieen"
                  icon="send"
                  @click="afectar(col.value)"
                >
                  <q-tooltip>Afectar movimiento</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="
                    modulo == null
                      ? false
                      : modulo.actualizar && props.row.estatus == 'Pendiente'
                  "
                  flat
                  round
                  color="purple-ieen"
                  icon="cancel"
                  @click="cancelar(col.value)"
                >
                  <q-tooltip>Cancelar movimiento</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="
                    modulo == null
                      ? false
                      : modulo.actualizar && props.row.estatus != 'Pendiente'
                  "
                  flat
                  round
                  color="purple-ieen"
                  icon="search"
                  @click="verMovimiento(col.value)"
                >
                  <q-tooltip>Ver movimiento</q-tooltip>
                </q-btn>
              </div>
              <div v-else-if="col.name == 'estatus'">
                <q-badge
                  :color="
                    col.value == 'Pendiente'
                      ? 'orange'
                      : col.value == 'Cancelado'
                      ? 'red'
                      : 'green'
                  "
                  :label="col.value"
                >
                  <q-icon
                    :name="
                      col.value == 'Pendiente'
                        ? 'warning'
                        : col.value == 'Cancelado'
                        ? 'close'
                        : 'done'
                    "
                  />
                </q-badge>
              </div>
              <label
                v-else-if="col.name == 'tipo_Movimiento'"
                class="text-bold"
                >{{ col.value }}</label
              >
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
import { useQuasar, QSpinnerFacebook } from "quasar";
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
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  await movimientoStore.loadInformacionMovimientos();
  await movimientoStore.loadBodegas();
  $q.loading.hide();
};

const descargarVale = async (row) => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  await movimientoStore.loadMovimiento(row.id);
  await movimientoStore.loadDetalleMovimiento(row.id);
  await miInventarioStore.loadUser();
  if (row.tipo_Movimiento == "Salida") {
    await ValeSalida();
  } else {
    if (row.area_Id != null) {
      await empleadoStore.loadResponsableByArea(row.area_Id);
    }
    if (movimiento.value.tipo_Movimiento == "Traspaso") {
      movimientoStore.actualizarModalRecibio(true);
    } else {
      await EntregaRecepcion();
    }
  }
  movimientoStore.initDetalleMovimiento();
  $q.loading.hide();
};

const verFotos = async (id) => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  await movimientoStore.loadMovimiento(id);
  await movimientoStore.loadDetalleMovimiento(id);
  movimientoStore.actualizarModalFotos(true);
  $q.loading.hide();
};

const editar = async (id) => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  movimientoStore.updateEditar(true);
  movimientoStore.updateVisualizar(false);
  movimientoStore.actualizarModal(true);
  await movimientoStore.loadMovimiento(id);
  await movimientoStore.loadDetalleMovimiento(id);
  $q.loading.hide();
};

const afectar = async (id) => {
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
    $q.loading.show({
      spinner: QSpinnerFacebook,
      spinnerColor: "purple-ieen",
      spinnerSize: 140,
      backgroundColor: "purple-3",
      message: "Espere un momento, por favor...",
      messageColor: "black",
    });
    await movimientoStore.loadMovimiento(id);
    let resp = await movimientoStore.afectarMovimiento(
      id,
      movimiento.value.tipo_Movimiento
    );
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "positive",
        message: "La asignación se afectó correctamente",
      });
      movimientoStore.loadInformacionMovimientos();
    } else {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "negative",
        message:
          "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
      });
    }
  });
};

const verMovimiento = async (id) => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
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
    $q.loading.show({
      spinner: QSpinnerFacebook,
      spinnerColor: "purple-ieen",
      spinnerSize: 140,
      backgroundColor: "purple-3",
      message: "Espere un momento, por favor...",
      messageColor: "black",
    });
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
    name: "concepto",
    align: "center",
    label: "Concepto",
    field: "concepto",
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
    name: "fecha_Movimiento",
    align: "center",
    label: "Fecha movimiento",
    field: "fecha_Movimiento",
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
  rowsPerPage: 10,
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
