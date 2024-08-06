import { jsPDF } from "jspdf";
import { storeToRefs } from "pinia";
import { useAsignacionStore } from "src/stores/asignacion_store";
import { useEmpleadosStore } from "src/stores/empleados_store";
import autoTable from "jspdf-autotable";

const ValeGeneralResguardo = async () => {
  try {
    const asignacionStore = useAsignacionStore();
    const empleadosStore = useEmpleadosStore();
    const { list_Inventario_By_Empleado } = storeToRefs(asignacionStore);
    const { empleado } = storeToRefs(empleadosStore);

    let img = new Image();
    img.src = require("../assets/IEEN300.png");
    const doc = new jsPDF({ orientation: "portrait", format: "letter" });
    function createHeader() {
      doc.addImage(img, "png", 10, 5, 35, 21);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(
        "INSTITUTO ESTATAL ELECTORAL DE NAYARIT \n \n RESGUARDO GENERAL",
        110,
        15,
        null,
        null,
        "center"
      );
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
    doc.rect(9.5, 35, 191.99, 6, "FD");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("DATOS DEL RESPONSABLE", 85, 39);

    doc.setTextColor(0, 0, 0);

    doc.rect(9.5, 41, 191.99, 7, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Responsable: ", 15, 46);
    doc.setFont("helvetica", "normal");
    doc.text(empleado.value.nombres, 40, 46);

    doc.rect(9.5, 48, 191.99, 7);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Cargo:", 15, 53);
    doc.setFont("helvetica", "normal");
    doc.text(empleado.value.puesto, 30, 53);
    doc.setFont("helvetica", "bold");

    doc.rect(9.5, 55, 191.99, 7);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Área:", 15, 60);

    doc.setFont("helvetica", "normal");
    doc.text(empleado.value.area, 28, 60);

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
        lineWidth: 0.1,
      },
    });

    autoTable(doc, {
      theme: "grid",
      startY: 62,
      margin: { left: 9.6, rigth: 10, top: 45 },
      head: header,
      body: list_Inventario_By_Empleado.value.map((item) => [
        item.clave,
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
    var pageCount = doc.internal.getNumberOfPages();

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
      doc.text(
        `${empleado.value.tratamiento} ${empleado.value.nombres}`,
        110,
        92,
        null,
        null,
        "center"
      );
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
      var text1 =
        "Resguardo temporal de préstamo de Bien Mueble del Instituto Estatal Electoral de Nayarit. Cualquier daño, perdida o extravío del bien es responsabilidad del usuario su reposición. Los importes asentados son conforme al valor de la adquisición, sin embargo, en caso de pérdida o menoscabo en los bienes bajo resguardo, el valor que en ese momento tengan los bienes será calculado tomando en cuenta la depreciación que sufran con motivo del deterioro físico por el uso o desgaste de los mismo conforme a su naturaleza. Este resguardo se cancela al momento de la entrega del bien del usuario responsable al área correspondiente.";
      var maxWidth = 194;
      doc.text(
        `${empleado.value.tratamiento} ${empleado.value.nombres}`,
        110,
        237,
        null,
        null,
        "center"
      );
      doc.text("Personal responsable", 110, 242, null, null, "center");
      doc.rect(8, 247, 197, 20);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      var lines = doc.splitTextToSize(text1, maxWidth);
      var y = 250;
      for (var i = 0; i < lines.length; i++) {
        doc.text(10, y, lines[i], {
          align: "justify",
        });
        y = y + 4;
      }
    }

    var newPageCount = doc.internal.getNumberOfPages();
    for (var i = 0; i < newPageCount; i++) {
      createHeader();
      createFooter();
    }
    //--------------------------------------------------------------------------//

    doc.save(`ValeResguardoGeneral${empleado.value.nombres}` + ".pdf");

    return {
      success: true,
      msj: "Recibo generado con éxito",
    };
  } catch (error) {
    return {
      success: false,
      data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
    };
  }
};

export default ValeGeneralResguardo;
