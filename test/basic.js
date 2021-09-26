const crypto = require('crypto')
const test = require('tape')
const MultiSet = require('../')

function hashBytes(bytes) {
  const hash = crypto.createHash('sha256')
  hash.update(bytes)
  return hash.digest()
}

D1_BYTES = Buffer.from("982051FD1E4BA744BBBE680E1FEE14677BA1A3C3540BF7B1CDB606E857233E0E00000000010000000100F2052A0100000043410496B538E853519C726A2C91E61EC11600AE1390813A627C66FB8BE7947BE63C52DA7589379515D4E0A604F8141781E62294721166BF621E73A82CBF2342C858EEAC", "hex")

D2_BYTES = Buffer.from("D5FDCC541E25DE1C7A5ADDEDF24858B8BB665C9F36EF744EE42C316022C90F9B00000000020000000100F2052A010000004341047211A824F55B505228E4C3D5194C1FCFAA15A456ABDF37F9B9D97A4040AFC073DEE6C89064984F03385237D92167C13E236446B417AB79A0FCAE412AE3316B77AC", "hex")

D3_BYTES = Buffer.from("44F672226090D85DB9A9F2FBFE5F0F9609B387AF7BE5B7FBB7A1767C831C9E9900000000030000000100F2052A0100000043410494B9D3E76C5B1629ECF97FFF95D7A4BBDAC87CC26099ADA28066C6FF1EB9191223CD897194A08D0C2726C5747F1DB49E8CF90E75DC3E3550AE9B30086F3CD5AAAC", "hex")

const EMPTY_HASH = Buffer.alloc(32).toString('hex')

test('Empty', (t) => {
  const mset = MultiSet()

  t.equal(mset.getHash(), EMPTY_HASH)
  t.end()
})

test('Empty add', (t) => {
  const mset = MultiSet()
  const mset2 = MultiSet()

  mset.addSet(mset2)

  t.equal(mset.getHash(), EMPTY_HASH)
  t.end()
})

test('d1', (t) => {
  const mset = MultiSet()
  mset.addItem(hashBytes(D1_BYTES))

  const expected = "F883195933A687170C34FA1ADEC66FE2861889279FB12C03A3FB0CA68AD87893"
  t.equal(mset.getHash().toUpperCase(), expected)
  t.end()
})

test('d2', (t) => {
  const mset = MultiSet()
  mset.addItem(hashBytes(D2_BYTES))

  const expected = "EF85D123A15DA95D8AFF92623AD1E1C9FCDA3BAA801BD40BC567A83A6FDCF3E2"
  t.equal(mset.getHash().toUpperCase(), expected)
  t.end()
})

test('d3', (t) => {
  const mset = MultiSet()
  mset.addItem(hashBytes(D3_BYTES))

  const expected = "CFADF40FC017FAFF5E04CCC0A2FAE0FD616E4226DD7C03B1334A7A610468EDFF"
  t.equal(mset.getHash().toUpperCase(), expected)
  t.end()
})

test('d1 MS + d2 MS', (t) => {
  const mset1 = MultiSet()
  mset1.addItem(hashBytes(D1_BYTES))

  const mset2 = MultiSet()
  mset2.addItem(hashBytes(D2_BYTES))

  mset1.addSet(mset2)
  
  const expected = "FABAFD38D07370982A34547DAF5B57B8A4398696D6FD2294788ABDA07B1FAAAF"
  t.equal(mset1.getHash().toUpperCase(), expected)
  t.end()
})

test('d1 + d2', (t) => {
  const mset = MultiSet()
  mset.addItem(hashBytes(D1_BYTES))
  mset.addItem(hashBytes(D2_BYTES))

  const expected = "FABAFD38D07370982A34547DAF5B57B8A4398696D6FD2294788ABDA07B1FAAAF"
  t.equal(mset.getHash().toUpperCase(), expected)
  t.end()
})

test('d1 MS + d2 MS + d3 MS', (t) => {
  const mset1 = MultiSet()
  mset1.addItem(hashBytes(D1_BYTES))

  const mset2 = MultiSet()
  mset2.addItem(hashBytes(D2_BYTES))

  const mset3 = MultiSet()
  mset3.addItem(hashBytes(D3_BYTES))

  mset1.addSet(mset2)
  mset1.addSet(mset3)
  
  const expected = "1CBCCDA23D7CE8C5A8B008008E1738E6BF9CFFB1D5B86A92A4E62B5394A636E2"
  t.equal(mset1.getHash().toUpperCase(), expected)
  t.end()
})

test('d1 + d2 + d3', (t) => {
  const mset = MultiSet()
  mset.addItem(hashBytes(D1_BYTES))
  mset.addItem(hashBytes(D2_BYTES))
  mset.addItem(hashBytes(D3_BYTES))
  
  const expected = "1CBCCDA23D7CE8C5A8B008008E1738E6BF9CFFB1D5B86A92A4E62B5394A636E2"
  t.equal(mset.getHash().toUpperCase(), expected)
  t.end()
})

test('d1 + d2 + d3 - d3', (t) => {
  const mset = MultiSet()
  mset.addItem(hashBytes(D1_BYTES))
  mset.addItem(hashBytes(D2_BYTES))
  mset.addItem(hashBytes(D3_BYTES))
  mset.removeItem(hashBytes(D3_BYTES))
  
  const expected = "FABAFD38D07370982A34547DAF5B57B8A4398696D6FD2294788ABDA07B1FAAAF"
  t.equal(mset.getHash().toUpperCase(), expected)
  t.end()
})

// order doesn't matter
test('d2 + d1 + d3', (t) => {
  const mset = MultiSet()
  mset.addItem(hashBytes(D2_BYTES))
  mset.addItem(hashBytes(D1_BYTES))
  mset.addItem(hashBytes(D3_BYTES))
  
  const expected = "1CBCCDA23D7CE8C5A8B008008E1738E6BF9CFFB1D5B86A92A4E62B5394A636E2"
  t.equal(mset.getHash().toUpperCase(), expected)
  t.end()
})

