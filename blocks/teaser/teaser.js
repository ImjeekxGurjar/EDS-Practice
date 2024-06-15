
// export default async function decorate(block) {
//     const teaserContainer = block.closest('.teaser-container');
    
//     if (teaserContainer) {
//         applyInitialStyles(teaserContainer);
//         applyTextAlignmentAndPlacement(teaserContainer);
//         convertAnchorsToButtons(block);
//         hideSpecifiedButtons(teaserContainer);
//         handleBackgroundStyle(teaserContainer, block);
//         hidePictures(block);
//         showContainer(teaserContainer);
//     }
    
// }

// const applyInitialStyles = (container) => {
//     const mobileAlignment = container.getAttribute("data-mobile-alignment");
//     const desktopAlignment = container.getAttribute("data-desktop-text-alignment");

//     const applyStyles = () => {
//         const isMobile = window.innerWidth < 600;
//         container.style.textAlign = isMobile ? mobileAlignment : desktopAlignment;
//     };

//     applyStyles();
//     window.addEventListener("resize", applyStyles);
// };

// const applyTextAlignmentAndPlacement = (container) => {
//     const desktopTextAlignment = container.getAttribute("data-desktop-text-alignment");
//     const desktopTextPlacement = container.getAttribute("data-desktop-text-placement");

//     const wrapper = container.querySelector('.teaser-wrapper');

//     wrapper.style.textAlign = desktopTextAlignment;

//     switch (desktopTextPlacement) {
//         case 'left':
//             wrapper.style.marginLeft = '20px';
//             wrapper.style.marginRight = 'auto';
//             break;
//         case 'right':
//             wrapper.style.marginLeft = 'auto';
//             wrapper.style.marginRight = '20px';
//             break;
//         case 'center':
//             wrapper.style.margin = '0 auto';
//             break;
//         default:
//             break;
//     }
// };

// const getBackgroundImage = (container, selector) => {
//     const imageElement = container.querySelector(selector);
//     return imageElement ? imageElement.src : '';
// };

// const convertAnchorsToButtons = (block) => {
//     const paragraphs = block.querySelectorAll("p");

//     paragraphs.forEach(paragraph => {
//         convertAnchorToButton(paragraph, "strong a", "primary-button");
//         convertAnchorToButton(paragraph, "em a", "secondary-button");
//     });
// };

// const convertAnchorToButton = (parent, selector, buttonClass) => {
//     const element = parent.querySelector(selector);
//     if (element) {
//         const anchor = element.closest("a");
//         const button = createButton(anchor.innerText, anchor.href, buttonClass);
//         anchor.replaceWith(button);
//     }
// };

// const createButton = (text, href, className) => {
//     const button = document.createElement("button");
//     button.innerText = text;
//     button.className = className;
//     button.onclick = () => {
//         window.location.href = href;
//     };
//     return button;
// };

// const hideSpecifiedButtons = (container) => {
//     const buttonsToHide = container.getAttribute('data-hide-button')?.split(' ');
//     if (buttonsToHide) {
//         buttonsToHide.forEach(buttonType => {
//             const buttonSelector = buttonType === 'primary' ? '.primary-button' : '.secondary-button';
//             const button = container.querySelector(buttonSelector);
//             if (button) {
//                 button.style.display = 'none';
//             }
//         });
//     }
// };

// const handleBackgroundStyle = (container, block) => {
//     const backgroundStyle = container.getAttribute('data-background-style');
//     const videoUrlElement = block.querySelector('p a[href*="youtube.com"]');
//     const videoUrl = videoUrlElement ? videoUrlElement.href : '';
//     if (backgroundStyle === 'image') {
//         const pictures = container.querySelectorAll('picture');     
//         let desktopImageSrc = '';
//         let mobileImageSrc = '';
//         pictures.forEach((picture, index) => {
//             const img = picture.querySelector('img');
//             if (img) {
//                 console.log(`Picture ${index + 1} Image Source:`, img.src);
//                 if (index === 0) {
//                     desktopImageSrc = img.src;
//                 } else if (index === 1) {
//                     mobileImageSrc = img.src;
//                 }
//             } else {
//                 console.log(`Picture ${index + 1} Image Source: Not found`);
//             }
//         });
//         console.log('Desktop Image Source:', desktopImageSrc);
//         console.log('Mobile Image Source:', mobileImageSrc);
//         const applyBackgroundImage = () => {
//             container.style.backgroundImage = `url(${window.innerWidth < 600 ? mobileImageSrc : desktopImageSrc})`;
//         };
//         applyBackgroundImage();
//         window.addEventListener('resize', applyBackgroundImage);
//     } else if (backgroundStyle === 'video') {
//         createVideoBackground(container, videoUrl);
//     } else if (backgroundStyle === 'video,popup') {
//         createVideoPopup(container, videoUrl);
//     }
// };

