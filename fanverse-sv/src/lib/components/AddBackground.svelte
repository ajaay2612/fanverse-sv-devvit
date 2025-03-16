<script>
    import BoxButton from './BoxButton.svelte';
    import PostData from '$lib/stores/PostData';

    let imageFetching = false;

    function addImage() {
        imageFetching = true;
        console.log('Adding image...');
        window.parent.postMessage({
            type: 'addImage'
        }, '*');
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
                            $PostData.BackgroundImageUrl = message.data.imageUrl;
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
<button on:click={addImage} class="cursor-pointer pointer-events-auto z-[20]  text-[2em] xsm:text-[1em] relative size-[0.72em] block ml-auto">
    <BoxButton>
        <div class="leading-0 text-[0.78em] size-[0.8em] absolute top-1/2 left-1/2 -translate-1/2"> 
            <svg  viewBox="0 0 15 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.101562 6.98438H14.8953L10.2723 0.820312L6.57383 5.75156L3.8 2.05313L0.101562 6.98438Z" fill="#fff"/>
            </svg>                        
        </div>
    </BoxButton>
</button>