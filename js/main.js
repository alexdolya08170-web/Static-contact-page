(function () {
    "use strict";

    var form = document.getElementById("contact-form");
    var statusEl = document.getElementById("form-status");
    var yearEl = document.getElementById("year");

    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }

    if (!form || !statusEl) {
        return;
    }

    var fields = {
        name: {
            input: document.getElementById("contact-name"),
            error: document.getElementById("error-name"),
        },
        email: {
            input: document.getElementById("contact-email"),
            error: document.getElementById("error-email"),
        },
        phone: {
            input: document.getElementById("contact-phone"),
            error: document.getElementById("error-phone"),
        },
        message: {
            input: document.getElementById("contact-message"),
            error: document.getElementById("error-message"),
        },
        consent: {
            input: document.getElementById("contact-consent"),
            error: document.getElementById("error-consent"),
        },
    };

    var phonePattern = /^[\d\s()+\-]{7,}$/;

    function setFieldInvalid(fieldKey, invalid) {
        var f = fields[fieldKey];
        if (!f || !f.input) {
            return;
        }
        var el = f.input;
        if (el.type === "checkbox") {
            el.classList.toggle("contact-form__checkbox--invalid", invalid);
        } else if (el.tagName === "TEXTAREA") {
            el.classList.toggle("contact-form__textarea--invalid", invalid);
        } else {
            el.classList.toggle("contact-form__input--invalid", invalid);
        }
        el.setAttribute("aria-invalid", invalid ? "true" : "false");
    }

    function showError(fieldKey, message) {
        var f = fields[fieldKey];
        if (f && f.error) {
            f.error.textContent = message || "";
        }
        setFieldInvalid(fieldKey, Boolean(message));
    }

    function clearErrors() {
        Object.keys(fields).forEach(function (key) {
            showError(key, "");
        });
    }

    function validateName(value) {
        var v = (value || "").trim();
        if (!v) {
            return "Укажите имя.";
        }
        if (v.length < 2) {
            return "Имя слишком короткое.";
        }
        return "";
    }

    function validateEmail(value) {
        var v = (value || "").trim();
        if (!v) {
            return "Укажите email.";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
            return "Некорректный email.";
        }
        return "";
    }

    function validatePhone(value) {
        var v = (value || "").trim();
        if (!v) {
            return "";
        }
        if (!phonePattern.test(v)) {
            return "Проверьте формат телефона.";
        }
        return "";
    }

    function validateMessage(value) {
        var v = (value || "").trim();
        if (!v) {
            return "Введите сообщение.";
        }
        if (v.length < 10) {
            return "Сообщение слишком короткое (минимум 10 символов).";
        }
        return "";
    }

    function validateConsent(checked) {
        if (!checked) {
            return "Нужно согласие на обработку данных.";
        }
        return "";
    }

    function setStatus(message, isError) {
        statusEl.textContent = message;
        statusEl.classList.toggle("visually-hidden", !message);
        statusEl.classList.toggle("contact-form__status--error", Boolean(isError));
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        clearErrors();
        setStatus("");

        var nameErr = validateName(fields.name.input && fields.name.input.value);
        var emailErr = validateEmail(fields.email.input && fields.email.input.value);
        var phoneErr = validatePhone(fields.phone.input && fields.phone.input.value);
        var msgErr = validateMessage(fields.message.input && fields.message.input.value);
        var consentErr = validateConsent(fields.consent.input && fields.consent.input.checked);

        showError("name", nameErr);
        showError("email", emailErr);
        showError("phone", phoneErr);
        showError("message", msgErr);
        showError("consent", consentErr);

        if (nameErr || emailErr || phoneErr || msgErr || consentErr) {
            setStatus("Исправьте ошибки в форме.", true);
            var first = form.querySelector('[aria-invalid="true"]');
            if (first) {
                first.focus();
            }
            return;
        }

        var submitBtn = form.querySelector(".contact-form__submit");
        if (submitBtn) {
            submitBtn.disabled = true;
        }

        setTimeout(function () {
            setStatus("Спасибо! Сообщение отправлено (демо: данные не уходят на сервер).", false);
            form.reset();
            clearErrors();
            if (submitBtn) {
                submitBtn.disabled = false;
            }
        }, 400);
    });

    ["name", "email", "phone", "message"].forEach(function (key) {
        var f = fields[key];
        if (!f || !f.input) {
            return;
        }
        f.input.addEventListener("blur", function () {
            var err = "";
            if (key === "name") {
                err = validateName(f.input.value);
            } else if (key === "email") {
                err = validateEmail(f.input.value);
            } else if (key === "phone") {
                err = validatePhone(f.input.value);
            } else if (key === "message") {
                err = validateMessage(f.input.value);
            }
            showError(key, err);
        });
    });

    if (fields.consent.input) {
        fields.consent.input.addEventListener("change", function () {
            showError("consent", validateConsent(fields.consent.input.checked));
        });
    }
})();
