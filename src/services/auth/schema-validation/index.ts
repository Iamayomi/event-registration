import Joi, { required } from "joi";
import { joiPasswordExtendCore, type JoiPasswordExtend } from "joi-password";

const joiPassword = Joi.extend(joiPasswordExtendCore) as JoiPasswordExtend;

/*=======================================SIGNUP SCHEMA STARTS HERE=======================================*/
/** Joi Validation Schema for signup data */
export const SignUpDataSchema = Joi.object({
  name: Joi.string(),

  email: Joi.string().email({ minDomainSegments: 2 }),

  phone: Joi.alternatives(),
  password: Joi.string()
    .min(6)
    // .minOfSpecialCharacters(1)
    // .minOfLowercase(1)
    // .minOfUppercase(1)
    // .minOfNumeric(1)
    // .noWhiteSpaces()
    // .onlyLatinCharacters()
    .max(30)
    .required(),
}).required();

/*=======================================SIGNUP SCHEMA ENDS HERE=======================================*/

/** Joi Validation Schema for email verification data */
export const VerifyEmailDataSchema = Joi.object({
  verification_code: Joi.string().trim().required(),
});

/** Joi Validation Schema for login data */
export const LoginDataSchema = Joi.object({
  email: Joi.string().trim().required(),
  password: Joi.string().trim().required(),
});

/** Joi Validation Schema for email data */
export const EmailDataSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
});

/** Joi Validation Schema for reset password code */
export const ResetPasswordSchema = Joi.object({
  password_reset_code: Joi.string().trim().required(),
});

/** Joi Validation Schema for new password after reset */
export const NewPasswordSchema = Joi.object({
  new_password: joiPassword.string().min(6).minOfSpecialCharacters(1).minOfLowercase(1).minOfUppercase(1).minOfNumeric(1).noWhiteSpaces().onlyLatinCharacters().max(30).required(),

  confirm_password: Joi.ref("new_password"),
}).with("new_password", "confirm_password");
