function handleFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    if (!file || (!file.name.endsWith('.eve') && !file.name.endsWith('.eve'))) {
        alert('Solo se pueden cargar archivos con extensión .eve');
        return;
    } 
    reader.onload = function(event) {
        const text = event.target.result;
        document.querySelector('.code-input').value = text;
        // Dispara el evento input para que el TextArea se refresque
        document.querySelector('.code-input').dispatchEvent(new Event('input'));
    };
    
    reader.readAsText(file);
}

function updateTextArea(text) {
    document.querySelector('.code-input').value = text;
}

function saveFile() {
    var codeContent = document.getElementById('codeInput').value;
    var blob = new Blob([codeContent], { type: 'text/plain' });
    var a = document.createElement('a');
    a.download = 'pokedex.eve';
    a.href = window.URL.createObjectURL(blob);
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}