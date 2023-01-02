import Head from 'next/head'
import Image from 'next/image'
import supabase from '../lib/db'
import { useState ,useEffect} from 'react'
import { Post } from '../components/Post'
import { Stack ,Text,Center} from '@mantine/core'
import { usePrivy } from '@privy-io/react-auth'
import {
  useEnsAvatar,
  useEnsName,
} from 'wagmi'
import { Profile } from '../components/Profile'
import { useStore } from '../store'
export default function Home() {
  const { user,setUser } = useStore((state) => state);
  const [signedInUser,setSignedInUser] = useState(user)

  useEffect(() => {
    if(user) {
      setSignedInUser(user)
    }
  },[user])

  const getCasts = async () => {
  
    let casts = await supabase
  .from('casts')
  .select()
  .contains("mentions", JSON.stringify([{ username: "unlonely" }]))
  .eq('deleted', false)
  .order('published_at', { ascending: false })
  .limit(10000)

  console.log('casts',casts.data)
  setCasts(casts.data)
  }
  
  const [casts,setCasts] = useState(null as any)
  useEffect(()=> {
    getCasts()
    const channel = supabase.channel('schema-db-changes')
    .on('broadcast', { event: 'casts-update' }, async (payload) => {
      await getCasts()
    })
    channel.subscribe((msg) => {
      console.log("MSG",msg)
    })
  },[])
  if (!casts)
  return
  return (
    <Stack justify="center" align="center">
   {signedInUser && <Center><Text>{signedInUser.displayName
} SIGNED IN</Text></Center>}
</Stack>
  )
}
