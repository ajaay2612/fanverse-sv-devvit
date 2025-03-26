<script>
    import HeaderScore from '../components/HeaderScore.svelte';
    
    import DropDownDataScore from '../stores/DropDownDataScore';
    
    import VoteDataScore from '../stores/VoteDataScore';
    // console.log("VoteDataScore",$VoteDataScore);
    
    // let voteData = VoteDataScore;
    // setTimeout(() => {
    //     voteData.canVote = true;
    // }, 2000);

    // console.log("changed");
    
    // $:console.log("VoteDataScore",$VoteDataScore);




    import { fade } from 'svelte/transition';
    import PostDataScore from '../stores/PostDataScore';
</script>


<!-- <button on:click={()=> $voteData.canVote = !$voteData.canVote }>{$voteData.canVote}</button> -->

<div 
class="{ $DropDownDataScore[0]?.active == 0 ? $DropDownDataScore[1].options[$DropDownDataScore[1].active].class : $DropDownDataScore[1].optionsTwo[$DropDownDataScore[1].active].class} bg-pickem-main-bg h-screen w-full overflow-hidden relative">

    {#if $PostDataScore.BackgroundImageUrl}
        <div 
        style="filter:brightness({Math.max(0, $PostDataScore.BackgroundImageUrlBrightness - 5)}%) blur({Math.max(0, $PostDataScore.BackgroundImageUrlBlur - 5)}px)"
        class=" absolute top-0 left-0 w-full h-full object-cover">
            <img src={$PostDataScore.BackgroundImageUrl} class="w-full h-full object-cover" alt="">
        </div>
    {/if}
    
    <div class="relative h-full w-full">
        <HeaderScore/>
        <slot/>
    </div>
</div>
