const cells = document.querySelectorAll('.cell');
const restartButton = document.getElementById('restart');
const twoPlayerModeButton = document.getElementById('twoPlayerMode');
const aiModeButton = document.getElementById('aiMode');
let isPlayerTurn = true;
let board = Array(9).fill(null);
let aiMode = false;
const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]             
];

cells.forEach(cell => {
    cell.addEventListener('click', handleClick);
});

restartButton.addEventListener('click', restartGame);
twoPlayerModeButton.addEventListener('click', () => startGame(false));
aiModeButton.addEventListener('click', () => startGame(true));

function handleClick(e) {
    const index = e.target.dataset.index;

    if (board[index] || checkWinner(board)) return;

    board[index] = isPlayerTurn ? 'X' : 'O';
    e.target.textContent = board[index];

    if (checkWinner(board)) {
        setTimeout(() => alert(`${isPlayerTurn ? 'Player 1' : (aiMode ? 'AI' : 'Player 2')} wins!`), 10);
    } else if (board.every(cell => cell)) {
        setTimeout(() => alert('Draw!'), 10);
    }

    isPlayerTurn = !isPlayerTurn;

    if (aiMode && !isPlayerTurn) {
        setTimeout(aiMove, 500);
    }
}

function aiMove() {
    const bestMove = getBestMove(board);
    board[bestMove] = 'O';
    cells[bestMove].textContent = 'O';

    if (checkWinner(board)) {
        setTimeout(() => alert('AI wins!'), 10);
    } else if (board.every(cell => cell)) {
        setTimeout(() => alert('Draw!'), 10);
    }

    isPlayerTurn = true;
}

function getBestMove(board) {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = null;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    let winner = checkWinner(board);
    if (winner) {
        return winner === 'X' ? -10 : 10;
    } else if (board.every(cell => cell)) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner(board) {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

function startGame(ai) {
    aiMode = ai;
    board.fill(null);
    cells.forEach(cell => cell.textContent = '');
    document.getElementById('board').classList.remove('hidden');
    restartButton.classList.remove('hidden');
    isPlayerTurn = true;
}

function restartGame() {
    board.fill(null);
    cells.forEach(cell => cell.textContent = '');
    isPlayerTurn = true;
}