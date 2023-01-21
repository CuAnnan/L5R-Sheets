class SheetCache
{
    static timeoutLife = 1000 * 60 * 15;
    static sheetsByServerAndUser = {};

    static timeout;
    static storeSheet(guildId, userId, sheet)
    {
        this.sheetsByServerAndUser[`${guildId}_${userId}`] = sheet;
        if(!this.timeout)
        {
            this.checkCacheForTimeouts();
        }
    }

    static getSheet(guildId, userId)
    {
        return this.sheetsByServerAndUser[`${guildId}_${userId}`];
    }

    static checkCacheForTimeouts()
    {
        let now = Date.now();
        let toDelete = [];

        for(let [key, sheet] of Object.entries(this.sheetsByServerAndUser))
        {
            console.log(key, sheet);
            if(now - sheet.lastAccessed >= this.timeoutLife)
            {
                toDelete.push(key);
            }
        }

        for(let key of toDelete)
        {
            delete this.sheetsByServerAndUser[key];
        }

        if(Object.values(this.sheetsByServerAndUser).length)
        {
            this.timeout = setTimeout(()=>{this.checkCacheForTimeouts()},this.timeoutLife);
        }
    }

}

SheetCache.checkCacheForTimeouts();

export default SheetCache;