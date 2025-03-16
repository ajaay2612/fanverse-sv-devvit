import './createPost.js';

import { Devvit, useState, useWebView,useForm } from '@devvit/public-api';

import type { DevvitMessage, WebViewMessage } from './message.js';

Devvit.configure({
    redditAPI: true,
    redis: true,
    media: true,

});

// Add a custom post type to Devvit
Devvit.addCustomPostType({
    name: 'Web View Example',
    height: 'tall',
    render: (context) => {

        const imageUploadForm = useForm(
            {
                fields: [
                    {
                        name: 'imageUpload',
                        type: 'image',
                        label: 'Select an image to upload (WebP not allowed)',
                        required: true,
                    },
                ],
            },
            async (values) => {
                // onSubmit handler
                let imageUrlUp = values.imageUpload;
                // Check if the uploaded file is a WebP
                const isWebP = imageUrlUp.toLowerCase().endsWith('.webp');

                if (isWebP) {
                    context.ui.showToast('WebP files are not allowed. Please upload a different image format.')
                    imageUrlUp = ''
                }

                console.log('Image URL:', imageUrlUp);

                postMessage({
                    type: 'imageUploaded',
                    data: {
                      imageUrl: imageUrlUp
                    }
                });
            }
        );

        // Load username with `useAsync` hook
        const [username] = useState(async () => {
            return (await context.reddit.getCurrentUsername()) ?? 'anon';
        });

        // Load latest counter from redis with `useAsync` hook
        const [counter, setCounter] = useState(async () => {
            const redisCount = await context.redis.get(`counter_${context.postId}`);
            return Number(redisCount ?? 0);
        });

        const { mount, postMessage } = useWebView<WebViewMessage, DevvitMessage>({
            // URL of your web view content
            url: 'index.html',

            // Handle messages sent from the web view
            async onMessage(message, webView) {
                switch (message.type) {
                    case 'addImage':
                        context.ui.showForm(imageUploadForm);
                        break;
                    case 'addTeamToUserData':
                        await context.redis.set(
                            `allTeamData_${username}`,
                            JSON.stringify(message.data.allTeamData)
                        );
                        
                        break;
                    case 'webViewReady':
                        // await context.redis.set(
                        //     `allTeamData_${username}`,
                        //     JSON.stringify([])
                        // );
                        let allTeamData = await context.redis.get(`allTeamData_${username}`);
                        allTeamData = JSON.parse(allTeamData);
                        webView.postMessage({
                            type: 'initialData',
                            data: {
                                username: username,
                                currentCounter: counter,
                                allTeamData : allTeamData || [],
                            },
                        });
                        break;
                    case 'setCounter':
                        await context.redis.set(
                            `counter_${context.postId}`,
                            message.data.newCounter.toString()
                        );
                        setCounter(message.data.newCounter);

                        webView.postMessage({
                            type: 'updateCounter',
                            data: {
                                currentCounter: message.data.newCounter,
                            },
                        });

                        break;
                    default:
                        throw new Error(`Unknown message type: ${message satisfies never}`);
                }
            },
            onUnmount() {
                context.ui.showToast('Web view closed!');
            },
        });

        // Render the custom post type
        return (
            <vstack grow padding="small">
                <vstack grow alignment="middle center">
                    <text size="xlarge" weight="bold">
                        Example App
                    </text>
                    <spacer />
                    <vstack alignment="start middle">
                        <hstack>
                            <text size="medium">Username:</text>
                            <text size="medium" weight="bold">
                                {' '}
                                {username ?? ''}
                            </text>
                        </hstack>
                        <hstack>
                            <text size="medium">Current counter:</text>
                            <text size="medium" weight="bold">
                                {' '}
                                {counter ?? ''}
                            </text>
                        </hstack>
                    </vstack>
                    <spacer />
                    <button onPress={() => mount()}>Launch App</button>
                </vstack>
            </vstack>
        );
    },
});

export default Devvit;
