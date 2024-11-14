let currentPlayer = Math.random() < 0.5 ? 'nought' : 'cross';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let dragImage = new Image();
let noughtScore = parseInt(sessionStorage.getItem('noughtScore')) || 0;
let crossScore = parseInt(sessionStorage.getItem('crossScore')) || 0;

const nought = document.getElementById('nought');
const cross = document.getElementById('cross');
const cells = document.querySelectorAll('.cell');
const remark = document.getElementById('remark');
const restartButton = document.getElementById('restart');
const scoreElement = document.querySelector('.score h2');

// Initializes the score
updateScoreDisplay();

// function that changes the current player
function highlightCurrentPlayer() {
    if (currentPlayer === 'nought') {
        nought.style.border = '2px solid red';
        cross.style.border = 'none';
        nought.draggable = true;
        cross.draggable = false;
        dragImage.src = 'O-green.png';
        dataTransfer.setDragImage(dragImage, dragImage.width / 2, dragImage.height / 2);
    } else {
        cross.style.border = '2px solid red';
        nought.style.border = 'none';
        cross.draggable = true;
        nought.draggable = false;
        dragImage.src = 'X-red.png';
        dataTransfer.setDragImage(dragImage, dragImage.width / 2, dragImage.height / 2);
    }
}

// function that handles when a dragging begins
function handleDragStart(e) {
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', e.target.id);
    
    // switches the image based on the player
    if (e.target.id === 'nought') {
        dragImage.src = 'O-green.png';
    } else if (e.target.id === 'cross') {
        dragImage.src = 'X-red.png';
    }
    e.dataTransfer.setDragImage(dragImage, dragImage.width / 2, dragImage.height / 2);
}

function handleDragOver(e) {
    e.preventDefault();
}

// function that handles when a dragging ends
function handleDrop(e) {
    e.preventDefault();
    if (!gameActive) 
        return;

    const cellId = e.target.id;
    const cellIndex = parseInt(cellId.replace('cell', ''));
    
    if (gameBoard[cellIndex] !== '') 
        return;

    const draggedPieceId = e.dataTransfer.getData('text');
    if (draggedPieceId !== currentPlayer) 
        return;

    const imgElement = document.createElement('img');
    imgElement.src = `${currentPlayer}.png`;
    imgElement.alt = currentPlayer === 'nought' ? 'O' : 'X';
    imgElement.style.width = '100%';
    imgElement.style.height = '100%';
    e.target.appendChild(imgElement);

    gameBoard[cellIndex] = currentPlayer;
    checkWinner();
    currentPlayer = currentPlayer === 'nought' ? 'cross' : 'nought';
    highlightCurrentPlayer();
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (let pattern of winPatterns) {
        if (gameBoard[pattern[0]] &&
            gameBoard[pattern[0]] === gameBoard[pattern[1]] &&
            gameBoard[pattern[0]] === gameBoard[pattern[2]]) {
            gameActive = false;
            remark.textContent = `${currentPlayer.toUpperCase()} wins!`;
            remark.style.display = 'block';
            restartButton.style.display = 'block';

            // Update the scoreboard
            if (currentPlayer === 'nought') {
                noughtScore++;
                sessionStorage.setItem('noughtScore', noughtScore);
            } else {
                crossScore++;
                sessionStorage.setItem('crossScore', crossScore);
            }
            updateScoreDisplay();
            return;
        }
    }

    if (!gameBoard.includes('')) {
        gameActive = false;
        remark.textContent = "It's a tie!";
        remark.style.display = 'block';
        restartButton.style.display = 'block';
    }
}

// function that updates the scoreboard with the current score
function updateScoreDisplay() {
    scoreElement.innerHTML = `Score - 
        <span class="big">O</span>: ${noughtScore} 
        <span class="big">X</span>: ${crossScore}`;
}

// function that handles when the restart button is clicked
function restartGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = Math.random() < 0.5 ? 'nought' : 'cross';
    cells.forEach(cell => cell.innerHTML = '');
    remark.style.display = 'none';
    restartButton.style.display = 'none';
    highlightCurrentPlayer();
}

// adds all of the event listeners to the objects
nought.addEventListener('dragstart', handleDragStart);
cross.addEventListener('dragstart', handleDragStart);
cells.forEach(cell => {
    cell.addEventListener('dragover', handleDragOver);
    cell.addEventListener('drop', handleDrop);
});
restartButton.addEventListener('click', restartGame);

highlightCurrentPlayer();