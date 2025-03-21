<script>
    import TeamPickerDataScore from "$lib/stores/TeamPickerDataScore";
    import BoxButton from "./BoxButton.svelte";
    import General from "$lib/stores/General";

    import { onMount } from "svelte";
    import { fade, scale } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import PostDataScore from "$lib/stores/PostDataScore";

    let imageFetching = false;

    function addImage() {

        imageFetching = true;

        console.log('Adding image...');
        window.parent.postMessage({
            type: 'addImage'
        }, '*');
    }

    let teamData = {
        teamName: "",
        teamImage: "",
    };
   
    function addTeam() {
        if (!teamData.teamName) {
            return;
        }
        // Check if a team with the same name already exists
        const existingTeamIndex = $General.allTeamData.findIndex(team => team.teamName === teamData.teamName);

        if (existingTeamIndex !== -1) {
            // Update the existing team's data
            $General.allTeamData[existingTeamIndex] = {
                ...$General.allTeamData[existingTeamIndex],
                ...teamData
            };
        } else {
            // Add new team if it doesn't exist
            $General.allTeamData = [...$General.allTeamData, teamData];
        }

        $PostDataScore.allLoadedData[$TeamPickerDataScore.teamPickerIndex].teamName = teamData.teamName;
        $PostDataScore.allLoadedData[$TeamPickerDataScore.teamPickerIndex].teamImage = teamData.teamImage;

        window.parent.postMessage({
            type: 'addTeamToUserData',
            data: { "allTeamData" :$General.allTeamData }
        }, '*');

        $TeamPickerDataScore.showTeamPicker = false;
    }

    onMount(() => {
        teamData = {
            teamName: $PostDataScore.allLoadedData[$TeamPickerDataScore.teamPickerIndex].teamName, 
            teamImage: $PostDataScore.allLoadedData[$TeamPickerDataScore.teamPickerIndex].teamImage
        } || teamData
    });

    const handleMessage = (ev) => {
        if (!imageFetching) return

        const { type, data } = ev.data;

        if (type === 'devvit-message') {
            const { message } = data;

            if (message.type === 'imageUploaded') {
                // $ShowLoader = true

                console.log('Image uploaded:', message.data.imageUrl);
                const checkImageUrl = async () => {
                    try {
                        const response = await fetch(message.data.imageUrl);
                        if (response.status === 404) {
                            setTimeout(checkImageUrl, 500);
                        } else {

                            console.log('Image exists:', message.data.imageUrl);
                            teamData.teamImage = message.data.imageUrl;
                            // $ShowLoader = false

                        }
                    } catch (error) {
                        console.error('Error checking image URL:', error);
                        setTimeout(checkImageUrl, 500);
                    }
                };

                checkImageUrl();

                imageFetching = false;
            }
            
        }
    };


</script>

<svelte:window on:message={handleMessage}/>


<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div transition:fade={{duration:400, easing: cubicOut}} on:click|self={()=>$TeamPickerDataScore.showTeamPicker = false} class="z-[150] backdrop-blur-[5px] text-[2.8em] bg-pickem-header-bg fixed left-0 top-0 h-full w-full  mx-auto flex flex-col xsm:flex-row justify-center items-center gap-3hem
    xsm:text-[1.5em]">
    
    <div transition:scale={{start:0.9, duration:400, easing: cubicOut}} class="text-[2em] space-y-[0.52em]">
        <div class=" flex justify-center  gap-[0.52em]">
            <button on:click={addImage} class="cursor-pointer relative size-[0.8em] block">
                <BoxButton>
                    <div class="leading-0 text-[0.78em] size-[0.8em] absolute top-1/2 left-1/2 -translate-1/2">
                        {#if teamData.teamImage}
                            <div class="h-full w-full aspect-square shrink-0"><img class="w-full h-full object-cover" src={teamData.teamImage} alt=""></div>
                        {:else}
                            <svg  viewBox="0 0 15 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.101562 6.98438H14.8953L10.2723 0.820312L6.57383 5.75156L3.8 2.05313L0.101562 6.98438Z" fill="#fff"/>
                            </svg>
                        {/if}
                    </div>
                </BoxButton>
            </button>
            <div class="flex justify-center items-center w-[4.7em] h-[0.8em] text-center relative">
                <BoxButton>
                    <input bind:value={teamData.teamName} type="text" placeholder="team Name" class="absolute text-center left-0 w-full h-full text-[0.35em] font-inter-italic font-bold uppercase" />
                </BoxButton>
            </div>
        </div>
        <button on:click={addTeam} class="cursor-pointer group flex justify-center items-center w-full h-[0.8em] text-center relative">
            <BoxButton>
                <div 
                style="transition:none"
                class=" group-hover:bg-black group-hover:text-white text-center bg-white px-[0.6em] text-[0.4em] h-full flex justify-center items-center text-black font-inter-italic font-bold uppercase">add</div>
            </BoxButton>
        </button>
    </div>
    <div transition:scale={{start:0.9, duration:400, easing: cubicOut}} class:hidden={$General.allTeamData.length == 0} class="w-[80%] h-[1px] xsm:w-[1px] xsm:h-[50%] bg-white"></div>
    <div transition:scale={{start:0.9, duration:400, easing: cubicOut}} class:hidden={$General.allTeamData.length == 0} class="h-[50%] xsm:h-[80%] flex flex-col justify-between">
        <p class="font-inter-italic font-bold uppercase text-[#b0b0b0]">History</p>
        <div class="h-[calc(100%-1em)] -mx-[0.2em] p-[0.2em] overflow-y-scroll text-[2em] space-y-[0.52em]">
            {#each $General.allTeamData as genTeamData, index}
                <button
                on:click={()=>{teamData = genTeamData}}
                class="group cursor-pointer flex justify-center  gap-[0.52em]">
                    <div
                    style="transition: none;"
                    class=" group-hover:bg-[#454545]  relative size-[0.8em] block">
                        <BoxButton>
                            <div class="leading-0 text-[0.78em] size-[0.8em] absolute top-1/2 left-1/2 -translate-1/2">
                                {#if genTeamData.teamImage}
                                    <div class="h-full w-full aspect-square shrink-0"><img class="w-full h-full object-cover" src={genTeamData.teamImage} alt=""></div>
                                {:else}
                                    <svg  viewBox="0 0 15 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0.101562 6.98438H14.8953L10.2723 0.820312L6.57383 5.75156L3.8 2.05313L0.101562 6.98438Z" fill="#fff"/>
                                    </svg>
                                {/if}
                            </div>
                        </BoxButton>
                    </div>
                    <div
                    style="transition: none;"
                    class=" group-hover:bg-[#454545] flex justify-center items-center w-[4.7em] h-[0.8em] text-center relative">
                        <BoxButton>
                            <div class="flex justify-center items-center absolute text-center left-0 w-full h-full text-[0.35em] font-inter-italic font-bold uppercase" >
                                {genTeamData.teamName}
                            </div>
                        </BoxButton>
                    </div>
                </button>
            {/each}
        </div>
    </div>

    
</div>