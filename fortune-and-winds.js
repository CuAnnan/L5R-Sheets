class FortuneAndWindsDie
{
    constructor(name, faces, rerollable = true)
    {
        this.name = name;
        this.faces = faces;
        this.rerollable = rerollable;
        this.keeping = false;
        this.face = null;
    }

    roll()
    {
        let face=Math.floor(Math.random() * 6);
        this.face = this.faces[face];
        return this.face;
    }

    keep()
    {
        if(!this.rerollable)
        {
            return;
        }
        this.keeping = true;
    }

    isKept()
    {
        return this.keeping;
    }

    toString()
    {
        return this.face;
    }
}



class FortuneAndWinds
{
    static winningHands = {
        "North East West South Fortune":{name:"Fortunes and Winds", payout:4},
        "North East West South Sun":{name:"The Lady's Breath", payout:4},
        "North East West South Void":{name:"Empty Winds", payout:2},
        "Earth Water Fire Air Void":{name:"Sinsei's Blessing", payout:2},
        "Earth Water Fire Air Sun":{name:"The Lady's Tears", payout:2},
        "Earth Water Fire Air Fortune":{name:"Seven Thunders", payout:1}
    };

    static handOrder = ['earth', 'water', 'fire', 'air', 'void'];

    constructor()
    {
        this.throws = 0;
        this.buildDice();
        this.faces = [];
    }

    buildDice()
    {
        this.dice = {
            "earth":new FortuneAndWindsDie("Earth", ["Earth", "Earth", "Earth", "North", "North", "Rice"]),
            "water":new FortuneAndWindsDie("Water", ["Water", "Water", "Water", "East", "East", "Fish"]),
            "fire":  new FortuneAndWindsDie("Fire",   ["Fire", "Fire", "Fire", "West", "West", "Tree"]),
            "air": new FortuneAndWindsDie("Air",  ["Air", "Air", "Air", "South", "South", "Bird"]),
            "void": new FortuneAndWindsDie("Void",  ["Void", "Void", "Fortunes", "Fortunes", "Sun", "Moon"], false),
        };
    }

    static checkHand(handAsString)
    {
        if(FortuneAndWinds.winningHands[handAsString])
        {
            return FortuneAndWinds.winningHands[handAsString];
        }
        return {name:"Nothing", value:0};
    }

    roll()
    {
        if(this.throws >= 3)
        {
            return this.faces;
        }
        this.faces = {};
        for(let die of Object.values(this.dice))
        {
            if(!die.isKept())
            {
                die.roll();
            }
            this.faces[die.name] = die.face;
        }

        if(this.dice.void.face === 'Moon')
        {
            this.throws = 3;
            return this.faces;
        }

        let result = FortuneAndWinds.checkHand(this.getHand());
        if(result.payout)
        {
            this.throws = 3;
            return this.faces;
        }

        this.throws++;
        return this.faces;
    }

    keep(diceNames)
    {
        for(let dieName of diceNames)
        {
            this.dice[dieName.trim().toLowerCase()].keep();
        }
        let dice = {keep:[], roll:[]}
        for(let die of Object.values(this.dice))
        {
            if(die.keeping)
            {
                dice.keep.push(die.name);
            }
            else
            {
                dice.roll.push(die.name);
            }
        }
        return dice;
    }

    getHand()
    {
        let hand = [];
        for(let die of Object.values(this.dice))
        {
            hand.push(die.face);
        }
        return hand.join(' ');
    }

    getRemainingThrows()
    {
        return 3 - this.throws;
    }
}

export default FortuneAndWinds;