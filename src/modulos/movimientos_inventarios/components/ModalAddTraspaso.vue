<template>
  <q-dialog
    v-model="modalTraspaso"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h5 text-purple-ieen text-bold absolute-center">
          Agregar inventarios
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
            <div class="col-12 q-pb-md">
              <q-select
                color="purple"
                filled
                v-model="catalogo_Id"
                :options="listCatalogoFiltro"
                label="Catálogo"
              />
            </div>
            <div class="col-12">
              <q-select
                color="purple"
                use-chips
                @filter="filterInventario"
                use-input
                filled
                v-model="inventario_Asignado_Id"
                :options="opciones_Inventario_Traspaso"
                label="Inventario"
                hint="Selecciona una inventario"
                multiple
              >
                <template v-slot:before-options>
                  <q-item-section class="q-pl-md">
                    <q-checkbox
                      left-label
                      label="Seleccionar todos"
                      color="green"
                      v-model="seleccionar_Todos"
                    />
                  </q-item-section>
                </template>
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
                label="Cancelar"
                type="reset"
                color="red"
                @click="actualizarModal(false)"
              />
              <q-btn
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
import { useCatalogoProductoStore } from "src/stores/catalogos_producto_store";
import { ref, watch } from "vue";
import { useMovimientoInventario } from "../../../stores/movimiento_inventario";

//-----------------------------------------------------------

const $q = useQuasar();
const movimientoInventarioStore = useMovimientoInventario();
const catalogosStore = useCatalogoProductoStore();
const {
  modalTraspaso,
  list_Inventario_By_Empleado,
  movimiento,
  isEditar,
  detalle_Movimiento,
  list_Traspaso,
} = storeToRefs(movimientoInventarioStore);
const { listCatalogoFiltro } = storeToRefs(catalogosStore);
const inventario_Asignado_Id = ref(null);
const opciones_Inventario_Traspaso = ref([]);
const props = defineProps({
  destino: { type: String },
  tipo_Traspaso_Id: { type: String },
  area_Traspaso: { type: Object },
  personal_Traspaso: { type: Object },
  bodega_traspaso_Id: { type: Object },
});
const catalogo_Id = ref({ value: 0, label: "Todos" });
const list = ref([]);
const seleccionar_Todos = ref(false);

//-----------------------------------------------------------

watch(seleccionar_Todos, (val) => {
  if (val == true) {
    inventario_Asignado_Id.value = opciones_Inventario_Traspaso.value.map(
      (option) => option
    );
  } else {
    inventario_Asignado_Id.value = [];
  }
});

const actualizarModal = (valor) => {
  movimientoInventarioStore.actualizarModalTraspaso(valor);
  inventario_Asignado_Id.value = null;
  seleccionar_Todos.value = false;
  catalogo_Id.value = { value: 0, label: "Todos" };
};

const filterInventario = (val, update) => {
  // if (catalogo_Id.value.label === "Todos") {
  //   update(() => {
  //     // let filteredArray = list_Inventario_By_Empleado.value.filter(
  //     //   (obj1) =>
  //     //     !list_Traspaso.value.some(
  //     //       (obj2) => obj2.inventario_Id === obj1.inventario_Id
  //     //     )
  //     // );
  //     opciones_Inventario_Traspaso.value = list.value;
  //   });
  //   return;
  // }

  update(() => {
    const needle = val.toLowerCase();
    let filteredArray = [];
    if (catalogo_Id.value.value != 0) {
      let filtro = list_Inventario_By_Empleado.value.filter(
        (x) => x.catalago_Id === catalogo_Id.value.value
      );
      filteredArray = filtro.filter(
        (obj1) =>
          !list_Traspaso.value.some(
            (obj2) => obj2.inventario_Id === obj1.inventario_Id
          )
      );
    } else {
      filteredArray = list_Inventario_By_Empleado.value.filter(
        (obj1) =>
          !list_Traspaso.value.some(
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
  if (
    props.destino == "Personal" &&
    (props.area_Traspaso == null || props.personal_Traspaso == null)
  ) {
    $q.dialog({
      title: "Atención",
      message: "Campos vacios",
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
    });
  } else if (
    props.destino == "Bodega" &&
    props.tipo_Traspaso_Id == "Individual" &&
    inventario_Asignado_Id.value == null
  ) {
    $q.dialog({
      title: "Atención",
      message: "Campos vacios",
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
    });
  } else if (props.destino == "Bodega" && props.bodega_traspaso_Id == null) {
    $q.dialog({
      title: "Atención",
      message: "La bodega destino no se ha seleccionado",
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
    });
  } else {
    let resp = null;
    if (isEditar.value == true && detalle_Movimiento.value.id == null) {
      inventario_Asignado_Id.value.forEach(async (element) => {
        let filtro = list_Traspaso.value.find(
          (x) => x.inventario_Id == element.value
        );
        if (filtro == undefined) {
          detalle_Movimiento.value.movimiento_Inventario_Id =
            movimiento.value.id;
          detalle_Movimiento.value.inventario_Id = element.id;
          detalle_Movimiento.value.destino = props.destino;
          detalle_Movimiento.value.empleado_Id =
            props.personal_Traspaso != null
              ? props.personal_Traspaso.value
              : props.personal_Traspaso;
          detalle_Movimiento.value.bodega_Destino_Id =
            props.bodega_traspaso_Id != null
              ? props.bodega_traspaso_Id.value
              : props.bodega_traspaso_Id;
          resp = await movimientoInventarioStore.createDetalleMovimiento(
            detalle_Movimiento.value
          );
        } else {
          $q.dialog({
            title: "Atención",
            message: `El inventario ${element.clave} ya se agrego`,
            icon: "Warning",
            persistent: true,
            transitionShow: "scale",
            transitionHide: "scale",
          });
        }
      });
      await movimientoInventarioStore.loadDetalleMovimiento(
        movimiento.value.id
      );
    } else {
      inventario_Asignado_Id.value.forEach(async (element) => {
        let filtro = list_Traspaso.value.find(
          (x) => x.inventario_Id == element.value
        );
        if (filtro == undefined) {
          resp = await movimientoInventarioStore.addInventarioTraspaso(
            element,
            props.destino,
            props.personal_Traspaso,
            props.bodega_traspaso_Id
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
            message: `El inventario ${element.clave} ya se agrego`,
            icon: "Warning",
            persistent: true,
            transitionShow: "scale",
            transitionHide: "scale",
          });
        }
      });
    }
    inventario_Asignado_Id.value = null;
  }
};
</script>
