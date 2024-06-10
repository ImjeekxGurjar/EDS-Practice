// Converts variant classes to BEM format
function variantsClassesToBEM(classList, variantClasses, blockName) {
    variantClasses.forEach((variantClass) => {
        if (classList.contains(variantClass)) {
            classList.remove(variantClass);
            classList.add(`${blockName}--${variantClass}`);
        }
    });
}

// Creates a video element
function createVideo(url, className, attributes = {}) {
    console.log(url);
    console.log('Creating video element with URL:', url); // Debug log
    const video = document.createElement('video');
    video.className = className;
    
    Object.keys(attributes).forEach((attr) => {
        video[attr] = attributes[attr];
    });
    const source = document.createElement('source');
    console.log(source);
    source.src = url;
    source.type = 'video/mp4';
    video.appendChild(source);
    console.log('Video element created:', video.outerHTML); // Debug log

    return video;
}

// Sets playback controls for the video
function setPlaybackControls() {
    // Implement playback controls setup here
}

// Handles hover or scroll behavior
function onHoverOrScroll(element, handler) {
    let isInViewport = false;
    let isMouseOver = false;
    const onChange = () => {
        handler(isInViewport || isMouseOver);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                isInViewport = entry.intersectionRatio >= 0.5;
                onChange();
            }
        });
    }, {
        threshold: [0.4, 0.5, 0.6],
    });
    observer.observe(element);

    element.addEventListener('mouseover', () => {
        isMouseOver = true;
        onChange();
    });

    element.addEventListener('mouseout', () => {
        isMouseOver = false;
        onChange();
    });
}

// Removes empty tags from the block
function removeEmptyTags(block) {
    const elements = block.querySelectorAll('*:empty');
    elements.forEach(element => element.remove());
}

const variantClasses = ['expanding'];
export default async function decorate(block) {
    const blockName = 'v2-video';
    const videoLink = block.querySelector('a');
    const headings = block.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const ctaButtons = block.querySelectorAll('.button-container a');
    const contentWrapper = block.querySelector(':scope > div');
    const content = block.querySelector(':scope > div > div');

    variantsClassesToBEM(block.classList, variantClasses, blockName);

    if (!videoLink) {
        console.warn('Video for v2-video block is required and not provided. The block will not render!');
        block.innerHTML = ''; // Clear block content if video link is not found
        return; // Exit function early if no video link is found
    }

    const videoURL = videoLink.getAttribute('href');
    console.log(videoURL);
    if (!videoURL || videoURL.trim() === '') {
        console.warn('Video URL is empty. The video element will not be created.');
        videoLink.remove();
        return;
    }

    const video = createVideo(videoURL, `${blockName}__video`, {
        src:videoURL,
        muted: true,
        autoplay: true,
        loop: true,
        playsinline: true,
        style: "width: 100%; height: auto; border: 1px solid red;" // Temporary inline styles for debugging
    });

    contentWrapper.classList.add(`${blockName}__content-wrapper`);
    content.classList.add(`${blockName}__content`);
    [...headings].forEach((heading) => heading.classList.add(`${blockName}__heading`));
    [...ctaButtons].forEach((button) => {
        button.classList.add(`${blockName}__button`, 'dark');
    });

    videoLink.remove();

    block.prepend(video);

    setPlaybackControls();

    removeEmptyTags(block);

    if (contentWrapper.innerHTML.trim().length === 0) {
        contentWrapper.remove();
    }

    if (block.classList.contains(`${blockName}--expanding`)) {
        onHoverOrScroll(block, (val) => {
            const action = val ? 'add' : 'remove';
            block.classList[action](`${blockName}--full-width`);
        });
    } else {
        block.classList.add(`${blockName}--full-width`);
    }
    
    // Debugging: Log the final HTML of the block
    console.log('Final block HTML:', block.outerHTML);
}
