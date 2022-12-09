import Head from 'next/head'
import Image from 'next/image'
import supabase from '../lib/db'
import { useState ,useEffect} from 'react'
import { Post } from '../components/Post'
import { Stack } from '@mantine/core'
export default function Home() {
  const getCasts = async () => {
  
    const casts = await supabase
  .from('casts')
  .select()
  .is("reply_parent_merkle_root", null)
  .or('text.not.ilike./@([a-zA-Z0-9_]+)/g')
  .eq('deleted', false)
  .eq('recast',false)
  .order('published_at', { ascending: false })
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
    {casts && casts.map((cast: any, index: number) => {
      return(<Post key={index} cast={cast}/>)
    })}

     

</Stack>
  )
}
