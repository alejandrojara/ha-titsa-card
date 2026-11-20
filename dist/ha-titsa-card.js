/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const I = globalThis, W = I.ShadowRoot && (I.ShadyCSS === void 0 || I.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Z = Symbol(), tt = /* @__PURE__ */ new WeakMap();
let mt = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== Z) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (W && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = tt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && tt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Ct = (s) => new mt(typeof s == "string" ? s : s + "", void 0, Z), _t = (s, ...t) => {
  const e = s.length === 1 ? s[0] : t.reduce((i, r, o) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + s[o + 1], s[0]);
  return new mt(e, s, Z);
}, Tt = (s, t) => {
  if (W) s.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), r = I.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = e.cssText, s.appendChild(i);
  }
}, et = W ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return Ct(e);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: kt, defineProperty: Pt, getOwnPropertyDescriptor: Mt, getOwnPropertyNames: Nt, getOwnPropertySymbols: Ut, getPrototypeOf: Ot } = Object, L = globalThis, it = L.trustedTypes, zt = it ? it.emptyScript : "", Rt = L.reactiveElementPolyfillSupport, N = (s, t) => s, D = { toAttribute(s, t) {
  switch (t) {
    case Boolean:
      s = s ? zt : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, t) {
  let e = s;
  switch (t) {
    case Boolean:
      e = s !== null;
      break;
    case Number:
      e = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(s);
      } catch {
        e = null;
      }
  }
  return e;
} }, K = (s, t) => !kt(s, t), st = { attribute: !0, type: String, converter: D, reflect: !1, useDefault: !1, hasChanged: K };
Symbol.metadata ??= Symbol("metadata"), L.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let E = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = st) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(t, i, e);
      r !== void 0 && Pt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: r, set: o } = Mt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: r, set(n) {
      const l = r?.call(this);
      o?.call(this, n), this.requestUpdate(t, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? st;
  }
  static _$Ei() {
    if (this.hasOwnProperty(N("elementProperties"))) return;
    const t = Ot(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(N("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(N("properties"))) {
      const e = this.properties, i = [...Nt(e), ...Ut(e)];
      for (const r of i) this.createProperty(r, e[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, r] of e) this.elementProperties.set(i, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const r = this._$Eu(e, i);
      r !== void 0 && this._$Eh.set(r, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const r of i) e.unshift(et(r));
    } else t !== void 0 && e.push(et(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Tt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    const i = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, i);
    if (r !== void 0 && i.reflect === !0) {
      const o = (i.converter?.toAttribute !== void 0 ? i.converter : D).toAttribute(e, i.type);
      this._$Em = t, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const i = this.constructor, r = i._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const o = i.getPropertyOptions(r), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : D;
      this._$Em = r;
      const l = n.fromAttribute(e, o.type);
      this[r] = l ?? this._$Ej?.get(r) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, r = !1, o) {
    if (t !== void 0) {
      const n = this.constructor;
      if (r === !1 && (o = this[t]), i ??= n.getPropertyOptions(t), !((i.hasChanged ?? K)(o, e) || i.useDefault && i.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: r, wrapped: o }, n) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), o !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [r, o] of this._$Ep) this[r] = o;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [r, o] of i) {
        const { wrapped: n } = o, l = this[r];
        n !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, o, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
E.elementStyles = [], E.shadowRootOptions = { mode: "open" }, E[N("elementProperties")] = /* @__PURE__ */ new Map(), E[N("finalized")] = /* @__PURE__ */ new Map(), Rt?.({ ReactiveElement: E }), (L.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const G = globalThis, rt = (s) => s, j = G.trustedTypes, nt = j ? j.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, gt = "$lit$", b = `lit$${Math.random().toFixed(9).slice(2)}$`, vt = "?" + b, Ht = `<${vt}>`, w = document, U = () => w.createComment(""), O = (s) => s === null || typeof s != "object" && typeof s != "function", J = Array.isArray, It = (s) => J(s) || typeof s?.[Symbol.iterator] == "function", F = `[ 	
\f\r]`, M = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ot = /-->/g, at = />/g, y = RegExp(`>|${F}(?:([^\\s"'>=/]+)(${F}*=${F}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), lt = /'/g, ct = /"/g, bt = /^(?:script|style|textarea|title)$/i, Dt = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), f = Dt(1), T = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), ht = /* @__PURE__ */ new WeakMap(), x = w.createTreeWalker(w, 129);
function $t(s, t) {
  if (!J(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return nt !== void 0 ? nt.createHTML(t) : t;
}
const jt = (s, t) => {
  const e = s.length - 1, i = [];
  let r, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = M;
  for (let l = 0; l < e; l++) {
    const a = s[l];
    let d, p, c = -1, m = 0;
    for (; m < a.length && (n.lastIndex = m, p = n.exec(a), p !== null); ) m = n.lastIndex, n === M ? p[1] === "!--" ? n = ot : p[1] !== void 0 ? n = at : p[2] !== void 0 ? (bt.test(p[2]) && (r = RegExp("</" + p[2], "g")), n = y) : p[3] !== void 0 && (n = y) : n === y ? p[0] === ">" ? (n = r ?? M, c = -1) : p[1] === void 0 ? c = -2 : (c = n.lastIndex - p[2].length, d = p[1], n = p[3] === void 0 ? y : p[3] === '"' ? ct : lt) : n === ct || n === lt ? n = y : n === ot || n === at ? n = M : (n = y, r = void 0);
    const _ = n === y && s[l + 1].startsWith("/>") ? " " : "";
    o += n === M ? a + Ht : c >= 0 ? (i.push(d), a.slice(0, c) + gt + a.slice(c) + b + _) : a + b + (c === -2 ? l : _);
  }
  return [$t(s, o + (s[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class z {
  constructor({ strings: t, _$litType$: e }, i) {
    let r;
    this.parts = [];
    let o = 0, n = 0;
    const l = t.length - 1, a = this.parts, [d, p] = jt(t, e);
    if (this.el = z.createElement(d, i), x.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (r = x.nextNode()) !== null && a.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const c of r.getAttributeNames()) if (c.endsWith(gt)) {
          const m = p[n++], _ = r.getAttribute(c).split(b), v = /([.?@])?(.*)/.exec(m);
          a.push({ type: 1, index: o, name: v[2], strings: _, ctor: v[1] === "." ? Bt : v[1] === "?" ? qt : v[1] === "@" ? Ft : B }), r.removeAttribute(c);
        } else c.startsWith(b) && (a.push({ type: 6, index: o }), r.removeAttribute(c));
        if (bt.test(r.tagName)) {
          const c = r.textContent.split(b), m = c.length - 1;
          if (m > 0) {
            r.textContent = j ? j.emptyScript : "";
            for (let _ = 0; _ < m; _++) r.append(c[_], U()), x.nextNode(), a.push({ type: 2, index: ++o });
            r.append(c[m], U());
          }
        }
      } else if (r.nodeType === 8) if (r.data === vt) a.push({ type: 2, index: o });
      else {
        let c = -1;
        for (; (c = r.data.indexOf(b, c + 1)) !== -1; ) a.push({ type: 7, index: o }), c += b.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const i = w.createElement("template");
    return i.innerHTML = t, i;
  }
}
function k(s, t, e = s, i) {
  if (t === T) return t;
  let r = i !== void 0 ? e._$Co?.[i] : e._$Cl;
  const o = O(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== o && (r?._$AO?.(!1), o === void 0 ? r = void 0 : (r = new o(s), r._$AT(s, e, i)), i !== void 0 ? (e._$Co ??= [])[i] = r : e._$Cl = r), r !== void 0 && (t = k(s, r._$AS(s, t.values), r, i)), t;
}
class Lt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: i } = this._$AD, r = (t?.creationScope ?? w).importNode(e, !0);
    x.currentNode = r;
    let o = x.nextNode(), n = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let d;
        a.type === 2 ? d = new H(o, o.nextSibling, this, t) : a.type === 1 ? d = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (d = new Vt(o, this, t)), this._$AV.push(d), a = i[++l];
      }
      n !== a?.index && (o = x.nextNode(), n++);
    }
    return x.currentNode = w, r;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class H {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, i, r) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = r, this._$Cv = r?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = k(this, t, e), O(t) ? t === h || t == null || t === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : t !== this._$AH && t !== T && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : It(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== h && O(this._$AH) ? this._$AA.nextSibling.data = t : this.T(w.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: i } = t, r = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = z.createElement($t(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === r) this._$AH.p(e);
    else {
      const o = new Lt(r, this), n = o.u(this.options);
      o.p(e), this.T(n), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = ht.get(t.strings);
    return e === void 0 && ht.set(t.strings, e = new z(t)), e;
  }
  k(t) {
    J(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, r = 0;
    for (const o of t) r === e.length ? e.push(i = new H(this.O(U()), this.O(U()), this, this.options)) : i = e[r], i._$AI(o), r++;
    r < e.length && (this._$AR(i && i._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const i = rt(t).nextSibling;
      rt(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class B {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, r, o) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = h;
  }
  _$AI(t, e = this, i, r) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) t = k(this, t, e, 0), n = !O(t) || t !== this._$AH && t !== T, n && (this._$AH = t);
    else {
      const l = t;
      let a, d;
      for (t = o[0], a = 0; a < o.length - 1; a++) d = k(this, l[i + a], e, a), d === T && (d = this._$AH[a]), n ||= !O(d) || d !== this._$AH[a], d === h ? t = h : t !== h && (t += (d ?? "") + o[a + 1]), this._$AH[a] = d;
    }
    n && !r && this.j(t);
  }
  j(t) {
    t === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Bt extends B {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === h ? void 0 : t;
  }
}
class qt extends B {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== h);
  }
}
class Ft extends B {
  constructor(t, e, i, r, o) {
    super(t, e, i, r, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = k(this, t, e, 0) ?? h) === T) return;
    const i = this._$AH, r = t === h && i !== h || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== h && (i === h || r);
    r && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Vt {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    k(this, t);
  }
}
const Wt = G.litHtmlPolyfillSupport;
Wt?.(z, H), (G.litHtmlVersions ??= []).push("3.3.3");
const Zt = (s, t, e) => {
  const i = e?.renderBefore ?? t;
  let r = i._$litPart$;
  if (r === void 0) {
    const o = e?.renderBefore ?? null;
    i._$litPart$ = r = new H(t.insertBefore(U(), o), o, void 0, e ?? {});
  }
  return r._$AI(s), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Q = globalThis;
class C extends E {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Zt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return T;
  }
}
C._$litElement$ = !0, C.finalized = !0, Q.litElementHydrateSupport?.({ LitElement: C });
const Kt = Q.litElementPolyfillSupport;
Kt?.({ LitElement: C });
(Q.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const yt = (s) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(s, t);
  }) : customElements.define(s, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Gt = { attribute: !0, type: String, converter: D, reflect: !1, hasChanged: K }, Jt = (s = Gt, t, e) => {
  const { kind: i, metadata: r } = e;
  let o = globalThis.litPropertyMetadata.get(r);
  if (o === void 0 && globalThis.litPropertyMetadata.set(r, o = /* @__PURE__ */ new Map()), i === "setter" && ((s = Object.create(s)).wrapped = !0), o.set(e.name, s), i === "accessor") {
    const { name: n } = e;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(n, a, s, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(n, void 0, s, l), l;
    } };
  }
  if (i === "setter") {
    const { name: n } = e;
    return function(l) {
      const a = this[n];
      t.call(this, l), this.requestUpdate(n, a, s, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function X(s) {
  return (t, e) => typeof e == "object" ? Jt(s, t, e) : ((i, r, o) => {
    const n = r.hasOwnProperty(o);
    return r.constructor.createProperty(o, i), n ? Object.getOwnPropertyDescriptor(r, o) : void 0;
  })(s, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function P(s) {
  return X({ ...s, state: !0, attribute: !1 });
}
const dt = {
  es: {
    now: "Ahora",
    min_short: "min",
    stop_prefix: "Parada",
    refresh: "Actualizar",
    check_now: "Consultar ahora",
    paused_title: "Sondeo en pausa",
    paused_subtitle: "Fuera de ventana horaria o en modo manual.",
    empty_title: "Sin llegadas estimadas",
    empty_subtitle: "No hay guaguas aproximándose en este momento.",
    unavailable_title: "Parada no disponible",
    unavailable_subtitle: "Comprueba la conexión con la integración TITSA.",
    entity_missing_title: "Entidad no encontrada",
    entity_missing_subtitle: "Selecciona un sensor de parada de TITSA en el editor.",
    updated_at: "Actualizado",
    manual_badge: "Manual",
    show_more: "Ver {count} más",
    show_less: "Ver menos",
    no_refresh_button: "Botón de actualización no encontrado",
    refresh_error: "No se pudo actualizar. Espera unos segundos e inténtalo de nuevo.",
    // Editor labels
    editor_entity: "Sensor de parada TITSA",
    editor_title: "Título personalizado (opcional)",
    editor_style: "Estilo visual",
    editor_style_marquesina: "Marquesina TITSA (cabecera verde)",
    editor_style_minimal: "Minimalista (nativo de Home Assistant)",
    editor_max_arrivals: "Máximo de llegadas visibles",
    editor_compact: "Modo compacto",
    editor_show_arrival_time: "Mostrar hora estimada (HH:MM)",
    editor_show_route_name: "Mostrar nombre completo de la línea",
    editor_show_footer: "Mostrar pie con última actualización",
    editor_tap_to_refresh: "Actualizar al pulsar sobre la tarjeta",
    editor_refresh_entity: "Botón de actualización (detección automática)",
    editor_lines: "Filtrar líneas en esta tarjeta (opcional)"
  },
  en: {
    now: "Now",
    min_short: "min",
    stop_prefix: "Stop",
    refresh: "Refresh",
    check_now: "Check now",
    paused_title: "Polling paused",
    paused_subtitle: "Outside schedule window or manual-only mode.",
    empty_title: "No upcoming buses",
    empty_subtitle: "No buses are approaching this stop right now.",
    unavailable_title: "Stop unavailable",
    unavailable_subtitle: "Check the TITSA integration connection.",
    entity_missing_title: "Entity not found",
    entity_missing_subtitle: "Select a TITSA stop sensor in the card editor.",
    updated_at: "Updated",
    manual_badge: "Manual",
    show_more: "Show {count} more",
    show_less: "Show less",
    no_refresh_button: "Refresh button entity not found",
    refresh_error: "Unable to refresh right now. Wait a moment and try again.",
    // Editor labels
    editor_entity: "TITSA stop sensor",
    editor_title: "Custom title (optional)",
    editor_style: "Visual style",
    editor_style_marquesina: "TITSA Bus Shelter (green header)",
    editor_style_minimal: "Minimal (native Home Assistant)",
    editor_max_arrivals: "Maximum visible arrivals",
    editor_compact: "Compact mode",
    editor_show_arrival_time: "Show estimated clock time (HH:MM)",
    editor_show_route_name: "Show full route description",
    editor_show_footer: "Show footer with last update",
    editor_tap_to_refresh: "Tap card to refresh",
    editor_refresh_entity: "Refresh button override (auto-detected)",
    editor_lines: "Filter lines on this card (optional)"
  }
};
function xt(s) {
  return (s?.locale?.language || s?.language || (typeof navigator < "u" ? navigator.language : "es")).toLowerCase().startsWith("es") ? "es" : "en";
}
function u(s, t, e) {
  const i = xt(s);
  let r = dt[i]?.[t] ?? dt.en[t] ?? t;
  if (e)
    for (const [o, n] of Object.entries(e))
      r = r.replace(`{${o}}`, String(n));
  return r;
}
const Qt = /* @__PURE__ */ new Set([
  "de",
  "del",
  "la",
  "las",
  "los",
  "el",
  "y",
  "e",
  "a",
  "al",
  "en",
  "con",
  "por",
  "lo"
]), Xt = /* @__PURE__ */ new Set(["TFS", "TFN", "ULL", "IES", "CEIP", "S/C", "SC", "TITSA", "(T)"]);
function $(s) {
  const t = s.trim().toUpperCase();
  if (!t) return "";
  const e = t.match(/^0*(\d+)([A-Z]*)$/);
  return e ? `${e[1].replace(/^0+/, "") || "0"}${e[2]}` : t;
}
function ut(s) {
  const t = s.replace(/\s+/g, " ").trim().replace(/\.(?=[A-ZÁÉÍÓÚÜÑ]{2})/g, ". ");
  if (!t) return "";
  if (t !== t.toUpperCase()) return t;
  const e = t.split(" ");
  return e.map((i, r) => {
    if (Xt.has(i) || /^(?:[A-ZÁÉÍÓÚÜÑ]\.){2,}$/.test(i))
      return i;
    const n = i.toLowerCase().match(/^([("'\-/]*)([^\W\d_])(.*)$/u);
    if (!n) return i;
    const [, l, a, d] = n, p = a + d, c = r > 0 ? e[r - 1] : "";
    return !(r === 0 || /^[-–—/:|]$/.test(c) || /[-–—/:|]$/.test(c)) && !l && Qt.has(p) ? p : `${l}${a.toUpperCase()}${d}`;
  }).join(" ");
}
function Yt(s) {
  if (!s) return [];
  const t = s.attributes;
  if (Array.isArray(t.arrivals))
    return t.arrivals;
  if (typeof t.line == "string" && t.line.trim()) {
    const e = [];
    (typeof t.minutes == "number" && !Number.isNaN(t.minutes) || s.state && s.state !== "unknown" && s.state !== "unavailable" && !Number.isNaN(Date.parse(s.state))) && e.push({
      line: t.line,
      line_name: t.line_name ?? void 0,
      destination: t.destination ?? "",
      minutes: typeof t.minutes == "number" ? t.minutes : 0,
      estimated_arrival: s.state,
      is_approximate: !1
    });
    for (const r of t.following_arrivals ?? [])
      e.push({
        line: t.line,
        line_name: t.line_name ?? void 0,
        destination: r.destination,
        minutes: r.minutes,
        estimated_arrival: r.estimated_arrival,
        is_approximate: r.is_approximate
      });
    return e;
  }
  return [];
}
function te(s, t = Date.now()) {
  if (s.estimated_arrival) {
    const e = Date.parse(s.estimated_arrival);
    if (!Number.isNaN(e)) {
      const i = (e - t) / 1e3;
      return i <= 30 ? 0 : Math.round(i / 60);
    }
  }
  return Math.max(0, Math.round(s.minutes ?? 0));
}
function pt(s, t) {
  if (!s) return "";
  const e = new Date(s);
  if (Number.isNaN(e.getTime())) return "";
  try {
    return new Intl.DateTimeFormat(t === "es" ? "es-ES" : "en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: !1
    }).format(e);
  } catch {
    const i = String(e.getHours()).padStart(2, "0"), r = String(e.getMinutes()).padStart(2, "0");
    return `${i}:${r}`;
  }
}
function V(s, t) {
  if (t.refresh_entity)
    return t.refresh_entity;
  if (!s || !t.entity)
    return;
  const e = s.entities?.[t.entity];
  if (e?.device_id && s.entities) {
    for (const [n, l] of Object.entries(s.entities))
      if (l?.device_id === e.device_id && n.startsWith("button.") && s.states[n])
        return n;
  }
  const i = t.entity.replace(/^sensor\./, ""), r = /* @__PURE__ */ new Set();
  for (const n of ["_proxima_guagua", "_next_bus"])
    i.endsWith(n) && r.add(i.slice(0, -n.length));
  const o = i.match(/^(.+)_(?:linea|line)_[a-z0-9]+$/i);
  o && r.add(o[1]);
  for (const n of r)
    for (const l of ["_actualizar", "_refresh"]) {
      const a = `button.${n}${l}`;
      if (s.states[a])
        return a;
    }
}
function ee(s) {
  if (!s?.states) return "";
  for (const [t, e] of Object.entries(s.states)) {
    if (!t.startsWith("sensor.") || !e) continue;
    const i = e.attributes;
    if (i && typeof i.stop_id == "string" && Array.isArray(i.arrivals))
      return t;
  }
  return "";
}
function ie(s, t) {
  if (!s || !t) return [];
  const e = s.states[t];
  if (!e) return [];
  const i = e.attributes, r = /* @__PURE__ */ new Set();
  if (typeof i.line == "string") {
    const o = $(i.line);
    o && r.add(o);
  }
  for (const o of i.filtered_lines ?? []) {
    const n = $(String(o));
    n && r.add(n);
  }
  for (const o of i.arrivals ?? []) {
    const n = $(String(o.line));
    n && r.add(n);
  }
  return [...r].sort((o, n) => o.localeCompare(n, void 0, { numeric: !0 }));
}
function se(s) {
  const t = Number.parseInt(s, 10);
  return !Number.isNaN(t) && t >= 970 && t <= 979;
}
var re = Object.defineProperty, ne = Object.getOwnPropertyDescriptor, Y = (s, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? ne(t, e) : t, o = s.length - 1, n; o >= 0; o--)
    (n = s[o]) && (r = (i ? n(t, e, r) : n(r)) || r);
  return i && r && re(t, e, r), r;
};
let R = class extends C {
  constructor() {
    super(...arguments), this._computeLabel = (s) => u(this.hass, `editor_${s.name}`);
  }
  setConfig(s) {
    this._config = {
      style: "marquesina",
      max_arrivals: 5,
      compact: !1,
      show_arrival_time: !1,
      show_route_name: !1,
      show_footer: !0,
      tap_to_refresh: !0,
      ...s
    };
  }
  _buildSchema() {
    const s = new Set(
      ie(this.hass, this._config?.entity)
    );
    for (const e of this._config?.lines ?? []) {
      const i = $(String(e));
      i && s.add(i);
    }
    const t = [...s].sort((e, i) => e.localeCompare(i, void 0, { numeric: !0 })).map((e) => ({ value: e, label: e }));
    return [
      {
        name: "entity",
        required: !0,
        selector: {
          entity: {
            filter: { domain: "sensor", integration: "titsa" }
          }
        }
      },
      {
        name: "style",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              {
                value: "marquesina",
                label: u(this.hass, "editor_style_marquesina")
              },
              {
                value: "minimal",
                label: u(this.hass, "editor_style_minimal")
              }
            ]
          }
        }
      },
      {
        name: "title",
        selector: { text: {} }
      },
      {
        name: "max_arrivals",
        selector: {
          number: { min: 1, max: 12, step: 1, mode: "slider" }
        }
      },
      {
        name: "lines",
        selector: {
          select: {
            multiple: !0,
            custom_value: !0,
            mode: "dropdown",
            options: t
          }
        }
      },
      {
        name: "compact",
        selector: { boolean: {} }
      },
      {
        name: "show_arrival_time",
        selector: { boolean: {} }
      },
      {
        name: "show_route_name",
        selector: { boolean: {} }
      },
      {
        name: "show_footer",
        selector: { boolean: {} }
      },
      {
        name: "tap_to_refresh",
        selector: { boolean: {} }
      },
      {
        name: "refresh_entity",
        selector: {
          entity: {
            filter: { domain: "button", integration: "titsa" }
          }
        }
      }
    ];
  }
  _valueChanged(s) {
    if (!this._config) return;
    const t = s.detail.value ?? {}, e = {
      ...this._config,
      ...t,
      type: this._config.type || "custom:ha-titsa-card",
      entity: typeof t.entity == "string" ? t.entity : this._config.entity || ""
    };
    if ((!e.title || !e.title.trim()) && delete e.title, e.refresh_entity || delete e.refresh_entity, Array.isArray(e.lines)) {
      const i = [
        ...new Set(e.lines.map((r) => $(String(r))).filter(Boolean))
      ];
      i.length > 0 ? e.lines = i : delete e.lines;
    } else
      delete e.lines;
    this._config = e, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: e },
        bubbles: !0,
        composed: !0
      })
    );
  }
  render() {
    return !this.hass || !this._config ? h : f`
      <div class="editor">
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${this._buildSchema()}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._valueChanged}
        ></ha-form>
      </div>
    `;
  }
};
R.styles = _t`
    .editor {
      padding: 4px 0;
    }
  `;
Y([
  X({ attribute: !1 })
], R.prototype, "hass", 2);
Y([
  P()
], R.prototype, "_config", 2);
R = Y([
  yt("ha-titsa-card-editor")
], R);
const oe = _t`
  :host {
    display: block;
    --titsa-green: #75ad1c;
    --titsa-green-dark: #578611;
    --titsa-green-tint: rgba(117, 173, 28, 0.14);
    --titsa-night: #2c4c7e;
    --titsa-urgent-bg: rgba(117, 173, 28, 0.18);
    --titsa-urgent-fg: #4b7809;
    --titsa-radius: var(--ha-card-border-radius, 12px);
  }

  ha-card.dark {
    --titsa-urgent-fg: #9bd63c;
    --titsa-urgent-bg: rgba(140, 198, 63, 0.22);
  }

  @media (prefers-color-scheme: dark) {
    ha-card:not(.light) {
      --titsa-urgent-fg: #9bd63c;
      --titsa-urgent-bg: rgba(140, 198, 63, 0.22);
    }
  }

  ha-card {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
    transition: box-shadow 180ms ease;
  }

  ha-card.interactive {
    cursor: pointer;
  }

  ha-card.interactive:focus-visible {
    outline: 2px solid var(--titsa-green);
    outline-offset: 2px;
  }

  /* ── Header: Marquesina (TITSA shelter green banner) ── */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 13px 16px;
  }

  .header.marquesina {
    background: linear-gradient(135deg, #7cb421 0%, var(--titsa-green-dark) 100%);
    color: #ffffff;
  }

  .header.minimal {
    background: transparent;
    color: var(--primary-text-color);
    border-bottom: 1px solid var(--divider-color, rgba(127, 127, 127, 0.18));
    padding: 12px 16px 10px;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    flex: 1;
  }

  .bus-emblem {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .header.marquesina .bus-emblem {
    background: rgba(255, 255, 255, 0.2);
    color: #ffffff;
  }

  .header.minimal .bus-emblem {
    background: var(--titsa-green-tint);
    color: var(--titsa-green);
  }

  .bus-emblem ha-icon {
    --mdc-icon-size: 20px;
  }

  .title-group {
    min-width: 0;
    flex: 1;
  }

  .stop-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.25;
    letter-spacing: -0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .stop-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 2px;
    font-size: 0.76rem;
    opacity: 0.88;
  }

  .header.minimal .stop-meta {
    color: var(--secondary-text-color);
    opacity: 1;
  }

  .stop-code-chip {
    display: inline-flex;
    align-items: center;
    padding: 1px 6px;
    border-radius: 6px;
    font-size: 0.72rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.02em;
  }

  .header.marquesina .stop-code-chip {
    background: rgba(0, 0, 0, 0.2);
    color: #ffffff;
  }

  .header.minimal .stop-code-chip {
    background: var(--secondary-background-color, rgba(127, 127, 127, 0.14));
    color: var(--primary-text-color);
  }

  .refresh-btn {
    appearance: none;
    border: none;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition:
      background-color 150ms ease,
      transform 150ms ease;
    padding: 0;
  }

  .header.marquesina .refresh-btn {
    background: rgba(255, 255, 255, 0.18);
    color: #ffffff;
  }

  .header.marquesina .refresh-btn:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .header.minimal .refresh-btn {
    background: transparent;
    color: var(--secondary-text-color);
  }

  .header.minimal .refresh-btn:hover {
    background: var(--secondary-background-color, rgba(127, 127, 127, 0.14));
    color: var(--primary-text-color);
  }

  .refresh-btn:active {
    transform: scale(0.94);
  }

  .refresh-btn:disabled {
    opacity: 0.55;
    cursor: default;
  }

  .refresh-btn ha-icon {
    --mdc-icon-size: 20px;
  }

  .refresh-btn.spinning ha-icon {
    animation: titsa-spin 0.8s linear infinite;
  }

  @keyframes titsa-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* ── Feedback banner (cooldown / error toast) ── */
  .notice {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    font-size: 0.8rem;
    background: rgba(245, 158, 11, 0.14);
    color: var(--primary-text-color);
    border-bottom: 1px solid var(--divider-color, rgba(127, 127, 127, 0.15));
  }

  .notice ha-icon {
    --mdc-icon-size: 16px;
    color: #d97706;
    flex-shrink: 0;
  }

  /* ── Arrivals list ── */
  .arrivals {
    list-style: none;
    margin: 0;
    padding: 6px 0;
  }

  .arrivals.compact {
    padding: 2px 0;
  }

  .arrival-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 16px;
    transition: background-color 120ms ease;
  }

  .arrivals.compact .arrival-row {
    padding: 6px 14px;
    gap: 10px;
  }

  .arrival-row + .arrival-row {
    border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.14));
  }

  .arrival-row:hover {
    background: var(--secondary-background-color, rgba(127, 127, 127, 0.06));
  }

  .line-pill {
    min-width: 44px;
    height: 28px;
    padding: 0 8px;
    border-radius: 7px;
    background: var(--titsa-green);
    color: #ffffff;
    font-size: 0.88rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.01em;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
  }

  .arrivals.compact .line-pill {
    min-width: 40px;
    height: 24px;
    font-size: 0.8rem;
  }

  .line-pill.night {
    background: var(--titsa-night);
  }

  .dest-col {
    min-width: 0;
    flex: 1;
  }

  .destination {
    font-size: 0.92rem;
    font-weight: 500;
    color: var(--primary-text-color);
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .arrivals.compact .destination {
    font-size: 0.86rem;
  }

  .route-sub {
    font-size: 0.74rem;
    color: var(--secondary-text-color);
    line-height: 1.25;
    margin-top: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .eta-col {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    flex-shrink: 0;
    text-align: right;
  }

  .eta-badge {
    font-size: 0.94rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: var(--primary-text-color);
    line-height: 1.2;
  }

  .eta-badge.now {
    padding: 3px 9px;
    border-radius: 999px;
    background: var(--titsa-green);
    color: #ffffff;
    font-size: 0.8rem;
    letter-spacing: 0.01em;
  }

  .eta-badge.imminent {
    padding: 2px 8px;
    border-radius: 999px;
    background: var(--titsa-urgent-bg);
    color: var(--titsa-urgent-fg);
    font-size: 0.86rem;
  }

  .eta-clock {
    font-size: 0.72rem;
    font-variant-numeric: tabular-nums;
    color: var(--secondary-text-color);
    margin-top: 2px;
  }

  /* ── Empty / Paused / Unavailable state ── */
  .state-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 22px 18px;
    gap: 6px;
  }

  .state-box > ha-icon {
    --mdc-icon-size: 28px;
    color: var(--secondary-text-color);
    opacity: 0.75;
    margin-bottom: 2px;
  }

  .state-box.paused > ha-icon {
    color: var(--titsa-green);
    opacity: 0.9;
  }

  .state-title {
    font-size: 0.94rem;
    font-weight: 600;
    color: var(--primary-text-color);
  }

  .state-subtitle {
    font-size: 0.8rem;
    color: var(--secondary-text-color);
    max-width: 300px;
    line-height: 1.35;
  }

  .cta-btn {
    margin-top: 8px;
    appearance: none;
    border: none;
    background: var(--titsa-green);
    color: #ffffff;
    font-size: 0.82rem;
    font-weight: 600;
    padding: 7px 14px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    transition:
      background-color 150ms ease,
      transform 120ms ease;
  }

  .cta-btn:hover {
    background: var(--titsa-green-dark);
  }

  .cta-btn:active {
    transform: scale(0.97);
  }

  .cta-btn ha-icon {
    --mdc-icon-size: 16px;
    color: #ffffff;
    margin: 0;
    opacity: 1;
  }

  /* ── Footer ── */
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 7px 16px 9px;
    border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.14));
    font-size: 0.75rem;
    color: var(--secondary-text-color);
  }

  .footer-left {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }

  .manual-tag {
    padding: 1px 6px;
    border-radius: 5px;
    background: var(--titsa-green-tint);
    color: var(--titsa-urgent-fg);
    font-weight: 600;
    font-size: 0.69rem;
  }

  .expand-btn {
    appearance: none;
    border: none;
    background: transparent;
    color: var(--titsa-urgent-fg);
    font-size: 0.76rem;
    font-weight: 600;
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 6px;
  }

  .expand-btn:hover {
    background: var(--titsa-green-tint);
  }
`;
var ae = Object.defineProperty, le = Object.getOwnPropertyDescriptor, A = (s, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? le(t, e) : t, o = s.length - 1, n; o >= 0; o--)
    (n = s[o]) && (r = (i ? n(t, e, r) : n(r)) || r);
  return i && r && ae(t, e, r), r;
};
const ft = {
  style: "marquesina",
  max_arrivals: 5,
  compact: !1,
  show_arrival_time: !1,
  show_route_name: !1,
  show_footer: !0,
  tap_to_refresh: !0
};
let g = class extends C {
  constructor() {
    super(...arguments), this._nowMs = Date.now(), this._refreshing = !1, this._expanded = !1, this._notice = null;
  }
  static getConfigElement() {
    return document.createElement("ha-titsa-card-editor");
  }
  static getStubConfig(s) {
    return {
      type: "custom:ha-titsa-card",
      entity: ee(s),
      style: "marquesina",
      max_arrivals: 5,
      show_footer: !0,
      tap_to_refresh: !0
    };
  }
  setConfig(s) {
    if (!s)
      throw new Error("Invalid configuration for ha-titsa-card");
    const t = typeof s.max_arrivals == "number" && s.max_arrivals >= 1 ? Math.min(12, Math.floor(s.max_arrivals)) : ft.max_arrivals;
    this._config = {
      ...ft,
      ...s,
      max_arrivals: t,
      style: s.style === "minimal" ? "minimal" : "marquesina"
    };
  }
  connectedCallback() {
    super.connectedCallback(), this._nowMs = Date.now(), this._tickTimer = window.setInterval(() => {
      this._nowMs = Date.now();
    }, 15e3);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._tickTimer !== void 0 && (window.clearInterval(this._tickTimer), this._tickTimer = void 0), this._noticeTimer !== void 0 && (window.clearTimeout(this._noticeTimer), this._noticeTimer = void 0), this._refreshTimer !== void 0 && (window.clearTimeout(this._refreshTimer), this._refreshTimer = void 0);
  }
  getCardSize() {
    const s = this._getFilteredArrivals(), t = this._expanded ? s.length : Math.min(s.length, this._config?.max_arrivals ?? 5), e = this._config?.compact ? 2 : 3;
    return Math.max(e, Math.min(8, Math.ceil(1.6 + t * 0.7)));
  }
  getGridOptions() {
    return {
      columns: 12,
      min_columns: 6,
      rows: "auto",
      min_rows: 2
    };
  }
  _showNotice(s) {
    this._notice = s, this._noticeTimer !== void 0 && window.clearTimeout(this._noticeTimer), this._noticeTimer = window.setTimeout(() => {
      this._notice = null, this._noticeTimer = void 0;
    }, 4e3);
  }
  _getAttributes() {
    if (!this.hass || !this._config?.entity) return {};
    const s = this.hass.states[this._config.entity];
    return s ? s.attributes : {};
  }
  _getFilteredArrivals() {
    const s = this.hass && this._config?.entity ? this.hass.states[this._config.entity] : void 0, t = Yt(s), e = this._config?.lines;
    if (!e || e.length === 0)
      return t;
    const i = new Set(e.map((r) => $(String(r))).filter(Boolean));
    return i.size === 0 ? t : t.filter((r) => i.has($(String(r.line))));
  }
  async _triggerRefresh(s) {
    if (s?.stopPropagation(), !this.hass || !this._config || this._refreshing) return;
    const t = V(this.hass, this._config);
    if (!t) {
      this._showNotice(u(this.hass, "no_refresh_button"));
      return;
    }
    this._refreshing = !0, this._notice = null;
    try {
      await this.hass.callService("button", "press", void 0, {
        entity_id: t
      }), this._nowMs = Date.now();
    } catch (e) {
      const i = e && typeof e == "object" && "message" in e && typeof e.message == "string" ? e.message : u(this.hass, "refresh_error");
      this._showNotice(i);
    } finally {
      this._refreshTimer !== void 0 && window.clearTimeout(this._refreshTimer), this._refreshTimer = window.setTimeout(() => {
        this._refreshing = !1, this._refreshTimer = void 0;
      }, 450);
    }
  }
  _handleCardClick() {
    if (!this._config?.tap_to_refresh) return;
    V(this.hass, this._config) && this._triggerRefresh();
  }
  _handleCardKeyDown(s) {
    this._config?.tap_to_refresh && (s.key === "Enter" || s.key === " ") && (s.preventDefault(), this._handleCardClick());
  }
  _toggleExpanded(s) {
    s.stopPropagation(), this._expanded = !this._expanded;
  }
  _renderArrivalRow(s, t) {
    const e = te(s, this._nowMs), i = $(String(s.line)), r = se(i), o = ut(s.destination || ""), n = this._config?.show_route_name && s.line_name ? ut(s.line_name) : "", l = this._config?.show_arrival_time ? pt(s.estimated_arrival, t) : "";
    let a = "eta-badge", d = `${s.is_approximate ? ">" : ""}${e} ${u(this.hass, "min_short")}`;
    return e <= 0 ? (a = "eta-badge now", d = u(this.hass, "now")) : e <= 5 && (a = "eta-badge imminent"), f`
      <li class="arrival-row">
        <span class="line-pill ${r ? "night" : ""}">${i}</span>
        <div class="dest-col">
          <div class="destination" title=${o}>${o}</div>
          ${n ? f`<div class="route-sub" title=${n}>${n}</div>` : h}
        </div>
        <div class="eta-col">
          <span class=${a}>${d}</span>
          ${l ? f`<span class="eta-clock">${l}</span>` : h}
        </div>
      </li>
    `;
  }
  render() {
    if (!this._config) return h;
    const s = xt(this.hass), t = this.hass && this._config.entity ? this.hass.states[this._config.entity] : void 0, e = this._getAttributes(), i = this._config.style ?? "marquesina", r = e.stop_id ? String(e.stop_id) : "", o = this._config.title?.trim() || e.stop_name || e.friendly_name || (r ? `${u(this.hass, "stop_prefix")} ${r}` : "TITSA"), n = V(this.hass, this._config), l = !!(this._config.tap_to_refresh && n), a = t?.state === "unavailable", d = !!e.polling_paused, p = !!e.manual_snapshot, c = this._getFilteredArrivals(), m = this._config.max_arrivals ?? 5, _ = this._expanded ? c : c.slice(0, m), v = Math.max(0, c.length - m), q = pt(e.last_estimation, s);
    let S;
    t ? a ? S = f`
        <div class="state-box">
          <ha-icon icon="mdi:cloud-off-outline"></ha-icon>
          <div class="state-title">${u(this.hass, "unavailable_title")}</div>
          <div class="state-subtitle">${u(this.hass, "unavailable_subtitle")}</div>
          ${n ? f`
                <button
                  type="button"
                  class="cta-btn"
                  ?disabled=${this._refreshing}
                  @click=${this._triggerRefresh}
                >
                  <ha-icon icon="mdi:refresh"></ha-icon>
                  <span>${u(this.hass, "check_now")}</span>
                </button>
              ` : h}
        </div>
      ` : d && !p && c.length === 0 ? S = f`
        <div class="state-box paused">
          <ha-icon icon="mdi:pause-circle-outline"></ha-icon>
          <div class="state-title">${u(this.hass, "paused_title")}</div>
          <div class="state-subtitle">${u(this.hass, "paused_subtitle")}</div>
          ${n ? f`
                <button
                  type="button"
                  class="cta-btn"
                  ?disabled=${this._refreshing}
                  @click=${this._triggerRefresh}
                >
                  <ha-icon icon="mdi:refresh"></ha-icon>
                  <span>${u(this.hass, "check_now")}</span>
                </button>
              ` : h}
        </div>
      ` : c.length === 0 ? S = f`
        <div class="state-box">
          <ha-icon icon="mdi:bus-clock"></ha-icon>
          <div class="state-title">${u(this.hass, "empty_title")}</div>
          <div class="state-subtitle">${u(this.hass, "empty_subtitle")}</div>
        </div>
      ` : S = f`
        <ul class="arrivals ${this._config.compact ? "compact" : ""}">
          ${_.map((Et) => this._renderArrivalRow(Et, s))}
        </ul>
      ` : S = f`
        <div class="state-box">
          <ha-icon icon="mdi:bus-alert"></ha-icon>
          <div class="state-title">${u(this.hass, "entity_missing_title")}</div>
          <div class="state-subtitle">${u(this.hass, "entity_missing_subtitle")}</div>
        </div>
      `;
    const wt = this._config.show_footer !== !1 && !!t && !a && (!!q || v > 0 || p), At = this.hass?.themes?.darkMode === !0 ? "dark" : this.hass?.themes?.darkMode === !1 ? "light" : "", St = [l ? "interactive" : "", At].filter(Boolean).join(" ");
    return f`
      <ha-card
        class=${St}
        tabindex=${l ? "0" : "-1"}
        @click=${this._handleCardClick}
        @keydown=${this._handleCardKeyDown}
      >
        <div class="header ${i}">
          <div class="header-left">
            <div class="bus-emblem">
              <ha-icon icon="mdi:bus"></ha-icon>
            </div>
            <div class="title-group">
              <h2 class="stop-title" title=${o}>${o}</h2>
              ${r ? f`
                    <div class="stop-meta">
                      <span class="stop-code-chip">#${r}</span>
                      <span>TITSA</span>
                    </div>
                  ` : h}
            </div>
          </div>

          ${n ? f`
                <button
                  type="button"
                  class="refresh-btn ${this._refreshing ? "spinning" : ""}"
                  aria-label=${u(this.hass, "refresh")}
                  title=${u(this.hass, "refresh")}
                  ?disabled=${this._refreshing}
                  @click=${this._triggerRefresh}
                >
                  <ha-icon icon="mdi:refresh"></ha-icon>
                </button>
              ` : h}
        </div>

        ${this._notice ? f`
              <div class="notice" role="status">
                <ha-icon icon="mdi:clock-alert-outline"></ha-icon>
                <span>${this._notice}</span>
              </div>
            ` : h}

        ${S}

        ${wt ? f`
              <div class="footer">
                <div class="footer-left">
                  ${q ? f`<span>${u(this.hass, "updated_at")} ${q}</span>` : h}
                  ${p ? f`<span class="manual-tag">${u(this.hass, "manual_badge")}</span>` : h}
                </div>
                ${v > 0 ? f`
                      <button type="button" class="expand-btn" @click=${this._toggleExpanded}>
                        ${this._expanded ? u(this.hass, "show_less") : u(this.hass, "show_more", { count: v })}
                      </button>
                    ` : h}
              </div>
            ` : h}
      </ha-card>
    `;
  }
};
g.styles = oe;
A([
  X({ attribute: !1 })
], g.prototype, "hass", 2);
A([
  P()
], g.prototype, "_config", 2);
A([
  P()
], g.prototype, "_nowMs", 2);
A([
  P()
], g.prototype, "_refreshing", 2);
A([
  P()
], g.prototype, "_expanded", 2);
A([
  P()
], g.prototype, "_notice", 2);
g = A([
  yt("ha-titsa-card")
], g);
const ce = "20261120.0";
window.customCards = window.customCards || [];
window.customCards.some((s) => s.type === "ha-titsa-card") || window.customCards.push({
  type: "ha-titsa-card",
  name: "TITSA Bus Stop Card",
  description: "Unofficial bus-shelter marquee card for TITSA (Tenerife) real-time arrivals.",
  preview: !0,
  documentationURL: "https://github.com/alejandrojara/ha-titsa-card"
});
console.info(
  `%c HA-TITSA-CARD %c v${ce} `,
  "color: #ffffff; background: #75ad1c; font-weight: 700; padding: 2px 6px; border-radius: 4px 0 0 4px;",
  "color: #1f2933; background: #e8f5d6; font-weight: 600; padding: 2px 6px; border-radius: 0 4px 4px 0;"
);
export {
  ce as CARD_VERSION,
  g as HaTitsaCard,
  R as HaTitsaCardEditor
};
