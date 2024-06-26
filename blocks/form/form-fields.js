import { toClassName } from '../../scripts/aem.js';

// Function to create a field wrapper for each form field
function createFieldWrapper(fd) {
  const fieldWrapper = document.createElement('div');
  if (fd.Style) fieldWrapper.className = fd.Style;
  fieldWrapper.classList.add('field-wrapper', `${fd.Type}-wrapper`);
  fieldWrapper.dataset.fieldset = fd.Fieldset;
  return fieldWrapper;
}

// Function to generate unique field IDs
const ids = [];
function generateFieldId(fd, suffix = '') {
  const slug = toClassName(`form-${fd.Name}${suffix}`);
  ids[slug] = ids[slug] || 0;
  const idSuffix = ids[slug] ? `-${ids[slug]}` : '';
  ids[slug] += 1;
  return `${slug}${idSuffix}`;
}

// Function to create a label for a form field
function createLabel(fd) {
  const labelText = fd.Label;
  if (!labelText) {
    return null;
  }
  const label = document.createElement('label');
  label.id = generateFieldId(fd, '-label');
  label.textContent = labelText;
  label.setAttribute('for', fd.Id);
  return label;
}

// Function to set common attributes for form fields
function setCommonAttributes(field, fd) {
  field.id = fd.Id;
  field.name = fd.Name;
  field.required = fd.Mandatory && (fd.Mandatory.toLowerCase() === 'true' || fd.Mandatory.toLowerCase() === 'x');
  field.placeholder = fd.Placeholder;
  field.value = fd.Value;
}

// Function to create a heading field
const createHeading = (fd) => {
  const fieldWrapper = createFieldWrapper(fd);
  const level = fd.Style && fd.Style.includes('sub-heading') ? 3 : 2;
  const heading = document.createElement(`h${level}`);
  heading.textContent = fd.Value || fd.Label;
  heading.id = fd.Id;
  fieldWrapper.append(heading);
  return { field: heading, fieldWrapper };
};

// Function to create a plaintext field
const createPlaintext = (fd) => {
  const fieldWrapper = createFieldWrapper(fd);
  const text = document.createElement('p');
  text.textContent = fd.Value || fd.Label;
  text.id = fd.Id;
  fieldWrapper.append(text);
  return { field: text, fieldWrapper };
};

// Function to create a select dropdown field
const createSelect = async (fd) => {
  const select = document.createElement('select');
  setCommonAttributes(select, fd);
  const addOption = ({ text, value }) => {
    const option = document.createElement('option');
    option.text = text.trim();
    option.value = value.trim();
    if (option.value === select.value) {
      option.setAttribute('selected', '');
    }
    select.add(option);
    return option;
  };

  if (fd.Placeholder) {
    const ph = addOption({ text: fd.Placeholder, value: '' });
    ph.setAttribute('disabled', '');
  }

  if (fd.Options) {
    let options = [];
    if (fd.Options.startsWith('https://')) {
      const optionsUrl = new URL(fd.Options);
      const resp = await fetch(`${optionsUrl.pathname}${optionsUrl.search}`);
      const json = await resp.json();
      json.data.forEach((opt) => {
        options.push({
          text: opt.Option,
          value: opt.Value || opt.Option,
        });
      });
    } else {
      options = fd.Options.split(',').map((opt) => ({
        text: opt.trim(),
        value: opt.trim().toLowerCase(),
      }));
    }

    options.forEach((opt) => addOption(opt));
  }


  const fieldWrapper = createFieldWrapper(fd);
  fieldWrapper.append(select);
  const label = createLabel(fd);
  if (label) {
    fieldWrapper.append(label);
  }

  return { field: select, fieldWrapper };
};

// Function to create a confirmation field
const createConfirmation = (fd, form) => {
  form.dataset.confirmation = new URL(fd.Value).pathname;
  return {};
};

// Function to create a submit button field
const createSubmit = (fd) => {
  const button = document.createElement('button');
  button.textContent = fd.Label || fd.Name;
  button.classList.add('button');
  button.type = 'submit';

  const fieldWrapper = createFieldWrapper(fd);
  fieldWrapper.append(button);
  return { field: button, fieldWrapper };
};

