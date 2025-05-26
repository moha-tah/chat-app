document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById("password");
  const submitButton = document.getElementById("submit-button");
  const validationRulesContainer = document.getElementById(
    "password-validation-rules"
  );
  const strengthContainer = document.getElementById(
    "password-strength-container"
  );
  const strengthText = document.getElementById("password-strength-text");
  const strengthBar = document.getElementById("password-strength-bar");

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
    let criteriaMetCount = 0;

    // For the update form, if the password field is empty, hide rules and strength, enable button
    if (isUpdateForm && password === "") {
      if (validationRulesContainer)
        validationRulesContainer.style.display = "none";
      if (strengthContainer) strengthContainer.style.display = "none";
      updateValidationStatus(lengthCheck, false, true);
      updateValidationStatus(uppercaseCheck, false, true);
      updateValidationStatus(specialCheck, false, true);
      updateValidationStatus(numberCheck, false, true);
      if (submitButton) submitButton.disabled = false;
      updateStrengthIndicator(0);
      return true;
    } else {
      if (validationRulesContainer)
        validationRulesContainer.style.display = "block";
      if (strengthContainer) strengthContainer.style.display = "block";
    }

    const isLengthValid = password.length >= 13;
    updateValidationStatus(lengthCheck, isLengthValid);
    if (isLengthValid) criteriaMetCount++;
    else allConditionsMet = false;

    const uppercaseMatches = password.match(/[A-Z]/g) || [];
    const isUppercaseValid = uppercaseMatches.length >= 2;
    updateValidationStatus(uppercaseCheck, isUppercaseValid);
    if (isUppercaseValid) criteriaMetCount++;
    else allConditionsMet = false;

    const specialMatches =
      password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g) || [];
    const isSpecialValid = specialMatches.length >= 2;
    updateValidationStatus(specialCheck, isSpecialValid);
    if (isSpecialValid) criteriaMetCount++;
    else allConditionsMet = false;

    const numberMatches = password.match(/[0-9]/g) || [];
    const isNumberValid = numberMatches.length >= 3;
    updateValidationStatus(numberCheck, isNumberValid);
    if (isNumberValid) criteriaMetCount++;
    else allConditionsMet = false;

    updateStrengthIndicator(criteriaMetCount);

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

  function updateStrengthIndicator(count) {
    if (!strengthText || !strengthBar) return;

    let strengthLabel = "";
    let barClass = "";
    let barWidth = "0%";

    switch (count) {
      case 0:
        strengthLabel = "Très faible";
        barClass = "bg-danger";
        barWidth = "10%";
        break;
      case 1:
        strengthLabel = "Faible";
        barClass = "bg-danger";
        barWidth = "25%";
        break;
      case 2:
        strengthLabel = "Moyen";
        barClass = "bg-warning";
        barWidth = "50%";
        break;
      case 3:
        strengthLabel = "Fort";
        barClass = "bg-info";
        barWidth = "75%";
        break;
      case 4:
        strengthLabel = "Très fort";
        barClass = "bg-success";
        barWidth = "100%";
        break;
      default:
        strengthLabel = "";
        barClass = "";
        barWidth = "0%";
    }

    strengthText.textContent = strengthLabel;
    strengthBar.style.width = barWidth;
    strengthBar.className = "progress-bar";
    if (barClass) {
      strengthBar.classList.add(barClass);
    }
  }

  if (passwordInput) {
    validatePassword();
    passwordInput.addEventListener("input", validatePassword);
  } else if (submitButton) {
    submitButton.disabled = false;
  }
});




