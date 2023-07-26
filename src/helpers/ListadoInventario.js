import { api } from "src/boot/axios";
import { storeToRefs } from "pinia";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useInventarioStore } from "src/stores/inventario_store";
import { onBeforeMount } from "vue";

const inventarioStore = useInventarioStore();
const { listInventario } = storeToRefs(inventarioStore);

onBeforeMount(() => {
  inventarioStore.loadInformacionInventarios();
});

const ReporteListadoInventario = async () => {
  try {
    //let resp = await api.get("/Inventarios");
    console.log("list", listInventario.value);
    let detalleData = listInventario.value;
    let img = new Image();
    img.src = require("../assets/IEEN300.png");
    let totalPagesExp = "{total_pages_count_string}";
    const doc = new jsPDF({ orientation: "landscape", format: "legal" });
    doc.addImage(img, "png", 10, 5, 35, 21);
    doc.setFontSize(14);
    doc.text(
      "INSTITUTO ESTATAL ELECTORAL DEL ESTADO DE NAYARIT \n \n Sistema de inventario \n" +
        "Reporte general \n",
      180,
      10,
      null,
      null,
      "center"
    );

    var header = [
      [
        { content: "#" },
        { content: "Clave" },
        { content: "Nombre Catalogo" },
        { content: "Descripción" },
        { content: "Nombre corto" },
        { content: "No. Serie" },
        { content: "Marca" },
        { content: "Modelo" },
        { content: "Color" },
        // { content: "Fecha de compra" },
        // { content: "Factura" },
        // { content: "Importe" },
        { content: "Estatus" },
        // { content: "Usuario" },
        { content: "QR" },
      ],
    ];

    jsPDF.autoTableSetDefaults({
      headStyles: { fillColor: [84, 37, 131], halign: "center" },
      styles: {
        halign: "center",
        valign: "middle",
        fontSize: 10,
        lineColor: [0, 0, 0],
        lineWidth: 0.3,
      },
    });
    autoTable(doc, {
      theme: "grid",
      startY: 46,
      margin: { left: 10, rigth: 16 },
      head: header,
      body: detalleData.map((item, index) => [
        index + 1,
        item.clave,
        item.catalogo,
        item.descripcion,
        item.nombre_corto,
        item.numero_Serie,
        item.marca,
        item.modelo,
        item.color,
        item.estatus,
        (item.qr = true ? "Si" : "No"),
      ]),
      bodyStyles: { fontSize: 10, textColor: [0, 0, 0] },
      tableLineColor: [0, 0, 0],
    });

    var footer = function () {
      var pageCount = doc.internal.getNumberOfPages();
      for (var i = 0; i < pageCount; i++) {
        doc.setPage(i + 1);
        doc.text(
          "Página " + (i + 1) + " de " + pageCount,
          340,
          205,
          null,
          null,
          "right"
        );
      }
    };
    footer();

    doc.save("Listado" + ".pdf");
    return {
      success: true,
      msj: "Recibo generado con exito",
    };
  } catch (error) {
    return {
      success: false,
      data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
    };
  }
};

export default ReporteListadoInventario;
