import { useParams } from "react-router-dom"

const SingleMusicCard = () => {    
    
    const {musicName} = useParams()


  return (
    <div>{musicName}</div>
  )
}

export default SingleMusicCard