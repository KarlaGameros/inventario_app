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
        <q-form @submit="onSubmit" class="row q-col-gutter-xs">
          <!----------------------------------------------------------------------------->

          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-radio
              v-model="radio"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              val="individual"
              label="Individual"
            />
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

          <!----------------------------------------------------------------------------->

          <div
            v-if="radio == 'paquete'"
            class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
          >
            <div class="q-gutter-sm">
              <q-checkbox
                v-model="selection"
                val="extencionA"
                label="Extención A"
                color="teal"
              />
              <q-checkbox
                v-model="selection"
                val="Extención B"
                label="Orange"
                color="orange"
              />
              <q-checkbox
                v-model="selection"
                val="Extención C"
                label="Cyan"
                color="cyan"
              />
            </div>
          </div>

          <!----------------------------------------------------------------------------->

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

          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb-5">
            <q-select
              v-model="bodegaId"
              :options="listBodega"
              label="Bodega de resguardo"
              hint="Selecciona una bodega"
              lazy-rules
              :rules="[(val) => !!val || 'La bodega es requerida']"
            >
            </q-select>
          </div>

          <div
            v-if="radio == 'agranel'"
            class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
          >
            <q-input
              disable
              label="Clave del producto"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'La clave es requerido']"
            >
            </q-input>
          </div>

          <div
            v-if="radio != 'paquete'"
            class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
          >
            <q-input
              v-model.trim="inventario.descripcion"
              label="Descripción del producto"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'La descripción es requerida']"
            >
            </q-input>
          </div>

          <div
            v-if="radio != 'paquete'"
            class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
          >
            <q-input
              v-model.trim="inventario.nombre_corto"
              label="Nombre corto"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'La nombre corto es requerido']"
            >
            </q-input>
          </div>

          <div
            v-if="radio != 'paquete'"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-select
              v-model="marcaId"
              :options="listMarca"
              label="Marca"
              hint="Selecciona una marca"
              lazy-rules
              :rules="[(val) => !!val || 'La marca es requerida']"
            >
            </q-select>
          </div>

          <div
            v-if="radio != 'paquete'"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-select
              v-model="modeloId"
              :options="listModelo"
              label="Modelo"
              hint="Selecciona modelo"
              lazy-rules
              :rules="[(val) => !!val || 'El modelo es requerida']"
            >
            </q-select>
          </div>

          <div
            v-if="radio != 'paquete'"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input
              v-model.trim="inventario.color"
              label="Color"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'El color es requerido']"
            >
            </q-input>
          </div>

          <div
            v-if="radio == 'agranel'"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input
              v-model.trim="cantidad"
              label="Cantidad"
              type="number"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'La cantidad es requerida']"
            >
            </q-input>
          </div>

          <div
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
            v-if="radio != 'paquete'"
          >
            <q-file filled bottom-slots v-model="files" label="Label" counter>
              <template v-slot:prepend>
                <q-icon name="cloud_upload" @click.stop.prevent />
              </template>
              <template v-slot:append>
                <q-icon
                  name="close"
                  v-model="inventario.img"
                  @click.stop.prevent="files = null"
                  class="cursor-pointer"
                />
              </template>

              <template v-slot:hint> Field hint </template>
            </q-file>
          </div>

          <q-space />

          <!----------------------------------------------------------------------------->

          <div
            v-if="radio == 'paquete'"
            class="q-gutter-y-md col-lg-12 col-md-12 col-sm-12 col-xs-12"
          >
            <q-card :selection="selection">
              <q-tabs
                class="bg-purple text-white shadow-2 rounded-borders"
                align="justify"
                narrow-indicator
                :columns="columns"
                :selection="selection"
              >
                <q-tab name="general" label="General" />
                <q-tab name="extencionA" label="Extención A" />
                <!-- <q-tab name="extencionB" label="Extención B" />
                <q-tab name="extencionC" label="Extención C" /> -->
              </q-tabs>

              <q-separator />

              <q-tab-panels animated>
                <q-tab-panel name="general">
                  <div class="text-h6">General</div>

                  <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <q-input
                      disable
                      v-model.trim="inventario.clave"
                      label="Clave del producto"
                      autogrow
                      lazy-rules
                      :rules="[(val) => !!val || 'La clave es requerido']"
                    >
                    </q-input>
                  </div>

                  <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <q-input
                      v-model.trim="inventario.descripcion"
                      label="Descripción del producto"
                      autogrow
                      lazy-rules
                      :rules="[(val) => !!val || 'La descripción es requerida']"
                    >
                    </q-input>
                  </div>

                  <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <q-input
                      v-model.trim="inventario.nombre_corto"
                      label="Nombre corto"
                      autogrow
                      lazy-rules
                      :rules="[
                        (val) => !!val || 'La nombre corto es requerido',
                      ]"
                    >
                    </q-input>
                  </div>

                  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <q-select
                      v-model="marcaId"
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
                      v-model="modeloId"
                      :options="listModelo"
                      label="Modelo"
                      hint="Selecciona modelo"
                      lazy-rules
                      :rules="[(val) => !!val || 'El modelo es requerida']"
                    >
                    </q-select>
                  </div>

                  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <q-input
                      v-model.trim="inventario.color"
                      label="Color"
                      autogrow
                      lazy-rules
                      :rules="[(val) => !!val || 'El color es requerido']"
                    >
                    </q-input>
                  </div>

                  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <q-input
                      v-model.trim="cantidad"
                      label="Cantidad"
                      type="number"
                      autogrow
                      lazy-rules
                      :rules="[(val) => !!val || 'La cantidad es requerida']"
                    >
                    </q-input>
                  </div>
                </q-tab-panel>

                <!----------------------------------------------------------------------------->

                <q-tab-panel
                  v-model="selection"
                  val="extencionA"
                  name="extencionA"
                >
                  <div class="text-h6">Extención A</div>
                  <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <q-input
                      v-model.trim="
                        inventario.extencionA.descripcion_extencion_a
                      "
                      label="Descripción del producto"
                      autogrow
                      lazy-rules
                      :rules="[(val) => !!val || 'La descripción es requerida']"
                    >
                    </q-input>
                  </div>

                  <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <q-input
                      v-model.trim="
                        inventario.extencionA.nombre_corto_extencion_a
                      "
                      label="Nombre corto"
                      autogrow
                      lazy-rules
                      :rules="[
                        (val) => !!val || 'La nombre corto es requerido',
                      ]"
                    >
                    </q-input>
                  </div>

                  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <q-select
                      v-model="marcaId_A"
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
                      v-model="modeloId_A"
                      :options="listModelo"
                      label="Modelo"
                      hint="Selecciona modelo"
                      lazy-rules
                      :rules="[(val) => !!val || 'El modelo es requerida']"
                    >
                    </q-select>
                  </div>

                  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <q-input
                      v-model.trim="inventario.extencionA.color_extencion_a"
                      label="Color"
                      autogrow
                      lazy-rules
                      :rules="[(val) => !!val || 'El color es requerido']"
                    >
                    </q-input>
                  </div>
                </q-tab-panel>

                <!----------------------------------------------------------------------------->

                <q-tab-panel name="extencionB">
                  <div class="text-h6">Extención B</div>
                  <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <q-input
                      v-model.trim="
                        inventario.extencionB.descripcion_extencion_b
                      "
                      label="Descripción del producto"
                      autogrow
                      lazy-rules
                      :rules="[(val) => !!val || 'La descripción es requerida']"
                    >
                    </q-input>
                  </div>

                  <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <q-input
                      v-model.trim="
                        inventario.extencionB.nombre_corto_extencion_b
                      "
                      label="Nombre corto"
                      autogrow
                      lazy-rules
                      :rules="[
                        (val) => !!val || 'La nombre corto es requerido',
                      ]"
                    >
                    </q-input>
                  </div>

                  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <q-select
                      v-model="marcaId_B"
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
                      v-model="modeloId_B"
                      :options="listModelo"
                      label="Modelo"
                      hint="Selecciona modelo"
                      lazy-rules
                      :rules="[(val) => !!val || 'El modelo es requerida']"
                    >
                    </q-select>
                  </div>

                  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <q-input
                      v-model.trim="inventario.extencionB.color_extencion_b"
                      label="Color"
                      autogrow
                      lazy-rules
                      :rules="[(val) => !!val || 'El color es requerido']"
                    >
                    </q-input>
                  </div>
                </q-tab-panel>

                <!----------------------------------------------------------------------------->

                <q-tab-panel name="extencionC">
                  <div class="text-h6">Extención C</div>
                  <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <q-input
                      v-model.trim="
                        inventario.extencionC.descripcion_extencion_c
                      "
                      label="Descripción del producto"
                      autogrow
                      lazy-rules
                      :rules="[(val) => !!val || 'La descripción es requerida']"
                    >
                    </q-input>
                  </div>

                  <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <q-input
                      v-model.trim="
                        inventario.extencionC.nombre_corto_extencion_c
                      "
                      label="Nombre corto"
                      autogrow
                      lazy-rules
                      :rules="[
                        (val) => !!val || 'La nombre corto es requerido',
                      ]"
                    >
                    </q-input>
                  </div>

                  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <q-select
                      v-model="marcaId_C"
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
                      v-model="modeloId_C"
                      :options="listModelo"
                      label="Modelo"
                      hint="Selecciona modelo"
                      lazy-rules
                      :rules="[(val) => !!val || 'El modelo es requerida']"
                    >
                    </q-select>
                  </div>

                  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <q-input
                      v-model.trim="inventario.extencionC.color_extencion_c"
                      label="Color"
                      autogrow
                      lazy-rules
                      :rules="[(val) => !!val || 'El color es requerido']"
                    >
                    </q-input>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </q-card>
          </div>

          <q-space />

          <!----------------------------------------------------------------------------->

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

          <!----------------------------------------------------------------------------->

          <q-card-section class="col-12" v-if="radio == 'paquete'">
            <TablaNumeroSerie />
          </q-card-section>

          <!----------------------------------------------------------------------------->

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

          <!----------------------------------------------------------------------------->
        </q-form>
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

