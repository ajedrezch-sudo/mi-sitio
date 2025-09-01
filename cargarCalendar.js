fetch('calendar.json')
.then(response => response.json())
.then(tournaments => {
    const timelineContainer = document.getElementById('timelineContainer');
    const showMoreBtn = document.getElementById('showMoreBtn');
    const initialCount = 3;
   
    // Mostrar los primeros 3 eventos
    tournaments.slice(0, initialCount).forEach(t => addTournamentCard(t, timelineContainer));
    // Agregar funcionalidad al botón para mostrar el resto
    showMoreBtn.addEventListener('click', () => {
        tournaments.slice(initialCount).forEach(t => addTournamentCard(t, timelineContainer));
        showMoreBtn.style.display = 'none';
    });
})
.catch(error => console.error('Error al cargar el calendario:', error));

function addTournamentCard(t, container) {
    const card = document.createElement('div');
    card.classList.add('timeline-card');
    // Asignar color según el tipo de evento
    if (t.event === 'circuito chubutense') {
        card.classList.add('circuito-chubutense');
    } else if (t.event === 'campeonatos chubutenses') {
        card.classList.add('campeonatos-chubutenses');
    }
    card.innerHTML = `
        <h5><strong>${t.title}</strong></h5>
        <p>Fecha: ${t.date}</p>
        <p><strong>${t.description}</strong></p>`;
    
    // Modificación: verificar si hay link antes de asignar el evento click
    card.addEventListener('click', () => {
        if (t.link && t.link !== null) {
            // Si hay link, abrir en nueva pestaña
            window.open(t.link, '_blank');
        } else {
            // Si no hay link, mostrar el modal
            showTournamentDetails(t);
        }
    });
    
    container.appendChild(card);
}

function showTournamentDetails(tournament) {
    const details = `
        <h5>${tournament.title}</h5>
        <p><strong>Fecha:</strong> ${tournament.date}</p>
        <p>${tournament.description}</p>
        ${tournament.links ? tournament.links.map(link => `<a href="${link.url}" target="_blank" class="btn btn-primary m-2">${link.text}</a>`).join('') : ''}
    `;
    document.getElementById('tournamentDetails').innerHTML = details;
    const modal = new bootstrap.Modal(document.getElementById('tournamentModal'));
    modal.show();
}