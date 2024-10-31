<template>
  <template v-if="isLoading">
    <div class="q-pa-md">
      <div class="absolute-center">
        <q-spinner color="grey" size="10.5em" />
      </div>
    </div>
  </template>
  <template v-else>
    <div class="row q-pl-lg q-pr-lg">
      <div class="col">
        <q-table
          :grid="$q.screen.xs"
          :rows="listFiltroInventario"
          :columns="columns"
          :filter="filter"
          :pagination="pagination"
          :visible-columns="visible_columns"
          row-key="id"
          rows-per-page-label="Filas por pagina"
          no-data-label="No hay registros"
          class="my-sticky-last-column-table"
        >
          <template v-slot:top-left>
            <q-select
              outlined
              dense
              color="purple-ieen"
              class="q-pr-xs"
              v-model="catalogoId"
              :options="listCatalogosTodos"
              label="Selecciona un catalogo"
              hint="Seleccione un catálogo de inventarios"
              style="width: 300px"
            >
            </q-select>
            <q-select
              outlined
              dense
              color="purple-ieen"
              class="q-pr-xs"
              v-model="estatusId"
              placeholder="Todos"
              :options="estatus"
              :label="estatusId.length == 0 ? 'Todos' : 'Selecciona estatus'"
              hint="Seleccione uno o más estatus"
              style="width: 300px"
              multiple
              use-chips
            >
            </q-select>
            <q-btn
              flat
              class="q-mr-md"
              color="purple-ieen"
              text-color="purple-ieen"
              icon="cleaning_services"
              @click="limpiarFiltros()"
              label="Limpiar filtros"
            />
          </template>
          <template v-slot:top-right>
            <q-input
              outlined
              dense
              debounce="300"
              v-model="filter"
              placeholder="Buscar..."
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
                    v-for="col in props.cols.filter(
                      (col) => col.name !== 'vermas'
                    )"
                    :key="col.name"
                  >
                    <q-item-section>
                      <q-item-label class="text-bold"
                        >{{ col.label }}:</q-item-label
                      >
                    </q-item-section>
                    <q-item-section>
                      <div v-if="col.name == 'id'">
                        <q-btn
                          v-if="modulo == null ? false : modulo.leer"
                          flat
                          round
                          color="purple-ieen"
                          icon="account_tree"
                          @click="verKardex(props.row.id)"
                        >
                          <q-tooltip>Ver kardex</q-tooltip>
                        </q-btn>
                        <q-btn
                          v-if="modulo == null ? false : modulo.leer"
                          flat
                          round
                          color="purple-ieen"
                          icon="image"
                          @click="loadFotos(props.row.id, true)"
                        >
                          <q-tooltip>Ver imagen</q-tooltip>
                        </q-btn>
                        <q-btn
                          v-if="modulo == null ? false : modulo.leer"
                          flat
                          round
                          color="purple-ieen"
                          icon="qr_code_scanner"
                          @click="mostrarPDF(true, props.row.id)"
                        >
                          <q-tooltip>Generar PDF</q-tooltip>
                        </q-btn>
                        <q-btn
                          v-if="modulo == null ? false : modulo.actualizar"
                          flat
                          round
                          color="purple-ieen"
                          icon="edit"
                          @click="editar(props.row.id)"
                        >
                          <q-tooltip>Editar inventario</q-tooltip>
                        </q-btn>
                        <q-btn
                          v-if="modulo == null ? false : modulo.eliminar"
                          flat
                          round
                          color="purple-ieen"
                          icon="delete"
                          @click="eliminar(props.row.id)"
                        >
                          <q-tooltip>Eliminar inventario</q-tooltip>
                        </q-btn>
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
              <q-td auto-width>
                <q-btn
                  size="sm"
                  color="purple-ieen"
                  round
                  dense
                  @click="props.expand = !props.expand"
                  :icon="props.expand ? 'remove' : 'add'"
                  class="absolute-center"
                />
              </q-td>
              <q-td
                v-for="col in props.cols.filter((x) => x.name !== 'vermas')"
                :key="col.name"
                :props="props"
              >
                <div v-if="col.name === 'id'">
                  <q-btn
                    flat
                    round
                    color="purple-ieen"
                    icon="account_tree"
                    @click="verKardex(col.value)"
                  >
                    <q-tooltip>Ver kardex</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    color="purple-ieen"
                    icon="image"
                    @click="loadFotos(col.value, true)"
                  >
                    <q-tooltip>Ver imagen</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    color="purple-ieen"
                    icon="qr_code_scanner"
                    @click="mostrarPDF(true, col.value)"
                  >
                    <q-tooltip>Generar PDF</q-tooltip>
                  </q-btn>
                  <q-btn
                    v-if="modulo.actualizar"
                    flat
                    round
                    color="purple-ieen"
                    icon="edit"
                    @click="editar(col.value)"
                  >
                    <q-tooltip>Editar inventario</q-tooltip>
                  </q-btn>
                  <q-btn
                    v-if="modulo.eliminar"
                    flat
                    round
                    color="purple-ieen"
                    icon="delete"
                    @click="eliminar(col.value)"
                  >
                    <q-tooltip>Eliminar inventario</q-tooltip>
                  </q-btn>
                </div>
                <div v-else-if="col.name == 'descripcion'">
                  <label>{{ col.value }}</label>
                  <q-tooltip
                    :offset="[10, 10]"
                    v-if="
                      col.value.length !=
                      props.row['descripcion_completo'].length
                    "
                  >
                    {{ props.row["descripcion_completo"] }}
                  </q-tooltip>
                </div>
                <label v-else-if="col.name == 'clave'" class="text-bold">{{
                  col.value
                }}</label>
                <label v-else-if="col.name == 'estatus'" class="text-bold">{{
                  col.value
                }}</label>
                <label v-else>{{ col.value }}</label>
              </q-td>
            </q-tr>
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <div class="text-left q-pa-xs">
                  <b>Fecha de registro:</b>
                  {{ props.row.fecha_Registro }}
                </div>
                <div class="text-left q-pa-xs">
                  <b>Fecha de compra:</b>
                  {{ props.row.fecha_compra }}
                </div>
                <div
                  v-if="props.row.fecha_Baja != ''"
                  class="text-left q-pa-xs"
                >
                  <b>Fecha de baja:</b>
                  {{ props.row.fecha_Baja }}
                </div>
                <div
                  v-if="props.row.fecha_Comodato != ''"
                  class="text-left q-pa-xs"
                >
                  <b>Fecha comodato:</b>
                  {{ props.row.fecha_Comodato }}
                </div>
                <div
                  v-if="props.row.fecha_Donacion != ''"
                  class="text-left q-pa-xs"
                >
                  <b>Fecha donación:</b>
                  {{ props.row.fecha_Donacion }}
                </div>
                <div class="text-left q-pa-xs">
                  <b>No. Factura:</b>
                  {{ props.row.factura }}
                </div>
                <div class="text-left q-pa-xs">
                  <b>UUID:</b>
                  {{ props.row.uuid }}
                </div>
                <div class="text-left q-pa-xs">
                  <b>Importe:</b>
                  {{ props.row.importe }}
                </div>
                <div class="text-left q-pa-xs">
                  <b>Observaciones:</b>
                  {{
                    props.row.observaciones != null
                      ? props.row.observaciones
                      : "Sin observaciones"
                  }}
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <ModalFotos />
        <ModalPDF />
      </div>
    </div>
  </template>
