import createField from './form-fields.js';
import { sampleRUM } from '../../scripts/aem.js';

async function createForm(formHref) {
  const { pathname } = new URL(formHref);
  const resp = await fetch(pathname);
  const json = await resp.json();

  const form = document.createElement('form');
  // eslint-disable-next-line prefer-destructuring
  form.dataset.action = pathname.split('.json')[0];

  const fields = await Promise.all(json.data.map((fd) => createField(fd, form)));
  fields.forEach((field) => {
    if (field) {
      form.append(field);
    }
  });

  // group fields into fieldsets
  const fieldsets = form.querySelectorAll('fieldset');
  fieldsets.forEach((fieldset) => {
    form.querySelectorAll(`[data-fieldset="${fieldset.name}"`).forEach((field) => {
      fieldset.append(field);
    });
  });

  return form;
}

function generatePayload(form) {
  const payload = {};

  [...form.elements].forEach((field) => {
    if (field.name && field.type !== 'submit' && !field.disabled) {
      if (field.type === 'radio') {
        if (field.checked) payload[field.name] = field.value;
      } else if (field.type === 'checkbox') {
        if (field.checked) payload[field.name] = payload[field.name] ? `${payload[field.name]},${field.value}` : field.value;
      } else {
        payload[field.name] = field.value;
      }
    }
  });
  return payload;
}

function handleSubmitError(form, error) {
  // eslint-disable-next-line no-console
  console.error(error);
  form.querySelector('button[type="submit"]').disabled = false;
  sampleRUM('form:error', { source: '.form', target: error.stack || error.message || 'unknown error' });
}

async function handleSubmit(form) {
  if (form.getAttribute('data-submitting') === 'true') return;

  const submit = form.querySelector('button[type="submit"]');
  try {
    form.setAttribute('data-submitting', 'true');
    submit.disabled = true;

    // create payload
    const payload = generatePayload(form);
    const response = await fetch(form.dataset.action, {
      method: 'POST',
      body: JSON.stringify({ data: payload }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      sampleRUM('form:submit', { source: '.form', target: form.dataset.action });
      if (form.dataset.confirmation) {
        window.location.href = form.dataset.confirmation;
      }
    } else {
      const error = await response.text();
      throw new Error(error);
    }
  } catch (e) {
    handleSubmitError(form, e);
  } finally {
    form.setAttribute('data-submitting', 'false');
  }
}

export default async function decorate(block) {
  const formLink = block.querySelector('a[href$=".json"]');
  if (!formLink) return;

  const form = await createForm(formLink.href);
  block.replaceChildren(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const valid = form.checkValidity();
    if (valid) {
      handleSubmit(form);
    } else {
      const firstInvalidEl = form.querySelector(':invalid:not(fieldset)');
      if (firstInvalidEl) {
        firstInvalidEl.focus();
        firstInvalidEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

   
}
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const rows = sheet.getDataRange().getValues();
  
  const result = {
    data: []
  };

  const headers = rows[0];
  const categories = {};

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const category = row[0];
    const documentType = row[1];
    const title = row[2];
    const description = row[3];
    const documents = row[4].split(", ");

    if (!categories[category]) {
      categories[category] = [];
    }

    categories[category].push({
      documentType: documentType,
      title: title,
      description: description,
      documents: documents
    });
  }

  for (const category in categories) {
    result.data.push({
      category: category,
      documentCateory: categories[category]
    });
  }

  const jsonOutput = JSON.stringify(result);
  return ContentService.createTextOutput(jsonOutput).setMimeType(ContentService.MimeType.JSON);
}


document.addEventListener('DOMContentLoaded', () => {
  const jsonUrl = 'https://main--eds-practice--imjeekxgurjar.hlx.page/jsondata.json';
  console.log(jsonUrl);

  fetch(jsonUrl)
    .then(response => response.json())
    .then(data => {
      const dropdown = document.getElementById('categoryDropdown');
      const tabsContainer = document.getElementById('tabs-container');
      const contentContainer = document.getElementById('content-container');

      // Populate dropdown
      data.data.forEach((item, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.innerText = item.category;
        dropdown.appendChild(option);
      });

      // Update tabs and content based on selected category
      const updateTabsAndContent = () => {
        const selectedIndex = dropdown.value;
        const selectedCategory = data.data[selectedIndex];
        tabsContainer.innerHTML = '';
        contentContainer.innerHTML = '';

        selectedCategory.documentCateory.forEach((doc, index) => {
          const tabDiv = document.createElement('div');
          tabDiv.className = `tab${index === 0 ? ' active' : ''}`;
          tabDiv.dataset.tab = index;
          tabDiv.innerText = doc.documentType;
          tabsContainer.appendChild(tabDiv);

          const contentDiv = document.createElement('div');
          contentDiv.className = 'content';
          contentDiv.style.display = index === 0 ? 'block' : 'none';
          contentDiv.innerHTML = `<h3>${doc.title}</h3><p>${doc.description}</p><ul>${doc.documents.map(d => `<li>${d}</li>`).join('')}</ul>`;
          contentContainer.appendChild(contentDiv);

          tabDiv.addEventListener('click', function() {
            document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('.content').forEach((content, contentIndex) => {
              content.style.display = contentIndex == index ? 'block' : 'none';
            });
          });
        });
      };

      dropdown.addEventListener('change', updateTabsAndContent);
      updateTabsAndContent();
    })
    .catch(error => console.error('Error fetching data:', error));
});

