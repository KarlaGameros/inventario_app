<template>
  <div class="col q-pl-lg q-pr-lg">
    <q-table
      :grid="$q.screen.xs"
      :rows="listFiltroAsignaciones"
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
          label="Área"
          v-model="areaId"
          :options="areas"
          hint="Selecciona una área"
          style="width: 260px"
          class="q-pr-md"
        >
        </q-select>
        <q-select
          dense
          outlined
          v-if="hidden == false"
          label="Empleado"
          v-model="empleado_Id"
          :options="listEmpleados"
          hint="Selecciona una empleado"
          style="width: 260px"
        >
        </q-select>
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
              <q-item
                v-for="col in props.cols.filter((col) => col.name !== 'id')"
                :key="col.name"
              >
                <q-item-section>
                  <q-item-label class="text-bold"
                    >{{ col.label }}:</q-item-label
                  >
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ col.value }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <q-separator />
            <q-card-section class="text-center">
              <q-btn
                v-show="
                  modulo.actualizar &&
                  props.row.estatus == 'Pendiente' &&
                  props.row.tipo != 'Bodega'
                "
                flat
                round
                color="purple-ieen"
                icon="edit"
                @click="editar(props.row.id)"
              >
                <q-tooltip>Editar asignación</q-tooltip>
              </q-btn>
              <q-btn
                v-show="modulo.leer && props.row.estatus != 'Pendiente'"
                flat
                round
                color="purple-ieen"
                icon="search"
                @click="visualizar(props.row.id)"
              >
                <q-tooltip>Ver asignación</q-tooltip>
              </q-btn>
              <q-btn
                v-show="modulo.leer && props.row.tipo == 'Bodega'"
                flat
                round
                color="purple-ieen"
                icon="search"
                @click="visualizarByBodega(props.row)"
              >
                <q-tooltip>Ver asignación por bodega</q-tooltip>
              </q-btn>
              <q-btn
                v-show="
                  modulo.actualizar &&
                  props.row.estatus == 'Pendiente' &&
                  props.row.tipo != 'Bodega'
                "
                flat
                round
                color="purple-ieen"
                icon="send"
                @click="afectar(props.row.id)"
              >
                <q-tooltip>Afectar asignación</q-tooltip>
              </q-btn>
              <q-btn
                v-show="
                  modulo.actualizar &&
                  props.row.estatus == 'Afectado' &&
                  props.row.tipo == 'Personal'
                "
                flat
                round
                color="purple-ieen"
                icon="print"
                @click="GenerarVale(props.row.id)"
              >
                <q-tooltip>Generar vale</q-tooltip>
              </q-btn>
              <q-btn
                v-show="modulo.actualizar && props.row.tipo == 'Bodega'"
                flat
                round
                color="purple-ieen"
                icon="print"
                @click="
                  GenerarValeBodega(props.row.fecha_Registro, props.row.id)
                "
              >
                <q-tooltip>Generar vale bodega</q-tooltip>
              </q-btn>
              <q-btn
                v-show="
                  modulo.actualizar &&
                  props.row.estatus == 'Pendiente' &&
                  props.row.tipo != 'Bodega'
                "
                flat
                round
                color="purple-ieen"
                icon="cancel"
                @click="cancelar(props.row.id)"
              >
                <q-tooltip>Cancelar asignación</q-tooltip>
              </q-btn>
            </q-card-section>
          </q-card>
        </div>
      </template>
      <!--TEMPLATE SCREEN DESKTOP-->
      <template v-slot:body="props" v-else>
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <div v-if="col.name === 'id'">
              <q-btn
                v-show="
                  modulo.actualizar &&
                  props.row.estatus == 'Pendiente' &&
                  props.row.tipo != 'Bodega'
                "
                flat
                round
                color="purple-ieen"
                icon="edit"
                @click="editar(col.value)"
              >
                <q-tooltip>Editar asignación</q-tooltip>
              </q-btn>
              <q-btn
                v-show="modulo.leer && props.row.estatus != 'Pendiente'"
                flat
                round
                color="purple-ieen"
                icon="search"
                @click="visualizar(col.value)"
              >
                <q-tooltip>Ver asignación</q-tooltip>
              </q-btn>
              <q-btn
                v-show="modulo.leer && props.row.tipo == 'Bodega'"
                flat
                round
                color="purple-ieen"
                icon="search"
                @click="visualizarByBodega(props.row)"
              >
                <q-tooltip>Ver asignación por bodega</q-tooltip>
              </q-btn>
              <q-btn
                v-show="
                  modulo.actualizar &&
                  props.row.estatus == 'Pendiente' &&
                  props.row.tipo != 'Bodega'
                "
                flat
                round
                color="purple-ieen"
                icon="send"
                @click="afectar(col.value)"
              >
                <q-tooltip>Afectar asignación</q-tooltip>
              </q-btn>
              <q-btn
                v-show="
                  modulo.actualizar &&
                  props.row.estatus == 'Afectado' &&
                  props.row.tipo == 'Personal'
                "
                flat
                round
                color="purple-ieen"
                icon="print"
                @click="GenerarVale(col.value)"
              >
                <q-tooltip>Generar vale</q-tooltip>
              </q-btn>
              <q-btn
                v-show="modulo.actualizar && props.row.tipo == 'Bodega'"
                flat
                round
                color="purple-ieen"
                icon="print"
                @click="GenerarValeBodega(props.row.fecha_Registro, col.value)"
              >
                <q-tooltip>Generar vale bodega</q-tooltip>
              </q-btn>
              <q-btn
                v-show="
                  modulo.actualizar &&
                  props.row.estatus == 'Pendiente' &&
                  props.row.tipo != 'Bodega'
                "
                flat
                round
                color="purple-ieen"
                icon="cancel"
                @click="cancelar(col.value)"
              >
                <q-tooltip>Cancelar asignación</q-tooltip>
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
            <label v-else-if="col.name == 'folio'" class="text-bold">{{
              col.value
            }}</label>
            <label v-else>{{ col.value }}</label>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useAuthStore } from "../../../stores/auth_store";
