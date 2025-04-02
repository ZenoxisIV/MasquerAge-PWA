import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { performance } from 'perf_hooks';
import { Jimp } from 'jimp';
import jsQR from 'jsqr';
import pino from 'pino';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const qrDir = path.join(__dirname, 'qr-codes');
const logFilePath = path.join(__dirname, 'qr_performance.log');

const logger = pino({
    transport: {
        target: 'pino/file',
        options: {
            destination: logFilePath,
            mkdir: true
        }
    }
});

if (!fs.existsSync(qrDir)) {
    logger.error(`QR directory '${qrDir}' not found!`);
    process.exit(1);
}

function getRandomQRCode() {
    const files = fs.readdirSync(qrDir).filter(file => file.endsWith('.png'));
    if (files.length === 0) throw new Error('No QR code images found');
    const randomFile = files[Math.floor(Math.random() * files.length)];
    return path.join(qrDir, randomFile);
}

function logPerformance(timeTaken) {
    logger.info({
        QRDecodeTimeMs: timeTaken
    });
}

export async function decodeQRCode(clearLogs = false) {
    if (clearLogs && fs.existsSync(logFilePath)) {
        fs.writeFileSync(logFilePath, '', 'utf-8');
    }

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
            logger.error('Failed to decode QR');
            return null;
        }

        const data = JSON.parse(decodedQR.data);

        return { uin: data.subject.UIN, dob: data.subject.DOB };
    } catch (err) {
        logger.error(`Error decoding QR: ${err.message}`);
        return null;
    }
}
