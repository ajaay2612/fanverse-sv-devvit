<script>
    import CurrentFrame from '$lib/stores/CurrentFrame.js';
    import Home from '../lib/frames/Home.svelte';
    import RootLayout from '../lib/layout/RootLayout.svelte';
    import PickemsLayout from '../lib/layout/PickemsLayout.svelte';
    import RankingsLayout from '$lib/layout/RankingsLayout.svelte';
    import ScoreLayout from '../lib/layout/ScoreLayout.svelte';


    import Create from '../lib/frames/Create.svelte';
    import General from '$lib/stores/General';
    import PostData from '$lib/stores/PostData';
    import Pickems from '../lib/frames/Pickems.svelte';
    import Rankings from '$lib/frames/Rankings.svelte';
    import Score from '../lib/frames/Score.svelte';
    import DropDownData from '$lib/stores/DropDownData';
    import VoteData from '$lib/stores/VoteData';
    import ShowLoader from '$lib/stores/ShowLoader';
    import { fade, scale } from 'svelte/transition';
    import { onMount } from 'svelte';
    import LeaderBoard from "$lib/stores/LeaderBoard"
    import LeaderBoardGlobal from '$lib/stores/LeaderBoardGlobal';
    import { setContext } from 'svelte';
    import PostDataMulti from '$lib/stores/PostDataMulti';
    import VoteDataMulti from '$lib/stores/VoteDataMulti';

    import DropDownDataRanking from '$lib/stores/DropDownDataRanking';
    import PostDataRanking from '$lib/stores/PostDataRanking';
    import VoteDataRanking from '$lib/stores/VoteDataRanking';

    import DropDownDataScore from '$lib/stores/DropDownDataScore';
    import PostDataScore from '$lib/stores/PostDataScore';
    import VoteDataScore from '$lib/stores/VoteDataScore';

    let messageOutput = '';
    let mounted = false;
    $ShowLoader = true;

    let isReinit = false;

    const handleMessage = (ev) => {
        const { type, data } = ev.data;

        if (type === 'devvit-message') {
            const { message } = data;
            // Always output full message
            messageOutput = JSON.stringify(message, undefined, 2);

            // Load initial data
            if (message.type === 'initialData') {

                if(mounted && !isReinit) return;

                let postType = message?.data?.postType;
                $CurrentFrame = postType 
                console.log("postType", postType)

                $General.userName = message?.data?.username;
                $General.mode = "create";

                if(postType === 'ranking'){
                    console.log("ranking")
                    $DropDownDataRanking = [...message?.data?.parsedGameData?.allPostData?.dropDownData];                    
                    $PostDataRanking = {...message?.data?.parsedGameData?.allPostData?.postdata}
                    $General.mode = "afterVote"  

                    $PostDataRanking.isCreator = message?.data?.isCreator
                    mounted = true;
                    isReinit = false;
                    $ShowLoader = false;

                    return;
                }
               
                if(postType === "rankingVote"){
                    console.log("rankingVote")
                    $CurrentFrame = "ranking" 
                    $DropDownDataRanking = [...message?.data?.parsedGameData?.allPostData?.dropDownData];                    
                    $PostDataRanking = {...message?.data?.parsedGameData?.allPostData?.postdata}
                    $General.mode = "vote"  
                    $VoteDataRanking.votesArray = message?.data?.parsedGameData?.allPostData?.finalVoteDataRankArrayPoints || []
                    $VoteDataRanking.votesArrayData = message?.data?.parsedGameData?.allPostData?.finalVoteDataRankArray || []
                    
                    $PostDataRanking.isCreator = message?.data?.isCreator
                    mounted = true;
                    isReinit = false;
                    $ShowLoader = false;
                    return;
                }
                if(postType === 'score'){
                    console.log("score")
                    $DropDownDataScore = [...message?.data?.parsedGameData?.allPostData?.dropDownData];                    
                    $PostDataScore = {...message?.data?.parsedGameData?.allPostData?.postdata}
                    $VoteDataScore = message?.data?.parsedGameData?.allPostData?.finalVoteDataScoreArray || $VoteDataScore
                    $General.mode = "vote"  

                    $PostDataScore.isCreator = message?.data?.isCreator
                    mounted = true;
                    isReinit = false;
                    $ShowLoader = false;

                    return;
                }
                if(postType === 'scoreVotable'){
                    console.log("scoreVotable")
                    $CurrentFrame = "score" 

                    $DropDownDataScore = [...message?.data?.parsedGameData?.allPostData?.dropDownData];                    
                    $PostDataScore = {...message?.data?.parsedGameData?.allPostData?.postdata}
                    $VoteDataScore = message?.data?.parsedGameData?.allPostData[`${$General.userName}`] || $VoteDataScore
                    
                    $PostDataScore.finalVoteArray = message?.data?.voteDataFromStringScore || $PostDataScore.finalVoteArray

                    $General.mode = $VoteDataScore.canVote ? message?.data?.isCreator ? "afterVote" : "vote" : "afterVote"

                    console.log("$VoteDataScore", $VoteDataScore)
                    console.log("$General.mode",$General.mode)

                    $PostDataScore.isCreator = message?.data?.isCreator
                    mounted = true;
                    isReinit = false;
                    $ShowLoader = false;

                    return;
                }

                if (message?.data?.isGameData){
                    $DropDownData = [...message?.data?.parsedGameData?.allPostData?.dropDownData];
                } 


                let postData = $DropDownData[0].active == 2 ? PostDataMulti :  PostData;
                let voteData = $DropDownData[0].active == 2 ? VoteDataMulti : VoteData

                


                

               
                $General.allTeamData = message?.data?.allTeamData;
                
                if($DropDownData[0].active == 2){
                    $General.finalBracketDataLeft = message?.data?.parsedGameData?.finalBracketDataLeft || []
                    $General.finalBracketDataRight = message?.data?.parsedGameData?.finalBracketDataRight || []
                    $General.finalChampion = message?.data?.parsedGameData?.finalChampion || []
                }else{
                    $General.finalBracketData = message?.data?.parsedGameData?.finalBracketData || [];
                }
               

                if (message?.data?.isGameData){
                    $General.mode = "vote"
                    postData.set({...message?.data?.parsedGameData?.allPostData?.postdata});
                    // postData = {...message?.data?.parsedGameData?.allPostData?.postdata};
                } 

                if(message?.data?.parsedGameData?.finalBracketData && message?.data?.parsedGameData?.finalBracketData.length > 0){
                    $General.mode = "afterVote"                    
                }

                if(
                    message?.data?.parsedGameData?.finalBracketDataLeft?.length > 0 &&
                    message?.data?.parsedGameData?.finalChampion &&
                    message?.data?.parsedGameData?.finalBracketDataRight?.length > 0
                ){
                    $General.mode = "afterVote"
                }
                
                
                if (message?.data?.parsedGameData?.allPostData && message?.data?.parsedGameData?.allPostData[`${$General.userName}`]) {
                    $General.mode = "afterVote"
                    voteData.set({...message?.data?.parsedGameData?.allPostData[`${$General.userName}`]});
                    // voteData = {...message?.data?.parsedGameData?.allPostData[`${$General.userName}`]};
                }
                
                if(message?.data?.parsedGameData?.finalBracketData?.length > 0 && message?.data?.isCreator   ){
                    $General.mode = "afterVote"
                    
                    if($DropDownData[0].active == 0){       
                        
                        voteData.update(store => ({...store, bracketData:message?.data?.parsedGameData?.finalBracketData}));  
                    }

                    
                    // voteData.bracketData = message?.data?.parsedGameData?.finalBracketData

                }

                if(
                    message?.data?.parsedGameData?.finalBracketDataLeft?.length > 0 &&
                    message?.data?.parsedGameData?.finalChampion &&
                    message?.data?.parsedGameData?.finalBracketDataRight?.length > 0 &&
                    message?.data?.isCreator   
                ){
                
                    $General.mode = "afterVote"


                    if($DropDownData[0].active == 2){        
                        voteData.update(store => (
                            {...store, 
                                bracketDataLeft:$General.finalBracketDataLeft,
                                bracketDataRight:$General.finalBracketDataRight,
                                champion:$General.finalChampion,
                            })
                        );
                        console.log("voteData", voteData)
                   
                    }


                }


            


                // console.log("initialData", message?.data?.voteDataFromStringIni);
                
                if(message?.data?.voteDataFromStringIni){
                    // voteData.totalVotes = message?.data?.voteDataFromStringIni?.length || 0 ;
                    voteData.update(store => ({...store, totalVotes:message?.data?.voteDataFromStringIni?.length || 0}));
                }
                if(message?.data?.localLeaderBoard && message?.data?.localLeaderBoard.length > 0){
                    $LeaderBoard = message?.data?.localLeaderBoard || []; 
                }
                if(message?.data?.leaderBoardGlobal){
                    $LeaderBoardGlobal = message?.data?.leaderBoardGlobal || {}; 
                }

                console.log("var updated")  

                postData.update(store => ({...store, isCreator: message?.data?.isCreator}));
                // postData.isCreator = message?.data?.isCreator
                mounted = true;
                isReinit = false;
                $ShowLoader = false;

            }
        }
    };

    const refreshData = () => {
        isReinit = true;
        window.parent.postMessage({
            type: 'webViewReady'
        }, '*');

    }

    setContext('refreshData', refreshData);


    if (import.meta.env.PROD) {
        console.log("This is production build!");
        const interval = setInterval(() => {
            if (!mounted) {
                window.parent.postMessage({
                    type: 'webViewReady'
                }, '*');
            } else {
                clearInterval(interval); // Stop the interval once mounted is true
            }
        }, 500); 
    }else{
        console.log("This is development build!");
        mounted = true;
        $ShowLoader = false;
    }
    
   
