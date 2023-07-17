<template>
  <div class="q-pa-md">
    <div class="col">
      <q-table
        bordered
        :rows="listaNumeroSerie"
        :columns="columns"
        :loading="loading"
        row-key="id"
        :visible-columns="visibleColumns"
      >
        <template v-slot:top="props">
          <q-space />
          <div class="col">
            <q-toggle
              v-model="visibleColumns"
              val="extencionA"
              label="Extención A"
            />
            <q-toggle
              v-model="visibleColumns"
              val="extencionB"
              label="Extención B"
            />
            <q-toggle
              v-model="visibleColumns"
              val="extencionC"
              label="Extención C"
            />
          </div>

          <q-btn
            flat
            round
            dense
            :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen"
            class="q-ml-md"
          />

          <!-- <q-tr :props="props">
            <q-td key="cantidad" :props="props"
              >{{ props.row }}
              <q-popup-edit
                v-model.number="props.row"
                title="Número de serie"
                v-slot="scope"
              >
                <q-input
                  type="number"
                  v-model.number="scope.value"
                  dense
                  autofocus
                  @keyup.enter="scope.set"
                />
              </q-popup-edit>
            </q-td>
            <q-td key="inventario_Id" :props="props">
              <q-btn
                flat
                round
                color="purple-ieen"
                icon="cancel"
                @click="eliminar()"
              >
                <q-tooltip>Eliminar inventario</q-tooltip>
              </q-btn>
            </q-td>
          </q-tr> -->
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useInventarioStore } from "src/stores/inventario_store";
import { ref, watch } from "vue";

//-----------------------------------------------------------

const inventarioStore = useInventarioStore();
const visibleColumns = ref([]);
const { listaNumeroSerie } = storeToRefs(inventarioStore);

//-----------------------------------------------------------

watch(visibleColumns, (val) => {
  console.log("vivisble columns", visibleColumns.value);
});

//-----------------------------------------------------------

const columns = [
  {
    name: "extencionA",
    align: "center",
    label: "Extencion A",
    field: "extencionA",
    sortable: true,
  },
  {
    name: "extencionB",
    align: "center",
    label: "Extencion B",
    field: "extencionB",
    sortable: true,
  },
  {
    name: "extencionC",
    align: "center",
    label: "Extencion C",
    field: "extencionC",
    sortable: true,
  },
];
</script>

<style></style>
