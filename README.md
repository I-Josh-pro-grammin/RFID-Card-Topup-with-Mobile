# RFID E-Commerce & Terminal System (Hardware-Locked)

A professional, academic-grade IoT RFID Wallet and E-Commerce platform. This system enforces a **Hardware-First** security model where the dashboard remains locked until an RFID card is scanned via the physical merchant terminal.

## 🔒 Hardware-First Security Flow
Unlike traditional web apps, this system is a **Merchant Terminal**:
1. **Locked State**: The Web Dashboard stays on a "Terminal Locked" screen by default.
2. **Physical Scan**: When a student/user scans their RFID card on the ESP8266 reader, a `POST` is sent to the MQTT broker.
3. **Session Unlock**: The Python Backend (main.py) detects the scan, validates the card, and "unlocks" a 5-minute interactive session on the Dashboard.
4. **Service Purchase**: Once unlocked, the merchant can process purchases for Cafeteria meals, Printing services, and more.

## 🛠️ Technology Stack
- **Backend**: Python (Flask) with `paho-mqtt` for hardware integration.
- **Database**: MongoDB (Persistent wallet storage and transaction ledger).
- **Frontend**: Vanilla HTML5, CSS3 (Glassmorphism design), and JavaScript (Fetch API).
- **Hardware**: ESP8266 + MFRC522 RFID Reader + MQTT Broker.

## 🚀 Setup & Deployment

### 1. Backend API (Python)
Ensure you have Python 3.10+ installed.
```bash
cd backend-api
pip install -r requirements.txt
python main.py
```
*The backend handles both the REST API for the dashboard and the MQTT listener for the hardware.*

### 2. Web Dashboard
Serve the dashboard using a local server (to avoid CORS/File-System blocks).
```bash
cd web-dashboard
npx serve -s . -l 8240
```
Access at: `http://<SERVER_IP>:8240`

### 3. ESP8266 Firmware
- Open `esp8266-firmware/esp8266-firmware.ino` in Arduino IDE.
- Update your WiFi SSID, Password, and the MQTT Broker IP (`157.173.101.159`).
- Flash the code to your board.

## 💡 Key Features
- **Atomic Wallet Updates**: Balances are updated safely using MongoDB logic.
- **Transaction Ledger**: Every purchase, top-up, and scan is logged for accounting.
- **Service Catalog**: Pre-seeded services including Cafeteria, Internet, and Printing.
- **Session Management**: Automated logout after 5 minutes of inactivity.

## 📂 Repository Structure
```text
/rfid-wallet-system
├── esp8266-firmware/   # Arduino/C++ Hardware Source
├── backend-api/        # Python (Flask) Backend Logic
├── web-dashboard/      # Vanilla HTML/CSS/JS Dashboard
├── docs/               # System Architecture Diagrams
└── README.md           # Project Documentation
```

## 🌐 Live Web Dashboard
http://157.173.101.159:8240

---
*University Capstone Project - Production-Ready Standards*
