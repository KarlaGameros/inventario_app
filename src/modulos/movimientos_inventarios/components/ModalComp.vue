<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 1200px; max-width: 120vw">
      <q-card-section class="row">
        <q-img src="../../../assets/IEEN300.png" width="90px" />
        <div class="text-h5 text-gray-ieen-1 text-bold absolute-center">
          {{ !isEditar ? "REGISTRAR MOVIMIENTO" : "EDITAR MOVIMIENTO" }}
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
                color="purple-ieen"
                filled
                :readonly="isEditar || visualizar"
                v-model="tipo_Movimiento"
                :options="listTipoMovimientos"
                label="Tipo de movimiento"
                hint="Selecciona un tipo de movimiento"
                :lazy-rules="true"
                :rules="[
                  (val) => !!val || 'El tipo de movimiento es requerido',
                ]"
              >
              </q-select>
            </div>
            <div
              v-if="tipo == 'Salida'"
              class="col-lg-6 col-md-6 col-sm-6 col-xs-12"
            >
              <q-select
                color="purple-ieen"
                filled
                :readonly="isEditar || visualizar"
                v-model="concepto_Movimiento"
                :options="listConceptoMovimiento"
                label="Concepto de movimiento"
                hint="Selecciona un concepto"
                :lazy-rules="true"
                :rules="[
                  (val) => !!val || 'El concepto de movimiento es requerido',
                ]"
              >
              </q-select>
            </div>
            <div
              v-if="tipo == 'Salida' && tipo_Movimiento_2 == 'Pendiente Baja'"
              class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
            >
              <q-input
                color="purple-ieen"
                filled
                :readonly="visualizar"
                v-model="movimiento.folio_Dictamen_Baja"
                label="Folio dictame baja"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'El folio es requerido']"
              />
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-input
                color="purple-ieen"
                filled
                :readonly="isEditar || visualizar"
                v-model="date"
                label="Fecha de movimiento"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'La fecha es requerida']"
              >
                <template v-if="!visualizar && !isEditar" v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="date" color="purple-ieen">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Cerrar"
                            color="purple-ieen"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div
              v-if="tipo_Movimiento_2 != 'Pendiente Baja'"
              class="col-lg-6 col-md-6 col-sm-6 col-xs-12"
            ></div>
            <div
              v-if="tipo == 'Salida' && !visualizar"
              class="col-lg-4 col-md-4 col-sm-4 col-xs-12"
            >
              <q-select
                color="purple-ieen"
                filled
                label="Bodega"
                v-model="bodega_Id"
                :options="listBodega"
                hint="Selecciona una bodega"
              >
              </q-select>
            </div>
            <div
              v-if="tipo == 'Salida' && !visualizar"
              class="col-lg-4 col-md-4 col-sm-4 col-xs-12"
            >
              <q-select
                color="purple-ieen"
                filled
                v-model="inventario_Id"
                :options="opciones_Inventario"
                use-input
                @filter="filterInventario"
                label="Productos"
                hint="Selecciona un producto"
              >
              </q-select>
            </div>
            <div
              v-if="tipo == 'Salida' && !visualizar"
              class="col-lg-4 col-md-4 col-sm-4 col-xs-12"
            >
              <q-select
                color="purple-ieen"
                filled
                v-model="estado_Fisico"
                :options="
                  tipo_Movimiento_2 == 'Pendiente Baja'
                    ? listEstadoFisicoBaja
                    : listEstadoFisico
                "
                label="Estado físico del bien"
                hint="Selecciona un estado físico del bien"
              >
              </q-select>
            </div>
            <div
              v-if="tipo == 'Entrega Recepción' || tipo == 'Traspaso'"
              class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
            >
              <q-select
                color="purple-ieen"
                filled
                :readonly="isEditar || visualizar"
                label="Área"
                v-model="area_Id"
                :options="list_Areas"
                hint="Selecciona una área"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'El área es requerida']"
              >
              </q-select>
            </div>
            <div
              v-if="tipo == 'Entrega Recepción' || tipo == 'Traspaso'"
              class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
            >
              <q-select
                color="purple-ieen"
                filled
                :readonly="isEditar || visualizar"
                label="Empleado"
                v-model="empleado_Id"
                :options="list_Empleados"
                hint="Selecciona una empleado"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'El empleado es requerido']"
              >
              </q-select>
            </div>
            <div
              v-if="tipo == 'Traspaso' && !visualizar"
              class="col-lg-6 col-md-6 col-sm-6 col-xs-12"
            >
              <q-select
                color="purple-ieen"
                filled
                label="Tipo de traspaso"
                v-model="tipo_Traspaso_Id"
                :options="list_Tipo_Traspaso"
                hint="Selecciona un tipo de traspaso"
              >
              </q-select>
            </div>
            <div
              v-if="tipo == 'Traspaso' && !visualizar"
              class="col-lg-6 col-md-6 col-sm-6 col-xs-12 text-bold text-center"
            >
              Asignar a:
              <q-radio
                color="purple-ieen"
                size="lg"
                :disable="visualizar"
                checked-icon="task_alt"
                v-model="destino"
                unchecked-icon="panorama_fish_eye"
                val="Bodega"
                label="Bodega"
              />
              <q-radio
                color="purple-ieen"
                size="lg"
                :disable="visualizar"
                checked-icon="task_alt"
                v-model="destino"
                unchecked-icon="panorama_fish_eye"
                val="Personal"
                label="Personal"
              />
            </div>
            <!-- <div
              v-if="
                tipo == 'Traspaso' &&
                tipo_Traspaso_Id == 'Individual' &&
                !visualizar
              "
              class="col-lg-6 col-md-6 col-sm-6 col-xs-12"
            >
              <q-select
                color="purple"
                filled
                @filter="filterInventario"
                use-input
                multiple
                label="Inventario"
                v-model="inventario_Asignado_Id"
                :options="opciones_Inventario_Traspaso"
                hint="Selecciona una inventario"
              >
              </q-select>
            </div> -->
            <div
              v-if="tipo == 'Traspaso' && destino == 'Personal' && !visualizar"
              class="col-lg-6 col-md-6 col-sm-6 col-xs-12"
            >
              <q-select
                color="purple-ieen"
                filled
                :disable="visualizar"
                label="Área"
                v-model="area_Traspaso"
                :options="list_Areas"
                hint="Selecciona área"
              >
              </q-select>
              <q-select
                color="purple-ieen"
                filled
                :disable="visualizar"
                label="Personal"
                v-model="personal_Traspaso"
                :options="list_Empleados"
                hint="Selecciona personal"
              >
              </q-select>
            </div>
            <div
              v-if="tipo == 'Traspaso' && destino == 'Bodega' && !visualizar"
              class="col-lg-6 col-md-6 col-sm-6 col-xs-12"
            >
              <q-select
                color="purple-ieen"
                filled
                :disable="visualizar"
                label="Bodega"
                v-model="bodega_traspaso_Id"
                :options="listBodega"
                hint="Selecciona bodega"
              >
              </q-select>
            </div>
            <div v-if="tipo == 'Salida' && !visualizar" class="col-12">
              <q-input
                color="purple-ieen"
                filled
                v-model="observacion"
                label="Justificación"
                type="textarea"
              />
            </div>
            <div v-if="visualizar" class="col-6">
              <q-input
                color="purple-ieen"
                filled
                v-model="movimiento.estatus"
                label="Estatus"
                readonly
              />
            </div>
            <q-space />
            <div
              v-if="tipo == 'Salida' && !visualizar"
              class="col-12 justify-end"
            >
              <div class="text-right q-gutter-xs">
                <q-btn
                  icon-right="add_circle"
                  label="Agregar"
                  color="secondary"
                  class="q-ml-sm"
                  @click="
                    $refs.RegistroMovimiento.validate(), agregarProducto()
                  "
                />
              </div>
            </div>
            <div
              v-if="tipo == 'Traspaso' && !visualizar"
              class="col-12 justify-end"
            >
              <div class="text-right q-gutter-xs">
                <q-btn
                  v-if="tipo_Traspaso_Id == 'Individual'"
                  icon-right="add_circle"
                  :disable="empleado_Id == null"
                  label="Agregar inventario"
                  color="secondary"
                  class="q-ml-sm"
                  @click="
                    $refs.RegistroMovimiento.validate(),
                      agregarInventarioTraspaso()
                  "
                />
                <q-btn
                  v-else
                  icon-right="add_circle"
                  label="Agregar"
                  color="secondary"
                  class="q-ml-sm"
                  @click="
                    $refs.RegistroMovimiento.validate(),
                      agregarInventarioTraspasoTodo()
                  "
                />
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <TablaMovimientoInventario v-if="tipo == 'Entrega Recepción'" />
          <div class="row" v-else-if="tipo == 'Salida'">
            <div class="col">
              <q-table
                class="my-sticky-header-table"
                :rows="list_Detalle"
                :columns="columns"
                :filter="filter"
                :pagination="pagination"
                row-key="id"
                rows-per-page-label="Filas por pagina"
                no-data-label="No hay registros"
              >
                <template v-slot:top-right>
                  <q-input
                    borderless
                    dense
                    debounce="300"
                    v-model="filter"
                    placeholder="Buscar.."
                  >
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </template>
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                    >
                      <div v-if="col.name === 'destino'">
                        <q-radio
                          :disable="visualizar"
                          checked-icon="task_alt"
                          v-model="props.row.destino"
                          unchecked-icon="panorama_fish_eye"
                          val="Bodega"
                          label="Bodega"
                        />
                        <q-radio
                          :disable="visualizar"
                          checked-icon="task_alt"
                          v-model="props.row.destino"
                          unchecked-icon="panorama_fish_eye"
                          val="Personal"
                          label="Personal"
                        />
                      </div>
                      <div v-else-if="col.name === 'empleado'">
                        <q-select
                          :disable="visualizar"
                          v-if="props.row.destino == 'Personal'"
                          label="Personal"
                          v-model="props.row.empleado"
                          :options="list_Empleados"
                          hint="Selecciona personal"
                        >
                        </q-select>
                        <q-select
                          :disable="visualizar"
                          v-if="props.row.destino == 'Bodega'"
                          label="Bodega"
                          v-model="props.row.bodega_Destino"
                          :options="listBodega"
                          hint="Selecciona bodega"
                        >
                        </q-select>
                      </div>
                      <div v-else-if="col.name === 'inventario_Id'">
                        <q-btn
                          flat
                          round
                          color="purple-ieen"
                          icon="search"
                          @click="actualizarModalVer(true, col.value)"
                        >
                          <q-tooltip>Ver inventario</q-tooltip>
                        </q-btn>
                        <q-btn
                          v-if="!visualizar"
                          flat
                          round
                          color="purple-ieen"
                          icon="edit_note"
                          @click="agregarObservacion(col.value)"
                        >
                          <q-tooltip
                            >Agregar observación
                            <nav></nav
                          ></q-tooltip>
                        </q-btn>
                        <q-btn
                          v-if="!visualizar"
                          flat
                          round
                          color="purple-ieen"
                          icon="delete"
                          @click="eliminarInventario(props.row.id)"
                        >
                          <q-tooltip>Eliminar</q-tooltip>
                        </q-btn>
                      </div>
                      <label v-else>{{ col.value }}</label>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
            <ModalVerInventario />
          </div>
          <div class="row" v-else-if="tipo == 'Traspaso'">
            <div class="col">
              <q-table
                :rows="list_Traspaso"
                :columns="columnsTraspaso"
                :filter="filter"
                :pagination="pagination"
                row-key="id"
                rows-per-page-label="Filas por pagina"
                no-data-label="No hay registros"
              >
                <template v-slot:top-right>
                  <q-input
                    borderless
                    dense
                    debounce="300"
                    v-model="filter"
                    placeholder="Buscar.."
                  >
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </template>
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                    >
                      <div v-if="col.name === 'empleado'">
                        {{
                          props.row.destino == "Personal"
                            ? col.value
                            : props.row.bodega
                        }}
                      </div>
                      <div v-else-if="col.name === 'inventario_Id'">
                        <q-btn
                          flat
                          round
                          color="purple-ieen"
                          icon="search"
                          @click="actualizarModalVer(true, col.value)"
                        >
                          <q-tooltip>Ver inventario</q-tooltip>
                        </q-btn>
                        <q-btn
                          v-if="!visualizar"
                          flat
                          round
                          color="purple-ieen"
                          icon="delete"
                          @click="
                            eliminarInventario(
                              isEditar ? props.row.id : props.row.inventario_Id
                            )
                          "
                        >
                          <q-tooltip>Ver inventario</q-tooltip>
                        </q-btn>
                      </div>
                      <label v-else>{{ col.value }}</label>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
            <ModalVerInventario />
          </div>
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
                v-if="!visualizar && movimiento.tipo_Movimiento != 'Salida'"
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
  <ModalAddTraspaso
    :destino="destino"
    :tipo_Traspaso_Id="tipo_Traspaso_Id"
    :area_Traspaso="area_Traspaso"
    :personal_Traspaso="personal_Traspaso"
    :bodega_traspaso_Id="bodega_traspaso_Id"
  />
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar, QSpinnerFacebook } from "quasar";
import { useBodegaStore } from "src/stores/bodega_store";
import { useCatalogoProductoStore } from "src/stores/catalogos_producto_store";
import { useInventarioStore } from "src/stores/inventario_store";
import { useProvedores } from "src/stores/provedores_store";
import { onBeforeMount, ref, watch } from "vue";
import { useMovimientoInventario } from "../../../stores/movimiento_inventario";
import TablaMovimientoInventario from "../components/TablaMovimientoInventario.vue";
import ModalVerInventario from "./ModalVerInventario.vue";
import ModalAddTraspaso from "./ModalAddTraspaso.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const movimientoInventarioStore = useMovimientoInventario();
const proveedorStore = useProvedores();
const catalogoStore = useCatalogoProductoStore();
const bodegaStore = useBodegaStore();
const inventarioStore = useInventarioStore();
const {
  modal,
  listTipoMovimientos,
  listConceptoMovimiento,
  isEditar,
  movimiento,
  list_Inventario,
  list_Areas,
  list_Empleados,
  list_Detalle,
  visualizar,
  list_Traspaso,
  list_Inventario_By_Empleado,
  actualizar,
  detalle_Movimiento,
  limpiar,
} = storeToRefs(movimientoInventarioStore);
const catalogosStore = useCatalogoProductoStore();
const { listCatalogo } = storeToRefs(catalogosStore);
const { listBodega } = storeToRefs(bodegaStore);
const tipo_Movimiento = ref(null);
const inventario_Id = ref(null);
const opciones_Inventario = ref([...list_Inventario.value]);
const concepto_Movimiento = ref(null);
const tipo = ref(null);
const tipo_Movimiento_2 = ref(null);
const bodega_Id = ref(null);
const area_Id = ref(null);
const empleado_Id = ref(null);
const observacion = ref(null);
const date = ref(null);
const estado_Fisico = ref(null);
const listEstadoFisicoBaja = ref(["Malo", "Obsoleto", "No requerido en 1 año"]);
const listEstadoFisico = ref(["Bueno", "Regular"]);
const inventario_Asignado_Id = ref(null);
const area_Traspaso = ref(null);
const bodega_traspaso_Id = ref(null);
const destino = ref(null);
const personal_Traspaso = ref(null);
const tipo_Traspaso_Id = ref("Todo");
const list_Tipo_Traspaso = ref(["Todo", "Individual"]);
const opciones_Inventario_Traspaso = ref([]);

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------

