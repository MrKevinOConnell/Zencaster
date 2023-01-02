
import type { AppProps } from 'next/app'
import { Box, Button, MantineProvider, Stack } from '@mantine/core';
import Sound from 'react-sound';
import { Card ,Grid,Text,Center} from "@mantine/core"
import supabase from '../lib/db'
import {SpinampProvider, useAllTracksQuery} from "@spinamp/spinamp-hooks";
import { useState,useEffect } from 'react';
import { WagmiConfig, createClient, configureChains, mainnet } from 'wagmi'
 
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
 
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { ConnectKitProvider, ConnectKitButton, getDefaultClient } from "connectkit";
import { Profile } from '../components/Profile';
// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(
  [mainnet],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_SECRET}), publicProvider()],
)
 
// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi',
        headlessMode: true
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
})
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
  
useEffect(()=> {
 
},[])
  return (
    <WagmiConfig client={client}>
       <ConnectKitProvider>
  <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{ colorScheme: 'dark' }}
      >
        <SpinampProvider>
        <Stack style={{ overflowX: "hidden" }} justify="center">
       

      <Center mt="md">     <Profile /></Center>



  
     

      
   <Component {...pageProps} />
   </Stack>
   </SpinampProvider>
   
  </MantineProvider>
  </ConnectKitProvider>
   </WagmiConfig>
  )
}
