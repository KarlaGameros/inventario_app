<template>
  <br />
  <q-btn
    @click="regresar"
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
              <b v-if="movimiento.empleado != null && movimiento.empleado != ''"
                >Personal: {{ movimiento.empleado }}
              </b>
              <br />
              <b
                v-if="
                  movimiento.destino == 'Bodega' &&
                  movimiento.bodega_Destino != null
                "
                >Bodega destino: {{ movimiento.bodega_Destino }}
              </b>
              <br />
            </div>
          </q-card-section>
        </q-card>
        <div class="q-ml-md" v-if="index + 1 != list_Kardex.length">
          <q-img src="~assets/arrow-right.png" style="width: 50px" />
        </div>
        <div class="q-ml-md" v-else style="width: 50px"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useInventarioStore } from "src/stores/inventario_store";
import { storeToRefs } from "pinia";

//-----------------------------------------------------------

const router = useRouter();
const inventarioStore = useInventarioStore();
const { list_Kardex, inventario } = storeToRefs(inventarioStore);

const regresar = () => {
  inventarioStore.initInventario();
  router.push({
    name: "inventario",
  });
};
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
