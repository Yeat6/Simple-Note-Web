let notescontainer = document.getElementById("notes-container");
let newNoteBtn = document.getElementById("new-note-btn");

let notes = JSON.parse(localStorage.getItem("notes")) || [];