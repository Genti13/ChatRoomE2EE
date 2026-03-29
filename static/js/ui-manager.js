export const UIManager = {
    actualizarScroll: () => {
        const $div = $('#mensajes');
        if ($div.length) $div.scrollTop($div[0].scrollHeight);
    },

    mostrarAviso: (texto, clase) => {
        const html = `
            <div class="mensaje-sistema-contenedor">
                <p class="${clase}" style="margin: 0;">${texto}</p>
            </div>`;
        $('#mensajes').append(html);
        UIManager.actualizarScroll();
    },

    mostrarBurbuja: (nombre, color, texto, esMio) => {
        const alineacion = esMio ? 'mi-mensaje' : 'otro-mensaje';
        const nombreHtml = esMio ? '' : `<div style="color: ${color}; font-weight: bold; margin-bottom: 4px; font-size: 0.85em;">${nombre}</div>`;

        const html = `
            <div class="mensaje-burbuja ${alineacion}">
                ${nombreHtml}
                <div style="line-height: 1.4;">${texto}</div>
            </div>`;
        $('#mensajes').append(html);
        UIManager.actualizarScroll();
    },

    toggleTheme: (setCookie) => {
        const $body = $('body');
        const $btn = $('#themeToggleBtn');
        $body.toggleClass('light-theme');

        const isLight = $body.hasClass('light-theme');
        setCookie('chatTheme', isLight ? 'light' : 'dark', 365);
        $btn.text(isLight ? '🌙' : '☀️');
    },
    mostrarPopup: (titulo, mensaje) => {
        $('#modalTitle').text(titulo);
        $('#modalMessage').text(mensaje);
        $('#customModal').fadeIn(200).css('display', 'flex');
    },

    cerrarPopup: () => {
        $('#customModal').fadeOut(200);
    }
};