import { Card ,Center,Grid,Text, Button, LoadingOverlay, CardSection, Dialog, Collapse, List, ThemeIcon, Image, Divider, ActionIcon, Avatar} from "@mantine/core"
import { getResizedArtworkUrl, useAllTracksQuery } from "@spinamp/spinamp-hooks";
import { useState,useEffect } from "react"
import 'react-h5-audio-player/lib/styles.css';
import AudioPlayer from 'react-h5-audio-player';
import { IconMenu2 } from '@tabler/icons';
import supabase from "../lib/db";
export const Player = () => {
    const {tracks, isLoading, isError, refetch} = useAllTracksQuery();
    const [showQueue,setShowQueue] = useState(false)
    
    const [currentWindow,setWindow] = useState(null as any)
    const [index,setIndex] = useState(0)
    console.log("tracks",tracks)
    useEffect(()=> {
        const channel = supabase.channel('schema-db-changes')
        .on('broadcast', { event: 'found-music' }, async (payload) => {
          await refetch
        })
        channel.subscribe((msg) => {
          console.log("MSG",msg)
        })
      },[])
    useEffect(() => {
        if(window) {
        setWindow(window)
        }
            },[])
    if(isLoading || !tracks || !tracks[index]) {
        return(
        <LoadingOverlay visible={true} overlayBlur={2} />
        )
    }


 
 
    
    return(
<Dialog style={{maxHeight: currentWindow ? currentWindow.innerHeight/1.5 : 400}} opened={true}>
    <Center>   <Text weight={700} size="sm">{tracks[index].title}</Text></Center>
<Center>    <Text size="xs">{tracks[index].artist.name}</Text></Center>
<Center ><Avatar size={currentWindow ? currentWindow.innerHeight/6: 200} component="a" target="_blank" alt={tracks[index].title} href={tracks[index].websiteUrl} src={tracks[index].lossyArtworkUrl}/></Center>
    <Center my="sm"> <AudioPlayer
    showSkipControls
    showJumpControls={false}
    onClickNext={()=> {
        if(index === tracks.length -1 ) {
            setIndex(0)
        }
        else {
            setIndex(index + 1)
        }
    }}
    onClickPrevious={() => {
        if(index !== 0) {
            setIndex(index - 1)
        }
    }}
    autoPlay
    src={tracks[index].lossyAudioUrl}
        onEnded={()=> {
            setIndex(index + 1)
        }}
  />
</Center>
<Center>
<ActionIcon onClick={() => setShowQueue(!showQueue)}>
      <IconMenu2 size={100} />
    </ActionIcon>
    </Center>
         
 <Collapse in={showQueue}>
 <Divider my={"md"}/>
 <List
    style={{maxHeight: currentWindow ? currentWindow.innerHeight/5 : 400, overflowY: "scroll", overflowX:'hidden'}}
      type="ordered"
      spacing="sm"
      center
    >
        {tracks.slice(index + 1).map((track,trackIndex) => {
            return(
            <List.Item
            key={trackIndex}
            onClick={() => {
                setIndex(index + 1 + trackIndex)
            }}
        icon={
            <img
            src={track.lossyArtworkUrl}        
            width={40}    
            alt={track.title}
          />
        }
      >
        <Text size="sm">{`${track.title} - ${track.artist.name}`} </Text>
      </List.Item>)
        })
      
}
    </List>
      </Collapse>
</Dialog>
    )
}

