export function convertToBase64(file: File): Promise<string> {
    
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const result = e.target?.result;
            if (typeof result === "string") resolve(result);
            else reject("Failed to read file as base64");
        };

        reader.onerror = () => reject("File reading error");

        reader.readAsDataURL(file);
    });
}
