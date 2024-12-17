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
          class="text-h6 text-gray-ieen-1 text-bold text-center absolute-center"
        >
          {{ !isEditar ? "REGISTRAR INVENTARIO" : "EDITAR INVENTARIO" }}
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
          <!----------------------------------------------------------------------------->
          <div
            v-if="!isEditar"
            :class="
              radio == 'paquete'
                ? 'col-lg-6 col-md-6 col-sm-12 col-xs-12'
                : radio != 'paquete'
                ? 'col-lg-12 col-md-12 col-sm-12 col-xs-12'
                : 'col-12'
            "
          >
            <q-radio
              color="purple-ieen"
              v-model="radio"
              size="md"
              val="individual"
              label="Individual"
            />
            <q-radio
              color="purple-ieen"
              v-model="radio"
              size="md"
              val="agranel"
              label="Agranel"
            />
            <q-radio
              color="purple-ieen"
              v-model="radio"
              size="md"
              val="paquete"
              label="Paquete"
            />
          </div>
          <div
            v-if="radio == 'paquete'"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-list>
              <q-checkbox
                v-for="item in allTabs"
                :key="item.tab.name"
                tag="label"
                :model-value="item.selected"
                color="purple-ieen"
                @update:model-value="
                  (status) => {
                    setTabSelected(item.tab, status);
                  }
                "
              >
                {{ item.tab.label }}
              </q-checkbox>
            </q-list>
          </div>
          <!----------------------------------------------------------------------------->
          <!--Individual, agranel y paquete-->
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-select
              color="purple-ieen"
              v-model="catalogoId"
              :options="listCatalogo"
              label="Catálogo perteneciente del inventario"
              hint="Selecciona una catalogo"
              :lazy-rules="true"
              :rules="[(val) => !!val || 'El catálogo es requerido']"
            >
            </q-select>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb-5">
            <q-select
              color="purple-ieen"
              v-model="bodegaId"
              :options="listBodega"
              label="Bodega de resguardo"
              hint="Selecciona una bodega"
              lazy-rules
              :rules="[(val) => !!val || 'La bodega es requerida']"
            >
            </q-select>
          </div>
          <div v-if="isEditar" class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              disable
              v-model="inventario.clave"
              label="Clave del producto"
              autogrow
            >
            </q-input>
          </div>
          <div
            v-if="radio != 'paquete'"
            class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
          >
            <q-input
              color="purple-ieen"
              v-model.trim="inventario.descripcion"
              label="Descripción del producto"
              name="descripcion"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'La descripción es requerida']"
            >
            </q-input>
          </div>
          <div
            v-if="radio != 'paquete'"
            class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
          >
            <q-input
              color="purple-ieen"
              v-model.trim="inventario.nombre_corto"
              label="Nombre corto"
              name="nombre_corto"
              autogrow
              lazy-rules
              counter
              maxlength="25"
              :rules="[(val) => !!val || 'La nombre corto es requerido']"
            >
            </q-input>
          </div>
          <div
            v-if="radio != 'paquete'"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-select
              color="purple-ieen"
              v-model="marcaId"
              :options="opcionesMarca"
              label="Marca"
              hint="Selecciona una marca"
              lazy-rules
              use-input
              @filter="buscarMarca"
              :rules="[(val) => !!val || 'La marca es requerida']"
            >
            </q-select>
          </div>
          <div
            v-if="radio != 'paquete'"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-select
              color="purple-ieen"
              v-model="modeloId"
              :options="opcionesModelo"
              label="Modelo"
              hint="Selecciona modelo"
              lazy-rules
              use-input
              @filter="buscarModelo"
              :rules="[(val) => !!val || 'El modelo es requerida']"
            >
            </q-select>
          </div>
          <div
            v-if="radio != 'paquete'"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pb-md"
          >
            <q-input
              v-model.trim="inventario.color"
              label="Color"
              name="color"
              autogrow
            >
            </q-input>
          </div>
          <div
            v-if="radio == 'individual'"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input
              color="purple-ieen"
              v-model="inventario.numero_Serie"
              label="Numero de serie"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'El número de serie es requerido']"
            >
            </q-input>
          </div>
          <div
            v-if="radio != 'individual' && !isEditar"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input
              color="purple-ieen"
              v-model.trim="cantidad"
              label="Cantidad"
              type="number"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'La cantidad es requerida']"
            >
            </q-input>
          </div>
          <div
            v-if="radio != 'paquete'"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pb-md"
          >
            <q-input
              color="purple-ieen"
              type="number"
              v-model.number="inventario.importe"
              label="Importe"
              name="Importe"
              autogrow
            >
              <template v-slot:prepend>
                <q-icon name="$" />
              </template>
            </q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pb-md">
            <q-input
              color="purple-ieen"
              v-model.trim="inventario.numero_factura"
              label="Número de factura"
              name="Número de factura"
            >
            </q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pb-md">
            <q-input
              color="purple-ieen"
              v-model.trim="inventario.uuid"
              label="UUID"
              name="UUID"
            >
            </q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input color="purple-ieen" v-model="date" label="Fecha de compra">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="date" color="purple">
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
          </div>
          <q-card
            v-if="radio != 'paquete'"
            class="col-lg-3 col-md-3 col-sm-3 col-xs-12 my-card"
          >
            <q-file
              accept="image/png, image/jpeg"
              color="purple-ieen"
              v-model="foto1"
              label="Foto 1"
            >
              <template v-slot:prepend>
                <q-icon name="image" />
              </template>
              <template v-slot:append>
                <q-icon
                  v-if="foto1 != null"
                  name="close"
                  @click.stop.prevent="foto1 = null"
                  class="cursor-pointer"
                />
              </template>
            </q-file>
            <img v-if="isEditar" :src="inventario.foto_1" />
          </q-card>
          <q-card
            v-if="radio != 'paquete'"
            class="col-lg-3 col-md-3 col-sm-3 col-xs-12 my-card"
          >
            <q-file
              accept="image/png, image/jpeg"
              color="purple-ieen"
              v-model="foto2"
              label="Foto 2"
            >
              <template v-slot:prepend>
                <q-icon name="image" />
              </template>
              <template v-slot:append>
                <q-icon
                  v-if="foto2 != null"
                  name="close"
                  @click.stop.prevent="foto2 = null"
                  class="cursor-pointer"
                />
              </template>
            </q-file>
            <img v-if="isEditar" :src="inventario.foto_2" />
          </q-card>
          <q-card
            v-if="radio != 'paquete'"
            class="col-lg-3 col-md-3 col-sm-3 col-xs-12 my-card"
          >
            <q-file
              accept="image/png, image/jpeg"
              color="purple-ieen"
              v-model="foto3"
              label="Foto 3"
            >
              <template v-slot:prepend>
                <q-icon name="image" />
              </template>
              <template v-slot:append>
                <q-icon
                  v-if="foto3 != null"
                  name="close"
                  @click.stop.prevent="foto3 = null"
                  class="cursor-pointer"
                />
              </template>
            </q-file>
            <img v-if="isEditar" :src="inventario.foto_3" />
          </q-card>
          <q-card
            v-if="radio != 'paquete'"
            class="col-lg-3 col-md-3 col-sm-3 col-xs-12 my-card"
          >
            <q-file
              accept="image/png, image/jpeg"
              color="purple-ieen"
              v-model="foto4"
              label="Foto 4"
            >
              <template v-slot:prepend>
                <q-icon name="image" />
              </template>
              <template v-slot:append>
                <q-icon
                  v-if="foto4 != null"
                  name="close"
                  @click.stop.prevent="foto4 = null"
                  class="cursor-pointer"
                />
              </template>
            </q-file>
            <img v-if="isEditar" :src="inventario.foto_4" />
          </q-card>
          <!----------------------------------------------------------------------------->
          <div
            v-if="radio == 'paquete'"
            class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
          >
            <q-toolbar
              class="bg-purple-ieen text-white shadow-2 rounded-borders"
            >
              <q-tabs v-model="tab" inline-label shrink stretch>
                <q-tab v-model="tab" name="general">General</q-tab>
                <q-tab v-for="tab in tabs" :key="tab.name" v-bind="tab" />
              </q-tabs>
            </q-toolbar>
            <q-separator />
            <q-tab-panels v-model="tab" animated class="shadow-2">
              <!-- GENERAL -->
              <q-tab-panel name="general" class="row">
                <div class="text-h6">General</div>
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <q-input
                    color="purple-ieen"
                    v-model.trim="inventario.descripcion"
                    label="Descripción del producto"
                    autogrow
                    lazy-rules
                    :rules="[(val) => !!val || 'La descripción es requerida']"
                  >
                  </q-input>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <q-input
                    color="purple-ieen"
                    v-model.trim="inventario.nombre_corto"
                    label="Nombre corto"
                    autogrow
                    counter
                    maxlength="25"
                  >
                  </q-input>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pr-xs">
                  <q-select
                    color="purple-ieen"
                    v-model="marcaId"
                    :options="opcionesMarca"
                    label="Marca"
                    hint="Selecciona una marca"
                    lazy-rules
                    use-input
                    @filter="buscarMarca"
                    :rules="[(val) => !!val || 'La marca es requerida']"
                  >
                  </q-select>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-select
                    color="purple-ieen"
                    v-model="modeloId"
                    :options="opcionesModelo"
                    label="Modelo"
                    hint="Selecciona modelo"
                    use-input
                    lazy-rules
                    @filter="buscarModelo"
                    :rules="[(val) => !!val || 'El modelo es requerida']"
                  >
                  </q-select>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pr-xs">
                  <q-input
                    color="purple-ieen"
                    v-model.trim="inventario.color"
                    label="Color"
                    autogrow
                  >
                  </q-input>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-input
                    color="purple-ieen"
                    type="number"
                    v-model.number="inventario.importe"
                    label="Importe"
                    name="Importe"
                    autogrow
                  >
                    <template v-slot:prepend>
                      <q-icon name="$" />
                    </template>
                  </q-input>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pr-sm">
                  <q-file
                    color="purple-ieen"
                    v-model="foto1"
                    bottom-slots
                    label="Foto 1"
                    accept="image/png, image/jpeg"
                  >
                    <template v-slot:prepend>
                      <q-icon name="image" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="foto1 = null"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-file
                    color="purple-ieen"
                    v-model="foto2"
                    bottom-slots
                    label="Foto 2"
                    accept="image/png, image/jpeg"
                  >
                    <template v-slot:prepend>
                      <q-icon name="image" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="foto2 = null"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pr-sm">
                  <q-file
                    color="purple-ieen"
                    v-model="foto3"
                    bottom-slots
                    label="Foto 3"
                    accept="image/png, image/jpeg"
                  >
                    <template v-slot:prepend>
                      <q-icon name="image" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="foto3 = null"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-file
                    color="purple-ieen"
                    v-model="foto4"
                    bottom-slots
                    label="Foto 4"
                    accept="image/png, image/jpeg"
                  >
                    <template v-slot:prepend>
                      <q-icon name="image" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="foto4 = null"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </div>
                <!-------------------------------------------------------------------------->
                <!-- TABLA NUMERO DE SERIE GENERAL -->
                <div class="q-pa-md">
                  <div v-if="cantidad >= 1" class="col">
                    <table class="default">
                      <tr>
                        <th>No.</th>
                        <th>Número de serie</th>
                      </tr>
                      <tr v-for="(list, index) in listaNumeroSerie" :key="list">
                        <td>{{ list.id }}</td>

                        <td>
                          <q-input
                            :name="`myText${index}`"
                            v-model="list.numero_serie"
                            @keydown.enter.prevent="getFocus(index)"
                          />
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              </q-tab-panel>
              <!-- EXTENSION A -->
              <q-tab-panel name="extension_a" class="row">
                <div class="text-h6">Extensión A</div>
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <q-input
                    color="purple-ieen"
                    v-if="isEditar"
                    v-model.trim="inventario.clave_a"
                    label="Clave del producto"
                    autogrow
                    lazy-rules
                    :rules="[(val) => !!val || 'La clave es requerido']"
                  >
                  </q-input>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <q-input
                    color="purple-ieen"
                    v-model.trim="inventario.descripcion_a"
                    label="Descripción del producto"
                    autogrow
                    lazy-rules
                    :rules="[(val) => !!val || 'La descripción es requerida']"
                  >
                  </q-input>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <q-input
                    color="purple-ieen"
                    v-model.trim="inventario.nombre_corto_a"
                    label="Nombre corto"
                    autogrow
                    lazy-rules
                    counter
                    maxlength="25"
                    :rules="[(val) => !!val || 'La nombre corto es requerido']"
                  >
                  </q-input>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pr-xs">
                  <q-select
                    color="purple-ieen"
                    v-model="marcaId_A"
                    :options="opcionesMarca"
                    label="Marca"
                    hint="Selecciona una marca"
                    lazy-rules
                    use-input
                    @filter="buscarMarca"
                    :rules="[(val) => !!val || 'La marca es requerida']"
                  >
                  </q-select>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-select
                    color="purple-ieen"
                    v-model="modeloId_A"
                    :options="opcionesModelo"
                    label="Modelo"
                    hint="Selecciona modelo"
                    lazy-rules
                    use-input
                    @filter="buscarModelo"
                    :rules="[(val) => !!val || 'El modelo es requerida']"
                  >
                  </q-select>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pr-xs">
                  <q-input
                    color="purple-ieen"
                    v-model.trim="inventario.color_a"
                    label="Color"
                    autogrow
                  >
                  </q-input>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-input
                    color="purple-ieen"
                    type="number"
                    v-model.number="inventario.importe_a"
                    label="Importe"
                    name="Importe"
                  >
                    <template v-slot:prepend>
                      <q-icon name="$" />
                    </template>
                  </q-input>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 q-pr-sm">
                  <q-file
                    color="purple-ieen"
                    v-model="foto1_a"
                    bottom-slots
                    label="Foto 1"
                    accept="image/png, image/jpeg"
                  >
                    <template v-slot:prepend>
                      <q-icon name="image" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="foto1_a = null"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                  <q-file
                    color="purple-ieen"
                    v-model="foto2_a"
                    bottom-slots
                    label="Foto 2"
                    accept="image/png, image/jpeg"
                  >
                    <template v-slot:prepend>
                      <q-icon name="image" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="foto2_a = null"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 q-pr-sm">
                  <q-file
                    color="purple-ieen"
                    v-model="foto3_a"
                    bottom-slots
                    label="Foto 3"
                    accept="image/png, image/jpeg"
                  >
                    <template v-slot:prepend>
                      <q-icon name="image" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="foto3_a = null"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                  <q-file
                    color="purple-ieen"
                    v-model="foto4_a"
                    bottom-slots
                    label="Foto 4"
                    accept="image/png, image/jpeg"
                  >
                    <template v-slot:prepend>
                      <q-icon name="image" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="foto4_a = null"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </div>
                <!-------------------------------------------------------------------------->
                <TablaNumerosSeriesA v-if="cantidad >= 1" />
                <!-------------------------------------------------------------------------->
              </q-tab-panel>
              <!-- EXTENSION B -->
              <q-tab-panel name="extension_b" class="row">
                <div class="text-h6">Extensión B</div>
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <q-input
                    color="purple-ieen"
                    v-if="isEditar"
                    v-model.trim="inventario.clave_b"
                    label="Clave del producto"
                    autogrow
                    lazy-rules
                    :rules="[(val) => !!val || 'La clave es requerido']"
                  >
                  </q-input>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <q-input
                    color="purple-ieen"
                    v-model.trim="inventario.descripcion_b"
                    label="Descripción del producto"
                    autogrow
                    lazy-rules
                    :rules="[(val) => !!val || 'La descripción es requerida']"
                  >
                  </q-input>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <q-input
                    color="purple-ieen"
                    v-model.trim="inventario.nombre_corto_b"
                    label="Nombre corto"
                    autogrow
                    counter
                    maxlength="25"
                    lazy-rules
                    :rules="[(val) => !!val || 'La nombre corto es requerido']"
                  >
                  </q-input>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pr-xs">
                  <q-select
                    color="purple-ieen"
                    v-model="marcaId_B"
                    :options="opcionesMarca"
                    label="Marca"
                    hint="Selecciona una marca"
                    lazy-rules
                    use-input
                    @filter="buscarMarca"
                    :rules="[(val) => !!val || 'La marca es requerida']"
                  >
                  </q-select>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-select
                    color="purple-ieen"
                    v-model="modeloId_B"
                    :options="opcionesModelo"
                    label="Modelo"
                    hint="Selecciona modelo"
                    lazy-rules
                    use-input
                    @filter="buscarModelo"
                    :rules="[(val) => !!val || 'El modelo es requerida']"
                  >
                  </q-select>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pr-xs">
                  <q-input
                    color="purple-ieen"
                    v-model.trim="inventario.color_b"
                    label="Color"
                    autogrow
                  >
                  </q-input>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-input
                    color="purple-ieen"
                    type="number"
                    v-model.number="inventario.importe_b"
                    label="Importe"
                    name="Importe"
                  >
                    <template v-slot:prepend>
                      <q-icon name="$" />
                    </template>
                  </q-input>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 q-pr-sm">
                  <q-file
                    color="purple-ieen"
                    v-model="foto1_b"
                    bottom-slots
                    label="Foto 1"
                    accept="image/png, image/jpeg"
                  >
                    <template v-slot:prepend>
                      <q-icon name="image" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="foto1_b = null"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                  <q-file
                    color="purple-ieen"
                    v-model="foto2_b"
                    bottom-slots
                    label="Foto 2"
                    accept="image/png, image/jpeg"
                  >
                    <template v-slot:prepend>
                      <q-icon name="image" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="foto2_b = null"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 q-pr-sm">
                  <q-file
                    color="purple-ieen"
                    v-model="foto3_b"
                    bottom-slots
                    label="Foto 3"
                    accept="image/png, image/jpeg"
                  >
                    <template v-slot:prepend>
                      <q-icon name="image" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="foto3_b = null"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                  <q-file
                    color="purple-ieen"
                    v-model="foto4_b"
                    bottom-slots
                    label="Foto 4"
                    accept="image/png, image/jpeg"
                  >
                    <template v-slot:prepend>
                      <q-icon name="image" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="foto4_b = null"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </div>
                <!-------------------------------------------------------------------------->
                <TablaNumerosSeriesB v-if="cantidad >= 1" />
                <!-------------------------------------------------------------------------->
              </q-tab-panel>
              <!-- EXTENSION C -->
              <q-tab-panel name="extension_c" class="row">
                <div class="text-h6">Extensión C</div>
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <q-input
                    color="purple-ieen"
                    v-if="isEditar"
                    v-model.trim="inventario.clave_c"
                    label="Clave del producto"
                    autogrow
                    lazy-rules
                    :rules="[(val) => !!val || 'La clave es requerido']"
                  >
                  </q-input>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <q-input
                    color="purple-ieen"
                    v-model.trim="inventario.descripcion_c"
                    label="Descripción del producto"
                    autogrow
                    lazy-rules
                    :rules="[(val) => !!val || 'La descripción es requerida']"
                  >
                  </q-input>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <q-input
                    color="purple-ieen"
                    v-model.trim="inventario.nombre_corto_c"
                    label="Nombre corto"
                    autogrow
                    lazy-rules
                    counter
                    maxlength="25"
                    :rules="[(val) => !!val || 'La nombre corto es requerido']"
                  >
                  </q-input>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pr-xs">
                  <q-select
                    color="purple-ieen"
                    v-model="marcaId_C"
                    :options="opcionesMarca"
                    label="Marca"
                    hint="Selecciona una marca"
                    lazy-rules
                    use-input
                    @filter="buscarMarca"
                    :rules="[(val) => !!val || 'La marca es requerida']"
                  >
                  </q-select>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-select
                    color="purple-ieen"
                    v-model="modeloId_C"
                    :options="opcionesModelo"
                    label="Modelo"
                    hint="Selecciona modelo"
                    lazy-rules
                    use-input
                    @filter="buscarModelo"
                    :rules="[(val) => !!val || 'El modelo es requerida']"
                  >
                  </q-select>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pr-xs">
                  <q-input
                    color="purple-ieen"
                    v-model.trim="inventario.color_c"
                    label="Color"
                    autogrow
                  >
                  </q-input>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-input
                    color="purple-ieen"
                    type="number"
                    v-model.number="inventario.importe_c"
                    label="Importe"
                    name="Importe"
                  >
                    <template v-slot:prepend>
                      <q-icon name="$" />
                    </template>
                  </q-input>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 q-pr-sm">
                  <q-file
                    color="purple-ieen"
                    v-model="foto1_c"
                    bottom-slots
                    label="Foto 1"
                    accept="image/png, image/jpeg"
                  >
                    <template v-slot:prepend>
                      <q-icon name="image" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="foto1_c = null"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                  <q-file
                    color="purple-ieen"
                    v-model="foto2_c"
                    bottom-slots
                    label="Foto 2"
                    accept="image/png, image/jpeg"
                  >
                    <template v-slot:prepend>
                      <q-icon name="image" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="foto2_c = null"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 q-pr-sm">
                  <q-file
                    color="purple-ieen"
                    v-model="foto3_c"
                    bottom-slots
                    label="Foto 3"
                    accept="image/png, image/jpeg"
                  >
                    <template v-slot:prepend>
                      <q-icon name="image" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="foto3_c = null"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                  <q-file
                    color="purple-ieen"
                    v-model="foto4_c"
                    bottom-slots
                    label="Foto 4"
                    accept="image/png, image/jpeg"
                  >
                    <template v-slot:prepend>
                      <q-icon name="image" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="foto4_c = null"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </div>
                <!-------------------------------------------------------------------------->
                <TablaNumerosSeriesC v-if="cantidad >= 1" />
                <!-------------------------------------------------------------------------->
              </q-tab-panel>
            </q-tab-panels>
          </div>
          <!----------------------------------------------------------------------------->
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
                label="Guardar"
                type="submit"
                color="secondary"
                class="q-ml-sm"
              />
            </div>
          </div>
          <!----------------------------------------------------------------------------->
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { computed, onBeforeMount, ref, watch } from "vue";
import { useInventarioStore } from "../../../stores/inventario_store";
import { useCatalogoProductoStore } from "src/stores/catalogos_producto_store";
import { useBodegaStore } from "src/stores/bodega_store";
import { useMarcaStore } from "src/stores/marcas_store";
import { useModeloStore } from "src/stores/modelo_store";
import TablaNumerosSeriesA from "./TablaNumeroSerieA.vue";
import TablaNumerosSeriesB from "./TablaNumeroSerieB.vue";
import TablaNumerosSeriesC from "./TablaNumeroSerieC.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const inventarioStore = useInventarioStore();
const catalogoStore = useCatalogoProductoStore();
const bodegaStore = useBodegaStore();
const marcaStore = useMarcaStore();
const modeloStore = useModeloStore();

