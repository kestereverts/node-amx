/*
 * Copyright Kester Everts 2012
 */

var AMXHeader = require("./amxheader").AMXHeader;
var fs = require("fs");
var assert = require("assert");

function AMX() {
    /*
     * @type AMXHeader
     */
    this.base = null;
    this.code = null;
    this.codesize = 0;
    this.hlw = 0;
    this.stp = 0;
    this.hea = 0;
    this.stk = 0;
    this.cip = 0;
    this.frm = 0;
    this.alt = 0;
    this.reset_stk = 0;
    this.reset_hea = 0;
    this.paramcount = 0;
    this.callback = AMX.prototype.callback;
    this.debug = 0;
    this.flags = 0;
    this.error = 0;
    this.pri = 0;
    this.sysreq_d = 0;
}

const AMX_COMPACTMARGIN = 64;
const AMX_CELL_SIZE = 4;
const AMX_FLAG_COMPACT = 0x04;
const AMX_EXEC_MAIN = -1;
const AMX_EXEC_CONT = -2;
const sEXPMAX = 19;

const OP_NONE = 0;
const OP_LOAD_PRI = 1;
const OP_LOAD_ALT = 2;
const OP_LOAD_S_PRI = 3;
const OP_LOAD_S_ALT = 4;
const OP_LREF_PRI = 5;
const OP_LREF_ALT = 6;
const OP_LREF_S_PRI = 7;
const OP_LREF_S_ALT = 8;
const OP_LOAD_I = 9;
const OP_LODB_I = 10;
const OP_CONST_PRI = 11;
const OP_CONST_ALT = 12;
const OP_ADDR_PRI = 13;
const OP_ADDR_ALT = 14;
const OP_STOR_PRI = 15;
const OP_STOR_ALT = 16;
const OP_STOR_S_PRI = 17;
const OP_STOR_S_ALT = 18;
const OP_SREF_PRI = 19;
const OP_SREF_ALT = 20;
const OP_SREF_S_PRI = 21;
const OP_SREF_S_ALT = 22;
const OP_STOR_I = 23;
const OP_STRB_I = 24;
const OP_LIDX = 25;
const OP_LIDX_B = 26;
const OP_IDXADDR = 27;
const OP_IDXADDR_B = 28;
const OP_ALIGN_PRI = 29;
const OP_ALIGN_ALT = 30;
const OP_LCTRL = 31;
const OP_SCTRL = 32;
const OP_MOVE_PRI = 33;
const OP_MOVE_ALT = 34;
const OP_XCHG = 35;
const OP_PUSH_PRI = 36;
const OP_PUSH_ALT = 37;
const OP_PUSH_R = 38;
const OP_PUSH_C = 39;
const OP_PUSH = 40;
const OP_PUSH_S = 41;
const OP_POP_PRI = 42;
const OP_POP_ALT = 43;
const OP_STACK = 44;
const OP_HEAP = 45;
const OP_PROC = 46;
const OP_RET = 47;
const OP_RETN = 48;
const OP_CALL = 49;
const OP_CALL_PRI = 50;
const OP_JUMP = 51;
const OP_JREL = 52;
const OP_JZER = 53;
const OP_JNZ = 54;
const OP_JEQ = 55;
const OP_JNEQ = 56;
const OP_JLESS = 57;
const OP_JLEQ = 58;
const OP_JGRTR = 59;
const OP_JGEQ = 60;
const OP_JSLESS = 61;
const OP_JSLEQ = 62;
const OP_JSGRTR = 63;
const OP_JSGEQ = 64;
const OP_SHL = 65;
const OP_SHR = 66;
const OP_SSHR = 67;
const OP_SHL_C_PRI = 68;
const OP_SHL_C_ALT = 69;
const OP_SHR_C_PRI = 70;
const OP_SHR_C_ALT = 71;
const OP_SMUL = 72;
const OP_SDIV = 73;
const OP_SDIV_ALT = 74;
const OP_UMUL = 75;
const OP_UDIV = 76;
const OP_UDIV_ALT = 77;
const OP_ADD = 78;
const OP_SUB = 79;
const OP_SUB_ALT = 80;
const OP_AND = 81;
const OP_OR = 82;
const OP_XOR = 83;
const OP_NOT = 84;
const OP_NEG = 85;
const OP_INVERT = 86;
const OP_ADD_C = 87;
const OP_SMUL_C = 88;
const OP_ZERO_PRI = 89;
const OP_ZERO_ALT = 90;
const OP_ZERO = 91;
const OP_ZERO_S = 92;
const OP_SIGN_PRI = 93;
const OP_SIGN_ALT = 94;
const OP_EQ = 95;
const OP_NEQ = 96;
const OP_LESS = 97;
const OP_LEQ = 98;
const OP_GRTR = 99;
const OP_GEQ = 100;
const OP_SLESS = 101;
const OP_SLEQ = 102;
const OP_SGRTR = 103;
const OP_SGEQ = 104;
const OP_EQ_C_PRI = 105;
const OP_EQ_C_ALT = 106;
const OP_INC_PRI = 107;
const OP_INC_ALT = 108;
const OP_INC = 109;
const OP_INC_S = 110;
const OP_INC_I = 111;
const OP_DEC_PRI = 112;
const OP_DEC_ALT = 113;
const OP_DEC = 114;
const OP_DEC_S = 115;
const OP_DEC_I = 116;
const OP_MOVS = 117;
const OP_CMPS = 118;
const OP_FILL = 119;
const OP_HALT = 120;
const OP_BOUNDS = 121;
const OP_SYSREQ_PRI = 122;
const OP_SYSREQ_C = 123;
const OP_FILE = 124;
const OP_LINE = 125;
const OP_SYMBOL = 126;
const OP_SRANGE = 127;
const OP_JUMP_PRI = 128;
const OP_SWITCH = 129;
const OP_CASETBL = 130;
const OP_SWAP_PRI = 131;
const OP_SWAP_ALT = 132;
const OP_PUSHADDR = 133;
const OP_NOP = 134;
const OP_SYSREQ_D = 135;
const OP_SYMTAG = 136;
const OP_BREAK = 137;
const OP_NUM_OPCODES = 138;

