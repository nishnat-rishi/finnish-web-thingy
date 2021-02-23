import React, { useState, useEffect, useRef } from 'react'

import Note from './components/Note'
import Notification from './components/Notification'
import Footer from './components/Footer'
import LoginForm from './components/LoginForm'
import NoteForm from './components/NoteForm'
import Togglable from './components/Togglable'

import noteService from './services/notes'

const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const noteFormRef = useRef()
  const notificationRef = useRef()

  const notesToShow = showAll ? notes : notes.filter((note) => note.important)

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)))
      })
      .catch((error) => {
        notificationRef.current.show(error.response.data.error, 'failure')
      })
  }

  const addNote = (newNoteObject) => {
    noteFormRef.current.toggleVisibility()
    noteService
      .create(newNoteObject)
      .then((returnedNote) => {
        setNotes(notes.concat(returnedNote))
      })
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification />

      <Togglable
        showLabel={user ? 'Show User' : 'Login'}
        hideLabel={user ? 'Hide User' : 'Cancel'}
      >
        <LoginForm
          user={user}
          setUser={setUser}
          notificationRef={notificationRef}
        />
      </Togglable>

      {
        user &&
        <Togglable showLabel='New Note' hideLabel='Hide' ref={noteFormRef}>
          <NoteForm createNote={addNote} />
        </Togglable>
      }
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <Footer />
    </div>
  )
}

export default App
