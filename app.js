const grid = document.querySelector('.grid')
const scoreDIsplay = document.querySelector('#score')
const blockWidth = 100
const blockHeight = 20
const boardWidth = 560
const boardHeight = 300
const ballDiameter = 20

let timerId
let xDirection = -2
let yDirection = 2 // se crean las variables para las direcciones de la bola
let score = 0


const userStart = [230, 10] // se crea posicion inicial para el rectangulo del jugador
const ballStart = [270, 45]


let currentPosition = userStart 
let ballCurrentPosition = ballStart

// crear bloques // volver a ver este paso

class Block { // utiliza una clase para crear bloques distintos
    constructor(xAxis, yAxis) { // va a ser el bottom left de los bloques
        this.bottomLeft = [xAxis, yAxis] /// todo esto es para decifrar los 4 puntos de cada bloque y donde estan en la grilla
        this.bottomRight = [xAxis + blockWidth, yAxis] // digamos que el blockWidth nos indica que es el lado derecho, porque al eje X le suma el blockWidth que son 100px, lo mismo para la esquina vertical
        this.topLeft = [xAxis, yAxis + blockHeight]
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
    }
} // estos son los valores que se le van a pasar a los bloques 


const blocks = [ // estos son xAxis y yAxis, cada bloque con una posicion diferente, utilizando la clase, crea nuevos bloques con esos parametros (programacion orientada a objetos), estos se agregaron manualmente
    new Block(10, 270), // NO son las medidas de cada bloque, esas ya estan definidas en css, estas son las POSICIONES
    new Block(120, 270),
    new Block(230, 270),
    new Block(340, 270),
    new Block(450, 270),
    new Block(10, 240),
    new Block(120, 240),
    new Block(230, 240),
    new Block(340, 240),
    new Block(450, 240),
    new Block(10, 210),
    new Block(120, 210),
    new Block(230, 210),
    new Block(340, 210),
    new Block(450, 210),

]


// dibujar bloques 

function addBlocks() { // toma los bloques creados en el array de blocks y los dibuja, les pone la clase, y le agrega los ejes que son para ubicarlos

    for (let i = 0; i < blocks.length; i++) {
        const block = document.createElement('div')
        block.classList.add("block")
        block.style.left = blocks[i].bottomLeft[0] + 'px' // los 10 px, para cada uno le va a ir dando un posicionamiento diferente a los otros. al ir recorriendo el array
        block.style.bottom = blocks[i].bottomLeft[1] + 'px' // los 270 px
        grid.appendChild(block) // seleciona la grid creada y con appendChild le mete el bloque adentro

    }
}
addBlocks();


// add user 

const user = document.createElement('div');
user.classList.add('user')
drawUser() // llama a la funcion 
grid.appendChild(user)

// draw user

function drawUser() {

    user.style.left = currentPosition[0] + 'px' // toma del array los indices
    user.style.bottom = currentPosition[1] + 'px'
}

// draw ball

function drawBall() { // en realidad ya esta dibujada, solamente la posiciona

    ball.style.left = ballCurrentPosition[0] + 'px' // no olvidar agregar los pixeles para que esos numeros sean tomados en cuenta
    ball.style.bottom = ballCurrentPosition[1] + 'px'
}

// move user // utiliza keys

function moveUser(e) { // crea la funcion y pasa un evento

    switch (e.key) { // el .key dice que para ese evento que se disparo identifique la tecla del teclado que lo disparo
        case 'ArrowLeft': // si lo que yo toco en el teclado tiene el valor de "ArrowLeft". por defecto ese es el nombre que se le asigna a la flechita
            if (currentPosition[0] > 0) { // para que no pueda salir de la pantalla. Mientras la posicion sea mas grande que 0 (con respecto al contenedor) se va a poder mover, obviamente se refiere al eje X

                currentPosition[0] -= 35
                drawUser() // le re-asigna el valor del estilo
            }
            break;
        case 'ArrowRight':
            if (currentPosition[0] < boardWidth) {

                currentPosition[0] += 35
                drawUser()
            }
            break;
    }
}

document.addEventListener('keydown', moveUser) // agrega al document el evento que va a detectar si se baja la flecha, y llama a moveUser


// add ball

const ball = document.createElement('div')
ball.classList.add('ball')
drawBall()
grid.appendChild(ball)

// move the ball

function moveBall() {
    ballCurrentPosition[0] += xDirection // esto va a mover la bola en el tiempo
    ballCurrentPosition[1] += yDirection
    drawBall() // llama a la funcion de posicionar la bola
    checkForCollisions() // cada 10 milisegundos checkea si hay colisiones 
}

timerId = setInterval(moveBall, 27)

// check for collisions 

function checkForCollisions() { // si la posicion del eje X es mayor al diametro del tablero - el diametro de la pelota

    // check for block collisions

    for (let i = 0; i < blocks.length; i++) { // tiene que checkear si la pelota esta entre el X de la izquierda y el X de la derecha y la altura de ese bloque
        if (
            (ballCurrentPosition[0] > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0] &&
                ((ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].topLeft[1])) // si la posicion X de la pelota es mayor el primer parametro del bottomLeft (el de la X, que va de 10, 120, 230..) y a la vez menor que el de bottomRight

        ) {
            const allBlocks = Array.from(document.querySelectorAll('.block')) // Array.from hace de algo un array
            allBlocks[i].classList.remove('block') // si toca al bloque le quita la clase, lo cual lo hace desaparecer, pero no lo quita del array
            blocks.splice(i, 1) // remueve el que sea, el primer parametro es el indice, el segundo la cantidad a remover incluyendo ese indice
            changeDirection() // ademas de remover, tiene que cambiar la direccion
            score++
            scoreDIsplay.innerHTML = score

            // check for win

            if (blocks.length === 0) {
                scoreDIsplay.innerHTML = 'YOU WIN!!'
                clearInterval(timerId)
                document.removeEventListener('keydown', moveUser)
            }
        }
    }

    // check for wall collisions

    if (
        ballCurrentPosition[0] >= (boardWidth - ballDiameter) ||
        ballCurrentPosition[1] >= (boardHeight - ballDiameter) ||
        ballCurrentPosition[0] <= 0) { // no deja que se vaya, pero tambien, llama a la funcion para cambiar la direccion de la bola
        changeDirection()
    }


    // check for user collisions 

    if (
        (ballCurrentPosition[0] > currentPosition[0] && ballCurrentPosition[0] < currentPosition[0] + blockWidth) &&
        (ballCurrentPosition[1] > currentPosition[1] && ballCurrentPosition[1] < currentPosition[1] + blockHeight) // basicamente esto checkea si ocupan el mismo espacio
    ) // esto checkea si la pelota esta en el medio entre los 2 lados del bloque del usuario

    {
        changeDirection()
    }


    //check for game over

    if (ballCurrentPosition[1] <= 0) {
        clearInterval(timerId)
        scoreDIsplay.innerHTML = 'you lose'
        document.removeEventListener('keydown', moveUser)

    }

}

function changeDirection() { // esta funcion se encarga de cambiar la direccion

    if (xDirection === 2 && yDirection === 2) {
        yDirection = -2
        return
    }

    if (xDirection === 2 && yDirection === -2) {
        xDirection = -2
        return
    }

    if (xDirection === -2 && yDirection === -2) {
        yDirection = 2
        return
    }

    if (xDirection === -2 && yDirection === 2) {
        xDirection = 2
        return
    }

}

