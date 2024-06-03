export default async function decorate(block) {
    try {
        console.log(block);

        // Create a form container
        // const form = document.createElement('form');
        // form.classList.add('form-container');

        // // Utility function to create input fields with labels
        // const createInputField = (type, name, placeholder) => {
        //     const container = document.createElement('div');
        //     container.classList.add('input-container');

        //     const input = document.createElement('input');
        //     input.type = type;
        //     input.name = name;
        //     input.placeholder = placeholder;
        //     input.classList.add('form-input');

        //     const errorField = document.createElement('div');
        //     errorField.classList.add('error-field');
        //     errorField.id = `${name}-error`;

        //     container.appendChild(input);
        //     container.appendChild(errorField);

        //     return container;
        // };

        // // Create Name input field
        // const nameField = createInputField('text', 'name', 'Enter your name');
        // form.appendChild(nameField);

        // // Create Mobile input field
        // const mobileField = createInputField('tel', 'mobile', 'Enter your mobile number');
        // form.appendChild(mobileField);

        // // Create Email input field
        // const emailField = createInputField('email', 'email', 'Enter your email');
        // form.appendChild(emailField);

        // // Label for product selection
        // const productLabel = document.createElement('label');
        // productLabel.textContent = 'Select the products you are interested in*';
        // productLabel.classList.add('product-label');
        // form.appendChild(productLabel);

        // // Create buttons for "Home Loan" and "Business Loan"
        // const productButtonsContainer = document.createElement('div');
        // productButtonsContainer.classList.add('product-buttons-container');

        // const createToggleButton = (text) => {
        //     const button = document.createElement('button');
        //     button.type = 'button';
        //     button.textContent = text;
        //     button.classList.add('product-button');
        //     button.addEventListener('click', () => {
        //         button.classList.toggle('active');
        //     });
        //     return button;
        // };

        // const homeLoanButton = createToggleButton('Home Loan');
        // const businessLoanButton = createToggleButton('Business Loan');

        // productButtonsContainer.appendChild(homeLoanButton);
        // productButtonsContainer.appendChild(businessLoanButton);

        // // Error field for loan type
        // const loanTypeError = document.createElement('div');
        // loanTypeError.classList.add('error-field');
        // loanTypeError.id = 'loan-type-error';

        // form.appendChild(productButtonsContainer);
        // form.appendChild(loanTypeError);

        // // Label for selecting location
        // const locationLabel = document.createElement('label');
        // locationLabel.textContent = 'Select location:';
        // locationLabel.classList.add('location-label');
        // form.appendChild(locationLabel);

        // // Create five location buttons
        // const locationButtonsContainer = document.createElement('div');
        // locationButtonsContainer.classList.add('location-buttons-container');

        // for (let i = 1; i <= 5; i++) {
        //     const button = createToggleButton(`Location ${i}`);
        //     locationButtonsContainer.appendChild(button);
        // }

        // // Error field for location
        // const locationError = document.createElement('div');
        // locationError.classList.add('error-field');
        // locationError.id = 'location-error';

        // form.appendChild(locationButtonsContainer);
        // form.appendChild(locationError);

        // // Create submit button
        // const submitButton = document.createElement('button');
        // submitButton.type = 'submit';
        // submitButton.textContent = 'Submit';
        // submitButton.classList.add('submit-button');
        // form.appendChild(submitButton);

        // // Append the form to the block
        // block.appendChild(form);

        // // Form submission handler
        // form.addEventListener('submit', (event) => {
        //     event.preventDefault(); // Prevent form submission

        //     // Clear previous errors
        //     document.querySelectorAll('.error-field').forEach((errorField) => {
        //         errorField.textContent = '';
        //     });

        //     let valid = true;

        //     // Validate input fields
        //     document.querySelectorAll('.form-input').forEach((input) => {
        //         if (!input.value.trim()) {
        //             valid = false;
        //             const errorField = document.getElementById(`${input.name}-error`);
        //             errorField.textContent = `${input.placeholder} is required.`;
        //         }
        //     });

        //     // Validate loan type selection
        //     const loanButtons = document.querySelectorAll('.product-button');
        //     const anyLoanSelected = Array.from(loanButtons).some(button => button.classList.contains('active'));

        //     if (!anyLoanSelected) {
        //         valid = false;
        //         const loanTypeError = document.getElementById('loan-type-error');
        //         loanTypeError.textContent = 'Please select a loan type.';
        //     }

        //     // Validate location selection
        //     const locationButtons = document.querySelectorAll('.location-button');
        //     const anyLocationSelected = Array.from(locationButtons).some(button => button.classList.contains('active'));

        //     if (!anyLocationSelected) {
        //         valid = false;
        //         const locationError = document.getElementById('location-error');
        //         locationError.textContent = 'Please select a location.';
        //     }

        //     if (valid) {
        //         // Submit the form or perform desired actions
        //         console.log('Form submitted successfully');
        //     } else {
        //         console.log('Form contains errors');
        //     }
        // });

        const form = document.querySelector('form[data-action="/become-a-partner"]');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission

        // Clear previous errors
        document.querySelectorAll('.error-field').forEach((errorField) => {
            errorField.textContent = '';
        });

        let valid = true;

        // Validate input fields
        ['username', 'usernumber', 'gmail'].forEach((fieldName) => {
            const input = document.getElementById(`form-${fieldName}`);
            if (!input.value.trim()) {
                valid = false;
                const errorField = document.createElement('div');
                errorField.classList.add('error-field');
                errorField.textContent = `${input.placeholder} is required.`;
                input.parentNode.appendChild(errorField);
            }
        });

        // Validate product selection
        const productCheckboxes = ['form-homeloanbtn', 'form-businessbtn'];
        const anyProductSelected = productCheckboxes.some(id => document.getElementById(id).checked);

        if (!anyProductSelected) {
            valid = false;
            const productErrorField = document.createElement('div');
            productErrorField.classList.add('error-field');
            productErrorField.textContent = 'Please select a loan type.';
            document.getElementById('form-select-the-products').appendChild(productErrorField);
        }

        // Validate location selection
        const locationCheckboxes = ['form-location1', 'form-location2', 'form-location3', 'form-location4', 'form-location5', 'form-location6'];
        const anyLocationSelected = locationCheckboxes.some(id => document.getElementById(id).checked);

        if (!anyLocationSelected) {
            valid = false;
            const locationErrorField = document.createElement('div');
            locationErrorField.classList.add('error-field');
            locationErrorField.textContent = 'Please select a location.';
            document.getElementById('form-select-location').appendChild(locationErrorField);
        }

        if (valid) {
            // Submit the form or perform desired actions
            console.log('Form submitted successfully');
            form.submit();
        } else {
            console.log('Form contains errors');
        }
    });
    } catch (error) {
        console.error('Error fetching or processing data:', error);
    }
}
