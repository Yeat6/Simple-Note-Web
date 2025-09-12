const note_form = document.getElementById('note-form');

FormData.addEventListener('submit', function(e) {
    e.preventDefault();

    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;

    fetch('http://localhost/Simple Note Web/Backend/index.php/notes', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title, content})
    })

    .then(res => res.json())
    .then(data => {
        alert("Note added successfully!");
        console.log(data);

        note_form.reset();


    })
    .catch(err => console.error(err));

})