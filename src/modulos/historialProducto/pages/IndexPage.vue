<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" to="/" />
            <q-breadcrumbs-el
              icon="inventory"
              label="Inventario"
              to="/inventario"
            />
            <q-breadcrumbs-el
              label="Historial inventario"
              icon="library_books"
            />
          </q-breadcrumbs>
        </div>
      </div>
    </div>
    <HistorialComp />
  </q-page>
</template>
<script setup>
import HistorialComp from "../components/HistorialComp.vue";
</script>
