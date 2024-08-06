<template>
  <q-dialog
    v-model="modalConceptos"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 90vw">
      <q-card-section class="row">
        <q-img src="../../../assets/IEEN300.png" width="70px" />
        <div
          class="text-h6 text-gray-ieen-1 text-bold absolute-center text-center"
        >
          REGISTRAR CONCEPTO
        </div>
        <q-space />
        <q-btn
          icon="close"
          @click="actualizarModal(false)"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-section>
      <q-card-section>
        <q-form class="row q-col-gutter-xs" @submit="onSubmit">
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <q-input
              color="purple-ieen"
              v-model.trim="concepto.concepto"
              label="Nombre del concepto"
              hint="Ingrese nombre del concepto"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'El nombre es requerido']"
            >
            </q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <q-input
              color="purple-ieen"
              v-model.trim="concepto.descripcion"
              label="Descripción"
              hint="Ingrese descripción"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'La descripción es requerida']"
            >
            </q-input>
          </div>
          <div class="col-12 justify-end q-pt-lg">
            <div class="text-right q-gutter-xs">
              <q-btn
                icon-right="add"
                label="Agregar"
                type="submit"
                color="secondary"
                class="q-ml-sm"
              />
            </div>
          </div>
          <div class="col-12 q-pt-lg q-pb-lg">
            <q-table
              :grid="$q.screen.xs"
              :rows="list_Conceptos_Movimientos"
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
              <!--TEMPLATE SCREEN XS-->
              <template v-if="$q.screen.xs" v-slot:item="props">
                <div
                  class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
                >
                  <q-card bordered class="no-shadow">
                    <q-list dense>
                      <q-item
                        v-for="col in props.cols.filter(
                          (col) => col.name !== 'id'
                        )"
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
                        v-if="modulo == null ? false : modulo.eliminar"
                        flat
                        round
                        color="purple-ieen"
                        icon="delete"
                        @click="eliminarConcepto(props.row)"
                      >
                        <q-tooltip>Eliminar concepto</q-tooltip>
                      </q-btn>
                    </q-card-section>
                  </q-card>
                </div>
              </template>
              <!--TEMPLATE SCREEN DESKTOP-->
              <template v-slot:body="props" v-else>
                <q-tr :props="props">
                  <q-td
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                  >
                    <div v-if="col.name === 'id'">
                      <q-btn
                        v-if="modulo == null ? false : modulo.eliminar"
                        flat
                        round
                        color="purple-ieen"
                        icon="delete"
                        @click="eliminarConcepto(props.row)"
                      >
                        <q-tooltip>Eliminar concepto</q-tooltip>
                      </q-btn>
                    </div>
                    <label v-else>{{ col.value }}</label>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useAuthStore } from "../../../stores/auth_store";
import { useTiposConceptosMovimientos } from "src/stores/tipos-conceptos-movimientos";
import { ref } from "vue";

//-----------------------------------------------------------

const $q = useQuasar();
const tiposConceptosStore = useTiposConceptosMovimientos();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const { modalConceptos, concepto, movimiento, list_Conceptos_Movimientos } =
  storeToRefs(tiposConceptosStore);

//-----------------------------------------------------------

const actualizarModal = (valor) => {
  tiposConceptosStore.actualizarModal(valor);
  tiposConceptosStore.initMovimiento();
  tiposConceptosStore.initConcepto();
};

const eliminarConcepto = async (row) => {
  $q.dialog({
    title: "Eliminar concepto",
    message: `¿Está seguro de eliminar el concepto ${row.concepto} del listado?`,
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
    $q.loading.show();
    let resp = null;
    resp = await tiposConceptosStore.deleteConcepto(row.id);
    $q.loading.hide();
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "positive",
        message: resp.data,
      });
      await tiposConceptosStore.loadConceptosMovimientos(
        row.tipo_Movimiento_Inventario_Id
      );
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

const onSubmit = async () => {
  $q.loading.show();
  concepto.value.tipo_Movimiento_Inventario_Id = movimiento.value.id;
  let resp = await tiposConceptosStore.createConceptoMovimiento(concepto.value);
  if (resp.success) {
    $q.loading.hide();
    $q.notify({
      position: "top-right",
      type: "positive",
      message: resp.data,
    });
    tiposConceptosStore.loadConceptosMovimientos(movimiento.value.id);
    tiposConceptosStore.initConcepto();
  } else {
    $q.loading.hide();
    $q.notify({
      position: "top-right",
      type: "negative",
      message: resp.data,
    });
  }
};

//-----------------------------------------------------------

const columns = [
  {
    name: "concepto",
    align: "center",
    label: "Concepto",
    field: "concepto",
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
    name: "id",
    align: "center",
    label: "Acciones",
    field: "id",
    sortable: false,
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
