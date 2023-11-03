<template>
  <q-dialog
    v-model="modalFactura"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 1000px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Asignación de factura</div>
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
        <q-form class="q-col-gutter-xs" @submit="onSubmit">
          <div class="row">
            <q-radio v-model="tipo" val="individual" label="Individual" />
            <q-radio v-model="tipo" val="paquete" label="Paquete" />
          </div>
          <div>
            <div class="text-subtitle2 text-bold" v-show="general">General</div>
            <div class="row" v-if="general">
              <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pr-md">
                <q-input
                  type="number"
                  label="Importe"
                  :lazy-rules="true"
                  :rules="[(val) => !!val || 'El importe es requerido']"
                >
                  <template v-slot:prepend>
                    <q-icon name="$" />
                  </template>
                </q-input>
              </div>
              <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pr-md">
                <q-input
                  label="Número de factura"
                  :lazy-rules="true"
                  :rules="[
                    (val) => !!val || 'El número de factura es requerido',
                  ]"
                >
                </q-input>
              </div>
              <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pr-md">
                <q-input
                  label="UUID"
                  :lazy-rules="true"
                  :rules="[(val) => !!val || 'El UUID es requerido']"
                >
                </q-input>
              </div>
            </div>
            <!------------------------------------------->
            <div v-show="extencion_A" class="text-subtitle2 text-bold">
              Extensión A
            </div>
            <div class="row" v-if="extencion_A">
              <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pr-md">
                <q-input
                  type="number"
                  label="Importe"
                  :lazy-rules="true"
                  :rules="[(val) => !!val || 'El importe es requerido']"
                >
                  <template v-slot:prepend>
                    <q-icon name="$" />
                  </template>
                </q-input>
              </div>
              <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pr-md">
                <q-input
                  label="Número de factura"
                  :lazy-rules="true"
                  :rules="[
                    (val) => !!val || 'El número de factura es requerido',
                  ]"
                >
                </q-input>
              </div>
              <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pr-md">
                <q-input
                  label="UUID"
                  :lazy-rules="true"
                  :rules="[(val) => !!val || 'El UUID es requerido']"
                >
                </q-input>
              </div>
            </div>

            <!------------------------------------------->
            <div v-show="extencion_B" class="text-subtitle2 text-bold">
              Extensión B
            </div>
            <div class="row" v-if="extencion_B">
              <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pr-md">
                <q-input
                  type="number"
                  label="Importe"
                  :lazy-rules="true"
                  :rules="[(val) => !!val || 'El importe es requerido']"
                >
                  <template v-slot:prepend>
                    <q-icon name="$" />
                  </template>
                </q-input>
              </div>
              <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pr-md">
                <q-input
                  label="Número de factura"
                  :lazy-rules="true"
                  :rules="[
                    (val) => !!val || 'El número de factura es requerido',
                  ]"
                >
                </q-input>
              </div>
              <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pr-md">
                <q-input
                  label="UUID"
                  :lazy-rules="true"
                  :rules="[(val) => !!val || 'El UUID es requerido']"
                >
                </q-input>
              </div>
            </div>

            <!------------------------------------------->
            <div v-show="extencion_C" class="text-subtitle2 text-bold">
              Extensión C
            </div>
            <div class="row" v-if="extencion_C">
              <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pr-md">
                <q-input
                  type="number"
                  label="Importe"
                  :lazy-rules="true"
                  :rules="[(val) => !!val || 'El importe es requerido']"
                >
                  <template v-slot:prepend>
                    <q-icon name="$" />
                  </template>
                </q-input>
              </div>
              <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pr-md">
                <q-input
                  label="Número de factura"
                  :lazy-rules="true"
                  :rules="[
                    (val) => !!val || 'El número de factura es requerido',
                  ]"
                >
                </q-input>
              </div>
              <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pr-md">
                <q-input
                  label="UUID"
                  :lazy-rules="true"
                  :rules="[(val) => !!val || 'El UUID es requerido']"
                >
                </q-input>
              </div>
            </div>
          </div>
          <div v-if="tipo == 'individual'">
            <div class="row">
              <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pr-md">
                <q-input
                  type="number"
                  label="Importe"
                  :lazy-rules="true"
                  :rules="[(val) => !!val || 'El importe es requerido']"
                >
                  <template v-slot:prepend>
                    <q-icon name="$" />
                  </template>
                </q-input>
              </div>
              <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pr-md">
                <q-input
                  label="Número de factura"
                  :lazy-rules="true"
                  :rules="[
                    (val) => !!val || 'El número de factura es requerido',
                  ]"
                >
                </q-input>
              </div>
              <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pr-md">
                <q-input
                  label="UUID"
                  :lazy-rules="true"
                  :rules="[(val) => !!val || 'El UUID es requerido']"
                >
                </q-input>
              </div>
            </div>
          </div>

          <div class="col-12 justify-end q-pt-md">
            <q-table
              flat
              bordered
              :rows="listFiltroInventarioFactura"
              :columns="columns"
              row-key="id"
              selection="multiple"
              v-model:selected="selected"
            >
              <template v-slot:top-left v-if="tipo == 'paquete'">
                <q-input v-model="paquete_Id" label="Paquete"> </q-input>
                <q-btn
                  label="Buscar"
                  color="secondary"
                  class="q-ml-sm"
                  @click="buscarPaquete(paquete_Id.value)"
                />
              </template>
              <template v-slot:top-right>
                <div class="text-subtitle2 q-pr-md">Filtrar por fechas</div>
                <q-btn icon="event" round color="purple">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="date" range color="purple">
                      <div class="row items-center justify-end q-gutter-sm">
                        <q-btn
                          label="Cancel"
                          color="primary"
                          flat
                          v-close-popup
                        />
                        <q-btn
                          label="OK"
                          color="primary"
                          flat
                          @click="save"
                          v-close-popup
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-btn>
              </template>
            </q-table>
            <div class="text-right q-pt-md">
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
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useCatalogoProductoStore } from "src/stores/catalogos_producto_store";
import { useInventarioStore } from "src/stores/inventario_store";
import { onBeforeMount, onMounted, ref, watch, watchEffect } from "vue";