// const createVideoBackground = (container, videoUrl) => {
//     const videoWrapper = document.createElement('div');
//     videoWrapper.className = 'video-background';
//     const iframe = document.createElement('iframe');
//     iframe.src = videoUrl.replace('watch?v=', 'embed/');
//     iframe.setAttribute('frameborder', '0');
//     iframe.setAttribute('allow', 'autoplay; encrypted-media');
//     iframe.setAttribute('allowfullscreen', 'true');
//     videoWrapper.appendChild(iframe);
//     container.appendChild(videoWrapper);
// };

// const createVideoPopup = (container, videoUrl) => {
//     const playButton = document.createElement('button');
//     playButton.className = 'play-button';
//     playButton.innerText = 'Play Video';
//     playButton.onclick = () => {
//         const popup = document.createElement('div');
//         popup.className = 'video-popup';
//         const iframe = document.createElement('iframe');
//         iframe.src = videoUrl.replace('watch?v=', 'embed/');
//         iframe.setAttribute('frameborder', '0');
//         iframe.setAttribute('allow', 'autoplay; encrypted-media');
//         iframe.setAttribute('allowfullscreen', 'true');
//         popup.appendChild(iframe);
//         const closeButton = document.createElement('button');
//         closeButton.className = 'close-button';
//         closeButton.innerText = 'Close';
//         closeButton.onclick = () => {
//             popup.remove();
//         };
//         popup.appendChild(closeButton);
//         document.body.appendChild(popup);
//     };
//     container.querySelector('.button-container').appendChild(playButton);
// };

// const hidePictures = (block) => {
//     const pictures = block.querySelectorAll("picture");
//     pictures.forEach(picture => {
//         picture.style.display = 'none';
//     });
// };

// const showContainer = (container) => {
    
//     // container.style.display = 'block';
//     // container.style.display = 'flex';
// };



// export default async function decorate(block) {
//     const teaserContainer = block.closest('.teaser-container');

//     if (teaserContainer) {
//         applyInitialStyles(teaserContainer);
//         applyTextAlignmentAndPlacement(teaserContainer);
//         convertAnchorsToButtons(block);
//         hideSpecifiedButtons(teaserContainer);
//         handleBackgroundStyle(teaserContainer, block);
//         hidePictures(block);
//         showContainer(teaserContainer);
//     }
// }

// const applyInitialStyles = (container) => {
//     const mobileAlignment = container.getAttribute("data-mobile-alignment");
//     const desktopAlignment = container.getAttribute("data-desktop-text-alignment");

//     const applyStyles = () => {
//         const isMobile = window.innerWidth < 600;
//         container.style.textAlign = isMobile ? mobileAlignment : desktopAlignment;
//     };

//     applyStyles();
//     window.addEventListener("resize", applyStyles);
// };

// const applyTextAlignmentAndPlacement = (container) => {
//     const desktopTextAlignment = container.getAttribute("data-desktop-text-alignment");
//     const desktopTextPlacement = container.getAttribute("data-desktop-text-placement");

//     const wrapper = container.querySelector('.teaser-wrapper');

//     wrapper.style.textAlign = desktopTextAlignment;

//     switch (desktopTextPlacement) {
//         case 'left':
//             wrapper.style.marginLeft = '20px';
//             wrapper.style.marginRight = 'auto';
//             break;
//         case 'right':
//             wrapper.style.marginLeft = 'auto';
//             wrapper.style.marginRight = '20px';
//             break;
//         case 'center':
//             wrapper.style.margin = '0 auto';
//             break;
//         default:
//             break;
//     }
// };

// const convertAnchorsToButtons = (block) => {
//     const paragraphs = block.querySelectorAll("p");

//     paragraphs.forEach(paragraph => {
//         convertAnchorToButton(paragraph, "strong a", "primary-button");
//         convertAnchorToButton(paragraph, "em a", "secondary-button");
//     });
// };

