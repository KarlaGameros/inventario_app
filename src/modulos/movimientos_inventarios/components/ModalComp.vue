<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Registro de asignaciones</div>
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
      <q-form @submit="onSubmit">
        <q-card-section>
          <div class="row q-col-gutter-xs">
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-select
                label="Tipo de movimiento"
                hint="Selecciona un tipo de movimiento"
                :lazy-rules="true"
                :rules="[
                  (val) => !!val || 'El tipo de movimiento es requerido',
                ]"
              >
              </q-select>
            </div>

            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-input v-model="date" label="Fecha de asignación">
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

            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-select
                label="Bodega origen"
                hint="Selecciona bodega origen"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'La bodega origen es requerida']"
              >
              </q-select>
            </div>

            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-select
                label="Bodega destino"
                hint="Selecciona bodega destino"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'La bodega destino es requerida']"
              >
              </q-select>
            </div>

            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-select
                v-model="catalogoId"
                :options="listCatalogo"
                label="Catálogo perteneciente del inventario"
                hint="Selecciona una catalogo"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'El catálogo es requerido']"
              >
              </q-select>
            </div>

            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-select
                v-model="inventarioId"
                :options="opcionesInventario"
                use-input
                @filter="filterInventario"
                label="Productos"
                hint="Selecciona un consumible"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'El inventario es requerido']"
              >
              </q-select>
            </div>
            <q-space />
            <div class="col-12 justify-end">
              <div class="text-right q-gutter-xs">
                <q-btn
                  icon-right="add"
                  label="Agregar"
                  color="positive"
                  class="q-ml-sm"
                  @click="agregarProducto()"
                />
              </div>
            </div>
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
import { useCatalogoProductoStore } from "src/stores/catalogos_producto_store";
import { onBeforeMount, ref } from "vue";
import { useMovimientoInventario } from "../../../stores/movimiento_inventario";

//-----------------------------------------------------------

const $q = useQuasar();
const movimientoInventarioStore = useMovimientoInventario();
const catalogoStore = useCatalogoProductoStore();

const { modal } = storeToRefs(movimientoInventarioStore);
const { listCatalogo } = storeToRefs(catalogoStore);

const catalogoId = ref(null);

//-----------------------------------------------------------
//Get fecha actual

const dateActual = new Date();
const year = dateActual.getFullYear();
const month = String(dateActual.getMonth() + 1).padStart(2, "0");
const day = String(dateActual.getDate()).padStart(2, "0");
const date = ref(`${year}/${month}/${day}`);

//-----------------------------------------------------------

onBeforeMount(() => {
  catalogoStore.loadCatalogoList(true);
});

//-----------------------------------------------------------

const actualizarModal = (valor) => {
  asignacionStore.actualizarModal(valor);
};
</script>

<style></style>
