// ==========================================
// ATRAPA LOS CUPCAKES
// ==========================================


// ------------------------------
// ELEMENTOS
// ------------------------------

const inicio = document.getElementById("inicio");
const juego = document.getElementById("juego");

const btnStart = document.getElementById("btnStart");
const btnJugar = document.getElementById("btnJugar");

const modalInstrucciones =
    document.getElementById("modalInstrucciones");

const modalResultado =
    document.getElementById("modalResultado");

const modalPausa =
    document.getElementById("modalPausa");

const modalPremioPequeno =
    document.getElementById("modalPremioPequeno");

const btnSeguir =
    document.getElementById("btnSeguir");

const btnQuedarse =
    document.getElementById("btnQuedarse");

const areaJuego =
    document.getElementById("areaJuego");

const cesta =
    document.getElementById("cesta");

const puntosTexto =
    document.getElementById("puntos");

const vidasTexto =
    document.getElementById("vidas");

const nivelTexto =
    document.getElementById("nivel");

const tiempoTexto =
    document.getElementById("tiempo");

const progreso =
    document.getElementById("progreso");


// ------------------------------
// VARIABLES
// ------------------------------

let puntos = 0;
let vidas = 3;
let nivel = 1;

let tiempo = 180;

let jugando = false;
let pausado = false;

let posicionCesta = 0.5;

let objetos = [];

let intervaloObjetos;
let intervaloTiempo;

let animacion;

let ultimoTiempo = 0;

let premioPequenoMostrado = false;

// Control de cuenta regresiva
let cuentaRegresiva = false;
let temporizadorCuentaRegresiva = null;

// Control del mensaje de nivel
let temporizadorMensaje = null;


// ------------------------------
// BOTÓN START
// ------------------------------

btnStart.addEventListener("click", () => {

    modalInstrucciones.classList.remove("oculto");

});


// ------------------------------
// CERRAR INSTRUCCIONES
// ------------------------------

document
    .getElementById("cerrarInstrucciones")
    .addEventListener("click", () => {

        modalInstrucciones.classList.add("oculto");

    });


// ------------------------------
// COMENZAR JUEGO
// ------------------------------

btnJugar.addEventListener("click", iniciarJuego);


function iniciarJuego() {

    clearTimeout(temporizadorCuentaRegresiva);
    clearTimeout(temporizadorMensaje);

    cuentaRegresiva = false;

    modalInstrucciones.classList.add("oculto");
    modalResultado.classList.add("oculto");
    modalPausa.classList.add("oculto");
    modalPremioPequeno.classList.add("oculto");


    inicio.classList.add("oculto");
    juego.classList.remove("oculto");


    puntos = 0;
    vidas = 3;
    nivel = 1;

    tiempo = 180;

    posicionCesta = 0.5;

    jugando = true;
    pausado = false;

    premioPequenoMostrado = false;


    objetos.forEach(objeto => {

        objeto.elemento.remove();

    });

    objetos = [];


    actualizarMarcador();

    colocarCesta();

    mostrarNivel();


    clearInterval(intervaloObjetos);
    clearInterval(intervaloTiempo);

    intervaloObjetos =
        setInterval(crearCupcake, 700);

    intervaloTiempo =
        setInterval(contarTiempo, 1000);


    ultimoTiempo = performance.now();

    cancelAnimationFrame(animacion);

    animacion =
        requestAnimationFrame(bucleJuego);
}


// ------------------------------
// MARCADOR
// ------------------------------

function actualizarMarcador() {

    puntosTexto.textContent = puntos;
    vidasTexto.textContent = vidas;
    nivelTexto.textContent = nivel;
    tiempoTexto.textContent = tiempo;


    let porcentaje =
        Math.min((puntos / 250) * 100, 100);

    progreso.style.width =
        porcentaje + "%";
}


// ------------------------------
// CREAR CUPCAKE
// ------------------------------

