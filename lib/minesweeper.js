document.getElementById('reset').addEventListener('click', () => {
  window.location.reload();
});
const dummy = document.getElementById('dummy');
let gameOver = false;
const setGameOver = () => {
  if (gameOver) {
    gameOver = false;
  } else {
    gameOver = true;
    dummy.style.display = 'block';
  }
};

const isGameOver = () => {
  if (gameOver) {
    return true;
  }
  return false;
};

let difficulty = 20;
const difficultInput = document.getElementById('difficulty');

const tBody = document.getElementById('minesweeper');

const create = () => {
  while (tBody.firstChild) {
    tBody.removeChild(tBody.firstChild);
  }
  const locations = [];
  const bombHolder = [];
  for (let i = 0; i < 10; i += 1) {
    const tr = document.createElement('tr');
    tBody.appendChild(tr);
    for (let j = 0; j < 10; j += 1) {
      const td = document.createElement('td');
      td.className = 'unopened';
      tr.appendChild(td);
      td.id = `${i}${j}`;
      locations.push({
        row: i,
        column: j,
        bomb: false,
        nextToHowManyBombs: 0
      });
      td.addEventListener('click', (e) => {
        const row = parseInt(e.target.id[0], 10);
        const col = parseInt(e.target.id[1], 10);
        let clicked;
        for (let k = 0; k < locations.length; k += 1) {
          if (locations[k].row === row && locations[k].column === col && !isGameOver()) {
            clicked = locations[k];
            console.log(clicked);
            if (clicked.bomb) {
              console.log('YOU clicked a bomb');
              td.className = 'mine';
              setGameOver();
            } else if (clicked.nextToHowManyBombs) {
              td.className = `mine-neighbour-${clicked.nextToHowManyBombs}`;
            } else {
              td.className = 'opened';
            }
          }
        }
      });
      td.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        td.className = 'flagged';
      });
    }
  }

  const locationsCopy = [...locations];
  for (let i = 0; i < difficulty; i += 1) {
    const randomNumber = Math.floor(Math.random() * locationsCopy.length);
    locationsCopy[randomNumber].bomb = true;
    bombHolder.push(locationsCopy.splice(randomNumber, 1)[0]);
  }

  for (let i = 0; i < bombHolder.length; i += 1) {
    for (let j = 0; j < locations.length; j += 1) {
      if (bombHolder[i].row === locations[j].row && bombHolder[i].column === locations[j].column) {
        locations[j].bomb = true;
      }
    }
  }

  for (let i = 0; i < locations.length; i += 1) {
    if (locations[i].bomb) {
      for (let j = 0; j < locations.length; j += 1) {
        if (locations[i].row - locations[j].row >= -1 && locations[i].row - locations[j].row <= 1) {
          if (locations[i].column - locations[j].column >= -1 && locations[i].column - locations[j].column <= 1) {
            if (!locations[j].bomb) {
              locations[j].nextToHowManyBombs += 1;
            }
          }
        }
      }
    }
  }
};

difficultInput.addEventListener('change', (e) => {
  difficulty = e.target.value;
  console.log(difficulty);
  create();
});

create();