// Function to create a textarea field
const createTextArea = (fd) => {
  const field = document.createElement('textarea');
  setCommonAttributes(field, fd);

  const fieldWrapper = createFieldWrapper(fd);
  const label = createLabel(fd);
  if (label) {
    field.setAttribute('aria-labelledby', label.id);
    fieldWrapper.append(label);
  }
  fieldWrapper.append(field);

  return { field, fieldWrapper };
};

// Function to create an input field
const createInput = (fd) => {
  const field = document.createElement('input');
  field.type = fd.Type;
  setCommonAttributes(field, fd);

  const fieldWrapper = createFieldWrapper(fd);
  const label = createLabel(fd);
  if (label) {
    field.setAttribute('aria-labelledby', label.id);
    fieldWrapper.append(label);
  }
  fieldWrapper.append(field);

  return { field, fieldWrapper };
};

// Function to create a fieldset
const createFieldset = (fd) => {
  const field = document.createElement('fieldset');
  setCommonAttributes(field, fd);

  if (fd.Label) {
    const legend = document.createElement('legend');
    legend.textContent = fd.Label;
    field.append(legend);
  }

  const fieldWrapper = createFieldWrapper(fd);
  fieldWrapper.append(field);

  return { field, fieldWrapper };
};

// Function to create a toggle (checkbox) field
const createToggle = (fd) => {
  const { field, fieldWrapper } = createInput(fd);
  field.type = 'checkbox';
  if (!field.value) field.value = 'on';
  field.classList.add('toggle');
  fieldWrapper.classList.add('selection-wrapper');

  const toggleSwitch = document.createElement('div');
  toggleSwitch.classList.add('switch');
  toggleSwitch.append(field);
  fieldWrapper.append(toggleSwitch);

  const slider = document.createElement('span');
  slider.classList.add('slider');
  toggleSwitch.append(slider);
  slider.addEventListener('click', () => {
    field.checked = !field.checked;
  });

  return { field, fieldWrapper };
};

// Function to create a checkbox field
const createCheckbox = (fd) => {
  const { field, fieldWrapper } = createInput(fd);
  // Get the label element associated with the checkbox
  const label = fieldWrapper.querySelector('label');
  // Extract the text content of the label
  const labelText = label.textContent;
  
  if (!field.value) field.value = labelText;
  fieldWrapper.classList.add('selection-wrapper');

  // Add event listener to the checkbox to toggle the "checked" class
  field.addEventListener('change', () => {
    if (field.checked) {
      fieldWrapper.classList.add('checked');
    } else {
      fieldWrapper.classList.remove('checked');
    }
  });
  return { field, fieldWrapper, labelText};
};

// Function to create a radio button field
const createRadio = (fd) => {
  const { field, fieldWrapper } = createInput(fd);
  if (!field.value) field.value = fd.Label || 'on';
  fieldWrapper.classList.add('selection-wrapper');
   // Add event listener to the radio button
   field.addEventListener('change', () => {
    // Remove "selected" class from all radio button wrappers
    document.querySelectorAll('.selection-wrapper').forEach(wrapper => {
      wrapper.classList.remove('selected');
    });
    // Add "selected" class to the wrapper of the currently selected radio button
    if (field.checked) {
      fieldWrapper.classList.add('selected');
    }
  });
  return { field, fieldWrapper };
};

// Object containing functions to create different types of form fields
const FIELD_CREATOR_FUNCTIONS = {
  select: createSelect,
  heading: createHeading,
  plaintext: createPlaintext,
  'text-area': createTextArea,
  toggle: createToggle,
  submit: createSubmit,
  confirmation: createConfirmation,
  fieldset: createFieldset,
  checkbox: createCheckbox,
  radio: createRadio,
};

// Function to create a form field based on its type
export default async function createField(fd, form) {
  fd.Id = fd.Id || generateFieldId(fd);
  const type = fd.Type.toLowerCase();
  const createFieldFunc = FIELD_CREATOR_FUNCTIONS[type] || createInput;
  const fieldElements = await createFieldFunc(fd, form);

  return fieldElements.fieldWrapper;
}
