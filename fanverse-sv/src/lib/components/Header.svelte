<script>
    import { fade, scale } from 'svelte/transition';
    import BoxButton from './BoxButton.svelte';
    import DropDownsPickems from './DropDownsPickems.svelte';
    import Themedrop from './Themedrop.svelte';
    import AddBackground from './AddBackground.svelte';
    import { cubicOut } from 'svelte/easing';
    import DropDownData from '../stores/DropDownData';
    import PostData from '$lib/stores/PostData';
    import General from '$lib/stores/General';
    import VoteData from '$lib/stores/VoteData';
    import LeaderBoard from './leaderBoard.svelte';
    import { getContext } from 'svelte';
    import PostDataMulti from '$lib/stores/PostDataMulti';
    import VoteDataMulti from '$lib/stores/VoteDataMulti';
    const refreshData = getContext('refreshData');
    import CurrentFrame from '$lib/stores/CurrentFrame';
    

    $: postData = $DropDownData[0].active == 2 ? PostDataMulti :  PostData;
    $: voteData = $DropDownData[0].active == 2 ? VoteDataMulti : VoteData

    let showMenu = false;

    function toggleMenu() {
        showMenu = !showMenu;
    }
    function closeMenu() {
        showMenu = false;
    }

    function handlePost() {
        console.log("post sent");
        window.parent.postMessage({
            type: 'setPostData',
            data: { "allPostData" :{"postdata": $postData, "dropDownData":$DropDownData} }
        }, '*');
    }

    function handleVote() {
        console.log("vote sent");
        $voteData.totalVotes = $voteData.totalVotes + 1;
        // voteData.update(store => ({...store, totalVotes: voteData.totalVotes + 1}));

        window.parent.postMessage({
            type: 'setVoteData',
            data: { "voteData" : $voteData }
        }, '*');
    }

    function handleFinishOff() {
        console.log("finish off sent");
        console.log($voteData);
        window.parent.postMessage({
            type: 'finishOff',
            data: { "voteData" : $voteData }
        }, '*');
    }

    const handleMessage = (ev) => {
        const { type, data } = ev.data;

        if (type === 'devvit-message') {
            const { message } = data;

            if (message.type === 'voteDataUpdated') {
                $voteData = message.data.voteData;
                // voteData.set(message.data.voteData);
                $General.mode = "afterVote";
                refreshData();
            }
            
            
        }
    };

    let showLeaderboard = false;
    function toggleLeaderboard() {
        showLeaderboard = !showLeaderboard;
    }
    function closeLeaderBoard(){
        showLeaderboard = false
    }

</script>
<svelte:window on:message={handleMessage}/>

