import {Hexagram} from './I-Ching.js';
import {PNG} from 'pngjs';
import fs from 'fs';

const images = {};

function numberToTrigramString(bin)
{
    return (bin >>>0 ).toString(2).padStart(3,'0').split('').map(b=>parseInt(b)?Hexagram.yang:Hexagram.yin).join('');
}


function generateHexes()
{
    for(let i = 0; i < 8; i++)
    {
        const lower = numberToTrigramString(i);
        for(let j = 0; j < 8; j++)
        {
            const upper = numberToTrigramString(j);
            const hexString = lower+upper;
            const hex = Hexagram.fromString(hexString);
            const hexStringArray = hexString.split('').map(s=>s===Hexagram.yang?'yang':'yin');

            const hexImage = new PNG({width:images.yin.width,height:images.yin.height * 6});
            for(let l = 0; l < 6; l++)
            {
                // copy all of the pixels from either yin or yan to this ''line'' of the new image
                let image = images[hexStringArray[l]];
                for(let y = 0; y < image.height; y++)
                {
                    for(let x = 0; x < image.width; x++)
                    {
                        let oIDX = (image.width * y + x) << 2;
                        let nIDX = (image.width * (y + image.height * l) + x) << 2;
                        for(let idxOffset = 0; idxOffset < 4; idxOffset++)
                        {
                            hexImage.data[nIDX + idxOffset] = image.data[oIDX + idxOffset]
                        }
                    }
                }
            }
            hexImage
                .pack()
                .pipe(fs.createWriteStream(`./imgs/${hex.name}.png`))
                .on("finish", function(){
                    console.log(`Written ${hex.name} png file`);
                });
        }
    }
}

function readImage(img)
{
    return new Promise((resolve, reject)=>{
        fs
            .createReadStream(`./imgs/${img}.png`)
            .pipe(new PNG({}))
            .on('parsed', function(){
                images[img] = this;
                resolve();
            })

    });
}

readImage('yin')
    .then(()=>{return readImage('yang');})
    .then(()=>{
        generateHexes();
    })
    .catch((err)=>{
        console.warn(err);
    });
