import TopBar from "../../components/TopBar/topBar.jsx"
import LeftBar from "../../components/LeftBar/leftBar.jsx"
import Feed from "../../components/Feed/feed.jsx"
import RightBar from "../../components/RightBar/rightBar.jsx"
import style from "./Home.module.css"


export default function Home({setStorePic,profPic,setProfPic}) {

  return (
    <div>
      <TopBar className = {style.topBar} setStorePic = {setStorePic} profPic = {profPic} setProfPic={setProfPic} />
      <div className = {style.centralBody}>
        <LeftBar className = {style.leftBar} />
        <Feed profPic = {profPic}  />
        <RightBar className = {style.rightBar} />
      </div>
    </div>
  )
}
