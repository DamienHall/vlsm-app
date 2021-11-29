import {IPv4, TYPE} from './ipv4';
let ip = new IPv4("10.11.48.0",24);
let vlsmIPs = ip.vlsm([60,30,14,6,2]);
// let ip = new IPv4("192.168.72.0",24);
// let vlsmIPs = ip.vlsm([7,15,29,58,2]);
let format = (ip) => {
  return "Hosts: "+ip.minHosts+"\tNA: "+ip.ip.getIP()+"\tFA: "+ip.ip.getFirstAddress()+"\tBA: "+ip.ip.getBroadcast()+"\tSM: "+ip.ip.getSubnetMask();
}
vlsmIPs.forEach((ip,index)=>{console.log(format(ip))});