function crearCupcake() {

    if (!jugando || pausado || cuentaRegresiva) {
        return;
    }


    let numero =
        Math.random();


    let tipo = "bueno";


    if (nivel >= 2 && numero < 0.20) {

        tipo = "podrido";

    }


    if (nivel >= 4 && numero < 0.08) {

        tipo = "bomba";

    }


    if (nivel >= 6 && numero < 0.14) {

        tipo = "bomba";

    }


    const elemento =
        document.createElement("img");


    elemento.classList.add("objeto");


    if (tipo === "bueno") {

        elemento.src =
            "img/cupcake.png";

    }

    else if (tipo === "podrido") {

        elemento.src =
            "img/cupcake_podrido.png";

        elemento.classList.add("podrido");

    }

    else {

        elemento.src =
            "img/bomba_cupcake.png";

        elemento.classList.add("bomba");

    }


    let x =
        Math.random() *
        (areaJuego.clientWidth - 70);

    let y = -70;


    elemento.style.left =
        x + "px";

    elemento.style.top =
        y + "px";


    areaJuego.appendChild(elemento);


    objetos.push({

        elemento: elemento,

        tipo: tipo,

        x: x,

        y: y,

        velocidad:
            150 +
            nivel * 30 +
            Math.random() * 70,

        movimiento:
            (Math.random() - 0.5) *
            (10 + nivel * 2)

    });

}


// ------------------------------
// BUCLE DEL JUEGO
// ------------------------------

function bucleJuego(ahora) {

    if (!jugando) {

        return;

    }


    let delta =
        Math.min(
            (ahora - ultimoTiempo) / 1000,
            0.035
        );


    ultimoTiempo = ahora;


    if (!pausado) {

        for (
            let i = objetos.length - 1;
            i >= 0;
            i--
        ) {

            let objeto =
                objetos[i];


            objeto.y +=
                objeto.velocidad * delta;


            objeto.x +=
                objeto.movimiento * delta;


            if (
                objeto.x < 0 ||
                objeto.x >
                areaJuego.clientWidth - 70
            ) {

                objeto.movimiento *= -1;

            }


            objeto.elemento.style.left =
                objeto.x + "px";

            objeto.elemento.style.top =
                objeto.y + "px";


            if (objetoAtrapado(objeto)) {

                objeto.elemento.remove();

                objetos.splice(i, 1);

                procesarObjeto(objeto);

            }


            else if (
                objeto.y >
                areaJuego.clientHeight + 80
            ) {

                objeto.elemento.remove();

                objetos.splice(i, 1);

            }

        }

    }


    animacion =
        requestAnimationFrame(bucleJuego);
}


// ------------------------------
// DETECTAR ATRAPE
// ------------------------------

function objetoAtrapado(objeto) {

    const rectObjeto =
        objeto.elemento.getBoundingClientRect();

    const rectCesta =
        cesta.getBoundingClientRect();


    return (

        rectObjeto.bottom >=
        rectCesta.top &&

        rectObjeto.left <
        rectCesta.right &&

        rectObjeto.right >
        rectCesta.left &&

        rectObjeto.top <
        rectCesta.bottom

    );

}


// ------------------------------
// PROCESAR OBJETO
// ------------------------------

function procesarObjeto(objeto) {


    if (objeto.tipo === "bueno") {

        puntos += 10;

        mostrarPuntos(
            "+10",
            objeto.x,
            objeto.y
        );

    }


    if (objeto.tipo === "podrido") {

        puntos =
            Math.max(0, puntos - 15);

        vidas--;


        mostrarPuntos(
            "-15",
            objeto.x,
            objeto.y
        );


        if (vidas <= 0) {

            terminarJuego("vidas");

            return;

        }

    }


    if (objeto.tipo === "bomba") {

        terminarJuego("bomba");

        return;

    }


    actualizarNivel();

    actualizarMarcador();


    // ------------------------------
    // PREMIO PEQUEÑO: 150 PUNTOS
    // ------------------------------

    if (
        puntos >= 150 &&
        !premioPequenoMostrado
    ) {

        premioPequenoMostrado = true;

        pausado = true;

        modalPremioPequeno.classList.remove(
            "oculto"
        );

        return;

    }


    // ------------------------------
    // PREMIO MAYOR: 250 PUNTOS
    // ------------------------------

    if (puntos >= 250) {

        terminarJuego("premio");

    }

}


