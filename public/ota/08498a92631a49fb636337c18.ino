#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <TinyGPS++.h>
#include <SoftwareSerial.h>
#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27, 16, 2);


// db: allbrigh_GPS_fitter
// user : allbrigh_gpsfitter22
// pw : gpsfitter22

// ------------ PIN and Configuration ------------
#define WIFI_SSID "iPhone XR"
#define WIFI_PASS "123454321"
//#define WIFI_SSID "cdpg81"
//#define WIFI_PASS "Gardenia8"
const char *host = "gpsmobil.allbright.my.id";
int pinRelay = D4;
static const int RXPin  = D1, TXPin = D2;  // pin GPS
bool mode = true;    // mode false untuk tes pake random value, true jika sensor
unsigned int interval = 500; // interval store data ke web
// -------------------------------

// taman menteng,
const float Lats[] = { -6.2008886, -6.2002331, -6.2007516, -6.1733215};
const float Lons[] = {106.8374936, 106.8325486, 106.824912, 106.7908953};
int lop;

bool isNyala;
static const uint32_t GPSBaud = 9600; // baud rate gps
static const int light = 0; // relay
unsigned long previousMillis;
double latitude, longitude;
String latbuf, lonbuf, kondsMotor;

TinyGPSPlus gps;
SoftwareSerial ss(RXPin, TXPin);

void setup() {
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  ss.begin(GPSBaud);
  pinMode(pinRelay, OUTPUT);
  lcd.init();
  lcd.backlight();
  while (WiFi.status() != WL_CONNECTED) {
    //    digitalWrite(D4, LOW);
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(WIFI_SSID);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.println();
}

void loop() {
  standby(mode);
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    Serial.println("Latbuf = " + latbuf + " | Lonbuf = " + lonbuf);
//    Serial.println("isNyala = " + isNyala );
    lcd.setCursor(0, 0); lcd.print("Latbuf = " + latbuf);
    lcd.setCursor(0, 1); lcd.print("Lonbuf = " + lonbuf);

    getNyala();
    cekRelay();
    sendDataPhp(latbuf, lonbuf, kondsMotor, isNyala);
  }

}

void cekRelay() {
  if (kondsMotor != "") {
    if (kondsMotor == "0") digitalWrite(pinRelay, LOW);
    if (kondsMotor == "1") digitalWrite(pinRelay, HIGH);
  } else {
    return;
  }
}


void standby(bool mode) {
  if (mode) {
    while (ss.available() > 0) {
      bacaGps();
      break;
    }
  }
  else {
    inputManual();
  }
}

void inputManual() {
  latbuf = String(Lats[lop], 7);
  lonbuf = String(Lons[lop], 7);
  lop += 1;
  if (lop == 4) lop = 0;
}


void getNyala() {
  WiFiClient clientNyala;
  if (!clientNyala.connect(host, 80)) {
    Serial.println("connection nyala failed");
    return;
  }
  String url;
  url =  "http://" + String(host) + "/cek_relay.php";
  HTTPClient httpNyala;
  httpNyala.begin(clientNyala, url);

  httpNyala.GET();
  String responNyala = httpNyala.getString();
  Serial.println("responNyala = " + responNyala);
  httpNyala.end();
  kondsMotor = responNyala;
}


void sendDataPhp(String latitude, String longitude, String relay, bool isNyala) {
  WiFiClient client;
  if (!client.connect(host, 80)) {
    Serial.println("connection failed");
    return;
  }
  String url;
  url = "http://" + String(host) + "/kirimdata.php?latitude=" + latitude + "&longitude=" +
        longitude + "&relay=" + relay + "&nyala=" + String(isNyala);

  HTTPClient http;
  http.begin(client, url);

  http.GET();
  String respon = http.getString();
  //  Serial.println(respon);
  http.end();

}

void bacaGps() {
  if (gps.encode(ss.read())) {
    if (gps.location.isValid()) {
      latitude = (gps.location.lat());
      longitude = (gps.location.lng());

      latbuf = (String(latitude, 6));
      lonbuf = (String(longitude, 6));
      Serial.println(latbuf + ", " + lonbuf);
      isNyala = true;
      return;
    }
  }
  else {
    Serial.println("GPS Encode tidak terbaca");
  }
  isNyala = false;
}


float randomDouble(float minf, float maxf) {
  return minf + random(1UL << 31) * (maxf - minf) / (1UL << 31);
}
