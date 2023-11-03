<template>
  <div class="q-pa-md">
    <div class="col">
      <table class="default">
        <tr>
          <th>No.</th>
          <th>Número de serie</th>
        </tr>
        <tr v-for="(list, index) in listaNumeroSerie_c" :key="list">
          <td>{{ list.id }}</td>

          <td>
            <q-input
              :name="`myText${index}`"
              v-model="list.numero_serie"
              @keydown.enter.prevent="getFocus(index)"
            />
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useInventarioStore } from "src/stores/inventario_store";

//-----------------------------------------------------------

const inventarioStore = useInventarioStore();
const { listaNumeroSerie_c } = storeToRefs(inventarioStore);

//-----------------------------------------------------------

function getFocus(index) {
  let docu = document.getElementsByName(`myText${index + 1}`);
  docu[0].focus();
}

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

<style scoped>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid #ccc;
  text-align: center;
  padding: 8px;
}
</style>
