// Players Script for Registered Players Page

// Sample data structure - this would typically come from a database or API
let playersData = [
    // Example players - remove or replace with actual data
    // {
    //     id: 1,
    //     name: "Juan Pérez",
    //     title: "FM",
    //     rating: 2350,
    //     city: "Buenos Aires",
    //     club: "Club de Ajedrez de Buenos Aires",
    //     country: "Argentina"
    // }
];

document.addEventListener('DOMContentLoaded', function() {
    // Load players data
    loadPlayers();

    // Search functionality
    const searchInput = document.getElementById('searchPlayer');
    if (searchInput) {
        searchInput.addEventListener('input', filterPlayers);
    }

    // Filter functionality
    const filterSelect = document.getElementById('filterTitle');
    if (filterSelect) {
        filterSelect.addEventListener('change', filterPlayers);
    }

    // Update last updated date
    updateLastUpdated();
});

function loadPlayers() {
    // This function would typically fetch data from a server
    // For now, we'll simulate with the sample data

    if (playersData.length === 0) {
        showEmptyState();
    } else {
        displayPlayers(playersData);
        updateStats(playersData);
    }
}

function displayPlayers(players) {
    const tbody = document.getElementById('playersTableBody');
    const emptyState = document.getElementById('emptyState');

    if (players.length === 0) {
        showEmptyState();
        return;
    }

    // Hide empty state
    if (emptyState) {
        emptyState.style.display = 'none';
    }

    // Sort players by rating (highest first)
    players.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    tbody.innerHTML = '';

    players.forEach((player, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${player.name}</strong></td>
            <td>${player.title ? `<span class="badge bg-primary">${player.title}</span>` : '-'}</td>
            <td>${player.rating || 'Sin rating'}</td>
            <td>${player.city || '-'}</td>
            <td>${player.club || '-'}</td>
        `;

        // Add hover effect
        row.style.cursor = 'pointer';
        row.addEventListener('click', () => showPlayerDetails(player));

        tbody.appendChild(row);
    });
}

function showEmptyState() {
    const tbody = document.getElementById('playersTableBody');
    const emptyState = document.getElementById('emptyState');

    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-5">
                    <p class="text-muted">Aún no hay jugadores inscriptos</p>
                    <a href="inscribirse.html" class="btn btn-sm btn-tournament-primary">Inscribirse Ahora</a>
                </td>
            </tr>
        `;
    }

    if (emptyState) {
        emptyState.style.display = 'block';
    }
}

function filterPlayers() {
    const searchTerm = document.getElementById('searchPlayer').value.toLowerCase();
    const titleFilter = document.getElementById('filterTitle').value;

    let filtered = playersData;

    // Apply search filter
    if (searchTerm) {
        filtered = filtered.filter(player => {
            return (
                player.name.toLowerCase().includes(searchTerm) ||
                (player.city && player.city.toLowerCase().includes(searchTerm)) ||
                (player.club && player.club.toLowerCase().includes(searchTerm))
            );
        });
    }

    // Apply title filter
    if (titleFilter) {
        if (titleFilter === 'titulados') {
            filtered = filtered.filter(player => player.title);
        } else {
            filtered = filtered.filter(player => player.title === titleFilter);
        }
    }

    displayPlayers(filtered);
}

function updateStats(players) {
    // Total players
    document.getElementById('totalPlayers').textContent = players.length;

    // Total titled players
    const titledPlayers = players.filter(p => p.title).length;
    document.getElementById('totalTitled').textContent = titledPlayers;

    // Total countries
    const countries = new Set(players.map(p => p.country || 'Argentina'));
    document.getElementById('totalCountries').textContent = countries.size;

    // Animate counters
    animateValue('totalPlayers', 0, players.length, 1000);
    animateValue('totalTitled', 0, titledPlayers, 1000);
    animateValue('totalCountries', 0, countries.size, 1000);
}

function animateValue(id, start, end, duration) {
    const element = document.getElementById(id);
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

function showPlayerDetails(player) {
    const modalHtml = `
        <div class="modal fade" id="playerDetailModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header" style="background: linear-gradient(135deg, #024887 0%, #0d5ab9 100%); color: white;">
                        <h5 class="modal-title">${player.name}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row mb-3">
                            <div class="col-6">
                                <strong>Título:</strong>
                            </div>
                            <div class="col-6">
                                ${player.title ? `<span class="badge bg-primary">${player.title}</span>` : 'Sin título'}
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-6">
                                <strong>Rating:</strong>
                            </div>
                            <div class="col-6">
                                ${player.rating || 'Sin rating'}
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-6">
                                <strong>Ciudad:</strong>
                            </div>
                            <div class="col-6">
                                ${player.city || '-'}
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-6">
                                <strong>Club:</strong>
                            </div>
                            <div class="col-6">
                                ${player.club || '-'}
                            </div>
                        </div>
                        ${player.fidaId ? `
                        <div class="row mb-3">
                            <div class="col-6">
                                <strong>FIDA ID:</strong>
                            </div>
                            <div class="col-6">
                                <a href="https://ratings.fide.com/profile/${player.fidaId}" target="_blank">${player.fidaId}</a>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('playerDetailModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('playerDetailModal'));
    modal.show();

    // Clean up modal after it's hidden
    document.getElementById('playerDetailModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

function updateLastUpdated() {
    const lastUpdatedElement = document.getElementById('lastUpdated');
    if (lastUpdatedElement) {
        const now = new Date();
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        lastUpdatedElement.textContent = now.toLocaleDateString('es-AR', options);
    }
}

// Function to add a new player (can be called from admin panel or form submission)
function addPlayer(playerData) {
    playersData.push(playerData);
    loadPlayers();
    updateLastUpdated();

    // Save to localStorage for persistence (in a real app, this would be saved to a server)
    localStorage.setItem('tournamentPlayers', JSON.stringify(playersData));
}

// Load players from localStorage if available
function loadFromLocalStorage() {
    const stored = localStorage.getItem('tournamentPlayers');
    if (stored) {
        try {
            playersData = JSON.parse(stored);
        } catch (e) {
            console.error('Error loading players from localStorage:', e);
        }
    }
}

// Initialize
loadFromLocalStorage();
