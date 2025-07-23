document.addEventListener('DOMContentLoaded', () => {
    // Variables globales para el juego
    const sobre = document.getElementById('sobre');
    const contenedorJuego = document.getElementById('contenedor-juego');
    const tituloJuego = document.getElementById('titulo-juego');
    let juegoActual = null;
    let temporizadorSecuencia = null;
    let triviaActual = null;

    // Elementos de audio
    const audioError = new Audio('audio/error.wav');
    const audioSuccess = new Audio('audio/success.wav');
    const audioClick = new Audio('audio/click.wav');
    const audioEstatica = new Audio('audio/estatica.mp3');
    
    // Configurar volúmenes
    audioError.volume = 0.7;
    audioSuccess.volume = 0.7;
    audioClick.volume = 0.5;
    audioEstatica.volume = 0.3;
    audioEstatica.loop = true;

    // Reproducir audio de estática al cargar
    document.addEventListener('click', () => {
        audioEstatica.play().catch(e => console.log('Audio pospuesto hasta interacción'));
    }, { once: true });

    // 9 juegos de cada tipo (incluyendo Sudoku)
    const juegos = [
        { nombre: "TRIVIA 1", tipo: "trivia" },
        { nombre: "TRIVIA 2", tipo: "trivia" },
        { nombre: "TRIVIA 3", tipo: "trivia" },
        { nombre: "TRIVIA 4", tipo: "trivia" },
        { nombre: "TRIVIA 5", tipo: "trivia" },
        { nombre: "TRIVIA 6", tipo: "trivia" },
        { nombre: "TRIVIA 7", tipo: "trivia" },
        { nombre: "TRIVIA 8", tipo: "trivia" },
        { nombre: "TRIVIA 9", tipo: "trivia" },
        { nombre: "SECUENCIA 1", tipo: "secuencia" },
        { nombre: "SECUENCIA 2", tipo: "secuencia" },
        { nombre: "SECUENCIA 3", tipo: "secuencia" },
        { nombre: "SECUENCIA 4", tipo: "secuencia" },
        { nombre: "SECUENCIA 5", tipo: "secuencia" },
        { nombre: "SECUENCIA 6", tipo: "secuencia" },
        { nombre: "SECUENCIA 7", tipo: "secuencia" },
        { nombre: "SECUENCIA 8", tipo: "secuencia" },
        { nombre: "SECUENCIA 9", tipo: "secuencia" },
        { nombre: "ROMPECABEZAS 1", tipo: "rompecabezas" },
        { nombre: "ROMPECABEZAS 2", tipo: "rompecabezas" },
        { nombre: "ROMPECABEZAS 3", tipo: "rompecabezas" },
        { nombre: "ROMPECABEZAS 4", tipo: "rompecabezas" },
        { nombre: "ROMPECABEZAS 5", tipo: "rompecabezas" },
        { nombre: "ROMPECABEZAS 6", tipo: "rompecabezas" },
        { nombre: "ROMPECABEZAS 7", tipo: "rompecabezas" },
        { nombre: "ROMPECABEZAS 8", tipo: "rompecabezas" },
        { nombre: "ROMPECABEZAS 9", tipo: "rompecabezas" },
        { nombre: "MEMORIA 1", tipo: "memoria" },
        { nombre: "MEMORIA 2", tipo: "memoria" },
        { nombre: "MEMORIA 3", tipo: "memoria" },
        { nombre: "MEMORIA 4", tipo: "memoria" },
        { nombre: "MEMORIA 5", tipo: "memoria" },
        { nombre: "MEMORIA 6", tipo: "memoria" },
        { nombre: "MEMORIA 7", tipo: "memoria" },
        { nombre: "MEMORIA 8", tipo: "memoria" },
        { nombre: "MEMORIA 9", tipo: "memoria" },
        { nombre: "SUDOKU 1", tipo: "sudoku" },
        { nombre: "SUDOKU 2", tipo: "sudoku" },
        { nombre: "SUDOKU 3", tipo: "sudoku" },
        { nombre: "SUDOKU 4", tipo: "sudoku" },
        { nombre: "SUDOKU 5", tipo: "sudoku" },
        { nombre: "SUDOKU 6", tipo: "sudoku" },
        { nombre: "SUDOKU 7", tipo: "sudoku" },
        { nombre: "SUDOKU 8", tipo: "sudoku" },
        { nombre: "SUDOKU 9", tipo: "sudoku" }
    ];

    // Inicializar el juego
    let juegosDisponibles = [...juegos];
    let juegosUsados = [];

    // Función global para verificar respuestas de trivia
    window.verificarRespuesta = function(respuestaUsuario, respuestaCorrecta, boton) {
        const opcionesTrivia = document.querySelector('.opciones-trivia');
        const resultadoContainer = document.getElementById('resultado-trivia-container');
        if (!opcionesTrivia || !resultadoContainer) return;
        
        // Limpiar resultado anterior
        resultadoContainer.innerHTML = '';
        const esCorrecta = respuestaUsuario === respuestaCorrecta;
        
        // Reproducir sonido según el resultado
        if (esCorrecta) {
            audioSuccess.currentTime = 0;
            audioSuccess.play().catch(e => console.log('Error al reproducir audio de éxito'));
        } else {
            audioError.currentTime = 0;
            audioError.play().catch(e => console.log('Error al reproducir audio de error'));
        }
        
        // Crear elemento de resultado con estilo retro
        const resultado = document.createElement('div');
        resultado.className = 'resultado-trivia';
        
        if (esCorrecta) {
            resultado.innerHTML = `
                <div class="mensaje-exito">
                    <p>¡CORRECTO!</p>
                </div>
            `;
            resultado.style.color = '#0f0';
            
            setTimeout(mostrarRecompensa, 1500);
        } else {
            resultado.innerHTML = `
                <div class="mensaje-error">
                    <p>¡INCORRECTO!</p>
                    <button onclick="reintentarTrivia()" class="btn-reintentar">REINTENTAR</button>
                </div>
            `;
            resultado.style.color = '#f00';
            
            // Resaltar el botón incorrecto
            if (boton) {
                boton.classList.add('incorrecto');
                setTimeout(() => boton.classList.remove('incorrecto'), 1000);
            }
        }
        
        resultado.style.fontSize = '24px';
        resultado.style.marginTop = '20px';
        resultado.style.textAlign = 'center';
        resultado.style.border = '2px solid #0f0';
        resultado.style.padding = '15px';
        resultado.style.backgroundColor = '#111';
        resultado.style.boxShadow = '0 0 10px #0f0';
        
        resultadoContainer.appendChild(resultado);
    };

    // Función global para reintentar trivia
    window.reintentarTrivia = function() {
        const resultadoContainer = document.getElementById('resultado-trivia-container');
        const opcionesTrivia = document.querySelector('.opciones-trivia');

        if (resultadoContainer) resultadoContainer.innerHTML = '';
        if (opcionesTrivia) {
            const botones = opcionesTrivia.querySelectorAll('button');
            botones.forEach(boton => {
                boton.classList.remove('incorrecto');
                boton.disabled = false;
            });
        }
    };

    // Evento para iniciar el juego
    document.getElementById('startButton').addEventListener('click', () => {
        triviaActual = null; // Reiniciar trivia actual
        console.log('Boton de inicio presionado');

        document.getElementById('bienvenida')?.classList.add('hidden');
        document.getElementById('minijuegos')?.classList.remove('hidden');

        if (juegosDisponibles.length === 0) {
            juegosDisponibles = [...juegos];
            juegosUsados = [];
            console.log('Reiniciando juegos disponibles');
        }
        const indiceAleatorio = Math.floor(Math.random() * juegosDisponibles.length);
        const juegosAsignado = juegosDisponibles[indiceAleatorio];

        juegosDisponibles.splice(indiceAleatorio, 1);
        juegosUsados.push(juegosAsignado);

        console.log("Juego asignado:", juegosAsignado.nombre);
        iniciarJuego(juegosAsignado.tipo);
    });

    function iniciarJuego(tipo) {
        if (temporizadorSecuencia) {
            clearInterval(temporizadorSecuencia);
            temporizadorSecuencia = null;
        }

        juegoActual = tipo;
        tituloJuego.textContent = `> ${tipo.toUpperCase()}`;
        contenedorJuego.innerHTML = '';

        switch (tipo) {
            case "trivia":
                // Array con preguntas de trivia
                const preguntasTrivia = [
                    { pregunta: "¿QUÉ ESCRITOR CREÓ A DON QUIJOTE DE LA MANCHA?", respuesta: "cervantes", opciones: ["CERVANTES", "SHAKESPEARE", "DOSTOIEVSKI", "GOETHE"] },
                    { pregunta: "¿CUÁL ES EL RÍO MÁS LARGO DEL MUNDO?", respuesta: "nilo", opciones: ["NILO", "AMAZONAS", "MISSISSIPI", "YANGTSÉ"] },
                    { pregunta: "¿EN QUÉ AÑO LLEGÓ EL HOMBRE A LA LUNA'?", respuesta: "1969", opciones: ["1969", "1957", "1975", "1982"] },
                    { pregunta: "¿QUIÉN PINTÓ 'LA NOCHE ESTRELLADA'?", respuesta: "van gogh", opciones: ["VAN GOGH", "PICASSO", "DALÍ", "MONET"] },
                    { pregunta: "¿CUÁL ES EL METAL MÁS CARO DEL MUNDO", respuesta: "rodio", opciones: ["RODIO", "ORO", "PLATINO", "PALADIO"] },
                    { pregunta: "¿QUÉ PAÍS TIENE FORMA DE BOTA?", respuesta: "italia", opciones: ["ITALIA", "FRANCIA", "ESPAÑA", "PORTUGAL"] },
                    { pregunta: "¿QUIÉN ESCRIBIÓ 'CIEN AÑOS DE SOLEDAD?", respuesta: "garcía márquez", opciones: ["GARCÍA MÁRQUEZ", "BORGES", "NERUDA", "VARGAS LLOSA"] },
                    { pregunta: "¿CUÁL ES EL PLANETA MÁS GRANDE DEL SISTEMA SOLAR?", respuesta: "júpiter", opciones: ["JÚPITER", "SATURNO", "TIERRA", "MARTE"] },
                    { pregunta: "¿QUÉ IDIOMA ES EL MÁS HABLADO DEL MUNDO COMO LENGUA MATERNA?", respuesta: "chino mandarín", opciones: ["CHINO MANDARÍN", "ESPAÑOL", "INGLÉS", "HINDI"] }
                ];
                
                triviaActual = triviaActual || preguntasTrivia[Math.floor(Math.random() * preguntasTrivia.length)];
    
                 contenedorJuego.innerHTML = `
                    <p class="pregunta-trivia">${triviaActual.pregunta}</p>
                    <div class="opciones-trivia">
                        ${triviaActual.opciones.map(opcion => 
                            `<button onclick="verificarRespuesta('${opcion.toLowerCase()}', '${triviaActual.respuesta}', this)">${opcion}</button>`
                        ).join('')}
                    </div>
                    <div id="resultado-trivia-container"></div>
                `;
                break;
                
            case "secuencia":
                const secuencias = [
                    [2, 4, 8, 16, 32, 64, 128],
                    [1, 3, 6, 10, 15, 21, 28],
                    [1, 1, 2, 3, 5, 8, 13],
                    [3, 9, 27, 81, 243, 729],
                    [1, 4, 9, 16, 25, 36, 49],
                    [1, 8, 27, 64, 125, 216],
                    [5, 10, 20, 40, 80, 160],
                    [10, 9, 8, 7, 6, 5, 4],
                    [2, 3, 5, 7, 11, 13, 17]
                ];
                
                const secuenciaBase = secuencias[Math.floor(Math.random() * secuencias.length)];
                const secuenciaMezclada = [...secuenciaBase].sort(() => Math.random() - 0.5);

                contenedorJuego.innerHTML = `
                <div class="secuencia-header">
                <p>Completa la secuencia:</p>
                <p class="pista">Pista: ${obtenerPistaSecuencia(secuenciaBase)}</p>
                </div>
                <div class="secuencia-container">
                <div class="secuencia-origen">
                ${secuenciaMezclada.map(num => `<div class="numero" draggable="true" data-valor="${num}">${num}</div>`).join('')}
                </div>
                <div class="secuencia-destino"></div>
                </div>
                <div class="secuencia-controls">
                <button id="btn-verificar-secuencia">VERIFICAR</button>
                <button id="btn-reiniciar-secuencia">REINICIAR</button>
                <div class="temporizador">Tiempo: <span id="tiempo">60</span>s</div>
                </div>
                `;
                setupSecuencia(secuenciaBase);
                break;
                
            case "rompecabezas":
                const imagenesRompecabezas = [
                    'img/art-steve.jpg',
                    'img/1.png',
                    'img/2.png',
                    'img/3.png',
                    'img/4.png',
                    'img/5.png',
                    'img/6.png',
                    'img/7.png',
                    'img/mini_penitente.png'
                ];
                
                const imagenAleatoria = imagenesRompecabezas[Math.floor(Math.random() * imagenesRompecabezas.length)];
                
                contenedorJuego.innerHTML = `
                <div class="puzzle-header">
                    <h2>ROMPECABEZAS RETRO</h2>
                    <p class="subtitle">Arrastra las piezas a su posición correcta</p>
                </div>
                <div class="puzzle-area">
                    <div class="puzzle-container">
                        <div class="puzzle-pieces-container">
                            <div class="puzzle-title">PIEZAS</div>
                            <div class="puzzle-pieces"></div>
                        </div>
                        <div class="puzzle-board-container">
                            <div class="puzzle-title">TABLERO</div>
                            <div class="puzzle-board"></div>
                        </div>
                    </div>
                    <div class="puzzle-controls">
                        <button id="btn-reiniciar-puzzle" class="btn-retro">REINICIAR</button>
                        <div class="puzzle-counter">Piezas colocadas: <span id="piezas-colocadas">0/9</span></div>
                    </div>
                </div>`;
                
                cargarYDividirImagen(imagenAleatoria);
                break;
                
            case "memoria":
                const simbolosMemoria = [
                    ['👾', '🦄', '👻', '🤖', '👾', '🦄', '👻', '🤖'],
                    ['🎮', '🕹️', '👾', '🖥️', '🎮', '🕹️', '👾', '🖥️'],
                    ['🐉', '🦊', '🐲', '🦁', '🐉', '🦊', '🐲', '🦁'],
                    ['⚡', '🔥', '💧', '🌪️', '⚡', '🔥', '💧', '🌪️'],
                    ['🍎', '🍌', '🍒', '🍓', '🍎', '🍌', '🍒', '🍓'],
                    ['🚀', '🛸', '🛰️', '👽', '🚀', '🛸', '🛰️', '👽'],
                    ['⚽', '🏀', '🏈', '⚾', '⚽', '🏀', '🏈', '⚾'],
                    ['🎸', '🎹', '🥁', '🎺', '🎸', '🎹', '🥁', '🎺'],
                    ['❤️', '💙', '💚', '💛', '❤️', '💙', '💚', '💛']
                ];
                
                const simbolos = simbolosMemoria[Math.floor(Math.random() * simbolosMemoria.length)];
                simbolos.sort(() => Math.random() - 0.5);
                
                contenedorJuego.innerHTML = `
                <div class="memoria-header">
                <h2>MEMORIA RETRO</h2>
                <p class="subtitle">Encuentra los pares ocultos</p>
                </div>
                <div class="memoria-grid">
                ${simbolos.map((s, i) => `
                    <div class="carta-memoria" data-valor="${s}" data-index="${i}">
                        <div class="cara frontal">?</div>
                        <div class="cara trasera">${s}</div>
                    </div>
                `).join('')}
                </div>
                <div class="memoria-stats">
                    <div class="stat-box">
                        <span class="stat-label">INTENTOS</span>
                        <span id="contador-intentos" class="stat-value">0</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-label">PARES</span>
                        <span id="pares" class="stat-value">0</span>
                    </div>
                </div>
                <button id="btn-reiniciar-memoria" class="btn-retro">REINICIAR</button>
                `;
                setupMemoria();
                break;

            case "sudoku":
                contenedorJuego.innerHTML = `
                    <div class="sudoku-header">
                        <h2>SUDOKU RETRO</h2>
                        <p class="subtitle">Completa la cuadrícula sin repetir números (1-9)</p>
                        <p class="instructions">Haz clic en una celda y escribe un número (1-9)</p>
                    </div>
                    <div class="sudoku-grid"></div>
                    <div class="sudoku-controls">
                        <div class="sudoku-buttons">
                            <button id="btn-verificar-sudoku">VERIFICAR</button>
                            <button id="btn-reiniciar-sudoku">REINICIAR</button>
                        </div>
                        <div class="sudoku-stats">
                            <div class="stat-box">
                                <span class="stat-label">ERRORES</span>
                                <span id="contador-errores" class="stat-value">0</span>
                            </div>
                            <div class="stat-box">
                                <span class="stat-label">TIEMPO</span>
                                <span id="tiempo-sudoku" class="stat-value">00:00</span>
                            </div>
                        </div>
                    </div>
                `;
                setupSudoku();
                break;
        }
        document.getElementById('minijuego')?.classList.remove('hidden');
    }

    // Función para obtener pistas de secuencia
    function obtenerPistaSecuencia(secuencia) {
        if (secuencia.every((num, i) => i === 0 || num === secuencia[i-1] * 2)) {
            return "Cada número es el doble del anterior";
        } else if (secuencia[0] === 1 && secuencia[1] === 1 && secuencia[2] === 2) {
            return "Secuencia Fibonacci (suma los dos anteriores)";
        } else if (secuencia.every((num, i) => i === 0 || num === secuencia[i-1] * 3)) {
            return "Cada número es el triple del anterior";
        } else if (secuencia.every((num, i) => num === (i+1)*(i+1))) {
            return "Cuadrados perfectos (1², 2², 3²...)";
        } else if (secuencia.every((num, i) => num === (i+1)*(i+1)*(i+1))) {
            return "Cubos perfectos (1³, 2³, 3³...)";
        } else if (secuencia.every((num, i) => i === 0 || num === secuencia[i-1] + i + 1)) {
            return "Suma números consecutivos (1, 1+2, 3+3...)";
        } else if (secuencia.every((num, i) => i === 0 || num === secuencia[i-1] - 1)) {
            return "Resta 1 cada vez";
        } else if ([2,3,5,7,11,13,17].includes(secuencia[0])) {
            return "Números primos en orden";
        } else {
            return "Busca el patrón matemático";
        }
    }

    function setupSecuencia(secuenciaBase) {
        const origen = document.querySelector('.secuencia-origen');
        const destino = document.querySelector('.secuencia-destino');
        const btnVerificar = document.getElementById('btn-verificar-secuencia');
        const btnReiniciar = document.getElementById('btn-reiniciar-secuencia');
        const tiempoElement = document.getElementById('tiempo');
        
        if (!destino || !btnVerificar || !btnReiniciar || !tiempoElement) {
            console.error("Elementos del juego de secuencia no encontrados");
            return;
        }
        
        let numerosColocados = [];
        let numeroArrastrado = null;
        let tiempoRestante = 60;
        let temporizadorSecuencia = null;

        // Configurar eventos para los números
        document.querySelectorAll('.numero').forEach(numero => {
            // Eventos para desktop
            numero.addEventListener('dragstart', (e) => {
                audioClick.currentTime = 0;
                audioClick.play().catch(e => console.log('Error al reproducir click'));
                e.dataTransfer.setData('text/plain', e.target.dataset.valor);
            });

            // Eventos táctiles mejorados para móvil
            let touchStartX, touchStartY;
            
            numero.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                touchStartX = touch.clientX;
                touchStartY = touch.clientY;
                
                numero.dataset.dragging = 'true';
                numero.style.position = 'fixed';
                numero.style.zIndex = '1000';
                numero.style.left = `${touch.clientX - 30}px`;
                numero.style.top = `${touch.clientY - 30}px`;
                numero.style.transition = 'none';
            });

            numero.addEventListener('touchmove', (e) => {
                if (numero.dataset.dragging === 'true') {
                    e.preventDefault();
                    const touch = e.touches[0];
                    numero.style.left = `${touch.clientX - 30}px`;
                    numero.style.top = `${touch.clientY - 30}px`;
                }
            });

            numero.addEventListener('touchend', (e) => {
                if (numero.dataset.dragging === 'true') {
                    e.preventDefault();
                    numero.dataset.dragging = 'false';
                    numero.style.position = 'static';
                    numero.style.zIndex = '';
                    
                    const touch = e.changedTouches[0];
                    const elementoDestino = document.elementFromPoint(touch.clientX, touch.clientY);
                    
                    if (elementoDestino && elementoDestino.classList.contains('secuencia-destino')) {
                        const valor = numero.dataset.valor;
                        if (!numerosColocados.includes(valor)) {
                            const clon = numero.cloneNode(true);
                            clon.draggable = false;
                            clon.classList.add('colocado');
                            
                            // Eliminar eventos táctiles del clon para evitar duplicados
                            clon.ontouchstart = null;
                            clon.ontouchmove = null;
                            clon.ontouchend = null;
                            
                            elementoDestino.appendChild(clon);
                            numerosColocados.push(valor);
                            verificarSecuencia();
                        }
                    }
                }
            });
        });

        // Configurar destino para desktop
        destino.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.target.classList.add('hover');
        });

        destino.addEventListener('dragleave', (e) => {
            e.target.classList.remove('hover');
        });

        destino.addEventListener('drop', (e) => {
            e.preventDefault();
            e.target.classList.remove('hover');

            const valor = e.dataTransfer.getData('text/plain');
            if (!numerosColocados.includes(valor)) {
                const numero = document.querySelector(`.numero[data-valor="${valor}"]`);
                if (!numero) return;
                
                const clon = numero.cloneNode(true);
                clon.draggable = false;
                clon.classList.add('colocado');

                let insertado = false;
                const elementos = destino.children;

                for (let i = 0; i < elementos.length; i++) {
                    if (parseInt(valor) < parseInt(elementos[i].dataset.valor)) {
                        destino.insertBefore(clon, elementos[i]);
                        insertado = true;
                        break;
                    }
                }
                if (!insertado) {
                    destino.appendChild(clon);
                }
                numerosColocados.push(valor);
                verificarSecuencia();
            }
        });

        function iniciarTemporizador() {
            tiempoElement.style.color = '#0f0';
            tiempoElement.style.animation = 'none';
            
            temporizadorSecuencia = setInterval(() => {
                tiempoRestante--;
                tiempoElement.textContent = tiempoRestante;

                if (tiempoRestante <= 10) {
                    tiempoElement.style.color = '#f00';
                    tiempoElement.style.animation = 'parpadeo 0.5s infinite';
                }

                if (tiempoRestante <= 0) {
                    clearInterval(temporizadorSecuencia);
                    audioError.currentTime = 0;
                    audioError.play().catch(e => console.log('Error al reproducir audio de error'));
                    alert("¡Tiempo agotado! Intenta de nuevo.");
                    reiniciarSecuencia();
                }
            }, 1000);
        }

        function reiniciarSecuencia() {
            clearInterval(temporizadorSecuencia);
            if (destino) destino.innerHTML = '';
            numerosColocados = [];
            tiempoRestante = 60;
            if (tiempoElement) {
                tiempoElement.textContent = tiempoRestante;
                tiempoElement.style.color = '#0f0';
                tiempoElement.style.animation = 'none';
            }
            iniciarTemporizador();
        }

        function verificarSecuencia() {
            if (numerosColocados.length === secuenciaBase.length) {
                // Convertir a números para comparación adecuada
                const secuenciaIngresada = Array.from(document.querySelectorAll('.secuencia-destino .numero'))
                    .map(el => parseInt(el.dataset.valor));
                
                const esCorrecta = secuenciaIngresada.every((val, i) => val === secuenciaBase[i]);
                
                if (esCorrecta) {
                    audioSuccess.currentTime = 0;
                    audioSuccess.play();
                    clearInterval(temporizadorSecuencia);
                    setTimeout(mostrarRecompensa, 1000);
                } else {
                    audioError.currentTime = 0;
                    audioError.play();
                    destino.classList.add('incorrecto');
                    setTimeout(() => {
                        destino.classList.remove('incorrecto');
                    }, 500);
                }
            }
        }

        btnVerificar.addEventListener('click', verificarSecuencia);
        btnReiniciar.addEventListener('click', reiniciarSecuencia);
        iniciarTemporizador();
    }

    function cargarYDividirImagen(imagenSrc = 'img/art-steve.jpg') {
        const puzzlePieces = document.querySelector('.puzzle-pieces');
        const puzzleBoard = document.querySelector('.puzzle-board');
        
        if (!puzzlePieces || !puzzleBoard) return;
        
        puzzlePieces.innerHTML = '<p>Cargando puzzle...</p>';
        puzzleBoard.innerHTML = '';
        
        const img = new Image();
        img.crossOrigin = "Anonymous";
        
        img.onload = function() {
            const rows = 3;
            const cols = 3;
            
            // Tamaño responsivo basado en el viewport
            const maxWidth = Math.min(window.innerWidth * 0.8, 500); // Máximo 500px o 80% del ancho
            const containerWidth = maxWidth - 40; // Ajustar por padding
            const pieceWidth = Math.floor(containerWidth / cols);
            const pieceHeight = pieceWidth; // Mantener relación cuadrada
            
            // Configurar el tablero
            puzzleBoard.style.display = 'grid';
            puzzleBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
            puzzleBoard.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
            puzzleBoard.style.width = `${pieceWidth * cols}px`;
            puzzleBoard.style.height = `${pieceHeight * rows}px`;
            puzzleBoard.style.margin = '0 auto';
            puzzleBoard.style.gap = '2px';
            
            // Crear slots vacíos
            for (let i = 1; i <= rows * cols; i++) {
                const slot = document.createElement('div');
                slot.className = 'puzzle-slot';
                slot.dataset.pos = i;
                puzzleBoard.appendChild(slot);
            }
            
            // Crear piezas
            puzzlePieces.innerHTML = '';
            puzzlePieces.style.display = 'flex';
            puzzlePieces.style.flexWrap = 'wrap';
            puzzlePieces.style.gap = '10px';
            puzzlePieces.style.justifyContent = 'center';
            puzzlePieces.style.maxWidth = `${pieceWidth * cols}px`;
            puzzlePieces.style.margin = '0 auto';
            
            let pieces = [];
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const pos = row * cols + col + 1;
                    const canvas = document.createElement('canvas');
                    canvas.width = pieceWidth;
                    canvas.height = pieceHeight;
                    const ctx = canvas.getContext('2d');
                    
                    // Dibujar la porción de imagen
                    ctx.drawImage(
                        img,
                        col * pieceWidth, row * pieceHeight, pieceWidth, pieceHeight,
                        0, 0, pieceWidth, pieceHeight
                    );
                    
                    const piece = document.createElement('div');
                    piece.className = 'puzzle-piece';
                    piece.draggable = true;
                    piece.dataset.pos = pos;
                    
                    const imgPiece = document.createElement('img');
                    imgPiece.src = canvas.toDataURL();
                    imgPiece.style.maxWidth = '100%';
                    imgPiece.style.height = 'auto';
                    imgPiece.alt = `Pieza ${pos}`;
                    
                    piece.appendChild(imgPiece);
                    pieces.push(piece);
                }
            }
            
            // Mezclar piezas
            pieces = pieces.sort(() => Math.random() - 0.5);
            pieces.forEach(piece => puzzlePieces.appendChild(piece));
            
            setupPuzzle();
        };
        
        img.onerror = function() {
            console.error('Error al cargar la imagen del puzzle');
            puzzlePieces.innerHTML = '';
            
            // Fallback con piezas de texto
            const pieceSize = Math.min(window.innerWidth * 0.2, 100); // 20% del ancho o máximo 100px
            const textParts = ['PIE', 'ZAS', 'DEL', 'PUI', 'ZZL', 'E!!', 'INT', 'ENT', 'A!!'];
            
            // Configurar el tablero para el fallback
            puzzleBoard.style.display = 'grid';
            puzzleBoard.style.gridTemplateColumns = 'repeat(3, 1fr)';
            puzzleBoard.style.gridTemplateRows = 'repeat(3, 1fr)';
            puzzleBoard.style.width = `${pieceSize * 3}px`;
            puzzleBoard.style.height = `${pieceSize * 3}px`;
            puzzleBoard.style.margin = '0 auto';
            
            for (let i = 1; i <= 9; i++) {
                const slot = document.createElement('div');
                slot.className = 'puzzle-slot';
                slot.dataset.pos = i;
                puzzleBoard.appendChild(slot);
            }
            
            // Crear piezas de texto
            for (let i = 0; i < 9; i++) {
                const piece = document.createElement('div');
                piece.className = 'puzzle-piece';
                piece.draggable = true;
                piece.dataset.pos = i+1;
                piece.textContent = textParts[i];
                piece.style.display = 'flex';
                piece.style.justifyContent = 'center';
                piece.style.alignItems = 'center';
                piece.style.fontSize = '24px';
                piece.style.color = '#0f0';
                piece.style.border = '1px solid #0f0';
                piece.style.width = `${pieceSize}px`;
                piece.style.height = `${pieceSize}px`;
                puzzlePieces.appendChild(piece);
            }
            
            setupPuzzle();
        };
        
        img.src = imagenSrc;
    }

    function actualizarTableroPuzzle(rows, cols) {
        const puzzleBoard = document.querySelector('.puzzle-board');
        if (!puzzleBoard) return;
        
        puzzleBoard.innerHTML = '';
        puzzleBoard.style.display = 'grid';
        puzzleBoard.style.gridTemplateColumns = `repeat(${cols}, 100px)`;
        puzzleBoard.style.gridTemplateRows = `repeat(${rows}, 100px)`;
        puzzleBoard.style.gap = '5px';
        
        for (let i = 1; i <= rows * cols; i++) {
            const slot = document.createElement('div');
            slot.className = 'puzzle-slot';
            slot.dataset.pos = i;
            puzzleBoard.appendChild(slot);
        }
    }

    function setupPuzzle() {
        const pieces = document.querySelectorAll('.puzzle-piece');
        const slots = document.querySelectorAll('.puzzle-slot');
        const puzzlePiecesContainer = document.querySelector('.puzzle-pieces');
        const piezasColocadasElement = document.getElementById('piezas-colocadas');
        
        if (!pieces.length || !slots.length) return;
        
        const totalPiezas = pieces.length;
        let colocadas = 0;
        let activePiece = null;
        let touchStartX, touchStartY;
        let pieceStartX, pieceStartY;

        // Configurar eventos para móviles
        pieces.forEach(piece => {
            // Eventos táctiles mejorados
            piece.addEventListener('touchstart', function(e) {
                e.preventDefault();
                const touch = e.touches[0];
                activePiece = this;
                
                // Guardar posición inicial
                touchStartX = touch.clientX;
                touchStartY = touch.clientY;
                const rect = this.getBoundingClientRect();
                pieceStartX = rect.left;
                pieceStartY = rect.top;
                
                // Estilo para el arrastre
                this.style.position = 'fixed';
                this.style.zIndex = '1000';
                this.style.left = `${touch.clientX - this.offsetWidth/2}px`;
                this.style.top = `${touch.clientY - this.offsetHeight/2}px`;
                this.style.transition = 'none';
                this.style.transform = 'scale(1.1)';
            });

            piece.addEventListener('touchmove', function(e) {
                if (activePiece === this) {
                    e.preventDefault();
                    const touch = e.touches[0];
                    this.style.left = `${touch.clientX - this.offsetWidth/2}px`;
                    this.style.top = `${touch.clientY - this.offsetHeight/2}px`;
                }
            });

            piece.addEventListener('touchend', function(e) {
                if (activePiece === this) {
                    e.preventDefault();
                    const touch = e.changedTouches[0];
                    const elementoDestino = document.elementFromPoint(touch.clientX, touch.clientY);
                    
                    // Restaurar estilos
                    this.style.position = '';
                    this.style.zIndex = '';
                    this.style.transform = '';
                    
                    // Verificar si se soltó sobre un slot
                    if (elementoDestino && elementoDestino.classList.contains('puzzle-slot')) {
                        const slot = elementoDestino;
                        
                        // Verificar si es el slot correcto
                        if (this.dataset.pos === slot.dataset.pos) {
                            // Si ya hay una pieza en este slot, la devolvemos al contenedor
                            if (slot.firstChild) {
                                puzzlePiecesContainer.appendChild(slot.firstChild);
                                colocadas--;
                            }
                            
                            // Colocamos la nueva pieza
                            slot.appendChild(this);
                            colocadas++;
                            
                            // Actualizar contador
                            if (piezasColocadasElement) {
                                piezasColocadasElement.textContent = `${colocadas}/${totalPiezas}`;
                            }
                            
                            // Reproducir sonido de éxito
                            audioSuccess.currentTime = 0;
                            audioSuccess.play();
                            
                            // Verificar si se completó el puzzle
                            if (colocadas === totalPiezas) {
                                setTimeout(mostrarRecompensa, 1000);
                            }
                        } else {
                            // Devolver a la posición original si no es el slot correcto
                            this.style.position = 'absolute';
                            this.style.left = `${pieceStartX}px`;
                            this.style.top = `${pieceStartY}px`;
                            
                            // Reproducir sonido de error
                            audioError.currentTime = 0;
                            audioError.play();
                            
                            // Efecto visual de error
                            slot.classList.add('incorrect');
                            setTimeout(() => slot.classList.remove('incorrect'), 500);
                        }
                    } else {
                        // Devolver a la posición original si no se soltó sobre un slot
                        this.style.position = 'absolute';
                        this.style.left = `${pieceStartX}px`;
                        this.style.top = `${pieceStartY}px`;
                    }
                    
                    activePiece = null;
                }
            });
        });

        // Configurar eventos para desktop (ratón)
        pieces.forEach(piece => {
            piece.addEventListener('dragstart', function(e) {
                audioClick.currentTime = 0;
                audioClick.play();
                e.dataTransfer.setData('text/plain', this.dataset.pos);
                this.classList.add('dragging');
            });

            piece.addEventListener('dragend', function() {
                this.classList.remove('dragging');
            });
        });

        slots.forEach(slot => {
            slot.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.classList.add('highlight');
            });

            slot.addEventListener('dragleave', function() {
                this.classList.remove('highlight');
            });

            slot.addEventListener('drop', function(e) {
                e.preventDefault();
                this.classList.remove('highlight');
                
                const piecePos = e.dataTransfer.getData('text/plain');
                const draggedPiece = document.querySelector(`.puzzle-piece[data-pos="${piecePos}"]:not(.placed)`);
                
                if (!draggedPiece) return;
                
                if (piecePos === this.dataset.pos) {
                    audioSuccess.currentTime = 0;
                    audioSuccess.play();
                    
                    // Si ya hay una pieza en este slot, la removemos
                    if (this.firstChild) {
                        const existingPiece = this.firstChild;
                        existingPiece.classList.remove('placed');
                        existingPiece.draggable = true;
                        puzzlePiecesContainer.appendChild(existingPiece);
                        colocadas--;
                    }
                    
                    // Colocamos la nueva pieza
                    draggedPiece.classList.add('placed');
                    draggedPiece.draggable = false;
                    this.appendChild(draggedPiece);
                    
                    colocadas++;
                    
                    // Actualizar contador
                    if (piezasColocadasElement) {
                        piezasColocadasElement.textContent = `${colocadas}/${totalPiezas}`;
                    }
                    
                    if (colocadas === totalPiezas) {
                        setTimeout(mostrarRecompensa, 1000);
                    }
                } else {
                    audioError.currentTime = 0;
                    audioError.play();
                    this.classList.add('incorrect');
                    setTimeout(() => {
                        this.classList.remove('incorrect');
                    }, 500);
                }
            });
        });

        // Botón de reinicio
        document.getElementById('btn-reiniciar-puzzle')?.addEventListener('click', () => {
            audioClick.currentTime = 0;
            audioClick.play();
            
            slots.forEach(slot => {
                while (slot.firstChild) {
                    const piece = slot.firstChild;
                    piece.classList.remove('placed');
                    piece.draggable = true;
                    puzzlePiecesContainer.appendChild(piece);
                }
            });
            
            colocadas = 0;
            
            // Actualizar contador
            if (piezasColocadasElement) {
                piezasColocadasElement.textContent = `0/${totalPiezas}`;
            }
            
            // Mezclar las piezas
            const piecesArray = Array.from(pieces);
            piecesArray.sort(() => Math.random() - 0.5);
            piecesArray.forEach(piece => puzzlePiecesContainer.appendChild(piece));
        });
    }
    
    function setupMemoria() {
        const cartas = document.querySelectorAll('.carta-memoria');
        const contadorIntentos = document.getElementById('contador-intentos');
        const contadorPares = document.getElementById('pares');
        const btnReiniciar = document.getElementById('btn-reiniciar-memoria');

        if (!cartas.length || !contadorIntentos || !contadorPares || !btnReiniciar) return;

        let hasFlippedCard = false;
        let lockBoard = false;
        let firstCard, secondCard;
        let intentos = 0;
        let paresEncontrados = 0;

        function flipCard() {
            if (lockBoard) return;
            if (this === firstCard) return;
            if (this.classList.contains('matched')) return;

            audioClick.currentTime = 0;
            audioClick.play().catch(e => console.log('Error al reproducir click'));
            
            this.classList.add('flip');

            if (!hasFlippedCard) {
                hasFlippedCard = true;
                firstCard = this;
                return;
            }

            secondCard = this;
            intentos++;
            contadorIntentos.textContent = intentos;
            checkForMatch();
        }

        function checkForMatch() {
            const isMatch = firstCard.dataset.valor === secondCard.dataset.valor;
            isMatch ? disableCards() : unflipCards();
        }

        function disableCards() {
            audioSuccess.currentTime = 0;
            audioSuccess.play().catch(e => console.log('Error al reproducir audio de éxito'));
            
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            
            paresEncontrados++;
            contadorPares.textContent = paresEncontrados;

            resetBoard();

            if (paresEncontrados === 4) {
                setTimeout(mostrarRecompensa, 1000);
            }
        }

        function unflipCards() {
            audioError.currentTime = 0;
            audioError.play().catch(e => console.log('Error al reproducir audio de error'));
            
            lockBoard = true;

            setTimeout(() => {
                firstCard.classList.remove('flip');
                secondCard.classList.remove('flip');
                resetBoard();
            }, 1000);
        }

        function resetBoard() {
            [hasFlippedCard, lockBoard] = [false, false];
            [firstCard, secondCard] = [null, null];
        }

        function reiniciarJuego() {
            audioClick.currentTime = 0;
            audioClick.play().catch(e => console.log('Error al reproducir click'));
            
            cartas.forEach(carta => {
                carta.classList.remove('flip', 'matched');
            });

            intentos = 0;
            paresEncontrados = 0;
            contadorIntentos.textContent = '0';
            contadorPares.textContent = '0';

            setTimeout(() => {
                cartas.forEach(carta => {
                    const randomPos = Math.floor(Math.random() * 12);
                    carta.style.order = randomPos;
                });
            }, 500);

            resetBoard();
        }

        cartas.forEach(carta => carta.addEventListener('click', flipCard));
        btnReiniciar.addEventListener('click', reiniciarJuego);
        reiniciarJuego();
    }

    function setupSudoku() {
        const grid = document.querySelector('.sudoku-grid');
        const btnVerificar = document.getElementById('btn-verificar-sudoku');
        const btnReiniciar = document.getElementById('btn-reiniciar-sudoku');
        const contadorErrores = document.getElementById('contador-errores');
        const tiempoElement = document.getElementById('tiempo-sudoku');
        
        if (!grid || !btnVerificar || !btnReiniciar || !contadorErrores || !tiempoElement) {
            console.error("Elementos del Sudoku no encontrados");
            return;
        }
        
        // Limpiar el grid antes de comenzar
        grid.innerHTML = '';
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(9, 1fr)';
        grid.style.gridTemplateRows = 'repeat(9, 1fr)';
        grid.style.gap = '1px';
        grid.style.border = '2px solid #0f0';
        
        let selectedCell = null;
        let errores = 0;
        let startTime = new Date();
        let timerInterval = null;
        let board = generateSudokuBoard();
        let initialBoard = JSON.parse(JSON.stringify(board));
        
        // Crear las celdas del Sudoku
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('input');
                cell.type = 'text';
                cell.inputMode = 'numeric';
                cell.maxLength = 1;
                cell.className = 'sudoku-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                // Establecer el valor inicial si no es cero
                if (board[row][col] !== 0) {
                    cell.value = board[row][col];
                    cell.classList.add('fixed');
                    cell.readOnly = true;
                } else {
                    cell.addEventListener('focus', () => {
                        if (selectedCell) selectedCell.classList.remove('selected');
                        selectedCell = cell;
                        cell.classList.add('selected');
                    });
                    
                    cell.addEventListener('input', (e) => {
                        // Solo permitir números del 1 al 9
                        const value = e.target.value;
                        if (/^[1-9]$/.test(value)) {
                            board[row][col] = parseInt(value);
                            audioClick.play();
                            checkBoard();
                        } else if (value === '') {
                            board[row][col] = 0;
                        } else {
                            e.target.value = '';
                        }
                    });
                }
                
                // Añadir bordes más gruesos para los cuadrantes 3x3
                if (row % 3 === 0) cell.style.borderTop = '2px solid #0f0';
                if (col % 3 === 0) cell.style.borderLeft = '2px solid #0f0';
                if (row === 8) cell.style.borderBottom = '2px solid #0f0';
                if (col === 8) cell.style.borderRight = '2px solid #0f0';
                
                grid.appendChild(cell);
            }
        }
        
        // Iniciar temporizador
        timerInterval = setInterval(() => {
            const now = new Date();
            const elapsed = Math.floor((now - startTime) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            tiempoElement.textContent = `${minutes}:${seconds}`;
        }, 1000);
        
        // Botón de verificación
        btnVerificar.addEventListener('click', () => {
            audioClick.play();
            
            if (isBoardComplete()) {
                if (isBoardValid()) {
                    clearInterval(timerInterval);
                    setTimeout(mostrarRecompensa, 1000);
                } else {
                    errores++;
                    contadorErrores.textContent = errores;
                    audioError.play();
                    alert("Hay errores en el tablero. Revisa tus números.");
                }
            } else {
                alert("Completa todos los espacios antes de verificar.");
            }
        });
        
        // Botón de reinicio
        btnReiniciar.addEventListener('click', () => {
            audioClick.play();
            clearInterval(timerInterval);
            
            // Resetear el tablero
            const cells = document.querySelectorAll('.sudoku-cell');
            cells.forEach(cell => {
                const row = cell.dataset.row;
                const col = cell.dataset.col;
                
                if (!cell.classList.contains('fixed')) {
                    cell.value = '';
                    board[row][col] = 0;
                    cell.classList.remove('error');
                }
            });
            
            errores = 0;
            contadorErrores.textContent = '0';
            startTime = new Date();
            timerInterval = setInterval(updateTimer, 1000);
        });
        
        function checkBoard() {
            const cells = document.querySelectorAll('.sudoku-cell');
            let tieneErrores = false;
            
            cells.forEach(cell => {
                const row = cell.dataset.row;
                const col = cell.dataset.col;
                const value = board[row][col];
                
                if (value !== 0 && !isValidPlacement(board, row, col, value)) {
                    cell.classList.add('error');
                    tieneErrores = true;
                } else {
                    cell.classList.remove('error');
                }
            });
            
            if (tieneErrores) {
                audioError.play();
            }
        }
        
        function isBoardComplete() {
            return board.every(row => row.every(cell => cell !== 0));
        }
        
        function isBoardValid() {
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    const value = board[row][col];
                    if (value !== 0 && !isValidPlacement(board, row, col, value)) {
                        return false;
                    }
                }
            }
            return true;
        }
        
        function updateTimer() {
            const now = new Date();
            const elapsed = Math.floor((now - startTime) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            tiempoElement.textContent = `${minutes}:${seconds}`;
        }
    }

    // Funciones auxiliares para Sudoku
    function generateSudokuBoard() {
        // Tablero vacío
        let board = Array(9).fill().map(() => Array(9).fill(0));
        
        // Resolver un tablero vacío para obtener una solución completa
        solveSudoku(board);
        
        // Eliminar números para crear el puzzle
        const cellsToRemove = 15; // Nivel medio (puedes ajustar esto)
        let removed = 0;
        
        while (removed < cellsToRemove) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            
            if (board[row][col] !== 0) {
                board[row][col] = 0;
                removed++;
            }
        }
        
        return board;
    }

    function solveSudoku(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isValidPlacement(board, row, col, num)) {
                            board[row][col] = num;
                            
                            if (solveSudoku(board)) {
                                return board;
                            } else {
                                board[row][col] = 0;
                            }
                        }
                    }
                    return false;
                }
            }
        }
        return board;
    }

    function isValidPlacement(board, row, col, num) {
        // Verificar fila
        for (let x = 0; x < 9; x++) {
            if (board[row][x] === num && x !== col) return false;
        }
        
        // Verificar columna
        for (let x = 0; x < 9; x++) {
            if (board[x][col] === num && x !== row) return false;
        }
        
        // Verificar cuadrante 3x3
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        
        for (let x = boxRow; x < boxRow + 3; x++) {
            for (let y = boxCol; y < boxCol + 3; y++) {
                if (board[x][y] === num && x !== row && y !== col) return false;
            }
        }
        
        return true;
    }

    function mostrarRecompensa() {
        // Detener cualquier audio o temporizador activo
        audioSuccess.currentTime = 0;
        audioSuccess.play().catch(e => console.error('Error audio:', e));
        
        // Ocultar pantallas innecesarias
        document.getElementById('minijuegos').classList.add('hidden');
        document.getElementById('bienvenida').classList.add('hidden');
        
        // Mostrar recompensa y enfocar el botón
        const recompensa = document.getElementById('recompensa');
        recompensa.classList.remove('hidden');
        document.getElementById('btn-entrar').focus();
        
        console.log("Recompensa mostrada"); // Para debug
    }

    document.getElementById('btn-entrar')?.addEventListener('click', () => {
        // Crear modal retro
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.9)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '1000';
        
        modal.innerHTML = `
            <div style="
                border: 3px solid #0f0;
                padding: 30px;
                background: #000;
                max-width: 500px;
                text-align: center;
                box-shadow: 0 0 20px #0f0;
                position: relative;
            ">
                <p style="
                    font-size: 24px;
                    color: #0f0;
                    margin-bottom: 20px;
                    text-shadow: 0 0 5px #0f0;
                ">>> SISTEMA DE IDENTIFICACIÓN <<<</p>
                
                <p style="color: #0f0; margin-bottom: 15px;">INGRESA TU NOMBRE DE AGENTE:</p>
                
                <input type="text" id="nombre-agente" style="
                    background: #000;
                    border: 1px solid #0f0;
                    color: #0f0;
                    font-family: 'VT323', monospace;
                    font-size: 24px;
                    padding: 10px;
                    width: 80%;
                    margin-bottom: 20px;
                    text-align: center;
                ">
                
                <div>
                    <button id="confirmar-nombre" style="
                        background: #000;
                        color: #0f0;
                        border: 2px solid #0f0;
                        font-family: 'VT323', monospace;
                        font-size: 22px;
                        padding: 10px 25px;
                        margin: 0 10px;
                        cursor: pointer;
                    ">CONFIRMAR</button>
                    
                    <button id="cancelar-nombre" style="
                        background: #000;
                        color: #f00;
                        border: 2px solid #f00;
                        font-family: 'VT323', monospace;
                        font-size: 22px;
                        padding: 10px 25px;
                        margin: 0 10px;
                        cursor: pointer;
                    ">CANCELAR</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const inputNombre = document.getElementById('nombre-agente');
        inputNombre?.focus();
        
        document.getElementById('confirmar-nombre')?.addEventListener('click', () => {
            audioClick.currentTime = 0;
            audioClick.play().catch(e => console.log('Error al reproducir click'));
            
            const nombre = inputNombre?.value.trim();
            if (nombre) {
                modal.remove();
                window.location.href = `carta.html?nombre=${encodeURIComponent(nombre)}`;
            } else {
                audioError.currentTime = 0;
                audioError.play().catch(e => console.log('Error al reproducir audio de error'));
                inputNombre.style.animation = 'shake 0.5s';
                setTimeout(() => inputNombre.style.animation = '', 500);
            }
        });
        
        document.getElementById('cancelar-nombre')?.addEventListener('click', () => {
            audioClick.currentTime = 0;
            audioClick.play().catch(e => console.log('Error al reproducir click'));
            
            modal.remove();

            // Sistema de recuperación de pantallas negras
            setInterval(() => {
                const minijuego = document.getElementById('minijuego');
                const recompensa = document.getElementById('recompensa');
                
                if (minijuego && recompensa) {
                    const minijuegoVisible = !minijuego.classList.contains('hidden') || 
                                           window.getComputedStyle(minijuego).display !== 'none';
                    const recompensaVisible = !recompensa.classList.contains('hidden') || 
                                             window.getComputedStyle(recompensa).display !== 'none';
                    
                    if (!minijuegoVisible && !recompensaVisible) {
                        console.warn('Pantalla negra detectada, recuperando...');
                        location.reload();
                    }
                }
            }, 3000);
        });
    });

    // Añadir event listener para redimensionamiento
    window.addEventListener('resize', function() {
        if (juegoActual === 'rompecabezas') {
            const imgSrc = document.querySelector('.puzzle-pieces img')?.src;
            if (imgSrc) {
                cargarYDividirImagen(imgSrc);
            }
        }
    });
});