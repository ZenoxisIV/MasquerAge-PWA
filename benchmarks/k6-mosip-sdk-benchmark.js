import http from 'k6/http';
import { sleep } from 'k6';
import { SharedArray } from 'k6/data';

// Load decoded QR data
const qrData = new SharedArray('qrData', function () {
    return JSON.parse(open('decoded_qr_data.json'));
});

export default function () {
    const user = qrData[__ITER]; // Get the QR data for this iteration

    const payload = JSON.stringify({
        uin: user.uin,
        dob: user.dob,
    });

    const params = {
        headers: { 'Content-Type': 'application/json' },
    };

    const res = http.post('http://127.0.0.1:3000/dob', payload, params);
    console.log(`Sent: ${payload} - Response: ${res.status}`);

    sleep(1);
}
