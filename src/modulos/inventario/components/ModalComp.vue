<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Registro de inventario</div>
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
        <q-form @submit="onSubmit" class="row q-col-gutter-xs">
          <!----------------------------------------------------------------------------->

          <div
            v-if="radio == 'paquete'"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-radio
              v-model="radio"
              size="md"
              val="individual"
              label="Individual"
            />
            <q-radio v-model="radio" size="md" val="agranel" label="Agranel" />
            <q-radio v-model="radio" size="md" val="paquete" label="Paquete" />
          </div>
          <div
            v-if="radio != 'paquete'"
            class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
          >
            <q-radio
              v-model="radio"
              size="md"
              val="individual"
              label="Individual"
            />
            <q-radio v-model="radio" size="md" val="agranel" label="Agranel" />
            <q-radio v-model="radio" size="md" val="paquete" label="Paquete" />
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
              v-model="bodegaId"
              :options="listBodega"
              label="Bodega de resguardo"
              hint="Selecciona una bodega"
              lazy-rules
              :rules="[(val) => !!val || 'La bodega es requerida']"
            >
            </q-select>
          </div>

          <div
            v-if="radio == 'paquete'"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input
              v-model.trim="cantidad"
              label="Cantidad"
              type="number"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'La cantidad es requerida']"
            >
            </q-input>
          </div>

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
              <q-tab-panel name="general">
                <div class="text-h6">General</div>

                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <q-input
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
                    v-model.trim="inventario.nombre_corto"
                    label="Nombre corto"
                    autogrow
                    lazy-rules
                    :rules="[(val) => !!val || 'La nombre corto es requerido']"
                  >
                  </q-input>
                </div>

                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-select
                    v-model="marcaId"
                    :options="listMarca"
                    label="Marca"
                    hint="Selecciona una marca"
                    lazy-rules
                    :rules="[(val) => !!val || 'La marca es requerida']"
                  >
                  </q-select>
                </div>

                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-select
                    v-model="modeloId"
                    :options="listModelo"
                    label="Modelo"
                    hint="Selecciona modelo"
                    lazy-rules
                    :rules="[(val) => !!val || 'El modelo es requerida']"
                  >
                  </q-select>
                </div>

                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-input
                    v-model.trim="inventario.color"
                    label="Color"
                    autogrow
                    lazy-rules
                    :rules="[(val) => !!val || 'El color es requerido']"
                  >
                  </q-input>
                </div>

                <!-------------------------------------------------------------------------->
                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                  <q-file
                    v-model="foto1"
                    filled
                    bottom-slots
                    label="Foto 1"
                    counter
                    accept="image/png, image/jpeg"
                  >
                    <template v-slot:prepend>
                      <q-icon name="cloud_upload" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="files = null"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </div>

                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                  <q-file
                    v-model="foto2"
                    filled
                    bottom-slots
                    label="Foto 2"
                    counter
                    accept="image/png, image/jpeg"
                  >
                    <template v-slot:prepend>
                      <q-icon name="cloud_upload" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="files = null"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </div>

                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                  <q-file
                    v-model="foto3"
                    filled
                    bottom-slots
                    label="Foto 3"
                    counter
                    accept="image/png, image/jpeg"
                  >
                    <template v-slot:prepend>
                      <q-icon name="cloud_upload" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="files = null"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </div>

                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                  <q-file
                    v-model="foto4"
                    filled
                    bottom-slots
                    label="Foto 4"
                    counter
                    accept="image/png, image/jpeg"
                  >
                    <template v-slot:prepend>
                      <q-icon name="cloud_upload" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="files = null"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </div>

                <!-------------------------------------------------------------------------->

                <div class="col">
                  <q-table
                    :rows="listaNumeroSerie"
                    :columns="columns"
                    row-key="name"
                    :rows-per-page-options="[]"
                  >
                    <template v-slot:body="props">
                      <q-tr :props="props">
                        <q-td key="numero_serie" :props="props">
                          {{ props.row.numero_serie }}
                          <q-popup-edit
                            v-model.number="props.row.numero_serie"
                            buttons
                            persistent
                            auto-save
                            v-slot="scope"
                          >
                            <q-input
                              type="number"
                              v-model.number="scope.value"
                              dense
                              autofocus
                              @keyup.enter="scope.set"
                            />
                          </q-popup-edit>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </div>
              </q-tab-panel>

              <!---------------------------------------------------------------->

              <q-tab-panel name="extencion_a">
                <div class="text-h6">Extención A</div>
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <q-input
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
                    v-model.trim="inventario.nombre_corto_a"
                    label="Nombre corto"
                    autogrow
                    lazy-rules
                    :rules="[(val) => !!val || 'La nombre corto es requerido']"
                  >
                  </q-input>
                </div>

                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-select
                    v-model="marcaId_A"
                    :options="listMarca"
                    label="Marca"
                    hint="Selecciona una marca"
                    lazy-rules
                    :rules="[(val) => !!val || 'La marca es requerida']"
                  >
                  </q-select>
                </div>

                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-select
                    v-model="modeloId_A"
                    :options="listModelo"
                    label="Modelo"
                    hint="Selecciona modelo"
                    lazy-rules
                    :rules="[(val) => !!val || 'El modelo es requerida']"
                  >
                  </q-select>
                </div>

                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-input
                    v-model.trim="inventario.color_a"
                    label="Color"
                    autogrow
                    lazy-rules
                    :rules="[(val) => !!val || 'El color es requerido']"
                  >
                  </q-input>
                </div>

                <!-------------------------------------------------------------------------->
                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                  <q-file
                    v-model="foto1_a"
                    filled
                    bottom-slots
                    label="Foto 1"
                    counter
                    accept="image/png, image/jpeg"
                  >
                    <template v-slot:prepend>
                      <q-icon name="cloud_upload" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="files = null"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </div>

                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                  <q-file
                    v-model="foto2_a"
                    filled
                    bottom-slots
                    label="Foto 2"
                    counter
                    accept="image/png, image/jpeg"
                  >
                    <template v-slot:prepend>
                      <q-icon name="cloud_upload" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="files = null"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </div>

                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                  <q-file
                    v-model="foto3_a"
                    filled
                    bottom-slots
                    label="Foto 3"
                    counter
                    accept="image/png, image/jpeg"
                  >
                    <template v-slot:prepend>
                      <q-icon name="cloud_upload" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="files = null"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </div>

                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                  <q-file
                    v-model="foto4_a"
                    filled
                    bottom-slots
                    label="Foto 4"
                    counter
                    accept="image/png, image/jpeg"
                  >
                    <template v-slot:prepend>
                      <q-icon name="cloud_upload" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="files = null"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </div>

                <!-------------------------------------------------------------------------->

                <div class="col">
                  <q-table
                    :rows="listaNumeroSerie_a"
                    :columns="columns"
                    row-key="name"
                    :rows-per-page-options="[]"
                  >
                    <template v-slot:body="props">
                      <q-tr :props="props">
                        <q-td key="numero_serie" :props="props">
                          {{ props.row.numero_serie }}
                          <q-popup-edit
                            v-model.number="props.row.numero_serie"
                            buttons
                            persistent
                            auto-save
                            v-slot="scope"
                          >
                            <q-input
                              type="number"
                              v-model.number="scope.value"
                              dense
                              autofocus
                              @keyup.enter="scope.set"
                            />
                          </q-popup-edit>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </div>
              </q-tab-panel>

              <!---------------------------------------------------------------->

              <q-tab-panel name="extencion_b">
                <div class="text-h6">Extención B</div>
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <q-input
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
                    v-model.trim="inventario.nombre_corto_b"
                    label="Nombre corto"
                    autogrow
                    lazy-rules
                    :rules="[(val) => !!val || 'La nombre corto es requerido']"
                  >
                  </q-input>
                </div>

                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-select
                    v-model="marcaId_B"
                    :options="listMarca"
                    label="Marca"
                    hint="Selecciona una marca"
                    lazy-rules
                    :rules="[(val) => !!val || 'La marca es requerida']"
                  >
                  </q-select>
                </div>

                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-select
                    v-model="modeloId_B"
                    :options="listModelo"
                    label="Modelo"
                    hint="Selecciona modelo"
                    lazy-rules
                    :rules="[(val) => !!val || 'El modelo es requerida']"
                  >
                  </q-select>
                </div>

                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-input
                    v-model.trim="inventario.color_b"
                    label="Color"
                    autogrow
                    lazy-rules
                    :rules="[(val) => !!val || 'El color es requerido']"
                  >
                  </q-input>
                </div>

                <!-------------------------------------------------------------------------->
                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                  <q-file
                    v-model="foto1_b"
                    filled
                    bottom-slots
                    label="Foto 1"
                    counter
                    accept="image/png, image/jpeg"
                  >
                    <template v-slot:prepend>
                      <q-icon name="cloud_upload" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="files = null"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </div>

                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                  <q-file
                    v-model="foto2_b"
                    filled
                    bottom-slots
                    label="Foto 2"
                    counter
                    accept="image/png, image/jpeg"
                  >
                    <template v-slot:prepend>
                      <q-icon name="cloud_upload" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="files = null"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </div>

                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                  <q-file
                    v-model="foto3_b"
                    filled
                    bottom-slots
                    label="Foto 3"
                    counter
                    accept="image/png, image/jpeg"
                  >
                    <template v-slot:prepend>
                      <q-icon name="cloud_upload" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="files = null"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </div>

                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                  <q-file
                    v-model="foto4_b"
                    filled
                    bottom-slots
                    label="Foto 4"
                    counter
                    accept="image/png, image/jpeg"
                  >
                    <template v-slot:prepend>
                      <q-icon name="cloud_upload" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="files = null"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </div>

                <!-------------------------------------------------------------------------->

                <div class="col">
                  <q-table
                    :rows="listaNumeroSerie_b"
                    :columns="columns"
                    row-key="name"
                    :rows-per-page-options="[]"
                  >
                    <template v-slot:body="props">
                      <q-tr :props="props">
                        <q-td key="numero_serie" :props="props">
                          {{ props.row.numero_serie }}
                          <q-popup-edit
                            v-model.number="props.row.numero_serie"
                            buttons
                            persistent
                            auto-save
                            v-slot="scope"
                          >
                            <q-input
                              type="number"
                              v-model.number="scope.value"
                              dense
                              autofocus
                              @keyup.enter="scope.set"
                            />
                          </q-popup-edit>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </div>
              </q-tab-panel>

              <!---------------------------------------------------------------->

              <q-tab-panel name="extencion_c">
                <div class="text-h6">Extención C</div>
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <q-input
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
                    v-model.trim="inventario.nombre_corto_c"
                    label="Nombre corto"
                    autogrow
                    lazy-rules
                    :rules="[(val) => !!val || 'La nombre corto es requerido']"
                  >
                  </q-input>
                </div>

                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-select
                    v-model="marcaId_C"
                    :options="listMarca"
                    label="Marca"
                    hint="Selecciona una marca"
                    lazy-rules
                    :rules="[(val) => !!val || 'La marca es requerida']"
                  >
                  </q-select>
                </div>

                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-select
                    v-model="modeloId_C"
                    :options="listModelo"
                    label="Modelo"
                    hint="Selecciona modelo"
                    lazy-rules
                    :rules="[(val) => !!val || 'El modelo es requerida']"
                  >
                  </q-select>
                </div>

                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-input
                    v-model.trim="inventario.color_c"
                    label="Color"
                    autogrow
                    lazy-rules
                    :rules="[(val) => !!val || 'El color es requerido']"
                  >
                  </q-input>
                </div>

                <!-------------------------------------------------------------------------->
                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                  <q-file
                    v-model="foto1_c"
                    filled
                    bottom-slots
                    label="Foto 1"
                    counter
                    accept="image/png, image/jpeg"
                  >
                    <template v-slot:prepend>
                      <q-icon name="cloud_upload" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="files = null"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </div>

                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                  <q-file
                    v-model="foto2_c"
                    filled
                    bottom-slots
                    label="Foto 2"
                    counter
                    accept="image/png, image/jpeg"
                  >
                    <template v-slot:prepend>
                      <q-icon name="cloud_upload" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="files = null"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </div>

                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                  <q-file
                    v-model="foto3_c"
                    filled
                    bottom-slots
                    label="Foto 3"
                    counter
                    accept="image/png, image/jpeg"
                  >
                    <template v-slot:prepend>
                      <q-icon name="cloud_upload" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="files = null"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </div>

                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                  <q-file
                    v-model="foto4_c"
                    filled
                    bottom-slots
                    label="Foto 4"
                    counter
                    accept="image/png, image/jpeg"
                  >
                    <template v-slot:prepend>
                      <q-icon name="cloud_upload" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="files = null"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-file>
                </div>

                <!-------------------------------------------------------------------------->

                <div class="col">
                  <q-table
                    :rows="listaNumeroSerie_c"
                    :columns="columns"
                    row-key="name"
                    :rows-per-page-options="[]"
                  >
                    <template v-slot:body="props">
                      <q-tr :props="props">
                        <q-td key="numero_serie" :props="props">
                          {{ props.row.numero_serie }}
                          <q-popup-edit
                            v-model.number="props.row.numero_serie"
                            buttons
                            persistent
                            auto-save
                            v-slot="scope"
                          >
                            <q-input
                              type="number"
                              v-model.number="scope.value"
                              dense
                              autofocus
                              @keyup.enter="scope.set"
                            />
                          </q-popup-edit>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </div>
              </q-tab-panel>

              <!---------------------------------------------------------------->
            </q-tab-panels>
          </div>

          <!----------------------------------------------------------------------------->

          <div
            v-if="isEditar && radio != 'paquete'"
            class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
          >
            <q-input
              disable
              v-model="inventario.clave"
              label="Clave del producto"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'La clave es requerido']"
            >
            </q-input>
          </div>

          <div
            v-if="radio != 'paquete'"
            class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
          >
            <q-input
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
              v-model.trim="inventario.nombre_corto"
              label="Nombre corto"
              name="nombre_corto"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'La nombre corto es requerido']"
            >
            </q-input>
          </div>

          <div
            v-if="radio != 'paquete'"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-select
              v-model="marcaId"
              :options="listMarca"
              label="Marca"
              hint="Selecciona una marca"
              lazy-rules
              :rules="[(val) => !!val || 'La marca es requerida']"
            >
            </q-select>
          </div>

          <div
            v-if="radio != 'paquete'"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-select
              v-model="modeloId"
              :options="listModelo"
              label="Modelo"
              hint="Selecciona modelo"
              lazy-rules
              :rules="[(val) => !!val || 'El modelo es requerida']"
            >
            </q-select>
          </div>

          <div
            v-if="radio == 'individual'"
            class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
          >
            <q-input
              v-model.trim="inventario.color"
              label="Color"
              name="color"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'El color es requerido']"
            >
            </q-input>
          </div>

          <div
            v-if="radio == 'agranel'"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input
              v-model.trim="inventario.color"
              label="Color"
              name="color"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'El color es requerido']"
            >
            </q-input>
          </div>

          <div
            v-if="radio == 'agranel'"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input
              v-model.trim="cantidad"
              label="Cantidad"
              type="number"
              name="cantidad"
              autogrow
              lazy-rules
              :rules="[(val) => !!val || 'La cantidad es requerida']"
            >
            </q-input>
          </div>

          <q-card
            v-if="radio != 'paquete'"
            class="col-lg-3 col-md-3 col-sm-3 col-xs-12 my-card"
          >
            <q-file
              accept="image/png, image/jpeg"
              color="purple-12"
              v-model="foto1"
              label="Label"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
            <img
              v-if="isEditar"
              src="https://cdn.quasar.dev/img/parallax2.jpg"
            />
          </q-card>

          <q-card
            v-if="radio != 'paquete'"
            class="col-lg-3 col-md-3 col-sm-3 col-xs-12 my-card"
          >
            <q-file
              accept="image/png, image/jpeg"
              color="purple-12"
              v-model="foto2"
              label="Label"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
            <img
              v-if="isEditar"
              src="https://cdn.quasar.dev/img/parallax2.jpg"
            />
          </q-card>

          <q-card
            v-if="radio != 'paquete'"
            class="col-lg-3 col-md-3 col-sm-3 col-xs-12 my-card"
          >
            <q-file
              accept="image/png, image/jpeg"
              color="purple-12"
              v-model="foto3"
              label="Label"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
            <img
              v-if="isEditar"
              src="https://cdn.quasar.dev/img/parallax2.jpg"
            />
          </q-card>

          <q-card
            v-if="radio != 'paquete'"
            class="col-lg-3 col-md-3 col-sm-3 col-xs-12 my-card"
          >
            <q-file
              accept="image/png, image/jpeg"
              color="purple-12"
              v-model="foto4"
              label="Label"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
            <img
              v-if="isEditar"
              src="https://cdn.quasar.dev/img/parallax2.jpg"
            />
          </q-card>

          <!----------------------------------------------------------------------------->

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
import { useAuthStore } from "../../../stores/auth_store";
import { useInventarioStore } from "../../../stores/inventario_store";
import { useCatalogoProductoStore } from "src/stores/catalogos_producto_store";
import { useBodegaStore } from "src/stores/bodega_store";
import { useMarcaStore } from "src/stores/marcas_store";
import { useModeloStore } from "src/stores/modelo_store";

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

