<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 1000px; max-width: 100vw">
      <q-card-section class="row">
        <q-img src="../../../assets/IEEN300.png" width="70px" />
        <div
          class="q-pt-lg text-h6 text-center text-gray-ieen-1 text-bold absolute-center"
        >
          {{ !isEditar ? "REGISTRAR MOVIMIENTO" : "EDITAR MOVIMIENTO" }} <br />
          <p
            v-if="movimiento.estatus != null"
            :class="
              movimiento.estatus == 'Afectado'
                ? 'text-subtile2 text-green'
                : movimiento.estatus == 'Cancelado'
                ? 'text-subtile2 text-red'
                : 'text-subtile2 text-purple-ieen  '
            "
          >
            {{ movimiento.estatus }}
            <q-icon
              :name="
                movimiento.estatus == 'Afectado'
                  ? 'check_circle'
                  : movimiento.estatus == 'Cancelado'
                  ? 'cancel'
                  : 'pending'
              "
              :color="
                movimiento.estatus == 'Afectado'
                  ? 'green'
                  : movimiento.estatus == 'Cancelado'
                  ? 'red'
                  : 'purple-ieen'
              "
            />
          </p>
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
          <div class="row q-col-gutter-lg">
            <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 text-bold">
              <q-select
                color="purple-ieen"
                :disable="isEditar || visualizar"
                v-model="tipo_Movimiento"
                :options="listTipoMovimientos"
                label="Tipo de movimiento"
                hint="Seleccione tipo de movimiento"
                :lazy-rules="true"
                :rules="[
                  (val) => !!val || 'El tipo de movimiento es requerido',
                ]"
              >
              </q-select>
            </div>
            <div
              v-if="
                tipo_Movimiento != null &&
                tipo_Movimiento.label != 'Entrega Recepción'
              "
              class="col-lg-4 col-md-4 col-sm-6 col-xs-12 text-bold"
            >
              <q-select
                color="purple-ieen"
                :disable="isEditar || visualizar"
                v-model="concepto_Movimiento"
                :options="listConceptoMovimiento"
                label="Concepto de movimiento"
                hint="Seleccione concepto"
                :lazy-rules="true"
                :rules="[
                  (val) => !!val || 'El concepto de movimiento es requerido',
                ]"
              >
              </q-select>
            </div>
            <div
              v-if="tipo_Movimiento != null"
              class="col-lg-4 col-md-4 col-sm-6 col-xs-12 text-bold"
            >
              <!-- <q-input
                color="purple-ieen"
                :disable="isEditar || visualizar"
                v-model="date"
                label="Fecha de movimiento"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'La fecha es requerida']"
                hint="Fecha del movimiento"
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
              </q-input> -->
              <q-input
                label="Fecha del movimiento"
                color="purple-ieen"
                v-if="!isEditar"
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
                v-model="movimiento.fecha_Movimiento"
                label="Fecha del movimiento"
              >
              </q-input>
            </div>

            <!--SALIDA-------------------------------------------------->
            <div
              v-if="
                concepto_Movimiento != null &&
                concepto_Movimiento.label == 'Baja'
              "
              class="col-lg-4 col-md-4 col-sm-6 col-xs-12 text-bold"
            >
              <q-input
                color="purple-ieen"
                :disable="visualizar"
                v-model="movimiento.folio_Dictamen_Baja"
                label="Folio dictamen baja"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'El folio es requerido']"
              />
            </div>
            <div
              v-if="
                tipo_Movimiento != null &&
                tipo_Movimiento.label == 'Salida' &&
                concepto_Movimiento != null &&
                !visualizar &&
                !isEditar
              "
              class="col-lg-4 col-md-4 col-sm-6 col-xs-12 text-bold"
            >
              <q-select
                color="purple-ieen"
                :label="
                  concepto_Movimiento.label == 'Baja'
                    ? 'Pendiente Baja'
                    : concepto_Movimiento.label == 'Comodato'
                    ? 'Pendiente Comodato'
                    : 'Pendiente Donación'
                "
                v-model="pendiente_Id"
                :options="list_Movimientos_Pendiente"
                hint="Seleccione traspaso de pendiente baja"
              >
              </q-select>
            </div>

            <!--ENTREGA RECEPCIÓN-------------------------------------------------->
            <div
              v-if="
                tipo_Movimiento != null &&
                tipo_Movimiento.label == 'Entrega Recepción'
              "
              class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-bold"
            >
              <q-select
                color="purple-ieen"
                :disable="isEditar || visualizar"
                label="Área"
                v-model="area_Id"
                :options="list_Areas"
                hint="Seleccione área"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'El área es requerida']"
              >
              </q-select>
            </div>
            <div
              v-if="
                tipo_Movimiento != null &&
                tipo_Movimiento.label == 'Entrega Recepción'
              "
              class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-bold"
            >
              <q-select
                color="purple-ieen"
                :disable="isEditar || visualizar || area_Id == null"
                label="Personal"
                v-model="empleado_Id"
                :options="list_Empleados_Inventario"
                hint="Seleccione personal"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'El personal es requerido']"
              >
              </q-select>
            </div>

            <!--TRASPASO NORMAL-------------------------------------------------->
            <div
              v-if="
                concepto_Movimiento != null &&
                !concepto_Movimiento.label.includes('Pendiente') &&
                concepto_Movimiento.label != 'Traspaso bodegas' &&
                tipo_Movimiento != null &&
                tipo_Movimiento.label == 'Traspaso'
              "
              class="col-lg-4 col-md-4 col-sm-6 col-xs-12 text-bold"
            >
              <q-select
                color="purple-ieen"
                :disable="isEditar || visualizar"
                label="Área"
                v-model="area_Id"
                :options="list_Areas"
                hint="Seleccione área"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'El área es requerida']"
              >
              </q-select>
            </div>
            <div
              v-if="
                concepto_Movimiento != null &&
                !concepto_Movimiento.label.includes('Pendiente') &&
                concepto_Movimiento.label != 'Traspaso bodegas' &&
                concepto_Movimiento.label != 'Reemplazo' &&
                tipo_Movimiento != null &&
                tipo_Movimiento.label == 'Traspaso'
              "
              class="col-lg-4 col-md-4 col-sm-6 col-xs-12 text-bold text-center"
            >
              <q-select
                color="purple-ieen"
                :disable="isEditar || visualizar || area_Id == null"
                label="Personal"
                v-model="empleado_Id"
                :options="list_Empleados_Inventario"
                hint="Seleccione personal"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'El personal es requerido']"
              >
              </q-select>
            </div>
            <div
              v-if="
                concepto_Movimiento != null &&
                !concepto_Movimiento.label.includes('Pendiente') &&
                concepto_Movimiento.label == 'Reemplazo' &&
                tipo_Movimiento != null &&
                tipo_Movimiento.label == 'Traspaso'
              "
              class="col-lg-4 col-md-4 col-sm-6 col-xs-12 text-bold text-center"
            >
              <q-select
                color="purple-ieen"
                :disable="isEditar || visualizar || area_Id == null"
                label="Personal"
                v-model="empleado_Id"
                :options="list_Empleados_Inventario"
                hint="Seleccione personal"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'El personal es requerido']"
              >
              </q-select>
            </div>
            <div
              v-if="
                concepto_Movimiento != null &&
                !concepto_Movimiento.label.includes('Pendiente') &&
                concepto_Movimiento.label == 'Traspaso' &&
                !visualizar &&
                tipo_Movimiento != null &&
                tipo_Movimiento.label == 'Traspaso'
              "
              class="col-lg-6 col-md-6 col-sm-6 col-xs-12 text-bold text-center"
            >
              Tipo de traspaso:
              <q-radio
                color="purple-ieen"
                size="lg"
                checked-icon="task_alt"
                v-model="tipo_Traspaso_Id"
                unchecked-icon="panorama_fish_eye"
                val="Todo"
                label="Todo"
              />
              <q-radio
                color="purple-ieen"
                size="lg"
                checked-icon="task_alt"
                v-model="tipo_Traspaso_Id"
                unchecked-icon="panorama_fish_eye"
                val="Individual"
                label="Individual"
              />
            </div>
            <div
              v-if="
                concepto_Movimiento != null &&
                !concepto_Movimiento.label.includes('Pendiente') &&
                concepto_Movimiento.label == 'Traspaso' &&
                !visualizar &&
                tipo_Movimiento != null &&
                tipo_Movimiento.label == 'Traspaso'
              "
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
            <div
              v-if="
                concepto_Movimiento != null &&
                concepto_Movimiento.label == 'Traspaso' &&
                destino == 'Personal' &&
                !visualizar &&
                tipo_Movimiento != null &&
                tipo_Movimiento.label != 'Salida'
              "
              class="col-lg-6 col-md-6 col-sm-6 col-xs-12 text-bold"
            >
              <q-select
                color="purple-ieen"
                :disable="visualizar"
                label="Área"
                v-model="area_Traspaso"
                :options="list_Areas"
                hint="Seleccione área"
              >
              </q-select>
            </div>
            <div
              v-if="
                concepto_Movimiento != null &&
                concepto_Movimiento.label == 'Traspaso' &&
                destino == 'Personal' &&
                !visualizar &&
                tipo_Movimiento != null &&
                tipo_Movimiento.label != 'Salida'
              "
              class="col-lg-6 col-md-6 col-sm-6 col-xs-12 text-bold"
            >
              <q-select
                color="purple-ieen"
                :disable="visualizar"
                label="Personal"
                v-model="personal_Traspaso"
                :options="list_Empleados"
                hint="Seleccione personal"
              >
              </q-select>
            </div>
            <div
              v-if="
                concepto_Movimiento != null &&
                concepto_Movimiento.label == 'Traspaso' &&
                destino == 'Bodega' &&
                !visualizar &&
                tipo_Movimiento != null &&
                tipo_Movimiento.label != 'Salida'
              "
              class="col-lg-6 col-md-6 col-sm-6 col-xs-12 text-bold"
            >
              <q-select
                color="purple-ieen"
                :disable="visualizar"
                label="Bodega"
                v-model="bodega_traspaso_Id"
                :options="listBodega"
                hint="Seleccione bodega"
              >
              </q-select>
            </div>

            <!--TRASPASO BODEGAS Y CON ESTATUS 'PENDIENTES' -------------------------------------------------->
            <div
              v-if="
                !visualizar &&
                concepto_Movimiento != null &&
                (concepto_Movimiento.label == 'Traspaso bodegas' ||
                  concepto_Movimiento.label.includes('Pendiente'))
              "
              class="col-lg-4 col-md-4 col-sm-4 col-xs-12 text-bold"
            >
              <q-select
                color="purple-ieen"
                label="Bodega origen"
                v-model="bodega_Id"
                :options="listBodega"
                hint="Seleccione bodega origen"
              >
              </q-select>
            </div>
            <div
              v-if="
                concepto_Movimiento != null &&
                concepto_Movimiento.label == 'Traspaso bodegas'
              "
              class="col-lg-4 col-md-4 col-sm-4 col-xs-12 text-bold"
            >
              <q-select
                color="purple-ieen"
                label="Bodega destino"
                v-model="bodega_destino_Id"
                :options="listBodega"
                hint="Seleccione bodega destino"
              >
              </q-select>
            </div>
            <div
              v-if="
                concepto_Movimiento != null &&
                concepto_Movimiento.label != 'Traspaso' &&
                concepto_Movimiento.label != 'Reemplazo' &&
                !visualizar &&
                tipo_Movimiento != null &&
                tipo_Movimiento.label == 'Traspaso'
              "
              class="col-lg-4 col-md-4 col-sm-4 col-xs-12 text-bold"
            >
              <q-select
                color="purple-ieen"
                v-model="inventario_Id"
                :options="opciones_Inventario"
                use-input
                @filter="filterInventario"
                label="Productos"
                hint="Seleccione producto"
              >
              </q-select>
            </div>
            <div
              v-if="
                concepto_Movimiento != null &&
                concepto_Movimiento.label.includes('Pendiente') &&
                !visualizar
              "
              class="col-lg-4 col-md-4 col-sm-4 col-xs-12 text-bold"
            >
              <q-select
                color="purple-ieen"
                v-model="estado_Fisico"
                :options="
                  concepto_Movimiento != null &&
                  concepto_Movimiento.label == 'Pendiente Baja'
                    ? listEstadoFisicoBaja
                    : listEstadoFisico
                "
                label="Estado físico del bien"
                hint="Seleccione estado físico del bien"
              >
              </q-select>
            </div>
            <div
              v-if="
                concepto_Movimiento != null &&
                concepto_Movimiento.label == 'Pendiente Baja' &&
                !visualizar
              "
              class="col-12 text-bold"
            >
              <q-input
                color="purple-ieen"
                v-model="observacion"
                label="Justificación / Observaciones"
                type="textarea"
              />
            </div>

            <!--REEMPLAZO-------------------------------------------------->
            <div
              v-if="
                concepto_Movimiento != null &&
                concepto_Movimiento.label == 'Reemplazo' &&
                !isEditar &&
                !visualizar
              "
              class="col-lg-4 col-md-4 col-sm-6 col-xs-12 text-bold"
            >
              <q-select
                color="purple-ieen"
                label="Bodega"
                v-model="bodega_traspaso_Id"
                :options="listBodega"
                hint="Seleccione bodega"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'La bodega es requerida']"
              >
              </q-select>
            </div>
            <q-space />
            <div
              v-if="
                (concepto_Movimiento != null &&
                  concepto_Movimiento.label == 'Reemplazo' &&
                  !isEditar &&
                  !visualizar) ||
                (tipo_Movimiento != null &&
                  tipo_Movimiento.label != 'Entrega Recepción' &&
                  concepto_Movimiento != null &&
                  concepto_Movimiento.label != 'Reemplazo')
              "
              class="col-12 justify-end"
            >
              <div class="text-right q-gutter-xs">
                <q-btn
                  :disable="
                    isEditar &&
                    concepto_Movimiento != null &&
                    !concepto_Movimiento.label.includes('Pendiente')
                  "
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
          </div>
        </q-card-section>
        <q-card-section>
          <TablaMovimientoInventario
            v-if="
              concepto_Movimiento != null ||
              (tipo_Movimiento != null &&
                tipo_Movimiento.label == 'Entrega Recepción')
            "
            :tipo="tipo_Movimiento"
            :concepto="concepto_Movimiento"
          />
        </q-card-section>
        <q-card-section
          v-if="
            concepto_Movimiento != null &&
            concepto_Movimiento.label == 'Reemplazo' &&
            !isEditar &&
            !visualizar &&
            list_Detalle.length > 0
          "
        >
          <hr style="height: 5px; background-color: #673e84" />
          <div class="q-pt-sm text-h6 text-center text-gray-ieen-1 text-bold">
            ASIGNACIÓN
          </div>
          <div class="row q-col-gutter-lg">
            <div class="col-12 justify-end">
              <div class="text-right q-gutter-xs">
                <q-btn
                  icon-right="add_circle"
                  label="Agregar"
                  color="secondary"
                  class="q-ml-sm"
                  @click="agregarProductoAsignacion"
                />
              </div>
            </div>
            <div class="col-12">
              <q-table
                :rows="listaAsignacionInventario"
                :columns="columns"
                :filter="filter"
                :pagination="pagination"
                row-key="id"
                rows-per-page-label="Filas por pagina"
                no-data-label="No hay registros"
                class="my-sticky-last-column-table"
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
                      <div v-if="col.name === 'id'">
                        <q-btn
                          flat
                          round
                          color="purple-ieen"
                          icon="delete"
                          @click="eliminarInventarioAsignacion(props.row)"
                        >
                          <q-tooltip>Eliminar inventario</q-tooltip>
                        </q-btn>
                      </div>
                      <label
                        v-else-if="col.name == 'clave'"
                        class="text-bold"
                        >{{ col.value }}</label
                      >
                      <label v-else>{{ col.value }}</label>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
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
  <ModalVerInventario />
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
import { useAsignacionStore } from "src/stores/asignacion_store";
import { useMovimientoInventario } from "../../../stores/movimiento_inventario";
import { useEmpleadosStore } from "src/stores/empleados_store";
import TablaMovimientoInventario from "../components/TablaMovimientoInventario.vue";
import ModalVerInventario from "./ModalVerInventario.vue";
import ModalAddTraspaso from "./ModalAddTraspaso.vue";
import ValeResguardo from "../../../helpers/ValeResguardo";

