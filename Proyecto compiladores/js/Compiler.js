const TokenType = {
    IDENTIFICADOR: 'IDENTIFICADOR',
    NUMERO: 'NUMERO',
    OPERADOR: 'OPERADOR',
    PUNTUACION: 'PUNTUACION',
    ECONTROL: 'ECONTROL',
    ACCESO: 'ACCESO',
    METODO: 'METODO',
    CICLO: 'CICLO',
    PALABRACLAVE: 'PALABRACLAVE',
    INFORMACION: 'INFORMACION',
    VARIABLE: 'VARIABLE',
    PALABRARESERVADA: 'PALABRARESERVADA',
    ERROR: 'ERROR'
};


const palabrasClave = ['ditto', 'eclosion', 'contraataque', 'antidoto', 'veneno', 'margcargo', 'silvally', 'bici', 'throh', 'arceus', 'xatu'];
const variables = ['roca', 'agua', 'acero', 'fuego', 'bicho', 'onix', 'combee', 'alakazam', 'doublade', 'kakuna', 'hada', 'minun', 'eter'];
const eControles = ['slow', 'king', 'bro', 'pikachu', 'pika', 'chispa', 'chu'];
const informaciones = ['grunido', 'mordisco'];
const ciclos = ['klink', 'klang', 'entei'];
const metodos = ['starly'];
const accesos = ['masters', 'poke', 'super', 'ultra', 'movimiento'];
const palabrasReservadas = ['ditto', 'eclosion', 'contraataque', 'antidoto', 'veneno', 'margcargo', 'silvally', 'bici', 'throh', 'arceus', 'xatu',
'roca', 'agua', 'acero', 'fuego', 'bicho', 'onix', 'combee', 'alakazam', 'doublade', 'kakuna', 'hada', 'minun', 'eter', 'slow', 'king', 'bro', 'pikachu',
'pika', 'chispa', 'chu', 'grunido', 'mordisco', 'klink', 'klang', 'entei', 'starly', 'masters', 'poke', 'super', 'ultra', 'movimiento'];
const identificadores = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
const errores = [];


class Token {
    constructor(type, value, linea) {
        this.type = type;
        this.value = value;
        this.linea = linea;
    }
}

function lex(input) {
    const tokens = [];
    let current = 0;
    let currentLine = 1;

    while (current < input.length) {
        let char = input[current];

        if (/[a-zA-Z]/.test(char)) {
            let value = '';
            while (/[a-zA-Z0-9]/.test(char) && current < input.length) {
                value += char;
                char = input[++current];
            }
            if (palabrasClave.includes(value)) {
                tokens.push(new Token(TokenType.PALABRACLAVE, value, currentLine));
            } else if (variables.includes(value)) {
                tokens.push(new Token(TokenType.VARIABLE, value, currentLine));
            } else if (eControles.includes(value)) {
                tokens.push(new Token(TokenType.ECONTROL, value, currentLine));
            } else if (informaciones.includes(value)) {
                tokens.push(new Token(TokenType.INFORMACION, value, currentLine));
            } else if (ciclos.includes(value)) { 
                tokens.push(new Token(TokenType.CICLO, value, currentLine));
            }else if (metodos.includes(value)) {
                tokens.push(new Token(TokenType.METODO, value, currentLine));
            } else if (accesos.includes(value)) {
                tokens.push(new Token(TokenType.ACCESO, value, currentLine));
            } else {
                const sugerencia = sugerirCorreccion(value);
                if (sugerencia !== '') {
                    tokens.push(new Token(TokenType.ERROR, sugerencia, currentLine));
                } else if (identificadores.test(value)){
                    tokens.push(new Token(TokenType.IDENTIFICADOR, value, currentLine));
                } else {
                    tokens.push(new Token(TokenType.ERROR, value, currentLine));
                }
            }
            continue;
        }

        if (/[0-9]/.test(char)) {
            let value = '';
            while (/[0-9]/.test(char) && current < input.length) {
                value += char;
                char = input[++current];
            }
            tokens.push(new Token(TokenType.NUMERO, value, currentLine));
            continue;
        }

        if (/[+\-*\/=()"{}[\],;:'$]/.test(char)) {
            tokens.push(new Token(TokenType.OPERADOR, char, currentLine));
            current++;
            continue;
        }               
        

        if (/\s/.test(char)) {
            if (char === '\n') {
                currentLine++;
            }
            current++;
            continue;
        }

        tokens.push(new Token(TokenType.ERROR, `Token no reconocido: ${char}`, currentLine));
        current++; 
    }

    return tokens;
}

function sugerirCorreccion(token) {
    const sugerencias = palabrasReservadas.filter(PALABRARESERVADA => levenshteinDistance(PALABRARESERVADA, token) <= 2);
    if (sugerencias.length > 0) {
        return `Posible palabra mal escrita ${token}. Puede que quieras decir: ${sugerencias.join(', ')}`;
    }
    return '';
}

function levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    let i, j;

    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, 
                    matrix[i][j - 1] + 1,     
                    matrix[i - 1][j] + 1    
                );
            }
        }
    }

    
    let requiredMatches = 0;
    if (b.length === 3) {
        requiredMatches = 2;
    } else if (b.length === 4) {
        requiredMatches = 3;
    } else if (b.length >= 5) {
        requiredMatches = 4;
    }

 
    let matchingLetters = 0;
    for (i = 0; i < b.length; i++) {
        if (b.charAt(i) === a.charAt(i)) {
            matchingLetters++;
        }
    }

    if (matchingLetters >= requiredMatches) {
        return matrix[b.length][a.length];
    } else {
        return Infinity; 
    }
}

function mostrarTokens(tokens) {
    const tokensTable = document.getElementById('tokensTable').getElementsByTagName('tbody')[0];
    tokensTable.innerHTML = '';
    tokens.forEach(token => {
        const row = tokensTable.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        cell1.textContent = token.linea;
        cell2.textContent = token.type;
        cell3.textContent = token.value;

        if (token.type === TokenType.ERROR) {
            row.classList.add('error');
        }
    });
}


function compile() {
    console.log("Botón de compilación presionado");
    const codeInput = document.getElementById('codeInput').value;
    const tokens = lex(codeInput);
    mostrarTokens(tokens);
}