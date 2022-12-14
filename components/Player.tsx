import { Card ,Center,Grid,Text, Button, LoadingOverlay, CardSection, Dialog, Collapse, List, ThemeIcon, Image, Divider, ActionIcon, Avatar} from "@mantine/core"
import { getResizedArtworkUrl, useAllTracksQuery } from "@spinamp/spinamp-hooks";
import { useState,useEffect } from "react"
import 'react-h5-audio-player/lib/styles.css';
import AudioPlayer from 'react-h5-audio-player';
import { IconMenu2 } from '@tabler/icons';
import supabase from "../lib/db";


  
export const Player = () => {
    const defaultFilter = { filter: {websiteUrl: { notIn: [], }}, first: 10}
    const [filter,setFilter] = useState(defaultFilter as any)
    const {tracks, isLoading, isError, refetch} = useAllTracksQuery(filter);
    const [trackUsers,setTrackUsers] = useState(null as any)
   
    const getUrls = async () => {
        const {data,error} = await supabase
        .from('casts')
        .select()
        .or('text.ilike.%https://www.sound.xyz/%,text.ilike.%https://www.ninaprotocol.com/%')
        .eq('deleted', false)
        .order('published_at', { ascending: false })
        
        let tracks = !data ? null : data.map(cast => {
            const imgurUrl = 'https://i.imgur.com/'
            let url = cast.text
            if(url.includes(imgurUrl)) {
                url = url.split(imgurUrl)[0]
            }
            url = url.match(/\b(https?:\/\/.*?\.[a-z]{2,4}\/[^\s]*\b)/g)
            if(!url || !url.length) {
return null
            }
            else {
                url = url[0]
            }
            return {url: url, user: cast.username}}).filter(Boolean)
            
            console.log("tracks",tracks)
        if(tracks && tracks.length) {
            setFilter({filter: {websiteUrl: { in: tracks.map((track) => track.url,)}}})
            setTrackUsers(tracks)
        }
    }
    
    useEffect(()=> {
        getUrls()
        const channel = supabase.channel('schema-db-changes').on('broadcast', { event: 'casts-update' }, async (payload) => {
            await getUrls()
          })
    },[])

    useEffect(() => {
        refetch()
    },[filter])

    const [showQueue,setShowQueue] = useState(false)
    
    const [currentWindow,setWindow] = useState(null as any)
    const [index,setIndex] = useState(0)
    useEffect(() => {
        if(window) {
        setWindow(window)
        }
            },[])
    if(isLoading || !tracks || !tracks[index]) {
        return(
            <Dialog opened={true} style={{position: "relative"}}>
        <Center><LoadingOverlay visible={true} overlayBlur={1} /> </Center>
        </Dialog>
        )
    }
    
    return(
<Dialog style={{maxHeight: currentWindow ? currentWindow.innerHeight/1.5 : 400}} opened={true}>
    <Center>   <Text weight={700} size="sm">{tracks[index].title}</Text></Center>
<Center>    <Text italic size="xs">{tracks[index].artist.name}</Text></Center>
{trackUsers && trackUsers[index] && <Center><Text size="xs">Casted by @{trackUsers[index].user}</Text> </Center>}
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
        else {
            setIndex(tracks.length - 1)
        }
    }}
    autoPlay
    src={tracks[index].lossyAudioUrl}
        onEnded={()=> {
            if(index === tracks.length -1 ) {
                setIndex(0)
            }
            else {
                setIndex(index + 1)
            }
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
    style={{maxHeight: currentWindow ? currentWindow.innerHeight/6 : 400, overflowY: "scroll", overflowX:'hidden'}}
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

