// CARTA-DEFINITIVA-SIN-BOTON.js
document.addEventListener('DOMContentLoaded', function() {
    // 1. Limpieza inicial para evitar duplicados
    document.body.innerHTML = '';
    
    // 2. Configuración inicial
    const urlParams = new URLSearchParams(window.location.search);
    const nombre = urlParams.get('nombre') || 'Invitado Desconocido';
    
    // 3. Crear estructura HTML completa
    document.body.innerHTML = `
        <div class="carta-wrapper">
            <div class="carta-papel">
                <div class="membrete">
                    <div class="logo-cruel">C.R.U.E.L.</div>
                    <div class="fecha">${new Date().toLocaleDateString()}</div>
                </div>
                <div class="contenido-carta" id="contenido-carta"></div>
            </div>
            <audio id="type-sound" src="audio/type.mp3" preload="auto"></audio>
            <div class="instruccion-inicial">Haz clic para comenzar</div>
        </div>
    `;

    // 4. Contenido de la carta actualizado en párrafos
    const lineas = [
        `Estimado(a) <span class="neon-text">${nombre}</span>:`,
        `<strong>Felicitaciones.</strong>`,
        `Has logrado resolver el acertijo, y eso dice mucho de ti. Tu mente es rápida, adaptable... útil.`,
        `Ahora formas parte de algo más grande. A partir de este momento, tu vida cambiará. Lo que conocías ya no importa. Solo queda avanzar, cumplir, sobrevivir.`,
        `Estás autorizado para participar en las pruebas del Laberinto. Serás observado. Serás evaluado. Cada paso que des nos dirá quién eres realmente.`,
        `Recuerda algo muy importante:`,
        `<span class="cruel-axioma">C.R.U.E.L. es bueno.</span>`,
        `Confía en el proceso.<br>Confía en nosotros.`,
        `<div class="firma">
            <p>Atentamente,</p>
            <p><span class="neon-text">Ava Paige</span></p>
            <p>Directora de Operaciones</p>
            <p class="cruel-logo">C.R.U.E.L.</p>
        </div>`,
         `<div class="discord-link">
        <p>Solo los observadores sabrán a dónde ir...</p>
        <a href="https://discord.gg/dedsafioo" class="discord-button" target="_blank">
        </a>
    </div>`
    ];

    // 5. Configuración de audio
    const typeSound = document.getElementById('type-sound');
    typeSound.volume = 0.5;

    // 6. Variables de control
    let isWriting = false;

    // 7. Función para reproducir sonido
    function playTypeSound() {
        try {
            typeSound.currentTime = 0;
            const playPromise = typeSound.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => console.log('Reproducción bloqueada:', e));
            }
        } catch (e) {
            console.log('Error de audio:', e);
        }
    }

    // 8. Efecto de escritura para párrafos
    async function escribirCarta() {
        isWriting = true;
        const contenido = document.getElementById('contenido-carta');
        contenido.innerHTML = '';
        document.querySelector('.carta-papel').style.opacity = '1';
        playTypeSound();
        typeSound.loop = true;
        
        for (const linea of lineas) {
            const lineaElem = document.createElement('p');
            contenido.appendChild(lineaElem);
            
            if (linea.trim() === '') {
                lineaElem.innerHTML = '&nbsp;';
                await new Promise(r => setTimeout(r, 300));
                continue;
            }
            
            let i = 0;
            while (i < linea.length) {
                if (linea[i] === '<') {
                    const finTag = linea.indexOf('>', i);
                    lineaElem.innerHTML += linea.substring(i, finTag + 1);
                    i = finTag + 1;
                } else {
                    lineaElem.innerHTML += linea[i++];
                    await new Promise(r => setTimeout(r, 25 + Math.random() * 40));
                }
            }
            await new Promise(r => setTimeout(r, 400));
        }

        typeSound.pause();
        isWriting = false;
    }

    // 9. Iniciar la animación al hacer clic
    document.querySelector('.instruccion-inicial').addEventListener('click', function() {
        this.remove();
        escribirCarta().catch(e => console.error('Error:', e));
    }, { once: true });

    // 10. Estilos CSS integrados
    const style = document.createElement('style');
    style.textContent = `
        body {
            margin: 0;
            padding: 0;
            background-color: #111;
            font-family: 'Courier New', monospace;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: auto;
            color: #ddd;
        }
        .carta-wrapper {
            width: 100%;
            max-width: 800px;
            padding: 20px;
            display: flex;
            justify-content: center;
        }
        .carta-papel {
            background-color: #f5f5f0;
            padding: 40px;
            color: #333;
            line-height: 1.6;
            opacity: 0;
            transition: opacity 1s;
            width: 100%;
            max-width: 700px;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
            border-radius: 8px;
        }
        .membrete {
            display: flex;
            justify-content: space-between;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            margin-bottom: 20px;
            color: #c00;
            font-weight: bold;
            font-size: 1.2em;
            letter-spacing: 2px;
        }
        .contenido-carta p {
            margin: 12px 0;
            font-size: 1.1em;
        }
        .neon-text {
            color: #c00;
            font-weight: bold;
            text-shadow:
                0 0 5px #c00,
                0 0 10px #c00,
                0 0 20px #ff0000,
                0 0 30px #ff0000,
                0 0 40px #ff0000;
        }
        .cruel-axioma {
            font-style: italic;
            font-weight: bold;
            color: #c00;
            font-size: 1.2em;
            margin: 20px 0;
            border-left: 4px solid #c00;
            padding-left: 10px;
            background-color: rgba(200,0,0,0.1);
        }
        .firma {
            margin-top: 40px;
            font-weight: bold;
            text-align: right;
            color: #900;
        }
        .cruel-logo {
            font-style: italic;
            font-weight: bold;
            color: #c00;
            font-size: 1.1em;
            letter-spacing: 4px;
        }
        #type-sound {
            display: none;
        }
        .instruccion-inicial {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #0f0;
            font-family: 'Courier New', monospace;
            font-size: 24px;
            text-shadow: 0 0 5px #0f0;
            cursor: pointer;
            user-select: none;
        }
    `;
    document.head.appendChild(style);
});
