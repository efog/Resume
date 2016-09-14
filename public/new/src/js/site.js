const documentState = {
    '_personaBackgroundInitialPosition': 0,
    '_personaBackgroundImage': null
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
 * Resizes persona background to maintain parrallax effect
 *
 * @returns {undefined}
 */
const resizePersonaBackgroundHandler = () => {

    if (documentState._resizeTimeout) {
        clearTimeout(documentState._resizeTimeout);
    }
    documentState._resizeTimeout = setTimeout(() => {
        const personaArea = $('#persona');
        const personaAreaSize = {
            'width': personaArea.width(),
            'height': personaArea.height()
        };
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        let newVal = '';
        const image = documentState.personaBackgroundImage;
        if (personaAreaSize.width < image.width) {
            canvas.width = personaAreaSize.width;
            canvas.height = image.height;

            const sX = (image.width - canvas.width) / 2;
            const sY = 0;
            const sW = canvas.width;
            const sH = image.height;
            const dX = 0;
            const dY = 0;
            const dW = canvas.width;
            const dH = image.height;

            context.drawImage(image, sX, sY, sW, sH, dX, dY, dW, dH);
        }
        else {
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0, image.width, image.height);
        }
        newVal = `${canvas.toDataURL()}`;
        const background = `background-image: url(${newVal})`;
        personaArea.attr('style', background);
    }, 50);

};

/**
 * Setup persona panel
 *
 * @returns {undefined}
 */
const setupPersonaPanel = () => {
    const personaArea = $('#persona');
    const image = new Image();
    image.onload = () => {
        documentState.personaBackgroundImage = image;
        resizePersonaBackgroundHandler();
        personaArea.addClass('visible');
        personaArea.removeClass('hidden');
    };
    image.src = documentState.personaBackgroundImage;
    $(window).resize(resizePersonaBackgroundHandler);
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
        'personaBackgroundImage': {
            'get': () => {
                return this._personaBackgroundImage;
            },
            'set': (value) => {
                this._personaBackgroundImage = value;
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
                return new RegExp(/\s\d+/g).exec($('#persona').css('background-position'))[0];
            },
            'set': (value) => {
                $('#persona').css('background-position', `0% ${new RegExp(/\d+/g).exec(value)[0]}%`);
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
    const personaArea = $('#persona');
    const bgImage = personaArea.attr('data-background-image');
    const initialScrollPosition = personaArea.attr('data-initial-background-pos');
    documentState.personaBackgroundInitialPosition = new RegExp(/\s\d+/g).exec(initialScrollPosition)[0];
    documentState.personaBackgroundImage = bgImage;
    $(document).scroll(documentScrollHandler);
    setupPersonaPanel();
});