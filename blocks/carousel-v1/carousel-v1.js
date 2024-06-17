export default async function decorate(block) {
    initializeCarousels();
}

function initializeCarousels() {
    const mainElement = document.querySelector('main');
    const carouselContainers = mainElement.querySelectorAll('.carousel-v1-container');

    carouselContainers.forEach(carouselContainer => {
        const targetId = carouselContainer.getAttribute('data-teaser-target-id');
        const teaserContainers = mainElement.querySelectorAll(`.teaser-container[data-teaser-target-id="${targetId}"]`);

        if (teaserContainers.length > 1) {
            createCarousel(mainElement, carouselContainer, teaserContainers, targetId);
        }
    });
}

function createCarousel(mainElement, carouselContainer, teaserContainers, targetId) {
    const carouselWrapper = document.createElement('div');
    carouselWrapper.className = 'carousel-wrapper';
    carouselWrapper.setAttribute('data-teaser-target-id', targetId);

    teaserContainers.forEach(container => {
        carouselWrapper.appendChild(container);
        container.style.display = 'none';
    });

    mainElement.appendChild(carouselWrapper);

    createCarouselControls(carouselWrapper);
    createNavigationDots(carouselWrapper); // New function call to create navigation dots
    displaySlide(carouselWrapper, 0);

    // Start the interval timer based on data-timing attribute or default timer
    const timingAttribute = carouselContainer.getAttribute('data-timing');
    const timerInterval = parseTimingAttribute(timingAttribute);
    startSlideInterval(carouselWrapper, timerInterval);
}

function createCarouselControls(carouselWrapper) {
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'carousel-controls';

    const leftControl = document.createElement('button');
    leftControl.className = 'carousel-control left';
    leftControl.innerHTML = '&#10094;';
    leftControl.addEventListener('click', () => {
        slideCarousel(carouselWrapper, -1);
        resetSlideInterval(carouselWrapper);
    });

    const rightControl = document.createElement('button');
    rightControl.className = 'carousel-control right';
    rightControl.innerHTML = '&#10095;';
    rightControl.addEventListener('click', () => {
        slideCarousel(carouselWrapper, 1);
        resetSlideInterval(carouselWrapper);
    });

    controlsContainer.appendChild(leftControl);
    controlsContainer.appendChild(rightControl);

    carouselWrapper.appendChild(controlsContainer);
}

function createNavigationDots(carouselWrapper) {
    const teasers = carouselWrapper.querySelectorAll('.teaser-container');
    const dotContainer = document.createElement('div');
    dotContainer.className = 'carousel-dots';

    teasers.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = 'carousel-dot';
        dot.addEventListener('click', () => {
            displaySlide(carouselWrapper, index);
            resetSlideInterval(carouselWrapper);
        });
        dotContainer.appendChild(dot);
    });

    carouselWrapper.appendChild(dotContainer);
    updateNavigationDots(carouselWrapper, 0); // Initially highlight the first dot
}

function updateNavigationDots(carouselWrapper, currentIndex) {
    const dots = carouselWrapper.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
        if (index === currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

let currentSlideIndices = {};

function slideCarousel(carouselWrapper, direction) {
    const targetId = carouselWrapper.getAttribute('data-teaser-target-id');
    const teasers = carouselWrapper.querySelectorAll('.teaser-container');
    if (!(targetId in currentSlideIndices)) {
        currentSlideIndices[targetId] = 0;
    }

    let currentIndex = currentSlideIndices[targetId];
    currentIndex += direction;

    if (currentIndex >= teasers.length) {
        currentIndex = 0;
    } else if (currentIndex < 0) {
        currentIndex = teasers.length - 1;
    }

    currentSlideIndices[targetId] = currentIndex;
    displaySlide(carouselWrapper, currentIndex);
}

let slideInterval;

function startSlideInterval(carouselWrapper, interval) {
    slideInterval = setInterval(() => {
        slideCarousel(carouselWrapper, 1);
    }, interval);
}

function resetSlideInterval(carouselWrapper) {
    clearInterval(slideInterval);
    const timingAttribute = carouselWrapper.getAttribute('data-timing');
    const timerInterval = parseTimingAttribute(timingAttribute);
    startSlideInterval(carouselWrapper, timerInterval);
}

function displaySlide(carouselWrapper, index) {
    const teasers = carouselWrapper.querySelectorAll('.teaser-container');
    teasers.forEach((teaser, i) => {
        if (i === index) {
            // teaser.style.display = 'block';
            teaser.style.display = 'flex';
        } else {
            teaser.style.display = 'none';
        }
    });

    updateNavigationDots(carouselWrapper, index);
}

function parseTimingAttribute(timingAttribute) {
    if (!timingAttribute) {
        return 100000; // Default interval of 100 seconds
    }

    const match = timingAttribute.match(/^(\d+)\s*(sec|seconds)?$/i);
    if (!match) {
        console.warn(`Invalid data-timing attribute: ${timingAttribute}. Using default interval.`);
        return 100000; // Default interval if attribute format is invalid
    }

    const interval = parseInt(match[1], 10) * 1000; // Convert seconds to milliseconds
    return interval;
}
