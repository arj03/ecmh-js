const bigIntBuffer = require('bigint-buffer')
const secp256k1 = require('noble-secp256k1')
const crypto = require('crypto')

function MultiSet() {
  const curve = secp256k1.CURVE

  function getBit(bytes, index) {
    const byteIndex = index >>> 3
    const b = bytes[byteIndex]
    
    const bitMask = 0x01 << (7 - (0x07 & index))
    return (b & bitMask) != 0x00
  }

  function convertToPoint(x, xBytes) {
    if (x >= curve.p) return null // not on curve
    
    const encodedCompressedPoint = Buffer.alloc(32 + 1)
    const yCoordinateIsEven = !getBit(xBytes, 0)
    const firstByte = yCoordinateIsEven ? COMPRESSED_FIRST_BYTE_0 : COMPRESSED_FIRST_BYTE_1
    encodedCompressedPoint.writeInt32LE(firstByte)
    xBytes.copy(encodedCompressedPoint, 1)
    
    try {
      return secp256k1.Point.fromHex(encodedCompressedPoint)
    } catch (ex) {
      // not on curve
      return null
    }
  }

  function getPoint(sha256Buffer) {
    for (let n = BigInt(0); true; ++n) {
      const hash = crypto.createHash('sha256')

      let buf = Buffer.alloc(8)
      buf.writeBigInt64LE(n)
      hash.update(buf)

      hash.update(sha256Buffer)

      const xBytes = hash.digest()

      //console.log("hash", n, xBytes.toString('hex'))

      const point = convertToPoint(bigIntBuffer.toBigIntLE(xBytes), xBytes)
      //console.log("ec point", n, point)
      if (point !== null) return point
    }
  }
    
  const COMPRESSED_FIRST_BYTE_0 = 0x02
  const COMPRESSED_FIRST_BYTE_1 = 0x03
  const EMPTY_HASH = Buffer.alloc(32)

  let self = {
    point: new secp256k1.Point(0, 0), // inf
    
    addPoint(point) {
      if (self.point.x === 0 && self.point.y === 0)
        self.point = point
      else if (point.x === 0 && point.y === 0)
        ; // noop
      else
        self.point = self.point.add(point)
    },
  
    addItem(sha256Buffer) {
      if (sha256Buffer === null || sha256Buffer === EMPTY_HASH) return

      self.addPoint(getPoint(sha256Buffer))
    },

    addSet(ms) {
      self.addPoint(ms.point)
    },

    removePoint(point) {
      if (point.x === self.point.x && point.y === self.point.y)
        self.point = new secp256k1.Point(0, 0)
      else
        self.point = self.point.subtract(point)
    },

    removeItem(sha256Buffer) {
      if (sha256Buffer === null || sha256Buffer === EMPTY_HASH) return

      self.removePoint(getPoint(sha256Buffer))
    },

    removeSet(ms) {
      self.removePoint(ms.point)
    },

    getHash() {
      if (self.point.x === 0 && self.point.y === 0) {
        return EMPTY_HASH.toString('hex')
      }

      const hash = crypto.createHash('sha256')

      const bufX = bigIntBuffer.toBufferBE(self.point.x, 32)
      hash.update(bufX)
      const bufY = bigIntBuffer.toBufferBE(self.point.y, 32)
      hash.update(bufY)

      return hash.digest('hex')
    }
  }

  return self
}

module.exports = MultiSet
