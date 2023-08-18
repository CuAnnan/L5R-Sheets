class CheckInHandler
{
    static async checkTargetIn(target)
    {
        console.log(target.guild.roles.cache);
        const checkedInRole = target.guild.roles.cache.find(r=>r.name==='checked in');

        await target.roles.add(checkedInRole);
    }
}

export default CheckInHandler;