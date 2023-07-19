<template>
  <div>
    <q-btn @click="showPDFDialog">Abrir PDF</q-btn>

    <q-dialog ref="pdfDialog" v-model="dialogVisible" persistent>
      <div class="pdf-dialog-content">
        <canvas ref="pdfCanvas"></canvas>
      </div>
    </q-dialog>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
