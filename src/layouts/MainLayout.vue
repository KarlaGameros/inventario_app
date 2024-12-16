<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-purple-ieen">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> Sistema inventario </q-toolbar-title>
        <q-badge rounded :color="onLine == true ? 'green' : 'red'" />
        <q-btn flat round dense icon="notifications">
          <q-badge v-if="no_notificaciones > 0" color="red" floating>{{
            no_notificaciones > 5 ? "5+" : no_notificaciones
          }}</q-badge>
          <q-menu>
            <q-list style="min-width: 100px">
              <div
                class="q-pl-md q-pt-sm q-pb-sm q-pr-md text-bold text-h6 text-grey-9"
              >
                Notificaciones
              </div>
              <div>
                <q-item
                  style="max-width: 420px"
                  v-for="notificacion in notificaciones"
                  :key="notificacion.id"
                  clickable
                  v-ripple
                  @click="detalle(notificacion)"
                >
                  <q-item-section>
                    <q-item-label>{{ notificacion.titulo }}</q-item-label>
                    <q-item-label caption lines="3"
                      >{{ notificacion.mensaje }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    {{ notificacion.fecha_Registro }}
                    <q-badge
                      v-if="notificacion.leido == false"
                      color="blue"
                      rounded
                      class="q-mr-sm"
                    />
                  </q-item-section>
                </q-item>
              </div>
              <q-card
                class="text-center no-shadow no-border q-pa-sm"
                v-if="notificaciones.length == 0"
              >
                <div class="text-indigo-8 text-purple-ieen">
                  Sin notificaciones
                </div>
              </q-card>
              <q-separator />
              <q-card
                v-if="notificaciones.length > 0"
                class="text-center no-shadow no-border q-pa-sm"
              >
                <q-btn
                  label="Marcar todo como leido"
                  color="purple-ieen"
                  flat
                  class="text-indigo-8"
                  @click="marcarLeido"
                ></q-btn>
                <q-btn
                  flat
                  label="Ver todos"
                  color="purple-ieen"
                  class="text-indigo-8"
                  @click="toNotificaciones"
                ></q-btn>
              </q-card>
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn flat round dense icon="apps" @click="show" />
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="300"
      :breakpoint="1024"
      class="text-black"
    >
      <q-scroll-area
        style="
          height: calc(100% - 150px);
          margin-top: 150px;
          border-right: 1px solid #ddd;
        "
      >
        <q-list>
          <q-expansion-item
            v-if="CatalogosConList.length > 0"
            expand-separator
            icon="menu_book"
            label="Catálogos generales"
            class="text-grey-8 text-bold"
          >
            <q-item
              v-if="CatalogosConList.some((element) => element == 'SI-CAT-MAR')"
              :to="{ name: 'marcas' }"
              :content-inset-level="2"
              :header-inset-level="2"
              class="text-grey-8 text-bold"
              active-class="text-purple-ieen"
            >
              <q-item-section avatar>
                <q-icon name="library_books" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Marcas</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              v-if="CatalogosConList.some((element) => element == 'SI-CAT-BOD')"
              :to="{ name: 'bodegas' }"
              :content-inset-level="2"
              :header-inset-level="2"
              class="text-grey-8 text-bold"
              active-class="text-purple-ieen"
            >
              <q-item-section avatar>
                <q-icon name="warehouse" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Bodegas</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              v-if="CatalogosConList.some((element) => element == 'SI-CAT-CAT')"
              :to="{ name: 'catalogos' }"
              :content-inset-level="2"
              :header-inset-level="2"
              class="text-grey-8 text-bold"
              active-class="text-purple-ieen"
            >
              <q-item-section avatar>
                <q-icon name="list_alt" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Catálogo de productos</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              v-if="CatalogosConList.some((element) => element == 'SI-CAT-PRO')"
              :content-inset-level="2"
              :header-inset-level="2"
              :to="{ name: 'proveedores' }"
              class="text-grey-8 text-bold"
              active-class="text-purple-ieen"
            >
              <q-item-section avatar>
                <q-icon
                  name="groups"
                  class="text-grey-8 text-bold"
                  active-class="text-purple-ieen"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label> Proveedores </q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              v-if="CatalogosConList.some((element) => element == 'SI-CAT-EST')"
              :content-inset-level="2"
              :header-inset-level="2"
              :to="{ name: 'estatus' }"
              class="text-grey-8 text-bold"
              active-class="text-purple-ieen"
            >
              <q-item-section avatar>
                <q-icon name="add_box" />
              </q-item-section>
              <q-item-section>
                <q-item-label> Estatus </q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              v-if="CatalogosConList.some((element) => element == 'SI-TIP-MOV')"
              :content-inset-level="2"
              :header-inset-level="2"
              :to="{ name: 'tipos_Movimientos' }"
              class="text-grey-8 text-bold"
              active-class="text-purple-ieen"
            >
              <q-item-section avatar>
                <q-icon name="move_up" />
              </q-item-section>
              <q-item-section>
                <q-item-label> Tipos de movimientos </q-item-label>
              </q-item-section>
            </q-item>
          </q-expansion-item>
          <q-item
            v-if="CatalogosConList.some((element) => element == 'SI-CAT-INV')"
            :to="{ name: 'inventario' }"
            :content-inset-level="2"
            :header-inset-level="2"
            class="text-grey-8 text-bold"
            active-class="text-purple-ieen"
          >
            <q-item-section avatar>
              <q-icon name="inventory" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Inventario</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            v-if="CatalogosConList.some((element) => element == 'SI-CAT-ASI')"
            :content-inset-level="2"
            :header-inset-level="2"
            :to="{ name: 'asignaciones' }"
            class="text-grey-8 text-bold"
            active-class="text-purple-ieen"
          >
            <q-item-section avatar>
              <q-icon name="edit_square" />
            </q-item-section>
            <q-item-section>
              <q-item-label> Asignaciones </q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            v-if="CatalogosConList.some((element) => element == 'SI-MOV-INV')"
            :content-inset-level="2"
            :header-inset-level="2"
            :to="{ name: 'movimiento_inventario' }"
            class="text-grey-8 text-bold"
            active-class="text-purple-ieen"
          >
            <q-item-section avatar>
              <q-icon name="exit_to_app" />
            </q-item-section>
            <q-item-section>
              <q-item-label> Movimiento Inventario </q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            v-if="CatalogosConList.some((element) => element == 'SI-MI-INV')"
            :content-inset-level="2"
            :header-inset-level="2"
            :to="{ name: 'mi_inventario' }"
            class="text-grey-8 text-bold"
            active-class="text-purple-ieen"
          >
            <q-item-section avatar>
              <q-icon name="content_paste_search" />
            </q-item-section>
            <q-item-section>
              <q-item-label> Mi Inventario </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <q-img
        class="absolute-top"
        src="~assets/FondoIEEN.png"
        style="height: 150px"
      >
        <div class="bg-transparent">
          <div class="text-weight-bold text-black">
            <br />
            Bienvenido(a) <br />{{ usuario }}
          </div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer reveal bordered class="bg-purple-ieen">
      <q-toolbar>
        <q-toolbar-title
          ><div>
            &#169; Unidad Técnica de Informática y Estadística
          </div></q-toolbar-title
        >
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar, QSpinnerFacebook } from "quasar";
import { useAuthStore } from "src/stores/auth_store";
import { onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { EncryptStorage } from "storage-encryption";
import { useNotifications } from "../helpers/signalRService";
import { useNotificacionStore } from "../stores/notificaciones_store";
import { urlSistemas } from "src/boot/axios";

//----------------------------------------------------------

const leftDrawerOpen = ref(false);
const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const notificacionStore = useNotificacionStore();
const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
const { startConnection, onReceiveNotification, onLine } = useNotifications();
const { notificaciones, no_notificaciones, notificaciones_all } =
  storeToRefs(notificacionStore);
const usuario = ref("");
const { modulos, sistemas, apps } = storeToRefs(authStore);
const CatalogosConList = ref([]);

//----------------------------------------------------------

onBeforeMount(async () => {
  if (route.query.key) {
    $q.loading.show({
      spinner: QSpinnerFacebook,
      spinnerColor: "purple-ieen",
      spinnerSize: 140,
      backgroundColor: "purple-3",
      message: "Espere un momento, por favor...",
      messageColor: "black",
    });
    encryptStorage.encrypt("key", route.query.key);
    const resp = await authStore.validarToken(
      route.query.key,
      route.query.sistema
    );
    $q.loading.hide();
    if (resp.success == false) {
      localStorage.clear();
      sessionStorage.clear();
      encryptStorage.remove("key");
      window.location = "http://sistema.ieenayarit.org:9271?return=false";
    }
  }

  if (route.query.sistema) {
    encryptStorage.encrypt("sistema", route.query.sistema);
  }

  if (route.query.usr) {
    encryptStorage.encrypt("usuario", route.query.usr);
    usuario.value = encryptStorage.decrypt("usuario");
  } else {
    if (encryptStorage.decrypt("usuario") != null) {
      usuario.value = encryptStorage.decrypt("usuario");
    }
  }
  await loadMenu();
  await notificacionStore.loadNotificaciones();
  await notificacionStore.loadNotificacionesAll();
  conectar_signalr();
});

const conectar_signalr = async () => {
  await startConnection();
  onReceiveNotification();
};

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const detalle = async (row) => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  let resp = await notificacionStore.leerNotificacion(row.id);
  if (resp.success == true) {
    await notificacionStore.loadNotificaciones();
  }
  let url = sistemas.value.find((x) => x.sistema_Id == row.sistema_Id);
  window.location =
    url.url +
    `/#/?key=${encryptStorage.decrypt("key")}&sistema=${
      row.sistema_Id
    }&usr=${encryptStorage.decrypt("usuario")}`;
  $q.loading.hide();
};

