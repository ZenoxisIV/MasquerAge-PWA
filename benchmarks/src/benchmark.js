import MasquerAgeLoadTest from './load/LoadEngine.js';

const options = {
    targetUrl: 'https://jsonplaceholder.typicode.com/posts',
    vus: 1,
    duration: 5 * 1000,
    method: 'POST',
    logLevel: 'info'
}

const process = new MasquerAgeLoadTest(options);
process.run();
