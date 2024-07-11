<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h5 text-purple-ieen text-bold absolute-center">
          {{ !isEditar ? "Registrar marca" : "Editar marca" }}
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
              filled
              v-model.trim="marca.clave"
              label="Nombre de la marca"
              hint="Ingrese nombre de la marca"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'El nombre de la marca es requerido']"
            >
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              color="purple-ieen"
              filled
              v-model.trim="marca.descripcion"
              label="Descripción de la marca"
              hint="Ingrese una descripción"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'La descripción es requerido']"
            >
            </q-input>
          </div>
          <div class="col-12 justify-end">
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
import { useQuasar } from "quasar";
import { storeToRefs } from "pinia";
import { useMarcaStore } from "src/stores/marcas_store";

//-----------------------------------------------------------

const $q = useQuasar();
const marcaStore = useMarcaStore();
const { marca, modal, isEditar } = storeToRefs(marcaStore);

//-----------------------------------------------------------

const actualizarModal = (valor) => {
  marcaStore.actualizarModal(valor);
  marcaStore.updateEditar(valor);
  marcaStore.initMarca();
};

const onSubmit = async () => {
  let resp = null;
  $q.loading.show();
  if (isEditar.value == true) {
    resp = await marcaStore.updateMarca(marca.value);
  } else {
    resp = await marcaStore.createMarca(marca.value);
  }
  if (resp.success) {
    $q.notify({
      position: "top-right",
      type: "positive",
      message: resp.data,
    });
    marcaStore.loadInformacionMarca();
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