//-----------------------------------------------------------

const $q = useQuasar();
const authStore = useAuthStore();
const inventarioStore = useInventarioStore();
const catalogoStore = useCatalogoProductoStore();
const bodegaStore = useBodegaStore();
const marcaStore = useMarcaStore();
const modeloStore = useModeloStore();
const files = ref(null);

//-----------------------------------------------------------

const { modulo } = storeToRefs(authStore);
const { inventario, modal, isEditar } = storeToRefs(inventarioStore);
const { listCatalogo } = storeToRefs(catalogoStore);
const { listBodega } = storeToRefs(bodegaStore);
const { listMarca } = storeToRefs(marcaStore);
const { listModelo } = storeToRefs(modeloStore);

const catalogoId = ref(null);
const bodegaId = ref(null);
const marcaId = ref(null);
const marcaId_A = ref(null);
const marcaId_B = ref(null);
const marcaId_C = ref(null);
const modeloId = ref(null);
const modeloId_A = ref(null);
const modeloId_B = ref(null);
const modeloId_C = ref(null);
const cantidad = ref(null);
const NumeroSerie = ref(null);
const idInventaro = ref(null);
const radio = ref("individual");
const selection = ref([]);

//-----------------------------------------------------------
const columns = [
  {
    name: "extencionA",
    align: "center",
    label: "Extencion A",
    field: "extencionA",
    sortable: true,
  },
  {
    name: "extencionB",
    align: "center",
    label: "Extencion B",
    field: "extencionB",
    sortable: true,
  },
  {
    name: "extencionC",
    align: "center",
    label: "Extencion C",
    field: "extencionC",
    sortable: true,
  },
];
//-----------------------------------------------------------

