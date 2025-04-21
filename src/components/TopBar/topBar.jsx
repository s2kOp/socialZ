import { useState, useEffect } from "react";
import {auth,db} from "../../firebase";
import { updateDoc,getDoc, doc } from "firebase/firestore";
import style from "./TopBar.module.css";
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { onAuthStateChanged } from "firebase/auth";

export default function topBar({setStorePic,profPic,setProfPic}) {
  const [search,setSearch] = useState("");


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth,async (user)  => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          const pic = data.profilePic;
          if (pic) {
            setProfPic(pic);
          }
        }
      }
    })

    return () => unsubscribe();
  },[]);

  useEffect(() => {
    const fetchProfilePic = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          const pic = data.profilePic;
  
          if (pic) {
            setProfPic(pic); // This could be base64 or Google photo URL
          }
        }
      }
    };

    fetchProfilePic();
  },[]);
  const convertImageToBase64 = async (file) =>{
    return new Promise((resolve,reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    }
    reader.onerror = reject;
    reader.readAsDataURL(file);
  })
  }
  const handleImageAdd = async (e) =>{
    const profileImage = e.target.files[0];

    if(profileImage){
      let imageURL = URL.createObjectURL(profileImage);
      setProfPic(imageURL);
      setStorePic(profileImage);
      const base64Image = await convertImageToBase64(profileImage);
      const user = auth.currentUser;
      if (user) {
      await updateDoc(doc(db, "users", user.uid), {
        profilePic: base64Image
      });
      console.log("Profile picture updated in Firestore");
    }
   }
}

  return (
    <div className={style.container}>
      <div className={style.topLeft}>
        <span className={style.appName}>SocialZ</span>
      </div>
      <div className={style.topCenter}>
      <div className={style.searchIcon}>
            <SearchIcon />
        </div>
        <input className={style.searchBar} value = {search} type="text" onChange={(e)=>{setSearch(e.target.value)}} placeholder="Search for a friend, post or video"></input>
      </div>
      <div className={style.topRight}>
        <div className={style.rightTexts}>
            <a href="#">Homepage</a>
            <a href = "#">Timeline</a>
        </div>
        <div className={style.tripleIcons}>
            <PersonIcon className={style.icon1}/>
            <MessageIcon className={style.icon2}/>
            <NotificationsIcon className={style.icon3}/>
        </div>
        <div className={style.profileContainer}>
            <img src = {profPic || "./../../assets/defaultprofile.png"} className={style.profPrev} />
            <input type="file" accept="image/*" className={style.profIcon} onChange={handleImageAdd}/>
        </div>
      </div>
    </div>
  )
}
