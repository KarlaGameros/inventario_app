<template>
  <q-dialog
    v-model="modalFotos"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Fotografía</div>
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
      <q-form @submit="onSubmit" ref="RegistroMovimiento">
        <q-card-section>
          <div class="row">
            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-select
                v-model="detalle_Id"
                :options="list_Detalle"
                label="Detalle del movimiento"
                hint="Seleccione un detalle del movimiento"
                :lazy-rules="true"
                :rules="[
                  (val) => !!val || 'Seleccione un detalle del movimiento',
                ]"
              >
              </q-select>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row q-col-gutter-xs">
            <q-card class="col-lg-3 col-md-3 col-sm-3 col-xs-12 q-pa-xs">
              <q-file
                accept="image/png, image/jpeg"
                color="purple-12"
                v-model="foto_1"
                label="Foto 1"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
              <img :src="detalle_Movimiento.foto_1_URL" />
            </q-card>
            <q-card class="col-lg-3 col-md-3 col-sm-3 col-xs-12 q-pa-xs">
              <q-file
                accept="image/png, image/jpeg"
                color="purple-12"
                v-model="foto_2"
                label="Foto 1"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
              <img :src="detalle_Movimiento.foto_2_URL" />
            </q-card>
            <q-card class="col-lg-3 col-md-3 col-sm-3 col-xs-12 q-pa-xs">
              <q-file
                accept="image/png, image/jpeg"
                color="purple-12"
                v-model="foto_3"
                label="Foto 1"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
              <img :src="detalle_Movimiento.foto_3_URL" />
            </q-card>
            <q-card class="col-lg-3 col-md-3 col-sm-3 col-xs-12 q-pa-xs">
              <q-file
                accept="image/png, image/jpeg"
                color="purple-12"
                v-model="foto_4"
                label="Foto 1"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
              <img :src="detalle_Movimiento.foto_4_URL" />
            </q-card>
            <q-space />
          </div>
        </q-card-section>
        <q-card-section>
          <q-space />
          <div class="col-12 justify-end">
            <div class="text-right q-gutter-xs">
              <q-btn
                label="Cancelar"
                type="reset"
                color="negative"
                @click="actualizarModal(false)"
              />
              <q-btn
                label="Guardar"
                type="submit"
                color="positive"
                class="q-ml-sm"
              />
            </div>
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { ref, watch } from "vue";
import { useMovimientoInventario } from "../../../stores/movimiento_inventario";

//-----------------------------------------------------------

const $q = useQuasar();
const movimientoInventarioStore = useMovimientoInventario();

const { modalFotos, list_Detalle, detalle_Movimiento } = storeToRefs(
  movimientoInventarioStore
);
const foto_1 = ref(null);
const foto_2 = ref(null);
const foto_3 = ref(null);
const foto_4 = ref(null);
const detalle_Id = ref(null);

//-----------------------------------------------------------

watch(detalle_Id, async (val) => {
  if (val != null) {
    await movimientoInventarioStore.loadDetalleMovimientoById(val.value);
  }
});

const actualizarModal = (valor) => {
  movimientoInventarioStore.actualizarModalFotos(valor);
  movimientoInventarioStore.initDetalleMovimiento();
  foto_1.value = false;
  foto_2.value = false;
  foto_3.value = false;
  foto_4.value = false;
  detalle_Id.value = null;
};

const onSubmit = async () => {
  $q.loading.show();
  let fotografiasFormData = new FormData();
  let resp = null;
  fotografiasFormData.append("Foto_1", foto_1.value);
  fotografiasFormData.append("Foto_2", foto_2.value);
  fotografiasFormData.append("Foto_3", foto_3.value);
  fotografiasFormData.append("Foto_4", foto_4.value);

  resp = await movimientoInventarioStore.agregarFotografias(
    detalle_Id.value.value,
    fotografiasFormData
  );
  if (resp.success) {
    $q.notify({
      position: "top-right",
      type: "positive",
      message: resp.data,
    });
    //actualizarModal(false);
    movimientoInventarioStore.loadDetalleMovimientoById(
      detalle_Movimiento.value.id
    );
    foto_1.value = false;
    foto_2.value = false;
    foto_3.value = false;
    foto_4.value = false;
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

<style></style>