// const convertAnchorToButton = (parent, selector, buttonClass) => {
//     const element = parent.querySelector(selector);
//     if (element) {
//         const anchor = element.closest("a");
//         const button = createButton(anchor.innerText, anchor.href, buttonClass);
//         anchor.replaceWith(button);
//     }
// };

// const createButton = (text, href, className) => {
//     const button = document.createElement("button");
//     button.innerText = text;
//     button.className = className;
//     button.onclick = () => {
//         window.location.href = href;
//     };
//     return button;
// };

// const hideSpecifiedButtons = (container) => {
//     const buttonsToHide = container.getAttribute('data-hide-button')?.split(' ');
//     if (buttonsToHide) {
//         buttonsToHide.forEach(buttonType => {
//             const buttonSelector = buttonType === 'primary' ? '.primary-button' : '.secondary-button';
//             const button = container.querySelector(buttonSelector);
//             if (button) {
//                 button.style.display = 'none';
//             }
//         });
//     }
// };

// const handleBackgroundStyle = (container, block) => {
//     const backgroundStyle = container.getAttribute('data-background-style');
//     const videoLinks = block.querySelectorAll('a[href]');
//     let videoUrl = '';
//     let mp4VideoUrl = '';

//     videoLinks.forEach(link => {
//         const href = link.href;
//         if (href.includes('youtube.com')) {
//             videoUrl = href;
//         } else if (href.match(/\.(mp4|webm|ogg)$/)) {
//             mp4VideoUrl = href;
//         }
//     });

//     console.log('YouTube video URL:', videoUrl);
//     console.log('MP4 video URL:', mp4VideoUrl);

//     if (mp4VideoUrl) {
//         createVideoBackground(container, mp4VideoUrl);
//         // Remove the video link
//         videoLinks.forEach(link => {
//             if (link.href === mp4VideoUrl) {
//                 link.closest('p').remove();
//             }
//         });
//     }

//     if (videoUrl) {
//         createVideoPopup(container, videoUrl);
//     }
// };

// const createVideoBackground = (container, videoUrl) => {
//     const videoWrapper = document.createElement('div');
//     videoWrapper.className = 'video-background';
//     const video = document.createElement('video');
//     video.setAttribute('autoplay', true);
//     video.setAttribute('muted', true);
//     video.setAttribute('loop', true);
//     video.setAttribute('playsinline', true);
//     video.innerHTML = `<source src="${videoUrl}" type="video/mp4">`;
//     videoWrapper.appendChild(video);
//     container.appendChild(videoWrapper);
// };

// const createVideoPopup = (container, videoUrl) => {
//     const playButton = document.createElement('button');
//     playButton.className = 'play-button';
//     playButton.innerText = 'Play Video';
//     playButton.onclick = () => {
//         const popup = document.createElement('div');
//         popup.className = 'video-popup';
//         const iframe = document.createElement('iframe');
//         iframe.src = videoUrl.replace('watch?v=', 'embed/');
//         iframe.setAttribute('frameborder', '0');
//         iframe.setAttribute('allow', 'autoplay; encrypted-media');
//         iframe.setAttribute('allowfullscreen', 'true');
//         popup.appendChild(iframe);
//         const closeButton = document.createElement('button');
//         closeButton.className = 'close-button';
//         closeButton.innerText = 'Close';
//         closeButton.onclick = () => {
//             popup.remove();
//         };
//         popup.appendChild(closeButton);
//         document.body.appendChild(popup);
//     };
//     container.querySelector('.button-container').appendChild(playButton);
// };

// const hidePictures = (block) => {
//     const pictures = block.querySelectorAll("picture");
//     pictures.forEach(picture => {
//         picture.style.display = 'block';
//     });
// };

// const showContainer = (container) => {
//     // Uncomment the below lines if you want to explicitly show the container
//     // container.style.display = 'block';
//     // container.style.display = 'flex';
// };

// export default async function decorate(block) {
//     const teaserContainer = block.closest('.teaser-container');

//     if (teaserContainer) {
//         applyInitialStyles(teaserContainer);
//         applyTextAlignmentAndPlacement(teaserContainer);
//         convertAnchorsToButtons(block);
//         hideSpecifiedButtons(teaserContainer);
//         handleBackgroundStyle(teaserContainer, block);
//         hidePictures(block);
//         showContainer(teaserContainer);
//     }
// }

