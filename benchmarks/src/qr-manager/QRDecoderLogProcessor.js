import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pino from 'pino';
import Table from 'cli-table3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFilePath = path.join(__dirname, 'qr_performance.log');

const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: { colorize: true },
    },
});

export function processDecoderLogs() {
    if (!fs.existsSync(logFilePath)) {
        logger.error('Log file not found!');
        return;
    }

    const logs = fs.readFileSync(logFilePath, 'utf-8')
        .split('\n')
        .filter(line => line.trim() !== '');

    if (logs.length === 0) {
        logger.warn('No logs to process.');
        return;
    }

    let totalTime = 0;
    let count = 0;
    let fastest = Infinity;
    let slowest = 0;
    let successCount = 0;
    let failureCount = 0;

    logs.forEach(log => {
        const statusMatch = log.match(/"decodeStatus":(true|false)/);
        if (statusMatch) {
            const isSuccess = statusMatch[1] === 'true';
            isSuccess ? successCount++ : failureCount++;

            if (isSuccess) {
                const timeMatch = log.match(/"QRDecodeTimeMs":(\d+\.\d+)/);
                if (timeMatch) {
                    const time = parseFloat(timeMatch[1]);
                    totalTime += time;
                    count++;

                    if (time < fastest) fastest = time;
                    if (time > slowest) slowest = time;
                }
            }
        }
    });

    if (count === 0) {
        logger.error('No successful QR decode log entries found.');
        return;
    }

    const avgTime = totalTime / count;
    const avgPerSec = (1000 / avgTime).toFixed(3);

    const table = new Table({
        head: ['QR Decoding Metrics', 'Value'],
        colWidths: [30, 20],
    });

    table.push(
        ['Successful Decodes', successCount],
        ['Failed Decodes', failureCount],
        ['Total Decoded', count],
        ['Avg Decode Time', `${avgTime.toFixed(3)} ms`],
        ['Fastest Decode Time', `${fastest.toFixed(3)} ms`],
        ['Slowest Decode Time', `${slowest.toFixed(3)} ms`],
        ['Avg Decodes per Sec', avgPerSec]
    );

    return table.toString() + '\n';
}
