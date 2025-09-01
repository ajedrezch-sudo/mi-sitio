import json
import re

# Cargar la clasificación actual
with open('clasificacion.json', 'r', encoding="utf8") as f:
    clasificacion_actual = json.load(f)

# Leer el archivo del torneo
with open('playa.txt', 'r', encoding="utf8") as f:
    data = f.read()
    
# Extraer el nombre del torneo
torneo_nombre = re.search(r'^\d+º (.+)', data, re.MULTILINE).group(1).strip()

# Extraer las líneas de clasificación final
clasificacion_lines = data.split('Clasificación Final')[1].strip().split('\n')

# Tabla de puntos según la posición
puntos_por_posicion = {
    1: 10,
    2: 8,
    3: 6
}
# Del 4 al 10 puesto
for pos in range(4, 11):
    puntos_por_posicion[pos] = 4
# Del 11 en adelante
default_puntos = 2

# Primero, asignar posiciones faltantes basándose en el contexto
posicion_actual = 0
for i, line in enumerate(clasificacion_lines):
    if re.match(r'^\s*\d+', line):
        posicion_actual = int(re.match(r'^\s*(\d+)', line).group(1))
    else:
        # Asignar la posición anterior + 1 si no hay posición explícita
        posicion_actual += 1
        clasificacion_lines[i] = f"{posicion_actual:>4} {line.strip()}"

# Procesar la clasificación con posiciones corregidas
for line in clasificacion_lines:
    match = re.match(r'^\s*(\d+)\s+\d+\s+(.+?)\s+\d+\s+\w+\s+(\w+)\s+\d+', line)
    if match:
        posicion = int(match.group(1))
        nombre = match.group(2).strip()
        club = match.group(3).strip()
        
        # Filtrar solo jugadores de FACH
        if club == 'FACH':
            puntos = puntos_por_posicion.get(posicion, default_puntos)
            
            # Verificar si el jugador ya está en la clasificación
            jugador = next((j for j in clasificacion_actual if j['name'] == nombre), None)
            
            if jugador:
                jugador['points'] += puntos
                jugador['tournaments'].append({"name": torneo_nombre, "points": puntos})
            else:
                nuevo_id = max(j['id'] for j in clasificacion_actual) + 1 if clasificacion_actual else 1
                clasificacion_actual.append({
                    "id": nuevo_id,
                    "name": nombre,
                    "points": puntos,
                    "tournaments": [{"name": torneo_nombre, "points": puntos}]
                })

# Guardar el archivo actualizado
with open('clasificacion_actualizada.json', 'w') as f:
    json.dump(clasificacion_actual, f, indent=4)
