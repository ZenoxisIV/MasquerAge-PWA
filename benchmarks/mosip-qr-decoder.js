import fs from 'fs';
import path from 'path';
import { Jimp } from 'jimp';
import jsQR from 'jsqr';
import { performance } from 'perf_hooks';

const folderPath = path.join(process.cwd(), 'k6-qr-codes');
const outputFilePath = path.join(process.cwd(), 'decoded_qr_data.json');

async function decodeQR(filePath) {
    try {
        console.time(`Decoding time for ${filePath}`);
        const start = performance.now();

        const image = await Jimp.read(filePath);
        const width = image.bitmap.width;
        const height = image.bitmap.height;
        const imageData = new Uint8ClampedArray(image.bitmap.data.buffer);

        const code = jsQR(imageData, width, height);
        const end = performance.now();
        
        console.timeEnd(`Decoding time for ${filePath}`);
        console.log(`Time taken: ${(end - start).toFixed(2)} ms`);

        if (code) {
            return code.data;
        } else {
            console.warn(`No QR code found in ${filePath}`);
            return null;
        }
    } catch (error) {
        console.error(`Error decoding ${filePath}:`, error);
        return null;
    }
}

async function processQRCodes() {
    console.time("Total decoding time");
    const overallStart = performance.now();

    const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.png'));
    const decodedData = [];

    for (const file of files) {
        const filePath = path.join(folderPath, file);
        try {
            const qrData = await decodeQR(filePath);
            if (qrData) {
                const jsonData = JSON.parse(qrData);
                decodedData.push({
                    uin: jsonData.subject.UIN,
                    dob: jsonData.subject.DOB,
                });
            }
        } catch (error) {
            console.error(`Failed to decode ${file}:`, error);
        }
    }

    fs.writeFileSync(outputFilePath, JSON.stringify(decodedData, null, 2));

    const overallEnd = performance.now();
    console.timeEnd("Total decoding time");
    console.log(`Total time taken: ${(overallEnd - overallStart).toFixed(2)} ms`);
    console.log(`Decoded QR data saved to ${outputFilePath}`);
}

processQRCodes();