watch(limpiar, (val) => {
  if (val == true) {
    limpiarRegistro();
    movimientoInventarioStore.limpiarInf(false);
  }
});

watch(tipo_Traspaso_Id, (val) => {
  if (val != null && !isEditar.value) {
    list_Detalle.value = [];
    list_Traspaso.value = [];
  }
});

watch(tipo_Movimiento, (val) => {
  if (val != null) {
    concepto_Movimiento.value = null;
    observacion.value = null;
    empleado_Id.value = null;
    bodega_Id.value = null;
    list_Detalle.value = [];
    tipo.value = val.label;
    if (isEditar.value == false) {
      movimientoInventarioStore.loadConceptoMovimientoListFiltro(val);
    }
  }
});

watch(concepto_Movimiento, (val) => {
  if (val != null) {
    tipo_Movimiento_2.value = val.label;
  }
});

watch(movimiento.value, (val) => {
  if (val.id != null) {
    cargarTipoMovimiento(val);
    cargarArea(val);
    tipo_Traspaso_Id.value = "Individual";
    date.value = val.fecha_Registro;
  }
});

watch(bodega_Id, async (val) => {
  if (val != null) {
    inventario_Id.value = null;
    await movimientoInventarioStore.loadInventarioByBodega(val.value);
  }
});

