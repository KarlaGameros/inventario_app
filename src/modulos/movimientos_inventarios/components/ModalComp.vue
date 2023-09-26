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
      <q-form @submit="onSubmit" ref="RegistroMovimiento">
        <q-card-section>
          <div class="row q-col-gutter-xs">
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-select
                v-if="!isEditar"
                v-model="tipoMovimiento"
                :options="listTipoMovimientos"
                label="Tipo de movimiento"
                hint="Selecciona un tipo de movimiento"
                :lazy-rules="true"
                :rules="[
                  (val) => !!val || 'El tipo de movimiento es requerido',
                ]"
              >
              </q-select>
              <q-input
                v-else
                readonly
                v-model="movimiento.tipo_Movimiento"
                label="Tipo de movimiento"
              ></q-input>
            </div>

            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-select
                v-if="!isEditar"
                v-model="conceptoMovimiento"
                :options="listConceptoMovimiento"
                label="Concepto de movimiento"
                hint="Selecciona un concepto"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'El concepto es requerido']"
              >
              </q-select>
              <q-input
                v-else
                readonly
                v-model="movimiento.concepto_Movimiento"
                label="Concepto de movimiento"
              ></q-input>
            </div>

            <div
              v-if="inputSalida == 'Salida'"
              class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
            >
              <q-select
                v-if="!isEditar"
                v-model="bodega_origen"
                :options="listBodega"
                label="Bodega origen"
                hint="Selecciona bodega origen"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'La bodega origen es requerida']"
              >
              </q-select>
              <q-input
                v-else
                readonly
                v-model="movimiento.bodega_Origen"
                label="Concepto de movimiento"
              ></q-input>
            </div>

            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-select
                v-if="!isEditar"
                v-model="bodega_destino"
                :options="listBodega"
                label="Bodega destino"
                hint="Selecciona bodega destino"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'La bodega destino es requerida']"
              >
              </q-select>
              <q-input
                v-else
                readonly
                v-model="movimiento.bodega_Destino"
                label="Concepto de movimiento"
              ></q-input>
            </div>

            <div
              :class="
                inputSalida == 'Salida'
                  ? 'col-lg-12 col-md-12 col-sm-12 col-xs-12'
                  : 'col-lg-6 col-md-6 col-sm-12 col-xs-12'
              "
            >
              <q-input
                v-if="!isEditar"
                v-model="date"
                label="Fecha de movimiento"
              >
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
              <q-input
                v-else
                readonly
                v-model="movimiento.fecha_Movimiento"
                label="Fecha de movimiento"
              ></q-input>
            </div>

            <div
              v-if="isCompra == true"
              class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
            >
              <q-select
                v-if="!isEditar"
                v-model="proveedor"
                :options="proveedores"
                label="Provedor"
                hint="Selecciona un provedor"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'El provedor es requerido']"
              >
                <template v-slot:after>
                  <q-btn round dense flat icon="add" @click="addProveedor" />
                </template>
              </q-select>
              <q-input
                v-else
                readonly
                v-model="movimiento.provedor"
                label="Proveedor"
              ></q-input>
            </div>

            <div
              v-if="isCompra == true"
              class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
            >
              <q-input
                v-if="!isEditar"
                v-model="uuid"
                label="UUID"
                autogrow
                lazy-rules
                :rules="[(val) => !!val || 'El UUID es requerido']"
              >
                <q-icon v-show="validarUuid" name="done" color="green" />
                <q-icon v-show="!validarUuid" name="close" color="red" />
              </q-input>
              <q-input
                v-else
                readonly
                v-model="movimiento.uuid"
                label="UUID"
              ></q-input>
            </div>

            <div
              v-if="isCompra == true"
              class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
            >
              <q-input
                v-if="!isEditar"
                v-model="movimiento.no_factura"
                label="Número de factura"
                autogrow
                lazy-rules
                :rules="[(val) => !!val || 'El número de factura es requerido']"
              >
              </q-input>
              <q-input
                v-else
                readonly
                v-model="movimiento.no_Factura"
                label="Número de factura"
              ></q-input>
            </div>

            <div v-if="!isEditar" class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
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

            <div v-if="!isEditar" class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
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

            <div
              v-if="isCompra == true"
              class="col-lg-4 col-md-4 col-sm-12 col-xs-12"
            >
              <q-input
                v-if="!isEditar"
                v-model="cantidad"
                label="Cantidad"
                type="number"
                min="1"
              >
              </q-input>
              <q-input
                v-else
                readonly
                v-model="movimiento.cantidad"
                label="Cantidad"
              ></q-input>
            </div>
            <div
              v-if="isCompra == true"
              class="col-lg-4 col-md-4 col-sm-12 col-xs-12"
            >
              <q-input
                v-if="!isEditar"
                v-model="precio_Unitario"
                label="Precio unitario del producto"
                prefix="$"
              >
              </q-input>
              <q-input
                v-else
                readonly
                v-model="movimiento.precio_Unitario"
                label="Precio Unitario"
              ></q-input>
            </div>
            <div
              v-if="isCompra == true"
              class="col-lg-4 col-md-4 col-sm-12 col-xs-12"
            >
              <q-input
                v-if="!isEditar"
                v-model="importe"
                label="Importe total de la transición"
                prefix="$"
              >
              </q-input>
              <q-input
                v-else
                readonly
                v-model="movimiento.precio_Unitario"
                label="Importe total de la transición"
                prefix="$"
              ></q-input>
            </div>

            <div
              v-if="isCompra == true"
              class="col-lg-6 col-md-6 col-sm-6 col-xs-12"
            >
              <!-- <q-file filled bottom-slots v-model="model" label="PDF" counter>
                <template v-slot:prepend>
                  <q-icon name="cloud_upload" @click.stop.prevent />
                </template>
                <template v-slot:append>
                  <q-icon
                    name="close"
                    @click.stop.prevent="model = null"
                    class="cursor-pointer"
                  />
                </template>
              </q-file> -->
            </div>

            <div
              v-if="isCompra == true"
              class="col-lg-6 col-md-6 col-sm-6 col-xs-12"
            >
              <!-- <q-file filled bottom-slots v-model="model" label="XML" counter>
                <template v-slot:prepend>
                  <q-icon name="cloud_upload" @click.stop.prevent />
                </template>
                <template v-slot:append>
                  <q-icon
                    name="close"
                    @click.stop.prevent="model = null"
                    class="cursor-pointer"
                  />
                </template>
              </q-file> -->
            </div>

            <q-space />
            <div class="col-12 justify-end">
              <div class="text-right q-gutter-xs">
                <q-btn
                  icon-right="add"
                  label="Agregar"
                  color="positive"
                  class="q-ml-sm"
                  @click="
                    $refs.RegistroMovimiento.validate(), agregarProducto()
                  "
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
import { useProvedores } from "src/stores/provedores_store";
import { onBeforeMount, ref, watch } from "vue";
import { useMovimientoInventario } from "../../../stores/movimiento_inventario";
import TablaMovimientoInventario from "../components/TablaMovimientoInventario.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const movimientoInventarioStore = useMovimientoInventario();
const proveedorStore = useProvedores();
const catalogoStore = useCatalogoProductoStore();
const bodegaStore = useBodegaStore();
const inventarioStore = useInventarioStore();