</template>

<script setup>
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useQuasar, QSpinnerFacebook, exportFile } from "quasar";
import { onBeforeMount, ref, watchEffect } from "vue";
import { useAuthStore } from "../../../stores/auth_store";
import { useInventarioStore } from "../../../stores/inventario_store";
import { useCatalogoProductoStore } from "src/stores/catalogos_producto_store";
import ModalFotos from "../components/ModalViewFotos.vue";
import ModalPDF from "../components/ModalPDF.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const authStore = useAuthStore();
const inventarioStore = useInventarioStore();
const catalogoStore = useCatalogoProductoStore();
const router = useRouter();
const { modulo } = storeToRefs(authStore);
const { listFiltroInventario, listInventario } = storeToRefs(inventarioStore);
const { listCatalogosTodos } = storeToRefs(catalogoStore);
const catalogoId = ref(null);
const estatusId = ref([]);
const isLoading = ref(false);
const estatus = ref([
  "Activo",
  "Asignado",
  "Mantenimiento",
  "Donación",
  "Baja",
  "Comodato",
  "Pendiente Donación",
  "Pendiente Baja",
  "Pendiente Comodato",
]);

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------

const cargarData = async () => {
  if (catalogoId.value == null) {
    $q.loading.show({
      spinner: QSpinnerFacebook,
      spinnerColor: "purple-ieen",
      spinnerSize: 140,
      backgroundColor: "purple-3",
      message: "Espere un momento, por favor...",
      messageColor: "black",
    });
    cargarInventarios();
    setTimeout(() => {
      $q.loading.hide();
    }, 2000);
  }
  await catalogoStore.loadCatalogoList(true);
  catalogoId.value = { value: 0, label: "Todos" };
};

const filtrar = (listInventario, filtro) => {
  listFiltroInventario.value = listInventario.filter((item) => {
    let cumple = true;
    if (filtro.catalogo !== undefined) {
      if (filtro.catalogo == 0) {
        cumple = cumple && item.catalogo_id === item.catalogo_id;
      } else {
        cumple = cumple && item.catalogo_id === filtro.catalogo;
      }
    }
    if (filtro.estatus !== undefined) {
      if (filtro.estatus.length == 0) {
        cumple = cumple && item.estatus === item.estatus;
      } else {
        cumple = cumple && estatusId.value.includes(item.estatus);
      }
    }
    return cumple;
  });
};

watchEffect(() => {
  const filtro = {};
  if (catalogoId.value != null) filtro.catalogo = catalogoId.value.value;
  if (estatusId.value != null) filtro.estatus = estatusId.value;
  filtrar(listInventario.value, filtro);
});

//-----------------------------------------------------------

