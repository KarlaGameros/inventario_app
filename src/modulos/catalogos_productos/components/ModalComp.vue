<template>
  <q-dialog
    v-model="modal"
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
          {{ !isEditar ? "REGISTRAR CATÁLOGO" : "EDITAR CATÁLOGO" }}
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
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              color="purple-ieen"
              v-model.trim="catalogo.clave"
              label="Clave del catálogo"
              hint="Ingrese una clave"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'La clave es requerida']"
            >
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              color="purple-ieen"
              v-model.trim="catalogo.nombre"
              label="Nombre del catálogo"
              hint="Ingrese un nombre"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'El nombre es requerido']"
            >
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              color="purple-ieen"
              v-model.trim="catalogo.nombre_Corto"
              label="Nombre corto del catálogo"
              hint="Ingrese un nombre corto"
              autogrow
            >
            </q-input>
          </div>
          <q-space />
          <div class="col-12 justify-end q-pt-lg">
            <div class="text-right q-gutter-xs">
              <q-btn
                label="Cancelar"
                type="reset"
                color="red"
                icon-right="close"
                @click="actualizarModal(false)"
              />
              <q-btn
                icon-right="save"
                label="Guardar"
                type="submit"
                color="secondary"
                class="q-ml-sm"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useCatalogoProductoStore } from "../../../stores/catalogos_producto_store";

//-----------------------------------------------------------

const $q = useQuasar();
const catalagoStore = useCatalogoProductoStore();
const { catalogo, modal, isEditar } = storeToRefs(catalagoStore);

//-----------------------------------------------------------

const actualizarModal = (valor) => {
  catalagoStore.actualizarModal(valor);
  catalagoStore.updateEditar(valor);
  catalagoStore.initCatalago();
};

const onSubmit = async () => {
  let resp = null;
  $q.loading.show();
  if (isEditar.value == true) {
    resp = await catalagoStore.updateCatalogo(catalogo.value);
  } else {
    resp = await catalagoStore.createCatalogo(catalogo.value);
  }
  if (resp.success) {
    $q.notify({
      position: "top-right",
      type: "positive",
      message: resp.data,
    });
    catalagoStore.loadInformacionCatalago();
    actualizarModal(false);
  } else {
    $q.notify({
      position: "top-right",
      type: "negative",
      message: resp.data,
    });
  }
  $q.loading.hide();
};
</script>
