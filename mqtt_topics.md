# MQTT Topics Documentation - TEAM: wallet

This document outlines the MQTT communication structure used for real-time interaction between the RFID hardware and the backend system.

## Topic Structure

All topics are prefixed with `rfid/wallet/` (where `wallet` is the default `TEAM_ID`).

### 1. Card Scan (Publish)
**Topic**: `rfid/wallet/scan`
**Direction**: Hardware → Backend
**Payload (JSON)**:
```json
{
  "device_id": "AA:BB:CC:DD:EE:FF",
  "rfid_uid": "A1B2C3D4",
  "mode": "topup", // "topup" or "purchase"
  "timestamp": 12345678
}
```

### 2. Backend Response (Subscribe)
**Topic**: `rfid/wallet/response`
**Direction**: Backend → Hardware
**Payload (JSON)**:
```json
{
  "status": "success",
  "message": "Welcome A1B2C3D4",
  "balance": 250,
  "team_id": "wallet"
}
```

## Physical Hardware Logic

1. **Top-up Mode**: Triggered when `MODE_PIN` is HIGH. Informs the backend to prepare a top-up session.
2. **Purchase Mode**: Triggered when `MODE_PIN` is LOW. Informs the backend to process a service payment.
3. **Session Unlock**: A successful scan unlocks the Web/Mobile dashboard for 5 minutes.
