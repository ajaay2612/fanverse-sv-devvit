<script>
    import LeftBracket from "./parts/LeftBracket.svelte";
    import RightBracket from "./parts/RightBracket.svelte";
    import PostDataMulti from "$lib/stores/PostDataMulti";
    import VoteDataMulti from "$lib/stores/VoteDataMulti";
    import General from "$lib/stores/General";
    import { mount, onMount } from "svelte";
    import { fade, scale } from "svelte/transition";
    // $: console.log("$PostDataMulti.canPost ", $PostDataMulti.canPost);
    export let noOfTeam;

    function handleChampion(event) {
        console.log(event.detail);
        champion = event.detail.champion;
        championImage = event.detail.championImage;

        $VoteDataMulti.champion = { champion, championImage };
        if (event.detail.from === "left") {
            leftWon = event.detail.champion;
            rightWon = false;
        } else {
            rightWon = event.detail.champion;
            leftWon = false;
        }
    }

    let mounted = false;
    onMount(() => {
        mounted = true;
    });

    let leftWon = null;
    let rightWon = null;
    let champion = null;
    let championImage = null;

    $: if(mounted && $VoteDataMulti ){
        validations()
    }

    $: if(mounted && $General.mode == "afterVote"){
        // console.log("afterVote", $VoteDataMulti);
        champion = $VoteDataMulti?.champion?.champion;
        championImage = $VoteDataMulti?.champion?.championImage;
    }
    
    $: if(mounted && champion){
        validations()
    }

    function validations() {
        function checkBracketNull(bracket) {
            let nullBracket = false;
            if (bracket.length == 0) {
                return true;
            }
            bracket.forEach((round, roundIndex) => {
                if (round.length == 0) {
                    return true;
                }
                round.forEach((matchup, matchIndex) => {
                    if (matchup.team === null || matchup.team === undefined) {
                        nullBracket = true;
                    }
                });
            });

            return nullBracket;
        }

        if (checkBracketNull($VoteDataMulti.bracketDataLeft) || checkBracketNull($VoteDataMulti.bracketDataRight)){
            $VoteDataMulti.canVote = false;
        } else {
            if (champion == null ) {
                $VoteDataMulti.canVote = false;
            }else{
                $VoteDataMulti.canVote = true;
            }
        }
        // console.log("$VoteDataMulti.canVote", $VoteDataMulti.canVote)

        if ($General.mode == "create") {
            function checkBracketNull(brackets) {
                let nullBracket = false;

                if(brackets.length == 0){
                    return true;
                }

                brackets[0].forEach((matchup, matchIndex) => {
                    if (matchup.team === null || matchup.team === undefined) {
                        nullBracket = true;
                    }
                });

                return nullBracket;
            }
            
            // console.log("left", $VoteDataMulti.bracketDataLeft);
            // console.log("right", $VoteDataMulti.bracketDataRight);

            // console.log("left", checkBracketNull($VoteDataMulti.bracketDataLeft));
            // console.log("right", checkBracketNull($VoteDataMulti.bracketDataRight));


            if (checkBracketNull($VoteDataMulti.bracketDataLeft) || checkBracketNull($VoteDataMulti.bracketDataRight)) {
                $PostDataMulti.canPost = false;
            } else {
                $PostDataMulti.canPost = true;
            }
        }
    }

    $: isAFterVote = $General.mode == "afterVote"

    let containerRef;

    let showTiles = false

    onMount(()=>{
        setTimeout(() => {
            showTiles = true
        }, 100);
    })


</script>

<div 

class="w-full h-full text-[2.5em] xsm:text-[1em] lg:text-[1.1em]">
    <div
    bind:this={containerRef}
        class="{noOfTeam == 4
            ? 'text-[1.2em]'
            : ''} overflow-auto px-2em py-2em w-full h-full"
    >
        <div
            class="{noOfTeam == 4
                ? 'w-[96em]'
                : 'w-[125em]'} flex h-full justify-center items-center mx-auto"
        >
            <div class="w-full h-full gap-[6em] flex justify-center items-center">
                <div class="shrink-0 translate-y-[-0.65em]">
                    <LeftBracket
                        bind:championImage
                        bind:champion
                        bind:leftWon
                        bind:rightWon
                        on:champion={handleChampion}
                        {noOfTeam}
                    />
                </div>

                <div class={noOfTeam == 4 ? "" : ""}>
                    <div class="text-[0.65em] relative mx-auto w-[14em]">
                        {#if showTiles}
                            <button
                                in:fade={{delay:900, duration: 500}}

                                class:champActive={champion || $General?.finalChampion?.champion }

                                class:rightWinnerTeam={isAFterVote && champion == $General?.finalChampion?.champion }
    
                                class="{isAFterVote ? ($General?.finalChampion?.champion && champion) ? champion == $General?.finalChampion?.champion ? "userAnswerRight" : "userAnswerFalse" :"" : ""} championBox relative text-center bg-pickem-box aspect-[5.8/2] flex justify-center text-[1.25em] font-bold w-full    cursor-pointer"
                            >
                                <div
                                    class="flex h-auto w-full justify-between items-center p-[0.3em] px-[0.4em]"
                                >
                                    {#if championImage}
                                        <div
                                            class="rounded-[0.4em] overflow-hidden h-full aspect-square shrink-0"
                                        >
                                            <img
                                                class="w-full h-full object-cover"
                                                src={championImage}
                                                alt=""
                                            />
                                        </div>
                                    {/if}
                                    <p class="text-center grow">
                                        {champion || "..."}
                                    </p>
                                </div>
                            </button>
                        {/if}

                        <!-- <div
                            class="w-[1px] h-[10.2em] absolute left-1/2 top-full -translate-x-1/2 bg-pickem-title"
                        ></div>
                        <div
                            class="w-[1px] h-[10.2em] absolute left-1/2 bottom-full -translate-x-1/2 bg-pickem-title"
                        ></div> -->
                        {#if showTiles}
                            <div
                            in:fade={{delay:400, duration: 500}}
                                class="w-[9.3em] h-[1px] absolute left-full top-1/2 -translate-y-1/2 bg-pickem-title"
                            ></div>
                            <div
                            in:fade={{delay:400, duration: 500}}
                                class="w-[9.3em] h-[1px] absolute right-full bottom-1/2 -translate-y-1/2 bg-pickem-title"
                            ></div>
                        {/if}
                    </div>
                </div>

                <div class="shrink-0 translate-y-[-0.65em]">
                    <RightBracket
                        bind:championImage
                        bind:champion
                        bind:rightWon
                        bind:leftWon
                        on:champion={handleChampion}
                        {noOfTeam}
                    />
                </div>
            </div>
        </div>
    </div>
</div>
