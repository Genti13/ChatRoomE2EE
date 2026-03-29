# 🔐 CipherChat E2EE
### Chat en tiempo real con Cifrado de Extremo a Extremo (AES-256)

**CipherChat** es una aplicación de mensajería instantánea diseñada bajo el principio de **"Zero Knowledge"**. El servidor funciona únicamente como un puente de comunicación, mientras que el cifrado y descifrado de los mensajes ocurre exclusivamente en el cliente (navegador), garantizando que nadie —ni siquiera el administrador del backend— pueda leer las conversaciones.

---

## 🚀 Características Principales

* **E2EE Real:** Cifrado simétrico **AES-256** mediante `CryptoJS` antes de salir del dispositivo.
* **Comunicación Bilateral:** Uso de **WebSockets** para una experiencia de chat fluida y sin recargas.
* **Detección Dinámica de Dispositivos:** Interfaz adaptativa con hojas de estilo separadas para *Desktop* y *Mobile* servidas desde el backend.
* **Modo Híbrido de Interfaz:** Detección automática del tema del sistema operativo con persistencia mediante cookies.
* **Salas Privadas:** Sistema de salas basado en contraseñas que funcionan como claves de cifrado locales.

---

## 🛠️ Stack Tecnológico (Backend)

El corazón del proyecto corre sobre **Python 3.x** y utiliza un micro-framework para mantener la ligereza y velocidad.

### Dependencias Principales

| Librería | Propósito |
| :--- | :--- |
| **Flask** | Framework web principal para manejar rutas y renderizado de Jinja2. |
| **Flask-SocketIO** | Integración de WebSockets para comunicación en tiempo real. |
| **eventlet / gevent** | Servidor de red de alto rendimiento para conexiones concurrentes. |
| **pyyaml / user-agents** | Motor de detección de dispositivos para servir CSS específico. |
| **python-dotenv** | Gestión de variables de entorno y claves secretas del servidor. |

---

> [!IMPORTANT]
> **Nota de Seguridad:** Las claves de cifrado se derivan localmente en el navegador del usuario y nunca se transmiten al servidor en texto plano.
