import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {auth,firebaseSignIn,provider} from "./../../firebase"
import { setDoc, doc,getDoc } from "firebase/firestore";
import { db } from './../../firebase';
import { signInWithPopup } from 'firebase/auth'
import style from "./LogIn.module.css"
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
export default function LogIn({setLoggedIn,email,setEmail,password,setPassword,setProfPic,saveUserData}) {

  const [showPassword,setShowPassword] = useState(false);
  const [error,setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e)=> {
      e.preventDefault(); 
      if(email.trim() == ""){
        setError("Please enter a valid email address.");
        return;
      }
      if(password.trim() == ""){
        setError("Please enter the password.");
        return;
      }
      try{
        const userCred = await firebaseSignIn(auth,email,password);
        console.log("Success signin", userCred);
        setLoggedIn(true);
        navigate("/home");
      }
        catch(err){
          if(err.code == "auth/invalid-credential"){
            setError("Invalid email address/password.");
          }
          console.log("SignIn fail", err);
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

  const handleCreateAcc = () =>{
      setEmail("");
      setPassword("");
      navigate("/make/CreateAcc");
  }

  return (
    <div className = {style.wrapper}>
    <div className = {style.container}>
        <div className = {style.welcomeText}>
          <h2>SocialZ</h2>
          <p>Connect with friends and the world around you on SocialZ</p>  
        </div>
        <div className={style.rightBox}>
          <div className = {error && style.errorMsg}>
            <h4>{error}</h4>
          </div>
        <div className = {style.formBox}>
          <form className={style.inputForm} onSubmit={handleLogin}>
            <div className={style.inputFields}>
              <input type="email" value = {email} onChange = {(e)=>{setEmail(e.target.value)}} placeholder = "Email" />
              <input type = {showPassword? "text":"password"} value = {password} onChange = {(e)=>{setPassword(e.target.value)}} placeholder = "Password" />
              <button className = {style.eyeBtn} onClick={() => setShowPassword(!showPassword)} type="button" >{showPassword?<VisibilityOffIcon/>:<VisibilityIcon/>}</button>
            </div>
            <button className = {style.loginBtn} type="submit">Log In</button>
            <p onClick={() => navigate('/forgot-password')} style={{ cursor: 'pointer', color: 'blue', textAlign: 'center', fontSize: '14px' }}>Forgot Password?</p>
            <div className = {style.createBtn}>
              <button type="button" onClick = {handleCreateAcc}>Create Account</button>
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
