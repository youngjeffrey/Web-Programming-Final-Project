import sqlite3
import csv

sql = sqlite3.connect('flights.db')
cur = sql.cursor()

def getFlights(carrier, origin, destination, day):
    c1 = cur.execute("SELECT * FROM airdata WHERE carrier=? and origin=? and dest=? and day=?", (carrier, origin, destination, day)).fetchall()
    return c1

print(getFlights('EV','EWR','ATL', 9))
