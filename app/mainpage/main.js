const socket = io('https://getdata.johntheguy.tk');

socket.emit('getVals');

socket.on('getVals', (object) => {
    loadInVals(object);
});

function loadInVals(object) {
    const games = object.currentGames;
    document.querySelector('#CG').innerHTML = "";
    if(games.length == 0) {
        const el = document.createElement('li');
        const link = document.createElement('a');
        link.textContent = "no games in progress";
        el.appendChild(link);
        document.querySelector('#CG').appendChild(el);
    }
    for (let i = 0; i < games.length; i++) {
      const game = games[i];
      const el = document.createElement('li');
      const link = document.createElement('a');
      link.href = game.link;
      link.textContent = ((game.open) ? "Join" : "Watch") + " Game: " + game.link;
      el.appendChild(link);
      document.querySelector('#CG').appendChild(el);
    }
    console.log("Hello from the console, just know this game is very easy to hack, so good luck with that.");
    console.log("Also, I don't put this on the page because it is a embarrassingly low number, but there are " + object.totalGames + " games ever played on this site.");
}

const input = document.querySelector("#idInput");
const color = document.querySelector("#color");
const visiblity = document.querySelector("#public");
const taken = document.querySelector(".available");

function createGame() {
    const id = input.value;
    socket.emit('createGame', id, color.value, visiblity.value);
}

socket.on('createGame', (object) => {
    if(object.taken) {
        taken.innerHTML = "id is already claimed";
    }
    else {
        window.location.href = "/" + object.id;
    }
});