//-----------------------------------------------------------

const $q = useQuasar();
const movimientoInventarioStore = useMovimientoInventario();
const proveedorStore = useProvedores();
const catalogoStore = useCatalogoProductoStore();
const bodegaStore = useBodegaStore();
const inventarioStore = useInventarioStore();
const empleadosStore = useEmpleadosStore();
const asignacionStore = useAsignacionStore();
const {
  modal,
  listTipoMovimientos,
  listConceptoMovimiento,
  isEditar,
  movimiento,
  list_Inventario,
  list_Areas,
  list_Detalle,
  visualizar,
  list_Inventario_By_Empleado,
  detalle_Movimiento,
  list_Movimientos_Pendiente,
} = storeToRefs(movimientoInventarioStore);
const { list_Empleados, list_Empleados_Inventario } =
  storeToRefs(empleadosStore);
const { listBodega } = storeToRefs(bodegaStore);
const { listaAsignacionInventario, asignacion } = storeToRefs(asignacionStore);
const tipo_Movimiento = ref(null);
const inventario_Id = ref(null);
const opciones_Inventario = ref([...list_Inventario.value]);
const concepto_Movimiento = ref(null);
const bodega_Id = ref(null);
const area_Id = ref(null);
const empleado_Id = ref(null);
const observacion = ref(null);
const estado_Fisico = ref(null);
const listEstadoFisicoBaja = ref(["Malo", "Obsoleto", "No requerido en 1 año"]);
const listEstadoFisico = ref(["Bueno", "Regular"]);
const inventario_Asignado_Id = ref(null);
const area_Traspaso = ref(null);
const bodega_traspaso_Id = ref(null);
const bodega_destino_Id = ref(null);
const destino = ref("Personal");
const personal_Traspaso = ref(null);
const tipo_Traspaso_Id = ref("Todo");
const opciones_Inventario_Traspaso = ref([]);
const pendiente_Id = ref(null);
const catalogo_Id = ref(null);
const date = ref(null);

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------

