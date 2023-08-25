const COIN_VALUES = {
    'TTT':{base:'HHT', face:'-x-', plain:'- -', value:0},
    'HHT':{base:'HHT', face:'- -', plain:'- -', value:0},
    'HTT':{base:'HTT', face:'---', plain:'---', value:1},
    'HHH':{base:'HHT', face:'-o-', plain:'---', value:1}
};
COIN_VALUES.TTT.derivesTo = COIN_VALUES.HTT;
COIN_VALUES.HHH.derivesTo = COIN_VALUES.HTT;
COIN_VALUES.yin = COIN_VALUES.HHT;
COIN_VALUES.yang = COIN_VALUES.HTT;


class Trigram
{
    static NAMES = [
        'Heaven', 'Lake', 'Flame', 'Thunder', 'Wind', 'Water','Mountain','Earth'
    ];


    constructor()
    {
        this.lines = [];
        this.value = 7;
    }

    addLine(line)
    {
        this.value -= line.value?Math.pow(2, this.lines.length):0;
        this.lines.push(line);
        if(this.lines.length === 3)
        {
            this.name = Trigram.NAMES[this.value];
        }
    }
}

class Hexagram
{
    static yin = '¦';
    static yang = '|';

    // lower:upper
    static DATA = [
        [
            { name: 'Force', hex: '䷀' },
            { name: 'Displacement', hex: '䷪' },
            { name: 'Great Possessing', hex: '䷍' },
            { name: 'Great Invigorating', hex: '䷡' },
            { name: 'Small Harvest', hex: '䷈' },
            { name: 'Attending', hex: '䷄' },
            { name: 'Great Accumulating', hex: '䷙' },
            { name: 'Pervading', hex: '䷊' }
        ],
        [
            { name: 'Treading', hex: '䷉' },
            { name: 'Open', hex: '䷹' },
            { name: 'Polarising', hex: '䷥' },
            { name: 'Converting the Maiden', hex: '䷵' },
            { name: 'Inner Truth', hex: '䷼' },
            { name: 'Articulating', hex: '䷻' },
            { name: 'Diminishing', hex: '䷨' },
            { name: 'Nearing', hex: '䷒' }
        ],
        [
            { name: 'Concording People', hex: '䷌' },
            { name: 'Skinning', hex: '䷰' },
            { name: 'Radiance', hex: '䷝' },
            { name: 'Abounding', hex: '䷶' },
            { name: 'Dwelling People', hex: '䷤' },
            { name: 'Already Fording', hex: '䷾' },
            { name: 'Adorning', hex: '䷕' },
            { name: 'Intelligence Hidden', hex: '䷣' }
        ],
        [
            { name: 'Innocence', hex: '䷘' },
            { name: 'Following', hex: '䷐' },
            { name: 'Gnawing Bite', hex: '䷔' },
            { name: 'Shake', hex: '䷲' },
            { name: 'Augmenting', hex: '䷩' },
            { name: 'Sprouting', hex: '䷂' },
            { name: 'Swallowing', hex: '䷚' },
            { name: 'Returning', hex: '䷗' }
        ],
        [
            { name: 'Coupling', hex: '䷫' },
            { name: 'Great Exceeding', hex: '䷛' },
            { name: 'Holding', hex: '䷱' },
            { name: 'Persevering', hex: '䷟' },
            { name: 'Ground', hex: '䷸' },
            { name: 'Welling', hex: '䷯' },
            { name: 'Correcting', hex: '䷑' },
            { name: 'Ascending', hex: '䷭' }
        ],
        [
            { name: 'Arguing', hex: '䷅' },
            { name: 'Confining', hex: '䷮' },
            { name: 'Before Completion', hex: '䷿' },
            { name: 'Deliverance', hex: '䷧' },
            { name: 'Dispersing', hex: '䷺' },
            { name: 'Gorge', hex: '䷜' },
            { name: 'Enveloping', hex: '䷃' },
            { name: 'Leading', hex: '䷆' }
        ],
        [
            { name: 'Retiring', hex: '䷠' },
            { name: 'Conjoining', hex: '䷞' },
            { name: 'Sojourning', hex: '䷷' },
            { name: 'Small Exceeding', hex: '䷽' },
            { name: 'Infiltrating', hex: '䷴' },
            { name: 'Limping', hex: '䷦' },
            { name: 'Bound', hex: '䷳' },
            { name: 'Humbling', hex: '䷎' }
        ],
        [
            { name: 'Obstruction', hex: '䷋' },
            { name: 'Clustering', hex: '䷬' },
            { name: 'Prospering', hex: '䷢' },
            { name: 'Providing-For', hex: '䷏' },
            { name: 'Viewing', hex: '䷓' },
            { name: 'Grouping', hex: '䷇' },
            { name: 'Stripping', hex: '䷖' },
            { name: 'Field', hex: '䷁' }
        ]
    ];

    constructor()
    {
        this.lines = [];
        this.upper = new Trigram();
        this.lower = new Trigram();
        this.hasDerivation = false;
        this.derivation = null;
        this.name = null;
        this.hex = null;
    }

    addLine(line)
    {
        this.lines.push(line);
        if(this.lines.length < 4)
        {
            this.upper.addLine(line);
        }
        else
        {
            this.lower.addLine(line);
        }

        if(line.derivesTo)
        {
            this.hasDerivation = true;
        }

        if(this.lines.length === 6)
        {
            const data = Hexagram.DATA[this.lower.value][this.upper.value];
            this.name = data.name;
            this.hex = data.hex;
            this.derivation = null;
            if(this.hasDerivation)
            {
                this.derivation = this.getDerivation();
            }
        }
    }

    generateImage()
    {

    }

    getDerivation()
    {
        if(this.hasDerivation)
        {
            const derivation = new Hexagram();
            for(const line of this.lines)
            {
                let lineValue = line.derivesTo?line.derivesTo:line;
                derivation.addLine(lineValue);
            }
            return derivation;
        }
        return null;
    }

    toString()
    {
        let string = '';
        for(let line of this.lines)
        {
            string += line.value?Hexagram.yang:Hexagram.yin;
        }
        return string;
    }

    static fromString(hexString)
    {
        const hex = new Hexagram();
        const chars = hexString.split('');
        for(const char of chars)
        {
            if(char === Hexagram.yin)
            {
                hex.addLine(COIN_VALUES.yin);
            }
            if(char === Hexagram.yang)
            {
                hex.addLine(COIN_VALUES.yang);
            }
        }
        return hex;
    }
}

class IChing
{
    static generateHex()
    {
        const hex = new Hexagram();
        for(let i = 0; i < 6; i++)
        {
            let coin_toss = [];
            for(let j = 0; j < 3; j++)
            {
                coin_toss.push((Math.floor(Math.random() * 2) === 0)?'H':'T');
            }
            hex.addLine(COIN_VALUES[coin_toss.sort().join('')]);
        }
        return hex;
    }
}
export {IChing as IChing};
export {Hexagram as Hexagram};