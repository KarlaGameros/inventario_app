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
          {{ !isEditar ? "Registrar proveedor" : "Editar proveedor" }}
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
      <q-card-section>
        <q-form class="row q-col-gutter-xs" @submit="onSubmit">
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              v-model.trim="proveedor.nombre"
              label="Nombre del proveedor"
              hint="Ingrese nombre del proveedor"
              autogrow
              lazy-rules
              :rules="[
                (val) => !!val || 'El nombre del proveedor es requerido',
              ]"
            >
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              v-model.trim="proveedor.razon_Social"
              label="Razón social"
              hint="Ingrese razón social del proveedor"
              autogrow
              lazy-rules
              :rules="[
                (val) => !!val || 'La razón social del proveedor es requerido',
              ]"
            >
            </q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model.trim="proveedor.rfc"
              label="RFC"
              hint="Ingrese RFC"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'El RFC es requerido']"
            >
            </q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model.trim="proveedor.telefono"
              label="Teléfono"
              lazy-rules
              :rules="[(val) => !!val || 'El teléfono es requerido']"
              counter
              clearable
              maxlength="10"
            >
              <template v-slot:hint>Ingrese teléfono</template>
            </q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model.trim="email"
              label="Email"
              hint="Ingrese correo electronico"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'El email es requerido']"
            >
            </q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model.trim="proveedor.direccion"
              label="Dirección"
              hint="Ingrese dirección"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'La dirección es requerida']"
            >
            </q-input>
          </div>
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
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useProvedores } from "src/stores/provedores_store";
import { ref, watch } from "vue";

//-----------------------------------------------------------

const $q = useQuasar();
const proveedoresStore = useProvedores();
const { modal, proveedor, isEditar } = storeToRefs(proveedoresStore);
const email = ref(null);

//-----------------------------------------------------------

watch(proveedor.value, (val) => {
  if (val.id != null) {
    cargarEmail(val);
  }
});

//-----------------------------------------------------------
const cargarEmail = async (val) => {
  if (email.value == null) {
    email.value = val.eMail;
  }
};

const actualizarModal = (valor) => {
  proveedoresStore.actualizarModal(valor);
  proveedoresStore.initProvedor();
  email.value = null;
};

const validarEmail = async (email) => {
  const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
  const resultado = regex.test(email);
  return resultado;
};

const onSubmit = async () => {
  let resp = null;
  let respEmail = null;
  $q.loading.show();
  respEmail = await validarEmail(email.value);
  proveedor.value.eMail = email.value;
  if (respEmail == true) {
    if (isEditar.value == true) {
      resp = await proveedoresStore.updateProveedor(proveedor.value);
    } else {
      resp = await proveedoresStore.createProveedor(proveedor.value);
    }

    if (resp.success) {
      $q.notify({
        position: "top-right",
        type: "positive",
        message: resp.data,
      });
      proveedoresStore.loadInformacionProvedores();
      actualizarModal(false);
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
      message: "El email no es valido",
    });
  }
  $q.loading.hide();
};
</script>
