<script>
    import BoxButton from '../components/BoxButton.svelte';
    import DoubleElimEight from '../braket/DoubleElim-eight.svelte';
    import DoubleElim from '../braket/DoubleElim.svelte';
    import SingleElim from '../braket/SingleElim.svelte';
    import MultiElim from '../braket/MultiElim.svelte';
    import DropDownData from '../stores/DropDownData';
    import TitleEditor from '../components/TitleEditor.svelte';
    import { fade } from 'svelte/transition';
    import TeamPicker from '$lib/components/TeamPicker.svelte';
    import TeamPickerData from '$lib/stores/TeamPickerData';
    import PostData from '$lib/stores/PostData';
    import { cubicOut } from 'svelte/easing';
    import General from '$lib/stores/General';

    let teams = ["SEN", "DRX", "100T", "C9"];

    $: noOfTeam = $DropDownData[1].options[$DropDownData[1].active];
    $: elimMethod = $DropDownData[0].active;

    // let teams = ["SEN", "DRX", "100T", "C9", "TSM", "EG", "T1", "GEN"];

    // $: console.log($DropDownData[3].active);

    
</script>

<div class="h-screen w-full">
    <!-- {#key $DropDownData[3].active}
        <div in:fade={{duration:500}} class=" pickem-main-bg-gradient  translate-y-[10%] h-full w-full absolute top-0 left-0 z-0 pointer-events-none"></div>
        {/key} -->
    
   

    {#if $DropDownData[2].active == 0}
        <div class="flex  items-end h-full w-full  absolute bottom-0  left-0 z-0 pointer-events-none">
            <div class="w-full">
                <div class="">
                    <svg class="object-cover" width="100%" height="100%" viewBox="0 0 1919 908" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0.269531H1919V907.27H0V0.269531Z" fill="url(#paint0_linear_2634_1674)"/>
                        <defs>
                        <linearGradient id="paint0_linear_2634_1674" x1="959.5" y1="550.898" x2="959.5" y2="907.27" gradientUnits="userSpaceOnUse">
                        <stop stop-color="var(--color-pickem-main-bg-gradient-one)" stop-opacity="0"/>
                        <stop offset="1" stop-color="var(--color-pickem-main-bg-gradient-two)" stop-opacity="0.43"/>
                        </linearGradient>
                        </defs>
                    </svg>
                </div>
    
                <!-- <svg width="100%" height="100%" viewBox="0 0 1919 907" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_2632_834)">
                    <path d="M0 152.07H1919V1059.07H0V152.07Z" fill="url(#paint0_linear_2632_834)"/>
                    </g>
                    <defs>
                    <linearGradient id="paint0_linear_2632_834" x1="959.5" y1="702.699" x2="959.5" y2="1059.07" gradientUnits="userSpaceOnUse">
                    <stop stop-color="var(--color-pickem-main-bg-gradient-one)" stop-opacity="0"/>
                    <stop offset="1" stop-color="var(--color-pickem-main-bg-gradient-two)" stop-opacity="0.43"/>
                    </linearGradient>
                    <clipPath id="clip0_2632_834">
                    <rect width="100%" height="100%" fill="white"/>
                    </clipPath>
                    </defs>
                </svg> -->
            </div>                  
        </div>
    {/if}

    <!-- title -->
    <div 
    style="border-width:{$DropDownData[2].active == 0 ? "" : "0"}; padding-bottom:{$DropDownData[2].active == 0 ? "" : "0"}"
    class="border-b py-2em xsm:py-1em border-pickem-border-bottom ">
        
         <TitleEditor/>
    </div>

    <!-- bracket -->
    <div class="text-[0.5em] h-[80%] flex items-center">
       
        {#if $TeamPickerData.showTeamPicker}
            <TeamPicker/>
        {/if}


        {#if elimMethod === 0}
            {#key noOfTeam}
                <SingleElim  noOfTeam={noOfTeam}/>
            {/key}
        {:else if elimMethod === 1}
            {#if noOfTeam === 8}
                <div class="overflow-auto h-[80vh] w-full text-[1.2em] lg:text-[1.4em]">
                    <DoubleElimEight />
                </div>
            {:else}
                <div class="h-[80vh] w-full">
                    <DoubleElim />
                </div>
            {/if}
        {:else}
            <div class="w-full h-full">
                {#key noOfTeam}
                    <MultiElim  noOfTeam={noOfTeam}/>
                {/key}
            </div>
        {/if}
        
        
    </div>

    {#if $General.mode === "vote"}
        <p
        class=" text-white absolute bottom-[1.2em] text-[0.65em] whitespace-nowrap left-1/2 -translate-x-1/2  font-inter-italic  text-center"
        >Click teams to predict the winner of the bracket</p>
    {/if}
</div>
