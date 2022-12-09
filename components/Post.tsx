import { Card ,Grid,Text} from "@mantine/core"
import Image from 'next/image'
export const Post = (cast: any) => {
    console.log("Cast",cast)
    return(
<Card style={{width: "45%"}} shadow="sm"  p="lg" m="md" radius="md" withBorder>
<Text mb="md">{cast.cast.text}</Text>

<Grid ml={2}> <img style={{borderRadius: "50%"}} width={30} height={30} src={cast.cast.avatar_url} alt={cast.cast.username}/><Text>{cast.cast.username}</Text></Grid>

</Card>
    )
}