{#if showLeaderboard}
    <button on:click|self={closeLeaderBoard} transition:fade={{duration:400, easing: cubicOut}} class="z-[10] h-screen backdrop-blur-[5px] absolute left-0 top-0 w-full bg-pickem-header-bg flex justify-center items-center">
        <div transition:scale={{start:0.9, duration:400, easing: cubicOut}} class="w-full">
            <LeaderBoard bind:showLeaderboard={showLeaderboard}/>
        </div>
    </button>
{/if}



<div class="text-[0.9em] xsm:text-[1em] pointer-events-none  z-[10] fixed p-[1.2em] h-screen w-full ">
    <div class="flex flex-row-reverse justify-between w-full gap-[1em]">
        


        {#if $postData.isCreator && $General.mode != "create"}
            <button
            on:click={handleFinishOff}
                class=" cursor-pointer h-[0.72em] group pointer-events-auto z-[20]  text-[2em] xsm:text-[1em] relative w-[5em] block ">
                <BoxButton>
                    <div
                    style="transition: none;"
                    class=" h-full w-full flex justify-center items-center group-hover:bg-white group-hover:text-black  uppercase font-inter-italic font-bold leading-0 text-[0.5em] absolute top-1/2 left-1/2 -translate-x-[calc(50%+1px)] -translate-y-[calc(50%+0.5px)]">update bracket</div>
                </BoxButton>
            </button>
        {/if}
       
        {#if  $General.mode === "vote" }
            {#if !$postData.isCreator}
                <button
                disabled={!$voteData.canVote}
                on:click={$voteData.canVote ? handleVote:""} class="disabled:opacity-50 disabled:cursor-not-allowed h-[0.72em] group pointer-events-auto z-[20]  text-[2em] xsm:text-[1em] relative w-[2.2em] block ">
                    <BoxButton>
                        <div
                        style="transition: none;"
                        class=" h-full w-full flex justify-center items-center group-hover:bg-white group-hover:text-black  uppercase font-inter-italic font-bold leading-0 text-[0.5em] absolute top-1/2 left-1/2 -translate-x-[calc(50%+1px)] -translate-y-[calc(50%+0.5px)]">vote</div>
                    </BoxButton>
                </button>
            {/if}
        {/if}
        {#if $General.mode != "create"}
            
            <!-- <div class="flex flex-col gap-[0.8em]"> -->
                <!-- <button
                class=" h-[0.72em] group pointer-events-none z-[20]  text-[2em] xsm:text-[1em] relative w-[5em] block ">
                    <BoxButton>
                        <div
                        style="transition: none;"
                        class=" h-full w-full flex justify-center items-center group-hover:bg-white group-hover:text-black  uppercase font-inter-italic font-bold leading-0 text-[0.5em] absolute top-1/2 left-1/2 -translate-x-[calc(50%+1px)] -translate-y-[calc(50%+0.5px)]">total votes: <span class="ml-0hem">{voteData.totalVotes}</span></div>
                    </BoxButton>
                </button> -->
                
                <button
                on:click={toggleLeaderboard}
                class="mr-auto h-[0.72em] group pointer-events-auto z-[20]  text-[2em] xsm:text-[1em] relative w-[1.5em] block ">
                    <BoxButton>
                        <div
                        style="transition: none;"
                        class=" h-full scale-[1.3] w-full flex justify-center items-center group-hover:bg-white group-hover:text-black  uppercase font-inter-italic font-bold leading-0 text-[0.5em] absolute top-1/2 left-1/2 -translate-x-[calc(50%+1px)] -translate-y-[calc(50%+0.5px)]">
                        
                        <div class="w-[1.15em]">
                            <svg viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 18H6" stroke="#FFBB00" stroke-width="1.5" stroke-linecap="round"/>
                                <path d="M11.75 16C11.75 16.4142 11.4142 16.75 11 16.75C10.5858 16.75 10.25 16.4142 10.25 16H11.75ZM10.25 16V13H11.75V16H10.25Z" fill="#FFBB00"/>
                                <path d="M9 6H13" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
                                <path d="M3.5 11C3.5 11 1 9.3125 1 6.5C1 5.74931 1 5.07877 1 4.49907C1 4.03504 1 3.80302 1.03843 3.60982C1.19624 2.81644 1.81644 2.19624 2.60982 2.03843C2.80302 2 3.03534 2 3.5 2V2C3.96466 2 4.19698 2 4.39018 2.03843C5.18356 2.19624 5.80376 2.81644 5.96157 3.60982C6 3.80302 6 4.03534 6 4.5V5.375" stroke="#FFBB00" stroke-width="1.5" stroke-linecap="round"/>
                                <path d="M18.5 11C18.5 11 21 9.3125 21 6.5C21 5.74931 21 5.07877 21 4.49907C21 4.03504 21 3.80302 20.9616 3.60982C20.8038 2.81644 20.1836 2.19624 19.3902 2.03843C19.197 2 18.9647 2 18.5 2V2C18.0353 2 17.803 2 17.6098 2.03843C16.8164 2.19624 16.1962 2.81644 16.0384 3.60982C16 3.80302 16 4.03534 16 4.5V5.375" stroke="#FFBB00" stroke-width="1.5" stroke-linecap="round"/>
                                <path d="M16 7.56478V3C16 1.89543 15.1046 1 14 1H8C6.89543 1 6 1.89543 6 3V7.56478C6 8.91416 6.68034 10.1726 7.80936 10.9116L10.4523 12.6415C10.785 12.8593 11.215 12.8593 11.5477 12.6415L14.1906 10.9116C15.3197 10.1726 16 8.91416 16 7.56478Z" fill="#FFBB00" stroke="#FFBB00" stroke-width="1.5"/>
                            </svg>                                
                        </div>
                        </div>
                    </BoxButton>
                </button>
            <!-- </div> -->


        {/if}
        {#if $General.mode === "create"}
            <button 
            disabled={!$postData.canPost}
            on:click={$postData.canPost ? handlePost : ""} class="disabled:opacity-50 disabled:cursor-not-allowed h-[0.72em]  group pointer-events-auto z-[20]  text-[2em] xsm:text-[1em] relative w-[2.2em] block ">
                <BoxButton>
                    <div
                    style="transition: none;"
                    class=" h-full w-full flex justify-center items-center group-hover:bg-white group-hover:text-black  uppercase font-inter-italic font-bold leading-0 text-[0.5em] absolute top-1/2 left-1/2 -translate-x-[calc(50%+1px)] -translate-y-[calc(50%+0.5px)]">post</div>
                </BoxButton>
            </button>

            <div class=" flex flex-col-reverse xsm:flex-row-reverse w-fit gap-[1em]">
                <AddBackground/>
                
                <Themedrop bind:drop={$DropDownData[3]} />
                
                <button on:click={toggleMenu} class="pointer-events-auto z-[25]  text-[2em] xsm:text-[1em] relative size-[0.72em] block ml-auto">
                    <BoxButton>
                        <div class="leading-0 size-[0.75em] text-[0.75em] absolute top-1/2 left-1/2 -translate-1/2">
                            <svg  viewBox="0 0 35 35" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M20.9824 2.6291V2.62912L21.139 4.19497C21.3024 5.8285 21.3841 6.64527 21.9369 6.87426C22.4897 7.10324 23.125 6.58345 24.3956 5.54387L25.6173 4.54432C26.283 3.99961 26.6159 3.72725 27.0007 3.74645C27.3856 3.76564 27.6897 4.06977 28.2979 4.67802L30.5466 6.92666C31.1548 7.53491 31.459 7.83904 31.4782 8.22387C31.4973 8.60871 31.225 8.94159 30.6803 9.60734L29.6767 10.8339C28.6372 12.1045 28.1174 12.7398 28.3463 13.2926C28.5753 13.8454 29.3921 13.9271 31.0256 14.0905L32.6013 14.248C33.4573 14.3336 33.8853 14.3764 34.1438 14.6621C34.4023 14.9478 34.4023 15.3779 34.4023 16.2381V19.4181C34.4023 20.2784 34.4023 20.7085 34.1438 20.9941C33.8853 21.2798 33.4573 21.3226 32.6014 21.4082L31.0361 21.5647C29.4026 21.7281 28.5858 21.8098 28.3568 22.3626C28.1278 22.9154 28.6476 23.5507 29.6872 24.8213L30.6828 26.0382C31.2276 26.704 31.4999 27.0368 31.4807 27.4217C31.4615 27.8065 31.1574 28.1106 30.5491 28.7189L28.3005 30.9675C27.6923 31.5758 27.3881 31.8799 27.0033 31.8991C26.6185 31.9183 26.2856 31.6459 25.6198 31.1012L24.3968 30.1005C23.1262 29.061 22.4909 28.5412 21.9381 28.7701C21.3852 28.9991 21.3036 29.8159 21.1402 31.4494L20.9824 33.0271C20.8968 33.8831 20.8541 34.311 20.5684 34.5696C20.2827 34.8281 19.8526 34.8281 18.9924 34.8281H15.8123C14.9521 34.8281 14.522 34.8281 14.2363 34.5696C13.9506 34.311 13.9078 33.8831 13.8222 33.0271L13.6646 31.4507C13.5013 29.8172 13.4196 29.0004 12.8668 28.7714C12.3139 28.5425 11.6786 29.0623 10.4081 30.1018L9.18564 31.102C8.51988 31.6467 8.187 31.9191 7.80216 31.8999C7.41733 31.8807 7.1132 31.5765 6.50495 30.9683L4.25631 28.7197C3.64806 28.1114 3.34393 27.8073 3.32474 27.4224C3.30554 27.0376 3.5779 26.7047 4.12261 26.039L5.11878 24.8214C6.15835 23.5508 6.67814 22.9155 6.44916 22.3627C6.22018 21.8099 5.40341 21.7282 3.76987 21.5649L2.20334 21.4082H2.20332C1.3474 21.3226 0.919437 21.2798 0.660891 20.9941C0.402344 20.7084 0.402344 20.2783 0.402344 19.4181V16.2381C0.402344 15.3779 0.402344 14.9478 0.660891 14.6621C0.919439 14.3764 1.3474 14.3336 2.20334 14.248L3.78035 14.0903C5.41388 13.927 6.23065 13.8453 6.45963 13.2925C6.68862 12.7397 6.16883 12.1044 5.12925 10.8338L4.12518 9.60658C3.58047 8.94082 3.30811 8.60794 3.32731 8.2231C3.3465 7.83827 3.65063 7.53414 4.25888 6.92588L6.50751 4.67725C7.11577 4.069 7.4199 3.76487 7.80473 3.74568C8.18957 3.72648 8.52244 3.99884 9.1882 4.54355L10.4092 5.54258C11.6798 6.58215 12.3151 7.10194 12.8679 6.87296C13.4208 6.64398 13.5024 5.82721 13.6658 4.19367L13.8222 2.62912C13.9078 1.77319 13.9506 1.34522 14.2363 1.08667C14.522 0.828125 14.9521 0.828125 15.8123 0.828125H18.9924C19.8526 0.828125 20.2827 0.828125 20.5684 1.08667C20.8541 1.34522 20.8968 1.77318 20.9824 2.6291ZM17.4023 24.6281C21.1579 24.6281 24.2023 21.5837 24.2023 17.8281C24.2023 14.0726 21.1579 11.0281 17.4023 11.0281C13.6468 11.0281 10.6023 14.0726 10.6023 17.8281C10.6023 21.5837 13.6468 24.6281 17.4023 24.6281Z" fill="currentColor"/>
                            </svg>                                
                        </div>
                    </BoxButton>
                </button>

                <button on:click={()=> $CurrentFrame = "create"} class="pointer-events-auto hover:opacity-100 cursor-pointer  font-inter-italic opacity-50 text-[1.5em] leading-[1em] xsm:text-[0.5em] font-bold uppercase flex justify-center items-center">&lt; <span class="hidden xsm:block ml-[0.2em]">back</span></button>

            </div>
        {/if}

        

    </div>

    {#if showMenu && $General.mode === "create"}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div on:click|self={closeMenu} transition:fade={{duration:400, easing: cubicOut}} class="z-20 pointer-events-auto backdrop-blur-[5px] text-[2.8em] bg-pickem-header-bg absolute left-0 top-0 h-full w-full  mx-auto flex justify-center items-center
        xsm:text-[1.5em]">
            <div transition:scale={{start:0.9, duration:400, easing: cubicOut}} class="flex flex-col justify-center items-center gap-[1em]">
                {#each $DropDownData as drop}
                    {#if drop.name !== "select color"}
                        <DropDownsPickems bind:drop={drop} />
                    {/if}
                {/each}
            </div>
        </div>
    {/if}
</div>