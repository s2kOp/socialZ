import { useState,useEffect } from 'react';
import style from "./feed.module.css";
import {auth,db} from "../../firebase";
import { addDoc,getDoc,getDocs, doc,updateDoc,collection} from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import LabelIcon from '@mui/icons-material/Label';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function feed({profPic}) {

  const [nameUser,setNameUser] = useState("");
  const [file,setFile] = useState(null);
  const [posts,setPosts] = useState([])
  const [popUp,setPopUp] = useState(false);
  const [caption,setCaption] = useState("");
  const [popFileURL,setPopFileURL] = useState("");
  const [postType,setPostType] = useState("");
  const [likedPosts, setLikedPosts] = useState({});
  const [numLike,setNumLike] = useState({});
  const [postId,setPostId] = useState('');

  const fetchPosts = async () => {
    const user = auth.currentUser;
    const snapshot = await getDocs(collection(db, "posts"));
    const allPosts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setPosts(allPosts);
  
    // Sync numLike and likedPosts
    if(user){
      const likesObj = {};
      const likedObj = {};
      allPosts.forEach(post => {
        likesObj[post.id] = post.likes || 0;
        likedObj[post.id] = post.likedBy?.includes(user?.uid) || false;
      });
    
      setNumLike(likesObj);
      setLikedPosts(likedObj);
    }

  };
  
  useEffect(()=>{
    const nameUser = onAuthStateChanged(auth,async (user) =>{
      if(user){
        const result = await getDoc(doc(db,"users",user.uid));
        if(result.exists()){
          const data = result.data();
          const name = data.username;
          if(name){
            setNameUser(name);
          }
        }
      }
    })
    return () => nameUser;

  },[]);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  
  const handleSharePost = async () => {
    const user = auth.currentUser;
    if (!user || !file) return;
  
    const result = await getDoc(doc(db, "users", user.uid));
    let username = nameUser;
    let profileImage = profPic;

    if (result.exists()) {
      const data = result.data();
      username = data.username;
      profileImage = data.profilePic || "./../../assets/defaultprofile.png";
    }
  
    const base64File = await toBase64(file);
    const type = file.type.startsWith("video") ? "video" : "image";
  
    const postDetails = {
      name: username,
      profileIcon: profileImage,
      file: base64File,
      caption: caption,
      likes: 0,
      type: type,
      likedBy: [],
      timestamp: new Date(),
    };
  
    try {
      const docRef = await addDoc(collection(db, "posts"), postDetails);
      let newPostID = docRef.id;
      setPostId(newPostID);
      setNumLike(prev => ({
        ...prev,
        [newPostID]: 0}));
        setLikedPosts(prev => ({
          ...prev,
          [newPostID]: false
        }));
      
        setPosts(prev => [
          { ...postDetails, id: newPostID },
          ...prev
        ]);      
      console.log("Post added with ID:", postId);
      console.log("post : likes : ",numLike)
      setFile(null);
      setCaption("");
    } catch (error) {
      console.error("Error saving post data:", error);
    }
  };
    
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const result = await getDoc(doc(db, "users", user.uid));
        if (result.exists()) {
          const data = result.data();
          const name = data.username;
          if (name) {
            setNameUser(name);
          }
        }
  
        // Fetch posts only after user is set
        fetchPosts(); 
      }
    });
  
    return () => unsubscribe();
  }, []);
  

  useEffect(() => {
    const likeUpdate = async () => {
      // Loop over all post IDs in numLike
      for (const postId in numLike) {
        const likeCount = numLike[postId];
  
        try {
          const postRef = doc(db, "posts", postId);
          await updateDoc(postRef, {
            likes: likeCount,
          });
          console.log(`Likes updated for post ${postId}`);
        } catch (e) {
          console.error(`Couldn't update like for post ${postId}:`, e);
        }
      }
    };
  
    likeUpdate();
  }, [numLike]);
  
    
  const handlePopUp = (e) =>{
    try{
      const fileURL = e.target.files[0];
      if(!fileURL){
        console.error("no file found");
        return;
      }
      setFile(fileURL);
      let urlLink = URL.createObjectURL(fileURL);
      setPopFileURL(urlLink);
      let typePopUp = fileURL.type.startsWith("video") ? "video" : "image";
      setPostType(typePopUp);
      console.log("popup processed");
      setPopUp(true);
    }catch(e){
      console.log("Popup fail",e);
    }


  }

  const handleLike = async (likePost) => {
    console.log(likePost);
    const user = auth.currentUser;
    if (!user) return;
  
    const userId = user.uid;
    const alreadyLiked = likedPosts[likePost] || false;
  
    const newLikedState = !alreadyLiked;
    setLikedPosts(prev => ({
      ...prev,
      [likePost]: newLikedState
    }));
  
    const currentLikes = numLike[likePost] || 0;
    const newLikes = newLikedState ? currentLikes + 1 : currentLikes - 1;
  
    try {
      const postRef = doc(db, "posts", likePost);
      const postSnap = await getDoc(postRef);
      const postData = postSnap.data();
      let likedBy = postData.likedBy || [];
  
      if (newLikedState) {
        if (!likedBy.includes(userId)) {
          likedBy.push(userId);
        }
      } else {
        likedBy = likedBy.filter(id => id !== userId);
      }
  
      await updateDoc(postRef, {
        likes: newLikes,
        likedBy: likedBy
      });
  
      setNumLike(prev => ({
        ...prev,
        [likePost]: newLikes
      }));
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };
  
  
  return (
    <div className = {style.wrapper}>
        <div className = {style.uploadBox}>
          <div className = {style.aboveHR}>
            <img src = {profPic || "./../../assets/defaultprofile.png"} />
            <textarea placeholder={`Whats in your mind ${nameUser}?`}></textarea>
          </div>
          <hr className={style.hrLine}></hr>
          <div className={style.uploadIcons}>
            <ul>
              <li><label htmlFor='postInput' ><PermMediaIcon className={style.vidBtn} /><span>Photo or Video</span></label></li>
              <input type="file" accept='image/*,video/*' id='postInput' onChange={handlePopUp} style={{display: "none"}}></input>
              <li><LabelIcon className = {style.tagBtn} /><span>Tag</span></li>
              <li><LocationOnIcon className = {style.locBtn} /><span>Location</span></li>
              <li><EmojiEmotionsIcon className = {style.emojiBtn}/><span>Feelings</span></li>
            </ul>
            <div>
              <button className={style.shareBtn} onClick = {handleSharePost}>Share</button>
            </div>
          </div>
        </div>
        {posts.map((post,index)=>(
          <div className = {style.postBox} key={index}>
            <div className={style.headerPost}>
              <img src = {post.profileIcon} />
              <span>{post.name}</span>
            </div>
              {post.type === "image" && post.file ?
              (<img src = {post.file} alt='Post' className = {style.postContainer} />) : post.type === "video" && post.file ?
              (<video controls className = {style.postContainer}>
                <source src = {post.file} type='video/mp4' />  
              </video>
            ): null}
            <div className = {style.interactIcons}>
              {likedPosts[post.id] ? (<label htmlFor='likeBtn'><FavoriteIcon  className={style.activeLike}/></label>) : (<label htmlFor='likeBtn'><FavoriteBorderIcon  className={style.likeIcon}/></label>)}
              <button id='likeBtn' onClick={() => {handleLike(post.id)}}></button>
              <p>{numLike[post.id]}</p>
              <ChatBubbleOutlineRoundedIcon />
              <SendRoundedIcon />
            </div>
           {post.caption && <div className = {style.captionContainer}> 
            <pre>{post.name}</pre>
            <p>{post.caption}</p> </div>}
          </div>
        ))}
        {popUp && <div className = {style.popUp}>
          {postType === "image" && popFileURL ?
              (<img src = {popFileURL} alt='Post' className = {style.popUpContent} />) : postType === "video" && popFileURL ?
              (<video controls className = {style.popUpContent}>
                <source src = {popFileURL} type='video/mp4' />  
              </video>
            ): null}
            <textarea value = {caption} onChange={(e) => {setCaption(e.target.value)}} placeholder='Enter caption..'></textarea>
            <div>
              <button className={style.shareBtn} onClick = {() =>{
                                                                  handleSharePost();
                                                                  setPopUp(false);
                                                          
                                                            }}>Share</button>
            </div>
                  </div>}
        
    </div>
  )
}
