function obtenerDatosIniciales() {
    obtenerDatosIni();
    function obtenerDatosIni(){
        const url = 'https://pokeapi.co/api/v2/pokemon?limit=10';
        fetch(url)
            .then(respuesta => respuesta.json())
            .then(resultado => {
                resultado.results.forEach(pokemon => {
                    fetch(pokemon.url)
                        .then(respuesta => respuesta.json())
                        .then(resultado => {
                            mostrarPokemonIni(resultado);
                        })
                });
            })
            .catch(error => console.log('Error al cargar los datos iniciales', error));
    }

    function mostrarPokemonIni(pokemon){
        const img_url = pokemon['sprites']['other']['official-artwork']['front_default'];
        const responsiveDiv = document.createElement('DIV');
        const galleryDiv = document.createElement('DIV');
        const descDiv = document.createElement('DIV');
        responsiveDiv.classList.add('responsive');
        galleryDiv.classList.add('gallery');
        descDiv.classList.add('desc','mt-3');
        descDiv.innerHTML = `
            <img src="${img_url}" alt="Imagen de ${pokemon.name}">
            <p>Nombre: ${pokemon.name}</p>
        `;
        galleryDiv.appendChild(descDiv);
        responsiveDiv.appendChild(galleryDiv);
        resultado.appendChild(responsiveDiv);
    }
}

function iniciarApp(){
    const formulario = document.querySelector('#formulario');
    const resultado = document.querySelector('#resultado');
    const microfono = document.querySelector('#microfono');
    const pokencontrado = document.querySelector('#pokencontrado');

    microfono.addEventListener('click', busquedaxVoz);

    window.addEventListener('load', () => {
        formulario.addEventListener('submit', validarFormulario);
    });

    function validarFormulario(e){
        e.preventDefault();
        const pokemon = document.querySelector('#pokemon').value.toLowerCase();
        if(pokemon === ''){
            mostrarAlerta('El campo buscar es obligatorio');
            return;
        }

        obtenerDatos(pokemon);
    }

    function mostrarAlerta(mensaje){
        const clAlerta = document.querySelector('.alert-danger');
        if(!clAlerta){
            const divAlerta = document.createElement('DIV');
            divAlerta.classList.add('alert' ,'alert-danger','p-2', 'mt-3');
            divAlerta.innerHTML = mensaje;
            formulario.appendChild(divAlerta);
            setTimeout(() => {
                divAlerta.remove();
            }, 2000);
        }
    }

    function obtenerDatos(pokemon){
        limpiarHTML();
        const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
        fetch(url)
            .then(respuesta => respuesta.json() )
            .then(resultado => mostrarPokemon(resultado) )
            .catch(error => mostrarAlerta(error))
    }

    function mostrarPokemon(pokemon){
        const img_url = pokemon['sprites']['other']['official-artwork']['front_default'];
        const resDiv = document.createElement('DIV');
        const responsiveDiv = document.createElement('DIV');
        const galleryDiv = document.createElement('DIV');
        const descDiv = document.createElement('DIV');
        resDiv.classList.add('alert','alert-info','text-center','font-weight-bold');
        responsiveDiv.classList.add('responsive');
        galleryDiv.classList.add('gallery');
        descDiv.classList.add('desc','mt-3');
        descDiv.innerHTML = `
            <img src="${img_url}" alt="Imagen de ${pokemon.name}">
            <p>Nombre: ${pokemon.name}</p>
        `;
        resDiv.innerHTML = `
            <h4>Pokemones encontrados</h4>
        `;
        pokencontrado.appendChild(resDiv);
        galleryDiv.appendChild(descDiv);
        responsiveDiv.appendChild(galleryDiv);
        resultado.appendChild(pokencontrado);
        resultado.appendChild(responsiveDiv);

        setTimeout(() => {
            pokencontrado.remove();
        }, 2000);

        formulario.reset();
    }

    function limpiarHTML(){
        while(resultado.firstChild){
            resultado.removeChild(resultado.firstChild);
        }

        while(pokencontrado.firstChild){
            pokencontrado.removeChild(pokencontrado.firstChild);
        }
    }

    function busquedaxVoz(){
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.lang = 'es-ES';
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.start();
    
            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript.toLowerCase();
                obtenerDatos(transcript)
            };
    
            recognition.onerror = function(event) {
                mostrarAlerta('Error de reconocimiento de voz:', event.error);
            };
        } else {
            mostrarAlerta('La API de reconocimiento de voz no es compatible con este navegador.');
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    iniciarApp();
    obtenerDatosIniciales();
});