//-----------------------------------------------------------
const tabsDefinition = [
  { name: "extencion_a", label: "Extención A" },
  { name: "extencion_b", label: "Extención B" },
  { name: "extencion_c", label: "Extención C" },
];
const tabs = ref(tabsDefinition.slice(0, 0));
const tab = ref("general");

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
const columns = [
  {
    name: "numero_serie",
    align: "center",
    label: "Números de serie",
    field: "numero_serie",
    sortable: true,
  },
];
//-----------------------------------------------------------

onBeforeMount(() => {
  bodegaStore.loadBodegasList();
  catalogoStore.loadCatalogoList();
  marcaStore.loadMarcaList();
});

//-----------------------------------------------------------

watch(marcaId, (val) => {
  if (val != null) {
    modeloStore.modeloByMarca(marcaId.value.value).then(() => {
      modeloId.value = listModelo.value[0];
    });
  }
});

watch(radio, (val) => {
  catalogoId.value = null;
  bodegaId.value = null;
  marcaId.value = null;
  modeloId.value = null;
  cantidad.value = null;
  foto1.value = null;
  foto2.value = null;
  foto3.value = null;
  foto4.value = null;
  inventarioStore.initInventario();
});

watch(inventario.value, (val) => {
  if (val.id != null) {
    cargarBodega(val);
    cargarCatalogo(val);
    cargarMarca(val);
  }
});

