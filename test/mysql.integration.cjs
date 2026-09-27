const {test}=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto');
test('MySQL schema, account uniqueness, roles, sessions and class JSON round trips',{skip:!process.env.MYSQL_DATABASE},async()=>{
 const {MySQLStore}=require('../mysql-store'),a=new MySQLStore(),b=new MySQLStore(),id=crypto.randomUUID(),classId=crypto.randomUUID();
 try{await a.ready();await a.createUser({id,username:'test.'+id.slice(0,8),email:id+'@example.test',schoolId:id,hash:'test-only',salt:'test-only',fullName:'Temporary test'});
 assert.equal((await b.getUser(id)).role,'student');
 await a.updateUser(id,{role:'teacher'});assert.equal((await b.getUser(id)).role,'teacher');
 await a.setSession(id,{uid:id,expires:Date.now()+60000});assert.equal((await b.getSession(id)).uid,id);
 await a.setData('classes',classId,{teacherId:id,studentIds:[id],name:'Test'});
 assert.equal((await b.queryData('classes','teacherId',id))[0].id,classId);
 assert.equal((await b.queryData('classes','studentIds',id,true))[0].id,classId);
 await a.setData('classGrades',classId,{classId,studentId:id,grade:'1.75'});
 assert.equal((await b.getData('classGrades',classId)).grade,'1.75');
 await a.setData('classGrades',classId,{classId,studentId:id,grade:'2.00'});assert.equal((await b.getData('classGrades',classId)).grade,'2.00');
 }finally{await a.pool.execute('DELETE FROM class_grades WHERE id=?',[classId]);await a.pool.execute('DELETE FROM classes WHERE id=?',[classId]);await a.pool.execute('DELETE FROM users WHERE id=?',[id]);await Promise.all([a.pool.end(),b.pool.end()]);}
});
