/*
 *  Simple HTTP get webclient test
 */

#include <ESP8266WiFi.h>

const char* ssid     = "Jingchu";
const char* password = "zjc19800202";

const char* host = "112.112.5.166";

void led(int s){
  digitalWrite(12, s);
  digitalWrite(13, s);
  //digitalWrite(14, s);
  //digitalWrite(15, s);
  return;
}

void setup() {
  pinMode(12, OUTPUT);
  pinMode(13, OUTPUT);
  //pinMode(14, OUTPUT);
  //pinMode(15, OUTPUT);

  led(LOW);

  Serial.begin(115200);
  delay(100);

  // We start by connecting to a WiFi network

  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  
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
}

int value = 0;

void loop() {
  delay(10000);
  ++value;

  led(HIGH);

  Serial.print("connecting to ");
  Serial.println(host);
  
  // Use WiFiClient class to create TCP connections
  WiFiClient client;
  const int httpPort = 81;
  if (!client.connect(host, httpPort)) {
    Serial.println("connection failed");
    //digitalWrite(14, HIGH);
    return;
  }
  
  // We now create a URI for the request
  String url = "/";
  Serial.print("Requesting URL: ");
  Serial.println(url);
  
  // This will send the request to the server
  client.print(String("GET ") + url + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" + 
               "Connection: close\r\n\r\n");
  delay(500);
  
  // Read all the lines of the reply from server and print them to Serial
  while(client.available()){
    String line = client.readStringUntil('\r');
    Serial.print(line);
  }
  
  Serial.println();
  Serial.println("closing connection");

  led(LOW);
}