// ------------------------------
// BOTÓN SEGUIR JUGANDO
// ------------------------------

btnSeguir.addEventListener("click", () => {

    modalPremioPequeno.classList.add(
        "oculto"
    );

    iniciarCuentaRegresiva();

});


// ------------------------------
// CUENTA REGRESIVA
// ------------------------------

function iniciarCuentaRegresiva() {

    if (!jugando) {
        return;
    }

    clearTimeout(temporizadorCuentaRegresiva);

    cuentaRegresiva = true;
    pausado = true;

    // Quitar cupcakes que estaban cayendo
    // para comenzar limpio después del aviso.
    objetos.forEach(objeto => {

        objeto.elemento.remove();

    });

    objetos = [];

    // Reiniciar el intervalo para que no
    // aparezca un cupcake inmediatamente.
    clearInterval(intervaloObjetos);


    const mensaje =
        document.getElementById("mensajeNivel");

    let numero = 3;


    function mostrarCuenta() {

        if (!jugando) {
            return;
        }


        mensaje.classList.remove("oculto");

        mensaje.textContent =
            numero;


        if (numero > 0) {

            numero--;

            temporizadorCuentaRegresiva =
                setTimeout(
                    mostrarCuenta,
                    800
                );

        }

        else {

            mensaje.textContent =
                "¡A JUGAR!";


            temporizadorCuentaRegresiva =
                setTimeout(() => {

                    mensaje.classList.add(
                        "oculto"
                    );

                    cuentaRegresiva = false;
                    pausado = false;

                    ultimoTiempo =
                        performance.now();


                    // Volver a iniciar la caída
                    // respetando el nivel actual.
                    intervaloObjetos =
                        setInterval(
                            crearCupcake,
                            Math.max(
                                300,
                                720 - nivel * 55
                            )
                        );

                }, 800);

        }

    }


    mostrarCuenta();

}


// ------------------------------
// BOTÓN QUEDARSE CON EL PREMIO
// ------------------------------

btnQuedarse.addEventListener("click", () => {

    modalPremioPequeno.classList.add(
        "oculto"
    );

    pausado = false;

    terminarJuego("premioPequeno");

});


// ------------------------------
// CAMBIAR NIVEL
// ------------------------------

function actualizarNivel() {

    let nuevoNivel =
        Math.min(
            8,
            Math.floor(puntos / 25) + 1
        );


    if (nuevoNivel !== nivel) {

        nivel = nuevoNivel;


        clearInterval(intervaloObjetos);


        intervaloObjetos =
            setInterval(
                crearCupcake,
                Math.max(
                    300,
                    720 - nivel * 55
                )
            );


        mostrarNivel();

    }

}


// ------------------------------
// MENSAJE DE NIVEL
// ------------------------------

function mostrarNivel() {

    const mensaje =
        document.getElementById(
            "mensajeNivel"
        );


    clearTimeout(temporizadorMensaje);


    mensaje.textContent =
        "⚡ NIVEL " + nivel;


    mensaje.classList.remove(
        "oculto"
    );


    temporizadorMensaje =
        setTimeout(() => {

            mensaje.classList.add(
                "oculto"
            );

        }, 1400);

}


// ------------------------------
// MOSTRAR +10 / -15
// ------------------------------

function mostrarPuntos(texto, x, y) {

    const mensaje =
        document.createElement("div");


    mensaje.textContent = texto;


    mensaje.style.position =
        "absolute";

    mensaje.style.left =
        x + "px";

    mensaje.style.top =
        y + "px";

    mensaje.style.zIndex = "100";

    mensaje.style.color =
        "#a34f70";

    mensaje.style.fontFamily =
        "Baloo 2";

    mensaje.style.fontSize =
        "30px";

    mensaje.style.fontWeight =
        "800";

    mensaje.style.pointerEvents =
        "none";


    areaJuego.appendChild(
        mensaje
    );


    mensaje.animate(

        [
            {
                transform:
                    "translateY(0)",
                opacity: 1
            },

            {
                transform:
                    "translateY(-45px)",
                opacity: 0
            }

        ],

        {
            duration: 700
        }

    );


    setTimeout(() => {

        mensaje.remove();

    }, 700);

}


