import { useState } from "react"
import Home from "./pages/home/Home.jsx"
import LogIn from "./pages/login/LogIn.jsx"
import { setDoc, doc } from "firebase/firestore";
import { db } from './firebase';
import CreateAcc from "./pages/make/CreateAcc.jsx"
import {Routes, Route,BrowserRouter} from "react-router-dom"
function App() {
  const [loggedIn,setLoggedIn] = useState(false);
  const [email,setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username,setUsername] = useState("");
  const [profPic, setProfPic] = useState(null);
  const [storePic,setStorePic] = useState(null);
  const saveUserData = async (uid,username, email) => {
    try {
        await setDoc(doc(db, "users", uid), {
        uid: uid,
        username: username,
        email: email,  
        profilePic: "",
        timestamp: new Date()
      });
      console.log("User data saved successfully!");
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path = "/make/CreateAcc" element={<CreateAcc storePic = {storePic} email = {email} setEmail = {setEmail} password = {password}
                                                   setPassword = {setPassword} username = {username} setUsername = {setUsername} saveUserData={saveUserData} />} />
        <Route path="/" element={<LogIn loggedIn={loggedIn} setLoggedIn={setLoggedIn} email = {email} setEmail = {setEmail}
                                  password = {password} setPassword = {setPassword} setProfPic={setProfPic} saveUserData={saveUserData} />} />
        <Route path="/home" element={<Home setStorePic = {setStorePic} profPic = {profPic} setProfPic = {setProfPic}/>} />

      </Routes>
    </BrowserRouter>
   
  )
}

export default App
