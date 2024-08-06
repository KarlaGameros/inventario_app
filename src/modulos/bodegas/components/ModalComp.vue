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
          {{ !isEditar ? "REGISTRAR BODEGA" : "EDITAR BODEGA" }}
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
              v-model.trim="bodega.nombre"
              label="Nombre de bodega"
              hint="Ingrese un nombre"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'El nombre es requerido']"
            >
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-select
              color="purple-ieen"
              v-model.trim="area_Id"
              :options="areas"
              label="Área responsable de bodega"
              hint="Seleccione un área"
              lazy-rules
              :rules="[(val) => !!val || 'El area es requerida']"
            >
            </q-select>
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
import { onBeforeMount, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useBodegaStore } from "../../../stores/bodega_store";

//-----------------------------------------------------------

const $q = useQuasar();
const bodegaStore = useBodegaStore();
const { bodega, modal, areas, isEditar } = storeToRefs(bodegaStore);
const area_Id = ref(null);

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------

watch(bodega.value, (val) => {
  if (val.id != null) {
    cargarArea(val);
  }
});

//-----------------------------------------------------------

const cargarData = async () => {
  $q.loading.show();
  await bodegaStore.loadAreasList();
  $q.loading.hide();
};

const actualizarModal = (valor) => {
  bodegaStore.actualizarModal(valor);
  bodegaStore.updateEditar(valor);
  bodegaStore.initBodega();
  area_Id.value = null;
};

const cargarArea = async (val) => {
  if (area_Id.value == null) {
    let areaFiltrado = areas.value.find((x) => x.value == `${val.area_Id}`);
    area_Id.value = areaFiltrado;
  }
};

const onSubmit = async () => {
  let resp = null;
  $q.loading.show();
  bodega.value.area_Id = area_Id.value.value;
  bodega.value.eliminado = false;
  if (isEditar.value == true) {
    resp = await bodegaStore.updateBodega(bodega.value);
  } else {
    resp = await bodegaStore.createBodega(bodega.value);
  }

  if (resp.success) {
    $q.notify({
      position: "top-right",
      type: "positive",
      message: resp.data,
    });
    bodegaStore.loadInformacionBodega();
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
