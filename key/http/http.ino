#include <ESP8266WiFi.h>

//const char* ssid     = "Jingchu";
const char* ssid     = "dkMeet";
//const char* password = "zjc19800202";
const char* password = "dkbyd2018";

const char* host = "www.xingshenxunjiechuxing.com";

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

  Serial.begin(115200);
  Serial.println();

  Serial.printf("Connecting to %s ", ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
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
}

void loop()
{
  WiFiClient client;
  const int httpPort = 80;
  String url = "/iot/setKey";

  Serial.printf("\n[Connecting to %s ... ", host);
  if (client.connect(host, httpPort))
  {
    Serial.println("connected]");

    Serial.print("Requesting URL: ");
    Serial.println(url);
    client.print(String("GET ") + url + " HTTP/1.1\r\n" +
                 "Host: " + host + "\r\n" +
                 "Connection: close\r\n" +
                 "\r\n"
                );

    Serial.println("[Response:]");
    while (client.connected())
    {
      if (client.available())
      {
        String line = client.readStringUntil('\n');
        Serial.println(line);

        if (line == String("true")) {
          led(HIGH);
        } else if (line == String("false")) {
          led(LOW);
        }
      }
    }
    client.stop();
    Serial.println("\n[Disconnected]");
  }
  else
  {
    Serial.println("connection failed!]");
    client.stop();
  }
  delay(5000);
}
