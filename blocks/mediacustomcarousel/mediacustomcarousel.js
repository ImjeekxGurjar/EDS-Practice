
const blockName = 'mediacustomcarousel';
let currentIndex = 0;
export function isVedio(url){
    return url.match(/\.(mp4|webm|ogg)$/i);
}
 
export function replaceLinkWithVideo(wrapper){
    const link = wrapper.querySelector('p > a');
    if(link && isVedio(link.href)){
        const video = document.createElement('video');
        video.controls = true;
        video.src = link.href;
        video.title = link.title;
        // Replace the parent <p> with the <video>
        link.closest('p').replaceWith(video);
    }
}
 
export function customizeContentWrapper(wrapper){
    // Replace link with video if applicable
    replaceLinkWithVideo(wrapper);
 
    // Select all child elements of the wrapper
    const children = Array.from(wrapper.children);
    console.log(children.length);
 
    // Keep the first child in the current wrapper
    const firstChild = children.shift();
 
    // Create a common section for the new sections
    const commonSection = document.createElement('div');
    commonSection.classList.add('carousel-slide-content');
 
    // Iterate over remaining children
    children.forEach((child)=>{
        commonSection.appendChild(child);
    });
    wrapper.parentNode.insertBefore(commonSection, wrapper.nextSibling);
}
 
// taking value of attr
 function getAttrValue(name){
    const element = document.querySelector(`[data-${name}]`);
    return element ? element.getAttribute(`data-${name}`) :null;
 }
 
 
 async function getCarouselSlideContents() {
    try {
        await new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });
 
        const divElement = document.querySelectorAll('.v2-media');
        divElement.forEach((elm)=>{
    if (elm) {
            const carouselSlideContents = elm.querySelector('.carousel-slide-content');
            console.log(carouselSlideContents);
            if (carouselSlideContents) {
                const alignValue = elm.getAttribute('data-align');
                if (alignValue) {
                    carouselSlideContents.classList.add(alignValue);
                    console.log(`Added '${alignValue}' class to .carousel-slide-content`);
                } else {
                    console.log('data-align attribute is empty or undefined');
                }
 
                console.log(carouselSlideContents);
            } else {
                console.log('.carousel-slide-content not found within .v2-media');
            }
        } 
        })
    } catch (error) {
        console.error('Error:', error);
    }
}
 
export default function decorate(block) {
    console.log(block);
   
    const divElement = document.querySelector('.v2-media');
   
    const alignValue = divElement ? divElement.getAttribute('data-align') : null;
    if (alignValue !== null) {
        console.log(alignValue);
    } else {
        console.log('data-align attribute does not exist or is null');
    }
   
    const imageVedio = block.querySelector(':scope > div');
    imageVedio.classList.add(`${blockName}_container`);
    imageVedio.classList.add(`carousel-slides-container`);
    const contentItems = block.querySelectorAll(':scope > div > div');
    console.log(contentItems);
    contentItems.forEach((contentItem) => {
        contentItem.classList.add(`${blockName}__item`);
    });
   
    const wrappers = block.querySelectorAll('.default-content-wrapper');
    wrappers.forEach((wrapper)=>{
        customizeContentWrapper(wrapper);
    })
 
    const sourceContainer = block.querySelector('.mediacustomcarousel_container');
 
    // Create a new main-items container
    const mainItems = document.createElement('div');
    mainItems.classList.add('main-items');
 
    // Select all the items to be moved
    const itemsToMove = sourceContainer.querySelectorAll('.mediacustomcarousel__item');
 
    // Move each item from the source container to the new main-items container
    itemsToMove.forEach(item => {
        mainItems.appendChild(item);
    });
 
    // Append the new main-items container to the source container
    sourceContainer.appendChild(mainItems);
 
    // Create and append carousel navigation buttons
    const navButtons = document.createElement('div');
    navButtons.classList.add('carousel-navigation-buttons');
 
    const prevButton = document.createElement('button');
    prevButton.setAttribute('type', 'button');
    prevButton.classList.add('slide-prev');
    prevButton.setAttribute('aria-label', 'Previous Slide');
    navButtons.appendChild(prevButton);
 
    const nextButton = document.createElement('button');
    nextButton.setAttribute('type', 'button');
    nextButton.classList.add('slide-next');
    nextButton.setAttribute('aria-label', 'Next Slide');
    navButtons.appendChild(nextButton);
    const imageVideoContainer = block.querySelector('.mediacustomcarousel_container');
    // Insert navigation buttons after the main-items container
    imageVideoContainer.appendChild(navButtons);
 
    // create dots
    const dotContainer = document.createElement('ul');
    dotContainer.classList.add('carousel-dots');
    itemsToMove.forEach((item, index) => {
        const dot = document.createElement('li');
        dot.classList.add('carousel-dot');
        dot.addEventListener('click', () => {
            showItem(index);
        });
        dotContainer.appendChild(dot);
    });
 
    // Append dots container to carousel container
    imageVideoContainer.appendChild(dotContainer);
 
    // Function to handle showing items based on navigation
    function showItem(index) {
        currentIndex = index;
        itemsToMove.forEach((item, i) => {
            if (i === index) {
                item.style.display = 'block';
                dotContainer.children[i].classList.add('active');
            } else {
                item.style.display = 'none';
                dotContainer.children[i].classList.remove('active');
            }
        });
    }
   
 
    // Function for navigating to the next slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % itemsToMove.length;
        showItem(currentIndex);
    }
 
    // Function for navigating to the previous slide
    function prevSlide() {
        currentIndex = (currentIndex - 1 + itemsToMove.length) % itemsToMove.length;
        showItem(currentIndex);
    }
 
    // Event listeners for navigation buttons
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);
 
    // Function to automatically advance slides every 10 seconds
    function autoAdvance() {
        setInterval(() => {
            nextSlide();
        }, 60000); // 10 seconds interval
    }
 
    // Show the initial slide
    showItem(currentIndex);
    // Start auto-advance slides
    autoAdvance();
    getCarouselSlideContents();
}