import { fetchPlaceholders } from '../../scripts/aem.js';

let carouselId = 0;
let slideInterval;

function getdataattrvalue(name){
  const element = document.querySelector(`[data-${name}]`);
  return element ? element.getAttribute(`data-${name}`) : null;
}

const mediaCarouselTime = getdataattrvalue('media-carousel-interval');

function startSlideInterval(block, intervalDuration) {
  clearInterval(slideInterval);
  slideInterval = setInterval(() => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
  }, intervalDuration);
}

function updateActiveSlide(slide) {
  const block = slide.closest('.carousel');
  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  block.dataset.activeSlide = slideIndex;

  const slides = block.querySelectorAll('.carousel-slide');

  slides.forEach((aSlide, idx) => {
    aSlide.setAttribute('aria-hidden', idx !== slideIndex);
    aSlide.querySelectorAll('a').forEach((link) => {
      if (idx !== slideIndex) {
        link.setAttribute('tabindex', '-1');
      } else {
        link.removeAttribute('tabindex');
      }
    });
  });

  const indicators = block.querySelectorAll('.carousel-slide-indicator');
  indicators.forEach((indicator, idx) => {
    if (idx !== slideIndex) {
      indicator.querySelector('button').removeAttribute('disabled');
    } else {
      indicator.querySelector('button').setAttribute('disabled', 'true');
    }
  });

  startSlideInterval(block, block.dataset.slideInterval); // Restart interval with the specified duration
}

function showSlide(block, slideIndex = 0) {
  const slides = block.querySelectorAll('.carousel-slide');
  let realSlideIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
  if (slideIndex >= slides.length) realSlideIndex = 0;
  const activeSlide = slides[realSlideIndex];

  activeSlide.querySelectorAll('a').forEach((link) => link.removeAttribute('tabindex'));
  block.querySelector('.carousel-slides').scrollTo({
    top: 0,
    left: activeSlide.offsetLeft,
    behavior: 'smooth',
  });

  block.dataset.activeSlide = realSlideIndex;
  updateActiveSlide(activeSlide);
}

function bindEvents(block) {
  const slideIndicators = block.querySelector('.carousel-slide-indicators');
  if (!slideIndicators) return;

  slideIndicators.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const slideIndicator = e.currentTarget.parentElement;
      showSlide(block, parseInt(slideIndicator.dataset.targetSlide, 10));
    });
  });

  block.querySelector('.slide-prev').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) - 1);
  });
  block.querySelector('.slide-next').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
  });

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) updateActiveSlide(entry.target);
    });
  }, { threshold: 0.5 });
  block.querySelectorAll('.carousel-slide').forEach((slide) => {
    slideObserver.observe(slide);
  });

  startSlideInterval(block, block.dataset.slideInterval); // Start interval with the specified duration
}

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `carousel-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-slide');

  row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    column.classList.add(`carousel-slide-${colIdx === 0 ? 'image' : 'content'}`);
    slide.append(column);
  });

  const labeledBy = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (labeledBy) {
    slide.setAttribute('aria-labelledby', labeledBy.getAttribute('id'));
  }

  return slide;
}

function getSlideIntervalFromMeta() {
  const metaTag = mediaCarouselTime;
  
  // console.log(metaTag);
  if (metaTag) {
    const interval = parseInt(metaTag, 10);
    return !isNaN(interval) ? interval * 1000 : 10000; // Convert seconds to milliseconds
  }
  return 10000; // Default to 10 seconds
}

export default async function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `carousel-${carouselId}`);
  block.dataset.slideInterval = getSlideIntervalFromMeta();
  const rows = block.querySelectorAll(':scope > div');
  const isSingleSlide = rows.length < 2;

  const placeholders = await fetchPlaceholders();

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', placeholders.carousel || 'Carousel');

  const container = document.createElement('div');
  container.classList.add('carousel-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-slides');
  block.prepend(slidesWrapper);

  let slideIndicators;
  if (!isSingleSlide) {
    const slideIndicatorsNav = document.createElement('nav');
    slideIndicatorsNav.setAttribute('aria-label', placeholders.carouselSlideControls || 'Carousel Slide Controls');
    slideIndicators = document.createElement('ol');
    slideIndicators.classList.add('carousel-slide-indicators');
    slideIndicatorsNav.append(slideIndicators);
    block.append(slideIndicatorsNav);

    const slideNavButtons = document.createElement('div');
    slideNavButtons.classList.add('carousel-navigation-buttons');
    slideNavButtons.innerHTML = `
      <button type="button" class="slide-prev" aria-label="${placeholders.previousSlide || 'Previous Slide'}"></button>
      <button type="button" class="slide-next" aria-label="${placeholders.nextSlide || 'Next Slide'}"></button>
    `;

    container.append(slideNavButtons);
  }

  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId);
    slidesWrapper.append(slide);

    if (slideIndicators) {
      const indicator = document.createElement('li');
      indicator.classList.add('carousel-slide-indicator');
      indicator.dataset.targetSlide = idx;
      indicator.innerHTML = `<button type="button"><span>${placeholders.showSlide || 'Show Slide'} ${idx + 1} ${placeholders.of || 'of'} ${rows.length}</span></button>`;
      slideIndicators.append(indicator);
    }
    row.remove();
  });

  container.append(slidesWrapper);
  block.prepend(container);

  if (!isSingleSlide) {
    bindEvents(block);
  }

     // Function to create a video element
function createVideo(url, className, attributes = {}) {

  // console.log('Creating video element with URL:', url); 
  const video = document.createElement('video');
  video.className = className;
  
  Object.keys(attributes).forEach((attr) => {
      video[attr] = attributes[attr];
  });
  const source = document.createElement('source');
  source.src = url;
  source.type = url.endsWith('.mp4') ? 'video/mp4' : 'audio/mpeg'; // Determine type based on extension
  video.appendChild(source);
  
      // Function to toggle video playback
      function togglePlayPause() {
        if (video.paused) {
            video.play();
            playPauseBtn.textContent = '❚❚'; // Pause icon
        } else {
            video.pause();
            playPauseBtn.textContent = '▶'; // Play icon
        }
    }

    // Add click event listener to the video for custom controls
    video.addEventListener('click', togglePlayPause);
 // Create play/pause button
    const playPauseBtn = document.createElement('button');
    playPauseBtn.className = 'play-pause-btn';
    playPauseBtn.textContent = '▶'; // Initially display play icon
    playPauseBtn.addEventListener('click', togglePlayPause);

  // console.log('Video element created:', video.outerHTML);
  return video;
}

// Function to replace links with videos
function replaceLinksWithVideos() {
  const container = document.querySelector('.media-carousel-section'); // Your container selector
  const links = container.querySelectorAll('a'); // Select all <a> tags within the container

  links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href.endsWith('.mp3') || href.endsWith('.mp4'))) {
          const videoElement = createVideo(href, 'video-class', {
            //   controls: true,
              width: 600,
              height: 400,
              autoplay:true,
          });
          
          // Create a div to wrap the video and replace the <a> tag
          const videoContainer = document.createElement('div');
          videoContainer.appendChild(videoElement);
        //   videoContainer.appendChild(playPauseBtn);
          link.parentElement.replaceChild(videoContainer, link); // Replace <a> tag with video container
      return videoContainer;
        }
  });
}
// Call the function to replace links with videos
replaceLinksWithVideos();
}
