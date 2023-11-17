const leerQR = (text) => {
  let clave = "No?Inventario";
  const inicio = text.indexOf(`{UIEEN{,{${clave}{Ñ{`) + clave.length + 12;
  const fin = text.indexOf("{, {", inicio);
  const result = text.substring(inicio, fin);
  const no_Inventario = result.replaceAll("'", "-");
  return no_Inventario;
};
export default leerQR;
