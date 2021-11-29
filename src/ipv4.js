export {IPv4, TYPE}

const TYPE = {
  DEFAULT: 0,
  UINT8ARRAY: 1,
  BINARY: 2
}

class IPv4 {
  static hostsToPrefix(minHosts) {
    let i = 0;
    while ((Math.pow(2,i)-2)<minHosts) {
      i++;
    }
    return 32-i;
  }
  static mask(ip,mask) {
    let maskedIP = [];
    for (let i = 0; i < 4; i++) {
      maskedIP.push(ip[i]&mask[i]);
    }
    return maskedIP;
  }
  static prefixToSubnet(prefix) {
    let binSubnetMask = "1".repeat(prefix)+"0".repeat(32-prefix);
    return new Uint8Array(binSubnetMask.match(/.{1,8}/gi).map(_=>parseInt(_,2)));
  }
  constructor(ip=null, prefix=null) {
    switch(typeof ip) {
      case "string":
        if (prefix) {
          this.ip = new Uint8Array(ip.split(".").map(_=>parseInt(_)));
          this.prefix = typeof prefix=="string"?parseInt(prefix):prefix;
        } else {
          if (ip.includes("/")) {
            this.ip = new Uint8Array(ip.split("/")[0].split(".").map(_=>parseInt(_)));
            this.prefix = parseInt(ip.split("/")[1]);
          } else {
            this.ip = new Uint8Array(ip.split(".").map(_=>parseInt(_)));
            console.log("ERROR: NO PREFIX SET FOR IP "+this.ip.join("."));
            this.prefix = 0;
          }
        }
        break;
      case "object":
        this.ip = new Uint8Array(ip);
        if (prefix) {
          this.prefix = typeof prefix=="string"?parseInt(prefix):prefix;
        } else {
          console.log("ERROR: NO PREFIX SET FOR IP "+this.ip.join("."));
          this.prefix = 0;
        }
        break;
    }
  }
  getPrefix() {
      return this.prefix;
  }
  getIP(format=TYPE.DEFAULT) {
    switch(format) {
      case 0:
        return this.ip.join(".");
        break;
      case 1:
        return this.ip;
        break;
      case 2:
        let binIP = this.ip.join(".").split(".").map(_=>("0".repeat(8)+parseInt(_).toString(2)).slice(-8));
        return binIP.join(".");
        break;
    }
      return this.ip;
  }
  getSubnetMask(format=TYPE.DEFAULT) {
    let binSubnetMask = "1".repeat(this.prefix)+"0".repeat(32-this.prefix);
    switch(format) {
      case 0:
        return binSubnetMask.match(/.{1,8}/gi).map(_=>parseInt(_,2)).join(".");
        break;
      case 1:
        return new Uint8Array(binSubnetMask.match(/.{1,8}/gi).map(_=>parseInt(_,2)));
        break;
      case 2:
        return binSubnetMask.match(/.{1,8}/gi).join(".");
        break;
    }
  }
  subnet(hosts) {
    let newPrefix = IPv4.hostsToPrefix(hosts);
    let ip = this.getIP(TYPE.UINT8ARRAY);
    let ips = [];
    let maskedIP = IPv4.mask(ip, IPv4.prefixToSubnet(newPrefix));
    return parseInt("00000001",2)<<1;
  }
  vlsm(hosts) {

  }
}

let ip = new IPv4([10,10,10,0],24);
console.log(ip.getIP(TYPE.BINARY));
console.log(ip.getSubnetMask(TYPE.BINARY));
console.log(ip.subnet(2))
