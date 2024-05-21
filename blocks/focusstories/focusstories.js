export default function decorate(block) {
    console.log(block);
    const mainDiv = block.querySelectorAll('div');
    mainDiv.forEach(element => {
        element.classList.add('StoriesCards');
    });
}