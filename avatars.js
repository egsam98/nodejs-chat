
const _avatars = [
    'https://d1u5p3l4wpay3k.cloudfront.net/dota2_gamepedia/4/4f/Emoticon_blush.gif',
    'https://d1u5p3l4wpay3k.cloudfront.net/dota2_gamepedia/1/19/Emoticon_cheeky.gif',
    'https://d1u5p3l4wpay3k.cloudfront.net/dota2_gamepedia/c/cb/Emoticon_crazy.gif',
    'https://d1u5p3l4wpay3k.cloudfront.net/dota2_gamepedia/e/ec/Emoticon_cool.gif',
    'https://d1u5p3l4wpay3k.cloudfront.net/dota2_gamepedia/a/ac/Emoticon_disapprove.gif',
    'https://d1u5p3l4wpay3k.cloudfront.net/dota2_gamepedia/1/16/Emoticon_cry.gif',
    'https://d1u5p3l4wpay3k.cloudfront.net/dota2_gamepedia/a/af/Emoticon_laugh.gif',
    'https://d1u5p3l4wpay3k.cloudfront.net/dota2_gamepedia/a/af/Emoticon_hush.gif',
    'https://d1u5p3l4wpay3k.cloudfront.net/dota2_gamepedia/c/c9/Emoticon_huh.gif',
    'https://d1u5p3l4wpay3k.cloudfront.net/dota2_gamepedia/d/d9/Emoticon_highfive.gif',
    'https://d1u5p3l4wpay3k.cloudfront.net/dota2_gamepedia/d/d9/Emoticon_happytears.gif',
    'https://d1u5p3l4wpay3k.cloudfront.net/dota2_gamepedia/0/00/Emoticon_facepalm.gif'
];

module.exports = () => {
    return _avatars[Math.floor(Math.random() * _avatars.length)];
};