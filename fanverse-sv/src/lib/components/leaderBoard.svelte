<script>
    import LeaderBoard from "$lib/stores/LeaderBoard";
    import LeaderBoardGlobal from "$lib/stores/LeaderBoardGlobal";
    import { onMount } from "svelte";
    export let showLeaderboard 
    import LeaderBoardTable from "./LeaderBoardTable.svelte";
    
    console.log("LeaderBoardGlobal", $LeaderBoardGlobal)

   
    let localLeaderBoardArray = []
    let alteredGlobalLeaderBoard =[]

    // onMount(()=>{
    //     hydrateLeaderBoard()
        
    // })

    function hydrateLeaderBoard() {
        localLeaderBoardArray = $LeaderBoard
        console.log("localLeaderBoardArray", localLeaderBoardArray)

        let leaderBoardGlobalArray = []

        if ($LeaderBoardGlobal && Object.keys($LeaderBoardGlobal).length > 0) {
            Object.entries($LeaderBoardGlobal).forEach(([key,values])=> {
                return leaderBoardGlobalArray = [...leaderBoardGlobalArray,
                    {
                        username: key,
                        points: values.posts.reduce((acc, curr) => acc + curr.points, 0)
                    }
                ]
            });
        } 

        leaderBoardGlobalArray = leaderBoardGlobalArray.sort((a, b) => b.points - a.points);

        // console.log("leaderBoardGlobalArray", leaderBoardGlobalArray)

        alteredGlobalLeaderBoard = leaderBoardGlobalArray && leaderBoardGlobalArray.length > 0
        ? leaderBoardGlobalArray.map((item, index) => {
            return {
                ...item,
                rank: index + 1
            }
        }):""
        console.log("alteredGlobalLeaderBoard", alteredGlobalLeaderBoard)
    }


    $: if($LeaderBoardGlobal && $LeaderBoard){
        hydrateLeaderBoard()
    }


    let leaderBoardType = [
        {
            name: "BRACKET RANKINGS"
        },
        {
            name: "GLOBAL RANKING"
        }
    ];

    let currentSelectedType = 0;

    $:console.log("currentSelectedType", currentSelectedType)

    $:selectedLeaderBoard = currentSelectedType == 0 ? localLeaderBoardArray : alteredGlobalLeaderBoard
</script>
    
    
<LeaderBoardTable 
bind:showLeaderboard={showLeaderboard} 
bind:leaderBoard={selectedLeaderBoard} 
bind:leaderBoardType={leaderBoardType} 
bind:currentSelectedType={currentSelectedType}  />
