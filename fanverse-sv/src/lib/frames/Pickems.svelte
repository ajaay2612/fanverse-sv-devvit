<script>
    import BoxButton from '../components/BoxButton.svelte';
    import DoubleElimEight from '../braket/DoubleElim-eight.svelte';
    import DoubleElim from '../braket/DoubleElim.svelte';
    import SingleElim from '../braket/SingleElim.svelte';
    import MultiElim from '../braket/MultiElim.svelte';
    import DropDownData from '../stores/DropDownData';
    import { fade } from 'svelte/transition';

    let teams = ["SEN", "DRX", "100T", "C9"];

    $: noOfTeam = $DropDownData[1].options[$DropDownData[1].active];
    $: elimMethod = $DropDownData[0].active;

    // let teams = ["SEN", "DRX", "100T", "C9", "TSM", "EG", "T1", "GEN"];

    $: console.log($DropDownData[3].active);
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
    class="border-b py-2em xsm:py-1em border-pickem-border-bottom">
        <div class="text-[1.2em] xsm:text-[0.7em] lg:text-[0.62em] w-fit mx-auto  relative pr-1hem ">
            <div class="flex justify-center items-center gap-[1.1em]">
                <div class="w-[2.8em]">
                    <img class="w-full h-full" src="/images/pickems/logo.svg" alt="">
                </div>
                <div class="">
                    <p class=" text-center font-inter leading-[1em] font-bold text-pickem-title text-[1.2em]">PICKE’EMS</p>
                    <p class="text-center font-inter font-bold text-[0.55em]">SUBTITLE</p>
                </div>
            </div>
            <div class="absolute top-[-0.2em] right-[0] h-[0.55em] size-[0.5em] text-[1.1em] text-center">
                <BoxButton>
                    <div class="w-[0.55em] absolute top-1/2 left-1/2 -translate-1/2">
                        <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0205 4.64387L10.9388 3.72558C11.6606 3.00377 11.6606 1.83348 10.9388 1.11167C10.217 0.38986 9.0467 0.389859 8.32489 1.11167L7.38886 2.0477C8.00598 3.13595 8.91598 4.03738 10.0205 4.64387ZM5.93422 3.50234L1.99303 7.44354C1.56797 7.8686 1.35544 8.08113 1.2157 8.34222C1.07597 8.60332 1.01702 8.89805 0.899131 9.4875L0.630258 10.8319C0.563736 11.1645 0.530475 11.3308 0.625083 11.4254C0.719691 11.52 0.885996 11.4867 1.21861 11.4202L2.56297 11.1513L2.56298 11.1513C3.15243 11.0334 3.44715 10.9745 3.70825 10.8348C3.96934 10.695 4.18187 10.4825 4.60692 10.0575L4.60693 10.0575L4.60693 10.0574L8.56156 6.10282C7.5086 5.43087 6.61352 4.54282 5.93422 3.50234Z" fill="white"/>
                        </svg>
                    </div>
                </BoxButton>
            </div>
        </div>
    </div>

    <!-- bracket -->
    <div class="text-[0.5em] h-[80%] flex items-center">
        {#if elimMethod === 0}
            {#key noOfTeam}
                <SingleElim  noOfTeam={noOfTeam}/>
            {/key}
        {:else if elimMethod === 1}
            {#if noOfTeam === 8}
                <div class="overflow-scroll h-[80vh] w-full text-[1.2em] lg:text-[1.4em]">
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


</div>
