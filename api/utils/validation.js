const Joi = require('joi');

const emailSchema = Joi.object({
    email: Joi.string().email().required().error(new Error('Please enter a valid email'))
});

const passwordSchema = Joi.object({
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required().error(new Error('Password must be between 3 and 30 characters long and contain only letters and numbers.'))
});

module.exports = {
    emailValidation: (email) => emailSchema.validate(email, { abortEarly: false }),
    passwordValidation: (password) => passwordSchema.validate(password, { abortEarly: false })
}
