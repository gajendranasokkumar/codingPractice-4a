const express = require('express')
const app = express()

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')

const dbPath = path.join(__dirname, 'cricketTeam.db')
let db = null

app.use(express.json())

const inititalizeDBandServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })

    app.listen(3000, () => {
      console.log('server is Running !!')
    })
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

inititalizeDBandServer()

app.get('/players/', async (request, response) => {
  let q1 = 'SELECT * FROM cricket_team'
  let allTeamList = await db.all(q1)
  response.send(allTeamList)
})

app.post('/players/', async (request, response) => {
  let newPlayer = request.body
  const {playerName, jerseyNumber, role} = newPlayer
  let q2 = `INSERT INTO cricket_team (player_name,jersey_number,role) 
    VALUES('${playerName}','${jerseyNumber}','${role}');`

  let dbResponse = await db.run(q2)
  let insertedId = dbResponse.lastID

  response.send('Player Added to Team')
})

app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  let q3 = `SELECT * FROM cricket_team WHERE player_id = ${playerId}`
  const onePlayer = await db.get(q3)
  response.send(onePlayer)
})

app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  let onePlayer = request.body
  const {playerName, jerseyNumber, role} = onePlayer
  let q4 = `UPDATE cricket_team SET 
  player_name = '${playerName}',
  jersey_number = '${jerseyNumber}',
  role = '${role}'
  WHERE player_id = ${playerId};`
  await db.run(q4)
  response.send('Player Details Updated')
})

app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  let q5 = `DELETE FROM cricket_team WHERE player_id = ${playerId};`
  await db.run(q5)
  response.send('Player Removed')
})

module.exports = app