//-----------------------------------------------------------

const {
  inventario,
  modal,
  isEditar,
  listaNumeroSerie,
  listaNumeroSerie_a,
  listaNumeroSerie_b,
  listaNumeroSerie_c,
} = storeToRefs(inventarioStore);
const { listCatalogo } = storeToRefs(catalogoStore);
const { listBodega } = storeToRefs(bodegaStore);
const { listMarca } = storeToRefs(marcaStore);
const { listModelo } = storeToRefs(modeloStore);
const opcionesMarca = ref([...listMarca.value]);
const opcionesModelo = ref([...listModelo.value]);
const catalogoId = ref(null);
const bodegaId = ref(null);
const marcaId = ref(null);
const marcaId_A = ref(null);
const marcaId_B = ref(null);
const marcaId_C = ref(null);
const modeloId = ref(null);
const modeloId_A = ref(null);
const modeloId_B = ref(null);
const modeloId_C = ref(null);
const cantidad = ref(null);
const radio = ref("individual");
const date = ref(null);

const foto1 = ref();
const foto2 = ref();
const foto3 = ref();
const foto4 = ref();

const foto1_a = ref();
const foto2_a = ref();
const foto3_a = ref();
const foto4_a = ref();

const foto1_b = ref();
const foto2_b = ref();
const foto3_b = ref();
const foto4_b = ref();