const $q = useQuasar();
const inventarioStore = useInventarioStore();
const catalogoStore = useCatalogoProductoStore();
const { modalFactura, listFiltroInventario, listFiltroInventarioFactura } =
  storeToRefs(inventarioStore);
const selected = ref([]);
const catalogoId = ref(null);
const date = ref({});
const paquete_Id = ref(null);
const tipo = ref("individual");
const general = ref(false);
const extencion_A = ref(false);
const extencion_B = ref(false);
const extencion_C = ref(false);

watch(listFiltroInventario, (val) => {
  listFiltroInventarioFactura.value = val;
});

watch(tipo, (val) => {
  general.value = false;
  extencion_A.value = false;
  extencion_B.value = false;
  extencion_C.value = false;
});

const filtrar = (listFiltroInventario, filtro) => {
  listFiltroInventarioFactura.value = listFiltroInventario.filter((item) => {
    let cumple = true;
    if (filtro.date !== undefined) {
      if (filtro.date == "") {
        console.log(item.fecha_Registro);
        cumple = cumple && item.fecha_Registro === item.fecha_Registro;
      } else {
        let from = filtro.date.from.split("/");
        let to = filtro.date.to.split("/");
        let fecha1 = from[2] + "-" + from[1] + "-" + from[0];
        let fecha2 = to[2] + "-" + to[1] + "-" + to[0];
        cumple =
          cumple &&
          item.fecha_Registro >= fecha1 &&
          item.fecha_Registro <= fecha2;
      }
    }
    return cumple;
  });
};

const save = () => {
  const filtro = {};
  if (date.value != {}) filtro.date = date.value;
  filtrar(listFiltroInventario.value, filtro);
};

const columns = [
  {
    name: "paquete_Id",
    align: "center",
    label: "Paquete",
    field: "paquete_Id",
    sortable: true,
  },
  {
    name: "clave",
    align: "center",
    label: "Clave",
    field: "clave",
    sortable: true,
  },
  {
    name: "nombre_corto",
    align: "center",
    label: "Nombre",
    field: "nombre_corto",
    sortable: true,
  },
  {
    name: "marca",
    align: "center",
    label: "Marca",
    field: "marca",
    sortable: true,
  },
  {
    name: "modelo",
    align: "center",
    label: "Modelo",
    field: "modelo",
    sortable: true,
  },
  {
    name: "numero_Serie",
    align: "center",
    label: "Número de serie",
    field: "numero_Serie",
    sortable: true,
  },
  {
    name: "fecha_Registro",
    align: "center",
    label: "Fecha de Registro",
    field: "fecha_Registro",
    sortable: true,
  },
  {
    name: "fecha_compra",
    align: "center",
    label: "Fecha de Compra",
    field: "fecha_compra",
    sortable: true,
  },
  {
    name: "factura",
    align: "center",
    label: "No. Factura",
    field: "factura",
    sortable: true,
  },
  {
    name: "uuid",
    align: "center",
    label: "UUID",
    field: "uuid",
    sortable: true,
  },
  {
    name: "importe",
    align: "center",
    label: "Importe",
    field: "importe",
    sortable: true,
  },
];

// const visible_columns = ["clave", "nombre_corto", "numero_Serie"];

const pagination = ref({
  page: 1,
  rowsPerPage: 25,
  sortBy: "name",
  descending: false,
});

const filter = ref("");

const actualizarModal = async (valor) => {
  $q.loading.show();
  inventarioStore.actualizarModalFactura(valor);
  $q.loading.hide();
};

const onSubmit = async () => {
  console.log("selected", selected.value);
};

const buscarPaquete = () => {
  general.value = false;
  extencion_A.value = false;
  extencion_B.value = false;
  extencion_C.value = false;
  if (paquete_Id.value != null) {
    const result = listFiltroInventario.value.filter(
      (x) => x.paquete_Id == paquete_Id.value
    );
    listFiltroInventarioFactura.value = result;
    validarPaqute();
  }
};

const validarPaqute = () => {
  const elementosGeneral = listFiltroInventarioFactura.value.filter(
    (element) =>
      !element.clave.includes("A") &&
      !element.clave.includes("B") &&
      !element.clave.includes("C")
  );
  if (elementosGeneral.length > 0) general.value = true;
  const elementos_a = listFiltroInventarioFactura.value.filter((element) =>
    element.clave.includes("A")
  );
  if (elementos_a.length > 0) extencion_A.value = true;
  const elementos_b = listFiltroInventarioFactura.value.filter((element) =>
    element.clave.includes("A")
  );
  if (elementos_b.length > 0) extencion_B.value = true;
  const elementos_c = listFiltroInventarioFactura.value.filter((element) =>
    element.clave.includes("C")
  );
  if (elementos_c.length > 0) extencion_C.value = true;
};
</script>

<style></style>