AMX.OPCODES = [ 'OP_NONE',
    'OP_LOAD_PRI',
    'OP_LOAD_ALT',
    'OP_LOAD_S_PRI',
    'OP_LOAD_S_ALT',
    'OP_LREF_PRI',
    'OP_LREF_ALT',
    'OP_LREF_S_PRI',
    'OP_LREF_S_ALT',
    'OP_LOAD_I',
    'OP_LODB_I',
    'OP_CONST_PRI',
    'OP_CONST_ALT',
    'OP_ADDR_PRI',
    'OP_ADDR_ALT',
    'OP_STOR_PRI',
    'OP_STOR_ALT',
    'OP_STOR_S_PRI',
    'OP_STOR_S_ALT',
    'OP_SREF_PRI',
    'OP_SREF_ALT',
    'OP_SREF_S_PRI',
    'OP_SREF_S_ALT',
    'OP_STOR_I',
    'OP_STRB_I',
    'OP_LIDX',
    'OP_LIDX_B',
    'OP_IDXADDR',
    'OP_IDXADDR_B',
    'OP_ALIGN_PRI',
    'OP_ALIGN_ALT',
    'OP_LCTRL',
    'OP_SCTRL',
    'OP_MOVE_PRI',
    'OP_MOVE_ALT',
    'OP_XCHG',
    'OP_PUSH_PRI',
    'OP_PUSH_ALT',
    'OP_PUSH_R',
    'OP_PUSH_C',
    'OP_PUSH',
    'OP_PUSH_S',
    'OP_POP_PRI',
    'OP_POP_ALT',
    'OP_STACK',
    'OP_HEAP',
    'OP_PROC',
    'OP_RET',
    'OP_RETN',
    'OP_CALL',
    'OP_CALL_PRI',
    'OP_JUMP',
    'OP_JREL',
    'OP_JZER',
    'OP_JNZ',
    'OP_JEQ',
    'OP_JNEQ',
    'OP_JLESS',
    'OP_JLEQ',
    'OP_JGRTR',
    'OP_JGEQ',
    'OP_JSLESS',
    'OP_JSLEQ',
    'OP_JSGRTR',
    'OP_JSGEQ',
    'OP_SHL',
    'OP_SHR',
    'OP_SSHR',
    'OP_SHL_C_PRI',
    'OP_SHL_C_ALT',
    'OP_SHR_C_PRI',
    'OP_SHR_C_ALT',
    'OP_SMUL',
    'OP_SDIV',
    'OP_SDIV_ALT',
    'OP_UMUL',
    'OP_UDIV',
    'OP_UDIV_ALT',
    'OP_ADD',
    'OP_SUB',
    'OP_SUB_ALT',
    'OP_AND',
    'OP_OR',
    'OP_XOR',
    'OP_NOT',
    'OP_NEG',
    'OP_INVERT',
    'OP_ADD_C',
    'OP_SMUL_C',
    'OP_ZERO_PRI',
    'OP_ZERO_ALT',
    'OP_ZERO',
    'OP_ZERO_S',
    'OP_SIGN_PRI',
    'OP_SIGN_ALT',
    'OP_EQ',
    'OP_NEQ',
    'OP_LESS',
    'OP_LEQ',
    'OP_GRTR',
    'OP_GEQ',
    'OP_SLESS',
    'OP_SLEQ',
    'OP_SGRTR',
    'OP_SGEQ',
    'OP_EQ_C_PRI',
    'OP_EQ_C_ALT',
    'OP_INC_PRI',
    'OP_INC_ALT',
    'OP_INC',
    'OP_INC_S',
    'OP_INC_I',
    'OP_DEC_PRI',
    'OP_DEC_ALT',
    'OP_DEC',
    'OP_DEC_S',
    'OP_DEC_I',
    'OP_MOVS',
    'OP_CMPS',
    'OP_FILL',
    'OP_HALT',
    'OP_BOUNDS',
    'OP_SYSREQ_PRI',
    'OP_SYSREQ_C',
    'OP_FILE',
    'OP_LINE',
    'OP_SYMBOL',
    'OP_SRANGE',
    'OP_JUMP_PRI',
    'OP_SWITCH',
    'OP_CASETBL',
    'OP_SWAP_PRI',
    'OP_SWAP_ALT',
    'OP_PUSHADDR',
    'OP_NOP',
    'OP_SYSREQ_D',
    'OP_SYMTAG',
    'OP_BREAK',
    'OP_NUM_OPCODES' ];

