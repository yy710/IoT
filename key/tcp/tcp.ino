#include <ESP8266WiFi.h>

//const char* ssid     = "Jingchu";
//const char* ssid     = "dkMeet";
const char* ssid     = "sygg2";
//const char* password = "zjc19800202";
//const char* password = "dkbyd2018";
const char* password = "sygg1501";
const char* host = "www.xingshenxunjiechuxing.com";
const int tcpPort = 8124;
WiFiClient client;

void led(int s) {
  digitalWrite(12, s);
  digitalWrite(13, s);
  //digitalWrite(14, s);
  //digitalWrite(15, s);
  return;
}

void setup()
{
  pinMode(12, OUTPUT);//继电器
  pinMode(13, OUTPUT);//Blue LED
  pinMode(14, OUTPUT);//Red LED
  pinMode(15, OUTPUT);//Green LED

  digitalWrite(13, HIGH);
  digitalWrite(14, HIGH);
  digitalWrite(15, HIGH);

  Serial.begin(115200);
  Serial.println();

  Serial.printf("Connecting to %s ", ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.print("Netmask: ");
  Serial.println(WiFi.subnetMask());
  Serial.print("Gateway: ");
  Serial.println(WiFi.gatewayIP());

  Serial.println();
  Serial.print("Connecting to 39.108.1.78 ");
  while (!client.connect("39.108.1.78", tcpPort)) {
    delay(5000);
    Serial.print(".");
  }
  Serial.printf(" Success!");
  client.print(String("{ keyid: 0 }\r\n"));
}

void loop() {
  if (client.available()) {
    String line = client.readStringUntil('\n');
    Serial.print("\n[ recived ]: ");
    Serial.print(line);
    Serial.println();

    if (line == String("open")) {
      led(LOW);
      client.print(String("{ status: \"opened\" }"));
    } else if (line == String("close")) {
      led(HIGH);
       client.print(String("{ status: \"closed\" }"));
    }
  }
  //delay(5000);
}
