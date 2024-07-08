document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("board");
    const scoreboard = document.getElementById("scoreboard");
    const player1Input = document.getElementById("player1");
    const player2Input = document.getElementById("player2");
    const startButton = document.getElementById("start-button");
    const gridOptions = document.querySelectorAll(".grid-options button");
    const startOptions = document.getElementsByName("start-player");

    let players = ["", ""];
    let currentPlayer = 0;
    let gameActive = false;
    let moves = 0;
    let victories = [0, 0];
    let defeats = [0, 0];
    let gridSize = 3;
    let cells = Array.from({ length: gridSize * gridSize });
    let winningCombinations = generateWinningCombinations(gridSize);

    gridOptions.forEach(button => {
        button.addEventListener("click", () => {
            gridSize = parseInt(button.id.split('x')[0]);
            cells = Array.from({ length: gridSize * gridSize });
            winningCombinations = generateWinningCombinations(gridSize);
            renderBoard();
        });
    });

    function generateWinningCombinations(size) {
        let combinations = [];

        // Rows
        for (let i = 0; i < size; i++) {
            combinations.push([...Array(size).keys()].map(j => i * size + j));
        }

        // Columns
        for (let i = 0; i < size; i++) {
            combinations.push([...Array(size).keys()].map(j => j * size + i));
        }

        // Diagonals
        combinations.push([...Array(size).keys()].map(i => i * (size + 1)));
        combinations.push([...Array(size).keys()].map(i => (i + 1) * (size - 1)));

        return combinations;
    }

    function startGame() {
        const player1Name = player1Input.value.trim();
        const player2Name = player2Input.value.trim();
        
        if (player1Name === "" || player2Name === "") {
            alert("Veuillez entrer un pseudo pour chaque joueur.");
            return;
        }

        players[0] = player1Name;
        players[1] = player2Name;

        startOptions.forEach(option => {
            if (option.checked) {
                currentPlayer = parseInt(option.value);
            }
        });

        moves = 0;
        gameActive = true;
        cells.fill("");
        renderBoard();
        updateScoreboard();
    }

    function renderBoard() {
        board.innerHTML = "";
        board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        cells.forEach((cell, index) => {
            const cellElement = document.createElement("div");
            cellElement.classList.add("cell");
            cellElement.style.width = `${300 / gridSize}px`;
            cellElement.style.height = `${300 / gridSize}px`;
            cellElement.textContent = cells[index];
            cellElement.addEventListener("click", () => handleMove(index));
            board.appendChild(cellElement);
        });
    }

    function handleMove(index) {
        if (!gameActive || cells[index] !== "") return;
        cells[index] = currentPlayer === 0 ? "X" : "O";
        moves++;
        renderBoard();
        if (checkWin(cells, currentPlayer)) {
            handleWin(currentPlayer);
        } else if (moves === gridSize * gridSize) {
            handleDraw();
        } else {
            currentPlayer = 1 - currentPlayer; // Switch player
        }
    }

    function checkWin(board, player) {
        return winningCombinations.some(combination => {
            return combination.every(index => board[index] === (player === 0 ? "X" : "O"));
        });
    }

    function handleWin(player) {
        victories[player]++;
        defeats[1 - player]++;
        gameActive = false;
        updateScoreboard();
        alert(`Félicitations ${players[player]}! Vous avez gagné!`);
        setTimeout(resetBoard, 2000); // Automatically reset the board after 2 seconds
    }

    function handleDraw() {
        gameActive = false;
        updateScoreboard();
        alert("Match nul!");
        setTimeout(resetBoard, 2000); // Automatically reset the board after 2 seconds
    }

    function resetBoard() {
        cells.fill("");
        gameActive = true;
        renderBoard();
    }

    function updateScoreboard() {
        scoreboard.innerHTML = "";
        players.forEach((player, index) => {
            const scoreElement = document.createElement("div");
            scoreElement.classList.add("score");
            scoreElement.textContent = `${player}: Victoires - ${victories[index]}, Défaites - ${defeats[index]}`;
            scoreboard.appendChild(scoreElement);
        });
    }

    startButton.addEventListener("click", startGame);
});