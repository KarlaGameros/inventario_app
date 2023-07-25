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
        <q-btn flat round dense icon="apps" />
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
            class="text-purple-ieen label-title text-bold"
          >
            <q-item
              v-if="CatalogosConList.some((element) => element == 'SI-CAT-MAR')"
              :to="{ name: 'marcas' }"
              :content-inset-level="2"
              :header-inset-level="2"
            >
              <q-item-section avatar>
                <q-icon name="library_books" color="purple-ieen" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-purple-ieen label-title text-bold"
                  >Marcas</q-item-label
                >
              </q-item-section>
            </q-item>

            <q-item
              v-if="CatalogosConList.some((element) => element == 'SI-CAT-BOD')"
              :to="{ name: 'bodegas' }"
              :content-inset-level="2"
              :header-inset-level="2"
            >
              <q-item-section avatar>
                <q-icon name="warehouse" color="purple-ieen" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-purple-ieen label-title text-bold"
                  >Bodegas</q-item-label
                >
              </q-item-section>
            </q-item>

            <q-item
              v-if="CatalogosConList.some((element) => element == 'SI-CAT-CAT')"
              :to="{ name: 'catalogos' }"
              :content-inset-level="2"
              :header-inset-level="2"
            >
              <q-item-section avatar>
                <q-icon name="list_alt" color="purple-ieen" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-purple-ieen label-title text-bold"
                  >Catálogo de productos</q-item-label
                >
              </q-item-section>
            </q-item>

            <q-item
              v-if="CatalogosConList.some((element) => element == 'SI-CAT-EST')"
              :content-inset-level="2"
              :header-inset-level="2"
              :to="{ name: 'estatus' }"
            >
              <q-item-section avatar>
                <q-icon name="add_box" color="purple-ieen" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-purple-ieen label-title text-bold">
                  Estatus
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-expansion-item>

          <q-item
            v-if="CatalogosConList.some((element) => element == 'SI-CAT-INV')"
            :to="{ name: 'inventario' }"
            :content-inset-level="2"
            :header-inset-level="2"
          >
            <q-item-section avatar>
              <q-icon name="inventory" color="purple-ieen" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-purple-ieen label-title text-bold"
                >Inventario</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-item
            v-if="CatalogosConList.some((element) => element == 'SI-CAT-ASI')"
            :content-inset-level="2"
            :header-inset-level="2"
            :to="{ name: 'asignaciones' }"
          >
            <q-item-section avatar>
              <q-icon name="add_box" color="purple-ieen" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-purple-ieen label-title text-bold">
                Asignaciones
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            v-if="CatalogosConList.some((element) => element == 'SI-MOV-INV')"
            :content-inset-level="2"
            :header-inset-level="2"
            :to="{ name: 'movimiento_inventario' }"
          >
            <q-item-section avatar>
              <q-icon name="add_box" color="purple-ieen" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-purple-ieen label-title text-bold">
                Movimiento Inventario
              </q-item-label>
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
            Bienvenido(a) {{ usuario }}
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

<script>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useAuthStore } from "src/stores/auth_store";
import { defineComponent, onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "MainLayout",

  components: {},

  setup() {
    const leftDrawerOpen = ref(false);
    const $q = useQuasar();
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();
    const usuario = ref("");
    const { modulos, sistemas, apps } = storeToRefs(authStore);
    const CatalogosConList = ref([]);
    const ConsumiblesList = ref([]);
    const SolicitudesList = ref([]);

    onBeforeMount(async () => {
      if (route.query.key) {
        localStorage.setItem("key", route.query.key);
      }

      if (route.query.sistema) {
        localStorage.setItem("sistema", route.query.sistema);
      }

      if (route.query.usr) {
        localStorage.setItem("usuario", route.query.usr);
        usuario.value = localStorage.getItem("usuario");
      } else {
        if (localStorage.getItem("usuario") != null) {
          usuario.value = localStorage.getItem("usuario");
        }
      }
      await loadMenu();
    });

    const show = () => {
      $q.bottomSheet({
        message: "Aplicaciones",
        grid: true,
        actions: apps.value,
      }).onOk((action) => {
        if (action.label == "Cerrar sesión") {
          localStorage.clear();
          window.location = "http://sistema.ieenayarit.org:9171?return=false";
        } else if (action.label == "Ir a universo") {
          window.location = "http://sistema.ieenayarit.org:9171?return=true";
        } else {
          window.location =
            action.url +
            `/#/?key=${localStorage.getItem("key")}&sistema=${
              action.id
            }&usr=${localStorage.getItem("usuario")}`;
        }
      });
    };

    const loadMenu = async () => {
      $q.loading.show();
      await authStore.loadSistemas();
      await authStore.loadModulos();
      await authStore.loadPerfil();
      console.log("modulos", modulos);
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
        }
      });
      $q.loading.hide();
    };

    return {
      leftDrawerOpen,
      CatalogosConList,
      ConsumiblesList,
      SolicitudesList,
      usuario,
      //PruebaReporte,
      show,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
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
