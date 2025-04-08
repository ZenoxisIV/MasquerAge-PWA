import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pino from 'pino';
import Table from 'cli-table3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFilePath = path.join(__dirname, 'authenticator.log');

const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: { colorize: true },
    },
});

export function processAuthLogs() {
    if (!fs.existsSync(logFilePath)) {
        logger.error('Log file not found!');
        return;
    }

    const rawLines = fs.readFileSync(logFilePath, 'utf-8')
        .split('\n')
        .filter(line => line.trim() !== '');

    if (rawLines.length === 0) {
        logger.warn('No logs to process.');
        return;
    }

    const START_TAG = 'Received Auth Request for demographic.';
    const END_TAG = 'Auth Request for Demographic Completed.';

    const sessions = [];
    let currentStart = null;

    rawLines.forEach(line => {
        const timestampMatch = line.match(/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3})/);
        if (!timestampMatch) return;

        const ts = new Date(timestampMatch[1].replace(',', '.'));

        if (line.includes(START_TAG)) {
            if (currentStart !== null) {
                logger.warn('Ignoring extra "start" tag without matching "end" tag.');
                return;
            }
            currentStart = ts;
        }

        if (line.includes(END_TAG)) {
            if (currentStart === null) {
                logger.warn('Ignoring "end" tag without matching "start" tag.');
                return;
            }
            const duration = ts - currentStart;
            sessions.push(duration);
            currentStart = null;
        }
    });

    if (sessions.length === 0) {
        logger.error('No completed auth sessions found.');
        return;
    }

    const total = sessions.length;
    const sum = sessions.reduce((sum, v) => sum + v, 0);
    const avg = sum / total;
    const fastest = Math.min(...sessions);
    const slowest = Math.max(...sessions);

    const table = new Table({
        head: ['MOSIP Demographic Auth Metrics', 'Value'],
        colWidths: [35, 20],
    });

    table.push(
        ['MOSIP Requests Completed', total],
        ['Avg MOSIP Auth Time', `${avg.toFixed(3)} ms`],
        ['Fastest MOSIP Auth Time', `${fastest} ms`],
        ['Slowest MOSIP Auth Time', `${slowest} ms`],
    );

    return table.toString() + '\n';
}

