<script>
    import BoxButton from '../components/BoxButton.svelte';
    import DropDownDataScore from '../stores/DropDownDataScore';
    import TitleEditorScore from '$lib/components/TitleEditorScore.svelte';
    import { fade } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
    import General from '$lib/stores/General';

    import TeamPickerScore from '$lib/components/TeamPickerScore.svelte';
    import TeamPickerDataScore from '../stores/TeamPickerDataScore';
    import ScoreOne from '../components/score/ScoreOne.svelte';
    import ScoreTwo from '../components/score/ScoreTwo.svelte';
    import PostDataScore from '../stores/PostDataScore';
</script>

<div class="{$PostDataScore.BackgroundImageUrl && $DropDownDataScore[0].active == 0 ? "scoreBackgroundBlocksImage" : ""} h-screen w-full">
    
    {#if $DropDownDataScore[0]?.active == 0}
        <!-- title -->
        <div class="relative w-[80%] xsm:w-[75%]">
            {#key $DropDownDataScore[1]?.active}
                <div transition:fade class="absolute left-0 top-0 w-full h-full scoreBackgroundBlocks"></div>
            {/key}

            <div 
            class="p-2em py-1em ">
            
                <div class="xsm:text-[1.2em]"><TitleEditorScore/></div>
            </div>
        </div>
    
    {/if}

    {#if $DropDownDataScore[0]?.active  == 1}
        {#if $General.mode == "create"}
            <div 
            class="absolute p-1em ">
                <TitleEditorScore/>
            </div>
        {/if}
    {/if}


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
