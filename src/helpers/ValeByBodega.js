import { api } from "src/boot/axios";
import { jsPDF } from "jspdf";
import { storeToRefs } from "pinia";
import { useAsignacionStore } from "src/stores/asignacion_store";
import autoTable from "jspdf-autotable";

const ReporteBodega = async () => {
  const asignacionStore = useAsignacionStore();
  const { listInventarioByBodega } = storeToRefs(asignacionStore);
  const { asignacion } = storeToRefs(asignacionStore);
  try {
    //--------------------------------------------------------------------------//

    let img = new Image();

    img.src = require("../assets/IEEN300.png");
    const doc = new jsPDF({ orientation: "portrait", format: "letter" });

    function createHeader() {
      doc.addImage(img, "png", 10, 5, 35, 21);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(
        "INSTITULO ESTATAL ELECTORAL DEL ESTADO DE NAYARIT \n \n VALE DE RESGUARDO",
        110,
        15,
        null,
        null,
        "center"
      );
      //--------------------------------------------------------------------------//

      doc.setFillColor(84, 37, 131);
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.3);

      doc.rect(10, 30, 40, 5, "FD");
      doc.rect(10, 35, 40, 5, "FD");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("No. Resguardo", 12, 34);

      doc.setTextColor(0, 0, 0);

      doc.setTextColor(255, 255, 255);
      doc.text("Fecha", 12, 39);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);

      doc.rect(50, 30, 50, 5);
      doc.text(asignacion.value.folio, 60, 34);

      doc.rect(50, 35, 50, 5);
      doc.text(asignacion.value.fecha_Asignacion, 60, 39);
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
    doc.rect(10, 45, 191.8, 6, "FD");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("DATOS DEL RESPONSABLE", 85, 49);

    doc.setTextColor(0, 0, 0);

    doc.rect(10, 51, 191.8, 7, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Responsable: ", 15, 56);
    doc.setFont("helvetica", "normal");
    doc.text(asignacion.value.empleado, 40, 56);

    doc.rect(10, 58, 191.8, 7);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Cargo:", 15, 63);
    doc.setFont("helvetica", "normal");
    doc.text(asignacion.value.puesto, 30, 63);
    doc.setFont("helvetica", "bold");

    doc.rect(10, 65, 191.8, 7);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Área:", 15, 70);
    doc.text("Tipo:", 150, 70, null, null, "right");

    doc.setFont("helvetica", "normal");
    doc.text(asignacion.value.area, 28, 70);
    doc.text("Bodega", 155, 70);

    //--------------------------------------------------------------------------//

    var newRow = [
      {
        content: "RELACIÓN DE BIENES",
        colSpan: 7,
        styles: {
          halign: "center",
          fillColor: [84, 37, 131],
          textColor: [255, 255, 255],
        },
      },
    ];

    //--------------------------------------------------------------------------//

    var header = [
      newRow,
      [
        { content: "Clave" },
        { content: "No. Serie" },
        { content: "Descripción" },
        { content: "Marca" },
        { content: "Modelo" },
        { content: "Color" },
        { content: "Importe" },
      ],
    ];

    //--------------------------------------------------------------------------//
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
      margin: { left: 9.6, rigth: 10, top: 45 },
      head: header,
      body: listInventarioByBodega.value.map((item) => [
        item.clave,
        item.numero_Serie == null ? "S/N" : item.numero_Serie,
        item.descripcion,
        item.marca,
        item.modelo,
        item.color,
        item.importe == null ? "SIN IMPORTE" : `$${item.importe}`,
      ]),
      bodyStyles: { fontSize: 8, textColor: [0, 0, 0] },
      tableLineColor: [0, 0, 0],
    });

    //--------------------------------------------------------------------------//
    //Numeracion de paginas y footer
    var pageCount = doc.internal.getNumberOfPages();
    for (var i = 0; i < pageCount; i++) {
      if (i === pageCount - 1) {
        if (doc.lastAutoTable && doc.lastAutoTable.finalY) {
          var maxY = 222;
          var currentY = doc.lastAutoTable.finalY;
          if (currentY > maxY) {
            doc.addPage();
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.text(
              "________________________________________",
              110,
              87,
              null,
              null,
              "center"
            );
            doc.text(asignacion.value.empleado, 110, 92, null, null, "center");
            doc.text("Personal responsable", 110, 97, null, null, "center");

            doc.rect(10, 100, 194, 17);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);

            doc.text("NOTA:", 12, 105);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);

            doc.text(
              "Resguardo temporal para prestamo de Bien Mueble del Instituto Estatal Electoral de Nayarit, cualquier daño, \n " +
                "perdida o extravio del bien es responsabilidad del usuario responsable. Este resguardo se cancela al momento \n " +
                "de la entrega del bien del usuario responsable a la Unidad Técnica de Informática y Estadistica",
              24,
              105
            );
          } else {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.text(
              "________________________________________",
              110,
              232,
              null,
              null,
              "center"
            );
            doc.text(asignacion.value.empleado, 110, 237, null, null, "center");
            doc.text("Personal responsable", 110, 242, null, null, "center");
            doc.rect(10, 245, 194, 15);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.text("NOTA:", 12, 250);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.text(
              "Resguardo temporal para prestamo de Bien Mueble del Instituto Estatal Electoral de Nayarit, cualquier daño, \n " +
                "perdida o extravio del bien es responsabilidad del usuario responsable. Este resguardo se cancela al momento \n " +
                "de la entrega del bien del usuario responsable a la Unidad Técnica de Informática y Estadistica",
              24,
              250
            );
          }
        }
      }
    }

    var newPageCount = doc.internal.getNumberOfPages();
    for (var i = 0; i < newPageCount; i++) {
      createHeader();
      createFooter();
    }
    //--------------------------------------------------------------------------//

    doc.save("ValeResguardo" + ".pdf");
    return {
      success: true,
      msj: "Recibo generado con éxito",
    };

    //--------------------------------------------------------------------------//
  } catch (error) {
    return {
      success: false,
      data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
    };
  }
};

export default ReporteBodega;