AMX.MAGIC = 0xf1e0; // we always assume a 32-bit cell size
AMX.CUR_FILE_VERSION = 10;
AMX.MIN_FILE_VERSION = 6;
AMX.MIN_AMX_VERSION = 8;
AMX.COMPACTMARGIN = AMX_COMPACTMARGIN;

AMX.init = function(buffer) {
    var amx = new AMX();
    amx.buffer = buffer;
    var hdr = new AMXHeader(buffer);
    if(hdr.magic != AMX.MAGIC) {
        throw new AMX.Error("AMX_ERR_FORMAT", "Magic constant does not match.");
    }
    if(hdr.file_version < AMX.MIN_FILE_VERSION || hdr.amx_version > AMX.CUR_FILE_VERSION) {
        throw new AMX.Error("AMX_ERR_VERSION", "Version not supported.");
    }
    if (hdr.stp <=0) {
        throw new AMX.Error("AMX_ERR_FORMAT", "hdr.stp <= 0");
    }
    
    
    assert((hdr.flags & AMX_FLAG_COMPACT) !=0 || hdr.hea == hdr.size);
    if ((hdr.flags & AMX_FLAG_COMPACT) !=0 ) {
        expand(buffer.slice(hdr.cod), hdr.size - hdr.cod, hdr.hea - hdr.cod);
    }
    
    amx.base = hdr;
    
    amx.hlw = hdr.hea - hdr.dat;
    amx.stp = hdr.stp - hdr.dat - AMX_CELL_SIZE;
    amx.hea = amx.hlw;
    amx.stk = amx.stp;
    
    amx.code = buffer.slice(hdr.cod);
    amx.codesize = hdr.dat - hdr.cod;
    
    var data = buffer.slice(hdr.dat);
    
    data.writeInt32LE(0, hdr.stp - hdr.dat - AMX_CELL_SIZE);
    
    return amx;
}

