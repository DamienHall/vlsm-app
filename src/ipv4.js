export {IPv4, TYPE}

const TYPE = {
  DEFAULT: 0,
  UINT8ARRAY: 1,
  BINARY: 2
}

class IPv4 {
  constructor(ip=null, prefix=null) {
    this.ip = typeof ip === "string" ? new Uint8Array(ip.split(".")) : new Uint8Array(ip);
    this.prefix = typeof prefix === "string" ? IPv4.subnetToPrefix(prefix) : prefix;
    this.hostBitCount = 32-this.prefix;
    this.networkBitCount = 32-this.hostBitCount;
  }
  static getNewPrefix(hostRequirements) {
    let f = (x) => Math.pow(2,x)-2;
    let g = (x) => 32 - x;
    let solutionFound = false;
    let i = 1;
    while (!solutionFound) {
      if (f(i-1)<=hostRequirements&&f(i)>=hostRequirements) {
        solutionFound = true;
        return 32-i;
      } else {
        i++;
      }
    }
  }
  static subnetToPrefix(subnetMask) {
    return (subnetMask.split(".").map(_=>parseInt(_).toString(2)).join("").match(/1/g)||[]).length;
  }
  getPrefix() {
    return this.prefix;
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
  getNetworkAddress() {
    let binIP = this.getIP(TYPE.BINARY).split("/")[0].split(".").join("");
    let firstHalf = binIP.substring(0,this.prefix);
    let secondHalf = binIP.substring(this.prefix,binIP.length);
    let networkAddress = (firstHalf+secondHalf.replace(/1/gi,"0")).match(/.{1,8}/gi).map(_=>parseInt(_,2)).join(".");
    return networkAddress+"/"+this.prefix;
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
  getFirstAddress() {
    let binIP = this.getIP(TYPE.BINARY).split("/")[0].split(".").join("");
    let firstHalf = binIP.substring(0,this.prefix);
    let secondHalf = ("0".repeat(32-this.prefix)+(parseInt(binIP.substring(this.prefix,binIP.length).replace(/1/g,"0"),2)+1).toString(2)).slice(-(32-this.prefix));
    let firstAddress = (firstHalf+secondHalf).match(/.{1,8}/gi).map(_=>parseInt(_,2)).join(".");
    return firstAddress+"/"+this.prefix;
  }
  getLastAddress() {
    let binIP = this.getIP(TYPE.BINARY).split("/")[0].split(".").join("");
    let firstHalf = binIP.substring(0,this.prefix);
    let secondHalf = ("0".repeat(32-this.prefix)+(parseInt(binIP.substring(this.prefix,binIP.length).replace(/0/g,"1"),2)-1).toString(2)).slice(-(32-this.prefix));
    let lastAddress = (firstHalf+secondHalf).match(/.{1,8}/gi).map(_=>parseInt(_,2)).join(".");
    return lastAddress+"/"+this.prefix;
  }
  getAvailableHosts() {
    return Math.pow(2,(this.getSubnetMask(TYPE.BINARY).split("/")[0].split(".").join("").match(/0/g)||[]).length)-2;
  }
  getAvailableSubnets() {
    return Math.pow(2,(this.getSubnetMask(TYPE.BINARY).split("/")[0].split(".").join("").match(/1/g)||[]).length)-2;
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
  subnet(minHosts) {
    let binIP = this.getIP(TYPE.BINARY).split("/")[0].split(".").join("");
    let newPrefix = IPv4.getNewPrefix(minHosts);
    let networkPortion = binIP.substring(0,this.prefix);
    let subnetPortion = binIP.substring(this.prefix,newPrefix);
    let hostPortion = binIP.substring(newPrefix,binIP.length);
    let addedPortions = networkPortion+subnetPortion+hostPortion;
    let subnets = [];
    let inc = 0;
    for (let i = 0; i < Math.pow(2,newPrefix-this.prefix); i++) {
      subnetPortion = ("0".repeat(newPrefix-this.prefix)+(parseInt(subnetPortion,2)+inc).toString(2)).slice(-(newPrefix-this.prefix));
      addedPortions = (networkPortion+subnetPortion+hostPortion).match(/.{1,8}/gi).map(_=>parseInt(_,2)).join(".");
      subnets.push(new IPv4(addedPortions, newPrefix));
      inc = 1;
    }
    return subnets;
  }
  vlsm(hosts=null) {
    if (hosts===null) {
      return null;
    }
    let binIP = this.getIP(TYPE.BINARY).split("/")[0].split(".").join("");
    let newIP = "";
    let originalHostsOrder = [...hosts];
    let ips = [];
    hosts.sort((a,b)=>b-a);
    for (let i = 0; i < hosts.length; i++) {
      if (i === 0) {
        ips.push({ip:new IPv4(this.getIP().split("/")[0], IPv4.getNewPrefix(hosts[i])), minHosts:hosts[i]});
      } else {
        let firstHalf = ips[i-1].ip.getIP(TYPE.BINARY).split("/")[0].split(".").join("").substring(0,ips[i-1].ip.getPrefix());
        let secondHalf = ips[i-1].ip.getIP(TYPE.BINARY).split("/")[0].split(".").join("").substring(ips[i-1].ip.getPrefix(),binIP.length);
        firstHalf = ("0".repeat(firstHalf.length)+(parseInt(firstHalf,2)+1).toString(2)).slice(-firstHalf.length);
        let newIP = (firstHalf+secondHalf).match(/.{1,8}/gi).map(_=>parseInt(_,2)).join(".");
        ips.push({ip:new IPv4(newIP, IPv4.getNewPrefix(hosts[i])), minHosts:hosts[i]});
      }
    }
    return ips;
  }
}