// const applyInitialStyles = (container) => {
//     const mobileAlignment = container.getAttribute("data-mobile-alignment");
//     const desktopAlignment = container.getAttribute("data-desktop-text-alignment");

//     const applyStyles = () => {
//         const isMobile = window.innerWidth < 600;
//         container.style.textAlign = isMobile ? mobileAlignment : desktopAlignment;
//     };

//     applyStyles();
//     window.addEventListener("resize", applyStyles);
// };

// const applyTextAlignmentAndPlacement = (container) => {
//     const desktopTextAlignment = container.getAttribute("data-desktop-text-alignment");
//     const desktopTextPlacement = container.getAttribute("data-desktop-text-placement");

//     const wrapper = container.querySelector('.teaser-wrapper');

//     wrapper.style.textAlign = desktopTextAlignment;

//     switch (desktopTextPlacement) {
//         case 'left':
//             wrapper.style.marginLeft = '20px';
//             wrapper.style.marginRight = 'auto';
//             break;
//         case 'right':
//             wrapper.style.marginLeft = 'auto';
//             wrapper.style.marginRight = '20px';
//             break;
//         case 'center':
//             wrapper.style.margin = '0 auto';
//             break;
//         default:
//             break;
//     }
// };

// const convertAnchorsToButtons = (block) => {
//     const paragraphs = block.querySelectorAll("p");

//     paragraphs.forEach(paragraph => {
//         convertAnchorToButton(paragraph, "strong a", "primary-button");
//         convertAnchorToButton(paragraph, "em a", "secondary-button");
//     });
// };

// const convertAnchorToButton = (parent, selector, buttonClass) => {
//     const element = parent.querySelector(selector);
//     if (element) {
//         const anchor = element.closest("a");
//         const button = createButton(anchor.innerText, anchor.href, buttonClass);
//         anchor.replaceWith(button);
//     }
// };

// const createButton = (text, href, className) => {
//     const button = document.createElement("button");
//     button.innerText = text;
//     button.className = className;
//     button.onclick = () => {
//         window.location.href = href;
//     };
//     return button;
// };

// const hideSpecifiedButtons = (container) => {
//     const buttonsToHide = container.getAttribute('data-hide-button')?.split(' ');
//     if (buttonsToHide) {
//         buttonsToHide.forEach(buttonType => {
//             const buttonSelector = buttonType === 'primary' ? '.primary-button' : '.secondary-button';
//             const button = container.querySelector(buttonSelector);
//             if (button) {
//                 button.style.display = 'none';
//             }
//         });
//     }
// };

// const handleBackgroundStyle = (container, block) => {
//     const backgroundStyle = container.getAttribute('data-background-style');
//     const videoLinks = block.querySelectorAll('a[href]');
//     let videoUrl = '';
//     let mp4VideoUrl = '';
//     let imageUrl = '';

//     videoLinks.forEach(link => {
//         const href = link.href;
//         if (href.includes('youtube.com')) {
//             videoUrl = href;
//         } else if (href.match(/\.(mp4|webm|ogg)$/)) {
//             mp4VideoUrl = href;
//         }
//     });

//     const pictures = container.querySelectorAll('picture img');
//     if (pictures.length > 0) {
//         imageUrl = window.innerWidth < 600 ? pictures[1].src : pictures[0].src;
//     }

//     console.log('YouTube video URL:', videoUrl);
//     console.log('MP4 video URL:', mp4VideoUrl);
//     console.log('Image URL:', imageUrl);

//     if (mp4VideoUrl) {
//         createVideoBackground(container, mp4VideoUrl);
//         // Remove the video link
//         videoLinks.forEach(link => {
//             if (link.href === mp4VideoUrl) {
//                 link.closest('p').remove();
//             }
//         });
//     } else if (imageUrl) {
//         createImageBackground(container, imageUrl);
//     }

//     if (videoUrl) {
//         createVideoPopup(container, videoUrl);
//     }
// };

// const createVideoBackground = (container, videoUrl) => {
//     const videoWrapper = document.createElement('div');
//     videoWrapper.className = 'video-background';
//     const video = document.createElement('video');
//     video.setAttribute('autoplay', true);
//     video.setAttribute('muted', true);
//     video.setAttribute('loop', true);
//     video.setAttribute('playsinline', true);
//     video.innerHTML = `<source src="${videoUrl}" type="video/mp4">`;
//     videoWrapper.appendChild(video);
//     container.appendChild(videoWrapper);
// };

