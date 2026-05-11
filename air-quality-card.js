function t(t,e,i,s){var r,a=arguments.length,o=a<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,s);else for(var n=t.length-1;n>=0;n--)(r=t[n])&&(o=(a<3?r(o):a>3?r(e,i,o):r(e,i))||o);return a>3&&o&&Object.defineProperty(e,i,o),o}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;let a=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(e,t))}return t}toString(){return this.cssText}};const o=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new a("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:n,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:c,getOwnPropertySymbols:h,getPrototypeOf:p}=Object,u=globalThis,m=u.trustedTypes,g=m?m.emptyScript:"",v=u.reactiveElementPolyfillSupport,f=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},_=(t,e)=>!n(t,e),$={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:_};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const a=s?.call(this);r?.call(this,e),this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...c(t),...h(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(o(t))}else void 0!==t&&e.push(o(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),r=e.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=s;const a=r.fromAttribute(e,t.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(t,e,i,s=!1,r){if(void 0!==t){const a=this.constructor;if(!1===s&&(r=this[t]),i??=a.getPropertyOptions(t),!((i.hasChanged??_)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},a){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),!0!==r||void 0!==a)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[f("elementProperties")]=new Map,x[f("finalized")]=new Map,v?.({ReactiveElement:x}),(u.reactiveElementVersions??=[]).push("2.1.2");const b=globalThis,w=t=>t,A=b.trustedTypes,S=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,U="?"+E,P=`<${U}>`,M=document,O=()=>M.createComment(""),q=t=>null===t||"object"!=typeof t&&"function"!=typeof t,N=Array.isArray,H="[ \t\n\f\r]",k=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,T=/-->/g,z=/>/g,R=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,D=/"/g,I=/^(?:script|style|textarea|title)$/i,L=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),V=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),W=new WeakMap,G=M.createTreeWalker(M,129);function Q(t,e){if(!N(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const F=(t,e)=>{const i=t.length-1,s=[];let r,a=2===e?"<svg>":3===e?"<math>":"",o=k;for(let e=0;e<i;e++){const i=t[e];let n,l,d=-1,c=0;for(;c<i.length&&(o.lastIndex=c,l=o.exec(i),null!==l);)c=o.lastIndex,o===k?"!--"===l[1]?o=T:void 0!==l[1]?o=z:void 0!==l[2]?(I.test(l[2])&&(r=RegExp("</"+l[2],"g")),o=R):void 0!==l[3]&&(o=R):o===R?">"===l[0]?(o=r??k,d=-1):void 0===l[1]?d=-2:(d=o.lastIndex-l[2].length,n=l[1],o=void 0===l[3]?R:'"'===l[3]?D:j):o===D||o===j?o=R:o===T||o===z?o=k:(o=R,r=void 0);const h=o===R&&t[e+1].startsWith("/>")?" ":"";a+=o===k?i+P:d>=0?(s.push(n),i.slice(0,d)+C+i.slice(d)+E+h):i+E+(-2===d?e:h)}return[Q(t,a+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class K{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,a=0;const o=t.length-1,n=this.parts,[l,d]=F(t,e);if(this.el=K.createElement(l,i),G.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=G.nextNode())&&n.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(C)){const e=d[a++],i=s.getAttribute(t).split(E),o=/([.?@])?(.*)/.exec(e);n.push({type:1,index:r,name:o[2],strings:i,ctor:"."===o[1]?tt:"?"===o[1]?et:"@"===o[1]?it:X}),s.removeAttribute(t)}else t.startsWith(E)&&(n.push({type:6,index:r}),s.removeAttribute(t));if(I.test(s.tagName)){const t=s.textContent.split(E),e=t.length-1;if(e>0){s.textContent=A?A.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],O()),G.nextNode(),n.push({type:2,index:++r});s.append(t[e],O())}}}else if(8===s.nodeType)if(s.data===U)n.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(E,t+1));)n.push({type:7,index:r}),t+=E.length-1}r++}}static createElement(t,e){const i=M.createElement("template");return i.innerHTML=t,i}}function Z(t,e,i=t,s){if(e===V)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const a=q(e)?void 0:e._$litDirective$;return r?.constructor!==a&&(r?._$AO?.(!1),void 0===a?r=void 0:(r=new a(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=Z(t,r._$AS(t,e.values),r,s)),e}class J{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??M).importNode(e,!0);G.currentNode=s;let r=G.nextNode(),a=0,o=0,n=i[0];for(;void 0!==n;){if(a===n.index){let e;2===n.type?e=new Y(r,r.nextSibling,this,t):1===n.type?e=new n.ctor(r,n.name,n.strings,this,t):6===n.type&&(e=new st(r,this,t)),this._$AV.push(e),n=i[++o]}a!==n?.index&&(r=G.nextNode(),a++)}return G.currentNode=M,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Y{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),q(t)?t===B||null==t||""===t?(this._$AH!==B&&this._$AR(),this._$AH=B):t!==this._$AH&&t!==V&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>N(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==B&&q(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=K.createElement(Q(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new J(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=W.get(t.strings);return void 0===e&&W.set(t.strings,e=new K(t)),e}k(t){N(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new Y(this.O(O()),this.O(O()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=w(t).nextSibling;w(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class X{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=B,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=B}_$AI(t,e=this,i,s){const r=this.strings;let a=!1;if(void 0===r)t=Z(this,t,e,0),a=!q(t)||t!==this._$AH&&t!==V,a&&(this._$AH=t);else{const s=t;let o,n;for(t=r[0],o=0;o<r.length-1;o++)n=Z(this,s[i+o],e,o),n===V&&(n=this._$AH[o]),a||=!q(n)||n!==this._$AH[o],n===B?t=B:t!==B&&(t+=(n??"")+r[o+1]),this._$AH[o]=n}a&&!s&&this.j(t)}j(t){t===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends X{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===B?void 0:t}}class et extends X{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==B)}}class it extends X{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??B)===V)return;const i=this._$AH,s=t===B&&i!==B||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==B&&(i===B||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const rt=b.litHtmlPolyfillSupport;rt?.(K,Y),(b.litHtmlVersions??=[]).push("3.3.2");const at=globalThis;let ot=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new Y(e.insertBefore(O(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}};ot._$litElement$=!0,ot.finalized=!0,at.litElementHydrateSupport?.({LitElement:ot});const nt=at.litElementPolyfillSupport;nt?.({LitElement:ot}),(at.litElementVersions??=[]).push("4.2.2");const lt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},dt={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:_},ct=(t=dt,e,i)=>{const{kind:s,metadata:r}=i;let a=globalThis.litPropertyMetadata.get(r);if(void 0===a&&globalThis.litPropertyMetadata.set(r,a=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),a.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const r=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,r,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const r=this[s];e.call(this,i),this.requestUpdate(s,r,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function ht(t){return(e,i)=>"object"==typeof i?ct(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function pt(t){return ht({...t,state:!0,attribute:!1})}const ut=1,mt=t=>(...e)=>({_$litDirective$:t,values:e});let gt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};const vt=mt(class extends gt{constructor(t){if(super(t),t.type!==ut||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const i=t.element.classList;for(const t of this.st)t in e||(i.remove(t),this.st.delete(t));for(const t in e){const s=!!e[t];s===this.st.has(t)||this.nt?.has(t)||(s?(i.add(t),this.st.add(t)):(i.remove(t),this.st.delete(t)))}return V}}),ft="important",yt=" !"+ft,_t=mt(class extends gt{constructor(t){if(super(t),t.type!==ut||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,i)=>{const s=t[i];return null==s?e:e+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`},"")}update(t,[e]){const{style:i}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const t of this.ft)null==e[t]&&(this.ft.delete(t),t.includes("-")?i.removeProperty(t):i[t]=null);for(const t in e){const s=e[t];if(null!=s){this.ft.add(t);const e="string"==typeof s&&s.endsWith(yt);t.includes("-")||e?i.setProperty(t,e?s.slice(0,-11):s,e?ft:""):i[t]=s}}return V}}),$t={pm1:{good:10,mod:25,high:50},pm25:{good:12,mod:35,high:75},pm4:{good:20,mod:50,high:100},pm10:{good:50,mod:150,high:250},voc:{good:100,mod:200,high:300},co2:{good:800,mod:1200,high:2e3}},xt=[{max:50,color:"var(--air-quality-card-good-color, #86efac)",text:"var(--air-quality-card-good-text, #16a34a)",label:"Good",advice:"Air quality is satisfactory."},{max:100,color:"var(--air-quality-card-moderate-color, #fde68a)",text:"var(--air-quality-card-moderate-text, #ca8a04)",label:"Moderate",advice:"Acceptable air quality."},{max:150,color:"var(--air-quality-card-unhealthy-sg-color, #fdba74)",text:"var(--air-quality-card-unhealthy-sg-text, #ea580c)",label:"Unhealthy (SG)",advice:"Sensitive groups may be affected."},{max:200,color:"var(--air-quality-card-unhealthy-color, #fca5a5)",text:"var(--air-quality-card-unhealthy-text, #dc2626)",label:"Unhealthy",advice:"Everyone may experience health effects."},{max:300,color:"var(--air-quality-card-very-unhealthy-color, #d8b4fe)",text:"var(--air-quality-card-very-unhealthy-text, #9333ea)",label:"V. Unhealthy",advice:"Health alert: risk is increased."},{max:1/0,color:"var(--air-quality-card-hazardous-color, #fda4af)",text:"var(--air-quality-card-hazardous-text, #e11d48)",label:"Hazardous",advice:"Emergency health warning."}],bt=[{min:80,color:"var(--air-quality-card-good-color, #86efac)",text:"var(--air-quality-card-good-text, #16a34a)",label:"Good",advice:"Air quality is good"},{min:60,color:"var(--air-quality-card-moderate-color, #fde68a)",text:"var(--air-quality-card-moderate-text, #ca8a04)",label:"Moderate",advice:"Air quality is moderate"},{min:40,color:"var(--air-quality-card-poor-color, #fdba74)",text:"var(--air-quality-card-poor-text, #ea580c)",label:"Poor",advice:"Consider ventilating"},{min:-1/0,color:"var(--air-quality-card-bad-color, #fca5a5)",text:"var(--air-quality-card-bad-text, #dc2626)",label:"Bad",advice:"Ventilate now"}],wt={en:{topName:{aqi:"AQI Sensor",score:"Calculated Score"},subtitle:"Climate · Air Quality",ring:{aqi:"AQI",score:"SCORE"},stats:{temp:"TEMP",humidity:"HUMIDITY"},advice:{vocHigh:"VOCs detected",co2High:"CO2 high - open a window",co2VeryHigh:"CO2 very high - ventilate"}}};function At(t,e,i,s){return null==t?{label:"--",color:"var(--divider-color, #444)",text:"var(--secondary-text-color)",pct:0}:t<=e?{label:"GOOD",color:"var(--air-quality-card-good-color, #86efac)",text:"var(--air-quality-card-good-text, #16a34a)",pct:Math.min(100,t/s*100)}:t<=i?{label:"MOD",color:"var(--air-quality-card-moderate-color, #fde68a)",text:"var(--air-quality-card-moderate-text, #ca8a04)",pct:Math.min(100,t/s*100)}:t<=s?{label:"HIGH",color:"var(--air-quality-card-unhealthy-sg-color, #fdba74)",text:"var(--air-quality-card-unhealthy-sg-text, #ea580c)",pct:Math.min(100,t/s*100)}:{label:"V.HIGH",color:"var(--air-quality-card-unhealthy-color, #fca5a5)",text:"var(--air-quality-card-unhealthy-text, #dc2626)",pct:100}}const St=((t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new a(i,t,s)})`
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
  }

  .tile-bar > .fill {
    height: 100%;
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
`,Ct=[{name:"title",label:"Card Title",helper:"Shown at the top of the card.",selector:{text:{}}},{name:"default_expanded",label:"Expanded by Default",helper:"Whether the card opens expanded. Click the title to toggle.",selector:{boolean:{}}},{name:"aqi_entity",label:"AQI Sensor (Optional)",helper:"If set, displays this sensor's value with EPA AirNow bands. If empty or unavailable, falls back to a calculated score from PM2.5, VOC, and CO2.",selector:{entity:{domain:"sensor",device_class:"aqi"}}},{name:"temp_entity",label:"Temperature Sensor",helper:"Shown next to the headline. Also feeds the optional history graph.",selector:{entity:{domain:"sensor",device_class:"temperature"}}},{name:"humid_entity",label:"Humidity Sensor",helper:"Shown next to the headline. Also feeds the optional history graph.",selector:{entity:{domain:"sensor",device_class:"humidity"}}},{name:"pm1_entity",label:"PM1.0 Sensor",helper:"Display only - does not contribute to the calculated score.",selector:{entity:{domain:"sensor",device_class:"pm1"}}},{name:"pm25_entity",label:"PM2.5 Sensor",helper:"Largest contributor to the calculated score (40% weight).",selector:{entity:{domain:"sensor",device_class:"pm25"}}},{name:"pm4_entity",label:"PM4.0 Sensor",helper:"Display only - does not contribute to the calculated score.",selector:{entity:{domain:"sensor"}}},{name:"pm10_entity",label:"PM10 Sensor",helper:"Display only - does not contribute to the calculated score.",selector:{entity:{domain:"sensor",device_class:"pm10"}}},{name:"voc_entity",label:"VOC Index Sensor",helper:"Sensirion VOC Index (0-500 scale). Other TVOC sensors may produce misleading bands.",selector:{entity:{domain:"sensor",device_class:"volatile_organic_compounds"}}},{name:"co2_entity",label:"CO2 Sensor (ppm)",helper:"Contributes to the calculated score (35% weight). Drives 'open a window' advice above 1000 ppm.",selector:{entity:{domain:"sensor",device_class:"carbon_dioxide"}}}];let Et=class extends ot{setConfig(t){this._config=t}render(){return this.hass&&this._config?L`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${Ct}
        .computeLabel=${t=>t.label||t.name}
        .computeHelper=${t=>t.helper||""}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `:L``}_valueChanged(t){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t.detail.value},bubbles:!0,composed:!0}))}};t([ht({attribute:!1})],Et.prototype,"hass",void 0),t([pt()],Et.prototype,"_config",void 0),Et=t([lt("air-quality-card-editor")],Et);console.info("%c  AIR-QUALITY-CARD  %c  Version 0.1.0  ","color: white; font-weight: bold; background: #03a9f4","color: #03a9f4; font-weight: bold; background: white");const Ut={aqi_entity:["sensor.","air_quality."],temp_entity:["sensor."],humid_entity:["sensor."],pm1_entity:["sensor."],pm25_entity:["sensor."],pm4_entity:["sensor."],pm10_entity:["sensor."],voc_entity:["sensor."],co2_entity:["sensor."]};let Pt=class extends ot{constructor(){super(...arguments),this._expanded=!0,this._graphConfigured=!1,this._expandedUserDriven=!1}static{this.styles=St}static getConfigElement(){return document.createElement("air-quality-card-editor")}static getStubConfig(){return{title:"Living Room",default_expanded:!0,aqi_entity:"",temp_entity:"",humid_entity:"",pm1_entity:"",pm25_entity:"",pm4_entity:"",pm10_entity:"",voc_entity:"",co2_entity:""}}setConfig(t){if(!t||"object"!=typeof t)throw new Error("Invalid configuration: expected an object");for(const[e,i]of Object.entries(Ut)){const s=t[e];if(null!=s&&""!==s&&("string"!=typeof s||!i.some(t=>s.startsWith(t))))throw new Error(`${e} must be one of (${i.map(t=>t+"*").join(", ")}), got: ${String(s)}`)}this._config=t,this._expandedUserDriven||(this._expanded=!1!==t.default_expanded),this._setupGraphCard(t)}getCardSize(){return 5}t(t){return function(t,e="en"){const i=e=>{const i=t.split(".").reduce((t,e)=>t&&"object"==typeof t?t[e]:void 0,e);return"string"==typeof i?i:void 0};return i(wt[e])??i(wt.en)??t}(t,this.hass?.locale?.language||this.hass?.language||"en")}_safeNum(t){if(!t||!this.hass?.states[t])return null;const e=this.hass.states[t].state;if("unavailable"===e||"unknown"===e)return null;const i=parseFloat(e);return isNaN(i)?null:i}_formatNum(t,e=1){return null==t?"--":t.toFixed(e)}_getUnit(t,e){return t&&this.hass?.states[t]&&this.hass.states[t].attributes.unit_of_measurement||e}_setupGraphCard(t){this._graphCard||(this._graphCard=document.createElement("mini-graph-card"));const e=[];if(t.temp_entity&&e.push({entity:t.temp_entity,name:"Temp",color:"#fde68a"}),t.humid_entity&&e.push({entity:t.humid_entity,name:"Humidity",color:"#a8c0e0",y_axis:"secondary"}),0===e.length)return void(this._graphCard.style.display="none");const i=customElements.whenDefined("mini-graph-card"),s=new Promise((t,e)=>setTimeout(()=>e(new Error("mini-graph-card not installed")),2e3));Promise.race([i,s]).then(()=>{try{this._graphCard.setConfig({type:"custom:mini-graph-card",entities:e,hours_to_show:24,points_per_hour:2,line_width:2,animate:!0,smoothing:!0,hour24:!0,height:60,show:{name:!1,icon:!1,state:!1,legend:!0,labels:!1,fill:"fade"}})}catch(t){throw t}this._graphConfigured=!0,this._graphCard.style.display="block",this.hass&&(this._graphCard.hass=this.hass)}).catch(t=>{this._graphConfigured=!1,this._graphCard&&(this._graphCard.style.display="none");(t instanceof Error?t.message:String(t)).includes("not installed")?console.info("[air-quality-card] mini-graph-card not found, temp/humidity history graph disabled. Install via HACS to enable it."):console.warn("[air-quality-card] mini-graph-card setConfig failed:",t)})}updated(t){t.has("hass")&&this._graphCard&&this._graphConfigured&&this.hass&&(this._graphCard.hass=this.hass)}_toggle(){this._expanded=!this._expanded,this._expandedUserDriven=!0}_onKey(t){"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this._toggle())}render(){if(!this._config||!this.hass)return L``;const t=this._config,e=t.aqi_entity?this.hass.states[t.aqi_entity]:null,i=e?parseFloat(e.state):NaN,s=!!e&&!isNaN(i),r=s?e.attributes.friendly_name||this.t("topName.aqi"):this.t("topName.score"),a=this._safeNum(t.pm1_entity),o=this._safeNum(t.pm25_entity),n=this._safeNum(t.pm4_entity),l=this._safeNum(t.pm10_entity),d=this._safeNum(t.voc_entity),c=this._safeNum(t.co2_entity),h=this._safeNum(t.temp_entity),p=this._safeNum(t.humid_entity),u=this._getUnit(t.temp_entity,"°C"),m=this._getUnit(t.humid_entity,"%"),g=this._getUnit(t.pm1_entity,"µg/m³"),v=this._getUnit(t.pm25_entity,"µg/m³"),f=this._getUnit(t.pm4_entity,"µg/m³"),y=this._getUnit(t.pm10_entity,"µg/m³"),_=this._getUnit(t.voc_entity,"index"),$=this._getUnit(t.co2_entity,"ppm"),x=2*Math.PI*42;let b,w,A,S,C,E,U;if(s){b=Math.round(i),U=this.t("ring.aqi");const t=xt.find(t=>i<=t.max);S=t.color,C=t.text,w=t.label,A=t.advice;E=x-Math.min(Math.max(i,0)/500,1)*x}else{const t=function({pm25:t,voc:e,co2:i}){const s=[{value:t,divisor:75,weight:40},{value:e,divisor:500,weight:25},{value:null!=i?i-400:null,divisor:2200,weight:35}].filter(t=>null!=t.value);if(0===s.length)return{score:null,label:"No data",color:"var(--air-quality-card-no-data-color, #9ca3af)",text:"var(--secondary-text-color)",advice:"Configure PM2.5, VOC, or CO₂ sensors to see a calculated score.",pct:0};const r=s.reduce((t,e)=>t+e.weight,0),a=s.reduce((t,e)=>t+Math.min(1,Math.max(0,e.value/e.divisor))*(e.weight/r)*100,0),o=Math.min(100,Math.max(0,Math.round(100-a))),n=bt.find(t=>o>=t.min);return{score:o,label:n.label,color:n.color,text:n.text,advice:n.advice,pct:o/100}}({pm25:o,voc:d,co2:c});b=null==t.score?"--":t.score,U=this.t("ring.score"),S=t.color,C=t.text,w=t.label,A=t.advice,E=x-t.pct*x}("Good"===w||"Moderate"===w)&&(null!=d&&d>200&&(A=this.t("advice.vocHigh")),null!=c&&c>1e3&&(A=this.t("advice.co2High")),null!=c&&c>1500&&(A=this.t("advice.co2VeryHigh")));const P=$t,M=At(a,P.pm1.good,P.pm1.mod,P.pm1.high),O=At(o,P.pm25.good,P.pm25.mod,P.pm25.high),q=At(n,P.pm4.good,P.pm4.mod,P.pm4.high),N=At(l,P.pm10.good,P.pm10.mod,P.pm10.high),H=At(d,P.voc.good,P.voc.mod,P.voc.high),k=At(c,P.co2.good,P.co2.mod,P.co2.high),T=s?e.attributes.unit_of_measurement||"AQI":"/ 100",z=`${t.title||"Air quality"}: ${w}, ${b} ${T}`.trim(),R=`color-mix(in srgb, ${S} 12%, transparent)`,j=`color-mix(in srgb, ${S} 35%, transparent)`;return L`
      <ha-card>
        <div
          class="top"
          role="button"
          tabindex="0"
          aria-expanded=${this._expanded?"true":"false"}
          aria-label=${z+(this._expanded?". Activate to collapse.":". Activate to expand.")}
          @click=${this._toggle}
          @keydown=${this._onKey}
        >
          ${this._expanded?this._renderExpandedHeader(t,r,b,s,S,C,A,h,p,u,m,U,w,42,x,E,z):this._renderCollapsed(t,b,s,e,S,C,w,R,j,z)}
        </div>

        <div
          class="graph"
          style=${this._expanded&&this._graphConfigured?"":"display:none"}
        >
          ${this._graphCard??B}
        </div>

        ${this._expanded?this._renderBottom({pm1:a,pm25:o,pm4:n,pm10:l,voc:d,co2:c,pm1Unit:g,pm25Unit:v,pm4Unit:f,pm10Unit:y,vocUnit:_,co2Unit:$,pm1S:M,pm25S:O,pm4S:q,pm10S:N,vocS:H,co2S:k}):B}
      </ha-card>
    `}_renderCollapsed(t,e,i,s,r,a,o,n,l,d){const c="--"===e?"":i?s?.attributes.unit_of_measurement||"":"/ 100";return L`
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
            <span class="num" style=${_t({color:a})}>${e}</span>
            <span class="unit">${c}</span>
          </div>
          <div
            class="chip"
            style=${_t({"--chip-bg":n,"--chip-border":l,color:a})}
          >
            <span class="dot" style=${_t({background:r})} aria-hidden="true"></span>
            ${o}
          </div>
        </div>
      </div>
    `}_renderExpandedHeader(t,e,i,s,r,a,o,n,l,d,c,h,p,u,m,g,v){const f=!s&&"--"!==i;return L`
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
          <div class="headline" role="group" aria-label=${v}>
            <span class="num" style=${_t({color:a})}>${i}</span>
            <span class="unit">${f?"/ 100":""}</span>
          </div>
          <div class="advice">${o}</div>

          <div class="stats">
            <div
              class=${vt({stat:!0,empty:null==n})}
              aria-label="Temperature: ${this._formatNum(n,1)} ${d}"
            >
              <div class="stat-value">
                <span class="num">${this._formatNum(n,1)}</span>
                <span class="unit">${null==n?"":d}</span>
              </div>
              <div class="stat-label" aria-hidden="true">${this.t("stats.temp")}</div>
            </div>
            <div class="divider" aria-hidden="true"></div>
            <div
              class=${vt({stat:!0,empty:null==l})}
              aria-label="Humidity: ${this._formatNum(l,0)} ${c}"
            >
              <div class="stat-value">
                <span class="num">${this._formatNum(l,0)}</span>
                <span class="unit">${null==l?"":c}</span>
              </div>
              <div class="stat-label" aria-hidden="true">${this.t("stats.humidity")}</div>
            </div>
          </div>
        </div>

        <div
          class="ring-wrapper"
          role="meter"
          aria-valuenow=${"number"==typeof i?i:0}
          aria-valuemin="0"
          aria-valuemax=${s?500:100}
          aria-label="${h}: ${i}, ${p}"
        >
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <title>${h} ${i}</title>
            <circle class="ring-bg" cx="50" cy="50" r=${u}></circle>
            <circle
              class="ring-fg"
              cx="50"
              cy="50"
              r=${u}
              style=${_t({stroke:r})}
              stroke-dasharray=${m}
              stroke-dashoffset=${g}
            ></circle>
          </svg>
          <div class="ring-center" aria-hidden="true">
            <div class="ring-top-text">${h}</div>
            <div class="ring-bottom-text" style=${_t({color:a})}>
              ${s||"--"===i?p:`${i}%`}
            </div>
          </div>
        </div>
      </div>
    `}_renderBottom(t){const e=(t,e,i,s)=>L`
      <div
        class=${vt({tile:!0,empty:null==e})}
        role="group"
        aria-label="${t}: ${null==e?"no data":`${e.toLocaleString()} ${i}`}, ${s.label}"
      >
        <div class="tile-head" aria-hidden="true">
          <span class="tile-name">${t}</span>
          <span class="tile-status" style=${_t({color:s.text})}>${s.label}</span>
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
          <div class="fill" style=${_t({width:`${s.pct}%`,background:s.color})}></div>
        </div>
      </div>
    `;return L`
      <div class="bottom">
        <div class="tile-grid pm-grid">
          ${e("PM1.0",t.pm1,t.pm1Unit,t.pm1S)}
          ${e("PM2.5",t.pm25,t.pm25Unit,t.pm25S)}
          ${e("PM4.0",t.pm4,t.pm4Unit,t.pm4S)}
          ${e("PM10",t.pm10,t.pm10Unit,t.pm10S)}
        </div>
        <div class="tile-grid">
          ${e("VOC",t.voc,t.vocUnit,t.vocS)}
          ${e("CO₂",t.co2,t.co2Unit,t.co2S)}
        </div>
      </div>
    `}};t([ht({attribute:!1})],Pt.prototype,"hass",void 0),t([pt()],Pt.prototype,"_config",void 0),t([pt()],Pt.prototype,"_expanded",void 0),Pt=t([lt("air-quality-card")],Pt),window.customCards=window.customCards||[],window.customCards.push({type:"air-quality-card",name:"Air Quality Card",preview:!0,description:"A custom card displaying air quality metrics and an overall score."});export{Pt as AirQualityCard};
