import { api } from "src/boot/axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth_store";

const Reporte = async () => {
  try {
    let img = new Image();

    img.src = require("../assets/IEEN300.png");
    let totalPagesExp = "{total_pages_count_string}";
    const doc = new jsPDF({ orientation: "portrait", format: "letter" });
    doc.addImage(img, "png", 10, 5, 35, 21);
    doc.setFontSize(10);
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
    doc.text("**No. Resguardo**", 60, 34);

    doc.rect(50, 35, 50, 5);
    doc.text("**Fecha**", 60, 39);

    //--------------------------------------------------------------------------//

    doc.setFillColor(84, 37, 131);
    doc.rect(10, 50, 191.8, 10, "FD");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("DATOS DEL RESPONSABLE", 85, 55);

    doc.setTextColor(0, 0, 0);

    doc.rect(10, 60, 191.8, 10, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Responsable:", 15, 65);

    //----------------------------------------------------------------------------------------//

    doc.line(70, 180, 150, 180);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Empleado responsable", 90, 185);

    //----------------------------------------------------------------------------------------//

    doc.rect(10, 200, 194, 15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);

    doc.text("NOTA:", 12, 205);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.text(
      "Resguardo temporal para prestamo de Bien Mueble del Instituto Estatal Electoral de Nayarit, cualquier daño, \n " +
        "perdida o extravio del bien es responsabilidad del usuario responsable. Este resguardo se cancela al momento \n " +
        "de la entrega del bien del usuario responsable a la Unidad Técnica de Informática y Estadistica",
      24,
      205
    );
    //----------------------------------------------------------------------------------------//
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
      [
        "EY-06-0108",
        "6C12",
        "Almacenamiento, control y distribucion de bienes muebles",
        "Lenovo",
        "Lenovo",
        "Negro",
      ],
    ];

    var newRow = [
      {
        content: "RELACIÓN DE MOBILIARIO Y EQUIPO DE COMPUTO",
        colSpan: 6,
        styles: {
          halign: "center",
          fillColor: [84, 37, 131],
          textColor: [255, 255, 255],
        },
      },
    ];

    var header = [
      newRow,
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
      startY: 70,
      margin: { left: 10, rigth: 10 },
      head: header,
      body: [...rows],
      bodyStyles: { fontSize: 10, textColor: [0, 0, 0] },
      tableLineColor: [0, 0, 0],
    });
    //Codigo numeracion de paginas
    var footer = function () {
      var pageCount = doc.internal.getNumberOfPages();
      console.log("Esto es el total de paginas", pageCount);
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
    doc.save("ValeResguardo" + ".pdf");
    return {
      success: true,
      msj: "Recibo generado con éxito",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
    };
  }
};

export default Reporte;