watch(area_Id, async (val) => {
  if (val != null) {
    empleado_Id.value = null;
    await movimientoInventarioStore.loadEmpleadosByArea(val.value);
  }
});

watch(area_Traspaso, async (val) => {
  if (val != null) {
    if (!isEditar.value) {
      list_Traspaso.value = [];
      list_Detalle.value = [];
    }
    personal_Traspaso.value = null;
    await movimientoInventarioStore.loadEmpleadosByArea(val.value);
  }
});

watch(empleado_Id, async (val) => {
  if (
    val != null &&
    tipo.value != "Salida" &&
    visualizar.value == false &&
    isEditar.value === false
  ) {
    list_Traspaso.value = [];
    list_Detalle.value = [];
    await movimientoInventarioStore.loadInventarioByEmpleado(val.value);
  } else if (tipo.value == "Traspaso" && val != null) {
    list_Traspaso.value = [];
    list_Detalle.value = [];
    await movimientoInventarioStore.loadInventarioByEmpleado(val.value);
    opciones_Inventario_Traspaso.value = list_Inventario_By_Empleado.value;
  }
});

watch(actualizar, (val) => {
  if (val == true) {
    limpiarRegistro();
    movimientoInventarioStore.limpiarModal(false);
  }
});

//-----------------------------------------------------------

