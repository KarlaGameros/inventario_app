<template>
  <div class="q-pb-md">
    <q-banner
      inline-actions
      class="text-justify bg-grey-2"
      style="border-radius: 20px"
    >
      <template v-slot:avatar>
        <q-icon name="inventory_2" flat color="purple-ieen" />
      </template>
      <div class="text-h6 text-purple-ieen text-bold q-pb-xs">
        MI INVENTARIO
      </div>
      <div class="text-body2">{{ miInventario.nombre_completo }}</div>
      <div class="text-body2">{{ miInventario.area }}</div>
    </q-banner>
  </div>
  <div class="q-pb-md">
    <q-banner
      inline-actions
      class="text-justify bg-grey-2"
      style="border-radius: 20px"
    >
      <template v-slot:avatar>
        <q-icon name="campaign" size="lg" flat color="purple-ieen" />
      </template>
      <div class="text-h6 text-purple-ieen text-bold q-pb-xs">Nota</div>
      <div class="text-body2 text-justify">
        Resguardo temporal de préstamo de Bien Mueble del Instituto Estatal
        Electoral de Nayarit. Cualquier daño, perdida o extravío del bien es
        responsabilidad del usuario su reposición. Los importes asentados son
        conforme al valor de la adquisición, sin embargo, en caso de pérdida o
        menoscabo en los bienes bajo resguardo, el valor que en ese momento
        tengan los bienes será calculado tomando en cuenta la depreciación que
        sufran con motivo del deterioro físico por el uso o desgaste de los
        mismo conforme a su naturaleza. Este resguardo se cancela al momento de
        la entrega del bien del usuario responsable al área correspondiente.
      </div>
    </q-banner>
  </div>
  <q-card>
    <q-tabs
      active-color="white"
      indicator-color="purple-ieen"
      align="justify"
      :breakpoint="0"
      v-model="tab"
      inline-label
      class="bg-blue-grey-3 text-white shadow-2"
    >
      <q-tab name="personal" icon="person" label="Personal" />
      <q-tab v-if="bodega" name="bodega" icon="apartment" label="Por bodega" />
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="personal">
        <q-btn
          v-if="listMiInventario.length > 0"
          color="purple-ieen"
          label="Descargar listado"
          icon-right="download"
          class="q-mb-md"
          @click="generarValeByEmpleado()"
        />
        <div class="col">
          <q-table
            :grid="$q.screen.xs"
            :rows="listMiInventario"
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
          </q-table>
        </div>
      </q-tab-panel>
      <q-tab-panel name="bodega">
        <div class="row">
          <div class="col-lg-3 col-xs-12 q-pr-md">
            <q-select
              dense
              color="purple-ieen"
              label="Bodega"
              v-model="bodega_Id"
              :options="bodegas_Filtrado"
              hint="Seleccione una bodega"
            />
          </div>
          <div class="col-lg-3 col-xs-12">
            <q-btn
              v-if="listInventarioByBodega.length > 0"
              color="purple-ieen"
              label="Descargar listado"
              icon-right="download"
              class="q-mb-md"
              @click="generarValeByBodega()"
            />
          </div>
        </div>
        <br />
        <div class="col">
          <q-table
            :grid="$q.screen.xs"
            :rows="list_Inventario_By_Bodega"
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
          </q-table>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar, QSpinnerFacebook } from "quasar";
import { useEmpleadosStore } from "src/stores/empleados_store";
import { onBeforeMount, ref, watch } from "vue";
import { useMiInventarioStore } from "../../../stores/mi_inventario";
import { useAsignacionStore } from "src/stores/asignacion_store";
import { useInventarioStore } from "src/stores/inventario_store";
import { useBodegaStore } from "src/stores/bodega_store";
import ValeGeneralResguardo from "../../../helpers/ValeGeneralResguardo";
import ValeGeneralByBodega from "src/helpers/ValeGeneralByBodega";

//-----------------------------------------------------------

const $q = useQuasar();
const miInventarioStore = useMiInventarioStore();
const empleadosStore = useEmpleadosStore();
const asignacionStore = useAsignacionStore();
const inventarioStore = useInventarioStore();
const bodegasStore = useBodegaStore();
const { bodegas } = storeToRefs(bodegasStore);
const { listInventarioByBodega } = storeToRefs(inventarioStore);
const { listMiInventario, miInventario } = storeToRefs(miInventarioStore);
const { empleadoUsuario, empleado } = storeToRefs(empleadosStore);
const tab = ref("personal");
const bodega_Id = ref(null);
const bodega = ref(false);
const bodegas_Filtrado = ref([]);
const list_Inventario_By_Bodega = ref([]);

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------

watch(bodega_Id, (val) => {
  if (val != null) {
    cargarInventarioByBodega(val);
  }
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
  await empleadosStore.loadEmpleadoByUsuario();
  await empleadosStore.loadResponsableByArea(empleadoUsuario.value.area_Id);
  if (empleadoUsuario.value.id == empleado.value.id) {
    await bodegasStore.loadInformacionBodega();
    bodega.value = true;
    bodegas_Filtrado.value = bodegas.value.filter(
      (x) => x.area_Id == empleado.value.area_Id
    );
  } else {
    bodega.value = false;
  }
  await miInventarioStore.loadMiInventario();
  await miInventarioStore.loadUser();
  $q.loading.hide();
};

const cargarInventarioByBodega = async (val) => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  await empleadosStore.loadResponsableByArea(val.area_Id);
  await inventarioStore.inventarioByBodega(val.value);
  list_Inventario_By_Bodega.value = listInventarioByBodega.value.filter(
    (x) => x.estatus == "Activo" && x.empleado_Id == null
  );
  $q.loading.hide();
};

const generarValeByEmpleado = async () => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  await empleadosStore.loadEmpleadoById(listMiInventario.value[0].empleado_Id);
  await asignacionStore.loadInventarioByEmpleado(
    listMiInventario.value[0].empleado_Id
  );
  await ValeGeneralResguardo();
  $q.loading.hide();
};

const generarValeByBodega = async () => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  await ValeGeneralByBodega(
    list_Inventario_By_Bodega.value,
    bodega_Id.value.label
  );
  $q.loading.hide();
};

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
    name: "importe",
    align: "center",
    label: "Importe",
    field: "importe",
    sortable: true,
  },
];

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  sortBy: "name",
  descending: false,
});

const filter = ref("");
</script>
