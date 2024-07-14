#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

// db: allbrigh_GPS_fitter
// user : allbrigh_gpsfitter22
// pw : gpsfitter22

/*
  A0 = water sensor
  D1 = SDA  -- LCD
  D2 = SCL  -- LCD
  D0 = buzzer
  D4 = relay 3
  D5 = relay 1
  D6 = relay 2
  D7 = hcsr
  D8 = hcsr
*/

// ------------ PIN and Configuration ------------


#define WIFI_SSID "Allbrigh Project"
#define WIFI_PASS "marchcausear"

#define waterlvl_pin A0
#define buzzer D0
#define relay1 D5
#define relay2 D6
#define relay3 D4
#define TRIG_PIN_1 D7
#define ECHO_PIN_1 D8

int interval = 3000;    // interval kirim data ke apps
int trigger1   = 30;    // 30cm jarak sensor terdeteksi

const char *host = "monitoringair.allbright.my.id";
unsigned long previousMillis;
bool mode = false;    // mode false untuk tes pake random value, true jika sensor
// ----------------------------------------------
int level;
int distance1;
bool kunci;
bool vice;
String kondsRelay;
void setup() {
  Serial.begin(115200);

  pinMode(waterlvl_pin, INPUT);
  pinMode(buzzer, OUTPUT);
  pinMode(relay1, OUTPUT);
  pinMode(relay2, OUTPUT);
  pinMode(relay3, OUTPUT);
  pinMode(TRIG_PIN_1, OUTPUT);
  pinMode(ECHO_PIN_1, INPUT);

  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(WIFI_SSID);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.println();
  Serial.println("Alat Drywash Hand Sanitizer");
}

void loop() {
  standby(mode);
  sonic1();
  Serial.println("Silahkan Masukkan Tangan Anda..");
  if (distance1 < trigger1) kunci = true;
  while (kunci) {
    do {
      sonic1();
      digitalWrite(relay1, LOW);  // mist maker nyala
      digitalWrite(relay2, LOW);  // kipas pendorong kabut nyala
      Serial.println("Sterilisasi sedang berlangsung");
    } while (distance1 < trigger1);
    digitalWrite(relay1, HIGH);  // mist maker mati
    digitalWrite(relay2, HIGH);  // kipas pendorong kabut mati
    digitalWrite(relay3, LOW);  // kipas ventilasi nyala
    Serial.println("Pengosongan kabut dari Kabin");
    delay(5000);
    digitalWrite(relay3, HIGH);  // kipas ventilasi mati
    kunci = false;
    break;
  }

  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    Serial.println(String() + "Level = " + level);
    getNyala();
    cekRelay();
    sendDataPhp(String(level), kondsRelay);

    // logic ketika air tinggal sedikit ( < 20%) maka buzzer akan bunyi
    if (vice && (level < 20)) {
      digitalWrite(buzzer, HIGH);
      vice = false;
    } else {
      digitalWrite(buzzer, LOW);
      vice = true;
    }
    
  }
}

void bacaWater() {
  level = analogRead(waterlvl_pin);
  level = map(level, 0, 1023, 100, 0); // di map in untuk 100 %
}



void standby(bool mode) {
  if (mode) {
    bacaWater();
  }
  else {
    inputManual();
  }
}

void inputManual() {
  level = random(100);
}

void cekRelay() {
  if (kondsRelay != "") {
    if (kondsRelay == "0") digitalWrite(relay3, HIGH);
    if (kondsRelay == "1") digitalWrite(relay3, LOW);
  } else {
    return;
  }
}


void getNyala() {
  WiFiClient clientNyala;
  if (!clientNyala.connect(host, 80)) {
    Serial.println("connection nyala failed");
    return;
  }
  String url;
  url =  "http://" + String(host) + "/cek/cek_relay.php";
  HTTPClient httpNyala;
  httpNyala.begin(clientNyala, url);

  httpNyala.GET();
  String responNyala = httpNyala.getString();
  Serial.println("responNyala = " + responNyala);
  httpNyala.end();
  kondsRelay = responNyala;
}

void sendDataPhp(String level, String relay) {
  WiFiClient client;
  if (!client.connect(host, 80)) {
    Serial.println("connection failed");
    return;
  }
  String url;
  url = "http://" + String(host) + "/kirimdata.php?level=" + level + "&relay=" + relay;

  HTTPClient http;
  http.begin(client, url);

  http.GET();
  String respon = http.getString();
  Serial.println(respon);
  http.end();

}


void sonic1() {
  digitalWrite(TRIG_PIN_1, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN_1, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN_1, LOW);
  const unsigned long duration1 = pulseIn(ECHO_PIN_1, HIGH);
  distance1 = duration1 / 29 / 2;
}