</script>
<svelte:window on:message={handleMessage}/>

{#if $ShowLoader}
    <div transition:fade class="z-[9999] w-full h-screen fixed top-0 left-0 bg-[#0000007c] backdrop-blur-2xl flex justify-center items-center font-inter-italic uppercase font-bold text-[1.5em]">
        <div class="w-2em" transition:scale>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style="shape-rendering: auto; display: block; background: transparent;"><g><circle stroke-dasharray="164.93361431346415 56.97787143782138" r="35" stroke-width="10" stroke="#fff" fill="none" cy="50" cx="50">
                <animateTransform keyTimes="0;1" values="0 50 50;360 50 50" dur="1s" repeatCount="indefinite" type="rotate" attributeName="transform"/>
            </circle><g/></g></svg>
        </div>
    </div>
{/if}

<!-- {$General.userName} -->

{#if mounted}
    {#if $CurrentFrame === 'home' || $CurrentFrame === 'create'}
        <RootLayout>
            {#if $CurrentFrame === 'home'}
                <Home/>
            {:else if $CurrentFrame === 'create'}
                <Create/>
            {/if}
        </RootLayout>
    {:else if $CurrentFrame === 'pickems'}
        <PickemsLayout>
            <Pickems/>
        </PickemsLayout>
    {:else if $CurrentFrame === 'ranking' }
        <RankingsLayout>
            <Rankings/>
        </RankingsLayout>
    {:else}
        <ScoreLayout>
            <Score/>
        </ScoreLayout>
    {/if}
    
{/if}

<!-- <pre class="text-[0.8em] bg-gray-200 text-black p-0hem rounded overflow-auto max-h-[15em]">
    output: 
    {messageOutput}
</pre> -->


