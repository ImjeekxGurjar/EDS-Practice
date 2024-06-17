export default async function decorate(block) {
    try {
        // Create container for carousel
        const container = document.createElement('div');
        container.classList.add('carousel-container');

        // Create carousel element
        const carousel = document.createElement('div');
        carousel.classList.add('carousel', 'slick-carousel');

        // Append carousel to container
        container.appendChild(carousel);
        block.appendChild(container);

        // Fetch JSON data from the provided URL
        const response = await fetch('https://main--eds-practice--imjeekxgurjar.hlx.page/testingcarousel.json');
        const responseData = await response.json();
        // console.log(responseData);

        // Check if data is available and has the correct structure
        if (responseData && Array.isArray(responseData.data)) {
            const carouselData = responseData.data;

            // Iterate over carousel data and create slides
            carouselData.forEach((entry, index) => {
                const { 'Background Image': backgroundImage, 'Title': title, 'Description': description, 'Video Link': videoLink, 'Play Video Label': playVideoLabel, 'Apply Now label': applyNowLabel, 'term and condition': termAndCondition, 'toprighticon': topRightIcon } = entry;

                // Create slide element
                const slide = document.createElement('div');

                // Set background image
                if (backgroundImage) {
                    slide.style.backgroundImage = `url(${backgroundImage})`;
                } else {
                    console.error('Background image URL is undefined for entry:', entry);
                }

                // Set top right icon
                if (topRightIcon) {
                    const icon = document.createElement('img');
                    icon.src = topRightIcon;
                    icon.classList.add('top-right-icon');
                    slide.appendChild(icon);
                } else {
                    console.error('Top right icon URL is undefined for entry:', entry);
                }

                // Create content for slide
                const content = document.createElement('div');
                content.classList.add('content');

                // Create title element
                const titleElement = document.createElement('h2');
                titleElement.textContent = title;

                // Create description element
                const descriptionElement = document.createElement('p');
                descriptionElement.textContent = description;

                // Create buttons container
                const buttonsContainer = document.createElement('div');
                buttonsContainer.classList.add('buttons-container');

                // Create play button element
                const playButton = document.createElement('button');
                playButton.textContent = playVideoLabel;
                playButton.classList.add('play-btn'); // Add the 'play-btn' class
                playButton.addEventListener('click', () => {
                    // Create video element
                    const video = document.createElement('video');
                    video.src = videoLink;
                    video.controls = true; // Show video controls
                    video.autoplay = true; // Autoplay the video
                    video.loop = true; // Loop the video
                    video.style.width = '100%'; // Set video width to match slide width
                    video.style.height = '100%'; // Set video height to match slide height

                    // Remove any existing content in the slide
                    slide.innerHTML = '';

                    // Append video to slide
                    slide.appendChild(video);
                });

                // Create apply now button element
                const applyButton = document.createElement('button');
                applyButton.textContent = applyNowLabel;
                applyButton.classList.add('knowmore-btn'); // Add the 'knowmore-btn' class

                // Append buttons to container
                buttonsContainer.appendChild(applyButton);
                buttonsContainer.appendChild(playButton);

                // Append elements to content
                content.appendChild(titleElement);
                content.appendChild(descriptionElement);
                content.appendChild(buttonsContainer);

                // Append content to slide
                slide.appendChild(content);

                // Append slide to carousel
                carousel.appendChild(slide);
            });

            // Initialize Slick Carousel
            $(carousel).slick({
                autoplay: true,
                autoplaySpeed: 5000,
                arrows: false, // Hide default arrows
                dots: false, // Remove default dots
                pauseOnHover: true,
                infinite: true,
                speed: 1000,
                slidesToShow: 1,
                slidesToScroll: 1
            });

            // Create progress bar container
            const progressBarContainer = document.createElement('div');
            progressBarContainer.classList.add('progress-bar-container');
            block.appendChild(progressBarContainer);

            // Create progress bar
            const progressBar = document.createElement('div');
            progressBar.classList.add('progress-bar');
            progressBarContainer.appendChild(progressBar);

            // Add pagination and term and condition below carousel
            const paginationContainer = document.createElement('div');
            paginationContainer.classList.add('pagination-container');
            block.appendChild(paginationContainer);

            // Add term and condition text
            const termAndConditionText = responseData['term and condition'];
            const termAndCondition = document.createElement('p');
            termAndCondition.textContent = termAndConditionText;
            paginationContainer.appendChild(termAndCondition);

            // Utility function to format number with leading zeros
            const formatNumber = (number, length) => {
                return number.toString().padStart(length, '0');
            };

            // Create previous arrow button
            const prevButton = document.createElement('button');
            prevButton.innerHTML = '&lt;'; // Previous arrow symbol
            prevButton.classList.add('pagination-arrow', 'prev-arrow');
            prevButton.addEventListener('click', () => {
                $(carousel).slick('slickPrev');
            });
            paginationContainer.appendChild(prevButton);

            const slideCount = $(carousel).slick('getSlick').slideCount;
            for (let i = 0; i < slideCount; i++) {
                const button = document.createElement('button');
                button.textContent = formatNumber(i + 1, 2); // Format with leading zeros
                button.addEventListener('click', () => {
                    $(carousel).slick('slickGoTo', i);
                });
                paginationContainer.appendChild(button);
            }

            // Create next arrow button
            const nextButton = document.createElement('button');
            nextButton.innerHTML = '&gt;'; // Next arrow symbol
            nextButton.classList.add('pagination-arrow', 'next-arrow');
            nextButton.addEventListener('click', () => {
                $(carousel).slick('slickNext');
            });
            paginationContainer.appendChild(nextButton);

            // Update progress bar on slide change
            $(carousel).on('afterChange', function(event, slick, currentSlide) {
                const progressBarWidth = ((currentSlide + 1) / slideCount) * 100;
                progressBar.style.width = `${progressBarWidth}%`;
            });

            // Initialize progress bar width
            progressBar.style.width = `${(1 / slideCount) * 100}%`;
        } else {
            console.error('Unexpected data structure:', responseData);
        }
    } catch (error) {
        console.error('Error fetching or processing data:', error);
    }
}
