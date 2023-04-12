let urlAPI = "https://todo-api.ctd.academy/v1";

function createUser(jwt) {
  sessionStorage.setItem('jwt', jwt)
  location.href = "./dashboard.html"
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
      const errorIcon = inputGroup.querySelector('.error-icon');
      const successIcon = inputGroup.querySelector('.success-icon');

      let inputGroupError = false;
      for(const option of validationOptions){
          if(input.hasAttribute(option.attribute) && !option.isValid(input)) {
              errorContainer.textContent = option.errorMessage(input, label);
              input.classList.add('err');
              input.classList.remove('success');
              // successIcon.classList.add('hidden');
              // errorIcon.classList.remove('hidden');
              inputGroupError = true;
          }
      }
      if(!inputGroupError) {
          errorContainer.textContent = '';
          input.classList.add('success');
          input.classList.remove('err');
          // successIcon.classList.remove('hidden');
          // errorIcon.classList.add('hidden');
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
    fetch(`${urlAPI}/users`, config)
      .then(response => {
        console.log(response.status) 
      if (response.status == 201 || response.status == 200) {
        return response.json()
      } else {
        throw response
      }    
      }).then(res => {
        console.log(res.jwt)
        createUser(res.jwt)
      }
      )
  }
});
});
};

const sendToAPI = (formElement) => {
  const formObject = Array.from(formElement.elements)
  .filter(element => element.type !== 'submit')
  .slice(0, 4)
  .reduce(
    (accumulator, element) => ({
      ...accumulator, 
      [element.id]: element.value.toLowerCase(),
  }), 
    {}
  );
 
  return formObject

  // console.log(formObject);
  // sessionStorage.setItem('formObject', JSON.stringify(formObject));
  //     let config = {
  //     method: 'POST',
  //     body: JSON.stringify(formObject),
  //     headers: {
  //       'Content-type': 'application/json'
  //     }
  //   }
  //   fetch(`${urlAPI}/users`,config)
  //     .then(response => {
  //       console.log(response.status)
  //     })

//     submit to API
};


validateForm('.loginForm')
.then(formElement =>{
  console.log('Promise resolved');
  sendToAPI(formElement);
}) ;





// let urlAPI = "https://todo-api.ctd.academy/v1";

// const validateForm = (formSelector) => {
//     return new Promise((resolve, reject) => {
//     const formElement = document.querySelector(formSelector);

//     const validationOptions = [
//         {
//             attribute: 'minlength',
//             isValid: input =>
//               input.value && input.value.length >= parseInt(input.minLength, 10),
//             errorMessage: (input, label) =>
//               `${label.textContent} needs to be at least ${input.minLength} characters`,
//           },
//           {
//             attribute: 'custommaxlength',
//             isValid: input =>
//               input.value &&
//               input.value.length <=
//                 parseInt(input.getAttribute('custommaxlength'), 10),
//             errorMessage: (input, label) =>
//               `${label.textContent} needs to be less than ${input.getAttribute(
//                 'custommaxlength'
//               )} characters`,
//           },
//           {
//             attribute: 'pattern',
//             isValid: input => {
//                 const patternRegex = new RegExp(input.pattern);
//                 return patternRegex.test(input.value);
//             },
//             errorMessage: (input, label) => `Not a valid ${label.textContent}`,
//           },
//           {
//             attribute: 'match',
//             isValid: input => {
//               const matchSelector = input.getAttribute('match');
//               const matchedElem = document.querySelector(`#${matchSelector}`);
//               return matchedElem && matchedElem.value.trim() === input.value.trim();
//             },
//             errorMessage: (input, label) => {
//               const matchSelector = input.getAttribute('match');
//               const matchedElem = document.querySelector(`#${matchSelector}`);
//               const matchedLabel =
//                 matchedElem.previousElementSibling;
//               return `${label.textContent} should match ${matchedLabel.textContent}`;
//             },
//           },          
//         {
//             attribute: 'required',
//             isValid: input => input.value.trim() !== '' ,
//             errorMessage: (input, label) => `${label.textContent} is required`
//         },
//     ];

//     const validateSingleInputGroup = inputGroup => {
//         const label = inputGroup.querySelector('label');
//         const input = inputGroup.querySelector('input');
//         const errorContainer = inputGroup.querySelector('.error');
//         const errorIcon = inputGroup.querySelector('.error-icon');
//         const successIcon = inputGroup.querySelector('.success-icon');

//         let inputGroupError = false;
//         for(const option of validationOptions){
//             if(input.hasAttribute(option.attribute) && !option.isValid(input)) {
//                 errorContainer.textContent = option.errorMessage(input, label);
//                 input.classList.add('err');
//                 input.classList.remove('success');
//                 // successIcon.classList.add('hidden');
//                 // errorIcon.classList.remove('hidden');
//                 inputGroupError = true;
//             }
//         }
//         if(!inputGroupError) {
//             errorContainer.textContent = '';
//             input.classList.add('success');
//             input.classList.remove('err');
//             // successIcon.classList.remove('hidden');
//             // errorIcon.classList.add('hidden');
//         }

//         return !inputGroupError;
//     };

//     formElement.setAttribute('novalidate', '');

//     Array.from(formElement.elements).forEach(element => {
//      element.addEventListener('blur', (e) => {
//         validateSingleInputGroup((e).srcElement.parentElement)
//      });
//   });

// const validateAllInputGroups = formToValidate => {
//     const inputGroups = Array.from(formToValidate.querySelectorAll('.input-group')
//     );
    
//     return inputGroups.every(inputGroup => validateSingleInputGroup(inputGroup));
//     };

// formElement.addEventListener('submit', (e) => {
//     (e).preventDefault();
//     const formValid = validateAllInputGroups(formElement);
    
//     if (formValid) {
//         resolve(formElement);
//         console.log('Form is valid');
//         sendToAPI(this)
//     }
//   });
// });
// };

// const sendToAPI = (formElement) => {
//     const formObject = Array.from(formElement.elements)
//     .filter(element => element.type !== 'submit')
//     .slice(0, 4)
//     .reduce(
//       (accumulator, element) => ({
//         ...accumulator, 
//         [element.id]: element.value,
//     }), 
//       {}
//     );
   
//     console.log(formObject);
//     sessionStorage.setItem('formObject', JSON.stringify(formObject));
//     // let signingUp = sessionStorage.getItem('formObject');
//     let config = {
//       method: 'POST',
//       body: formObject,
//       headers: {
//         'Content-type': 'application/json'
//       }
//     }
//     fetch(`${urlAPI}/users`, config )
//       .catch(response => {
//         console.log(response.status)
//       })

//     submit to API
// };


// validateForm('.loginForm')
// .then(formElement =>{
//     console.log('Promise resolved');
//     sendToAPI(formElement);
// }) ;

