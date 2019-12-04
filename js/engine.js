const WIN = 4; //winning score

let discs = []; //2d array for grid

let playerTurn = 0; //who plays now
let playerDisc = ["835144", "445f83"]; //hex colors
let playerNames = { name1: "player1", name2: "player2" }; //players names

$(document).ready(function() {
  let gridSize = 4; //defualt size of 4
  let winner = -1; //winner either 0,1 or -2 for tie
  startGame(); //call start game panel

  //grid size init
  $('[id*="by"]').click(function(e) {
    gridSize = Number($(this)[0].id.slice(-1)); //getting grid size from clicked button
  });

  //start game init
  $("#start-game-button button").click(function() {
    createGrid(gridSize); //create grid using grid size variable

    //getting names from previous panel
    let parent = $("#setting")[0];
    let inputValue1 = $(`#${parent.id} #user1 input`)[0].value;
    let inputValue2 = $(`#${parent.id} #user2 input`)[0].value;

    playerNames["name1"] =
      String(inputValue1) != "" ? String(inputValue1) : "player1"; //setting default if input is empty
    playerNames["name2"] =
      String(inputValue2) != "" ? String(inputValue2) : "player2"; //setting default if input is empty

    //hide start game and show grid
    $("#start-game").hide();
    $("#grid").slideDown(1000);

    //set user info on screen and reset button
    setUserInfo();
    setResetGame();

    //creating turns sentences and hide the second one
    let turnSentence = $(`#user1-info`);
    let turnSentence1 = $(`#user2-info`);

    //append
    turnSentence.append(`<p> It's your turn now!`);
    turnSentence1.append(`<p> It's your turn now!`);

    //hide the second one so the first player start the game
    turnSentence = $(`#user1-info p:last-child`);
    turnSentence1 = $(`#user2-info p:last-child`);
    turnSentence1.hide();

    //get column and place disc when clicking on column
    $('[id^="container-"]').click(function(e) {
      //get winner number and place disc
      winner = placeDisk(e.currentTarget.id.slice(-1) - 1);

      //alternating turns
      if (playerTurn > 1) playerTurn = 0;
      if (playerTurn == 0) {
        //toggling turns sentences
        turnSentence1.hide(500);
        turnSentence.show(500);
      } else {
        //toggling turns sentences
        turnSentence.hide(500);
        turnSentence1.show(500);
      }
      if (winner != -1) {
        //toggling turns sentences and show finish panel
        turnSentence.hide(500);
        turnSentence1.hide(500);
        finishGame(winner);
      }
    });

    //hovring functionalties
    $('[id^="container-"]').hover(
      function(e) {
        //show blueish color on hovring
        onHoverDisc(e.currentTarget.id.slice(-1) - 1);
      },
      function(e) {
        //remove the blueish color on mouse leaving
        offHoverDisc(e.currentTarget.id.slice(-1) - 1);
      }
    );

    //clicking on reset button to remove all discs from grid
    $("#control button").click(function() {
      //looping to remove all discs' style
      for (const disc of discs) {
        for (const el of disc) {
          el.className = "circle";
        }
      }

      //toggling turns sentences
      turnSentence1.hide(500);
      turnSentence.show(500);

      //reset first player
      playerTurn = 0;
    });
  });
});

startGame = () => {
  //setting html elements before grid appear

  $("#grid").hide(); //hide grid

  //setting the setting panel and input and start game button
  let parent = $("#start-game");
  let setting = $('<div id="setting"></div>');
  let users = $('<div id="users"></div>');
  let input1 = $(
    '<div id="user1"><input id="name1" type="text" placeholder="Enter 1st player name"></div>'
  );
  let input2 = $(
    '<div id="user2"><input id="name2" type="text" placeholder="Enter 2nd player name"></div>'
  );
  let gridSize = $(
    '<div id="grid-size"><span id="grid-size-title">Choose grid size:</span><div id="grid-buttons"><button id="4by4">4x4</buuton><button id="5by5">5x5</buuton><button id="6by6">6x6</buuton></div></div>'
  );
  let startGame = $(
    '<div id="start-game-button"><button>Start Game!</button></div>'
  );

  //appending
  users.append(input1);
  users.append(input2);
  setting.append(users);
  setting.append(gridSize);

  parent.append(setting);
  parent.append(startGame);
};

