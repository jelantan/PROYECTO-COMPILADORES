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
    ERROR: 'ERROR',
    ESTRUCTURA: 'ESTRUCTURA'
};

const palabrasClave = ['ditto', 'eclosion', 'contraataque', 'antidoto', 'veneno', 'margcargo', 'silvally', 'bici', 'throh', 'arceus', 'xatu'];
const variables = ['roca', 'agua', 'acero', 'fuego', 'bicho', 'onix', 'combee', 'alakazam', 'doublade', 'kakuna', 'hada', 'minun', 'eter'];
const eControles = ['slow', 'king', 'bro', 'pikachu', 'pika', 'chispa', 'chu'];
const informaciones = ['grunido', 'mordisco'];
const ciclos = ['klink', 'klang', 'entei'];
const metodos = ['starly'];
const accesos = ['master', 'poke', 'super', 'ultra', 'movimiento'];
const palabrasReservadas = [...palabrasClave, ...variables, ...eControles, ...informaciones, ...ciclos, ...metodos, ...accesos];
const operadores = ['+', '-', '*', '/', '=', '<', '>', '.', '(', ')', '{', '}', '[', ']', ';', ':', '++', '<>', '==', '"', ','];
const identificadores = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
const operadoresInternos = /[+\-*/=<>.]/;

function calcularDistancia(a, b) {
    const matriz = Array.from(Array(a.length + 1), () => Array(b.length + 1).fill(0));

    for (let i = 0; i <= a.length; i++) {
        for (let j = 0; j <= b.length; j++) {
            if (i === 0) matriz[i][j] = j;
            else if (j === 0) matriz[i][j] = i;
            else if (a[i - 1] === b[j - 1]) matriz[i][j] = matriz[i - 1][j - 1];
            else matriz[i][j] = 1 + Math.min(matriz[i - 1][j], matriz[i][j - 1], matriz[i - 1][j - 1]);
        }
    }

    return matriz[a.length][b.length];
}

function sugerirCorreccion(palabra) {
    const sugerencias = palabrasReservadas.filter(p => {
        const distancia = calcularDistancia(p, palabra);
        const porcentaje = 1 - (distancia / Math.max(p.length, palabra.length));
        return porcentaje >= 0.6;
    });

    return sugerencias.length > 0 ? `Posible palabra mal escrita: ${palabra}. ¿Quisiste decir: ${sugerencias.join(', ')}?` : '';
}

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

        if (/[a-zA-Z_$]/.test(char)) {
            let value = '';
            while (current < input.length && /[a-zA-Z0-9_$]/.test(char)) {
                value += char;
                char = input[++current];
            }

            // Aquí aceptamos cualquier identificador, incluidos aquellos con operadores internos
            if (palabrasReservadas.includes(value)) {
                tokens.push(new Token(TokenType.PALABRARESERVADA, value, currentLine));
            } else if (identificadores.test(value)) {
                const sugerencia = sugerirCorreccion(value);
                if (sugerencia !== '') {
                    tokens.push(new Token(TokenType.ERROR, sugerencia, currentLine));
                } else {
                    tokens.push(new Token(TokenType.IDENTIFICADOR, value, currentLine));
                }
            } else if (operadoresInternos.test(value)) {
                tokens.push(new Token(TokenType.ERROR, `Identificador mal escrito: ${value}`, currentLine));
            } else {
                tokens.push(new Token(TokenType.ERROR, `Token no reconocido: ${value}`, currentLine));
            }
            continue;
        }

        if (/[0-9]/.test(char)) {
            let value = '';
            while (current < input.length && /[0-9]/.test(char)) {
                value += char;
                char = input[++current];
            }
            tokens.push(new Token(TokenType.NUMERO, value, currentLine));
            continue;
        }

        if (char === ' ' || char === '\t' || char === '\r') {
            current++;
            continue;
        }

        if (char === '\n') {
            current++;
            currentLine++;
            continue;
        }

        if (operadores.includes(char) || operadores.includes(input.slice(current, current + 2))) {
            let value = char;
            if (operadores.includes(input.slice(current, current + 2))) {
                value = input.slice(current, current + 2);
                current += 2;
            } else {
                current++;
            }
            tokens.push(new Token(TokenType.OPERADOR, value, currentLine));
            continue;
        }

        tokens.push(new Token(TokenType.ERROR, `Caracter inesperado: ${char}`, currentLine));
        current++;
    }

    return tokens;
}