// ------------------------------
// CESTA
// ------------------------------

function colocarCesta() {

    const ancho =
        areaJuego.clientWidth;


    cesta.style.left =
        posicionCesta *
        ancho +
        "px";

}


function moverCesta(direccion) {

    if (!jugando || pausado || cuentaRegresiva) {
        return;
    }


    posicionCesta +=
        direccion;


    posicionCesta =
        Math.max(
            0.07,
            Math.min(
                0.93,
                posicionCesta
            )
        );


    colocarCesta();

}


// ------------------------------
// TECLADO
// ------------------------------

document.addEventListener(
    "keydown",
    evento => {

        if (
            evento.key === "ArrowLeft" ||
            evento.key.toLowerCase() === "a"
        ) {

            moverCesta(-0.07);

        }


        if (
            evento.key === "ArrowRight" ||
            evento.key.toLowerCase() === "d"
        ) {

            moverCesta(0.07);

        }


        if (evento.code === "Space") {

            pausarJuego();

        }

    }
);


// ------------------------------
// BOTONES MÓVILES
// ------------------------------

document
    .getElementById("izquierda")
    .addEventListener(
        "pointerdown",
        evento => {

            evento.preventDefault();

            moverCesta(-0.09);

        }
    );


document
    .getElementById("derecha")
    .addEventListener(
        "pointerdown",
        evento => {

            evento.preventDefault();

            moverCesta(0.09);

        }
    );


// ------------------------------
// MOVER CON EL DEDO
// ------------------------------

let arrastrando = false;


areaJuego.addEventListener(
    "pointerdown",
    evento => {

        if (!jugando || pausado || cuentaRegresiva) {
            return;
        }

        evento.preventDefault();

        arrastrando = true;

        if (areaJuego.setPointerCapture) {
            areaJuego.setPointerCapture(evento.pointerId);
        }

        moverCestaAlPunto(
            evento.clientX
        );

    }
);


areaJuego.addEventListener(
    "pointermove",
    evento => {

        if (!arrastrando) {
            return;
        }

        evento.preventDefault();

        moverCestaAlPunto(
            evento.clientX
        );

    }
);


areaJuego.addEventListener(
    "pointerup",
    evento => {

        arrastrando = false;

        if (
            areaJuego.releasePointerCapture &&
            areaJuego.hasPointerCapture(evento.pointerId)
        ) {
            areaJuego.releasePointerCapture(
                evento.pointerId
            );
        }

    }
);


areaJuego.addEventListener(
    "pointercancel",
    () => {

        arrastrando = false;

    }
);


window.addEventListener(
    "pointerup",
    () => {

        arrastrando = false;

    }
);


function moverCestaAlPunto(x) {

    const rect =
        areaJuego.getBoundingClientRect();


    posicionCesta =
        (x - rect.left) /
        rect.width;


    posicionCesta =
        Math.max(
            0.07,
            Math.min(
                0.93,
                posicionCesta
            )
        );


    colocarCesta();

}


// ------------------------------
// TIEMPO
// ------------------------------

function contarTiempo() {

    if (!jugando || pausado || cuentaRegresiva) {
        return;
    }


    tiempo--;

    actualizarMarcador();


    if (tiempo <= 0) {

        terminarJuego("tiempo");

    }

}


// ------------------------------
// PAUSA
// ------------------------------

document
    .getElementById("pausa")
    .addEventListener(
        "click",
        pausarJuego
    );


document
    .getElementById("continuar")
    .addEventListener(
        "click",
        pausarJuego
    );


