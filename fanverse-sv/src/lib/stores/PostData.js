import { writable } from 'svelte/store';

const PostData = writable({
    BackgroundImageUrl:"",
    BackgroundImageUrlBrightness:25,
    BackgroundImageUrlBlur:0,
    logo:"/images/pickems/logo.svg",
    title:"PICKE'EMS",
    subTitle:"SUBTITLE",
    allTeamLoadedData:[
        // {"teamName":"luffy","teamImage":"https://static.vecteezy.com/system/resources/thumbnails/023/596/383/small/generative-ai-an-neon-gamer-anime-fashion-boy-or-man-wearing-headphones-lost-in-his-music-abstract-background-that-evokes-the-feeling-of-different-genres-of-music-banner-music-concept-photo.jpg"},
        // {"teamName":"zoro","teamImage":"https://static.vecteezy.com/system/resources/thumbnails/033/662/051/small/cartoon-lofi-young-manga-style-girl-while-listening-to-music-in-the-rain-ai-generative-photo.jpg"},
        // {"teamName":"sanji","teamImage":"https://img.freepik.com/premium-vector/vector-young-man-animestyle-character-vector-illustration-design-manga-anime-boy_147933-12515.jpg"},
        // {"teamName":"nami","teamImage":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiZfMBP2o22XbKR4zV3QtyV8CcQtguJRFjZg&s"},
        // {"teamName":"luffy","teamImage":"https://static.vecteezy.com/system/resources/thumbnails/023/596/383/small/generative-ai-an-neon-gamer-anime-fashion-boy-or-man-wearing-headphones-lost-in-his-music-abstract-background-that-evokes-the-feeling-of-different-genres-of-music-banner-music-concept-photo.jpg"},
        // {"teamName":"zoro","teamImage":"https://static.vecteezy.com/system/resources/thumbnails/033/662/051/small/cartoon-lofi-young-manga-style-girl-while-listening-to-music-in-the-rain-ai-generative-photo.jpg"},
        // {"teamName":"sanji","teamImage":"https://img.freepik.com/premium-vector/vector-young-man-animestyle-character-vector-illustration-design-manga-anime-boy_147933-12515.jpg"},
        // {"teamName":"nami","teamImage":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiZfMBP2o22XbKR4zV3QtyV8CcQtguJRFjZg&s"},
    ],
    // finalBracketData:null,
    isCreator:false,
    canPost:false,
});

export default PostData;