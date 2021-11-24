export {IPv4, TYPE}

const TYPE = {
  DEFAULT: 0,
  UINT8ARRAY: 1,
  BINARY: 2
}

class IPv4 {
  constructor(ip=null, prefix=null) {
    this.ip = typeof ip === "string" ? new Uint8Array(ip.split(".")) : new Uint8Array(ip);
    this.prefix = prefix;
    this.hostBitCount = 32-this.prefix;
    this.networkBitCount = 32-this.hostBitCount;
  }
  getNetworkHostData() {
    return {
      networkBitCount: this.networkBitCount,
      hostBitCount: this.hostBitCount
    }
  }
  getNetworkBitCount() {
    return this.networkBitCount;
  }
  getHostBitCount() {
    return this.hostBitCount;
  }
  getWildcard() {

  }
  getSubnetMask(format=TYPE.DEFAULT) {
    let broadcastAddress;
    let ip;
    let replace;
    switch(format) {
      case TYPE.DEFAULT:
        ip = this.getIP(TYPE.BINARY).replace(/\./gi,"");
        replace = ip.slice(this.prefix).replace(/1/gi,0);
        replace = replace.replace(replace.slice(replace.indexOf("/")),"");
        ip = ip.substring(0,this.prefix).replace(/0/gi,1) + replace;
        ip = ip.match(/.{1,8}/g);
        ip = ip.map(octet=>parseInt(octet, 2));
        ip = ip.join(".")+"/"+this.prefix;
        return ip;
        break;
      case TYPE.UINT8ARRAY:
        ip = this.getIP(TYPE.BINARY).replace(/\./gi,"");
        replace = ip.slice(this.prefix).replace(/1/gi,0);
        replace = replace.replace(replace.slice(replace.indexOf("/")),"");
        ip = ip.substring(0,this.prefix).replace(/0/gi,1) + replace;
        ip = ip.match(/.{1,8}/g);
        ip = ip.map(octet=>parseInt(octet, 2));
        ip = new Uint8Array(ip);
        return ip;
        break;
      case TYPE.BINARY:
        ip = this.getIP(TYPE.BINARY).replace(/\./gi,"");
        replace = ip.slice(this.prefix).replace(/1/gi,0);
        replace = replace.replace(replace.slice(replace.indexOf("/")),"");
        ip = ip.substring(0,this.prefix).replace(/0/gi,1) + replace;
        ip = ip.match(/.{1,8}/g);
        ip = ip.join(".")+"/"+this.prefix;
        return ip;
        break;
    }
  }
  getBroadcast(format=TYPE.DEFAULT) {
    let broadcastAddress;
    let ip;
    let replace;
    switch(format) {
      case TYPE.DEFAULT:
        ip = this.getIP(TYPE.BINARY).replace(/\./gi,"");
        replace = ip.slice(this.prefix).replace(/0/gi,1);
        replace = replace.replace(replace.slice(replace.indexOf("/")),"");
        ip = ip.substring(0,this.prefix) + replace;
        ip = ip.match(/.{1,8}/g);
        ip = ip.map(octet=>parseInt(octet, 2));
        ip = ip.join(".")+"/"+this.prefix;
        return ip;
        break;
      case TYPE.UINT8ARRAY:
        ip = this.getIP(TYPE.BINARY).replace(/\./gi,"");
        replace = ip.slice(this.prefix).replace(/0/gi,1);
        replace = replace.replace(replace.slice(replace.indexOf("/")),"");
        ip = ip.substring(0,this.prefix) + replace;
        ip = ip.match(/.{1,8}/g);
        ip = ip.map(octet=>parseInt(octet, 2));
        ip = new Uint8Array(ip);
        return ip;
        break;
      case TYPE.BINARY:
        ip = this.getIP(TYPE.BINARY).replace(/\./gi,"");
        replace = ip.slice(this.prefix).replace(/0/gi,1);
        replace = replace.replace(replace.slice(replace.indexOf("/")),"");
        ip = ip.substring(0,this.prefix) + replace;
        ip = ip.match(/.{1,8}/g).join(".")+"/"+this.prefix;
        return ip;
        break;
    }
  }
  getIP(format=TYPE.DEFAULT) {
    let formattedIP;
    switch(format) {
      case TYPE.DEFAULT:
        formattedIP = this.ip.join(".")+"/"+this.prefix;
        break;
      case TYPE.UINT8ARRAY:
        formattedIP = this.ip;
        break;
      case TYPE.BINARY:
        formattedIP = [];
        this.ip.forEach((octet, index)=>{
          formattedIP[index] = octet.toString(2);
          if (octet.toString(2).length < 8) {
            let zeroStr = "";
            for (let i = 0; i < 8-octet.toString(2).length; i++) {
              zeroStr += "0";
            }
            formattedIP[index] = zeroStr + formattedIP[index];
          }
        });
        formattedIP = formattedIP.join(".")+"/"+this.prefix;
        break;
    }
    return formattedIP;
  }
  subnet(hosts) {
    let currentIP = this.getIP(TYPE.BINARY).split("/")[0];
    let ipArray = [];
    for (let i = 0; i < Math.pow(2,hosts); i++) {
      let splitIP = [];
      splitIP[0] = currentIP.replace(/\./gi,"").substring(0,this.prefix);
      splitIP[1] = currentIP.replace(/\./gi,"").substring(this.prefix, this.prefix+hosts);
      splitIP[2] = currentIP.replace(/\./gi,"").substring(this.prefix+hosts, currentIP.replace(/\./gi,"").length)
      splitIP[1] = (parseInt(splitIP[1],2)+i).toString(2);
      let l = splitIP[1].length;
      for (let j = 0; j < hosts-l; j++) {
        splitIP[1] = "0"+splitIP[1];
      }
      splitIP = splitIP.join("");
      splitIP = splitIP.match(/.{1,8}/g).map(_=>parseInt(_,2)).join(".");
      ipArray[i] = new IPv4(splitIP, this.prefix+hosts);
    }
    return ipArray;
  }
  vlsm(hosts=null) {
    if (hosts===null) {
      return null;
    }
    let hostCount = hosts.length;
    let thisIP = parseInt(this.getIP(TYPE.BINARY).replace(/\./gi,"").split("/")[0],2);
    let bitShiftedIP = (((thisIP>>(32-this.prefix))+1)<<(32-this.prefix));
    hosts.sort((a,b)=>b-a);
    console.log(thisIP.toString(2));
    console.log(((thisIP>>(32-this.prefix))).toString(2));
    console.log((thisIP>>>2).toString(2));
    console.log((bitShiftedIP.toString(2)));
  }
}
