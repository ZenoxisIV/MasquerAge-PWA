import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { performance } from 'perf_hooks';
import { Jimp } from 'jimp';
import jsQR from 'jsqr';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const qrDir = path.join(__dirname, 'qr-codes');
const logFilePath = path.join(__dirname, 'qr_performance.log');

if (!fs.existsSync(qrDir)) {
    // console.error(`QR directory '${qrDir}' not found!`);
    process.exit(1);
}

if (fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, '', 'utf-8'); // Clears the file
    // console.log('Cleared existing log file:', logFilePath);
}

function getRandomQRCode() {
    const files = fs.readdirSync(qrDir).filter(file => file.endsWith('.png'));
    if (files.length === 0) throw new Error('No QR code images found');
    const randomFile = files[Math.floor(Math.random() * files.length)];
    return path.join(qrDir, randomFile);
}

function logPerformance(timeTaken) {
    const logEntry = `${new Date().toISOString()} - DecodeTime: ${timeTaken.toFixed(3)}ms\n`;
    fs.appendFileSync(logFilePath, logEntry);
}

export async function decodeQRCode() {
    try {
        const qrPath = getRandomQRCode();
        const image = await Jimp.read(qrPath);
        const width = image.bitmap.width;
        const height = image.bitmap.height;
        const imageData = new Uint8ClampedArray(image.bitmap.data.buffer);

        const start = performance.now();
        const decodedQR = jsQR(imageData, width, height);
        const end = performance.now();
        
        const timeTaken = end - start;
        logPerformance(timeTaken);

        if (!decodedQR) {
            // console.error('Failed to decode QR');
            return null;
        }

        const data = JSON.parse(decodedQR.data);
        // console.log(`Decoded QR from ${qrPath} in ${timeTaken.toFixed(3)}ms`, data);
        
        return { uin: data.subject.UIN, dob: data.subject.DOB };
    } catch (err) {
        // console.error('Error decoding QR:', err);
        return null;
    }
}