// const createVideoPopup = (container, videoUrl) => {
//     const playButton = document.createElement('button');
//     playButton.className = 'play-button';
//     playButton.innerText = 'Play Video';
//     playButton.onclick = () => {
//         const popup = document.createElement('div');
//         popup.className = 'video-popup';
//         const iframe = document.createElement('iframe');
//         iframe.src = videoUrl.replace('watch?v=', 'embed/');
//         iframe.setAttribute('frameborder', '0');
//         iframe.setAttribute('allow', 'autoplay; encrypted-media');
//         iframe.setAttribute('allowfullscreen', 'true');
//         popup.appendChild(iframe);
//         const closeButton = document.createElement('button');
//         closeButton.className = 'close-button';
//         closeButton.innerText = 'Close';
//         closeButton.onclick = () => {
//             popup.remove();
//         };
//         popup.appendChild(closeButton);
//         document.body.appendChild(popup);
//     };
//     container.querySelector('.button-container').appendChild(playButton);
// };

// const createImageBackground = (container, imageUrl) => {
//     container.style.backgroundImage = `url(${imageUrl})`;
//     container.style.backgroundSize = 'cover';
//     container.style.backgroundPosition = 'center';
// };

// const hidePictures = (block) => {
//     const pictures = block.querySelectorAll("picture");
//     pictures.forEach(picture => {
//         picture.style.display = 'none';
//     });
// };

// const showContainer = (container) => {
//     container.style.display = 'block';
// };


export default async function decorate(block) {
    const teaserContainer = block.closest('.teaser-container');

    if (teaserContainer) {
        applyInitialStyles(teaserContainer);
        applyTextAlignmentAndPlacement(teaserContainer);
        convertAnchorsToButtons(block);
        hideSpecifiedButtons(teaserContainer);
        handleBackgroundStyle(teaserContainer, block);
        hidePictures(block);
        showContainer(teaserContainer);
    }
}

const applyInitialStyles = (container) => {
    const mobileAlignment = container.getAttribute("data-mobile-alignment");
    const desktopAlignment = container.getAttribute("data-desktop-text-alignment");

    const applyStyles = () => {
        const isMobile = window.innerWidth < 600;
        container.style.textAlign = isMobile ? mobileAlignment : desktopAlignment;
    };

    applyStyles();
    window.addEventListener("resize", applyStyles);
};

const applyTextAlignmentAndPlacement = (container) => {
    const desktopTextAlignment = container.getAttribute("data-desktop-text-alignment");
    const desktopTextPlacement = container.getAttribute("data-desktop-text-placement");

    const wrapper = container.querySelector('.teaser-wrapper');

    wrapper.style.textAlign = desktopTextAlignment;

    switch (desktopTextPlacement) {
        case 'left':
            wrapper.style.marginLeft = '20px';
            wrapper.style.marginRight = 'auto';
            break;
        case 'right':
            wrapper.style.marginLeft = 'auto';
            wrapper.style.marginRight = '20px';
            break;
        case 'center':
            wrapper.style.margin = '0 auto';
            break;
        default:
            break;
    }
};

const convertAnchorsToButtons = (block) => {
    const paragraphs = block.querySelectorAll("p");

    paragraphs.forEach(paragraph => {
        convertAnchorToButton(paragraph, "strong a", "primary-button");
        convertAnchorToButton(paragraph, "em a", "secondary-button");
    });
};

const convertAnchorToButton = (parent, selector, buttonClass) => {
    const element = parent.querySelector(selector);
    if (element) {
        const anchor = element.closest("a");
        const button = createButton(anchor.innerText, anchor.href, buttonClass);
        anchor.replaceWith(button);
    }
};

const createButton = (text, href, className) => {
    const button = document.createElement("button");
    button.innerText = text;
    button.className = className;
    button.onclick = () => {
        window.location.href = href;
    };
    return button;
};

const hideSpecifiedButtons = (container) => {
    const buttonsToHide = container.getAttribute('data-hide-button')?.split(' ');
    if (buttonsToHide) {
        buttonsToHide.forEach(buttonType => {
            const buttonSelector = buttonType === 'primary' ? '.primary-button' : '.secondary-button';
            const button = container.querySelector(buttonSelector);
            if (button) {
                button.style.display = 'none';
            }
        });
    }
};