const columnsTraspaso = [
  {
    name: "clave",
    align: "center",
    label: "Clave",
    field: "clave",
    sortable: true,
  },
  {
    name: "destino",
    align: "center",
    label: "Destino",
    field: "destino",
    sortable: false,
  },
  {
    name: "empleado",
    align: "center",
    label: "Asignar a",
    field: "empleado",
    sortable: false,
  },
  {
    name: "inventario_Id",
    align: "center",
    label: "Acciones",
    field: "inventario_Id",
    sortable: false,
  },
];

const columns = [
  {
    name: "clave",
    align: "center",
    label: "Clave",
    field: "clave",
    sortable: true,
  },
  {
    name: "inventario",
    align: "center",
    label: "Inventario",
    field: "inventario",
    sortable: true,
  },
  {
    name: "estado_Fisico",
    align: "center",
    label: "Estado fisico",
    field: "estado_Fisico",
    sortable: true,
  },
  {
    name: "observaciones",
    align: "center",
    label: "Observaciones",
    field: "observaciones",
    sortable: true,
  },
  {
    name: "inventario_Id",
    align: "center",
    label: "Acciones",
    field: "inventario_Id",
    sortable: false,
  },
];

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: "name",
  descending: false,
});

const filter = ref("");

//-----------------------------------------------------------