AMX.prototype.exec = function(index) {
    var hdr;
    var code, data;
    var pri, alt, stk, frm, hea;
    var reset_stk, reset_hea, cip;
    var codesize;
    var i;
    var op;
    var offs;
    var num;
    
    if(typeof this.callback != "function") {
        throw AMX.Error("AMX_ERR_CALLBACK", "");
    }
    
    hdr = this.base;
    assert(hdr.magic == AMX.MAGIC);
    codesize = this.codesize;
    code = this.code;
    data = this.buffer.slice(hdr.dat);
    hea = this.hea;
    stk = this.stk;
    reset_stk = stk;
    reset_hea = hea;
    alt = frm = pri = 0;
    
    
    this.error = new AMX.Error("AMX_ERR_NONE", "");
    
    if(index == AMX_EXEC_MAIN) {
        if(hdr.cip < 0) {
            throw new AMX.Error("AMX_ERR_INDEX", "");
        }
        cip = this.cip;
    } else if(index == -2) {
        frm = this.frm;
        stk = this.stk;
        hea = this.hea;
        pri = this.pri;
        alt = this.alt;
        reset_stk = this.reset_stk;
        reset_hea = this.reset_hea;
        cip = this.cip;
    } else if(index < 0) {
        throw new AMX.Error("AMX_ERR_INDEX", "index < 0");
    } else {
        if(index >= (hdr.natives - hdr.publics) / hdr.defsize) {
            throw new AMX.Error("AMX_ERR_INDEX", "");
        }
        
        cip = new FuncStub(this.buffer.slice(hdr.publics + index * hdr.defsize)).address;
        
        console.log("Cip at " + cip);
    }
    
    if(index != AMX_EXEC_CONT) {
        reset_stk += this.paramcount * AMX_CELL_SIZE;
        PUSH(this.paramcount * AMX_CELL_SIZE);
        this.paramcount = 0;
        PUSH(0);
    }
    
    function PUSH(v) {
        stk -= AMX_CELL_SIZE;
        data.writeInt32LE(v, stk);
    }
    
    function POP() {
        var ret = data.readInt32LE(stk);
        stk += AMX_CELL_SIZE;
        return ret;
    }
    
    function GETPARAM() {
        console.log("Param: " + code.readInt32LE(cip));
        var param = code.readInt32LE(cip);
        cip += AMX_CELL_SIZE;
        return param;
    }
    
    function CHKMARGIN() {
        if(hea + 16 * AMX_CELL_SIZE > stk) {
            throw new AMX.Error("AMX_ERR_STACKERR");
        }
    }
    
    function CHKSTACK() {
        if(stk > this.stp) {
            throw new AMX.Error("AMX_ERR_STACKLOW");
        }
    }
    
    while(true) {
        op = code.readInt32LE(cip);
        cip += AMX_CELL_SIZE;
        console.log("Instruction: " + AMX.OPCODES[op]);
        switch(op) {
            case OP_NOP:
                break;
            case OP_LOAD_PRI:
                pri = data.readInt32LE(GETPARAM());
                break;
            case OP_LOAD_ALT:
                alt = data.readInt32LE(GETPARAM());
                break;
            case OP_LOAD_S_PRI:
                pri = data.readInt32LE(frm + GETPARAM());
                break;
            case OP_LOAD_S_ALT:
                alt = data.readInt32LE(frm + GETPARAM());
                break;
            case OP_LREF_PRI:
                pri = data.readInt32LE(data.readInt32LE(GETPARAM()));
                break;
            case OP_LREF_ALT:
                alt = data.readInt32LE(data.readInt32LE(GETPARAM()));
                break;
            case OP_LREF_S_PRI:
                pri = data.readInt32LE(data.readInt32LE(frm + GETPARAM()));
                break;
            case OP_LREF_S_ALT:
                alt = data.readInt32LE(data.readInt32LE(frm + GETPARAM()));
                break;
            case OP_LOAD_I:
                if (pri >= hea && pri < stk || pri >= this.stp) {
                    throw new AMX.Error("AMX_ERR_MEMACCESS");
                }
                pri = data.readInt32LE(pri);
                break;
            case OP_LODB_I:
                if (pri >= hea && pri < stk || pri >= this.stp) {
                    throw new AMX.Error("AMX_ERR_MEMACCESS");
                }
                switch(GETPARAM()) {
                    case 1:
                        pri = data[pri];
                        break;
                    case 2:
                        pri = data.readUInt16LE(pri);
                        break;
                    case 4:
                        pri = data.readInt32LE(pri);
                        break;
                }
                break;
            case OP_CONST_PRI:
                pri = GETPARAM();
                break;
            case OP_CONST_ALT:
                alt = GETPARAM();
                break;
            case OP_ADDR_PRI:
                pri = GETPARAM() + frm;
                break;
            case OP_ADDR_ALT:
                alt = GETPARAM() + frm;
                break;
            case OP_STOR_PRI:
                data.writeInt32LE(pri, GETPARAM());
                break;
            case OP_STOR_ALT:
                data.writeInt32LE(alt, GETPARAM());
                break;
            case OP_STOR_S_PRI:
                data.writeInt32LE(pri, frm + GETPARAM());
                break;
            case OP_STOR_S_ALT:
                data.writeInt32LE(alt, frm + GETPARAM());
                break;
            case OP_SREF_PRI:
                data.writeInt32LE(pri, data.readInt32LE(GETPARAM()));
                break;
            case OP_SREF_ALT:
                data.writeInt32LE(alt, data.readInt32LE(GETPARAM()));
                break;
            case OP_SREF_S_PRI:
                data.writeInt32LE(pri, data.readInt32LE(frm + GETPARAM()));
                break;
            case OP_SREF_S_ALT:
                data.writeInt32LE(alt, data.readInt32LE(frm + GETPARAM()));
                break;
            case OP_STOR_I:
                if(alt >= hea && alt < stk || alt >= this.stp) {
                    throw new AMX.Error("AMX_ERR_MEMACCESS");
                }
                data.writeInt32LE(pri, alt);
                break;
            case OP_STRB_I:
                if(alt >= hea && alt < stk || alt >= this.stp) {
                    throw new AMX.Error("AMX_ERR_MEMACCESS");
                }
                switch(GETPARAM()) {
                    case 1:
                        data[alt] = pri & 0xFF;
                        break;
                    case 2:
                        data.writeUInt16LE(pri & 0xFFFF, alt);
                        break;
                    case 4:
                        data.writeInt32LE(pri, alt);
                        break;
                }
                break;
            case OP_LIDX:
                offs = pri * AMX_CELL_SIZE + alt;
                if(offs >= hea && offs < stk || offs >= this.stp) {
                    throw new AMX.Error("AMX_ERR_MEMACCESS");
                }
                pri = data.readInt32LE(offs);
                break;
            case OP_LIDX_B:
                offs = (pri << GETPARAM()) + alt;
                if(offs >= hea && offs < stk || offs >= this.stp) {
                    throw new AMX.Error("AMX_ERR_MEMACCESS");
                }
                pri = data.readInt32LE(offs);
                break;
            case OP_IDXADDR:
                pri = pri * AMX_CELL_SIZE + alt;
                break;
            case OP_IDXADDR_B:
                pri = (pri << GETMARAP()) + alt;
                break;
            case OP_ALIGN_PRI:
                offs = GETPARAM();
                if(offs < AMX_CELL_SIZE) {
                    pri ^= AMX_CELL_SIZE - offs;
                }
                break;
            case OP_ALIGN_ALT:
                offs = GETPARAM()
                if(offs < AMX_CELL_SIZE) {
                    alt ^= AMX_CELL_SIZE - offs;
                }
                break;
            case OP_LCTRL:
                switch(GETPARAM()) {
                    case 0:
                        pri = hdr.cod;
                        break;
                    case 1:
                        pri = hdr.dat;
                        break;
                    case 2:
                        pri = hea;
                        break;
                    case 3:
                        pri = this.stp;
                        break;
                    case 4:
                        pri = stk;
                        break;
                    case 5:
                        pri = frm;
                        break;
                    case 6:
                        pri = cip;
                        break;
                }
                break;
            case OP_SCTRL:
                switch(GETPARAM()) {
                    case 0:
                    case 1:
                        break;
                    case 2:
                        hea = pri;
                        break;
                    case 3:
                        break;
                    case 4:
                        stk = pri;
                        break;
                    case 5:
                        frm = pri;
                    case 6:
                        cip = pri;
                        break;
                }
                break;
            case OP_MOVE_PRI:
                pri = alt;
                break;
            case OP_MOVE_ALT:
                alt = pri;
                break;
            case OP_XCHG:
                offs = pri;
                pri = alt;
                alt = offs;
                break;
            case OP_PUSH_PRI:
                PUSH(pri);
                break;
            case OP_PUSH_ALT:
                PUSH(alt);
                break;
            case OP_PUSH_C:
                PUSH(GETPARAM());
                break;
            case OP_PUSH_R:
                offs = GETPARAM();
                while(offs--) {
                    PUSH(pri);
                }
                break;
            case OP_PUSH:
                PUSH(data.readInt32LE(GETPARAM()));
                break;
            case OP_PUSH_S:
                PUSH(data.readInt32LE(frm + GETPARAM()));
                break;
            case OP_POP_PRI:
                pri = POP();
                break;
            case OP_POP_ALT:
                alt = POP();
                break;
            case OP_STACK:
                alt = stk;
                stk += GETPARAM();
                CHKMARGIN();
                CHKSTACK();
                break;
            case OP_HEAP:
                alt = hea;
                hea += GETPARAM();
                CHKMARGIN();
                CHKSTACK();
                break;
            case OP_PROC:
                PUSH(frm);
                frm = stk;
                CHKMARGIN();
                break;
            case OP_RET:
                frm = POP();
                offs = POP();
                if(offs >= codesize) {
                    throw new AMX.Error("AMX_ERR_MEMACCESS", "offs >= codesize")
                }
                cip = offs;
                break;
            case OP_RETN:
                frm = POP();
                offs = POP();
                if(offs >= codesize) {
                    throw new AMX.Error("AMX_ERR_MEMACCESS", "offs >= codesize")
                }
                cip = offs;
                stk += data.readInt32LE(stk) + AMX_CELL_SIZE;
                this.stk = stk;
                break;
            case OP_CALL:
                PUSH(cip + AMX_CELL_SIZE);
                cip = code.readInt32LE(cip);
                break;
            case OP_CALL_PRI:
                PUSH(cip);
                cip = pri;
            case OP_JUMP:
                cip = code.readInt32LE(cip);
                break;
            case OP_JREL:
                cip += code.readInt32LE(cip) + AMX_CELL_SIZE;
                break;
            case OP_JZER:
                if(pri == 0) {
                    cip = code.readInt32LE(cip);
                } else {
                    cip += AMX_CELL_SIZE;
                }
                break;
            case OP_JNZ:
                if(pri != 0) {
                    cip = code.readInt32LE(cip);
                } else {
                    cip += AMX_CELL_SIZE;
                }
                break;
            case OP_JEQ:
                if(pri == alt) {
                    cip = code.readInt32LE(cip);
                } else {
                    cip += AMX_CELL_SIZE;
                }
                break;
            case OP_JNEQ:
                if(pri != alt) {
                    cip = code.readInt32LE(cip);
                } else {
                    cip += AMX_CELL_SIZE;
                }
                break;
            case OP_JLESS:
                if((pri >>> 0) < (alt >>> 0)) {
                    cip = code.readInt32LE(cip);
                } else {
                    cip += AMX_CELL_SIZE;
                }
                break;
            case OP_JLEQ:
                if((pri >>> 0) <= (alt >>> 0)) {
                    cip = code.readInt32LE(cip);
                } else {
                    cip += AMX_CELL_SIZE;
                }
                break;
            case OP_JGRTR:
                if((pri >>> 0) > (alt >>> 0)) {
                    cip = code.readInt32LE(cip);
                } else {
                    cip += AMX_CELL_SIZE;
                }
                break;
            case OP_JGEQ:
                if((pri >>> 0) >= (alt >>> 0)) {
                    cip = code.readInt32LE(cip);
                } else {
                    cip += AMX_CELL_SIZE;
                }
                break;
            case OP_JSLESS:
                if(pri < alt) {
                    cip = code.readInt32LE(cip);
                } else {
                    cip += AMX_CELL_SIZE;
                }
                break;
            case OP_JSLEQ:
                if(pri <= alt) {
                    cip = code.readInt32LE(cip);
                } else {
                    cip += AMX_CELL_SIZE;
                }
                break;
            case OP_JSGRTR:
                if(pri > alt) {
                    cip = code.readInt32LE(cip);
                } else {
                    cip += AMX_CELL_SIZE;
                }
                break;
            case OP_JSGEQ:
                if(pri >= alt) {
                    cip = code.readInt32LE(cip);
                } else {
                    cip += AMX_CELL_SIZE;
                }
                break;
            case OP_SHL:
                pri <<= alt;
                break;
            case OP_SHR:
                pri >>>= alt;
                break;
            case OP_SSHR:
                pri >>= alt;
                break;
            case OP_SHL_C_PRI:
                pri <<= GETPARAM();
                break;
            case OP_SHL_C_ALT:
                alt <<= GETPARAM();
                break;
            case OP_SHR_C_PRI:
                pri >>>= GETPARAM();
                break;
            case OP_SHR_C_ALT:
                alt >>>= GETPARAM();
                break;
            case OP_SMUL:
                pri = (pri * alt) >> 0;
                break;
            case OP_SDIV:
                if(alt == 0) {
                    throw new AMX.Error("AMX_ERR_DIVIDE");
                }
                offs = (pri % alt + alt) % alt;
                pri = (pri - offs) / alt;
                alt = offs;
                break;
            case OP_SDIV_ALT:
                if(pri == 0) {
                    throw new AMX.Error("AMX_ERR_DIVIDE");
                }
                offs = (alt % pri + pri) % pri;
                pri = (alt - offs) / pri;
                alt = offs;
                break;
            case OP_UMUL:
                pri = (((pri >>> 0) * (alt >>> 0)) >>> 0) >> 0;
                break;
            case OP_UDIV:
                if(alt == 0) {
                    throw new AMX.Error("AMX_ERR_DIVIDE");
                }
                offs = (((pri >>> 0) % (alt >>> 0)) >>> 0) >> 0;
                pri = (((pri >>> 0) / (alt >>> 0)) >>> 0) >> 0;
                alt = offs;
                break;
            case OP_UDIV_ALT:
                if(pri == 0) {
                    throw new AMX.Error("AMX_ERR_DIVIDE");
                }
                offs = (((alt >>> 0) % (pri >>> 0)) >>> 0) >> 0;
                pri = (((alt >>> 0) / (pri >>> 0)) >>> 0) >> 0;
                alt = offs;
                break;
            case OP_ADD:
                pri = (pri + alt) >> 0;
                break;
            case OP_SUB:
                pri = (pri - alt) >> 0;
                break;
            case OP_SUB_ALT:
                pri = (alt - pri) >> 0;
                break;
            case OP_AND:
                pri &= alt;
                break;
            case OP_OR:
                pri |= alt;
                break;
            case OP_XOR:
                pri ^= alt;
                break;
            case OP_NOT:
                pri = !pri >> 0;
                break;
            case OP_NEG:
                pri = -pri;
                break;
            case OP_INVERT:
                pri = ~pri;
                break;
            case OP_ADD_C:
                pri = (pri + GETPARAM()) >> 0;
                break;
            case OP_SMUL_C:
                pri = (pri * GETPARAM()) >> 0;
                break;
            case OP_ZERO_PRI:
                pri = 0;
                break;
            case OP_ZERO_ALT:
                alt = 0;
                break;
            case OP_ZERO:
                data.writeInt32LE(0, GETPARAM());
                break;
            case OP_ZERO_S:
                data.writeInt32LE(0, frm + GETPARAM());
                break;
            case OP_SIGN_PRI:
                if((pri & 0xFF) >= 0x80) {
                    pri |= ~0xFF;
                }
                break;
            case OP_SIGN_ALT:
                if((alt & 0xFF) >= 0x80) {
                    alt |= ~0xFF;
                }
                break;
            case OP_EQ:
                pri = (pri == alt) >> 0;
                break;
            case OP_NEQ:
                pri = (pri != alt) >> 0;
                break;
            case OP_LESS:
                pri = ((pri >>> 0) < (alt >>> 0)) >> 0;
                break;
            case OP_LEQ:
                pri = ((pri >>> 0) <= (alt >>> 0)) >> 0;
                break;
            case OP_GRTR:
                pri = ((pri >>> 0) > (alt >>> 0)) >> 0;
                break;
            case OP_GEQ:
                pri = ((pri >>> 0) >= (alt >>> 0)) >> 0;
                break;
            case OP_SLESS:
                pri = (pri < alt) >> 0;
                break;
            case OP_SLEQ:
                pri = (pri <= alt) >> 0;
                break;
            case OP_SGRTR:
                pri = (pri > alt) >> 0;
                break;
            case OP_SGEQ:
                pri = (pri >= alt) >> 0;
                break;
            case OP_EQ_C_PRI:
                pri = (pri == GETPARAM()) >> 0;
                break;
            case OP_EQ_C_ALT:
                pri = (alt == GETPARAM()) >> 0;
                break;
            case OP_INC_PRI:
                pri = (pri + 1) >> 0;
                break;
            case OP_INC_ALT:
                alt = (alt + 1) >> 0;
                break;
            case OP_INC:
                offs = GETPARAM();
                data.writeInt32LE((data.readInt32LE(offs) + 1) >> 0, offs);
                break;
            case OP_INC_S:
                offs = GETPARAM() + frm;
                data.writeInt32LE((data.readInt32LE(offs) + 1) >> 0, offs);
                break;
            case OP_INC_I:
                data.writeInt32LE((data.readInt32LE(pri) + 1) >> 0, pri);
                break;
            case OP_DEC_PRI:
                pri = (pri - 1) >> 0;
                break;
            case OP_DEC_ALT:
                alt = (alt - 1) >> 0;
                break;
            case OP_DEC:
                offs = GETPARAM();
                data.writeInt32LE((data.readInt32LE(offs) - 1) >> 0, offs);
                break;
            case OP_DEC_S:
                offs = GETPARAM() + frm;
                data.writeInt32LE((data.readInt32LE(offs) - 1) >> 0, offs);
                break;
            case OP_DEC_I:
                data.writeInt32LE((data.readInt32LE(pri) -1) >> 0, pri);
                break;
            case OP_MOVS:
                offs = GETPARAM();
                if(pri >= hea && pri < stk || pri >= this.stp) {
                    throw new AMX.Error("AMX_ERR_MEMACCESS");
                }
                if((pri + offs) > hea && (pri + offs) < stk || (pri + offs) > this.stp) {
                    throw new AMX.Error("AMX_ERR_MEMACCESS");
                }
                if(alt >= hea && alt < stk || alt >= this.stp) {
                    throw new AMX.Error("AMX_ERR_MEMACCESS");
                }
                if ((alt + offs) > hea && (alt + offs) < stk || (alt + offs) > this.stp) {
                    throw new AMX.Error("AMX_ERR_MEMACCESS");
                }
                data.copy(data, alt, pri, offs);
                break;
            case OP_CMPS:
                offs = GETPARAM();
                if(pri >= hea && pri < stk || pri >= this.stp) {
                    throw new AMX.Error("AMX_ERR_MEMACCESS");
                }
                if((pri + offs) > hea && (pri + offs) < stk || (pri + offs) > this.stp) {
                    throw new AMX.Error("AMX_ERR_MEMACCESS");
                }
                if(alt >= hea && alt < stk || alt >= this.stp) {
                    throw new AMX.Error("AMX_ERR_MEMACCESS");
                }
                if ((alt + offs) > hea && (alt + offs) < stk || (alt + offs) > this.stp) {
                    throw new AMX.Error("AMX_ERR_MEMACCESS");
                }
                pri = memcmp(data, alt, data, pri, offs);
                break;
            case OP_FILL:
                offs = GETPARAM();
                if(alt >= hea && alt < stk || alt >= this.stp) {
                    throw new AMX.Error("AMX_ERR_MEMACCESS");
                }
                if ((alt + offs) > hea && (alt + offs) < stk || (alt + offs)>this.stp) {
                    throw new AMX.Error("AMX_ERR_MEMACCESS");
                }
                for (i = alt; offs >= AMX_CELL_SIZE; i += AMX_CELL_SIZE, offs -= AMX_CELL_SIZE) {
                    data.writeInt32LE(pri, i);
                }
                break;
            case OP_HALT:
                offs = GETPARAM();
                this.frm = frm;
                this.pri = pri;
                this.alt = alt;
                this.cip = cip;
                this.stk = reset_stk;
                this.hea = reset_hea;
                return pri;
            case OP_BOUNDS:
                if((pri >>> 0) > (GETPARAM() >>> 0)) {
                    throw new AMX.Error("AMX_ERR_BOUNDS");
                }
                break;
            case OP_SYSREQ_PRI:
                this.cip = cip;
                this.hea = hea;
                this.frm = frm;
                this.stk = stk;
                num = this.callback(pri, data.slice(stk));
                if(typeof num.pri == "number") {
                    pri = num.pri;
                }
                if(num.num != 0 /* AMX_ERR_NONE */) {
                    if(num.num == 12 /* AMX_ERR_SLEEP */) {
                        this.pri = pri;
                        this.alt = alt;
                        this.reset_stk = reset_stk;
                        this.reset_hea = reset_hea;
                        return;
                    }
                    this.reset_stk = reset_stk;
                    this.reset_hea = reset_hea;
                    return;
                }
                break;
            case OP_SYSREQ_C:
                offs = GETPARAM();
                this.cip = cip;
                this.hea = hea;
                this.frm = frm;
                this.stk = stk;
                num = this.callback(offs, data.slice(stk));
                if(typeof num.pri == "number") {
                    pri = num.pri;
                }
                if(num.num != 0 /* AMX_ERR_NONE */) {
                    if(num.num == 12 /* AMX_ERR_SLEEP */) {
                        this.pri = pri;
                        this.alt = alt;
                        this.reset_stk = reset_stk;
                        this.reset_hea = reset_hea;
                        return;
                    }
                    this.reset_stk = reset_stk;
                    this.reset_hea = reset_hea;
                    return;
                }
                break;
            case OP_SYSREQ_D:
                GETPARAM();
                throw new AMX.Error("SYSREQ_D not implemented");
                break;
            case OP_LINE:
                GETPARAM();
                GETPARAM();
                break;
            case OP_SYMBOL:
                cip += GETPARAM();
                break;
            case OP_SRANGE:
                GETPARAM();
                GETPARAM();
                break;
            case OP_SYMTAG:
                GETPARAM();
                break;
            case OP_JUMP_PRI:
                cip = pri;
                break;
            case OP_SWITCH:
                var cptr = cip + AMX_CELL_SIZE;
                cip = code.readInt32LE(cptr + AMX_CELL_SIZE);
                num = code.readInt32LE(cptr);
                for(cptr += 2 * AMX_CELL_SIZE; num > 0 && code.readInt32LE(cptr) != pri; num--, cptr += 2 * AMX_CELL_SIZE) {
                    /* nothing */
                    }
                if(num > 0) {
                    cip = code.readInt32LE(cptr + AMX_CELL_SIZE);
                }
                break;
            case OP_SWAP_PRI:
                offs = data.readInt32(stk);
                data.writeInt32(pri, stk);
                pri = offs;
                break;
            case OP_SWAP_ALT:
                offs = data.readInt32(stk);
                data.writeInt32(alt, stk);
                alt = offs;
                break;
            case OP_PUSHADDR:
                PUSH(frm + GETPARAM());
                break;
            case OP_BREAK:
                break;
            default:
                throw new AMX.Error("AMX_ERR_INVINSTR", "Unknown opcode");
        }
    }
}