const handleBackgroundStyle = (container, block) => {
    const backgroundStyle = container.getAttribute('data-background-style');
    if (backgroundStyle === 'image') {
        const pictures = container.querySelectorAll('picture');     
        let desktopImageSrc = '';
        let mobileImageSrc = '';
        pictures.forEach((picture, index) => {
            const img = picture.querySelector('img');
            if (img) {
                console.log(`Picture ${index + 1} Image Source:`, img.src);
                if (index === 0) {
                    desktopImageSrc = img.src;
                } else if (index === 1) {
                    mobileImageSrc = img.src;
                }
            } else {
                console.log(`Picture ${index + 1} Image Source: Not found`);
            }
        });
        console.log('Desktop Image Source:', desktopImageSrc);
        console.log('Mobile Image Source:', mobileImageSrc);
        const applyBackgroundImage = () => {
            container.style.backgroundImage = `url(${window.innerWidth < 600 ? mobileImageSrc : desktopImageSrc})`;
        };
        applyBackgroundImage();
        window.addEventListener('resize', applyBackgroundImage);
    } else if (backgroundStyle === 'video') {
        createVideoBackground(container, videoUrl);
    } else if (backgroundStyle === 'video,popup') {
        createVideoPopup(container, videoUrl);
    }
    const videoLinks = block.querySelectorAll('a[href]');
    let videoUrl = '';
    let mp4VideoUrl = '';

    videoLinks.forEach(link => {
        const href = link.href;
        if (href.includes('youtube.com')) {
            videoUrl = href;
        } else if (href.match(/\.(mp4|webm|ogg)$/)) {
            mp4VideoUrl = href;
        }
    });

    console.log('YouTube video URL:', videoUrl);
    console.log('MP4 video URL:', mp4VideoUrl);

    if (mp4VideoUrl) {
        createVideoBackground(container, mp4VideoUrl);
        // Remove the video link
        videoLinks.forEach(link => {
            if (link.href === mp4VideoUrl) {
                link.closest('p').remove();
            }
        });
    }

    if (videoUrl) {
        createVideoPopup(container, videoUrl);
    }

    if (!mp4VideoUrl) {
        const pictures = container.querySelectorAll('picture img');
        if (pictures.length > 0) {
            let imageUrl = window.innerWidth < 600 ? pictures[1].src : pictures[0].src;
            createImageBackground(container, imageUrl);
        }
    }
};

const createVideoBackground = (container, videoUrl) => {
    const videoWrapper = document.createElement('div');
    videoWrapper.className = 'video-background';
    const video = document.createElement('video');
    video.setAttribute('autoplay', true);
    video.setAttribute('muted', true);
    video.setAttribute('loop', true);
    video.setAttribute('playsinline', true);
    video.innerHTML = `<source src="${videoUrl}" type="video/mp4">`;
    videoWrapper.appendChild(video);
    container.appendChild(videoWrapper);
};

const createVideoPopup = (container, videoUrl) => {
    const playButton = document.createElement('button');
    playButton.className = 'play-button';
    playButton.innerText = 'Play Video';
    playButton.onclick = () => {
        const popup = document.createElement('div');
        popup.className = 'video-popup';
        const iframe = document.createElement('iframe');
        iframe.src = videoUrl.replace('watch?v=', 'embed/');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'autoplay; encrypted-media');
        iframe.setAttribute('allowfullscreen', 'true');
        popup.appendChild(iframe);
        const closeButton = document.createElement('button');
        closeButton.className = 'close-button';
        closeButton.innerText = 'Close';
        closeButton.onclick = () => {
            popup.remove();
        };
        popup.appendChild(closeButton);
        document.body.appendChild(popup);
    };
    container.querySelector('.button-container').appendChild(playButton);
};

const createImageBackground = (container, imageUrl) => {
    container.style.backgroundImage = `url(${imageUrl})`;
    container.style.backgroundSize = 'cover';
    container.style.backgroundPosition = 'center';
};

const hidePictures = (block) => {
    const pictures = block.querySelectorAll("picture");
    pictures.forEach(picture => {
        picture.style.display = 'none';
    });
};

const showContainer = (container) => {
    // container.style.display = 'block';
};






