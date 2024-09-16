<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 900px; max-width: 90vw">
      <q-card-section class="row">
        <q-img src="../../../assets/IEEN300.png" width="70px" />
        <div
          class="text-h6 text-center text-gray-ieen-1 text-bold absolute-center"
        >
          {{
            !isEditar && !isShow
              ? "REGISTRAR ASIGNACIÓN"
              : isEditar
              ? "EDITAR ASIGNACIÓN"
              : "VER ASIGNACIÓN"
          }}
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
      <q-form @submit="registrar">
        <q-card-section>
          <div class="row q-col-gutter-xs">
            <div
              v-if="isEditar || isShow"
              class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
            >
              <q-input disable v-model="asignacion.estatus" label="Estatus">
              </q-input>
            </div>
            <div
              :class="
                isEditar || isShow
                  ? 'col-lg-6 col-md-6 col-sm-12 col-xs-12'
                  : 'col-12'
              "
            >
              <q-input
                color="purple-ieen"
                v-if="!isByBodega && !isShow"
                v-model="date"
              >
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        color="purple-ieen"
                        v-model="date"
                        mask="YYYY-MM-DD HH:mm"
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="purple"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time
                        color="purple-ieen"
                        v-model="date"
                        mask="YYYY-MM-DD HH:mm"
                        format24h
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="purple-ieen"
                            flat
                          />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input
                color="purple-ieen"
                v-else
                disable
                v-model="asignacion.fecha_Registro"
                label="Fecha"
              >
              </q-input>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-select
                color="purple-ieen"
                v-if="!isShow && !isEditar"
                label="Área"
                v-model="area_Id"
                :options="areas"
                hint="Selecciona una área"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'El área es requerida']"
              >
                <template v-slot:prepend>
                  <q-icon name="apartment" />
                </template>
              </q-select>
              <q-input v-else disable v-model="asignacion.area" label="Área">
                <template v-slot:prepend>
                  <q-icon name="apartment" />
                </template>
              </q-input>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-select
                color="purple-ieen"
                v-if="!isShow && !isEditar"
                label="Empleado"
                v-model="empleado_Id"
                :options="listEmpleados"
                hint="Selecciona una empleado"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-select>
              <q-input
                color="purple-ieen"
                v-else
                disable
                v-model="asignacion.empleado"
                label="Empleado"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-input
                color="purple-ieen"
                disable
                label="Puesto"
                v-model="puesto"
              >
              </q-input>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-select
                color="purple-ieen"
                v-show="!isShow"
                v-model="catalogo_Id"
                :options="listCatalogosTodos"
                label="Catálogo perteneciente del inventario"
                hint="Selecciona una catalogo"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'El catálogo es requerido']"
              >
              </q-select>
            </div>
            <div class="col-lg-5 col-md-5 col-sm-4 col-xs-12">
              <q-select
                color="purple-ieen"
                :loading="loading"
                v-show="!isShow && !qr"
                v-model="inventario_Id"
                :options="opciones_Inventario"
                use-input
                @filter="filterInventario"
                label="Productos"
                hint="Selecciona un producto"
              >
              </q-select>
              <q-input
                color="purple-ieen"
                :loading="loading"
                v-show="qr"
                ref="codigo_QR_Ref"
                label="Código QR"
                v-model="codigo_QR"
                @keydown.enter.prevent="buscarPorQr(codigo_QR)"
                @keypress="loading = true"
                hint="Leer código QR"
              >
              </q-input>
            </div>
            <div
              v-if="!isShow"
              class="col-lg-1 col-md-1 col-sm-2 col-xs-12 q-pt-md"
            >
              <q-btn
                size="lg"
                @click="setInput"
                color="purple-ieen"
                icon="qr_code_scanner"
                flat
              >
                <q-tooltip>{{
                  qr ? "Buscar por clave" : "Buscar por código de barra"
                }}</q-tooltip>
              </q-btn>
            </div>
            <q-space />
            <br /><br />
            <div class="col-12 justify-end">
              <div class="text-right q-gutter-xs">
                <q-btn
                  v-if="!isShow"
                  icon-right="add"
                  label="Agregar"
                  color="secondary"
                  class="q-ml-sm"
                  @click="agregarProducto"
                />
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <TablaAsignacionInventario v-show="!isByBodega" />
          <TablaInventarioByBodegaVue v-show="isByBodega" />
        </q-card-section>
        <q-card-section>
          <q-space />
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
                v-if="!isShow"
                :disable="habilitar_Button"
                label="Guardar"
                type="submit"
                color="secondary"
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
import { useEstatusStore } from "src/stores/estatus_store";
import { useInventarioStore } from "src/stores/inventario_store";
import { onBeforeMount, ref, watch, watchEffect } from "vue";
import { useAsignacionStore } from "../../../stores/asignacion_store";
import { useEmpleadosStore } from "src/stores/empleados_store";
import { useBodegaStore } from "src/stores/bodega_store";
import TablaAsignacionInventario from "./TablaAsignacionInventario.vue";
import TablaInventarioByBodegaVue from "./TablaInventarioByBodega.vue";
import leerQR from "../../../helpers/leerQR";

