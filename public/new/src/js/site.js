
/**
 * Handles document scroll event
 * @param {event} event scroll event
 * @returns {undefined}
 */
const documentScrollHandler = function (event) {
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
$(document).ready(function () {
    $(document).scroll(documentScrollHandler);
});