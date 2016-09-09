(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.PaymentForm = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
!function(global, factory) {
    'object' == typeof exports && 'undefined' != typeof module ? factory(exports) : 'function' == typeof define && define.amd ? define([ 'exports' ], factory) : factory(global.preact = global.preact || {});
}(this, function(exports) {
    function VNode(nodeName, attributes, children) {
        this.nodeName = nodeName;
        this.attributes = attributes;
        this.children = children;
        this.key = attributes && attributes.key;
    }
    function extend(obj, props) {
        if (props) for (var i in props) if (void 0 !== props[i]) obj[i] = props[i];
        return obj;
    }
    function clone(obj) {
        return extend({}, obj);
    }
    function delve(obj, key) {
        for (var p = key.split('.'), i = 0; i < p.length && obj; i++) obj = obj[p[i]];
        return obj;
    }
    function toArray(obj, offset) {
        return [].slice.call(obj, offset);
    }
    function isFunction(obj) {
        return 'function' == typeof obj;
    }
    function isString(obj) {
        return 'string' == typeof obj;
    }
    function empty(x) {
        return void 0 === x || null === x;
    }
    function falsey(value) {
        return value === !1 || empty(value);
    }
    function hashToClassName(c) {
        var str = '';
        for (var prop in c) if (c[prop]) {
            if (str) str += ' ';
            str += prop;
        }
        return str;
    }
    function h(nodeName, attributes, firstChild) {
        var children, arr, lastSimple, len = arguments.length;
        if (len > 2) {
            var type = typeof firstChild;
            if (3 === len && 'object' !== type && 'function' !== type) {
                if (!falsey(firstChild)) children = [ String(firstChild) ];
            } else {
                children = [];
                for (var i = 2; i < len; i++) {
                    var _p = arguments[i];
                    if (!falsey(_p)) {
                        if (_p.join) arr = _p; else (arr = SHARED_TEMP_ARRAY)[0] = _p;
                        for (var j = 0; j < arr.length; j++) {
                            var child = arr[j], simple = !(falsey(child) || isFunction(child) || child instanceof VNode);
                            if (simple && !isString(child)) child = String(child);
                            if (simple && lastSimple) children[children.length - 1] += child; else if (!falsey(child)) {
                                children.push(child);
                                lastSimple = simple;
                            }
                        }
                    } else ;
                }
            }
        } else if (attributes && attributes.children) return h(nodeName, attributes, attributes.children);
        if (attributes) {
            if (attributes.children) delete attributes.children;
            if (!isFunction(nodeName)) {
                if ('className' in attributes) {
                    attributes.class = attributes.className;
                    delete attributes.className;
                }
                lastSimple = attributes.class;
                if (lastSimple && !isString(lastSimple)) attributes.class = hashToClassName(lastSimple);
            }
        }
        var p = new VNode(nodeName, attributes || void 0, children);
        if (options.vnode) options.vnode(p);
        return p;
    }
    function cloneElement(vnode, props) {
        return h(vnode.nodeName, extend(clone(vnode.attributes), props), arguments.length > 2 ? toArray(arguments, 2) : vnode.children);
    }
    function createLinkedState(component, key, eventPath) {
        var path = key.split('.'), p0 = path[0];
        return function(e) {
            var _component$setState;
            var v, i, t = e && e.currentTarget || this, s = component.state, obj = s;
            if (isString(eventPath)) v = delve(e, eventPath); else v = t.nodeName ? (t.nodeName + t.type).match(/^input(check|rad)/i) ? t.checked : t.value : e;
            if (path.length > 1) {
                for (i = 0; i < path.length - 1; i++) obj = obj[path[i]] || (obj[path[i]] = {});
                obj[path[i]] = v;
                v = s[p0];
            }
            component.setState((_component$setState = {}, _component$setState[p0] = v, _component$setState));
        };
    }
    function enqueueRender(component) {
        if (1 === items.push(component)) (options.debounceRendering || defer)(rerender);
    }
    function rerender() {
        if (items.length) {
            var p, currentItems = items;
            items = itemsOffline;
            itemsOffline = currentItems;
            while (p = currentItems.pop()) if (p._dirty) renderComponent(p);
        }
    }
    function isFunctionalComponent(vnode) {
        var nodeName = vnode && vnode.nodeName;
        return nodeName && isFunction(nodeName) && !(nodeName.prototype && nodeName.prototype.render);
    }
    function buildFunctionalComponent(vnode, context) {
        return vnode.nodeName(getNodeProps(vnode), context || EMPTY);
    }
    function ensureNodeData(node, data) {
        return node[ATTR_KEY] || (node[ATTR_KEY] = data || {});
    }
    function getNodeType(node) {
        if (node instanceof Text) return 3;
        if (node instanceof Element) return 1; else return 0;
    }
    function removeNode(node) {
        var p = node.parentNode;
        if (p) p.removeChild(node);
    }
    function setAccessor(node, name, value, old, isSvg) {
        ensureNodeData(node)[name] = value;
        if ('key' !== name && 'children' !== name && 'innerHTML' !== name) if ('class' === name && !isSvg) node.className = value || ''; else if ('style' === name) {
            if (!value || isString(value) || isString(old)) node.style.cssText = value || '';
            if (value && 'object' == typeof value) {
                if (!isString(old)) for (var i in old) if (!(i in value)) node.style[i] = '';
                for (var i in value) node.style[i] = 'number' == typeof value[i] && !NON_DIMENSION_PROPS[i] ? value[i] + 'px' : value[i];
            }
        } else if ('dangerouslySetInnerHTML' === name) {
            if (value) node.innerHTML = value.__html;
        } else if ('o' == name[0] && 'n' == name[1]) {
            var l = node._listeners || (node._listeners = {});
            name = toLowerCase(name.substring(2));
            if (value) {
                if (!l[name]) node.addEventListener(name, eventProxy, !!NON_BUBBLING_EVENTS[name]);
            } else if (l[name]) node.removeEventListener(name, eventProxy, !!NON_BUBBLING_EVENTS[name]);
            l[name] = value;
        } else if ('type' !== name && !isSvg && name in node) {
            setProperty(node, name, empty(value) ? '' : value);
            if (falsey(value)) node.removeAttribute(name);
        } else {
            var ns = isSvg && name.match(/^xlink\:?(.+)/);
            if (falsey(value)) if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', toLowerCase(ns[1])); else node.removeAttribute(name); else if ('object' != typeof value && !isFunction(value)) if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', toLowerCase(ns[1]), value); else node.setAttribute(name, value);
        }
    }
    function setProperty(node, name, value) {
        try {
            node[name] = value;
        } catch (e) {}
    }
    function eventProxy(e) {
        return this._listeners[e.type](options.event && options.event(e) || e);
    }
    function getRawNodeAttributes(node) {
        var attrs = {};
        for (var i = node.attributes.length; i--; ) attrs[node.attributes[i].name] = node.attributes[i].value;
        return attrs;
    }
    function isSameNodeType(node, vnode) {
        if (isString(vnode)) return 3 === getNodeType(node);
        if (isString(vnode.nodeName)) return isNamedNode(node, vnode.nodeName);
        if (isFunction(vnode.nodeName)) return node._componentConstructor === vnode.nodeName || isFunctionalComponent(vnode); else ;
    }
    function isNamedNode(node, nodeName) {
        return node.normalizedNodeName === nodeName || toLowerCase(node.nodeName) === toLowerCase(nodeName);
    }
    function getNodeProps(vnode) {
        var defaultProps = vnode.nodeName.defaultProps, props = clone(defaultProps || vnode.attributes);
        if (defaultProps) extend(props, vnode.attributes);
        if (vnode.children) props.children = vnode.children;
        return props;
    }
    function collectNode(node) {
        removeNode(node);
        if (1 === getNodeType(node)) {
            cleanNode(node);
            var name = toLowerCase(node.nodeName), list = nodes[name];
            if (list) list.push(node); else nodes[name] = [ node ];
        }
    }
    function createNode(nodeName, isSvg) {
        var name = toLowerCase(nodeName), node = nodes[name] && nodes[name].pop() || (isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName));
        ensureNodeData(node);
        node.normalizedNodeName = name;
        return node;
    }
    function cleanNode(node) {
        ensureNodeData(node, getRawNodeAttributes(node));
        node._component = node._componentConstructor = null;
    }
    function flushMounts() {
        var c;
        while (c = mounts.pop()) if (c.componentDidMount) c.componentDidMount();
    }
    function diff(dom, vnode, context, mountAll, parent, rootComponent) {
        diffLevel++;
        var ret = idiff(dom, vnode, context, mountAll, rootComponent);
        if (parent && ret.parentNode !== parent) parent.appendChild(ret);
        if (!--diffLevel) flushMounts();
        return ret;
    }
    function idiff(dom, vnode, context, mountAll, rootComponent) {
        var originalAttributes = vnode && vnode.attributes;
        while (isFunctionalComponent(vnode)) vnode = buildFunctionalComponent(vnode, context);
        if (empty(vnode)) {
            vnode = '';
            if (rootComponent) {
                if (dom) {
                    if (8 === dom.nodeType) return dom;
                    recollectNodeTree(dom);
                }
                return document.createComment(vnode);
            }
        }
        if (isString(vnode)) {
            if (dom) {
                if (3 === getNodeType(dom) && dom.parentNode) {
                    dom.nodeValue = vnode;
                    return dom;
                }
                recollectNodeTree(dom);
            }
            return document.createTextNode(vnode);
        }
        var out = dom, nodeName = vnode.nodeName, prevSvgMode = isSvgMode;
        if (isFunction(nodeName)) return buildComponentFromVNode(dom, vnode, context, mountAll);
        if (!isString(nodeName)) nodeName = String(nodeName);
        isSvgMode = 'svg' === nodeName ? !0 : 'foreignObject' === nodeName ? !1 : isSvgMode;
        if (!dom) out = createNode(nodeName, isSvgMode); else if (!isNamedNode(dom, nodeName)) {
            out = createNode(nodeName, isSvgMode);
            while (dom.firstChild) out.appendChild(dom.firstChild);
            recollectNodeTree(dom);
        }
        if (vnode.children && 1 === vnode.children.length && 'string' == typeof vnode.children[0] && 1 === out.childNodes.length && out.firstChild instanceof Text) out.firstChild.nodeValue = vnode.children[0]; else if (vnode.children || out.firstChild) innerDiffNode(out, vnode.children, context, mountAll);
        diffAttributes(out, vnode.attributes);
        if (originalAttributes && originalAttributes.ref) (out[ATTR_KEY].ref = originalAttributes.ref)(out);
        isSvgMode = prevSvgMode;
        return out;
    }
    function innerDiffNode(dom, vchildren, context, mountAll) {
        var j, c, vchild, child, originalChildren = dom.childNodes, children = [], keyed = {}, keyedLen = 0, min = 0, len = originalChildren.length, childrenLen = 0, vlen = vchildren && vchildren.length;
        if (len) for (var i = 0; i < len; i++) {
            var _child = originalChildren[i], key = vlen ? (c = _child._component) ? c.__key : (c = _child[ATTR_KEY]) ? c.key : null : null;
            if (key || 0 === key) {
                keyedLen++;
                keyed[key] = _child;
            } else children[childrenLen++] = _child;
        }
        if (vlen) for (var i = 0; i < vlen; i++) {
            vchild = vchildren[i];
            child = null;
            var key = vchild.key;
            if (!empty(key)) {
                if (keyedLen && key in keyed) {
                    child = keyed[key];
                    keyed[key] = void 0;
                    keyedLen--;
                }
            } else if (!child && min < childrenLen) {
                for (j = min; j < childrenLen; j++) {
                    c = children[j];
                    if (c && isSameNodeType(c, vchild)) {
                        child = c;
                        children[j] = void 0;
                        if (j === childrenLen - 1) childrenLen--;
                        if (j === min) min++;
                        break;
                    }
                }
                if (!child && min < childrenLen && isFunction(vchild.nodeName) && mountAll) {
                    child = children[min];
                    children[min++] = void 0;
                }
            }
            child = idiff(child, vchild, context, mountAll);
            if (child !== originalChildren[i]) dom.insertBefore(child, originalChildren[i] || null);
        }
        if (keyedLen) for (var i in keyed) if (keyed[i]) children[min = childrenLen++] = keyed[i];
        if (min < childrenLen) removeOrphanedChildren(children);
    }
    function removeOrphanedChildren(children, unmountOnly) {
        for (var i = children.length; i--; ) {
            var child = children[i];
            if (child) recollectNodeTree(child, unmountOnly);
        }
    }
    function recollectNodeTree(node, unmountOnly) {
        var component = node._component;
        if (component) unmountComponent(component, !unmountOnly); else {
            if (node[ATTR_KEY] && node[ATTR_KEY].ref) node[ATTR_KEY].ref(null);
            if (!unmountOnly) collectNode(node);
            if (node.childNodes && node.childNodes.length) removeOrphanedChildren(node.childNodes, unmountOnly);
        }
    }
    function diffAttributes(dom, attrs) {
        var old = dom[ATTR_KEY] || getRawNodeAttributes(dom);
        for (var _name in old) if (!(attrs && _name in attrs)) setAccessor(dom, _name, null, old[_name], isSvgMode);
        if (attrs) for (var _name2 in attrs) if (!(_name2 in old) || attrs[_name2] != old[_name2] || ('value' === _name2 || 'checked' === _name2) && attrs[_name2] != dom[_name2]) setAccessor(dom, _name2, attrs[_name2], old[_name2], isSvgMode);
    }
    function collectComponent(component) {
        var name = component.constructor.name, list = components[name];
        if (list) list.push(component); else components[name] = [ component ];
    }
    function createComponent(Ctor, props, context) {
        var inst = new Ctor(props, context), list = components[Ctor.name];
        inst.props = props;
        inst.context = context;
        if (list) for (var i = list.length; i--; ) if (list[i].constructor === Ctor) {
            inst.nextBase = list[i].nextBase;
            list.splice(i, 1);
            break;
        }
        return inst;
    }
    function triggerComponentRender(component) {
        if (!component._dirty) {
            component._dirty = !0;
            enqueueRender(component);
        }
    }
    function setComponentProps(component, props, opts, context, mountAll) {
        var b = component.base;
        if (!component._disableRendering) {
            component._disableRendering = !0;
            if (component.__ref = props.ref) delete props.ref;
            if (component.__key = props.key) delete props.key;
            if (empty(b) || mountAll) {
                if (component.componentWillMount) component.componentWillMount();
            } else if (component.componentWillReceiveProps) component.componentWillReceiveProps(props, context);
            if (context && context !== component.context) {
                if (!component.prevContext) component.prevContext = component.context;
                component.context = context;
            }
            if (!component.prevProps) component.prevProps = component.props;
            component.props = props;
            component._disableRendering = !1;
            if (0 !== opts) if (1 === opts || options.syncComponentUpdates !== !1 || !b) renderComponent(component, 1, mountAll); else triggerComponentRender(component);
            if (component.__ref) component.__ref(component);
        }
    }
    function renderComponent(component, opts, mountAll) {
        if (!component._disableRendering) {
            var skip, rendered, props = component.props, state = component.state, context = component.context, previousProps = component.prevProps || props, previousState = component.prevState || state, previousContext = component.prevContext || context, isUpdate = component.base, initialBase = isUpdate || component.nextBase, initialChildComponent = component._component;
            if (isUpdate) {
                component.props = previousProps;
                component.state = previousState;
                component.context = previousContext;
                if (2 !== opts && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state, context) === !1) skip = !0; else if (component.componentWillUpdate) component.componentWillUpdate(props, state, context);
                component.props = props;
                component.state = state;
                component.context = context;
            }
            component.prevProps = component.prevState = component.prevContext = component.nextBase = null;
            component._dirty = !1;
            if (!skip) {
                if (component.render) rendered = component.render(props, state, context);
                if (component.getChildContext) context = extend(clone(context), component.getChildContext());
                while (isFunctionalComponent(rendered)) rendered = buildFunctionalComponent(rendered, context);
                var toUnmount, base, childComponent = rendered && rendered.nodeName;
                if (isFunction(childComponent) && childComponent.prototype.render) {
                    var inst = initialChildComponent, childProps = getNodeProps(rendered);
                    if (inst && inst.constructor === childComponent) setComponentProps(inst, childProps, 1, context); else {
                        toUnmount = inst;
                        inst = createComponent(childComponent, childProps, context);
                        inst.nextBase = inst.nextBase || mountAll && initialBase;
                        inst._parentComponent = component;
                        component._component = inst;
                        setComponentProps(inst, childProps, 0, context);
                        renderComponent(inst, 1);
                    }
                    base = inst.base;
                } else {
                    var cbase = initialBase;
                    toUnmount = initialChildComponent;
                    if (toUnmount) cbase = component._component = null;
                    if (initialBase || 1 === opts) {
                        if (cbase) cbase._component = null;
                        base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, !0);
                    }
                }
                if (initialBase && base !== initialBase) {
                    var baseParent = initialBase.parentNode;
                    if (baseParent && base !== baseParent) baseParent.replaceChild(base, initialBase);
                    if (!toUnmount && component._parentComponent) {
                        initialBase._component = null;
                        recollectNodeTree(initialBase);
                    }
                }
                if (toUnmount) unmountComponent(toUnmount, !0);
                component.base = base;
                if (base) {
                    var componentRef = component, t = component;
                    while (t = t._parentComponent) componentRef = t;
                    base._component = componentRef;
                    base._componentConstructor = componentRef.constructor;
                }
            }
            if (!isUpdate || mountAll) {
                mounts.unshift(component);
                if (!diffLevel) flushMounts();
            } else if (!skip && component.componentDidUpdate) component.componentDidUpdate(previousProps, previousState, previousContext);
            var fn, cb = component._renderCallbacks;
            if (cb) while (fn = cb.pop()) fn.call(component);
            return rendered;
        }
    }
    function buildComponentFromVNode(dom, vnode, context, mountAll) {
        var c = dom && dom._component, oldDom = dom, isDirectOwner = c && dom._componentConstructor === vnode.nodeName, isOwner = isDirectOwner, props = getNodeProps(vnode);
        while (c && !isOwner && (c = c._parentComponent)) isOwner = c.constructor === vnode.nodeName;
        if (isOwner && (!mountAll || c._component)) {
            setComponentProps(c, props, 3, context, mountAll);
            dom = c.base;
        } else {
            if (c && !isDirectOwner) {
                unmountComponent(c, !0);
                dom = oldDom = null;
            }
            c = createComponent(vnode.nodeName, props, context);
            if (dom && !c.nextBase) c.nextBase = dom;
            setComponentProps(c, props, 1, context, mountAll);
            dom = c.base;
            if (oldDom && dom !== oldDom) {
                oldDom._component = null;
                recollectNodeTree(oldDom);
            }
        }
        return dom;
    }
    function unmountComponent(component, remove) {
        var base = component.base;
        component._disableRendering = !0;
        if (component.componentWillUnmount) component.componentWillUnmount();
        component.base = null;
        var inner = component._component;
        if (inner) unmountComponent(inner, remove); else if (base) {
            if (base[ATTR_KEY] && base[ATTR_KEY].ref) base[ATTR_KEY].ref(null);
            component.nextBase = base;
            if (remove) {
                removeNode(base);
                collectComponent(component);
            }
            removeOrphanedChildren(base.childNodes, !remove);
        }
        if (component.__ref) component.__ref(null);
        if (component.componentDidUnmount) component.componentDidUnmount();
    }
    function Component(props, context) {
        this._dirty = !0;
        this._disableRendering = !1;
        this.prevState = this.prevProps = this.prevContext = this.base = this.nextBase = this._parentComponent = this._component = this.__ref = this.__key = this._linkedStates = this._renderCallbacks = null;
        this.context = context;
        this.props = props;
        this.state = this.getInitialState && this.getInitialState() || {};
    }
    function render(vnode, parent, merge) {
        return diff(merge, vnode, {}, !1, parent);
    }
    var options = {};
    var lcCache = {};
    var toLowerCase = function(s) {
        return lcCache[s] || (lcCache[s] = s.toLowerCase());
    };
    var resolved = 'undefined' != typeof Promise && Promise.resolve();
    var defer = resolved ? function(f) {
        resolved.then(f);
    } : setTimeout;
    var SHARED_TEMP_ARRAY = [];
    var EMPTY = {};
    var ATTR_KEY = 'undefined' != typeof Symbol ? Symbol.for('preactattr') : '__preactattr_';
    var NON_DIMENSION_PROPS = {
        boxFlex: 1,
        boxFlexGroup: 1,
        columnCount: 1,
        fillOpacity: 1,
        flex: 1,
        flexGrow: 1,
        flexPositive: 1,
        flexShrink: 1,
        flexNegative: 1,
        fontWeight: 1,
        lineClamp: 1,
        lineHeight: 1,
        opacity: 1,
        order: 1,
        orphans: 1,
        strokeOpacity: 1,
        widows: 1,
        zIndex: 1,
        zoom: 1
    };
    var NON_BUBBLING_EVENTS = {
        blur: 1,
        error: 1,
        focus: 1,
        load: 1,
        resize: 1,
        scroll: 1
    };
    var items = [];
    var itemsOffline = [];
    var nodes = {};
    var mounts = [];
    var diffLevel = 0;
    var isSvgMode = !1;
    var components = {};
    extend(Component.prototype, {
        linkState: function(key, eventPath) {
            var c = this._linkedStates || (this._linkedStates = {}), cacheKey = key + '|' + eventPath;
            return c[cacheKey] || (c[cacheKey] = createLinkedState(this, key, eventPath));
        },
        setState: function(state, callback) {
            var s = this.state;
            if (!this.prevState) this.prevState = clone(s);
            extend(s, isFunction(state) ? state(s, this.props) : state);
            if (callback) (this._renderCallbacks = this._renderCallbacks || []).push(callback);
            triggerComponentRender(this);
        },
        forceUpdate: function() {
            renderComponent(this, 2);
        },
        render: function() {
            return null;
        }
    });
    exports.h = h;
    exports.cloneElement = cloneElement;
    exports.Component = Component;
    exports.render = render;
    exports.rerender = rerender;
    exports.options = options;
});

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _preact = require(1);