const foto1_c = ref();
const foto2_c = ref();
const foto3_c = ref();
const foto4_c = ref();

const tabsDefinition = [
  { name: "extension_a", label: "Extensión A" },
  { name: "extension_b", label: "Extensión B" },
  { name: "extension_c", label: "Extensión C" },
];
const tabs = ref(tabsDefinition.slice(0, 0));
const tab = ref("general");
const formRefs = ref({
  extension_a: null,
  extension_b: null,
  extension_c: null,
});

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------

watch(marcaId, (val) => {
  if (val != null) {
    loadMarca(val);
  }
});

watch(marcaId_A, (val) => {
  if (val != null) {
    loadMarca(val);
  }
});

watch(marcaId_B, (val) => {
  if (val != null) {
    loadMarca(val);
  }
});

watch(marcaId_C, (val) => {
  if (val != null) {
    loadMarca(val);
  }
});

watch(radio, (val) => {
  if (val != null) {
    limpiar();
  }
});

watch(inventario.value, (val) => {
  if (val.id != null) {
    cargarBodega(val);
    cargarCatalogo(val);
    cargarMarca(val);
    date.value = val.fecha_compra;
  }
});

watch(cantidad, (val) => {
  if (val != null) {
    inventarioStore.addCantidad(cantidad.value, catalogoId);
  }
});

