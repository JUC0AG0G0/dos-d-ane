// FICHIER GÉNÉRÉ par `npm run build:page` à partir de src/page/ : ne pas éditer à la main.
"use strict";(()=>{var qE=Object.create;var mm=Object.defineProperty;var XE=Object.getOwnPropertyDescriptor;var jE=Object.getOwnPropertyNames;var YE=Object.getPrototypeOf,QE=Object.prototype.hasOwnProperty;var Ct=(r,e)=>()=>{try{return e||r((e={exports:{}}).exports,e),e.exports}catch(t){throw e=0,t}},ye=(r,e)=>{for(var t in e)mm(r,t,{get:e[t],enumerable:!0})},ZE=(r,e,t,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of jE(e))!QE.call(r,n)&&n!==t&&mm(r,n,{get:()=>e[n],enumerable:!(o=XE(e,n))||o.enumerable});return r};var Ci=(r,e,t)=>(t=r!=null?qE(YE(r)):{},ZE(e||!r||!r.__esModule?mm(t,"default",{value:r,enumerable:!0}):t,r));var Th=Ct((jV,vh)=>{vh.exports={}});var Zh=Ct((s4,Qh)=>{Qh.exports=Ie;var Kt=null;try{Kt=new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0,97,115,109,1,0,0,0,1,13,2,96,0,1,127,96,4,127,127,127,127,1,127,3,7,6,0,1,1,1,1,1,6,6,1,127,1,65,0,11,7,50,6,3,109,117,108,0,1,5,100,105,118,95,115,0,2,5,100,105,118,95,117,0,3,5,114,101,109,95,115,0,4,5,114,101,109,95,117,0,5,8,103,101,116,95,104,105,103,104,0,0,10,191,1,6,4,0,35,0,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,126,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,127,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,128,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,129,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,130,34,4,66,32,135,167,36,0,32,4,167,11])),{}).exports}catch{}function Ie(r,e,t){this.low=r|0,this.high=e|0,this.unsigned=!!t}Ie.prototype.__isLong__;Object.defineProperty(Ie.prototype,"__isLong__",{value:!0});function kt(r){return(r&&r.__isLong__)===!0}Ie.isLong=kt;var Gh={},zh={};function Eo(r,e){var t,o,n;return e?(r>>>=0,(n=0<=r&&r<256)&&(o=zh[r],o)?o:(t=ke(r,(r|0)<0?-1:0,!0),n&&(zh[r]=t),t)):(r|=0,(n=-128<=r&&r<128)&&(o=Gh[r],o)?o:(t=ke(r,r<0?-1:0,!1),n&&(Gh[r]=t),t))}Ie.fromInt=Eo;function qt(r,e){if(isNaN(r))return e?No:Xt;if(e){if(r<0)return No;if(r>=qh)return Yh}else{if(r<=-Hh)return It;if(r+1>=Hh)return jh}return r<0?qt(-r,e).neg():ke(r%Ln|0,r/Ln|0,e)}Ie.fromNumber=qt;function ke(r,e,t){return new Ie(r,e,t)}Ie.fromBits=ke;var Ru=Math.pow;function Em(r,e,t){if(r.length===0)throw Error("empty string");if(r==="NaN"||r==="Infinity"||r==="+Infinity"||r==="-Infinity")return Xt;if(typeof e=="number"?(t=e,e=!1):e=!!e,t=t||10,t<2||36<t)throw RangeError("radix");var o;if((o=r.indexOf("-"))>0)throw Error("interior hyphen");if(o===0)return Em(r.substring(1),e,t).neg();for(var n=qt(Ru(t,8)),s=Xt,i=0;i<r.length;i+=8){var a=Math.min(8,r.length-i),u=parseInt(r.substring(i,i+a),t);if(a<8){var l=qt(Ru(t,a));s=s.mul(l).add(qt(u))}else s=s.mul(n),s=s.add(qt(u))}return s.unsigned=e,s}Ie.fromString=Em;function er(r,e){return typeof r=="number"?qt(r,e):typeof r=="string"?Em(r,e):ke(r.low,r.high,typeof e=="boolean"?e:r.unsigned)}Ie.fromValue=er;var Wh=65536,TI=1<<24,Ln=Wh*Wh,qh=Ln*Ln,Hh=qh/2,Kh=Eo(TI),Xt=Eo(0);Ie.ZERO=Xt;var No=Eo(0,!0);Ie.UZERO=No;var Pn=Eo(1);Ie.ONE=Pn;var Xh=Eo(1,!0);Ie.UONE=Xh;var Nm=Eo(-1);Ie.NEG_ONE=Nm;var jh=ke(-1,2147483647,!1);Ie.MAX_VALUE=jh;var Yh=ke(-1,-1,!0);Ie.MAX_UNSIGNED_VALUE=Yh;var It=ke(0,-2147483648,!1);Ie.MIN_VALUE=It;var U=Ie.prototype;U.toInt=function(){return this.unsigned?this.low>>>0:this.low};U.toNumber=function(){return this.unsigned?(this.high>>>0)*Ln+(this.low>>>0):this.high*Ln+(this.low>>>0)};U.toString=function(e){if(e=e||10,e<2||36<e)throw RangeError("radix");if(this.isZero())return"0";if(this.isNegative())if(this.eq(It)){var t=qt(e),o=this.div(t),n=o.mul(t).sub(this);return o.toString(e)+n.toInt().toString(e)}else return"-"+this.neg().toString(e);for(var s=qt(Ru(e,6),this.unsigned),i=this,a="";;){var u=i.div(s),l=i.sub(u.mul(s)).toInt()>>>0,c=l.toString(e);if(i=u,i.isZero())return c+a;for(;c.length<6;)c="0"+c;a=""+c+a}};U.getHighBits=function(){return this.high};U.getHighBitsUnsigned=function(){return this.high>>>0};U.getLowBits=function(){return this.low};U.getLowBitsUnsigned=function(){return this.low>>>0};U.getNumBitsAbs=function(){if(this.isNegative())return this.eq(It)?64:this.neg().getNumBitsAbs();for(var e=this.high!=0?this.high:this.low,t=31;t>0&&(e&1<<t)==0;t--);return this.high!=0?t+33:t+1};U.isZero=function(){return this.high===0&&this.low===0};U.eqz=U.isZero;U.isNegative=function(){return!this.unsigned&&this.high<0};U.isPositive=function(){return this.unsigned||this.high>=0};U.isOdd=function(){return(this.low&1)===1};U.isEven=function(){return(this.low&1)===0};U.equals=function(e){return kt(e)||(e=er(e)),this.unsigned!==e.unsigned&&this.high>>>31===1&&e.high>>>31===1?!1:this.high===e.high&&this.low===e.low};U.eq=U.equals;U.notEquals=function(e){return!this.eq(e)};U.neq=U.notEquals;U.ne=U.notEquals;U.lessThan=function(e){return this.comp(e)<0};U.lt=U.lessThan;U.lessThanOrEqual=function(e){return this.comp(e)<=0};U.lte=U.lessThanOrEqual;U.le=U.lessThanOrEqual;U.greaterThan=function(e){return this.comp(e)>0};U.gt=U.greaterThan;U.greaterThanOrEqual=function(e){return this.comp(e)>=0};U.gte=U.greaterThanOrEqual;U.ge=U.greaterThanOrEqual;U.compare=function(e){if(kt(e)||(e=er(e)),this.eq(e))return 0;var t=this.isNegative(),o=e.isNegative();return t&&!o?-1:!t&&o?1:this.unsigned?e.high>>>0>this.high>>>0||e.high===this.high&&e.low>>>0>this.low>>>0?-1:1:this.sub(e).isNegative()?-1:1};U.comp=U.compare;U.negate=function(){return!this.unsigned&&this.eq(It)?It:this.not().add(Pn)};U.neg=U.negate;U.add=function(e){kt(e)||(e=er(e));var t=this.high>>>16,o=this.high&65535,n=this.low>>>16,s=this.low&65535,i=e.high>>>16,a=e.high&65535,u=e.low>>>16,l=e.low&65535,c=0,p=0,m=0,f=0;return f+=s+l,m+=f>>>16,f&=65535,m+=n+u,p+=m>>>16,m&=65535,p+=o+a,c+=p>>>16,p&=65535,c+=t+i,c&=65535,ke(m<<16|f,c<<16|p,this.unsigned)};U.subtract=function(e){return kt(e)||(e=er(e)),this.add(e.neg())};U.sub=U.subtract;U.multiply=function(e){if(this.isZero())return Xt;if(kt(e)||(e=er(e)),Kt){var t=Kt.mul(this.low,this.high,e.low,e.high);return ke(t,Kt.get_high(),this.unsigned)}if(e.isZero())return Xt;if(this.eq(It))return e.isOdd()?It:Xt;if(e.eq(It))return this.isOdd()?It:Xt;if(this.isNegative())return e.isNegative()?this.neg().mul(e.neg()):this.neg().mul(e).neg();if(e.isNegative())return this.mul(e.neg()).neg();if(this.lt(Kh)&&e.lt(Kh))return qt(this.toNumber()*e.toNumber(),this.unsigned);var o=this.high>>>16,n=this.high&65535,s=this.low>>>16,i=this.low&65535,a=e.high>>>16,u=e.high&65535,l=e.low>>>16,c=e.low&65535,p=0,m=0,f=0,d=0;return d+=i*c,f+=d>>>16,d&=65535,f+=s*c,m+=f>>>16,f&=65535,f+=i*l,m+=f>>>16,f&=65535,m+=n*c,p+=m>>>16,m&=65535,m+=s*l,p+=m>>>16,m&=65535,m+=i*u,p+=m>>>16,m&=65535,p+=o*c+n*l+s*u+i*a,p&=65535,ke(f<<16|d,p<<16|m,this.unsigned)};U.mul=U.multiply;U.divide=function(e){if(kt(e)||(e=er(e)),e.isZero())throw Error("division by zero");if(Kt){if(!this.unsigned&&this.high===-2147483648&&e.low===-1&&e.high===-1)return this;var t=(this.unsigned?Kt.div_u:Kt.div_s)(this.low,this.high,e.low,e.high);return ke(t,Kt.get_high(),this.unsigned)}if(this.isZero())return this.unsigned?No:Xt;var o,n,s;if(this.unsigned){if(e.unsigned||(e=e.toUnsigned()),e.gt(this))return No;if(e.gt(this.shru(1)))return Xh;s=No}else{if(this.eq(It)){if(e.eq(Pn)||e.eq(Nm))return It;if(e.eq(It))return Pn;var i=this.shr(1);return o=i.div(e).shl(1),o.eq(Xt)?e.isNegative()?Pn:Nm:(n=this.sub(e.mul(o)),s=o.add(n.div(e)),s)}else if(e.eq(It))return this.unsigned?No:Xt;if(this.isNegative())return e.isNegative()?this.neg().div(e.neg()):this.neg().div(e).neg();if(e.isNegative())return this.div(e.neg()).neg();s=Xt}for(n=this;n.gte(e);){o=Math.max(1,Math.floor(n.toNumber()/e.toNumber()));for(var a=Math.ceil(Math.log(o)/Math.LN2),u=a<=48?1:Ru(2,a-48),l=qt(o),c=l.mul(e);c.isNegative()||c.gt(n);)o-=u,l=qt(o,this.unsigned),c=l.mul(e);l.isZero()&&(l=Pn),s=s.add(l),n=n.sub(c)}return s};U.div=U.divide;U.modulo=function(e){if(kt(e)||(e=er(e)),Kt){var t=(this.unsigned?Kt.rem_u:Kt.rem_s)(this.low,this.high,e.low,e.high);return ke(t,Kt.get_high(),this.unsigned)}return this.sub(this.div(e).mul(e))};U.mod=U.modulo;U.rem=U.modulo;U.not=function(){return ke(~this.low,~this.high,this.unsigned)};U.and=function(e){return kt(e)||(e=er(e)),ke(this.low&e.low,this.high&e.high,this.unsigned)};U.or=function(e){return kt(e)||(e=er(e)),ke(this.low|e.low,this.high|e.high,this.unsigned)};U.xor=function(e){return kt(e)||(e=er(e)),ke(this.low^e.low,this.high^e.high,this.unsigned)};U.shiftLeft=function(e){return kt(e)&&(e=e.toInt()),(e&=63)===0?this:e<32?ke(this.low<<e,this.high<<e|this.low>>>32-e,this.unsigned):ke(0,this.low<<e-32,this.unsigned)};U.shl=U.shiftLeft;U.shiftRight=function(e){return kt(e)&&(e=e.toInt()),(e&=63)===0?this:e<32?ke(this.low>>>e|this.high<<32-e,this.high>>e,this.unsigned):ke(this.high>>e-32,this.high>=0?0:-1,this.unsigned)};U.shr=U.shiftRight;U.shiftRightUnsigned=function(e){if(kt(e)&&(e=e.toInt()),e&=63,e===0)return this;var t=this.high;if(e<32){var o=this.low;return ke(o>>>e|t<<32-e,t>>>e,this.unsigned)}else return e===32?ke(t,0,this.unsigned):ke(t>>>e-32,0,this.unsigned)};U.shru=U.shiftRightUnsigned;U.shr_u=U.shiftRightUnsigned;U.toSigned=function(){return this.unsigned?ke(this.low,this.high,!1):this};U.toUnsigned=function(){return this.unsigned?this:ke(this.low,this.high,!0)};U.toBytes=function(e){return e?this.toBytesLE():this.toBytesBE()};U.toBytesLE=function(){var e=this.high,t=this.low;return[t&255,t>>>8&255,t>>>16&255,t>>>24,e&255,e>>>8&255,e>>>16&255,e>>>24]};U.toBytesBE=function(){var e=this.high,t=this.low;return[e>>>24,e>>>16&255,e>>>8&255,e&255,t>>>24,t>>>16&255,t>>>8&255,t&255]};Ie.fromBytes=function(e,t,o){return o?Ie.fromBytesLE(e,t):Ie.fromBytesBE(e,t)};Ie.fromBytesLE=function(e,t){return new Ie(e[0]|e[1]<<8|e[2]<<16|e[3]<<24,e[4]|e[5]<<8|e[6]<<16|e[7]<<24,t)};Ie.fromBytesBE=function(e,t){return new Ie(e[4]<<24|e[5]<<16|e[6]<<8|e[7],e[0]<<24|e[1]<<16|e[2]<<8|e[3],t)}});var Mg=Ct(()=>{});var Vg=Ct(()=>{});var Sy=Ct((Ty,rf)=>{(function(r,e,t){function o(a){var u=this,l=i();u.next=function(){var c=2091639*u.s0+u.c*23283064365386963e-26;return u.s0=u.s1,u.s1=u.s2,u.s2=c-(u.c=c|0)},u.c=1,u.s0=l(" "),u.s1=l(" "),u.s2=l(" "),u.s0-=l(a),u.s0<0&&(u.s0+=1),u.s1-=l(a),u.s1<0&&(u.s1+=1),u.s2-=l(a),u.s2<0&&(u.s2+=1),l=null}function n(a,u){return u.c=a.c,u.s0=a.s0,u.s1=a.s1,u.s2=a.s2,u}function s(a,u){var l=new o(a),c=u&&u.state,p=l.next;return p.int32=function(){return l.next()*4294967296|0},p.double=function(){return p()+(p()*2097152|0)*11102230246251565e-32},p.quick=p,c&&(typeof c=="object"&&n(c,l),p.state=function(){return n(l,{})}),p}function i(){var a=4022871197,u=function(l){l=String(l);for(var c=0;c<l.length;c++){a+=l.charCodeAt(c);var p=.02519603282416938*a;a=p>>>0,p-=a,p*=a,a=p>>>0,p-=a,a+=p*4294967296}return(a>>>0)*23283064365386963e-26};return u}e&&e.exports?e.exports=s:t&&t.amd?t(function(){return s}):this.alea=s})(Ty,typeof rf=="object"&&rf,typeof define=="function"&&define)});var Ny=Ct((Cy,of)=>{(function(r,e,t){function o(i){var a=this,u="";a.x=0,a.y=0,a.z=0,a.w=0,a.next=function(){var c=a.x^a.x<<11;return a.x=a.y,a.y=a.z,a.z=a.w,a.w^=a.w>>>19^c^c>>>8},i===(i|0)?a.x=i:u+=i;for(var l=0;l<u.length+64;l++)a.x^=u.charCodeAt(l)|0,a.next()}function n(i,a){return a.x=i.x,a.y=i.y,a.z=i.z,a.w=i.w,a}function s(i,a){var u=new o(i),l=a&&a.state,c=function(){return(u.next()>>>0)/4294967296};return c.double=function(){do var p=u.next()>>>11,m=(u.next()>>>0)/4294967296,f=(p+m)/(1<<21);while(f===0);return f},c.int32=u.next,c.quick=c,l&&(typeof l=="object"&&n(l,u),c.state=function(){return n(u,{})}),c}e&&e.exports?e.exports=s:t&&t.amd?t(function(){return s}):this.xor128=s})(Cy,typeof of=="object"&&of,typeof define=="function"&&define)});var Iy=Ct((Ey,nf)=>{(function(r,e,t){function o(i){var a=this,u="";a.next=function(){var c=a.x^a.x>>>2;return a.x=a.y,a.y=a.z,a.z=a.w,a.w=a.v,(a.d=a.d+362437|0)+(a.v=a.v^a.v<<4^(c^c<<1))|0},a.x=0,a.y=0,a.z=0,a.w=0,a.v=0,i===(i|0)?a.x=i:u+=i;for(var l=0;l<u.length+64;l++)a.x^=u.charCodeAt(l)|0,l==u.length&&(a.d=a.x<<10^a.x>>>4),a.next()}function n(i,a){return a.x=i.x,a.y=i.y,a.z=i.z,a.w=i.w,a.v=i.v,a.d=i.d,a}function s(i,a){var u=new o(i),l=a&&a.state,c=function(){return(u.next()>>>0)/4294967296};return c.double=function(){do var p=u.next()>>>11,m=(u.next()>>>0)/4294967296,f=(p+m)/(1<<21);while(f===0);return f},c.int32=u.next,c.quick=c,l&&(typeof l=="object"&&n(l,u),c.state=function(){return n(u,{})}),c}e&&e.exports?e.exports=s:t&&t.amd?t(function(){return s}):this.xorwow=s})(Ey,typeof nf=="object"&&nf,typeof define=="function"&&define)});var $y=Ct((ky,sf)=>{(function(r,e,t){function o(i){var a=this;a.next=function(){var l=a.x,c=a.i,p,m,f;return p=l[c],p^=p>>>7,m=p^p<<24,p=l[c+1&7],m^=p^p>>>10,p=l[c+3&7],m^=p^p>>>3,p=l[c+4&7],m^=p^p<<7,p=l[c+7&7],p=p^p<<13,m^=p^p<<9,l[c]=m,a.i=c+1&7,m};function u(l,c){var p,m,f=[];if(c===(c|0))m=f[0]=c;else for(c=""+c,p=0;p<c.length;++p)f[p&7]=f[p&7]<<15^c.charCodeAt(p)+f[p+1&7]<<13;for(;f.length<8;)f.push(0);for(p=0;p<8&&f[p]===0;++p);for(p==8?m=f[7]=-1:m=f[p],l.x=f,l.i=0,p=256;p>0;--p)l.next()}u(a,i)}function n(i,a){return a.x=i.x.slice(),a.i=i.i,a}function s(i,a){i==null&&(i=+new Date);var u=new o(i),l=a&&a.state,c=function(){return(u.next()>>>0)/4294967296};return c.double=function(){do var p=u.next()>>>11,m=(u.next()>>>0)/4294967296,f=(p+m)/(1<<21);while(f===0);return f},c.int32=u.next,c.quick=c,l&&(l.x&&n(l,u),c.state=function(){return n(u,{})}),c}e&&e.exports?e.exports=s:t&&t.amd?t(function(){return s}):this.xorshift7=s})(ky,typeof sf=="object"&&sf,typeof define=="function"&&define)});var Ay=Ct((Ry,af)=>{(function(r,e,t){function o(i){var a=this;a.next=function(){var l=a.w,c=a.X,p=a.i,m,f;return a.w=l=l+1640531527|0,f=c[p+34&127],m=c[p=p+1&127],f^=f<<13,m^=m<<17,f^=f>>>15,m^=m>>>12,f=c[p]=f^m,a.i=p,f+(l^l>>>16)|0};function u(l,c){var p,m,f,d,g,h=[],x=128;for(c===(c|0)?(m=c,c=null):(c=c+"\0",m=0,x=Math.max(x,c.length)),f=0,d=-32;d<x;++d)c&&(m^=c.charCodeAt((d+32)%c.length)),d===0&&(g=m),m^=m<<10,m^=m>>>15,m^=m<<4,m^=m>>>13,d>=0&&(g=g+1640531527|0,p=h[d&127]^=m+g,f=p==0?f+1:0);for(f>=128&&(h[(c&&c.length||0)&127]=-1),f=127,d=512;d>0;--d)m=h[f+34&127],p=h[f=f+1&127],m^=m<<13,p^=p<<17,m^=m>>>15,p^=p>>>12,h[f]=m^p;l.w=g,l.X=h,l.i=f}u(a,i)}function n(i,a){return a.i=i.i,a.w=i.w,a.X=i.X.slice(),a}function s(i,a){i==null&&(i=+new Date);var u=new o(i),l=a&&a.state,c=function(){return(u.next()>>>0)/4294967296};return c.double=function(){do var p=u.next()>>>11,m=(u.next()>>>0)/4294967296,f=(p+m)/(1<<21);while(f===0);return f},c.int32=u.next,c.quick=c,l&&(l.X&&n(l,u),c.state=function(){return n(u,{})}),c}e&&e.exports?e.exports=s:t&&t.amd?t(function(){return s}):this.xor4096=s})(Ry,typeof af=="object"&&af,typeof define=="function"&&define)});var Dy=Ct((_y,uf)=>{(function(r,e,t){function o(i){var a=this,u="";a.next=function(){var c=a.b,p=a.c,m=a.d,f=a.a;return c=c<<25^c>>>7^p,p=p-m|0,m=m<<24^m>>>8^f,f=f-c|0,a.b=c=c<<20^c>>>12^p,a.c=p=p-m|0,a.d=m<<16^p>>>16^f,a.a=f-c|0},a.a=0,a.b=0,a.c=-1640531527,a.d=1367130551,i===Math.floor(i)?(a.a=i/4294967296|0,a.b=i|0):u+=i;for(var l=0;l<u.length+20;l++)a.b^=u.charCodeAt(l)|0,a.next()}function n(i,a){return a.a=i.a,a.b=i.b,a.c=i.c,a.d=i.d,a}function s(i,a){var u=new o(i),l=a&&a.state,c=function(){return(u.next()>>>0)/4294967296};return c.double=function(){do var p=u.next()>>>11,m=(u.next()>>>0)/4294967296,f=(p+m)/(1<<21);while(f===0);return f},c.int32=u.next,c.quick=c,l&&(typeof l=="object"&&n(l,u),c.state=function(){return n(u,{})}),c}e&&e.exports?e.exports=s:t&&t.amd?t(function(){return s}):this.tychei=s})(_y,typeof uf=="object"&&uf,typeof define=="function"&&define)});var Oy=Ct(()=>{});var Py=Ct((Fy,Tl)=>{(function(r,e,t){var o=256,n=6,s=52,i="random",a=t.pow(o,n),u=t.pow(2,s),l=u*2,c=o-1,p;function m(N,E,k){var R=[];E=E==!0?{entropy:!0}:E||{};var A=h(g(E.entropy?[N,v(e)]:N??x(),3),R),_=new f(R),O=function(){for(var F=_.g(n),B=a,M=0;F<u;)F=(F+M)*o,B*=o,M=_.g(1);for(;F>=l;)F/=2,B/=2,M>>>=1;return(F+M)/B};return O.int32=function(){return _.g(4)|0},O.quick=function(){return _.g(4)/4294967296},O.double=O,h(v(_.S),e),(E.pass||k||function(F,B,M,z){return z&&(z.S&&d(z,_),F.state=function(){return d(_,{})}),M?(t[i]=F,B):F})(O,A,"global"in E?E.global:this==t,E.state)}function f(N){var E,k=N.length,R=this,A=0,_=R.i=R.j=0,O=R.S=[];for(k||(N=[k++]);A<o;)O[A]=A++;for(A=0;A<o;A++)O[A]=O[_=c&_+N[A%k]+(E=O[A])],O[_]=E;(R.g=function(F){for(var B,M=0,z=R.i,j=R.j,Z=R.S;F--;)B=Z[z=c&z+1],M=M*o+Z[c&(Z[z]=Z[j=c&j+B])+(Z[j]=B)];return R.i=z,R.j=j,M})(o)}function d(N,E){return E.i=N.i,E.j=N.j,E.S=N.S.slice(),E}function g(N,E){var k=[],R=typeof N,A;if(E&&R=="object")for(A in N)try{k.push(g(N[A],E-1))}catch{}return k.length?k:R=="string"?N:N+"\0"}function h(N,E){for(var k=N+"",R,A=0;A<k.length;)E[c&A]=c&(R^=E[c&A]*19)+k.charCodeAt(A++);return v(E)}function x(){try{var N;return p&&(N=p.randomBytes)?N=N(o):(N=new Uint8Array(o),(r.crypto||r.msCrypto).getRandomValues(N)),v(N)}catch{var E=r.navigator,k=E&&E.plugins;return[+new Date,r,k,r.screen,v(e)]}}function v(N){return String.fromCharCode.apply(0,N)}if(h(t.random(),e),typeof Tl=="object"&&Tl.exports){Tl.exports=m;try{p=Oy()}catch{}}else typeof define=="function"&&define.amd?define(function(){return m}):t["seed"+i]=m})(typeof self<"u"?self:Fy,[],Math)});var By=Ct((EQ,Ly)=>{var X$=Sy(),j$=Ny(),Y$=Iy(),Q$=$y(),Z$=Ay(),J$=Dy(),Mo=Py();Mo.alea=X$;Mo.xor128=j$;Mo.xorwow=Y$;Mo.xorshift7=Q$;Mo.xor4096=Z$;Mo.tychei=J$;Ly.exports=Mo});var bw=Ct((u0e,yw)=>{yw.exports={}});var Yw=Ci(Th());var Cs=class{constructor(e,t){this.backend=e,this.dataMover=t,this.data=new WeakMap,this.dataIdsCount=0}get(e){return this.data.has(e)||this.dataMover.moveData(this.backend,e),this.data.get(e)}set(e,t){this.dataIdsCount++,this.data.set(e,t)}has(e){return this.data.has(e)}delete(e){return this.dataIdsCount--,this.data.delete(e)}numDataIds(){return this.dataIdsCount}},bo=class{refCount(e){return Nt("refCount")}incRef(e){return Nt("incRef")}timerAvailable(){return!0}time(e){return Nt("time")}read(e){return Nt("read")}readSync(e){return Nt("readSync")}readToGPU(e,t){return Nt("readToGPU")}numDataIds(){return Nt("numDataIds")}disposeData(e,t){return Nt("disposeData")}write(e,t,o){return Nt("write")}move(e,t,o,n,s){return Nt("move")}createTensorFromGPUData(e,t,o){return Nt("createTensorFromGPUData")}memory(){return Nt("memory")}floatPrecision(){return Nt("floatPrecision")}epsilon(){return this.floatPrecision()===32?1e-7:1e-4}dispose(){return Nt("dispose")}};function Nt(r){throw new Error(`'${r}' not yet implemented or not found in the registry. This kernel may not be supported by the tfjs backend you have chosen`)}function Sh(r){let e=r.length,t=0;for(;e>0;)t=Math.random()*e|0,e--,Ni(r,e,t)}function JE(r,e){if(r.length!==e.length)throw new Error(`Array sizes must match to be shuffled together First array length was ${r.length}Second array length was ${e.length}`);let t=r.length,o=0;for(;t>0;)o=Math.random()*t|0,t--,Ni(r,t,o),Ni(e,t,o)}function un(r,e,t){return Math.max(r,Math.min(e,t))}function eI(r){return r%2===0?r:r+1}function Ni(r,e,t){let o=r[e];r[e]=r[t],r[t]=o}function tI(r){let e=0;for(let t=0;t<r.length;t++)e+=r[t];return e}function rI(r,e){let t=Math.random();return e*t+(1-t)*r}function oI(r,e){let t=0;for(let o=0;o<r.length;o++){let n=Number(r[o])-Number(e[o]);t+=n*n}return t}function C(r,e){if(!r)throw new Error(typeof e=="string"?e:e())}function $e(r,e,t=""){C(Et(r,e),()=>t+` Shapes ${r} and ${e} must match`)}function Bt(r){C(r!=null,()=>"The input to the tensor constructor must be a non-null value.")}function re(r){if(r.length===0)return 1;let e=r[0];for(let t=1;t<r.length;t++)e*=r[t];return e}function nI(r){return r.length===0}function fm(r,e){if(r===e)return!0;if(r==null||e==null||r.length!==e.length)return!1;for(let t=0;t<r.length;t++)if(r[t]!==null&&e[t]!==null&&r[t]!==e[t])return!1;return!0}function Et(r,e){if(r===e)return!0;if(r==null||e==null||r.length!==e.length)return!1;for(let t=0;t<r.length;t++)if(r[t]!==e[t])return!1;return!0}function Nr(r){return r%1===0}function sI(r){if(Math.tanh!=null)return Math.tanh(r);if(r===1/0)return 1;if(r===-1/0)return-1;{let e=Math.exp(2*r);return(e-1)/(e+1)}}function iI(r){let e=Math.ceil(Math.sqrt(r));return[e,Math.ceil(r/e)]}function aI(r){let e=new Uint32Array(r);for(let t=0;t<r;++t)e[t]=t;return Sh(e),e}function vo(r,e){return e<=r.length?r:r+" ".repeat(e-r.length)}function uI(r,e=n=>0,t,o){return new Promise((n,s)=>{let i=0,a=()=>{if(r()){n();return}i++;let u=e(i);if(t!=null&&i>=t){s();return}o!=null?o(a,u):setTimeout(a,u)};a()})}function lI(r,e){let t=1,o=-1;for(let s=0;s<r.length;++s)if(r[s]>=0)t*=r[s];else if(r[s]===-1){if(o!==-1)throw Error(`Shapes can only have 1 implicit size. Found -1 at dim ${o} and dim ${s}`);o=s}else if(r[s]<0)throw Error(`Shapes can not be < 0. Found ${r[s]} at dim ${s}`);if(o===-1){if(e>0&&e!==t)throw Error(`Size(${e}) must match the product of shape ${r}`);return r}if(t===0)throw Error(`Cannot infer the missing size in [${r}] when there are 0 elements`);if(e%t!==0)throw Error(`The implicit shape can't be a fractional number. Got ${e} / ${t}`);let n=r.slice();return n[o]=e/t,n}function zr(r,e){let t=e.length;return r=r==null?e.map((o,n)=>n):[].concat(r),C(r.every(o=>o>=-t&&o<t),()=>`All values in axis param must be in range [-${t}, ${t}) but got axis ${r}`),C(r.every(o=>Nr(o)),()=>`All values in axis param must be integers but got axis ${r}`),r.map(o=>o<0?t+o:o)}function dm(r,e){let t=[],o=[],n=e!=null&&Array.isArray(e)&&e.length===0,s=e==null||n?null:zr(e,r).sort(),i=0;for(let a=0;a<r.length;++a){if(s!=null){if(s[i]===a&&r[a]!==1)throw new Error(`Can't squeeze axis ${a} since its dim '${r[a]}' is not 1`);(s[i]==null||s[i]>a)&&r[a]===1&&(t.push(r[a]),o.push(a)),s[i]<=a&&i++}r[a]!==1&&(t.push(r[a]),o.push(a))}return{newShape:t,keptDims:o}}function hm(r,e){return Ei(r,e)}function Ei(r,e){let t=null;if(r==null||r==="float32")t=new Float32Array(e);else if(r==="int32")t=new Int32Array(e);else if(r==="bool")t=new Uint8Array(e);else if(r==="string")t=new Array(e);else throw new Error(`Unknown data type ${r}`);return t}function gm(r,e){for(let t=0;t<r.length;t++){let o=r[t];if(isNaN(o)||!isFinite(o))throw Error(`A tensor of type ${e} being uploaded contains ${o}.`)}}function xm(r){return r==="bool"||r==="complex64"||r==="float32"||r==="int32"||r==="string"}function cI(r,e){return!(e==="complex64"||e==="float32"&&r!=="complex64"||e==="int32"&&r!=="float32"&&r!=="complex64"||e==="bool"&&r==="bool")}function ln(r){if(r==="float32"||r==="int32")return 4;if(r==="complex64")return 8;if(r==="bool")return 1;throw new Error(`Unknown dtype ${r}`)}function ym(r){if(r==null)return 0;let e=0;return r.forEach(t=>e+=t.length),e}function cn(r){return typeof r=="string"||r instanceof String}function Ch(r){return typeof r=="boolean"}function Nh(r){return typeof r=="number"}function Wr(r){return Array.isArray(r)?Wr(r[0]):r instanceof Float32Array?"float32":r instanceof Int32Array||r instanceof Uint8Array||r instanceof Uint8ClampedArray?"int32":Nh(r)?"float32":cn(r)?"string":Ch(r)?"bool":"float32"}function pn(r){return!!(r&&r.constructor&&r.call&&r.apply)}function mn(r,e){for(let t=e;t<r;++t)if(r%t===0)return t;return r}function cr(r){let e=r.length;if(e<2)return[];let t=new Array(e-1);t[e-2]=r[e-1];for(let o=e-3;o>=0;--o)t[o]=t[o+1]*r[o+1];return t}function Eh(r,e,t,o=!1){let n=new Array;if(e.length===1){let s=e[0]*(o?2:1);for(let i=0;i<s;i++)n[i]=t[r+i]}else{let s=e[0],i=e.slice(1),a=i.reduce((u,l)=>u*l)*(o?2:1);for(let u=0;u<s;u++)n[u]=Eh(r+u*a,i,t,o)}return n}function wo(r,e,t=!1){if(r.length===0)return e[0];let o=r.reduce((n,s)=>n*s)*(t?2:1);if(o===0)return[];if(o!==e.length)throw new Error(`[${r}] does not match the input size ${e.length}${t?" for a complex tensor":""}.`);return Eh(0,r,e,t)}function pI(r,e){if(Array.isArray(r))return r;if(e==="float32")return r instanceof Float32Array?r:new Float32Array(r);if(e==="int32")return r instanceof Int32Array?r:new Int32Array(r);if(e==="bool"||e==="string")return Uint8Array.from(new Int32Array(r));throw new Error(`Unknown dtype ${e}`)}function Ns(r,e){let t=fn(r,e);for(let o=0;o<t.length;o++)t[o]=1;return t}function fn(r,e){if(e==null||e==="float32"||e==="complex64")return new Float32Array(r);if(e==="int32")return new Int32Array(r);if(e==="bool")return new Uint8Array(r);throw new Error(`Unknown data type ${e}`)}function mI(r,e){let t=r.reduce((o,n)=>o*n,1);if(e==null||e==="float32")return wo(r,new Float32Array(t));if(e==="int32")return wo(r,new Int32Array(t));if(e==="bool")return wo(r,new Uint8Array(t));throw new Error(`Unknown data type ${e}`)}function Ce(r){r.forEach(e=>{C(Number.isInteger(e)&&e>=0,()=>`Tensor must have a shape comprised of positive integers but got shape [${r}].`)})}function fI(r,e,t){if(e===0)return 0;if(e===1)return r[0];let o=r[r.length-1];for(let n=0;n<r.length-1;++n)o+=t[n]*r[n];return o}function dI(r,e,t){if(e===0)return[];if(e===1)return[r];let o=new Array(e);for(let n=0;n<o.length-1;++n)o[n]=Math.floor(r/t[n]),r-=o[n]*t[n];return o[o.length-1]=r,o}function To(r){return r&&r.then&&typeof r.then=="function"}var Ih="tfjsflags",Es=class{constructor(e){this.global=e,this.flags={},this.flagRegistry={},this.urlFlags={},this.getQueryParams=gI,this.populateURLFlags()}setPlatform(e,t){this.platform!=null&&($().getBool("IS_TEST")||$().getBool("PROD")||console.warn(`Platform ${this.platformName} has already been set. Overwriting the platform with ${e}.`)),this.platformName=e,this.platform=t}registerFlag(e,t,o){if(this.flagRegistry[e]={evaluationFn:t,setHook:o},this.urlFlags[e]!=null){let n=this.urlFlags[e];$().getBool("IS_TEST")||$().getBool("PROD")||console.warn(`Setting feature override from URL ${e}: ${n}.`),this.set(e,n)}}async getAsync(e){return e in this.flags?this.flags[e]:(this.flags[e]=await this.evaluateFlag(e),this.flags[e])}get(e){if(e in this.flags)return this.flags[e];let t=this.evaluateFlag(e);if(To(t))throw new Error(`Flag ${e} cannot be synchronously evaluated. Please use getAsync() instead.`);return this.flags[e]=t,this.flags[e]}getNumber(e){return this.get(e)}getBool(e){return this.get(e)}getString(e){return this.get(e)}getFlags(){return this.flags}get features(){return this.flags}set(e,t){if(this.flagRegistry[e]==null)throw new Error(`Cannot set flag ${e} as it has not been registered.`);this.flags[e]=t,this.flagRegistry[e].setHook!=null&&this.flagRegistry[e].setHook(t)}evaluateFlag(e){if(this.flagRegistry[e]==null)throw new Error(`Cannot evaluate flag '${e}': no evaluation function found.`);return this.flagRegistry[e].evaluationFn()}setFlags(e){this.flags=Object.assign({},e)}reset(){this.flags={},this.urlFlags={},this.populateURLFlags()}populateURLFlags(){if(typeof this.global>"u"||typeof this.global.location>"u"||typeof this.global.location.search>"u")return;let e=this.getQueryParams(this.global.location.search);Ih in e&&e[Ih].split(",").forEach(o=>{let[n,s]=o.split(":");this.urlFlags[n]=yI(n,s)})}};function gI(r){let e={};return r.replace(/[?&]([^=?&]+)(?:=([^&]*))?/g,(t,...o)=>(xI(e,o[0],o[1]),o.join("="))),e}function xI(r,e,t){r[decodeURIComponent(e)]=decodeURIComponent(t||"")}function yI(r,e){let t=e.toLowerCase();return t==="true"||t==="false"?t==="true":`${+t}`===t?+t:e}function $(){return bm}var bm=null;function kh(r){bm=r}var wm;function vm(){if(wm==null){let r;if(typeof window<"u")r=window;else if(typeof global<"u")r=global;else if(typeof process<"u")r=process;else if(typeof self<"u")r=self;else throw new Error("Could not find a global object");wm=r}return wm}function bI(){let r=vm();return r._tfGlobals==null&&(r._tfGlobals=new Map),r._tfGlobals}function Is(r,e){let t=bI();if(t.has(r))return t.get(r);{let o=e();return t.set(r,o),t.get(r)}}var Ii="Acos",ki="Acosh";var $i="AddN";var Ri="ArgMax",Ai="ArgMin",_i="Asin",Di="Asinh",Oi="Atan",Fi="Atanh",Pi="Atan2",Li="AvgPool",$h="AvgPoolGrad",Bi="AvgPool3D",Rh="AvgPool3DGrad",Mi="BatchMatMul",Vi="BatchToSpaceND",Ui="Bincount",dn="BitwiseAnd";var Gi="BroadcastArgs",So="Cast",hn="Ceil",zi="ClipByValue",ks="Complex",Wi="ComplexAbs",Hi="Concat",Ki="Conv2D",qi="Conv2DBackpropFilter",Xi="Conv2DBackpropInput",ji="Conv3D",Ah="Conv3DBackpropFilterV2",Yi="Conv3DBackpropInputV2";var Qi="Cosh",Zi="Cumprod",Ji="Cumsum",ea="CropAndResize",ta="DenseBincount",ra="DepthToSpace",oa="DepthwiseConv2dNative",na="DepthwiseConv2dNativeBackpropFilter",sa="DepthwiseConv2dNativeBackpropInput",ia="Diag",aa="Dilation2D";var Tm="Draw",ua="RealDiv",la="Einsum";var _h="EluGrad";var gn="Equal";var ca="ExpandDims",xn="Expm1";var pa="Fill",ma="FlipLeftRight",yn="Floor",bn="FloorDiv",fa="FusedBatchNorm",da="GatherV2",ha="GatherNd",wn="Greater",vn="GreaterEqual",Co="Identity",ga="IFFT",xa="Imag",ya="IsFinite",ba="IsInf",wa="IsNan",va="LeakyRelu",Tn="Less",Sn="LessEqual",Ta="LinSpace";var Sa="Log1p",Ca="LogicalAnd",Na="LogicalNot",Ea="LogicalOr";var Dh="LRNGrad";var Cn="Maximum",Ia="MaxPool",Oh="MaxPoolGrad",ka="MaxPool3D",Fh="MaxPool3DGrad",$a="MaxPoolWithArgmax",Ra="Mean";var Nn="Minimum",Aa="MirrorPad";var _a="Multinomial",En="Multiply";var In="NotEqual",Da="NonMaxSuppressionV3",Oa="NonMaxSuppressionV4",Fa="NonMaxSuppressionV5",Pa="OnesLike",La="OneHot",Ba="Pack",Ma="PadV2";var Va="Prelu",$s="Prod",Ua="RaggedGather",Ga="RaggedRange",za="RaggedTensorToTensor",Wa="Range",Rs="Real",Ha="Reciprocal",Ka="Relu",qa="Reshape",Xa="ResizeNearestNeighbor",Ph="ResizeNearestNeighborGrad",ja="ResizeBilinear",Lh="ResizeBilinearGrad",Ya="Relu6",Qa="Reverse",Za="Round",kn="Rsqrt",Ja="ScatterNd",eu="TensorScatterUpdate",tu="SearchSorted",ru="Select",ou="Selu",As="Slice";var nu="Sinh",su="Sign",$n="Sigmoid",iu="Softplus",Rn="Sqrt";var au="SpaceToBatchND",uu="SplitV",lu="Softmax",cu="SparseFillEmptyRows",pu="SparseReshape",mu="SparseSegmentMean",fu="SparseSegmentSum",du="SparseToDense",An="SquaredDifference",Bh="Square",_n="StaticRegexReplace",hu="StridedSlice",gu="StringNGrams",xu="StringSplit",yu="StringToHashBucketFast";var bu="Tanh",Dn="Tile",wu="TopK",vu="Transform",On="Transpose",Tu="Unique",Su="Unpack",Cu="UnsortedSegmentSum";var Nu="ZerosLike",Eu="Step",_s="FromPixels",Iu="RotateWithOffset",Ds="_FusedMatMul",Os="FusedConv2D",Fs="FusedDepthwiseConv2D";function Er(...r){$().getBool("IS_TEST")||$().getBool("PROD")||console.warn(...r)}function wI(...r){$().getBool("IS_TEST")||$().getBool("PROD")||console.log(...r)}var ku=Is("kernelRegistry",()=>new Map),vI=Is("gradRegistry",()=>new Map);function Fn(r,e){let t=Uh(r,e);return ku.get(t)}function Sm(r){return vI.get(r)}function Cm(r){let e=ku.entries(),t=[];for(;;){let{done:o,value:n}=e.next();if(o)break;let[s,i]=n,[a]=s.split("_");a===r&&t.push(i)}return t}function Vh(r){let{kernelName:e,backendName:t}=r,o=Uh(e,t);ku.has(o)&&Er(`The kernel '${e}' for backend '${t}' is already registered`),ku.set(o,r)}function Uh(r,e){return`${e}_${r}`}var T={};ye(T,{arraysEqual:()=>Et,arraysEqualWithNull:()=>fm,assert:()=>C,assertNonNegativeIntegerDimensions:()=>Ce,assertNonNull:()=>Bt,assertShapesMatch:()=>$e,bytesFromStringArray:()=>ym,bytesPerElement:()=>ln,checkConversionForErrors:()=>gm,clamp:()=>un,computeStrides:()=>cr,convertBackendValuesAndArrayBuffer:()=>pI,createScalarValue:()=>kI,createShuffledIndices:()=>aI,decodeString:()=>Vn,distSquared:()=>oI,encodeString:()=>Mn,fetch:()=>RI,fingerPrint64:()=>II,flatten:()=>Kr,getArrayFromDType:()=>Ei,getTypedArrayFromDType:()=>hm,hasEncodingLoss:()=>cI,hexToLong:()=>Ps,indexToLoc:()=>dI,inferDtype:()=>Wr,inferFromImplicitShape:()=>lI,isBoolean:()=>Ch,isFunction:()=>pn,isInt:()=>Nr,isNumber:()=>Nh,isPromise:()=>To,isScalarShape:()=>nI,isString:()=>cn,isTypedArray:()=>Ye,isValidDtype:()=>xm,locToIndex:()=>fI,makeOnesTypedArray:()=>Ns,makeZerosNestedTypedArray:()=>mI,makeZerosTypedArray:()=>fn,nearestDivisor:()=>mn,nearestLargerEven:()=>eI,now:()=>$o,parseAxisParam:()=>zr,randUniform:()=>rI,repeatedTry:()=>uI,rightPad:()=>vo,shuffle:()=>Sh,shuffleCombo:()=>JE,sizeFromShape:()=>re,sizeToSquarishShape:()=>iI,squeezeShape:()=>dm,sum:()=>tI,swap:()=>Ni,tanh:()=>sI,toNestedArray:()=>wo,toTypedArray:()=>Bn});function $u(r){return r instanceof Float32Array||r instanceof Int32Array||r instanceof Uint8Array||r instanceof Uint8ClampedArray}var km=Ci(Zh());var ko=km.default||km;function Ps(r){return ko.fromString(r,!0,16)}var eg=Ps("c3a5c85c97cb3127"),Io=Ps("b492b66fbe98f273"),tt=Ps("9ae16a3b2f90404f");function Im(r){return r.xor(r.shru(47))}function tg(r,e,t){let o=r.slice(e,e+t);return ko.fromBytes(Array.from(o),!0,!0)}function Ne(r,e){return tg(r,e,8)}function Jh(r,e){return tg(r,e,4)}function Ge(r,e){return e===0?r:r.shru(e).or(r.shl(64-e))}function Hr(r,e,t=Ps("9ddfea08eb382d69")){let o=r.xor(e).mul(t);o=o.xor(o.shru(47));let n=e.xor(o).mul(t);return n=n.xor(n.shru(47)),n=n.mul(t),n}function SI(r,e,t,o,n,s){n=n.add(r),s=Ge(s.add(n).add(o),21);let i=n;return n=n.add(e),n=n.add(t),s=s.add(Ge(n,44)),[n.add(o),s.add(i)]}function Au(r,e,t,o){return SI(Ne(r,e),Ne(r,e+8),Ne(r,e+16),Ne(r,e+24),t,o)}function CI(r,e=r.length){if(e>=8){let t=tt.add(e*2),o=Ne(r,0).add(tt),n=Ne(r,e-8),s=Ge(n,37).mul(t).add(o),i=Ge(o,25).add(n).mul(t);return Hr(s,i,t)}if(e>=4){let t=tt.add(e*2),o=Jh(r,0);return Hr(o.shl(3).add(e),Jh(r,e-4),t)}if(e>0){let t=r[0],o=r[e>>1],n=r[e-1],s=t+(o<<8),i=e+(n<<2);return Im(tt.mul(s).xor(eg.mul(i))).mul(tt)}return tt}function NI(r,e=r.length){let t=tt.add(e*2),o=Ne(r,0).mul(Io),n=Ne(r,8),s=Ne(r,e-8).mul(t),i=Ne(r,e-16).mul(tt);return Hr(Ge(o.add(n),43).add(Ge(s,30)).add(i),o.add(Ge(n.add(tt),18)).add(s),t)}function EI(r,e=r.length){let t=tt.add(e*2),o=Ne(r,0).mul(tt),n=Ne(r,8),s=Ne(r,e-8).mul(t),i=Ne(r,e-16).mul(tt),a=Ge(o.add(n),43).add(Ge(s,30)).add(i),u=Hr(a,o.add(Ge(n.add(tt),18)).add(s),t),l=Ne(r,16).mul(t),c=Ne(r,24),p=a.add(Ne(r,e-32)).mul(t),m=u.add(Ne(r,e-24)).mul(t);return Hr(Ge(l.add(c),43).add(Ge(p,30)).add(m),l.add(Ge(c.add(o),18)).add(p),t)}function II(r,e=r.length){let t=ko.fromNumber(81,!0);if(e<=32)return e<=16?CI(r,e):NI(r,e);if(e<=64)return EI(r,e);let o=t,n=t.mul(Io).add(113),s=Im(n.mul(tt).add(113)).mul(tt),i=[ko.UZERO,ko.UZERO],a=[ko.UZERO,ko.UZERO];o=o.mul(tt).add(Ne(r,0));let u=0,l=(e-1>>6)*64,c=l+(e-1&63)-63;do o=Ge(o.add(n).add(i[0]).add(Ne(r,u+8)),37).mul(Io),n=Ge(n.add(i[1]).add(Ne(r,u+48)),42).mul(Io),o=o.xor(a[1]),n=n.add(i[0]).add(Ne(r,u+40)),s=Ge(s.add(a[0]),33).mul(Io),i=Au(r,u,i[1].mul(Io),o.add(a[0])),a=Au(r,u+32,s.add(a[1]),n.add(Ne(r,u+16))),[s,o]=[o,s],u+=64;while(u!==l);let p=Io.add(s.and(255).shl(1));return u=c,a[0]=a[0].add(e-1&63),i[0]=i[0].add(a[0]),a[0]=a[0].add(i[0]),o=Ge(o.add(n).add(i[0]).add(Ne(r,u+8)),37).mul(p),n=Ge(n.add(i[1]).add(Ne(r,u+48)),42).mul(p),o=o.xor(a[1].mul(9)),n=n.add(i[0].mul(9).add(Ne(r,u+40))),s=Ge(s.add(a[0]),33).mul(p),i=Au(r,u,i[1].mul(p),o.add(a[0])),a=Au(r,u+32,s.add(a[1]),n.add(Ne(r,u+16))),[s,o]=[o,s],Hr(Hr(i[0],a[0],p).add(Im(n).mul(eg)).add(s),Hr(i[1],a[1],p).add(o),p)}function kI(r,e){return e==="string"?Mn(r):Bn([r],e)}function $I(r,e){return r instanceof Float32Array&&e==="float32"||r instanceof Int32Array&&e==="int32"||r instanceof Uint8Array&&e==="bool"}function Bn(r,e){if(e==="string")throw new Error("Cannot convert a string[] to a TypedArray");if(Array.isArray(r)&&(r=Kr(r)),$().getBool("DEBUG")&&gm(r,e),$I(r,e))return r;if(e==null||e==="float32"||e==="complex64")return new Float32Array(r);if(e==="int32")return new Int32Array(r);if(e==="bool"){let t=new Uint8Array(r.length);for(let o=0;o<t.length;++o)Math.round(r[o])!==0&&(t[o]=1);return t}else throw new Error(`Unknown data type ${e}`)}function $o(){return $().platform.now()}function RI(r,e){return $().platform.fetch(r,e)}function Mn(r,e="utf-8"){return e=e||"utf-8",$().platform.encode(r,e)}function Vn(r,e="utf-8"){return e=e||"utf-8",$().platform.decode(r,e)}function Ye(r){return $().platform.isTypedArray!=null?$().platform.isTypedArray(r):$u(r)}function Kr(r,e=[],t=!1){if(e==null&&(e=[]),typeof r=="boolean"||typeof r=="number"||typeof r=="string"||To(r)||r==null||Ye(r)&&t)e.push(r);else if(Array.isArray(r)||Ye(r))for(let o=0;o<r.length;++o)Kr(r[o],e,t);else{let o=-1;for(let n of Object.keys(r))/^([1-9]+[0-9]*|0)$/.test(n)&&(o=Math.max(o,Number(n)));for(let n=0;n<=o;n++)Kr(r[n],e,t)}return e}var _u=class{constructor(e,t){this.backendTimer=e,this.logger=t,t==null&&(this.logger=new $m)}profileKernel(e,t,o){let n,s=()=>{n=o()},i,a=$o();if(this.backendTimer.timerAvailable())i=this.backendTimer.time(s);else{s();for(let l of n)l.dataSync();i=Promise.resolve({kernelMs:$o()-a})}if($().getBool("CHECK_COMPUTATION_FOR_ERRORS"))for(let l=0;l<n.length;l++){let c=n[l];c.data().then(p=>{AI(p,c.dtype,e)})}return{kernelName:e,outputs:n,inputs:t,timeMs:i.then(l=>l.kernelMs),extraInfo:i.then(l=>l.getExtraProfileInfo!=null?l.getExtraProfileInfo():"")}}logKernelProfile(e){let{kernelName:t,outputs:o,timeMs:n,inputs:s,extraInfo:i}=e;o.forEach(a=>{Promise.all([a.data(),n,i]).then(u=>{this.logger.logKernelProfile(t,a,u[0],u[1],s,u[2])})})}};function AI(r,e,t){if(e!=="float32")return!1;for(let o=0;o<r.length;o++){let n=r[o];if(isNaN(n)||!isFinite(n))return console.warn(`Found ${n} in the result of '${t}'`),!0}return!1}var $m=class{logKernelProfile(e,t,o,n,s,i){let a=typeof n=="number"?vo(`${n}ms`,9):n.error,u=vo(e,25),l=t.rank,c=t.size,p=vo(t.shape.toString(),14),m="";for(let f in s){let d=s[f];if(d!=null){let g=d.shape||t.shape,h=g.length;m+=`${f}: ${h}D ${h>0?g:""} `}}console.log(`%c${u}	%c${a}	%c${l}D ${p}	%c${c}	%c${m}	%c${i}`,"font-weight:bold","color:red","color:blue","color: orange","color: green","color: steelblue")}};function rg(r,e,t){let o={},n={};for(let u=0;u<e.length;u++)o[e[u].id]=!0;for(let u=0;u<r.length;u++){let l=r[u],c=l.inputs;for(let p in c){let m=c[p],f=!1;for(let d=0;d<e.length;d++)if(o[m.id]){l.outputs.forEach(g=>o[g.id]=!0),f=!0,n[l.id]=!0;break}if(f)break}}let s={};s[t.id]=!0;let i={};for(let u=r.length-1;u>=0;u--){let l=r[u],c=l.inputs;for(let p=0;p<l.outputs.length;p++)if(s[l.outputs[p].id]){for(let m in c)s[c[m].id]=!0,i[l.id]=!0;break}}let a=[];for(let u=0;u<r.length;u++){let l=r[u];if(n[l.id]&&i[l.id]){let c={};for(let m in l.inputs){let f=l.inputs[m];o[f.id]&&(c[m]=f)}let p=Object.assign({},l);p.inputs=c,p.outputs=l.outputs,a.push(p)}}return a}function og(r,e,t,o){for(let n=e.length-1;n>=0;n--){let s=e[n],i=[];if(s.outputs.forEach(u=>{let l=r[u.id];l!=null?i.push(l):i.push(null)}),s.gradient==null)throw new Error(`Cannot compute gradient: gradient function not found for ${s.kernelName}.`);let a=s.gradient(i);for(let u in s.inputs){if(!(u in a))throw new Error(`Cannot backprop through input ${u}. Available gradients found: ${Object.keys(a)}.`);let l=t(()=>a[u]());if(l.dtype!=="float32")throw new Error(`Error in gradient for op ${s.kernelName}. The gradient of input ${u} must have 'float32' dtype, but has '${l.dtype}'`);let c=s.inputs[u];if(!Et(l.shape,c.shape))throw new Error(`Error in gradient for op ${s.kernelName}. The gradient of input '${u}' has shape '${l.shape}', which does not match the shape of the input '${c.shape}'`);if(r[c.id]==null)r[c.id]=l;else{let p=r[c.id];r[c.id]=o(p,l),p.dispose()}}}}var ng=20,Ls=3,Rm=7;function sg(r,e,t,o){let n=cr(e),s=_I(r,e,t,n),i=e.length,a=Du(r,e,t,n,s),u=["Tensor"];return o&&(u.push(`  dtype: ${t}`),u.push(`  rank: ${i}`),u.push(`  shape: [${e}]`),u.push("  values:")),u.push(a.map(l=>"    "+l).join(`
`)),u.join(`
`)}function _I(r,e,t,o){let n=re(e),s=o[o.length-1],i=new Array(s).fill(0),a=e.length,u=t==="complex64"?Ms(r):r;if(a>1)for(let l=0;l<n/s;l++){let c=l*s;for(let p=0;p<s;p++)i[p]=Math.max(i[p],Bs(u[c+p],0,t).length)}return i}function Bs(r,e,t){let o;return Array.isArray(r)?o=`${parseFloat(r[0].toFixed(Rm))} + ${parseFloat(r[1].toFixed(Rm))}j`:cn(r)?o=`'${r}'`:t==="bool"?o=ig(r):o=parseFloat(r.toFixed(Rm)).toString(),vo(o,e)}function ig(r){return r===0?"false":"true"}function Du(r,e,t,o,n,s=!0){let i=t==="complex64"?2:1,a=e[0],u=e.length;if(u===0){if(t==="complex64"){let g=Ms(r);return[Bs(g[0],0,t)]}return t==="bool"?[ig(r[0])]:[r[0].toString()]}if(u===1){if(a>ng){let h=Ls*i,x=Array.from(r.slice(0,h)),v=Array.from(r.slice((a-Ls)*i,a*i));return t==="complex64"&&(x=Ms(x),v=Ms(v)),["["+x.map((N,E)=>Bs(N,n[E],t)).join(", ")+", ..., "+v.map((N,E)=>Bs(N,n[a-Ls+E],t)).join(", ")+"]"]}return["["+(t==="complex64"?Ms(r):Array.from(r)).map((h,x)=>Bs(h,n[x],t)).join(", ")+"]"]}let l=e.slice(1),c=o.slice(1),p=o[0]*i,m=[];if(a>ng){for(let g=0;g<Ls;g++){let h=g*p,x=h+p;m.push(...Du(r.slice(h,x),l,t,c,n,!1))}m.push("...");for(let g=a-Ls;g<a;g++){let h=g*p,x=h+p;m.push(...Du(r.slice(h,x),l,t,c,n,g===a-1))}}else for(let g=0;g<a;g++){let h=g*p,x=h+p;m.push(...Du(r.slice(h,x),l,t,c,n,g===a-1))}let f=u===2?",":"";m[0]="["+(a>0?m[0]+f:"");for(let g=1;g<m.length-1;g++)m[g]=" "+m[g]+f;let d=`,
`;for(let g=2;g<u;g++)d+=`
`;return m[m.length-1]=" "+m[m.length-1]+"]"+(s?"":d),m}function Ms(r){let e=[];for(let t=0;t<r.length;t+=2)e.push([r[t],r[t+1]]);return e}var Mt=class{constructor(e,t,o){if(this.dtype=t,this.shape=e.slice(),this.size=re(e),o!=null){let n=o.length;C(n===this.size,()=>`Length of values '${n}' does not match the size inferred by the shape '${this.size}'.`)}if(t==="complex64")throw new Error("complex64 dtype TensorBuffers are not supported. Please create a TensorBuffer for the real and imaginary parts separately and call tf.complex(real, imag).");this.values=o||Ei(t,this.size),this.strides=cr(e)}set(e,...t){t.length===0&&(t=[0]),C(t.length===this.rank,()=>`The number of provided coordinates (${t.length}) must match the rank (${this.rank})`);let o=this.locToIndex(t);this.values[o]=e}get(...e){e.length===0&&(e=[0]);let t=0;for(let n of e){if(n<0||n>=this.shape[t]){let s=`Requested out of range element at ${e}.   Buffer shape=${this.shape}`;throw new Error(s)}t++}let o=e[e.length-1];for(let n=0;n<e.length-1;++n)o+=this.strides[n]*e[n];return this.values[o]}locToIndex(e){if(this.rank===0)return 0;if(this.rank===1)return e[0];let t=e[e.length-1];for(let o=0;o<e.length-1;++o)t+=this.strides[o]*e[o];return t}indexToLoc(e){if(this.rank===0)return[];if(this.rank===1)return[e];let t=new Array(this.shape.length);for(let o=0;o<t.length-1;++o)t[o]=Math.floor(e/this.strides[o]),e-=t[o]*this.strides[o];return t[t.length-1]=e,t}get rank(){return this.shape.length}toTensor(){return tr().makeTensor(this.values,this.shape,this.dtype)}},tr=null,Un=null,DI=null;function ag(r){tr=r}function ug(r){Un=r}function lg(r){DI=r}var de=class{constructor(e,t,o,n){this.kept=!1,this.isDisposedInternal=!1,this.shape=e.slice(),this.dtype=t||"float32",this.size=re(e),this.strides=cr(e),this.dataId=o,this.id=n,this.rankType=this.rank<5?this.rank.toString():"higher"}get rank(){return this.shape.length}async buffer(){let e=await this.data();return Un.buffer(this.shape,this.dtype,e)}bufferSync(){return Un.buffer(this.shape,this.dtype,this.dataSync())}async array(){let e=await this.data();return wo(this.shape,e,this.dtype==="complex64")}arraySync(){return wo(this.shape,this.dataSync(),this.dtype==="complex64")}async data(){this.throwIfDisposed();let e=tr().read(this.dataId);if(this.dtype==="string"){let t=await e;try{return t.map(o=>Vn(o))}catch{throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}}return e}dataToGPU(e){return this.throwIfDisposed(),tr().readToGPU(this.dataId,e)}dataSync(){this.throwIfDisposed();let e=tr().readSync(this.dataId);if(this.dtype==="string")try{return e.map(t=>Vn(t))}catch{throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}return e}async bytes(){this.throwIfDisposed();let e=await tr().read(this.dataId);return this.dtype==="string"?e:new Uint8Array(e.buffer)}dispose(){this.isDisposed||(this.kerasMask&&this.kerasMask.dispose(),tr().disposeTensor(this),this.isDisposedInternal=!0)}get isDisposed(){return this.isDisposedInternal}throwIfDisposed(){if(this.isDisposed)throw new Error("Tensor is disposed.")}print(e=!1){return Un.print(this,e)}clone(){return this.throwIfDisposed(),Un.clone(this)}toString(e=!1){let t=this.dataSync();return sg(t,this.shape,this.dtype,e)}cast(e){return this.throwIfDisposed(),Un.cast(this,e)}variable(e=!0,t,o){return this.throwIfDisposed(),tr().makeVariable(this,e,t,o)}};Object.defineProperty(de,Symbol.hasInstance,{value:r=>!!r&&r.data!=null&&r.dataSync!=null&&r.throwIfDisposed!=null});function Am(){return Is("Tensor",()=>de)}Am();var Ir=class extends de{constructor(e,t,o,n){super(e.shape,e.dtype,e.dataId,n),this.trainable=t,this.name=o}assign(e){if(e.dtype!==this.dtype)throw new Error(`dtype of the new value (${e.dtype}) and previous value (${this.dtype}) must match`);if(!Et(e.shape,this.shape))throw new Error(`shape of the new value (${e.shape}) and previous value (${this.shape}) must match`);tr().disposeTensor(this),this.dataId=e.dataId,tr().incRef(this,null)}dispose(){tr().disposeVariable(this),this.isDisposedInternal=!0}};Object.defineProperty(Ir,Symbol.hasInstance,{value:r=>r instanceof de&&r.assign!=null&&r.assign instanceof Function});var _m;(function(r){r.R0="R0",r.R1="R1",r.R2="R2",r.R3="R3",r.R4="R4",r.R5="R5",r.R6="R6"})(_m||(_m={}));var Dm;(function(r){r.float32="float32",r.int32="int32",r.bool="int32",r.complex64="complex64"})(Dm||(Dm={}));var Om;(function(r){r.float32="float32",r.int32="int32",r.bool="bool",r.complex64="complex64"})(Om||(Om={}));var Fm;(function(r){r.float32="float32",r.int32="float32",r.bool="float32",r.complex64="complex64"})(Fm||(Fm={}));var Pm;(function(r){r.float32="complex64",r.int32="complex64",r.bool="complex64",r.complex64="complex64"})(Pm||(Pm={}));var OI={float32:Fm,int32:Dm,bool:Om,complex64:Pm};function Qe(r,e){if(r==="string"||e==="string"){if(r==="string"&&e==="string")return"string";throw new Error(`Can not upcast ${r} with ${e}`)}return OI[r][e]}function Ro(r){return Qe(r,"int32")}function Ou(r){return r!=null&&typeof r=="object"&&"texture"in r&&r.texture instanceof WebGLTexture}function Fu(r){return typeof GPUBuffer<"u"&&r!=null&&typeof r=="object"&&"buffer"in r&&r.buffer instanceof GPUBuffer}function te(r,e){if(r.dtype===e.dtype)return[r,e];let t=Qe(r.dtype,e.dtype);return[r.cast(t),e.cast(t)]}function cg(r,e){C(r.dtype===e.dtype,()=>`The dtypes of the first(${r.dtype}) and second(${e.dtype}) input must match`)}function Pu(r){let e=[];return pg(r,e,new Set),e}function pg(r,e,t){if(r==null)return;if(r instanceof de){e.push(r);return}if(!FI(r))return;let o=r;for(let n in o){let s=o[n];t.has(s)||(t.add(s),pg(s,e,t))}}function FI(r){return Array.isArray(r)||typeof r=="object"}function Lm(r){return r.kernelName!=null}var Lu=class{constructor(){this.registeredVariables={},this.nextTapeNodeId=0,this.numBytes=0,this.numTensors=0,this.numStringTensors=0,this.numDataBuffers=0,this.gradientDepth=0,this.kernelDepth=0,this.scopeStack=[],this.numDataMovesStack=[],this.nextScopeId=0,this.tensorInfo=new WeakMap,this.profiling=!1,this.activeProfile={newBytes:0,newTensors:0,peakBytes:0,kernels:[],result:null,get kernelNames(){return Array.from(new Set(this.kernels.map(e=>e.name)))}}}dispose(){for(let e in this.registeredVariables)this.registeredVariables[e].dispose()}},Vs=class r{constructor(e){this.ENV=e,this.registry={},this.registryFactory={},this.pendingBackendInitId=0,this.state=new Lu}async ready(){if(this.pendingBackendInit!=null)return this.pendingBackendInit.then(()=>{});if(this.backendInstance!=null)return;let e=this.getSortedBackends();for(let t=0;t<e.length;t++){let o=e[t];if(await this.initializeBackend(o).success){await this.setBackend(o);return}}throw new Error("Could not initialize any backends, all backend initializations failed.")}get backend(){if(this.pendingBackendInit!=null)throw new Error(`Backend '${this.backendName}' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods`);if(this.backendInstance==null){let{name:e,asyncInit:t}=this.initializeBackendsAndReturnBest();if(t)throw new Error(`The highest priority backend '${e}' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods`);this.setBackend(e)}return this.backendInstance}backendNames(){return Object.keys(this.registryFactory)}findBackend(e){if(!(e in this.registry))if(e in this.registryFactory){let{asyncInit:t}=this.initializeBackend(e);if(t)return null}else return null;return this.registry[e]}findBackendFactory(e){return e in this.registryFactory?this.registryFactory[e].factory:null}registerBackend(e,t,o=1){return e in this.registryFactory?(Er(`${e} backend was already registered. Reusing existing backend factory.`),!1):(this.registryFactory[e]={factory:t,priority:o},!0)}async setBackend(e){if(this.registryFactory[e]==null)throw new Error(`Backend name '${e}' not found in registry`);if(this.backendName=e,this.registry[e]==null){this.backendInstance=null;let{success:t,asyncInit:o}=this.initializeBackend(e);if(!(o?await t:t))return!1}return this.backendInstance=this.registry[e],this.setupRegisteredKernels(),this.profiler=new _u(this.backendInstance),!0}setupRegisteredKernels(){Cm(this.backendName).forEach(t=>{t.setupFunc!=null&&t.setupFunc(this.backendInstance)})}disposeRegisteredKernels(e){Cm(e).forEach(o=>{o.disposeFunc!=null&&o.disposeFunc(this.registry[e])})}initializeBackend(e){let t=this.registryFactory[e];if(t==null)throw new Error(`Cannot initialize backend ${e}, no registration found.`);try{let o=t.factory();if(o&&!(o instanceof bo)&&typeof o.then=="function"){let n=++this.pendingBackendInitId,s=o.then(i=>n<this.pendingBackendInitId?!1:(this.registry[e]=i,this.pendingBackendInit=null,!0)).catch(i=>(n<this.pendingBackendInitId||(this.pendingBackendInit=null,Er(`Initialization of backend ${e} failed`),Er(i.stack||i.message)),!1));return this.pendingBackendInit=s,{success:s,asyncInit:!0}}else return this.registry[e]=o,{success:!0,asyncInit:!1}}catch(o){return Er(`Initialization of backend ${e} failed`),Er(o.stack||o.message),{success:!1,asyncInit:!1}}}removeBackend(e){if(!(e in this.registryFactory))throw new Error(`${e} backend not found in registry`);this.backendName===e&&this.pendingBackendInit!=null&&this.pendingBackendInitId++,e in this.registry&&(this.disposeRegisteredKernels(e),this.registry[e].dispose(),delete this.registry[e]),delete this.registryFactory[e],this.backendName===e&&(this.pendingBackendInit=null,this.backendName=null,this.backendInstance=null)}getSortedBackends(){if(Object.keys(this.registryFactory).length===0)throw new Error("No backend found in registry.");return Object.keys(this.registryFactory).sort((e,t)=>this.registryFactory[t].priority-this.registryFactory[e].priority)}initializeBackendsAndReturnBest(){let e=this.getSortedBackends();for(let t=0;t<e.length;t++){let o=e[t],{success:n,asyncInit:s}=this.initializeBackend(o);if(s||n)return{name:o,asyncInit:s}}throw new Error("Could not initialize any backends, all backend initializations failed.")}moveData(e,t){let o=this.state.tensorInfo.get(t),n=o.backend,s=this.readSync(t),i=n.refCount(t);n.disposeData(t,!0),o.backend=e,e.move(t,s,o.shape,o.dtype,i),this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack[this.state.numDataMovesStack.length-1]++}tidy(e,t){let o=null;if(t==null){if(typeof e!="function")throw new Error("Please provide a function to tidy()");t=e}else{if(typeof e!="string"&&!(e instanceof String))throw new Error("When calling with two arguments, the first argument to tidy() must be a string");if(typeof t!="function")throw new Error("When calling with two arguments, the 2nd argument to tidy() must be a function");o=e}let n;return this.scopedRun(()=>this.startScope(o),()=>this.endScope(n),()=>(n=t(),n instanceof Promise&&console.error("Cannot return a Promise inside of tidy."),n))}scopedRun(e,t,o){e();try{let n=o();return t(),n}catch(n){throw t(),n}}nextTensorId(){return r.nextTensorId++}nextVariableId(){return r.nextVariableId++}clone(e){let t=S.runKernel(Co,{x:e}),o={x:e},n=i=>({x:()=>{let a="float32",u={x:i},l={dtype:a};return S.runKernel(So,u,l)}}),s=[];return this.addTapeNode(this.state.activeScope.name,o,[t],n,s,{}),t}runKernel(e,t,o){if(this.backendName==null&&this.backend,!(Fn(e,this.backendName)!=null))throw new Error(`Kernel '${e}' not registered for backend '${this.backendName}'`);return this.runKernelFunc({kernelName:e,inputs:t,attrs:o})}shouldCheckForMemLeaks(){return this.ENV.getBool("IS_TEST")}checkKernelForMemLeak(e,t,o){let n=this.backend.numDataIds(),s=0;o.forEach(u=>{s+=u.dtype==="complex64"?3:1});let i=this.state.numDataMovesStack[this.state.numDataMovesStack.length-1],a=n-t-s-i;if(a>0)throw new Error(`Backend '${this.backendName}' has an internal memory leak (${a} data ids) after running '${e}'`)}runKernelFunc(e){let t,o=[],n=this.isTapeOn(),s=this.state.numBytes,i=this.state.numTensors;this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack.push(0);let a;this.backendName==null&&this.backend;let u,l=Lm(e)?e.kernelName:this.state.activeScope!=null?this.state.activeScope.name:"";if(Lm(e)){let{kernelName:d,inputs:g,attrs:h}=e;this.backendName==null&&this.backend;let x=Fn(d,this.backendName);C(x!=null,()=>`Cannot find registered kernel '${d}' for backend '${this.backendName}'`),a=()=>{let v=this.backend.numDataIds();u=x.kernelFunc({inputs:g,attrs:h,backend:this.backend});let N=Array.isArray(u)?u:[u];this.shouldCheckForMemLeaks()&&this.checkKernelForMemLeak(d,v,N);let E=N.map(k=>k.rank!=null?k:this.makeTensorFromTensorInfo(k));if(n){let k=this.getTensorsForGradient(d,g,E);o=this.saveTensorsForBackwardMode(k)}return E}}else{let{forwardFunc:d}=e,g=h=>{n&&(o=h.map(x=>this.keep(this.clone(x))))};a=()=>{let h=this.backend.numDataIds();u=this.tidy(()=>d(this.backend,g));let x=Array.isArray(u)?u:[u];return this.shouldCheckForMemLeaks()&&this.checkKernelForMemLeak(l,h,x),x}}let{inputs:c,attrs:p}=e,m=Lm(e)?null:e.backwardsFunc,f;return this.scopedRun(()=>this.state.kernelDepth++,()=>this.state.kernelDepth--,()=>{!this.ENV.getBool("DEBUG")&&!this.state.profiling?t=a():(f=this.profiler.profileKernel(l,c,()=>a()),this.ENV.getBool("DEBUG")&&this.profiler.logKernelProfile(f),t=f.outputs)}),n&&this.addTapeNode(l,c,t,m,o,p),this.state.profiling&&this.state.activeProfile.kernels.push({name:l,bytesAdded:this.state.numBytes-s,totalBytesSnapshot:this.state.numBytes,tensorsAdded:this.state.numTensors-i,totalTensorsSnapshot:this.state.numTensors,inputShapes:Object.keys(c).map(d=>c[d]!=null?c[d].shape:null),outputShapes:t.map(d=>d.shape),kernelTimeMs:f.timeMs,extraInfo:f.extraInfo}),Array.isArray(u)?t:t[0]}saveTensorsForBackwardMode(e){return e.map(o=>this.keep(this.clone(o)))}getTensorsForGradient(e,t,o){let n=Sm(e);if(n!=null){let s=n.inputsToSave||[],i=n.outputsToSave||[],a;n.saveAllInputs?(C(Array.isArray(t),()=>"saveAllInputs is true, expected inputs to be an array."),a=Object.keys(t).map(l=>t[l])):a=s.map(l=>t[l]);let u=o.filter((l,c)=>i[c]);return a.concat(u)}return[]}makeTensor(e,t,o,n){if(e==null)throw new Error("Values passed to engine.makeTensor() are null");o=o||"float32",n=n||this.backend;let s=e;o==="string"&&cn(e[0])&&(s=e.map(u=>Mn(u)));let i=n.write(s,t,o),a=new de(t,o,i,this.nextTensorId());if(this.trackTensor(a,n),o==="string"){let u=this.state.tensorInfo.get(i),l=ym(s);this.state.numBytes+=l-u.bytes,u.bytes=l}return a}makeTensorFromDataId(e,t,o,n){o=o||"float32";let s={dataId:e,shape:t,dtype:o};return this.makeTensorFromTensorInfo(s,n)}makeTensorFromTensorInfo(e,t){let{dataId:o,shape:n,dtype:s}=e,i=new de(n,s,o,this.nextTensorId());return this.trackTensor(i,t),i}makeVariable(e,t=!0,o,n){o=o||this.nextVariableId().toString(),n!=null&&n!==e.dtype&&(e=e.cast(n));let s=new Ir(e,t,o,this.nextTensorId());if(this.state.registeredVariables[s.name]!=null)throw new Error(`Variable with name ${s.name} was already registered`);return this.state.registeredVariables[s.name]=s,this.incRef(s,this.backend),s}trackTensor(e,t){this.state.numTensors++,e.dtype==="string"&&this.state.numStringTensors++;let o=0;e.dtype!=="complex64"&&e.dtype!=="string"&&(o=e.size*ln(e.dtype)),this.state.numBytes+=o,this.state.tensorInfo.has(e.dataId)||(this.state.numDataBuffers++,this.state.tensorInfo.set(e.dataId,{backend:t||this.backend,dtype:e.dtype,shape:e.shape,bytes:o})),e instanceof Ir||this.track(e)}incRef(e,t){this.trackTensor(e,t),this.backend.incRef(e.dataId)}removeDataId(e,t){this.state.tensorInfo.has(e)&&this.state.tensorInfo.get(e).backend===t&&(this.state.tensorInfo.delete(e),this.state.numDataBuffers--)}disposeTensor(e){if(!this.state.tensorInfo.has(e.dataId))return;let t=this.state.tensorInfo.get(e.dataId);if(this.state.numTensors--,e.dtype==="string"&&(this.state.numStringTensors--,this.state.numBytes-=t.bytes),e.dtype!=="complex64"&&e.dtype!=="string"){let o=e.size*ln(e.dtype);this.state.numBytes-=o}t.backend.disposeData(e.dataId)&&this.removeDataId(e.dataId,t.backend)}disposeVariables(){for(let e in this.state.registeredVariables){let t=this.state.registeredVariables[e];this.disposeVariable(t)}}disposeVariable(e){this.disposeTensor(e),this.state.registeredVariables[e.name]!=null&&delete this.state.registeredVariables[e.name]}memory(){let e=this.backend.memory();return e.numTensors=this.state.numTensors,e.numDataBuffers=this.state.numDataBuffers,e.numBytes=this.state.numBytes,this.state.numStringTensors>0&&(e.unreliable=!0,e.reasons==null&&(e.reasons=[]),e.reasons.push("Memory usage by string tensors is approximate (2 bytes per character)")),e}async profile(e){this.state.profiling=!0;let t=this.state.numBytes,o=this.state.numTensors;this.state.activeProfile.kernels=[],this.state.activeProfile.result=await e(),this.state.profiling=!1,this.state.activeProfile.peakBytes=Math.max(...this.state.activeProfile.kernels.map(n=>n.totalBytesSnapshot)),this.state.activeProfile.newBytes=this.state.numBytes-t,this.state.activeProfile.newTensors=this.state.numTensors-o;for(let n of this.state.activeProfile.kernels)n.kernelTimeMs=await n.kernelTimeMs,n.extraInfo=await n.extraInfo;return this.state.activeProfile}isTapeOn(){return this.state.gradientDepth>0&&this.state.kernelDepth===0}addTapeNode(e,t,o,n,s,i){let a={id:this.state.nextTapeNodeId++,kernelName:e,inputs:t,outputs:o,saved:s},u=Sm(e);u!=null&&(n=u.gradFunc),n!=null&&(a.gradient=l=>(l=l.map((c,p)=>{if(c==null){let m=o[p],f=fn(m.size,m.dtype);return this.makeTensor(f,m.shape,m.dtype)}return c}),n(l.length>1?l:l[0],s,i))),this.state.activeTape.push(a)}keep(e){return e.kept=!0,e}startTape(){this.state.gradientDepth===0&&(this.state.activeTape=[]),this.state.gradientDepth++}endTape(){this.state.gradientDepth--}startScope(e){let t={track:[],name:"unnamed scope",id:this.state.nextScopeId++};e&&(t.name=e),this.state.scopeStack.push(t),this.state.activeScope=t}endScope(e){let t=Pu(e),o=new Set(t.map(s=>s.id));for(let s=0;s<this.state.activeScope.track.length;s++){let i=this.state.activeScope.track[s];!i.kept&&!o.has(i.id)&&i.dispose()}let n=this.state.scopeStack.pop();this.state.activeScope=this.state.scopeStack.length===0?null:this.state.scopeStack[this.state.scopeStack.length-1],t.forEach(s=>{!s.kept&&s.scopeId===n.id&&this.track(s)})}gradients(e,t,o,n=!1){if(C(t.length>0,()=>"gradients() received an empty list of xs."),o!=null&&o.dtype!=="float32")throw new Error(`dy must have 'float32' dtype, but has '${o.dtype}'`);let s=this.scopedRun(()=>this.startTape(),()=>this.endTape(),()=>this.tidy("forward",e));C(s instanceof de,()=>"The result y returned by f() must be a tensor.");let i=rg(this.state.activeTape,t,s);if(!n&&i.length===0&&t.length>0)throw new Error("Cannot compute gradient of y=f(x) with respect to x. Make sure that the f you passed encloses all operations that lead from x to y.");return this.tidy("backward",()=>{let a={};a[s.id]=o??PI(s.shape),og(a,i,l=>this.tidy(l),LI);let u=t.map(l=>a[l.id]);return this.state.gradientDepth===0&&(this.state.activeTape.forEach(l=>{for(let c of l.saved)c.dispose()}),this.state.activeTape=null),{value:s,grads:u}})}customGrad(e){return C(pn(e),()=>"The f passed in customGrad(f) must be a function."),(...t)=>{C(t.every(a=>a instanceof de),()=>"The args passed in customGrad(f)(x1, x2,...) must all be tensors");let o,n={};t.forEach((a,u)=>{n[u]=a});let s=(a,u)=>(o=e(...t,u),C(o.value instanceof de,()=>"The function f passed in customGrad(f) must return an object where `obj.value` is a tensor"),C(pn(o.gradFunc),()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function."),o.value),i=(a,u)=>{let l=o.gradFunc(a,u),c=Array.isArray(l)?l:[l];C(c.length===t.length,()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns the same number of tensors as inputs passed to f(...)."),C(c.every(m=>m instanceof de),()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns a list of only tensors.");let p={};return c.forEach((m,f)=>{p[f]=()=>m}),p};return this.runKernelFunc({forwardFunc:s,backwardsFunc:i,inputs:n})}}readSync(e){return this.state.tensorInfo.get(e).backend.readSync(e)}read(e){return this.state.tensorInfo.get(e).backend.read(e)}readToGPU(e,t){return this.state.tensorInfo.get(e).backend.readToGPU(e,t)}async time(e){let t=$o(),o=await this.backend.time(e);return o.wallMs=$o()-t,o}track(e){return this.state.activeScope!=null&&(e.scopeId=this.state.activeScope.id,this.state.activeScope.track.push(e)),e}get registeredVariables(){return this.state.registeredVariables}reset(){this.pendingBackendInitId++,this.state.dispose(),this.ENV.reset(),this.state=new Lu;for(let e in this.registry)this.disposeRegisteredKernels(e),this.registry[e].dispose(),delete this.registry[e];this.backendName=null,this.backendInstance=null,this.pendingBackendInit=null}};Vs.nextTensorId=0;Vs.nextVariableId=0;function PI(r){let e=Ns(re(r),"float32");return S.makeTensor(e,r,"float32")}function Bm(){let r=vm();if(r._tfengine==null){let e=new Es(r);r._tfengine=new Vs(e)}return kh(r._tfengine.ENV),ag(()=>r._tfengine),r._tfengine}var S=Bm();function LI(r,e){let t={a:r,b:e};return S.runKernel("Add",t)}var qr={};ye(qr,{isBrowser:()=>Vm,isMobile:()=>VI,mockIsMobile:()=>MI});function BI(){return typeof navigator<"u"&&navigator!=null}var Mm;function MI(r){Mm=r}function VI(r){if(Mm!==void 0)return Mm;if(r||BI()){if(r||(r=navigator),r.product==="ReactNative")return!0;let e=r.userAgent||r.vendor||(typeof window<"u"?window.opera:"");if(!e){let t=r;return t.userAgentData&&t.userAgentData.mobile}return/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(e)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(e.substr(0,4))}return!1}function Vm(){return typeof window<"u"&&window.document!=null||typeof WorkerGlobalScope<"u"}var ct=$();ct.registerFlag("DEBUG",()=>!1,r=>{r&&console.warn("Debugging mode is ON. The output of every math call will be downloaded to CPU and checked for NaNs. This significantly impacts performance.")});ct.registerFlag("IS_BROWSER",()=>Vm());ct.registerFlag("IS_NODE",()=>typeof process<"u"&&typeof process.versions<"u"&&typeof process.versions.node<"u");ct.registerFlag("IS_CHROME",()=>typeof navigator<"u"&&navigator!=null&&navigator.userAgent!=null&&/Chrome/.test(navigator.userAgent)&&/Google Inc/.test(navigator.vendor));ct.registerFlag("IS_SAFARI",()=>typeof navigator<"u"&&navigator!=null&&navigator.userAgent!=null&&/Safari/.test(navigator.userAgent)&&/Apple/.test(navigator.vendor));ct.registerFlag("PROD",()=>!1);ct.registerFlag("TENSORLIKE_CHECK_SHAPE_CONSISTENCY",()=>ct.getBool("DEBUG"));ct.registerFlag("DEPRECATION_WARNINGS_ENABLED",()=>!0);ct.registerFlag("IS_TEST",()=>!1);ct.registerFlag("CHECK_COMPUTATION_FOR_ERRORS",()=>ct.getBool("DEBUG"));ct.registerFlag("WRAP_TO_IMAGEBITMAP",()=>!1);ct.registerFlag("CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU",()=>!1);ct.registerFlag("USE_SETTIMEOUTCUSTOM",()=>!1);function pt(r,e){let t=r;if(Ye(r))return e==="string"?[]:[r.length];if(Ou(r)){let n=r.channels||"RGBA";return[r.height,r.width*n.length]}else if(Fu(r))return[r.buffer.size/(e==null?4:ln(e))];if(!Array.isArray(r))return[];let o=[];for(;Array.isArray(t)||Ye(t)&&e!=="string";)o.push(t.length),t=t[0];return Array.isArray(r)&&$().getBool("TENSORLIKE_CHECK_SHAPE_CONSISTENCY")&&fg(r,o,[]),o}function fg(r,e,t){if(t=t||[],!Array.isArray(r)&&!Ye(r)){C(e.length===0,()=>`Element arr[${t.join("][")}] is a primitive, but should be an array/TypedArray of ${e[0]} elements`);return}C(e.length>0,()=>`Element arr[${t.join("][")}] should be a primitive, but is an array of ${r.length} elements`),C(r.length===e[0],()=>`Element arr[${t.join("][")}] should have ${e[0]} elements, but has ${r.length} elements`);let o=e.slice(1);for(let n=0;n<r.length;++n)fg(r[n],o,t.concat(n))}function mg(r,e,t,o){if(r!=="string_or_numeric"){if(r==null)throw new Error("Expected dtype cannot be null.");if(r!=="numeric"&&r!==e||r==="numeric"&&e==="string")throw new Error(`Argument '${t}' passed to '${o}' must be ${r} tensor, but got ${e} tensor`)}}function b(r,e,t,o="numeric"){if(r instanceof Am())return mg(o,r.dtype,e,t),r;let n=Wr(r);if(n!=="string"&&["bool","int32","float32"].indexOf(o)>=0&&(n=o),mg(o,n,e,t),r==null||!Ye(r)&&!Array.isArray(r)&&typeof r!="number"&&typeof r!="boolean"&&typeof r!="string"){let u=r==null?"null":r.constructor.name;throw new Error(`Argument '${e}' passed to '${t}' must be a Tensor or TensorLike, but got '${u}'`)}let s=pt(r,n);!Ye(r)&&!Array.isArray(r)&&(r=[r]);let a=n!=="string"?Bn(r,n):Kr(r,[],!0);return S.makeTensor(a,s,n)}function Ao(r,e,t,o="numeric"){if(!Array.isArray(r))throw new Error(`Argument ${e} passed to ${t} must be a \`Tensor[]\` or \`TensorLike[]\``);return r.map((s,i)=>b(s,`${e}[${i}]`,t,o))}var Um="__op";function w(r){let e=Object.keys(r);if(e.length!==1)throw new Error(`Please provide an object with a single key (operation name) mapping to a function. Got an object with ${e.length} keys.`);let t=e[0],o=r[t];t.endsWith("_")&&(t=t.substring(0,t.length-1)),t=t+Um;let n=(...s)=>{S.startScope(t);try{let i=o(...s);return To(i)&&console.error("Cannot return a Promise inside of tidy."),S.endScope(i),i}catch(i){throw S.endScope(null),i}};return Object.defineProperty(n,"name",{value:t,configurable:!0}),n}function UI(r,e){let t=b(r,"real","complex"),o=b(e,"imag","complex");$e(t.shape,o.shape,`real and imag shapes, ${t.shape} and ${o.shape}, must match in call to tf.complex().`);let n={real:t,imag:o};return S.runKernel(ks,n)}var mt=w({complex_:UI});function rt(r,e,t,o){if(o==null)o=Wr(r);else if(o==="complex64")throw new Error("Cannot construct a complex64 tensor directly. Please use tf.complex(real, imag).");if(Fu(r)||Ou(r)){if(o!=="float32"&&o!=="int32")throw new Error(`Creating tensor from GPU data only supports 'float32'|'int32' dtype, while the dtype is ${o}.`);return S.backend.createTensorFromGPUData(r,e||t,o)}if(!Ye(r)&&!Array.isArray(r)&&typeof r!="number"&&typeof r!="boolean"&&typeof r!="string")throw new Error("values passed to tensor(values) must be a number/boolean/string or an array of numbers/booleans/strings, or a TypedArray");if(e!=null){Ce(e);let n=re(e),s=re(t);C(n===s,()=>`Based on the provided shape, [${e}], the tensor should have ${n} values but has ${s}`);for(let i=0;i<t.length;++i){let a=t[i],u=i===t.length-1?a!==re(e.slice(i)):!0;C(t[i]===e[i]||!u,()=>`Error creating a new Tensor. Inferred shape (${t}) does not match the provided shape (${e}). `)}}return!Ye(r)&&!Array.isArray(r)&&(r=[r]),e=e||t,r=o!=="string"?Bn(r,o):Kr(r,[],!0),S.makeTensor(r,e,o)}function ot(r,e,t){let o=pt(r,t);return rt(r,e,o,t)}var kr={float32:4,float16:2,int32:4,uint16:2,uint8:1,bool:1,complex64:8};var Ke=class r{static join(e){return new r(e).slice()}constructor(e){if(this.shards=[],this.previousShardIndex=0,e==null||(e instanceof Array||(e=[e]),e=e.map(o=>Ye(o)?o.buffer:o),e.length===0))return;this.bufferUniformSize=e[0].byteLength;let t=0;for(let o=0;o<e.length;o++){let n=e[o];o!==e.length-1&&n.byteLength!==this.bufferUniformSize&&(this.bufferUniformSize=void 0);let s=t+n.byteLength;this.shards.push({buffer:n,start:t,end:s}),t=s}this.shards.length===0&&(this.byteLength=0),this.byteLength=this.shards[this.shards.length-1].end}slice(e=0,t=this.byteLength){if(this.shards.length===0)return new ArrayBuffer(0);if(e=isNaN(Number(e))?0:e,t=isNaN(Number(t))?0:t,e=Math.max(0,e),t=Math.min(this.byteLength,t),t<=e)return new ArrayBuffer(0);let o=this.findShardForByte(e);if(o===-1)throw new Error(`Could not find start shard for byte ${e}`);let n=t-e,s=new ArrayBuffer(n),i=new Uint8Array(s),a=0;for(let u=o;u<this.shards.length;u++){let l=this.shards[u],p=e+a-l.start,m=a,d=Math.min(t,l.end)-l.start,g=new Uint8Array(l.buffer,p,d-p);if(i.set(g,m),a+=g.length,t<l.end)break}return s}findShardForByte(e){if(this.shards.length===0||e<0||e>=this.byteLength)return-1;if(this.bufferUniformSize!=null)return this.previousShardIndex=Math.floor(e/this.bufferUniformSize),this.previousShardIndex;function t(n){return e<n.start?-1:e>=n.end?1:0}if(t(this.shards[this.previousShardIndex])===0)return this.previousShardIndex;let o=GI(this.shards,t);return o===-1?-1:(this.previousShardIndex=o,this.previousShardIndex)}};function GI(r,e){let t=0,o=r.length;for(;t<=o;){let n=Math.floor((o-t)/2)+t,s=e(r[n]);if(s===0)return n;s<0?o=n:t=n+1}return-1}function zI(r){$().getBool("DEPRECATION_WARNINGS_ENABLED")&&console.warn(r+" You can disable deprecation warnings with tf.disableDeprecationWarnings().")}lg(zI);function Vt(){return S}function H(r,e){return S.tidy(r,e)}function ne(r){Pu(r).forEach(t=>t.dispose())}function ft(r){return S.keep(r)}function dg(r){return S.setBackend(r)}function hg(){return S.ready()}function $r(){return S.backendName}function gg(r,e,t=1){return S.registerBackend(r,e,t)}function Xr(){return S.backend}var jr=4;async function bg(r,e){let t=[],o=[],n=Array.isArray(r)?r.map(i=>i.name):Object.keys(r);for(let i=0;i<n.length;++i){let a=n[i],u=Array.isArray(r)?r[i].tensor:r[a];if(u.dtype!=="float32"&&u.dtype!=="int32"&&u.dtype!=="bool"&&u.dtype!=="string"&&u.dtype!=="complex64")throw new Error(`Unsupported dtype in weight '${a}': ${u.dtype}`);let l={name:a,shape:u.shape,dtype:u.dtype};if(u.dtype==="string"){let c=new Promise(async p=>{let m=await u.bytes(),f=m.reduce((h,x)=>h+x.length,0)+jr*m.length,d=new Uint8Array(f),g=0;for(let h=0;h<m.length;h++){let x=m[h],v=new Uint8Array(new Uint32Array([x.length]).buffer);d.set(v,g),g+=jr,d.set(x,g),g+=x.length}p(d)});o.push(c)}else o.push(u.data());e!=null&&(l.group=e),t.push(l)}let s=await Promise.all(o);return{data:KI(s),specs:t}}function Bu(r,e){let t=new Ke(r),o={},n=0;for(let s of e){let i=WI(s,(a,u)=>t.slice(n+a,n+u));o[s.name]=wg(s,t.slice(n,n+i)),n+=i}return o}function WI(r,e){let t=re(r.shape),o;if("quantization"in r){let n=r.quantization;o=kr[n.dtype]}else if(r.dtype==="string"){let n=0;for(let s=0;s<t;s++)n+=jr+new Uint32Array(e(n,n+jr))[0];return n}else o=kr[r.dtype];return t*o}async function HI(r,e){let t=re(r.shape),o;if("quantization"in r){let n=r.quantization;o=kr[n.dtype]}else if(r.dtype==="string"){let n=0;for(let s=0;s<t;s++)n+=jr+new Uint32Array(await e(n,n+jr))[0];return n}else o=kr[r.dtype];return t*o}function wg(r,e){let t=r.name,o=r.dtype,n=r.shape,s=re(n),i,a=0;if("quantization"in r){let u=r.quantization;if(u.dtype==="uint8"||u.dtype==="uint16"){if(!("min"in u&&"scale"in u))throw new Error(`Weight ${r.name} with quantization ${u.dtype} doesn't have corresponding metadata min and scale.`)}else if(u.dtype==="float16"){if(o!=="float32")throw new Error(`Weight ${r.name} is quantized with ${u.dtype} which only supports weights of type float32 not ${o}.`)}else throw new Error(`Weight ${r.name} has unknown quantization dtype ${u.dtype}. Supported quantization dtypes are: 'uint8', 'uint16', and 'float16'.`);let l=kr[u.dtype],c=u.dtype==="uint8"?new Uint8Array(e):new Uint16Array(e);if(o==="float32")if(u.dtype==="uint8"||u.dtype==="uint16"){i=new Float32Array(c.length);for(let p=0;p<c.length;p++){let m=c[p];i[p]=m*u.scale+u.min}}else if(u.dtype==="float16")i=YI()(c);else throw new Error(`Unsupported quantization type ${u.dtype} for weight type float32.`);else if(o==="int32"){if(u.dtype!=="uint8"&&u.dtype!=="uint16")throw new Error(`Unsupported quantization type ${u.dtype} for weight type int32.`);i=new Int32Array(c.length);for(let p=0;p<c.length;p++){let m=c[p];i[p]=Math.round(m*u.scale+u.min)}}else throw new Error(`Unsupported dtype in weight '${t}': ${o}`);a+=s*l}else if(o==="string"){let u=re(r.shape);i=[];for(let l=0;l<u;l++){let c=new Uint32Array(e.slice(a,a+jr))[0];a+=jr;let p=new Uint8Array(e.slice(a,a+c));i.push(p),a+=c}}else{let u=kr[o];if(o==="float32")i=new Float32Array(e);else if(o==="int32")i=new Int32Array(e);else if(o==="bool")i=new Uint8Array(e);else if(o==="complex64"){i=new Float32Array(e);let l=new Float32Array(i.length/2),c=new Float32Array(i.length/2);for(let d=0;d<l.length;d++)l[d]=i[d*2],c[d]=i[d*2+1];let p=ot(l,n,"float32"),m=ot(c,n,"float32"),f=mt(p,m);return p.dispose(),m.dispose(),f}else throw new Error(`Unsupported dtype in weight '${t}': ${o}`);a+=s*u}return ot(i,n,o)}async function xg(r,e,t){let o=new Uint8Array(e);for(;o.byteLength<t;){let{done:n,value:s}=await r.read();if(n&&s==null){let a=t-o.byteLength;throw new Error(`Reader is done but ${a} bytes are still expected`)}let i=new Uint8Array(o.length+s.byteLength);i.set(o,0),i.set(new Uint8Array(s),o.length),o=i}return o.buffer}async function Mu(r,e){let t={},o=r.getReader(),n=new ArrayBuffer(0);for(let s of e){let i=await HI(s,async(l,c)=>(n=await xg(o,n,c),n.slice(l,c)));n=await xg(o,n,i);let a=n.slice(0,i);n=n.slice(i);let u=wg(s,a);if(t[s.name]=u,$r()==="webgpu"){let l=Xr();"uploadToGPU"in l&&re(u.shape)>=$().get("WEBGPU_CPU_HANDOFF_SIZE_THRESHOLD")&&l.uploadToGPU(u.dataId)}}return t}function KI(r){if(r===null)throw new Error(`Invalid input value: ${JSON.stringify(r)}`);let e=0,t=[];r.forEach(s=>{if(e+=s.byteLength,t.push(s.byteLength===s.buffer.byteLength?s:new s.constructor(s)),!(s instanceof Float32Array||s instanceof Int32Array||s instanceof Uint8Array))throw new Error(`Unsupported TypedArray subtype: ${s.constructor.name}`)});let o=new Uint8Array(e),n=0;return t.forEach(s=>{o.set(new Uint8Array(s.buffer),n),n+=s.byteLength}),o.buffer}var Gm=typeof Buffer<"u"&&(typeof Blob>"u"||typeof atob>"u"||typeof btoa>"u");function yg(r){return Gm?Buffer.byteLength(r,"utf8"):new Blob([r]).size}function vg(r){if(Gm)return Buffer.from(r).toString("base64");let e=new Uint8Array(r),t="";for(let o=0,n=e.length;o<n;o++)t+=String.fromCharCode(e[o]);return btoa(t)}function Tg(r){if(Gm){let o=Buffer.from(r,"base64");return o.buffer.slice(o.byteOffset,o.byteOffset+o.byteLength)}let e=atob(r),t=new Uint8Array(e.length);for(let o=0;o<e.length;++o)t.set([e.charCodeAt(o)],o);return t.buffer}function Sg(r){return Ke.join(r)}function zm(r){for(r=r.trim();r.endsWith("/");)r=r.slice(0,r.length-1);let t=r.split("/");return t[t.length-1]}function Vu(r,e){let t={modelTopology:r.modelTopology,format:r.format,generatedBy:r.generatedBy,convertedBy:r.convertedBy,weightsManifest:e};return r.signature!=null&&(t.signature=r.signature),r.userDefinedMetadata!=null&&(t.userDefinedMetadata=r.userDefinedMetadata),r.modelInitializer!=null&&(t.modelInitializer=r.modelInitializer),r.initializerSignature!=null&&(t.initializerSignature=r.initializerSignature),r.trainingConfig!=null&&(t.trainingConfig=r.trainingConfig),t}function Wm(r,e,t){let o={modelTopology:r.modelTopology,format:r.format,generatedBy:r.generatedBy,convertedBy:r.convertedBy};if(r.trainingConfig!=null&&(o.trainingConfig=r.trainingConfig),r.weightsManifest!=null){if(!e)throw new Error("modelJSON has weightsManifest but weightSpecs is null");if(!t)throw new Error("modelJSON has weightsManifest but weightData is null");o.weightSpecs=e,o.weightData=t}return r.signature!=null&&(o.signature=r.signature),r.userDefinedMetadata!=null&&(o.userDefinedMetadata=r.userDefinedMetadata),r.modelInitializer!=null&&(o.modelInitializer=r.modelInitializer),r.initializerSignature!=null&&(o.initializerSignature=r.initializerSignature),o}async function zn(r,e){let t,o;return r.weightsManifest!=null&&([t,o]=await e(r.weightsManifest)),Wm(r,t,o)}function pr(r){if(r.modelTopology instanceof ArrayBuffer)throw new Error("Expected JSON model topology, received ArrayBuffer.");return{dateSaved:new Date,modelTopologyType:"JSON",modelTopologyBytes:r.modelTopology==null?0:yg(JSON.stringify(r.modelTopology)),weightSpecsBytes:r.weightSpecs==null?0:yg(JSON.stringify(r.weightSpecs)),weightDataBytes:r.weightData==null?0:new Ke(r.weightData).byteLength}}function Us(r){let e=[];for(let t of r)e.push(...t.weights);return e}function qI(){let r=t=>{let o=t<<13,n=0;for(;(o&8388608)===0;)n-=8388608,o<<=1;return o&=-8388609,n+=947912704,o|n},e=new Uint32Array(2048);e[0]=0;for(let t=1;t<1024;t++)e[t]=r(t);for(let t=1024;t<2048;t++)e[t]=939524096+(t-1024<<13);return e}function XI(){let r=new Uint32Array(64);r[0]=0,r[31]=1199570944,r[32]=2147483648,r[63]=3347054592;for(let e=1;e<31;e++)r[e]=e<<23;for(let e=33;e<63;e++)r[e]=2147483648+(e-32<<23);return r}function jI(){let r=new Uint32Array(64);for(let e=0;e<64;e++)r[e]=1024;return r[0]=r[32]=0,r}function YI(){let r=qI(),e=XI(),t=jI();return o=>{let n=new ArrayBuffer(4*o.length),s=new Uint32Array(n);for(let i=0;i<o.length;i++){let a=o[i],u=r[t[a>>10]+(a&1023)]+e[a>>10];s[i]=u}return new Float32Array(n)}}var Ve=class r{constructor(){this.saveRouters=[],this.loadRouters=[]}static getInstance(){return r.instance==null&&(r.instance=new r),r.instance}static registerSaveRouter(e){r.getInstance().saveRouters.push(e)}static registerLoadRouter(e){r.getInstance().loadRouters.push(e)}static getSaveHandlers(e){return r.getHandlers(e,"save")}static getLoadHandlers(e,t){return r.getHandlers(e,"load",t)}static getHandlers(e,t,o){let n=[];return(t==="load"?r.getInstance().loadRouters:r.getInstance().saveRouters).forEach(i=>{let a=i(e,o);a!==null&&n.push(a)}),n}},Cg=r=>Ve.registerSaveRouter(r),Ng=r=>Ve.registerLoadRouter(r),Eg=r=>Ve.getSaveHandlers(r),Ig=(r,e)=>Ve.getLoadHandlers(r,e);var Hm="tensorflowjs",Km=1,_o="models_store",Yr="model_info_store";function kg(){if(!$().getBool("IS_BROWSER"))throw new Error("Failed to obtain IndexedDB factory because the current environmentis not a web browser.");let r=typeof window>"u"?self:window,e=r.indexedDB||r.mozIndexedDB||r.webkitIndexedDB||r.msIndexedDB||r.shimIndexedDB;if(e==null)throw new Error("The current browser does not appear to support IndexedDB.");return e}function qm(r){let e=r.result;e.createObjectStore(_o,{keyPath:"modelPath"}),e.createObjectStore(Yr,{keyPath:"modelPath"})}var mr=class{constructor(e){if(this.indexedDB=kg(),e==null||!e)throw new Error("For IndexedDB, modelPath must not be null, undefined or empty.");this.modelPath=e}async save(e){if(e.modelTopology instanceof ArrayBuffer)throw new Error("BrowserLocalStorage.save() does not support saving model topology in binary formats yet.");return this.databaseAction(this.modelPath,e)}async load(){return this.databaseAction(this.modelPath)}databaseAction(e,t){return new Promise((o,n)=>{let s=this.indexedDB.open(Hm,Km);s.onupgradeneeded=()=>qm(s),s.onsuccess=()=>{let i=s.result;if(t==null){let a=i.transaction(_o,"readonly"),l=a.objectStore(_o).get(this.modelPath);l.onsuccess=()=>{if(l.result==null)return i.close(),n(new Error(`Cannot find model with path '${this.modelPath}' in IndexedDB.`));o(l.result.modelArtifacts)},l.onerror=c=>(i.close(),n(l.error)),a.oncomplete=()=>i.close()}else{t.weightData=Ke.join(t.weightData);let a=pr(t),u=i.transaction(Yr,"readwrite"),l=u.objectStore(Yr),c;try{c=l.put({modelPath:this.modelPath,modelArtifactsInfo:a})}catch(m){return n(m)}let p;c.onsuccess=()=>{p=i.transaction(_o,"readwrite");let m=p.objectStore(_o),f;try{f=m.put({modelPath:this.modelPath,modelArtifacts:t,modelArtifactsInfo:a})}catch(d){return n(d)}f.onsuccess=()=>o({modelArtifactsInfo:a}),f.onerror=d=>{l=u.objectStore(Yr);let g=l.delete(this.modelPath);g.onsuccess=()=>(i.close(),n(f.error)),g.onerror=h=>(i.close(),n(f.error))}},c.onerror=m=>(i.close(),n(c.error)),u.oncomplete=()=>{p==null?i.close():p.oncomplete=()=>i.close()}}},s.onerror=i=>n(s.error)})}};mr.URL_SCHEME="indexeddb://";var $g=r=>$().getBool("IS_BROWSER")&&!Array.isArray(r)&&r.startsWith(mr.URL_SCHEME)?QI(r.slice(mr.URL_SCHEME.length)):null;Ve.registerSaveRouter($g);Ve.registerLoadRouter($g);function QI(r){return new mr(r)}function ZI(r){return r.startsWith(mr.URL_SCHEME)?r.slice(mr.URL_SCHEME.length):r}var Uu=class{constructor(){this.indexedDB=kg()}async listModels(){return new Promise((e,t)=>{let o=this.indexedDB.open(Hm,Km);o.onupgradeneeded=()=>qm(o),o.onsuccess=()=>{let n=o.result,s=n.transaction(Yr,"readonly"),a=s.objectStore(Yr).getAll();a.onsuccess=()=>{let u={};for(let l of a.result)u[l.modelPath]=l.modelArtifactsInfo;e(u)},a.onerror=u=>(n.close(),t(a.error)),s.oncomplete=()=>n.close()},o.onerror=n=>t(o.error)})}async removeModel(e){return e=ZI(e),new Promise((t,o)=>{let n=this.indexedDB.open(Hm,Km);n.onupgradeneeded=()=>qm(n),n.onsuccess=()=>{let s=n.result,i=s.transaction(Yr,"readwrite"),a=i.objectStore(Yr),u=a.get(e),l;u.onsuccess=()=>{if(u.result==null)return s.close(),o(new Error(`Cannot find model with path '${e}' in IndexedDB.`));{let c=a.delete(e),p=()=>{l=s.transaction(_o,"readwrite");let f=l.objectStore(_o).delete(e);f.onsuccess=()=>t(u.result.modelArtifactsInfo),f.onerror=d=>o(u.error)};c.onsuccess=p,c.onerror=m=>(p(),s.close(),o(u.error))}},u.onerror=c=>(s.close(),o(u.error)),i.oncomplete=()=>{l==null?s.close():l.oncomplete=()=>s.close()}},n.onerror=s=>o(n.error)})}};var Rr="/",Wn="tensorflowjs_models",Rg="info",JI="model_topology",e2="weight_specs",t2="weight_data",r2="model_metadata";function Ag(r){return{info:[Wn,r,Rg].join(Rr),topology:[Wn,r,JI].join(Rr),weightSpecs:[Wn,r,e2].join(Rr),weightData:[Wn,r,t2].join(Rr),modelMetadata:[Wn,r,r2].join(Rr)}}function _g(r){for(let e of Object.values(r))window.localStorage.removeItem(e)}function o2(r){let e=r.split(Rr);if(e.length<3)throw new Error(`Invalid key format: ${r}`);return e.slice(1,e.length-1).join(Rr)}function n2(r){return r.startsWith(fr.URL_SCHEME)?r.slice(fr.URL_SCHEME.length):r}var fr=class{constructor(e){if(!$().getBool("IS_BROWSER")||typeof window>"u"||typeof window.localStorage>"u")throw new Error("The current environment does not support local storage.");if(this.LS=window.localStorage,e==null||!e)throw new Error("For local storage, modelPath must not be null, undefined or empty.");this.modelPath=e,this.keys=Ag(this.modelPath)}async save(e){if(e.modelTopology instanceof ArrayBuffer)throw new Error("BrowserLocalStorage.save() does not support saving model topology in binary formats yet.");{let t=JSON.stringify(e.modelTopology),o=JSON.stringify(e.weightSpecs),n=pr(e),s=Ke.join(e.weightData);try{this.LS.setItem(this.keys.info,JSON.stringify(n)),this.LS.setItem(this.keys.topology,t),this.LS.setItem(this.keys.weightSpecs,o),this.LS.setItem(this.keys.weightData,vg(s));let i={format:e.format,generatedBy:e.generatedBy,convertedBy:e.convertedBy,signature:e.signature!=null?e.signature:void 0,userDefinedMetadata:e.userDefinedMetadata!=null?e.userDefinedMetadata:void 0,modelInitializer:e.modelInitializer!=null?e.modelInitializer:void 0,initializerSignature:e.initializerSignature!=null?e.initializerSignature:void 0,trainingConfig:e.trainingConfig!=null?e.trainingConfig:void 0};return this.LS.setItem(this.keys.modelMetadata,JSON.stringify(i)),{modelArtifactsInfo:n}}catch{throw _g(this.keys),new Error(`Failed to save model '${this.modelPath}' to local storage: size quota being exceeded is a possible cause of this failure: modelTopologyBytes=${n.modelTopologyBytes}, weightSpecsBytes=${n.weightSpecsBytes}, weightDataBytes=${n.weightDataBytes}.`)}}}async load(){let e=JSON.parse(this.LS.getItem(this.keys.info));if(e==null)throw new Error(`In local storage, there is no model with name '${this.modelPath}'`);if(e.modelTopologyType!=="JSON")throw new Error("BrowserLocalStorage does not support loading non-JSON model topology yet.");let t={},o=JSON.parse(this.LS.getItem(this.keys.topology));if(o==null)throw new Error(`In local storage, the topology of model '${this.modelPath}' is missing.`);t.modelTopology=o;let n=JSON.parse(this.LS.getItem(this.keys.weightSpecs));if(n==null)throw new Error(`In local storage, the weight specs of model '${this.modelPath}' are missing.`);t.weightSpecs=n;let s=this.LS.getItem(this.keys.modelMetadata);if(s!=null){let a=JSON.parse(s);t.format=a.format,t.generatedBy=a.generatedBy,t.convertedBy=a.convertedBy,a.signature!=null&&(t.signature=a.signature),a.userDefinedMetadata!=null&&(t.userDefinedMetadata=a.userDefinedMetadata),a.modelInitializer!=null&&(t.modelInitializer=a.modelInitializer),a.initializerSignature!=null&&(t.initializerSignature=a.initializerSignature),a.trainingConfig!=null&&(t.trainingConfig=a.trainingConfig)}let i=this.LS.getItem(this.keys.weightData);if(i==null)throw new Error(`In local storage, the binary weight values of model '${this.modelPath}' are missing.`);return t.weightData=Tg(i),t}};fr.URL_SCHEME="localstorage://";var Dg=r=>$().getBool("IS_BROWSER")&&!Array.isArray(r)&&r.startsWith(fr.URL_SCHEME)?s2(r.slice(fr.URL_SCHEME.length)):null;Ve.registerSaveRouter(Dg);Ve.registerLoadRouter(Dg);function s2(r){return new fr(r)}var Gu=class{constructor(){C($().getBool("IS_BROWSER"),()=>"Current environment is not a web browser"),C(typeof window>"u"||typeof window.localStorage<"u",()=>"Current browser does not appear to support localStorage"),this.LS=window.localStorage}async listModels(){let e={},t=Wn+Rr,o=Rr+Rg;for(let n=0;n<this.LS.length;++n){let s=this.LS.key(n);if(s.startsWith(t)&&s.endsWith(o)){let i=o2(s);e[i]=JSON.parse(this.LS.getItem(s))}}return e}async removeModel(e){e=n2(e);let t=Ag(e);if(this.LS.getItem(t.info)==null)throw new Error(`Cannot find model at path '${e}'`);let o=JSON.parse(this.LS.getItem(t.info));return _g(t),o}};var Hn="://",rr=class r{constructor(){this.managers={}}static getInstance(){return r.instance==null&&(r.instance=new r),r.instance}static registerManager(e,t){C(e!=null,()=>"scheme must not be undefined or null."),e.endsWith(Hn)&&(e=e.slice(0,e.indexOf(Hn))),C(e.length>0,()=>"scheme must not be an empty string.");let o=r.getInstance();C(o.managers[e]==null,()=>`A model store manager is already registered for scheme '${e}'.`),o.managers[e]=t}static getManager(e){let t=r.getInstance().managers[e];if(t==null)throw new Error(`Cannot find model manager for scheme '${e}'`);return t}static getSchemes(){return Object.keys(r.getInstance().managers)}};function zu(r){if(r.indexOf(Hn)===-1)throw new Error(`The url string provided does not contain a scheme. Supported schemes are: ${rr.getSchemes().join(",")}`);return{scheme:r.split(Hn)[0],path:r.split(Hn)[1]}}async function Og(r,e,t=!1){C(r!==e,()=>`Old path and new path are the same: '${r}'`);let o=Ve.getLoadHandlers(r);C(o.length>0,()=>`Copying failed because no load handler is found for source URL ${r}.`),C(o.length<2,()=>`Copying failed because more than one (${o.length}) load handlers for source URL ${r}.`);let n=o[0],s=Ve.getSaveHandlers(e);C(s.length>0,()=>`Copying failed because no save handler is found for destination URL ${e}.`),C(s.length<2,()=>`Copying failed because more than one (${o.length}) save handlers for destination URL ${e}.`);let i=s[0],a=zu(r).scheme,u=zu(r).path,l=a===zu(r).scheme,c=await n.load();t&&l&&await rr.getManager(a).removeModel(u);let p=await i.save(c);return t&&!l&&await rr.getManager(a).removeModel(u),p.modelArtifactsInfo}async function Fg(){let r=rr.getSchemes(),e={};for(let t of r){let o=await rr.getManager(t).listModels();for(let n in o){let s=t+Hn+n;e[s]=o[n]}}return e}async function Pg(r){let e=zu(r);return rr.getManager(e.scheme).removeModel(e.path)}async function Lg(r,e){return Og(r,e,!1)}async function Bg(r,e){return Og(r,e,!0)}var Xm=class{constructor(){this.messageName="setTimeoutCustom",this.functionRefs=[],this.handledMessageCount=0,this.hasEventListener=!1}fetch(e,t){return fetch(e,t)}now(){return performance.now()}encode(e,t){if(t!=="utf-8"&&t!=="utf8")throw new Error(`Browser's encoder only supports utf-8, but got ${t}`);return this.textEncoder==null&&(this.textEncoder=new TextEncoder),this.textEncoder.encode(e)}decode(e,t){return new TextDecoder(t).decode(e)}setTimeoutCustom(e,t){if(typeof window>"u"||!$().getBool("USE_SETTIMEOUTCUSTOM")){setTimeout(e,t);return}this.functionRefs.push(e),setTimeout(()=>{window.postMessage({name:this.messageName,index:this.functionRefs.length-1},"*")},t),this.hasEventListener||(this.hasEventListener=!0,window.addEventListener("message",o=>{if(o.source===window&&o.data.name===this.messageName){o.stopPropagation();let n=this.functionRefs[o.data.index];n(),this.handledMessageCount++,this.handledMessageCount===this.functionRefs.length&&(this.functionRefs=[],this.handledMessageCount=0)}},!0))}isTypedArray(e){return $u(e)}};if($().get("IS_BROWSER")){$().setPlatform("browser",new Xm);try{rr.registerManager(fr.URL_SCHEME,new Gu)}catch{}try{rr.registerManager(mr.URL_SCHEME,new Uu)}catch{}}var i2={importFetch:()=>Mg()},jm;var Ym=class{constructor(){this.util=Vg(),this.textEncoder=new this.util.TextEncoder}fetch(e,t){return $().global.fetch!=null?$().global.fetch(e,t):(jm==null&&(jm=i2.importFetch()),jm(e,t))}now(){let e=process.hrtime();return e[0]*1e3+e[1]/1e6}encode(e,t){if(t!=="utf-8"&&t!=="utf8")throw new Error(`Node built-in encoder only supports utf-8, but got ${t}`);return this.textEncoder.encode(e)}decode(e,t){return e.length===0?"":new this.util.TextDecoder(t).decode(e)}isTypedArray(e){return this.util.types.isFloat32Array(e)||this.util.types.isInt32Array(e)||this.util.types.isUint8Array(e)||this.util.types.isUint8ClampedArray(e)}};$().get("IS_NODE")&&!$().get("IS_BROWSER")&&$().setPlatform("node",new Ym);function oe(r,e="float32",t){return e=e||"float32",Ce(r),new Mt(r,e,t)}function a2(r,e){let t=b(r,"x","cast");if(!xm(e))throw new Error(`Failed to cast to unknown dtype ${e}`);if(e==="string"&&t.dtype!=="string"||e!=="string"&&t.dtype==="string")throw new Error("Only strings can be casted to strings");let o={x:t},n={dtype:e};return S.runKernel(So,o,n)}var ee=w({cast_:a2});function u2(r){let t={x:b(r,"x","clone","string_or_numeric")};return S.runKernel(Co,t)}var $t=w({clone_:u2});function Wu(r,e=!1){console.log(r.toString(e))}Bm();var l2={buffer:oe,cast:ee,clone:$t,print:Wu};ug(l2);function c2(r,e){let t=b(r,"a","add"),o=b(e,"b","add");[t,o]=te(t,o);let n={a:t,b:o};return S.runKernel("Add",n)}var V=w({add_:c2});function p2(r,e){let t=b(r,"a","floorDiv"),o=b(e,"b","floorDiv");[t,o]=te(t,o);let n={a:t,b:o};return S.runKernel(bn,n)}var Hu=w({floorDiv_:p2});function m2(r,e){let t=b(r,"a","div"),o=b(e,"b","div");if([t,o]=te(t,o),t.dtype==="int32"&&o.dtype==="int32")return Hu(t,o);let n={a:t,b:o},s={};return S.runKernel(ua,n,s)}var Y=w({div_:m2});function f2(r,e){let t=b(r,"a","mul"),o=b(e,"b","mul");[t,o]=te(t,o);let n={a:t,b:o};return S.runKernel(En,n)}var P=w({mul_:f2});function d2(r){let e=b(r,"x","abs");if(e.dtype==="complex64"){let t={x:e};return S.runKernel(Wi,t)}else{let t={x:e};return S.runKernel("Abs",t)}}var ze=w({abs_:d2});function h2(r){let t={x:b(r,"x","acos")};return S.runKernel(Ii,t)}var Ug=w({acos_:h2});function g2(r){let t={x:b(r,"x","acosh")};return S.runKernel(ki,t)}var Gg=w({acosh_:g2});function x2(r){C(Array.isArray(r),()=>"The argument passed to tf.addN() must be a list of tensors"),C(r.length>=1,()=>`Must pass at least one tensor to tf.addN(), but got ${r.length}`);let e=r.map((n,s)=>b(n,`tensors${s}`,"addN")),t=e[0];e.forEach(n=>{if(n.dtype!==t.dtype)throw new Error("All tensors passed to tf.addN() must have the same dtype")}),e.forEach(n=>{if(!Et(n.shape,t.shape))throw new Error("All tensors passed to tf.addN() must have the same shape")});let o=e;return S.runKernel($i,o)}var zg=w({addN_:x2});function y2(r,e=null,t=!1){let n={x:b(r,"x","all","bool")},s={axis:e,keepDims:t};return S.runKernel("All",n,s)}var Hg=w({all_:y2});function b2(r,e=null,t=!1){let n={x:b(r,"x","any","bool")},s={axis:e,keepDims:t};return S.runKernel("Any",n,s)}var qg=w({any_:b2});function w2(r,e=0){let o={x:b(r,"x","argMax")},n={axis:e};return S.runKernel(Ri,o,n)}var qu=w({argMax_:w2});function v2(r,e=0){let o={x:b(r,"x","argMin")},n={axis:e};return S.runKernel(Ai,o,n)}var Xg=w({argMin_:v2});function T2(r){let t={x:b(r,"x","asin")};return S.runKernel(_i,t)}var jg=w({asin_:T2});function S2(r){let t={x:b(r,"x","asinh")};return S.runKernel(Di,t)}var Yg=w({asinh_:S2});function C2(r){let t={x:b(r,"x","atan")};return S.runKernel(Oi,t)}var Qg=w({atan_:C2});function N2(r,e){let t=b(r,"a","atan2"),o=b(e,"b","atan2");[t,o]=te(t,o);let n={a:t,b:o};return S.runKernel(Pi,n)}var Zg=w({atan2_:N2});function E2(r){let t={x:b(r,"x","atanh")};return S.runKernel(Fi,t)}var Jg=w({atanh_:E2});function I2(r,e,t,o,n="NHWC",s){let i=r[3],a=[...e,i],u=tx(n);return Oo(r,a,t,s,o,null,null,u)}function Zm(r,e,t,o,n,s,i="channelsLast"){let[a,u]=Gs(e),l;if(i==="channelsLast")l=[a,u,r[3],r[3]];else if(i==="channelsFirst")l=[a,u,r[1],r[1]];else throw new Error(`Unknown dataFormat ${i}`);return Oo(r,l,t,o,n,s,!1,i)}function k2(r,e,t,o,n,s,i="NDHWC"){let[a,u,l]=Qm(e),c,p;if(i==="NDHWC")p="channelsLast",c=[a,u,l,r[4],r[4]];else if(i==="NCDHW")p="channelsFirst",c=[a,u,l,r[1],r[1]];else throw new Error(`Unknown dataFormat ${i}`);return ex(r,c,t,o,n,!1,p,s)}function Oo(r,e,t,o,n,s,i=!1,a="channelsLast"){let[u,l,c,p]=[-1,-1,-1,-1];if(a==="channelsLast")[u,l,c,p]=r;else if(a==="channelsFirst")[u,p,l,c]=r;else throw new Error(`Unknown dataFormat ${a}`);let[m,f,,d]=e,[g,h]=Gs(t),[x,v]=Gs(o),N=Kn(m,x),E=Kn(f,v),{padInfo:k,outHeight:R,outWidth:A}=A2(n,l,c,g,h,N,E,s,a),_=i?d*p:d,O;return a==="channelsFirst"?O=[u,_,R,A]:a==="channelsLast"&&(O=[u,R,A,_]),{batchSize:u,dataFormat:a,inHeight:l,inWidth:c,inChannels:p,outHeight:R,outWidth:A,outChannels:_,padInfo:k,strideHeight:g,strideWidth:h,filterHeight:m,filterWidth:f,effectiveFilterHeight:N,effectiveFilterWidth:E,dilationHeight:x,dilationWidth:v,inShape:r,outShape:O,filterShape:e}}function ex(r,e,t,o,n,s=!1,i="channelsLast",a){let[u,l,c,p,m]=[-1,-1,-1,-1,-1];if(i==="channelsLast")[u,l,c,p,m]=r;else if(i==="channelsFirst")[u,m,l,c,p]=r;else throw new Error(`Unknown dataFormat ${i}`);let[f,d,g,,h]=e,[x,v,N]=Qm(t),[E,k,R]=Qm(o),A=Kn(f,E),_=Kn(d,k),O=Kn(g,R),{padInfo:F,outDepth:B,outHeight:M,outWidth:z}=_2(n,l,c,p,x,v,N,A,_,O,a),j=s?h*m:h,Z;return i==="channelsFirst"?Z=[u,j,B,M,z]:i==="channelsLast"&&(Z=[u,B,M,z,j]),{batchSize:u,dataFormat:i,inDepth:l,inHeight:c,inWidth:p,inChannels:m,outDepth:B,outHeight:M,outWidth:z,outChannels:j,padInfo:F,strideDepth:x,strideHeight:v,strideWidth:N,filterDepth:f,filterHeight:d,filterWidth:g,effectiveFilterDepth:A,effectiveFilterHeight:_,effectiveFilterWidth:O,dilationDepth:E,dilationHeight:k,dilationWidth:R,inShape:r,outShape:Z,filterShape:e}}function $2(r,e,t,o,n){o==null&&(o=Jm(r,e,t));let s=r[0],i=r[1],a=zs((s-e+2*o)/t+1,n),u=zs((i-e+2*o)/t+1,n);return[a,u]}function R2(r,e,t,o,n,s){n==null&&(n=Jm(r,e[0],o[0]));let i=[0,0,0,t];for(let a=0;a<3;a++)r[a]+2*n>=e[a]&&(i[a]=zs((r[a]-e[a]+2*n)/o[a]+1,s));return i}function Jm(r,e,t,o=1){let n=Kn(e,o);return Math.floor((r[0]*(t-1)-t+n)/2)}function Gs(r){return typeof r=="number"?[r,r,r]:r.length===2?[r[0],r[1],1]:r}function Qm(r){return typeof r=="number"?[r,r,r]:r}function Kn(r,e){return e<=1?r:r+(r-1)*(e-1)}function A2(r,e,t,o,n,s,i,a,u){let l,c,p;if(typeof r=="number"){l={top:r,bottom:r,left:r,right:r,type:r===0?"VALID":"NUMBER"};let f=$2([e,t],s,o,r,a);c=f[0],p=f[1]}else if(r==="same"){c=Math.ceil(e/o),p=Math.ceil(t/n);let m=Math.max(0,(c-1)*o+s-e),f=Math.max(0,(p-1)*n+i-t),d=Math.floor(m/2),g=m-d,h=Math.floor(f/2),x=f-h;l={top:d,bottom:g,left:h,right:x,type:"SAME"}}else if(r==="valid")l={top:0,bottom:0,left:0,right:0,type:"VALID"},c=Math.ceil((e-s+1)/o),p=Math.ceil((t-i+1)/n);else if(typeof r=="object"){let m=u==="channelsLast"?r[1][0]:r[2][0],f=u==="channelsLast"?r[1][1]:r[2][1],d=u==="channelsLast"?r[2][0]:r[3][0],g=u==="channelsLast"?r[2][1]:r[3][1];l={top:m,bottom:f,left:d,right:g,type:m===0&&f===0&&d===0&&g===0?"VALID":"EXPLICIT"},c=zs((e-s+m+f)/o+1,a),p=zs((t-i+d+g)/n+1,a)}else throw Error(`Unknown padding parameter: ${r}`);return{padInfo:l,outHeight:c,outWidth:p}}function _2(r,e,t,o,n,s,i,a,u,l,c){let p,m,f,d;if(r==="valid"&&(r=0),typeof r=="number"){p={top:r,bottom:r,left:r,right:r,front:r,back:r,type:r===0?"VALID":"NUMBER"};let h=R2([e,t,o,1],[a,u,l],1,[n,s,i],r,c);m=h[0],f=h[1],d=h[2]}else if(r==="same"){m=Math.ceil(e/n),f=Math.ceil(t/s),d=Math.ceil(o/i);let g=(m-1)*n+a-e,h=(f-1)*s+u-t,x=(d-1)*i+l-o,v=Math.floor(g/2),N=g-v,E=Math.floor(h/2),k=h-E,R=Math.floor(x/2),A=x-R;p={top:E,bottom:k,left:R,right:A,front:v,back:N,type:"SAME"}}else throw Error(`Unknown padding parameter: ${r}`);return{padInfo:p,outDepth:m,outHeight:f,outWidth:d}}function zs(r,e){if(!e)return Math.trunc(r);switch(e){case"round":return Math.round(r);case"ceil":return Math.ceil(r);case"floor":return Math.floor(r);default:throw new Error(`Unknown roundingMode ${e}`)}}function Do(r){let[e,t,o]=Gs(r);return e===1&&t===1&&o===1}function Ze(r,e){return Do(r)||Do(e)}function dr(r){return Gs(r).every(e=>e>0)}function tx(r){if(r==="NHWC")return"channelsLast";if(r==="NCHW")return"channelsFirst";throw new Error(`Unknown dataFormat ${r}`)}function Fe(r,e,t){if(t!=null){if(typeof e=="string")throw Error(`Error in ${r}: pad must be an integer when using dimRoundingMode ${t} but got pad ${e}.`);if(typeof e=="number")C(Nr(e),()=>`Error in ${r}: pad must be an integer when using dimRoundingMode ${t} but got pad ${e}.`);else if(typeof e=="object")e.forEach(o=>{o.forEach(n=>{C(Nr(n),()=>`Error in ${r}: pad must be an integer when using dimRoundingMode ${t} but got pad ${n}.`)})});else throw Error(`Error in ${r}: Unknown padding parameter: ${e}`)}}function D2(r,e){let o={x:b(r,"x","reshape","string_or_numeric")},n={shape:e};return S.runKernel(qa,o,n)}var D=w({reshape_:D2});function O2(r,e,t,o,n){let s=b(r,"x","avgPool","float32"),i=1;C(Ze(t,i),()=>`Error in avgPool: Either strides or dilations must be 1. Got strides ${t} and dilations '${i}'`);let a=s,u=!1;s.rank===3&&(u=!0,a=D(s,[1,s.shape[0],s.shape[1],s.shape[2]])),C(a.rank===4,()=>`Error in avgPool: x must be rank 4 but got rank ${a.rank}.`),Fe("avgPool",o,n);let l={x:a},c={filterSize:e,strides:t,pad:o,dimRoundingMode:n},p=S.runKernel(Li,l,c);return p=ee(p,s.dtype),u?D(p,[p.shape[1],p.shape[2],p.shape[3]]):p}var Xu=w({avgPool_:O2});function F2(r,e,t,o,n,s="NDHWC"){let i=b(r,"x","avgPool3d","float32"),a=i,u=!1;i.rank===4&&(u=!0,a=D(i,[1,i.shape[0],i.shape[1],i.shape[2],i.shape[3]])),C(a.rank===5,()=>`Error in avgPool3d: x must be rank 5 but got rank ${a.rank}.`),C(s==="NDHWC",()=>`Error in avgPool3d: Only NDHWC is currently supported, but got dataFormat of ${s}`),C(typeof t=="number"&&t>0||Array.isArray(t)&&t[0]>0&&t[1]>0&&t[2]>0,()=>`Error in avgPool3d: Stride must be > 0, but got '${t}'`),Fe("avgPool3d",o,n);let l={x:a},c={filterSize:e,strides:t,pad:o,dimRoundingMode:n,dataFormat:s},p=S.runKernel(Bi,l,c);return p=ee(p,a.dtype),u?D(p,[p.shape[1],p.shape[2],p.shape[3],p.shape[4]]):p}var rx=w({avgPool3d_:F2});function P2(r,e=0){C(r.length>=1,()=>"Pass at least one tensor to concat");let t=Ao(r,"tensors","concat","string_or_numeric");if(t[0].dtype==="complex64"&&t.forEach(s=>{if(s.dtype!=="complex64")throw new Error(`Cannot concatenate complex64 tensors with a tensor
          with dtype ${s.dtype}. `)}),t.length===1)return $t(t[0]);let o=t,n={axis:e};return S.runKernel(Hi,o,n)}var xe=w({concat_:P2});function L2(r,e,t=!1,o=!1){let n=b(r,"a","matMul"),s=b(e,"b","matMul");[n,s]=te(n,s);let i={a:n,b:s},a={transposeA:t,transposeB:o};return S.runKernel(Mi,i,a)}var ue=w({matMul_:L2});function B2(r){let t={x:b(r,"x","sigmoid","float32")};return S.runKernel($n,t)}var Rt=w({sigmoid_:B2});function M2(r,e,t){let o=b(r,"x","slice","string_or_numeric");if(o.rank===0)throw new Error("Slicing scalar is not possible");let n={x:o},s={begin:e,size:t};return S.runKernel(As,n,s)}var Q=w({slice_:M2});function V2(r){let t={x:b(r,"x","tanh","float32")};return S.runKernel(bu,t)}var Ws=w({tanh_:V2});function U2(r,e,t,o,n,s){let i=b(r,"forgetBias","basicLSTMCell"),a=b(e,"lstmKernel","basicLSTMCell"),u=b(t,"lstmBias","basicLSTMCell"),l=b(o,"data","basicLSTMCell"),c=b(n,"c","basicLSTMCell"),p=b(s,"h","basicLSTMCell"),m=xe([l,p],1),f=ue(m,a),d=V(f,u),g=d.shape[0],h=d.shape[1]/4,x=[g,h],v=Q(d,[0,0],x),N=Q(d,[0,h],x),E=Q(d,[0,h*2],x),k=Q(d,[0,h*3],x),R=V(P(Rt(v),Ws(N)),P(c,Rt(V(i,E)))),A=P(Ws(R),Rt(k));return[R,A]}var ox=w({basicLSTMCell_:U2});function G2(r,e,t){let o=b(r,"x","batchToSpaceND"),n=e.reduce((a,u)=>a*u);C(o.rank>=1+e.length,()=>`input rank is ${o.rank} but should be > than blockShape.length ${e.length}`),C(t.length===e.length,()=>`crops.length is ${t.length} but should be equal to blockShape.length  ${e.length}`),C(o.shape[0]%n===0,()=>`input tensor batch is ${o.shape[0]} but is not divisible by the product of the elements of blockShape ${e.join(" * ")} === ${n}`);let s={x:o},i={blockShape:e,crops:t};return S.runKernel(Vi,s,i)}var ju=w({batchToSpaceND_:G2});function nx(r){let e;return r.rank===0||r.rank===1?e=D(r,[1,1,1,r.size]):r.rank===2?e=D(r,[1,1,r.shape[0],r.shape[1]]):r.rank===3?e=D(r,[1,r.shape[0],r.shape[1],r.shape[2]]):e=r,e}function z2(r,e,t,o,n,s){s==null&&(s=.001);let i=b(r,"x","batchNorm"),a=b(e,"mean","batchNorm"),u=b(t,"variance","batchNorm"),l;n!=null&&(l=b(n,"scale","batchNorm"));let c;o!=null&&(c=b(o,"offset","batchNorm")),C(a.rank===u.rank,()=>"Batch normalization gradient requires mean and variance to have equal ranks."),C(c==null||a.rank===c.rank,()=>"Batch normalization gradient requires mean and offset to have equal ranks."),C(l==null||a.rank===l.rank,()=>"Batch normalization gradient requires mean and scale to have equal ranks.");let m={x:nx(i),scale:l,offset:c,mean:a,variance:u},f={varianceEpsilon:s},d=S.runKernel(fa,m,f);return D(d,i.shape)}var Qr=w({batchNorm_:z2});function W2(r,e,t,o,n,s){let i=b(r,"x","batchNorm"),a=b(e,"mean","batchNorm"),u=b(t,"variance","batchNorm"),l;n!=null&&(l=b(n,"scale","batchNorm"));let c;return o!=null&&(c=b(o,"offset","batchNorm")),C(i.rank===2,()=>`Error in batchNorm2D: x must be rank 2 but got rank ${i.rank}.`),C(a.rank===2||a.rank===1,()=>`Error in batchNorm2D: mean must be rank 2 or rank 1 but got rank ${a.rank}.`),C(u.rank===2||u.rank===1,()=>`Error in batchNorm2D: variance must be rank 2 or rank 1 but got rank ${u.rank}.`),l!=null&&C(l.rank===2||l.rank===1,()=>`Error in batchNorm2D: scale must be rank 2 or rank 1 but got rank ${l.rank}.`),c!=null&&C(c.rank===2||c.rank===1,()=>`Error in batchNorm2D: offset must be rank 2 or rank 1 but got rank ${c.rank}.`),Qr(i,a,u,c,l,s)}var sx=w({batchNorm2d_:W2});function H2(r,e,t,o,n,s){let i=b(r,"x","batchNorm"),a=b(e,"mean","batchNorm"),u=b(t,"variance","batchNorm"),l;n!=null&&(l=b(n,"scale","batchNorm"));let c;return o!=null&&(c=b(o,"offset","batchNorm")),C(i.rank===3,()=>`Error in batchNorm3D: x must be rank 3 but got rank ${i.rank}.`),C(a.rank===3||a.rank===1,()=>`Error in batchNorm3D: mean must be rank 3 or rank 1 but got rank ${a.rank}.`),C(u.rank===3||u.rank===1,()=>`Error in batchNorm3D: variance must be rank 3 or rank 1 but got rank ${u.rank}.`),l!=null&&C(l.rank===3||l.rank===1,()=>`Error in batchNorm3D: scale must be rank 3 or rank 1 but got rank ${l.rank}.`),c!=null&&C(c.rank===3||c.rank===1,()=>`Error in batchNorm3D: offset must be rank 3 or rank 1 but got rank ${c.rank}.`),Qr(i,a,u,c,l,s)}var ix=w({batchNorm3d_:H2});function K2(r,e,t,o,n,s){let i=b(r,"x","batchNorm"),a=b(e,"mean","batchNorm"),u=b(t,"variance","batchNorm"),l;n!=null&&(l=b(n,"scale","batchNorm"));let c;return o!=null&&(c=b(o,"offset","batchNorm")),C(i.rank===4,()=>`Error in batchNorm4D: x must be rank 4 but got rank ${i.rank}.`),C(a.rank===4||a.rank===1,()=>`Error in batchNorm4D: mean must be rank 4 or rank 1 but got rank ${a.rank}.`),C(u.rank===4||u.rank===1,()=>`Error in batchNorm4D: variance must be rank 4 or rank 1 but got rank ${u.rank}.`),l!=null&&C(l.rank===4||l.rank===1,()=>`Error in batchNorm4D: scale must be rank 4 or rank 1 but got rank ${l.rank}.`),c!=null&&C(c.rank===4||c.rank===1,()=>`Error in batchNorm4D: offset must be rank 4 or rank 1 but got rank ${c.rank}.`),Qr(i,a,u,c,l,s)}var ax=w({batchNorm4d_:K2});function q2(r,e,t){let o=b(r,"x","bincount"),n=b(e,"weights","bincount");C(o.dtype==="int32",()=>`Error in bincount: input dtype must be int32, but got ${o.dtype}`),C(t>=0,()=>`size must be non-negative, but got ${t}.`),C(n.size===o.size||n.size===0,()=>`Error in bincount: weights must have the same size as input or0-length, but got input shape: ${o.shape}, weights shape: ${n.shape}.`);let s={x:o,weights:n},i={size:t};return S.runKernel(Ui,s,i)}var Yu=w({bincount_:q2});function X2(r,e){let t=b(r,"x","bitwiseAnd"),o=b(e,"y","bitwiseAnd");if(!Et(t.shape,o.shape))throw new Error(`BitwiseAnd: Tensors must have the same shape. x: ${t.shape}, y: ${o.shape}`);if(t.dtype!=="int32"||o.dtype!=="int32")throw new Error(`BitwiseAnd: Only supports 'int32' values in tensor, found type of x: ${t.dtype} and type of y: ${o.dtype}`);let n={a:t,b:o};return S.runKernel(dn,n)}var ux=w({bitwiseAnd_:X2});function j2(r,e){let t=b(r,"s0","broadcastArgs","int32"),o=b(e,"s1","broadcastArgs","int32");if(t.rank!==1)throw new Error(`broadcastArgs(): first input must be a vector (rank=1). Has rank ${t.rank}`);if(o.rank!==1)throw new Error(`broadcastArgs(): second input must be a vector (rank=1). Has rank ${o.rank}`);let n={s0:t,s1:o};return S.runKernel(Gi,n)}var lx=w({broadcastArgs_:j2});function Y2(r,e){let t=b(r,"broadcastTo","x"),o=t.shape;if(Ce(e),e.length<t.rank)throw new Error(`broadcastTo(): shape.length=${e.length} < input.rank=${t.rank}.`);if(e.length>t.rank){let l=t.shape.slice();for(;l.length<e.length;)l.unshift(1);t=D(t,l)}let n=t.shape,s=Array.from(e);for(let l=e.length-1;l>=0;l--)if(n[l]===e[l])s[l]=1;else if(t.shape[l]!==1)throw new Error(`broadcastTo(): [${o}] cannot be broadcast to [${e}].`);if(s.map((l,c)=>l>1?c:-1).filter(l=>l>=0).length===0)return $t(t);let a={x:t},u={reps:s};return S.runKernel(Dn,a,u)}var Zr=w({broadcastTo_:Y2});function Q2(r){let t={x:b(r,"x","ceil","float32")};return S.runKernel(hn,t)}var cx=w({ceil_:Q2});function gr(r,e,t){Ce(r),t=t||Wr(e);let o={shape:r,value:e,dtype:t};return S.runKernel(pa,{},o)}function Z2(r,e,t){let o=b(r,"x","clipByValue");if(C(e<=t,()=>`Error in clip: min (${e}) must be less than or equal to max (${t}).`),e===t)return gr(o.shape,e,o.dtype);let n={x:o},s={clipValueMin:e,clipValueMax:t};return S.runKernel(zi,n,s)}var Qu=w({clipByValue_:Z2});function J2(r){return xe(r,0)}var px=w({concat1d_:J2});function ek(r,e){return xe(r,e)}var mx=w({concat2d_:ek});function tk(r,e){return xe(r,e)}var fx=w({concat3d_:tk});function rk(r,e){return xe(r,e)}var dx=w({concat4d_:rk});function ok(r,e,t,o,n="NHWC",s=[1,1],i){let a=b(r,"x","conv2d","float32"),u=b(e,"filter","conv2d","float32"),l=a,c=!1;a.rank===3&&(c=!0,l=D(a,[1,a.shape[0],a.shape[1],a.shape[2]])),C(l.rank===4,()=>`Error in conv2d: input must be rank 4, but got rank ${l.rank}.`),C(u.rank===4,()=>`Error in conv2d: filter must be rank 4, but got rank ${u.rank}.`),Fe("conv2d",o,i);let p=n==="NHWC"?l.shape[3]:l.shape[1];C(p===u.shape[2],()=>`Error in conv2d: depth of input (${p}) must match input depth for filter ${u.shape[2]}.`),C(Ze(t,s),()=>`Error in conv2D: Either strides or dilations must be 1. Got strides ${t} and dilations '${s}'`),C(dr(s),()=>"Error in conv2D: Dilated rates should be larger than 0."),C(dr(t),()=>"Error in conv2D: Strides should be larger than 0.");let m={x:l,filter:u},f={strides:t,pad:o,dataFormat:n,dilations:s,dimRoundingMode:i},d=S.runKernel(Ki,m,f);return c?D(d,[d.shape[1],d.shape[2],d.shape[3]]):d}var Jr=w({conv2d_:ok});function nk(r,e,t,o,n="NWC",s=1,i){let a=b(r,"x","conv1d"),u=b(e,"filter","conv1d"),l=a,c=!1;a.rank===2&&(c=!0,l=D(a,[1,a.shape[0],a.shape[1]])),C(l.rank===3,()=>`Error in conv1d: input must be rank 3, but got rank ${l.rank}.`),C(u.rank===3,()=>`Error in conv1d: filter must be rank 3, but got rank ${u.rank}.`),Fe("conv1d",o,i),C(l.shape[2]===u.shape[1],()=>`Error in conv1d: depth of input (${l.shape[2]}) must match input depth for filter ${u.shape[1]}.`),C(Ze(t,s),()=>`Error in conv1D: Either stride or dilation must be 1. Got stride ${t} and dilation '${s}'`),C(dr(s),()=>"Error in conv1D: Dilated rates should be larger than 0."),C(dr(t),()=>"Error in conv1D: Stride should be larger than 0."),C(n==="NWC",()=>`Error in conv1d: got dataFormat of ${n} but only NWC is currently supported.`);let p=D(u,[1,u.shape[0],u.shape[1],u.shape[2]]),m=D(l,[l.shape[0],1,l.shape[1],l.shape[2]]),h=Jr(m,p,[1,t],o,"NHWC",[1,s],i);return c?D(h,[h.shape[2],h.shape[3]]):D(h,[h.shape[0],h.shape[2],h.shape[3]])}var hx=w({conv1d_:nk});function sk(r,e,t,o,n,s="NHWC",i){C(r.length===e.rank,()=>`Length of inShape (${r.length}) and rank of dy (${e.rank}) must match`);let a=r,u=e,l=!1;e.rank===3&&(l=!0,u=D(e,[1,e.shape[0],e.shape[1],e.shape[2]]),a=[1,r[0],r[1],r[2]]),C(a.length===4,()=>`Error in conv2dDerInput: inShape must be length 4, but got length ${a.length}.`),C(u.rank===4,()=>`Error in conv2dDerInput: dy must be rank 4, but got rank ${u.rank}`),C(t.rank===4,()=>`Error in conv2dDerInput: filter must be rank 4, but got rank ${t.rank}`);let c=s==="NHWC"?a[3]:a[1],p=s==="NHWC"?u.shape[3]:u.shape[1];C(c===t.shape[2],()=>`Error in conv2dDerInput: depth of input (${c}) must match input depth for filter ${t.shape[2]}.`),C(p===t.shape[3],()=>`Error in conv2dDerInput: depth of output (${p}) must match output depth for filter ${t.shape[3]}.`),Fe("conv2dDerInput",n,i);let m={dy:u,filter:t},f={strides:o,pad:n,dataFormat:s,dimRoundingMode:i,inputShape:a},d=S.runKernel(Xi,m,f);return l?D(d,[d.shape[1],d.shape[2],d.shape[3]]):d}var Zu=w({conv2DBackpropInput_:sk});function ik(r,e,t,o,n,s){let i=b(r,"x","conv2dTranspose"),a=b(e,"filter","conv2dTranspose");return Zu(t,i,a,o,n,"NHWC",s)}var gx=w({conv2dTranspose_:ik});function ak(r,e,t,o,n="NDHWC",s=[1,1,1]){let i=b(r,"x","conv3d"),a=b(e,"filter","conv3d"),u=i,l=!1;i.rank===4&&(l=!0,u=D(i,[1,i.shape[0],i.shape[1],i.shape[2],i.shape[3]])),C(u.rank===5,()=>`Error in conv3d: input must be rank 5, but got rank ${u.rank}.`),C(a.rank===5,()=>`Error in conv3d: filter must be rank 5, but got rank ${a.rank}.`),C(u.shape[4]===a.shape[3],()=>`Error in conv3d: depth of input (${u.shape[4]}) must match input depth for filter ${a.shape[3]}.`),C(Ze(t,s),()=>`Error in conv3D: Either strides or dilations must be 1. Got strides ${t} and dilations '${s}'`),C(n==="NDHWC",()=>`Error in conv3d: got dataFormat of ${n} but only NDHWC is currently supported.`),C(dr(s),()=>"Error in conv3D: Dilated rates should be larger than 0."),C(dr(t),()=>"Error in conv3D: Strides should be larger than 0.");let c={x:u,filter:a},p={strides:t,pad:o,dataFormat:n,dilations:s},m=S.runKernel(ji,c,p);return l?D(m,[m.shape[1],m.shape[2],m.shape[3],m.shape[4]]):m}var xx=w({conv3d_:ak});function uk(r,e,t,o,n){C(r.length===e.rank,()=>`Length of inShape (${r.length}) and rank of dy (${e.rank}) must match`);let s=r,i=e,a=!1;e.rank===4&&(a=!0,i=D(e,[1,e.shape[0],e.shape[1],e.shape[2],e.shape[3]]),s=[1,r[0],r[1],r[2],r[3]]);let u=s[4],l=i.shape[4];C(s.length===5,()=>`Error in conv3dDerInput: inShape must be length 5, but got length ${s.length}.`),C(i.rank===5,()=>`Error in conv3dDerInput: dy must be rank 5, but got rank ${i.rank}`),C(t.rank===5,()=>`Error in conv3dDerInput: filter must be rank 5, but got rank ${t.rank}`),C(u===t.shape[3],()=>`Error in conv3dDerInput: depth of input (${u}) must match input depth for filter ${t.shape[3]}.`),C(l===t.shape[4],()=>`Error in conv3dDerInput: depth of output (${l}) must match output depth for filter ${t.shape[4]}.`);let c={dy:i,filter:t},p={pad:n,strides:o,inputShape:s},m=S.runKernel(Yi,c,p);return a?D(m,[m.shape[1],m.shape[2],m.shape[3],m.shape[4]]):m}var yx=w({conv3DBackpropInput_:uk});function lk(r,e,t,o,n){let s=b(r,"x","conv3dTranspose"),i=b(e,"filter","conv3dTranspose");return yx(t,s,i,o,n)}var bx=w({conv3dTranspose_:lk});function ck(r){let t={x:b(r,"x","cos","float32")};return S.runKernel("Cos",t)}var vx=w({cos_:ck});function pk(r){let t={x:b(r,"x","cosh","float32")};return S.runKernel(Qi,t)}var Tx=w({cosh_:pk});function mk(r,e=0,t=!1,o=!1){let s={x:b(r,"x","cumprod")},i={axis:e,exclusive:t,reverse:o};return S.runKernel(Zi,s,i)}var Sx=w({cumprod_:mk});function fk(r,e=0,t=!1,o=!1){let s={x:b(r,"x","cumsum")},i={axis:e,exclusive:t,reverse:o};return S.runKernel(Ji,s,i)}var Cx=w({cumsum_:fk});function dk(r,e,t,o=!1){let n=b(r,"x","denseBincount"),s=b(e,"weights","denseBincount");C(n.dtype==="int32",()=>`Error in denseBincount: input dtype must be int32, but got ${n.dtype}`),C(n.rank<=2,()=>`Error in denseBincount: input must be at most rank 2, but got rank ${n.rank}.`),C(t>=0,()=>`size must be non-negative, but got ${t}.`),C(s.size===n.size||s.size===0,()=>`Error in denseBincount: weights must have the same shape as x or 0-length, but got x shape: ${n.shape}, weights shape: ${s.shape}.`);let i={x:n,weights:s},a={size:t,binaryOutput:o};return S.runKernel(ta,i,a)}var Nx=w({denseBincount_:dk});function hk(r,e,t="NHWC"){let o=b(r,"x","depthToSpace","float32"),n=t==="NHWC"?o.shape[1]:o.shape[2],s=t==="NHWC"?o.shape[2]:o.shape[3],i=t==="NHWC"?o.shape[3]:o.shape[1];C(e>1,()=>`blockSize should be > 1 for depthToSpace, but was: ${e}`),C(n*e>=0,()=>`Negative dimension size caused by overflow when multiplying
    ${n} and ${e}  for depthToSpace with input shape
    ${o.shape}`),C(s*e>=0,()=>`Negative dimension size caused by overflow when multiplying
    ${s} and ${e} for depthToSpace with input shape
        ${o.shape}`),C(i%(e*e)===0,()=>`Dimension size must be evenly divisible by ${e*e} but is ${i} for depthToSpace with input shape ${o.shape}`);let a={x:o},u={blockSize:e,dataFormat:t};return S.runKernel(ra,a,u)}var Ex=w({depthToSpace_:hk});function gk(r,e,t,o,n="NHWC",s=[1,1],i){let a=b(r,"x","depthwiseConv2d","float32"),u=b(e,"filter","depthwiseConv2d","float32"),l=a,c=!1;a.rank===3&&(c=!0,l=D(a,[1,a.shape[0],a.shape[1],a.shape[2]])),C(l.rank===4,()=>`Error in depthwiseConv2d: input must be rank 4, but got rank ${l.rank}.`),C(u.rank===4,()=>`Error in depthwiseConv2d: filter must be rank 4, but got rank ${u.rank}.`);let p=n==="NHWC"?l.shape[3]:l.shape[1];C(p===u.shape[2],()=>`Error in depthwiseConv2d: number of input channels (${p}) must match the inChannels dimension in filter ${u.shape[2]}.`),Fe("depthwiseConv2d",o,i);let m={x:l,filter:u},f={strides:t,pad:o,dataFormat:n,dilations:s,dimRoundingMode:i},d=S.runKernel(oa,m,f);return c?D(d,[d.shape[1],d.shape[2],d.shape[3]]):d}var qn=w({depthwiseConv2d_:gk});function xk(r){let t={x:b(r,"x","diag")};return S.runKernel(ia,t)}var Ix=w({diag_:xk});function yk(r,e,t,o,n=[1,1],s="NHWC"){let i=b(r,"x","dilation2d"),a=b(e,"filter","dilation2d");C(i.rank===3||i.rank===4,()=>`Error in dilation2d: input must be rank 3 or 4, but got rank ${i.rank}.`),C(a.rank===3,()=>`Error in dilation2d: filter must be rank 3, but got rank ${a.rank}.`),C(s==="NHWC",()=>`Error in dilation2d: Only NHWC is currently supported, but got dataFormat of ${s}`);let u=i,l=!1;i.rank===3&&(u=D(i,[1,i.shape[0],i.shape[1],i.shape[2]]),l=!0),C(u.shape[3]===a.shape[2],()=>`Error in dilation2d:  input and filter must have the same depth: ${u.shape[3]} vs ${a.shape[2]}`);let c={x:u,filter:a},p={strides:t,pad:o,dilations:n},m=S.runKernel(aa,c,p);return l?D(m,[m.shape[1],m.shape[2],m.shape[3]]):m}var kx=w({dilation2d_:yk});var eo={};ye(eo,{assertAndGetBroadcastShape:()=>ae,getBroadcastDims:()=>$x,getReductionAxes:()=>Ju});function $x(r,e){let t=r.length,o=[];for(let n=0;n<t;n++){let s=t-1-n,i=r[s]||1;(e[e.length-1-n]||1)>1&&i===1&&o.unshift(s)}return o}function Ju(r,e){let t=[];for(let o=0;o<e.length;o++){let n=r[r.length-o-1],s=e.length-o-1,i=e[s];(n==null||n===1&&i>1)&&t.unshift(s)}return t}function ae(r,e){let t=Math.max(r.length,e.length),o=new Array(t);for(let n=0;n<t;n++){let s=r[r.length-n-1];s==null&&(s=1);let i=e[e.length-n-1];if(i==null&&(i=1),s===1)o[t-n-1]=i;else if(i===1)o[t-n-1]=s;else if(s!==i){let a=`Operands could not be broadcast together with shapes ${r} and ${e}.`;throw Error(a)}else o[t-n-1]=s}return o}function bk(r,e){let t=b(r,"a","equal","string_or_numeric"),o=b(e,"b","equal","string_or_numeric");[t,o]=te(t,o),ae(t.shape,o.shape);let n={a:t,b:o};return S.runKernel(gn,n)}var el=w({equal_:bk});function wk(r,e,t){let o=b(e,"a","where"),n=b(t,"b","where"),s=b(r,"condition","where","bool"),i=ae(ae(s.shape,o.shape),n.shape),a=Zr(s,i),u=Zr(o,i),l=Zr(n,i),c={condition:a,t:u,e:l};return S.runKernel(ru,c)}var Ut=w({where_:wk});function vk(r){let t={x:b(r,"x","zerosLike")};return S.runKernel(Nu,t)}var Be=w({zerosLike_:vk});function Tk(r,e){let t=b(r,"a","div"),o=b(e,"b","div");[t,o]=te(t,o);let n=Y(t,o),s=Be(n),i=el(o,s);return Ut(i,s,n)}var Rx=w({divNoNan_:Tk});function Sk(r,e){let t=b(r,"t1","dot"),o=b(e,"t2","dot");C((t.rank===1||t.rank===2)&&(o.rank===1||o.rank===2),()=>`Error in dot: inputs must all be rank 1 or 2, but got ranks ${t.rank} and ${o.rank}.`);let n=t.rank===1?t.size:t.shape[1],s=o.rank===1?o.size:o.shape[0];if(C(n===s,()=>`Error in dot: inner dimensions of inputs must match, but got ${n} and ${s}.`),t.rank===1&&o.rank===1){let i=D(t,[1,-1]),a=D(o,[-1,1]),u=ue(i,a);return D(u,[])}else if(t.rank===1&&o.rank===2){let i=D(t,[1,-1]),a=D(o,[o.shape[0],o.shape[1]]),u=ue(i,a);return D(u,[u.size])}else if(t.rank===2&&o.rank===1){let i=D(o,[-1,1]),a=ue(t,i);return D(a,[a.size])}else{let i=D(o,[o.shape[0],o.shape[1]]);return ue(t,i)}}var Ax=w({dot_:Sk});function Ck(r,...e){let t=e.map((n,s)=>b(n,`tensors${s}`,"einsum")),o={equation:r};return S.runKernel(la,t,o)}var to=w({einsum_:Ck});function Nk(r){let t={x:b(r,"x","elu","float32")};return S.runKernel("Elu",t)}var tl=w({elu_:Nk});function Ek(r,e){let t=b(r,"x","ensureShape","string_or_numeric");if(!fm(t.shape,e))throw new Error(`EnsureShape: Shape of tensor ${t.shape} is not compatible with expected shape ${e}`);return r}var Dx=w({ensureShape_:Ek});function Ik(r){let e=b(r,"x","erf");C(e.dtype==="int32"||e.dtype==="float32",()=>"Input dtype must be `int32` or `float32`."),e.dtype==="int32"&&(e=ee(e,"float32"));let t={x:e};return S.runKernel("Erf",t)}var Fx=w({erf_:Ik});function ef(r,e){for(let t=0;t<r.length;++t)if(r[r.length-t-1]!==e-1-t)return!1;return!0}function Px(r,e,t){let o=r.length+e.length,n=[],s=0,i=0;for(let a=0;a<o;a++)t.indexOf(a)===-1?n.push(r[s++]):n.push(e[i++]);return n}function kk(r,e){let t=[],o=r.length;for(let s=0;s<o;s++)e.indexOf(s)===-1&&t.push(r[s]);let n=e.map(s=>r[s]);return[t,n]}function Ar(r,e){let t=e.map(o=>1);return Px(r,t,e)}function $k(r,e,t){C(ef(e,t),()=>`${r} supports only inner-most axes for now. Got axes ${e} and rank-${t} input.`)}function Rk(r,e){if(ef(r,e))return null;let t=[];for(let o=0;o<e;++o)r.indexOf(o)===-1&&t.push(o);return r.forEach(o=>t.push(o)),t}function Ak(r){return r.map((e,t)=>[t,e]).sort((e,t)=>e[1]-t[1]).map(e=>e[0])}function _k(r,e){let t=[];for(let o=e-r;o<e;++o)t.push(o);return t}function Ok(r,e=null,t=!1){let n={x:b(r,"x","max")},s={reductionIndices:e,keepDims:t};return S.runKernel("Max",n,s)}var xr=w({max_:Ok});function Fk(r,e=null,t=!1){let n={x:b(r,"x","min")},s={axis:e,keepDims:t};return S.runKernel("Min",n,s)}var Hs=w({min_:Fk});function Pk(r,e){let t=b(r,"base","pow"),o=b(e,"exp","pow");[t,o]=te(t,o);let n={a:t,b:o};return S.runKernel("Pow",n)}var _r=w({pow_:Pk});function K(r,e){if((Ye(r)&&e!=="string"||Array.isArray(r))&&e!=="complex64")throw new Error("Error creating a new Scalar: value must be a primitive (number|boolean|string)");if(e==="string"&&Ye(r)&&!(r instanceof Uint8Array))throw new Error("When making a scalar from encoded string, the value must be `Uint8Array`.");return rt(r,[],[],e)}function Lk(r){let t={x:b(r,"x","sqrt","float32")};return S.runKernel(Rn,t)}var dt=w({sqrt_:Lk});function Bk(r){let e=b(r,"x","square"),t={};return S.runKernel("Square",{x:e},t)}var Me=w({square_:Bk});function Mk(r,e=null,t=!1){let o=b(r,"x","sum");o.dtype==="bool"&&(o=ee(o,"int32"));let n={x:o},s={axis:e,keepDims:t};return S.runKernel("Sum",n,s)}var le=w({sum_:Mk});function Vk(r,e="euclidean",t=null,o=!1){r=b(r,"x","norm");let n=Ux(r,e,t),s=n.shape;if(o){let i=zr(t,r.shape);s=Ar(n.shape,i)}return D(n,s)}function Ux(r,e,t=null){if(r.rank===0)return ze(r);if(r.rank!==1&&t===null)return Ux(D(r,[-1]),e,t);if(r.rank===1||typeof t=="number"||Array.isArray(t)&&t.length===1){if(e===1)return le(ze(r),t);if(e===1/0)return xr(ze(r),t);if(e===-1/0)return Hs(ze(r),t);if(e==="euclidean"||e===2)return dt(le(_r(ze(r),K(2,"int32")),t));throw new Error(`Error in norm: invalid ord value: ${e}`)}if(Array.isArray(t)&&t.length===2){if(e===1)return xr(le(ze(r),t[0]),t[1]-1);if(e===1/0)return xr(le(ze(r),t[1]),t[0]);if(e===-1/0)return Hs(le(ze(r),t[1]),t[0]);if(e==="fro"||e==="euclidean")return dt(le(Me(r),t));throw new Error(`Error in norm: invalid ord value: ${e}`)}throw new Error(`Error in norm: invalid axis: ${t}`)}var Fo=w({norm_:Vk});function Uk(r,e=null,t=!1){return Fo(r,"euclidean",e,t)}var Gx=w({euclideanNorm_:Uk});function Gk(r){let t={x:b(r,"x","exp")};return S.runKernel("Exp",t)}var ht=w({exp_:Gk});function zk(r,e=0){let t=b(r,"x","expandDims","string_or_numeric");C(e<=t.rank,()=>"Axis must be <= rank of the tensor");let o={input:t},n={dim:e};return S.runKernel(ca,o,n)}var Je=w({expandDims_:zk});function Wk(r){let t={x:b(r,"x","expm1")};return S.runKernel(xn,t)}var zx=w({expm1_:Wk});function Hk(r,e){let t=b(r,"x","tile","string_or_numeric");C(t.rank===e.length,()=>`Error in transpose: rank of input ${t.rank} must match length of reps ${e}.`);let o={x:t},n={reps:e};return S.runKernel(Dn,o,n)}var ro=w({tile_:Hk});function Kk(r,e,t,o="float32"){e==null&&(e=r);let n=oe([r,e],o),s=r<=e?r:e;for(let a=0;a<s;++a)n.set(1,a,a);let i=D(n.toTensor(),[r,e]);if(t==null)return i;if(t.length===1)return ro(Je(i,0),[t[0],1,1]);if(t.length===2)return ro(Je(Je(i,0),0),[t[0],t[1],1,1]);if(t.length===3)return ro(Je(Je(Je(i,0),0),0),[t[0],t[1],t[2],1,1]);throw new Error(`eye() currently supports only 1D and 2D batchShapes, but received ${t.length}D.`)}var ol=w({eye_:Kk});function qk(r){let t={x:b(r,"x","floor","float32")};return S.runKernel(yn,t)}var nl=w({floor_:qk});function Xk(r,e,t=0,o=0){let n=b(r,"x","gather"),s=b(e,"indices","gather","int32"),i={x:n,indices:s},a={axis:t,batchDims:o};return S.runKernel(da,i,a)}var sl=w({gather_:Xk});function jk(r,e){let t=b(r,"a","greater","string_or_numeric"),o=b(e,"b","greater","string_or_numeric");[t,o]=te(t,o),ae(t.shape,o.shape);let n={a:t,b:o};return S.runKernel(wn,n)}var Po=w({greater_:jk});function Yk(r,e){let t=b(r,"a","greaterEqual","string_or_numeric"),o=b(e,"b","greaterEqual","string_or_numeric");[t,o]=te(t,o),ae(t.shape,o.shape);let n={a:t,b:o};return S.runKernel(vn,n)}var il=w({greaterEqual_:Yk});function Qk(r){let t={input:b(r,"input","imag")};return S.runKernel(xa,t)}var oo=w({imag_:Qk});function Zk(r){let t={x:b(r,"x","isFinite")};return S.runKernel(ya,t)}var Wx=w({isFinite_:Zk});function Jk(r){let t={x:b(r,"x","isInf")};return S.runKernel(ba,t)}var Hx=w({isInf_:Jk});function e$(r){let t={x:b(r,"x","isNaN")};return S.runKernel(wa,t)}var Kx=w({isNaN_:e$});function t$(r,e=.2){let o={x:b(r,"x","leakyRelu")},n={alpha:e};return S.runKernel(va,o,n)}var al=w({leakyRelu_:t$});function r$(r,e){let t=b(r,"a","less","string_or_numeric"),o=b(e,"b","less","string_or_numeric");[t,o]=te(t,o),ae(t.shape,o.shape);let n={a:t,b:o};return S.runKernel(Tn,n)}var Ks=w({less_:r$});function o$(r,e){let t=b(r,"a","lessEqual","string_or_numeric"),o=b(e,"b","lessEqual","string_or_numeric");[t,o]=te(t,o),ae(t.shape,o.shape);let n={a:t,b:o};return S.runKernel(Sn,n)}var Xn=w({lessEqual_:o$});function qx(r,e,t){if(t<=0)throw new Error("The number of values should be positive.");let o={start:r,stop:e,num:t};return S.runKernel(Ta,{},o)}function n$(r,e=5,t=1,o=1,n=.5){let s=b(r,"x","localResponseNormalization");C(s.rank===4||s.rank===3,()=>`Error in localResponseNormalization: x must be rank 3 or 4 but got
               rank ${s.rank}.`),C(Nr(e),()=>`Error in localResponseNormalization: depthRadius must be an integer but got depthRadius ${e}.`);let i=s,a=!1;s.rank===3&&(a=!0,i=D(s,[1,s.shape[0],s.shape[1],s.shape[2]]));let u={x:i},l={depthRadius:e,bias:t,alpha:o,beta:n},c=S.runKernel("LRN",u,l);return a?D(c,[c.shape[1],c.shape[2],c.shape[3]]):c}var jx=w({localResponseNormalization_:n$});function s$(r){let t={x:b(r,"x","log","float32")};return S.runKernel("Log",t)}var Dr=w({log_:s$});function i$(r){let t={x:b(r,"x","log1p")};return S.runKernel(Sa,t)}var ll=w({log1p_:i$});function Yx(r,e){C(pn(r),()=>"The f passed in variableGrads(f) must be a function"),C(e==null||Array.isArray(e)&&e.every(l=>l instanceof Ir),()=>"The varList passed in variableGrads(f, varList) must be an array of variables");let t=e!=null;if(!t){e=[];for(let l in S.registeredVariables)e.push(S.registeredVariables[l])}let o=t?e.filter(l=>!l.trainable):null,n=e.length;e=e.filter(l=>l.trainable),C(e.length>0,()=>`variableGrads() expects at least one of the input variables to be trainable, but none of the ${n} variables is trainable.`);let s=!0,{value:i,grads:a}=S.gradients(r,e,null,s);C(a.some(l=>l!=null),()=>"Cannot find a connection between any variable and the result of the loss function y=f(x). Please make sure the operations that use variables are inside the function f passed to minimize()."),C(i.rank===0,()=>`The f passed in variableGrads(f) must return a scalar, but it returned a rank-${i.rank} tensor`);let u={};return e.forEach((l,c)=>{a[c]!=null&&(u[l.name]=a[c])}),o?.forEach(l=>u[l.name]=null),{value:i,grads:u}}function gt(r){return S.customGrad(r)}function a$(r){let t={x:b(r,"x","neg")};return S.runKernel("Neg",t)}var qe=w({neg_:a$});function u$(r){let t={x:b(r,"x","softplus")};return S.runKernel(iu,t)}var cl=w({softplus_:u$});function l$(r){let e=b(r,"x","logSigmoid");return gt(o=>({value:qe(cl(qe(o))),gradFunc:i=>P(i,Rt(qe(o)))}))(e)}var Qx=w({logSigmoid_:l$});function c$(r,e){let t=b(r,"a","sub"),o=b(e,"b","sub");[t,o]=te(t,o);let n={a:t,b:o};return S.runKernel("Sub",n)}var q=w({sub_:c$});function p$(r,e=-1){let t=b(r,"logits","logSoftmax");if(e===-1&&(e=t.rank-1),e!==t.rank-1)throw Error(`Log Softmax along a non-last dimension is not yet supported. Logits was rank ${t.rank} and axis was ${e}`);return gt((n,s)=>{let a=xr(n,e,!0),u=q(n,a),l=q(ee(u,"float32"),Dr(le(ht(u),e,!0)));return s([l]),{value:l,gradFunc:(p,m)=>{let[f]=m,d=!0,g=ht(f);return q(p,P(le(p,e,d),g))}}})(t)}var Zx=w({logSoftmax_:p$});function m$(r,e=null,t=!1){let o=b(r,"x","logSumExp"),n=zr(e,o.shape),s=xr(o,n,!0),i=q(o,s),a=ht(i),u=le(a,n),l=Dr(u),c=V(D(s,l.shape),l);if(t){let p=Ar(c.shape,n);return D(c,p)}return c}var ml=w({logSumExp_:m$});function f$(r,e){let t=b(r,"a","logicalAnd","bool"),o=b(e,"b","logicalAnd","bool");ae(t.shape,o.shape);let n={a:t,b:o};return S.runKernel(Ca,n)}var Lo=w({logicalAnd_:f$});function d$(r){let t={x:b(r,"x","logicalNot","bool")};return S.runKernel(Na,t)}var fl=w({logicalNot_:d$});function h$(r,e){let t=b(r,"a","logicalOr","bool"),o=b(e,"b","logicalOr","bool");ae(t.shape,o.shape);let n={a:t,b:o};return S.runKernel(Ea,n)}var dl=w({logicalOr_:h$});function g$(r,e){let t=b(r,"a","logicalXor","bool"),o=b(e,"b","logicalXor","bool");return ae(t.shape,o.shape),Lo(dl(r,e),fl(Lo(r,e)))}var Jx=w({logicalXor_:g$});var hl=2147483648;function x$(r,e,t="left"){let o=b(r,"sortedSequence","searchSorted"),n=b(e,"values","searchSorted"),s=o.shape[o.shape.length-1],i=n.shape[n.shape.length-1],a=D(o,[-1,s]),u=D(n,[-1,i]);if(a.rank<2)throw new Error("Sorted input argument must be at least 2-dimensional");if(a.shape[0]!==u.shape[0])throw new Error("Leading dimension of 'sortedSequence' and 'values' must match.");if(re(u.shape)>=hl)throw new Error(`values tensor size must less than ${hl}`);if(a.shape[1]>=hl)throw new Error(`trailing dim_size must less than ${hl} for int32 output type, was ${a.shape[1]}`);let l={sortedSequence:a,values:u},c={side:t};return S.runKernel(tu,l,c)}var qs=w({searchSorted_:x$});function ey(r,e){return qs(r,e,"left")}function y$(r,e,t,o,n){let s=b(r,"x","maxPool"),i=1,a=s,u=!1;s.rank===3&&(u=!0,a=D(s,[1,s.shape[0],s.shape[1],s.shape[2]])),C(a.rank===4,()=>`Error in maxPool: input must be rank 4 but got rank ${a.rank}.`),C(Ze(t,i),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${t} and dilations '${i}'`),Fe("maxPool",o,n);let l={x:a},c={filterSize:e,strides:t,pad:o,dimRoundingMode:n},p=S.runKernel(Ia,l,c);return u?D(p,[p.shape[1],p.shape[2],p.shape[3]]):p}var gl=w({maxPool_:y$});function b$(r,e=[1,1,1],t,o,n,s="NDHWC"){let i=b(r,"x","maxPool3d"),a=i,u=!1;i.rank===4&&(u=!0,a=D(i,[1,i.shape[0],i.shape[1],i.shape[2],i.shape[3]])),C(a.rank===5,()=>`Error in maxPool3d: x must be rank 5 but got rank ${a.rank}.`),C(s==="NDHWC",()=>`Error in maxPool3d: Only NDHWC is currently supported, but got dataFormat of ${s}`),Fe("maxPool3d",o,n);let l={x:a},c={filterSize:e,strides:t,pad:o,dimRoundingMode:n,dataFormat:s},p=S.runKernel(ka,l,c);return u?D(p,[p.shape[1],p.shape[2],p.shape[3],p.shape[4]]):p}var ty=w({maxPool3d_:b$});function w$(r,e,t,o,n=!1){let i={x:b(r,"x","maxPoolWithArgmax")},a={filterSize:e,strides:t,pad:o,includeBatchInIndex:n},u=S.runKernel($a,i,a);return{result:u[0],indexes:u[1]}}var ry=w({maxPoolWithArgmax_:w$});function v$(r,e){let t=b(r,"a","maximum"),o=b(e,"b","maximum");[t,o]=te(t,o),t.dtype==="bool"&&(t=ee(t,"int32"),o=ee(o,"int32")),ae(t.shape,o.shape);let n={a:t,b:o};return S.runKernel(Cn,n)}var xl=w({maximum_:v$});function T$(r,e=null,t=!1){let n={x:b(r,"x","mean")},s={axis:e,keepDims:t};return S.runKernel(Ra,n,s)}var Bo=w({mean_:T$});function At(r,e="float32"){if(Ce(r),e==="complex64"){let o=At(r,"float32"),n=At(r,"float32");return mt(o,n)}let t=fn(re(r),e);return S.makeTensor(t,r,e)}function yr(r,e="float32"){if(Ce(r),e==="complex64"){let o=yr(r,"float32"),n=At(r,"float32");return mt(o,n)}let t=Ns(re(r),e);return S.makeTensor(t,r,e)}function oy(r,e,{indexing:t="xy"}={}){if(t!=="xy"&&t!=="ij")throw new TypeError(`${t} is not a valid third argument to meshgrid`);if(r===void 0)return[];let o=b(r,"x","meshgrid",r instanceof de?r.dtype:"float32");if(e===void 0)return[o];let n=b(e,"y","meshgrid",e instanceof de?e.dtype:"float32"),s=re(o.shape),i=re(n.shape);return t==="xy"?(o=D(o,[1,-1]),n=D(n,[-1,1]),[ue(yr([i,1],o.dtype),o),ue(n,yr([1,s],n.dtype))]):(o=D(o,[-1,1]),n=D(n,[1,-1]),[ue(o,yr([1,i],o.dtype)),ue(yr([s,1],n.dtype),n)])}function S$(r,e){let t=b(r,"a","minimum"),o=b(e,"b","minimum");[t,o]=te(t,o),t.dtype==="bool"&&(t=ee(t,"int32"),o=ee(o,"int32")),ae(t.shape,o.shape);let n={a:t,b:o};return S.runKernel(Nn,n)}var Or=w({minimum_:S$});function C$(r,e,t){C(t==="reflect"||t==="symmetric",()=>`Invalid mode. Mode must be either reflect or symmetric. Got ${t}.`);let o=b(r,"x","mirrorPad");if(o.rank===0)throw new Error("mirrorPad(scalar) is not defined. Pass non-scalar to mirrorPad");C(e.length===o.rank,()=>`Padding doesn't match input. Must be ${o.rank}. Got ${e.length}.`);let n=t==="reflect"?1:0;for(let a=0;a<o.rank;a++)C(e[a].length===2,()=>"Invalid number of paddings. Must be length of 2 each."),C(e[a][0]>=0&&e[a][0]<=o.shape[a]-n&&e[a][1]>=0&&e[a][1]<=o.shape[a]-n,()=>`Padding in dimension ${a} cannot be greater than or equal to ${o.shape[a]-n} or less than 0 for input of shape ${o.shape}`);let s={paddings:e,mode:t},i={x:o};return S.runKernel(Aa,i,s)}var yl=w({mirrorPad_:C$});function N$(r,e){let t=b(r,"a","mod"),o=b(e,"b","mod");[t,o]=te(t,o);let n={a:t,b:o};return S.runKernel("Mod",n)}var sy=w({mod_:N$});function E$(r,e=null,t=!1){r=b(r,"x","moments");let o=zr(e,r.shape),n=Bo(r,o,t),s=n.shape;t||(s=Ar(n.shape,o));let i=Me(q(ee(r,"float32"),D(n,s))),a=Bo(i,o,t);return{mean:n,variance:a}}var iy=w({moments_:E$});function I$(r,e,t,o){let n=b(e,"data","multiRNNCell"),s=Ao(t,"c","multiRNNCell"),i=Ao(o,"h","multiRNNCell"),a=n,u=[];for(let p=0;p<r.length;p++){let m=r[p](a,s[p],i[p]);u.push(m[0]),u.push(m[1]),a=m[1]}let l=[],c=[];for(let p=0;p<u.length;p+=2)l.push(u[p]),c.push(u[p+1]);return[l,c]}var ay=w({multiRNNCell_:I$});function k$(r,e,t,o=!1){let n=b(r,"logits","multinomial"),s=n.size,i=n.rank;if(s<2)throw new Error(`Error in multinomial: you need at least 2 outcomes, but got ${s}.`);if(i>2)throw new Error(`Rank of probabilities must be 1 or 2, but is ${i}`);t=t||Math.random();let u={logits:i===1?D(n,[1,-1]):n},l={numSamples:e,seed:t,normalized:o},c=S.runKernel(_a,u,l);return i===1?D(c,[c.size]):c}var uy=w({multinomial_:k$});function $$(r,e){let t=b(r,"a","notEqual","string_or_numeric"),o=b(e,"b","notEqual","string_or_numeric");[t,o]=te(t,o),ae(t.shape,o.shape);let n={a:t,b:o};return S.runKernel(In,n)}var bl=w({notEqual_:$$});function R$(r,e,t=1,o=0,n="int32"){if(e<2)throw new Error(`Error in oneHot: depth must be >=2, but it is ${e}`);let i={indices:b(r,"indices","oneHot","int32")},a={dtype:n,depth:e,onValue:t,offValue:o};return S.runKernel(La,i,a)}var ly=w({oneHot_:R$});function A$(r){let t={x:b(r,"x","onesLike")};return S.runKernel(Pa,t)}var cy=w({onesLike_:A$});function _$(r,e){let t=b(r,"v1","outerProduct"),o=b(e,"v2","outerProduct");C(t.rank===1&&o.rank===1,()=>`Error in outerProduct: inputs must be rank 1, but got ranks ${t.rank} and ${o.rank}.`);let n=D(t,[-1,1]),s=D(o,[1,-1]);return ue(n,s)}var py=w({outerProduct_:_$});function D$(r,e,t=0){let o=b(r,"x","pad");if(o.rank===0)throw new Error("pad(scalar) is not defined. Pass non-scalar to pad");let n={paddings:e,constantValue:t},s={x:o};return S.runKernel(Ma,s,n)}var _t=w({pad_:D$});function O$(r,e,t=0){return C(e.length===2,()=>"Invalid number of paddings. Must be length of 2."),_t(r,[e],t)}var my=w({pad1d_:O$});function F$(r,e,t=0){return C(e.length===2&&e[0].length===2&&e[1].length===2,()=>"Invalid number of paddings. Must be length of 2 each."),_t(r,e,t)}var fy=w({pad2d_:F$});function P$(r,e,t=0){return C(e.length===3&&e[0].length===2&&e[1].length===2&&e[2].length===2,()=>"Invalid number of paddings. Must be length of 2 each."),_t(r,e,t)}var dy=w({pad3d_:P$});function L$(r,e,t=0){return C(e.length===4&&e[0].length===2&&e[1].length===2&&e[2].length===2&&e[3].length===2,()=>"Invalid number of paddings. Must be length of 2 each."),_t(r,e,t)}var hy=w({pad4d_:L$});function B$(r,e,t){let o=b(r,"x","spaceToBatchND");C(o.rank>=1+e.length,()=>`input rank ${o.rank} should be > than [blockShape] ${e.length}`),C(t.length===e.length,()=>`paddings.shape[0] ${t.length} must be equal to [blockShape] ${e.length}`),C(o.shape.reduce((i,a,u)=>u>0&&u<=e.length?i&&(a+t[u-1][0]+t[u-1][1])%e[u-1]===0:i,!0),()=>`input spatial dimensions ${o.shape.slice(1)} with paddings ${t.toString()} must be divisible by blockShapes ${e.toString()}`);let n={x:o},s={blockShape:e,paddings:t};return S.runKernel(au,n,s)}var wl=w({spaceToBatchND_:B$});function M$(r,e,t,o,n,s,i){n==null&&(n=[1,1]),s==null&&(s=1),o===0&&(o="valid");let a=b(r,"x","maxPool"),u=a,l=!1;a.rank===3&&(l=!0,u=D(a,[1,a.shape[0],a.shape[1],a.shape[2]])),C(Ze(s,n),()=>`Error in pool: Either strides or dilations must be 1. Got strides ${s} and dilations '${n}'`);let c=Zm(u.shape,e,s,n,o),p=[c.dilationHeight,c.dilationWidth],m;o==="same"?m=U$([c.filterHeight,c.filterWidth],p):m=[[0,0],[0,0]];let f=p[0]===1&&p[1]===1,[d,g]=V$([c.inHeight,c.inWidth],p,m),h=f?o:"valid",x=f?u:wl(u,p,d),N=(t==="avg"?()=>Xu(x,e,s,h,i):()=>gl(x,e,s,h,i))(),E=f?N:ju(N,p,g);return l?D(E,[E.shape[1],E.shape[2],E.shape[3]]):E}function V$(r,e,t){let o=t.map(c=>c[0]),n=t.map(c=>c[1]),s=r.concat(o,n),i=e.map((c,p)=>(c-s[p]%c)%c),a=n.map((c,p)=>c+i[p]),u=e.map((c,p)=>[o[p],a[p]]),l=e.map((c,p)=>[0,i[p]]);return[u,l]}function U$(r,e){let o=r.map((i,a)=>i+(i-1)*(e[a]-1)).map(i=>i-1),n=o.map(i=>Math.floor(i/2)),s=o.map((i,a)=>i-n[a]);return o.map((i,a)=>[n[a],s[a]])}var gy=w({pool_:M$});function G$(r,e){let t=b(r,"x","prelu"),o=b(e,"alpha","prelu"),n={x:t,alpha:o};return S.runKernel(Va,n)}var vl=w({prelu_:G$});function z$(r,e=null,t=!1){let o=b(r,"x","prod");o.dtype==="bool"&&(o=ee(o,"int32"));let n={x:o},s={axis:e,keepDims:t};return S.runKernel($s,n,s)}var xy=w({prod_:z$});function W$(r,e,t,o){let n=r.map((c,p)=>b(c,`tensors${p}`,"raggedGather","int32")),s=b(e,"paramsDenseValues","raggedGather"),i=b(t,"indices","raggedGather","int32"),a={paramsNestedSplits:n,paramsDenseValues:s,indices:i},u={outputRaggedRank:o},l=S.runKernel(Ua,a,u);return{outputNestedSplits:l.slice(0,l.length-1),outputDenseValues:l[l.length-1]}}var yy=w({raggedGather_:W$});function H$(r,e,t){let o=b(r,"starts","raggedRange"),n=b(e,"limits","raggedRange",o.dtype),s=b(t,"deltas","raggedRange",o.dtype),i={starts:o,limits:n,deltas:s},a=S.runKernel(Ga,i);return{rtNestedSplits:a[0],rtDenseValues:a[1]}}var by=w({raggedRange_:H$});function K$(r,e,t,o,n){let s=b(r,"shape","raggedTensorToTensor","int32"),i=b(e,"values","raggedTensorToTensor"),a=b(t,"defaultValue","raggedTensorToTensor",i.dtype),u=o.map((p,m)=>b(p,`tensors${m}`,"raggedTensorToTensor","int32")),l={shape:s,values:i,defaultValue:a,rowPartitionTensors:u},c={rowPartitionTypes:n};return S.runKernel(za,l,c)}var wy=w({raggedTensorToTensor_:K$});function q$(r,e,t){Ce(r);let o=re(r),n=null;if(t==null||t==="float32")n=new Float32Array(o);else if(t==="int32")n=new Int32Array(o);else if(t==="bool")n=new Uint8Array(o);else throw new Error(`Unknown data type ${t}`);for(let s=0;s<o;s++)n[s]=e();return S.makeTensor(n,r,t)}var vy=w({rand_:q$});var Nl=Ci(By());var Vo=class{constructor(e,t,o,n,s){this.mean=e,this.stdDev=t,this.dtype=o,this.nextVal=NaN,this.truncated=n,this.truncated&&(this.upper=this.mean+this.stdDev*2,this.lower=this.mean-this.stdDev*2);let i=s||Math.random();this.random=Nl.alea(i.toString())}nextValue(){if(!isNaN(this.nextVal)){let n=this.nextVal;return this.nextVal=NaN,n}let e,t,o=!1;for(;!o;){let n,s,i;do n=2*this.random()-1,s=2*this.random()-1,i=n*n+s*s;while(i>=1||i===0);let a=Math.sqrt(-2*Math.log(i)/i);e=this.mean+this.stdDev*n*a,t=this.mean+this.stdDev*s*a,(!this.truncated||this.isValidTruncated(e))&&(o=!0)}return(!this.truncated||this.isValidTruncated(t))&&(this.nextVal=this.convertValue(t)),this.convertValue(e)}convertValue(e){return this.dtype==null||this.dtype==="float32"?e:Math.round(e)}isValidTruncated(e){return e<=this.upper&&e>=this.lower}},Sl=class{constructor(e,t,o,n){this.alpha=e,this.beta=1/t,this.dtype=o;let s=n||Math.random();this.randu=Nl.alea(s.toString()),this.randn=new Vo(0,1,o,!1,this.randu()),e<1?this.d=e+2/3:this.d=e-1/3,this.c=1/Math.sqrt(9*this.d)}nextValue(){let e,t,o,n,s,i;for(;;){do n=this.randn.nextValue(),i=1+this.c*n;while(i<=0);if(i*=i*i,e=n*n,t=1-.331*e*e,o=.5*e+this.d*(1-i+Math.log(i)),s=this.randu(),s<t||Math.log(s)<o)break}return i=1/this.beta*this.d*i,this.alpha<1&&(i*=Math.pow(this.randu(),1/this.alpha)),this.convertValue(i)}convertValue(e){return this.dtype==="float32"?e:Math.round(e)}},Cl=class{constructor(e=0,t=1,o,n){if(this.canReturnFloat=()=>this.dtype==null||this.dtype==="float32",this.min=e,this.range=t-e,this.dtype=o,n==null&&(n=Math.random()),typeof n=="number"&&(n=n.toString()),!this.canReturnFloat()&&this.range<=1)throw new Error(`The difference between ${e} - ${t} <= 1 and dtype is not float`);this.random=Nl.alea(n)}convertValue(e){return this.canReturnFloat()?e:Math.round(e)}nextValue(){return this.convertValue(this.min+this.range*this.random())}};function eR(r,e,t=1,o="float32",n){if(Ce(r),t==null&&(t=1),o==null&&(o="float32"),o!=="float32"&&o!=="int32")throw new Error(`Unsupported data type ${o}`);let s=new Sl(e,t,o,n),i=oe(r,o);for(let a=0;a<i.values.length;a++)i.values[a]=s.nextValue();return i.toTensor()}var My=w({randomGamma_:eR});function tR(r,e=0,t=1,o,n){if(Ce(r),o!=null&&o==="bool")throw new Error(`Unsupported data type ${o}`);let s=new Vo(e,t,o,!1,n),i=oe(r,o);for(let a=0;a<i.values.length;a++)i.values[a]=s.nextValue();return i.toTensor()}var El=w({randomNormal_:tR});function rR(r,e,t){if(e!=null&&e==="bool")throw new Error(`Unsupported data type ${e}`);return El(r,0,1,e,t)}var Vy=w({randomStandardNormal_:rR});function oR(r,e=0,t=1,o="float32",n){Ce(r);let s=oe(r,o),i=new Cl(e,t,null,n);for(let a=0;a<s.values.length;a++)s.values[a]=i.nextValue();return s.toTensor()}var jn=w({randomUniform_:oR});function nR(r,e,t,o){return jn(r,e,t,"int32",o)}var Uy=w({randomUniformInt_:nR});function no(r,e,t=1,o="float32"){if(t===0)throw new Error("Cannot have a step of zero");let n={start:r,stop:e,step:t,dtype:o};return S.runKernel(Wa,{},n)}function sR(r){let t={input:b(r,"input","real")};return S.runKernel(Rs,t)}var Fr=w({real_:sR});function iR(r){let t={x:b(r,"x","reciprocal")};return S.runKernel(Ha,t)}var Gy=w({reciprocal_:iR});function aR(r){let t={x:b(r,"x","relu")};return S.runKernel(Ka,t)}var so=w({relu_:aR});function uR(r){let t={x:b(r,"x","relu6")};return S.runKernel(Ya,t)}var Il=w({relu6_:uR});function lR(r,e){let o={x:b(r,"x","reverse")},n={dims:e};return S.runKernel(Qa,o,n)}var Gt=w({reverse_:lR});function cR(r){let e=b(r,"x","reverse");return C(e.rank===1,()=>`Error in reverse1D: x must be rank 1 but got rank ${e.rank}.`),Gt(e,0)}var zy=w({reverse1d_:cR});function pR(r,e){let t=b(r,"x","reverse");return C(t.rank===2,()=>`Error in reverse2D: x must be rank 2 but got rank ${t.rank}.`),Gt(t,e)}var Wy=w({reverse2d_:pR});function mR(r,e){let t=b(r,"x","reverse");return C(t.rank===3,()=>`Error in reverse3D: x must be rank 3 but got rank ${t.rank}.`),Gt(t,e)}var Hy=w({reverse3d_:mR});function fR(r,e){let t=b(r,"x","reverse");return C(t.rank===4,()=>`Error in reverse4D: x must be rank 4 but got rank ${t.rank}.`),Gt(t,e)}var Ky=w({reverse4d_:fR});function dR(r){let t={x:b(r,"x","round")};return S.runKernel(Za,t)}var kl=w({round_:dR});function hR(r){let t={x:b(r,"x","rsqrt","float32")};return S.runKernel(kn,t)}var qy=w({rsqrt_:hR});function gR(r){let t={x:b(r,"x","selu")};return S.runKernel(ou,t)}var Xy=w({selu_:gR});function xR(r,e,t,o,n,s=[1,1],i="NHWC"){let a=b(r,"x","separableConv2d"),u=b(e,"depthwiseFilter","separableConv2d"),l=b(t,"pointwiseFilter","separableConv2d"),c=a,p=!1;if(a.rank===3&&(p=!0,c=D(a,[1,a.shape[0],a.shape[1],a.shape[2]])),i==="NCHW")throw new Error("separableConv2d currently does not support dataFormat NCHW; only NHWC is supported");C(c.rank===4,()=>`Error in separableConv2d: input must be rank 4, but got rank ${c.rank}.`),C(u.rank===4,()=>`Error in separableConv2d: depthwise filter must be rank 4, but got rank ${u.rank}.`),C(l.rank===4,()=>`Error in separableConv2d: pointwise filter must be rank 4, but got rank ${u.rank}.`),C(l.shape[0]===1,()=>`Error in separableConv2d: the first dimension of pointwise filter  must be 1, but got ${l.shape[0]}.`),C(l.shape[1]===1,()=>`Error in separableConv2d: the second dimension of pointwise filter must be 1, but got ${l.shape[1]}.`);let m=u.shape[2],f=u.shape[3];C(l.shape[2]===m*f,()=>`Error in separableConv2d: the third dimension of pointwise filter must be ${m*f}, but got ${l.shape[2]}.`);let d=qn(c,u,o,n,i,s),h=Jr(d,l,1,"valid",i);return p?D(h,[h.shape[1],h.shape[2],h.shape[3]]):h}var jy=w({separableConv2d_:xR});async function yR(r,e){let t=b(r,"x","setdiff1d"),o=b(e,"y","setdiff1d");C(t.dtype===o.dtype,()=>`x and y should have the same dtype, but got x (${t.dtype}) and y (${o.dtype}).`),C(t.rank===1,()=>`x should be 1D tensor, but got x (${t.shape}).`),C(o.rank===1,()=>`y should be 1D tensor, but got y (${o.shape}).`);let n=await t.data(),s=await o.data(),i=new Set(s),a=0;for(let c=0;c<n.length;c++)i.has(n[c])||a++;let u=new Mt([a],t.dtype),l=new Mt([a],"int32");for(let c=0,p=0;c<n.length;c++)i.has(n[c])||(u.values[p]=n[c],l.values[p]=c,p++);return[u.toTensor(),l.toTensor()]}var Yy=yR;function bR(r){let t={x:b(r,"x","sign")};return S.runKernel(su,t)}var Qy=w({sign_:bR});function wR(r){let t={x:b(r,"x","sin","float32")};return S.runKernel("Sin",t)}var Jy=w({sin_:wR});function vR(r){let t={x:b(r,"x","sinh")};return S.runKernel(nu,t)}var eb=w({sinh_:vR});function TR(r,e,t){let o=b(r,"x","slice1d");return C(o.rank===1,()=>`slice1d expects a rank-1 tensor, but got a rank-${o.rank} tensor`),Q(o,[e],[t])}var tb=w({slice1d_:TR});function SR(r,e,t){let o=b(r,"x","slice2d");return C(o.rank===2,()=>`slice2d expects a rank-2 tensor, but got a rank-${o.rank} tensor`),Q(o,e,t)}var rb=w({slice2d_:SR});function CR(r,e,t){let o=b(r,"x","slice3d");return C(o.rank===3,()=>`slice3d expects a rank-3 tensor, but got a rank-${o.rank} tensor`),Q(o,e,t)}var ob=w({slice3d_:CR});function NR(r,e,t){let o=b(r,"x","slice4d");return C(o.rank===4,()=>`slice4d expects a rank-4 tensor, but got a rank-${o.rank} tensor`),Q(o,e,t)}var nb=w({slice4d_:NR});function ER(r,e=-1){let t=b(r,"logits","softmax","float32");if(e===-1&&(e=t.rank-1),e!==t.rank-1)throw Error(`Softmax along a non-last dimension is not yet supported. Logits was rank ${t.rank} and dim was ${e}`);let o={logits:t},n={dim:e};return S.runKernel(lu,o,n)}var sb=w({softmax_:ER});function IR(r){C(r.dtype==="complex64",()=>`The dtype for tf.spectral.fft() must be complex64 but got ${r.dtype}.`);let e={input:r};return S.runKernel("FFT",e)}var Yn=w({fft_:IR});function kR(r){C(r.dtype==="complex64",()=>`The dtype for tf.spectral.ifft() must be complex64 but got ${r.dtype}.`);let e={input:r};return S.runKernel(ga,e)}var Uo=w({ifft_:kR});function $R(r){let e=r.shape[r.shape.length-1],t=r.size/e,o;if(e<=2){let n=D(r,[t,e]);o=Uo(n)}else{let n=[t,2*(e-1)],s=D(Fr(r),[t,e]),i=D(oo(r),[t,e]),a=Gt(Q(s,[0,1],[t,e-2]),1),u=P(Gt(Q(i,[0,1],[t,e-2]),1),K(-1)),l=xe([s,a],1),c=xe([i,u],1),p=D(mt(l,c),[n[0],n[1]]);o=Uo(p)}if(o=Fr(o),r.rank===3&&r.shape[0]!==0){let n=o,s=r.shape[0];o=D(o,[s,o.shape[0]/s,o.shape[1]]),n.dispose()}return o}var $l=w({irfft_:$R});function RR(r,e,t=0){let n={x:b(r,"x","split")},s={numOrSizeSplits:e,axis:t};return S.runKernel(uu,n,s)}var Pr=w({split_:RR});function AR(r,e){C(r.dtype==="float32",()=>`The dtype for rfft() must be real value but got ${r.dtype}`);let t=r.shape[r.shape.length-1],o=r.size/t,n;if(e!=null&&e<t){let d=r.shape.map(h=>0),g=r.shape.map(h=>h);g[r.shape.length-1]=e,n=Q(r,d,g),t=e}else if(e!=null&&e>t){let d=r.shape.map(g=>g);d[r.shape.length-1]=e-t,n=xe([r,At(d)],r.shape.length-1),t=e}else n=r;let s=Be(n),i=D(mt(n,s),[o,t]),a=Yn(i),u=Math.floor(t/2)+1,l=Fr(a),c=oo(a),p=Pr(l,[u,t-u],l.shape.length-1),m=Pr(c,[u,t-u],c.shape.length-1),f=n.shape.slice();return f[n.shape.length-1]=u,D(mt(p[0],m[0]),f)}var Qn=w({rfft_:AR});function _R(r,e){let t=b(r,"a","squaredDifference"),o=b(e,"b","squaredDifference");[t,o]=te(t,o),ae(t.shape,o.shape);let n={a:t,b:o},s={};return S.runKernel(An,n,s)}var Rl=w({squaredDifference_:_R});function DR(r,e){let t=b(r,"x","squeeze","string_or_numeric");return D(t,dm(t.shape,e).newShape)}var ge=w({squeeze_:DR});function OR(r,e=0){let t=Ao(r,"tensors","stack","string_or_numeric");C(t.length>=1,()=>"Pass at least one tensor to tf.stack"),t.length>0&&C(e<=t[0].rank,()=>"Axis must be <= rank of the tensor");let o=t,n={axis:e};return S.runKernel(Ba,o,n)}var nt=w({stack_:OR});function FR(r,e=0){let o={x:b(r,"x","step")},n={alpha:e};return S.runKernel(Eu,o,n)}var Al=w({step_:FR});function PR(r,e,t,o,n=0,s=0,i=0,a=0,u=0){let c={x:b(r,"x","stridedSlice","string_or_numeric")},p={begin:e,end:t,strides:o,beginMask:n,endMask:s,ellipsisMask:i,newAxisMask:a,shrinkAxisMask:u};return S.runKernel(hu,c,p)}var ab=w({stridedSlice_:PR});function LR(r){let t={x:b(r,"x","tan","float32")};return S.runKernel("Tan",t)}var lb=w({tan_:LR});function Re(r,e){Bt(r);let t=pt(r,e);if(t.length!==1)throw new Error("tensor1d() requires values to be a flat/TypedArray");return rt(r,null,t,e)}function st(r,e,t){if(Bt(r),e!=null&&e.length!==2)throw new Error("tensor2d() requires shape to have two numbers");let o=pt(r,t);if(o.length!==2&&o.length!==1)throw new Error("tensor2d() requires values to be number[][] or flat/TypedArray");if(o.length===1&&e==null)throw new Error("tensor2d() requires shape to be provided when `values` are a flat/TypedArray");return rt(r,e,o,t)}function _l(r,e,t){if(Bt(r),e!=null&&e.length!==3)throw new Error("tensor3d() requires shape to have three numbers");let o=pt(r,t);if(o.length!==3&&o.length!==1)throw new Error("tensor3d() requires values to be number[][][] or flat/TypedArray");if(o.length===1&&e==null)throw new Error("tensor3d() requires shape to be provided when `values` are a flat array");return rt(r,e,o,t)}function cb(r,e,t){if(Bt(r),e!=null&&e.length!==4)throw new Error("tensor4d() requires shape to have four numbers");let o=pt(r,t);if(o.length!==4&&o.length!==1)throw new Error("tensor4d() requires values to be number[][][][] or flat/TypedArray");if(o.length===1&&e==null)throw new Error("tensor4d() requires shape to be provided when `values` are a flat array");return rt(r,e,o,t)}function pb(r,e,t){if(Bt(r),e!=null&&e.length!==5)throw new Error("tensor5d() requires shape to have five numbers");let o=pt(r,t);if(o.length!==5&&o.length!==1)throw new Error("tensor5d() requires values to be number[][][][][] or flat/TypedArray");if(o.length===1&&e==null)throw new Error("tensor5d() requires shape to be provided when `values` are a flat array");return rt(r,e,o,t)}function mb(r,e,t){if(Bt(r),e!=null&&e.length!==6)throw new Error("tensor6d() requires shape to have six numbers");let o=pt(r,t);if(o.length!==6&&o.length!==1)throw new Error("tensor6d() requires values to be number[][][][][][] or flat/TypedArray");if(o.length===1&&e==null)throw new Error("tensor6d() requires shape to be provided when `values` are a flat array");return e=e||o,rt(r,e,o,t)}function fb(r,e,t){let o=e.rank>1?e.shape[e.rank-1]:1,n=e.rank>1?e.rank-1:1,s=`Must have updates.shape = indices.shape[:batchDim] + shape[sliceDim:], got updates.shape: ${t.shape}, indices.shape: ${e.shape}, shape: ${r}, sliceDim: ${o}, and batchDim: ${n}.`;if(t.rank<n)throw new Error(s+` update.rank < ${n}. `);if(r.length<o+(t.rank-n))throw new Error(s+` Output shape length < ${o+(t.rank-n)}`);if(t.rank!==n+r.length-o)throw new Error(s+` update.rank != ${n+r.length-o}`);for(let i=0;i<n;++i)if(t.shape[i]!==e.shape[i])throw new Error(s+` updates.shape[${i}] (${t.shape[i]}) != indices.shape[${i}] (${e.shape[i]}).`);for(let i=0;i<t.rank-n;++i)if(t.shape[i+n]!==r[i+o])throw new Error(s+` updates.shape[${i+n}] (${t.shape[i+n]}) != shape[${i+n}] (${r[i+n]})`)}function Xs(r,e,t){if(e.rank<1)throw new Error(`tf.scatterND() expects the indices to be rank 1 or higher, but the rank was ${e.rank}.`);if(r.rank<1)throw new Error(`tf.scatterND() expects the updates to be rank 1 or higher, but the rank was ${r.rank}.`);if(e.dtype!=="int32")throw new Error(`The dtype of 'indices' should be int32, but got dtype: ${e.dtype}`);if(t.length<1)throw new Error(`Output rank must be greater or equal to 1, but got shape: ${t}`);if(t.length===0){if(e.size===0)throw new Error(`Indices specified for empty output. indices shape: ${e.shape}`);if(r.size===0)throw new Error(`Updates specified for empty output. updates shape: ${r.shape}`)}fb(t,e,r)}function BR(r,e,t){let o=e.shape.length,n=o>1?e.shape[o-1]:1,s=t.length,i=1;for(let p=n;p<s;++p)i*=t[p];let a=n<1?1:n,u=re(e.shape)/a,l=[...cr(t.slice(0,n)),1],c=re(t);return{sliceRank:n,numUpdates:u,sliceSize:i,strides:l,outputSize:c}}function MR(r,e,t){let o=b(r,"tensor","tensorScatterupdate"),n=b(e,"indices","tensorScatterupdate","int32"),s=b(t,"updates","tensorScatterupdate");if(Xs(s,n,o.shape),o.dtype!==s.dtype)throw new Error(`tensor and updates must have the same dtype, instead they are ${o.dtype} and ${s.dtype}.`);let i={tensor:o,indices:n,updates:s},a={};return S.runKernel(eu,i,a)}var hb=w({tensorScatterUpdate_:MR});function VR(r,e=1,t=!0){let o=b(r,"x","topk");if(o.rank===0)throw new Error("topk() expects the input to be of rank 1 or higher");let n=o.shape[o.shape.length-1];if(e<0)throw new Error(`'k' passed to topk() must be >= 0 but got ${e}`);if(e>n)throw new Error(`'k' passed to topk() must be <= the last dimension (${n}) but got ${e}`);let s={x:o},i={k:e,sorted:t},[a,u]=S.runKernel(wu,s,i);return{values:a,indices:u}}var gb=w({topk_:VR});function UR(r,e=0,t=1,o,n){if(Ce(r),o!=null&&o==="bool")throw new Error("Unsupported data type $ { dtype }");let s=new Vo(e,t,o,!0,n),i=oe(r,o);for(let a=0;a<i.values.length;a++)i.values[a]=s.nextValue();return i.toTensor()}var xb=w({truncatedNormal_:UR});function GR(r,e=0){let t=b(r,"x","unique","string_or_numeric");C(t.rank>0,()=>"The input tensor must be at least 1D");let o={x:t},n={axis:e},[s,i]=S.runKernel(Tu,o,n);return{values:s,indices:i}}var yb=w({unique_:GR});function zR(r,e,t){let o=b(r,"x","unsortedSegmentSum"),n=b(e,"segmentIds","unsortedSegmentSum","int32");C(Nr(t),()=>"numSegments must be of dtype int");let s={x:o,segmentIds:n},i={numSegments:t};return S.runKernel(Cu,s,i)}var bb=w({unsortedSegmentSum_:zR});function WR(r,e=0){let t=b(r,"x","unstack","string_or_numeric");C(e>=-t.shape.length&&e<t.shape.length,()=>`Axis = ${e} is not in [-${t.shape.length}, ${t.shape.length})`);let o={value:t},n={axis:e};return S.runKernel(Su,o,n)}var zt=w({unstack_:WR});function wb(r,e){return qs(r,e,"right")}function vb(r,e=!0,t,o){return S.makeVariable(r,e,t,o)}function Dl(r,e){let t=[];for(let s=0;s<e.length;s++)e[s]&&t.push(s);let o=oe(r,"int32"),n=oe([t.length,r.length],"int32");for(let s=0;s<t.length;s++){let i=o.indexToLoc(t[s]),a=s*r.length;n.values.set(i,a)}return n.toTensor()}async function HR(r){let e=b(r,"condition","whereAsync","bool"),t=await e.data(),o=Dl(e.shape,t);return r!==e&&e.dispose(),o}var Ol=HR;async function KR(r,e,t){let o=b(r,"tensor","boolMask"),n=b(e,"mask","boolMask","bool"),s=t??0,i=n.rank,a=o.shape;C(i>0,()=>"mask cannot be scalar"),$e(a.slice(s,s+i),n.shape,"mask's shape must match the first K dimensions of tensor's shape,");let u=1;for(let g=s;g<s+i;g++)u*=a[g];let l=a.slice(0,s).concat([u],a.slice(s+i)),c=D(o,l),p=D(n,[-1]),m=await Ol(p),f=ge(m,[1]),d=sl(c,f,s);return r!==o&&o.dispose(),e!==n&&n.dispose(),f.dispose(),c.dispose(),p.dispose(),m.dispose(),d}var qR=KR;function XR(r,e,t){let o=b(r,"x","transpose");if(e==null&&(e=o.shape.map((i,a)=>a).reverse()),C(o.rank===e.length,()=>`Error in transpose: rank of input ${o.rank} must match length of perm ${e}.`),e.forEach(i=>{C(i>=0&&i<o.rank,()=>`All entries in 'perm' must be between 0 and ${o.rank-1} but got ${e}`)}),o.rank<=1)return o.clone();let n={x:o},s={perm:e};return o.dtype==="complex64"?H(()=>{let i=Fr(o),a=oo(o);return i=S.runKernel(On,{x:i},s),a=S.runKernel(On,{x:a},s),t&&(a=qe(a)),mt(i,a)}):S.runKernel(On,n,s)}var Fl=w({transpose_:XR});function jR(r,e,t,o,n=!0){let s=b(r,"v","movingAverage"),i=b(e,"x","movingAverage"),a=b(t,"decay","movingAverage");cg(s,i),C(Et(s.shape,i.shape),()=>"Shape mismatch in v and x");let u=K(1),l=q(u,a),c=P(q(i,s),l);if(n){C(o!=null,()=>"When using zeroDebias: true, step is required.");let p=b(o,"step","movingAverage");c=Y(c,q(u,_r(a,p)))}return V(s,c)}var YR=w({movingAverage_:jR});function QR(r,e,t){Ce(t);let o=b(r,"indices","scatterND","int32"),n=b(e,"updates","scatterND");Xs(n,o,t);let s={indices:o,updates:n},i={shape:t};return S.runKernel(Ja,s,i)}var ZR=w({scatterND_:QR});function Tb(r,e,t,o){if(r.dtype!=="int32")throw new Error(`tf.sparseToDense() expects the indices to be int32 type, but the dtype was ${r.dtype}.`);if(r.rank>2)throw new Error(`sparseIndices should be a scalar, vector, or matrix, but got shape ${r.shape}.`);let n=r.rank>0?r.shape[0]:1,s=r.rank>1?r.shape[1]:1;if(t.length!==s)throw new Error(`outputShape has incorrect number of elements:, ${t.length}, should be: ${s}.`);let i=e.size;if(!(e.rank===0||e.rank===1&&i===n))throw new Error(`sparseValues has incorrect shape ${e.shape}, should be [] or [${n}]`);if(e.dtype!==o.dtype)throw new Error("sparseValues.dtype must match defaultValues.dtype")}function eA(r,e,t,o=0){Ce(t);let n=b(r,"sparseIndices","sparseToDense","int32"),s=b(e,"sparseValues","sparseToDense","string_or_numeric"),i=b(o,"defaultValue","sparseToDense",s.dtype);Tb(n,s,t,i);let a={sparseIndices:n,sparseValues:s,defaultValue:i},u={outputShape:t};return S.runKernel(du,a,u)}var tA=w({sparseToDense_:eA});function rA(r,e){let t=b(e,"indices","gatherND","int32"),n={params:b(r,"x","gatherND","string_or_numeric"),indices:t};return S.runKernel(ha,n)}var oA=w({gatherND_:rA});function Sb(r,e){if(e==null)return r.shape.slice();if(Et(r.shape,e))return e;if(r.shape.length===e.length){let t=[];for(let o=0;o<r.shape.length;o++)e[o]==null&&r.shape[o]!=null?t.push(r.shape[o]):t.push(e[o]);return t}return e}function nA(r,e,t,o){let n=b(r,"x","dropout");if(C(n.dtype==="float32",()=>`x has to be a floating point tensor since it's going to be scaled, but got a ${n.dtype} tensor instead.`),C(e>=0&&e<1,()=>`rate must be a float in the range [0, 1), but got ${e}.`),e===0)return r instanceof de?n.clone():n;let s=Sb(n,t),i=1-e,a=Y(nl(V(jn(s,0,1,"float32",o),i)),i);return P(n,a)}var sA=w({dropout_:nA});function lf(r){return Math.floor(Math.pow(2,Math.ceil(Math.log(r)/Math.log(2))))}function js(r,e,t){let o=1-r%2,n=new Float32Array(r);for(let s=0;s<r;++s){let i=2*Math.PI*s/(r+o-1);n[s]=e-t*Math.cos(i)}return Re(n,"float32")}async function iA(r,e,t=1){let o=b(r,"predictions","inTopK"),n=b(e,"targets","inTopK");C(o.rank>1,()=>`inTopK() expects the predictions to be of rank 2 or higher, but got ${o.rank}`),C(o.rank-1===n.rank,()=>`predictions rank should be 1 larger than targets rank, but got predictions rank ${o.rank} and targets rank ${n.rank}`),$e(o.shape.slice(0,o.shape.length-1),n.shape,"predictions's shape should be align with the targets' shape, except the last dimension.");let s=o.shape[o.shape.length-1];C(t>0&&t<=s,()=>`'k' passed to inTopK() must be > 0 && <= the predictions last dimension (${s}), but got ${t}`);let i=await o.data(),a=await n.data(),[u,l]=[i.length/s,s],c=hm("bool",u);for(let p=0;p<u;p++){let m=p*l,f=i.subarray(m,m+l),d=[];for(let g=0;g<f.length;g++)d.push({value:f[g],index:g});d.sort((g,h)=>h.value-g.value),c[p]=0;for(let g=0;g<t;g++)if(d[g].index===a[p]){c[p]=1;break}}return r!==o&&o.dispose(),e!==n&&n.dispose(),ot(c,n.shape,"bool")}var aA=iA;var cf={};ye(cf,{conv2d:()=>Nb,depthwiseConv2d:()=>kb,matMul:()=>$b});function uA(r,e,t,o,n,s="NHWC",i){let a=r;r.rank===3&&(a=D(r,[1,r.shape[0],r.shape[1],r.shape[2]]));let u=e;u.rank===3&&(u=D(e,[1,e.shape[0],e.shape[1],e.shape[2]])),C(a.rank===4,()=>`Error in conv2dDerFilter: input must be rank 4, but got shape ${a.shape}.`),C(u.rank===4,()=>`Error in conv2dDerFilter: dy must be rank 4, but got shape ${u.shape}.`),C(t.length===4,()=>`Error in conv2dDerFilter: filterShape must be length 4, but got ${t}.`);let l=s==="NHWC"?a.shape[3]:a.shape[1],c=s==="NHWC"?u.shape[3]:u.shape[1];C(l===t[2],()=>`Error in conv2dDerFilter: depth of input ${l}) must match input depth in filter (${t[2]}.`),C(c===t[3],()=>`Error in conv2dDerFilter: depth of dy (${c}) must match output depth for filter (${t[3]}).`),Fe("conv2dDerFilter",n,i);let p={x:a,dy:u},m={strides:o,pad:n,dataFormat:s,dimRoundingMode:i,filterShape:t};return S.runKernel(qi,p,m)}var Cb=w({conv2DBackpropFilter_:uA});function Go(r,e,t){if(t==null||t==="linear")return r;if(t==="relu")return P(r,Al(e));throw new Error(`Cannot compute gradient for fused activation ${t}.`)}function zo(r,e){let t=e,o=Ju(r.shape,e.shape);return o.length>0&&(t=le(t,o)),D(t,r.shape)}function Wo(r,e,t,o){if(e==="linear")return r;if(e==="relu")return so(r);if(e==="elu")return tl(r);if(e==="relu6")return Il(r);if(e==="prelu")return vl(r,t);if(e==="leakyrelu")return al(r,o);if(e==="sigmoid")return Rt(r);throw new Error(`Unknown fused activation ${e}.`)}var Ho=(r,e)=>!(r>0)||e==="linear";function lA({x:r,filter:e,strides:t,pad:o,dataFormat:n="NHWC",dilations:s=[1,1],dimRoundingMode:i,bias:a,activation:u="linear",preluActivationWeights:l,leakyreluAlpha:c}){if(u=u||"linear",Ho(S.state.gradientDepth,u)===!1){C(n==="NHWC",()=>`Error in fused conv2d: got dataFormat of ${n} but only NHWC is currently supported for the case of gradient depth is 0 and the activation is not linear.`);let R=Jr(r,e,t,o,n,s,i);return a!=null&&(R=V(R,a)),Wo(R,u,l,c)}let p=b(r,"x","conv2d","float32"),m=b(e,"filter","conv2d","float32"),f=p,d=!1;p.rank===3&&(d=!0,f=D(p,[1,p.shape[0],p.shape[1],p.shape[2]])),C(f.rank===4,()=>`Error in fused conv2d: input must be rank 4, but got rank ${f.rank}.`),C(m.rank===4,()=>`Error in fused conv2d: filter must be rank 4, but got rank ${m.rank}.`),Fe("fused conv2d",o,i);let g=n==="NHWC"?f.shape[3]:f.shape[1];C(m.shape[2]===g,()=>`Error in conv2d: depth of input (${g}) must match input depth for filter ${m.shape[2]}.`),C(Ze(t,s),()=>`Error in conv2D: Either strides or dilations must be 1. Got strides ${t} and dilations '${s}'`);let h=Oo(f.shape,m.shape,t,s,o,i),x;a!=null&&(x=b(a,"bias","fused conv2d"),[x]=te(x,p),n==="NHWC"?ae(h.outShape,x.shape):(C(x.shape.length<=1,()=>`Error in fused conv2d: only supports scalar or 1-D Tensor bias for NCHW format but got the bias of rank-${x.shape.length}.`),C(x.shape.length===0||x.shape[0]===h.outChannels||x.shape[0]===1,()=>`Error in fused conv2d: bias shape (${x.shape}) is not compatible with the number of output channels (${h.outChannels})`)));let v;if(l!=null){let R=l.shape;if(C(R.length<=1||R.length===3,()=>`Error in fused conv2d: only supports scalar, 1-D Tensor or 3-D Tensor PReLU activation weights but got a tensor of rank-${R.length}.`),R.length===1)C(R[0]===1||R[0]===h.outChannels,()=>`Error in fused conv2d: PReLU activation weights (${R}) is not compatible with the number of output channels (${h.outChannels}).`);else if(R.length===3)try{ae(R,h.outShape)}catch{let _=`Error in fused conv2d: PReLU activation weights (${R}) is not compatible with the output shape of the conv2d (${h.outShape}).`;throw Error(_)}v=b(l,"prelu weights","fused conv2d")}let N=(R,A)=>{C(n==="NHWC",()=>`Error in gradient of fused conv2D: got dataFormat of ${n} but only NHWC is currently supported.`);let[_,O,F,B]=A,M=Go(R,F,u);C(Do(s),()=>`Error in gradient of fused conv2D: dilation rates greater than 1 are not yet supported in gradients. Got dilations '${s}'`);let z=Zu(O.shape,M,_,t,o),j=Cb(O,M,_.shape,t,o),Z=[z,j];if(B!=null){let ie=zo(B,M);Z.push(ie)}return Z},E={x:f,filter:m,bias:x,preluActivationWeights:v},k={strides:t,pad:o,dataFormat:n,dilations:s,dimRoundingMode:i,activation:u,leakyreluAlpha:c};return a==null?gt((A,_,O)=>{let F=S.runKernel(Os,E,k);return O([_,A,F]),d&&(F=D(F,[F.shape[1],F.shape[2],F.shape[3]])),{value:F,gradFunc:N}})(f,m):gt((A,_,O,F)=>{let B=S.runKernel(Os,E,k);return F([_,A,B,O]),d&&(B=D(B,[B.shape[1],B.shape[2],B.shape[3]])),{value:B,gradFunc:N}})(f,m,x)}var Nb=w({fusedConv2d_:lA});function cA(r,e,t,o,n,s=[1,1],i){let a=r;r.rank===3&&(a=D(r,[1,r.shape[0],r.shape[1],r.shape[2]]));let u=e;u.rank===3&&(u=D(e,[1,e.shape[0],e.shape[1],e.shape[2]]));let l={x:a,dy:u},c={strides:o,pad:n,dimRoundingMode:i,dilations:s,filterShape:t};return S.runKernel(na,l,c)}var Eb=w({depthwiseConv2dNativeBackpropFilter_:cA});function pA(r,e,t,o,n,s=[1,1],i){let a=e,u=!1;e.rank===3&&(u=!0,a=D(e,[1,e.shape[0],e.shape[1],e.shape[2]]));let l={dy:a,filter:t},c={strides:o,pad:n,dimRoundingMode:i,dilations:s,inputShape:r},p=S.runKernel(sa,l,c);return u?D(p,[p.shape[1],p.shape[2],p.shape[3]]):p}var Ib=w({depthwiseConv2dNativeBackpropInput_:pA});function mA({x:r,filter:e,strides:t,pad:o,dataFormat:n="NHWC",dilations:s=[1,1],dimRoundingMode:i,bias:a,activation:u="linear",preluActivationWeights:l,leakyreluAlpha:c}){if(Ho(S.state.gradientDepth,u)===!1){let k=qn(r,e,t,o,n,s,i);return a!=null&&(k=V(k,a)),Wo(k,u,l,c)}let p=b(r,"x","depthwiseConv2d","float32"),m=b(e,"filter","depthwiseConv2d","float32"),f=p,d=!1;p.rank===3&&(d=!0,f=D(p,[1,p.shape[0],p.shape[1],p.shape[2]])),C(f.rank===4,()=>`Error in fused depthwiseConv2d: input must be rank 4, but got rank ${f.rank}.`),C(m.rank===4,()=>`Error in fused depthwiseConv2d: filter must be rank 4, but got rank ${m.rank}.`),C(f.shape[3]===m.shape[2],()=>`Error in fused depthwiseConv2d: number of input channels (${f.shape[3]}) must match the inChannels dimension in filter ${m.shape[2]}.`),s==null&&(s=[1,1]),C(Ze(t,s),()=>`Error in fused depthwiseConv2d: Either strides or dilations must be 1. Got strides ${t} and dilations '${s}'`),Fe("fused depthwiseConv2d",o,i);let g=Oo(f.shape,m.shape,t,s,o,i,!0),h;a!=null&&(h=b(a,"bias","fused conv2d"),[h]=te(h,p),ae(g.outShape,h.shape));let x;l!=null&&(x=b(l,"prelu weights","fused depthwiseConv2d"));let v=(k,R)=>{C(Do(s),()=>`Error in gradient of fused depthwiseConv2d: dilation rates greater than 1 are not yet supported. Got dilations '${s}'`);let[A,_,O,F]=R,B=Go(k,O,u),M=Ib(_.shape,B,A,t,o,s,i),z=Eb(_,B,A.shape,t,o,s,i);if(F!=null){let j=zo(h,B);return[M,z,j]}return[M,z]},N={x:f,filter:m,bias:h,preluActivationWeights:x},E={strides:t,pad:o,dataFormat:n,dilations:s,dimRoundingMode:i,activation:u,leakyreluAlpha:c};return a==null?gt((R,A,_)=>{let O=S.runKernel(Fs,N,E);return _([A,R,O]),d&&(O=D(O,[O.shape[1],O.shape[2],O.shape[3]])),{value:O,gradFunc:v}})(f,m):gt((R,A,_,O)=>{let F=S.runKernel(Fs,N,E);return O([A,R,F,_]),d&&(F=D(F,[F.shape[1],F.shape[2],F.shape[3]])),{value:F,gradFunc:v}})(f,m,h)}var kb=w({fusedDepthwiseConv2d_:mA});function fA({a:r,b:e,transposeA:t=!1,transposeB:o=!1,bias:n,activation:s="linear",preluActivationWeights:i,leakyreluAlpha:a=.2}){if(Ho(S.state.gradientDepth,s)===!1){let B=ue(r,e,t,o);return n!=null&&(B=V(B,n)),Wo(B,s,i,a)}let u=b(r,"a","fused matMul"),l=b(e,"b","fused matMul");[u,l]=te(u,l);let c=t?u.shape[u.rank-2]:u.shape[u.rank-1],p=o?l.shape[l.rank-1]:l.shape[l.rank-2],m=t?u.shape[u.rank-1]:u.shape[u.rank-2],f=o?l.shape[l.rank-2]:l.shape[l.rank-1],d=u.shape.slice(0,-2),g=l.shape.slice(0,-2),h=re(d),x=re(g);C(c===p,()=>`Error in fused matMul: inner shapes (${c}) and (${p}) of Tensors with shapes ${u.shape} and ${l.shape} and transposeA=${t} and transposeB=${o} must match.`);let N=ae(u.shape.slice(0,-2),l.shape.slice(0,-2)).concat([m,f]),E=t?D(u,[h,c,m]):D(u,[h,m,c]),k=o?D(l,[x,f,p]):D(l,[x,p,f]),R;n!=null&&(R=b(n,"bias","fused matMul"),[R]=te(R,u),ae(N,R.shape));let A;i!=null&&(A=b(i,"prelu weights","fused matMul"));let _=(B,M)=>{let[z,j,Z,ie]=M,fe=Go(D(B,Z.shape),Z,s),be,Oe;if(!t&&!o?(be=ue(fe,j,!1,!0),Oe=ue(z,fe,!0,!1)):!t&&o?(be=ue(fe,j,!1,!1),Oe=ue(fe,z,!0,!1)):t&&!o?(be=ue(j,fe,!1,!0),Oe=ue(z,fe,!1,!1)):(be=ue(j,fe,!0,!0),Oe=ue(fe,z,!0,!0)),n!=null){let Zt=zo(ie,fe);return[be,Oe,Zt]}else return[be,Oe]},O={a:E,b:k,bias:R,preluActivationWeights:A},F={transposeA:t,transposeB:o,activation:s,leakyreluAlpha:a};return n==null?gt((M,z,j)=>{let Z=S.runKernel(Ds,O,F);return j([M,z,Z]),{value:D(Z,N),gradFunc:_}})(E,k):gt((M,z,j,Z)=>{let ie=S.runKernel(Ds,O,F);return Z([M,z,ie,j]),{value:D(ie,N),gradFunc:_}})(E,k,R)}var $b=w({fusedMatMul_:fA});function dA(r){return js(r,.54,.46)}var Rb=w({hammingWindow_:dA});function hA(r){return js(r,.5,.5)}var Pl=w({hannWindow_:hA});function gA(r,e,t,o=!1,n=0){let s=0,i=[];for(;s+e<=r.size;)i.push(Q(r,s,e)),s+=t;if(o)for(;s<r.size;){let a=s+e-r.size,u=xe([Q(r,s,e-a),gr([a],n)]);i.push(u),s+=t}return i.length===0?st([],[0,e]):D(xe(i),[i.length,e])}var Ll=w({frame_:gA});function xA(r,e,t,o,n=Pl){o==null&&(o=lf(e));let s=Ll(r,e,t),i=P(s,n(e));return Qn(i,o)}var Ab=w({stft_:xA});function yA(r,e,t,o,n="bilinear",s=0){let i=b(r,"image","cropAndResize"),a=b(e,"boxes","cropAndResize","float32"),u=b(t,"boxInd","cropAndResize","int32"),l=a.shape[0];C(i.rank===4,()=>`Error in cropAndResize: image must be rank 4,but got rank ${i.rank}.`),C(a.rank===2&&a.shape[1]===4,()=>`Error in cropAndResize: boxes must be have size [${l},4] but had shape ${a.shape}.`),C(u.rank===1&&u.shape[0]===l,()=>`Error in cropAndResize: boxInd must be have size [${l}] but had shape ${a.shape}.`),C(o.length===2,()=>`Error in cropAndResize: cropSize must be of length 2, but got length ${o.length}.`),C(o[0]>=1&&o[1]>=1,()=>`cropSize must be atleast [1,1], but was ${o}`),C(n==="bilinear"||n==="nearest",()=>`method must be bilinear or nearest, but was ${n}`);let c={image:i,boxes:a,boxInd:u},p={method:n,extrapolationValue:s,cropSize:o};return S.runKernel(ea,c,p)}var _b=w({cropAndResize_:yA});function bA(r){let e=b(r,"image","flipLeftRight","float32");C(e.rank===4,()=>`Error in flipLeftRight: image must be rank 4,but got rank ${e.rank}.`);let t={image:e};return S.runKernel(ma,t,{})}var Db=w({flipLeftRight_:bA});function wA(r){let e=b(r,"image","grayscaleToRGB"),t=e.rank-1,o=e.shape[t];C(e.rank>=2,()=>`Error in grayscaleToRGB: images must be at least rank 2, but got rank ${e.rank}.`),C(o===1,()=>`Error in grayscaleToRGB: last dimension of a grayscale image should be size 1, but got size ${o}.`);let n=new Array(e.rank);return n.fill(1,0,t),n[t]=3,ro(e,n)}var Ob=w({grayscaleToRGB_:wA});function vA(r){let e=b(r,"image","RGBToGrayscale"),t=e.rank-1,o=e.shape[t];C(e.rank>=2,()=>`Error in RGBToGrayscale: images must be at least rank 2, but got rank ${e.rank}.`),C(o===3,()=>`Error in RGBToGrayscale: last dimension of an RGB image should be size 3, but got size ${o}.`);let n=e.dtype,s=ee(e,"float32"),i=Re([.2989,.587,.114]),a;switch(e.rank){case 2:a=to("ij,j->i",s,i);break;case 3:a=to("ijk,k->ij",s,i);break;case 4:a=to("ijkl,l->ijk",s,i);break;case 5:a=to("ijklm,m->ijkl",s,i);break;case 6:a=to("ijklmn,n->ijklm",s,i);break;default:throw new Error("Not a valid tensor rank.")}return a=Je(a,-1),ee(a,n)}var Fb=w({rgbToGrayscale_:vA});function TA(r,e,t=0,o=.5){let n=b(r,"image","rotateWithOffset","float32");C(n.rank===4,()=>`Error in rotateWithOffset: image must be rank 4,but got rank ${n.rank}.`);let s={image:n},i={radians:e,fillValue:t,center:o};return S.runKernel(Iu,s,i)}var Pb=w({rotateWithOffset_:TA});function jt(r,e,t,o,n,s){o==null&&(o=.5),n==null&&(n=Number.NEGATIVE_INFINITY),s==null&&(s=0);let i=r.shape[0];return t=Math.min(t,i),C(0<=o&&o<=1,()=>`iouThreshold must be in [0, 1], but was '${o}'`),C(r.rank===2,()=>`boxes must be a 2D tensor, but was of rank '${r.rank}'`),C(r.shape[1]===4,()=>`boxes must have 4 columns, but 2nd dimension was ${r.shape[1]}`),C(e.rank===1,()=>"scores must be a 1D tensor"),C(e.shape[0]===i,()=>`scores has incompatible shape with boxes. Expected ${i}, but was ${e.shape[0]}`),C(0<=s&&s<=1,()=>`softNmsSigma must be in [0, 1], but was '${s}'`),{maxOutputSize:t,iouThreshold:o,scoreThreshold:n,softNmsSigma:s}}function SA(r,e,t,o=.5,n=Number.NEGATIVE_INFINITY){let s=b(r,"boxes","nonMaxSuppression","float32"),i=b(e,"scores","nonMaxSuppression","float32"),a=jt(s,i,t,o,n);t=a.maxOutputSize,o=a.iouThreshold,n=a.scoreThreshold;let u={maxOutputSize:t,iouThreshold:o,scoreThreshold:n};return S.runKernel(Da,{boxes:s,scores:i},u)}var Lb=w({nonMaxSuppression_:SA});function Bb(r,e,t){let o=CA(r,e,t),n=o<0?-(o+1):o;r.splice(n,0,e)}function CA(r,e,t){return EA(r,e,t||NA)}function NA(r,e){return r>e?1:r<e?-1:0}function EA(r,e,t){let o=0,n=r.length,s=0,i=!1;for(;o<n;){s=o+(n-o>>>1);let a=t(e,r[s]);a>0?o=s+1:(n=s,i=!a)}return i?o:-o-1}function Bl(r,e,t,o,n){return pf(r,e,t,o,n,0)}function Ml(r,e,t,o,n,s){return pf(r,e,t,o,n,0,!1,s,!0)}function Vl(r,e,t,o,n,s){return pf(r,e,t,o,n,s,!0)}function pf(r,e,t,o,n,s,i=!1,a=!1,u=!1){let l=[];for(let h=0;h<e.length;h++)e[h]>n&&l.push({score:e[h],boxIndex:h,suppressBeginIndex:0});l.sort(Mb);let c=s>0?-.5/s:0,p=[],m=[];for(;p.length<t&&l.length>0;){let h=l.pop(),{score:x,boxIndex:v,suppressBeginIndex:N}=h;if(x<n)break;let E=!1;for(let k=p.length-1;k>=N;--k){let R=IA(r,v,p[k]);if(R>=o){E=!0;break}if(h.score=h.score*kA(o,c,R),h.score<=n)break}h.suppressBeginIndex=p.length,E||(h.score===x?(p.push(v),m.push(h.score)):h.score>n&&Bb(l,h,Mb))}let f=p.length,d=t-f;a&&d>0&&(p.push(...new Array(d).fill(0)),m.push(...new Array(d).fill(0)));let g={selectedIndices:p};return i&&(g.selectedScores=m),u&&(g.validOutputs=f),g}function IA(r,e,t){let o=r.subarray(e*4,e*4+4),n=r.subarray(t*4,t*4+4),s=Math.min(o[0],o[2]),i=Math.min(o[1],o[3]),a=Math.max(o[0],o[2]),u=Math.max(o[1],o[3]),l=Math.min(n[0],n[2]),c=Math.min(n[1],n[3]),p=Math.max(n[0],n[2]),m=Math.max(n[1],n[3]),f=(a-s)*(u-i),d=(p-l)*(m-c);if(f<=0||d<=0)return 0;let g=Math.max(s,l),h=Math.max(i,c),x=Math.min(a,p),v=Math.min(u,m),N=Math.max(x-g,0)*Math.max(v-h,0);return N/(f+d-N)}function kA(r,e,t){let o=Math.exp(e*t*t);return t<=r?o:0}function Mb(r,e){return r.score-e.score||r.score===e.score&&e.boxIndex-r.boxIndex}async function $A(r,e,t,o=.5,n=Number.NEGATIVE_INFINITY){let s=b(r,"boxes","nonMaxSuppressionAsync"),i=b(e,"scores","nonMaxSuppressionAsync"),a=jt(s,i,t,o,n);t=a.maxOutputSize,o=a.iouThreshold,n=a.scoreThreshold;let u=await Promise.all([s.data(),i.data()]),l=u[0],c=u[1],{selectedIndices:p}=Bl(l,c,t,o,n);return s!==r&&s.dispose(),i!==e&&i.dispose(),Re(p,"int32")}var Vb=$A;function RA(r,e,t,o=.5,n=Number.NEGATIVE_INFINITY,s=0){let i=b(r,"boxes","nonMaxSuppression"),a=b(e,"scores","nonMaxSuppression"),u=jt(i,a,t,o,n,s);t=u.maxOutputSize,o=u.iouThreshold,n=u.scoreThreshold,s=u.softNmsSigma;let l={boxes:i,scores:a},c={maxOutputSize:t,iouThreshold:o,scoreThreshold:n,softNmsSigma:s},p=S.runKernel(Fa,l,c);return{selectedIndices:p[0],selectedScores:p[1]}}var Ub=w({nonMaxSuppressionWithScore_:RA});async function AA(r,e,t,o=.5,n=Number.NEGATIVE_INFINITY,s=0){let i=b(r,"boxes","nonMaxSuppressionAsync"),a=b(e,"scores","nonMaxSuppressionAsync"),u=jt(i,a,t,o,n,s);t=u.maxOutputSize,o=u.iouThreshold,n=u.scoreThreshold,s=u.softNmsSigma;let l=await Promise.all([i.data(),a.data()]),c=l[0],p=l[1],{selectedIndices:m,selectedScores:f}=Vl(c,p,t,o,n,s);return i!==r&&i.dispose(),a!==e&&a.dispose(),{selectedIndices:Re(m,"int32"),selectedScores:Re(f)}}var Gb=AA;function _A(r,e,t,o=.5,n=Number.NEGATIVE_INFINITY,s=!1){let i=b(r,"boxes","nonMaxSuppression"),a=b(e,"scores","nonMaxSuppression"),u=jt(i,a,t,o,n,null),l=u.maxOutputSize,c=u.iouThreshold,p=u.scoreThreshold,m={boxes:i,scores:a},f={maxOutputSize:l,iouThreshold:c,scoreThreshold:p,padToMaxOutputSize:s},d=S.runKernel(Oa,m,f);return{selectedIndices:d[0],validOutputs:d[1]}}var zb=w({nonMaxSuppressionPadded_:_A});async function DA(r,e,t,o=.5,n=Number.NEGATIVE_INFINITY,s=!1){let i=b(r,"boxes","nonMaxSuppressionAsync"),a=b(e,"scores","nonMaxSuppressionAsync"),u=jt(i,a,t,o,n,null),l=u.maxOutputSize,c=u.iouThreshold,p=u.scoreThreshold,[m,f]=await Promise.all([i.data(),a.data()]),{selectedIndices:d,validOutputs:g}=Ml(m,f,l,c,p,s);return i!==r&&i.dispose(),a!==e&&a.dispose(),{selectedIndices:Re(d,"int32"),validOutputs:K(g,"int32")}}var Wb=DA;function OA(r,e,t=!1,o=!1){let n=b(r,"images","resizeBilinear");C(n.rank===3||n.rank===4,()=>`Error in resizeBilinear: x must be rank 3 or 4, but got rank ${n.rank}.`),C(e.length===2,()=>`Error in resizeBilinear: new shape must 2D, but got shape ${e}.`),C(o===!1||t===!1,()=>"Error in resizeBilinear: If halfPixelCenters is true, alignCorners must be false.");let s=n,i=!1;n.rank===3&&(i=!0,s=D(n,[1,n.shape[0],n.shape[1],n.shape[2]]));let[]=e,a={images:s},u={alignCorners:t,halfPixelCenters:o,size:e},l=S.runKernel(ja,a,u);return i?D(l,[l.shape[1],l.shape[2],l.shape[3]]):l}var Hb=w({resizeBilinear_:OA});function FA(r,e,t=!1,o=!1){let n=b(r,"images","resizeNearestNeighbor");C(n.rank===3||n.rank===4,()=>`Error in resizeNearestNeighbor: x must be rank 3 or 4, but got rank ${n.rank}.`),C(e.length===2,()=>`Error in resizeNearestNeighbor: new shape must 2D, but got shape ${e}.`),C(n.dtype==="float32"||n.dtype==="int32",()=>"`images` must have `int32` or `float32` as dtype"),C(o===!1||t===!1,()=>"Error in resizeNearestNeighbor: If halfPixelCenters is true, alignCorners must be false.");let s=n,i=!1;n.rank===3&&(i=!0,s=D(n,[1,n.shape[0],n.shape[1],n.shape[2]]));let[]=e,a={images:s},u={alignCorners:t,halfPixelCenters:o,size:e},l=S.runKernel(Xa,a,u);return i?D(l,[l.shape[1],l.shape[2],l.shape[3]]):l}var Kb=w({resizeNearestNeighbor_:FA});function PA(r,e="binary",t=!1,o=.5){let n=b(r,"image","threshold"),s=.2989,i=.587,a=.114,u=n.shape[0]*n.shape[1],l=P(Re([o]),255),c,p,m,f;if(C(n.rank===3,()=>`Error in threshold: image must be rank 3,but got rank ${n.rank}.`),C(n.shape[2]===3||n.shape[2]===1,()=>`Error in threshold: image color channel must be equal to 3 or 1but got ${n.shape[2]}.`),C(n.dtype==="int32"||n.dtype==="float32",()=>`Error in dtype: image dtype must be int32 or float32,but got dtype ${n.dtype}.`),C(e==="otsu"||e==="binary",()=>`Method must be binary or otsu, but was ${e}`),n.shape[2]===3){[c,p,m]=Pr(n,[1,1,1],-1);let h=P(c,s),x=P(p,i),v=P(m,a);f=V(V(h,x),v)}else f=r;if(e==="otsu"){let h=Yu(ee(kl(f),"int32"),ot([]),256);l=LA(h,u)}let d=t?Xn(f,l):Po(f,l);return ee(P(d,255),"int32")}function LA(r,e){let t=Re([-1]),o=Re([0]),n=Re([0]),s,i,a,u,l,c;for(let p=0;p<r.size-1;p++){s=Q(r,0,p+1),i=Q(r,p+1),l=Y(le(s),e),c=Y(le(i),e);let m=le(P(s,no(0,s.size)));a=Y(m,le(s));let f=gr(i.shape,s.size),d=V(no(0,i.size),f),g=P(i,d);u=Y(le(g),le(i));let h=q(a,u),x=q(a,u),v=P(l,c);n=P(P(v,h),x);let N=Po(n,o);o=Ut(N,n,o),t=Ut(N,Re([p]),t)}return t}var qb=w({threshold_:PA});function BA(r,e,t="nearest",o="constant",n=0,s){let i=b(r,"image","transform","float32"),a=b(e,"transforms","transform","float32");C(i.rank===4,()=>`Error in transform: image must be rank 4,but got rank ${i.rank}.`),C(a.rank===2&&(a.shape[0]===i.shape[0]||a.shape[0]===1)&&a.shape[1]===8,()=>"Error in transform: Input transform should be batch x 8 or 1 x 8"),C(s==null||s.length===2,()=>`Error in transform: outputShape must be [height, width] or null, but got ${s}.`);let u={image:i,transforms:a},l={interpolation:t,fillMode:o,fillValue:n,outputShape:s};return S.runKernel(vu,u,l)}var Xb=w({transform_:BA});function MA(r,e,t){let o=b(r,"a","bandPart");C(o.rank>=2,()=>`bandPart(): Rank must be at least 2, got ${o.rank}.`);let n=o.shape,[s,i]=o.shape.slice(-2),a,u;typeof e=="number"?(C(e%1===0,()=>`bandPart(): numLower must be an integer, got ${e}.`),C(e<=s,()=>`bandPart(): numLower (${e}) must not be greater than the number of rows (${s}).`),a=b(e<0?s:e,"numLower","bandPart")):(C(e.dtype==="int32",()=>"bandPart(): numLower's dtype must be an int32."),a=Ut(Ks(e,0),s,Or(e,s))),typeof t=="number"?(C(t%1===0,()=>`bandPart(): numUpper must be an integer, got ${t}.`),C(t<=i,()=>`bandPart(): numUpper (${t}) must not be greater than the number of columns (${i}).`),u=b(t<0?i:t,"numUpper","bandPart")):(C(t.dtype==="int32",()=>"bandPart(): numUpper's dtype must be an int32."),u=Ut(Ks(t,0),i,Or(t,i)));let l=D(no(0,s,1,"int32"),[-1,1]),c=no(0,i,1,"int32"),p=q(l,c),m=Lo(Xn(p,a),il(p,qe(u))),f=At([s,i],o.dtype);return D(nt(zt(D(o,[-1,s,i])).map(d=>Ut(m,d,f))),n)}var jb=w({bandPart_:MA});function VA(r){let e;if(Array.isArray(r)){e=!1,C(r!=null&&r.length>0,()=>"Gram-Schmidt process: input must not be null, undefined, or empty");let n=r[0].shape[0];for(let s=1;s<r.length;++s)C(r[s].shape[0]===n,()=>`Gram-Schmidt: Non-unique lengths found in the input vectors: (${r[s].shape[0]} vs. ${n})`)}else e=!0,r=Pr(r,r.shape[0],0).map(n=>ge(n,[0]));C(r.length<=r[0].shape[0],()=>`Gram-Schmidt: Number of vectors (${r.length}) exceeds number of dimensions (${r[0].shape[0]}).`);let t=[],o=r;for(let n=0;n<r.length;++n)t.push(S.tidy(()=>{let s=o[n];if(n>0)for(let i=0;i<n;++i){let a=P(le(P(t[i],s)),t[i]);s=q(s,a)}return Y(s,Fo(s,"euclidean"))}));return e?nt(t,0):t}var Yb=w({gramSchmidt_:VA});function UA(r,e=!1){if(C(r.rank>=2,()=>`qr() requires input tensor to have a rank >= 2, but got rank ${r.rank}`),r.rank===2)return Qb(r,e);{let t=r.shape.slice(0,r.shape.length-2).reduce((u,l)=>u*l),o=zt(D(r,[t,r.shape[r.shape.length-2],r.shape[r.shape.length-1]]),0),n=[],s=[];o.forEach(u=>{let[l,c]=Qb(u,e);n.push(l),s.push(c)});let i=D(nt(n,0),r.shape),a=D(nt(s,0),r.shape);return[i,a]}}function Qb(r,e=!1){return S.tidy(()=>{C(r.shape.length===2,()=>`qr2d() requires a 2D Tensor, but got a ${r.shape.length}D Tensor.`);let t=r.shape[0],o=r.shape[1],n=ol(t),s=$t(r),i=st([[1]],[1,1]),a=$t(i),u=t>=o?o:t;for(let l=0;l<u;++l){let c=s,p=a,m=n;[a,s,n]=S.tidy(()=>{let f=Q(s,[l,l],[t-l,1]),d=Fo(f),g=Q(s,[l,l],[1,1]),h=Ut(Po(g,0),st([[-1]]),st([[1]])),x=q(g,P(h,d)),v=Y(f,x);v.shape[0]===1?a=$t(i):a=xe([i,Q(v,[1,0],[v.shape[0]-1,v.shape[1]])],0);let N=qe(Y(ue(h,x),d)),E=Q(s,[l,0],[t-l,o]),k=P(N,a),R=Fl(a);if(l===0)s=q(E,ue(k,ue(R,E)));else{let O=q(E,ue(k,ue(R,E)));s=xe([Q(s,[0,0],[l,o]),O],0)}let A=Fl(k),_=Q(n,[0,l],[t,n.shape[1]-l]);if(l===0)n=q(_,ue(ue(_,a),A));else{let O=q(_,ue(ue(_,a),A));n=xe([Q(n,[0,0],[t,l]),O],1)}return[a,s,n]}),ne([c,p,m])}return!e&&t>o&&(n=Q(n,[0,0],[t,o]),s=Q(s,[0,0],[o,o])),[n,s]})}var Zb=w({qr_:UA});var De;(function(r){r[r.NONE=0]="NONE",r[r.MEAN=1]="MEAN",r[r.SUM=2]="SUM",r[r.SUM_BY_NONZERO_WEIGHTS=3]="SUM_BY_NONZERO_WEIGHTS"})(De||(De={}));function GA(r,e,t=De.SUM_BY_NONZERO_WEIGHTS){let o=b(r,"losses","computeWeightedLoss"),n=null;e!=null&&(n=b(e,"weights","computeWeightedLoss"));let s=n==null?o:P(o,n);if(t===De.NONE)return s;if(t===De.SUM)return le(s);if(t===De.MEAN){if(n==null)return Bo(s);{let i=o.size/n.size,a=Y(le(s),le(n));return i>1?Y(a,K(i)):a}}if(t===De.SUM_BY_NONZERO_WEIGHTS){if(n==null)return Y(le(s),K(o.size));{let i=P(n,yr(o.shape)),a=ee(le(bl(i,K(0))),"float32");return Y(le(s),a)}}throw Error(`Unknown reduction: ${t}`)}var Xe=w({computeWeightedLoss_:GA});function zA(r,e,t,o=De.SUM_BY_NONZERO_WEIGHTS){let n=b(r,"labels","absoluteDifference"),s=b(e,"predictions","absoluteDifference"),i=null;t!=null&&(i=b(t,"weights","absoluteDifference")),$e(n.shape,s.shape,"Error in absoluteDifference: ");let a=ze(q(n,s));return Xe(a,i,o)}var Jb=w({absoluteDifference_:zA});function WA(r,e,t,o,n=De.SUM_BY_NONZERO_WEIGHTS){let s=b(r,"labels","cosineDistance"),i=b(e,"predictions","cosineDistance"),a=null;o!=null&&(a=b(o,"weights","cosineDistance")),$e(s.shape,i.shape,"Error in cosineDistance: ");let u=K(1),l=q(u,le(P(s,i),t,!0));return Xe(l,a,n)}var e0=w({cosineDistance_:WA});function HA(r,e,t,o=De.SUM_BY_NONZERO_WEIGHTS){let n=b(r,"labels","hingeLoss"),s=b(e,"predictions","hingeLoss"),i=null;t!=null&&(i=b(t,"weights","hingeLoss")),$e(n.shape,s.shape,"Error in hingeLoss: ");let a=K(1);n=q(P(K(2),n),a);let u=so(q(a,P(n,s)));return Xe(u,i,o)}var t0=w({hingeLoss_:HA});function KA(r,e,t,o=1,n=De.SUM_BY_NONZERO_WEIGHTS){let s=b(r,"labels","huberLoss"),i=b(e,"predictions","huberLoss"),a=null;t!=null&&(a=b(t,"weights","huberLoss")),$e(s.shape,i.shape,"Error in huberLoss: ");let u=K(o),l=ze(q(i,s)),c=Or(l,u),p=q(l,c),m=V(P(K(.5),Me(c)),P(u,p));return Xe(m,a,n)}var r0=w({huberLoss_:KA});function qA(r,e,t,o=1e-7,n=De.SUM_BY_NONZERO_WEIGHTS){let s=b(r,"labels","logLoss"),i=b(e,"predictions","logLoss"),a=null;t!=null&&(a=b(t,"weights","logLoss")),$e(s.shape,i.shape,"Error in logLoss: ");let u=K(1),l=K(o),c=qe(P(s,Dr(V(i,l)))),p=P(q(u,s),Dr(V(q(u,i),l))),m=q(c,p);return Xe(m,a,n)}var o0=w({logLoss_:qA});function XA(r,e,t,o=De.SUM_BY_NONZERO_WEIGHTS){let n=b(r,"labels","meanSquaredError"),s=b(e,"predictions","meanSquaredError"),i=null;t!=null&&(i=b(t,"weights","meanSquaredError")),$e(n.shape,s.shape,"Error in meanSquaredError: ");let a=Rl(n,s);return Xe(a,i,o)}var n0=w({meanSquaredError_:XA});function jA(r,e){let t=b(r,"labels","sigmoidCrossEntropyWithLogits"),o=b(e,"logits","sigmoidCrossEntropyWithLogits");$e(t.shape,o.shape,"Error in sigmoidCrossEntropyWithLogits: ");let n=so(o),s=P(o,t),i=ll(ht(qe(ze(o))));return V(q(n,s),i)}function YA(r,e,t,o=0,n=De.SUM_BY_NONZERO_WEIGHTS){let s=b(r,"multiClassLabels","sigmoidCrossEntropy"),i=b(e,"logits","sigmoidCrossEntropy"),a=null;if(t!=null&&(a=b(t,"weights","sigmoidCrossEntropy")),$e(s.shape,i.shape,"Error in sigmoidCrossEntropy: "),o>0){let l=K(o),c=K(1),p=K(.5);s=V(P(s,q(c,l)),P(p,l))}let u=jA(s,i);return Xe(u,a,n)}var s0=w({sigmoidCrossEntropy_:YA});function QA(r,e,t=-1){if(t===-1&&(t=e.rank-1),t!==e.rank-1)throw Error(`Softmax cross entropy along a non-last dimension is not yet supported. Labels / logits was rank ${e.rank} and dim was ${t}`);return gt((n,s,i)=>{let u=ml(s,[t],!0),l=q(ee(s,"float32"),u);i([n,l]);let c=qe(P(l,n));return{value:le(c,[t]),gradFunc:(f,d)=>{let[g,h]=d,x=Ar(f.shape,[t]);return[P(D(f,x),q(ee(g,"float32"),ht(h))),P(D(f,x),q(ht(h),ee(g,"float32")))]}}})(r,e)}function ZA(r,e,t,o=0,n=De.SUM_BY_NONZERO_WEIGHTS){let s=b(r,"onehotLabels","softmaxCrossEntropy"),i=b(e,"logits","softmaxCrossEntropy"),a=null;if(t!=null&&(a=b(t,"weights","softmaxCrossEntropy")),$e(s.shape,i.shape,"Error in softmaxCrossEntropy: "),o>0){let l=K(o),c=K(1),p=K(s.shape[1]);s=V(P(s,q(c,l)),Y(l,p))}let u=QA(s,i);return Xe(u,a,n)}var i0=w({softmaxCrossEntropy_:ZA});function JA(r,e,t,o){let n=b(r,"indices","sparseFillEmptyRows","int32"),s=b(e,"values","sparseFillEmptyRows"),i=b(t,"denseShape","sparseFillEmptyRows","int32"),a=b(o,"defaultValue","sparseFillEmptyRows",s.dtype);if(n.rank!==2)throw new Error(`Indices should be Tensor2D but received shape
        ${n.shape}`);if(s.rank!==1)throw new Error(`Values should be Tensor1D but received shape ${s.shape}`);if(i.rank!==1)throw new Error(`Dense shape should be Tensor1D but received shape ${i.shape}`);if(a.rank!==0)throw new Error(`Default value should be a scalar but received shape ${a.shape}`);let u={indices:n,values:s,denseShape:i,defaultValue:a},l=S.runKernel(cu,u);return{outputIndices:l[0],outputValues:l[1],emptyRowIndicator:l[2],reverseIndexMap:l[3]}}var a0=w({sparseFillEmptyRows_:JA});function e_(r,e,t){let o=b(r,"inputIndices","sparseReshape","int32"),n=b(e,"inputShape","sparseReshape","int32"),s=b(t,"newShape","sparseReshape","int32");if(o.rank!==2)throw new Error(`Input indices should be Tensor2D but received shape
        ${o.shape}`);if(n.rank!==1)throw new Error(`Input shape should be Tensor1D but received shape ${n.shape}`);if(s.rank!==1)throw new Error(`New shape should be Tensor1D but received shape ${s.shape}`);let i={inputIndices:o,inputShape:n,newShape:s},a=S.runKernel(pu,i);return{outputIndices:a[0],outputShape:a[1]}}var u0=w({sparseReshape_:e_});function t_(r,e,t){let o=b(r,"data","sparseSegmentMean"),n=b(e,"indices","sparseSegmentMean","int32"),s=b(t,"segmentIds","sparseSegmentMean","int32");if(o.rank<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(n.rank!==1)throw new Error(`Indices should be Tensor1D but received shape
          ${n.shape}`);if(s.rank!==1)throw new Error(`Segment ids should be Tensor1D but received shape
          ${s.shape}`);let i={data:o,indices:n,segmentIds:s};return S.runKernel(mu,i)}var l0=w({sparseSegmentMean_:t_});function r_(r,e,t){let o=b(r,"data","sparseSegmentSum"),n=b(e,"indices","sparseSegmentSum","int32"),s=b(t,"segmentIds","sparseSegmentSum","int32");if(o.rank<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(n.rank!==1)throw new Error(`Indices should be Tensor1D but received shape
         ${n.shape}`);if(s.rank!==1)throw new Error(`Segment ids should be Tensor1D but received shape
         ${s.shape}`);let i={data:o,indices:n,segmentIds:s};return S.runKernel(fu,i)}var c0=w({sparseSegmentSum_:r_});function o_(r,e,t,o,n,s,i,a){let u=b(r,"data","stringNGrams","string");if(u.dtype!=="string")throw new Error("Data must be of datatype string");if(u.shape.length!==1)throw new Error(`Data must be a vector, saw: ${u.shape}`);let l=b(e,"dataSplits","stringNGrams");if(l.dtype!=="int32")throw new Error("Data splits must be of datatype int32");let c={separator:t,nGramWidths:o,leftPad:n,rightPad:s,padWidth:i,preserveShortSequences:a},p={data:u,dataSplits:l},m=S.runKernel(gu,p,c);return{nGrams:m[0],nGramsSplits:m[1]}}var p0=w({stringNGrams_:o_});function n_(r,e,t=!0){let o=b(r,"input","stringSplit","string"),n=b(e,"delimiter","stringSplit","string");if(o.rank!==1)throw new Error(`Input should be Tensor1D but received shape ${o.shape}`);if(n.rank!==0)throw new Error(`Delimiter should be a scalar but received shape ${n.shape}`);let s={skipEmpty:t},i={input:o,delimiter:n},a=S.runKernel(xu,i,s);return{indices:a[0],values:a[1],shape:a[2]}}var m0=w({stringSplit_:n_});function s_(r,e){let t=b(r,"input","stringToHashBucketFast","string"),o={numBuckets:e};if(e<=0)throw new Error("Number of buckets must be at least 1");let n={input:t};return S.runKernel(yu,n,o)}var f0=w({stringToHashBucketFast_:s_});function i_(r,e,t,o=!0){let n=b(r,"input","staticRegexReplace","string"),s={pattern:e,rewrite:t,replaceGlobal:o};return S.runKernel(_n,{x:n},s)}var d0=w({staticRegexReplace_:i_});var a_={fft:Yn,ifft:Uo,rfft:Qn,irfft:$l},u_={hammingWindow:Rb,hannWindow:Pl,frame:Ll,stft:Ab},Lr={flipLeftRight:Db,grayscaleToRGB:Ob,resizeNearestNeighbor:Kb,resizeBilinear:Hb,rgbToGrayscale:Fb,rotateWithOffset:Pb,cropAndResize:_b,nonMaxSuppression:Lb,nonMaxSuppressionAsync:Vb,nonMaxSuppressionWithScore:Ub,nonMaxSuppressionWithScoreAsync:Gb,nonMaxSuppressionPadded:zb,nonMaxSuppressionPaddedAsync:Wb,threshold:qb,transform:Xb},l_={bandPart:jb,gramSchmidt:Yb,qr:Zb},c_={absoluteDifference:Jb,computeWeightedLoss:Xe,cosineDistance:e0,hingeLoss:t0,huberLoss:r0,logLoss:o0,meanSquaredError:n0,sigmoidCrossEntropy:s0,softmaxCrossEntropy:i0},p_={sparseFillEmptyRows:a0,sparseReshape:u0,sparseSegmentMean:l0,sparseSegmentSum:c0},m_={stringNGrams:p0,stringSplit:m0,stringToHashBucketFast:f0,staticRegexReplace:d0};var f_=new Map,d_=new Map,Ul=class{getClassName(){return this.constructor.className}static fromConfig(e,t){return new e(t)}},mf=class r{constructor(){this.classNameMap={}}static getMap(){return r.instance==null&&(r.instance=new r),r.instance}static register(e){r.getMap().classNameMap[e.className]=[e,e.fromConfig]}};function h0(r,e,t){C(r.className!=null,()=>"Class being registered does not have the static className property defined."),C(typeof r.className=="string",()=>"className is required to be a string, but got type "+typeof r.className),C(r.className.length>0,()=>"Class being registered has an empty-string as its className, which is disallowed."),typeof e>"u"&&(e="Custom"),typeof t>"u"&&(t=r.className);let o=t,n=e+">"+o;return mf.register(r),f_.set(n,r),d_.set(r,n),r}var xt=class extends Ul{minimize(e,t=!1,o){let{value:n,grads:s}=this.computeGradients(e,o);if(o!=null){let i=o.map(a=>({name:a.name,tensor:s[a.name]}));this.applyGradients(i)}else this.applyGradients(s);return ne(s),t?n:(n.dispose(),null)}get iterations(){return this.iterations_==null&&(this.iterations_=0),this.iterations_}incrementIterations(){this.iterations_=this.iterations+1}computeGradients(e,t){return Yx(e,t)}dispose(){this.iterations_!=null&&ne(this.iterations_)}async saveIterations(){return this.iterations_==null&&(this.iterations_=0),{name:"iter",tensor:K(this.iterations_,"int32")}}async getWeights(){throw new Error("getWeights() is not implemented for this optimizer yet.")}async setWeights(e){throw new Error(`setWeights() is not implemented for this optimizer class ${this.getClassName()}`)}async extractIterations(e){return this.iterations_=(await e[0].tensor.data())[0],e.slice(1)}};Object.defineProperty(xt,Symbol.hasInstance,{value:r=>r.minimize!=null&&r.computeGradients!=null&&r.applyGradients!=null});var Gl=class extends xt{static get className(){return"Adadelta"}constructor(e,t,o=null){super(),this.learningRate=e,this.rho=t,this.epsilon=o,this.accumulatedGrads=[],this.accumulatedUpdates=[],o==null&&(this.epsilon=S.backend.epsilon())}applyGradients(e){(Array.isArray(e)?e.map(o=>o.name):Object.keys(e)).forEach((o,n)=>{let s=S.registeredVariables[o],i=!1;this.accumulatedGrads[n]==null&&(this.accumulatedGrads[n]={originalName:`${o}/accum_grad`,variable:H(()=>Be(s).variable(i))}),this.accumulatedUpdates[n]==null&&(this.accumulatedUpdates[n]={originalName:`${o}/accum_var`,variable:H(()=>Be(s).variable(i))});let a=Array.isArray(e)?e[n].tensor:e[o];if(a==null)return;let u=this.accumulatedGrads[n].variable,l=this.accumulatedUpdates[n].variable;H(()=>{let c=V(P(u,this.rho),P(Me(a),1-this.rho)),p=P(Y(dt(V(l,this.epsilon)),dt(V(u,this.epsilon))),a),m=V(P(l,this.rho),P(Me(p),1-this.rho));u.assign(c),l.assign(m);let f=V(P(p,-this.learningRate),s);s.assign(f)})}),this.incrementIterations()}dispose(){this.accumulatedUpdates!=null&&(ne(this.accumulatedGrads.map(e=>e.variable)),ne(this.accumulatedUpdates.map(e=>e.variable)))}async getWeights(){let e=[...this.accumulatedGrads,...this.accumulatedUpdates];return[await this.saveIterations()].concat(e.map(t=>({name:t.originalName,tensor:t.variable})))}async setWeights(e){e=await this.extractIterations(e);let t=e.length/2,o=!1;this.accumulatedGrads=e.slice(0,t).map(n=>({originalName:n.name,variable:n.tensor.variable(o)})),this.accumulatedUpdates=e.slice(t,t*2).map(n=>({originalName:n.name,variable:n.tensor.variable(o)}))}getConfig(){return{learningRate:this.learningRate,rho:this.rho,epsilon:this.epsilon}}static fromConfig(e,t){return new e(t.learningRate,t.rho,t.epsilon)}};var zl=class extends xt{static get className(){return"Adagrad"}constructor(e,t=.1){super(),this.learningRate=e,this.initialAccumulatorValue=t,this.accumulatedGrads=[]}applyGradients(e){(Array.isArray(e)?e.map(o=>o.name):Object.keys(e)).forEach((o,n)=>{let s=S.registeredVariables[o];this.accumulatedGrads[n]==null&&(this.accumulatedGrads[n]={originalName:`${o}/accumulator`,variable:H(()=>gr(s.shape,this.initialAccumulatorValue).variable(!1))});let i=Array.isArray(e)?e[n].tensor:e[o];if(i==null)return;let a=this.accumulatedGrads[n].variable;H(()=>{let u=V(a,Me(i));a.assign(u);let l=V(P(Y(i,dt(V(u,S.backend.epsilon()))),-this.learningRate),s);s.assign(l)})}),this.incrementIterations()}dispose(){this.accumulatedGrads!=null&&ne(this.accumulatedGrads.map(e=>e.variable))}async getWeights(){return[await this.saveIterations()].concat(this.accumulatedGrads.map(e=>({name:e.originalName,tensor:e.variable})))}async setWeights(e){e=await this.extractIterations(e);let t=!1;this.accumulatedGrads=e.map(o=>({originalName:o.name,variable:o.tensor.variable(t)}))}getConfig(){return{learningRate:this.learningRate,initialAccumulatorValue:this.initialAccumulatorValue}}static fromConfig(e,t){return new e(t.learningRate,t.initialAccumulatorValue)}};var Wl=class extends xt{static get className(){return"Adam"}constructor(e,t,o,n=null){super(),this.learningRate=e,this.beta1=t,this.beta2=o,this.epsilon=n,this.accumulatedFirstMoment=[],this.accumulatedSecondMoment=[],H(()=>{this.accBeta1=K(t).variable(),this.accBeta2=K(o).variable()}),n==null&&(this.epsilon=S.backend.epsilon())}applyGradients(e){let t=Array.isArray(e)?e.map(o=>o.name):Object.keys(e);H(()=>{let o=q(1,this.accBeta1),n=q(1,this.accBeta2);t.forEach((s,i)=>{let a=S.registeredVariables[s],u=!1;this.accumulatedFirstMoment[i]==null&&(this.accumulatedFirstMoment[i]={originalName:`${s}/m`,variable:H(()=>Be(a).variable(u))}),this.accumulatedSecondMoment[i]==null&&(this.accumulatedSecondMoment[i]={originalName:`${s}/v`,variable:H(()=>Be(a).variable(u))});let l=Array.isArray(e)?e[i].tensor:e[s];if(l==null)return;let c=this.accumulatedFirstMoment[i].variable,p=this.accumulatedSecondMoment[i].variable,m=V(P(c,this.beta1),P(l,1-this.beta1)),f=V(P(p,this.beta2),P(Me(l),1-this.beta2)),d=Y(m,o),g=Y(f,n);c.assign(m),p.assign(f);let h=V(P(Y(d,V(dt(g),this.epsilon)),-this.learningRate),a);a.assign(h)}),this.accBeta1.assign(P(this.accBeta1,this.beta1)),this.accBeta2.assign(P(this.accBeta2,this.beta2))}),this.incrementIterations()}dispose(){this.accBeta1.dispose(),this.accBeta2.dispose(),this.accumulatedFirstMoment!=null&&ne(this.accumulatedFirstMoment.map(e=>e.variable)),this.accumulatedSecondMoment!=null&&ne(this.accumulatedSecondMoment.map(e=>e.variable))}async getWeights(){let e=[...this.accumulatedFirstMoment,...this.accumulatedSecondMoment];return[await this.saveIterations()].concat(e.map(t=>({name:t.originalName,tensor:t.variable})))}async setWeights(e){e=await this.extractIterations(e),H(()=>{this.accBeta1.assign(_r(this.beta1,this.iterations_+1)),this.accBeta2.assign(_r(this.beta2,this.iterations_+1))});let t=e.length/2,o=!1;this.accumulatedFirstMoment=e.slice(0,t).map(n=>({originalName:n.name,variable:n.tensor.variable(o)})),this.accumulatedSecondMoment=e.slice(t,t*2).map(n=>({originalName:n.name,variable:n.tensor.variable(o)}))}getConfig(){return{learningRate:this.learningRate,beta1:this.beta1,beta2:this.beta2,epsilon:this.epsilon}}static fromConfig(e,t){return new e(t.learningRate,t.beta1,t.beta2,t.epsilon)}};var Hl=class extends xt{static get className(){return"Adamax"}constructor(e,t,o,n=null,s=0){super(),this.learningRate=e,this.beta1=t,this.beta2=o,this.epsilon=n,this.decay=s,this.accumulatedFirstMoment=[],this.accumulatedWeightedInfNorm=[],H(()=>{this.iteration=K(0).variable(),this.accBeta1=K(t).variable()}),n==null&&(this.epsilon=S.backend.epsilon())}applyGradients(e){let t=Array.isArray(e)?e.map(o=>o.name):Object.keys(e);H(()=>{let o=q(1,this.accBeta1),n=Y(-this.learningRate,V(P(this.iteration,this.decay),1));t.forEach((s,i)=>{let a=S.registeredVariables[s],u=!1;this.accumulatedFirstMoment[i]==null&&(this.accumulatedFirstMoment[i]={originalName:`${s}/m`,variable:Be(a).variable(u)}),this.accumulatedWeightedInfNorm[i]==null&&(this.accumulatedWeightedInfNorm[i]={originalName:`${s}/v`,variable:Be(a).variable(u)});let l=Array.isArray(e)?e[i].tensor:e[s];if(l==null)return;let c=this.accumulatedFirstMoment[i].variable,p=this.accumulatedWeightedInfNorm[i].variable,m=V(P(c,this.beta1),P(l,1-this.beta1)),f=P(p,this.beta2),d=ze(l),g=xl(f,d);c.assign(m),p.assign(g);let h=V(P(Y(n,o),Y(m,V(g,this.epsilon))),a);a.assign(h)}),this.iteration.assign(V(this.iteration,1)),this.accBeta1.assign(P(this.accBeta1,this.beta1))}),this.incrementIterations()}dispose(){this.accBeta1.dispose(),this.iteration.dispose(),this.accumulatedFirstMoment!=null&&ne(this.accumulatedFirstMoment.map(e=>e.variable)),this.accumulatedWeightedInfNorm!=null&&ne(this.accumulatedWeightedInfNorm.map(e=>e.variable))}async getWeights(){throw new Error("getWeights() is not implemented for Adamax yet.")}async setWeights(e){throw new Error("setWeights() is not implemented for Adamax yet.")}getConfig(){return{learningRate:this.learningRate,beta1:this.beta1,beta2:this.beta2,epsilon:this.epsilon,decay:this.decay}}static fromConfig(e,t){return new e(t.learningRate,t.beta1,t.beta2,t.epsilon,t.decay)}};var Zn=class extends xt{static get className(){return"SGD"}constructor(e){super(),this.learningRate=e,this.setLearningRate(e)}applyGradients(e){(Array.isArray(e)?e.map(o=>o.name):Object.keys(e)).forEach((o,n)=>{let s=Array.isArray(e)?e[n].tensor:e[o];if(s==null)return;let i=S.registeredVariables[o];H(()=>{let a=V(P(this.c,s),i);i.assign(a)})}),this.incrementIterations()}setLearningRate(e){this.learningRate=e,this.c!=null&&this.c.dispose(),this.c=ft(K(-e))}dispose(){this.c.dispose()}async getWeights(){return[await this.saveIterations()]}async setWeights(e){if(e=await this.extractIterations(e),e.length!==0)throw new Error("SGD optimizer does not have settable weights.")}getConfig(){return{learningRate:this.learningRate}}static fromConfig(e,t){return new e(t.learningRate)}};var Kl=class extends Zn{static get className(){return"Momentum"}constructor(e,t,o=!1){super(e),this.learningRate=e,this.momentum=t,this.useNesterov=o,this.accumulations=[],this.m=K(this.momentum)}applyGradients(e){(Array.isArray(e)?e.map(o=>o.name):Object.keys(e)).forEach((o,n)=>{let s=S.registeredVariables[o];this.accumulations[n]==null&&(this.accumulations[n]={originalName:`${o}/momentum`,variable:H(()=>Be(s).variable(!1))});let i=this.accumulations[n].variable,a=Array.isArray(e)?e[n].tensor:e[o];a!=null&&H(()=>{let u,l=V(P(this.m,i),a);this.useNesterov?u=V(P(this.c,V(a,P(l,this.m))),s):u=V(P(this.c,l),s),i.assign(l),s.assign(u)})}),this.incrementIterations()}dispose(){this.m.dispose(),this.accumulations!=null&&ne(this.accumulations.map(e=>e.variable))}setMomentum(e){this.momentum=e}async getWeights(){return[await this.saveIterations()].concat(this.accumulations.map(e=>({name:e.originalName,tensor:e.variable})))}async setWeights(e){e=await this.extractIterations(e);let t=!1;this.accumulations=e.map(o=>({originalName:o.name,variable:o.tensor.variable(t)}))}getConfig(){return{learningRate:this.learningRate,momentum:this.momentum,useNesterov:this.useNesterov}}static fromConfig(e,t){return new e(t.learningRate,t.momentum,t.useNesterov)}};var ql=class extends xt{static get className(){return"RMSProp"}constructor(e,t=.9,o=0,n=null,s=!1){if(super(),this.learningRate=e,this.decay=t,this.momentum=o,this.epsilon=n,this.accumulatedMeanSquares=[],this.accumulatedMoments=[],this.accumulatedMeanGrads=[],this.centered=s,n==null&&(this.epsilon=S.backend.epsilon()),e==null)throw new Error("learningRate for RMSPropOptimizer must be defined.")}applyGradients(e){(Array.isArray(e)?e.map(o=>o.name):Object.keys(e)).forEach((o,n)=>{let s=S.registeredVariables[o],i=!1;this.accumulatedMeanSquares[n]==null&&(this.accumulatedMeanSquares[n]={originalName:`${o}/rms`,variable:H(()=>Be(s).variable(i))}),this.accumulatedMoments[n]==null&&(this.accumulatedMoments[n]={originalName:`${o}/momentum`,variable:H(()=>Be(s).variable(i))}),this.accumulatedMeanGrads[n]==null&&this.centered&&(this.accumulatedMeanGrads[n]={originalName:`${o}/mg`,variable:H(()=>Be(s).variable(i))});let a=Array.isArray(e)?e[n].tensor:e[o];if(a==null)return;let u=this.accumulatedMeanSquares[n].variable,l=this.accumulatedMoments[n].variable;H(()=>{let c=V(P(u,this.decay),P(Me(a),1-this.decay));if(this.centered){let p=this.accumulatedMeanGrads[n].variable,m=V(P(p,this.decay),P(a,1-this.decay)),f=Y(P(a,this.learningRate),dt(q(c,V(Me(m),this.epsilon)))),d=V(P(l,this.momentum),f);u.assign(c),p.assign(m),l.assign(d);let g=q(s,d);s.assign(g)}else{let p=V(P(u,this.decay),P(Me(a),1-this.decay)),m=V(P(l,this.momentum),Y(P(a,this.learningRate),dt(V(p,this.epsilon))));u.assign(p),l.assign(m);let f=q(s,m);s.assign(f)}})}),this.incrementIterations()}dispose(){this.accumulatedMeanSquares!=null&&ne(this.accumulatedMeanSquares.map(e=>e.variable)),this.accumulatedMeanGrads!=null&&this.centered&&ne(this.accumulatedMeanGrads.map(e=>e.variable)),this.accumulatedMoments!=null&&ne(this.accumulatedMoments.map(e=>e.variable))}async getWeights(){let e=[...this.accumulatedMeanSquares,...this.accumulatedMoments];return this.centered&&e.push(...this.accumulatedMeanGrads),[await this.saveIterations()].concat(e.map(t=>({name:t.originalName,tensor:t.variable})))}async setWeights(e){e=await this.extractIterations(e);let t=this.centered?e.length/3:e.length/2,o=!1;this.accumulatedMeanSquares=e.slice(0,t).map(n=>({originalName:n.name,variable:n.tensor.variable(o)})),this.accumulatedMoments=e.slice(t,t*2).map(n=>({originalName:n.name,variable:n.tensor.variable(o)})),this.centered&&(this.accumulatedMeanGrads=e.slice(t*2,t*3).map(n=>({originalName:n.name,variable:n.tensor.variable(o)})))}getConfig(){return{learningRate:this.learningRate,decay:this.decay,momentum:this.momentum,epsilon:this.epsilon,centered:this.centered}}static fromConfig(e,t){return new e(t.learningRate,t.decay,t.momentum,t.epsilon,t.centered)}};var h_=[Gl,zl,Wl,Hl,Kl,ql,Zn];function g0(){for(let r of h_)h0(r)}var Zs={};ye(Zs,{CompositeArrayBuffer:()=>Ke,browserFiles:()=>y0,browserHTTPRequest:()=>T0,concatenateArrayBuffers:()=>Sg,copyModel:()=>Lg,decodeWeights:()=>Bu,decodeWeightsStream:()=>Mu,encodeWeights:()=>bg,fromMemory:()=>S0,fromMemorySync:()=>yf,getLoadHandlers:()=>Ig,getModelArtifactsForJSON:()=>zn,getModelArtifactsForJSONSync:()=>Wm,getModelArtifactsInfoForJSON:()=>pr,getSaveHandlers:()=>Eg,getWeightSpecs:()=>Us,http:()=>jl,isHTTPScheme:()=>Xl,listModels:()=>Fg,loadWeights:()=>w0,moveModel:()=>Bg,registerLoadRouter:()=>Ng,registerSaveRouter:()=>Cg,removeModel:()=>Pg,weightsLoaderFactory:()=>gf,withSaveHandler:()=>C0,withSaveHandlerSync:()=>N0});var g_="model",x_=".json",y_=".weights.bin";function x0(r){return new Promise(e=>setTimeout(e)).then(r)}var Jn=class r{constructor(e){if(!$().getBool("IS_BROWSER"))throw new Error("browserDownloads() cannot proceed because the current environment is not a browser.");e.startsWith(r.URL_SCHEME)&&(e=e.slice(r.URL_SCHEME.length)),(e==null||e.length===0)&&(e=g_),this.modelJsonFileName=e+x_,this.weightDataFileName=e+y_}async save(e){if(typeof document>"u")throw new Error("Browser downloads are not supported in this environment since `document` is not present");let t=Ke.join(e.weightData),o=window.URL.createObjectURL(new Blob([t],{type:"application/octet-stream"}));if(e.modelTopology instanceof ArrayBuffer)throw new Error("BrowserDownloads.save() does not support saving model topology in binary formats yet.");{let n=[{paths:["./"+this.weightDataFileName],weights:e.weightSpecs}],s=Vu(e,n),i=window.URL.createObjectURL(new Blob([JSON.stringify(s)],{type:"application/json"})),a=this.modelJsonAnchor==null?document.createElement("a"):this.modelJsonAnchor;if(a.download=this.modelJsonFileName,a.href=i,await x0(()=>a.dispatchEvent(new MouseEvent("click"))),e.weightData!=null){let u=this.weightDataAnchor==null?document.createElement("a"):this.weightDataAnchor;u.download=this.weightDataFileName,u.href=o,await x0(()=>u.dispatchEvent(new MouseEvent("click")))}return{modelArtifactsInfo:pr(e)}}}};Jn.URL_SCHEME="downloads://";var ff=class{constructor(e){if(e==null||e.length<1)throw new Error(`When calling browserFiles, at least 1 file is required, but received ${e}`);this.jsonFile=e[0],this.weightsFiles=e.slice(1)}async load(){return new Promise((e,t)=>{let o=new FileReader;o.onload=n=>{let s=JSON.parse(n.target.result),i=s.modelTopology;if(i==null){t(new Error(`modelTopology field is missing from file ${this.jsonFile.name}`));return}if(s.weightsManifest==null){t(new Error(`weightManifest field is missing from file ${this.jsonFile.name}`));return}if(this.weightsFiles.length===0){e({modelTopology:i});return}let u=zn(s,l=>this.loadWeights(l));e(u)},o.onerror=n=>t(`Failed to read model topology and weights manifest JSON from file '${this.jsonFile.name}'. BrowserFiles supports loading Keras-style tf.Model artifacts only.`),o.readAsText(this.jsonFile)})}loadWeights(e){let t=[],o=[];for(let i of e)t.push(...i.weights),o.push(...i.paths);let n=this.checkManifestAndWeightFiles(e),s=o.map(i=>this.loadWeightsFile(i,n[i]));return Promise.all(s).then(i=>[t,i])}loadWeightsFile(e,t){return new Promise((o,n)=>{let s=new FileReader;s.onload=i=>{let a=i.target.result;o(a)},s.onerror=i=>n(`Failed to weights data from file of path '${e}'.`),s.readAsArrayBuffer(t)})}checkManifestAndWeightFiles(e){let t=[],o=this.weightsFiles.map(s=>zm(s.name)),n={};for(let s of e)s.paths.forEach(i=>{let a=zm(i);if(t.indexOf(a)!==-1)throw new Error(`Duplicate file basename found in weights manifest: '${a}'`);if(t.push(a),o.indexOf(a)===-1)throw new Error(`Weight file with basename '${a}' is not provided.`);n[i]=this.weightsFiles[o.indexOf(a)]});if(t.length!==this.weightsFiles.length)throw new Error(`Mismatch in the number of files in weights manifest (${t.length}) and the number of weight files provided (${this.weightsFiles.length}).`);return n}},b_=r=>$().getBool("IS_BROWSER")&&!Array.isArray(r)&&r.startsWith(Jn.URL_SCHEME)?w_(r.slice(Jn.URL_SCHEME.length)):null;Ve.registerSaveRouter(b_);function w_(r="model"){return new Jn(r)}function y0(r){return new ff(r)}function df(r,e,t,o){i(r),t=t??0,o=o??1,a(t,o);let n=0,s=u=>(u.then(l=>{let c=t+ ++n/r.length*(o-t);return e(c),l}),u);function i(u){C(u!=null&&Array.isArray(u)&&u.length>0,()=>"promises must be a none empty array")}function a(u,l){C(u>=0&&u<=1,()=>`Progress fraction must be in range [0, 1], but got startFraction ${u}`),C(l>=0&&l<=1,()=>`Progress fraction must be in range [0, 1], but got endFraction ${l}`),C(l>=u,()=>`startFraction must be no more than endFraction, but got startFraction ${u} and endFraction ${l}`)}return Promise.all(r.map(s))}async function hf(r,e){e==null&&(e={});let t=e.fetchFunc==null?$().platform.fetch:e.fetchFunc,o=r.map(p=>t(p,e.requestInit,{isBinary:!0})),a=(e.onProgress==null?await Promise.all(o):await df(o,e.onProgress,0,.5)).map(p=>p.arrayBuffer());return e.onProgress==null?await Promise.all(a):await df(a,e.onProgress,.5,1)}function b0(r,e){var t;let o=e.fetchFunc==null?$().platform.fetch:e.fetchFunc,n=0,s;return(t=e.onProgress)===null||t===void 0||t.call(e,0),new ReadableStream({pull:async i=>{for(var a;n<r.length;){s||(s=(await o(r[n],e.requestInit,{isBinary:!0})).body.getReader());let{done:u,value:l}=await s.read();if(u){n++,s=void 0,(a=e.onProgress)===null||a===void 0||a.call(e,n/r.length);continue}i.enqueue(l);return}i.close()}})}async function w0(r,e="",t,o){return gf(i=>hf(i,{requestInit:o}))(r,e,t)}function gf(r){return async(e,t="",o)=>{let n=e.map(()=>!1),s={},i=o!=null?o.map(()=>!1):[],a=[];if(e.forEach((f,d)=>{let g=0;f.weights.forEach(h=>{let x="quantization"in h?h.quantization.dtype:h.dtype,v=kr[x]*re(h.shape),N=()=>{n[d]=!0,s[d]==null&&(s[d]=[]),s[d].push({manifestEntry:h,groupOffset:g,sizeBytes:v})};o!=null?o.forEach((E,k)=>{E===h.name&&(N(),i[k]=!0)}):N(),a.push(h.name),g+=v})}),!i.every(f=>f)){let f=o.filter((d,g)=>!i[g]);throw new Error(`Could not find weights in manifest with names: ${f.join(", ")}. 
Manifest JSON has weights with names: ${a.join(", ")}.`)}let u=n.reduce((f,d,g)=>(d&&f.push(g),f),[]),l=[];u.forEach(f=>{e[f].paths.forEach(d=>{let g=t+(t.endsWith("/")?"":"/")+d;l.push(g)})});let c=await r(l),p={},m=0;return u.forEach(f=>{let d=e[f].paths.length,g=new Ke(c.slice(m,m+d));s[f].forEach(x=>{let v=g.slice(x.groupOffset,x.groupOffset+x.sizeBytes),N=Bu(v,[x.manifestEntry]);for(let E in N)p[E]=N[E]}),m+=d}),p}}var v_="application/octet-stream",T_="application/json",Ys=class{constructor(e,t){if(this.DEFAULT_METHOD="POST",t==null&&(t={}),this.weightPathPrefix=t.weightPathPrefix,this.weightUrlConverter=t.weightUrlConverter,t.fetchFunc!=null?(C(typeof t.fetchFunc=="function",()=>"Must pass a function that matches the signature of `fetch` (see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)"),this.fetch=t.fetchFunc):this.fetch=$().platform.fetch,C(e!=null&&e.length>0,()=>"URL path for http must not be null, undefined or empty."),Array.isArray(e)&&C(e.length===2,()=>`URL paths for http must have a length of 2, (actual length is ${e.length}).`),this.path=e,t.requestInit!=null&&t.requestInit.body!=null)throw new Error("requestInit is expected to have no pre-existing body, but has one.");this.requestInit=t.requestInit||{},this.loadOptions=t}async save(e){if(e.modelTopology instanceof ArrayBuffer)throw new Error("BrowserHTTPRequest.save() does not support saving model topology in binary formats yet.");let t=Object.assign({method:this.DEFAULT_METHOD},this.requestInit);t.body=new FormData;let o=[{paths:["./model.weights.bin"],weights:e.weightSpecs}],n=Vu(e,o);if(t.body.append("model.json",new Blob([JSON.stringify(n)],{type:T_}),"model.json"),e.weightData!=null){let i=Ke.join(e.weightData);t.body.append("model.weights.bin",new Blob([i],{type:v_}),"model.weights.bin")}let s=await this.fetch(this.path,t);if(s.ok)return{modelArtifactsInfo:pr(e),responses:[s]};throw new Error(`BrowserHTTPRequest.save() failed due to HTTP response status ${s.status}.`)}async loadModelJSON(){let e=await this.fetch(this.path,this.requestInit);if(!e.ok)throw new Error(`Request to ${this.path} failed with status code ${e.status}. Please verify this URL points to the model JSON of the model to load.`);let t;try{t=await e.json()}catch{let i=`Failed to parse model JSON of response from ${this.path}.`;throw this.path.endsWith(".pb")?i+=" Your path contains a .pb file extension. Support for .pb models have been removed in TensorFlow.js 1.0 in favor of .json models. You can re-convert your Python TensorFlow model using the TensorFlow.js 1.0 conversion scripts or you can convert your.pb models with the 'pb2json'NPM script in the tensorflow/tfjs-converter repository.":i+=" Please make sure the server is serving valid JSON for this request.",new Error(i)}let o=t.modelTopology,n=t.weightsManifest;if(o==null&&n==null)throw new Error(`The JSON from HTTP path ${this.path} contains neither model topology or manifest for weights.`);return t}async load(){if(this.loadOptions.streamWeights)return this.loadStream();let e=await this.loadModelJSON();return zn(e,t=>this.loadWeights(t))}async loadStream(){let e=await this.loadModelJSON(),t=await this.getWeightUrls(e.weightsManifest),o=Us(e.weightsManifest),n=()=>b0(t,this.loadOptions);return Object.assign(Object.assign({},e),{weightSpecs:o,getWeightStream:n})}async getWeightUrls(e){let t=Array.isArray(this.path)?this.path[1]:this.path,[o,n]=S_(t),s=this.weightPathPrefix||o,i=[],a=[];for(let u of e)for(let l of u.paths)this.weightUrlConverter!=null?a.push(this.weightUrlConverter(l)):i.push(s+l+n);return this.weightUrlConverter&&i.push(...await Promise.all(a)),i}async loadWeights(e){let t=await this.getWeightUrls(e),o=Us(e),n=await hf(t,this.loadOptions);return[o,n]}};Ys.URL_SCHEME_REGEX=/^https?:\/\//;function S_(r){let e=r.lastIndexOf("/"),t=r.lastIndexOf("?"),o=r.substring(0,e),n=t>e?r.substring(t):"";return[o+"/",n]}function Xl(r){return r.match(Ys.URL_SCHEME_REGEX)!=null}var v0=(r,e)=>{if(typeof fetch>"u"&&(e==null||e.fetchFunc==null))return null;{let t=!0;if(Array.isArray(r)?t=r.every(o=>Xl(o)):t=Xl(r),t)return jl(r,e)}return null};Ve.registerSaveRouter(v0);Ve.registerLoadRouter(v0);function jl(r,e){return new Ys(r,e)}function T0(r,e){return jl(r,e)}var Qs=class{constructor(e){this.modelArtifacts=e}load(){return this.modelArtifacts}},Yl=class{constructor(e){this.saveHandler=e}save(e){return this.saveHandler(e)}},xf=class{constructor(e){e.load&&(this.load=()=>Promise.resolve(e.load())),e.save&&(this.save=t=>Promise.resolve(e.save(t)))}};function S0(r,e,t,o){let n=arguments;return new xf(yf(...n))}function yf(r,e,t,o){return arguments.length===1?r.modelTopology!=null||r.weightSpecs!=null?new Qs(r):(console.warn("Please call tf.io.fromMemory() with only one argument. The argument should be of type ModelArtifacts. The multi-argument signature of tf.io.fromMemory() has been deprecated and will be removed in a future release."),new Qs({modelTopology:r})):(console.warn("Please call tf.io.fromMemory() with only one argument. The argument should be of type ModelArtifacts. The multi-argument signature of tf.io.fromMemory() has been deprecated and will be removed in a future release."),new Qs({modelTopology:r,weightSpecs:e,weightData:t,trainingConfig:o}))}function C0(r){return new Yl(r)}function N0(r){return new Yl(r)}var io={};ye(io,{draw:()=>A_,fromPixels:()=>__,fromPixelsAsync:()=>k_,toPixels:()=>R_});var Ko,E0=!1;function I0(r,e=3){if(e>4)throw new Error("Cannot construct Tensor with more than 4 channels from pixels.");if(r==null)throw new Error("pixels passed to tf.browser.fromPixels() can not be null");let t=!1,o=!1,n=!1,s=!1,i=!1,a=!1;if(r.data instanceof Uint8Array)t=!0;else if(typeof ImageData<"u"&&r instanceof ImageData)o=!0;else if(typeof HTMLVideoElement<"u"&&r instanceof HTMLVideoElement)n=!0;else if(typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement)s=!0;else if(r.getContext!=null)i=!0;else if(typeof ImageBitmap<"u"&&r instanceof ImageBitmap)a=!0;else throw new Error(`pixels passed to tf.browser.fromPixels() must be either an HTMLVideoElement, HTMLImageElement, HTMLCanvasElement, ImageData in browser, or OffscreenCanvas, ImageData in webworker or {data: Uint32Array, width: number, height: number}, but was ${r.constructor.name}`);if(Fn(_s,S.backendName)!=null){let d={pixels:r},g={numChannels:e};return S.runKernel(_s,d,g)}let[l,c]=n?[r.videoWidth,r.videoHeight]:[r.width,r.height],p;if(i)p=r.getContext("2d").getImageData(0,0,l,c).data;else if(o||t)p=r.data;else if(s||n||a){if(Ko==null)if(typeof document>"u")if(typeof OffscreenCanvas<"u"&&typeof OffscreenCanvasRenderingContext2D<"u")Ko=new OffscreenCanvas(1,1).getContext("2d");else throw new Error("Cannot parse input in current context. Reason: OffscreenCanvas Context2D rendering is not supported.");else Ko=document.createElement("canvas").getContext("2d",{willReadFrequently:!0});Ko.canvas.width=l,Ko.canvas.height=c,Ko.drawImage(r,0,0,l,c),p=Ko.getImageData(0,0,l,c).data}let m;if(e===4)m=new Int32Array(p);else{let d=l*c;m=new Int32Array(d*e);for(let g=0;g<d;g++)for(let h=0;h<e;++h)m[g*e+h]=p[g*4+h]}return _l(m,[c,l,e],"int32")}function C_(r){return r!=null&&r.data instanceof Uint8Array}function N_(){return typeof window<"u"&&typeof ImageBitmap<"u"&&window.hasOwnProperty("createImageBitmap")}function E_(r){return r!=null&&r.width!==0&&r.height!==0}function I_(r){return N_()&&!(r instanceof ImageBitmap)&&E_(r)&&!C_(r)}async function k_(r,e=3){let t=null;if($().getBool("WRAP_TO_IMAGEBITMAP")&&I_(r)){let o;try{o=await createImageBitmap(r,{premultiplyAlpha:"none"})}catch{o=null}o!=null&&o.width===r.width&&o.height===r.height?t=o:t=r}else t=r;return I0(t,e)}function k0(r){if(r.rank!==2&&r.rank!==3)throw new Error(`toPixels only supports rank 2 or 3 tensors, got rank ${r.rank}.`);let e=r.rank===2?1:r.shape[2];if(e>4||e===2)throw new Error(`toPixels only supports depth of size 1, 3 or 4 but got ${e}`);if(r.dtype!=="float32"&&r.dtype!=="int32")throw new Error(`Unsupported type for toPixels: ${r.dtype}. Please use float32 or int32 tensors.`)}function $_(r){let e=r?.alpha||1;if(e>1||e<0)throw new Error(`Alpha value ${e} is suppoed to be in range [0 - 1].`)}async function R_(r,e){let t=b(r,"img","toPixels");if(!(r instanceof de)){let l=t;t=ee(l,"int32"),l.dispose()}k0(t);let[o,n]=t.shape.slice(0,2),s=t.rank===2?1:t.shape[2],i=await t.data(),a=t.dtype==="float32"?255:1,u=new Uint8ClampedArray(n*o*4);for(let l=0;l<o*n;++l){let c=[0,0,0,255];for(let m=0;m<s;m++){let f=i[l*s+m];if(t.dtype==="float32"){if(f<0||f>1)throw new Error(`Tensor values for a float32 Tensor must be in the range [0 - 1] but encountered ${f}.`)}else if(t.dtype==="int32"&&(f<0||f>255))throw new Error(`Tensor values for a int32 Tensor must be in the range [0 - 255] but encountered ${f}.`);s===1?(c[0]=f*a,c[1]=f*a,c[2]=f*a):c[m]=f*a}let p=l*4;u[p+0]=Math.round(c[0]),u[p+1]=Math.round(c[1]),u[p+2]=Math.round(c[2]),u[p+3]=Math.round(c[3])}if(e!=null){E0||Fn(Tm,S.backendName)!=null&&(console.warn("tf.browser.toPixels is not efficient to draw tensor on canvas. Please try tf.browser.draw instead."),E0=!0),e.width=n,e.height=o;let l=e.getContext("2d"),c=new ImageData(u,n,o);l.putImageData(c,0,0)}return t!==r&&t.dispose(),u}function A_(r,e,t){let o=b(r,"img","draw");if(!(r instanceof de)){let i=o;o=ee(i,"int32"),i.dispose()}k0(o),$_(t?.imageOptions);let n={image:o},s={canvas:e,options:t};S.runKernel(Tm,n,s)}var __=w({fromPixels_:I0});function D_(r,e){let t=r.shape.length,o=e.shape.length;if(t<1)throw new Error(`tf.gatherND() expects the input to be rank 1 or higher, but the rank was ${t}.`);if(o<1)throw new Error(`tf.gatherND() expects the indices to be rank 1 or higher, but the rank was ${o}.`);if(e.dtype!=="int32")throw new Error(`tf.gatherND() expects the indices to be int32 type, but the dtype was ${e.dtype}.`);if(e.shape[o-1]>t)throw new Error(`index innermost dimension length must be <= tensor rank; saw: ${e.shape[o-1]} vs. ${t}`);if(re(r.shape)===0)throw new Error(`Requested more than 0 entries, but input is empty. Input shape: ${r.shape}.`);let n=e.shape,s=n[n.length-1],i=1;for(let p=0;p<n.length-1;++p)i*=n[p];let a=r.shape,u=n.slice();u.pop();let l=1;for(let p=s;p<t;++p)l*=a[p],u.push(a[p]);let c=[...cr(r.shape).map(p=>p/l),1].slice(0,s);return[u,i,l,c]}var yt={};ye(yt,{assertParamsValid:()=>F_,computeFlatOffset:()=>V_,computeOutShape:()=>L_,getNormalizedAxes:()=>B_,isSliceContinous:()=>M_,maskToAxes:()=>P_,parseSliceParams:()=>U_,sliceInfo:()=>G_,startForAxis:()=>P0,startIndicesWithElidedDims:()=>D0,stopForAxis:()=>L0,stopIndicesWithElidedDims:()=>O0,stridesForAxis:()=>F0,stridesWithElidedDims:()=>R0});var bf=-2,O_=-1;function F_(r,e,t){let o=r.shape.length;C(o===e.length,()=>`Error in slice${o}D: Length of begin ${e} must match the rank of the array (${o}).`),C(o===t.length,()=>`Error in slice${o}D: Length of size ${t} must match the rank of the array (${o}).`);for(let n=0;n<o;++n)C(e[n]+t[n]<=r.shape[n],()=>`Error in slice${o}D: begin[${n}] + size[${n}] (${e[n]+t[n]}) would overflow input.shape[${n}] (${r.shape[n]})`)}function P_(r){let e=[],t=0;for(;r>0;)r&1&&e.push(t),r/=2,t++;return e}function L_(r,e,t){let o=[];for(let n=0;n<r.length;n++)o[n]=Math.ceil((e[n]-r[n])/t[n]);return o}function R0(r,e,t,o){let n=[...r];for(let s=n.length;s<o.length;s++)n.push(1);for(let s=0;s<t;s++)s===0?n[e]=1:(n.splice(e,0,1),n.pop());return n}function A0(r,e,t){return t<=r?t:t-(e-1)}function _0(r,e){let t=[];for(let o=0;o<r;o++)t.push(e+o);return t}function B_(r,e,t,o,n,s,i,a,u){let l=r.length,c=new Array(l),p=new Array(l),m=new Array(l);if(e.length&&t>0){let f=e[0],d=t+1;c=D0(i,f,d,o,r),p=O0(a,f,d,n,r),m=R0(s,f,d,r)}else for(let f=0;f<l;f++)c[f]=P0(i,o,s,r,f,u),p[f]=L0(a,n,s,r,f,u),m[f]=F0(s,f,u);return{begin:c,end:p,strides:m}}function D0(r,e,t,o,n){let s=[...n],i=_0(t,e);for(let a=0;a<s.length;a++)if(i.indexOf(a)>-1)s[a]=0;else{let u=A0(e,t,a),l=o[u];r&1<<u&&(l=0),s[a]=l}return s}function O0(r,e,t,o,n){let s=[...n],i=_0(t,e);for(let a=0;a<s.length;a++)if(i.indexOf(a)>-1)s[a]=Number.MAX_SAFE_INTEGER;else{let u=A0(e,t,a),l=o[u];r&1<<u&&(l=Number.MAX_SAFE_INTEGER),s[a]=l}for(let a=0;a<s.length;a++){let u=n[a];s[a]<0&&(s[a]+=u),s[a]=un(0,s[a],n[a])}return s}function F0(r,e,t){let o=r[e];return(t&1<<e||o==null)&&(o=1),o}function P0(r,e,t,o,n,s){let i=e[n],a=t[n]||1;(r&1<<n||s&1<<n||i==null)&&(a>0?i=Number.MIN_SAFE_INTEGER:i=Number.MAX_SAFE_INTEGER);let u=o[n];return i<0&&(i+=u),i=un(0,i,u-1),i}function L0(r,e,t,o,n,s){let i=e[n],a=t[n]||1;(r&1<<n||s&1<<n||i==null)&&(a>0?i=Number.MAX_SAFE_INTEGER:i=Number.MIN_SAFE_INTEGER);let u=o[n];return i<0&&(i+=u),a>0?i=un(0,i,u):i=un(-1,i,u-1),i}function M_(r,e,t){let o=t.length;for(let n=0;n<t.length;n++)if(t[n]>1){o=n;break}for(let n=o+1;n<t.length;n++)if(e[n]>0||t[n]!==r[n])return!1;return!0}function V_(r,e){let t=r.length>0?r[r.length-1]:1;for(let o=0;o<r.length-1;o++)t+=r[o]*e[o];return t}function U_(r,e,t){let o,n=r.shape.length;typeof e=="number"?o=[e,...new Array(n-1).fill(0)]:e.length<n?o=e.concat(new Array(n-e.length).fill(0)):o=e.slice(),o.forEach(i=>{C(i!==-1,()=>"slice() does not support negative begin indexing.")});let s;return t==null?s=new Array(n).fill(-1):typeof t=="number"?s=[t,...new Array(n-1).fill(-1)]:t.length<n?s=t.concat(new Array(n-t.length).fill(-1)):s=t,s=s.map((i,a)=>i>=0?i:(C(i===-1,()=>`Negative size values should be exactly -1 but got ${i} for the slice() size at index ${a}.`),r.shape[a]-o[a])),[o,s]}function G_(r,e,t,o,n,s,i,a,u){let l;if(o==null?(l=new Array(e.length),l.fill(1)):l=o,i!=null&&(i&i-1)!==0)throw new Error("Multiple ellipses in slice is not allowed.");let c=!1,p={dims:l.length,numAddAxisAfterEllipsis:0,begin:e.slice(),end:t.slice(),strides:l.slice(),beginMask:n,endMask:s,ellipsisMask:i,newAxisMask:a,shrinkAxisMask:u};for(let N=0;N<p.dims;N++)c&&(1<<N&a)!==0&&p.numAddAxisAfterEllipsis++,1<<N&i&&(c=!0);c||(p.ellipsisMask|=1<<p.dims,p.dims++);let m={dims:r.length,beginMask:0,endMask:0,beginValid:!1,endValid:!1};z_(p,m);let f=!0,d=!0,g=!0,h=[],x=[];for(let N=0;N<r.length;++N){if(m.strides[N]===0)throw Error(`strides[${N}] must be non-zero`);let E=!!(m.shrinkAxisMask&1<<N),k=r[N];if(k===-1){h.push(E?1:-1);continue}let R=[m.beginMask&1<<N,m.endMask&1<<N],A=[m.strides[N]>0?0:-1,m.strides[N]>0?k:k-1];if(E&&m.strides[N]<=0)throw Error("only stride 1 allowed on non-range indexing.");g=g&&m.strides[N]===1;let _=!!(m.beginMask&1<<N&&m.endMask&1<<N);if(m.beginValid&&m.endValid){if(E){let M=m.begin[N]<0?k+m.begin[N]:m.begin[N];if(m.begin[N]=M,m.end[N]=m.begin[N]+1,M<0||M>=k)throw Error(`slice index ${m.begin[N]} of dimension ${N} out of bounds.`)}else m.begin[N]=$0(m.begin[N],0,m.strides[N],k,R,A),m.end[N]=$0(m.end[N],1,m.strides[N],k,R,A);let B=m.strides[N]===1&&m.begin[N]===0&&m.end[N]===k;f=f&&B,d=d&&(N===0&&m.strides[N]===1||B)}else f=f&&m.strides[N]===1&&_,d=d&&(N===0&&m.strides[N]===1||_);let O,F=!1;if(m.beginValid&&m.endValid?(O=m.end[N]-m.begin[N],F=!0):E?(O=1,F=!0):_&&k>=0&&(m.strides[N]<0?O=-k:O=k,F=!0),F){let B;O===0||O<0!=m.strides[N]<0?B=0:B=Math.trunc(O/m.strides[N])+(O%m.strides[N]!==0?1:0),h.push(B)}else h.push(-1)}for(let N=0;N<m.finalShapeGatherIndices.length;++N){let E=m.finalShapeGatherIndices[N];E>=0?x.push(h[E]):E===bf&&x.push(1)}return{finalShapeSparse:x.filter((N,E)=>m.finalShapeGatherIndices[E]!==bf),finalShape:x,isIdentity:f,sliceDim0:d,isSimpleSlice:g,begin:m.begin,end:m.end,strides:m.strides}}function z_(r,e){e.beginMask=0,e.endMask=0,e.shrinkAxisMask=0;let t=0;e.beginValid=r.begin!=null,e.endValid=r.end!=null,e.begin=new Array(e.dims),e.end=new Array(e.dims),e.strides=new Array(e.dims),e.finalShapeGatherIndices=[],e.finalShapeGatherIndicesSparse=[],e.inputShapeGatherIndicesSparse=new Array(e.dims);for(let o=0;o<r.dims;o++)if(1<<o&r.ellipsisMask){let n=Math.min(e.dims-(r.dims-o)+1+r.numAddAxisAfterEllipsis,e.dims);for(;t<n;t++)e.begin[t]=0,e.end[t]=0,e.strides[t]=1,e.beginMask|=1<<t,e.endMask|=1<<t,e.finalShapeGatherIndices.push(t),e.finalShapeGatherIndicesSparse.push(-1),e.inputShapeGatherIndicesSparse[t]=o}else if(1<<o&r.newAxisMask)e.finalShapeGatherIndices.push(bf),e.finalShapeGatherIndicesSparse.push(-1);else{if(t===e.begin.length)throw Error(`Index out of range using input dim ${t}; input has only ${e.dims} dims, ${e.begin.length}.`);r.begin!=null&&(e.begin[t]=r.begin[o]),r.end!=null&&(e.end[t]=r.end[o]),e.strides[t]=r.strides[o],r.beginMask&1<<o&&(e.beginMask|=1<<t),r.endMask&1<<o&&(e.endMask|=1<<t),r.shrinkAxisMask&1<<o?(e.finalShapeGatherIndices.push(O_),e.finalShapeGatherIndicesSparse.push(-1),e.shrinkAxisMask|=1<<t):(e.finalShapeGatherIndices.push(t),e.finalShapeGatherIndicesSparse.push(o)),e.inputShapeGatherIndicesSparse[t]=o,t++}}function $0(r,e,t,o,n,s){if(n[e])return t>0?s[e]:s[e+1&1];{let i=r<0?o+r:r;return i<s[0]?s[0]:i>s[1]?s[1]:i}}var W_=typeof requestAnimationFrame<"u"?requestAnimationFrame:typeof setImmediate<"u"?setImmediate:r=>r();function wf(){return new Promise(r=>W_(()=>r()))}var I={};ye(I,{ERF_A1:()=>aD,ERF_A2:()=>uD,ERF_A3:()=>lD,ERF_A4:()=>cD,ERF_A5:()=>pD,ERF_P:()=>iD,PARALLELIZE_THRESHOLD:()=>Ql,RowPartitionType:()=>br,SELU_SCALE:()=>sD,SELU_SCALEALPHA:()=>nD,applyActivation:()=>Wo,assertAndGetBroadcastShape:()=>ae,assertAxesAreInnerMostDims:()=>$k,assertParamsConsistent:()=>H_,assignToTypedArray:()=>xD,axesAreInnerMostDims:()=>ef,calculateShapes:()=>BR,checkEinsumDimSizes:()=>SD,checkPadOnDimRoundingMode:()=>Fe,combineLocations:()=>Px,combineRaggedTensorToTensorShapes:()=>q_,complexWithEvenIndex:()=>dD,complexWithOddIndex:()=>hD,computeConv2DInfo:()=>Oo,computeConv3DInfo:()=>ex,computeDefaultPad:()=>Jm,computeDilation2DInfo:()=>I2,computeOptimalWindowSize:()=>Q_,computeOutAndReduceShapes:()=>kk,computeOutShape:()=>K_,computePool2DInfo:()=>Zm,computePool3DInfo:()=>k2,convertConv2DDataFormat:()=>tx,decodeEinsumEquation:()=>vD,eitherStridesOrDilationsAreOne:()=>Ze,expandShapeToKeepDim:()=>Ar,exponent:()=>bD,exponents:()=>yD,fromStringArrayToUint8:()=>WD,fromUint8ToStringArray:()=>zD,getAxesPermutation:()=>Rk,getBroadcastDims:()=>$x,getComplexWithIndex:()=>gD,getEinsumComputePath:()=>CD,getEinsumPermutation:()=>TD,getFusedBiasGradient:()=>zo,getFusedDyActivation:()=>Go,getImageCenter:()=>Z_,getInnerMostAxes:()=>_k,getPermuted:()=>eD,getRaggedRank:()=>j_,getReductionAxes:()=>Ju,getReshaped:()=>J_,getReshapedPermuted:()=>tD,getRowPartitionTypesHelper:()=>X_,getSliceBeginCoords:()=>rD,getSliceSize:()=>oD,getSparseFillEmptyRowsIndicesDenseShapeMismatch:()=>kD,getSparseFillEmptyRowsNegativeIndexErrorMessage:()=>$D,getSparseFillEmptyRowsOutOfRangeIndexErrorMessage:()=>RD,getSparseReshapeEmptyTensorZeroOutputDimErrorMessage:()=>DD,getSparseReshapeInputOutputMismatchErrorMessage:()=>FD,getSparseReshapeInputOutputMultipleErrorMessage:()=>OD,getSparseReshapeMultipleNegativeOneOutputDimErrorMessage:()=>AD,getSparseReshapeNegativeOutputDimErrorMessage:()=>_D,getSparseSegmentReductionIndicesOutOfRangeErrorMessage:()=>MD,getSparseSegmentReductionNegativeSegmentIdsErrorMessage:()=>PD,getSparseSegmentReductionNonIncreasingSegmentIdsErrorMessage:()=>LD,getSparseSegmentReductionSegmentIdOutOfRangeErrorMessage:()=>BD,getUndoAxesPermutation:()=>Ak,isIdentityPermutation:()=>ND,log:()=>wI,mergeRealAndImagArrays:()=>mD,prepareAndValidate:()=>D_,prepareSplitSize:()=>ID,segment_util:()=>Tf,shouldFuse:()=>Ho,slice_util:()=>yt,splitRealAndImagArrays:()=>fD,stridesOrDilationsArePositive:()=>dr,tupleValuesAreOne:()=>Do,upcastType:()=>Qe,validateDefaultValueShape:()=>Y_,validateInput:()=>Xs,validateUpdateShape:()=>fb,warn:()=>Er});function H_(r,e){let t=r[0].length;r.forEach((n,s)=>{C(n.length===t,()=>`Error in concat${t}D: rank of tensors[${s}] must be the same as the rank of the rest (${t})`)}),C(e>=0&&e<t,()=>`Error in concat${t}D: axis must be between 0 and ${t-1}.`);let o=r[0];r.forEach((n,s)=>{for(let i=0;i<t;i++)C(i===e||n[i]===o[i],()=>`Error in concat${t}D: Shape of tensors[${s}] (${n}) does not match the shape of the rest (${o}) along the non-concatenated axis ${s}.`)})}function K_(r,e){let t=r[0].slice();for(let o=1;o<r.length;o++)t[e]+=r[o][e];return t}var br;(function(r){r[r.FIRST_DIM_SIZE=0]="FIRST_DIM_SIZE",r[r.VALUE_ROWIDS=1]="VALUE_ROWIDS",r[r.ROW_LENGTHS=2]="ROW_LENGTHS",r[r.ROW_SPLITS=3]="ROW_SPLITS",r[r.ROW_LIMITS=4]="ROW_LIMITS",r[r.ROW_STARTS=5]="ROW_STARTS"})(br||(br={}));function q_(r,e,t){let o=new Array;if(t==null&&e==null)return o;if(e==null)for(;o.length<r+t.length;)o.push(-1);else o=e.slice();if(t==null)return o;if(r+t.length!==o.length)throw new Error(`rt input.shape and shape=${e} are incompatible: rt input.rank = ${r+t.length}, but shape.rank = ${o.length}`);for(let n=1;n<t.length;++n){let s=t[n],i=o[o.length-t.length+n],a=o[i];if(s>=0)if(a>=0){if(a!==s)throw new Error(`rt input.shape and shape=${e} are incompatible: rt input.shape[${n+r}] = ${s} but shape[${n+r}] = ${a}`)}else o[i]=s}return o}function X_(r){let e={FIRST_DIM_SIZE:br.FIRST_DIM_SIZE,VALUE_ROWIDS:br.VALUE_ROWIDS,ROW_LENGTHS:br.ROW_LENGTHS,ROW_SPLITS:br.ROW_SPLITS,ROW_LIMITS:br.ROW_LIMITS,ROW_STARTS:br.ROW_STARTS},t=[];for(let o of r)if(o in e)t.push(e[o]);else break;return t}function j_(r){return r.length===0?0:r[0]===br.FIRST_DIM_SIZE?r.length-1:r.length}function Y_(r,e){if(r==null||e==null)return;let t=r.length,o=e.length;if(t>=o)throw new Error(`defaultValue.shape=${r} and ragged tensor flatValues.shape=${e}, are incompatible: defaultValue.rank = ${t} must be less than ragged tensor input flatValues.rank = ${o})`);for(let n=0;n<Math.min(t,o-1);++n){let s=r[n],i=e[n+1];if(s>=0&&i>=0&&s!==1&&s!==i)throw new Error(`defaultValue.shape=${r}, and ragged tensor input flatValues.shape=${e} are incompatible: defaultValue.shape[${n-r.length}] = ${s} but ragged tensor input.flatValues.shape[${n-r.length}] = ${i}`)}}var Ql=30;function Q_(r){return r<=Ql?r:mn(r,Math.floor(Math.sqrt(r)))}function Z_(r,e,t){let o=t*(typeof r=="number"?r:r[0]),n=e*(typeof r=="number"?r:r[1]);return[o,n]}function J_(r,e,t,o=!0){let n=[];if(o)n=n.concat(e.slice(0)),n.push(r[0]/t),n=n.concat(r.slice(1));else{n=n.concat(r[0]);let s=e.length;for(let i=0;i<s;++i)n=n.concat([r[i+1]/e[i],e[i]]);n=n.concat(r.slice(s+1))}return n}function eD(r,e,t=!0){let o=[];if(t){o.push(e);for(let n=e+1;n<r;++n)n<=2*e?(o.push(n),o.push(n-(e+1))):o.push(n)}else{let n=[],s=[];for(let i=1;i<r;++i)i>=e*2+1||i%2===1?s.push(i):n.push(i);o.push(...n),o.push(0),o.push(...s)}return o}function tD(r,e,t,o=!0){let n=[];o?n.push(r[0]/t):n.push(r[0]*t);for(let s=1;s<r.length;++s)s<=e.length?o?n.push(e[s-1]*r[s]):n.push(r[s]/e[s-1]):n.push(r[s]);return n}function rD(r,e){let t=[0];for(let o=0;o<e;++o)t.push(r[o][0]);return t}function oD(r,e,t){let o=r.slice(0,1);for(let n=0;n<t;++n)o.push(r[n+1]-e[n][0]-e[n][1]);return o}var nD=1.7580993408473768,sD=1.0507009873554805;var iD=.3275911,aD=.254829592,uD=-.284496736,lD=1.421413741,cD=-1.453152027,pD=1.061405429;function mD(r,e){if(r.length!==e.length)throw new Error(`Cannot merge real and imag arrays of different lengths. real:${r.length}, imag: ${e.length}.`);let t=new Float32Array(r.length*2);for(let o=0;o<t.length;o+=2)t[o]=r[o/2],t[o+1]=e[o/2];return t}function fD(r){let e=new Float32Array(r.length/2),t=new Float32Array(r.length/2);for(let o=0;o<r.length;o+=2)e[o/2]=r[o],t[o/2]=r[o+1];return{real:e,imag:t}}function dD(r){let e=Math.ceil(r.length/4),t=new Float32Array(e),o=new Float32Array(e);for(let n=0;n<r.length;n+=4)t[Math.floor(n/4)]=r[n],o[Math.floor(n/4)]=r[n+1];return{real:t,imag:o}}function hD(r){let e=Math.floor(r.length/4),t=new Float32Array(e),o=new Float32Array(e);for(let n=2;n<r.length;n+=4)t[Math.floor(n/4)]=r[n],o[Math.floor(n/4)]=r[n+1];return{real:t,imag:o}}function gD(r,e){let t=r[e*2],o=r[e*2+1];return{real:t,imag:o}}function xD(r,e,t,o){r[o*2]=e,r[o*2+1]=t}function yD(r,e){let t=new Float32Array(r/2),o=new Float32Array(r/2);for(let n=0;n<Math.ceil(r/2);n++){let s=(e?2:-2)*Math.PI*(n/r);t[n]=Math.cos(s),o[n]=Math.sin(s)}return{real:t,imag:o}}function bD(r,e,t){let o=(t?2:-2)*Math.PI*(r/e),n=Math.cos(o),s=Math.sin(o);return{real:n,imag:s}}var vf="->",wD=/->/g,B0=",",M0="...";function vD(r,e){r=r.replace(/\s/g,"");let t=(r.length-r.replace(wD,"").length)/vf.length;if(t<1)throw new Error("Equations without an arrow are not supported.");if(t>1)throw new Error(`Equation must contain exactly one arrow ("${vf}").`);let[o,n]=r.split(vf);C(o.indexOf(M0)===-1,()=>`The ellipsis notation ("${M0}") is not supported yet.`);let s=o.split(B0),i=s.length;if(e!==i)throw new Error(`Expected ${i} input tensors, received ${e}`);if(i>2)throw new Error("Support for more than 2 input tensors is not implemented yet.");let a=[];for(let m=0;m<n.length;++m){let f=n[m];if(!s.some(d=>d.indexOf(f)!==-1))throw new Error(`Output subscripts contain the label ${f} not present in the input subscripts.`);a.indexOf(f)===-1&&a.push(f)}for(let m=0;m<o.length;++m){let f=o[m];a.indexOf(f)===-1&&f!==B0&&a.push(f)}let u=new Array(s.length);for(let m=0;m<i;++m){if(new Set(s[m].split("")).size!==s[m].length)throw new Error(`Found duplicate axes in input component ${s[m]}. Support for duplicate axes in input is not implemented yet.`);u[m]=[];for(let f=0;f<s[m].length;++f)u[m].push(a.indexOf(s[m][f]))}let l=a.length,c=n.length,p=[];for(let m=c;m<l;++m)p.push(m);return{allDims:a,summedDims:p,idDims:u}}function TD(r,e){let t=new Array(r);t.fill(-1);for(let n=0;n<e.length;++n)t[e[n]]=n;let o=[];for(let n=0;n<r;++n)t[n]===-1&&o.push(n);return t=t.filter(n=>n!==-1),{permutationIndices:t,expandDims:o}}function SD(r,e,t){let o=new Array(r);for(let n=0;n<t.length;++n){let s=t[n].shape;for(let i=0;i<e[n].length;++i)o[e[n][i]]===void 0?o[e[n][i]]=s[i]:C(o[e[n][i]]===s[i],()=>`Expected dimension ${o[e[n][i]]} at axis ${i} of input shaped ${JSON.stringify(s)}, but got dimension ${s[i]}`)}}function CD(r,e){let t=r,o=[],n=0;r.length===0&&t.push(-1),n=r.length+1;for(let i=0;i<n;++i)o.push([]);let s=[];for(let i=0;i<t.length;++i){let a=t[i],u=ED(e,a);for(let l of u)s.indexOf(l)===-1&&(o[i].push(l),s.push(l))}return{path:t,steps:o}}function ND(r){return r.every((e,t)=>e===t)}function ED(r,e){let t=[];for(let o=0;o<r.length;++o)(r[o].length===0||r[o].indexOf(e)!==-1||e===-1)&&t.push(o);return t}function ID(r,e,t=0){let o=[];if(typeof e=="number")C(r.shape[t]%e===0,()=>"Number of splits must evenly divide the axis."),o=new Array(e).fill(r.shape[t]/e);else{let n=e.reduce((i,a)=>(a===-1&&(i+=1),i),0);C(n<=1,()=>"There should be only one negative value in split array.");let s=e.indexOf(-1);if(s!==-1){let i=e.reduce((a,u)=>u>0?a+u:a);e[s]=r.shape[t]-i}C(r.shape[t]===e.reduce((i,a)=>i+a),()=>"The sum of sizes must match the size of the axis dimension."),o=e}return o}function kD(r){return`Received SparseTensor with denseShape[0] = 0 but
  indices.shape[0] = ${r}`}function $D(r,e){return`indices(${r}, 0) is invalid: ${e} < 0`}function RD(r,e,t){return`indices(${r}, 0) is invalid: ${e} >= ${t}`}function AD(r,e){return`only one output dimension may be -1, not both ${r} and ${e}`}function _D(r,e){return`size ${r} must be non-negative, not ${e}`}function DD(){return"reshape cannot infer the missing input size for an empty tensor unless all specified input sizes are non-zero"}function OD(r,e){let t=re(r),o=re(e);return`Input to reshape is a SparseTensor with ${t}
  dense values, but the requested shape requires a multiple of ${o}. inputShape=${r} outputShape= ${e}`}function FD(r,e){let t=re(r),o=re(e);return`Input to reshape is a tensor with ${t} dense values, but the requested shape has ${o}. inputShape=${r} outputShape=${e}`}function PD(){return"segment ids must be >= 0"}function LD(){return"segment ids are not increasing"}function BD(r,e){return`Segment id ${r} out of range [0, ${e}), possibly because segmentIds input is not sorted.`}function MD(r,e,t){return`Bad: indices[${r}] == ${e} out of range [0, ${t})`}var Tf={};ye(Tf,{collectGatherOpShapeInfo:()=>GD,computeOutShape:()=>UD,segOpComputeOptimalWindowSize:()=>VD});function VD(r,e){let t=!1,o;for(r<=Ql?(o=r,t=!0):o=mn(r,Math.floor(Math.sqrt(r)));!t;)o>e||o===r?t=!0:o=mn(r,o+1);return o}function UD(r,e,t){let o=[],n=r.length;for(let s=0;s<n;s++)s!==e?o.push(r[s]):o.push(t);return o}function GD(r,e,t,o){let n=e.shape.length,s=r.shape.length;if(o!==0&&(o<-n||o>n))throw new Error(`Expect batchDims in the range of [-${n}, ${n}], but got ${o}`);if(o<0&&(o+=n),o>s)throw new Error(`batchDims (${o}) must be less than rank(x) (
    ${s}).`);if(t<o)throw new Error(`batchDims (${o}) must be less than or equal to axis (${t}).`);for(let p=0;p<o;++p)if(r.shape[p]!==e.shape[p])throw new Error(`x.shape[${p}]: ${r.shape[p]} should be equal to indices.shape[${p}]: ${e.shape[p]}.`);let i=r.shape[t],a=[],u=1,l=1,c=1;for(let p=0;p<o;++p)a.push(r.shape[p]),u*=r.shape[p];for(let p=o;p<t;p++)a.push(r.shape[p]),l*=r.shape[p];for(let p=o;p<n;p++)a.push(e.shape[p]);for(let p=t+1;p<s;p++)a.push(r.shape[p]),c*=r.shape[p];return{batchSize:u,sliceSize:c,outerSize:l,dimSize:i,outputShape:a}}function zD(r){try{return r.map(e=>Vn(e))}catch(e){throw new Error(`Failed to decode encoded string bytes into utf-8, error: ${e}`)}}function WD(r){return r.map(e=>Mn(e))}var wr={};ye(wr,{nonMaxSuppressionV3Impl:()=>Bl,nonMaxSuppressionV4Impl:()=>Ml,nonMaxSuppressionV5Impl:()=>Vl,whereImpl:()=>Dl});g0();var HD=$();HD.registerFlag("KEEP_INTERMEDIATE_TENSORS",()=>!1,r=>{r&&console.warn("Keep intermediate tensors is ON. This will print the values of all intermediate tensors during model inference. Not all models support this mode. For details, check e2e/benchmarks/ model_config.js. This significantly impacts performance.")});var bt;(function(r){r[r.DT_INVALID=0]="DT_INVALID",r[r.DT_FLOAT=1]="DT_FLOAT",r[r.DT_DOUBLE=2]="DT_DOUBLE",r[r.DT_INT32=3]="DT_INT32",r[r.DT_UINT8=4]="DT_UINT8",r[r.DT_INT16=5]="DT_INT16",r[r.DT_INT8=6]="DT_INT8",r[r.DT_STRING=7]="DT_STRING",r[r.DT_COMPLEX64=8]="DT_COMPLEX64",r[r.DT_INT64=9]="DT_INT64",r[r.DT_BOOL=10]="DT_BOOL",r[r.DT_QINT8=11]="DT_QINT8",r[r.DT_QUINT8=12]="DT_QUINT8",r[r.DT_QINT32=13]="DT_QINT32",r[r.DT_BFLOAT16=14]="DT_BFLOAT16",r[r.DT_QINT16=15]="DT_QINT16",r[r.DT_QUINT16=16]="DT_QUINT16",r[r.DT_UINT16=17]="DT_UINT16",r[r.DT_COMPLEX128=18]="DT_COMPLEX128",r[r.DT_HALF=19]="DT_HALF",r[r.DT_RESOURCE=20]="DT_RESOURCE",r[r.DT_VARIANT=21]="DT_VARIANT",r[r.DT_UINT32=22]="DT_UINT32",r[r.DT_UINT64=23]="DT_UINT64",r[r.DT_FLOAT_REF=101]="DT_FLOAT_REF",r[r.DT_DOUBLE_REF=102]="DT_DOUBLE_REF",r[r.DT_INT32_REF=103]="DT_INT32_REF",r[r.DT_UINT8_REF=104]="DT_UINT8_REF",r[r.DT_INT16_REF=105]="DT_INT16_REF",r[r.DT_INT8_REF=106]="DT_INT8_REF",r[r.DT_STRING_REF=107]="DT_STRING_REF",r[r.DT_COMPLEX64_REF=108]="DT_COMPLEX64_REF",r[r.DT_INT64_REF=109]="DT_INT64_REF",r[r.DT_BOOL_REF=110]="DT_BOOL_REF",r[r.DT_QINT8_REF=111]="DT_QINT8_REF",r[r.DT_QUINT8_REF=112]="DT_QUINT8_REF",r[r.DT_QINT32_REF=113]="DT_QINT32_REF",r[r.DT_BFLOAT16_REF=114]="DT_BFLOAT16_REF",r[r.DT_QINT16_REF=115]="DT_QINT16_REF",r[r.DT_QUINT16_REF=116]="DT_QUINT16_REF",r[r.DT_UINT16_REF=117]="DT_UINT16_REF",r[r.DT_COMPLEX128_REF=118]="DT_COMPLEX128_REF",r[r.DT_HALF_REF=119]="DT_HALF_REF",r[r.DT_RESOURCE_REF=120]="DT_RESOURCE_REF",r[r.DT_VARIANT_REF=121]="DT_VARIANT_REF",r[r.DT_UINT32_REF=122]="DT_UINT32_REF",r[r.DT_UINT64_REF=123]="DT_UINT64_REF"})(bt||(bt={}));var V0;(function(r){let e;(function(t){t[t.LEGACY=0]="LEGACY",t[t.V1=1]="V1",t[t.V2=2]="V2"})(e=r.CheckpointFormatVersion||(r.CheckpointFormatVersion={}))})(V0||(V0={}));var qD={};function Zl(r){return qD[r]}function y(r,e,t,o,n){let s=e.inputParams[r];if(s&&s.inputIndexStart!==void 0){let a=s.inputIndexStart,u=s.inputIndexEnd===0?void 0:s.inputIndexEnd===void 0?a+1:s.inputIndexEnd,l=a<0?e.inputNames.length+a:a;if(s.type==="tensor")return Pe(e.inputNames[l],t,o,n);if(s.type==="tensors"){let m=e.inputs.slice(a,u);return e.inputNames.slice(a,u).filter((d,g)=>{var h;return((h=m[g])===null||h===void 0?void 0:h.op)!=="NoOp"}).map(d=>Pe(d,t,o,n))}let c=Pe(e.inputNames[l],t,o,n),p=c.dataSync();return s.type==="number"?p[0]:T.toNestedArray(c.shape,p)}let i=e.attrParams[r];return i&&i.value}function Pe(r,e,t,o){let[n,s]=it(r,t);if(o!=null){let a=o.getHashTableHandleByName(n);if(a!=null)return a}let i=t.currentContextIds.find(a=>!!e[Jl(n,a)]);return i!==void 0?e[Jl(n,i)][s]:void 0}function Cf(r,e,t){return e[Jl(r,t.currentContextId)]}function or(r,e){let[t,o,n]=it(r,e);return[Jl(t,e&&e.currentContextId),o,n]}function Jl(r,e){return e?`${r}-${e}`:r}function it(r,e){if(r==="")return["",0,void 0];let t=e!=null&&e.parseNodeNameCache!=null;if(t){let s=e.parseNodeNameCache.get(r);if(s!=null)return s}let o=r.split(":"),n;if(o.length===1)n=[r,0,void 0];else{let s=o[0],i=o.length===3?o[1]:void 0,a=Number(o[o.length-1]);n=[s,a,i]}return t&&e.parseNodeNameCache.set(r,n),n}function Js(r,e,t){let o=y("pad",r,e,t);if(o==="explicit"){o=y("explicitPaddings",r,e,t);let n=[[0,0],[0,0],[0,0],[0,0]];for(let s=0;s<4;s++)n[s][0]=o[s*2],n[s][1]=o[s*2+1];return n}return o}function nr(r){return r.kept?r:$t(r)}var Nf={};ye(Nf,{json:()=>XD});var XD=[{tfOpName:"Add",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"AddV2",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"AddN",category:"arithmetic",inputs:[{start:0,end:0,name:"tensors",type:"tensors"}]},{tfOpName:"BiasAdd",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0}]},{tfOpName:"Sub",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"RealDiv",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Div",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"DivNoNan",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"FloorDiv",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Mul",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Maximum",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Minimum",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Pow",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"SquaredDifference",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Mod",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"FloorMod",category:"arithmetic",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]}];var Ef={};ye(Ef,{json:()=>jD});var jD=[{tfOpName:"Abs",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Acos",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Asin",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Atan",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Atan2",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"y",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Ceil",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"ClipByValue",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"clipValueMin",type:"number"},{start:2,name:"clipValueMax",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Complex",category:"basic_math",inputs:[{start:0,name:"real",type:"tensor"},{start:1,name:"imag",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"ComplexAbs",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Cos",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Cosh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Elu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Exp",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Floor",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Log",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Imag",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"Tout",name:"outputType",type:"dtype",notSupported:!0}]},{tfOpName:"Neg",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Real",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"Tout",name:"outputType",type:"dtype",notSupported:!0}]},{tfOpName:"Prelu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"alpha",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Relu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Relu6",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Selu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sigmoid",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sin",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sinh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sqrt",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Rsqrt",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Square",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Tan",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Tanh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Sign",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Round",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Expm1",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Log1p",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Reciprocal",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Softplus",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Asinh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Acosh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Atanh",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Erf",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LeakyRelu",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"alpha",name:"alpha",type:"number",defaultValue:.2},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"IsNan",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"IsFinite",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"IsInf",category:"basic_math",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]}];var If={};ye(If,{json:()=>YD});var YD=[{tfOpName:"EmptyTensorList",category:"control",inputs:[{start:0,name:"elementShape",type:"shape"},{start:1,name:"maxNumElements",type:"number"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"LoopCond",category:"control",inputs:[{start:0,name:"pred",type:"tensor"}]},{tfOpName:"Switch",category:"control",inputs:[{start:0,name:"data",type:"tensor"},{start:1,name:"pred",type:"tensor"}]},{tfOpName:"Merge",category:"control",inputs:[{start:0,end:0,name:"tensors",type:"tensors"}]},{tfOpName:"Enter",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"frame_name",name:"frameName",type:"string"},{tfName:"is_constant",name:"isConstant",type:"bool"}]},{tfOpName:"Exit",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"NextIteration",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"TensorArrayV3",category:"control",inputs:[{start:0,name:"size",type:"number"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"element_shape",name:"elementShape",type:"shape"},{tfName:"dynamic_size",name:"dynamicSize",type:"bool"},{tfName:"clear_after_read",name:"clearAfterRead",type:"bool"},{tfName:"identical_element_shapes",name:"identicalElementShapes",type:"bool"},{tfName:"tensor_array_name",name:"name",type:"string"}]},{tfOpName:"TensorArrayWriteV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"index",type:"number"},{start:2,name:"tensor",type:"tensor"},{start:3,name:"flowIn",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"TensorArrayReadV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"index",type:"number"},{start:2,name:"flowIn",type:"number"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"TensorArrayGatherV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"flowIn",type:"number"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"element_shape",name:"elementShape",type:"shape"}]},{tfOpName:"TensorArrayScatterV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"tensor",type:"tensor"},{start:3,name:"flowIn",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"TensorArrayConcatV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"flowIn",type:"number"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"element_shape_except0",name:"elementShapeExcept0",type:"shape",notSupported:!0}]},{tfOpName:"TensorArraySplitV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"tensor",type:"tensor"},{start:2,name:"lengths",type:"number[]"},{start:3,name:"flowIn",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"TensorArraySizeV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"},{start:1,name:"flowIn",type:"number"}]},{tfOpName:"TensorArrayCloseV3",category:"control",inputs:[{start:0,name:"tensorArrayId",type:"tensor"}]},{tfOpName:"StatelessIf",category:"control",inputs:[{start:0,name:"cond",type:"tensor"},{start:1,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"then_branch",name:"thenBranch",type:"func"},{tfName:"else_branch",name:"elseBranch",type:"func"}]},{tfOpName:"If",category:"control",inputs:[{start:0,name:"cond",type:"tensor"},{start:1,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"then_branch",name:"thenBranch",type:"func"},{tfName:"else_branch",name:"elseBranch",type:"func"}]},{tfOpName:"StatelessWhile",category:"control",inputs:[{start:0,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"cond",name:"cond",type:"func"},{tfName:"body",name:"body",type:"func"}]},{tfOpName:"While",category:"control",inputs:[{start:0,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"cond",name:"cond",type:"func"},{tfName:"body",name:"body",type:"func"}]},{tfOpName:"TensorListScatter",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListScatterV2",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"elementShape",type:"shape"},{start:3,name:"numElements",type:"number"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListGather",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"indices",type:"number[]"},{start:2,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListGetItem",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"index",type:"number"},{start:2,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListSetItem",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"index",type:"number"},{start:2,name:"tensor",type:"tensor"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListReserve",category:"control",inputs:[{start:0,name:"elementShape",type:"shape"},{start:1,name:"numElements",type:"number"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListFromTensor",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"},{start:1,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListStack",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"},{tfName:"num_elements",name:"numElements",type:"dtype"}]},{tfOpName:"TensorListSplit",category:"control",inputs:[{start:0,name:"tensor",type:"tensor"},{start:1,name:"elementShape",type:"shape"},{start:2,name:"lengths",type:"number[]"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListConcat",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"}],attrs:[{tfName:"element_shape",name:"elementShape",type:"shape"},{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListConcatV2",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"}],attrs:[{tfName:"element_shape",name:"elementShape",type:"shape"},{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListPopBack",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"elementShape",type:"shape"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListPushBack",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"tensor",type:"tensor"}],attrs:[{tfName:"element_dtype",name:"elementDType",type:"dtype"}]},{tfOpName:"TensorListLength",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"}]},{tfOpName:"TensorListResize",category:"control",inputs:[{start:0,name:"tensorListId",type:"tensor"},{start:1,name:"size",type:"number"}]}];var kf={};ye(kf,{json:()=>QD});var QD=[{tfOpName:"AvgPool",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"MaxPool",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[],notSupported:!0},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"MaxPoolWithArgmax",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"include_batch_in_index",name:"includeBatchInIndex",type:"bool"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"AvgPool3D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"MaxPool3D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"ksize",name:"kernelSize",type:"number[]"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Conv1D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"stride",name:"stride",type:"number"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NWC"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"dilation",name:"dilation",type:"number",defaultValue:1}]},{tfOpName:"Conv2D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"useCudnnOnGpu",name:"useCudnnOnGpu",type:"bool"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"dilations",name:"dilations",type:"number[]"}]},{tfOpName:"_FusedConv2D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"},{start:2,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"num_args",name:"numArgs",type:"number"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"use_cudnn_on_gpu",name:"useCudnnOnGpu",type:"bool",defaultValue:!0},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"dilations",name:"dilations",type:"number[]",defaultValue:[1,1,1,1]},{tfName:"fused_ops",name:"fusedOps",type:"string[]",defaultValue:[]},{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:1e-4},{tfName:"leakyrelu_alpha",name:"leakyreluAlpha",type:"number",defaultValue:.2}]},{tfOpName:"Conv2DBackpropInput",category:"convolution",inputs:[{start:2,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"},{start:0,name:"outputShape",type:"number[]"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"dilations",name:"dilations",type:"number[]",notSupported:!0}]},{tfOpName:"DepthwiseConv2d",category:"convolution",inputs:[{start:0,name:"input",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"dilations",name:"dilations",type:"number[]"}]},{tfOpName:"DepthwiseConv2dNative",category:"convolution",inputs:[{start:0,name:"input",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]},{tfName:"dilations",name:"dilations",type:"number[]"}]},{tfOpName:"FusedDepthwiseConv2dNative",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"},{start:2,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"num_args",name:"numArgs",type:"number"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"dilations",name:"dilations",type:"number[]",defaultValue:[1,1,1,1]},{tfName:"fused_ops",name:"fusedOps",type:"string[]",defaultValue:[]},{tfName:"explicit_paddings",name:"explicitPaddings",type:"number[]",defaultValue:[]}]},{tfOpName:"Conv3D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"padding",name:"pad",type:"string"},{tfName:"data_format",name:"dataFormat",type:"string",defaultValue:"NHWC"},{tfName:"dilations",name:"dilations",type:"number[]"}]},{tfOpName:"Dilation2D",category:"convolution",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"filter",type:"tensor"}],attrs:[{tfName:"strides",name:"strides",type:"number[]"},{tfName:"rates",name:"dilations",type:"number[]"},{tfName:"padding",name:"pad",type:"string"}]}];var $f={};ye($f,{json:()=>ZD});var ZD=[{tfOpName:"Fill",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"},{start:1,name:"value",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"LinSpace",category:"creation",inputs:[{start:0,name:"start",type:"number"},{start:1,name:"stop",type:"number"},{start:2,name:"num",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"OneHot",category:"creation",inputs:[{start:0,name:"indices",type:"tensor"},{start:1,name:"depth",type:"number"},{start:2,name:"onValue",type:"number",defaultValue:1},{start:3,name:"offValue",type:"number",defaultValue:0}],attrs:[{tfName:"axis",name:"axis",type:"number",notSupported:!0},{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"Ones",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"OnesLike",category:"creation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"dtype",name:"dtype",type:"dtype"}]},{tfOpName:"RandomStandardNormal",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"seed",name:"seed",type:"number",defaultValue:0},{tfName:"seed2",name:"seed2",type:"number",defaultValue:0,notSupported:!0},{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"T",name:"T",type:"number",notSupported:!0}]},{tfOpName:"RandomUniform",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"minval",name:"minval",type:"number",defaultValue:0},{tfName:"maxval",name:"maxval",type:"number",defaultValue:1},{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"seed",name:"seed",type:"number",defaultValue:0},{tfName:"seed2",name:"seed2",type:"number",defaultValue:0,notSupported:!0},{tfName:"T",name:"T",type:"number",notSupported:!0}]},{tfOpName:"RandomUniformInt",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"minval",name:"minval",type:"number"},{tfName:"maxval",name:"maxval",type:"number"},{tfName:"seed",name:"seed",type:"number",defaultValue:0},{tfName:"seed2",name:"seed2",type:"number",defaultValue:0,notSupported:!0}]},{tfOpName:"Range",category:"creation",inputs:[{start:0,name:"start",type:"number"},{start:1,name:"stop",type:"number"},{start:2,name:"step",type:"number",defaultValue:0}],attrs:[{tfName:"Tidx",name:"dtype",type:"dtype"}]},{tfOpName:"TruncatedNormal",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"means",name:"mean",type:"number",defaultValue:0},{tfName:"stddev",name:"stdDev",type:"number",defaultValue:1},{tfName:"seed",name:"seed",type:"number"},{tfName:"seed2",name:"seed2",type:"number",defaultValue:0,notSupported:!0},{tfName:"dtype",name:"dtype",type:"dtype"},{tfName:"T",name:"T",type:"number",notSupported:!0}]},{tfOpName:"Zeros",category:"creation",inputs:[{start:0,name:"shape",type:"number[]"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"ZerosLike",category:"creation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"Multinomial",category:"creation",inputs:[{start:0,name:"logits",type:"tensor"},{start:1,name:"numSamples",type:"number"}],attrs:[{tfName:"seed",name:"seed",type:"number"},{tfName:"seed2",name:"seed2",type:"number"},{tfName:"T",name:"dtype",type:"dtype"},{tfName:"output_dtype",name:"output_dtype",type:"dtype"}]}];var Rf={};ye(Rf,{json:()=>JD});var JD=[{tfOpName:"NonMaxSuppressionV2",category:"dynamic",inputs:[{start:0,name:"boxes",type:"tensor"},{start:1,name:"scores",type:"tensor"},{start:2,name:"maxOutputSize",type:"number"},{start:3,name:"iouThreshold",type:"number"}]},{tfOpName:"NonMaxSuppressionV3",category:"dynamic",inputs:[{start:0,name:"boxes",type:"tensor"},{start:1,name:"scores",type:"tensor"},{start:2,name:"maxOutputSize",type:"number"},{start:3,name:"iouThreshold",type:"number"},{start:4,name:"scoreThreshold",type:"number"}]},{tfOpName:"NonMaxSuppressionV4",category:"dynamic",inputs:[{start:0,name:"boxes",type:"tensor"},{start:1,name:"scores",type:"tensor"},{start:2,name:"maxOutputSize",type:"number"},{start:3,name:"iouThreshold",type:"number"},{start:4,name:"scoreThreshold",type:"number"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0},{tfName:"T_threshold",name:"threshold",type:"dtype",notSupported:!0},{tfName:"pad_to_max_output_size",name:"padToMaxOutputSize",type:"bool"}]},{tfOpName:"NonMaxSuppressionV5",category:"dynamic",inputs:[{start:0,name:"boxes",type:"tensor"},{start:1,name:"scores",type:"tensor"},{start:2,name:"maxOutputSize",type:"number"},{start:3,name:"iouThreshold",type:"number"},{start:4,name:"scoreThreshold",type:"number"},{start:5,name:"softNmsSigma",type:"number"}]},{tfOpName:"Where",category:"dynamic",inputs:[{start:0,name:"condition",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"ListDiff",category:"dynamic",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"y",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]}];var Af={};ye(Af,{json:()=>eO});var eO=[{tfOpName:"LowerBound",category:"evaluation",inputs:[{start:0,name:"sortedSequence",type:"tensor"},{start:1,name:"values",type:"tensor"}]},{tfOpName:"TopKV2",category:"evaluation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"k",type:"number"}],attrs:[{tfName:"sorted",name:"sorted",type:"bool"}]},{tfOpName:"UpperBound",category:"evaluation",inputs:[{start:0,name:"sortedSequence",type:"tensor"},{start:1,name:"values",type:"tensor"}]},{tfOpName:"Unique",category:"evaluation",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"UniqueV2",category:"evaluation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}]}];var _f={};ye(_f,{json:()=>tO});var tO=[{tfOpName:"PlaceholderWithDefault",category:"graph",inputs:[{start:0,name:"default",type:"tensor"}],attrs:[{tfName:"shape",name:"shape",type:"shape"},{tfName:"dtype",name:"dtype",type:"dtype"}]},{tfOpName:"Placeholder",category:"graph",attrs:[{tfName:"shape",name:"shape",type:"shape"},{tfName:"dtype",name:"dtype",type:"dtype"}]},{tfOpName:"Const",category:"graph"},{tfOpName:"Identity",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"IdentityN",category:"graph",inputs:[{start:0,end:0,name:"x",type:"tensors"}]},{tfOpName:"Snapshot",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"Rank",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"Size",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"Shape",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"ShapeN",category:"graph",inputs:[{start:0,end:0,name:"x",type:"tensors"}]},{tfOpName:"Print",category:"graph",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"data",type:"tensors"}],attrs:[{tfName:"message",name:"message",type:"string"},{tfName:"first_n",name:"firstN",type:"number",notSupported:!0},{tfName:"summarize",name:"summarize",type:"number",defaultValue:3}]},{tfOpName:"NoOp",category:"graph",inputs:[]},{tfOpName:"StopGradient",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"FakeQuantWithMinMaxVars",category:"graph",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"min",name:"min",type:"number"},{tfName:"max",name:"max",type:"number"}]}];var Df={};ye(Df,{json:()=>rO});var rO=[{tfOpName:"HashTable",category:"hash_table",inputs:[],attrs:[{tfName:"shared_name",name:"sharedName",type:"string"},{tfName:"use_node_name_sharing",name:"useNodeNameSharing",type:"bool"},{tfName:"key_dtype",name:"keyDType",type:"dtype"},{tfName:"value_dtype",name:"valueDType",type:"dtype"}]},{tfOpName:"HashTableV2",category:"hash_table",inputs:[],attrs:[{tfName:"shared_name",name:"sharedName",type:"string"},{tfName:"use_node_name_sharing",name:"useNodeNameSharing",type:"bool"},{tfName:"key_dtype",name:"keyDType",type:"dtype"},{tfName:"value_dtype",name:"valueDType",type:"dtype"}]},{tfOpName:"LookupTableImport",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"values",type:"tensor"}],attrs:[{tfName:"Tin",name:"tIn",type:"dtype",notSupported:!0},{tfName:"Tout",name:"tOut",type:"dtype",notSupported:!0}]},{tfOpName:"LookupTableImportV2",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"values",type:"tensor"}],attrs:[{tfName:"Tin",name:"tIn",type:"dtype",notSupported:!0},{tfName:"Tout",name:"tOut",type:"dtype",notSupported:!0}]},{tfOpName:"LookupTableFind",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"defaultValue",type:"tensor"}],attrs:[{tfName:"Tin",name:"tIn",type:"dtype",notSupported:!0},{tfName:"Tout",name:"tOut",type:"dtype",notSupported:!0}]},{tfOpName:"LookupTableFindV2",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"defaultValue",type:"tensor"}],attrs:[{tfName:"Tin",name:"tIn",type:"dtype",notSupported:!0},{tfName:"Tout",name:"tOut",type:"dtype",notSupported:!0}]},{tfOpName:"LookupTableSize",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"}]},{tfOpName:"LookupTableSizeV2",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"}]},{tfOpName:"InitializeTable",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"values",type:"tensor"}]},{tfOpName:"InitializeTableV2",category:"hash_table",inputs:[{start:0,name:"tableHandle",type:"tensor"},{start:1,name:"keys",type:"tensor"},{start:2,name:"values",type:"tensor"}]}];var Of={};ye(Of,{json:()=>oO});var oO=[{tfOpName:"ResizeBilinear",category:"image",inputs:[{start:0,name:"images",type:"tensor"},{start:1,name:"size",type:"number[]"}],attrs:[{tfName:"align_corners",name:"alignCorners",type:"bool"},{tfName:"half_pixel_centers",name:"halfPixelCenters",type:"bool"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"ResizeNearestNeighbor",category:"image",inputs:[{start:0,name:"images",type:"tensor"},{start:1,name:"size",type:"number[]"}],attrs:[{tfName:"align_corners",name:"alignCorners",type:"bool"},{tfName:"half_pixel_centers",name:"halfPixelCenters",type:"bool"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"CropAndResize",category:"image",inputs:[{start:0,name:"image",type:"tensor"},{start:1,name:"boxes",type:"tensor"},{start:2,name:"boxInd",type:"tensor"},{start:3,name:"cropSize",type:"number[]"}],attrs:[{tfName:"method",name:"method",type:"string"},{tfName:"extrapolation_value",name:"extrapolationValue",type:"number"}]},{tfOpName:"ImageProjectiveTransformV3",category:"image",inputs:[{start:0,name:"images",type:"tensor"},{start:1,name:"transforms",type:"tensor"},{start:2,name:"outputShape",type:"number[]"},{start:3,name:"fillValue",type:"number"}],attrs:[{tfName:"interpolation",name:"interpolation",type:"string"},{tfName:"fill_mode",name:"fillMode",type:"string"}]}];var Ff={};ye(Ff,{json:()=>nO});var nO=[{tfOpName:"Equal",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"NotEqual",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Greater",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"GreaterEqual",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Less",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LessEqual",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LogicalAnd",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LogicalNot",category:"logical",inputs:[{start:0,name:"a",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"LogicalOr",category:"logical",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Select",category:"logical",inputs:[{start:0,name:"condition",type:"tensor"},{start:1,name:"a",type:"tensor"},{start:2,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"SelectV2",category:"logical",inputs:[{start:0,name:"condition",type:"tensor"},{start:1,name:"a",type:"tensor"},{start:2,name:"b",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"BitwiseAnd",category:"logical",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"y",type:"tensor"}]}];var Pf={};ye(Pf,{json:()=>sO});var sO=[{tfOpName:"_FusedMatMul",category:"matrices",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"},{start:2,end:0,name:"args",type:"tensors"}],attrs:[{tfName:"num_args",name:"numArgs",type:"number"},{tfName:"fused_ops",name:"fusedOps",type:"string[]",defaultValue:[]},{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:1e-4},{tfName:"transpose_a",name:"transposeA",type:"bool",defaultValue:!1},{tfName:"transpose_b",name:"transposeB",type:"bool",defaultValue:!1},{tfName:"leakyrelu_alpha",name:"leakyreluAlpha",type:"number",defaultValue:.2},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"MatMul",category:"matrices",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"transpose_a",name:"transposeA",type:"bool",defaultValue:!1},{tfName:"transpose_b",name:"transposeB",type:"bool",defaultValue:!1},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"BatchMatMul",category:"matrices",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"adj_x",name:"transposeA",type:"bool",defaultValue:!1},{tfName:"adj_y",name:"transposeB",type:"bool",defaultValue:!1},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"BatchMatMulV2",category:"matrices",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"b",type:"tensor"}],attrs:[{tfName:"adj_x",name:"transposeA",type:"bool",defaultValue:!1},{tfName:"adj_y",name:"transposeB",type:"bool",defaultValue:!1},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Transpose",category:"matrices",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"perm",type:"number[]"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Einsum",category:"matrices",inputs:[{start:0,end:0,name:"tensors",type:"tensors"}],attrs:[{tfName:"equation",name:"equation",type:"string"},{tfName:"N",name:"n",type:"number",defaultValue:2},{tfName:"T",name:"dtype",type:"dtype"}]},{tfOpName:"MatrixBandPart",category:"matrices",inputs:[{start:0,name:"a",type:"tensor"},{start:1,name:"numLower",type:"tensor"},{start:1,name:"numUpper",type:"tensor"}]}];var Lf={};ye(Lf,{json:()=>iO});var iO=[{tfOpName:"EuclideanNorm",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool",defaultValue:!1}]},{tfOpName:"FusedBatchNorm",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"scale",type:"tensor"},{start:2,name:"offset",type:"tensor"},{start:3,name:"mean",type:"tensor"},{start:4,name:"variance",type:"tensor"}],attrs:[{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:.001},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0}]},{tfOpName:"FusedBatchNormV2",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"scale",type:"tensor"},{start:2,name:"offset",type:"tensor"},{start:3,name:"mean",type:"tensor"},{start:4,name:"variance",type:"tensor"}],attrs:[{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:.001},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0}]},{tfOpName:"FusedBatchNormV3",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"scale",type:"tensor"},{start:2,name:"offset",type:"tensor"},{start:3,name:"mean",type:"tensor"},{start:4,name:"variance",type:"tensor"}],attrs:[{tfName:"epsilon",name:"epsilon",type:"number",defaultValue:.001},{tfName:"data_format",name:"dataFormat",type:"string",notSupported:!0}]},{tfOpName:"LRN",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"depth_radius",name:"radius",type:"number",defaultValue:5},{tfName:"bias",name:"bias",type:"number",defaultValue:1},{tfName:"alpha",name:"alpha",type:"number",defaultValue:1},{tfName:"beta",name:"beta",type:"number",defaultValue:.5}]},{tfOpName:"Softmax",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"LogSoftmax",category:"normalization",inputs:[{start:0,name:"x",type:"tensor"}]}];var Bf={};ye(Bf,{json:()=>aO});var aO=[{tfOpName:"Bincount",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"size",type:"number"},{start:2,name:"weights",type:"tensor"}]},{tfOpName:"DenseBincount",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"size",type:"number"},{start:2,name:"weights",type:"tensor"}],attrs:[{tfName:"binary_output",name:"binaryOutput",type:"bool"}]},{tfOpName:"Max",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"Mean",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"Min",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"Sum",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"All",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"Any",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"}]},{tfOpName:"ArgMax",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}]},{tfOpName:"ArgMin",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}]},{tfOpName:"Prod",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}],attrs:[{tfName:"keep_dims",name:"keepDims",type:"bool"},{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"Cumprod",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}],attrs:[{tfName:"exclusive",name:"exclusive",type:"bool"},{tfName:"reverse",name:"reverse",type:"bool"}]},{tfOpName:"Cumsum",category:"reduction",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}],attrs:[{tfName:"exclusive",name:"exclusive",type:"bool"},{tfName:"reverse",name:"reverse",type:"bool"}]}];var Mf={};ye(Mf,{json:()=>uO});var uO=[{tfOpName:"ConcatV2",category:"slice_join",inputs:[{start:0,end:-1,name:"tensors",type:"tensors"},{start:-1,name:"axis",type:"number"}],attrs:[{tfName:"N",name:"n",type:"number",defaultValue:2}]},{tfOpName:"Concat",category:"slice_join",inputs:[{start:1,end:0,name:"tensors",type:"tensors"},{start:0,name:"axis",type:"number"}],attrs:[{tfName:"N",name:"n",type:"number",defaultValue:2}]},{tfOpName:"GatherV2",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"indices",type:"tensor"},{start:2,name:"axis",type:"number",defaultValue:0}],attrs:[{tfName:"batch_dims",name:"batchDims",type:"number",defaultValue:0}]},{tfOpName:"Gather",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"indices",type:"tensor"}],attrs:[{tfName:"validate_indices",name:"validateIndices",type:"bool",notSupported:!0}]},{tfOpName:"Reverse",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"dims",type:"bool[]"}]},{tfOpName:"ReverseV2",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number[]"}]},{tfOpName:"Slice",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"begin",type:"number[]"},{start:2,name:"size",type:"number[]"}]},{tfOpName:"StridedSlice",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"begin",type:"number[]"},{start:2,name:"end",type:"number[]"},{start:3,name:"strides",type:"number[]"}],attrs:[{tfName:"begin_mask",name:"beginMask",type:"number",defaultValue:0},{tfName:"end_mask",name:"endMask",type:"number",defaultValue:0},{tfName:"new_axis_mask",name:"newAxisMask",type:"number",defaultValue:0},{tfName:"ellipsis_mask",name:"ellipsisMask",type:"number",defaultValue:0},{tfName:"shrink_axis_mask",name:"shrinkAxisMask",type:"number",defaultValue:0}]},{tfOpName:"Pack",category:"slice_join",inputs:[{start:0,end:0,name:"tensors",type:"tensors"}],attrs:[{tfName:"axis",name:"axis",type:"number",defaultValue:0}]},{tfOpName:"Unpack",category:"slice_join",inputs:[{start:0,name:"tensor",type:"tensor"}],attrs:[{tfName:"axis",name:"axis",type:"number",defaultValue:0},{tfName:"num",name:"num",type:"number",defaultValue:0,notSupported:!0}]},{tfOpName:"Tile",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"reps",type:"number[]"}]},{tfOpName:"Split",category:"slice_join",inputs:[{start:0,name:"axis",type:"number",defaultValue:0},{start:1,name:"x",type:"tensor"}],attrs:[{tfName:"num_split",name:"numOrSizeSplits",type:"number",defaultValue:1}]},{tfOpName:"SplitV",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"numOrSizeSplits",type:"number[]"},{start:2,name:"axis",type:"number",defaultValue:0}]},{tfOpName:"ScatterNd",category:"slice_join",inputs:[{start:0,name:"indices",type:"tensor"},{start:1,name:"values",type:"tensor"},{start:2,name:"shape",type:"number[]"}]},{tfOpName:"GatherNd",category:"slice_join",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"indices",type:"tensor"}]},{tfOpName:"SparseToDense",category:"slice_join",inputs:[{start:0,name:"sparseIndices",type:"tensor"},{start:1,name:"outputShape",type:"number[]"},{start:2,name:"sparseValues",type:"tensor"},{start:3,name:"defaultValue",type:"tensor"}],attrs:[{tfName:"validate_indices",name:"validateIndices",type:"bool",defaultValue:!1,notSupported:!0}]},{tfOpName:"TensorScatterUpdate",category:"slice_join",inputs:[{start:0,name:"tensor",type:"tensor"},{start:1,name:"indices",type:"tensor"},{start:2,name:"values",type:"tensor"}]}];var Vf={};ye(Vf,{json:()=>lO});var lO=[{tfOpName:"SparseFillEmptyRows",category:"sparse",inputs:[{start:0,name:"indices",type:"tensor"},{start:1,name:"values",type:"tensor"},{start:2,name:"denseShape",type:"tensor"},{start:3,name:"defaultValue",type:"tensor"}]},{tfOpName:"SparseReshape",category:"sparse",inputs:[{start:0,name:"inputIndices",type:"tensor"},{start:1,name:"inputShape",type:"tensor"},{start:2,name:"newShape",type:"tensor"}],attrs:[{tfName:"T",name:"dtype",type:"dtype",notSupported:!0}]},{tfOpName:"SparseSegmentMean",category:"sparse",inputs:[{start:0,name:"data",type:"tensor"},{start:1,name:"indices",type:"tensor"},{start:2,name:"segmentIds",type:"tensor"}]},{tfOpName:"SparseSegmentSum",category:"sparse",inputs:[{start:0,name:"data",type:"tensor"},{start:1,name:"indices",type:"tensor"},{start:2,name:"segmentIds",type:"tensor"}]}];var Uf={};ye(Uf,{json:()=>cO});var cO=[{tfOpName:"FFT",category:"spectral",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"IFFT",category:"spectral",inputs:[{start:0,name:"x",type:"tensor"}]},{tfOpName:"RFFT",category:"spectral",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"fft_length",type:"number",notSupported:!0}]},{tfOpName:"IRFFT",category:"spectral",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"fft_length",type:"number",notSupported:!0}]}];var Gf={};ye(Gf,{json:()=>pO});var pO=[{tfOpName:"StaticRegexReplace",category:"string",inputs:[{start:0,name:"input",type:"tensor"}],attrs:[{tfName:"pattern",name:"pattern",type:"string"},{tfName:"rewrite",name:"rewrite",type:"string"},{tfName:"replace_global",name:"replaceGlobal",type:"bool"}]},{tfOpName:"StringNGrams",category:"string",inputs:[{start:0,name:"data",type:"tensor"},{start:1,name:"dataSplits",type:"tensor"}],attrs:[{tfName:"separator",name:"separator",type:"string"},{tfName:"ngram_widths",name:"nGramWidths",type:"number[]"},{tfName:"left_pad",name:"leftPad",type:"string"},{tfName:"right_pad",name:"rightPad",type:"string"},{tfName:"pad_width",name:"padWidth",type:"number"},{tfName:"preserve_short_sequences",name:"preserveShortSequences",type:"bool"}],outputs:["ngrams","ngrams_splits"]},{tfOpName:"StringSplit",category:"string",inputs:[{start:0,name:"input",type:"tensor"},{start:1,name:"delimiter",type:"tensor"}],attrs:[{tfName:"skip_empty",name:"skipEmpty",type:"bool"}],outputs:["indices","values","shape"]},{tfOpName:"StringToHashBucketFast",category:"string",inputs:[{start:0,name:"input",type:"tensor"}],attrs:[{tfName:"num_buckets",name:"numBuckets",type:"number"}]}];var zf={};ye(zf,{json:()=>mO});var mO=[{tfOpName:"Cast",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"SrcT",name:"sdtype",type:"dtype",notSupported:!0},{tfName:"DstT",name:"dtype",type:"dtype"}]},{tfOpName:"ExpandDims",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"axis",type:"number"}]},{tfOpName:"MirrorPad",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"padding",type:"number[]"}],attrs:[{tfName:"mode",name:"mode",type:"string"}]},{tfOpName:"Pad",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"padding",type:"number[]"}],attrs:[{tfName:"constant_value",name:"constantValue",type:"number",defaultValue:0}]},{tfOpName:"PadV2",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"padding",type:"number[]"},{start:2,name:"constantValue",type:"number",defaultValue:0}]},{tfOpName:"Reshape",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"shape",type:"number[]"}]},{tfOpName:"EnsureShape",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"shape",type:"number[]"}]},{tfOpName:"Squeeze",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"axis",tfDeprecatedName:"squeeze_dims",name:"axis",type:"number[]"}]},{tfOpName:"SpaceToBatchND",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"blockShape",type:"number[]"},{start:2,name:"paddings",type:"number[]"}]},{tfOpName:"BatchToSpaceND",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"blockShape",type:"number[]"},{start:2,name:"crops",type:"number[]"}]},{tfOpName:"DepthToSpace",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"}],attrs:[{tfName:"block_size",name:"blockSize",type:"number"},{tfName:"data_format",name:"dataFormat",type:"string"}]},{tfOpName:"BroadcastTo",category:"transformation",inputs:[{start:0,name:"x",type:"tensor"},{start:1,name:"shape",type:"number[]"}],attrs:[]},{tfOpName:"BroadcastArgs",category:"transformation",inputs:[{start:0,name:"s0",type:"tensor"},{start:1,name:"s1",type:"tensor"}],attrs:[]}];var ei=class{static get Instance(){return this._instance||(this._instance=new this)}constructor(){let e=[Nf,Ef,If,kf,$f,Rf,Af,_f,Df,Of,Ff,Pf,Lf,Bf,Mf,Vf,Uf,Gf,zf],t=[].concat(...e.map(o=>o.json));this.opMappers=t.reduce((o,n)=>(o[n.tfOpName]=n,o),{})}transformGraph(e,t={}){let o=e.node,n=[],s=[],i=[],a=o.reduce((g,h)=>(g[h.name]=this.mapNode(h),h.op.startsWith("Placeholder")?n.push(g[h.name]):h.op==="Const"?s.push(g[h.name]):(h.input==null||h.input.length===0)&&i.push(g[h.name]),g),{}),u=[],l=[],c={},p={};t!=null&&(c=this.mapSignatureEntries(t.inputs),p=this.mapSignatureEntries(t.outputs));let m=Object.keys(a);m.forEach(g=>{let h=a[g];h.inputNames.forEach((x,v)=>{let[N,,E]=or(x),k=a[N];if(k.outputs!=null){let R=k.outputs.indexOf(E);if(R!==-1){let A=`${N}:${R}`;h.inputNames[v]=A}}h.inputs.push(k),k.children.push(h)})}),Object.keys(p).length===0?m.forEach(g=>{let h=a[g];h.children.length===0&&l.push(h)}):Object.keys(p).forEach(g=>{let[h]=or(g),x=a[h];x!=null&&(x.signatureKey=p[g],l.push(x))}),Object.keys(c).length>0?Object.keys(c).forEach(g=>{let[h]=or(g),x=a[h];x&&(x.signatureKey=c[g],u.push(x))}):u=n;let f={};e.library!=null&&e.library.function!=null&&(f=e.library.function.reduce((g,h)=>(g[h.signature.name]=this.mapFunction(h),g),{}));let d={nodes:a,inputs:u,outputs:l,weights:s,placeholders:n,signature:t,functions:f};return i.length>0&&(d.initNodes=i),d}mapSignatureEntries(e){return Object.keys(e||{}).reduce((t,o)=>(t[e[o].name]=o,t),{})}mapNode(e){let t=Zl(e.op)||this.opMappers[e.op]||{};e.attr==null&&(e.attr={});let o={name:e.name,op:e.op,category:t.category,inputNames:(e.input||[]).map(n=>n.startsWith("^")?n.slice(1):n),inputs:[],children:[],inputParams:{},attrParams:{},rawAttrs:e.attr,outputs:t.outputs};return t.inputs!=null&&(o.inputParams=t.inputs.reduce((n,s)=>(n[s.name]={type:s.type,inputIndexStart:s.start,inputIndexEnd:s.end},n),{})),t.attrs!=null&&(o.attrParams=t.attrs.reduce((n,s)=>{let i=s.type,a;switch(s.type){case"string":a=ec(e.attr,s.tfName,s.defaultValue),a===void 0&&s.tfDeprecatedName&&(a=ec(e.attr,s.tfDeprecatedName,s.defaultValue));break;case"string[]":a=ac(e.attr,s.tfName,s.defaultValue),a===void 0&&s.tfDeprecatedName&&(a=ac(e.attr,s.tfDeprecatedName,s.defaultValue));break;case"number":a=rc(e.attr,s.tfName,s.defaultValue||0),a===void 0&&s.tfDeprecatedName&&(a=rc(e.attr,s.tfDeprecatedName,s.defaultValue));break;case"number[]":a=ic(e.attr,s.tfName,s.defaultValue),a===void 0&&s.tfDeprecatedName&&(a=ic(e.attr,s.tfDeprecatedName,s.defaultValue));break;case"bool":a=tc(e.attr,s.tfName,s.defaultValue),a===void 0&&s.tfDeprecatedName&&(a=tc(e.attr,s.tfDeprecatedName,s.defaultValue));break;case"bool[]":a=lc(e.attr,s.tfName,s.defaultValue),a===void 0&&s.tfDeprecatedName&&(a=lc(e.attr,s.tfDeprecatedName,s.defaultValue));break;case"shape":a=sc(e.attr,s.tfName,s.defaultValue),a===void 0&&s.tfDeprecatedName&&(a=sc(e.attr,s.tfDeprecatedName,s.defaultValue));break;case"shape[]":a=uc(e.attr,s.tfName,s.defaultValue),a===void 0&&s.tfDeprecatedName&&(a=uc(e.attr,s.tfDeprecatedName,s.defaultValue));break;case"dtype":a=oc(e.attr,s.tfName,s.defaultValue),a===void 0&&s.tfDeprecatedName&&(a=oc(e.attr,s.tfDeprecatedName,s.defaultValue));break;case"dtype[]":a=nc(e.attr,s.tfName,s.defaultValue),a===void 0&&s.tfDeprecatedName&&(a=nc(e.attr,s.tfDeprecatedName,s.defaultValue));break;case"func":a=U0(e.attr,s.tfName,s.defaultValue),a===void 0&&s.tfDeprecatedName&&(a=U0(e.attr,s.tfDeprecatedName,s.defaultValue));break;case"tensor":case"tensors":break;default:throw new Error(`Unsupported param type: ${s.type} for op: ${e.op}`)}return n[s.name]={value:a,type:i},n},{})),o}mapFunction(e){let t=e.nodeDef,o=[],n=[],s={};t!=null&&(s=t.reduce((p,m)=>(p[m.name]=this.mapNode(m),m.op==="Const"&&n.push(p[m.name]),p),{}));let i=[],a=[];e.signature.inputArg.forEach(p=>{let[m]=or(p.name),f={name:m,op:"Placeholder",inputs:[],inputNames:[],category:"graph",inputParams:{},attrParams:{dtype:{value:Wf(p.type),type:"dtype"}},children:[]};f.signatureKey=p.name,i.push(f),s[m]=f}),Object.keys(s).forEach(p=>{let m=s[p];m.inputNames.forEach((f,d)=>{let[g,,h]=or(f),x=s[g];if(x.outputs!=null){let v=x.outputs.indexOf(h);if(v!==-1){let N=`${g}:${v}`;m.inputNames[d]=N}}m.inputs.push(x),x.children.push(m)})});let l=e.ret;e.signature.outputArg.forEach(p=>{let[m,f]=or(l[p.name]),d=s[m];d!=null&&(d.defaultOutput=f,a.push(d))});let c=this.mapArgsToSignature(e);return{nodes:s,inputs:i,outputs:a,weights:n,placeholders:o,signature:c}}mapArgsToSignature(e){return{methodName:e.signature.name,inputs:e.signature.inputArg.reduce((t,o)=>(t[o.name]=this.mapArgToTensorInfo(o),t),{}),outputs:e.signature.outputArg.reduce((t,o)=>(t[o.name]=this.mapArgToTensorInfo(o,e.ret),t),{})}}mapArgToTensorInfo(e,t){let o=e.name;return t!=null&&(o=t[o]),{name:o,dtype:e.type}}};function fO(r){let e=$().global;if(typeof e.atob<"u")return e.atob(r);if(typeof Buffer<"u")return new Buffer(r,"base64").toString();throw new Error("Unable to decode base64 in this environment. Missing built-in atob() or Buffer()")}function G0(r,e){let t=Array.isArray(r)?String.fromCharCode.apply(null,r):fO(r);return e?t:t.toLowerCase()}function ec(r,e,t,o=!1){let n=r[e];return n!=null?G0(n.s,o):t}function tc(r,e,t){let o=r[e];return o?o.b:t}function rc(r,e,t){let o=r[e]||{},n=o.i!=null?o.i:o.f!=null?o.f:t;return typeof n=="number"?n:parseInt(n,10)}function Wf(r){switch(typeof r=="string"&&(r=bt[r]),r){case bt.DT_FLOAT:case bt.DT_HALF:return"float32";case bt.DT_INT32:case bt.DT_INT64:case bt.DT_INT8:case bt.DT_UINT8:return"int32";case bt.DT_BOOL:return"bool";case bt.DT_DOUBLE:return"float32";case bt.DT_STRING:return"string";case bt.DT_COMPLEX64:case bt.DT_COMPLEX128:return"complex64";default:return null}}function U0(r,e,t){let o=r[e];return o&&o.func?o.func.name:t}function oc(r,e,t){let o=r[e];return o&&o.type?Wf(o.type):t}function nc(r,e,t){let o=r[e];return o&&o.list&&o.list.type?o.list.type.map(n=>Wf(n)):t}function z0(r){if(!r.unknownRank)return r.dim!=null?r.dim.map(e=>typeof e.size=="number"?e.size:parseInt(e.size,10)):[]}function sc(r,e,t){let o=r[e];return o&&o.shape?z0(o.shape):t}function ic(r,e,t){let o=r[e];return o?((o.list.f&&o.list.f.length?o.list.f:o.list.i)||[]).map(n=>typeof n=="number"?n:parseInt(n,10)):t}function ac(r,e,t,o=!1){let n=r[e];return n&&n.list&&n.list.s?n.list.s.map(s=>G0(s,o)):t}function uc(r,e,t){let o=r[e];return o&&o.list&&o.list.shape?o.list.shape.map(n=>z0(n)):t}function lc(r,e,t){let o=r[e];return o&&o.list&&o.list.b?o.list.b:t}var cc=class{constructor(e,t,o){this.node=e,this.tensorMap=t,this.context=o,this.inputs=[],this.attrs={},this.inputs=e.inputNames.map(n=>this.getInput(n)),e.rawAttrs!=null&&(this.attrs=Object.keys(e.rawAttrs).reduce((n,s)=>(n[s]=this.getAttr(s),n),{}))}getInput(e){return Pe(e,this.tensorMap,this.context)}getAttr(e,t){let o=this.node.rawAttrs[e];if(o.tensor!=null)return Pe(e,this.tensorMap,this.context);if(o.i!=null||o.f!=null)return rc(this.node.rawAttrs,e,t);if(o.s!=null)return ec(this.node.rawAttrs,e,t);if(o.b!=null)return tc(this.node.rawAttrs,e,t);if(o.shape!=null)return sc(this.node.rawAttrs,e,t);if(o.type!=null)return oc(this.node.rawAttrs,e,t);if(o.list!=null){if(o.list.i!=null||o.list.f!=null)return ic(this.node.rawAttrs,e,t);if(o.list.s!=null)return ac(this.node.rawAttrs,e,t);if(o.list.shape!=null)return uc(this.node.rawAttrs,e,t);if(o.list.b!=null)return lc(this.node.rawAttrs,e,t);if(o.list.type!=null)return nc(this.node.rawAttrs,e,t)}return t}};var se={};ye(se,{OP_SCOPE_SUFFIX:()=>Um,abs:()=>ze,acos:()=>Ug,acosh:()=>Gg,add:()=>V,addN:()=>zg,all:()=>Hg,any:()=>qg,argMax:()=>qu,argMin:()=>Xg,asin:()=>jg,asinh:()=>Yg,atan:()=>Qg,atan2:()=>Zg,atanh:()=>Jg,avgPool:()=>Xu,avgPool3d:()=>rx,basicLSTMCell:()=>ox,batchNorm:()=>Qr,batchNorm2d:()=>sx,batchNorm3d:()=>ix,batchNorm4d:()=>ax,batchToSpaceND:()=>ju,bincount:()=>Yu,bitwiseAnd:()=>ux,booleanMaskAsync:()=>qR,broadcastArgs:()=>lx,broadcastTo:()=>Zr,buffer:()=>oe,cast:()=>ee,ceil:()=>cx,clipByValue:()=>Qu,clone:()=>$t,complex:()=>mt,concat:()=>xe,concat1d:()=>px,concat2d:()=>mx,concat3d:()=>fx,concat4d:()=>dx,conv1d:()=>hx,conv2d:()=>Jr,conv2dTranspose:()=>gx,conv3d:()=>xx,conv3dTranspose:()=>bx,cos:()=>vx,cosh:()=>Tx,cosineWindow:()=>js,cumprod:()=>Sx,cumsum:()=>Cx,denseBincount:()=>Nx,depthToSpace:()=>Ex,depthwiseConv2d:()=>qn,diag:()=>Ix,dilation2d:()=>kx,div:()=>Y,divNoNan:()=>Rx,dot:()=>Ax,dropout:()=>sA,einsum:()=>to,elu:()=>tl,enclosingPowerOfTwo:()=>lf,ensureShape:()=>Dx,equal:()=>el,erf:()=>Fx,euclideanNorm:()=>Gx,exp:()=>ht,expandDims:()=>Je,expm1:()=>zx,eye:()=>ol,fft:()=>Yn,fill:()=>gr,floor:()=>nl,floorDiv:()=>Hu,fused:()=>cf,gather:()=>sl,gatherND:()=>oA,greater:()=>Po,greaterEqual:()=>il,ifft:()=>Uo,imag:()=>oo,image:()=>Lr,inTopKAsync:()=>aA,irfft:()=>$l,isFinite:()=>Wx,isInf:()=>Hx,isNaN:()=>Kx,leakyRelu:()=>al,less:()=>Ks,lessEqual:()=>Xn,linalg:()=>l_,linspace:()=>qx,localResponseNormalization:()=>jx,log:()=>Dr,log1p:()=>ll,logSigmoid:()=>Qx,logSoftmax:()=>Zx,logSumExp:()=>ml,logicalAnd:()=>Lo,logicalNot:()=>fl,logicalOr:()=>dl,logicalXor:()=>Jx,losses:()=>c_,lowerBound:()=>ey,matMul:()=>ue,max:()=>xr,maxPool:()=>gl,maxPool3d:()=>ty,maxPoolWithArgmax:()=>ry,maximum:()=>xl,mean:()=>Bo,meshgrid:()=>oy,min:()=>Hs,minimum:()=>Or,mirrorPad:()=>yl,mod:()=>sy,moments:()=>iy,movingAverage:()=>YR,mul:()=>P,multiRNNCell:()=>ay,multinomial:()=>uy,neg:()=>qe,norm:()=>Fo,notEqual:()=>bl,oneHot:()=>ly,ones:()=>yr,onesLike:()=>cy,op:()=>w,outerProduct:()=>py,pad:()=>_t,pad1d:()=>my,pad2d:()=>fy,pad3d:()=>dy,pad4d:()=>hy,pool:()=>gy,pow:()=>_r,prelu:()=>vl,print:()=>Wu,prod:()=>xy,raggedGather:()=>yy,raggedRange:()=>by,raggedTensorToTensor:()=>wy,rand:()=>vy,randomGamma:()=>My,randomNormal:()=>El,randomStandardNormal:()=>Vy,randomUniform:()=>jn,randomUniformInt:()=>Uy,range:()=>no,real:()=>Fr,reciprocal:()=>Gy,relu:()=>so,relu6:()=>Il,reshape:()=>D,reverse:()=>Gt,reverse1d:()=>zy,reverse2d:()=>Wy,reverse3d:()=>Hy,reverse4d:()=>Ky,rfft:()=>Qn,round:()=>kl,rsqrt:()=>qy,scalar:()=>K,scatterND:()=>ZR,searchSorted:()=>qs,selu:()=>Xy,separableConv2d:()=>jy,setdiff1dAsync:()=>Yy,sigmoid:()=>Rt,sign:()=>Qy,signal:()=>u_,sin:()=>Jy,sinh:()=>eb,slice:()=>Q,slice1d:()=>tb,slice2d:()=>rb,slice3d:()=>ob,slice4d:()=>nb,softmax:()=>sb,softplus:()=>cl,spaceToBatchND:()=>wl,sparse:()=>p_,sparseToDense:()=>tA,spectral:()=>a_,split:()=>Pr,sqrt:()=>dt,square:()=>Me,squaredDifference:()=>Rl,squeeze:()=>ge,stack:()=>nt,step:()=>Al,stridedSlice:()=>ab,string:()=>m_,sub:()=>q,sum:()=>le,tan:()=>lb,tanh:()=>Ws,tensor:()=>ot,tensor1d:()=>Re,tensor2d:()=>st,tensor3d:()=>_l,tensor4d:()=>cb,tensor5d:()=>pb,tensor6d:()=>mb,tensorScatterUpdate:()=>hb,tile:()=>ro,topk:()=>gb,transpose:()=>Fl,truncatedNormal:()=>xb,unique:()=>yb,unsortedSegmentSum:()=>bb,unstack:()=>zt,upperBound:()=>wb,variable:()=>vb,where:()=>Ut,whereAsync:()=>Ol,zeros:()=>At,zerosLike:()=>Be});var W0=(r,e,t,o=se)=>{switch(r.op){case"BiasAdd":case"AddV2":case"Add":return[o.add(y("a",r,e,t),y("b",r,e,t))];case"AddN":return[o.addN(y("tensors",r,e,t))];case"FloorMod":case"Mod":return[o.mod(y("a",r,e,t),y("b",r,e,t))];case"Mul":return[o.mul(y("a",r,e,t),y("b",r,e,t))];case"RealDiv":case"Div":return[o.div(y("a",r,e,t),y("b",r,e,t))];case"DivNoNan":return[o.divNoNan(y("a",r,e,t),y("b",r,e,t))];case"FloorDiv":return[o.floorDiv(y("a",r,e,t),y("b",r,e,t))];case"Sub":return[o.sub(y("a",r,e,t),y("b",r,e,t))];case"Minimum":return[o.minimum(y("a",r,e,t),y("b",r,e,t))];case"Maximum":return[o.maximum(y("a",r,e,t),y("b",r,e,t))];case"Pow":return[o.pow(y("a",r,e,t),y("b",r,e,t))];case"SquaredDifference":return[o.squaredDifference(y("a",r,e,t),y("b",r,e,t))];default:throw TypeError(`Node type ${r.op} is not implemented`)}};var H0=(r,e,t,o=se)=>{switch(r.op){case"Abs":case"ComplexAbs":return[o.abs(y("x",r,e,t))];case"Acos":return[o.acos(y("x",r,e,t))];case"Acosh":return[o.acosh(y("x",r,e,t))];case"Asin":return[o.asin(y("x",r,e,t))];case"Asinh":return[o.asinh(y("x",r,e,t))];case"Atan":return[o.atan(y("x",r,e,t))];case"Atan2":return[o.atan2(y("x",r,e,t),y("y",r,e,t))];case"Atanh":return[o.atanh(y("x",r,e,t))];case"Ceil":return[o.ceil(y("x",r,e,t))];case"Complex":return[o.complex(y("real",r,e,t),y("imag",r,e,t))];case"Cos":return[o.cos(y("x",r,e,t))];case"Cosh":return[o.cosh(y("x",r,e,t))];case"Elu":return[o.elu(y("x",r,e,t))];case"Erf":return[o.erf(y("x",r,e,t))];case"Exp":return[o.exp(y("x",r,e,t))];case"Expm1":return[o.expm1(y("x",r,e,t))];case"Floor":return[o.floor(y("x",r,e,t))];case"Log":return[o.log(y("x",r,e,t))];case"Log1p":return[o.log1p(y("x",r,e,t))];case"Imag":return[o.imag(y("x",r,e,t))];case"Neg":return[o.neg(y("x",r,e,t))];case"Reciprocal":return[o.reciprocal(y("x",r,e,t))];case"Real":return[o.real(y("x",r,e,t))];case"Relu":return[o.relu(y("x",r,e,t))];case"Round":return[o.round(y("x",r,e,t))];case"Selu":return[o.selu(y("x",r,e,t))];case"Sigmoid":return[o.sigmoid(y("x",r,e,t))];case"Sin":return[o.sin(y("x",r,e,t))];case"Sign":return[o.sign(y("x",r,e,t))];case"Sinh":return[o.sinh(y("x",r,e,t))];case"Softplus":return[o.softplus(y("x",r,e,t))];case"Sqrt":return[o.sqrt(y("x",r,e,t))];case"Square":return[o.square(y("x",r,e,t))];case"Tanh":return[o.tanh(y("x",r,e,t))];case"Tan":return[o.tan(y("x",r,e,t))];case"ClipByValue":return[o.clipByValue(y("x",r,e,t),y("clipValueMin",r,e,t),y("clipValueMax",r,e,t))];case"Relu6":return[o.relu6(y("x",r,e,t))];case"Rsqrt":return[o.rsqrt(Pe(r.inputNames[0],e,t))];case"LeakyRelu":return[o.leakyRelu(y("x",r,e,t),y("alpha",r,e,t))];case"Prelu":return[o.prelu(y("x",r,e,t),y("alpha",r,e,t))];case"IsNan":return[o.isNaN(Pe(r.inputNames[0],e,t))];case"IsInf":return[o.isInf(Pe(r.inputNames[0],e,t))];case"IsFinite":return[o.isFinite(Pe(r.inputNames[0],e,t))];default:throw TypeError(`Node type ${r.op} is not implemented`)}};function Dt(r,e,t=""){if(!(typeof r=="number"||typeof e=="number")){T.assert(r.length===e.length,()=>t+` Shapes ${r} and ${e} must match`);for(let o=0;o<r.length;o++){let n=r[o],s=e[o];T.assert(n<0||s<0||n===s,()=>t+` Shapes ${r} and ${e} must match`)}}}function K0(r){return!(typeof r=="number"||r.some(e=>e<0))}function es(r,e,t){let o=pc(r,t),n=!K0(o);if(n&&e.length===0)throw new Error(`Tried to calculate elements of an empty list with non-fully-defined elementShape: ${o}`);if(n&&e.forEach(s=>{o=pc(s.shape,o)}),!K0(o))throw new Error(`Non-fully-defined elementShape: ${o}`);return o}function pc(r,e){if(typeof r=="number")return e;if(typeof e=="number")return r;if(r.length!==e.length)throw new Error(`Incompatible ranks during merge: ${r} vs. ${e}`);let t=[];for(let o=0;o<r.length;++o){let n=r[o],s=e[o];if(n>=0&&s>=0&&n!==s)throw new Error(`Incompatible shape during merge: ${r} vs. ${e}`);t[o]=n>=0?n:s}return t}var mc=class{constructor(e,t,o,n,s,i,a){this.name=e,this.dtype=t,this.maxSize=o,this.elementShape=n,this.identicalElementShapes=s,this.dynamicSize=i,this.clearAfterRead=a,this.tensors=[],this.closed_=!1,this.idTensor=K(0),ft(this.idTensor)}get id(){return this.idTensor.id}get closed(){return this.closed_}clearAndClose(e){this.tensors.forEach(t=>{(e==null||!e.has(t.tensor.id))&&t.tensor.dispose()}),this.tensors=[],this.closed_=!0,this.idTensor.dispose()}size(){return this.tensors.length}read(e){if(this.closed_)throw new Error(`TensorArray ${this.name} has already been closed.`);if(e<0||e>=this.size())throw new Error(`Tried to read from index ${e}, but array size is: ${this.size()}`);let t=this.tensors[e];if(t.cleared)throw new Error(`TensorArray ${this.name}: Could not read index ${e} twice because it was cleared after a previous read (perhaps try setting clear_after_read = false?).`);return this.clearAfterRead&&(t.cleared=!0),t.read=!0,t.tensor}readMany(e){return e.map(t=>this.read(t))}write(e,t){if(this.closed_)throw new Error(`TensorArray ${this.name} has already been closed.`);if(e<0||!this.dynamicSize&&e>=this.maxSize)throw new Error(`Tried to write to index ${e}, but array is not resizeable and size is: ${this.maxSize}`);let o=this.tensors[e]||{};if(t.dtype!==this.dtype)throw new Error(`TensorArray ${this.name}: Could not write to TensorArray index ${e},
          because the value dtype is ${t.dtype}, but TensorArray dtype is ${this.dtype}.`);if(this.size()===0&&(this.elementShape==null||this.elementShape.length===0)&&(this.elementShape=t.shape),Dt(this.elementShape,t.shape,`TensorArray ${this.name}: Could not write to TensorArray index ${e}.`),o.read)throw new Error(`TensorArray ${this.name}: Could not write to TensorArray index ${e}, because it has already been read.`);if(o.written)throw new Error(`TensorArray ${this.name}: Could not write to TensorArray index ${e}, because it has already been written.`);o.tensor=t,ft(t),o.written=!0,this.tensors[e]=o}writeMany(e,t){if(e.length!==t.length)throw new Error(`TensorArray ${this.name}: could not write multiple tensors,because the index size: ${e.length} is not the same as tensors size: ${t.length}.`);e.forEach((o,n)=>this.write(o,t[n]))}gather(e,t){if(t&&t!==this.dtype)throw new Error(`TensorArray dtype is ${this.dtype} but gather requested dtype ${t}`);if(e)e=e.slice(0,this.size());else{e=[];for(let n=0;n<this.size();n++)e.push(n)}if(e.length===0)return ot([],[0].concat(this.elementShape));let o=this.readMany(e);return Dt(this.elementShape,o[0].shape,"TensorArray shape mismatch: "),nt(o,0)}concat(e){if(e&&e!==this.dtype)throw new Error(`TensorArray dtype is ${this.dtype} but concat requested dtype ${e}`);if(this.size()===0)return ot([],[0].concat(this.elementShape));let t=[];for(let n=0;n<this.size();n++)t.push(n);let o=this.readMany(t);return Dt(this.elementShape,o[0].shape,`TensorArray shape mismatch: tensor array shape (${this.elementShape}) vs first tensor shape (${o[0].shape})`),xe(o,0)}scatter(e,t){if(t.dtype!==this.dtype)throw new Error(`TensorArray dtype is ${this.dtype} but tensor has dtype ${t.dtype}`);if(e.length!==t.shape[0])throw new Error(`Expected len(indices) == tensor.shape[0], but saw: ${e.length} vs. ${t.shape[0]}`);let o=Math.max(...e);if(!this.dynamicSize&&o>=this.maxSize)throw new Error(`Max index must be < array size (${o}  vs. ${this.maxSize})`);this.writeMany(e,zt(t,0))}split(e,t){if(t.dtype!==this.dtype)throw new Error(`TensorArray dtype is ${this.dtype} but tensor has dtype ${t.dtype}`);let o=0,n=e.map(u=>(o+=u,o));if(o!==t.shape[0])throw new Error(`Expected sum of lengths to be equal to
          tensor.shape[0], but sum of lengths is
        ${o}, and tensor's shape is: ${t.shape}`);if(!this.dynamicSize&&e.length!==this.maxSize)throw new Error(`TensorArray's size is not equal to the size of lengths (${this.maxSize} vs. ${e.length}), and the TensorArray is not marked as dynamically resizeable`);let s=o===0?0:t.size/o,i=[];H(()=>{t=D(t,[1,o,s]);for(let u=0;u<e.length;++u){let c=[0,u===0?0:n[u-1],0],p=[1,e[u],s];i[u]=D(Q(t,c,p),this.elementShape)}return i});let a=[];for(let u=0;u<e.length;u++)a[u]=u;this.writeMany(a,i)}};var ts=class r{get id(){return this.idTensor.id}constructor(e,t,o,n=-1){this.tensors=e,this.elementShape=t,this.elementDtype=o,e?.forEach(s=>{if(o!==s.dtype)throw new Error(`Invalid data types; op elements ${o}, but list elements ${s.dtype}`);Dt(t,s.shape,"TensorList shape mismatch: "),ft(s)}),this.idTensor=K(0),this.maxNumElements=n,ft(this.idTensor)}copy(){return new r([...this.tensors],this.elementShape,this.elementDtype)}clearAndClose(e){this.tensors.forEach(t=>{(e==null||!e.has(t.id))&&t.dispose()}),this.tensors.length=0,this.idTensor.dispose()}size(){return this.tensors.length}stack(e,t,o=-1){if(t!==this.elementDtype)throw new Error(`Invalid data types; op elements ${t}, but list elements ${this.elementDtype}`);if(o!==-1&&this.tensors.length!==o)throw new Error(`Operation expected a list with ${o} elements but got a list with ${this.tensors.length} elements.`);Dt(e,this.elementShape,"TensorList shape mismatch: ");let n=es(this.elementShape,this.tensors,e);return H(()=>{let s=this.tensors.map(i=>D(i,n));return nt(s,0)})}popBack(e,t){if(t!==this.elementDtype)throw new Error(`Invalid data types; op elements ${t}, but list elements ${this.elementDtype}`);if(this.size()===0)throw new Error("Trying to pop from an empty list.");let o=es(this.elementShape,this.tensors,e),n=this.tensors.pop();return n.kept=!1,Dt(n.shape,e,"TensorList shape mismatch: "),D(n,o)}pushBack(e){if(e.dtype!==this.elementDtype)throw new Error(`Invalid data types; op elements ${e.dtype}, but list elements ${this.elementDtype}`);if(Dt(e.shape,this.elementShape,"TensorList shape mismatch: "),this.maxNumElements===this.size())throw new Error("Trying to push element into a full list.");ft(e),this.tensors.push(e)}resize(e){if(e<0)throw new Error(`TensorListResize expects size to be non-negative. Got: ${e}`);if(this.maxNumElements!==-1&&e>this.maxNumElements)throw new Error(`TensorListResize input size ${e} is greater maxNumElement ${this.maxNumElements}.`);let t=new r([],this.elementShape,this.elementDtype,this.maxNumElements);t.tensors.length=e;for(let o=0;o<Math.min(this.tensors.length,e);++o)t.tensors[o]=this.tensors[o];return t}getItem(e,t,o){if(o!==this.elementDtype)throw new Error(`Invalid data types; op elements ${o}, but list elements ${this.elementDtype}`);if(e<0||e>this.tensors.length)throw new Error(`Trying to access element ${e} in a list with ${this.tensors.length} elements.`);if(this.tensors[e]==null)throw new Error(`element at index ${e} is null.`);Dt(this.tensors[e].shape,t,"TensorList shape mismatch: ");let n=es(this.elementShape,this.tensors,t);return D(this.tensors[e],n)}setItem(e,t){if(t.dtype!==this.elementDtype)throw new Error(`Invalid data types; op elements ${t.dtype}, but list elements ${this.elementDtype}`);if(e<0||this.maxNumElements!==-1&&e>=this.maxNumElements)throw new Error(`Trying to set element ${e} in a list with max ${this.maxNumElements} elements.`);Dt(this.elementShape,t.shape,"TensorList shape mismatch: "),ft(t),this.tensors[e]!=null&&(this.tensors[e].kept=!1),this.tensors[e]=t}gather(e,t,o){if(t!==this.elementDtype)throw new Error(`Invalid data types; op elements ${t}, but list elements ${this.elementDtype}`);Dt(this.elementShape,o,"TensorList shape mismatch: "),e=e.slice(0,this.size());let n=es(this.elementShape,this.tensors,o);return e.length===0?ot([],[0].concat(n)):H(()=>{let s=e.map(i=>D(this.tensors[i],n));return nt(s,0)})}concat(e,t){if(e&&e!==this.elementDtype)throw new Error(`TensorList dtype is ${this.elementDtype} but concat requested dtype ${e}`);Dt(this.elementShape,t,"TensorList shape mismatch: ");let o=es(this.elementShape,this.tensors,t);return this.size()===0?ot([],[0].concat(o)):H(()=>{let n=this.tensors.map(s=>D(s,o));return xe(n,0)})}};function q0(r,e,t){let o=r.dtype;if(r.shape.length<1)throw new Error(`Tensor must be at least a vector, but saw shape: ${r.shape}`);if(r.dtype!==t)throw new Error(`Invalid data types; op elements ${r.dtype}, but list elements ${t}`);let n=r.shape.slice(1);Dt(n,e,"TensorList shape mismatch: ");let s=zt(r);return new ts(s,e,o)}function X0(r,e,t,o){return new ts([],r,e,o)}function j0(r,e,t,o){if(e.length!==r.shape[0])throw new Error(`Expected len(indices) == tensor.shape[0], but saw: ${e.length} vs. ${r.shape[0]}`);let n=Math.max(...e);if(o!=null&&o!==-1&&n>=o)throw new Error(`Max index must be < array size (${n}  vs. ${o})`);let s=new ts([],t,r.dtype,o),i=zt(r,0);return e.forEach((a,u)=>{s.setItem(a,i[u])}),s}function Y0(r,e,t){let o=0,n=e.map(c=>(o+=c,o));if(o!==r.shape[0])throw new Error(`Expected sum of lengths to be equal to
          tensor.shape[0], but sum of lengths is
        ${o}, and tensor's shape is: ${r.shape}`);let s=r.shape.slice(1),i=pc(s,t),a=o===0?0:r.size/o,u=H(()=>{let c=[];r=D(r,[1,o,a]);for(let p=0;p<e.length;++p){let f=[0,p===0?0:n[p-1],0],d=[1,e[p],a];c[p]=D(Q(r,f,d),i)}return r.dispose(),c}),l=new ts([],t,r.dtype,e.length);for(let c=0;c<u.length;c++)l.setItem(c,u[c]);return l}var Q0=async(r,e,t)=>{switch(r.op){case"If":case"StatelessIf":{let o=y("thenBranch",r,e,t),n=y("elseBranch",r,e,t),s=y("cond",r,e,t),i=y("args",r,e,t);return(await s.data())[0]?t.functionMap[o].executeFunctionAsync(i,t.tensorArrayMap,t.tensorListMap):t.functionMap[n].executeFunctionAsync(i,t.tensorArrayMap,t.tensorListMap)}case"While":case"StatelessWhile":{let o=y("body",r,e,t),n=y("cond",r,e,t),s=y("args",r,e,t),i=await t.functionMap[n].executeFunctionAsync(s,t.tensorArrayMap,t.tensorListMap),a=s.map(c=>c.id),u=await i[0].data();i.forEach(c=>{!c.kept&&a.indexOf(c.id)===-1&&c.dispose()});let l=s;for(;u[0];){let c=l;l=await t.functionMap[o].executeFunctionAsync(l,t.tensorArrayMap,t.tensorListMap);let p=l.map(f=>f.id);c.forEach(f=>{!f.kept&&a.indexOf(f.id)===-1&&p.indexOf(f.id)===-1&&f.dispose()});let m=await t.functionMap[n].executeFunctionAsync(l,t.tensorArrayMap,t.tensorListMap);u=await m[0].data(),m.forEach(f=>{!f.kept&&a.indexOf(f.id)===-1&&p.indexOf(f.id)===-1&&f.dispose()})}return l}case"LoopCond":{let o=y("pred",r,e,t);return[nr(o)]}case"Switch":{let o=y("pred",r,e,t),n=y("data",r,e,t);return n.kept||(n=nr(n)),(await o.data())[0]?[void 0,n]:[n,void 0]}case"Merge":{let o=r.inputNames.find(n=>Pe(n,e,t)!==void 0);if(o){let n=Pe(o,e,t);return[nr(n)]}return}case"Enter":{let o=y("frameName",r,e,t),n=y("tensor",r,e,t);return t.enterFrame(o),[nr(n)]}case"Exit":{let o=y("tensor",r,e,t);return t.exitFrame(),[nr(o)]}case"NextIteration":{let o=y("tensor",r,e,t);return t.nextIteration(),[nr(o)]}case"TensorArrayV3":{let o=y("size",r,e,t),n=y("dtype",r,e,t),s=y("elementShape",r,e,t),i=y("dynamicSize",r,e,t),a=y("clearAfterRead",r,e,t),u=y("identicalElementShapes",r,e,t),l=y("name",r,e,t),c=new mc(l,n,o,s,u,i,a);return t.addTensorArray(c),[c.idTensor,K(1)]}case"TensorArrayWriteV3":{let o=y("tensorArrayId",r,e,t),n=y("index",r,e,t),s=y("tensor",r,e,t),i=t.getTensorArray(o.id);return i.write(n,s),[i.idTensor]}case"TensorArrayReadV3":{let o=y("tensorArrayId",r,e,t),n=y("index",r,e,t);return[t.getTensorArray(o.id).read(n)]}case"TensorArrayGatherV3":{let o=y("tensorArrayId",r,e,t),n=y("indices",r,e,t),s=y("dtype",r,e,t);return[t.getTensorArray(o.id).gather(n,s)]}case"TensorArrayScatterV3":{let o=y("tensorArrayId",r,e,t),n=y("indices",r,e,t),s=y("tensor",r,e,t),i=t.getTensorArray(o.id);return i.scatter(n,s),[i.idTensor]}case"TensorArrayConcatV3":{let o=y("tensorArrayId",r,e,t),n=t.getTensorArray(o.id),s=y("dtype",r,e,t);return[n.concat(s)]}case"TensorArraySplitV3":{let o=y("tensorArrayId",r,e,t),n=y("tensor",r,e,t),s=y("lengths",r,e,t),i=t.getTensorArray(o.id);return i.split(s,n),[i.idTensor]}case"TensorArraySizeV3":{let o=y("tensorArrayId",r,e,t),n=t.getTensorArray(o.id);return[K(n.size(),"int32")]}case"TensorArrayCloseV3":{let o=y("tensorArrayId",r,e,t),n=t.getTensorArray(o.id);return n.clearAndClose(),[n.idTensor]}case"TensorListSetItem":{let o=y("tensorListId",r,e,t),n=y("index",r,e,t),s=y("tensor",r,e,t),i=t.getTensorList(o.id);return i.setItem(n,s),[i.idTensor]}case"TensorListGetItem":{let o=y("tensorListId",r,e,t),n=y("index",r,e,t),s=y("elementShape",r,e,t),i=y("elementDType",r,e,t);return[t.getTensorList(o.id).getItem(n,s,i)]}case"TensorListScatterV2":case"TensorListScatter":{let o=y("indices",r,e,t),n=y("tensor",r,e,t),s=y("elementShape",r,e,t),i=y("numElements",r,e,t),a=j0(n,o,s,i);return t.addTensorList(a),[a.idTensor]}case"TensorListReserve":case"EmptyTensorList":{let o=y("elementShape",r,e,t),n=y("elementDType",r,e,t),s;r.op==="TensorListReserve"?s="numElements":s="maxNumElements";let i=y(s,r,e,t),a=r.op==="TensorListReserve"?-1:i,u=X0(o,n,i,a);return t.addTensorList(u),[u.idTensor]}case"TensorListGather":{let o=y("tensorListId",r,e,t),n=y("indices",r,e,t),s=y("elementShape",r,e,t),i=y("elementDType",r,e,t);return[t.getTensorList(o.id).gather(n,i,s)]}case"TensorListStack":{let o=y("tensorListId",r,e,t),n=y("elementShape",r,e,t),s=y("elementDType",r,e,t),i=y("numElements",r,e,t);return[t.getTensorList(o.id).stack(n,s,i)]}case"TensorListFromTensor":{let o=y("tensor",r,e,t),n=y("elementShape",r,e,t),s=y("elementDType",r,e,t),i=q0(o,n,s);return t.addTensorList(i),[i.idTensor]}case"TensorListConcat":case"TensorListConcatV2":{let o=y("tensorListId",r,e,t),n=t.getTensorList(o.id),s=y("dtype",r,e,t),i=y("elementShape",r,e,t);return[n.concat(s,i)]}case"TensorListPushBack":{let o=y("tensorListId",r,e,t),n=y("tensor",r,e,t),s=t.getTensorList(o.id);return s.pushBack(n),[s.idTensor]}case"TensorListPopBack":{let o=y("tensorListId",r,e,t),n=y("elementShape",r,e,t),s=y("elementDType",r,e,t);return[t.getTensorList(o.id).popBack(n,s)]}case"TensorListSplit":{let o=y("tensor",r,e,t),n=y("elementShape",r,e,t),s=y("lengths",r,e,t),i=Y0(o,s,n);return t.addTensorList(i),[i.idTensor]}case"TensorListLength":{let o=y("tensorListId",r,e,t),n=t.getTensorList(o.id);return[K(n.size(),"int32")]}case"TensorListResize":{let o=y("tensorListId",r,e,t),n=y("size",r,e,t),i=t.getTensorList(o.id).resize(n);return t.addTensorList(i),[i.idTensor]}default:throw TypeError(`Node type ${r.op} is not implemented`)}};function Z0(r,e,t){let[o,n]=y("fusedOps",r,e,t),s=o==="biasadd",i=!s,a=n==="prelu",u=o==="fusedbatchnorm",l=y("numArgs",r,e,t);if(s){if(a&&l!==2)throw new Error("FusedConv2d and DepthwiseConv2d with BiasAdd and Prelu must have two extra arguments: bias and alpha.");if(!a&&s&&l!==1)throw new Error("FusedConv2d and DepthwiseConv2d with BiasAdd must have one extra argument: bias.")}if(u)throw new Error("FusedConv2d and DepthwiseConv2d with FusedBatchNorm is not supported");let c=y("strides",r,e,t),p=Js(r,e,t),m=y("dataFormat",r,e,t).toUpperCase(),f=y("dilations",r,e,t),[d,g]=y("args",r,e,t);i&&(g=d,d=void 0);let h=y("leakyreluAlpha",r,e,t);return{stride:c,pad:p,dataFormat:m,dilations:f,biasArg:d,preluArg:g,activationFunc:n,leakyreluAlpha:h}}var J0=(r,e,t,o=se)=>{switch(r.op){case"Conv1D":{let n=y("stride",r,e,t),s=y("pad",r,e,t),i=y("dataFormat",r,e,t).toUpperCase(),a=y("dilation",r,e,t);return[o.conv1d(y("x",r,e,t),y("filter",r,e,t),n,s,i,a)]}case"Conv2D":{let n=y("strides",r,e,t),s=Js(r,e,t),i=y("dataFormat",r,e,t).toUpperCase(),a=y("dilations",r,e,t);return[o.conv2d(y("x",r,e,t),y("filter",r,e,t),[n[1],n[2]],s,i,[a[1],a[2]])]}case"_FusedConv2D":{let{stride:n,pad:s,dataFormat:i,dilations:a,biasArg:u,preluArg:l,activationFunc:c,leakyreluAlpha:p}=Z0(r,e,t);return[o.fused.conv2d({x:y("x",r,e,t),filter:y("filter",r,e,t),strides:[n[1],n[2]],pad:s,dataFormat:i,dilations:[a[1],a[2]],bias:u,activation:c,preluActivationWeights:l,leakyreluAlpha:p})]}case"FusedDepthwiseConv2dNative":{let{stride:n,pad:s,dataFormat:i,dilations:a,biasArg:u,preluArg:l,activationFunc:c,leakyreluAlpha:p}=Z0(r,e,t);return[o.fused.depthwiseConv2d({x:y("x",r,e,t),filter:y("filter",r,e,t),strides:[n[1],n[2]],pad:s,dataFormat:i,dilations:[a[1],a[2]],bias:u,activation:c,preluActivationWeights:l,leakyreluAlpha:p})]}case"Conv2DBackpropInput":case"Conv2dTranspose":{let n=y("outputShape",r,e,t),s=y("strides",r,e,t),i=Js(r,e,t);return[o.conv2dTranspose(y("x",r,e,t),y("filter",r,e,t),n,[s[1],s[2]],i)]}case"DepthwiseConv2dNative":case"DepthwiseConv2d":{let n=y("strides",r,e,t),s=Js(r,e,t),i=y("dilations",r,e,t),a=y("dataFormat",r,e,t).toUpperCase();return[o.depthwiseConv2d(y("input",r,e,t),y("filter",r,e,t),[n[1],n[2]],s,a,[i[1],i[2]])]}case"Conv3D":{let n=y("strides",r,e,t),s=y("pad",r,e,t),i=y("dataFormat",r,e,t).toUpperCase(),a=y("dilations",r,e,t);return[o.conv3d(y("x",r,e,t),y("filter",r,e,t),[n[1],n[2],n[3]],s,i,[a[1],a[2],a[3]])]}case"AvgPool":{let n=y("strides",r,e,t),s=y("pad",r,e,t),i=y("kernelSize",r,e,t);return[o.avgPool(y("x",r,e,t),[i[1],i[2]],[n[1],n[2]],s)]}case"MaxPool":{let n=y("strides",r,e,t),s=y("pad",r,e,t),i=y("kernelSize",r,e,t);return[o.maxPool(y("x",r,e,t),[i[1],i[2]],[n[1],n[2]],s)]}case"MaxPoolWithArgmax":{let n=y("strides",r,e,t),s=y("pad",r,e,t),i=y("kernelSize",r,e,t),a=y("includeBatchInIndex",r,e,t),{result:u,indexes:l}=o.maxPoolWithArgmax(y("x",r,e,t),[i[1],i[2]],[n[1],n[2]],s,a);return[u,l]}case"AvgPool3D":{let n=y("strides",r,e,t),s=y("pad",r,e,t),i=y("kernelSize",r,e,t);return[o.avgPool3d(y("x",r,e,t),[i[1],i[2],i[3]],[n[1],n[2],n[3]],s)]}case"MaxPool3D":{let n=y("strides",r,e,t),s=y("pad",r,e,t),i=y("kernelSize",r,e,t);return[o.maxPool3d(y("x",r,e,t),[i[1],i[2],i[3]],[n[1],n[2],n[3]],s)]}case"Dilation2D":{let n=y("strides",r,e,t),s=y("pad",r,e,t),i=y("dilations",r,e,t),a=n[1],u=n[2],l=i[1],c=i[2];return[o.dilation2d(y("x",r,e,t),y("filter",r,e,t),[a,u],s,[l,c],"NHWC")]}default:throw TypeError(`Node type ${r.op} is not implemented`)}};var ew=(r,e,t,o=se)=>{switch(r.op){case"Fill":{let n=y("shape",r,e,t),s=y("dtype",r,e,t),i=y("value",r,e,t);return[o.fill(n,i,s)]}case"LinSpace":{let n=y("start",r,e,t),s=y("stop",r,e,t),i=y("num",r,e,t);return[o.linspace(n,s,i)]}case"Multinomial":{let n=y("logits",r,e,t),s=y("numSamples",r,e,t),i=y("seed",r,e,t);return[o.multinomial(n,s,i)]}case"OneHot":{let n=y("indices",r,e,t),s=y("depth",r,e,t),i=y("onValue",r,e,t),a=y("offValue",r,e,t),u=y("dtype",r,e,t);return[o.oneHot(n,s,i,a,u)]}case"Ones":return[o.ones(y("shape",r,e,t),y("dtype",r,e,t))];case"OnesLike":return[o.onesLike(y("x",r,e,t))];case"RandomStandardNormal":return[o.randomStandardNormal(y("shape",r,e,t),y("dtype",r,e,t),y("seed",r,e,t))];case"RandomUniform":return[o.randomUniform(y("shape",r,e,t),y("minval",r,e,t),y("maxval",r,e,t),y("dtype",r,e,t))];case"RandomUniformInt":return[o.randomUniformInt(y("shape",r,e,t),y("minval",r,e,t),y("maxval",r,e,t),y("seed",r,e,t))];case"Range":{let n=y("start",r,e,t),s=y("stop",r,e,t),i=y("step",r,e,t);return[o.range(n,s,i,y("dtype",r,e,t))]}case"TruncatedNormal":{let n=y("shape",r,e,t),s=y("mean",r,e,t),i=y("stdDev",r,e,t),a=y("seed",r,e,t);return[o.truncatedNormal(n,s,i,y("dtype",r,e,t),a)]}case"Zeros":return[o.zeros(y("shape",r,e,t),y("dtype",r,e,t))];case"ZerosLike":return[o.zerosLike(y("x",r,e,t))];default:throw TypeError(`Node type ${r.op} is not implemented`)}};function Hf(r,e,t){let o=y("boxes",r,e,t),n=y("scores",r,e,t),s=y("maxOutputSize",r,e,t),i=y("iouThreshold",r,e,t),a=y("scoreThreshold",r,e,t),u=y("softNmsSigma",r,e,t);return{boxes:o,scores:n,maxOutputSize:s,iouThreshold:i,scoreThreshold:a,softNmsSigma:u}}var tw=async(r,e,t,o,n=se)=>{switch(r.op){case"NonMaxSuppressionV5":{let{boxes:s,scores:i,maxOutputSize:a,iouThreshold:u,scoreThreshold:l,softNmsSigma:c}=Hf(r,e,t),p=await n.image.nonMaxSuppressionWithScoreAsync(s,i,a,u,l,c);return[p.selectedIndices,p.selectedScores]}case"NonMaxSuppressionV4":{let{boxes:s,scores:i,maxOutputSize:a,iouThreshold:u,scoreThreshold:l}=Hf(r,e,t),c=y("padToMaxOutputSize",r,e,t),p=await n.image.nonMaxSuppressionPaddedAsync(s,i,a,u,l,c);return[p.selectedIndices,p.validOutputs]}case"NonMaxSuppressionV3":case"NonMaxSuppressionV2":{let{boxes:s,scores:i,maxOutputSize:a,iouThreshold:u,scoreThreshold:l}=Hf(r,e,t);return[await n.image.nonMaxSuppressionAsync(s,i,a,u,l)]}case"Where":{let s=n.cast(y("condition",r,e,t),"bool"),i=[await n.whereAsync(s)];return s.dispose(),i}case"ListDiff":return n.setdiff1dAsync(y("x",r,e,t),y("y",r,e,t));default:throw TypeError(`Node type ${r.op} is not implemented`)}};var rw=(r,e,t,o=se)=>{switch(r.op){case"LowerBound":{let n=y("sortedSequence",r,e,t),s=y("values",r,e,t);return[o.lowerBound(n,s)]}case"TopKV2":{let n=y("x",r,e,t),s=y("k",r,e,t),i=y("sorted",r,e,t),a=o.topk(n,s,i);return[a.values,a.indices]}case"UpperBound":{let n=y("sortedSequence",r,e,t),s=y("values",r,e,t);return[o.upperBound(n,s)]}case"Unique":{let n=y("x",r,e,t),s=o.unique(n);return[s.values,s.indices]}case"UniqueV2":{let n=y("x",r,e,t),s=y("axis",r,e,t),i=o.unique(n,s);return[i.values,i.indices]}default:throw TypeError(`Node type ${r.op} is not implemented`)}};var ow=(r,e,t,o=se)=>{switch(r.op){case"Const":return e[r.name];case"PlaceholderWithDefault":let n=y("default",r,e,t);return[Pe(r.name,e,t)||n];case"Placeholder":return[Pe(r.name,e,t)];case"Identity":case"StopGradient":case"FakeQuantWithMinMaxVars":{let c=y("x",r,e,t);return[nr(c)]}case"IdentityN":return y("x",r,e,t).map(c=>nr(c));case"Snapshot":let s=y("x",r,e,t);return[nr(s)];case"Shape":return[o.tensor1d(y("x",r,e,t).shape,"int32")];case"ShapeN":return y("x",r,e,t).map(c=>o.tensor1d(c.shape));case"Size":return[o.scalar(y("x",r,e,t).size,"int32")];case"Rank":return[o.scalar(y("x",r,e,t).rank,"int32")];case"NoOp":return[o.scalar(1)];case"Print":let i=y("x",r,e,t),a=y("data",r,e,t),u=y("message",r,e,t),l=y("summarize",r,e,t);console.warn("The graph has a tf.print() operation,usually used for debugging, which slows down performance."),console.log(u);for(let c=0;c<a.length;c++)console.log(Array.prototype.slice.call(a[c].dataSync()).slice(0,l));return[i];default:throw TypeError(`Node type ${r.op} is not implemented`)}};var fc=class{get id(){return this.handle.id}constructor(e,t){this.keyDType=e,this.valueDType=t,this.handle=K(0),this.tensorMap=new Map,ft(this.handle)}clearAndClose(){this.tensorMap.forEach(e=>e.dispose()),this.tensorMap.clear(),this.handle.dispose()}size(){return this.tensorMap.size}tensorSize(){return K(this.size(),"int32")}async import(e,t){this.checkKeyAndValueTensor(e,t);let o=await e.data();return this.tensorMap.forEach(n=>n.dispose()),this.tensorMap.clear(),H(()=>{let n=zt(t),s=o.length,i=n.length;T.assert(s===i,()=>`The number of elements doesn't match, keys has ${s} elements, the values has ${i} elements.`);for(let a=0;a<s;a++){let u=o[a],l=n[a];ft(l),this.tensorMap.set(u,l)}return this.handle})}async find(e,t){this.checkKeyAndValueTensor(e,t);let o=await e.data();return H(()=>{let n=[];for(let s=0;s<o.length;s++){let i=o[s],a=this.findWithDefault(i,t);n.push(a)}return nt(n)})}findWithDefault(e,t){let o=this.tensorMap.get(e);return o??t}checkKeyAndValueTensor(e,t){if(e.dtype!==this.keyDType)throw new Error(`Expect key dtype ${this.keyDType}, but got ${e.dtype}`);if(t.dtype!==this.valueDType)throw new Error(`Expect value dtype ${this.valueDType}, but got ${t.dtype}`)}};var nw=async(r,e,t,o)=>{switch(r.op){case"HashTable":case"HashTableV2":{let n=o.getHashTableHandleByName(r.name);if(n!=null)return[n];{let s=y("keyDType",r,e,t),i=y("valueDType",r,e,t),a=new fc(s,i);return o.addHashTable(r.name,a),[a.handle]}}case"InitializeTable":case"InitializeTableV2":case"LookupTableImport":case"LookupTableImportV2":{let n=y("tableHandle",r,e,t,o),s=y("keys",r,e,t),i=y("values",r,e,t);return[await o.getHashTableById(n.id).import(s,i)]}case"LookupTableFind":case"LookupTableFindV2":{let n=y("tableHandle",r,e,t,o),s=y("keys",r,e,t),i=y("defaultValue",r,e,t);return[await o.getHashTableById(n.id).find(s,i)]}case"LookupTableSize":case"LookupTableSizeV2":{let n=y("tableHandle",r,e,t,o);return[o.getHashTableById(n.id).tensorSize()]}default:throw TypeError(`Node type ${r.op} is not implemented`)}};var sw=(r,e,t,o=se)=>{switch(r.op){case"ResizeBilinear":{let n=y("images",r,e,t),s=y("size",r,e,t),i=y("alignCorners",r,e,t),a=y("halfPixelCenters",r,e,t);return[o.image.resizeBilinear(n,[s[0],s[1]],i,a)]}case"ResizeNearestNeighbor":{let n=y("images",r,e,t),s=y("size",r,e,t),i=y("alignCorners",r,e,t),a=y("halfPixelCenters",r,e,t);return[o.image.resizeNearestNeighbor(n,[s[0],s[1]],i,a)]}case"CropAndResize":{let n=y("image",r,e,t),s=y("boxes",r,e,t),i=y("boxInd",r,e,t),a=y("cropSize",r,e,t),u=y("method",r,e,t),l=y("extrapolationValue",r,e,t);return[o.image.cropAndResize(n,s,i,a,u,l)]}case"ImageProjectiveTransformV3":{let n=y("images",r,e,t),s=y("transforms",r,e,t),i=y("outputShape",r,e,t),a=y("fillValue",r,e,t),u=y("interpolation",r,e,t),l=y("fillMode",r,e,t);return[o.image.transform(n,s,u.toLowerCase(),l.toLowerCase(),a,i)]}default:throw TypeError(`Node type ${r.op} is not implemented`)}};var iw=(r,e,t,o=se)=>{switch(r.op){case"Equal":return[o.equal(y("a",r,e,t),y("b",r,e,t))];case"NotEqual":return[o.notEqual(y("a",r,e,t),y("b",r,e,t))];case"Greater":return[o.greater(y("a",r,e,t),y("b",r,e,t))];case"GreaterEqual":return[o.greaterEqual(y("a",r,e,t),y("b",r,e,t))];case"Less":return[o.less(y("a",r,e,t),y("b",r,e,t))];case"LessEqual":return[o.lessEqual(y("a",r,e,t),y("b",r,e,t))];case"LogicalAnd":return[o.logicalAnd(y("a",r,e,t),y("b",r,e,t))];case"LogicalNot":return[o.logicalNot(y("a",r,e,t))];case"LogicalOr":return[o.logicalOr(y("a",r,e,t),y("b",r,e,t))];case"Select":case"SelectV2":return[o.where(y("condition",r,e,t),y("a",r,e,t),y("b",r,e,t))];case"BitwiseAnd":return[o.bitwiseAnd(y("a",r,e,t),y("b",r,e,t))];default:throw TypeError(`Node type ${r.op} is not implemented`)}};var aw=(r,e,t,o=se)=>{switch(r.op){case"BatchMatMul":case"BatchMatMulV2":case"MatMul":return[o.matMul(y("a",r,e,t),y("b",r,e,t),y("transposeA",r,e,t),y("transposeB",r,e,t))];case"Einsum":return[o.einsum(y("equation",r,e,t),...y("tensors",r,e,t))];case"Transpose":return[o.transpose(y("x",r,e,t),y("perm",r,e,t))];case"_FusedMatMul":let[n,s]=y("fusedOps",r,e,t),i=n==="biasadd",a=s==="prelu",u=y("numArgs",r,e,t),l=y("leakyreluAlpha",r,e,t);if(i){if(a&&u!==2)throw new Error("Fused MatMul with BiasAdd and Prelu must have two extra arguments: bias and alpha.");if(!a&&u!==1)throw new Error("Fused MatMul with BiasAdd must have one extra argument: bias.")}let[c,p]=y("args",r,e,t);return[o.fused.matMul({a:y("a",r,e,t),b:y("b",r,e,t),transposeA:y("transposeA",r,e,t),transposeB:y("transposeB",r,e,t),bias:c,activation:s,preluActivationWeights:p,leakyreluAlpha:l})];case"MatrixBandPart":return[o.linalg.bandPart(y("a",r,e,t),y("numLower",r,e,t),y("numUpper",r,e,t))];default:throw TypeError(`Node type ${r.op} is not implemented`)}};var uw=(r,e,t,o=se)=>{switch(r.op){case"EuclideanNorm":return[o.euclideanNorm(y("x",r,e,t),y("axis",r,e,t),y("keepDims",r,e,t))];case"FusedBatchNorm":case"FusedBatchNormV2":return[o.batchNorm(y("x",r,e,t),y("mean",r,e,t),y("variance",r,e,t),y("offset",r,e,t),y("scale",r,e,t),y("epsilon",r,e,t))];case"FusedBatchNormV3":return[o.batchNorm(y("x",r,e,t),y("mean",r,e,t),y("variance",r,e,t),y("offset",r,e,t),y("scale",r,e,t),y("epsilon",r,e,t))];case"LRN":return[o.localResponseNormalization(y("x",r,e,t),y("radius",r,e,t),y("bias",r,e,t),y("alpha",r,e,t),y("beta",r,e,t))];case"Softmax":return[o.softmax(y("x",r,e,t))];case"LogSoftmax":return[o.logSoftmax(y("x",r,e,t))];default:throw TypeError(`Node type ${r.op} is not implemented`)}};var lw=(r,e,t,o=se)=>{switch(r.op){case"RaggedGather":{let{outputNestedSplits:n,outputDenseValues:s}=o.raggedGather(y("paramsNestedSplits",r,e,t),y("paramsDenseValues",r,e,t),y("indices",r,e,t),y("outputRaggedRank",r,e,t));return n.concat(s)}case"RaggedRange":{let{rtNestedSplits:n,rtDenseValues:s}=o.raggedRange(y("starts",r,e,t),y("limits",r,e,t),y("splits",r,e,t));return[n,s]}case"RaggedTensorToTensor":return[o.raggedTensorToTensor(y("shape",r,e,t),y("values",r,e,t),y("defaultValue",r,e,t),y("rowPartitionTensors",r,e,t),y("rowPartitionTypes",r,e,t))];default:throw TypeError(`Node type ${r.op} is not implemented`)}};var cw=(r,e,t,o=se)=>{switch(r.op){case"Max":{let a=y("axis",r,e,t),u=y("keepDims",r,e,t);return[o.max(y("x",r,e,t),a,u)]}case"Mean":{let a=y("axis",r,e,t),u=y("keepDims",r,e,t);return[o.mean(y("x",r,e,t),a,u)]}case"Min":{let a=y("axis",r,e,t),u=y("keepDims",r,e,t);return[o.min(y("x",r,e,t),a,u)]}case"Sum":{let a=y("axis",r,e,t),u=y("keepDims",r,e,t);return[o.sum(y("x",r,e,t),a,u)]}case"All":{let a=y("axis",r,e,t),u=y("keepDims",r,e,t);return[o.all(y("x",r,e,t),a,u)]}case"Any":{let a=y("axis",r,e,t),u=y("keepDims",r,e,t);return[o.any(y("x",r,e,t),a,u)]}case"ArgMax":{let a=y("axis",r,e,t);return[o.argMax(y("x",r,e,t),a)]}case"ArgMin":{let a=y("axis",r,e,t);return[o.argMin(y("x",r,e,t),a)]}case"Prod":{let a=y("axis",r,e,t),u=y("keepDims",r,e,t);return[o.prod(y("x",r,e,t),a,u)]}case"Cumprod":{let a=y("axis",r,e,t),u=y("exclusive",r,e,t),l=y("reverse",r,e,t);return[o.cumprod(y("x",r,e,t),a,u,l)]}case"Cumsum":{let a=y("axis",r,e,t),u=y("exclusive",r,e,t),l=y("reverse",r,e,t);return[o.cumsum(y("x",r,e,t),a,u,l)]}case"Bincount":let n=y("x",r,e,t),s=y("weights",r,e,t),i=y("size",r,e,t);return[o.bincount(n,s,i)];case"DenseBincount":{let a=y("x",r,e,t),u=y("weights",r,e,t),l=y("size",r,e,t),c=y("binaryOutput",r,e,t);return[o.denseBincount(a,u,l,c)]}default:throw TypeError(`Node type ${r.op} is not implemented`)}};var pw=(r,e,t,o=se)=>{switch(r.op){case"ConcatV2":case"Concat":{let n=y("n",r,e,t),s=y("axis",r,e,t),i=y("tensors",r,e,t);return i=i.slice(0,n),[o.concat(i,s)]}case"Gather":{let n=y("x",r,e,t),s=y("indices",r,e,t);return[o.gather(n,o.cast(s,"int32"),0)]}case"GatherV2":{let n=y("axis",r,e,t),s=y("batchDims",r,e,t),i=y("x",r,e,t),a=y("indices",r,e,t);return[o.gather(i,o.cast(a,"int32"),n,s)]}case"Reverse":{let n=y("dims",r,e,t),s=[];for(let a=0;a<n.length;a++)n[a]&&s.push(a);let i=y("x",r,e,t);return[o.reverse(i,s)]}case"ReverseV2":{let n=y("axis",r,e,t),s=y("x",r,e,t);return[o.reverse(s,n)]}case"Slice":{let n=y("begin",r,e,t),s=y("size",r,e,t);return[o.slice(y("x",r,e,t),n,s)]}case"StridedSlice":{let n=y("begin",r,e,t),s=y("end",r,e,t),i=y("strides",r,e,t),a=y("beginMask",r,e,t),u=y("endMask",r,e,t),l=y("ellipsisMask",r,e,t),c=y("newAxisMask",r,e,t),p=y("shrinkAxisMask",r,e,t),m=y("x",r,e,t);return[o.stridedSlice(m,n,s,i,a,u,l,c,p)]}case"Pack":return H(()=>{let n=y("axis",r,e,t),s=y("tensors",r,e,t),i=s[0].shape,a=o.squeeze(s[0]).shape,u=s.map(l=>{let c=T.arraysEqual(l.shape,i);if(!c&&!T.arraysEqual(o.squeeze(l).shape,a))throw new Error("the input tensors shape does not match");return c?l:o.reshape(l,i)});return[o.stack(u,n)]});case"Unpack":{let n=y("axis",r,e,t),s=y("tensor",r,e,t);return o.unstack(s,n)}case"Tile":{let n=y("reps",r,e,t);return[o.tile(y("x",r,e,t),n)]}case"Split":case"SplitV":{let n=y("axis",r,e,t),s=y("numOrSizeSplits",r,e,t),i=y("x",r,e,t);return o.split(i,s,n)}case"ScatterNd":{let n=y("indices",r,e,t),s=y("values",r,e,t),i=y("shape",r,e,t);return[o.scatterND(n,s,i)]}case"GatherNd":{let n=y("x",r,e,t),s=y("indices",r,e,t);return[o.gatherND(n,s)]}case"SparseToDense":{let n=y("sparseIndices",r,e,t),s=y("outputShape",r,e,t),i=y("sparseValues",r,e,t),a=y("defaultValue",r,e,t);return[o.sparseToDense(n,i,s,i.dtype===a.dtype?a:o.cast(a,i.dtype))]}case"TensorScatterUpdate":{let n=y("indices",r,e,t),s=y("values",r,e,t),i=y("tensor",r,e,t);return[o.tensorScatterUpdate(i,n,s)]}default:throw TypeError(`Node type ${r.op} is not implemented`)}};var mw=(r,e,t,o=se)=>{switch(r.op){case"SparseFillEmptyRows":{let{outputIndices:n,outputValues:s,emptyRowIndicator:i,reverseIndexMap:a}=o.sparse.sparseFillEmptyRows(y("indices",r,e,t),y("values",r,e,t),y("denseShape",r,e,t),y("defaultValue",r,e,t));return[n,s,i,a]}case"SparseReshape":{let{outputIndices:n,outputShape:s}=o.sparse.sparseReshape(y("inputIndices",r,e,t),y("inputShape",r,e,t),y("newShape",r,e,t));return[n,s]}case"SparseSegmentMean":return[o.sparse.sparseSegmentMean(y("data",r,e,t),y("indices",r,e,t),y("segmentIds",r,e,t))];case"SparseSegmentSum":return[o.sparse.sparseSegmentSum(y("data",r,e,t),y("indices",r,e,t),y("segmentIds",r,e,t))];default:throw TypeError(`Node type ${r.op} is not implemented`)}};var fw=(r,e,t,o=se)=>{switch(r.op){case"FFT":return[o.fft(y("x",r,e,t))];case"IFFT":return[o.ifft(y("x",r,e,t))];case"RFFT":return[o.rfft(y("x",r,e,t))];case"IRFFT":return[o.irfft(y("x",r,e,t))];default:throw TypeError(`Node type ${r.op} is not implemented`)}};var dw=(r,e,t,o=se)=>{switch(r.op){case"StaticRegexReplace":return[o.string.staticRegexReplace(y("input",r,e,t),y("pattern",r,e,t),y("rewrite",r,e,t),y("replaceGlobal",r,e,t))];case"StringNGrams":{let{nGrams:n,nGramsSplits:s}=o.string.stringNGrams(y("data",r,e,t),y("dataSplits",r,e,t),y("separator",r,e,t),y("nGramWidths",r,e,t),y("leftPad",r,e,t),y("rightPad",r,e,t),y("padWidth",r,e,t),y("preserveShortSequences",r,e,t));return[n,s]}case"StringSplit":{let{indices:n,values:s,shape:i}=o.string.stringSplit(y("input",r,e,t),y("delimiter",r,e,t),y("skipEmpty",r,e,t));return[n,s,i]}case"StringToHashBucketFast":return[o.string.stringToHashBucketFast(y("input",r,e,t),y("numBuckets",r,e,t))];default:throw TypeError(`Node type ${r.op} is not implemented`)}};var hw=(r,e,t,o=se)=>{switch(r.op){case"Cast":return[o.cast(y("x",r,e,t),y("dtype",r,e,t))];case"ExpandDims":{let n=y("axis",r,e,t);return[o.expandDims(y("x",r,e,t),n)]}case"Squeeze":{let n=y("axis",r,e,t);return[o.squeeze(y("x",r,e,t),n)]}case"Reshape":return[o.reshape(y("x",r,e,t),y("shape",r,e,t))];case"EnsureShape":return[o.ensureShape(y("x",r,e,t),y("shape",r,e,t))];case"MirrorPad":return[o.mirrorPad(y("x",r,e,t),y("padding",r,e,t),y("mode",r,e,t))];case"PadV2":case"Pad":return[o.pad(y("x",r,e,t),y("padding",r,e,t),y("constantValue",r,e,t))];case"SpaceToBatchND":{let n=y("blockShape",r,e,t),s=y("paddings",r,e,t);return[o.spaceToBatchND(y("x",r,e,t),n,s)]}case"BatchToSpaceND":{let n=y("blockShape",r,e,t),s=y("crops",r,e,t);return[o.batchToSpaceND(y("x",r,e,t),n,s)]}case"DepthToSpace":{let n=y("blockSize",r,e,t),s=y("dataFormat",r,e,t).toUpperCase();return[o.depthToSpace(y("x",r,e,t),n,s)]}case"BroadcastTo":return[o.broadcastTo(y("x",r,e,t),y("shape",r,e,t))];case"BroadcastArgs":return[o.broadcastArgs(y("s0",r,e,t),y("s1",r,e,t))];default:throw TypeError(`Node type ${r.op} is not implemented`)}};function Kf(r,e,t,o,n=H){let s=((i,a,u)=>{switch(i.category){case"arithmetic":return n(()=>W0(i,a,u));case"basic_math":return n(()=>H0(i,a,u));case"control":return Q0(i,a,u);case"convolution":return n(()=>J0(i,a,u));case"creation":return n(()=>ew(i,a,u));case"dynamic":return tw(i,a,u);case"evaluation":return n(()=>rw(i,a,u));case"image":return n(()=>sw(i,a,u));case"graph":return n(()=>ow(i,a,u));case"logical":return n(()=>iw(i,a,u));case"matrices":return n(()=>aw(i,a,u));case"normalization":return n(()=>uw(i,a,u));case"ragged":return n(()=>lw(i,a,u));case"reduction":return n(()=>cw(i,a,u));case"slice_join":return n(()=>pw(i,a,u));case"sparse":return n(()=>mw(i,a,u));case"spectral":return n(()=>fw(i,a,u));case"string":return n(()=>dw(i,a,u));case"transformation":return n(()=>hw(i,a,u));case"hash_table":return nw(i,a,u,o);case"custom":let l=Zl(i.op);if(l&&l.customExecutor)return l.customExecutor(new cc(i,a,u));throw TypeError(`Custom op ${i.op} is not registered.`);default:throw TypeError(`Unknown op '${i.op}'. File an issue at https://github.com/tensorflow/tfjs/issues so we can add it, or register a custom execution with tf.registerOp()`)}})(r,e,t);return T.isPromise(s)?s.then(i=>[].concat(i)):[].concat(s)}var ti=class{constructor(e={},t={},o={},n={},s){this.weightMap=e,this.tensorArrayMap=t,this.tensorListMap=o,this.functionMap=n,this.parseNodeNameCache=s,this.rootContext={id:0,frameName:"",iterationId:0},this.contexts=[this.rootContext],this.lastId=0,this.generateCurrentContextIds()}newFrame(e,t){return{id:e,frameName:t,iterationId:0}}set currentContext(e){this.contexts!==e&&(this.contexts=e,this.generateCurrentContextIds())}get currentContext(){return this.contexts}get currentContextId(){return this._currentContextIds[0]}get currentContextIds(){return this._currentContextIds}generateCurrentContextIds(){let e=[];for(let t=0;t<this.contexts.length-1;t++){let o=this.contexts.slice(0,this.contexts.length-t);e.push(this.contextIdforContexts(o))}e.push(""),this._currentContextIds=e}contextIdforContexts(e){return e?e.map(t=>t.id===0&&t.iterationId===0?"":`${t.frameName}-${t.iterationId}`).join("/"):""}enterFrame(e){this.contexts&&(this.lastId++,this.contexts=this.contexts.slice(),this.contexts.push(this.newFrame(this.lastId,e)),this._currentContextIds.unshift(this.contextIdforContexts(this.contexts)))}exitFrame(){if(this.contexts&&this.contexts.length>1)this.contexts=this.contexts.slice(),this.contexts.splice(-1),this.currentContextIds.shift();else throw new Error("Cannot exit frame, the context is empty")}nextIteration(){if(this.contexts&&this.contexts.length>0){this.contexts=this.contexts.slice(),this.lastId++;let e=Object.assign({},this.contexts[this.contexts.length-1]);e.iterationId+=1,e.id=this.lastId,this.contexts.splice(-1,1,e),this._currentContextIds.splice(0,1,this.contextIdforContexts(this.contexts))}else throw new Error("Cannot increase frame iteration, the context is empty")}getWeight(e){return this.weightMap[e]}addTensorArray(e){this.tensorArrayMap[e.id]=e}getTensorArray(e){return this.tensorArrayMap[e]}addTensorList(e){this.tensorListMap[e.id]=e}getTensorList(e){return this.tensorListMap[e]}dispose(e){for(let t in this.tensorArrayMap)this.tensorArrayMap[t].clearAndClose(e);for(let t in this.tensorListMap)this.tensorListMap[t].clearAndClose(e)}};function qf(r,e,t,o){let n=new Set,s=[],i=null,a=null,u=new Set,l=new Set(Object.keys(r).map(m=>it(m)[0]));o=o||[];let c=new Set(o.map(m=>it(m.name)[0])),p=[...e];for(;p.length>0;){let m=p.pop();if((ao(m)||MO(m)||VO(m))&&i==null&&(i=m,a=i.children.map(f=>f.name).filter(f=>n.has(f))),n.add(m.name),t[m.name]==null&&!l.has(m.name)&&!c.has(m.name)){if(m.inputs.length===0){s.push(m.name);continue}m.inputs.forEach(f=>{u.has(f.name)||(u.add(f.name),p.push(f))})}}return{inputs:r,outputs:e,usedNodes:n,missingInputs:s,dynamicNode:i,syncInputs:a}}function gw(r,e){let{usedNodes:t,inputs:o}=e,n=Object.keys(o).map(h=>it(h)[0]).map(h=>r.nodes[h]),s=r.initNodes||[],i=h=>t.has(typeof h=="string"?h:h.name);function a(h){return[...new Map(h.map(x=>[x.name,x])).values()]}let u=a([...n,...r.weights,...s]).filter(i),l=a([...u,...Object.values(r.nodes)]).filter(i),c=new Map(l.map(h=>[h.name,h])),p={};for(let h of l){p[h.name]=p[h.name]||0;for(let x of h.children)i(x)||(p[x.name]=Number.POSITIVE_INFINITY),p[x.name]=(p[x.name]||0)+1}let m=Object.entries(p).filter(([,h])=>h===0).map(([h])=>h),f=[...m];for(;m.length>0;){let h=m.pop(),x=c.get(h);for(let v of x.children.filter(i))--p[v.name]===0&&(f.push(v.name),m.push(v.name))}let d=f.map(h=>c.get(h)),g=OO(d,u);return FO(g,u),g}function OO(r,e){let t=new Map(r.map(i=>[i.name,i])),o=e.map(i=>i.name),n=new Set(o);for(;o.length>0;){let i=o.pop(),a=t.get(i);for(let u of a.children)!t.has(u.name)||n.has(u.name)||(n.add(u.name),o.push(u.name))}return r.filter(i=>n.has(i.name))}var rs=class extends Error{constructor(e){super(`NodesExecutionOrderError: ${e}`)}};function FO(r,e){let t=new Map(r.map((a,u)=>[a.name,u])),o=new Set(e.map(a=>a.name)),n=a=>o.has(typeof a=="string"?a:a.name),s=new Set(r.map(a=>a.name)),i=a=>s.has(typeof a=="string"?a:a.name);for(let a of r){for(let u of a.children.filter(i)){if(!t.has(u.name))throw new rs(`Child ${u.name} of node ${a.name} is unreachable.`);if(t.get(a.name)>t.get(u.name))throw new rs(`Node ${a.name} is scheduled to run after its child ${u.name}.`)}if(!n(a))for(let u of a.inputs){if(!t.has(u.name))throw new rs(`Input ${u.name} of node ${a.name} is unreachable.`);if(t.get(u.name)>t.get(a.name))throw new rs(`Node ${a.name} is scheduled to run before its input ${u.name}.`)}}}function xw(r){let e=new Map(r.map((a,u)=>[a.name,u])),t=Number.MAX_SAFE_INTEGER,o=r.map((a,u)=>ao(a)?t:u),n=a=>{let u=o[e.get(a.name)];return u??-1},s=r.map((a,u)=>a.children.map(n).reduce((l,c)=>Math.max(l,c),o[u])),i=new Map;for(let a=0;a<r.length;++a){let u=s[a];if(u===t)continue;let l=r[a],c=r[u];i.has(c.name)||i.set(c.name,[]),i.get(c.name).push(l)}return i}var PO=new Set(["Switch","Merge","Enter","Exit","NextIteration","StatelessIf","StatelessWhile","if","While"]),LO=new Set(["NonMaxSuppressionV2","NonMaxSuppressionV3","NonMaxSuppressionV5","Where"]),BO=new Set(["HashTable","HashTableV2","LookupTableImport","LookupTableImportV2","LookupTableFind","LookupTableFindV2","LookupTableSize","LookupTableSizeV2"]);function ao(r){return PO.has(r.op)}function MO(r){return LO.has(r.op)}function VO(r){return BO.has(r.op)}var ri=class r{get weightIds(){return this.parent?this.parent.weightIds:this._weightIds}get functionExecutorMap(){return this.parent?this.parent.functionExecutorMap:this._functionExecutorMap}get weightMap(){return this.parent?this.parent.weightMap:this._weightMap}set weightMap(e){let t=Object.keys(e).map(o=>e[o].map(n=>n.id));this._weightIds=[].concat(...t),this._weightMap=e}set resourceManager(e){this._resourceManager=e}get inputs(){return this._inputs.map(e=>({name:e.name,shape:e.attrParams.shape?e.attrParams.shape.value:void 0,dtype:e.attrParams.dtype?e.attrParams.dtype.value:void 0}))}get outputs(){return this._outputs.map(e=>({name:e.name,shape:e.attrParams.shape?e.attrParams.shape.value:void 0,dtype:e.attrParams.dtype?e.attrParams.dtype.value:void 0}))}get inputNodes(){return this._inputs.map(e=>e.signatureKey||e.name)}get outputNodes(){return this._outputs.map(e=>{let t=e.signatureKey||e.name;return e.defaultOutput?`${t}:${e.defaultOutput}`:t})}get functions(){return Object.keys(this._functions).reduce((e,t)=>(e[t]=this._functions[t].signature,e),{})}constructor(e,t){this.graph=e,this.parent=t,this.compiledMap=new Map,this.parseNodeNameCache=new Map,this._weightMap={},this.SEPARATOR=",",this._functions={},this._functionExecutorMap={},this.keepIntermediateTensors=!1,this._outputs=e.outputs,this._inputs=e.inputs,this._initNodes=e.initNodes,this._signature=e.signature,this._functions=e.functions,e.functions!=null&&Object.keys(e.functions).forEach(o=>{this._functionExecutorMap[o]=new r(e.functions[o],this)})}getCompilationKey(e,t){let o=e.map(s=>s.name).sort(),n=t.map(s=>s.name).sort();return o.join(this.SEPARATOR)+"--"+n.join(this.SEPARATOR)}compile(e,t){let o=qf(e,t,this.weightMap,this._initNodes),{missingInputs:n,dynamicNode:s,syncInputs:i}=o;if(s!=null)throw new Error(`This execution contains the node '${s.name}', which has the dynamic op '${s.op}'. Please use model.executeAsync() instead. Alternatively, to avoid the dynamic ops, specify the inputs [${i}]`);if(n.length>0){let l=t.map(p=>p.name),c=Object.keys(e);throw new Error(`Cannot compute the outputs [${l}] from the provided inputs [${c}]. Missing the following inputs: [${n}]`)}let a=gw(this.graph,o),u=xw(a);return{orderedNodes:a,nodeLiveUntilMap:u}}cloneAndKeepTensor(e){if(e==null)return null;let t=e.clone();return ft(t),t}cloneTensorList(e){return e?e.map(o=>this.cloneAndKeepTensor(o)):null}cloneTensorMap(e){return Object.fromEntries(Object.entries(e).map(([t,o])=>[t,this.cloneTensorList(o)]))}execute(e,t){this.disposeIntermediateTensors(),e=this.mapInputs(e);let o=Object.keys(e).sort();this.checkInputs(e),this.checkInputShapeAndType(e),t=this.mapOutputs(t),this.checkOutputs(t);let n=o.map(m=>this.graph.nodes[it(m)[0]]),s=t.map(m=>it(m)[0]),i=new Set(s),a=s.map(m=>this.graph.nodes[m]);a.length===0&&(a=this._outputs);let u=this.getCompilationKey(n,a),l=this.compiledMap.get(u);l==null&&(l=this.compile(e,a),this.compiledMap.set(u,l));try{this.keepIntermediateTensors=$().getBool("KEEP_INTERMEDIATE_TENSORS")}catch(m){this.keepIntermediateTensors=!1,console.warn(m.message)}let c={},p={};return H(()=>{let m=new ti(this.weightMap,c,p,this.functionExecutorMap,this.parseNodeNameCache),f=Object.assign({},this.weightMap);this.keepIntermediateTensors&&(this.clonedTensorsMap=this.cloneTensorMap(this.weightMap)),Object.keys(e).forEach(x=>{let[v,N]=it(x,m),E=[];E[N]=e[x],f[v]=E,this.keepIntermediateTensors&&(this.clonedTensorsMap[v]=this.cloneTensorList(E))});let d=this.getFrozenTensorIds(f),{orderedNodes:g,nodeLiveUntilMap:h}=l;for(let x of g){if(f[x.name])continue;let v=Kf(x,f,m,this._resourceManager);if(T.isPromise(v))throw new Error(`The execution of the op '${x.op}' returned a promise. Please use model.executeAsync() instead.`);f[x.name]=v,this.keepIntermediateTensors&&(this.clonedTensorsMap[x.name]=this.cloneTensorList(v)),this.checkTensorForDisposalWithNodeLiveUntilInfo(x,f,m,d,i,h.get(x.name))}return this.parent==null&&m.dispose(d),t.map(x=>Pe(x,f,m))})}getFrozenTensorIds(e){let t=[].concat.apply([],Object.keys(e).map(o=>e[o]).map(o=>o.map(n=>n.id)));return new Set(t)}checkTensorForDisposal(e,t,o,n,s,i,a){if(!(ao(t)||i.has(e))){for(let u of o[e])u!=null&&(a[u.id]=(a[u.id]||0)+t.children.length);for(let u of t.inputs){if(ao(u))continue;let l=Cf(u.name,o,n);if(l!=null)for(let c of l){if(!c||c.kept||s.has(c.id))continue;let p=a[c.id];p===1?(c.dispose(),delete a[c.id]):p!=null&&a[c.id]--}}}}checkTensorForDisposalWithNodeLiveUntilInfo(e,t,o,n,s,i){function a(u){return ao(u)||s.has(u.name)}if(!(ao(e)||i==null))for(let u of i){if(a(u))continue;let l=Cf(u.name,t,o);for(let c of l)!c||c.kept||n.has(c.id)||c.dispose()}}async executeAsync(e,t){return this._executeAsync(e,t)}disposeIntermediateTensors(){this.clonedTensorsMap&&(Object.values(this.clonedTensorsMap).forEach(e=>{for(let t of e)t&&!t.isDisposed&&t.dispose()}),this.clonedTensorsMap=null)}getIntermediateTensors(){return this.clonedTensorsMap}async _executeAsync(e,t,o=!1,n={},s={}){this.disposeIntermediateTensors(),o||(e=this.mapInputs(e),this.checkInputs(e),this.checkInputShapeAndType(e),t=this.mapOutputs(t),this.checkOutputs(t));try{this.keepIntermediateTensors=$().getBool("KEEP_INTERMEDIATE_TENSORS")}catch(m){this.keepIntermediateTensors=!1,console.warn(m.message)}let i=new ti(this.weightMap,n,s,this.functionExecutorMap,this.parseNodeNameCache);this.keepIntermediateTensors&&(this.clonedTensorsMap=this.cloneTensorMap(this.weightMap));let a=await this.executeWithControlFlow(e,i,t,o),u=t.map(m=>Pe(m,a,i)),l=u.map(m=>m.id),c=Object.keys(e).map(m=>e[m].id),p=new Set([...l,...c,...this.weightIds]);return Object.values(a).forEach(m=>{m.forEach(f=>{f&&!f.isDisposed&&!p.has(f.id)&&f.dispose()})}),this.parent==null&&i.dispose(p),u}async executeFunctionAsync(e,t,o){let n=e.reduce((s,i,a)=>(s[this.inputs[a].name]=i,s),{});return this._executeAsync(n,this.outputNodes,!0,t,o)}async executeWithControlFlow(e,t,o,n){let s=Object.keys(e),i=s.map(E=>this.graph.nodes[it(E)[0]]),a=o.map(E=>it(E)[0]),u=new Set(a),l=a.map(E=>this.graph.nodes[E]);l.length===0&&(l=this._outputs);let{usedNodes:c,missingInputs:p,dynamicNode:m,syncInputs:f}=qf(e,l,this.weightMap,this._initNodes),d=[...i,...this.graph.weights,...this._initNodes||[]].map(E=>({node:E,contexts:t.currentContext})),g=Object.assign({},this.weightMap);Object.keys(e).forEach(E=>{let[k,R]=it(E),A=[];A[R]=e[E],g[k]=A});let h={},x=this.getFrozenTensorIds(g),v={};for(;d.length>0;){let E=this.processStack(i,d,t,g,v,x,u,h,c);await Promise.all(E)}m==null&&!n&&console.warn("This model execution did not contain any nodes with control flow or dynamic output shapes. You can use model.execute() instead.");let N=l.filter(E=>!ao(E)&&!Pe(E.name,g,t)).map(E=>E.name);if(N.length>0){let E="";throw m!=null&&(E=`Alternatively, to avoid the dynamic ops, use model.execute() and specify the inputs [${f}]`),new Error(`Cannot compute the outputs [${N}] from the provided inputs [${s}]. Consider providing the following inputs: [${p}]. ${E}`)}return g}processStack(e,t,o,n,s,i,a,u,l){let c=[];for(;t.length>0;){let p=t.pop();o.currentContext=p.contexts;let m="";if(p.node.op==="Enter"&&y("isConstant",p.node,n,o)&&([m]=or(p.node.name,o)),n[p.node.name]==null){let f=Kf(p.node,n,o,this._resourceManager);m||([m]=or(p.node.name,o));let d=o.currentContext;T.isPromise(f)?c.push(f.then(g=>(n[m]=g,this.keepIntermediateTensors&&(this.clonedTensorsMap[m]=this.cloneTensorList(g)),o.currentContext=d,this.checkTensorForDisposal(m,p.node,n,o,i,a,u),this.processChildNodes(p.node,t,o,n,s,l),g))):(n[m]=f,this.keepIntermediateTensors&&(this.clonedTensorsMap[m]=this.cloneTensorList(f)),this.checkTensorForDisposal(m,p.node,n,o,i,a,u),this.processChildNodes(p.node,t,o,n,s,l))}else this.processChildNodes(p.node,t,o,n,s,l)}return c}processChildNodes(e,t,o,n,s,i){e.children.forEach(a=>{let[u]=or(a.name,o);s[u]||!i.has(a.name)||(a.op==="Merge"?a.inputNames.some(l=>!!Pe(l,n,o))&&(s[u]=!0,t.push({contexts:o.currentContext,node:a})):a.inputNames.every(l=>!!Pe(l,n,o))&&(s[u]=!0,t.push({contexts:o.currentContext,node:a})))})}dispose(){Object.keys(this.weightMap).forEach(e=>this.weightMap[e].forEach(t=>t.dispose()))}checkInputShapeAndType(e){Object.keys(e).forEach(t=>{let o=e[t],[n]=it(t),s=this.graph.nodes[n];if(s.attrParams.shape&&s.attrParams.shape.value){let i=s.attrParams.shape.value,a=i.length===o.shape.length&&o.shape.every((u,l)=>i[l]===-1||i[l]===u);T.assert(a,()=>`The shape of dict['${s.name}'] provided in model.execute(dict) must be [${i}], but was [${o.shape}]`)}s.attrParams.dtype&&s.attrParams.dtype.value&&T.assert(o.dtype===s.attrParams.dtype.value,()=>`The dtype of dict['${s.name}'] provided in model.execute(dict) must be ${s.attrParams.dtype.value}, but was ${o.dtype}`)})}mapInputs(e){var t,o;let n={};for(let s in e){let i=(o=(t=this._signature)===null||t===void 0?void 0:t.inputs)===null||o===void 0?void 0:o[s];i!=null?n[i.name]=e[s]:n[s]=e[s]}return n}checkInputs(e){let t=Object.keys(e).filter(o=>{let[n]=it(o);return this.graph.nodes[n]==null});if(t.length>0)throw new Error(`The dict provided in model.execute(dict) has keys: [${t}] that are not part of graph`)}mapOutputs(e){return e.map(t=>{var o,n;let s=(n=(o=this._signature)===null||o===void 0?void 0:o.outputs)===null||n===void 0?void 0:n[t];return s!=null?s.name:t},{})}checkOutputs(e){e.forEach(t=>{let[o]=it(t);if(!this.graph.nodes[o])throw new Error(`The output '${t}' is not found in the graph`)})}};var dc=class{constructor(e={},t={}){this.hashTableNameToHandle=e,this.hashTableMap=t}addHashTable(e,t){this.hashTableNameToHandle[e]=t.handle,this.hashTableMap[t.id]=t}getHashTableHandleByName(e){return this.hashTableNameToHandle[e]}getHashTableById(e){return this.hashTableMap[e]}dispose(){for(let e in this.hashTableMap)this.hashTableMap[e].clearAndClose(),delete this.hashTableMap[e];for(let e in this.hashTableNameToHandle)this.hashTableNameToHandle[e].dispose(),delete this.hashTableNameToHandle[e]}};var UO="?tfjs-format=file",GO="model.json",hc=class{get modelVersion(){return this.version}get inputNodes(){return this.executor.inputNodes}get outputNodes(){return this.executor.outputNodes}get inputs(){return this.executor.inputs}get outputs(){return this.executor.outputs}get weights(){return this.executor.weightMap}get metadata(){return this.artifacts.userDefinedMetadata}get modelSignature(){return this.signature}get modelStructuredOutputKeys(){return this.structuredOutputKeys}constructor(e,t={},o=Zs){this.modelUrl=e,this.loadOptions=t,this.version="n/a",this.io=o,t==null&&(this.loadOptions={}),this.resourceManager=new dc}findIOHandler(){let e=this.modelUrl;if(e.load!=null)this.handler=e;else if(this.loadOptions.requestInit!=null)this.handler=this.io.browserHTTPRequest(e,this.loadOptions);else{let t=this.io.getLoadHandlers(e,this.loadOptions);if(t.length===0)t.push(this.io.browserHTTPRequest(e,this.loadOptions));else if(t.length>1)throw new Error(`Found more than one (${t.length}) load handlers for URL '${[e]}'`);this.handler=t[0]}}load(){if(this.findIOHandler(),this.handler.load==null)throw new Error("Cannot proceed with model loading because the IOHandler provided does not have the `load` method implemented.");let e=this.handler.load();return T.isPromise(e)?e.then(t=>t.getWeightStream==null?this.loadSync(t):this.loadStreaming(t)):this.loadSync(e)}loadSync(e){let t=this.io.decodeWeights(e.weightData,e.weightSpecs);return this.loadWithWeightMap(e,t)}async loadStreaming(e){if(e.getWeightStream==null)throw new Error("Model artifacts missing streamWeights function");let t=await Mu(e.getWeightStream(),e.weightSpecs);return this.loadWithWeightMap(e,t)}loadWithWeightMap(e,t){this.artifacts=e;let o=this.artifacts.modelTopology,n=this.artifacts.signature;if(this.artifacts.userDefinedMetadata!=null){let s=this.artifacts.userDefinedMetadata;s.signature!=null&&(n=s.signature),s.structuredOutputKeys!=null&&(this.structuredOutputKeys=s.structuredOutputKeys)}if(this.signature=n,this.version=`${o.versions.producer}.${o.versions.minConsumer}`,this.executor=new ri(ei.Instance.transformGraph(o,this.signature)),this.executor.weightMap=this.convertTensorMapToTensorsMap(t),this.executor.resourceManager=this.resourceManager,e.modelInitializer!=null&&e.modelInitializer.node!=null){let s=ei.Instance.transformGraph(e.modelInitializer);this.initializer=new ri(s),this.initializer.weightMap=this.executor.weightMap,this.initializer.resourceManager=this.resourceManager,this.initializerSignature=e.initializerSignature}return!0}async save(e,t){if(typeof e=="string"){let o=this.io.getSaveHandlers(e);if(o.length===0)throw new Error(`Cannot find any save handlers for URL '${e}'`);if(o.length>1)throw new Error(`Found more than one (${o.length}) save handlers for URL '${e}'`);e=o[0]}if(e.save==null)throw new Error("GraphModel.save() cannot proceed because the IOHandler provided does not have the `save` attribute defined.");return e.save(this.artifacts)}addStructuredOutputNames(e){if(this.structuredOutputKeys){let t=e instanceof de?[e]:e,o={};return t.forEach((n,s)=>o[this.structuredOutputKeys[s]]=n),o}return e}predict(e,t){let o=this.execute(e,this.outputNodes);return this.addStructuredOutputNames(o)}async predictAsync(e,t){let o=await this.executeAsync(e,this.outputNodes);return this.addStructuredOutputNames(o)}normalizeInputs(e){var t;if(!(e instanceof de)&&!Array.isArray(e)){let s=(t=this.signature)===null||t===void 0?void 0:t.inputs;if(s!=null)for(let i in s){let a=s[i];a.resourceId!=null&&(e[i]=this.resourceIdToCapturedInput[a.resourceId])}return e}e=Array.isArray(e)?e:[e];let o=Object.keys(this.resourceIdToCapturedInput).length;if(e.length+o!==this.inputNodes.length)throw new Error(`Input tensor count mismatch, the graph model has ${this.inputNodes.length-o} non-resource placeholders, while there are ${e.length} input tensors provided.`);let n=0;return this.inputNodes.reduce((s,i)=>{var a,u,l;let c=(l=(u=(a=this.signature)===null||a===void 0?void 0:a.inputs)===null||u===void 0?void 0:u[i])===null||l===void 0?void 0:l.resourceId;return c!=null?s[i]=this.resourceIdToCapturedInput[c]:s[i]=e[n++],s},{})}normalizeOutputs(e){return e=e||this.outputNodes,Array.isArray(e)?e:[e]}executeInitializerGraph(){return this.initializer==null?[]:this.initializerSignature==null?this.initializer.execute({},[]):this.initializer.execute({},Object.keys(this.initializerSignature.outputs))}async executeInitializerGraphAsync(){return this.initializer==null?[]:this.initializerSignature==null?this.initializer.executeAsync({},[]):this.initializer.executeAsync({},Object.keys(this.initializerSignature.outputs))}setResourceIdToCapturedInput(e){if(this.resourceIdToCapturedInput={},this.initializerSignature){let t=this.initializerSignature.outputs,o=Object.keys(t);for(let n=0;n<o.length;n++){let s=o[n],i=t[s];this.resourceIdToCapturedInput[i.resourceId]=e[n]}}}execute(e,t){this.resourceIdToCapturedInput==null&&this.setResourceIdToCapturedInput(this.executeInitializerGraph()),e=this.normalizeInputs(e),t=this.normalizeOutputs(t);let o=this.executor.execute(e,t);return o.length>1?o:o[0]}async executeAsync(e,t){this.resourceIdToCapturedInput==null&&this.setResourceIdToCapturedInput(await this.executeInitializerGraphAsync()),e=this.normalizeInputs(e),t=this.normalizeOutputs(t);let o=await this.executor.executeAsync(e,t);return o.length>1?o:o[0]}getIntermediateTensors(){return this.executor.getIntermediateTensors()}disposeIntermediateTensors(){this.executor.disposeIntermediateTensors()}convertTensorMapToTensorsMap(e){return Object.keys(e).reduce((t,o)=>(t[o]=[e[o]],t),{})}dispose(){this.executor.dispose(),this.initializer&&(this.initializer.dispose(),this.resourceIdToCapturedInput&&ne(this.resourceIdToCapturedInput)),this.resourceManager.dispose()}};async function uo(r,e={},t=Zs){if(r==null)throw new Error("modelUrl in loadGraphModel() cannot be null. Please provide a url or an IOHandler that loads the model");e==null&&(e={}),e.fromTFHub&&typeof r=="string"&&(r=zO(r));let o=new hc(r,e,t);return await o.load(),o}function zO(r){return r.endsWith("/")||(r=r+"/"),`${r}${GO}${UO}`}var co=Ci(bw());var Qw=function(r,e){return(Qw=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,o){t.__proto__=o}||function(t,o){for(var n in o)Object.prototype.hasOwnProperty.call(o,n)&&(t[n]=o[n])})(r,e)};function Zw(r,e){if(typeof e!="function"&&e!==null)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function t(){this.constructor=r}Qw(r,e),r.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}var ve=function(){return(ve=Object.assign||function(r){for(var e,t=1,o=arguments.length;t<o;t++)for(var n in e=arguments[t])Object.prototype.hasOwnProperty.call(e,n)&&(r[n]=e[n]);return r}).apply(this,arguments)};function ce(r,e,t,o){return new(t||(t=Promise))((function(n,s){function i(l){try{u(o.next(l))}catch(c){s(c)}}function a(l){try{u(o.throw(l))}catch(c){s(c)}}function u(l){var c;l.done?n(l.value):(c=l.value,c instanceof t?c:new t((function(p){p(c)}))).then(i,a)}u((o=o.apply(r,e||[])).next())}))}function pe(r,e){var t,o,n,s,i={label:0,sent:function(){if(1&n[0])throw n[1];return n[1]},trys:[],ops:[]};return s={next:a(0),throw:a(1),return:a(2)},typeof Symbol=="function"&&(s[Symbol.iterator]=function(){return this}),s;function a(u){return function(l){return(function(c){if(t)throw new TypeError("Generator is already executing.");for(;i;)try{if(t=1,o&&(n=2&c[0]?o.return:c[0]?o.throw||((n=o.return)&&n.call(o),0):o.next)&&!(n=n.call(o,c[1])).done)return n;switch(o=0,n&&(c=[2&c[0],n.value]),c[0]){case 0:case 1:n=c;break;case 4:return i.label++,{value:c[1],done:!1};case 5:i.label++,o=c[1],c=[0];continue;case 7:c=i.ops.pop(),i.trys.pop();continue;default:if(n=i.trys,!((n=n.length>0&&n[n.length-1])||c[0]!==6&&c[0]!==2)){i=0;continue}if(c[0]===3&&(!n||c[1]>n[0]&&c[1]<n[3])){i.label=c[1];break}if(c[0]===6&&i.label<n[1]){i.label=n[1],n=c;break}if(n&&i.label<n[2]){i.label=n[2],i.ops.push(c);break}n[2]&&i.ops.pop(),i.trys.pop();continue}c=e.call(r,i)}catch(p){c=[6,p],o=0}finally{t=n=0}if(5&c[0])throw c[1];return{value:c[0]?c[1]:void 0,done:!0}})([u,l])}}}function qo(r,e,t){if(t||arguments.length===2)for(var o,n=0,s=e.length;n<s;n++)!o&&n in e||(o||(o=Array.prototype.slice.call(e,0,n)),o[n]=e[n]);return r.concat(o||Array.prototype.slice.call(e))}var vr=["nose","left_eye","right_eye","left_ear","right_ear","left_shoulder","right_shoulder","left_elbow","right_elbow","left_wrist","right_wrist","left_hip","right_hip","left_knee","right_knee","left_ankle","right_ankle"],ni=["nose","left_eye_inner","left_eye","left_eye_outer","right_eye_inner","right_eye","right_eye_outer","left_ear","right_ear","mouth_left","mouth_right","left_shoulder","right_shoulder","left_elbow","right_elbow","left_wrist","right_wrist","left_pinky","right_pinky","left_index","right_index","left_thumb","right_thumb","left_hip","right_hip","left_knee","right_knee","left_ankle","right_ankle","left_heel","right_heel","left_foot_index","right_foot_index"],WO={left:[1,2,3,7,9,11,13,15,17,19,21,23,25,27,29,31],right:[4,5,6,8,10,12,14,16,18,20,22,24,26,28,30,32],middle:[0]},HO={left:[1,3,5,7,9,11,13,15],right:[2,4,6,8,10,12,14,16],middle:[0]},KO=[[0,1],[0,2],[1,3],[2,4],[5,6],[5,7],[5,11],[6,8],[6,12],[7,9],[8,10],[11,12],[11,13],[12,14],[13,15],[14,16]],qO=[[0,1],[0,4],[1,2],[2,3],[3,7],[4,5],[5,6],[6,8],[9,10],[11,12],[11,13],[11,23],[12,14],[14,16],[12,24],[13,15],[15,17],[16,18],[16,20],[15,17],[15,19],[15,21],[16,22],[17,19],[18,20],[23,25],[23,24],[24,26],[25,27],[26,28],[27,29],[28,30],[27,31],[28,32],[29,31],[30,32]];function gc(r){return r instanceof SVGAnimatedLength?r.baseVal.value:r}function Jw(r){return ce(this,void 0,void 0,(function(){var e,t;return pe(this,(function(o){switch(o.label){case 0:return e=document.createElement("canvas"),r instanceof de?[4,io.toPixels(r,e)]:[3,2];case 1:return o.sent(),[3,3];case 2:e.width=gc(r.width),e.height=gc(r.height),t=e.getContext("2d"),r instanceof ImageData?t.putImageData(r,0,0):t.drawImage(r,0,0),o.label=3;case 3:return[2,e]}}))}))}function ev(r){return ce(this,void 0,void 0,(function(){var e,t,o,n,s,i;return pe(this,(function(a){switch(a.label){case 0:return r instanceof de?(e=r.shape.slice(0,2),t=e[0],o=e[1],n=ImageData.bind,[4,io.toPixels(r)]):[3,2];case 1:return[2,new(n.apply(ImageData,[void 0,a.sent(),o,t]))];case 2:return s=document.createElement("canvas"),i=s.getContext("2d"),s.width=gc(r.width),s.height=gc(r.height),i.drawImage(r,0,0),[2,i.getImageData(0,0,s.width,s.height)]}}))}))}function XO(r){return ce(this,void 0,void 0,(function(){var e,t;return pe(this,(function(o){switch(o.label){case 0:return r instanceof SVGImageElement||r instanceof OffscreenCanvas?[4,Jw(r)]:[3,2];case 1:return t=o.sent(),[3,3];case 2:t=r,o.label=3;case 3:return e=t,[2,io.fromPixels(e,4)]}}))}))}function tv(r){if(r<0||r>=256)throw new Error("Mask value must be in range [0, 255] but got ".concat(r));if(!Number.isInteger(r))throw new Error("Mask value must be an integer but got ".concat(r))}var oi={runtime:"mediapipe",enableSmoothing:!0,enableSegmentation:!1,smoothSegmentation:!0,modelType:"full"},jO=(function(){function r(e){this.mask=e}return r.prototype.toCanvasImageSource=function(){return ce(this,void 0,void 0,(function(){return pe(this,(function(e){return[2,this.mask]}))}))},r.prototype.toImageData=function(){return ce(this,void 0,void 0,(function(){return pe(this,(function(e){return[2,ev(this.mask)]}))}))},r.prototype.toTensor=function(){return ce(this,void 0,void 0,(function(){return pe(this,(function(e){return[2,XO(this.mask)]}))}))},r.prototype.getUnderlyingType=function(){return"canvasimagesource"},r})();function YO(r){return tv(r),"person"}var QO=(function(){function r(e){var t,o=this;switch(this.width=0,this.height=0,this.selfieMode=!1,this.poseSolution=new Yw.Pose({locateFile:function(n,s){if(e.solutionPath){var i=e.solutionPath.replace(/\/+$/,"");return"".concat(i,"/").concat(n)}return"".concat(s,"/").concat(n)}}),e.modelType){case"lite":t=0;break;case"heavy":t=2;break;default:t=1}this.poseSolution.setOptions({modelComplexity:t,smoothLandmarks:e.enableSmoothing,enableSegmentation:e.enableSegmentation,smoothSegmentation:e.smoothSegmentation,selfieMode:this.selfieMode}),this.poseSolution.onResults((function(n){if(o.height=n.image.height,o.width=n.image.width,n.poseLandmarks==null)o.poses=[];else{var s=o.translateOutput(n.poseLandmarks,n.poseWorldLandmarks);n.segmentationMask&&(s.segmentation={maskValueToLabel:YO,mask:new jO(n.segmentationMask)}),o.poses=[s]}}))}return r.prototype.translateOutput=function(e,t){var o=this,n={keypoints:e.map((function(s,i){return{x:s.x*o.width,y:s.y*o.height,z:s.z,score:s.visibility,name:ni[i]}}))};return t!=null&&(n.keypoints3D=t.map((function(s,i){return{x:s.x,y:s.y,z:s.z,score:s.visibility,name:ni[i]}}))),n},r.prototype.estimatePoses=function(e,t,o){return ce(this,void 0,void 0,(function(){var n,s;return pe(this,(function(i){switch(i.label){case 0:return t&&t.flipHorizontal&&t.flipHorizontal!==this.selfieMode&&(this.selfieMode=t.flipHorizontal,this.poseSolution.setOptions({selfieMode:this.selfieMode})),e instanceof de?(s=ImageData.bind,[4,io.toPixels(e)]):[3,2];case 1:return n=new(s.apply(ImageData,[void 0,i.sent(),e.shape[1],e.shape[0]])),[3,3];case 2:n=e,i.label=3;case 3:return e=n,[4,this.poseSolution.send({image:e},o)];case 4:return i.sent(),[2,this.poses]}}))}))},r.prototype.dispose=function(){this.poseSolution.close()},r.prototype.reset=function(){this.poseSolution.reset()},r.prototype.initialize=function(){return this.poseSolution.initialize()},r})();function ZO(r){return ce(this,void 0,void 0,(function(){var e,t;return pe(this,(function(o){switch(o.label){case 0:return e=(function(n){if(n==null)return ve({},oi);var s=ve({},n);return s.runtime="mediapipe",s.enableSegmentation==null&&(s.enableSegmentation=oi.enableSegmentation),s.enableSmoothing==null&&(s.enableSmoothing=oi.enableSmoothing),s.smoothSegmentation==null&&(s.smoothSegmentation=oi.smoothSegmentation),s.modelType==null&&(s.modelType=oi.modelType),s})(r),[4,(t=new QO(e)).initialize()];case 1:return o.sent(),[2,t]}}))}))}function ns(r){return r instanceof de?{height:r.shape[0],width:r.shape[1]}:{height:r.height,width:r.width}}function rv(r){return r-2*Math.PI*Math.floor((r+Math.PI)/(2*Math.PI))}function ad(r){return r instanceof de?r:io.fromPixels(r)}function ov(r,e,t){return od(t,"inputResolution"),[1/t.width*r[0][0]*e.width,1/t.height*r[0][1]*e.width,r[0][3]*e.width,1/t.width*r[1][0]*e.height,1/t.height*r[1][1]*e.height,r[1][3]*e.height,0,0]}function od(r,e){T.assert(r.width!==0,(function(){return"".concat(e," width cannot be 0.")})),T.assert(r.height!==0,(function(){return"".concat(e," height cannot be 0.")}))}function Xf(r,e,t){var o=t.rotationVectorStartKeypointIndex,n=t.rotationVectorEndKeypointIndex,s=r.locationData,i=s.relativeKeypoints[o].x*e.width,a=s.relativeKeypoints[o].y*e.height,u=s.relativeKeypoints[n].x*e.width,l=s.relativeKeypoints[n].y*e.height,c=2*Math.sqrt((u-i)*(u-i)+(l-a)*(l-a)),p=(function(m,f,d){var g,h=m.locationData,x=d.rotationVectorStartKeypointIndex,v=d.rotationVectorEndKeypointIndex;g=d.rotationVectorTargetAngle?d.rotationVectorTargetAngle:Math.PI*d.rotationVectorTargetAngleDegree/180;var N=h.relativeKeypoints[x].x*f.width,E=h.relativeKeypoints[x].y*f.height,k=h.relativeKeypoints[v].x*f.width,R=h.relativeKeypoints[v].y*f.height;return rv(g-Math.atan2(-(R-E),k-N))})(r,e,t);return{xCenter:i/e.width,yCenter:a/e.height,width:c/e.width,height:c/e.height,rotation:p}}function nv(r){if(r.length!==16)throw new Error("Array length must be 16 but got ".concat(r.length));return[[r[0],r[1],r[2],r[3]],[r[4],r[5],r[6],r[7]],[r[8],r[9],r[10],r[11]],[r[12],r[13],r[14],r[15]]]}function jf(r,e,t,o,n,s,i){return r[e][n]*(r[t][s]*r[o][i]-r[t][i]*r[o][s])}function at(r,e,t){var o=(e+1)%4,n=(e+2)%4,s=(e+3)%4,i=(t+1)%4,a=(t+2)%4,u=(t+3)%4;return jf(r,o,n,s,i,a,u)+jf(r,n,s,o,i,a,u)+jf(r,s,o,n,i,a,u)}function ww(r,e,t){t===void 0&&(t={ignoreRotation:!1});for(var o=[],n=0,s=r;n<s.length;n++){var i=s[n],a=i.x-.5,u=i.y-.5,l=t.ignoreRotation?0:e.rotation,c=Math.cos(l)*a-Math.sin(l)*u,p=Math.sin(l)*a+Math.cos(l)*u;c=c*e.width+e.xCenter,p=p*e.height+e.yCenter;var m=i.z*e.width,f=ve({},i);f.x=c,f.y=p,f.z=m,o.push(f)}return o}function sv(r,e){var t=(function(o,n,s,i){var a=n-o,u=i-s;if(a===0)throw new Error("Original min and max are both ".concat(o,", range cannot be 0."));var l=u/a;return{scale:l,offset:s-o*l}})(0,255,e[0],e[1]);return H((function(){return V(P(r,t.scale),t.offset)}))}function nd(r,e,t){var o,n,s,i,a,u,l,c,p,m,f,d,g,h,x=e.outputTensorSize,v=e.keepAspectRatio,N=e.borderMode,E=e.outputTensorFloatRange,k=ns(r),R=(function(O,F){return F?{xCenter:F.xCenter*O.width,yCenter:F.yCenter*O.height,width:F.width*O.width,height:F.height*O.height,rotation:F.rotation}:{xCenter:.5*O.width,yCenter:.5*O.height,width:O.width,height:O.height,rotation:0}})(k,t),A=(function(O,F,B){if(B===void 0&&(B=!1),!B)return{top:0,left:0,right:0,bottom:0};var M=F.height,z=F.width;od(F,"targetSize"),od(O,"roi");var j,Z,ie=M/z,fe=O.height/O.width,be=0,Oe=0;return ie>fe?(j=O.width,Z=O.width*ie,Oe=(1-fe/ie)/2):(j=O.height/ie,Z=O.height,be=(1-ie/fe)/2),O.width=j,O.height=Z,{top:Oe,left:be,right:be,bottom:Oe}})(R,x,v),_=(o=R,n=k.width,s=k.height,i=!1,a=o.width,u=o.height,l=i?-1:1,c=Math.cos(o.rotation),p=Math.sin(o.rotation),m=o.xCenter,f=o.yCenter,d=1/n,g=1/s,(h=new Array(16))[0]=a*c*l*d,h[1]=-u*p*d,h[2]=0,h[3]=(-.5*a*c*l+.5*u*p+m)*d,h[4]=a*p*l*g,h[5]=u*c*g,h[6]=0,h[7]=(-.5*u*c-.5*a*p*l+f)*g,h[8]=0,h[9]=0,h[10]=a*d,h[11]=0,h[12]=0,h[13]=0,h[14]=0,h[15]=1,nv(h));return{imageTensor:H((function(){var O=ad(r),F=st(ov(_,k,x),[1,8]),B=N==="zero"?"constant":"nearest",M=Lr.transform(Je(ee(O,"float32")),F,"bilinear",B,0,[x.height,x.width]);return E!=null?sv(M,E):M})),padding:A,transformationMatrix:_}}function vw(r,e,t,o){return o===1?.5*(r+e):r+(e-r)*t/(o-1)}function JO(r){return H((function(){var e=(function(n){return H((function(){return[Q(n,[0,0,0],[1,-1,1]),Q(n,[0,0,1],[1,-1,-1])]}))})(r),t=e[0],o=e[1];return{boxes:ge(o),logits:ge(t)}}))}function iv(r){return r!=null&&r.currentTime!=null}function Tw(r){for(var e={locationData:{relativeKeypoints:[]}},t=Number.MAX_SAFE_INTEGER,o=Number.MIN_SAFE_INTEGER,n=Number.MAX_SAFE_INTEGER,s=Number.MIN_SAFE_INTEGER,i=0;i<r.length;++i){var a=r[i];t=Math.min(t,a.x),o=Math.max(o,a.x),n=Math.min(n,a.y),s=Math.max(s,a.y),e.locationData.relativeKeypoints.push({x:a.x,y:a.y})}return e.locationData.relativeBoundingBox={xMin:t,yMin:n,xMax:o,yMax:s,width:o-t,height:s-n},e}function eF(r,e,t,o){return ce(this,void 0,void 0,(function(){var n,s,i,a,u;return pe(this,(function(l){switch(l.label){case 0:return r.sort((function(c,p){return Math.max.apply(Math,p.score)-Math.max.apply(Math,c.score)})),n=st(r.map((function(c){return[c.locationData.relativeBoundingBox.yMin,c.locationData.relativeBoundingBox.xMin,c.locationData.relativeBoundingBox.yMax,c.locationData.relativeBoundingBox.xMax]}))),s=Re(r.map((function(c){return c.score[0]}))),[4,Lr.nonMaxSuppressionAsync(n,s,e,t)];case 1:return[4,(i=l.sent()).array()];case 2:return a=l.sent(),u=r.filter((function(c,p){return a.indexOf(p)>-1})),ne([n,s,i]),[2,u]}}))}))}function av(r,e){return r.map((function(t){var o=ve(ve({},t),{x:t.x*e.width,y:t.y*e.height});return t.z!=null&&(o.z=t.z*e.width),o}))}function tF(r,e,t){return ce(this,void 0,void 0,(function(){var o,n,s,i,a,u,l,c,p,m,f,d,g,h,x,v,N,E,k,R,A,_,O,F;return pe(this,(function(B){switch(B.label){case 0:if(o=ge(e,[0]),n=o.shape,s=n[0],i=n[1],a=n[2],r.length!==a)throw new Error("Expected heatmap to have same number of channels as the number of landmarks. But got landmarks length: "+"".concat(r.length,", heatmap length: ").concat(a));return u=[],[4,o.buffer()];case 1:for(l=B.sent(),c=0;c<r.length;c++)if(p=r[c],m=ve({},p),u.push(m),f=Math.trunc(m.x*i),d=Math.trunc(m.y*s),!(f<0||f>=i||d<0||f>=s)){for(g=Math.trunc((t.kernelSize-1)/2),h=Math.max(0,f-g),x=Math.min(i,f+g+1),v=Math.max(0,d-g),N=Math.min(s,d+g+1),E=0,k=0,R=0,A=0,_=v;_<N;++_)for(O=h;O<x;++O)F=l.get(_,O,c),E+=F,A=Math.max(A,F),k+=O*F,R+=_*F;A>=t.minConfidenceToRefine&&E>0&&(m.x=k/i/E,m.y=R/s/E)}return o.dispose(),[2,u]}}))}))}function Sw(r,e){var t=e.left,o=e.top,n=e.left+e.right,s=e.top+e.bottom;return r.map((function(i){return ve(ve({},i),{x:(i.x-t)/(1-n),y:(i.y-o)/(1-s),z:i.z/(1-n)})}))}function rF(r,e,t){return $r()==="webgl"?(function(o,n,s){var i=s.combineWithPreviousRatio.toFixed(2),a={variableNames:["prevMask","newMask"],outputShape:o.shape,userCode:`
  void main() {
      ivec2 coords = getOutputCoords();
      int height = coords[0];
      int width = coords[1];

      float prevMaskValue = getPrevMask(height, width);
      float newMaskValue = getNewMask(height, width);

      /*
      * Assume p := newMaskValue
      * H(p) := 1 + (p * log(p) + (1-p) * log(1-p)) / log(2)
      * uncertainty alpha(p) =
      *   Clamp(1 - (1 - H(p)) * (1 - H(p)), 0, 1) [squaring the
      * uncertainty]
      *
      * The following polynomial approximates uncertainty alpha as a
      * function of (p + 0.5):
      */
      const float c1 = 5.68842;
      const float c2 = -0.748699;
      const float c3 = -57.8051;
      const float c4 = 291.309;
      const float c5 = -624.717;
      float t = newMaskValue - 0.5;
      float x = t * t;

      float uncertainty =
        1.0 - min(1.0, x * (c1 + x * (c2 + x * (c3 + x * (c4 + x * c5)))));

      float outputValue = newMaskValue + (prevMaskValue - newMaskValue) *
                             (uncertainty * `.concat(i,`);

      setOutput(outputValue);
    }
`)},u=Xr();return H((function(){var l=u.compileAndRun(a,[o,n]);return Vt().makeTensorFromDataId(l.dataId,l.shape,l.dtype)}))})(r,e,t):H((function(){var o=q(e,.5),n=Me(o),s=q(1,Or(1,P(n,V(5.68842,P(n,V(-.748699,P(n,V(-57.8051,P(n,V(291.309,P(n,-624.717)))))))))));return V(e,P(q(r,e),P(s,t.combineWithPreviousRatio)))}))}function oF(r,e,t){return ce(this,void 0,void 0,(function(){var o,n,s,i,a;return pe(this,(function(u){switch(u.label){case 0:return o=r[0],n=r[1],s=(function(l,c,p){return H((function(){var m,f,d,g;p.reverseOutputOrder?(f=ge(Q(l,[0,p.boxCoordOffset+0],[-1,1])),m=ge(Q(l,[0,p.boxCoordOffset+1],[-1,1])),g=ge(Q(l,[0,p.boxCoordOffset+2],[-1,1])),d=ge(Q(l,[0,p.boxCoordOffset+3],[-1,1]))):(m=ge(Q(l,[0,p.boxCoordOffset+0],[-1,1])),f=ge(Q(l,[0,p.boxCoordOffset+1],[-1,1])),d=ge(Q(l,[0,p.boxCoordOffset+2],[-1,1])),g=ge(Q(l,[0,p.boxCoordOffset+3],[-1,1]))),f=V(P(Y(f,p.xScale),c.w),c.x),m=V(P(Y(m,p.yScale),c.h),c.y),p.applyExponentialOnBoxSize?(d=P(ht(Y(d,p.hScale)),c.h),g=P(ht(Y(g,p.wScale)),c.w)):(d=P(Y(d,p.hScale),c.h),g=P(Y(g,p.wScale),c.h));var h=q(m,Y(d,2)),x=q(f,Y(g,2)),v=V(m,Y(d,2)),N=V(f,Y(g,2)),E=xe([D(h,[p.numBoxes,1]),D(x,[p.numBoxes,1]),D(v,[p.numBoxes,1]),D(N,[p.numBoxes,1])],1);if(p.numKeypoints)for(var k=0;k<p.numKeypoints;++k){var R=p.keypointCoordOffset+k*p.numValuesPerKeypoint,A=void 0,_=void 0;p.reverseOutputOrder?(A=ge(Q(l,[0,R],[-1,1])),_=ge(Q(l,[0,R+1],[-1,1]))):(_=ge(Q(l,[0,R],[-1,1])),A=ge(Q(l,[0,R+1],[-1,1])));var O=V(P(Y(A,p.xScale),c.w),c.x),F=V(P(Y(_,p.yScale),c.h),c.y);E=xe([E,D(O,[p.numBoxes,1]),D(F,[p.numBoxes,1])],1)}return E}))})(n,e,t),i=H((function(){var l=o;return t.sigmoidScore?(t.scoreClippingThresh!=null&&(l=Qu(o,-t.scoreClippingThresh,t.scoreClippingThresh)),l=Rt(l)):l})),[4,nF(s,i,t)];case 1:return a=u.sent(),ne([s,i]),[2,a]}}))}))}function nF(r,e,t){return ce(this,void 0,void 0,(function(){var o,n,s,i,a,u,l,c,p,m,f,d;return pe(this,(function(g){switch(g.label){case 0:return o=[],[4,r.data()];case 1:return n=g.sent(),[4,e.data()];case 2:for(s=g.sent(),i=0;i<t.numBoxes;++i)if(!(t.minScoreThresh!=null&&s[i]<t.minScoreThresh||(a=i*t.numCoords,u=sF(n[a+0],n[a+1],n[a+2],n[a+3],s[i],t.flipVertically,i),(l=u.locationData.relativeBoundingBox).width<0||l.height<0))){if(t.numKeypoints>0)for((c=u.locationData).relativeKeypoints=[],p=t.numKeypoints*t.numValuesPerKeypoint,m=0;m<p;m+=t.numValuesPerKeypoint)f=a+t.keypointCoordOffset+m,d={x:n[f+0],y:t.flipVertically?1-n[f+1]:n[f+1]},c.relativeKeypoints.push(d);o.push(u)}return[2,o]}}))}))}function sF(r,e,t,o,n,s,i){return{score:[n],ind:i,locationData:{relativeBoundingBox:{xMin:e,yMin:s?1-t:r,xMax:o,yMax:s?1-r:t,width:o-e,height:t-r}}}}function iF(r,e){return r==="none"?e:(function(t){return 1/(1+Math.exp(-t))})(e)}function Cw(r,e,t,o){return ce(this,void 0,void 0,(function(){var n,s,i,a,u,l,c,p;return pe(this,(function(m){switch(m.label){case 0:return t=t||e.flipHorizontally||!1,o=o||e.flipVertically||!1,n=r.size,s=n/e.numLandmarks,[4,r.data()];case 1:for(i=m.sent(),a=[],u=0;u<e.numLandmarks;++u)l=u*s,(p={x:0,y:0}).x=t?e.inputImageWidth-i[l]:i[l],s>1&&(p.y=o?e.inputImageHeight-i[l+1]:i[l+1]),s>2&&(p.z=i[l+2]),s>3&&(p.score=iF(e.visibilityActivation,i[l+3])),a.push(p);for(c=0;c<a.length;++c)(p=a[c]).x=p.x/e.inputImageWidth,p.y=p.y/e.inputImageHeight,p.z=p.z/e.inputImageWidth/(e.normalizeZ||1);return[2,a]}}))}))}function Nw(r,e,t){var o=r.width,n=r.height,s=r.rotation;if(t.rotation==null&&t.rotationDegree==null||(s=(function(c,p){return p.rotation!=null?c+=p.rotation:p.rotationDegree!=null&&(c+=Math.PI*p.rotationDegree/180),rv(c)})(s,t)),s===0)r.xCenter=r.xCenter+o*t.shiftX,r.yCenter=r.yCenter+n*t.shiftY;else{var i=(e.width*o*t.shiftX*Math.cos(s)-e.height*n*t.shiftY*Math.sin(s))/e.width,a=(e.width*o*t.shiftX*Math.sin(s)+e.height*n*t.shiftY*Math.cos(s))/e.height;r.xCenter=r.xCenter+i,r.yCenter=r.yCenter+a}if(t.squareLong){var u=Math.max(o*e.width,n*e.height);o=u/e.width,n=u/e.height}else if(t.squareShort){var l=Math.min(o*e.width,n*e.height);o=l/e.width,n=l/e.height}return r.width=o*t.scaleX,r.height=n*t.scaleY,r}function aF(r,e){return r.map((function(t){var o=ve(ve({},t),{x:t.x/e.width,y:t.y/e.height});return t.z!=null&&(t.z=t.z/e.width),o}))}var lo=(function(){function r(e){this.alpha=e,this.initialized=!1}return r.prototype.apply=function(e,t){var o;return this.initialized?o=t==null?this.storedValue+this.alpha*(e-this.storedValue):this.storedValue+this.alpha*t*Math.asinh((e-this.storedValue)/t):(o=e,this.initialized=!0),this.rawValue=e,this.storedValue=o,o},r.prototype.applyWithAlpha=function(e,t,o){return this.alpha=t,this.apply(e,o)},r.prototype.hasLastRawValue=function(){return this.initialized},r.prototype.lastRawValue=function(){return this.rawValue},r.prototype.reset=function(){this.initialized=!1},r})(),Yf=(function(){function r(e){this.frequency=e.frequency,this.minCutOff=e.minCutOff,this.beta=e.beta,this.thresholdCutOff=e.thresholdCutOff,this.thresholdBeta=e.thresholdBeta,this.derivateCutOff=e.derivateCutOff,this.x=new lo(this.getAlpha(this.minCutOff)),this.dx=new lo(this.getAlpha(this.derivateCutOff)),this.lastTimestamp=0}return r.prototype.apply=function(e,t,o){if(e==null)return e;var n=Math.trunc(t);if(this.lastTimestamp>=n)return e;this.lastTimestamp!==0&&n!==0&&(this.frequency=1/(1e-6*(n-this.lastTimestamp))),this.lastTimestamp=n;var s=this.x.hasLastRawValue()?(e-this.x.lastRawValue())*o*this.frequency:0,i=this.dx.applyWithAlpha(s,this.getAlpha(this.derivateCutOff)),a=this.minCutOff+this.beta*Math.abs(i),u=this.thresholdCutOff!=null?this.thresholdCutOff+this.thresholdBeta*Math.abs(i):null;return this.x.applyWithAlpha(e,this.getAlpha(a),u)},r.prototype.getAlpha=function(e){return 1/(1+this.frequency/(2*Math.PI*e))},r})(),sd=(function(){function r(e){this.config=e}return r.prototype.apply=function(e,t,o){var n=this;if(e==null)return this.reset(),null;this.initializeFiltersIfEmpty(e);var s=1;if(!this.config.disableValueScaling){if(o<this.config.minAllowedObjectScale)return qo([],e,!0);s=1/o}return e.map((function(i,a){var u=ve(ve({},i),{x:n.xFilters[a].apply(i.x,t,s),y:n.yFilters[a].apply(i.y,t,s)});return i.z!=null&&(u.z=n.zFilters[a].apply(i.z,t,s)),u}))},r.prototype.reset=function(){this.xFilters=null,this.yFilters=null,this.zFilters=null},r.prototype.initializeFiltersIfEmpty=function(e){var t=this;this.xFilters!=null&&this.xFilters.length===e.length||(this.xFilters=e.map((function(o){return new Yf(t.config)})),this.yFilters=e.map((function(o){return new Yf(t.config)})),this.zFilters=e.map((function(o){return new Yf(t.config)})))},r})(),Qf=(function(){function r(e){this.config=e,this.window=[],this.lowPassFilter=new lo(1),this.lastValue=0,this.lastValueScale=1,this.lastTimestamp=-1}return r.prototype.apply=function(e,t,o){if(e==null)return e;var n,s=Math.trunc(t);if(this.lastTimestamp>=s)return e;if(this.lastTimestamp===-1)n=1;else{for(var i=e*o-this.lastValue*this.lastValueScale,a=s-this.lastTimestamp,u=i,l=a,c=(1+this.window.length)*(1e6/30),p=0,m=this.window;p<m.length;p++){var f=m[p];if(l+f.duration>c)break;u+=f.distance,l+=f.duration}var d=u/(1e-6*l);n=1-1/(1+this.config.velocityScale*Math.abs(d)),this.window.unshift({distance:i,duration:a}),this.window.length>this.config.windowSize&&this.window.pop()}return this.lastValue=e,this.lastValueScale=o,this.lastTimestamp=s,this.lowPassFilter.applyWithAlpha(e,n)},r})(),uF=(function(){function r(e){this.config=e}return r.prototype.apply=function(e,t,o){var n=this;if(e==null)return this.reset(),null;var s=1;if(!this.config.disableValueScaling){if(o<this.config.minAllowedObjectScale)return qo([],e,!0);s=1/o}return this.initializeFiltersIfEmpty(e),e.map((function(i,a){var u=ve(ve({},i),{x:n.xFilters[a].apply(i.x,t,s),y:n.yFilters[a].apply(i.y,t,s)});return i.z!=null&&(u.z=n.zFilters[a].apply(i.z,t,s)),u}))},r.prototype.reset=function(){this.xFilters=null,this.yFilters=null,this.zFilters=null},r.prototype.initializeFiltersIfEmpty=function(e){var t=this;this.xFilters!=null&&this.xFilters.length===e.length||(this.xFilters=e.map((function(o){return new Qf(t.config)})),this.yFilters=e.map((function(o){return new Qf(t.config)})),this.zFilters=e.map((function(o){return new Qf(t.config)})))},r})(),Zf=(function(){function r(e){if(e.velocityFilter!=null)this.keypointsFilter=new uF(e.velocityFilter);else{if(e.oneEuroFilter==null)throw new Error("Either configure velocityFilter or oneEuroFilter, but got "+"".concat(e,"."));this.keypointsFilter=new sd(e.oneEuroFilter)}}return r.prototype.apply=function(e,t,o,n,s){if(n===void 0&&(n=!1),e==null)return this.keypointsFilter.reset(),null;var i=s!=null?(function(l,c){return(l.width*c.width+l.height*c.height)/2})(s,o):1,a=n?av(e,o):e,u=this.keypointsFilter.apply(a,t,i);return n?aF(u,o):u},r})(),Ew=(function(){function r(e){this.alpha=e.alpha}return r.prototype.apply=function(e){var t=this;if(e==null)return this.visibilityFilters=null,null;this.visibilityFilters!=null&&this.visibilityFilters.length===e.length||(this.visibilityFilters=e.map((function(a){return new lo(t.alpha)})));for(var o=[],n=0;n<e.length;++n){var s=e[n],i=ve({},s);i.score=this.visibilityFilters[n].apply(s.score),o.push(i)}return o},r})(),lF={reduceBoxesInLowestlayer:!1,interpolatedScaleAspectRatio:1,featureMapHeight:[],featureMapWidth:[],numLayers:5,minScale:.1484375,maxScale:.75,inputSizeHeight:224,inputSizeWidth:224,anchorOffsetX:.5,anchorOffsetY:.5,strides:[8,16,32,32,32],aspectRatios:[1],fixedAnchorSize:!0},os={runtime:"tfjs",modelType:"full",enableSmoothing:!0,enableSegmentation:!1,smoothSegmentation:!0,detectorModelUrl:"https://tfhub.dev/mediapipe/tfjs-model/blazepose_3d/detector/1",landmarkModelUrl:"https://tfhub.dev/mediapipe/tfjs-model/blazepose_3d/landmark/full/2"},cF={maxPoses:1,flipHorizontal:!1},pF={applyExponentialOnBoxSize:!1,flipVertically:!1,ignoreClasses:[],numClasses:1,numBoxes:2254,numCoords:12,boxCoordOffset:0,keypointCoordOffset:4,numKeypoints:4,numValuesPerKeypoint:2,sigmoidScore:!0,scoreClippingThresh:100,reverseOutputOrder:!0,xScale:224,yScale:224,hScale:224,wScale:224,minScoreThresh:.5},mF=.3,Iw={shiftX:0,shiftY:0,scaleX:1.25,scaleY:1.25,squareLong:!0},fF={outputTensorSize:{width:224,height:224},keepAspectRatio:!0,outputTensorFloatRange:[-1,1],borderMode:"zero"},dF={outputTensorSize:{width:256,height:256},keepAspectRatio:!0,outputTensorFloatRange:[0,1],borderMode:"zero"},hF={numLandmarks:39,inputImageWidth:256,inputImageHeight:256,visibilityActivation:"sigmoid",flipHorizontally:!1,flipVertically:!1},gF={numLandmarks:39,inputImageWidth:1,inputImageHeight:1,visibilityActivation:"sigmoid",flipHorizontally:!1,flipVertically:!1},xF={kernelSize:7,minConfidenceToRefine:.5},kw={alpha:.1},yF={oneEuroFilter:{frequency:30,minCutOff:.05,beta:80,derivateCutOff:1,minAllowedObjectScale:1e-6}},bF={oneEuroFilter:{frequency:30,minCutOff:.01,beta:10,derivateCutOff:1,minAllowedObjectScale:1e-6}},wF={oneEuroFilter:{frequency:30,minCutOff:.1,beta:40,derivateCutOff:1,minAllowedObjectScale:1e-6,disableValueScaling:!0}},vF={activation:"none"},TF={combineWithPreviousRatio:.7},SF=(function(){function r(e){this.mask=e}return r.prototype.toCanvasImageSource=function(){return ce(this,void 0,void 0,(function(){return pe(this,(function(e){return[2,Jw(this.mask)]}))}))},r.prototype.toImageData=function(){return ce(this,void 0,void 0,(function(){return pe(this,(function(e){return[2,ev(this.mask)]}))}))},r.prototype.toTensor=function(){return ce(this,void 0,void 0,(function(){return pe(this,(function(e){return[2,this.mask]}))}))},r.prototype.getUnderlyingType=function(){return"tensor"},r})();function CF(r){return tv(r),"person"}var NF=(function(){function r(e,t,o,n,s,i){this.detectorModel=e,this.landmarkModel=t,this.enableSmoothing=o,this.enableSegmentation=n,this.smoothSegmentation=s,this.modelType=i,this.regionOfInterest=null,this.prevFilteredSegmentationMask=null,this.anchors=(function(p){p.reduceBoxesInLowestLayer==null&&(p.reduceBoxesInLowestLayer=!1),p.interpolatedScaleAspectRatio==null&&(p.interpolatedScaleAspectRatio=1),p.fixedAnchorSize==null&&(p.fixedAnchorSize=!1);for(var m=[],f=0;f<p.numLayers;){for(var d=[],g=[],h=[],x=[],v=f;v<p.strides.length&&p.strides[v]===p.strides[f];){var N=vw(p.minScale,p.maxScale,v,p.strides.length);if(v===0&&p.reduceBoxesInLowestLayer)h.push(1),h.push(2),h.push(.5),x.push(.1),x.push(N),x.push(N);else{for(var E=0;E<p.aspectRatios.length;++E)h.push(p.aspectRatios[E]),x.push(N);if(p.interpolatedScaleAspectRatio>0){var k=v===p.strides.length-1?1:vw(p.minScale,p.maxScale,v+1,p.strides.length);x.push(Math.sqrt(N*k)),h.push(p.interpolatedScaleAspectRatio)}}v++}for(var R=0;R<h.length;++R){var A=Math.sqrt(h[R]);d.push(x[R]/A),g.push(x[R]*A)}var _=0,O=0;if(p.featureMapHeight.length>0)_=p.featureMapHeight[f],O=p.featureMapWidth[f];else{var F=p.strides[f];_=Math.ceil(p.inputSizeHeight/F),O=Math.ceil(p.inputSizeWidth/F)}for(var B=0;B<_;++B)for(var M=0;M<O;++M)for(var z=0;z<d.length;++z){var j={xCenter:(M+p.anchorOffsetX)/O,yCenter:(B+p.anchorOffsetY)/_,width:0,height:0};p.fixedAnchorSize?(j.width=1,j.height=1):(j.width=g[z],j.height=d[z]),m.push(j)}f=v}return m})(lF);var a=Re(this.anchors.map((function(p){return p.width}))),u=Re(this.anchors.map((function(p){return p.height}))),l=Re(this.anchors.map((function(p){return p.xCenter}))),c=Re(this.anchors.map((function(p){return p.yCenter})));this.anchorTensor={x:l,y:c,w:a,h:u},this.prevFilteredSegmentationMask=this.enableSegmentation?st([],[0,0]):null}return r.prototype.estimatePoses=function(e,t,o){return ce(this,void 0,void 0,(function(){var n,s,i,a,u,l,c,p,m,f,d,g,h,x,v,N,E,k,R,A,_,O,F;return pe(this,(function(B){switch(B.label){case 0:return n=(function(M){var z;if((z=M==null?cF:ve({},M)).maxPoses==null&&(z.maxPoses=1),z.maxPoses<=0)throw new Error("Invalid maxPoses ".concat(z.maxPoses,". Should be > 0."));if(z.maxPoses>1)throw new Error("Multi-pose detection is not implemented yet. Please set maxPoses to 1.");return z})(t),e==null?(this.reset(),[2,[]]):(this.maxPoses=n.maxPoses,this.timestamp=o!=null?1e3*o:iv(e)?1e6*e.currentTime:null,s=ns(e),i=H((function(){return ee(ad(e),"float32")})),(a=this.regionOfInterest)!=null?[3,2]:[4,this.detectPose(i)]);case 1:if((u=B.sent()).length===0)return this.reset(),i.dispose(),[2,[]];l=u[0],a=this.poseDetectionToRoi(l,s),B.label=2;case 2:return[4,this.poseLandmarksByRoi(a,i)];case 3:return c=B.sent(),i.dispose(),c==null?(this.reset(),[2,[]]):(p=c.landmarks,m=c.auxiliaryLandmarks,f=c.poseScore,d=c.worldLandmarks,g=c.segmentationMask,h=this.poseLandmarkFiltering(p,m,d,s),x=h.actualLandmarksFiltered,v=h.auxiliaryLandmarksFiltered,N=h.actualWorldLandmarksFiltered,E=this.poseLandmarksToRoi(v,s),this.regionOfInterest=E,k=this.smoothSegmentation&&g!=null?this.poseSegmentationFiltering(g):g,(R=x!=null?av(x,s):null)!=null&&R.forEach((function(M,z){M.name=ni[z]})),(A=N)!=null&&A.forEach((function(M,z){M.name=ni[z]})),_={score:f,keypoints:R,keypoints3D:A},k!==null&&(O=H((function(){var M=Je(k,2),z=_t(M,[[0,0],[0,0],[0,1]]);return yl(z,[[0,0],[0,0],[0,2]],"symmetric")})),this.smoothSegmentation||ne(k),F={maskValueToLabel:CF,mask:new SF(O)},_.segmentation=F),[2,[_]])}}))}))},r.prototype.poseSegmentationFiltering=function(e){var t=this.prevFilteredSegmentationMask;return t.size===0?this.prevFilteredSegmentationMask=e:(this.prevFilteredSegmentationMask=rF(t,e,TF),ne(e)),ne(t),this.prevFilteredSegmentationMask},r.prototype.dispose=function(){this.detectorModel.dispose(),this.landmarkModel.dispose(),ne([this.anchorTensor.x,this.anchorTensor.y,this.anchorTensor.w,this.anchorTensor.h,this.prevFilteredSegmentationMask])},r.prototype.reset=function(){this.regionOfInterest=null,this.enableSegmentation&&(ne(this.prevFilteredSegmentationMask),this.prevFilteredSegmentationMask=st([],[0,0])),this.visibilitySmoothingFilterActual=null,this.visibilitySmoothingFilterAuxiliary=null,this.landmarksSmoothingFilterActual=null,this.landmarksSmoothingFilterAuxiliary=null},r.prototype.detectPose=function(e){return ce(this,void 0,void 0,(function(){var t,o,n,s,i,a,u,l,c,p;return pe(this,(function(m){switch(m.label){case 0:return t=nd(e,fF),o=t.imageTensor,n=t.padding,s=this.detectorModel.predict(o),i=JO(s),a=i.boxes,[4,oF([u=i.logits,a],this.anchorTensor,pF)];case 1:return(l=m.sent()).length===0?(ne([o,s,u,a]),[2,l]):[4,eF(l,this.maxPoses,mF)];case 2:return c=m.sent(),p=(function(f,d){f===void 0&&(f=[]);for(var g=d.left,h=d.top,x=d.left+d.right,v=d.top+d.bottom,N=0;N<f.length;N++){var E=f[N],k=E.locationData.relativeBoundingBox,R=(k.xMin-g)/(1-x),A=(k.yMin-h)/(1-v),_=k.width/(1-x),O=k.height/(1-v);k.xMin=R,k.yMin=A,k.width=_,k.height=O,k.xMax=R+_,k.yMax=A+O;var F=E.locationData.relativeKeypoints;F&&F.forEach((function(B){var M=(B.x-g)/(1-x),z=(B.y-h)/(1-v);B.x=M,B.y=z}))}return f})(c,n),ne([o,s,u,a]),[2,p]}}))}))},r.prototype.poseDetectionToRoi=function(e,t){return Nw(Xf(e,t,{rotationVectorEndKeypointIndex:1,rotationVectorStartKeypointIndex:0,rotationVectorTargetAngleDegree:90}),t,Iw)},r.prototype.poseLandmarksByRoi=function(e,t){return ce(this,void 0,void 0,(function(){var o,n,s,i,a,u,l,c,p,m,f,d,g,h;return pe(this,(function(x){switch(x.label){case 0:if(o=ns(t),n=nd(t,dF,e),s=n.imageTensor,i=n.padding,a=n.transformationMatrix,this.modelType!=="lite"&&this.modelType!=="full"&&this.modelType!=="heavy")throw new Error("Model type must be one of lite, full or heavy,"+"but got ".concat(this.modelType));return u=["ld_3d","output_poseflag","activation_heatmap","world_3d"],this.enableSegmentation&&u.push("activation_segmentation"),l=this.landmarkModel.execute(s,u),[4,this.tensorsToPoseLandmarksAndSegmentation(l)];case 1:return(c=x.sent())==null?(ne(l),ne(s),[2,null]):(p=c.landmarks,m=c.auxiliaryLandmarks,f=c.poseScore,d=c.worldLandmarks,g=c.segmentationMask,[4,this.poseLandmarksAndSegmentationInverseProjection(o,e,i,a,p,m,d,g)]);case 2:return h=x.sent(),ne(l),ne(s),[2,ve({poseScore:f},h)]}}))}))},r.prototype.poseLandmarksAndSegmentationInverseProjection=function(e,t,o,n,s,i,a,u){return ce(this,void 0,void 0,(function(){var l,c,p,m,f,d;return pe(this,(function(g){return l=Sw(s,o),c=Sw(i,o),p=ww(l,t),m=ww(c,t),f=(function(h,x){for(var v=[],N=0,E=h;N<E.length;N++){var k=E[N],R=k.x,A=k.y,_=x.rotation,O=Math.cos(_)*R-Math.sin(_)*A,F=Math.sin(_)*R+Math.cos(_)*A,B=ve({},k);B.x=O,B.y=F,v.push(B)}return v})(a,t),d=null,this.enableSegmentation&&(d=H((function(){var h=u.shape,x=h[0],v=h[1],N=(function(R){var A=nv(new Array(16).fill(0));A[0][0]=at(R,0,0),A[1][0]=-at(R,0,1),A[2][0]=at(R,0,2),A[3][0]=-at(R,0,3),A[0][2]=at(R,2,0),A[1][2]=-at(R,2,1),A[2][2]=at(R,2,2),A[3][2]=-at(R,2,3),A[0][1]=-at(R,1,0),A[1][1]=at(R,1,1),A[2][1]=-at(R,1,2),A[3][1]=at(R,1,3),A[0][3]=-at(R,3,0),A[1][3]=at(R,3,1),A[2][3]=-at(R,3,2),A[3][3]=at(R,3,3);for(var _=R[0][0]*A[0][0]+R[1][0]*A[0][1]+R[2][0]*A[0][2]+R[3][0]*A[0][3],O=0;O<A.length;O++)for(var F=0;F<A.length;F++)A[O][F]/=_;return A})(n),E=st(ov(N,{width:v,height:x},e),[1,8]),k=[1,x,v,1];return ge(Lr.transform(D(u,k),E,"bilinear","constant",0,[e.height,e.width]),[0,3])})),ne(u)),[2,{landmarks:p,auxiliaryLandmarks:m,worldLandmarks:f,segmentationMask:d}]}))}))},r.prototype.tensorsToPoseLandmarksAndSegmentation=function(e){return ce(this,void 0,void 0,(function(){var t,o,n,s,i,a,u,l,c,p,m,f,d;return pe(this,(function(g){switch(g.label){case 0:return t=e[0],o=e[1],n=e[2],s=e[3],i=this.enableSegmentation?e[4]:null,[4,o.data()];case 1:return(a=g.sent()[0])<.5?[2,null]:[4,Cw(t,hF)];case 2:return[4,tF(g.sent(),n,xF)];case 3:return u=g.sent(),l=u.slice(0,33),c=u.slice(33,35),[4,Cw(s,gF)];case 4:return p=g.sent(),m=p.slice(0,33),f=(function(h,x,v){v===void 0&&(v=!0);for(var N=[],E=0;E<h.length;E++){var k=ve({},x[E]);v&&(k.score=h[E].score),N.push(k)}return N})(l,m,!0),d=this.enableSegmentation?(function(h,x,v){return H((function(){var N=ge(h,[0]),E=N.shape[2];if(E===1){var k=N;switch(x.activation){case"none":break;case"sigmoid":k=Rt(k);break;case"softmax":throw new Error("Softmax activation requires two channels.");default:throw new Error("Activation not supported (".concat(x.activation,")"))}var R=v?Lr.resizeBilinear(k,[v.height,v.width]):k;return ge(R,[2])}throw new Error("Unsupported number of tensor channels ".concat(E))}))})(i,vF):null,[2,{landmarks:l,auxiliaryLandmarks:c,poseScore:a,worldLandmarks:f,segmentationMask:d}]}}))}))},r.prototype.poseLandmarksToRoi=function(e,t){return Nw(Xf(Tw(e),t,{rotationVectorStartKeypointIndex:0,rotationVectorEndKeypointIndex:1,rotationVectorTargetAngleDegree:90}),t,Iw)},r.prototype.poseLandmarkFiltering=function(e,t,o,n){var s,i,a;if(this.timestamp!=null&&this.enableSmoothing){var u=Xf(Tw(t),n,{rotationVectorEndKeypointIndex:0,rotationVectorStartKeypointIndex:1,rotationVectorTargetAngleDegree:90});this.visibilitySmoothingFilterActual==null&&(this.visibilitySmoothingFilterActual=new Ew(kw)),s=this.visibilitySmoothingFilterActual.apply(e),this.visibilitySmoothingFilterAuxiliary==null&&(this.visibilitySmoothingFilterAuxiliary=new Ew(kw)),i=this.visibilitySmoothingFilterAuxiliary.apply(t),a=this.visibilitySmoothingFilterActual.apply(o),this.landmarksSmoothingFilterActual==null&&(this.landmarksSmoothingFilterActual=new Zf(yF)),s=this.landmarksSmoothingFilterActual.apply(s,this.timestamp,n,!0,u),this.landmarksSmoothingFilterAuxiliary==null&&(this.landmarksSmoothingFilterAuxiliary=new Zf(bF)),i=this.landmarksSmoothingFilterAuxiliary.apply(i,this.timestamp,n,!0,u),this.worldLandmarksSmoothingFilterActual==null&&(this.worldLandmarksSmoothingFilterActual=new Zf(wF)),a=this.worldLandmarksSmoothingFilterActual.apply(o,this.timestamp)}else s=e,i=t,a=o;return{actualLandmarksFiltered:s,auxiliaryLandmarksFiltered:i,actualWorldLandmarksFiltered:a}},r})();function EF(r){return ce(this,void 0,void 0,(function(){var e,t,o,n,s,i;return pe(this,(function(a){switch(a.label){case 0:return e=(function(u){var l=ve({},u??os);if(l.enableSmoothing==null&&(l.enableSmoothing=os.enableSmoothing),l.enableSegmentation==null&&(l.enableSegmentation=os.enableSegmentation),l.smoothSegmentation==null&&(l.smoothSegmentation=os.smoothSegmentation),l.modelType==null&&(l.modelType=os.modelType),l.detectorModelUrl==null&&(l.detectorModelUrl=os.detectorModelUrl),l.landmarkModelUrl==null)switch(l.modelType){case"lite":l.landmarkModelUrl="https://tfhub.dev/mediapipe/tfjs-model/blazepose_3d/landmark/lite/2";break;case"heavy":l.landmarkModelUrl="https://tfhub.dev/mediapipe/tfjs-model/blazepose_3d/landmark/heavy/2";break;default:l.landmarkModelUrl="https://tfhub.dev/mediapipe/tfjs-model/blazepose_3d/landmark/full/2"}return l})(r),t=typeof e.detectorModelUrl=="string"&&e.detectorModelUrl.indexOf("https://tfhub.dev")>-1,o=typeof e.landmarkModelUrl=="string"&&e.landmarkModelUrl.indexOf("https://tfhub.dev")>-1,[4,Promise.all([uo(e.detectorModelUrl,{fromTFHub:t}),uo(e.landmarkModelUrl,{fromTFHub:o})])];case 1:return n=a.sent(),s=n[0],i=n[1],[2,new NF(s,i,e.enableSmoothing,e.enableSegmentation,e.smoothSegmentation,e.modelType)]}}))}))}var Xo,et,uv=(function(){function r(e){(function(t){if(t.maxTracks<1)throw new Error("Must specify 'maxTracks' to be at least 1, but "+"encountered ".concat(t.maxTracks));if(t.maxAge<=0)throw new Error("Must specify 'maxAge' to be positive, but "+"encountered ".concat(t.maxAge));if(t.keypointTrackerParams!==void 0){if(t.keypointTrackerParams.keypointConfidenceThreshold<0||t.keypointTrackerParams.keypointConfidenceThreshold>1)throw new Error("Must specify 'keypointConfidenceThreshold' to be in the range [0, 1], but encountered "+"".concat(t.keypointTrackerParams.keypointConfidenceThreshold));if(t.keypointTrackerParams.minNumberOfKeypoints<1)throw new Error("Must specify 'minNumberOfKeypoints' to be at least 1, but "+"encountered ".concat(t.keypointTrackerParams.minNumberOfKeypoints));for(var o=0,n=t.keypointTrackerParams.keypointFalloff;o<n.length;o++){var s=n[o];if(s<=0)throw new Error("Must specify each keypoint falloff parameterto be positive "+"but encountered ".concat(s))}}})(e),this.tracks=[],this.maxTracks=e.maxTracks,this.maxAge=1e3*e.maxAge,this.minSimilarity=e.minSimilarity,this.nextID=1}return r.prototype.apply=function(e,t){this.filterOldTracks(t);var o=this.computeSimilarity(e);return this.assignTracks(e,o,t),this.updateTracks(t),e},r.prototype.getTracks=function(){return this.tracks.slice()},r.prototype.getTrackIDs=function(){return new Set(this.tracks.map((function(e){return e.id})))},r.prototype.filterOldTracks=function(e){var t=this;this.tracks=this.tracks.filter((function(o){return e-o.lastTimestamp<=t.maxAge}))},r.prototype.assignTracks=function(e,t,o){for(var n=Array.from(Array(t[0].length).keys()),s=[],i=0,a=Array.from(Array(e.length).keys());i<a.length;i++){var u=a[i];if(n.length!==0){for(var l=-1,c=-1,p=0,m=n;p<m.length;p++){var f=m[p],d=t[u][f];d>=this.minSimilarity&&d>c&&(l=f,c=d)}if(l>=0){var g=this.tracks[l];g=Object.assign(g,this.createTrack(e[u],o,g.id)),e[u].id=g.id;var h=n.indexOf(l);n.splice(h,1)}else s.push(u)}else s.push(u)}for(var x=0,v=s;x<v.length;x++){u=v[x];var N=this.createTrack(e[u],o);this.tracks.push(N),e[u].id=N.id}},r.prototype.updateTracks=function(e){this.tracks.sort((function(t,o){return o.lastTimestamp-t.lastTimestamp})),this.tracks=this.tracks.slice(0,this.maxTracks)},r.prototype.createTrack=function(e,t,o){var n={id:o||this.nextTrackID(),lastTimestamp:t,keypoints:qo([],e.keypoints,!0).map((function(s){return ve({},s)}))};return e.box!==void 0&&(n.box=ve({},e.box)),n},r.prototype.nextTrackID=function(){var e=this.nextID;return this.nextID+=1,e},r.prototype.remove=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this.tracks=this.tracks.filter((function(o){return!e.includes(o.id)}))},r.prototype.reset=function(){this.tracks=[]},r})(),IF=(function(r){function e(t){return r.call(this,t)||this}return Zw(e,r),e.prototype.computeSimilarity=function(t){var o=this;return t.length===0||this.tracks.length===0?[[]]:t.map((function(n){return o.tracks.map((function(s){return o.iou(n,s)}))}))},e.prototype.iou=function(t,o){var n=Math.max(t.box.xMin,o.box.xMin),s=Math.max(t.box.yMin,o.box.yMin),i=Math.min(t.box.xMax,o.box.xMax),a=Math.min(t.box.yMax,o.box.yMax);if(n>=i||s>=a)return 0;var u=(i-n)*(a-s);return u/(t.box.width*t.box.height+o.box.width*o.box.height-u)},e})(uv),kF=(function(r){function e(t){var o=r.call(this,t)||this;return o.keypointThreshold=t.keypointTrackerParams.keypointConfidenceThreshold,o.keypointFalloff=t.keypointTrackerParams.keypointFalloff,o.minNumKeyoints=t.keypointTrackerParams.minNumberOfKeypoints,o}return Zw(e,r),e.prototype.computeSimilarity=function(t){if(t.length===0||this.tracks.length===0)return[[]];for(var o=[],n=0,s=t;n<s.length;n++){for(var i=s[n],a=[],u=0,l=this.tracks;u<l.length;u++){var c=l[u];a.push(this.oks(i,c))}o.push(a)}return o},e.prototype.oks=function(t,o){for(var n=this.area(o.keypoints)+1e-6,s=0,i=0,a=0;a<t.keypoints.length;++a){var u=t.keypoints[a],l=o.keypoints[a];if(!(u.score<this.keypointThreshold||l.score<this.keypointThreshold)){i+=1;var c=Math.pow(u.x-l.x,2)+Math.pow(u.y-l.y,2),p=2*this.keypointFalloff[a];s+=Math.exp(-1*c/(2*n*Math.pow(p,2)))}}return i<this.minNumKeyoints?0:s/i},e.prototype.area=function(t){var o=this,n=t.filter((function(u){return u.score>o.keypointThreshold})),s=Math.min.apply(Math,qo([1],n.map((function(u){return u.x})),!1)),i=Math.max.apply(Math,qo([0],n.map((function(u){return u.x})),!1)),a=Math.min.apply(Math,qo([1],n.map((function(u){return u.y})),!1));return(i-s)*(Math.max.apply(Math,qo([0],n.map((function(u){return u.y})),!1))-a)},e})(uv);function lv(r){switch(r){case et.BlazePose:return ni.reduce((function(e,t,o){return e[t]=o,e}),{});case et.PoseNet:case et.MoveNet:return vr.reduce((function(e,t,o){return e[t]=o,e}),{});default:throw new Error("Model ".concat(r," is not supported."))}}(function(r){r.Keypoint="keypoint",r.BoundingBox="boundingBox"})(Xo||(Xo={})),(function(r){r.MoveNet="MoveNet",r.BlazePose="BlazePose",r.PoseNet="PoseNet"})(et||(et={}));var p0e=Object.freeze({__proto__:null,getKeypointIndexBySide:function(r){switch(r){case et.BlazePose:return WO;case et.PoseNet:case et.MoveNet:return HO;default:throw new Error("Model ".concat(r," is not supported."))}},getAdjacentPairs:function(r){switch(r){case et.BlazePose:return qO;case et.PoseNet:case et.MoveNet:return KO;default:throw new Error("Model ".concat(r," is not supported."))}},getKeypointIndexByName:lv}),$w=["SinglePose.Lightning","SinglePose.Thunder","MultiPose.Lightning"],cv={modelType:"SinglePose.Lightning",enableSmoothing:!0},Rw={},Aw={frequency:30,minCutOff:2.5,beta:300,derivateCutOff:2.5,thresholdCutOff:.5,thresholdBeta:5,disableValueScaling:!0},Jf={maxTracks:18,maxAge:1e3,minSimilarity:.2,keypointTrackerParams:{keypointConfidenceThreshold:.3,keypointFalloff:[.026,.025,.025,.035,.035,.079,.079,.072,.072,.062,.062,.107,.107,.087,.087,.089,.089],minNumberOfKeypoints:4}},_w={maxTracks:18,maxAge:1e3,minSimilarity:.15,trackerParams:{}};function $F(r,e,t,o){for(var n={},s=0,i=vr;s<i.length;s++){var a=i[s];n[a]=[e[t[a]].y*o.height,e[t[a]].x*o.width]}if((function(v,N){return(v[N.left_hip].score>.2||v[N.right_hip].score>.2)&&(v[N.left_shoulder].score>.2||v[N.right_shoulder].score>.2)})(e,t)){var u=(n.left_hip[0]+n.right_hip[0])/2,l=(n.left_hip[1]+n.right_hip[1])/2,c=(function(v,N,E,k,R){for(var A=["left_shoulder","right_shoulder","left_hip","right_hip"],_=0,O=0,F=0;F<A.length;F++)(Z=Math.abs(k-E[A[F]][0]))>_&&(_=Z),(ie=Math.abs(R-E[A[F]][1]))>O&&(O=ie);for(var B=0,M=0,z=0,j=Object.keys(E);z<j.length;z++){var Z,ie,fe=j[z];v[N[fe]].score<.2||((Z=Math.abs(k-E[fe][0]))>B&&(B=Z),(ie=Math.abs(R-E[fe][1]))>M&&(M=ie))}return[_,O,B,M]})(e,t,n,u,l),p=c[0],m=c[1],f=c[2],d=c[3],g=Math.max(1.9*m,1.9*p,1.2*f,1.2*d),h=[u-(g=Math.min(g,Math.max(l,o.width-l,u,o.height-u))),l-g];if(g>Math.max(o.width,o.height)/2)return id(r==null,o);var x=2*g;return{yMin:h[0]/o.height,xMin:h[1]/o.width,yMax:(h[0]+x)/o.height,xMax:(h[1]+x)/o.width,height:(h[0]+x)/o.height-h[0]/o.height,width:(h[1]+x)/o.width-h[1]/o.width}}return id(r==null,o)}function id(r,e){var t,o,n,s;return r?e.width>e.height?(t=1,o=e.height/e.width,n=0,s=(e.width/2-e.height/2)/e.width):(t=e.width/e.height,o=1,n=(e.height/2-e.width/2)/e.height,s=0):e.width>e.height?(t=e.width/e.height,o=1,n=(e.height/2-e.width/2)/e.height,s=0):(t=1,o=e.height/e.width,n=0,s=(e.width/2-e.height/2)/e.width),{yMin:n,xMin:s,yMax:n+t,xMax:s+o,height:t,width:o}}function RF(r){var e,t=r==null?cv:ve({},r);if(t.modelType==null)t.modelType="SinglePose.Lightning";else if($w.indexOf(t.modelType)<0)throw new Error("Invalid architecture ".concat(t.modelType,". ")+"Should be one of ".concat($w));if(t.enableSmoothing==null&&(t.enableSmoothing=!0),t.minPoseScore!=null&&(t.minPoseScore<0||t.minPoseScore>1))throw new Error("minPoseScore should be between 0.0 and 1.0");if(t.multiPoseMaxDimension!=null&&(t.multiPoseMaxDimension%32!=0||t.multiPoseMaxDimension<32))throw new Error("multiPoseMaxDimension must be a multiple of 32 and higher than 0");if(t.modelType==="MultiPose.Lightning"&&t.enableTracking==null&&(t.enableTracking=!0),t.modelType==="MultiPose.Lightning"&&t.enableTracking===!0)if(t.trackerType==null&&(t.trackerType=Xo.BoundingBox),t.trackerType===Xo.Keypoint)t.trackerConfig!=null?t.trackerConfig=(function(o){var n=Dw(Jf,o);return n.keypointTrackerParams=ve({},Jf.keypointTrackerParams),o.keypointTrackerParams!=null&&(o.keypointTrackerParams.keypointConfidenceThreshold!=null&&(n.keypointTrackerParams.keypointConfidenceThreshold=o.keypointTrackerParams.keypointConfidenceThreshold),o.keypointTrackerParams.keypointFalloff!=null&&(n.keypointTrackerParams.keypointFalloff=o.keypointTrackerParams.keypointFalloff),o.keypointTrackerParams.minNumberOfKeypoints!=null&&(n.keypointTrackerParams.minNumberOfKeypoints=o.keypointTrackerParams.minNumberOfKeypoints)),n})(t.trackerConfig):t.trackerConfig=Jf;else{if(t.trackerType!==Xo.BoundingBox)throw new Error("Tracker type not supported by MoveNet");t.trackerConfig!=null?t.trackerConfig=(e=t.trackerConfig,Dw(_w,e)):t.trackerConfig=_w}return t}function Dw(r,e){var t={maxTracks:r.maxTracks,maxAge:r.maxAge,minSimilarity:r.minSimilarity};return e.maxTracks!=null&&(t.maxTracks=e.maxTracks),e.maxAge!=null&&(t.maxAge=e.maxAge),e.minSimilarity!=null&&(t.minSimilarity=e.minSimilarity),t}var AF=(function(){function r(e,t){this.moveNetModel=e,this.modelInputResolution={height:0,width:0},this.keypointIndexByName=lv(et.MoveNet),t.modelType==="SinglePose.Lightning"?(this.modelInputResolution.width=192,this.modelInputResolution.height=192):t.modelType==="SinglePose.Thunder"&&(this.modelInputResolution.width=256,this.modelInputResolution.height=256),this.multiPoseModel=t.modelType==="MultiPose.Lightning",this.multiPoseModel||(this.keypointFilter=new sd(Aw),this.cropRegionFilterYMin=new lo(.9),this.cropRegionFilterXMin=new lo(.9),this.cropRegionFilterYMax=new lo(.9),this.cropRegionFilterXMax=new lo(.9)),this.enableSmoothing=t.enableSmoothing,t.minPoseScore?this.minPoseScore=t.minPoseScore:this.minPoseScore=.25,t.multiPoseMaxDimension?this.multiPoseMaxDimension=t.multiPoseMaxDimension:this.multiPoseMaxDimension=256,this.enableTracking=t.enableTracking,this.multiPoseModel&&this.enableTracking&&(t.trackerType===Xo.Keypoint?this.tracker=new kF(t.trackerConfig):t.trackerType===Xo.BoundingBox&&(this.tracker=new IF(t.trackerConfig)),this.enableSmoothing&&(this.keypointFilterMap=new Map))}return r.prototype.runSinglePersonPoseModel=function(e){return ce(this,void 0,void 0,(function(){var t,o,n,s,i;return pe(this,(function(a){switch(a.label){case 0:if((t=this.moveNetModel.execute(e)).shape.length!==4||t.shape[0]!==1||t.shape[1]!==1||t.shape[2]!==17||t.shape[3]!==3)throw t.dispose(),new Error("Unexpected output shape from model: [".concat(t.shape,"]"));return $r()==="webgpu"?[3,1]:(o=t.dataSync(),[3,3]);case 1:return[4,t.data()];case 2:o=a.sent(),a.label=3;case 3:for(t.dispose(),n={keypoints:[],score:0},s=0,i=0;i<17;++i)n.keypoints[i]={y:o[3*i],x:o[3*i+1],score:o[3*i+2]},n.keypoints[i].score>.2&&(++s,n.score+=n.keypoints[i].score);return s>0&&(n.score/=s),[2,n]}}))}))},r.prototype.runMultiPersonPoseModel=function(e){return ce(this,void 0,void 0,(function(){var t,o,n,s,i,a,u,l;return pe(this,(function(c){switch(c.label){case 0:if((t=this.moveNetModel.execute(e)).shape.length!==3||t.shape[0]!==1||t.shape[2]!==56)throw t.dispose(),new Error("Unexpected output shape from model: [".concat(t.shape,"]"));return $r()==="webgpu"?[3,1]:(o=t.dataSync(),[3,3]);case 1:return[4,t.data()];case 2:o=c.sent(),c.label=3;case 3:for(t.dispose(),n=[],s=o.length/56,i=0;i<s;++i)for(n[i]={keypoints:[]},a=56*i+51,n[i].box={yMin:o[a],xMin:o[a+1],yMax:o[a+2],xMax:o[a+3],width:o[a+3]-o[a+1],height:o[a+2]-o[a]},u=56*i+55,n[i].score=o[u],n[i].keypoints=[],l=0;l<17;++l)n[i].keypoints[l]={y:o[56*i+3*l],x:o[56*i+3*l+1],score:o[56*i+3*l+2]};return[2,n]}}))}))},r.prototype.estimatePoses=function(e,t,o){return t===void 0&&(t=Rw),ce(this,void 0,void 0,(function(){var n,s,i,a,u,l;return pe(this,(function(c){switch(c.label){case 0:return t=(function(p){return p==null?Rw:ve({},p)})(t),e==null?(this.reset(),[2,[]]):(o==null?iv(e)&&(o=1e6*e.currentTime):o*=1e3,n=ad(e),s=ns(n),i=Je(n,0),e instanceof de||n.dispose(),a=[],this.multiPoseModel?[3,2]:[4,this.estimateSinglePose(i,s,o)]);case 1:return a=c.sent(),[3,4];case 2:return[4,this.estimateMultiplePoses(i,s,o)];case 3:a=c.sent(),c.label=4;case 4:for(u=0;u<a.length;++u)for(l=0;l<a[u].keypoints.length;++l)a[u].keypoints[l].name=vr[l],a[u].keypoints[l].y*=s.height,a[u].keypoints[l].x*=s.width;return[2,a]}}))}))},r.prototype.estimateSinglePose=function(e,t,o){return ce(this,void 0,void 0,(function(){var n,s,i,a,u=this;return pe(this,(function(l){switch(l.label){case 0:return this.cropRegion||(this.cropRegion=id(this.cropRegion==null,t)),n=H((function(){var c=st([[u.cropRegion.yMin,u.cropRegion.xMin,u.cropRegion.yMax,u.cropRegion.xMax]]),p=At([1],"int32"),m=[u.modelInputResolution.height,u.modelInputResolution.width];return ee(Lr.cropAndResize(e,c,p,m,"bilinear",0),"int32")})),e.dispose(),[4,this.runSinglePersonPoseModel(n)];case 1:if(s=l.sent(),n.dispose(),s.score<this.minPoseScore)return this.reset(),[2,[]];for(i=0;i<s.keypoints.length;++i)s.keypoints[i].y=this.cropRegion.yMin+s.keypoints[i].y*this.cropRegion.height,s.keypoints[i].x=this.cropRegion.xMin+s.keypoints[i].x*this.cropRegion.width;return o!=null&&this.enableSmoothing&&(s.keypoints=this.keypointFilter.apply(s.keypoints,o,1)),a=$F(this.cropRegion,s.keypoints,this.keypointIndexByName,t),this.cropRegion=this.filterCropRegion(a),[2,[s]]}}))}))},r.prototype.estimateMultiplePoses=function(e,t,o){return ce(this,void 0,void 0,(function(){var n,s,i,a,u,l,c,p,m,f,d,g=this;return pe(this,(function(h){switch(h.label){case 0:return t.width>t.height?(s=this.multiPoseMaxDimension,i=Math.round(this.multiPoseMaxDimension*t.height/t.width),n=Lr.resizeBilinear(e,[i,s]),u=s,l=32*Math.ceil(i/32),a=_t(n,[[0,0],[0,l-i],[0,0],[0,0]])):(s=Math.round(this.multiPoseMaxDimension*t.width/t.height),i=this.multiPoseMaxDimension,n=Lr.resizeBilinear(e,[i,s]),u=32*Math.ceil(s/32),l=i,a=_t(n,[[0,0],[0,0],[0,u-s],[0,0]])),n.dispose(),e.dispose(),c=ee(a,"int32"),a.dispose(),[4,this.runMultiPersonPoseModel(c)];case 1:for(p=h.sent(),c.dispose(),p=p.filter((function(x){return x.score>=g.minPoseScore})),f=0;f<p.length;++f)for(m=0;m<p[f].keypoints.length;++m)p[f].keypoints[m].y*=l/i,p[f].keypoints[m].x*=u/s;if(this.enableTracking&&(this.tracker.apply(p,o),this.enableSmoothing)){for(f=0;f<p.length;++f)this.keypointFilterMap.has(p[f].id)||this.keypointFilterMap.set(p[f].id,new sd(Aw)),p[f].keypoints=this.keypointFilterMap.get(p[f].id).apply(p[f].keypoints,o,1);d=this.tracker.getTrackIDs(),this.keypointFilterMap.forEach((function(x,v){d.has(v)||g.keypointFilterMap.delete(v)}))}return[2,p]}}))}))},r.prototype.filterCropRegion=function(e){if(e){var t=this.cropRegionFilterYMin.apply(e.yMin),o=this.cropRegionFilterXMin.apply(e.xMin),n=this.cropRegionFilterYMax.apply(e.yMax),s=this.cropRegionFilterXMax.apply(e.xMax);return{yMin:t,xMin:o,yMax:n,xMax:s,height:n-t,width:s-o}}return this.cropRegionFilterYMin.reset(),this.cropRegionFilterXMin.reset(),this.cropRegionFilterYMax.reset(),this.cropRegionFilterXMax.reset(),null},r.prototype.dispose=function(){this.moveNetModel.dispose()},r.prototype.reset=function(){this.cropRegion=null,this.resetFilters()},r.prototype.resetFilters=function(){this.keypointFilter.reset(),this.cropRegionFilterYMin.reset(),this.cropRegionFilterXMin.reset(),this.cropRegionFilterYMax.reset(),this.cropRegionFilterXMax.reset()},r})();function _F(r){return r===void 0&&(r=cv),ce(this,void 0,void 0,(function(){var e,t,o,n;return pe(this,(function(s){switch(s.label){case 0:return e=RF(r),o=!0,e.modelUrl?(o=typeof e.modelUrl=="string"&&e.modelUrl.indexOf("https://tfhub.dev")>-1,[4,uo(e.modelUrl,{fromTFHub:o})]):[3,2];case 1:return t=s.sent(),[3,4];case 2:return n=void 0,e.modelType==="SinglePose.Lightning"?n="https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4":e.modelType==="SinglePose.Thunder"?n="https://tfhub.dev/google/tfjs-model/movenet/singlepose/thunder/4":e.modelType==="MultiPose.Lightning"&&(n="https://tfhub.dev/google/tfjs-model/movenet/multipose/lightning/1"),[4,uo(n,{fromTFHub:o})];case 3:t=s.sent(),s.label=4;case 4:return $r()==="webgl"&&$().set("TOPK_LAST_DIM_CPU_HANDOFF_SIZE_THRESHOLD",0),[2,new AF(t,e)]}}))}))}var Ow={architecture:"MobileNetV1",outputStride:16,multiplier:.75,inputResolution:{height:257,width:257}},Fw=["MobileNetV1","ResNet50"],Pw={MobileNetV1:[8,16],ResNet50:[16]},DF=[8,16,32],Lw={MobileNetV1:[.5,.75,1],ResNet50:[1]},Bw=[1,2,4],Mw={maxPoses:1,flipHorizontal:!1},OF={maxPoses:5,flipHorizontal:!1,scoreThreshold:.5,nmsRadius:20},FF=[-123.15,-115.9,-103.06];function ed(r){return Math.floor(r/2)}var PF=(function(){function r(e,t){this.priorityQueue=new Array(e),this.numberOfElements=-1,this.getElementValue=t}return r.prototype.enqueue=function(e){this.priorityQueue[++this.numberOfElements]=e,this.swim(this.numberOfElements)},r.prototype.dequeue=function(){var e=this.priorityQueue[0];return this.exchange(0,this.numberOfElements--),this.sink(0),this.priorityQueue[this.numberOfElements+1]=null,e},r.prototype.empty=function(){return this.numberOfElements===-1},r.prototype.size=function(){return this.numberOfElements+1},r.prototype.all=function(){return this.priorityQueue.slice(0,this.numberOfElements+1)},r.prototype.max=function(){return this.priorityQueue[0]},r.prototype.swim=function(e){for(;e>0&&this.less(ed(e),e);)this.exchange(e,ed(e)),e=ed(e)},r.prototype.sink=function(e){for(;2*e<=this.numberOfElements;){var t=2*e;if(t<this.numberOfElements&&this.less(t,t+1)&&t++,!this.less(e,t))break;this.exchange(e,t),e=t}},r.prototype.getValueAt=function(e){return this.getElementValue(this.priorityQueue[e])},r.prototype.less=function(e,t){return this.getValueAt(e)<this.getValueAt(t)},r.prototype.exchange=function(e,t){var o=this.priorityQueue[e];this.priorityQueue[e]=this.priorityQueue[t],this.priorityQueue[t]=o},r})();function LF(r,e,t,o,n,s){for(var i=s.shape,a=i[0],u=i[1],l=!0,c=Math.max(t-n,0),p=Math.min(t+n+1,a),m=c;m<p;++m){for(var f=Math.max(o-n,0),d=Math.min(o+n+1,u),g=f;g<d;++g)if(s.get(m,g,r)>e){l=!1;break}if(!l)break}return l}function BF(r){return ce(this,void 0,void 0,(function(){return pe(this,(function(e){return[2,Promise.all(r.map((function(t){return t.buffer()})))]}))}))}function pv(r,e,t,o){return{y:o.get(r,e,t),x:o.get(r,e,t+17)}}function mv(r,e,t){var o=pv(r.heatmapY,r.heatmapX,r.id,t),n=o.y,s=o.x;return{x:r.heatmapX*e+s,y:r.heatmapY*e+n}}function fv(r,e,t,o){var n=t.x,s=t.y;return r.some((function(i){var a,u,l,c,p,m,f=i.keypoints;return a=s,u=n,l=f[o].y,c=f[o].x,(p=l-a)*p+(m=c-u)*m<=e}))}var Vw=vr.reduce((function(r,e,t){return r[e]=t,r}),{}),dv=[["nose","left_eye"],["left_eye","left_ear"],["nose","right_eye"],["right_eye","right_ear"],["nose","left_shoulder"],["left_shoulder","left_elbow"],["left_elbow","left_wrist"],["left_shoulder","left_hip"],["left_hip","left_knee"],["left_knee","left_ankle"],["nose","right_shoulder"],["right_shoulder","right_elbow"],["right_elbow","right_wrist"],["right_shoulder","right_hip"],["right_hip","right_knee"],["right_knee","right_ankle"]].map((function(r){var e=r[0],t=r[1];return[Vw[e],Vw[t]]})),td=dv.map((function(r){return r[1]})),Uw=dv.map((function(r){return r[0]}));function Gw(r,e,t){return r<e?e:r>t?t:r}function rd(r,e,t,o){return{y:Gw(Math.round(r.y/e),0,t-1),x:Gw(Math.round(r.x/e),0,o-1)}}function zw(r,e){return{x:r.x+e.x,y:r.y+e.y}}function Ww(r,e,t,o,n,s,i,a){a===void 0&&(a=2);for(var u=o.shape,l=u[0],c=u[1],p={y:e.y,x:e.x},m=zw(p,(function(v,N,E){var k=E.shape[2]/2;return{y:E.get(N.y,N.x,v),x:E.get(N.y,N.x,k+v)}})(r,rd(p,s,l,c),i)),f=0;f<a;f++){var d=rd(m,s,l,c),g=pv(d.y,d.x,t,n);m=zw({x:d.x*s,y:d.y*s},{x:g.x,y:g.y})}var h=rd(m,s,l,c),x=o.get(h.y,h.x,t);return{y:m.y,x:m.x,name:vr[t],score:x}}function MF(r,e,t,o,n,s){var i=e.shape[2],a=td.length,u=new Array(i),l=r.part,c=r.score,p=mv(l,o,t);u[l.id]={score:c,name:vr[l.id],y:p.y,x:p.x};for(var m=a-1;m>=0;--m){var f=td[m],d=Uw[m];u[f]&&!u[d]&&(u[d]=Ww(m,u[f],d,e,t,o,s))}for(m=0;m<a;++m)f=Uw[m],d=td[m],u[f]&&!u[d]&&(u[d]=Ww(m,u[f],d,e,t,o,n));return u}function VF(r,e,t){return t.reduce((function(o,n,s){var i=n.y,a=n.x,u=n.score;return fv(r,e,{y:i,x:a},s)||(o+=u),o}),0)/t.length}function UF(r,e,t,o,n,s,i,a){return i===void 0&&(i=.5),a===void 0&&(a=20),ce(this,void 0,void 0,(function(){var u,l,c,p,m,f,d,g,h,x,v,N;return pe(this,(function(E){switch(E.label){case 0:return[4,BF([r,e,t,o])];case 1:for(u=E.sent(),l=u[0],c=u[1],p=u[2],m=u[3],f=[],d=(function(k,R,A){for(var _=A.shape,O=_[0],F=_[1],B=_[2],M=new PF(O*F*B,(function(fe){return fe.score})),z=0;z<O;++z)for(var j=0;j<F;++j)for(var Z=0;Z<B;++Z){var ie=A.get(z,j,Z);ie<k||LF(Z,ie,z,j,R,A)&&M.enqueue({score:ie,part:{heatmapY:z,heatmapX:j,id:Z}})}return M})(i,1,l),g=a*a;f.length<s&&!d.empty();)h=d.dequeue(),x=mv(h.part,n,c),fv(f,g,x,h.part.id)||(v=MF(h,l,c,n,p,m),N=VF(f,g,v),f.push({keypoints:v,score:N}));return[2,f]}}))}))}function hv(){for(var r,e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];switch(e.length){case 0:r="fn main() ";break;case 1:r="fn main(".concat(e[0]," : i32)");break;default:throw Error("Unreachable")}return r}var GF=(function(){function r(e){this.variableNames=["A","B"],this.size=!0,this.workgroupSize=[32,1,1],this.outputShape=[e[0],1],this.dispatchLayout=co.webgpu_util.flatDispatchLayout(this.outputShape),this.dispatch=co.webgpu_util.computeDispatch(this.dispatchLayout,this.outputShape,this.workgroupSize),this.shaderKey="getpointsConfidenceOp"}return r.prototype.getUserCode=function(){return`
        `.concat(hv("index"),` {
          if (index < uniforms.size) {
            let y = B[index * 2];
            let x = B[index * 2 + 1];
            let outIndex = y * uniforms.aShape.x * uniforms.aShape.z + x * uniforms.aShape.z + index;
            result[index] = A[outIndex];
          }
        }
        `)},r})();function zF(r,e){if(Xr()instanceof co.WebGPUBackend)return(function(t,o){var n=Xr(),s=new GF(o.shape),i=n.runWebGPUProgram(s,[t,o],"float32");return Vt().makeTensorFromTensorInfo(i)})(r,e);throw new Error("getPointsConfidenceWebGPU is not supported in this backend!")}var WF=(function(){function r(e){if(this.variableNames=["A","B"],this.size=!0,this.supportedLastDimension=2,e.length!==2||e[1]!==this.supportedLastDimension)throw new Error("GetOffsetVectorsProgram only supports shape of [x, ".concat(this.supportedLastDimension,"], but current shape is ").concat(e));this.workgroupSize=[32,1,1],this.outputShape=e;var t=[e[0],1];this.dispatchLayout=co.webgpu_util.flatDispatchLayout(t),this.dispatch=co.webgpu_util.computeDispatch(this.dispatchLayout,t,this.workgroupSize),this.shaderKey="GetOffsetVectors"}return r.prototype.getUserCode=function(){return`
    fn getOffsetPoint(y: i32, x: i32, index: i32) -> vec2<i32> {
      let outIndexY = y * uniforms.bShape.x * uniforms.bShape.y + x * uniforms.bShape.y + index;
      let outIndexX = outIndexY + uniforms.bShape.z;
      let outY = i32(B[outIndexY]);
      let outX = i32(B[outIndexX]);
      return vec2<i32>(outY, outX);
    }

    `.concat(hv("index"),` {
      if (index < uniforms.size) {
        let indexY = index * `).concat(this.supportedLastDimension,`;
        let indexX = indexY + 1;
        let heatmapY = A[indexY];
        let heatmapX = A[indexX];
        let out = getOffsetPoint(i32(heatmapY), i32(heatmapX), index);
        result[indexY] = f32(out[0]);
        result[indexX] = f32(out[1]);
      }
    }
    `)},r})();function HF(r,e){if(Xr()instanceof co.WebGPUBackend)return(function(t,o){var n=Xr(),s=new WF(t.shape),i=n.runWebGPUProgram(s,[t,o],"float32");return Vt().makeTensorFromTensorInfo(i)})(r,e);throw new Error("getOffsetVectorsGPU is not supported in this backend!")}function gv(r){var e=r.shape,t=e[0],o=e[1],n=e[2];return H((function(){var s,i,a=D(r,[t*o,n]),u=qu(a,0),l=Je(Y(u,K(o,"int32")),1),c=Je((s=u,i=o,H((function(){var p=Y(s,K(i,"int32"));return q(s,P(p,K(i,"int32")))}))),1);return xe([l,c],1)}))}function KF(r,e,t){return H((function(){var o=(function(n,s){for(var i=[],a=0;a<vr.length;a++){var u=n.get(a,0).valueOf(),l=n.get(a,1).valueOf(),c=qF(u,l,a,s),p=c.x,m=c.y;i.push(m),i.push(p)}return st(i,[vr.length,2])})(r,t);return V(ee(P(r.toTensor(),K(e,"int32")),"float32"),o)}))}function qF(r,e,t,o){return{y:o.get(r,e,t),x:o.get(r,e,t+vr.length)}}function XF(r,e,t){return ce(this,void 0,void 0,(function(){var o,n,s,i,a,u,l,c,p,m;return pe(this,(function(f){switch(f.label){case 0:return o=0,n=gv(r),[4,Promise.all([r.buffer(),e.buffer(),n.buffer()])];case 1:return s=f.sent(),i=s[0],a=s[1],u=s[2],[4,(l=KF(u,t,a)).buffer()];case 2:return c=f.sent(),p=Array.from((function(d,g){for(var h=g.shape[0],x=new Float32Array(h),v=0;v<h;v++){var N=g.get(v,0),E=g.get(v,1);x[v]=d.get(N,E,v)}return x})(i,u)),m=p.map((function(d,g){return o+=d,{y:c.get(g,0),x:c.get(g,1),score:d,name:vr[g]}})),n.dispose(),l.dispose(),[2,{keypoints:m,score:o/m.length}]}}))}))}function jF(r,e,t){return ce(this,void 0,void 0,(function(){var o,n,s;return pe(this,(function(i){return o=gv(r),n=(function(a,u,l){return H((function(){var c=HF(a,l);return V(ee(P(a,K(u,"int32")),"float32"),c)}))})(o,t,e),s=zF(r,o),[2,[n,s]]}))}))}function Hw(r,e){return(r-1)%e==0}var Kw="https://storage.googleapis.com/tfjs-models/savedmodel/posenet/mobilenet/",qw="https://storage.googleapis.com/tfjs-models/savedmodel/posenet/resnet50/";function Xw(r,e){return(function(t,o){return(t-1)%o==0})(r,e)?r:Math.floor(r/e)*e+1}var jw=(function(){function r(e,t){this.posenetModel=e;var o=this.posenetModel.inputs[0].shape;T.assert(o[1]===-1&&o[2]===-1,(function(){return"Input shape [".concat(o[1],", ").concat(o[2],"] ")+"must both be equal to or -1"}));var n,s,i=(n=t.inputResolution,s=t.outputStride,{height:Xw(n.height,s),width:Xw(n.width,s)});(function(a){T.assert(DF.indexOf(a)>=0,(function(){return"outputStride of ".concat(a," is invalid. ")+"It must be either 8 or 16."}))})(t.outputStride),(function(a,u){T.assert(Hw(a.height,u),(function(){return"height of ".concat(a.height," is invalid for output stride ")+"".concat(u,".")})),T.assert(Hw(a.width,u),(function(){return"width of ".concat(a.width," is invalid for output stride ")+"".concat(u,".")}))})(i,t.outputStride),this.inputResolution=i,this.outputStride=t.outputStride,this.architecture=t.architecture}return r.prototype.estimatePoses=function(e,t){return t===void 0&&(t=Mw),ce(this,void 0,void 0,(function(){return pe(this,(function(o){return[2,this.estimatePosesGPU(e,t,!1)]}))}))},r.prototype.estimatePosesGPU=function(e,t,o){return t===void 0&&(t=Mw),o===void 0&&(o=!1),ce(this,void 0,void 0,(function(){var n,s,i,a,u,l,c,p,m,f,d,g,h,x,v,N,E,k;return pe(this,(function(R){switch(R.label){case 0:return n=(function(A){var _=A;if(_.maxPoses==null&&(_.maxPoses=1),_.maxPoses<=0)throw new Error("Invalid maxPoses ".concat(_.maxPoses,". Should be > 0."));if(_.maxPoses>1){if((_=ve(ve({},OF),_)).scoreThreshold<0||_.scoreThreshold>1)throw new Error("Invalid scoreThreshold ".concat(_.scoreThreshold,". ")+"Should be in range [0.0, 1.0]");if(_.nmsRadius<=0)throw new Error("Invalid nmsRadius ".concat(_.nmsRadius,"."))}return _})(t),e==null?[2,o?[[],[]]:[]]:(this.maxPoses=n.maxPoses,s=nd(e,{outputTensorSize:this.inputResolution,keepAspectRatio:!0,borderMode:"replicate"}),i=s.imageTensor,a=s.padding,u=this.architecture==="ResNet50"?V(i,FF):sv(i,[-1,1]),l=this.posenetModel.predict(u),this.architecture==="ResNet50"?(c=ge(l[2],[0]),p=ge(l[3],[0]),m=ge(l[0],[0]),f=ge(l[1],[0])):(c=ge(l[0],[0]),p=ge(l[1],[0]),m=ge(l[2],[0]),f=ge(l[3],[0])),d=Rt(p),this.maxPoses!==1?[3,5]:o?[4,jF(d,c,this.outputStride)]:[3,2]);case 1:return h=R.sent(),v=h[0],x=h[1],g=[v,x],[3,4];case 2:return[4,XF(d,c,this.outputStride)];case 3:v=R.sent(),g=[v],R.label=4;case 4:return[3,7];case 5:if(o)throw new Error("GPU renderer only supports single pose!");return[4,UF(d,c,m,f,this.outputStride,this.maxPoses,n.scoreThreshold,n.nmsRadius)];case 6:g=R.sent(),R.label=7;case 7:if(o){if(n.flipHorizontal===!0)throw new Error("flipHorizontal is not supported!");N=this.getCanvasInfo(ns(e),this.inputResolution,a)}else k=ns(e),E=(function(A,_,O,F){var B=_.height,M=_.width,z=B/(O.height*(1-F.top-F.bottom)),j=M/(O.width*(1-F.left-F.right)),Z=-F.top*O.height,ie=-F.left*O.width;if(j===1&&z===1&&Z===0&&ie===0)return A;for(var fe=0,be=A;fe<be.length;fe++)for(var Oe=0,Zt=be[fe].keypoints;Oe<Zt.length;Oe++){var Jt=Zt[Oe];Jt.x=(Jt.x+ie)*j,Jt.y=(Jt.y+Z)*z}return A})(g,k,this.inputResolution,a),n.flipHorizontal&&(E=(function(A,_){for(var O=0,F=A;O<F.length;O++)for(var B=0,M=F[O].keypoints;B<M.length;B++){var z=M[B];z.x=_.width-1-z.x}return A})(E,k));return i.dispose(),u.dispose(),ne(l),c.dispose(),p.dispose(),m.dispose(),f.dispose(),d.dispose(),[2,o?[g,N]:E]}}))}))},r.prototype.getCanvasInfo=function(e,t,o){var n=e.height,s=e.width,i=n/(t.height*(1-o.top-o.bottom)),a=s/(t.width*(1-o.left-o.right)),u=-o.top*t.height;return[-o.left*t.width,u,a,i,e.width,e.height]},r.prototype.dispose=function(){this.posenetModel.dispose()},r.prototype.reset=function(){},r})();function YF(r){return r===void 0&&(r=Ow),ce(this,void 0,void 0,(function(){var e,t,o,n,s;return pe(this,(function(i){switch(i.label){case 0:return(e=(function(c){var p=c||Ow;if(p.architecture==null&&(p.architecture="MobileNetV1"),Fw.indexOf(p.architecture)<0)throw new Error("Invalid architecture ".concat(p.architecture,". ")+"Should be one of ".concat(Fw));if(p.inputResolution==null&&(p.inputResolution={height:257,width:257}),p.outputStride==null&&(p.outputStride=16),Pw[p.architecture].indexOf(p.outputStride)<0)throw new Error("Invalid outputStride ".concat(p.outputStride,". ")+"Should be one of ".concat(Pw[p.architecture]," ")+"for architecture ".concat(p.architecture,"."));if(p.multiplier==null&&(p.multiplier=1),Lw[p.architecture].indexOf(p.multiplier)<0)throw new Error("Invalid multiplier ".concat(p.multiplier,". ")+"Should be one of ".concat(Lw[p.architecture]," ")+"for architecture ".concat(p.architecture,"."));if(p.quantBytes==null&&(p.quantBytes=4),Bw.indexOf(p.quantBytes)<0)throw new Error("Invalid quantBytes ".concat(p.quantBytes,". ")+"Should be one of ".concat(Bw," ")+"for architecture ".concat(p.architecture,"."));if(p.architecture==="MobileNetV1"&&p.outputStride===32&&p.multiplier!==1)throw new Error("When using an output stride of 32, you must select 1 as the multiplier.");return p})(r)).architecture!=="ResNet50"?[3,2]:(a=e.outputStride,u=e.quantBytes,l="model-stride".concat(a,".json"),t=u===4?qw+"float/"+l:qw+"quant".concat(u,"/")+l,[4,uo(e.modelUrl||t)]);case 1:return o=i.sent(),[2,new jw(o,e)];case 2:return n=(function(c,p,m){var f={1:"100",.75:"075",.5:"050"},d="model-stride".concat(c,".json");return m===4?Kw+"float/".concat(f[p],"/")+d:Kw+"quant".concat(m,"/").concat(f[p],"/")+d})(e.outputStride,e.multiplier,e.quantBytes),[4,uo(e.modelUrl||n)];case 3:return s=i.sent(),[2,new jw(s,e)]}var a,u,l}))}))}function xv(r,e){return ce(this,void 0,void 0,(function(){var t,o;return pe(this,(function(n){switch(r){case et.PoseNet:return[2,YF(e)];case et.BlazePose:if(o=void 0,(t=e)!=null){if(t.runtime==="tfjs")return[2,EF(e)];if(t.runtime==="mediapipe")return[2,ZO(e)];o=t.runtime}throw new Error("Expect modelConfig.runtime to be either 'tfjs' "+"or 'mediapipe', but got ".concat(o));case et.MoveNet:return[2,_F(e)];default:throw new Error("".concat(r," is not a supported model name."))}}))}))}var yv={modelType:{SINGLEPOSE_LIGHTNING:"SinglePose.Lightning",SINGLEPOSE_THUNDER:"SinglePose.Thunder",MULTIPOSE_LIGHTNING:"MultiPose.Lightning"}};var jo={},xc={alpha:!1,antialias:!1,premultipliedAlpha:!1,preserveDrawingBuffer:!1,depth:!1,stencil:!1,failIfMajorPerformanceCaveat:!0};function bv(r,e){jo[r]=e}function Ot(r,e){if(!(r in jo)||e!=null){let o=JF(r,e);if(o!==null)jo[r]=o;else return console.log("Could not get context for WebGL version",r),null}let t=jo[r];return t==null||t.isContextLost()?(delete jo[r],Ot(r)):(t.disable(t.DEPTH_TEST),t.disable(t.STENCIL_TEST),t.disable(t.BLEND),t.disable(t.DITHER),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SAMPLE_COVERAGE),t.enable(t.SCISSOR_TEST),t.enable(t.CULL_FACE),t.cullFace(t.BACK),jo[r])}function ZF(r){if(!$().getBool("IS_SAFARI")&&typeof OffscreenCanvas<"u"&&r===2)return new OffscreenCanvas(300,150);if(typeof document<"u")return document.createElement("canvas");throw new Error("Cannot create a canvas in this context")}function JF(r,e){if(r!==1&&r!==2)throw new Error("Cannot get WebGL rendering context, WebGL is disabled.");let t=e??ZF(r);return t.addEventListener("webglcontextlost",o=>{o.preventDefault(),delete jo[r]},!1),$().getBool("SOFTWARE_WEBGL_ENABLED")&&(xc.failIfMajorPerformanceCaveat=!1),r===1?t.getContext("webgl",xc)||t.getContext("experimental-webgl",xc):t.getContext("webgl2",xc)}var po;(function(r){r[r.DENSE=0]="DENSE",r[r.SHARED_BATCH=1]="SHARED_BATCH"})(po||(po={}));var je;(function(r){r[r.RENDER=0]="RENDER",r[r.UPLOAD=1]="UPLOAD",r[r.PIXELS=2]="PIXELS",r[r.DOWNLOAD=3]="DOWNLOAD"})(je||(je={}));var We;(function(r){r[r.UNPACKED_FLOAT16=0]="UNPACKED_FLOAT16",r[r.UNPACKED_FLOAT32=1]="UNPACKED_FLOAT32",r[r.PACKED_4X1_UNSIGNED_BYTE=2]="PACKED_4X1_UNSIGNED_BYTE",r[r.PACKED_2X2_FLOAT32=3]="PACKED_2X2_FLOAT32",r[r.PACKED_2X2_FLOAT16=4]="PACKED_2X2_FLOAT16"})(We||(We={}));function Yo(r,e){return[e,r]}function wv(r,e){return r*e}function si(r){let e=T.sizeFromShape(r),t=Math.ceil(e/4);return T.sizeToSquarishShape(t)}function Tr(r,e){return[Math.max(1,Math.ceil(e/2)),Math.max(1,Math.ceil(r/2))]}function vv(r,e){let[t,o]=Tr(r,e);return t*o*4}function ii(r,e){let t=r,o,n,s,i,a,u,l,c,p,m;return $().getNumber("WEBGL_VERSION")===2?(o=t.R32F,n=t.R16F,s=t.RGBA16F,i=t.RGBA32F,a=t.RED,l=4,c=1,p=t.HALF_FLOAT,m=t.FLOAT,u=t.RGBA8):(o=r.RGBA,n=r.RGBA,s=r.RGBA,i=t.RGBA,a=r.RGBA,l=4,c=4,p=e!=null?e.HALF_FLOAT_OES:null,m=r.FLOAT,u=r.RGBA),{internalFormatFloat:o,internalFormatHalfFloat:n,internalFormatPackedHalfFloat:s,internalFormatPackedFloat:i,textureFormatFloat:a,downloadTextureFormat:u,downloadUnpackNumChannels:l,defaultNumChannels:c,textureTypeHalfFloat:p,textureTypeFloat:m}}function G(r,e){let t=e();return $().getBool("DEBUG")&&eP(r),t}function eP(r){let e=r.getError();if(e!==r.NO_ERROR)throw new Error("WebGL Error: "+oP(r,e))}var tP=596e-10,rP=65504;function Tv(r){return!!($().getBool("WEBGL_RENDER_FLOAT32_ENABLED")||r===0||tP<Math.abs(r)&&Math.abs(r)<rP)}function oP(r,e){switch(e){case r.NO_ERROR:return"NO_ERROR";case r.INVALID_ENUM:return"INVALID_ENUM";case r.INVALID_VALUE:return"INVALID_VALUE";case r.INVALID_OPERATION:return"INVALID_OPERATION";case r.INVALID_FRAMEBUFFER_OPERATION:return"INVALID_FRAMEBUFFER_OPERATION";case r.OUT_OF_MEMORY:return"OUT_OF_MEMORY";case r.CONTEXT_LOST_WEBGL:return"CONTEXT_LOST_WEBGL";default:return`Unknown error code ${e}`}}function ai(r,e){return Br(r,()=>r.getExtension(e),'Extension "'+e+'" not supported on this browser.')}function Sv(r,e){let t=Br(r,()=>r.createShader(r.VERTEX_SHADER),"Unable to create vertex WebGLShader.");if(G(r,()=>r.shaderSource(t,e)),G(r,()=>r.compileShader(t)),r.getShaderParameter(t,r.COMPILE_STATUS)===!1)throw console.log(r.getShaderInfoLog(t)),new Error("Failed to compile vertex shader.");return t}function Cv(r,e){let t=Br(r,()=>r.createShader(r.FRAGMENT_SHADER),"Unable to create fragment WebGLShader.");if(G(r,()=>r.shaderSource(t,e)),G(r,()=>r.compileShader(t)),$().get("ENGINE_COMPILE_ONLY"))return t;if(r.getShaderParameter(t,r.COMPILE_STATUS)===!1)throw md(e,r.getShaderInfoLog(t)),new Error("Failed to compile fragment shader.");return t}var nP=/ERROR: [0-9]+:([0-9]+):/g;function md(r,e){let t=nP.exec(e);if(t==null){console.log(`Couldn't parse line number in error: ${e}`),console.log(r);return}let o=+t[1],n=r.split(`
`),s=n.length.toString().length+2,i=n.map((p,m)=>T.rightPad((m+1).toString(),s)+p),a=0;for(let p=0;p<i.length;p++)a=Math.max(i[p].length,a);let u=i.slice(0,o-1),l=i.slice(o-1,o),c=i.slice(o);console.log(u.join(`
`)),console.log(e.split(`
`)[0]),console.log(`%c ${T.rightPad(l[0],a)}`,"border:1px solid red; background-color:#e3d2d2; color:#a61717"),console.log(c.join(`
`))}function Nv(r){return Br(r,()=>r.createProgram(),"Unable to create WebGLProgram.")}function Ev(r,e){if(G(r,()=>r.linkProgram(e)),!$().get("ENGINE_COMPILE_ONLY")&&r.getProgramParameter(e,r.LINK_STATUS)===!1)throw console.log(r.getProgramInfoLog(e)),new Error("Failed to link vertex and fragment shaders.")}function bc(r,e){if(G(r,()=>r.validateProgram(e)),r.getProgramParameter(e,r.VALIDATE_STATUS)===!1)throw console.log(r.getProgramInfoLog(e)),new Error("Shader program validation failed.")}function Iv(r,e){let t=Br(r,()=>r.createBuffer(),"Unable to create WebGLBuffer");return G(r,()=>r.bindBuffer(r.ARRAY_BUFFER,t)),G(r,()=>r.bufferData(r.ARRAY_BUFFER,e,r.STATIC_DRAW)),t}function kv(r,e){let t=Br(r,()=>r.createBuffer(),"Unable to create WebGLBuffer");return G(r,()=>r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,t)),G(r,()=>r.bufferData(r.ELEMENT_ARRAY_BUFFER,e,r.STATIC_DRAW)),t}function $v(r){return Br(r,()=>r.createTexture(),"Unable to create WebGLTexture.")}function Rv(r,e){let t=$().getNumber("WEBGL_MAX_TEXTURE_SIZE");if(r<=0||e<=0){let o=`[${r}x${e}]`;throw new Error("Requested texture size "+o+" is invalid.")}if(r>t||e>t){let o=`[${r}x${e}]`,n=`[${t}x${t}]`;throw new Error("Requested texture size "+o+" greater than WebGL maximum on this browser / GPU "+n+".")}}function Av(r){return Br(r,()=>r.createFramebuffer(),"Unable to create WebGLFramebuffer.")}function fd(r,e,t,o,n,s,i){let a=r.getAttribLocation(e,t);return a===-1?!1:(G(r,()=>r.bindBuffer(r.ARRAY_BUFFER,o)),G(r,()=>r.vertexAttribPointer(a,n,r.FLOAT,!1,s,i)),G(r,()=>r.enableVertexAttribArray(a)),!0)}function sP(r,e,t){aP(r,t),G(r,()=>r.activeTexture(r.TEXTURE0+t)),G(r,()=>r.bindTexture(r.TEXTURE_2D,e))}function _v(r,e,t){return Br(r,()=>r.getUniformLocation(e,t),'uniform "'+t+'" not present in program.')}function Dv(r,e,t){return r.getUniformLocation(e,t)}function Ov(r,e,t,o){G(r,()=>sP(r,e,o)),G(r,()=>r.uniform1i(t,o))}function wc(r,e,t){G(r,()=>r.bindFramebuffer(r.FRAMEBUFFER,t)),G(r,()=>r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,e,0))}function dd(r,e){G(r,()=>r.bindFramebuffer(r.FRAMEBUFFER,e)),G(r,()=>r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,null,0))}function ui(r){let e=r.checkFramebufferStatus(r.FRAMEBUFFER);if(e!==r.FRAMEBUFFER_COMPLETE)throw new Error("Error binding framebuffer: "+iP(r,e))}function iP(r,e){switch(e){case r.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:return"FRAMEBUFFER_INCOMPLETE_ATTACHMENT";case r.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:return"FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT";case r.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:return"FRAMEBUFFER_INCOMPLETE_DIMENSIONS";case r.FRAMEBUFFER_UNSUPPORTED:return"FRAMEBUFFER_UNSUPPORTED";default:return`unknown error ${e}`}}function Br(r,e,t){let o=G(r,()=>e());if(o==null)throw new Error(t);return o}function aP(r,e){let t=r.MAX_COMBINED_TEXTURE_IMAGE_UNITS-1,o=e+r.TEXTURE0;if(o<r.TEXTURE0||o>t){let n=`[gl.TEXTURE0, gl.TEXTURE${t}]`;throw new Error(`textureUnit must be in ${n}.`)}}function mo(r,e=2){return T.sizeFromShape(r.slice(0,r.length-e))}function fo(r){if(r.length===0)throw Error("Cannot get rows and columns of an empty shape array.");return[r.length>1?r[r.length-2]:1,r[r.length-1]]}function li(r){let e=[1,1,1];return r.length===0||r.length===1&&r[0]===1||(e=[mo(r),...fo(r)]),e}function Fv(r,e=!1){let t=$().getNumber("WEBGL_MAX_TEXTURE_SIZE"),o=$().getNumber("WEBGL_MAX_SIZE_FOR_NARROW_TEXTURE");o===1/0&&$().getBool("WEBGL_AUTO_SQUARIFY_NARROW_TEXTURE_SHAPE")&&(o=t/2),e&&(t=t*2,o=o*2,r=r.map((a,u)=>u>=r.length-2?T.nearestLargerEven(r[u]):r[u]),r.length===1&&(r=[2,r[0]])),r.length!==2&&(r=T.squeezeShape(r).newShape);let n=T.sizeFromShape(r),s=null;r.length<=1&&n<=t?s=[1,n]:r.length===2&&r[0]<=t&&r[1]<=t?s=r:r.length===3&&r[0]*r[1]<=t&&r[2]<=t?s=[r[0]*r[1],r[2]]:r.length===3&&r[0]<=t&&r[1]*r[2]<=t?s=[r[0],r[1]*r[2]]:r.length===4&&r[0]*r[1]*r[2]<=t&&r[3]<=t?s=[r[0]*r[1]*r[2],r[3]]:r.length===4&&r[0]<=t&&r[1]*r[2]*r[3]<=t&&(s=[r[0],r[1]*r[2]*r[3]]);let i=s!=null&&Math.max(...s)>o&&Math.min(...s)<=(e?2:1)&&Math.min(...s)>0;if(s==null||i)if(e){let a=mo(r),u=2,l=2;r.length&&([u,l]=fo(r)),n=a*(u/2)*(l/2),s=T.sizeToSquarishShape(n).map(c=>c*2)}else s=T.sizeToSquarishShape(n);return s}function yc(r){return r%2===0}function Qo(r,e){if(r=r.slice(-2),e=e.slice(-2),T.arraysEqual(r,e)||!r.length||!e.length||r[0]===0||r[1]===0||e[0]===0||e[1]===0)return!0;if(r.length!==e.length){let t=r[r.length-1],o=e[e.length-1];if(t===o||yc(t)&&yc(o)&&(r[0]===1||e[0]===1))return!0}return r[1]===e[1]&&yc(r[0])&&yc(e[0])}var ld,cd;function Pv(r){if(ld==null){let e=Ot(r);ld=e.getParameter(e.MAX_TEXTURE_SIZE)}return ld}function Lv(r){if(cd==null){let e=Ot(r);cd=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS)}return Math.min(16,cd)}function Bv(r){if(r===0)return 0;let e,t=Ot(r);return Wt(t,"EXT_disjoint_timer_query_webgl2")&&r===2?e=2:Wt(t,"EXT_disjoint_timer_query")?e=1:e=0,e}function Wt(r,e){return r.getExtension(e)!=null}function hd(r){try{if(Ot(r)!=null)return!0}catch(e){return console.log("Error when getting WebGL context: ",e),!1}return!1}function Mv(r){if(r===0)return!1;let e=Ot(r);if(r===1){if(!Wt(e,"OES_texture_float"))return!1}else if(!Wt(e,"EXT_color_buffer_float"))return!1;return pd(e)}function Vv(r){if(r===0)return!1;let e=Ot(r);if(r===1){if(!Wt(e,"OES_texture_float")||!Wt(e,"WEBGL_color_buffer_float"))return!1}else{if(Wt(e,"EXT_color_buffer_float"))return pd(e);let o="EXT_color_buffer_half_float";if(Wt(e,o)){let n=e.getExtension(o);return uP(e,n)}return!1}return pd(e)}function pd(r){let e=ii(r),t=r.createTexture();r.bindTexture(r.TEXTURE_2D,t),r.texImage2D(r.TEXTURE_2D,0,e.internalFormatFloat,1,1,0,e.textureFormatFloat,e.textureTypeFloat,null);let s=r.createFramebuffer();r.bindFramebuffer(r.FRAMEBUFFER,s),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,t,0);let i=r.checkFramebufferStatus(r.FRAMEBUFFER)===r.FRAMEBUFFER_COMPLETE;return r.bindTexture(r.TEXTURE_2D,null),r.bindFramebuffer(r.FRAMEBUFFER,null),r.deleteTexture(t),r.deleteFramebuffer(s),i}function uP(r,e){let t=ii(r,e),o=r.createTexture();r.bindTexture(r.TEXTURE_2D,o),r.texImage2D(r.TEXTURE_2D,0,t.internalFormatHalfFloat,1,1,0,t.textureFormatFloat,t.textureTypeHalfFloat,null);let i=r.createFramebuffer();r.bindFramebuffer(r.FRAMEBUFFER,i),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,o,0);let a=r.checkFramebufferStatus(r.FRAMEBUFFER)===r.FRAMEBUFFER_COMPLETE;return r.bindTexture(r.TEXTURE_2D,null),r.bindFramebuffer(r.FRAMEBUFFER,null),r.deleteTexture(o),r.deleteFramebuffer(i),a}function Uv(r){return r!==2?!1:Ot(r).fenceSync!=null}function Sr(r,e){Array.isArray(r)||(r=[r]),r.forEach(t=>{t!=null&&T.assert(t.dtype!=="complex64",()=>`${e} does not support complex64 tensors in the WebGL backend.`)})}var X=$();X.registerFlag("HAS_WEBGL",()=>X.getNumber("WEBGL_VERSION")>0);X.registerFlag("WEBGL_VERSION",()=>hd(2)?2:hd(1)?1:0);X.registerFlag("WEBGL_CHECK_NUMERICAL_PROBLEMS",()=>!1);X.registerFlag("WEBGL_BUFFER_SUPPORTED",()=>X.get("WEBGL_VERSION")===2);X.registerFlag("WEBGL_CPU_FORWARD",()=>!0);X.registerFlag("WEBGL_FORCE_F16_TEXTURES",()=>!1);X.registerFlag("WEBGL_PACK",()=>X.getBool("HAS_WEBGL"));X.registerFlag("WEBGL_PACK_NORMALIZATION",()=>X.getBool("WEBGL_PACK"));X.registerFlag("WEBGL_PACK_CLIP",()=>X.getBool("WEBGL_PACK"));X.registerFlag("WEBGL_PACK_DEPTHWISECONV",()=>X.getBool("WEBGL_PACK"));X.registerFlag("WEBGL_PACK_BINARY_OPERATIONS",()=>X.getBool("WEBGL_PACK"));X.registerFlag("WEBGL_PACK_UNARY_OPERATIONS",()=>X.getBool("WEBGL_PACK"));X.registerFlag("WEBGL_PACK_ARRAY_OPERATIONS",()=>X.getBool("WEBGL_PACK"));X.registerFlag("WEBGL_PACK_IMAGE_OPERATIONS",()=>X.getBool("WEBGL_PACK"));X.registerFlag("WEBGL_PACK_REDUCE",()=>X.getBool("WEBGL_PACK"));X.registerFlag("WEBGL_LAZILY_UNPACK",()=>X.getBool("WEBGL_PACK"));X.registerFlag("WEBGL_CONV_IM2COL",()=>X.getBool("WEBGL_PACK"));X.registerFlag("WEBGL_PACK_CONV2DTRANSPOSE",()=>X.getBool("WEBGL_PACK"));X.registerFlag("WEBGL_MAX_TEXTURE_SIZE",()=>Pv(X.getNumber("WEBGL_VERSION")));X.registerFlag("WEBGL_MAX_TEXTURES_IN_SHADER",()=>Lv(X.getNumber("WEBGL_VERSION")));X.registerFlag("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION",()=>{let r=X.getNumber("WEBGL_VERSION");return r===0?0:Bv(r)});X.registerFlag("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE",()=>X.getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")>0&&!qr.isMobile());X.registerFlag("WEBGL_RENDER_FLOAT32_CAPABLE",()=>Mv(X.getNumber("WEBGL_VERSION")));X.registerFlag("WEBGL_RENDER_FLOAT32_ENABLED",()=>X.getBool("WEBGL_FORCE_F16_TEXTURES")?!1:X.getBool("WEBGL_RENDER_FLOAT32_CAPABLE"));X.registerFlag("WEBGL_DOWNLOAD_FLOAT_ENABLED",()=>Vv(X.getNumber("WEBGL_VERSION")));X.registerFlag("WEBGL_FENCE_API_ENABLED",()=>Uv(X.getNumber("WEBGL_VERSION")));X.registerFlag("WEBGL_SIZE_UPLOAD_UNIFORM",()=>X.getBool("WEBGL_RENDER_FLOAT32_ENABLED")?4:0);X.registerFlag("WEBGL_DELETE_TEXTURE_THRESHOLD",()=>-1,r=>{if(typeof r!="number")throw new Error(`WEBGL_DELETE_TEXTURE_THRESHOLD must be a number but got ${r}.`);if(r<0&&r!==-1)throw new Error(`WEBGL_DELETE_TEXTURE_THRESHOLD must be -1 (indicating never delete) or at least 0, but got ${r}.`)});X.registerFlag("WEBGL_FLUSH_THRESHOLD",()=>qr.isMobile()?1:-1,r=>{if(typeof r!="number")throw new Error(`WEBGL_FLUSH_THRESHOLD must be a number but got ${r}.`);if(r<0&&r!==-1)throw new Error(`WEBGL_FLUSH_THRESHOLD must be -1 (indicating never manual flush) or at least 0, but got ${r}.`)});X.registerFlag("CPU_HANDOFF_SIZE_THRESHOLD",()=>128);X.registerFlag("WEBGL_USE_SHAPES_UNIFORMS",()=>!1);X.registerFlag("TOPK_LAST_DIM_CPU_HANDOFF_SIZE_THRESHOLD",()=>1e5);X.registerFlag("TOPK_K_CPU_HANDOFF_THRESHOLD",()=>128);X.registerFlag("WEBGL_EXP_CONV",()=>!1);X.registerFlag("SOFTWARE_WEBGL_ENABLED",()=>X.getBool("IS_TEST"));X.registerFlag("WEBGL_MAX_SIZE_FOR_NARROW_TEXTURE",()=>1/0);X.registerFlag("WEBGL_AUTO_SQUARIFY_NARROW_TEXTURE_SHAPE",()=>!1);X.registerFlag("WEBGL2_ISNAN_CUSTOM",()=>!1);X.registerFlag("ENGINE_COMPILE_ONLY",()=>!1);function Ee(){let r,e,t,o,n,s,i,a,u,l;return $().getNumber("WEBGL_VERSION")===2?(r="#version 300 es",e="in",t="out",o="in",n="texture",s="outputColor",i="out vec4 outputColor;",a=$().getBool("WEBGL2_ISNAN_CUSTOM")?`
      bool isnan_custom(float val) {
        uint floatToUint = floatBitsToUint(val);
        return (floatToUint & 0x7fffffffu) > 0x7f800000u;
      }

      bvec4 isnan_custom(vec4 val) {
        return bvec4(isnan_custom(val.x),
          isnan_custom(val.y), isnan_custom(val.z), isnan_custom(val.w));
      }

      #define isnan(value) isnan_custom(value)
    `:"",u="",l=`
      #define round(value) newRound(value)
      int newRound(float value) {
        return int(floor(value + 0.5));
      }

      ivec4 newRound(vec4 value) {
        return ivec4(floor(value + vec4(0.5)));
      }
    `):(r="",e="attribute",t="varying",o="varying",n="texture2D",s="gl_FragColor",i="",a=`
      #define isnan(value) isnan_custom(value)
      bool isnan_custom(float val) {
        return (val > 0. || val < 1. || val == 0.) ? false : true;
      }
      bvec4 isnan_custom(vec4 val) {
        return bvec4(isnan(val.x), isnan(val.y), isnan(val.z), isnan(val.w));
      }
    `,u=`
      uniform float INFINITY;

      bool isinf(float val) {
        return abs(val) == INFINITY;
      }
      bvec4 isinf(vec4 val) {
        return equal(abs(val), vec4(INFINITY));
      }
    `,l=`
      int round(float value) {
        return int(floor(value + 0.5));
      }

      ivec4 round(vec4 value) {
        return ivec4(floor(value + vec4(0.5)));
      }
    `),{version:r,attribute:e,varyingVs:t,varyingFs:o,texture2D:n,output:s,defineOutput:i,defineSpecialNaN:a,defineSpecialInf:u,defineRound:l}}function sr(r,e,t="index"){let o=T.computeStrides(e);return o.map((n,s)=>{let i=`int ${r[s]} = ${t} / ${n}`,a=s===o.length-1?`int ${r[s+1]} = ${t} - ${r[s]} * ${n}`:`index -= ${r[s]} * ${n}`;return`${i}; ${a};`}).join("")}function Zo(r,e,t="index"){let o=T.computeStrides(e);return o.map((n,s)=>{let i=`int ${r[s]} = ${t} / outShapeStrides[${s}]`,a=s===o.length-1?`int ${r[s+1]} = ${t} - ${r[s]} * outShapeStrides[${s}]`:`index -= ${r[s]} * outShapeStrides[${s}]`;return`${i}; ${a};`}).join("")}function lP(r,e){let t=r.length,o=r.map(s=>`${e}[${s}]`),n=new Array(t-1);n[t-2]=o[t-1];for(let s=t-3;s>=0;--s)n[s]=`(${n[s+1]} * ${o[s+1]})`;return n}function Gv(r,e,t="index"){let o=r.map((s,i)=>i),n=lP(o,e);return n.map((s,i)=>{let a=`int ${r[i]} = ${t} / ${n[i]}`,u=i===n.length-1?`int ${r[i+1]} = ${t} - ${r[i]} * ${n[i]}`:`index -= ${r[i]} * ${n[i]}`;return`${a}; ${u};`}).join("")}function ss(r){let e=T.computeStrides(r).map(t=>t.toString());return`
  int getFlatIndex(ivec3 coords) {
    return coords.x * ${e[0]} + coords.y * ${e[1]} + coords.z;
  }
`}function is(){return`
  int getFlatIndex(ivec3 coords) {
    return coords.x * outShapeStrides[0] + coords.y * outShapeStrides[1] + coords.z;
  }
`}var Tc=`
  const float FLOAT_MAX = 1.70141184e38;
  const float FLOAT_MIN = 1.17549435e-38;

  lowp vec4 encode_float(highp float v) {
    if (isnan(v)) {
      return vec4(255, 255, 255, 255);
    }

    highp float av = abs(v);

    if(av < FLOAT_MIN) {
      return vec4(0.0, 0.0, 0.0, 0.0);
    } else if(v > FLOAT_MAX) {
      return vec4(0.0, 0.0, 128.0, 127.0) / 255.0;
    } else if(v < -FLOAT_MAX) {
      return vec4(0.0, 0.0,  128.0, 255.0) / 255.0;
    }

    highp vec4 c = vec4(0,0,0,0);

    highp float e = floor(log2(av));
    highp float m = exp2(fract(log2(av))) - 1.0;

    c[2] = floor(128.0 * m);
    m -= c[2] / 128.0;
    c[1] = floor(32768.0 * m);
    m -= c[1] / 32768.0;
    c[0] = floor(8388608.0 * m);

    highp float ebias = e + 127.0;
    c[3] = floor(ebias / 2.0);
    ebias -= c[3] * 2.0;
    c[2] += floor(ebias) * 128.0;

    c[3] += 128.0 * step(0.0, -v);

    return c / 255.0;
  }
`;var{getBroadcastDims:zv}=I;function Wv(r,e,t){let o=[];if(r.forEach(f=>{let d=T.sizeFromShape(f.shapeInfo.logicalShape);if(f.shapeInfo.isUniform?o.push(`uniform float ${f.name}${d>1?`[${d}]`:""};`):(o.push(`uniform sampler2D ${f.name};`),o.push(`uniform int offset${f.name};`)),t.enableShapeUniforms){let{uniformShape:g}=Sc(t.packedInputs,f.shapeInfo.logicalShape,f.shapeInfo.texShape);switch(g.length){case 1:o.push(`uniform int ${f.name}Shape;`);break;case 2:o.push(`uniform ivec2 ${f.name}Shape;`);break;case 3:o.push(`uniform ivec3 ${f.name}Shape;`);break;case 4:o.push(`uniform ivec4 ${f.name}Shape;`);break;default:break}o.push(`uniform ivec2 ${f.name}TexShape;`)}}),t.enableShapeUniforms){switch(e.logicalShape.length){case 1:o.push("uniform int outShape;");break;case 2:o.push("uniform ivec2 outShape;"),o.push("uniform int outShapeStrides;");break;case 3:o.push("uniform ivec3 outShape;"),o.push("uniform ivec2 outShapeStrides;");break;case 4:o.push("uniform ivec4 outShape;"),o.push("uniform ivec3 outShapeStrides;");break;default:break}o.push("uniform ivec2 outTexShape;")}t.customUniforms&&t.customUniforms.forEach(f=>{o.push(`uniform ${f.type} ${f.name}${f.arrayIndex?`[${f.arrayIndex}]`:""};`)});let n=o.join(`
`),s=r.map(f=>cP(f,e,t.packedInputs,t.enableShapeUniforms)).join(`
`),i=e.texShape,a=Ee(),u=fP(a),l,c,p=gP(a);return e.isPacked?(l=pP(e.logicalShape,i,t.enableShapeUniforms),c=hP(a)):(l=mP(e.logicalShape,i,t.enableShapeUniforms),c=dP(a)),t.packedInputs&&(p+=wP),[p,u,c,n,l,s,t.userCode].join(`
`)}function us(r,e=!1){let t=r.shapeInfo.logicalShape;switch(t.length){case 0:return _P(r,e);case 1:return OP(r,e);case 2:return PP(r,e);case 3:return BP(r,e);case 4:return VP(r,e);case 5:return UP(r);case 6:return GP(r);default:throw new Error(`${t.length}-D input sampling is not yet supported`)}}function Hv(r,e){switch(r.shapeInfo.logicalShape.length){case 0:return AP(r);case 1:return DP(r,e);case 2:return FP(r,e);case 3:return LP(r,e);default:return MP(r,e)}}function cP(r,e,t=!1,o){let n="";t?n+=Hv(r,o):n+=us(r,o);let s=r.shapeInfo.logicalShape,i=e.logicalShape;return s.length<=i.length&&(t?n+=zP(r,e):n+=WP(r,e)),n}function pP(r,e,t){switch(r.length){case 0:return Kv();case 1:return vP(r,e,t);case 2:return $P(r,e,t);case 3:return SP(r,e,t);default:return NP(r,e,t)}}function mP(r,e,t){switch(r.length){case 0:return Kv();case 1:return TP(r,e,t);case 2:return RP(r,e,t);case 3:return CP(r,e,t);case 4:return EP(r,e,t);case 5:return IP(r,e);case 6:return kP(r,e);default:throw new Error(`${r.length}-D output sampling is not yet supported`)}}function fP(r){return`
    float sampleTexture(sampler2D textureSampler, vec2 uv) {
      return ${r.texture2D}(textureSampler, uv).r;
    }
  `}function dP(r){return`
    void setOutput(float val) {
      ${r.output} = vec4(val, 0, 0, 0);
    }
  `}function hP(r){return`
    void setOutput(vec4 val) {
      ${r.output} = val;
    }
  `}function gP(r){return`${r.version}
    precision highp float;
    precision highp int;
    precision highp sampler2D;
    ${r.varyingFs} vec2 resultUV;
    ${r.defineOutput}
    const vec2 halfCR = vec2(0.5, 0.5);

    struct ivec5
    {
      int x;
      int y;
      int z;
      int w;
      int u;
    };

    struct ivec6
    {
      int x;
      int y;
      int z;
      int w;
      int u;
      int v;
    };

    uniform float NAN;
    ${r.defineSpecialNaN}
    ${r.defineSpecialInf}
    ${r.defineRound}

    int imod(int x, int y) {
      return x - y * (x / y);
    }

    int idiv(int a, int b, float sign) {
      int res = a / b;
      int mod = imod(a, b);
      if (sign < 0. && mod != 0) {
        res -= 1;
      }
      return res;
    }

    //Based on the work of Dave Hoskins
    //https://www.shadertoy.com/view/4djSRW
    #define HASHSCALE1 443.8975
    float random(float seed){
      vec2 p = resultUV * seed;
      vec3 p3  = fract(vec3(p.xyx) * HASHSCALE1);
      p3 += dot(p3, p3.yzx + 19.19);
      return fract((p3.x + p3.y) * p3.z);
    }

    ${xP}
    ${yP}
    ${bP}
  `}var xP=`
vec2 uvFromFlat(int texNumR, int texNumC, int index) {
  int texR = index / texNumC;
  int texC = index - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
vec2 packedUVfrom1D(int texNumR, int texNumC, int index) {
  int texelIndex = index / 2;
  int texR = texelIndex / texNumC;
  int texC = texelIndex - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
`,yP=`
vec2 packedUVfrom2D(int texelsInLogicalRow, int texNumR,
  int texNumC, int row, int col) {
  int texelIndex = (row / 2) * texelsInLogicalRow + (col / 2);
  int texR = texelIndex / texNumC;
  int texC = texelIndex - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
`,bP=`
vec2 packedUVfrom3D(int texNumR, int texNumC,
    int texelsInBatch, int texelsInLogicalRow, int b,
    int row, int col) {
  int index = b * texelsInBatch + (row / 2) * texelsInLogicalRow + (col / 2);
  int texR = index / texNumC;
  int texC = index - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
`,wP=`
  float getChannel(vec4 frag, vec2 innerDims) {
    vec2 modCoord = mod(innerDims, 2.);
    return modCoord.x == 0. ?
      (modCoord.y == 0. ? frag.r : frag.g) :
      (modCoord.y == 0. ? frag.b : frag.a);
  }
  float getChannel(vec4 frag, int dim) {
    float modCoord = mod(float(dim), 2.);
    return modCoord == 0. ? frag.r : frag.g;
  }
`;function Kv(){return`
    int getOutputCoords() {
      return 0;
    }
  `}function vP(r,e,t){let o=[Math.ceil(e[0]/2),Math.ceil(e[1]/2)];return o[0]===1?t?`
      int getOutputCoords() {
        return 2 * int(resultUV.x * ceil(float(outTexShape[1]) / 2.0));
      }
    `:`
      int getOutputCoords() {
        return 2 * int(resultUV.x * ${o[1]}.0);
      }
    `:o[1]===1?t?`
      int getOutputCoords() {
        return 2 * int(resultUV.y * ceil(float(outTexShape[0]) / 2.0));
      }
    `:`
      int getOutputCoords() {
        return 2 * int(resultUV.y * ${o[0]}.0);
      }
    `:t?`
    int getOutputCoords() {
      ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(packedTexShape[0], packedTexShape[1]));
      return 2 * (resTexRC.x * packedTexShape[1] + resTexRC.y);
    }
  `:`
    int getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${o[0]}, ${o[1]}));
      return 2 * (resTexRC.x * ${o[1]} + resTexRC.y);
    }
  `}function TP(r,e,t){return e[0]===1?t?`
      int getOutputCoords() {
        return int(resultUV.x * float(outTexShape[1]));
      }
    `:`
      int getOutputCoords() {
        return int(resultUV.x * ${e[1]}.0);
      }
    `:e[1]===1?t?`
      int getOutputCoords() {
        return int(resultUV.y * float(outTexShape[0]));
      }
    `:`
      int getOutputCoords() {
        return int(resultUV.y * ${e[0]}.0);
      }
    `:t?`
    int getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(outTexShape[0], outTexShape[1]));
      return resTexRC.x * outTexShape[1] + resTexRC.y;
    }
  `:`
    int getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${e[0]}, ${e[1]}));
      return resTexRC.x * ${e[1]} + resTexRC.y;
    }
  `}function SP(r,e,t){if(t)return`
    ivec3 getOutputCoords() {
      ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
      int texelsInLogicalRow = int(ceil(float(outShape[2]) / 2.0));
      int texelsInBatch = texelsInLogicalRow * int(ceil(float(outShape[1]) / 2.0));
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(packedTexShape[0], packedTexShape[1]));
      int index = resTexRC.x * packedTexShape[1] + resTexRC.y;

      int b = index / texelsInBatch;
      index -= b * texelsInBatch;

      int r = 2 * (index / texelsInLogicalRow);
      int c = imod(index, texelsInLogicalRow) * 2;

      return ivec3(b, r, c);
    }
  `;let o=[Math.ceil(e[0]/2),Math.ceil(e[1]/2)],n=Math.ceil(r[2]/2),s=n*Math.ceil(r[1]/2);return`
    ivec3 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${o[0]}, ${o[1]}));
      int index = resTexRC.x * ${o[1]} + resTexRC.y;

      int b = index / ${s};
      index -= b * ${s};

      int r = 2 * (index / ${n});
      int c = imod(index, ${n}) * 2;

      return ivec3(b, r, c);
    }
  `}function CP(r,e,t){if(t)return`
  ivec3 getOutputCoords() {
    ivec2 resTexRC = ivec2(resultUV.yx *
                           vec2(outTexShape[0], outTexShape[1]));
    int index = resTexRC.x * outTexShape[1] + resTexRC.y;
    ${Zo(["r","c","d"],r)}
    return ivec3(r, c, d);
  }
`;let o=sr(["r","c","d"],r);return`
    ivec3 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${e[0]}, ${e[1]}));
      int index = resTexRC.x * ${e[1]} + resTexRC.y;
      ${o}
      return ivec3(r, c, d);
    }
  `}function NP(r,e,t){if(t)return`
    ivec4 getOutputCoords() {
      ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(packedTexShape[0], packedTexShape[1]));
      int index = resTexRC.x * packedTexShape[1] + resTexRC.y;

      int texelsInLogicalRow = int(ceil(float(outShape[3]) / 2.0));
      int texelsInBatch = texelsInLogicalRow * int(ceil(float(outShape[2]) / 2.0));
      int texelsInBatchN = texelsInBatch * outShape[1];

      int b2 = index / texelsInBatchN;
      index -= b2 * texelsInBatchN;

      int b = index / texelsInBatch;
      index -= b * texelsInBatch;

      int r = 2 * (index / texelsInLogicalRow);
      int c = imod(index, texelsInLogicalRow) * 2;

      return ivec4(b2, b, r, c);
    }
  `;let o=[Math.ceil(e[0]/2),Math.ceil(e[1]/2)],n=Math.ceil(r[r.length-1]/2),s=n*Math.ceil(r[r.length-2]/2),i=s,a="",u="b, r, c";for(let l=2;l<r.length-1;l++)i*=r[r.length-l-1],a=`
      int b${l} = index / ${i};
      index -= b${l} * ${i};
    `+a,u=`b${l}, `+u;return`
    ivec${r.length} getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${o[0]}, ${o[1]}));
      int index = resTexRC.x * ${o[1]} + resTexRC.y;

      ${a}

      int b = index / ${s};
      index -= b * ${s};

      int r = 2 * (index / ${n});
      int c = imod(index, ${n}) * 2;

      return ivec${r.length}(${u});
    }
  `}function EP(r,e,t){if(t)return`
    ivec4 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
        vec2(outTexShape[0], outTexShape[1]));
      int index = resTexRC.x * outTexShape[1] + resTexRC.y;
      ${Zo(["r","c","d","d2"],r)}
      return ivec4(r, c, d, d2);
    }
  `;let o=sr(["r","c","d","d2"],r);return`
    ivec4 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
        vec2(${e[0]}, ${e[1]}));
      int index = resTexRC.x * ${e[1]} + resTexRC.y;
      ${o}
      return ivec4(r, c, d, d2);
    }
  `}function IP(r,e){let t=sr(["r","c","d","d2","d3"],r);return`
    ivec5 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx * vec2(${e[0]},
                             ${e[1]}));

      int index = resTexRC.x * ${e[1]} + resTexRC.y;

      ${t}

      ivec5 outShape = ivec5(r, c, d, d2, d3);
      return outShape;
    }
  `}function kP(r,e){let t=sr(["r","c","d","d2","d3","d4"],r);return`
    ivec6 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
        vec2(${e[0]}, ${e[1]}));
      int index = resTexRC.x * ${e[1]} + resTexRC.y;

      ${t}

      ivec6 result = ivec6(r, c, d, d2, d3, d4);
      return result;
    }
  `}function $P(r,e,t){let o=[Math.ceil(e[0]/2),Math.ceil(e[1]/2)];if(T.arraysEqual(r,e))return t?`
      ivec2 getOutputCoords() {
        ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
        return 2 * ivec2(resultUV.yx * vec2(packedTexShape[0], packedTexShape[1]));
      }
    `:`
      ivec2 getOutputCoords() {
        return 2 * ivec2(resultUV.yx * vec2(${o[0]}, ${o[1]}));
      }
    `;let n=Math.ceil(r[1]/2);return t?`
    ivec2 getOutputCoords() {
      ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
      int texelsInLogicalRow = int(ceil(float(outShape[1]) / 2.0));
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(packedTexShape[0], packedTexShape[1]));

      int index = resTexRC.x * packedTexShape[1] + resTexRC.y;
      int r = 2 * (index / texelsInLogicalRow);
      int c = imod(index, texelsInLogicalRow) * 2;

      return ivec2(r, c);
    }
  `:`
    ivec2 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${o[0]}, ${o[1]}));

      int index = resTexRC.x * ${o[1]} + resTexRC.y;
      int r = 2 * (index / ${n});
      int c = imod(index, ${n}) * 2;

      return ivec2(r, c);
    }
  `}function RP(r,e,t){return T.arraysEqual(r,e)?t?`
      ivec2 getOutputCoords() {
        return ivec2(resultUV.yx * vec2(outTexShape[0], outTexShape[1]));
      }
    `:`
      ivec2 getOutputCoords() {
        return ivec2(resultUV.yx * vec2(${e[0]}, ${e[1]}));
      }
    `:r[1]===1?t?`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(outTexShape[0], outTexShape[1]));
        int index = resTexRC.x * outTexShape[1] + resTexRC.y;
        return ivec2(index, 0);
      }
    `:`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(${e[0]}, ${e[1]}));
        int index = resTexRC.x * ${e[1]} + resTexRC.y;
        return ivec2(index, 0);
      }
    `:r[0]===1?t?`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(outTexShape[0], outTexShape[1]));
        int index = resTexRC.x * outTexShape[1] + resTexRC.y;
        return ivec2(0, index);
      }
    `:`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(${e[0]}, ${e[1]}));
        int index = resTexRC.x * ${e[1]} + resTexRC.y;
        return ivec2(0, index);
      }
    `:t?`
    ivec2 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(outTexShape[0], outTexShape[1]));
      int index = resTexRC.x * outTexShape[1] + resTexRC.y;
      int r = index / outShape[1];
      int c = index - r * outShape[1];
      return ivec2(r, c);
    }
  `:`
    ivec2 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${e[0]}, ${e[1]}));
      int index = resTexRC.x * ${e[1]} + resTexRC.y;
      int r = index / ${r[1]};
      int c = index - r * ${r[1]};
      return ivec2(r, c);
    }
  `}function Jo(r){return`offset${r}`}function AP(r){let e=r.name,t="get"+e.charAt(0).toUpperCase()+e.slice(1),o=Ee();return`
    vec4 ${t}() {
      return ${o.texture2D}(${e}, halfCR);
    }
  `}function _P(r,e){let t=r.name,o="get"+t.charAt(0).toUpperCase()+t.slice(1);if(r.shapeInfo.isUniform)return`float ${o}() {return ${t};}`;let[n,s]=r.shapeInfo.texShape;if(n===1&&s===1)return`
      float ${o}() {
        return sampleTexture(${t}, halfCR);
      }
    `;let i=Jo(t);if(e)return`
    float ${o}() {
      vec2 uv = uvFromFlat(${t}TexShape[0], ${t}TexShape[1], ${i});
      return sampleTexture(${t}, uv);
    }
  `;let[a,u]=r.shapeInfo.texShape;return`
    float ${o}() {
      vec2 uv = uvFromFlat(${a}, ${u}, ${i});
      return sampleTexture(${t}, uv);
    }
  `}function DP(r,e){let t=r.name,o="get"+t.charAt(0).toUpperCase()+t.slice(1),n=r.shapeInfo.texShape,s=Ee();if(e)return`
    vec4 ${o}(int index) {
      ivec2 packedTexShape = ivec2(ceil(float(${t}TexShape[0]) / 2.0), ceil(float(${t}TexShape[1]) / 2.0));
      vec2 uv = packedUVfrom1D(
        packedTexShape[0], packedTexShape[1], index);
      return ${s.texture2D}(${t}, uv);
    }
  `;let i=[Math.ceil(n[0]/2),Math.ceil(n[1]/2)];return`
    vec4 ${o}(int index) {
      vec2 uv = packedUVfrom1D(
        ${i[0]}, ${i[1]}, index);
      return ${s.texture2D}(${t}, uv);
    }
  `}function OP(r,e){let t=r.name,o="get"+t.charAt(0).toUpperCase()+t.slice(1);if(r.shapeInfo.isUniform)return`
      float ${o}(int index) {
        ${ls(r)}
      }
    `;let n=r.shapeInfo.texShape,s=n[0],i=n[1];if(i===1&&s===1)return`
      float ${o}(int index) {
        return sampleTexture(${t}, halfCR);
      }
    `;let a=Jo(t);return i===1?e?`
      float ${o}(int index) {
        vec2 uv = vec2(0.5, (float(index + ${a}) + 0.5) / float(${t}TexShape[0]));
        return sampleTexture(${t}, uv);
      }
    `:`
      float ${o}(int index) {
        vec2 uv = vec2(0.5, (float(index + ${a}) + 0.5) / ${s}.0);
        return sampleTexture(${t}, uv);
      }
    `:s===1?e?`
      float ${o}(int index) {
        vec2 uv = vec2((float(index + ${a}) + 0.5) / float(${t}TexShape[1]), 0.5);
        return sampleTexture(${t}, uv);
      }
    `:`
      float ${o}(int index) {
        vec2 uv = vec2((float(index + ${a}) + 0.5) / ${i}.0, 0.5);
        return sampleTexture(${t}, uv);
      }
    `:e?`
    float ${o}(int index) {
      vec2 uv = uvFromFlat(${t}TexShape[0], ${t}TexShape[1], index + ${a});
      return sampleTexture(${t}, uv);
    }
  `:`
    float ${o}(int index) {
      vec2 uv = uvFromFlat(${s}, ${i}, index + ${a});
      return sampleTexture(${t}, uv);
    }
  `}function FP(r,e){let t=r.shapeInfo.logicalShape,o=r.name,n="get"+o.charAt(0).toUpperCase()+o.slice(1),s=r.shapeInfo.texShape,i=s[0],a=s[1],u=Ee();if(s!=null&&T.arraysEqual(t,s))return e?`
      vec4 ${n}(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(${o}TexShape[1], ${o}TexShape[0]);

        return ${u.texture2D}(${o}, uv);
      }
    `:`
      vec4 ${n}(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(${a}.0, ${i}.0);

        return ${u.texture2D}(${o}, uv);
      }
    `;if(e)return`
    vec4 ${n}(int row, int col) {
      ivec2 packedTexShape = ivec2(ceil(float(${o}TexShape[0]) / 2.0), ceil(float(${o}TexShape[1]) / 2.0));
      int valuesPerRow = int(ceil(float(${o}Shape[1]) / 2.0));
      vec2 uv = packedUVfrom2D(valuesPerRow, packedTexShape[0], packedTexShape[1], row, col);
      return ${u.texture2D}(${o}, uv);
    }
  `;let l=[Math.ceil(s[0]/2),Math.ceil(s[1]/2)],c=Math.ceil(t[1]/2);return`
    vec4 ${n}(int row, int col) {
      vec2 uv = packedUVfrom2D(${c}, ${l[0]}, ${l[1]}, row, col);
      return ${u.texture2D}(${o}, uv);
    }
  `}function PP(r,e){let t=r.shapeInfo.logicalShape,o=r.name,n="get"+o.charAt(0).toUpperCase()+o.slice(1),s=r.shapeInfo.texShape;if(s!=null&&T.arraysEqual(t,s)){if(e)return`
      float ${n}(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(${o}TexShape[1], ${o}TexShape[0]);
        return sampleTexture(${o}, uv);
      }
    `;let m=s[0],f=s[1];return`
    float ${n}(int row, int col) {
      vec2 uv = (vec2(col, row) + halfCR) / vec2(${f}.0, ${m}.0);
      return sampleTexture(${o}, uv);
    }
  `}let{newShape:i,keptDims:a}=T.squeezeShape(t),u=i;if(u.length<t.length){let m=cs(r,u),f=["row","col"];return`
      ${us(m,e)}
      float ${n}(int row, int col) {
        return ${n}(${ps(f,a)});
      }
    `}if(r.shapeInfo.isUniform)return`
      float ${n}(int row, int col) {
        int index = round(dot(vec2(row, col), vec2(${t[1]}, 1)));
        ${ls(r)}
      }
    `;let l=s[0],c=s[1],p=Jo(o);return c===1?e?`
      float ${n}(int row, int col) {
        float index = dot(vec3(row, col, ${p}), vec3(${o}Shape[1], 1, 1));
        vec2 uv = vec2(0.5, (index + 0.5) / float(${o}TexShape[0]));
        return sampleTexture(${o}, uv);
      }
    `:`
    float ${n}(int row, int col) {
      float index = dot(vec3(row, col, ${p}), vec3(${t[1]}, 1, 1));
      vec2 uv = vec2(0.5, (index + 0.5) / ${l}.0);
      return sampleTexture(${o}, uv);
    }
  `:l===1?e?`
      float ${n}(int row, int col) {
        float index = dot(vec3(row, col, ${p}), vec3(${o}Shape[1], 1, 1));
        vec2 uv = vec2((index + 0.5) / float(${o}TexShape[1]), 0.5);
        return sampleTexture(${o}, uv);
      }
    `:`
    float ${n}(int row, int col) {
      float index = dot(vec3(row, col, ${p}), vec3(${t[1]}, 1, 1));
      vec2 uv = vec2((index + 0.5) / ${c}.0, 0.5);
      return sampleTexture(${o}, uv);
    }
  `:e?`
      float ${n}(int row, int col) {
        // Explicitly use integer operations as dot() only works on floats.
        int index = row * ${o}Shape[1] + col + ${p};
        vec2 uv = uvFromFlat(${o}TexShape[0], ${o}TexShape[1], index);
        return sampleTexture(${o}, uv);
      }
    `:`
  float ${n}(int row, int col) {
    // Explicitly use integer operations as dot() only works on floats.
    int index = row * ${t[1]} + col + ${p};
    vec2 uv = uvFromFlat(${l}, ${c}, index);
    return sampleTexture(${o}, uv);
  }
`}function LP(r,e){let t=r.shapeInfo.logicalShape,o=r.name,n="get"+o.charAt(0).toUpperCase()+o.slice(1),s=r.shapeInfo.texShape,i=[Math.ceil(s[0]/2),Math.ceil(s[1]/2)];if(t[0]===1){let m=t.slice(1),f=[1,2],d=cs(r,m),g=["b","row","col"];return`
        ${Hv(d,e)}
        vec4 ${n}(int b, int row, int col) {
          return ${n}(${ps(g,f)});
        }
      `}let a=Ee();if(e)return`
    vec4 ${n}(int b, int row, int col) {
      ivec2 packedTexShape = ivec2(ceil(float(${o}TexShape[0]) / 2.0), ceil(float(${o}TexShape[1]) / 2.0));
      int valuesPerRow = int(ceil(float(${o}Shape[2]) / 2.0));
      int texelsInBatch = valuesPerRow * int(ceil(float(${o}Shape[1]) / 2.0));
      vec2 uv = packedUVfrom3D(
        packedTexShape[0], packedTexShape[1], texelsInBatch, valuesPerRow, b, row, col);
      return ${a.texture2D}(${o}, uv);
    }
  `;let u=i[0],l=i[1],c=Math.ceil(t[2]/2),p=c*Math.ceil(t[1]/2);return`
    vec4 ${n}(int b, int row, int col) {
      vec2 uv = packedUVfrom3D(
        ${u}, ${l}, ${p}, ${c}, b, row, col);
      return ${a.texture2D}(${o}, uv);
    }
  `}function BP(r,e){let t=r.shapeInfo.logicalShape,o=r.name,n="get"+o.charAt(0).toUpperCase()+o.slice(1),s=t[1]*t[2],i=t[2],{newShape:a,keptDims:u}=T.squeezeShape(t),l=a;if(l.length<t.length){let g=cs(r,l),h=["row","col","depth"];return`
        ${us(g,e)}
        float ${n}(int row, int col, int depth) {
          return ${n}(${ps(h,u)});
        }
      `}if(r.shapeInfo.isUniform)return`
      float ${n}(int row, int col, int depth) {
        int index = round(dot(vec3(row, col, depth),
                          vec3(${s}, ${i}, 1)));
        ${ls(r)}
      }
    `;let c=r.shapeInfo.texShape,p=c[0],m=c[1],f=r.shapeInfo.flatOffset;if(m===s&&f==null)return e?`
      float ${n}(int row, int col, int depth) {
        int stride1 = ${o}Shape[2];
        float texR = float(row);
        float texC = dot(vec2(col, depth), vec2(stride1, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${o}TexShape[1], ${o}TexShape[0]);
        return sampleTexture(${o}, uv);
      }
    `:`
        float ${n}(int row, int col, int depth) {
          float texR = float(row);
          float texC = dot(vec2(col, depth), vec2(${i}, 1));
          vec2 uv = (vec2(texC, texR) + halfCR) /
                     vec2(${m}.0, ${p}.0);
          return sampleTexture(${o}, uv);
        }
      `;if(m===i&&f==null)return e?`
      float ${n}(int row, int col, int depth) {
        float texR = dot(vec2(row, col), vec2(${o}Shape[1], 1));
        float texC = float(depth);
        vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${o}TexShape[1], ${o}TexShape[0]);
        return sampleTexture(${o}, uv);
      }
    `:`
    float ${n}(int row, int col, int depth) {
      float texR = dot(vec2(row, col), vec2(${t[1]}, 1));
      float texC = float(depth);
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${m}.0, ${p}.0);
      return sampleTexture(${o}, uv);
    }
  `;let d=Jo(o);return e?`
    float ${n}(int row, int col, int depth) {
      // Explicitly use integer operations as dot() only works on floats.
      int stride0 = ${o}Shape[1] * ${o}Shape[2];
      int stride1 = ${o}Shape[2];
      int index = row * stride0 + col * stride1 + depth + ${d};
      vec2 uv = uvFromFlat(${o}TexShape[0], ${o}TexShape[1], index);
      return sampleTexture(${o}, uv);
    }
    `:`
      float ${n}(int row, int col, int depth) {
        // Explicitly use integer operations as dot() only works on floats.
        int index = row * ${s} + col * ${i} + depth + ${d};
        vec2 uv = uvFromFlat(${p}, ${m}, index);
        return sampleTexture(${o}, uv);
      }
  `}function MP(r,e){let t=r.name,o="get"+t.charAt(0).toUpperCase()+t.slice(1),n=Ee();if(e)return`
    vec4 ${o}(int b2, int b, int row, int col) {
      int valuesPerRow = int(ceil(float(${t}Shape[3]) / 2.0));
      int texelsInBatch = valuesPerRow * int(ceil(float(${t}Shape[2]) / 2.0));
      int index = b * texelsInBatch + (row / 2) * valuesPerRow + (col / 2);
      texelsInBatch *= ${t}Shape[1];
      index = b2 * texelsInBatch + index;
      ivec2 packedTexShape = ivec2(ceil(float(${t}TexShape[0]) / 2.0), ceil(float(${t}TexShape[1]) / 2.0));
      int texR = index / packedTexShape[1];
      int texC = index - texR * packedTexShape[1];
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(packedTexShape[1], packedTexShape[0]); return ${n.texture2D}(${t}, uv);
    }
  `;let s=r.shapeInfo.logicalShape,i=s.length,a=r.shapeInfo.texShape,u=[Math.ceil(a[0]/2),Math.ceil(a[1]/2)],l=u[0],c=u[1],p=Math.ceil(s[i-1]/2),m=p*Math.ceil(s[i-2]/2),f="int b, int row, int col",d=`b * ${m} + (row / 2) * ${p} + (col / 2)`;for(let g=2;g<i-1;g++)f=`int b${g}, `+f,m*=s[i-g-1],d=`b${g} * ${m} + `+d;return`
    vec4 ${o}(${f}) {
      int index = ${d};
      int texR = index / ${c};
      int texC = index - texR * ${c};
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${c}, ${l});
      return ${n.texture2D}(${t}, uv);
    }
  `}function VP(r,e){let t=r.shapeInfo.logicalShape,o=r.name,n="get"+o.charAt(0).toUpperCase()+o.slice(1),s=t[3],i=t[2]*s,a=t[1]*i,{newShape:u,keptDims:l}=T.squeezeShape(t);if(u.length<t.length){let v=cs(r,u),N=["row","col","depth","depth2"];return`
      ${us(v,e)}
      float ${n}(int row, int col, int depth, int depth2) {
        return ${n}(${ps(N,l)});
      }
    `}if(r.shapeInfo.isUniform)return`
      float ${n}(int row, int col, int depth, int depth2) {
        int index = round(dot(vec4(row, col, depth, depth2),
                          vec4(${a}, ${i}, ${s}, 1)));
        ${ls(r)}
      }
    `;let c=r.shapeInfo.flatOffset,p=r.shapeInfo.texShape,m=p[0],f=p[1],d=`int stride2 = ${o}Shape[3];`,g=`int stride1 = ${o}Shape[2] * stride2;`,h=`int stride0 = ${o}Shape[1] * stride1;`;if(f===a&&c==null)return e?`
      float ${n}(int row, int col, int depth, int depth2) {
        ${d}
        ${g}
        float texR = float(row);
        float texC =
            dot(vec3(col, depth, depth2),
                vec3(stride1, stride2, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${o}TexShape[1], ${o}TexShape[0]);
        return sampleTexture(${o}, uv);
      }
    `:`
      float ${n}(int row, int col, int depth, int depth2) {
        float texR = float(row);
        float texC =
            dot(vec3(col, depth, depth2),
                vec3(${i}, ${s}, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${f}.0, ${m}.0);
        return sampleTexture(${o}, uv);
      }
    `;if(f===s&&c==null)return e?`
      float ${n}(int row, int col, int depth, int depth2) {
        float texR = dot(vec3(row, col, depth),
                         vec3(${o}Shape[1] * ${o}Shape[2], ${o}Shape[2], 1));
        float texC = float(depth2);
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${o}TexShape[1], ${o}TexShape[0]);
        return sampleTexture(${o}, uv);
      }
    `:`
      float ${n}(int row, int col, int depth, int depth2) {
        float texR = dot(vec3(row, col, depth),
                         vec3(${t[1]*t[2]}, ${t[2]}, 1));
        float texC = float(depth2);
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${f}.0, ${m}.0);
        return sampleTexture(${o}, uv);
      }
    `;let x=Jo(o);return e?`
    float ${n}(int row, int col, int depth, int depth2) {
      // Explicitly use integer operations as dot() only works on floats.
      ${d}
      ${g}
      ${h}
      int index = row * stride0 + col * stride1 +
          depth * stride2 + depth2;
      vec2 uv = uvFromFlat(${o}TexShape[0], ${o}TexShape[1], index + ${x});
      return sampleTexture(${o}, uv);
    }
  `:`
    float ${n}(int row, int col, int depth, int depth2) {
      // Explicitly use integer operations as dot() only works on floats.
      int index = row * ${a} + col * ${i} +
          depth * ${s} + depth2;
      vec2 uv = uvFromFlat(${m}, ${f}, index + ${x});
      return sampleTexture(${o}, uv);
    }
  `}function UP(r){let e=r.shapeInfo.logicalShape,t=r.name,o="get"+t.charAt(0).toUpperCase()+t.slice(1),n=e[4],s=e[3]*n,i=e[2]*s,a=e[1]*i,{newShape:u,keptDims:l}=T.squeezeShape(e);if(u.length<e.length){let g=cs(r,u),h=["row","col","depth","depth2","depth3"];return`
      ${us(g)}
      float ${o}(int row, int col, int depth, int depth2, int depth3) {
        return ${o}(${ps(h,l)});
      }
    `}if(r.shapeInfo.isUniform)return`
      float ${o}(int row, int col, int depth, int depth2, int depth3) {
        float index = dot(
          vec4(row, col, depth, depth2),
          vec4(${a}, ${i}, ${s}, ${n})) +
          depth3;
        ${ls(r)}
      }
    `;let c=r.shapeInfo.flatOffset,p=r.shapeInfo.texShape,m=p[0],f=p[1];if(f===a&&c==null)return`
      float ${o}(int row, int col, int depth, int depth2, int depth3) {
        int texR = row;
        float texC = dot(vec4(col, depth, depth2, depth3),
                         vec4(${i}, ${s}, ${n}, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${f}.0, ${m}.0);
        return sampleTexture(${t}, uv);
      }
    `;if(f===n&&c==null)return`
      float ${o}(int row, int col, int depth, int depth2, int depth3) {
        float texR = dot(
          vec4(row, col, depth, depth2),
          vec4(${e[1]*e[2]*e[3]},
               ${e[2]*e[3]}, ${e[3]}, 1));
        int texC = depth3;
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${f}.0, ${m}.0);
        return sampleTexture(${t}, uv);
      }
    `;let d=Jo(t);return`
    float ${o}(int row, int col, int depth, int depth2, int depth3) {
      // Explicitly use integer operations as dot() only works on floats.
      int index = row * ${a} + col * ${i} + depth * ${s} +
          depth2 * ${n} + depth3 + ${d};
      vec2 uv = uvFromFlat(${m}, ${f}, index);
      return sampleTexture(${t}, uv);
    }
  `}function GP(r){let e=r.shapeInfo.logicalShape,t=r.name,o="get"+t.charAt(0).toUpperCase()+t.slice(1),{newShape:n,keptDims:s}=T.squeezeShape(e);if(n.length<e.length){let h=cs(r,n),x=["row","col","depth","depth2","depth3","depth4"];return`
      ${us(h)}
      float ${o}(int row, int col, int depth,
                    int depth2, int depth3, int depth4) {
        return ${o}(${ps(x,s)});
      }
    `}let i=e[5],a=e[4]*i,u=e[3]*a,l=e[2]*u,c=e[1]*l;if(r.shapeInfo.isUniform)return`
      float ${o}(int row, int col, int depth,
                  int depth2, int depth3, int depth4) {
        int index = round(dot(
          vec4(row, col, depth, depth2),
          vec4(${c}, ${l}, ${u}, ${a})) +
          dot(
            vec2(depth3, depth4),
            vec2(${i}, 1)));
        ${ls(r)}
      }
    `;let p=r.shapeInfo.flatOffset,m=r.shapeInfo.texShape,f=m[0],d=m[1];if(d===c&&p==null)return`
      float ${o}(int row, int col, int depth,
                    int depth2, int depth3, int depth4) {
        int texR = row;
        float texC = dot(vec4(col, depth, depth2, depth3),
          vec4(${l}, ${u}, ${a}, ${i})) +
               float(depth4);
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${d}.0, ${f}.0);
        return sampleTexture(${t}, uv);
      }
    `;if(d===i&&p==null)return`
      float ${o}(int row, int col, int depth,
                    int depth2, int depth3, int depth4) {
        float texR = dot(vec4(row, col, depth, depth2),
          vec4(${e[1]*e[2]*e[3]*e[4]},
               ${e[2]*e[3]*e[4]},
               ${e[3]*e[4]},
               ${e[4]})) + float(depth3);
        int texC = depth4;
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${d}.0, ${f}.0);
        return sampleTexture(${t}, uv);
      }
    `;let g=Jo(t);return`
    float ${o}(int row, int col, int depth,
                  int depth2, int depth3, int depth4) {
      // Explicitly use integer operations as dot() only works on floats.
      int index = row * ${c} + col * ${l} + depth * ${u} +
          depth2 * ${a} + depth3 * ${i} + depth4 + ${g};
      vec2 uv = uvFromFlat(${f}, ${d}, index);
      return sampleTexture(${t}, uv);
    }
  `}function ls(r){let e=r.name,t=T.sizeFromShape(r.shapeInfo.logicalShape);return t<2?`return ${e};`:`
    for (int i = 0; i < ${t}; i++) {
      if (i == index) {
        return ${e}[i];
      }
    }
  `}function zP(r,e){let t=r.name,o=t.charAt(0).toUpperCase()+t.slice(1),n="get"+o+"AtOutCoords",s=r.shapeInfo.logicalShape.length,i=e.logicalShape.length,a=zv(r.shapeInfo.logicalShape,e.logicalShape),u=J(i),l=i-s,c,p=["x","y","z","w","u","v"];s===0?c="":i<2&&a.length>=1?c="coords = 0;":c=a.map(v=>`coords.${p[v+l]} = 0;`).join(`
`);let m="";i<2&&s>0?m="coords":m=r.shapeInfo.logicalShape.map((v,N)=>`coords.${p[N+l]}`).join(", ");let f="return outputValue;",g=T.sizeFromShape(r.shapeInfo.logicalShape)===1,x=T.sizeFromShape(e.logicalShape)===1;if(s===1&&!g&&!x)f=`
      return vec4(outputValue.xy, outputValue.xy);
    `;else if(g&&!x)i===1?f=`
        return vec4(outputValue.x, outputValue.x, 0., 0.);
      `:f=`
        return vec4(outputValue.x);
      `;else if(a.length){let v=s-2,N=s-1;a.indexOf(v)>-1&&a.indexOf(N)>-1?f="return vec4(outputValue.x);":a.indexOf(v)>-1?f="return vec4(outputValue.x, outputValue.y, outputValue.x, outputValue.y);":a.indexOf(N)>-1&&(f="return vec4(outputValue.xx, outputValue.zz);")}return`
    vec4 ${n}() {
      ${u} coords = getOutputCoords();
      ${c}
      vec4 outputValue = get${o}(${m});
      ${f}
    }
  `}function WP(r,e){let t=r.name,o=t.charAt(0).toUpperCase()+t.slice(1),n="get"+o+"AtOutCoords",s=e.texShape,i=r.shapeInfo.texShape,a=r.shapeInfo.logicalShape.length,u=e.logicalShape.length;if(!r.shapeInfo.isUniform&&a===u&&r.shapeInfo.flatOffset==null&&T.arraysEqual(i,s))return`
      float ${n}() {
        return sampleTexture(${t}, resultUV);
      }
    `;let l=J(u),c=zv(r.shapeInfo.logicalShape,e.logicalShape),p=u-a,m,f=["x","y","z","w","u","v"];a===0?m="":u<2&&c.length>=1?m="coords = 0;":m=c.map(g=>`coords.${f[g+p]} = 0;`).join(`
`);let d="";return u<2&&a>0?d="coords":d=r.shapeInfo.logicalShape.map((g,h)=>`coords.${f[h+p]}`).join(", "),`
    float ${n}() {
      ${l} coords = getOutputCoords();
      ${m}
      return get${o}(${d});
    }
  `}function J(r){if(r<=1)return"int";if(r===2)return"ivec2";if(r===3)return"ivec3";if(r===4)return"ivec4";if(r===5)return"ivec5";if(r===6)return"ivec6";throw Error(`GPU for rank ${r} is not yet supported`)}function Sc(r,e,t){let{newShape:o,keptDims:n}=T.squeezeShape(e),s=e.length,i=r&&s===3&&e[0]===1,a=i?e.slice(1):o,u=!r&&s>1&&!T.arraysEqual(e,t)&&o.length<s||i;return{useSqueezeShape:u,uniformShape:u?a:e,keptDims:n}}function cs(r,e){let t=JSON.parse(JSON.stringify(r));return t.shapeInfo.logicalShape=e,t}function ps(r,e){return e.map(t=>r[t]).join(", ")}function Xv(r,e,t,o){let n=t.map((c,p)=>{let m={logicalShape:c.shape,texShape:c.isUniform?null:c.texData.texShape,isUniform:c.isUniform,isPacked:c.isUniform?!1:c.texData.isPacked,flatOffset:null};return c.texData!=null&&c.texData.slice!=null&&c.texData.slice.flatOffset>0&&(m.flatOffset=c.texData.slice.flatOffset),{name:e.variableNames[p],shapeInfo:m}}),s=n.map(c=>c.shapeInfo),i={logicalShape:o.shape,texShape:o.texData.texShape,isUniform:!1,isPacked:o.texData.isPacked,flatOffset:null},a=Wv(n,i,e),u=Cv(r.gl,a),l=r.createProgram(u);return $().get("ENGINE_COMPILE_ONLY")?{program:e,fragmentShader:u,source:a,webGLProgram:l,inShapeInfos:s,outShapeInfo:i,variablesLocations:null,customUniformLocations:null,infLoc:null,nanLoc:null,outShapeLocation:null,outShapeStridesLocation:null,outTexShapeLocation:null}:(r.buildVao(l),Object.assign({program:e,fragmentShader:u,source:a,webGLProgram:l,inShapeInfos:s,outShapeInfo:i},gd(r,e,l)))}function gd(r,e,t){let o=[],n=[],s,i,a,u=null,l=null;l=r.getUniformLocation(t,"NAN",!1),$().getNumber("WEBGL_VERSION")===1&&(u=r.getUniformLocation(t,"INFINITY",!1));let c=!1;for(let p of e.variableNames){let m={name:p,uniform:r.getUniformLocation(t,p,c),offset:r.getUniformLocation(t,`offset${p}`,c)};e.enableShapeUniforms&&(m.shape=r.getUniformLocation(t,`${p}Shape`,c),m.texShape=r.getUniformLocation(t,`${p}TexShape`,c)),o.push(m)}if(e.enableShapeUniforms&&(s=r.getUniformLocation(t,"outShape",c),a=r.getUniformLocation(t,"outShapeStrides",c),i=r.getUniformLocation(t,"outTexShape",c)),e.customUniforms)for(let p of e.customUniforms)n.push(r.getUniformLocation(t,p.name,c));return{variablesLocations:o,customUniformLocations:n,infLoc:u,nanLoc:l,outShapeLocation:s,outShapeStridesLocation:a,outTexShapeLocation:i}}function qv(r,e){if(r.length!==e.length)throw Error(`Binary was compiled with ${r.length} inputs, but was executed with ${e.length} inputs`);r.forEach((t,o)=>{let n=t.logicalShape,s=e[o],i=s.shape;if(!T.arraysEqual(n,i))throw Error(`Binary was compiled with different shapes than the current args. Shapes ${n} and ${i} must match`);if(t.isUniform&&s.isUniform)return;let a=t.texShape,u=s.isUniform?null:s.texData.texShape;if(!T.arraysEqual(a,u))throw Error(`Binary was compiled with different texture shapes than the current args. Shape ${a} and ${u} must match`)})}function jv(r,e,t,o,n){e.program.enableShapeUniforms||(qv(e.inShapeInfos,t),qv([e.outShapeInfo],[o]));let s=o.texData.texture,i=o.texData.texShape;o.texData.isPacked?r.setOutputPackedMatrixTexture(s.texture,i[0],i[1]):r.setOutputMatrixTexture(s.texture,i[0],i[1]),r.setProgram(e.webGLProgram),r.bindVertexArray(e.webGLProgram.vao),$().getNumber("WEBGL_VERSION")===1&&e.infLoc!==null&&r.gl.uniform1f(e.infLoc,1/0),e.nanLoc!==null&&r.gl.uniform1f(e.nanLoc,NaN);for(let u=0;u<t.length;++u){let l=t[u],{uniform:c,offset:p,shape:m,texShape:f}=e.variablesLocations[u];if(m){let{uniformShape:d}=Sc(e.program.packedInputs,l.shape,l.texData.texShape);switch(d.length){case 1:r.gl.uniform1iv(m,new Int32Array(d));break;case 2:r.gl.uniform2iv(m,new Int32Array(d));break;case 3:r.gl.uniform3iv(m,new Int32Array(d));break;case 4:r.gl.uniform4iv(m,new Int32Array(d));break;default:break}}if(f&&r.gl.uniform2i(f,l.texData.texShape[0],l.texData.texShape[1]),c!=null){if(l.isUniform){if(T.sizeFromShape(l.shape)<2)r.gl.uniform1f(c,l.uniformValues[0]);else{let d=l.uniformValues;d instanceof Float32Array||(d=new Float32Array(d)),r.gl.uniform1fv(c,d)}continue}l.texData.slice!=null&&p!=null&&r.gl.uniform1i(p,l.texData.slice.flatOffset),r.setInputMatrixTexture(l.texData.texture.texture,c,u)}}let a=e.outShapeLocation;if(a)switch(o.shape.length){case 1:r.gl.uniform1iv(a,new Int32Array(o.shape));break;case 2:r.gl.uniform2iv(a,new Int32Array(o.shape));break;case 3:r.gl.uniform3iv(a,new Int32Array(o.shape));break;case 4:r.gl.uniform4iv(a,new Int32Array(o.shape));break;default:break}if(e.outShapeStridesLocation){let u=T.computeStrides(o.shape);switch(o.shape.length){case 2:r.gl.uniform1iv(e.outShapeStridesLocation,new Int32Array(u));break;case 3:r.gl.uniform2iv(e.outShapeStridesLocation,new Int32Array(u));break;case 4:r.gl.uniform3iv(e.outShapeStridesLocation,new Int32Array(u));break;default:break}}if(e.outTexShapeLocation&&r.gl.uniform2i(e.outTexShapeLocation,o.texData.texShape[0],o.texData.texShape[1]),e.program.customUniforms&&n)for(let u=0;u<e.program.customUniforms.length;++u){let l=e.program.customUniforms[u],c=e.customUniformLocations[u],p=n[u];if(l.type==="float")r.gl.uniform1fv(c,p);else if(l.type==="vec2")r.gl.uniform2fv(c,p);else if(l.type==="vec3")r.gl.uniform3fv(c,p);else if(l.type==="vec4")r.gl.uniform4fv(c,p);else if(l.type==="int")r.gl.uniform1iv(c,p);else if(l.type==="ivec2")r.gl.uniform2iv(c,p);else if(l.type==="ivec3")r.gl.uniform3iv(c,p);else if(l.type==="ivec4")r.gl.uniform4iv(c,p);else throw Error(`uniform type ${l.type} is not supported yet.`)}r.executeProgram()}function Yv(r,e,t){let o="";e.concat(t).forEach(i=>{let a=i.texData!=null&&i.texData.slice!=null&&i.texData.slice.flatOffset>0;if(r.enableShapeUniforms&&!i.isUniform){let u=i.texData.texShape,{useSqueezeShape:l,uniformShape:c,keptDims:p}=Sc(r.packedInputs,i.shape,u),m="",f="",d="";if(c.length===1&&r.packedInputs){let k=[Math.ceil(u[0]/2),Math.ceil(u[1]/2)];m=`${k[0]>1}_${k[1]>1}`}else if(c.length===2&&!r.packedInputs)f=`${c[0]>1}_${c[1]>1}`;else if(c.length>2&&!r.packedInputs){let k=T.computeStrides(c);d=`${k[0]===u[1]}_${k[k.length-1]===u[1]}`}let g=i.shape.length,h=c.length===2&&T.arraysEqual(i.shape,u),x=T.sizeFromShape(i.shape)===1,v=I.getBroadcastDims(i.shape,t.shape),N=!r.packedInputs&&g===t.shape.length&&T.arraysEqual(u,t.texData.texShape),E=r.packedInputs||c.length>2?"":`${u[0]>1}_${u[1]>1}`;o+=`${g}_${N}_${l?p:""}_${c.length}_${x}_${v}_${h}_${m}_${f}_${d}_${E}_${a}`}else{let u=i.isUniform?"uniform":i.texData.texShape;o+=`${i.shape}_${u}_${a}`}});let n=r.userCode,s=r.constructor.name;return s+="_"+o+"_"+n+`${$().getNumber("WEBGL_VERSION")}`,s}function he(r){return $().getBool("WEBGL_USE_SHAPES_UNIFORMS")&&r<=4}var Cc=class{constructor(e){this.variableNames=["A"],this.packedInputs=!1,this.packedOutput=!0,this.outPackingScheme=po.DENSE,this.customUniforms=[{name:"texShape",type:"ivec2"}];let t=Ee();this.outputShape=e,this.enableShapeUniforms=he(this.outputShape.length),this.userCode=`
      ivec3 outCoordsFromFlatIndex(int index) {
        ${this.enableShapeUniforms?Zo(["r","c","d"],e):sr(["r","c","d"],e)}
        return ivec3(r, c, d);
      }

      void main() {
        ivec2 resTexRC = ivec2(resultUV.yx * vec2(texShape[0], texShape[1]));
        int index = 4 * (resTexRC.x * texShape[1] + resTexRC.y);

        vec4 result = vec4(0.);

        for (int i=0; i<4; i++) {
          int flatIndex = index + i;
          ivec3 rc = outCoordsFromFlatIndex(flatIndex);
          result[i] = getA(rc.x, rc.y, rc.z);
        }

        ${t.output} = result;
      }
    `}};var Nc=class{constructor(e){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outPackingScheme=po.DENSE,this.customUniforms=[{name:"texShape",type:"ivec2"}];let t=Ee();this.outputShape=e,this.enableShapeUniforms=he(this.outputShape.length),this.userCode=`
      ivec3 outCoordsFromFlatIndex(int index) {
        ${this.enableShapeUniforms?Zo(["r","c","d"],e):sr(["r","c","d"],e)}
        return ivec3(r, c, d);
      }

      void main() {
        ivec2 resTexRC = ivec2(resultUV.yx * vec2(texShape[0], texShape[1]));
        int index = 4 * (resTexRC.x * texShape[1] + resTexRC.y);

        vec4 result = vec4(0.);

        for (int i=0; i<4; i++) {
          int flatIndex = index + i;
          ivec3 rc = outCoordsFromFlatIndex(flatIndex);
          result[i] = getChannel(getA(rc.x, rc.y, rc.z), vec2(rc.y, rc.z));
        }

        ${t.output} = result;
      }
    `}};var Ec=class{constructor(e){this.variableNames=["A"],this.outTexUsage=je.DOWNLOAD;let t=Ee();this.outputShape=e,this.userCode=`
      ${Tc}

      void main() {
        float x = getAAtOutCoords();
        ${t.output} = encode_float(x);
      }
    `}};var Ic=class{constructor(e){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!1,this.outTexUsage=je.DOWNLOAD;let t=Ee();this.outputShape=e,this.userCode=`
      ${Tc}

      void main() {
        ivec3 coords = getOutputCoords();
        float x = getChannel(getAAtOutCoords(), vec2(coords.y, coords.z));
        ${t.output} = encode_float(x);
      }
    `}};var qP={R:0,G:1,B:2,A:3},ci=class{constructor(e,t=!1,o="RGBA"){this.variableNames=["A"],this.customUniforms=[{name:"texShape",type:"ivec2"}];let n=Ee();this.outputShape=e,this.enableShapeUniforms=he(this.outputShape.length);let s="result";t&&(s="floor(result * 255. + 0.5)");let i="";for(let a=0;a<o.length;a++){let u=o[a];i+=`
          if(offset == ${a}) {
            result = values[${qP[u]}];
          }`}this.userCode=`
      ${this.enableShapeUniforms?is():ss(e)}

      void main() {
        ivec3 coords = getOutputCoords();
        int flatIndex = getFlatIndex(coords);
        float result = 0.;
        int offset = imod(flatIndex, ${o.length});

        flatIndex = idiv(flatIndex, ${o.length}, 1.);

        int r = flatIndex / texShape[1];
        if (r < texShape[0]) {
          int c = imod(flatIndex, texShape[1]);
          vec2 uv = (vec2(c, r) + halfCR) / vec2(texShape[1], texShape[0]);
          vec4 values = ${n.texture2D}(A, uv);
          ${i}
        }
        ${n.output} = vec4(${s}, 0., 0., 0.);
      }
    `}};var kc=class{constructor(e,t=!1){this.variableNames=["A"],this.packedInputs=!1,this.packedOutput=!0,this.customUniforms=[{name:"texShape",type:"ivec2"}];let o=Ee();this.outputShape=e,this.enableShapeUniforms=he(this.outputShape.length);let n="",s="result";t&&(s="floor(result * 255. + 0.5)");for(let i=0;i<=1;i++)for(let a=0;a<=1;a++){let u=i*2+a;n+=`
          localCoords = coords;
          if(localCoords[2] + ${a} < ${this.enableShapeUniforms?"outShape[2]":`${e[2]}`}) {
          localCoords[2] += ${a};
          if (localCoords[1] + ${i} < ${this.enableShapeUniforms?"outShape[1]":`${e[1]}`}) {
            localCoords[1] += ${i};

            flatIndex = getFlatIndex(localCoords);
            offset = imod(flatIndex, 4);

            flatIndex = idiv(flatIndex, 4, 1.);

            int r = flatIndex / texShape[1];
            int c = imod(flatIndex, texShape[1]);
            vec2 uv = (vec2(c, r) + halfCR) / vec2(texShape[1], texShape[0]);
            values = ${o.texture2D}(A, uv);

            if (offset == 0) {
              result[${u}] = values[0];
            } else if (offset == 1) {
              result[${u}] = values[1];
            } else if (offset == 2) {
              result[${u}] = values[2];
            } else {
              result[${u}] = values[3];
            }
          }
        }
        `}this.userCode=`
        ${this.enableShapeUniforms?is():ss(e)}

        void main() {
          ivec3 coords = getOutputCoords();

          vec4 result = vec4(0.);
          int flatIndex, r, c, offset;
          ivec3 localCoords;
          vec2 uv;
          vec4 values;

          ${n}

          ${o.output} = ${s};
        }
    `}};function Qv(r){let e=Ee(),t=`${e.version}
    precision highp float;
    ${e.attribute} vec3 clipSpacePos;
    ${e.attribute} vec2 uv;
    ${e.varyingVs} vec2 resultUV;

    void main() {
      gl_Position = vec4(clipSpacePos, 1);
      resultUV = uv;
    }`;return Sv(r,t)}function Zv(r){let e=new Float32Array([-1,1,0,0,1,-1,-1,0,0,0,1,1,0,1,1,1,-1,0,1,0]);return Iv(r,e)}function Jv(r){let e=new Uint16Array([0,1,2,2,1,3]);return kv(r,e)}function pi(r,e,t,o,n,s){Rv(e,t);let i=$v(r),a=r.TEXTURE_2D;return G(r,()=>r.bindTexture(a,i)),G(r,()=>r.texParameteri(a,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE)),G(r,()=>r.texParameteri(a,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE)),G(r,()=>r.texParameteri(a,r.TEXTURE_MIN_FILTER,r.NEAREST)),G(r,()=>r.texParameteri(a,r.TEXTURE_MAG_FILTER,r.NEAREST)),$().getNumber("WEBGL_VERSION")===1?G(r,()=>r.texImage2D(a,0,o,e,t,0,n,s,null)):G(r,()=>r.texStorage2D(a,1,o,e,t)),G(r,()=>r.bindTexture(r.TEXTURE_2D,null)),{texture:i,texShape:[t,e]}}function xd(r){return r.internalFormatFloat}function e1(r,e,t,o){let[n,s]=Yo(e,t);return pi(r,n,s,xd(o),o.textureFormatFloat,r.FLOAT)}function yd(r){return r.internalFormatHalfFloat}function t1(r,e,t,o){let[n,s]=Yo(e,t);return pi(r,n,s,yd(o),o.textureFormatFloat,o.textureTypeHalfFloat)}function bd(r){return r.downloadTextureFormat}function r1(r,e,t,o){let[n,s]=Yo(e,t);return pi(r,n,s,bd(o),r.RGBA,r.UNSIGNED_BYTE)}function wd(r){return r.internalFormatPackedFloat}function o1(r,e,t,o){let[n,s]=Tr(e,t);return pi(r,n,s,wd(o),r.RGBA,r.FLOAT)}function vd(r){return r.internalFormatPackedHalfFloat}function n1(r,e,t,o){let[n,s]=Tr(e,t);return pi(r,n,s,vd(o),r.RGBA,o.textureTypeHalfFloat)}function s1(r,e,t){return G(r,()=>r.bindBuffer(r.ARRAY_BUFFER,t)),fd(r,e,"clipSpacePos",t,3,20,0)&&fd(r,e,"uv",t,2,20,12)}function i1(r,e,t,o,n,s){G(r,()=>r.bindTexture(r.TEXTURE_2D,e));let i,a,u;n instanceof Uint8Array?(i=new Uint8Array(t*o*4),a=r.UNSIGNED_BYTE,u=r.RGBA):(i=new Float32Array(t*o*4),a=r.FLOAT,u=s.internalFormatPackedFloat),i.set(n),$().getNumber("WEBGL_VERSION")===2?G(r,()=>r.texSubImage2D(r.TEXTURE_2D,0,0,0,t,o,r.RGBA,a,i)):G(r,()=>r.texImage2D(r.TEXTURE_2D,0,u,t,o,0,r.RGBA,a,i)),G(r,()=>r.bindTexture(r.TEXTURE_2D,null))}function a1(r,e,t){G(r,()=>r.bindTexture(r.TEXTURE_2D,e)),t.data instanceof Uint8Array?$().getNumber("WEBGL_VERSION")===2?G(r,()=>r.texSubImage2D(r.TEXTURE_2D,0,0,0,t.width,t.height,r.RGBA,r.UNSIGNED_BYTE,t.data)):G(r,()=>r.texImage2D(r.TEXTURE_2D,0,r.RGBA,t.width,t.height,0,r.RGBA,r.UNSIGNED_BYTE,t.data)):$().getNumber("WEBGL_VERSION")===2?G(r,()=>r.texSubImage2D(r.TEXTURE_2D,0,0,0,r.RGBA,r.UNSIGNED_BYTE,t)):G(r,()=>r.texImage2D(r.TEXTURE_2D,0,r.RGBA,r.RGBA,r.UNSIGNED_BYTE,t)),G(r,()=>r.bindTexture(r.TEXTURE_2D,null))}function u1(r,e,t,o){let n=r.createBuffer();G(r,()=>r.bindBuffer(r.PIXEL_PACK_BUFFER,n));let a=4*4*e*t;return G(r,()=>r.bufferData(r.PIXEL_PACK_BUFFER,a,r.STREAM_READ)),G(r,()=>r.readPixels(0,0,t,e,r.RGBA,r.FLOAT,0)),G(r,()=>r.bindBuffer(r.PIXEL_PACK_BUFFER,null)),n}function l1(r,e,t){let o=r,n=new Float32Array(t);return o.bindBuffer(o.PIXEL_PACK_BUFFER,e),o.getBufferSubData(o.PIXEL_PACK_BUFFER,0,n),o.bindBuffer(o.PIXEL_PACK_BUFFER,null),n}function c1(r,e,t,o){let[n,s]=Yo(e,t),i=4,a=new Uint8Array(wv(e*t,i));return G(r,()=>r.readPixels(0,0,n,s,o.downloadTextureFormat,r.UNSIGNED_BYTE,a)),new Float32Array(a.buffer)}function p1(r,e,t,o,n,s,i,a){let u=r,l=new Float32Array(vv(s,i));return u.bindBuffer(u.PIXEL_PACK_BUFFER,e),u.getBufferSubData(u.PIXEL_PACK_BUFFER,0,l),u.bindBuffer(u.PIXEL_PACK_BUFFER,null),l}function m1(r,e,t){let o=new Float32Array(e*t*4);return G(r,()=>r.readPixels(0,0,t,e,r.RGBA,r.FLOAT,o)),o}var ms=class{constructor(e){this.outputTexture=null,this.program=null,this.disposed=!1,this.itemsToPoll=[];let t=$().getNumber("WEBGL_VERSION");if(e!=null?(this.gl=e,bv(t,e)):this.gl=Ot(t),e=this.gl,$().getNumber("WEBGL_VERSION")===2){let s=e;this.createVertexArray=()=>G(s,()=>s.createVertexArray()),this.bindVertexArray=i=>G(s,()=>s.bindVertexArray(i)),this.deleteVertexArray=i=>G(s,()=>s.deleteVertexArray(i)),this.getVertexArray=()=>G(s,()=>s.getParameter(s.VERTEX_ARRAY_BINDING))}else if(e!=null){let s=e.getExtension("OES_vertex_array_object");if(s==null)throw new Error("All WebGL1 implementations are expected to offer OES_vertex_array_object.");this.createVertexArray=()=>G(e,()=>s.createVertexArrayOES()),this.bindVertexArray=i=>G(e,()=>s.bindVertexArrayOES(i)),this.deleteVertexArray=i=>G(e,()=>s.deleteVertexArrayOES(i)),this.getVertexArray=()=>G(e,()=>e.getParameter(s.VERTEX_ARRAY_BINDING_OES))}let o="WEBGL_color_buffer_float",n="EXT_color_buffer_half_float";if(this.parallelCompilationExtension=this.gl.getExtension("KHR_parallel_shader_compile"),$().getNumber("WEBGL_VERSION")===1){let s="OES_texture_float",i="OES_texture_half_float";if(this.textureFloatExtension=ai(this.gl,s),Wt(this.gl,i))this.textureHalfFloatExtension=ai(this.gl,i);else if($().get("WEBGL_FORCE_F16_TEXTURES"))throw new Error("GL context does not support half float textures, yet the environment flag WEBGL_FORCE_F16_TEXTURES is set to true.");if(this.colorBufferFloatExtension=this.gl.getExtension(o),Wt(this.gl,n))this.colorBufferHalfFloatExtension=ai(this.gl,n);else if($().get("WEBGL_FORCE_F16_TEXTURES"))throw new Error("GL context does not support color renderable half floats, yet the environment flag WEBGL_FORCE_F16_TEXTURES is set to true.")}else if(o="EXT_color_buffer_float",Wt(this.gl,o))this.colorBufferFloatExtension=this.gl.getExtension(o);else if(Wt(this.gl,n))this.colorBufferHalfFloatExtension=this.gl.getExtension(n);else throw new Error("GL context does not support color renderable floats");this.vertexBuffer=Zv(this.gl),this.indexBuffer=Jv(this.gl),this.framebuffer=Av(this.gl),this.textureConfig=ii(this.gl,this.textureHalfFloatExtension)}get debug(){return $().getBool("DEBUG")}dispose(){if(this.disposed)return;this.program!=null&&console.warn("Disposing a GPGPUContext that still has a bound WebGLProgram. This is probably a resource leak, delete the program with GPGPUContext.deleteProgram before disposing."),this.outputTexture!=null&&console.warn("Disposing a GPGPUContext that still has a bound output matrix texture.  This is probably a resource leak, delete the output matrix texture with GPGPUContext.deleteMatrixTexture before disposing.");let e=this.gl;G(e,()=>e.finish()),G(e,()=>e.bindFramebuffer(e.FRAMEBUFFER,null)),G(e,()=>e.deleteFramebuffer(this.framebuffer)),G(e,()=>e.bindBuffer(e.ARRAY_BUFFER,null)),G(e,()=>e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,null)),G(e,()=>e.deleteBuffer(this.indexBuffer)),this.disposed=!0}createFloat32MatrixTexture(e,t){return this.throwIfDisposed(),e1(this.gl,e,t,this.textureConfig)}createFloat16MatrixTexture(e,t){return this.throwIfDisposed(),t1(this.gl,e,t,this.textureConfig)}createUnsignedBytesMatrixTexture(e,t){return this.throwIfDisposed(),r1(this.gl,e,t,this.textureConfig)}uploadPixelDataToTexture(e,t){this.throwIfDisposed(),a1(this.gl,e,t)}uploadDenseMatrixToTexture(e,t,o,n){this.throwIfDisposed(),i1(this.gl,e,t,o,n,this.textureConfig)}createFloat16PackedMatrixTexture(e,t){return this.throwIfDisposed(),n1(this.gl,e,t,this.textureConfig)}createPackedMatrixTexture(e,t){return this.throwIfDisposed(),o1(this.gl,e,t,this.textureConfig)}deleteMatrixTexture(e){this.throwIfDisposed(),this.outputTexture===e&&(dd(this.gl,this.framebuffer),this.outputTexture=null),G(this.gl,()=>this.gl.deleteTexture(e))}downloadByteEncodedFloatMatrixFromOutputTexture(e,t,o){return this.downloadMatrixDriver(e,()=>c1(this.gl,t,o,this.textureConfig))}downloadPackedMatrixFromBuffer(e,t,o,n,s,i){return p1(this.gl,e,t,o,n,s,i,this.textureConfig)}downloadFloat32MatrixFromBuffer(e,t){return l1(this.gl,e,t)}createBufferFromTexture(e,t,o){this.bindTextureToFrameBuffer(e);let n=u1(this.gl,t,o,this.textureConfig);return this.unbindTextureToFrameBuffer(),n}createAndWaitForFence(){let e=this.createFence(this.gl);return this.pollFence(e)}createFence(e){let t,o;if($().getBool("WEBGL_FENCE_API_ENABLED")){let n=e,s=n.fenceSync(n.SYNC_GPU_COMMANDS_COMPLETE,0);e.flush(),o=()=>{let i=n.clientWaitSync(s,0,0);return i===n.ALREADY_SIGNALED||i===n.CONDITION_SATISFIED},t=s}else $().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")>0?(t=this.beginQuery(),this.endQuery(),o=()=>this.isQueryAvailable(t,$().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"))):o=()=>!0;return{query:t,isFencePassed:o}}downloadMatrixFromPackedTexture(e,t,o){return this.downloadMatrixDriver(e,()=>m1(this.gl,t,o))}createProgram(e){this.throwIfDisposed();let t=this.gl;this.vertexShader==null&&(this.vertexShader=Qv(t));let o=Nv(t);G(t,()=>t.attachShader(o,this.vertexShader)),G(t,()=>t.attachShader(o,e)),Ev(t,o);let n=Object.assign(o,{vao:this.createVertexArray()});return this.debug&&bc(t,n),n}buildVao(e){this.setProgram(e),this.bindVertexArray(e.vao);let t=this.gl;G(t,()=>t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.indexBuffer)),s1(t,e,this.vertexBuffer)}deleteProgram(e){this.throwIfDisposed(),e===this.program&&(this.program=null),e!=null&&(G(this.gl,()=>this.gl.deleteProgram(e)),this.deleteVertexArray(e.vao))}setProgram(e){this.throwIfDisposed(),this.program=e,this.program!=null&&this.debug&&bc(this.gl,this.program),G(this.gl,()=>this.gl.useProgram(e))}getUniformLocation(e,t,o=!0){return this.throwIfDisposed(),o?_v(this.gl,e,t):Dv(this.gl,e,t)}getAttributeLocation(e,t){return this.throwIfDisposed(),G(this.gl,()=>this.gl.getAttribLocation(e,t))}getUniformLocationNoThrow(e,t){return this.throwIfDisposed(),this.gl.getUniformLocation(e,t)}setInputMatrixTexture(e,t,o){this.throwIfDisposed(),this.throwIfNoProgram(),Ov(this.gl,e,t,o)}setOutputMatrixTexture(e,t,o){this.setOutputMatrixTextureDriver(e,o,t)}setOutputPackedMatrixTexture(e,t,o){this.throwIfDisposed();let[n,s]=Tr(t,o);this.setOutputMatrixTextureDriver(e,n,s)}setOutputMatrixWriteRegion(e,t,o,n){this.setOutputMatrixWriteRegionDriver(o,e,n,t)}setOutputPackedMatrixWriteRegion(e,t,o,n){throw new Error("setOutputPackedMatrixWriteRegion not implemented.")}debugValidate(){this.program!=null&&bc(this.gl,this.program),ui(this.gl)}executeProgram(){this.throwIfDisposed(),this.throwIfNoProgram();let e=this.gl;if(this.debug){let t=this.getVertexArray();console.assert(t===this.program.vao,"VAO changed between setProgram and executeProgram!"),this.debugValidate()}G(e,()=>e.drawElements(e.TRIANGLES,6,e.UNSIGNED_SHORT,0))}blockUntilAllProgramsCompleted(){this.throwIfDisposed(),G(this.gl,()=>this.gl.finish())}getQueryTimerExtension(){return this.disjointQueryTimerExtension==null&&(this.disjointQueryTimerExtension=ai(this.gl,$().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")===2?"EXT_disjoint_timer_query_webgl2":"EXT_disjoint_timer_query")),this.disjointQueryTimerExtension}getQueryTimerExtensionWebGL2(){return this.getQueryTimerExtension()}getQueryTimerExtensionWebGL1(){return this.getQueryTimerExtension()}beginQuery(){if($().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")===2){let o=this.gl,n=this.getQueryTimerExtensionWebGL2(),s=o.createQuery();return o.beginQuery(n.TIME_ELAPSED_EXT,s),s}let e=this.getQueryTimerExtensionWebGL1(),t=e.createQueryEXT();return e.beginQueryEXT(e.TIME_ELAPSED_EXT,t),t}endQuery(){if($().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")===2){let t=this.gl,o=this.getQueryTimerExtensionWebGL2();t.endQuery(o.TIME_ELAPSED_EXT);return}let e=this.getQueryTimerExtensionWebGL1();e.endQueryEXT(e.TIME_ELAPSED_EXT)}async waitForQueryAndGetTime(e){return await T.repeatedTry(()=>this.disposed||this.isQueryAvailable(e,$().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"))),this.getQueryTime(e,$().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"))}getQueryTime(e,t){if(t===0)return null;if(t===2){let o=this.gl;return o.getQueryParameter(e,o.QUERY_RESULT)/1e6}else{let o=this.getQueryTimerExtensionWebGL1();return o.getQueryObjectEXT(e,o.QUERY_RESULT_EXT)/1e6}}isQueryAvailable(e,t){if(t===0)return!0;if(t===2){let o=this.gl,n=this.getQueryTimerExtensionWebGL2(),s=o.getQueryParameter(e,o.QUERY_RESULT_AVAILABLE);return this.disjoint==null&&(this.disjoint=this.gl.getParameter(n.GPU_DISJOINT_EXT)),s&&!this.disjoint}else{let o=this.getQueryTimerExtensionWebGL1(),n=o.getQueryObjectEXT(e,o.QUERY_RESULT_AVAILABLE_EXT);return this.disjoint==null&&(this.disjoint=this.gl.getParameter(o.GPU_DISJOINT_EXT)),n&&!this.disjoint}}pollFence(e){return new Promise(t=>{this.addItemToPoll(()=>e.isFencePassed(),()=>t())})}pollItems(){let e=jP(this.itemsToPoll.map(t=>t.isDoneFn));for(let t=0;t<=e;++t){let{resolveFn:o}=this.itemsToPoll[t];o()}this.itemsToPoll=this.itemsToPoll.slice(e+1)}addItemToPoll(e,t){if(this.itemsToPoll.push({isDoneFn:e,resolveFn:t}),this.itemsToPoll.length>1)return;let o;"setTimeoutCustom"in $().platform&&(o=$().platform.setTimeoutCustom.bind($().platform)),T.repeatedTry(()=>(this.pollItems(),this.itemsToPoll.length===0),()=>0,null,o)}bindTextureToFrameBuffer(e){this.throwIfDisposed(),wc(this.gl,e,this.framebuffer),this.debug&&ui(this.gl)}unbindTextureToFrameBuffer(){this.outputTexture!=null?(wc(this.gl,this.outputTexture,this.framebuffer),this.debug&&ui(this.gl)):dd(this.gl,this.framebuffer)}downloadMatrixDriver(e,t){this.bindTextureToFrameBuffer(e);let o=t();return this.unbindTextureToFrameBuffer(),o}setOutputMatrixTextureDriver(e,t,o){this.throwIfDisposed();let n=this.gl;wc(n,e,this.framebuffer),this.debug&&ui(n),this.outputTexture=e,G(n,()=>n.viewport(0,0,t,o)),G(n,()=>n.scissor(0,0,t,o))}setOutputMatrixWriteRegionDriver(e,t,o,n){this.throwIfDisposed(),G(this.gl,()=>this.gl.scissor(e,t,o,n))}throwIfDisposed(){if(this.disposed)throw new Error("Attempted to use disposed GPGPUContext.")}throwIfNoProgram(){if(this.program==null)throw new Error("No GPU program is currently set.")}};function jP(r){let e=0;for(;e<r.length&&r[e]();++e);return e-1}var Kd={};ye(Kd,{addImpl:()=>Cd,bincountImpl:()=>h1,bincountReduceImpl:()=>g1,bitwiseAndImpl:()=>Nd,castImpl:()=>Sd,ceilImpl:()=>Ed,concatImpl:()=>x1,equalImpl:()=>Id,expImpl:()=>kd,expm1Impl:()=>$d,floorDivImpl:()=>Ad,floorImpl:()=>Rd,gatherNdImpl:()=>y1,gatherV2Impl:()=>b1,greaterEqualImpl:()=>Dd,greaterImpl:()=>_d,lessEqualImpl:()=>Fd,lessImpl:()=>Od,linSpaceImpl:()=>w1,logImpl:()=>Pd,maxImpl:()=>v1,maximumImpl:()=>Ld,minimumImpl:()=>Bd,multiplyImpl:()=>fi,negImpl:()=>T1,notEqualImpl:()=>Md,prodImpl:()=>C1,raggedGatherImpl:()=>E1,raggedRangeImpl:()=>k1,raggedTensorToTensorImpl:()=>A1,rangeImpl:()=>_1,rsqrtImpl:()=>Ud,scatterImpl:()=>D1,sigmoidImpl:()=>O1,simpleAbsImpl:()=>f1,sliceImpl:()=>F1,sparseFillEmptyRowsImpl:()=>P1,sparseReshapeImpl:()=>L1,sparseSegmentReductionImpl:()=>B1,sqrtImpl:()=>M1,squaredDifferenceImpl:()=>Gd,staticRegexReplaceImpl:()=>zd,stridedSliceImpl:()=>V1,stringNGramsImpl:()=>U1,stringSplitImpl:()=>G1,stringToHashBucketFastImpl:()=>z1,subImpl:()=>Hd,tileImpl:()=>W1,topKImpl:()=>K1,transposeImpl:()=>S1,uniqueImpl:()=>q1});function $c(r,e){Array.isArray(r)||(r=[r]),r.forEach(t=>{t!=null&&T.assert(t.dtype!=="complex64",()=>`${e} does not support complex64 tensors in the CPU backend.`)})}function f1(r){let e=new Float32Array(r.length);for(let t=0;t<r.length;++t)e[t]=Math.abs(r[t]);return e}function we(r){return(e,t,o,n,s)=>{let i=I.assertAndGetBroadcastShape(e,t),a=i.length,u=T.computeStrides(i),l=T.sizeFromShape(i),c=T.getTypedArrayFromDType(s,l),p=e.length,m=t.length,f=T.computeStrides(e),d=T.computeStrides(t),g=I.getBroadcastDims(e,i),h=I.getBroadcastDims(t,i);if(g.length+h.length===0)for(let x=0;x<c.length;++x)c[x]=r(o[x%o.length],n[x%n.length]);else for(let x=0;x<c.length;++x){let v=T.indexToLoc(x,a,u),N=v.slice(-p);g.forEach(A=>N[A]=0);let E=T.locToIndex(N,p,f),k=v.slice(-m);h.forEach(A=>k[A]=0);let R=T.locToIndex(k,m,d);c[x]=r(o[E],n[R])}return[c,i]}}function fs(r){let{inputs:e,backend:t}=r,{real:o,imag:n}=e,s=t.data.get(o.dataId).values,i=t.data.get(n.dataId).values,a=t.makeTensorInfo(o.shape,"complex64"),u=t.data.get(a.dataId);return u.complexTensorInfos={real:t.makeTensorInfo(o.shape,"float32",s),imag:t.makeTensorInfo(n.shape,"float32",i)},a}function Rc(r,e,t="float32"){if(t==="complex64"){let n=Rc(r,e,"float32"),s=Rc(r,e,"float32");return fs({inputs:{real:n,imag:s},backend:r})}let o=T.makeZerosTypedArray(T.sizeFromShape(e),t);return r.makeTensorInfo(e,t,o)}function Td(r){let{inputs:e,backend:t}=r,{x:o}=e;return t.incRef(o.dataId),{dataId:o.dataId,shape:o.shape,dtype:o.dtype}}function d1(r){let{inputs:e,backend:t}=r,{input:o}=e,n=t.data.get(o.dataId).complexTensorInfos.real,s=t.data.get(n.dataId).values;return t.makeTensorInfo(n.shape,n.dtype,s)}function Sd(r,e,t,o){if(o==="int32"){let n=Int32Array.from(r);return[e,"int32",n]}if(o==="bool"){let n=T.toTypedArray([0],t),[s,i]=we((a,u)=>a!==u?1:0)(e,[],r,n,"bool");return[i,"bool",s]}throw new Error(`Error in Cast: failed to cast ${t} to ${o}`)}function mi(r){let{inputs:e,backend:t,attrs:o}=r,{x:n}=e,{dtype:s}=o;if(s==="complex64"){if(n.dtype==="complex64")return Td({inputs:{x:n},backend:t});let c=Rc(t,n.shape,n.dtype),p=mi({inputs:{x:n},backend:t,attrs:{dtype:"float32"}}),m=fs({inputs:{real:p,imag:c},backend:t});return t.disposeIntermediateTensorInfo(c),t.disposeIntermediateTensorInfo(p),m}if(n.dtype==="complex64"){let c=d1({inputs:{input:n},backend:t}),p=mi({inputs:{x:c},backend:t,attrs:{dtype:s}});return t.disposeIntermediateTensorInfo(c),p}if(!T.hasEncodingLoss(n.dtype,s)){let c=Td({inputs:{x:n},backend:t});return{dataId:c.dataId,shape:c.shape,dtype:s}}let i=t.data.get(n.dataId).values,[a,u,l]=Sd(i,n.shape,n.dtype,s);return t.makeTensorInfo(a,u,l)}function Te(r,e,t,o){return t==null?({inputs:n,backend:s})=>{let{a:i,b:a}=n,u=s;$c([i,a],r);let l=u.data.get(i.dataId).values,c=u.data.get(a.dataId).values,p=i.dtype==="string"?I.fromUint8ToStringArray(l):l,m=i.dtype==="string"?I.fromUint8ToStringArray(c):c,f=o||i.dtype,[d,g]=e(i.shape,a.shape,p,m,f);return u.makeTensorInfo(g,f,d)}:({inputs:n,backend:s})=>{let{a:i,b:a}=n,u=s;if(i.dtype==="complex64"||a.dtype==="complex64"){let l=mi({inputs:{x:i},backend:u,attrs:{dtype:"complex64"}}),c=u.data.get(l.dataId),p=c.complexTensorInfos.real,m=c.complexTensorInfos.imag,f=u.data.get(p.dataId).values,d=u.data.get(m.dataId).values,g=mi({inputs:{x:a},backend:u,attrs:{dtype:"complex64"}}),h=u.data.get(g.dataId),x=h.complexTensorInfos.real,v=h.complexTensorInfos.imag,N=u.data.get(x.dataId).values,E=u.data.get(v.dataId).values,[k,R,A]=t(i.shape,a.shape,f,d,N,E),_=u.makeTensorInfo(A,"float32",k),O=u.makeTensorInfo(A,"float32",R),F=fs({inputs:{real:_,imag:O},backend:u});return u.disposeIntermediateTensorInfo(l),u.disposeIntermediateTensorInfo(g),u.disposeIntermediateTensorInfo(_),u.disposeIntermediateTensorInfo(O),F}else{let l=u.data.get(i.dataId).values,c=u.data.get(a.dataId).values,p=o||i.dtype,[m,f]=e(i.shape,a.shape,l,c,p);return u.makeTensorInfo(f,p,m)}}}function ds(r){return(e,t,o,n,s,i)=>{let a=I.assertAndGetBroadcastShape(e,t),u=T.sizeFromShape(a),l=a.length,c=T.computeStrides(a),p=T.getTypedArrayFromDType("float32",u),m=T.getTypedArrayFromDType("float32",u),f=I.getBroadcastDims(e,a),d=I.getBroadcastDims(t,a),g=I.mergeRealAndImagArrays(o,n),h=I.mergeRealAndImagArrays(s,i),x=e.length,v=T.computeStrides(e),N=t.length,E=T.computeStrides(t);if(f.length+d.length===0)for(let k=0;k<p.length;k++){let R=k%g.length,A=k%h.length,_=r(g[R*2],g[R*2+1],h[A*2],h[A*2+1]);p[k]=_.real,m[k]=_.imag}else for(let k=0;k<p.length;k++){let R=T.indexToLoc(k,l,c),A=R.slice(-x);f.forEach(M=>A[M]=0);let _=T.locToIndex(A,x,v),O=R.slice(-N);d.forEach(M=>O[M]=0);let F=T.locToIndex(O,N,E),B=r(g[_*2],g[_*2+1],h[F*2],h[F*2+1]);p[k]=B.real,m[k]=B.imag}return[p,m,a]}}var Cd=we(((r,e)=>r+e)),YP=ds(((r,e,t,o)=>({real:r+t,imag:e+o}))),Rwe=Te("Add",Cd,YP);function h1(r,e,t,o,n){let s=T.sizeFromShape(o),i=T.makeZerosTypedArray(n,t);for(let a=0;a<r.length;a++){let u=r[a];if(u<0)throw new Error("Input x must be non-negative!");u>=n||(s>0?i[u]+=e[a]:i[u]+=1)}return i}function g1(r,e,t,o=!1){let n=r.shape[0],s=r.shape[1],i=oe([n,t],e.dtype);for(let a=0;a<n;a++)for(let u=0;u<s;u++){let l=r.get(a,u);if(l<0)throw new Error("Input x must be non-negative!");l>=t||(o?i.set(1,a,l):e.size>0?i.set(i.get(a,l)+e.get(a,u),a,l):i.set(i.get(a,l)+1,a,l))}return i}var Nd=we(((r,e)=>r&e)),Lwe=Te(dn,Nd);function Ue(r){return(e,t,o)=>{let n=T.getArrayFromDType(t,e.length);for(let s=0;s<e.length;++s)n[s]=r(e[s],o);return n}}function Ac(r,e,t){let o=Ue(e);return wt(r,o,t)}function wt(r,e,t){return({inputs:o,attrs:n,backend:s})=>{let{x:i}=o;$c(i,r);let a=s,u=a.data.get(i.dataId).values,l;if(i.dtype==="string"){if(!Array.isArray(u))throw new Error("String tensor's value was not an instance of Array");l=I.fromUint8ToStringArray(u)}else l=u;let c=t||i.dtype,p=e(l,c,n);return a.makeTensorInfo(i.shape,c,p)}}var Ed=Ue(r=>Math.ceil(r)),Xwe=wt(hn,Ed);function x1(r,e,t,o){let n=T.getArrayFromDType(t,T.sizeFromShape(e));if(o&&t!=="string"){let s=0;r.forEach(i=>{let a=T.sizeFromShape(i.shape);n.set(i.vals,s),s+=a})}else{let s=0;r.forEach(i=>{let a=t==="string"?I.fromUint8ToStringArray(i.vals):i.vals,u=0;for(let l=0;l<i.shape[0];++l){let c=l*e[1]+s;for(let p=0;p<i.shape[1];++p)n[c+p]=a[u++]}s+=i.shape[1]})}return n}var Id=we((r,e)=>r===e?1:0),tve=Te(gn,Id,null,"bool");var kd=Ue(r=>Math.exp(r)),ive=wt("Exp",kd,"float32");var $d=Ue(r=>Math.expm1(r)),pve=wt(xn,$d);var Rd=Ue(r=>Math.floor(r)),gve=wt(yn,Rd);var Ad=we((r,e)=>Math.floor(r/e)),vve=Te(bn,Ad,null,"int32");function y1(r,e,t,o,n,s,i,a,u){let l=oe([o,s],t);for(let c=0;c<o;c++){let p=[],m=0;for(let f=0;f<n;f++){let d=r[c*n+f];m+=d*i[f],p.push(d)}if(m<0||m>=u/s)throw new Error(`Invalid indices: ${p} does not index into ${a}`);for(let f=0;f<s;f++)l.values[c*s+f]=e.get(...e.indexToLoc(m*s+f))}return l}function b1(r,e,t){let o=oe(t,r.dtype);for(let n=0;n<o.size;++n){let i=o.indexToLoc(n).slice(),a=i[0],u=i[2],l=e.locToIndex([a,u]);i[2]=e.values[l];let c=r.locToIndex(i);0<=c&&c<r.values.length&&(o.values[n]=r.values[c])}return o}var _d=we((r,e)=>r>e?1:0),Rve=Te(wn,_d,null,"bool");var Dd=we((r,e)=>r>=e?1:0),Fve=Te(vn,Dd,null,"bool");var Od=we((r,e)=>r<e?1:0),Vve=Te(Tn,Od,null,"bool");var Fd=we((r,e)=>r<=e?1:0),Hve=Te(Sn,Fd,null,"bool");function w1(r,e,t){let o=(e-r)/(t-1),n=T.makeZerosTypedArray(t,"float32");n[0]=r;for(let s=1;s<n.length;s++)n[s]=n[s-1]+o;return n}var Pd=Ue(r=>Math.log(r)),Zve=wt("Log",Pd);function v1(r,e,t,o){let n=T.getTypedArrayFromDType(o,T.sizeFromShape(t));for(let s=0;s<n.length;++s){let i=s*e,a=r[i];for(let u=0;u<e;++u){let l=r[i+u];(Number.isNaN(l)||l>a)&&(a=l)}n[s]=a}return n}var Ld=we(((r,e)=>Math.max(r,e))),s1e=Te(Cn,Ld);var Bd=we(((r,e)=>Math.min(r,e))),c1e=Te(Nn,Bd);var fi=we(((r,e)=>r*e)),QP=ds(((r,e,t,o)=>({real:r*t-e*o,imag:r*o+e*t}))),h1e=Te(En,fi,QP);function T1(r,e,t){let o=T.createScalarValue(-1,t);return fi([],e,o,r,t)}var Md=we(((r,e)=>r!==e?1:0)),S1e=Te(In,Md,null,"bool");function S1(r,e,t,o,n){let s=e.length,i=T.sizeFromShape(e),a=T.computeStrides(e),u=T.computeStrides(n),l=T.getTypedArrayFromDType(t,T.sizeFromShape(n));for(let c=0;c<i;++c){let p=T.indexToLoc(c,s,a),m=new Array(p.length);for(let d=0;d<m.length;d++)m[d]=p[o[d]];let f=T.locToIndex(m,s,u);l[f]=r[c]}return l}function C1(r,e,t,o){let[n,s]=I.computeOutAndReduceShapes(r,o),i=Qe(e,"int32"),a=T.makeZerosTypedArray(T.sizeFromShape(n),i),u=T.sizeFromShape(s);for(let l=0;l<a.length;++l){let c=l*u,p=1;for(let m=0;m<u;++m)p*=t[c+m];a[l]=p}return{outVals:a,outShape:n,outDtype:i}}function ZP(r,e,t){r.forEach((o,n)=>{if(o<0||o>=t){let s=T.indexToLoc(n,e.length,T.computeStrides(e)).join(",");throw new Error(`indices[${s}] = ${o} is not in [0, ${t})`)}})}function JP(r,e){for(let t=0;t<r.length;++t){let o=r[t],n=t===r.length-1?e:r[t+1].length;if(o.length===0)throw new Error("Ragged splits may not be empty");if(o[0]<0)throw new Error("Ragged splits must be non-negative");if(o[o.length-1]>n)throw new Error("Ragged splits must not point past values");for(let s=1;s<o.length;++s)if(o[s-1]>o[s])throw new Error("Ragged splits must be sorted in ascending order")}}function eL(r,e,t,o){let n=[],s=0,i=e.length-1+t.length,a=new Array(i).fill(null).map(()=>[0]);JP(t,o);let u=1;for(let l=0;l<e.length-1;++l){u*=e[l];let c=e[l+1];for(let p=1;p<u+1;++p)a[l].push(p*c)}for(let l=0;l<r.length;++l){let c=r[l],p=r[l]+1;for(let m=0;m<t.length;++m){let f=t[m],d=m+e.length-1;if(d>=0){let g=a[d],h=g[g.length-1]-f[c];for(let x=c;x<p;++x)a[d].push(f[x+1]+h)}c=f[c],p=f[p]}p!==c&&(n.push([c,p]),s+=p-c)}return{outSplits:a,valueSlices:n,numValues:s}}function tL(r){let e=[];for(let t=0;t<r.length;++t){let o=r[t].length,n=T.getArrayFromDType("int32",o);e.push(n),r[t].forEach((s,i)=>n[i]=s)}return e}function N1(r,e){let t=r.slice(0,e);for(;t.length<e;)t.push(1);for(let o=e;o<r.length;o++)t[e-1]*=r[o];return t}function rL(r,e,t,o,n,s){let i=N1(e,2)[1],a=N1(s,2)[1],u=0;for(let l of t)for(let c=l[0];c<l[1];++c){for(let p=0;p<o;++p)n[u*a+p]=r[c*i+p];++u}}function oL(r,e,t,o,n){let s=e.slice();s[0]=n;let i=T.getArrayFromDType(t,T.sizeFromShape(s)),a=r.length,u=a===0?0:a/e[0];return rL(r,e,o,u,i,s),[i,s]}function E1(r,e,t,o,n,s,i,a){if(r.length===0)throw new Error("paramsNestedSplits must be non empty");if(e[0].length===0)throw new Error("Split tensors must not be scalars");let u=e[0][0]-1;if(ZP(s,i,u),o.length===0)throw new Error("params.rank must be nonzero");let l=o[0],{outSplits:c,valueSlices:p,numValues:m}=eL(s,i,r,l),f=tL(c),d=oL(t,o,n,p,m);return[f,d[0],d[1]]}var I1=2147483647;function k1(r,e,t,o,n,s,i){if(e.length>1)throw new Error("starts must be a scalar or vector");if(n.length>1)throw new Error("limits must be a scalar or vector");if(i.length>1)throw new Error("deltas must be a scalar or vector");let a=e.length===0,u=n.length===0,l=i.length===0,c=[];a||c.push(e[0]),u||c.push(n[0]),l||c.push(i[0]);for(let h=1;h<c.length;++h)if(c[h]!==c[h-1])throw new Error("starts, limits, and deltas must have the same shape");let p=c.length===0?1:c[0],m=T.getArrayFromDType("int32",p+1);m[0]=0;for(let h=0;h<p;++h){let x=a?r[0]:r[h],v=u?o[0]:o[h],N=l?s[0]:s[h];if(N===0)throw new Error("Requires delta != 0");let E;if(N>0&&v<x||N<0&&v>x)E=0;else if(E=Math.ceil(Math.abs((v-x)/N)),E>I1)throw new Error(`Requires ((limit - start) / delta) <= ${I1}`);m[h+1]=m[h]+E}let f=m[p],d=T.getArrayFromDType(t,f),g=0;for(let h=0;h<p;++h){let x=m[h+1]-m[h],v=a?r[0]:r[h],N=l?s[0]:s[h];for(let E=0;E<x;++E)d[g++]=v,v+=N}return[m,d]}var Yt=I.RowPartitionType,Vd=class r{constructor(e,t,o,n,s,i,a,u,l,c){this.shape=e,this.shapeShape=t,this.values=o,this.valuesShape=n,this.valuesDType=s,this.defaultValue=i,this.defaultValueShape=a,this.rowPartitionValues=u,this.rowPartitionValuesShapes=l,this.rowPartitionTypes=I.getRowPartitionTypesHelper(c),this.raggedRank=I.getRaggedRank(this.rowPartitionTypes)}getRowPartitionTypeByDimension(e){return this.rowPartitionTypes[0]===Yt.FIRST_DIM_SIZE?this.rowPartitionTypes[e+1]:this.rowPartitionTypes[e]}getRowPartitionTensor(e){return this.rowPartitionTypes[0]===Yt.FIRST_DIM_SIZE?this.rowPartitionValues[e+1]:this.rowPartitionValues[e]}getMaxWidth(e){let t=this.getRowPartitionTensor(e-1);switch(this.getRowPartitionTypeByDimension(e-1)){case Yt.VALUE_ROWIDS:return r.getMaxWidthValueRowID(t);case Yt.ROW_SPLITS:return r.getMaxWidthRowSplit(t);default:throw new Error(`Cannot handle partition type ${Yt[this.getRowPartitionTypeByDimension(e-1)]}`)}}static getMaxWidthRowSplit(e){let t=e.length;if(t===0||t===1)return 0;let o=0;for(let n=0;n<t-1;++n){let s=e[n+1]-e[n];s>o&&(o=s)}return o}static getMaxWidthValueRowID(e){let t=e.length;if(t===0)return 0;let o=0,n=e[0],s=0;for(let i=1;i<t;++i){let a=e[i];a!==n&&(n=a,s=Math.max(i-o,s),o=i)}return Math.max(t-o,s)}tensorShapeFromTensor(e,t,o=!0){if(t.length===0){if(e[0]===-1)return[];throw new Error("The only valid scalar shape tensor is the fully unknown shape specified as -1.")}return R1(e,o)}calculateOutputSize(e){let t=this.valuesShape,o=this.defaultValueShape;I.validateDefaultValueShape(o,t);let n=this.tensorShapeFromTensor(this.shape,this.shapeShape),i=I.combineRaggedTensorToTensorShapes(this.raggedRank,n,t);i[0]<0&&(i[0]=e);for(let a=1;a<=this.raggedRank;++a)i[a]<0&&(i[a]=this.getMaxWidth(a));return i}calculateFirstParentOutputIndex(e,t,o){let n=Math.min(e,o),s=[],i=0;for(let a=0;a<n;++a,i+=t)s.push(i);for(let a=n;a<e;++a)s.push(-1);return T.assert(s.length===e,()=>"Final length of result must be equal to firstDimension."),s}calculateOutputIndexRowSplit(e,t,o,n){let s=e.length,i=[];for(let a=0;a<s-1;++a){let u=e[a+1]-e[a],l=Math.min(n,u),c=t[a];c===-1&&(l=0);for(let p=0;p<l;++p)i.push(c),c+=o;for(let p=0;p<u-l;++p)i.push(-1)}if(s>0&&i.length!==e[s-1])throw new Error("Invalid row split size.");return i}calculateOutputIndexValueRowID(e,t,o,n){let s=e.length,i=[];if(s===0)return[];let a=0,u=e[0];if(u>=t.length)throw new Error(`Got currentValueRowId=${u}, which is not less than ${t.length}`);let l=t[u];i.push(l);for(let c=1;c<s;++c){let p=e[c];if(p===u)l>=0&&(++a,a<n?l+=o:l=-1);else{if(a=0,u=p,p>=t.length)throw new Error(`Got nextValueRowId=${p} which is not less than ${t.length}`);l=t[p]}i.push(l)}if(i.length!==e.length)throw new Error("Invalid row ids.");return i}calculateOutputIndex(e,t,o,n){let s=this.getRowPartitionTensor(e),i=this.getRowPartitionTypeByDimension(e);switch(i){case Yt.VALUE_ROWIDS:return this.calculateOutputIndexValueRowID(s,t,o,n);case Yt.ROW_SPLITS:if(s.length-1>t.length)throw new Error(`Row partition size is greater than output size: ${s.length-1} > ${t.length}`);return this.calculateOutputIndexRowSplit(s,t,o,n);default:throw new Error(`Unsupported partition type: ${Yt[i]}`)}}getFirstDimensionSize(){let e=this.rowPartitionValues[0];if(this.rowPartitionTypes.length===0)throw new Error("No row_partition_types given.");let t=this.rowPartitionTypes[0];switch(t){case Yt.FIRST_DIM_SIZE:return e[0];case Yt.VALUE_ROWIDS:throw new Error("Cannot handle VALUE_ROWIDS in first dimension.");case Yt.ROW_SPLITS:return this.rowPartitionValuesShapes[0][0]-1;default:throw new Error(`Cannot handle type ${Yt[t]}`)}}compute(){if(this.rowPartitionValues[0].length<=0)throw new Error("Invalid first partition input. Tensor requires at least one element.");let t=this.getFirstDimensionSize(),o=this.calculateOutputSize(t),n=new Array(this.raggedRank+1);n[n.length-1]=1;for(let u=n.length-2;u>=0;--u)n[u]=n[u+1]*o[u+1];let s=R1(o,!1),i=T.getArrayFromDType(this.valuesDType,T.sizeFromShape(s));if(n[0]*o[0]>0){let u=this.calculateFirstParentOutputIndex(t,n[0],o[0]);for(let l=1;l<=this.raggedRank;++l)u=this.calculateOutputIndex(l-1,u,n[l],o[l]);this.setOutput(this.raggedRank,u,i,s)}return[s,i]}setOutput(e,t,o,n){if(o.length===0)return;let s=this.values,i=o,a=n.slice();a=a.slice(e+1);let u=T.sizeFromShape(a),l=t.length,c=this.defaultValue;if(c.length!==u&&c.length!==1){let d=this.defaultValueShape;H(()=>{let g=D(c,d);c=Zr(g,a).dataSync()})}let p=0,m=0,f=0;for(let d=0;d<=l;++d){let g=d<l?t[d]:-1;if(g===f){++f;continue}if(m<f){let h=s.subarray(p*u),x=i.subarray(m*u),v=(f-m)*u;$1(x,h,v)}if(d>=l){let h=o.length;g=Math.floor(h/u)}if(g>f)if(this.defaultValue.length===1)i.subarray(f*u,g*u).fill(this.defaultValue[0]),f=g;else for(;g>f;){let h=i.slice(f*u);$1(h,c,u),++f}g<0?(p=d+1,m=f):(p=d,m=f,f=m+1)}}};function $1(r,e,t){for(let o=0;o<t;o++)r[o]=e[o]}function R1(r,e){let t=[];for(let o of r){if(o<0){if(!e)throw new Error(`Dimension ${o} must be >= 0`);if(o<-1)throw new Error(`Dimension ${o} must be >= -1`);o=-1}t.push(o)}return t}function A1(r,e,t,o,n,s,i,a,u,l){return new Vd(r,e,t,o,n,s,i,a,u,l).compute()}function _1(r,e,t,o){let n=r===e,s=r<e&&t<0,i=e<r&&t>1;if(n||s||i)return T.makeZerosTypedArray(0,o);let a=Math.abs(Math.ceil((e-r)/t)),u=T.makeZerosTypedArray(a,o);e<r&&t===1&&(t=-1),u[0]=r;for(let l=1;l<u.length;l++)u[l]=u[l-1]+t;return u}var Ud=Ue(r=>1/Math.sqrt(r)),V1e=wt(kn,Ud);function D1(r,e,t,o,n,s,i,a,u,l){let c=[o/n,n],p=r.values,m=e.values;if(o===0)return oe(t,e.dtype);let f=u instanceof Mt?u:oe(c,e.dtype);typeof u=="string"||typeof u=="number"?f.values.fill(u):typeof u=="boolean"&&f.values.fill(+u);for(let d=0;d<s;d++){let g=[],h=0;for(let x=0;x<i;x++){let v=p[d*i+x];g.push(v),h+=v*a[x]}if(h<0||h>=o/n)throw new Error(`Invalid indices: ${g} does not index into ${t}`);for(let x=0;x<n;x++)l?f.values[h*n+x]+=m[d*n+x]:f.values[h*n+x]=e.rank===0?m[0]:m[d*n+x]}return f}var O1=Ue(r=>1/(1+Math.exp(-r))),q1e=Ac($n,r=>1/(1+Math.exp(-r)));function F1(r,e,t,o,n){let s=yt.isSliceContinous(o,e,t),i=T.sizeFromShape(t),a=T.computeStrides(o);if(s){let p=yt.computeFlatOffset(e,a);return n==="string"?r.slice(p,p+i):r.subarray(p,p+i)}let u=n==="string"?I.fromUint8ToStringArray(r):r,l=oe(o,n,u),c=oe(t,n);for(let p=0;p<c.size;++p){let m=c.indexToLoc(p),f=m.map((d,g)=>d+e[g]);c.set(l.get(...f),...m)}return n==="string"?I.fromStringArrayToUint8(c.values):c.values}function P1(r,e,t,o,n,s,i){let a=e[0],u=s[0],l=new Array(u),c=new Array(a),p=e[1];if(u===0){if(a!==0)throw new Error(I.getSparseFillEmptyRowsIndicesDenseShapeMismatch(a));let h=T.getArrayFromDType(t,0),x=T.getArrayFromDType(n,0);return[h,[0,p],x,l,c]}let m=!0,f=0,d=new Array(u).fill(0);for(let h=0;h<a;++h){let x=r[h*p];if(x<0)throw new Error(I.getSparseFillEmptyRowsNegativeIndexErrorMessage(h,x));if(x>=u)throw new Error(I.getSparseFillEmptyRowsOutOfRangeIndexErrorMessage(h,x,u));++d[x],m=m&&x>=f,f=x}let g=!0;for(let h=0;h<u;++h){let x=d[h]===0;l[h]=x,g=g&&!x,d[h]=Math.max(d[h],1),h>0&&(d[h]+=d[h-1])}if(g&&m){let h=r,x=o;for(let v=0;v<a;++v)c[v]=v;return[h,[a,p],x,l,c]}else{let h=d[u-1],x=T.getArrayFromDType(t,h*p),v=T.getArrayFromDType(n,h),N=new Array(u).fill(0);for(let E=0;E<a;++E){let k=r[E*p],R=N[k],A=(k===0?0:d[k-1])+R;N[k]++;for(let _=0;_<p;++_)x[A*p+_]=r[E*p+_];v[A]=o[E],c[E]=A}for(let E=0;E<u;++E)if(N[E]===0){let R=E===0?0:d[E-1];x[R*p+0]=E;for(let A=1;A<p;++A)x[R*p+A]=0;v[R]=i}return[x,[h,p],v,l,c]}}function L1(r,e,t,o,n){let s=T.sizeFromShape(o),i=e[0],a=n.length,u=[],l=1,c=-1;for(let h=0;h<a;++h){let x=n[h];if(x===-1){if(c!==-1)throw new Error(I.getSparseReshapeMultipleNegativeOneOutputDimErrorMessage(c,h));c=h,u.push(1)}else{if(x<0)throw new Error(I.getSparseReshapeNegativeOutputDimErrorMessage(h,x));l*=x,u.push(x)}}if(c!==-1){if(l<=0)throw new Error(I.getSparseReshapeEmptyTensorZeroOutputDimErrorMessage());let h=Math.trunc(s/l);if(l*h!==s)throw new Error(I.getSparseReshapeInputOutputMultipleErrorMessage(o,u));u[c]=h}if(T.sizeFromShape(u)!==s)throw new Error(I.getSparseReshapeInputOutputMismatchErrorMessage(o,u));let m=o.length,f=[];if(m>0){f[m-1]=1;for(let h=m-2;h>=0;--h)f[h]=f[h+1]*o[h+1]}let d=[];if(a>0){d[a-1]=1;for(let h=a-2;h>=0;--h)d[h]=d[h+1]*u[h+1]}let g=T.getArrayFromDType(t,i*a);for(let h=0;h<i;++h){let x=0;for(let v=0;v<m;++v)x+=r[h*m+v]*f[v];for(let v=0;v<a;++v)g[h*a+v]=Math.trunc(x/d[v]),x%=d[v]}return[g,[i,a],u]}function B1(r,e,t,o,n,s=!1,i=0){let a=o.length,u=[e[0],r.length/e[0]],l=u[1],p=a>0?n[a-1]+1:0;if(p<0)throw new Error(I.getSparseSegmentReductionNegativeSegmentIdsErrorMessage());let m=e.slice();m[0]=p;let f=m.reduce((N,E)=>N*E,1),d=T.getArrayFromDType(t,f);if(a===0)return p>0&&d.fill(i),[d,m];if(p<=0)throw new Error(I.getSparseSegmentReductionNegativeSegmentIdsErrorMessage());let g=0,h=1,x=0,v=n[g];for(;;){let N=0;if(h<a){if(N=n[h],v===N){++h;continue}if(v>=N)throw new Error(I.getSparseSegmentReductionNonIncreasingSegmentIdsErrorMessage())}if(v<0||v>=p)throw new Error(I.getSparseSegmentReductionSegmentIdOutOfRangeErrorMessage(v,p));v>x&&d.fill(i,x*l,v*l);for(let E=g;E<h;++E){let k=o[E];if(k<0||k>=u[0])throw new Error(I.getSparseSegmentReductionIndicesOutOfRangeErrorMessage(E,o[E],u[0]));for(let R=0;R<l;R++)d[v*l+R]+=r[k*l+R]}if(s)for(let E=0;E<l;E++)d[v*l+E]/=h-g;if(g=h,++h,x=v+1,v=N,h>a)break}return x<p&&d.fill(i,x*l,p*l),[d,m]}var M1=Ue(r=>Math.sqrt(r)),iTe=Ac(Rn,r=>Math.sqrt(r));var Gd=we(((r,e)=>{let t=r-e;return t*t})),pTe=Te(An,Gd);var zd=Ue((r,e)=>{let{pattern:t,replaceGlobal:o,rewrite:n}=e;return r.replace(new RegExp(t,o?"g":""),n)}),gTe=wt(_n,zd);function V1(r,e,t,o){let n=oe(r,e.dtype);for(let s=0;s<n.size;s++){let i=n.indexToLoc(s),a=new Array(i.length);for(let u=0;u<a.length;u++)a[u]=i[u]*t[u]+o[u];n.set(e.get(...a),...i)}return n}var Wd=class{constructor(e,t,o,n,s,i){this.separator=T.encodeString(e),this.nGramWidths=t,this.leftPad=T.encodeString(o),this.rightPad=T.encodeString(n),this.padWidth=s,this.preserveShort=i}getPadWidth(e){return Math.min(this.padWidth<0?e-1:this.padWidth,e-1)}getNumNGrams(e,t){let o=this.getPadWidth(t);return Math.max(0,e+2*o-t+1)}createNGrams(e,t,o,n,s,i){for(let a=0;a<s;++a){let u=this.getPadWidth(i),l=Math.max(0,u-a),c=Math.max(0,u-(s-(a+1))),p=i-(l+c),m=t+(l>0?0:a-u),f=0;f+=l*this.leftPad.length;for(let v=0;v<p;++v)f+=e[m+v].length;f+=c*this.rightPad.length;let d=l+c+p-1;f+=d*this.separator.length,o[n+a]=new Uint8Array(f);let g=o[n+a],h=0,x=v=>v.forEach(N=>g[h++]=N);for(let v=0;v<l;++v)x(this.leftPad),x(this.separator);for(let v=0;v<p-1;++v)x(e[m+v]),x(this.separator);if(p>0){x(e[m+p-1]);for(let v=0;v<c;++v)x(this.separator),x(this.rightPad)}else{for(let v=0;v<c-1;++v)x(this.rightPad),x(this.separator);x(this.rightPad)}}}compute(e,t){let o=e.length,n=t.length;if(n>0){let u=t[0];if(u!==0)throw new Error(`First split value must be 0, got ${u}`);for(let l=1;l<n;++l){let c=t[l]>=u;if(c=c&&t[l]<=o,!c)throw new Error(`Invalid split value ${t[l]}, must be in [${u}, ${o}]`);u=t[l]}if(u!==o)throw new Error(`Last split value must be data size. Expected ${o}, got ${u}`)}let s=n-1,i=T.getArrayFromDType("int32",n);if(o===0||n===0){let u=new Array(o);for(let l=0;l<=s;++l)i[l]=0;return[u,i]}i[0]=0;for(let u=1;u<=s;++u){let l=t[u]-t[u-1],c=0;this.nGramWidths.forEach(p=>{c+=this.getNumNGrams(l,p)}),this.preserveShort&&l>0&&c===0&&(c=1),i[u]=i[u-1]+c}let a=new Array(i[s]);for(let u=0;u<s;++u){let l=t[u],c=i[u];if(this.nGramWidths.forEach(p=>{let m=t[u+1]-t[u],f=this.getNumNGrams(m,p);this.createNGrams(e,l,a,c,f,p),c+=f}),this.preserveShort&&c===i[u]){let p=t[u+1]-t[u];if(p===0)continue;let m=p+2*this.padWidth;this.createNGrams(e,l,a,c,1,m)}}return[a,i]}};function U1(r,e,t,o,n,s,i,a){return new Wd(t,o,n,s,i,a).compute(r,e)}function nL(r,e,t,o){if(!r.length)return;if(e.length===0){for(let s=0;s<r.length;++s)o.push(r.subarray(s,s+1));return}if(e.length===1){let s=e[0],i=r.indexOf(s);for(;i!==-1;){let a=r.subarray(0,i);(!t||a.length!==0)&&o.push(a),r=r.subarray(i+1),i=r.indexOf(s)}(!t||r.length!==0)&&o.push(r);return}let n=0;for(let s=0;s<r.length+1;s++)if(s===r.length||e.indexOf(r[s])!==-1){let i=r.subarray(n,s);(!t||i.length!==0)&&o.push(i),n=s+1}}function G1(r,e,t){let o=r.length,n=[],s=0,i=0,a=new Array(o);for(let m=0;m<o;++m){let f=n.length;nL(r[m],e,t,n);let d=n.length-f;a[m]=d,s+=d,i=Math.max(i,d)}let u=T.getArrayFromDType("int32",s*2),l=new Array(s),c=[o,i],p=0;for(let m=0;m<o;++m)for(let f=0;f<a[m];++f)u[p*2]=m,u[p*2+1]=f,l[p]=n[p],++p;return[u,l,c]}function z1(r,e){let t=T.getArrayFromDType("int32",r.length);for(let o=0;o<r.length;++o)t[o]=T.fingerPrint64(r[o]).modulo(e).getLowBitsUnsigned();return t}var Hd=we(((r,e)=>r-e)),sL=ds(((r,e,t,o)=>({real:r-t,imag:e-o}))),$Te=Te("Sub",Hd,sL);function W1(r,e){let t=new Array(r.rank);for(let n=0;n<t.length;n++)t[n]=r.shape[n]*e[n];let o=oe(t,r.dtype);for(let n=0;n<o.values.length;++n){let s=o.indexToLoc(n),i=new Array(r.rank);for(let u=0;u<i.length;u++)i[u]=s[u]%r.shape[u];let a=r.locToIndex(i);o.values[n]=r.values[a]}return o}var di=(r,e)=>{let t=e.value-r.value;return t===0?r.index-e.index:t};function H1(r,e,t=0,o=r.length-1){for(;o>t;){if(o-t>600){let a=o-t+1,u=e-t+1,l=Math.log(a),c=.5*Math.exp(2*l/3),p=.5*Math.sqrt(l*c*(a-c)/a)*Math.sign(u-a/2),m=Math.max(t,Math.floor(e-u*c/a+p)),f=Math.min(o,Math.floor(e+(a-u)*c/a+p));H1(r,e,m,f)}let n=r[e],s=t,i=o;for(T.swap(r,t,e),di(r[o],n)>0&&T.swap(r,t,o);s<i;){for(T.swap(r,s,i),s++,i--;di(r[s],n)<0;)s=s+1;for(;di(r[i],n)>0;)i=i-1}di(r[t],n)===0?T.swap(r,t,i):(i=i+1,T.swap(r,i,o)),i<=e&&(t=i+1),e<=i&&(o=i-1)}}function K1(r,e,t,o,n){let s=e[e.length-1],[i,a]=[r.length/s,s],u=T.getTypedArrayFromDType(t,i*o),l=T.getTypedArrayFromDType("int32",i*o);for(let p=0;p<i;p++){let m=p*a,f=r.subarray(m,m+a),d=new Array(f.length);f.forEach((v,N)=>d[N]={value:v,index:N}),o<d.length&&(H1(d,o),d=d.slice(0,o)),n&&d.sort(di);let g=p*o,h=u.subarray(g,g+o),x=l.subarray(g,g+o);for(let v=0;v<o;v++)h[v]=d[v].value,x[v]=d[v].index}let c=e.slice();return c[c.length-1]=o,[oe(c,t,u),oe(c,"int32",l)]}function q1(r,e,t,o){let n=T.parseAxisParam(e,t)[0],s=[1,t[0],1];for(let d=0;d<n;d++)s[0]*=t[d];s[1]=t[n];for(let d=n+1;d<t.length;d++)s[2]*=t[d];let i=new Map,a=new Int32Array(t[n]),u=new Mt(s,o,r),l=[],c=s[0]===1&&s[2]===1;for(let d=0;d<t[n];d++){let g;if(c)g=r[d].toString();else{let x=[];for(let v=0;v<s[0];v++)for(let N=0;N<s[2];N++)x.push(u.get(v,d,N));g=x.join(",")}let h=i.get(g);if(h!=null)a[d]=h;else{let x=i.size;i.set(g,x),a[d]=x,l.push(d)}}let p=s.slice();p[1]=i.size;let m=new Mt(p,o);l.forEach((d,g)=>{for(let h=0;h<s[0];h++)for(let x=0;x<s[2];x++)m.set(u.get(h,d,x),h,g,x)});let f=t.slice();return f[n]=p[1],{outputValues:m.values,outputShape:f,indices:a}}var{addImpl:X1,bincountImpl:_c,bincountReduceImpl:j1,bitwiseAndImpl:Y1,castImpl:Q1,ceilImpl:Z1,concatImpl:J1,equalImpl:eT,expImpl:tT,expm1Impl:rT,floorImpl:oT,gatherNdImpl:nT,gatherV2Impl:sT,greaterImpl:iT,greaterEqualImpl:aT,lessImpl:uT,lessEqualImpl:lT,linSpaceImpl:cT,logImpl:pT,maxImpl:mT,maximumImpl:fT,minimumImpl:dT,multiplyImpl:hT,negImpl:gT,notEqualImpl:xT,prodImpl:yT,raggedGatherImpl:bT,raggedRangeImpl:wT,raggedTensorToTensorImpl:vT,rangeImpl:TT,rsqrtImpl:ST,scatterImpl:CT,sigmoidImpl:NT,simpleAbsImpl:Dc,sliceImpl:ET,sparseFillEmptyRowsImpl:IT,sparseReshapeImpl:kT,sparseSegmentReductionImpl:Oc,sqrtImpl:$T,staticRegexReplaceImpl:RT,stridedSliceImpl:AT,stringNGramsImpl:_T,stringSplitImpl:DT,stringToHashBucketFastImpl:OT,subImpl:FT,tileImpl:PT,topKImpl:LT,transposeImpl:en,uniqueImpl:BT}=Kd;function qd(r,e){return["x","y","z","w","u","v"].slice(0,e).map(t=>`${r}.${t}`)}function Ae(r,e){return e===1?[r]:qd(r,e)}function MT(r,e){if(r===1)return"rc";let t="";for(let o=0;o<r;o++)t+=e[o],o<r-1&&(t+=",");return t}var Fc=class{constructor(e){if(this.variableNames=["A"],this.packedInputs=!1,this.packedOutput=!0,this.outputShape=e,this.rank=e.length,this.enableShapeUniforms=he(this.outputShape.length),this.rank===0)this.userCode=`
        void main() {
          setOutput(vec4(getA(), 0., 0., 0.));
        }
      `;else{let t=Ae("rc",this.rank),o=J(this.rank),n=this.getOutOfBoundsCondition(t),s=this.getSetup(t),i=this.getOutput(t);this.userCode=`
        void main() {
          ${o} rc = getOutputCoords();

          if(${n}) {
            setOutput(vec4(0));
          } else {
            ${s}

            setOutput(vec4(${i}));
          }
        }
      `}}getSourceCoordsArr(e){let t=[];for(let o=0;o<=1;o++)for(let n=0;n<=1;n++){let s=`${o===0?"r":"rp1"}, ${n===0?"c":"cp1"}`;for(let i=2;i<this.rank;i++)s=`${e[e.length-1-i]},`+s;t.push(s)}return t}getOutOfBoundsCondition(e){if(this.rank===1)return`rc > ${this.enableShapeUniforms?"outShape":this.outputShape[0]}`;let t="";for(let o=this.rank-2;o<this.rank;o++)t+=`${e[o]} >= ${this.enableShapeUniforms?`outShape[${o}]`:this.outputShape[o]}`,o<this.rank-1&&(t+="||");return t}getSetup(e){if(this.rank===1)return"";let t=e.slice(-2),o=this.enableShapeUniforms?`outShape[${this.rank} - 1]`:this.outputShape[this.rank-1],n=this.enableShapeUniforms?`outShape[${this.rank} - 2]`:this.outputShape[this.rank-2];return`
      int r = ${t[0]};
      int c = ${t[1]};
      int rp1 = r + 1;
      int cp1 = c + 1;

      bool cEdge = cp1 >= ${o};
      bool rEdge = rp1 >= ${n};
    `}getOutput(e){let t=this.getSourceCoordsArr(e);return this.rank===1?`getA(rc), (rc + 1 >= ${this.enableShapeUniforms?"outShape":this.outputShape[0]} ? 0. : getA(rc + 1)), 0, 0`:`getA(${t[0]}),
            cEdge ? 0. : getA(${t[1]}),
            rEdge ? 0. : getA(${t[2]}),
            rEdge || cEdge ? 0. : getA(${t[3]})`}};var hs=class{constructor(e,t){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"inputShape",type:"ivec3"}],this.outputShape=e,this.enableShapeUniforms=he(this.outputShape.length);let o="";for(let n=0;n<4;n++){let s="thisRC = rc;";n%2===1&&(s+="thisRC.z += 1;"),n>1&&(s+="thisRC.y += 1;"),o+=`
        ${s}
        ${n>0?"if(thisRC.y < rows && thisRC.z < cols){":""}
          int flatIndex = getFlatIndex(thisRC);

          ivec3 inputRC = inputCoordsFromReshapedOutCoords(flatIndex);
          vec2 inputRCInnerDims = vec2(float(inputRC.y),float(inputRC.z));

          result[${n}] =
            getChannel(getA(inputRC.x, inputRC.y, inputRC.z), inputRCInnerDims);
        ${n>0?"}":""}
      `}this.userCode=`
      ${iL(t,this.enableShapeUniforms)}
      ${this.enableShapeUniforms?is():ss(e)}

      void main() {
        ivec3 rc = getOutputCoords();

        vec4 result = vec4(0.);

        ivec3 thisRC;
        int rows = ${this.enableShapeUniforms?"outShape[1]":e[1]};
        int cols = ${this.enableShapeUniforms?"outShape[2]":e[2]};

        ${o}

        setOutput(result);
      }
    `}};function iL(r,e){return`
    ivec3 inputCoordsFromReshapedOutCoords(int index) {
      ${e?Gv(["r","c","d"],"inputShape"):sr(["r","c","d"],r)}
      return ivec3(r, c, d);
    }
  `}var Pc=class{constructor(e){this.gpgpu=e,this.numUsedTextures=0,this.numFreeTextures=0,this._numBytesAllocated=0,this._numBytesFree=0,this.freeTextures={},this.usedTextures={},this.logEnabled=!1}acquireTexture(e,t,o){let n=UT(t,o),s=GT(e,n,o);s in this.freeTextures||(this.freeTextures[s]=[]),s in this.usedTextures||(this.usedTextures[s]=[]);let i=VT(e,n,this.gpgpu.gl,this.gpgpu.textureConfig,o);if(this.freeTextures[s].length>0){this.numFreeTextures--,this.numUsedTextures++,this._numBytesFree-=i,this.log();let u=this.freeTextures[s].pop();return this.usedTextures[s].push(u),u}let a;return n===We.PACKED_2X2_FLOAT32?a=this.gpgpu.createPackedMatrixTexture(e[0],e[1]):n===We.PACKED_2X2_FLOAT16?a=this.gpgpu.createFloat16PackedMatrixTexture(e[0],e[1]):n===We.UNPACKED_FLOAT32?a=this.gpgpu.createFloat32MatrixTexture(e[0],e[1]):n===We.UNPACKED_FLOAT16?a=this.gpgpu.createFloat16MatrixTexture(e[0],e[1]):n===We.PACKED_4X1_UNSIGNED_BYTE&&(a=this.gpgpu.createUnsignedBytesMatrixTexture(e[0],e[1])),this.usedTextures[s].push(a),this.numUsedTextures++,this._numBytesAllocated+=i,this.log(),a}releaseTexture(e,t,o,n){if(this.freeTextures==null)return;let s=UT(o,n),i=GT(t,s,n);i in this.freeTextures||(this.freeTextures[i]=[]);let a=VT(t,s,this.gpgpu.gl,this.gpgpu.textureConfig,n),u=$().getNumber("WEBGL_DELETE_TEXTURE_THRESHOLD");u!==-1&&this._numBytesAllocated>u?(this.gpgpu.deleteMatrixTexture(e.texture),this._numBytesAllocated-=a):(this.freeTextures[i].push(e),this.numFreeTextures++,this._numBytesFree+=a),this.numUsedTextures--;let l=this.usedTextures[i],c=l&&l.indexOf(e);if(c==null||c<0)throw new Error("Cannot release a texture that was never provided by this texture manager");l[c]=l[l.length-1],l.pop(),this.log()}log(){if(!this.logEnabled)return;let e=this.numFreeTextures+this.numUsedTextures;console.log("Free/Used",`${this.numFreeTextures} / ${this.numUsedTextures}`,`(${e})`);let t=this._numBytesFree/this._numBytesAllocated;console.log(`Bytes allocated: ${this._numBytesAllocated}`),console.log(`Bytes unused: ${this._numBytesFree} (${Math.round(100*t)}%)`)}get numBytesAllocated(){return this._numBytesAllocated}get numBytesFree(){return this._numBytesFree}getNumUsedTextures(){return this.numUsedTextures}getNumFreeTextures(){return this.numFreeTextures}dispose(){if(this.freeTextures!=null){for(let e in this.freeTextures)this.freeTextures[e].forEach(t=>{this.gpgpu.deleteMatrixTexture(t.texture)});for(let e in this.usedTextures)this.usedTextures[e].forEach(t=>{this.gpgpu.deleteMatrixTexture(t.texture)});this.freeTextures=null,this.usedTextures=null,this.numUsedTextures=0,this.numFreeTextures=0,this._numBytesAllocated=0,this._numBytesFree=0}}};function aL(r,e){let t=r;if(e===t.R32F)return 4;if(e===t.R16F)return 2;if(e===t.RGBA32F)return 16;if(e===r.RGBA)return 16;if(e===t.RGBA16F)return 8;if(e===t.RGBA8)return 4;throw new Error(`Unknown internal format ${e}`)}function VT(r,e,t,o,n){let s=uL(e,o),i;if(n){let[u,l]=Tr(r[0],r[1]);i=u*l}else{let[u,l]=Yo(r[0],r[1]);i=u*l}let a=aL(t,s);return i*a}function uL(r,e){switch(r){case We.PACKED_2X2_FLOAT32:return wd(e);case We.PACKED_2X2_FLOAT16:return vd(e);case We.UNPACKED_FLOAT32:return xd(e);case We.UNPACKED_FLOAT16:return yd(e);case We.PACKED_4X1_UNSIGNED_BYTE:return bd(e);default:throw new Error(`Unknown physical texture type ${r}`)}}function lL(r){return $().getBool("WEBGL_RENDER_FLOAT32_ENABLED")?r?We.PACKED_2X2_FLOAT32:We.UNPACKED_FLOAT32:r?We.PACKED_2X2_FLOAT16:We.UNPACKED_FLOAT16}function UT(r,e){if(r===je.UPLOAD)return We.PACKED_2X2_FLOAT32;if(r===je.RENDER||r==null)return lL(e);if(r===je.DOWNLOAD||r===je.PIXELS)return We.PACKED_4X1_UNSIGNED_BYTE;throw new Error(`Unknown logical texture type ${r}`)}function GT(r,e,t){return`${r[0]}_${r[1]}_${e}_${t}`}var He=class{constructor(e,t){this.variableNames=["A"],this.outputShape=e,this.enableShapeUniforms=he(this.outputShape.length),this.userCode=`
      float unaryOperation(float x) {
        ${t}
      }

      void main() {
        float x = getAAtOutCoords();
        float y = unaryOperation(x);

        setOutput(y);
      }
    `}},Le="if (isnan(x)) return x;",zT="return x;",Xd="return abs(x);";var WT="return (x >= 0.0) ? x : (exp(x) - 1.0);",HT=Le+`
  return (x < 0.0) ? 0.0 : x;
`,KT=Le+`
  return (x < 0.0) ? 0.0 : min(6.0, x);
`,Cr="return x;",qT="return 1.0 / (1.0 + exp(-1.0 * x));";var jT="return x;",YT=`
  vec4 result;

  result.r = (x.r >= 0.0) ? x.r : (exp(x.r) - 1.0);
  result.g = (x.g >= 0.0) ? x.g : (exp(x.g) - 1.0);
  result.b = (x.b >= 0.0) ? x.b : (exp(x.b) - 1.0);
  result.a = (x.a >= 0.0) ? x.a : (exp(x.a) - 1.0);

  return result;
`,QT=`
  vec4 result = x * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,ZT=`
  vec4 result = min(x, vec4(6.)) * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,JT="return 1.0 / (1.0 + exp(-1.0 * x));",vt=class{constructor(e,t){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=e,this.enableShapeUniforms=he(this.outputShape.length),this.userCode=`
      vec4 unaryOperation(vec4 x) {
        ${t}
      }

      void main() {
        vec4 x = getAAtOutCoords();
        vec4 y = unaryOperation(x);

        setOutput(y);
      }
    `}};var Lc=class{constructor(e){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!1,this.outputShape=e,this.enableShapeUniforms=he(this.outputShape.length);let t=e.length,o=Ae("rc",t),n=J(t),s=MT(t,o),i=o.slice(-2),a=t<=1?"rc":`vec2(${i.join(",")})`;this.userCode=`
      void main() {
        ${n} rc = getOutputCoords();
        vec4 packedInput = getA(${s});

        setOutput(getChannel(packedInput, ${a}));
      }
    `}};var pL=wr.whereImpl,mL=1e-7,fL=1e-4,Bc={};function dL(r){return r in Bc||(Bc[r]={}),Bc[r]}var hL=$().getNumber("CPU_HANDOFF_SIZE_THRESHOLD"),gL=600;function xL(){return $().global.screen==null?1024:$().global.screen.height*$().global.screen.width*window.devicePixelRatio*gL/1024/1024}var hi=class r extends bo{nextDataId(){return r.nextDataId++}constructor(e){if(super(),this.pendingRead=new WeakMap,this.pendingDisposal=new WeakSet,this.dataRefCount=new WeakMap,this.numBytesInGPU=0,this.uploadWaitMs=0,this.downloadWaitMs=0,this.lastGlFlushTime=0,this.warnedAboutMemory=!1,this.pendingDeletes=0,this.disposed=!1,!$().getBool("HAS_WEBGL"))throw new Error("WebGL is not supported on this device");let t;if(e!=null){if(e instanceof ms)t=e;else{let o=Ot($().getNumber("WEBGL_VERSION"),e);t=new ms(o)}this.binaryCache={},this.gpgpuCreatedLocally=!1}else{let o=Ot($().getNumber("WEBGL_VERSION"));t=new ms(o),this.binaryCache=dL($().getNumber("WEBGL_VERSION")),this.gpgpuCreatedLocally=!0}this.gpgpu=t,this.canvas=this.gpgpu.gl.canvas,this.textureManager=new Pc(this.gpgpu),this.numMBBeforeWarning=xL(),this.texData=new Cs(this,Vt())}numDataIds(){return this.texData.numDataIds()-this.pendingDeletes}writeTexture(e,t,o,n,s,i){let a=this.makeTensorInfo(t,o),u=this.texData.get(a.dataId);u.isPacked=!1,u.texture={texture:e,texShape:[n,s]},u.texShape=[n,s];let l=li(t),c=new ci(l,!1,i),p=this.runWebGLProgram(c,[a],o,[[n,s]]);return p.shape=t,u.texture=null,this.disposeIntermediateTensorInfo(a),p.dataId}write(e,t,o){if(($().getBool("WEBGL_CHECK_NUMERICAL_PROBLEMS")||$().getBool("DEBUG"))&&this.checkNumericalProblems(e),o==="complex64"&&e!=null)throw new Error("Cannot write to a complex64 dtype. Please use tf.complex(real, imag).");let n={id:this.nextDataId()};return this.texData.set(n,{shape:t,dtype:o,values:e,usage:je.UPLOAD,refCount:1}),n}refCount(e){return this.texData.has(e)?this.texData.get(e).refCount:0}incRef(e){let t=this.texData.get(e);t.refCount++}decRef(e){if(this.texData.has(e)){let t=this.texData.get(e);t.refCount--}}move(e,t,o,n,s){if($().getBool("DEBUG")&&this.checkNumericalProblems(t),n==="complex64")throw new Error("Cannot write to a complex64 dtype. Please use tf.complex(real, imag).");this.texData.set(e,{shape:o,dtype:n,values:t,usage:je.UPLOAD,refCount:s})}disposeIntermediateTensorInfo(e){this.disposeData(e.dataId)}readSync(e){let t=this.texData.get(e),{values:o,dtype:n,complexTensorInfos:s,slice:i,shape:a,isPacked:u}=t;if(i!=null){let m;u?m=new vt(a,Cr):m=new He(a,Cr);let f=this.runWebGLProgram(m,[{dataId:e,shape:a,dtype:n}],n),d=this.readSync(f.dataId);return this.disposeIntermediateTensorInfo(f),d}if(o!=null)return this.convertAndCacheOnCPU(e);if(n==="string")return o;let l=this.activeTimers!=null,c;l&&(c=T.now());let p;if(n==="complex64"){let m=this.readSync(s.real.dataId),f=this.readSync(s.imag.dataId);p=I.mergeRealAndImagArrays(m,f)}else p=this.getValuesFromTexture(e);return l&&(this.downloadWaitMs+=T.now()-c),this.convertAndCacheOnCPU(e,p)}async read(e){if(this.pendingRead.has(e)){let d=this.pendingRead.get(e);return new Promise(g=>d.push(g))}let t=this.texData.get(e),{values:o,shape:n,slice:s,dtype:i,complexTensorInfos:a,isPacked:u}=t;if(s!=null){let d;u?d=new vt(n,Cr):d=new He(n,Cr);let g=this.runWebGLProgram(d,[{dataId:e,shape:n,dtype:i}],i),h=this.read(g.dataId);return this.disposeIntermediateTensorInfo(g),h}if(o!=null)return this.convertAndCacheOnCPU(e);if($().getBool("DEBUG")&&!$().getBool("WEBGL_DOWNLOAD_FLOAT_ENABLED")&&$().getNumber("WEBGL_VERSION")===2)throw new Error("tensor.data() with WEBGL_DOWNLOAD_FLOAT_ENABLED=false and WEBGL_VERSION=2 not yet supported.");let l=null,c;if(i!=="complex64"&&$().get("WEBGL_BUFFER_SUPPORTED")){c=this.decode(e);let d=this.texData.get(c.dataId);l=this.gpgpu.createBufferFromTexture(d.texture.texture,...si(n))}this.pendingRead.set(e,[]),i!=="complex64"&&await this.gpgpu.createAndWaitForFence();let p;if(i==="complex64"){let d=await Promise.all([this.read(a.real.dataId),this.read(a.imag.dataId)]),g=d[0],h=d[1];p=I.mergeRealAndImagArrays(g,h)}else if(l==null)p=this.getValuesFromTexture(e);else{let d=T.sizeFromShape(n);p=this.gpgpu.downloadFloat32MatrixFromBuffer(l,d)}if(c!=null&&this.disposeIntermediateTensorInfo(c),l!=null){let d=this.gpgpu.gl;G(d,()=>d.deleteBuffer(l))}let m=this.convertAndCacheOnCPU(e,p),f=this.pendingRead.get(e);return this.pendingRead.delete(e),f.forEach(d=>d(m)),this.pendingDisposal.has(e)&&(this.pendingDisposal.delete(e),this.disposeData(e)&&Vt().removeDataId(e,this),this.pendingDeletes--),m}readToGPU(e,t={}){let o=this.texData.get(e),{values:n,shape:s,slice:i,dtype:a,isPacked:u,texture:l}=o;if(a==="complex64")throw new Error("Does not support reading texture for complex64 dtype.");if(i!=null){let f;u?f=new vt(s,Cr):f=new He(s,Cr);let d=this.runWebGLProgram(f,[{dataId:e,shape:s,dtype:a}],a),g=this.readToGPU(d,t);return this.disposeIntermediateTensorInfo(d),g}if(l==null)throw n!=null?new Error("Data is not on GPU but on CPU."):new Error("There is no data on GPU or CPU.");let c=this.decode(e,t.customTexShape),p=Vt().makeTensorFromTensorInfo(c),m=this.texData.get(c.dataId);return Object.assign({tensorRef:p},m.texture)}bufferSync(e){let t=this.readSync(e.dataId);if(e.dtype==="string")try{let o=t.map(n=>T.decodeString(n));return oe(e.shape,e.dtype,o)}catch{throw new Error("Failed to decode encoded string bytes into utf-8")}return oe(e.shape,e.dtype,t)}checkNumericalProblems(e){if(e!=null)for(let t=0;t<e.length;t++){let o=e[t];if(!Tv(o))throw $().getBool("WEBGL_RENDER_FLOAT32_CAPABLE")?Error(`The value ${o} cannot be represented with your current settings. Consider enabling float32 rendering: 'tf.env().set('WEBGL_RENDER_FLOAT32_ENABLED', true);'`):Error(`The value ${o} cannot be represented on this device.`)}}getValuesFromTexture(e){let{shape:t,dtype:o,isPacked:n}=this.texData.get(e),s=T.sizeFromShape(t);if($().getBool("WEBGL_DOWNLOAD_FLOAT_ENABLED")){let m=this.decode(e),f=this.texData.get(m.dataId),d=this.gpgpu.downloadMatrixFromPackedTexture(f.texture.texture,...si(t)).subarray(0,s);return this.disposeIntermediateTensorInfo(m),d}let i=$().getBool("WEBGL_PACK")&&n===!0,a=i?li(t):t,u=i?new Ic(a):new Ec(a),l=this.runWebGLProgram(u,[{shape:a,dtype:o,dataId:e}],"float32"),c=this.texData.get(l.dataId),p=this.gpgpu.downloadByteEncodedFloatMatrixFromOutputTexture(c.texture.texture,c.texShape[0],c.texShape[1]).subarray(0,s);return this.disposeIntermediateTensorInfo(l),p}timerAvailable(){return $().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0}time(e){let t=this.activeTimers,o=[],n=!1;this.programTimersStack==null?(this.programTimersStack=o,n=!0):this.activeTimers.push(o),this.activeTimers=o,e();let s=T.flatten(this.activeTimers.map(u=>u.query)).filter(u=>u!=null),i=T.flatten(this.activeTimers.map(u=>u.name)).filter(u=>u!=null);this.activeTimers=t,n&&(this.programTimersStack=null);let a={uploadWaitMs:this.uploadWaitMs,downloadWaitMs:this.downloadWaitMs,kernelMs:null,wallMs:null};return(async()=>{if($().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0){let u=await Promise.all(s);a.kernelMs=T.sum(u),a.getExtraProfileInfo=()=>u.map((l,c)=>({name:i[c],ms:l})).map(l=>`${l.name}: ${l.ms}`).join(", ")}else a.kernelMs={error:"WebGL query timers are not supported in this environment."};return this.uploadWaitMs=0,this.downloadWaitMs=0,a})()}memory(){return{unreliable:!1,numBytesInGPU:this.numBytesInGPU,numBytesInGPUAllocated:this.textureManager.numBytesAllocated,numBytesInGPUFree:this.textureManager.numBytesFree}}startTimer(){return $().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0?this.gpgpu.beginQuery():{startMs:T.now(),endMs:null}}endTimer(e){return $().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0?(this.gpgpu.endQuery(),e):(e.endMs=T.now(),e)}async getQueryTime(e){if($().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0)return this.gpgpu.waitForQueryAndGetTime(e);let t=e;return t.endMs-t.startMs}disposeData(e,t=!1){if(this.pendingDisposal.has(e))return!1;if(!this.texData.has(e))return!0;if(t?this.texData.get(e).refCount=0:this.texData.get(e).refCount--,!t&&this.texData.get(e).refCount>0)return!1;if(this.pendingRead.has(e))return this.pendingDisposal.add(e),this.pendingDeletes++,!1;this.releaseGPUData(e);let{complexTensorInfos:o}=this.texData.get(e);return o!=null&&(this.disposeData(o.real.dataId,t),this.disposeData(o.imag.dataId,t)),this.texData.delete(e),!0}releaseGPUData(e){let{texture:t,dtype:o,texShape:n,usage:s,isPacked:i,slice:a}=this.texData.get(e),u=a&&a.origDataId||e,l=this.dataRefCount.get(u);l>1?this.dataRefCount.set(u,l-1):(this.dataRefCount.delete(u),t!=null&&(this.numBytesInGPU-=this.computeBytes(n,o),this.textureManager.releaseTexture(t,n,s,i)));let c=this.texData.get(e);c.texture=null,c.texShape=null,c.isPacked=!1,c.slice=null}getTexture(e){return this.uploadToGPU(e),this.texData.get(e).texture.texture}getDataInfo(e){return this.texData.get(e)}shouldExecuteOnCPU(e,t=hL){return $().getBool("WEBGL_CPU_FORWARD")&&e.every(o=>this.texData.get(o.dataId).texture==null&&T.sizeFromShape(o.shape)<t)}getGPGPUContext(){return this.gpgpu}where(e){I.warn("tf.where() in webgl locks the UI thread. Call tf.whereAsync() instead");let t=e.dataSync();return pL(e.shape,t)}packedUnaryOp(e,t,o){let n=new vt(e.shape,t),s=this.compileAndRun(n,[e],o);return Vt().makeTensorFromTensorInfo(s)}abs(e){if(this.shouldExecuteOnCPU([e])&&e.dtype!=="complex64"){let n=Dc(this.texData.get(e.dataId).values);return this.makeOutput(e.shape,e.dtype,n)}if($().getBool("WEBGL_PACK_UNARY_OPERATIONS"))return this.packedUnaryOp(e,Xd,e.dtype);let t=new He(e.shape,Xd),o=this.compileAndRun(t,[e]);return Vt().makeTensorFromTensorInfo(o)}makeTensorInfo(e,t,o){let n;if(t==="string"&&o!=null&&o.length>0&&T.isString(o[0])){let s=o.map(i=>T.encodeString(i));n=this.write(s,e,t)}else n=this.write(o,e,t);return this.texData.get(n).usage=null,{dataId:n,shape:e,dtype:t}}makeOutput(e,t,o){return Vt().makeTensorFromTensorInfo(this.makeTensorInfo(e,t,o),this)}unpackTensor(e){let t=new Lc(e.shape);return this.runWebGLProgram(t,[e],e.dtype)}packTensor(e){let t=new Fc(e.shape);return this.runWebGLProgram(t,[e],e.dtype,null,!0)}packedReshape(e,t){let o=[mo(e.shape),...fo(e.shape)],n={dtype:e.dtype,shape:o,dataId:e.dataId},s=[mo(t),...fo(t)],i=new hs(s,o),a=!0,u=[o],l=this.runWebGLProgram(i,[n],e.dtype,u,a);return{dataId:l.dataId,shape:t,dtype:l.dtype}}decode(e,t){let o=this.texData.get(e),{isPacked:n,shape:s,dtype:i}=o;if(t!=null){let m=T.sizeFromShape(s),f=t[0]*t[1]*4;T.assert(m<=f,()=>"customTexShape is too small. Row * Column * 4 should be equal or larger than the size of the tensor data.")}let a=li(s),u;n?u=new Nc(a):u=new Cc(a);let l=!0,c=[t??si(a)],p=this.runWebGLProgram(u,[{shape:a,dtype:i,dataId:e}],i,c,l,t);return{dtype:i,shape:s,dataId:p.dataId}}runWebGLProgram(e,t,o,n,s=!1,i){let a=this.makeTensorInfo(e.outputShape,o),u=this.texData.get(a.dataId);if(e.packedOutput&&(u.isPacked=!0),e.outPackingScheme===po.DENSE){let x=i??si(e.outputShape);u.texShape=x.map(v=>v*2)}if(e.outTexUsage!=null&&(u.usage=e.outTexUsage),T.sizeFromShape(a.shape)===0)return u.values=T.getTypedArrayFromDType(a.dtype,0),a;let l=[],c=t.map(x=>{if(x.dtype==="complex64")throw new Error("GPGPUProgram does not support complex64 input. For complex64 dtypes, please separate the program into real and imaginary parts.");let v=this.texData.get(x.dataId);if(v.texture==null){if(!e.packedInputs&&T.sizeFromShape(x.shape)<=$().getNumber("WEBGL_SIZE_UPLOAD_UNIFORM"))return{shape:x.shape,texData:null,isUniform:!0,uniformValues:v.values};e.packedInputs&&(v.isPacked=!0,v.shape=x.shape)}if(this.uploadToGPU(x.dataId),!!v.isPacked!=!!e.packedInputs)x=v.isPacked?this.unpackTensor(x):this.packTensor(x),l.push(x),v=this.texData.get(x.dataId);else if(v.isPacked&&!Qo(v.shape,x.shape)){let N=x,E=x.shape;x.shape=v.shape,x=this.packedReshape(x,E),l.push(x),v=this.texData.get(x.dataId),N.shape=E}return{shape:x.shape,texData:v,isUniform:!1}});this.uploadToGPU(a.dataId);let p={shape:a.shape,texData:u,isUniform:!1},m=Yv(e,c,p),f=this.getAndSaveBinary(m,()=>Xv(this.gpgpu,e,c,p)),d=this.activeTimers!=null,g;d&&(g=this.startTimer()),$().get("ENGINE_COMPILE_ONLY")||jv(this.gpgpu,f,c,p,n),l.forEach(x=>this.disposeIntermediateTensorInfo(x)),d&&(g=this.endTimer(g),this.activeTimers.push({name:e.constructor.name,query:this.getQueryTime(g)}));let h=$().getNumber("WEBGL_FLUSH_THRESHOLD");if(h>0){let x=T.now();x-this.lastGlFlushTime>h&&(this.gpgpu.gl.flush(),this.lastGlFlushTime=x)}if(!$().getBool("WEBGL_LAZILY_UNPACK")&&u.isPacked&&s===!1){let x=this.unpackTensor(a);return this.disposeIntermediateTensorInfo(a),x}return a}compileAndRun(e,t,o,n,s=!1){return o=o||t[0].dtype,this.runWebGLProgram(e,t,o,n,s)}getAndSaveBinary(e,t){return e in this.binaryCache||(this.binaryCache[e]=t()),this.binaryCache[e]}getTextureManager(){return this.textureManager}dispose(){this.disposed||($().getBool("IS_TEST")||Object.keys(this.binaryCache).forEach(t=>{this.gpgpu.deleteProgram(this.binaryCache[t].webGLProgram),delete this.binaryCache[t]}),this.textureManager.dispose(),this.canvas!=null&&typeof HTMLCanvasElement<"u"&&this.canvas instanceof HTMLCanvasElement?this.canvas.remove():this.canvas=null,this.gpgpuCreatedLocally&&(this.gpgpu.program=null,this.gpgpu.dispose()),this.disposed=!0)}floatPrecision(){return this.floatPrecisionValue==null&&(this.floatPrecisionValue=H(()=>{if(!$().get("WEBGL_RENDER_FLOAT32_ENABLED")){let e=$().getBool("DEBUG");$().set("DEBUG",!1);let t=this.abs(K(1e-8)).dataSync()[0];if($().set("DEBUG",e),t>0)return 32}return 16})),this.floatPrecisionValue}epsilon(){return this.floatPrecision()===32?mL:fL}uploadToGPU(e){let t=this.texData.get(e),{shape:o,dtype:n,values:s,texture:i,usage:a,isPacked:u}=t;if(i!=null)return;let l=this.activeTimers!=null,c;l&&(c=T.now());let p=t.texShape;if(p==null&&(p=Fv(o,u),t.texShape=p),s!=null){let m=li(o),f,d=p[1],g=p[0],h=s instanceof Uint8Array||s instanceof Uint8ClampedArray;(u||!h)&&([d,g]=Tr(p[0],p[1])),u?f=new kc(m,h):f=new ci(m,h);let x=h?[g,d]:p,v=this.makeTensorInfo(x,n),N=this.texData.get(v.dataId);h?N.usage=je.PIXELS:N.usage=je.UPLOAD,N.texShape=x,this.gpgpu.uploadDenseMatrixToTexture(this.getTexture(v.dataId),d,g,s);let E=[[g,d]],R=this.runWebGLProgram(f,[v],n,E,!0),A=this.texData.get(R.dataId);t.texShape=A.texShape,t.isPacked=A.isPacked,t.usage=A.usage,$().get("ENGINE_COMPILE_ONLY")?this.disposeData(R.dataId):(t.texture=A.texture,t.values=null,this.texData.delete(R.dataId)),this.disposeIntermediateTensorInfo(v),l&&(this.uploadWaitMs+=T.now()-c)}else{let m=this.acquireTexture(p,a,n,u);t.texture=m}}convertAndCacheOnCPU(e,t){let o=this.texData.get(e),{dtype:n}=o;return t!=null&&(o.values=yL(t,n)),o.values}acquireTexture(e,t,o,n){if(this.numBytesInGPU+=this.computeBytes(e,o),!this.warnedAboutMemory&&this.numBytesInGPU>this.numMBBeforeWarning*1024*1024){let s=(this.numBytesInGPU/1024/1024).toFixed(2);this.warnedAboutMemory=!0,console.warn(`High memory usage in GPU: ${s} MB, most likely due to a memory leak`)}return this.textureManager.acquireTexture(e,t,n)}computeBytes(e,t){return e[0]*e[1]*T.bytesPerElement(t)}checkCompileCompletion(){for(let[,e]of Object.entries(this.binaryCache))this.checkCompletion_(e)}async checkCompileCompletionAsync(){let e=[];if(this.gpgpu.parallelCompilationExtension){for(let[,t]of Object.entries(this.binaryCache))e.push(this.checkCompletionAsync_(t));return Promise.all(e)}else{for(let[,t]of Object.entries(this.binaryCache)){let o=new Promise(n=>{try{this.checkCompletion_(t),n(!0)}catch(s){throw s}});e.push(o)}return Promise.all(e)}}async checkCompletionAsync_(e){return this.gpgpu.gl.getProgramParameter(e.webGLProgram,this.gpgpu.parallelCompilationExtension.COMPLETION_STATUS_KHR)?this.checkCompletion_(e):(await wf(),this.checkCompletionAsync_(e))}checkCompletion_(e){if(this.gpgpu.gl.getProgramParameter(e.webGLProgram,this.gpgpu.gl.LINK_STATUS)===!1)throw console.log(this.gpgpu.gl.getProgramInfoLog(e.webGLProgram)),this.gpgpu.gl.getShaderParameter(e.fragmentShader,this.gpgpu.gl.COMPILE_STATUS)===!1?(md(e.source,this.gpgpu.gl.getShaderInfoLog(e.fragmentShader)),new Error("Failed to compile fragment shader.")):new Error("Failed to link vertex and fragment shaders.");return!0}getUniformLocations(){for(let e of Object.values(this.binaryCache)){this.gpgpu.buildVao(e.webGLProgram);let{variablesLocations:t,customUniformLocations:o,infLoc:n,nanLoc:s,outShapeLocation:i,outShapeStridesLocation:a,outTexShapeLocation:u}=gd(this.gpgpu,e.program,e.webGLProgram);e.variablesLocations=t,e.customUniformLocations=o,e.infLoc=n,e.nanLoc=s,e.outShapeLocation=i,e.outShapeStridesLocation=a,e.outTexShapeLocation=u}}createTensorFromGPUData(e,t,o){e.channels=e.channels||"RGBA";let{texture:n,height:s,width:i,channels:a}=e,u=Vt().backend;if(!u.gpgpu.gl.isTexture(n))throw new Error("The texture is invalid. Also, please make sure the texture and the TFJS WebGL backend are using the same canvas. If you want to use your own custom canvas, you have to create and use the custom TFJS WebGL backend created from the canvas through 'new tf.MathBackendWebGL(customCanvas)'.");let l=u.writeTexture(n,t,o,s,i,a);return Vt().makeTensorFromDataId(l,t,o,u)}};hi.nextDataId=0;function yL(r,e){if(e==="float32"||e==="complex64")return r;if(e==="int32"||e==="bool"){let t=e==="int32"?new Int32Array(r.length):new Uint8Array(r.length);for(let o=0;o<t.length;++o)t[o]=Math.round(r[o]);return t}else throw new Error(`Unknown dtype ${e}`)}qr.isBrowser()&&gg("webgl",()=>new hi,2);var gs=`
  if (isnan(a)) return a;
  if (isnan(b)) return b;
`;var Tt=class{constructor(e,t,o){this.variableNames=["A","B"],this.outputShape=I.assertAndGetBroadcastShape(t,o),this.enableShapeUniforms=he(this.outputShape.length),this.userCode=`
      float binaryOperation(float a, float b) {
        ${e}
      }

      void main() {
        float a = getAAtOutCoords();
        float b = getBAtOutCoords();
        setOutput(binaryOperation(a, b));
      }
    `}};var Pt=`
  result.r = isNaN.r ? NAN : result.r;
  result.g = isNaN.g ? NAN : result.g;
  result.b = isNaN.b ? NAN : result.b;
  result.a = isNaN.a ? NAN : result.a;
`;var Ft=class{constructor(e,t,o,n=!1){this.variableNames=["A","B"],this.supportsBroadcasting=!0,this.packedInputs=!0,this.packedOutput=!0,this.outputShape=I.assertAndGetBroadcastShape(t,o);let s=this.outputShape.length;this.enableShapeUniforms=he(s);let i="";if(n)if(s===0||T.sizeFromShape(this.outputShape)===1)i=`
          result.y = 0.;
          result.z = 0.;
          result.w = 0.;
        `;else if(i=`
          ${J(s)} coords = getOutputCoords();
        `,s===1)this.enableShapeUniforms?i+=`
            result.y = (coords + 1) >= outShape ? 0. : result.y;
            result.z = 0.;
            result.w = 0.;
          `:i+=`
            result.y = (coords + 1) >= ${this.outputShape[0]} ? 0. : result.y;
            result.z = 0.;
            result.w = 0.;
          `;else{let u=Ae("coords",s);this.enableShapeUniforms?i+=`
            bool nextRowOutOfBounds =
              (${u[s-2]} + 1) >= outShape[${s} - 2];
            bool nextColOutOfBounds =
              (${u[s-1]} + 1) >= outShape[${s} - 1];
            result.y = nextColOutOfBounds ? 0. : result.y;
            result.z = nextRowOutOfBounds ? 0. : result.z;
            result.w = nextColOutOfBounds || nextRowOutOfBounds ? 0. : result.w;
          `:i+=`
            bool nextRowOutOfBounds =
              (${u[s-2]} + 1) >= ${this.outputShape[s-2]};
            bool nextColOutOfBounds =
              (${u[s-1]} + 1) >= ${this.outputShape[s-1]};
            result.y = nextColOutOfBounds ? 0. : result.y;
            result.z = nextRowOutOfBounds ? 0. : result.z;
            result.w = nextColOutOfBounds || nextRowOutOfBounds ? 0. : result.w;
          `}this.userCode=`
      vec4 binaryOperation(vec4 a, vec4 b) {
        ${e}
      }

      void main() {
        vec4 a = getAAtOutCoords();
        vec4 b = getBAtOutCoords();

        vec4 result = binaryOperation(a, b);
        ${i}

        setOutput(result);
      }
    `}};function _e(r){let{inputs:e,backend:t}=r,{x:o}=e;return t.incRef(o.dataId),{dataId:o.dataId,shape:o.shape,dtype:o.dtype}}var eS={kernelName:Co,backendName:"webgl",kernelFunc:_e};function St(r){let{inputs:e,backend:t}=r,{real:o,imag:n}=e,s=t.makeTensorInfo(o.shape,"complex64"),i=t.texData.get(s.dataId),a=_e({inputs:{x:o},backend:t}),u=_e({inputs:{x:n},backend:t});return i.complexTensorInfos={real:a,imag:u},s}var tS={kernelName:ks,backendName:"webgl",kernelFunc:St};var jd="return (a < 0.) ? b * a : a;",Yd=`
  vec4 aLessThanZero = vec4(lessThan(a, vec4(0.)));
  return (aLessThanZero * (b * a)) + ((vec4(1.0) - aLessThanZero) * a);
`;function bL(r){let{inputs:e,backend:t,attrs:o}=r,{x:n}=e,{alpha:s}=o,i=t.makeTensorInfo([],"float32",T.createScalarValue(s,"float32")),a=$().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new Ft(Yd,n.shape,i.shape):new Tt(jd,n.shape,i.shape),u=t.runWebGLProgram(a,[n,i],"float32");return t.disposeIntermediateTensorInfo(i),u}var rS={kernelName:va,backendName:"webgl",kernelFunc:bL};var Qd="return (a < 0.) ? b * a : a;",Zd=`
  vec4 aLessThanZero = vec4(lessThan(a, vec4(0.)));
  return (aLessThanZero * (b * a)) + ((vec4(1.0) - aLessThanZero) * a);
`;function wL(r){let{inputs:e,backend:t}=r,{x:o,alpha:n}=e,s=$().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new Ft(Zd,o.shape,n.shape):new Tt(Qd,o.shape,n.shape);return t.runWebGLProgram(s,[o,n],"float32")}var oS={kernelName:Va,backendName:"webgl",kernelFunc:wL};var Qt="if (isnan(x)) return x;";function W({opSnippet:r,packedOpSnippet:e,cpuKernelImpl:t,dtype:o}){return({inputs:n,backend:s})=>{let{x:i}=n,a=s,u=o||i.dtype;if(a.shouldExecuteOnCPU([i])&&t!=null){let p=a.texData.get(i.dataId),m=t(p.values,u);return a.makeTensorInfo(i.shape,u,m)}let l=$().getBool("WEBGL_PACK_UNARY_OPERATIONS")&&e!=null,c;return l?c=new vt(i.shape,e):c=new He(i.shape,r),a.runWebGLProgram(c,[i],u)}}function me({opSnippet:r,packedOpSnippet:e,checkOutOfBounds:t=!1,supportsComplex:o=!1,cpuKernelImpl:n,dtype:s}){return({inputs:i,backend:a})=>{let{a:u,b:l}=i,c=a;if(o&&u.dtype==="complex64"){let d=c.texData.get(u.dataId),g=c.texData.get(l.dataId),[h,x]=[[d.complexTensorInfos.real,g.complexTensorInfos.real],[d.complexTensorInfos.imag,g.complexTensorInfos.imag]].map(N=>{let[E,k]=N,R={dataId:E.dataId,dtype:E.dtype,shape:u.shape},A={dataId:k.dataId,dtype:k.dtype,shape:l.shape},_=new Tt(r,u.shape,l.shape);return c.runWebGLProgram(_,[R,A],Qe(E.dtype,k.dtype))}),v=St({inputs:{real:h,imag:x},backend:c});return c.disposeIntermediateTensorInfo(h),c.disposeIntermediateTensorInfo(x),v}let p=s||Qe(u.dtype,l.dtype);if((u.dtype==="string"||l.dtype==="string"||c.shouldExecuteOnCPU([u,l]))&&n!=null){let d=c.texData.get(u.dataId).values,g=c.texData.get(l.dataId).values,h=u.dtype==="string"?I.fromUint8ToStringArray(d):d,x=u.dtype==="string"?I.fromUint8ToStringArray(g):g,[v,N]=n(u.shape,l.shape,h,x,p),E=c.makeTensorInfo(N,p),k=c.texData.get(E.dataId);return k.values=v,E}let m=$().getBool("WEBGL_PACK_BINARY_OPERATIONS")&&e!=null,f;return m?f=new Ft(e,u.shape,l.shape,t):f=new Tt(r,u.shape,l.shape),c.runWebGLProgram(f,[u,l],p)}}function Mr(r,e=!1){if(r==="linear")return e?jT:zT;if(r==="relu")return e?QT:HT;if(r==="elu")return e?YT:WT;if(r==="relu6")return e?ZT:KT;if(r==="prelu")return e?Zd:Qd;if(r==="leakyrelu")return e?Yd:jd;if(r==="sigmoid")return e?JT:qT;throw new Error(`Activation ${r} has not been implemented for the WebGL backend.`)}var xs=class{constructor(e,t,o,n=!1,s=!1,i=!1,a=null,u=!1,l=!1){this.variableNames=["matrixA","matrixB"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=o,this.enableShapeUniforms=he(this.outputShape.length);let c=n?e[1]:e[2],p=Math.ceil(c/2),m=n?"i * 2, rc.y":"rc.y, i * 2",f=s?"rc.z, i * 2":"i * 2, rc.z",d=n?["a.xxyy","a.zzww"]:["a.xxzz","a.yyww"],g=s?["b.xzxz","b.ywyw"]:["b.xyxy","b.zwzw"],h="",x="";a&&(u?h=`vec4 activation(vec4 a) {
          vec4 b = getPreluActivationWeightsAtOutCoords();
          ${a}
        }`:l?h=`vec4 activation(vec4 a) {
          vec4 b = getLeakyreluAlphaAtOutCoords();
          ${a}
        }`:h=`vec4 activation(vec4 x) {
          ${a}
        }`,x="result = activation(result);");let v=i?"result += getBiasAtOutCoords();":"";i&&this.variableNames.push("bias"),u&&this.variableNames.push("preluActivationWeights"),l&&this.variableNames.push("leakyreluAlpha");let N="rc.x",E="rc.x";e[0]<t[0]?N=`imod(rc.x, ${e[0]})`:t[0]<e[0]&&(E=`imod(rc.x, ${t[0]})`),this.userCode=`
      ${h}
      // Don't use uniform for sharedDimensionPacked for performance.
      const float sharedDimension = ${p}.0;

      vec4 dot2x2ARowBCol(ivec3 rc) {
        vec4 result = vec4(0);
        int batchA = ${N};
        int batchB = ${E};
        for (int i = 0; i < ${p}; i++) {
          vec4 a = getMatrixA(batchA, ${m});
          vec4 b = getMatrixB(batchB, ${f});

          // These swizzled products need to be separately added.
          // See: https://github.com/tensorflow/tfjs/issues/1735
          result += (${d[0]} * ${g[0]});
          result += (${d[1]} * ${g[1]});
        }
        return result;
      }

      void main() {
        ivec3 rc = getOutputCoords();
        vec4 result = dot2x2ARowBCol(rc);

        ${v}

        ${x}

        setOutput(result);
      }
    `}};var Jd={REAL:"return areal * breal - aimag * bimag;",IMAG:"return areal * bimag + aimag * breal;"},gi=class{constructor(e,t,o){this.variableNames=["AReal","AImag","BReal","BImag"],this.outputShape=I.assertAndGetBroadcastShape(t,o),this.userCode=`
      float binaryOpComplex(
          float areal, float aimag, float breal, float bimag) {
        ${e}
      }

      void main() {
        float areal = getARealAtOutCoords();
        float aimag = getAImagAtOutCoords();
        float breal = getBRealAtOutCoords();
        float bimag = getBImagAtOutCoords();
        setOutput(binaryOpComplex(areal, aimag, breal, bimag));
      }
    `}};var nS="return a * b;";function xi(r){let{inputs:e,backend:t}=r,{a:o,b:n}=e,s=I.upcastType(o.dtype,n.dtype);if(o.dtype==="complex64"){let a=t.texData.get(o.dataId),u=t.texData.get(n.dataId),l=new gi(Jd.REAL,o.shape,n.shape),c=new gi(Jd.IMAG,o.shape,n.shape),p=[{dataId:a.complexTensorInfos.real.dataId,dtype:a.complexTensorInfos.real.dtype,shape:o.shape},{dataId:a.complexTensorInfos.imag.dataId,dtype:a.complexTensorInfos.imag.dtype,shape:o.shape},{dataId:u.complexTensorInfos.real.dataId,dtype:u.complexTensorInfos.real.dtype,shape:n.shape},{dataId:u.complexTensorInfos.imag.dataId,dtype:u.complexTensorInfos.imag.dtype,shape:n.shape}],m=t.runWebGLProgram(l,p,"float32"),f=t.runWebGLProgram(c,p,"float32"),d=St({inputs:{real:m,imag:f},backend:t});return t.disposeIntermediateTensorInfo(m),t.disposeIntermediateTensorInfo(f),d}if(t.shouldExecuteOnCPU([o,n])){let a=t.texData.get(o.dataId),u=t.texData.get(n.dataId),[l,c]=hT(o.shape,n.shape,a.values,u.values,s),p=t.makeTensorInfo(c,s),m=t.texData.get(p.dataId);return m.values=l,p}let i;return $().getBool("WEBGL_PACK_BINARY_OPERATIONS")?i=new Ft(nS,o.shape,n.shape):i=new Tt(nS,o.shape,n.shape),t.runWebGLProgram(i,[o,n],s)}var sS={kernelName:En,backendName:"webgl",kernelFunc:xi};function iS(r,e,t){let o=[mo(r.shape),...fo(r.shape)],n={dtype:r.dtype,shape:o,dataId:r.dataId},s=[mo(e),...fo(e)],i=new hs(s,o),a=!0,u=[o],l=t.runWebGLProgram(i,[n],r.dtype,u,a);return{dataId:l.dataId,shape:e,dtype:l.dtype}}function L(r){let{inputs:e,backend:t,attrs:o}=r,{x:n}=e,{shape:s}=o,i=t,a=T.sizeFromShape(n.shape),u=T.inferFromImplicitShape(s,a),l=T.sizeFromShape(u);T.assert(a===l,()=>`The new shape (${u}) has ${l} elements and the old shape (${n.shape}) has ${a} elements. The new shape and old shape must have the same number of elements.`);let c=i.texData.get(n.dataId);return c.isPacked&&!Qo(n.shape,u)&&!(c.texture!==null&&Qo(c.shape,u))?iS(n,u,i):(i.incRef(n.dataId),{dataId:n.dataId,shape:u,dtype:n.dtype})}var aS={kernelName:qa,backendName:"webgl",kernelFunc:L};var yi=class{constructor(e,t){this.variableNames=["x"];let{windowSize:o,batchSize:n,inSize:s,outSize:i}=e;this.outputShape=[n,i];let a=Math.floor(o/4)*4,u=o%4,l="sumValue += dot(values, ones);";if(t!=null){let p=1/t;l=`sumValue += dot(values * ${T.isInt(p)?p.toPrecision(2):p}, ones);`}let c="";s%o>0&&(c=`
        if (inIdx < 0 || inIdx >= ${s}) {
          return 0.0;
        }
      `),this.userCode=`
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float getValue(int batch, int inIdx) {
        ${c}
        return getX(batch, inIdx);
      }

      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = outIdx * ${o};

        float sumValue = 0.0;

        for (int i = 0; i < ${a}; i += 4) {
          int inIdx = inOffset + i;
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            getValue(batch, inIdx + 3)
          );

          ${l}
        }

        int inIdx = inOffset + ${a};
        if (${u===1}) {
          vec4 values = vec4(getValue(batch, inIdx), 0.0, 0.0, 0.0);

          ${l}
        } else if (${u===2}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1), 0.0, 0.0);

          ${l}
        } else if (${u===3}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2), 0.0);

          ${l}
        }
        setOutput(sumValue);
      }
    `}};var Mc=class{constructor(e,t){this.variableNames=["x"];let{windowSize:o,batchSize:n,inSize:s,outSize:i}=e;this.outputShape=[n,i];let a="0.0",u="";t==="prod"?a="1.0":t==="min"?(a="1.0 / 1e-20",u="min"):t==="max"&&(a="-1.0 / 1e-20",u="max");let l=`${t}(${t}(${t}(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])`;t==="sum"?l="sumValue":t==="prod"?l="prodValue":t==="all"?l="allValue":t==="any"&&(l="anyValue");let c=Math.floor(o/4)*4,p=o%4,m=`
      if (${t==="sum"}) {
        sumValue += dot(values, ones);
      } else if (${t==="prod"}) {
        vec2 tmp = vec2(values[0], values[1]) * vec2(values[2], values[3]);
        prodValue *= tmp[0] * tmp[1];
      } else {
        minMaxValue = ${u}(values, minMaxValue);
        if (${t==="min"} || ${t==="max"}) {
          minMaxValue = ${u}(values, minMaxValue);
          bvec4 isNaN = isnan(values);
          if (isNaN.r || isNaN.g || isNaN.b || isNaN.a) {
            minMaxValue = vec4(NAN);
          }
        }
      }
    `,f="vec4";t==="all"?(a="1.0",m=`
        bool reducedAllValue = all(values);
        float floatedReducedAllValue = float(reducedAllValue);
        allValue = float(allValue >= 1.0 && floatedReducedAllValue >= 1.0);
      `,f="bvec4"):t==="any"&&(a="0.0",m=`
        bool reducedAnyValue = any(values);
        float floatedReducedAnyValue = float(reducedAnyValue);
        anyValue = float(anyValue >= 1.0 || floatedReducedAnyValue >= 1.0);
      `,f="bvec4");let d="";s%o>0&&(d=`
        if (inIdx < 0 || inIdx >= ${s}) {
          return initializationValue;
        }
      `),this.userCode=`
      const float initializationValue = ${a};
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float getValue(int batch, int inIdx) {
        ${d}
        return getX(batch, inIdx);
      }

      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = outIdx * ${o};

        vec4 minMaxValue = vec4(${a});
        float prodValue = 1.0;
        float sumValue = 0.0;
        float allValue = 1.0;
        float anyValue = 0.0;

        for (int i = 0; i < ${c}; i += 4) {
          int inIdx = inOffset + i;
          ${f} values = ${f}(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            getValue(batch, inIdx + 3)
          );

          ${m}
        }

        int inIdx = inOffset + ${c};
        if (${p===1}) {
          ${f} values = ${f}(
            getValue(batch, inIdx),
            initializationValue,
            initializationValue,
            initializationValue
          );

          ${m}
        } else if (${p===2}) {
          ${f} values = ${f}(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            initializationValue,
            initializationValue
          );

          ${m}
        } else if (${p===3}) {
          ${f} values = ${f}(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            initializationValue
          );

          ${m}
        }
        setOutput(${l});
      }
    `}};function TL(r){let e=[];for(;e.length===0||e[e.length-1].outSize!==1;){let t=e.length?e[e.length-1].outSize:r[1],o=I.computeOptimalWindowSize(t);e.push({inSize:t,windowSize:o,outSize:Math.ceil(t/o)})}return e}function Lt(r,e,t,o){let n=TL(r.shape),s=r;for(let i=0;i<n.length;i++){let{inSize:a,windowSize:u,outSize:l}=n[i],c,p;t==="mean"?c=i===0?new yi({windowSize:u,inSize:a,batchSize:r.shape[0],outSize:l},a):new yi({windowSize:u,inSize:a,batchSize:r.shape[0],outSize:l}):c=new Mc({windowSize:u,inSize:a,batchSize:r.shape[0],outSize:l},t),p=s,s=o.runWebGLProgram(c,[s],e),p.dataId!==r.dataId&&o.disposeIntermediateTensorInfo(p)}return s}var Vc=class{constructor(e,t){this.variableNames=["A"];let o=new Array(e.length);for(let i=0;i<o.length;i++)o[i]=e[t[i]];this.outputShape=o,this.rank=o.length;let n=J(this.rank),s=SL(t);this.userCode=`
    void main() {
      ${n} resRC = getOutputCoords();
      setOutput(getA(${s}));
    }
    `}};function SL(r){let e=r.length;if(e>6)throw Error(`Transpose for rank ${e} is not yet supported`);let t=["resRC.x","resRC.y","resRC.z","resRC.w","resRC.u","resRC.v"],o=new Array(e);for(let n=0;n<r.length;n++)o[r[n]]=t[n];return o.join()}var Uc=class{constructor(e,t){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0;let o=new Array(e.length);for(let c=0;c<o.length;c++)o[c]=e[t[c]];if(this.outputShape=o,this.rank=o.length,this.rank>6)throw Error(`Packed transpose for rank ${this.rank} is not yet supported.`);let n=J(this.rank),s=qd("rc",this.rank),i=new Array(this.rank);for(let c=0;c<t.length;c++)i[t[c]]=s[c];let a=`vec2(${i.slice(-2).join()})`,u=`++${s[this.rank-1]} < ${o[this.rank-1]}`,l=`getChannel(getA(${i.join()}), ${a})`;this.userCode=`
    void main() {
      ${n} rc = getOutputCoords();
      vec4 result = vec4(0.);
      result[0] = ${l};
      if(${u}) {
        result[1] = ${l};
      }
      --${s[this.rank-1]};
      if(++${s[this.rank-2]} < ${o[this.rank-2]}) {
        result[2] = ${l};
        if(${u}) {
          result[3] = ${l};
        }
      }
      setOutput(result);
    }
    `}};function ho(r,e,t){let o=$().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new Uc(r.shape,e):new Vc(r.shape,e);return t.runWebGLProgram(o,[r],r.dtype)}function uS(r,e,t,o){let n=e,s=r.shape.length,i=T.parseAxisParam(n,r.shape),a=i,u=I.getAxesPermutation(a,s),l=u!=null,c=r;l&&(c=ho(r,u,o),a=I.getInnerMostAxes(a.length,s)),I.assertAxesAreInnerMostDims("sum",a,s);let[p,m]=I.computeOutAndReduceShapes(c.shape,a),f=p;t&&(f=I.expandShapeToKeepDim(p,i));let d=T.sizeFromShape(m),h=T.sizeFromShape(r.shape)/d,x=L({inputs:{x:c},attrs:{shape:[h,d]},backend:o}),v=Ro(r.dtype),N=Lt(x,v,"sum",o),E=L({inputs:{x:N},attrs:{shape:f},backend:o});return o.disposeIntermediateTensorInfo(x),o.disposeIntermediateTensorInfo(N),l&&o.disposeIntermediateTensorInfo(c),E}function tn(r){let{inputs:e,backend:t,attrs:o}=r,{x:n}=e,{axis:s,keepDims:i}=o;return uS(n,s,i,t)}var lS={kernelName:"Sum",backendName:"webgl",kernelFunc:tn};function Se(r){let{inputs:e,backend:t,attrs:o}=r,{x:n}=e,{perm:s}=o,i=t,a=n.shape.length,u=new Array(a);for(let c=0;c<u.length;c++)u[c]=n.shape[s[c]];let l;if(i.shouldExecuteOnCPU([n])){let p=i.texData.get(n.dataId).values,m=en(p,n.shape,n.dtype,s,u);l=i.makeTensorInfo(u,n.dtype);let f=i.texData.get(l.dataId);f.values=m}else l=ho(n,s,i);return l}var cS={kernelName:On,backendName:"webgl",kernelFunc:Se};var eh=1e3;function rn({a:r,b:e,transposeA:t,transposeB:o,backend:n,bias:s=null,preluActivationWeights:i=null,leakyreluAlpha:a=0,activation:u=null}){let l=r.shape.length,c=e.shape.length,p=t?r.shape[l-2]:r.shape[l-1],m=o?e.shape[c-1]:e.shape[c-2],f=t?r.shape[l-1]:r.shape[l-2],d=o?e.shape[c-2]:e.shape[c-1],g=r.shape.slice(0,-2),h=e.shape.slice(0,-2),x=T.sizeFromShape(g),v=T.sizeFromShape(h),E=eo.assertAndGetBroadcastShape(r.shape.slice(0,-2),e.shape.slice(0,-2)).concat([f,d]);T.assert(p===m,()=>`Error in matMul: inner shapes (${p}) and (${m}) of Tensors with shapes ${r.shape} and ${e.shape} and transposeA=${t} and transposeB=${o} must match.`);let k=t?[x,p,f]:[x,f,p],R=o?[v,d,m]:[v,m,d],A=L({inputs:{x:r},backend:n,attrs:{shape:k}}),_=L({inputs:{x:e},backend:n,attrs:{shape:R}}),O=[A,_],F=Math.max(x,v),B=t?A.shape[1]:A.shape[2],M=s!=null,z=i!=null,j=u==="leakyrelu",Z=u!=null?Mr(u,!0):null,ie=M||z||j||Z!=null,fe;if((f===1||d===1)&&B>eh&&ie===!1){let Oe=A,Zt=_;t&&(Oe=Se({inputs:{x:A},backend:n,attrs:{perm:[0,2,1]}}),O.push(Oe)),o&&(Zt=Se({inputs:{x:_},backend:n,attrs:{perm:[0,2,1]}}),O.push(Zt));let Jt=d!==1,Si=d===1,cm=Oe;Jt&&(cm=L({inputs:{x:Oe},backend:n,attrs:{shape:[F,B,1]}}),O.push(cm));let KE=d===1?2:1,pm=Zt;Si&&(pm=L({inputs:{x:Zt},backend:n,attrs:{shape:[F,1,B]}}),O.push(pm));let wh=xi({inputs:{a:cm,b:pm},backend:n});fe=tn({inputs:{x:wh},backend:n,attrs:{axis:KE,keepDims:!0}}),O.push(wh)}else{let Oe=Qe(r.dtype,e.dtype),Zt=new xs(k,R,[F,f,d],t,o,M,Z,z,j),Jt=[A,_];if(s!=null&&Jt.push(s),z&&Jt.push(i),j){let Si=n.makeTensorInfo([],"float32",T.createScalarValue(a,"float32"));Jt.push(Si),O.push(Si)}fe=n.runWebGLProgram(Zt,Jt,Oe)}let be=L({inputs:{x:fe},backend:n,attrs:{shape:E}});O.push(fe);for(let Oe of O)n.disposeIntermediateTensorInfo(Oe);return be}function CL(r){let{inputs:e,backend:t,attrs:o}=r,{a:n,b:s,bias:i,preluActivationWeights:a}=e,{transposeA:u,transposeB:l,activation:c,leakyreluAlpha:p}=o;return rn({a:n,b:s,transposeA:u,transposeB:l,backend:t,bias:i,preluActivationWeights:a,leakyreluAlpha:p,activation:c})}var pS={kernelName:Ds,backendName:"webgl",kernelFunc:CL};var mS="return abs(x);";function NL(r){let{inputs:e,backend:t}=r,{x:o}=e;if(t.shouldExecuteOnCPU([o])&&o.dtype!=="complex64"){let s=t.texData.get(o.dataId),i=Dc(s.values);return t.makeTensorInfo(o.shape,o.dtype,i)}let n;return $().getBool("WEBGL_PACK_UNARY_OPERATIONS")?n=new vt(o.shape,mS):n=new He(o.shape,mS),t.runWebGLProgram(n,[o],o.dtype)}var fS={kernelName:"Abs",backendName:"webgl",kernelFunc:NL};var EL=Le+`
  if (abs(x) > 1.) {
    return NAN;
  }
  return acos(x);
`,IL=W({opSnippet:EL}),dS={kernelName:Ii,backendName:"webgl",kernelFunc:IL};var kL=Le+`
  if (x < 1.0) return NAN;
return log(x + sqrt(x * x - 1.0));`,$L=W({opSnippet:kL}),hS={kernelName:ki,backendName:"webgl",kernelFunc:$L};var gS="return a + b;",RL=me({opSnippet:gS,packedOpSnippet:gS,supportsComplex:!0,cpuKernelImpl:X1}),xS={kernelName:"Add",backendName:"webgl",kernelFunc:RL};var Gc=class{constructor(e,t){this.outputShape=[],this.outputShape=e,this.variableNames=t.map((s,i)=>`T${i}`);let o=[];this.variableNames.forEach(s=>{o.push(`float v${s} = get${s}AtOutCoords();`)});let n=this.variableNames.map(s=>`v${s}`).join(" + ");this.userCode=`
      void main() {
        ${o.join(`
        `)}

        float result = ${n};
        setOutput(result);
      }
    `}};var zc=class{constructor(e,t){this.outputShape=[],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=e,this.variableNames=t.map((s,i)=>`T${i}`);let o=[];this.variableNames.forEach(s=>{o.push(`vec4 v${s} = get${s}AtOutCoords();`)});let n=this.variableNames.map(s=>`v${s}`).join(" + ");this.userCode=`
      void main() {
        ${o.join(`
        `)}

        vec4 result = ${n};
        setOutput(result);
      }
    `}};function Wc(r){let{inputs:e,backend:t}=r,o=e;if(o.length===1)return _e({inputs:{x:o[0]},backend:t});if(o.length>$().getNumber("WEBGL_MAX_TEXTURES_IN_SHADER")){let u=Math.floor(o.length/2),l=Wc({inputs:o.slice(0,u),backend:t}),c=Wc({inputs:o.slice(u),backend:t});return Wc({inputs:[l,c],backend:t})}let n=o.map(u=>u.dtype).reduce((u,l)=>Qe(u,l)),s=o.map(u=>u.shape),a=$().getBool("WEBGL_PACK")?new zc(o[0].shape,s):new Gc(o[0].shape,s);return t.runWebGLProgram(a,o,n)}var yS={kernelName:$i,backendName:"webgl",kernelFunc:Wc};function AL(r){let{inputs:e,backend:t,attrs:o}=r,{x:n}=e,{axis:s,keepDims:i}=o,a=n.shape.length,u=T.parseAxisParam(s,n.shape),l=u,c=I.getAxesPermutation(l,a),p=n;c!=null&&(p=Se({inputs:{x:n},backend:t,attrs:{perm:c}}),l=I.getInnerMostAxes(l.length,a)),I.assertAxesAreInnerMostDims("all",l,a);let[m,f]=I.computeOutAndReduceShapes(p.shape,l),d=T.sizeFromShape(f),g=L({inputs:{x:p},backend:t,attrs:{shape:[-1,d]}}),h=Lt(g,g.dtype,"all",t),x;if(i){let v=I.expandShapeToKeepDim(m,u);x=L({inputs:{x:h},backend:t,attrs:{shape:v}})}else x=L({inputs:{x:h},backend:t,attrs:{shape:m}});return t.disposeIntermediateTensorInfo(g),t.disposeIntermediateTensorInfo(h),c!=null&&t.disposeIntermediateTensorInfo(p),x}var bS={kernelName:"All",backendName:"webgl",kernelFunc:AL};function _L(r){let{inputs:e,backend:t,attrs:o}=r,{x:n}=e,{axis:s,keepDims:i}=o,a=n.shape.length,u=T.parseAxisParam(s,n.shape),l=u,c=I.getAxesPermutation(l,a),p=n;c!=null&&(p=Se({inputs:{x:n},backend:t,attrs:{perm:c}}),l=I.getInnerMostAxes(l.length,a)),I.assertAxesAreInnerMostDims("any",l,a);let[m,f]=I.computeOutAndReduceShapes(p.shape,l),d=T.sizeFromShape(f),g=L({inputs:{x:p},backend:t,attrs:{shape:[-1,d]}}),h=Lt(g,g.dtype,"any",t),x;if(i){let v=I.expandShapeToKeepDim(m,u);x=L({inputs:{x:h},backend:t,attrs:{shape:v}})}else x=L({inputs:{x:h},backend:t,attrs:{shape:m}});return t.disposeIntermediateTensorInfo(g),t.disposeIntermediateTensorInfo(h),c!=null&&t.disposeIntermediateTensorInfo(p),x}var wS={kernelName:"Any",backendName:"webgl",kernelFunc:_L};var Hc=class{constructor(e,t,o){this.variableNames=["A"];let{windowSize:n,batchSize:s,outSize:i}=e;o||this.variableNames.push("bestIndicesA"),this.outputShape=[s,i];let a=t==="max"?">":"<",u=o?"inOffset + i;":"round(getBestIndicesA(batch, inOffset + i));";this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = outIdx * ${n};

        int bestIndex = inOffset;
        float bestValue = getA(batch, bestIndex);

        for (int i = 0; i < ${n}; i++) {
          int inIdx = ${u};
          float candidate = getA(batch, inIdx);
          if (candidate ${a} bestValue) {
            bestValue = candidate;
            bestIndex = inIdx;
          }
        }
        setOutput(float(bestIndex));
      }
    `}};var Kc=class{constructor(e,t,o,n){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,T.assert(e.length>2,()=>`Packed arg${o.charAt(0).toUpperCase()+o.slice(1)} supports only inputs with rank above 2.`);let s=e[e.length-1],i=Math.ceil(s/t);this.outputShape=e.slice(0,-1),i>1&&this.outputShape.push(i),n||this.variableNames.push("bestIndicesA");let a=this.outputShape,u=a.length,l=J(u),c=Ae("coords",u),p,m;if(i===1){m=u+1;let _=J(m);p=`
        ${_} sourceLocR = ${_}(${c.join()}, 0);
        ++${c[u-1]};
        ${_} sourceLocG = ${_}(${c.join()}, 0);
        ++${c[u-2]};
        ${_} sourceLocA = ${_}(${c.join()}, 0);
        --${c[u-1]};
        ${_} sourceLocB = ${_}(${c.join()}, 0);
        --${c[u-2]};`}else m=u,p=`
        ${l} sourceLocR = coords;
        ++${c[u-1]};
        ${l} sourceLocG = coords;
        ++${c[u-2]};
        ${l} sourceLocA = coords;
        --${c[u-1]};
        ${l} sourceLocB = coords;
        --${c[u-2]};`;let f=["x","y","z","w","u","v"].slice(0,m),d="."+f[m-1],g=f.map(_=>"int "+_),h=Ae("sourceLocR",m-1).concat("inIdx.r"),x=Ae("sourceLocG",m-1).concat("inIdx.g"),v=Ae("sourceLocB",m-1).concat("inIdx.b"),N=Ae("sourceLocA",m-1).concat("inIdx.a"),E=o==="max"?"greaterThan":"lessThan",k=n?"":`
          inIdx = round(vec4(getBestIndicesAChannel(${h.join()}),
                             getBestIndicesAChannel(${x.join()}),
                             getBestIndicesAChannel(${v.join()}),
                             getBestIndicesAChannel(${N.join()})));`,R=`vec4(
            getAChannel(${h.join()}),
            hasNextCol ? getAChannel(${x.join()}) : 0.,
            hasNextRow ? getAChannel(${v.join()}) : 0.,
            hasNextRow && hasNextCol ? getAChannel(${N.join()}) : 0.)`,A=n?"":`
      float getBestIndicesAChannel(${g.join()}) {
        return getChannel(getBestIndicesA(${f.join()}),
                                          vec2(${f.slice(-2).join()}));
      }`;this.userCode=`
      float getAChannel(${g.join()}) {
        return getChannel(getA(${f.join()}),
                               vec2(${f.slice(-2).join()}));
      }
      ${A}
      void main() {
        ${l} coords = getOutputCoords();
        bool hasNextCol = ${c[u-1]} < ${a[u-1]-1};
        bool hasNextRow = ${c[u-2]} < ${a[u-2]-1};
        ${p}
        ivec4 srcIdx = ivec4(sourceLocR${d}, sourceLocG${d},
          sourceLocB${d}, sourceLocA${d}) * ${t};
        ivec4 inIdx = srcIdx;
        vec4 bestIndex = vec4(inIdx);
        vec4 bestValue = ${R};

        for (int i = 0; i < ${t}; i++) {
          inIdx = srcIdx;
          ${k}
          vec4 candidate = ${R};
          bvec4 nan = isnan(candidate);
          bvec4 replace = bvec4(
            vec4(${E}(candidate, bestValue)) * (vec4(1.0) - vec4(nan)));

          bestValue = vec4(replace.x  ? candidate.x : bestValue.x,
                           replace.y  ? candidate.y : bestValue.y,
                           replace.z  ? candidate.z : bestValue.z,
                           replace.w  ? candidate.w : bestValue.w);
          bestIndex = mix(bestIndex, vec4(inIdx), vec4(replace));
          srcIdx++;
        }
        setOutput(bestIndex);
      }
    `}};function vS(r,e,t,o=null){let n=e.shape[0],s=e.shape[1];o!=null&&(n=o.shape[0],s=o.shape[1]);let i=I.computeOptimalWindowSize(s),a={windowSize:i,inSize:s,batchSize:n,outSize:Math.ceil(s/i)},u=new Hc(a,t,o==null),l=[e];o!=null&&l.push(o);let c=r.runWebGLProgram(u,l,"int32");if(c.shape[1]===1)return c;let p=vS(r,e,t,c);return r.disposeIntermediateTensorInfo(c),p}function TS(r,e,t,o=null){let n=o!=null?o.shape:e.shape,s=n[n.length-1],i=I.computeOptimalWindowSize(s),a=new Kc(n,i,t,o==null),u=o==null?[e]:[e,o],l=r.runWebGLProgram(a,u,"int32");if(l.shape.length===e.shape.length){let c=TS(r,e,t,l);return r.disposeIntermediateTensorInfo(l),c}return l}function qc(r,e,t,o){let n=[t];if(I.assertAxesAreInnerMostDims("arg"+o.charAt(0).toUpperCase()+o.slice(1),n,e.shape.length),!$().getBool("WEBGL_PACK_REDUCE")||e.shape.length<=2){let s=[],i=r.texData.get(e.dataId),a=i!==null&&i.isPacked,u=e;a&&(u=r.unpackTensor(e),s.push(u));let[l,c]=I.computeOutAndReduceShapes(u.shape,n),p=T.sizeFromShape(c),m=L({inputs:{x:u},backend:r,attrs:{shape:[-1,p]}});s.push(m);let f=vS(r,m,o);s.push(f);let d=L({inputs:{x:f},backend:r,attrs:{shape:l}});return s.forEach(g=>r.disposeIntermediateTensorInfo(g)),d}return TS(r,e,o)}function DL(r){let{inputs:e,backend:t,attrs:o}=r,{x:n}=e,{axis:s}=o,i=T.parseAxisParam(s,n.shape),a=I.getAxesPermutation(i,n.shape.length),u=n,l=[];a!=null&&(u=Se({inputs:{x:n},backend:t,attrs:{perm:a}}),l.push(u),i=I.getInnerMostAxes(i.length,u.shape.length)),I.assertAxesAreInnerMostDims("argMax",[i[0]],u.shape.length);let c=qc(t,u,i[0],"max");return l.forEach(p=>t.disposeIntermediateTensorInfo(p)),c}var SS={kernelName:Ri,backendName:"webgl",kernelFunc:DL};function OL(r){let{inputs:e,backend:t,attrs:o}=r,{x:n}=e,{axis:s}=o,i=T.parseAxisParam(s,n.shape),a=I.getAxesPermutation(i,n.shape.length),u=n,l=[];a!=null&&(u=Se({inputs:{x:n},backend:t,attrs:{perm:a}}),l.push(u),i=I.getInnerMostAxes(i.length,u.shape.length)),I.assertAxesAreInnerMostDims("argMin",[i[0]],u.shape.length);let c=qc(t,u,i[0],"min");return l.forEach(p=>t.disposeIntermediateTensorInfo(p)),c}var CS={kernelName:Ai,backendName:"webgl",kernelFunc:OL};var FL=Le+`
  if (abs(x) > 1.) {
    return NAN;
  }
  return asin(x);
`,PL=W({opSnippet:FL}),NS={kernelName:_i,backendName:"webgl",kernelFunc:PL};var LL=Le+"return log(x + sqrt(x * x + 1.0));",BL=W({opSnippet:LL}),ES={kernelName:Di,backendName:"webgl",kernelFunc:BL};var ML=Le+`
  return atan(x);
`,VL=W({opSnippet:ML}),IS={kernelName:Oi,backendName:"webgl",kernelFunc:VL};var UL=gs+`
  return atan(a, b);
`,GL=`
  vec4 result = atan(a, b);
  bvec4 isNaNA = isnan(a);
  bvec4 isNaNB = isnan(b);
  bvec4 isNaN = bvec4(isNaNA.x || isNaNB.x, isNaNA.y || isNaNB.y, isNaNA.z || isNaNB.z, isNaNA.w || isNaNB.w);
  `+Pt+`
  return result;
`,zL=me({opSnippet:UL,packedOpSnippet:GL}),kS={kernelName:Pi,backendName:"webgl",kernelFunc:zL};var WL=Le+`
  if ((x < -1.0) || (x > 1.0)) return NAN;
return (log(1.0 + x) - log(1.0 - x)) / 2.0;`,HL=W({opSnippet:WL}),$S={kernelName:Fi,backendName:"webgl",kernelFunc:HL};var ir=class{constructor(e,t,o,n=!1,s=!1){if(this.variableNames=["x"],t==="avg"&&o)throw new Error("Cannot compute positions for average pool.");let i=e.filterWidth,a=e.strideHeight,u=e.strideWidth,l=e.dilationHeight,c=e.dilationWidth,p=e.effectiveFilterHeight,m=e.effectiveFilterWidth,f=e.padInfo.top,d=e.padInfo.left;this.outputShape=e.outShape;let g=t==="avg",h=`((batch  * ${e.inHeight} + xR) * ${e.inWidth} + xC) * ${e.inChannels} + d`,x=`(xR * ${e.inWidth} + xC) * ${e.inChannels} + d`,v="0.0";if(g||(v="-1.0 / 1e-20"),o){this.userCode=`
        const ivec2 strides = ivec2(${a}, ${u});
        const ivec2 pads = ivec2(${f}, ${d});

        void main() {
          ivec4 coords = getOutputCoords();
          int batch = coords[0];
          int d = coords[3];

          ivec2 xRCCorner = coords.yz * strides - pads;
          int xRCorner = xRCCorner.x;
          int xCCorner = xRCCorner.y;

          // max/min x(?, ?, d) to get y(yR, yC, d).
          // ? = to be determined
          float minMaxValue = 0.0;
          float minMaxValueFound = 0.0;
          int minMaxPosition = 0;
          float avgValue = 0.0;

          for (int wR = 0; wR < ${p};
              wR += ${l}) {
            int xR = xRCorner + wR;

            if (xR < 0 || xR >= ${e.inHeight}) {
              continue;
            }

            for (int wC = 0; wC < ${m};
                wC += ${c}) {
              int xC = xCCorner + wC;

              if (xC < 0 || xC >= ${e.inWidth}) {
                continue;
              }

              float value = getX(batch, xR, xC, d);

              // If a min / max value has already been found, use it. If not,
              // use the current value.
              float currMinMaxValue = mix(
                  value, minMaxValue, minMaxValueFound);
              if (value >= currMinMaxValue) {
                minMaxValue = value;
                minMaxValueFound = 1.0;
                minMaxPosition = ${n?s?h:x:`wR * ${m} + wC`};
              }
            }
          }
          setOutput(float(minMaxPosition));
        }
      `;return}let N="max",E=`${t}(${t}(${t}(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])`;t==="avg"&&(E="avgValue / max(count, 1.0)");let k=Math.floor(i/4)*4,R=i%4,A=`
      if (${g}) {
        avgValue += dot(values, ones);
      } else {
        minMaxValue = ${N}(values, minMaxValue);
      }
    `;this.userCode=`
      const ivec2 strides = ivec2(${a}, ${u});
      const ivec2 pads = ivec2(${f}, ${d});
      const float initializationValue = ${v};
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float count = 0.0;

      float getValue(int batch, int xR, int xC, int d) {
        if (xC < 0 || xC >= ${e.inWidth}) {
          return initializationValue;
        }
        count += 1.0;
        return getX(batch, xR, xC, d);
      }

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d = coords[3];

        ivec2 xRCCorner = coords.yz * strides - pads;
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        // max/min x(?, ?, d) to get y(yR, yC, d).
        // ? = to be determined
        vec4 minMaxValue = vec4(${v});
        float avgValue = 0.0;
        count = 0.0;

        for (int wR = 0; wR < ${p};
            wR += ${l}) {
          int xR = xRCorner + wR;

          if (xR < 0 || xR >= ${e.inHeight}) {
            continue;
          }

          for (int wC = 0; wC < ${k}; wC += 4) {
            int xC = xCCorner + wC * ${c};

            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              getValue(batch, xR, xC + ${c}, d),
              getValue(batch, xR, xC + 2 * ${c}, d),
              getValue(batch, xR, xC + 3 * ${c}, d)
            );

            ${A}
          }

          int xC = xCCorner + ${k};
          if (${R===1}) {
            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              initializationValue,
              initializationValue,
              initializationValue
            );

            ${A}
          } else if (${R===2}) {
            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              getValue(batch, xR, xC + ${c}, d),
              initializationValue,
              initializationValue
            );

            ${A}
          } else if (${R===3}) {
            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              getValue(batch, xR, xC + ${c}, d),
              getValue(batch, xR, xC + 2 * ${c}, d),
              initializationValue
            );

            ${A}
          }
        }
        setOutput(${E});
      }
    `}},go=class{constructor(e,t,o,n=!1,s=!1){if(this.variableNames=["x"],t==="avg"&&o)throw new Error("Cannot compute positions for average pool.");let i=e.filterWidth,a=e.strideDepth,u=e.strideHeight,l=e.strideWidth,c=e.dilationDepth,p=e.dilationHeight,m=e.dilationWidth,f=e.effectiveFilterDepth,d=e.effectiveFilterHeight,g=e.effectiveFilterWidth,h=e.padInfo.front,x=e.padInfo.top,v=e.padInfo.left;this.outputShape=e.outShape;let N=t==="avg",E="0.0";if(N||(E="-1.0 / 1e-20"),o){this.userCode=`
        const ivec3 strides =
            ivec3(${a}, ${u}, ${l});
        const ivec3 pads = ivec3(${h}, ${x}, ${v});

        void main() {
          ivec5 coords = getOutputCoords();
          int batch = coords.x;
          int ch = coords.u;

          ivec3 xCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;
          int xDCorner = xCorner.x;
          int xRCorner = xCorner.y;
          int xCCorner = xCorner.z;

          // max/min x(?, ?, ?, ch) to get y(yD, yR, yC, ch).
          // ? = to be determined
          float minMaxValue = 0.0;
          float minMaxValueFound = 0.0;
          int minMaxPosition = 0;

          for (int wD = 0; wD < ${f};
              wD += ${c}) {
            int xD = xDCorner + wD;

            if (xD < 0 || xD >= ${e.inDepth}) {
              continue;
            }

            for (int wR = 0; wR < ${d};
                wR += ${p}) {
              int xR = xRCorner + wR;

              if (xR < 0 || xR >= ${e.inHeight}) {
                continue;
              }

              for (int wC = 0; wC < ${g};
                  wC += ${m}) {
                int xC = xCCorner + wC;

                if (xC < 0 || xC >= ${e.inWidth}) {
                  continue;
                }

                float value = getX(batch, xD, xR, xC, ch);

                // If a min / max value has already been found, use it. If not,
                // use the current value.
                float currMinMaxValue = mix(
                    value, minMaxValue, minMaxValueFound);
                if (value >= currMinMaxValue) {
                  minMaxValue = value;
                  minMaxValueFound = 1.0;
                  minMaxPosition = ${n?s?`(((batch * ${e.inDepth} + xD) * ${e.inHeight} + xR) * ${e.inWidth} + xC) * ${e.inChannels} + ch`:`((xD * ${e.inHeight} + xR) * ${e.inWidth} + xC) * ${e.inChannels} + ch`:`wD * ${d} * ${g} +
                      wR * ${g} + wC`};
                }
              }
            }
          }
          setOutput(float(minMaxPosition));
        }
      `;return}let k="max",R=`${t}(${t}(${t}(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])`;t==="avg"&&(R="avgValue / max(count, 1.0)");let A=Math.floor(i/4)*4,_=i%4,O=`
      if (${N}) {
        avgValue += dot(values, ones);
      } else {
        minMaxValue = ${k}(values, minMaxValue);
      }
    `;this.userCode=`
      const ivec3 strides =
        ivec3(${a}, ${u}, ${l});
      const ivec3 pads = ivec3(${h}, ${x}, ${v});
      const float initializationValue = ${E};
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float count = 0.0;

      float getValue(int batch, int xD, int xR, int xC, int ch) {
        if (xC < 0 || xC >= ${e.inWidth}) {
          return initializationValue;
        }
        count += 1.0;
        return getX(batch, xD, xR, xC, ch);
      }

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int ch = coords.u;

        ivec3 xCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;
        int xDCorner = xCorner.x;
        int xRCorner = xCorner.y;
        int xCCorner = xCorner.z;

        // max/min x(?, ?, ?, d) to get y(yD, yR, yC, ch).
        // ? = to be determined
        vec4 minMaxValue = vec4(${E});
        float avgValue = 0.0;
        count = 0.0;

        for (int wD = 0; wD < ${f};
            wD += ${c}) {
          int xD = xDCorner + wD;

          if (xD < 0 || xD >= ${e.inDepth}) {
            continue;
          }

          for (int wR = 0; wR < ${d};
            wR += ${p}) {
            int xR = xRCorner + wR;

            if (xR < 0 || xR >= ${e.inHeight}) {
              continue;
            }

            for (int wC = 0; wC < ${A}; wC += 4) {
              int xC = xCCorner + wC * ${m};

              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                getValue(batch, xD, xR, xC + ${m}, ch),
                getValue(batch, xD, xR, xC + 2 * ${m}, ch),
                getValue(batch, xD, xR, xC + 3 * ${m}, ch)
              );

              ${O}
            }

            int xC = xCCorner + ${A};
            if (${_===1}) {
              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                initializationValue,
                initializationValue,
                initializationValue
              );

              ${O}
            } else if (${_===2}) {
              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                getValue(batch, xD, xR, xC + ${m}, ch),
                initializationValue,
                initializationValue
              );

              ${O}
            } else if (${_===3}) {
              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                getValue(batch, xD, xR, xC + ${m}, ch),
                getValue(batch, xD, xR, xC + 2 * ${m}, ch),
                initializationValue
              );

              ${O}
            }
          }
        }
        setOutput(${R});
      }
    `}};function KL(r){let{inputs:e,backend:t,attrs:o}=r,{x:n}=e;Sr(n,"avgPool");let{filterSize:s,strides:i,pad:a,dimRoundingMode:u}=o,l=1;T.assert(I.eitherStridesOrDilationsAreOne(i,l),()=>`Error in avgPool: Either strides or dilations must be 1. Got strides ${i} and dilations '${l}'`);let c=I.computePool2DInfo(n.shape,s,i,l,a,u);if(c.filterWidth===1&&c.filterHeight===1&&T.arraysEqual(c.inShape,c.outShape))return _e({inputs:{x:n},backend:t});let p=new ir(c,"avg",!1);return t.runWebGLProgram(p,[n],"float32")}var RS={kernelName:Li,backendName:"webgl",kernelFunc:KL};function qL(r){let{inputs:e,backend:t,attrs:o}=r,{x:n}=e,{filterSize:s,strides:i,pad:a,dimRoundingMode:u,dataFormat:l}=o,c=[1,1,1],p=I.computePool3DInfo(n.shape,s,i,c,a,u,l),m=new go(p,"avg",!1);return t.runWebGLProgram(m,[n],"float32")}var AS={kernelName:Bi,backendName:"webgl",kernelFunc:qL};var Xc=class{constructor(e){this.variableNames=["dy"],this.outputShape=e.inShape;let t=e.filterHeight,o=e.filterWidth,n=e.strideHeight,s=e.strideWidth,i=e.dilationHeight,a=e.dilationWidth,u=e.effectiveFilterHeight,l=e.effectiveFilterWidth,c=u-1-e.padInfo.top,p=l-1-e.padInfo.left,m=1/(t*o);this.userCode=`
      const ivec2 pads = ivec2(${c}, ${p});
      const float avgMultiplier = float(${m});

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];

        ivec2 dyRCCorner = coords.yz - pads;
        int dyRCorner = dyRCCorner.x;
        int dyCCorner = dyRCCorner.y;

        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${u};
            wR += ${i}) {
          float dyR = float(dyRCorner + wR) / ${n}.0;

          if (dyR < 0.0 || dyR >= ${e.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          for (int wC = 0; wC < ${l};
            wC+= ${a}) {
            float dyC = float(dyCCorner + wC) / ${s}.0;

            if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            float dyValue = getDy(b, idyR, idyC, d);

            dotProd += dyValue * avgMultiplier;
          }
        }
        setOutput(dotProd);
      }
    `}},jc=class{constructor(e){this.variableNames=["dy"],this.outputShape=e.inShape;let t=e.filterDepth,o=e.filterHeight,n=e.filterWidth,s=e.strideDepth,i=e.strideHeight,a=e.strideWidth,u=e.dilationDepth,l=e.dilationHeight,c=e.dilationWidth,p=e.effectiveFilterDepth,m=e.effectiveFilterHeight,f=e.effectiveFilterWidth,d=p-1-e.padInfo.front,g=m-1-e.padInfo.top,h=f-1-e.padInfo.left,x=1/(t*o*n);this.userCode=`
      const ivec3 pads = ivec3(${d}, ${g}, ${h});
      const float avgMultiplier = float(${x});

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int ch = coords.u;

        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;
        int dyDCorner = dyCorner.x;
        int dyRCorner = dyCorner.y;
        int dyCCorner = dyCorner.z;

        // Convolve dy(?, ?, ?, d) with pos mask(:, :, :, ch) to get
        // dx(xD, xR, xC, ch).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;

        for (int wD = 0; wD < ${p};
            wD += ${u}) {
          float dyD = float(dyDCorner + wD) / ${s}.0;

          if (dyD < 0.0 || dyD >= ${e.outDepth}.0 || fract(dyD) > 0.0) {
            continue;
          }
          int idyD = int(dyD);

          for (int wR = 0; wR < ${m};
              wR += ${l}) {
            float dyR = float(dyRCorner + wR) / ${i}.0;

            if (dyR < 0.0 || dyR >= ${e.outHeight}.0 ||
                fract(dyR) > 0.0) {
              continue;
            }
            int idyR = int(dyR);

            for (int wC = 0; wC < ${f};
                wC += ${c}) {
              float dyC = float(dyCCorner + wC) / ${a}.0;

              if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                  fract(dyC) > 0.0) {
                continue;
              }
              int idyC = int(dyC);

              float dyValue = getDy(batch, idyD, idyR, idyC, ch);

              dotProd += dyValue * avgMultiplier;
            }
          }
        }
        setOutput(dotProd);
      }
    `}};function XL(r){let{inputs:e,backend:t,attrs:o}=r,{dy:n,input:s}=e,i=s,{filterSize:a,strides:u,pad:l,dimRoundingMode:c}=o,p=[1,1,1],m=I.computePool3DInfo(i.shape,a,u,p,l,c),f=new jc(m);return t.runWebGLProgram(f,[n],i.dtype)}var _S={kernelName:Rh,backendName:"webgl",kernelFunc:XL};function jL(r){let{inputs:e,backend:t,attrs:o}=r,{dy:n,input:s}=e,i=s;Sr([n,s],"avgPoolGrad");let{filterSize:a,strides:u,pad:l}=o,c=I.computePool2DInfo(i.shape,a,u,1,l),p=new Xc(c);return t.runWebGLProgram(p,[n],i.dtype)}var DS={kernelName:$h,backendName:"webgl",kernelFunc:jL};function YL(r){let{inputs:e,backend:t,attrs:o}=r,{a:n,b:s}=e,{transposeA:i,transposeB:a}=o;return rn({a:n,b:s,transposeA:i,transposeB:a,backend:t})}var OS={kernelName:Mi,backendName:"webgl",kernelFunc:YL};var Yc=class{constructor(e,t,o,n,s,i){this.outputShape=[],this.variableNames=["x","mean","variance"],I.assertAndGetBroadcastShape(e,t),I.assertAndGetBroadcastShape(e,o);let a="0.0";n!=null&&(I.assertAndGetBroadcastShape(e,n),this.variableNames.push("offset"),a="getOffsetAtOutCoords()");let u="1.0";s!=null&&(I.assertAndGetBroadcastShape(e,s),this.variableNames.push("scale"),u="getScaleAtOutCoords()"),this.outputShape=e,this.userCode=`
      void main() {
        float x = getXAtOutCoords();
        float mean = getMeanAtOutCoords();
        float variance = getVarianceAtOutCoords();
        float offset = ${a};
        float scale = ${u};
        float inv = scale * inversesqrt(variance + float(${i}));
        setOutput(dot(vec3(x, -mean, offset), vec3(inv, inv, 1)));
      }
    `}};var Qc=class{constructor(e,t,o,n,s,i){this.packedInputs=!0,this.packedOutput=!0,this.variableNames=["x","mean","variance"],I.assertAndGetBroadcastShape(e,t),I.assertAndGetBroadcastShape(e,o);let a="vec4(0.0)";n!=null&&(I.assertAndGetBroadcastShape(e,n),this.variableNames.push("offset"),a="getOffsetAtOutCoords()");let u="vec4(1.0)";s!=null&&(I.assertAndGetBroadcastShape(e,s),this.variableNames.push("scale"),u="getScaleAtOutCoords()"),this.outputShape=e,this.userCode=`
      void main() {
        vec4 offset = ${a};
        vec4 scale = ${u};

        vec4 x = getXAtOutCoords();
        vec4 mean = getMeanAtOutCoords();
        vec4 variance = getVarianceAtOutCoords();

        vec4 inv = scale * inversesqrt(variance + vec4(${i}));

        setOutput((x - mean) * inv + offset);
      }
    `}};var QL=({inputs:r,backend:e,attrs:t})=>{let{x:o,mean:n,variance:s,offset:i,scale:a}=r;T.assert(n.shape.length===s.shape.length,()=>"Batch normalization gradient requires mean and variance to have equal ranks."),T.assert(i==null||n.shape.length===i.shape.length,()=>"Batch normalization gradient requires mean and offset to have equal ranks."),T.assert(a==null||n.shape.length===a.shape.length,()=>"Batch normalization gradient requires mean and scale to have equal ranks.");let{varianceEpsilon:u}=t;u==null&&(u=.001);let l=[o,n,s],c=null;i!=null&&(c=i.shape,l.push(i));let p=null;a!=null&&(p=a.shape,l.push(a));let m=$().getBool("WEBGL_PACK_NORMALIZATION")?new Qc(o.shape,n.shape,s.shape,c,p,u):new Yc(o.shape,n.shape,s.shape,c,p,u);return e.runWebGLProgram(m,l,l[0].dtype)},FS={kernelName:fa,backendName:"webgl",kernelFunc:QL};var Zc=class{constructor(e){this.variableNames=["source"],this.outputShape=e,this.rank=e.length;let t=J(this.rank);this.customUniforms=[{name:"start",arrayIndex:this.rank,type:"int"}];let o=ZL(this.rank),n,s=e.map((i,a)=>`sourceLoc.${th[a]} = start[${a}] + coords.${th[a]};`);n=`
        ${t} sourceLoc;
        ${t} coords = getOutputCoords();
        ${s.join(`
`)}
      `,this.userCode=`
      void main() {
        ${n}
        setOutput(getSource(${o}));
      }
    `}},th=["x","y","z","w","u","v"];function ZL(r){if(r===1)return"sourceLoc";if(r<=6)return th.slice(0,r).map(e=>"sourceLoc."+e).join(",");throw Error(`Slicing for rank ${r} is not yet supported`)}var Jc=class{constructor(e){this.variableNames=["source"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=e,this.rank=e.length,this.customUniforms=[{name:"start",arrayIndex:this.rank,type:"int"}];let t=J(this.rank),o=Ae("coords",this.rank),n=Ae("sourceLoc",this.rank),s=this.rank===1?"sourceLoc":`vec2(${n.slice(-2).join()})`,i=`getChannel(getSource(${n.join()}), ${s})`,a=`
      result.x = ${i};
      if (++${o[this.rank-1]} < ${e[this.rank-1]}) {
        ++${n[this.rank-1]};
        result.y = ${i};
        --${n[this.rank-1]};
      }
    `,u=this.rank===1?"":`
      --${o[this.rank-1]};
      if (++${o[this.rank-2]} < ${e[this.rank-2]}) {
        ++${n[this.rank-2]};
        result.z = ${i};
        if (++${o[this.rank-1]} < ${e[this.rank-1]}) {
          ++${n[this.rank-1]};
          result.w = ${i};
        }
      }
    `,l=this.rank<=4?`sourceLoc = coords +
            ${t}(${e.map((c,p)=>`start[${p}]`).join()});`:e.map((c,p)=>`${n[p]} = ${o[p]} + start[${p}];`).join(`
`);this.userCode=`
      void main() {
        ${t} coords = getOutputCoords();
        ${t} sourceLoc;
        ${l}
        vec4 result = vec4(0.);
        ${a}
        ${u}
        setOutput(result);
      }
    `}};function JL(r,e,t,o){let n=o.texData.get(r.dataId),s=o.makeTensorInfo(t,r.dtype),i=o.texData.get(s.dataId);Object.assign(i,n),i.refCount=1,i.shape=t,i.dtype=r.dtype;let a=yt.computeFlatOffset(e,T.computeStrides(r.shape));n.slice&&(a+=n.slice.flatOffset),i.slice={flatOffset:a,origDataId:n.slice&&n.slice.origDataId||r.dataId};let u=o.dataRefCount.get(i.slice.origDataId)||1;return o.dataRefCount.set(i.slice.origDataId,u+1),s}function ar(r){let{inputs:e,backend:t,attrs:o}=r,{x:n}=e,{begin:s,size:i}=o,[a,u]=yt.parseSliceParams(n,s,i);if(yt.assertParamsValid(n,a,u),T.sizeFromShape(u)===0)return t.makeTensorInfo(u,n.dtype,[]);if(t.shouldExecuteOnCPU([n])||n.dtype==="string"){let p=t.texData.get(n.dataId),m=ET(p.values,a,u,n.shape,n.dtype);return t.makeTensorInfo(u,n.dtype,m)}let{isPacked:l}=t.texData.get(n.dataId),c=yt.isSliceContinous(n.shape,a,u);if(l||!c){let p=$().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new Jc(u):new Zc(u),m=[a];return t.runWebGLProgram(p,[n],n.dtype,m)}return t.uploadToGPU(n.dataId),JL(n,a,u,t)}var PS={kernelName:As,backendName:"webgl",kernelFunc:ar};var e3=r=>{let{inputs:e,backend:t,attrs:o}=r,{x:n}=e,{blockShape:s,crops:i}=o;T.assert(n.shape.length<=4,()=>"batchToSpaceND for rank > 4 with a WebGL backend not implemented yet");let a=s.reduce((v,N)=>v*N),u=I.getReshaped(n.shape,s,a),l=I.getPermuted(u.length,s.length),c=I.getReshapedPermuted(n.shape,s,a),p=I.getSliceBeginCoords(i,s.length),m=I.getSliceSize(c,i,s.length),f=[],d=L({inputs:{x:n},backend:t,attrs:{shape:u}}),g=Se({inputs:{x:d},backend:t,attrs:{perm:l}}),h=L({inputs:{x:g},backend:t,attrs:{shape:c}}),x=ar({inputs:{x:h},backend:t,attrs:{begin:p,size:m}});return f.push(d),f.push(g),f.push(h),f.forEach(v=>t.disposeIntermediateTensorInfo(v)),x},LS={kernelName:Vi,backendName:"webgl",kernelFunc:e3};function t3(r){let{inputs:e,backend:t,attrs:o}=r,{x:n,weights:s}=e,{size:i}=o,a=t.readSync(n.dataId),u=t.readSync(s.dataId),l=_c(a,u,s.dtype,s.shape,i);return t.makeTensorInfo([i],s.dtype,l)}var BS={kernelName:Ui,backendName:"webgl",kernelFunc:t3};var r3=`
  int r = int(a.r) & int(b.r);
  int g = int(a.g) & int(b.g);
  int rb = int(a.b) & int(b.b);
  int ra = int(a.a) & int(b.a);
  return vec4(r, g, rb, ra);
`,o3=`
  return float(int(a.r) & int(b.r));
`;function n3(r){let{inputs:e,backend:t}=r,{a:o,b:n}=e,s=$().getBool("WEBGL_PACK_BINARY_OPERATIONS"),i=$().getNumber("WEBGL_VERSION");if(t.shouldExecuteOnCPU([o,n])||i===1){let u=t.texData.get(o.dataId).values,l=t.texData.get(n.dataId).values,[c,p]=Y1(o.shape,n.shape,u,l,o.dtype),m=t.makeTensorInfo(p,o.dtype),f=t.texData.get(m.dataId);return f.values=c,m}let a;return s?a=new Ft(r3,o.shape,n.shape,!1):a=new Tt(o3,o.shape,n.shape),t.runWebGLProgram(a,[o,n],o.dtype)}var MS={kernelName:dn,backendName:"webgl",kernelFunc:n3};function s3(r){let{inputs:e,backend:t}=r,{s0:o,s1:n}=e,s=t.readSync(o.dataId),i=t.readSync(n.dataId),a=I.assertAndGetBroadcastShape(Array.from(s),Array.from(i));return t.makeTensorInfo([a.length],"int32",Int32Array.from(a))}var VS={kernelName:Gi,backendName:"webgl",kernelFunc:s3};var i3="return float(a != b);",rh=me({opSnippet:i3,cpuKernelImpl:xT,dtype:"bool"}),US={kernelName:In,backendName:"webgl",kernelFunc:rh};function Vr(r){let{inputs:e,backend:t}=r,{input:o}=e,n=t.texData.get(o.dataId);return _e({inputs:{x:n.complexTensorInfos.real},backend:t})}var GS={kernelName:Rs,backendName:"webgl",kernelFunc:Vr};var a3="return float(int(x));";function zS(r,e){let t=new He(r.shape,a3),o=e.runWebGLProgram(t,[r],"int32");return{dataId:o.dataId,shape:o.shape,dtype:o.dtype}}function oh(r){let{inputs:e,backend:t,attrs:o}=r,{x:n}=e,{dtype:s}=o;if(s==="complex64"){if(n.dtype==="complex64")return _e({inputs:{x:n},backend:t});let i=At(n.shape),a=oh({inputs:{x:n},backend:t,attrs:{dtype:"float32"}}),u=St({inputs:{real:a,imag:i},backend:t});return i.dispose(),t.disposeIntermediateTensorInfo(a),u}if(n.dtype==="complex64"){let i=Vr({inputs:{input:n},backend:t}),a=oh({inputs:{x:i},backend:t,attrs:{dtype:s}});return t.disposeIntermediateTensorInfo(i),a}if(!T.hasEncodingLoss(n.dtype,s)){let i=_e({inputs:{x:n},backend:t});return{dataId:i.dataId,shape:i.shape,dtype:s}}if(t.shouldExecuteOnCPU([n])){let i=t.texData.get(n.dataId).values,[a,u,l]=Q1(i,n.shape,n.dtype,s);return t.makeTensorInfo(a,u,l)}if(s==="int32")return zS(n,t);if(s==="bool"){let i=t.makeTensorInfo([],"bool",T.getTypedArrayFromDType("bool",1)),u=rh({inputs:{a:n,b:i},backend:t});return t.disposeIntermediateTensorInfo(i),u}throw new Error(`Error in Cast: failed to cast ${n.dtype} to ${s}`)}var WS={kernelName:So,backendName:"webgl",kernelFunc:oh};var HS="return ceil(x);",u3=W({opSnippet:HS,packedOpSnippet:HS,cpuKernelImpl:Z1}),KS={kernelName:hn,backendName:"webgl",kernelFunc:u3};var ep=class{constructor(e){this.variableNames=["A"],this.customUniforms=[{name:"minVal",type:"float"},{name:"maxVal",type:"float"}],this.outputShape=e,this.userCode=`

      void main() {
        float value = getAAtOutCoords();
        if (isnan(value)) {
          setOutput(value);
          return;
        }

        setOutput(clamp(value, minVal, maxVal));
      }
    `}};var tp=class{constructor(e){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"minVal",type:"float"},{name:"maxVal",type:"float"}],this.outputShape=e,this.userCode=`
      void main() {
        vec4 value = getAAtOutCoords();

        if (any(isnan(value))) {
          setOutput(value);
          return;
        }

        setOutput(clamp(value, vec4(minVal), vec4(maxVal)));
      }
    `}};function l3(r){let{inputs:e,backend:t,attrs:o}=r,{x:n}=e,{clipValueMin:s,clipValueMax:i}=o,a;$().getBool("WEBGL_PACK_CLIP")?a=new tp(n.shape):a=new ep(n.shape);let u=[[s],[i]];return t.runWebGLProgram(a,[n],n.dtype,u)}var qS={kernelName:zi,backendName:"webgl",kernelFunc:l3};var rp=class{constructor(e){this.variableNames=["real","imag"],this.outputShape=e,this.userCode=`
      void main() {
        float re = abs(getRealAtOutCoords());
        float im = abs(getImagAtOutCoords());
        float mx = max(re, im);

        // sadly the length function in glsl is not underflow-safe
        // (at least not on Intel GPUs). So the safe solution is
        // to ensure underflow-safety in all cases.
        setOutput(
          mx == 0.0 ? 0.0 : mx * length(vec2(1, min(re, im)/mx))
        );
      }
    `}};function XS(r,e){return{dataId:e.dataId,dtype:e.dtype,shape:r.shape}}function c3(r){let{inputs:e,backend:t}=r,{x:o}=e,n=t.texData.get(o.dataId),s=new rp(o.shape),i=[XS(o,n.complexTensorInfos.real),XS(o,n.complexTensorInfos.imag)];return t.runWebGLProgram(s,i,i[0].dtype)}var jS={kernelName:Wi,backendName:"webgl",kernelFunc:c3};var op=class{constructor(e){this.outputShape=[],this.outputShape=I.computeOutShape(e,1),this.variableNames=e.map((i,a)=>`T${a}`);let t=new Array(e.length-1);t[0]=e[0][1];for(let i=1;i<t.length;i++)t[i]=t[i-1]+e[i][1];let o=[`if (yC < ${t[0]}) setOutput(getT0(yR, yC));`];for(let i=1;i<t.length;i++){let a=t[i-1];o.push(`else if (yC < ${t[i]}) setOutput(getT${i}(yR, yC-${a}));`)}let n=t.length,s=t[t.length-1];o.push(`else setOutput(getT${n}(yR, yC-${s}));`),this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int yR = coords.x;
        int yC = coords.y;

        ${o.join(`
        `)}
      }
    `}};var sp=class{constructor(e,t){this.packedInputs=!0,this.packedOutput=!0,this.outputShape=[],this.outputShape=I.computeOutShape(e,t);let o=this.outputShape,n=o.length,s=J(n),i=Ae("coords",n),a=["x","y","z","w","u","v"].slice(0,n);this.variableNames=e.map((g,h)=>`T${h}`);let u=new Array(e.length-1);u[0]=e[0][t];for(let g=1;g<u.length;g++)u[g]=u[g-1]+e[g][t];let l=a[t],c=a.slice(-2),p=a.join(),m=`if (${l} < ${u[0]}) {
        return getChannel(
            getT0(${p}), vec2(${c.join()}));
        }`;for(let g=1;g<u.length;g++){let h=u[g-1];m+=`
        if (${l} < ${u[g]}  && ${l} >= ${u[g-1]}) {
          return getChannel(
            getT${g}(${np(a,l,h)}),
            vec2(${np(c,l,h)}));
        }`}let f=u.length,d=u[u.length-1];m+=`
        return getChannel(
          getT${f}(${np(a,l,d)}),
          vec2(${np(c,l,d)}));`,this.userCode=`
      float getValue(${a.map(g=>"int "+g)}) {
        ${m}
      }

      void main() {
        ${s} coords = getOutputCoords();
        vec4 result = vec4(getValue(${i}), 0., 0., 0.);

        ${i[n-1]} = ${i[n-1]} + 1;
        if (${i[n-1]} < ${o[n-1]}) {
          result.g = getValue(${i});
        }

        ${i[n-2]} = ${i[n-2]} + 1;
        if (${i[n-2]} < ${o[n-2]}) {
          result.a = getValue(${i});
        }

        ${i[n-1]} = ${i[n-1]} - 1;
        if (${i[n-2]} < ${o[n-2]} &&
            ${i[n-1]} < ${o[n-1]}) {
          result.b = getValue(${i});
        }
        setOutput(result);
      }
    `}};function np(r,e,t){let o=r.indexOf(e);return r.map((s,i)=>i===o?`${s} - ${t}`:s).join()}function on(r){let{inputs:e,backend:t}=r,{input:o}=e,n=t.texData.get(o.dataId);return _e({inputs:{x:n.complexTensorInfos.imag},backend:t})}var YS={kernelName:xa,backendName:"webgl",kernelFunc:on};function ys(r,e,t){let o=r[0].dtype;if(o==="complex64"){let f=r.map(v=>Vr({inputs:{input:v},backend:t})),d=r.map(v=>on({inputs:{input:v},backend:t})),g=ys(f,e,t),h=ys(d,e,t),x=St({inputs:{real:g,imag:h},backend:t});return f.forEach(v=>t.disposeIntermediateTensorInfo(v)),d.forEach(v=>t.disposeIntermediateTensorInfo(v)),t.disposeIntermediateTensorInfo(g),t.disposeIntermediateTensorInfo(h),x}let n=t.shouldExecuteOnCPU(r);if(o==="string"&&(n=!0),n){let f=r.map(E=>{let R=[-1,T.sizeFromShape(E.shape.slice(e))];return L({inputs:{x:E},backend:t,attrs:{shape:R}})}),d=f.map(E=>({vals:t.readSync(E.dataId),shape:E.shape})),g=I.computeOutShape(f.map(E=>E.shape),1),h=f[0].shape[0]===1,x=J1(d,g,o,h),v=I.computeOutShape(r.map(E=>E.shape),e),N=t.makeTensorInfo(v,o,x);return f.forEach(E=>t.disposeIntermediateTensorInfo(E)),N}let s=r.filter(f=>T.sizeFromShape(f.shape)>0),i=$().getBool("WEBGL_PACK_ARRAY_OPERATIONS")&&s[0].shape.length>1;if(s.length===1){let f=i?new He(r[0].shape,Cr):new vt(r[0].shape,Cr);return t.runWebGLProgram(f,r,o)}let a=$().getNumber("WEBGL_MAX_TEXTURES_IN_SHADER");if(s.length>a){let f=[];for(let g=0;g<s.length;g+=a){let h=s.slice(g,g+a);f.push(ys(h,e,t))}let d=ys(f,e,t);for(let g of f)t.disposeIntermediateTensorInfo(g);return d}if(i){let f=new sp(s.map(d=>d.shape),e);return t.runWebGLProgram(f,s,o)}let{tensors2D:u,outShape:l}=p3(s,e,t),c=new op(u.map(f=>f.shape)),p=t.runWebGLProgram(c,u,o);u.forEach(f=>t.disposeIntermediateTensorInfo(f));let m=L({inputs:{x:p},attrs:{shape:l},backend:t});return t.disposeIntermediateTensorInfo(p),m}function p3(r,e,t){let o=I.computeOutShape(r.map(s=>s.shape),e);return{tensors2D:r.map(s=>L({inputs:{x:s},attrs:{shape:[-1,T.sizeFromShape(s.shape.slice(e))]},backend:t})),outShape:o}}function nh(r){let{inputs:e,backend:t,attrs:o}=r,{axis:n}=o,s=T.parseAxisParam(n,e[0].shape)[0],i=e.map(l=>l.shape);I.assertParamsConsistent(i,s);let a=I.computeOutShape(e.map(l=>l.shape),s);if(T.sizeFromShape(a)===0)return t.makeTensorInfo(a,e[0].dtype,[]);let u=e.filter(l=>T.sizeFromShape(l.shape)>0);return u.length===1?_e({inputs:{x:u[0]},backend:t}):ys(u,s,t)}var QS={kernelName:Hi,backendName:"webgl",kernelFunc:nh};var bs=class{constructor(e,t=!1,o=null,n=!1,s=!1){this.variableNames=["x","W"],this.outputShape=e.outShape;let i=e.padInfo.top,a=e.padInfo.left,u=e.strideHeight,l=e.strideWidth,c=e.dilationHeight,p=e.dilationWidth,m=e.filterHeight,f=e.filterWidth,d=Math.floor(e.inChannels/4)*4,g=e.inChannels%4,h=e.dataFormat==="channelsLast",x=h?1:2,v=h?2:3,N=h?3:1,E="",k="";o&&(n?E=`float activation(float a) {
          float b = getPreluActivationWeightsAtOutCoords();
          ${o}
        }`:s?E=`float activation(float a) {
          float b = getLeakyreluAlphaAtOutCoords();
          ${o}
        }`:E=`
          float activation(float x) {
            ${o}
          }
        `,k="result = activation(result);");let R=t?"result += getBiasAtOutCoords();":"";t&&this.variableNames.push("bias"),n&&this.variableNames.push("preluActivationWeights"),s&&this.variableNames.push("leakyreluAlpha"),this.userCode=`
      ${E}

      const ivec2 strides = ivec2(${u}, ${l});
      const ivec2 pads = ivec2(${i}, ${a});

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d2 = coords[${N}];

        ivec2 xRCCorner =
            ivec2(coords[${x}], coords[${v}]) * strides - pads;
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        // Convolve x(?, ?, d1) with w(:, :, d1, d2) to get y(yR, yC, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${m}; wR++) {
          int xR = xRCorner + wR * ${c};

          if (xR < 0 || xR >= ${e.inHeight}) {
            continue;
          }

          for (int wC = 0; wC < ${f}; wC++) {
            int xC = xCCorner + wC * ${p};

            if (xC < 0 || xC >= ${e.inWidth}) {
              continue;
            }

            for (int d1 = 0; d1 < ${d}; d1 += 4) {
              vec4 wValues = vec4(
                getW(wR, wC, d1, d2),
                getW(wR, wC, d1 + 1, d2),
                getW(wR, wC, d1 + 2, d2),
                getW(wR, wC, d1 + 3, d2)
              );

              if (${h}) {
                vec4 xValues = vec4(
                  getX(batch, xR, xC, d1),
                  getX(batch, xR, xC, d1 + 1),
                  getX(batch, xR, xC, d1 + 2),
                  getX(batch, xR, xC, d1 + 3)
                );
                dotProd += dot(xValues, wValues);
              } else {
                vec4 xValues = vec4(
                  getX(batch, d1, xR, xC),
                  getX(batch, d1 + 1, xR, xC),
                  getX(batch, d1 + 2, xR, xC),
                  getX(batch, d1 + 3, xR, xC)
                );
                dotProd += dot(xValues, wValues);
              }
            }

            if (${g===1}) {

              if (${h}) {
                dotProd +=
                    getX(batch, xR, xC, ${d}) *
                    getW(wR, wC, ${d}, d2);
              } else {
                dotProd +=
                    getX(batch, ${d}, xR, xC) *
                    getW(wR, wC, ${d}, d2);
              }

            } else if (${g===2}) {
              vec2 wValues = vec2(
                getW(wR, wC, ${d}, d2),
                getW(wR, wC, ${d} + 1, d2)
              );

              if (${h}) {
                vec2 xValues = vec2(
                  getX(batch, xR, xC, ${d}),
                  getX(batch, xR, xC, ${d} + 1)
                );
                dotProd += dot(xValues, wValues);
              } else {
                vec2 xValues = vec2(
                  getX(batch, ${d}, xR, xC),
                  getX(batch, ${d} + 1, xR, xC)
                );
                dotProd += dot(xValues, wValues);
              }

            } else if (${g===3}) {
              vec3 wValues = vec3(
                getW(wR, wC, ${d}, d2),
                getW(wR, wC, ${d} + 1, d2),
                getW(wR, wC, ${d} + 2, d2)
              );

              if (${h}) {
                vec3 xValues = vec3(
                  getX(batch, xR, xC, ${d}),
                  getX(batch, xR, xC, ${d} + 1),
                  getX(batch, xR, xC, ${d} + 2)
                );
                dotProd += dot(xValues, wValues);
              } else {
                vec3 xValues = vec3(
                  getX(batch, ${d}, xR, xC),
                  getX(batch, ${d} + 1, xR, xC),
                  getX(batch, ${d} + 2, xR, xC)
                );
                dotProd += dot(xValues, wValues);
              }

            }
          }
        }

        float result = dotProd;
        ${R}
        ${k}
        setOutput(result);
      }
    `}},ip=class{constructor(e){this.variableNames=["x","W"],this.outputShape=e.outShape;let t=e.padInfo.front,o=e.padInfo.top,n=e.padInfo.left,s=e.strideDepth,i=e.strideHeight,a=e.strideWidth,u=e.dilationDepth,l=e.dilationHeight,c=e.dilationWidth,p=e.filterDepth,m=e.filterHeight,f=e.filterWidth,d=Math.floor(e.inChannels/4)*4,g=e.inChannels%4;this.userCode=`
      const ivec3 strides = ivec3(${s}, ${i}, ${a});
      const ivec3 pads = ivec3(${t}, ${o}, ${n});

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int d2 = coords.u;

        ivec3 xFRCCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;
        int xFCorner = xFRCCorner.x;
        int xRCorner = xFRCCorner.y;
        int xCCorner = xFRCCorner.z;

        // Convolve x(?, ?, ?, d1) with w(:, :, :, d1, d2) to get
        // y(yF, yR, yC, d2). ? = to be determined. : = across all
        // values in that axis.
        float dotProd = 0.0;
        for (int wF = 0; wF < ${p}; wF++) {
          int xF = xFCorner + wF * ${u};

          if (xF < 0 || xF >= ${e.inDepth}) {
            continue;
          }

          for (int wR = 0; wR < ${m}; wR++) {
            int xR = xRCorner + wR * ${l};

            if (xR < 0 || xR >= ${e.inHeight}) {
              continue;
            }

            for (int wC = 0; wC < ${f}; wC++) {
              int xC = xCCorner + wC * ${c};

              if (xC < 0 || xC >= ${e.inWidth}) {
                continue;
              }

              for (int d1 = 0; d1 < ${d}; d1 += 4) {
                vec4 xValues = vec4(
                  getX(batch, xF, xR, xC, d1),
                  getX(batch, xF, xR, xC, d1 + 1),
                  getX(batch, xF, xR, xC, d1 + 2),
                  getX(batch, xF, xR, xC, d1 + 3)
                );
                vec4 wValues = vec4(
                  getW(wF, wR, wC, d1, d2),
                  getW(wF, wR, wC, d1 + 1, d2),
                  getW(wF, wR, wC, d1 + 2, d2),
                  getW(wF, wR, wC, d1 + 3, d2)
                );

                dotProd += dot(xValues, wValues);
              }

              if (${g===1}) {
                dotProd +=
                  getX(batch, xF, xR, xC, ${d}) *
                  getW(wF, wR, wC, ${d}, d2);
              } else if (${g===2}) {
                vec2 xValues = vec2(
                  getX(batch, xF, xR, xC, ${d}),
                  getX(batch, xF, xR, xC, ${d} + 1)
                );
                vec2 wValues = vec2(
                  getW(wF, wR, wC, ${d}, d2),
                  getW(wF, wR, wC, ${d} + 1, d2)
                );
                dotProd += dot(xValues, wValues);
              } else if (${g===3}) {
                vec3 xValues = vec3(
                  getX(batch, xF, xR, xC, ${d}),
                  getX(batch, xF, xR, xC, ${d} + 1),
                  getX(batch, xF, xR, xC, ${d} + 2)
                );
                vec3 wValues = vec3(
                  getW(wF, wR, wC, ${d}, d2),
                  getW(wF, wR, wC, ${d} + 1, d2),
                  getW(wF, wR, wC, ${d} + 2, d2)
                );
                dotProd += dot(xValues, wValues);
              }
            }
          }
        }
        setOutput(dotProd);
      }
    `}};var ws=class{constructor(e,t=!1,o=null,n=!1,s=!1){this.variableNames=["x","W"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"pads",type:"ivec2"},{name:"strides",type:"ivec2"},{name:"dilations",type:"ivec2"},{name:"inDims",type:"ivec2"}],this.outputShape=e.outShape,this.enableShapeUniforms=he(this.outputShape.length);let i=e.padInfo.left,a=e.strideWidth,u=e.dilationWidth,l=e.filterHeight,c=e.filterWidth,p=c,m=`
       int xR; int xC; int xCOffset;
       vec4 wTexel; vec4 previous; vec4 final;`;for(let h=0;h<c;h++)m+=`
           vec4 xTexelC${h*2};
           int xTexelC${h*2}Ready;
           vec4 xTexelC${h*2+1};
           int xTexelC${h*2+1}Ready;
           vec4 xC${h};`;m+=`
     for (int r = 0; r < ${l}; r++) {
      for (int d1 = 0; d1 < ${e.inChannels}; d1 += 2) {
       `;for(let h=0;h<c;h++)m+=`
           xTexelC${h*2} = vec4(0.0);
           xTexelC${h*2}Ready = 0;
           xTexelC${h*2+1} = vec4(0.0);
           xTexelC${h*2+1}Ready = 0;
           xC${h} = vec4(0.0);`;m+=`
         xR = xRCorner + r * dilations[0];
         if (xR >=0 && xR < inDims[0]) {
       `;for(let h=0;h<(p+1)/2;h++){let x=h*2;if(m+=`
           xC = xCCorner + ${x*u};
           `,a===1){if(x<c&&(i%2===1?(m+=`
                 xCOffset = xC + 1;
                 if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${x}Ready == 0) {
                   xTexelC${x} = getX(batch, xR, xCOffset, d1);

                   // Need to manually clear unused channels in case
                   // we're reading from recycled texture.
                   if (xCOffset + 1 >= inDims[1]) {
                     xTexelC${x}.zw = vec2(0.0);
                   }
                   xTexelC${x}Ready = 1;
                 }
               `,u===1&&x>0?m+=`
                 xC${x} = vec4(xTexelC${x-2}.zw, xTexelC${x}.xy);
                 `:m+=`
                   xCOffset = xC + 1 - 2;

                   if (xCOffset >= 0 && xCOffset < inDims[1]) {
                     previous = getX(batch, xR, xCOffset, d1);

                     // Need to manually clear unused channels in case
                     // we're reading from recycled texture.
                     if (xCOffset + 1 >= inDims[1]) {
                       previous.zw = vec2(0.0);
                     }

                     xC${x} = vec4(previous.zw, xTexelC${x}.xy);
                   } else {
                     xC${x} = vec4(0.0, 0.0, xTexelC${x}.xy);
                   }
                   `):m+=`
                 if (xC >= 0 && xC < inDims[1] && xTexelC${x}Ready == 0) {
                   xTexelC${x} = getX(batch, xR, xC, d1);
                   if (xC + 1 >= inDims[1]) {
                     xTexelC${x}.zw = vec2(0.0);
                   }
                   xTexelC${x}Ready = 1;
                 }

                 xC${x} = xTexelC${x};
                 `,x+1<c)){let v=i%2===0?T.nearestLargerEven(u):u;u%2===0&&i%2===1||u%2!==0&&i%2!==1?(m+=`
                   xCOffset = xC + imod(pads[1], 2) + ${v};

                   if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${x+1}Ready == 0) {
                     xTexelC${x+1} = getX(batch, xR, xCOffset, d1);

                     // Need to manually clear unused channels in case
                     // we're reading from recycled texture.
                     if (xCOffset + 1 >= inDims[1]) {
                       xTexelC${x+1}.zw = vec2(0.0);
                     }
                     xTexelC${x+1}Ready = 1;
                   }
                   `,u>1?m+=`
                     xCOffset -= 2;
                     if (xCOffset >= 0 && xCOffset < inDims[1]) {
                      previous = getX(batch, xR, xCOffset, d1);
                      xC${x+1} = vec4(previous.zw, xTexelC${x+1}.xy);
                     } else {
                      xC${x+1} = vec4(0.0, 0.0, xTexelC${x+1}.xy);
                     }
                     `:m+=`
                     xC${x+1} = vec4(xTexelC${x}.zw, xTexelC${x+1}.xy);
                     `):v===1?m+=`
                     xC${x+1} = xTexelC${x};
                     `:m+=`
                     xCOffset = xC + ${v};

                     if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${x+1}Ready == 0) {
                       xTexelC${x+1} = getX(batch, xR, xCOffset, d1);
                       if (xCOffset + 1 >= inDims[1]) {
                         xTexelC${x+1}.zw = vec2(0.0);
                       }
                       xTexelC${x+1}Ready = 1;
                     }

                     xC${x+1} = xTexelC${x+1};
                     `}}else x<c&&(i%2===1?(m+=`
                 xCOffset = xC + 1 - strides[1];
                 if(xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${x}Ready == 0) {
                   xTexelC${x} = getX(batch, xR, xCOffset, d1);
                   // Need to manually clear unused channels in case
                   // we're reading from recycled texture.
                   if (xCOffset + 1 >= inDims[1]) {
                     xTexelC${x}.zw = vec2(0.0);
                   }
                   xTexelC${x}Ready = 1;
                 }

                 if(xC + 1 >= 0 && xC + 1 < inDims[1] && xTexelC${x+1}Ready == 0) {
                   xTexelC${x+1} = getX(batch, xR, xC + 1, d1);
                   // Need to manually clear unused channels in case
                   // we're reading from recycled texture.
                   if (xC + 2 >= inDims[1]) {
                     xTexelC${x+1}.zw = vec2(0.0);
                   }
                   xTexelC${x+1}Ready = 1;
                 }

                 xC${x} = vec4(xTexelC${x}.zw, xTexelC${x+1}.zw);
               `,x+1<c&&(m+=`
                   final = vec4(0.0);
                   xCOffset = xC + 1 + strides[1];
                   if(xCOffset >= 0 && xCOffset < inDims[1]) {
                     final = getX(batch, xR, xCOffset, d1);
                   }
                   xC${x+1} = vec4(xTexelC${x+1}.xy, final.xy);
                 `)):(m+=`
                 if(xC >= 0 && xC < inDims[1] && xTexelC${x}Ready == 0) {
                   xTexelC${x} = getX(batch, xR, xC, d1);
                   if (xC + 1 >= inDims[1]) {
                     xTexelC${x}.zw = vec2(0.0);
                   }
                   xTexelC${x}Ready = 1;
                 }

                 xCOffset = xC + strides[1];
                 if(xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${x+1}Ready == 0) {
                   xTexelC${x+1} = getX(batch, xR, xCOffset, d1);
                   if (xCOffset + 1 >= inDims[1]) {
                     xTexelC${x+1}.zw = vec2(0.);
                   }
                   xTexelC${x+1}Ready = 1;
                 }

                 xC${x} = vec4(
                   xTexelC${x}.xy, xTexelC${x+1}.xy);
               `,x+1<c&&(m+=`
                   xC${x+1} = vec4(xTexelC${x}.zw, xTexelC${x+1}.zw);
                 `)));x<c&&(m+=`
             wTexel = getW(r, ${x}, d1, d2);
             dotProd += xC${x}.xxzz * vec4(wTexel.xy, wTexel.xy);
             if(d1 + 1 < ${e.inChannels}) {
               dotProd += xC${x}.yyww * vec4(wTexel.zw, wTexel.zw);
             }
           `,x+1<c&&(m+=`
               wTexel = getW(r, ${x+1}, d1, d2);
               dotProd += xC${x+1}.xxzz * vec4(wTexel.xy, wTexel.xy);
               if(d1 + 1 < ${e.inChannels}) {
                 dotProd += xC${x+1}.yyww * vec4(wTexel.zw, wTexel.zw);
               }
             `))}m+=`
     }
   `,m+=`
     }
   `,m+=`
     }
   `;let f="",d="";o&&(n?f=`vec4 activation(vec4 a) {
           vec4 b = getPreluActivationWeightsAtOutCoords();
           ${o}
         }`:s?f=`vec4 activation(vec4 a) {
           vec4 b = getLeakyreluAlphaAtOutCoords();
           ${o}
         }`:f=`vec4 activation(vec4 x) {
           ${o}
         }`,d="result = activation(result);");let g=t?"result += getBiasAtOutCoords();":"";t&&this.variableNames.push("bias"),n&&this.variableNames.push("preluActivationWeights"),s&&this.variableNames.push("leakyreluAlpha"),this.userCode=`
       ${f}

       void main() {
         ivec4 coords = getOutputCoords();
         int batch = coords.x;
         ivec2 xRCCorner = coords.yz * strides - pads;
         int d2 = coords.w;
         int xRCorner = xRCCorner.x;
         int xCCorner = xRCCorner.y;

         //intialize dotProd with a small epsilon seems to reduce GPU accuracy loss.
         vec4 dotProd = vec4(0.000000000000001);

         ${m}

         vec4 result = dotProd - vec4(0.000000000000001);
         ${g}
         ${d}
         setOutput(result);
       }
     `}};var ap=class{constructor(e,t){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"inputShape",type:"ivec4"},{name:"pad",type:"ivec2"},{name:"stride",type:"ivec2"},{name:"dilation",type:"ivec2"},{name:"inChannels",type:"int"},{name:"itemsPerBlockRow",type:"int"},{name:"outWidth",type:"int"}],this.outputShape=e,this.enableShapeUniforms=he(this.outputShape.length);let{dataFormat:o}=t,n=Ee(),s=o==="channelsLast",i=s?1:2,a=s?2:3,u=this.enableShapeUniforms?"if(blockIndex < outShape[2] && pos < outShape[1]) {":`if(blockIndex < ${e[2]} && pos < ${e[1]}) {`,l="";for(let c=0;c<=1;c++)for(let p=0;p<=1;p++)l+=`
          blockIndex = rc.z + ${p};
          pos = rc.y + ${c};

          ${u}
            offsetY = int(blockIndex / outWidth) * stride[0] - pad[0];
            d0 = offsetY + dilation[0] * (pos / itemsPerBlockRow);

            if(d0 < inputShape[${i}] && d0 >= 0) {
              // Use custom imod instead mod. On Intel GPU, mod may generate
              // unexpected value.
              // https://github.com/tensorflow/tfjs/issues/5447
              offsetX = imod(blockIndex, outWidth) * stride[1] - pad[1];
              d1 = offsetX + dilation[1] * (imod(pos, itemsPerBlockRow) /
                  inChannels);

              if(d1 < inputShape[${a}] && d1 >= 0) {

                ch = imod(pos, inChannels);

                if (${s}) {
                  innerDims = vec2(d1, ch);
                  result[${c*2+p}] = getChannel(
                    getA(rc.x, d0, int(innerDims.x),
                    int(innerDims.y)), innerDims);
                } else {
                  innerDims = vec2(d0, d1);
                  result[${c*2+p}] = getChannel(
                    getA(rc.x, ch, int(innerDims.x),
                    int(innerDims.y)), innerDims);
                }
              }
            }
          }
        `;this.userCode=`
      void main() {
        ivec3 rc = getOutputCoords();

        vec4 result = vec4(0);

        int blockIndex, pos, offsetY, d0, offsetX, d1, ch;
        vec2 innerDims;

        ${l}

        ${n.output} = result;
      }
    `}};function up(r,e){let t=r.length;return t>=3?e?[...r.slice(0,-3),r[t-3]*r[t-2],r[t-1]]:[...r.slice(0,-3),r[t-3],r[t-2]*r[t-1]]:!e&&t===1&&r[0]>1?[r[0],1]:null}function lp({x:r,filter:e,convInfo:t,backend:o,bias:n=null,preluActivationWeights:s=null,leakyreluAlpha:i=0,activation:a=null}){let u=r.shape,l=o.texData.get(r.dataId),c=t.inChannels,p=u[0]*u[1]*u[2],m=t.outChannels,f=t.dataFormat==="channelsLast",d=!1,g=!1,h,x=[];if(s!=null){let E=up(s.shape,f);E!=null&&(s=L({inputs:{x:s},backend:o,attrs:{shape:E}}),x.push(s))}if(n!=null){let E=up(n.shape,f);E!=null&&(n=L({inputs:{x:n},backend:o,attrs:{shape:E}}),x.push(n))}if(!((p===1||m===1)&&c>eh)&&l.isPacked&&f&&l.texture!=null&&u[2]%2!==0&&T.arraysEqual(l.shape.slice(-3),u.slice(-3))){let E=u[0]*u[1]*(u[2]+1),k={dataId:r.dataId,shape:[1,E,t.inChannels],dtype:r.dtype},R=l.shape;l.shape=l.shape.slice(),l.shape[l.shape.length-2]++,T.assert(Qo(l.shape,k.shape),()=>`packed reshape ${l.shape} to ${k.shape} isn't free`);let A=L({inputs:{x:e},backend:o,attrs:{shape:[1,t.inChannels,t.outChannels]}});x.push(A);let _=rn({a:k,b:A,backend:o,transposeA:d,transposeB:g,bias:n,activation:a,preluActivationWeights:s,leakyreluAlpha:i}),O=o.texData.get(_.dataId);T.assert(O.isPacked,()=>"batchMatMul result is expected to be packed"),l.shape=R,O.shape=t.outShape,h=_e({inputs:{x:_},backend:o}),h.shape=t.outShape,x.push(_)}else{let E=t.outHeight*t.outWidth,k=L({inputs:{x:r},backend:o,attrs:{shape:f?[t.batchSize,E,t.inChannels]:[t.batchSize,t.inChannels,E]}}),R=L({inputs:{x:e},backend:o,attrs:{shape:[1,t.inChannels,t.outChannels]}}),A=rn({a:f?k:R,b:f?R:k,transposeA:!f,transposeB:g,backend:o,bias:n,activation:a,preluActivationWeights:s,leakyreluAlpha:i});h=L({inputs:{x:A},backend:o,attrs:{shape:t.outShape}}),x.push(k),x.push(R),x.push(A)}for(let E of x)o.disposeIntermediateTensorInfo(E);return h}function cp({x:r,filter:e,convInfo:t,backend:o,bias:n=null,preluActivationWeights:s=null,leakyreluAlpha:i=0,activation:a=null}){let{filterWidth:u,filterHeight:l,inChannels:c,outWidth:p,outHeight:m,dataFormat:f}=t,d=f==="channelsLast",g=u*l*c,h=m*p,x=[t.batchSize,g,h],v=!0,N=!1,E=[];if(s!=null){let be=up(s.shape,d);be!=null&&(s=L({inputs:{x:s},backend:o,attrs:{shape:be}}),E.push(s))}if(n!=null){let be=up(n.shape,d);be!=null&&(n=L({inputs:{x:n},backend:o,attrs:{shape:be}}),E.push(n))}let k=L({inputs:{x:e},backend:o,attrs:{shape:[1,g,T.sizeFromShape(e.shape)/g]}});E.push(k);let R=new ap(x,t),A=[r.shape,[t.padInfo.top,t.padInfo.left],[t.strideHeight,t.strideWidth],[t.dilationHeight,t.dilationWidth],[t.inChannels],[t.filterWidth*t.inChannels],[t.outWidth]],_=o.runWebGLProgram(R,[r],"float32",A),O=L({inputs:{x:_},backend:o,attrs:{shape:x}});E.push(_),E.push(O);let F=n!=null,B=s!=null,M=a==="leakyrelu",z=a?Mr(a,!0):null,j=new xs(d?O.shape:k.shape,d?k.shape:O.shape,d?[t.batchSize,h,t.outChannels]:[t.batchSize,t.outChannels,h],v,N,F,z,B,M),Z=d?[O,k]:[k,O];if(n&&Z.push(n),B&&Z.push(s),M){let be=o.makeTensorInfo([],"float32",T.createScalarValue(i,"float32"));Z.push(be),E.push(be)}let ie=o.runWebGLProgram(j,Z,"float32"),fe=L({inputs:{x:ie},backend:o,attrs:{shape:t.outShape}});E.push(ie);for(let be of E)o.disposeIntermediateTensorInfo(be);return fe}function m3(r){let{inputs:e,backend:t,attrs:o}=r,{x:n,filter:s}=e,{strides:i,pad:a,dataFormat:u,dilations:l,dimRoundingMode:c}=o,p=I.convertConv2DDataFormat(u),m=I.computeConv2DInfo(n.shape,s.shape,i,l,a,c,!1,p),f;if(m.filterHeight===1&&m.filterWidth===1&&m.dilationHeight===1&&m.dilationWidth===1&&m.strideHeight===1&&m.strideWidth===1&&(m.padInfo.type==="SAME"||m.padInfo.type==="VALID"))f=lp({x:n,filter:s,convInfo:m,backend:t});else if(m.strideWidth<=2&&p==="channelsLast"&&$().getBool("WEBGL_EXP_CONV")){let g=new ws(m),h=[[m.padInfo.top,m.padInfo.left],[m.strideHeight,m.strideWidth],[m.dilationHeight,m.dilationWidth],[m.inHeight,m.inWidth]];f=t.runWebGLProgram(g,[n,s],"float32",h)}else if($().getBool("WEBGL_CONV_IM2COL"))f=cp({x:n,filter:s,convInfo:m,backend:t});else{let g=new bs(m);f=t.runWebGLProgram(g,[n,s],"float32")}let d=L({inputs:{x:f},backend:t,attrs:{shape:m.outShape}});return t.disposeIntermediateTensorInfo(f),d}var ZS={kernelName:Ki,backendName:"webgl",kernelFunc:m3};var pp=class{constructor(e){this.variableNames=["x","dy"],this.outputShape=e.filterShape;let t=e.strideHeight,o=e.strideWidth,n=e.padInfo.top,s=e.padInfo.left,i=e.dataFormat==="channelsLast";this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int wR = coords.x;
        int wC = coords.y;
        int d1 = coords.z;
        int d2 = coords.w;

        // Convolve x(?, ?, d1) with dy(:, :, d2) to get dw(wR, wC, d1, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;

        for (int b = 0; b < ${e.batchSize}; b++) {
          for (int yR = 0; yR < ${e.outHeight}; yR++) {
            int xR = wR + yR * ${t} - ${n};

            if (xR < 0 || xR >= ${e.inHeight}) {
              continue;
            }

            for (int yC = 0; yC < ${e.outWidth}; yC++) {
              int xC = wC + yC * ${o} - ${s};

              if (xC < 0 || xC >= ${e.inWidth}) {
                continue;
              }

              ${i?`float dyValue = getDy(b, yR, yC, d2);
              float xValue = getX(b, xR, xC, d1);
              dotProd += (xValue * dyValue);`:`float dyValue = getDy(b, d2, yR, yC);
              float xValue = getX(b, d1, xR, xC);
              dotProd += (xValue * dyValue);`}
            }
          }
        }
        setOutput(dotProd);
      }
    `}},mp=class{constructor(e){this.variableNames=["dy","W"],this.outputShape=e.inShape;let t=e.filterHeight,o=e.filterWidth,n=e.strideHeight,s=e.strideWidth,i=e.dataFormat==="channelsLast",a=t-1-e.padInfo.top,u=o-1-e.padInfo.left,l=i?1:2,c=i?2:3,p=i?3:1;this.userCode=`
      const ivec2 pads = ivec2(${a}, ${u});

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d1 = coords[${p}];

        ivec2 dyCorner = ivec2(coords[${l}], coords[${c}]) - pads;
        int dyRCorner = dyCorner.x;
        int dyCCorner = dyCorner.y;

        // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${t}; wR++) {
          float dyR = float(dyRCorner + wR) / ${n}.0;

          if (dyR < 0.0 || dyR >= ${e.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          int wRPerm = ${t} - 1 - wR;

          for (int wC = 0; wC < ${o}; wC++) {
            float dyC = float(dyCCorner + wC) / ${s}.0;

            if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            int wCPerm = ${o} - 1 - wC;

            for (int d2 = 0; d2 < ${e.outChannels}; d2++) {

              if (${i}) {
                float xValue = getDy(batch, idyR, idyC, d2);
                float wValue = getW(wRPerm, wCPerm, d1, d2);
                dotProd += xValue * wValue;
              } else {
                float xValue = getDy(batch, d2, idyR, idyC);
                float wValue = getW(wRPerm, wCPerm, d1, d2);
                dotProd += xValue * wValue;
              }

            }
          }
        }
        setOutput(dotProd);
      }
    `}},fp=class{constructor(e){this.variableNames=["x","dy"],this.outputShape=e.filterShape;let t=e.strideDepth,o=e.strideHeight,n=e.strideWidth,s=e.padInfo.front,i=e.padInfo.top,a=e.padInfo.left;this.userCode=`
      void main() {
        ivec5 coords = getOutputCoords();
        int wF = coords.x;
        int wR = coords.y;
        int wC = coords.z;
        int d1 = coords.w;
        int d2 = coords.u;

        float dotProd = 0.0;

        for (int b = 0; b < ${e.batchSize}; b++) {
          for (int yF = 0; yF < ${e.outDepth}; yF++) {
            int xF = wF + yF * ${t} - ${s};

            if (xF < 0 || xF >= ${e.inDepth}) {
              continue;
            }

            for (int yR = 0; yR < ${e.outHeight}; yR++) {
              int xR = wR + yR * ${o} - ${i};

              if (xR < 0 || xR >= ${e.inHeight}) {
                continue;
              }

              for (int yC = 0; yC < ${e.outWidth}; yC++) {
                int xC = wC + yC * ${n} - ${a};

                if (xC < 0 || xC >= ${e.inWidth}) {
                  continue;
                }

                float dyValue = getDy(b, yF, yR, yC, d2);
                float xValue = getX(b, xF, xR, xC, d1);
                dotProd += (xValue * dyValue);
              }
            }
          }
        }
        setOutput(dotProd);
      }
    `}},dp=class{constructor(e){this.variableNames=["dy","W"],this.outputShape=e.inShape;let t=e.filterDepth,o=e.filterHeight,n=e.filterWidth,s=e.strideDepth,i=e.strideHeight,a=e.strideWidth,u=t-1-e.padInfo.front,l=o-1-e.padInfo.top,c=n-1-e.padInfo.left;this.userCode=`
      const ivec3 pads = ivec3(${u}, ${l}, ${c});

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int d1 = coords.u;


        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;
        int dyFCorner = dyCorner.x;
        int dyRCorner = dyCorner.y;
        int dyCCorner = dyCorner.z;

        float dotProd = 0.0;
        for (int wF = 0; wF < ${t}; wF++) {
          float dyF = float(dyFCorner + wF) / ${s}.0;

          if (dyF < 0.0 || dyF >= ${e.outDepth}.0 || fract(dyF) > 0.0) {
            continue;
          }
          int idyF = int(dyF);

          int wFPerm = ${t} - 1 - wF;

          for (int wR = 0; wR < ${o}; wR++) {
            float dyR = float(dyRCorner + wR) / ${i}.0;

            if (dyR < 0.0 || dyR >= ${e.outHeight}.0 ||
              fract(dyR) > 0.0) {
              continue;
            }
            int idyR = int(dyR);

            int wRPerm = ${o} - 1 - wR;

            for (int wC = 0; wC < ${n}; wC++) {
              float dyC = float(dyCCorner + wC) / ${a}.0;

              if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                  fract(dyC) > 0.0) {
                continue;
              }
              int idyC = int(dyC);

              int wCPerm = ${n} - 1 - wC;

              for (int d2 = 0; d2 < ${e.outChannels}; d2++) {
                float xValue = getDy(batch, idyF, idyR, idyC, d2);
                float wValue = getW(wFPerm, wRPerm, wCPerm, d1, d2);
                dotProd += xValue * wValue;
              }
            }
          }
        }
        setOutput(dotProd);
      }
    `}};function f3(r){let{inputs:e,backend:t,attrs:o}=r,{x:n,dy:s}=e,{strides:i,pad:a,dataFormat:u,dimRoundingMode:l,filterShape:c}=o,p=I.convertConv2DDataFormat(u),m=I.computeConv2DInfo(n.shape,c,i,1,a,l,!1,p),f=new pp(m);return t.runWebGLProgram(f,[n,s],"float32")}var JS={kernelName:qi,backendName:"webgl",kernelFunc:f3};var hp=class{constructor(e){this.variableNames=["dy","W"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"strides",type:"vec2"}],this.outputShape=e.inShape,this.enableShapeUniforms=he(this.outputShape.length);let t=e.filterHeight,o=e.filterWidth,n=t-1-e.padInfo.top,s=o-1-e.padInfo.left;this.userCode=`
      const ivec2 pads = ivec2(${n}, ${s});

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d1 = coords[3];

        ivec2 dyCorner = ivec2(coords[1], coords[2]) - pads;
        int dyRCorner = dyCorner.x;
        int dyCCorner = dyCorner.y;

        vec4 result = vec4(0.);
        for (int wR = 0; wR < ${t}; wR++) {
          float dyR = float(dyRCorner + wR) / strides[0];
          if (dyR < 0.0 || dyR >= ${e.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);
          int wRPerm = ${t} - 1 - wR;

          for (int wC = 0; wC < ${o}; wC++) {
            int wCPerm = ${o} - 1 - wC;

            float dyC = float(dyCCorner + wC) / strides[1];
            bool idyCVal = (dyC >= 0.0) && (dyC < ${e.outWidth}.0)
              && (fract(dyC) == 0.0);
            int idyC = int(dyC);

            float dyC2 = float(dyCCorner + wC + 1) / strides[1];
            bool idyCVal2 = (dyC2 >= 0.0) && (dyC2 < ${e.outWidth}.0)
              && (fract(dyC2) == 0.0);
            int idyC2 = int(dyC2);

            if (idyCVal && idyCVal2) {
              for (int d2 = 0; d2 < ${e.outChannels}; d2 += 2) {
                vec4 wValue = getW(wRPerm, wCPerm, d1, d2);
                vec4 dySample = getDy(batch, idyR, idyC, d2);
                vec4 dySample2 = (idyC / 2 == idyC2 / 2) ?
                  dySample : getDy(batch, idyR, idyC2, d2);

                vec2 dyValue = mod(float(idyC), 2.) == 0. ?
                  dySample.xy : dySample.zw;
                result.xy += vec2(dot(dyValue, wValue.xy),
                  dot(dyValue, wValue.zw));

                dyValue = mod(float(idyC2), 2.) == 0. ?
                  dySample2.xy : dySample2.zw;
                result.zw += vec2(dot(dyValue, wValue.xy),
                  dot(dyValue, wValue.zw));
              }
            } else if (idyCVal) {
              for (int d2 = 0; d2 < ${e.outChannels}; d2 += 2) {
                vec4 wValue = getW(wRPerm, wCPerm, d1, d2);
                vec4 dySample = getDy(batch, idyR, idyC, d2);
                vec2 dyValue = mod(float(idyC), 2.) == 0. ?
                  dySample.xy : dySample.zw;
                result.xy += vec2(dot(dyValue, wValue.xy),
                  dot(dyValue, wValue.zw));
              }
            } else if (idyCVal2) {
              for (int d2 = 0; d2 < ${e.outChannels}; d2 += 2) {
                vec4 wValue = getW(wRPerm, wCPerm, d1, d2);
                vec4 dySample = getDy(batch, idyR, idyC2, d2);
                vec2 dyValue = mod(float(idyC2), 2.) == 0. ?
                  dySample.xy : dySample.zw;
                result.zw += vec2(dot(dyValue, wValue.xy),
                  dot(dyValue, wValue.zw));
              }
            }
          }
        }
        setOutput(result);
      }
    `}};function d3(r){let{inputs:e,backend:t,attrs:o}=r,{dy:n,filter:s}=e,{inputShape:i,strides:a,pad:u,dataFormat:l,dimRoundingMode:c}=o,p=I.convertConv2DDataFormat(l),m=I.computeConv2DInfo(i,s.shape,a,1,u,c,!1,p);if($().getBool("WEBGL_PACK_CONV2DTRANSPOSE")&&p==="channelsLast"){let f=[[m.strideHeight,m.strideWidth]],d=new hp(m);return t.runWebGLProgram(d,[n,s],"float32",f)}else{let f=new mp(m);return t.runWebGLProgram(f,[n,s],"float32")}}var eC={kernelName:Xi,backendName:"webgl",kernelFunc:d3};function h3(r){let{inputs:e,backend:t,attrs:o}=r,{x:n,filter:s}=e,{strides:i,pad:a,dilations:u}=o,l=I.computeConv3DInfo(n.shape,s.shape,i,u,a),c=new ip(l);return t.runWebGLProgram(c,[n,s],"float32")}var tC={kernelName:ji,backendName:"webgl",kernelFunc:h3};function g3(r){let{inputs:e,backend:t,attrs:o}=r,{x:n,dy:s}=e,{strides:i,pad:a,filterShape:u}=o,l=I.computeConv3DInfo(n.shape,u,i,1,a),c=new fp(l);return t.runWebGLProgram(c,[n,s],"float32")}var rC={kernelName:Ah,backendName:"webgl",kernelFunc:g3};function x3(r){let{inputs:e,backend:t,attrs:o}=r,{dy:n,filter:s}=e,{pad:i,strides:a,inputShape:u}=o,l=I.computeConv3DInfo(u,s.shape,a,1,i),c=new dp(l);return t.runWebGLProgram(c,[n,s],"float32")}var oC={kernelName:Yi,backendName:"webgl",kernelFunc:x3};var y3=Qt+`
  return cos(x);
`,b3=`
  vec4 result = cos(x);
  bvec4 isNaN = isnan(x);
  ${Pt}
  return result;
`,w3=W({opSnippet:y3,packedOpSnippet:b3}),nC={kernelName:"Cos",backendName:"webgl",kernelFunc:w3};var v3=`
  float e2x = exp(-x);
  return (e2x + 1.0 / e2x) / 2.0;
`,T3=W({opSnippet:v3}),sC={kernelName:Qi,backendName:"webgl",kernelFunc:T3};var gp=class{constructor(e,t,o,n,s){this.variableNames=["Image","Boxes","BoxInd"],this.outputShape=[];let[i,a,u,l]=e,[c]=t,[p,m]=o;this.outputShape=[c,p,m,l];let f=n==="bilinear"?1:0,[d,g]=[`${a-1}.0`,`${u-1}.0`],[h,x,v]=p>1?[`${(a-1)/(p-1)}`,"(y2-y1) * height_ratio",`y1*${d} + float(y)*(height_scale)`]:["0.0","0.0",`0.5 * (y1+y2) * ${d}`],[N,E,k]=m>1?[`${(u-1)/(m-1)}`,"(x2-x1) * width_ratio",`x1*${g} + float(x)*(width_scale)`]:["0.0","0.0",`0.5 * (x1+x2) * ${g}`];this.userCode=`
      const float height_ratio = float(${h});
      const float width_ratio = float(${N});
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int y = coords[1];
        int x = coords[2];
        int d = coords[3];

        // get box vals
        float y1 = getBoxes(b,0);
        float x1 = getBoxes(b,1);
        float y2 = getBoxes(b,2);
        float x2 = getBoxes(b,3);

        // get image in batch index
        int bInd = round(getBoxInd(b));
        if(bInd < 0 || bInd >= ${i}) {
          return;
        }

        float height_scale = ${x};
        float width_scale = ${E};

        float in_y = ${v};
        if( in_y < 0.0 || in_y > ${d} ) {
          setOutput(float(${s}));
          return;
        }
        float in_x = ${k};
        if( in_x < 0.0 || in_x > ${g} ) {
          setOutput(float(${s}));
          return;
        }

        vec2 sourceFracIndexCR = vec2(in_x,in_y);
        if(${f} == 1) {
          // Compute the four integer indices.
          ivec2 sourceFloorCR = ivec2(sourceFracIndexCR);
          ivec2 sourceCeilCR = ivec2(ceil(sourceFracIndexCR));

          float topLeft = getImage(b, sourceFloorCR.y, sourceFloorCR.x, d);
          float bottomLeft = getImage(b, sourceCeilCR.y, sourceFloorCR.x, d);
          float topRight = getImage(b, sourceFloorCR.y, sourceCeilCR.x, d);
          float bottomRight = getImage(b, sourceCeilCR.y, sourceCeilCR.x, d);

          vec2 fracCR = sourceFracIndexCR - vec2(sourceFloorCR);

          float top = topLeft + (topRight - topLeft) * fracCR.x;
          float bottom = bottomLeft + (bottomRight - bottomLeft) * fracCR.x;
          float newValue = top + (bottom - top) * fracCR.y;
          setOutput(newValue);
        } else {
          // Compute the coordinators of nearest neighbor point.
          ivec2 sourceNearestCR = ivec2(floor(
            sourceFracIndexCR + vec2(0.5,0.5)));
          float newValue = getImage(b, sourceNearestCR.y, sourceNearestCR.x, d);
          setOutput(newValue);
        }
      }
    `}};var S3=r=>{let{inputs:e,backend:t,attrs:o}=r,{image:n,boxes:s,boxInd:i}=e,{cropSize:a,method:u,extrapolationValue:l}=o,c=new gp(n.shape,s.shape,a,u,l);return t.runWebGLProgram(c,[n,s,i],"float32")},iC={kernelName:ea,backendName:"webgl",kernelFunc:S3};var nn;(function(r){r.Prod="*",r.Sum="+"})(nn||(nn={}));var bi=class{constructor(e,t,o,n){this.op=e,this.outputShape=t,this.variableNames=["x"],this.customUniforms=[{name:"index",type:"float"}];let s=this.outputShape.length,i=this.op===nn.Prod?"1.0":"0.0",a=o?i:`getX(${aC(s,"coords",this.op)})`,u=this.outputShape[this.outputShape.length-1],l="",c="";o?(l=n?`end != ${u-1}`:"end != 0",c=n?"end + 1":"end - 1"):(l=n?`end + pow2 < ${u}`:"end >= pow2",c=n?"end + pow2":"end - pow2"),this.userCode=`
      void main() {
        ${J(s)} coords = getOutputCoords();
        int end = ${uC(s,"coords",this.op)};
        float val = ${a};
        int pow2 = int(pow(2.0, index));
        if (${l}) {
          int idx = ${c};
          ${uC(s,"coords",this.op)} = idx;
          val ${this.op}= getX(${aC(s,"coords",this.op)});
        }
        setOutput(val);
      }
    `}};function aC(r,e,t){if(r===1)return`${e}`;if(r===2)return`${e}.x, ${e}.y`;if(r===3)return`${e}.x, ${e}.y, ${e}.z`;if(r===4)return`${e}.x, ${e}.y, ${e}.z, ${e}.w`;throw new Error(`Cumulative ${t} for rank ${r} is not yet supported`)}function uC(r,e,t){if(r===1)return`${e}`;if(r===2)return`${e}.y`;if(r===3)return`${e}.z`;if(r===4)return`${e}.w`;throw new Error(`Cumulative ${t} for rank ${r} is not yet supported`)}function xp(r,e,t,o,n,s){let i=e.shape.length,a=I.getAxesPermutation([o],i),u=e;a!=null&&(u=Se({inputs:{x:e},backend:t,attrs:{perm:a}}));let l=I.getInnerMostAxes(1,i)[0];if(l!==i-1)throw new Error(`WebGL cumprod shader expects an inner-most axis=${e.shape.length-1} but got axis=${o}`);let c=u.shape[l],p=_e({inputs:{x:u},backend:t});for(let m=0;m<=Math.ceil(Math.log2(c))-1;m++){let f=new bi(r,u.shape,!1,s),d=[[m]],g=p;p=t.runWebGLProgram(f,[p],p.dtype,d),t.disposeIntermediateTensorInfo(g)}if(n){let m=new bi(r,u.shape,n,s),f=p;p=t.runWebGLProgram(m,[p],p.dtype),t.disposeIntermediateTensorInfo(f)}if(a!=null){let m=I.getUndoAxesPermutation(a),f=Se({inputs:{x:p},backend:t,attrs:{perm:m}});return t.disposeIntermediateTensorInfo(p),t.disposeIntermediateTensorInfo(u),f}return p}function C3(r){let{inputs:e,backend:t,attrs:o}=r,{x:n}=e,{axis:s,exclusive:i,reverse:a}=o;return xp(nn.Prod,n,t,s,i,a)}var lC={kernelName:Zi,backendName:"webgl",kernelFunc:C3};function N3(r){let{inputs:e,backend:t,attrs:o}=r,{x:n}=e,{axis:s,exclusive:i,reverse:a}=o;return xp(nn.Sum,n,t,s,i,a)}var cC={kernelName:Ji,backendName:"webgl",kernelFunc:N3};function E3(r){let{inputs:e,backend:t,attrs:o}=r,{x:n,weights:s}=e,{size:i,binaryOutput:a}=o;if(n.shape.length===1){let u=t.readSync(n.dataId),l=t.readSync(s.dataId),c=_c(u,l,s.dtype,s.shape,i);return t.makeTensorInfo([i],s.dtype,c)}else if(n.shape.length===2){let u=t.bufferSync(n),l=t.bufferSync(s),c=j1(u,l,i,a);return t.makeTensorInfo(c.shape,s.dtype,c.values)}throw new Error(`Error in denseBincount: input must be at most rank 2, but got rank${n.shape.length}.`)}var pC={kernelName:ta,backendName:"webgl",kernelFunc:E3};var yp=class{constructor(e,t,o){this.variableNames=["x"],this.outputShape=[],this.outputShape=e,this.blockSize=t,this.dataFormat=o,this.userCode=`
    void main() {
      ivec4 coords = getOutputCoords();
      int b = coords[0];
      int h = ${this.getHeightCoordString()};
      int w = ${this.getWidthCoordString()};
      int d = ${this.getDepthCoordString()};

      int in_h = h / ${t};
      int offset_h = imod(h, ${t});
      int in_w = w / ${t};
      int offset_w = imod(w, ${t});
      int offset_d = (offset_h * ${t} + offset_w) *
        ${this.getOutputDepthSize()};
      int in_d = d + offset_d;

      float result = ${this.getInputSamplingString()};
      setOutput(result);
    }
  `}getHeightCoordString(){return this.dataFormat==="NHWC"?"coords[1]":"coords[2]"}getWidthCoordString(){return this.dataFormat==="NHWC"?"coords[2]":"coords[3]"}getDepthCoordString(){return this.dataFormat==="NHWC"?"coords[3]":"coords[1]"}getOutputDepthSize(){return this.dataFormat==="NHWC"?this.outputShape[3]:this.outputShape[1]}getInputSamplingString(){return this.dataFormat==="NHWC"?"getX(b, in_h, in_w, in_d)":"getX(b, in_d, in_h, in_w)"}};function I3(r){let{inputs:e,backend:t,attrs:o}=r,{x:n}=e,{blockSize:s,dataFormat:i}=o,a=n.shape[0],u=i==="NHWC"?n.shape[1]:n.shape[2],l=i==="NHWC"?n.shape[2]:n.shape[3],c=i==="NHWC"?n.shape[3]:n.shape[1],p=u*s,m=l*s,f=c/(s*s),d=i==="NHWC"?[a,p,m,f]:[a,f,p,m],g=new yp(d,s,i);return t.runWebGLProgram(g,[n],n.dtype)}var mC={kernelName:ra,backendName:"webgl",kernelFunc:I3};var vs=class{constructor(e,t=!1,o=null,n=!1,s=!1){this.variableNames=["x","W"],this.customUniforms=[{name:"pads",type:"ivec2"},{name:"strides",type:"ivec2"},{name:"dilations",type:"ivec2"},{name:"inDims",type:"ivec2"}],this.outputShape=e.outShape,this.enableShapeUniforms=he(this.outputShape.length);let i=e.filterHeight,a=e.filterWidth,u=e.outChannels/e.inChannels,l="",c="";o&&(n?l=`float activation(float a) {
          float b = getPreluActivationWeightsAtOutCoords();
          ${o}
        }`:s?l=`float activation(float a) {
          float b = getLeakyreluAlphaAtOutCoords();
          ${o}
        }`:l=`
          float activation(float x) {
            ${o}
          }
        `,c="result = activation(result);");let p=t?"result += getBiasAtOutCoords();":"";t&&this.variableNames.push("bias"),n&&this.variableNames.push("preluActivationWeights"),s&&this.variableNames.push("leakyreluAlpha"),this.userCode=`
      ${l}

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords.x;
        ivec2 xRCCorner = coords.yz * strides - pads;
        int d2 = coords.w;
        int d1 = d2 / ${u};
        int q = d2 - d1 * ${u};

        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        // Convolve x(?, ?, d1) with w(:, :, d1, q) to get y(yR, yC, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        // TO DO(dsmilkov): Flatten the two for loops and vec4 the operations.
        for (int wR = 0; wR < ${i}; wR++) {
          int xR = xRCorner + wR * dilations[0];

          if (xR < 0 || xR >= inDims[0]) {
            continue;
          }

          for (int wC = 0; wC < ${a}; wC++) {
            int xC = xCCorner + wC * dilations[1];

            if (xC < 0 || xC >= inDims[1]) {
              continue;
            }

            float xVal = getX(batch, xR, xC, d1);
            float wVal = getW(wR, wC, d1, q);
            dotProd += xVal * wVal;
          }
        }

        float result = dotProd;
        ${p}
        ${c}
        setOutput(result);
      }
    `}};var Ts=class{constructor(e,t=!1,o=null,n=!1,s=!1){this.variableNames=["x","W"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"pads",type:"ivec2"},{name:"strides",type:"ivec2"},{name:"dilations",type:"ivec2"},{name:"inDims",type:"ivec2"}],this.outputShape=e.outShape,this.enableShapeUniforms=he(this.outputShape.length);let i=e.outChannels/e.inChannels,a=e.padInfo.left,u=e.strideWidth,l=e.dilationWidth,c=e.filterHeight,p=e.filterWidth,m=p,f=`
      int xR; int xC; int xCOffset;
      vec4 wTexel; vec4 previous; vec4 final;`;for(let x=0;x<p;x++)f+=`
          vec4 xTexelC${x*2};
          int xTexelC${x*2}Ready;
          vec4 xTexelC${x*2+1};
          int xTexelC${x*2+1}Ready;
          vec4 xC${x};`;f+=`
    for (int r = 0; r < ${c}; r++) {
      `;for(let x=0;x<p;x++)f+=`
          xTexelC${x*2} = vec4(0.0);
          xTexelC${x*2}Ready = 0;
          xTexelC${x*2+1} = vec4(0.0);
          xTexelC${x*2+1}Ready = 0;
          xC${x} = vec4(0.0);`;f+=`
        xR = xRCorner + r * dilations[0];
        if (xR >=0 && xR < inDims[0]) {
      `;for(let x=0;x<(m+1)/2;x++){let v=x*2;if(f+=`
          xC = xCCorner + ${v*l};
          `,u===1){if(v<p&&(a%2===1?(f+=`
                xCOffset = xC + 1;
                if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${v}Ready == 0) {
                  xTexelC${v} = getX(batch, xR, xCOffset, d1);

                  // Need to manually clear unused channels in case
                  // we're reading from recycled texture.
                  if (xCOffset + 1 >= inDims[1]) {
                    xTexelC${v}.zw = vec2(0.0);
                  }
                  xTexelC${v}Ready = 1;
                }
              `,l===1&&v>0?f+=`
                xC${v} = vec4(xTexelC${v-2}.zw, xTexelC${v}.xy);
                `:f+=`
                  xCOffset = xC + 1 - 2;

                  if (xCOffset >= 0 && xCOffset < inDims[1]) {
                    previous = getX(batch, xR, xCOffset, d1);

                    // Need to manually clear unused channels in case
                    // we're reading from recycled texture.
                    if (xCOffset + 1 >= inDims[1]) {
                      previous.zw = vec2(0.0);
                    }

                    xC${v} = vec4(previous.zw, xTexelC${v}.xy);
                  } else {
                    xC${v} = vec4(0.0, 0.0, xTexelC${v}.xy);
                  }
                  `):f+=`
                if (xC >= 0 && xC < inDims[1] && xTexelC${v}Ready == 0) {
                  xTexelC${v} = getX(batch, xR, xC, d1);
                  if (xC + 1 >= inDims[1]) {
                    xTexelC${v}.zw = vec2(0.0);
                  }
                  xTexelC${v}Ready = 1;
                }

                xC${v} = xTexelC${v};
                `,v+1<p)){let N=a%2===0?T.nearestLargerEven(l):l;l%2===0&&a%2===1||l%2!==0&&a%2!==1?(f+=`
                  xCOffset = xC + imod(pads[1], 2) + ${N};

                  if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${v+1}Ready == 0) {
                    xTexelC${v+1} = getX(batch, xR, xCOffset, d1);

                    // Need to manually clear unused channels in case
                    // we're reading from recycled texture.
                    if (xCOffset + 1 >= inDims[1]) {
                      xTexelC${v+1}.zw = vec2(0.0);
                    }
                    xTexelC${v+1}Ready = 1;
                  }
                  `,l>1?f+=`
                    xCOffset -= 2;
                    if (xCOffset >= 0 && xCOffset < inDims[1]) {
                     previous = getX(batch, xR, xCOffset, d1);
                     xC${v+1} = vec4(previous.zw, xTexelC${v+1}.xy);
                    } else {
                     xC${v+1} = vec4(0.0, 0.0, xTexelC${v+1}.xy);
                    }
                    `:f+=`
                    xC${v+1} = vec4(xTexelC${v}.zw, xTexelC${v+1}.xy);
                    `):N===1?f+=`
                    xC${v+1} = xTexelC${v};
                    `:f+=`
                    xCOffset = xC + ${N};

                    if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${v+1}Ready == 0) {
                      xTexelC${v+1} = getX(batch, xR, xCOffset, d1);
                      if (xCOffset + 1 >= inDims[1]) {
                        xTexelC${v+1}.zw = vec2(0.0);
                      }
                      xTexelC${v+1}Ready = 1;
                    }

                    xC${v+1} = xTexelC${v+1};
                    `}}else v<p&&(a%2===1?(f+=`
                xCOffset = xC + 1 - strides[1];
                if(xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${v}Ready == 0) {
                  xTexelC${v} = getX(batch, xR, xCOffset, d1);
                  // Need to manually clear unused channels in case
                  // we're reading from recycled texture.
                  if (xCOffset + 1 >= inDims[1]) {
                    xTexelC${v}.zw = vec2(0.0);
                  }
                  xTexelC${v}Ready = 1;
                }

                if(xC + 1 >= 0 && xC + 1 < inDims[1] && xTexelC${v+1}Ready == 0) {
                  xTexelC${v+1} = getX(batch, xR, xC + 1, d1);
                  // Need to manually clear unused channels in case
                  // we're reading from recycled texture.
                  if (xC + 2 >= inDims[1]) {
                    xTexelC${v+1}.zw = vec2(0.0);
                  }
                  xTexelC${v+1}Ready = 1;
                }

                xC${v} = vec4(xTexelC${v}.zw, xTexelC${v+1}.zw);
              `,v+1<p&&(f+=`
                  final = vec4(0.0);
                  xCOffset = xC + 1 + strides[1];
                  if(xCOffset >= 0 && xCOffset < inDims[1]) {
                    final = getX(batch, xR, xCOffset, d1);
                  }
                  xC${v+1} = vec4(xTexelC${v+1}.xy, final.xy);
                `)):(f+=`
                if(xC >= 0 && xC < inDims[1] && xTexelC${v}Ready == 0) {
                  xTexelC${v} = getX(batch, xR, xC, d1);
                  if (xC + 1 >= inDims[1]) {
                    xTexelC${v}.zw = vec2(0.0);
                  }
                  xTexelC${v}Ready = 1;
                }

                xCOffset = xC + strides[1];
                if(xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${v+1}Ready == 0) {
                  xTexelC${v+1} = getX(batch, xR, xCOffset, d1);
                  if (xCOffset + 1 >= inDims[1]) {
                    xTexelC${v+1}.zw = vec2(0.);
                  }
                  xTexelC${v+1}Ready = 1;
                }

                xC${v} = vec4(
                  xTexelC${v}.xy, xTexelC${v+1}.xy);
              `,v+1<p&&(f+=`
                  xC${v+1} = vec4(xTexelC${v}.zw, xTexelC${v+1}.zw);
                `)));v<p&&(f+=`
            wTexel = getW(r, ${v}, d1, q);
            dotProd += xC${v} * vec4(wTexel.xz, wTexel.xz);
          `,v+1<p&&(f+=`
              wTexel = getW(r, ${v+1}, d1, q);
              dotProd += xC${v+1} * vec4(wTexel.xz, wTexel.xz);
            `))}f+=`
    }
  `,f+=`
      }
    `;let d="",g="";o&&(n?d=`vec4 activation(vec4 a) {
          vec4 b = getPreluActivationWeightsAtOutCoords();
          ${o}
        }`:s?d=`vec4 activation(vec4 a) {
          vec4 b = getLeakyreluAlphaAtOutCoords();
          ${o}
        }`:d=`vec4 activation(vec4 x) {
          ${o}
        }`,g="result = activation(result);");let h=t?"result += getBiasAtOutCoords();":"";t&&this.variableNames.push("bias"),n&&this.variableNames.push("preluActivationWeights"),s&&this.variableNames.push("leakyreluAlpha"),this.userCode=`
      ${d}

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords.x;
        ivec2 xRCCorner = coords.yz * strides - pads;
        int d2 = coords.w;
        int d1 = d2 / ${i};
        int q = d2 - d1 * ${i};
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        //intialize dotProd with a small epsilon seems to reduce GPU accuracy loss.
        vec4 dotProd = vec4(0.000000000000001);

        ${f}

        vec4 result = dotProd - vec4(0.000000000000001);
        ${h}
        ${g}
        setOutput(result);
      }
    `}};function k3(r){let{inputs:e,backend:t,attrs:o}=r,{x:n,filter:s}=e,{strides:i,pad:a,dilations:u,dimRoundingMode:l}=o,c=u;c==null&&(c=[1,1]),T.assert(I.eitherStridesOrDilationsAreOne(i,c),()=>`Error in depthwiseConv2d: Either strides or dilations must be 1. Got strides ${i} and dilations '${c}'`);let p=I.computeConv2DInfo(n.shape,s.shape,i,c,a,l,!0),m;$().getBool("WEBGL_PACK_DEPTHWISECONV")&&p.strideWidth<=2&&p.outChannels/p.inChannels===1?m=new Ts(p):m=new vs(p);let f=[[p.padInfo.top,p.padInfo.left],[p.strideHeight,p.strideWidth],[p.dilationHeight,p.dilationWidth],[p.inHeight,p.inWidth]];return t.runWebGLProgram(m,[n,s],"float32",f)}var fC={kernelName:oa,backendName:"webgl",kernelFunc:k3};var bp=class{constructor(e){this.variableNames=["x","dy"],this.outputShape=e.filterShape;let t=e.strideHeight,o=e.strideWidth,n=e.padInfo.top,s=e.padInfo.left,i=e.outChannels/e.inChannels;this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int wR = coords.x;
        int wC = coords.y;
        int d1 = coords.z;
        int dm = coords.w;
        int d2 = d1 * ${i} + dm;

        float dotProd = 0.0;

        // TO DO: Vec4 over the batch size
        for (int b = 0; b < ${e.batchSize}; b++) {
          for (int yR = 0; yR < ${e.outHeight}; yR++) {
            int xR = wR + yR * ${t} - ${n};

            if (xR < 0 || xR >= ${e.inHeight}) {
              continue;
            }

            for (int yC = 0; yC < ${e.outWidth}; yC++) {
              int xC = wC + yC * ${o} - ${s};

              if (xC < 0 || xC >= ${e.inWidth}) {
                continue;
              }

              float dyValue = getDy(b, yR, yC, d2);
              float xValue = getX(b, xR, xC, d1);
              dotProd += (xValue * dyValue);
            }
          }
        }
        setOutput(dotProd);
      }
    `}},wp=class{constructor(e){this.variableNames=["dy","W"],this.outputShape=e.inShape;let t=e.filterHeight,o=e.filterWidth,n=e.strideHeight,s=e.strideWidth,i=t-1-e.padInfo.top,a=o-1-e.padInfo.left,u=e.outChannels/e.inChannels;this.userCode=`
      const ivec2 pads = ivec2(${i}, ${a});

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d1 = coords[3];
        ivec2 dyCorner = coords.yz - pads;
        int dyRCorner = dyCorner.x;
        int dyCCorner = dyCorner.y;

        float dotProd = 0.0;

        for (int wR = 0; wR < ${t}; wR++) {
          float dyR = float(dyRCorner + wR) / ${n}.0;

          if (dyR < 0.0 || dyR >= ${e.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          int wRPerm = ${t} - 1 - wR;

          for (int wC = 0; wC < ${o}; wC++) {
            float dyC = float(dyCCorner + wC) / ${s}.0;

            if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            int wCPerm = ${o} - 1 - wC;

            // TO DO: Vec4 over the channelMul
            for (int dm = 0; dm < ${u}; dm++) {
              int d2 = d1 * ${u} + dm;
              float xValue = getDy(batch, idyR, idyC, d2);
              float wValue = getW(wRPerm, wCPerm, d1, dm);
              dotProd += xValue * wValue;
            }
          }
        }
        setOutput(dotProd);
      }
    `}};function $3(r){let{inputs:e,backend:t,attrs:o}=r,{x:n,dy:s}=e,{strides:i,dilations:a,pad:u,dimRoundingMode:l,filterShape:c}=o,p=I.computeConv2DInfo(n.shape,c,i,a,u,l,!0),m=new bp(p);return t.runWebGLProgram(m,[n,s],"float32")}var dC={kernelName:na,backendName:"webgl",kernelFunc:$3};function R3(r){let{inputs:e,backend:t,attrs:o}=r,{dy:n,filter:s}=e,{strides:i,dilations:a,pad:u,dimRoundingMode:l,inputShape:c}=o,p=I.computeConv2DInfo(c,s.shape,i,a,u,l,!0),m=new wp(p);return t.runWebGLProgram(m,[n,s],"float32")}var hC={kernelName:sa,backendName:"webgl",kernelFunc:R3};var vp=class{constructor(e){this.variableNames=["X"],this.outputShape=[e,e],this.userCode=`
      void main() {
          ivec2 coords = getOutputCoords();
          float val = coords[0] == coords[1] ? getX(coords[0]) : 0.0;
          setOutput(val);
      }
    `}};function A3(r){let{inputs:e,backend:t}=r,{x:o}=e,n=[...o.shape,...o.shape],s=T.sizeFromShape(o.shape),i=L({inputs:{x:o},backend:t,attrs:{shape:[s]}}),a=new vp(s),u=t.runWebGLProgram(a,[i],i.dtype),l=L({inputs:{x:u},backend:t,attrs:{shape:n}});return t.disposeIntermediateTensorInfo(i),t.disposeIntermediateTensorInfo(u),l}var gC={kernelName:ia,backendName:"webgl",kernelFunc:A3};var Tp=class{constructor(e){this.variableNames=["x","W"],this.outputShape=e.outShape;let{inHeight:t,inWidth:o,padInfo:n,strideHeight:s,strideWidth:i,filterHeight:a,filterWidth:u,dilationHeight:l,dilationWidth:c}=e,{top:p,left:m}=n;this.userCode=`
      const ivec2 strides = ivec2(${s}, ${i});
      const ivec2 pads = ivec2(${p}, ${m});
      const float neg_infinity = -3.4e38;

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords.x;
        int d1 = coords.w;
        ivec2 outTopLeftCorner =
            coords.yz * strides - pads;
        int hBeg = outTopLeftCorner.x;
        int wBeg = outTopLeftCorner.y;

        float curVal = neg_infinity;
        for (int h = 0; h < ${a}; h++) {
          int hIn = hBeg + h * ${l};

          if (hIn >= 0 && hIn < ${t}) {
            for (int w = 0; w < ${u}; w++) {
              int wIn = wBeg + w * ${c};

              if (wIn >= 0 && wIn < ${o}) {
                float xVal = getX(batch, hIn, wIn, d1);
                float wVal = getW(h, w, d1);

                float val = xVal + wVal;
                if (val > curVal) {
                  curVal = val;
                }
              }
            }
          }
        }

        float result = curVal;
        setOutput(result);
      }
    `}};function _3(r){let{inputs:e,backend:t,attrs:o}=r,{x:n,filter:s}=e,{strides:i,pad:a,dilations:u}=o,l=I.computeDilation2DInfo(n.shape,s.shape,i,a,"NHWC",u),c,p=new Tp(l);c=t.runWebGLProgram(p,[n,s],"float32");let m=L({inputs:{x:c},backend:t,attrs:{shape:l.outShape}});return t.disposeIntermediateTensorInfo(c),m}var xC={kernelName:aa,backendName:"webgl",kernelFunc:_3};function D3(r){let{inputs:e,backend:t,attrs:o}=r,{equation:n}=o,s=e,{allDims:i,summedDims:a,idDims:u}=I.decodeEinsumEquation(n,s.length);I.checkEinsumDimSizes(i.length,u,s);let{path:l,steps:c}=I.getEinsumComputePath(a,u),p=c.length,m=null,f=i.length,d=[];for(let g=0;g<p;++g){for(let h of c[g]){let{permutationIndices:x,expandDims:v}=I.getEinsumPermutation(f,u[h]),N;I.isIdentityPermutation(x)?N=s[h]:(N=Se({inputs:{x:s[h]},backend:t,attrs:{perm:x}}),d.push(N));let E=N.shape.slice();for(let k=0;k<v.length;++k)E.splice(v[k],0,1);T.arraysEqual(N.shape,E)||(N=L({inputs:{x:N},backend:t,attrs:{shape:E}}),d.push(N)),m===null?m=N:(m=xi({inputs:{a:N,b:m},backend:t}),d.push(m))}g<p-1&&(l[g]>=0&&(m=tn({inputs:{x:m},backend:t,attrs:{axis:l[g]-(i.length-f),keepDims:!1}}),d.push(m)),f--)}for(let g of d)g!==m&&t.disposeIntermediateTensorInfo(g);return m}var yC={kernelName:la,backendName:"webgl",kernelFunc:D3};var O3="return (x >= 0.0) ? x : (exp(x) - 1.0);",F3=`
  vec4 result;

  result.r = (x.r >= 0.0) ? x.r : (exp(x.r) - 1.0);
  result.g = (x.g >= 0.0) ? x.g : (exp(x.g) - 1.0);
  result.b = (x.b >= 0.0) ? x.b : (exp(x.b) - 1.0);
  result.a = (x.a >= 0.0) ? x.a : (exp(x.a) - 1.0);

  return result;
`,P3=W({opSnippet:O3,packedOpSnippet:F3}),bC={kernelName:"Elu",backendName:"webgl",kernelFunc:P3};var L3="return (b >= 0.0) ? a : a * (b + 1.0);",B3=`
  vec4 bGTEZero = vec4(greaterThanEqual(b, vec4(0.)));
  return (bGTEZero * a) + ((vec4(1.0) - bGTEZero) * (a * (b + vec4(1.0))));
`,M3=r=>{let{inputs:e,backend:t}=r,{dy:o,y:n}=e,s=$().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new Ft(B3,o.shape,n.shape):new Tt(L3,o.shape,n.shape);return t.runWebGLProgram(s,[o,n],o.dtype)},wC={kernelName:_h,backendName:"webgl",kernelFunc:M3};var V3=`
  return vec4(equal(a, b));
`,U3="return float(a == b);",G3=me({opSnippet:U3,packedOpSnippet:V3,dtype:"bool",cpuKernelImpl:eT}),vC={kernelName:gn,backendName:"webgl",kernelFunc:G3};var z3=`
  // Error function is calculated approximately with elementary function.
  // See "Handbook of Mathematical Functions with Formulas,
  // Graphs, and Mathematical Tables", Abramowitz and Stegun.
  float p = ${I.ERF_P};
  float a1 = ${I.ERF_A1};
  float a2 = ${I.ERF_A2};
  float a3 = ${I.ERF_A3};
  float a4 = ${I.ERF_A4};
  float a5 = ${I.ERF_A5};

  float sign = sign(x);
  x = abs(x);
  float t = 1.0 / (1.0 + p * x);
  return sign * (1.0 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*exp(-x*x));
`,W3=W({opSnippet:z3}),TC={kernelName:"Erf",backendName:"webgl",kernelFunc:W3};var H3=Qt+`
  return exp(x);
`,K3=`
  vec4 result = exp(x);
  bvec4 isNaN = isnan(x);
  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,sh=W({opSnippet:H3,packedOpSnippet:K3,cpuKernelImpl:tT,dtype:"float32"}),SC={kernelName:"Exp",backendName:"webgl",kernelFunc:sh};function Sp(r){let{inputs:e,attrs:t,backend:o}=r,{dim:n}=t,{input:s}=e,i=s.shape.length,a=s.shape.slice(),u=n;return n<0&&(T.assert(-(i+1)<=n,()=>`Axis must be in the interval [${-(i+1)}, ${i}]`),u=i+n+1),a.splice(u,0,1),L({inputs:{x:s},backend:o,attrs:{shape:a}})}var CC={kernelName:ca,backendName:"webgl",kernelFunc:Sp};var NC="return exp(x) - 1.0;",q3=W({opSnippet:NC,packedOpSnippet:NC,cpuKernelImpl:rT}),EC={kernelName:xn,backendName:"webgl",kernelFunc:q3};var wi=class{constructor(e,t,o){this.variableNames=["real","imag"];let n=t[1];this.outputShape=t;let s=o?`2.0 * ${Math.PI}`:`-2.0 * ${Math.PI}`,i=o?`${n}.0`:"1.0",a;if(e==="real")a="return real * expR - imag * expI;";else if(e==="imag")a="return real * expI + imag * expR;";else throw new Error(`FFT component must be either "real" or "imag", got ${e}.`);this.userCode=`
      const float exponentMultiplier = ${s};

      float unaryOpComplex(float real, float expR, float imag, float expI) {
        ${a}
      }

      float mulMatDFT(int batch, int index) {
        float indexRatio = float(index) / float(${n});
        float exponentMultiplierTimesIndexRatio =
            exponentMultiplier * indexRatio;

        float result = 0.0;

        for (int i = 0; i < ${n}; i++) {
          // x = (-2|2 * PI / N) * index * i;
          float x = exponentMultiplierTimesIndexRatio * float(i);
          float expR = cos(x);
          float expI = sin(x);
          float real = getReal(batch, i);
          float imag = getImag(batch, i);

          result +=
              unaryOpComplex(real, expR, imag, expI) / ${i};
        }

        return result;
      }

      void main() {
        ivec2 coords = getOutputCoords();
        setOutput(mulMatDFT(coords[0], coords[1]));
      }
    `}};function Cp(r,e,t){let o=t.texData.get(r.dataId),n=T.sizeFromShape(r.shape),s=r.shape[r.shape.length-1],i=n/s,a=L({inputs:{x:r},backend:t,attrs:{shape:[i,s]}}),u=a.shape,l=new wi("real",u,e),c=new wi("imag",u,e),p=[{dataId:o.complexTensorInfos.real.dataId,dtype:o.complexTensorInfos.real.dtype,shape:u},{dataId:o.complexTensorInfos.imag.dataId,dtype:o.complexTensorInfos.imag.dtype,shape:u}],m=t.runWebGLProgram(l,p,"float32"),f=t.runWebGLProgram(c,p,"float32"),d=St({inputs:{real:m,imag:f},backend:t});t.disposeIntermediateTensorInfo(m),t.disposeIntermediateTensorInfo(f);let g=L({inputs:{x:d},backend:t,attrs:{shape:r.shape}});return t.disposeIntermediateTensorInfo(a),t.disposeIntermediateTensorInfo(d),g}function X3(r){let{inputs:e,backend:t}=r,{input:o}=e;return Cp(o,!1,t)}var IC={kernelName:"FFT",backendName:"webgl",kernelFunc:X3};var Np=class{constructor(e,t){this.outputShape=[],this.customUniforms=[{name:"value",type:"float"}],this.variableNames=["x"],this.outputShape=e,this.userCode=`
      void main() {
        // Input can be obtained from uniform value.
        setOutput(value);
      }
    `}};function Ur(r){let{backend:e,attrs:t}=r,{shape:o,value:n}=t,{dtype:s}=t;if(s=s||T.inferDtype(n),s==="string"){let i=T.getArrayFromDType(s,T.sizeFromShape(o));return i.fill(n),e.makeTensorInfo(o,s,i)}else{let i=new Np(o,n),a=[[n]];return e.runWebGLProgram(i,[],s,a)}}var kC={kernelName:pa,backendName:"webgl",kernelFunc:Ur};var Ep=class{constructor(e){this.variableNames=["Image"],this.outputShape=[];let t=e[2];this.outputShape=e,this.userCode=`
        void main() {
          ivec4 coords = getOutputCoords();
          int x = coords[2];

          int coordX = ${t} - x - 1;
          float outputValue;
          if(coordX >= 0 && coordX < ${t}) {
            outputValue = getImage(coords[0], coords[1], coordX, coords[3]);
          } else {
            outputValue = getImage(coords[0], coords[1], coords[2], coords[3]);
          }
          setOutput(outputValue);
        }
    `}};var $C={kernelName:ma,backendName:"webgl",kernelFunc:({inputs:r,backend:e})=>{let{image:t}=r,o=e,n=new Ep(t.shape);return o.runWebGLProgram(n,[t],t.dtype)}};var RC="return floor(x);",j3=W({opSnippet:RC,packedOpSnippet:RC,cpuKernelImpl:oT}),AC={kernelName:yn,backendName:"webgl",kernelFunc:j3};var Y3=`
  float s = sign(a) * sign(b);
  int ia = round(a);
  int ib = round(b);
  if (ib != 0) {
    // Windows (D3D) wants guaranteed non-zero int division at compile-time.
    return float(idiv(ia, ib, s));
  } else {
    return NAN;
  }
`,Q3=`
  ivec4 ia = round(a);
  ivec4 ib = round(b);
  bvec4 cond = notEqual(ib, ivec4(0));
  ivec4 result = ivec4(0);
  vec4 s = sign(a) * sign(b);

  // Windows (D3D) wants guaranteed non-zero int division at compile-time.
  if (cond[0]) {
    result[0] = idiv(ia[0], ib[0], s[0]);
  }
  if (cond[1]) {
    result[1] = idiv(ia[1], ib[1], s[1]);
  }
  if (cond[2]) {
    result[2] = idiv(ia[2], ib[2], s[2]);
  }
  if (cond[3]) {
    result[3] = idiv(ia[3], ib[3], s[3]);
  }
  return vec4(result);
`,Z3=me({opSnippet:Y3,packedOpSnippet:Q3,dtype:"int32"}),_C={kernelName:bn,backendName:"webgl",kernelFunc:Z3};var Ip=class{constructor(e){this.variableNames=["A"];let t=Ee(),[o,n]=e;this.outputShape=e,this.userCode=`
      void main() {
        ivec3 coords = getOutputCoords();
        int texR = coords[0];
        int texC = coords[1];
        int depth = coords[2];
        vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${n}.0, ${o}.0);

        vec4 values = ${t.texture2D}(A, uv);
        float value;
        if (depth == 0) {
          value = values.r;
        } else if (depth == 1) {
          value = values.g;
        } else if (depth == 2) {
          value = values.b;
        } else if (depth == 3) {
          value = values.a;
        }

        setOutput(floor(value * 255.0 + 0.5));
      }
    `}};var kp=class{constructor(e){this.variableNames=["A"],this.packedInputs=!1,this.packedOutput=!0;let t=Ee(),[o,n]=e;this.outputShape=e,this.userCode=`
      void main() {
        ivec3 coords = getOutputCoords();
        int texR = coords[0];
        int texC = coords[1];
        int depth = coords[2];

        vec4 result = vec4(0.);

        for(int row=0; row<=1; row++) {
          for(int col=0; col<=1; col++) {
            texC = coords[1] + row;
            depth = coords[2] + col;

            vec2 uv = (vec2(texC, texR) + halfCR) /
                       vec2(${n}.0, ${o}.0);
            vec4 values = ${t.texture2D}(A, uv);
            float value;
            if (depth == 0) {
              value = values.r;
            } else if (depth == 1) {
              value = values.g;
            } else if (depth == 2) {
              value = values.b;
            } else if (depth == 3) {
              value = values.a;
            }

            result[row * 2 + col] = floor(value * 255.0 + 0.5);
          }
        }

        ${t.output} = result;
      }
    `}};var DC={kernelName:_s,backendName:"webgl",kernelFunc:J3},Ss,ih=$().getBool("CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU");function J3(r){let{inputs:e,backend:t,attrs:o}=r,{pixels:n}=e,{numChannels:s}=o,i=typeof HTMLVideoElement<"u"&&n instanceof HTMLVideoElement,a=typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement,[u,l]=i?[n.videoWidth,n.videoHeight]:[n.width,n.height],c=[l,u],p=[l,u,s];if(a||i){let g=$().getBool("CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU");(Ss==null||g!==ih)&&(ih=g,Ss=document.createElement("canvas").getContext("2d",{willReadFrequently:ih})),Ss.canvas.width=u,Ss.canvas.height=l,Ss.drawImage(n,0,0,u,l),n=Ss.canvas}let m=t.makeTensorInfo(c,"int32");t.texData.get(m.dataId).usage=je.PIXELS,t.gpgpu.uploadPixelDataToTexture(t.getTexture(m.dataId),n);let f=$().getBool("WEBGL_PACK")?new kp(p):new Ip(p),d=t.runWebGLProgram(f,[m],"int32");return t.disposeData(m.dataId),d}function eB(r){let{inputs:e,backend:t,attrs:o}=r,{x:n,filter:s,bias:i,preluActivationWeights:a}=e,{strides:u,pad:l,dataFormat:c,dilations:p,dimRoundingMode:m,activation:f,leakyreluAlpha:d}=o,g=I.convertConv2DDataFormat(c),h=I.computeConv2DInfo(n.shape,s.shape,u,p,l,m,!1,g),x,v=[],N=i!=null,E=a!=null,k=f==="leakyrelu",R=()=>{let _=[n,s],O=(F,B)=>{if(B==="NCHW"&&F.shape.length===1&&F.shape[0]!==1){let M=L({inputs:{x:F},backend:t,attrs:{shape:[F.shape[0],1,1]}});return v.push(M),M}return F};if(N&&_.push(O(i,c)),E&&_.push(O(a,c)),k){let F=t.makeTensorInfo([],"float32",T.createScalarValue(d,"float32"));_.push(F),v.push(F)}return _};if(h.filterHeight===1&&h.filterWidth===1&&h.dilationHeight===1&&h.dilationWidth===1&&h.strideHeight===1&&h.strideWidth===1&&(h.padInfo.type==="SAME"||h.padInfo.type==="VALID"))x=lp({x:n,filter:s,convInfo:h,backend:t,bias:i,activation:f,preluActivationWeights:a,leakyreluAlpha:d});else if(h.strideWidth<=2&&g==="channelsLast"&&$().getBool("WEBGL_EXP_CONV")){let _=f?Mr(f,!0):null,O=new ws(h,N,_,E,k),F=[[h.padInfo.top,h.padInfo.left],[h.strideHeight,h.strideWidth],[h.dilationHeight,h.dilationWidth],[h.inHeight,h.inWidth]],B=R();x=t.runWebGLProgram(O,B,"float32",F)}else if($().getBool("WEBGL_CONV_IM2COL"))x=cp({x:n,filter:s,convInfo:h,backend:t,bias:i,activation:f,preluActivationWeights:a,leakyreluAlpha:d});else{let _=f?Mr(f,!1):null,O=new bs(h,N,_,E,k),F=R();x=t.runWebGLProgram(O,F,"float32")}let A=L({inputs:{x},backend:t,attrs:{shape:h.outShape}});return v.push(x),v.forEach(_=>t.disposeIntermediateTensorInfo(_)),A}var OC={kernelName:Os,backendName:"webgl",kernelFunc:eB};function tB(r){let{inputs:e,backend:t,attrs:o}=r,{x:n,filter:s,bias:i,preluActivationWeights:a}=e,{strides:u,pad:l,dilations:c,dimRoundingMode:p,activation:m,leakyreluAlpha:f}=o,d=[],g=c;g==null&&(g=[1,1]),T.assert(I.eitherStridesOrDilationsAreOne(u,g),()=>`Error in depthwiseConv2d: Either strides or dilations must be 1. Got strides ${u} and dilations '${g}'`);let h=I.computeConv2DInfo(n.shape,s.shape,u,g,l,p,!0),x=$().getBool("WEBGL_PACK_DEPTHWISECONV")&&h.strideWidth<=2&&h.outChannels/h.inChannels===1,v=m?Mr(m,x):null,N=[n,s],E=i!=null,k=a!=null,R=m==="leakyrelu";if(E&&N.push(i),k&&N.push(a),R){let F=t.makeTensorInfo([],"float32",T.createScalarValue(f,"float32"));N.push(F),d.push(F)}let A;x?A=new Ts(h,E,v,k,R):A=new vs(h,E,v,k,R);let _=[[h.padInfo.top,h.padInfo.left],[h.strideHeight,h.strideWidth],[h.dilationHeight,h.dilationWidth],[h.inHeight,h.inWidth]],O=t.runWebGLProgram(A,N,"float32",_);return d.forEach(F=>t.disposeIntermediateTensorInfo(F)),O}var FC={kernelName:Fs,backendName:"webgl",kernelFunc:tB};var $p=class{constructor(e,t,o,n){this.sliceDim=e,this.strides=t,this.paramsShape=n,this.variableNames=["x","indices"],this.outputShape=o;let s=J(o.length),i=`
    int index;`;for(let a=0;a<this.sliceDim;a++)i+=`
          index = round(getIndices(coords[0], ${a}));
          out_of_bounds = out_of_bounds || index < 0;
          out_of_bounds = out_of_bounds || index >= ${this.paramsShape[a]};
          flattenIndex += index * ${this.strides[a]};`;this.userCode=`
         void main() {
          ${s} coords = getOutputCoords();
          int flattenIndex = 0;
          bool out_of_bounds = false;

          ${i}

          setOutput(out_of_bounds ? 0.0 : getX(flattenIndex, coords[1]));
        }
      `}};function rB(r){let{inputs:e,backend:t}=r,{params:o,indices:n}=e,s=n.shape,i=s[s.length-1],a=T.sizeFromShape(o.shape),[u,l,c,p]=I.prepareAndValidate(o,n),m=L({inputs:{x:n},backend:t,attrs:{shape:[l,i]}}),f=L({inputs:{x:o},backend:t,attrs:{shape:[T.sizeFromShape(o.shape)/c,c]}});if(t.shouldExecuteOnCPU([o,n])||o.dtype==="string"){let x=t.readSync(n.dataId),v=t.bufferSync(o),N=nT(x,v,o.dtype,l,i,c,p,o.shape,a);return t.makeTensorInfo(u,o.dtype,N.values)}let d=new $p(i,p,[l,c],o.shape),g=t.runWebGLProgram(d,[f,m],f.dtype),h=L({inputs:{x:g},backend:t,attrs:{shape:u}});return t.disposeIntermediateTensorInfo(m),t.disposeIntermediateTensorInfo(f),t.disposeIntermediateTensorInfo(g),h}var PC={kernelName:ha,backendName:"webgl",kernelFunc:rB};var Rp=class{constructor(e,t){this.variableNames=["A","indices"],this.outputShape=t,this.rank=t.length;let o=J(this.rank),n=oB(e,2);this.userCode=`
      void main() {
        ${o} resRC = getOutputCoords();
        int index = int(getIndices(resRC.x, resRC.z));
        float inBounds = (index >= 0) && (index < ${e[2]}) ? 1.0 : 0.0;
        setOutput(inBounds * getA(${n}));
      }
    `}};function oB(r,e){let t=["resRC.x","resRC.y","resRC.z","resRC.w"],o=[];for(let n=0;n<r.length;n++)n===2?o.push("index"):o.push(`${t[n]}`);return o.join()}function ah(r){let{inputs:e,backend:t,attrs:o}=r,{x:n,indices:s}=e,{axis:i,batchDims:a}=o,u=T.parseAxisParam(i,n.shape)[0];if($().get("DEBUG")){let v=t.readSync(s.dataId),N=n.shape[u];for(let E=0;E<v.length;++E){let k=v[E];T.assert(k<=N-1&&k>=0,()=>`GatherV2: the index value ${k} is not in [0, ${N-1}]`)}}let l=I.segment_util.collectGatherOpShapeInfo(n,s,u,a),c=T.sizeFromShape(s.shape),p=[],m=L({inputs:{x:n},backend:t,attrs:{shape:[l.batchSize,l.outerSize,l.dimSize,l.sliceSize]}}),f=L({inputs:{x:s},backend:t,attrs:{shape:[l.batchSize,c/l.batchSize]}});p.push(m),p.push(f);let d=[l.batchSize,l.outerSize,c/l.batchSize,l.sliceSize];if(t.shouldExecuteOnCPU([n,s])||n.dtype==="string"){let v=t.bufferSync(f),N=t.bufferSync(m),E=sT(N,v,d);return p.forEach(k=>t.disposeIntermediateTensorInfo(k)),t.makeTensorInfo(l.outputShape,E.dtype,E.values)}let g=new Rp(m.shape,d),h=t.runWebGLProgram(g,[m,f],m.dtype);p.push(h);let x=L({inputs:{x:h},backend:t,attrs:{shape:l.outputShape}});return p.forEach(v=>t.disposeIntermediateTensorInfo(v)),x}var LC={kernelName:da,backendName:"webgl",kernelFunc:ah};var nB="return float(a > b);",sB=`
  return vec4(greaterThan(a, b));
`,iB=me({opSnippet:nB,packedOpSnippet:sB,cpuKernelImpl:iT,dtype:"bool"}),BC={kernelName:wn,backendName:"webgl",kernelFunc:iB};var aB="return float(a >= b);",uB=`
  return vec4(greaterThanEqual(a, b));
`,lB=me({opSnippet:aB,packedOpSnippet:uB,dtype:"bool",cpuKernelImpl:aT}),MC={kernelName:vn,backendName:"webgl",kernelFunc:lB};function cB(r){let{inputs:e,backend:t}=r,{input:o}=e;return Cp(o,!0,t)}var VC={kernelName:ga,backendName:"webgl",kernelFunc:cB};var pB="return float(!isnan(x) && !isinf(x));",mB=W({opSnippet:pB,dtype:"bool"}),UC={kernelName:ya,backendName:"webgl",kernelFunc:mB};var fB="return float(isinf(x));",dB=W({opSnippet:fB,dtype:"bool"}),GC={kernelName:ba,backendName:"webgl",kernelFunc:dB};var hB="return float(isnan(x));",gB=W({opSnippet:hB,dtype:"bool"}),zC={kernelName:wa,backendName:"webgl",kernelFunc:gB};var xB="return float(a < b);",yB=`
  return vec4(lessThan(a, b));
`,bB=me({opSnippet:xB,packedOpSnippet:yB,cpuKernelImpl:uT,dtype:"bool"}),WC={kernelName:Tn,backendName:"webgl",kernelFunc:bB};var wB="return float(a <= b);",vB=`
  return vec4(lessThanEqual(a, b));
`,TB=me({opSnippet:wB,packedOpSnippet:vB,cpuKernelImpl:lT,dtype:"bool"}),HC={kernelName:Sn,backendName:"webgl",kernelFunc:TB};function SB(r){let{backend:e,attrs:t}=r,{start:o,stop:n,num:s}=t,i=cT(o,n,s);return e.makeTensorInfo([i.length],"float32",i)}var KC={kernelName:Ta,backendName:"webgl",kernelFunc:SB};var CB=Qt+`
  return x < 0.0 ? 0./0. : log(x);
`,NB=`
  vec4 result = log(x);
  bvec4 isNaN = isnan(x);
  result.r = isNaN.r ? x.r : (x.r < 0.0 ? 0./0. : result.r);
  result.g = isNaN.g ? x.g : (x.g < 0.0 ? 0./0. : result.g);
  result.b = isNaN.b ? x.b : (x.b < 0.0 ? 0./0. : result.b);
  result.a = isNaN.a ? x.a : (x.a < 0.0 ? 0./0. : result.a);
  return result;
`,EB=W({opSnippet:CB,packedOpSnippet:NB,cpuKernelImpl:pT}),qC={kernelName:"Log",backendName:"webgl",kernelFunc:EB};var IB=Qt+`
  return log(1.0 + x);
`,kB=W({opSnippet:IB}),XC={kernelName:Sa,backendName:"webgl",kernelFunc:kB};var $B="return float(a >= 1.0 && b >= 1.0);",RB=`
  return vec4(
    vec4(greaterThanEqual(a, vec4(1.0))) *
    vec4(greaterThanEqual(b, vec4(1.0))));
`,AB=me({opSnippet:$B,packedOpSnippet:RB,dtype:"bool"}),jC={kernelName:Ca,backendName:"webgl",kernelFunc:AB};var _B="return float(!(x >= 1.0));",DB=W({opSnippet:_B}),YC={kernelName:Na,backendName:"webgl",kernelFunc:DB};var OB="return float(a >= 1.0 || b >= 1.0);",FB=`
  return min(
    vec4(greaterThanEqual(a, vec4(1.0))) +
    vec4(greaterThanEqual(b, vec4(1.0))),
    vec4(1.0));
`,PB=me({opSnippet:OB,packedOpSnippet:FB,dtype:"bool"}),QC={kernelName:Ea,backendName:"webgl",kernelFunc:PB};var Ap=class{constructor(e,t,o,n,s){this.variableNames=["x"],this.outputShape=[];let i=t,a=e[3]-1;this.outputShape=e;let u,l=`float(${o}) + float(${n}) * sum`;s===.5?u=`inversesqrt(${l})`:s===1?u=`1.0/(${l})`:u=`exp(log(${l}) * float(-${s}));`,this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int r = coords[1];
        int c = coords[2];
        int d = coords[3];
        float x = getX(b, r, c, d);
        float sum = 0.0;
        for (int j = -${i}; j <= ${i}; j++) {
          int idx = d + j;
          if (idx >= 0 && idx <=  ${a}) {
            float z = getX(b, r, c, idx);
            sum += z * z;
          }
        }
        float val = x * ${u};
        setOutput(val);
      }
    `}};var _p=class{constructor(e,t,o,n,s){this.variableNames=["x"],this.outputShape=[],this.packedInputs=!0,this.packedOutput=!0;let i=t,a=e[3]-1;this.outputShape=e;let u,l=`float(${o}) + float(${n}) * sum`;s===.5?u=`inversesqrt(${l})`:s===1?u=`1.0/(${l})`:u=`exp(log(${l}) * float(-${s}));`,this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords.x;
        int r = coords.y;
        int c = coords.z;
        int d = coords.w;

        bool hasNextCol = d < ${this.outputShape[3]};
        bool hasNextRow = c < ${this.outputShape[2]};

        vec4 sum = vec4(0.);
        vec4 xFragAtOutputCoords = getX(b, r, c, d);

        vec4 xAtOutputCoords = vec4(
          getChannel(xFragAtOutputCoords, vec2(c, d)),
          hasNextCol ?
            getChannel(xFragAtOutputCoords, vec2(c, d + 1)) : 0.0,
          hasNextRow ?
            getChannel(xFragAtOutputCoords , vec2(c + 1, d)) : 0.0,
          (hasNextRow && hasNextCol) ?
            getChannel(xFragAtOutputCoords, vec2(c + 1, d + 1)) : 0.0
        );

        int firstChannel = d - ${i};
        vec2 cache = vec2(0.);
        if(firstChannel >= 0){
          vec4 firstChannelFrag = getX(b, r, c, firstChannel);
          cache.x = getChannel(firstChannelFrag, vec2(c, firstChannel));
            if(hasNextRow){
              cache.y = getChannel(firstChannelFrag, vec2(c + 1, firstChannel));
            }
        }

        ivec2 depth = ivec2(d, d + 1);
        for (int j = - ${i}; j <= ${i}; j++) {
          ivec2 idx = depth + j;
          bvec2 aboveLowerBound = greaterThanEqual(idx, ivec2(0));
          bvec2 belowUpperBound = lessThanEqual(idx, ivec2(${a}));

          bool depthInRange = aboveLowerBound.x && belowUpperBound.x;
          bool depthPlusOneInRange = aboveLowerBound.y && belowUpperBound.y;

          if(depthInRange || depthPlusOneInRange){
            vec4 z = vec4(0.);
            vec4 xFragAtCurrentDepth;
            z.xz = cache.xy;
            if(depthPlusOneInRange && hasNextCol){
              xFragAtCurrentDepth = idx.y != d ?
                getX(b, r, c, idx.y) : xFragAtOutputCoords;
              z.y = getChannel(xFragAtCurrentDepth, vec2(c, idx.y));
              if(hasNextRow){
                z.w = getChannel(xFragAtCurrentDepth, vec2(c + 1, idx.y));
              }
            }
            cache.xy = z.yw;
            sum += z * z;
          }
        }
        vec4 result = xAtOutputCoords * ${u};
        setOutput(result);
      }
    `}};var LB=r=>{let{inputs:e,backend:t,attrs:o}=r,{x:n}=e,{depthRadius:s,bias:i,alpha:a,beta:u}=o,l=$().getBool("WEBGL_PACK_NORMALIZATION")?new _p(n.shape,s,i,a,u):new Ap(n.shape,s,i,a,u);return t.runWebGLProgram(l,[n],n.dtype)},ZC={kernelName:"LRN",backendName:"webgl",kernelFunc:LB};var Dp=class{constructor(e,t,o,n,s){this.variableNames=["inputImage","outputImage","dy"],this.outputShape=[],this.outputShape=e,this.depth=e[3],this.depthRadius=t,this.bias=o,this.alpha=n,this.beta=s,this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int r = coords[1];
        int c = coords[2];

        float result = 0.0;
        for (int d = 0; d < ${this.depth}; ++d) {
          int depthBegin = int(max(0.0, float(d - ${t})));
          int depthEnd = int(min(float(${this.depth}),
              float(d + ${t} + 1)));

          const int MIN_DEPTH_BEGIN = 0;
          const int MAX_DEPTH_END = ${this.depth};

          float norm = 0.0;
          for (int k = MIN_DEPTH_BEGIN; k < MAX_DEPTH_END; ++k) {
            if (k < depthBegin){
              continue;
            }
            else if (k >= depthBegin && k < depthEnd) {
              norm += getInputImage(b, r, c, k) * getInputImage(b, r, c, k);
            }
            else {
              break;
            }
          }

          norm = float(${n}) * norm + float(${o});

          for(int k = MIN_DEPTH_BEGIN; k < MAX_DEPTH_END; ++k){
            if (k < depthBegin){
              continue;
            }
            else if (k >= depthBegin && k < depthEnd){
              float dyi = -2.0 * float(${n})
                * float(${s})
                * getInputImage(b, r, c, k) * getOutputImage(b, r, c, d)
                / norm;
              if (k == d) {
                dyi += pow(norm, -1.0 * ${s});
              }
              if (k == coords[3]) {
                dyi *= getDy(b, r, c, d);
                result += dyi;
              }
            }
            else {
              break;
            }
          }
      }
      setOutput(result);
      }
    `}};var BB=r=>{let{inputs:e,backend:t,attrs:o}=r,{x:n,y:s,dy:i}=e,{depthRadius:a,bias:u,alpha:l,beta:c}=o,p=new Dp(n.shape,a,u,l,c);return t.runWebGLProgram(p,[n,s,i],n.dtype)},JC={kernelName:Dh,backendName:"webgl",kernelFunc:BB};function eN(r,e,t,o){let n=T.sizeFromShape(e),i=T.sizeFromShape(r.shape)/n,a=L({inputs:{x:r},attrs:{shape:[i,n]},backend:o}),u=Lt(a,r.dtype,"max",o),l=L({inputs:{x:u},attrs:{shape:t},backend:o});return o.disposeIntermediateTensorInfo(a),o.disposeIntermediateTensorInfo(u),l}function uh(r){let{inputs:e,backend:t,attrs:o}=r,{x:n}=e,{reductionIndices:s,keepDims:i}=o,a=n.shape.length,u=T.parseAxisParam(s,n.shape),l=u,c=I.getAxesPermutation(l,a),p=c!=null,m=t.shouldExecuteOnCPU([n]),f=n;if(p){if(m){let N=t.texData.get(f.dataId).values,E=new Array(a);for(let A=0;A<E.length;A++)E[A]=n.shape[c[A]];let k=en(N,n.shape,n.dtype,c,E);f=t.makeTensorInfo(E,n.dtype);let R=t.texData.get(f.dataId);R.values=k}else f=ho(n,c,t);l=I.getInnerMostAxes(l.length,a)}I.assertAxesAreInnerMostDims("max",l,a);let[d,g]=I.computeOutAndReduceShapes(f.shape,l),h=d;i&&(h=I.expandShapeToKeepDim(d,u));let x;if(m){let N=t.texData.get(f.dataId).values,E=mT(N,T.sizeFromShape(g),h,n.dtype);x=t.makeTensorInfo(h,n.dtype);let k=t.texData.get(x.dataId);k.values=E}else x=eN(f,g,h,t);return p&&t.disposeIntermediateTensorInfo(f),x}var tN={kernelName:"Max",backendName:"webgl",kernelFunc:uh};var MB=gs+`
  return max(a, b);
`,VB=`
  vec4 result = vec4(max(a, b));
  bvec4 isNaNA = isnan(a);
  bvec4 isNaNB = isnan(b);
  bvec4 isNaN = bvec4(isNaNA.x || isNaNB.x, isNaNA.y || isNaNB.y, isNaNA.z || isNaNB.z, isNaNA.w || isNaNB.w);
  `+Pt+`
  return result;
`,UB=me({opSnippet:MB,packedOpSnippet:VB,cpuKernelImpl:fT}),rN={kernelName:Cn,backendName:"webgl",kernelFunc:UB};function GB(r){let{inputs:e,backend:t,attrs:o}=r,{x:n}=e;Sr(n,"maxPool");let{filterSize:s,strides:i,pad:a,dimRoundingMode:u}=o,l=1;T.assert(I.eitherStridesOrDilationsAreOne(i,l),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${i} and dilations '${l}'`);let c=I.computePool2DInfo(n.shape,s,i,l,a,u);if(c.filterWidth===1&&c.filterHeight===1&&T.arraysEqual(c.inShape,c.outShape))return _e({inputs:{x:n},backend:t});let p=new ir(c,"max",!1);return t.runWebGLProgram(p,[n],n.dtype)}var oN={kernelName:Ia,backendName:"webgl",kernelFunc:GB};function zB(r){let{inputs:e,backend:t,attrs:o}=r,{x:n}=e,{filterSize:s,strides:i,pad:a,dataFormat:u,dimRoundingMode:l}=o,c=[1,1,1],p=I.computePool3DInfo(n.shape,s,i,c,a,l,u),m=new go(p,"max",!1);return t.runWebGLProgram(m,[n],n.dtype)}var nN={kernelName:ka,backendName:"webgl",kernelFunc:zB};var Op=class{constructor(e){this.variableNames=["dy","maxPos"],this.outputShape=e.inShape;let t=e.strideHeight,o=e.strideWidth,n=e.dilationHeight,s=e.effectiveFilterHeight,i=e.effectiveFilterWidth,a=s-1-e.padInfo.top,u=i-1-e.padInfo.left,l=s*i-1;this.userCode=`
      const ivec2 pads = ivec2(${a}, ${u});

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];

        ivec2 dyRCCorner = coords.yz - pads;
        int dyRCorner = dyRCCorner.x;
        int dyCCorner = dyRCCorner.y;

        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${s};
          wR += ${n}) {
          float dyR = float(dyRCorner + wR) / ${t}.0;

          if (dyR < 0.0 || dyR >= ${e.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          for (int wC = 0; wC < ${i}; wC++) {
            float dyC = float(dyCCorner + wC) / ${o}.0;

            if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            float dyValue = getDy(b, idyR, idyC, d);
            int maxPosValue = ${l} - int(getMaxPos(b, idyR, idyC, d));

            // Get the current value, check it against the value from the
            // position matrix.
            int curPosValue = wR * ${i} + wC;
            float mask = float(maxPosValue == curPosValue ? 1.0 : 0.0);

            dotProd += dyValue * mask;
          }
        }
        setOutput(dotProd);
      }
    `}},Fp=class{constructor(e){this.variableNames=["dy","maxPos"],this.outputShape=e.inShape;let t=e.strideDepth,o=e.strideHeight,n=e.strideWidth,s=e.dilationDepth,i=e.dilationHeight,a=e.dilationWidth,u=e.effectiveFilterDepth,l=e.effectiveFilterHeight,c=e.effectiveFilterWidth,p=u-1-e.padInfo.front,m=l-1-e.padInfo.top,f=c-1-e.padInfo.left,d=u*l*c-1;this.userCode=`
      const ivec3 pads = ivec3(${p}, ${m}, ${f});

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int ch = coords.u;

        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;
        int dyDCorner = dyCorner.x;
        int dyRCorner = dyCorner.y;
        int dyCCorner = dyCorner.z;

        // Convolve dy(?, ?, ?, ch) with pos mask(:, :, :, d) to get
        // dx(xD, xR, xC, ch).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;

        for (int wD = 0; wD < ${u};
           wD += ${s}) {
          float dyD = float(dyDCorner + wD) / ${t}.0;

          if (dyD < 0.0 || dyD >= ${e.outDepth}.0 || fract(dyD) > 0.0) {
            continue;
          }
          int idyD = int(dyD);

          for (int wR = 0; wR < ${l};
              wR += ${i}) {
            float dyR = float(dyRCorner + wR) / ${o}.0;

            if (dyR < 0.0 || dyR >= ${e.outHeight}.0 ||
                fract(dyR) > 0.0) {
              continue;
            }
            int idyR = int(dyR);

            for (int wC = 0; wC < ${c};
                wC += ${a}) {
              float dyC = float(dyCCorner + wC) / ${n}.0;

              if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                  fract(dyC) > 0.0) {
                continue;
              }
              int idyC = int(dyC);

              float dyValue = getDy(batch, idyD, idyR, idyC, ch);
              int maxPosValue = ${d} -
                  int(getMaxPos(batch, idyD, idyR, idyC, ch));

              // Get the current value, check it against the value from the
              // position matrix.
              int curPosValue =
                  wD * ${l} * ${c} +
                  wR * ${c} + wC;
              float mask = float(maxPosValue == curPosValue ? 1.0 : 0.0);

              dotProd += dyValue * mask;
            }
          }
        }
        setOutput(dotProd);
      }
    `}};function WB(r){let{inputs:e,backend:t,attrs:o}=r,{dy:n,input:s}=e,i=s,{filterSize:a,strides:u,pad:l,dimRoundingMode:c}=o,p=[1,1,1],m=I.computePool3DInfo(i.shape,a,u,p,l,c),f=new go(m,"max",!0),d=t.runWebGLProgram(f,[i],i.dtype),g=new Fp(m),h=t.runWebGLProgram(g,[n,d],i.dtype);return t.disposeIntermediateTensorInfo(d),h}var sN={kernelName:Fh,backendName:"webgl",kernelFunc:WB};function HB(r){let{inputs:e,backend:t,attrs:o}=r,{dy:n,input:s,output:i}=e,a=s;Sr([s,i],"maxPoolGrad");let{filterSize:u,strides:l,pad:c,dimRoundingMode:p}=o,m=I.computePool2DInfo(a.shape,u,l,1,c,p),f=!0,d=new ir(m,"max",f),g=t.runWebGLProgram(d,[a],a.dtype),h=new Op(m),x=t.runWebGLProgram(h,[n,g],a.dtype);return t.disposeIntermediateTensorInfo(g),x}var iN={kernelName:Oh,backendName:"webgl",kernelFunc:HB};function aN(r,e,t,o){let n=new ir(t,"max",!1),s=o.runWebGLProgram(n,[r],"float32");n=new ir(t,"max",!0,!0,e);let i=o.runWebGLProgram(n,[r],"float32");return[s,i]}var uN={kernelName:$a,backendName:"webgl",kernelFunc:({inputs:r,attrs:e,backend:t})=>{let{x:o}=r,{filterSize:n,strides:s,pad:i,includeBatchInIndex:a}=e,u=t;T.assert(o.shape.length===4,()=>`Error in maxPool: input must be rank 4 but got rank ${o.shape.length}.`);let l=[1,1];T.assert(I.eitherStridesOrDilationsAreOne(s,l),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${s} and dilations '${l}'`);let c=I.computePool2DInfo(o.shape,n,s,l,i),[p,m]=aN(o,a,c,u);return[p,m]}};function lN(r,e,t,o){let n=T.sizeFromShape(e),i=T.sizeFromShape(r.shape)/n,a=L({inputs:{x:r},attrs:{shape:[i,n]},backend:o}),u=Lt(a,"float32","mean",o),l=L({inputs:{x:u},attrs:{shape:t},backend:o});return o.disposeIntermediateTensorInfo(a),o.disposeIntermediateTensorInfo(u),l}var cN={kernelName:Ra,backendName:"webgl",kernelFunc:({inputs:r,attrs:e,backend:t})=>{let{x:o}=r,{keepDims:n,axis:s}=e,i=t,a=o.shape.length,u=T.parseAxisParam(s,o.shape),l=u,c=I.getAxesPermutation(l,a),p=c!=null,m=i.shouldExecuteOnCPU([o]),f=[],d=o;if(p){if(m){let E=i.texData.get(d.dataId).values,k=new Array(a);for(let _=0;_<k.length;_++)k[_]=o.shape[c[_]];let R=en(E,o.shape,o.dtype,c,k);d=i.makeTensorInfo(k,o.dtype);let A=i.texData.get(d.dataId);A.values=R}else d=ho(o,c,i);f.push(d),l=I.getInnerMostAxes(l.length,a)}I.assertAxesAreInnerMostDims("sum",l,a);let[g,h]=I.computeOutAndReduceShapes(d.shape,l),x=g;n&&(x=I.expandShapeToKeepDim(g,u));let v=lN(d,h,x,i);for(let N of f)i.disposeIntermediateTensorInfo(N);return v}};function KB(r){let{inputs:e,backend:t,attrs:o}=r,{x:n}=e,{axis:s,keepDims:i}=o,a=n.shape.length,u=T.parseAxisParam(s,n.shape),l=u,c=I.getAxesPermutation(l,a),p=n;c!=null&&(p=Se({inputs:{x:n},backend:t,attrs:{perm:c}}),l=I.getInnerMostAxes(l.length,n.shape.length)),I.assertAxesAreInnerMostDims("min",l,a);let[m,f]=I.computeOutAndReduceShapes(p.shape,l),d=T.sizeFromShape(f),g=L({inputs:{x:p},backend:t,attrs:{shape:[-1,d]}}),h=Lt(g,g.dtype,"min",t),x;if(i){let v=I.expandShapeToKeepDim(m,u);x=L({inputs:{x:h},backend:t,attrs:{shape:v}})}else x=L({inputs:{x:h},backend:t,attrs:{shape:m}});return t.disposeIntermediateTensorInfo(g),t.disposeIntermediateTensorInfo(h),c!=null&&t.disposeIntermediateTensorInfo(p),x}var pN={kernelName:"Min",backendName:"webgl",kernelFunc:KB};var qB=gs+`
  return min(a, b);
`,XB=`
  vec4 result = vec4(min(a, b));
  bvec4 isNaNA = isnan(a);
  bvec4 isNaNB = isnan(b);
  bvec4 isNaN = bvec4(isNaNA.x || isNaNB.x, isNaNA.y || isNaNB.y, isNaNA.z || isNaNB.z, isNaNA.w || isNaNB.w);
  `+Pt+`
  return result;
`,jB=me({opSnippet:qB,packedOpSnippet:XB,cpuKernelImpl:dT}),mN={kernelName:Nn,backendName:"webgl",kernelFunc:jB};var Pp=class{constructor(e,t,o){this.variableNames=["x"],this.outputShape=t.map((c,p)=>c[0]+e[p]+c[1]);let n=e.length,s=J(n),i=t.map(c=>c[0]).join(","),a=t.map((c,p)=>c[0]+e[p]).join(","),u=["coords[0]","coords[1]","coords[2]","coords[3]"].slice(0,n),l=o==="reflect"?0:1;if(n===1){this.userCode=`
        int start = ${i};
        int end = ${a};

        void main() {
          int outC = getOutputCoords();
          if (outC < start) {
            outC = start * 2 - outC - ${l};
          } else if(outC >= end) {
            outC = (end - 1) * 2 - outC + ${l};
          }
          setOutput(getX(outC - start));
        }
      `;return}this.userCode=`
      ${s} start = ${s}(${i});
      ${s} end = ${s}(${a});

      void main() {
        ${s} outC = getOutputCoords();
        for (int i = 0; i < ${n}; i++) {
          if (outC[i] < start[i]) {
            outC[i] = start[i] * 2 - outC[i] - ${l};
          } else if(outC[i] >= end[i]) {
            outC[i] = (end[i] - 1) * 2 - outC[i] + ${l};
          }
        }
        ${s} coords = outC - start;
        setOutput(getX(${u}));
      }
    `}};var Lp=class{constructor(e,t,o){this.variableNames=["x"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=t.map((d,g)=>d[0]+e[g]+d[1]);let n=e.length,s=J(n),i=t.map(d=>d[0]).join(","),a=t.map((d,g)=>d[0]+e[g]).join(","),u=Ae("rc",n),l=Ae("source",n),c=`${u[n-1]} < ${this.outputShape[n-1]}`,p=n===1?"source":`vec2(${l.slice(-2).join()})`,m=o==="reflect"?0:1,f="";if(n===1){let d=`
        ${s} source = rc;
        if (source < start) {
          source = start * 2 - source - ${m};
        } else if (source >= end) {
          source = (end - 1) * 2 - source + ${m};
        }
        source -= start;
      `;f=`
        ${s} rc = outputLoc;
        ${d}
        result[0] = getChannel(getX(${l.join()}), ${p});
        ${u[n-1]} += 1;
        if(${c}) {
          ${d}
          result[1] = getChannel(getX(${l.join()}), ${p});
        }
      `}else{let d=`
        ${s} source = rc;
        ${s} lt = ${s}(lessThan(source, start));
        ${s} gte = ${s}(greaterThanEqual(source, end));
        ${s} orig = 1 - (lt + gte);
        source = orig * source +
                lt * (start * 2 - source - ${m}) +
                gte * ((end - 1) * 2 - source + ${m});
        source -= start;
      `;f=`
        ${s} rc = outputLoc;
        ${d}
        result[0] = getChannel(getX(${l.join()}), ${p});
        ${u[n-1]} += 1;
        if(${c}) {
          ${d}
          result[1] = getChannel(getX(${l.join()}), ${p});
        }
        rc = outputLoc;
        ${u[n-2]} += 1;
        if(${u[n-2]} < ${this.outputShape[n-2]}) {
          ${d}
          result[2] = getChannel(getX(${l.join()}), ${p});
          ${u[n-1]} += 1;
          if(${c}) {
            ${d}
            result[3] = getChannel(getX(${l.join()}), ${p});
          }
        }
      `}this.userCode=`
      const ${s} start = ${s}(${i});
      const ${s} end = ${s}(${a});

      void main() {
        ${s} outputLoc = getOutputCoords();
        vec4 result = vec4(0.);
        ${f}
        setOutput(result);
      }
    `}};var YB=({inputs:r,backend:e,attrs:t})=>{let{x:o}=r,{paddings:n,mode:s}=t,i=$().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new Lp(o.shape,n,s):new Pp(o.shape,n,s);return e.runWebGLProgram(i,[o],o.dtype)},fN={kernelName:Aa,backendName:"webgl",kernelFunc:YB};var QB=`if (b == 0.0) return NAN;
  return mod(a, b);`,ZB=`
  vec4 result = mod(a, b);
  bvec4 isNaN = equal(b, vec4(0.0));
  `+Pt+`
  return result;
`,JB=me({opSnippet:QB,packedOpSnippet:ZB}),dN={kernelName:"Mod",backendName:"webgl",kernelFunc:JB};var Bp=class{constructor(e,t,o){this.variableNames=["probs"],this.customUniforms=[{name:"seed",type:"float"}],this.outputShape=[e,o],this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];

        float r = random(seed);
        float cdf = 0.0;

        for (int i = 0; i < ${t-1}; i++) {
          cdf += getProbs(batch, i);

          if (r < cdf) {
            setOutput(float(i));
            return;
          }
        }

        // If no other event happened, last event happened.
        setOutput(float(${t-1}));
      }
    `}};var eM=`
if (a == b) {
  return 1.0;
};
return a / b;`,tM=`
  // vec4 one = vec4(equal(a, b));
  // return one + (vec4(1.0) - one) * a / b;
  vec4 result = a / b;
  if(a.x == b.x) {
    result.x = 1.;
  }
  if(a.y == b.y) {
    result.y = 1.;
  }
  if(a.z == b.z) {
    result.z = 1.;
  }
  if(a.w == b.w) {
    result.w = 1.;
  }

  return result;
`,lh=me({opSnippet:eM,packedOpSnippet:tM,checkOutOfBounds:!0}),hN={kernelName:ua,backendName:"webgl",kernelFunc:lh};var gN="return a - b;",ch=me({opSnippet:gN,packedOpSnippet:gN,supportsComplex:!0,cpuKernelImpl:FT}),xN={kernelName:"Sub",backendName:"webgl",kernelFunc:ch};function ph(r){let{inputs:e,backend:t,attrs:o}=r,{logits:n}=e,{dim:s}=o,i=T.parseAxisParam([s],n.shape),a=uh({inputs:{x:n},backend:t,attrs:{reductionIndices:i,keepDims:!1}}),u=I.expandShapeToKeepDim(a.shape,i),l=L({inputs:{x:a},backend:t,attrs:{shape:u}}),c=ch({inputs:{a:n,b:l},backend:t}),p=sh({inputs:{x:c},backend:t}),m=tn({inputs:{x:p},backend:t,attrs:{axis:i,keepDims:!1}}),f=L({inputs:{x:m},backend:t,attrs:{shape:u}}),d=lh({inputs:{a:p,b:f},backend:t});return t.disposeIntermediateTensorInfo(a),t.disposeIntermediateTensorInfo(l),t.disposeIntermediateTensorInfo(c),t.disposeIntermediateTensorInfo(p),t.disposeIntermediateTensorInfo(m),t.disposeIntermediateTensorInfo(f),d}var yN={kernelName:lu,backendName:"webgl",kernelFunc:ph};function rM(r){let{inputs:e,backend:t,attrs:o}=r,{logits:n}=e,{numSamples:s,seed:i,normalized:a}=o,u=a?n:ph({inputs:{logits:n},backend:t,attrs:{dim:n.shape.length-1}}),l=u.shape[0],c=u.shape[1],p=new Bp(l,c,s),m=[[i]],f=t.runWebGLProgram(p,[u],"int32",m);return a||t.disposeIntermediateTensorInfo(u),f}var bN={kernelName:_a,backendName:"webgl",kernelFunc:rM};var oM=Le+`
  return -x;
`,nM=`
  vec4 result = -x;
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`;function sM(r){let{inputs:e,backend:t}=r,{x:o}=e;if(t.shouldExecuteOnCPU([o])){let s=t.texData.get(o.dataId),[i,a]=gT(s.values,o.shape,o.dtype);return t.makeTensorInfo(a,o.dtype,i)}let n;return $().getBool("WEBGL_PACK_UNARY_OPERATIONS")?n=new vt(o.shape,nM):n=new He(o.shape,oM),t.runWebGLProgram(n,[o],o.dtype)}var wN={kernelName:"Neg",backendName:"webgl",kernelFunc:sM};var iM=wr.nonMaxSuppressionV3Impl;function aM(r){I.warn("tf.nonMaxSuppression() in webgl locks the UI thread. Call tf.nonMaxSuppressionAsync() instead");let{inputs:e,backend:t,attrs:o}=r,{boxes:n,scores:s}=e,{maxOutputSize:i,iouThreshold:a,scoreThreshold:u}=o,l=t.readSync(n.dataId),c=t.readSync(s.dataId),{selectedIndices:p}=iM(l,c,i,a,u);return t.makeTensorInfo([p.length],"int32",new Int32Array(p))}var vN={kernelName:Da,backendName:"webgl",kernelFunc:aM};var uM=wr.nonMaxSuppressionV4Impl;function lM(r){I.warn("tf.nonMaxSuppression() in webgl locks the UI thread. Call tf.nonMaxSuppressionAsync() instead");let{inputs:e,backend:t,attrs:o}=r,{boxes:n,scores:s}=e,{maxOutputSize:i,iouThreshold:a,scoreThreshold:u,padToMaxOutputSize:l}=o,c=t.readSync(n.dataId),p=t.readSync(s.dataId),{selectedIndices:m,validOutputs:f}=uM(c,p,i,a,u,l);return[t.makeTensorInfo([m.length],"int32",new Int32Array(m)),t.makeTensorInfo([],"int32",new Int32Array([f]))]}var TN={kernelName:Oa,backendName:"webgl",kernelFunc:lM};var cM=wr.nonMaxSuppressionV5Impl;function pM(r){I.warn("tf.nonMaxSuppression() in webgl locks the UI thread. Call tf.nonMaxSuppressionAsync() instead");let{inputs:e,backend:t,attrs:o}=r,{boxes:n,scores:s}=e,{maxOutputSize:i,iouThreshold:a,scoreThreshold:u,softNmsSigma:l}=o,c=t.readSync(n.dataId),p=t.readSync(s.dataId),m=i,f=a,d=u,g=l,{selectedIndices:h,selectedScores:x}=cM(c,p,m,f,d,g);return[t.makeTensorInfo([h.length],"int32",new Int32Array(h)),t.makeTensorInfo([x.length],"float32",new Float32Array(x))]}var SN={kernelName:Fa,backendName:"webgl",kernelFunc:pM};var Mp=class{constructor(e,t,o,n){this.variableNames=["indices"],this.outputShape=[e,t],this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int index = round(getIndices(coords.x));
        setOutput(mix(float(${n}), float(${o}),
                      float(index == coords.y)));
      }
    `}};var mM=r=>{let{inputs:e,backend:t,attrs:o}=r,{indices:n}=e,{dtype:s,depth:i,onValue:a,offValue:u}=o,l=T.sizeFromShape(n.shape),c=new Mp(l,i,a,u),p=L({inputs:{x:n},backend:t,attrs:{shape:[l]}}),m=t.runWebGLProgram(c,[p],s);t.disposeIntermediateTensorInfo(p);let f=[...n.shape,i],d=L({inputs:{x:m},backend:t,attrs:{shape:f}});return t.disposeIntermediateTensorInfo(m),d},CN={kernelName:La,backendName:"webgl",kernelFunc:mM};function vi(r){let{inputs:e,backend:t}=r,{x:o}=e;if(o.dtype==="complex64"){let n=Vr({inputs:{input:o},backend:t}),s=vi({inputs:{x:n},backend:t}),i=on({inputs:{input:o},backend:t}),a=vi({inputs:{x:i},backend:t}),u=St({inputs:{real:s,imag:a},backend:t});return t.disposeIntermediateTensorInfo(n),t.disposeIntermediateTensorInfo(s),t.disposeIntermediateTensorInfo(i),t.disposeIntermediateTensorInfo(a),u}else return Ur({attrs:{shape:o.shape,dtype:o.dtype,value:o.dtype==="string"?"":0},backend:t})}var NN={kernelName:Nu,backendName:"webgl",kernelFunc:vi};function EN(r){let{inputs:e,backend:t}=r,{x:o}=e;if(o.dtype==="string")throw new Error("onesLike is not supported under string dtype");if(o.dtype==="complex64"){let n=Vr({inputs:{input:o},backend:t}),s=EN({inputs:{x:n},backend:t}),i=on({inputs:{input:o},backend:t}),a=vi({inputs:{x:i},backend:t}),u=St({inputs:{real:s,imag:a},backend:t});return t.disposeIntermediateTensorInfo(n),t.disposeIntermediateTensorInfo(s),t.disposeIntermediateTensorInfo(i),t.disposeIntermediateTensorInfo(a),u}else return Ur({attrs:{shape:o.shape,dtype:o.dtype,value:1},backend:t})}var IN={kernelName:Pa,backendName:"webgl",kernelFunc:EN};function fM(r){let{inputs:e,backend:t,attrs:o}=r,{axis:n}=o;if(e.length===1)return Sp({inputs:{input:e[0]},backend:t,attrs:{dim:n}});let s=e[0].shape,i=e[0].dtype;e.forEach(c=>{T.assertShapesMatch(s,c.shape,"All tensors passed to stack must have matching shapes"),T.assert(i===c.dtype,()=>"All tensors passed to stack must have matching dtypes")});let a=[],u=e.map(c=>{let p=Sp({inputs:{input:c},backend:t,attrs:{dim:n}});return a.push(p),p}),l=nh({inputs:u,backend:t,attrs:{axis:n}});return a.forEach(c=>t.disposeIntermediateTensorInfo(c)),l}var kN={kernelName:Ba,backendName:"webgl",kernelFunc:fM};var Vp=class{constructor(e,t,o){this.variableNames=["x"],this.customUniforms=[{name:"value",type:"float"}],this.outputShape=t.map((l,c)=>l[0]+e[c]+l[1]);let n=e.length,s=J(n),i=t.map(l=>l[0]).join(","),a=t.map((l,c)=>l[0]+e[c]).join(","),u=["coords[0]","coords[1]","coords[2]","coords[3]"].slice(0,n);if(n===1){this.userCode=`
        int start = ${i};
        int end = ${a};

        void main() {
          int outC = getOutputCoords();
          if (outC < start || outC >= end) {
            setOutput(value);
          } else {
            setOutput(getX(outC - start));
          }
        }
      `;return}this.userCode=`
      ${s} start = ${s}(${i});
      ${s} end = ${s}(${a});

      void main() {
        ${s} outC = getOutputCoords();
        if (any(lessThan(outC, start)) || any(greaterThanEqual(outC, end))) {
          setOutput(value);
        } else {
          ${s} coords = outC - start;
          setOutput(getX(${u}));
        }
      }
    `}};var Up=class{constructor(e,t,o){this.variableNames=["x"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"value",type:"float"}],this.outputShape=t.map((g,h)=>g[0]+e[h]+g[1]);let n=e.length,s=J(n),i=t.map(g=>g[0]).join(","),a=t.map((g,h)=>g[0]+e[h]).join(","),u=Ae("rc",n),l=Ae("source",n),c=`${u[n-1]} < ${this.outputShape[n-1]}`,p=n===1?"source":`vec2(${l.slice(-2).join()})`,m=[`${s} rc = outputLoc;`,`${u[n-1]} += 1;
       if(${c}) {
      `,n===1?"":`}
       rc = outputLoc;
       ${u[n-2]} += 1;
       if(${u[n-2]} < ${this.outputShape[n-2]}) {`,n===1?"":`  ${u[n-1]} += 1;
         if(${c}) {`],f=n===1?"rc < start || rc >= end":"any(lessThan(rc, start)) || any(greaterThanEqual(rc, end))",d="";for(let g=0,h=n===1?2:4;g<h;g++)d+=`
        ${m[g]}
        if (${f}) {
          result[${g}] = float(value);
        } else {
          ${s} source = rc - start;
          result[${g}] = getChannel(getX(${l.join()}), ${p});
        }
      `;d+=n===1?"} ":"}}",this.userCode=`
      const ${s} start = ${s}(${i});
      const ${s} end = ${s}(${a});

      void main() {
        ${s} outputLoc = getOutputCoords();
        vec4 result = vec4(0.);
        ${d}
        setOutput(result);
      }
    `}};var mh=r=>{let{inputs:e,backend:t,attrs:o}=r,{x:n}=e,{paddings:s,constantValue:i}=o;if(T.sizeFromShape(n.shape)===0){let l=s.map((c,p)=>c[0]+n.shape[p]+c[1]);return Ur({backend:t,attrs:{shape:l,value:i,dtype:n.dtype}})}let a=$().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new Up(n.shape,s,i):new Vp(n.shape,s,i),u=[[i]];return t.runWebGLProgram(a,[n],n.dtype,u)},$N={kernelName:Ma,backendName:"webgl",kernelFunc:mh};var dM=`
  if(a < 0.0 && floor(b) < b){
    return NAN;
  }
  if (b == 0.0) {
    return 1.0;
  }
  return (round(mod(b, 2.0)) != 1) ?
      pow(abs(a), b) : sign(a) * pow(abs(a), b);
`,hM=`
  // isModRound1 has 1 for components with round(mod(b, 2.0)) == 1, 0 otherwise.
  vec4 isModRound1 = vec4(equal(round(mod(b, 2.0)), ivec4(1)));
  vec4 multiplier = sign(a) * isModRound1 + (vec4(1.0) - isModRound1);
  vec4 result = multiplier * pow(abs(a), b);

  // Ensure that a^0 = 1, including 0^0 = 1 as this correspond to TF and JS
  bvec4 isExpZero = equal(b, vec4(0.0));
  result.r = isExpZero.r ? 1.0 : result.r;
  result.g = isExpZero.g ? 1.0 : result.g;
  result.b = isExpZero.b ? 1.0 : result.b;
  result.a = isExpZero.a ? 1.0 : result.a;

  bvec4 isNaN1 = lessThan(a, vec4(0.0));
  bvec4 isNaN2 = lessThan(floor(b), b);
  bvec4 isNaN = bvec4(isNaN1.x && isNaN2.x, isNaN1.y && isNaN2.y, isNaN1.z && isNaN2.z, isNaN1.w && isNaN2.w);
  `+Pt+`
  return result;
`,gM=me({opSnippet:dM,packedOpSnippet:hM}),RN={kernelName:"Pow",backendName:"webgl",kernelFunc:gM};function xM(r){let{inputs:e,backend:t,attrs:o}=r,{x:n}=e,{axis:s,keepDims:i}=o,a=n.shape.length,u=[],l=T.parseAxisParam(s,n.shape),c=l,p=I.getAxesPermutation(c,a),m=n;p!=null&&(m=Se({inputs:{x:n},backend:t,attrs:{perm:p}}),c=I.getInnerMostAxes(c.length,a),u.push(m)),I.assertAxesAreInnerMostDims("prod",c,a);let f;if(t.shouldExecuteOnCPU([m])){let d=t.texData.get(m.dataId).values,{outVals:g,outShape:h,outDtype:x}=yT(m.shape,m.dtype,d,c);f=t.makeTensorInfo(h,x,g)}else{let[d,g]=I.computeOutAndReduceShapes(m.shape,c),h=T.sizeFromShape(g),x=L({inputs:{x:m},backend:t,attrs:{shape:[-1,h]}}),v=Ro(n.dtype),N=Lt(x,v,"prod",t);f=L({inputs:{x:N},backend:t,attrs:{shape:d}}),u.push(x),u.push(N)}if(i){u.push(f);let d=I.expandShapeToKeepDim(f.shape,l);f=L({inputs:{x:f},backend:t,attrs:{shape:d}})}return u.forEach(d=>t.disposeIntermediateTensorInfo(d)),f}var AN={kernelName:$s,backendName:"webgl",kernelFunc:xM};function yM(r){let{inputs:e,backend:t,attrs:o}=r,{paramsNestedSplits:n,paramsDenseValues:s,indices:i}=e,{outputRaggedRank:a}=o,u=n.map(x=>t.readSync(x.dataId)),l=n.map(x=>x.shape),c=t.readSync(s.dataId),p=t.readSync(i.dataId),[m,f,d]=bT(u,l,c,s.shape,s.dtype,p,i.shape,a),g=m.map(x=>t.makeTensorInfo([x.length],"int32",x)),h=t.makeTensorInfo(d,s.dtype,f);return g.concat([h])}var _N={kernelName:Ua,backendName:"webgl",kernelFunc:yM};function bM(r){let{inputs:e,backend:t}=r,{starts:o,limits:n,deltas:s}=e,i=t.readSync(o.dataId),a=t.readSync(n.dataId),u=t.readSync(s.dataId),[l,c]=wT(i,o.shape,o.dtype,a,n.shape,u,s.shape),p=t.makeTensorInfo([l.length],"int32",l),m=t.makeTensorInfo([c.length],o.dtype,c);return[p,m]}var DN={kernelName:Ga,backendName:"webgl",kernelFunc:bM};function wM(r){let{inputs:e,backend:t,attrs:o}=r,{shape:n,values:s,defaultValue:i,rowPartitionTensors:a}=e,{rowPartitionTypes:u}=o,l=t.readSync(n.dataId),c=t.readSync(s.dataId),p=t.readSync(i.dataId),m=a.map(h=>t.readSync(h.dataId)),f=a.map(h=>h.shape),[d,g]=vT(l,n.shape,c,s.shape,s.dtype,p,i.shape,m,f,u);return t.makeTensorInfo(d,s.dtype,g)}var ON={kernelName:za,backendName:"webgl",kernelFunc:wM};var fh=r=>{let{backend:e,attrs:t}=r,{start:o,stop:n,step:s,dtype:i}=t,a=TT(o,n,s,i);return e.makeTensorInfo([a.length],i,a)},FN={kernelName:Wa,backendName:"webgl",kernelFunc:fh};var vM="return 1.0 / x;",TM=W({opSnippet:vM}),PN={kernelName:Ha,backendName:"webgl",kernelFunc:TM};var SM=Le+`
  return (x < 0.0) ? 0.0 : x;
`,CM=`
  vec4 result = x * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,NM=W({opSnippet:SM,packedOpSnippet:CM}),LN={kernelName:Ka,backendName:"webgl",kernelFunc:NM};var EM=Le+`
  return (x < 0.0) ? 0.0 : min(6.0, x);
`,IM=`
  vec4 result = min(x, vec4(6.)) * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,kM=W({opSnippet:EM,packedOpSnippet:IM}),BN={kernelName:Ya,backendName:"webgl",kernelFunc:kM};var Gp=class{constructor(e,t,o,n,s){this.variableNames=["A"],this.outputShape=[];let[i,a,u,l]=e;this.outputShape=[i,t,o,l];let c=[n&&t>1?a-1:a,n&&o>1?u-1:u],p=[n&&t>1?t-1:t,n&&o>1?o-1:o],m;s?m="(vec2(yRC) + vec2(0.5)) * effectiveInputOverOutputRatioRC - vec2(0.5)":m="vec2(yRC) * effectiveInputOverOutputRatioRC",this.userCode=`
      const vec2 effectiveInputOverOutputRatioRC = vec2(
          ${c[0]/p[0]},
          ${c[1]/p[1]});
      const vec2 inputShapeRC = vec2(${a}.0, ${u}.0);

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        ivec2 yRC = coords.yz;

        // Fractional source index.
        vec2 sourceFracIndexRC = ${m};

        // Compute the four integer indices.
        ivec2 sourceFloorRC = ivec2(max(sourceFracIndexRC, vec2(0.0)));
        ivec2 sourceCeilRC = ivec2(
          min(inputShapeRC - 1.0, ceil(sourceFracIndexRC)));

        float topLeft = getA(b, sourceFloorRC.x, sourceFloorRC.y, d);
        float bottomLeft = getA(b, sourceCeilRC.x, sourceFloorRC.y, d);
        float topRight = getA(b, sourceFloorRC.x, sourceCeilRC.y, d);
        float bottomRight = getA(b, sourceCeilRC.x, sourceCeilRC.y, d);

        vec2 fracRC = sourceFracIndexRC - vec2(sourceFloorRC);

        float top = topLeft + (topRight - topLeft) * fracRC.y;
        float bottom = bottomLeft + (bottomRight - bottomLeft) * fracRC.y;
        float newValue = top + (bottom - top) * fracRC.x;

        setOutput(newValue);
      }
    `}};var zp=class{constructor(e,t,o,n,s){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=[];let[i,a,u,l]=e;this.outputShape=[i,t,o,l];let c=[n&&t>1?a-1:a,n&&o>1?u-1:u],p=[n&&t>1?t-1:t,n&&o>1?o-1:o],m;s?m="(vec3(yRC) + vec3(0.5)) * effectiveInputOverOutputRatioRC - vec3(0.5)":m="vec3(yRC) * effectiveInputOverOutputRatioRC",this.userCode=`
      const vec3 effectiveInputOverOutputRatioRC = vec3(
          ${c[0]/p[0]},
          ${c[1]/p[1]},
          ${c[1]/p[1]});
      const vec3 inputShapeRC = vec3(${a}.0, ${u}.0,
                                     ${u}.0);

      float getAValue(int b, int r, int c, int d) {
        return getChannel(getA(b, r, c, d), vec2(c, d));
      }

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        // Calculate values for next column in yRC.z.
        ivec3 yRC = coords.yzz + ivec3(0, 0, 1);

        // Fractional source index.
        vec3 sourceFracIndexRC = ${m};

        // Compute the four integer indices.
        ivec3 sourceFloorRC = ivec3(max(sourceFracIndexRC, vec3(0.0)));
        ivec3 sourceCeilRC = ivec3(
          min(inputShapeRC - 1.0, ceil(sourceFracIndexRC)));

        // Should we calculate next column and row elements in 2x2 packed cell.
        bool hasNextCol = d < ${l-1};
        bool hasNextRow = coords.z < ${o-1};

        // In parallel, construct four corners for all four components in
        // packed 2x2 cell.
        vec4 topLeft = vec4(
          getAValue(b, sourceFloorRC.x, sourceFloorRC.y, d),
          hasNextCol ? getAValue(b, sourceFloorRC.x, sourceFloorRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceFloorRC.x, sourceFloorRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceFloorRC.x, sourceFloorRC.z, d + 1) : 0.0);

        vec4 bottomLeft = vec4(
          getAValue(b, sourceCeilRC.x, sourceFloorRC.y, d),
          hasNextCol ? getAValue(b, sourceCeilRC.x, sourceFloorRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceCeilRC.x, sourceFloorRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceCeilRC.x, sourceFloorRC.z, d + 1) : 0.0);

        vec4 topRight = vec4(
          getAValue(b, sourceFloorRC.x, sourceCeilRC.y, d),
          hasNextCol ? getAValue(b, sourceFloorRC.x, sourceCeilRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceFloorRC.x, sourceCeilRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceFloorRC.x, sourceCeilRC.z, d + 1) : 0.0);

        vec4 bottomRight = vec4(
          getAValue(b, sourceCeilRC.x, sourceCeilRC.y, d),
          hasNextCol ? getAValue(b, sourceCeilRC.x, sourceCeilRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceCeilRC.x, sourceCeilRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceCeilRC.x, sourceCeilRC.z, d + 1) : 0.0);

        vec3 fracRC = sourceFracIndexRC - vec3(sourceFloorRC);

        vec4 top = mix(topLeft, topRight, fracRC.yyzz);
        vec4 bottom = mix(bottomLeft, bottomRight, fracRC.yyzz);
        vec4 newValue = mix(top, bottom, fracRC.x);

        setOutput(newValue);
      }
    `}};function $M(r){let{inputs:e,backend:t,attrs:o}=r,{images:n}=e,{alignCorners:s,halfPixelCenters:i,size:a}=o,[u,l]=a,c=$().getBool("WEBGL_PACK_IMAGE_OPERATIONS")?new zp(n.shape,u,l,s,i):new Gp(n.shape,u,l,s,i);return t.runWebGLProgram(c,[n],"float32")}var MN={kernelName:ja,backendName:"webgl",kernelFunc:$M};var Wp=class{constructor(e,t,o){this.variableNames=["dy"],this.outputShape=[],this.outputShape=t;let[,n,s]=t,[,i,a]=e,u=[o&&i>1?n-1:n,o&&a>1?s-1:s],l=[o&&i>1?i-1:i,o&&a>1?a-1:a],c=u[0]/l[0],p=u[1]/l[1],m=1/c,f=1/p,d=Math.ceil(m)*2+2,g=Math.ceil(f)*2+2;this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        int r = coords[1];
        int c = coords[2];

        float accumulator = 0.0;

        const float heightScale = float(${c});
        const float widthScale = float(${p});

        const float invHeightScale = float(${m});
        const float invWidthScale = float(${f});

        const int winHeight = int(${d});
        const int winWidth = int(${g});

        // Compute bounds for where in dy we will look
        float startRLerp = floor(float(r) * invHeightScale);
        int startDyR = int(startRLerp - float(winHeight / 2));

        float startCLerp = floor(float(c) * invWidthScale);
        int startDyC = int(startCLerp - float(winWidth / 2));

        // Loop over dy
        for (int dyROffset = 0; dyROffset < winHeight; dyROffset++) {
          int dyR = dyROffset + startDyR;

          // Guard against the window exceeding the bounds of dy
          if (dyR < 0 || dyR >= ${i}) {
            continue;
          }

          for (int dyCOffset = 0; dyCOffset < winWidth; dyCOffset++) {
            int dyC = dyCOffset + startDyC;

            // Guard against the window exceeding the bounds of dy
            if (dyC < 0 || dyC >= ${a}) {
              continue;
            }

            float dxR = float(dyR) * heightScale;
            int topDxRIndex = int(floor(dxR));
            int bottomDxRIndex = int(min(ceil(dxR), ${n-1}.0));
            float dxRLerp = dxR - float(topDxRIndex);
            float inverseDxRLerp = 1.0 - dxRLerp;

            float dxC = float(dyC) * widthScale;
            int leftDxCIndex = int(floor(dxC));
            int rightDxCIndex = int(min(ceil(dxC), ${s-1}.0));
            float dxCLerp = dxC - float(leftDxCIndex);
            float inverseDxCLerp = 1.0 - dxCLerp;

            if (r == topDxRIndex && c == leftDxCIndex) {
              // topLeft
              accumulator +=
                getDy(b, dyR, dyC, d) * inverseDxRLerp * inverseDxCLerp;
            }

            if (r == topDxRIndex && c == rightDxCIndex) {
              // topRight
              accumulator += getDy(b, dyR, dyC, d) * inverseDxRLerp * dxCLerp;
            }

            if (r == bottomDxRIndex && c == leftDxCIndex) {
              // bottomLeft
              accumulator += getDy(b, dyR, dyC, d) * dxRLerp * inverseDxCLerp;
            }

            if (r == bottomDxRIndex && c == rightDxCIndex) {
              // bottomRight
              accumulator += getDy(b, dyR, dyC, d) * dxRLerp * dxCLerp;
            }
          }
        }
        // End loop over dy

        setOutput(accumulator);
      }
    `}};function RM(r){let{inputs:e,backend:t,attrs:o}=r,{images:n,dy:s}=e,{alignCorners:i}=o,a=new Wp(s.shape,n.shape,i);return t.runWebGLProgram(a,[s],s.dtype)}var VN={kernelName:Lh,backendName:"webgl",kernelFunc:RM};var Hp=class{constructor(e,t,o,n,s){this.variableNames=["A"],this.outputShape=[];let[i,a,u,l]=e;this.outputShape=[i,t,o,l];let c=[n&&t>1?a-1:a,n&&o>1?u-1:u],p=[n&&t>1?t-1:t,n&&o>1?o-1:o],m=n?"0.5":"0.0",f;s?f="max((vec2(yRC) + vec2(0.5)) * effectiveInputOverOutputRatioRC, vec2(0.0))":f="vec2(yRC) * effectiveInputOverOutputRatioRC",this.userCode=`
      const vec2 effectiveInputOverOutputRatioRC = vec2(
          ${c[0]/p[0]},
          ${c[1]/p[1]});
      const vec2 inputShapeRC = vec2(${a}.0, ${u}.0);

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        ivec2 yRC = coords.yz;

        // Fractional source index.
        vec2 sourceFracIndexRC = ${f};

        // Compute the coordinators of nearest neighbor point.
        ivec2 sourceNearestRC = ivec2(
          min(inputShapeRC - 1.0, floor(sourceFracIndexRC + ${m})));
        float newValue = getA(b, sourceNearestRC.x, sourceNearestRC.y, d);

        setOutput(newValue);
      }
    `}};var Kp=class{constructor(e,t,o,n,s){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=[];let[i,a,u,l]=e;this.outputShape=[i,t,o,l];let c=[n&&t>1?a-1:a,n&&o>1?u-1:u],p=[n&&t>1?t-1:t,n&&o>1?o-1:o],m=n?"0.5":"0.0",f;s?f="max((vec3(yRC) + vec3(0.5)) * effectiveInputOverOutputRatioRC, vec3(0.0))":f="vec3(yRC) * effectiveInputOverOutputRatioRC",this.userCode=`
      const vec3 effectiveInputOverOutputRatioRC = vec3(
          ${c[0]/p[0]},
          ${c[1]/p[1]},
          ${c[1]/p[1]});
      const vec3 inputShapeRC = vec3(${a}.0, ${u}.0,
                                     ${u}.0);

      float getAValue(int b, int r, int c, int d) {
        return getChannel(getA(b, r, c, d), vec2(c, d));
      }

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        // Calculate values for next column in yRC.z.
        ivec3 yRC = coords.yzz + ivec3(0, 0, 1);

        // Fractional source index.
        vec3 sourceFracIndexRC = ${f};

        // Compute the coordinators of nearest neighbor point.
        ivec3 sourceNearestRC = ivec3(
          min(inputShapeRC - 1.0, floor(sourceFracIndexRC + ${m})));

        // Should we calculate next column and row elements in 2x2 packed cell.
        bool hasNextCol = d < ${l-1};
        bool hasNextRow = coords.z < ${o-1};

        vec4 newValue = vec4(
          getAValue(b, sourceNearestRC.x, sourceNearestRC.y, d),
          hasNextCol ? getAValue(b, sourceNearestRC.x, sourceNearestRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceNearestRC.x, sourceNearestRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceNearestRC.x, sourceNearestRC.z, d + 1) : 0.0);

        setOutput(newValue);
      }
    `}};function AM(r){let{inputs:e,backend:t,attrs:o}=r,{images:n}=e,{alignCorners:s,halfPixelCenters:i,size:a}=o,[u,l]=a,c=$().getBool("WEBGL_PACK_IMAGE_OPERATIONS")?new Kp(n.shape,u,l,s,i):new Hp(n.shape,u,l,s,i);return t.runWebGLProgram(c,[n],n.dtype)}var UN={kernelName:Xa,backendName:"webgl",kernelFunc:AM};var qp=class{constructor(e,t,o){this.variableNames=["dy"],this.outputShape=[],this.outputShape=t;let[,n,s]=t,[,i,a]=e,u=[o&&i>1?n-1:n,o&&a>1?s-1:s],l=[o&&i>1?i-1:i,o&&a>1?a-1:a],c=u[0]/l[0],p=u[1]/l[1],m=1/c,f=1/p,d=Math.ceil(m)*2+2,g=Math.ceil(f)*2+2;this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        int r = coords[1];
        int c = coords[2];

        float accumulator = 0.0;

        const float heightScale = float(${c});
        const float widthScale = float(${p});

        const float invHeightScale = float(${m});
        const float invWidthScale = float(${f});

        const int winHeight = int(${d});
        const int winWidth = int(${g});

        // Compute bounds for where in dy we will look
        float startRLerp = floor(float(r) * invHeightScale);
        int startDyR = int(floor(startRLerp - float(winHeight / 2)));

        float startCLerp = floor(float(c) * invWidthScale);
        int startDyC = int(floor(startCLerp - float(winWidth / 2)));

        // Loop over dy
        for (int dyROffset = 0; dyROffset < winHeight; dyROffset++) {
          int dyR = dyROffset + startDyR;

          // Guard against the window exceeding the bounds of dy
          if (dyR < 0 || dyR >= ${i}) {
            continue;
          }

          for (int dyCOffset = 0; dyCOffset < winWidth; dyCOffset++) {
            int dyC = dyCOffset + startDyC;

            // Guard against the window exceeding the bounds of dy
            if (dyC < 0 || dyC >= ${a}) {
              continue;
            }

            float sourceFracRow =
              float(${u[0]}) *
                (float(dyR) / float(${l[0]}));

            float sourceFracCol =
                float(${u[1]}) *
                  (float(dyC) / float(${l[1]}));

            int sourceNearestRow = int(min(
                float(int(${n}) - 1),
                ${o} ? float(round(sourceFracRow)) :
                                  float(floor(sourceFracRow))));

            int sourceNearestCol = int(min(
                float(int(${s}) - 1),
                ${o} ? float(round(sourceFracCol)) :
                                  float(floor(sourceFracCol))));

            if (r == sourceNearestRow && c == sourceNearestCol) {
              accumulator += getDy(b, dyR, dyC, d);
            }
          }
        }
        // End loop over dy

        setOutput(accumulator);
      }
    `}};function _M(r){let{inputs:e,backend:t,attrs:o}=r,{images:n,dy:s}=e,{alignCorners:i}=o,a=new qp(s.shape,n.shape,i);return t.runWebGLProgram(a,[s],s.dtype)}var GN={kernelName:Ph,backendName:"webgl",kernelFunc:_M};var Xp=class{constructor(e,t){this.variableNames=["x"];let o=e.length;if(o>4)throw new Error(`WebGL backend: Reverse of rank-${o} tensor is not yet supported`);if(this.outputShape=e,o===1){this.userCode=`
        void main() {
          int coord = getOutputCoords();
          setOutput(getX(${e[0]} - coord - 1));
        }
      `;return}let n=a=>t.indexOf(a)!==-1&&e[a]!==1?`${e[a]} - coords[${a}] - 1`:`coords[${a}]`,s=e.map((a,u)=>n(u)).join(","),i=J(o);this.userCode=`
      void main() {
        ${i} coords = getOutputCoords();
        setOutput(getX(${s}));
      }
    `}};var jp=class{constructor(e,t){this.variableNames=["x"],this.packedInputs=!0,this.packedOutput=!0;let o=e.length;if(o>4)throw new Error(`WebGL backend: Reverse of rank-${o} tensor is not yet supported`);this.outputShape=e;let n=Ae("rc",o),s=`${n[o-1]} + 1 < ${this.outputShape[o-1]}`,i=`${n[o-2]} + 1 < ${this.outputShape[o-2]}`,a=J(o);o===1?this.userCode=`
        void main(){
          int rc = getOutputCoords();
          vec4 result = vec4(0.);
          result.r = getChannel(getX(${e[0]} - rc - 1),
            ${e[0]} - rc - 1);
          if(${s}){
              result.g = getChannel(getX(${e[0]} - (rc  + 1) - 1),
                ${e[0]} - (rc  + 1) - 1);
          }
          setOutput(result);
        }
      `:this.userCode=`
        void main() {
          ${a} rc = getOutputCoords();
          vec4 result = vec4(0.);
          result.r = ${u(n.slice())};
          if(${s}){
            result.g = ${l(n.slice())};
          }
          if(${i}) {
            result.b = ${c(n.slice())};
            if(${s}) {
              result.a = ${p(n.slice())};
            }
          }
          setOutput(result);
        }
    `;function u(d){return m(d)}function l(d){return d[o-1]="("+d[o-1]+" + 1)",m(d)}function c(d){return d[o-2]="("+d[o-2]+" + 1)",m(d)}function p(d){return d[o-1]="("+d[o-1]+" + 1)",d[o-2]="("+d[o-2]+" + 1)",m(d)}function m(d){let g=e.map((v,N)=>f(N,d)),h=g.join(","),x=g.slice(-2).join(",");return`getChannel(getX(${h}), vec2(${x}))`}function f(d,g){return t.indexOf(d)!==-1&&e[d]!==1?`${e[d]} - ${g[d]} - 1`:`${g[d]}`}}};function DM(r){let{inputs:e,backend:t,attrs:o}=r,{x:n}=e,{dims:s}=o,i=n.shape.length,a=T.parseAxisParam(s,n.shape);if(i===0)return _e({inputs:{x:n},backend:t});let u=$().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new jp(n.shape,a):new Xp(n.shape,a);return t.runWebGLProgram(u,[n],n.dtype)}var zN={kernelName:Qa,backendName:"webgl",kernelFunc:DM};var Yp=class{constructor(e,t){this.variableNames=["Image"],this.outputShape=[],this.customUniforms=[{name:"params",type:"vec4"}];let o=e[1],n=e[2];this.outputShape=e;let s="";typeof t=="number"?s=`float outputValue = ${t.toFixed(2)};`:s=`
        vec3 fill = vec3(${t.join(",")});
        float outputValue = fill[coords[3]];`,this.userCode=`
        void main() {
          ivec4 coords = getOutputCoords();
          int x = coords[2];
          int y = coords[1];
          float coordXFloat = (float(x) - params[0]) * params[3] -
            (float(y) - params[1]) * params[2];
          float coordYFloat = (float(x) - params[0]) * params[2] +
            (float(y) - params[1]) * params[3];
          int coordX = int(round(coordXFloat + params[0]));
          int coordY = int(round(coordYFloat + params[1]));
          ${s}
          if(coordX >= 0 && coordX < ${n} && coordY >= 0 && coordY < ${o}) {
            outputValue = getImage(coords[0], coordY, coordX, coords[3]);
          }
          setOutput(outputValue);
        }
    `}};var WN={kernelName:Iu,backendName:"webgl",kernelFunc:({inputs:r,attrs:e,backend:t})=>{let{image:o}=r,{radians:n,fillValue:s,center:i}=e,a=t,u=new Yp(o.shape,s),[l,c]=I.getImageCenter(i,o.shape[1],o.shape[2]),p=[[l,c,Math.sin(n),Math.cos(n)]];return a.runWebGLProgram(u,[o],o.dtype,p)}};var OM=`
  // OpenGL ES does not support round function.
  // The algorithm is based on banker's rounding.
  float base = floor(x);
  if ((x - base) < 0.5) {
    return floor(x);
  } else if ((x - base) > 0.5) {
    return ceil(x);
  } else {
    if (mod(base, 2.0) == 0.0) {
      return base;
    } else {
      return base + 1.0;
    }
  }
`,FM=W({opSnippet:OM}),HN={kernelName:Za,backendName:"webgl",kernelFunc:FM};var PM="return inversesqrt(x);",LM=W({opSnippet:PM,cpuKernelImpl:ST}),KN={kernelName:kn,backendName:"webgl",kernelFunc:LM};var xo=class{constructor(e,t,o,n,s,i,a=!0,u=!1){this.variableNames=["updates","indices","defaultValue"],this.outputShape=i;let l=J(s.length),c=J(i.length),p="";o===1?p="i":o===2&&(p="i, j");let m=`getIndices(${p})`,f="";n===1?f="i":n===2&&(f="i, coords[1]");let d=`getUpdates(${f})`,g="";u&&(g="coords[0], coords[1]");let h=`getDefaultValue(${g})`,x=t>1?"strides[j]":"strides";this.userCode=`
        ${l} strides = ${l}(${s});

        void main() {
          ${c} coords = getOutputCoords();
          float sum = 0.0;
          bool found = false;
          for (int i = 0; i < ${e}; i++) {
            int flattenedIndex = 0;
            for (int j = 0; j < ${t}; j++) {
              int index = round(${m});
              flattenedIndex += index * ${x};
            }
            if (flattenedIndex == coords[0]) {
              sum += ${d};
              found = true;
            }
          }
          setOutput(mix(${h}, sum, float(found)));
        }
      `}};var Qp=class{constructor(e,t,o,n,s,i,a=!0,u=!1){this.variableNames=["updates","indices","defaultValue"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=i;let l=J(s.length),c=J(i.length),p="";o===1?p="i":o===2&&(p="i, j");let m=`getIndices(${p})`,f="";n===1?f="i":n===2&&(f="i, coords[1]");let d=`getUpdates(${f})`,g="";u&&(g="coords[0], coords[1]");let h=`getDefaultValue(${g})`,x=t>1?"strides[j]":"strides",v=t>1?"strides[j + 1]":"strides";this.userCode=`
        ${l} strides = ${l}(${s});

        void main() {
          ${c} coords = getOutputCoords();
          vec4 sum = vec4(0.);
          vec4 found = vec4(0.);
          for (int i = 0; i < ${e}; i+=2) {
            ivec2 flattenedIndex = ivec2(0);
            for (int j = 0; j < ${t}; j+=2) {
              ivec4 index = round(${m});
              flattenedIndex += index.xz * ${x};
              if (j + 1 < ${t}) {
                flattenedIndex += index.yw * ${v};
              }
            }
            if (flattenedIndex[0] == coords[0] || flattenedIndex[1] == coords[0] ||
                flattenedIndex[0] == coords[0] + 1 || flattenedIndex[1] == coords[0] + 1) {
              vec4 updVals = ${d};
              if (flattenedIndex[0] == coords[0]) {
                sum.xy += updVals.xy;
                found.xy = vec2(1.);
              } else if (flattenedIndex[0] == coords[0] + 1) {
                sum.zw += updVals.xy;
                found.zw = vec2(1.);
              }
              if (flattenedIndex[1] == coords[0]) {
                sum.xy += updVals.zw;
                found.xy = vec2(1.);
              } else if (flattenedIndex[1] == coords[0] + 1) {
                sum.zw += updVals.zw;
                found.zw = vec2(1.);
              }
            }
          }
          setOutput(mix(${h}, sum, found));
        }
      `}};function BM(r){let{inputs:e,backend:t,attrs:o}=r,{indices:n,updates:s}=e,{shape:i}=o,{sliceRank:a,numUpdates:u,sliceSize:l,strides:c,outputSize:p}=I.calculateShapes(s,n,i),m=[p/l,l];if(p===0)return t.makeTensorInfo(i,n.dtype);let f=L({inputs:{x:n},backend:t,attrs:{shape:[u,a]}}),d=L({inputs:{x:s},backend:t,attrs:{shape:[u,l]}}),g=t.makeTensorInfo([],"float32",new Float32Array([0])),h;$().getBool("WEBGL_PACK")?h=new Qp(u,a,f.shape.length,d.shape.length,c,m):h=new xo(u,a,f.shape.length,d.shape.length,c,m);let x=t.runWebGLProgram(h,[d,f,g],d.dtype),v=L({inputs:{x},backend:t,attrs:{shape:i}});return t.disposeIntermediateTensorInfo(f),t.disposeIntermediateTensorInfo(d),t.disposeIntermediateTensorInfo(x),t.disposeIntermediateTensorInfo(g),v}var qN={kernelName:Ja,backendName:"webgl",kernelFunc:BM};var Zp=class{constructor(e,t,o,n){this.variableNames=["sortedSequence","values"],this.customUniforms=[{name:"numInputs",type:"int"}],this.outputShape=[e,o];let s="while (left < right) {",i=`for (int i = 0; i < ${Math.ceil(Math.log2(t+1))}; ++i) { if (left >= right) break;`,a=$().getNumber("WEBGL_VERSION")===2?s:i,u=n==="left"?"<":"<=";this.userCode=`
       int findBound(int batch, float value) {
         int left = 0;
         int right = numInputs;
         int mid;
         ${a}
           mid = (left + right) / 2;
           if (getSortedSequence(batch, mid) ${u} value) {
             left = mid + 1;
           } else {
             right = mid;
           }
         }
         return right;
       }

       void main() {
         ivec2 coords = getOutputCoords();
         int batch = coords[0];
         int valueIndex = coords[1];

         float value = getValues(batch, valueIndex);

         setOutput(float(findBound(batch, value)));
       }
     `}};function MM(r){let{inputs:e,backend:t,attrs:o}=r,{sortedSequence:n,values:s}=e,{side:i}=o,a=new Zp(n.shape[0],n.shape[1],s.shape[1],i),u=[[n.shape[1]]];return t.runWebGLProgram(a,[n,s],"int32",u)}var XN={kernelName:tu,backendName:"webgl",kernelFunc:MM};var Jp=class{constructor(e,t,o){this.variableNames=["c","a","b"],this.outputShape=t;let n,s;if(o>4)throw Error(`Where for rank ${o} is not yet supported`);if(o===1)s="resRC",n="resRC";else{let a=["resRC.x","resRC.y","resRC.z","resRC.w"],u=[],l=[];for(let c=0;c<t.length;c++)l.push(`${a[c]}`),c<e&&u.push(`${a[c]}`);n=u.join(),s=l.join()}let i=J(o);this.userCode=`
      void main() {
        ${i} resRC = getOutputCoords();
        float cVal = getC(${n});
        if (cVal >= 1.0) {
          setOutput(getA(${s}));
        } else {
          setOutput(getB(${s}));
        }
      }
    `}};function VM(r){let{inputs:e,backend:t}=r,{condition:o,t:n,e:s}=e,i=new Jp(o.shape.length,n.shape,n.shape.length);return t.runWebGLProgram(i,[o,n,s],Qe(n.dtype,s.dtype))}var jN={kernelName:ru,backendName:"webgl",kernelFunc:VM};var UM=`
  // Stable and Attracting Fixed Point (0, 1) for Normalized Weights.
  // see: https://arxiv.org/abs/1706.02515
  float scaleAlpha = ${I.SELU_SCALEALPHA};
  float scale = ${I.SELU_SCALE};
  return (x >= 0.0) ? scale * x : scaleAlpha * (exp(x) - 1.0);
`,GM=W({opSnippet:UM}),YN={kernelName:ou,backendName:"webgl",kernelFunc:GM};var zM=Qt+`
  return 1.0 / (1.0 + exp(-1.0 * x));
`,WM=`
  vec4 result = 1.0 / (1.0 + exp(-1.0 * x));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,HM=W({opSnippet:zM,packedOpSnippet:WM,cpuKernelImpl:NT}),QN={kernelName:$n,backendName:"webgl",kernelFunc:HM};var KM=`
  if (isnan(x)) { return 0.0; }
  return sign(x);
`,qM=W({opSnippet:KM}),ZN={kernelName:su,backendName:"webgl",kernelFunc:qM};var XM=Qt+`
  return sin(x);
`,jM=`
  vec4 result = sin(x);
  bvec4 isNaN = isnan(x);
  ${Pt}
  return result;
`,YM=W({opSnippet:XM,packedOpSnippet:jM}),JN={kernelName:"Sin",backendName:"webgl",kernelFunc:YM};var QM=`
  float e2x = exp(x);
  return (e2x - 1.0 / e2x) / 2.0;
`,ZM=W({opSnippet:QM}),eE={kernelName:nu,backendName:"webgl",kernelFunc:ZM};var JM=`
  float epsilon = 1.1920928955078125e-7;
  float threshold = log(epsilon) + 2.0;

  bool too_large = x > -threshold;
  bool too_small = x < threshold;

  float result;
  float exp_x = exp(x);

  if (too_large){
    result = x;
  }
  else if (too_small){
    result = exp_x;
  }
  else{
    result = log(exp_x + 1.0);
  }
  return result;
`,eV=W({opSnippet:JM}),tE={kernelName:iu,backendName:"webgl",kernelFunc:eV};var tV=r=>{let{inputs:e,backend:t,attrs:o}=r,{x:n}=e,{blockShape:s,paddings:i}=o;T.assert(n.shape.length<=4,()=>"spaceToBatchND for rank > 4 with a WebGL backend not implemented yet");let a=s.reduce((x,v)=>x*v),u=[[0,0]];u.push(...i);for(let x=1+s.length;x<n.shape.length;++x)u.push([0,0]);let l=[],c=mh({inputs:{x:n},backend:t,attrs:{paddings:u,constantValue:0}}),p=I.getReshaped(c.shape,s,a,!1),m=I.getPermuted(p.length,s.length,!1),f=I.getReshapedPermuted(c.shape,s,a,!1),d=L({inputs:{x:c},backend:t,attrs:{shape:p}}),g=Se({inputs:{x:d},backend:t,attrs:{perm:m}}),h=L({inputs:{x:g},backend:t,attrs:{shape:f}});return l.push(c),l.push(d),l.push(g),l.forEach(x=>t.disposeIntermediateTensorInfo(x)),h},rE={kernelName:au,backendName:"webgl",kernelFunc:tV};function rV(r){let{inputs:e,backend:t}=r,{indices:o,values:n,denseShape:s,defaultValue:i}=e;if(s.shape.length!==1)throw new Error(`Dense shape must be a vector, saw:
         ${s.shape}`);if(o.shape.length!==2)throw new Error(`Indices must be a matrix, saw:
         ${o.shape}`);if(n.shape.length!==1)throw new Error(`Values must be a vector, saw:
         ${n.shape}`);if(i.shape.length!==0)throw new Error(`Default value must be a scalar, saw:
        ${i.shape}`);let a=t.readSync(o.dataId),u=t.readSync(n.dataId),l=t.readSync(s.dataId),c=t.readSync(i.dataId)[0],[p,m,f,d,g]=IT(a,o.shape,o.dtype,u,n.dtype,l,c);return[t.makeTensorInfo(m,o.dtype,p),t.makeTensorInfo([m[0]],n.dtype,f),t.makeTensorInfo([d.length],"bool",new Uint8Array(d.map(h=>Number(h)))),t.makeTensorInfo([g.length],o.dtype,new Int32Array(g))]}var oE={kernelName:cu,backendName:"webgl",kernelFunc:rV};function oV(r){let{inputs:e,backend:t}=r,{inputIndices:o,inputShape:n,newShape:s}=e;if(o.shape.length!==2)throw new Error(`Input indices should be a matrix but received shape ${o.shape}`);if(n.shape.length!==1)throw new Error(`Input shape should be a vector but received shape ${n.shape}`);if(s.shape.length!==1)throw new Error(`Target shape should be a vector but received shape ${s.shape}`);let i=Array.from(t.readSync(n.dataId)),a=t.readSync(o.dataId),u=Array.from(t.readSync(s.dataId)),[l,c,p]=kT(a,o.shape,o.dtype,i,u);return[t.makeTensorInfo(c,o.dtype,l),t.makeTensorInfo([p.length],s.dtype,new Int32Array(p))]}var nE={kernelName:pu,backendName:"webgl",kernelFunc:oV};function nV(r){let{inputs:e,backend:t}=r,{data:o,indices:n,segmentIds:s}=e;if(o.shape.length<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(n.shape.length!==1)throw new Error(`Indices should be a vector but received shape
              ${n.shape}`);if(s.shape.length!==1)throw new Error(`Segment ids should be a vector but received shape
              ${s.shape}`);let i=t.readSync(o.dataId),a=t.readSync(n.dataId),u=t.readSync(s.dataId),[l,c]=Oc(i,o.shape,o.dtype,a,u,!0);return t.makeTensorInfo(c,o.dtype,l)}var sE={kernelName:mu,backendName:"webgl",kernelFunc:nV};function sV(r){let{inputs:e,backend:t}=r,{data:o,indices:n,segmentIds:s}=e;if(o.shape.length<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(n.shape.length!==1)throw new Error(`Indices should be a vector but received shape
             ${n.shape}`);if(s.shape.length!==1)throw new Error(`Segment ids should be a vector but received shape
             ${s.shape}`);let i=t.readSync(o.dataId),a=t.readSync(n.dataId),u=t.readSync(s.dataId),[l,c]=Oc(i,o.shape,o.dtype,a,u);return t.makeTensorInfo(c,o.dtype,l)}var iE={kernelName:fu,backendName:"webgl",kernelFunc:sV};function iV(r){let{inputs:e,backend:t,attrs:o}=r,{sparseIndices:n,sparseValues:s,defaultValue:i}=e,{outputShape:a}=o,{sliceRank:u,numUpdates:l,sliceSize:c,strides:p,outputSize:m}=I.calculateShapes(s,n,a),f=!1;if(s.dtype==="string"){let x=t.bufferSync(n),v=t.bufferSync(s),N=T.decodeString(t.readSync(i.dataId)[0]),E=CT(x,v,a,m,c,l,u,p,N,f);return t.makeTensorInfo(a,E.dtype,E.values)}let d=new xo(l,u,n.shape.length,s.shape.length,p,[m,1],f),g=t.runWebGLProgram(d,[s,n,i],s.dtype),h=L({inputs:{x:g},backend:t,attrs:{shape:a}});return t.disposeIntermediateTensorInfo(g),h}var aE={kernelName:du,backendName:"webgl",kernelFunc:iV};function aV(r){let{inputs:e,backend:t,attrs:o}=r,{x:n}=e,{numOrSizeSplits:s,axis:i}=o,a=T.parseAxisParam(i,n.shape)[0],u=I.prepareSplitSize(n,s,a),l=n.shape.length,c=new Array(l).fill(0),p=n.shape.slice();return u.map(m=>{let f=[...p];f[a]=m;let d=ar({inputs:{x:n},backend:t,attrs:{begin:c,size:f}});return c[a]+=m,d})}var uE={kernelName:uu,backendName:"webgl",kernelFunc:aV};var lE="return sqrt(x);",uV=W({opSnippet:lE,packedOpSnippet:lE,cpuKernelImpl:$T}),cE={kernelName:Rn,backendName:"webgl",kernelFunc:uV};var lV="return x * x;",cV=W({opSnippet:lV}),pE={kernelName:Bh,backendName:"webgl",kernelFunc:cV};var mE="return (a - b) * (a - b);",pV=me({opSnippet:mE,packedOpSnippet:mE}),fE={kernelName:An,backendName:"webgl",kernelFunc:pV};function mV(r){let{inputs:e,backend:t,attrs:o}=r,{x:n}=e;if(n.dtype!=="string")throw new Error("Input must be of datatype string");let s=t.readSync(n.dataId),i=I.fromUint8ToStringArray(s),a=RT(i,"string",o);return t.makeTensorInfo(n.shape,"string",a)}var dE={kernelName:_n,backendName:"webgl",kernelFunc:mV};function fV({inputs:r,attrs:e,backend:t}){let{x:o}=r,n=Le+`
    return x > 0.0 ? 1.0 : float(${e.alpha});
  `,s=new He(o.shape,n);return t.runWebGLProgram(s,[o],o.dtype)}var hE={kernelName:Eu,backendName:"webgl",kernelFunc:fV};var em=class{constructor(e,t,o){this.variableNames=["x"],this.outputShape=o;let n=o.length,s=J(o.length),i=J(o.length),a="";if(n===1)a="coords * strides + begin";else{let u=0;a=o.map((l,c)=>(u++,o.length===1?`coords * strides[${c}] + begin[${c}]`:`coords[${u-1}] * strides[${c}] + begin[${c}]`)).join(",")}this.userCode=`
      ${s} begin = ${s}(${e});
      ${s} strides = ${s}(${t});

      void main() {
        ${i} coords = getOutputCoords();
        setOutput(getX(${a}));
      }
    `}};function dV(r){let{inputs:e,backend:t,attrs:o}=r,{x:n}=e,{begin:s,end:i,strides:a,beginMask:u,endMask:l,ellipsisMask:c,newAxisMask:p,shrinkAxisMask:m}=o,{finalShapeSparse:f,finalShape:d,isIdentity:g,sliceDim0:h,isSimpleSlice:x,begin:v,end:N,strides:E}=yt.sliceInfo(n.shape,s,i,a,u,l,c,p,m),k;if(g)k=L({inputs:{x:n},backend:t,attrs:{shape:d}});else if(h||x){T.assert(n.shape.length>=1,()=>`Input must have rank at least 1, got: ${n.shape.length}`);let A=yt.computeOutShape(v,N,E),_=ar({inputs:{x:n},backend:t,attrs:{begin:v,size:A}});k=L({inputs:{x:_},backend:t,attrs:{shape:d}}),t.disposeIntermediateTensorInfo(_)}else if(t.shouldExecuteOnCPU([n])){let _=t.readSync(n.dataId),O=oe(n.shape,n.dtype,_),F=AT(f,O,E,v);k=t.makeTensorInfo(d,n.dtype,F.values)}else{let _=new em(v,E,f);k=t.runWebGLProgram(_,[n],n.dtype)}let R=L({inputs:{x:k},backend:t,attrs:{shape:d}});return t.disposeIntermediateTensorInfo(k),R}var gE={kernelName:hu,backendName:"webgl",kernelFunc:dV};function hV(r){let{inputs:e,backend:t,attrs:o}=r,{separator:n,nGramWidths:s,leftPad:i,rightPad:a,padWidth:u,preserveShortSequences:l}=o,{data:c,dataSplits:p}=e,m=t.readSync(c.dataId),f=t.readSync(p.dataId),[d,g]=_T(m,f,n,s,i,a,u,l);return[t.makeTensorInfo([d.length],"string",d),t.makeTensorInfo(p.shape,"int32",g)]}var xE={kernelName:gu,backendName:"webgl",kernelFunc:hV};function gV(r){let{inputs:e,backend:t,attrs:o}=r,{skipEmpty:n}=o,{input:s,delimiter:i}=e;if(s.dtype!=="string")throw new Error("Input must be of datatype string");if(s.shape.length!==1)throw new Error(`Input must be a vector, got shape: ${s.shape}`);if(i.shape.length!==0)throw new Error(`Delimiter must be a scalar, got shape: ${i.shape}`);let a=t.readSync(s.dataId),u=t.readSync(i.dataId)[0],[l,c,p]=DT(a,u,n),m=c.length;return[t.makeTensorInfo([m,2],"int32",l),t.makeTensorInfo([m],"string",c),t.makeTensorInfo([2],"int32",new Int32Array(p))]}var yE={kernelName:xu,backendName:"webgl",kernelFunc:gV};function xV(r){let{inputs:e,backend:t,attrs:o}=r,{numBuckets:n}=o,{input:s}=e;if(s.dtype!=="string")throw new Error("Input must be of datatype string");if(n<=0)throw new Error("Number of buckets must be at least 1");let i=t.readSync(s.dataId),a=OT(i,n);return t.makeTensorInfo(s.shape,"int32",a)}var bE={kernelName:yu,backendName:"webgl",kernelFunc:xV};var yV="return tan(x);",bV=W({opSnippet:yV}),wE={kernelName:"Tan",backendName:"webgl",kernelFunc:bV};var wV=`
  float e2x = exp(-2.0 * abs(x));
  return sign(x) * (1.0 - e2x) / (1.0 + e2x);
`,vV=W({opSnippet:wV}),vE={kernelName:bu,backendName:"webgl",kernelFunc:vV};function TV(r){let{inputs:e,backend:t,attrs:o}=r,{tensor:n,indices:s,updates:i}=e,{}=o,{sliceRank:a,numUpdates:u,sliceSize:l,strides:c,outputSize:p}=I.calculateShapes(i,s,n.shape),m=[p/l,l];if(p===0)return t.makeTensorInfo(n.shape,s.dtype);let f=L({inputs:{x:s},backend:t,attrs:{shape:[u,a]}}),d=L({inputs:{x:i},backend:t,attrs:{shape:[u,l]}}),g=L({inputs:{x:n},backend:t,attrs:{shape:m}}),h=new xo(u,a,f.shape.length,d.shape.length,c,m,!1,!0),x=t.runWebGLProgram(h,[d,f,g],g.dtype),v=L({inputs:{x},backend:t,attrs:{shape:n.shape}});return t.disposeIntermediateTensorInfo(f),t.disposeIntermediateTensorInfo(d),t.disposeIntermediateTensorInfo(g),t.disposeIntermediateTensorInfo(x),v}var TE={kernelName:eu,backendName:"webgl",kernelFunc:TV};var tm=class{constructor(e,t){this.variableNames=["A"];let o=new Array(e.length);for(let i=0;i<o.length;i++)o[i]=e[i]*t[i];this.outputShape=o,this.rank=o.length;let n=J(this.rank),s=SV(e);this.userCode=`
      void main() {
        ${n} resRC = getOutputCoords();
        setOutput(getA(${s}));
      }
    `}};function SV(r){let e=r.length;if(e>5)throw Error(`Tile for rank ${e} is not yet supported`);if(e===1)return`imod(resRC, ${r[0]})`;let t=["resRC.x","resRC.y","resRC.z","resRC.w","resRC.u"],o=[];for(let n=0;n<r.length;n++)o.push(`imod(${t[n]}, ${r[n]})`);return o.join()}function dh(r){let{inputs:e,backend:t,attrs:o}=r,{x:n}=e,{reps:s}=o;if(n.dtype==="string"||n.shape.length>5){let u=t.readSync(n.dataId),l=n.dtype==="string"?u.map(m=>T.decodeString(m)):u,c=oe(n.shape,n.dtype,l),p=PT(c,s);return t.makeTensorInfo(p.shape,p.dtype,p.values)}let i=new tm(n.shape,s);return t.runWebGLProgram(i,[n],n.dtype)}var SE={kernelName:Dn,backendName:"webgl",kernelFunc:dh};var rm=class{constructor(e){this.variableNames=["x","indices"],this.customUniforms=[{name:"n",type:"int"},{name:"firstPass",type:"int"},{name:"negativeInf",type:"float"},{name:"dir",type:"int"},{name:"inc",type:"int"}],this.outputShape=e,this.userCode=`
       void main() {
         ivec2 coords = getOutputCoords();
         int batch = coords[0];
         int elemIdx = coords[1];

         // We compare elements pair-wise within a group of size 2 * inc.
         // The comparing rule for each group alternates between ascending
         // and descending. Within each group, we compare each pair at
         // positions i and i+inc. To decide whether an element at position i
         // is x0 or x1, we mod it by 2 * inc, if the result is smaller than
         // inc, it is in the first half of the group, we denote it as x0,
         // otherwise we denote it as x1.
         // For example, as shown in the Bitonic top K paper referenced above,
         // Figure5(a) shows that element[1] is in the
         // second half of the group when group size is 2, but it is in the
         // first half of the group when group size is 4.

         bool isFirstInPair = imod(elemIdx, 2 * inc) < inc;
         int i = isFirstInPair ? elemIdx : elemIdx - inc;

         int i0 = firstPass == 1 ? i : int(getIndices(batch, i));
         int i1 = firstPass == 1 ? i + inc : int(getIndices(batch, i + inc));
         float x0 = i0 < n ? getX(batch, i0) : negativeInf;
         float x1 = i1 < n ? getX(batch, i1) : negativeInf;

         // Denotes which direction indices are in (ascending or descending).
         bool reverse = imod(elemIdx, 2 * dir) >= dir;
         bool isGreater = x0 > x1 || (x0 == x1 && i1 > i0);
         if (reverse == isGreater) { // Elements in opposite order of direction
           int iTemp = i0;
           i0 = i1;
           i1 = iTemp;
         }
         if (isFirstInPair) {
            setOutput(float(i0));
         } else {
            setOutput(float(i1));
         }
       }
     `}},om=class{constructor(e){this.variableNames=["x","indices"],this.customUniforms=[{name:"n",type:"int"},{name:"firstPass",type:"int"},{name:"k",type:"int"}],this.outputShape=e,this.userCode=`
    void main() {
         // Takes max of indices (0, k), (1, k + 1), (2, k + 2) ...
         ivec2 coords = getOutputCoords();
         int batch = coords[0];
         int elemIdx = coords[1];

         // The output size is half of the previous size.
         // If the previous sequence is | | | | _ _ _ _  | | | |  _ _ _ _ (k=4),
         // we only need to output the indices at positions |, the indices at
         // positions _ can be thrown away, see Figure5(b) After Phase 2
         // (Merge phase) in the Bitonic Top K paper referenced above.
         // For example, the paper shows we only need to output the orange bars.
         // The output sequence should look like this | | | | | | | |.
         // Because the sequence is halved, to map the output index back
         // to the previous sequence to find the corresponding value,
         // we need to double the index. When we double the index,
         // we basically interpolate a position, so 2i looks like
         // | _ | _ | _ | _ | _ | _ | _. We move the | to the first k position
         // of each 2k positions by - elemIdx % k. E.g. for output at
         // index 4,5,6,7, we want to get the corresponding element at
         // original index 8,9,10,11, for output at index 8,9,10,11,
         // we want to get the corresponding element at original index
         // 16,17,18,19, so on and so forth.

         int i = elemIdx < k ? elemIdx : (elemIdx * 2 - imod(elemIdx, k));
         int i0 = firstPass == 1 ? i : int(getIndices(batch, i));
         int i1 = firstPass == 1 ? i + k : int(getIndices(batch, i + k));

         float x0 = getX(batch, i0);
         float x1 = i1 < n ? getX(batch, i1) : x0;

         setOutput(x0 >= x1 ? float(i0) : float(i1));
       }
     `}};function sn(r,e){e!==null&&r.disposeIntermediateTensorInfo(e)}function CE(r){let e=1;for(;e<r;)e*=2;return e}function CV(r){let{inputs:e,backend:t,attrs:o}=r,{x:n}=e,{k:s,sorted:i}=o,a=$().getNumber("TOPK_LAST_DIM_CPU_HANDOFF_SIZE_THRESHOLD"),u=$().getNumber("TOPK_K_CPU_HANDOFF_THRESHOLD"),l=n.shape,c=l[l.length-1];if(t.shouldExecuteOnCPU([n])||c<a||s>u){let F=t.readSync(n.dataId),[B,M]=LT(F,l,n.dtype,s,i);return[t.makeTensorInfo(B.shape,B.dtype,B.values),t.makeTensorInfo(M.shape,M.dtype,M.values)]}if(s===0)return l[l.length-1]=0,[t.makeTensorInfo(l,n.dtype,[]),t.makeTensorInfo(l,"int32",[])];if(c===1)return[n,Ur({attrs:{shape:l,dtype:"int32",value:0},backend:t})];let p=t.texData.get(n.dataId),m=p!==null&&p.isPacked,f=m?t.unpackTensor(n):n,g=T.sizeFromShape(l)/c,h=L({inputs:{x:f},attrs:{shape:[g,c]},backend:t});m&&sn(t,f);let x=CE(s),v=CE(c),N=null,E=()=>N===null?[h,h]:[h,N],k=(F,B,M)=>{let z=E(),j=new rm(M),ie=[[c],[N===null?1:0],[Number.NEGATIVE_INFINITY],[F],[B]],fe=N;N=t.runWebGLProgram(j,z,"int32",ie),sn(t,fe)};for(let F=1;F<x;F*=2){let B=F*2;for(let M=F;M>=1;M/=2)k(B,M,[g,v])}for(let F=v;F>x;F/=2){let B=E(),M=new om([g,F/2]),j=[[c],[N===null?1:0],[x]],Z=N;N=t.runWebGLProgram(M,B,"int32",j),sn(t,Z);let ie=x/2,fe=ie*2;for(let be=ie;be>=1;be/=2)k(fe,be,N.shape)}let R=N;N=ar({inputs:{x:N},backend:t,attrs:{begin:0,size:[g,s]}}),sn(t,R);let A=ah({inputs:{x:h,indices:N},backend:t,attrs:{axis:1,batchDims:1}});sn(t,h);let _=l.slice(0,-1);_.push(s),R=N,N=L({inputs:{x:N},attrs:{shape:_},backend:t}),sn(t,R);let O=A;return A=L({inputs:{x:A},attrs:{shape:_},backend:t}),sn(t,O),[A,N]}var NE={kernelName:wu,backendName:"webgl",kernelFunc:CV};var nm=class{constructor(e,t,o,n,s,i){this.variableNames=["Image","Transforms"],this.outputShape=i;let a=o==="nearest"?1:2,u;switch(n){case"constant":u=1;break;case"reflect":u=2;break;case"wrap":u=3;break;case"nearest":u=4;break;default:u=1;break}this.userCode=`
            float mapCoord(float outCoord, float len) {
              float inCoord = outCoord;
              if(${u} == 2) {
                if (inCoord < 0.0) {
                  if (len <= 1.0) {
                    inCoord = 0.0;
                  } else {
                    float sz2 = 2.0 * len;
                    if (inCoord < sz2) {
                      inCoord = sz2 * float(int(float(-inCoord / sz2))) +
                      inCoord;
                    }
                    inCoord = inCoord < -len ? inCoord + sz2 : -inCoord - 1.0;
                  }
                } else if (inCoord > len - 1.0) {
                  if (len <= 1.0) {
                    inCoord = 0.0;
                  } else {
                    float sz2 = 2.0 * len;
                    inCoord -= sz2 * float(int(float(inCoord / sz2)));
                    if (inCoord >= len) {
                      inCoord = sz2 - inCoord - 1.0;
                    }
                  }
                }
                return clamp(inCoord, 0.0, len - 1.0);
              } else if (${u} == 3) {
                if (inCoord < 0.0) {
                  if (len <= 1.0) {
                    inCoord = 0.0;
                  } else {
                    float sz = len - 1.0;
                    inCoord += len * (float(int(float(-inCoord / sz))) + 1.0);
                  }
                } else if (inCoord > len - 1.0) {
                  if (len <= 1.0) {
                    inCoord = 0.0;
                  } else {
                    float sz = len - 1.0;
                    inCoord -= len * float(int(float(inCoord / sz)));
                  }
                }
                return clamp(inCoord, 0.0, len - 1.0);
              } else if (${u} == 4) {
                return clamp(outCoord, 0.0, len - 1.0);
              } else {
                return outCoord;
              }
            }

            float readWithFillValue(int batch, int coordY, int coordX,
              int channel) {
              float outputValue;
              if (0 <= coordY && coordY < ${e} && 0 <= coordX && coordX < ${t}) {
                  outputValue = getImage(batch, coordY, coordX, channel);
              } else {
                outputValue = float(${s});
              }
              return outputValue;
            }

            void main() {
              ivec4 coords = getOutputCoords();
              float outputValue;
              int batch = coords[0];
              int x = coords[2];
              int y = coords[1];
              int channel = coords[3];
              float xf = float(x);
              float yf = float(y);
              float a1 = getTransforms(batch, 0);
              float a2 = getTransforms(batch, 1);
              float a3 = getTransforms(batch, 2);
              float b1 = getTransforms(batch, 3);
              float b2 = getTransforms(batch, 4);
              float b3 = getTransforms(batch, 5);
              float c1 = getTransforms(batch, 6);
              float c2 = getTransforms(batch, 7);
              float projection = c1 * xf + c2 * yf + 1.0;
              if (projection == 0.0) {
                outputValue = float(${s});
              } else {
                float inX = (a1 * xf + a2 * yf + a3) / projection;
                float inY = (b1 * xf + b2 * yf + b3) / projection;
                float mapX = mapCoord(inX, float(${t}));
                float mapY = mapCoord(inY, float(${e}));

                if (${a} == 1) {
                  int coordY = int(round(mapY));
                  int coordX = int(round(mapX));
                  outputValue = readWithFillValue(batch, coordY, coordX,
                    channel);
                } else {
                  float yFloor = floor(mapY);
                  float xFloor = floor(mapX);
                  float yCeil = yFloor + 1.0;
                  float xCeil = xFloor + 1.0;
                  float valueYFloor = (xCeil - mapX) *
                  readWithFillValue(batch, int(yFloor), int(xFloor), channel) +
                  (mapX - xFloor) *
                  readWithFillValue(batch, int(yFloor), int(xCeil), channel);
                  float valueYCeil = (xCeil - mapX) *
                  readWithFillValue(batch, int(yCeil), int(xFloor), channel) +
                  (mapX - xFloor) *
                  readWithFillValue(batch, int(yCeil), int(xCeil), channel);
                  outputValue = (yCeil - mapY) * valueYFloor +
                  (mapY - yFloor) * valueYCeil;
                }
              }
              setOutput(outputValue);
            }
        `}};function NV(r){let{inputs:e,backend:t,attrs:o}=r,{image:n,transforms:s}=e,{interpolation:i,fillMode:a,fillValue:u,outputShape:l}=o,[c,p,m,f]=n.shape,[d,g]=l??[p,m],h=[c,d,g,f],x=new nm(p,m,i,a,u,h);return t.runWebGLProgram(x,[n,s],"float32")}var EE={kernelName:vu,backendName:"webgl",kernelFunc:NV};function EV(r){let{inputs:e,attrs:t,backend:o}=r,{axis:n}=t,{x:s}=e;Sr(s,"unique"),console.warn("WARNING: ","UI might be locked temporarily as data is being downloaded");let i=o.readSync(s.dataId),{outputValues:a,outputShape:u,indices:l}=BT(i,n,s.shape,s.dtype);return[o.makeTensorInfo(u,s.dtype,a),o.makeTensorInfo([l.length],"int32",l)]}var IE={kernelName:Tu,backendName:"webgl",kernelFunc:EV};function IV(r){let{inputs:e,backend:t,attrs:o}=r,{value:n}=e,{axis:s}=o;s<0&&(s+=n.shape.length);let i=n,a=i.shape.length,u=n.shape[s],l=new Array(a-1),c=0;for(let g=0;g<a;g++)g!==s&&(l[c++]=i.shape[g]);let p=[],m=new Array(a).fill(0),f=i.shape.slice();f[s]=1;let d=new Array(u);for(let g=0;g<d.length;g++){m[s]=g;let h=ar({inputs:{x:i},backend:t,attrs:{begin:m,size:f}}),x=L({inputs:{x:h},backend:t,attrs:{shape:l}});d[g]=x,p.push(h)}return p.forEach(g=>t.disposeIntermediateTensorInfo(g)),d}var kE={kernelName:Su,backendName:"webgl",kernelFunc:IV};var sm=class{constructor(e,t){this.variableNames=["x","segmentIds"];let o=e.windowSize,n=e.batchSize,s=e.inSize,i=e.numSegments,a=i*Math.ceil(s/o);this.outputShape=[n,a];let u="0.0",l="sumValue",c=Math.floor(o/4)*4,p=o%4,m=`
        sumValue += dot(values, segFilter);
    `,f="";s%o>0&&(f=`
        if (inIdx < 0 || inIdx >= ${s}) {
          return initializationValue;
        }
      `);let d="";s%o>0&&(d=`
        if (inIdx < 0 || inIdx >= ${s}) {
          return -1.0;
        }
      `),this.userCode=`
      const float initializationValue = ${u};

      float getValue(int batch, int inIdx) {
        ${f}
        return getX(batch, inIdx);
      }

      float getSegmentIdAtIndex(int inIdx) {
        ${d}
        return getSegmentIds(inIdx);
      }

      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = int(floor(float(outIdx) / float(
          ${i})) * float(${o}));
        int currentSeg = int(mod(float(outIdx), float(${i})));

        float sumValue = 0.0;

        for (int i = 0; i < ${c}; i += 4) {
          int inIdx = inOffset + i;
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            getValue(batch, inIdx + 3)
          );

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 2)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 3)) == currentSeg ? 1 : 0
          );

          ${m}
        }

        int inIdx = inOffset + ${c};
        if (${p===1}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            initializationValue,
            initializationValue,
            initializationValue
          );

          int inIdxSeg = int(getSegmentIdAtIndex(inIdx));

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            0,
            0,
            0
          );

          ${m}
        } else if (${p===2}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            initializationValue,
            initializationValue
          );

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,
              0,
              0
          );

          ${m}
        } else if (${p===3}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            initializationValue
          );

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 2)) == currentSeg ? 1 : 0,
            0
          );

          ${m}
        }
        setOutput(${l});
      }
    `}};function kV(r){let{inputs:e,backend:t,attrs:o}=r,{x:n,segmentIds:s}=e,{numSegments:i}=o,a=n.shape.length,u=[],l=0,c=I.getAxesPermutation([l],a),p=n;c!=null&&(p=Se({inputs:{x:n},backend:t,attrs:{perm:c}}),u.push(p),l=I.getInnerMostAxes(1,a)[0]);let m=I.segment_util.computeOutShape(p.shape,l,i),f=T.sizeFromShape([p.shape[l]]),d=L({inputs:{x:p},backend:t,attrs:{shape:[-1,f]}});u.push(d);let g=Ro(n.dtype),h=(E,k,R,A,_)=>{let O=E.shape[0],F=E.shape[1],B=I.segment_util.segOpComputeOptimalWindowSize(F,_),M={windowSize:B,inSize:F,batchSize:O,numSegments:_},z=new sm(M,k),j=t.compileAndRun(z,[E,R],A);if(u.push(j),j.shape[1]===_)return j;let Z=fh({backend:t,attrs:{start:0,stop:_,step:1,dtype:"float32"}}),ie=dh({inputs:{x:Z},backend:t,attrs:{reps:[F/B]}});return u.push(Z),u.push(ie),h(j,k,ie,A,_)},x=h(d,"unsortedSegmentSum",s,g,i),v=L({inputs:{x},backend:t,attrs:{shape:m}}),N=v;if(c!=null){u.push(v);let E=I.getUndoAxesPermutation(c);N=Se({inputs:{x:N},backend:t,attrs:{perm:E}})}return u.forEach(E=>t.disposeIntermediateTensorInfo(E)),N}var $E={kernelName:Cu,backendName:"webgl",kernelFunc:kV};var $V=[pS,fS,dS,hS,xS,yS,bS,wS,SS,CS,NS,ES,IS,kS,$S,RS,AS,_S,DS,OS,FS,LS,BS,MS,VS,WS,KS,qS,tS,jS,QS,ZS,JS,eC,tC,rC,oC,nC,sC,iC,lC,cC,pC,mC,fC,dC,hC,gC,xC,yC,bC,wC,vC,TC,SC,CC,EC,IC,kC,$C,AC,_C,DC,OC,FC,PC,LC,BC,MC,eS,VC,YS,UC,GC,zC,rS,WC,HC,KC,qC,XC,jC,YC,QC,ZC,JC,tN,rN,oN,nN,sN,iN,uN,cN,pN,mN,fN,dN,bN,sS,wN,vN,TN,SN,US,CN,IN,kN,$N,RN,oS,AN,_N,DN,ON,FN,GS,hN,PN,LN,BN,aS,MN,VN,UN,GN,zN,WN,HN,KN,qN,XN,jN,YN,QN,ZN,JN,eE,PS,yN,tE,rE,oE,nE,sE,iE,aE,uE,cE,pE,fE,dE,hE,gE,xE,yE,bE,xN,lS,wE,vE,TE,SE,NE,EE,cS,IE,kE,$E,NN];for(let r of $V)Vh(r);var ut={minKeypointScore:.3,lissageFenetre:3,coteMarge:.1,coteImagesPourChanger:10,cou:{label:"Cou",sens:"plusGrandEstMieux",vertAuDessusDe:50,orangeAuDessusDe:45,noteZeroEnDessousDe:30,approximation:"epaule au lieu de C7"},tronc:{label:"Tronc",sens:"plusPetitEstMieux",vertEnDessousDe:10,orangeEnDessousDe:20,noteZeroAuDessusDe:40,approximation:"epaule-hanche en 2D, sans correction de perspective"}},Ti={gauche:{oreille:"left_ear",epaule:"left_shoulder",hanche:"left_hip"},droite:{oreille:"right_ear",epaule:"right_shoulder",hanche:"right_hip"}},an={vert:"#2ecc71",orange:"#f39c12",rouge:"#e74c3c",gris:"#9aa0a6"},RV={vert:"bonne position",orange:"légèrement mauvaise",rouge:"très mauvaise",gris:"non mesurable"};function im(r){let e={};for(let t of r??[])t&&t.name&&(e[t.name]=t);return e}function Ht(r,e){return!!r&&typeof r.x=="number"&&typeof r.y=="number"&&(r.score||0)>=e}function hh(r,e){let t=Ti[e],o=[t.oreille,t.epaule,t.hanche],n=0;for(let s of o){let i=r[s];n+=i&&typeof i.score=="number"?i.score:0}return n/o.length}function OE(r){let e={cote:"gauche",score:-1};for(let t of Object.keys(Ti)){let o=hh(r,t);o>e.score&&(e={cote:t,score:o})}return e}function FE(r,e){let t=r||ut.coteImagesPourChanger,o=e===void 0?ut.coteMarge:e,n=null,s=0;return{choisir(i){let a=im(i),u=OE(a);return n?(s=u.cote!==n&&u.score-hh(a,n)>=o?s+1:0,s>=t&&(n=u.cote,s=0),n):(n=u.cote,n)},reinitialiser(){n=null,s=0}}}function AV(r,e){let t=Math.abs(e.x-r.x),o=r.y-e.y;return Math.atan2(o,t)*180/Math.PI}function _V(r,e){let t=Math.abs(e.x-r.x),o=Math.abs(e.y-r.y);return Math.atan2(t,o)*180/Math.PI}function DV(r,e,t,o,n=ut.minKeypointScore){if(!Ht(r,n)||!Ht(e,n)||!Ht(t,n)||!Ht(o,n))return null;let s=Math.sign(t.x-o.x),i=(r.x-e.x)*s;return!s||!i?null:i>0?"avant":"arriere"}function RE(r,e){return r==null||!isFinite(r)?"gris":e.sens==="plusGrandEstMieux"?r>e.vertAuDessusDe?"vert":r>=e.orangeAuDessusDe?"orange":"rouge":r<e.vertEnDessousDe?"vert":r<=e.orangeEnDessousDe?"orange":"rouge"}function AE(r,e){if(r==null||!isFinite(r))return null;if(e.sens==="plusGrandEstMieux"){let s=e.vertAuDessusDe,i=e.orangeAuDessusDe,a=e.noteZeroEnDessousDe;return r>=s?100:r>=i?60+40*(r-i)/(s-i):r<=a?0:60*(r-a)/(i-a)}let t=e.vertEnDessousDe,o=e.orangeEnDessousDe,n=e.noteZeroAuDessusDe;return r<=t?100:r<=o?100-40*(r-t)/(o-t):r>=n?0:60*(n-r)/(n-o)}function OV(r,e){let t=[AE(r,ut.cou),AE(e,ut.tronc)].filter(o=>o!==null);return t.length?t.reduce((o,n)=>o+n,0)/t.length:null}function PE(r,e){let t=e?.minKeypointScore||ut.minKeypointScore,o=im(r),n=e?.cote||OE(o).cote,s=Ti[n],i=o[s.epaule],a=o[s.oreille],u=o[s.hanche],l=Ht(i,t),c=l&&Ht(a,t)?AV(i,a):null,p=l&&Ht(u,t)?_V(i,u):null,m=RE(c,ut.cou),f=RE(p,ut.tronc),d=p===null?null:DV(i,u,o.nose,a,t);return{cote:n,confianceCote:hh(o,n),score:OV(c,p),cou:{label:ut.cou.label,angle:c,niveau:m,couleur:an[m],texte:_E(ut.cou.label,c,m)},tronc:{label:ut.tronc.label,angle:p,niveau:f,couleur:an[f],texte:_E(ut.tronc.label,p,f),sens:d}}}function _E(r,e,t){return t==="gris"||e===null?r+" : non mesurable (point absent ou peu fiable)":r+" : "+e.toFixed(0)+"° — "+RV[t]}function LE(r,e,t,o){return Ht(r,o)?r.name?r.name===t.oreille?e.cou.couleur:r.name===t.hanche?e.tronc.couleur:r.name===t.epaule?FV(e.cou.niveau,e.tronc.niveau):"#ffffff":"#ffffff":an.gris}var DE={vert:0,orange:1,rouge:2,gris:-1};function FV(r,e){let t=DE[r],o=DE[e];return t<0&&o<0?an.gris:an[t>=o?r:e]}function BE(r,e){let t=r||ut.lissageFenetre,o=e===void 0?ut.minKeypointScore:e,n={};return{lisser(s){return t<=1||!s?s||[]:s.map(i=>{let a=i?.name;if(!i||!a)return i;if(!Ht(i,o))return delete n[a],i;let u=n[a]||(n[a]=[]);u.push({x:i.x,y:i.y}),u.length>t&&u.shift();let l=0,c=0;for(let p of u)l+=p.x,c+=p.y;return{name:a,score:i.score,x:l/u.length,y:c/u.length}})},reinitialiser(){n={}}}}var WE=window;function yo(r){let e=document.getElementById(r);if(!e)throw new Error(`Élément #${r} absent de pose.html`);return e}var ur=yo("video"),lr=yo("overlay"),LV=yo("scene"),lt=lr.getContext("2d"),ME=yo("etat"),BV=yo("fps"),am=yo("cou"),gh=yo("tronc"),HE=yo("cote"),um=ut.minKeypointScore,xh=BE(),VE=FE(),MV=/[?&]mode=session\b/.test(location.search);MV&&document.body.classList.add("session");var yh=!1,VV=250,UE=0;function lm(r){WE.ReactNativeWebView?.postMessage(JSON.stringify(r))}function GE(r){let e=performance.now();if(!(e-UE<VV)){if(UE=e,!r){lm({type:"mesure",personne:!1});return}lm({type:"mesure",personne:!0,cote:r.cote,score:r.score===null?null:Math.round(r.score),cou:{angle:r.cou.angle,niveau:r.cou.niveau},tronc:{angle:r.tronc.angle,niveau:r.tronc.niveau,sens:r.tronc.sens}})}}WE.PoseControle={pause(){yh=!0,xh.reinitialiser(),lt.clearRect(0,0,lr.width,lr.height)},reprendre(){yh=!1}};function Gr(r,e=!1){ME.textContent=r,ME.className=e?"etat erreur":"etat",lm({type:e?"erreur":"etat",message:r})}function bh(r,e){Gr(r+" : "+(e instanceof Error?e.name+" — "+e.message:String(e)),!0)}async function UV(){if(!window.isSecureContext)return Gr("Contexte NON sécurisé ("+location.protocol+"//"+location.host+"). getUserMedia est indisponible : la page doit être servie en https (tunnel).",!0),!1;if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return Gr("navigator.mediaDevices.getUserMedia absent de cette WebView.",!0),!1;Gr("Demande d’accès à la caméra…");let r;try{r=await navigator.mediaDevices.getUserMedia({audio:!1,video:{facingMode:"user",width:{ideal:640},height:{ideal:480}}})}catch(e){return bh("Caméra refusée ou indisponible",e),!1}return ur.srcObject=r,await new Promise(e=>{if(ur.readyState>=2)return e();ur.onloadedmetadata=()=>e()}),await ur.play(),lr.width=ur.videoWidth,lr.height=ur.videoHeight,LV.style.aspectRatio=ur.videoWidth+" / "+ur.videoHeight,Gr("Caméra OK ("+ur.videoWidth+"×"+ur.videoHeight+")."),!0}async function GV(){Gr("Chargement du backend WebGL…");try{await dg("webgl"),await hg()}catch(r){return bh("Backend WebGL indisponible",r),null}Gr("Téléchargement du modèle MoveNet…");try{return await xv(et.MoveNet,{modelType:yv.modelType.SINGLEPOSE_LIGHTNING})}catch(r){return bh("Chargement de MoveNet",r),null}}function zV(r,e){lt.clearRect(0,0,lr.width,lr.height);let t=im(r),o=Ti[e.cote];zE(t[o.epaule],t[o.oreille],e.cou.couleur),zE(t[o.epaule],t[o.hanche],e.tronc.couleur);let n=Math.max(5,lr.width/70);for(let s of[t[o.oreille],t[o.epaule],t[o.hanche]])Ht(s,um)&&(lt.fillStyle=LE(s,e,o,um),lt.beginPath(),lt.arc(s.x,s.y,n,0,Math.PI*2),lt.fill(),lt.lineWidth=1.5,lt.strokeStyle="rgba(0,0,0,0.5)",lt.stroke())}function zE(r,e,t){!Ht(r,um)||!Ht(e,um)||(lt.strokeStyle=t,lt.lineWidth=Math.max(4,lr.width/90),lt.beginPath(),lt.moveTo(r.x,r.y),lt.lineTo(e.x,e.y),lt.stroke())}function WV(r){am.textContent=r.cou.texte,am.style.color=r.cou.couleur,gh.textContent=r.tronc.texte,gh.style.color=r.tronc.couleur,HE.textContent="côté "+r.cote+" (confiance "+(r.confianceCote||0).toFixed(2)+")"}function HV(r){am.textContent=r,am.style.color=an.gris,gh.textContent="",HE.textContent=""}async function KV(r){let e=performance.now(),t=0;async function o(){if(yh){requestAnimationFrame(o);return}let n;try{n=await r.estimatePoses(ur,{flipHorizontal:!1})}catch(a){Gr("Inférence échouée : "+(a instanceof Error?a.message:String(a)),!0);return}let s=n[0]?.keypoints;if(s){let a=xh.lisser(s),u=PE(a,{cote:VE.choisir(a)});zV(a,u),WV(u),GE(u)}else xh.reinitialiser(),VE.reinitialiser(),lt.clearRect(0,0,lr.width,lr.height),HV("Personne détectée : non mesurable"),GE(null);t++;let i=performance.now();if(i-e>=500){let a=t*1e3/(i-e);BV.textContent=a.toFixed(1)+" FPS",t=0,e=i}requestAnimationFrame(o)}requestAnimationFrame(o)}async function qV(){if(!await UV())return;let r=await GV();r&&(Gr("Modèle prêt — backend "+$r()+"."),lm({type:"pret",message:"camera + movenet OK"}),await KV(r))}qV();})();
/*! Bundled license information:

@tensorflow/tfjs-core/dist/backends/backend.js:
@tensorflow/tfjs-core/dist/util_base.js:
@tensorflow/tfjs-core/dist/global_util.js:
@tensorflow/tfjs-core/dist/ops/complex.js:
@tensorflow/tfjs-core/dist/ops/clone.js:
@tensorflow/tfjs-core/dist/ops/add.js:
@tensorflow/tfjs-core/dist/ops/floorDiv.js:
@tensorflow/tfjs-core/dist/ops/div.js:
@tensorflow/tfjs-core/dist/ops/mul.js:
@tensorflow/tfjs-core/dist/ops/add_n.js:
@tensorflow/tfjs-core/dist/ops/all.js:
@tensorflow/tfjs-core/dist/ops/any.js:
@tensorflow/tfjs-core/dist/ops/atan2.js:
@tensorflow/tfjs-core/dist/ops/conv_util.js:
@tensorflow/tfjs-core/dist/ops/reshape.js:
@tensorflow/tfjs-core/dist/ops/avg_pool.js:
@tensorflow/tfjs-core/dist/ops/avg_pool_3d.js:
@tensorflow/tfjs-core/dist/ops/concat.js:
@tensorflow/tfjs-core/dist/ops/mat_mul.js:
@tensorflow/tfjs-core/dist/ops/basic_lstm_cell.js:
@tensorflow/tfjs-core/dist/ops/batch_to_space_nd.js:
@tensorflow/tfjs-core/dist/ops/batchnorm.js:
@tensorflow/tfjs-core/dist/ops/bincount.js:
@tensorflow/tfjs-core/dist/ops/broadcast_to.js:
@tensorflow/tfjs-core/dist/ops/fill.js:
@tensorflow/tfjs-core/dist/ops/conv2d.js:
@tensorflow/tfjs-core/dist/ops/conv2d_backprop_input.js:
@tensorflow/tfjs-core/dist/ops/conv3d.js:
@tensorflow/tfjs-core/dist/ops/conv3d_backprop_input.js:
@tensorflow/tfjs-core/dist/ops/dense_bincount.js:
@tensorflow/tfjs-core/dist/ops/depth_to_space.js:
@tensorflow/tfjs-core/dist/ops/depthwise_conv2d.js:
@tensorflow/tfjs-core/dist/ops/diag.js:
@tensorflow/tfjs-core/dist/ops/dilation2d.js:
@tensorflow/tfjs-core/dist/ops/equal.js:
@tensorflow/tfjs-core/dist/ops/where.js:
@tensorflow/tfjs-core/dist/ops/div_no_nan.js:
@tensorflow/tfjs-core/dist/ops/dot.js:
@tensorflow/tfjs-core/dist/ops/elu.js:
@tensorflow/tfjs-core/dist/ops/max.js:
@tensorflow/tfjs-core/dist/ops/pow.js:
@tensorflow/tfjs-core/dist/ops/expand_dims.js:
@tensorflow/tfjs-core/dist/ops/tile.js:
@tensorflow/tfjs-core/dist/ops/eye.js:
@tensorflow/tfjs-core/dist/ops/greater.js:
@tensorflow/tfjs-core/dist/ops/greater_equal.js:
@tensorflow/tfjs-core/dist/ops/imag.js:
@tensorflow/tfjs-core/dist/ops/leaky_relu.js:
@tensorflow/tfjs-core/dist/ops/less.js:
@tensorflow/tfjs-core/dist/ops/less_equal.js:
@tensorflow/tfjs-core/dist/ops/local_response_normalization.js:
@tensorflow/tfjs-core/dist/ops/sub.js:
@tensorflow/tfjs-core/dist/ops/log_sum_exp.js:
@tensorflow/tfjs-core/dist/ops/logical_and.js:
@tensorflow/tfjs-core/dist/ops/logical_not.js:
@tensorflow/tfjs-core/dist/ops/logical_or.js:
@tensorflow/tfjs-core/dist/ops/logical_xor.js:
@tensorflow/tfjs-core/dist/ops/max_pool.js:
@tensorflow/tfjs-core/dist/ops/max_pool_3d.js:
@tensorflow/tfjs-core/dist/ops/maximum.js:
@tensorflow/tfjs-core/dist/ops/minimum.js:
@tensorflow/tfjs-core/dist/ops/mirror_pad.js:
@tensorflow/tfjs-core/dist/ops/mod.js:
@tensorflow/tfjs-core/dist/ops/moments.js:
@tensorflow/tfjs-core/dist/ops/multinomial.js:
@tensorflow/tfjs-core/dist/ops/not_equal.js:
@tensorflow/tfjs-core/dist/ops/one_hot.js:
@tensorflow/tfjs-core/dist/ops/pad.js:
@tensorflow/tfjs-core/dist/ops/space_to_batch_nd.js:
@tensorflow/tfjs-core/dist/ops/prelu.js:
@tensorflow/tfjs-core/dist/ops/prod.js:
@tensorflow/tfjs-core/dist/ops/rand.js:
@tensorflow/tfjs-core/dist/ops/random_gamma.js:
@tensorflow/tfjs-core/dist/ops/random_normal.js:
@tensorflow/tfjs-core/dist/ops/random_uniform.js:
@tensorflow/tfjs-core/dist/ops/real.js:
@tensorflow/tfjs-core/dist/ops/relu.js:
@tensorflow/tfjs-core/dist/ops/relu6.js:
@tensorflow/tfjs-core/dist/ops/reverse_1d.js:
@tensorflow/tfjs-core/dist/ops/reverse_2d.js:
@tensorflow/tfjs-core/dist/ops/reverse_3d.js:
@tensorflow/tfjs-core/dist/ops/reverse_4d.js:
@tensorflow/tfjs-core/dist/ops/selu.js:
@tensorflow/tfjs-core/dist/ops/spectral/fft.js:
@tensorflow/tfjs-core/dist/ops/spectral/ifft.js:
@tensorflow/tfjs-core/dist/ops/split.js:
@tensorflow/tfjs-core/dist/ops/squared_difference.js:
@tensorflow/tfjs-core/dist/ops/squeeze.js:
@tensorflow/tfjs-core/dist/ops/stack.js:
@tensorflow/tfjs-core/dist/ops/truncated_normal.js:
@tensorflow/tfjs-core/dist/ops/unique.js:
@tensorflow/tfjs-core/dist/ops/unsorted_segment_sum.js:
@tensorflow/tfjs-core/dist/ops/unstack.js:
@tensorflow/tfjs-core/dist/ops/where_async.js:
@tensorflow/tfjs-core/dist/ops/conv2d_backprop_filter.js:
@tensorflow/tfjs-core/dist/ops/depthwise_conv2d_native_backprop_filter.js:
@tensorflow/tfjs-core/dist/ops/depthwise_conv2d_native_backprop_input.js:
@tensorflow/tfjs-core/dist/ops/image/crop_and_resize.js:
@tensorflow/tfjs-core/dist/ops/image/flip_left_right.js:
@tensorflow/tfjs-core/dist/ops/image/rotate_with_offset.js:
@tensorflow/tfjs-core/dist/ops/nonmax_util.js:
@tensorflow/tfjs-core/dist/ops/image/non_max_suppression.js:
@tensorflow/tfjs-core/dist/backends/non_max_suppression_impl.js:
@tensorflow/tfjs-core/dist/ops/image/non_max_suppression_async.js:
@tensorflow/tfjs-core/dist/ops/image/non_max_suppression_with_score.js:
@tensorflow/tfjs-core/dist/ops/image/non_max_suppression_with_score_async.js:
@tensorflow/tfjs-core/dist/ops/image/non_max_suppression_padded.js:
@tensorflow/tfjs-core/dist/ops/image/non_max_suppression_padded_async.js:
@tensorflow/tfjs-core/dist/ops/image/resize_bilinear.js:
@tensorflow/tfjs-core/dist/ops/image/resize_nearest_neighbor.js:
@tensorflow/tfjs-core/dist/ops/linalg/band_part.js:
@tensorflow/tfjs-core/dist/ops/linalg/gram_schmidt.js:
@tensorflow/tfjs-core/dist/ops/linalg/qr.js:
@tensorflow/tfjs-core/dist/ops/loss_ops_utils.js:
@tensorflow/tfjs-core/dist/ops/losses/absolute_difference.js:
@tensorflow/tfjs-core/dist/ops/losses/huber_loss.js:
@tensorflow/tfjs-core/dist/ops/losses/log_loss.js:
@tensorflow/tfjs-core/dist/ops/losses/mean_squared_error.js:
@tensorflow/tfjs-core/dist/ops/losses/sigmoid_cross_entropy.js:
@tensorflow/tfjs-core/dist/ops/losses/softmax_cross_entropy.js:
@tensorflow/tfjs-core/dist/ops/ops.js:
@tensorflow/tfjs-core/dist/ops/rotate_util.js:
@tensorflow/tfjs-core/dist/backends/kernel_impls.js:
@tensorflow/tfjs-core/dist/ops/ops_for_converter.js:
@tensorflow/tfjs-converter/dist/executor/tensor_utils.js:
@tensorflow/tfjs-converter/dist/executor/tensor_list.js:
@tensorflow/tfjs-converter/dist/executor/hash_table.js:
@tensorflow/tfjs-converter/dist/operations/executors/hash_table_executor.js:
@tensorflow/tfjs-backend-cpu/dist/utils/binary_impl.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/Complex.js:
@tensorflow/tfjs-backend-cpu/dist/utils/zeros_impl.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/Identity.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/Real.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/Cast.js:
@tensorflow/tfjs-backend-cpu/dist/utils/binary_utils.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/Add.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/Bincount_impl.js:
@tensorflow/tfjs-backend-cpu/dist/utils/unary_impl.js:
@tensorflow/tfjs-backend-cpu/dist/utils/unary_utils.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/Concat_impl.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/Equal.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/FloorDiv.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/GatherV2_impl.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/Greater.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/GreaterEqual.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/Less.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/LessEqual.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/LinSpace_impl.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/Max_impl.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/Maximum.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/Minimum.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/Multiply.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/Neg.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/NotEqual.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/Transpose_impl.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/Prod.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/Range_impl.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/Scatter_impl.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/Slice.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/SquaredDifference.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/StridedSlice_impl.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/Sub.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/TopK_impl.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/Unique_impl.js:
@tensorflow/tfjs-backend-cpu/dist/shared.js:
@tensorflow/tfjs-backend-webgl/dist/kernel_utils/shared.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Identity.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Complex.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/LeakyRelu.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Prelu.js:
@tensorflow/tfjs-backend-webgl/dist/kernel_utils/kernel_funcs_utils.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Multiply.js:
@tensorflow/tfjs-backend-webgl/dist/kernel_utils/reshape.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Reshape.js:
@tensorflow/tfjs-backend-webgl/dist/mean_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/kernel_utils/reduce.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Transpose_impl.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Sum_impl.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Sum.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Transpose.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/BatchMatMul_impl.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Abs.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Acos.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Acosh.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Add.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/AddN.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/All.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Any.js:
@tensorflow/tfjs-backend-webgl/dist/kernel_utils/arg_min_max.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/ArgMax.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/ArgMin.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Asin.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Asinh.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Atan.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Atan2.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Atanh.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/AvgPool.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/AvgPool3D.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/AvgPool3DGrad.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/AvgPoolGrad.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/BatchMatMul.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/BatchNorm.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Slice.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/BatchToSpaceND.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Bincount.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/NotEqual.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Real.js:
@tensorflow/tfjs-backend-webgl/dist/kernel_utils/int.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Cast.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Ceil.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/ClipByValue.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/ComplexAbs.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Imag.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Concat_impl.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Concat.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Conv2D_impl.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Conv2D.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Conv2DBackpropFilter.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Conv2DBackpropInput.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Conv3D.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Conv3DBackpropFilterV2.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Conv3DBackpropInputV2.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Cos.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Cosh.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/CropAndResize.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/DenseBincount.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/DepthToSpace.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/DepthwiseConv2dNative.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/DepthwiseConv2dNativeBackpropFilter.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/DepthwiseConv2dNativeBackpropInput.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Diag.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Dilation2D.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Elu.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/EluGrad.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Equal.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Erf.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Exp.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Expm1.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/FFT_impl.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/FFT.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Fill.js:
@tensorflow/tfjs-backend-webgl/dist/flip_left_right_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/FlipLeftRight.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Floor.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/FloorDiv.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/FusedConv2D.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/FusedDepthwiseConv2D.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/GatherNd.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/GatherV2.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Greater.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/GreaterEqual.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/IFFT.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/IsFinite.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/IsInf.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/IsNaN.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Less.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/LessEqual.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/LinSpace.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Log.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Log1p.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/LogicalAnd.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/LogicalNot.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/LogicalOr.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/LRN.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/LRNGrad.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Max_impl.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Max.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Maximum.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/MaxPool.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/MaxPool3D.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/MaxPool3DGrad.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/MaxPoolGrad.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/MaxPoolWithArgmax_impl.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/MaxPoolWithArgmax.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Mean_impl.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Mean.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Min.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Minimum.js:
@tensorflow/tfjs-backend-webgl/dist/mirror_pad_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/mirror_pad_packed_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/MirrorPad.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Mod.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/RealDiv.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Sub.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Softmax.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Multinomial.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Neg.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/NonMaxSuppressionV3.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/NonMaxSuppressionV4.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/NonMaxSuppressionV5.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/OneHot.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/ZerosLike.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/OnesLike.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Pack.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/PadV2.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Pow.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Prod.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Range.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Reciprocal.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Relu.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Relu6.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/ResizeBilinear.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/ResizeBilinearGrad.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/ResizeNearestNeighbor.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/ResizeNearestNeighborGrad.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Reverse.js:
@tensorflow/tfjs-backend-webgl/dist/rotate_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/RotateWithOffset.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Round.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Rsqrt.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/ScatterNd.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Select.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Selu.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Sigmoid.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Sign.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Sin.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Sinh.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Softplus.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/SpaceToBatchND.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/SparseToDense.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/SplitV.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Sqrt.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/SquaredDifference.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Step.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/StridedSlice.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Tan.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Tanh.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Tile.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/TopK.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Unpack.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/UnsortedSegmentSum.js:
@tensorflow/tfjs-backend-webgl/dist/register_all_kernels.js:
@tensorflow/tfjs-backend-webgl/dist/index.js:
  (**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-core/dist/environment.js:
@tensorflow/tfjs-core/dist/util.js:
@tensorflow/tfjs-core/dist/tape.js:
@tensorflow/tfjs-core/dist/tensor.js:
@tensorflow/tfjs-core/dist/types.js:
@tensorflow/tfjs-core/dist/device_util.js:
@tensorflow/tfjs-core/dist/ops/broadcast_util.js:
@tensorflow/tfjs-core/dist/ops/axis_util.js:
@tensorflow/tfjs-core/dist/browser_util.js:
@tensorflow/tfjs-core/dist/ops/concat_util.js:
@tensorflow/tfjs-core/dist/ops/reduce_util.js:
@tensorflow/tfjs-core/dist/index.js:
@tensorflow/tfjs-backend-webgl/dist/tex_util.js:
@tensorflow/tfjs-backend-webgl/dist/webgl_util.js:
@tensorflow/tfjs-backend-webgl/dist/shader_compiler.js:
@tensorflow/tfjs-backend-webgl/dist/gpgpu_math.js:
@tensorflow/tfjs-backend-webgl/dist/gpgpu_util.js:
@tensorflow/tfjs-backend-webgl/dist/gpgpu_context.js:
@tensorflow/tfjs-backend-webgl/dist/texture_manager.js:
@tensorflow/tfjs-backend-webgl/dist/unaryop_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/backend_webgl.js:
@tensorflow/tfjs-backend-webgl/dist/binaryop_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/reduce_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/transpose_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/argminmax_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/pool_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/avg_pool_backprop_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/batchnorm_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/slice_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/clip_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/concat_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/conv_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/conv_backprop_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/crop_and_resize_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/conv_gpu_depthwise.js:
@tensorflow/tfjs-backend-webgl/dist/dilation_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/gather_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/lrn_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/max_pool_backprop_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/multinomial_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/onehot_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/pad_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/resize_bilinear_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/reverse_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/select_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/strided_slice_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/tile_gpu.js:
  (**
   * @license
   * Copyright 2017 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-core/dist/log.js:
@tensorflow/tfjs-core/dist/profiler.js:
@tensorflow/tfjs-core/dist/tensor_format.js:
@tensorflow/tfjs-core/dist/tensor_util.js:
@tensorflow/tfjs-core/dist/engine.js:
@tensorflow/tfjs-core/dist/tensor_util_env.js:
@tensorflow/tfjs-core/dist/ops/operation.js:
@tensorflow/tfjs-core/dist/ops/tensor_ops_util.js:
@tensorflow/tfjs-core/dist/ops/tensor.js:
@tensorflow/tfjs-core/dist/io/types.js:
@tensorflow/tfjs-core/dist/globals.js:
@tensorflow/tfjs-core/dist/io/io_utils.js:
@tensorflow/tfjs-core/dist/io/router_registry.js:
@tensorflow/tfjs-core/dist/io/indexed_db.js:
@tensorflow/tfjs-core/dist/io/local_storage.js:
@tensorflow/tfjs-core/dist/io/model_management.js:
@tensorflow/tfjs-core/dist/ops/abs.js:
@tensorflow/tfjs-core/dist/ops/acos.js:
@tensorflow/tfjs-core/dist/ops/acosh.js:
@tensorflow/tfjs-core/dist/ops/asin.js:
@tensorflow/tfjs-core/dist/ops/asinh.js:
@tensorflow/tfjs-core/dist/ops/atan.js:
@tensorflow/tfjs-core/dist/ops/atanh.js:
@tensorflow/tfjs-core/dist/ops/sigmoid.js:
@tensorflow/tfjs-core/dist/ops/slice.js:
@tensorflow/tfjs-core/dist/ops/tanh.js:
@tensorflow/tfjs-core/dist/ops/ceil.js:
@tensorflow/tfjs-core/dist/ops/clip_by_value.js:
@tensorflow/tfjs-core/dist/ops/cos.js:
@tensorflow/tfjs-core/dist/ops/cosh.js:
@tensorflow/tfjs-core/dist/ops/cumsum.js:
@tensorflow/tfjs-core/dist/ops/zeros_like.js:
@tensorflow/tfjs-core/dist/ops/erf.js:
@tensorflow/tfjs-core/dist/ops/scalar.js:
@tensorflow/tfjs-core/dist/ops/sqrt.js:
@tensorflow/tfjs-core/dist/ops/sum.js:
@tensorflow/tfjs-core/dist/ops/norm.js:
@tensorflow/tfjs-core/dist/ops/exp.js:
@tensorflow/tfjs-core/dist/ops/expm1.js:
@tensorflow/tfjs-core/dist/ops/floor.js:
@tensorflow/tfjs-core/dist/ops/gather.js:
@tensorflow/tfjs-core/dist/ops/is_finite.js:
@tensorflow/tfjs-core/dist/ops/is_inf.js:
@tensorflow/tfjs-core/dist/ops/is_nan.js:
@tensorflow/tfjs-core/dist/ops/linspace.js:
@tensorflow/tfjs-core/dist/ops/log.js:
@tensorflow/tfjs-core/dist/ops/log1p.js:
@tensorflow/tfjs-core/dist/gradients.js:
@tensorflow/tfjs-core/dist/ops/neg.js:
@tensorflow/tfjs-core/dist/ops/softplus.js:
@tensorflow/tfjs-core/dist/ops/log_sigmoid.js:
@tensorflow/tfjs-core/dist/ops/max_pool_with_argmax.js:
@tensorflow/tfjs-core/dist/ops/zeros.js:
@tensorflow/tfjs-core/dist/ops/ones.js:
@tensorflow/tfjs-core/dist/ops/ones_like.js:
@tensorflow/tfjs-core/dist/ops/pool.js:
@tensorflow/tfjs-core/dist/ops/rand_util.js:
@tensorflow/tfjs-core/dist/ops/range.js:
@tensorflow/tfjs-core/dist/ops/reciprocal.js:
@tensorflow/tfjs-core/dist/ops/reverse.js:
@tensorflow/tfjs-core/dist/ops/round.js:
@tensorflow/tfjs-core/dist/ops/rsqrt.js:
@tensorflow/tfjs-core/dist/ops/sign.js:
@tensorflow/tfjs-core/dist/ops/sin.js:
@tensorflow/tfjs-core/dist/ops/sinh.js:
@tensorflow/tfjs-core/dist/ops/slice1d.js:
@tensorflow/tfjs-core/dist/ops/slice2d.js:
@tensorflow/tfjs-core/dist/ops/slice3d.js:
@tensorflow/tfjs-core/dist/ops/slice4d.js:
@tensorflow/tfjs-core/dist/ops/softmax.js:
@tensorflow/tfjs-core/dist/ops/spectral/irfft.js:
@tensorflow/tfjs-core/dist/ops/spectral/rfft.js:
@tensorflow/tfjs-core/dist/ops/step.js:
@tensorflow/tfjs-core/dist/ops/strided_slice.js:
@tensorflow/tfjs-core/dist/ops/tan.js:
@tensorflow/tfjs-core/dist/ops/tensor1d.js:
@tensorflow/tfjs-core/dist/ops/tensor2d.js:
@tensorflow/tfjs-core/dist/ops/tensor3d.js:
@tensorflow/tfjs-core/dist/ops/tensor4d.js:
@tensorflow/tfjs-core/dist/ops/tensor5d.js:
@tensorflow/tfjs-core/dist/ops/tensor6d.js:
@tensorflow/tfjs-core/dist/ops/topk.js:
@tensorflow/tfjs-core/dist/ops/variable.js:
@tensorflow/tfjs-core/dist/backends/where_impl.js:
@tensorflow/tfjs-core/dist/ops/boolean_mask.js:
@tensorflow/tfjs-core/dist/ops/transpose.js:
@tensorflow/tfjs-core/dist/ops/moving_average.js:
@tensorflow/tfjs-core/dist/ops/scatter_nd.js:
@tensorflow/tfjs-core/dist/ops/sparse_to_dense.js:
@tensorflow/tfjs-core/dist/ops/gather_nd.js:
@tensorflow/tfjs-core/dist/ops/dropout.js:
@tensorflow/tfjs-core/dist/serialization.js:
@tensorflow/tfjs-core/dist/optimizers/optimizer.js:
@tensorflow/tfjs-core/dist/optimizers/adadelta_optimizer.js:
@tensorflow/tfjs-core/dist/optimizers/adagrad_optimizer.js:
@tensorflow/tfjs-core/dist/optimizers/adam_optimizer.js:
@tensorflow/tfjs-core/dist/optimizers/adamax_optimizer.js:
@tensorflow/tfjs-core/dist/optimizers/sgd_optimizer.js:
@tensorflow/tfjs-core/dist/optimizers/momentum_optimizer.js:
@tensorflow/tfjs-core/dist/optimizers/rmsprop_optimizer.js:
@tensorflow/tfjs-core/dist/io/browser_files.js:
@tensorflow/tfjs-core/dist/io/weights_loader.js:
@tensorflow/tfjs-core/dist/io/http.js:
@tensorflow/tfjs-core/dist/io/passthrough.js:
@tensorflow/tfjs-core/dist/io/io.js:
@tensorflow/tfjs-core/dist/ops/array_ops_util.js:
@tensorflow/tfjs-core/dist/ops/selu_util.js:
@tensorflow/tfjs-core/dist/ops/erf_util.js:
@tensorflow/tfjs-core/dist/backends/complex_util.js:
@tensorflow/tfjs-core/dist/ops/segment_util.js:
@tensorflow/tfjs-core/dist/backends/backend_util.js:
@tensorflow/tfjs-converter/dist/operations/executors/utils.js:
@tensorflow/tfjs-converter/dist/operations/operation_mapper.js:
@tensorflow/tfjs-converter/dist/operations/executors/arithmetic_executor.js:
@tensorflow/tfjs-converter/dist/operations/executors/basic_math_executor.js:
@tensorflow/tfjs-converter/dist/executor/tensor_array.js:
@tensorflow/tfjs-converter/dist/operations/executors/control_executor.js:
@tensorflow/tfjs-converter/dist/operations/executors/convolution_executor.js:
@tensorflow/tfjs-converter/dist/operations/executors/creation_executor.js:
@tensorflow/tfjs-converter/dist/operations/executors/dynamic_executor.js:
@tensorflow/tfjs-converter/dist/operations/executors/evaluation_executor.js:
@tensorflow/tfjs-converter/dist/operations/executors/graph_executor.js:
@tensorflow/tfjs-converter/dist/operations/executors/image_executor.js:
@tensorflow/tfjs-converter/dist/operations/executors/logical_executor.js:
@tensorflow/tfjs-converter/dist/operations/executors/matrices_executor.js:
@tensorflow/tfjs-converter/dist/operations/executors/normalization_executor.js:
@tensorflow/tfjs-converter/dist/operations/executors/reduction_executor.js:
@tensorflow/tfjs-converter/dist/operations/executors/slice_join_executor.js:
@tensorflow/tfjs-converter/dist/operations/executors/spectral_executor.js:
@tensorflow/tfjs-converter/dist/operations/executors/transformation_executor.js:
@tensorflow/tfjs-converter/dist/operations/operation_executor.js:
@tensorflow/tfjs-converter/dist/executor/graph_executor.js:
@tensorflow/tfjs-converter/dist/executor/graph_model.js:
@tensorflow/tfjs-converter/dist/index.js:
@tensorflow/tfjs-backend-webgl/dist/canvas_util.js:
@tensorflow/tfjs-backend-webgl/dist/glsl_version.js:
@tensorflow/tfjs-backend-webgl/dist/shader_compiler_util.js:
@tensorflow/tfjs-backend-webgl/dist/encode_float_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/encode_float_packed_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/encode_matrix_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/encode_matrix_packed_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/packing_util.js:
@tensorflow/tfjs-backend-webgl/dist/pack_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/reshape_packed_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/unaryop_packed_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/unpack_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/binaryop_packed_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/mulmat_packed_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/binaryop_complex_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/batchnorm_packed_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/clip_packed_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/complex_abs_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/depth_to_space_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/conv_packed_gpu_depthwise.js:
@tensorflow/tfjs-backend-webgl/dist/conv_backprop_gpu_depthwise.js:
@tensorflow/tfjs-backend-webgl/dist/fft_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/FromPixels_utils/from_pixels_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/FromPixels_utils/from_pixels_packed_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/lrn_grad_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/resize_bilinear_backprop_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/resize_nearest_neighbor_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/resize_nearest_neighbor_backprop_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/scatter_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/segment_gpu.js:
  (**
   * @license
   * Copyright 2018 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-core/dist/kernel_registry.js:
@tensorflow/tfjs-core/dist/flags.js:
@tensorflow/tfjs-core/dist/platforms/platform_browser.js:
@tensorflow/tfjs-core/dist/platforms/platform_node.js:
@tensorflow/tfjs-core/dist/ops/square.js:
@tensorflow/tfjs-core/dist/ops/dropout_util.js:
@tensorflow/tfjs-core/dist/ops/signal_ops_util.js:
@tensorflow/tfjs-core/dist/ops/in_top_k.js:
@tensorflow/tfjs-core/dist/ops/fused_util.js:
@tensorflow/tfjs-core/dist/ops/fused/conv2d.js:
@tensorflow/tfjs-core/dist/ops/fused/depthwise_conv2d.js:
@tensorflow/tfjs-core/dist/ops/fused/mat_mul.js:
@tensorflow/tfjs-core/dist/ops/fused_ops.js:
@tensorflow/tfjs-core/dist/ops/signal/hamming_window.js:
@tensorflow/tfjs-core/dist/ops/signal/hann_window.js:
@tensorflow/tfjs-core/dist/ops/signal/frame.js:
@tensorflow/tfjs-core/dist/ops/signal/stft.js:
@tensorflow/tfjs-core/dist/backends/non_max_suppression_util.js:
@tensorflow/tfjs-core/dist/io/progress.js:
@tensorflow/tfjs-core/dist/ops/browser.js:
@tensorflow/tfjs-converter/dist/operations/custom_op/register.js:
@tensorflow/tfjs-converter/dist/operations/custom_op/node_value_impl.js:
@tensorflow/tfjs-converter/dist/executor/model_analysis.js:
@tensorflow/tfjs-backend-webgl/dist/flags_webgl.js:
@tensorflow/tfjs-backend-webgl/dist/decode_matrix_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/decode_matrix_packed_gpu.js:
@tensorflow/tfjs-backend-cpu/dist/cpu_util.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/Tile_impl.js:
@tensorflow/tfjs-backend-webgl/dist/transpose_packed_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/addn_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/addn_packed_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/argminmax_packed_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/slice_packed_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/concat_packed_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/im2col_packed_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/diag_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/fill_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/FromPixels.js:
@tensorflow/tfjs-backend-webgl/dist/lrn_packed_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/pad_packed_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/resize_bilinear_packed_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/resize_nearest_neighbor_packed_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/reverse_packed_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Square.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-core/dist/platforms/is_typed_array_browser.js:
@tensorflow/tfjs-core/dist/ops/bitwise_and.js:
@tensorflow/tfjs-core/dist/ops/ensure_shape.js:
@tensorflow/tfjs-core/dist/ops/random_uniform_int.js:
@tensorflow/tfjs-core/dist/ops/image/rgb_to_grayscale.js:
@tensorflow/tfjs-core/dist/ops/string/static_regex_replace.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/BitwiseAnd.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/StaticRegexReplace.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/BitwiseAnd.js:
@tensorflow/tfjs-backend-webgl/dist/conv_backprop_packed_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/scatter_packed_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/StaticRegexReplace.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-core/dist/hash_util.js:
@tensorflow/tfjs-core/dist/ops/broadcast_args.js:
@tensorflow/tfjs-core/dist/ops/einsum.js:
@tensorflow/tfjs-core/dist/ops/meshgrid.js:
@tensorflow/tfjs-core/dist/ops/image/grayscale_to_rgb.js:
@tensorflow/tfjs-core/dist/ops/image/transform.js:
@tensorflow/tfjs-core/dist/ops/sparse/sparse_fill_empty_rows.js:
@tensorflow/tfjs-core/dist/ops/sparse/sparse_reshape.js:
@tensorflow/tfjs-core/dist/ops/sparse/sparse_segment_mean.js:
@tensorflow/tfjs-core/dist/ops/sparse/sparse_segment_sum.js:
@tensorflow/tfjs-core/dist/ops/string/string_n_grams.js:
@tensorflow/tfjs-core/dist/ops/string/string_split.js:
@tensorflow/tfjs-core/dist/ops/string/string_to_hash_bucket_fast.js:
@tensorflow/tfjs-core/dist/ops/slice_util.js:
@tensorflow/tfjs-core/dist/backends/einsum_util.js:
@tensorflow/tfjs-core/dist/ops/sparse/sparse_fill_empty_rows_util.js:
@tensorflow/tfjs-core/dist/ops/sparse/sparse_reshape_util.js:
@tensorflow/tfjs-core/dist/ops/sparse/sparse_segment_reduction_util.js:
@tensorflow/tfjs-converter/dist/flags.js:
@tensorflow/tfjs-converter/dist/operations/executors/sparse_executor.js:
@tensorflow/tfjs-converter/dist/operations/executors/string_executor.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/GatherNd_Impl.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/SparseFillEmptyRows_impl.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/SparseReshape_impl.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/SparseSegmentReduction_impl.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/StringNGrams_impl.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/StringSplit_impl.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/StringToHashBucketFast_impl.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/BroadcastArgs.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Einsum.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/SparseFillEmptyRows.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/SparseReshape.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/SparseSegmentMean.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/SparseSegmentSum.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/StringNGrams.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/StringSplit.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/StringToHashBucketFast.js:
@tensorflow/tfjs-backend-webgl/dist/transform_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Transform.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-core/dist/ops/buffer.js:
@tensorflow/tfjs-core/dist/ops/cast.js:
@tensorflow/tfjs-core/dist/ops/print.js:
@tensorflow/tfjs-core/dist/base_side_effects.js:
@tensorflow/tfjs-core/dist/ops/arg_max.js:
@tensorflow/tfjs-core/dist/ops/arg_min.js:
@tensorflow/tfjs-core/dist/ops/min.js:
@tensorflow/tfjs-core/dist/ops/log_softmax.js:
@tensorflow/tfjs-core/dist/ops/mean.js:
@tensorflow/tfjs-core/dist/ops/setdiff1d_async.js:
@tensorflow/tfjs-core/dist/base.js:
@tensorflow/tfjs-backend-webgl/dist/base.js:
  (**
   * @license
   * Copyright 2020 Google Inc. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-core/dist/ops/cumprod.js:
  (**
   * @license
   * Copyright 2022 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the 'License');
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an 'AS IS' BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-core/dist/ops/euclidean_norm.js:
@tensorflow/tfjs-core/dist/ops/search_sorted.js:
@tensorflow/tfjs-core/dist/ops/lower_bound.js:
@tensorflow/tfjs-core/dist/ops/ragged_gather.js:
@tensorflow/tfjs-core/dist/ops/ragged_tensor_to_tensor.js:
@tensorflow/tfjs-core/dist/ops/random_standard_normal.js:
@tensorflow/tfjs-core/dist/ops/tensor_scatter_update.js:
@tensorflow/tfjs-core/dist/ops/upper_bound.js:
@tensorflow/tfjs-core/dist/ops/ragged_to_dense_util.js:
@tensorflow/tfjs-converter/dist/operations/executors/ragged_executor.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/RaggedGather_impl.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/RaggedTensorToTensor_impl.js:
@tensorflow/tfjs-backend-webgl/dist/conv_packed_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Cum_impl.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Cumprod.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Cumsum.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/RaggedGather.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/RaggedTensorToTensor.js:
@tensorflow/tfjs-backend-webgl/dist/search_sorted_gpu.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/SearchSorted.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/TensorScatterUpdate.js:
  (**
   * @license
   * Copyright 2022 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-core/dist/ops/ragged_range.js:
@tensorflow/tfjs-core/dist/optimizers/register_optimizers.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/RaggedRange_impl.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/RaggedRange.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-core/dist/ops/image/threshold.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * https://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-converter/dist/data/compiled_api.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *
   * =============================================================================
   *)

@tensorflow/tfjs-converter/dist/operations/op_list/arithmetic.js:
@tensorflow/tfjs-converter/dist/operations/op_list/basic_math.js:
@tensorflow/tfjs-converter/dist/operations/op_list/control.js:
@tensorflow/tfjs-converter/dist/operations/op_list/convolution.js:
@tensorflow/tfjs-converter/dist/operations/op_list/creation.js:
@tensorflow/tfjs-converter/dist/operations/op_list/dynamic.js:
@tensorflow/tfjs-converter/dist/operations/op_list/evaluation.js:
@tensorflow/tfjs-converter/dist/operations/op_list/graph.js:
@tensorflow/tfjs-converter/dist/operations/op_list/hash_table.js:
@tensorflow/tfjs-converter/dist/operations/op_list/image.js:
@tensorflow/tfjs-converter/dist/operations/op_list/logical.js:
@tensorflow/tfjs-converter/dist/operations/op_list/matrices.js:
@tensorflow/tfjs-converter/dist/operations/op_list/normalization.js:
@tensorflow/tfjs-converter/dist/operations/op_list/reduction.js:
@tensorflow/tfjs-converter/dist/operations/op_list/slice_join.js:
@tensorflow/tfjs-converter/dist/operations/op_list/sparse.js:
@tensorflow/tfjs-converter/dist/operations/op_list/spectral.js:
@tensorflow/tfjs-converter/dist/operations/op_list/string.js:
@tensorflow/tfjs-converter/dist/operations/op_list/transformation.js:
  (**
   * @license
   * Copyright 2023 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

@tensorflow/tfjs-converter/dist/version.js:
  (** @license See the LICENSE file. *)

@tensorflow-models/pose-detection/dist/pose-detection.esm.js:
  (**
      * @license
      * Copyright 2023 Google LLC. All Rights Reserved.
      * Licensed under the Apache License, Version 2.0 (the "License");
      * you may not use this file except in compliance with the License.
      * You may obtain a copy of the License at
      *
      * http://www.apache.org/licenses/LICENSE-2.0
      *
      * Unless required by applicable law or agreed to in writing, software
      * distributed under the License is distributed on an "AS IS" BASIS,
      * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
      * See the License for the specific language governing permissions and
      * limitations under the License.
      * =============================================================================
      *)

@tensorflow/tfjs-backend-cpu/dist/kernels/Abs.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/Ceil.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/Exp.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/Expm1.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/Floor.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/Log.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/Rsqrt.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/Sigmoid.js:
@tensorflow/tfjs-backend-cpu/dist/kernels/Sqrt.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/_FusedMatMul.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/ExpandDims.js:
@tensorflow/tfjs-backend-webgl/dist/kernels/Unique.js:
  (**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an AS IS BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)
*/
