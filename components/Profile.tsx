import {
    useAccount,
    useConnect,
    useDisconnect,
    useEnsAvatar,
    useEnsName,
    useSignMessage
  } from 'wagmi'
  import { verifyMessage, arrayify } from "ethers/lib/utils";
  import canonicalize from "canonicalize";
import { useCallback, useState } from 'react';
import { ConnectKitButton } from 'connectkit';
import {useStore} from './../store'
import { Button, Group, UnstyledButton, Avatar, Text,Box} from '@mantine/core'; 
  export function Profile() {
    const { user,setUser } = useStore((state) => state);
    const keyHash = '70d29a9c1ed39e8ceb1b4ccdbd3f19b5'; // md5 of "farcaster"
    const [userName,setUsername] = useState(null as any)
    const { disconnect } = useDisconnect()

      function internalBase64Encode(input: string) {
		return input.replaceAll('+', '.').replaceAll('/', '_').replaceAll('=', '-');
	}
	function internalBase64Decode(input: string) {
		return input
			.replaceAll('.', '+')
			.replaceAll('_', '/')
			.replaceAll('-', '=')
			.replace('MK=', 'MK-');
	}

      const getFarcasterToken = async (variables,data) => {
        const address = verifyMessage(variables.message, data);
        console.log(`message: ${variables.message}`);
        console.log(`sign address: ${address}`);
        console.log(`signed payload: ${data}`);
        const signedPayload = data;
        const signature = Buffer.from(arrayify(signedPayload)).toString("base64");
        const selfSignedToken = `eip191:${signature}`;
        console.log(selfSignedToken);
            if(!localStorage.getItem(keyHash)) {
            const response = await fetch("/api/auth", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${selfSignedToken}`,
              },
              body: JSON.stringify({ payload: variables.message, selfSignedToken }),
            });
            
            if (!response.ok) {
                disconnect
                return false
            }
            const data = await response.json();
              console.log("DDATTA",JSON.stringify(data));
             const hash = internalBase64Encode(data.secret)
             console.log('keyhash',keyHash)
            localStorage.setItem(keyHash,hash);
           await getUser()
        }
        return true
    }

    const getUser = async () => {
            const secret = internalBase64Decode(localStorage.getItem(keyHash))
                const me = await fetch("/api/me", {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${secret}`,
                      },
                    body: JSON.stringify({ userHubKey: secret })
                  });
                  if (!me.ok) {
                    disconnect
                  }
                  else {
                    const data = await me.json();
                    console.log("data",data)
                    let username = {userName: data.username, pfp: data.pfp, displayName: data.displayName}
                    setUser(username)
                    setUsername(username)
                  }
    }
    const { signMessage } = useSignMessage({
        onSuccess(newData, variables) {
            const id =  getFarcasterToken(variables,newData)
            }
    
      });
    const { address, connector, isConnected } = useAccount( {onConnect({ address, connector, isReconnected }) {
        console.log(localStorage.getItem(keyHash))
        if(localStorage.getItem(keyHash)) {
           getUser()
        }
        else {
            const time = new Date().getTime();
            const payload = canonicalize({
                method: "generateToken",
                params: {
                  timestamp: time,
                },
              });
            signMessage({message: payload })
        }
      }, onDisconnect() {
        localStorage.removeItem(keyHash)
        setUsername(null as any)
      }})
   
  
   
    
      return (
        <ConnectKitButton.Custom>  
        {({ isConnected, show, truncatedAddress, ensName }) => {
    
        return (
     <UnstyledButton onClick={show}>
        <Box>
        {!userName && <Text>Sign in</Text> }
          {userName && <Avatar size="lg" alt={userName.displayName} src={userName.pfp}/>}
        </Box>
      </UnstyledButton> )
    }}
        </ConnectKitButton.Custom>
    
    )
}