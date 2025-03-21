<script>
    import BoxButton from '../components/BoxButton.svelte';
    import DropDownDataScore from '../stores/DropDownDataScore';
    import TitleEditorScore from '$lib/components/TitleEditorScore.svelte';
    import { fade } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';


    import TeamPickerScore from '$lib/components/TeamPickerScore.svelte';
    import TeamPickerDataScore from '../stores/TeamPickerDataScore';
    import ScoreOne from '../components/score/ScoreOne.svelte';
    import ScoreTwo from '../components/score/ScoreTwo.svelte';

</script>

<div class="scoreBackgroundBlocksImage h-screen w-full">
    
    {#if $DropDownDataScore[0]?.active == 0}
        <!-- title -->
        <div class="relative w-[70%]">
            {#key $DropDownDataScore[1]?.active}
                <div transition:fade class="absolute left-0 top-0 w-full h-full scoreBackgroundBlocks"></div>
            {/key}

            <div 
            class="p-2em py-1em ">
            
                <TitleEditorScore/>
            </div>
        </div>
    
    {/if}

    <!-- {#if $DropDownDataScore[0]?.active  == 1}
        <div 
        class="font-bigShoulders py-2em xsm:py-1em ">
            <div class="absolute top-0 right-0 h-[3.9em] w-[calc(100%-3.9em)] bg-ranking-blocks"></div>
            <div class="absolute bottom-0 left-0 w-[3.9em] h-[calc(100%-3.9em)] bg-ranking-blocks"></div>
               
            <TitleEditorScore/>
        </div>
    {/if} -->


    <!-- ranking bars-->
    <div class="text-[0.5em] {$DropDownDataScore[0]?.active == 0 ? "h-[80%]": "h-full" }  flex items-center">
        
        {#if $TeamPickerDataScore.showTeamPicker }

            <!-- as -->
            <TeamPickerScore/>
        {/if}

        {#if $DropDownDataScore[0]?.active == 0}
            <ScoreOne/>
        {/if}
        {#if $DropDownDataScore[0]?.active == 1}
            <ScoreTwo/>
        {/if}
    </div>


</div>