const {
  modal,
  listaMovimientoInventario,
  listTipoMovimientos,
  listConceptoMovimiento,
  isEditar,
  movimiento,
  isCompra,
} = storeToRefs(movimientoInventarioStore);
const { proveedores } = storeToRefs(proveedorStore);
const { listCatalogo } = storeToRefs(catalogoStore);
const { listBodega } = storeToRefs(bodegaStore);
const { inventarios } = storeToRefs(inventarioStore);
const catalogoId = ref(null);
const bodega_origen = ref(null);
const bodega_destino = ref(null);
const tipoMovimiento = ref(null);
const inventarioId = ref(null);
const proveedor = ref(null);
const opcionesInventario = ref([...inventarios.value]);
const conceptoMovimiento = ref(null);
const inputSalida = ref(null);
const cantidad = ref(null);
const precio_Unitario = ref(null);
const importe = ref(null);
const uuid = ref(null);
const validarUuid = ref(false);
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
  catalogoStore.loadCatalogoListNormal();
  bodegaStore.loadBodegasList();
  movimientoInventarioStore.loadTipoMovimientos();
  proveedorStore.loadInformacionProvedores();
  catalogoId.value = { value: 0, label: "Todos" };
});

//-----------------------------------------------------------

watch(catalogoId, (val) => {
  if (val != null) {
    inventarioStore.loadListInventario(val.value);
  }
});