const obtenerFecha = () => {
  let dateActual = new Date();
  let year = dateActual.getFullYear();
  let month = String(dateActual.getMonth() + 1).padStart(2, "0");
  let day = String(dateActual.getDate()).padStart(2, "0");
  date.value = `${year}/${month}/${day}`;
};

const cargarData = async () => {
  $q.loading.show();
  obtenerFecha();
  await movimientoInventarioStore.loadAreas();
  await inventarioStore.loadListInventario(0);
  await catalogoStore.loadCatalogoListNormal();
  await bodegaStore.loadBodegasList();
  await movimientoInventarioStore.loadTipoMovimientos();
  await proveedorStore.loadInformacionProvedores();
  await catalogoStore.loadCatalogoFiltro();
  $q.loading.hide();
};

const actualizarModalVer = (valor, value) => {
  $q.loading.show();
  movimientoInventarioStore.actualizarVerInventario(valor);
  movimientoInventarioStore.loadInventario(value);
  $q.loading.hide();
};

const cargarArea = async (val) => {
  if (val.area_Id != null) {
    if (area_Id.value == null) {
      let areaFiltrado = list_Areas.value.find(
        (x) => x.value == `${val.area_Id}`
      );
      area_Id.value = areaFiltrado;
      await movimientoInventarioStore.loadEmpleadosByArea(val.area_Id);
      cargarEmpleado(val);
    }
  }
};

