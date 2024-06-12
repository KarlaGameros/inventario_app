import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useMovimientoInventario } from "src/stores/movimiento_inventario";
import { storeToRefs } from "pinia";
import { useMiInventarioStore } from "src/stores/mi_inventario";

const EntregaRecepcion = async () => {
  try {
    const miInventarioStore = useMiInventarioStore();
    const movimientosStore = useMovimientoInventario();
    const { movimiento, list_Detalle } = storeToRefs(movimientosStore);
    const { miInventario } = storeToRefs(miInventarioStore);
    let img = new Image();
    img.src = require("../assets/IEEN300.png");
    const doc = new jsPDF({ orientation: "portrait", format: "letter" });

    function createHeader() {
      doc.addImage(img, "png", 10, 5, 35, 21);
      doc.setFontSize(10);
      doc.setFont("helvica", "bold");
      if (movimiento.value.tipo_Movimiento == "Entrega Recepción") {
        doc.text(
          "INSTITUTO ESTATAL ELECTORAL DEL ESTADO DE NAYARIT \n \n VALE DE ENTREGA-RECEPCIÓN",
          110,
          15,
          null,
          null,
          "center"
        );
      } else {
        doc.text(
          "INSTITUTO ESTATAL ELECTORAL DEL ESTADO DE NAYARIT \n \n VALE DE TRASPASO",
          110,
          15,
          null,
          null,
          "center"
        );
      }

      //--------------------------------------------------------------------------//

      doc.setFillColor(84, 37, 131);
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.3);

      doc.rect(10, 30, 45, 5, "FD");
      doc.rect(10, 35, 45, 5, "FD");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(
        movimiento.value.tipo_Movimiento == "Entrega Recepción"
          ? "Entrega-Recepción"
          : "Traspaso",
        12,
        34
      );

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
    doc.text(movimiento.value.empleado, 40, 56);

    doc.rect(10, 58, 191.8, 7);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Cargo:", 15, 63);
    doc.setFont("helvetica", "normal");
    doc.text(movimiento.value.puesto, 30, 63);

    doc.rect(10, 65, 191.8, 7);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Área:", 15, 70);

    doc.setFont("helvetica", "normal");
    doc.text(movimiento.value.area, 28, 70);

    //--------------------------------------------------------------------------//

    var headerRecepcion = [
      [
        { content: "Clave" },
        { content: "No. Serie" },
        { content: "Descripción" },
        { content: "Marca" },
        { content: "Modelo" },
        { content: "Observaciones" },
        { content: "Color" },
        { content: "Importe" },
      ],
    ];
    var headerTraspaso = [
      [
        { content: "Clave" },
        { content: "No. Serie" },
        { content: "Descripción" },
        { content: "Marca" },
        { content: "Modelo" },
        { content: "Observaciones" },
        { content: "Asignación" },
        { content: "Asignado a" },
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
      head:
        movimiento.value.tipo_Movimiento == "Traspaso"
          ? headerTraspaso
          : headerRecepcion,
      body: list_Detalle.value.map((item) => [
        item.clave,
        item.no_Serie,
        item.descripcion,
        item.marca,
        item.modelo,
        item.observaciones,
        movimiento.value.tipo_Movimiento == "Entrega Recepción"
          ? item.color
          : item.destino,
        movimiento.value.tipo_Movimiento == "Entrega Recepción"
          ? item.importe
          : item.destino == "Personal"
          ? item.empleado
          : item.bodega_Destino,
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
      if (movimiento.value.tipo_Movimiento == "Traspaso") {
        doc.line(10, 230, 90, 230);
        doc.text(movimiento.value.empleado, 50, 235, null, null, "center");
        doc.text("Entregó", 50, 240, null, null, "center");
      } else {
        doc.line(70, 260, 145, 260);
        doc.text(
          `${movimiento.value.empleado}`,
          108,
          265,
          null,
          null,
          "center"
        );
        doc.text("Personal responsable", 108, 270, null, null, "center");
      }

      //--------------------------------------------------------------------------//
      if (movimiento.value.tipo_Movimiento == "Traspaso") {
        doc.line(125, 230, 205, 230);
        doc.text(
          `${miInventario.value.nombres} ${miInventario.value.apellido_Paterno} ${miInventario.value.apellido_Materno}`,
          165,
          235,
          null,
          null,
          "center"
        );
        doc.text("Recibió", 165, 240, null, null, "center");
      } else {
        doc.line(70, 260, 145, 260);
        doc.text(
          `${movimiento.value.empleado}`,
          108,
          265,
          null,
          null,
          "center"
        );
        doc.text("Personal responsable", 108, 270, null, null, "center");
      }
    } else {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      if (movimiento.value.tipo_Movimiento == "Traspaso") {
        doc.line(10, 230, 90, 230);
        doc.text(movimiento.value.empleado, 50, 235, null, null, "center");
        doc.text("Entregó", 50, 240, null, null, "center");
      } else {
        doc.line(70, 260, 145, 260);
        doc.text(
          `${movimiento.value.empleado}`,
          108,
          265,
          null,
          null,
          "center"
        );
        doc.text("Personal responsable", 108, 270, null, null, "center");
      }

      //--------------------------------------------------------------------------//
      if (movimiento.value.tipo_Movimiento == "Traspaso") {
        doc.line(125, 230, 205, 230);
        doc.text(
          `${miInventario.value.nombres} ${miInventario.value.apellido_Paterno} ${miInventario.value.apellido_Materno}`,
          165,
          235,
          null,
          null,
          "center"
        );
        doc.text("Recibió", 165, 240, null, null, "center");
      }
    }

    var newPageCount = doc.internal.getNumberOfPages();
    for (var i = 0; i < newPageCount; i++) {
      createHeader();
      createFooter();
    }

    //--------------------------------------------------------------------------//

    doc.save(
      `${
        movimiento.value.tipo_Movimiento == "Entrega Recepción"
          ? `ValeEntregaRecepcion${movimiento.value.folio}`
          : `ValeTraspaso${movimiento.value.folio}`
      }` + ".pdf"
    );
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
