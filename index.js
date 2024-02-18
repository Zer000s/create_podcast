const { Telegraf } = require('telegraf');
const ytdl = require('ytdl-core');
const fs = require('fs');
const ffmpeg = require('ffmpeg-static');

const bot = new Telegraf('6404265733:AAEGlV3l-5S6eiqZPdCa6nmET1kjttuooaA');

bot.start((ctx) => ctx.reply('Отправьте ссылку на видео YouTube'));

bot.on('text', (ctx) => {
    try 
    {
        var RegExp = /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/;
        const videoUrl = ctx.message.text;
        if(RegExp.test(videoUrl))
        {
            const options = {
                quality: 'highestaudio',
                filter: 'audioonly',
                format: 'mp3',
                audioEncoding: 'aac',
                ffmpegPath: ffmpeg.path,
            };

            const audioStream = ytdl(videoUrl, options);
            const audioFilePath = 'audio.mp3';
            const audioWriteStream = fs.createWriteStream(audioFilePath);
            audioStream.pipe(audioWriteStream);
            audioWriteStream.on('finish', async () => {
                await ctx.replyWithVoice({ source: audioFilePath });
                fs.unlinkSync(audioFilePath);
            });
        }
        else
        {
            ctx.reply('Отправьте ссылку на видео YouTube');
        }
    }
    catch (error) 
    {
        console.error('Произошла ошибка:', error);
        ctx.reply('Произошла ошибка при обработке вашего запроса.');
    }
});

bot.launch({dropPendingUpdates: true});