export default function decorate(block) {
    console.log(block);

    // Find the parent div and add the 'in-view-hero' class
    const parentDivision = block.querySelector('div');
    parentDivision.classList.add('in-view-hero');

    // Create a new empty div, add the 'checker-board-guide' class, and append it to the parentDiv
    const checkerBoardGuideDiv = document.createElement('div');
    checkerBoardGuideDiv.classList.add('checker-board-guide');
    parentDivision.appendChild(checkerBoardGuideDiv);

    // Find all nested divs within the parent div
    const nestedDiv = parentDivision.querySelectorAll('div');

    // Define the classes to be added
    const classes = ['content', 'picture'];

    // Loop through the classes and add them to the corresponding nested divs
    classes.forEach((c, i) => {
        const section = nestedDiv[i];
        console.log(section);
        if (section) section.classList.add(`inner-${c}`);
    });
}
