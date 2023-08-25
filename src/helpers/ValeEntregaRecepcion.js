import { api } from "src/boot/axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const EntregaRecepcion = async () => {
  try {
    let img = new Image();
    img.src = require("../assets/IEEN300.png");
    const doc = new jsPDF({ orientation: "portrait", format: "letter" });
    doc.addImage(img, "png", 10, 5, 35, 21);
    doc.setFontSize(10);
    doc.setFontSize(10);
    doc.setFont("helvica", "bold");
    doc.text(
      "INTITUTO ESTATAL ELECTORAL DEL ESTADO DE NAYARIT \n \n VALE DE ENTREGA A RECEPCION",
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

    doc.rect(10, 30, 45, 5, "FD");
    doc.rect(10, 35, 45, 5, "FD");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("No. Entrega Recepción", 12, 34);

    doc.setTextColor(0, 0, 0);

    doc.setTextColor(255, 255, 255);
    doc.text("Fecha", 12, 39);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);

    doc.rect(55, 30, 50, 5);
    doc.text("folio", 60, 34);

    doc.rect(55, 35, 50, 5);
    doc.text("fecha", 60, 39);

    //--------------------------------------------------------------------------//

    doc.setFillColor(84, 37, 131);
    doc.rect(10, 50, 191.8, 8, "FD");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("DATOS DEL RESPONSABLE", 85, 55);

    doc.setTextColor(0, 0, 0);

    doc.rect(10, 58, 191.8, 10, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Responsable: ", 15, 65);
    doc.setFont("helvetica", "normal");
    doc.text("Karla Gameros", 40, 65);

    doc.rect(10, 68, 191.8, 10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Cargo:", 15, 75);
    doc.setFont("helvetica", "normal");
    doc.text("Programadora", 30, 75);
    doc.setFont("helvetica", "bold");
    doc.text("Municipio:", 150, 75, null, null, "right");

    doc.rect(10, 78, 191.8, 10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Área:", 15, 85);
    doc.text("Localidad:", 150, 85, null, null, "right");

    doc.setFont("helvetica", "normal");
    doc.text("Centro de capacitación del IEE", 28, 85);
    doc.text("Tepic", 155, 85);
    doc.text("Tepic", 155, 75);

    //--------------------------------------------------------------------------//
    var rows = [
      [
        "EY-06-0108",
        "6C12",
        "Almacenamiento, control y distribucion de bienes muebles",
        "Lenovo",
        "Lenovo",
        "Negro",
      ],
      [
        "EY-06-0108",
        "6C12",
        "Almacenamiento, control y distribucion de bienes muebles",
        "Lenovo",
        "Lenovo",
        "Negro",
      ],
    ];
    var header = [
      [
        { content: "Clave" },
        { content: "No. Serie" },
        { content: "Descripción" },
        { content: "Marca" },
        { content: "Modelo" },
        { content: "Color" },
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
      startY: 88,
      margin: { left: 10, rigth: 10 },
      head: header,
      body: [...rows],
      bodyStyles: { fontSize: 10, textColor: [0, 0, 0] },
      tableLineColor: [0, 0, 0],
    });

    //--------------------------------------------------------------------------//
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

    doc.save("ValeEntregaRecepcion" + ".pdf");
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
export default EntregaRecepcion;
