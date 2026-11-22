/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const I = globalThis, Z = I.ShadowRoot && (I.ShadyCSS === void 0 || I.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, K = Symbol(), st = /* @__PURE__ */ new WeakMap();
let bt = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== K) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (Z && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = st.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && st.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Nt = (i) => new bt(typeof i == "string" ? i : i + "", void 0, K), $t = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, r, o) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + i[o + 1], i[0]);
  return new bt(e, i, K);
}, zt = (i, t) => {
  if (Z) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), r = I.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = e.cssText, i.appendChild(s);
  }
}, rt = Z ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return Nt(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ut, defineProperty: Ot, getOwnPropertyDescriptor: Rt, getOwnPropertyNames: Ht, getOwnPropertySymbols: It, getPrototypeOf: Dt } = Object, j = globalThis, nt = j.trustedTypes, Lt = nt ? nt.emptyScript : "", jt = j.reactiveElementPolyfillSupport, N = (i, t) => i, D = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? Lt : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, t) {
  let e = i;
  switch (t) {
    case Boolean:
      e = i !== null;
      break;
    case Number:
      e = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(i);
      } catch {
        e = null;
      }
  }
  return e;
} }, G = (i, t) => !Ut(i, t), ot = { attribute: !0, type: String, converter: D, reflect: !1, useDefault: !1, hasChanged: G };
Symbol.metadata ??= Symbol("metadata"), j.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let E = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = ot) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), r = this.getPropertyDescriptor(t, s, e);
      r !== void 0 && Ot(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: r, set: o } = Rt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: r, set(n) {
      const l = r?.call(this);
      o?.call(this, n), this.requestUpdate(t, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? ot;
  }
  static _$Ei() {
    if (this.hasOwnProperty(N("elementProperties"))) return;
    const t = Dt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(N("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(N("properties"))) {
      const e = this.properties, s = [...Ht(e), ...It(e)];
      for (const r of s) this.createProperty(r, e[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, r] of e) this.elementProperties.set(s, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const r = this._$Eu(e, s);
      r !== void 0 && this._$Eh.set(r, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const r of s) e.unshift(rt(r));
    } else t !== void 0 && e.push(rt(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
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
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return zt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    const s = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, s);
    if (r !== void 0 && s.reflect === !0) {
      const o = (s.converter?.toAttribute !== void 0 ? s.converter : D).toAttribute(e, s.type);
      this._$Em = t, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, r = s._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const o = s.getPropertyOptions(r), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : D;
      this._$Em = r;
      const l = n.fromAttribute(e, o.type);
      this[r] = l ?? this._$Ej?.get(r) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, r = !1, o) {
    if (t !== void 0) {
      const n = this.constructor;
      if (r === !1 && (o = this[t]), s ??= n.getPropertyOptions(t), !((s.hasChanged ?? G)(o, e) || s.useDefault && s.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: r, wrapped: o }, n) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), o !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [r, o] of s) {
        const { wrapped: n } = o, l = this[r];
        n !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, o, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
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
E.elementStyles = [], E.shadowRootOptions = { mode: "open" }, E[N("elementProperties")] = /* @__PURE__ */ new Map(), E[N("finalized")] = /* @__PURE__ */ new Map(), jt?.({ ReactiveElement: E }), (j.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const J = globalThis, at = (i) => i, L = J.trustedTypes, lt = L ? L.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, yt = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, wt = "?" + v, Bt = `<${wt}>`, x = document, z = () => x.createComment(""), U = (i) => i === null || typeof i != "object" && typeof i != "function", Q = Array.isArray, qt = (i) => Q(i) || typeof i?.[Symbol.iterator] == "function", V = `[ 	
\f\r]`, P = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ct = /-->/g, dt = />/g, y = RegExp(`>|${V}(?:([^\\s"'>=/]+)(${V}*=${V}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ht = /'/g, ut = /"/g, xt = /^(?:script|style|textarea|title)$/i, Ft = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), f = Ft(1), T = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), pt = /* @__PURE__ */ new WeakMap(), w = x.createTreeWalker(x, 129);
function At(i, t) {
  if (!Q(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return lt !== void 0 ? lt.createHTML(t) : t;
}
const Vt = (i, t) => {
  const e = i.length - 1, s = [];
  let r, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = P;
  for (let l = 0; l < e; l++) {
    const a = i[l];
    let u, p, h = -1, _ = 0;
    for (; _ < a.length && (n.lastIndex = _, p = n.exec(a), p !== null); ) _ = n.lastIndex, n === P ? p[1] === "!--" ? n = ct : p[1] !== void 0 ? n = dt : p[2] !== void 0 ? (xt.test(p[2]) && (r = RegExp("</" + p[2], "g")), n = y) : p[3] !== void 0 && (n = y) : n === y ? p[0] === ">" ? (n = r ?? P, h = -1) : p[1] === void 0 ? h = -2 : (h = n.lastIndex - p[2].length, u = p[1], n = p[3] === void 0 ? y : p[3] === '"' ? ut : ht) : n === ut || n === ht ? n = y : n === ct || n === dt ? n = P : (n = y, r = void 0);
    const m = n === y && i[l + 1].startsWith("/>") ? " " : "";
    o += n === P ? a + Bt : h >= 0 ? (s.push(u), a.slice(0, h) + yt + a.slice(h) + v + m) : a + v + (h === -2 ? l : m);
  }
  return [At(i, o + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class O {
  constructor({ strings: t, _$litType$: e }, s) {
    let r;
    this.parts = [];
    let o = 0, n = 0;
    const l = t.length - 1, a = this.parts, [u, p] = Vt(t, e);
    if (this.el = O.createElement(u, s), w.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (r = w.nextNode()) !== null && a.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const h of r.getAttributeNames()) if (h.endsWith(yt)) {
          const _ = p[n++], m = r.getAttribute(h).split(v), $ = /([.?@])?(.*)/.exec(_);
          a.push({ type: 1, index: o, name: $[2], strings: m, ctor: $[1] === "." ? Zt : $[1] === "?" ? Kt : $[1] === "@" ? Gt : B }), r.removeAttribute(h);
        } else h.startsWith(v) && (a.push({ type: 6, index: o }), r.removeAttribute(h));
        if (xt.test(r.tagName)) {
          const h = r.textContent.split(v), _ = h.length - 1;
          if (_ > 0) {
            r.textContent = L ? L.emptyScript : "";
            for (let m = 0; m < _; m++) r.append(h[m], z()), w.nextNode(), a.push({ type: 2, index: ++o });
            r.append(h[_], z());
          }
        }
      } else if (r.nodeType === 8) if (r.data === wt) a.push({ type: 2, index: o });
      else {
        let h = -1;
        for (; (h = r.data.indexOf(v, h + 1)) !== -1; ) a.push({ type: 7, index: o }), h += v.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const s = x.createElement("template");
    return s.innerHTML = t, s;
  }
}
function k(i, t, e = i, s) {
  if (t === T) return t;
  let r = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const o = U(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== o && (r?._$AO?.(!1), o === void 0 ? r = void 0 : (r = new o(i), r._$AT(i, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = r : e._$Cl = r), r !== void 0 && (t = k(i, r._$AS(i, t.values), r, s)), t;
}
class Wt {
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
    const { el: { content: e }, parts: s } = this._$AD, r = (t?.creationScope ?? x).importNode(e, !0);
    w.currentNode = r;
    let o = w.nextNode(), n = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let u;
        a.type === 2 ? u = new H(o, o.nextSibling, this, t) : a.type === 1 ? u = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (u = new Jt(o, this, t)), this._$AV.push(u), a = s[++l];
      }
      n !== a?.index && (o = w.nextNode(), n++);
    }
    return w.currentNode = x, r;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class H {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, r) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
    t = k(this, t, e), U(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== T && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : qt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && U(this._$AH) ? this._$AA.nextSibling.data = t : this.T(x.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, r = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = O.createElement(At(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === r) this._$AH.p(e);
    else {
      const o = new Wt(r, this), n = o.u(this.options);
      o.p(e), this.T(n), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = pt.get(t.strings);
    return e === void 0 && pt.set(t.strings, e = new O(t)), e;
  }
  k(t) {
    Q(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, r = 0;
    for (const o of t) r === e.length ? e.push(s = new H(this.O(z()), this.O(z()), this, this.options)) : s = e[r], s._$AI(o), r++;
    r < e.length && (this._$AR(s && s._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = at(t).nextSibling;
      at(t).remove(), t = s;
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
  constructor(t, e, s, r, o) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = d;
  }
  _$AI(t, e = this, s, r) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) t = k(this, t, e, 0), n = !U(t) || t !== this._$AH && t !== T, n && (this._$AH = t);
    else {
      const l = t;
      let a, u;
      for (t = o[0], a = 0; a < o.length - 1; a++) u = k(this, l[s + a], e, a), u === T && (u = this._$AH[a]), n ||= !U(u) || u !== this._$AH[a], u === d ? t = d : t !== d && (t += (u ?? "") + o[a + 1]), this._$AH[a] = u;
    }
    n && !r && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Zt extends B {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class Kt extends B {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class Gt extends B {
  constructor(t, e, s, r, o) {
    super(t, e, s, r, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = k(this, t, e, 0) ?? d) === T) return;
    const s = this._$AH, r = t === d && s !== d || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, o = t !== d && (s === d || r);
    r && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Jt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    k(this, t);
  }
}
const Qt = J.litHtmlPolyfillSupport;
Qt?.(O, H), (J.litHtmlVersions ??= []).push("3.3.3");
const Xt = (i, t, e) => {
  const s = e?.renderBefore ?? t;
  let r = s._$litPart$;
  if (r === void 0) {
    const o = e?.renderBefore ?? null;
    s._$litPart$ = r = new H(t.insertBefore(z(), o), o, void 0, e ?? {});
  }
  return r._$AI(i), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const X = globalThis;
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Xt(e, this.renderRoot, this.renderOptions);
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
C._$litElement$ = !0, C.finalized = !0, X.litElementHydrateSupport?.({ LitElement: C });
const Yt = X.litElementPolyfillSupport;
Yt?.({ LitElement: C });
(X.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const St = (i) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(i, t);
  }) : customElements.define(i, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const te = { attribute: !0, type: String, converter: D, reflect: !1, hasChanged: G }, ee = (i = te, t, e) => {
  const { kind: s, metadata: r } = e;
  let o = globalThis.litPropertyMetadata.get(r);
  if (o === void 0 && globalThis.litPropertyMetadata.set(r, o = /* @__PURE__ */ new Map()), s === "setter" && ((i = Object.create(i)).wrapped = !0), o.set(e.name, i), s === "accessor") {
    const { name: n } = e;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(n, a, i, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(n, void 0, i, l), l;
    } };
  }
  if (s === "setter") {
    const { name: n } = e;
    return function(l) {
      const a = this[n];
      t.call(this, l), this.requestUpdate(n, a, i, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function Y(i) {
  return (t, e) => typeof e == "object" ? ee(i, t, e) : ((s, r, o) => {
    const n = r.hasOwnProperty(o);
    return r.constructor.createProperty(o, s), n ? Object.getOwnPropertyDescriptor(r, o) : void 0;
  })(i, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function M(i) {
  return Y({ ...i, state: !0, attribute: !1 });
}
const ft = {
  es: {
    card_name: "Tarjeta de parada TITSA",
    card_description: "Tarjeta no oficial estilo marquesina para llegadas en tiempo real de TITSA (Tenerife).",
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
    refresh_cooldown: "Espera {seconds} segundos antes de volver a actualizar esta parada.",
    refresh_cooldown_one: "Espera 1 segundo antes de volver a actualizar esta parada.",
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
    card_name: "TITSA Bus Stop Card",
    card_description: "Unofficial bus-shelter marquee card for TITSA (Tenerife) real-time arrivals.",
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
    refresh_cooldown: "Please wait {seconds} seconds before refreshing this stop again.",
    refresh_cooldown_one: "Please wait 1 second before refreshing this stop again.",
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
function ie() {
  if (!(typeof window > "u"))
    try {
      const i = window.localStorage?.getItem("selectedLanguage");
      if (!i) return;
      const t = JSON.parse(i);
      return typeof t == "string" && t.trim() ? t.trim() : void 0;
    } catch {
      return;
    }
}
function tt(i) {
  const t = [
    i?.selectedLanguage,
    i?.language,
    i?.locale?.language,
    i?.config?.language,
    ie(),
    typeof document < "u" ? document.documentElement?.lang : void 0,
    typeof navigator < "u" ? navigator.language : void 0
  ];
  for (const e of t)
    if (typeof e == "string" && e.trim())
      return e.trim().toLowerCase().startsWith("es") ? "es" : "en";
  return "es";
}
function c(i, t, e) {
  const s = tt(i);
  let r = ft[s]?.[t] ?? ft.en[t] ?? t;
  if (e)
    for (const [o, n] of Object.entries(e))
      r = r.replace(`{${o}}`, String(n));
  return r;
}
function mt(i, t) {
  const e = Number.parseInt(String(t ?? ""), 10);
  if (!Number.isNaN(e) && e <= 1)
    return c(i, "refresh_cooldown_one");
  const s = !Number.isNaN(e) && e > 0 ? e : 30;
  return c(i, "refresh_cooldown", { seconds: s });
}
function se(i, t) {
  if (t && typeof t == "object") {
    const e = t;
    if (e.translation_domain === "titsa" && e.translation_key === "refresh_cooldown")
      return mt(i, e.translation_placeholders?.seconds);
    if (e.translation_domain && e.translation_key && typeof i?.localize == "function") {
      const s = i.localize(
        `component.${e.translation_domain}.exceptions.${e.translation_key}.message`,
        e.translation_placeholders ?? {}
      );
      if (s && s.trim())
        return s;
    }
    if (typeof e.message == "string" && e.message.trim()) {
      const s = e.message.trim(), r = s.match(/(?:please\s+wait|espera)\s+(\d+)\s+second|espera\s+(\d+)\s+segundo/i);
      return r ? mt(i, r[1] ?? r[2]) : /not found/i.test(s) ? c(i, "no_refresh_button") : tt(i) === "es" && /^(?:failed to|unable to|error fetching|rate limited|service .+ not found|action .+ not found)/i.test(
        s
      ) ? c(i, "refresh_error") : s;
    }
  }
  return c(i, "refresh_error");
}
function Et(i) {
  if (typeof window > "u" || !Array.isArray(window.customCards)) return;
  const t = window.customCards.find((r) => r.type === "ha-titsa-card");
  if (!t) return;
  const e = c(i, "card_name"), s = c(i, "card_description");
  t.name !== e && (t.name = e), t.description !== s && (t.description = s);
}
const re = /* @__PURE__ */ new Set([
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
]), ne = /* @__PURE__ */ new Set(["TFS", "TFN", "ULL", "IES", "CEIP", "S/C", "SC", "TITSA", "(T)"]);
function b(i) {
  const t = i.trim().toUpperCase();
  if (!t) return "";
  const e = t.match(/^0*(\d+)([A-Z]*)$/);
  return e ? `${e[1].replace(/^0+/, "") || "0"}${e[2]}` : t;
}
function _t(i) {
  const t = i.replace(/\s+/g, " ").trim().replace(/\.(?=[A-ZÁÉÍÓÚÜÑ]{2})/g, ". ");
  if (!t) return "";
  if (t !== t.toUpperCase()) return t;
  const e = t.split(" ");
  return e.map((s, r) => {
    if (ne.has(s) || /^(?:[A-ZÁÉÍÓÚÜÑ]\.){2,}$/.test(s))
      return s;
    const n = s.toLowerCase().match(/^([("'\-/]*)([^\W\d_])(.*)$/u);
    if (!n) return s;
    const [, l, a, u] = n, p = a + u, h = r > 0 ? e[r - 1] : "";
    return !(r === 0 || /^[-–—/:|]$/.test(h) || /[-–—/:|]$/.test(h)) && !l && re.has(p) ? p : `${l}${a.toUpperCase()}${u}`;
  }).join(" ");
}
function oe(i) {
  if (!i) return [];
  const t = i.attributes;
  if (Array.isArray(t.arrivals))
    return t.arrivals;
  if (typeof t.line == "string" && t.line.trim()) {
    const e = [];
    (typeof t.minutes == "number" && !Number.isNaN(t.minutes) || i.state && i.state !== "unknown" && i.state !== "unavailable" && !Number.isNaN(Date.parse(i.state))) && e.push({
      line: t.line,
      line_name: t.line_name ?? void 0,
      destination: t.destination ?? "",
      minutes: typeof t.minutes == "number" ? t.minutes : 0,
      estimated_arrival: i.state,
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
function ae(i, t = Date.now()) {
  if (i.estimated_arrival) {
    const e = Date.parse(i.estimated_arrival);
    if (!Number.isNaN(e)) {
      const s = (e - t) / 1e3;
      return s <= 30 ? 0 : Math.round(s / 60);
    }
  }
  return Math.max(0, Math.round(i.minutes ?? 0));
}
function le(i, t = Date.now(), e = 90) {
  if (!i.estimated_arrival) return !1;
  const s = Date.parse(i.estimated_arrival);
  return Number.isNaN(s) ? !1 : (s - t) / 1e3 < -e;
}
function ce(i, t = Date.now(), e = 4 * 6e4) {
  if (!i) return !1;
  const s = Date.parse(i);
  return Number.isNaN(s) ? !1 : t - s > e;
}
function gt(i, t) {
  if (!i) return "";
  const e = new Date(i);
  if (Number.isNaN(e.getTime())) return "";
  try {
    return new Intl.DateTimeFormat(t === "es" ? "es-ES" : "en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: !1
    }).format(e);
  } catch {
    const s = String(e.getHours()).padStart(2, "0"), r = String(e.getMinutes()).padStart(2, "0");
    return `${s}:${r}`;
  }
}
function W(i, t) {
  if (t.refresh_entity)
    return t.refresh_entity;
  if (!i || !t.entity)
    return;
  const e = i.entities?.[t.entity];
  if (e?.device_id && i.entities) {
    for (const [n, l] of Object.entries(i.entities))
      if (l?.device_id === e.device_id && n.startsWith("button.") && i.states[n])
        return n;
  }
  const s = t.entity.replace(/^sensor\./, ""), r = /* @__PURE__ */ new Set();
  for (const n of ["_proxima_guagua", "_next_bus"])
    s.endsWith(n) && r.add(s.slice(0, -n.length));
  const o = s.match(/^(.+)_(?:linea|line)_[a-z0-9]+$/i);
  o && r.add(o[1]);
  for (const n of r)
    for (const l of ["_actualizar", "_refresh"]) {
      const a = `button.${n}${l}`;
      if (i.states[a])
        return a;
    }
}
function de(i) {
  if (!i?.states) return "";
  for (const [t, e] of Object.entries(i.states)) {
    if (!t.startsWith("sensor.") || !e) continue;
    const s = e.attributes;
    if (s && typeof s.stop_id == "string" && Array.isArray(s.arrivals))
      return t;
  }
  return "";
}
function he(i, t) {
  if (!i || !t) return [];
  const e = i.states[t];
  if (!e) return [];
  const s = e.attributes, r = /* @__PURE__ */ new Set();
  if (typeof s.line == "string") {
    const o = b(s.line);
    o && r.add(o);
  }
  for (const o of s.filtered_lines ?? []) {
    const n = b(String(o));
    n && r.add(n);
  }
  for (const o of s.arrivals ?? []) {
    const n = b(String(o.line));
    n && r.add(n);
  }
  return [...r].sort((o, n) => o.localeCompare(n, void 0, { numeric: !0 }));
}
function ue(i) {
  const t = Number.parseInt(i, 10);
  return !Number.isNaN(t) && t >= 970 && t <= 979;
}
var pe = Object.defineProperty, fe = Object.getOwnPropertyDescriptor, et = (i, t, e, s) => {
  for (var r = s > 1 ? void 0 : s ? fe(t, e) : t, o = i.length - 1, n; o >= 0; o--)
    (n = i[o]) && (r = (s ? n(t, e, r) : n(r)) || r);
  return s && r && pe(t, e, r), r;
};
let R = class extends C {
  constructor() {
    super(...arguments), this._computeLabel = (i) => c(this.hass, `editor_${i.name}`);
  }
  setConfig(i) {
    this._config = {
      style: "marquesina",
      max_arrivals: 5,
      compact: !1,
      show_arrival_time: !1,
      show_route_name: !1,
      show_footer: !0,
      tap_to_refresh: !0,
      ...i
    };
  }
  _buildSchema() {
    const i = new Set(
      he(this.hass, this._config?.entity)
    );
    for (const e of this._config?.lines ?? []) {
      const s = b(String(e));
      s && i.add(s);
    }
    const t = [...i].sort((e, s) => e.localeCompare(s, void 0, { numeric: !0 })).map((e) => ({ value: e, label: e }));
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
                label: c(this.hass, "editor_style_marquesina")
              },
              {
                value: "minimal",
                label: c(this.hass, "editor_style_minimal")
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
  _valueChanged(i) {
    if (!this._config) return;
    const t = i.detail.value ?? {}, e = {
      ...this._config,
      ...t,
      type: this._config.type || "custom:ha-titsa-card",
      entity: typeof t.entity == "string" ? t.entity : this._config.entity || ""
    };
    if ((!e.title || !e.title.trim()) && delete e.title, e.refresh_entity || delete e.refresh_entity, Array.isArray(e.lines)) {
      const s = [
        ...new Set(e.lines.map((r) => b(String(r))).filter(Boolean))
      ];
      s.length > 0 ? e.lines = s : delete e.lines;
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
    return !this.hass || !this._config ? d : (Et(this.hass), f`
      <div class="editor">
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${this._buildSchema()}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._valueChanged}
        ></ha-form>
      </div>
    `);
  }
};
R.styles = $t`
    .editor {
      padding: 4px 0;
    }
  `;
et([
  Y({ attribute: !1 })
], R.prototype, "hass", 2);
et([
  M()
], R.prototype, "_config", 2);
R = et([
  St("ha-titsa-card-editor")
], R);
const me = $t`
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
var _e = Object.defineProperty, ge = Object.getOwnPropertyDescriptor, A = (i, t, e, s) => {
  for (var r = s > 1 ? void 0 : s ? ge(t, e) : t, o = i.length - 1, n; o >= 0; o--)
    (n = i[o]) && (r = (s ? n(t, e, r) : n(r)) || r);
  return s && r && _e(t, e, r), r;
};
const vt = {
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
    super(...arguments), this._nowMs = Date.now(), this._refreshing = !1, this._expanded = !1, this._notice = null, this._handleVisibilityChange = () => {
      typeof document < "u" && !document.hidden && (this._nowMs = Date.now());
    };
  }
  static getConfigElement() {
    return document.createElement("ha-titsa-card-editor");
  }
  static getStubConfig(i) {
    return {
      type: "custom:ha-titsa-card",
      entity: de(i),
      style: "marquesina",
      max_arrivals: 5,
      show_footer: !0,
      tap_to_refresh: !0
    };
  }
  setConfig(i) {
    if (!i)
      throw new Error("Invalid configuration for ha-titsa-card");
    const t = typeof i.max_arrivals == "number" && i.max_arrivals >= 1 ? Math.min(12, Math.floor(i.max_arrivals)) : vt.max_arrivals;
    this._config = {
      ...vt,
      ...i,
      max_arrivals: t,
      style: i.style === "minimal" ? "minimal" : "marquesina"
    };
  }
  connectedCallback() {
    super.connectedCallback(), this._nowMs = Date.now(), this._tickTimer = window.setInterval(() => {
      this._nowMs = Date.now();
    }, 15e3), typeof document < "u" && document.addEventListener("visibilitychange", this._handleVisibilityChange);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._tickTimer !== void 0 && (window.clearInterval(this._tickTimer), this._tickTimer = void 0), this._noticeTimer !== void 0 && (window.clearTimeout(this._noticeTimer), this._noticeTimer = void 0), this._refreshTimer !== void 0 && (window.clearTimeout(this._refreshTimer), this._refreshTimer = void 0), typeof document < "u" && document.removeEventListener("visibilitychange", this._handleVisibilityChange);
  }
  getCardSize() {
    const i = this._getFilteredArrivals(), t = this._expanded ? i.length : Math.min(i.length, this._config?.max_arrivals ?? 5), e = this._config?.compact ? 2 : 3;
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
  _showNotice(i) {
    this._notice = i, this._noticeTimer !== void 0 && window.clearTimeout(this._noticeTimer), this._noticeTimer = window.setTimeout(() => {
      this._notice = null, this._noticeTimer = void 0;
    }, 4e3);
  }
  _getAttributes() {
    if (!this.hass || !this._config?.entity) return {};
    const i = this.hass.states[this._config.entity];
    return i ? i.attributes : {};
  }
  _getFilteredArrivals() {
    const i = this.hass && this._config?.entity ? this.hass.states[this._config.entity] : void 0, t = oe(i).filter(
      (r) => !le(r, this._nowMs)
    ), e = this._config?.lines;
    if (!e || e.length === 0)
      return t;
    const s = new Set(e.map((r) => b(String(r))).filter(Boolean));
    return s.size === 0 ? t : t.filter((r) => s.has(b(String(r.line))));
  }
  async _triggerRefresh(i) {
    if (i?.stopPropagation(), !this.hass || !this._config || this._refreshing) return;
    const t = W(this.hass, this._config);
    if (!t) {
      this._showNotice(c(this.hass, "no_refresh_button"));
      return;
    }
    this._refreshing = !0, this._notice = null;
    try {
      await this.hass.callService("button", "press", void 0, {
        entity_id: t
      }), this._nowMs = Date.now();
    } catch (e) {
      this._showNotice(se(this.hass, e));
    } finally {
      this._refreshTimer !== void 0 && window.clearTimeout(this._refreshTimer), this._refreshTimer = window.setTimeout(() => {
        this._refreshing = !1, this._refreshTimer = void 0;
      }, 450);
    }
  }
  _handleCardClick() {
    if (!this._config?.tap_to_refresh) return;
    W(this.hass, this._config) && this._triggerRefresh();
  }
  _handleCardKeyDown(i) {
    this._config?.tap_to_refresh && (i.key === "Enter" || i.key === " ") && (i.preventDefault(), this._handleCardClick());
  }
  _toggleExpanded(i) {
    i.stopPropagation(), this._expanded = !this._expanded;
  }
  _renderArrivalRow(i, t) {
    const e = ae(i, this._nowMs), s = b(String(i.line)), r = ue(s), o = _t(i.destination || ""), n = this._config?.show_route_name && i.line_name ? _t(i.line_name) : "", l = this._config?.show_arrival_time ? gt(i.estimated_arrival, t) : "";
    let a = "eta-badge", u = `${i.is_approximate ? ">" : ""}${e} ${c(this.hass, "min_short")}`;
    return e <= 0 ? (a = "eta-badge now", u = c(this.hass, "now")) : e <= 5 && (a = "eta-badge imminent"), f`
      <li class="arrival-row">
        <span class="line-pill ${r ? "night" : ""}">${s}</span>
        <div class="dest-col">
          <div class="destination" title=${o}>${o}</div>
          ${n ? f`<div class="route-sub" title=${n}>${n}</div>` : d}
        </div>
        <div class="eta-col">
          <span class=${a}>${u}</span>
          ${l ? f`<span class="eta-clock">${l}</span>` : d}
        </div>
      </li>
    `;
  }
  render() {
    if (!this._config) return d;
    Et(this.hass);
    const i = tt(this.hass), t = this.hass && this._config.entity ? this.hass.states[this._config.entity] : void 0, e = this._getAttributes(), s = this._config.style ?? "marquesina", r = e.stop_id ? String(e.stop_id) : "", o = this._config.title?.trim() || e.stop_name || e.friendly_name || (r ? `${c(this.hass, "stop_prefix")} ${r}` : "TITSA"), n = W(this.hass, this._config), l = !!(this._config.tap_to_refresh && n), a = t?.state === "unavailable", u = !!e.polling_paused, p = !!e.manual_snapshot, h = u && ce(e.last_estimation, this._nowMs), _ = p && !h, m = this._getFilteredArrivals(), $ = u && (h || !p && m.length === 0), it = this._config.max_arrivals ?? 5, Ct = this._expanded ? m : m.slice(0, it), q = !a && !$ ? Math.max(0, m.length - it) : 0, F = gt(e.last_estimation, i);
    let S;
    t ? a ? S = f`
        <div class="state-box">
          <ha-icon icon="mdi:cloud-off-outline"></ha-icon>
          <div class="state-title">${c(this.hass, "unavailable_title")}</div>
          <div class="state-subtitle">${c(this.hass, "unavailable_subtitle")}</div>
          ${n ? f`
                <button
                  type="button"
                  class="cta-btn"
                  ?disabled=${this._refreshing}
                  @click=${this._triggerRefresh}
                >
                  <ha-icon icon="mdi:refresh"></ha-icon>
                  <span>${c(this.hass, "check_now")}</span>
                </button>
              ` : d}
        </div>
      ` : $ ? S = f`
        <div class="state-box paused">
          <ha-icon icon="mdi:pause-circle-outline"></ha-icon>
          <div class="state-title">${c(this.hass, "paused_title")}</div>
          <div class="state-subtitle">${c(this.hass, "paused_subtitle")}</div>
          ${n ? f`
                <button
                  type="button"
                  class="cta-btn"
                  ?disabled=${this._refreshing}
                  @click=${this._triggerRefresh}
                >
                  <ha-icon icon="mdi:refresh"></ha-icon>
                  <span>${c(this.hass, "check_now")}</span>
                </button>
              ` : d}
        </div>
      ` : m.length === 0 ? S = f`
        <div class="state-box">
          <ha-icon icon="mdi:bus-clock"></ha-icon>
          <div class="state-title">${c(this.hass, "empty_title")}</div>
          <div class="state-subtitle">${c(this.hass, "empty_subtitle")}</div>
        </div>
      ` : S = f`
        <ul class="arrivals ${this._config.compact ? "compact" : ""}">
          ${Ct.map((Pt) => this._renderArrivalRow(Pt, i))}
        </ul>
      ` : S = f`
        <div class="state-box">
          <ha-icon icon="mdi:bus-alert"></ha-icon>
          <div class="state-title">${c(this.hass, "entity_missing_title")}</div>
          <div class="state-subtitle">${c(this.hass, "entity_missing_subtitle")}</div>
        </div>
      `;
    const Tt = this._config.show_footer !== !1 && !!t && !a && (!!F || q > 0 || _), kt = this.hass?.themes?.darkMode === !0 ? "dark" : this.hass?.themes?.darkMode === !1 ? "light" : "", Mt = [l ? "interactive" : "", kt].filter(Boolean).join(" ");
    return f`
      <ha-card
        class=${Mt}
        tabindex=${l ? "0" : "-1"}
        @click=${this._handleCardClick}
        @keydown=${this._handleCardKeyDown}
      >
        <div class="header ${s}">
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
                  ` : d}
            </div>
          </div>

          ${n ? f`
                <button
                  type="button"
                  class="refresh-btn ${this._refreshing ? "spinning" : ""}"
                  aria-label=${c(this.hass, "refresh")}
                  title=${c(this.hass, "refresh")}
                  ?disabled=${this._refreshing}
                  @click=${this._triggerRefresh}
                >
                  <ha-icon icon="mdi:refresh"></ha-icon>
                </button>
              ` : d}
        </div>

        ${this._notice ? f`
              <div class="notice" role="status">
                <ha-icon icon="mdi:clock-alert-outline"></ha-icon>
                <span>${this._notice}</span>
              </div>
            ` : d}

        ${S}

        ${Tt ? f`
              <div class="footer">
                <div class="footer-left">
                  ${F ? f`<span>${c(this.hass, "updated_at")} ${F}</span>` : d}
                  ${_ ? f`<span class="manual-tag">${c(this.hass, "manual_badge")}</span>` : d}
                </div>
                ${q > 0 ? f`
                      <button type="button" class="expand-btn" @click=${this._toggleExpanded}>
                        ${this._expanded ? c(this.hass, "show_less") : c(this.hass, "show_more", { count: q })}
                      </button>
                    ` : d}
              </div>
            ` : d}
      </ha-card>
    `;
  }
};
g.styles = me;
A([
  Y({ attribute: !1 })
], g.prototype, "hass", 2);
A([
  M()
], g.prototype, "_config", 2);
A([
  M()
], g.prototype, "_nowMs", 2);
A([
  M()
], g.prototype, "_refreshing", 2);
A([
  M()
], g.prototype, "_expanded", 2);
A([
  M()
], g.prototype, "_notice", 2);
g = A([
  St("ha-titsa-card")
], g);
const ve = "20261122.0";
window.customCards = window.customCards || [];
window.customCards.some((i) => i.type === "ha-titsa-card") || window.customCards.push({
  type: "ha-titsa-card",
  name: c(void 0, "card_name"),
  description: c(void 0, "card_description"),
  preview: !0,
  documentationURL: "https://github.com/alejandrojara/ha-titsa-card"
});
console.info(
  `%c HA-TITSA-CARD %c v${ve} `,
  "color: #ffffff; background: #75ad1c; font-weight: 700; padding: 2px 6px; border-radius: 4px 0 0 4px;",
  "color: #1f2933; background: #e8f5d6; font-weight: 600; padding: 2px 6px; border-radius: 0 4px 4px 0;"
);
export {
  ve as CARD_VERSION,
  g as HaTitsaCard,
  R as HaTitsaCardEditor
};