createGrid = n => {
  //creating the grid
  let grid = document.getElementById("grid");
  for (let c = 0; c < n; c++) {
    //column
    let row = document.createElement("div");
    row.id = `container-${c + 1}`; //giving value to the id
    discs[c] = [];

    for (let r = 0; r < n; r++) {
      //row
      let col = document.createElement("div");
      col.id = `col-${c + 1}-row-${r + 1}`; //id, class and row, col attributes creation
      col.setAttribute("row", r + 1);
      col.setAttribute("col", c + 1);
      col.className = "circle";

      row.appendChild(col); //appending
      discs[c][r] = col; //appending to array
    }
    grid.appendChild(row); //appending
  }
};

setUserInfo = () => {
  //setting user info besides the boards including name and circle color
  let player1 = $("<div id=player-name-color></div>"); //setting player1 div
  let player2 = $("<div id=player-name-color></div>"); //setting player2 div
  let user1Div = $("#user1-info"); //getting divs by selector
  let user2Div = $("#user2-info");
  let playerP1 = $(
    `<p id="user1">${playerNames["name1"]}</p><div class="user-color" style="background-color: #${playerDisc[0]}"></div>`
  ); //setting paragraph including user choosen name and circles with color
  let playerP2 = $(
    `<p id="user2">${playerNames["name2"]}</p><div class="user-color" style="background-color: #${playerDisc[1]}"></div>`
  ); //setting paragraph including user choosen name and circles with color

  //appending and making changes on page
  player1.append(playerP1);
  player2.append(playerP2);

  user1Div.append(player1);
  user2Div.append(player2);
};

setResetGame = () => {
  //setting html button on page
  let control = $("#control");
  control.append("<div><button>Reset</button></div>"); //appending
};

placeDisk = column => {
  let targetCol = discs[column]; //clicked column
  for (let i = discs[column].length - 1; i > -1; i--) {
    //looping from the end of the column
    if ($(discs[column][i])[0].className == "circle onHover") {
      //if only class has 'circle onHover'
      $(discs[column][i])[0].className = "circle " + playerDisc[playerTurn];
      onHoverDisc(column);

      if (
        checkWinning(
          $(discs[column][i])[0].getAttribute("col") - 1,
          $(discs[column][i])[0].getAttribute("row") - 1,
          playerDisc[playerTurn]
        )
      ) {
        //if player wins return number of player
        return playerTurn;
      } else {
        if (tie()) {
          //if tie retur -2
          return -2;
        }
      }
      ++playerTurn;
      break;
    }
  }
  return -1;
};

checkWinning = (col, row, color) => {
  return (
    checkVertical(col, row, color) ||
    checkHorizontal(col, row, color) ||
    checkDiagonalR(col, row, color) ||
    checkDiagonalL(col, row, color)
  ); //either one is true means player wins
};

checkVertical = (col, row, color) => {
  //checks vertical winner
  let count = 0; //if count reaches 4 or more then player won

  //go up from last placed disc
  for (let i = row; i < discs.length && i >= 0; i--) {
    if ($(discs)[col][i].className.includes(color)) {
      count++;
      if (count >= WIN) {
        //if count reaches 4 or more then player won
        return true;
      }
    } else break;
  }

  //go down from last placed disc
  for (let i = row + 1; i < discs.length && i >= 0; i++) {
    if (discs[col][i].className.includes(color)) {
      count++;
      if (count >= WIN) {
        //if count reaches 4 or more then player won
        return true;
      }
    } else break;
  }
  return false; //return false when no player score four disc in a column
};

