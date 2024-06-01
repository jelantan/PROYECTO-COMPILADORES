  function updateLineNumbers() {
    var code = document.getElementById("codeInput").value;
    var lines = code.split("\n").length;
    var lineNumbers = "";

    for (var i = 1; i <= lines; i++) {
      lineNumbers += i + "<br>";
    }

    document.getElementById("lineNumbers").innerHTML = lineNumbers;
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      updateLineNumbers();
    }
  }

  window.onload = updateLineNumbers;

  const codeInput = document.getElementById('codeInput');
  const lineNumbers = document.getElementById('lineNumbers');
  const highlightedCode = document.getElementById('highlightedCode');

  function syncScroll() {
    lineNumbers.scrollTop = codeInput.scrollTop;
    highlightedCode.scrollTop = codeInput.scrollTop;
  }

codeInput.addEventListener('scroll', syncScroll);



const palabrasC = ['ditto', 'eclosion', 'contraataque', 'antidoto', 'veneno', 'margcargo', 'silvally', 'bici', 'throh', 
                    'arceus', 'xatu'];

const variabless = ['roca', 'agua', 'acero', 'fuego', 'bicho', 'onix', 'combee', 'alakazam', 'doublade', 
'kakuna', 'hada', 'minun', 'eter']

const controles = ['slow', 'king', 'bro', 'pikachu', 'pika', 'chispa', 'chu'];
const infos = ['grunido', 'mordisco'];
const cics = ['klink', 'klang', 'entei'];
const metos = ['starly'];
const access = ['master', 'poke', 'super', 'ultra', 'movimiento'];



function highlightKeywords() {
  const codeInput = document.getElementById('codeInput');
  const highlightedCode = document.getElementById('highlightedCode');
  let text = codeInput.value;


  const escapeRegExp = string => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');


  palabrasC.forEach(palabraC => {
    const regex = new RegExp('\\b' + escapeRegExp(palabraC) + '\\b', 'g');
    text = text.replace(regex, '<span class="palabra-clave">' + palabraC + '</span>');
  });

  variabless.forEach(variable => {
    const regex = new RegExp('\\b' + escapeRegExp(variable) + '\\b', 'g');
    text = text.replace(regex, '<span class="variable">' + variable + '</span>');
});

  text = text.replace(/\b\d+\b/g, '<span class="numero">$&</span>');

    controles.forEach(control => {
        const regex = new RegExp('\\b' + escapeRegExp(control) + '\\b', 'g');
        text = text.replace(regex, '<span class="eControle">' + control + '</span>');
    });

    infos.forEach(info => {
        const regex = new RegExp('\\b' + escapeRegExp(info) + '\\b', 'g');
        text = text.replace(regex, '<span class="informacion">' + info + '</span>');
    });

    cics.forEach(cic => {
        const regex = new RegExp('\\b' + escapeRegExp(cic) + '\\b', 'g');
        text = text.replace(regex, '<span class="ciclo">' + cic + '</span>');
    });

    metos.forEach(meto => {
        const regex = new RegExp('\\b' + escapeRegExp(meto) + '\\b', 'g');
        text = text.replace(regex, '<span class="metodo">' + meto + '</span>');
    });

    access.forEach(acces => {
        const regex = new RegExp('\\b' + escapeRegExp(acces) + '\\b', 'g');
        text = text.replace(regex, '<span class="acceso">' + acces + '</span>');
    });


  highlightedCode.innerHTML = text;
}


document.getElementById('codeInput').addEventListener('input', highlightKeywords);
