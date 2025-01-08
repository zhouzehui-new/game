class Game2048 {
    constructor() {
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.init();
    }

    init() {
        // 清空网格
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        // 添加两个初始数字
        this.addNewNumber();
        this.addNewNumber();
        this.updateView();
    }

    addNewNumber() {
        const emptyCells = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) {
                    emptyCells.push({x: i, y: j});
                }
            }
        }
        if (emptyCells.length > 0) {
            const {x, y} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[x][y] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    updateView() {
        const gridElement = document.querySelector('.grid');
        gridElement.innerHTML = '';
        
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                const value = this.grid[i][j];
                if (value > 0) {
                    cell.textContent = value;
                    cell.setAttribute('data-value', value);
                }
                gridElement.appendChild(cell);
            }
        }
        
        document.getElementById('score').textContent = this.score;
    }

    // 移动逻辑
    move(direction) {
        let moved = false;
        const oldGrid = JSON.stringify(this.grid);

        switch(direction) {
            case 'ArrowUp': moved = this.moveUp(); break;
            case 'ArrowDown': moved = this.moveDown(); break;
            case 'ArrowLeft': moved = this.moveLeft(); break;
            case 'ArrowRight': moved = this.moveRight(); break;
        }

        if (moved) {
            this.addNewNumber();
            this.updateView();
        }
    }

    // 实现具体的移动方法...
    moveLeft() {
        let moved = false;
        for (let i = 0; i < 4; i++) {
            let row = this.grid[i].filter(x => x !== 0);
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j + 1, 1);
                }
            }
            const newRow = row.concat(Array(4 - row.length).fill(0));
            if (JSON.stringify(this.grid[i]) !== JSON.stringify(newRow)) {
                moved = true;
            }
            this.grid[i] = newRow;
        }
        return moved;
    }

    moveRight() {
        let moved = false;
        for (let i = 0; i < 4; i++) {
            let row = this.grid[i].filter(x => x !== 0);
            for (let j = row.length - 1; j > 0; j--) {
                if (row[j] === row[j - 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j - 1, 1);
                }
            }
            const newRow = Array(4 - row.length).fill(0).concat(row);
            if (JSON.stringify(this.grid[i]) !== JSON.stringify(newRow)) {
                moved = true;
            }
            this.grid[i] = newRow;
        }
        return moved;
    }

    moveUp() {
        let moved = false;
        for (let j = 0; j < 4; j++) {
            let column = [];
            for (let i = 0; i < 4; i++) {
                column.push(this.grid[i][j]);
            }
            column = column.filter(x => x !== 0);
            for (let i = 0; i < column.length - 1; i++) {
                if (column[i] === column[i + 1]) {
                    column[i] *= 2;
                    this.score += column[i];
                    column.splice(i + 1, 1);
                }
            }
            column = column.concat(Array(4 - column.length).fill(0));
            if (column.some((val, i) => val !== this.grid[i][j])) {
                moved = true;
            }
            for (let i = 0; i < 4; i++) {
                this.grid[i][j] = column[i];
            }
        }
        return moved;
    }

    moveDown() {
        let moved = false;
        for (let j = 0; j < 4; j++) {
            let column = [];
            for (let i = 0; i < 4; i++) {
                column.push(this.grid[i][j]);
            }
            column = column.filter(x => x !== 0);
            for (let i = column.length - 1; i > 0; i--) {
                if (column[i] === column[i - 1]) {
                    column[i] *= 2;
                    this.score += column[i];
                    column.splice(i - 1, 1);
                }
            }
            column = Array(4 - column.length).fill(0).concat(column);
            if (column.some((val, i) => val !== this.grid[i][j])) {
                moved = true;
            }
            for (let i = 0; i < 4; i++) {
                this.grid[i][j] = column[i];
            }
        }
        return moved;
    }

    // 添加游戏状态检查方法
    isGameOver() {
        // 检查是否有空格
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) return false;
            }
        }
        
        // 检查是否有相邻的相同数字
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (j < 3 && this.grid[i][j] === this.grid[i][j + 1]) return false;
                if (i < 3 && this.grid[i][j] === this.grid[i + 1][j]) return false;
            }
        }
        return true;
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game2048();

    // 键盘控制
    document.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
            game.move(e.key);
            
            // 检查游戏是否结束
            if (game.isGameOver()) {
                alert('游戏结束！最终得分：' + game.score);
            }
        }
    });

    // 新游戏按钮
    document.getElementById('new-game').addEventListener('click', () => {
        game.init();
    });
});
