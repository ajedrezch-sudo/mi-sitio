import re
import json

# Leer el archivo de jugadores
with open('jugadores.txt', 'r', encoding="utf8") as file:
    data = file.read()

# Cargar la clasificación existente
with open('clasificacion.json', 'r', encoding="utf8") as file:
    clasificacion = json.load(file)

# Expresión regular para extraer nombre, elo, id y club
pattern = re.compile(r"Nombre:\s+(.+?)\s+No.:.*?Elo Int.\s+(\d+)\s+.*?FIDE-ID:\s+(\d+)\s+Club/Lugar:\s+(.+?)\n", re.DOTALL)

player_data = {}
for match in pattern.finditer(data):
    name = match.group(1).strip()
    elo = int(match.group(2))
    fide_id = match.group(3).strip()
    club = match.group(4).strip()
    fide_profile = f"https://ratings.fide.com/profile/{fide_id}"
    player_data[name] = {"elo": elo, "club": club, "fideProfile": fide_profile}

# Actualizar clasificación
for player in clasificacion:
    if player['name'] in player_data:
        player.update(player_data[player['name']])

# Guardar como JSON actualizado
with open('clasificacion_actualizada.json', 'w') as outfile:
    json.dump(clasificacion, outfile, indent=4)

print("Archivo JSON actualizado: clasificacion_actualizada.json")