function pausarJuego() {

    if (!jugando || cuentaRegresiva) {
        return;
    }


    pausado = !pausado;


    if (pausado) {

        modalPausa.classList.remove(
            "oculto"
        );

    }

    else {

        modalPausa.classList.add(
            "oculto"
        );

        ultimoTiempo = performance.now();

    }

}


// ------------------------------
// REINICIAR
// ------------------------------

document
    .getElementById("reiniciar")
    .addEventListener(
        "click",
        iniciarJuego
    );


// ------------------------------
// TERMINAR JUEGO
// ------------------------------

function terminarJuego(motivo) {

    if (!jugando) {
        return;
    }


    jugando = false;

    cuentaRegresiva = false;

    clearTimeout(temporizadorCuentaRegresiva);
    clearTimeout(temporizadorMensaje);

    clearInterval(intervaloObjetos);
    clearInterval(intervaloTiempo);

    cancelAnimationFrame(animacion);


    objetos.forEach(objeto => {

        objeto.elemento.remove();

    });


    objetos = [];


    const icono =
        document.getElementById(
            "iconoResultado"
        );

    const titulo =
        document.getElementById(
            "tituloResultado"
        );

    const texto =
        document.getElementById(
            "textoResultado"
        );

    const puntuacion =
        document.getElementById(
            "puntuacionFinal"
        );


    puntuacion.textContent =
        puntos;


    if (motivo === "premio") {

        icono.textContent = "🏆";

        titulo.textContent =
            "¡Felicidades, has ganado el premio mayor!";

        texto.textContent =
            "¡Llegaste a los 250 puntos! Has conseguido el premio mayor.";

    }


    else if (motivo === "premioPequeno") {

        icono.textContent = "🎁";

        titulo.textContent =
            "¡Te quedaste con el premio pequeño!";

        texto.textContent =
            "¡Conseguiste 150 puntos y decidiste quedarte con el premio pequeño!";

    }


    else if (motivo === "bomba") {

        icono.textContent = "💥";

        titulo.textContent =
            "Lo siento, perdiste.";

        texto.textContent =
            "La bomba cupcake cayó dentro de la cesta. ¡Ten más cuidado la próxima vez!";

    }


    else if (motivo === "vidas") {

        if (puntos >= 150) {

            icono.textContent = "🎁";

            titulo.textContent =
                "¡Has ganado el segundo premio!";

            texto.textContent =
                "Perdiste todas tus vidas, pero conseguiste 150 puntos o más para ganar el segundo premio.";

        }

        else {

            icono.textContent = "😅";

            titulo.textContent =
                "¡Sigue intentando!";

            texto.textContent =
                "Necesitas conseguir al menos 150 puntos para ganar el segundo premio.";

        }

    }


    else {

        if (puntos >= 150) {

            icono.textContent = "🎁";

            titulo.textContent =
                "¡Has ganado el segundo premio!";

            texto.textContent =
                "Se acabó el tiempo, pero lograste 150 puntos o más para conseguir el segundo premio.";

        }

        else {

            icono.textContent = "⏰";

            titulo.textContent =
                "Se acabó el tiempo";

            texto.textContent =
                "¡Inténtalo nuevamente y trata de llegar a los 150 puntos!";

        }

    }


    modalResultado.classList.remove(
        "oculto"
    );

}


// ------------------------------
// BOTONES FINALES
// ------------------------------

document
    .getElementById("btnReintentar")
    .addEventListener(
        "click",
        iniciarJuego
    );


document
    .getElementById("btnInicio")
    .addEventListener(
        "click",
        () => {

            clearTimeout(temporizadorCuentaRegresiva);

            cuentaRegresiva = false;

            modalResultado.classList.add(
                "oculto"
            );

            modalPremioPequeno.classList.add(
                "oculto"
            );

            juego.classList.add(
                "oculto"
            );

            inicio.classList.remove(
                "oculto"
            );

        }
    );


// ------------------------------
// AJUSTAR AL CAMBIAR TAMAÑO
// ------------------------------

window.addEventListener(
    "resize",
    colocarCesta
);
