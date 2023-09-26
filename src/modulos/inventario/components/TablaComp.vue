<template>
  <div class="row">
    <div v-if="isLoading" color="purple" label="Show Loading"></div>
    <div v-else class="col">
      <q-table
        :rows="listFiltroInventario"
        :columns="columns"
        :filter="filter"
        :pagination="pagination"
        row-key="id"
        rows-per-page-label="Filas por pagina"
        no-data-label="No hay registros"
      >
        <template v-slot:top-left>
          <q-select
            v-model="catalogoId"
            :options="listCatalogosTodos"
            label="Selecciona un catalogo"
            hint="Seleccione un estatus de inventarios a mostrar"
            style="width: 260px"
          >
          </q-select>

          <q-select
            v-model="estatusId"
            :options="estatus"
            label="Selecciona un estatus"
            hint="Seleccione un catalogo de inventarios a mostrar"
            style="width: 260px"
          >
          </q-select>
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
                  flat
                  round
                  color="purple-ieen"
                  icon="image"
                  @click="loadFotos(col.value, true)"
                >
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
import { onBeforeMount, ref, watchEffect } from "vue";
import { useAuthStore } from "../../../stores/auth_store";
import { useInventarioStore } from "../../../stores/inventario_store";
import { useCatalogoProductoStore } from "src/stores/catalogos_producto_store";
import { useEstatusStore } from "src/stores/estatus_store";
import ModalFotos from "../components/ModalViewFotos.vue";
import ModalPDF from "../components/ModalPDF.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const inventarioStore = useInventarioStore();
const catalogoStore = useCatalogoProductoStore();
const estatusStore = useEstatusStore();
const { listFiltroInventario, listInventario, inventario } =
  storeToRefs(inventarioStore);
const { listCatalogosTodos } = storeToRefs(catalogoStore);
const { estatus } = storeToRefs(estatusStore);
const catalogoId = ref(null);
const estatusId = ref(null);
const isLoading = ref(false);
let timer;
//-----------------------------------------------------------

onBeforeMount(() => {
  if (catalogoId.value == null && estatusId.value == null) {
    $q.loading.show({
      message: "Cargando...",
    });
    cargarInventarios();
    setTimeout(() => {
      $q.loading.hide();
    }, 2000);
  }
  estatusStore.loadEstatusList(true);
  catalogoStore.loadCatalogoList(true);
  estatusId.value = { value: 0, label: "Todos" };
  catalogoId.value = { value: 0, label: "Todos" };
});

//-----------------------------------------------------------
//FILTRAR
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
  if (catalogoId.value != null) filtro.catalogo = catalogoId.value.value;
  if (estatusId.value != null) filtro.estatus = estatusId.value.label;
  filtrar(listInventario.value, filtro);
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
    name: "emplado",
    align: "center",
    label: "Empleado",
    field: "empleado",
    sortable: true,
  },
  {
    name: "fecha_compra",
    align: "center",
    label: "Fecha de Compra",
    field: "fecha_compra",
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

const cargarInventarios = async () => {
  await inventarioStore.loadInformacionInventarios();
};

const loadFotos = (id, valor) => {
  inventarioStore.loadInventario(id);
  inventarioStore.actualizarModalFotos(valor);
};

const mostrarPDF = async (valor, id) => {
  $q.loading.show();
  await inventarioStore.loadInventario(id);
  if (inventario.value.ruta_PDF != null) {
    inventarioStore.actualizarModalPDF(valor);
  } else if (inventario.value.ruta_PDF == null) {
    await inventarioStore.generarPDF(id);
    inventarioStore.actualizarModalPDF(valor);
  }
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
</script>

<style></style>
