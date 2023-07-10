<template>
  <div class="row">
    <div class="col">
      <q-table
        :rows="listaSolicitud"
        :columns="columns"
        :filter="filter"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        hide-bottom
        :rows-per-page-options="[0]"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="nombre" :props="props"></q-td>
            <q-td>
              <q-popup-edit title="Número de serie" auto-save v-slot="scope">
                <q-input
                  type="number"
                  v-model.number="scope.value"
                  dense
                  use-input="false"
                  autofocus
                  min="1"
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
                <q-toolbar>Eliminar inventario</q-toolbar>
              </q-btn>
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

const inventarioStore = useInventarioStore();
const { cantidad } = storeToRefs(inventarioStore);

const columns = [
  {
    name: "nombre",
    align: "center",
    label: "Nombre del producto",
    field: "nombre",
    sortable: true,
  },
  {
    name: "serie",
    align: "center",
    label: "Número de serie",
    field: "serie",
    sortable: true,
  },
  {
    name: "inventario_Id",
    align: "center",
    label: "Opciones",
    field: "inventario_Id",
    sortable: false,
  },
];
</script>

<style></style>
