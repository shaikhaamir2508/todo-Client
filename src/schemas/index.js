import * as yup from 'yup';

export const signupSchema = yup.object({
    name:yup.string().min(3).max(15).required("please enter your name"),
    email:yup.string().email().required("please enter your email"),
    password:yup.string().min(6).required("please enter your password"),
    cpassword:yup.string().required().oneOf([yup.ref('password'),null],'password must match')
})