import { useAsignacionStore } from "src/stores/asignacion_store";
import { onBeforeMount, ref, watch, watchEffect } from "vue";
import { useInventarioStore } from "src/stores/inventario_store";
import ValeResguardo from "../../../helpers/ValeResguardo";
import ValeByBodega from "../../../helpers/ValeByBodega";

//-----------------------------------------------------------

const $q = useQuasar();
const asignacionStore = useAsignacionStore();
const inventarioStore = useInventarioStore();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const {
  asignaciones,
  areas,
  listEmpleados,
  listFiltroAsignaciones,
  listaAsignacionInventario,
} = storeToRefs(asignacionStore);
const { inventarios } = storeToRefs(inventarioStore);
const areaId = ref(null);
const empleado_Id = ref(null);
const hidden = ref(false);
const inventariosEliminar = ref([]);

//-----------------------------------------------------------

onBeforeMount(() => {
  asignacionStore.loadInformacionAsignaciones();
  asignacionStore.loadAreasList(true);
  areaId.value = { label: "Todos", value: 0 };
  empleado_Id.value = { value: 0, label: "Todos" };
});

//-----------------------------------------------------------

watch(areaId, (val) => {
  if (val.value != 0) {
    asignacionStore.loadEmpleadosByArea(areaId.value.value, true);
    hidden.value = false;
  } else {
    hidden.value = true;
  }
});

//-----------------------------------------------------------

const filtrar = (asignaciones, filtro) => {
  listFiltroAsignaciones.value = asignaciones.filter((item) => {
    let cumple = true;
    if (filtro.area !== undefined) {
      if (filtro.area == "Todos") {
        cumple = cumple && item.area === item.area;
      } else {
        cumple = cumple && item.area === filtro.area;
      }
    }
    if (filtro.empleado !== undefined) {
      if (filtro.empleado == "Todos") {
        cumple = cumple && item.empleado === item.empleado;
      } else {
        cumple = cumple && item.empleado === filtro.empleado;
      }
    }
    return cumple;
  });
};

watchEffect(() => {
  const filtro = {};
  if (areaId.value != null) filtro.area = areaId.value.label;
  if (empleado_Id.value != null) filtro.empleado = empleado_Id.value.label;
  filtrar(asignaciones.value, filtro);
});

//-----------------------------------------------------------

const columns = [
  {
    name: "tipo",
    align: "center",
    label: "Tipo",
    field: "tipo",
    sortable: false,
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
    name: "empleado",
    align: "center",
    label: "Empleado asignación",
    field: "empleado",
    sortable: true,
  },
  {
    name: "area",
    align: "center",
    label: "Área",
    field: "area",
    sortable: true,
  },
  {
    name: "puesto",
    align: "center",
    label: "Puesto",
    field: "puesto",
    sortable: true,
  },
  {
    name: "fecha_Registro",
    align: "center",
    label: "Fecha de registro",
    field: "fecha_Registro",
    sortable: true,
  },
  {
    name: "fecha_Asignacion",
    align: "center",
    label: "Fecha de asignación",
    field: "fecha_Asignacion",
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
  page: 1,
  rowsPerPage: 10,
  sortBy: "name",
  descending: false,
});

const filter = ref("");

//-----------------------------------------------------------

