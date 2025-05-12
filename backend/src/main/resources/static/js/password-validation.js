document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById("password");
  const submitButton = document.getElementById("submit-button");
  const validationRulesContainer = document.getElementById(
    "password-validation-rules"
  );

  const lengthCheck = document.getElementById("length-check");
  const uppercaseCheck = document.getElementById("uppercase-check");
  const specialCheck = document.getElementById("special-check");
  const numberCheck = document.getElementById("number-check");

  const iconSuccessClass = "bi-check-lg text-success";
  const iconErrorClass = "bi-x-lg text-danger";

  // Determine if this is the update form by checking the placeholder text
  const isUpdateForm =
    passwordInput &&
    passwordInput.placeholder === "Laisser vide pour ne pas changer";

  function validatePassword() {
    const password = passwordInput.value;
    let allConditionsMet = true;

    // For the update form, if the password field is empty, it's considered valid (don't change password)
    if (isUpdateForm && password === "") {
      if (validationRulesContainer)
        validationRulesContainer.style.display = "none";
      updateValidationStatus(lengthCheck, false, true);
      updateValidationStatus(uppercaseCheck, false, true);
      updateValidationStatus(specialCheck, false, true);
      updateValidationStatus(numberCheck, false, true);
      if (submitButton) submitButton.disabled = false;
      return true; // Allow submission if password field is empty on update form
    } else {
      if (validationRulesContainer)
        validationRulesContainer.style.display = "block";
    }

    const isLengthValid = password.length >= 13;
    updateValidationStatus(lengthCheck, isLengthValid);
    if (!isLengthValid) allConditionsMet = false;

    const uppercaseMatches = password.match(/[A-Z]/g) || [];
    const isUppercaseValid = uppercaseMatches.length >= 2;
    updateValidationStatus(uppercaseCheck, isUppercaseValid);
    if (!isUppercaseValid) allConditionsMet = false;

    const specialMatches =
      password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g) || [];
    const isSpecialValid = specialMatches.length >= 2;
    updateValidationStatus(specialCheck, isSpecialValid);
    if (!isSpecialValid) allConditionsMet = false;

    const numberMatches = password.match(/[0-9]/g) || [];
    const isNumberValid = numberMatches.length >= 3;
    updateValidationStatus(numberCheck, isNumberValid);
    if (!isNumberValid) allConditionsMet = false;

    if (submitButton) {
      submitButton.disabled = !allConditionsMet;
    }
    return allConditionsMet;
  }

  function updateValidationStatus(element, isValid, isNeutral = false) {
    const icon = element.querySelector("i");
    if (isNeutral) {
      icon.className = `bi ${iconErrorClass} me-1`;
    } else if (isValid) {
      icon.className = `bi ${iconSuccessClass} me-1`;
    } else {
      icon.className = `bi ${iconErrorClass} me-1`;
    }
  }

  if (passwordInput) {
    validatePassword(); // Initial validation check
    passwordInput.addEventListener("input", validatePassword);
  } else if (submitButton) {
    submitButton.disabled = false;
  }
});
