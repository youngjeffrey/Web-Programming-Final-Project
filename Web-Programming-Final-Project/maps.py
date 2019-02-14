import folium
import pandas

data = pandas.read_csv("airports.csv")
name = list(data["name"])
code = list(data["code"])
lat = list(data["latitude"])
long = list(data["longitude"])

map = folium.Map(location = [35.91, -79.05], zoom_start=10, tiles="Mapbox Bright")

fgv= folium.FeatureGroup(name="Airports")

for nm, co, lt, lng in zip(name, code, lat, long):
    fgv.add_child(folium.CircleMarker(location=[lt, lng], popup=nm + "\n" + "(" + co + ")",
            fill_color='red', color='white', radius=6, fill_opacity=0.8))

fgv.add_child(folium.CircleMarker(location=[35.91, -79.05], popup="You are currently here",
        fill_color='blue', color='white', radius=8, fill_opacity=0.8))

map.add_child(fgv)
map.save("Map1.html")