onBeforeMount(() => {
  bodegaStore.loadBodegasList();
  catalogoStore.loadCatalogoList();
  marcaStore.loadMarcaList();
});

//-----------------------------------------------------------

watch(marcaId, (val) => {
  console.log(marcaId.value);
  if (val != null) {
    modeloStore.modeloByMarca(marcaId.value.value).then(() => {
      modeloId.value = listModelo.value[0];
    });
  }
});
watch(modeloId, (val) => {
  console.log(modeloId.value);
});

//-----------------------------------------------------------

const agregarProducto = (cantidad, catalogoId) => {
  console.log("cantidad", cantidad, catalogoId);
  inventarioStore.addCantidad(cantidad, catalogoId);
};

const actualizarModal = (valor) => {
  inventarioStore.actualizarModal(valor);
  inventarioStore.initInventario();
  radio.value = "agranel";
};

//-----------------------------------------------------------

const onSubmit = async () => {
  // inventario.value.catalogo_id = catalogoId.value.value;
  // inventario.value.bodega_id = bodegaId.value.value;
  // inventario.value.marca_id = marcaId.value.value;
  // inventario.value.modelo_id = modeloId.value.value;
  // inventario.value.estatus = 2;

  const inventarioFormData = new FormData();
  inventarioFormData.append("Catalago_Id", catalogoId.value.value);
  inventarioFormData.append("Estatus_Id", 2);
  inventarioFormData.append("Bodega_Id", bodegaId.value.value);
  inventarioFormData.append("Marca_Id", marcaId.value.value);
  inventarioFormData.append("Modelo_Id", modeloId.value.value);
  inventarioFormData.append("Descripcion", inventario.value);
  inventarioFormData.append("Nombre_Corto", inventario.nombre_corto);
  inventarioFormData.append("Color", inventario.color);
  inventarioFormData.append("Descripcion", inventario.descripcion);
  inventarioFormData.append("Foto_1", files.value.name);

  console.log("catalogo", inventario.descripcion);
  let resp = null;
  $q.loading.show();

  if (isEditar.value == true) {
    console.log("editar");
  } else {
    console.log("onSubmit", inventarioFormData);
    resp = await inventarioStore.createInventario(inventarioFormData);
  }

  if (resp.success) {
    $q.notify({
      type: "positive",
      message: resp.data,
    });
    actualizarModal(false);
  } else {
    $q.notify({
      type: "negative",
      message: resp.data,
    });
    //loading.value = false;
  }
  $q.loading.hide();
};
</script>

<style></style>