const cargarEmpleado = async (val) => {
  if (empleado_Id.value == null) {
    let empleadoFiltrado = list_Empleados.value.find(
      (x) => x.value == `${val.empleado_Id}`
    );
    empleado_Id.value = empleadoFiltrado;
  }
};

const cargarTipoMovimiento = async (val) => {
  if (tipo_Movimiento.value == null) {
    let tipoFiltrado = listTipoMovimientos.value.find(
      (x) => x.value == `${val.tipo_Movimiento_Id}`
    );
    tipo.value = tipoFiltrado.label;
    tipo_Movimiento.value = tipoFiltrado;
    await movimientoInventarioStore.loadConceptoMovimientoListFiltro(
      tipo_Movimiento.value
    );
    cargarConceptoMovimiento(val);
  }
};

const cargarConceptoMovimiento = async (val) => {
  if (concepto_Movimiento.value == null) {
    let conceptoFiltrado = listConceptoMovimiento.value.find(
      (x) => x.value == `${val.concepto_Id}`
    );
    concepto_Movimiento.value = conceptoFiltrado;
  }
};

const actualizarModal = (valor) => {
  limpiarRegistro();
  obtenerFecha();
  movimientoInventarioStore.limpiarInf(true);
  movimientoInventarioStore.updateEditar(false);
  movimientoInventarioStore.updateVisualizar(false);
  movimientoInventarioStore.actualizarModal(valor);
};

const limpiarRegistro = () => {
  tipo.value = null;
  tipo_Movimiento.value = null;
  tipo_Movimiento_2.value = null;
  concepto_Movimiento.value = null;
  observacion.value = null;
  bodega_Id.value = null;
  bodega_traspaso_Id.value = null;
  inventario_Id.value = null;
  tipo.value = null;
  area_Id.value = null;
  empleado_Id.value = null;
  estado_Fisico.value = null;
  area_Traspaso.value = null;
  date.value = null;
  tipo_Traspaso_Id.value = "Todo";
  personal_Traspaso.value = null;
  obtenerFecha();
  movimientoInventarioStore.initMovimiento();
  movimientoInventarioStore.initDetalleMovimiento();
};

