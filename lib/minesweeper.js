let gameOver = false;

alertify.defaults.glossary.title = '🤣🤣🤣🤣🤣🤣🤣🤣';
const isGameOver = () => {
  if (gameOver) {
    return true;
  }
  return false;
};

const difficultInput = document.getElementById('difficulty');
let difficulty = difficultInput.value;

const sizeInput = document.getElementById('size');
sizeInput.addEventListener('change', (e) => {
  create();
  console.log(e.currentTarget.value);
});
let size = sizeInput.value;

console.log('SIZE' + size);

const tBody = document.getElementById('minesweeper');

const checkForWin = (locations) => {
  let numberOpened = 0;
  locations.forEach((location) => {
    if (location.td.className === 'opened' || location.td.className.match(/neigh/)) {
      numberOpened += 1;
      if (numberOpened === 100 - difficulty) {
        alertify.alert('You won! 🎉🌈✨', create);
      }
    }
  });
  console.log('Number opened: ' + numberOpened);
};

const verticalCheck = (i, curr, locations) => {
  for (let j = i; j < locations.length; j += 10) {
    const next = locations[j];
    if (!next.bomb && !next.nextToHowManyBombs && next.column === curr.column) {
      next.td.className = 'opened';
    } else {
      if (!next.bomb) {
        next.td.className = `mine-neighbour-${next.nextToHowManyBombs}`;
      }
      break;
    }
  }
  for (let j = i; j >= 0; j -= 10) {
    const next = locations[j];
    console.log(next);
    if (!next.bomb && !next.nextToHowManyBombs && next.column === curr.column) {
      next.td.className = 'opened';
    } else {
      if (!next.bomb) {
        next.td.className = `mine-neighbour-${next.nextToHowManyBombs}`;
      }
      break;
    }
  }
};

const openNeighbours = (clicked, locations, index) => {
  for (let i = index; i < locations.length; i += 1) {
    let curr = locations[i];
    if (!curr.bomb && !curr.nextToHowManyBombs && curr.row === clicked.row) {
      curr.td.className = 'opened';
      verticalCheck(i, curr, locations);
    } else if (!curr.bomb && !curr.nextToHowManyBombs) {
      curr.td.className = 'opened';
    } else {
      if (!curr.bomb) {
        curr.td.className = `mine-neighbour-${curr.nextToHowManyBombs}`;
      }
      break;
    }
  }
  for (let i = index; i >= 0; i -= 1) {
    let curr = locations[i];
    if (!curr.bomb && !curr.nextToHowManyBombs && curr.row === clicked.row) {
      curr.td.className = 'opened';
      verticalCheck(i, curr, locations);
    } else if (!curr.bomb && !curr.nextToHowManyBombs) {
      curr.td.className = 'opened';
    } else {
      if (!curr.bomb) {
        curr.td.className = `mine-neighbour-${curr.nextToHowManyBombs}`;
      }
      break;
    }
  }
  checkForWin(locations);
};

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
        nextToHowManyBombs: 0,
        td: td
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
              td.className = 'mine';
              setGameOver();
            } else if (clicked.nextToHowManyBombs) {
              td.className = `mine-neighbour-${clicked.nextToHowManyBombs}`;
              checkForWin(locations);
            } else {
              td.className = 'opened';
              openNeighbours(clicked, locations, k);
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

document.getElementById('reset').addEventListener('click', () => {
  create();
  if (gameOver) {
    setGameOver();
  }
});

const setGameOver = () => {
  if (gameOver) {
    gameOver = false;
  } else {
    gameOver = true;
    alertify.alert('You lose dummy!!!! 🤣', () => {
      create();
      if (gameOver) {
        setGameOver();
      }
    });
  }
};