//-----------------------------------------------------------

const cargarData = async () => {
  await bodegaStore.loadBodegasList();
  await catalogoStore.loadCatalogoListNormal();
  await marcaStore.loadMarcaList();
};

const loadMarca = async (marca) => {
  await modeloStore.modeloByMarca(marca.value);
};

//-----------------------------------------------------------

const allTabs = computed(() => {
  return tabsDefinition.map((tab) => ({
    tab,
    selected: tabs.value.indexOf(tab) > -1,
  }));
});

const setTabSelected = (tab, status) => {
  if (status === true) {
    tabs.value.push(tab);
  } else {
    const index = tabs.value.indexOf(tab);
    if (index > -1) {
      tabs.value.splice(index, 1);
    }
  }
};

function getFocus(index) {
  let docu = document.getElementsByName(`myText${index + 1}`);
  docu[0].focus();
}

const buscarMarca = (val, update) => {
  if (val === "") {
    update(() => {
      opcionesMarca.value = listMarca.value;
    });
    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    opcionesMarca.value = listMarca.value.filter(
      (x) => x.label.toLowerCase().indexOf(needle) > -1
    );
  });
};

const buscarModelo = (val, update) => {
  if (val === "") {
    update(() => {
      opcionesModelo.value = listModelo.value;
    });
    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    opcionesModelo.value = listModelo.value.filter(
      (x) => x.label.toLowerCase().indexOf(needle) > -1
    );
  });
};

