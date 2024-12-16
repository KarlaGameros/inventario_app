<template>
  <q-page>
    <div class="row bg-grey-1">
      <div class="col-9">
        <div class="q-pa-md q-gutter-sm">
          <div class="text-gray-ieen-1 text-h6">Inventario</div>
          <q-breadcrumbs>
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="primary" />
            </template>
            <q-breadcrumbs-el icon="home" label="Inicio" to="/" />
            <q-breadcrumbs-el
              icon="library_books"
              class="text-grey-7"
              label="Inventario"
            />
          </q-breadcrumbs>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col text-right">
        <div v-if="$q.screen.xs" class="q-pa-md items-start q-gutter-md">
          <q-list dense padding class="rounded-borders">
            <q-item>
              <q-btn
                label="Nuevo"
                v-if="modulo == null ? false : modulo.registrar"
                type="button"
                color="purple-ieen"
                @click="actualizarModal(true)"
                text-color="white"
                icon-right="add"
              />
            </q-item>
            <q-item>
              <q-btn
                color="purple-ieen"
                text-color="white"
                @click="generarExcel()"
                label="Excel"
              >
                <i class="q-pl-sm fa-solid fa-file-excel"></i>
              </q-btn>
            </q-item>
            <q-item>
              <q-btn
                color="purple-ieen"
                text-color="white"
                icon-right="qr_code_2"
                label="QR nuevos"
                @click="generarQR()"
              />
            </q-item>
            <q-item>
              <q-btn
                color="purple-ieen"
                text-color="white"
                icon-right="print"
                @click="generar()"
                label="Imprimir listado"
              />
            </q-item>
            <q-item>
              <q-btn
                v-if="modulo == null ? false : modulo.registrar"
                type="button"
                color="purple-ieen"
                @click="asignarFactura(true)"
                text-color="white"
                icon-right="fact_check"
                label="Asignar factura"
              />
            </q-item>
          </q-list>
        </div>
        <div v-else class="text-right q-pa-md items-start q-gutter-md">
          <q-btn
            label="Nuevo"
            v-if="modulo == null ? false : modulo.registrar"
            type="button"
            color="purple-ieen"
            @click="actualizarModal(true)"
            text-color="white"
            icon-right="add"
          />
          <q-btn
            color="purple-ieen"
            text-color="white"
            @click="generarExcel()"
            label="Excel"
          >
            <i class="q-pl-sm fa-solid fa-file-excel"></i>
          </q-btn>
          <q-btn
            color="purple-ieen"
            text-color="white"
            icon-right="qr_code_2"
            label="QR nuevos"
            @click="generarQR()"
          />
          <q-btn
            color="purple-ieen"
            text-color="white"
            icon-right="print"
            @click="generar()"
            label="Imprimir listado"
          />
          <q-btn
            v-if="modulo == null ? false : modulo.registrar"
            type="button"
            color="purple-ieen"
            @click="asignarFactura(true)"
            text-color="white"
            icon-right="fact_check"
            label="Asignar factura"
          />
        </div>
      </div>
    </div>
    <TablaComp />
    <ModalComp />
    <ModalFactura />
  </q-page>
</template>

<script setup>
import { useQuasar, QSpinnerFacebook, exportFile } from "quasar";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../../../stores/auth_store";
import { useInventarioStore } from "src/stores/inventario_store";
import { onBeforeMount, ref } from "vue";
import ReporteListadoInventario from "../../../helpers/ListadoInventario";
import TablaComp from "../components/TablaComp.vue";
import ModalComp from "../components/ModalComp.vue";
import ModalFactura from "../components/ModalFactura.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const authStore = useAuthStore();
const inventarioStore = useInventarioStore();
const { modulo, inventario } = storeToRefs(authStore);
const { listFiltroInventario } = storeToRefs(inventarioStore);
const siglas = "SI-CAT-INV";

//-----------------------------------------------------------

onBeforeMount(() => {
  leerPermisos();
});

//-----------------------------------------------------------

const leerPermisos = async () => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};

const actualizarModal = (valor) => {
  inventarioStore.actualizarModal(valor);
  inventarioStore.updateEditar(false);
  inventarioStore.initInventario();
};

const generar = async () => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  await inventarioStore.loadInformacionInventarios();
  setTimeout(() => {
    $q.loading.hide();
    ReporteListadoInventario();
  }, 1000);
};

const generarQR = async () => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  let resp = null;
  resp = await inventarioStore.generarPDFmasivo();
  if (resp.success == true) {
    inventarioStore.actualizarModalPDF(true);
  } else {
    $q.dialog({
      title: "Atención",
      message: "No hay códigos QR nuevos",
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
    });
  }
  $q.loading.hide();
};

// const generarExcel = async () => {
//   $q.loading.show({
//     spinner: QSpinnerFacebook,
//     spinnerColor: "purple-ieen",
//     spinnerSize: 140,
//     backgroundColor: "purple-3",
//     message: "Espere un momento, por favor...",
//     messageColor: "black",
//   });
//   await inventarioStore.downloadExcelInventario();
//   const link = document.createElement("a");
//   link.href = inventarioStore.excelIventario;
//   link.setAttribute("download", "ListadoInventario.xlsx");
//   document.body.appendChild(link);
//   link.click();
//   $q.loading.hide();
// };

function wrapCsvValue(val, formatFn, row) {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val;
  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);
  formatted = formatted.split('"').join('""');
  return `"${formatted}"`;
}

const generarExcel = () => {
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

const columns = [
  {
    name: "id",
    align: "center",
    label: "Id",
    field: "id",
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
    name: "estatus",
    align: "center",
    label: "Estatus",
    field: "estatus",
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
    name: "descripcion_completo",
    align: "center",
    label: "Descripción",
    field: "descripcion_completo",
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
    name: "fecha_Registro",
    align: "center",
    label: "Fecha de Registro",
    field: "fecha_Registro",
    sortable: true,
  },
  {
    name: "fecha_Baja",
    align: "center",
    label: "Fecha Baja",
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
    name: "observaciones",
    align: "center",
    label: "Observaciones",
    field: "observaciones",
    sortable: true,
  },
];

const asignarFactura = async (valor) => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  inventarioStore.loadSinFactura();
  inventarioStore.actualizarModalFactura(valor);
  $q.loading.hide();
};
</script>