const limpiarFiltros = () => {
  catalogoId.value = { value: 0, label: "Todos" };
  estatusId.value = [];
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
  inventarioStore.updateEditar(true);
  await inventarioStore.loadInventario(id);
  inventarioStore.actualizarModal(true);
  $q.loading.hide();
};

const cargarInventarios = async () => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  isLoading.value = true;
  await inventarioStore.loadInformacionInventarios();
  isLoading.value = false;
  $q.loading.hide();
};

const loadFotos = (id, valor) => {
  inventarioStore.loadInventario(id);
  inventarioStore.actualizarModalFotos(valor);
};

function wrapCsvValue(val, formatFn, row) {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val;
  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);
  formatted = formatted.split('"').join('""');
  return `"${formatted}"`;
}

const downloadInventario = () => {
  let date = new Date().toLocaleDateString();
  const content = [columns.map((col) => wrapCsvValue(col.label))]
    .concat(
      listFiltroInventario.value.map((row) =>
        columns
          .map((col) =>
            wrapCsvValue(
              typeof col.field === "function"
                ? col.field(row)
                : row[col.field === void 0 ? col.name : col.field],
              col.format,
              row
            )
          )
          .join(",")
      )
    )
    .join("\r\n");
  const bom = "\uFEFF";
  const status = exportFile(
    `ListadoInventario_${date}`,
    bom + content,
    "text/csv;charset=utf-8"
  );
  if (status !== true) {
    $q.notify({
      message:
        "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
      color: "negative",
      icon: "warning",
    });
  }
};

const mostrarPDF = async (valor, id) => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  // await inventarioStore.loadInventario(id);
  // if (inventario.value.ruta_PDF != null) {
  //   inventarioStore.actualizarModalPDF(valor);
  // } else if (inventario.value.ruta_PDF == null) {
  //   await inventarioStore.generarPDF(id);
  //   inventarioStore.actualizarModalPDF(valor);
  // }
  await inventarioStore.generarPDF(id);
  inventarioStore.actualizarModalPDF(valor);
  $q.loading.hide();
};

const eliminar = async (id) => {
  $q.dialog({
    title: "Eliminar inventario",
    message: "¿Está seguro de eliminar el inventario?",
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
    $q.loading.show({
      spinner: QSpinnerFacebook,
      spinnerColor: "purple-ieen",
      spinnerSize: 140,
      backgroundColor: "purple-3",
      message: "Espere un momento, por favor...",
      messageColor: "black",
    });
    const resp = await inventarioStore.deleteInventario(id);
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "positive",
        message: resp.data,
      });
      inventarioStore.loadInformacionInventarios();
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

const verKardex = async (id) => {
  await inventarioStore.loadInventario(id);
  await inventarioStore.loadKardex(id);
  router.push({
    name: "historial_Inventario",
  });
};

//-----------------------------------------------------------

const visible_columns = ref([
  "vermas",
  "estatus",
  "catalogo",
  "bodega",
  "empleado",
  "clave",
  "nombre_corto",
  "descripcion",
  "marca",
  "modelo",
  "numero_Serie",
  "color",
  "id",
]);
const columns = [
  {
    name: "vermas",
    align: "center",
    label: "Ver más",
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
    name: "catalogo",
    align: "center",
    label: "Catálogo perteneciente",
    field: "catalogo",
    sortable: true,
  },
  {
    name: "bodega",
    align: "center",
    label: "Bodega origen",
    field: "bodega",
    sortable: true,
  },
  {
    name: "empleado",
    align: "center",
    label: "Empleado",
    field: "empleado",
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
    name: "nombre_corto",
    align: "center",
    label: "Nombre",
    field: "nombre_corto",
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
    name: "marca",
    align: "center",
    label: "Marca",
    field: "marca",
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
    name: "numero_Serie",
    align: "center",
    label: "Número de serie",
    field: "numero_Serie",
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
    name: "fecha_Registro",
    align: "center",
    label: "Fecha registro",
    field: "fecha_Registro",
    sortable: true,
  },
  {
    name: "fecha_compra",
    align: "center",
    label: "Fecha compra",
    field: "fecha_compra",
    sortable: true,
  },
  {
    name: "fecha_Baja",
    align: "center",
    label: "Fecha baja",
    field: "fecha_Baja",
    sortable: true,
  },
  {
    name: "fecha_Comodato",
    align: "center",
    label: "Fecha comodato",
    field: "fecha_Comodato",
    sortable: true,
  },
  {
    name: "fecha_Donacion",
    align: "center",
    label: "Fecha donación",
    field: "fecha_Donacion",
    sortable: true,
  },
  {
    name: "factura",
    align: "center",
    label: "No. Factura",
    field: "factura",
    sortable: true,
  },
  {
    name: "uuid",
    align: "center",
    label: "UUID",
    field: "uuid",
    sortable: true,
  },
  {
    name: "importe",
    align: "center",
    label: "Importe",
    field: "importe",
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
    background-color: white

  td:last-child
    background-color: white

  th:last-child,
  td:last-child
    position: sticky
    right: 0
    z-index: 1
</style>