function mostrarTokens(tokens) {
    const tokensTable = document.getElementById('tokensTable').querySelector('tbody');
    tokensTable.innerHTML = '';

    tokens.forEach(token => {
        if (token.type !== TokenType.ERROR) {
            const row = document.createElement('tr');
            const cell1 = document.createElement('td');
            const cell2 = document.createElement('td');
            const cell3 = document.createElement('td');

            cell1.textContent = token.linea;
            cell2.textContent = token.type;
            cell3.textContent = token.value;

            row.appendChild(cell1);
            row.appendChild(cell2);
            row.appendChild(cell3);
            tokensTable.appendChild(row);
        }
    });
}

function mostrarErroresLexicos(tokens) {
    const errorsTable = document.getElementById('lexicalErrorsTable').querySelector('tbody');
    errorsTable.innerHTML = '';

    tokens.forEach(token => {
        if (token.type === TokenType.ERROR) {
            const row = document.createElement('tr');
            const cell1 = document.createElement('td');
            const cell2 = document.createElement('td');
            const cell3 = document.createElement('td');

            cell1.textContent = token.linea;
            cell2.textContent = token.type;
            cell3.textContent = token.value;

            row.appendChild(cell1);
            row.appendChild(cell2);
            row.appendChild(cell3);
            errorsTable.appendChild(row);
        }
    });
}

function mostrarErroresSintacticos(errores) {
    const syntacticErrorsTable = document.getElementById('syntacticErrorsTable').querySelector('tbody');
    syntacticErrorsTable.innerHTML = '';

    errores.forEach(error => {
        const row = document.createElement('tr');
        const cell1 = document.createElement('td');
        const cell2 = document.createElement('td');
        const cell3 = document.createElement('td');

        cell1.textContent = error.linea;
        cell2.textContent = error.type;
        cell3.textContent = error.value;

        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);
        syntacticErrorsTable.appendChild(row);
    });
}

function mostrarResultadoSintactico(resultado) {
    const syntacticOutput = document.getElementById('syntacticOutput');
    syntacticOutput.innerHTML = '';

    resultado.forEach(token => {
        const row = document.createElement('tr');
        const cell1 = document.createElement('td');
        const cell2 = document.createElement('td');
        const cell3 = document.createElement('td');

        cell1.textContent = token.linea;
        cell2.textContent = token.type;
        cell3.textContent = token.value;

        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);
        syntacticOutput.appendChild(row);
    });
}

function obtenerDetalleErrorEstructura(linea, regex, keyword, numeroLinea) {
    let errorMessage = `Error en la línea ${numeroLinea}: estructura '${keyword}' mal formada. `;
    
    const tieneParentesisApertura = linea.includes('(');
    const tieneParentesisCierre = linea.includes(')');
    const tieneLlaveApertura = linea.includes('{');
    const tieneLlaveCierre = linea.includes('}');
    
    if (!tieneParentesisApertura) {
        errorMessage += "Falta '(' en la estructura. ";
    }
    if (!tieneParentesisCierre) {
        errorMessage += "Falta ')' en la estructura. ";
    }
    if (!tieneLlaveApertura) {
        errorMessage += "Falta '{' en la estructura. ";
    }

    // Dividimos la línea por sus partes esperadas
    const partes = linea.match(/^entei\s*\(\s*([^;]+);\s*([^;]+);\s*([^)]+)\s*\)\s*{\s*$/);
    if (partes) {
        const [_, init, condition, increment] = partes;

        // Verificamos cada parte
        if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*\d+$/.test(init.trim())) {
            errorMessage += "La inicialización está mal formada. Debe ser 'identificador = número'. ";
        }
        if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*\s*<=\s*\d+$/.test(condition.trim())) {
            errorMessage += "La condición está mal formada. Debe ser 'identificador <= número'. ";
        }
        if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*\s*\+\+$/.test(increment.trim())) {
            errorMessage += "La actualización está mal formada. Debe ser 'identificador++'. ";
        }
    } else {
        errorMessage += "La estructura general está mal formada. ";
    }
    
    return errorMessage;
}

function obtenerDetalleErrorVariable(linea, regex, keyword, numeroLinea) {
    let errorMessage = `Error en la línea ${numeroLinea}: declaración de '${keyword}' mal formada. `;
    
    if (!linea.includes(';')) {
        errorMessage += "Falta ';' al final de la declaración. ";
    } else {
        const partes = linea.split(/\s+/).filter(Boolean);
        if (partes.length < 2) {
            errorMessage += "Declaración incompleta. Falta el identificador. ";
        } else if (partes.length > 2 && !partes[2].includes('=')) {
            errorMessage += "Declaración incorrecta. Falta '=' para asignación. ";
        }
    }
    
    return errorMessage;
}

