import Die from "./Die.js";

class Pool
{
    constructor(roll, keep)
    {
        this.toRoll = roll;
        this.toKeep = keep;
    }

    roll(emphasis= false, bonusToRoll = 0, bonusToKeep = 0, bonusToResult = 0, rerolls = true, rerollValue = 10, tn)
    {
        let diceRolled = [];

        let toRoll = this.toRoll + bonusToRoll;

        let toKeep = this.toKeep + bonusToKeep;
        if(toRoll > 10)
        {
            let leftOvers = toRoll - 10;
            toRoll = 10;
            let bonusKeep = Math.floor(leftOvers / 2);
            toKeep += bonusKeep;
            if(toKeep > 10)
            {
                bonusToResult += (toKeep - 10) * 2;
                toKeep = 10;
            }
        }

        console.log(toRoll, toKeep);

        for(let i = 0; i < toRoll; i++)
        {
            diceRolled.push(Die.roll(rerolls, emphasis, rerollValue));
        }
        let sortedDice = diceRolled.sort((a, b)=>{return b - a;});
        let result = bonusToResult;
        for(let i = 0; i < toKeep; i++)
        {
            result += sortedDice[i];
        }

        let response = {result:result, diceRolled:diceRolled, toRoll:toRoll, toKeep:toKeep, bonus:bonusToResult};

        if(tn)
        {
            response.tn = tn;
            if(result >= tn)
            {
                response.success = 'success';
            }
            else
            {
                response.success = 'failure';
            }
        }

        return response;
    }
}

export default Pool;