const marcarLeido = async () => {
  let resp = await notificacionStore.leerTodas();
  if (resp.success) {
    $q.notify({
      position: "top-right",
      type: "positive",
      message: resp.data,
      actions: [
        {
          icon: "close",
          color: "white",
          round: true,
          handler: () => {},
        },
      ],
    });
    await notificacionStore.loadNotificaciones();
    await notificacionStore.loadNotificacionesAll();
  } else {
    $q.notify({
      position: "top-right",
      type: "negative",
      message: resp.data,
      actions: [
        {
          icon: "close",
          color: "white",
          round: true,
          handler: () => {},
        },
      ],
    });
  }
};

const toNotificaciones = () => {
  router.push({
    name: "notificaciones",
  });
};

const show = () => {
  $q.bottomSheet({
    message: "Aplicaciones",
    grid: true,
    actions: apps.value,
  }).onOk((action) => {
    if (action.label == "Cerrar sesión") {
      localStorage.clear();
      sessionStorage.clear();
      encryptStorage.remove("key");
      window.location = `${urlSistemas}:9271?return=false`;
    } else if (action.label == "Ir a universo") {
      window.location = `${urlSistemas}:9271?return=true`;
    } else {
      window.location =
        `${urlSistemas}:${action.url.split(":")[2]}` +
        `/#/?key=${encryptStorage.decrypt("key")}&sistema=${
          action.id
        }&usr=${encryptStorage.decrypt("usuario")}`;
    }
  });
};

