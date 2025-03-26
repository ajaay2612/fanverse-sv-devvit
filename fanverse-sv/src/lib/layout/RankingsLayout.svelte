<script>
    import HeaderRanking from '../components/HeaderRanking.svelte';
    
    import DropDownDataRanking from '../stores/DropDownDataRanking';
    
    import VoteDataRanking from '../stores/VoteDataRanking';
    // console.log("VoteDataRanking",$VoteDataRanking);
    
    // let voteData = VoteDataRanking;
    // setTimeout(() => {
    //     voteData.canVote = true;
    // }, 2000);

    // console.log("changed");
    
    // $:console.log("VoteDataRanking",$VoteDataRanking);




    import { fade } from 'svelte/transition';
    import PostDataRanking from '../stores/PostDataRanking';
</script>


<!-- <button on:click={()=> $voteData.canVote = !$voteData.canVote }>{$voteData.canVote}</button> -->

<div 
class="{ $DropDownDataRanking[0]?.active == 0 ? $DropDownDataRanking[1].active == 0 ? $DropDownDataRanking[2].options[$DropDownDataRanking[2].active] : $DropDownDataRanking[2].optionsTwo[$DropDownDataRanking[2].active].class  :  $DropDownDataRanking[2].secOptions[$DropDownDataRanking[2].active].class} bg-pickem-main-bg h-screen w-full overflow-hidden relative">

    {#if $PostDataRanking.BackgroundImageUrl}
        <div 
        style="filter:brightness({Math.max(0, $PostDataRanking.BackgroundImageUrlBrightness - 5)}%) blur({Math.max(0, $PostDataRanking.BackgroundImageUrlBlur - 5)}px)"
        class=" absolute top-0 left-0 w-full h-full object-cover">
            <img src={$PostDataRanking.BackgroundImageUrl} class="w-full h-full object-cover" alt="">
        </div>
    {:else}
        {#if $DropDownDataRanking[1].active == 0 && $DropDownDataRanking[0]?.active == 0}
            <div transition:fade={{duration:400}} class="absolute bottom-[-1.5em] left-[-7.5em] w-[15em] blur-[100px]">
                <svg viewBox="0 0 531 667" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect class="transition-[fill] duration-500 fill-(--color-pickem-left-box)" x="343.363" y="0.132812" width="221" height="647.837" transform="rotate(32 343.363 0.132812)" />
                </svg>            
            </div>
        
            <div class="absolute bottom-[-5em] left-[6em] w-[20em] blur-[85px]">
                <svg viewBox="0 0 752 1020" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect class="transition-[fill] fill-(--color-pickem-right-box)" x="564.438" y="0.355469" width="221" height="1063.82" transform="rotate(32 564.438 0.355469)"/>
                </svg>            
            </div>
        {/if}

        {#if $DropDownDataRanking[1].active == 1 && $DropDownDataRanking[0]?.active == 0}
            <div transition:fade={{duration:400}} class="brightness-75 scale-[4] xsm:scale-[1] lg:scale-[1.5] absolute top-0 left-0 w-full h-full object-cover">
                <svg width="2347" height="1733" viewBox="0 0 2347 1733" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#filter0_f_2637_1714)">
                    <ellipse fill="var(--color-circle-bg)" cx="1173.5" cy="866.5" rx="679" ry="372.5" />
                    </g>
                    <defs>
                    <filter id="filter0_f_2637_1714" x="0.799988" y="0.299988" width="2345.4" height="1732.4" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                    <feGaussianBlur stdDeviation="246.85" result="effect1_foregroundBlur_2637_1714"/>
                    </filter>
                    </defs>
                </svg>               
            </div>
        {/if}
    {/if}
    
    <div class="relative h-full w-full">
        <HeaderRanking/>
        <slot/>
    </div>
</div>
