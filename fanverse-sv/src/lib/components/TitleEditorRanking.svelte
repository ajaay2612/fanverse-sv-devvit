<script>
    import { fade, scale } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
    import BoxButton from './BoxButton.svelte';
    import General from '$lib/stores/General';
    import DropDownDataRanking from '$lib/stores/DropDownDataRanking';
    import PostDataRanking from '$lib/stores/PostDataRanking';

    $: postData = PostDataRanking;
    
    // $: console.log('PostDataRanking:', $PostDataRanking);

    let showTitleEdit = false;
    let imageFetching = false;

    function toggleTitleEdit() {
        // console.log('Toggling title edit...');
        showTitleEdit = !showTitleEdit;
    }

    function trimBackgroundImageUrl() {
        // Access the URL from PostData
        const url = $postData.logo;
        
        // Check if the URL exists
        if (!url) {
            return "";
        }
        
        // Check if URL is longer than 20 characters
        if (url.length > 20) {
            // Trim to 20 characters and add "..."
            return url.substring(0, 15) + "...";
        }
        
        // Return the full URL if it's 20 characters or less
        return url;
    }

    function addImage() {
        imageFetching = true;
        console.log('Adding image...');
        window.parent.postMessage({
            type: 'addImage'
        }, '*');
    }

    function resetImage() {
        $postData.logo = '';
    }

    const handleMessage = (ev) => {
        if (!imageFetching) return;
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
                            $postData.logo = message.data.imageUrl;
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

    let dropDownElement = null
</script>
<svelte:window 
on:message={handleMessage}
on:click={(e) => {!dropDownElement.contains(e.target) ? showTitleEdit = false:'' } }/>

<div bind:this={dropDownElement} class="z-[10] relative w-fit flex justify-center items-center mx-auto">
    <button on:click={$General.mode == "create" ? toggleTitleEdit:""} class="text-[1.2em] xsm:text-[0.7em] lg:text-[0.62em] w-fit mx-auto  relative  ">
        <div class="flex justify-center items-center gap-[1.1em]">
            {#if $postData.logo}
                <div class="w-[2.8em]">
                    <img class="w-full h-full" src={$postData.logo} alt="">
                </div>
            {/if}
            <div class="">
                <p class=" text-center {$DropDownDataRanking[0]?.active  == 0 ? "font-inter ":"font-bigShoulders text-[1.8em]" } font-bold leading-[1em]  text-pickem-title text-[1.2em]">{$postData.title}</p>
                <p class="text-center {$DropDownDataRanking[0]?.active  == 0 ? "font-inter ":"font-bigShoulders text-[0.81em]" }  font-bold text-[0.55em]">{$postData.subTitle}</p>
            </div>
        </div>
        {#if $General.mode == "create"}
            <div  class="absolute top-[-0.2em] right-[-1em] h-[0.55em] size-[0.5em] text-[1.1em] text-center">
                <BoxButton>
                    <div class="w-[0.55em] absolute top-1/2 left-1/2 -translate-1/2">
                        <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0205 4.64387L10.9388 3.72558C11.6606 3.00377 11.6606 1.83348 10.9388 1.11167C10.217 0.38986 9.0467 0.389859 8.32489 1.11167L7.38886 2.0477C8.00598 3.13595 8.91598 4.03738 10.0205 4.64387ZM5.93422 3.50234L1.99303 7.44354C1.56797 7.8686 1.35544 8.08113 1.2157 8.34222C1.07597 8.60332 1.01702 8.89805 0.899131 9.4875L0.630258 10.8319C0.563736 11.1645 0.530475 11.3308 0.625083 11.4254C0.719691 11.52 0.885996 11.4867 1.21861 11.4202L2.56297 11.1513L2.56298 11.1513C3.15243 11.0334 3.44715 10.9745 3.70825 10.8348C3.96934 10.695 4.18187 10.4825 4.60692 10.0575L4.60693 10.0575L4.60693 10.0574L8.56156 6.10282C7.5086 5.43087 6.61352 4.54282 5.93422 3.50234Z" fill="white"/>
                        </svg>
                    </div>
                </BoxButton>
            </div>
        {/if}
    </button>
    
    {#if showTitleEdit}
        <div transition:fade={{duration:400, easing: cubicOut}} class="text-[1.5em] xsm:text-[1em] {$DropDownDataRanking[0]?.active  == 0 ? "font-inter":"font-bigShoulders" }   font-semibold uppercase absolute top-full mt-[0.5em] right-[-5px] bg-[#2a2320]">
            <div class="text-[0.5em] p-[0.5em] space-y-0hem">
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <div transition:scale={{start:0.9, duration:400, easing: cubicOut}} class="flex justify-center items-center gap-[0.5em]">
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <button on:click={addImage} class="uppercase cursor-pointer grow px-[0.6em] text-center bg-[#00000046] p-[0.4em] w-[12em]">
                        {trimBackgroundImageUrl() || "add bg image"}
                    </button>
                    <!-- svelte-ignore a11y_consider_explicit_label -->
                    {#if $postData.logo}
                        <button on:click={resetImage} class="bg-[#00000046] p-[0.6em] size-[2.2em]">
                            <svg viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.58203 19.75C2.9862 19.75 2.47613 19.5378 2.05182 19.1135C1.62752 18.6892 1.41536 18.1792 1.41536 17.5833V3.5H0.332031V1.33333H5.7487V0.25H12.2487V1.33333H17.6654V3.5H16.582V17.5833C16.582 18.1792 16.3699 18.6892 15.9456 19.1135C15.5213 19.5378 15.0112 19.75 14.4154 19.75H3.58203ZM14.4154 3.5H3.58203V17.5833H14.4154V3.5ZM5.7487 15.4167H7.91536V5.66667H5.7487V15.4167ZM10.082 15.4167H12.2487V5.66667H10.082V15.4167Z" fill="white"/>
                            </svg>
                        </button>
                    {/if}
                </div>
                <div transition:scale={{start:0.9, duration:400, easing: cubicOut}} class="flex justify-center items-center gap-[0.5em] w-full">
                    <div class="w-full  relative uppercase cursor-pointer px-[0.6em] text-center bg-[#00000046] p-[0.4em]  h-[2.2em]">
                        <div class="relative w-full">
                            <input class="w-full" bind:value={$postData.title} type="text" placeholder="Enter Title">
                        </div>
                    </div>
                </div>
                <div transition:scale={{start:0.9, duration:400, easing: cubicOut}} class="flex justify-center items-center gap-[0.5em] w-full">
    
                    <div class="w-full relative uppercase cursor-pointer px-[0.6em] text-center bg-[#00000046] p-[0.4em]  h-[2.2em]">
                        <div class="relative w-full">
                            <input class="w-full" bind:value={$postData.subTitle} type="text" placeholder="Enter Subtitle">
                        </div>
                    </div>
                </div>
    
            </div>
        </div>
    {/if}
</div>