watch(modal, (val) => {
  if (val == true && !isEditar.value && !visualizar.value) {
    limpiarRegistro();
    obtenerFecha();
  }
});

watch(tipo_Traspaso_Id, (val) => {
  if (val != null && !isEditar.value) {
    list_Detalle.value = [];
  }
});

watch(concepto_Movimiento, (val) => {
  if (val != null && !isEditar.value && !visualizar.value) {
    pendiente_Id.value = null;
    observacion.value = null;
    empleado_Id.value = null;
    bodega_Id.value = null;
    bodega_traspaso_Id.value = null;
    area_Traspaso.value = null;
    list_Detalle.value = [];
    cargarMovimientosPendientes(val);
  }
});

watch(tipo_Movimiento, (val) => {
  if (val != null && !isEditar.value && !visualizar.value) {
    concepto_Movimiento.value = null;
    observacion.value = null;
    empleado_Id.value = null;
    bodega_Id.value = null;
    area_Traspaso.value = null;
    list_Detalle.value = [];
    if (isEditar.value == false) {
      movimientoInventarioStore.loadConceptoMovimientoListFiltro(val);
    }
  }
});

watch(movimiento.value, (val) => {
  if (val.id != null) {
    cargarTipoMovimiento(val);
    cargarArea(val);
    tipo_Traspaso_Id.value = "Individual";
    date.value = val.fecha_Movimiento;
  }
});

