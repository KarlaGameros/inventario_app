import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useMovimientoInventario } from "src/stores/movimiento_inventario";
import { storeToRefs } from "pinia";
import { useMiInventarioStore } from "src/stores/mi_inventario";
import { useEmpleadosStore } from "src/stores/empleados_store";

const EntregaRecepcion = async () => {
  try {
    const miInventarioStore = useMiInventarioStore();
    const movimientosStore = useMovimientoInventario();
    const empleadoStore = useEmpleadosStore();
    const { movimiento, list_Detalle } = storeToRefs(movimientosStore);
    const { miInventario } = storeToRefs(miInventarioStore);
    const { empleado, personal_Id, personal_Id_Elaboro } =
      storeToRefs(empleadoStore);
    await movimientosStore.loadMovimiento(movimiento.value.id);
    await movimientosStore.loadDetalleMovimiento(movimiento.value.id);
    let img = new Image();
    img.src = require("../assets/IEEN300.png");
    const doc = new jsPDF({
      orientation:
        movimiento.value.tipo_Movimiento == "Entrega Recepción" ||
        movimiento.value.concepto == "Reemplazo"
          ? "landscape"
          : "portrait",
      format: "letter",
    });
    function createHeader() {
      doc.addImage(img, "png", 10, 5, 35, 21);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      if (movimiento.value.tipo_Movimiento == "Entrega Recepción") {
        doc.text(
          "INSTITUTO ESTATAL ELECTORAL DE NAYARIT \n \n VALE DE ENTREGA-RECEPCIÓN",
          140,
          15,
          null,
          null,
          "center"
        );
      } else if (movimiento.value.concepto == "Reemplazo") {
        doc.text(
          `INSTITUTO ESTATAL ELECTORAL DE NAYARIT \n \n VALE DE TRASPASO - REEMPLAZO`,
          140,
          15,
          null,
          null,
          "center"
        );
      } else {
        doc.text(
          `INSTITUTO ESTATAL ELECTORAL DE NAYARIT \n \n VALE DE TRASPASO ${
            movimiento.value.concepto != "Traspaso"
              ? `- ${movimiento.value.concepto.toUpperCase()}`
              : ""
          }`,
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

      if (
        movimiento.value.tipo_Movimiento == "Entrega Recepción" ||
        movimiento.value.concepto == "Reemplazo"
      ) {
        doc.setFillColor(84, 37, 131);
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.3);
        doc.rect(10, 45, 255, 6, "FD");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.text("DATOS DEL RESPONSABLE", 140, 49, null, null, "center");

        doc.setTextColor(0, 0, 0);

        doc.rect(10, 51, 255, 7, "FD");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Responsable: ", 15, 56);
        doc.setFont("helvetica", "normal");
        doc.text(movimiento.value.empleado, 40, 56);

        doc.rect(10, 58, 255, 7);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Cargo:", 15, 63);
        doc.setFont("helvetica", "normal");
        doc.text(movimiento.value.puesto, 30, 63);

        doc.rect(10, 65, 255, 7);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Área:", 15, 70);

        doc.setFont("helvetica", "normal");
        doc.text(movimiento.value.area, 28, 70);
      } else if (
        movimiento.value.tipo_Movimiento == "Traspaso" &&
        (movimiento.value.concepto.includes("Pendiente") ||
          movimiento.value.concepto == "Traspaso bodegas")
      ) {
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
        doc.text(personal_Id_Elaboro.value.label, 40, 56);
        doc.rect(10, 58, 191.8, 7);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Cargo:", 15, 63);
        doc.setFont("helvetica", "normal");
        doc.text(personal_Id_Elaboro.value.puesto, 30, 63);

        doc.rect(10, 65, 191.8, 7);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Área:", 15, 70);

        doc.setFont("helvetica", "normal");
        doc.text(personal_Id_Elaboro.value.area, 28, 70);
      } else {
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
      }
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

    //--------------------------------------------------------------------------//

    var header = [
      [
        { content: "Clave" },
        { content: "No. Serie" },
        { content: "Descripción" },
        { content: "Marca" },
        { content: "Modelo" },
        { content: "Observaciones" },
        { content: "Asignado a" },
      ],
    ];

    var headerTraspasoPen = [
      [
        { content: "Clave" },
        { content: "No. Serie" },
        { content: "Descripción" },
        { content: "Marca" },
        { content: "Modelo" },
        { content: "Observaciones" },
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

    const columnStyles = {
      0: {
        cellWidth: 25,
      },
    };

    autoTable(doc, {
      theme: "grid",
      startY: 72,
      margin: { left: 10, rigth: 10, top: 72 },
      head:
        movimiento.value.concepto != "Traspaso" &&
        movimiento.value.concepto != "Reemplazo"
          ? headerTraspasoPen
          : header,
      body: list_Detalle.value.map((item) => [
        item.clave,
        item.no_Serie,
        item.descripcion,
        item.marca,
        item.modelo,
        item.observaciones,
        item.destino == "Personal" ? item.empleado : item.bodega_Destino,
      ]),
      bodyStyles: { fontSize: 8, textColor: [0, 0, 0] },
      tableLineColor: [0, 0, 0],
      columnStyles: columnStyles,
    });

    var maxY = 222;
    var currentY = doc.lastAutoTable.finalY;

    if (movimiento.value.tipo_Movimiento == "Entrega Recepción") {
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
        doc.text(movimiento.value.empleado, 50, 195, null, null, "center");
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
        doc.text(empleado.value.nombres, 225, 195, null, null, "center");
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
        doc.text(movimiento.value.empleado, 50, 195, null, null, "center");
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

        doc.text(empleado.value.nombres, 225, 195, null, null, "center");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text("Responsable de área", 225, 200, null, null, "center");
      }
    } else if (movimiento.value.concepto == "Reemplazo") {
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
        doc.text(movimiento.value.empleado, 50, 195, null, null, "center");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text("Entregó", 50, 200, null, null, "center");

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
        doc.text(personal_Id.value.label, 225, 195, null, null, "center");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text("Recibió", 225, 200, null, null, "center");
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
        doc.text(movimiento.value.empleado, 50, 195, null, null, "center");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text("Entregó", 50, 200, null, null, "center");

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

        doc.text(personal_Id.value.label, 225, 195, null, null, "center");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text("Recibió", 225, 200, null, null, "center");
      }
    } else {
      if (currentY > maxY) {
        doc.addPage();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        if (
          movimiento.value.tipo_Movimiento == "Traspaso" &&
          movimiento.value.concepto != null &&
          !movimiento.value.concepto.includes("Pendiente") &&
          movimiento.value.concepto != "Traspaso bodegas"
        ) {
          doc.line(10, 230, 90, 230);
          doc.text(
            movimiento.value.empleado == null
              ? movimiento.value.capturista
              : movimiento.value.empleado,
            50,
            235,
            null,
            null,
            "center"
          );
          doc.text("Entregó", 50, 240, null, null, "center");
        } else if (
          movimiento.value.tipo_Movimiento == "Traspaso" &&
          movimiento.value.concepto != null &&
          (movimiento.value.concepto.includes("Pendiente") ||
            movimiento.value.concepto == "Traspaso bodegas")
        ) {
          doc.line(10, 230, 90, 230);
          doc.text(
            personal_Id_Elaboro.value.label,
            50,
            235,
            null,
            null,
            "center"
          );
          doc.text("Elaboró", 50, 240, null, null, "center");
        } else {
          doc.line(70, 260, 145, 260);
          doc.text(
            `${
              movimiento.value.empleado == null
                ? movimiento.value.capturista
                : movimiento.value.empleado
            }`,
            108,
            265,
            null,
            null,
            "center"
          );
          doc.text("Personal responsable", 108, 270, null, null, "center");
        }

        //--------------------------------------------------------------------------//
        if (
          movimiento.value.tipo_Movimiento == "Traspaso" &&
          movimiento.value.concepto != null &&
          !movimiento.value.concepto.includes("Pendiente") &&
          movimiento.value.concepto != "Traspaso bodegas"
        ) {
          doc.line(125, 230, 205, 230);
          doc.text(
            `${personal_Id.value.label}`,
            165,
            235,
            null,
            null,
            "center"
          );
          doc.text("Recibió", 165, 240, null, null, "center");
        } else if (
          movimiento.value.tipo_Movimiento == "Traspaso" &&
          movimiento.value.concepto != null &&
          (movimiento.value.concepto.includes("Pendiente") ||
            movimiento.value.concepto == "Traspaso bodegas")
        ) {
          doc.line(125, 230, 205, 230);
          doc.text(
            `${personal_Id.value.label}`,
            165,
            235,
            null,
            null,
            "center"
          );
          doc.text("Vo. Bo.", 165, 240, null, null, "center");
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
        if (
          movimiento.value.tipo_Movimiento == "Traspaso" &&
          movimiento.value.concepto != null &&
          !movimiento.value.concepto.includes("Pendiente") &&
          movimiento.value.concepto != "Traspaso bodegas"
        ) {
          doc.line(10, 230, 90, 230);
          doc.text(
            movimiento.value.empleado == null
              ? movimiento.value.capturista
              : movimiento.value.empleado,
            50,
            235,
            null,
            null,
            "center"
          );
          doc.text("Entregó", 50, 240, null, null, "center");
        } else if (
          movimiento.value.tipo_Movimiento == "Traspaso" &&
          movimiento.value.concepto != null &&
          (movimiento.value.concepto.includes("Pendiente") ||
            movimiento.value.concepto == "Traspaso bodegas")
        ) {
          doc.line(10, 230, 90, 230);
          doc.text(
            personal_Id_Elaboro.value.label,
            50,
            235,
            null,
            null,
            "center"
          );
          doc.text("Elaboró", 50, 240, null, null, "center");
        } else {
          doc.line(70, 260, 145, 260);
          doc.text(
            `${
              movimiento.value.empleado == null
                ? movimiento.value.capturista
                : movimiento.value.empleado
            }`,
            108,
            265,
            null,
            null,
            "center"
          );
          doc.text("Personal responsable", 108, 270, null, null, "center");
        }
        //--------------------------------------------------------------------------//

        if (
          movimiento.value.tipo_Movimiento == "Traspaso" &&
          movimiento.value.concepto != null &&
          !movimiento.value.concepto.includes("Pendiente") &&
          movimiento.value.concepto != "Traspaso bodegas"
        ) {
          doc.line(125, 230, 205, 230);
          doc.text(
            `${personal_Id.value.label}`,
            165,
            235,
            null,
            null,
            "center"
          );
          doc.text("Recibió", 165, 240, null, null, "center");
        } else if (
          movimiento.value.tipo_Movimiento == "Traspaso" &&
          movimiento.value.concepto != null &&
          (movimiento.value.concepto.includes("Pendiente") ||
            movimiento.value.concepto == "Traspaso bodegas")
        ) {
          doc.line(125, 230, 205, 230);
          doc.text(
            `${personal_Id.value.label}`,
            165,
            235,
            null,
            null,
            "center"
          );
          doc.text("Vo. Bo.", 165, 240, null, null, "center");
        }
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
