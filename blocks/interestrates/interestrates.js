export default async function decorate(block) {
  // Create HTML structure
  const container = document.createElement('div');
  container.classList.add('container');

  const tabsDropdownContainer = document.createElement('div');
  tabsDropdownContainer.classList.add('tabs-dropdown-container');

  const tabsDiv = document.createElement('div');
  tabsDiv.classList.add('tabs');
  tabsDiv.id = 'tabs-container';

  const dropdownDiv = document.createElement('div');
  dropdownDiv.classList.add('dropdown');

  const dropdownSelect = document.createElement('select');
  dropdownSelect.id = 'categoryDropdown';
  dropdownDiv.appendChild(dropdownSelect);

  tabsDropdownContainer.appendChild(tabsDiv);
  tabsDropdownContainer.appendChild(dropdownDiv);

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('content');
  contentDiv.id = 'content-container';

  container.appendChild(tabsDropdownContainer);
  container.appendChild(contentDiv);

  block.appendChild(container);

  // Fetch JSON data from the URL
  try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbwZq5SosMrbkVwYeeCoEV59KUCxze_eIyQlAPCOu3eSwWJe2vdl4Fkoix6DAHuGGggtxg/exec');
      const data = await response.json();

      // Check and correct property names if needed
      if (data && data.data) {
          data.data.forEach((item, index) => {
              const option = document.createElement('option');
              option.value = index;
              option.textContent = item.category;
              dropdownSelect.appendChild(option);
          });

          // Event listener for category change
          dropdownSelect.addEventListener('change', function () {
              const selectedIndex = dropdownSelect.value;
              const selectedCategory = data.data[selectedIndex];
              displayCategory(selectedCategory);
          });

          // Function to display tabs and content for the selected category
          function displayCategory(category) {
              const tabsContainer = document.getElementById('tabs-container');
              const contentContainer = document.getElementById('content-container');
              tabsContainer.innerHTML = '';
              contentContainer.innerHTML = '';

              category.documentCateory.forEach((docCategory, index) => {
                  // Create tab
                  const tab = document.createElement('div');
                  tab.className = 'tab';
                  tab.textContent = docCategory.documentType;
                  tab.dataset.index = index;
                  tab.addEventListener('click', function () {
                      const allTabs = document.querySelectorAll('.tab');
                      const allContents = document.querySelectorAll('.tab-content');
                      allTabs.forEach(t => t.classList.remove('active-tab'));
                      allContents.forEach(c => c.classList.remove('active-content'));
                      tab.classList.add('active-tab');
                      document.getElementById('content-' + index).classList.add('active-content');
                  });
                  tabsContainer.appendChild(tab);

                  // Create tab content
                  const contentDiv = document.createElement('div');
                  contentDiv.id = 'content-' + index;
                  contentDiv.className = 'tab-content';
                  contentDiv.innerHTML = `<h3>${docCategory.title}</h3>
                                          <p>${docCategory.description}</p>
                                          <ul>${docCategory.documents.map(doc => `<li>${doc}</li>`).join('')}</ul>`;
                  contentContainer.appendChild(contentDiv);
              });

              // Activate the first tab by default
              if (category.documentCateory.length > 0) {
                  tabsContainer.firstChild.classList.add('active-tab');
                  contentContainer.firstChild.classList.add('active-content');
              }
          }

          // Trigger the change event to display the first category by default
          dropdownSelect.dispatchEvent(new Event('change'));
      } else {
          console.error('Unexpected data structure:', data);
      }
  } catch (error) {
      console.error('Error fetching data:', error);
  }
}
