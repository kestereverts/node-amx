/*
 * Copyright Kester Everts 2012
 */

////typedef struct tagAMX_HEADER {
//  00 int32_t size PACKED; /* size of the "file" */
//  04 uint16_t magic PACKED; /* signature */
//  06 char file_version; /* file format version */
//  07 char amx_version; /* required version of the AMX */
//  08 int16_t flags PACKED;
//  10 int16_t defsize PACKED; /* size of a definition record */
//  12 int32_t cod PACKED; /* initial value of COD - code block */
//  16 int32_t dat PACKED; /* initial value of DAT - data block */
//  20 int32_t hea PACKED; /* initial value of HEA - start of the heap */
//  24 int32_t stp PACKED; /* initial value of STP - stack top */
//  28 int32_t cip PACKED; /* initial value of CIP - the instruction pointer */
//  32 int32_t publics PACKED; /* offset to the "public functions" table */
//  36 int32_t natives PACKED; /* offset to the "native functions" table */
//  40 int32_t libraries PACKED; /* offset to the table of libraries */
//  44 int32_t pubvars PACKED; /* the "public variables" table */
//  48 int32_t tags PACKED; /* the "public tagnames" table */
//  52 int32_t nametable PACKED; /* name table */
//} PACKED AMX_HEADER;

function AMXHeader(buffer) {
    if(!Buffer.isBuffer(buffer)) {
        buffer = new Buffer(AMXHeader.BYTE_SIZE);
    }
    if(buffer.length < AMXHeader.BYTE_SIZE) {
        throw new Error("Buffer size is less than AMX header size");
    }
    this.buffer = buffer;
}

AMXHeader.BYTE_SIZE = 56;

Object.defineProperty(AMXHeader.prototype, "size", {
    get: function() {
        return this.buffer.readInt32LE(0);
    },
    set: function(v) {
        this.buffer.writeInt32LE(v, 0);
    },
    enumerable: true, configurable: false
});

Object.defineProperty(AMXHeader.prototype, "magic", {
    get: function() {
        return this.buffer.readUInt16LE(4);
    },
    set: function(v) {
        this.buffer.writeUInt16LE(v, 4);
    },
    enumerable: true, configurable: false
});

Object.defineProperty(AMXHeader.prototype, "file_version", {
    get: function() {
        return this.buffer.readInt8(6);
    },
    set: function(v) {
        this.buffer.writeInt8(v, 6);
    },
    enumerable: true, configurable: false
});

Object.defineProperty(AMXHeader.prototype, "amx_version", {
    get: function() {
        return this.buffer.readInt8(7);
    },
    set: function(v) {
        this.buffer.writeInt8(v, 7);
    },
    enumerable: true, configurable: false
});

Object.defineProperty(AMXHeader.prototype, "flags", {
    get: function() {
        return this.buffer.readInt16LE(8);
    },
    set: function(v) {
        this.buffer.writeInt16LE(v, 8);
    },
    enumerable: true, configurable: false
});

Object.defineProperty(AMXHeader.prototype, "defsize", {
    get: function() {
        return this.buffer.readInt16LE(10);
    },
    set: function(v) {
        this.buffer.writeInt16LE(v, 10);
    },
    enumerable: true, configurable: false
});

Object.defineProperty(AMXHeader.prototype, "cod", {
    get: function() {
        return this.buffer.readInt32LE(12);
    },
    set: function(v) {
        this.buffer.writeInt32LE(v, 12);
    },
    enumerable: true, configurable: false
});

Object.defineProperty(AMXHeader.prototype, "dat", {
    get: function() {
        return this.buffer.readInt32LE(16);
    },
    set: function(v) {
        this.buffer.writeInt32LE(v, 16);
    },
    enumerable: true, configurable: false
});

Object.defineProperty(AMXHeader.prototype, "hea", {
    get: function() {
        return this.buffer.readInt32LE(20);
    },
    set: function(v) {
        this.buffer.writeInt32LE(v, 20);
    },
    enumerable: true, configurable: false
});

Object.defineProperty(AMXHeader.prototype, "stp", {
    get: function() {
        return this.buffer.readInt32LE(24);
    },
    set: function(v) {
        this.buffer.writeInt32LE(v, 24);
    },
    enumerable: true, configurable: false
});

Object.defineProperty(AMXHeader.prototype, "cip", {
    get: function() {
        return this.buffer.readInt32LE(28);
    },
    set: function(v) {
        this.buffer.writeInt32LE(v, 28);
    },
    enumerable: true, configurable: false
});

Object.defineProperty(AMXHeader.prototype, "publics", {
    get: function() {
        return this.buffer.readInt32LE(32);
    },
    set: function(v) {
        this.buffer.writeInt32LE(v, 32);
    },
    enumerable: true, configurable: false
});

Object.defineProperty(AMXHeader.prototype, "natives", {
    get: function() {
        return this.buffer.readInt32LE(36);
    },
    set: function(v) {
        this.buffer.writeInt32LE(v, 36);
    },
    enumerable: true, configurable: false
});

Object.defineProperty(AMXHeader.prototype, "libraries", {
    get: function() {
        return this.buffer.readInt32LE(40);
    },
    set: function(v) {
        this.buffer.writeInt32LE(v, 40);
    },
    enumerable: true, configurable: false
});

Object.defineProperty(AMXHeader.prototype, "pubvars", {
    get: function() {
        return this.buffer.readInt32LE(44);
    },
    set: function(v) {
        this.buffer.writeInt32LE(v, 44);
    },
    enumerable: true, configurable: false
});

Object.defineProperty(AMXHeader.prototype, "tags", {
    get: function() {
        return this.buffer.readInt32LE(0);
    },
    set: function(v) {
        this.buffer.writeInt32LE(v, 0);
    },
    enumerable: true, configurable: false
});

Object.defineProperty(AMXHeader.prototype, "nametable", {
    get: function() {
        return this.buffer.readInt32LE(52);
    },
    set: function(v) {
        this.buffer.writeInt32LE(v, 52);
    },
    enumerable: true, configurable: false
});

exports.AMXHeader = AMXHeader;