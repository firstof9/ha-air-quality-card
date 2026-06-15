function t(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;let n=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(e,t))}return t}toString(){return this.cssText}};const r=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:a,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:c,getPrototypeOf:p}=Object,u=globalThis,m=u.trustedTypes,g=m?m.emptyScript:"",_=u.reactiveElementPolyfillSupport,f=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},v=(t,e)=>!a(t,e),x={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=x){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:o}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const n=s?.call(this);o?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??x}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...h(t),...c(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),o=e.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=s;const n=o.fromAttribute(e,t.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(t,e,i,s=!1,o){if(void 0!==t){const n=this.constructor;if(!1===s&&(o=this[t]),i??=n.getPropertyOptions(t),!((i.hasChanged??v)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:o},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==o||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[f("elementProperties")]=new Map,$[f("finalized")]=new Map,_?.({ReactiveElement:$}),(u.reactiveElementVersions??=[]).push("2.1.2");const b=globalThis,w=t=>t,A=b.trustedTypes,S=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+E,U=`<${P}>`,O=document,M=()=>O.createComment(""),N=t=>null===t||"object"!=typeof t&&"function"!=typeof t,q=Array.isArray,H="[ \t\n\f\r]",k=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,T=/--!?>/g,z=/>/g,R=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,j=/"/g,L=/^(?:script|style|textarea|title)$/i,I=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),V=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),G=new WeakMap,W=O.createTreeWalker(O,129);function K(t,e){if(!q(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const Q=(t,e)=>{const i=t.length-1,s=[];let o,n=2===e?"<svg>":3===e?"<math>":"",r=k;for(let e=0;e<i;e++){const i=t[e];let a,l,d=-1,h=0;for(;h<i.length&&(r.lastIndex=h,l=r.exec(i),null!==l);)h=r.lastIndex,r===k?"!--"===l[1]?r=T:void 0!==l[1]?r=z:void 0!==l[2]?(L.test(l[2])&&(o=RegExp("</"+l[2],"g")),r=R):void 0!==l[3]&&(r=R):r===R?">"===l[0]?(r=o??k,d=-1):void 0===l[1]?d=-2:(d=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?R:'"'===l[3]?j:D):r===j||r===D?r=R:r===T||r===z?r=k:(r=R,o=void 0);const c=r===R&&t[e+1].startsWith("/>")?" ":"";n+=r===k?i+U:d>=0?(s.push(a),i.slice(0,d)+C+i.slice(d)+E+c):i+E+(-2===d?e:c)}return[K(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class F{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,n=0;const r=t.length-1,a=this.parts,[l,d]=Q(t,e);if(this.el=F.createElement(l,i),W.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=W.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(C)){const e=d[n++],i=s.getAttribute(t).split(E),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:r[2],strings:i,ctor:"."===r[1]?tt:"?"===r[1]?et:"@"===r[1]?it:Y}),s.removeAttribute(t)}else t.startsWith(E)&&(a.push({type:6,index:o}),s.removeAttribute(t));if(L.test(s.tagName)){const t=s.textContent.split(E),e=t.length-1;if(e>0){s.textContent=A?A.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],M()),W.nextNode(),a.push({type:2,index:++o});s.append(t[e],M())}}}else if(8===s.nodeType)if(s.data===P)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(E,t+1));)a.push({type:7,index:o}),t+=E.length-1}o++}}static createElement(t,e){const i=O.createElement("template");return i.innerHTML=t,i}}function X(t,e,i=t,s){if(e===V)return e;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const n=N(e)?void 0:e._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(t),o._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(e=X(t,o._$AS(t,e.values),o,s)),e}class Z{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??O).importNode(e,!0);W.currentNode=s;let o=W.nextNode(),n=0,r=0,a=i[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new J(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new st(o,this,t)),this._$AV.push(e),a=i[++r]}n!==a?.index&&(o=W.nextNode(),n++)}return W.currentNode=O,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class J{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),N(t)?t===B||null==t||""===t?(this._$AH!==B&&this._$AR(),this._$AH=B):t!==this._$AH&&t!==V&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>q(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==B&&N(this._$AH)?this._$AA.nextSibling.data=t:this.T(O.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=F.createElement(K(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Z(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=G.get(t.strings);return void 0===e&&G.set(t.strings,e=new F(t)),e}k(t){q(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new J(this.O(M()),this.O(M()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=w(t).nextSibling;w(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Y{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=B,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=B}_$AI(t,e=this,i,s){const o=this.strings;let n=!1;if(void 0===o)t=X(this,t,e,0),n=!N(t)||t!==this._$AH&&t!==V,n&&(this._$AH=t);else{const s=t;let r,a;for(t=o[0],r=0;r<o.length-1;r++)a=X(this,s[i+r],e,r),a===V&&(a=this._$AH[r]),n||=!N(a)||a!==this._$AH[r],a===B?t=B:t!==B&&(t+=(a??"")+o[r+1]),this._$AH[r]=a}n&&!s&&this.j(t)}j(t){t===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Y{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===B?void 0:t}}class et extends Y{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==B)}}class it extends Y{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){if((t=X(this,t,e,0)??B)===V)return;const i=this._$AH,s=t===B&&i!==B||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==B&&(i===B||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}}const ot=b.litHtmlPolyfillSupport;ot?.(F,J),(b.litHtmlVersions??=[]).push("3.3.2");const nt=globalThis;let rt=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let o=s._$litPart$;if(void 0===o){const t=i?.renderBefore??null;s._$litPart$=o=new J(e.insertBefore(M(),t),t,void 0,i??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}};rt._$litElement$=!0,rt.finalized=!0,nt.litElementHydrateSupport?.({LitElement:rt});const at=nt.litElementPolyfillSupport;at?.({LitElement:rt}),(nt.litElementVersions??=[]).push("4.2.2");const lt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},dt={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:v},ht=(t=dt,e,i)=>{const{kind:s,metadata:o}=i;let n=globalThis.litPropertyMetadata.get(o);if(void 0===n&&globalThis.litPropertyMetadata.set(o,n=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),n.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const o=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,o,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const o=this[s];e.call(this,i),this.requestUpdate(s,o,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function ct(t){return(e,i)=>"object"==typeof i?ht(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function pt(t){return ct({...t,state:!0,attribute:!1})}const ut=1,mt=t=>(...e)=>({_$litDirective$:t,values:e});let gt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};const _t=mt(class extends gt{constructor(t){if(super(t),t.type!==ut||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const i=t.element.classList;for(const t of this.st)t in e||(i.remove(t),this.st.delete(t));for(const t in e){const s=!!e[t];s===this.st.has(t)||this.nt?.has(t)||(s?(i.add(t),this.st.add(t)):(i.remove(t),this.st.delete(t)))}return V}}),ft="important",yt=" !"+ft,vt=mt(class extends gt{constructor(t){if(super(t),t.type!==ut||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,i)=>{const s=t[i];return null==s?e:e+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`},"")}update(t,[e]){const{style:i}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const t of this.ft)null==e[t]&&(this.ft.delete(t),t.includes("-")?i.removeProperty(t):i[t]=null);for(const t in e){const s=e[t];if(null!=s){this.ft.add(t);const e="string"==typeof s&&s.endsWith(yt);t.includes("-")||e?i.setProperty(t,e?s.slice(0,-11):s,e?ft:""):i[t]=s}}return V}}),xt={pm1:{good:10,mod:25,high:50},pm25:{good:12,mod:35,high:75},pm4:{good:20,mod:50,high:100},pm10:{good:50,mod:150,high:250},voc_index:{good:100,mod:250,high:350},voc_ppb:{good:250,mod:500,high:1e3},voc_ugm3:{good:300,mod:600,high:1500},co2:{good:800,mod:1200,high:2e3},nox_index:{good:1,mod:20,high:50},nox_ugm3:{good:50,mod:100,high:200},nox_ppm:{good:.05,mod:.1,high:.2}};function $t(t){const e=(t??"").toLowerCase();return e.includes("ppb")?xt.voc_ppb:e.includes("m³")||e.includes("m3")?xt.voc_ugm3:xt.voc_index}function bt(t){const e=(t??"").toLowerCase();return e.includes("m³")||e.includes("m3")?xt.nox_ugm3:e.includes("ppm")?xt.nox_ppm:xt.nox_index}function wt(t){const e=(t??"").toLowerCase();return e.includes("ppb")||e.includes("m³")||e.includes("m3")?0:100}function At(t){const e=(t??"").toLowerCase();return e.includes("m³")||e.includes("m3")||e.includes("ppm")?0:1}const St=[{max:50,color:"var(--air-quality-card-good-color, #86efac)",text:"var(--air-quality-card-good-text, #16a34a)",label:"Good",advice:"Air quality is satisfactory."},{max:100,color:"var(--air-quality-card-moderate-color, #fde68a)",text:"var(--air-quality-card-moderate-text, #ca8a04)",label:"Moderate",advice:"Acceptable air quality."},{max:150,color:"var(--air-quality-card-unhealthy-sg-color, #fdba74)",text:"var(--air-quality-card-unhealthy-sg-text, #ea580c)",label:"Unhealthy (SG)",advice:"Sensitive groups may be affected."},{max:200,color:"var(--air-quality-card-unhealthy-color, #fca5a5)",text:"var(--air-quality-card-unhealthy-text, #dc2626)",label:"Unhealthy",advice:"Everyone may experience health effects."},{max:300,color:"var(--air-quality-card-very-unhealthy-color, #d8b4fe)",text:"var(--air-quality-card-very-unhealthy-text, #9333ea)",label:"V. Unhealthy",advice:"Health alert: risk is increased."},{max:1/0,color:"var(--air-quality-card-hazardous-color, #fda4af)",text:"var(--air-quality-card-hazardous-text, #e11d48)",label:"Hazardous",advice:"Emergency health warning."}],Ct=[{min:80,color:"var(--air-quality-card-good-color, #86efac)",text:"var(--air-quality-card-good-text, #16a34a)",label:"Good",advice:"Air quality is good"},{min:60,color:"var(--air-quality-card-moderate-color, #fde68a)",text:"var(--air-quality-card-moderate-text, #ca8a04)",label:"Moderate",advice:"Air quality is moderate"},{min:40,color:"var(--air-quality-card-poor-color, #fdba74)",text:"var(--air-quality-card-poor-text, #ea580c)",label:"Poor",advice:"Consider ventilating"},{min:-1/0,color:"var(--air-quality-card-bad-color, #fca5a5)",text:"var(--air-quality-card-bad-text, #dc2626)",label:"Bad",advice:"Ventilate now"}],Et={en:{topName:{aqi:"AQI Sensor",score:"Calculated Score"},subtitle:"Climate · Air Quality",ring:{aqi:"AQI",score:"SCORE"},stats:{temp:"TEMP",humidity:"HUMIDITY"},advice:{vocHigh:"VOCs detected",co2High:"CO2 high - open a window",co2VeryHigh:"CO2 very high - ventilate",noxHigh:"High Nitrogen Oxides detected"}}};function Pt(t){return"string"==typeof t&&""!==t.trim()}function Ut(t,e,i,s,o=0){if(null==t)return{label:"--",color:"var(--divider-color, #444)",text:"var(--secondary-text-color)",pct:0,left:0};let n=0,r=0;if(o>0)if(t>=o){const e=Math.max(1e-9,s-o);n=Math.min(50,(t-o)/e*50),r=50}else n=Math.min(50,(o-t)/o*50),r=50-n;else n=Math.min(100,t/s*100),r=0;let a="V.HIGH",l="var(--air-quality-card-unhealthy-color, #fca5a5)",d="var(--air-quality-card-unhealthy-text, #dc2626)";return t<=e?(a="GOOD",l="var(--air-quality-card-good-color, #86efac)",d="var(--air-quality-card-good-text, #16a34a)"):t<=i?(a="MOD",l="var(--air-quality-card-moderate-color, #fde68a)",d="var(--air-quality-card-moderate-text, #ca8a04)"):t<=s&&(a="HIGH",l="var(--air-quality-card-unhealthy-sg-color, #fdba74)",d="var(--air-quality-card-unhealthy-sg-text, #ea580c)"),{label:a,color:l,text:d,pct:n,left:r}}const Ot=((t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new n(i,t,s)})`
  :host {
    display: block;
  }

  ha-card {
    padding: 20px;
    color: var(--primary-text-color);
    font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
  }

  .top {
    cursor: pointer;
  }

  .top:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
    border-radius: 4px;
  }

  .secondary { color: var(--secondary-text-color); }

  .header {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .title {
    font-size: 15px;
    font-weight: 500;
  }

  .subtitle {
    font-size: 11px;
    color: var(--secondary-text-color);
    margin-top: 2px;
  }

  .ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Collapsed view */
  .collapsed-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .collapsed-meta {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .collapsed-value {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }

  .collapsed-value .num {
    font-size: 18px;
    font-weight: 400;
  }

  .collapsed-value .unit {
    font-size: 10px;
    color: var(--secondary-text-color);
  }

  .chip {
    background: var(--chip-bg, transparent);
    border: 1px solid var(--chip-border, transparent);
    border-radius: 999px;
    padding: 5px 12px;
    font-size: 11px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .chip .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  /* Expanded view */
  .expanded-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 18px;
  }

  .expanded-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
  }

  .expanded-text {
    flex-grow: 1;
    overflow: hidden;
    padding-right: 14px;
  }

  .top-name {
    font-size: 12px;
    color: var(--secondary-text-color);
    margin-bottom: 4px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .headline {
    display: flex;
    align-items: baseline;
    gap: 6px;
  }

  .headline .num {
    font-size: clamp(36px, 8vw, 54px);
    font-weight: 400;
    line-height: 1;
  }

  .headline .unit {
    font-size: 14px;
    color: var(--secondary-text-color);
  }

  .advice {
    font-size: 12px;
    color: var(--secondary-text-color);
    margin-top: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .stats {
    display: flex;
    gap: 14px;
    margin-top: 14px;
  }

  .stats > .stat {
    display: flex;
    flex-direction: column;
  }

  .stats > .stat.empty {
    opacity: 0.5;
  }

  .stat-value {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }

  .stat-value .num {
    font-size: 24px;
    font-weight: 400;
  }

  .stat-value .unit {
    font-size: 11px;
    color: var(--secondary-text-color);
  }

  .stat-label {
    font-size: 10px;
    color: var(--secondary-text-color);
    margin-top: 2px;
  }

  .divider {
    width: 1px;
    background: var(--divider-color, #444);
  }

  /* Ring */
  .ring-wrapper {
    position: relative;
    width: 100px;
    height: 100px;
    flex-shrink: 0;
  }

  .ring-wrapper svg {
    transform: rotate(-90deg);
    width: 100%;
    height: 100%;
  }

  .ring-bg {
    fill: none;
    stroke: var(--divider-color, #444);
    stroke-width: 8;
  }

  .ring-fg {
    fill: none;
    stroke-width: 8;
    stroke-linecap: round;
    transition: stroke-dashoffset 1s ease-out;
  }

  .ring-center {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .ring-top-text {
    font-size: 11px;
    color: var(--secondary-text-color);
  }

  .ring-bottom-text {
    font-size: 13px;
    font-weight: 500;
    text-align: center;
    line-height: 1.1;
    margin-top: 2px;
    max-width: 80px;
  }

  /* Graph slot */
  .graph {
    display: block;
    width: 100%;
    --ha-card-background: transparent;
    --ha-card-border-width: 0;
    --ha-card-box-shadow: none;
    margin: 0 -6px 14px -6px;
  }

  /* Bottom pollutant tile grid */
  .bottom {
    padding-top: 14px;
    border-top: 1px solid var(--divider-color, #444);
  }

  .tile-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .tile-grid + .tile-grid {
    margin-top: 0;
  }

  .pm-grid {
    margin-bottom: 14px;
  }

  .tile {
    padding: 0 6px;
    min-width: 0;
    overflow: hidden;
  }

  .tile.empty {
    opacity: 0.5;
  }

  .tile-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    gap: 4px;
  }

  .tile-name {
    font-size: 11px;
    color: var(--secondary-text-color);
    font-weight: 500;
  }

  .tile-status {
    font-size: 9px;
  }

  .tile-value {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }

  .tile-value .num {
    font-size: 22px;
    font-weight: 400;
    line-height: 1;
  }

  .tile-value .unit {
    font-size: 10px;
    color: var(--secondary-text-color);
  }

  .tile-bar {
    height: 3px;
    background: var(--divider-color, #444);
    border-radius: 2px;
    overflow: hidden;
    margin-top: 8px;
    position: relative;
  }

  .tile-bar > .fill {
    height: 100%;
    position: absolute;
  }

  /* Mobile fallback */
  @media (max-width: 380px) {
    ha-card { padding: 14px; }
    .ring-wrapper { width: 72px; height: 72px; }
    .ring-top-text { font-size: 10px; }
    .headline .num { font-size: clamp(28px, 12vw, 44px); }
    .expanded-text { padding-right: 8px; }
    .stats { gap: 10px; }
    .stat-value .num { font-size: 20px; }
  }

  @media (max-width: 300px) {
    .tile-grid { grid-template-columns: 1fr; }
  }
`,Mt=[{name:"title",label:"Card Title",helper:"Shown at the top of the card.",selector:{text:{}}},{name:"default_expanded",label:"Expanded by Default",helper:"Whether the card opens expanded. Click the title to toggle.",selector:{boolean:{}}},{name:"aqi_entity",label:"AQI Sensor (Optional)",helper:"If set, displays this sensor's value with EPA AirNow bands. If empty or unavailable, falls back to a calculated score from PM2.5, VOC, and CO2.",selector:{entity:{domain:"sensor",device_class:"aqi"}}},{name:"temp_entity",label:"Temperature Sensor",helper:"Shown next to the headline. Also feeds the optional history graph.",selector:{entity:{domain:"sensor",device_class:"temperature"}}},{name:"humid_entity",label:"Humidity Sensor",helper:"Shown next to the headline. Also feeds the optional history graph.",selector:{entity:{domain:"sensor",device_class:"humidity"}}},{name:"pm1_entity",label:"PM1.0 Sensor",helper:"Display only - does not contribute to the calculated score.",selector:{entity:{domain:"sensor",device_class:"pm1"}}},{name:"pm25_entity",label:"PM2.5 Sensor",helper:"Drives the score when PM2.5 levels are the worst pollutant.",selector:{entity:{domain:"sensor",device_class:"pm25"}}},{name:"pm4_entity",label:"PM4.0 Sensor",helper:"Display only - does not contribute to the calculated score.",selector:{entity:{domain:"sensor"}}},{name:"pm10_entity",label:"PM10 Sensor",helper:"Drives the score when PM10 levels are the worst pollutant.",selector:{entity:{domain:"sensor",device_class:"pm10"}}},{name:"voc_entity",label:"VOC Index Sensor",helper:"Sensirion VOC Index (0-500 scale). Drives the score when VOCs are the worst pollutant.",selector:{entity:{domain:"sensor"}}},{name:"co2_entity",label:"CO2 Sensor (ppm)",helper:"Drives the score when CO2 is the worst pollutant (impacts cognitive function above 2000 ppm).",selector:{entity:{domain:"sensor",device_class:"carbon_dioxide"}}},{name:"nox_entity",label:"NOX Sensor",helper:"Nitrogen Oxides (NO2/NOX). Drives the score when NOX levels are high.",selector:{entity:{domain:"sensor"}}}];let Nt=class extends rt{setConfig(t){this._config=t}get _schema(){return this.hass?(this.hass.states!==this._cachedHassStates&&(this._cachedHassStates=this.hass.states,this._cachedVocEntities=Object.keys(this.hass.states).filter(t=>{if(!t.startsWith("sensor."))return!1;const e=this.hass.states[t].attributes.friendly_name?.toLowerCase()||"";return t.toLowerCase().includes("voc")||e.includes("voc")}),this._cachedNoxEntities=Object.keys(this.hass.states).filter(t=>{if(!t.startsWith("sensor."))return!1;const e=this.hass.states[t],i=e.attributes.friendly_name?.toLowerCase()||"",s=e.attributes.device_class?.toLowerCase()||"";return t.toLowerCase().includes("nox")||t.toLowerCase().includes("no2")||i.includes("nox")||i.includes("no2")||s.includes("nitrogen")}),this._cachedSchema=Mt.map(t=>"voc_entity"===t.name?{...t,selector:{entity:{...t.selector.entity,include_entities:this._cachedVocEntities}}}:"nox_entity"===t.name?{...t,selector:{entity:{...t.selector.entity,include_entities:this._cachedNoxEntities}}}:t)),this._cachedSchema||Mt):Mt}render(){return this.hass&&this._config?I`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._schema}
        .computeLabel=${t=>t.label||t.name}
        .computeHelper=${t=>t.helper||""}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `:I``}_valueChanged(t){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t.detail.value},bubbles:!0,composed:!0}))}};t([ct({attribute:!1})],Nt.prototype,"hass",void 0),t([pt()],Nt.prototype,"_config",void 0),Nt=t([lt("air-quality-card-editor")],Nt);console.info("%c  AIR-QUALITY-CARD  %c  Version 0.1.1  ","color: white; font-weight: bold; background: #03a9f4","color: #03a9f4; font-weight: bold; background: white");const qt={aqi_entity:["sensor.","air_quality."],temp_entity:["sensor."],humid_entity:["sensor."],pm1_entity:["sensor."],pm25_entity:["sensor."],pm4_entity:["sensor."],pm10_entity:["sensor."],voc_entity:["sensor."],co2_entity:["sensor."]};let Ht=class extends rt{constructor(){super(...arguments),this._expanded=!0,this._graphConfigured=!1,this._expandedUserDriven=!1}static{this.styles=Ot}static getConfigElement(){return document.createElement("air-quality-card-editor")}static getStubConfig(){return{title:"Living Room",default_expanded:!0,aqi_entity:"",temp_entity:"",humid_entity:"",pm1_entity:"",pm25_entity:"",pm4_entity:"",pm10_entity:"",voc_entity:"",co2_entity:""}}setConfig(t){if(!t||"object"!=typeof t)throw new Error("Invalid configuration: expected an object");for(const[e,i]of Object.entries(qt)){const s=t[e];if(null!=s&&""!==s&&("string"!=typeof s||!i.some(t=>s.startsWith(t))))throw new Error(`${e} must be one of (${i.map(t=>t+"*").join(", ")}), got: ${String(s)}`)}this._config=t,this._expandedUserDriven||(this._expanded=!1!==t.default_expanded),this._setupGraphCard(t)}getCardSize(){return 5}t(t){return function(t,e="en"){const i=e=>{const i=t.split(".").reduce((t,e)=>t&&"object"==typeof t?t[e]:void 0,e);return"string"==typeof i?i:void 0};return i(Et[e])??i(Et.en)??t}(t,this.hass?.locale?.language||this.hass?.language||"en")}_safeNum(t){if(!t||!this.hass?.states[t])return null;const e=this.hass.states[t].state;if("unavailable"===e||"unknown"===e)return null;const i=parseFloat(e);return isNaN(i)?null:i}_formatNum(t,e=1){return null==t?"--":t.toFixed(e)}_getUnit(t,e){return t&&this.hass?.states[t]&&this.hass.states[t].attributes.unit_of_measurement||e}_setupGraphCard(t){`${t.temp_entity??""}|${t.humid_entity??""}`!==this._graphProbeKey&&(this._graphProbeKey=void 0,this._graphConfigured=!1,this._graphCard&&(this._graphCard.style.display="none")),this._maybeSetupGraph()}_maybeSetupGraph(){const t=this._config;if(!t)return;const e=`${t.temp_entity??""}|${t.humid_entity??""}`;if(this._graphProbeKey===e)return;const i=[];if(t.temp_entity&&i.push({id:t.temp_entity,spec:{entity:t.temp_entity,name:"Temp",color:"#fde68a"}}),t.humid_entity&&i.push({id:t.humid_entity,spec:{entity:t.humid_entity,name:"Humidity",color:"#a8c0e0",y_axis:"secondary"}}),0===i.length)return this._graphProbeKey=e,this._graphConfigured=!1,void(this._graphCard&&(this._graphCard.style.display="none"));if(!this.hass)return;if(this._graphProbeKey=e,"function"!=typeof this.hass.callWS)return void this._configureGraph(i.map(t=>t.spec));const s=new Date,o=new Date(s.getTime()-864e5);this.hass.callWS({type:"history/history_during_period",start_time:o.toISOString(),end_time:s.toISOString(),entity_ids:i.map(t=>t.id),minimal_response:!0,no_attributes:!0}).then(t=>{const e=function(t,e){const i=new Set;if(!t)return i;for(const s of e){const e=t[s];Array.isArray(e)&&e.length>0&&i.add(s)}return i}(t,i.map(t=>t.id));this._configureGraph(i.filter(t=>e.has(t.id)).map(t=>t.spec))}).catch(()=>{this._configureGraph(i.map(t=>t.spec))})}_configureGraph(t){if(0===t.length)return this._graphConfigured=!1,void(this._graphCard&&(this._graphCard.style.display="none"));this._graphCard||(this._graphCard=document.createElement("mini-graph-card"));const e=customElements.whenDefined("mini-graph-card"),i=new Promise((t,e)=>setTimeout(()=>e(new Error("mini-graph-card not installed")),2e3));Promise.race([e,i]).then(()=>{this._graphCard.setConfig({type:"custom:mini-graph-card",entities:t,hours_to_show:24,points_per_hour:2,line_width:2,animate:!0,smoothing:!0,hour24:!0,height:60,show:{name:!1,icon:!1,state:!1,legend:!0,labels:!1,fill:"fade"}}),this._graphConfigured=!0,this._graphCard.style.display="block",this.hass&&(this._graphCard.hass=this.hass),this.requestUpdate()}).catch(t=>{this._graphConfigured=!1,this._graphCard&&(this._graphCard.style.display="none");(t instanceof Error?t.message:String(t)).includes("not installed")?console.info("[air-quality-card] mini-graph-card not found, temp/humidity history graph disabled. Install via HACS to enable it."):console.warn("[air-quality-card] mini-graph-card setConfig failed:",t),this.requestUpdate()})}updated(t){t.has("hass")&&this.hass&&(this._maybeSetupGraph(),this._graphCard&&this._graphConfigured&&(this._graphCard.hass=this.hass))}_toggle(){this._expanded=!this._expanded,this._expandedUserDriven=!0}_onKey(t){"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this._toggle())}render(){if(!this._config||!this.hass)return I``;const t=this._config,e=t.aqi_entity?this.hass.states[t.aqi_entity]:null,i=e?parseFloat(e.state):NaN,s=!!e&&!isNaN(i),o=s?e.attributes.friendly_name||this.t("topName.aqi"):this.t("topName.score"),n=this._safeNum(t.pm1_entity),r=this._safeNum(t.pm25_entity),a=this._safeNum(t.pm4_entity),l=this._safeNum(t.pm10_entity),d=this._safeNum(t.voc_entity),h=this._safeNum(t.co2_entity),c=this._safeNum(t.temp_entity),p=this._safeNum(t.humid_entity),u=this._safeNum(t.nox_entity),m=this._getUnit(t.temp_entity,"°C"),g=this._getUnit(t.humid_entity,"%"),_=this._getUnit(t.pm1_entity,"µg/m³"),f=this._getUnit(t.pm25_entity,"µg/m³"),y=this._getUnit(t.pm4_entity,"µg/m³"),v=this._getUnit(t.pm10_entity,"µg/m³"),x=this._getUnit(t.voc_entity,"index"),$=this._getUnit(t.co2_entity,"ppm"),b=this._getUnit(t.nox_entity,"index"),w=2*Math.PI*42;let A,S,C,E,P,U,O;if(s){A=Math.round(i),O=this.t("ring.aqi");const t=St.find(t=>i<=t.max);E=t.color,P=t.text,S=t.label,C=t.advice;U=w-Math.min(Math.max(i,0)/500,1)*w}else{const e=function({pm25:t,pm10:e,voc:i,voc_unit:s,voc_thresholds:o,voc_baseline:n,co2:r,nox:a,nox_unit:l,nox_thresholds:d,nox_baseline:h}){const c=o??$t(s),p=d??bt(l),u=n??(o?0:wt(s)),m=h??(d?0:At(l)),g=Math.max(1e-9,c.high-u),_=Math.max(1e-9,p.high-m),f=[{value:t,limit:75},{value:e,limit:150},{value:null!=i?Math.max(0,i-u):null,limit:g},{value:null!=r?r-400:null,limit:1600},{value:null!=a?Math.max(0,a-m):null,limit:_}].filter(t=>null!=t.value);if(0===f.length)return{score:null,label:"No data",color:"var(--air-quality-card-no-data-color, #9ca3af)",text:"var(--secondary-text-color)",advice:"Configure PM2.5, PM10, VOC, or CO₂ sensors to see a calculated score.",pct:0};const y=f.map(t=>Math.min(100,Math.max(0,t.value/t.limit*100))),v=Math.max(...y),x=Math.round(100-v),$=Ct.find(t=>x>=t.min);return{score:x,label:$.label,color:$.color,text:$.text,advice:$.advice,pct:x/100}}({pm25:r,pm10:l,voc:d,voc_unit:x,voc_thresholds:t.voc_thresholds,voc_baseline:t.voc_baseline,co2:h,nox:u,nox_unit:b,nox_thresholds:t.nox_thresholds,nox_baseline:t.nox_baseline});A=null==e.score?"--":e.score,O=this.t("ring.score"),E=e.color,P=e.text,S=e.label,C=e.advice,U=w-e.pct*w}const M=xt,N=Ut(n,M.pm1.good,M.pm1.mod,M.pm1.high),q=Ut(r,M.pm25.good,M.pm25.mod,M.pm25.high),H=Ut(a,M.pm4.good,M.pm4.mod,M.pm4.high),k=Ut(l,M.pm10.good,M.pm10.mod,M.pm10.high),T=t.voc_thresholds??$t(x),z=t.voc_baseline??(t.voc_thresholds?0:wt(x)),R=Ut(d,T.good,T.mod,T.high,z),D=Ut(h,M.co2.good,M.co2.mod,M.co2.high),j=t.nox_thresholds??bt(b),L=t.nox_baseline??(t.nox_thresholds?0:At(b)),V=Ut(u,j.good,j.mod,j.high,L);("Good"===S||"Moderate"===S)&&(null!=d&&d>T.mod&&(C=this.t("advice.vocHigh")),null!=h&&h>1e3&&(C=this.t("advice.co2High")),null!=h&&h>1500&&(C=this.t("advice.co2VeryHigh")),null!=u&&u>j.mod&&(C=this.t("advice.noxHigh")));const G=s?e.attributes.unit_of_measurement||"AQI":"/ 100",W=`${t.title||"Air quality"}: ${S}, ${A} ${G}`.trim(),K=`color-mix(in srgb, ${E} 12%, transparent)`,Q=`color-mix(in srgb, ${E} 35%, transparent)`;return I`
      <ha-card>
        <div
          class="top"
          role="button"
          tabindex="0"
          aria-expanded=${this._expanded?"true":"false"}
          aria-label=${W+(this._expanded?". Activate to collapse.":". Activate to expand.")}
          @click=${this._toggle}
          @keydown=${this._onKey}
        >
          ${this._expanded?this._renderExpandedHeader(t,o,A,s,E,P,C,c,p,m,g,O,S,42,w,U,W):this._renderCollapsed(t,A,s,e,E,P,S,K,Q,W)}
        </div>

        <div
          class="graph"
          style=${this._expanded&&this._graphConfigured?"":"display:none"}
        >
          ${this._graphCard??B}
        </div>

        ${this._expanded?this._renderBottom({config:t,pm1:n,pm25:r,pm4:a,pm10:l,voc:d,co2:h,nox:u,pm1Unit:_,pm25Unit:f,pm4Unit:y,pm10Unit:v,vocUnit:x,co2Unit:$,noxUnit:b,pm1S:N,pm25S:q,pm4S:H,pm10S:k,vocS:R,co2S:D,noxS:V}):B}
      </ha-card>
    `}_renderCollapsed(t,e,i,s,o,n,r,a,l,d){const h="--"===e?"":i?s?.attributes.unit_of_measurement||"":"/ 100";return I`
      <div class="collapsed-row">
        <div class="header">
          <ha-icon icon="mdi:chevron-down" class="secondary" aria-hidden="true"></ha-icon>
          <div>
            <div class="title">${t.title||"Living Room"}</div>
            <div class="subtitle">${this.t("subtitle")}</div>
          </div>
        </div>
        <div class="collapsed-meta" role="group" aria-label=${d}>
          <div class="collapsed-value">
            <span class="num" style=${vt({color:n})}>${e}</span>
            <span class="unit">${h}</span>
          </div>
          <div
            class="chip"
            style=${vt({"--chip-bg":a,"--chip-border":l,color:n})}
          >
            <span class="dot" style=${vt({background:o})} aria-hidden="true"></span>
            ${r}
          </div>
        </div>
      </div>
    `}_renderExpandedHeader(t,e,i,s,o,n,r,a,l,d,h,c,p,u,m,g,_){const f=!s&&"--"!==i;return I`
      <div class="expanded-header">
        <div class="header">
          <ha-icon icon="mdi:chevron-up" class="secondary" aria-hidden="true"></ha-icon>
          <div>
            <div class="title">${t.title||"Living Room"}</div>
            <div class="subtitle">${this.t("subtitle")}</div>
          </div>
        </div>
      </div>

      <div class="expanded-row">
        <div class="expanded-text">
          <div class="top-name" title=${e}>${e}</div>
          <div class="headline" role="group" aria-label=${_}>
            <span class="num" style=${vt({color:n})}>${i}</span>
            <span class="unit">${f?"/ 100":""}</span>
          </div>
          <div class="advice">${r}</div>

          ${Pt(t.temp_entity)||Pt(t.humid_entity)?I`
          <div class="stats">
            ${Pt(t.temp_entity)?I`
            <div
              class=${_t({stat:!0,empty:null==a})}
              aria-label="Temperature: ${this._formatNum(a,1)} ${d}"
            >
              <div class="stat-value">
                <span class="num">${this._formatNum(a,1)}</span>
                <span class="unit">${null==a?"":d}</span>
              </div>
              <div class="stat-label" aria-hidden="true">${this.t("stats.temp")}</div>
            </div>`:B}
            ${Pt(t.temp_entity)&&Pt(t.humid_entity)?I`<div class="divider" aria-hidden="true"></div>`:B}
            ${Pt(t.humid_entity)?I`
            <div
              class=${_t({stat:!0,empty:null==l})}
              aria-label="Humidity: ${this._formatNum(l,0)} ${h}"
            >
              <div class="stat-value">
                <span class="num">${this._formatNum(l,0)}</span>
                <span class="unit">${null==l?"":h}</span>
              </div>
              <div class="stat-label" aria-hidden="true">${this.t("stats.humidity")}</div>
            </div>`:B}
          </div>`:B}
        </div>

        <div
          class="ring-wrapper"
          role="meter"
          aria-valuenow=${"number"==typeof i?i:0}
          aria-valuemin="0"
          aria-valuemax=${s?500:100}
          aria-label="${c}: ${i}, ${p}"
        >
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <title>${c} ${i}</title>
            <circle class="ring-bg" cx="50" cy="50" r=${u}></circle>
            <circle
              class="ring-fg"
              cx="50"
              cy="50"
              r=${u}
              style=${vt({stroke:o})}
              stroke-dasharray=${m}
              stroke-dashoffset=${g}
            ></circle>
          </svg>
          <div class="ring-center" aria-hidden="true">
            <div class="ring-top-text">${c}</div>
            <div class="ring-bottom-text" style=${vt({color:n})}>
              ${s||"--"===i?p:`${i}%`}
            </div>
          </div>
        </div>
      </div>
    `}_renderBottom(t){const e=(t,e,i,s)=>I`
      <div
        class=${_t({tile:!0,empty:null==e})}
        role="group"
        aria-label="${t}: ${null==e?"no data":`${e.toLocaleString()} ${i}`}, ${s.label}"
      >
        <div class="tile-head" aria-hidden="true">
          <span class="tile-name">${t}</span>
          <span class="tile-status" style=${vt({color:s.text})}>${s.label}</span>
        </div>
        <div class="tile-value" aria-hidden="true">
          <span class="num">${null==e?"--":e.toLocaleString()}</span>
          <span class="unit">${null==e?"":i}</span>
        </div>
        <div
          class="tile-bar"
          role="progressbar"
          aria-valuenow=${Math.round(s.pct)}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="${t} level"
        >
          <div class="fill" style=${vt({left:`${s.left??0}%`,width:`${s.pct}%`,background:s.color})}></div>
        </div>
      </div>
    `,i=[];Pt(t.config.pm1_entity)&&i.push(e("PM1.0",t.pm1,t.pm1Unit,t.pm1S)),Pt(t.config.pm25_entity)&&i.push(e("PM2.5",t.pm25,t.pm25Unit,t.pm25S)),Pt(t.config.pm4_entity)&&i.push(e("PM4.0",t.pm4,t.pm4Unit,t.pm4S)),Pt(t.config.pm10_entity)&&i.push(e("PM10",t.pm10,t.pm10Unit,t.pm10S));const s=[];return Pt(t.config.voc_entity)&&s.push(e("VOC",t.voc,t.vocUnit,t.vocS)),Pt(t.config.nox_entity)&&s.push(e("NOₓ",t.nox,t.noxUnit,t.noxS)),Pt(t.config.co2_entity)&&s.push(e("CO₂",t.co2,t.co2Unit,t.co2S)),0===i.length&&0===s.length?B:I`
      <div class="bottom">
        ${i.length?I`<div class="tile-grid pm-grid">${i}</div>`:B}
        ${s.length?I`<div class="tile-grid">${s}</div>`:B}
      </div>
    `}};t([ct({attribute:!1})],Ht.prototype,"hass",void 0),t([pt()],Ht.prototype,"_config",void 0),t([pt()],Ht.prototype,"_expanded",void 0),Ht=t([lt("air-quality-card")],Ht),window.customCards=window.customCards||[],window.customCards.push({type:"air-quality-card",name:"Air Quality Card",preview:!0,description:"A custom card displaying air quality metrics and an overall score."});export{Ht as AirQualityCard};
