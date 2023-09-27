import { api } from "src/boot/axios";
import { jsPDF } from "jspdf";
import { storeToRefs } from "pinia";
import { useAsignacionStore } from "src/stores/asignacion_store";
import autoTable from "jspdf-autotable";

const Reporte = async () => {
  const asignacionStore = useAsignacionStore();
  const { asignacion } = storeToRefs(asignacionStore);

  try {
    let id = asignacion.value.id;
    let respDetalle = await api.get(`/DetalleAsignaciones/BySolicitud/${id}`);
    let { data } = respDetalle.data;
    //--------------------------------------------------------------------------//

    let img = new Image();

    img.src = require("../assets/IEEN300.png");
    let totalPagesExp = "{total_pages_count_string}";
    const doc = new jsPDF({ orientation: "portrait", format: "letter" });
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
    doc.text("Responsable: ", 15, 65);
    doc.setFont("helvetica", "normal");
    doc.text(asignacion.value.empleado, 40, 65);

    doc.rect(10, 70, 191.8, 10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Cargo:", 15, 75);
    doc.setFont("helvetica", "normal");
    doc.text(asignacion.value.puesto, 30, 75);
    doc.setFont("helvetica", "bold");
    doc.text("Municipio:", 150, 75, null, null, "right");

    doc.rect(10, 80, 191.8, 10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Área:", 15, 85);
    doc.text("Localidad:", 150, 85, null, null, "right");

    doc.setFont("helvetica", "normal");
    doc.text(asignacion.value.area, 28, 85);
    doc.text("Tepic", 155, 85);
    doc.text("Tepic", 155, 75);

    //----------------------------------------------------------------------------------------//

    var rows = [];
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
      startY: 90,
      margin: { left: 10, rigth: 10 },
      head: header,
      body: data.map((item) => [
        item.inventario,
        item.numero_Serie == null ? "S/N" : item.numero_Serie,
        item.descripcion,
        item.marca,
        item.modelo,
        item.color == null ? "SIN COLOR" : item.color,
        item.importe == undefined ? "SIN IMPORTE" : `$${item.importe}`,
      ]),
      bodyStyles: { fontSize: 8, textColor: [0, 0, 0] },
      tableLineColor: [0, 0, 0],
    });

    //--------------------------------------------------------------------------//
    //Numeracion de paginas y footer

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
            var maxY = 200;
            var currentY = doc.lastAutoTable.finalY;

            if (currentY > maxY) {
              doc.addPage();
              doc.setFont("helvetica", "bold");
              doc.setFontSize(10);
              doc.text(
                "________________________________________",
                110,
                80,
                null,
                null,
                "center"
              );
              doc.text(
                asignacion.value.empleado,
                110,
                85,
                null,
                null,
                "center"
              );
              doc.text("Personal responsable", 110, 90, null, null, "center");

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
                doc.lastAutoTable.finalY + 65,
                null,
                null,
                "center"
              );
              doc.text(
                asignacion.value.empleado,
                110,
                doc.lastAutoTable.finalY + 70,
                null,
                null,
                "center"
              );
              doc.text(
                "Personal responsable",
                110,
                doc.lastAutoTable.finalY + 75,
                null,
                null,
                "center"
              );
              doc.rect(10, doc.lastAutoTable.finalY + 85, 194, 17);
              doc.setFont("helvetica", "bold");
              doc.setFontSize(10);
              doc.text("NOTA:", 12, doc.lastAutoTable.finalY + 90);
              doc.setFont("helvetica", "normal");
              doc.setFontSize(10);
              doc.text(
                "Resguardo temporal para prestamo de Bien Mueble del Instituto Estatal Electoral de Nayarit, cualquier daño, \n " +
                  "perdida o extravio del bien es responsabilidad del usuario responsable. Este resguardo se cancela al momento \n " +
                  "de la entrega del bien del usuario responsable a la Unidad Técnica de Informática y Estadistica",
                24,
                doc.lastAutoTable.finalY + 90
              );
            }
          }
        }
      }
    };

    //--------------------------------------------------------------------------//

    footer();
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

export default Reporte;
