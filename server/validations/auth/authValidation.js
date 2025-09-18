export const validateRegistration = (inputs) => {
    const errors = {};

    // Define rules for each field
    const rules = {
        firstName: { required: true },
        lastName: { required: true },
        userName: { required: true },
        email: { required: true, type: "email" },
        password: { required: true, minLength: 6 },
        confirmPassword: { required: true, match: "password" },
    };

    for (const [field, rule] of Object.entries(rules)) {
        const value = inputs[field];

        if (rule.required && (!value || value.trim() === "")) {
        errors[field] = `${field} is required`;
        continue;
        }

        if (rule.type === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errors[field] = "Invalid email format";
        }
        }

        if (rule.minLength && value && value.length < rule.minLength) {
        errors[field] = `${field} must be at least ${rule.minLength} characters`;
        }

        if (rule.match && value && value !== inputs[rule.match]) {
        errors[field] = `${field} does not match ${rule.match}`;
        }
    }

    return errors;
};

export const validateLogin = (inputs) => {
    const errors = {};

    // Define rules for login
    const rules = {
        email: { required: true, type: "email" },
        password: { required: true },
    };

    for (const [field, rule] of Object.entries(rules)) {
        const value = inputs[field];

        if (rule.required && (!value || value.trim() === "")) {
        errors[field] = `${field} is required`;
        continue;
        }

        if (rule.type === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errors[field] = "Invalid email format";
        }
        }

        if (rule.minLength && value && value.length < rule.minLength) {
        errors[field] = `${field} must be at least ${rule.minLength} characters`;
        }
    }

    return errors;
};

const authValidation = { validateRegistration, validateLogin };

export default authValidation;