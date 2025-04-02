import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFilePath = path.join(__dirname, 'qr_performance.log');

function processDecoderLogs() {
    if (!fs.existsSync(logFilePath)) {
        console.log(chalk.bgRed.black(' ERROR ') + chalk.red(' Log file not found!'));
        return;
    }

    const logs = fs.readFileSync(logFilePath, 'utf-8').split('\n').filter(line => line);
    if (logs.length === 0) {
        console.log(chalk.bgYellow.black(' WARNING ') + chalk.yellow(' No logs to process.'));
        return;
    }

    let totalTime = 0;
    let count = 0;
    let fastest = Infinity;
    let slowest = 0;

    logs.forEach(log => {
        const match = log.match(/DecodeTime: (\d+\.\d+)ms/);
        if (match) {
            const time = parseFloat(match[1]);
            totalTime += time;
            count++;

            if (time < fastest) fastest = time;
            if (time > slowest) slowest = time;
        }
    });

    if (count === 0) {
        console.log(chalk.bgRed.black(' ERROR ') + chalk.red(' No valid log entries found.'));
        return;
    }

    const avgTime = totalTime / count;
    const avgPerSec = (1000 / avgTime).toFixed(3);

    console.log(chalk.blue.bold('══════════════════════════════════'));
    console.log(chalk.green.bold('  QR Code Decoding Performance  '));
    console.log(chalk.blue.bold('══════════════════════════════════'));
    console.log(
        chalk.bold(' Total Decoded:        ') + chalk.cyanBright(String(count).padStart(10))
    );
    console.log(
        chalk.bold(' Avg Decode Time:      ') + chalk.magenta(String(avgTime.toFixed(3) + ' ms').padStart(10))
    );
    console.log(
        chalk.bold(' Fastest Decode Time:  ') + chalk.greenBright(String(fastest.toFixed(3) + ' ms').padStart(10))
    );
    console.log(
        chalk.bold(' Slowest Decode Time:  ') + chalk.redBright(String(slowest.toFixed(3) + ' ms').padStart(10))
    );
    console.log(
        chalk.bold(' Avg Decodes per Sec:  ') + chalk.yellowBright(String(avgPerSec).padStart(10))
    );
    console.log(chalk.blue.bold('══════════════════════════════════'));
}

processDecoderLogs();
