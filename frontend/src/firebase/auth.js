import {auth} from "./firebase"
import { createUserWithEmailAndPassword,sendPasswordResetEmail,signInWithEmailAndPassword } from "firebase/auth"

export const doCreateUserWithEmailAndPassword = async(email,password) =>{
  return createUserWithEmailAndPassword(auth,email,password);
}

export const doSignInWithEmailAndPassword =(email,password)=>{
  return signInWithEmailAndPassword(auth,email,password);
}

export const doPasswordReset = (email)=>{
  return sendPasswordResetEmail(auth,email);
}