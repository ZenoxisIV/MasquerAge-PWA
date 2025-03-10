import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Counter, Rate } from 'k6/metrics';

export const options = {
    vus: 5,
    duration: '30s',
};

const QRDecoder_http_req_blocked = new Trend('QRDecoder_http_req_blocked');
const QRDecoder_http_req_connecting = new Trend('QRDecoder_http_req_connecting');
const QRDecoder_http_req_duration = new Trend('QRDecoder_http_req_duration');
const QRDecoder_http_req_failed = new Rate('QRDecoder_http_req_failed');
const QRDecoder_http_req_receiving = new Trend('QRDecoder_http_req_receiving');
const QRDecoder_http_req_sending = new Trend('QRDecoder_http_req_sending');
const QRDecoder_http_req_tls_handshaking = new Trend('QRDecoder_http_req_tls_handshaking');
const QRDecoder_http_req_waiting = new Trend('QRDecoder_http_req_waiting');
const QRDecoder_http_reqs = new Counter('QRDecoder_http_reqs');

const fastapi_http_req_blocked = new Trend('fastapi_http_req_blocked');
const fastapi_http_req_connecting = new Trend('fastapi_http_req_connecting');
const fastapi_http_req_duration = new Trend('fastapi_http_req_duration');
const fastapi_http_req_failed = new Rate('fastapi_http_req_failed');
const fastapi_http_req_receiving = new Trend('fastapi_http_req_receiving');
const fastapi_http_req_sending = new Trend('fastapi_http_req_sending');
const fastapi_http_req_tls_handshaking = new Trend('fastapi_http_req_tls_handshaking');
const fastapi_http_req_waiting = new Trend('fastapi_http_req_waiting');
const fastapi_http_reqs = new Counter('fastapi_http_reqs');

const FASTIFY_URL = 'http://127.0.0.1:8000';
const FASTAPI_URL = 'http://127.0.0.1:3000';

export default function () {
    QRDecoder_http_reqs.add(1);
    const fastifyResponse = http.get(`${FASTIFY_URL}/decode-qrcode`);

    QRDecoder_http_req_duration.add(fastifyResponse.timings.duration);
    QRDecoder_http_req_receiving.add(fastifyResponse.timings.receiving);
    QRDecoder_http_req_sending.add(fastifyResponse.timings.sending);
    QRDecoder_http_req_waiting.add(fastifyResponse.timings.waiting);
    QRDecoder_http_req_blocked.add(fastifyResponse.timings.blocked);
    QRDecoder_http_req_connecting.add(fastifyResponse.timings.connecting);
    QRDecoder_http_req_tls_handshaking.add(fastifyResponse.timings.tls_handshaking);
    QRDecoder_http_req_failed.add(fastifyResponse.status !== 200);

    check(fastifyResponse, {
        'QR Code decoded successfully': (r) => r.status === 200,
    });

    if (fastifyResponse.status !== 200) {
        console.error("Failed to fetch decoded QR");
        return;
    }

    let { uin, dob } = JSON.parse(fastifyResponse.body);
    const payload = JSON.stringify({ uin, dob });
    const params = {
        headers: { 'Content-Type': 'application/json' },
    };

    fastapi_http_reqs.add(1);
    const fastAPIResponse = http.post(`${FASTAPI_URL}/dob`, payload, params);

    fastapi_http_req_duration.add(fastAPIResponse.timings.duration);
    fastapi_http_req_receiving.add(fastAPIResponse.timings.receiving);
    fastapi_http_req_sending.add(fastAPIResponse.timings.sending);
    fastapi_http_req_waiting.add(fastAPIResponse.timings.waiting);
    fastapi_http_req_blocked.add(fastAPIResponse.timings.blocked);
    fastapi_http_req_connecting.add(fastAPIResponse.timings.connecting);
    fastapi_http_req_tls_handshaking.add(fastAPIResponse.timings.tls_handshaking);
    fastapi_http_req_failed.add(fastAPIResponse.status !== 200);

    check(fastAPIResponse, {
        'MOSIP ID Auth verification successful': (r) => r.status === 200,
    });

    console.log(`[FastAPI] Sent: ${payload} - Response: ${fastAPIResponse.status}`);

    sleep(1);
}