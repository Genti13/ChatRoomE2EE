import { setCookie, getCookie } from './utils.js';
import { CryptoManager } from './crypto-manager.js';
import { UIManager } from './ui-manager.js';

const socket = io();
let miUsuario, miColor, miSala, miContrasena;

$(document).ready(() => {
    // 1. Cargar datos iniciales
    $('#username').val(getCookie('chatUsername'));
    $('#userColor').val(getCookie('chatColor') || '#8a2be2');
    cargarSalasRecientes();

    // 2. Sincronizar Icono de Tema (Jinja puso la clase, nosotros ponemos el emoji)
    const $btnTema = $('#themeToggleBtn');
    $btnTema.text($('body').hasClass('light-theme') ? '🌙' : '☀️');

    // --- ASIGNACIÓN DE EVENTOS (Reemplaza a los onclick) ---

    $btnTema.on('click', () => UIManager.toggleTheme(setCookie));

    $('#conectarBtn').on('click', conectar);

    $('#salirBtn').on('click', salirSala);

    $('#enviarBtn').on('click', enviarMensaje);

    $('#mensajeInput').on('keypress', (e) => {
        if (e.which === 13) enviarMensaje();
    });

    $('#emojiBtn').on('click', () => {
        $('#emojiPicker').toggle().css('display', (i, v) => v === 'block' ? 'flex' : v);
    });

    // Delegación de eventos para los emojis
    $('.emoji-opt').on('click', function () {
        const emoji = $(this).text();
        const $input = $('#mensajeInput');
        $input.val($input.val() + emoji).focus();
    });

    // Escuchar cambios del sistema (Híbrido)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!getCookie('chatTheme')) {
            const isDark = e.matches;
            $('body').toggleClass('light-theme', !isDark);
            $btnTema.text(isDark ? '☀️' : '🌙');
        }
    });

    $('#modalCloseBtn').on('click', () => UIManager.cerrarPopup());

    // Opcional: Cerrar al tocar fuera de la caja
    $('#customModal').on('click', function (e) {
        if (e.target === this) UIManager.cerrarPopup();
    });
});

// --- FUNCIONES DE LÓGICA ---

function conectar() {
    miUsuario = $('#username').val();
    miColor = $('#userColor').val();
    miSala = $('#room').val();
    miContrasena = $('#password').val();

    if (miUsuario && miSala && miContrasena) {
        setCookie('chatUsername', miUsuario, 7);
        setCookie('chatColor', miColor, 7);
        guardarSalaReciente(miSala, miContrasena);

        $('#login').hide();
        $('#chat').css('display', 'flex');
        $('#roomTitle').text("Sala: " + miSala);
        socket.emit('join', { username: miUsuario, room: miSala });
    } else {
        UIManager.mostrarPopup("Campos incompletos", `${miUsuario || "Usuario,"} por favor complete todos los datos para poder entrar a la sala."`);
    }
}

function enviarMensaje() {
    const texto = $('#mensajeInput').val();
    if (!texto) return;

    const cifrado = CryptoManager.encrypt(texto, miContrasena);
    socket.emit('send_message', {
        username: miUsuario,
        color: miColor,
        room: miSala,
        mensaje_cifrado: cifrado
    });
    $('#mensajeInput').val('').focus();
    $('#emojiPicker').hide();
}

function salirSala() {
    socket.emit('leave', { username: miUsuario, room: miSala });
    $('#mensajes').empty();
    $('#chat').hide();
    $('#login').show();
    cargarSalasRecientes();
}

function guardarSalaReciente(nombre, pass) {
    let salas = getCookie('salasGuardadas') ? JSON.parse(getCookie('salasGuardadas')) : [];
    salas = salas.filter(s => s.nombre !== nombre);
    salas.unshift({ nombre, pass });
    if (salas.length > 5) salas.pop();
    setCookie('salasGuardadas', JSON.stringify(salas), 7);
}

function cargarSalasRecientes() {
    let salas = getCookie('salasGuardadas') ? JSON.parse(getCookie('salasGuardadas')) : [];
    const $lista = $('#listaSalas');
    $lista.empty();

    if (salas.length > 0) {
        $('#historialSalas').show();
        salas.forEach(sala => {
            $('<button>')
                .addClass('sala-reciente-btn')
                .text(sala.nombre)
                .on('click', () => {
                    $('#room').val(sala.nombre);
                    $('#password').val(sala.pass);
                })
                .appendTo($lista);
        });
    }
}

// Handlers de Socket
socket.on('receive_message', (data) => {
    const descifrado = CryptoManager.decrypt(data.mensaje_cifrado, miContrasena);
    if (descifrado) {
        UIManager.mostrarBurbuja(data.username, data.color, descifrado, data.username === miUsuario);
    } else {
        UIManager.mostrarAviso(`Error de cifrado`, 'msg-error');
    }
});

socket.on('server_message', (data) => UIManager.mostrarAviso(data.msg, 'msg-sistema'));