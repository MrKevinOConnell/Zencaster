## Zencaster

This is an example flow for how to implement [Farcaster's Authentication flow](https://farcasterxyz.notion.site/Merkle-v2-API-Documentation-c19a9494383a4ce0bd28db6d44d99ea8#160537d392b64d23b2fac59702046588) into a next.js application.

Some notes: [here](https://github.com/MrKevinOConnell/Zencaster/blob/main/pages/api/auth.ts) is where the application bearer token is generated

[here](https://github.com/MrKevinOConnell/Zencaster/blob/main/components/Profile.tsx) is where the custody bearer token is generated and the call to the above api endpoint is made.

if the wallet signed in is a farcaster custody address the profile will change to the user's profile picture and their profile name.

