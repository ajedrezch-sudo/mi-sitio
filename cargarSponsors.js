document.addEventListener('DOMContentLoaded', () => {
    fetch('sponsors.json')
        .then(response => response.json())
        .then(sponsors => {
            const sponsorContainer = document.getElementById('sponsorContainer');
            sponsorContainer.innerHTML = ''; // Limpia el contenedor antes de agregar contenido

            sponsors.forEach(sponsor => {
                const col = document.createElement('div');
                col.className = 'col';
                col.innerHTML = `
                    <div class="sponsor-logo p-3">
                        <img src="${sponsor.logo}" alt="${sponsor.alt}" class="img-fluid">
                    </div>
                `;
                sponsorContainer.appendChild(col);
            });
        })
        .catch(error => console.error('Error al cargar los sponsors:', error));
});
