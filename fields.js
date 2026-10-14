// Calculator fields: [id, label, type, unit, min, max, group]. Shared by the page and (via gen_schema.mjs) the worker schema.
const FIELDS=[
 ['age','Current age','integer','years',18,90,'core'],
 ['inv','Invested assets (retirement + brokerage accounts)','number','USD',0,1e9,'core'],
 ['spend','Annual spending','number','USD/yr',0,5e6,'core'],
 ['contrib','Yearly contributions to investments','number','USD/yr',0,5e6,'core'],
 ['ret','Retire at (age)','integer','years',19,100,'core'],
 ['cash','Cash & savings','number','USD',0,1e8,'more'],['inccash','Count cash as invested','boolean'],
 ['inc','Take-home income','number','USD/yr',0,1e7,'more'],
 ['r','Real return before retirement','number','%',-5,15,'asm'],['rp','Real return after retirement','number','%',-5,15,'asm'],
 ['wr','Withdrawal rate','number','%',0.5,10,'asm'],['tax','Tax on withdrawals','number','%',0,99,'asm'],
 ['mtgon','I have a mortgage','boolean'],['mp','Mortgage payment (inside annual spending)','number','USD/month',0,1e5,'mtg'],['my','Years left on mortgage','integer','years',0,40,'mtg'],
 ['sson','Include Social Security','boolean'],['ssm','Estimated Social Security benefit at claiming age (today\'s $)','number','USD/month',0,1e4,'ss'],['ssa','Social Security claiming age','integer','years',62,70,'ss'],
 ['pt','Barista FIRE part-time income','number','USD/yr',0,1e6,'tier'],['pte','Barista FIRE: work part-time until age','integer','years',19,100,'tier'],
 ['leanS','Lean FIRE spending','number','USD/yr',0,1e6,'tier'],['chubS','Chubby FIRE spending','number','USD/yr',0,5e6,'tier'],['fatS','Fat FIRE spending','number','USD/yr',0,5e6,'tier']];
// Used when a field is blank. These are modelling assumptions, not anyone's data.
const ASSUME={r:5,rp:4,wr:4,tax:0,ssa:67,pt:30000,pte:60,leanS:40000,chubS:100000,fatS:150000};
const REQUIRED=['age','inv','spend','contrib','ret'];
if(typeof module!=='undefined')module.exports={FIELDS,ASSUME,REQUIRED};
