// Manejo de Cookies
export function setCookie(nombre, valor, dias) {
    let fecha = new Date();
    fecha.setTime(fecha.getTime() + (dias * 24 * 60 * 60 * 1000));
    let expira = "expires=" + fecha.toUTCString();
    document.cookie = nombre + "=" + encodeURIComponent(valor) + ";" + expira + ";path=/";
}

export function getCookie(nombre) {
    let nombreC = nombre + "=";
    let decodificado = decodeURIComponent(document.cookie);
    let arreglo = decodificado.split(';');
    for (let c of arreglo) {
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(nombreC) == 0) return c.substring(nombreC.length, c.length);
    }
    return "";
}