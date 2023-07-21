<template>
  <div class="q-pa-md">
    <div class="col">
      <q-table
        :rows="listaNumeroSerie_a"
        :columns="columns"
        row-key="name"
        :rows-per-page-options="[]"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="id" :props="props">
              {{ props.row.id }}
            </q-td>
            <q-td key="numero_serie" :props="props">
              {{ props.row.numero_serie }}
              <q-popup-edit
                v-model.number="props.row.numero_serie"
                buttons
                persistent
                auto-save
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
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useInventarioStore } from "src/stores/inventario_store";

//-----------------------------------------------------------

const inventarioStore = useInventarioStore();
const { listaNumeroSerie_a } = storeToRefs(inventarioStore);

//-----------------------------------------------------------

const columns = [
  {
    name: "id",
    align: "center",
    label: "No.",
    field: "id",
    sortable: true,
  },
  {
    name: "numero_serie",
    align: "center",
    label: "Números de serie",
    field: "numero_serie",
    sortable: true,
  },
];
</script>

<style></style>