const filterInventario = (val, update) => {
  if (val === "") {
    update(() => {
      if (tipo.value == "Traspaso") {
        opciones_Inventario_Traspaso.value = list_Inventario_By_Empleado.value;
      } else {
        opciones_Inventario.value = list_Inventario.value;
      }
    });
    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    if (tipo.value == "Traspaso") {
      opciones_Inventario_Traspaso.value =
        list_Inventario_By_Empleado.value.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
    } else {
      opciones_Inventario.value = list_Inventario.value.filter(
        (v) => v.label.toLowerCase().indexOf(needle) > -1
      );
    }
  });
};

const agregarInventarioTraspasoTodo = async () => {
  if (destino.value == null) {
    $q.dialog({
      title: "Atención",
      message: "El destino no se ha seleccionado",
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
    });
  } else if (
    destino.value == "Personal" &&
    (area_Traspaso.value == null || personal_Traspaso.value == null)
  ) {
    $q.dialog({
      title: "Atención",
      message: "Campos vacios",
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
    });
  } else if (destino.value == "Bodega" && bodega_traspaso_Id.value == null) {
    $q.dialog({
      title: "Atención",
      message: "La bodega destino no se ha seleccionado",
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
    });
  } else {
    if (tipo_Traspaso_Id.value == "Todo") {
      list_Detalle.value.forEach(async (element) => {
        let resp = await movimientoInventarioStore.addInventarioTraspaso(
          element,
          destino.value,
          personal_Traspaso.value,
          bodega_traspaso_Id.value
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
      });
    }
    inventario_Asignado_Id.value = null;
  }
};

const agregarInventarioTraspaso = async () => {
  if (destino.value == null) {
    $q.dialog({
      title: "Atención",
      message: "El destino no se ha seleccionado",
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
    });
  } else if (
    destino.value == "Personal" &&
    (area_Traspaso.value == null || personal_Traspaso.value == null)
  ) {
    $q.dialog({
      title: "Atención",
      message: "Campos vacios",
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
    });
  } else if (destino.value == "Bodega" && bodega_traspaso_Id.value == null) {
    $q.dialog({
      title: "Atención",
      message: "La bodega destino no se ha seleccionado",
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
    });
  } else {
    movimientoInventarioStore.actualizarModalTraspaso(true);
  }
};

const agregarProducto = async () => {
  let filtro = list_Detalle.value.find(
    (x) => x.inventario_Id == inventario_Id.value.value
  );
  if (filtro == undefined) {
    let resp = null;
    if (isEditar.value == true && detalle_Movimiento.value.id == null) {
      detalle_Movimiento.value.movimiento_Inventario_Id = movimiento.value.id;
      detalle_Movimiento.value.inventario_Id = inventario_Id.value.id;
      detalle_Movimiento.value.estado_Fisico = estado_Fisico.value;
      detalle_Movimiento.value.observaciones = observacion.value;
      resp = await movimientoInventarioStore.createDetalleMovimiento(
        detalle_Movimiento.value
      );
    } else {
      resp = await movimientoInventarioStore.addInventario(
        inventario_Id.value,
        observacion.value,
        estado_Fisico.value
      );
    }

    if (resp.success == true) {
      $q.notify({
        position: "top-right",
        type: "positive",
        message: "Se agrego correctamente",
      });
      if (isEditar.value == true) {
        await movimientoInventarioStore.loadDetalleMovimiento(
          movimiento.value.id
        );
      }
    } else {
      $q.notify({
        position: "top-right",
        type: "negative",
        message:
          "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
      });
    }
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
};

const agregarObservacion = (id) => {
  let elemento = list_Detalle.value.findIndex((x) => x.inventario_Id == id);
  $q.dialog({
    title: "Agregar observacion",
    message: "Escribe la observación",
    prompt: {
      model: list_Detalle.value[elemento].observaciones,
      type: "text",
    },
    cancel: true,
    persistent: true,
  }).onOk(async (data) => {
    movimientoInventarioStore.addObservacion(id, data);
    if (isEditar.value == true) {
      let resp = await movimientoInventarioStore.updateDetalleMovimiento(
        list_Detalle.value[elemento]
      );
      if (resp.success) {
        $q.notify({
          position: "top-right",
          type: "positive",
          message: resp.data,
        });
      } else {
        $q.notify({
          position: "top-right",
          type: "negative",
          message: resp.data,
        });
      }
    }
  });
};

const eliminarInventario = async (id) => {
  $q.dialog({
    title: "Eliminar producto",
    message: "¿Está seguro de eliminar el producto del listado?",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "secondary",
      label: "¡Sí!, eliminar",
    },
    cancel: {
      color: "red",
      label: " No Cancelar",
    },
  }).onOk(async () => {
    $q.loading.show();
    let resp = null;
    resp = await movimientoInventarioStore.deleteInventario(
      id,
      tipo_Movimiento.value.label
    );
    $q.loading.hide();
    if (resp.success) {
      $q.notify({
        position: "top-right",
        type: "positive",
        message: resp.data,
      });
      if (isEditar.value == true) {
        await movimientoInventarioStore.loadDetalleMovimiento(
          movimiento.value.id
        );
      }
    } else {
      $q.notify({
        position: "top-right",
        type: "negative",
        message: resp.data,
      });
    }
  });
};

const onSubmit = async () => {
  $q.loading.show();
  let resp = null;
  movimiento.value.tipo_Movimiento_Id = tipo_Movimiento.value.value;

  if (tipo.value == "Entrega Recepción") {
    if (isEditar.value == false) {
      movimiento.value.empleado_Id = empleado_Id.value.value;
      movimiento.value.area_Id = area_Id.value.value;
      movimiento.value.puesto_Id = empleado_Id.value.puesto_Id;
      movimiento.value.detalle = list_Detalle.value;
      movimiento.value.concepto_Id = listConceptoMovimiento.value[0].value;
    }

    for (let index = 0; index < list_Detalle.value.length; index++) {
      const element = list_Detalle.value[index];

      if (typeof element.empleado === "object" && element.empleado != null) {
        element.empleado_Id = element.empleado.value;
      }
      if (
        typeof element.bodega_Destino === "object" &&
        element.bodega_Destino != null
      ) {
        element.bodega_Destino_Id = parseInt(element.bodega_Destino.value);
      } else {
        element.bodega_Destino_Id = element.bodega_Destino_Id;
      }
    }
  } else if (tipo.value == "Traspaso") {
    movimiento.value.empleado_Id = empleado_Id.value.value;
    movimiento.value.area_Id = area_Id.value.value;
    movimiento.value.puesto_Id = empleado_Id.value.puesto_Id;
    movimiento.value.concepto_Id = listConceptoMovimiento.value[0].value;
    movimiento.value.detalle = list_Traspaso.value;
  } else if (tipo.value == "Salida") {
    movimiento.value.detalle = list_Detalle.value;
    movimiento.value.concepto_Id = concepto_Movimiento.value.value;
  }

  if (isEditar.value == true) {
    if (tipo_Movimiento.value.label == "Traspaso") {
      for (var detalle of list_Traspaso.value) {
        resp = await movimientoInventarioStore.updateDetalleMovimiento(detalle);
      }
    } else {
      for (var detalle of list_Detalle.value) {
        resp = await movimientoInventarioStore.updateDetalleMovimiento(detalle);
      }
    }
  } else {
    resp = await movimientoInventarioStore.createMovimiento(movimiento.value);
  }
  if (resp.success) {
    $q.notify({
      position: "top-right",
      type: "positive",
      message: resp.data,
    });
    for (let index = 0; index < listConceptoMovimiento.value.length; index++) {
      const element = listConceptoMovimiento.value[index];
    }
    actualizarModal(false);
    movimientoInventarioStore.initMovimiento();
    movimientoInventarioStore.loadInformacionMovimientos();
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

<style lang="sass">
.my-sticky-header-table
  .q-table__top,
  thead tr:first-child th
    background-color: #DCDADD
</style>
