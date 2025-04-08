import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pino from 'pino';
import Table from 'cli-table3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFilePath = path.join(__dirname, 'backend_server.log');

const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: { colorize: true },
    },
});

export function processNodeLogs() {
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

    let fastapiRequests = 0;
    let fastapiTimeouts = 0;
    let fastapiAuthFails = 0;
    let fastapiSuccess = 0;
    let dbQueries = 0;
    let dbFailures = 0;
    let invalidPCNs = 0;

    const fastapiInitMap = new Map(); // pid => timestamp
    const neonInitMap = new Map();    // pid => timestamp
    let fastapiRespSum = 0;
    let fastapiRespCount = 0;
    let neonRespSum = 0;
    let neonRespCount = 0;

    logs.forEach((line) => {
        let log;
        try {
            log = JSON.parse(line);
        } catch (err) {
            logger.warn('Invalid JSON log entry, skipping...');
            return;
        }

        const { internalCode, pid, time } = log;

        switch (internalCode) {
            case '[FastAPI-INIT]':
                fastapiRequests++;
                fastapiInitMap.set(pid, time);
                break;
            case '[FastAPI-FIN]':
                if (fastapiInitMap.has(pid)) {
                    const start = fastapiInitMap.get(pid);
                    const duration = time - start;
                    fastapiRespSum += duration;
                    fastapiRespCount++;
                    fastapiInitMap.delete(pid);
                }
                break;
            case '[FastAPI-RTO]':
                fastapiTimeouts++;
                break;
            case '[FastAPI-AuthFail]':
                fastapiAuthFails++;
                break;
            case '[FastAPI-SFail]':
                fastapiTimeouts++;
                break;
            case '[Neon-INIT]':
                dbQueries++;
                neonInitMap.set(pid, time);
                break;
            case '[Neon-FIN]':
                if (neonInitMap.has(pid)) {
                    const start = neonInitMap.get(pid);
                    const duration = time - start;
                    neonRespSum += duration;
                    neonRespCount++;
                    neonInitMap.delete(pid);
                }
                break;
            case '[Neon-DBFail]':
                dbFailures++;
                break;
            case '[Neon-InvPCN]':
                invalidPCNs++;
                break;
        }

        if (log.msg && log.msg.includes('isAdult')) {
            fastapiSuccess++;
        }
    });

    const avgFastapiTime = fastapiRespCount > 0 ? (fastapiRespSum / fastapiRespCount).toFixed(2) : 'N/A';
    const avgNeonTime = neonRespCount > 0 ? (neonRespSum / neonRespCount).toFixed(2) : 'N/A';

    const table = new Table({
        head: ['Node Server Metrics', 'Value'],
        colWidths: [35, 20],
    });

    table.push(
        ['FastAPI Requests', fastapiRequests],
        ['FastAPI Timeouts', fastapiTimeouts],
        ['Auth Failures (FastAPI)', fastapiAuthFails],
        ['Auth Success (isAdult calls)', fastapiSuccess],
        ['DB Queries (Neon)', dbQueries],
        ['DB Failures', dbFailures],
        ['Invalid PCNs', invalidPCNs],
        ['Avg FastAPI Response Time (ms)', avgFastapiTime],
        ['Avg Neon Response Time (ms)', avgNeonTime]
    );

    return table.toString() + '\n';
}
