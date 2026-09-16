import test from 'node:test'
import assert from 'node:assert/strict'
import { devices, deviceGeometry } from '../src/data/devices.js'
test('Every device fits narrow and wide preview panels in both orientations',()=>{
  for(const device of devices)for(const landscape of [false,true])for(const [width,height] of [[260,450],[500,600],[1200,1000]]){
    const g=deviceGeometry(device,landscape,width,height)
    assert.ok(g.frameWidth*g.scale<=width)
    assert.ok(g.frameHeight*g.scale<=height)
    assert.equal(g.width,landscape?device.height:device.width)
    assert.equal(g.height,landscape?device.width:device.height)
    assert.equal(g.frameWidth-14,g.width)
    assert.equal(g.frameHeight-65,g.height)
  }
})
