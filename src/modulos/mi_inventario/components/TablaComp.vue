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
      <template v-slot:action>
        <q-btn
          v-if="listMiInventario.length > 0"
          color="purple-ieen"
          label="Descargar listado"
          icon-right="download"
          @click="generarValeByEmpleado(true)"
        />
      </template>
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
  <div class="row">
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
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useEmpleadosStore } from "src/stores/empleados_store";
import { onBeforeMount, ref } from "vue";
import { useMiInventarioStore } from "../../../stores/mi_inventario";
import { useAsignacionStore } from "src/stores/asignacion_store";
import ValeGeneralResguardo from "../../../helpers/ValeGeneralResguardo";

//-----------------------------------------------------------

const $q = useQuasar();
const miInventarioStore = useMiInventarioStore();
const empleadosStore = useEmpleadosStore();
const asignacionStore = useAsignacionStore();
const { listMiInventario, miInventario } = storeToRefs(miInventarioStore);

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------

const cargarData = async () => {
  $q.loading.show();
  await miInventarioStore.loadMiInventario();
  await miInventarioStore.loadUser();
  $q.loading.hide();
};

const generarValeByEmpleado = async (valor) => {
  $q.loading.show();
  await empleadosStore.loadEmpleadoById(listMiInventario.value[0].empleado_Id);
  await asignacionStore.loadInventarioByEmpleado(
    listMiInventario.value[0].empleado_Id
  );
  await ValeGeneralResguardo();
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
    name: "numero_serie",
    align: "center",
    label: "Número de serie",
    field: "numero_serie",
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
