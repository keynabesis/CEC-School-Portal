const {test}=require('node:test'),assert=require('node:assert/strict');const {DemoStore}=require('../store');const {reason}=require('../subject-enrollment');
const base={name:'Subject',code:'IT 1',term:'2026-1',capacity:1,enrollmentOpen:true,teacherId:'t',studentIds:[],meetings:[{day:1,start:540,end:600}]};
test('last seat is allocated once even with concurrent requests',async()=>{const store=new DemoStore();await store.setData('classes','a',base);const results=await Promise.allSettled([store.enrollStudent('s1','a'),store.enrollStudent('s2','a')]);assert.equal(results.filter(r=>r.status==='fulfilled').length,1);assert.equal((await store.getData('classes','a')).studentIds.length,1);});
test('duplicate subject, same class, full, closed, missing schedule and overlapping timetable',()=>{
const existing={...base,id:'a',studentIds:['s']};
assert.match(reason(existing,[existing],'s'),/already enrolled/);
assert.match(reason({...base,studentIds:['other']},[],'s'),/full/);
assert.match(reason({...base,enrollmentOpen:false},[],'s'),/closed/);
assert.match(reason({...base,meetings:[]},[],'s'),/not ready/);
assert.match(reason({...base,id:'b'},[existing],'s'),/already enrolled in this subject/);
assert.match(reason({...base,code:'IT 2'},[existing],'s'),/overlaps/);
assert.equal(reason({...base,code:'IT 2',meetings:[{day:1,start:600,end:660}]},[existing],'s'),'');
assert.equal(reason({...base,term:'2026-2'},[existing],'s'),'');
});
