const kanban__body = document.querySelector('.kanban__body');

let columnsArray = [];
let cardsArray = [];

function init() {
  if (localStorage.getItem("columns") === "[]" || localStorage.getItem("columns") === null) {
    const todo = new Column("To do");
    const doing = new Column("Doing");
    const done = new Column("Done");
    board.addColumn(todo);
    board.addColumn(doing);
    board.addColumn(done);
    saveColInLocalStorage(todo, doing, done);
  }
}
const retrievedColumns = localStorage.getItem("columns");
const retrievedCards = localStorage.getItem("cards");
if (retrievedColumns) {
  columnsArray = [...JSON.parse(retrievedColumns)];
}
if (retrievedCards) {
  cardsArray = [...JSON.parse(retrievedCards)];
}


//zapisywanie do localStorage
function saveColInLocalStorage(...column) {
  columnsArray.push(...column);
  preventCycling(columnsArray, "columns");
}

function saveCardsInLocalStorage(card) {
  cardsArray.push(card);
  preventCycling(cardsArray, "cards");
  console.log(cardsArray);
}

function loadFromLocalStorage() {
  columnsArray.forEach((a) => {
    if(a) {
      let column = new Column(a.name, a.id);
      board.addColumn(column);
    }
  });
  cardsArray.forEach((a) => {
    if(a) {
      let card = new Card(a.id, a.description, a.columnId, a.color);
      let column = document.querySelector(`[id ="${a.columnId}"] > ul`);
      if(column) {
        column.appendChild(card.element);
      }
    }
  });
}

function preventCycling(array, key) {
  const seen = [];
  localStorage.setItem(key, JSON.stringify(array, function(key, val) {
   if (val != null && typeof val == "object") {
        if (seen.indexOf(val) >= 0) {
            return;
        }
        seen.push(val);
    }
    return val;
  }));
}

function deleteCard(id) {
  const result = cardsArray.filter((obj) => {
    if(obj) {
      return obj.id != id;
    }
  });
  cardsArray = result;
  localStorage.setItem("cards", JSON.stringify(cardsArray));
}

function deleteColumn(id) {
  const result = columnsArray.filter((obj) => {
    if(obj) {
      return obj.id != id;
    }
  });
  columnsArray = result;
  localStorage.setItem("columns", JSON.stringify(columnsArray));
}


function updatePosition(item, target) {
  objIndex = cardsArray.findIndex((obj => obj.id == item));
  cardsArray[objIndex].columnId = target;
  preventCycling(cardsArray, "cards");
}

function setColor(card, color) {
  console.log(color);
  card.style.borderColor = color;
  objIndex = cardsArray.findIndex((obj => obj.id == card.id));
  cardsArray[objIndex].color = color;
  preventCycling(cardsArray, "cards");
}

function deleteCardsFromColumn(id) {
  console.log("wywalamy wszystkie karty nalezace do kolumy", id);
  const result = cardsArray.filter((obj) => {
    if(obj) {
      return obj.columnId != id;
    }
  });
  cardsArray = result;
  localStorage.setItem("cards", JSON.stringify(cardsArray));
}

//funkcja generująca unikalne id
function randomString() {
    var chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
    var str = '';
    for (var i = 0; i < 10; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

function initSortable() {
   $('.column__card-list').sortable({
     connectWith: '.column__card-list',
     placeholder: 'column__card-placeholder',
     dropOnEmpty: true,
     receive: function(event, ui) {
       const target = event.target.parentNode.id;
       const item = ui.item[0].id;
       updatePosition(item, target);
     }
   }).disableSelection();
 }


class Column {
  constructor(name, id = randomString()) {
    this.id = id;
    this.name = name;
    this.element = this.createColumn();
    this.element.setAttribute("id", id);
  }
  createColumn() {
    const column = document.createElement("div");
    column.classList.add('column');
    const columnTitle = document.createElement("h2");
    columnTitle.classList.add('column__title');
    columnTitle.innerHTML = this.name;
    const columnCardList = document.createElement("ul");
    columnCardList.classList.add('column__card-list');
    const columnDelete = document.createElement("button");
    columnDelete.classList.add('column__button');
    columnDelete.classList.add('column__button--delete-column');
    columnDelete.textContent = "X"
    const columnAddCard = document.createElement("button");
    columnAddCard.classList.add('column__button');
    columnAddCard.classList.add('column__button--add-card');
    columnAddCard.textContent = "add card..."

    columnDelete.onclick = () => {
      this.removeColumn();
    };

    columnAddCard.onclick = () => {
      this.addCard(new Card(randomString(), prompt("Enter the name of the card"), this.id, "transparent"));
      //this odwołuje się do kolumny
    };

    column.appendChild(columnDelete);
    column.appendChild(columnTitle);
    column.appendChild(columnAddCard);
    column.appendChild(columnCardList);

    return column;
  }
  removeColumn() {
    this.element.remove();
    deleteColumn(this.id);
    deleteCardsFromColumn(this.id);
  }

  addCard(card) {
    console.log(card);
    this.element.querySelector(".column__card-list").append(card.element);
    saveCardsInLocalStorage(card);
  }
}

class Card {
  constructor(id = randomString(), description, columnId, color = 'transparent') {
    this.id = id;
    this.description = description;
    this.columnId = columnId;
    this.color = color;
    this.element = this.createCard();
    this.element.setAttribute("id", id);
    this.element.style.borderColor = color;
  }

  createCard() {
    const card = document.createElement("li");
    card.classList.add('column__card');
    const cardDescription = document.createElement("p");
    cardDescription.classList.add('column__card-description');
    cardDescription.innerHTML = this.description;
    const cardDelete = document.createElement("button");
    cardDelete.classList.add('column__button');
    cardDelete.classList.add('column__button--delete-card');
    cardDelete.textContent = "X";
    const colorButton = document.createElement("i");
    colorButton.classList.add('fas');
    colorButton.classList.add('fa-palette');
    colorButton.classList.add('color-icon');
    const color = document.createElement("input");
    color.type = "color";
    color.addEventListener('change', handleUpdate);
    console.log(this.color);
    color.classList.add('column__card-color');

    cardDelete.onclick = () => {
      this.removeCard();
    };

    color.onclick = () => {
    }

    card.appendChild(colorButton);
    card.appendChild(color);
    card.appendChild(cardDelete);
    card.appendChild(cardDescription);


    return card;
  }
  removeCard() {
    this.element.remove();
    deleteCard(this.id);
  }
}

const board = {
  name: 'Kanban Board',
  addColumn(column){
    kanban__body.appendChild(column.element);
    initSortable();
  }
}


document.querySelector('.kanban__create-column').onclick = function() {
  const columnName = prompt("Enter column name");
  const column = new Column(columnName);
  board.addColumn(column);
  saveColInLocalStorage(column);
}


loadFromLocalStorage();
init();


const inputs = document.querySelectorAll('.column__card-color');
console.log("inputs", inputs);
inputs.forEach(input => input.addEventListener('change', handleUpdate));

function handleUpdate(e) {
  console.log("test");
  const card = e.target.parentNode;
  const color = this.value;
  setColor(card, color);
}