const cargarBodega = async (val) => {
  if (bodegaId.value == null) {
    let bodegaFiltrado = listBodega.value.find(
      (x) => x.value == `${val.bodega_id}`
    );
    bodegaId.value = bodegaFiltrado;
  }
};

const cargarCatalogo = async (val) => {
  if (catalogoId.value == null) {
    let catalogoFiltrado = listCatalogo.value.find(
      (x) => x.value == `${val.catalogo_id}`
    );
    catalogoId.value = catalogoFiltrado;
  }
};

const cargarMarca = async (val) => {
  if (marcaId.value == null) {
    let marcaFiltrado = listMarca.value.find(
      (x) => x.value == `${val.marca_id}`
    );
    marcaId.value = marcaFiltrado;
    if (marcaFiltrado != undefined) {
      await modeloStore.modeloByMarca(marcaId.value.value);
      cargarModelo(val);
    }
  }
};

const cargarModelo = async (val) => {
  if (modeloId.value == null) {
    let modeloFiltrado = listModelo.value.find(
      (x) => x.value == `${val.modelo_id}`
    );
    modeloId.value = modeloFiltrado;
  }
};

const limpiar = () => {
  catalogoId.value = null;
  bodegaId.value = null;
  marcaId.value = null;
  modeloId.value = null;
  cantidad.value = null;
  foto1.value = null;
  foto2.value = null;
  foto3.value = null;
  foto4.value = null;
  date.value = null;
  inventarioStore.initInventario();
};

