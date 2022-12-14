import { Card ,Center,Grid,Text} from "@mantine/core"
import Image from 'next/image'
import { useState,useEffect } from "react"
export const Post = (cast: any) => {
    const imgurUrl = 'https://i.imgur.com/'
    const [text,setText] = useState(cast.cast.text)
    const [postImage,setImage] = useState(null as any)
    useEffect(() => {
        if(cast && cast.cast) {
            if (text.includes(imgurUrl)) {
                setImage(imgurUrl + text.split(imgurUrl)[1])
                setText(text.split(imgurUrl)[0])
              }
        }
    },[cast])

    return(
<Card style={{width: "45%"}} shadow="sm"  p="lg" m="md" radius="md" withBorder>
<Text mb="md">{text}</Text>
{postImage && <Center m="md"><img width={240}  src={postImage} alt="post image"/> </Center> }
<Grid ml={2}> <img style={{borderRadius: "50%"}} width={30} height={30} src={cast.cast.author_pfp_url} alt={cast.cast.author_display_name}/><Text>@{cast.cast.author_username}</Text></Grid>

</Card>
    )
}

