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

module.exports = isValidText;