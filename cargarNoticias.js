
fetch('noticias.json')
.then(response => response.json())
.then(news => {
    const newsContainer = document.getElementById('newsContainer');
    news.forEach((n, index) => {
        const card = document.createElement('div');
        card.classList.add('col-md-4', 'mb-4');
        card.innerHTML = `
            <div class="card news-card h-100">
                <img src="${n.imagen}" class="card-img-top" alt="${n.titulo}">
                <div class="card-body">
                    <h5 class="card-title">${n.titulo}</h5>
                    <p class="card-text text-truncate">${n.descripcion}</p>
                    <button type="button" class="btn btn-primary stretched-link" onclick="showNewsDetails(${index})">
                        Leer más
                    </button>
                </div>
            </div>`;
        newsContainer.appendChild(card);
    });

    // Guardar noticias en variable global para acceder en showNewsDetails
    window.newsData = news;
})
.catch(error => console.error('Error al cargar las noticias:', error));

function showNewsDetails(index) {
    const news = window.newsData[index];
    const details = `
        <h5>${news.titulo}</h5>
        <p>${news.detalle}</p>
        <div class="text-center">
            ${news.enlaces ? news.enlaces.map(link => `<a href="${link.url}" target="_blank" class="btn btn-primary m-2">${link.texto}</a>`).join('') : ''}
        </div>
    `;
    document.getElementById('newsDetails').innerHTML = details;
    const modal = new bootstrap.Modal(document.getElementById('newsModal'));
    modal.show();
}