function memcmp(buffer1, offset1, buffer2, offset2, length) {
    for(var i = 0; i < length; i++, offset1++, offset2++) {
        if(buffer1[offset1] != buffer2[offset2]) {
            return buffer1[offset] - buffer2[offset];
        }
    }
    return 0;
}

AMX.prototype.callback = function(pri, stk) {
    console.log("Callback called.");
    return {
        num: 0
    };
}

function expand(code, codesize, memsize) {
    var c;
    var spare = [];
    for(var i = 0; i < AMX_COMPACTMARGIN; i++) {
        spare[i] = {
            memloc: 0, 
            c: 0
        };
    }
    var sh = 0, st = 0, sc = 0;
    var shift = 0;
    assert(memsize % AMX_CELL_SIZE == 0);
    while(codesize > 0) {
        c = 0;
        shift = 0;
        do {
            codesize--;
            assert(shift < 8 * AMX_CELL_SIZE);
            assert(shift > 0 || (code[codesize] & 0x80) == 0);
            c |= (code[codesize] & 0x7f) << shift;
            shift += 7;
        } while(codesize > 0 && (code[codesize - 1] & 0x80) != 0);
        if((code[codesize] & 0x40) != 0) {
            while(shift < 8 * AMX_CELL_SIZE) {
                c |= 0xFF << shift;
                shift += 8;
            }
        }
        while(sc && spare[sh].memloc > codesize) {
            code.writeInt32LE(spare[sh].c, spare[sh].memloc);
            sh = (sh + 1) % AMX_COMPACTMARGIN;
            sc--;
        }
        memsize -= AMX_CELL_SIZE;
        assert(memsize >= 0);
        if((memsize > codesize) || ((memsize == codesize) && (memsize == 0))) {
            code.writeInt32LE(c, memsize);
        } else {
            assert(sc < AMX_COMPACTMARGIN);
            spare[st].memloc = memsize;
            spare[st].c = c;
            st = (st + 1) % AMX_COMPACTMARGIN;
            sc++;
        }
    }
    assert(memsize == 0);
}

