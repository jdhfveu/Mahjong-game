const config = {
  tileTypes: ['bamboo', 'circle', 'pinyin'],
  tileNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  specialTiles: ['chrysanthemum', 'fall', 'lotus', 'orchid', 'peony', 'spring', 'summer', 'winter'],
  layers: 3, // Количество слоев
  cols: 10,  // Колонок в каждом слое
  rows: 6    // Рядов в каждом слое
};

let tiles = [];
let selectedTile = null;
let score = 0;
let firstClick = true;

// Проверка доступности изображений
function checkAssets() {
  const testImage = new Image();
  testImage.src = 'assets/bamboo1.png';
  testImage.onload = () => console.log("Изображения загружаются корректно");
  testImage.onerror = () => console.error("Ошибка загрузки изображений! Проверьте папку assets");
}

// Создание набора плиток
function createTiles() {
  let tiles = [];
  
  // Числовые плитки (по 4 копии каждого типа)
  config.tileTypes.forEach(type => {
    config.tileNumbers.forEach(num => {
      for (let i = 0; i < 4; i++) {
        tiles.push({
          type,
          num,
          id: `${type}${num}_${i}`,
          image: `${type}${num}.png`,
          layer: 0,
          matched: false
        });
      }
    });
  });

  // Специальные плитки (по 4 копии каждой)
  config.specialTiles.forEach(tile => {
    for (let i = 0; i < 4; i++) {
      tiles.push({
        type: 'special',
        name: tile,
        id: `${tile}_${i}`,
        image: `${tile}.png`,
        layer: 0,
        matched: false
      });
    }
  });

  return tiles;
}

// Генерация игрового поля
function generateLayout() {
  const layout = [];
  const allTiles = createTiles();
  
  // Создаем 3D-массив для слоев
  for (let layer = 0; layer < config.layers; layer++) {
    layout[layer] = [];
    for (let row = 0; row < config.rows; row++) {
      layout[layer][row] = [];
      for (let col = 0; col < config.cols; col++) {
        if (allTiles.length === 0) break;
        
        const randomIndex = Math.floor(Math.random() * allTiles.length);
        const tile = allTiles.splice(randomIndex, 1)[0];
        if (tile) {
          tile.layer = layer;
          tile.row = row;
          tile.col = col;
          layout[layer][row][col] = tile;
        }
      }
    }
  }
  
  return layout.flat(2).filter(tile => tile);
}

// Отрисовка плиток на поле
function renderTiles() {
    const board = document.getElementById('game-board');
    board.innerHTML = '';

    // Сортируем плитки по слоям
    const sortedTiles = [...tiles].sort((a, b) => a.layer - b.layer);

    sortedTiles.forEach(tile => {
        if (tile.matched) return;
        
        const tileElement = document.createElement('div');
        tileElement.className = 'tile';
        tileElement.dataset.id = tile.id;
        
        // Позиция с учетом слоя
        const offsetX = tile.layer * 15;
        const offsetY = tile.layer * 10;
        tileElement.style.left = `${(tile.col * 55 + 20 + offsetX)}px`;
        tileElement.style.top = `${(tile.row * 75 + 20 + offsetY)}px`;
        tileElement.style.zIndex = tile.layer;
        
        // Проверка доступности плитки
        const isFree = isTileFree(tile);
        
        if (isFree) {
            tileElement.classList.add('free');
            tileElement.addEventListener('click', () => handleTileClick(tile.id));
        } else {
            tileElement.classList.add('blocked');
        }
        
        if (selectedTile === tile.id) {
            tileElement.classList.add('selected');
        }
        
        tileElement.style.backgroundImage = `url(assets/${tile.image})`;
        board.appendChild(tileElement);
    });
}

// Проверка, свободна ли плитка
function isTileFree(tile) {
  // Плитка свободна, если над ней нет других плиток
  for (let otherTile of tiles) {
    if (!otherTile.matched && 
        otherTile.layer > tile.layer && 
        Math.abs(otherTile.col - tile.col) <= 1 && 
        Math.abs(otherTile.row - tile.row) <= 1) {
      return false;
    }
  }
  return true;
}

// ... (предыдущий код остается без изменений до функции handleTileClick)

function isTileFree(tile) {
    // Проверяем, что фишка не скрыта под другими
    for (let otherTile of tiles) {
        // Игнорируем уже совпавшие фишки
        if (otherTile.matched) continue;
        
        // Проверяем только фишки из верхних слоев
        if (otherTile.layer <= tile.layer) continue;
        
        // Координаты проверяемой фишки
        const tileLeft = tile.col;
        const tileRight = tile.col + 1;
        const tileTop = tile.row;
        const tileBottom = tile.row + 1;
        
        // Координаты фишки сверху
        const otherLeft = otherTile.col;
        const otherRight = otherTile.col + 1;
        const otherTop = otherTile.row;
        const otherBottom = otherTile.row + 1;
        
        // Проверяем перекрытие
        const xOverlap = otherLeft < tileRight && otherRight > tileLeft;
        const yOverlap = otherTop < tileBottom && otherBottom > tileTop;
        
        // Если есть перекрытие по обеим осям - фишка заблокирована
        if (xOverlap && yOverlap) {
            return false;
        }
    }
    
    // Проверяем, что хотя бы одна сторона свободна
    const directions = [
        {dx: -1, dy: 0},  // слева
        {dx: 1, dy: 0},   // справа
        {dx: 0, dy: -1},  // сверху
        {dx: 0, dy: 1}    // снизу
    ];
    
    let hasFreeSide = false;
    
    for (const dir of directions) {
        const checkCol = tile.col + dir.dx;
        const checkRow = tile.row + dir.dy;
        
        // Проверяем, находится ли проверяемая позиция в пределах поля
        if (checkCol >= 0 && checkCol < config.cols && 
            checkRow >= 0 && checkRow < config.rows) {
            
            // Проверяем, есть ли в этом месте плитка того же слоя
            const neighbor = tiles.find(t => 
                t.layer === tile.layer && 
                t.col === checkCol && 
                t.row === checkRow && 
                !t.matched
            );
            
            if (!neighbor) {
                hasFreeSide = true;
                break;
            }
        } else {
            // Если позиция за пределами поля - считаем сторону свободной
            hasFreeSide = true;
            break;
        }
    }
    
    return hasFreeSide;
}

// ... (остальной код остается без изменений)

// Проверка совпадения плиток
function tilesMatch(tile1, tile2) {
  if (tile1.type === 'special' && tile2.type === 'special') {
    return tile1.name === tile2.name;
  }
  return tile1.type === tile2.type && tile1.num === tile2.num;
}

// Инициализация игры
function initGame() {
  checkAssets();
  tiles = generateLayout();
  renderTiles();
  
  // Кнопка перезапуска
  document.getElementById('restart').addEventListener('click', () => {
    tiles = [];
    selectedTile = null;
    score = 0;
    document.querySelector('#score span').textContent = '0';
    firstClick = true;
    initGame();
  });
}

function handleTileClick(tileId) {
  const tile = tiles.find(t => t.id === tileId);
  if (!isTileFree(tile)) return;  // дополнительная защита
  // ... остальная логика выбора и проверки совпадения
}


// Запуск игры при загрузке страницы
window.onload = initGame;