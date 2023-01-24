# l5r-bot
## An L5R(4e) discord bot system for managing characters and rolls.

While this system was originally written for the City of Lies game, it is (in its entirety) open source. The system, in abstract, takes a specific format [google sheet](https://docs.google.com/spreadsheets/d/1OEsDJ4jm8MWiZ_vpgwivi6tBSo5UwCeGi_Yy8flm8gg/edit?usp=sharing)'s published xlsx file and turns it into a javascript object.

* When you are happy with your character sheet, press File -> Share -> Publish to Web.
* Then set the output to xlsx and copy the link that it generates for you.
* In the Discord server where l5r-bot is running, run the command `/fetch-sheet` and provide the command the URL from the above step. The command should respond with 'Your sheet has been updated'
* Therafter you can run `/roll <name of ring, trait, skill, or spell>` and the dice roller will calculate and roll your pool for you.
* You can also use `/roll 4k3` (for example) and it will roll without having your sheet.

```
Roll Syntax

/roll <nKm or a ring, trait, skill, or spell>[ !no10s|!nr][ !rv<reroll value>][ !e][ +nKm][ +<amount>][ vs:|tn:<target number>]

Fields in <> are mandatory, fields in [] are optional.

Optional fields:
!no10s or !nr: do not reroll 10s.
!rv<reroll value>: Reroll on <reroll value> instead of 10.
!e: reroll 1s once each for emphases
+nKm: add +nKm to the rolled value (mostly useful in rolling off your sheet rather than raw nKm but can be used in either)
+<amount> adds <amount> to the final result
vs:<TN> or tn:<TN> rolls against a TN Of <TN>
```