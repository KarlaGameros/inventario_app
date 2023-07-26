<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">
          {{ !isEditar ? "Registrar movimiento" : "Editar movimiento" }}
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
                v-model="bodegaId"
                :options="listBodega"
                label="Bodega origen"
                hint="Selecciona bodega origen"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'La bodega origen es requerida']"
              >
              </q-select>
            </div>

            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-select
                v-model="bodegaId"
                :options="listBodega"
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
                hint="Selecciona un producto"
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

        <q-separator></q-separator>
        <q-card-section>
          <TablaMovimientoInventario />
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
import { useBodegaStore } from "src/stores/bodega_store";
import { useCatalogoProductoStore } from "src/stores/catalogos_producto_store";
import { useInventarioStore } from "src/stores/inventario_store";
import { onBeforeMount, ref, watch } from "vue";
import { useMovimientoInventario } from "../../../stores/movimiento_inventario";
import TablaMovimientoInventario from "../components/TablaMovimientoInventario.vue";
//-----------------------------------------------------------

const $q = useQuasar();
const movimientoInventarioStore = useMovimientoInventario();
const catalogoStore = useCatalogoProductoStore();
const bodegaStore = useBodegaStore();
const inventarioStore = useInventarioStore();

const { modal, listaMovimientoInventario } = storeToRefs(
  movimientoInventarioStore
);
const { listCatalogo } = storeToRefs(catalogoStore);
const { listBodega } = storeToRefs(bodegaStore);
const { listInventario } = storeToRefs(inventarioStore);
const catalogoId = ref(null);
const bodegaId = ref(null);
const inventarioId = ref(null);
const opcionesInventario = ref([...listInventario.value]);
//-----------------------------------------------------------
//Get fecha actual

const dateActual = new Date();
const year = dateActual.getFullYear();
const month = String(dateActual.getMonth() + 1).padStart(2, "0");
const day = String(dateActual.getDate()).padStart(2, "0");
const date = ref(`${year}/${month}/${day}`);

//-----------------------------------------------------------

onBeforeMount(() => {
  inventarioStore.loadListInventario(0);
  inventarioStore.loadInformacionInventarios();
  catalogoStore.loadCatalogoList(true);
  bodegaStore.loadBodegasList();
  catalogoId.value = { value: 0, label: "Todos" };
});

watch(catalogoId, (val) => {
  inventarioStore.loadListInventario(catalogoId.value.value);
});
//-----------------------------------------------------------

const actualizarModal = (valor) => {
  movimientoInventarioStore.actualizarModal(valor);
  movimientoInventarioStore.initMovimiento();
  catalogoId.value = { value: 0, label: "Todos" };
};

const limpiarRegistro = () => {
  inventarioId.value = null;
};
//-----------------------------------------------------------
const filterInventario = (val, update) => {
  if (val === "") {
    update(() => {
      opcionesInventario.value = listInventario.value;
    });
    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    opcionesInventario.value = listInventario.value.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
};

//-----------------------------------------------------------
const agregarProducto = async () => {
  if (listaMovimientoInventario.value.length == 0) {
    await movimientoInventarioStore.addMovimiento(inventarioId.value);
    limpiarRegistro();
  } else {
    let filtro = listaMovimientoInventario.value.find(
      (x) => x.inventario_Id == inventarioId.value.value
    );
    if (filtro == undefined) {
      await movimientoInventarioStore.addMovimiento(inventarioId.value);
      limpiarRegistro();
    } else {
      $q.dialog({
        title: "Atención",
        message: "El producto ya se agrego",
        icon: "Warning",
        persistent: true,
        transitionShow: "scale",
        transitionHide: "scale",
      });
    }
  }
};
</script>

<style></style>
