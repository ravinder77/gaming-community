const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');



const app = express();
const port = 3000;


// middleware
app.use(express.static('static'));
app.use(cors());
app.use(express.json());

// db

let db;

(async () => {
 try {
   db = await open({
     filename: './main/database.sqlite',
     driver: sqlite3.Database
   })
  console.log('Database connected')
 } catch(error){
   console.error("failed to connect to database", error);
   process.exit(1)
 }
})();




app.get('/', (req, res) => {
res.send('welcome to gaming app!');
});


// routes

async function getAllGames() {
  const query = 'SELECT * FROM games';
  const response = await db.all(query);
  return {
    games: response
  }
}

app.get('/games', async (req, res) => {
  
  try{
    const result = await getAllGames()

    if(result.games.length === 0){
      return res.status(404).json({
        message: 'No games found'}
        )
    }

    res.status(200).json(result)

  } catch(error){
    res.status(500).json({message: error.message})
  }

  })


  // get game by id

  async function getGameById(id) {
    const query = 'SELECT * FROM games WHERE id = ?';
    const response = await db.get(query, [id]);
    return {
      game: response
    }

  }



  app.get('/games/details/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    try {
       const result = await getGameById(id);
       if(result.game === undefined){
        return res.status(404).json({
          message: 'Game not found'
        })
       }

       res.status(200).json(result);

    } catch(error) {
      res.status(500).json({message: error.message})
    }
   
  });


// get game by genre

async function getGameByGenre(genre) {
  const query = 'SELECT * FROM games WHERE genre = ?';
  const response = await db.all(query, [genre]);
  return {
    games: response
  }
}


app.get('/games/genre/:genre', async (req, res) => {
  const genre = req.params.genre;


  try{
     const result = await getGameByGenre(genre);

     if(result.games.length === 0){
       return res.status(404).json({
        message: 'No games found in genre' + genre
       })
     }

     res.status(200).json(result)

  } catch(error){
    res.status(500).json({message: error.message})
  }
});



// games by platform

async function getGamesByPlatform(platform) {
  const query = 'SELECT * FROM games where platform = ?';
  const response = await db.all(query, [platform]);
  return {
    games: response
  }
}

app.get('/games/platform/:platform', async (req, res) => {
  const platform = req.params.platform;

  try {
   const result = await getGamesByPlatform(platform);

   if(result.games.length === 0){
    return res.status(404).json({
      message: 'No games found in platform' + platform
    })
   }

   res.status(200).json(result)
  } catch(error) {
    res.status(500).json({message: error.message})
  }
  
})



// sort by rating high to low

async function sortGamesByRating() {
  const query  = 'SELECT * FROM games ORDER BY rating DESC';
  const response = await db.all(query);
  return {
    games: response
  }
}

app.get('/games/sort-by-rating', async (req, res) => {
   
  try {
    const result = await sortGamesByRating();

    if(result.games.length === 0){
      return res.status(404).json({
        message: 'No games found'
      })
    }
    res.status(200).json(result);
  } catch(error) {
    res.status(500).json({message: error.message})
  }
});


// get all players


async function getAllPlayers() {
  const query = 'SELECT * FROM players';
  const response = await db.all(query);
  return {
    players: response
  }
}

app.get('/players', async (req, res) => {
 

  try {
    const result = await getAllPlayers();
    res.status(200).json(result);
  } catch(error) {
    res.status(500).json({message: error.message})
  }
});

// get player by id

async function getPlayerById(id) {
  const query = 'SELECT * FROM players WHERE id = ?';
  const response = await db.get(query, [id]);
  return {
    player: response
  }
}

app.get('/players/details/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  
  try{
     const result = await getPlayerById(id);

     if(!result.player){
      return res.status(404).json({
        message: 'Player not found'
      })
     }
     res.status(200).json(result);
  } catch(error) {
    res.status(500).json({message: error.message})
  }
})

//get player by platform

async function getPlayersByPlatform(platform) {
  const query = 'SELECT * FROM players WHERE platform = ?';
  const response = await db.all(query, [platform]);
  return {
    players: response
  }
}

app.get('/players/platform/:platform', async (req, res) => {
  const platform = req.params.platform;
 
  try {
    const result = await getPlayersByPlatform(platform);

    if(result.players.length === 0){
      return res.status(404).json({
        message: 'No players found in platform' + platform
      })
    }


    res.status(200).json(result);
  } catch(error) {
    res.status(500).json({message: error.message})
  }
})

// sort by rating high to low

async function sortPlayersByRating() {
  const query = 'SELECT * FROM players ORDER BY rating DESC';
  const response = await db.all(query);
  return {
    players: response
  }
}

app.get('/players/sort-by-rating', async (req, res) => {


  try {
    const result = await sortPlayersByRating();

    if(result.players.length === 0){
      return res.status(404).json({
        message: 'No players found'
      })
    }

    res.status(200).json(result);
  } catch(error) {
    res.status(500).json({message: error.message})
  }
});

// get all touraments

async function getAllTournaments() {
  const query = 'SELECT * FROM tournaments';
  const response = await db.all(query);
  return {
    tournaments: response
  }
}


app.get('/tournaments', async (req, res) => {
  try {
    const result = await getAllTournaments();

   if(result.tournaments.length === 0){
    return res.status(404).json({
      message: 'No tournaments found'
    })
   }

    res.status(200).json(result);
  } catch(error) {
    res.status(500).json({message: error.message})
  }
});


// get tournament by id

async function getTournamentById(gameId) {
  const query = 'SELECT * FROM tournaments WHERE gameid = ?';
  const response = await db.get(query, [gameId]);
  return {
    tournament: response
  }
}

app.get('/tournaments/details/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const result = await getTournamentById(id);

    if(!result.tournament){
      return res.status(404).json({
        message: 'Tournament not found'
      })
    }
    res.status(200).json(result);
  } catch( error) {
    res.status(500).json({message: error.message})
  }
  
})


// get tournament by gameid

async function getTournamentByGameId(gameId) {
  const query = 'SELECT * FROM tournaments WHERE gameId = ?';
  const response = await db.all(query, [gameId]);
  return {
    tournaments: response
  }
}

app.get('/tournaments/game/:gameId', async (req, res) => {
  const gameId = parseInt(req.params.gameId);


  try {
    const result = await getTournamentByGameId(gameId);

    if(result.tournaments.length === 0){
      return res.status(404).json({
        message: 'No tournaments found in game' + gameId
      })
    }
    res.status(200).json(result);
  } catch(error) {
    res.status(500).json({message: error.message})
  }
});


// sort by pool prize

async function sortTournamentsByPrizePool() {
  const query = 'SELECT * FROM tournaments ORDER BY prizepool DESC';
  const response = await db.all(query);
  return {
    tournaments: response
  }
}

app.get('/tournaments/sort-by-prize-pool', async (req, res) => {
  

  try {
    const result = await sortTournamentsByPrizePool();

    if(result.tournaments.length === 0){
      return res.status(404).json({
        message: 'No tournaments found'
      })
    }


    res.status(200).json(result);
  } catch(error) {
    res.status(500).json({message: error.message})
  }
})



// start the express server
app.listen(port, () => {
  console.log(`app listening at port${port}`);
});
