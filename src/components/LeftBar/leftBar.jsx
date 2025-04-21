import React, { useEffect, useState } from 'react'
import style from "./leftBar.module.css"
import RssFeedIcon from '@mui/icons-material/RssFeed';
import ChatIcon from '@mui/icons-material/Chat';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import GroupsIcon from '@mui/icons-material/Groups';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import HelpIcon from '@mui/icons-material/Help';
import EventIcon from '@mui/icons-material/Event';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import SchoolIcon from '@mui/icons-material/School';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function leftBar() {
  const [users,setUsers] = useState([]);


  const fetchUsers = async () =>{
    const userNow = await auth.currentUser;
    const snapShot = await getDocs(collection(db,"users"));
    console.log("Snapshot: ", snapShot);
    const userList = snapShot.docs.map((doc) => ({
        id : doc.id,
        name : doc.data().username,
        icon : doc.data().profilePic,
    }))
    const filterUsers = userList.filter((user) => 
        user.id !== userNow.uid && user.id !== "uid"
      );
    setUsers(filterUsers);
    console.log(filterUsers);
  }
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userNow) => {
    if (userNow) {
      fetchUsers(userNow);
    }
  });
  
    return () => unsubscribe();
  },[]);

  return (
    <div className = {style.wrapper}>
      <div className = {style.iconList}>
        <ul >
            <li><RssFeedIcon /> <span>Feed</span></li>
            <li><ChatIcon /> <span>Chats</span></li>
            <li><PlayCircleIcon /> <span>Videos</span></li>
            <li><GroupsIcon /> <span>Groups</span></li>
            <li><BookmarkIcon /> <span>Bookmarks</span></li>
            <li><HelpIcon /> <span>Questions</span></li>
            <li><EventIcon /> <span>Events</span></li>
            <li><WorkOutlineIcon /> <span>Jobs</span></li>
            <li><SchoolIcon /> <span>Courses</span></li>

        </ul>
        <button>Show More</button>
      </div>
      <div className = {style.hrLine}><hr></hr></div>
      <div className = {style.usersList}>
        <ul>
        {users.map((user) =>{ 
            return(<li key = {user.id}><img src = {user.icon ? user.icon : "./../../assets/defaultprofile.png"} /><span>{user.name}</span></li>)
        })}
        </ul>
      </div>
    </div>
  )
}
