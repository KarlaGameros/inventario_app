<template>
  <!-- <div class="row">
    <div class="col-12">
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
      </q-banner>
    </div>
  </div> -->
  <br />
  <q-btn
    :to="{ name: 'inventario' }"
    icon="arrow_back"
    label="Regresar"
    class="q-mb-md"
    color="purple-ieen"
  />
  <q-separator />
  <div class="text-center text-h5 text-bold text-purple-ieen">
    "{{ inventario.clave }} - {{ inventario.nombre_corto }}"
  </div>
  <q-separator />
  <br />
  <div class="row">
    <div v-for="(movimiento, index) in list_Kardex" :key="movimiento">
      <div
        class="q-gutter-md q-pa-md"
        style="display: flex; align-items: center; width: 400px"
      >
        <q-card class="no-shadow" bordered style="flex: 1">
          <q-card-section class="q-pt-none">
            <q-badge class="absolute-left" color="grey-4" />
            <q-badge rounded color="purple-ieen" :label="index + 1" />
            <q-icon
              v-if="index + 1 == list_Kardex.length"
              rounded
              class="float-right"
              size="md"
              color="green"
              name="location_on"
            />
            <div class="text-h6 text-grey-8 text-center text-bold">
              {{ movimiento.concepto }}
            </div>
            <div class="text-caption text-grey-8 text-center">
              <b>Folio del movimiento:</b> {{ movimiento.folio_Movimiento
              }}<br />
              <b>Fecha de registro:</b> {{ movimiento.fecha_Registro }} <br />
              <b>Tipo de movimiento:</b> {{ movimiento.tipo_Movimiento }} <br />
              <b>Capturista:</b> {{ movimiento.capturista }} <br />
            </div>
          </q-card-section>
        </q-card>
        <div class="q-ml-md" v-if="index + 1 != list_Kardex.length">
          <q-img src="~assets/arrow-right.png" style="width: 50px" />
        </div>
        <div class="q-ml-md" v-else style="width: 50px"></div>
      </div>
    </div>

    <!-- <div class="col-lg-6 col-sm-12 q-pa-md q-gutter-sm">
      <q-timeline color="purple-ieen">
        <q-timeline-entry
          v-for="movimiento in list_Kardex"
          :key="movimiento"
          :subtitle="movimiento.concepto"
        >
          <div>
            <div>
              <b>Folio del movimiento:</b> {{ movimiento.folio_Movimiento }}
            </div>
            <div>
              <b>Fecha de movimiento:</b> {{ movimiento.fecha_Registro }}
            </div>
            <div>
              <b>Tipo de movimiento:</b> {{ movimiento.tipo_Movimiento }}
            </div>
            <div><b>Capturista:</b> {{ movimiento.capturista }}</div>
            <div><b>Fecha de registro:</b> {{ movimiento.fecha_Registro }}</div>
          </div>
        </q-timeline-entry>
      </q-timeline>
    </div> -->
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { onBeforeMount, onMounted, ref } from "vue";
import { useInventarioStore } from "src/stores/inventario_store";
import { storeToRefs } from "pinia";

//-----------------------------------------------------------

const $q = useQuasar();
const inventarioStore = useInventarioStore();
const { list_Kardex, inventario } = storeToRefs(inventarioStore);
const inventario_Id = ref(null);
const opciones_Inventario = ref([]);
const simple = ref([
  {
    label: "EY-02-006 TABLON",
    icon: "inventory",
    children: [
      {
        label: "Good food  ",
        children: [{ label: "Quality ingredients" }, { label: "Good recipe" }],
      },
      {
        label: "Good service ",
        children: [
          { label: "Prompt attention" },
          { label: "Professional waiter" },
        ],
      },
      {
        label: "Pleasant surroundings  ",
        children: [
          { label: "Good table presentation" },
          { label: "Pleasing decor" },
        ],
      },
    ],
  },
]);
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
