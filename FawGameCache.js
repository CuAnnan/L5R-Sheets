import FaW from './fortune-and-winds.js';

class FawGameCache
{
    static timeoutLife = 1000 * 60 * 15;
    static players = {};

    static addPlayer(roomId, playerId)
    {
        let faw = new FaW();
        this.players[`${roomId}_${playerId}`] = {
            ts:Date.now(),
            hand:faw
        };
        return faw;
    }

    static getPlayerFaW(roomId, playerId)
    {
        let faw = this.players[`${roomId}_${playerId}`];
        if(!faw)
        {
            return null;
        }
        faw.ts = Date.now();
        return faw.hand;
    }


    static newThrow(roomId, playerId)
    {
        delete this.players[`${roomId}_${playerId}`];
        return this.addPlayer(roomId, playerId);
    }

    static checkForTimeouts()
    {
        let toDelete = [];
        let time = Date.now();
        for(let [key, object] of this.players)
        {
            if(time - object.ts >= this.timeoutLife)
            {
                toDelete.push(key);
            }
        }
        for(let key of toDelete)
        {
            delete this.players[key];
        }
    }
}

export default FawGameCache;