AMX.Error = function(amxError, elaboration) {
    Error.call(this, amxError + ": " + elaboration);
}

AMX.Error.prototype = new Error();



AMX.fromFile = function(file, callback) {
    fs.open(file, "r", function(err, fd) {
        if(err) {
            callback(err);
            return;
        }
        var buffer = new Buffer(AMXHeader.BYTE_SIZE);
        fs.read(fd, buffer, 0, AMXHeader.BYTE_SIZE, 0, function(err, bytesRead, buffer) {
            if(err) {
                callback(err);
                return;
            }
            if(bytesRead < AMXHeader.BYTE_SIZE) {
                fs.close(fd);
                callback(new Error("File size is less than AMX header size!"));
                return;
            }
            var header = new AMXHeader(buffer);
            for(var k in header) {
                console.log(k + ": " + header[k]);
            }
            var amxBuffer = new Buffer(header.stp);
            fs.read(fd, amxBuffer, 0, header.size, 0, function(err, bytesRead, buffer) {
                if(err) {
                    callback(err);
                    return;
                }
                if(bytesRead < header.size) {
                    fs.close(fd);
                    callback(new Error("File size is less than what AMX header specifies!"));
                    return;
                }
                callback(void(0), AMX.init(amxBuffer));
            });
        });
    });
}

function FuncStub(buffer) {
    if(!Buffer.isBuffer(buffer)) {
        buffer = new Buffer(FuncStub.BYTE_SIZE);
    }
    if(buffer.length < FuncStub.BYTE_SIZE) {
        throw new Error("Buffer size is less than FuncStub size");
    }
    this.buffer = buffer;
    this.nameOffset = 4;
    this.name = buffer.slice(4, 24);
}

Object.defineProperty(FuncStub.prototype, "address", {
    get: function() {
        return this.buffer.readUInt32LE(0);
    },
    set: function(v) {
        this.buffer.writeUInt32LE(v, 0);
    },
    enumerable: true, 
    configurable: false
});


FuncStub.BYTE_SIZE = AMX_CELL_SIZE + sEXPMAX + 1;

exports.AMX = AMX;
exports.AMXHeader = AMXHeader;