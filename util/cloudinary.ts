export const uploadImageToCloudinary = async (file: File, folderName: string, signal?: AbortSignal): Promise<string | null> => {
    const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!CLOUD_NAME || !UPLOAD_PRESET) return null;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', `prime-basket/products/${folderName}`);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData,
            signal
        });

        const data = await response.json();
        return data.secure_url || null;
    } catch (error: any) {
        if (error.name === 'AbortError') {
            console.log("Upload cancelled");
        }
        return null;
    }
};