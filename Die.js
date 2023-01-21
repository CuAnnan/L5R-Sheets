'use strict';
class Die
{
    static rollOnce()
    {
        return Math.floor(Math.random() * 10) + 1;
    }

    static roll(reroll10s = true, emphasis = false)
    {
        let face = this.rollOnce();
        if(emphasis && face === 1)
        {
            face = this.rollOnce();
        }
        let value = face;
        if(reroll10s)
        {
            while(face === 10)
            {
                face = this.rollOnce();
                value += face;
            }
        }
        return value;
    }
}

export default Die;