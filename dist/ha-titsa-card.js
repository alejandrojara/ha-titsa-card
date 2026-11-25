/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const L = globalThis, J = L.ShadowRoot && (L.ShadyCSS === void 0 || L.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, X = Symbol(), le = /* @__PURE__ */ new WeakMap();
let Ae = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== X) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (J && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = le.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && le.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ie = (i) => new Ae(typeof i == "string" ? i : i + "", void 0, X), Se = (i, ...e) => {
  const t = i.length === 1 ? i[0] : e.reduce((s, r, o) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + i[o + 1], i[0]);
  return new Ae(t, i, X);
}, He = (i, e) => {
  if (J) i.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), r = L.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = t.cssText, i.appendChild(s);
  }
}, ce = J ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return Ie(t);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: De, defineProperty: Le, getOwnPropertyDescriptor: je, getOwnPropertyNames: Be, getOwnPropertySymbols: qe, getPrototypeOf: Ve } = Object, q = globalThis, de = q.trustedTypes, Fe = de ? de.emptyScript : "", Ze = q.reactiveElementPolyfillSupport, z = (i, e) => i, j = { toAttribute(i, e) {
  switch (e) {
    case Boolean:
      i = i ? Fe : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, e) {
  let t = i;
  switch (e) {
    case Boolean:
      t = i !== null;
      break;
    case Number:
      t = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(i);
      } catch {
        t = null;
      }
  }
  return t;
} }, Q = (i, e) => !De(i, e), he = { attribute: !0, type: String, converter: j, reflect: !1, useDefault: !1, hasChanged: Q };
Symbol.metadata ??= Symbol("metadata"), q.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let C = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = he) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const s = Symbol(), r = this.getPropertyDescriptor(e, s, t);
      r !== void 0 && Le(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: r, set: o } = je(this.prototype, e) ?? { get() {
      return this[t];
    }, set(n) {
      this[t] = n;
    } };
    return { get: r, set(n) {
      const c = r?.call(this);
      o?.call(this, n), this.requestUpdate(e, c, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? he;
  }
  static _$Ei() {
    if (this.hasOwnProperty(z("elementProperties"))) return;
    const e = Ve(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(z("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(z("properties"))) {
      const t = this.properties, s = [...Be(t), ...qe(t)];
      for (const r of s) this.createProperty(r, t[r]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [s, r] of t) this.elementProperties.set(s, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, s] of this.elementProperties) {
      const r = this._$Eu(t, s);
      r !== void 0 && this._$Eh.set(r, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const s = new Set(e.flat(1 / 0).reverse());
      for (const r of s) t.unshift(ce(r));
    } else e !== void 0 && t.push(ce(e));
    return t;
  }
  static _$Eu(e, t) {
    const s = t.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
  }
  addController(e) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const s of t.keys()) this.hasOwnProperty(s) && (e.set(s, this[s]), delete this[s]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return He(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, t, s) {
    this._$AK(e, s);
  }
  _$ET(e, t) {
    const s = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, s);
    if (r !== void 0 && s.reflect === !0) {
      const o = (s.converter?.toAttribute !== void 0 ? s.converter : j).toAttribute(t, s.type);
      this._$Em = e, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const s = this.constructor, r = s._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const o = s.getPropertyOptions(r), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : j;
      this._$Em = r;
      const c = n.fromAttribute(t, o.type);
      this[r] = c ?? this._$Ej?.get(r) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, t, s, r = !1, o) {
    if (e !== void 0) {
      const n = this.constructor;
      if (r === !1 && (o = this[e]), s ??= n.getPropertyOptions(e), !((s.hasChanged ?? Q)(o, t) || s.useDefault && s.reflect && o === this._$Ej?.get(e) && !this.hasAttribute(n._$Eu(e, s)))) return;
      this.C(e, t, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: s, reflect: r, wrapped: o }, n) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, n ?? t ?? this[e]), o !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (t = void 0), this._$AL.set(e, t)), r === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
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
        const { wrapped: n } = o, c = this[r];
        n !== !0 || this._$AL.has(r) || c === void 0 || this.C(r, void 0, o, c);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(t)) : this._$EM();
    } catch (s) {
      throw e = !1, this._$EM(), s;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((t) => t.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
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
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq &&= this._$Eq.forEach((t) => this._$ET(t, this[t])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
C.elementStyles = [], C.shadowRootOptions = { mode: "open" }, C[z("elementProperties")] = /* @__PURE__ */ new Map(), C[z("finalized")] = /* @__PURE__ */ new Map(), Ze?.({ ReactiveElement: C }), (q.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Y = globalThis, ue = (i) => i, B = Y.trustedTypes, pe = B ? B.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, Ee = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, Ce = "?" + y, We = `<${Ce}>`, A = document, R = () => A.createComment(""), U = (i) => i === null || typeof i != "object" && typeof i != "function", ee = Array.isArray, Ke = (i) => ee(i) || typeof i?.[Symbol.iterator] == "function", K = `[ 	
\f\r]`, N = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, fe = /-->/g, me = />/g, w = RegExp(`>|${K}(?:([^\\s"'>=/]+)(${K}*=${K}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), _e = /'/g, ge = /"/g, Te = /^(?:script|style|textarea|title)$/i, Ge = (i) => (e, ...t) => ({ _$litType$: i, strings: e, values: t }), f = Ge(1), k = Symbol.for("lit-noChange"), l = Symbol.for("lit-nothing"), ve = /* @__PURE__ */ new WeakMap(), x = A.createTreeWalker(A, 129);
function ke(i, e) {
  if (!ee(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return pe !== void 0 ? pe.createHTML(e) : e;
}
const Je = (i, e) => {
  const t = i.length - 1, s = [];
  let r, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = N;
  for (let c = 0; c < t; c++) {
    const a = i[c];
    let u, p, h = -1, m = 0;
    for (; m < a.length && (n.lastIndex = m, p = n.exec(a), p !== null); ) m = n.lastIndex, n === N ? p[1] === "!--" ? n = fe : p[1] !== void 0 ? n = me : p[2] !== void 0 ? (Te.test(p[2]) && (r = RegExp("</" + p[2], "g")), n = w) : p[3] !== void 0 && (n = w) : n === w ? p[0] === ">" ? (n = r ?? N, h = -1) : p[1] === void 0 ? h = -2 : (h = n.lastIndex - p[2].length, u = p[1], n = p[3] === void 0 ? w : p[3] === '"' ? ge : _e) : n === ge || n === _e ? n = w : n === fe || n === me ? n = N : (n = w, r = void 0);
    const _ = n === w && i[c + 1].startsWith("/>") ? " " : "";
    o += n === N ? a + We : h >= 0 ? (s.push(u), a.slice(0, h) + Ee + a.slice(h) + y + _) : a + y + (h === -2 ? c : _);
  }
  return [ke(i, o + (i[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class O {
  constructor({ strings: e, _$litType$: t }, s) {
    let r;
    this.parts = [];
    let o = 0, n = 0;
    const c = e.length - 1, a = this.parts, [u, p] = Je(e, t);
    if (this.el = O.createElement(u, s), x.currentNode = this.el.content, t === 2 || t === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (r = x.nextNode()) !== null && a.length < c; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const h of r.getAttributeNames()) if (h.endsWith(Ee)) {
          const m = p[n++], _ = r.getAttribute(h).split(y), g = /([.?@])?(.*)/.exec(m);
          a.push({ type: 1, index: o, name: g[2], strings: _, ctor: g[1] === "." ? Qe : g[1] === "?" ? Ye : g[1] === "@" ? et : V }), r.removeAttribute(h);
        } else h.startsWith(y) && (a.push({ type: 6, index: o }), r.removeAttribute(h));
        if (Te.test(r.tagName)) {
          const h = r.textContent.split(y), m = h.length - 1;
          if (m > 0) {
            r.textContent = B ? B.emptyScript : "";
            for (let _ = 0; _ < m; _++) r.append(h[_], R()), x.nextNode(), a.push({ type: 2, index: ++o });
            r.append(h[m], R());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Ce) a.push({ type: 2, index: o });
      else {
        let h = -1;
        for (; (h = r.data.indexOf(y, h + 1)) !== -1; ) a.push({ type: 7, index: o }), h += y.length - 1;
      }
      o++;
    }
  }
  static createElement(e, t) {
    const s = A.createElement("template");
    return s.innerHTML = e, s;
  }
}
function P(i, e, t = i, s) {
  if (e === k) return e;
  let r = s !== void 0 ? t._$Co?.[s] : t._$Cl;
  const o = U(e) ? void 0 : e._$litDirective$;
  return r?.constructor !== o && (r?._$AO?.(!1), o === void 0 ? r = void 0 : (r = new o(i), r._$AT(i, t, s)), s !== void 0 ? (t._$Co ??= [])[s] = r : t._$Cl = r), r !== void 0 && (e = P(i, r._$AS(i, e.values), r, s)), e;
}
class Xe {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: s } = this._$AD, r = (e?.creationScope ?? A).importNode(t, !0);
    x.currentNode = r;
    let o = x.nextNode(), n = 0, c = 0, a = s[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let u;
        a.type === 2 ? u = new H(o, o.nextSibling, this, e) : a.type === 1 ? u = new a.ctor(o, a.name, a.strings, this, e) : a.type === 6 && (u = new tt(o, this, e)), this._$AV.push(u), a = s[++c];
      }
      n !== a?.index && (o = x.nextNode(), n++);
    }
    return x.currentNode = A, r;
  }
  p(e) {
    let t = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
  }
}
class H {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, s, r) {
    this.type = 2, this._$AH = l, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = s, this.options = r, this._$Cv = r?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = P(this, e, t), U(e) ? e === l || e == null || e === "" ? (this._$AH !== l && this._$AR(), this._$AH = l) : e !== this._$AH && e !== k && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ke(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== l && U(this._$AH) ? this._$AA.nextSibling.data = e : this.T(A.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: s } = e, r = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = O.createElement(ke(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === r) this._$AH.p(t);
    else {
      const o = new Xe(r, this), n = o.u(this.options);
      o.p(t), this.T(n), this._$AH = o;
    }
  }
  _$AC(e) {
    let t = ve.get(e.strings);
    return t === void 0 && ve.set(e.strings, t = new O(e)), t;
  }
  k(e) {
    ee(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, r = 0;
    for (const o of e) r === t.length ? t.push(s = new H(this.O(R()), this.O(R()), this, this.options)) : s = t[r], s._$AI(o), r++;
    r < t.length && (this._$AR(s && s._$AB.nextSibling, r), t.length = r);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const s = ue(e).nextSibling;
      ue(e).remove(), e = s;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class V {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, s, r, o) {
    this.type = 1, this._$AH = l, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = l;
  }
  _$AI(e, t = this, s, r) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) e = P(this, e, t, 0), n = !U(e) || e !== this._$AH && e !== k, n && (this._$AH = e);
    else {
      const c = e;
      let a, u;
      for (e = o[0], a = 0; a < o.length - 1; a++) u = P(this, c[s + a], t, a), u === k && (u = this._$AH[a]), n ||= !U(u) || u !== this._$AH[a], u === l ? e = l : e !== l && (e += (u ?? "") + o[a + 1]), this._$AH[a] = u;
    }
    n && !r && this.j(e);
  }
  j(e) {
    e === l ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Qe extends V {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === l ? void 0 : e;
  }
}
class Ye extends V {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== l);
  }
}
class et extends V {
  constructor(e, t, s, r, o) {
    super(e, t, s, r, o), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = P(this, e, t, 0) ?? l) === k) return;
    const s = this._$AH, r = e === l && s !== l || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, o = e !== l && (s === l || r);
    r && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class tt {
  constructor(e, t, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    P(this, e);
  }
}
const it = Y.litHtmlPolyfillSupport;
it?.(O, H), (Y.litHtmlVersions ??= []).push("3.3.3");
const st = (i, e, t) => {
  const s = t?.renderBefore ?? e;
  let r = s._$litPart$;
  if (r === void 0) {
    const o = t?.renderBefore ?? null;
    s._$litPart$ = r = new H(e.insertBefore(R(), o), o, void 0, t ?? {});
  }
  return r._$AI(i), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const te = globalThis;
class T extends C {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = st(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return k;
  }
}
T._$litElement$ = !0, T.finalized = !0, te.litElementHydrateSupport?.({ LitElement: T });
const rt = te.litElementPolyfillSupport;
rt?.({ LitElement: T });
(te.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Pe = (i) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(i, e);
  }) : customElements.define(i, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const nt = { attribute: !0, type: String, converter: j, reflect: !1, hasChanged: Q }, ot = (i = nt, e, t) => {
  const { kind: s, metadata: r } = t;
  let o = globalThis.litPropertyMetadata.get(r);
  if (o === void 0 && globalThis.litPropertyMetadata.set(r, o = /* @__PURE__ */ new Map()), s === "setter" && ((i = Object.create(i)).wrapped = !0), o.set(t.name, i), s === "accessor") {
    const { name: n } = t;
    return { set(c) {
      const a = e.get.call(this);
      e.set.call(this, c), this.requestUpdate(n, a, i, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(n, void 0, i, c), c;
    } };
  }
  if (s === "setter") {
    const { name: n } = t;
    return function(c) {
      const a = this[n];
      e.call(this, c), this.requestUpdate(n, a, i, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function ie(i) {
  return (e, t) => typeof t == "object" ? ot(i, e, t) : ((s, r, o) => {
    const n = r.hasOwnProperty(o);
    return r.constructor.createProperty(o, s), n ? Object.getOwnPropertyDescriptor(r, o) : void 0;
  })(i, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function M(i) {
  return ie({ ...i, state: !0, attribute: !1 });
}
const be = {
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
    open_line_tooltip: "Ver ficha de la línea {line} en titsa.com",
    open_line_aria: "Línea {line}, {destination}, {eta}. Abrir ficha en titsa.com",
    open_line_aria_no_dest: "Línea {line}, {eta}. Abrir ficha en titsa.com",
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
    editor_open_line_url: "Abrir ficha de línea en titsa.com al pulsar",
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
    open_line_tooltip: "View line {line} info on titsa.com",
    open_line_aria: "Line {line}, {destination}, {eta}. Open line info on titsa.com",
    open_line_aria_no_dest: "Line {line}, {eta}. Open line info on titsa.com",
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
    editor_open_line_url: "Open line info on titsa.com on tap",
    editor_refresh_entity: "Refresh button override (auto-detected)",
    editor_lines: "Filter lines on this card (optional)"
  }
};
function at() {
  if (!(typeof window > "u"))
    try {
      const i = window.localStorage?.getItem("selectedLanguage");
      if (!i) return;
      const e = JSON.parse(i);
      return typeof e == "string" && e.trim() ? e.trim() : void 0;
    } catch {
      return;
    }
}
function se(i) {
  const e = [
    i?.selectedLanguage,
    i?.language,
    i?.locale?.language,
    i?.config?.language,
    at(),
    typeof document < "u" ? document.documentElement?.lang : void 0,
    typeof navigator < "u" ? navigator.language : void 0
  ];
  for (const t of e)
    if (typeof t == "string" && t.trim())
      return t.trim().toLowerCase().startsWith("es") ? "es" : "en";
  return "es";
}
function d(i, e, t) {
  const s = se(i);
  let r = be[s]?.[e] ?? be.en[e] ?? e;
  if (t)
    for (const [o, n] of Object.entries(t))
      r = r.replace(`{${o}}`, String(n));
  return r;
}
function $e(i, e) {
  const t = Number.parseInt(String(e ?? ""), 10);
  if (!Number.isNaN(t) && t <= 1)
    return d(i, "refresh_cooldown_one");
  const s = !Number.isNaN(t) && t > 0 ? t : 30;
  return d(i, "refresh_cooldown", { seconds: s });
}
function lt(i, e) {
  if (e && typeof e == "object") {
    const t = e;
    if (t.translation_domain === "titsa" && t.translation_key === "refresh_cooldown")
      return $e(i, t.translation_placeholders?.seconds);
    if (t.translation_domain && t.translation_key && typeof i?.localize == "function") {
      const s = i.localize(
        `component.${t.translation_domain}.exceptions.${t.translation_key}.message`,
        t.translation_placeholders ?? {}
      );
      if (s && s.trim())
        return s;
    }
    if (typeof t.message == "string" && t.message.trim()) {
      const s = t.message.trim(), r = s.match(/(?:please\s+wait|espera)\s+(\d+)\s+second|espera\s+(\d+)\s+segundo/i);
      return r ? $e(i, r[1] ?? r[2]) : /not found/i.test(s) ? d(i, "no_refresh_button") : se(i) === "es" && /^(?:failed to|unable to|error fetching|rate limited|service .+ not found|action .+ not found)/i.test(
        s
      ) ? d(i, "refresh_error") : s;
    }
  }
  return d(i, "refresh_error");
}
function Me(i) {
  if (typeof window > "u" || !Array.isArray(window.customCards)) return;
  const e = window.customCards.find((r) => r.type === "ha-titsa-card");
  if (!e) return;
  const t = d(i, "card_name"), s = d(i, "card_description");
  e.name !== t && (e.name = t), e.description !== s && (e.description = s);
}
const ct = /* @__PURE__ */ new Set([
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
]), dt = /* @__PURE__ */ new Set(["TFS", "TFN", "ULL", "IES", "CEIP", "S/C", "SC", "TITSA", "(T)"]);
function b(i) {
  const e = i.trim().toUpperCase();
  if (!e) return "";
  const t = e.match(/^0*(\d+)([A-Z]*)$/);
  return t ? `${t[1].replace(/^0+/, "") || "0"}${t[2]}` : e;
}
const G = "https://titsa.com/index.php/tus-guaguas/lineas-y-horarios";
function ht(i) {
  if (i == null) return G;
  const e = b(String(i));
  if (!/^[1-9]\d{0,3}$/.test(e))
    return G;
  const t = e.padStart(3, "0");
  return `${G}/linea-${t}`;
}
function ye(i) {
  const e = i.replace(/\s+/g, " ").trim().replace(/\.(?=[A-ZÁÉÍÓÚÜÑ]{2})/g, ". ");
  if (!e) return "";
  if (e !== e.toUpperCase()) return e;
  const t = e.split(" ");
  return t.map((s, r) => {
    if (dt.has(s) || /^(?:[A-ZÁÉÍÓÚÜÑ]\.){2,}$/.test(s))
      return s;
    const n = s.toLowerCase().match(/^([("'\-/]*)([^\W\d_])(.*)$/u);
    if (!n) return s;
    const [, c, a, u] = n, p = a + u, h = r > 0 ? t[r - 1] : "";
    return !(r === 0 || /^[-–—/:|]$/.test(h) || /[-–—/:|]$/.test(h)) && !c && ct.has(p) ? p : `${c}${a.toUpperCase()}${u}`;
  }).join(" ");
}
function ut(i) {
  if (!i) return [];
  const e = i.attributes;
  if (Array.isArray(e.arrivals))
    return e.arrivals;
  if (typeof e.line == "string" && e.line.trim()) {
    const t = [];
    (typeof e.minutes == "number" && !Number.isNaN(e.minutes) || i.state && i.state !== "unknown" && i.state !== "unavailable" && !Number.isNaN(Date.parse(i.state))) && t.push({
      line: e.line,
      line_name: e.line_name ?? void 0,
      destination: e.destination ?? "",
      minutes: typeof e.minutes == "number" ? e.minutes : 0,
      estimated_arrival: i.state,
      is_approximate: !1
    });
    for (const r of e.following_arrivals ?? [])
      t.push({
        line: e.line,
        line_name: e.line_name ?? void 0,
        destination: r.destination,
        minutes: r.minutes,
        estimated_arrival: r.estimated_arrival,
        is_approximate: r.is_approximate
      });
    return t;
  }
  return [];
}
function pt(i, e = Date.now()) {
  if (i.estimated_arrival) {
    const t = Date.parse(i.estimated_arrival);
    if (!Number.isNaN(t)) {
      const s = (t - e) / 1e3;
      return s <= 30 ? 0 : Math.round(s / 60);
    }
  }
  return Math.max(0, Math.round(i.minutes ?? 0));
}
function ft(i, e = Date.now(), t = 90) {
  if (!i.estimated_arrival) return !1;
  const s = Date.parse(i.estimated_arrival);
  return Number.isNaN(s) ? !1 : (s - e) / 1e3 < -t;
}
function mt(i, e = Date.now(), t = 4 * 6e4) {
  if (!i) return !1;
  const s = Date.parse(i);
  return Number.isNaN(s) ? !1 : e - s > t;
}
function we(i, e) {
  if (!i) return "";
  const t = new Date(i);
  if (Number.isNaN(t.getTime())) return "";
  try {
    return new Intl.DateTimeFormat(e === "es" ? "es-ES" : "en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: !1
    }).format(t);
  } catch {
    const s = String(t.getHours()).padStart(2, "0"), r = String(t.getMinutes()).padStart(2, "0");
    return `${s}:${r}`;
  }
}
function D(i, e) {
  if (e.refresh_entity)
    return e.refresh_entity;
  if (!i || !e.entity)
    return;
  const t = i.entities?.[e.entity];
  if (t?.device_id && i.entities) {
    for (const [n, c] of Object.entries(i.entities))
      if (c?.device_id === t.device_id && n.startsWith("button.") && i.states[n])
        return n;
  }
  const s = e.entity.replace(/^sensor\./, ""), r = /* @__PURE__ */ new Set();
  for (const n of ["_proxima_guagua", "_next_bus"])
    s.endsWith(n) && r.add(s.slice(0, -n.length));
  const o = s.match(/^(.+)_(?:linea|line)_[a-z0-9]+$/i);
  o && r.add(o[1]);
  for (const n of r)
    for (const c of ["_actualizar", "_refresh"]) {
      const a = `button.${n}${c}`;
      if (i.states[a])
        return a;
    }
}
function _t(i) {
  if (!i?.states) return "";
  for (const [e, t] of Object.entries(i.states)) {
    if (!e.startsWith("sensor.") || !t) continue;
    const s = t.attributes;
    if (s && typeof s.stop_id == "string" && Array.isArray(s.arrivals))
      return e;
  }
  return "";
}
function gt(i, e) {
  if (!i || !e) return [];
  const t = i.states[e];
  if (!t) return [];
  const s = t.attributes, r = /* @__PURE__ */ new Set();
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
function vt(i) {
  const e = Number.parseInt(i, 10);
  return !Number.isNaN(e) && e >= 970 && e <= 979;
}
var bt = Object.defineProperty, $t = Object.getOwnPropertyDescriptor, re = (i, e, t, s) => {
  for (var r = s > 1 ? void 0 : s ? $t(e, t) : e, o = i.length - 1, n; o >= 0; o--)
    (n = i[o]) && (r = (s ? n(e, t, r) : n(r)) || r);
  return s && r && bt(e, t, r), r;
};
let I = class extends T {
  constructor() {
    super(...arguments), this._computeLabel = (i) => d(this.hass, `editor_${i.name}`);
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
      ...i,
      open_line_url: i.open_line_url !== !1
    };
  }
  _buildSchema() {
    const i = new Set(
      gt(this.hass, this._config?.entity)
    );
    for (const t of this._config?.lines ?? []) {
      const s = b(String(t));
      s && i.add(s);
    }
    const e = [...i].sort((t, s) => t.localeCompare(s, void 0, { numeric: !0 })).map((t) => ({ value: t, label: t }));
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
                label: d(this.hass, "editor_style_marquesina")
              },
              {
                value: "minimal",
                label: d(this.hass, "editor_style_minimal")
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
            options: e
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
        name: "open_line_url",
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
    const e = i.detail.value ?? {}, t = {
      ...this._config,
      ...e,
      type: this._config.type || "custom:ha-titsa-card",
      entity: typeof e.entity == "string" ? e.entity : this._config.entity || ""
    };
    if ((!t.title || !t.title.trim()) && delete t.title, t.refresh_entity || delete t.refresh_entity, Array.isArray(t.lines)) {
      const s = [
        ...new Set(t.lines.map((r) => b(String(r))).filter(Boolean))
      ];
      s.length > 0 ? t.lines = s : delete t.lines;
    } else
      delete t.lines;
    this._config = t, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
  render() {
    return !this.hass || !this._config ? l : (Me(this.hass), f`
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
I.styles = Se`
    .editor {
      padding: 4px 0;
    }
  `;
re([
  ie({ attribute: !1 })
], I.prototype, "hass", 2);
re([
  M()
], I.prototype, "_config", 2);
I = re([
  Pe("ha-titsa-card-editor")
], I);
const yt = Se`
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

  ha-card.card-interactive {
    cursor: pointer;
  }

  /* ── Header: Marquesina (TITSA shelter green banner) ── */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 13px 16px;
    transition:
      filter 140ms ease,
      background-color 140ms ease;
  }

  .header.refresh-zone {
    cursor: pointer;
  }

  .header.marquesina {
    background: linear-gradient(135deg, #7cb421 0%, var(--titsa-green-dark) 100%);
    color: #ffffff;
  }

  .header.marquesina.refresh-zone:hover {
    filter: brightness(1.03);
  }

  .header.minimal {
    background: transparent;
    color: var(--primary-text-color);
    border-bottom: 1px solid var(--divider-color, rgba(127, 127, 127, 0.18));
    padding: 12px 16px 10px;
  }

  .header.minimal.refresh-zone:hover {
    background: var(--secondary-background-color, rgba(127, 127, 127, 0.06));
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

  .refresh-btn:focus-visible {
    outline: 2px solid var(--titsa-green);
    outline-offset: 2px;
  }

  .header.marquesina .refresh-btn:focus-visible {
    outline-color: #ffffff;
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
    display: block;
  }

  .arrival-row + .arrival-row {
    border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.14));
  }

  .arrival-link,
  .arrival-row.static {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 16px;
    transition: background-color 120ms ease;
  }

  .arrival-link,
  .arrival-link:visited {
    width: 100%;
    box-sizing: border-box;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    padding-right: 10px;
  }

  .arrivals.compact .arrival-link,
  .arrivals.compact .arrival-row.static {
    padding: 6px 14px;
    gap: 10px;
  }

  .arrivals.compact .arrival-link {
    padding-right: 8px;
  }

  .arrival-link:hover {
    background: var(--secondary-background-color, rgba(127, 127, 127, 0.08));
  }

  .arrival-link:active {
    background: var(--secondary-background-color, rgba(127, 127, 127, 0.14));
  }

  .arrival-link:focus-visible {
    outline: 2px solid var(--titsa-green);
    outline-offset: -2px;
    background: var(--secondary-background-color, rgba(127, 127, 127, 0.08));
  }

  .row-chevron {
    --mdc-icon-size: 18px;
    width: 18px;
    height: 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--secondary-text-color);
    opacity: 0.45;
    flex-shrink: 0;
    margin-left: -4px;
    transition:
      opacity 120ms ease,
      transform 120ms ease,
      color 120ms ease;
  }

  .arrivals.compact .row-chevron {
    --mdc-icon-size: 16px;
    width: 16px;
    height: 16px;
  }

  .arrival-link:hover .row-chevron,
  .arrival-link:focus-visible .row-chevron {
    opacity: 0.9;
    color: var(--titsa-urgent-fg);
    transform: translateX(2px);
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

  .state-box[role="button"]:focus-visible {
    outline: 2px solid var(--titsa-green);
    outline-offset: -2px;
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

  .cta-btn:focus-visible {
    outline: 2px solid var(--titsa-green-dark);
    outline-offset: 2px;
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
    transition: background-color 120ms ease;
  }

  .footer.refresh-zone {
    cursor: pointer;
  }

  .footer.refresh-zone:hover {
    background: var(--secondary-background-color, rgba(127, 127, 127, 0.06));
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

  .expand-btn:focus-visible {
    outline: 2px solid var(--titsa-green);
    outline-offset: 2px;
  }
`;
var wt = Object.defineProperty, xt = Object.getOwnPropertyDescriptor, S = (i, e, t, s) => {
  for (var r = s > 1 ? void 0 : s ? xt(e, t) : e, o = i.length - 1, n; o >= 0; o--)
    (n = i[o]) && (r = (s ? n(e, t, r) : n(r)) || r);
  return s && r && wt(e, t, r), r;
};
const xe = {
  style: "marquesina",
  max_arrivals: 5,
  compact: !1,
  show_arrival_time: !1,
  show_route_name: !1,
  show_footer: !0,
  tap_to_refresh: !0,
  open_line_url: !0
};
let $ = class extends T {
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
      entity: _t(i),
      style: "marquesina",
      max_arrivals: 5,
      show_footer: !0,
      tap_to_refresh: !0,
      open_line_url: !0
    };
  }
  setConfig(i) {
    if (!i)
      throw new Error("Invalid configuration for ha-titsa-card");
    const e = typeof i.max_arrivals == "number" && i.max_arrivals >= 1 ? Math.min(12, Math.floor(i.max_arrivals)) : xe.max_arrivals;
    this._config = {
      ...xe,
      ...i,
      max_arrivals: e,
      style: i.style === "minimal" ? "minimal" : "marquesina",
      open_line_url: i.open_line_url !== !1
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
    const i = this._getFilteredArrivals(), e = this._expanded ? i.length : Math.min(i.length, this._config?.max_arrivals ?? 5), t = this._config?.compact ? 2 : 3;
    return Math.max(t, Math.min(8, Math.ceil(1.6 + e * 0.7)));
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
    const i = this.hass && this._config?.entity ? this.hass.states[this._config.entity] : void 0, e = ut(i).filter(
      (r) => !ft(r, this._nowMs)
    ), t = this._config?.lines;
    if (!t || t.length === 0)
      return e;
    const s = new Set(t.map((r) => b(String(r))).filter(Boolean));
    return s.size === 0 ? e : e.filter((r) => s.has(b(String(r.line))));
  }
  async _triggerRefresh(i) {
    if (i?.stopPropagation(), !this.hass || !this._config || this._refreshing) return;
    const e = D(this.hass, this._config);
    if (!e) {
      this._showNotice(d(this.hass, "no_refresh_button"));
      return;
    }
    this._refreshing = !0, this._notice = null;
    try {
      await this.hass.callService("button", "press", void 0, {
        entity_id: e
      }), this._nowMs = Date.now();
    } catch (t) {
      this._showNotice(lt(this.hass, t));
    } finally {
      this._refreshTimer !== void 0 && window.clearTimeout(this._refreshTimer), this._refreshTimer = window.setTimeout(() => {
        this._refreshing = !1, this._refreshTimer = void 0;
      }, 450);
    }
  }
  _isInteractiveChildTarget(i) {
    const e = i.currentTarget, t = 'a, button, input, select, textarea, [role="button"]', s = typeof i.composedPath == "function" ? i.composedPath() : [];
    if (s.length > 0) {
      for (const n of s) {
        if (n === e) return !1;
        if (n instanceof Element && n.matches(t))
          return !0;
      }
      return !1;
    }
    const r = i.target;
    if (!(r instanceof Element) || r === e) return !1;
    const o = r.closest(t);
    return !!(o && o !== e);
  }
  _handleRefreshZoneClick(i) {
    if (!this._config?.tap_to_refresh || this._isInteractiveChildTarget(i)) return;
    i.stopPropagation(), D(this.hass, this._config) && this._triggerRefresh(i);
  }
  _handleRefreshZoneKeyDown(i) {
    this._config?.tap_to_refresh && (this._isInteractiveChildTarget(i) || (i.key === "Enter" || i.key === " ") && (i.preventDefault(), i.stopPropagation(), D(this.hass, this._config) && this._triggerRefresh()));
  }
  _toggleExpanded(i) {
    i.stopPropagation(), this._expanded = !this._expanded;
  }
  _renderArrivalRow(i, e, t) {
    const s = pt(i, this._nowMs), r = b(String(i.line)), o = vt(r), n = ye(i.destination || ""), c = this._config?.show_route_name && i.line_name ? ye(i.line_name) : "", a = this._config?.show_arrival_time ? we(i.estimated_arrival, e) : "";
    let u = "eta-badge", p = `${i.is_approximate ? ">" : ""}${s} ${d(this.hass, "min_short")}`;
    s <= 0 ? (u = "eta-badge now", p = d(this.hass, "now")) : s <= 5 && (u = "eta-badge imminent");
    const h = f`
      <span class="line-pill ${o ? "night" : ""}">${r}</span>
      <div class="dest-col">
        <div class="destination" title=${n || l}>${n}</div>
        ${c ? f`<div class="route-sub" title=${c || l}>${c}</div>` : l}
      </div>
      <div class="eta-col">
        <span class=${u}>${p}</span>
        ${a ? f`<span class="eta-clock">${a}</span>` : l}
      </div>
    `;
    if (!t)
      return f`<li class="arrival-row static">${h}</li>`;
    const m = ht(i.line), _ = n ? d(this.hass, "open_line_aria", {
      line: r,
      destination: n,
      eta: p
    }) : d(this.hass, "open_line_aria_no_dest", {
      line: r,
      eta: p
    }), g = d(this.hass, "open_line_tooltip", { line: r });
    return f`
      <li class="arrival-row">
        <a
          class="arrival-link"
          href=${m}
          target="_blank"
          rel="noopener noreferrer"
          aria-label=${_}
          title=${g}
        >
          ${h}
          <ha-icon class="row-chevron" icon="mdi:chevron-right" aria-hidden="true"></ha-icon>
        </a>
      </li>
    `;
  }
  render() {
    if (!this._config) return l;
    Me(this.hass);
    const i = se(this.hass), e = this.hass && this._config.entity ? this.hass.states[this._config.entity] : void 0, t = this._getAttributes(), s = this._config.style ?? "marquesina", r = t.stop_id ? String(t.stop_id) : "", o = this._config.title?.trim() || t.stop_name || t.friendly_name || (r ? `${d(this.hass, "stop_prefix")} ${r}` : "TITSA"), n = D(this.hass, this._config), c = !!(this._config.tap_to_refresh && n), a = this._config.open_line_url !== !1, u = e?.state === "unavailable", p = !!t.polling_paused, h = !!t.manual_snapshot, m = p && mt(t.last_estimation, this._nowMs), _ = h && !m, g = this._getFilteredArrivals(), F = p && (m || !h && g.length === 0), ne = !!e && !u && !F && g.length > 0, v = c && !ne, oe = c && ne, ae = this._config.max_arrivals ?? 5, Ne = this._expanded ? g : g.slice(0, ae), Z = !u && !F ? Math.max(0, g.length - ae) : 0, W = we(t.last_estimation, i);
    let E;
    e ? u ? E = f`
        <div class="state-box">
          <ha-icon icon="mdi:cloud-off-outline"></ha-icon>
          <div class="state-title">${d(this.hass, "unavailable_title")}</div>
          <div class="state-subtitle">${d(this.hass, "unavailable_subtitle")}</div>
          ${n ? f`
                <button
                  type="button"
                  class="cta-btn"
                  ?disabled=${this._refreshing}
                  @click=${this._triggerRefresh}
                >
                  <ha-icon icon="mdi:refresh"></ha-icon>
                  <span>${d(this.hass, "check_now")}</span>
                </button>
              ` : l}
        </div>
      ` : F ? E = f`
        <div class="state-box paused">
          <ha-icon icon="mdi:pause-circle-outline"></ha-icon>
          <div class="state-title">${d(this.hass, "paused_title")}</div>
          <div class="state-subtitle">${d(this.hass, "paused_subtitle")}</div>
          ${n ? f`
                <button
                  type="button"
                  class="cta-btn"
                  ?disabled=${this._refreshing}
                  @click=${this._triggerRefresh}
                >
                  <ha-icon icon="mdi:refresh"></ha-icon>
                  <span>${d(this.hass, "check_now")}</span>
                </button>
              ` : l}
        </div>
      ` : g.length === 0 ? E = f`
        <div
          class="state-box"
          role=${v ? "button" : l}
          tabindex=${v ? "0" : l}
          aria-label=${v ? d(this.hass, "refresh") : l}
          @click=${v ? this._handleRefreshZoneClick : l}
          @keydown=${v ? this._handleRefreshZoneKeyDown : l}
        >
          <ha-icon icon="mdi:bus-clock"></ha-icon>
          <div class="state-title">${d(this.hass, "empty_title")}</div>
          <div class="state-subtitle">${d(this.hass, "empty_subtitle")}</div>
        </div>
      ` : E = f`
        <ul class="arrivals ${this._config.compact ? "compact" : ""}">
          ${Ne.map((Oe) => this._renderArrivalRow(Oe, i, a))}
        </ul>
      ` : E = f`
        <div
          class="state-box"
          role=${v ? "button" : l}
          tabindex=${v ? "0" : l}
          aria-label=${v ? d(this.hass, "refresh") : l}
          @click=${v ? this._handleRefreshZoneClick : l}
          @keydown=${v ? this._handleRefreshZoneKeyDown : l}
        >
          <ha-icon icon="mdi:bus-alert"></ha-icon>
          <div class="state-title">${d(this.hass, "entity_missing_title")}</div>
          <div class="state-subtitle">${d(this.hass, "entity_missing_subtitle")}</div>
        </div>
      `;
    const ze = this._config.show_footer !== !1 && !!e && !u && (!!W || Z > 0 || _), Re = this.hass?.themes?.darkMode === !0 ? "dark" : this.hass?.themes?.darkMode === !1 ? "light" : "", Ue = [v ? "card-interactive" : "", Re].filter(Boolean).join(" ");
    return f`
      <ha-card
        class=${Ue}
        @click=${v ? this._handleRefreshZoneClick : l}
      >
        <div
          class="header ${s} ${c ? "refresh-zone" : ""}"
          @click=${oe ? this._handleRefreshZoneClick : l}
        >
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
                  ` : l}
            </div>
          </div>

          ${n ? f`
                <button
                  type="button"
                  class="refresh-btn ${this._refreshing ? "spinning" : ""}"
                  aria-label=${d(this.hass, "refresh")}
                  title=${d(this.hass, "refresh")}
                  ?disabled=${this._refreshing}
                  @click=${this._triggerRefresh}
                >
                  <ha-icon icon="mdi:refresh"></ha-icon>
                </button>
              ` : l}
        </div>

        ${this._notice ? f`
              <div class="notice" role="status">
                <ha-icon icon="mdi:clock-alert-outline"></ha-icon>
                <span>${this._notice}</span>
              </div>
            ` : l}

        ${E}

        ${ze ? f`
              <div
                class="footer ${c ? "refresh-zone" : ""}"
                @click=${oe ? this._handleRefreshZoneClick : l}
              >
                <div class="footer-left">
                  ${W ? f`<span>${d(this.hass, "updated_at")} ${W}</span>` : l}
                  ${_ ? f`<span class="manual-tag">${d(this.hass, "manual_badge")}</span>` : l}
                </div>
                ${Z > 0 ? f`
                      <button type="button" class="expand-btn" @click=${this._toggleExpanded}>
                        ${this._expanded ? d(this.hass, "show_less") : d(this.hass, "show_more", { count: Z })}
                      </button>
                    ` : l}
              </div>
            ` : l}
      </ha-card>
    `;
  }
};
$.styles = yt;
S([
  ie({ attribute: !1 })
], $.prototype, "hass", 2);
S([
  M()
], $.prototype, "_config", 2);
S([
  M()
], $.prototype, "_nowMs", 2);
S([
  M()
], $.prototype, "_refreshing", 2);
S([
  M()
], $.prototype, "_expanded", 2);
S([
  M()
], $.prototype, "_notice", 2);
$ = S([
  Pe("ha-titsa-card")
], $);
const At = "20261125.0";
window.customCards = window.customCards || [];
window.customCards.some((i) => i.type === "ha-titsa-card") || window.customCards.push({
  type: "ha-titsa-card",
  name: d(void 0, "card_name"),
  description: d(void 0, "card_description"),
  preview: !0,
  documentationURL: "https://github.com/alejandrojara/ha-titsa-card"
});
console.info(
  `%c HA-TITSA-CARD %c v${At} `,
  "color: #ffffff; background: #75ad1c; font-weight: 700; padding: 2px 6px; border-radius: 4px 0 0 4px;",
  "color: #1f2933; background: #e8f5d6; font-weight: 600; padding: 2px 6px; border-radius: 0 4px 4px 0;"
);
export {
  At as CARD_VERSION,
  $ as HaTitsaCard,
  I as HaTitsaCardEditor
};
