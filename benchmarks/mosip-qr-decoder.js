import fs from 'fs';
import path from 'path';
import {Jimp} from 'jimp';
import jsQR from 'jsqr';

const folderPath = path.join(process.cwd(), 'k6-qr-codes');
const outputFilePath = path.join(process.cwd(), 'decoded_qr_data.json');

async function decodeQR(filePath) {
    try {
        const image = await Jimp.read(filePath);
        const width = image.bitmap.width;
        const height = image.bitmap.height;
        const imageData = new Uint8ClampedArray(image.bitmap.data.buffer);

        const code = jsQR(imageData, width, height);
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
    console.log(`Decoded QR data saved to ${outputFilePath}`);
}

processQRCodes();
