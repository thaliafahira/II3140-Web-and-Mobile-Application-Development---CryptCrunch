document.getElementById('cryptarithm-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const word1 = document.getElementById('word1').value.toUpperCase();
    const word2 = document.getElementById('word2').value.toUpperCase();
    const result = document.getElementById('result').value.toUpperCase();

    if (validateInput(word1, word2, result)) {
        const solution = solveCryptarithm(word1, word2, result);
        displaySolution(solution);
    } else {
        displayError('Invalid input. Please ensure the words are valid and of correct lengths.');
    }
});

function validateInput(word1, word2, result) {
    const allWords = [word1, word2, result];
    const isAlpha = (word) => /^[A-Z]+$/.test(word);
    return allWords.every(isAlpha);
}

function displaySolution(solution) {
    const outputDiv = document.getElementById('output');
    if (solution) {
        outputDiv.innerHTML = `<p>Solution Found: ${JSON.stringify(solution)}</p>`;
    } else {
        outputDiv.innerHTML = `<p>No solution found.</p>`;
    }
}

function displayError(message) {
    document.getElementById('output').innerHTML = `<p style="color: red;">${message}</p>`;
}


function solveCryptarithm(word1, word2, result) {
    const uniqueLetters = getUniqueLetters([word1, word2, result]);
    if (uniqueLetters.length > 10) {
        return null; 
    }

    const permutations = getPermutations('0123456789', uniqueLetters.length);

    for (let perm of permutations) {
        const letterToDigit = {};
        for (let i = 0; i < uniqueLetters.length; i++) {
            letterToDigit[uniqueLetters[i]] = perm[i];
        }

        const num1 = parseWordAsNumber(word1, letterToDigit);
        const num2 = parseWordAsNumber(word2, letterToDigit);
        const resultNum = parseWordAsNumber(result, letterToDigit);

        if (num1 + num2 === resultNum) {
            return letterToDigit;
        }
    }
    return null;
}


function getUniqueLetters(words) {
    const letterSet = new Set();
    words.forEach(word => {
        for (let letter of word) {
            letterSet.add(letter);
        }
    });
    return Array.from(letterSet);
}


function parseWordAsNumber(word, letterToDigit) {
    return parseInt(word.split('').map(letter => letterToDigit[letter]).join(''), 10);
}

function getPermutations(str, length) {
    if (length === 1) {
        return str.split('');
    }

    const perms = [];
    for (let i = 0; i < str.length; i++) {
        const remaining = str.slice(0, i) + str.slice(i + 1);
        const remainingPerms = getPermutations(remaining, length - 1);
        for (let perm of remainingPerms) {
            perms.push(str[i] + perm);
        }
    }
    return perms;
}
