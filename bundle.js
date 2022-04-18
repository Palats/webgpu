/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@palats/varpanel/dist/varpanel.js":
/*!********************************************************!*\
  !*** ./node_modules/@palats/varpanel/dist/varpanel.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BoolElement": () => (/* binding */ BoolElement),
/* harmony export */   "SelectElement": () => (/* binding */ SelectElement),
/* harmony export */   "VarPanel": () => (/* binding */ VarPanel),
/* harmony export */   "commonStyle": () => (/* binding */ commonStyle),
/* harmony export */   "newBool": () => (/* binding */ newBool),
/* harmony export */   "newSelect": () => (/* binding */ newSelect)
/* harmony export */ });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=window.ShadowRoot&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,e$3=Symbol(),n$5=new Map;class s$3{constructor(t,n){if(this._$cssResult$=!0,n!==e$3)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t;}get styleSheet(){let e=n$5.get(this.cssText);return t$1&&void 0===e&&(n$5.set(this.cssText,e=new CSSStyleSheet),e.replaceSync(this.cssText)),e}toString(){return this.cssText}}const o$3=t=>new s$3("string"==typeof t?t:t+"",e$3),r$2=(t,...n)=>{const o=1===t.length?t[0]:n.reduce(((e,n,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+t[s+1]),t[0]);return new s$3(o,e$3)},i$2=(e,n)=>{t$1?e.adoptedStyleSheets=n.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):n.forEach((t=>{const n=document.createElement("style"),s=window.litNonce;void 0!==s&&n.setAttribute("nonce",s),n.textContent=t.cssText,e.appendChild(n);}));},S$1=t$1?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const n of t.cssRules)e+=n.cssText;return o$3(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var s$2;const e$2=window.trustedTypes,r$1=e$2?e$2.emptyScript:"",h$1=window.reactiveElementPolyfillSupport,o$2={toAttribute(t,i){switch(i){case Boolean:t=t?r$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,i){let s=t;switch(i){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t);}catch(t){s=null;}}return s}},n$4=(t,i)=>i!==t&&(i==i||t==t),l$2={attribute:!0,type:String,converter:o$2,reflect:!1,hasChanged:n$4};class a$1 extends HTMLElement{constructor(){super(),this._$Et=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Ei=null,this.o();}static addInitializer(t){var i;null!==(i=this.l)&&void 0!==i||(this.l=[]),this.l.push(t);}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((i,s)=>{const e=this._$Eh(s,i);void 0!==e&&(this._$Eu.set(e,s),t.push(e));})),t}static createProperty(t,i=l$2){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(t,i),!i.noAccessor&&!this.prototype.hasOwnProperty(t)){const s="symbol"==typeof t?Symbol():"__"+t,e=this.getPropertyDescriptor(t,s,i);void 0!==e&&Object.defineProperty(this.prototype,t,e);}}static getPropertyDescriptor(t,i,s){return {get(){return this[i]},set(e){const r=this[t];this[i]=e,this.requestUpdate(t,r,s);},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||l$2}static finalize(){if(this.hasOwnProperty("finalized"))return !1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),this.elementProperties=new Map(t.elementProperties),this._$Eu=new Map,this.hasOwnProperty("properties")){const t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of i)this.createProperty(s,t[s]);}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(i){const s=[];if(Array.isArray(i)){const e=new Set(i.flat(1/0).reverse());for(const i of e)s.unshift(S$1(i));}else void 0!==i&&s.push(S$1(i));return s}static _$Eh(t,i){const s=i.attribute;return !1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}o(){var t;this._$Ep=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Em(),this.requestUpdate(),null===(t=this.constructor.l)||void 0===t||t.forEach((t=>t(this)));}addController(t){var i,s;(null!==(i=this._$Eg)&&void 0!==i?i:this._$Eg=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(s=t.hostConnected)||void 0===s||s.call(t));}removeController(t){var i;null===(i=this._$Eg)||void 0===i||i.splice(this._$Eg.indexOf(t)>>>0,1);}_$Em(){this.constructor.elementProperties.forEach(((t,i)=>{this.hasOwnProperty(i)&&(this._$Et.set(i,this[i]),delete this[i]);}));}createRenderRoot(){var t;const s=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return i$2(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$Eg)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostConnected)||void 0===i?void 0:i.call(t)}));}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$Eg)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostDisconnected)||void 0===i?void 0:i.call(t)}));}attributeChangedCallback(t,i,s){this._$AK(t,s);}_$ES(t,i,s=l$2){var e,r;const h=this.constructor._$Eh(t,s);if(void 0!==h&&!0===s.reflect){const n=(null!==(r=null===(e=s.converter)||void 0===e?void 0:e.toAttribute)&&void 0!==r?r:o$2.toAttribute)(i,s.type);this._$Ei=t,null==n?this.removeAttribute(h):this.setAttribute(h,n),this._$Ei=null;}}_$AK(t,i){var s,e,r;const h=this.constructor,n=h._$Eu.get(t);if(void 0!==n&&this._$Ei!==n){const t=h.getPropertyOptions(n),l=t.converter,a=null!==(r=null!==(e=null===(s=l)||void 0===s?void 0:s.fromAttribute)&&void 0!==e?e:"function"==typeof l?l:null)&&void 0!==r?r:o$2.fromAttribute;this._$Ei=n,this[n]=a(i,t.type),this._$Ei=null;}}requestUpdate(t,i,s){let e=!0;void 0!==t&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||n$4)(this[t],i)?(this._$AL.has(t)||this._$AL.set(t,i),!0===s.reflect&&this._$Ei!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,s))):e=!1),!this.isUpdatePending&&e&&(this._$Ep=this._$E_());}async _$E_(){this.isUpdatePending=!0;try{await this._$Ep;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Et&&(this._$Et.forEach(((t,i)=>this[i]=t)),this._$Et=void 0);let i=!1;const s=this._$AL;try{i=this.shouldUpdate(s),i?(this.willUpdate(s),null===(t=this._$Eg)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostUpdate)||void 0===i?void 0:i.call(t)})),this.update(s)):this._$EU();}catch(t){throw i=!1,this._$EU(),t}i&&this._$AE(s);}willUpdate(t){}_$AE(t){var i;null===(i=this._$Eg)||void 0===i||i.forEach((t=>{var i;return null===(i=t.hostUpdated)||void 0===i?void 0:i.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t);}_$EU(){this._$AL=new Map,this.isUpdatePending=!1;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$Ep}shouldUpdate(t){return !0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,i)=>this._$ES(i,this[i],t))),this._$EC=void 0),this._$EU();}updated(t){}firstUpdated(t){}}a$1.finalized=!0,a$1.elementProperties=new Map,a$1.elementStyles=[],a$1.shadowRootOptions={mode:"open"},null==h$1||h$1({ReactiveElement:a$1}),(null!==(s$2=globalThis.reactiveElementVersions)&&void 0!==s$2?s$2:globalThis.reactiveElementVersions=[]).push("1.3.1");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t;const i$1=globalThis.trustedTypes,s$1=i$1?i$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,e$1=`lit$${(Math.random()+"").slice(9)}$`,o$1="?"+e$1,n$3=`<${o$1}>`,l$1=document,h=(t="")=>l$1.createComment(t),r=t=>null===t||"object"!=typeof t&&"function"!=typeof t,d=Array.isArray,u=t=>{var i;return d(t)||"function"==typeof(null===(i=t)||void 0===i?void 0:i[Symbol.iterator])},c=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,v=/-->/g,a=/>/g,f=/>|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,_=/'/g,m=/"/g,g=/^(?:script|style|textarea|title)$/i,p=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),$=p(1),b=Symbol.for("lit-noChange"),w=Symbol.for("lit-nothing"),T=new WeakMap,x=(t,i,s)=>{var e,o;const n=null!==(e=null==s?void 0:s.renderBefore)&&void 0!==e?e:i;let l=n._$litPart$;if(void 0===l){const t=null!==(o=null==s?void 0:s.renderBefore)&&void 0!==o?o:null;n._$litPart$=l=new N(i.insertBefore(h(),t),t,void 0,null!=s?s:{});}return l._$AI(t),l},A=l$1.createTreeWalker(l$1,129,null,!1),C=(t,i)=>{const o=t.length-1,l=[];let h,r=2===i?"<svg>":"",d=c;for(let i=0;i<o;i++){const s=t[i];let o,u,p=-1,$=0;for(;$<s.length&&(d.lastIndex=$,u=d.exec(s),null!==u);)$=d.lastIndex,d===c?"!--"===u[1]?d=v:void 0!==u[1]?d=a:void 0!==u[2]?(g.test(u[2])&&(h=RegExp("</"+u[2],"g")),d=f):void 0!==u[3]&&(d=f):d===f?">"===u[0]?(d=null!=h?h:c,p=-1):void 0===u[1]?p=-2:(p=d.lastIndex-u[2].length,o=u[1],d=void 0===u[3]?f:'"'===u[3]?m:_):d===m||d===_?d=f:d===v||d===a?d=c:(d=f,h=void 0);const y=d===f&&t[i+1].startsWith("/>")?" ":"";r+=d===c?s+n$3:p>=0?(l.push(o),s.slice(0,p)+"$lit$"+s.slice(p)+e$1+y):s+e$1+(-2===p?(l.push(void 0),i):y);}const u=r+(t[o]||"<?>")+(2===i?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return [void 0!==s$1?s$1.createHTML(u):u,l]};class E{constructor({strings:t,_$litType$:s},n){let l;this.parts=[];let r=0,d=0;const u=t.length-1,c=this.parts,[v,a]=C(t,s);if(this.el=E.createElement(v,n),A.currentNode=this.el.content,2===s){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes);}for(;null!==(l=A.nextNode())&&c.length<u;){if(1===l.nodeType){if(l.hasAttributes()){const t=[];for(const i of l.getAttributeNames())if(i.endsWith("$lit$")||i.startsWith(e$1)){const s=a[d++];if(t.push(i),void 0!==s){const t=l.getAttribute(s.toLowerCase()+"$lit$").split(e$1),i=/([.?@])?(.*)/.exec(s);c.push({type:1,index:r,name:i[2],strings:t,ctor:"."===i[1]?M:"?"===i[1]?H:"@"===i[1]?I:S});}else c.push({type:6,index:r});}for(const i of t)l.removeAttribute(i);}if(g.test(l.tagName)){const t=l.textContent.split(e$1),s=t.length-1;if(s>0){l.textContent=i$1?i$1.emptyScript:"";for(let i=0;i<s;i++)l.append(t[i],h()),A.nextNode(),c.push({type:2,index:++r});l.append(t[s],h());}}}else if(8===l.nodeType)if(l.data===o$1)c.push({type:2,index:r});else {let t=-1;for(;-1!==(t=l.data.indexOf(e$1,t+1));)c.push({type:7,index:r}),t+=e$1.length-1;}r++;}}static createElement(t,i){const s=l$1.createElement("template");return s.innerHTML=t,s}}function P(t,i,s=t,e){var o,n,l,h;if(i===b)return i;let d=void 0!==e?null===(o=s._$Cl)||void 0===o?void 0:o[e]:s._$Cu;const u=r(i)?void 0:i._$litDirective$;return (null==d?void 0:d.constructor)!==u&&(null===(n=null==d?void 0:d._$AO)||void 0===n||n.call(d,!1),void 0===u?d=void 0:(d=new u(t),d._$AT(t,s,e)),void 0!==e?(null!==(l=(h=s)._$Cl)&&void 0!==l?l:h._$Cl=[])[e]=d:s._$Cu=d),void 0!==d&&(i=P(t,d._$AS(t,i.values),d,e)),i}class V{constructor(t,i){this.v=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}p(t){var i;const{el:{content:s},parts:e}=this._$AD,o=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:l$1).importNode(s,!0);A.currentNode=o;let n=A.nextNode(),h=0,r=0,d=e[0];for(;void 0!==d;){if(h===d.index){let i;2===d.type?i=new N(n,n.nextSibling,this,t):1===d.type?i=new d.ctor(n,d.name,d.strings,this,t):6===d.type&&(i=new L(n,this,t)),this.v.push(i),d=e[++r];}h!==(null==d?void 0:d.index)&&(n=A.nextNode(),h++);}return o}m(t){let i=0;for(const s of this.v)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class N{constructor(t,i,s,e){var o;this.type=2,this._$AH=w,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cg=null===(o=null==e?void 0:e.isConnected)||void 0===o||o;}get _$AU(){var t,i;return null!==(i=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==i?i:this._$Cg}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=P(this,t,i),r(t)?t===w||null==t||""===t?(this._$AH!==w&&this._$AR(),this._$AH=w):t!==this._$AH&&t!==b&&this.$(t):void 0!==t._$litType$?this.T(t):void 0!==t.nodeType?this.k(t):u(t)?this.S(t):this.$(t);}A(t,i=this._$AB){return this._$AA.parentNode.insertBefore(t,i)}k(t){this._$AH!==t&&(this._$AR(),this._$AH=this.A(t));}$(t){this._$AH!==w&&r(this._$AH)?this._$AA.nextSibling.data=t:this.k(l$1.createTextNode(t)),this._$AH=t;}T(t){var i;const{values:s,_$litType$:e}=t,o="number"==typeof e?this._$AC(t):(void 0===e.el&&(e.el=E.createElement(e.h,this.options)),e);if((null===(i=this._$AH)||void 0===i?void 0:i._$AD)===o)this._$AH.m(s);else {const t=new V(o,this),i=t.p(this.options);t.m(s),this.k(i),this._$AH=t;}}_$AC(t){let i=T.get(t.strings);return void 0===i&&T.set(t.strings,i=new E(t)),i}S(t){d(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const o of t)e===i.length?i.push(s=new N(this.A(h()),this.A(h()),this,this.options)):s=i[e],s._$AI(o),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){var s;for(null===(s=this._$AP)||void 0===s||s.call(this,!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){var i;void 0===this._$AM&&(this._$Cg=t,null===(i=this._$AP)||void 0===i||i.call(this,t));}}class S{constructor(t,i,s,e,o){this.type=1,this._$AH=w,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=w;}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,i=this,s,e){const o=this.strings;let n=!1;if(void 0===o)t=P(this,t,i,0),n=!r(t)||t!==this._$AH&&t!==b,n&&(this._$AH=t);else {const e=t;let l,h;for(t=o[0],l=0;l<o.length-1;l++)h=P(this,e[s+l],i,l),h===b&&(h=this._$AH[l]),n||(n=!r(h)||h!==this._$AH[l]),h===w?t=w:t!==w&&(t+=(null!=h?h:"")+o[l+1]),this._$AH[l]=h;}n&&!e&&this.C(t);}C(t){t===w?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"");}}class M extends S{constructor(){super(...arguments),this.type=3;}C(t){this.element[this.name]=t===w?void 0:t;}}const k=i$1?i$1.emptyScript:"";class H extends S{constructor(){super(...arguments),this.type=4;}C(t){t&&t!==w?this.element.setAttribute(this.name,k):this.element.removeAttribute(this.name);}}class I extends S{constructor(t,i,s,e,o){super(t,i,s,e,o),this.type=5;}_$AI(t,i=this){var s;if((t=null!==(s=P(this,t,i,0))&&void 0!==s?s:w)===b)return;const e=this._$AH,o=t===w&&e!==w||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,n=t!==w&&(e===w||o);o&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){var i,s;"function"==typeof this._$AH?this._$AH.call(null!==(s=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==s?s:this.element,t):this._$AH.handleEvent(t);}}class L{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){P(this,t);}}const z=window.litHtmlPolyfillSupport;null==z||z(E,N),(null!==(t=globalThis.litHtmlVersions)&&void 0!==t?t:globalThis.litHtmlVersions=[]).push("2.2.1");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var l,o;class s extends a$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Dt=void 0;}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Dt=x(i,this.renderRoot,this.renderOptions);}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Dt)||void 0===t||t.setConnected(!0);}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Dt)||void 0===t||t.setConnected(!1);}render(){return b}}s.finalized=!0,s._$litElement$=!0,null===(l=globalThis.litElementHydrateSupport)||void 0===l||l.call(globalThis,{LitElement:s});const n$2=globalThis.litElementPolyfillSupport;null==n$2||n$2({LitElement:s});(null!==(o=globalThis.litElementVersions)&&void 0!==o?o:globalThis.litElementVersions=[]).push("3.2.0");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const n$1=n=>e=>"function"==typeof e?((n,e)=>(window.customElements.define(n,e),e))(n,e):((n,e)=>{const{kind:t,elements:i}=e;return {kind:t,elements:i,finisher(e){window.customElements.define(n,e);}}})(n,e);

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const i=(i,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(n){n.createProperty(e.key,i);}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this));},finisher(n){n.createProperty(e.key,i);}};function e(e){return (n,t)=>void 0!==t?((i,e,n)=>{e.constructor.createProperty(n,i);})(e,n,t):i(e,n)}

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var n;null!=(null===(n=window.HTMLSlotElement)||void 0===n?void 0:n.prototype.assignedElements)?(o,n)=>o.assignedElements(n):(o,n)=>o.assignedNodes(n).filter((o=>o.nodeType===Node.ELEMENT_NODE));

const commonStyle = r$2 `
    .labelvalue {
        display: grid;
        grid-template-columns: 8em 100fr;
        grid-template-rows: 100fr;

        border-top: 1px solid #4d4d4d;
        padding: 2px 1px 2px 1px;
        font: 11px 'Lucida Grande', sans-serif;
    }

    .labelvalue select, .labelvalue input {
        font: 11px 'Lucida Grande', sans-serif;
        margin: 0;
    }

    .labelvalue label {
        grid-column-start: 1;
        grid-column-end: 2;
    }

    .value {
        grid-column-start: 2;
        grid-column-end: 3;
    }
`;
let VarPanel = class VarPanel extends s {
    constructor() {
        super(...arguments);
        this.expanded = false;
    }
    render() {
        return $ `
            ${this.expanded ? $ `<slot></slot>` : ``}
            <div class="line">
                <button @click="${() => { this.expanded = !this.expanded; }}">
                    ${this.expanded ? 'Close' : 'Open'} controls2
                </button>
            </div>
        `;
    }
};
VarPanel.styles = [commonStyle, r$2 `
        :host {
            background-color: #d6d6d6f0;
            border: #8b8b8b 1px solid;
            font-size: 11px;
        }

        .line {
            border-top: 1px solid #4d4d4d;
            display: flex;
            justify-content: center;
        }

        .line button {
            flex-grow: 1;
            font: italic 11px 'Lucida Grande', sans-serif;
            border: none;
            background-color: transparent;
        }
    `];
__decorate([
    e({ type: Boolean })
], VarPanel.prototype, "expanded", void 0);
VarPanel = __decorate([
    n$1('var-panel')
], VarPanel);
function newBool(desc) {
    return $ `<vp-bool .obj=${desc.obj} .field=${desc.field}>${desc.caption}</vp-bool>`;
}
let BoolElement = class BoolElement extends s {
    constructor() {
        super(...arguments);
        this.field = "";
    }
    render() {
        return $ `
            <div class="labelvalue">
                <label><slot>${this.field}</slot></label>
                <input class="value" type=checkbox ?checked=${this.getValue()} @change=${(e) => { this.setValue(e.target.checked); }}></input>
            </div>
        `;
    }
    getValue() {
        return this.obj[this.field] ?? false;
    }
    setValue(v) {
        this.obj[this.field] = v;
    }
};
BoolElement.styles = [commonStyle];
__decorate([
    e()
], BoolElement.prototype, "field", void 0);
__decorate([
    e()
], BoolElement.prototype, "obj", void 0);
BoolElement = __decorate([
    n$1('vp-bool')
], BoolElement);
function newSelect(desc) {
    return $ `<vp-select .obj=${desc.obj} .field=${desc.field} .values=${desc.values}>${desc.caption}</vp-select>`;
}
let SelectElement = class SelectElement extends s {
    constructor() {
        super(...arguments);
        this.field = "";
        this.values = [];
    }
    render() {
        const current = this.getValue();
        return $ `
            <div class="labelvalue">
                <label><slot>${this.field}</slot></label>
                <select class="value" @change=${this.onChange}>
                    ${this.values.map(id => $ `
                        <option value=${id} ?selected=${id === current}>${id}</option>
                    `)}
                </select>
            </div>
        `;
    }
    onChange(evt) {
        const options = evt.target.selectedOptions;
        if (!options) {
            return;
        }
        this.setValue(options[0].value);
    }
    getValue() {
        return this.obj[this.field] ?? false;
    }
    setValue(v) {
        this.obj[this.field] = v;
    }
};
SelectElement.styles = [commonStyle];
__decorate([
    e()
], SelectElement.prototype, "field", void 0);
__decorate([
    e({ attribute: false })
], SelectElement.prototype, "obj", void 0);
__decorate([
    e({ attribute: false })
], SelectElement.prototype, "values", void 0);
SelectElement = __decorate([
    n$1('vp-select')
], SelectElement);


//# sourceMappingURL=varpanel.js.map


/***/ }),

/***/ "./node_modules/gl-matrix/esm/common.js":
/*!**********************************************!*\
  !*** ./node_modules/gl-matrix/esm/common.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ARRAY_TYPE": () => (/* binding */ ARRAY_TYPE),
/* harmony export */   "EPSILON": () => (/* binding */ EPSILON),
/* harmony export */   "RANDOM": () => (/* binding */ RANDOM),
/* harmony export */   "equals": () => (/* binding */ equals),
/* harmony export */   "setMatrixArrayType": () => (/* binding */ setMatrixArrayType),
/* harmony export */   "toRadian": () => (/* binding */ toRadian)
/* harmony export */ });
/**
 * Common utilities
 * @module glMatrix
 */
// Configuration Constants
var EPSILON = 0.000001;
var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
var RANDOM = Math.random;
/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Float32ArrayConstructor | ArrayConstructor} type Array type, such as Float32Array or Array
 */

function setMatrixArrayType(type) {
  ARRAY_TYPE = type;
}
var degree = Math.PI / 180;
/**
 * Convert Degree To Radian
 *
 * @param {Number} a Angle in Degrees
 */

function toRadian(a) {
  return a * degree;
}
/**
 * Tests whether or not the arguments have approximately the same value, within an absolute
 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
 * than or equal to 1.0, and a relative tolerance is used for larger values)
 *
 * @param {Number} a The first number to test.
 * @param {Number} b The second number to test.
 * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
 */

function equals(a, b) {
  return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
}
if (!Math.hypot) Math.hypot = function () {
  var y = 0,
      i = arguments.length;

  while (i--) {
    y += arguments[i] * arguments[i];
  }

  return Math.sqrt(y);
};

/***/ }),

/***/ "./node_modules/gl-matrix/esm/mat3.js":
/*!********************************************!*\
  !*** ./node_modules/gl-matrix/esm/mat3.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "add": () => (/* binding */ add),
/* harmony export */   "adjoint": () => (/* binding */ adjoint),
/* harmony export */   "clone": () => (/* binding */ clone),
/* harmony export */   "copy": () => (/* binding */ copy),
/* harmony export */   "create": () => (/* binding */ create),
/* harmony export */   "determinant": () => (/* binding */ determinant),
/* harmony export */   "equals": () => (/* binding */ equals),
/* harmony export */   "exactEquals": () => (/* binding */ exactEquals),
/* harmony export */   "frob": () => (/* binding */ frob),
/* harmony export */   "fromMat2d": () => (/* binding */ fromMat2d),
/* harmony export */   "fromMat4": () => (/* binding */ fromMat4),
/* harmony export */   "fromQuat": () => (/* binding */ fromQuat),
/* harmony export */   "fromRotation": () => (/* binding */ fromRotation),
/* harmony export */   "fromScaling": () => (/* binding */ fromScaling),
/* harmony export */   "fromTranslation": () => (/* binding */ fromTranslation),
/* harmony export */   "fromValues": () => (/* binding */ fromValues),
/* harmony export */   "identity": () => (/* binding */ identity),
/* harmony export */   "invert": () => (/* binding */ invert),
/* harmony export */   "mul": () => (/* binding */ mul),
/* harmony export */   "multiply": () => (/* binding */ multiply),
/* harmony export */   "multiplyScalar": () => (/* binding */ multiplyScalar),
/* harmony export */   "multiplyScalarAndAdd": () => (/* binding */ multiplyScalarAndAdd),
/* harmony export */   "normalFromMat4": () => (/* binding */ normalFromMat4),
/* harmony export */   "projection": () => (/* binding */ projection),
/* harmony export */   "rotate": () => (/* binding */ rotate),
/* harmony export */   "scale": () => (/* binding */ scale),
/* harmony export */   "set": () => (/* binding */ set),
/* harmony export */   "str": () => (/* binding */ str),
/* harmony export */   "sub": () => (/* binding */ sub),
/* harmony export */   "subtract": () => (/* binding */ subtract),
/* harmony export */   "translate": () => (/* binding */ translate),
/* harmony export */   "transpose": () => (/* binding */ transpose)
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common.js */ "./node_modules/gl-matrix/esm/common.js");

/**
 * 3x3 Matrix
 * @module mat3
 */

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */

function create() {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(9);

  if (_common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
  }

  out[0] = 1;
  out[4] = 1;
  out[8] = 1;
  return out;
}
/**
 * Copies the upper-left 3x3 values into the given mat3.
 *
 * @param {mat3} out the receiving 3x3 matrix
 * @param {ReadonlyMat4} a   the source 4x4 matrix
 * @returns {mat3} out
 */

function fromMat4(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[4];
  out[4] = a[5];
  out[5] = a[6];
  out[6] = a[8];
  out[7] = a[9];
  out[8] = a[10];
  return out;
}
/**
 * Creates a new mat3 initialized with values from an existing matrix
 *
 * @param {ReadonlyMat3} a matrix to clone
 * @returns {mat3} a new 3x3 matrix
 */

function clone(a) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(9);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}
/**
 * Copy the values from one mat3 to another
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the source matrix
 * @returns {mat3} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}
/**
 * Create a new mat3 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} A new mat3
 */

function fromValues(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(9);
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m10;
  out[4] = m11;
  out[5] = m12;
  out[6] = m20;
  out[7] = m21;
  out[8] = m22;
  return out;
}
/**
 * Set the components of a mat3 to the given values
 *
 * @param {mat3} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} out
 */

function set(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m10;
  out[4] = m11;
  out[5] = m12;
  out[6] = m20;
  out[7] = m21;
  out[8] = m22;
  return out;
}
/**
 * Set a mat3 to the identity matrix
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */

function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 1;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}
/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the source matrix
 * @returns {mat3} out
 */

function transpose(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    var a01 = a[1],
        a02 = a[2],
        a12 = a[5];
    out[1] = a[3];
    out[2] = a[6];
    out[3] = a01;
    out[5] = a[7];
    out[6] = a02;
    out[7] = a12;
  } else {
    out[0] = a[0];
    out[1] = a[3];
    out[2] = a[6];
    out[3] = a[1];
    out[4] = a[4];
    out[5] = a[7];
    out[6] = a[2];
    out[7] = a[5];
    out[8] = a[8];
  }

  return out;
}
/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the source matrix
 * @returns {mat3} out
 */

function invert(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2];
  var a10 = a[3],
      a11 = a[4],
      a12 = a[5];
  var a20 = a[6],
      a21 = a[7],
      a22 = a[8];
  var b01 = a22 * a11 - a12 * a21;
  var b11 = -a22 * a10 + a12 * a20;
  var b21 = a21 * a10 - a11 * a20; // Calculate the determinant

  var det = a00 * b01 + a01 * b11 + a02 * b21;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = b01 * det;
  out[1] = (-a22 * a01 + a02 * a21) * det;
  out[2] = (a12 * a01 - a02 * a11) * det;
  out[3] = b11 * det;
  out[4] = (a22 * a00 - a02 * a20) * det;
  out[5] = (-a12 * a00 + a02 * a10) * det;
  out[6] = b21 * det;
  out[7] = (-a21 * a00 + a01 * a20) * det;
  out[8] = (a11 * a00 - a01 * a10) * det;
  return out;
}
/**
 * Calculates the adjugate of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the source matrix
 * @returns {mat3} out
 */

function adjoint(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2];
  var a10 = a[3],
      a11 = a[4],
      a12 = a[5];
  var a20 = a[6],
      a21 = a[7],
      a22 = a[8];
  out[0] = a11 * a22 - a12 * a21;
  out[1] = a02 * a21 - a01 * a22;
  out[2] = a01 * a12 - a02 * a11;
  out[3] = a12 * a20 - a10 * a22;
  out[4] = a00 * a22 - a02 * a20;
  out[5] = a02 * a10 - a00 * a12;
  out[6] = a10 * a21 - a11 * a20;
  out[7] = a01 * a20 - a00 * a21;
  out[8] = a00 * a11 - a01 * a10;
  return out;
}
/**
 * Calculates the determinant of a mat3
 *
 * @param {ReadonlyMat3} a the source matrix
 * @returns {Number} determinant of a
 */

function determinant(a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2];
  var a10 = a[3],
      a11 = a[4],
      a12 = a[5];
  var a20 = a[6],
      a21 = a[7],
      a22 = a[8];
  return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
}
/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the first operand
 * @param {ReadonlyMat3} b the second operand
 * @returns {mat3} out
 */

function multiply(out, a, b) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2];
  var a10 = a[3],
      a11 = a[4],
      a12 = a[5];
  var a20 = a[6],
      a21 = a[7],
      a22 = a[8];
  var b00 = b[0],
      b01 = b[1],
      b02 = b[2];
  var b10 = b[3],
      b11 = b[4],
      b12 = b[5];
  var b20 = b[6],
      b21 = b[7],
      b22 = b[8];
  out[0] = b00 * a00 + b01 * a10 + b02 * a20;
  out[1] = b00 * a01 + b01 * a11 + b02 * a21;
  out[2] = b00 * a02 + b01 * a12 + b02 * a22;
  out[3] = b10 * a00 + b11 * a10 + b12 * a20;
  out[4] = b10 * a01 + b11 * a11 + b12 * a21;
  out[5] = b10 * a02 + b11 * a12 + b12 * a22;
  out[6] = b20 * a00 + b21 * a10 + b22 * a20;
  out[7] = b20 * a01 + b21 * a11 + b22 * a21;
  out[8] = b20 * a02 + b21 * a12 + b22 * a22;
  return out;
}
/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the matrix to translate
 * @param {ReadonlyVec2} v vector to translate by
 * @returns {mat3} out
 */

function translate(out, a, v) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a10 = a[3],
      a11 = a[4],
      a12 = a[5],
      a20 = a[6],
      a21 = a[7],
      a22 = a[8],
      x = v[0],
      y = v[1];
  out[0] = a00;
  out[1] = a01;
  out[2] = a02;
  out[3] = a10;
  out[4] = a11;
  out[5] = a12;
  out[6] = x * a00 + y * a10 + a20;
  out[7] = x * a01 + y * a11 + a21;
  out[8] = x * a02 + y * a12 + a22;
  return out;
}
/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */

function rotate(out, a, rad) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a10 = a[3],
      a11 = a[4],
      a12 = a[5],
      a20 = a[6],
      a21 = a[7],
      a22 = a[8],
      s = Math.sin(rad),
      c = Math.cos(rad);
  out[0] = c * a00 + s * a10;
  out[1] = c * a01 + s * a11;
  out[2] = c * a02 + s * a12;
  out[3] = c * a10 - s * a00;
  out[4] = c * a11 - s * a01;
  out[5] = c * a12 - s * a02;
  out[6] = a20;
  out[7] = a21;
  out[8] = a22;
  return out;
}
/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the matrix to rotate
 * @param {ReadonlyVec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/

function scale(out, a, v) {
  var x = v[0],
      y = v[1];
  out[0] = x * a[0];
  out[1] = x * a[1];
  out[2] = x * a[2];
  out[3] = y * a[3];
  out[4] = y * a[4];
  out[5] = y * a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}
/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.translate(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {ReadonlyVec2} v Translation vector
 * @returns {mat3} out
 */

function fromTranslation(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 1;
  out[5] = 0;
  out[6] = v[0];
  out[7] = v[1];
  out[8] = 1;
  return out;
}
/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.rotate(dest, dest, rad);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */

function fromRotation(out, rad) {
  var s = Math.sin(rad),
      c = Math.cos(rad);
  out[0] = c;
  out[1] = s;
  out[2] = 0;
  out[3] = -s;
  out[4] = c;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}
/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.scale(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {ReadonlyVec2} v Scaling vector
 * @returns {mat3} out
 */

function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = v[1];
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}
/**
 * Copies the values from a mat2d into a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat2d} a the matrix to copy
 * @returns {mat3} out
 **/

function fromMat2d(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = 0;
  out[3] = a[2];
  out[4] = a[3];
  out[5] = 0;
  out[6] = a[4];
  out[7] = a[5];
  out[8] = 1;
  return out;
}
/**
 * Calculates a 3x3 matrix from the given quaternion
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {ReadonlyQuat} q Quaternion to create matrix from
 *
 * @returns {mat3} out
 */

function fromQuat(out, q) {
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var yx = y * x2;
  var yy = y * y2;
  var zx = z * x2;
  var zy = z * y2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - yy - zz;
  out[3] = yx - wz;
  out[6] = zx + wy;
  out[1] = yx + wz;
  out[4] = 1 - xx - zz;
  out[7] = zy - wx;
  out[2] = zx - wy;
  out[5] = zy + wx;
  out[8] = 1 - xx - yy;
  return out;
}
/**
 * Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {ReadonlyMat4} a Mat4 to derive the normal matrix from
 *
 * @returns {mat3} out
 */

function normalFromMat4(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  return out;
}
/**
 * Generates a 2D projection matrix with the given bounds
 *
 * @param {mat3} out mat3 frustum matrix will be written into
 * @param {number} width Width of your gl context
 * @param {number} height Height of gl context
 * @returns {mat3} out
 */

function projection(out, width, height) {
  out[0] = 2 / width;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = -2 / height;
  out[5] = 0;
  out[6] = -1;
  out[7] = 1;
  out[8] = 1;
  return out;
}
/**
 * Returns a string representation of a mat3
 *
 * @param {ReadonlyMat3} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */

function str(a) {
  return "mat3(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ")";
}
/**
 * Returns Frobenius norm of a mat3
 *
 * @param {ReadonlyMat3} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */

function frob(a) {
  return Math.hypot(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8]);
}
/**
 * Adds two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the first operand
 * @param {ReadonlyMat3} b the second operand
 * @returns {mat3} out
 */

function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  return out;
}
/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the first operand
 * @param {ReadonlyMat3} b the second operand
 * @returns {mat3} out
 */

function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  return out;
}
/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat3} out
 */

function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  return out;
}
/**
 * Adds two mat3's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat3} out the receiving vector
 * @param {ReadonlyMat3} a the first operand
 * @param {ReadonlyMat3} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat3} out
 */

function multiplyScalarAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  out[3] = a[3] + b[3] * scale;
  out[4] = a[4] + b[4] * scale;
  out[5] = a[5] + b[5] * scale;
  out[6] = a[6] + b[6] * scale;
  out[7] = a[7] + b[7] * scale;
  out[8] = a[8] + b[8] * scale;
  return out;
}
/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyMat3} a The first matrix.
 * @param {ReadonlyMat3} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8];
}
/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {ReadonlyMat3} a The first matrix.
 * @param {ReadonlyMat3} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function equals(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3],
      a4 = a[4],
      a5 = a[5],
      a6 = a[6],
      a7 = a[7],
      a8 = a[8];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3],
      b4 = b[4],
      b5 = b[5],
      b6 = b[6],
      b7 = b[7],
      b8 = b[8];
  return Math.abs(a0 - b0) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8));
}
/**
 * Alias for {@link mat3.multiply}
 * @function
 */

var mul = multiply;
/**
 * Alias for {@link mat3.subtract}
 * @function
 */

var sub = subtract;

/***/ }),

/***/ "./node_modules/gl-matrix/esm/mat4.js":
/*!********************************************!*\
  !*** ./node_modules/gl-matrix/esm/mat4.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "add": () => (/* binding */ add),
/* harmony export */   "adjoint": () => (/* binding */ adjoint),
/* harmony export */   "clone": () => (/* binding */ clone),
/* harmony export */   "copy": () => (/* binding */ copy),
/* harmony export */   "create": () => (/* binding */ create),
/* harmony export */   "determinant": () => (/* binding */ determinant),
/* harmony export */   "equals": () => (/* binding */ equals),
/* harmony export */   "exactEquals": () => (/* binding */ exactEquals),
/* harmony export */   "frob": () => (/* binding */ frob),
/* harmony export */   "fromQuat": () => (/* binding */ fromQuat),
/* harmony export */   "fromQuat2": () => (/* binding */ fromQuat2),
/* harmony export */   "fromRotation": () => (/* binding */ fromRotation),
/* harmony export */   "fromRotationTranslation": () => (/* binding */ fromRotationTranslation),
/* harmony export */   "fromRotationTranslationScale": () => (/* binding */ fromRotationTranslationScale),
/* harmony export */   "fromRotationTranslationScaleOrigin": () => (/* binding */ fromRotationTranslationScaleOrigin),
/* harmony export */   "fromScaling": () => (/* binding */ fromScaling),
/* harmony export */   "fromTranslation": () => (/* binding */ fromTranslation),
/* harmony export */   "fromValues": () => (/* binding */ fromValues),
/* harmony export */   "fromXRotation": () => (/* binding */ fromXRotation),
/* harmony export */   "fromYRotation": () => (/* binding */ fromYRotation),
/* harmony export */   "fromZRotation": () => (/* binding */ fromZRotation),
/* harmony export */   "frustum": () => (/* binding */ frustum),
/* harmony export */   "getRotation": () => (/* binding */ getRotation),
/* harmony export */   "getScaling": () => (/* binding */ getScaling),
/* harmony export */   "getTranslation": () => (/* binding */ getTranslation),
/* harmony export */   "identity": () => (/* binding */ identity),
/* harmony export */   "invert": () => (/* binding */ invert),
/* harmony export */   "lookAt": () => (/* binding */ lookAt),
/* harmony export */   "mul": () => (/* binding */ mul),
/* harmony export */   "multiply": () => (/* binding */ multiply),
/* harmony export */   "multiplyScalar": () => (/* binding */ multiplyScalar),
/* harmony export */   "multiplyScalarAndAdd": () => (/* binding */ multiplyScalarAndAdd),
/* harmony export */   "ortho": () => (/* binding */ ortho),
/* harmony export */   "orthoNO": () => (/* binding */ orthoNO),
/* harmony export */   "orthoZO": () => (/* binding */ orthoZO),
/* harmony export */   "perspective": () => (/* binding */ perspective),
/* harmony export */   "perspectiveFromFieldOfView": () => (/* binding */ perspectiveFromFieldOfView),
/* harmony export */   "perspectiveNO": () => (/* binding */ perspectiveNO),
/* harmony export */   "perspectiveZO": () => (/* binding */ perspectiveZO),
/* harmony export */   "rotate": () => (/* binding */ rotate),
/* harmony export */   "rotateX": () => (/* binding */ rotateX),
/* harmony export */   "rotateY": () => (/* binding */ rotateY),
/* harmony export */   "rotateZ": () => (/* binding */ rotateZ),
/* harmony export */   "scale": () => (/* binding */ scale),
/* harmony export */   "set": () => (/* binding */ set),
/* harmony export */   "str": () => (/* binding */ str),
/* harmony export */   "sub": () => (/* binding */ sub),
/* harmony export */   "subtract": () => (/* binding */ subtract),
/* harmony export */   "targetTo": () => (/* binding */ targetTo),
/* harmony export */   "translate": () => (/* binding */ translate),
/* harmony export */   "transpose": () => (/* binding */ transpose)
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common.js */ "./node_modules/gl-matrix/esm/common.js");

/**
 * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
 * @module mat4
 */

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */

function create() {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(16);

  if (_common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }

  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}
/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {ReadonlyMat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */

function clone(a) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(16);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Create a new mat4 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} A new mat4
 */

function fromValues(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(16);
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}
/**
 * Set the components of a mat4 to the given values
 *
 * @param {mat4} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} out
 */

function set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}
/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */

function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function transpose(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    var a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    var a12 = a[6],
        a13 = a[7];
    var a23 = a[11];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a01;
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a02;
    out[9] = a12;
    out[11] = a[14];
    out[12] = a03;
    out[13] = a13;
    out[14] = a23;
  } else {
    out[0] = a[0];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a[1];
    out[5] = a[5];
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a[2];
    out[9] = a[6];
    out[10] = a[10];
    out[11] = a[14];
    out[12] = a[3];
    out[13] = a[7];
    out[14] = a[11];
    out[15] = a[15];
  }

  return out;
}
/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function invert(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return out;
}
/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function adjoint(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
  out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
  out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
  out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
  out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
  out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
  out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
  out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
  out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
  out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
  out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
  out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
  out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
  out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
  out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
  out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
  return out;
}
/**
 * Calculates the determinant of a mat4
 *
 * @param {ReadonlyMat4} a the source matrix
 * @returns {Number} determinant of a
 */

function determinant(a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

  return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
}
/**
 * Multiplies two mat4s
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */

function multiply(out, a, b) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15]; // Cache only the current line of the second matrix

  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
}
/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to translate
 * @param {ReadonlyVec3} v vector to translate by
 * @returns {mat4} out
 */

function translate(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;

  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }

  return out;
}
/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to scale
 * @param {ReadonlyVec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/

function scale(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {ReadonlyVec3} axis the axis to rotate around
 * @returns {mat4} out
 */

function rotate(out, a, rad, axis) {
  var x = axis[0],
      y = axis[1],
      z = axis[2];
  var len = Math.hypot(x, y, z);
  var s, c, t;
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;
  var b00, b01, b02;
  var b10, b11, b12;
  var b20, b21, b22;

  if (len < _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON) {
    return null;
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;
  a00 = a[0];
  a01 = a[1];
  a02 = a[2];
  a03 = a[3];
  a10 = a[4];
  a11 = a[5];
  a12 = a[6];
  a13 = a[7];
  a20 = a[8];
  a21 = a[9];
  a22 = a[10];
  a23 = a[11]; // Construct the elements of the rotation matrix

  b00 = x * x * t + c;
  b01 = y * x * t + z * s;
  b02 = z * x * t - y * s;
  b10 = x * y * t - z * s;
  b11 = y * y * t + c;
  b12 = z * y * t + x * s;
  b20 = x * z * t + y * s;
  b21 = y * z * t - x * s;
  b22 = z * z * t + c; // Perform rotation-specific matrix multiplication

  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22;

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  return out;
}
/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateX(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[4] = a10 * c + a20 * s;
  out[5] = a11 * c + a21 * s;
  out[6] = a12 * c + a22 * s;
  out[7] = a13 * c + a23 * s;
  out[8] = a20 * c - a10 * s;
  out[9] = a21 * c - a11 * s;
  out[10] = a22 * c - a12 * s;
  out[11] = a23 * c - a13 * s;
  return out;
}
/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateY(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[0] = a00 * c - a20 * s;
  out[1] = a01 * c - a21 * s;
  out[2] = a02 * c - a22 * s;
  out[3] = a03 * c - a23 * s;
  out[8] = a00 * s + a20 * c;
  out[9] = a01 * s + a21 * c;
  out[10] = a02 * s + a22 * c;
  out[11] = a03 * s + a23 * c;
  return out;
}
/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateZ(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[0] = a00 * c + a10 * s;
  out[1] = a01 * c + a11 * s;
  out[2] = a02 * c + a12 * s;
  out[3] = a03 * c + a13 * s;
  out[4] = a10 * c - a00 * s;
  out[5] = a11 * c - a01 * s;
  out[6] = a12 * c - a02 * s;
  out[7] = a13 * c - a03 * s;
  return out;
}
/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyVec3} v Translation vector
 * @returns {mat4} out
 */

function fromTranslation(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.scale(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyVec3} v Scaling vector
 * @returns {mat4} out
 */

function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = v[1];
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = v[2];
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a given angle around a given axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotate(dest, dest, rad, axis);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @param {ReadonlyVec3} axis the axis to rotate around
 * @returns {mat4} out
 */

function fromRotation(out, rad, axis) {
  var x = axis[0],
      y = axis[1],
      z = axis[2];
  var len = Math.hypot(x, y, z);
  var s, c, t;

  if (len < _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON) {
    return null;
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c; // Perform rotation-specific matrix multiplication

  out[0] = x * x * t + c;
  out[1] = y * x * t + z * s;
  out[2] = z * x * t - y * s;
  out[3] = 0;
  out[4] = x * y * t - z * s;
  out[5] = y * y * t + c;
  out[6] = z * y * t + x * s;
  out[7] = 0;
  out[8] = x * z * t + y * s;
  out[9] = y * z * t - x * s;
  out[10] = z * z * t + c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from the given angle around the X axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateX(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function fromXRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad); // Perform axis-specific matrix multiplication

  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = c;
  out[6] = s;
  out[7] = 0;
  out[8] = 0;
  out[9] = -s;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from the given angle around the Y axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateY(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function fromYRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad); // Perform axis-specific matrix multiplication

  out[0] = c;
  out[1] = 0;
  out[2] = -s;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = s;
  out[9] = 0;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from the given angle around the Z axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateZ(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function fromZRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad); // Perform axis-specific matrix multiplication

  out[0] = c;
  out[1] = s;
  out[2] = 0;
  out[3] = 0;
  out[4] = -s;
  out[5] = c;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {ReadonlyVec3} v Translation vector
 * @returns {mat4} out
 */

function fromRotationTranslation(out, q, v) {
  // Quaternion math
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - (yy + zz);
  out[1] = xy + wz;
  out[2] = xz - wy;
  out[3] = 0;
  out[4] = xy - wz;
  out[5] = 1 - (xx + zz);
  out[6] = yz + wx;
  out[7] = 0;
  out[8] = xz + wy;
  out[9] = yz - wx;
  out[10] = 1 - (xx + yy);
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
/**
 * Creates a new mat4 from a dual quat.
 *
 * @param {mat4} out Matrix
 * @param {ReadonlyQuat2} a Dual Quaternion
 * @returns {mat4} mat4 receiving operation result
 */

function fromQuat2(out, a) {
  var translation = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(3);
  var bx = -a[0],
      by = -a[1],
      bz = -a[2],
      bw = a[3],
      ax = a[4],
      ay = a[5],
      az = a[6],
      aw = a[7];
  var magnitude = bx * bx + by * by + bz * bz + bw * bw; //Only scale if it makes sense

  if (magnitude > 0) {
    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;
    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;
    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;
  } else {
    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
  }

  fromRotationTranslation(out, a, translation);
  return out;
}
/**
 * Returns the translation vector component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslation,
 *  the returned vector will be the same as the translation vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive translation component
 * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */

function getTranslation(out, mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];
  return out;
}
/**
 * Returns the scaling factor component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslationScale
 *  with a normalized Quaternion paramter, the returned vector will be
 *  the same as the scaling vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive scaling factor component
 * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */

function getScaling(out, mat) {
  var m11 = mat[0];
  var m12 = mat[1];
  var m13 = mat[2];
  var m21 = mat[4];
  var m22 = mat[5];
  var m23 = mat[6];
  var m31 = mat[8];
  var m32 = mat[9];
  var m33 = mat[10];
  out[0] = Math.hypot(m11, m12, m13);
  out[1] = Math.hypot(m21, m22, m23);
  out[2] = Math.hypot(m31, m32, m33);
  return out;
}
/**
 * Returns a quaternion representing the rotational component
 *  of a transformation matrix. If a matrix is built with
 *  fromRotationTranslation, the returned quaternion will be the
 *  same as the quaternion originally supplied.
 * @param {quat} out Quaternion to receive the rotation component
 * @param {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {quat} out
 */

function getRotation(out, mat) {
  var scaling = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(3);
  getScaling(scaling, mat);
  var is1 = 1 / scaling[0];
  var is2 = 1 / scaling[1];
  var is3 = 1 / scaling[2];
  var sm11 = mat[0] * is1;
  var sm12 = mat[1] * is2;
  var sm13 = mat[2] * is3;
  var sm21 = mat[4] * is1;
  var sm22 = mat[5] * is2;
  var sm23 = mat[6] * is3;
  var sm31 = mat[8] * is1;
  var sm32 = mat[9] * is2;
  var sm33 = mat[10] * is3;
  var trace = sm11 + sm22 + sm33;
  var S = 0;

  if (trace > 0) {
    S = Math.sqrt(trace + 1.0) * 2;
    out[3] = 0.25 * S;
    out[0] = (sm23 - sm32) / S;
    out[1] = (sm31 - sm13) / S;
    out[2] = (sm12 - sm21) / S;
  } else if (sm11 > sm22 && sm11 > sm33) {
    S = Math.sqrt(1.0 + sm11 - sm22 - sm33) * 2;
    out[3] = (sm23 - sm32) / S;
    out[0] = 0.25 * S;
    out[1] = (sm12 + sm21) / S;
    out[2] = (sm31 + sm13) / S;
  } else if (sm22 > sm33) {
    S = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2;
    out[3] = (sm31 - sm13) / S;
    out[0] = (sm12 + sm21) / S;
    out[1] = 0.25 * S;
    out[2] = (sm23 + sm32) / S;
  } else {
    S = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2;
    out[3] = (sm12 - sm21) / S;
    out[0] = (sm31 + sm13) / S;
    out[1] = (sm23 + sm32) / S;
    out[2] = 0.25 * S;
  }

  return out;
}
/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {ReadonlyVec3} v Translation vector
 * @param {ReadonlyVec3} s Scaling vector
 * @returns {mat4} out
 */

function fromRotationTranslationScale(out, q, v, s) {
  // Quaternion math
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s[0];
  var sy = s[1];
  var sz = s[2];
  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     mat4.translate(dest, origin);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *     mat4.translate(dest, negativeOrigin);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {ReadonlyVec3} v Translation vector
 * @param {ReadonlyVec3} s Scaling vector
 * @param {ReadonlyVec3} o The origin vector around which to scale and rotate
 * @returns {mat4} out
 */

function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
  // Quaternion math
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s[0];
  var sy = s[1];
  var sz = s[2];
  var ox = o[0];
  var oy = o[1];
  var oz = o[2];
  var out0 = (1 - (yy + zz)) * sx;
  var out1 = (xy + wz) * sx;
  var out2 = (xz - wy) * sx;
  var out4 = (xy - wz) * sy;
  var out5 = (1 - (xx + zz)) * sy;
  var out6 = (yz + wx) * sy;
  var out8 = (xz + wy) * sz;
  var out9 = (yz - wx) * sz;
  var out10 = (1 - (xx + yy)) * sz;
  out[0] = out0;
  out[1] = out1;
  out[2] = out2;
  out[3] = 0;
  out[4] = out4;
  out[5] = out5;
  out[6] = out6;
  out[7] = 0;
  out[8] = out8;
  out[9] = out9;
  out[10] = out10;
  out[11] = 0;
  out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
  out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
  out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
  out[15] = 1;
  return out;
}
/**
 * Calculates a 4x4 matrix from the given quaternion
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyQuat} q Quaternion to create matrix from
 *
 * @returns {mat4} out
 */

function fromQuat(out, q) {
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var yx = y * x2;
  var yy = y * y2;
  var zx = z * x2;
  var zy = z * y2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - yy - zz;
  out[1] = yx + wz;
  out[2] = zx - wy;
  out[3] = 0;
  out[4] = yx - wz;
  out[5] = 1 - xx - zz;
  out[6] = zy + wx;
  out[7] = 0;
  out[8] = zx + wy;
  out[9] = zy - wx;
  out[10] = 1 - xx - yy;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */

function frustum(out, left, right, bottom, top, near, far) {
  var rl = 1 / (right - left);
  var tb = 1 / (top - bottom);
  var nf = 1 / (near - far);
  out[0] = near * 2 * rl;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = near * 2 * tb;
  out[6] = 0;
  out[7] = 0;
  out[8] = (right + left) * rl;
  out[9] = (top + bottom) * tb;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = far * near * 2 * nf;
  out[15] = 0;
  return out;
}
/**
 * Generates a perspective projection matrix with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
 * which matches WebGL/OpenGL's clip volume.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {mat4} out
 */

function perspectiveNO(out, fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(fovy / 2),
      nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;

  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = (far + near) * nf;
    out[14] = 2 * far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -2 * near;
  }

  return out;
}
/**
 * Alias for {@link mat4.perspectiveNO}
 * @function
 */

var perspective = perspectiveNO;
/**
 * Generates a perspective projection matrix suitable for WebGPU with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
 * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {mat4} out
 */

function perspectiveZO(out, fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(fovy / 2),
      nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;

  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = far * nf;
    out[14] = far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -near;
  }

  return out;
}
/**
 * Generates a perspective projection matrix with the given field of view.
 * This is primarily useful for generating projection matrices to be used
 * with the still experiemental WebVR API.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */

function perspectiveFromFieldOfView(out, fov, near, far) {
  var upTan = Math.tan(fov.upDegrees * Math.PI / 180.0);
  var downTan = Math.tan(fov.downDegrees * Math.PI / 180.0);
  var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180.0);
  var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180.0);
  var xScale = 2.0 / (leftTan + rightTan);
  var yScale = 2.0 / (upTan + downTan);
  out[0] = xScale;
  out[1] = 0.0;
  out[2] = 0.0;
  out[3] = 0.0;
  out[4] = 0.0;
  out[5] = yScale;
  out[6] = 0.0;
  out[7] = 0.0;
  out[8] = -((leftTan - rightTan) * xScale * 0.5);
  out[9] = (upTan - downTan) * yScale * 0.5;
  out[10] = far / (near - far);
  out[11] = -1.0;
  out[12] = 0.0;
  out[13] = 0.0;
  out[14] = far * near / (near - far);
  out[15] = 0.0;
  return out;
}
/**
 * Generates a orthogonal projection matrix with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
 * which matches WebGL/OpenGL's clip volume.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */

function orthoNO(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}
/**
 * Alias for {@link mat4.orthoNO}
 * @function
 */

var ortho = orthoNO;
/**
 * Generates a orthogonal projection matrix with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
 * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */

function orthoZO(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = near * nf;
  out[15] = 1;
  return out;
}
/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis.
 * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {ReadonlyVec3} eye Position of the viewer
 * @param {ReadonlyVec3} center Point the viewer is looking at
 * @param {ReadonlyVec3} up vec3 pointing up
 * @returns {mat4} out
 */

function lookAt(out, eye, center, up) {
  var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
  var eyex = eye[0];
  var eyey = eye[1];
  var eyez = eye[2];
  var upx = up[0];
  var upy = up[1];
  var upz = up[2];
  var centerx = center[0];
  var centery = center[1];
  var centerz = center[2];

  if (Math.abs(eyex - centerx) < _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON && Math.abs(eyey - centery) < _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON && Math.abs(eyez - centerz) < _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON) {
    return identity(out);
  }

  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;
  len = 1 / Math.hypot(z0, z1, z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;
  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;
  len = Math.hypot(x0, x1, x2);

  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;
  len = Math.hypot(y0, y1, y2);

  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }

  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;
  return out;
}
/**
 * Generates a matrix that makes something look at something else.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {ReadonlyVec3} eye Position of the viewer
 * @param {ReadonlyVec3} center Point the viewer is looking at
 * @param {ReadonlyVec3} up vec3 pointing up
 * @returns {mat4} out
 */

function targetTo(out, eye, target, up) {
  var eyex = eye[0],
      eyey = eye[1],
      eyez = eye[2],
      upx = up[0],
      upy = up[1],
      upz = up[2];
  var z0 = eyex - target[0],
      z1 = eyey - target[1],
      z2 = eyez - target[2];
  var len = z0 * z0 + z1 * z1 + z2 * z2;

  if (len > 0) {
    len = 1 / Math.sqrt(len);
    z0 *= len;
    z1 *= len;
    z2 *= len;
  }

  var x0 = upy * z2 - upz * z1,
      x1 = upz * z0 - upx * z2,
      x2 = upx * z1 - upy * z0;
  len = x0 * x0 + x1 * x1 + x2 * x2;

  if (len > 0) {
    len = 1 / Math.sqrt(len);
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  out[0] = x0;
  out[1] = x1;
  out[2] = x2;
  out[3] = 0;
  out[4] = z1 * x2 - z2 * x1;
  out[5] = z2 * x0 - z0 * x2;
  out[6] = z0 * x1 - z1 * x0;
  out[7] = 0;
  out[8] = z0;
  out[9] = z1;
  out[10] = z2;
  out[11] = 0;
  out[12] = eyex;
  out[13] = eyey;
  out[14] = eyez;
  out[15] = 1;
  return out;
}
/**
 * Returns a string representation of a mat4
 *
 * @param {ReadonlyMat4} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */

function str(a) {
  return "mat4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ", " + a[9] + ", " + a[10] + ", " + a[11] + ", " + a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + ")";
}
/**
 * Returns Frobenius norm of a mat4
 *
 * @param {ReadonlyMat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */

function frob(a) {
  return Math.hypot(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15]);
}
/**
 * Adds two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */

function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  out[9] = a[9] + b[9];
  out[10] = a[10] + b[10];
  out[11] = a[11] + b[11];
  out[12] = a[12] + b[12];
  out[13] = a[13] + b[13];
  out[14] = a[14] + b[14];
  out[15] = a[15] + b[15];
  return out;
}
/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */

function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  out[9] = a[9] - b[9];
  out[10] = a[10] - b[10];
  out[11] = a[11] - b[11];
  out[12] = a[12] - b[12];
  out[13] = a[13] - b[13];
  out[14] = a[14] - b[14];
  out[15] = a[15] - b[15];
  return out;
}
/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat4} out
 */

function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  out[9] = a[9] * b;
  out[10] = a[10] * b;
  out[11] = a[11] * b;
  out[12] = a[12] * b;
  out[13] = a[13] * b;
  out[14] = a[14] * b;
  out[15] = a[15] * b;
  return out;
}
/**
 * Adds two mat4's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat4} out the receiving vector
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat4} out
 */

function multiplyScalarAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  out[3] = a[3] + b[3] * scale;
  out[4] = a[4] + b[4] * scale;
  out[5] = a[5] + b[5] * scale;
  out[6] = a[6] + b[6] * scale;
  out[7] = a[7] + b[7] * scale;
  out[8] = a[8] + b[8] * scale;
  out[9] = a[9] + b[9] * scale;
  out[10] = a[10] + b[10] * scale;
  out[11] = a[11] + b[11] * scale;
  out[12] = a[12] + b[12] * scale;
  out[13] = a[13] + b[13] * scale;
  out[14] = a[14] + b[14] * scale;
  out[15] = a[15] + b[15] * scale;
  return out;
}
/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyMat4} a The first matrix.
 * @param {ReadonlyMat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
}
/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {ReadonlyMat4} a The first matrix.
 * @param {ReadonlyMat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function equals(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  var a4 = a[4],
      a5 = a[5],
      a6 = a[6],
      a7 = a[7];
  var a8 = a[8],
      a9 = a[9],
      a10 = a[10],
      a11 = a[11];
  var a12 = a[12],
      a13 = a[13],
      a14 = a[14],
      a15 = a[15];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  var b4 = b[4],
      b5 = b[5],
      b6 = b[6],
      b7 = b[7];
  var b8 = b[8],
      b9 = b[9],
      b10 = b[10],
      b11 = b[11];
  var b12 = b[12],
      b13 = b[13],
      b14 = b[14],
      b15 = b[15];
  return Math.abs(a0 - b0) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a15), Math.abs(b15));
}
/**
 * Alias for {@link mat4.multiply}
 * @function
 */

var mul = multiply;
/**
 * Alias for {@link mat4.subtract}
 * @function
 */

var sub = subtract;

/***/ }),

/***/ "./node_modules/gl-matrix/esm/quat.js":
/*!********************************************!*\
  !*** ./node_modules/gl-matrix/esm/quat.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "add": () => (/* binding */ add),
/* harmony export */   "calculateW": () => (/* binding */ calculateW),
/* harmony export */   "clone": () => (/* binding */ clone),
/* harmony export */   "conjugate": () => (/* binding */ conjugate),
/* harmony export */   "copy": () => (/* binding */ copy),
/* harmony export */   "create": () => (/* binding */ create),
/* harmony export */   "dot": () => (/* binding */ dot),
/* harmony export */   "equals": () => (/* binding */ equals),
/* harmony export */   "exactEquals": () => (/* binding */ exactEquals),
/* harmony export */   "exp": () => (/* binding */ exp),
/* harmony export */   "fromEuler": () => (/* binding */ fromEuler),
/* harmony export */   "fromMat3": () => (/* binding */ fromMat3),
/* harmony export */   "fromValues": () => (/* binding */ fromValues),
/* harmony export */   "getAngle": () => (/* binding */ getAngle),
/* harmony export */   "getAxisAngle": () => (/* binding */ getAxisAngle),
/* harmony export */   "identity": () => (/* binding */ identity),
/* harmony export */   "invert": () => (/* binding */ invert),
/* harmony export */   "len": () => (/* binding */ len),
/* harmony export */   "length": () => (/* binding */ length),
/* harmony export */   "lerp": () => (/* binding */ lerp),
/* harmony export */   "ln": () => (/* binding */ ln),
/* harmony export */   "mul": () => (/* binding */ mul),
/* harmony export */   "multiply": () => (/* binding */ multiply),
/* harmony export */   "normalize": () => (/* binding */ normalize),
/* harmony export */   "pow": () => (/* binding */ pow),
/* harmony export */   "random": () => (/* binding */ random),
/* harmony export */   "rotateX": () => (/* binding */ rotateX),
/* harmony export */   "rotateY": () => (/* binding */ rotateY),
/* harmony export */   "rotateZ": () => (/* binding */ rotateZ),
/* harmony export */   "rotationTo": () => (/* binding */ rotationTo),
/* harmony export */   "scale": () => (/* binding */ scale),
/* harmony export */   "set": () => (/* binding */ set),
/* harmony export */   "setAxes": () => (/* binding */ setAxes),
/* harmony export */   "setAxisAngle": () => (/* binding */ setAxisAngle),
/* harmony export */   "slerp": () => (/* binding */ slerp),
/* harmony export */   "sqlerp": () => (/* binding */ sqlerp),
/* harmony export */   "sqrLen": () => (/* binding */ sqrLen),
/* harmony export */   "squaredLength": () => (/* binding */ squaredLength),
/* harmony export */   "str": () => (/* binding */ str)
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common.js */ "./node_modules/gl-matrix/esm/common.js");
/* harmony import */ var _mat3_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./mat3.js */ "./node_modules/gl-matrix/esm/mat3.js");
/* harmony import */ var _vec3_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./vec3.js */ "./node_modules/gl-matrix/esm/vec3.js");
/* harmony import */ var _vec4_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vec4.js */ "./node_modules/gl-matrix/esm/vec4.js");




/**
 * Quaternion
 * @module quat
 */

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */

function create() {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(4);

  if (_common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  out[3] = 1;
  return out;
}
/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */

function identity(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}
/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyVec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/

function setAxisAngle(out, axis, rad) {
  rad = rad * 0.5;
  var s = Math.sin(rad);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(rad);
  return out;
}
/**
 * Gets the rotation axis and angle for a given
 *  quaternion. If a quaternion is created with
 *  setAxisAngle, this method will return the same
 *  values as providied in the original parameter list
 *  OR functionally equivalent values.
 * Example: The quaternion formed by axis [0, 0, 1] and
 *  angle -90 is the same as the quaternion formed by
 *  [0, 0, 1] and 270. This method favors the latter.
 * @param  {vec3} out_axis  Vector receiving the axis of rotation
 * @param  {ReadonlyQuat} q     Quaternion to be decomposed
 * @return {Number}     Angle, in radians, of the rotation
 */

function getAxisAngle(out_axis, q) {
  var rad = Math.acos(q[3]) * 2.0;
  var s = Math.sin(rad / 2.0);

  if (s > _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON) {
    out_axis[0] = q[0] / s;
    out_axis[1] = q[1] / s;
    out_axis[2] = q[2] / s;
  } else {
    // If s is zero, return any axis (no rotation - axis does not matter)
    out_axis[0] = 1;
    out_axis[1] = 0;
    out_axis[2] = 0;
  }

  return rad;
}
/**
 * Gets the angular distance between two unit quaternions
 *
 * @param  {ReadonlyQuat} a     Origin unit quaternion
 * @param  {ReadonlyQuat} b     Destination unit quaternion
 * @return {Number}     Angle, in radians, between the two quaternions
 */

function getAngle(a, b) {
  var dotproduct = dot(a, b);
  return Math.acos(2 * dotproduct * dotproduct - 1);
}
/**
 * Multiplies two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @returns {quat} out
 */

function multiply(out, a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var bx = b[0],
      by = b[1],
      bz = b[2],
      bw = b[3];
  out[0] = ax * bw + aw * bx + ay * bz - az * by;
  out[1] = ay * bw + aw * by + az * bx - ax * bz;
  out[2] = az * bw + aw * bz + ax * by - ay * bx;
  out[3] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
}
/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {ReadonlyQuat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */

function rotateX(out, a, rad) {
  rad *= 0.5;
  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var bx = Math.sin(rad),
      bw = Math.cos(rad);
  out[0] = ax * bw + aw * bx;
  out[1] = ay * bw + az * bx;
  out[2] = az * bw - ay * bx;
  out[3] = aw * bw - ax * bx;
  return out;
}
/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {ReadonlyQuat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */

function rotateY(out, a, rad) {
  rad *= 0.5;
  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var by = Math.sin(rad),
      bw = Math.cos(rad);
  out[0] = ax * bw - az * by;
  out[1] = ay * bw + aw * by;
  out[2] = az * bw + ax * by;
  out[3] = aw * bw - ay * by;
  return out;
}
/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {ReadonlyQuat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */

function rotateZ(out, a, rad) {
  rad *= 0.5;
  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var bz = Math.sin(rad),
      bw = Math.cos(rad);
  out[0] = ax * bw + ay * bz;
  out[1] = ay * bw - ax * bz;
  out[2] = az * bw + aw * bz;
  out[3] = aw * bw - az * bz;
  return out;
}
/**
 * Calculates the W component of a quat from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quat to calculate W component of
 * @returns {quat} out
 */

function calculateW(out, a) {
  var x = a[0],
      y = a[1],
      z = a[2];
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
  return out;
}
/**
 * Calculate the exponential of a unit quaternion.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quat to calculate the exponential of
 * @returns {quat} out
 */

function exp(out, a) {
  var x = a[0],
      y = a[1],
      z = a[2],
      w = a[3];
  var r = Math.sqrt(x * x + y * y + z * z);
  var et = Math.exp(w);
  var s = r > 0 ? et * Math.sin(r) / r : 0;
  out[0] = x * s;
  out[1] = y * s;
  out[2] = z * s;
  out[3] = et * Math.cos(r);
  return out;
}
/**
 * Calculate the natural logarithm of a unit quaternion.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quat to calculate the exponential of
 * @returns {quat} out
 */

function ln(out, a) {
  var x = a[0],
      y = a[1],
      z = a[2],
      w = a[3];
  var r = Math.sqrt(x * x + y * y + z * z);
  var t = r > 0 ? Math.atan2(r, w) / r : 0;
  out[0] = x * t;
  out[1] = y * t;
  out[2] = z * t;
  out[3] = 0.5 * Math.log(x * x + y * y + z * z + w * w);
  return out;
}
/**
 * Calculate the scalar power of a unit quaternion.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quat to calculate the exponential of
 * @param {Number} b amount to scale the quaternion by
 * @returns {quat} out
 */

function pow(out, a, b) {
  ln(out, a);
  scale(out, out, b);
  exp(out, out);
  return out;
}
/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 */

function slerp(out, a, b, t) {
  // benchmarks:
  //    http://jsperf.com/quaternion-slerp-implementations
  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var bx = b[0],
      by = b[1],
      bz = b[2],
      bw = b[3];
  var omega, cosom, sinom, scale0, scale1; // calc cosine

  cosom = ax * bx + ay * by + az * bz + aw * bw; // adjust signs (if necessary)

  if (cosom < 0.0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  } // calculate coefficients


  if (1.0 - cosom > _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON) {
    // standard case (slerp)
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1.0 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    // "from" and "to" quaternions are very close
    //  ... so we can do a linear interpolation
    scale0 = 1.0 - t;
    scale1 = t;
  } // calculate final values


  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;
  return out;
}
/**
 * Generates a random unit quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */

function random(out) {
  // Implementation of http://planning.cs.uiuc.edu/node198.html
  // TODO: Calling random 3 times is probably not the fastest solution
  var u1 = _common_js__WEBPACK_IMPORTED_MODULE_0__.RANDOM();
  var u2 = _common_js__WEBPACK_IMPORTED_MODULE_0__.RANDOM();
  var u3 = _common_js__WEBPACK_IMPORTED_MODULE_0__.RANDOM();
  var sqrt1MinusU1 = Math.sqrt(1 - u1);
  var sqrtU1 = Math.sqrt(u1);
  out[0] = sqrt1MinusU1 * Math.sin(2.0 * Math.PI * u2);
  out[1] = sqrt1MinusU1 * Math.cos(2.0 * Math.PI * u2);
  out[2] = sqrtU1 * Math.sin(2.0 * Math.PI * u3);
  out[3] = sqrtU1 * Math.cos(2.0 * Math.PI * u3);
  return out;
}
/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quat to calculate inverse of
 * @returns {quat} out
 */

function invert(out, a) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  var dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
  var invDot = dot ? 1.0 / dot : 0; // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

  out[0] = -a0 * invDot;
  out[1] = -a1 * invDot;
  out[2] = -a2 * invDot;
  out[3] = a3 * invDot;
  return out;
}
/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quat to calculate conjugate of
 * @returns {quat} out
 */

function conjugate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a[3];
  return out;
}
/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyMat3} m rotation matrix
 * @returns {quat} out
 * @function
 */

function fromMat3(out, m) {
  // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
  // article "Quaternion Calculus and Fast Animation".
  var fTrace = m[0] + m[4] + m[8];
  var fRoot;

  if (fTrace > 0.0) {
    // |w| > 1/2, may as well choose w > 1/2
    fRoot = Math.sqrt(fTrace + 1.0); // 2w

    out[3] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot; // 1/(4w)

    out[0] = (m[5] - m[7]) * fRoot;
    out[1] = (m[6] - m[2]) * fRoot;
    out[2] = (m[1] - m[3]) * fRoot;
  } else {
    // |w| <= 1/2
    var i = 0;
    if (m[4] > m[0]) i = 1;
    if (m[8] > m[i * 3 + i]) i = 2;
    var j = (i + 1) % 3;
    var k = (i + 2) % 3;
    fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
    out[i] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
    out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
    out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
  }

  return out;
}
/**
 * Creates a quaternion from the given euler angle x, y, z.
 *
 * @param {quat} out the receiving quaternion
 * @param {x} Angle to rotate around X axis in degrees.
 * @param {y} Angle to rotate around Y axis in degrees.
 * @param {z} Angle to rotate around Z axis in degrees.
 * @returns {quat} out
 * @function
 */

function fromEuler(out, x, y, z) {
  var halfToRad = 0.5 * Math.PI / 180.0;
  x *= halfToRad;
  y *= halfToRad;
  z *= halfToRad;
  var sx = Math.sin(x);
  var cx = Math.cos(x);
  var sy = Math.sin(y);
  var cy = Math.cos(y);
  var sz = Math.sin(z);
  var cz = Math.cos(z);
  out[0] = sx * cy * cz - cx * sy * sz;
  out[1] = cx * sy * cz + sx * cy * sz;
  out[2] = cx * cy * sz - sx * sy * cz;
  out[3] = cx * cy * cz + sx * sy * sz;
  return out;
}
/**
 * Returns a string representation of a quatenion
 *
 * @param {ReadonlyQuat} a vector to represent as a string
 * @returns {String} string representation of the vector
 */

function str(a) {
  return "quat(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
}
/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {ReadonlyQuat} a quaternion to clone
 * @returns {quat} a new quaternion
 * @function
 */

var clone = _vec4_js__WEBPACK_IMPORTED_MODULE_1__.clone;
/**
 * Creates a new quat initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} a new quaternion
 * @function
 */

var fromValues = _vec4_js__WEBPACK_IMPORTED_MODULE_1__.fromValues;
/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the source quaternion
 * @returns {quat} out
 * @function
 */

var copy = _vec4_js__WEBPACK_IMPORTED_MODULE_1__.copy;
/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */

var set = _vec4_js__WEBPACK_IMPORTED_MODULE_1__.set;
/**
 * Adds two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @returns {quat} out
 * @function
 */

var add = _vec4_js__WEBPACK_IMPORTED_MODULE_1__.add;
/**
 * Alias for {@link quat.multiply}
 * @function
 */

var mul = multiply;
/**
 * Scales a quat by a scalar number
 *
 * @param {quat} out the receiving vector
 * @param {ReadonlyQuat} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {quat} out
 * @function
 */

var scale = _vec4_js__WEBPACK_IMPORTED_MODULE_1__.scale;
/**
 * Calculates the dot product of two quat's
 *
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */

var dot = _vec4_js__WEBPACK_IMPORTED_MODULE_1__.dot;
/**
 * Performs a linear interpolation between two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 * @function
 */

var lerp = _vec4_js__WEBPACK_IMPORTED_MODULE_1__.lerp;
/**
 * Calculates the length of a quat
 *
 * @param {ReadonlyQuat} a vector to calculate length of
 * @returns {Number} length of a
 */

var length = _vec4_js__WEBPACK_IMPORTED_MODULE_1__.length;
/**
 * Alias for {@link quat.length}
 * @function
 */

var len = length;
/**
 * Calculates the squared length of a quat
 *
 * @param {ReadonlyQuat} a vector to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */

var squaredLength = _vec4_js__WEBPACK_IMPORTED_MODULE_1__.squaredLength;
/**
 * Alias for {@link quat.squaredLength}
 * @function
 */

var sqrLen = squaredLength;
/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */

var normalize = _vec4_js__WEBPACK_IMPORTED_MODULE_1__.normalize;
/**
 * Returns whether or not the quaternions have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyQuat} a The first quaternion.
 * @param {ReadonlyQuat} b The second quaternion.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

var exactEquals = _vec4_js__WEBPACK_IMPORTED_MODULE_1__.exactEquals;
/**
 * Returns whether or not the quaternions have approximately the same elements in the same position.
 *
 * @param {ReadonlyQuat} a The first vector.
 * @param {ReadonlyQuat} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

var equals = _vec4_js__WEBPACK_IMPORTED_MODULE_1__.equals;
/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {ReadonlyVec3} a the initial vector
 * @param {ReadonlyVec3} b the destination vector
 * @returns {quat} out
 */

var rotationTo = function () {
  var tmpvec3 = _vec3_js__WEBPACK_IMPORTED_MODULE_2__.create();
  var xUnitVec3 = _vec3_js__WEBPACK_IMPORTED_MODULE_2__.fromValues(1, 0, 0);
  var yUnitVec3 = _vec3_js__WEBPACK_IMPORTED_MODULE_2__.fromValues(0, 1, 0);
  return function (out, a, b) {
    var dot = _vec3_js__WEBPACK_IMPORTED_MODULE_2__.dot(a, b);

    if (dot < -0.999999) {
      _vec3_js__WEBPACK_IMPORTED_MODULE_2__.cross(tmpvec3, xUnitVec3, a);
      if (_vec3_js__WEBPACK_IMPORTED_MODULE_2__.len(tmpvec3) < 0.000001) _vec3_js__WEBPACK_IMPORTED_MODULE_2__.cross(tmpvec3, yUnitVec3, a);
      _vec3_js__WEBPACK_IMPORTED_MODULE_2__.normalize(tmpvec3, tmpvec3);
      setAxisAngle(out, tmpvec3, Math.PI);
      return out;
    } else if (dot > 0.999999) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    } else {
      _vec3_js__WEBPACK_IMPORTED_MODULE_2__.cross(tmpvec3, a, b);
      out[0] = tmpvec3[0];
      out[1] = tmpvec3[1];
      out[2] = tmpvec3[2];
      out[3] = 1 + dot;
      return normalize(out, out);
    }
  };
}();
/**
 * Performs a spherical linear interpolation with two control points
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @param {ReadonlyQuat} c the third operand
 * @param {ReadonlyQuat} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 */

var sqlerp = function () {
  var temp1 = create();
  var temp2 = create();
  return function (out, a, b, c, d, t) {
    slerp(temp1, a, d, t);
    slerp(temp2, b, c, t);
    slerp(out, temp1, temp2, 2 * t * (1 - t));
    return out;
  };
}();
/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {ReadonlyVec3} view  the vector representing the viewing direction
 * @param {ReadonlyVec3} right the vector representing the local "right" direction
 * @param {ReadonlyVec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */

var setAxes = function () {
  var matr = _mat3_js__WEBPACK_IMPORTED_MODULE_3__.create();
  return function (out, view, right, up) {
    matr[0] = right[0];
    matr[3] = right[1];
    matr[6] = right[2];
    matr[1] = up[0];
    matr[4] = up[1];
    matr[7] = up[2];
    matr[2] = -view[0];
    matr[5] = -view[1];
    matr[8] = -view[2];
    return normalize(out, fromMat3(out, matr));
  };
}();

/***/ }),

/***/ "./node_modules/gl-matrix/esm/vec3.js":
/*!********************************************!*\
  !*** ./node_modules/gl-matrix/esm/vec3.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "add": () => (/* binding */ add),
/* harmony export */   "angle": () => (/* binding */ angle),
/* harmony export */   "bezier": () => (/* binding */ bezier),
/* harmony export */   "ceil": () => (/* binding */ ceil),
/* harmony export */   "clone": () => (/* binding */ clone),
/* harmony export */   "copy": () => (/* binding */ copy),
/* harmony export */   "create": () => (/* binding */ create),
/* harmony export */   "cross": () => (/* binding */ cross),
/* harmony export */   "dist": () => (/* binding */ dist),
/* harmony export */   "distance": () => (/* binding */ distance),
/* harmony export */   "div": () => (/* binding */ div),
/* harmony export */   "divide": () => (/* binding */ divide),
/* harmony export */   "dot": () => (/* binding */ dot),
/* harmony export */   "equals": () => (/* binding */ equals),
/* harmony export */   "exactEquals": () => (/* binding */ exactEquals),
/* harmony export */   "floor": () => (/* binding */ floor),
/* harmony export */   "forEach": () => (/* binding */ forEach),
/* harmony export */   "fromValues": () => (/* binding */ fromValues),
/* harmony export */   "hermite": () => (/* binding */ hermite),
/* harmony export */   "inverse": () => (/* binding */ inverse),
/* harmony export */   "len": () => (/* binding */ len),
/* harmony export */   "length": () => (/* binding */ length),
/* harmony export */   "lerp": () => (/* binding */ lerp),
/* harmony export */   "max": () => (/* binding */ max),
/* harmony export */   "min": () => (/* binding */ min),
/* harmony export */   "mul": () => (/* binding */ mul),
/* harmony export */   "multiply": () => (/* binding */ multiply),
/* harmony export */   "negate": () => (/* binding */ negate),
/* harmony export */   "normalize": () => (/* binding */ normalize),
/* harmony export */   "random": () => (/* binding */ random),
/* harmony export */   "rotateX": () => (/* binding */ rotateX),
/* harmony export */   "rotateY": () => (/* binding */ rotateY),
/* harmony export */   "rotateZ": () => (/* binding */ rotateZ),
/* harmony export */   "round": () => (/* binding */ round),
/* harmony export */   "scale": () => (/* binding */ scale),
/* harmony export */   "scaleAndAdd": () => (/* binding */ scaleAndAdd),
/* harmony export */   "set": () => (/* binding */ set),
/* harmony export */   "sqrDist": () => (/* binding */ sqrDist),
/* harmony export */   "sqrLen": () => (/* binding */ sqrLen),
/* harmony export */   "squaredDistance": () => (/* binding */ squaredDistance),
/* harmony export */   "squaredLength": () => (/* binding */ squaredLength),
/* harmony export */   "str": () => (/* binding */ str),
/* harmony export */   "sub": () => (/* binding */ sub),
/* harmony export */   "subtract": () => (/* binding */ subtract),
/* harmony export */   "transformMat3": () => (/* binding */ transformMat3),
/* harmony export */   "transformMat4": () => (/* binding */ transformMat4),
/* harmony export */   "transformQuat": () => (/* binding */ transformQuat),
/* harmony export */   "zero": () => (/* binding */ zero)
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common.js */ "./node_modules/gl-matrix/esm/common.js");

/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */

function create() {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(3);

  if (_common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  return out;
}
/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {ReadonlyVec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */

function clone(a) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(3);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
/**
 * Calculates the length of a vec3
 *
 * @param {ReadonlyVec3} a vector to calculate length of
 * @returns {Number} length of a
 */

function length(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return Math.hypot(x, y, z);
}
/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */

function fromValues(x, y, z) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the source vector
 * @returns {vec3} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */

function set(out, x, y, z) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}
/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}
/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
}
/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
}
/**
 * Math.ceil the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to ceil
 * @returns {vec3} out
 */

function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  return out;
}
/**
 * Math.floor the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to floor
 * @returns {vec3} out
 */

function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  return out;
}
/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  return out;
}
/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  return out;
}
/**
 * Math.round the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to round
 * @returns {vec3} out
 */

function round(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  out[2] = Math.round(a[2]);
  return out;
}
/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */

function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}
/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */

function scaleAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  return out;
}
/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} distance between a and b
 */

function distance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return Math.hypot(x, y, z);
}
/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} squared distance between a and b
 */

function squaredDistance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return x * x + y * y + z * z;
}
/**
 * Calculates the squared length of a vec3
 *
 * @param {ReadonlyVec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */

function squaredLength(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return x * x + y * y + z * z;
}
/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to negate
 * @returns {vec3} out
 */

function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
}
/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to invert
 * @returns {vec3} out
 */

function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  return out;
}
/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to normalize
 * @returns {vec3} out
 */

function normalize(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var len = x * x + y * y + z * z;

  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
  }

  out[0] = a[0] * len;
  out[1] = a[1] * len;
  out[2] = a[2] * len;
  return out;
}
/**
 * Calculates the dot product of two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} dot product of a and b
 */

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function cross(out, a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2];
  var bx = b[0],
      by = b[1],
      bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */

function lerp(out, a, b, t) {
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  return out;
}
/**
 * Performs a hermite interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {ReadonlyVec3} c the third operand
 * @param {ReadonlyVec3} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */

function hermite(out, a, b, c, d, t) {
  var factorTimes2 = t * t;
  var factor1 = factorTimes2 * (2 * t - 3) + 1;
  var factor2 = factorTimes2 * (t - 2) + t;
  var factor3 = factorTimes2 * (t - 1);
  var factor4 = factorTimes2 * (3 - 2 * t);
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}
/**
 * Performs a bezier interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {ReadonlyVec3} c the third operand
 * @param {ReadonlyVec3} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */

function bezier(out, a, b, c, d, t) {
  var inverseFactor = 1 - t;
  var inverseFactorTimesTwo = inverseFactor * inverseFactor;
  var factorTimes2 = t * t;
  var factor1 = inverseFactorTimesTwo * inverseFactor;
  var factor2 = 3 * t * inverseFactorTimesTwo;
  var factor3 = 3 * factorTimes2 * inverseFactor;
  var factor4 = factorTimes2 * t;
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}
/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */

function random(out, scale) {
  scale = scale || 1.0;
  var r = _common_js__WEBPACK_IMPORTED_MODULE_0__.RANDOM() * 2.0 * Math.PI;
  var z = _common_js__WEBPACK_IMPORTED_MODULE_0__.RANDOM() * 2.0 - 1.0;
  var zScale = Math.sqrt(1.0 - z * z) * scale;
  out[0] = Math.cos(r) * zScale;
  out[1] = Math.sin(r) * zScale;
  out[2] = z * scale;
  return out;
}
/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyMat4} m matrix to transform with
 * @returns {vec3} out
 */

function transformMat4(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2];
  var w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}
/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyMat3} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */

function transformMat3(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2];
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
}
/**
 * Transforms the vec3 with a quat
 * Can also be used for dual quaternions. (Multiply it with the real part)
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyQuat} q quaternion to transform with
 * @returns {vec3} out
 */

function transformQuat(out, a, q) {
  // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed
  var qx = q[0],
      qy = q[1],
      qz = q[2],
      qw = q[3];
  var x = a[0],
      y = a[1],
      z = a[2]; // var qvec = [qx, qy, qz];
  // var uv = vec3.cross([], qvec, a);

  var uvx = qy * z - qz * y,
      uvy = qz * x - qx * z,
      uvz = qx * y - qy * x; // var uuv = vec3.cross([], qvec, uv);

  var uuvx = qy * uvz - qz * uvy,
      uuvy = qz * uvx - qx * uvz,
      uuvz = qx * uvy - qy * uvx; // vec3.scale(uv, uv, 2 * w);

  var w2 = qw * 2;
  uvx *= w2;
  uvy *= w2;
  uvz *= w2; // vec3.scale(uuv, uuv, 2);

  uuvx *= 2;
  uuvy *= 2;
  uuvz *= 2; // return vec3.add(out, a, vec3.add(out, uv, uuv));

  out[0] = x + uvx + uuvx;
  out[1] = y + uvy + uuvy;
  out[2] = z + uvz + uuvz;
  return out;
}
/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */

function rotateX(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[0];
  r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
  r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad); //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */

function rotateY(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
  r[1] = p[1];
  r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad); //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */

function rotateZ(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
  r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
  r[2] = p[2]; //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Get the angle between two 3D vectors
 * @param {ReadonlyVec3} a The first operand
 * @param {ReadonlyVec3} b The second operand
 * @returns {Number} The angle in radians
 */

function angle(a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2],
      bx = b[0],
      by = b[1],
      bz = b[2],
      mag1 = Math.sqrt(ax * ax + ay * ay + az * az),
      mag2 = Math.sqrt(bx * bx + by * by + bz * bz),
      mag = mag1 * mag2,
      cosine = mag && dot(a, b) / mag;
  return Math.acos(Math.min(Math.max(cosine, -1), 1));
}
/**
 * Set the components of a vec3 to zero
 *
 * @param {vec3} out the receiving vector
 * @returns {vec3} out
 */

function zero(out) {
  out[0] = 0.0;
  out[1] = 0.0;
  out[2] = 0.0;
  return out;
}
/**
 * Returns a string representation of a vector
 *
 * @param {ReadonlyVec3} a vector to represent as a string
 * @returns {String} string representation of the vector
 */

function str(a) {
  return "vec3(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
}
/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyVec3} a The first vector.
 * @param {ReadonlyVec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}
/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {ReadonlyVec3} a The first vector.
 * @param {ReadonlyVec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function equals(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2];
  return Math.abs(a0 - b0) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2));
}
/**
 * Alias for {@link vec3.subtract}
 * @function
 */

var sub = subtract;
/**
 * Alias for {@link vec3.multiply}
 * @function
 */

var mul = multiply;
/**
 * Alias for {@link vec3.divide}
 * @function
 */

var div = divide;
/**
 * Alias for {@link vec3.distance}
 * @function
 */

var dist = distance;
/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */

var sqrDist = squaredDistance;
/**
 * Alias for {@link vec3.length}
 * @function
 */

var len = length;
/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */

var sqrLen = squaredLength;
/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

var forEach = function () {
  var vec = create();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 3;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }

    return a;
  };
}();

/***/ }),

/***/ "./node_modules/gl-matrix/esm/vec4.js":
/*!********************************************!*\
  !*** ./node_modules/gl-matrix/esm/vec4.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "add": () => (/* binding */ add),
/* harmony export */   "ceil": () => (/* binding */ ceil),
/* harmony export */   "clone": () => (/* binding */ clone),
/* harmony export */   "copy": () => (/* binding */ copy),
/* harmony export */   "create": () => (/* binding */ create),
/* harmony export */   "cross": () => (/* binding */ cross),
/* harmony export */   "dist": () => (/* binding */ dist),
/* harmony export */   "distance": () => (/* binding */ distance),
/* harmony export */   "div": () => (/* binding */ div),
/* harmony export */   "divide": () => (/* binding */ divide),
/* harmony export */   "dot": () => (/* binding */ dot),
/* harmony export */   "equals": () => (/* binding */ equals),
/* harmony export */   "exactEquals": () => (/* binding */ exactEquals),
/* harmony export */   "floor": () => (/* binding */ floor),
/* harmony export */   "forEach": () => (/* binding */ forEach),
/* harmony export */   "fromValues": () => (/* binding */ fromValues),
/* harmony export */   "inverse": () => (/* binding */ inverse),
/* harmony export */   "len": () => (/* binding */ len),
/* harmony export */   "length": () => (/* binding */ length),
/* harmony export */   "lerp": () => (/* binding */ lerp),
/* harmony export */   "max": () => (/* binding */ max),
/* harmony export */   "min": () => (/* binding */ min),
/* harmony export */   "mul": () => (/* binding */ mul),
/* harmony export */   "multiply": () => (/* binding */ multiply),
/* harmony export */   "negate": () => (/* binding */ negate),
/* harmony export */   "normalize": () => (/* binding */ normalize),
/* harmony export */   "random": () => (/* binding */ random),
/* harmony export */   "round": () => (/* binding */ round),
/* harmony export */   "scale": () => (/* binding */ scale),
/* harmony export */   "scaleAndAdd": () => (/* binding */ scaleAndAdd),
/* harmony export */   "set": () => (/* binding */ set),
/* harmony export */   "sqrDist": () => (/* binding */ sqrDist),
/* harmony export */   "sqrLen": () => (/* binding */ sqrLen),
/* harmony export */   "squaredDistance": () => (/* binding */ squaredDistance),
/* harmony export */   "squaredLength": () => (/* binding */ squaredLength),
/* harmony export */   "str": () => (/* binding */ str),
/* harmony export */   "sub": () => (/* binding */ sub),
/* harmony export */   "subtract": () => (/* binding */ subtract),
/* harmony export */   "transformMat4": () => (/* binding */ transformMat4),
/* harmony export */   "transformQuat": () => (/* binding */ transformQuat),
/* harmony export */   "zero": () => (/* binding */ zero)
/* harmony export */ });
/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common.js */ "./node_modules/gl-matrix/esm/common.js");

/**
 * 4 Dimensional Vector
 * @module vec4
 */

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */

function create() {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(4);

  if (_common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
  }

  return out;
}
/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {ReadonlyVec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */

function clone(a) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(4);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */

function fromValues(x, y, z, w) {
  var out = new _common_js__WEBPACK_IMPORTED_MODULE_0__.ARRAY_TYPE(4);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}
/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the source vector
 * @returns {vec4} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */

function set(out, x, y, z, w) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}
/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */

function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  return out;
}
/**
 * Subtracts vector b from vector a
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */

function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  return out;
}
/**
 * Multiplies two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */

function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  out[3] = a[3] * b[3];
  return out;
}
/**
 * Divides two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */

function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  out[3] = a[3] / b[3];
  return out;
}
/**
 * Math.ceil the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to ceil
 * @returns {vec4} out
 */

function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  out[3] = Math.ceil(a[3]);
  return out;
}
/**
 * Math.floor the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to floor
 * @returns {vec4} out
 */

function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  out[3] = Math.floor(a[3]);
  return out;
}
/**
 * Returns the minimum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */

function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  out[3] = Math.min(a[3], b[3]);
  return out;
}
/**
 * Returns the maximum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */

function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  out[3] = Math.max(a[3], b[3]);
  return out;
}
/**
 * Math.round the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to round
 * @returns {vec4} out
 */

function round(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  out[2] = Math.round(a[2]);
  out[3] = Math.round(a[3]);
  return out;
}
/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */

function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  return out;
}
/**
 * Adds two vec4's after scaling the second operand by a scalar value
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec4} out
 */

function scaleAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  out[3] = a[3] + b[3] * scale;
  return out;
}
/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {Number} distance between a and b
 */

function distance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  var w = b[3] - a[3];
  return Math.hypot(x, y, z, w);
}
/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {Number} squared distance between a and b
 */

function squaredDistance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  var w = b[3] - a[3];
  return x * x + y * y + z * z + w * w;
}
/**
 * Calculates the length of a vec4
 *
 * @param {ReadonlyVec4} a vector to calculate length of
 * @returns {Number} length of a
 */

function length(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  return Math.hypot(x, y, z, w);
}
/**
 * Calculates the squared length of a vec4
 *
 * @param {ReadonlyVec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */

function squaredLength(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  return x * x + y * y + z * z + w * w;
}
/**
 * Negates the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to negate
 * @returns {vec4} out
 */

function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = -a[3];
  return out;
}
/**
 * Returns the inverse of the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to invert
 * @returns {vec4} out
 */

function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  out[3] = 1.0 / a[3];
  return out;
}
/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to normalize
 * @returns {vec4} out
 */

function normalize(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  var len = x * x + y * y + z * z + w * w;

  if (len > 0) {
    len = 1 / Math.sqrt(len);
  }

  out[0] = x * len;
  out[1] = y * len;
  out[2] = z * len;
  out[3] = w * len;
  return out;
}
/**
 * Calculates the dot product of two vec4's
 *
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {Number} dot product of a and b
 */

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
}
/**
 * Returns the cross-product of three vectors in a 4-dimensional space
 *
 * @param {ReadonlyVec4} result the receiving vector
 * @param {ReadonlyVec4} U the first vector
 * @param {ReadonlyVec4} V the second vector
 * @param {ReadonlyVec4} W the third vector
 * @returns {vec4} result
 */

function cross(out, u, v, w) {
  var A = v[0] * w[1] - v[1] * w[0],
      B = v[0] * w[2] - v[2] * w[0],
      C = v[0] * w[3] - v[3] * w[0],
      D = v[1] * w[2] - v[2] * w[1],
      E = v[1] * w[3] - v[3] * w[1],
      F = v[2] * w[3] - v[3] * w[2];
  var G = u[0];
  var H = u[1];
  var I = u[2];
  var J = u[3];
  out[0] = H * F - I * E + J * D;
  out[1] = -(G * F) + I * C - J * B;
  out[2] = G * E - H * C + J * A;
  out[3] = -(G * D) + H * B - I * A;
  return out;
}
/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec4} out
 */

function lerp(out, a, b, t) {
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  var aw = a[3];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  out[3] = aw + t * (b[3] - aw);
  return out;
}
/**
 * Generates a random vector with the given scale
 *
 * @param {vec4} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec4} out
 */

function random(out, scale) {
  scale = scale || 1.0; // Marsaglia, George. Choosing a Point from the Surface of a
  // Sphere. Ann. Math. Statist. 43 (1972), no. 2, 645--646.
  // http://projecteuclid.org/euclid.aoms/1177692644;

  var v1, v2, v3, v4;
  var s1, s2;

  do {
    v1 = _common_js__WEBPACK_IMPORTED_MODULE_0__.RANDOM() * 2 - 1;
    v2 = _common_js__WEBPACK_IMPORTED_MODULE_0__.RANDOM() * 2 - 1;
    s1 = v1 * v1 + v2 * v2;
  } while (s1 >= 1);

  do {
    v3 = _common_js__WEBPACK_IMPORTED_MODULE_0__.RANDOM() * 2 - 1;
    v4 = _common_js__WEBPACK_IMPORTED_MODULE_0__.RANDOM() * 2 - 1;
    s2 = v3 * v3 + v4 * v4;
  } while (s2 >= 1);

  var d = Math.sqrt((1 - s1) / s2);
  out[0] = scale * v1;
  out[1] = scale * v2;
  out[2] = scale * v3 * d;
  out[3] = scale * v4 * d;
  return out;
}
/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the vector to transform
 * @param {ReadonlyMat4} m matrix to transform with
 * @returns {vec4} out
 */

function transformMat4(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2],
      w = a[3];
  out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
  out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
  out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
  out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
  return out;
}
/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the vector to transform
 * @param {ReadonlyQuat} q quaternion to transform with
 * @returns {vec4} out
 */

function transformQuat(out, a, q) {
  var x = a[0],
      y = a[1],
      z = a[2];
  var qx = q[0],
      qy = q[1],
      qz = q[2],
      qw = q[3]; // calculate quat * vec

  var ix = qw * x + qy * z - qz * y;
  var iy = qw * y + qz * x - qx * z;
  var iz = qw * z + qx * y - qy * x;
  var iw = -qx * x - qy * y - qz * z; // calculate result * inverse quat

  out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
  out[3] = a[3];
  return out;
}
/**
 * Set the components of a vec4 to zero
 *
 * @param {vec4} out the receiving vector
 * @returns {vec4} out
 */

function zero(out) {
  out[0] = 0.0;
  out[1] = 0.0;
  out[2] = 0.0;
  out[3] = 0.0;
  return out;
}
/**
 * Returns a string representation of a vector
 *
 * @param {ReadonlyVec4} a vector to represent as a string
 * @returns {String} string representation of the vector
 */

function str(a) {
  return "vec4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
}
/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyVec4} a The first vector.
 * @param {ReadonlyVec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}
/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {ReadonlyVec4} a The first vector.
 * @param {ReadonlyVec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function equals(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  return Math.abs(a0 - b0) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= _common_js__WEBPACK_IMPORTED_MODULE_0__.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3));
}
/**
 * Alias for {@link vec4.subtract}
 * @function
 */

var sub = subtract;
/**
 * Alias for {@link vec4.multiply}
 * @function
 */

var mul = multiply;
/**
 * Alias for {@link vec4.divide}
 * @function
 */

var div = divide;
/**
 * Alias for {@link vec4.distance}
 * @function
 */

var dist = distance;
/**
 * Alias for {@link vec4.squaredDistance}
 * @function
 */

var sqrDist = squaredDistance;
/**
 * Alias for {@link vec4.length}
 * @function
 */

var len = length;
/**
 * Alias for {@link vec4.squaredLength}
 * @function
 */

var sqrLen = squaredLength;
/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

var forEach = function () {
  var vec = create();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 4;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      vec[3] = a[i + 3];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
      a[i + 3] = vec[3];
    }

    return a;
  };
}();

/***/ }),

/***/ "./node_modules/gltf-loader-ts/lib/gltf-loader.js":
/*!********************************************************!*\
  !*** ./node_modules/gltf-loader-ts/lib/gltf-loader.js ***!
  \********************************************************/
/***/ ((module) => {

module.exports=function(e){var t={};function r(i){if(t[i])return t[i].exports;var s=t[i]={i:i,l:!1,exports:{}};return e[i].call(s.exports,s,s.exports,r),s.l=!0,s.exports}return r.m=e,r.c=t,r.d=function(e,t,i){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(r.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)r.d(i,s,function(t){return e[t]}.bind(null,s));return i},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=7)}([function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.LoadingManager=class{constructor(){this.urlModifier=void 0,this.onStart=void 0,this.onProgress=void 0,this.onLoad=void 0,this.onError=void 0,this.isLoading=!1,this.itemsLoaded=0,this.itemsTotal=0}itemStart(e){this.itemsTotal++,!this.isLoading&&this.onStart&&this.onStart(e,this.itemsLoaded,this.itemsTotal),this.isLoading=!0}itemEnd(e){this.itemsLoaded++,this.onProgress&&this.onProgress(e,this.itemsLoaded,this.itemsTotal),this.itemsLoaded===this.itemsTotal&&(this.isLoading=!1,this.onLoad&&this.onLoad())}itemError(e){this.onError&&this.onError(e)}resolveURL(e){return this.urlModifier?this.urlModifier(e):e}}},function(e,t,r){"use strict";var i=this&&this.__awaiter||function(e,t,r,i){return new(r||(r=Promise))(function(s,n){function o(e){try{u(i.next(e))}catch(e){n(e)}}function a(e){try{u(i.throw(e))}catch(e){n(e)}}function u(e){e.done?s(e.value):new r(function(t){t(e.value)}).then(o,a)}u((i=i.apply(e,t||[])).next())})};Object.defineProperty(t,"__esModule",{value:!0});const s=r(3),n=r(0);t.GLTF_COMPONENT_TYPE_ARRAYS={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},t.GLTF_ELEMENTS_PER_TYPE={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16};t.GltfAsset=class{constructor(e,t,r,i=new n.LoadingManager){this.gltf=e,this.glbData=r,this.bufferData=new o(this,t,i),this.imageData=new a(this,t,i)}bufferViewData(e){return i(this,void 0,void 0,function*(){if(!this.gltf.bufferViews)throw new Error("No buffer views found.");const t=this.gltf.bufferViews[e],r=yield this.bufferData.get(t.buffer),i=t.byteLength||0,s=t.byteOffset||0,n=r.buffer,o=r.byteOffset;return new Uint8Array(n,o+s,i)})}accessorData(e){return i(this,void 0,void 0,function*(){if(!this.gltf.accessors)throw new Error("No accessors views found.");const r=this.gltf.accessors[e],i=t.GLTF_ELEMENTS_PER_TYPE[r.type];let s;if(void 0!==r.bufferView)s=yield this.bufferViewData(r.bufferView);else{const e=t.GLTF_COMPONENT_TYPE_ARRAYS[r.componentType].BYTES_PER_ELEMENT*i*r.count;s=new Uint8Array(e)}if(r.sparse){const{count:e,indices:n,values:o}=r.sparse;let a=t.GLTF_COMPONENT_TYPE_ARRAYS[n.componentType],u=yield this.bufferViewData(n.bufferView);const f=new a(u.buffer,u.byteOffset+(n.byteOffset||0),e);a=t.GLTF_COMPONENT_TYPE_ARRAYS[r.componentType],u=yield this.bufferViewData(o.bufferView);const c=new a((yield this.bufferViewData(o.bufferView)).buffer,u.byteOffset+(o.byteOffset||0),e*i);r.bufferView&&(s=new Uint8Array(s));const h=new t.GLTF_COMPONENT_TYPE_ARRAYS[r.componentType](s.buffer);for(let t=0;t<e;t++)for(let e=0;e<i;e++)h[i*f[t]+e]=c[i*t+e]}return s})}preFetchAll(){return i(this,void 0,void 0,function*(){return Promise.all([this.bufferData.preFetchAll(),this.imageData.preFetchAll()])})}};class o{constructor(e,t,r){this.bufferCache=[],this.asset=e,this.baseUri=t,this.manager=r,this.loader=new s.FileLoader(r),this.loader.responseType="arraybuffer"}get(e){return i(this,void 0,void 0,function*(){if(void 0!==this.bufferCache[e])return this.bufferCache[e];const t=this.asset.gltf;if(!t.buffers)throw new Error("No buffers found.");const r=t.buffers[e];if(void 0===r.uri){if(0!==e)throw new Error("GLB container is required to be the first buffer");if(void 0===this.asset.glbData)throw new Error("invalid gltf: buffer has no uri nor is there a GLB buffer");return this.asset.glbData.binaryChunk}const i=u(r.uri,this.baseUri),s=yield this.loader.load(i),n=new Uint8Array(s);return this.bufferCache[e]=n,n})}preFetchAll(){return i(this,void 0,void 0,function*(){const e=this.asset.gltf.buffers;return e?Promise.all(e.map((e,t)=>this.get(t))):[]})}}t.BufferData=o;class a{constructor(e,t,r){this.crossOrigin="anonymous",this.imageCache=[],this.asset=e,this.baseUri=t,this.manager=r}get(e){return i(this,void 0,void 0,function*(){if(void 0!==this.imageCache[e])return this.imageCache[e];const t=this.asset.gltf;if(!t.images)throw new Error("No images found.");const r=t.images[e];let i,s=!1;if(void 0!==r.bufferView){const e=yield this.asset.bufferViewData(r.bufferView);s=!0;const t=new Blob([e],{type:r.mimeType});i=URL.createObjectURL(t)}else{if(void 0===r.uri)throw new Error("Invalid glTF: image must either have a `uri` or a `bufferView`");i=this.manager.resolveURL(u(r.uri,this.baseUri))}const n=new Image;return n.crossOrigin=this.crossOrigin,new Promise((t,r)=>{n.onerror=(()=>{r(`Failed to load ${i}`),this.manager.itemEnd(i),this.manager.itemError(i)}),n.onload=(()=>{s&&URL.revokeObjectURL(i),this.imageCache[e]=n,t(n),this.manager.itemEnd(i)}),n.src=i,this.manager.itemStart(i)})})}preFetchAll(){return i(this,void 0,void 0,function*(){const e=this.asset.gltf.images;return e?Promise.all(e.map((e,t)=>this.get(t))):[]})}}function u(e,t){return"string"!=typeof e||""===e?"":/^(https?:)?\/\//i.test(e)?e:/^data:.*,.*$/i.test(e)?e:/^blob:.*$/i.test(e)?e:t+e}t.ImageData=a,t.resolveURL=u},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.LoaderUtils=class{static decodeText(e){if("undefined"!=typeof TextDecoder)return(new TextDecoder).decode(e);let t="";for(const r of e)t+=String.fromCharCode(r);return decodeURIComponent(escape(t))}static extractUrlBase(e){const t=e.split("/");return 1===t.length?"./":(t.pop(),t.join("/")+"/")}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.FileLoader=class{constructor(e){this.runningRequests={},this.manager=e}load(e,t){if(void 0!==this.path&&(e=this.path+e),e=this.manager.resolveURL(e),this.runningRequests[e])return this.runningRequests[e];const r=new Promise((r,i)=>{const s=new XMLHttpRequest;s.open("GET",e,!0);const n=this;s.onload=function(t){const o=this.response;0===this.status?(console.warn("FileLoader: HTTP Status 0 received."),r(o),n.manager.itemEnd(e)):200===this.status?(r(o),n.manager.itemEnd(e)):(i({url:e,status:this.status,statusText:s.statusText}),n.manager.itemEnd(e),n.manager.itemError(e)),delete n.runningRequests[e]},s.onprogress=(e=>{t&&t(e)}),s.onerror=function(t){i({url:e,status:this.status,statusText:s.statusText}),n.manager.itemEnd(e),n.manager.itemError(e),delete n.runningRequests[e]},this.responseType&&(s.responseType=this.responseType),this.withCredentials&&(s.withCredentials=this.withCredentials),this.mimeType&&s.overrideMimeType&&s.overrideMimeType(void 0!==this.mimeType?this.mimeType:"text/plain");for(const e in this.requestHeaders)s.setRequestHeader(e,this.requestHeaders[e]);s.send(null),this.manager.itemStart(e)});return this.runningRequests[e]=r,r}setRequestHeader(e,t){return this.requestHeaders[e]=t,this}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0})},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=r(2);t.BINARY_HEADER_MAGIC="glTF";const s=12,n={JSON:1313821514,BIN:5130562};t.GLTFBinaryData=class{constructor(e){const r=new DataView(e,0,s),o=i.LoaderUtils.decodeText(new Uint8Array(e,0,4)),a=r.getUint32(4,!0);if(r.getUint32(8,!0),o!==t.BINARY_HEADER_MAGIC)throw new Error("Unsupported glTF-Binary header.");if(a<2)throw new Error("Unsupported legacy binary file detected.");const u=new DataView(e,s);let f=0;for(;f<u.byteLength;){const t=u.getUint32(f,!0);f+=4;const r=u.getUint32(f,!0);if(f+=4,r===n.JSON){const r=new Uint8Array(e,s+f,t);this.json=i.LoaderUtils.decodeText(r)}else if(r===n.BIN){const r=s+f;this.binaryChunk=new Uint8Array(e,r,t)}f+=t}if(null===this.json)throw new Error("glTF-Binary: JSON content not found.")}}},function(e,t,r){"use strict";var i=this&&this.__awaiter||function(e,t,r,i){return new(r||(r=Promise))(function(s,n){function o(e){try{u(i.next(e))}catch(e){n(e)}}function a(e){try{u(i.throw(e))}catch(e){n(e)}}function u(e){e.done?s(e.value):new r(function(t){t(e.value)}).then(o,a)}u((i=i.apply(e,t||[])).next())})};function s(e){for(var r in e)t.hasOwnProperty(r)||(t[r]=e[r])}Object.defineProperty(t,"__esModule",{value:!0});const n=r(3),o=r(5),a=r(1),u=r(2),f=r(0),c=r(4);t.gltf=c,s(r(1)),s(r(0));t.GltfLoader=class{constructor(e){this.manager=e||new f.LoadingManager}load(e,t){return i(this,void 0,void 0,function*(){const r=u.LoaderUtils.extractUrlBase(e),i=new n.FileLoader(this.manager);i.responseType="arraybuffer";const s=yield i.load(e,t);return yield this.parse(s,r)})}loadFromFiles(e){return i(this,void 0,void 0,function*(){let t,r;for(const[i,s]of e)s.name.match(/\.(gltf|glb)$/)&&(t=s,r=i.replace(s.name,""));if(!t)throw new Error("No .gltf or .glb asset found.");const i="string"==typeof t?t:URL.createObjectURL(t),s=u.LoaderUtils.extractUrlBase(i),n=[];this.manager.urlModifier=(t=>{const i=r+t.replace(s,"").replace(/^(\.?\/)/,"");if(e.has(i)){const t=e.get(i),r=URL.createObjectURL(t);return n.push(r),r}return t});const o=yield this.load(i);return yield o.preFetchAll(),URL.revokeObjectURL(i),n.forEach(URL.revokeObjectURL),o})}parse(e,t){return i(this,void 0,void 0,function*(){let r,i=void 0;r="string"==typeof e?e:u.LoaderUtils.decodeText(new Uint8Array(e,0,4))===o.BINARY_HEADER_MAGIC?(i=new o.GLTFBinaryData(e)).json:u.LoaderUtils.decodeText(new Uint8Array(e));const s=JSON.parse(r);if(void 0===s.asset||s.asset.version[0]<2)throw new Error("Unsupported asset. glTF versions >=2.0 are supported.");return new a.GltfAsset(s,t,i,this.manager)})}}},function(e,t,r){e.exports=r(6)}]);
//# sourceMappingURL=gltf-loader.js.map

/***/ }),

/***/ "./demos/cameras.ts":
/*!**************************!*\
  !*** ./demos/cameras.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ArcBall": () => (/* binding */ ArcBall),
/* harmony export */   "Null": () => (/* binding */ Null),
/* harmony export */   "Static": () => (/* binding */ Static)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gl-matrix */ "./node_modules/gl-matrix/esm/vec3.js");
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! gl-matrix */ "./node_modules/gl-matrix/esm/quat.js");
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! gl-matrix */ "./node_modules/gl-matrix/esm/mat4.js");

// A null camera, doing nothing.
class Null {
    transform(camera, mvt) { }
    update(mvt) { }
    reset() { }
}
// A static camera, which cannot be moved.
class Static {
    constructor(tr = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.fromValues(0, 0, 0), rot = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.fromValues(0, 0, 0)) {
        this.tr = tr;
        this.rot = rot;
    }
    transform(camera, mvt) {
        const q = gl_matrix__WEBPACK_IMPORTED_MODULE_1__.create();
        gl_matrix__WEBPACK_IMPORTED_MODULE_1__.fromEuler(q, this.rot[0], this.rot[1], this.rot[2]);
        const chg = gl_matrix__WEBPACK_IMPORTED_MODULE_2__.create();
        gl_matrix__WEBPACK_IMPORTED_MODULE_2__.fromRotationTranslation(chg, q, this.tr);
        gl_matrix__WEBPACK_IMPORTED_MODULE_2__.mul(camera, camera, chg);
    }
    update(mvt) { }
    reset() { }
}
// A camera where the pointer allows to rotate from the current position.
// Inspiration from http://asliceofrendering.com/camera/2019/11/30/ArcballCamera/
class ArcBall {
    constructor(eye, lookAt = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.fromValues(0, 0, 0)) {
        this.lookAt = lookAt;
        this.startEye = eye;
        this.reset();
    }
    reset() {
        this.eye = this.startEye;
        this.up = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.fromValues(0, 1, 0);
    }
    transform(camera, mvt) {
        const [eye, up] = this.currentEye(mvt);
        const view = gl_matrix__WEBPACK_IMPORTED_MODULE_2__.lookAt(gl_matrix__WEBPACK_IMPORTED_MODULE_2__.create(), eye, this.lookAt, up);
        gl_matrix__WEBPACK_IMPORTED_MODULE_2__.mul(camera, camera, view);
    }
    update(mvt) {
        [this.eye, this.up] = this.currentEye(mvt);
    }
    // Return eye & up.
    currentEye(mvt) {
        if (!mvt) {
            return [this.eye, this.up];
        }
        const eye = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.clone(this.eye);
        const up = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.clone(this.up);
        const lookVec = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.sub(gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create(), this.lookAt, this.eye);
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.normalize(lookVec, lookVec);
        const right = gl_matrix__WEBPACK_IMPORTED_MODULE_0__.cross(gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create(), lookVec, up);
        const r = gl_matrix__WEBPACK_IMPORTED_MODULE_2__.create();
        if (mvt.deltaX) {
            const angx = -mvt.deltaX * 2 * Math.PI;
            gl_matrix__WEBPACK_IMPORTED_MODULE_2__.rotate(r, r, angx, up);
        }
        if (mvt.deltaY) {
            const angy = -mvt.deltaY * Math.PI;
            gl_matrix__WEBPACK_IMPORTED_MODULE_2__.rotate(r, r, angy, right);
        }
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.transformMat4(eye, eye, r);
        if (mvt.deltaZoom) {
            gl_matrix__WEBPACK_IMPORTED_MODULE_0__.add(eye, eye, gl_matrix__WEBPACK_IMPORTED_MODULE_0__.scale(gl_matrix__WEBPACK_IMPORTED_MODULE_0__.create(), lookVec, -10 * mvt.deltaZoom));
        }
        // This accumulate rotations on `up`, which likely leads to errors.
        gl_matrix__WEBPACK_IMPORTED_MODULE_0__.transformMat4(up, up, r);
        return [eye, up];
    }
}


/***/ }),

/***/ "./demos/demos/conway.ts":
/*!*******************************!*\
  !*** ./demos/demos/conway.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "demo": () => (/* binding */ demo)
/* harmony export */ });
/* harmony import */ var _src__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src */ "./src/index.ts");
// A basic game of life.

const uniformsDesc = new _src__WEBPACK_IMPORTED_MODULE_0__.StructType({
    computeWidth: { type: _src__WEBPACK_IMPORTED_MODULE_0__.U32, idx: 0 },
    computeHeight: { type: _src__WEBPACK_IMPORTED_MODULE_0__.U32, idx: 1 },
});
const computeTexFormat = "rgba8unorm";
const demo = {
    id: "conway",
    caption: "A Conway game of life.",
    async init(params) {
        const computeWidth = params.renderWidth;
        const computeHeight = params.renderHeight;
        // Creates the various buffers & textures.
        const uniformsBuffer = params.device.createBuffer({
            label: "Compute uniforms buffer",
            size: uniformsDesc.byteSize(),
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        // Textures, used for compute part swapchain.
        const tex1 = params.device.createTexture({
            size: { width: computeWidth, height: computeHeight },
            format: computeTexFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST,
        });
        const texView1 = tex1.createView({
            format: computeTexFormat,
        });
        const tex2 = params.device.createTexture({
            size: { width: computeWidth, height: computeHeight },
            format: computeTexFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING,
        });
        const texView2 = tex2.createView({
            format: computeTexFormat,
        });
        // Need a sampler to pick from the texture and write to the screen.
        const sampler = params.device.createSampler({
            label: "sampler",
            magFilter: "linear",
        });
        // Setup the initial texture1, with some initial data.
        const buffer = new ArrayBuffer(computeWidth * computeHeight * 4);
        const a = new Uint8Array(buffer);
        for (let y = 0; y < computeHeight; y++) {
            for (let x = 0; x < computeWidth; x++) {
                const hasLife = Math.random() > 0.8;
                const v = hasLife ? 255 : 0;
                a[4 * (x + y * computeWidth) + 0] = v;
                a[4 * (x + y * computeWidth) + 1] = v;
                a[4 * (x + y * computeWidth) + 2] = v;
                a[4 * (x + y * computeWidth) + 3] = 255;
            }
        }
        await params.device.queue.writeTexture({ texture: tex1 }, buffer, { bytesPerRow: computeWidth * 4 }, { width: computeWidth, height: computeHeight });
        // Compute pipeline.
        const computePipeline = params.device.createComputePipeline({
            label: "Effect pipeline",
            layout: params.device.createPipelineLayout({
                label: "compute pipeline layouts",
                bindGroupLayouts: [params.device.createBindGroupLayout({
                        label: "compute pipeline main layout",
                        entries: [
                            // Uniforms.
                            {
                                binding: 0,
                                visibility: GPUShaderStage.COMPUTE,
                                buffer: { type: "uniform" },
                            },
                            // Input compute buffer as texture
                            {
                                binding: 1,
                                visibility: GPUShaderStage.COMPUTE,
                                texture: { multisampled: false }
                            },
                            // Output compute buffer as texture
                            {
                                binding: 2,
                                visibility: GPUShaderStage.COMPUTE,
                                storageTexture: {
                                    access: 'write-only',
                                    format: computeTexFormat,
                                }
                            },
                        ]
                    })],
            }),
            compute: {
                entryPoint: "main",
                module: params.device.createShaderModule(new _src__WEBPACK_IMPORTED_MODULE_0__.WGSLModule({
                    label: "Game of life step",
                    code: _src__WEBPACK_IMPORTED_MODULE_0__.wgsl `
                        @group(0) @binding(0) var<uniform> uniforms : ${uniformsDesc.typename()};
                        @group(0) @binding(1) var srcTexture : texture_2d<f32>;
                        @group(0) @binding(2) var dstTexture : texture_storage_2d<${computeTexFormat}, write>;

                        fn isOn(x: i32, y: i32) -> i32 {
                            let v = textureLoad(srcTexture, vec2<i32>(x, y), 0);
                            if (v.r < 0.5) { return 0;}
                            return 1;
                        }

                        @stage(compute) @workgroup_size(8, 8)
                        fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
                            // Guard against out-of-bounds work group sizes
                            if (global_id.x >= uniforms.computeWidth || global_id.y >= uniforms.computeHeight) {
                                return;
                            }

                            let x = i32(global_id.x);
                            let y = i32(global_id.y);
                            let current = isOn(x, y);
                            let neighbors =
                                  isOn(x - 1, y - 1)
                                + isOn(x, y - 1)
                                + isOn(x + 1, y - 1)
                                + isOn(x - 1, y)
                                + isOn(x + 1, y)
                                + isOn(x - 1, y + 1)
                                + isOn(x, y + 1)
                                + isOn(x + 1, y + 1);

                            var s = 0.0;
                            if (current != 0 && (neighbors == 2 || neighbors == 3)) {
                                s = 1.0;
                            }
                            if (current == 0 && neighbors == 3) {
                                s = 1.0;
                            }
                            textureStore(dstTexture, vec2<i32>(x, y), vec4<f32>(s, s, s, 1.0));
                        }

                    `,
                }).toDesc()),
            }
        });
        // Create 2 bind group for the compute pipeline, depending on what is
        // the current src & dst texture.
        const computeBindGroup1 = params.device.createBindGroup({
            layout: computePipeline.getBindGroupLayout(0),
            entries: [{
                    binding: 0,
                    resource: { buffer: uniformsBuffer }
                }, {
                    binding: 1,
                    resource: texView1,
                }, {
                    binding: 2,
                    resource: texView2,
                }]
        });
        const computeBindGroup2 = params.device.createBindGroup({
            layout: computePipeline.getBindGroupLayout(0),
            entries: [{
                    binding: 0,
                    resource: { buffer: uniformsBuffer }
                }, {
                    binding: 1,
                    resource: texView2,
                }, {
                    binding: 2,
                    resource: texView1,
                }]
        });
        // Create rendering pipeline.
        const renderPipeline = params.device.createRenderPipeline({
            layout: params.device.createPipelineLayout({
                bindGroupLayouts: [
                    params.device.createBindGroupLayout({
                        entries: [
                            // Current compute texture updated by the compute shader.
                            {
                                binding: 0,
                                visibility: GPUShaderStage.FRAGMENT,
                                texture: { multisampled: false },
                            },
                            // Sampler for  the texture.
                            {
                                binding: 1,
                                visibility: GPUShaderStage.FRAGMENT,
                                sampler: { type: "filtering" },
                            },
                        ]
                    }),
                ]
            }),
            vertex: {
                entryPoint: "main",
                module: params.device.createShaderModule(new _src__WEBPACK_IMPORTED_MODULE_0__.WGSLModule({
                    label: "full screen vertices",
                    code: _src__WEBPACK_IMPORTED_MODULE_0__.wgsl `
                        struct VSOut {
                            @builtin(position) pos: vec4<f32>,
                            @location(0) coord: vec2<f32>,
                        };
                        @stage(vertex)
                        fn main(@builtin(vertex_index) idx : u32) -> VSOut {
                            var data = array<vec2<f32>, 6>(
                                vec2<f32>(-1.0, -1.0),
                                vec2<f32>(1.0, -1.0),
                                vec2<f32>(1.0, 1.0),

                                vec2<f32>(-1.0, -1.0),
                                vec2<f32>(-1.0, 1.0),
                                vec2<f32>(1.0, 1.0),
                            );

                            let pos = data[idx];

                            var out : VSOut;
                            out.pos = vec4<f32>(pos, 0.0, 1.0);
                            out.coord.x = (pos.x + 1.0) / 2.0;
                            out.coord.y = (1.0 - pos.y) / 2.0;

                            return out;
                        }
                    `,
                }).toDesc()),
            },
            fragment: {
                entryPoint: 'main',
                module: params.device.createShaderModule(new _src__WEBPACK_IMPORTED_MODULE_0__.WGSLModule({
                    label: "simple copy from compute",
                    code: _src__WEBPACK_IMPORTED_MODULE_0__.wgsl `
                        struct VSOut {
                            @builtin(position) pos: vec4<f32>,
                            @location(0) coord: vec2<f32>,
                        };

                        @group(0) @binding(0) var computeTexture : texture_2d<f32>;
                        @group(0) @binding(1) var dstSampler : sampler;

                        @stage(fragment)
                        fn main(inp: VSOut) -> @location(0) vec4<f32> {
                            return textureSample(computeTexture, dstSampler, inp.coord);
                        }
                    `,
                }).toDesc()),
                targets: [{
                        format: params.renderFormat,
                    }],
            },
            primitive: {
                topology: 'triangle-list',
            },
        });
        const renderBindGroup1 = params.device.createBindGroup({
            layout: renderPipeline.getBindGroupLayout(0),
            entries: [{
                    binding: 0,
                    resource: texView2,
                }, {
                    binding: 1,
                    resource: sampler,
                }]
        });
        const renderBindGroup2 = params.device.createBindGroup({
            layout: renderPipeline.getBindGroupLayout(0),
            entries: [{
                    binding: 0,
                    resource: texView1,
                }, {
                    binding: 1,
                    resource: sampler,
                }]
        });
        let isForward = true;
        // -- Single frame rendering.
        return async (info) => {
            params.device.queue.writeBuffer(uniformsBuffer, 0, uniformsDesc.createArray({
                computeWidth: computeWidth,
                computeHeight: computeHeight,
            }));
            // -- Do compute pass, where the actual effect is.
            const commandEncoder = params.device.createCommandEncoder();
            commandEncoder.pushDebugGroup(`Time ${info.elapsedMs}`);
            commandEncoder.pushDebugGroup('Compute');
            const computeEncoder = commandEncoder.beginComputePass();
            computeEncoder.setPipeline(computePipeline);
            computeEncoder.setBindGroup(0, isForward ? computeBindGroup1 : computeBindGroup2);
            computeEncoder.dispatch(Math.ceil(computeWidth / 8), Math.ceil(computeHeight / 8));
            computeEncoder.end();
            commandEncoder.popDebugGroup();
            // -- And do the frame rendering.
            commandEncoder.pushDebugGroup('Render cube');
            const renderEncoder = commandEncoder.beginRenderPass({
                colorAttachments: [{
                        view: params.context.getCurrentTexture().createView(),
                        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                        loadOp: 'clear',
                        storeOp: 'store',
                    }],
            });
            renderEncoder.setPipeline(renderPipeline);
            renderEncoder.setBindGroup(0, isForward ? renderBindGroup1 : renderBindGroup2);
            // Double-triangle for fullscreen has 6 vertices.
            renderEncoder.draw(6, 1, 0, 0);
            renderEncoder.end();
            commandEncoder.popDebugGroup();
            // Submit all the work.
            commandEncoder.popDebugGroup();
            params.device.queue.submit([commandEncoder.finish()]);
            // Switch for next frame.
            isForward = !isForward;
        };
    }
};


/***/ }),

/***/ "./demos/demos/conway2.ts":
/*!********************************!*\
  !*** ./demos/demos/conway2.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "demo": () => (/* binding */ demo)
/* harmony export */ });
// A conway game of life with indirect rendering.
const demo = {
    id: "conway2",
    caption: "A conway game of life with paletted blurring over time.",
    async init(params) {
        const computeWidth = params.renderWidth;
        const computeHeight = params.renderHeight;
        const computeTexFormat = "rgba8unorm";
        const computeTexBytes = 4; // Bytes per pixel in compute.
        // Swapchain for the cellular automata progression.
        const cells1 = params.device.createTexture({
            size: { width: computeWidth, height: computeHeight },
            format: computeTexFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST,
        });
        const cellsView1 = cells1.createView({
            format: computeTexFormat,
        });
        const cells2 = params.device.createTexture({
            size: { width: computeWidth, height: computeHeight },
            format: computeTexFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING,
        });
        const cellsView2 = cells2.createView({
            format: computeTexFormat,
        });
        // Swap chain for the intermediate compute effect on top of the cellular
        // automata.
        const trail1 = params.device.createTexture({
            size: { width: computeWidth, height: computeHeight },
            format: computeTexFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST,
        });
        const trailView1 = trail1.createView({
            format: computeTexFormat,
        });
        const trail2 = params.device.createTexture({
            size: { width: computeWidth, height: computeHeight },
            format: computeTexFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING,
        });
        const trailView2 = trail2.createView({
            format: computeTexFormat,
        });
        // Setup the initial cellular automata.
        const buffer = new ArrayBuffer(computeWidth * computeHeight * computeTexBytes);
        const a = new Uint8Array(buffer);
        for (let y = 0; y < computeHeight; y++) {
            for (let x = 0; x < computeWidth; x++) {
                const hasLife = Math.random() > 0.8;
                const v = hasLife ? 255 : 0;
                a[computeTexBytes * (x + y * computeWidth) + 0] = v;
                a[computeTexBytes * (x + y * computeWidth) + 1] = v;
                a[computeTexBytes * (x + y * computeWidth) + 2] = v;
                a[computeTexBytes * (x + y * computeWidth) + 3] = 255;
            }
        }
        await params.device.queue.writeTexture({ texture: cells1 }, buffer, { bytesPerRow: computeWidth * computeTexBytes }, { width: computeWidth, height: computeHeight });
        // Compute pipeline.
        const computePipeline = params.device.createComputePipeline({
            layout: params.device.createPipelineLayout({
                bindGroupLayouts: [params.device.createBindGroupLayout({
                        entries: [
                            // Input automata texture
                            {
                                binding: 0,
                                visibility: GPUShaderStage.COMPUTE,
                                texture: { multisampled: false },
                            },
                            // Output automata texture
                            {
                                binding: 1,
                                visibility: GPUShaderStage.COMPUTE,
                                storageTexture: {
                                    access: 'write-only',
                                    format: computeTexFormat,
                                }
                            },
                            // Input trail texture
                            {
                                binding: 2,
                                visibility: GPUShaderStage.COMPUTE,
                                texture: { multisampled: false },
                            },
                            // Output trail texture
                            {
                                binding: 3,
                                visibility: GPUShaderStage.COMPUTE,
                                storageTexture: {
                                    access: 'write-only',
                                    format: computeTexFormat,
                                }
                            },
                        ]
                    })],
            }),
            compute: {
                entryPoint: "main",
                module: params.device.createShaderModule({
                    code: `
                        @group(0) @binding(0) var cellsSrc : texture_2d<f32>;
                        @group(0) @binding(1) var cellsDst : texture_storage_2d<rgba8unorm, write>;
                        @group(0) @binding(2) var trailSrc : texture_2d<f32>;
                        @group(0) @binding(3) var trailDst : texture_storage_2d<rgba8unorm, write>;

                        fn cellAt(x: i32, y: i32) -> i32 {
                            let v = textureLoad(cellsSrc, vec2<i32>(x, y), 0);
                            if (v.r < 0.5) { return 0;}
                            return 1;
                        }

                        fn trailAt(x: i32, y: i32) -> vec4<f32> {
                            return textureLoad(trailSrc, vec2<i32>(x, y), 0);
                        }

                        @stage(compute) @workgroup_size(8, 8)
                        fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
                            let x = i32(global_id.x);
                            let y = i32(global_id.y);
                            let pos = vec2<i32>(x, y);

                            // Prepare trailing.
                            var trail =
                                trailAt(x - 1, y - 1)
                                + trailAt(x, y - 1)
                                + trailAt(x + 1, y - 1)
                                + trailAt(x - 1, y)
                                + trailAt(x + 1, y)
                                + trailAt(x - 1, y + 1)
                                + trailAt(x, y + 1)
                                + trailAt(x + 1, y + 1);
                            trail = trail / 9.5;
                            trail.a = 1.0;

                            // Update cellular automata.
                            let current = cellAt(x, y);
                            let neighbors =
                                cellAt(x - 1, y - 1)
                                + cellAt(x, y - 1)
                                + cellAt(x + 1, y - 1)
                                + cellAt(x - 1, y)
                                + cellAt(x + 1, y)
                                + cellAt(x - 1, y + 1)
                                + cellAt(x, y + 1)
                                + cellAt(x + 1, y + 1);

                            var s = 0.0;
                            if (current != 0 && (neighbors == 2 || neighbors == 3)) {
                                s = 1.0;
                                trail = vec4<f32>(1.0, 1.0, 1.0, 1.0);
                            } else if (current == 0 && neighbors == 3) {
                                s = 1.0;
                                trail = vec4<f32>(1.0, 1.0, 1.0, 1.0);
                            } else {

                            }

                            textureStore(cellsDst, pos, vec4<f32>(s, s, s, 1.0));
                            textureStore(trailDst, pos, trail);
                        }
                    `,
                }),
            }
        });
        // Compute binding group for rendering 1 -> 2
        const computeBindGroup1 = params.device.createBindGroup({
            layout: computePipeline.getBindGroupLayout(0),
            entries: [{
                    binding: 0,
                    resource: cellsView1,
                }, {
                    binding: 1,
                    resource: cellsView2,
                }, {
                    binding: 2,
                    resource: trailView1,
                }, {
                    binding: 3,
                    resource: trailView2,
                }]
        });
        // Compute binding group for rendering 2 -> 1
        const computeBindGroup2 = params.device.createBindGroup({
            layout: computePipeline.getBindGroupLayout(0),
            entries: [{
                    binding: 0,
                    resource: cellsView2,
                }, {
                    binding: 1,
                    resource: cellsView1,
                }, {
                    binding: 2,
                    resource: trailView2,
                }, {
                    binding: 3,
                    resource: trailView1,
                }]
        });
        // Render pipeline.
        const renderPipeline = params.device.createRenderPipeline({
            layout: params.device.createPipelineLayout({
                bindGroupLayouts: [
                    params.device.createBindGroupLayout({
                        entries: [
                            // Texture from compute
                            {
                                binding: 0,
                                visibility: GPUShaderStage.FRAGMENT,
                                texture: { multisampled: false }
                            },
                            // Sampler for the texture
                            {
                                binding: 1,
                                visibility: GPUShaderStage.FRAGMENT,
                                sampler: { type: "filtering" }
                            },
                        ],
                    }),
                ]
            }),
            // Create triangles to cover the screen.
            vertex: {
                entryPoint: "main",
                module: params.device.createShaderModule({
                    label: "full screen vertices",
                    code: `
                        struct VSOut {
                            @builtin(position) pos: vec4<f32>,
                            @location(0) coord: vec2<f32>,
                        };
                        @stage(vertex)
                        fn main(@builtin(vertex_index) idx : u32) -> VSOut {
                            var data = array<vec2<f32>, 6>(
                                vec2<f32>(-1.0, -1.0),
                                vec2<f32>(1.0, -1.0),
                                vec2<f32>(1.0, 1.0),

                                vec2<f32>(-1.0, -1.0),
                                vec2<f32>(-1.0, 1.0),
                                vec2<f32>(1.0, 1.0),
                            );

                            let pos = data[idx];

                            var out : VSOut;
                            out.pos = vec4<f32>(pos, 0.0, 1.0);
                            out.coord.x = (pos.x + 1.0) / 2.0;
                            out.coord.y = (1.0 - pos.y) / 2.0;

                            return out;
                        }
                    `,
                }),
            },
            primitive: {
                topology: 'triangle-list',
            },
            // Just write some color on each pixel.
            fragment: {
                entryPoint: 'main',
                module: params.device.createShaderModule({
                    code: `
                        @group(0) @binding(0) var tex : texture_2d<f32>;
                        @group(0) @binding(1) var smplr : sampler;

                        fn palette(v: f32) -> vec4<f32> {
                            let key = v * 8.0;
                            let c = (v * 256.0) % 32.0;
                            if (key < 1.0) { return vec4<f32>(0.0, 0.0, c * 2.0 / 256.0, 1.0); }
                            if (key < 2.0) { return vec4<f32>(c * 8.0 / 256.0, 0.0, (64.0 - c * 2.0) / 256.0, 1.0); }
                            if (key < 3.0) { return vec4<f32>(1.0, c * 8.0 / 256.0, 0.0, 1.0); }
                            if (key < 4.0) { return vec4<f32>(1.0, 1.0, c * 4.0 / 256.0, 1.0); }
                            if (key < 5.0) { return vec4<f32>(1.0, 1.0, (64.0 + c * 4.0) / 256.0, 1.0); }
                            if (key < 6.0) { return vec4<f32>(1.0, 1.0, (128.0 + c * 4.0) / 256.0, 1.0); }
                            if (key < 7.0) { return vec4<f32>(1.0, 1.0, (192.0 + c * 4.0) / 256.0, 1.0); }
                            return vec4<f32>(1.0, 1.0, (224.0 + c * 4.0) / 256.0, 1.0);
                        }

                        @stage(fragment)
                        fn main(@location(0) coord: vec2<f32>) -> @location(0) vec4<f32> {
                            return palette(textureSample(tex, smplr, coord).r);
                        }
                    `,
                }),
                targets: [{
                        format: params.renderFormat,
                    }],
            },
        });
        const sampler = params.device.createSampler({
            label: "sampler",
            magFilter: "linear",
        });
        // When rendering 1 -> 2
        const renderBindGroup1 = params.device.createBindGroup({
            layout: renderPipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: trailView2,
                }, {
                    binding: 1,
                    resource: sampler,
                },
            ],
        });
        // When rendering 2 -> 1
        const renderBindGroup2 = params.device.createBindGroup({
            layout: renderPipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: trailView1,
                }, {
                    binding: 1,
                    resource: sampler,
                },
            ],
        });
        // Single frame rendering.
        let isForward = true;
        return async (info) => {
            const commandEncoder = params.device.createCommandEncoder();
            // Frame compute
            const computeEncoder = commandEncoder.beginComputePass();
            computeEncoder.setPipeline(computePipeline);
            computeEncoder.setBindGroup(0, isForward ? computeBindGroup1 : computeBindGroup2);
            computeEncoder.dispatch(Math.ceil(computeWidth / 8), Math.ceil(computeHeight / 8));
            computeEncoder.end();
            // Frame rendering.
            const renderEncoder = commandEncoder.beginRenderPass({
                colorAttachments: [{
                        view: params.context.getCurrentTexture().createView(),
                        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                        loadOp: 'clear',
                        storeOp: 'store',
                    }],
            });
            renderEncoder.setPipeline(renderPipeline);
            renderEncoder.setBindGroup(0, isForward ? renderBindGroup1 : renderBindGroup2);
            renderEncoder.draw(6, 1, 0, 0);
            renderEncoder.end();
            params.device.queue.submit([commandEncoder.finish()]);
            isForward = !isForward;
        };
    }
};


/***/ }),

/***/ "./demos/demos/cube.ts":
/*!*****************************!*\
  !*** ./demos/demos/cube.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "demo": () => (/* binding */ demo)
/* harmony export */ });
// A rotating cube, with rotation on GPU.
//
// Rotation, translation and project are calculated within a compute shader. For
// a single matrix like that, it is probably over the top - though it shows it
// can be done purely on the GPU, while javascript just need to update the time.
//
// Lots of inspiration from
// https://github.com/austinEng/webgpu-samples/blob/main/src/sample/rotatingCube/main.ts
const demo = {
    id: "cube",
    caption: "The good old rotating cube.",
    async init(params) {
        // -- Compute pipeline. It takes care of calculating the cube vertices
        // transformion (and projection) matrix.
        const computePipeline = params.device.createComputePipeline({
            label: "Compute pipeline for projection matrix",
            layout: params.device.createPipelineLayout({
                label: "compute pipeline layouts",
                bindGroupLayouts: [params.device.createBindGroupLayout({
                        label: "compute pipeline main layout",
                        entries: [
                            // Input buffer, which will be coming from JS.
                            {
                                binding: 0,
                                visibility: GPUShaderStage.COMPUTE,
                                buffer: { type: "uniform" },
                            },
                            // Output buffer, to feed the vertex shader.
                            {
                                binding: 1,
                                visibility: GPUShaderStage.COMPUTE,
                                buffer: { type: "storage" },
                            },
                        ]
                    })],
            }),
            compute: {
                entryPoint: "main",
                module: params.device.createShaderModule({
                    label: "Rendering matrix compute",
                    // Project & rotations from https://github.com/toji/gl-matrix
                    code: `
                        struct Uniforms {
                            elapsedMs: f32,
                            renderWidth: f32,
                            renderHeight: f32,
                        };
                        @group(0) @binding(0) var<uniform> uniforms : Uniforms;

                        struct Output {
                            // ModelViewProjection
                            mvp: mat4x4<f32>,
                        };
                        @group(0) @binding(1) var<storage, write> outp : Output;

                        fn perspective() -> mat4x4<f32> {
                            // Hard coded projection parameters - for more flexibility,
                            // we could imagine getting them from the uniforms.
                            let fovy = 2.0 * 3.14159 / 5.0; // Vertical field of view (rads)
                            let near = 1.0;
                            let far = 100.0;

                            let f = 1.0 / tan(fovy / 2.0);
                            let nf = 1.0 / (near - far);

                            let aspect = uniforms.renderWidth / uniforms.renderHeight;

                            return mat4x4<f32>(
                                f / aspect, 0.0, 0.0, 0.0,
                                0.0, f, 0.0, 0.0,
                                0.0, 0.0, (far + near) * nf, -1.0,
                                0.0, 0.0, 2.0 * far * near * nf, 0.0,
                            );
                        }

                        fn translate(tr : vec3<f32>) -> mat4x4<f32> {
                            return mat4x4<f32>(
                                1.0, 0.0, 0.0, 0.0,
                                0.0, 1.0, 0.0, 0.0,
                                0.0, 0.0, 1.0, 0.0,
                                tr.x, tr.y, tr.z, 1.0,
                            );
                        }

                        fn rotateX(rad: f32) -> mat4x4<f32> {
                            let s = sin(rad);
                            let c = cos(rad);
                            return mat4x4<f32>(
                                1.0, 0.0, 0.0, 0.0,
                                0.0, c, s, 0.0,
                                0.0, -s, c, 0.0,
                                0.0, 0.0, 0.0, 1.0,
                            );
                        }

                        fn rotateY(rad: f32) -> mat4x4<f32> {
                            let s = sin(rad);
                            let c = cos(rad);
                            return mat4x4<f32>(
                                c, 0.0, -s, 0.0,
                                0.0, 1.0, 0.0, 0.0,
                                s, 0.0, c, 0.0,
                                0.0, 0.0, 0.0, 1.0,
                            );
                        }

                        fn rotateZ(rad: f32) -> mat4x4<f32> {
                            let s = sin(rad);
                            let c = cos(rad);
                            return mat4x4<f32>(
                                c, s, 0.0, 0.0,
                                -s, c, 0.0, 0.0,
                                0.0, 0.0, 1.0, 0.0,
                                0.0, 0.0, 0.0, 1.0,
                            );
                        }

                        @stage(compute) @workgroup_size(1)
                        fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
                            let TAU = 6.283185;
                            let c = (uniforms.elapsedMs / 1000.0) % TAU;
                            let r = vec3<f32>(c, c, c);
                            outp.mvp = perspective() * translate(vec3<f32>(0.0, 0.0, -4.0)) * rotateZ(r.z) * rotateY(r.y) * rotateX(r.x);
                        }
                    `,
                }),
            }
        });
        const uniformsBufferSize = 3 * 4;
        const uniformsBuffer = params.device.createBuffer({
            label: "Compute uniforms buffer",
            size: uniformsBufferSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        const computeResult = params.device.createBuffer({
            label: "Compute output for vertex shaders",
            // Size for one mat4x4<f32>.
            size: 4 * 4 * Float32Array.BYTES_PER_ELEMENT,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.VERTEX,
        });
        const computeBindGroup = params.device.createBindGroup({
            label: "Bind group for the projection matrix compute",
            layout: computePipeline.getBindGroupLayout(0),
            entries: [{
                    binding: 0,
                    resource: { buffer: uniformsBuffer }
                }, {
                    binding: 1,
                    resource: { buffer: computeResult }
                }]
        });
        // -- Render pipeline.
        // It takes the projection matrix from the compute output
        // and create a cube from hard coded vertex coordinates.
        const renderPipeline = params.device.createRenderPipeline({
            label: "Cube rendering pipeline",
            layout: params.device.createPipelineLayout({
                label: "render pipeline layouts",
                bindGroupLayouts: [
                    params.device.createBindGroupLayout({
                        label: "render pipeline layout for compute data",
                        entries: [
                            // Matrix info coming from compute shader.
                            {
                                binding: 0,
                                visibility: GPUShaderStage.VERTEX,
                                buffer: {
                                    type: 'read-only-storage',
                                },
                            },
                        ],
                    }),
                ]
            }),
            vertex: {
                entryPoint: 'main',
                module: params.device.createShaderModule({
                    label: "cube vertex shader",
                    // https://stackoverflow.com/questions/28375338/cube-using-single-gl-triangle-strip
                    code: `
                        struct Output {
                            // ModelViewProjection
                            mvp: mat4x4<f32>,
                        };
                        @group(0) @binding(0) var<storage> outp : Output;

                        struct Out {
                            @builtin(position) pos: vec4<f32>,
                            @location(0) coord: vec3<f32>,
                        };

                        // The cube mesh, as triangle strip.
                        let mesh = array<vec3<f32>, 14>(
                            vec3<f32>(1.f, 1.f, 1.f),     // Front-top-left
                            vec3<f32>(-1.f, 1.f, 1.f),      // Front-top-right
                            vec3<f32>(1.f, -1.f, 1.f),    // Front-bottom-left
                            vec3<f32>(-1.f, -1.f, 1.f),     // Front-bottom-right
                            vec3<f32>(-1.f, -1.f, -1.f),    // Back-bottom-right
                            vec3<f32>(-1.f, 1.f, 1.f),      // Front-top-right
                            vec3<f32>(-1.f, 1.f, -1.f),     // Back-top-right
                            vec3<f32>(1.f, 1.f, 1.f),     // Front-top-left
                            vec3<f32>(1.f, 1.f, -1.f),    // Back-top-left
                            vec3<f32>(1.f, -1.f, 1.f),    // Front-bottom-left
                            vec3<f32>(1.f, -1.f, -1.f),   // Back-bottom-left
                            vec3<f32>(-1.f, -1.f, -1.f),    // Back-bottom-right
                            vec3<f32>(1.f, 1.f, -1.f),    // Back-top-left
                            vec3<f32>(-1.f, 1.f, -1.f),      // Back-top-right
                        );

                        @stage(vertex)
                        fn main(@builtin(vertex_index) idx : u32) -> Out {
                            let pos = mesh[idx];
                            var out : Out;
                            out.pos = outp.mvp * vec4<f32>(pos + vec3<f32>(0.0, 0.0, 0.0), 1.0);
                            out.coord.x = (pos.x + 1.0) / 2.0;
                            out.coord.y = (pos.y + 1.0) / 2.0;
                            out.coord.z = (pos.z + 1.0) / 2.0;
                            return out;
                        }
                    `,
                }),
            },
            primitive: {
                topology: 'triangle-strip',
                cullMode: 'back',
            },
            depthStencil: {
                depthWriteEnabled: true,
                depthCompare: 'less',
                format: 'depth24plus',
            },
            fragment: {
                entryPoint: 'main',
                module: params.device.createShaderModule({
                    label: "trivial fragment shader",
                    code: `
                        @stage(fragment)
                        fn main(@location(0) coord: vec3<f32>) -> @location(0) vec4<f32> {
                            return vec4<f32>(coord.x, coord.y, coord.z, 1.0);
                        }
                    `,
                }),
                targets: [{
                        format: params.renderFormat,
                    }],
            },
        });
        const renderBindGroup = params.device.createBindGroup({
            label: "render pipeline bindgroup",
            layout: renderPipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: computeResult,
                    }
                },
            ]
        });
        const depthTextureView = params.device.createTexture({
            label: "depth view",
            size: [params.renderWidth, params.renderHeight],
            format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        }).createView();
        // -- Single frame rendering.
        return async (info) => {
            // Fill up the uniforms to feed the compute shaders.
            // Rotation of the cube is just a function of current time,
            // calculated in the compute shader.
            const data = new DataView(new ArrayBuffer(uniformsBufferSize));
            data.setFloat32(0, info.elapsedMs, true);
            data.setFloat32(4, params.renderWidth, true);
            data.setFloat32(8, params.renderHeight, true);
            params.device.queue.writeBuffer(uniformsBuffer, 0, data);
            // -- Do compute pass, to create projection matrices.
            const commandEncoder = params.device.createCommandEncoder();
            commandEncoder.pushDebugGroup('Time ${info.elapsedMs}');
            commandEncoder.pushDebugGroup('Compute projection');
            const computeEncoder = commandEncoder.beginComputePass();
            computeEncoder.setPipeline(computePipeline);
            computeEncoder.setBindGroup(0, computeBindGroup);
            // The compute has only a single matrix to compute. More typical compute shaders
            // would dispatch on NxM elements.
            computeEncoder.dispatch(1);
            computeEncoder.end();
            commandEncoder.popDebugGroup();
            // -- And do the frame rendering.
            commandEncoder.pushDebugGroup('Render cube');
            const renderEncoder = commandEncoder.beginRenderPass({
                colorAttachments: [{
                        view: params.context.getCurrentTexture().createView(),
                        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                        loadOp: 'clear',
                        storeOp: 'store',
                    }],
                depthStencilAttachment: {
                    view: depthTextureView,
                    depthClearValue: 1.0,
                    depthLoadOp: 'clear',
                    depthStoreOp: 'store',
                },
            });
            renderEncoder.setPipeline(renderPipeline);
            renderEncoder.setBindGroup(0, renderBindGroup);
            // Cube mesh as a triangle-strip uses 14 vertices.
            renderEncoder.draw(14, 1, 0, 0);
            renderEncoder.end();
            commandEncoder.popDebugGroup();
            // Submit all the work.
            commandEncoder.popDebugGroup();
            params.device.queue.submit([commandEncoder.finish()]);
        };
    }
};


/***/ }),

/***/ "./demos/demos/fade.ts":
/*!*****************************!*\
  !*** ./demos/demos/fade.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "demo": () => (/* binding */ demo)
/* harmony export */ });
/* harmony import */ var _src__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src */ "./src/index.ts");
// A minimal effect which works on a buffer and make it evolve over time.

const uniformsDesc = new _src__WEBPACK_IMPORTED_MODULE_0__.StructType({
    elapsedMs: { type: _src__WEBPACK_IMPORTED_MODULE_0__.F32, idx: 0 },
});
const computeTexFormat = "rgba8unorm";
const demo = {
    id: "fade",
    caption: "Cycling the red component over time.",
    async init(params) {
        const computeWidth = params.renderWidth;
        const computeHeight = params.renderHeight;
        // Creates the various buffers & textures.
        const uniformsBuffer = params.device.createBuffer({
            label: "Compute uniforms buffer",
            size: uniformsDesc.byteSize(),
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        // Textures, used for compute part swapchain.
        const tex1 = params.device.createTexture({
            size: { width: computeWidth, height: computeHeight },
            format: computeTexFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST,
        });
        const texView1 = tex1.createView({
            format: computeTexFormat,
        });
        const tex2 = params.device.createTexture({
            size: { width: computeWidth, height: computeHeight },
            format: computeTexFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING,
        });
        const texView2 = tex2.createView({
            format: computeTexFormat,
        });
        // Need a sampler to pick from the texture and write to the screen.
        const sampler = params.device.createSampler({
            label: "sampler",
            magFilter: "linear",
        });
        // Setup the initial texture1, with some initial data.
        const buffer = new ArrayBuffer(computeWidth * computeHeight * 4);
        const a = new Uint8Array(buffer);
        for (let y = 0; y < computeHeight; y++) {
            for (let x = 0; x < computeWidth; x++) {
                a[4 * (x + y * computeWidth) + 0] = 0;
                a[4 * (x + y * computeWidth) + 1] = Math.floor(x * 256 / computeWidth);
                a[4 * (x + y * computeWidth) + 2] = Math.floor(y * 256 / computeWidth);
                a[4 * (x + y * computeWidth) + 3] = 255;
            }
        }
        await params.device.queue.writeTexture({ texture: tex1 }, buffer, { bytesPerRow: computeWidth * 4 }, { width: computeWidth, height: computeHeight });
        // Compute pipeline.
        const computePipeline = params.device.createComputePipeline({
            label: "Effect pipeline",
            layout: params.device.createPipelineLayout({
                label: "compute pipeline layouts",
                bindGroupLayouts: [params.device.createBindGroupLayout({
                        label: "compute pipeline main layout",
                        entries: [
                            // Uniforms.
                            {
                                binding: 0,
                                visibility: GPUShaderStage.COMPUTE,
                                buffer: { type: "uniform" },
                            },
                            // Input compute buffer as texture
                            {
                                binding: 1,
                                visibility: GPUShaderStage.COMPUTE,
                                texture: { multisampled: false }
                            },
                            // Output compute buffer as texture
                            {
                                binding: 2,
                                visibility: GPUShaderStage.COMPUTE,
                                storageTexture: {
                                    access: 'write-only',
                                    format: computeTexFormat,
                                }
                            },
                        ]
                    })],
            }),
            compute: {
                entryPoint: "main",
                module: params.device.createShaderModule(new _src__WEBPACK_IMPORTED_MODULE_0__.WGSLModule({
                    label: "Changing the red channel from previous buffer",
                    code: _src__WEBPACK_IMPORTED_MODULE_0__.wgsl `
                        @group(0) @binding(0) var<uniform> uniforms : ${uniformsDesc.typename()};
                        @group(0) @binding(1) var srcTexture : texture_2d<f32>;
                        @group(0) @binding(2) var dstTexture : texture_storage_2d<${computeTexFormat}, write>;

                        @stage(compute) @workgroup_size(8, 8)
                        fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
                            let xy = vec2<i32>(global_id.xy);
                            var v = textureLoad(srcTexture, xy, 0);
                            v.r = (sin(modf(uniforms.elapsedMs / 1000.0 / 3.0).fract * 2.0 * 3.1415) + 1.0) / 2.0;
                            textureStore(dstTexture, xy, v);
                        }
                    `,
                }).toDesc()),
            }
        });
        // Create 2 bind group for the compute pipeline, depending on what is
        // the current src & dst texture.
        const computeBindGroup1 = params.device.createBindGroup({
            layout: computePipeline.getBindGroupLayout(0),
            entries: [{
                    binding: 0,
                    resource: { buffer: uniformsBuffer }
                }, {
                    binding: 1,
                    resource: texView1,
                }, {
                    binding: 2,
                    resource: texView2,
                }]
        });
        const computeBindGroup2 = params.device.createBindGroup({
            layout: computePipeline.getBindGroupLayout(0),
            entries: [{
                    binding: 0,
                    resource: { buffer: uniformsBuffer }
                }, {
                    binding: 1,
                    resource: texView2,
                }, {
                    binding: 2,
                    resource: texView1,
                }]
        });
        // Create rendering pipeline.
        const renderPipeline = params.device.createRenderPipeline({
            layout: params.device.createPipelineLayout({
                bindGroupLayouts: [
                    params.device.createBindGroupLayout({
                        entries: [
                            // Current compute texture updated by the compute shader.
                            {
                                binding: 0,
                                visibility: GPUShaderStage.FRAGMENT,
                                texture: { multisampled: false },
                            },
                            // Sampler for  the texture.
                            {
                                binding: 1,
                                visibility: GPUShaderStage.FRAGMENT,
                                sampler: { type: "filtering" },
                            },
                        ]
                    }),
                ]
            }),
            vertex: {
                entryPoint: "main",
                module: params.device.createShaderModule(new _src__WEBPACK_IMPORTED_MODULE_0__.WGSLModule({
                    label: "full screen vertices",
                    code: _src__WEBPACK_IMPORTED_MODULE_0__.wgsl `
                        struct VSOut {
                            @builtin(position) pos: vec4<f32>,
                            @location(0) coord: vec2<f32>,
                        };
                        @stage(vertex)
                        fn main(@builtin(vertex_index) idx : u32) -> VSOut {
                            var data = array<vec2<f32>, 6>(
                                vec2<f32>(-1.0, -1.0),
                                vec2<f32>(1.0, -1.0),
                                vec2<f32>(1.0, 1.0),

                                vec2<f32>(-1.0, -1.0),
                                vec2<f32>(-1.0, 1.0),
                                vec2<f32>(1.0, 1.0),
                            );

                            let pos = data[idx];

                            var out : VSOut;
                            out.pos = vec4<f32>(pos, 0.0, 1.0);
                            out.coord.x = (pos.x + 1.0) / 2.0;
                            out.coord.y = (1.0 - pos.y) / 2.0;

                            return out;
                        }
                    `,
                }).toDesc()),
            },
            fragment: {
                entryPoint: 'main',
                module: params.device.createShaderModule(new _src__WEBPACK_IMPORTED_MODULE_0__.WGSLModule({
                    label: "simple copy from compute",
                    code: _src__WEBPACK_IMPORTED_MODULE_0__.wgsl `
                        struct VSOut {
                            @builtin(position) pos: vec4<f32>,
                            @location(0) coord: vec2<f32>,
                        };

                        @group(0) @binding(0) var computeTexture : texture_2d<f32>;
                        @group(0) @binding(1) var dstSampler : sampler;

                        @stage(fragment)
                        fn main(inp: VSOut) -> @location(0) vec4<f32> {
                            return textureSample(computeTexture, dstSampler, inp.coord);
                        }
                    `,
                }).toDesc()),
                targets: [{
                        format: params.renderFormat,
                    }],
            },
            primitive: {
                topology: 'triangle-list',
            },
        });
        const renderBindGroup1 = params.device.createBindGroup({
            layout: renderPipeline.getBindGroupLayout(0),
            entries: [{
                    binding: 0,
                    resource: texView2,
                }, {
                    binding: 1,
                    resource: sampler,
                }]
        });
        const renderBindGroup2 = params.device.createBindGroup({
            layout: renderPipeline.getBindGroupLayout(0),
            entries: [{
                    binding: 0,
                    resource: texView1,
                }, {
                    binding: 1,
                    resource: sampler,
                }]
        });
        let isForward = true;
        // -- Single frame rendering.
        return async (info) => {
            params.device.queue.writeBuffer(uniformsBuffer, 0, uniformsDesc.createArray({
                elapsedMs: info.elapsedMs,
            }));
            // -- Do compute pass, where the actual effect is.
            const commandEncoder = params.device.createCommandEncoder();
            commandEncoder.pushDebugGroup(`Time ${info.elapsedMs}`);
            commandEncoder.pushDebugGroup('Compute');
            const computeEncoder = commandEncoder.beginComputePass();
            computeEncoder.setPipeline(computePipeline);
            computeEncoder.setBindGroup(0, isForward ? computeBindGroup1 : computeBindGroup2);
            computeEncoder.dispatch(Math.ceil(computeWidth / 8), Math.ceil(computeHeight / 8));
            computeEncoder.end();
            commandEncoder.popDebugGroup();
            // -- And do the frame rendering.
            commandEncoder.pushDebugGroup('Render cube');
            const renderEncoder = commandEncoder.beginRenderPass({
                colorAttachments: [{
                        view: params.context.getCurrentTexture().createView(),
                        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                        loadOp: 'clear',
                        storeOp: 'store',
                    }],
            });
            renderEncoder.setPipeline(renderPipeline);
            renderEncoder.setBindGroup(0, isForward ? renderBindGroup1 : renderBindGroup2);
            // Double-triangle for fullscreen has 6 vertices.
            renderEncoder.draw(6, 1, 0, 0);
            renderEncoder.end();
            commandEncoder.popDebugGroup();
            // Submit all the work.
            commandEncoder.popDebugGroup();
            params.device.queue.submit([commandEncoder.finish()]);
            // Switch for next frame.
            isForward = !isForward;
        };
    }
};


/***/ }),

/***/ "./demos/demos/fire.ts":
/*!*****************************!*\
  !*** ./demos/demos/fire.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "demo": () => (/* binding */ demo)
/* harmony export */ });
/* harmony import */ var _src__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src */ "./src/index.ts");
/* harmony import */ var _shaderlib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shaderlib */ "./demos/shaderlib.ts");
// A classic fire effect.


const uniformsDesc = new _src__WEBPACK_IMPORTED_MODULE_0__.StructType({
    computeWidth: { type: _src__WEBPACK_IMPORTED_MODULE_0__.U32, idx: 0 },
    computeHeight: { type: _src__WEBPACK_IMPORTED_MODULE_0__.U32, idx: 1 },
    rngSeed: { type: _src__WEBPACK_IMPORTED_MODULE_0__.F32, idx: 2 },
});
const computeTexFormat = "rgba8unorm";
const demo = {
    id: "fire",
    caption: "The classic fire effect.",
    async init(params) {
        const computeWidth = 160;
        const computeHeight = 100;
        // Creates the various buffers & textures.
        const uniformsBuffer = params.device.createBuffer({
            label: "Compute uniforms buffer",
            size: uniformsDesc.byteSize(),
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        // Textures, used for compute part swapchain.
        const tex1 = params.device.createTexture({
            size: { width: computeWidth, height: computeHeight },
            format: computeTexFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST,
        });
        const texView1 = tex1.createView({
            format: computeTexFormat,
        });
        const tex2 = params.device.createTexture({
            size: { width: computeWidth, height: computeHeight },
            format: computeTexFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING,
        });
        const texView2 = tex2.createView({
            format: computeTexFormat,
        });
        // Need a sampler to pick from the texture and write to the screen.
        const sampler = params.device.createSampler({
            label: "sampler",
            magFilter: "linear",
        });
        // Compute pipeline.
        const computePipeline = params.device.createComputePipeline({
            label: "Effect pipeline",
            layout: params.device.createPipelineLayout({
                label: "compute pipeline layouts",
                bindGroupLayouts: [params.device.createBindGroupLayout({
                        label: "compute pipeline main layout",
                        entries: [
                            // Uniforms.
                            {
                                binding: 0,
                                visibility: GPUShaderStage.COMPUTE,
                                buffer: { type: "uniform" },
                            },
                            // Input compute buffer as texture
                            {
                                binding: 1,
                                visibility: GPUShaderStage.COMPUTE,
                                texture: { multisampled: false }
                            },
                            // Output compute buffer as texture
                            {
                                binding: 2,
                                visibility: GPUShaderStage.COMPUTE,
                                storageTexture: {
                                    access: 'write-only',
                                    format: computeTexFormat,
                                }
                            },
                        ]
                    })],
            }),
            compute: {
                entryPoint: "main",
                module: params.device.createShaderModule(new _src__WEBPACK_IMPORTED_MODULE_0__.WGSLModule({
                    label: "update fire state",
                    code: _src__WEBPACK_IMPORTED_MODULE_0__.wgsl `
                        @group(0) @binding(0) var<uniform> uniforms : ${uniformsDesc.typename()};
                        @group(0) @binding(1) var srcTexture : texture_2d<f32>;
                        @group(0) @binding(2) var dstTexture : texture_storage_2d<${computeTexFormat}, write>;

                        fn at(x: i32, y: i32) -> vec4<f32> {
                            return textureLoad(srcTexture, vec2<i32>(x, y), 0);
                        }

                        @stage(compute) @workgroup_size(8, 8)
                        fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
                            // Guard against out-of-bounds work group sizes
                            if (global_id.x >= uniforms.computeWidth || global_id.y >= uniforms.computeHeight) {
                                return;
                            }

                            let x = i32(global_id.x);
                            let y = i32(global_id.y);

                            var v = vec4<f32>(0.0, 0.0, 0.0, 1.0);
                            if (y == (i32(uniforms.computeHeight) - 1)) {
                                if (${_shaderlib__WEBPACK_IMPORTED_MODULE_1__.rand.ref("meh")}(uniforms.rngSeed, f32(x)) < 0.2) {
                                    v = vec4<f32>(1.0, 1.0, 1.0, 1.0);
                                } else {
                                    v = vec4<f32>(0.0, 0.0, 0.0, 1.0);
                                }
                            } else {
                                let sum = at(x, y) + at(x - 1, y + 1) + at(x, y + 1) + at(x + 1, y + 1);
                                v = (sum / 4.0) - 0.005;
                            }
                            textureStore(dstTexture, vec2<i32>(x, y), v);
                        }


                    `,
                }).toDesc()),
            }
        });
        // Create 2 bind group for the compute pipeline, depending on what is
        // the current src & dst texture.
        const computeBindGroup1 = params.device.createBindGroup({
            layout: computePipeline.getBindGroupLayout(0),
            entries: [{
                    binding: 0,
                    resource: { buffer: uniformsBuffer }
                }, {
                    binding: 1,
                    resource: texView1,
                }, {
                    binding: 2,
                    resource: texView2,
                }]
        });
        const computeBindGroup2 = params.device.createBindGroup({
            layout: computePipeline.getBindGroupLayout(0),
            entries: [{
                    binding: 0,
                    resource: { buffer: uniformsBuffer }
                }, {
                    binding: 1,
                    resource: texView2,
                }, {
                    binding: 2,
                    resource: texView1,
                }]
        });
        // Create rendering pipeline.
        const renderPipeline = params.device.createRenderPipeline({
            layout: params.device.createPipelineLayout({
                bindGroupLayouts: [
                    params.device.createBindGroupLayout({
                        entries: [
                            // Current compute texture updated by the compute shader.
                            {
                                binding: 0,
                                visibility: GPUShaderStage.FRAGMENT,
                                texture: { multisampled: false },
                            },
                            // Sampler for  the texture.
                            {
                                binding: 1,
                                visibility: GPUShaderStage.FRAGMENT,
                                sampler: { type: "filtering" },
                            },
                        ]
                    }),
                ]
            }),
            vertex: {
                entryPoint: "main",
                module: params.device.createShaderModule(new _src__WEBPACK_IMPORTED_MODULE_0__.WGSLModule({
                    label: "full screen vertices",
                    code: _src__WEBPACK_IMPORTED_MODULE_0__.wgsl `
                        struct VSOut {
                            @builtin(position) pos: vec4<f32>,
                            @location(0) coord: vec2<f32>,
                        };
                        @stage(vertex)
                        fn main(@builtin(vertex_index) idx : u32) -> VSOut {
                            var data = array<vec2<f32>, 6>(
                                vec2<f32>(-1.0, -1.0),
                                vec2<f32>(1.0, -1.0),
                                vec2<f32>(1.0, 1.0),

                                vec2<f32>(-1.0, -1.0),
                                vec2<f32>(-1.0, 1.0),
                                vec2<f32>(1.0, 1.0),
                            );

                            let pos = data[idx];

                            var out : VSOut;
                            out.pos = vec4<f32>(pos, 0.0, 1.0);
                            out.coord.x = (pos.x + 1.0) / 2.0;
                            out.coord.y = (1.0 - pos.y) / 2.0;

                            return out;
                        }
                    `,
                }).toDesc()),
            },
            fragment: {
                entryPoint: 'main',
                module: params.device.createShaderModule(new _src__WEBPACK_IMPORTED_MODULE_0__.WGSLModule({
                    label: "simple copy from compute",
                    code: _src__WEBPACK_IMPORTED_MODULE_0__.wgsl `
                        struct VSOut {
                            @builtin(position) pos: vec4<f32>,
                            @location(0) coord: vec2<f32>,
                        };

                        @group(0) @binding(0) var computeTexture : texture_2d<f32>;
                        @group(0) @binding(1) var dstSampler : sampler;

                        @stage(fragment)
                        fn main(inp: VSOut) -> @location(0) vec4<f32> {
                            let v = textureSample(computeTexture, dstSampler, inp.coord);

                            let key = v.r * 8.0;
                            let c = (v.r * 256.0) % 32.0;
                            if (key < 1.0) { return vec4<f32>(0.0, 0.0, c * 2.0 / 256.0, 1.0); }
                            if (key < 2.0) { return vec4<f32>(c * 8.0 / 256.0, 0.0, (64.0 - c * 2.0) / 256.0, 1.0); }
                            if (key < 3.0) { return vec4<f32>(1.0, c * 8.0 / 256.0, 0.0, 1.0); }
                            if (key < 4.0) { return vec4<f32>(1.0, 1.0, c * 4.0 / 256.0, 1.0); }
                            if (key < 5.0) { return vec4<f32>(1.0, 1.0, (64.0 + c * 4.0) / 256.0, 1.0); }
                            if (key < 6.0) { return vec4<f32>(1.0, 1.0, (128.0 + c * 4.0) / 256.0, 1.0); }
                            if (key < 7.0) { return vec4<f32>(1.0, 1.0, (192.0 + c * 4.0) / 256.0, 1.0); }
                            return vec4<f32>(1.0, 1.0, (224.0 + c * 4.0) / 256.0, 1.0);
                        }
                    `,
                }).toDesc()),
                targets: [{
                        format: params.renderFormat,
                    }],
            },
            primitive: {
                topology: 'triangle-list',
            },
        });
        const renderBindGroup1 = params.device.createBindGroup({
            layout: renderPipeline.getBindGroupLayout(0),
            entries: [{
                    binding: 0,
                    resource: texView2,
                }, {
                    binding: 1,
                    resource: sampler,
                }]
        });
        const renderBindGroup2 = params.device.createBindGroup({
            layout: renderPipeline.getBindGroupLayout(0),
            entries: [{
                    binding: 0,
                    resource: texView1,
                }, {
                    binding: 1,
                    resource: sampler,
                }]
        });
        let isForward = true;
        // -- Single frame rendering.
        return async (info) => {
            params.device.queue.writeBuffer(uniformsBuffer, 0, uniformsDesc.createArray({
                computeWidth: computeWidth,
                computeHeight: computeHeight,
                rngSeed: info.rng,
            }));
            // -- Do compute pass, where the actual effect is.
            const commandEncoder = params.device.createCommandEncoder();
            commandEncoder.pushDebugGroup(`Time ${info.elapsedMs}`);
            commandEncoder.pushDebugGroup('Compute');
            const computeEncoder = commandEncoder.beginComputePass();
            computeEncoder.setPipeline(computePipeline);
            computeEncoder.setBindGroup(0, isForward ? computeBindGroup1 : computeBindGroup2);
            computeEncoder.dispatch(Math.ceil(computeWidth / 8), Math.ceil(computeHeight / 8));
            computeEncoder.end();
            commandEncoder.popDebugGroup();
            // -- And do the frame rendering.
            commandEncoder.pushDebugGroup('Render cube');
            const renderEncoder = commandEncoder.beginRenderPass({
                colorAttachments: [{
                        view: params.context.getCurrentTexture().createView(),
                        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                        loadOp: 'clear',
                        storeOp: 'store',
                    }],
            });
            renderEncoder.setPipeline(renderPipeline);
            renderEncoder.setBindGroup(0, isForward ? renderBindGroup1 : renderBindGroup2);
            // Double-triangle for fullscreen has 6 vertices.
            renderEncoder.draw(6, 1, 0, 0);
            renderEncoder.end();
            commandEncoder.popDebugGroup();
            // Submit all the work.
            commandEncoder.popDebugGroup();
            params.device.queue.submit([commandEncoder.finish()]);
            // Switch for next frame.
            isForward = !isForward;
        };
    }
};


/***/ }),

/***/ "./demos/demos/minimal.ts":
/*!********************************!*\
  !*** ./demos/demos/minimal.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "demo": () => (/* binding */ demo)
/* harmony export */ });
// Minimal effect, with only a basic render pass.
const demo = {
    id: "minimal",
    caption: "Minimal setup without compute.",
    async init(params) {
        const pipeline = params.device.createRenderPipeline({
            layout: params.device.createPipelineLayout({
                bindGroupLayouts: [
                    // We do not need here a bind group, as we are not binding
                    // anything in this example - keeping it around for
                    // reference.
                    params.device.createBindGroupLayout({
                        entries: [],
                    }),
                ]
            }),
            // Create triangles to cover the screen.
            vertex: {
                entryPoint: "main",
                module: params.device.createShaderModule({
                    label: "full screen vertices",
                    code: `
                        struct VSOut {
                            @builtin(position) pos: vec4<f32>,
                            @location(0) coord: vec2<f32>,
                        };
                        @stage(vertex)
                        fn main(@builtin(vertex_index) idx : u32) -> VSOut {
                            var data = array<vec2<f32>, 6>(
                                vec2<f32>(-1.0, -1.0),
                                vec2<f32>(1.0, -1.0),
                                vec2<f32>(1.0, 1.0),

                                vec2<f32>(-1.0, -1.0),
                                vec2<f32>(-1.0, 1.0),
                                vec2<f32>(1.0, 1.0),
                            );

                            let pos = data[idx];

                            var out : VSOut;
                            out.pos = vec4<f32>(pos, 0.0, 1.0);
                            out.coord.x = (pos.x + 1.0) / 2.0;
                            out.coord.y = (1.0 - pos.y) / 2.0;

                            return out;
                        }
                    `,
                }),
            },
            primitive: {
                topology: 'triangle-list',
            },
            // Just write some color on each pixel.
            fragment: {
                entryPoint: 'main',
                module: params.device.createShaderModule({
                    code: `
                        @stage(fragment)
                        fn main(@location(0) coord: vec2<f32>) -> @location(0) vec4<f32> {
                            return vec4<f32>(coord.x, coord.y, 0.5, 1.0);
                        }
                    `,
                }),
                targets: [{
                        format: params.renderFormat,
                    }],
            },
        });
        const bindgroup = params.device.createBindGroup({
            layout: pipeline.getBindGroupLayout(0),
            // Minimal, nothing to bind.
            entries: []
        });
        // Single frame rendering.
        return async (info) => {
            const commandEncoder = params.device.createCommandEncoder();
            const passEncoder = commandEncoder.beginRenderPass({
                colorAttachments: [{
                        view: params.context.getCurrentTexture().createView(),
                        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                        loadOp: 'clear',
                        storeOp: 'store',
                    }],
            });
            passEncoder.setPipeline(pipeline);
            passEncoder.setBindGroup(0, bindgroup);
            passEncoder.draw(6, 1, 0, 0);
            passEncoder.end();
            params.device.queue.submit([commandEncoder.finish()]);
        };
    }
};


/***/ }),

/***/ "./demos/demos/multicubes.ts":
/*!***********************************!*\
  !*** ./demos/demos/multicubes.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "demo": () => (/* binding */ demo)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! gl-matrix */ "./node_modules/gl-matrix/esm/vec3.js");
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! gl-matrix */ "./node_modules/gl-matrix/esm/mat4.js");
/* harmony import */ var _src__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src */ "./src/index.ts");
/* harmony import */ var _shaderlib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shaderlib */ "./demos/shaderlib.ts");
/* harmony import */ var _palats_varpanel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @palats/varpanel */ "./node_modules/@palats/varpanel/dist/varpanel.js");
/* harmony import */ var _cameras__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../cameras */ "./demos/cameras.ts");
// Multiple rotating cubes.
//
// Rotation, translation and projection are calculated within compute shaders.





// Number of instances.
const workgroupWidth = 8;
const workgroupHeight = 8;
const instancesWidth = 1 * workgroupWidth;
const instancesHeight = 1 * workgroupHeight;
const instances = instancesWidth * instancesHeight;
// Space parameters.
const boxSize = 20;
const cameraOffset = gl_matrix__WEBPACK_IMPORTED_MODULE_4__.fromValues(0, 0, 25);
const spaceLimit = boxSize / 2.0;
// Basic parameters provided to all the shaders.
const uniformsDesc = new _src__WEBPACK_IMPORTED_MODULE_0__.StructType({
    elapsedMs: { idx: 0, type: _src__WEBPACK_IMPORTED_MODULE_0__.F32 },
    deltaMs: { idx: 1, type: _src__WEBPACK_IMPORTED_MODULE_0__.F32 },
    renderWidth: { idx: 2, type: _src__WEBPACK_IMPORTED_MODULE_0__.F32 },
    renderHeight: { idx: 3, type: _src__WEBPACK_IMPORTED_MODULE_0__.F32 },
    rngSeed: { idx: 4, type: _src__WEBPACK_IMPORTED_MODULE_0__.F32 },
    camera: { idx: 5, type: _src__WEBPACK_IMPORTED_MODULE_0__.Mat4x4F32 },
});
// Parameters from Javascript to the computer shader
// for each instance.
const instanceParamsDesc = new _src__WEBPACK_IMPORTED_MODULE_0__.StructType({
    'pos': { type: _src__WEBPACK_IMPORTED_MODULE_0__.Vec3f32, idx: 0 },
    'rot': { type: _src__WEBPACK_IMPORTED_MODULE_0__.Vec3f32, idx: 1 },
    'move': { type: _src__WEBPACK_IMPORTED_MODULE_0__.Vec3f32, idx: 2 },
    'scale': { type: _src__WEBPACK_IMPORTED_MODULE_0__.F32, idx: 3 },
});
const instanceArrayDesc = new _src__WEBPACK_IMPORTED_MODULE_0__.ArrayType(instanceParamsDesc, instances);
const demo = {
    id: "multicubes",
    caption: "Multiple independent rotating cubes.",
    async init(params) {
        // Setup controls.
        const ctrls = {
            showBoundaries: true,
            showBasis: false,
        };
        params.expose(_palats_varpanel__WEBPACK_IMPORTED_MODULE_2__.newBool({ obj: ctrls, field: 'showBoundaries' }));
        params.expose(_palats_varpanel__WEBPACK_IMPORTED_MODULE_2__.newBool({ obj: ctrls, field: 'showBasis' }));
        // Setup some initial positions for the cubes.
        const positions = [];
        for (let y = 0; y < instancesHeight; y++) {
            for (let x = 0; x < instancesWidth; x++) {
                positions.push({
                    pos: [
                        boxSize * (0.5 - Math.random()),
                        boxSize * (0.5 - Math.random()),
                        boxSize * (0.5 - Math.random()),
                    ],
                    rot: [
                        Math.random() * 2 * Math.PI,
                        Math.random() * 2 * Math.PI,
                        Math.random() * 2 * Math.PI,
                    ],
                    move: [
                        0.4 * (0.5 - Math.random()),
                        0.4 * (0.5 - Math.random()),
                        0.4 * (0.5 - Math.random()),
                    ],
                    scale: 1.0 + 0.3 * (0.5 - Math.random()),
                });
            }
        }
        const instancesBuffer = params.device.createBuffer({
            label: "Instance parameters",
            size: instanceArrayDesc.byteSize(),
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });
        const a = new ArrayBuffer(instanceArrayDesc.byteSize());
        instanceArrayDesc.dataViewSet(new DataView(a), 0, positions);
        params.device.queue.writeBuffer(instancesBuffer, 0, a);
        const uniformsBuffer = params.device.createBuffer({
            label: "Compute uniforms buffer",
            size: uniformsDesc.byteSize(),
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        const computeResult = params.device.createBuffer({
            label: "Compute output for vertex shaders",
            size: instances * _src__WEBPACK_IMPORTED_MODULE_0__.Mat4x4F32.byteSize(),
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.VERTEX,
        });
        // -- Compute pipeline. It takes care of calculating the cube vertices
        // transformation (and projection) matrices.
        const computePipeline = params.device.createComputePipeline({
            label: "Compute pipeline for projection matrix",
            layout: params.device.createPipelineLayout({
                label: "compute pipeline layouts",
                bindGroupLayouts: [params.device.createBindGroupLayout({
                        label: "compute pipeline main layout",
                        entries: [
                            // Uniforms, from JS
                            {
                                binding: 0,
                                visibility: GPUShaderStage.COMPUTE,
                                buffer: { type: "uniform" },
                            },
                            // Instances parameters, from JS
                            {
                                binding: 1,
                                visibility: GPUShaderStage.COMPUTE,
                                buffer: { type: "storage" },
                            },
                            // Output buffer, to feed the vertex shader.
                            {
                                binding: 2,
                                visibility: GPUShaderStage.COMPUTE,
                                buffer: { type: "storage" },
                            },
                        ]
                    })],
            }),
            compute: {
                entryPoint: "main",
                module: params.device.createShaderModule(new _src__WEBPACK_IMPORTED_MODULE_0__.WGSLModule({
                    label: "Rendering matrix compute",
                    code: _src__WEBPACK_IMPORTED_MODULE_0__.wgsl `
                        @group(0) @binding(0) var<uniform> uniforms : ${uniformsDesc.typename()};
                        @group(0) @binding(1) var<storage, read_write> params : ${instanceArrayDesc.typename()};

                        struct InstanceState {
                            // ModelViewProjection
                            mvp: mat4x4<f32>,
                        };
                        @group(0) @binding(2) var<storage, write> outp : array<InstanceState, ${instances.toString()}>;

                        @stage(compute) @workgroup_size(${workgroupWidth.toString()}u, ${workgroupHeight.toString()}u)
                        fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
                            let idx = global_id.y * ${instancesWidth.toString()}u + global_id.x;

                            var pos = params[idx].pos;

                            if (uniforms.deltaMs > 0.0) {
                                let nextpos = pos + params[idx].move;
                                // This is probably horribly inefficient.
                                if (nextpos.x < -${spaceLimit.toFixed(1)} || nextpos.x >= ${spaceLimit.toFixed(1)}) {
                                    params[idx].move.x = -params[idx].move.x;
                                }
                                if (nextpos.y < -${spaceLimit.toFixed(1)} || nextpos.y >= ${spaceLimit.toFixed(1)}) {
                                    params[idx].move.y = -params[idx].move.y;
                                }
                                if (nextpos.z < -${spaceLimit.toFixed(1)} || nextpos.z >= ${spaceLimit.toFixed(1)}) {
                                    params[idx].move.z = -params[idx].move.z;
                                }
                                pos = pos + params[idx].move;
                                params[idx].pos = pos;
                            }

                            let TAU = 6.283185;
                            let c = (uniforms.elapsedMs / 1000.0) % TAU;
                            let r = params[idx].rot + vec3<f32>(c, c, c);

                            outp[idx].mvp =
                                uniforms.camera
                                * ${_shaderlib__WEBPACK_IMPORTED_MODULE_1__.tr.ref("translate")}(pos)
                                * ${_shaderlib__WEBPACK_IMPORTED_MODULE_1__.tr.ref("rotateZ")}(r.z)
                                * ${_shaderlib__WEBPACK_IMPORTED_MODULE_1__.tr.ref("rotateY")}(r.y)
                                * ${_shaderlib__WEBPACK_IMPORTED_MODULE_1__.tr.ref("rotateX")}(r.x)
                                * ${_shaderlib__WEBPACK_IMPORTED_MODULE_1__.tr.ref("scale")}(params[idx].scale);
                        }
                    `,
                }).toDesc()),
            }
        });
        const computeBindGroup = params.device.createBindGroup({
            label: "Bind group for the projection matrix compute",
            layout: computePipeline.getBindGroupLayout(0),
            entries: [{
                    binding: 0,
                    resource: { buffer: uniformsBuffer }
                }, {
                    binding: 1,
                    resource: { buffer: instancesBuffer }
                }, {
                    binding: 2,
                    resource: { buffer: computeResult }
                }]
        });
        // -- Render pipeline.
        // It takes the projection matrix from the compute output
        // and create a cube from hard coded vertex coordinates.
        const depthFormat = "depth24plus";
        const renderPipeline = params.device.createRenderPipeline({
            label: "Cube rendering pipeline",
            layout: params.device.createPipelineLayout({
                label: "render pipeline layouts",
                bindGroupLayouts: [
                    params.device.createBindGroupLayout({
                        label: "render pipeline layout for compute data",
                        entries: [
                            // Matrix info coming from compute shader.
                            {
                                binding: 0,
                                visibility: GPUShaderStage.VERTEX,
                                buffer: {
                                    type: 'read-only-storage',
                                },
                            },
                        ],
                    }),
                ]
            }),
            vertex: {
                entryPoint: 'main',
                module: params.device.createShaderModule(new _src__WEBPACK_IMPORTED_MODULE_0__.WGSLModule({
                    label: "cube vertex shader",
                    code: _src__WEBPACK_IMPORTED_MODULE_0__.wgsl `
                        struct InstanceState {
                            // ModelViewProjection
                            mvp: mat4x4<f32>,
                        };
                        @group(0) @binding(0) var<storage> states : array<InstanceState, ${instances.toString()}>;

                        struct Out {
                            @builtin(position) pos: vec4<f32>,
                            @location(0) coord: vec3<f32>,
                        };

                        @stage(vertex)
                        fn main(@builtin(vertex_index) idx : u32, @builtin(instance_index) instance: u32) -> Out {
                            let pos = ${_shaderlib__WEBPACK_IMPORTED_MODULE_1__.cubeMeshStrip.ref("mesh")}[idx];

                            var out : Out;
                            out.pos = states[instance].mvp * vec4<f32>(pos , 1.0);
                            out.coord.x = (pos.x + 1.0) / 2.0;
                            out.coord.y = (pos.y + 1.0) / 2.0;
                            out.coord.z = (pos.z + 1.0) / 2.0;
                            return out;
                        }
                    `,
                }).toDesc())
            },
            primitive: {
                topology: 'triangle-strip',
                cullMode: 'back',
            },
            depthStencil: {
                depthWriteEnabled: true,
                depthCompare: 'less',
                format: depthFormat,
            },
            fragment: {
                entryPoint: 'main',
                module: params.device.createShaderModule({
                    label: "trivial fragment shader",
                    code: `
                        @stage(fragment)
                        fn main(@location(0) coord: vec3<f32>) -> @location(0) vec4<f32> {
                            return vec4<f32>(coord.x, coord.y, coord.z, 1.0);
                        }
                    `,
                }),
                targets: [{
                        format: params.renderFormat,
                    }],
            },
        });
        const renderBindGroup = params.device.createBindGroup({
            label: "render pipeline bindgroup",
            layout: renderPipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: { buffer: computeResult }
                },
            ]
        });
        const depthTextureView = params.device.createTexture({
            label: "depth view",
            size: [params.renderWidth, params.renderHeight],
            format: depthFormat,
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        }).createView();
        // Prepare the rendering pipeline as a bundle.
        const renderBundleEncoder = params.device.createRenderBundleEncoder({
            label: "main render bundle",
            depthReadOnly: false,
            stencilReadOnly: false,
            colorFormats: [params.renderFormat],
            depthStencilFormat: depthFormat,
        });
        renderBundleEncoder.setPipeline(renderPipeline);
        renderBundleEncoder.setBindGroup(0, renderBindGroup);
        // Cube mesh as a triangle-strip uses 14 vertices.
        renderBundleEncoder.draw(14, instances, 0, 0);
        const renderBundle = renderBundleEncoder.finish();
        // Orthonormals.
        const basisBundle = _shaderlib__WEBPACK_IMPORTED_MODULE_1__.buildLineBundle({
            device: params.device,
            colorFormat: params.renderFormat,
            depthFormat: depthFormat,
            lines: _shaderlib__WEBPACK_IMPORTED_MODULE_1__.ortholines,
            mod: uniformsDesc,
            buffer: uniformsBuffer,
        });
        // Cube surrounding the scene.
        const boundariesBundle = _shaderlib__WEBPACK_IMPORTED_MODULE_1__.buildLineBundle({
            device: params.device,
            colorFormat: params.renderFormat,
            depthFormat: depthFormat,
            lines: _shaderlib__WEBPACK_IMPORTED_MODULE_1__.cubelines(spaceLimit),
            depthCompare: 'less',
            mod: uniformsDesc,
            buffer: uniformsBuffer,
        });
        // Configuring camera.
        const camera = new _cameras__WEBPACK_IMPORTED_MODULE_3__.ArcBall(cameraOffset);
        params.setCamera(camera);
        // -- Single frame rendering.
        return async (info) => {
            const viewproj = gl_matrix__WEBPACK_IMPORTED_MODULE_5__.perspective(gl_matrix__WEBPACK_IMPORTED_MODULE_5__.create(), 2.0 * 3.14159 / 5.0, // Vertical field of view (rads),
            params.renderWidth / params.renderHeight, // aspect
            1.0, // near
            100.0);
            camera.transform(viewproj, info.cameraMvt);
            params.device.queue.writeBuffer(uniformsBuffer, 0, uniformsDesc.createArray({
                elapsedMs: info.elapsedMs,
                deltaMs: info.deltaMs,
                renderWidth: params.renderWidth,
                renderHeight: params.renderHeight,
                rngSeed: info.rng,
                camera: Array.from(viewproj),
            }));
            // -- Do compute pass, to create projection matrices.
            const commandEncoder = params.device.createCommandEncoder();
            commandEncoder.pushDebugGroup('Time ${info.elapsedMs}');
            commandEncoder.pushDebugGroup('Compute cube movement');
            const computeEncoder = commandEncoder.beginComputePass();
            computeEncoder.setPipeline(computePipeline);
            computeEncoder.setBindGroup(0, computeBindGroup);
            // Calculate projection matrices for each instance.
            computeEncoder.dispatch(workgroupWidth, workgroupHeight);
            computeEncoder.end();
            commandEncoder.popDebugGroup();
            // -- And do the frame rendering.
            commandEncoder.pushDebugGroup('Render cubes');
            const renderEncoder = commandEncoder.beginRenderPass({
                colorAttachments: [{
                        view: params.context.getCurrentTexture().createView(),
                        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                        loadOp: 'clear',
                        storeOp: 'store',
                    }],
                depthStencilAttachment: {
                    view: depthTextureView,
                    depthClearValue: 1.0,
                    depthLoadOp: 'clear',
                    depthStoreOp: 'store',
                },
            });
            const bundles = [renderBundle];
            if (ctrls.showBoundaries) {
                bundles.push(boundariesBundle);
            }
            if (ctrls.showBasis) {
                bundles.push(basisBundle);
            }
            renderEncoder.executeBundles(bundles);
            renderEncoder.end();
            commandEncoder.popDebugGroup();
            // Submit all the work.
            commandEncoder.popDebugGroup();
            params.device.queue.submit([commandEncoder.finish()]);
        };
    }
};


/***/ }),

/***/ "./demos/demos/plane.ts":
/*!******************************!*\
  !*** ./demos/demos/plane.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "demo": () => (/* binding */ demo)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! gl-matrix */ "./node_modules/gl-matrix/esm/vec3.js");
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! gl-matrix */ "./node_modules/gl-matrix/esm/mat4.js");
/* harmony import */ var _src__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src */ "./src/index.ts");
/* harmony import */ var _shaderlib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shaderlib */ "./demos/shaderlib.ts");
/* harmony import */ var _palats_varpanel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @palats/varpanel */ "./node_modules/@palats/varpanel/dist/varpanel.js");
/* harmony import */ var _cameras__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../cameras */ "./demos/cameras.ts");
// An infinite plane.





// Basic parameters provided to all the shaders.
const uniformsDesc = new _src__WEBPACK_IMPORTED_MODULE_0__.StructType({
    elapsedMs: { idx: 0, type: _src__WEBPACK_IMPORTED_MODULE_0__.F32 },
    deltaMs: { idx: 1, type: _src__WEBPACK_IMPORTED_MODULE_0__.F32 },
    renderWidth: { idx: 2, type: _src__WEBPACK_IMPORTED_MODULE_0__.F32 },
    renderHeight: { idx: 3, type: _src__WEBPACK_IMPORTED_MODULE_0__.F32 },
    rngSeed: { idx: 4, type: _src__WEBPACK_IMPORTED_MODULE_0__.F32 },
    camera: { idx: 5, type: _src__WEBPACK_IMPORTED_MODULE_0__.Mat4x4F32 },
    revCamera: { idx: 6, type: _src__WEBPACK_IMPORTED_MODULE_0__.Mat4x4F32 },
});
// Parameters from Javascript to the computer shader
// for each instance.
const demo = {
    id: "plane",
    caption: "An infinite plane",
    async init(params) {
        // Setup controls.
        const ctrls = {
            showBoundaries: true,
            showBasis: true,
        };
        params.expose(_palats_varpanel__WEBPACK_IMPORTED_MODULE_2__.newBool({ obj: ctrls, field: 'showBoundaries' }));
        params.expose(_palats_varpanel__WEBPACK_IMPORTED_MODULE_2__.newBool({ obj: ctrls, field: 'showBasis' }));
        const uniformsBuffer = params.device.createBuffer({
            label: "Compute uniforms buffer",
            size: uniformsDesc.byteSize(),
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        // -- Render pipeline.
        // It takes the projection matrix from the compute output
        // and create a cube from hard coded vertex coordinates.
        const depthFormat = "depth24plus";
        // Inspiration from https://stackoverflow.com/questions/12965161/rendering-infinitely-large-plane
        // And http://asliceofrendering.com/scene%20helper/2020/01/05/InfiniteGrid/
        const shader = params.device.createShaderModule(new _src__WEBPACK_IMPORTED_MODULE_0__.WGSLModule({
            label: "vertex shader",
            code: _src__WEBPACK_IMPORTED_MODULE_0__.wgsl `
                @group(0) @binding(0) var<uniform> uniforms: ${uniformsDesc.typename()};

                // An XY plane described using 4 triangles.
                let mesh = array<vec4<f32>, 12>(
                    vec4<f32>(0.f, 0.f, 0.f, 1.f),
                    vec4<f32>(1.f, 0.f, 0.f, 0.f),
                    vec4<f32>(0.f, 1.f, 0.f, 0.f),

                    vec4<f32>(0.f, 0.f, 0.f, 1.f),
                    vec4<f32>(0.f, 1.f, 0.f, 0.f),
                    vec4<f32>(-1.f, 0.f, 0.f, 0.f),

                    vec4<f32>(0.f, 0.f, 0.f, 1.f),
                    vec4<f32>(-1.f, 0.f, 0.f, 0.f),
                    vec4<f32>(0.f, -1.f, 0.f, 0.f),

                    vec4<f32>(0.f, 0.f, 0.f, 1.f),
                    vec4<f32>(0.f, -1.f, 0.f, 0.f),
                    vec4<f32>(1.f, 0.f, 0.f, 0.f),
                );

                struct VertexOut {
                    @builtin(position) pos: vec4<f32>,
                    @location(0) coord: vec4<f32>,
                };

                @stage(vertex)
                fn vertex(@builtin(vertex_index) idx : u32, @builtin(instance_index) instance: u32) -> VertexOut {
                    let pos = mesh[idx];

                    var out : VertexOut;
                    out.pos = uniforms.camera * pos;
                    out.coord = pos;
                    return out;
                }

                let lineWidth = 0.02;
                let gridStep = 1.0;

                struct FragOut {
                    @location(0) color: vec4<f32>,
                }

                @stage(fragment)
                fn fragment(vert: VertexOut) -> FragOut {
                    var out : FragOut;

                    let world = vert.coord / vert.coord.w;
                    let coord = world / gridStep;
                    let d = fwidth(coord);
                    let grid = abs(fract(coord - 0.5) - 0.5) / d;
                    let line = min(grid.x, grid.y);
                    let presence = 1.0 - min(line, 1.0);
                    // Depth is [0..1].
                    let depth = vert.pos.z;

                    out.color = vec4<f32>(.9, .9, .9, presence * (1.0 - depth));
                    return out;
                }
            `,
        }).toDesc());
        const renderPipeline = params.device.createRenderPipeline({
            label: "rendering pipeline",
            layout: params.device.createPipelineLayout({
                label: "render pipeline layouts",
                bindGroupLayouts: [
                    params.device.createBindGroupLayout({
                        label: "render pipeline layout",
                        entries: [
                            {
                                binding: 0,
                                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                                buffer: { type: 'uniform' },
                            },
                        ],
                    }),
                ]
            }),
            vertex: {
                entryPoint: 'vertex',
                module: shader,
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'none',
            },
            depthStencil: {
                // The grid should not prevent other things to be displayed, so
                // disable depth writing.
                depthWriteEnabled: false,
                depthCompare: 'less',
                format: depthFormat,
            },
            fragment: {
                entryPoint: 'fragment',
                module: shader,
                targets: [{
                        format: params.renderFormat,
                        blend: {
                            // Do alpha blending of the color.
                            color: {
                                operation: "add",
                                srcFactor: "src-alpha",
                                dstFactor: "one-minus-src-alpha"
                            },
                            // State of alpha on the target always ends up at 1.
                            alpha: {
                                operation: "add",
                                srcFactor: "zero",
                                dstFactor: "one",
                            },
                        }
                    }],
            },
        });
        const renderBindGroup = params.device.createBindGroup({
            label: "render pipeline bindgroup",
            layout: renderPipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: { buffer: uniformsBuffer }
                },
            ]
        });
        const depthTextureView = params.device.createTexture({
            label: "depth view",
            size: [params.renderWidth, params.renderHeight],
            format: depthFormat,
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        }).createView();
        // Prepare the rendering pipeline as a bundle.
        const renderBundleEncoder = params.device.createRenderBundleEncoder({
            label: "main render bundle",
            depthReadOnly: false,
            stencilReadOnly: false,
            colorFormats: [params.renderFormat],
            depthStencilFormat: depthFormat,
        });
        renderBundleEncoder.setPipeline(renderPipeline);
        renderBundleEncoder.setBindGroup(0, renderBindGroup);
        renderBundleEncoder.draw(12, 1, 0, 0);
        const renderBundle = renderBundleEncoder.finish();
        // Orthonormals.
        const basisBundle = _shaderlib__WEBPACK_IMPORTED_MODULE_1__.buildLineBundle({
            device: params.device,
            colorFormat: params.renderFormat,
            depthFormat: depthFormat,
            lines: _shaderlib__WEBPACK_IMPORTED_MODULE_1__.ortholines,
            mod: uniformsDesc,
            buffer: uniformsBuffer,
        });
        // Cube surrounding the scene.
        const boundariesBundle = _shaderlib__WEBPACK_IMPORTED_MODULE_1__.buildLineBundle({
            device: params.device,
            colorFormat: params.renderFormat,
            depthFormat: depthFormat,
            lines: _shaderlib__WEBPACK_IMPORTED_MODULE_1__.cubelines(1.0),
            depthCompare: 'less',
            mod: uniformsDesc,
            buffer: uniformsBuffer,
        });
        // Configuring camera.
        const camera = new _cameras__WEBPACK_IMPORTED_MODULE_3__.ArcBall(gl_matrix__WEBPACK_IMPORTED_MODULE_4__.fromValues(0, 0, 5));
        params.setCamera(camera);
        // -- Single frame rendering.
        return async (info) => {
            const viewproj = gl_matrix__WEBPACK_IMPORTED_MODULE_5__.perspective(gl_matrix__WEBPACK_IMPORTED_MODULE_5__.create(), 2.0 * 3.14159 / 5.0, // Vertical field of view (rads),
            params.renderWidth / params.renderHeight, // aspect
            1.0, // near
            100.0);
            camera.transform(viewproj, info.cameraMvt);
            params.device.queue.writeBuffer(uniformsBuffer, 0, uniformsDesc.createArray({
                elapsedMs: info.elapsedMs,
                deltaMs: info.deltaMs,
                renderWidth: params.renderWidth,
                renderHeight: params.renderHeight,
                rngSeed: info.rng,
                camera: Array.from(viewproj),
                revCamera: Array.from(gl_matrix__WEBPACK_IMPORTED_MODULE_5__.invert(gl_matrix__WEBPACK_IMPORTED_MODULE_5__.create(), viewproj)),
            }));
            const commandEncoder = params.device.createCommandEncoder();
            commandEncoder.pushDebugGroup('Time ${info.elapsedMs}');
            commandEncoder.pushDebugGroup('Render');
            const renderEncoder = commandEncoder.beginRenderPass({
                colorAttachments: [{
                        view: params.context.getCurrentTexture().createView(),
                        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                        loadOp: 'clear',
                        storeOp: 'store',
                    }],
                depthStencilAttachment: {
                    view: depthTextureView,
                    depthClearValue: 1.0,
                    depthLoadOp: 'clear',
                    depthStoreOp: 'store',
                },
            });
            const bundles = [renderBundle];
            if (ctrls.showBoundaries) {
                bundles.push(boundariesBundle);
            }
            if (ctrls.showBasis) {
                bundles.push(basisBundle);
            }
            renderEncoder.executeBundles(bundles);
            renderEncoder.end();
            commandEncoder.popDebugGroup();
            // Submit all the work.
            commandEncoder.popDebugGroup();
            params.device.queue.submit([commandEncoder.finish()]);
        };
    }
};


/***/ }),

/***/ "./demos/demos/sphere.ts":
/*!*******************************!*\
  !*** ./demos/demos/sphere.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "demo": () => (/* binding */ demo)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! gl-matrix */ "./node_modules/gl-matrix/esm/vec3.js");
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! gl-matrix */ "./node_modules/gl-matrix/esm/mat4.js");
/* harmony import */ var _src__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src */ "./src/index.ts");
/* harmony import */ var _shaderlib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shaderlib */ "./demos/shaderlib.ts");
/* harmony import */ var _cameras__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../cameras */ "./demos/cameras.ts");
/* harmony import */ var _palats_varpanel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @palats/varpanel */ "./node_modules/@palats/varpanel/dist/varpanel.js");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../models */ "./demos/models.ts");
// Draw a sphere.






const demo = {
    id: "sphere",
    caption: "A sphere",
    async init(params) {
        const d = new Demo(params);
        // await d.init(params);
        return (f) => d.draw(f);
    }
};
// Basic parameters provided to all the shaders.
const uniformsDesc = new _src__WEBPACK_IMPORTED_MODULE_0__.StructType({
    elapsedMs: { idx: 0, type: _src__WEBPACK_IMPORTED_MODULE_0__.F32 },
    deltaMs: { idx: 1, type: _src__WEBPACK_IMPORTED_MODULE_0__.F32 },
    renderWidth: { idx: 2, type: _src__WEBPACK_IMPORTED_MODULE_0__.F32 },
    renderHeight: { idx: 3, type: _src__WEBPACK_IMPORTED_MODULE_0__.F32 },
    rngSeed: { idx: 4, type: _src__WEBPACK_IMPORTED_MODULE_0__.F32 },
    camera: { idx: 5, type: _src__WEBPACK_IMPORTED_MODULE_0__.Mat4x4F32 },
});
const depthFormat = "depth24plus";
class Demo {
    constructor(params) {
        this.bundles = [];
        this._model = "sphere";
        this.params = params;
        params.expose(_palats_varpanel__WEBPACK_IMPORTED_MODULE_3__.newSelect({ obj: this, field: "model", values: ["sphere", "cube"] }));
        this.uniformsBuffer = params.device.createBuffer({
            label: "Compute uniforms buffer",
            size: uniformsDesc.byteSize(),
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        // -- Render pipeline.
        const shader = params.device.createShaderModule(new _src__WEBPACK_IMPORTED_MODULE_0__.WGSLModule({
            label: "vertex shader",
            code: _src__WEBPACK_IMPORTED_MODULE_0__.wgsl `
                @group(0) @binding(0) var<uniform> uniforms: ${uniformsDesc.typename()};

                struct Vertex {
                    @builtin(position) pos: vec4<f32>,
                    @location(0) color: vec4<f32>,
                };

                @stage(vertex)
                fn vertex(inp: ${_models__WEBPACK_IMPORTED_MODULE_4__.vertexDesc.vertexType()}) -> Vertex {
                    let TAU = 6.283185;
                    let c = (uniforms.elapsedMs / 1000.0) % TAU;
                    let r = vec3<f32>(c, c, c);

                    var out : Vertex;
                    out.pos =
                        uniforms.camera
                        * ${_shaderlib__WEBPACK_IMPORTED_MODULE_1__.tr.ref("rotateZ")}(r.z)
                        * ${_shaderlib__WEBPACK_IMPORTED_MODULE_1__.tr.ref("rotateY")}(r.y)
                        * ${_shaderlib__WEBPACK_IMPORTED_MODULE_1__.tr.ref("rotateX")}(r.z)
                        * vec4<f32>(inp.pos, 1.0);
                    // out.color = inp.color;
                    out.color = vec4<f32>(0.5 * (inp.pos + vec3<f32>(1., 1., 1.)), 1.0);
                    return out;
                }

                @stage(fragment)
                fn fragment(vert: Vertex) -> @location(0) vec4<f32> {
                    return vert.color;
                }
            `,
        }).toDesc());
        this.renderPipeline = params.device.createRenderPipeline({
            label: "Rendering pipeline",
            layout: params.device.createPipelineLayout({
                label: "render pipeline layouts",
                bindGroupLayouts: [
                    params.device.createBindGroupLayout({
                        label: "render pipeline layout",
                        entries: [
                            {
                                binding: 0,
                                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                                buffer: { type: 'uniform' },
                            },
                        ],
                    }),
                ]
            }),
            vertex: {
                entryPoint: 'vertex',
                module: shader,
                buffers: [_models__WEBPACK_IMPORTED_MODULE_4__.vertexDesc.vertexBufferLayout()],
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'back',
            },
            depthStencil: {
                depthWriteEnabled: true,
                depthCompare: 'less',
                format: depthFormat,
            },
            fragment: {
                entryPoint: 'fragment',
                module: shader,
                targets: [{
                        format: params.renderFormat,
                    }],
            },
        });
        this.renderBindGroup = params.device.createBindGroup({
            label: "render pipeline bindgroup",
            layout: this.renderPipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: { buffer: this.uniformsBuffer }
                },
            ]
        });
        this.depthTextureView = params.device.createTexture({
            label: "depth view",
            size: [params.renderWidth, params.renderHeight],
            format: depthFormat,
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        }).createView();
        // Configuring camera.
        this.camera = new _cameras__WEBPACK_IMPORTED_MODULE_2__.ArcBall(gl_matrix__WEBPACK_IMPORTED_MODULE_5__.fromValues(0, 0, 4));
        params.setCamera(this.camera);
        this.setMesh(new _models__WEBPACK_IMPORTED_MODULE_4__.GPUMesh(params, _models__WEBPACK_IMPORTED_MODULE_4__.sphereMesh()));
    }
    get model() { return this._model; }
    set model(s) {
        this._model = s;
        if (s === "cube")
            this.setMesh(new _models__WEBPACK_IMPORTED_MODULE_4__.GPUMesh(this.params, _models__WEBPACK_IMPORTED_MODULE_4__.cubeMesh()));
        else
            this.setMesh(new _models__WEBPACK_IMPORTED_MODULE_4__.GPUMesh(this.params, _models__WEBPACK_IMPORTED_MODULE_4__.sphereMesh()));
    }
    setMesh(gpuMesh) {
        const renderBundleEncoder = this.params.device.createRenderBundleEncoder({
            label: "main render bundle",
            depthReadOnly: false,
            stencilReadOnly: false,
            colorFormats: [this.params.renderFormat],
            depthStencilFormat: depthFormat,
        });
        renderBundleEncoder.setPipeline(this.renderPipeline);
        renderBundleEncoder.setBindGroup(0, this.renderBindGroup);
        gpuMesh.draw(renderBundleEncoder);
        this.bundles = [renderBundleEncoder.finish()];
    }
    // -- Single frame rendering.
    async draw(info) {
        const viewproj = gl_matrix__WEBPACK_IMPORTED_MODULE_6__.perspective(gl_matrix__WEBPACK_IMPORTED_MODULE_6__.create(), 2.0 * 3.14159 / 5.0, // Vertical field of view (rads),
        this.params.renderWidth / this.params.renderHeight, // aspect
        1.0, // near
        100.0);
        this.camera.transform(viewproj, info.cameraMvt);
        this.params.device.queue.writeBuffer(this.uniformsBuffer, 0, uniformsDesc.createArray({
            elapsedMs: info.elapsedMs,
            deltaMs: info.deltaMs,
            renderWidth: this.params.renderWidth,
            renderHeight: this.params.renderHeight,
            rngSeed: info.rng,
            camera: Array.from(viewproj),
        }));
        const commandEncoder = this.params.device.createCommandEncoder();
        commandEncoder.pushDebugGroup('Time ${info.elapsedMs}');
        // -- Frame rendering.
        commandEncoder.pushDebugGroup('Render cubes');
        const renderEncoder = commandEncoder.beginRenderPass({
            colorAttachments: [{
                    view: this.params.context.getCurrentTexture().createView(),
                    clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                    loadOp: 'clear',
                    storeOp: 'store',
                }],
            depthStencilAttachment: {
                view: this.depthTextureView,
                depthClearValue: 1.0,
                depthLoadOp: 'clear',
                depthStoreOp: 'store',
            },
        });
        renderEncoder.executeBundles(this.bundles);
        renderEncoder.end();
        commandEncoder.popDebugGroup();
        // Submit all the work.
        commandEncoder.popDebugGroup();
        this.params.device.queue.submit([commandEncoder.finish()]);
    }
}


/***/ }),

/***/ "./demos/demos/viewer.ts":
/*!*******************************!*\
  !*** ./demos/demos/viewer.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "demo": () => (/* binding */ demo)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! gl-matrix */ "./node_modules/gl-matrix/esm/mat4.js");
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! gl-matrix */ "./node_modules/gl-matrix/esm/vec3.js");
/* harmony import */ var _src__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src */ "./src/index.ts");
/* harmony import */ var _shaderlib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shaderlib */ "./demos/shaderlib.ts");
/* harmony import */ var _cameras__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../cameras */ "./demos/cameras.ts");
/* harmony import */ var _palats_varpanel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @palats/varpanel */ "./node_modules/@palats/varpanel/dist/varpanel.js");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../models */ "./demos/models.ts");
// Load gltf models.






const demo = {
    id: "viewer",
    caption: "A gltf viewer",
    async init(params) {
        const d = new Demo(params);
        return (f) => d.draw(f);
    }
};
// Basic parameters provided to all the shaders.
const uniformsDesc = new _src__WEBPACK_IMPORTED_MODULE_0__.StructType({
    elapsedMs: { idx: 0, type: _src__WEBPACK_IMPORTED_MODULE_0__.F32 },
    deltaMs: { idx: 1, type: _src__WEBPACK_IMPORTED_MODULE_0__.F32 },
    renderWidth: { idx: 2, type: _src__WEBPACK_IMPORTED_MODULE_0__.F32 },
    renderHeight: { idx: 3, type: _src__WEBPACK_IMPORTED_MODULE_0__.F32 },
    rngSeed: { idx: 4, type: _src__WEBPACK_IMPORTED_MODULE_0__.F32 },
    camera: { idx: 5, type: _src__WEBPACK_IMPORTED_MODULE_0__.Mat4x4F32 },
    modelTransform: { idx: 6, type: _src__WEBPACK_IMPORTED_MODULE_0__.Mat4x4F32 },
});
const depthFormat = "depth24plus";
function loadToGPU(u) {
    return async (params) => {
        const mesh = await _models__WEBPACK_IMPORTED_MODULE_4__.loadGLTF(u);
        return new _models__WEBPACK_IMPORTED_MODULE_4__.GPUMesh(params, mesh);
    };
}
const allModels = {
    "sphere/builtin": async (params) => new _models__WEBPACK_IMPORTED_MODULE_4__.GPUMesh(params, _models__WEBPACK_IMPORTED_MODULE_4__.sphereMesh()),
    "cube/builtin": async (params) => new _models__WEBPACK_IMPORTED_MODULE_4__.GPUMesh(params, _models__WEBPACK_IMPORTED_MODULE_4__.cubeMesh()),
    "cube/gltf": loadToGPU('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF/Box.gltf'),
    "triangle/gltf": loadToGPU('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Triangle/glTF/Triangle.gltf'),
    "avocado/gltf": loadToGPU('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF/Avocado.gltf'),
    "suzanne/gltf": loadToGPU('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Suzanne/glTF/Suzanne.gltf'),
    "duck/gltf": loadToGPU('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf'),
    "shaderball/glb": loadToGPU('https://raw.githubusercontent.com/gkjohnson/3d-demo-data/main/models/material-balls/material_ball_v2.glb'),
};
class Demo {
    constructor(params) {
        this.bundles = [];
        this.showBasis = true;
        this._model = "shaderball/glb";
        this.params = params;
        this.modelTransform = gl_matrix__WEBPACK_IMPORTED_MODULE_5__.create();
        params.expose(_palats_varpanel__WEBPACK_IMPORTED_MODULE_3__.newSelect({ obj: this, field: "model", values: Object.keys(allModels) }));
        params.expose(_palats_varpanel__WEBPACK_IMPORTED_MODULE_3__.newBool({ obj: this, field: 'showBasis' }));
        this.uniformsBuffer = params.device.createBuffer({
            label: "Compute uniforms buffer",
            size: uniformsDesc.byteSize(),
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        // -- Render pipeline.
        const shader = params.device.createShaderModule(new _src__WEBPACK_IMPORTED_MODULE_0__.WGSLModule({
            label: "vertex shader",
            code: _src__WEBPACK_IMPORTED_MODULE_0__.wgsl `
                @group(0) @binding(0) var<uniform> uniforms: ${uniformsDesc.typename()};

                struct Vertex {
                    @builtin(position) pos: vec4<f32>,
                    @location(0) color: vec4<f32>,
                    @location(1) world: vec4<f32>,
                    @location(2) normal: vec4<f32>,
                };

                @stage(vertex)
                fn vertex(inp: ${_models__WEBPACK_IMPORTED_MODULE_4__.vertexDesc.vertexType()}) -> Vertex {
                    let TAU = 6.283185;
                    let c = (uniforms.elapsedMs / 1000.0) % TAU;
                    let r = vec3<f32>(c, c, c);

                    let tr = ${_shaderlib__WEBPACK_IMPORTED_MODULE_1__.tr.ref("rotateZ")}(r.z)
                        * ${_shaderlib__WEBPACK_IMPORTED_MODULE_1__.tr.ref("rotateY")}(r.y)
                        * ${_shaderlib__WEBPACK_IMPORTED_MODULE_1__.tr.ref("rotateX")}(r.z)
                        * uniforms.modelTransform;

                    var out : Vertex;
                    out.pos = uniforms.camera * tr * vec4<f32>(inp.pos, 1.0);
                    out.world = tr * vec4<f32>(inp.pos, 1.0);
                    out.normal = normalize(tr * vec4<f32>(inp.normal, 0.0));

                    let modelPos = uniforms.modelTransform * vec4<f32>(inp.pos, 1.0);
                    out.color = vec4<f32>(0.5 * (modelPos.xyz + vec3<f32>(1., 1., 1.)), 1.0);
                    return out;
                }

                let light = vec4<f32>(4.0, 4.0, 10.0, 1.0);

                @stage(fragment)
                fn fragment(vert: Vertex) -> @location(0) vec4<f32> {
                    let ray = normalize(light - vert.world);
                    let lum = clamp(dot(ray, vert.normal), .0, 1.0);
                    return lum * vert.color;
                }
            `,
        }).toDesc());
        this.renderPipeline = params.device.createRenderPipeline({
            label: "Rendering pipeline",
            layout: params.device.createPipelineLayout({
                label: "render pipeline layouts",
                bindGroupLayouts: [
                    params.device.createBindGroupLayout({
                        label: "render pipeline layout",
                        entries: [
                            {
                                binding: 0,
                                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                                buffer: { type: 'uniform' },
                            },
                        ],
                    }),
                ]
            }),
            vertex: {
                entryPoint: 'vertex',
                module: shader,
                buffers: [_models__WEBPACK_IMPORTED_MODULE_4__.vertexDesc.vertexBufferLayout()],
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'back',
            },
            depthStencil: {
                depthWriteEnabled: true,
                depthCompare: 'less',
                format: depthFormat,
            },
            fragment: {
                entryPoint: 'fragment',
                module: shader,
                targets: [{
                        format: params.renderFormat,
                    }],
            },
        });
        this.renderBindGroup = params.device.createBindGroup({
            label: "render pipeline bindgroup",
            layout: this.renderPipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: { buffer: this.uniformsBuffer }
                },
            ]
        });
        this.depthTextureView = params.device.createTexture({
            label: "depth view",
            size: [params.renderWidth, params.renderHeight],
            format: depthFormat,
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        }).createView();
        // Orthonormals.
        this.basisBundle = _shaderlib__WEBPACK_IMPORTED_MODULE_1__.buildLineBundle({
            device: params.device,
            colorFormat: params.renderFormat,
            depthFormat: depthFormat,
            lines: _shaderlib__WEBPACK_IMPORTED_MODULE_1__.ortholines,
            mod: uniformsDesc,
            buffer: this.uniformsBuffer,
        });
        // Configuring camera.
        this.camera = new _cameras__WEBPACK_IMPORTED_MODULE_2__.ArcBall(gl_matrix__WEBPACK_IMPORTED_MODULE_6__.fromValues(0, 0, 4));
        params.setCamera(this.camera);
        // Force loading the initial model.
        this.model = this.model;
    }
    get model() { return this._model; }
    set model(s) {
        this._model = s;
        allModels[s](this.params).then(mesh => this.setMesh(mesh));
    }
    setMesh(gpuMesh) {
        const renderBundleEncoder = this.params.device.createRenderBundleEncoder({
            label: "main render bundle",
            depthReadOnly: false,
            stencilReadOnly: false,
            colorFormats: [this.params.renderFormat],
            depthStencilFormat: depthFormat,
        });
        renderBundleEncoder.setPipeline(this.renderPipeline);
        renderBundleEncoder.setBindGroup(0, this.renderBindGroup);
        gpuMesh.draw(renderBundleEncoder);
        this.bundles = [renderBundleEncoder.finish()];
        if (this.showBasis) {
            this.bundles.push(this.basisBundle);
        }
        if (gpuMesh.min && gpuMesh.max) {
            const diff = gl_matrix__WEBPACK_IMPORTED_MODULE_6__.sub(gl_matrix__WEBPACK_IMPORTED_MODULE_6__.create(), gpuMesh.max, gpuMesh.min);
            const maxDiff = Math.max(diff[0], diff[1], diff[2]);
            // Make it of size 2 - i.e., fitting it in a box from -1 to +1, as
            // it is rotating around the origin.
            const scale = 2 / maxDiff;
            const scaleVec = gl_matrix__WEBPACK_IMPORTED_MODULE_6__.fromValues(scale, scale, scale);
            const tr = gl_matrix__WEBPACK_IMPORTED_MODULE_6__.clone(gpuMesh.min);
            gl_matrix__WEBPACK_IMPORTED_MODULE_6__.scaleAndAdd(tr, tr, diff, 0.5);
            gl_matrix__WEBPACK_IMPORTED_MODULE_6__.scale(tr, tr, -1);
            gl_matrix__WEBPACK_IMPORTED_MODULE_5__.fromScaling(this.modelTransform, scaleVec);
            gl_matrix__WEBPACK_IMPORTED_MODULE_5__.translate(this.modelTransform, this.modelTransform, tr);
        }
        else {
            gl_matrix__WEBPACK_IMPORTED_MODULE_5__.identity(this.modelTransform);
        }
    }
    // -- Single frame rendering.
    async draw(info) {
        const viewproj = gl_matrix__WEBPACK_IMPORTED_MODULE_5__.perspective(gl_matrix__WEBPACK_IMPORTED_MODULE_5__.create(), 2.0 * 3.14159 / 5.0, // Vertical field of view (rads),
        this.params.renderWidth / this.params.renderHeight, // aspect
        1.0, // near
        100.0);
        this.camera.transform(viewproj, info.cameraMvt);
        this.params.device.queue.writeBuffer(this.uniformsBuffer, 0, uniformsDesc.createArray({
            elapsedMs: info.elapsedMs,
            deltaMs: info.deltaMs,
            renderWidth: this.params.renderWidth,
            renderHeight: this.params.renderHeight,
            rngSeed: info.rng,
            camera: Array.from(viewproj),
            modelTransform: Array.from(this.modelTransform),
        }));
        const commandEncoder = this.params.device.createCommandEncoder();
        commandEncoder.pushDebugGroup('Time ${info.elapsedMs}');
        // -- Frame rendering.
        commandEncoder.pushDebugGroup('Render cubes');
        const renderEncoder = commandEncoder.beginRenderPass({
            colorAttachments: [{
                    view: this.params.context.getCurrentTexture().createView(),
                    clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                    loadOp: 'clear',
                    storeOp: 'store',
                }],
            depthStencilAttachment: {
                view: this.depthTextureView,
                depthClearValue: 1.0,
                depthLoadOp: 'clear',
                depthStoreOp: 'store',
            },
        });
        renderEncoder.executeBundles(this.bundles);
        renderEncoder.end();
        commandEncoder.popDebugGroup();
        // Submit all the work.
        commandEncoder.popDebugGroup();
        this.params.device.queue.submit([commandEncoder.finish()]);
    }
}


/***/ }),

/***/ "./demos/models.ts":
/*!*************************!*\
  !*** ./demos/models.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GLTFAccessorComponentType": () => (/* binding */ GLTFAccessorComponentType),
/* harmony export */   "GLTFAccessorType": () => (/* binding */ GLTFAccessorType),
/* harmony export */   "GLTFPrimitiveMode": () => (/* binding */ GLTFPrimitiveMode),
/* harmony export */   "GPUMesh": () => (/* binding */ GPUMesh),
/* harmony export */   "cubeMesh": () => (/* binding */ cubeMesh),
/* harmony export */   "loadGLTF": () => (/* binding */ loadGLTF),
/* harmony export */   "sphereMesh": () => (/* binding */ sphereMesh),
/* harmony export */   "vertexDesc": () => (/* binding */ vertexDesc)
/* harmony export */ });
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! gl-matrix */ "./node_modules/gl-matrix/esm/vec3.js");
/* harmony import */ var _src__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src */ "./src/index.ts");
/* harmony import */ var gltf_loader_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! gltf-loader-ts */ "./node_modules/gltf-loader-ts/lib/gltf-loader.js");
/* harmony import */ var gltf_loader_ts__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(gltf_loader_ts__WEBPACK_IMPORTED_MODULE_1__);



const vertexDesc = new _src__WEBPACK_IMPORTED_MODULE_0__.StructType({
    pos: { type: _src__WEBPACK_IMPORTED_MODULE_0__.Vec3f32, idx: 0 },
    color: { type: _src__WEBPACK_IMPORTED_MODULE_0__.Vec4f32, idx: 1 },
    normal: { type: _src__WEBPACK_IMPORTED_MODULE_0__.Vec3f32, idx: 2 },
});
class GPUMesh {
    constructor(params, mesh) {
        this.min = mesh.min;
        this.max = mesh.max;
        const verticesDesc = new _src__WEBPACK_IMPORTED_MODULE_0__.ArrayType(vertexDesc, mesh.vertices.length);
        this.vertexBuffer = params.device.createBuffer({
            label: `vertex buffer`,
            size: verticesDesc.byteSize(),
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        });
        params.device.queue.writeBuffer(this.vertexBuffer, 0, verticesDesc.createArray(mesh.vertices));
        const indexDesc = new _src__WEBPACK_IMPORTED_MODULE_0__.ArrayType(_src__WEBPACK_IMPORTED_MODULE_0__.U16, mesh.indices.length);
        // Writing to buffer must be multiple of 4.
        const indexSize = Math.ceil(indexDesc.byteSize() / 4) * 4;
        this.indexBuffer = params.device.createBuffer({
            label: `index buffer`,
            size: indexSize,
            usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
        });
        const indexArray = new ArrayBuffer(indexSize);
        indexDesc.dataViewSet(new DataView(indexArray), 0, mesh.indices);
        params.device.queue.writeBuffer(this.indexBuffer, 0, indexArray, 0, indexSize);
        this.indicesCount = mesh.indices.length;
    }
    draw(encoder) {
        encoder.setIndexBuffer(this.indexBuffer, 'uint16');
        encoder.setVertexBuffer(0, this.vertexBuffer);
        encoder.drawIndexed(this.indicesCount);
    }
}
function cubeMesh() {
    const r = 0.5;
    return {
        vertices: [
            { pos: [-r, -r, -r], color: [0, 0, 0, 1], normal: [0, 0, 0] },
            { pos: [r, -r, -r], color: [1, 0, 0, 1], normal: [0, 0, 0] },
            { pos: [r, r, -r], color: [1, 1, 0, 1], normal: [0, 0, 0] },
            { pos: [-r, r, -r], color: [0, 1, 0, 1], normal: [0, 0, 0] },
            { pos: [-r, -r, r], color: [0, 0, 1, 1], normal: [0, 0, 0] },
            { pos: [r, -r, r], color: [1, 0, 1, 1], normal: [0, 0, 0] },
            { pos: [r, r, r], color: [1, 1, 1, 1], normal: [0, 0, 0] },
            { pos: [-r, r, r], color: [0, 1, 1, 1], normal: [0, 0, 0] },
        ],
        indices: [
            0, 3, 1,
            1, 3, 2,
            5, 1, 6,
            6, 1, 2,
            0, 7, 3,
            0, 4, 7,
            7, 4, 5,
            5, 6, 7,
            3, 7, 6,
            6, 2, 3,
            4, 0, 5,
            5, 0, 1,
        ]
    };
}
// Inspired from https://github.com/caosdoar/spheres/blob/master/src/spheres.cpp
const faces = [
    { idx: 0, origin: gl_matrix__WEBPACK_IMPORTED_MODULE_2__.fromValues(-1, -1, -1), right: gl_matrix__WEBPACK_IMPORTED_MODULE_2__.fromValues(2, 0, 0), up: gl_matrix__WEBPACK_IMPORTED_MODULE_2__.fromValues(0, 2, 0) },
    { idx: 1, origin: gl_matrix__WEBPACK_IMPORTED_MODULE_2__.fromValues(1, -1, -1), right: gl_matrix__WEBPACK_IMPORTED_MODULE_2__.fromValues(0, 0, 2), up: gl_matrix__WEBPACK_IMPORTED_MODULE_2__.fromValues(0, 2, 0) },
    { idx: 2, origin: gl_matrix__WEBPACK_IMPORTED_MODULE_2__.fromValues(1, -1, 1), right: gl_matrix__WEBPACK_IMPORTED_MODULE_2__.fromValues(-2, 0, 0), up: gl_matrix__WEBPACK_IMPORTED_MODULE_2__.fromValues(0, 2, 0) },
    { idx: 3, origin: gl_matrix__WEBPACK_IMPORTED_MODULE_2__.fromValues(-1, -1, 1), right: gl_matrix__WEBPACK_IMPORTED_MODULE_2__.fromValues(0, 0, -2), up: gl_matrix__WEBPACK_IMPORTED_MODULE_2__.fromValues(0, 2, 0) },
    { idx: 4, origin: gl_matrix__WEBPACK_IMPORTED_MODULE_2__.fromValues(-1, 1, -1), right: gl_matrix__WEBPACK_IMPORTED_MODULE_2__.fromValues(2, 0, 0), up: gl_matrix__WEBPACK_IMPORTED_MODULE_2__.fromValues(0, 0, 2) },
    { idx: 5, origin: gl_matrix__WEBPACK_IMPORTED_MODULE_2__.fromValues(-1, -1, 1), right: gl_matrix__WEBPACK_IMPORTED_MODULE_2__.fromValues(2, 0, 0), up: gl_matrix__WEBPACK_IMPORTED_MODULE_2__.fromValues(0, 0, -2) },
];
function sphereMesh() {
    const vertices = [];
    const indices = [];
    const divisions = 4;
    const step = 1 / divisions;
    for (const face of faces) {
        for (let j = 0; j <= divisions; j++) {
            for (let i = 0; i <= divisions; i++) {
                const p = gl_matrix__WEBPACK_IMPORTED_MODULE_2__.fromValues(face.origin[0] + step * (i * face.right[0] + j * face.up[0]), face.origin[1] + step * (i * face.right[1] + j * face.up[1]), face.origin[2] + step * (i * face.right[2] + j * face.up[2]));
                const p2 = gl_matrix__WEBPACK_IMPORTED_MODULE_2__.multiply(gl_matrix__WEBPACK_IMPORTED_MODULE_2__.create(), p, p);
                vertices.push({
                    pos: [
                        p[0] * Math.sqrt(1 - 0.5 * (p2[1] + p2[2]) + p2[1] * p2[2] / 3),
                        p[1] * Math.sqrt(1 - 0.5 * (p2[2] + p2[0]) + p2[2] * p2[0] / 3),
                        p[2] * Math.sqrt(1 - 0.5 * (p2[0] + p2[1]) + p2[0] * p2[1] / 3),
                    ],
                    color: [j / divisions, i / divisions, 0, 1],
                    normal: [0, 0, 0],
                });
            }
        }
    }
    const k = divisions + 1;
    for (const face of faces) {
        for (let j = 0; j < divisions; j++) {
            const bottom = j < (divisions / 2);
            for (let i = 0; i < divisions; i++) {
                const left = i < (divisions / 2);
                const a = (face.idx * k + j) * k + i;
                const b = (face.idx * k + j) * k + i + 1;
                const c = (face.idx * k + j + 1) * k + i;
                const d = (face.idx * k + j + 1) * k + i + 1;
                if ((!bottom && !left) || (bottom && left)) {
                    indices.push(...[a, c, d, a, d, b]);
                    // indices.push(...[a, c, b, c, d, b]);
                }
                else {
                    // indices.push(...[a, c, d, a, d, b]);
                    indices.push(...[a, c, b, c, d, b]);
                }
            }
        }
    }
    return {
        vertices: vertices,
        indices: indices,
    };
}
// https://www.khronos.org/registry/glTF/specs/2.0/glTF-2.0.html#_mesh_primitive_mode
var GLTFPrimitiveMode;
(function (GLTFPrimitiveMode) {
    GLTFPrimitiveMode[GLTFPrimitiveMode["POINTS"] = 0] = "POINTS";
    GLTFPrimitiveMode[GLTFPrimitiveMode["LINES"] = 1] = "LINES";
    GLTFPrimitiveMode[GLTFPrimitiveMode["LINE_LOOP"] = 2] = "LINE_LOOP";
    GLTFPrimitiveMode[GLTFPrimitiveMode["LINE_STRIP"] = 3] = "LINE_STRIP";
    GLTFPrimitiveMode[GLTFPrimitiveMode["TRIANGLES"] = 4] = "TRIANGLES";
    GLTFPrimitiveMode[GLTFPrimitiveMode["TRIANGLE_STRIP"] = 5] = "TRIANGLE_STRIP";
    GLTFPrimitiveMode[GLTFPrimitiveMode["TRIANGLE_FAN"] = 6] = "TRIANGLE_FAN";
})(GLTFPrimitiveMode || (GLTFPrimitiveMode = {}));
;
// https://www.khronos.org/registry/glTF/specs/2.0/glTF-2.0.html#accessor-data-types
var GLTFAccessorType;
(function (GLTFAccessorType) {
    GLTFAccessorType["SCALAR"] = "SCALAR";
    GLTFAccessorType["VEC2"] = "VEC2";
    GLTFAccessorType["VEC3"] = "VEC3";
    GLTFAccessorType["VEC4"] = "VEC4";
    GLTFAccessorType["MAT2"] = "MAT2";
    GLTFAccessorType["MAT3"] = "MAT3";
    GLTFAccessorType["MAT4"] = "MAT4";
})(GLTFAccessorType || (GLTFAccessorType = {}));
;
var GLTFAccessorComponentType;
(function (GLTFAccessorComponentType) {
    GLTFAccessorComponentType[GLTFAccessorComponentType["S8"] = 5120] = "S8";
    GLTFAccessorComponentType[GLTFAccessorComponentType["U8"] = 5121] = "U8";
    GLTFAccessorComponentType[GLTFAccessorComponentType["S16"] = 5122] = "S16";
    GLTFAccessorComponentType[GLTFAccessorComponentType["U16"] = 5123] = "U16";
    GLTFAccessorComponentType[GLTFAccessorComponentType["U32"] = 5125] = "U32";
    GLTFAccessorComponentType[GLTFAccessorComponentType["F32"] = 5126] = "F32";
})(GLTFAccessorComponentType || (GLTFAccessorComponentType = {}));
;
async function loadGLTF(u) {
    var _a, _b;
    const loader = new gltf_loader_ts__WEBPACK_IMPORTED_MODULE_1__.GltfLoader();
    const asset = await loader.load(u);
    const content = asset.gltf;
    if (content.scene === undefined) {
        throw new Error("no default scene");
    }
    if (content.nodes === undefined) {
        throw new Error("missing nodes");
    }
    if (content.scenes === undefined) {
        throw new Error("no scenes");
    }
    if (content.meshes === undefined) {
        throw new Error("no meshes");
    }
    const scene = content.scenes[content.scene];
    if (scene.nodes === undefined) {
        throw new Error("no nodes in scene");
    }
    const nodelists = [scene.nodes];
    const primitives = [];
    while (nodelists.length > 0) {
        const nl = nodelists.pop();
        for (const nodeidx of nl) {
            const node = content.nodes[nodeidx];
            if (node.translation || node.scale || node.rotation || node.matrix) {
                console.warn(`unimplemented node transform; tr=${node.translation} scale=${node.scale} rot=${node.rotation} mat=${node.matrix}`);
            }
            // Missing: node transform
            if (node.mesh !== undefined) {
                const mesh = content.meshes[node.mesh];
                primitives.push(...mesh.primitives);
            }
            if (node.children !== undefined) {
                nodelists.push(node.children);
            }
        }
    }
    console.log(`Loading ${primitives.length} primitives...`);
    const vertices = [];
    const indices = [];
    let min = undefined;
    let max = undefined;
    for (const primitive of primitives) {
        if (primitive.mode && primitive.mode != GLTFPrimitiveMode.TRIANGLES) {
            throw new Error(`only triangles; got ${primitive.mode}`);
        }
        if (!content.accessors) {
            throw new Error("no accessors");
        }
        // Keep track of how many vertices already exists to re-number index
        // array.
        const verticesIndexStart = vertices.length;
        // Load vertices.
        const posAccIndex = primitive.attributes["POSITION"];
        const posAcc = content.accessors[posAccIndex];
        if (posAcc.type != GLTFAccessorType.VEC3) {
            throw new Error(`wrong type: ${posAcc.type}`);
        }
        if (posAcc.componentType != GLTFAccessorComponentType.F32) {
            throw new Error(`wrong component type ${posAcc.componentType}`);
        }
        if (posAcc.min) {
            const posMin = gl_matrix__WEBPACK_IMPORTED_MODULE_2__.fromValues(...posAcc.min);
            if (!min) {
                min = posMin;
            }
            else {
                min = gl_matrix__WEBPACK_IMPORTED_MODULE_2__.min(min, min, posMin);
            }
        }
        if (posAcc.max) {
            const posMax = gl_matrix__WEBPACK_IMPORTED_MODULE_2__.fromValues(...posAcc.max);
            if (!max) {
                max = posMax;
            }
            else {
                max = gl_matrix__WEBPACK_IMPORTED_MODULE_2__.max(max, max, posMax);
            }
        }
        if (!posAcc.min || !posAcc.max) {
            console.warn("missing min/max");
        }
        // accessorData return the full bufferView, not just specific accessorData.
        const posBufferView = await asset.accessorData(posAccIndex);
        const positions = new Float32Array(posBufferView.buffer, posBufferView.byteOffset + ((_a = posAcc.byteOffset) !== null && _a !== void 0 ? _a : 0), posAcc.count * 3);
        // Load normals, if avail.
        const normalsAccIndex = primitive.attributes["NORMAL"];
        let normals;
        if (normalsAccIndex !== undefined) {
            const normalsAcc = content.accessors[normalsAccIndex];
            if (normalsAcc.type != GLTFAccessorType.VEC3) {
                throw new Error(`wrong type: ${normalsAcc.type}`);
            }
            if (normalsAcc.componentType != GLTFAccessorComponentType.F32) {
                throw new Error(`wrong component type ${normalsAcc.componentType}`);
            }
            const normalsBufferView = await asset.accessorData(normalsAccIndex);
            normals = new Float32Array(normalsBufferView.buffer, normalsBufferView.byteOffset + ((_b = normalsAcc.byteOffset) !== null && _b !== void 0 ? _b : 0), normalsAcc.count * 3);
        }
        for (let i = 0; i < posAcc.count; i++) {
            let normal = [0, 0, 0, 0];
            if (normals) {
                normal = [normals[i * 3], normals[i * 3 + 1], normals[i * 3 + 2]];
            }
            vertices.push({
                pos: [positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]],
                color: [1, 0, 1, 1],
                normal: normal,
            });
        }
        // Load indices
        if (primitive.indices === undefined) {
            throw new Error("no indices");
        }
        const idxAccIndex = primitive.indices;
        const idxAcc = content.accessors[idxAccIndex];
        if (idxAcc.type != GLTFAccessorType.SCALAR) {
            throw new Error(`wrong type: ${idxAcc.type}`);
        }
        if (idxAcc.componentType != GLTFAccessorComponentType.U16) {
            throw new Error(`wrong component type ${idxAcc.componentType}`);
        }
        const indicesData = await asset.accessorData(idxAccIndex);
        const u16 = new Uint16Array(indicesData.buffer, indicesData.byteOffset, indicesData.byteLength / Uint16Array.BYTES_PER_ELEMENT);
        // Re-number indices as we're accumulating multiple vertices set.
        // Terribly inefficient.
        for (const idx of u16) {
            indices.push(idx + verticesIndexStart);
        }
    }
    console.log(`${vertices.length} vertices, ${indices.length} indices`);
    return {
        vertices,
        indices,
        min,
        max,
    };
}


/***/ }),

/***/ "./demos/shaderlib.ts":
/*!****************************!*\
  !*** ./demos/shaderlib.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "buildLineBundle": () => (/* binding */ buildLineBundle),
/* harmony export */   "cubeMeshStrip": () => (/* binding */ cubeMeshStrip),
/* harmony export */   "cubelines": () => (/* binding */ cubelines),
/* harmony export */   "ortholines": () => (/* binding */ ortholines),
/* harmony export */   "projection": () => (/* binding */ projection),
/* harmony export */   "rand": () => (/* binding */ rand),
/* harmony export */   "tr": () => (/* binding */ tr)
/* harmony export */ });
/* harmony import */ var _src__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src */ "./src/index.ts");

// Functions to calculate projection matrices.
const projection = new _src__WEBPACK_IMPORTED_MODULE_0__.WGSLModule({
    label: "projection matrices",
    code: _src__WEBPACK_IMPORTED_MODULE_0__.wgsl `
        fn @@perspective(aspect: f32) -> mat4x4<f32> {
            // Hard coded projection parameters - for more flexibility,
            // we could imagine getting them from the uniforms.
            let fovy = 2.0 * 3.14159 / 5.0; // Vertical field of view (rads)
            let near = 1.0;
            let far = 100.0;

            let f = 1.0 / tan(fovy / 2.0);
            let nf = 1.0 / (near - far);

            return mat4x4<f32>(
                f / aspect, 0.0, 0.0, 0.0,
                0.0, f, 0.0, 0.0,
                0.0, 0.0, (far + near) * nf, -1.0,
                0.0, 0.0, 2.0 * far * near * nf, 0.0,
            );
        }`,
});
// Functions for common transformations - translation, rotation.
const tr = new _src__WEBPACK_IMPORTED_MODULE_0__.WGSLModule({
    label: "transform matrices",
    code: _src__WEBPACK_IMPORTED_MODULE_0__.wgsl `
        fn @@translate(tr : vec3<f32>) -> mat4x4<f32> {
            return mat4x4<f32>(
                1.0, 0.0, 0.0, 0.0,
                0.0, 1.0, 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                tr.x, tr.y, tr.z, 1.0,
            );
        }

        fn @@scale(ratio: f32) -> mat4x4<f32> {
            return mat4x4<f32>(
                ratio, 0.0, 0.0, 0.0,
                0.0, ratio, 0.0, 0.0,
                0.0, 0.0, ratio, 0.0,
                0.0, 0.0, 0.0, 1.0,
            );
        }

        fn @@rotateX(rad: f32) -> mat4x4<f32> {
            let s = sin(rad);
            let c = cos(rad);
            return mat4x4<f32>(
                1.0, 0.0, 0.0, 0.0,
                0.0, c, s, 0.0,
                0.0, -s, c, 0.0,
                0.0, 0.0, 0.0, 1.0,
            );
        }

        fn @@rotateY(rad: f32) -> mat4x4<f32> {
            let s = sin(rad);
            let c = cos(rad);
            return mat4x4<f32>(
                c, 0.0, -s, 0.0,
                0.0, 1.0, 0.0, 0.0,
                s, 0.0, c, 0.0,
                0.0, 0.0, 0.0, 1.0,
            );
        }

        fn @@rotateZ(rad: f32) -> mat4x4<f32> {
            let s = sin(rad);
            let c = cos(rad);
            return mat4x4<f32>(
                c, s, 0.0, 0.0,
                -s, c, 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                0.0, 0.0, 0.0, 1.0,
            );
        }
        `,
});
// An hard coded list of vertex for a cube declared as triangle strip.
// Cube is between -1 and +1.
// https://stackoverflow.com/questions/28375338/cube-using-single-gl-triangle-strip
const cubeMeshStrip = new _src__WEBPACK_IMPORTED_MODULE_0__.WGSLModule({
    label: "mesh for a cube triangle strip",
    code: _src__WEBPACK_IMPORTED_MODULE_0__.wgsl `
        let @@mesh = array<vec3<f32>, 14>(
            vec3<f32>(1.f, 1.f, 1.f),     // Front-top-left
            vec3<f32>(-1.f, 1.f, 1.f),      // Front-top-right
            vec3<f32>(1.f, -1.f, 1.f),    // Front-bottom-left
            vec3<f32>(-1.f, -1.f, 1.f),     // Front-bottom-right
            vec3<f32>(-1.f, -1.f, -1.f),    // Back-bottom-right
            vec3<f32>(-1.f, 1.f, 1.f),      // Front-top-right
            vec3<f32>(-1.f, 1.f, -1.f),     // Back-top-right
            vec3<f32>(1.f, 1.f, 1.f),     // Front-top-left
            vec3<f32>(1.f, 1.f, -1.f),    // Back-top-left
            vec3<f32>(1.f, -1.f, 1.f),    // Front-bottom-left
            vec3<f32>(1.f, -1.f, -1.f),   // Back-bottom-left
            vec3<f32>(-1.f, -1.f, -1.f),    // Back-bottom-right
            vec3<f32>(1.f, 1.f, -1.f),    // Back-top-left
            vec3<f32>(-1.f, 1.f, -1.f),      // Back-top-right
        );
    `,
});
const rand = new _src__WEBPACK_IMPORTED_MODULE_0__.WGSLModule({
    label: "random functions",
    code: _src__WEBPACK_IMPORTED_MODULE_0__.wgsl `
        fn @@meh(a: f32, b: f32) -> f32 {
            return fract(sin(dot(vec2<f32>(a, b), vec2<f32>(12.9898,78.233)))*43758.5453123);
        }
    `,
});
// Prepare a bundle which will draw a bunch of lines.
function buildLineBundle(lineDesc) {
    var _a, _b, _c;
    const label = (_a = lineDesc.label) !== null && _a !== void 0 ? _a : "lines";
    // Count the number of lines.
    let lineCount = 0;
    for (const line of lineDesc.lines) {
        lineCount += line.length - 1;
    }
    const pointDesc = new _src__WEBPACK_IMPORTED_MODULE_0__.StructType({
        pos: { type: _src__WEBPACK_IMPORTED_MODULE_0__.Vec3f32, idx: 0 },
        color: { type: _src__WEBPACK_IMPORTED_MODULE_0__.Vec4f32, idx: 1 },
    });
    const arrayDesc = new _src__WEBPACK_IMPORTED_MODULE_0__.ArrayType(pointDesc, lineCount * 2);
    const vertexBuffer = lineDesc.device.createBuffer({
        label: `${label} - vertex buffer`,
        size: arrayDesc.byteSize(),
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE,
    });
    const a = new ArrayBuffer(arrayDesc.byteSize());
    const dv = new DataView(a);
    let offset = 0;
    for (const line of lineDesc.lines) {
        let prev = line[0];
        for (let i = 1; i < line.length; i++) {
            let next = line[i];
            pointDesc.dataViewSet(dv, offset, prev);
            offset += pointDesc.byteSize();
            pointDesc.dataViewSet(dv, offset, next);
            offset += pointDesc.byteSize();
            prev = next;
        }
    }
    lineDesc.device.queue.writeBuffer(vertexBuffer, 0, a);
    const shader = lineDesc.device.createShaderModule(new _src__WEBPACK_IMPORTED_MODULE_0__.WGSLModule({
        label: `${label} - render shader`,
        code: _src__WEBPACK_IMPORTED_MODULE_0__.wgsl `
            @group(0) @binding(0) var<uniform> uniforms : ${lineDesc.mod.typename()};

            struct Input {
                @location(0) pos: vec3<f32>,
                @location(1) color: vec4<f32>,
            }

            struct VertexOutput {
                @builtin(position) pos: vec4<f32>,
                @location(0) color: vec4<f32>,
            };

            @stage(vertex)
            fn vertex(inp: Input) -> VertexOutput {
                var out : VertexOutput;
                out.pos = uniforms.camera * vec4<f32>(inp.pos, 1.0);
                out.color = inp.color;
                return out;
            }

            @stage(fragment)
            fn fragment(@location(0) color : vec4<f32>) -> @location(0) vec4<f32> {
                return color;
            }
        `,
    }).toDesc());
    const pipeline = lineDesc.device.createRenderPipeline({
        label: `${label} - pipeline`,
        layout: lineDesc.device.createPipelineLayout({
            label: `${label} - pipeline layouts`,
            bindGroupLayouts: [lineDesc.device.createBindGroupLayout({
                    label: `${label} - main layout`,
                    entries: [
                        {
                            binding: 0,
                            visibility: GPUShaderStage.VERTEX,
                            buffer: { type: "uniform" },
                        },
                    ]
                })],
        }),
        vertex: {
            buffers: [{
                    arrayStride: pointDesc.stride(),
                    attributes: [
                        { shaderLocation: 0, format: "float32x3", offset: 0, },
                        { shaderLocation: 1, format: "float32x4", offset: 16, },
                    ],
                }],
            entryPoint: 'vertex',
            module: shader,
        },
        primitive: {
            topology: 'line-list',
        },
        depthStencil: lineDesc.depthFormat ? {
            depthWriteEnabled: false,
            depthCompare: (_b = lineDesc.depthCompare) !== null && _b !== void 0 ? _b : 'always',
            format: lineDesc.depthFormat,
        } : undefined,
        fragment: {
            entryPoint: "fragment",
            module: shader,
            targets: [{ format: lineDesc.colorFormat }],
        },
    });
    const bindGroup = lineDesc.device.createBindGroup({
        label: `${label} - bindgroup`,
        layout: pipeline.getBindGroupLayout(0),
        entries: [
            { binding: 0, resource: { buffer: lineDesc.buffer } },
        ]
    });
    const bundleEncoder = lineDesc.device.createRenderBundleEncoder({
        label: label,
        depthReadOnly: true,
        stencilReadOnly: true,
        colorFormats: [lineDesc.colorFormat],
        depthStencilFormat: (_c = lineDesc.depthFormat) !== null && _c !== void 0 ? _c : undefined,
    });
    bundleEncoder.pushDebugGroup(`${label} - building bundle`);
    bundleEncoder.setVertexBuffer(0, vertexBuffer);
    bundleEncoder.setPipeline(pipeline);
    bundleEncoder.setBindGroup(0, bindGroup);
    bundleEncoder.draw(lineCount * 2, 1, 0, 0);
    bundleEncoder.popDebugGroup();
    return bundleEncoder.finish();
}
// Lines for indicating the orthonormal reference.
const ortholines = [
    [{ pos: [0, 0, 0], color: [1, 0, 0, 1] }, { pos: [1, 0, 0], color: [1, 0, 0, 1] }],
    [{ pos: [0, 0, 0], color: [0, 1, 0, 1] }, { pos: [0, 1, 0], color: [0, 1, 0, 1] }],
    [{ pos: [0, 0, 0], color: [0, 0, 1, 1] }, { pos: [0, 0, 1], color: [0, 0, 1, 1] }],
];
// Lines for a cube centered in 0 and going [-s, +s].
function cubelines(s) {
    return [
        [
            { pos: [-s, -s, -s], color: [1, 1, 1, 1] },
            { pos: [s, -s, -s], color: [1, 1, 1, 1] },
            { pos: [s, s, -s], color: [1, 1, 1, 1] },
            { pos: [-s, s, -s], color: [1, 1, 1, 1] },
            { pos: [-s, -s, -s], color: [1, 1, 1, 1] },
        ],
        [
            { pos: [-s, -s, s], color: [1, 1, 1, 1] },
            { pos: [s, -s, s], color: [1, 1, 1, 1] },
            { pos: [s, s, s], color: [1, 1, 1, 1] },
            { pos: [-s, s, s], color: [1, 1, 1, 1] },
            { pos: [-s, -s, s], color: [1, 1, 1, 1] },
        ],
        [
            { pos: [-s, -s, -s], color: [1, 1, 1, 1] },
            { pos: [-s, -s, s], color: [1, 1, 1, 1] },
        ],
        [
            { pos: [s, -s, -s], color: [1, 1, 1, 1] },
            { pos: [s, -s, s], color: [1, 1, 1, 1] },
        ],
        [
            { pos: [s, s, -s], color: [1, 1, 1, 1] },
            { pos: [s, s, s], color: [1, 1, 1, 1] },
        ],
        [
            { pos: [-s, s, -s], color: [1, 1, 1, 1] },
            { pos: [-s, s, s], color: [1, 1, 1, 1] },
        ],
    ];
}


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ArrayType": () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_0__.ArrayType),
/* harmony export */   "F32": () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_0__.F32),
/* harmony export */   "Mat4x4F32": () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_0__.Mat4x4F32),
/* harmony export */   "StructType": () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_0__.StructType),
/* harmony export */   "U16": () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_0__.U16),
/* harmony export */   "U32": () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_0__.U32),
/* harmony export */   "Vec3f32": () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_0__.Vec3f32),
/* harmony export */   "Vec4f32": () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_0__.Vec4f32),
/* harmony export */   "WGSLModule": () => (/* reexport safe */ _lang__WEBPACK_IMPORTED_MODULE_1__.WGSLModule),
/* harmony export */   "lang": () => (/* reexport module object */ _lang__WEBPACK_IMPORTED_MODULE_1__),
/* harmony export */   "types": () => (/* reexport module object */ _types__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   "wgsl": () => (/* reexport safe */ _lang__WEBPACK_IMPORTED_MODULE_1__.wgsl)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./src/types.ts");
/* harmony import */ var _lang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lang */ "./src/lang.ts");
// A WebGPU helper libraries. For now, providers:
//   - WGSLModule: A way to import / manage a library of reusable WGSL code.
//   - A way to manage mapping between Javascript types and WGSL types, for
//     simple buffer translation.






/***/ }),

/***/ "./src/lang.ts":
/*!*********************!*\
  !*** ./src/lang.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WGSLCode": () => (/* binding */ WGSLCode),
/* harmony export */   "WGSLModule": () => (/* binding */ WGSLModule),
/* harmony export */   "WGSLName": () => (/* binding */ WGSLName),
/* harmony export */   "WGSLRef": () => (/* binding */ WGSLRef),
/* harmony export */   "wgsl": () => (/* binding */ wgsl)
/* harmony export */ });
// The following providing a kind of WGSL import system.
/// <reference types="@webgpu/types" />
class WGSLModule {
    constructor(cfg) {
        var _a;
        this.imports = [];
        this.symbols = new Set();
        if (cfg.imports) {
            this.imports.push(...cfg.imports);
        }
        this.label = (_a = cfg.label) !== null && _a !== void 0 ? _a : "<unnamed>";
        this.code = cfg.code;
        for (const token of this.code.tokens) {
            if (token instanceof WGSLName) {
                if (this.symbols.has(token.name)) {
                    throw new Error("duplicate symbol");
                }
                this.symbols.add(token.name);
            }
            else if (token instanceof WGSLRef) {
                if (!token.mod.symbols.has(token.name)) {
                    throw new Error(`reference to unknown symbol "${token.name}" in module "${token.mod.label}" from module "${this.label}"`);
                }
                this.imports.push(token.mod);
            }
        }
    }
    // Create a reference to a symbol this module "exports".
    ref(name) {
        return new WGSLRef(this, name);
    }
    importOrder() {
        const ordered = [];
        const imported = new Set();
        const next = (mod, seen) => {
            seen.add(mod);
            for (const imp of mod.imports) {
                if (seen.has(imp)) {
                    throw new Error("import cycle");
                }
                if (!imported.has(imp)) {
                    next(imp, seen);
                }
            }
            imported.add(mod);
            ordered.push(mod);
            seen.delete(mod);
        };
        next(this, new Set());
        return ordered;
    }
    // Create a text representation of the code of this module only.
    render(imports) {
        const prefix = imports.get(this);
        if (prefix === undefined) {
            throw new Error(`internal: module "${this.label}" is imported but has no prefix`);
        }
        let s = '';
        for (const token of this.code.tokens) {
            if (token instanceof WGSLName) {
                s += prefix + token.name;
            }
            else if (token instanceof WGSLRef) {
                const refPrefix = imports.get(token.mod);
                if (refPrefix === undefined) {
                    throw new Error("module not found");
                }
                s += refPrefix + token.name;
            }
            else {
                s += token;
            }
        }
        s = stripExtraIndent(s);
        s = `\n// -------- Module: ${this.label} --------\n` + s;
        return s;
    }
    // Render the code of this module with all its dependencies.
    generate() {
        const mods = this.importOrder();
        const imports = new Map();
        for (const [idx, mod] of mods.entries()) {
            imports.set(mod, `m${idx}_`);
        }
        const textMods = [];
        for (const mod of mods) {
            textMods.push(mod.render(imports));
        }
        const s = textMods.join("\n");
        console.groupCollapsed(`Generated shader code "${this.label}"`);
        console.log(s);
        console.groupEnd();
        return textMods.join("\n");
    }
    toDesc() {
        return {
            label: this.label,
            code: this.generate(),
            // sourceMap
            // hint
        };
    }
}
class WGSLName {
    constructor(name) {
        this.name = name;
    }
}
class WGSLRef {
    constructor(mod, name) {
        this.mod = mod;
        this.name = name;
    }
}
// WGSLCode holds a snippet of code, without parsing.
// This is used to allow mixing actual text representation of WGSL but also
// Javascript references to other module - that are interpretated differently
// when "rendering" the WGSL code.
class WGSLCode {
    constructor(tokens) {
        this.tokens = [...tokens];
    }
}
// Declare WGSLCode using template strings.
function wgsl(strings, ...keys) {
    const tokens = [...wgslSplit(strings[0])];
    for (let i = 1; i < strings.length; i++) {
        const token = keys[i - 1];
        if (Array.isArray(token)) {
            for (const subtoken of token) {
                tokens.push(...subtoken.tokens);
            }
        }
        else if (token instanceof WGSLCode) {
            tokens.push(...token.tokens);
        }
        else if (typeof token === "string") {
            tokens.push(...wgslSplit(token));
        }
        else {
            tokens.push(token);
        }
        tokens.push(...wgslSplit(strings[i]));
    }
    return new WGSLCode(tokens);
}
// https://gpuweb.github.io/gpuweb/wgsl/#identifiers
const markersRE = /@@(([a-zA-Z_][0-9a-zA-Z][0-9a-zA-Z_]*)|([a-zA-Z][0-9a-zA-Z_]*))/g;
// Split the content of a string containing WGSL code to extract all identifiers
// prefixed with @@. Those identifiers can then be replaced as needed within the
// module rendering.
function wgslSplit(s) {
    const tokens = [];
    let prevIndex = 0;
    for (const m of s.matchAll(markersRE)) {
        if (m.index === undefined) {
            throw new Error("oops");
        }
        if (m.index > prevIndex) {
            tokens.push(s.slice(prevIndex, m.index));
        }
        prevIndex = m.index + m[0].length;
        tokens.push(new WGSLName(m[1]));
    }
    if (prevIndex < s.length) {
        tokens.push(s.slice(prevIndex, s.length));
    }
    return tokens;
}
// Find if there is a common indentation on all lines (spaces, tabs) and remove
// it.
// Lines with only spaces and tabs are ignored.
// Also removes trailing spaces.
function stripExtraIndent(s) {
    const lines = s.split("\n");
    let prefix = null;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trimEnd();
        lines[i] = line;
        if (line.length > 0) {
            if (prefix === null) {
                prefix = line.match(/^[ \t]*/)[0];
            }
            else {
                let idx = 0;
                while (idx < prefix.length && idx < line.length && line[idx] == prefix[idx]) {
                    idx++;
                }
                prefix = prefix.slice(0, idx);
            }
        }
    }
    if (prefix !== null) {
        for (let i = 0; i < lines.length; i++) {
            if (lines.length == 0) {
                continue;
            }
            lines[i] = lines[i].slice(prefix.length);
        }
    }
    return lines.join("\n");
}
function testWGSLModules() {
    console.group("testWGSL");
    console.log("tagged template 1", wgsl ``);
    console.log("tagged template 2", wgsl `a`);
    console.log("tagged template 3", wgsl `${"plop"}`);
    console.log("tagged template 4", wgsl `foo @@bar plop`);
    const testModule1 = new WGSLModule({
        label: "test1",
        code: wgsl `
            foo
            coin @@bar plop
        `,
    });
    const testModule2 = new WGSLModule({
        label: "test2",
        code: wgsl `
            foo ${testModule1.ref("bar")}
        `,
    });
    console.log("render1", testModule2.toDesc().code);
    console.groupEnd();
}


/***/ }),

/***/ "./src/types.ts":
/*!**********************!*\
  !*** ./src/types.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ArrayType": () => (/* binding */ ArrayType),
/* harmony export */   "F32": () => (/* binding */ F32),
/* harmony export */   "Mat4x4F32": () => (/* binding */ Mat4x4F32),
/* harmony export */   "StructType": () => (/* binding */ StructType),
/* harmony export */   "U16": () => (/* binding */ U16),
/* harmony export */   "U32": () => (/* binding */ U32),
/* harmony export */   "Vec3f32": () => (/* binding */ Vec3f32),
/* harmony export */   "Vec3f32Type": () => (/* binding */ Vec3f32Type),
/* harmony export */   "Vec4f32": () => (/* binding */ Vec4f32),
/* harmony export */   "Vec4f32Type": () => (/* binding */ Vec4f32Type)
/* harmony export */ });
/* harmony import */ var _lang__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lang */ "./src/lang.ts");
// The following contains an attempt at making it easier to manipulate basic
// uniforms - i.e., maintaing a buffer content with structured data from
// Javascript.
// It is a bit overcomplicated in order to keep typing work.

const wgsl = _lang__WEBPACK_IMPORTED_MODULE_0__.wgsl;
// Basic class to represent info about a given WGSL type. The template parameter
// is the type of the value it maps to in javascript.
class WGSLType {
    // Return the stride of this type when used in an array.
    stride() {
        return this.alignOf() * Math.ceil(this.byteSize() / this.alignOf());
    }
    // Return the GPUVertexFormat associated to this type.
    // If no vertex format exists, throw an exception.
    vertexFormat() {
        throw new Error("type with no vertex format");
    }
    // Return the list of GPUVertexAttribute for this type, suitable for a
    // GPUVertexFormat. Can throw an error if that type does not support being
    // used as vertex attribute.
    // By default, just use the vertexFormat of this type.
    vertexAttributes() {
        return [{
                shaderLocation: 0,
                offset: 0,
                format: this.vertexFormat(),
            }];
    }
    // Create a javascript Array read to be sent to the GPU with the provided
    // content.
    createArray(values) {
        const a = new ArrayBuffer(this.byteSize());
        this.dataViewSet(new DataView(a), 0, values);
        return a;
    }
}
// Info about WGSL `f32` type.
class F32Type extends WGSLType {
    byteSize() { return 4; }
    alignOf() { return 4; }
    dataViewSet(dv, offset, v) {
        dv.setFloat32(offset, v, true);
    }
    typename() {
        return wgsl `f32`;
    }
}
const F32 = new F32Type();
// Info about WGSL `u16` type.
// This is not a real type in WGSL, but it can be used to map
// vertex indices.
class U16Type extends WGSLType {
    byteSize() { return 2; }
    alignOf() { return 2; }
    dataViewSet(dv, offset, v) {
        dv.setUint16(offset, v, true);
    }
    typename() {
        return wgsl `u16`;
    }
}
const U16 = new U16Type();
// Info about WGSL `u32` type.
class U32Type extends WGSLType {
    byteSize() { return 4; }
    alignOf() { return 4; }
    dataViewSet(dv, offset, v) {
        dv.setUint32(offset, v, true);
    }
    typename() {
        return wgsl `u32`;
    }
}
const U32 = new U32Type();
// Info about WGSL `vec3<f32>` type.
class Vec3f32Type extends WGSLType {
    byteSize() { return 12; }
    alignOf() { return 16; }
    dataViewSet(dv, offset, v) {
        dv.setFloat32(offset, v[0], true);
        dv.setFloat32(offset + F32.byteSize(), v[1], true);
        dv.setFloat32(offset + 2 * F32.byteSize(), v[2], true);
    }
    typename() {
        return wgsl `vec3<f32>`;
    }
    vertexFormat() {
        return "float32x3";
    }
}
const Vec3f32 = new Vec3f32Type();
// Info about WGSL `vec4<f32>` type.
class Vec4f32Type extends WGSLType {
    byteSize() { return 16; }
    alignOf() { return 16; }
    dataViewSet(dv, offset, v) {
        dv.setFloat32(offset, v[0], true);
        dv.setFloat32(offset + F32.byteSize(), v[1], true);
        dv.setFloat32(offset + 2 * F32.byteSize(), v[2], true);
        dv.setFloat32(offset + 3 * F32.byteSize(), v[3], true);
    }
    typename() {
        return wgsl `vec4<f32>`;
    }
    vertexFormat() {
        return "float32x4";
    }
}
const Vec4f32 = new Vec4f32Type();
// mat4x4<f32> WGSL type.
class Mat4x4F32Type extends WGSLType {
    byteSize() { return 64; }
    alignOf() { return 16; }
    dataViewSet(dv, offset, v) {
        for (let i = 0; i < 16; i++) {
            dv.setFloat32(offset, v[i], true);
            offset += F32.byteSize();
        }
    }
    typename() {
        return wgsl `mat4x4<f32>`;
    }
}
const Mat4x4F32 = new Mat4x4F32Type();
// A WGSL array containing type T.
class ArrayType extends WGSLType {
    constructor(etype, count) {
        super();
        this.etype = etype;
        this.count = count;
    }
    byteSize() { return this.count * this.etype.stride(); }
    alignOf() { return this.etype.alignOf(); }
    dataViewSet(dv, offset, v) {
        for (let i = 0; i < this.count; i++) {
            this.etype.dataViewSet(dv, offset, v[i]);
            offset += this.etype.stride();
        }
    }
    typename() {
        return wgsl `array<${this.etype.typename()}, ${this.count.toString()}>`;
    }
    // Creates a vertex buffer layout matching this array, suitable for a
    // createRenderPipeline call.
    vertexBufferLayout() {
        return {
            arrayStride: this.stride(),
            attributes: this.etype.vertexAttributes(),
        };
    }
}
// Description of a WGSL struct allowing mapping between javascript and WGSL.
// An instance of a StructType describes just the layout of the struct:
//  - The MemberDescMap (aka MDM) describes the list of members - name, position in
//    the struct.
//  - StructJSType<StructType<MDM>> describes javascript object, which member
//    names are the same as the struct. The type of the value are the typescript
//    types corresponding to the WGSL values - e.g., a `f32` is mapped to a number.
class StructType extends WGSLType {
    constructor(membersdesc) {
        super();
        this.members = {};
        this.byIndex = [];
        if (Object.keys(membersdesc).length < 1) {
            // Not sure if empty struct are valid in WGSL - in the mean time,
            // reject.
            throw new Error("struct must have at least one member");
        }
        for (const [name, memberdesc] of Object.entries(membersdesc)) {
            if (this.byIndex[memberdesc.idx]) {
                throw new Error(`member index ${memberdesc.idx} is duplicated`);
            }
            const member = {
                name,
                idx: memberdesc.idx,
                type: memberdesc.type,
                // No support for @size & @align attributes for now.
                sizeOf: memberdesc.type.byteSize(),
                alignOf: memberdesc.type.alignOf(),
                // Calculated below
                offset: 0,
            };
            this.members[name] = member;
            this.byIndex[memberdesc.idx] = member;
        }
        // Struct offsets, size and aligns are non-trivial - see
        // https://gpuweb.github.io/gpuweb/wgsl/#structure-member-layout
        this._byteSize = 0;
        this._alignOf = 0;
        for (const [idx, member] of this.byIndex.entries()) {
            if (!member) {
                throw new Error(`missing member index ${idx}`);
            }
            if (idx > 0) {
                const prev = this.byIndex[idx - 1];
                member.offset = member.alignOf * Math.ceil((prev.offset + prev.sizeOf) / member.alignOf);
            }
            this._alignOf = Math.max(this._alignOf, member.alignOf);
        }
        const last = this.byIndex[this.byIndex.length - 1];
        this._byteSize = this._alignOf * Math.ceil((last.offset + last.sizeOf) / this._alignOf);
    }
    byteSize() { return this._byteSize; }
    alignOf() { return this._alignOf; }
    // Take an object containg the value for each member, and write it
    // in the provided data view.
    dataViewSet(dv, offset, v) {
        for (const member of this.byIndex) {
            member.type.dataViewSet(dv, offset + member.offset, v[member.name]);
        }
    }
    // Refer to that structure type in a WGSL fragment. It will take care of
    // creating a name and inserting the struct declaration as needed.
    typename() {
        if (!this.typemod) {
            this.typemod = this.genModule("buffer struct", false);
        }
        return wgsl `${new _lang__WEBPACK_IMPORTED_MODULE_0__.WGSLRef(this.typemod, "structname")}`;
    }
    // Refer to that structure in a WGSL fragment. Similar to typename(), but it
    // will als insert the appropriate `location` info, making it suitable to
    // use for vertex buffer representation.
    // Location is mapped to the index of the fields.
    vertexType() {
        if (!this.vertexmod) {
            this.vertexmod = this.genModule("vertex struct", true);
        }
        return wgsl `${new _lang__WEBPACK_IMPORTED_MODULE_0__.WGSLRef(this.vertexmod, "structname")}`;
    }
    genModule(label, locations) {
        const lines = [
            wgsl `// sizeOf: ${this.byteSize().toString()} ; alignOf: ${this.alignOf().toString()}\n`,
            wgsl `struct @@structname {\n`,
        ];
        for (const member of this.byIndex) {
            lines.push(wgsl `  // offset: ${member.offset.toString()} sizeOf: ${member.sizeOf.toString()} ; alignOf: ${member.alignOf.toString()}\n`);
            let location = "";
            if (locations) {
                location = `@location(${member.idx}) `;
            }
            lines.push(wgsl `  ${location}${member.name}: ${member.type.typename()},\n`);
        }
        lines.push(wgsl `};\n`);
        return new _lang__WEBPACK_IMPORTED_MODULE_0__.WGSLModule({
            label: label,
            code: wgsl `${lines}`,
        });
    }
    // Return a list of vertex attribute, suitable for a GPUVertexBufferLayout.
    // Location is mapped to the index of the fields.
    vertexAttributes() {
        const attrs = [];
        for (const m of this.byIndex) {
            attrs.push({
                shaderLocation: m.idx,
                format: m.type.vertexFormat(),
                offset: m.offset,
            });
        }
        return attrs;
    }
    // Creates a vertex buffer layout for this struct, suitable for a
    // createRenderPipeline call. This assume that this struct will be layed out
    // in a simple array to represent the vertex buffer.
    vertexBufferLayout() {
        return {
            arrayStride: this.stride(),
            attributes: this.vertexAttributes(),
        };
    }
}
//-----------------------------------------------
// Basic test
function testBuffer() {
    console.group("testBuffer");
    const uniformsDesc = new StructType({
        elapsedMs: { type: F32, idx: 0 },
        renderWidth: { type: F32, idx: 1 },
        renderHeight: { type: F32, idx: 2 },
        plop: { type: new ArrayType(F32, 4), idx: 3 },
    });
    console.log("byteSize", uniformsDesc.byteSize);
    console.log("content", uniformsDesc.createArray({
        elapsedMs: 10,
        renderWidth: 320,
        renderHeight: 200,
        plop: [1, 2, 3],
    }));
    const foo = new ArrayType(uniformsDesc, 4);
    const a = new ArrayBuffer(foo.byteSize());
    foo.dataViewSet(new DataView(a), 0, [
        { elapsedMs: 10, renderWidth: 320, renderHeight: 200, plop: [0, 1, 3] },
    ]);
    console.groupEnd();
}
// testBuffer();


/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/css-tag.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/css-tag.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CSSResult": () => (/* binding */ CSSResult),
/* harmony export */   "adoptStyles": () => (/* binding */ adoptStyles),
/* harmony export */   "css": () => (/* binding */ css),
/* harmony export */   "getCompatibleStyle": () => (/* binding */ getCompatibleStyle),
/* harmony export */   "supportsAdoptingStyleSheets": () => (/* binding */ supportsAdoptingStyleSheets),
/* harmony export */   "unsafeCSS": () => (/* binding */ unsafeCSS)
/* harmony export */ });
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * Whether the current browser supports `adoptedStyleSheets`.
 */
const supportsAdoptingStyleSheets = window.ShadowRoot &&
    (window.ShadyCSS === undefined || window.ShadyCSS.nativeShadow) &&
    'adoptedStyleSheets' in Document.prototype &&
    'replace' in CSSStyleSheet.prototype;
const constructionToken = Symbol();
const styleSheetCache = new Map();
/**
 * A container for a string of CSS text, that may be used to create a CSSStyleSheet.
 *
 * CSSResult is the return value of `css`-tagged template literals and
 * `unsafeCSS()`. In order to ensure that CSSResults are only created via the
 * `css` tag and `unsafeCSS()`, CSSResult cannot be constructed directly.
 */
class CSSResult {
    constructor(cssText, safeToken) {
        // This property needs to remain unminified.
        this['_$cssResult$'] = true;
        if (safeToken !== constructionToken) {
            throw new Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
        }
        this.cssText = cssText;
    }
    // Note, this is a getter so that it's lazy. In practice, this means
    // stylesheets are not created until the first element instance is made.
    get styleSheet() {
        // Note, if `supportsAdoptingStyleSheets` is true then we assume
        // CSSStyleSheet is constructable.
        let styleSheet = styleSheetCache.get(this.cssText);
        if (supportsAdoptingStyleSheets && styleSheet === undefined) {
            styleSheetCache.set(this.cssText, (styleSheet = new CSSStyleSheet()));
            styleSheet.replaceSync(this.cssText);
        }
        return styleSheet;
    }
    toString() {
        return this.cssText;
    }
}
const textFromCSSResult = (value) => {
    // This property needs to remain unminified.
    if (value['_$cssResult$'] === true) {
        return value.cssText;
    }
    else if (typeof value === 'number') {
        return value;
    }
    else {
        throw new Error(`Value passed to 'css' function must be a 'css' function result: ` +
            `${value}. Use 'unsafeCSS' to pass non-literal values, but take care ` +
            `to ensure page security.`);
    }
};
/**
 * Wrap a value for interpolation in a {@linkcode css} tagged template literal.
 *
 * This is unsafe because untrusted CSS text can be used to phone home
 * or exfiltrate data to an attacker controlled site. Take care to only use
 * this with trusted input.
 */
const unsafeCSS = (value) => new CSSResult(typeof value === 'string' ? value : String(value), constructionToken);
/**
 * A template literal tag which can be used with LitElement's
 * {@linkcode LitElement.styles} property to set element styles.
 *
 * For security reasons, only literal string values and number may be used in
 * embedded expressions. To incorporate non-literal values {@linkcode unsafeCSS}
 * may be used inside an expression.
 */
const css = (strings, ...values) => {
    const cssText = strings.length === 1
        ? strings[0]
        : values.reduce((acc, v, idx) => acc + textFromCSSResult(v) + strings[idx + 1], strings[0]);
    return new CSSResult(cssText, constructionToken);
};
/**
 * Applies the given styles to a `shadowRoot`. When Shadow DOM is
 * available but `adoptedStyleSheets` is not, styles are appended to the
 * `shadowRoot` to [mimic spec behavior](https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets).
 * Note, when shimming is used, any styles that are subsequently placed into
 * the shadowRoot should be placed *before* any shimmed adopted styles. This
 * will match spec behavior that gives adopted sheets precedence over styles in
 * shadowRoot.
 */
const adoptStyles = (renderRoot, styles) => {
    if (supportsAdoptingStyleSheets) {
        renderRoot.adoptedStyleSheets = styles.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
    }
    else {
        styles.forEach((s) => {
            const style = document.createElement('style');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const nonce = window['litNonce'];
            if (nonce !== undefined) {
                style.setAttribute('nonce', nonce);
            }
            style.textContent = s.cssText;
            renderRoot.appendChild(style);
        });
    }
};
const cssResultFromStyleSheet = (sheet) => {
    let cssText = '';
    for (const rule of sheet.cssRules) {
        cssText += rule.cssText;
    }
    return unsafeCSS(cssText);
};
const getCompatibleStyle = supportsAdoptingStyleSheets
    ? (s) => s
    : (s) => s instanceof CSSStyleSheet ? cssResultFromStyleSheet(s) : s;
//# sourceMappingURL=css-tag.js.map

/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/decorators/base.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/decorators/base.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "decorateProperty": () => (/* binding */ decorateProperty),
/* harmony export */   "legacyPrototypeMethod": () => (/* binding */ legacyPrototypeMethod),
/* harmony export */   "standardPrototypeMethod": () => (/* binding */ standardPrototypeMethod)
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const legacyPrototypeMethod = (descriptor, proto, name) => {
    Object.defineProperty(proto, name, descriptor);
};
const standardPrototypeMethod = (descriptor, element) => ({
    kind: 'method',
    placement: 'prototype',
    key: element.key,
    descriptor,
});
/**
 * Helper for decorating a property that is compatible with both TypeScript
 * and Babel decorators. The optional `finisher` can be used to perform work on
 * the class. The optional `descriptor` should return a PropertyDescriptor
 * to install for the given property.
 *
 * @param finisher {function} Optional finisher method; receives the element
 * constructor and property key as arguments and has no return value.
 * @param descriptor {function} Optional descriptor method; receives the
 * property key as an argument and returns a property descriptor to define for
 * the given property.
 * @returns {ClassElement|void}
 */
const decorateProperty = ({ finisher, descriptor, }) => (protoOrDescriptor, name
// Note TypeScript requires the return type to be `void|any`
// eslint-disable-next-line @typescript-eslint/no-explicit-any
) => {
    var _a;
    // TypeScript / Babel legacy mode
    if (name !== undefined) {
        const ctor = protoOrDescriptor
            .constructor;
        if (descriptor !== undefined) {
            Object.defineProperty(protoOrDescriptor, name, descriptor(name));
        }
        finisher === null || finisher === void 0 ? void 0 : finisher(ctor, name);
        // Babel standard mode
    }
    else {
        // Note, the @property decorator saves `key` as `originalKey`
        // so try to use it here.
        const key = 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (_a = protoOrDescriptor.originalKey) !== null && _a !== void 0 ? _a : protoOrDescriptor.key;
        const info = descriptor != undefined
            ? {
                kind: 'method',
                placement: 'prototype',
                key,
                descriptor: descriptor(protoOrDescriptor.key),
            }
            : { ...protoOrDescriptor, key };
        if (finisher != undefined) {
            info.finisher = function (ctor) {
                finisher(ctor, key);
            };
        }
        return info;
    }
};
//# sourceMappingURL=base.js.map

/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/decorators/custom-element.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/decorators/custom-element.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "customElement": () => (/* binding */ customElement)
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const legacyCustomElement = (tagName, clazz) => {
    window.customElements.define(tagName, clazz);
    // Cast as any because TS doesn't recognize the return type as being a
    // subtype of the decorated class when clazz is typed as
    // `Constructor<HTMLElement>` for some reason.
    // `Constructor<HTMLElement>` is helpful to make sure the decorator is
    // applied to elements however.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return clazz;
};
const standardCustomElement = (tagName, descriptor) => {
    const { kind, elements } = descriptor;
    return {
        kind,
        elements,
        // This callback is called once the class is otherwise fully defined
        finisher(clazz) {
            window.customElements.define(tagName, clazz);
        },
    };
};
/**
 * Class decorator factory that defines the decorated class as a custom element.
 *
 * ```js
 * @customElement('my-element')
 * class MyElement extends LitElement {
 *   render() {
 *     return html``;
 *   }
 * }
 * ```
 * @category Decorator
 * @param tagName The tag name of the custom element to define.
 */
const customElement = (tagName) => (classOrDescriptor) => typeof classOrDescriptor === 'function'
    ? legacyCustomElement(tagName, classOrDescriptor)
    : standardCustomElement(tagName, classOrDescriptor);
//# sourceMappingURL=custom-element.js.map

/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/decorators/event-options.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/decorators/event-options.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "eventOptions": () => (/* binding */ eventOptions)
/* harmony export */ });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base.js */ "./node_modules/@lit/reactive-element/development/decorators/base.js");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * Adds event listener options to a method used as an event listener in a
 * lit-html template.
 *
 * @param options An object that specifies event listener options as accepted by
 * `EventTarget#addEventListener` and `EventTarget#removeEventListener`.
 *
 * Current browsers support the `capture`, `passive`, and `once` options. See:
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters
 *
 * ```ts
 * class MyElement {
 *   clicked = false;
 *
 *   render() {
 *     return html`
 *       <div @click=${this._onClick}>
 *         <button></button>
 *       </div>
 *     `;
 *   }
 *
 *   @eventOptions({capture: true})
 *   _onClick(e) {
 *     this.clicked = true;
 *   }
 * }
 * ```
 * @category Decorator
 */
function eventOptions(options) {
    return (0,_base_js__WEBPACK_IMPORTED_MODULE_0__.decorateProperty)({
        finisher: (ctor, name) => {
            Object.assign(ctor.prototype[name], options);
        },
    });
}
//# sourceMappingURL=event-options.js.map

/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/decorators/property.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/decorators/property.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "property": () => (/* binding */ property)
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const standardProperty = (options, element) => {
    // When decorating an accessor, pass it through and add property metadata.
    // Note, the `hasOwnProperty` check in `createProperty` ensures we don't
    // stomp over the user's accessor.
    if (element.kind === 'method' &&
        element.descriptor &&
        !('value' in element.descriptor)) {
        return {
            ...element,
            finisher(clazz) {
                clazz.createProperty(element.key, options);
            },
        };
    }
    else {
        // createProperty() takes care of defining the property, but we still
        // must return some kind of descriptor, so return a descriptor for an
        // unused prototype field. The finisher calls createProperty().
        return {
            kind: 'field',
            key: Symbol(),
            placement: 'own',
            descriptor: {},
            // store the original key so subsequent decorators have access to it.
            originalKey: element.key,
            // When @babel/plugin-proposal-decorators implements initializers,
            // do this instead of the initializer below. See:
            // https://github.com/babel/babel/issues/9260 extras: [
            //   {
            //     kind: 'initializer',
            //     placement: 'own',
            //     initializer: descriptor.initializer,
            //   }
            // ],
            initializer() {
                if (typeof element.initializer === 'function') {
                    this[element.key] = element.initializer.call(this);
                }
            },
            finisher(clazz) {
                clazz.createProperty(element.key, options);
            },
        };
    }
};
const legacyProperty = (options, proto, name) => {
    proto.constructor.createProperty(name, options);
};
/**
 * A property decorator which creates a reactive property that reflects a
 * corresponding attribute value. When a decorated property is set
 * the element will update and render. A {@linkcode PropertyDeclaration} may
 * optionally be supplied to configure property features.
 *
 * This decorator should only be used for public fields. As public fields,
 * properties should be considered as primarily settable by element users,
 * either via attribute or the property itself.
 *
 * Generally, properties that are changed by the element should be private or
 * protected fields and should use the {@linkcode state} decorator.
 *
 * However, sometimes element code does need to set a public property. This
 * should typically only be done in response to user interaction, and an event
 * should be fired informing the user; for example, a checkbox sets its
 * `checked` property when clicked and fires a `changed` event. Mutating public
 * properties should typically not be done for non-primitive (object or array)
 * properties. In other cases when an element needs to manage state, a private
 * property decorated via the {@linkcode state} decorator should be used. When
 * needed, state properties can be initialized via public properties to
 * facilitate complex interactions.
 *
 * ```ts
 * class MyElement {
 *   @property({ type: Boolean })
 *   clicked = false;
 * }
 * ```
 * @category Decorator
 * @ExportDecoratedItems
 */
function property(options) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (protoOrDescriptor, name) => name !== undefined
        ? legacyProperty(options, protoOrDescriptor, name)
        : standardProperty(options, protoOrDescriptor);
}
//# sourceMappingURL=property.js.map

/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/decorators/query-all.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/decorators/query-all.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "queryAll": () => (/* binding */ queryAll)
/* harmony export */ });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base.js */ "./node_modules/@lit/reactive-element/development/decorators/base.js");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * A property decorator that converts a class property into a getter
 * that executes a querySelectorAll on the element's renderRoot.
 *
 * @param selector A DOMString containing one or more selectors to match.
 *
 * See:
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll
 *
 * ```ts
 * class MyElement {
 *   @queryAll('div')
 *   divs;
 *
 *   render() {
 *     return html`
 *       <div id="first"></div>
 *       <div id="second"></div>
 *     `;
 *   }
 * }
 * ```
 * @category Decorator
 */
function queryAll(selector) {
    return (0,_base_js__WEBPACK_IMPORTED_MODULE_0__.decorateProperty)({
        descriptor: (_name) => ({
            get() {
                var _a, _b;
                return (_b = (_a = this.renderRoot) === null || _a === void 0 ? void 0 : _a.querySelectorAll(selector)) !== null && _b !== void 0 ? _b : [];
            },
            enumerable: true,
            configurable: true,
        }),
    });
}
//# sourceMappingURL=query-all.js.map

/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/decorators/query-assigned-elements.js":
/*!**********************************************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/decorators/query-assigned-elements.js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "queryAssignedElements": () => (/* binding */ queryAssignedElements)
/* harmony export */ });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base.js */ "./node_modules/@lit/reactive-element/development/decorators/base.js");
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var _a;
/*
 * IMPORTANT: For compatibility with tsickle and the Closure JS compiler, all
 * property decorators (but not class decorators) in this file that have
 * an @ExportDecoratedItems annotation must be defined as a regular function,
 * not an arrow function.
 */

/**
 * A tiny module scoped polyfill for HTMLSlotElement.assignedElements.
 */
const slotAssignedElements = ((_a = window.HTMLSlotElement) === null || _a === void 0 ? void 0 : _a.prototype.assignedElements) != null
    ? (slot, opts) => slot.assignedElements(opts)
    : (slot, opts) => slot
        .assignedNodes(opts)
        .filter((node) => node.nodeType === Node.ELEMENT_NODE);
/**
 * A property decorator that converts a class property into a getter that
 * returns the `assignedElements` of the given `slot`. Provides a declarative
 * way to use
 * [`HTMLSlotElement.assignedElements`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLSlotElement/assignedElements).
 *
 * Can be passed an optional {@linkcode QueryAssignedElementsOptions} object.
 *
 * Example usage:
 * ```ts
 * class MyElement {
 *   @queryAssignedElements({ slot: 'list' })
 *   listItems!: Array<HTMLElement>;
 *   @queryAssignedElements()
 *   unnamedSlotEls!: Array<HTMLElement>;
 *
 *   render() {
 *     return html`
 *       <slot name="list"></slot>
 *       <slot></slot>
 *     `;
 *   }
 * }
 * ```
 *
 * Note, the type of this property should be annotated as `Array<HTMLElement>`.
 *
 * @category Decorator
 */
function queryAssignedElements(options) {
    const { slot, selector } = options !== null && options !== void 0 ? options : {};
    return (0,_base_js__WEBPACK_IMPORTED_MODULE_0__.decorateProperty)({
        descriptor: (_name) => ({
            get() {
                var _a;
                const slotSelector = `slot${slot ? `[name=${slot}]` : ':not([name])'}`;
                const slotEl = (_a = this.renderRoot) === null || _a === void 0 ? void 0 : _a.querySelector(slotSelector);
                const elements = slotEl != null ? slotAssignedElements(slotEl, options) : [];
                if (selector) {
                    return elements.filter((node) => node.matches(selector));
                }
                return elements;
            },
            enumerable: true,
            configurable: true,
        }),
    });
}
//# sourceMappingURL=query-assigned-elements.js.map

/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/decorators/query-assigned-nodes.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/decorators/query-assigned-nodes.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "queryAssignedNodes": () => (/* binding */ queryAssignedNodes)
/* harmony export */ });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base.js */ "./node_modules/@lit/reactive-element/development/decorators/base.js");
/* harmony import */ var _query_assigned_elements_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./query-assigned-elements.js */ "./node_modules/@lit/reactive-element/development/decorators/query-assigned-elements.js");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/*
 * IMPORTANT: For compatibility with tsickle and the Closure JS compiler, all
 * property decorators (but not class decorators) in this file that have
 * an @ExportDecoratedItems annotation must be defined as a regular function,
 * not an arrow function.
 */


function queryAssignedNodes(slotOrOptions, flatten, selector) {
    // Normalize the overloaded arguments.
    let slot = slotOrOptions;
    let assignedNodesOptions;
    if (typeof slotOrOptions === 'object') {
        slot = slotOrOptions.slot;
        assignedNodesOptions = slotOrOptions;
    }
    else {
        assignedNodesOptions = { flatten };
    }
    // For backwards compatibility, queryAssignedNodes with a selector behaves
    // exactly like queryAssignedElements with a selector.
    if (selector) {
        return (0,_query_assigned_elements_js__WEBPACK_IMPORTED_MODULE_1__.queryAssignedElements)({
            slot: slot,
            flatten,
            selector,
        });
    }
    return (0,_base_js__WEBPACK_IMPORTED_MODULE_0__.decorateProperty)({
        descriptor: (_name) => ({
            get() {
                var _a, _b;
                const slotSelector = `slot${slot ? `[name=${slot}]` : ':not([name])'}`;
                const slotEl = (_a = this.renderRoot) === null || _a === void 0 ? void 0 : _a.querySelector(slotSelector);
                return (_b = slotEl === null || slotEl === void 0 ? void 0 : slotEl.assignedNodes(assignedNodesOptions)) !== null && _b !== void 0 ? _b : [];
            },
            enumerable: true,
            configurable: true,
        }),
    });
}
//# sourceMappingURL=query-assigned-nodes.js.map

/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/decorators/query-async.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/decorators/query-async.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "queryAsync": () => (/* binding */ queryAsync)
/* harmony export */ });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base.js */ "./node_modules/@lit/reactive-element/development/decorators/base.js");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

// Note, in the future, we may extend this decorator to support the use case
// where the queried element may need to do work to become ready to interact
// with (e.g. load some implementation code). If so, we might elect to
// add a second argument defining a function that can be run to make the
// queried element loaded/updated/ready.
/**
 * A property decorator that converts a class property into a getter that
 * returns a promise that resolves to the result of a querySelector on the
 * element's renderRoot done after the element's `updateComplete` promise
 * resolves. When the queried property may change with element state, this
 * decorator can be used instead of requiring users to await the
 * `updateComplete` before accessing the property.
 *
 * @param selector A DOMString containing one or more selectors to match.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
 *
 * ```ts
 * class MyElement {
 *   @queryAsync('#first')
 *   first;
 *
 *   render() {
 *     return html`
 *       <div id="first"></div>
 *       <div id="second"></div>
 *     `;
 *   }
 * }
 *
 * // external usage
 * async doSomethingWithFirst() {
 *  (await aMyElement.first).doSomething();
 * }
 * ```
 * @category Decorator
 */
function queryAsync(selector) {
    return (0,_base_js__WEBPACK_IMPORTED_MODULE_0__.decorateProperty)({
        descriptor: (_name) => ({
            async get() {
                var _a;
                await this.updateComplete;
                return (_a = this.renderRoot) === null || _a === void 0 ? void 0 : _a.querySelector(selector);
            },
            enumerable: true,
            configurable: true,
        }),
    });
}
//# sourceMappingURL=query-async.js.map

/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/decorators/query.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/decorators/query.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "query": () => (/* binding */ query)
/* harmony export */ });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base.js */ "./node_modules/@lit/reactive-element/development/decorators/base.js");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * A property decorator that converts a class property into a getter that
 * executes a querySelector on the element's renderRoot.
 *
 * @param selector A DOMString containing one or more selectors to match.
 * @param cache An optional boolean which when true performs the DOM query only
 *     once and caches the result.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
 *
 * ```ts
 * class MyElement {
 *   @query('#first')
 *   first;
 *
 *   render() {
 *     return html`
 *       <div id="first"></div>
 *       <div id="second"></div>
 *     `;
 *   }
 * }
 * ```
 * @category Decorator
 */
function query(selector, cache) {
    return (0,_base_js__WEBPACK_IMPORTED_MODULE_0__.decorateProperty)({
        descriptor: (name) => {
            const descriptor = {
                get() {
                    var _a, _b;
                    return (_b = (_a = this.renderRoot) === null || _a === void 0 ? void 0 : _a.querySelector(selector)) !== null && _b !== void 0 ? _b : null;
                },
                enumerable: true,
                configurable: true,
            };
            if (cache) {
                const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
                descriptor.get = function () {
                    var _a, _b;
                    if (this[key] === undefined) {
                        this[key] = (_b = (_a = this.renderRoot) === null || _a === void 0 ? void 0 : _a.querySelector(selector)) !== null && _b !== void 0 ? _b : null;
                    }
                    return this[key];
                };
            }
            return descriptor;
        },
    });
}
//# sourceMappingURL=query.js.map

/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/decorators/state.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/decorators/state.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "state": () => (/* binding */ state)
/* harmony export */ });
/* harmony import */ var _property_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./property.js */ "./node_modules/@lit/reactive-element/development/decorators/property.js");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/*
 * IMPORTANT: For compatibility with tsickle and the Closure JS compiler, all
 * property decorators (but not class decorators) in this file that have
 * an @ExportDecoratedItems annotation must be defined as a regular function,
 * not an arrow function.
 */

/**
 * Declares a private or protected reactive property that still triggers
 * updates to the element when it changes. It does not reflect from the
 * corresponding attribute.
 *
 * Properties declared this way must not be used from HTML or HTML templating
 * systems, they're solely for properties internal to the element. These
 * properties may be renamed by optimization tools like closure compiler.
 * @category Decorator
 */
function state(options) {
    return (0,_property_js__WEBPACK_IMPORTED_MODULE_0__.property)({
        ...options,
        state: true,
    });
}
//# sourceMappingURL=state.js.map

/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/reactive-element.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/reactive-element.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CSSResult": () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.CSSResult),
/* harmony export */   "ReactiveElement": () => (/* binding */ ReactiveElement),
/* harmony export */   "adoptStyles": () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.adoptStyles),
/* harmony export */   "css": () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.css),
/* harmony export */   "defaultConverter": () => (/* binding */ defaultConverter),
/* harmony export */   "getCompatibleStyle": () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.getCompatibleStyle),
/* harmony export */   "notEqual": () => (/* binding */ notEqual),
/* harmony export */   "supportsAdoptingStyleSheets": () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.supportsAdoptingStyleSheets),
/* harmony export */   "unsafeCSS": () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.unsafeCSS)
/* harmony export */ });
/* harmony import */ var _css_tag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./css-tag.js */ "./node_modules/@lit/reactive-element/development/css-tag.js");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var _a, _b, _c;
var _d;
/**
 * Use this module if you want to create your own base class extending
 * {@link ReactiveElement}.
 * @packageDocumentation
 */


const DEV_MODE = true;
let requestUpdateThenable;
let issueWarning;
const trustedTypes = window
    .trustedTypes;
// Temporary workaround for https://crbug.com/993268
// Currently, any attribute starting with "on" is considered to be a
// TrustedScript source. Such boolean attributes must be set to the equivalent
// trusted emptyScript value.
const emptyStringForBooleanAttribute = trustedTypes
    ? trustedTypes.emptyScript
    : '';
const polyfillSupport = DEV_MODE
    ? window.reactiveElementPolyfillSupportDevMode
    : window.reactiveElementPolyfillSupport;
if (DEV_MODE) {
    // Ensure warnings are issued only 1x, even if multiple versions of Lit
    // are loaded.
    const issuedWarnings = ((_a = globalThis.litIssuedWarnings) !== null && _a !== void 0 ? _a : (globalThis.litIssuedWarnings = new Set()));
    // Issue a warning, if we haven't already.
    issueWarning = (code, warning) => {
        warning += ` See https://lit.dev/msg/${code} for more information.`;
        if (!issuedWarnings.has(warning)) {
            console.warn(warning);
            issuedWarnings.add(warning);
        }
    };
    issueWarning('dev-mode', `Lit is in dev mode. Not recommended for production!`);
    // Issue polyfill support warning.
    if (((_b = window.ShadyDOM) === null || _b === void 0 ? void 0 : _b.inUse) && polyfillSupport === undefined) {
        issueWarning('polyfill-support-missing', `Shadow DOM is being polyfilled via \`ShadyDOM\` but ` +
            `the \`polyfill-support\` module has not been loaded.`);
    }
    requestUpdateThenable = (name) => ({
        then: (onfulfilled, _onrejected) => {
            issueWarning('request-update-promise', `The \`requestUpdate\` method should no longer return a Promise but ` +
                `does so on \`${name}\`. Use \`updateComplete\` instead.`);
            if (onfulfilled !== undefined) {
                onfulfilled(false);
            }
        },
    });
}
/**
 * Useful for visualizing and logging insights into what the Lit template system is doing.
 *
 * Compiled out of prod mode builds.
 */
const debugLogEvent = DEV_MODE
    ? (event) => {
        const shouldEmit = window
            .emitLitDebugLogEvents;
        if (shouldEmit) {
            window.dispatchEvent(new CustomEvent('lit-debug', {
                detail: event,
            }));
        }
    }
    : undefined;
/*
 * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
 * replaced at compile time by the munged name for object[property]. We cannot
 * alias this function, so we have to use a small shim that has the same
 * behavior when not compiling.
 */
/*@__INLINE__*/
const JSCompiler_renameProperty = (prop, _obj) => prop;
const defaultConverter = {
    toAttribute(value, type) {
        switch (type) {
            case Boolean:
                value = value ? emptyStringForBooleanAttribute : null;
                break;
            case Object:
            case Array:
                // if the value is `null` or `undefined` pass this through
                // to allow removing/no change behavior.
                value = value == null ? value : JSON.stringify(value);
                break;
        }
        return value;
    },
    fromAttribute(value, type) {
        let fromValue = value;
        switch (type) {
            case Boolean:
                fromValue = value !== null;
                break;
            case Number:
                fromValue = value === null ? null : Number(value);
                break;
            case Object:
            case Array:
                // Do *not* generate exception when invalid JSON is set as elements
                // don't normally complain on being mis-configured.
                // TODO(sorvell): Do generate exception in *dev mode*.
                try {
                    // Assert to adhere to Bazel's "must type assert JSON parse" rule.
                    fromValue = JSON.parse(value);
                }
                catch (e) {
                    fromValue = null;
                }
                break;
        }
        return fromValue;
    },
};
/**
 * Change function that returns true if `value` is different from `oldValue`.
 * This method is used as the default for a property's `hasChanged` function.
 */
const notEqual = (value, old) => {
    // This ensures (old==NaN, value==NaN) always returns false
    return old !== value && (old === old || value === value);
};
const defaultPropertyDeclaration = {
    attribute: true,
    type: String,
    converter: defaultConverter,
    reflect: false,
    hasChanged: notEqual,
};
/**
 * The Closure JS Compiler doesn't currently have good support for static
 * property semantics where "this" is dynamic (e.g.
 * https://github.com/google/closure-compiler/issues/3177 and others) so we use
 * this hack to bypass any rewriting by the compiler.
 */
const finalized = 'finalized';
/**
 * Base element class which manages element properties and attributes. When
 * properties change, the `update` method is asynchronously called. This method
 * should be supplied by subclassers to render updates as desired.
 * @noInheritDoc
 */
class ReactiveElement extends HTMLElement {
    constructor() {
        super();
        this.__instanceProperties = new Map();
        /**
         * True if there is a pending update as a result of calling `requestUpdate()`.
         * Should only be read.
         * @category updates
         */
        this.isUpdatePending = false;
        /**
         * Is set to `true` after the first update. The element code cannot assume
         * that `renderRoot` exists before the element `hasUpdated`.
         * @category updates
         */
        this.hasUpdated = false;
        /**
         * Name of currently reflecting property
         */
        this.__reflectingProperty = null;
        this._initialize();
    }
    /**
     * Adds an initializer function to the class that is called during instance
     * construction.
     *
     * This is useful for code that runs against a `ReactiveElement`
     * subclass, such as a decorator, that needs to do work for each
     * instance, such as setting up a `ReactiveController`.
     *
     * ```ts
     * const myDecorator = (target: typeof ReactiveElement, key: string) => {
     *   target.addInitializer((instance: ReactiveElement) => {
     *     // This is run during construction of the element
     *     new MyController(instance);
     *   });
     * }
     * ```
     *
     * Decorating a field will then cause each instance to run an initializer
     * that adds a controller:
     *
     * ```ts
     * class MyElement extends LitElement {
     *   @myDecorator foo;
     * }
     * ```
     *
     * Initializers are stored per-constructor. Adding an initializer to a
     * subclass does not add it to a superclass. Since initializers are run in
     * constructors, initializers will run in order of the class hierarchy,
     * starting with superclasses and progressing to the instance's class.
     *
     * @nocollapse
     */
    static addInitializer(initializer) {
        var _a;
        (_a = this._initializers) !== null && _a !== void 0 ? _a : (this._initializers = []);
        this._initializers.push(initializer);
    }
    /**
     * Returns a list of attributes corresponding to the registered properties.
     * @nocollapse
     * @category attributes
     */
    static get observedAttributes() {
        // note: piggy backing on this to ensure we're finalized.
        this.finalize();
        const attributes = [];
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        this.elementProperties.forEach((v, p) => {
            const attr = this.__attributeNameForProperty(p, v);
            if (attr !== undefined) {
                this.__attributeToPropertyMap.set(attr, p);
                attributes.push(attr);
            }
        });
        return attributes;
    }
    /**
     * Creates a property accessor on the element prototype if one does not exist
     * and stores a {@linkcode PropertyDeclaration} for the property with the
     * given options. The property setter calls the property's `hasChanged`
     * property option or uses a strict identity check to determine whether or not
     * to request an update.
     *
     * This method may be overridden to customize properties; however,
     * when doing so, it's important to call `super.createProperty` to ensure
     * the property is setup correctly. This method calls
     * `getPropertyDescriptor` internally to get a descriptor to install.
     * To customize what properties do when they are get or set, override
     * `getPropertyDescriptor`. To customize the options for a property,
     * implement `createProperty` like this:
     *
     * ```ts
     * static createProperty(name, options) {
     *   options = Object.assign(options, {myOption: true});
     *   super.createProperty(name, options);
     * }
     * ```
     *
     * @nocollapse
     * @category properties
     */
    static createProperty(name, options = defaultPropertyDeclaration) {
        var _a;
        // if this is a state property, force the attribute to false.
        if (options.state) {
            // Cast as any since this is readonly.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            options.attribute = false;
        }
        // Note, since this can be called by the `@property` decorator which
        // is called before `finalize`, we ensure finalization has been kicked off.
        this.finalize();
        this.elementProperties.set(name, options);
        // Do not generate an accessor if the prototype already has one, since
        // it would be lost otherwise and that would never be the user's intention;
        // Instead, we expect users to call `requestUpdate` themselves from
        // user-defined accessors. Note that if the super has an accessor we will
        // still overwrite it
        if (!options.noAccessor && !this.prototype.hasOwnProperty(name)) {
            const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
            const descriptor = this.getPropertyDescriptor(name, key, options);
            if (descriptor !== undefined) {
                Object.defineProperty(this.prototype, name, descriptor);
                if (DEV_MODE) {
                    // If this class doesn't have its own set, create one and initialize
                    // with the values in the set from the nearest ancestor class, if any.
                    if (!this.hasOwnProperty('__reactivePropertyKeys')) {
                        this.__reactivePropertyKeys = new Set((_a = this.__reactivePropertyKeys) !== null && _a !== void 0 ? _a : []);
                    }
                    this.__reactivePropertyKeys.add(name);
                }
            }
        }
    }
    /**
     * Returns a property descriptor to be defined on the given named property.
     * If no descriptor is returned, the property will not become an accessor.
     * For example,
     *
     * ```ts
     * class MyElement extends LitElement {
     *   static getPropertyDescriptor(name, key, options) {
     *     const defaultDescriptor =
     *         super.getPropertyDescriptor(name, key, options);
     *     const setter = defaultDescriptor.set;
     *     return {
     *       get: defaultDescriptor.get,
     *       set(value) {
     *         setter.call(this, value);
     *         // custom action.
     *       },
     *       configurable: true,
     *       enumerable: true
     *     }
     *   }
     * }
     * ```
     *
     * @nocollapse
     * @category properties
     */
    static getPropertyDescriptor(name, key, options) {
        return {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            get() {
                return this[key];
            },
            set(value) {
                const oldValue = this[name];
                this[key] = value;
                this.requestUpdate(name, oldValue, options);
            },
            configurable: true,
            enumerable: true,
        };
    }
    /**
     * Returns the property options associated with the given property.
     * These options are defined with a `PropertyDeclaration` via the `properties`
     * object or the `@property` decorator and are registered in
     * `createProperty(...)`.
     *
     * Note, this method should be considered "final" and not overridden. To
     * customize the options for a given property, override
     * {@linkcode createProperty}.
     *
     * @nocollapse
     * @final
     * @category properties
     */
    static getPropertyOptions(name) {
        return this.elementProperties.get(name) || defaultPropertyDeclaration;
    }
    /**
     * Creates property accessors for registered properties, sets up element
     * styling, and ensures any superclasses are also finalized. Returns true if
     * the element was finalized.
     * @nocollapse
     */
    static finalize() {
        if (this.hasOwnProperty(finalized)) {
            return false;
        }
        this[finalized] = true;
        // finalize any superclasses
        const superCtor = Object.getPrototypeOf(this);
        superCtor.finalize();
        this.elementProperties = new Map(superCtor.elementProperties);
        // initialize Map populated in observedAttributes
        this.__attributeToPropertyMap = new Map();
        // make any properties
        // Note, only process "own" properties since this element will inherit
        // any properties defined on the superClass, and finalization ensures
        // the entire prototype chain is finalized.
        if (this.hasOwnProperty(JSCompiler_renameProperty('properties', this))) {
            const props = this.properties;
            // support symbols in properties (IE11 does not support this)
            const propKeys = [
                ...Object.getOwnPropertyNames(props),
                ...Object.getOwnPropertySymbols(props),
            ];
            // This for/of is ok because propKeys is an array
            for (const p of propKeys) {
                // note, use of `any` is due to TypeScript lack of support for symbol in
                // index types
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                this.createProperty(p, props[p]);
            }
        }
        this.elementStyles = this.finalizeStyles(this.styles);
        // DEV mode warnings
        if (DEV_MODE) {
            const warnRemovedOrRenamed = (name, renamed = false) => {
                if (this.prototype.hasOwnProperty(name)) {
                    issueWarning(renamed ? 'renamed-api' : 'removed-api', `\`${name}\` is implemented on class ${this.name}. It ` +
                        `has been ${renamed ? 'renamed' : 'removed'} ` +
                        `in this version of LitElement.`);
                }
            };
            warnRemovedOrRenamed('initialize');
            warnRemovedOrRenamed('requestUpdateInternal');
            warnRemovedOrRenamed('_getUpdateComplete', true);
        }
        return true;
    }
    /**
     * Takes the styles the user supplied via the `static styles` property and
     * returns the array of styles to apply to the element.
     * Override this method to integrate into a style management system.
     *
     * Styles are deduplicated preserving the _last_ instance in the list. This
     * is a performance optimization to avoid duplicated styles that can occur
     * especially when composing via subclassing. The last item is kept to try
     * to preserve the cascade order with the assumption that it's most important
     * that last added styles override previous styles.
     *
     * @nocollapse
     * @category styles
     */
    static finalizeStyles(styles) {
        const elementStyles = [];
        if (Array.isArray(styles)) {
            // Dedupe the flattened array in reverse order to preserve the last items.
            // Casting to Array<unknown> works around TS error that
            // appears to come from trying to flatten a type CSSResultArray.
            const set = new Set(styles.flat(Infinity).reverse());
            // Then preserve original order by adding the set items in reverse order.
            for (const s of set) {
                elementStyles.unshift((0,_css_tag_js__WEBPACK_IMPORTED_MODULE_0__.getCompatibleStyle)(s));
            }
        }
        else if (styles !== undefined) {
            elementStyles.push((0,_css_tag_js__WEBPACK_IMPORTED_MODULE_0__.getCompatibleStyle)(styles));
        }
        return elementStyles;
    }
    /**
     * Returns the property name for the given attribute `name`.
     * @nocollapse
     */
    static __attributeNameForProperty(name, options) {
        const attribute = options.attribute;
        return attribute === false
            ? undefined
            : typeof attribute === 'string'
                ? attribute
                : typeof name === 'string'
                    ? name.toLowerCase()
                    : undefined;
    }
    /**
     * Internal only override point for customizing work done when elements
     * are constructed.
     *
     * @internal
     */
    _initialize() {
        var _a;
        this.__updatePromise = new Promise((res) => (this.enableUpdating = res));
        this._$changedProperties = new Map();
        this.__saveInstanceProperties();
        // ensures first update will be caught by an early access of
        // `updateComplete`
        this.requestUpdate();
        (_a = this.constructor._initializers) === null || _a === void 0 ? void 0 : _a.forEach((i) => i(this));
    }
    /**
     * Registers a `ReactiveController` to participate in the element's reactive
     * update cycle. The element automatically calls into any registered
     * controllers during its lifecycle callbacks.
     *
     * If the element is connected when `addController()` is called, the
     * controller's `hostConnected()` callback will be immediately called.
     * @category controllers
     */
    addController(controller) {
        var _a, _b;
        ((_a = this.__controllers) !== null && _a !== void 0 ? _a : (this.__controllers = [])).push(controller);
        // If a controller is added after the element has been connected,
        // call hostConnected. Note, re-using existence of `renderRoot` here
        // (which is set in connectedCallback) to avoid the need to track a
        // first connected state.
        if (this.renderRoot !== undefined && this.isConnected) {
            (_b = controller.hostConnected) === null || _b === void 0 ? void 0 : _b.call(controller);
        }
    }
    /**
     * Removes a `ReactiveController` from the element.
     * @category controllers
     */
    removeController(controller) {
        var _a;
        // Note, if the indexOf is -1, the >>> will flip the sign which makes the
        // splice do nothing.
        (_a = this.__controllers) === null || _a === void 0 ? void 0 : _a.splice(this.__controllers.indexOf(controller) >>> 0, 1);
    }
    /**
     * Fixes any properties set on the instance before upgrade time.
     * Otherwise these would shadow the accessor and break these properties.
     * The properties are stored in a Map which is played back after the
     * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
     * (<=41), properties created for native platform properties like (`id` or
     * `name`) may not have default values set in the element constructor. On
     * these browsers native properties appear on instances and therefore their
     * default value will overwrite any element default (e.g. if the element sets
     * this.id = 'id' in the constructor, the 'id' will become '' since this is
     * the native platform default).
     */
    __saveInstanceProperties() {
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        this.constructor.elementProperties.forEach((_v, p) => {
            if (this.hasOwnProperty(p)) {
                this.__instanceProperties.set(p, this[p]);
                delete this[p];
            }
        });
    }
    /**
     * Returns the node into which the element should render and by default
     * creates and returns an open shadowRoot. Implement to customize where the
     * element's DOM is rendered. For example, to render into the element's
     * childNodes, return `this`.
     *
     * @return Returns a node into which to render.
     * @category rendering
     */
    createRenderRoot() {
        var _a;
        const renderRoot = (_a = this.shadowRoot) !== null && _a !== void 0 ? _a : this.attachShadow(this.constructor.shadowRootOptions);
        (0,_css_tag_js__WEBPACK_IMPORTED_MODULE_0__.adoptStyles)(renderRoot, this.constructor.elementStyles);
        return renderRoot;
    }
    /**
     * On first connection, creates the element's renderRoot, sets up
     * element styling, and enables updating.
     * @category lifecycle
     */
    connectedCallback() {
        var _a;
        // create renderRoot before first update.
        if (this.renderRoot === undefined) {
            this.renderRoot = this.createRenderRoot();
        }
        this.enableUpdating(true);
        (_a = this.__controllers) === null || _a === void 0 ? void 0 : _a.forEach((c) => { var _a; return (_a = c.hostConnected) === null || _a === void 0 ? void 0 : _a.call(c); });
    }
    /**
     * Note, this method should be considered final and not overridden. It is
     * overridden on the element instance with a function that triggers the first
     * update.
     * @category updates
     */
    enableUpdating(_requestedUpdate) { }
    /**
     * Allows for `super.disconnectedCallback()` in extensions while
     * reserving the possibility of making non-breaking feature additions
     * when disconnecting at some point in the future.
     * @category lifecycle
     */
    disconnectedCallback() {
        var _a;
        (_a = this.__controllers) === null || _a === void 0 ? void 0 : _a.forEach((c) => { var _a; return (_a = c.hostDisconnected) === null || _a === void 0 ? void 0 : _a.call(c); });
    }
    /**
     * Synchronizes property values when attributes change.
     *
     * Specifically, when an attribute is set, the corresponding property is set.
     * You should rarely need to implement this callback. If this method is
     * overridden, `super.attributeChangedCallback(name, _old, value)` must be
     * called.
     *
     * See [using the lifecycle callbacks](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks)
     * on MDN for more information about the `attributeChangedCallback`.
     * @category attributes
     */
    attributeChangedCallback(name, _old, value) {
        this._$attributeToProperty(name, value);
    }
    __propertyToAttribute(name, value, options = defaultPropertyDeclaration) {
        var _a, _b;
        const attr = this.constructor.__attributeNameForProperty(name, options);
        if (attr !== undefined && options.reflect === true) {
            const toAttribute = (_b = (_a = options.converter) === null || _a === void 0 ? void 0 : _a.toAttribute) !== null && _b !== void 0 ? _b : defaultConverter.toAttribute;
            const attrValue = toAttribute(value, options.type);
            if (DEV_MODE &&
                this.constructor.enabledWarnings.indexOf('migration') >= 0 &&
                attrValue === undefined) {
                issueWarning('undefined-attribute-value', `The attribute value for the ${name} property is ` +
                    `undefined on element ${this.localName}. The attribute will be ` +
                    `removed, but in the previous version of \`ReactiveElement\`, ` +
                    `the attribute would not have changed.`);
            }
            // Track if the property is being reflected to avoid
            // setting the property again via `attributeChangedCallback`. Note:
            // 1. this takes advantage of the fact that the callback is synchronous.
            // 2. will behave incorrectly if multiple attributes are in the reaction
            // stack at time of calling. However, since we process attributes
            // in `update` this should not be possible (or an extreme corner case
            // that we'd like to discover).
            // mark state reflecting
            this.__reflectingProperty = name;
            if (attrValue == null) {
                this.removeAttribute(attr);
            }
            else {
                this.setAttribute(attr, attrValue);
            }
            // mark state not reflecting
            this.__reflectingProperty = null;
        }
    }
    /** @internal */
    _$attributeToProperty(name, value) {
        var _a, _b, _c;
        const ctor = this.constructor;
        // Note, hint this as an `AttributeMap` so closure clearly understands
        // the type; it has issues with tracking types through statics
        const propName = ctor.__attributeToPropertyMap.get(name);
        // Use tracking info to avoid reflecting a property value to an attribute
        // if it was just set because the attribute changed.
        if (propName !== undefined && this.__reflectingProperty !== propName) {
            const options = ctor.getPropertyOptions(propName);
            const converter = options.converter;
            const fromAttribute = (_c = (_b = (_a = converter) === null || _a === void 0 ? void 0 : _a.fromAttribute) !== null && _b !== void 0 ? _b : (typeof converter === 'function'
                ? converter
                : null)) !== null && _c !== void 0 ? _c : defaultConverter.fromAttribute;
            // mark state reflecting
            this.__reflectingProperty = propName;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this[propName] = fromAttribute(value, options.type);
            // mark state not reflecting
            this.__reflectingProperty = null;
        }
    }
    /**
     * Requests an update which is processed asynchronously. This should be called
     * when an element should update based on some state not triggered by setting
     * a reactive property. In this case, pass no arguments. It should also be
     * called when manually implementing a property setter. In this case, pass the
     * property `name` and `oldValue` to ensure that any configured property
     * options are honored.
     *
     * @param name name of requesting property
     * @param oldValue old value of requesting property
     * @param options property options to use instead of the previously
     *     configured options
     * @category updates
     */
    requestUpdate(name, oldValue, options) {
        let shouldRequestUpdate = true;
        // If we have a property key, perform property update steps.
        if (name !== undefined) {
            options =
                options ||
                    this.constructor.getPropertyOptions(name);
            const hasChanged = options.hasChanged || notEqual;
            if (hasChanged(this[name], oldValue)) {
                if (!this._$changedProperties.has(name)) {
                    this._$changedProperties.set(name, oldValue);
                }
                // Add to reflecting properties set.
                // Note, it's important that every change has a chance to add the
                // property to `_reflectingProperties`. This ensures setting
                // attribute + property reflects correctly.
                if (options.reflect === true && this.__reflectingProperty !== name) {
                    if (this.__reflectingProperties === undefined) {
                        this.__reflectingProperties = new Map();
                    }
                    this.__reflectingProperties.set(name, options);
                }
            }
            else {
                // Abort the request if the property should not be considered changed.
                shouldRequestUpdate = false;
            }
        }
        if (!this.isUpdatePending && shouldRequestUpdate) {
            this.__updatePromise = this.__enqueueUpdate();
        }
        // Note, since this no longer returns a promise, in dev mode we return a
        // thenable which warns if it's called.
        return DEV_MODE
            ? requestUpdateThenable(this.localName)
            : undefined;
    }
    /**
     * Sets up the element to asynchronously update.
     */
    async __enqueueUpdate() {
        this.isUpdatePending = true;
        try {
            // Ensure any previous update has resolved before updating.
            // This `await` also ensures that property changes are batched.
            await this.__updatePromise;
        }
        catch (e) {
            // Refire any previous errors async so they do not disrupt the update
            // cycle. Errors are refired so developers have a chance to observe
            // them, and this can be done by implementing
            // `window.onunhandledrejection`.
            Promise.reject(e);
        }
        const result = this.scheduleUpdate();
        // If `scheduleUpdate` returns a Promise, we await it. This is done to
        // enable coordinating updates with a scheduler. Note, the result is
        // checked to avoid delaying an additional microtask unless we need to.
        if (result != null) {
            await result;
        }
        return !this.isUpdatePending;
    }
    /**
     * Schedules an element update. You can override this method to change the
     * timing of updates by returning a Promise. The update will await the
     * returned Promise, and you should resolve the Promise to allow the update
     * to proceed. If this method is overridden, `super.scheduleUpdate()`
     * must be called.
     *
     * For instance, to schedule updates to occur just before the next frame:
     *
     * ```ts
     * override protected async scheduleUpdate(): Promise<unknown> {
     *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
     *   super.scheduleUpdate();
     * }
     * ```
     * @category updates
     */
    scheduleUpdate() {
        return this.performUpdate();
    }
    /**
     * Performs an element update. Note, if an exception is thrown during the
     * update, `firstUpdated` and `updated` will not be called.
     *
     * Call `performUpdate()` to immediately process a pending update. This should
     * generally not be needed, but it can be done in rare cases when you need to
     * update synchronously.
     *
     * Note: To ensure `performUpdate()` synchronously completes a pending update,
     * it should not be overridden. In LitElement 2.x it was suggested to override
     * `performUpdate()` to also customizing update scheduling. Instead, you should now
     * override `scheduleUpdate()`. For backwards compatibility with LitElement 2.x,
     * scheduling updates via `performUpdate()` continues to work, but will make
     * also calling `performUpdate()` to synchronously process updates difficult.
     *
     * @category updates
     */
    performUpdate() {
        var _a, _b;
        // Abort any update if one is not pending when this is called.
        // This can happen if `performUpdate` is called early to "flush"
        // the update.
        if (!this.isUpdatePending) {
            return;
        }
        debugLogEvent === null || debugLogEvent === void 0 ? void 0 : debugLogEvent({ kind: 'update' });
        // create renderRoot before first update.
        if (!this.hasUpdated) {
            // Produce warning if any class properties are shadowed by class fields
            if (DEV_MODE) {
                const shadowedProperties = [];
                (_a = this.constructor.__reactivePropertyKeys) === null || _a === void 0 ? void 0 : _a.forEach((p) => {
                    var _a;
                    if (this.hasOwnProperty(p) && !((_a = this.__instanceProperties) === null || _a === void 0 ? void 0 : _a.has(p))) {
                        shadowedProperties.push(p);
                    }
                });
                if (shadowedProperties.length) {
                    throw new Error(`The following properties on element ${this.localName} will not ` +
                        `trigger updates as expected because they are set using class ` +
                        `fields: ${shadowedProperties.join(', ')}. ` +
                        `Native class fields and some compiled output will overwrite ` +
                        `accessors used for detecting changes. See ` +
                        `https://lit.dev/msg/class-field-shadowing ` +
                        `for more information.`);
                }
            }
        }
        // Mixin instance properties once, if they exist.
        if (this.__instanceProperties) {
            // Use forEach so this works even if for/of loops are compiled to for loops
            // expecting arrays
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.__instanceProperties.forEach((v, p) => (this[p] = v));
            this.__instanceProperties = undefined;
        }
        let shouldUpdate = false;
        const changedProperties = this._$changedProperties;
        try {
            shouldUpdate = this.shouldUpdate(changedProperties);
            if (shouldUpdate) {
                this.willUpdate(changedProperties);
                (_b = this.__controllers) === null || _b === void 0 ? void 0 : _b.forEach((c) => { var _a; return (_a = c.hostUpdate) === null || _a === void 0 ? void 0 : _a.call(c); });
                this.update(changedProperties);
            }
            else {
                this.__markUpdated();
            }
        }
        catch (e) {
            // Prevent `firstUpdated` and `updated` from running when there's an
            // update exception.
            shouldUpdate = false;
            // Ensure element can accept additional updates after an exception.
            this.__markUpdated();
            throw e;
        }
        // The update is no longer considered pending and further updates are now allowed.
        if (shouldUpdate) {
            this._$didUpdate(changedProperties);
        }
    }
    /**
     * Invoked before `update()` to compute values needed during the update.
     *
     * Implement `willUpdate` to compute property values that depend on other
     * properties and are used in the rest of the update process.
     *
     * ```ts
     * willUpdate(changedProperties) {
     *   // only need to check changed properties for an expensive computation.
     *   if (changedProperties.has('firstName') || changedProperties.has('lastName')) {
     *     this.sha = computeSHA(`${this.firstName} ${this.lastName}`);
     *   }
     * }
     *
     * render() {
     *   return html`SHA: ${this.sha}`;
     * }
     * ```
     *
     * @category updates
     */
    willUpdate(_changedProperties) { }
    // Note, this is an override point for polyfill-support.
    // @internal
    _$didUpdate(changedProperties) {
        var _a;
        (_a = this.__controllers) === null || _a === void 0 ? void 0 : _a.forEach((c) => { var _a; return (_a = c.hostUpdated) === null || _a === void 0 ? void 0 : _a.call(c); });
        if (!this.hasUpdated) {
            this.hasUpdated = true;
            this.firstUpdated(changedProperties);
        }
        this.updated(changedProperties);
        if (DEV_MODE &&
            this.isUpdatePending &&
            this.constructor.enabledWarnings.indexOf('change-in-update') >= 0) {
            issueWarning('change-in-update', `Element ${this.localName} scheduled an update ` +
                `(generally because a property was set) ` +
                `after an update completed, causing a new update to be scheduled. ` +
                `This is inefficient and should be avoided unless the next update ` +
                `can only be scheduled as a side effect of the previous update.`);
        }
    }
    __markUpdated() {
        this._$changedProperties = new Map();
        this.isUpdatePending = false;
    }
    /**
     * Returns a Promise that resolves when the element has completed updating.
     * The Promise value is a boolean that is `true` if the element completed the
     * update without triggering another update. The Promise result is `false` if
     * a property was set inside `updated()`. If the Promise is rejected, an
     * exception was thrown during the update.
     *
     * To await additional asynchronous work, override the `getUpdateComplete`
     * method. For example, it is sometimes useful to await a rendered element
     * before fulfilling this Promise. To do this, first await
     * `super.getUpdateComplete()`, then any subsequent state.
     *
     * @return A promise of a boolean that resolves to true if the update completed
     *     without triggering another update.
     * @category updates
     */
    get updateComplete() {
        return this.getUpdateComplete();
    }
    /**
     * Override point for the `updateComplete` promise.
     *
     * It is not safe to override the `updateComplete` getter directly due to a
     * limitation in TypeScript which means it is not possible to call a
     * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
     * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
     * This method should be overridden instead. For example:
     *
     * ```ts
     * class MyElement extends LitElement {
     *   override async getUpdateComplete() {
     *     const result = await super.getUpdateComplete();
     *     await this._myChild.updateComplete;
     *     return result;
     *   }
     * }
     * ```
     *
     * @return A promise of a boolean that resolves to true if the update completed
     *     without triggering another update.
     * @category updates
     */
    getUpdateComplete() {
        return this.__updatePromise;
    }
    /**
     * Controls whether or not `update()` should be called when the element requests
     * an update. By default, this method always returns `true`, but this can be
     * customized to control when to update.
     *
     * @param _changedProperties Map of changed properties with old values
     * @category updates
     */
    shouldUpdate(_changedProperties) {
        return true;
    }
    /**
     * Updates the element. This method reflects property values to attributes.
     * It can be overridden to render and keep updated element DOM.
     * Setting properties inside this method will *not* trigger
     * another update.
     *
     * @param _changedProperties Map of changed properties with old values
     * @category updates
     */
    update(_changedProperties) {
        if (this.__reflectingProperties !== undefined) {
            // Use forEach so this works even if for/of loops are compiled to for
            // loops expecting arrays
            this.__reflectingProperties.forEach((v, k) => this.__propertyToAttribute(k, this[k], v));
            this.__reflectingProperties = undefined;
        }
        this.__markUpdated();
    }
    /**
     * Invoked whenever the element is updated. Implement to perform
     * post-updating tasks via DOM APIs, for example, focusing an element.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     * @category updates
     */
    updated(_changedProperties) { }
    /**
     * Invoked when the element is first updated. Implement to perform one time
     * work on the element after update.
     *
     * ```ts
     * firstUpdated() {
     *   this.renderRoot.getElementById('my-text-area').focus();
     * }
     * ```
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     * @category updates
     */
    firstUpdated(_changedProperties) { }
}
_d = finalized;
/**
 * Marks class as having finished creating properties.
 */
ReactiveElement[_d] = true;
/**
 * Memoized list of all element properties, including any superclass properties.
 * Created lazily on user subclasses when finalizing the class.
 * @nocollapse
 * @category properties
 */
ReactiveElement.elementProperties = new Map();
/**
 * Memoized list of all element styles.
 * Created lazily on user subclasses when finalizing the class.
 * @nocollapse
 * @category styles
 */
ReactiveElement.elementStyles = [];
/**
 * Options used when calling `attachShadow`. Set this property to customize
 * the options for the shadowRoot; for example, to create a closed
 * shadowRoot: `{mode: 'closed'}`.
 *
 * Note, these options are used in `createRenderRoot`. If this method
 * is customized, options should be respected if possible.
 * @nocollapse
 * @category rendering
 */
ReactiveElement.shadowRootOptions = { mode: 'open' };
// Apply polyfills if available
polyfillSupport === null || polyfillSupport === void 0 ? void 0 : polyfillSupport({ ReactiveElement });
// Dev mode warnings...
if (DEV_MODE) {
    // Default warning set.
    ReactiveElement.enabledWarnings = ['change-in-update'];
    const ensureOwnWarnings = function (ctor) {
        if (!ctor.hasOwnProperty(JSCompiler_renameProperty('enabledWarnings', ctor))) {
            ctor.enabledWarnings = ctor.enabledWarnings.slice();
        }
    };
    ReactiveElement.enableWarning = function (warning) {
        ensureOwnWarnings(this);
        if (this.enabledWarnings.indexOf(warning) < 0) {
            this.enabledWarnings.push(warning);
        }
    };
    ReactiveElement.disableWarning = function (warning) {
        ensureOwnWarnings(this);
        const i = this.enabledWarnings.indexOf(warning);
        if (i >= 0) {
            this.enabledWarnings.splice(i, 1);
        }
    };
}
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for ReactiveElement usage.
((_c = globalThis.reactiveElementVersions) !== null && _c !== void 0 ? _c : (globalThis.reactiveElementVersions = [])).push('1.3.0');
if (DEV_MODE && globalThis.reactiveElementVersions.length > 1) {
    issueWarning('multiple-versions', `Multiple versions of Lit loaded. Loading multiple versions ` +
        `is not recommended.`);
}
//# sourceMappingURL=reactive-element.js.map

/***/ }),

/***/ "./node_modules/lit-element/development/lit-element.js":
/*!*************************************************************!*\
  !*** ./node_modules/lit-element/development/lit-element.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CSSResult": () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.CSSResult),
/* harmony export */   "INTERNAL": () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.INTERNAL),
/* harmony export */   "LitElement": () => (/* binding */ LitElement),
/* harmony export */   "ReactiveElement": () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.ReactiveElement),
/* harmony export */   "UpdatingElement": () => (/* binding */ UpdatingElement),
/* harmony export */   "_$LE": () => (/* binding */ _$LE),
/* harmony export */   "_$LH": () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__._$LH),
/* harmony export */   "adoptStyles": () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.adoptStyles),
/* harmony export */   "css": () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.css),
/* harmony export */   "defaultConverter": () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.defaultConverter),
/* harmony export */   "getCompatibleStyle": () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.getCompatibleStyle),
/* harmony export */   "html": () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.html),
/* harmony export */   "noChange": () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.noChange),
/* harmony export */   "notEqual": () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.notEqual),
/* harmony export */   "nothing": () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.nothing),
/* harmony export */   "render": () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.render),
/* harmony export */   "supportsAdoptingStyleSheets": () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.supportsAdoptingStyleSheets),
/* harmony export */   "svg": () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.svg),
/* harmony export */   "unsafeCSS": () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.unsafeCSS)
/* harmony export */ });
/* harmony import */ var _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lit/reactive-element */ "./node_modules/@lit/reactive-element/development/reactive-element.js");
/* harmony import */ var lit_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lit-html */ "./node_modules/lit-html/development/lit-html.js");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var _a, _b, _c;
/**
 * The main LitElement module, which defines the {@linkcode LitElement} base
 * class and related APIs.
 *
 *  LitElement components can define a template and a set of observed
 * properties. Changing an observed property triggers a re-render of the
 * element.
 *
 *  Import {@linkcode LitElement} and {@linkcode html} from this module to
 * create a component:
 *
 *  ```js
 * import {LitElement, html} from 'lit-element';
 *
 * class MyElement extends LitElement {
 *
 *   // Declare observed properties
 *   static get properties() {
 *     return {
 *       adjective: {}
 *     }
 *   }
 *
 *   constructor() {
 *     this.adjective = 'awesome';
 *   }
 *
 *   // Define the element's template
 *   render() {
 *     return html`<p>your ${adjective} template here</p>`;
 *   }
 * }
 *
 * customElements.define('my-element', MyElement);
 * ```
 *
 * `LitElement` extends {@linkcode ReactiveElement} and adds lit-html
 * templating. The `ReactiveElement` class is provided for users that want to
 * build their own custom element base classes that don't use lit-html.
 *
 * @packageDocumentation
 */




// For backwards compatibility export ReactiveElement as UpdatingElement. Note,
// IE transpilation requires exporting like this.
const UpdatingElement = _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.ReactiveElement;
const DEV_MODE = true;
let issueWarning;
if (DEV_MODE) {
    // Ensure warnings are issued only 1x, even if multiple versions of Lit
    // are loaded.
    const issuedWarnings = ((_a = globalThis.litIssuedWarnings) !== null && _a !== void 0 ? _a : (globalThis.litIssuedWarnings = new Set()));
    // Issue a warning, if we haven't already.
    issueWarning = (code, warning) => {
        warning += ` See https://lit.dev/msg/${code} for more information.`;
        if (!issuedWarnings.has(warning)) {
            console.warn(warning);
            issuedWarnings.add(warning);
        }
    };
}
/**
 * Base element class that manages element properties and attributes, and
 * renders a lit-html template.
 *
 * To define a component, subclass `LitElement` and implement a
 * `render` method to provide the component's template. Define properties
 * using the {@linkcode LitElement.properties properties} property or the
 * {@linkcode property} decorator.
 */
class LitElement extends _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.ReactiveElement {
    constructor() {
        super(...arguments);
        /**
         * @category rendering
         */
        this.renderOptions = { host: this };
        this.__childPart = undefined;
    }
    /**
     * @category rendering
     */
    createRenderRoot() {
        var _a;
        var _b;
        const renderRoot = super.createRenderRoot();
        // When adoptedStyleSheets are shimmed, they are inserted into the
        // shadowRoot by createRenderRoot. Adjust the renderBefore node so that
        // any styles in Lit content render before adoptedStyleSheets. This is
        // important so that adoptedStyleSheets have precedence over styles in
        // the shadowRoot.
        (_a = (_b = this.renderOptions).renderBefore) !== null && _a !== void 0 ? _a : (_b.renderBefore = renderRoot.firstChild);
        return renderRoot;
    }
    /**
     * Updates the element. This method reflects property values to attributes
     * and calls `render` to render DOM via lit-html. Setting properties inside
     * this method will *not* trigger another update.
     * @param changedProperties Map of changed properties with old values
     * @category updates
     */
    update(changedProperties) {
        // Setting properties in `render` should not trigger an update. Since
        // updates are allowed after super.update, it's important to call `render`
        // before that.
        const value = this.render();
        if (!this.hasUpdated) {
            this.renderOptions.isConnected = this.isConnected;
        }
        super.update(changedProperties);
        this.__childPart = (0,lit_html__WEBPACK_IMPORTED_MODULE_1__.render)(value, this.renderRoot, this.renderOptions);
    }
    /**
     * Invoked when the component is added to the document's DOM.
     *
     * In `connectedCallback()` you should setup tasks that should only occur when
     * the element is connected to the document. The most common of these is
     * adding event listeners to nodes external to the element, like a keydown
     * event handler added to the window.
     *
     * ```ts
     * connectedCallback() {
     *   super.connectedCallback();
     *   addEventListener('keydown', this._handleKeydown);
     * }
     * ```
     *
     * Typically, anything done in `connectedCallback()` should be undone when the
     * element is disconnected, in `disconnectedCallback()`.
     *
     * @category lifecycle
     */
    connectedCallback() {
        var _a;
        super.connectedCallback();
        (_a = this.__childPart) === null || _a === void 0 ? void 0 : _a.setConnected(true);
    }
    /**
     * Invoked when the component is removed from the document's DOM.
     *
     * This callback is the main signal to the element that it may no longer be
     * used. `disconnectedCallback()` should ensure that nothing is holding a
     * reference to the element (such as event listeners added to nodes external
     * to the element), so that it is free to be garbage collected.
     *
     * ```ts
     * disconnectedCallback() {
     *   super.disconnectedCallback();
     *   window.removeEventListener('keydown', this._handleKeydown);
     * }
     * ```
     *
     * An element may be re-connected after being disconnected.
     *
     * @category lifecycle
     */
    disconnectedCallback() {
        var _a;
        super.disconnectedCallback();
        (_a = this.__childPart) === null || _a === void 0 ? void 0 : _a.setConnected(false);
    }
    /**
     * Invoked on each update to perform rendering tasks. This method may return
     * any value renderable by lit-html's `ChildPart` - typically a
     * `TemplateResult`. Setting properties inside this method will *not* trigger
     * the element to update.
     * @category rendering
     */
    render() {
        return lit_html__WEBPACK_IMPORTED_MODULE_1__.noChange;
    }
}
/**
 * Ensure this class is marked as `finalized` as an optimization ensuring
 * it will not needlessly try to `finalize`.
 *
 * Note this property name is a string to prevent breaking Closure JS Compiler
 * optimizations. See @lit/reactive-element for more information.
 */
LitElement['finalized'] = true;
// This property needs to remain unminified.
LitElement['_$litElement$'] = true;
// Install hydration if available
(_b = globalThis.litElementHydrateSupport) === null || _b === void 0 ? void 0 : _b.call(globalThis, { LitElement });
// Apply polyfills if available
const polyfillSupport = DEV_MODE
    ? globalThis.litElementPolyfillSupportDevMode
    : globalThis.litElementPolyfillSupport;
polyfillSupport === null || polyfillSupport === void 0 ? void 0 : polyfillSupport({ LitElement });
// DEV mode warnings
if (DEV_MODE) {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    // Note, for compatibility with closure compilation, this access
    // needs to be as a string property index.
    LitElement['finalize'] = function () {
        const finalized = _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.ReactiveElement.finalize.call(this);
        if (!finalized) {
            return false;
        }
        const warnRemovedOrRenamed = (obj, name, renamed = false) => {
            if (obj.hasOwnProperty(name)) {
                const ctorName = (typeof obj === 'function' ? obj : obj.constructor)
                    .name;
                issueWarning(renamed ? 'renamed-api' : 'removed-api', `\`${name}\` is implemented on class ${ctorName}. It ` +
                    `has been ${renamed ? 'renamed' : 'removed'} ` +
                    `in this version of LitElement.`);
            }
        };
        warnRemovedOrRenamed(this, 'render');
        warnRemovedOrRenamed(this, 'getStyles', true);
        warnRemovedOrRenamed(this.prototype, 'adoptStyles');
        return true;
    };
    /* eslint-enable @typescript-eslint/no-explicit-any */
}
/**
 * END USERS SHOULD NOT RELY ON THIS OBJECT.
 *
 * Private exports for use by other Lit packages, not intended for use by
 * external users.
 *
 * We currently do not make a mangled rollup build of the lit-ssr code. In order
 * to keep a number of (otherwise private) top-level exports  mangled in the
 * client side code, we export a _$LE object containing those members (or
 * helper methods for accessing private fields of those members), and then
 * re-export them for use in lit-ssr. This keeps lit-ssr agnostic to whether the
 * client-side code is being used in `dev` mode or `prod` mode.
 *
 * This has a unique name, to disambiguate it from private exports in
 * lit-html, since this module re-exports all of lit-html.
 *
 * @private
 */
const _$LE = {
    _$attributeToProperty: (el, name, value) => {
        // eslint-disable-next-line
        el._$attributeToProperty(name, value);
    },
    // eslint-disable-next-line
    _$changedProperties: (el) => el._$changedProperties,
};
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for LitElement usage.
((_c = globalThis.litElementVersions) !== null && _c !== void 0 ? _c : (globalThis.litElementVersions = [])).push('3.2.0');
if (DEV_MODE && globalThis.litElementVersions.length > 1) {
    issueWarning('multiple-versions', `Multiple versions of Lit loaded. Loading multiple versions ` +
        `is not recommended.`);
}
//# sourceMappingURL=lit-element.js.map

/***/ }),

/***/ "./node_modules/lit-html/development/lit-html.js":
/*!*******************************************************!*\
  !*** ./node_modules/lit-html/development/lit-html.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "INTERNAL": () => (/* binding */ INTERNAL),
/* harmony export */   "_$LH": () => (/* binding */ _$LH),
/* harmony export */   "html": () => (/* binding */ html),
/* harmony export */   "noChange": () => (/* binding */ noChange),
/* harmony export */   "nothing": () => (/* binding */ nothing),
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "svg": () => (/* binding */ svg)
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var _a, _b, _c, _d;
const DEV_MODE = true;
const ENABLE_EXTRA_SECURITY_HOOKS = true;
const ENABLE_SHADYDOM_NOPATCH = true;
/**
 * Useful for visualizing and logging insights into what the Lit template system is doing.
 *
 * Compiled out of prod mode builds.
 */
const debugLogEvent = DEV_MODE
    ? (event) => {
        const shouldEmit = window
            .emitLitDebugLogEvents;
        if (shouldEmit) {
            window.dispatchEvent(new CustomEvent('lit-debug', {
                detail: event,
            }));
        }
    }
    : undefined;
// Used for connecting beginRender and endRender events when there are nested
// renders when errors are thrown preventing an endRender event from being
// called.
let debugLogRenderId = 0;
/**
 * `true` if we're building for google3 with temporary back-compat helpers.
 * This export is not present in prod builds.
 * @internal
 */
const INTERNAL = true;
let issueWarning;
if (DEV_MODE) {
    (_a = globalThis.litIssuedWarnings) !== null && _a !== void 0 ? _a : (globalThis.litIssuedWarnings = new Set());
    // Issue a warning, if we haven't already.
    issueWarning = (code, warning) => {
        warning += code
            ? ` See https://lit.dev/msg/${code} for more information.`
            : '';
        if (!globalThis.litIssuedWarnings.has(warning)) {
            console.warn(warning);
            globalThis.litIssuedWarnings.add(warning);
        }
    };
    issueWarning('dev-mode', `Lit is in dev mode. Not recommended for production!`);
}
const wrap = ENABLE_SHADYDOM_NOPATCH &&
    ((_b = window.ShadyDOM) === null || _b === void 0 ? void 0 : _b.inUse) &&
    ((_c = window.ShadyDOM) === null || _c === void 0 ? void 0 : _c.noPatch) === true
    ? window.ShadyDOM.wrap
    : (node) => node;
const trustedTypes = globalThis.trustedTypes;
/**
 * Our TrustedTypePolicy for HTML which is declared using the html template
 * tag function.
 *
 * That HTML is a developer-authored constant, and is parsed with innerHTML
 * before any untrusted expressions have been mixed in. Therefor it is
 * considered safe by construction.
 */
const policy = trustedTypes
    ? trustedTypes.createPolicy('lit-html', {
        createHTML: (s) => s,
    })
    : undefined;
const identityFunction = (value) => value;
const noopSanitizer = (_node, _name, _type) => identityFunction;
/** Sets the global sanitizer factory. */
const setSanitizer = (newSanitizer) => {
    if (!ENABLE_EXTRA_SECURITY_HOOKS) {
        return;
    }
    if (sanitizerFactoryInternal !== noopSanitizer) {
        throw new Error(`Attempted to overwrite existing lit-html security policy.` +
            ` setSanitizeDOMValueFactory should be called at most once.`);
    }
    sanitizerFactoryInternal = newSanitizer;
};
/**
 * Only used in internal tests, not a part of the public API.
 */
const _testOnlyClearSanitizerFactoryDoNotCallOrElse = () => {
    sanitizerFactoryInternal = noopSanitizer;
};
const createSanitizer = (node, name, type) => {
    return sanitizerFactoryInternal(node, name, type);
};
// Added to an attribute name to mark the attribute as bound so we can find
// it easily.
const boundAttributeSuffix = '$lit$';
// This marker is used in many syntactic positions in HTML, so it must be
// a valid element name and attribute name. We don't support dynamic names (yet)
// but this at least ensures that the parse tree is closer to the template
// intention.
const marker = `lit$${String(Math.random()).slice(9)}$`;
// String used to tell if a comment is a marker comment
const markerMatch = '?' + marker;
// Text used to insert a comment marker node. We use processing instruction
// syntax because it's slightly smaller, but parses as a comment node.
const nodeMarker = `<${markerMatch}>`;
const d = document;
// Creates a dynamic marker. We never have to search for these in the DOM.
const createMarker = (v = '') => d.createComment(v);
const isPrimitive = (value) => value === null || (typeof value != 'object' && typeof value != 'function');
const isArray = Array.isArray;
const isIterable = (value) => {
    var _a;
    return isArray(value) ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        typeof ((_a = value) === null || _a === void 0 ? void 0 : _a[Symbol.iterator]) === 'function';
};
const SPACE_CHAR = `[ \t\n\f\r]`;
const ATTR_VALUE_CHAR = `[^ \t\n\f\r"'\`<>=]`;
const NAME_CHAR = `[^\\s"'>=/]`;
// These regexes represent the five parsing states that we care about in the
// Template's HTML scanner. They match the *end* of the state they're named
// after.
// Depending on the match, we transition to a new state. If there's no match,
// we stay in the same state.
// Note that the regexes are stateful. We utilize lastIndex and sync it
// across the multiple regexes used. In addition to the five regexes below
// we also dynamically create a regex to find the matching end tags for raw
// text elements.
/**
 * End of text is: `<` followed by:
 *   (comment start) or (tag) or (dynamic tag binding)
 */
const textEndRegex = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
const COMMENT_START = 1;
const TAG_NAME = 2;
const DYNAMIC_TAG_NAME = 3;
const commentEndRegex = /-->/g;
/**
 * Comments not started with <!--, like </{, can be ended by a single `>`
 */
const comment2EndRegex = />/g;
/**
 * The tagEnd regex matches the end of the "inside an opening" tag syntax
 * position. It either matches a `>`, an attribute-like sequence, or the end
 * of the string after a space (attribute-name position ending).
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#elements-attributes
 *
 * " \t\n\f\r" are HTML space characters:
 * https://infra.spec.whatwg.org/#ascii-whitespace
 *
 * So an attribute is:
 *  * The name: any character except a whitespace character, ("), ('), ">",
 *    "=", or "/". Note: this is different from the HTML spec which also excludes control characters.
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */
const tagEndRegex = new RegExp(`>|${SPACE_CHAR}(?:(${NAME_CHAR}+)(${SPACE_CHAR}*=${SPACE_CHAR}*(?:${ATTR_VALUE_CHAR}|("|')|))|$)`, 'g');
const ENTIRE_MATCH = 0;
const ATTRIBUTE_NAME = 1;
const SPACES_AND_EQUALS = 2;
const QUOTE_CHAR = 3;
const singleQuoteAttrEndRegex = /'/g;
const doubleQuoteAttrEndRegex = /"/g;
/**
 * Matches the raw text elements.
 *
 * Comments are not parsed within raw text elements, so we need to search their
 * text content for marker strings.
 */
const rawTextElement = /^(?:script|style|textarea|title)$/i;
/** TemplateResult types */
const HTML_RESULT = 1;
const SVG_RESULT = 2;
// TemplatePart types
// IMPORTANT: these must match the values in PartType
const ATTRIBUTE_PART = 1;
const CHILD_PART = 2;
const PROPERTY_PART = 3;
const BOOLEAN_ATTRIBUTE_PART = 4;
const EVENT_PART = 5;
const ELEMENT_PART = 6;
const COMMENT_PART = 7;
/**
 * Generates a template literal tag function that returns a TemplateResult with
 * the given result type.
 */
const tag = (type) => (strings, ...values) => {
    // Warn against templates octal escape sequences
    // We do this here rather than in render so that the warning is closer to the
    // template definition.
    if (DEV_MODE && strings.some((s) => s === undefined)) {
        console.warn('Some template strings are undefined.\n' +
            'This is probably caused by illegal octal escape sequences.');
    }
    return {
        // This property needs to remain unminified.
        ['_$litType$']: type,
        strings,
        values,
    };
};
/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 *
 * ```ts
 * const header = (title: string) => html`<h1>${title}</h1>`;
 * ```
 *
 * The `html` tag returns a description of the DOM to render as a value. It is
 * lazy, meaning no work is done until the template is rendered. When rendering,
 * if a template comes from the same expression as a previously rendered result,
 * it's efficiently updated instead of replaced.
 */
const html = tag(HTML_RESULT);
/**
 * Interprets a template literal as an SVG fragment that can efficiently
 * render to and update a container.
 *
 * ```ts
 * const rect = svg`<rect width="10" height="10"></rect>`;
 *
 * const myImage = html`
 *   <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
 *     ${rect}
 *   </svg>`;
 * ```
 *
 * The `svg` *tag function* should only be used for SVG fragments, or elements
 * that would be contained **inside** an `<svg>` HTML element. A common error is
 * placing an `<svg>` *element* in a template tagged with the `svg` tag
 * function. The `<svg>` element is an HTML element and should be used within a
 * template tagged with the {@linkcode html} tag function.
 *
 * In LitElement usage, it's invalid to return an SVG fragment from the
 * `render()` method, as the SVG fragment will be contained within the element's
 * shadow root and thus cannot be used within an `<svg>` HTML element.
 */
const svg = tag(SVG_RESULT);
/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
const noChange = Symbol.for('lit-noChange');
/**
 * A sentinel value that signals a ChildPart to fully clear its content.
 *
 * ```ts
 * const button = html`${
 *  user.isAdmin
 *    ? html`<button>DELETE</button>`
 *    : nothing
 * }`;
 * ```
 *
 * Prefer using `nothing` over other falsy values as it provides a consistent
 * behavior between various expression binding contexts.
 *
 * In child expressions, `undefined`, `null`, `''`, and `nothing` all behave the
 * same and render no nodes. In attribute expressions, `nothing` _removes_ the
 * attribute, while `undefined` and `null` will render an empty string. In
 * property expressions `nothing` becomes `undefined`.
 */
const nothing = Symbol.for('lit-nothing');
/**
 * The cache of prepared templates, keyed by the tagged TemplateStringsArray
 * and _not_ accounting for the specific template tag used. This means that
 * template tags cannot be dynamic - the must statically be one of html, svg,
 * or attr. This restriction simplifies the cache lookup, which is on the hot
 * path for rendering.
 */
const templateCache = new WeakMap();
/**
 * Renders a value, usually a lit-html TemplateResult, to the container.
 * @param value
 * @param container
 * @param options
 */
const render = (value, container, options) => {
    var _a, _b, _c;
    const renderId = DEV_MODE ? debugLogRenderId++ : 0;
    const partOwnerNode = (_a = options === null || options === void 0 ? void 0 : options.renderBefore) !== null && _a !== void 0 ? _a : container;
    // This property needs to remain unminified.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let part = partOwnerNode['_$litPart$'];
    debugLogEvent === null || debugLogEvent === void 0 ? void 0 : debugLogEvent({
        kind: 'begin render',
        id: renderId,
        value,
        container,
        options,
        part,
    });
    if (part === undefined) {
        const endNode = (_b = options === null || options === void 0 ? void 0 : options.renderBefore) !== null && _b !== void 0 ? _b : null;
        // Internal modification: don't clear container to match lit-html 2.0
        if (INTERNAL &&
            ((_c = options) === null || _c === void 0 ? void 0 : _c.clearContainerForLit2MigrationOnly) ===
                true) {
            let n = container.firstChild;
            // Clear only up to the `endNode` aka `renderBefore` node.
            while (n && n !== endNode) {
                const next = n.nextSibling;
                n.remove();
                n = next;
            }
        }
        // This property needs to remain unminified.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        partOwnerNode['_$litPart$'] = part = new ChildPart(container.insertBefore(createMarker(), endNode), endNode, undefined, options !== null && options !== void 0 ? options : {});
    }
    part._$setValue(value);
    debugLogEvent === null || debugLogEvent === void 0 ? void 0 : debugLogEvent({
        kind: 'end render',
        id: renderId,
        value,
        container,
        options,
        part,
    });
    return part;
};
if (ENABLE_EXTRA_SECURITY_HOOKS) {
    render.setSanitizer = setSanitizer;
    render.createSanitizer = createSanitizer;
    if (DEV_MODE) {
        render._testOnlyClearSanitizerFactoryDoNotCallOrElse =
            _testOnlyClearSanitizerFactoryDoNotCallOrElse;
    }
}
const walker = d.createTreeWalker(d, 129 /* NodeFilter.SHOW_{ELEMENT|COMMENT} */, null, false);
let sanitizerFactoryInternal = noopSanitizer;
/**
 * Returns an HTML string for the given TemplateStringsArray and result type
 * (HTML or SVG), along with the case-sensitive bound attribute names in
 * template order. The HTML contains comment comment markers denoting the
 * `ChildPart`s and suffixes on bound attributes denoting the `AttributeParts`.
 *
 * @param strings template strings array
 * @param type HTML or SVG
 * @return Array containing `[html, attrNames]` (array returned for terseness,
 *     to avoid object fields since this code is shared with non-minified SSR
 *     code)
 */
const getTemplateHtml = (strings, type) => {
    // Insert makers into the template HTML to represent the position of
    // bindings. The following code scans the template strings to determine the
    // syntactic position of the bindings. They can be in text position, where
    // we insert an HTML comment, attribute value position, where we insert a
    // sentinel string and re-write the attribute name, or inside a tag where
    // we insert the sentinel string.
    const l = strings.length - 1;
    // Stores the case-sensitive bound attribute names in the order of their
    // parts. ElementParts are also reflected in this array as undefined
    // rather than a string, to disambiguate from attribute bindings.
    const attrNames = [];
    let html = type === SVG_RESULT ? '<svg>' : '';
    // When we're inside a raw text tag (not it's text content), the regex
    // will still be tagRegex so we can find attributes, but will switch to
    // this regex when the tag ends.
    let rawTextEndRegex;
    // The current parsing state, represented as a reference to one of the
    // regexes
    let regex = textEndRegex;
    for (let i = 0; i < l; i++) {
        const s = strings[i];
        // The index of the end of the last attribute name. When this is
        // positive at end of a string, it means we're in an attribute value
        // position and need to rewrite the attribute name.
        // We also use a special value of -2 to indicate that we encountered
        // the end of a string in attribute name position.
        let attrNameEndIndex = -1;
        let attrName;
        let lastIndex = 0;
        let match;
        // The conditions in this loop handle the current parse state, and the
        // assignments to the `regex` variable are the state transitions.
        while (lastIndex < s.length) {
            // Make sure we start searching from where we previously left off
            regex.lastIndex = lastIndex;
            match = regex.exec(s);
            if (match === null) {
                break;
            }
            lastIndex = regex.lastIndex;
            if (regex === textEndRegex) {
                if (match[COMMENT_START] === '!--') {
                    regex = commentEndRegex;
                }
                else if (match[COMMENT_START] !== undefined) {
                    // We started a weird comment, like </{
                    regex = comment2EndRegex;
                }
                else if (match[TAG_NAME] !== undefined) {
                    if (rawTextElement.test(match[TAG_NAME])) {
                        // Record if we encounter a raw-text element. We'll switch to
                        // this regex at the end of the tag.
                        rawTextEndRegex = new RegExp(`</${match[TAG_NAME]}`, 'g');
                    }
                    regex = tagEndRegex;
                }
                else if (match[DYNAMIC_TAG_NAME] !== undefined) {
                    if (DEV_MODE) {
                        throw new Error('Bindings in tag names are not supported. Please use static templates instead. ' +
                            'See https://lit.dev/docs/templates/expressions/#static-expressions');
                    }
                    regex = tagEndRegex;
                }
            }
            else if (regex === tagEndRegex) {
                if (match[ENTIRE_MATCH] === '>') {
                    // End of a tag. If we had started a raw-text element, use that
                    // regex
                    regex = rawTextEndRegex !== null && rawTextEndRegex !== void 0 ? rawTextEndRegex : textEndRegex;
                    // We may be ending an unquoted attribute value, so make sure we
                    // clear any pending attrNameEndIndex
                    attrNameEndIndex = -1;
                }
                else if (match[ATTRIBUTE_NAME] === undefined) {
                    // Attribute name position
                    attrNameEndIndex = -2;
                }
                else {
                    attrNameEndIndex = regex.lastIndex - match[SPACES_AND_EQUALS].length;
                    attrName = match[ATTRIBUTE_NAME];
                    regex =
                        match[QUOTE_CHAR] === undefined
                            ? tagEndRegex
                            : match[QUOTE_CHAR] === '"'
                                ? doubleQuoteAttrEndRegex
                                : singleQuoteAttrEndRegex;
                }
            }
            else if (regex === doubleQuoteAttrEndRegex ||
                regex === singleQuoteAttrEndRegex) {
                regex = tagEndRegex;
            }
            else if (regex === commentEndRegex || regex === comment2EndRegex) {
                regex = textEndRegex;
            }
            else {
                // Not one of the five state regexes, so it must be the dynamically
                // created raw text regex and we're at the close of that element.
                regex = tagEndRegex;
                rawTextEndRegex = undefined;
            }
        }
        if (DEV_MODE) {
            // If we have a attrNameEndIndex, which indicates that we should
            // rewrite the attribute name, assert that we're in a valid attribute
            // position - either in a tag, or a quoted attribute value.
            console.assert(attrNameEndIndex === -1 ||
                regex === tagEndRegex ||
                regex === singleQuoteAttrEndRegex ||
                regex === doubleQuoteAttrEndRegex, 'unexpected parse state B');
        }
        // We have four cases:
        //  1. We're in text position, and not in a raw text element
        //     (regex === textEndRegex): insert a comment marker.
        //  2. We have a non-negative attrNameEndIndex which means we need to
        //     rewrite the attribute name to add a bound attribute suffix.
        //  3. We're at the non-first binding in a multi-binding attribute, use a
        //     plain marker.
        //  4. We're somewhere else inside the tag. If we're in attribute name
        //     position (attrNameEndIndex === -2), add a sequential suffix to
        //     generate a unique attribute name.
        // Detect a binding next to self-closing tag end and insert a space to
        // separate the marker from the tag end:
        const end = regex === tagEndRegex && strings[i + 1].startsWith('/>') ? ' ' : '';
        html +=
            regex === textEndRegex
                ? s + nodeMarker
                : attrNameEndIndex >= 0
                    ? (attrNames.push(attrName),
                        s.slice(0, attrNameEndIndex) +
                            boundAttributeSuffix +
                            s.slice(attrNameEndIndex)) +
                        marker +
                        end
                    : s +
                        marker +
                        (attrNameEndIndex === -2 ? (attrNames.push(undefined), i) : end);
    }
    const htmlResult = html + (strings[l] || '<?>') + (type === SVG_RESULT ? '</svg>' : '');
    // A security check to prevent spoofing of Lit template results.
    // In the future, we may be able to replace this with Array.isTemplateObject,
    // though we might need to make that check inside of the html and svg
    // functions, because precompiled templates don't come in as
    // TemplateStringArray objects.
    if (!Array.isArray(strings) || !strings.hasOwnProperty('raw')) {
        let message = 'invalid template strings array';
        if (DEV_MODE) {
            message =
                `Internal Error: expected template strings to be an array ` +
                    `with a 'raw' field. Please file a bug at ` +
                    `https://github.com/lit/lit/issues/new?template=bug_report.md ` +
                    `and include information about your build tooling, if any.`;
        }
        throw new Error(message);
    }
    // Returned as an array for terseness
    return [
        policy !== undefined
            ? policy.createHTML(htmlResult)
            : htmlResult,
        attrNames,
    ];
};
class Template {
    constructor(
    // This property needs to remain unminified.
    { strings, ['_$litType$']: type }, options) {
        /** @internal */
        this.parts = [];
        let node;
        let nodeIndex = 0;
        let attrNameIndex = 0;
        const partCount = strings.length - 1;
        const parts = this.parts;
        // Create template element
        const [html, attrNames] = getTemplateHtml(strings, type);
        this.el = Template.createElement(html, options);
        walker.currentNode = this.el.content;
        // Reparent SVG nodes into template root
        if (type === SVG_RESULT) {
            const content = this.el.content;
            const svgElement = content.firstChild;
            svgElement.remove();
            content.append(...svgElement.childNodes);
        }
        // Walk the template to find binding markers and create TemplateParts
        while ((node = walker.nextNode()) !== null && parts.length < partCount) {
            if (node.nodeType === 1) {
                if (DEV_MODE) {
                    const tag = node.localName;
                    // Warn if `textarea` includes an expression and throw if `template`
                    // does since these are not supported. We do this by checking
                    // innerHTML for anything that looks like a marker. This catches
                    // cases like bindings in textarea there markers turn into text nodes.
                    if (/^(?:textarea|template)$/i.test(tag) &&
                        node.innerHTML.includes(marker)) {
                        const m = `Expressions are not supported inside \`${tag}\` ` +
                            `elements. See https://lit.dev/msg/expression-in-${tag} for more ` +
                            `information.`;
                        if (tag === 'template') {
                            throw new Error(m);
                        }
                        else
                            issueWarning('', m);
                    }
                }
                // TODO (justinfagnani): for attempted dynamic tag names, we don't
                // increment the bindingIndex, and it'll be off by 1 in the element
                // and off by two after it.
                if (node.hasAttributes()) {
                    // We defer removing bound attributes because on IE we might not be
                    // iterating attributes in their template order, and would sometimes
                    // remove an attribute that we still need to create a part for.
                    const attrsToRemove = [];
                    for (const name of node.getAttributeNames()) {
                        // `name` is the name of the attribute we're iterating over, but not
                        // _neccessarily_ the name of the attribute we will create a part
                        // for. They can be different in browsers that don't iterate on
                        // attributes in source order. In that case the attrNames array
                        // contains the attribute name we'll process next. We only need the
                        // attribute name here to know if we should process a bound attribute
                        // on this element.
                        if (name.endsWith(boundAttributeSuffix) ||
                            name.startsWith(marker)) {
                            const realName = attrNames[attrNameIndex++];
                            attrsToRemove.push(name);
                            if (realName !== undefined) {
                                // Lowercase for case-sensitive SVG attributes like viewBox
                                const value = node.getAttribute(realName.toLowerCase() + boundAttributeSuffix);
                                const statics = value.split(marker);
                                const m = /([.?@])?(.*)/.exec(realName);
                                parts.push({
                                    type: ATTRIBUTE_PART,
                                    index: nodeIndex,
                                    name: m[2],
                                    strings: statics,
                                    ctor: m[1] === '.'
                                        ? PropertyPart
                                        : m[1] === '?'
                                            ? BooleanAttributePart
                                            : m[1] === '@'
                                                ? EventPart
                                                : AttributePart,
                                });
                            }
                            else {
                                parts.push({
                                    type: ELEMENT_PART,
                                    index: nodeIndex,
                                });
                            }
                        }
                    }
                    for (const name of attrsToRemove) {
                        node.removeAttribute(name);
                    }
                }
                // TODO (justinfagnani): benchmark the regex against testing for each
                // of the 3 raw text element names.
                if (rawTextElement.test(node.tagName)) {
                    // For raw text elements we need to split the text content on
                    // markers, create a Text node for each segment, and create
                    // a TemplatePart for each marker.
                    const strings = node.textContent.split(marker);
                    const lastIndex = strings.length - 1;
                    if (lastIndex > 0) {
                        node.textContent = trustedTypes
                            ? trustedTypes.emptyScript
                            : '';
                        // Generate a new text node for each literal section
                        // These nodes are also used as the markers for node parts
                        // We can't use empty text nodes as markers because they're
                        // normalized when cloning in IE (could simplify when
                        // IE is no longer supported)
                        for (let i = 0; i < lastIndex; i++) {
                            node.append(strings[i], createMarker());
                            // Walk past the marker node we just added
                            walker.nextNode();
                            parts.push({ type: CHILD_PART, index: ++nodeIndex });
                        }
                        // Note because this marker is added after the walker's current
                        // node, it will be walked to in the outer loop (and ignored), so
                        // we don't need to adjust nodeIndex here
                        node.append(strings[lastIndex], createMarker());
                    }
                }
            }
            else if (node.nodeType === 8) {
                const data = node.data;
                if (data === markerMatch) {
                    parts.push({ type: CHILD_PART, index: nodeIndex });
                }
                else {
                    let i = -1;
                    while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
                        // Comment node has a binding marker inside, make an inactive part
                        // The binding won't work, but subsequent bindings will
                        parts.push({ type: COMMENT_PART, index: nodeIndex });
                        // Move to the end of the match
                        i += marker.length - 1;
                    }
                }
            }
            nodeIndex++;
        }
        debugLogEvent === null || debugLogEvent === void 0 ? void 0 : debugLogEvent({
            kind: 'template prep',
            template: this,
            clonableTemplate: this.el,
            parts: this.parts,
            strings,
        });
    }
    // Overridden via `litHtmlPolyfillSupport` to provide platform support.
    /** @nocollapse */
    static createElement(html, _options) {
        const el = d.createElement('template');
        el.innerHTML = html;
        return el;
    }
}
function resolveDirective(part, value, parent = part, attributeIndex) {
    var _a, _b, _c;
    var _d;
    // Bail early if the value is explicitly noChange. Note, this means any
    // nested directive is still attached and is not run.
    if (value === noChange) {
        return value;
    }
    let currentDirective = attributeIndex !== undefined
        ? (_a = parent.__directives) === null || _a === void 0 ? void 0 : _a[attributeIndex]
        : parent.__directive;
    const nextDirectiveConstructor = isPrimitive(value)
        ? undefined
        : // This property needs to remain unminified.
            value['_$litDirective$'];
    if ((currentDirective === null || currentDirective === void 0 ? void 0 : currentDirective.constructor) !== nextDirectiveConstructor) {
        // This property needs to remain unminified.
        (_b = currentDirective === null || currentDirective === void 0 ? void 0 : currentDirective['_$notifyDirectiveConnectionChanged']) === null || _b === void 0 ? void 0 : _b.call(currentDirective, false);
        if (nextDirectiveConstructor === undefined) {
            currentDirective = undefined;
        }
        else {
            currentDirective = new nextDirectiveConstructor(part);
            currentDirective._$initialize(part, parent, attributeIndex);
        }
        if (attributeIndex !== undefined) {
            ((_c = (_d = parent).__directives) !== null && _c !== void 0 ? _c : (_d.__directives = []))[attributeIndex] =
                currentDirective;
        }
        else {
            parent.__directive = currentDirective;
        }
    }
    if (currentDirective !== undefined) {
        value = resolveDirective(part, currentDirective._$resolve(part, value.values), currentDirective, attributeIndex);
    }
    return value;
}
/**
 * An updateable instance of a Template. Holds references to the Parts used to
 * update the template instance.
 */
class TemplateInstance {
    constructor(template, parent) {
        /** @internal */
        this._parts = [];
        /** @internal */
        this._$disconnectableChildren = undefined;
        this._$template = template;
        this._$parent = parent;
    }
    // Called by ChildPart parentNode getter
    get parentNode() {
        return this._$parent.parentNode;
    }
    // See comment in Disconnectable interface for why this is a getter
    get _$isConnected() {
        return this._$parent._$isConnected;
    }
    // This method is separate from the constructor because we need to return a
    // DocumentFragment and we don't want to hold onto it with an instance field.
    _clone(options) {
        var _a;
        const { el: { content }, parts: parts, } = this._$template;
        const fragment = ((_a = options === null || options === void 0 ? void 0 : options.creationScope) !== null && _a !== void 0 ? _a : d).importNode(content, true);
        walker.currentNode = fragment;
        let node = walker.nextNode();
        let nodeIndex = 0;
        let partIndex = 0;
        let templatePart = parts[0];
        while (templatePart !== undefined) {
            if (nodeIndex === templatePart.index) {
                let part;
                if (templatePart.type === CHILD_PART) {
                    part = new ChildPart(node, node.nextSibling, this, options);
                }
                else if (templatePart.type === ATTRIBUTE_PART) {
                    part = new templatePart.ctor(node, templatePart.name, templatePart.strings, this, options);
                }
                else if (templatePart.type === ELEMENT_PART) {
                    part = new ElementPart(node, this, options);
                }
                this._parts.push(part);
                templatePart = parts[++partIndex];
            }
            if (nodeIndex !== (templatePart === null || templatePart === void 0 ? void 0 : templatePart.index)) {
                node = walker.nextNode();
                nodeIndex++;
            }
        }
        return fragment;
    }
    _update(values) {
        let i = 0;
        for (const part of this._parts) {
            if (part !== undefined) {
                debugLogEvent === null || debugLogEvent === void 0 ? void 0 : debugLogEvent({
                    kind: 'set part',
                    part,
                    value: values[i],
                    valueIndex: i,
                    values,
                    templateInstance: this,
                });
                if (part.strings !== undefined) {
                    part._$setValue(values, part, i);
                    // The number of values the part consumes is part.strings.length - 1
                    // since values are in between template spans. We increment i by 1
                    // later in the loop, so increment it by part.strings.length - 2 here
                    i += part.strings.length - 2;
                }
                else {
                    part._$setValue(values[i]);
                }
            }
            i++;
        }
    }
}
class ChildPart {
    constructor(startNode, endNode, parent, options) {
        var _a;
        this.type = CHILD_PART;
        this._$committedValue = nothing;
        // The following fields will be patched onto ChildParts when required by
        // AsyncDirective
        /** @internal */
        this._$disconnectableChildren = undefined;
        this._$startNode = startNode;
        this._$endNode = endNode;
        this._$parent = parent;
        this.options = options;
        // Note __isConnected is only ever accessed on RootParts (i.e. when there is
        // no _$parent); the value on a non-root-part is "don't care", but checking
        // for parent would be more code
        this.__isConnected = (_a = options === null || options === void 0 ? void 0 : options.isConnected) !== null && _a !== void 0 ? _a : true;
        if (ENABLE_EXTRA_SECURITY_HOOKS) {
            // Explicitly initialize for consistent class shape.
            this._textSanitizer = undefined;
        }
    }
    // See comment in Disconnectable interface for why this is a getter
    get _$isConnected() {
        var _a, _b;
        // ChildParts that are not at the root should always be created with a
        // parent; only RootChildNode's won't, so they return the local isConnected
        // state
        return (_b = (_a = this._$parent) === null || _a === void 0 ? void 0 : _a._$isConnected) !== null && _b !== void 0 ? _b : this.__isConnected;
    }
    /**
     * The parent node into which the part renders its content.
     *
     * A ChildPart's content consists of a range of adjacent child nodes of
     * `.parentNode`, possibly bordered by 'marker nodes' (`.startNode` and
     * `.endNode`).
     *
     * - If both `.startNode` and `.endNode` are non-null, then the part's content
     * consists of all siblings between `.startNode` and `.endNode`, exclusively.
     *
     * - If `.startNode` is non-null but `.endNode` is null, then the part's
     * content consists of all siblings following `.startNode`, up to and
     * including the last child of `.parentNode`. If `.endNode` is non-null, then
     * `.startNode` will always be non-null.
     *
     * - If both `.endNode` and `.startNode` are null, then the part's content
     * consists of all child nodes of `.parentNode`.
     */
    get parentNode() {
        let parentNode = wrap(this._$startNode).parentNode;
        const parent = this._$parent;
        if (parent !== undefined &&
            parentNode.nodeType === 11 /* Node.DOCUMENT_FRAGMENT */) {
            // If the parentNode is a DocumentFragment, it may be because the DOM is
            // still in the cloned fragment during initial render; if so, get the real
            // parentNode the part will be committed into by asking the parent.
            parentNode = parent.parentNode;
        }
        return parentNode;
    }
    /**
     * The part's leading marker node, if any. See `.parentNode` for more
     * information.
     */
    get startNode() {
        return this._$startNode;
    }
    /**
     * The part's trailing marker node, if any. See `.parentNode` for more
     * information.
     */
    get endNode() {
        return this._$endNode;
    }
    _$setValue(value, directiveParent = this) {
        if (DEV_MODE && this.parentNode === null) {
            throw new Error(`This \`ChildPart\` has no \`parentNode\` and therefore cannot accept a value. This likely means the element containing the part was manipulated in an unsupported way outside of Lit's control such that the part's marker nodes were ejected from DOM. For example, setting the element's \`innerHTML\` or \`textContent\` can do this.`);
        }
        value = resolveDirective(this, value, directiveParent);
        if (isPrimitive(value)) {
            // Non-rendering child values. It's important that these do not render
            // empty text nodes to avoid issues with preventing default <slot>
            // fallback content.
            if (value === nothing || value == null || value === '') {
                if (this._$committedValue !== nothing) {
                    debugLogEvent === null || debugLogEvent === void 0 ? void 0 : debugLogEvent({
                        kind: 'commit nothing to child',
                        start: this._$startNode,
                        end: this._$endNode,
                        parent: this._$parent,
                        options: this.options,
                    });
                    this._$clear();
                }
                this._$committedValue = nothing;
            }
            else if (value !== this._$committedValue && value !== noChange) {
                this._commitText(value);
            }
            // This property needs to remain unminified.
        }
        else if (value['_$litType$'] !== undefined) {
            this._commitTemplateResult(value);
        }
        else if (value.nodeType !== undefined) {
            this._commitNode(value);
        }
        else if (isIterable(value)) {
            this._commitIterable(value);
        }
        else {
            // Fallback, will render the string representation
            this._commitText(value);
        }
    }
    _insert(node, ref = this._$endNode) {
        return wrap(wrap(this._$startNode).parentNode).insertBefore(node, ref);
    }
    _commitNode(value) {
        var _a;
        if (this._$committedValue !== value) {
            this._$clear();
            if (ENABLE_EXTRA_SECURITY_HOOKS &&
                sanitizerFactoryInternal !== noopSanitizer) {
                const parentNodeName = (_a = this._$startNode.parentNode) === null || _a === void 0 ? void 0 : _a.nodeName;
                if (parentNodeName === 'STYLE' || parentNodeName === 'SCRIPT') {
                    let message = 'Forbidden';
                    if (DEV_MODE) {
                        if (parentNodeName === 'STYLE') {
                            message =
                                `Lit does not support binding inside style nodes. ` +
                                    `This is a security risk, as style injection attacks can ` +
                                    `exfiltrate data and spoof UIs. ` +
                                    `Consider instead using css\`...\` literals ` +
                                    `to compose styles, and make do dynamic styling with ` +
                                    `css custom properties, ::parts, <slot>s, ` +
                                    `and by mutating the DOM rather than stylesheets.`;
                        }
                        else {
                            message =
                                `Lit does not support binding inside script nodes. ` +
                                    `This is a security risk, as it could allow arbitrary ` +
                                    `code execution.`;
                        }
                    }
                    throw new Error(message);
                }
            }
            debugLogEvent === null || debugLogEvent === void 0 ? void 0 : debugLogEvent({
                kind: 'commit node',
                start: this._$startNode,
                parent: this._$parent,
                value: value.cloneNode(true),
                options: this.options,
            });
            this._$committedValue = this._insert(value);
        }
    }
    _commitText(value) {
        // If the committed value is a primitive it means we called _commitText on
        // the previous render, and we know that this._$startNode.nextSibling is a
        // Text node. We can now just replace the text content (.data) of the node.
        if (this._$committedValue !== nothing &&
            isPrimitive(this._$committedValue)) {
            const node = wrap(this._$startNode).nextSibling;
            if (ENABLE_EXTRA_SECURITY_HOOKS) {
                if (this._textSanitizer === undefined) {
                    this._textSanitizer = createSanitizer(node, 'data', 'property');
                }
                value = this._textSanitizer(value);
            }
            debugLogEvent === null || debugLogEvent === void 0 ? void 0 : debugLogEvent({
                kind: 'commit text',
                node,
                value,
                options: this.options,
            });
            node.data = value;
        }
        else {
            if (ENABLE_EXTRA_SECURITY_HOOKS) {
                const textNode = document.createTextNode('');
                this._commitNode(textNode);
                // When setting text content, for security purposes it matters a lot
                // what the parent is. For example, <style> and <script> need to be
                // handled with care, while <span> does not. So first we need to put a
                // text node into the document, then we can sanitize its content.
                if (this._textSanitizer === undefined) {
                    this._textSanitizer = createSanitizer(textNode, 'data', 'property');
                }
                value = this._textSanitizer(value);
                debugLogEvent === null || debugLogEvent === void 0 ? void 0 : debugLogEvent({
                    kind: 'commit text',
                    node: textNode,
                    value,
                    options: this.options,
                });
                textNode.data = value;
            }
            else {
                this._commitNode(d.createTextNode(value));
                debugLogEvent === null || debugLogEvent === void 0 ? void 0 : debugLogEvent({
                    kind: 'commit text',
                    node: wrap(this._$startNode).nextSibling,
                    value,
                    options: this.options,
                });
            }
        }
        this._$committedValue = value;
    }
    _commitTemplateResult(result) {
        var _a;
        // This property needs to remain unminified.
        const { values, ['_$litType$']: type } = result;
        // If $litType$ is a number, result is a plain TemplateResult and we get
        // the template from the template cache. If not, result is a
        // CompiledTemplateResult and _$litType$ is a CompiledTemplate and we need
        // to create the <template> element the first time we see it.
        const template = typeof type === 'number'
            ? this._$getTemplate(result)
            : (type.el === undefined &&
                (type.el = Template.createElement(type.h, this.options)),
                type);
        if (((_a = this._$committedValue) === null || _a === void 0 ? void 0 : _a._$template) === template) {
            debugLogEvent === null || debugLogEvent === void 0 ? void 0 : debugLogEvent({
                kind: 'template updating',
                template,
                instance: this._$committedValue,
                parts: this._$committedValue._parts,
                options: this.options,
                values,
            });
            this._$committedValue._update(values);
        }
        else {
            const instance = new TemplateInstance(template, this);
            const fragment = instance._clone(this.options);
            debugLogEvent === null || debugLogEvent === void 0 ? void 0 : debugLogEvent({
                kind: 'template instantiated',
                template,
                instance,
                parts: instance._parts,
                options: this.options,
                fragment,
                values,
            });
            instance._update(values);
            debugLogEvent === null || debugLogEvent === void 0 ? void 0 : debugLogEvent({
                kind: 'template instantiated and updated',
                template,
                instance,
                parts: instance._parts,
                options: this.options,
                fragment,
                values,
            });
            this._commitNode(fragment);
            this._$committedValue = instance;
        }
    }
    // Overridden via `litHtmlPolyfillSupport` to provide platform support.
    /** @internal */
    _$getTemplate(result) {
        let template = templateCache.get(result.strings);
        if (template === undefined) {
            templateCache.set(result.strings, (template = new Template(result)));
        }
        return template;
    }
    _commitIterable(value) {
        // For an Iterable, we create a new InstancePart per item, then set its
        // value to the item. This is a little bit of overhead for every item in
        // an Iterable, but it lets us recurse easily and efficiently update Arrays
        // of TemplateResults that will be commonly returned from expressions like:
        // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
        // If value is an array, then the previous render was of an
        // iterable and value will contain the ChildParts from the previous
        // render. If value is not an array, clear this part and make a new
        // array for ChildParts.
        if (!isArray(this._$committedValue)) {
            this._$committedValue = [];
            this._$clear();
        }
        // Lets us keep track of how many items we stamped so we can clear leftover
        // items from a previous render
        const itemParts = this._$committedValue;
        let partIndex = 0;
        let itemPart;
        for (const item of value) {
            if (partIndex === itemParts.length) {
                // If no existing part, create a new one
                // TODO (justinfagnani): test perf impact of always creating two parts
                // instead of sharing parts between nodes
                // https://github.com/lit/lit/issues/1266
                itemParts.push((itemPart = new ChildPart(this._insert(createMarker()), this._insert(createMarker()), this, this.options)));
            }
            else {
                // Reuse an existing part
                itemPart = itemParts[partIndex];
            }
            itemPart._$setValue(item);
            partIndex++;
        }
        if (partIndex < itemParts.length) {
            // itemParts always have end nodes
            this._$clear(itemPart && wrap(itemPart._$endNode).nextSibling, partIndex);
            // Truncate the parts array so _value reflects the current state
            itemParts.length = partIndex;
        }
    }
    /**
     * Removes the nodes contained within this Part from the DOM.
     *
     * @param start Start node to clear from, for clearing a subset of the part's
     *     DOM (used when truncating iterables)
     * @param from  When `start` is specified, the index within the iterable from
     *     which ChildParts are being removed, used for disconnecting directives in
     *     those Parts.
     *
     * @internal
     */
    _$clear(start = wrap(this._$startNode).nextSibling, from) {
        var _a;
        (_a = this._$notifyConnectionChanged) === null || _a === void 0 ? void 0 : _a.call(this, false, true, from);
        while (start && start !== this._$endNode) {
            const n = wrap(start).nextSibling;
            wrap(start).remove();
            start = n;
        }
    }
    /**
     * Implementation of RootPart's `isConnected`. Note that this metod
     * should only be called on `RootPart`s (the `ChildPart` returned from a
     * top-level `render()` call). It has no effect on non-root ChildParts.
     * @param isConnected Whether to set
     * @internal
     */
    setConnected(isConnected) {
        var _a;
        if (this._$parent === undefined) {
            this.__isConnected = isConnected;
            (_a = this._$notifyConnectionChanged) === null || _a === void 0 ? void 0 : _a.call(this, isConnected);
        }
        else if (DEV_MODE) {
            throw new Error('part.setConnected() may only be called on a ' +
                'RootPart returned from render().');
        }
    }
}
class AttributePart {
    constructor(element, name, strings, parent, options) {
        this.type = ATTRIBUTE_PART;
        /** @internal */
        this._$committedValue = nothing;
        /** @internal */
        this._$disconnectableChildren = undefined;
        this.element = element;
        this.name = name;
        this._$parent = parent;
        this.options = options;
        if (strings.length > 2 || strings[0] !== '' || strings[1] !== '') {
            this._$committedValue = new Array(strings.length - 1).fill(new String());
            this.strings = strings;
        }
        else {
            this._$committedValue = nothing;
        }
        if (ENABLE_EXTRA_SECURITY_HOOKS) {
            this._sanitizer = undefined;
        }
    }
    get tagName() {
        return this.element.tagName;
    }
    // See comment in Disconnectable interface for why this is a getter
    get _$isConnected() {
        return this._$parent._$isConnected;
    }
    /**
     * Sets the value of this part by resolving the value from possibly multiple
     * values and static strings and committing it to the DOM.
     * If this part is single-valued, `this._strings` will be undefined, and the
     * method will be called with a single value argument. If this part is
     * multi-value, `this._strings` will be defined, and the method is called
     * with the value array of the part's owning TemplateInstance, and an offset
     * into the value array from which the values should be read.
     * This method is overloaded this way to eliminate short-lived array slices
     * of the template instance values, and allow a fast-path for single-valued
     * parts.
     *
     * @param value The part value, or an array of values for multi-valued parts
     * @param valueIndex the index to start reading values from. `undefined` for
     *   single-valued parts
     * @param noCommit causes the part to not commit its value to the DOM. Used
     *   in hydration to prime attribute parts with their first-rendered value,
     *   but not set the attribute, and in SSR to no-op the DOM operation and
     *   capture the value for serialization.
     *
     * @internal
     */
    _$setValue(value, directiveParent = this, valueIndex, noCommit) {
        const strings = this.strings;
        // Whether any of the values has changed, for dirty-checking
        let change = false;
        if (strings === undefined) {
            // Single-value binding case
            value = resolveDirective(this, value, directiveParent, 0);
            change =
                !isPrimitive(value) ||
                    (value !== this._$committedValue && value !== noChange);
            if (change) {
                this._$committedValue = value;
            }
        }
        else {
            // Interpolation case
            const values = value;
            value = strings[0];
            let i, v;
            for (i = 0; i < strings.length - 1; i++) {
                v = resolveDirective(this, values[valueIndex + i], directiveParent, i);
                if (v === noChange) {
                    // If the user-provided value is `noChange`, use the previous value
                    v = this._$committedValue[i];
                }
                change || (change = !isPrimitive(v) || v !== this._$committedValue[i]);
                if (v === nothing) {
                    value = nothing;
                }
                else if (value !== nothing) {
                    value += (v !== null && v !== void 0 ? v : '') + strings[i + 1];
                }
                // We always record each value, even if one is `nothing`, for future
                // change detection.
                this._$committedValue[i] = v;
            }
        }
        if (change && !noCommit) {
            this._commitValue(value);
        }
    }
    /** @internal */
    _commitValue(value) {
        if (value === nothing) {
            wrap(this.element).removeAttribute(this.name);
        }
        else {
            if (ENABLE_EXTRA_SECURITY_HOOKS) {
                if (this._sanitizer === undefined) {
                    this._sanitizer = sanitizerFactoryInternal(this.element, this.name, 'attribute');
                }
                value = this._sanitizer(value !== null && value !== void 0 ? value : '');
            }
            debugLogEvent === null || debugLogEvent === void 0 ? void 0 : debugLogEvent({
                kind: 'commit attribute',
                element: this.element,
                name: this.name,
                value,
                options: this.options,
            });
            wrap(this.element).setAttribute(this.name, (value !== null && value !== void 0 ? value : ''));
        }
    }
}
class PropertyPart extends AttributePart {
    constructor() {
        super(...arguments);
        this.type = PROPERTY_PART;
    }
    /** @internal */
    _commitValue(value) {
        if (ENABLE_EXTRA_SECURITY_HOOKS) {
            if (this._sanitizer === undefined) {
                this._sanitizer = sanitizerFactoryInternal(this.element, this.name, 'property');
            }
            value = this._sanitizer(value);
        }
        debugLogEvent === null || debugLogEvent === void 0 ? void 0 : debugLogEvent({
            kind: 'commit property',
            element: this.element,
            name: this.name,
            value,
            options: this.options,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.element[this.name] = value === nothing ? undefined : value;
    }
}
// Temporary workaround for https://crbug.com/993268
// Currently, any attribute starting with "on" is considered to be a
// TrustedScript source. Such boolean attributes must be set to the equivalent
// trusted emptyScript value.
const emptyStringForBooleanAttribute = trustedTypes
    ? trustedTypes.emptyScript
    : '';
class BooleanAttributePart extends AttributePart {
    constructor() {
        super(...arguments);
        this.type = BOOLEAN_ATTRIBUTE_PART;
    }
    /** @internal */
    _commitValue(value) {
        debugLogEvent === null || debugLogEvent === void 0 ? void 0 : debugLogEvent({
            kind: 'commit boolean attribute',
            element: this.element,
            name: this.name,
            value: !!(value && value !== nothing),
            options: this.options,
        });
        if (value && value !== nothing) {
            wrap(this.element).setAttribute(this.name, emptyStringForBooleanAttribute);
        }
        else {
            wrap(this.element).removeAttribute(this.name);
        }
    }
}
class EventPart extends AttributePart {
    constructor(element, name, strings, parent, options) {
        super(element, name, strings, parent, options);
        this.type = EVENT_PART;
        if (DEV_MODE && this.strings !== undefined) {
            throw new Error(`A \`<${element.localName}>\` has a \`@${name}=...\` listener with ` +
                'invalid content. Event listeners in templates must have exactly ' +
                'one expression and no surrounding text.');
        }
    }
    // EventPart does not use the base _$setValue/_resolveValue implementation
    // since the dirty checking is more complex
    /** @internal */
    _$setValue(newListener, directiveParent = this) {
        var _a;
        newListener =
            (_a = resolveDirective(this, newListener, directiveParent, 0)) !== null && _a !== void 0 ? _a : nothing;
        if (newListener === noChange) {
            return;
        }
        const oldListener = this._$committedValue;
        // If the new value is nothing or any options change we have to remove the
        // part as a listener.
        const shouldRemoveListener = (newListener === nothing && oldListener !== nothing) ||
            newListener.capture !==
                oldListener.capture ||
            newListener.once !==
                oldListener.once ||
            newListener.passive !==
                oldListener.passive;
        // If the new value is not nothing and we removed the listener, we have
        // to add the part as a listener.
        const shouldAddListener = newListener !== nothing &&
            (oldListener === nothing || shouldRemoveListener);
        debugLogEvent === null || debugLogEvent === void 0 ? void 0 : debugLogEvent({
            kind: 'commit event listener',
            element: this.element,
            name: this.name,
            value: newListener,
            options: this.options,
            removeListener: shouldRemoveListener,
            addListener: shouldAddListener,
            oldListener,
        });
        if (shouldRemoveListener) {
            this.element.removeEventListener(this.name, this, oldListener);
        }
        if (shouldAddListener) {
            // Beware: IE11 and Chrome 41 don't like using the listener as the
            // options object. Figure out how to deal w/ this in IE11 - maybe
            // patch addEventListener?
            this.element.addEventListener(this.name, this, newListener);
        }
        this._$committedValue = newListener;
    }
    handleEvent(event) {
        var _a, _b;
        if (typeof this._$committedValue === 'function') {
            this._$committedValue.call((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.host) !== null && _b !== void 0 ? _b : this.element, event);
        }
        else {
            this._$committedValue.handleEvent(event);
        }
    }
}
class ElementPart {
    constructor(element, parent, options) {
        this.element = element;
        this.type = ELEMENT_PART;
        /** @internal */
        this._$disconnectableChildren = undefined;
        this._$parent = parent;
        this.options = options;
    }
    // See comment in Disconnectable interface for why this is a getter
    get _$isConnected() {
        return this._$parent._$isConnected;
    }
    _$setValue(value) {
        debugLogEvent === null || debugLogEvent === void 0 ? void 0 : debugLogEvent({
            kind: 'commit to element binding',
            element: this.element,
            value,
            options: this.options,
        });
        resolveDirective(this, value);
    }
}
/**
 * END USERS SHOULD NOT RELY ON THIS OBJECT.
 *
 * Private exports for use by other Lit packages, not intended for use by
 * external users.
 *
 * We currently do not make a mangled rollup build of the lit-ssr code. In order
 * to keep a number of (otherwise private) top-level exports  mangled in the
 * client side code, we export a _$LH object containing those members (or
 * helper methods for accessing private fields of those members), and then
 * re-export them for use in lit-ssr. This keeps lit-ssr agnostic to whether the
 * client-side code is being used in `dev` mode or `prod` mode.
 *
 * This has a unique name, to disambiguate it from private exports in
 * lit-element, which re-exports all of lit-html.
 *
 * @private
 */
const _$LH = {
    // Used in lit-ssr
    _boundAttributeSuffix: boundAttributeSuffix,
    _marker: marker,
    _markerMatch: markerMatch,
    _HTML_RESULT: HTML_RESULT,
    _getTemplateHtml: getTemplateHtml,
    // Used in hydrate
    _TemplateInstance: TemplateInstance,
    _isIterable: isIterable,
    _resolveDirective: resolveDirective,
    // Used in tests and private-ssr-support
    _ChildPart: ChildPart,
    _AttributePart: AttributePart,
    _BooleanAttributePart: BooleanAttributePart,
    _EventPart: EventPart,
    _PropertyPart: PropertyPart,
    _ElementPart: ElementPart,
};
// Apply polyfills if available
const polyfillSupport = DEV_MODE
    ? window.litHtmlPolyfillSupportDevMode
    : window.litHtmlPolyfillSupport;
polyfillSupport === null || polyfillSupport === void 0 ? void 0 : polyfillSupport(Template, ChildPart);
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for lit-html usage.
((_d = globalThis.litHtmlVersions) !== null && _d !== void 0 ? _d : (globalThis.litHtmlVersions = [])).push('2.2.0');
if (DEV_MODE && globalThis.litHtmlVersions.length > 1) {
    issueWarning('multiple-versions', `Multiple versions of Lit loaded. ` +
        `Loading multiple versions is not recommended.`);
}
//# sourceMappingURL=lit-html.js.map

/***/ }),

/***/ "./node_modules/lit/decorators.js":
/*!****************************************!*\
  !*** ./node_modules/lit/decorators.js ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "customElement": () => (/* reexport safe */ _lit_reactive_element_decorators_custom_element_js__WEBPACK_IMPORTED_MODULE_0__.customElement),
/* harmony export */   "eventOptions": () => (/* reexport safe */ _lit_reactive_element_decorators_event_options_js__WEBPACK_IMPORTED_MODULE_3__.eventOptions),
/* harmony export */   "property": () => (/* reexport safe */ _lit_reactive_element_decorators_property_js__WEBPACK_IMPORTED_MODULE_1__.property),
/* harmony export */   "query": () => (/* reexport safe */ _lit_reactive_element_decorators_query_js__WEBPACK_IMPORTED_MODULE_4__.query),
/* harmony export */   "queryAll": () => (/* reexport safe */ _lit_reactive_element_decorators_query_all_js__WEBPACK_IMPORTED_MODULE_5__.queryAll),
/* harmony export */   "queryAssignedElements": () => (/* reexport safe */ _lit_reactive_element_decorators_query_assigned_elements_js__WEBPACK_IMPORTED_MODULE_7__.queryAssignedElements),
/* harmony export */   "queryAssignedNodes": () => (/* reexport safe */ _lit_reactive_element_decorators_query_assigned_nodes_js__WEBPACK_IMPORTED_MODULE_8__.queryAssignedNodes),
/* harmony export */   "queryAsync": () => (/* reexport safe */ _lit_reactive_element_decorators_query_async_js__WEBPACK_IMPORTED_MODULE_6__.queryAsync),
/* harmony export */   "state": () => (/* reexport safe */ _lit_reactive_element_decorators_state_js__WEBPACK_IMPORTED_MODULE_2__.state)
/* harmony export */ });
/* harmony import */ var _lit_reactive_element_decorators_custom_element_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lit/reactive-element/decorators/custom-element.js */ "./node_modules/@lit/reactive-element/development/decorators/custom-element.js");
/* harmony import */ var _lit_reactive_element_decorators_property_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @lit/reactive-element/decorators/property.js */ "./node_modules/@lit/reactive-element/development/decorators/property.js");
/* harmony import */ var _lit_reactive_element_decorators_state_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @lit/reactive-element/decorators/state.js */ "./node_modules/@lit/reactive-element/development/decorators/state.js");
/* harmony import */ var _lit_reactive_element_decorators_event_options_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @lit/reactive-element/decorators/event-options.js */ "./node_modules/@lit/reactive-element/development/decorators/event-options.js");
/* harmony import */ var _lit_reactive_element_decorators_query_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @lit/reactive-element/decorators/query.js */ "./node_modules/@lit/reactive-element/development/decorators/query.js");
/* harmony import */ var _lit_reactive_element_decorators_query_all_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @lit/reactive-element/decorators/query-all.js */ "./node_modules/@lit/reactive-element/development/decorators/query-all.js");
/* harmony import */ var _lit_reactive_element_decorators_query_async_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @lit/reactive-element/decorators/query-async.js */ "./node_modules/@lit/reactive-element/development/decorators/query-async.js");
/* harmony import */ var _lit_reactive_element_decorators_query_assigned_elements_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @lit/reactive-element/decorators/query-assigned-elements.js */ "./node_modules/@lit/reactive-element/development/decorators/query-assigned-elements.js");
/* harmony import */ var _lit_reactive_element_decorators_query_assigned_nodes_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @lit/reactive-element/decorators/query-assigned-nodes.js */ "./node_modules/@lit/reactive-element/development/decorators/query-assigned-nodes.js");

//# sourceMappingURL=decorators.js.map


/***/ }),

/***/ "./node_modules/lit/index.js":
/*!***********************************!*\
  !*** ./node_modules/lit/index.js ***!
  \***********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CSSResult": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.CSSResult),
/* harmony export */   "INTERNAL": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.INTERNAL),
/* harmony export */   "LitElement": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.LitElement),
/* harmony export */   "ReactiveElement": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.ReactiveElement),
/* harmony export */   "UpdatingElement": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.UpdatingElement),
/* harmony export */   "_$LE": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__._$LE),
/* harmony export */   "_$LH": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__._$LH),
/* harmony export */   "adoptStyles": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.adoptStyles),
/* harmony export */   "css": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.css),
/* harmony export */   "defaultConverter": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.defaultConverter),
/* harmony export */   "getCompatibleStyle": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.getCompatibleStyle),
/* harmony export */   "html": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.html),
/* harmony export */   "noChange": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.noChange),
/* harmony export */   "notEqual": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.notEqual),
/* harmony export */   "nothing": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.nothing),
/* harmony export */   "render": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.render),
/* harmony export */   "supportsAdoptingStyleSheets": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.supportsAdoptingStyleSheets),
/* harmony export */   "svg": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.svg),
/* harmony export */   "unsafeCSS": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.unsafeCSS)
/* harmony export */ });
/* harmony import */ var _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lit/reactive-element */ "./node_modules/@lit/reactive-element/development/reactive-element.js");
/* harmony import */ var lit_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lit-html */ "./node_modules/lit-html/development/lit-html.js");
/* harmony import */ var lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lit-element/lit-element.js */ "./node_modules/lit-element/development/lit-element.js");

//# sourceMappingURL=index.js.map


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!************************!*\
  !*** ./demos/index.ts ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AppMain": () => (/* binding */ AppMain),
/* harmony export */   "allDemos": () => (/* binding */ allDemos),
/* harmony export */   "demoByID": () => (/* binding */ demoByID)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lit */ "./node_modules/lit/index.js");
/* harmony import */ var lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lit/decorators.js */ "./node_modules/lit/decorators.js");
/* harmony import */ var _palats_varpanel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @palats/varpanel */ "./node_modules/@palats/varpanel/dist/varpanel.js");
/* harmony import */ var _cameras__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./cameras */ "./demos/cameras.ts");
/* harmony import */ var _demos_conway__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./demos/conway */ "./demos/demos/conway.ts");
/* harmony import */ var _demos_fire__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./demos/fire */ "./demos/demos/fire.ts");
/* harmony import */ var _demos_fade__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./demos/fade */ "./demos/demos/fade.ts");
/* harmony import */ var _demos_minimal__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./demos/minimal */ "./demos/demos/minimal.ts");
/* harmony import */ var _demos_conway2__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./demos/conway2 */ "./demos/demos/conway2.ts");
/* harmony import */ var _demos_cube__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./demos/cube */ "./demos/demos/cube.ts");
/* harmony import */ var _demos_multicubes__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./demos/multicubes */ "./demos/demos/multicubes.ts");
/* harmony import */ var _demos_sphere__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./demos/sphere */ "./demos/demos/sphere.ts");
/* harmony import */ var _demos_plane__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./demos/plane */ "./demos/demos/plane.ts");
/* harmony import */ var _demos_viewer__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./demos/viewer */ "./demos/demos/viewer.ts");
/// <reference types="@webgpu/types" />
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};














const allDemos = [
    _demos_conway2__WEBPACK_IMPORTED_MODULE_8__.demo,
    _demos_fire__WEBPACK_IMPORTED_MODULE_5__.demo,
    _demos_conway__WEBPACK_IMPORTED_MODULE_4__.demo,
    _demos_fade__WEBPACK_IMPORTED_MODULE_6__.demo,
    _demos_minimal__WEBPACK_IMPORTED_MODULE_7__.demo,
    _demos_cube__WEBPACK_IMPORTED_MODULE_9__.demo,
    _demos_multicubes__WEBPACK_IMPORTED_MODULE_10__.demo,
    _demos_sphere__WEBPACK_IMPORTED_MODULE_11__.demo,
    _demos_plane__WEBPACK_IMPORTED_MODULE_12__.demo,
    _demos_viewer__WEBPACK_IMPORTED_MODULE_13__.demo,
];
function demoByID(id) {
    for (const d of allDemos) {
        if (d.id === id) {
            return d;
        }
    }
    return allDemos[0];
}
let AppMain = class AppMain extends lit__WEBPACK_IMPORTED_MODULE_0__.LitElement {
    constructor() {
        super();
        this.webGPUpresent = false;
        this.error = "";
        this._limitCanvas = false;
        this.renderWidth = 0;
        this.renderHeight = 0;
        this.controlsExpanded = true;
        this.extraControls = [];
        this.paused = false;
        this.step = false;
        this.shiftPressed = false;
        this.camera = new _cameras__WEBPACK_IMPORTED_MODULE_3__.Null();
        this.limitCanvas = this.getBoolParam("l", false);
        this._demoID = this.getStringParam("d", allDemos[0].id);
        this.controlsExpanded = this.getBoolParam("c", true);
    }
    render() {
        const demoValues = allDemos.map(d => d.id);
        return lit__WEBPACK_IMPORTED_MODULE_0__.html `
            <div id="display">
                <canvas id="canvas" tabindex=0></canvas>
            </div>

            <div id="overlay">
                <var-panel ?expanded=${this.controlsExpanded}>
                    <style>${_palats_varpanel__WEBPACK_IMPORTED_MODULE_2__.commonStyle}</style>
                    <vp-select .obj=${this} field="demoID" .values=${demoValues}>Demo</vp-select>
                    <div class="doc">${demoByID(this.demoID).caption}</div>
                    <div class="github"><a href="https://github.com/Palats/webgpu">Github source</a></div>
                    <vp-bool .obj=${this} field="limitCanvas">Limit canvas</vp-bool>
                    <div class="doc">
                        Set canvas to 816x640, see <a href="https://crbug.com/dawn/1260">crbug.com/dawn/1260</a>
                    </div>
                    ${this.extraControls}
                </var-panel>
                ${(!this.webGPUpresent || this.error) ? lit__WEBPACK_IMPORTED_MODULE_0__.html `
                <div id="errors">
                    ${this.webGPUpresent ? '' : lit__WEBPACK_IMPORTED_MODULE_0__.html `
                        <div>
                            Your browser does not support <a href="https://en.wikipedia.org/wiki/WebGPU">WebGPU</a>.
                            WebGPU is a future web standard which is supported by Chrome and Firefox, but requires special configuration. See <a href="https://github.com/Palats/webgpu#activating-webgpu">README</a> for details on how to activate it.
                        </div>
                    `}
                    ${this.error ? lit__WEBPACK_IMPORTED_MODULE_0__.html `
                        <div><pre>${this.error}</pre></div>
                        <div>See javascript console for more details.</div>
                    ` : ``}
                </div>
                ` : ``}
            </div>
        `;
    }
    get limitCanvas() { return this._limitCanvas; }
    set limitCanvas(v) {
        if (v === this._limitCanvas) {
            return;
        }
        this._limitCanvas = v;
        this.updateURL("l", this._limitCanvas);
        this.updateSize();
        this.requestUpdate('limitCanvas', !v);
    }
    get demoID() { return this._demoID; }
    set demoID(v) {
        if (this._demoID === v) {
            return;
        }
        this._demoID = v;
        this.updateURL("d", this._demoID);
        this.rebuild("changed demo");
    }
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        // Size & observe canvas.
        this.canvas = this.renderRoot.querySelector('#canvas');
        this.updateSize();
        new ResizeObserver(() => {
            this.updateSize();
        }).observe(this.canvas);
        this.loop(this.canvas);
        // Setup listener
        const eventElement = this.canvas;
        eventElement.addEventListener('keydown', e => {
            if (e.key == ' ') {
                this.paused = !this.paused;
            }
            else if (e.key == '.') {
                this.paused = true;
                this.step = true;
            }
            else if (e.key == 'Shift') {
                this.shiftPressed = true;
            }
            else if (e.key == 'Escape') {
                this.camera.reset();
            }
        });
        eventElement.addEventListener('keyup', e => {
            if (e.key == 'Shift') {
                this.shiftPressed = false;
            }
        });
        eventElement.addEventListener('pointerdown', e => {
            var _a;
            if (e.button == 0) {
                if (this.cameraStart) {
                    console.error("missing pointerup");
                }
                this.cameraStart = e;
                (_a = this.canvas) === null || _a === void 0 ? void 0 : _a.setPointerCapture(e.pointerId);
            }
        });
        eventElement.addEventListener('pointermove', e => {
            if (!this.cameraStart) {
                return;
            }
            if (e.pointerId != this.cameraStart.pointerId) {
                return;
            }
            this.cameraCurrent = e;
        });
        eventElement.addEventListener('pointerup', e => {
            if (!this.cameraStart) {
                return;
            }
            if (e.button != this.cameraStart.button || e.pointerId != this.cameraStart.pointerId) {
                return;
            }
            if (this.cameraStart && this.cameraCurrent) {
                this.camera.update(this.getCameraMoveInfo());
            }
            this.cameraStart = undefined;
            this.cameraCurrent = undefined;
        });
        eventElement.addEventListener('pointerout', e => {
            if (!this.cameraStart) {
                return;
            }
            if (e.pointerId != this.cameraStart.pointerId) {
                return;
            }
            this.cameraStart = undefined;
            this.cameraCurrent = undefined;
        });
        eventElement.addEventListener('wheel', e => {
            this.camera.update({
                deltaZoom: e.deltaY / this.canvas.clientHeight,
                shift: this.shiftPressed,
            });
        });
        // Make sure keyboard events go to the canvas initially.
        this.canvas.focus();
    }
    getCameraMoveInfo() {
        const mvt = {
            shift: this.shiftPressed,
        };
        if (this.cameraStart && this.cameraCurrent) {
            mvt.deltaX = (this.cameraCurrent.x - this.cameraStart.x) / this.canvas.clientWidth;
            mvt.deltaY = (this.cameraCurrent.y - this.cameraStart.y) / this.canvas.clientHeight;
        }
        return mvt;
    }
    updateSize() {
        if (!this.canvas) {
            return;
        }
        const devicePixelRatio = window.devicePixelRatio || 1;
        let renderWidth = this.canvas.clientWidth * devicePixelRatio;
        let renderHeight = this.canvas.clientHeight * devicePixelRatio;
        if (this.limitCanvas && ((renderWidth > 816) || (renderHeight > 640))) {
            // As of 2021-12-12, Chrome stable & unstable on a Linux (nvidia
            // 460.91.03, 470.86) do not accept a pixel more than 816x640 somehow - "device
            // lost" otherwise.
            renderWidth = 816;
            renderHeight = 640;
        }
        if (!renderWidth || !renderHeight) {
            return;
        }
        if (renderWidth === this.renderWidth && renderHeight === this.renderHeight) {
            return;
        }
        this.renderWidth = renderWidth;
        this.renderHeight = renderHeight;
        this.rebuild(`resize to ${renderWidth}x${renderHeight}`);
    }
    // rebuild tells to stop the current engine and create a new one.
    rebuild(s) {
        this.rebuildNeeded = s;
    }
    // loop is responsible for running each frame when needed, and recreating
    // the engine when requested (e.g., on resize).
    async loop(canvas) {
        while (true) {
            console.log("new engine:", this.rebuildNeeded);
            this.rebuildNeeded = undefined;
            this.webGPUpresent = false;
            this.error = "";
            try {
                if (!navigator.gpu) {
                    throw new Error("no webgpu extension");
                }
                let adapter = null;
                try {
                    // Firefox can have navigator.gpu but still throw when
                    // calling requestAdapter.
                    adapter = await navigator.gpu.requestAdapter();
                }
                catch (e) {
                    console.error("navigator.gpu.requestAdapter failed:", e);
                    throw new Error("requesting adapter failed");
                }
                if (!adapter) {
                    throw new Error("no webgpu adapter");
                }
                const device = await adapter.requestDevice();
                // As of 2021-12-11, Firefox nightly does not support device.lost.
                device.lost.then((e) => {
                    console.error("device lost", e);
                    this.error = "device lost";
                });
                device.onuncapturederror = (ev) => {
                    console.error("webgpu error", ev);
                    this.error = "webgpu device error";
                };
                const context = canvas.getContext('webgpu');
                if (!context) {
                    throw new Error("no webgpu canvas context");
                }
                this.webGPUpresent = true;
                const renderFormat = context.getPreferredFormat(adapter);
                context.configure({
                    device: device,
                    format: renderFormat,
                    compositingAlphaMode: 'opaque',
                    size: {
                        width: this.renderWidth,
                        height: this.renderHeight,
                    },
                });
                this.extraControls = [];
                this.camera = new _cameras__WEBPACK_IMPORTED_MODULE_3__.Null();
                const renderer = await demoByID(this.demoID).init({
                    context: context,
                    adapter: adapter,
                    device: device,
                    renderFormat: renderFormat,
                    renderWidth: this.renderWidth,
                    renderHeight: this.renderHeight,
                    setCamera: (c) => { this.camera = c; },
                    expose: (t) => { this.extraControls.push(t); },
                });
                if (this.error) {
                    throw new Error("init failed");
                }
                // Render loop
                let elapsedMs = 0;
                let timestampMs = 0;
                while (!this.rebuildNeeded) {
                    const ts = await new Promise(window.requestAnimationFrame);
                    let deltaMs = 0;
                    if (timestampMs) {
                        deltaMs = ts - timestampMs;
                    }
                    // Even when paused, continue updating timestampMs - this
                    // way, when resuming, it will just count a delta of a
                    // single frame instead of the full time since paused.
                    timestampMs = ts;
                    if (!this.paused || this.step) {
                        elapsedMs += deltaMs;
                    }
                    else {
                        deltaMs = 0;
                    }
                    this.step = false;
                    await renderer({
                        elapsedMs: elapsedMs,
                        deltaMs: deltaMs,
                        rng: Math.random(),
                        cameraMvt: this.getCameraMoveInfo(),
                    });
                    if (this.error) {
                        throw new Error("frame failed");
                    }
                }
                await new Promise(resolve => setTimeout(resolve, 200));
            }
            catch (e) {
                console.error("Run:", e);
                if (e instanceof Error) {
                    this.error = e.toString();
                }
                else {
                    this.error = "generic error";
                }
                // And now, wait for something to tell us to retry.
                // Could be better done with a proper event, but here we are.
                while (!this.rebuildNeeded) {
                    await new Promise(window.requestAnimationFrame);
                }
            }
        }
    }
    updateURL(k, v) {
        if (typeof v == "boolean") {
            v = v === true ? "1" : "0";
        }
        const params = new URLSearchParams(window.location.search);
        params.set(k, v);
        history.pushState(null, '', window.location.pathname + '?' + params.toString());
    }
    getBoolParam(k, defvalue = false) {
        const params = new URLSearchParams(window.location.search);
        const v = params.get(k);
        if (v === null) {
            return defvalue;
        }
        if (v === "1" || v.toLowerCase() === "false") {
            return true;
        }
        return false;
    }
    getStringParam(k, defvalue = "") {
        const params = new URLSearchParams(window.location.search);
        const v = params.get(k);
        if (v === null) {
            return defvalue;
        }
        return v;
    }
};
AppMain.styles = lit__WEBPACK_IMPORTED_MODULE_0__.css `
        /* Cover both shadow dom / non shadow dom cases */
        :host, app-main {
            background-color: #0f0f0f;
            display: grid;
            margin: 0;
            padding: 0;
            height: 100%;
            grid-template-columns: 100fr;
            grid-template-rows: 100fr;
            box-sizing: border-box;
        }

        #display {
            grid-column-start: 1;
            grid-column-end: 2;
            grid-row-start: 1;
            grid-row-end: 2;
            /* Avoid vertical scroll on canvas. */
            min-height: 0;
        }

        #display canvas {
            display: block;
            height: 100%;
            width: 100%;
            background-color: black;
        }

        #overlay {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 10;

            display: grid;
            grid-template-columns: 250px 100fr;
            align-items: start;
        }

        #controls {
            background-color: #d6d6d6f0;
            border: #8b8b8b 1px solid;
            grid-column-start: 1;
            grid-column-end: 2;
            font-size: 11px;
        }

        .doc {
            font-style: italic;
            font-size: 12px;
            padding: 2px 1px 2px 1px;
        }

        .github {
            display: flex;
            justify-content: center;
            border-top: 1px solid #4d4d4d;
            font-size: 14px;
            font-style: italic;
        }

        #errors {
            background-color: #ffbebede;
            grid-column-start: 2;
            grid-column-end: 3;
            padding: 2px;
        }
    `;
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Boolean })
], AppMain.prototype, "webGPUpresent", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)()
], AppMain.prototype, "error", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)()
], AppMain.prototype, "_demoID", void 0);
AppMain = __decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.customElement)('app-main')
], AppMain);

// Setup base document.
const htmlElt = document.body.parentElement;
htmlElt.style.height = '100%';
document.body.style.height = '100%';
document.body.style.margin = '0';
document.body.style.backgroundColor = '#888800';
document.body.appendChild(document.createElement("app-main"));

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map