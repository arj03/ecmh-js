# ECMH

Implementation of the multiset hash using elliptic curves algorithm
described in [ecmh.wiki]. Uses the secp256k1 curve and SHA256 as
input.

## Usage

This shows one of the usages of this library, check out the tests for
more examples.

```js
const MultiSet = require('ecmh')
const crypto = require('crypto')

function hashBytes(bytes) {
  const hash = crypto.createHash('sha256')
  hash.update(bytes)
  return hash.digest()
}

D1 = hashBytes(Buffer.from("982051FD1E4BA744BBBE680E1FEE14677BA1A3C3540BF7B1CDB606E857233E0E00000000010000000100F2052A0100000043410496B538E853519C726A2C91E61EC11600AE1390813A627C66FB8BE7947BE63C52DA7589379515D4E0A604F8141781E62294721166BF621E73A82CBF2342C858EEAC", "hex"))

D2 = hashBytes(Buffer.from("D5FDCC541E25DE1C7A5ADDEDF24858B8BB665C9F36EF744EE42C316022C90F9B00000000020000000100F2052A010000004341047211A824F55B505228E4C3D5194C1FCFAA15A456ABDF37F9B9D97A4040AFC073DEE6C89064984F03385237D92167C13E236446B417AB79A0FCAE412AE3316B77AC", "hex"))

const mset = MultiSet()
mset.addItem(D1)
console.log("d1 hash", mset.getHash('base64'))
// => d1 hash +IMZWTOmhxcMNPoa3sZv4oYYiSefsSwDo/sMporYeJM=
mset.addItem(D2)

const mset2 = MultiSet()
mset2.addItem(D2)
mset2.addItem(D1)

console.log("generates the same hash:", mset.getHash('base64'), mset2.getHash('base64'))
// => generates the same hash: +rr9ONBzcJgqNFR9r1tXuKQ5hpbW/SKUeIq9oHsfqq8= +rr9ONBzcJgqNFR9r1tXuKQ5hpbW/SKUeIq9oHsfqq8=

mset.removeItem(D2)

console.log("d1 hash same after removal", mset.getHash('base64'))
// => d1 hash same after removal +IMZWTOmhxcMNPoa3sZv4oYYiSefsSwDo/sMporYeJM=
```


## Notes

C++ implementation: https://reviews.bitcoinabc.org/D1072#change-bEnKePuHRgCO

Java implementation: https://github.com/softwareverde/java-cryptography/blob/master/src/main/java/com/softwareverde/cryptography/secp256k1/EcMultiset.java

bitcoin utxo fast sync: https://bitcoincashresearch.org/t/chip-2021-07-utxo-fastsync/502

[ecmh.wiki]: https://github.com/tomasvdw/bips/blob/master/ecmh.mediawiki