watch(bodega_Id, (val) => {
  if (val != null) {
    inventario_Id.value = null;
    cargarInventarioByBodega(val.value);
  }
});

watch(area_Id, async (val) => {
  if (val != null) {
    if (!isEditar.value && !visualizar.value) {
      empleado_Id.value = null;
      await empleadosStore.loadEmpleadosByAreaInventario(val.value);
      await empleadosStore.loadEmpleadosByArea(val.value, false);
    }
  }
});

watch(area_Traspaso, async (val) => {
  if (val != null) {
    personal_Traspaso.value = null;
    await empleadosStore.loadEmpleadosByArea(val.value, false);
  }
});

watch(empleado_Id, async (val) => {
  if (
    val != null &&
    tipo_Movimiento.value != null &&
    tipo_Movimiento.value.label == "Entrega Recepción" &&
    visualizar.value == false &&
    isEditar.value === false
  ) {
    //list_Detalle.value = [];
    await movimientoInventarioStore.loadInventarioByEmpleado(val.value);
    list_Detalle.value = list_Inventario_By_Empleado.value;
  } else if (
    tipo_Movimiento.value != null &&
    tipo_Movimiento.value.label == "Traspaso" &&
    val != null
  ) {
    if (!isEditar.value && !visualizar.value) {
      list_Detalle.value = [];
    }
    await movimientoInventarioStore.loadInventarioByEmpleado(val.value);
    opciones_Inventario_Traspaso.value = list_Inventario_By_Empleado.value;
  }
});

