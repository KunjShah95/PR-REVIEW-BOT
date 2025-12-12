
function complexFunction(a, b, c) {
    if (a) {
        if (b) {
            if (c) {
                console.log('Deeply nested');
            }
        }
    }

    var x = 1; // minor issue
    var x = 2; // duplication/shadowing potentially or re-declaration

    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            for (var k = 0; k < 10; k++) {
                console.log(i, j, k);
            }
        }
    }
}

// Duplicated code block
function anotherComplexFunction(a, b, c) {
    if (a) {
        if (b) {
            if (c) {
                console.log('Deeply nested');
            }
        }
    }
}
