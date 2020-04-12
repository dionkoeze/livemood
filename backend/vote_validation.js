function isValidText(text) {
    if (text.length > 20) {
        return false;
    }

    if (! /\S/.test(text)) {
        return false;
    }

    if (/<.*>/.test(text)) {
        return false;
    }

    return true;
}

function isValidName(name) {
    if (name.length > 10) {
        return false;
    }

    if (! /\S/.test(name)) {
        return false;
    }

    if (/<.*>/.test(name)) {
        return false;
    }

    return true;
}

module.exports = {
    isValidText,
    isValidName,
};