function obtenerDetalleErrorConst(linea, keyword, numeroLinea) {
    let errorMessage = `Error en la línea ${numeroLinea}: declaración de '${keyword}' mal formada. `;
    
    if (!linea.includes('=')) {
        errorMessage += "Falta '=' en la declaración de constante. ";
    } else if (!linea.endsWith(';')) {
        errorMessage += "Falta ';' al final de la declaración. ";
    }
    
    return errorMessage;
}

function analyzeSyntax(code) {
    const lines = code.split('\n'); // Divide el código en líneas
    let errores = []; // Almacena los errores encontrados
    let isCorrect = true; // Indica si el código es sintácticamente correcto
    let stack = []; // Pila para manejar las estructuras anidadas
    let resultado = []; // Almacena las estructuras correctas

    // Definición de las estructuras a analizar
    const structures = [
        {
            keyword: "entei", // Palabra clave para la estructura
            regex: /^entei\s*\(\s*[^;]+;\s*[^;]+;\s*[^)]+\s*\)\s*{$/, // Expresión regular para validar la sintaxis
            startLine: null, // Línea donde comienza la estructura
            endLine: null, // Línea donde termina la estructura
            errorMessage: "Error en la estructura 'entei' en la línea"
        },
        {
            keyword: "master", // Equivalente a "block"
            regex: /^master\s+[a-zA-Z][a-zA-Z0-9]*\s+[a-zA-Z][a-zA-Z0-9]*\s*(\(\s*[^)]*\s*\))?\s*{$/, // Expresión regular para validar la declaración de master
            startLine: null,
            endLine: null,
            errorMessage: "Error en la estructura 'master' en la línea"
        },
        {
            keyword: "slow",
            regex: /^slow\s*\(\s*[^)]+\s*\)\s*{$/,
            startLine: null,
            endLine: null,
            errorMessage: "Error en la estructura 'slow' en la línea"
        },
        {
            keyword: "klink",
            regex: /^klink\s*\(\s*[^)]+\s*\)\s*{$/,
            startLine: null,
            endLine: null,
            errorMessage: "Error en la estructura 'klink' en la línea"
        },
        {
            keyword: "ditto",
            regex: /^ditto\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*{$/,
            startLine: null,
            endLine: null,
            errorMessage: "Error en la estructura 'ditto' en la línea"
        },
        {
            keyword: "margcargo",
            regex: /^margcargo\s*{\s*marg\s*{\s*[^}]*\s*}\s*cargo\s*\(\s*[^)]+\s*\)\s*{\s*[^}]*\s*}\s*}$/,
            startLine: null,
            endLine: null,
            errorMessage: "Error en la estructura 'margcargo' en la línea"
        },
        {
            keyword: "eclosion",
            regex: /^eclosion\s+[^;]+;$/,
            startLine: null,
            endLine: null,
            errorMessage: "Error en la estructura 'eclosion' en la línea"
        },
        {
            keyword: "contraataque",
            regex: /^contraataque\s+[^;]+;$/,
            startLine: null,
            endLine: null,
            errorMessage: "Error en la estructura 'contraataque' en la línea"
        },
        {
            keyword: "antidoto",
            regex: /^antidoto;$/,
            startLine: null,
            endLine: null,
            errorMessage: "Error en la estructura 'antidoto' en la línea"
        },
        {
            keyword: "veneno",
            regex: /^veneno;$/,
            startLine: null,
            endLine: null,
            errorMessage: "Error en la estructura 'veneno' en la línea"
        },
        {
            keyword: "silvally",
            regex: /^silvally\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s+extends\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*{$/,
            startLine: null,
            endLine: null,
            errorMessage: "Error en la estructura 'silvally' en la línea"
        },
        {
            keyword: "bici",
            regex: /^bici\s*\.[a-zA-Z_$][a-zA-Z0-9_$]*\s*\(\s*\)\s*;$/,
            startLine: null,
            endLine: null,
            errorMessage: "Error en la estructura 'bici' en la línea"
        },
        {
            keyword: "throh",
            regex: /^throh\s*\([^)]*\)\s*thro\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*{\s*[^}]*\s*}$/,
            startLine: null,
            endLine: null,
            errorMessage: "Error en la estructura 'throh' en la línea"
        },
        {
            keyword: "arceus",
            regex: /^arceus\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*;$/,
            startLine: null,
            endLine: null,
            errorMessage: "Error en la estructura 'arceus' en la línea"
        },
        {
            keyword: "xatu",
            regex: /^xatu\s*\.[a-zA-Z_$][a-zA-Z0-9_$]*\s*;$/,
            startLine: null,
            endLine: null,
            errorMessage: "Error en la estructura 'xatu' en la línea"
        },
        {
            keyword: "klank",
            regex: /^klank\s*{\s*[^}]*\s*}$/,
            startLine: null,
            endLine: null,
            errorMessage: "Error en la estructura 'klank' en la línea"
        },
        {
            keyword: "klang-klink",
            regex: /^klang\s*{\s*[^}]*\s*}\s*klink\s*\(\s*[^)]+\s*\)\s*;$/,
            startLine: null,
            endLine: null,
            errorMessage: "Error en la estructura 'klang-klink' en la línea"
        },
        {
            keyword: "poke",
            regex: /^poke\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*{\s*[^}]*\s*}$/,
            startLine: null,
            endLine: null,
            errorMessage: "Error en la estructura 'poke' en la línea"
        },
        {
            keyword: "super",
            regex: /^super\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*{\s*[^}]*\s*}$/,
            startLine: null,
            endLine: null,
            errorMessage: "Error en la estructura 'super' en la línea"
        },
        {
            keyword: "ultra",
            regex: /^ultra\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*{\s*[^}]*\s*}$/,
            startLine: null,
            endLine: null,
            errorMessage: "Error en la estructura 'ultra' en la línea"
        },
        {
            keyword: "movimiento",
            regex: /^movimiento\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*{\s*[^}]*\s*}$/,
            startLine: null,
            endLine: null,
            errorMessage: "Error en la estructura 'movimiento' en la línea"
        },
        {
            keyword: "starly",
            regex: /^starly\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*{\s*[^}]*\s*}$/,
            startLine: null,
            endLine: null,
            errorMessage: "Error en la estructura 'starly' en la línea"
        },
        {
            keyword: "king",
            regex: /^king\s*{\s*[^}]*\s*}$/,
            startLine: null,
            endLine: null,
            errorMessage: "Error en la estructura 'king' en la línea"
        },
        {
            keyword: "bro",
            regex: /^bro\s*\([^)]*\)\s*{\s*[^}]*\s*}$/,
            startLine: null,
            endLine: null,
            errorMessage: "Error en la estructura 'bro' en la línea"
        },
        {
            keyword: "pikachu",
            regex: /^pikachu\s*\([^)]*\)\s*{\s*[^}]*\s*}$/,
            startLine: null,
            endLine: null,
            errorMessage: "Error en la estructura 'pikachu' en la línea"
        },
        {
            keyword: "pika",
            regex: /^pika\s+[^:]+:\s*$/,
            startLine: null,
            endLine: null,
            errorMessage: "Error en la estructura 'pika' en la línea"
        },
        {
            keyword: "chispa",
            regex: /^chispa\s*:\s*$/,
            startLine: null,
            endLine: null,
            errorMessage: "Error en la estructura 'chispa' en la línea"
        },
        {
            keyword: "chu",
            regex: /^chu\s*;$/,
            startLine: null,
            endLine: null,
            errorMessage: "Error en la estructura 'chu' en la línea"
        }
    ];

    // Definición de las declaraciones de variables a analizar
    const variableDeclarations = [
        {
            keyword: "roca", // Equivalente a "int"
            regex: /^roca\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*(=\s*[^;]+)?\s*;\s*.*$/, // Expresión regular para validar la declaración de int
            errorMessage: "Error en la declaración de 'roca' en la línea"
        },
        {
            keyword: "agua", // Equivalente a "float"
            regex: /^agua\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*(=\s*[^;]+)?\s*;\s*.*$/, // Expresión regular para validar la declaración de float
            errorMessage: "Error en la declaración de 'agua' en la línea"
        },
        {
            keyword: "acero", // Equivalente a "string"
            regex: /^acero\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*(=\s*[^;]+)?\s*;\s*.*$/, // Expresión regular para validar la declaración de string
            errorMessage: "Error en la declaración de 'acero' en la línea"
        },
        {
            keyword: "fuego", // Equivalente a "char"
            regex: /^fuego\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*(=\s*[^;]+)?\s*;\s*.*$/, // Expresión regular para validar la declaración de char
            errorMessage: "Error en la declaración de 'fuego' en la línea"
        },
        {
            keyword: "doublade", // Equivalente a "double"
            regex: /^doublade\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*(=\s*[^;]+)?\s*;\s*.*$/, // Expresión regular para validar la declaración de double
            errorMessage: "Error en la declaración de 'doublade' en la línea"
        },
        {
            keyword: "kakuna", // Equivalente a "long"
            regex: /^kakuna\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*(=\s*[^;]+)?\s*;\s*.*$/, // Expresión regular para validar la declaración de long
            errorMessage: "Error en la declaración de 'kakuna' en la línea"
        },
        {
            keyword: "hada", // Equivalente a "byte"
            regex: /^hada\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*(=\s*[^;]+)?\s*;\s*.*$/, // Expresión regular para validar la declaración de byte
            errorMessage: "Error en la declaración de 'hada' en la línea"
        },
        {
            keyword: "minun", // Equivalente a "short"
            regex: /^minun\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*(=\s*[^;]+)?\s*;\s*.*$/, // Expresión regular para validar la declaración de short
            errorMessage: "Error en la declaración de 'minun' en la línea"
        }
    ];        

    // Definición de las declaraciones de constantes a analizar
    const constDeclarations = [
        {
            keyword: "eter", // Equivalente a "const"
            regex: /^eter\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*[^;]+\s*;$/, // Expresión regular para validar la declaración de const
            errorMessage: "Error en la declaración de 'eter' en la línea"
        }
    ];

    // Definición de las estructuras complejas a analizar
    const complexStructures = [
        {
            keyword: "onix", // Equivalente a "array"
            regex: /^onix\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*\[\s*\]\s*(=\s*\{[^}]*\}\s*)?;$/, // Expresión regular para validar la declaración de array
            errorMessage: "Error en la estructura 'onix' en la línea"
        },
        {
            keyword: "combee", // Equivalente a "enum"
            regex: /^combee\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*{\s*([^}]+)\s*};$/, // Expresión regular para validar la declaración de enum
            errorMessage: "Error en la estructura 'combee' en la línea"
        },
        {
            keyword: "alakazam", // Equivalente a "object"
            regex: /^alakazam\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*\{\s*([^}]+)\s*\};$/, // Expresión regular para validar la declaración de object
            errorMessage: "Error en la estructura 'alakazam' en la línea"
        }
    ];

    // Definición de las estructuras de print y println a analizar
    const printStatements = [
        {
            keyword: "grunido", // Equivalente a "print"
            regex: /^grunido\s*\([^)]*\)\s*;$/, // Expresión regular para validar la sintaxis de print
            errorMessage: "Error en la declaración de 'grunido' en la línea"
        },
        {
            keyword: "mordisco", // Equivalente a "println"
            regex: /^mordisco\s*\([^)]*\)\s*;$/, // Expresión regular para validar la sintaxis de println
            errorMessage: "Error en la declaración de 'mordisco' en la línea"
        }
    ];

    // Itera sobre cada línea del código
    lines.forEach((line, index) => {
        const trimmedLine = line.trim(); // Elimina espacios en blanco al inicio y final de la línea

        let matched = false; // Indica si la línea coincide con alguna estructura o declaración de variable

        // Verifica si la línea coincide con alguna estructura
        structures.forEach(structure => {
            if (trimmedLine.startsWith(structure.keyword)) { // Verifica si la línea comienza con la palabra clave de una estructura
                matched = true;
                if (structure.startLine === null) { // Marca la línea de inicio de la estructura
                    structure.startLine = index + 1;
                }
                if (!structure.regex.test(trimmedLine)) { // Verifica si la línea cumple con la sintaxis de la estructura
                    isCorrect = false;
                    const errorMessage = `${structure.errorMessage} ${index + 1}.`;
                    errores.push(new Token(TokenType.ERROR, errorMessage, index + 1));
                } else {
                    stack.push(structure.keyword); // Añade la palabra clave a la pila
                }
            }
        });

        // Verifica si la línea coincide con alguna declaración de variable
        variableDeclarations.forEach(declaration => {
            if (trimmedLine.startsWith(declaration.keyword)) {
                matched = true;
                if (!declaration.regex.test(trimmedLine)) { // Verifica si la línea cumple con la sintaxis de la declaración de variable
                    isCorrect = false;
                    const errorMessage = `${declaration.errorMessage} ${index + 1}.`;
                    errores.push(new Token(TokenType.ERROR, errorMessage, index + 1));
                } else {
                    resultado.push(new Token(TokenType.ESTRUCTURA, `Declaración de '${declaration.keyword}' correcta en la línea ${index + 1}.`, index + 1));
                }
            }
        });

        // Verifica si la línea coincide con alguna declaración de constante
        constDeclarations.forEach(declaration => {
            if (trimmedLine.startsWith(declaration.keyword)) {
                matched = true;
                if (!declaration.regex.test(trimmedLine)) { // Verifica si la línea cumple con la sintaxis de la declaración de constante
                    isCorrect = false;
                    const errorMessage = `${declaration.errorMessage} ${index + 1}.`;
                    errores.push(new Token(TokenType.ERROR, errorMessage, index + 1));
                } else {
                    resultado.push(new Token(TokenType.ESTRUCTURA, `Declaración de '${declaration.keyword}' correcta en la línea ${index + 1}.`, index + 1));
                }
            }
        });

        // Verifica si la línea coincide con alguna estructura compleja
        complexStructures.forEach(structure => {
            if (trimmedLine.startsWith(structure.keyword)) {
                matched = true;
                if (!structure.regex.test(trimmedLine)) { // Verifica si la línea cumple con la sintaxis de la estructura compleja
                    isCorrect = false;
                    const errorMessage = `${structure.errorMessage} ${index + 1}.`;
                    errores.push(new Token(TokenType.ERROR, errorMessage, index + 1));
                } else {
                    resultado.push(new Token(TokenType.ESTRUCTURA, `Declaración de '${structure.keyword}' correcta en la línea ${index + 1}.`, index + 1));
                }
            }
        });

        // Verifica si la línea coincide con alguna declaración de print o println
        printStatements.forEach(statement => {
            if (trimmedLine.startsWith(statement.keyword)) {
                matched = true;
                if (!statement.regex.test(trimmedLine)) { // Verifica si la línea cumple con la sintaxis de print o println
                    isCorrect = false;
                    const errorMessage = `${statement.errorMessage} ${index + 1}.`;
                    errores.push(new Token(TokenType.ERROR, errorMessage, index + 1));
                } else {
                    resultado.push(new Token(TokenType.ESTRUCTURA, `Declaración de '${statement.keyword}' correcta en la línea ${index + 1}.`, index + 1));
                }
            }
        });

        // Verifica si la línea es una llave de cierre
        if (!matched && trimmedLine === "}") {
            if (stack.length === 0) { // Si la pila está vacía, hay una llave de cierre inesperada
                isCorrect = false;
                errores.push(new Token(TokenType.ERROR, `Error en la línea ${index + 1}: '}' inesperado.`, index + 1));
            } else {
                const lastKeyword = stack.pop(); // Saca la última palabra clave de la pila
                const structure = structures.find(s => s.keyword === lastKeyword); // Encuentra la estructura correspondiente
                structure.endLine = index + 1; // Marca la línea de cierre de la estructura
                resultado.push(new Token(TokenType.ESTRUCTURA, `Estructura '${structure.keyword}' correcta. Comienza en la línea ${structure.startLine} y finaliza en la línea ${structure.endLine}.`, structure.startLine));
            }
        }
    });

    return { resultado, errores };
}

