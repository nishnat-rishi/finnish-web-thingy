import React, { useState } from 'react'
import PropTypes from 'prop-types'

import noteService from '../services/notes'

const NoteForm = ({ user, notes, setNotes }) => {
  const [newNote, setNewNote] = useState('')

  const handleNoteChange = (event) => setNewNote(event.target.value)

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }

    noteService
      .create(noteObject)
      .then((returnedNote) => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  if (!user) {
    return (<></>)
  } else {
    return (
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type='submit'>Save</button>
      </form>
    )
  }

}

NoteForm.propTypes = {
  setNotes: PropTypes.func.isRequired
}

export default NoteForm