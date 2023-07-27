import { api } from "src/boot/axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth_store";

const ValePrestamo = async () => {
  try {
    //--------------------------------------------------------------------------//

    let img = new Image();

    img.src = require("../assets/IEEN300.png");
    let totalPagesExp = "{total_pages_count_string}";
    const doc = new jsPDF({ orientation: "portrait", format: "letter" });
    doc.addImage(img, "png", 10, 5, 35, 21);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(
      "INSTITULO ESTATAL ELECTORAL DEL ESTADO DE NAYARIT \n \n VALE DE PRESTAMO",
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
    doc.text("No. Prestamo", 12, 34);

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
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("DATOS DEL RESPONSABLE", 85, 55);

    doc.setTextColor(0, 0, 0);

    doc.rect(10, 60, 191.8, 10, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Responsable:", 15, 65);

    doc.rect(10, 70, 191.8, 10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Cargo:", 15, 75);
    doc.text("Municipio:", 150, 75, null, null, "right");

    doc.rect(10, 80, 191.8, 10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Área:", 15, 85);
    doc.text("Localidad:", 150, 85, null, null, "right");

    doc.setFont("helvetica", "normal");
    doc.text("CENTRO DE CAPACITACIÓN DEL IEE", 40, 85);
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

    //--------------------------------------------------------------------------//

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
      ],
    ];

    //--------------------------------------------------------------------------//

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
      startY: 90,
      margin: { left: 10, rigth: 10 },
      head: header,
      body: [...rows],
      bodyStyles: { fontSize: 10, textColor: [0, 0, 0] },
      tableLineColor: [0, 0, 0],
    });

    //--------------------------------------------------------------------------//
    //Codigo numeracion de paginas

    var footer = function () {
      var pageCount = doc.internal.getNumberOfPages();
      for (var i = 0; i < pageCount; i++) {
        doc.setPage(i + 1);
        doc.setTextColor(0, 0, 0);
        doc.text(
          "Página " + (i + 1) + " de " + pageCount,
          200,
          270,
          null,
          null,
          "right"
        );

        if (i === pageCount - 1) {
          if (doc.lastAutoTable && doc.lastAutoTable.finalY) {
            var maxY = 230;
            var currentY = doc.lastAutoTable.finalY;

            if (currentY > maxY) {
              doc.addPage();
              doc.setFont("helvetica", "bold");
              doc.setFontSize(10);
              doc.text("_____________________________", 80, 230);
              doc.text("Empleado responsable", 90, 235);

              doc.rect(10, 240, 194, 17);
              doc.setFont("helvetica", "bold");
              doc.setFontSize(10);

              doc.text("NOTA:", 12, 245);

              doc.setFont("helvetica", "normal");
              doc.setFontSize(10);

              doc.text(
                "Resguardo temporal para prestamo de Bien Mueble del Instituto Estatal Electoral de Nayarit, cualquier daño, \n " +
                  "perdida o extravio del bien es responsabilidad del usuario responsable. Este resguardo se cancela al momento \n " +
                  "de la entrega del bien del usuario responsable a la Unidad Técnica de Informática y Estadistica",
                24,
                245
              );
            } else {
              doc.setFont("helvetica", "bold");
              doc.setFontSize(10);
              doc.text(
                "_____________________________",
                80,
                doc.lastAutoTable.finalY + 10
              );
              doc.text(
                "Empleado responsable",
                90,
                doc.lastAutoTable.finalY + 15
              );
              doc.rect(10, doc.lastAutoTable.finalY + 20, 194, 17);
              doc.setFont("helvetica", "bold");
              doc.setFontSize(10);
              doc.text("NOTA:", 12, doc.lastAutoTable.finalY + 25);
              doc.setFont("helvetica", "normal");
              doc.setFontSize(10);
              doc.text(
                "Resguardo temporal para prestamo de Bien Mueble del Instituto Estatal Electoral de Nayarit, cualquier daño, \n " +
                  "perdida o extravio del bien es responsabilidad del usuario responsable. Este resguardo se cancela al momento \n " +
                  "de la entrega del bien del usuario responsable a la Unidad Técnica de Informática y Estadistica",
                24,
                doc.lastAutoTable.finalY + 25
              );
            }
          }
        }
      }
    };

    //--------------------------------------------------------------------------//

    footer();
    doc.save("ValePrestamo" + ".pdf");
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

export default ValePrestamo;
