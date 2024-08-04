const cells = document.querySelectorAll('.cell');
const restartButton = document.getElementById('restart');
const modalRestartButton = document.getElementById('modalRestart');
const messageElement = document.getElementById('modalMessage');
const resultIcon = document.getElementById('resultIcon');
let currentPlayer = 'o'; // Player is O, AI is X
let gameState = Array(9).fill(null);

const winningCombinations = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];

function handleCellClick(event) {
	const cell = event.target;
	const index = cell.dataset.index;

	if (gameState[index] || currentPlayer === 'x' || checkWinner()) {
		return;
	}

	gameState[index] = 'o';
	cell.classList.add('o');

	if (checkWinner()) {
		messageElement.textContent = 'O wins!';
		resultIcon.className = 'fas fa-trophy fa-3x'; // Trophy icon for win
		resultIcon.style.color = '#1e90ff'; // Blue for O
		messageElement.style.color = '#1e90ff';
		$('#gameResultModal').modal('show');
	} else if (gameState.every((cell) => cell)) {
		messageElement.textContent = "It's a draw!";
		resultIcon.className = 'fas fa-handshake fa-3x'; // Handshake icon for draw
		resultIcon.style.color = 'green'; // Green for draw
		messageElement.style.color = 'green';
		$('#gameResultModal').modal('show');
	} else {
		currentPlayer = 'x';
		aiMove();
	}
}

function aiMove() {
	const bestMove = findBestMove();
	if (bestMove !== null) {
		gameState[bestMove] = 'x';
		cells[bestMove].classList.add('x');

		if (checkWinner()) {
			messageElement.textContent = 'X wins!';
			resultIcon.className = 'fas fa-trophy fa-3x'; // Trophy icon for win
			resultIcon.style.color = '#ff6b6b'; // Red for X
			messageElement.style.color = '#ff6b6b';
			$('#gameResultModal').modal('show');
		} else if (gameState.every((cell) => cell)) {
			messageElement.textContent = "It's a draw!";
			resultIcon.className = 'fas fa-handshake fa-3x'; // Handshake icon for draw
			resultIcon.style.color = 'green'; // Green for draw
			messageElement.style.color = 'green';
			$('#gameResultModal').modal('show');
		} else {
			currentPlayer = 'o';
		}
	}
}

function findBestMove() {
	let bestScore = -Infinity;
	let move = null;

	for (let i = 0; i < gameState.length; i++) {
		if (!gameState[i]) {
			gameState[i] = 'x';
			const score = minimax(gameState, 0, false);
			gameState[i] = null;

			if (score > bestScore) {
				bestScore = score;
				move = i;
			}
		}
	}

	return move;
}

function minimax(board, depth, isMaximizing) {
	const winner = checkWinner();
	if (winner === 'x') return 10 - depth;
	if (winner === 'o') return depth - 10;
	if (board.every((cell) => cell)) return 0;

	if (isMaximizing) {
		let bestScore = -Infinity;
		for (let i = 0; i < board.length; i++) {
			if (!board[i]) {
				board[i] = 'x';
				const score = minimax(board, depth + 1, false);
				board[i] = null;
				bestScore = Math.max(score, bestScore);
			}
		}
		return bestScore;
	} else {
		let bestScore = Infinity;
		for (let i = 0; i < board.length; i++) {
			if (!board[i]) {
				board[i] = 'o';
				const score = minimax(board, depth + 1, true);
				board[i] = null;
				bestScore = Math.min(score, bestScore);
			}
		}
		return bestScore;
	}
}

function checkWinner() {
	for (const combination of winningCombinations) {
		const [a, b, c] = combination;
		if (
			gameState[a] &&
			gameState[a] === gameState[b] &&
			gameState[a] === gameState[c]
		) {
			return gameState[a];
		}
	}
	return null;
}

function restartGame() {
	gameState.fill(null);
	cells.forEach((cell) => {
		cell.classList.remove('x', 'o');
		cell.textContent = '';
	});
	currentPlayer = 'o'; // Player starts first
	messageElement.textContent = '';
	$('#gameResultModal').modal('hide');
}

cells.forEach((cell) => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);
modalRestartButton.addEventListener('click', restartGame);
