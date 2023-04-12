let urlAPI = "https://todo-api.ctd.academy/v1";

function loginUser(jwt) {
  sessionStorage.setItem('jwt', jwt)
  location.href = "./teste.html"
}

const validateForm = (formSelector) => {
    return new Promise((resolve, reject) => {
    const formElement = document.querySelector(formSelector);

    const validationOptions = [
        {
            attribute: 'minlength',
            isValid: input =>
              input.value && input.value.length >= parseInt(input.minLength, 10),
            errorMessage: (input, label) =>
              `${label.textContent} needs to be at least ${input.minLength} characters`,
          },
          {
            attribute: 'custommaxlength',
            isValid: input =>
              input.value &&
              input.value.length <=
                parseInt(input.getAttribute('custommaxlength'), 10),
            errorMessage: (input, label) =>
              `${label.textContent} needs to be less than ${input.getAttribute(
                'custommaxlength'
              )} characters`,
          },
          {
            attribute: 'pattern',
            isValid: input => {
                const patternRegex = new RegExp(input.pattern);
                return patternRegex.test(input.value);
            },
            errorMessage: (input, label) => `Not a valid ${label.textContent}`,
          },
          {
            attribute: 'match',
            isValid: input => {
              const matchSelector = input.getAttribute('match');
              const matchedElem = document.querySelector(`#${matchSelector}`);
              return matchedElem && matchedElem.value.trim() === input.value.trim();
            },
            errorMessage: (input, label) => {
              const matchSelector = input.getAttribute('match');
              const matchedElem = document.querySelector(`#${matchSelector}`);
              const matchedLabel =
                matchedElem.previousElementSibling;
              return `${label.textContent} should match ${matchedLabel.textContent}`;
            },
          },          
        {
            attribute: 'required',
            isValid: input => input.value.trim() !== '' ,
            errorMessage: (input, label) => `${label.textContent} is required`
        },
    ];

    const validateSingleInputGroup = inputGroup => {
        const label = inputGroup.querySelector('label');
        const input = inputGroup.querySelector('input');
        const errorContainer = inputGroup.querySelector('.error');
        const loginButton = formElement.querySelector('#loginButton');

        let inputGroupError = false;
        for(const option of validationOptions){
            if(input.hasAttribute(option.attribute) && !option.isValid(input)) {
                errorContainer.textContent = option.errorMessage(input, label);
                input.classList.add('err');
                input.classList.remove('success');
                loginButton.setAttribute('disabled', '');
                inputGroupError = true;
            }
        }
        if(!inputGroupError) {
            errorContainer.textContent = '';
            input.classList.add('success');
            input.classList.remove('err');
            loginButton.removeAttribute('disabled');
        }

        return !inputGroupError;
    };

    formElement.setAttribute('novalidate', '');

    Array.from(formElement.elements).forEach(element => {
     element.addEventListener('blur', (e) => {
        validateSingleInputGroup((e).srcElement.parentElement)
     });
  });

const validateAllInputGroups = formToValidate => {
    const inputGroups = Array.from(formToValidate.querySelectorAll('.input-group')
    );
    
    return inputGroups.every(inputGroup => validateSingleInputGroup(inputGroup));
    };

    formElement.addEventListener('submit', (e) => {
      (e).preventDefault();
      const formValid = validateAllInputGroups(formElement);
      let enviarAPI = sendToAPI(formElement);
      if (formValid) {
          resolve(formElement);
          console.log('Form is valid');
          // sendToAPI(formElement)
          sessionStorage.setItem('formObject', JSON.stringify(enviarAPI));
          let config = {
          method: 'POST',
          body: JSON.stringify(enviarAPI),
          headers: {
            'Content-type': 'application/json'
          }
        }
        fetch(`${urlAPI}/users/login`, config)
          .then(response => {
            console.log(response.status) 
          if (response.status == 201 || response.status == 200) {
            return response.json()
          } else if (response.status == 400 || response.status == 404 ) {
            return alert('Account not found, please create an account.')
          } else if (response.status == 500 || response.status == 503 ) {
            return alert('Service unavailable, try again later.')
          }
          else {
            throw response
          }    
          }).then(res => {
            console.log(res.jwt)
            loginUser(res.jwt)
          }
          )
      }
    });
    });
    };
    

const sendToAPI = (formElement) => {
    const formObject = Array.from(formElement.elements)
    .filter(element => element.type !== 'submit')
    .reduce(
      (accumulator, element) => ({
        ...accumulator, 
        [element.id]: element.value,
    }), 
      {}
    );
    return formObject;
    // console.log(formObject);
    // localStorage.setItem('formObject', JSON.stringify(formObject));

     //submit to API
};

 


validateForm('.loginForm')
.then(formElement =>{
    console.log('Promise resolved');
    sendToAPI(formElement);
}) ;