checkHorizontal = (col, row, color) => {
  //check herizontal placed disc
  let count = 0;
  //if count reaches 4 or more then player won

  //go left from last placed disc
  for (let i = col; i < discs.length && i >= 0; i--) {
    if ($(discs)[i][row].className.includes(color)) {
      count++;
      if (count >= WIN) {
        //if count reaches 4 or more then player won
        return true;
      }
    } else break;
  }

  //go right from last placed disc
  for (let i = col + 1; i < discs.length && i >= 0; i++) {
    if (discs[i][row].className.includes(color)) {
      count++;
      if (count >= WIN) {
        return true; //if count reaches 4 or more then player won
      }
    } else break;
  }
  return false; //return false when no player score four disc in a row
};

checkDiagonalL = (col, row, color) => {
  //recurcivly count up left and down right if score > 4 then win
  let count = diagonal1(col, row, color);
  count += diagonal2(col, row, color);
  if (count >= WIN + 1) return true;
  return false;
};

checkDiagonalR = (col, row, color) => {
  //recurcivly count down left and up right if score > 4 then win
  let count = diagonal3(col, row, color);
  count += diagonal4(col, row, color);
  if (count >= WIN + 1) return true;
  return false;
};

//down right
diagonal1 = (col, row, color) => {
  if (
    row < 0 ||
    col < 0 ||
    row > discs.length - 1 ||
    col > discs.length - 1 ||
    !discs[col][row].className.includes(color)
  )
    return 0; //base case
  return 1 + diagonal1(col + 1, row + 1, color); //recursive call
};

//up left
diagonal2 = (col, row, color) => {
  if (
    row < 0 ||
    col < 0 ||
    row > discs.length - 1 ||
    col > discs.length - 1 ||
    !discs[col][row].className.includes(color)
  )
    return 0; //base case
  return 1 + diagonal2(col - 1, row - 1, color); //recursive call
};

//up right
diagonal3 = (col, row, color) => {
  if (
    row < 0 ||
    col < 0 ||
    row > discs.length - 1 ||
    col > discs.length - 1 ||
    !discs[col][row].className.includes(color)
  )
    return 0; //base case
  return 1 + diagonal3(col + 1, row - 1, color); //recursive call
};

//down left
diagonal4 = (col, row, color) => {
  if (
    row < 0 ||
    col < 0 ||
    row > discs.length - 1 ||
    col > discs.length - 1 ||
    !discs[col][row].className.includes(color)
  )
    return 0; //base case
  return 1 + diagonal4(col - 1, row + 1, color); //recursive call
};

finishGame = winner => {
  //setting html elements for after player finish game either by winning or tie!
  $("#control").before('<div id="done-game"></div>');
  $("#control").hide(100);
  let doneGame = $("#done-game");
  let winning = $(
    `<div id="winner"><p>Winner is <span>${
      playerNames[`name${winner + 1}`]
    }</span></p></div>`
  );
  let tie = $(`<div id="winner"><p>TIE!</p></div>`);
  winner == -2 ? doneGame.append(tie) : doneGame.append(winning); //if win appeand winning else tie
  setTimeout(() => {
    for (const disc of discs) {
      for (const el of disc) {
        el.className = "circle";
      }
    }
    $("#done-game").remove();
    $("#control").show(300);
  }, 5000); //reset the game and remove message
};

tie = () => {
  //summing circles that contain colors and see if equals number of circles in grid then it's tie
  let color1 = document.querySelectorAll(`[class*="${playerDisc[0]}"]`);
  let color2 = document.querySelectorAll(`[class*="${playerDisc[1]}"]`);

  //summing and comparing with squared grid
  if (color1.length + color2.length == discs.length ** 2) {
    return true;
  }
  return false;
};

onHoverDisc = column => {
  //adding hover class
  let targetCol = discs[column];
  for (let i = discs[column].length - 1; i > -1; i--) {
    if ($(discs[column][i])[0].className == "circle") {
      $(discs[column][i])[0].className += " onHover"; //adding
      break;
    }
  }
};

offHoverDisc = column => {
  //removing hover class
  let targetCol = discs[column];
  for (let i = discs[column].length - 1; i > -1; i--) {
    if ($(discs[column][i])[0].className.includes("onHover")) {
      $(discs[column][i])[0].className = "circle"; //removing
      break;
    }
  }
};
