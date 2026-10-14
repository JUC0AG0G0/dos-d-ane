import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeHands,handTrackingInterval,freshHands} from '../src/models.js';

const hand=()=>Array.from({length:21},(_,i)=>({x:.2+i*.01,y:.3+i*.01,z:-i*.002,visibility:0,presence:0}));

test('hand landmarks retain all fingers and both handedness labels without visibility filtering',()=>{
 const points=hand();
 const output={landmarks:[points,hand()],handedness:[[{categoryName:'Left',score:.96}],[{categoryName:'Right',score:.91}]]};
 const result=normalizeHands(output);
 assert.equal(result.length,2);
 assert.equal(result[0].landmarks.length,21);
 assert.equal(result[0].handedness,'Left');
 assert.equal(result[1].handedness,'Right');
 assert.deepEqual(result[0].landmarks[12],{x:points[12].x,y:points[12].y,z:points[12].z});
 assert.notEqual(result[0].landmarks,points);
 assert.equal(result[0].score,.96);
});

test('missing and corrupt hands clear instead of inventing finger coordinates',()=>{
 const category=[[{categoryName:'Left',score:.9}]];
 const corrupt=hand();corrupt[12].x=NaN;
 assert.deepEqual(normalizeHands({landmarks:[corrupt],handedness:category}),[]);
 assert.deepEqual(normalizeHands({landmarks:[hand().slice(0,20)],handedness:category}),[]);
 assert.deepEqual(normalizeHands({landmarks:[hand()]}),[]);
 assert.deepEqual(normalizeHands({landmarks:[]}),[]);
 assert.deepEqual(normalizeHands(null),[]);
});

test('hand tracking stays responsive and stale fingers expire after 250 ms',()=>{
 assert.equal(handTrackingInterval(10),90);
 assert.equal(handTrackingInterval(90),108);
 assert.equal(handTrackingInterval(500),120);
 assert.equal(handTrackingInterval(NaN),90);
 const hands=[{landmarks:hand(),handedness:'Left',score:.9}];
 assert.equal(freshHands({hands,capturedAt:100},350),hands);
 assert.deepEqual(freshHands({hands,capturedAt:100},351),[]);
 assert.deepEqual(freshHands(null,101),[]);
});
