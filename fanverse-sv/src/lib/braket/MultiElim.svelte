<script>
    import LeftBracket from "./parts/LeftBracket.svelte";
    import RightBracket from "./parts/RightBracket.svelte";
  
    export let noOfTeam 

    function handleChampion(event) {
        console.log(event.detail);
        champion = event.detail.champion;
        if(event.detail.from === "left") {
            leftWon = event.detail.champion;
            rightWon = false;
        } else {
            rightWon = event.detail.champion;
            leftWon = false;
        }
    }

    let leftWon = null
    let rightWon = null

    let champion = null;
</script>

<div class="w-full h-full text-[2.5em] xsm:text-[1em] lg:text-[1.1em]">
    <div class="{noOfTeam == 4 ? "text-[1.2em]" : ""} overflow-scroll px-2em  py-2em w-full h-full">
        <div class="{noOfTeam == 4 ? "w-[66.3em]" : "w-[95em]"} flex justify-center items-center mx-auto">
            <div class="w-full">
                <div class="shrink-0 translate-y-[-0.65em]">
                    <LeftBracket bind:champion={champion} bind:leftWon={leftWon} bind:rightWon={rightWon} on:champion={handleChampion}  {noOfTeam}/>
                </div>
    
                <div class="{noOfTeam == 4 ? "" : "my-[-8.3em]"}">
                    <div class="text-[0.65em]  relative mx-auto w-[14em]">
                        <button
                            class="text-center bg-pickem-box aspect-[5.8/2] flex justify-center items-center text-[1.25em] font-bold w-full border-[0.25em] border-pickem-box-champ cursor-pointer">
                            {champion || "..."}
                        </button>
                        <div class="w-[1px] h-[10.2em] absolute left-1/2 top-full -translate-x-1/2 bg-pickem-title"></div>
                        <div class="w-[1px] h-[10.2em] absolute left-1/2 bottom-full -translate-x-1/2 bg-pickem-title"></div>
                    </div>
                </div>
    
                <div class="shrink-0 translate-y-[-0.65em]">
                    <RightBracket bind:champion={champion} bind:rightWon={rightWon} bind:leftWon={leftWon} on:champion={handleChampion} {noOfTeam}/>
                </div>
            </div>
        </div>
    </div>
</div>