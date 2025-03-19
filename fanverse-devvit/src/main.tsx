import './createPost.js';

import { Devvit, useState, useWebView,useForm } from '@devvit/public-api';

import type { DevvitMessage, WebViewMessage } from './message.js';

Devvit.configure({
    redditAPI: true,
    redis: true,
    media: true,

});

// Add a custom post type to Devvit
Devvit.addCustomPostType({
    name: 'Web View Example',
    height: 'tall',
    render: (context) => {

        const imageUploadForm = useForm(
            {
                fields: [
                    {
                        name: 'imageUpload',
                        type: 'image',
                        label: 'Select an image to upload (WebP not allowed)',
                        required: true,
                    },
                ],
            },
            async (values) => {
                // onSubmit handler
                let imageUrlUp = values.imageUpload;
                // Check if the uploaded file is a WebP
                const isWebP = imageUrlUp.toLowerCase().endsWith('.webp');

                if (isWebP) {
                    context.ui.showToast('WebP files are not allowed. Please upload a different image format.')
                    imageUrlUp = ''
                }

                console.log('Image URL:', imageUrlUp);

                postMessage({
                    type: 'imageUploaded',
                    data: {
                      imageUrl: imageUrlUp
                    }
                });
            }
        );

        // Load username with `useAsync` hook
        const [username] = useState(async () => {
            return (await context.reddit.getCurrentUsername()) ?? 'anon';
        });

        // Load latest counter from redis with `useAsync` hook
        const [counter, setCounter] = useState(async () => {
            const redisCount = await context.redis.get(`counter_${context.postId}`);
            return Number(redisCount ?? 0);
        });

        const { mount, postMessage } = useWebView<WebViewMessage, DevvitMessage>({
            // URL of your web view content
            url: 'index.html',

            

            // Handle messages sent from the web view
            async onMessage(message, webView) {
                const postId = context?.postId;
                const voteData = message?.data?.voteData;
                let subredditNameString = (await context.reddit.getCurrentSubreddit()).name;

                function calculateMatchingPoints(userBrackets, finalBrackets) {
                    // Initialize points counter
                    let points = 0;
                    
                    // Check if both bracket arrays exist
                    if (!userBrackets || !finalBrackets) {
                      return 0;
                    }
                    
                    // Iterate through each round
                    for (let roundIndex = 0; roundIndex < Math.min(userBrackets.length, finalBrackets.length); roundIndex++) {
                      const userRound = userBrackets[roundIndex];
                      const finalRound = finalBrackets[roundIndex];
                      
                      // Iterate through each matchup in the round
                      for (let matchIndex = 0; matchIndex < Math.min(userRound.length, finalRound.length); matchIndex++) {
                        const userMatch = userRound[matchIndex];
                        const finalMatch = finalRound[matchIndex];
                        
                        // Check if team names match
                        if (userMatch.team === finalMatch.team && userMatch.team !== null) {
                          points += 1;
                        }
                      }
                    }

                    points = points - finalBrackets[0].length ;
                    
                    return points;
                }

                switch (message.type) {
                    case 'addImage':
                        context.ui.showForm(imageUploadForm);
                        break;
                    case 'finishOff':
                        

                        let postDataStringFinish = await context.redis.get(`postData_${postId}`);
                        if (!postDataStringFinish) {
                            console.error('Post data not found');
                            return;
                        }
                        postDataStringFinish = postDataStringFinish ? JSON.parse(postDataStringFinish) : [];
                        
                        
                        let bracketType = postDataStringFinish.allPostData.dropDownData[0].active
                        
                        if (bracketType == 0) {
                            postDataStringFinish.finalBracketData = voteData?.bracketData;
                        }else if(bracketType == 2){
                            postDataStringFinish.finalBracketDataLeft = voteData?.bracketDataLeft;
                            postDataStringFinish.finalBracketDataRight = voteData?.bracketDataRight;
                            postDataStringFinish.finalChampion = voteData?.champion;
                        }
                        
                        await context.redis.set(`postData_${postId}`, JSON.stringify(postDataStringFinish));

                        let voteDataStringAdmin = await context.redis.get(`voteData_${postId}`);
                        let voteDataFromStringAdmin = voteDataStringAdmin ? JSON.parse(voteDataStringAdmin) : [];

                        
                        let voteDataGLobalAdmin = await context.redis.get(`${subredditNameString}_VoteData_Global`);
                        let voteDataGLobalStringAdmin = voteDataGLobalAdmin ? JSON.parse(voteDataGLobalAdmin) : {};
                        

                        if (bracketType == 0) {
                            if (voteDataFromStringAdmin && voteDataFromStringAdmin.length > 0 && voteData?.bracketData) {
                                console.log("loop started")
                               
                                for (let i = 0; i < voteDataFromStringAdmin.length; i++) {
                                    if (voteDataFromStringAdmin[i] && voteDataFromStringAdmin[i]?.voteData?.bracketData) {
                                      let points = calculateMatchingPoints(voteDataFromStringAdmin[i].voteData.bracketData, voteData.bracketData);
                                      voteDataFromStringAdmin[i].points = points;
                                      
                                      // Get the username from the vote data
                                      const username = voteDataFromStringAdmin[i].username;
                                      
                                      // Make sure the username exists in the global data
                                      if (!voteDataGLobalStringAdmin[username]) {
                                        voteDataGLobalStringAdmin[username] = { posts: [] };
                                      }
                                      
                                      // Initialize posts array if it doesn't exist
                                      voteDataGLobalStringAdmin[username].posts = voteDataGLobalStringAdmin[username].posts || [];
                                      
                                      // Check if a post with the same postId already exists
                                      const existingPostIndex = voteDataGLobalStringAdmin[username].posts.findIndex(post => post.postId === postId);
                                      
                                      // Only push if the post doesn't already exist
                                      if (existingPostIndex === -1) {
                                        voteDataGLobalStringAdmin[username].posts.push({
                                          postId: postId,
                                          voteData: voteDataFromStringAdmin[i].voteData,
                                          points: points
                                        });
                                      }
                                      // Optional: Update existing post if needed
                                      else {
                                        voteDataGLobalStringAdmin[username].posts[existingPostIndex] = {
                                          postId: postId,
                                          voteData: voteDataFromStringAdmin[i].voteData,
                                          points: points
                                        };
                                      }
                                    }
                                }
    
                                await context.redis.set(`voteData_${postId}`, JSON.stringify(voteDataFromStringAdmin));
                                
                                await context.redis.set(`${subredditNameString}_VoteData_Global`, JSON.stringify(voteDataGLobalStringAdmin));
    
                                console.log("voteDataGLobalStringAdmin",JSON.stringify(voteDataGLobalStringAdmin))
    
                                
                            }
                        }else if(bracketType == 2){
                            console.log("voteData?.bracketData",voteData)

                            if (voteDataFromStringAdmin && voteDataFromStringAdmin.length > 0 && voteData?.bracketDataLeft && voteData?.bracketDataRight) {
                                console.log("loop started")
                               
                                for (let i = 0; i < voteDataFromStringAdmin.length; i++) {
                                    if (voteDataFromStringAdmin[i] && voteDataFromStringAdmin[i]?.voteData?.bracketDataLeft && voteDataFromStringAdmin[i]?.voteData?.bracketDataRight) {
                                      let pointsL = calculateMatchingPoints(voteDataFromStringAdmin[i].voteData.bracketDataLeft, voteData.bracketDataLeft);
                                      let pointsR = calculateMatchingPoints(voteDataFromStringAdmin[i].voteData.bracketDataRight, voteData.bracketDataRight);
                                      
                                      let pointsC =  voteDataFromStringAdmin[i]?.voteData?.champion?.champion == voteData?.champion?.champion ? 1 : 0;
                                      
                                      let points = pointsL + pointsR + pointsC;
                                      voteDataFromStringAdmin[i].points = points;
                                      
                                      // Get the username from the vote data
                                      const username = voteDataFromStringAdmin[i].username;
                                      
                                      // Make sure the username exists in the global data
                                      if (!voteDataGLobalStringAdmin[username]) {
                                        voteDataGLobalStringAdmin[username] = { posts: [] };
                                      }
                                      
                                      // Initialize posts array if it doesn't exist
                                      voteDataGLobalStringAdmin[username].posts = voteDataGLobalStringAdmin[username].posts || [];
                                      
                                      // Check if a post with the same postId already exists
                                      const existingPostIndex = voteDataGLobalStringAdmin[username].posts.findIndex(post => post.postId === postId);
                                      
                                      // Only push if the post doesn't already exist
                                      if (existingPostIndex === -1) {
                                        voteDataGLobalStringAdmin[username].posts.push({
                                          postId: postId,
                                          voteData: voteDataFromStringAdmin[i].voteData,
                                          points: points
                                        });
                                      }
                                      // Optional: Update existing post if needed
                                      else {
                                        voteDataGLobalStringAdmin[username].posts[existingPostIndex] = {
                                          postId: postId,
                                          voteData: voteDataFromStringAdmin[i].voteData,
                                          points: points
                                        };
                                      }
                                    }
                                }
    
                                await context.redis.set(`voteData_${postId}`, JSON.stringify(voteDataFromStringAdmin));
                                
                                await context.redis.set(`${subredditNameString}_VoteData_Global`, JSON.stringify(voteDataGLobalStringAdmin));
    
                                console.log("voteDataGLobalStringAdmin",JSON.stringify(voteDataGLobalStringAdmin))
    
                                
                            }
                        }

                        webView.postMessage({
                            type: 'voteDataUpdated',
                            data: {
                                voteData: voteData,
                            },
                        });

                        context.ui.showToast('Bracket Updated!');


                        break;
                    case 'setVoteData':

                        let postDataString = await context.redis.get(`postData_${postId}`);
                        if (!postDataString) {
                            console.error('Post data not found');
                            return;
                        }

                        let postDataFromString = JSON.parse(postDataString);
                        postDataFromString.allPostData[username] = voteData;
                        
                        await context.redis.set(`postData_${postId}`, JSON.stringify(postDataFromString));

                        let voteDataString = await context.redis.get(`voteData_${postId}`);
                        let voteDataFromString = voteDataString ? JSON.parse(voteDataString) : [];
                        
                        voteDataFromString = [...voteDataFromString, {username: username, voteData: voteData, points:0}];
                        await context.redis.set(`voteData_${postId}`, JSON.stringify(voteDataFromString));
                        
                        let voteDataGLobal = await context.redis.get(`${subredditNameString}_VoteData_Global`);
                        let voteDataGLobalString = voteDataGLobal ? JSON.parse(voteDataGLobal) : {};

                        // old code
                        // voteDataGLobalString = [...voteDataGLobalString, {username: username, postId: postId, voteData: voteData, points:0}];

                        // Initialize the user object if it doesn't exist
                        if (!voteDataGLobalString[username]) {
                            voteDataGLobalString[username] = {};
                        }

                        // Now you can safely set the posts property
                        voteDataGLobalString[username].posts = voteDataGLobalString[username].posts 
                            ? [...voteDataGLobalString[username].posts, {postId: postId, voteData: voteData, points: 0}] 
                            : [{postId: postId, voteData: voteData, points: 0}];

                        await context.redis.set(`${subredditNameString}_VoteData_Global`, JSON.stringify(voteDataGLobalString));


                    
                        
                        webView.postMessage({
                            type: 'voteDataUpdated',
                            data: {
                                voteData: voteData,
                            },
                        });

                        context.ui.showToast('Vote Submitted!');

                        break

               
                    case 'setPostData':
                        // Post the app with the new data
                        const newPost = await context.reddit.submitPost({
                            title: 'fanverse',
                            subredditName: await (await context.reddit.getCurrentSubreddit()).name,
                            preview: (
                            <vstack height="100%" width="100%" alignment="middle center">
                                <text size="large">Loading ...</text>
                            </vstack>
                            ),
                        });
                        let postData = {
                            creator_username: username,
                            allPostData : message.data.allPostData,
                        };
                        await context.redis.set(`postData_${newPost.id}`, JSON.stringify(postData));

                        const postUrl = newPost.url;
                        webView.postMessage({
                            type: 'newPostCreated',
                            data: {
                                postId: newPost.id,
                                creator_username: username,
                                postUrl: postUrl
                            },
                        });
                        context.ui.showToast('Post Created!');

                        context.ui.navigateTo(postUrl);                        
                        break;
                    case 'addTeamToUserData':

                        let filteredTeamData = message.data.allTeamData.filter((team) => team.teamName);

                        await context.redis.set(
                            `allTeamData_${username}`,
                            JSON.stringify(filteredTeamData)
                        );
                        
                        break;
                    case 'webViewReady':
                        // await context.redis.set(`${subredditNameString}_VoteData_Global`, JSON.stringify({}));

                        // await context.redis.set(
                        //     `allTeamData_${username}`,
                        //     JSON.stringify([])
                        // );
                        // await context.redis.set(`${subredditNameString}_VoteData_Global`, JSON.stringify({}));

                      

                        let voteDataStringIni = await context.redis.get(`voteData_${postId}`);
                        let voteDataFromStringIni = voteDataStringIni ? JSON.parse(voteDataStringIni) : [];

                        const postDataIni = await context.redis.get(`postData_${context.postId}`);
                        const parsedGameData = postDataIni ? JSON.parse(postDataIni) : {};

                        let allTeamData = await context.redis.get(`allTeamData_${username}`);
                        allTeamData = allTeamData ? JSON.parse(allTeamData) : [];

                        // adding points to user
                
                        let localLeaderBoard = []
                        let leaderBoardGlobal = {}

                        async function getLeaderBoard() {
                            let voteDataString = await context.redis.get(`voteData_${postId}`);
                            let voteDataFromString = voteDataString ? JSON.parse(voteDataString) : [];
                            
                            if( voteDataFromString && voteDataFromString.length > 0) {
                                voteDataFromString = voteDataFromString.sort((a, b) => b.points - a.points);
                                voteDataFromString = voteDataFromString.map((vote, index) => {
                                    vote.rank = index + 1;
                                    return vote;
                                });
                                localLeaderBoard = voteDataFromString;
                            }


                            let voteDataGLobal = await context.redis.get(`${subredditNameString}_VoteData_Global`);
                            leaderBoardGlobal = voteDataGLobal ? JSON.parse(voteDataGLobal) : {};
                        }
                        await getLeaderBoard()

                    

                        webView.postMessage({
                            type: 'initialData',
                            data: {
                                localLeaderBoard: localLeaderBoard,
                                leaderBoardGlobal: leaderBoardGlobal,
                                voteDataFromStringIni: voteDataFromStringIni,
                                username: username,
                                isCreator: parsedGameData?.creator_username === username,
                                isGameData: Object.keys(parsedGameData).length > 0,
                                parsedGameData: parsedGameData,
                                currentCounter: counter,
                                allTeamData : allTeamData || [],
                            },
                        });
                        break;
                    case 'setCounter':
                        await context.redis.set(
                            `counter_${context.postId}`,
                            message.data.newCounter.toString()
                        );
                        setCounter(message.data.newCounter);

                        webView.postMessage({
                            type: 'updateCounter',
                            data: {
                                currentCounter: message.data.newCounter,
                            },
                        });

                        break;
                    default:
                        throw new Error(`Unknown message type: ${message satisfies never}`);
                }
            },
            onUnmount() {
                context.ui.showToast('Web view closed!');
            },
        });

        // Render the custom post type
        return (
            <vstack grow padding="small">
                <vstack grow alignment="middle center">
                    <text size="xlarge" weight="bold">
                        Example App
                    </text>
                    <spacer />
                    <vstack alignment="start middle">
                        <hstack>
                            <text size="medium">Username:</text>
                            <text size="medium" weight="bold">
                                {' '}
                                {username ?? ''}
                            </text>
                        </hstack>
                        <hstack>
                            <text size="medium">Current counter:</text>
                            <text size="medium" weight="bold">
                                {' '}
                                {counter ?? ''}
                            </text>
                        </hstack>
                    </vstack>
                    <spacer />
                    <button onPress={() => mount()}>Launch App</button>
                </vstack>
            </vstack>
        );
    },
});

export default Devvit;
