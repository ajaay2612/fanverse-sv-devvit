<script>
    import BoxButton from '../components/BoxButton.svelte';
    import DropDownDataRanking from '../stores/DropDownDataRanking';
    import TitleEditorRanking from '../components/TitleEditorRanking.svelte';
    import { fade } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';

    import RankingTypeOne from '../components/ranking/RankingTypeOne.svelte';
    import RankingTypeTwo from '../components/ranking/RankingTypeTwo.svelte';
    import TeamPickerRanking from '$lib/components/TeamPickerRanking.svelte';
    import TeamPickerDataRanking from '$lib/stores/TeamPickerDataRanking';


</script>

<div class="h-screen w-full">
    
    {#if $DropDownDataRanking[0]?.active == 0}
        {#if $DropDownDataRanking[1].active == 0}
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
                </div>                  
            </div>
        {/if}
    
        <!-- title -->
        <div 
        style="border-width:{$DropDownDataRanking[1].active == 0 ? "" : "0"}; padding-bottom:{$DropDownDataRanking[1].active == 0 ? "" : "0"}"
        class="border-b py-2em xsm:py-1em border-pickem-border-bottom">
            
             <TitleEditorRanking/>
        </div>
    
    {/if}

    {#if $DropDownDataRanking[0]?.active  == 1}
        <div 
        class="font-bigShoulders py-2em xsm:py-1em ">
            <div class="absolute top-0 right-0 h-[3.9em] w-[calc(100%-3.9em)] bg-ranking-blocks"></div>
            <div class="absolute bottom-0 left-0 w-[3.9em] h-[calc(100%-3.9em)] bg-ranking-blocks"></div>
               
            <TitleEditorRanking/>
        </div>
    {/if}


    <!-- ranking bars-->
    <div class="text-[0.5em] h-[80%] flex items-center">
        
        {#if $TeamPickerDataRanking.showTeamPicker}
            <TeamPickerRanking/>
        {/if}

        {#if  $DropDownDataRanking[0]?.active == 0}
            <RankingTypeOne/>
        {/if}
        {#if  $DropDownDataRanking[0]?.active == 1}
            <RankingTypeTwo/>
        {/if}


    </div>


</div>
