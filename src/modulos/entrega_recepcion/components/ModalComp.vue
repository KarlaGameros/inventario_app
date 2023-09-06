<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Entrega a recepcion</div>
        <q-space />
        <q-btn
          icon="close"
          @click="actualizarModal(false)"
          flat
          round
          dense
          v-close-popup
        ></q-btn>
      </q-card-section>
      <q-card-section>
        <q-form class="row q-col-gutter-xs" @submit="onSubmit">
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-select
              label="Área"
              v-model="area_Id"
              :options="areas"
              hint="Selecciona una área"
              :lazy-rules="true"
              :rules="[(val) => !!val || 'El área es requerida']"
            >
            </q-select>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-select
              label="Empleado"
              v-model="empleado_Id"
              :options="listEmpleados"
              hint="Selecciona una empleado"
              :lazy-rules="true"
              :rules="[(val) => !!val || 'El empleado es requerido']"
            >
            </q-select>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <q-input v-model="date" label="Fecha de entrega a recepción">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="date" color="purple-3">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Cerrar"
                          color="purple-3"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </q-form>
      </q-card-section>
      <q-card-section>
        <TablaInventarios />
      </q-card-section>
      <q-card-section>
        <q-space />
        <div class="row">
          <div class="col-8 text-subtitle2 text-right">
            Si el inventario corresponde da click en Guardar
          </div>
          <div class="col-4 text-right q-gutter-xs">
            <q-btn
              label="Cancelar"
              type="reset"
              color="negative"
              @click="actualizarModal(false)"
            />
            <q-btn
              v-if="!isEditar"
              :disable="habilitarButton"
              label="Guardar"
              type="submit"
              color="positive"
              class="q-ml-sm"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useEntregaRecepcionStore } from "src/stores/entrega-recepcion-store";
import { onBeforeMount, ref, watch } from "vue";
import TablaInventarios from "../components/TablaInventarioComp.vue";
//-----------------------------------------------------------

const entregaRecepcionStore = useEntregaRecepcionStore();
const { modal, areas, listEmpleados } = storeToRefs(entregaRecepcionStore);
const dateActual = new Date();
const year = dateActual.getFullYear();
const month = String(dateActual.getMonth() + 1).padStart(2, "0");
const day = String(dateActual.getDate()).padStart(2, "0");
const date = ref(`${year}/${month}/${day}`);
const area_Id = ref(null);
const empleado_Id = ref(null);

//-----------------------------------------------------------

onBeforeMount(() => {
  getDateActual();
  entregaRecepcionStore.loadAreasList();
});

//-----------------------------------------------------------

watch(area_Id, (val) => {
  if (val != null) {
    entregaRecepcionStore.loadEmpleadosByArea(area_Id.value.value);
  }
});

//-----------------------------------------------------------

const actualizarModal = (valor) => {
  entregaRecepcionStore.actualizarModal(valor);
  getDateActual();
};

const getDateActual = async () => {
  const dateActual = new Date();
  const year = dateActual.getFullYear();
  const month = String(dateActual.getMonth() + 1).padStart(2, "0");
  const day = String(dateActual.getDate()).padStart(2, "0");
  date.value = ref(`${year}/${month}/${day}`);
};
</script>

<style></style>
