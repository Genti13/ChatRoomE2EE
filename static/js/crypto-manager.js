// Lógica de Cifrado E2EE
export const CryptoManager = {
    encrypt: (texto, clave) => {
        return CryptoJS.AES.encrypt(texto, clave).toString();
    },
    decrypt: (textoCifrado, clave) => {
        try {
            const bytes = CryptoJS.AES.decrypt(textoCifrado, clave);
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch (e) {
            return null;
        }
    }
};