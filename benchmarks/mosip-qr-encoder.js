import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { faker } from '@faker-js/faker';

function generateUIN() {
  return Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirPath = path.join(__dirname, 'k6-qr-codes');

if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach(file => {
        fs.unlinkSync(path.join(dirPath, file));
    });
} else {
    fs.mkdirSync(dirPath, { recursive: true });
}

const numberOfQRCodes = parseInt(process.argv[2], 10) || 5;

const generateFakeUser = () => {
    return {
        DateIssued: faker.date.past().toISOString().split('T')[0],
        Issuer: "PSA",
        subject: {
            Suffix: faker.person.suffix(),
            lName: faker.person.lastName().toUpperCase(),
            fName: faker.person.firstName().toUpperCase(),
            mName: faker.person.middleName().toUpperCase(),
            sex: faker.person.sex().toUpperCase(),
            BF: "[1,1]",
            DOB: faker.date.birthdate({ min: 1970, max: 2000, mode: 'year' }).toISOString().split('T')[0],
            POB: faker.location.city().toUpperCase(),
            UIN: generateUIN()
        },
        alg: "EDDSA",
        signature: "TU9TSVAgaXMgYXdlc29tZSE="
    };
};

for (let i = 1; i <= numberOfQRCodes; i++) {
    const jsonString = JSON.stringify(generateFakeUser());
    const outputPath = path.join(dirPath, `qrcode_${i}.png`);
    
    QRCode.toFile(outputPath, jsonString, {
        width: 256,
        height: 256
    }).then(() => {
        console.log(`QR Code ${i} saved to`, outputPath);
    }).catch(err => {
        console.error(`Error generating QR Code ${i}:`, err);
    });
}