const validarInventario = async (id) => {
  inventariosEliminar.value = [];
  await asignacionStore.detalleAsignacion(id);
  await inventarioStore.loadListInventario(0);
  for (let index = 0; index < listaAsignacionInventario.value.length; index++) {
    const elementInventario = listaAsignacionInventario.value[index];
    const found = inventarios.value.find(
      (element) => element.value == elementInventario.inventario_Id
    );
    if (found == undefined) {
      inventariosEliminar.value.push(elementInventario.id);
    }
  }
  if (inventariosEliminar.value.length != 0) {
    $q.dialog({
      title: "Uno o más productos ya fueron asignados a otro personal",
      message: "¿Desea eliminar el producto de esta lista?",
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
      ok: {
        color: "positive",
        label: "Si, Aceptar",
      },
      cancel: {
        color: "negative",
        label: "No cancelar",
      },
    }).onOk(async () => {
      inventariosEliminar.value.forEach(async (element) => {
        let resp = await asignacionStore.deleteDetalle(element, id);
      });
    });
  } else {
    return true;
  }
};

const afectar = async (id) => {
  const resp = await validarInventario(id);
  if (resp == true) {
    $q.dialog({
      title: "Afectar asignación",
      message: "Al aceptar, se ejecutaran los movimientos realizados",
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
      ok: {
        color: "secondary",
        label: "Si, Aceptar",
      },
      cancel: {
        color: "red",
        label: "No cancelar",
      },
    }).onOk(async () => {
      $q.loading.show();
      const resp = await asignacionStore.afectarAsignacion(id);
      if (resp.success) {
        $q.loading.hide();
        $q.notify({
          position: "top-right",
          type: "positive",
          message: resp.data,
        });
        asignacionStore.loadInformacionAsignaciones();
        asignacionStore.initAsignacion();
      } else {
        $q.loading.hide();
        $q.notify({
          position: "top-right",
          type: "negative",
          message: resp.data,
        });
      }
    });
  }
};

const cancelar = async (id) => {
  $q.dialog({
    title: "Cancelar asignación",
    message: "Al aceptar, se cancelará la asignación",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "secondary",
      label: "Si, Aceptar",
    },
    cancel: {
      color: "red",
      label: "No cancelar",
    },
  }).onOk(async () => {
    $q.loading.show();
    const resp = await asignacionStore.cancelarAsignacion(id);
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "secondary",
        message: resp.data,
      });
      asignacionStore.loadInformacionAsignaciones();
      asignacionStore.initAsignacion();
    } else {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "red",
        message: resp.data,
      });
    }
  });
};

const visualizar = async (id) => {
  $q.loading.show();
  asignacionStore.updateVisualizar(true);
  asignacionStore.actualizarModal(true);
  asignacionStore.updateIsBodega(false);
  await asignacionStore.loadAsignacion(id);
  await asignacionStore.detalleAsignacion(id);
  $q.loading.hide();
};

const visualizarByBodega = async (row) => {
  $q.loading.show();
  var [fechaParte, horaParte] = row.fecha_Registro.split(" ");
  var [dia, mes, año] = fechaParte.split("-");
  var [hora, minutos, segundos] = horaParte.split(":");
  var fecha = `${año}-${mes}-${dia} ${hora}:${minutos}:${segundos}`;
  await asignacionStore.loadAsignacion(row.id);
  await asignacionStore.inventariosByFecha(fecha);
  asignacionStore.updateVisualizar(true);
  asignacionStore.actualizarModal(true);
  asignacionStore.updateIsBodega(true);
  $q.loading.hide();
};

const editar = async (id) => {
  $q.loading.show();
  asignacionStore.updateEditar(true);
  asignacionStore.updateVisualizar(false);
  asignacionStore.actualizarModal(true);
  asignacionStore.updateIsBodega(false);
  await asignacionStore.loadAsignacion(id);
  await asignacionStore.detalleAsignacion(id);
  $q.loading.hide();
};

const GenerarVale = async (id) => {
  let resp = null;
  let respDetalle = null;
  $q.loading.show();
  resp = await asignacionStore.loadAsignacion(id);
  respDetalle = await asignacionStore.detalleAsignacion(id);
  if (resp.success === true) {
    let respVale = await ValeResguardo();
    if (respVale.success == true) {
      asignacionStore.initAsignacion();
    }
  }
  $q.loading.hide();
};

const GenerarValeBodega = async (fecha_Registro, id) => {
  let resp = null;
  let respAsignacion = null;
  var [fechaParte, horaParte] = fecha_Registro.split(" ");
  var [dia, mes, año] = fechaParte.split("-");
  var [hora, minutos, segundos] = horaParte.split(":");
  var fecha = `${año}-${mes}-${dia} ${hora}:${minutos}:${segundos}`;
  $q.loading.show();
  resp = await asignacionStore.inventariosByFecha(fecha);
  respAsignacion = await asignacionStore.loadAsignacion(id);
  if (resp.success === true && respAsignacion.success === true) {
    ValeByBodega();
  }
  asignacionStore.initAsignacion();
  $q.loading.hide();
};
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