watch(catalogo_Id, async (val) => {
  if (val != null) {
    inventario_Id.value = null;
    await inventarioStore.loadInventarioByCatalogo(val.value);
  }
});

//-----------------------------------------------------------

const columns = [
  {
    name: "clave",
    align: "center",
    label: "Clave",
    field: "clave",
    sortable: true,
  },
  {
    name: "descripcion",
    align: "center",
    label: "Descripción",
    field: "descripcion",
    sortable: true,
  },
  {
    name: "observaciones",
    align: "center",
    label: "Observaciones",
    field: "observaciones",
    sortable: false,
  },
  {
    name: "id",
    align: "center",
    label: "Acciones",
    field: "id",
    sortable: true,
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

const cargarMovimientosPendientes = async (val) => {
  await movimientoInventarioStore.loadInformacionMovimientosPendientes(
    val.label
  );
};

const cargarInventarioByBodega = async (id) => {
  if (
    tipo_Movimiento.value != null &&
    tipo_Movimiento.value.label == "Salida"
  ) {
    await movimientoInventarioStore.loadInventarioPendiente(id);
  } else {
    await movimientoInventarioStore.loadInventarioByBodega(id);
  }
};

const obtenerFecha = () => {
  let dateActual = new Date();
  let year = dateActual.getFullYear();
  let month = String(dateActual.getMonth() + 1).padStart(2, "0");
  let day = String(dateActual.getDate()).padStart(2, "0");
  let hours = String(dateActual.getHours());
  let minutes = String(dateActual.getMinutes());
  let seconds = String(dateActual.getSeconds());
  date.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const cargarData = async () => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  obtenerFecha();
  await movimientoInventarioStore.loadTipoMovimientos();
  await movimientoInventarioStore.loadAreas();
  await inventarioStore.loadListInventario(0);
  await catalogoStore.loadCatalogoList(false);
  await catalogoStore.loadCatalogoFiltro();
  await bodegaStore.loadBodegasList();
  await proveedorStore.loadInformacionProvedores();
  $q.loading.hide();
};

const cargarArea = async (val) => {
  if (val.area_Id != null) {
    if (area_Id.value == null) {
      let areaFiltrado = list_Areas.value.find(
        (x) => x.value == `${val.area_Id}`
      );
      area_Id.value = areaFiltrado;

      cargarEmpleado(val);
    }
  }
};

const cargarEmpleado = async (val) => {
  await empleadosStore.loadEmpleadosByArea(val.area_Id, false);
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
  asignacionStore.initAsignacion();
  movimientoInventarioStore.updateEditar(false);
  movimientoInventarioStore.updateVisualizar(false);
  movimientoInventarioStore.actualizarModal(valor);
};

const limpiarRegistro = () => {
  movimientoInventarioStore.initMovimiento();
  movimientoInventarioStore.initDetalleMovimiento();
  pendiente_Id.value = null;
  tipo_Movimiento.value = null;
  concepto_Movimiento.value = null;
  observacion.value = null;
  bodega_Id.value = null;
  bodega_traspaso_Id.value = null;
  inventario_Id.value = null;
  area_Id.value = null;
  empleado_Id.value = null;
  estado_Fisico.value = null;
  area_Traspaso.value = null;
  tipo_Traspaso_Id.value = "Todo";
  personal_Traspaso.value = null;
  bodega_destino_Id.value = null;
};

const filterInventario = (val, update) => {
  if (val === "") {
    update(() => {
      if (
        concepto_Movimiento.value != null &&
        concepto_Movimiento.value.label == "Traspaso"
      ) {
        opciones_Inventario_Traspaso.value = list_Inventario_By_Empleado.value;
      } else {
        opciones_Inventario.value = list_Inventario.value;
      }
    });
    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    if (
      concepto_Movimiento.value != null &&
      concepto_Movimiento.value.label == "Traspaso"
    ) {
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

const agregarProducto = async () => {
  if (concepto_Movimiento.value.label == "Traspaso bodegas") {
    if (bodega_destino_Id.value == null) {
      $q.dialog({
        title: "Atención",
        message: "La bodega destino no se ha seleccionado",
        icon: "Warning",
        persistent: true,
        transitionShow: "scale",
        transitionHide: "scale",
      });
    } else if (inventario_Id.value == null) {
      $q.dialog({
        title: "Atención",
        message: "Campos vacios",
        icon: "Warning",
        persistent: true,
        transitionShow: "scale",
        transitionHide: "scale",
      });
    } else {
      let filtro = list_Detalle.value.find(
        (x) => x.inventario_Id == inventario_Id.value.value
      );
      if (filtro == undefined) {
        let resp = await movimientoInventarioStore.addInventario(
          inventario_Id.value,
          "",
          null,
          "Bodega",
          empleado_Id.value,
          bodega_destino_Id.value
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
        $q.dialog({
          title: "Atención",
          message: "El producto ya se agrego",
          icon: "Warning",
          persistent: true,
          transitionShow: "scale",
          transitionHide: "scale",
        });
      }
      inventario_Id.value = null;
    }
  } else if (
    concepto_Movimiento.value.label == "Traspaso" &&
    tipo_Traspaso_Id.value == "Individual"
  ) {
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
  } else if (
    concepto_Movimiento.value.label == "Traspaso" &&
    tipo_Traspaso_Id.value == "Todo"
  ) {
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
      list_Inventario_By_Empleado.value.forEach(async (element) => {
        let filtro = list_Detalle.value.find(
          (x) => x.inventario_Id == element.inventario_Id
        );
        if (filtro == undefined) {
          let resp = null;
          if (isEditar.value == true && detalle_Movimiento.value.id == null) {
            detalle_Movimiento.value.movimiento_Inventario_Id =
              movimiento.value.id;
            detalle_Movimiento.value.inventario_Id = element.inventario_Id;
            detalle_Movimiento.value.estado_Fisico = estado_Fisico.value;
            detalle_Movimiento.value.observaciones = observacion.value;
            // resp = await movimientoInventarioStore.createDetalleMovimiento(
            //   detalle_Movimiento.value
            // );
          } else {
            resp = await movimientoInventarioStore.addInventario(
              element,
              "",
              "",
              destino.value,
              personal_Traspaso.value,
              bodega_traspaso_Id.value
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
          $q.notify({
            position: "top-right",
            type: "warning",
            message: "El producto ya se agrego",
          });
        }
      });

      inventario_Asignado_Id.value = null;
    }
  } else if (concepto_Movimiento.value.label.includes("Pendiente")) {
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
  } else if (tipo_Movimiento.value.label == "Salida") {
    await movimientoInventarioStore.loadDetalleMovimiento(
      pendiente_Id.value.value
    );
  } else if (concepto_Movimiento.value.label == "Reemplazo") {
    if (area_Id.value == null) {
      $q.dialog({
        title: "Atención",
        message: "El área es requerida",
        icon: "Warning",
        persistent: true,
        transitionShow: "scale",
        transitionHide: "scale",
      });
    } else if (empleado_Id.value == null) {
      $q.dialog({
        title: "Atención",
        message: "El personal es requerido",
        icon: "Warning",
        persistent: true,
        transitionShow: "scale",
        transitionHide: "scale",
      });
    } else if (bodega_traspaso_Id.value == null) {
      $q.dialog({
        title: "Atención",
        message: "La bodega destino es requerida",
        icon: "Warning",
        persistent: true,
        transitionShow: "scale",
        transitionHide: "scale",
      });
    } else {
      destino.value = "Bodega";
      movimientoInventarioStore.actualizarModalTraspaso(true);
    }
  }
};

const agregarProductoAsignacion = () => {
  movimientoInventarioStore.actualizarModalAddAsignacion(true);
};

const eliminarInventarioAsignacion = (row) => {
  $q.dialog({
    title: "Eliminar producto",
    message: "¿Está seguro de eliminar el producto del listado?",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      icon: "delete",
      color: "secondary",
      label: "¡Sí!, eliminar",
    },
    cancel: {
      icon: "close",
      color: "red",
      label: " No Cancelar",
    },
  }).onOk(async () => {
    $q.loading.show();
    let resp = null;
    resp = await asignacionStore.deleteProducto(id);
    $q.loading.hide();
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "positive",
        message: resp.data,
      });
    } else {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "negative",
        message: resp.data,
      });
    }
  });
};

const onSubmit = async () => {
  $q.dialog({
    title: "Atención",
    message:
      "¿Está seguro de guardar el movimiento con la información proporcionada?",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "secondary",
      label: "¡Sí!, guardar",
    },
    cancel: {
      color: "red",
      label: "No, regresar",
    },
  }).onOk(async () => {
    $q.loading.show({
      spinner: QSpinnerFacebook,
      spinnerColor: "purple-ieen",
      spinnerSize: 140,
      backgroundColor: "purple-3",
      message: "Espere un momento, por favor...",
      messageColor: "black",
    });
    let resp = null;
    movimiento.value.tipo_Movimiento_Id = tipo_Movimiento.value.value;
    movimiento.value.fecha_Movimiento = date.value;
    if (
      tipo_Movimiento.value != null &&
      tipo_Movimiento.value.label == "Entrega Recepción"
    ) {
      if (isEditar.value == false) {
        movimiento.value.empleado_Id = empleado_Id.value.value;
        movimiento.value.area_Id = area_Id.value.value;
        movimiento.value.puesto_Id = empleado_Id.value.puesto_Id;
        movimiento.value.detalle = list_Detalle.value;
        movimiento.value.concepto_Id = listConceptoMovimiento.value[0].value;
      }
      for (let index = 0; index < list_Detalle.value.length; index++) {
        const element = list_Detalle.value[index];

        if (
          element.destino == "Personal" &&
          typeof element.empleado === "object" &&
          element.empleado != null
        ) {
          element.empleado_Id = element.empleado.value;
          element.bodega_Destino_Id = null;
        } else if (
          element.destino == "Bodega" &&
          typeof element.bodega_Destino === "object" &&
          element.bodega_Destino != null
        ) {
          element.bodega_Destino_Id = parseInt(element.bodega_Destino.value);
          element.empleado_Id = null;
        } else {
          element.bodega_Destino_Id = element.bodega_Destino_Id;
        }
      }
    } else if (
      tipo_Movimiento.value != null &&
      tipo_Movimiento.value.label == "Traspaso"
    ) {
      if (concepto_Movimiento.value.label == "Traspaso") {
        movimiento.value.empleado_Id = empleado_Id.value.value;
        movimiento.value.area_Id = area_Id.value.value;
        movimiento.value.puesto_Id = empleado_Id.value.puesto_Id;
        movimiento.value.detalle = list_Detalle.value;
      } else if (concepto_Movimiento.value.label == "Reemplazo") {
        movimiento.value.empleado_Id = empleado_Id.value.value;
        movimiento.value.area_Id = area_Id.value.value;
        movimiento.value.puesto_Id = empleado_Id.value.puesto_Id;
        movimiento.value.detalle = list_Detalle.value;
        asignacion.value.puesto_Id = empleado_Id.value.puesto_Id;
        asignacion.value.empleado_Id = empleado_Id.value.value;
        asignacion.value.detalle = listaAsignacionInventario.value;
        asignacion.value.area_Id = area_Id.value.value;
        asignacion.value.eliminado = false;
        asignacion.value.tipo = "Personal";
        asignacion.value.fecha_Asignacion = date.value;
      } else {
        movimiento.value.detalle = list_Detalle.value;
      }

      movimiento.value.concepto_Id = concepto_Movimiento.value.value;
    } else if (
      tipo_Movimiento.value != null &&
      tipo_Movimiento.value.label == "Salida"
    ) {
      movimiento.value.detalle = list_Detalle.value;
      movimiento.value.concepto_Id = concepto_Movimiento.value.value;
    }

    if (isEditar.value == true) {
      if (tipo_Movimiento.value.label == "Traspaso") {
        for (var detalle of list_Detalle.value) {
          resp = await movimientoInventarioStore.updateDetalleMovimiento(
            detalle
          );
        }
      } else {
        for (var detalle of list_Detalle.value) {
          resp = await movimientoInventarioStore.updateDetalleMovimiento(
            detalle
          );
        }
      }
    } else {
      resp = await movimientoInventarioStore.createMovimiento(movimiento.value);
    }
    if (resp.success) {
      if (
        tipo_Movimiento.value != null &&
        tipo_Movimiento.value.label == "Traspaso" &&
        concepto_Movimiento.value != null &&
        concepto_Movimiento.value.label == "Reemplazo"
      ) {
        let respAfectarMov = await movimientoInventarioStore.afectarMovimiento(
          resp.id,
          tipo_Movimiento.value.label
        );
        await movimientoInventarioStore.loadMovimiento(resp.id);

        let respAsignacion = await asignacionStore.createAsignacion(
          asignacion.value
        );
        if (respAsignacion.success == true) {
          $q.notify({
            position: "top-right",
            type: "positive",
            message: respAsignacion.data,
          });
          let respAfectar = await asignacionStore.afectarAsignacion(
            respAsignacion.id
          );
          if (respAfectar.success) {
            await asignacionStore.loadAsignacion(respAsignacion.id);
            await asignacionStore.detalleAsignacion(respAsignacion.id);
            let respVale = await ValeResguardo();
            if (respVale.success == true) {
              asignacionStore.initAsignacion();
            }
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
        } else {
          $q.notify({
            position: "top-right",
            type: "negative",
            message: respAsignacion.data,
          });
        }
      }
      $q.notify({
        position: "top-right",
        type: "positive",
        message: resp.data,
      });
      actualizarModal(false);
      movimientoInventarioStore.loadInformacionMovimientos();
    } else {
      $q.notify({
        position: "top-right",
        type: "negative",
        message: resp.data,
      });
    }
    $q.loading.hide();
  });
};
</script>
<style lang="sass">
.my-sticky-last-column-table
  thead tr:last-child th:last-child
    /* bg color is important for th; just specify one */
    background-color: white

  td:last-child
    background-color: white

  th:last-child,
  td:last-child
    position: sticky
    right: 0
    z-index: 1
</style>
