from locust import HttpUser, task
import pyqrcode
import cv2
import json
import tempfile
from faker import Faker

fake = Faker()

def generatePCN() -> str:
    """Generates a random PCN in the format XXXX-XXXX-XXXX-XXXX."""
    generate_segment = lambda: ''.join(str(fake.random_int(0, 9)) for _ in range(4))
    return f"{generate_segment()}-{generate_segment()}-{generate_segment()}-{generate_segment()}"

def generateUIN() -> str:
    """Generates a random 10-digit UIN."""
    return ''.join(str(fake.random_int(0, 9)) for _ in range(10))

class QRCodeUser(HttpUser):
    def generate_qr_payload(self) -> dict:
        """Creates a QR code with randomly generated JSON data, then decodes it."""
        data = {
            "pcn": generatePCN(),
            "uin": generateUIN(),
            "firstName": fake.first_name(),
            "middleName": fake.first_name() if fake.boolean(chance_of_getting_true=50) else "",
            "lastName": fake.last_name(),
            "suffix": fake.suffix() if fake.boolean(chance_of_getting_true=30) else "",
            "sex": fake.random_element(elements=["Male", "Female"]),
            "dateOfBirth": fake.date_of_birth(minimum_age=13, maximum_age=80).strftime("%Y/%m/%d"), # YYYY/MM/DD
            "placeOfBirth": fake.city()
        }

        qr = pyqrcode.create(json.dumps(data))

        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as temp_qr:
            qr.png(temp_qr.name, scale=6)
            filename = temp_qr.name

        image = cv2.imread(filename)
        detector = cv2.QRCodeDetector()
        decoded_data, vertices_array, _ = detector.detectAndDecode(image)

        if decoded_data:
            decoded_json = json.loads(decoded_data)
            return {
                "uin": decoded_json["uin"],
                "dob": decoded_json["dateOfBirth"]
            }
        else:
            print("Error decoding QR Code")
            return {}

    @task
    def send_dob(self) -> None:
        """Generate a new QR code each time and send it to /dob."""
        payload = self.generate_qr_payload()
        headers = {"Content-Type": "application/json"}

        if payload:
            response = self.client.post("/dob", json=payload, headers=headers)
            print(f"Sent data: {payload}")
            print(f"Response status: {response.status_code}")
            print(f"Response body: {response.text}")