//-----------------------------------------------------------

const $q = useQuasar();
const asignacionStore = useAsignacionStore();
const estatusStore = useEstatusStore();
const catalogoStore = useCatalogoProductoStore();
const inventarioStore = useInventarioStore();
const empleadoStore = useEmpleadosStore();
const bodegaStore = useBodegaStore();
const { estatus } = storeToRefs(estatusStore);
const { inventarios } = storeToRefs(inventarioStore);
const { listCatalogosTodos } = storeToRefs(catalogoStore);
const {
  modal,
  asignacion,
  areas,
  puestos,
  listaAsignacionInventario,
  listEmpleados,
  isEditar,
  isShow,
  isByBodega,
  detalleAsignaciones,
} = storeToRefs(asignacionStore);
const estatus_Id = ref(null);
const area_Id = ref(null);
const puesto_Id = ref(null);
const puesto = ref(null);
const inventario_Id = ref(null);
const empleado_Id = ref(null);
const catalogo_Id = ref(null);
const opciones_Inventario = ref([...inventarios.value]);
const habilitar_Button = ref(false);
const loading = ref(false);
const qr = ref(false);
const codigo_QR = ref("");
const codigo_QR_Ref = ref(null);
const isSmallScreen = ref(window.matchMedia("(max-width: 768px)").matches);
const tipo_Asignacion = ref("personal");