watch(cantidad, (val) => {
  inventarioStore.addCantidad(cantidad.value, catalogoId);
});

//-----------------------------------------------------------

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
  }
};

const actualizarModal = (valor) => {
  inventarioStore.actualizarModal(valor);
  catalogoId.value = null;
  bodegaId.value = null;
  marcaId.value = null;
  modeloId.value = null;
  cantidad.value = null;
  inventarioStore.initInventario();
};

//-----------------------------------------------------------

const onSubmit = async () => {
  let inventarioFormData = new FormData();
  let inventarioPaqueteFormData = new FormData();

  if (radio.value != "paquete") {
    inventarioFormData.append("Catalago_Id", catalogoId.value.value);
    inventarioFormData.append("Estatus_Id", 2);
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
  } else if (radio.value == "paquete") {
    //-----------------------------------------------------------
    //General
    inventarioPaqueteFormData.append("Catalago_Id", catalogoId.value.value);
    inventarioPaqueteFormData.append("Bodega_Id", bodegaId.value.value);
    inventarioPaqueteFormData.append("General.Marca_Id", marcaId.value.value);
    inventarioPaqueteFormData.append("General.Modelo_Id", modeloId.value.value);
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

    //-----------------------------------------------------------
    //Extencion A
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

      //-----------------------------------------------------------
      //Extencion B
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
      }

      //-----------------------------------------------------------
      //Extencion C
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
      }
    }
  }

  let resp = null;
  let error = 0;

  $q.loading.show();

  if (isEditar.value == true) {
    resp = await inventarioStore.updateInventario(inventarioFormData);
    inventarioStore.initInventario();
  } else {
    if (cantidad.value == null) {
      //individual
      resp = await inventarioStore.createInventario(inventarioFormData);
      inventarioStore.initInventario();
    } else if (radio.value == "agranel") {
      //agranel
      for (let i = 0; i < cantidad.value; i++) {
        try {
          resp = await inventarioStore.createInventario(inventarioFormData);
          if (!resp.success) error++;
        } catch (error) {
          error++;
          console.log(error);
        }
      }
    } else if (radio.value == "paquete") {
      //paquete
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
      type: "positive",
      message: resp.data,
    });
    actualizarModal(false);
    inventarioStore.initInventario();
    inventarioStore.loadInformacionInventarios();
  } else {
    $q.notify({
      type: "negative",
      message: resp.data,
    });
  }

  // if (error > 0) {
  //   $q.dialog({
  //     title: "Volver a registrar",
  //     message: "¿Quieres volver a registrar los que arrojaron error?",
  //     icon: "Warning",
  //     persistent: true,
  //     transitionShow: "scale",
  //     transitionHide: "scale",
  //     ok: {
  //       color: "positive",
  //       label: "¡Sí!, volver a registrar",
  //     },
  //     cancel: {
  //       color: "negative",
  //       label: " No Cancelar",
  //     },
  //   }).onOk(async () => {
  //     $q.loading.show();
  //     console.log("onOk");
  //     for (let i = 0; i < error; i++) {
  //       resp = await inventarioStore.createInventario(inventarioFormData);
  //     }
  //     if (resp.success) {
  //       $q.loading.hide();
  //       $q.notify({
  //         type: "positive",
  //         message: resp.data,
  //       });
  //       inventarioStore.loadInformacionInventarios();
  //     } else {
  //       $q.loading.hide();
  //       $q.notify({
  //         type: "negative",
  //         message: resp.data,
  //       });
  //     }
  //   });
  // }

  $q.loading.hide();
};
</script>

<style></style>