watch(tipoMovimiento, (val) => {
  if (val != null) {
    if (val.label == "Salida") {
      inputSalida.value = val.label;
      conceptoMovimiento.value = null;
      movimientoInventarioStore.loadConceptoMovimientoListFiltro(val.value);
      movimientoInventarioStore.updateCompra(false);
    } else {
      inputSalida.value = val.label;
      conceptoMovimiento.value = null;
      movimientoInventarioStore.loadConceptoMovimientoListFiltro(val.value);
    }
  }
});

watch(conceptoMovimiento, (val) => {
  if (val != null) {
    if (val.label == "Entrada por compra") {
      movimientoInventarioStore.updateCompra(true);
      movimientoInventarioStore.initMovimiento();
    } else {
      movimientoInventarioStore.updateCompra(false);
      movimientoInventarioStore.initMovimiento();
    }
  }
});

watch(movimiento.value, (val) => {
  if (val.id != null) {
    cargarTipoMovimiento(val);
    cargarBodegaDestino(val);
    cargarConceptoMovimiento(val);
  }
});

watch(uuid, (val) => {
  if (val != null) {
    if (val.length == 36) {
      validarUuid.value = true;
    } else {
      validarUuid.value = false;
    }
  }
});
//-----------------------------------------------------------

const cargarTipoMovimiento = async (val) => {
  if (tipoMovimiento.value == null) {
    let tipoFiltrado = listTipoMovimientos.value.find(
      (x) => x.value == `${val.tipo_Movimiento_Id}`
    );
    tipoMovimiento.value = tipoFiltrado;
  }
};

const cargarConceptoMovimiento = async (val) => {
  if (conceptoMovimiento.value == null) {
    let conceptoFiltrado = listConceptoMovimiento.value.find(
      (x) => x.value == `${val.concepto_Movimiento_Id}`
    );
    conceptoMovimiento.value = conceptoFiltrado;
  }
};

const cargarBodegaDestino = async (val) => {
  if (bodega_destino.value == null) {
    let bodegaDestinoFiltrado = listBodega.value.find(
      (x) => x.value == `${val.bodega_Destino_Id}`
    );
    bodega_destino.value = bodegaDestinoFiltrado;
  }
};

const actualizarModal = (valor) => {
  movimientoInventarioStore.actualizarModal(valor);
  movimientoInventarioStore.updateCompra(valor);
  proveedorStore.actualizarModal(false);
  limpiarRegistro();
  isEditar.value = false;
  catalogoId.value = { value: 0, label: "Todos" };
};

const addProveedor = () => {
  $q.loading.show();
  proveedorStore.actualizarModal(true);
  $q.loading.hide();
};

const limpiarRegistro = () => {
  inventarioId.value = null;
  cantidad.value = null;
  precio_Unitario.value = null;
  importe.value = null;
  bodega_origen.value = null;
  bodega_destino.value = null;
  tipoMovimiento.value = null;
  conceptoMovimiento.value = null;
  opcionesInventario.value = null;
  catalogoId.value = null;
  movimientoInventarioStore.initMovimiento();
};

