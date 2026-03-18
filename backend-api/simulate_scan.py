import paho.mqtt.client as mqtt
import json
import time

# --- CONFIG ---
MQTT_BROKER = "157.173.101.159"
TEAM_ID = "fop"  # Should match the TEAM_ID in backend-api/main.py
TOPIC_SCAN = f"rfid/{TEAM_ID}/scan"

client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
client.connect(MQTT_BROKER, 1883, 60)

print(f"Simulating RFID Scan on {MQTT_BROKER}...")
print(f"Targeting Topic: {TOPIC_SCAN}")

# Test UID
test_payload = {
    "rfid_uid": "A1B2C3E5",
    "mode": "purchase"
}

print(f"Sending Payload: {json.dumps(test_payload)}")

result = client.publish(TOPIC_SCAN, json.dumps(test_payload))
result.wait_for_publish()

if result.is_published():
    print("✅ Success! Scan signal delivered to Broker.")
    print("👉 Check your backend logs for 'Hardware Scan Detected'")
else:
    print("❌ Failed to send signal. Check MQTT Broker connection.")

client.disconnect()
