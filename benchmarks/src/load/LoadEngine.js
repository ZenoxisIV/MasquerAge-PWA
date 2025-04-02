import HttpRequest from '../http/HttpRequest.js';
import ora from 'ora';
import Table from 'cli-table3';
import { decodeQRCode } from '../qr-manager/QRDecoderEngine.js';
import pino from 'pino';
import { processDecoderLogs } from '../qr-manager/QRDecoderLogProcessor.js';

export default class MasquerAgeLoadTest {
    constructor(options = {}) {
        const defaultOptions = {
            targetUrl: '',
            vus: 1,
            duration: 5000,
            iterations: null,
            method: 'GET',
            body: null,
            logLevel: 'info',
        };

        Object.assign(this, defaultOptions, options);

        if (!this.targetUrl) {
            throw new Error('A targetUrl must be provided.');
        }

        this.logger = pino({
            level: this.logLevel,
            transport: {
                target: 'pino-pretty',
                options: { colorize: true },
            },
        });

        this.httpRequest = new HttpRequest(this.targetUrl);
    }

    async run() {
        this.logger.info(`Starting load test on ${this.targetUrl} with ${this.vus} VUs...\n`);
        
        let results = [];
        let completedRequests = 0;
        const startTime = Date.now();
        const endTime = this.iterations ? null : startTime + this.duration;
        let clearLogs = true;

        const spinner = ora('Running load test...\n').start();
        
        // Worker function
        const worker = async (vu) => {
            try {
                while (this.iterations ? completedRequests < this.iterations : Date.now() < endTime) {
                    if (this.iterations && completedRequests >= this.iterations) break;
                    
                    const result = await this.httpRequest.sendRequest(this.method, this.body ? this.body : decodeQRCode(clearLogs));
                    clearLogs = false;
                    results.push(result);
                    completedRequests++;
                }
            } catch (error) {
                this.logger.error(`Error in worker ${vu}: ${error.message}`);
            }
        };

        // Start all VUs
        const workers = Array.from({ length: this.vus }, (_, i) => worker(i + 1));
        await Promise.all(workers);

        spinner.succeed('Load test completed!');
        this.logger.info('Load test completed successfully.');
        this.analyzeResults(results);
    }

    calculateStats(values) {
        values.sort((a, b) => a - b);
        const len = values.length;
        const avg = values.reduce((sum, v) => sum + v, 0) / len;
        const min = values[0];
        const max = values[len - 1];
        const med = values[Math.floor(len / 2)];
        const p90 = values[Math.floor(len * 0.9)];
        const p95 = values[Math.floor(len * 0.95)];
        return { avg, min, med, max, p90, p95 };
    }

    formatBytes(bytes) {
        if (bytes < 1024) return `${bytes} B`;
        const kb = bytes / 1024;
        if (kb < 1024) return `${kb.toFixed(2)} KB`;
        const mb = kb / 1024;
        if (mb < 1024) return `${mb.toFixed(2)} MB`;
        const gb = mb / 1024;
        return `${gb.toFixed(2)} GB`;
    }

    analyzeResults(results) {
        let metrics = {
            http_req_duration: [],
            http_req_failed: 0,
            data_received: [],
            data_sent: [],
            http_reqs: results.length,
        };

        results.forEach(({ status, ...timings }) => {
            if (status === 'error' || status === 'timeout') {
                metrics.http_req_failed += 1;
            } else {
                Object.keys(metrics).forEach((key) => {
                    if (key !== 'http_req_failed' && key !== 'http_reqs') {
                        metrics[key].push(timings[key] || 0);
                    }
                });
            }
        });

        // Table for request duration
        const durationTable = new Table({
            head: ['Overall Transaction Duration', 'Avg (ms)', 'Min (ms)', 'Med (ms)', 'Max (ms)', 'p(90) (ms)', 'p(95) (ms)'],
            colWidths: [30, 15, 15, 15, 15, 15, 15],
            style: { head: ['cyan'], border: ['grey'], compact: true }
        });

        // Table for data sent/received
        const dataTable = new Table({
            head: ['Client-side Data Metrics', 'Avg (bytes)', 'Avg Rate (bytes/s)'],
            colWidths: [30, 20, 20],
            style: { head: ['yellow'], border: ['grey'], compact: true }
        });

        // Table for HTTP requests
        const httpReqTable = new Table({
            head: ['Client-side Requests', 'Count', 'Rate (req/s)'],
            colWidths: [30, 25, 20],
            style: { head: ['magenta'], border: ['grey'], compact: true }
        });

        const stats = this.calculateStats(metrics.http_req_duration);
        durationTable.push([ 
            'http_req_duration',
            this.colorize(stats.avg ? stats.avg.toFixed(5) : '-', 'green'),
            this.colorize(stats.min ? stats.min.toFixed(5): '-', 'blue'),
            this.colorize(stats.med ? stats.med.toFixed(5): '-', 'yellow'),
            this.colorize(stats.max ? stats.max.toFixed(5) : '-', 'red'),
            this.colorize(stats.p90 ? stats.p90.toFixed(5): '-', 'cyan'),
            this.colorize(stats.p95 ? stats.p95.toFixed(5) : '-', 'magenta'),
        ]);;

        dataTable.push([ 
            'data_sent', 
            this.formatBytes(metrics.data_sent.reduce((sum, v) => sum + v, 0)), 
            this.formatBytes(metrics.data_sent.reduce((sum, v) => sum + v, 0) / (this.duration / 1000)) + ' /s'
        ]);
        dataTable.push([ 
            'data_received', 
            this.formatBytes(metrics.data_received.reduce((sum, v) => sum + v, 0)), 
            this.formatBytes(metrics.data_received.reduce((sum, v) => sum + v, 0) / (this.duration / 1000)) + ' /s' 
        ]);

        httpReqTable.push([
            'http_req_failed',
            `${((metrics.http_req_failed / results.length) * 100).toFixed(2)}%   ${metrics.http_req_failed} out of ${results.length}`,
            '',
        ]);
        httpReqTable.push(['http_reqs', `${results.length}`, `${(results.length / (this.duration / 1000)).toFixed(5)}/s`]);

        console.log(`\n=== Load Test Results for ${this.targetUrl} (${this.method}) ===`);
        console.log(durationTable.toString() + '\n');
        console.log(httpReqTable.toString() + '\n');
        console.log(dataTable.toString() + '\n');
        console.log(processDecoderLogs());
    }

    colorize(value, color) {
        const colors = {
            green: '\x1b[32m',
            blue: '\x1b[34m',
            yellow: '\x1b[33m',
            red: '\x1b[31m',
            cyan: '\x1b[36m',
            magenta: '\x1b[35m',
            reset: '\x1b[0m',
        };
        return `${colors[color] || colors.reset}${value}${colors.reset}`;
    }
}
