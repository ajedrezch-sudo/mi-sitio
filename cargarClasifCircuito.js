// Cargar datos desde un archivo JSON externo
fetch('clasificacion.json')
.then(response => response.json())
.then(data => loadClassification(data))
.catch(error => console.error('Error al cargar el archivo JSON:', error));

// Función para generar el nombre del archivo del logo basado en el nombre del club
function getClubLogo(clubName) {
    // Convertir el nombre del club a un formato de archivo
    // Ejemplo: "Club Atlético River Plate" -> "club-atletico-river-plate.png"
    const logoFileName = clubName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remover acentos
        .replace(/[^a-z0-9\s]/g, '') // Remover caracteres especiales
        .replace(/\s+/g, '-') // Reemplazar espacios con guiones
        .trim();
    
    return `img/logos/${logoFileName}.png`;
}

// Función para crear el HTML del logo con manejo de errores
function createLogoHTML(clubName, size = '24px') {
    const logoSrc = getClubLogo(clubName);
    return `<img src="${logoSrc}" 
                 alt="${clubName}" 
                 class="club-logo me-2" 
                 style="width: ${size}; height: ${size}; object-fit: contain; border-radius: 3px;" 
                 onerror="this.style.display='none'">`;
}

function loadClassification(classificationData) {
    const classificationTable = document.getElementById('classificationTable');
    
    classificationData.forEach((player, index) => {
        const row = document.createElement('tr');
        
        // Agregar medallas/emojis para los primeros 3 puestos
        let positionDisplay = player.position;
        if (player.position === 1) positionDisplay = '🥇 1°';
        else if (player.position === 2) positionDisplay = '🥈 2°';
        else if (player.position === 3) positionDisplay = '🥉 3°';
        else positionDisplay = `${player.position}°`;
        
        // Crear HTML con logo del club
        const logoHTML = createLogoHTML(player.club, '24px');
        
        row.innerHTML = `
            <td>${positionDisplay}</td>
            <td>
                <div>
                    ${logoHTML}
                    <span>${player.name}</span>
                </div>
            </td>
            <td><strong>${player.totalPoints}</strong></td>
        `;
        
        row.addEventListener('click', () => showPlayerDetails(player));
        row.style.cursor = 'pointer';
        classificationTable.appendChild(row);
    });
    
    // Guardar los datos en una variable global para acceso en showPlayerDetails
    window.classificationData = classificationData;
}

// Mostrar detalles del jugador
function showPlayerDetails(player) {
    const playerDetails = document.getElementById('playerDetails');
    
    // Determinar el emoji de posición
    let positionEmoji = '';
    if (player.position === 1) positionEmoji = '🥇';
    else if (player.position === 2) positionEmoji = '🥈';
    else if (player.position === 3) positionEmoji = '🥉';
    else if (player.position <= 10) positionEmoji = '🏅';
    
    // Crear HTML con logo del club para el modal
    const logoHTML = createLogoHTML(player.club, '32px');
    
    let detailsHTML = `
        <h5 class="text-center player-font">
            ${positionEmoji} <i>${player.name}</i>
        </h5>
        <div class="player-info text-center">
            <p><strong>Posición General:</strong> ${player.position}°</p>
            <p><strong>Puntos Totales:</strong> <span class="badge bg-success fs-6">${player.totalPoints} puntos</span></p>
            <p><strong>Club:</strong> 
                <span class="">
                    <span>${player.club}</span>
                    ${logoHTML}
                </span>
            </p>
            <p><strong>Torneos Participados:</strong> ${player.tournaments.length}</p>
        </div>
        <h6 class="mt-3">Historial de Torneos</h6>
        <ul class="list-group">`;
    
    player.tournaments.forEach(tournament => {
        // Determinar el color del badge según los puntos obtenidos
        let badgeClass = 'bg-secondary';
        if (tournament.points >= 10) badgeClass = 'bg-warning';
        else if (tournament.points >= 8) badgeClass = 'bg-info';
        else if (tournament.points >= 6) badgeClass = 'bg-success';
        else if (tournament.points >= 4) badgeClass = 'bg-primary';
        
        // Mostrar posición si está disponible
        let positionText = tournament.position ? ` (${tournament.position}° puesto)` : '';
        
        detailsHTML += `<li class="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <strong>${tournament.name}</strong>
                                <small class="text-muted">${positionText}</small>
                            </div>
                            <span class="badge ${badgeClass}">${tournament.points} pts</span>
                        </li>`;
    });
    
    detailsHTML += '</ul>';
    
    // Agregar estadísticas adicionales
    detailsHTML += `
        <div class="mt-3 p-3 bg-light rounded">
            <h6>Estadísticas</h6>
            <div class="row">
                <div class="col-6">
                    <small><strong>Promedio por torneo:</strong></small><br>
                    <span class="text-primary">${(player.totalPoints / player.tournaments.length).toFixed(1)} pts</span>
                </div>
                <div class="col-6">
                    <small><strong>Mejor resultado:</strong></small><br>
                    <span class="text-success">${Math.max(...player.tournaments.map(t => t.points))} pts</span>
                </div>
            </div>
        </div>`;
    
    playerDetails.innerHTML = detailsHTML;
    new bootstrap.Modal(document.getElementById('playerModal')).show();
}

// Función adicional para filtrar jugadores por club
function filterByClub(clubName) {
    const classificationTable = document.getElementById('classificationTable');
    classificationTable.innerHTML = ''; // Limpiar tabla
    
    const filteredData = window.classificationData.filter(player => 
        player.club.toLowerCase().includes(clubName.toLowerCase())
    );
    
    loadClassification(filteredData);
}

// Función para buscar jugadores por nombre
function searchPlayer(searchTerm) {
    const classificationTable = document.getElementById('classificationTable');
    classificationTable.innerHTML = ''; // Limpiar tabla
    
    const filteredData = window.classificationData.filter(player => 
        player.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    loadClassification(filteredData);
}

// Función para resetear la tabla completa
function resetTable() {
    const classificationTable = document.getElementById('classificationTable');
    classificationTable.innerHTML = ''; // Limpiar tabla
    loadClassification(window.classificationData);
}