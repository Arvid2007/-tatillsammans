const express = require('express')
const Database = require('better-sqlite3')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const db = new Database('db.sqlite')

app.get('/', (_, s) => s.send('API server listening...'))

// login a user
app.post('/login', (request, response) => {
  try {
    const { username, password } = request.body
    const sql = 'SELECT * FROM users'
    const users = db.prepare(sql).all()

    // check if user exists and has the correct password
    const user = users.find((elem) => elem.username === username && elem.password === password)
    if (user) {
      response.status(200).json(user)
    } else {
      response.status(401).json({ error: 'Incorrect login' })
    }
  } catch (err) {
    console.error(err)
    response.status(500).json({ error: 'Database error' })
  }
})

// select all users
app.get('/users', (request, response) => {
  try {
    console.log('API request accepted:', request.url)
    const sql = 'SELECT * FROM users'
    const users = db.prepare(sql).all()
    response.json(users)
  } catch (err) {
    console.error(err)
    response.status(500).json({ error: 'Database error' })
  }
})

// select userActivities for a specific user
app.get('/users/:userId', (request, response) => {
  try {
    const { userId } = request.params
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?')
    const user = stmt.all(userId)
    response.json(user)
  } catch (err) {
    console.error(err)
    response.status(500).json({ error: 'Database error' })
  }
})

// insert new user
app.post('/users', (request, response) => {
  try {
    const { name, age, username, password } = request.body

    const select = db.prepare('SELECT * FROM users where username = ?')
    const selectResult = select.all(username)
    console.log('selectResult', selectResult)
    if (selectResult.length > 0) {
      response.status(409).json({})
    } else {
      const stmt = db.prepare(
        'INSERT INTO users (name, age, username, password) VALUES (?, ?, ?, ?)'
      )
      const result = stmt.run(name, age, username, password)
      response.status(201).json({ id: result.lastInsertRowid, name, age, username })
    }
  } catch (err) {
    console.error(err)
    response.status(500).json({ error: 'Database error' })
  }
})

// select all activities
app.get('/activity', (request, response) => {
  try {
    console.log('API request accepted:', request.url)
    const sql = 'SELECT * FROM activity'
    const activities = db.prepare(sql).all()
    response.json(activities)
  } catch (err) {
    console.error(err)
    response.status(500).json({ error: 'Database error' })
  }
})

// select activity by id
app.get('/activity/:activityId', (request, response) => {
  try {
    const { activityId } = request.params    
    const sql = 'SELECT * FROM activity WHERE id = ?'
    const activities = db.prepare(sql).all(activityId)    
    if (activities.length > 0) {
      response.json(activities[0])
    } else {
      response.status(404)
    }
  } catch (err) {
    console.error(err)
    response.status(500).json({ error: 'Database error' })
  }
})

// insert new activity
app.post('/activity', (request, response) => {
  try {
    const { name, time, seats, locationId, creatorId } = request.body
    const stmt = db.prepare(
      'INSERT INTO activity (name, time, seats, locationId, creatorId) VALUES (?, ?, ?, ?, ?)'
    )
    const result = stmt.run(name, time, seats, locationId, creatorId)
    response
      .status(201)
      .json({ id: result.lastInsertRowid, name, time, seats, locationId, creatorId })
  } catch (err) {
    console.error(err)
    response.status(500).json({ error: 'Database error' })
  }
})

// update/edit activity
app.patch('/activity/:activityId', (request, response) => {
  try {
    const { activityId } = request.params
    const { name, time, seats, locationId } = request.body
    db.prepare(
      'UPDATE activity SET name = ?, time = ?, seats = ?, locationId = ? WHERE id = ?'
    ).run(name, time, seats, locationId, activityId)
    response.status(200).json({ activityId, name, time, seats, locationId })
  } catch (err) {
    console.error(err)
    response.status(500).json({ error: 'Database error' })
  }
})

// select all locations
app.get('/location', (request, response) => {
  try {
    console.log('API request accepted:', request.url)
    const sql = 'SELECT * FROM location'
    const locations = db.prepare(sql).all()
    response.json(locations)
  } catch (err) {
    console.error(err)
    response.status(500).json({ error: 'Database error' })
  }
})

// insert new location
app.post('/location', (request, response) => {
  try {
    const { name, address, city } = request.body
    const stmt = db.prepare('INSERT INTO location (name, address, city) VALUES (?, ?, ?)')
    const result = stmt.run(name, address, city)
    response.status(201).json({ id: result.lastInsertRowid, name, address, city })
  } catch (err) {
    console.error(err)
    response.status(500).json({ error: 'Database error' })
  }
})

// insert new userActivity
app.post('/userActivity', (request, response) => {
  try {
    const { userId, activityId } = request.body
    const stmt = db.prepare('INSERT INTO userActivity (userId, activityId) VALUES (?, ?)')
    const result = stmt.run(userId, activityId)
    response.status(201).json({ userId, activityId })
  } catch (err) {
    console.error(err)
    response.status(500).json({ error: 'Database error' })
  }
})

// select userActivities for a specific user
app.get('/userActivity/:userId', (request, response) => {
  try {
    const { userId } = request.params
    const stmt = db.prepare('SELECT * FROM userActivity WHERE userId = ?')
    const userActivities = stmt.all(userId)
    response.json(userActivities)
  } catch (err) {
    console.error(err)
    response.status(500).json({ error: 'Database error' })
  }
})

// select userActivities for a specific activityId
app.get('/userActivity/activity/:activityId', (request, response) => {
  try {
    const { activityId } = request.params
    const stmt = db.prepare('SELECT * FROM userActivity WHERE activityId = ?')
    const userActivities = stmt.all(activityId)
    response.json(userActivities)
  } catch (err) {
    console.error(err)
    response.status(500).json({ error: 'Database error' })
  }
})

// remove user from activity
app.delete('/userActivity', (request, response) => {
  try {
    const { userId, activityId } = request.body
    db.prepare('DELETE FROM userActivity WHERE userId = ? AND activityId = ?').run(
      userId,
      activityId
    )
    response.status(201).json({ userId, activityId })
  } catch (err) {
    console.error(err)
    response.status(500).json({ error: 'Database error' })
  }
})

// remove all users from deleted activity
app.delete('/activity', (request, response) => {
  try {
    const { activityId } = request.body
    const deleteActivity = db.transaction((id) => {
      db.prepare('DELETE FROM userActivity WHERE activityId = ?').run(id)
      db.prepare('DELETE FROM activity WHERE id = ?').run(id)
    })
    deleteActivity(activityId)
    response.status(204).send()
  } catch (err) {
    console.error(err)
    response.status(500).json({ error: 'Database error' })
  }
})

const PORT = 3123
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

// Graceful shutdown
process.on('SIGINT', () => {
  db.close()
  process.exit(0)
})
