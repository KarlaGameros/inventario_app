<template>
  <div class="q-pa-md">
    <div class="col">
      <q-table :rows="listaNumeroSerie_a" :columns="columns" row-key="name">
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="id" :props="props">
              {{ props.row.id }}
            </q-td>
            <q-td key="numero_serie" :props="props" @click="presionar()">
              {{ props.row.numero_serie }}

              <q-popup-edit
                v-model.number="props.row.numero_serie"
                buttons
                persistent
                auto-save
                v-slot="scope"
                ref="poputEdit"
              >
                <q-input
                  v-model.number="scope.value"
                  dense
                  @keydown.enter="handleEnterKey(props, scope)"
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
import { ref } from "vue";

//-----------------------------------------------------------

const inventarioStore = useInventarioStore();
const { listaNumeroSerie_a } = storeToRefs(inventarioStore);
const poputEdit = ref(null);
//-----------------------------------------------------------

const handleEnterKey = (props, scope) => {
  console.log("scope", scope);
  const nextRow = listaNumeroSerie_a.value[props.rowIndex + 1];

  if (nextRow != undefined) {
    scope.set();
    scope.cancel();
    scope.updatePosition();
    //poputEdit.value.show();
    presionar();
  }
};

const presionar = () => {
  console.log("click");
};

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
