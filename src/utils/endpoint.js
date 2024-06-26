export const endpoint = 'http://localhost:8080'

export function fromBase64(base64Data) {
    try {
        const byteString = atob(base64Data);
        const buffer = new ArrayBuffer(byteString.length);
        const intArray = new Uint8Array(buffer);
        
        for (let i = 0; i < byteString.length; i++) {
            intArray[i] = byteString.charCodeAt(i);
        }
        
        const blob = new Blob([buffer], { type: 'image/png' });
        const imageUrl = URL.createObjectURL(blob);

        return imageUrl;
    } catch (error) {
        console.error('Error decoding base64 string', error);
        return null;
    }
}
