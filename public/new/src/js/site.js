const documentState = {
    '_personaBackgroundInitialPosition': 0
};

/**
 * Scrolls persona image
 * @param {event} event scroll event
 * @returns {undefined}
 */
const scrollPersona = (event) => {
    const docHeight = documentState.height;
    const offset = $(event.target).scrollTop() * 3;
    const minimumOffset = documentState.personaBackgroundInitialPosition;
    const maximumOffset = 90;
    const newOffset = minimumOffset - (maximumOffset - minimumOffset) * (offset / docHeight);
    documentState.personaBackgroundPosition = newOffset > maximumOffset ? maximumOffset : newOffset;
};

/**
 * Handles document scroll event
 * @param {event} event scroll event
 * @returns {undefined}
 */
const documentScrollHandler = (event) => {
    scrollPersona(event);
    if ($(event.target).scrollTop() > 5) {
        $('#full-header').addClass('minimized');
        $('#small-header').removeClass('minimized');
    }
    else {
        $('#full-header').removeClass('minimized');
        $('#small-header').addClass('minimized');
    }
};

// Document loaded
$(document).ready(() => {
    Object.defineProperties(documentState, {
        'height': {
            'get': () => {
                return $(document).height();
            }
        },
        'headHeight': {
            'get': () => {
                return $('#head').height();
            },
            'set': (value) => {
                $('#head').height(value);
            }
        },
        'personaBackgroundHeight': {
            'get': () => {
                return $('#persona').height();
            },
            'set': (value) => {
                $('#persona').height(value);
            }
        },
        'personaBackgroundInitialPosition': {
            'get': () => {
                return this._personaBackgroundInitialPosition;
            },
            'set': (value) => {
                this._personaBackgroundInitialPosition = parseInt(value, 10);
            }
        },
        'personaBackgroundPosition': {
            'get': () => {
                return new RegExp('[0-9]+').exec($('#persona').css('background-position-y'))[0];
            },
            'set': (value) => {
                $('#persona').css('background-position-y', `${new RegExp('[0-9]+').exec(value)[0]}%`);
            }
        },
        'personaHeight': {
            'get': () => {
                return $('#persona').height();
            },
            'set': (value) => {
                $('#persona').height(value);
            }
        }
    });
    documentState.personaBackgroundInitialPosition = new RegExp('[0-9]+').exec($('#persona').css('background-position-y'))[0];
    $(document).scroll(documentScrollHandler);
});