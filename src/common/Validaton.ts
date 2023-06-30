 // Check if email is valid
 
 export const isValidEmail = (email:string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };
  
 
   export const validateEmpty = (field: string) => {
     return field.length === 0;
   };
 
   export const validateFirstName = (name: string) => {
     var re = /^[\sa-zA-Z0-9-]+$/i;
     return re.test(name);
   };
   
   export const validateLastName = (name: string) => {
     var re = /^[\sa-zA-Z0-9-]+$/i;
     return re.test(name);
   };
 
   export const validatePassword = (password: string) => {
     var re = /^(?=.{8,}).*$/;
     return re.test(password);
   };
   
   export const validateNumber = (number: string) => {
     var re = /^[0-9]+$/i;
     return re.test(number);
   };
   
   export const validateName = (name: string) => {
     var re = /^[a-zA-Z]+$/i;
     return re.test(name);
   };
   export const validateAddress = (name: string) => {
     var re = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/
     console.log(name,re.test(name))
     return re.test(name.trim());
   };
   