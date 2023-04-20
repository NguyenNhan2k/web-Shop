function Validator(options) {
    const formElement = document.querySelector(options.form);
    const selectorRules = {};
    function validate(inputElement, rule) {
        const value = inputElement.value;
        var errorMessage;
        const errorElement = inputElement.parentElement.querySelector(options.errSelector);
        const rules = selectorRules[rule.selector];
        for (var i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value);
            if (errorMessage) break;
        }
        if (errorMessage) {
            errorElement.innerHTML = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        } else {
            errorElement.innerHTML = '';
            inputElement.parentElement.classList.remove('invalid');
        }
        return !errorMessage;
    }

    if (formElement) {
        formElement.onsubmit = (e) => {
            e.preventDefault();
            var isFormValid = true;
            // Lặp qua các rule và valid
            options.rules.forEach((rule) => {
                const inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if (!isValid) {
                    isFormValid = false;
                }
            });
            if (isFormValid) {
                formElement.submit();
            }
        };
        options.rules.forEach((rule) => {
            // Lưu các rules lại
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.selector);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }
            const inputElement = formElement.querySelector(rule.selector);
            const errorElement = inputElement.parentElement.querySelector(options.errSelector);
            inputElement.onblur = () => {
                validate(inputElement, rule);
            };
            inputElement.oninput = () => {
                errorElement.innerHTML = '';
                inputElement.parentElement.classList.remove('invalid');
            };
        });
        console.log(selectorRules);
    }
}
Validator.isRequired = (selector) => {
    return {
        selector,
        test: (value) => {
            return value.trim() ? undefined : '* Vui lòng Nhập trường này !';
        },
    };
};
Validator.isEmail = (selector) => {
    return {
        selector,
        test: (value) => {
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : '* Trường này phải là email !';
        },
    };
};
