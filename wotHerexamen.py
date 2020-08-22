# import for weather
import requests
import json

# import for time
import datetime
from datetime import timedelta
from time import sleep

# import for GPIO 40 pins connection
import RPi.GPIO as GPIO

# import for firestore
import firebase_admin
from firebase_admin import credentials, firestore

# import for temperature
import os
import glob
import time
import threading


def setupGPIO():
	GPIO.setwarnings(False)
	#23 is min sensor, 24 is max sensor
	GPIO.setmode(GPIO.BCM)
	GPIO.setup(23,GPIO.IN)
	GPIO.setup(24,GPIO.IN)
	# relais output om watertoevoer aan te sluiten
	GPIO.setup(17,GPIO.OUT)
	# variabele om te checken of watertoevoer al aanligt
	GPIO.setup(22,GPIO.OUT)
	# relais output om verlichting aan te sturen
	GPIO.setup(25,GPIO.OUT)

def setupFirestore():
	cd = credentials.Certificate("/home/pi/Documents/WOT/zwemvijver-wot-88407-firebase-adminsdk-q53h7-ba911ff8dc.json")
	firebase_admin.initialize_app(cd)
	global db
	db = firestore.client()

def setupTempSensor():
	os.system('modprobe w1-gpio')
	os.system('modprobe w1-therm')
	global base_dir
	global device_folder
	global device_file
	base_dir = '/sys/bus/w1/devices/'
	device_folder = glob.glob(base_dir + '28*')[0]
	device_file = device_folder + '/w1_slave'

def checkInput():	
	if GPIO.input(24) == False and (GPIO.input(23) == True or GPIO.input(17) == 0):
		if GPIO.input(23) == True:
			response = requests.get("https://api.openweathermap.org/data/2.5/onecall?lat=50.922000&lon=3.453350&units=metric&lang=nl&appid=cf3f44f9f4dc9d86b0ca09769e00a7c0&fbclid=IwAR3_NY7EYPH-OfCVfjr7yKH0j-FYKS1_yQekAf4d5vNQBHYZgzfM7XB1X4w")
			data = response.json()
			now = datetime.datetime.now()
			nowTime = now.time()
			somneerslag = 0
			if nowTime <= datetime.time(12) and nowTime >= datetime.time(0):
				m = 0
				while m < 2:
					try: 
						somneerslag += data["daily"][m]["rain"]
					except: 
						somneerslag += 0
					m += 1 
			else:
				a = 1
				while a < 3:
					try: 
						somneerslag += data["daily"][a]["rain"]
					except: 
						somneerslag += 0
					a += 1 	
			# als er minder dan 10 mm neerslag zal vallen de komende 2 dagen, vul bij	
			if somneerslag < 10:
				if GPIO.input(22) == 0:
					GPIO.output(17, False)
					saveToDatabase()
					GPIO.output(22, True)
				else:
					GPIO.output(17, False)
			# als er meer dan of gelijk aan 10 mm neerslag zal vallen de komende 2 dagen, niet bijvullen		
			elif somneerslag >= 10:
				GPIO.output(17, True)
		else:
			GPIO.output(17, False)
			GPIO.output(22, False)

	# else leg relais af
	else:
		GPIO.output(17, True)
		uitgang = "uit"

def manualAanvraag():
	# als er een manuele aanvraag binnenkomt
	boodschap_ref = db.collection(u'boodschap').document('sQNGeSuqvrAWHEMQVKx6')
	boodschapDoc = boodschap_ref.get()
	boodschap = boodschapDoc.to_dict()
	if boodschap["manueleStop"]:
		GPIO.output(17, True)
		read_temp()
		checkLightning()
		manualAanvraag()
	elif boodschap["manueleAanvraag"]:
		boodschap_ref.set({
			u'manueleStop': False,
			u'manueleAanvraag': False,
		})
		while GPIO.input(24) == False:
			GPIO.output(17, False)
			read_temp()
			checkLightning()
			manualAanvraag()
			
def checkLightning():
	# als er in databank de verlichting aanstaat
	light_ref = db.collection(u'verlichting').document('OjgC8T12rslWt7J3XbHp')
	lightDoc = light_ref.get()
	verlichting = lightDoc.to_dict()
	if verlichting["aan"]:
		GPIO.output(25, False)
	else:
		GPIO.output(25, True)

def saveToDatabase(): 
	currentdate = datetime.datetime.now() - timedelta(hours=2)
	water_ref = db.collection(u'watertoevoer')
	water_ref.add({
		u'aan': True,
		u'datum': currentdate,
		u'manier': u'automatisch',
	})
	
def tempSaveToDatabase(temp_c): 
	temp_ref = db.collection(u'temperatuur').document('2cOJQ2xdZRPQqqas64S1')
	temp_ref.set({
		u'graden': temp_c,
	})
	
def read_temp_raw():
    f = open(device_file, 'r')
    lines = f.readlines()
    f.close()
    return lines

def read_temp():
    lines = read_temp_raw()
    while lines[0].strip()[-3:] != 'YES':
        time.sleep(0.2)
        lines = read_temp_raw()
    equals_pos = lines[1].find('t=')
    if equals_pos != -1:
        temp_string = lines[1][equals_pos+2:]
        temp_c = float(temp_string) / 1000.0
        tempSaveToDatabase(temp_c)
        #return temp_c   
       
def start():
	try:
		gpioPins = setupGPIO()
		dataFirestore = setupFirestore()
		tempSensor = setupTempSensor()
		while True:
			manualAanvraag()
			checkInput()
			read_temp()
			checkLightning()
	except KeyboardInterrupt:
		print("gestopt")
		sys.exit(0)

start()	
