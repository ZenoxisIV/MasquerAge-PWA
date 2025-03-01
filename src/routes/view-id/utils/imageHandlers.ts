export async function convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64String = (reader.result as string).split(",")[1];
            resolve(base64String);
        };
        reader.onerror = error => reject(error);
    });
}


export function base64ToImageFile(base64: string, filename: string, mimeType: string): File {
    const bstr = atob(base64);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mimeType });
}

export function loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = event.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export function cropImage(image: HTMLImageElement, cropFactor: number = 1): HTMLCanvasElement {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Canvas not supported");

	const baseSize = Math.min(image.width, image.height);
	const baseOffsetX = (image.width - baseSize) / 2;
	const baseOffsetY = (image.height - baseSize) / 2;

	const finalSize = baseSize * cropFactor;
	const extraOffsetX = baseOffsetX + (baseSize - finalSize) / 2;
	const extraOffsetY = baseOffsetY + (baseSize - finalSize) / 2;

	canvas.width = finalSize;
	canvas.height = finalSize;
	ctx.drawImage(image, extraOffsetX, extraOffsetY, finalSize, finalSize, 0, 0, finalSize, finalSize);

	return canvas;
}

export function convertToGrayscale(canvas: HTMLCanvasElement): HTMLCanvasElement {
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Canvas not supported");

	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	const data = imageData.data;

	// Loop through pixels and apply grayscale conversion
	for (let i = 0; i < data.length; i += 4) {
		const avg = (data[i] + data[i + 1] + data[i + 2]) / 3; // Average RGB values
		data[i] = avg;     // Red
		data[i + 1] = avg; // Green
		data[i + 2] = avg; // Blue
	}
	ctx.putImageData(imageData, 0, 0);

	return canvas;
}

export function canvasToFile(canvas: HTMLCanvasElement, fileType: string): Promise<File> {
    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            if (!blob) throw new Error("Canvas conversion failed");
            resolve(new File([blob], "cropped_image", { type: fileType }));
        }, fileType);
    });
}