function limpiarTablas() {
    document.getElementById('tokensTable').querySelector('tbody').innerHTML = '';
    document.getElementById('lexicalErrorsTable').querySelector('tbody').innerHTML = '';
    document.getElementById('syntacticErrorsTable').querySelector('tbody').innerHTML = '';
    document.getElementById('syntacticOutput').innerHTML = '';
}

function compile() {
    console.log("Compilando...");
    limpiarTablas();
    const codeInput = document.getElementById('codeInput').value;
    const tokens = lex(codeInput);
    console.log("Tokens:", tokens);

    const { resultado, errores } = analyzeSyntax(codeInput);
    console.log("Resultado Sintáctico:", resultado);
    console.log("Errores Sintácticos:", errores);

    mostrarTokens(tokens);
    mostrarErroresLexicos(tokens);
    mostrarResultadoSintactico(resultado);
    mostrarErroresSintacticos(errores);

    if (errores.length === 0) {
        showView('syntacticAnalysis');
    } else {
        showView('syntacticErrorsTable');
    }
}

function showView(viewId) {
    document.getElementById('tokensTable').style.display = 'none';
    document.getElementById('lexicalErrorsTable').style.display = 'none';
    document.getElementById('syntacticErrorsTable').style.display = 'none';
    document.getElementById('syntacticAnalysis').style.display = 'none';
    document.getElementById(viewId).style.display = 'block';
}