var _preact2 = _interopRequireDefault(_preact);

var _styles = require(3);

var _styles2 = _interopRequireDefault(_styles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Module dependencies
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Styles
 */


/**
 * TokenForm
 */
var TokenForm = function (_Preact$Component) {
  _inherits(TokenForm, _Preact$Component);

  function TokenForm(props) {
    _classCallCheck(this, TokenForm);

    var _this = _possibleConstructorReturn(this, (TokenForm.__proto__ || Object.getPrototypeOf(TokenForm)).call(this, props));

    _this.state = _this.getInitState();
    _this.handleSubmit = _this.handleSubmit.bind(_this);
    _this.handleChange = _this.handleChange.bind(_this);
    _this.handleFocus = _this.handleFocus.bind(_this);
    _this.handleBlur = _this.handleBlur.bind(_this);
    _this.styles = (0, _styles2.default)(props.color);
    return _this;
  }

  _createClass(TokenForm, [{
    key: 'getInitState',
    value: function getInitState() {
      return {
        number: '',
        holdername: '',
        expiration: '',
        ccv: '',
        email: '',
        doctype: '',
        docnum: ''
      };
    }
  }, {
    key: 'handleFocus',
    value: function handleFocus(eve) {
      for (var prop in this.styles.field_input_focus) {
        eve.target.style[prop] = this.styles.field_input_focus[prop];
      }
    }
  }, {
    key: 'handleBlur',
    value: function handleBlur(eve) {
      for (var prop in this.styles.field_input_focus) {
        eve.target.style[prop] = this.styles.field_input[prop];
      }
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(eve) {
      eve.preventDefault();
      this.props.handleSubmit && this.props.handleSubmit(this.state);
    }
  }, {
    key: 'handleChange',
    value: function handleChange(eve) {
      var data = {};
      data[eve.target.id] = eve.target.value;
      this.setState(data);
      this.props.handleChange && this.props.handleChange(data);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.$number.focus();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _preact2.default.h(
        'form',
        { action: './', method: 'POST', className: 'paymentForm', id: 'paymentForm', onSubmit: this.handleSubmit, style: this.styles.paymentForm },
        _preact2.default.h(
          'div',
          { className: 'fieldList', style: this.styles.fieldList },
          _preact2.default.h(
            'div',
            { className: 'field', style: this.styles.field },
            _preact2.default.h(
              'label',
              { htmlFor: 'number', style: this.styles.field_label },
              'Credit Card Number'
            ),
            _preact2.default.h('input', { type: 'number', id: 'number', minLength: '13', maxLength: '16', placeholder: 'Credit Card Number', pattern: '[0-9]{13,16}', ref: function ref(e) {
                return _this2.$number = e;
              }, required: true, onChange: this.handleChange, onFocus: this.handleFocus, onBlur: this.handleBlur, style: this.styles.field_input })
          ),
          _preact2.default.h(
            'div',
            { className: 'field', style: this.styles.field },
            _preact2.default.h(
              'label',
              { htmlFor: 'holdername', style: this.styles.field_label },
              'Name on card'
            ),
            _preact2.default.h('input', { type: 'text', id: 'holdername', placeholder: 'Name on card', required: true, onChange: this.handleChange, onFocus: this.handleFocus, onBlur: this.handleBlur, style: this.styles.field_input })
          ),
          _preact2.default.h(
            'div',
            { className: 'field field-alt', style: Object.assign({}, this.styles.field, this.styles.field_alt) },
            _preact2.default.h(
              'label',
              { htmlFor: 'expiration', style: this.styles.field_label },
              'Expiration Date'
            ),
            _preact2.default.h('input', { type: 'number', id: 'expiration', placeholder: 'MMYY', pattern: '^((0[1-9])|(1[0-2]))\\/(\\d{2})$', required: true, onChange: this.handleChange, onFocus: this.handleFocus, onBlur: this.handleBlur, style: this.styles.field_input })
          ),
          _preact2.default.h(
            'div',
            { className: 'field field-alt field-ccv', style: Object.assign({}, this.styles.field, this.styles.field_alt) },
            _preact2.default.h(
              'label',
              { htmlFor: 'ccv', style: this.styles.field_label },
              'CCV'
            ),
            _preact2.default.h('input', { type: 'text', id: 'ccv', minLength: '3', maxLength: '4', placeholder: 'CCV', pattern: '[0-9]{3,4}', required: true, onChange: this.handleChange, onFocus: this.handleFocus, onBlur: this.handleBlur, style: this.styles.field_input })
          ),
          _preact2.default.h(
            'div',
            { className: 'field', style: this.styles.field },
            _preact2.default.h(
              'label',
              { htmlFor: 'email', style: this.styles.field_label },
              'Email'
            ),
            _preact2.default.h('input', { type: 'email', name: 'email', id: 'email', placeholder: 'Email', required: true, onChange: this.handleChange, onFocus: this.handleFocus, onBlur: this.handleBlur, style: this.styles.field_input })
          ),
          _preact2.default.h(
            'div',
            { className: 'field field-dropdown', style: Object.assign({}, this.styles.field, this.styles.field_input) },
            _preact2.default.h(
              'label',
              { htmlFor: 'doctype', style: this.styles.field_label },
              'Document type'
            ),
            _preact2.default.h(
              'select',
              { id: 'doctype', required: true, onChange: this.handleChange, style: Object.assign({}, this.styles.field_input, this.styles.field_select) },
              _preact2.default.h(
                'option',
                { value: 'dni' },
                'Document type...'
              ),
              _preact2.default.h(
                'option',
                { value: 'dni' },
                'DNI'
              )
            )
          ),
          _preact2.default.h(
            'div',
            { className: 'field', style: this.styles.field },
            _preact2.default.h(
              'label',
              { htmlFor: 'docnum', style: this.styles.field_label },
              'Document number'
            ),
            _preact2.default.h('input', { type: 'number', name: 'docnum', id: 'docnum', placeholder: 'Document number', required: true, onChange: this.handleChange, onFocus: this.handleFocus, onBlur: this.handleBlur, style: this.styles.field_input })
          )
        ),
        _preact2.default.h(
          'div',
          { className: 'submit', style: this.styles.submit },
          _preact2.default.h(
            'button',
            { type: 'submit', style: this.styles.submit_button },
            'Pay now'
          )
        )
      );
    }
  }]);

  return TokenForm;
}(_preact2.default.Component);

/**
 * Expose TokenForm
 */


exports.default = TokenForm;
module.exports = exports['default'];

},{"1":1,"3":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = styles;
/**
 * Styles
 */
function styles() {
  var color = arguments.length <= 0 || arguments[0] === undefined ? '#009EE3' : arguments[0];

  return {
    paymentForm: {
      boxSizing: 'border-box',
      fontFamily: 'Courier, monospace'
    },

    fieldList: {
      boxSizing: 'border-box',
      padding: '20px 40px 40px',
      background: '#FFF'
    },

    field: {
      margin: '0 0 12px',
      padding: '0',
      boxSizing: 'border-box'
    },

    field_label: {
      position: 'absolute',
      zIndex: '-1'
    },

    field_input: {
      color: '#000',
      width: '100%',
      padding: '10px 10px 14px',
      border: '0 solid',
      borderBottomWidth: '1px',
      borderBottomColor: '#DDD',
      boxShadow: '0 -1px 0 #FFF inset',
      borderRadius: '0',
      boxSizing: 'border-box',
      fontSize: '1em',
      fontFamily: 'Courier, monospace',
      transition: 'all 0.3s'
    },

    field_input_focus: {
      outline: '0',
      borderBottomColor: color,
      boxShadow: '0 -1px 0 ' + color + ' inset'
    },

    field_select: {
      background: 'none',
      borderBottomColor: 'transparent'
    },

    field_alt: {
      display: 'inline-block',
      width: '50%',
      paddingRight: '20px'
    },

    submit: {
      outline: '0',
      boxSizing: 'border-box',
      margin: '-12px 0 0',
      padding: '0 40px 40px',
      background: '#FFF',
      borderRadius: '0 0 4px 4px',
      fontSize: '100%'
    },

    submit_button: {
      margin: '0',
      outline: '0',
      boxSizing: 'border-box',
      padding: '18px 0',
      fontSize: '1em',
      border: '0',
      cursor: 'pointer',
      color: '#FFF',
      textShadow: '0 0 3px rgba(0, 0, 0, 0.4)',
      width: '100%',
      background: color,
      borderRadius: '4px',
      boxShadow: '1px 2px 8px rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.5) inset',
      fontFamily: 'Courier, monospace'
    }
  };
}
module.exports = exports['default'];

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _preact = require(1);

var _preact2 = _interopRequireDefault(_preact);

var _TokenForm = require(2);

var _TokenForm2 = _interopRequireDefault(_TokenForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * PaymentFrom
 */
/**
 * Module dependencies
 */
function PaymentForm(options) {
  _preact2.default.render(_preact2.default.h(_TokenForm2.default, {
    handleSubmit: options.handleSubmit,
    color: options.color
  }), options.container);
}

/**
 * Expose PaymentFrom
 */


/**
 * Component
 */
exports.default = PaymentForm;
module.exports = exports['default'];

},{"1":1,"2":2}]},{},[4])(4)
});