//-----------------------------------------------------------
//Get fecha actual
const dateActual = new Date();
const year = dateActual.getFullYear();
const month = String(dateActual.getMonth() + 1).padStart(2, "0");
const day = String(dateActual.getDate()).padStart(2, "0");
const hours = String(dateActual.getHours());
const minutes = String(dateActual.getMinutes());
const seconds = String(dateActual.getSeconds());
const date = ref(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------

watch(
  () => window.innerWidth,
  (width) => {
    isSmallScreen.value = width <= 768;
  }
);

watch(asignacion.value, (val) => {
  if (isEditar.value == true || isShow.value == true) {
    if (val.id != null) {
      cargarEstatus(val);
      cargarArea(val);
      cargarPuestos(val);
      catalogo_Id.value = { value: 0, label: "Todos" };
      date.value = val.fecha_Asignacion;
    }
  }
});

watch(catalogo_Id, (val) => {
  if (val != null) {
    inventario_Id.value = null;
    inventarioStore.loadListInventario(val.value);
  }
});

watch(area_Id, (val) => {
  if (val != null) {
    if (tipo_Asignacion.value == "bodega") {
      empleadoStore.loadResponsableByArea(area_Id.value.value);
    } else {
      asignacionStore.loadEmpleadosByArea(area_Id.value.value, false);
      empleado_Id.value = null;
      puesto_Id.value = null;
      puesto.value = null;
    }
  }
});

watch(empleado_Id, (val) => {
  if (val != null) {
    puesto.value = empleado_Id.value.puesto;
    puesto_Id.value = val.puesto_Id;
  }
});

watch(modal, (val) => {
  if (val == true) {
    catalogo_Id.value = { value: 0, label: "Todos" };
  }
});

watchEffect(() => {
  if (listaAsignacionInventario.value.length > 0) {
    habilitar_Button.value = false;
  } else {
    habilitar_Button.value = true;
  }
});

//-----------------------------------------------------------

const cargarData = async () => {
  await inventarioStore.loadListInventario(0);
  await estatusStore.loadInformacionEstatus();
  await catalogoStore.loadCatalogoList(true);
  await bodegaStore.loadBodegasList();
  await asignacionStore.loadAreasList(false);
  catalogo_Id.value = { value: 0, label: "Todos" };
};

const setInput = () => {
  qr.value = !qr.value;
  if (qr.value == true) {
    setTimeout(() => {
      codigo_QR_Ref.value.focus();
    }, 100);
  }
};

const cargarEstatus = async (val) => {
  if (estatus_Id.value == null) {
    let estatusFiltrado = estatus.value.find(
      (x) => x.value == `${val.estatus_Id}`
    );
    estatus_Id.value = estatusFiltrado;
  }
};

const cargarArea = async (val) => {
  if (area_Id.value == null) {
    let areaFiltrado = areas.value.find((x) => x.value == `${val.area_Id}`);
    area_Id.value = areaFiltrado;
    await asignacionStore.loadEmpleadosByArea(val.area_Id, false);
    cargarEmpleado(val);
  }
};

const cargarPuestos = async (val) => {
  if (puesto_Id.value == null) {
    let puestoFiltrado = puestos.value.find(
      (x) => x.value == `${val.puesto_Id}`
    );
    puesto_Id.value = puestoFiltrado;
  }
};

const cargarEmpleado = async (val) => {
  if (empleado_Id.value == null) {
    let empleadoFiltrado = listEmpleados.value.find(
      (x) => x.value == `${val.empleado_Id}`
    );
    empleado_Id.value = empleadoFiltrado;
  }
};

const limpiarCampos = () => {
  area_Id.value = null;
  empleado_Id.value = null;
  puesto_Id.value = null;
  catalogo_Id.value = null;
  inventario_Id.value = null;
  opciones_Inventario.value = null;
  puesto.value = null;
  puesto_Id.value = null;
  tipo_Asignacion.value = "personal";
  empleadoStore.initEmpleado();
};

const actualizarModal = (valor) => {
  limpiarCampos();
  catalogo_Id.value = { value: 0, label: "Todos" };
  asignacionStore.actualizarModal(valor);
  asignacionStore.initAsignacion();
  asignacionStore.updateEditar(false);
  asignacionStore.updateIsBodega(false);
};

const buscarPorQr = (q_r) => {
  if (q_r != null) {
    let resp = leerQR(q_r);
    const inventario_filtrado = inventarios.value.find((x) =>
      x.label.includes(resp)
    );
    if (inventario_filtrado != null) {
      inventario_Id.value = inventario_filtrado;
      codigo_QR.value = "";
      loading.value = false;
      agregarProducto();
      setTimeout(() => {
        codigo_QR_Ref.value.focus();
      }, 100);
    }
  }
};

const filterInventario = (val, update) => {
  if (val === "") {
    update(() => {
      loading.value = true;
      setTimeout(() => {
        opciones_Inventario.value = inventarios.value;
        loading.value = false;
      }, 1000);
    });

    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    opciones_Inventario.value = inventarios.value.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
};

const validateForm = async () => {
  if (isEditar.value == false) {
    if (
      area_Id.value == null ||
      empleado_Id.value == null ||
      puesto_Id.value == null
    ) {
      $q.dialog({
        title: "Atención",
        message: "Llenar los datos del personal",
        icon: "Warning",
        persistent: true,
        transitionShow: "scale",
        transitionHide: "scale",
      });
    } else {
      return true;
    }
  } else if (isEditar.value == true) {
    if (
      asignacion.value.area_Id == null ||
      asignacion.value.empleado_Id == null ||
      asignacion.value.puesto_Id == null
    ) {
      $q.dialog({
        title: "Atención",
        message: "Llenar los datos del personal",
        icon: "Warning",
        persistent: true,
        transitionShow: "scale",
        transitionHide: "scale",
      });
    } else {
      return true;
    }
  }
};

const agregarProducto = async () => {
  let respValidate = await validateForm();
  if (respValidate == true) {
    if (listaAsignacionInventario.value.length == 0) {
      if (isEditar.value == true) {
        detalleAsignaciones.value.inventario_Id = inventario_Id.value.value;
        await asignacionStore.createDetalleAsignacion(
          asignacion.value.id,
          detalleAsignaciones.value
        );
        await asignacionStore.addInventario(
          asignacion.value.id,
          inventario_Id.value
        );
      } else {
        await asignacionStore.addInventario(
          asignacion.value.id,
          inventario_Id.value
        );
      }
      inventario_Id.value = null;
    } else {
      let resp = null;
      let filtro = listaAsignacionInventario.value.find(
        (x) => x.inventario_Id == inventario_Id.value.value
      );
      if (filtro == undefined) {
        if (isEditar.value == true) {
          detalleAsignaciones.value.inventario_Id = inventario_Id.value.value;
          resp = await asignacionStore.createDetalleAsignacion(
            asignacion.value.id,
            detalleAsignaciones.value
          );
          await asignacionStore.addInventario(
            asignacion.value.id,
            inventario_Id.value
          );
          if (resp.success == true) {
            $q.notify({
              position: "top-right",
              type: "positive",
              message: "Se agrego correctamente",
            });
          } else {
            $q.notify({
              position: "top-right",
              type: "negative",
              message:
                "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
            });
          }
        } else {
          await asignacionStore.addInventario(
            asignacion.value.id,
            inventario_Id.value
          );
        }

        inventario_Id.value = null;
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

//-----------------------------------------------------------

const registrar = async () => {
  let resp = null;
  $q.loading.show();
  asignacion.value.empleado_Id = empleado_Id.value.value;
  asignacion.value.puesto_Id = puesto_Id.value;
  asignacion.value.detalle = listaAsignacionInventario.value;
  asignacion.value.area_Id = parseInt(area_Id.value.value);
  asignacion.value.eliminado = false;
  asignacion.value.tipo = "Personal";
  asignacion.value.fecha_Asignacion = date.value;
  if (isEditar.value == true) {
    resp = await asignacionStore.updateAsignacion(asignacion.value);
  } else {
    resp = await asignacionStore.createAsignacion(asignacion.value);
  }
  if (resp.success) {
    $q.notify({
      position: "top-right",
      type: "positive",
      message: resp.data,
    });
    actualizarModal(false);
    limpiarCampos();
    asignacionStore.initAsignacion();
    asignacionStore.loadInformacionAsignaciones();
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
