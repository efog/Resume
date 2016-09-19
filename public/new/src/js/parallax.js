$(document).ready(function(event) {
    const states = [];
    for (var index = 0; index < $('.parallax').length; index++) {
        const area = $($('.parallax')[index]);
        const bgImage = area.attr('data-background-image');
        const initialScrollPosition = area.attr('data-initial-background-pos');
        if (bgImage && initialScrollPosition) {
            const parallax = {
                '_resizeTimeout': null,
                'area': area,
                'backgroundInitialPosition': new RegExp(/\s\d+/g).exec(initialScrollPosition)[0],
                'backgroundImage': bgImage,
                'backgroundPosition': new RegExp(/\s\d+/g).exec(initialScrollPosition)[0]
            };
            const scroll = function(scrollEvt) {
                const docHeight = $(document).height();
                const offset = $(scrollEvt.target).scrollTop() * 3;
                const minimumOffset = parallax.backgroundInitialPosition;
                const maximumOffset = 90;
                const newOffset = minimumOffset - (maximumOffset - minimumOffset) * (offset / docHeight);
                parallax.backgroundPosition = newOffset > maximumOffset ? maximumOffset : newOffset;
                area.css('background-position', `0% ${new RegExp(/\d+/g).exec(parallax.backgroundPosition)[0]}%`);
            };
            const resize = function() {
                if (parallax._resizeTimeout) {
                    clearTimeout(parallax._resizeTimeout);
                }
                parallax._resizeTimeout = setTimeout(function() {
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    let newVal = '';
                    if (area.width() < parallax.backgroundImage.width) {
                        canvas.width = area.width();
                        canvas.height = parallax.backgroundImage.height;

                        const sX = (parallax.backgroundImage.width - canvas.width) / 2;
                        const sY = 0;
                        const sW = canvas.width;
                        const sH = parallax.backgroundImage.height;
                        const dX = 0;
                        const dY = 0;
                        const dW = canvas.width;
                        const dH = parallax.backgroundImage.height;

                        context.drawImage(parallax.backgroundImage, sX, sY, sW, sH, dX, dY, dW, dH);
                    }
                    else {
                        canvas.width = parallax.backgroundImage.width;
                        canvas.height = parallax.backgroundImage.height;
                        context.drawImage(parallax.backgroundImage, 0, 0, parallax.backgroundImage.width, parallax.backgroundImage.height);
                    }
                    newVal = `${canvas.toDataURL()}`;
                    const background = `background-image: url(${newVal})`;
                    area.attr('style', background);
                }, 50);
            };
            const image = new Image();
            image.onload = function() {
                parallax.backgroundImage = image;
                resize();
                area.addClass('visible');
                area.removeClass('hidden');
            };
            image.src = parallax.backgroundImage;
            $(window).resize(resize);
            $(document).scroll(scroll);
        }
    }
});