const actualizarModal = (valor) => {
  inventarioStore.actualizarModal(valor);
  inventarioStore.updateEditar(false);
  limpiar();
  isEditar.value = false;
  radio.value = "individual";
};

const onSubmit = async () => {
  let inventarioFormData = new FormData();
  let inventarioPaqueteFormData = new FormData();
  let editarInventarioFormData = new FormData();

  if (isEditar.value == true) {
    //--------------------EDITAR--------------------------------------
    editarInventarioFormData.append("Catalago_Id", catalogoId.value.value);
    editarInventarioFormData.append("Estatus_Id", 1);
    editarInventarioFormData.append("Bodega_Id", bodegaId.value.value);
    editarInventarioFormData.append("Marca_Id", marcaId.value.value);
    editarInventarioFormData.append("Modelo_Id", modeloId.value.value);
    editarInventarioFormData.append(
      "Descripcion",
      inventario.value.descripcion
    );
    editarInventarioFormData.append(
      "Nombre_Corto",
      inventario.value.nombre_corto
    );
    editarInventarioFormData.append(
      "Numero_Serie",
      inventario.value.numero_Serie
    );
    editarInventarioFormData.append("Color", inventario.value.color);
    editarInventarioFormData.append("Foto_1", foto1.value);
    editarInventarioFormData.append("Foto_2", foto2.value);
    editarInventarioFormData.append("Foto_3", foto3.value);
    editarInventarioFormData.append("Foto_4", foto4.value);
    if (inventario.value.importe != null)
      editarInventarioFormData.append("Importe", inventario.value.importe);
    if (inventario.value.numero_factura != null)
      editarInventarioFormData.append(
        "Factura",
        inventario.value.numero_factura
      );
    if (inventario.value.uuid != null)
      editarInventarioFormData.append("UUID_Factura", inventario.value.uuid);
    if (date.value != null) {
      editarInventarioFormData.append("Fecha_Compra", date.value);
    }
  } else {
    //--------------------CREAR INDIVIDUAL--------------------------------------
    if (radio.value == "individual") {
      inventarioFormData.append("Catalago_Id", catalogoId.value.value);
      inventarioFormData.append("Estatus_Id", 1);
      inventarioFormData.append("Bodega_Id", bodegaId.value.value);
      inventarioFormData.append("Marca_Id", marcaId.value.value);
      inventarioFormData.append("Modelo_Id", modeloId.value.value);
      inventarioFormData.append("Descripcion", inventario.value.descripcion);
      inventarioFormData.append("Nombre_Corto", inventario.value.nombre_corto);
      inventarioFormData.append("Color", inventario.value.color);
      inventarioFormData.append("Foto_1", foto1.value);
      inventarioFormData.append("Foto_2", foto2.value);
      inventarioFormData.append("Foto_3", foto3.value);
      inventarioFormData.append("Foto_4", foto4.value);
      inventarioFormData.append("Cantidad", cantidad.value);
      inventarioFormData.append("Numero_Serie", inventario.value.numero_Serie);
      if (inventario.value.importe != null) {
        inventarioFormData.append("Importe", inventario.value.importe);
      }
      if (inventario.value.numero_factura != null) {
        inventarioFormData.append("Factura", inventario.value.numero_factura);
      }
      if (inventario.value.uuid != null) {
        inventarioFormData.append("UUID_Factura", inventario.value.uuid);
      }
      if (date.value != null) {
        inventarioFormData.append("Fecha_Compra", date.value);
      }
    } else if (radio.value != "individual") {
      //--------------------CREAR AGRANEL O PAQUETE--------------------------------------
      inventarioPaqueteFormData.append("Catalago_Id", catalogoId.value.value);
      inventarioPaqueteFormData.append("Bodega_Id", bodegaId.value.value);
      inventarioPaqueteFormData.append("General.Marca_Id", marcaId.value.value);
      inventarioPaqueteFormData.append(
        "General.Modelo_Id",
        modeloId.value.value
      );
      inventarioPaqueteFormData.append(
        "General.Descripcion",
        inventario.value.descripcion
      );
      inventarioPaqueteFormData.append(
        "General.Nombre_Corto",
        inventario.value.nombre_corto
      );
      listaNumeroSerie.value.forEach((row) => {
        inventarioPaqueteFormData.append(
          "General.Numeros_Serie[]",
          row.numero_serie
        );
      });
      inventarioPaqueteFormData.append("General.Color", inventario.value.color);
      inventarioPaqueteFormData.append("Cantidad", cantidad.value);
      inventarioPaqueteFormData.append("General.Foto_1", foto1.value);
      inventarioPaqueteFormData.append("General.Foto_2", foto2.value);
      inventarioPaqueteFormData.append("General.Foto_3", foto3.value);
      inventarioPaqueteFormData.append("General.Foto_4", foto4.value);
      if (inventario.value.importe != null) {
        inventarioPaqueteFormData.append(
          "General.Importe",
          inventario.value.importe
        );
      }
      if (inventario.value.numero_factura != null) {
        inventarioPaqueteFormData.append(
          "General.Factura",
          inventario.value.numero_factura
        );
      }
      if (inventario.value.uuid != null) {
        inventarioPaqueteFormData.append(
          "General.UUID_Factura",
          inventario.value.uuid
        );
      }
      if (date.value != null) {
        inventarioPaqueteFormData.append("General.Fecha_Compra", date.value);
      }
      //--------------------EXTENSION A--------------------------------------
      if (marcaId_A.value) {
        inventarioPaqueteFormData.append(
          "Extension_A.Marca_Id",
          marcaId_A.value.value
        );
        inventarioPaqueteFormData.append(
          "Extension_A.Modelo_Id",
          modeloId_A.value.value
        );
        inventarioPaqueteFormData.append(
          "Extension_A.Descripcion",
          inventario.value.descripcion_a
        );
        inventarioPaqueteFormData.append(
          "Extension_A.Nombre_Corto",
          inventario.value.nombre_corto_a
        );
        inventarioPaqueteFormData.append(
          "Extension_A.Color",
          inventario.value.color_a
        );
        listaNumeroSerie_a.value.forEach((row) => {
          inventarioPaqueteFormData.append(
            "Extension_A.Numeros_Serie[]",
            row.numero_serie
          );
        });
        inventarioPaqueteFormData.append("Extension_A.Foto_1", foto1_a.value);
        inventarioPaqueteFormData.append("Extension_A.Foto_2", foto2_a.value);
        inventarioPaqueteFormData.append("Extension_A.Foto_3", foto3_a.value);
        inventarioPaqueteFormData.append("Extension_A.Foto_1", foto4_a.value);
        if (inventario.value.importe_a) {
          inventarioPaqueteFormData.append(
            "Extension_A.Importe",
            inventario.value.importe_a
          );
        }
        if (inventario.value.numero_factura != null) {
          inventarioPaqueteFormData.append(
            "Extension_A.Factura",
            inventario.value.numero_factura
          );
        }
        if (inventario.value.uuid != null) {
          inventarioPaqueteFormData.append(
            "Extension_A.UUID_Factura",
            inventario.value.uuid
          );
        }
        //--------------------EXTENSION B--------------------------------------
        if (marcaId_B.value) {
          inventarioPaqueteFormData.append(
            "Extension_B.Marca_Id",
            marcaId_B.value.value
          );
          inventarioPaqueteFormData.append(
            "Extension_B.Modelo_Id",
            modeloId_B.value.value
          );
          inventarioPaqueteFormData.append(
            "Extension_B.Descripcion",
            inventario.value.descripcion_b
          );
          inventarioPaqueteFormData.append(
            "Extension_B.Nombre_Corto",
            inventario.value.nombre_corto_b
          );
          inventarioPaqueteFormData.append(
            "Extension_B.Color",
            inventario.value.color_b
          );
          listaNumeroSerie_b.value.forEach((row) => {
            inventarioPaqueteFormData.append(
              "Extension_B.Numeros_Serie[]",
              row.numero_serie
            );
          });
          inventarioPaqueteFormData.append("Extension_B.Foto_1", foto1_b.value);
          inventarioPaqueteFormData.append("Extension_B.Foto_2", foto2_b.value);
          inventarioPaqueteFormData.append("Extension_B.Foto_3", foto3_b.value);
          inventarioPaqueteFormData.append("Extension_B.Foto_1", foto4_b.value);
          if (inventario.value.importe_b) {
            inventarioPaqueteFormData.append(
              "Extension_B.Importe",
              inventario.value.importe_b
            );
          }
          if (inventario.value.numero_factura != null) {
            inventarioPaqueteFormData.append(
              "Extension_B.Factura",
              inventario.value.numero_factura
            );
          }
          if (inventario.value.uuid != null) {
            inventarioPaqueteFormData.append(
              "Extension_B.UUID_Factura",
              inventario.value.uuid
            );
          }
        }
        //--------------------EXTENSION C--------------------------------------
        if (marcaId_C.value) {
          inventarioPaqueteFormData.append(
            "Extension_C.Marca_Id",
            marcaId_C.value.value
          );
          inventarioPaqueteFormData.append(
            "Extension_C.Modelo_Id",
            modeloId_C.value.value
          );
          inventarioPaqueteFormData.append(
            "Extension_C.Descripcion",
            inventario.value.descripcion_c
          );
          inventarioPaqueteFormData.append(
            "Extension_C.Nombre_Corto",
            inventario.value.nombre_corto_c
          );
          inventarioPaqueteFormData.append(
            "Extension_C.Color",
            inventario.value.color_c
          );
          listaNumeroSerie_c.value.forEach((row) => {
            inventarioPaqueteFormData.append(
              "Extension_C.Numeros_Serie[]",
              row.numero_serie
            );
          });
          inventarioPaqueteFormData.append("Extension_C.Foto_1", foto1_c.value);
          inventarioPaqueteFormData.append("Extension_C.Foto_2", foto2_c.value);
          inventarioPaqueteFormData.append("Extension_C.Foto_3", foto3_c.value);
          inventarioPaqueteFormData.append("Extension_C.Foto_1", foto4_c.value);
          if (inventario.value.importe_c) {
            inventarioPaqueteFormData.append(
              "Extension_C.Importe",
              inventario.value.importe_c
            );
          }
          if (inventario.value.numero_factura != null) {
            inventarioPaqueteFormData.append(
              "Extension_C.Factura",
              inventario.value.numero_factura
            );
          }
          if (inventario.value.uuid != null) {
            inventarioPaqueteFormData.append(
              "Extension_C.UUID_Factura",
              inventario.value.uuid
            );
          }
        }
      }
    }
  }

  let resp = null;

  $q.loading.show();

  if (isEditar.value == true) {
    resp = await inventarioStore.updateInventario(
      inventario,
      editarInventarioFormData
    );
    //inventarioStore.initInventario();
  } else {
    if (cantidad.value == null && radio.value == "individual") {
      //individual
      resp = await inventarioStore.createInventario(inventarioFormData);
      inventarioStore.initInventario();
    } else if (radio.value != "individual") {
      //paquete y agranel
      try {
        resp = await inventarioStore.createInventarioPaquete(
          inventarioPaqueteFormData
        );
      } catch (error) {
        console.log(error);
      }
    }
  }

  if (resp.success) {
    $q.notify({
      position: "top-right",
      type: "positive",
      message: resp.data,
    });
    actualizarModal(false);
    inventarioStore.initInventario();
    inventarioStore.loadInformacionInventarios();
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

<style scoped>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid #ccc;
  text-align: center;
  padding: 8px;
}
</style>
