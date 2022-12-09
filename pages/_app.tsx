
import type { AppProps } from 'next/app'
import { Box, Button, MantineProvider, Stack } from '@mantine/core';
import Sound from 'react-sound';
import { Card ,Grid,Text} from "@mantine/core"
import supabase from '../lib/db'
import { useState,useEffect } from 'react';
import useSound from 'use-sound';
export default function App({ Component, pageProps }: AppProps) {
  const [mood,setMood] = useState({color: 'white',description: "Figuring out what the mood is 😀"})
  const getMood = async () => {
    const {data,error} = await supabase
  .from('mood')
  .select()
  if(!error) {
    if(data[0].color && data[0].description) {
      setMood(data[0])
    } 
  }
  }
const [isPlaying,setIsPlaying] = useState(false)
useEffect(()=> {
  getMood()
  const channel = supabase.channel('schema-db-changes')
  .on('broadcast', { event: 'mood-update' }, async (payload) => {
    await getMood()
  })
  channel.subscribe((msg) => {
    console.log("MSG",msg)
  })
},[])
  return (
  <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
        
        }}
      >
        <Stack style={{background: mood.color }} justify="center">
       

      
      <Grid>
        <Grid.Col span={2}> <Button onClick={()=> setIsPlaying(!isPlaying)}>{isPlaying ? "Pause lofi" : "Play lofi"}</Button> <Sound url={'/audio/lofi.mp3'}
        playStatus={isPlaying ? Sound.status.PLAYING : Sound.status.STOPPED}/></Grid.Col>
       <Grid.Col  span={8}><Text size="lg" weight={700} align="center" mt={5} >Zencaster</Text></Grid.Col>
      </Grid>
      <Text align="center">The current vibe of Farcaster: {mood.description}</Text>
     

      
   <Component {...pageProps} />
   </Stack>
  </MantineProvider>
  )
}
