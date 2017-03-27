$(document).ready(function (event) {
    let selectedIndex = 0;
    let stories = null;

    /**
     * Transition from index to index
     * @param {number} from index to start from
     * @param {number} to index to go to
     * @returns {undefined}
     */
    const slide = (from, to) => {
        const width = stories[from || 0].width();
        const fromRight = width * (from > to ? -1 : 1);
        stories[from || 0].removeClass('visible');
        stories[to].addClass('visible');
        stories[from || 0].css('right', fromRight);
        stories[to].css('right', 0);
        selectedIndex = to;
    };

    /**
     * Setup control
     * @returns {undefined}
     */
    const setup = () => {
        stories = [];
        selectedIndex = 0;
        var storyElems = $('.story');
        for (let idx = 0; idx < storyElems.length; idx++) {
            const storyElem = $(storyElems[idx]);
            storyElem.css('right', storyElem.width() * -1);
            storyElem.attr('data-story-index', idx);
            stories.push(storyElem);
        }
        slide(null, 0);
    };

    /**
     * Handles window resizing
     * @param {event} resizeEvent resize event
     * @returns {undefined}
     */
    const resizeHandler = (resizeEvent) => {
    };

    const storyClick = (clickEvent) => {
        clickEvent.preventDefault();
        const storyName = $(clickEvent.target).attr('data-story');
        const current = selectedIndex;
        const target = parseInt($(`.story[data-story=${storyName}]`).attr('data-story-index'), 10);
        slide(current, target);
    };

    $('#story-list a').click(storyClick);
    $(window).resize(resizeHandler);

    setup();
});