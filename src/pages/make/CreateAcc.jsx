import {useEffect, useState} from 'react'
import { auth, db,firebaseCreateAccount,provider} from './../../firebase';
import { setDoc, doc,getDoc } from "firebase/firestore";
import { signInWithPopup } from 'firebase/auth'
import style from "./CreateAcc.module.css"
import {useNavigate} from 'react-router-dom'

export default function CreateAcc({storePic,email,setEmail,password,setPassword,username,setUsername,saveUserData}) {
  const [confirmPassword,setConfirmPassword] = useState("");
  const [error,setError] = useState("");
  const navigate = useNavigate();

  const handleCreateAcc = async (e)=> {
      e.preventDefault(); 
      if(username.trim()==""){
        setError("Please enter a valid username.");
        return;
      }
      if(email.trim() == ""){
        setError("Please enter a valid email address.");
        return;
      }
      if(password.trim() == ""){
        setError("Please enter the password.");
        return;
      }
      if(confirmPassword.trim() == ""){
        setError("Please enter the password.");
        return;
      }
      if(password!==confirmPassword){
        setError("Passwords do not match.Try again.");
        return;
      }
      try{
        const userCred = await firebaseCreateAccount(auth,email,password);
        await saveUserData(userCred.user.uid,username,email);
        console.log("success creation", userCred)
        navigate("/home");
        }
        catch(err){
          if (err.code === "auth/weak-password") {
            setError("Password must have at least 6 characters.");
          } else if (err.code === "auth/email-already-in-use") {
            setError("This email is already registered.");
          } else {
            setError("Failed to create account. Please try again.");
          }
        }
  }

    const handleGoogleSignIn = async ()=>{
      try{
        const result = await signInWithPopup(auth,provider);
        const user = result.user;
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
  
        if (!userDocSnap.exists()) {
          await setDoc(userDocRef, {
            username: user.displayName,
            email: user.email,
            profilePic: user.photoURL,
            createdAt: new Date(),
          });
          console.log("New user added to Firestore.");
        } else {
          console.log("User already exists. Logging in.");
      }
          navigate("/home");
      }catch(err){
        console.error("Google sign-in failed",err)
      }
    }

  const handleLogin = () =>{
    setEmail("");
    setPassword("");
    setUsername("");
    setConfirmPassword("");
    navigate("/");
  }

  return (
    <div className = {style.wrapper}>
    <div className = {style.container}>
        <div className = {style.welcomeText}>
          <h2>SocialZ</h2>
          <p>Connect with friends and the world around you on SocialZ</p>  
        </div>
        <div className = {style.rightBox}>
          <div className={error && style.errorMsg}>
            <h4>{error}</h4>
          </div>
        <div className = {style.formBox}>
          <form className={style.inputForm} onSubmit={handleCreateAcc}>
            <div className={style.inputFields}>
              <input type = "text" value = {username} onChange = {(e)=>{setUsername(e.target.value)}} placeholder = "Username" />
              <input type="email" value = {email} onChange = {(e)=>{setEmail(e.target.value)}} placeholder = "Email" />
              <input type = "password" value = {password} onChange = {(e)=>{setPassword(e.target.value)}} placeholder = "Password" />
              <input type = "password" value = {confirmPassword} onChange = {(e)=>{setConfirmPassword(e.target.value)}} placeholder = "Confirm Password" />
            </div>
            <button className = {style.loginBtn} type="submit">Create Account</button>
            <div className = {style.createBtn}>
              <button type="button" onClick = {handleLogin}>Log In to account</button>
            </div>

          </form>
          <div className = {style.googleBtn}>
            <button onClick={handleGoogleSignIn}>Sign In with </button>
            <img src = "./../../assets/googleicon.png" className={style.gIcon} />
          </div>
        </div>  
    </div>
  </div>
  </div>
  )
}
