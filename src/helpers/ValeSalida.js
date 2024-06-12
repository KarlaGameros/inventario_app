import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useMovimientoInventario } from "src/stores/movimiento_inventario";
import { storeToRefs } from "pinia";

const ValeSalida = async () => {
  try {
    const movimientosStore = useMovimientoInventario();
    const { movimiento, list_Detalle, responsable } =
      storeToRefs(movimientosStore);
    await movimientosStore.loadResponsableByUsuario();
    let img = new Image();
    img.src = require("../assets/IEEN300.png");
    const doc = new jsPDF({ orientation: "landscape", format: "letter" });

    function createHeader() {
      doc.addImage(img, "png", 10, 5, 35, 21);
      doc.setFontSize(10);
      doc.setFont("helvica", "bold");
      doc.text(
        `INSTITUTO ESTATAL ELECTORAL DEL ESTADO DE NAYARIT \n \n VALE ${movimiento.value.tipo_Movimiento.toUpperCase()}`,
        140,
        15,
        null,
        null,
        "center"
      );

      //--------------------------------------------------------------------------//

      doc.setFillColor(84, 37, 131);
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.3);

      doc.rect(10, 30, 45, 5, "FD");
      doc.rect(10, 35, 45, 5, "FD");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("No. vale", 12, 34);

      doc.setTextColor(0, 0, 0);

      doc.setTextColor(255, 255, 255);
      doc.text("Fecha", 12, 39);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);

      doc.rect(55, 30, 50, 5);
      doc.text(movimiento.value.folio, 60, 34);

      doc.rect(55, 35, 50, 5);
      doc.text(movimiento.value.fecha_Afecto, 60, 39);
    }

    function createFooter() {
      doc.setPage(i + 1);
      doc.setTextColor(0, 0, 0);
      doc.text(
        "Página " + (i + 1) + " de " + newPageCount,
        200,
        270,
        null,
        null,
        "right"
      );
    }

    //--------------------------------------------------------------------------//

    doc.setFillColor(84, 37, 131);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.rect(10, 45, 255, 6, "FD");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("DATOS DEL CAPTURISTA", 140, 49, null, null, "center");

    doc.setTextColor(0, 0, 0);

    doc.rect(10, 51, 255, 7, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Responsable: ", 15, 56);
    doc.setFont("helvetica", "normal");
    doc.text(movimiento.value.capturista, 40, 56);

    doc.rect(10, 58, 255, 7);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Cargo:", 15, 63);
    doc.setFont("helvetica", "normal");
    doc.text(movimiento.value.puesto_Capturista, 30, 63);

    doc.rect(10, 65, 255, 7);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Área:", 15, 70);

    doc.setFont("helvetica", "normal");
    doc.text(movimiento.value.area_Capturista, 28, 70);

    //--------------------------------------------------------------------------//

    var header = [
      [
        { content: "No." },
        { content: "Clave" },
        { content: "No. Serie" },
        { content: "Descripción" },
        { content: "Marca" },
        { content: "Modelo" },
        { content: "Estado fisico" },
        { content: "Justificación" },
        { content: "Bodega" },
      ],
    ];

    jsPDF.autoTableSetDefaults({
      headStyles: { fillColor: [84, 37, 131], halign: "center" },
      styles: {
        halign: "center",
        valign: "middle",
        fontSize: 8,
        lineColor: [0, 0, 0],
        lineWidth: 0.3,
      },
    });

    autoTable(doc, {
      theme: "grid",
      startY: 72,
      margin: { left: 10, rigth: 10 },
      head: header,
      body: list_Detalle.value.map((item, index) => [
        index + 1,
        item.clave,
        item.no_Serie,
        item.descripcion,
        item.marca,
        item.modelo,
        item.estado_Fisico,
        item.observaciones,
        item.bodega_Origen,
      ]),
      bodyStyles: { fontSize: 8, textColor: [0, 0, 0] },
      tableLineColor: [0, 0, 0],
    });

    var maxY = 222;
    var currentY = doc.lastAutoTable.finalY;
    if (currentY > maxY) {
      doc.addPage();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(
        "________________________________________",
        50,
        190,
        null,
        null,
        "center"
      );
      doc.text(movimiento.value.capturista, 50, 195, null, null, "center");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("Personal responsable", 50, 200, null, null, "center");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(
        "________________________________________",
        225,
        190,
        null,
        null,
        "center"
      );
      doc.text(responsable.value.empleado, 225, 195, null, null, "center");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("Responsable de área", 225, 200, null, null, "center");
    } else {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(
        "________________________________________",
        50,
        190,
        null,
        null,
        "center"
      );
      doc.text(movimiento.value.capturista, 50, 195, null, null, "center");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("Personal responsable", 50, 200, null, null, "center");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(
        "________________________________________",
        225,
        190,
        null,
        null,
        "center"
      );
      doc.text(responsable.value.empleado, 225, 195, null, null, "center");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("Responsable de área", 225, 200, null, null, "center");
    }

    var newPageCount = doc.internal.getNumberOfPages();
    for (var i = 0; i < newPageCount; i++) {
      createHeader();
      createFooter();
    }

    //--------------------------------------------------------------------------//

    doc.save(`ValeMovimientos${movimiento.value.folio}` + ".pdf");
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
export default ValeSalida;
