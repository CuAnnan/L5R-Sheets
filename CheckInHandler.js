class CheckInHandler
{
    async static checkTargetIn(target)
    {
        const checkedInRole = target.guild.roles.cache.find(r=>r.name==='checked in');

        await target.roles.add(checkedInRole);
    }
}

export default CheckInHandler;