const loadMenu = async () => {
  $q.loading.show();
  await authStore.loadSistemas();
  await authStore.loadModulos();
  await authStore.loadPerfil();
  modulos.value.forEach((element) => {
    switch (element.siglas_Modulo) {
      case "SI-CAT-BOD":
        CatalogosConList.value.push("SI-CAT-BOD");
        break;
      case "SI-CAT-ASI":
        CatalogosConList.value.push("SI-CAT-ASI");
        break;
      case "SI-CAT-CAT":
        CatalogosConList.value.push("SI-CAT-CAT");
        break;
      case "SI-CAT-EST":
        CatalogosConList.value.push("SI-CAT-EST");
        break;
      case "SI-CAT-INV":
        CatalogosConList.value.push("SI-CAT-INV");
        break;
      case "SI-CAT-MAR":
        CatalogosConList.value.push("SI-CAT-MAR");
        break;
      case "SI-MOV-INV":
        CatalogosConList.value.push("SI-MOV-INV");
        break;
      case "SI-CAT-MOD":
        CatalogosConList.value.push("SI-CAT-MOD");
        break;
      case "SI-MI-INV":
        CatalogosConList.value.push("SI-MI-INV");
        break;
      case "SI-CAT-PRO":
        CatalogosConList.value.push("SI-CAT-PRO");
        break;
      case "SI-ASI-FAC":
        CatalogosConList.value.push("SI-ASI-FAC");
        break;
      case "SI-TIP-MOV":
        CatalogosConList.value.push("SI-TIP-MOV");
        break;
    }
  });
  $q.loading.hide();
};
</script>

<style lang="scss">
.text-purple-ieen {
  color: #673e84 !important;
}
.bg-purple-ieen {
  background: #673e84 !important;
}
.text-purple-ieen-1 {
  color: #863399 !important;
}
.bg-purple-ieen-1 {
  background: #863399 !important;
}
.text-purple-ieen-2 {
  color: #a25eb5 !important;
}
.bg-purple-ieen-2 {
  background: #a25eb5 !important;
}
.text-purple-ieen-3 {
  color: #bb83ca !important;
}
.bg-purple-ieen-3 {
  background: #bb83ca !important;
}
.text-pink-ieen-1 {
  color: #b32572 !important;
}
.bg-pink-ieen-1 {
  background: #b32572 !important;
}
.text-pink-ieen-2 {
  color: #cc5599 !important;
}
.bg-pink-ieen-2 {
  background: #cc5599 !important;
}
.text-pink-ieen-3 {
  color: #dd85ba !important;
}
.bg-pink-ieen-3 {
  background: #dd85ba !important;
}
.text-gray-ieen-1 {
  color: #76777a !important;
}
.bg-gray-ieen-1 {
  background: #76777a !important;
}
.text-gray-ieen-2 {
  color: #98989a !important;
}
.bg-gray-ieen-2 {
  background: #98989a !important;
}
.text-gray-ieen-3 {
  color: #b1b1b1 !important;
}
.bg-gray-ieen-3 {
  background: #b1b1b1 !important;
}
</style>
