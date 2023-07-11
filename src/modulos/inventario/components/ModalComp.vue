<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Registro de inventario</div>
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
        <q-form class="row q-col-gutter-xs">
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-radio
              v-model="radio"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              val="agranel"
              label="Agranel"
            />
            <q-radio
              v-model="radio"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              val="paquete"
              label="Paquete"
            />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-select
              v-model.trim="catalogoId"
              :options="listCatalogo"
              label="Catálogo perteneciente del inventario"
              hint="Selecciona una catalogo"
              lazy-rules
              :rules="[(val) => !!val || 'El catálogo es requerido']"
            >
            </q-select>
          </div>

          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-select
              v-model.trim="bodegaId"
              :options="listBodega"
              label="Bodega de resguardo"
              hint="Selecciona una bodega"
              lazy-rules
              :rules="[(val) => !!val || 'La bodega es requerida']"
            >
            </q-select>
          </div>

          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              label="Clave del producto"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'La clave es requerido']"
            >
            </q-input>
          </div>

          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input label="Nombre corto"> </q-input>
          </div>

          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input label="Descripción del producto" autogrow> </q-input>
          </div>

          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-select
              v-model.trim="marcaId"
              :options="listMarca"
              label="Marca"
              hint="Selecciona una marca"
              lazy-rules
              :rules="[(val) => !!val || 'La marca es requerida']"
            >
            </q-select>
          </div>

          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-select
              v-model.trim="modeloId"
              :options="listModelo"
              label="Modelo"
              hint="Selecciona modelo"
              lazy-rules
              :rules="[(val) => !!val || 'El modelo es requerida']"
            >
            </q-select>
          </div>

          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input label="Color"> </q-input>
          </div>

          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input v-model.trim="cantidad" label="Cantidad" type="number">
            </q-input>
          </div>

          <q-space />
          <div class="col-12 justify-end" v-if="radio == 'paquete'">
            <div class="text-right q-gutter-xs">
              <q-btn
                icon-right="add"
                label="Agregar"
                color="positive"
                class="q-ml-sm"
                @click="agregarProducto(cantidad, catalogoId)"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>

      <q-card-section v-if="radio != 'agranel'">
        <TablaNumeroSerie />
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
              @click="solicitar()"
              color="positive"
              class="q-ml-sm"
              :disable="habilitarGuardar"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { computed, onBeforeMount, ref, watch } from "vue";
import { useAuthStore } from "../../../stores/auth_store";
import { useInventarioStore } from "../../../stores/inventario_store";
import { useCatalogoProductoStore } from "src/stores/catalogos_producto_store";
import { useBodegaStore } from "src/stores/bodega_store";
import { useMarcaStore } from "src/stores/marcas_store";
import { useModeloStore } from "src/stores/modelo_store";
import TablaNumeroSerie from "../components/TablaNumeroSerie.vue";
import { parseQuery } from "vue-router";

//-----------------------------------------------------------

const $q = useQuasar();
const authStore = useAuthStore();
const inventarioStore = useInventarioStore();
const catalogoStore = useCatalogoProductoStore();
const bodegaStore = useBodegaStore();
const marcaStore = useMarcaStore();
const modeloStore = useModeloStore();

//-----------------------------------------------------------

const { modulo } = storeToRefs(authStore);
const { inventario, modal } = storeToRefs(inventarioStore);
const { listCatalogo } = storeToRefs(catalogoStore);
const { listBodega } = storeToRefs(bodegaStore);
const { listMarca } = storeToRefs(marcaStore);
const { listModelo } = storeToRefs(modeloStore);
const { isTabla, listaNumeroSerie } = storeToRefs(inventarioStore);

const catalogoId = ref(null);
const bodegaId = ref(null);
const marcaId = ref(null);
const modeloId = ref(null);
const cantidad = ref(null);
const NumeroSerie = ref(null);
const idInventaro = ref(null);
let habilitarGuardar = ref(true);
const radio = ref("agranel");
const extencion = ref([]);
//-----------------------------------------------------------

onBeforeMount(() => {
  bodegaStore.loadBodegasList();
  catalogoStore.loadCatalogoList();
  marcaStore.loadMarcaList();
});

//-----------------------------------------------------------

watch(marcaId, (val) => {
  if (val != null) {
    modeloStore.modeloByMarca(marcaId.value.value).then(() => {
      modeloId.value = listModelo.value[0];
    });
  }
});

//-----------------------------------------------------------

const agregarProducto = (cantidad, catalogoId) => {
  console.log("cantidad", cantidad, catalogoId);
  inventarioStore.addCantidad(cantidad, catalogoId);
};

const actualizarModal = (valor) => {
  inventarioStore.actualizarModal(valor);
  radio.value = "agranel";
};
</script>

<style></style>
