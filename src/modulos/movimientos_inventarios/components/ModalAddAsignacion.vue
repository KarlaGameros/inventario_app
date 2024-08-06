<template>
  <q-dialog
    v-model="modalAddAsignacion"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <q-img src="../../../assets/IEEN300.png" width="70px" />
        <div class="text-h6 text-gray-ieen-1 text-bold absolute-center">
          AGREGAR INVENTARIOS
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
          <div class="row">
            <div class="col-12 q-pb-md text-bold">
              <q-select
                color="purple-ieen"
                v-model="catalogo_Id"
                :options="listCatalogosTodos"
                label="Catálogo perteneciente del inventario"
                hint="Seleccione catálogo"
                :lazy-rules="true"
                :rules="[(val) => !!val || 'El catálogo es requerido']"
              />
            </div>
            <div class="col-12">
              <q-select
                color="purple-ieen"
                use-chips
                @filter="filterInventario"
                use-input
                v-model="inventario_Asignado_Id"
                :options="opciones_Inventario_Traspaso"
                label="Inventario"
                hint="Selecciona una inventario"
                multiple
              >
                <template v-slot:option="{ itemProps, selected, opt }">
                  <q-item v-bind="itemProps">
                    <q-item-section>
                      <q-item-label>{{ opt.label }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-icon
                        :name="selected ? 'check_circle' : 'cancel'"
                        :color="selected ? 'green' : 'red'"
                      />
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-space />
          <div class="col-12 justify-end">
            <div class="text-right q-gutter-xs">
              <q-btn
                icon-right="close"
                label="Cancelar"
                type="reset"
                color="red"
                @click="actualizarModal(false)"
              />
              <q-btn
                icon-right="add"
                label="Agregar"
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
import { useAsignacionStore } from "src/stores/asignacion_store";
import { useCatalogoProductoStore } from "src/stores/catalogos_producto_store";
import { useInventarioStore } from "src/stores/inventario_store";
import { ref, watch } from "vue";
import { useMovimientoInventario } from "../../../stores/movimiento_inventario";

//-----------------------------------------------------------

const $q = useQuasar();
const movimientoInventarioStore = useMovimientoInventario();
const catalogosStore = useCatalogoProductoStore();
const asignacionStore = useAsignacionStore();
const inventarioStore = useInventarioStore();
const { listaAsignacionInventario } = storeToRefs(asignacionStore);
const { modalAddAsignacion, movimiento, isEditar, detalle_Movimiento } =
  storeToRefs(movimientoInventarioStore);
const { list_Inventario_By_Catalogo } = storeToRefs(inventarioStore);
const { listCatalogosTodos } = storeToRefs(catalogosStore);
const inventario_Asignado_Id = ref(null);
const opciones_Inventario_Traspaso = ref([]);
const props = defineProps({
  destino: { type: String },
  tipo_Traspaso_Id: { type: String },
  area_Traspaso: { type: Object },
  personal_Traspaso: { type: Object },
  bodega_traspaso_Id: { type: Object },
});
const catalogo_Id = ref(null);

//-----------------------------------------------------------

watch(catalogo_Id, (val) => {
  if (val != null) {
    cargarInventario(val);
  }
});

const cargarInventario = async (val) => {
  await inventarioStore.loadInventarioByCatalogo(val.value);
};

const actualizarModal = (valor) => {
  movimientoInventarioStore.actualizarModalAddAsignacion(valor);
  inventario_Asignado_Id.value = null;
  catalogo_Id.value = null;
};

const filterInventario = (val, update) => {
  update(() => {
    const needle = val.toLowerCase();
    let filteredArray = [];
    if (catalogo_Id.value != null) {
      let filtro = list_Inventario_By_Catalogo.value.filter(
        (x) => x.catalago_Id === catalogo_Id.value.value
      );
      filteredArray = filtro.filter(
        (obj1) =>
          !listaAsignacionInventario.value.some(
            (obj2) => obj2.inventario_Id === obj1.inventario_Id
          )
      );
    }
    opciones_Inventario_Traspaso.value = filteredArray.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
};

const onSubmit = async () => {
  let resp = null;
  if (inventario_Asignado_Id.value == null) {
    $q.notify({
      position: "center",
      type: "warning",
      message: "No seleccionó inventario",
    });
  } else {
    inventario_Asignado_Id.value.forEach(async (element) => {
      let filtro = listaAsignacionInventario.value.find(
        (x) => x.inventario_Id == element.value
      );
      if (filtro == undefined) {
        resp = await asignacionStore.addInventario(null, element);
        if (resp.success == true) {
          actualizarModal(false);
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
        $q.notify({
          position: "center",
          type: "warning",
          message: `El inventario ${element.clave} ya se agrego`,
        });
      }
    });
    inventario_Asignado_Id.value = null;
  }
};
</script>
