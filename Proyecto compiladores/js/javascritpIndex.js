function mostrarInfo() {
    var nombre = document.getElementById("nombre").value;
    var edad = document.getElementById("edad").value;
    var curso = document.getElementById("curso").value;

    alert("Nombre: " + nombre + "\nEdad: " + edad + "\nCurso: " + curso);

    var infoContainer = document.createElement("div");
    infoContainer.innerHTML = "<p>Nombre: " + nombre + "</p><p>Edad: " + edad + "</p><p>Curso: " + curso + "</p>";
    document.body.appendChild(infoContainer);
}