const filterInventario = (val, update) => {
  if (val === "") {
    update(() => {
      opcionesInventario.value = inventarios.value;
    });
    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    opcionesInventario.value = inventarios.value.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
};

const validarForm = async () => {
  if (isCompra.value == true) {
    if (
      cantidad.value == null ||
      precio_Unitario.value == null ||
      importe.value == null ||
      tipoMovimiento.value == null ||
      conceptoMovimiento.value == null ||
      bodega_destino.value == null ||
      proveedor.value == null
    ) {
      $q.notify({
        position: "top-right",
        type: "negative",
        message: "Ingrese datos completos",
      });
    } else if (validarUuid.value == false) {
      $q.notify({
        position: "top-right",
        type: "negative",
        message: "UUI incorrecto",
      });
    } else {
      return true;
    }
  } else {
    if (
      tipoMovimiento.value == null ||
      conceptoMovimiento.value == null ||
      bodega_destino.value == null
    ) {
      $q.notify({
        position: "top-right",
        type: "negative",
        message: "Ingrese datos completos",
      });
    } else {
      return true;
    }
  }
};

const validarProducto = async (inventario) => {
  let filtro = listaMovimientoInventario.value.find(
    (x) => x.inventario_Id == inventario
  );
  return filtro;
};

const agregarProducto = async () => {
  let resp = await validarForm();
  if (resp == true && isCompra.value == true) {
    if (listaMovimientoInventario.value.length == 0) {
      await movimientoInventarioStore.addMovimiento(
        inventarioId.value,
        cantidad.value,
        precio_Unitario.value,
        importe.value
      );
    } else {
      let respValidarProducto = await validarProducto(inventarioId.value.value);
      if (respValidarProducto == undefined) {
        await movimientoInventarioStore.addMovimiento(inventarioId.value);
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
  } else if (resp == true && isCompra.value == false) {
    if (listaMovimientoInventario.value.length == 0) {
      await movimientoInventarioStore.addMovimiento(
        inventarioId.value,
        cantidad.value,
        precio_Unitario.value,
        importe.value
      );
    } else {
      let respValidarProducto = await validarProducto(inventarioId.value.value);
      if (respValidarProducto == undefined) {
        await movimientoInventarioStore.addMovimiento(inventarioId.value);
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
  }
};

const onSubmit = async () => {
  let movimientosFormData = new FormData();
  let resp = null;
  $q.loading.show();
  if (isEditar == true) {
  } else {
    movimientosFormData.append(
      "Tipo_Movimiento_Id",
      tipoMovimiento.value.value
    );
    movimientosFormData.append(
      "Concepto_Movimiento_Id",
      conceptoMovimiento.value.value
    );
    movimientosFormData.append("Fecha_Movimiento", date.value);
    movimientosFormData.append("Bodega_Destino_Id", bodega_destino.value.value);
    listaMovimientoInventario.value.forEach((row) => {
      movimientosFormData.append("Detalle[]", row.id);
    });
  }

  if (isEditar.value == true) {
  } else {
    let respValidar = await validarForm();
    if (respValidar == true) {
      resp = await movimientoInventarioStore.createMovimiento(
        movimientosFormData
      );
    }
  }
  // if (resp.success) {
  //   $q.notify({
  //     position: "top-right",
  //     type: "positive",
  //     message: resp.data,
  //   });
  //   actualizarModal(false);
  //   movimientoInventarioStore.initMovimiento();
  //   movimientoInventarioStore.loadInformacionMovimientos();
  // } else {
  //   $q.notify({
  //     position: "top-right",
  //     type: "negative",
  //     message: resp.data,
  //   });
  // }
  $q.loading.hide();
};
</script>

<style></style>
