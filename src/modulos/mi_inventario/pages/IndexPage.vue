<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" to="/" />
            <q-breadcrumbs-el label="Mi inventario" icon="library_books" />
          </q-breadcrumbs>
        </div>
      </div>
    </div>
    <TablaComp />
  </q-page>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { onBeforeMount } from "vue";
import { useAuthStore } from "../../../stores/auth_store";
import TablaComp from "../components/TablaComp.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const siglas = "SI-MI-INV";

//-----------------------------------------------------------

onBeforeMount(() => {
  leerPermisos();
});

//-----------------------------------------------------------

const leerPermisos = async () => {
  $q.loading.show();
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};
</script>

<style></style>
