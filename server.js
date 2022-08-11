//Require dependencies
const express = require('express')
const fs = require('fs')
const path = require('path')

//Initialize express package
const app = express()
const PORT = process.env.PORT || 3001
const mainDir = path.join(__dirname, '/public')

// const apiRoutes = require('./routes/apiRoutes')
// const htmlRoutes = require('./routes/htmlRoutes')

//Set up data parsing
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// API Routes to HTML and API Data
app.get('/notes', (req, res) => {
  res.sendFile(path.join(mainDir, 'notes.html'))
})

app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/db/db.json'))
})

app.get('/api/notes/:id', (req, res) => {
  let savedNotes = JSON.parse(fs.readFileSync('./db/db.json'))
  res.json(savedNotes[Number(req.params.id)])
})
app.get('*', function (req, res) {
  res.sendFile(path.join(mainDir, 'index.html'))
})

app.post('/api/notes', function (req, res) {
  let savedNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'))
  let newNote = req.body
  let uniqueID = savedNotes.length.toString()
  newNote.id = uniqueID
  savedNotes.push(newNote)

  fs.writeFileSync('./db/db.json', JSON.stringify(savedNotes))
  console.log('Note saved to db.json. Content: ', newNote)
  res.json(savedNotes)
})

//Delete note function
app.delete('/api/notes/:id', (req, res) => {
  let savedNotes = JSON.parse(fs.readFileSync('./db/db.json'))
  let noteID = req.params.id
  let newID = 0
  console.log(`Deleting note with ID ${noteID}`)
  savedNotes = savedNotes.filter((currentNote) => {
    return currentNote.id != noteID
  })

  for (currentNote of savedNotes) {
    currentNote.id = newID.toString()
    newID++
  }

  //Write new notes to db.json file
  fs.writeFileSync('./db/db.json', JSON.stringify(savedNotes))
  res.json(savedNotes)
})

app.listen(PORT, () =>
  console.log(`Serving static asset routes at http://localhost:${PORT}!`),
)
