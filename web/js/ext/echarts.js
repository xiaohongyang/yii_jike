!function (t) {
    var e, i;
    !function () {
        function t(t, e) {
            if (!e)return t;
            if (0 === t.indexOf(".")) {
                var i = e.split("/"), o = t.split("/"), s = i.length - 1, r = o.length, n = 0, a = 0;
                t:for (var h = 0; r > h; h++)switch (o[h]) {
                    case"..":
                        if (!(s > n))break t;
                        n++, a++;
                        break;
                    case".":
                        a++;
                        break;
                    default:
                        break t
                }
                return i.length = s - n, o = o.slice(a), i.concat(o).join("/")
            }
            return t
        }

        function o(e) {
            function i(i, n) {
                if ("string" == typeof i) {
                    var a = o[i];
                    return a || (a = r(t(i, e)), o[i] = a), a
                }
                i instanceof Array && (n = n || function () {
                }, n.apply(this, s(i, n, e)))
            }

            var o = {};
            return i
        }

        function s(i, o, s) {
            for (var a = [], h = n[s], l = 0, d = Math.min(i.length, o.length); d > l; l++) {
                var c, p = t(i[l], s);
                switch (p) {
                    case"require":
                        c = h && h.require || e;
                        break;
                    case"exports":
                        c = h.exports;
                        break;
                    case"module":
                        c = h;
                        break;
                    default:
                        c = r(p)
                }
                a.push(c)
            }
            return a
        }

        function r(t) {
            var e = n[t];
            if (!e)throw new Error("No " + t);
            if (!e.defined) {
                var i = e.factory, o = i.apply(this, s(e.deps || [], i, t));
                "undefined" != typeof o && (e.exports = o), e.defined = 1
            }
            return e.exports
        }

        var n = {};
        i = function (t, e, i) {
            n[t] = {id: t, deps: e, factory: i, defined: 0, exports: {}, require: o(t)}
        }, e = o("")
    }(), i("echarts", ["echarts/echarts"], function (t) {
        return t
    }), i("echarts/echarts", ["require", "./config", "zrender/tool/util", "zrender/tool/event", "zrender/tool/env", "zrender", "zrender/config", "./chart/island", "./component/toolbox", "./component", "./component/title", "./component/tooltip", "./component/legend", "./util/ecData", "./chart", "zrender/tool/color", "./component/timeline", "zrender/shape/Image", "zrender/loadingEffect/Bar", "zrender/loadingEffect/Bubble", "zrender/loadingEffect/DynamicLine", "zrender/loadingEffect/Ring", "zrender/loadingEffect/Spin", "zrender/loadingEffect/Whirling", "./theme/default"], function (t) {
        function e() {
            n.Dispatcher.call(this)
        }

        function i(t) {
            this._themeConfig = r.clone(s), this.dom = t, this._connected = !1, this._status = {dragIn: !1, dragOut: !1, needRefresh: !1}, this._curEventType = !1, this._chartList = [], this._messageCenter = new e, this._messageCenterOutSide = new e, this.resize = this.resize(), this._init()
        }

        function o(t, e, i, o, s) {
            for (var r = t._chartList, n = r.length; n--;) {
                var a = r[n];
                "function" == typeof a[e] && a[e](i, o, s)
            }
        }

        var s = t("./config"), r = t("zrender/tool/util"), n = t("zrender/tool/event"), a = {}, h = t("zrender/tool/env").canvasSupported, l = new Date - 0, d = {}, c = "_echarts_instance_";
        a.version = "2.1.10", a.dependencies = {zrender: "2.0.6"}, a.init = function (e, o) {
            var s = t("zrender");
            (s.version || "1.0.3").replace(".", "") - 0 < a.dependencies.zrender.replace(".", "") - 0 && console.error("ZRender " + (s.version || "1.0.3-") + " is too old for ECharts " + a.version + ". Current version need ZRender " + a.dependencies.zrender + "+"), e = e instanceof Array ? e[0] : e;
            var r = e.getAttribute(c);
            return r || (r = l++, e.setAttribute(c, r)), d[r] && d[r].dispose(), d[r] = new i(e), d[r].id = r, d[r].canvasSupported = h, d[r].setTheme(o), d[r]
        }, a.getInstanceById = function (t) {
            return d[t]
        }, r.merge(e.prototype, n.Dispatcher.prototype, !0);
        var p = t("zrender/config").EVENT, u = ["CLICK", "DBLCLICK", "MOUSEOVER", "MOUSEOUT", "DRAGSTART", "DRAGEND", "DRAGENTER", "DRAGOVER", "DRAGLEAVE", "DROP"];
        return i.prototype = {_init: function () {
            var e = this, i = t("zrender").init(this.dom);
            this._zr = i, this._messageCenter.dispatch = function (t, i, o, s) {
                o = o || {}, o.type = t, o.event = i, e._messageCenter.dispatchWithContext(t, o, s), "HOVER" != t && "MOUSEOUT" != t ? setTimeout(function () {
                    e._messageCenterOutSide.dispatchWithContext(t, o, s)
                }, 50) : e._messageCenterOutSide.dispatchWithContext(t, o, s)
            }, this._onevent = function (t) {
                return e.__onevent(t)
            };
            for (var o in s.EVENT)"CLICK" != o && "DBLCLICK" != o && "HOVER" != o && "MOUSEOUT" != o && "MAP_ROAM" != o && this._messageCenter.bind(s.EVENT[o], this._onevent, this);
            var r = {};
            this._onzrevent = function (t) {
                return e[r[t.type]](t)
            };
            for (var n = 0, a = u.length; a > n; n++) {
                var h = u[n], l = p[h];
                r[l] = "_on" + h.toLowerCase(), i.on(l, this._onzrevent)
            }
            this.chart = {}, this.component = {};
            var d = t("./chart/island");
            this._island = new d(this._themeConfig, this._messageCenter, i, {}, this), this.chart.island = this._island;
            var c = t("./component/toolbox");
            this._toolbox = new c(this._themeConfig, this._messageCenter, i, {}, this), this.component.toolbox = this._toolbox;
            var g = t("./component");
            g.define("title", t("./component/title")), g.define("tooltip", t("./component/tooltip")), g.define("legend", t("./component/legend")), (0 === i.getWidth() || 0 === i.getHeight()) && console.error("Dom’s width & height should be ready before init.")
        }, __onevent: function (t) {
            t.__echartsId = t.__echartsId || this.id;
            var e = t.__echartsId === this.id;
            switch (this._curEventType || (this._curEventType = t.type), t.type) {
                case s.EVENT.LEGEND_SELECTED:
                    this._onlegendSelected(t);
                    break;
                case s.EVENT.DATA_ZOOM:
                    if (!e) {
                        var i = this.component.dataZoom;
                        i && (i.silence(!0), i.absoluteZoom(t.zoom), i.silence(!1))
                    }
                    this._ondataZoom(t);
                    break;
                case s.EVENT.DATA_RANGE:
                    e && this._ondataRange(t);
                    break;
                case s.EVENT.MAGIC_TYPE_CHANGED:
                    if (!e) {
                        var o = this.component.toolbox;
                        o && (o.silence(!0), o.setMagicType(t.magicType), o.silence(!1))
                    }
                    this._onmagicTypeChanged(t);
                    break;
                case s.EVENT.DATA_VIEW_CHANGED:
                    e && this._ondataViewChanged(t);
                    break;
                case s.EVENT.TOOLTIP_HOVER:
                    e && this._tooltipHover(t);
                    break;
                case s.EVENT.RESTORE:
                    this._onrestore();
                    break;
                case s.EVENT.REFRESH:
                    e && this._onrefresh(t);
                    break;
                case s.EVENT.TOOLTIP_IN_GRID:
                case s.EVENT.TOOLTIP_OUT_GRID:
                    if (e) {
                        if (this._connected) {
                            var r = this.component.grid;
                            r && (t.x = (t.event.zrenderX - r.getX()) / r.getWidth(), t.y = (t.event.zrenderY - r.getY()) / r.getHeight())
                        }
                    } else {
                        var r = this.component.grid;
                        r && this._zr.trigger("mousemove", {connectTrigger: !0, zrenderX: r.getX() + t.x * r.getWidth(), zrenderY: r.getY() + t.y * r.getHeight()})
                    }
            }
            if (this._connected && e && this._curEventType === t.type) {
                for (var n in this._connected)this._connected[n].connectedEventHandler(t);
                this._curEventType = null
            }
            (!e || !this._connected && e) && (this._curEventType = null)
        }, _onclick: function (t) {
            if (o(this, "onclick", t), t.target) {
                var e = this._eventPackage(t.target);
                e && null != e.seriesIndex && this._messageCenter.dispatch(s.EVENT.CLICK, t.event, e, this)
            }
        }, _ondblclick: function (t) {
            if (o(this, "ondblclick", t), t.target) {
                var e = this._eventPackage(t.target);
                e && null != e.seriesIndex && this._messageCenter.dispatch(s.EVENT.DBLCLICK, t.event, e, this)
            }
        }, _onmouseover: function (t) {
            if (t.target) {
                var e = this._eventPackage(t.target);
                e && null != e.seriesIndex && this._messageCenter.dispatch(s.EVENT.HOVER, t.event, e, this)
            }
        }, _onmouseout: function (t) {
            if (t.target) {
                var e = this._eventPackage(t.target);
                e && null != e.seriesIndex && this._messageCenter.dispatch(s.EVENT.MOUSEOUT, t.event, e, this)
            }
        }, _ondragstart: function (t) {
            this._status = {dragIn: !1, dragOut: !1, needRefresh: !1}, o(this, "ondragstart", t)
        }, _ondragenter: function (t) {
            o(this, "ondragenter", t)
        }, _ondragover: function (t) {
            o(this, "ondragover", t)
        }, _ondragleave: function (t) {
            o(this, "ondragleave", t)
        }, _ondrop: function (t) {
            o(this, "ondrop", t, this._status), this._island.ondrop(t, this._status)
        }, _ondragend: function (t) {
            if (o(this, "ondragend", t, this._status), this._timeline && this._timeline.ondragend(t, this._status), this._island.ondragend(t, this._status), this._status.needRefresh) {
                this._syncBackupData(this._option);
                var e = this._messageCenter;
                e.dispatch(s.EVENT.DATA_CHANGED, t.event, this._eventPackage(t.target), this), e.dispatch(s.EVENT.REFRESH, null, null, this)
            }
        }, _onlegendSelected: function (t) {
            this._status.needRefresh = !1, o(this, "onlegendSelected", t, this._status), this._status.needRefresh && this._messageCenter.dispatch(s.EVENT.REFRESH, null, null, this)
        }, _ondataZoom: function (t) {
            this._status.needRefresh = !1, o(this, "ondataZoom", t, this._status), this._status.needRefresh && this._messageCenter.dispatch(s.EVENT.REFRESH, null, null, this)
        }, _ondataRange: function (t) {
            this._clearEffect(), this._status.needRefresh = !1, o(this, "ondataRange", t, this._status), this._status.needRefresh && this._zr.refresh()
        }, _onmagicTypeChanged: function () {
            this._clearEffect(), this._render(this._toolbox.getMagicOption())
        }, _ondataViewChanged: function (t) {
            this._syncBackupData(t.option), this._messageCenter.dispatch(s.EVENT.DATA_CHANGED, null, t, this), this._messageCenter.dispatch(s.EVENT.REFRESH, null, null, this)
        }, _tooltipHover: function (t) {
            var e = [];
            o(this, "ontooltipHover", t, e)
        }, _onrestore: function () {
            this.restore()
        }, _onrefresh: function (t) {
            this._refreshInside = !0, this.refresh(t), this._refreshInside = !1
        }, _syncBackupData: function (t) {
            this.component.dataZoom && this.component.dataZoom.syncBackupData(t)
        }, _eventPackage: function (e) {
            if (e) {
                var i = t("./util/ecData"), o = i.get(e, "seriesIndex"), s = i.get(e, "dataIndex");
                return s = -1 != o && this.component.dataZoom ? this.component.dataZoom.getRealDataIndex(o, s) : s, {seriesIndex: o, seriesName: (i.get(e, "series") || {}).name, dataIndex: s, data: i.get(e, "data"), name: i.get(e, "name"), value: i.get(e, "value"), special: i.get(e, "special")}
            }
        }, _render: function (e) {
            this._mergeGlobalConifg(e);
            var i = e.backgroundColor;
            if (i)if (h || -1 == i.indexOf("rgba"))this.dom.style.backgroundColor = i; else {
                var o = i.split(",");
                this.dom.style.filter = "alpha(opacity=" + 100 * o[3].substring(0, o[3].lastIndexOf(")")) + ")", o.length = 3, o[0] = o[0].replace("a", ""), this.dom.style.backgroundColor = o.join(",") + ")"
            }
            this._zr.clearAnimation(), this._chartList = [];
            var r = t("./chart"), n = t("./component");
            (e.xAxis || e.yAxis) && (e.grid = e.grid || {}, e.dataZoom = e.dataZoom || {});
            for (var a, l, d, c = ["title", "legend", "tooltip", "dataRange", "roamController", "grid", "dataZoom", "xAxis", "yAxis", "polar"], p = 0, u = c.length; u > p; p++)l = c[p], d = this.component[l], e[l] ? (d ? d.refresh && d.refresh(e) : (a = n.get(/^[xy]Axis$/.test(l) ? "axis" : l), d = new a(this._themeConfig, this._messageCenter, this._zr, e, this, l), this.component[l] = d), this._chartList.push(d)) : d && (d.dispose(), this.component[l] = null, delete this.component[l]);
            for (var g, f, m, _ = {}, p = 0, u = e.series.length; u > p; p++)f = e.series[p].type, f ? _[f] || (_[f] = !0, g = r.get(f), g ? (this.chart[f] ? (m = this.chart[f], m.refresh(e)) : m = new g(this._themeConfig, this._messageCenter, this._zr, e, this), this._chartList.push(m), this.chart[f] = m) : console.error(f + " has not been required.")) : console.error("series[" + p + "] chart type has not been defined.");
            for (f in this.chart)f == s.CHART_TYPE_ISLAND || _[f] || (this.chart[f].dispose(), this.chart[f] = null, delete this.chart[f]);
            this.component.grid && this.component.grid.refixAxisShape(this.component), this._island.refresh(e), this._toolbox.refresh(e), e.animation && !e.renderAsImage ? this._zr.refresh() : this._zr.render();
            var y = "IMG" + this.id, v = document.getElementById(y);
            e.renderAsImage && h ? (v ? v.src = this.getDataURL(e.renderAsImage) : (v = this.getImage(e.renderAsImage), v.id = y, v.style.position = "absolute", v.style.left = 0, v.style.top = 0, this.dom.firstChild.appendChild(v)), this.un(), this._zr.un(), this._disposeChartList(), this._zr.clear()) : v && v.parentNode.removeChild(v), v = null, this._option = e
        }, restore: function () {
            this._clearEffect(), this._option = r.clone(this._optionRestore), this._disposeChartList(), this._island.clear(), this._toolbox.reset(this._option, !0), this._render(this._option)
        }, refresh: function (t) {
            this._clearEffect(), t = t || {};
            var e = t.option;
            !this._refreshInside && e && (e = this.getOption(), r.merge(e, t.option, !0), r.merge(this._optionRestore, t.option, !0), this._toolbox.reset(e)), this._island.refresh(e), this._toolbox.refresh(e), this._zr.clearAnimation();
            for (var i = 0, o = this._chartList.length; o > i; i++)this._chartList[i].refresh && this._chartList[i].refresh(e);
            this.component.grid && this.component.grid.refixAxisShape(this.component), this._zr.refresh()
        }, _disposeChartList: function () {
            this._clearEffect(), this._zr.clearAnimation();
            for (var t = this._chartList.length; t--;) {
                var e = this._chartList[t];
                if (e) {
                    var i = e.type;
                    this.chart[i] && delete this.chart[i], this.component[i] && delete this.component[i], e.dispose && e.dispose()
                }
            }
            this._chartList = []
        }, _mergeGlobalConifg: function (e) {
            for (var i = ["backgroundColor", "calculable", "calculableColor", "calculableHolderColor", "nameConnector", "valueConnector", "animation", "animationThreshold", "animationDuration", "animationEasing", "addDataAnimation", "symbolList", "DRAG_ENABLE_TIME"], o = i.length; o--;) {
                var s = i[o];
                null == e[s] && (e[s] = this._themeConfig[s])
            }
            var r = e.color;
            r && r.length || (r = this._themeConfig.color), h || (e.animation = !1, e.addDataAnimation = !1), this._zr.getColor = function (e) {
                var i = t("zrender/tool/color");
                return i.getColor(e, r)
            }
        }, setOption: function (t, e) {
            return t.timeline ? this._setTimelineOption(t) : this._setOption(t, e)
        }, _setOption: function (t, e) {
            return this._option = !e && this._option ? r.merge(this.getOption(), r.clone(t), !0) : r.clone(t), this._optionRestore = r.clone(this._option), this._option.series && 0 !== this._option.series.length ? (this.component.dataZoom && (this._option.dataZoom || this._option.toolbox && this._option.toolbox.feature && this._option.toolbox.feature.dataZoom && this._option.toolbox.feature.dataZoom.show) && this.component.dataZoom.syncOption(this._option), this._toolbox.reset(this._option), this._render(this._option), this) : void this._zr.clear()
        }, getOption: function () {
            function t(t) {
                var o = i._optionRestore[t];
                if (o)if (o instanceof Array)for (var s = o.length; s--;)e[t][s].data = r.clone(o[s].data); else e[t].data = r.clone(o.data)
            }

            var e = r.clone(this._option), i = this;
            return t("xAxis"), t("yAxis"), t("series"), e
        }, setSeries: function (t, e) {
            return e ? (this._option.series = t, this.setOption(this._option, e)) : this.setOption({series: t}), this
        }, getSeries: function () {
            return this.getOption().series
        }, _setTimelineOption: function (e) {
            this._timeline && this._timeline.dispose();
            var i = t("./component/timeline"), o = new i(this._themeConfig, this._messageCenter, this._zr, e, this);
            return this._timeline = o, this.component.timeline = this._timeline, this
        }, addData: function (t, e, i, o, n) {
            for (var a = t instanceof Array ? t : [
                [t, e, i, o, n]
            ], h = this.getOption(), l = this._optionRestore, d = 0, c = a.length; c > d; d++) {
                t = a[d][0], e = a[d][1], i = a[d][2], o = a[d][3], n = a[d][4];
                var p = l.series[t], u = i ? "unshift" : "push", g = i ? "pop" : "shift";
                if (p) {
                    var f = p.data, m = h.series[t].data;
                    if (f[u](e), m[u](e), o || (f[g](), e = m[g]()), null != n) {
                        var _, y;
                        if (p.type === s.CHART_TYPE_PIE && (_ = l.legend) && (y = _.data)) {
                            var v = h.legend.data;
                            if (y[u](n), v[u](n), !o) {
                                var x = r.indexOf(y, e.name);
                                -1 != x && y.splice(x, 1), x = r.indexOf(v, e.name), -1 != x && v.splice(x, 1)
                            }
                        } else if (null != l.xAxis && null != l.yAxis) {
                            var b, T, S = p.xAxisIndex || 0;
                            (null == l.xAxis[S].type || "category" === l.xAxis[S].type) && (b = l.xAxis[S].data, T = h.xAxis[S].data, b[u](n), T[u](n), o || (b[g](), T[g]())), S = p.yAxisIndex || 0, "category" === l.yAxis[S].type && (b = l.yAxis[S].data, T = h.yAxis[S].data, b[u](n), T[u](n), o || (b[g](), T[g]()))
                        }
                    }
                    this._option.series[t].data = h.series[t].data
                }
            }
            this._zr.clearAnimation();
            for (var C = this._chartList, d = 0, c = C.length; c > d; d++)h.addDataAnimation && C[d].addDataAnimation && C[d].addDataAnimation(a);
            this.component.dataZoom && this.component.dataZoom.syncOption(h), this._option = h;
            var z = this;
            return setTimeout(function () {
                if (z._zr) {
                    z._zr.clearAnimation();
                    for (var t = 0, e = C.length; e > t; t++)C[t].motionlessOnce = h.addDataAnimation && C[t].addDataAnimation;
                    z._messageCenter.dispatch(s.EVENT.REFRESH, null, {option: h}, z)
                }
            }, h.addDataAnimation ? 500 : 0), this
        }, addMarkPoint: function (t, e) {
            return this._addMark(t, e, "markPoint")
        }, addMarkLine: function (t, e) {
            return this._addMark(t, e, "markLine")
        }, _addMark: function (t, e, i) {
            var o, s = this._option.series;
            if (s && (o = s[t])) {
                var n = this._optionRestore.series, a = n[t], h = o[i], l = a[i];
                h = o[i] = h || {data: []}, l = a[i] = l || {data: []};
                for (var d in e)"data" === d ? (h.data = h.data.concat(e.data), l.data = l.data.concat(e.data)) : "object" != typeof e[d] || null == h[d] ? h[d] = l[d] = e[d] : (r.merge(h[d], e[d], !0), r.merge(l[d], e[d], !0));
                var c = this.chart[o.type];
                c && c.addMark(t, e, i)
            }
            return this
        }, delMarkPoint: function (t, e) {
            return this._delMark(t, e, "markPoint")
        }, delMarkLine: function (t, e) {
            return this._delMark(t, e, "markLine")
        }, _delMark: function (t, e, i) {
            var o, s, r, n = this._option.series;
            if (!(n && (o = n[t]) && (s = o[i]) && (r = s.data)))return this;
            e = e.split(" > ");
            for (var a = -1, h = 0, l = r.length; l > h; h++) {
                var d = r[h];
                if (d instanceof Array) {
                    if (d[0].name === e[0] && d[1].name === e[1]) {
                        a = h;
                        break
                    }
                } else if (d.name === e[0]) {
                    a = h;
                    break
                }
            }
            if (a > -1) {
                r.splice(a, 1), this._optionRestore.series[t][i].data.splice(a, 1);
                var c = this.chart[o.type];
                c && c.delMark(t, e.join(" > "), i)
            }
            return this
        }, getDom: function () {
            return this.dom
        }, getZrender: function () {
            return this._zr
        }, getDataURL: function (t) {
            if (!h)return"";
            if (0 === this._chartList.length) {
                var e = "IMG" + this.id, i = document.getElementById(e);
                if (i)return i.src
            }
            var o = this.component.tooltip;
            switch (o && o.hideTip(), t) {
                case"jpeg":
                    break;
                default:
                    t = "png"
            }
            var s = this._option.backgroundColor;
            return s && "rgba(0,0,0,0)" === s.replace(" ", "") && (s = "#fff"), this._zr.toDataURL("image/" + t, s)
        }, getImage: function (t) {
            var e = this._optionRestore.title, i = document.createElement("img");
            return i.src = this.getDataURL(t), i.title = e && e.text || "ECharts", i
        }, getConnectedDataURL: function (e) {
            if (!this.isConnected())return this.getDataURL(e);
            var i = this.dom, o = {self: {img: this.getDataURL(e), left: i.offsetLeft, top: i.offsetTop, right: i.offsetLeft + i.offsetWidth, bottom: i.offsetTop + i.offsetHeight}}, s = o.self.left, r = o.self.top, n = o.self.right, a = o.self.bottom;
            for (var h in this._connected)i = this._connected[h].getDom(), o[h] = {img: this._connected[h].getDataURL(e), left: i.offsetLeft, top: i.offsetTop, right: i.offsetLeft + i.offsetWidth, bottom: i.offsetTop + i.offsetHeight}, s = Math.min(s, o[h].left), r = Math.min(r, o[h].top), n = Math.max(n, o[h].right), a = Math.max(a, o[h].bottom);
            var l = document.createElement("div");
            l.style.position = "absolute", l.style.left = "-4000px", l.style.width = n - s + "px", l.style.height = a - r + "px", document.body.appendChild(l);
            var d = t("zrender").init(l), c = t("zrender/shape/Image");
            for (var h in o)d.addShape(new c({style: {x: o[h].left - s, y: o[h].top - r, image: o[h].img}}));
            d.render();
            var p = this._option.backgroundColor;
            p && "rgba(0,0,0,0)" === p.replace(/ /g, "") && (p = "#fff");
            var u = d.toDataURL("image/png", p);
            return setTimeout(function () {
                d.dispose(), l.parentNode.removeChild(l), l = null
            }, 100), u
        }, getConnectedImage: function (t) {
            var e = this._optionRestore.title, i = document.createElement("img");
            return i.src = this.getConnectedDataURL(t), i.title = e && e.text || "ECharts", i
        }, on: function (t, e) {
            return this._messageCenterOutSide.bind(t, e, this), this
        }, un: function (t, e) {
            return this._messageCenterOutSide.unbind(t, e), this
        }, connect: function (t) {
            if (!t)return this;
            if (this._connected || (this._connected = {}), t instanceof Array)for (var e = 0, i = t.length; i > e; e++)this._connected[t[e].id] = t[e]; else this._connected[t.id] = t;
            return this
        }, disConnect: function (t) {
            if (!t || !this._connected)return this;
            if (t instanceof Array)for (var e = 0, i = t.length; i > e; e++)delete this._connected[t[e].id]; else delete this._connected[t.id];
            for (var o in this._connected)return this;
            return this._connected = !1, this
        }, connectedEventHandler: function (t) {
            t.__echartsId != this.id && this._onevent(t)
        }, isConnected: function () {
            return!!this._connected
        }, showLoading: function (e) {
            var i = {bar: t("zrender/loadingEffect/Bar"), bubble: t("zrender/loadingEffect/Bubble"), dynamicLine: t("zrender/loadingEffect/DynamicLine"), ring: t("zrender/loadingEffect/Ring"), spin: t("zrender/loadingEffect/Spin"), whirling: t("zrender/loadingEffect/Whirling")};
            this._toolbox.hideDataView(), e = e || {};
            var o = e.textStyle || {};
            e.textStyle = o;
            var s = r.merge(r.clone(o), this._themeConfig.textStyle);
            o.textFont = s.fontStyle + " " + s.fontWeight + " " + s.fontSize + "px " + s.fontFamily, o.text = e.text || this._themeConfig.loadingText, null != e.x && (o.x = e.x), null != e.y && (o.y = e.y), e.effectOption = e.effectOption || {}, e.effectOption.textStyle = o;
            var n = e.effect;
            return("string" == typeof n || null == n) && (n = i[e.effect || "spin"]), this._zr.showLoading(new n(e.effectOption)), this
        }, hideLoading: function () {
            return this._zr.hideLoading(), this
        }, setTheme: function (e) {
            if (e) {
                if ("string" == typeof e)switch (e) {
                    default:
                        e = t("./theme/default")
                } else e = e || {};
                for (var i in this._themeConfig)delete this._themeConfig[i];
                for (var i in s)this._themeConfig[i] = r.clone(s[i]);
                e.color && (this._themeConfig.color = []), e.symbolList && (this._themeConfig.symbolList = []), r.merge(this._themeConfig, r.clone(e), !0)
            }
            h || (this._themeConfig.textStyle.fontFamily = this._themeConfig.textStyle.fontFamily2), this._timeline && this._timeline.setTheme(!0), this._optionRestore && this.restore()
        }, resize: function () {
            var t = this;
            return function () {
                if (t._clearEffect(), t._zr.resize(), t._option && t._option.renderAsImage && h)return t._render(t._option), t;
                t._zr.clearAnimation(), t._island.resize(), t._toolbox.resize(), t._timeline && t._timeline.resize();
                for (var e = 0, i = t._chartList.length; i > e; e++)t._chartList[e].resize && t._chartList[e].resize();
                return t.component.grid && t.component.grid.refixAxisShape(t.component), t._zr.refresh(), t._messageCenter.dispatch(s.EVENT.RESIZE, null, null, t), t
            }
        }, _clearEffect: function () {
            this._zr.modLayer(s.EFFECT_ZLEVEL, {motionBlur: !1}), this._zr.painter.clearLayer(s.EFFECT_ZLEVEL)
        }, clear: function () {
            return this._disposeChartList(), this._zr.clear(), this._option = {}, this._optionRestore = {}, this.dom.style.backgroundColor = null, this
        }, dispose: function () {
            var t = this.dom.getAttribute(c);
            t && delete d[t], this._island.dispose(), this._toolbox.dispose(), this._timeline && this._timeline.dispose(), this._messageCenter.unbind(), this.clear(), this._zr.dispose(), this._zr = null
        }}, a
    }), i("echarts/config", [], function () {
        var t = {CHART_TYPE_LINE: "line", CHART_TYPE_BAR: "bar", CHART_TYPE_SCATTER: "scatter", CHART_TYPE_PIE: "pie", CHART_TYPE_RADAR: "radar", CHART_TYPE_MAP: "map", CHART_TYPE_K: "k", CHART_TYPE_ISLAND: "island", CHART_TYPE_FORCE: "force", CHART_TYPE_CHORD: "chord", CHART_TYPE_GAUGE: "gauge", CHART_TYPE_FUNNEL: "funnel", CHART_TYPE_EVENTRIVER: "eventRiver", COMPONENT_TYPE_TITLE: "title", COMPONENT_TYPE_LEGEND: "legend", COMPONENT_TYPE_DATARANGE: "dataRange", COMPONENT_TYPE_DATAVIEW: "dataView", COMPONENT_TYPE_DATAZOOM: "dataZoom", COMPONENT_TYPE_TOOLBOX: "toolbox", COMPONENT_TYPE_TOOLTIP: "tooltip", COMPONENT_TYPE_GRID: "grid", COMPONENT_TYPE_AXIS: "axis", COMPONENT_TYPE_POLAR: "polar", COMPONENT_TYPE_X_AXIS: "xAxis", COMPONENT_TYPE_Y_AXIS: "yAxis", COMPONENT_TYPE_AXIS_CATEGORY: "categoryAxis", COMPONENT_TYPE_AXIS_VALUE: "valueAxis", COMPONENT_TYPE_TIMELINE: "timeline", COMPONENT_TYPE_ROAMCONTROLLER: "roamController", backgroundColor: "rgba(0,0,0,0)", color: ["#ff7f50", "#87cefa", "#da70d6", "#32cd32", "#6495ed", "#ff69b4", "#ba55d3", "#cd5c5c", "#ffa500", "#40e0d0", "#1e90ff", "#ff6347", "#7b68ee", "#00fa9a", "#ffd700", "#6699FF", "#ff6666", "#3cb371", "#b8860b", "#30e0e0"], title: {text: "", subtext: "", x: "left", y: "top", backgroundColor: "rgba(0,0,0,0)", borderColor: "#ccc", borderWidth: 0, padding: 5, itemGap: 5, textStyle: {fontSize: 18, fontWeight: "bolder", color: "#333"}, subtextStyle: {color: "#aaa"}}, legend: {show: !0, orient: "horizontal", x: "center", y: "top", backgroundColor: "rgba(0,0,0,0)", borderColor: "#ccc", borderWidth: 0, padding: 5, itemGap: 10, itemWidth: 20, itemHeight: 14, textStyle: {color: "#333"}, selectedMode: !0}, dataRange: {show: !0, orient: "vertical", x: "left", y: "bottom", backgroundColor: "rgba(0,0,0,0)", borderColor: "#ccc", borderWidth: 0, padding: 5, itemGap: 10, itemWidth: 20, itemHeight: 14, precision: 0, splitNumber: 5, calculable: !1, hoverLink: !0, realtime: !0, color: ["#006edd", "#e0ffff"], textStyle: {color: "#333"}}, toolbox: {show: !1, orient: "horizontal", x: "right", y: "top", color: ["#1e90ff", "#22bb22", "#4b0082", "#d2691e"], disableColor: "#ddd", effectiveColor: "red", backgroundColor: "rgba(0,0,0,0)", borderColor: "#ccc", borderWidth: 0, padding: 5, itemGap: 10, itemSize: 16, showTitle: !0, feature: {mark: {show: !1, title: {mark: "辅助线开关", markUndo: "删除辅助线", markClear: "清空辅助线"}, lineStyle: {width: 1, color: "#1e90ff", type: "dashed"}}, dataZoom: {show: !1, title: {dataZoom: "区域缩放", dataZoomReset: "区域缩放后退"}}, dataView: {show: !1, title: "数据视图", readOnly: !1, lang: ["数据视图", "关闭", "刷新"]}, magicType: {show: !1, title: {line: "折线图切换", bar: "柱形图切换", stack: "堆积", tiled: "平铺", force: "力导向布局图切换", chord: "和弦图切换", pie: "饼图切换", funnel: "漏斗图切换"}, type: []}, restore: {show: !1, title: "还原"}, saveAsImage: {show: !1, title: "保存为图片", type: "png", lang: ["点击保存"]}}}, tooltip: {show: !0, showContent: !0, trigger: "item", islandFormatter: "{a} <br/>{b} : {c}", showDelay: 20, hideDelay: 100, transitionDuration: .4, enterable: !1, backgroundColor: "rgba(0,0,0,0.7)", borderColor: "#333", borderRadius: 4, borderWidth: 0, padding: 5, axisPointer: {type: "line", lineStyle: {color: "#48b", width: 2, type: "solid"}, crossStyle: {color: "#1e90ff", width: 1, type: "dashed"}, shadowStyle: {color: "rgba(150,150,150,0.3)", width: "auto", type: "default"}}, textStyle: {color: "#fff"}}, dataZoom: {show: !1, orient: "horizontal", backgroundColor: "rgba(0,0,0,0)", dataBackgroundColor: "#eee", fillerColor: "rgba(144,197,237,0.2)", handleColor: "rgba(70,130,180,0.8)", showDetail: !0, realtime: !0}, grid: {x: 80, y: 60, x2: 80, y2: 60, backgroundColor: "rgba(0,0,0,0)", borderWidth: 1, borderColor: "#ccc"}, categoryAxis: {show: !0, position: "bottom", name: "", nameLocation: "end", nameTextStyle: {}, boundaryGap: !0, axisLine: {show: !0, onZero: !0, lineStyle: {color: "#48b", width: 2, type: "solid"}}, axisTick: {show: !0, interval: "auto", inside: !1, length: 5, lineStyle: {color: "#333", width: 1}}, axisLabel: {show: !0, interval: "auto", rotate: 0, margin: 8, textStyle: {color: "#333"}}, splitLine: {show: !0, lineStyle: {color: ["#ccc"], width: 1, type: "solid"}}, splitArea: {show: !1, areaStyle: {color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"]}}}, valueAxis: {show: !0, position: "left", name: "", nameLocation: "end", nameTextStyle: {}, boundaryGap: [0, 0], axisLine: {show: !0, onZero: !0, lineStyle: {color: "#48b", width: 2, type: "solid"}}, axisTick: {show: !1, inside: !1, length: 5, lineStyle: {color: "#333", width: 1}}, axisLabel: {show: !0, rotate: 0, margin: 8, textStyle: {color: "#333"}}, splitLine: {show: !0, lineStyle: {color: ["#ccc"], width: 1, type: "solid"}}, splitArea: {show: !1, areaStyle: {color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"]}}}, polar: {center: ["50%", "50%"], radius: "75%", startAngle: 90, boundaryGap: [0, 0], splitNumber: 5, name: {show: !0, textStyle: {color: "#333"}}, axisLine: {show: !0, lineStyle: {color: "#ccc", width: 1, type: "solid"}}, axisLabel: {show: !1, textStyle: {color: "#333"}}, splitArea: {show: !0, areaStyle: {color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"]}}, splitLine: {show: !0, lineStyle: {width: 1, color: "#ccc"}}, type: "polygon"}, timeline: {show: !0, type: "time", notMerge: !1, realtime: !0, x: 80, x2: 80, y2: 0, height: 50, backgroundColor: "rgba(0,0,0,0)", borderColor: "#ccc", borderWidth: 0, padding: 5, controlPosition: "left", autoPlay: !1, loop: !0, playInterval: 2e3, lineStyle: {width: 1, color: "#666", type: "dashed"}, label: {show: !0, interval: "auto", rotate: 0, textStyle: {color: "#333"}}, checkpointStyle: {symbol: "auto", symbolSize: "auto", color: "auto", borderColor: "auto", borderWidth: "auto", label: {show: !1, textStyle: {color: "auto"}}}, controlStyle: {normal: {color: "#333"}, emphasis: {color: "#1e90ff"}}, symbol: "emptyDiamond", symbolSize: 4, currentIndex: 0}, roamController: {show: !0, x: "left", y: "top", width: 80, height: 120, backgroundColor: "rgba(0,0,0,0)", borderColor: "#ccc", borderWidth: 0, padding: 5, handleColor: "#6495ed", fillerColor: "#fff", step: 15, mapTypeControl: null}, bar: {clickable: !0, legendHoverLink: !0, xAxisIndex: 0, yAxisIndex: 0, barMinHeight: 0, barGap: "30%", barCategoryGap: "20%", itemStyle: {normal: {barBorderColor: "#fff", barBorderRadius: 0, barBorderWidth: 0, label: {show: !1}}, emphasis: {barBorderColor: "#fff", barBorderRadius: 0, barBorderWidth: 0, label: {show: !1}}}}, line: {clickable: !0, legendHoverLink: !0, xAxisIndex: 0, yAxisIndex: 0, itemStyle: {normal: {label: {show: !1}, lineStyle: {width: 2, type: "solid", shadowColor: "rgba(0,0,0,0)", shadowBlur: 0, shadowOffsetX: 0, shadowOffsetY: 0}}, emphasis: {label: {show: !1}}}, symbolSize: 2, showAllSymbol: !1}, k: {clickable: !0, legendHoverLink: !1, xAxisIndex: 0, yAxisIndex: 0, itemStyle: {normal: {color: "#fff", color0: "#00aa11", lineStyle: {width: 1, color: "#ff3200", color0: "#00aa11"}}, emphasis: {}}}, scatter: {clickable: !0, legendHoverLink: !0, xAxisIndex: 0, yAxisIndex: 0, symbolSize: 4, large: !1, largeThreshold: 2e3, itemStyle: {normal: {label: {show: !1, formatter: function (t, e, i) {
            return"undefined" != typeof i[2] ? i[2] : i[0] + " , " + i[1]
        }}}, emphasis: {label: {show: !1, formatter: function (t, e, i) {
            return"undefined" != typeof i[2] ? i[2] : i[0] + " , " + i[1]
        }}}}}, radar: {clickable: !0, legendHoverLink: !0, polarIndex: 0, itemStyle: {normal: {label: {show: !1}, lineStyle: {width: 2, type: "solid"}}, emphasis: {label: {show: !1}}}, symbolSize: 2}, pie: {clickable: !0, legendHoverLink: !0, center: ["50%", "50%"], radius: [0, "75%"], clockWise: !0, startAngle: 90, minAngle: 0, selectedOffset: 10, itemStyle: {normal: {borderColor: "rgba(0,0,0,0)", borderWidth: 1, label: {show: !0, position: "outer"}, labelLine: {show: !0, length: 20, lineStyle: {width: 1, type: "solid"}}}, emphasis: {borderColor: "rgba(0,0,0,0)", borderWidth: 1, label: {show: !1}, labelLine: {show: !1, length: 20, lineStyle: {width: 1, type: "solid"}}}}}, map: {mapType: "china", mapValuePrecision: 0, showLegendSymbol: !0, dataRangeHoverLink: !0, hoverable: !0, clickable: !0, itemStyle: {normal: {borderColor: "rgba(0,0,0,0)", borderWidth: 1, areaStyle: {color: "#ccc"}, label: {show: !1, textStyle: {color: "rgb(139,69,19)"}}}, emphasis: {borderColor: "rgba(0,0,0,0)", borderWidth: 1, areaStyle: {color: "rgba(255,215,0,0.8)"}, label: {show: !1, textStyle: {color: "rgb(100,0,0)"}}}}}, force: {center: ["50%", "50%"], size: "100%", preventOverlap: !1, coolDown: .99, minRadius: 10, maxRadius: 20, ratioScaling: !1, large: !1, useWorker: !1, steps: 1, scaling: 1, gravity: 1, symbol: "circle", symbolSize: 0, linkSymbol: null, linkSymbolSize: [10, 15], draggable: !0, clickable: !0, roam: !1, itemStyle: {normal: {label: {show: !1, position: "inside"}, nodeStyle: {brushType: "both", borderColor: "#5182ab", borderWidth: 1}, linkStyle: {color: "#5182ab", width: 1, type: "line"}}, emphasis: {label: {show: !1}, nodeStyle: {}, linkStyle: {opacity: 0}}}}, chord: {clickable: !0, radius: ["65%", "75%"], center: ["50%", "50%"], padding: 2, sort: "none", sortSub: "none", startAngle: 90, clockWise: !0, ribbonType: !0, minRadius: 10, maxRadius: 20, symbol: "circle", showScale: !1, showScaleText: !1, itemStyle: {normal: {borderWidth: 0, borderColor: "#000", label: {show: !0, rotate: !1, distance: 5}, chordStyle: {width: 1, color: "black", borderWidth: 1, borderColor: "#999", opacity: .5}}, emphasis: {borderWidth: 0, borderColor: "#000", chordStyle: {width: 1, color: "black", borderWidth: 1, borderColor: "#999"}}}}, gauge: {center: ["50%", "50%"], legendHoverLink: !0, radius: "75%", startAngle: 225, endAngle: -45, min: 0, max: 100, precision: 0, splitNumber: 10, axisLine: {show: !0, lineStyle: {color: [
            [.2, "#228b22"],
            [.8, "#48b"],
            [1, "#ff4500"]
        ], width: 30}}, axisTick: {show: !0, splitNumber: 5, length: 8, lineStyle: {color: "#eee", width: 1, type: "solid"}}, axisLabel: {show: !0, textStyle: {color: "auto"}}, splitLine: {show: !0, length: 30, lineStyle: {color: "#eee", width: 2, type: "solid"}}, pointer: {show: !0, length: "80%", width: 8, color: "auto"}, title: {show: !0, offsetCenter: [0, "-40%"], textStyle: {color: "#333", fontSize: 15}}, detail: {show: !0, backgroundColor: "rgba(0,0,0,0)", borderWidth: 0, borderColor: "#ccc", width: 100, height: 40, offsetCenter: [0, "40%"], textStyle: {color: "auto", fontSize: 30}}}, funnel: {clickable: !0, legendHoverLink: !0, x: 80, y: 60, x2: 80, y2: 60, min: 0, max: 100, minSize: "0%", maxSize: "100%", sort: "descending", gap: 0, funnelAlign: "center", itemStyle: {normal: {borderColor: "#fff", borderWidth: 1, label: {show: !0, position: "outer"}, labelLine: {show: !0, length: 10, lineStyle: {width: 1, type: "solid"}}}, emphasis: {borderColor: "rgba(0,0,0,0)", borderWidth: 1, label: {show: !0}, labelLine: {show: !0}}}}, eventRiver: {clickable: !0, legendHoverLink: !0, itemStyle: {normal: {borderColor: "rgba(0,0,0,0)", borderWidth: 1, label: {show: !0, position: "inside", formatter: "{b}"}}, emphasis: {borderColor: "rgba(0,0,0,0)", borderWidth: 1, label: {show: !0}}}}, island: {r: 15, calculateStep: .1}, markPoint: {clickable: !0, symbol: "pin", symbolSize: 10, large: !1, effect: {show: !1, loop: !0, period: 15, scaleSize: 2}, itemStyle: {normal: {borderWidth: 2, label: {show: !0, position: "inside"}}, emphasis: {label: {show: !0}}}}, markLine: {clickable: !0, symbol: ["circle", "arrow"], symbolSize: [2, 4], large: !1, effect: {show: !1, loop: !0, period: 15, scaleSize: 2}, itemStyle: {normal: {borderWidth: 1.5, label: {show: !0, position: "end"}, lineStyle: {type: "dashed"}}, emphasis: {label: {show: !1}, lineStyle: {}}}}, textStyle: {decoration: "none", fontFamily: "Arial, Verdana, sans-serif", fontFamily2: "微软雅黑", fontSize: 12, fontStyle: "normal", fontWeight: "normal"}, EVENT: {REFRESH: "refresh", RESTORE: "restore", RESIZE: "resize", CLICK: "click", DBLCLICK: "dblclick", HOVER: "hover", MOUSEOUT: "mouseout", DATA_CHANGED: "dataChanged", DATA_ZOOM: "dataZoom", DATA_RANGE: "dataRange", DATA_RANGE_HOVERLINK: "dataRangeHoverLink", LEGEND_SELECTED: "legendSelected", LEGEND_HOVERLINK: "legendHoverLink", MAP_SELECTED: "mapSelected", PIE_SELECTED: "pieSelected", MAGIC_TYPE_CHANGED: "magicTypeChanged", DATA_VIEW_CHANGED: "dataViewChanged", TIMELINE_CHANGED: "timelineChanged", MAP_ROAM: "mapRoam", FORCE_LAYOUT_END: "forceLayoutEnd", TOOLTIP_HOVER: "tooltipHover", TOOLTIP_IN_GRID: "tooltipInGrid", TOOLTIP_OUT_GRID: "tooltipOutGrid", ROAMCONTROLLER: "roamController"}, DRAG_ENABLE_TIME: 120, EFFECT_ZLEVEL: 7, symbolList: ["circle", "rectangle", "triangle", "diamond", "emptyCircle", "emptyRectangle", "emptyTriangle", "emptyDiamond"], loadingText: "Loading...", calculable: !1, calculableColor: "rgba(255,165,0,0.6)", calculableHolderColor: "#ccc", nameConnector: " & ", valueConnector: ": ", animation: !0, addDataAnimation: !0, animationThreshold: 2e3, animationDuration: 2e3, animationEasing: "ExponentialOut"};
        return t
    }), i("zrender/tool/util", ["require", "../dep/excanvas"], function (t) {
        function e(t) {
            if ("object" == typeof t && null !== t) {
                var i = t;
                if (t instanceof Array) {
                    i = [];
                    for (var o = 0, s = t.length; s > o; o++)i[o] = e(t[o])
                } else if (!f[Object.prototype.toString.call(t)]) {
                    i = {};
                    for (var r in t)t.hasOwnProperty(r) && (i[r] = e(t[r]))
                }
                return i
            }
            return t
        }

        function i(t, e, i, s) {
            e.hasOwnProperty(i) && ("object" != typeof t[i] || f[Object.prototype.toString.call(t[i])] ? !s && i in t || (t[i] = e[i]) : o(t[i], e[i], s))
        }

        function o(t, e, o) {
            for (var s in e)i(t, e, s, o);
            return t
        }

        function s() {
            if (!d)if (t("../dep/excanvas"), window.G_vmlCanvasManager) {
                var e = document.createElement("div");
                e.style.position = "absolute", e.style.top = "-1000px", document.body.appendChild(e), d = G_vmlCanvasManager.initElement(e).getContext("2d")
            } else d = document.createElement("canvas").getContext("2d");
            return d
        }

        function r() {
            return p || (c = document.createElement("canvas"), u = c.width, g = c.height, p = c.getContext("2d")), p
        }

        function n(t, e) {
            var i, o = 100;
            t + m > u && (u = t + m + o, c.width = u, i = !0), e + _ > g && (g = e + _ + o, c.height = g, i = !0), -m > t && (m = Math.ceil(-t / o) * o, u += m, c.width = u, i = !0), -_ > e && (_ = Math.ceil(-e / o) * o, g += _, c.height = g, i = !0), i && p.translate(m, _)
        }

        function a() {
            return{x: m, y: _}
        }

        function h(t, e) {
            if (t.indexOf)return t.indexOf(e);
            for (var i = 0, o = t.length; o > i; i++)if (t[i] === e)return i;
            return-1
        }

        function l(t, e) {
            function i() {
            }

            var o = t.prototype;
            i.prototype = e.prototype, t.prototype = new i;
            for (var s in o)t.prototype[s] = o[s];
            t.constructor = t
        }

        var d, c, p, u, g, f = {"[object Function]": 1, "[object RegExp]": 1, "[object Date]": 1, "[object Error]": 1, "[object CanvasGradient]": 1}, m = 0, _ = 0;
        return{inherits: l, clone: e, merge: o, getContext: s, getPixelContext: r, getPixelOffset: a, adjustCanvasSize: n, indexOf: h}
    }), i("zrender/tool/event", ["require", "../mixin/Eventful"], function (t) {
        "use strict";
        function e(t) {
            return"undefined" != typeof t.zrenderX && t.zrenderX || "undefined" != typeof t.offsetX && t.offsetX || "undefined" != typeof t.layerX && t.layerX || "undefined" != typeof t.clientX && t.clientX
        }

        function i(t) {
            return"undefined" != typeof t.zrenderY && t.zrenderY || "undefined" != typeof t.offsetY && t.offsetY || "undefined" != typeof t.layerY && t.layerY || "undefined" != typeof t.clientY && t.clientY
        }

        function o(t) {
            return"undefined" != typeof t.zrenderDelta && t.zrenderDelta || "undefined" != typeof t.wheelDelta && t.wheelDelta || "undefined" != typeof t.detail && -t.detail
        }

        var s = t("../mixin/Eventful"), r = "function" == typeof window.addEventListener ? function (t) {
            t.preventDefault(), t.stopPropagation(), t.cancelBubble = !0
        } : function (t) {
            t.returnValue = !1, t.cancelBubble = !0
        };
        return{getX: e, getY: i, getDelta: o, stop: r, Dispatcher: s}
    }), i("zrender/tool/env", [], function () {
        function t(t) {
            var e = this.os = {}, i = this.browser = {}, o = t.match(/Web[kK]it[\/]{0,1}([\d.]+)/), s = t.match(/(Android);?[\s\/]+([\d.]+)?/), r = t.match(/(iPad).*OS\s([\d_]+)/), n = t.match(/(iPod)(.*OS\s([\d_]+))?/), a = !r && t.match(/(iPhone\sOS)\s([\d_]+)/), h = t.match(/(webOS|hpwOS)[\s\/]([\d.]+)/), l = h && t.match(/TouchPad/), d = t.match(/Kindle\/([\d.]+)/), c = t.match(/Silk\/([\d._]+)/), p = t.match(/(BlackBerry).*Version\/([\d.]+)/), u = t.match(/(BB10).*Version\/([\d.]+)/), g = t.match(/(RIM\sTablet\sOS)\s([\d.]+)/), f = t.match(/PlayBook/), m = t.match(/Chrome\/([\d.]+)/) || t.match(/CriOS\/([\d.]+)/), _ = t.match(/Firefox\/([\d.]+)/), y = t.match(/MSIE ([\d.]+)/), v = o && t.match(/Mobile\//) && !m, x = t.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/) && !m, y = t.match(/MSIE\s([\d.]+)/);
            return(i.webkit = !!o) && (i.version = o[1]), s && (e.android = !0, e.version = s[2]), a && !n && (e.ios = e.iphone = !0, e.version = a[2].replace(/_/g, ".")), r && (e.ios = e.ipad = !0, e.version = r[2].replace(/_/g, ".")), n && (e.ios = e.ipod = !0, e.version = n[3] ? n[3].replace(/_/g, ".") : null), h && (e.webos = !0, e.version = h[2]), l && (e.touchpad = !0), p && (e.blackberry = !0, e.version = p[2]), u && (e.bb10 = !0, e.version = u[2]), g && (e.rimtabletos = !0, e.version = g[2]), f && (i.playbook = !0), d && (e.kindle = !0, e.version = d[1]), c && (i.silk = !0, i.version = c[1]), !c && e.android && t.match(/Kindle Fire/) && (i.silk = !0), m && (i.chrome = !0, i.version = m[1]), _ && (i.firefox = !0, i.version = _[1]), y && (i.ie = !0, i.version = y[1]), v && (t.match(/Safari/) || e.ios) && (i.safari = !0), x && (i.webview = !0), y && (i.ie = !0, i.version = y[1]), e.tablet = !!(r || f || s && !t.match(/Mobile/) || _ && t.match(/Tablet/) || y && !t.match(/Phone/) && t.match(/Touch/)), e.phone = !(e.tablet || e.ipod || !(s || a || h || p || u || m && t.match(/Android/) || m && t.match(/CriOS\/([\d.]+)/) || _ && t.match(/Mobile/) || y && t.match(/Touch/))), {browser: i, os: e, canvasSupported: document.createElement("canvas").getContext ? !0 : !1}
        }

        return t(navigator.userAgent)
    }), i("zrender", ["zrender/zrender"], function (t) {
        return t
    }), i("zrender/zrender", ["require", "./dep/excanvas", "./tool/util", "./tool/log", "./tool/guid", "./Handler", "./Painter", "./Storage", "./animation/Animation", "./tool/env"], function (t) {
        function e(t) {
            return function () {
                for (var e = t.animatingElements, i = 0, o = e.length; o > i; i++)t.storage.mod(e[i].id);
                (e.length || t._needsRefreshNextFrame) && t.refresh()
            }
        }

        t("./dep/excanvas");
        var i = t("./tool/util"), o = t("./tool/log"), s = t("./tool/guid"), r = t("./Handler"), n = t("./Painter"), a = t("./Storage"), h = t("./animation/Animation"), l = {}, d = {};
        d.version = "2.0.6", d.init = function (t) {
            var e = new c(s(), t);
            return l[e.id] = e, e
        }, d.dispose = function (t) {
            if (t)t.dispose(); else {
                for (var e in l)l[e].dispose();
                l = {}
            }
            return d
        }, d.getInstance = function (t) {
            return l[t]
        }, d.delInstance = function (t) {
            return delete l[t], d
        };
        var c = function (i, o) {
            this.id = i, this.env = t("./tool/env"), this.storage = new a, this.painter = new n(o, this.storage), this.handler = new r(o, this.storage, this.painter), this.animatingElements = [], this.animation = new h({stage: {update: e(this)}}), this.animation.start();
            var s = this;
            this.painter.refreshNextFrame = function () {
                s.refreshNextFrame()
            }, this._needsRefreshNextFrame = !1
        };
        return c.prototype.getId = function () {
            return this.id
        }, c.prototype.addShape = function (t) {
            return this.storage.addRoot(t), this
        }, c.prototype.addGroup = function (t) {
            return this.storage.addRoot(t), this
        }, c.prototype.delShape = function (t) {
            return this.storage.delRoot(t), this
        }, c.prototype.delGroup = function (t) {
            return this.storage.delRoot(t), this
        }, c.prototype.modShape = function (t, e) {
            return this.storage.mod(t, e), this
        }, c.prototype.modGroup = function (t, e) {
            return this.storage.mod(t, e), this
        }, c.prototype.modLayer = function (t, e) {
            return this.painter.modLayer(t, e), this
        }, c.prototype.addHoverShape = function (t) {
            return this.storage.addHover(t), this
        }, c.prototype.render = function (t) {
            return this.painter.render(t), this._needsRefreshNextFrame = !1, this
        }, c.prototype.refresh = function (t) {
            return this.painter.refresh(t), this._needsRefreshNextFrame = !1, this
        }, c.prototype.refreshNextFrame = function () {
            return this._needsRefreshNextFrame = !0, this
        }, c.prototype.refreshHover = function (t) {
            return this.painter.refreshHover(t), this
        }, c.prototype.refreshShapes = function (t, e) {
            return this.painter.refreshShapes(t, e), this
        }, c.prototype.resize = function () {
            return this.painter.resize(), this
        }, c.prototype.animate = function (t, e, s) {
            if ("string" == typeof t && (t = this.storage.get(t)), t) {
                var r;
                if (e) {
                    for (var n = e.split("."), a = t, h = 0, l = n.length; l > h; h++)a && (a = a[n[h]]);
                    a && (r = a)
                } else r = t;
                if (!r)return void o('Property "' + e + '" is not existed in element ' + t.id);
                var d = this.animatingElements;
                return"undefined" == typeof t.__aniCount && (t.__aniCount = 0), 0 === t.__aniCount && d.push(t), t.__aniCount++, this.animation.animate(r, {loop: s}).done(function () {
                    if (t.__aniCount--, 0 === t.__aniCount) {
                        var e = i.indexOf(d, t);
                        d.splice(e, 1)
                    }
                })
            }
            o("Element not existed")
        }, c.prototype.clearAnimation = function () {
            this.animation.clear()
        }, c.prototype.showLoading = function (t) {
            return this.painter.showLoading(t), this
        }, c.prototype.hideLoading = function () {
            return this.painter.hideLoading(), this
        }, c.prototype.getWidth = function () {
            return this.painter.getWidth()
        }, c.prototype.getHeight = function () {
            return this.painter.getHeight()
        }, c.prototype.toDataURL = function (t, e, i) {
            return this.painter.toDataURL(t, e, i)
        }, c.prototype.shapeToImage = function (t, e, i) {
            var o = s();
            return this.painter.shapeToImage(o, t, e, i)
        }, c.prototype.on = function (t, e) {
            return this.handler.on(t, e), this
        }, c.prototype.un = function (t, e) {
            return this.handler.un(t, e), this
        }, c.prototype.trigger = function (t, e) {
            return this.handler.trigger(t, e), this
        }, c.prototype.clear = function () {
            return this.storage.delRoot(), this.painter.clear(), this
        }, c.prototype.dispose = function () {
            this.animation.stop(), this.clear(), this.storage.dispose(), this.painter.dispose(), this.handler.dispose(), this.animation = this.animatingElements = this.storage = this.painter = this.handler = null, d.delInstance(this.id)
        }, d
    }), i("zrender/config", [], function () {
        var t = {EVENT: {RESIZE: "resize", CLICK: "click", DBLCLICK: "dblclick", MOUSEWHEEL: "mousewheel", MOUSEMOVE: "mousemove", MOUSEOVER: "mouseover", MOUSEOUT: "mouseout", MOUSEDOWN: "mousedown", MOUSEUP: "mouseup", GLOBALOUT: "globalout", DRAGSTART: "dragstart", DRAGEND: "dragend", DRAGENTER: "dragenter", DRAGOVER: "dragover", DRAGLEAVE: "dragleave", DROP: "drop", touchClickDelay: 300}, catchBrushException: !1, debugMode: 0};
        return t
    }), i("echarts/chart/island", ["require", "../component/base", "./base", "zrender/shape/Circle", "../config", "../util/ecData", "zrender/tool/util", "zrender/tool/event", "zrender/tool/color", "../util/accMath", "../chart"], function (t) {
        function e(t, e, s, r, a) {
            i.call(this, t, e, s, {}, a), o.call(this), this._nameConnector, this._valueConnector, this._zrHeight = this.zr.getHeight(), this._zrWidth = this.zr.getWidth();
            var l = this;
            l.shapeHandler.onmousewheel = function (t) {
                var e = t.target, i = t.event, o = h.getDelta(i);
                o = o > 0 ? -1 : 1, e.style.r -= o, e.style.r = e.style.r < 5 ? 5 : e.style.r;
                var s = n.get(e, "value"), r = s * l.option.island.calculateStep;
                s = r > 1 ? Math.round(s - r * o) : (s - r * o).toFixed(2) - 0;
                var a = n.get(e, "name");
                e.style.text = a + ":" + s, n.set(e, "value", s), n.set(e, "name", a), l.zr.modShape(e.id), l.zr.refresh(), h.stop(i)
            }
        }

        var i = t("../component/base"), o = t("./base"), s = t("zrender/shape/Circle"), r = t("../config"), n = t("../util/ecData"), a = t("zrender/tool/util"), h = t("zrender/tool/event");
        return e.prototype = {type: r.CHART_TYPE_ISLAND, _combine: function (e, i) {
            var o = t("zrender/tool/color"), s = t("../util/accMath"), r = s.accAdd(n.get(e, "value"), n.get(i, "value")), a = n.get(e, "name") + this._nameConnector + n.get(i, "name");
            e.style.text = a + this._valueConnector + r, n.set(e, "value", r), n.set(e, "name", a), e.style.r = this.option.island.r, e.style.color = o.mix(e.style.color, i.style.color)
        }, refresh: function (t) {
            t && (t.island = this.reformOption(t.island), this.option = t, this._nameConnector = this.option.nameConnector, this._valueConnector = this.option.valueConnector)
        }, getOption: function () {
            return this.option
        }, resize: function () {
            var t = this.zr.getWidth(), e = this.zr.getHeight(), i = t / (this._zrWidth || t), o = e / (this._zrHeight || e);
            if (1 !== i || 1 !== o) {
                this._zrWidth = t, this._zrHeight = e;
                for (var s = 0, r = this.shapeList.length; r > s; s++)this.zr.modShape(this.shapeList[s].id, {style: {x: Math.round(this.shapeList[s].style.x * i), y: Math.round(this.shapeList[s].style.y * o)}})
            }
        }, add: function (t) {
            var e = n.get(t, "name"), i = n.get(t, "value"), o = null != n.get(t, "series") ? n.get(t, "series").name : "", r = this.getFont(this.option.island.textStyle), a = {zlevel: this._zlevelBase, style: {x: t.style.x, y: t.style.y, r: this.option.island.r, color: t.style.color || t.style.strokeColor, text: e + this._valueConnector + i, textFont: r}, draggable: !0, hoverable: !0, onmousewheel: this.shapeHandler.onmousewheel, _type: "island"};
            "#fff" === a.style.color && (a.style.color = t.style.strokeColor), this.setCalculable(a), a.dragEnableTime = 0, n.pack(a, {name: o}, -1, i, -1, e), a = new s(a), this.shapeList.push(a), this.zr.addShape(a)
        }, del: function (t) {
            this.zr.delShape(t.id);
            for (var e = [], i = 0, o = this.shapeList.length; o > i; i++)this.shapeList[i].id != t.id && e.push(this.shapeList[i]);
            this.shapeList = e
        }, ondrop: function (t, e) {
            if (this.isDrop && t.target) {
                var i = t.target, o = t.dragged;
                this._combine(i, o), this.zr.modShape(i.id), e.dragIn = !0, this.isDrop = !1
            }
        }, ondragend: function (t, e) {
            var i = t.target;
            this.isDragend ? e.dragIn && (this.del(i), e.needRefresh = !0) : e.dragIn || (i.style.x = h.getX(t.event), i.style.y = h.getY(t.event), this.add(i), e.needRefresh = !0), this.isDragend = !1
        }}, a.inherits(e, o), a.inherits(e, i), t("../chart").define("island", e), e
    }), i("echarts/component/toolbox", ["require", "./base", "zrender/shape/Line", "zrender/shape/Image", "zrender/shape/Rectangle", "../util/shape/Icon", "../config", "zrender/tool/util", "zrender/config", "zrender/tool/event", "./dataView", "../component"], function (t) {
        function e(t, e, o, s, r) {
            i.call(this, t, e, o, s, r), this.dom = r.dom, this._magicType = {}, this._magicMap = {}, this._isSilence = !1, this._iconList, this._iconShapeMap = {}, this._featureTitle = {}, this._featureIcon = {}, this._featureColor = {}, this._featureOption = {}, this._enableColor = "red", this._disableColor = "#ccc", this._markShapeList = [];
            var n = this;
            n._onMark = function (t) {
                n.__onMark(t)
            }, n._onMarkUndo = function (t) {
                n.__onMarkUndo(t)
            }, n._onMarkClear = function (t) {
                n.__onMarkClear(t)
            }, n._onDataZoom = function (t) {
                n.__onDataZoom(t)
            }, n._onDataZoomReset = function (t) {
                n.__onDataZoomReset(t)
            }, n._onDataView = function (t) {
                n.__onDataView(t)
            }, n._onRestore = function (t) {
                n.__onRestore(t)
            }, n._onSaveAsImage = function (t) {
                n.__onSaveAsImage(t)
            }, n._onMagicType = function (t) {
                n.__onMagicType(t)
            }, n._onCustomHandler = function (t) {
                n.__onCustomHandler(t)
            }, n._onmousemove = function (t) {
                return n.__onmousemove(t)
            }, n._onmousedown = function (t) {
                return n.__onmousedown(t)
            }, n._onmouseup = function (t) {
                return n.__onmouseup(t)
            }, n._onclick = function (t) {
                return n.__onclick(t)
            }
        }

        var i = t("./base"), o = t("zrender/shape/Line"), s = t("zrender/shape/Image"), r = t("zrender/shape/Rectangle"), n = t("../util/shape/Icon"), a = t("../config"), h = t("zrender/tool/util"), l = t("zrender/config"), d = t("zrender/tool/event"), c = "stack", p = "tiled";
        return e.prototype = {type: a.COMPONENT_TYPE_TOOLBOX, _buildShape: function () {
            this._iconList = [];
            var t = this.option.toolbox;
            this._enableColor = t.effectiveColor, this._disableColor = t.disableColor;
            var e = t.feature, i = [];
            for (var o in e)if (e[o].show)switch (o) {
                case"mark":
                    i.push({key: o, name: "mark"}), i.push({key: o, name: "markUndo"}), i.push({key: o, name: "markClear"});
                    break;
                case"magicType":
                    for (var s = 0, r = e[o].type.length; r > s; s++)e[o].title[e[o].type[s] + "Chart"] = e[o].title[e[o].type[s]], e[o].option && (e[o].option[e[o].type[s] + "Chart"] = e[o].option[e[o].type[s]]), i.push({key: o, name: e[o].type[s] + "Chart"});
                    break;
                case"dataZoom":
                    i.push({key: o, name: "dataZoom"}), i.push({key: o, name: "dataZoomReset"});
                    break;
                case"saveAsImage":
                    this.canvasSupported && i.push({key: o, name: "saveAsImage"});
                    break;
                default:
                    i.push({key: o, name: o})
            }
            if (i.length > 0) {
                for (var n, o, s = 0, r = i.length; r > s; s++)n = i[s].name, o = i[s].key, this._iconList.push(n), this._featureTitle[n] = e[o].title[n] || e[o].title, e[o].icon && (this._featureIcon[n] = e[o].icon[n] || e[o].icon), e[o].color && (this._featureColor[n] = e[o].color[n] || e[o].color), e[o].option && (this._featureOption[n] = e[o].option[n] || e[o].option);
                this._itemGroupLocation = this._getItemGroupLocation(), this._buildBackground(), this._buildItem();
                for (var s = 0, r = this.shapeList.length; r > s; s++)this.zr.addShape(this.shapeList[s]);
                this._iconShapeMap.mark && (this._iconDisable(this._iconShapeMap.markUndo), this._iconDisable(this._iconShapeMap.markClear)), this._iconShapeMap.dataZoomReset && 0 === this._zoomQueue.length && this._iconDisable(this._iconShapeMap.dataZoomReset)
            }
        }, _buildItem: function () {
            var e, i, o, r, a = this.option.toolbox, h = this._iconList.length, l = this._itemGroupLocation.x, d = this._itemGroupLocation.y, c = a.itemSize, p = a.itemGap, u = a.color instanceof Array ? a.color : [a.color], g = this.getFont(a.textStyle);
            "horizontal" === a.orient ? (i = this._itemGroupLocation.y / this.zr.getHeight() < .5 ? "bottom" : "top", o = this._itemGroupLocation.x / this.zr.getWidth() < .5 ? "left" : "right", r = this._itemGroupLocation.y / this.zr.getHeight() < .5 ? "top" : "bottom") : i = this._itemGroupLocation.x / this.zr.getWidth() < .5 ? "right" : "left", this._iconShapeMap = {};
            for (var f = this, m = 0; h > m; m++) {
                switch (e = {type: "icon", zlevel: this._zlevelBase, style: {x: l, y: d, width: c, height: c, iconType: this._iconList[m], lineWidth: 1, strokeColor: this._featureColor[this._iconList[m]] || u[m % u.length], brushType: "stroke"}, highlightStyle: {lineWidth: 1, text: a.showTitle ? this._featureTitle[this._iconList[m]] : void 0, textFont: g, textPosition: i, strokeColor: this._featureColor[this._iconList[m]] || u[m % u.length]}, hoverable: !0, clickable: !0}, this._featureIcon[this._iconList[m]] && (e.style.image = this._featureIcon[this._iconList[m]].replace(new RegExp("^image:\\/\\/"), ""), e.style.opacity = .8, e.highlightStyle.opacity = 1, e.type = "image"), "horizontal" === a.orient && (0 === m && "left" === o && (e.highlightStyle.textPosition = "specific", e.highlightStyle.textAlign = o, e.highlightStyle.textBaseline = r, e.highlightStyle.textX = l, e.highlightStyle.textY = "top" === r ? d + c + 10 : d - 10), m === h - 1 && "right" === o && (e.highlightStyle.textPosition = "specific", e.highlightStyle.textAlign = o, e.highlightStyle.textBaseline = r, e.highlightStyle.textX = l + c, e.highlightStyle.textY = "top" === r ? d + c + 10 : d - 10)), this._iconList[m]) {
                    case"mark":
                        e.onclick = f._onMark;
                        break;
                    case"markUndo":
                        e.onclick = f._onMarkUndo;
                        break;
                    case"markClear":
                        e.onclick = f._onMarkClear;
                        break;
                    case"dataZoom":
                        e.onclick = f._onDataZoom;
                        break;
                    case"dataZoomReset":
                        e.onclick = f._onDataZoomReset;
                        break;
                    case"dataView":
                        if (!this._dataView) {
                            var _ = t("./dataView");
                            this._dataView = new _(this.ecTheme, this.messageCenter, this.zr, this.option, this.myChart)
                        }
                        e.onclick = f._onDataView;
                        break;
                    case"restore":
                        e.onclick = f._onRestore;
                        break;
                    case"saveAsImage":
                        e.onclick = f._onSaveAsImage;
                        break;
                    default:
                        this._iconList[m].match("Chart") ? (e._name = this._iconList[m].replace("Chart", ""), e.onclick = f._onMagicType) : e.onclick = f._onCustomHandler
                }
                "icon" === e.type ? e = new n(e) : "image" === e.type && (e = new s(e)), this.shapeList.push(e), this._iconShapeMap[this._iconList[m]] = e, "horizontal" === a.orient ? l += c + p : d += c + p
            }
        }, _buildBackground: function () {
            var t = this.option.toolbox, e = this.reformCssArray(this.option.toolbox.padding);
            this.shapeList.push(new r({zlevel: this._zlevelBase, hoverable: !1, style: {x: this._itemGroupLocation.x - e[3], y: this._itemGroupLocation.y - e[0], width: this._itemGroupLocation.width + e[3] + e[1], height: this._itemGroupLocation.height + e[0] + e[2], brushType: 0 === t.borderWidth ? "fill" : "both", color: t.backgroundColor, strokeColor: t.borderColor, lineWidth: t.borderWidth}}))
        }, _getItemGroupLocation: function () {
            var t = this.option.toolbox, e = this.reformCssArray(this.option.toolbox.padding), i = this._iconList.length, o = t.itemGap, s = t.itemSize, r = 0, n = 0;
            "horizontal" === t.orient ? (r = (s + o) * i - o, n = s) : (n = (s + o) * i - o, r = s);
            var a, h = this.zr.getWidth();
            switch (t.x) {
                case"center":
                    a = Math.floor((h - r) / 2);
                    break;
                case"left":
                    a = e[3] + t.borderWidth;
                    break;
                case"right":
                    a = h - r - e[1] - t.borderWidth;
                    break;
                default:
                    a = t.x - 0, a = isNaN(a) ? 0 : a
            }
            var l, d = this.zr.getHeight();
            switch (t.y) {
                case"top":
                    l = e[0] + t.borderWidth;
                    break;
                case"bottom":
                    l = d - n - e[2] - t.borderWidth;
                    break;
                case"center":
                    l = Math.floor((d - n) / 2);
                    break;
                default:
                    l = t.y - 0, l = isNaN(l) ? 0 : l
            }
            return{x: a, y: l, width: r, height: n}
        }, __onmousemove: function (t) {
            this._marking && (this._markShape.style.xEnd = d.getX(t.event), this._markShape.style.yEnd = d.getY(t.event), this.zr.addHoverShape(this._markShape)), this._zooming && (this._zoomShape.style.width = d.getX(t.event) - this._zoomShape.style.x, this._zoomShape.style.height = d.getY(t.event) - this._zoomShape.style.y, this.zr.addHoverShape(this._zoomShape), this.dom.style.cursor = "crosshair"), this._zoomStart && "pointer" != this.dom.style.cursor && "move" != this.dom.style.cursor && (this.dom.style.cursor = "crosshair")
        }, __onmousedown: function (t) {
            if (!t.target) {
                this._zooming = !0;
                var e = d.getX(t.event), i = d.getY(t.event), o = this.option.dataZoom || {};
                return this._zoomShape = new r({zlevel: this._zlevelBase, style: {x: e, y: i, width: 1, height: 1, brushType: "both"}, highlightStyle: {lineWidth: 2, color: o.fillerColor || a.dataZoom.fillerColor, strokeColor: o.handleColor || a.dataZoom.handleColor, brushType: "both"}}), this.zr.addHoverShape(this._zoomShape), !0
            }
        }, __onmouseup: function () {
            if (!this._zoomShape || Math.abs(this._zoomShape.style.width) < 10 || Math.abs(this._zoomShape.style.height) < 10)return this._zooming = !1, !0;
            if (this._zooming && this.component.dataZoom) {
                this._zooming = !1;
                var t = this.component.dataZoom.rectZoom(this._zoomShape.style);
                t && (this._zoomQueue.push({start: t.start, end: t.end, start2: t.start2, end2: t.end2}), this._iconEnable(this._iconShapeMap.dataZoomReset), this.zr.refresh())
            }
            return!0
        }, __onclick: function (t) {
            if (!t.target)if (this._marking)this._marking = !1, this._markShapeList.push(this._markShape), this._iconEnable(this._iconShapeMap.markUndo), this._iconEnable(this._iconShapeMap.markClear), this.zr.addShape(this._markShape), this.zr.refresh(); else if (this._markStart) {
                this._marking = !0;
                var e = d.getX(t.event), i = d.getY(t.event);
                this._markShape = new o({zlevel: this._zlevelBase, style: {xStart: e, yStart: i, xEnd: e, yEnd: i, lineWidth: this.query(this.option, "toolbox.feature.mark.lineStyle.width"), strokeColor: this.query(this.option, "toolbox.feature.mark.lineStyle.color"), lineType: this.query(this.option, "toolbox.feature.mark.lineStyle.type")}}), this.zr.addHoverShape(this._markShape)
            }
        }, __onMark: function (t) {
            var e = t.target;
            if (this._marking || this._markStart)this._resetMark(), this.zr.refresh(); else {
                this._resetZoom(), this.zr.modShape(e.id, {style: {strokeColor: this._enableColor}}), this.zr.refresh(), this._markStart = !0;
                var i = this;
                setTimeout(function () {
                    i.zr && i.zr.on(l.EVENT.CLICK, i._onclick) && i.zr.on(l.EVENT.MOUSEMOVE, i._onmousemove)
                }, 10)
            }
            return!0
        }, __onMarkUndo: function () {
            if (this._marking)this._marking = !1; else {
                var t = this._markShapeList.length;
                if (t >= 1) {
                    var e = this._markShapeList[t - 1];
                    this.zr.delShape(e.id), this.zr.refresh(), this._markShapeList.pop(), 1 === t && (this._iconDisable(this._iconShapeMap.markUndo), this._iconDisable(this._iconShapeMap.markClear))
                }
            }
            return!0
        }, __onMarkClear: function () {
            this._marking && (this._marking = !1);
            var t = this._markShapeList.length;
            if (t > 0) {
                for (; t--;)this.zr.delShape(this._markShapeList.pop().id);
                this._iconDisable(this._iconShapeMap.markUndo), this._iconDisable(this._iconShapeMap.markClear), this.zr.refresh()
            }
            return!0
        }, __onDataZoom: function (t) {
            var e = t.target;
            if (this._zooming || this._zoomStart)this._resetZoom(), this.zr.refresh(), this.dom.style.cursor = "default"; else {
                this._resetMark(), this.zr.modShape(e.id, {style: {strokeColor: this._enableColor}}), this.zr.refresh(), this._zoomStart = !0;
                var i = this;
                setTimeout(function () {
                    i.zr && i.zr.on(l.EVENT.MOUSEDOWN, i._onmousedown) && i.zr.on(l.EVENT.MOUSEUP, i._onmouseup) && i.zr.on(l.EVENT.MOUSEMOVE, i._onmousemove)
                }, 10), this.dom.style.cursor = "crosshair"
            }
            return!0
        }, __onDataZoomReset: function () {
            return this._zooming && (this._zooming = !1), this._zoomQueue.pop(), this._zoomQueue.length > 0 ? this.component.dataZoom.absoluteZoom(this._zoomQueue[this._zoomQueue.length - 1]) : (this.component.dataZoom.rectZoom(), this._iconDisable(this._iconShapeMap.dataZoomReset), this.zr.refresh()), !0
        }, _resetMark: function () {
            this._marking = !1, this._markStart && (this._markStart = !1, this._iconShapeMap.mark && this.zr.modShape(this._iconShapeMap.mark.id, {style: {strokeColor: this._iconShapeMap.mark.highlightStyle.strokeColor}}), this.zr.un(l.EVENT.CLICK, this._onclick), this.zr.un(l.EVENT.MOUSEMOVE, this._onmousemove))
        }, _resetZoom: function () {
            this._zooming = !1, this._zoomStart && (this._zoomStart = !1, this._iconShapeMap.dataZoom && this.zr.modShape(this._iconShapeMap.dataZoom.id, {style: {strokeColor: this._iconShapeMap.dataZoom.highlightStyle.strokeColor}}), this.zr.un(l.EVENT.MOUSEDOWN, this._onmousedown), this.zr.un(l.EVENT.MOUSEUP, this._onmouseup), this.zr.un(l.EVENT.MOUSEMOVE, this._onmousemove))
        }, _iconDisable: function (t) {
            "image" != t.type ? this.zr.modShape(t.id, {hoverable: !1, clickable: !1, style: {strokeColor: this._disableColor}}) : this.zr.modShape(t.id, {hoverable: !1, clickable: !1, style: {opacity: .3}})
        }, _iconEnable: function (t) {
            "image" != t.type ? this.zr.modShape(t.id, {hoverable: !0, clickable: !0, style: {strokeColor: t.highlightStyle.strokeColor}}) : this.zr.modShape(t.id, {hoverable: !0, clickable: !0, style: {opacity: .8}})
        }, __onDataView: function () {
            return this._dataView.show(this.option), !0
        }, __onRestore: function () {
            return this._resetMark(), this._resetZoom(), this.messageCenter.dispatch(a.EVENT.RESTORE, null, null, this.myChart), !0
        }, __onSaveAsImage: function () {
            var t = this.option.toolbox.feature.saveAsImage, e = t.type || "png";
            "png" != e && "jpeg" != e && (e = "png");
            var i;
            i = this.myChart.isConnected() ? this.myChart.getConnectedDataURL(e) : this.zr.toDataURL("image/" + e, this.option.backgroundColor && "rgba(0,0,0,0)" === this.option.backgroundColor.replace(" ", "") ? "#fff" : this.option.backgroundColor);
            var o = document.createElement("div");
            o.id = "__echarts_download_wrap__", o.style.cssText = "position:fixed;z-index:99999;display:block;top:0;left:0;background-color:rgba(33,33,33,0.5);text-align:center;width:100%;height:100%;line-height:" + document.documentElement.clientHeight + "px;";
            var s = document.createElement("a");
            s.href = i, s.setAttribute("download", (t.name ? t.name : this.option.title && (this.option.title.text || this.option.title.subtext) ? this.option.title.text || this.option.title.subtext : "ECharts") + "." + e), s.innerHTML = '<img style="vertical-align:middle" src="' + i + '" title="' + (window.attachEvent && -1 === navigator.userAgent.indexOf("Opera") ? "右键->图片另存为" : t.lang ? t.lang[0] : "点击保存") + '"/>', o.appendChild(s), document.body.appendChild(o), s = null, o = null, setTimeout(function () {
                var t = document.getElementById("__echarts_download_wrap__");
                t && (t.onclick = function () {
                    var t = document.getElementById("__echarts_download_wrap__");
                    t.onclick = null, t.innerHTML = "", document.body.removeChild(t), t = null
                }, t = null)
            }, 500)
        }, __onMagicType: function (t) {
            this._resetMark();
            var e = t.target._name;
            return this._magicType[e] || (this._magicType[e] = !0, e === a.CHART_TYPE_LINE ? this._magicType[a.CHART_TYPE_BAR] = !1 : e === a.CHART_TYPE_BAR && (this._magicType[a.CHART_TYPE_LINE] = !1), e === a.CHART_TYPE_PIE ? this._magicType[a.CHART_TYPE_FUNNEL] = !1 : e === a.CHART_TYPE_FUNNEL && (this._magicType[a.CHART_TYPE_PIE] = !1), e === a.CHART_TYPE_FORCE ? this._magicType[a.CHART_TYPE_CHORD] = !1 : e === a.CHART_TYPE_CHORD && (this._magicType[a.CHART_TYPE_FORCE] = !1), e === c ? this._magicType[p] = !1 : e === p && (this._magicType[c] = !1), this.messageCenter.dispatch(a.EVENT.MAGIC_TYPE_CHANGED, t.event, {magicType: this._magicType}, this.myChart)), !0
        }, setMagicType: function (t) {
            this._resetMark(), this._magicType = t, !this._isSilence && this.messageCenter.dispatch(a.EVENT.MAGIC_TYPE_CHANGED, null, {magicType: this._magicType}, this.myChart)
        }, __onCustomHandler: function (t) {
            var e = t.target.style.iconType, i = this.option.toolbox.feature[e].onclick;
            "function" == typeof i && i.call(this, this.option)
        }, reset: function (t, e) {
            if (e && this.clear(), this.query(t, "toolbox.show") && this.query(t, "toolbox.feature.magicType.show")) {
                var i = t.toolbox.feature.magicType.type, o = i.length;
                for (this._magicMap = {}; o--;)this._magicMap[i[o]] = !0;
                o = t.series.length;
                for (var s, r; o--;)s = t.series[o].type, this._magicMap[s] && (r = t.xAxis instanceof Array ? t.xAxis[t.series[o].xAxisIndex || 0] : t.xAxis, r && "category" === (r.type || "category") && (r.__boundaryGap = null != r.boundaryGap ? r.boundaryGap : !0), r = t.yAxis instanceof Array ? t.yAxis[t.series[o].yAxisIndex || 0] : t.yAxis, r && "category" === r.type && (r.__boundaryGap = null != r.boundaryGap ? r.boundaryGap : !0), t.series[o].__type = s, t.series[o].__itemStyle = h.clone(t.series[o].itemStyle || {})), (this._magicMap[c] || this._magicMap[p]) && (t.series[o].__stack = t.series[o].stack)
            }
            this._magicType = e ? {} : this._magicType || {};
            for (var n in this._magicType)if (this._magicType[n]) {
                this.option = t, this.getMagicOption();
                break
            }
            var a = t.dataZoom;
            if (a && a.show) {
                var l = null != a.start && a.start >= 0 && a.start <= 100 ? a.start : 0, d = null != a.end && a.end >= 0 && a.end <= 100 ? a.end : 100;
                l > d && (l += d, d = l - d, l -= d), this._zoomQueue = [
                    {start: l, end: d, start2: 0, end2: 100}
                ]
            } else this._zoomQueue = []
        }, getMagicOption: function () {
            var t, e;
            if (this._magicType[a.CHART_TYPE_LINE] || this._magicType[a.CHART_TYPE_BAR]) {
                for (var i = this._magicType[a.CHART_TYPE_LINE] ? !1 : !0, o = 0, s = this.option.series.length; s > o; o++)e = this.option.series[o].type, (e == a.CHART_TYPE_LINE || e == a.CHART_TYPE_BAR) && (t = this.option.xAxis instanceof Array ? this.option.xAxis[this.option.series[o].xAxisIndex || 0] : this.option.xAxis, t && "category" === (t.type || "category") && (t.boundaryGap = i ? !0 : t.__boundaryGap), t = this.option.yAxis instanceof Array ? this.option.yAxis[this.option.series[o].yAxisIndex || 0] : this.option.yAxis, t && "category" === t.type && (t.boundaryGap = i ? !0 : t.__boundaryGap));
                this._defaultMagic(a.CHART_TYPE_LINE, a.CHART_TYPE_BAR)
            }
            if (this._defaultMagic(a.CHART_TYPE_CHORD, a.CHART_TYPE_FORCE), this._defaultMagic(a.CHART_TYPE_PIE, a.CHART_TYPE_FUNNEL), this._magicType[c] || this._magicType[p])for (var o = 0, s = this.option.series.length; s > o; o++)this._magicType[c] ? (this.option.series[o].stack = "_ECHARTS_STACK_KENER_2014_", e = c) : this._magicType[p] && (this.option.series[o].stack = null, e = p), this._featureOption[e + "Chart"] && h.merge(this.option.series[o], this._featureOption[e + "Chart"] || {}, !0);
            return this.option
        }, _defaultMagic: function (t, e) {
            if (this._magicType[t] || this._magicType[e])for (var i = 0, o = this.option.series.length; o > i; i++) {
                var s = this.option.series[i].type;
                (s == t || s == e) && (this.option.series[i].type = this._magicType[t] ? t : e, this.option.series[i].itemStyle = h.clone(this.option.series[i].__itemStyle), s = this.option.series[i].type, this._featureOption[s + "Chart"] && h.merge(this.option.series[i], this._featureOption[s + "Chart"] || {}, !0))
            }
        }, silence: function (t) {
            this._isSilence = t
        }, resize: function () {
            this._resetMark(), this.clear(), this.option && this.option.toolbox && this.option.toolbox.show && this._buildShape(), this._dataView && this._dataView.resize()
        }, hideDataView: function () {
            this._dataView && this._dataView.hide()
        }, clear: function (t) {
            this.zr && (this.zr.delShape(this.shapeList), this.shapeList = [], t || (this.zr.delShape(this._markShapeList), this._markShapeList = []))
        }, onbeforDispose: function () {
            this._dataView && (this._dataView.dispose(), this._dataView = null), this._markShapeList = null
        }, refresh: function (t) {
            t && (this._resetMark(), this._resetZoom(), t.toolbox = this.reformOption(t.toolbox), this.option = t, this.clear(!0), t.toolbox.show && this._buildShape(), this.hideDataView())
        }}, h.inherits(e, i), t("../component").define("toolbox", e), e
    }), i("echarts/component", [], function () {
        var t = {}, e = {};
        return t.define = function (i, o) {
            return e[i] = o, t
        }, t.get = function (t) {
            return e[t]
        }, t
    }), i("echarts/component/title", ["require", "./base", "zrender/shape/Text", "zrender/shape/Rectangle", "../config", "zrender/tool/util", "zrender/tool/area", "zrender/tool/color", "../component"], function (t) {
        function e(t, e, o, s, r) {
            i.call(this, t, e, o, s, r), this.refresh(s)
        }

        var i = t("./base"), o = t("zrender/shape/Text"), s = t("zrender/shape/Rectangle"), r = t("../config"), n = t("zrender/tool/util"), a = t("zrender/tool/area"), h = t("zrender/tool/color");
        return e.prototype = {type: r.COMPONENT_TYPE_TITLE, _buildShape: function () {
            this._itemGroupLocation = this._getItemGroupLocation(), this._buildBackground(), this._buildItem();
            for (var t = 0, e = this.shapeList.length; e > t; t++)this.zr.addShape(this.shapeList[t])
        }, _buildItem: function () {
            var t = this.titleOption.text, e = this.titleOption.link, i = this.titleOption.target, s = this.titleOption.subtext, r = this.titleOption.sublink, n = this.titleOption.subtarget, a = this.getFont(this.titleOption.textStyle), l = this.getFont(this.titleOption.subtextStyle), d = this._itemGroupLocation.x, c = this._itemGroupLocation.y, p = this._itemGroupLocation.width, u = this._itemGroupLocation.height, g = {zlevel: this._zlevelBase, style: {y: c, color: this.titleOption.textStyle.color, text: t, textFont: a, textBaseline: "top"}, highlightStyle: {color: h.lift(this.titleOption.textStyle.color, 1), brushType: "fill"}, hoverable: !1};
            e && (g.hoverable = !0, g.clickable = !0, g.onclick = function () {
                i && "self" == i ? window.location = e : window.open(e)
            });
            var f = {zlevel: this._zlevelBase, style: {y: c + u, color: this.titleOption.subtextStyle.color, text: s, textFont: l, textBaseline: "bottom"}, highlightStyle: {color: h.lift(this.titleOption.subtextStyle.color, 1), brushType: "fill"}, hoverable: !1};
            switch (r && (f.hoverable = !0, f.clickable = !0, f.onclick = function () {
                n && "self" == n ? window.location = r : window.open(r)
            }), this.titleOption.x) {
                case"center":
                    g.style.x = f.style.x = d + p / 2, g.style.textAlign = f.style.textAlign = "center";
                    break;
                case"left":
                    g.style.x = f.style.x = d, g.style.textAlign = f.style.textAlign = "left";
                    break;
                case"right":
                    g.style.x = f.style.x = d + p, g.style.textAlign = f.style.textAlign = "right";
                    break;
                default:
                    d = this.titleOption.x - 0, d = isNaN(d) ? 0 : d, g.style.x = f.style.x = d
            }
            this.titleOption.textAlign && (g.style.textAlign = f.style.textAlign = this.titleOption.textAlign), this.shapeList.push(new o(g)), "" !== s && this.shapeList.push(new o(f))
        }, _buildBackground: function () {
            var t = this.reformCssArray(this.titleOption.padding);
            this.shapeList.push(new s({zlevel: this._zlevelBase, hoverable: !1, style: {x: this._itemGroupLocation.x - t[3], y: this._itemGroupLocation.y - t[0], width: this._itemGroupLocation.width + t[3] + t[1], height: this._itemGroupLocation.height + t[0] + t[2], brushType: 0 === this.titleOption.borderWidth ? "fill" : "both", color: this.titleOption.backgroundColor, strokeColor: this.titleOption.borderColor, lineWidth: this.titleOption.borderWidth}}))
        }, _getItemGroupLocation: function () {
            var t, e = this.reformCssArray(this.titleOption.padding), i = this.titleOption.text, o = this.titleOption.subtext, s = this.getFont(this.titleOption.textStyle), r = this.getFont(this.titleOption.subtextStyle), n = Math.max(a.getTextWidth(i, s), a.getTextWidth(o, r)), h = a.getTextHeight(i, s) + ("" === o ? 0 : this.titleOption.itemGap + a.getTextHeight(o, r)), l = this.zr.getWidth();
            switch (this.titleOption.x) {
                case"center":
                    t = Math.floor((l - n) / 2);
                    break;
                case"left":
                    t = e[3] + this.titleOption.borderWidth;
                    break;
                case"right":
                    t = l - n - e[1] - this.titleOption.borderWidth;
                    break;
                default:
                    t = this.titleOption.x - 0, t = isNaN(t) ? 0 : t
            }
            var d, c = this.zr.getHeight();
            switch (this.titleOption.y) {
                case"top":
                    d = e[0] + this.titleOption.borderWidth;
                    break;
                case"bottom":
                    d = c - h - e[2] - this.titleOption.borderWidth;
                    break;
                case"center":
                    d = Math.floor((c - h) / 2);
                    break;
                default:
                    d = this.titleOption.y - 0, d = isNaN(d) ? 0 : d
            }
            return{x: t, y: d, width: n, height: h}
        }, refresh: function (t) {
            t && (this.option = t, this.option.title = this.reformOption(this.option.title), this.titleOption = this.option.title, this.titleOption.textStyle = n.merge(this.titleOption.textStyle, this.ecTheme.textStyle), this.titleOption.subtextStyle = n.merge(this.titleOption.subtextStyle, this.ecTheme.textStyle)), this.clear(), this._buildShape()
        }}, n.inherits(e, i), t("../component").define("title", e), e
    }), i("echarts/component/tooltip", ["require", "./base", "../util/shape/Cross", "zrender/shape/Line", "zrender/shape/Rectangle", "../config", "../util/ecData", "zrender/config", "zrender/tool/event", "zrender/tool/area", "zrender/tool/color", "zrender/tool/util", "zrender/shape/Base", "../component"], function (t) {
        function e(t, e, r, n, a) {
            i.call(this, t, e, r, n, a), this.dom = a.dom;
            var h = this;
            h._onmousemove = function (t) {
                return h.__onmousemove(t)
            }, h._onglobalout = function (t) {
                return h.__onglobalout(t)
            }, this.zr.on(l.EVENT.MOUSEMOVE, h._onmousemove), this.zr.on(l.EVENT.GLOBALOUT, h._onglobalout), h._hide = function (t) {
                return h.__hide(t)
            }, h._tryShow = function (t) {
                return h.__tryShow(t)
            }, h._refixed = function (t) {
                return h.__refixed(t)
            }, h._setContent = function (t, e) {
                return h.__setContent(t, e)
            }, this._tDom = this._tDom || document.createElement("div"), this._tDom.onselectstart = function () {
                return!1
            }, this._tDom.onmouseover = function () {
                h._mousein = !0
            }, this._tDom.onmouseout = function () {
                h._mousein = !1
            }, this._tDom.style.position = "absolute", this.hasAppend = !1, this._axisLineShape && this.zr.delShape(this._axisLineShape.id), this._axisLineShape = new s({zlevel: this._zlevelBase, invisible: !0, hoverable: !1}), this.shapeList.push(this._axisLineShape), this.zr.addShape(this._axisLineShape), this._axisShadowShape && this.zr.delShape(this._axisShadowShape.id), this._axisShadowShape = new s({zlevel: 1, invisible: !0, hoverable: !1}), this.shapeList.push(this._axisShadowShape), this.zr.addShape(this._axisShadowShape), this._axisCrossShape && this.zr.delShape(this._axisCrossShape.id), this._axisCrossShape = new o({zlevel: this._zlevelBase, invisible: !0, hoverable: !1}), this.shapeList.push(this._axisCrossShape), this.zr.addShape(this._axisCrossShape), this.showing = !1, this.refresh(n)
        }

        var i = t("./base"), o = t("../util/shape/Cross"), s = t("zrender/shape/Line"), r = t("zrender/shape/Rectangle"), n = new r({}), a = t("../config"), h = t("../util/ecData"), l = t("zrender/config"), d = t("zrender/tool/event"), c = t("zrender/tool/area"), p = t("zrender/tool/color"), u = t("zrender/tool/util"), g = t("zrender/shape/Base");
        return e.prototype = {type: a.COMPONENT_TYPE_TOOLTIP, _gCssText: "position:absolute;display:block;border-style:solid;white-space:nowrap;", _style: function (t) {
            if (!t)return"";
            var e = [];
            if (t.transitionDuration) {
                var i = "left " + t.transitionDuration + "s,top " + t.transitionDuration + "s";
                e.push("transition:" + i), e.push("-moz-transition:" + i), e.push("-webkit-transition:" + i), e.push("-o-transition:" + i)
            }
            t.backgroundColor && (e.push("background-Color:" + p.toHex(t.backgroundColor)), e.push("filter:alpha(opacity=70)"), e.push("background-Color:" + t.backgroundColor)), null != t.borderWidth && e.push("border-width:" + t.borderWidth + "px"), null != t.borderColor && e.push("border-color:" + t.borderColor), null != t.borderRadius && (e.push("border-radius:" + t.borderRadius + "px"), e.push("-moz-border-radius:" + t.borderRadius + "px"), e.push("-webkit-border-radius:" + t.borderRadius + "px"), e.push("-o-border-radius:" + t.borderRadius + "px"));
            var o = t.textStyle;
            o && (o.color && e.push("color:" + o.color), o.decoration && e.push("text-decoration:" + o.decoration), o.align && e.push("text-align:" + o.align), o.fontFamily && e.push("font-family:" + o.fontFamily), o.fontSize && e.push("font-size:" + o.fontSize + "px"), o.fontSize && e.push("line-height:" + Math.round(3 * o.fontSize / 2) + "px"), o.fontStyle && e.push("font-style:" + o.fontStyle), o.fontWeight && e.push("font-weight:" + o.fontWeight));
            var s = t.padding;
            return null != s && (s = this.reformCssArray(s), e.push("padding:" + s[0] + "px " + s[1] + "px " + s[2] + "px " + s[3] + "px")), e = e.join(";") + ";"
        }, __hide: function () {
            this._lastDataIndex = -1, this._lastSeriesIndex = -1, this._lastItemTriggerId = -1, this._tDom && (this._tDom.style.display = "none");
            var t = !1;
            this._axisLineShape.invisible || (this._axisLineShape.invisible = !0, this.zr.modShape(this._axisLineShape.id), t = !0), this._axisShadowShape.invisible || (this._axisShadowShape.invisible = !0, this.zr.modShape(this._axisShadowShape.id), t = !0), this._axisCrossShape.invisible || (this._axisCrossShape.invisible = !0, this.zr.modShape(this._axisCrossShape.id), t = !0), this._lastTipShape && this._lastTipShape.tipShape.length > 0 && (this.zr.delShape(this._lastTipShape.tipShape), this._lastTipShape = !1, this.shapeList.length = 2), t && this.zr.refresh(), this.showing = !1
        }, _show: function (t, e, i, o) {
            var s = this._tDom.offsetHeight, r = this._tDom.offsetWidth;
            t && ("function" == typeof t && (t = t([e, i])), t instanceof Array && (e = t[0], i = t[1])), e + r > this._zrWidth && (e -= r + 40), i + s > this._zrHeight && (i -= s - 20), 20 > i && (i = 0), this._tDom.style.cssText = this._gCssText + this._defaultCssText + (o ? o : "") + "left:" + e + "px;top:" + i + "px;", (10 > s || 10 > r) && setTimeout(this._refixed, 20), this.showing = !0
        }, __refixed: function () {
            if (this._tDom) {
                var t = "", e = this._tDom.offsetHeight, i = this._tDom.offsetWidth;
                this._tDom.offsetLeft + i > this._zrWidth && (t += "left:" + (this._zrWidth - i - 20) + "px;"), this._tDom.offsetTop + e > this._zrHeight && (t += "top:" + (this._zrHeight - e - 10) + "px;"), "" !== t && (this._tDom.style.cssText += t)
            }
        }, __tryShow: function () {
            var t, e;
            if (this._curTarget) {
                if ("island" === this._curTarget._type && this.option.tooltip.show)return void this._showItemTrigger();
                var i = h.get(this._curTarget, "series"), o = h.get(this._curTarget, "data");
                t = this.deepQuery([o, i, this.option], "tooltip.show"), null != i && null != o && t ? (e = this.deepQuery([o, i, this.option], "tooltip.trigger"), "axis" === e ? this._showAxisTrigger(i.xAxisIndex, i.yAxisIndex, h.get(this._curTarget, "dataIndex")) : this._showItemTrigger()) : (clearTimeout(this._hidingTicket), clearTimeout(this._showingTicket), this._hidingTicket = setTimeout(this._hide, this._hideDelay))
            } else this._findPolarTrigger() || this._findAxisTrigger()
        }, _findAxisTrigger: function () {
            if (!this.component.xAxis || !this.component.yAxis)return void(this._hidingTicket = setTimeout(this._hide, this._hideDelay));
            for (var t, e, i = this.option.series, o = 0, s = i.length; s > o; o++)if ("axis" === this.deepQuery([i[o], this.option], "tooltip.trigger"))return t = i[o].xAxisIndex || 0, e = i[o].yAxisIndex || 0, this.component.xAxis.getAxis(t) && this.component.xAxis.getAxis(t).type === a.COMPONENT_TYPE_AXIS_CATEGORY ? void this._showAxisTrigger(t, e, this._getNearestDataIndex("x", this.component.xAxis.getAxis(t))) : this.component.yAxis.getAxis(e) && this.component.yAxis.getAxis(e).type === a.COMPONENT_TYPE_AXIS_CATEGORY ? void this._showAxisTrigger(t, e, this._getNearestDataIndex("y", this.component.yAxis.getAxis(e))) : void this._showAxisTrigger(t, e, -1);
            "cross" === this.option.tooltip.axisPointer.type && this._showAxisTrigger(-1, -1, -1)
        }, _findPolarTrigger: function () {
            if (!this.component.polar)return!1;
            var t, e = d.getX(this._event), i = d.getY(this._event), o = this.component.polar.getNearestIndex([e, i]);
            return o ? (t = o.valueIndex, o = o.polarIndex) : o = -1, -1 != o ? this._showPolarTrigger(o, t) : !1
        }, _getNearestDataIndex: function (t, e) {
            var i = -1, o = d.getX(this._event), s = d.getY(this._event);
            if ("x" === t) {
                for (var r, n, a = this.component.grid.getXend(), h = e.getCoordByIndex(i); a > h && (n = h, o >= h);)r = h, h = e.getCoordByIndex(++i);
                return 0 >= i ? i = 0 : n - o >= o - r ? i -= 1 : null == e.getNameByIndex(i) && (i -= 1), i
            }
            for (var l, c, p = this.component.grid.getY(), h = e.getCoordByIndex(i); h > p && (l = h, h >= s);)c = h, h = e.getCoordByIndex(++i);
            return 0 >= i ? i = 0 : s - l >= c - s ? i -= 1 : null == e.getNameByIndex(i) && (i -= 1), i
        }, _showAxisTrigger: function (t, e, i) {
            if (!this._event.connectTrigger && this.messageCenter.dispatch(a.EVENT.TOOLTIP_IN_GRID, this._event, null, this.myChart), null == this.component.xAxis || null == this.component.yAxis || null == t || null == e)return clearTimeout(this._hidingTicket), clearTimeout(this._showingTicket), void(this._hidingTicket = setTimeout(this._hide, this._hideDelay));
            var o, s, r, n, h = this.option.series, l = [], c = [], p = "";
            if ("axis" === this.option.tooltip.trigger) {
                if (!this.option.tooltip.show)return;
                s = this.option.tooltip.formatter, r = this.option.tooltip.position
            }
            var u, g, f = -1 != t && this.component.xAxis.getAxis(t).type === a.COMPONENT_TYPE_AXIS_CATEGORY ? "xAxis" : -1 != e && this.component.yAxis.getAxis(e).type === a.COMPONENT_TYPE_AXIS_CATEGORY ? "yAxis" : !1;
            if (f) {
                var m = "xAxis" == f ? t : e;
                o = this.component[f].getAxis(m);
                for (var _ = 0, y = h.length; y > _; _++)this._isSelected(h[_].name) && h[_][f + "Index"] === m && "axis" === this.deepQuery([h[_], this.option], "tooltip.trigger") && (n = this.query(h[_], "tooltip.showContent") || n, s = this.query(h[_], "tooltip.formatter") || s, r = this.query(h[_], "tooltip.position") || r, p += this._style(this.query(h[_], "tooltip")), null != h[_].stack && "xAxis" == f ? (l.unshift(h[_]), c.unshift(_)) : (l.push(h[_]), c.push(_)));
                this.messageCenter.dispatch(a.EVENT.TOOLTIP_HOVER, this._event, {seriesIndex: c, dataIndex: i}, this.myChart);
                var v;
                "xAxis" == f ? (u = this.subPixelOptimize(o.getCoordByIndex(i), this._axisLineWidth), g = d.getY(this._event), v = [u, this.component.grid.getY(), u, this.component.grid.getYend()]) : (u = d.getX(this._event), g = this.subPixelOptimize(o.getCoordByIndex(i), this._axisLineWidth), v = [this.component.grid.getX(), g, this.component.grid.getXend(), g]), this._styleAxisPointer(l, v[0], v[1], v[2], v[3], o.getGap(), u, g)
            } else u = d.getX(this._event), g = d.getY(this._event), this._styleAxisPointer(h, this.component.grid.getX(), g, this.component.grid.getXend(), g, 0, u, g), i >= 0 ? this._showItemTrigger(!0) : (clearTimeout(this._hidingTicket), clearTimeout(this._showingTicket), this._tDom.style.display = "none");
            if (l.length > 0) {
                if (this._lastDataIndex != i || this._lastSeriesIndex != c[0]) {
                    this._lastDataIndex = i, this._lastSeriesIndex = c[0];
                    var x, b;
                    if ("function" == typeof s) {
                        for (var T = [], _ = 0, y = l.length; y > _; _++)x = l[_].data[i], b = null != x ? null != x.value ? x.value : x : "-", T.push({seriesIndex: c[_], seriesName: l[_].name || "", series: l[_], dataIndex: i, data: x, name: o.getNameByIndex(i), value: b, 0: l[_].name || "", 1: o.getNameByIndex(i), 2: b, 3: x});
                        this._curTicket = "axis:" + i, this._tDom.innerHTML = s.call(this.myChart, T, this._curTicket, this._setContent)
                    } else if ("string" == typeof s) {
                        this._curTicket = 0 / 0, s = s.replace("{a}", "{a0}").replace("{b}", "{b0}").replace("{c}", "{c0}");
                        for (var _ = 0, y = l.length; y > _; _++)s = s.replace("{a" + _ + "}", this._encodeHTML(l[_].name || "")), s = s.replace("{b" + _ + "}", this._encodeHTML(o.getNameByIndex(i))), x = l[_].data[i], x = null != x ? null != x.value ? x.value : x : "-", s = s.replace("{c" + _ + "}", x instanceof Array ? x : this.numAddCommas(x));
                        this._tDom.innerHTML = s
                    } else {
                        this._curTicket = 0 / 0, s = this._encodeHTML(o.getNameByIndex(i));
                        for (var _ = 0, y = l.length; y > _; _++)s += "<br/>" + this._encodeHTML(l[_].name || "") + " : ", x = l[_].data[i], x = null != x ? null != x.value ? x.value : x : "-", s += x instanceof Array ? x : this.numAddCommas(x);
                        this._tDom.innerHTML = s
                    }
                }
                if (n === !1 || !this.option.tooltip.showContent)return;
                this.hasAppend || (this._tDom.style.left = this._zrWidth / 2 + "px", this._tDom.style.top = this._zrHeight / 2 + "px", this.dom.firstChild.appendChild(this._tDom), this.hasAppend = !0), this._show(r, u + 10, g + 10, p)
            }
        }, _showPolarTrigger: function (t, e) {
            if (null == this.component.polar || null == t || null == e || 0 > e)return!1;
            var i, o, s, r = this.option.series, n = [], a = [], h = "";
            if ("axis" === this.option.tooltip.trigger) {
                if (!this.option.tooltip.show)return!1;
                i = this.option.tooltip.formatter, o = this.option.tooltip.position
            }
            for (var l = this.option.polar[t].indicator[e].text, c = 0, p = r.length; p > c; c++)this._isSelected(r[c].name) && r[c].polarIndex === t && "axis" === this.deepQuery([r[c], this.option], "tooltip.trigger") && (s = this.query(r[c], "tooltip.showContent") || s, i = this.query(r[c], "tooltip.formatter") || i, o = this.query(r[c], "tooltip.position") || o, h += this._style(this.query(r[c], "tooltip")), n.push(r[c]), a.push(c));
            if (n.length > 0) {
                for (var u, g, f, m = [], c = 0, p = n.length; p > c; c++) {
                    u = n[c].data;
                    for (var _ = 0, y = u.length; y > _; _++)g = u[_], this._isSelected(g.name) && (g = null != g ? g : {name: "", value: {dataIndex: "-"}}, f = null != g.value[e].value ? g.value[e].value : g.value[e], m.push({seriesIndex: a[c], seriesName: n[c].name || "", series: n[c], dataIndex: e, data: g, name: g.name, indicator: l, value: f, 0: n[c].name || "", 1: g.name, 2: f, 3: l}))
                }
                if (m.length <= 0)return;
                if (this._lastDataIndex != e || this._lastSeriesIndex != a[0])if (this._lastDataIndex = e, this._lastSeriesIndex = a[0], "function" == typeof i)this._curTicket = "axis:" + e, this._tDom.innerHTML = i.call(this.myChart, m, this._curTicket, this._setContent); else if ("string" == typeof i) {
                    i = i.replace("{a}", "{a0}").replace("{b}", "{b0}").replace("{c}", "{c0}").replace("{d}", "{d0}");
                    for (var c = 0, p = m.length; p > c; c++)i = i.replace("{a" + c + "}", this._encodeHTML(m[c].seriesName)), i = i.replace("{b" + c + "}", this._encodeHTML(m[c].name)), i = i.replace("{c" + c + "}", this.numAddCommas(m[c].value)), i = i.replace("{d" + c + "}", this._encodeHTML(m[c].indicator));
                    this._tDom.innerHTML = i
                } else {
                    i = this._encodeHTML(m[0].name) + "<br/>" + this._encodeHTML(m[0].indicator) + " : " + this.numAddCommas(m[0].value);
                    for (var c = 1, p = m.length; p > c; c++)i += "<br/>" + this._encodeHTML(m[c].name) + "<br/>", i += this._encodeHTML(m[c].indicator) + " : " + this.numAddCommas(m[c].value);
                    this._tDom.innerHTML = i
                }
                if (s === !1 || !this.option.tooltip.showContent)return;
                return this.hasAppend || (this._tDom.style.left = this._zrWidth / 2 + "px", this._tDom.style.top = this._zrHeight / 2 + "px", this.dom.firstChild.appendChild(this._tDom), this.hasAppend = !0), this._show(o, d.getX(this._event), d.getY(this._event), h), !0
            }
        }, _showItemTrigger: function (t) {
            if (this._curTarget) {
                var e, i, o, s = h.get(this._curTarget, "series"), r = h.get(this._curTarget, "seriesIndex"), n = h.get(this._curTarget, "data"), l = h.get(this._curTarget, "dataIndex"), c = h.get(this._curTarget, "name"), p = h.get(this._curTarget, "value"), u = h.get(this._curTarget, "special"), g = h.get(this._curTarget, "special2"), f = "";
                if ("island" != this._curTarget._type) {
                    var m = t ? "axis" : "item";
                    this.option.tooltip.trigger === m && (e = this.option.tooltip.formatter, i = this.option.tooltip.position), this.query(s, "tooltip.trigger") === m && (o = this.query(s, "tooltip.showContent") || o, e = this.query(s, "tooltip.formatter") || e, i = this.query(s, "tooltip.position") || i, f += this._style(this.query(s, "tooltip"))), o = this.query(n, "tooltip.showContent") || o, e = this.query(n, "tooltip.formatter") || e, i = this.query(n, "tooltip.position") || i, f += this._style(this.query(n, "tooltip"))
                } else this._lastItemTriggerId = 0 / 0, o = this.deepQuery([n, s, this.option], "tooltip.showContent"), e = this.deepQuery([n, s, this.option], "tooltip.islandFormatter"), i = this.deepQuery([n, s, this.option], "tooltip.islandPosition");
                this._lastItemTriggerId !== this._curTarget.id && (this._lastItemTriggerId = this._curTarget.id, "function" == typeof e ? (this._curTicket = (s.name || "") + ":" + l, this._tDom.innerHTML = e.call(this.myChart, {seriesIndex: r, seriesName: s.name || "", series: s, dataIndex: l, data: n, name: c, value: p, percent: u, indicator: u, value2: g, indicator2: g, 0: s.name || "", 1: c, 2: p, 3: u, 4: g, 5: n, 6: r, 7: l}, this._curTicket, this._setContent)) : "string" == typeof e ? (this._curTicket = 0 / 0, e = e.replace("{a}", "{a0}").replace("{b}", "{b0}").replace("{c}", "{c0}"), e = e.replace("{a0}", this._encodeHTML(s.name || "")).replace("{b0}", this._encodeHTML(c)).replace("{c0}", p instanceof Array ? p : this.numAddCommas(p)), e = e.replace("{d}", "{d0}").replace("{d0}", u || ""), e = e.replace("{e}", "{e0}").replace("{e0}", h.get(this._curTarget, "special2") || ""), this._tDom.innerHTML = e) : (this._curTicket = 0 / 0, this._tDom.innerHTML = s.type === a.CHART_TYPE_RADAR && u ? this._itemFormatter.radar.call(this, s, c, p, u) : s.type === a.CHART_TYPE_EVENTRIVER ? this._itemFormatter.eventRiver.call(this, s, c, p, n) : "" + (null != s.name ? this._encodeHTML(s.name) + "<br/>" : "") + ("" === c ? "" : this._encodeHTML(c) + " : ") + (p instanceof Array ? p : this.numAddCommas(p)))), this._axisLineShape.invisible && this._axisShadowShape.invisible || (this._axisLineShape.invisible = !0, this.zr.modShape(this._axisLineShape.id), this._axisShadowShape.invisible = !0, this.zr.modShape(this._axisShadowShape.id), this.zr.refresh()), o !== !1 && this.option.tooltip.showContent && (this.hasAppend || (this._tDom.style.left = this._zrWidth / 2 + "px", this._tDom.style.top = this._zrHeight / 2 + "px", this.dom.firstChild.appendChild(this._tDom), this.hasAppend = !0), this._show(i, d.getX(this._event) + 20, d.getY(this._event) - 20, f))
            }
        }, _itemFormatter: {radar: function (t, e, i, o) {
            var s = "";
            s += this._encodeHTML("" === e ? t.name || "" : e), s += "" === s ? "" : "<br />";
            for (var r = 0; r < o.length; r++)s += this._encodeHTML(o[r].text) + " : " + this.numAddCommas(i[r]) + "<br />";
            return s
        }, chord: function (t, e, i, o, s) {
            if (null == s)return this._encodeHTML(e) + " (" + this.numAddCommas(i) + ")";
            var r = this._encodeHTML(e), n = this._encodeHTML(o);
            return"" + (null != t.name ? this._encodeHTML(t.name) + "<br/>" : "") + r + " -> " + n + " (" + this.numAddCommas(i) + ")<br />" + n + " -> " + r + " (" + this.numAddCommas(s) + ")"
        }, eventRiver: function (t, e, i, o) {
            var s = "";
            s += this._encodeHTML("" === t.name ? "" : t.name + " : "), s += this._encodeHTML(e), s += "" === s ? "" : "<br />", o = o.evolution;
            for (var r = 0, n = o.length; n > r; r++)s += '<div style="padding-top:5px;">', o[r].detail && (o[r].detail.img && (s += '<img src="' + o[r].detail.img + '" style="float:left;width:40px;height:40px;">'), s += '<div style="margin-left:45px;">' + o[r].time + "<br/>", s += '<a href="' + o[r].detail.link + '" target="_blank">', s += o[r].detail.text + "</a></div>", s += "</div>");
            return s
        }}, _styleAxisPointer: function (t, e, i, o, s, r, n, a) {
            if (t.length > 0) {
                var h, l, d = this.option.tooltip.axisPointer, c = d.type, p = {line: {}, cross: {}, shadow: {}};
                for (var u in p)p[u].color = d[u + "Style"].color, p[u].width = d[u + "Style"].width, p[u].type = d[u + "Style"].type;
                for (var g = 0, f = t.length; f > g; g++)"axis" === this.deepQuery([t[g], this.option], "tooltip.trigger") && (h = t[g], l = this.query(h, "tooltip.axisPointer.type"), c = l || c, l && (p[l].color = this.query(h, "tooltip.axisPointer." + l + "Style.color") || p[l].color, p[l].width = this.query(h, "tooltip.axisPointer." + l + "Style.width") || p[l].width, p[l].type = this.query(h, "tooltip.axisPointer." + l + "Style.type") || p[l].type));
                "line" === c ? (this._axisLineShape.style = {xStart: e, yStart: i, xEnd: o, yEnd: s, strokeColor: p.line.color, lineWidth: p.line.width, lineType: p.line.type}, this._axisLineShape.invisible = !1, this.zr.modShape(this._axisLineShape.id)) : "cross" === c ? (this._axisCrossShape.style = {brushType: "stroke", rect: this.component.grid.getArea(), x: n, y: a, text: ("( " + this.component.xAxis.getAxis(0).getValueFromCoord(n) + " , " + this.component.yAxis.getAxis(0).getValueFromCoord(a) + " )").replace("  , ", " ").replace(" ,  ", " "), textPosition: "specific", strokeColor: p.cross.color, lineWidth: p.cross.width, lineType: p.cross.type}, this.component.grid.getXend() - n > 100 ? (this._axisCrossShape.style.textAlign = "left", this._axisCrossShape.style.textX = n + 10) : (this._axisCrossShape.style.textAlign = "right", this._axisCrossShape.style.textX = n - 10), a - this.component.grid.getY() > 50 ? (this._axisCrossShape.style.textBaseline = "bottom", this._axisCrossShape.style.textY = a - 10) : (this._axisCrossShape.style.textBaseline = "top", this._axisCrossShape.style.textY = a + 10), this._axisCrossShape.invisible = !1, this.zr.modShape(this._axisCrossShape.id)) : "shadow" === c && ((null == p.shadow.width || "auto" === p.shadow.width || isNaN(p.shadow.width)) && (p.shadow.width = r), e === o ? Math.abs(this.component.grid.getX() - e) < 2 ? (p.shadow.width /= 2, e = o += p.shadow.width / 2) : Math.abs(this.component.grid.getXend() - e) < 2 && (p.shadow.width /= 2, e = o -= p.shadow.width / 2) : i === s && (Math.abs(this.component.grid.getY() - i) < 2 ? (p.shadow.width /= 2, i = s += p.shadow.width / 2) : Math.abs(this.component.grid.getYend() - i) < 2 && (p.shadow.width /= 2, i = s -= p.shadow.width / 2)), this._axisShadowShape.style = {xStart: e, yStart: i, xEnd: o, yEnd: s, strokeColor: p.shadow.color, lineWidth: p.shadow.width}, this._axisShadowShape.invisible = !1, this.zr.modShape(this._axisShadowShape.id)), this.zr.refresh()
            }
        }, __onmousemove: function (t) {
            if (clearTimeout(this._hidingTicket), clearTimeout(this._showingTicket), !this._mousein || !this._enterable) {
                var e = t.target, i = d.getX(t.event), o = d.getY(t.event);
                if (e) {
                    this._curTarget = e, this._event = t.event, this._event.zrenderX = i, this._event.zrenderY = o;
                    var s;
                    if (this._needAxisTrigger && this.component.polar && -1 != (s = this.component.polar.isInside([i, o])))for (var r = this.option.series, h = 0, l = r.length; l > h; h++)if (r[h].polarIndex === s && "axis" === this.deepQuery([r[h], this.option], "tooltip.trigger")) {
                        this._curTarget = null;
                        break
                    }
                    this._showingTicket = setTimeout(this._tryShow, this._showDelay)
                } else this._curTarget = !1, this._event = t.event, this._event.zrenderX = i, this._event.zrenderY = o, this._needAxisTrigger && this.component.grid && c.isInside(n, this.component.grid.getArea(), i, o) ? this._showingTicket = setTimeout(this._tryShow, this._showDelay) : this._needAxisTrigger && this.component.polar && -1 != this.component.polar.isInside([i, o]) ? this._showingTicket = setTimeout(this._tryShow, this._showDelay) : (!this._event.connectTrigger && this.messageCenter.dispatch(a.EVENT.TOOLTIP_OUT_GRID, this._event, null, this.myChart), this._hidingTicket = setTimeout(this._hide, this._hideDelay))
            }
        }, __onglobalout: function () {
            clearTimeout(this._hidingTicket), clearTimeout(this._showingTicket), this._hidingTicket = setTimeout(this._hide, this._hideDelay)
        }, __setContent: function (t, e) {
            this._tDom && (t === this._curTicket && (this._tDom.innerHTML = e), setTimeout(this._refixed, 20))
        }, ontooltipHover: function (t, e) {
            if (!this._lastTipShape || this._lastTipShape && this._lastTipShape.dataIndex != t.dataIndex) {
                this._lastTipShape && this._lastTipShape.tipShape.length > 0 && (this.zr.delShape(this._lastTipShape.tipShape), this.shapeList.length = 2);
                for (var i = 0, o = e.length; o > i; i++)e[i].zlevel = this._zlevelBase, e[i].style = g.prototype.getHighlightStyle(e[i].style, e[i].highlightStyle), e[i].draggable = !1, e[i].hoverable = !1, e[i].clickable = !1, e[i].ondragend = null, e[i].ondragover = null, e[i].ondrop = null, this.shapeList.push(e[i]), this.zr.addShape(e[i]);
                this._lastTipShape = {dataIndex: t.dataIndex, tipShape: e}
            }
        }, ondragend: function () {
            this._hide()
        }, onlegendSelected: function (t) {
            this._selectedMap = t.selected
        }, _setSelectedMap: function () {
            this._selectedMap = this.component.legend ? u.clone(this.component.legend.getSelectedMap()) : {}
        }, _isSelected: function (t) {
            return null != this._selectedMap[t] ? this._selectedMap[t] : !0
        }, showTip: function (t) {
            if (t) {
                var e, i = this.option.series;
                if (null != t.seriesIndex)e = t.seriesIndex; else for (var o = t.seriesName, s = 0, r = i.length; r > s; s++)if (i[s].name === o) {
                    e = s;
                    break
                }
                var n = i[e];
                if (null != n) {
                    var d = this.myChart.chart[n.type], c = "axis" === this.deepQuery([n, this.option], "tooltip.trigger");
                    if (d)if (c) {
                        var p = t.dataIndex;
                        switch (d.type) {
                            case a.CHART_TYPE_LINE:
                            case a.CHART_TYPE_BAR:
                            case a.CHART_TYPE_K:
                                if (null == this.component.xAxis || null == this.component.yAxis || n.data.length <= p)return;
                                var u = n.xAxisIndex || 0, g = n.yAxisIndex || 0;
                                this._event = this.component.xAxis.getAxis(u).type === a.COMPONENT_TYPE_AXIS_CATEGORY ? {zrenderX: this.component.xAxis.getAxis(u).getCoordByIndex(p), zrenderY: this.component.grid.getY() + (this.component.grid.getYend() - this.component.grid.getY()) / 4} : {zrenderX: this.component.grid.getX() + (this.component.grid.getXend() - this.component.grid.getX()) / 4, zrenderY: this.component.yAxis.getAxis(g).getCoordByIndex(p)}, this._showAxisTrigger(u, g, p);
                                break;
                            case a.CHART_TYPE_RADAR:
                                if (null == this.component.polar || n.data[0].value.length <= p)return;
                                var f = n.polarIndex || 0, m = this.component.polar.getVector(f, p, "max");
                                this._event = {zrenderX: m[0], zrenderY: m[1]}, this._showPolarTrigger(f, p)
                        }
                    } else {
                        var _, y, v = d.shapeList;
                        switch (d.type) {
                            case a.CHART_TYPE_LINE:
                            case a.CHART_TYPE_BAR:
                            case a.CHART_TYPE_K:
                            case a.CHART_TYPE_SCATTER:
                                for (var p = t.dataIndex, s = 0, r = v.length; r > s; s++)if (h.get(v[s], "seriesIndex") == e && h.get(v[s], "dataIndex") == p) {
                                    this._curTarget = v[s], _ = v[s].style.x, y = d.type != a.CHART_TYPE_K ? v[s].style.y : v[s].style.y[0];
                                    break
                                }
                                break;
                            case a.CHART_TYPE_RADAR:
                                for (var p = t.dataIndex, s = 0, r = v.length; r > s; s++)if ("polygon" === v[s].type && h.get(v[s], "seriesIndex") == e && h.get(v[s], "dataIndex") == p) {
                                    this._curTarget = v[s];
                                    var m = this.component.polar.getCenter(n.polarIndex || 0);
                                    _ = m[0], y = m[1];
                                    break
                                }
                                break;
                            case a.CHART_TYPE_PIE:
                                for (var x = t.name, s = 0, r = v.length; r > s; s++)if ("sector" === v[s].type && h.get(v[s], "seriesIndex") == e && h.get(v[s], "name") == x) {
                                    this._curTarget = v[s];
                                    var b = this._curTarget.style, T = (b.startAngle + b.endAngle) / 2 * Math.PI / 180;
                                    _ = this._curTarget.style.x + Math.cos(T) * b.r / 1.5, y = this._curTarget.style.y - Math.sin(T) * b.r / 1.5;
                                    break
                                }
                                break;
                            case a.CHART_TYPE_MAP:
                                for (var x = t.name, S = n.mapType, s = 0, r = v.length; r > s; s++)if ("text" === v[s].type && v[s]._mapType === S && v[s].style._name === x) {
                                    this._curTarget = v[s], _ = this._curTarget.style.x + this._curTarget.position[0], y = this._curTarget.style.y + this._curTarget.position[1];
                                    break
                                }
                                break;
                            case a.CHART_TYPE_CHORD:
                                for (var x = t.name, s = 0, r = v.length; r > s; s++)if ("sector" === v[s].type && h.get(v[s], "name") == x) {
                                    this._curTarget = v[s];
                                    var b = this._curTarget.style, T = (b.startAngle + b.endAngle) / 2 * Math.PI / 180;
                                    return _ = this._curTarget.style.x + Math.cos(T) * (b.r - 2), y = this._curTarget.style.y - Math.sin(T) * (b.r - 2), void this.zr.trigger(l.EVENT.MOUSEMOVE, {zrenderX: _, zrenderY: y})
                                }
                                break;
                            case a.CHART_TYPE_FORCE:
                                for (var x = t.name, s = 0, r = v.length; r > s; s++)if ("circle" === v[s].type && h.get(v[s], "name") == x) {
                                    this._curTarget = v[s], _ = this._curTarget.position[0], y = this._curTarget.position[1];
                                    break
                                }
                        }
                        null != _ && null != y && (this._event = {zrenderX: _, zrenderY: y}, this.zr.addHoverShape(this._curTarget), this.zr.refreshHover(), this._showItemTrigger())
                    }
                }
            }
        }, hideTip: function () {
            this._hide()
        }, refresh: function (t) {
            if (this._zrHeight = this.zr.getHeight(), this._zrWidth = this.zr.getWidth(), this._lastTipShape && this._lastTipShape.tipShape.length > 0 && this.zr.delShape(this._lastTipShape.tipShape), this._lastTipShape = !1, this.shapeList.length = 2, this._lastDataIndex = -1, this._lastSeriesIndex = -1, this._lastItemTriggerId = -1, t) {
                this.option = t, this.option.tooltip = this.reformOption(this.option.tooltip), this.option.tooltip.textStyle = u.merge(this.option.tooltip.textStyle, this.ecTheme.textStyle), this._needAxisTrigger = !1, "axis" === this.option.tooltip.trigger && (this._needAxisTrigger = !0);
                for (var e = this.option.series, i = 0, o = e.length; o > i; i++)if ("axis" === this.query(e[i], "tooltip.trigger")) {
                    this._needAxisTrigger = !0;
                    break
                }
                this._showDelay = this.option.tooltip.showDelay, this._hideDelay = this.option.tooltip.hideDelay, this._defaultCssText = this._style(this.option.tooltip), this._setSelectedMap(), this._axisLineWidth = this.option.tooltip.axisPointer.lineStyle.width, this._enterable = this.option.tooltip.enterable
            }
            if (this.showing) {
                var s = this;
                setTimeout(function () {
                    s.zr.trigger(l.EVENT.MOUSEMOVE, s.zr.handler._event)
                }, 50)
            }
        }, onbeforDispose: function () {
            this._lastTipShape && this._lastTipShape.tipShape.length > 0 && this.zr.delShape(this._lastTipShape.tipShape), clearTimeout(this._hidingTicket), clearTimeout(this._showingTicket), this.zr.un(l.EVENT.MOUSEMOVE, this._onmousemove), this.zr.un(l.EVENT.GLOBALOUT, this._onglobalout), this.hasAppend && this.dom.firstChild.removeChild(this._tDom), this._tDom = null
        }, _encodeHTML: function (t) {
            return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")
        }}, u.inherits(e, i), t("../component").define("tooltip", e), e
    }), i("echarts/component/legend", ["require", "./base", "zrender/shape/Text", "zrender/shape/Rectangle", "zrender/shape/Sector", "../util/shape/Icon", "../util/shape/Candle", "../config", "zrender/tool/util", "zrender/tool/area", "../component"], function (t) {
        function e(t, e, o, s, r) {
            if (!this.query(s, "legend.data"))return void console.error("option.legend.data has not been defined.");
            i.call(this, t, e, o, s, r);
            var n = this;
            n._legendSelected = function (t) {
                n.__legendSelected(t)
            }, n._dispatchHoverLink = function (t) {
                return n.__dispatchHoverLink(t)
            }, this._colorIndex = 0, this._colorMap = {}, this._selectedMap = {}, this._hasDataMap = {}, this.refresh(s)
        }

        var i = t("./base"), o = t("zrender/shape/Text"), s = t("zrender/shape/Rectangle"), r = t("zrender/shape/Sector"), n = t("../util/shape/Icon"), a = t("../util/shape/Candle"), h = t("../config"), l = t("zrender/tool/util"), d = t("zrender/tool/area");
        e.prototype = {type: h.COMPONENT_TYPE_LEGEND, _buildShape: function () {
            if (this.legendOption.show) {
                this._itemGroupLocation = this._getItemGroupLocation(), this._buildBackground(), this._buildItem();
                for (var t = 0, e = this.shapeList.length; e > t; t++)this.zr.addShape(this.shapeList[t])
            }
        }, _buildItem: function () {
            var t, e, i, s, r, a, h, c, p = this.legendOption.data, u = p.length, g = this.legendOption.textStyle, f = this.zr.getWidth(), m = this.zr.getHeight(), _ = this._itemGroupLocation.x, y = this._itemGroupLocation.y, v = this.legendOption.itemWidth, x = this.legendOption.itemHeight, b = this.legendOption.itemGap;
            "vertical" === this.legendOption.orient && "right" === this.legendOption.x && (_ = this._itemGroupLocation.x + this._itemGroupLocation.width - v);
            for (var T = 0; u > T; T++)r = l.merge(p[T].textStyle || {}, g), a = this.getFont(r), t = this._getName(p[T]), h = this._getFormatterName(t), "" !== t ? (e = p[T].icon || this._getSomethingByName(t).type, c = this.getColor(t), "horizontal" === this.legendOption.orient ? 200 > f - _ && v + 5 + d.getTextWidth(h, a) + (T === u - 1 || "" === p[T + 1] ? 0 : b) >= f - _ && (_ = this._itemGroupLocation.x, y += x + b) : 200 > m - y && x + (T === u - 1 || "" === p[T + 1] ? 0 : b) >= m - y && ("right" === this.legendOption.x ? _ -= this._itemGroupLocation.maxWidth + b : _ += this._itemGroupLocation.maxWidth + b, y = this._itemGroupLocation.y), i = this._getItemShapeByType(_, y, v, x, this._selectedMap[t] && this._hasDataMap[t] ? c : "#ccc", e, c), i._name = t, i = new n(i), s = {zlevel: this._zlevelBase, style: {x: _ + v + 5, y: y + x / 2, color: this._selectedMap[t] ? "auto" === r.color ? c : r.color : "#ccc", text: h, textFont: a, textBaseline: "middle"}, highlightStyle: {color: c, brushType: "fill"}, hoverable: !!this.legendOption.selectedMode, clickable: !!this.legendOption.selectedMode}, "vertical" === this.legendOption.orient && "right" === this.legendOption.x && (s.style.x -= v + 10, s.style.textAlign = "right"), s._name = t, s = new o(s), this.legendOption.selectedMode && (i.onclick = s.onclick = this._legendSelected, i.onmouseover = s.onmouseover = this._dispatchHoverLink, i.hoverConnect = s.id, s.hoverConnect = i.id), this.shapeList.push(i), this.shapeList.push(s), "horizontal" === this.legendOption.orient ? _ += v + 5 + d.getTextWidth(h, a) + b : y += x + b) : "horizontal" === this.legendOption.orient ? (_ = this._itemGroupLocation.x, y += x + b) : ("right" === this.legendOption.x ? _ -= this._itemGroupLocation.maxWidth + b : _ += this._itemGroupLocation.maxWidth + b, y = this._itemGroupLocation.y);
            "horizontal" === this.legendOption.orient && "center" === this.legendOption.x && y != this._itemGroupLocation.y && this._mLineOptimize()
        }, _getName: function (t) {
            return"undefined" != typeof t.name ? t.name : t
        }, _getFormatterName: function (t) {
            var e, i = this.legendOption.formatter;
            return e = "function" == typeof i ? i.call(this.myChart, t) : "string" == typeof i ? i.replace("{name}", t) : t
        }, _getFormatterNameFromData: function (t) {
            var e = this._getName(t);
            return this._getFormatterName(e)
        }, _mLineOptimize: function () {
            for (var t = [], e = this._itemGroupLocation.x, i = 2, o = this.shapeList.length; o > i; i++)this.shapeList[i].style.x === e ? t.push((this._itemGroupLocation.width - (this.shapeList[i - 1].style.x + d.getTextWidth(this.shapeList[i - 1].style.text, this.shapeList[i - 1].style.textFont) - e)) / 2) : i === o - 1 && t.push((this._itemGroupLocation.width - (this.shapeList[i].style.x + d.getTextWidth(this.shapeList[i].style.text, this.shapeList[i].style.textFont) - e)) / 2);
            for (var s = -1, i = 1, o = this.shapeList.length; o > i; i++)this.shapeList[i].style.x === e && s++, 0 !== t[s] && (this.shapeList[i].style.x += t[s])
        }, _buildBackground: function () {
            var t = this.reformCssArray(this.legendOption.padding);
            this.shapeList.push(new s({zlevel: this._zlevelBase, hoverable: !1, style: {x: this._itemGroupLocation.x - t[3], y: this._itemGroupLocation.y - t[0], width: this._itemGroupLocation.width + t[3] + t[1], height: this._itemGroupLocation.height + t[0] + t[2], brushType: 0 === this.legendOption.borderWidth ? "fill" : "both", color: this.legendOption.backgroundColor, strokeColor: this.legendOption.borderColor, lineWidth: this.legendOption.borderWidth}}))
        }, _getItemGroupLocation: function () {
            var t = this.legendOption.data, e = t.length, i = this.legendOption.itemGap, o = this.legendOption.itemWidth + 5, s = this.legendOption.itemHeight, r = this.legendOption.textStyle, n = this.getFont(r), a = 0, h = 0, c = this.reformCssArray(this.legendOption.padding), p = this.zr.getWidth() - c[1] - c[3], u = this.zr.getHeight() - c[0] - c[2], g = 0, f = 0;
            if ("horizontal" === this.legendOption.orient) {
                h = s;
                for (var m = 0; e > m; m++)"" !== this._getName(t[m]) ? g += o + d.getTextWidth(this._getFormatterNameFromData(t[m]), t[m].textStyle ? this.getFont(l.merge(t[m].textStyle || {}, r)) : n) + i : (g -= i, g > p ? (a = p, h += s + i) : a = Math.max(a, g), h += s + i, g = 0);
                h = Math.max(h, s), g -= i, g > p ? (a = p, h += s + i) : a = Math.max(a, g)
            } else {
                for (var m = 0; e > m; m++)f = Math.max(f, d.getTextWidth(this._getFormatterNameFromData(t[m]), t[m].textStyle ? this.getFont(l.merge(t[m].textStyle || {}, r)) : n));
                f += o, a = f;
                for (var m = 0; e > m; m++)"" !== this._getName(t[m]) ? g += s + i : (g -= i, g > u ? (h = u, a += f + i) : h = Math.max(h, g), a += f + i, g = 0);
                a = Math.max(a, f), g -= i, g > u ? (h = u, a += f + i) : h = Math.max(h, g)
            }
            p = this.zr.getWidth(), u = this.zr.getHeight();
            var _;
            switch (this.legendOption.x) {
                case"center":
                    _ = Math.floor((p - a) / 2);
                    break;
                case"left":
                    _ = c[3] + this.legendOption.borderWidth;
                    break;
                case"right":
                    _ = p - a - c[1] - c[3] - 2 * this.legendOption.borderWidth;
                    break;
                default:
                    _ = this.parsePercent(this.legendOption.x, p)
            }
            var y;
            switch (this.legendOption.y) {
                case"top":
                    y = c[0] + this.legendOption.borderWidth;
                    break;
                case"bottom":
                    y = u - h - c[0] - c[2] - 2 * this.legendOption.borderWidth;
                    break;
                case"center":
                    y = Math.floor((u - h) / 2);
                    break;
                default:
                    y = this.parsePercent(this.legendOption.y, u)
            }
            return{x: _, y: y, width: a, height: h, maxWidth: f}
        }, _getSomethingByName: function (t) {
            for (var e, i = this.option.series, o = 0, s = i.length; s > o; o++) {
                if (i[o].name === t)return{type: i[o].type, series: i[o], seriesIndex: o, data: null, dataIndex: -1};
                if (i[o].type === h.CHART_TYPE_PIE || i[o].type === h.CHART_TYPE_RADAR || i[o].type === h.CHART_TYPE_CHORD || i[o].type === h.CHART_TYPE_FORCE || i[o].type === h.CHART_TYPE_FUNNEL) {
                    e = i[o].categories || i[o].data || i[o].nodes;
                    for (var r = 0, n = e.length; n > r; r++)if (e[r].name === t)return{type: i[o].type, series: i[o], seriesIndex: o, data: e[r], dataIndex: r}
                }
            }
            return{type: "bar", series: null, seriesIndex: -1, data: null, dataIndex: -1}
        }, _getItemShapeByType: function (t, e, i, o, s, r, n) {
            var a, h = "#ccc" === s ? n : s, l = {zlevel: this._zlevelBase, style: {iconType: "legendicon" + r, x: t, y: e, width: i, height: o, color: s, strokeColor: s, lineWidth: 2}, highlightStyle: {color: h, strokeColor: h, lineWidth: 1}, hoverable: this.legendOption.selectedMode, clickable: this.legendOption.selectedMode};
            if (r.match("image")) {
                var a = r.replace(new RegExp("^image:\\/\\/"), "");
                r = "image"
            }
            switch (r) {
                case"line":
                    l.style.brushType = "stroke", l.highlightStyle.lineWidth = 3;
                    break;
                case"radar":
                case"scatter":
                    l.highlightStyle.lineWidth = 3;
                    break;
                case"k":
                    l.style.brushType = "both", l.highlightStyle.lineWidth = 3, l.highlightStyle.color = l.style.color = this.query(this.ecTheme, "k.itemStyle.normal.color") || "#fff", l.style.strokeColor = "#ccc" != s ? this.query(this.ecTheme, "k.itemStyle.normal.lineStyle.color") || "#ff3200" : s;
                    break;
                case"image":
                    l.style.iconType = "image", l.style.image = a, "#ccc" === s && (l.style.opacity = .5)
            }
            return l
        }, __legendSelected: function (t) {
            var e = t.target._name;
            if ("single" === this.legendOption.selectedMode)for (var i in this._selectedMap)this._selectedMap[i] = !1;
            this._selectedMap[e] = !this._selectedMap[e], this.messageCenter.dispatch(h.EVENT.LEGEND_SELECTED, t.event, {selected: this._selectedMap, target: e}, this.myChart)
        }, __dispatchHoverLink: function (t) {
            this.messageCenter.dispatch(h.EVENT.LEGEND_HOVERLINK, t.event, {target: t.target._name}, this.myChart)
        }, refresh: function (t) {
            if (t) {
                this.option = t || this.option, this.option.legend = this.reformOption(this.option.legend), this.legendOption = this.option.legend;
                var e, i, o, s, r = this.legendOption.data || [];
                if (this.legendOption.selected)for (var n in this.legendOption.selected)this._selectedMap[n] = "undefined" != typeof this._selectedMap[n] ? this._selectedMap[n] : this.legendOption.selected[n];
                for (var a = 0, l = r.length; l > a; a++)e = this._getName(r[a]), "" !== e && (i = this._getSomethingByName(e), i.series ? (this._hasDataMap[e] = !0, s = !i.data || i.type !== h.CHART_TYPE_PIE && i.type !== h.CHART_TYPE_FORCE && i.type !== h.CHART_TYPE_FUNNEL ? [i.series] : [i.data, i.series], o = this.getItemStyleColor(this.deepQuery(s, "itemStyle.normal.color"), i.seriesIndex, i.dataIndex, i.data), o && i.type != h.CHART_TYPE_K && this.setColor(e, o), this._selectedMap[e] = null != this._selectedMap[e] ? this._selectedMap[e] : !0) : this._hasDataMap[e] = !1)
            }
            this.clear(), this._buildShape()
        }, getRelatedAmount: function (t) {
            for (var e, i = 0, o = this.option.series, s = 0, r = o.length; r > s; s++)if (o[s].name === t && i++, o[s].type === h.CHART_TYPE_PIE || o[s].type === h.CHART_TYPE_RADAR || o[s].type === h.CHART_TYPE_CHORD || o[s].type === h.CHART_TYPE_FORCE || o[s].type === h.CHART_TYPE_FUNNEL) {
                e = o[s].type != h.CHART_TYPE_FORCE ? o[s].data : o[s].categories;
                for (var n = 0, a = e.length; a > n; n++)e[n].name === t && "-" != e[n].value && i++
            }
            return i
        }, setColor: function (t, e) {
            this._colorMap[t] = e
        }, getColor: function (t) {
            return this._colorMap[t] || (this._colorMap[t] = this.zr.getColor(this._colorIndex++)), this._colorMap[t]
        }, hasColor: function (t) {
            return this._colorMap[t] ? this._colorMap[t] : !1
        }, add: function (t, e) {
            for (var i = this.legendOption.data, o = 0, s = i.length; s > o; o++)if (this._getName(i[o]) === t)return;
            this.legendOption.data.push(t), this.setColor(t, e), this._selectedMap[t] = !0, this._hasDataMap[t] = !0
        }, del: function (t) {
            for (var e = this.legendOption.data, i = 0, o = e.length; o > i; i++)if (this._getName(e[i]) === t)return this.legendOption.data.splice(i, 1)
        }, getItemShape: function (t) {
            if (null != t)for (var e, i = 0, o = this.shapeList.length; o > i; i++)if (e = this.shapeList[i], e._name === t && "text" != e.type)return e
        }, setItemShape: function (t, e) {
            for (var i, o = 0, s = this.shapeList.length; s > o; o++)i = this.shapeList[o], i._name === t && "text" != i.type && (this._selectedMap[t] || (e.style.color = "#ccc", e.style.strokeColor = "#ccc"), this.zr.modShape(i.id, e))
        }, isSelected: function (t) {
            return"undefined" != typeof this._selectedMap[t] ? this._selectedMap[t] : !0
        }, getSelectedMap: function () {
            return this._selectedMap
        }, setSelected: function (t, e) {
            if ("single" === this.legendOption.selectedMode)for (var i in this._selectedMap)this._selectedMap[i] = !1;
            this._selectedMap[t] = e, this.messageCenter.dispatch(h.EVENT.LEGEND_SELECTED, null, {selected: this._selectedMap, target: t}, this.myChart)
        }, onlegendSelected: function (t, e) {
            var i = t.selected;
            for (var o in i)this._selectedMap[o] != i[o] && (e.needRefresh = !0), this._selectedMap[o] = i[o]
        }};
        var c = {line: function (t, e) {
            var i = e.height / 2;
            t.moveTo(e.x, e.y + i), t.lineTo(e.x + e.width, e.y + i)
        }, pie: function (t, e) {
            var i = e.x, o = e.y, s = e.width, n = e.height;
            r.prototype.buildPath(t, {x: i + s / 2, y: o + n + 2, r: n + 2, r0: 6, startAngle: 45, endAngle: 135})
        }, eventRiver: function (t, e) {
            var i = e.x, o = e.y, s = e.width, r = e.height;
            t.moveTo(i, o + r), t.bezierCurveTo(i + s, o + r, i, o + 4, i + s, o + 4), t.lineTo(i + s, o), t.bezierCurveTo(i, o, i + s, o + r - 4, i, o + r - 4), t.lineTo(i, o + r)
        }, k: function (t, e) {
            var i = e.x, o = e.y, s = e.width, r = e.height;
            a.prototype.buildPath(t, {x: i + s / 2, y: [o + 1, o + 1, o + r - 6, o + r], width: s - 6})
        }, bar: function (t, e) {
            var i = e.x, o = e.y + 1, s = e.width, r = e.height - 2, n = 3;
            t.moveTo(i + n, o), t.lineTo(i + s - n, o), t.quadraticCurveTo(i + s, o, i + s, o + n), t.lineTo(i + s, o + r - n), t.quadraticCurveTo(i + s, o + r, i + s - n, o + r), t.lineTo(i + n, o + r), t.quadraticCurveTo(i, o + r, i, o + r - n), t.lineTo(i, o + n), t.quadraticCurveTo(i, o, i + n, o)
        }, force: function (t, e) {
            n.prototype.iconLibrary.circle(t, e)
        }, radar: function (t, e) {
            var i = 6, o = e.x + e.width / 2, s = e.y + e.height / 2, r = e.height / 2, n = 2 * Math.PI / i, a = -Math.PI / 2, h = o + r * Math.cos(a), l = s + r * Math.sin(a);
            t.moveTo(h, l), a += n;
            for (var d = 0, c = i - 1; c > d; d++)t.lineTo(o + r * Math.cos(a), s + r * Math.sin(a)), a += n;
            t.lineTo(h, l)
        }};
        c.chord = c.pie, c.map = c.bar;
        for (var p in c)n.prototype.iconLibrary["legendicon" + p] = c[p];
        return l.inherits(e, i), t("../component").define("legend", e), e
    }), i("echarts/util/ecData", [], function () {
        function t(t, e, i, o, s, r, n, a) {
            var h;
            return"undefined" != typeof o && (h = null == o.value ? o : o.value), t._echartsData = {_series: e, _seriesIndex: i, _data: o, _dataIndex: s, _name: r, _value: h, _special: n, _special2: a}, t._echartsData
        }

        function e(t, e) {
            var i = t._echartsData;
            if (!e)return i;
            switch (e) {
                case"series":
                case"seriesIndex":
                case"data":
                case"dataIndex":
                case"name":
                case"value":
                case"special":
                case"special2":
                    return i && i["_" + e]
            }
            return null
        }

        function i(t, e, i) {
            switch (t._echartsData = t._echartsData || {}, e) {
                case"series":
                case"seriesIndex":
                case"data":
                case"dataIndex":
                case"name":
                case"value":
                case"special":
                case"special2":
                    t._echartsData["_" + e] = i
            }
        }

        function o(t, e) {
            e._echartsData = {_series: t._echartsData._series, _seriesIndex: t._echartsData._seriesIndex, _data: t._echartsData._data, _dataIndex: t._echartsData._dataIndex, _name: t._echartsData._name, _value: t._echartsData._value, _special: t._echartsData._special, _special2: t._echartsData._special2}
        }

        return{pack: t, set: i, get: e, clone: o}
    }), i("echarts/chart", [], function () {
        var t = {}, e = {};
        return t.define = function (i, o) {
            return e[i] = o, t
        }, t.get = function (t) {
            return e[t]
        }, t
    }), i("zrender/tool/color", ["require", "../tool/util"], function (t) {
        function e(t) {
            W = t
        }

        function i() {
            W = X
        }

        function o(t, e) {
            return t = 0 | t, e = e || W, e[t % e.length]
        }

        function s(t) {
            G = t
        }

        function r() {
            q = G
        }

        function n() {
            return G
        }

        function a(t, e, i, o, s, r, n) {
            F || (F = Y.getContext());
            for (var a = F.createRadialGradient(t, e, i, o, s, r), h = 0, l = n.length; l > h; h++)a.addColorStop(n[h][0], n[h][1]);
            return a.__nonRecursion = !0, a
        }

        function h(t, e, i, o, s) {
            F || (F = Y.getContext());
            for (var r = F.createLinearGradient(t, e, i, o), n = 0, a = s.length; a > n; n++)r.addColorStop(s[n][0], s[n][1]);
            return r.__nonRecursion = !0, r
        }

        function l(t, e, i) {
            t = g(t), e = g(e), t = M(t), e = M(e);
            for (var o = [], s = (e[0] - t[0]) / i, r = (e[1] - t[1]) / i, n = (e[2] - t[2]) / i, a = (e[3] - t[3]) / i, h = 0, l = t[0], d = t[1], p = t[2], u = t[3]; i > h; h++)o[h] = c([P(Math.floor(l), [0, 255]), P(Math.floor(d), [0, 255]), P(Math.floor(p), [0, 255]), u.toFixed(4) - 0], "rgba"), l += s, d += r, p += n, u += a;
            return l = e[0], d = e[1], p = e[2], u = e[3], o[h] = c([l, d, p, u], "rgba"), o
        }

        function d(t, e) {
            var i = [], o = t.length;
            if (void 0 === e && (e = 20), 1 === o)i = l(t[0], t[0], e); else if (o > 1)for (var s = 0, r = o - 1; r > s; s++) {
                var n = l(t[s], t[s + 1], e);
                r - 1 > s && n.pop(), i = i.concat(n)
            }
            return i
        }

        function c(t, e) {
            if (e = e || "rgb", t && (3 === t.length || 4 === t.length)) {
                if (t = I(t, function (t) {
                    return t > 1 ? Math.ceil(t) : t
                }), e.indexOf("hex") > -1)return"#" + ((1 << 24) + (t[0] << 16) + (t[1] << 8) + +t[2]).toString(16).slice(1);
                if (e.indexOf("hs") > -1) {
                    var i = I(t.slice(1, 3), function (t) {
                        return t + "%"
                    });
                    t[1] = i[0], t[2] = i[1]
                }
                return e.indexOf("a") > -1 ? (3 === t.length && t.push(1), t[3] = P(t[3], [0, 1]), e + "(" + t.slice(0, 4).join(",") + ")") : e + "(" + t.slice(0, 3).join(",") + ")"
            }
        }

        function p(t) {
            t = C(t), t.indexOf("rgba") < 0 && (t = g(t));
            var e = [], i = 0;
            return t.replace(/[\d.]+/g, function (t) {
                t = 3 > i ? 0 | t : +t, e[i++] = t
            }), e
        }

        function u(t, e) {
            if (!O(t))return t;
            var i = M(t), o = i[3];
            return"undefined" == typeof o && (o = 1), t.indexOf("hsb") > -1 ? i = R(i) : t.indexOf("hsl") > -1 && (i = D(i)), e.indexOf("hsb") > -1 || e.indexOf("hsv") > -1 ? i = N(i) : e.indexOf("hsl") > -1 && (i = B(i)), i[3] = o, c(i, e)
        }

        function g(t) {
            return u(t, "rgba")
        }

        function f(t) {
            return u(t, "rgb")
        }

        function m(t) {
            return u(t, "hex")
        }

        function _(t) {
            return u(t, "hsva")
        }

        function y(t) {
            return u(t, "hsv")
        }

        function v(t) {
            return u(t, "hsba")
        }

        function x(t) {
            return u(t, "hsb")
        }

        function b(t) {
            return u(t, "hsla")
        }

        function T(t) {
            return u(t, "hsl")
        }

        function S(t) {
            for (var e in Z)if (m(Z[e]) === m(t))return e;
            return null
        }

        function C(t) {
            return String(t).replace(/\s+/g, "")
        }

        function z(t) {
            if (Z[t] && (t = Z[t]), t = C(t), t = t.replace(/hsv/i, "hsb"), /^#[\da-f]{3}$/i.test(t)) {
                t = parseInt(t.slice(1), 16);
                var e = (3840 & t) << 8, i = (240 & t) << 4, o = 15 & t;
                t = "#" + ((1 << 24) + (e << 4) + e + (i << 4) + i + (o << 4) + o).toString(16).slice(1)
            }
            return t
        }

        function w(t, e) {
            if (!O(t))return t;
            var i = e > 0 ? 1 : -1;
            "undefined" == typeof e && (e = 0), e = Math.abs(e) > 1 ? 1 : Math.abs(e), t = f(t);
            for (var o = M(t), s = 0; 3 > s; s++)o[s] = 1 === i ? o[s] * (1 - e) | 0 : (255 - o[s]) * e + o[s] | 0;
            return"rgb(" + o.join(",") + ")"
        }

        function E(t) {
            if (!O(t))return t;
            var e = M(g(t));
            return e = I(e, function (t) {
                return 255 - t
            }), c(e, "rgb")
        }

        function L(t, e, i) {
            if (!O(t) || !O(e))return t;
            "undefined" == typeof i && (i = .5), i = 1 - P(i, [0, 1]);
            for (var o = 2 * i - 1, s = M(g(t)), r = M(g(e)), n = s[3] - r[3], a = ((o * n === -1 ? o : (o + n) / (1 + o * n)) + 1) / 2, h = 1 - a, l = [], d = 0; 3 > d; d++)l[d] = s[d] * a + r[d] * h;
            var p = s[3] * i + r[3] * (1 - i);
            return p = Math.max(0, Math.min(1, p)), 1 === s[3] && 1 === r[3] ? c(l, "rgb") : (l[3] = p, c(l, "rgba"))
        }

        function A() {
            return"#" + (Math.random().toString(16) + "0000").slice(2, 8)
        }

        function M(t) {
            t = z(t);
            var e = t.match(V);
            if (null === e)throw new Error("The color format error");
            var i, o, s, r = [];
            if (e[2])i = e[2].replace("#", "").split(""), s = [i[0] + i[1], i[2] + i[3], i[4] + i[5]], r = I(s, function (t) {
                return P(parseInt(t, 16), [0, 255])
            }); else if (e[4]) {
                var n = e[4].split(",");
                o = n[3], s = n.slice(0, 3), r = I(s, function (t) {
                    return t = Math.floor(t.indexOf("%") > 0 ? 2.55 * parseInt(t, 0) : t), P(t, [0, 255])
                }), "undefined" != typeof o && r.push(P(parseFloat(o), [0, 1]))
            } else if (e[5] || e[6]) {
                var a = (e[5] || e[6]).split(","), h = parseInt(a[0], 0) / 360, l = a[1], d = a[2];
                o = a[3], r = I([l, d], function (t) {
                    return P(parseFloat(t) / 100, [0, 1])
                }), r.unshift(h), "undefined" != typeof o && r.push(P(parseFloat(o), [0, 1]))
            }
            return r
        }

        function k(t, e) {
            if (!O(t))return t;
            null === e && (e = 1);
            var i = M(g(t));
            return i[3] = P(Number(e).toFixed(4), [0, 1]), c(i, "rgba")
        }

        function I(t, e) {
            if ("function" != typeof e)throw new TypeError;
            for (var i = t ? t.length : 0, o = 0; i > o; o++)t[o] = e(t[o]);
            return t
        }

        function P(t, e) {
            return t <= e[0] ? t = e[0] : t >= e[1] && (t = e[1]), t
        }

        function O(t) {
            return t instanceof Array || "string" == typeof t
        }

        function R(t) {
            var e, i, o, s = t[0], r = t[1], n = t[2];
            if (0 === r)e = 255 * n, i = 255 * n, o = 255 * n; else {
                var a = 6 * s;
                6 === a && (a = 0);
                var h = 0 | a, l = n * (1 - r), d = n * (1 - r * (a - h)), c = n * (1 - r * (1 - (a - h))), p = 0, u = 0, g = 0;
                0 === h ? (p = n, u = c, g = l) : 1 === h ? (p = d, u = n, g = l) : 2 === h ? (p = l, u = n, g = c) : 3 === h ? (p = l, u = d, g = n) : 4 === h ? (p = c, u = l, g = n) : (p = n, u = l, g = d), e = 255 * p, i = 255 * u, o = 255 * g
            }
            return[e, i, o]
        }

        function D(t) {
            var e, i, o, s = t[0], r = t[1], n = t[2];
            if (0 === r)e = 255 * n, i = 255 * n, o = 255 * n; else {
                var a;
                a = .5 > n ? n * (1 + r) : n + r - r * n;
                var h = 2 * n - a;
                e = 255 * H(h, a, s + 1 / 3), i = 255 * H(h, a, s), o = 255 * H(h, a, s - 1 / 3)
            }
            return[e, i, o]
        }

        function H(t, e, i) {
            return 0 > i && (i += 1), i > 1 && (i -= 1), 1 > 6 * i ? t + 6 * (e - t) * i : 1 > 2 * i ? e : 2 > 3 * i ? t + (e - t) * (2 / 3 - i) * 6 : t
        }

        function N(t) {
            var e, i, o = t[0] / 255, s = t[1] / 255, r = t[2] / 255, n = Math.min(o, s, r), a = Math.max(o, s, r), h = a - n, l = a;
            if (0 === h)e = 0, i = 0; else {
                i = h / a;
                var d = ((a - o) / 6 + h / 2) / h, c = ((a - s) / 6 + h / 2) / h, p = ((a - r) / 6 + h / 2) / h;
                o === a ? e = p - c : s === a ? e = 1 / 3 + d - p : r === a && (e = 2 / 3 + c - d), 0 > e && (e += 1), e > 1 && (e -= 1)
            }
            return e = 360 * e, i = 100 * i, l = 100 * l, [e, i, l]
        }

        function B(t) {
            var e, i, o = t[0] / 255, s = t[1] / 255, r = t[2] / 255, n = Math.min(o, s, r), a = Math.max(o, s, r), h = a - n, l = (a + n) / 2;
            if (0 === h)e = 0, i = 0; else {
                i = .5 > l ? h / (a + n) : h / (2 - a - n);
                var d = ((a - o) / 6 + h / 2) / h, c = ((a - s) / 6 + h / 2) / h, p = ((a - r) / 6 + h / 2) / h;
                o === a ? e = p - c : s === a ? e = 1 / 3 + d - p : r === a && (e = 2 / 3 + c - d), 0 > e && (e += 1), e > 1 && (e -= 1)
            }
            return e = 360 * e, i = 100 * i, l = 100 * l, [e, i, l]
        }

        var F, Y = t("../tool/util"), W = ["#ff9277", " #dddd00", " #ffc877", " #bbe3ff", " #d5ffbb", "#bbbbff", " #ddb000", " #b0dd00", " #e2bbff", " #ffbbe3", "#ff7777", " #ff9900", " #83dd00", " #77e3ff", " #778fff", "#c877ff", " #ff77ab", " #ff6600", " #aa8800", " #77c7ff", "#ad77ff", " #ff77ff", " #dd0083", " #777700", " #00aa00", "#0088aa", " #8400dd", " #aa0088", " #dd0000", " #772e00"], X = W, G = "rgba(255,255,0,0.5)", q = G, V = /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i, Z = {aliceblue: "#f0f8ff", antiquewhite: "#faebd7", aqua: "#0ff", aquamarine: "#7fffd4", azure: "#f0ffff", beige: "#f5f5dc", bisque: "#ffe4c4", black: "#000", blanchedalmond: "#ffebcd", blue: "#00f", blueviolet: "#8a2be2", brown: "#a52a2a", burlywood: "#deb887", cadetblue: "#5f9ea0", chartreuse: "#7fff00", chocolate: "#d2691e", coral: "#ff7f50", cornflowerblue: "#6495ed", cornsilk: "#fff8dc", crimson: "#dc143c", cyan: "#0ff", darkblue: "#00008b", darkcyan: "#008b8b", darkgoldenrod: "#b8860b", darkgray: "#a9a9a9", darkgrey: "#a9a9a9", darkgreen: "#006400", darkkhaki: "#bdb76b", darkmagenta: "#8b008b", darkolivegreen: "#556b2f", darkorange: "#ff8c00", darkorchid: "#9932cc", darkred: "#8b0000", darksalmon: "#e9967a", darkseagreen: "#8fbc8f", darkslateblue: "#483d8b", darkslategray: "#2f4f4f", darkslategrey: "#2f4f4f", darkturquoise: "#00ced1", darkviolet: "#9400d3", deeppink: "#ff1493", deepskyblue: "#00bfff", dimgray: "#696969", dimgrey: "#696969", dodgerblue: "#1e90ff", firebrick: "#b22222", floralwhite: "#fffaf0", forestgreen: "#228b22", fuchsia: "#f0f", gainsboro: "#dcdcdc", ghostwhite: "#f8f8ff", gold: "#ffd700", goldenrod: "#daa520", gray: "#808080", grey: "#808080", green: "#008000", greenyellow: "#adff2f", honeydew: "#f0fff0", hotpink: "#ff69b4", indianred: "#cd5c5c", indigo: "#4b0082", ivory: "#fffff0", khaki: "#f0e68c", lavender: "#e6e6fa", lavenderblush: "#fff0f5", lawngreen: "#7cfc00", lemonchiffon: "#fffacd", lightblue: "#add8e6", lightcoral: "#f08080", lightcyan: "#e0ffff", lightgoldenrodyellow: "#fafad2", lightgray: "#d3d3d3", lightgrey: "#d3d3d3", lightgreen: "#90ee90", lightpink: "#ffb6c1", lightsalmon: "#ffa07a", lightseagreen: "#20b2aa", lightskyblue: "#87cefa", lightslategray: "#789", lightslategrey: "#789", lightsteelblue: "#b0c4de", lightyellow: "#ffffe0", lime: "#0f0", limegreen: "#32cd32", linen: "#faf0e6", magenta: "#f0f", maroon: "#800000", mediumaquamarine: "#66cdaa", mediumblue: "#0000cd", mediumorchid: "#ba55d3", mediumpurple: "#9370d8", mediumseagreen: "#3cb371", mediumslateblue: "#7b68ee", mediumspringgreen: "#00fa9a", mediumturquoise: "#48d1cc", mediumvioletred: "#c71585", midnightblue: "#191970", mintcream: "#f5fffa", mistyrose: "#ffe4e1", moccasin: "#ffe4b5", navajowhite: "#ffdead", navy: "#000080", oldlace: "#fdf5e6", olive: "#808000", olivedrab: "#6b8e23", orange: "#ffa500", orangered: "#ff4500", orchid: "#da70d6", palegoldenrod: "#eee8aa", palegreen: "#98fb98", paleturquoise: "#afeeee", palevioletred: "#d87093", papayawhip: "#ffefd5", peachpuff: "#ffdab9", peru: "#cd853f", pink: "#ffc0cb", plum: "#dda0dd", powderblue: "#b0e0e6", purple: "#800080", red: "#f00", rosybrown: "#bc8f8f", royalblue: "#4169e1", saddlebrown: "#8b4513", salmon: "#fa8072", sandybrown: "#f4a460", seagreen: "#2e8b57", seashell: "#fff5ee", sienna: "#a0522d", silver: "#c0c0c0", skyblue: "#87ceeb", slateblue: "#6a5acd", slategray: "#708090", slategrey: "#708090", snow: "#fffafa", springgreen: "#00ff7f", steelblue: "#4682b4", tan: "#d2b48c", teal: "#008080", thistle: "#d8bfd8", tomato: "#ff6347", turquoise: "#40e0d0", violet: "#ee82ee", wheat: "#f5deb3", white: "#fff", whitesmoke: "#f5f5f5", yellow: "#ff0", yellowgreen: "#9acd32"};
        return{customPalette: e, resetPalette: i, getColor: o, getHighlightColor: n, customHighlight: s, resetHighlight: r, getRadialGradient: a, getLinearGradient: h, getGradientColors: d, getStepColors: l, reverse: E, mix: L, lift: w, trim: C, random: A, toRGB: f, toRGBA: g, toHex: m, toHSL: T, toHSLA: b, toHSB: x, toHSBA: v, toHSV: y, toHSVA: _, toName: S, toColor: c, toArray: p, alpha: k, getData: M}
    }), i("echarts/component/timeline", ["require", "./base", "zrender/shape/Rectangle", "../util/shape/Icon", "../util/shape/Chain", "../config", "zrender/tool/util", "zrender/tool/area", "zrender/tool/event", "../component"], function (t) {
        function e(t, e, i, s, r) {
            o.call(this, t, e, i, s, r);
            var n = this;
            if (n._onclick = function (t) {
                return n.__onclick(t)
            }, n._ondrift = function (t, e) {
                return n.__ondrift(this, t, e)
            }, n._ondragend = function () {
                return n.__ondragend()
            }, n._setCurrentOption = function () {
                var t = n.timelineOption;
                n.currentIndex %= t.data.length;
                var e = n.options[n.currentIndex] || {};
                n.myChart.setOption(e, t.notMerge), n.messageCenter.dispatch(a.EVENT.TIMELINE_CHANGED, null, {currentIndex: n.currentIndex, data: null != t.data[n.currentIndex].name ? t.data[n.currentIndex].name : t.data[n.currentIndex]}, n.myChart)
            }, n._onFrame = function () {
                n._setCurrentOption(), n._syncHandleShape(), n.timelineOption.autoPlay && (n.playTicket = setTimeout(function () {
                    return n.currentIndex += 1, !n.timelineOption.loop && n.currentIndex >= n.timelineOption.data.length ? (n.currentIndex = n.timelineOption.data.length - 1, void n.stop()) : void n._onFrame()
                }, n.timelineOption.playInterval))
            }, this.setTheme(!1), this.options = this.option.options, this.currentIndex = this.timelineOption.currentIndex % this.timelineOption.data.length, this.timelineOption.notMerge || 0 === this.currentIndex || (this.options[this.currentIndex] = h.merge(this.options[this.currentIndex], this.options[0])), this.timelineOption.show && (this._buildShape(), this._syncHandleShape()), this._setCurrentOption(), this.timelineOption.autoPlay) {
                var n = this;
                this.playTicket = setTimeout(function () {
                    n.play()
                }, this.ecTheme.animationDuration)
            }
        }

        function i(t, e) {
            var i = 2, o = e.x + i, s = e.y + i + 2, n = e.width - i, a = e.height - i, h = e.symbol;
            if ("last" === h)t.moveTo(o + n - 2, s + a / 3), t.lineTo(o + n - 2, s), t.lineTo(o + 2, s + a / 2), t.lineTo(o + n - 2, s + a), t.lineTo(o + n - 2, s + a / 3 * 2), t.moveTo(o, s), t.lineTo(o, s); else if ("next" === h)t.moveTo(o + 2, s + a / 3), t.lineTo(o + 2, s), t.lineTo(o + n - 2, s + a / 2), t.lineTo(o + 2, s + a), t.lineTo(o + 2, s + a / 3 * 2), t.moveTo(o, s), t.lineTo(o, s); else if ("play" === h)if ("stop" === e.status)t.moveTo(o + 2, s), t.lineTo(o + n - 2, s + a / 2), t.lineTo(o + 2, s + a), t.lineTo(o + 2, s); else {
                var l = "both" === e.brushType ? 2 : 3;
                t.rect(o + 2, s, l, a), t.rect(o + n - l - 2, s, l, a)
            } else if (h.match("image")) {
                var d = "";
                d = h.replace(new RegExp("^image:\\/\\/"), ""), h = r.prototype.iconLibrary.image, h(t, {x: o, y: s, width: n, height: a, image: d})
            }
        }

        var o = t("./base"), s = t("zrender/shape/Rectangle"), r = t("../util/shape/Icon"), n = t("../util/shape/Chain"), a = t("../config"), h = t("zrender/tool/util"), l = t("zrender/tool/area"), d = t("zrender/tool/event");
        return e.prototype = {type: a.COMPONENT_TYPE_TIMELINE, _buildShape: function () {
            if (this._location = this._getLocation(), this._buildBackground(), this._buildControl(), this._chainPoint = this._getChainPoint(), this.timelineOption.label.show)for (var t = this._getInterval(), e = 0, i = this._chainPoint.length; i > e; e += t)this._chainPoint[e].showLabel = !0;
            this._buildChain(), this._buildHandle();
            for (var e = 0, o = this.shapeList.length; o > e; e++)this.zr.addShape(this.shapeList[e])
        }, _getLocation: function () {
            var t, e = this.timelineOption, i = this.reformCssArray(this.timelineOption.padding), o = this.zr.getWidth(), s = this.parsePercent(e.x, o), r = this.parsePercent(e.x2, o);
            null == e.width ? (t = o - s - r, r = o - r) : (t = this.parsePercent(e.width, o), r = s + t);
            var n, a, h = this.zr.getHeight(), l = this.parsePercent(e.height, h);
            return null != e.y ? (n = this.parsePercent(e.y, h), a = n + l) : (a = h - this.parsePercent(e.y2, h), n = a - l), {x: s + i[3], y: n + i[0], x2: r - i[1], y2: a - i[2], width: t - i[1] - i[3], height: l - i[0] - i[2]}
        }, _getReformedLabel: function (t) {
            var e = this.timelineOption, i = null != e.data[t].name ? e.data[t].name : e.data[t], o = e.data[t].formatter || e.label.formatter;
            return o && ("function" == typeof o ? i = o.call(this.myChart, i) : "string" == typeof o && (i = o.replace("{value}", i))), i
        }, _getInterval: function () {
            var t = this._chainPoint, e = this.timelineOption, i = e.label.interval;
            if ("auto" === i) {
                var o = e.label.textStyle.fontSize, s = e.data, r = e.data.length;
                if (r > 3) {
                    var n, a, h = !1;
                    for (i = 0; !h && r > i;) {
                        i++, h = !0;
                        for (var d = i; r > d; d += i) {
                            if (n = t[d].x - t[d - i].x, 0 !== e.label.rotate)a = o; else if (s[d].textStyle)a = l.getTextWidth(t[d].name, t[d].textFont); else {
                                var c = t[d].name + "", p = (c.match(/\w/g) || "").length, u = c.length - p;
                                a = p * o * 2 / 3 + u * o
                            }
                            if (a > n) {
                                h = !1;
                                break
                            }
                        }
                    }
                } else i = 1
            } else i = i - 0 + 1;
            return i
        }, _getChainPoint: function () {
            function t(t) {
                return null != l[t].name ? l[t].name : l[t] + ""
            }

            var e, i = this.timelineOption, o = i.symbol.toLowerCase(), s = i.symbolSize, r = i.label.rotate, n = i.label.textStyle, a = this.getFont(n), l = i.data, d = this._location.x, c = this._location.y + this._location.height / 4 * 3, p = this._location.x2 - this._location.x, u = l.length, g = [];
            if (u > 1) {
                var f = p / u;
                if (f = f > 50 ? 50 : 20 > f ? 5 : f, p -= 2 * f, "number" === i.type)for (var m = 0; u > m; m++)g.push(d + f + p / (u - 1) * m); else {
                    g[0] = new Date(t(0).replace(/-/g, "/")), g[u - 1] = new Date(t(u - 1).replace(/-/g, "/")) - g[0];
                    for (var m = 1; u > m; m++)g[m] = d + f + p * (new Date(t(m).replace(/-/g, "/")) - g[0]) / g[u - 1];
                    g[0] = d + f
                }
            } else g.push(d + p / 2);
            for (var _, y, v, x, b, T = [], m = 0; u > m; m++)d = g[m], _ = l[m].symbol && l[m].symbol.toLowerCase() || o, _.match("empty") ? (_ = _.replace("empty", ""), v = !0) : v = !1, _.match("star") && (y = _.replace("star", "") - 0 || 5, _ = "star"), e = l[m].textStyle ? h.merge(l[m].textStyle || {}, n) : n, x = e.align || "center", r ? (x = r > 0 ? "right" : "left", b = [r * Math.PI / 180, d, c - 5]) : b = !1, T.push({x: d, n: y, isEmpty: v, symbol: _, symbolSize: l[m].symbolSize || s, color: l[m].color, borderColor: l[m].borderColor, borderWidth: l[m].borderWidth, name: this._getReformedLabel(m), textColor: e.color, textAlign: x, textBaseline: e.baseline || "middle", textX: d, textY: c - (r ? 5 : 0), textFont: l[m].textStyle ? this.getFont(e) : a, rotation: b, showLabel: !1});
            return T
        }, _buildBackground: function () {
            var t = this.timelineOption, e = this.reformCssArray(this.timelineOption.padding), i = this._location.width, o = this._location.height;
            (0 !== t.borderWidth || "rgba(0,0,0,0)" != t.backgroundColor.replace(/\s/g, "")) && this.shapeList.push(new s({zlevel: this._zlevelBase, hoverable: !1, style: {x: this._location.x - e[3], y: this._location.y - e[0], width: i + e[1] + e[3], height: o + e[0] + e[2], brushType: 0 === t.borderWidth ? "fill" : "both", color: t.backgroundColor, strokeColor: t.borderColor, lineWidth: t.borderWidth}}))
        }, _buildControl: function () {
            var t = this, e = this.timelineOption, i = e.lineStyle, o = e.controlStyle;
            if ("none" !== e.controlPosition) {
                var s, n = 15, a = 5;
                "left" === e.controlPosition ? (s = this._location.x, this._location.x += 3 * (n + a)) : (s = this._location.x2 - (3 * (n + a) - a), this._location.x2 -= 3 * (n + a));
                var l = this._location.y, d = {zlevel: this._zlevelBase + 1, style: {iconType: "timelineControl", symbol: "last", x: s, y: l, width: n, height: n, brushType: "stroke", color: o.normal.color, strokeColor: o.normal.color, lineWidth: i.width}, highlightStyle: {color: o.emphasis.color, strokeColor: o.emphasis.color, lineWidth: i.width + 1}, clickable: !0};
                this._ctrLastShape = new r(d), this._ctrLastShape.onclick = function () {
                    t.last()
                }, this.shapeList.push(this._ctrLastShape), s += n + a, this._ctrPlayShape = new r(h.clone(d)), this._ctrPlayShape.style.brushType = "fill", this._ctrPlayShape.style.symbol = "play", this._ctrPlayShape.style.status = this.timelineOption.autoPlay ? "playing" : "stop", this._ctrPlayShape.style.x = s, this._ctrPlayShape.onclick = function () {
                    "stop" === t._ctrPlayShape.style.status ? t.play() : t.stop()
                }, this.shapeList.push(this._ctrPlayShape), s += n + a, this._ctrNextShape = new r(h.clone(d)), this._ctrNextShape.style.symbol = "next", this._ctrNextShape.style.x = s, this._ctrNextShape.onclick = function () {
                    t.next()
                }, this.shapeList.push(this._ctrNextShape)
            }
        }, _buildChain: function () {
            var t = this.timelineOption, e = t.lineStyle;
            this._timelineShae = {zlevel: this._zlevelBase, style: {x: this._location.x, y: this.subPixelOptimize(this._location.y, e.width), width: this._location.x2 - this._location.x, height: this._location.height, chainPoint: this._chainPoint, brushType: "both", strokeColor: e.color, lineWidth: e.width, lineType: e.type}, hoverable: !1, clickable: !0, onclick: this._onclick}, this._timelineShae = new n(this._timelineShae), this.shapeList.push(this._timelineShae)
        }, _buildHandle: function () {
            var t = this._chainPoint[this.currentIndex], e = t.symbolSize + 1;
            e = 5 > e ? 5 : e, this._handleShape = {zlevel: this._zlevelBase + 1, hoverable: !1, draggable: !0, style: {iconType: "diamond", n: t.n, x: t.x - e, y: this._location.y + this._location.height / 4 - e, width: 2 * e, height: 2 * e, brushType: "both", textPosition: "specific", textX: t.x, textY: this._location.y - this._location.height / 4, textAlign: "center", textBaseline: "middle"}, highlightStyle: {}, ondrift: this._ondrift, ondragend: this._ondragend}, this._handleShape = new r(this._handleShape), this.shapeList.push(this._handleShape)
        }, _syncHandleShape: function () {
            if (this.timelineOption.show) {
                var t = this.timelineOption, e = t.checkpointStyle, i = this._chainPoint[this.currentIndex];
                this._handleShape.style.text = e.label.show ? i.name : "", this._handleShape.style.textFont = i.textFont, this._handleShape.style.n = i.n, "auto" === e.symbol ? this._handleShape.style.iconType = "none" != i.symbol ? i.symbol : "diamond" : (this._handleShape.style.iconType = e.symbol, e.symbol.match("star") && (this._handleShape.style.n = e.symbol.replace("star", "") - 0 || 5, this._handleShape.style.iconType = "star"));
                var o;
                "auto" === e.symbolSize ? (o = i.symbolSize + 2, o = 5 > o ? 5 : o) : o = e.symbolSize - 0, this._handleShape.style.color = "auto" === e.color ? i.color ? i.color : t.controlStyle.emphasis.color : e.color, this._handleShape.style.textColor = "auto" === e.label.textStyle.color ? this._handleShape.style.color : e.label.textStyle.color, this._handleShape.highlightStyle.strokeColor = this._handleShape.style.strokeColor = "auto" === e.borderColor ? i.borderColor ? i.borderColor : "#fff" : e.borderColor, this._handleShape.style.lineWidth = "auto" === e.borderWidth ? i.borderWidth ? i.borderWidth : 0 : e.borderWidth - 0, this._handleShape.highlightStyle.lineWidth = this._handleShape.style.lineWidth + 1, this.zr.animate(this._handleShape.id, "style").when(500, {x: i.x - o, textX: i.x, y: this._location.y + this._location.height / 4 - o, width: 2 * o, height: 2 * o}).start("ExponentialOut")
            }
        }, _findChainIndex: function (t) {
            var e = this._chainPoint, i = e.length;
            if (t <= e[0].x)return 0;
            if (t >= e[i - 1].x)return i - 1;
            for (var o = 0; i - 1 > o; o++)if (t >= e[o].x && t <= e[o + 1].x)return Math.abs(t - e[o].x) < Math.abs(t - e[o + 1].x) ? o : o + 1
        }, __onclick: function (t) {
            var e = d.getX(t.event), i = this._findChainIndex(e);
            return i === this.currentIndex ? !0 : (this.currentIndex = i, this.timelineOption.autoPlay && this.stop(), clearTimeout(this.playTicket), void this._onFrame())
        }, __ondrift: function (t, e) {
            this.timelineOption.autoPlay && this.stop();
            var i, o = this._chainPoint, s = o.length;
            t.style.x + e <= o[0].x - o[0].symbolSize ? (t.style.x = o[0].x - o[0].symbolSize, i = 0) : t.style.x + e >= o[s - 1].x - o[s - 1].symbolSize ? (t.style.x = o[s - 1].x - o[s - 1].symbolSize, i = s - 1) : (t.style.x += e, i = this._findChainIndex(t.style.x));
            var r = o[i], n = r.symbolSize + 2;
            if (t.style.iconType = r.symbol, t.style.n = r.n, t.style.textX = t.style.x + n / 2, t.style.y = this._location.y + this._location.height / 4 - n, t.style.width = 2 * n, t.style.height = 2 * n, t.style.text = r.name, i === this.currentIndex)return!0;
            if (this.currentIndex = i, this.timelineOption.realtime) {
                clearTimeout(this.playTicket);
                var a = this;
                this.playTicket = setTimeout(function () {
                    a._setCurrentOption()
                }, 200)
            }
            return!0
        }, __ondragend: function () {
            this.isDragend = !0
        }, ondragend: function (t, e) {
            this.isDragend && t.target && (!this.timelineOption.realtime && this._setCurrentOption(), e.dragOut = !0, e.dragIn = !0, e.needRefresh = !1, this.isDragend = !1, this._syncHandleShape())
        }, last: function () {
            return this.timelineOption.autoPlay && this.stop(), this.currentIndex -= 1, this.currentIndex < 0 && (this.currentIndex = this.timelineOption.data.length - 1), this._onFrame(), this.currentIndex
        }, next: function () {
            return this.timelineOption.autoPlay && this.stop(), this.currentIndex += 1, this.currentIndex >= this.timelineOption.data.length && (this.currentIndex = 0), this._onFrame(), this.currentIndex
        }, play: function (t, e) {
            return this._ctrPlayShape && "playing" != this._ctrPlayShape.style.status && (this._ctrPlayShape.style.status = "playing", this.zr.modShape(this._ctrPlayShape.id), this.zr.refresh()), this.timelineOption.autoPlay = null != e ? e : !0, this.timelineOption.autoPlay || clearTimeout(this.playTicket), this.currentIndex = null != t ? t : this.currentIndex + 1, this.currentIndex >= this.timelineOption.data.length && (this.currentIndex = 0), this._onFrame(), this.currentIndex
        }, stop: function () {
            return this._ctrPlayShape && "stop" != this._ctrPlayShape.style.status && (this._ctrPlayShape.style.status = "stop", this.zr.modShape(this._ctrPlayShape.id), this.zr.refresh()), this.timelineOption.autoPlay = !1, clearTimeout(this.playTicket), this.currentIndex
        }, resize: function () {
            this.timelineOption.show && (this.clear(), this._buildShape(), this._syncHandleShape())
        }, setTheme: function (t) {
            this.timelineOption = this.reformOption(h.clone(this.option.timeline)), this.timelineOption.label.textStyle = h.merge(this.timelineOption.label.textStyle || {}, this.ecTheme.textStyle), this.timelineOption.checkpointStyle.label.textStyle = h.merge(this.timelineOption.checkpointStyle.label.textStyle || {}, this.ecTheme.textStyle), this.myChart.canvasSupported || (this.timelineOption.realtime = !1), this.timelineOption.show && t && (this.clear(), this._buildShape(), this._syncHandleShape())
        }, onbeforDispose: function () {
            clearTimeout(this.playTicket)
        }}, r.prototype.iconLibrary.timelineControl = i, h.inherits(e, o), t("../component").define("timeline", e), e
    }), i("zrender/shape/Image", ["require", "./Base", "../tool/util"], function (t) {
        var e = t("./Base"), i = function (t) {
            e.call(this, t)
        };
        return i.prototype = {type: "image", brush: function (t, e, i) {
            var o = this.style || {};
            e && (o = this.getHighlightStyle(o, this.highlightStyle || {}));
            var s = o.image, r = this;
            if (this._imageCache || (this._imageCache = {}), "string" == typeof s) {
                var n = s;
                this._imageCache[n] ? s = this._imageCache[n] : (s = new Image, s.onload = function () {
                    s.onload = null, r.modSelf(), i()
                }, s.src = n, this._imageCache[n] = s)
            }
            if (s) {
                if ("IMG" == s.nodeName.toUpperCase())if (window.ActiveXObject) {
                    if ("complete" != s.readyState)return
                } else if (!s.complete)return;
                var a = o.width || s.width, h = o.height || s.height, l = o.x, d = o.y;
                if (!s.width || !s.height)return;
                if (t.save(), this.doClip(t), this.setContext(t, o), this.setTransform(t), o.sWidth && o.sHeight) {
                    var c = o.sx || 0, p = o.sy || 0;
                    t.drawImage(s, c, p, o.sWidth, o.sHeight, l, d, a, h)
                } else if (o.sx && o.sy) {
                    var c = o.sx, p = o.sy, u = a - c, g = h - p;
                    t.drawImage(s, c, p, u, g, l, d, a, h)
                } else t.drawImage(s, l, d, a, h);
                o.width || (o.width = a), o.height || (o.height = h), this.style.width || (this.style.width = a), this.style.height || (this.style.height = h), this.drawText(t, o, this.style), t.restore()
            }
        }, getRect: function (t) {
            return{x: t.x, y: t.y, width: t.width, height: t.height}
        }, clearCache: function () {
            this._imageCache = {}
        }}, t("../tool/util").inherits(i, e), i
    }), i("zrender/loadingEffect/Bar", ["require", "./Base", "../tool/util", "../tool/color", "../shape/Rectangle"], function (t) {
        function e(t) {
            i.call(this, t)
        }

        var i = t("./Base"), o = t("../tool/util"), s = t("../tool/color"), r = t("../shape/Rectangle");
        return o.inherits(e, i), e.prototype._start = function (t, e) {
            var i = o.merge(this.options, {textStyle: {color: "#888"}, backgroundColor: "rgba(250, 250, 250, 0.8)", effectOption: {x: 0, y: this.canvasHeight / 2 - 30, width: this.canvasWidth, height: 5, brushType: "fill", timeInterval: 100}}), n = this.createTextShape(i.textStyle), a = this.createBackgroundShape(i.backgroundColor), h = i.effectOption, l = new r({highlightStyle: o.clone(h)});
            return l.highlightStyle.color = h.color || s.getLinearGradient(h.x, h.y, h.x + h.width, h.y + h.height, [
                [0, "#ff6400"],
                [.5, "#ffe100"],
                [1, "#b1ff00"]
            ]), null != i.progress ? (t(a), l.highlightStyle.width = this.adjust(i.progress, [0, 1]) * i.effectOption.width, t(l), t(n), void e()) : (l.highlightStyle.width = 0, setInterval(function () {
                t(a), l.highlightStyle.width < h.width ? l.highlightStyle.width += 8 : l.highlightStyle.width = 0, t(l), t(n), e()
            }, h.timeInterval))
        }, e
    }), i("zrender/loadingEffect/Bubble", ["require", "./Base", "../tool/util", "../tool/color", "../shape/Circle"], function (t) {
        function e(t) {
            i.call(this, t)
        }

        var i = t("./Base"), o = t("../tool/util"), s = t("../tool/color"), r = t("../shape/Circle");
        return o.inherits(e, i), e.prototype._start = function (t, e) {
            for (var i = o.merge(this.options, {textStyle: {color: "#888"}, backgroundColor: "rgba(250, 250, 250, 0.8)", effect: {n: 50, lineWidth: 2, brushType: "stroke", color: "random", timeInterval: 100}}), n = this.createTextShape(i.textStyle), a = this.createBackgroundShape(i.backgroundColor), h = i.effect, l = h.n, d = h.brushType, c = h.lineWidth, p = [], u = this.canvasWidth, g = this.canvasHeight, f = 0; l > f; f++) {
                var m = "random" == h.color ? s.alpha(s.random(), .3) : h.color;
                p[f] = new r({highlightStyle: {x: Math.ceil(Math.random() * u), y: Math.ceil(Math.random() * g), r: Math.ceil(40 * Math.random()), brushType: d, color: m, strokeColor: m, lineWidth: c}, animationY: Math.ceil(20 * Math.random())})
            }
            return setInterval(function () {
                t(a);
                for (var i = 0; l > i; i++) {
                    var o = p[i].highlightStyle;
                    o.y - p[i].animationY + o.r <= 0 && (p[i].highlightStyle.y = g + o.r, p[i].highlightStyle.x = Math.ceil(Math.random() * u)), p[i].highlightStyle.y -= p[i].animationY, t(p[i])
                }
                t(n), e()
            }, h.timeInterval)
        }, e
    }), i("zrender/loadingEffect/DynamicLine", ["require", "./Base", "../tool/util", "../tool/color", "../shape/Line"], function (t) {
        function e(t) {
            i.call(this, t)
        }

        var i = t("./Base"), o = t("../tool/util"), s = t("../tool/color"), r = t("../shape/Line");
        return o.inherits(e, i), e.prototype._start = function (t, e) {
            for (var i = o.merge(this.options, {textStyle: {color: "#fff"}, backgroundColor: "rgba(0, 0, 0, 0.8)", effectOption: {n: 30, lineWidth: 1, color: "random", timeInterval: 100}}), n = this.createTextShape(i.textStyle), a = this.createBackgroundShape(i.backgroundColor), h = i.effectOption, l = h.n, d = h.lineWidth, c = [], p = this.canvasWidth, u = this.canvasHeight, g = 0; l > g; g++) {
                var f = -Math.ceil(1e3 * Math.random()), m = Math.ceil(400 * Math.random()), _ = Math.ceil(Math.random() * u), y = "random" == h.color ? s.random() : h.color;
                c[g] = new r({highlightStyle: {xStart: f, yStart: _, xEnd: f + m, yEnd: _, strokeColor: y, lineWidth: d}, animationX: Math.ceil(100 * Math.random()), len: m})
            }
            return setInterval(function () {
                t(a);
                for (var i = 0; l > i; i++) {
                    var o = c[i].highlightStyle;
                    o.xStart >= p && (c[i].len = Math.ceil(400 * Math.random()), o.xStart = -400, o.xEnd = -400 + c[i].len, o.yStart = Math.ceil(Math.random() * u), o.yEnd = o.yStart), o.xStart += c[i].animationX, o.xEnd += c[i].animationX, t(c[i])
                }
                t(n), e()
            }, h.timeInterval)
        }, e
    }), i("zrender/loadingEffect/Ring", ["require", "./Base", "../tool/util", "../tool/color", "../shape/Ring", "../shape/Sector"], function (t) {
        function e(t) {
            i.call(this, t)
        }

        var i = t("./Base"), o = t("../tool/util"), s = t("../tool/color"), r = t("../shape/Ring"), n = t("../shape/Sector");
        return o.inherits(e, i), e.prototype._start = function (t, e) {
            var i = o.merge(this.options, {textStyle: {color: "#07a"}, backgroundColor: "rgba(250, 250, 250, 0.8)", effect: {x: this.canvasWidth / 2, y: this.canvasHeight / 2, r0: 60, r: 100, color: "#bbdcff", brushType: "fill", textPosition: "inside", textFont: "normal 30px verdana", textColor: "rgba(30, 144, 255, 0.6)", timeInterval: 100}}), a = i.effect, h = i.textStyle;
            null == h.x && (h.x = a.x), null == h.y && (h.y = a.y + (a.r0 + a.r) / 2 - 5);
            for (var l = this.createTextShape(i.textStyle), d = this.createBackgroundShape(i.backgroundColor), c = a.x, p = a.y, u = a.r0 + 6, g = a.r - 6, f = a.color, m = s.lift(f, .1), _ = new r({highlightStyle: o.clone(a)}), y = [], v = s.getGradientColors(["#ff6400", "#ffe100", "#97ff00"], 25), x = 15, b = 240, T = 0; 16 > T; T++)y.push(new n({highlightStyle: {x: c, y: p, r0: u, r: g, startAngle: b - x, endAngle: b, brushType: "fill", color: m}, _color: s.getLinearGradient(c + u * Math.cos(b, !0), p - u * Math.sin(b, !0), c + u * Math.cos(b - x, !0), p - u * Math.sin(b - x, !0), [
                [0, v[2 * T]],
                [1, v[2 * T + 1]]
            ])})), b -= x;
            b = 360;
            for (var T = 0; 4 > T; T++)y.push(new n({highlightStyle: {x: c, y: p, r0: u, r: g, startAngle: b - x, endAngle: b, brushType: "fill", color: m}, _color: s.getLinearGradient(c + u * Math.cos(b, !0), p - u * Math.sin(b, !0), c + u * Math.cos(b - x, !0), p - u * Math.sin(b - x, !0), [
                [0, v[2 * T + 32]],
                [1, v[2 * T + 33]]
            ])})), b -= x;
            var S = 0;
            if (null != i.progress) {
                t(d), S = 100 * this.adjust(i.progress, [0, 1]).toFixed(2) / 5, _.highlightStyle.text = 5 * S + "%", t(_);
                for (var T = 0; 20 > T; T++)y[T].highlightStyle.color = S > T ? y[T]._color : m, t(y[T]);
                return t(l), void e()
            }
            return setInterval(function () {
                t(d), S += S >= 20 ? -20 : 1, t(_);
                for (var i = 0; 20 > i; i++)y[i].highlightStyle.color = S > i ? y[i]._color : m, t(y[i]);
                t(l), e()
            }, a.timeInterval)
        }, e
    }), i("zrender/loadingEffect/Spin", ["require", "./Base", "../tool/util", "../tool/color", "../tool/area", "../shape/Sector"], function (t) {
        function e(t) {
            i.call(this, t)
        }

        var i = t("./Base"), o = t("../tool/util"), s = t("../tool/color"), r = t("../tool/area"), n = t("../shape/Sector");
        return o.inherits(e, i), e.prototype._start = function (t, e) {
            var i = o.merge(this.options, {textStyle: {color: "#fff", textAlign: "start"}, backgroundColor: "rgba(0, 0, 0, 0.8)"}), a = this.createTextShape(i.textStyle), h = 10, l = r.getTextWidth(a.highlightStyle.text, a.highlightStyle.textFont), d = r.getTextHeight(a.highlightStyle.text, a.highlightStyle.textFont), c = o.merge(this.options.effect || {}, {r0: 9, r: 15, n: 18, color: "#fff", timeInterval: 100}), p = this.getLocation(this.options.textStyle, l + h + 2 * c.r, Math.max(2 * c.r, d));
            c.x = p.x + c.r, c.y = a.highlightStyle.y = p.y + p.height / 2, a.highlightStyle.x = c.x + c.r + h;
            for (var u = this.createBackgroundShape(i.backgroundColor), g = c.n, f = c.x, m = c.y, _ = c.r0, y = c.r, v = c.color, x = [], b = Math.round(180 / g), T = 0; g > T; T++)x[T] = new n({highlightStyle: {x: f, y: m, r0: _, r: y, startAngle: b * T * 2, endAngle: b * T * 2 + b, color: s.alpha(v, (T + 1) / g), brushType: "fill"}});
            var S = [0, f, m];
            return setInterval(function () {
                t(u), S[0] -= .3;
                for (var i = 0; g > i; i++)x[i].rotation = S, t(x[i]);
                t(a), e()
            }, c.timeInterval)
        }, e
    }), i("zrender/loadingEffect/Whirling", ["require", "./Base", "../tool/util", "../tool/area", "../shape/Ring", "../shape/Droplet", "../shape/Circle"], function (t) {
        function e(t) {
            i.call(this, t)
        }

        var i = t("./Base"), o = t("../tool/util"), s = t("../tool/area"), r = t("../shape/Ring"), n = t("../shape/Droplet"), a = t("../shape/Circle");
        return o.inherits(e, i), e.prototype._start = function (t, e) {
            var i = o.merge(this.options, {textStyle: {color: "#888", textAlign: "start"}, backgroundColor: "rgba(250, 250, 250, 0.8)"}), h = this.createTextShape(i.textStyle), l = 10, d = s.getTextWidth(h.highlightStyle.text, h.highlightStyle.textFont), c = s.getTextHeight(h.highlightStyle.text, h.highlightStyle.textFont), p = o.merge(this.options.effect || {}, {r: 18, colorIn: "#fff", colorOut: "#555", colorWhirl: "#6cf", timeInterval: 50}), u = this.getLocation(this.options.textStyle, d + l + 2 * p.r, Math.max(2 * p.r, c));
            p.x = u.x + p.r, p.y = h.highlightStyle.y = u.y + u.height / 2, h.highlightStyle.x = p.x + p.r + l;
            var g = this.createBackgroundShape(i.backgroundColor), f = new n({highlightStyle: {a: Math.round(p.r / 2), b: Math.round(p.r - p.r / 6), brushType: "fill", color: p.colorWhirl}}), m = new a({highlightStyle: {r: Math.round(p.r / 6), brushType: "fill", color: p.colorIn}}), _ = new r({highlightStyle: {r0: Math.round(p.r - p.r / 3), r: p.r, brushType: "fill", color: p.colorOut}}), y = [0, p.x, p.y];
            return f.highlightStyle.x = m.highlightStyle.x = _.highlightStyle.x = y[1], f.highlightStyle.y = m.highlightStyle.y = _.highlightStyle.y = y[2], setInterval(function () {
                t(g), t(_), y[0] -= .3, f.rotation = y, t(f), t(m), t(h), e()
            }, p.timeInterval)
        }, e
    }), i("echarts/theme/default", [], function () {
        var t = {};
        return t
    }), i("zrender/dep/excanvas", ["require"], function () {
        return document.createElement("canvas").getContext ? G_vmlCanvasManager = !1 : !function () {
            function t() {
                return this.context_ || (this.context_ = new x(this))
            }

            function e(t, e) {
                var i = F.call(arguments, 2);
                return function () {
                    return t.apply(e, i.concat(F.call(arguments)))
                }
            }

            function i(t) {
                return String(t).replace(/&/g, "&amp;").replace(/"/g, "&quot;")
            }

            function o(t, e, i) {
                t.namespaces[e] || t.namespaces.add(e, i, "#default#VML")
            }

            function s(t) {
                if (o(t, "g_vml_", "urn:schemas-microsoft-com:vml"), o(t, "g_o_", "urn:schemas-microsoft-com:office:office"), !t.styleSheets.ex_canvas_) {
                    var e = t.createStyleSheet();
                    e.owningElement.id = "ex_canvas_", e.cssText = "canvas{display:inline-block;overflow:hidden;text-align:left;width:300px;height:150px}"
                }
            }

            function r(t) {
                var e = t.srcElement;
                switch (t.propertyName) {
                    case"width":
                        e.getContext().clearRect(), e.style.width = e.attributes.width.nodeValue + "px", e.firstChild.style.width = e.clientWidth + "px";
                        break;
                    case"height":
                        e.getContext().clearRect(), e.style.height = e.attributes.height.nodeValue + "px", e.firstChild.style.height = e.clientHeight + "px"
                }
            }

            function n(t) {
                var e = t.srcElement;
                e.firstChild && (e.firstChild.style.width = e.clientWidth + "px", e.firstChild.style.height = e.clientHeight + "px")
            }

            function a() {
                return[
                    [1, 0, 0],
                    [0, 1, 0],
                    [0, 0, 1]
                ]
            }

            function h(t, e) {
                for (var i = a(), o = 0; 3 > o; o++)for (var s = 0; 3 > s; s++) {
                    for (var r = 0, n = 0; 3 > n; n++)r += t[o][n] * e[n][s];
                    i[o][s] = r
                }
                return i
            }

            function l(t, e) {
                e.fillStyle = t.fillStyle, e.lineCap = t.lineCap, e.lineJoin = t.lineJoin, e.lineWidth = t.lineWidth, e.miterLimit = t.miterLimit, e.shadowBlur = t.shadowBlur, e.shadowColor = t.shadowColor, e.shadowOffsetX = t.shadowOffsetX, e.shadowOffsetY = t.shadowOffsetY, e.strokeStyle = t.strokeStyle, e.globalAlpha = t.globalAlpha, e.font = t.font, e.textAlign = t.textAlign, e.textBaseline = t.textBaseline, e.scaleX_ = t.scaleX_, e.scaleY_ = t.scaleY_, e.lineScale_ = t.lineScale_
            }

            function d(t) {
                var e = t.indexOf("(", 3), i = t.indexOf(")", e + 1), o = t.substring(e + 1, i).split(",");
                return(4 != o.length || "a" != t.charAt(3)) && (o[3] = 1), o
            }

            function c(t) {
                return parseFloat(t) / 100
            }

            function p(t, e, i) {
                return Math.min(i, Math.max(e, t))
            }

            function u(t) {
                var e, i, o, s, r, n;
                if (s = parseFloat(t[0]) / 360 % 360, 0 > s && s++, r = p(c(t[1]), 0, 1), n = p(c(t[2]), 0, 1), 0 == r)e = i = o = n; else {
                    var a = .5 > n ? n * (1 + r) : n + r - n * r, h = 2 * n - a;
                    e = g(h, a, s + 1 / 3), i = g(h, a, s), o = g(h, a, s - 1 / 3)
                }
                return"#" + W[Math.floor(255 * e)] + W[Math.floor(255 * i)] + W[Math.floor(255 * o)]
            }

            function g(t, e, i) {
                return 0 > i && i++, i > 1 && i--, 1 > 6 * i ? t + 6 * (e - t) * i : 1 > 2 * i ? e : 2 > 3 * i ? t + (e - t) * (2 / 3 - i) * 6 : t
            }

            function f(t) {
                if (t in V)return V[t];
                var e, i = 1;
                if (t = String(t), "#" == t.charAt(0))e = t; else if (/^rgb/.test(t)) {
                    for (var o, s = d(t), e = "#", r = 0; 3 > r; r++)o = -1 != s[r].indexOf("%") ? Math.floor(255 * c(s[r])) : +s[r], e += W[p(o, 0, 255)];
                    i = +s[3]
                } else if (/^hsl/.test(t)) {
                    var s = d(t);
                    e = u(s), i = s[3]
                } else e = q[t] || t;
                return V[t] = {color: e, alpha: i}
            }

            function m(t) {
                if (U[t])return U[t];
                var e, i = document.createElement("div"), o = i.style;
                try {
                    o.font = t, e = o.fontFamily.split(",")[0]
                } catch (s) {
                }
                return U[t] = {style: o.fontStyle || Z.style, variant: o.fontVariant || Z.variant, weight: o.fontWeight || Z.weight, size: o.fontSize || Z.size, family: e || Z.family}
            }

            function _(t, e) {
                var i = {};
                for (var o in t)i[o] = t[o];
                var s = parseFloat(e.currentStyle.fontSize), r = parseFloat(t.size);
                return i.size = "number" == typeof t.size ? t.size : -1 != t.size.indexOf("px") ? r : -1 != t.size.indexOf("em") ? s * r : -1 != t.size.indexOf("%") ? s / 100 * r : -1 != t.size.indexOf("pt") ? r / .75 : s, i
            }

            function y(t) {
                return t.style + " " + t.variant + " " + t.weight + " " + t.size + "px '" + t.family + "'"
            }

            function v(t) {
                return Q[t] || "square"
            }

            function x(t) {
                this.m_ = a(), this.mStack_ = [], this.aStack_ = [], this.currentPath_ = [], this.strokeStyle = "#000", this.fillStyle = "#000", this.lineWidth = 1, this.lineJoin = "miter", this.lineCap = "butt", this.miterLimit = 1 * N, this.globalAlpha = 1, this.font = "12px 微软雅黑", this.textAlign = "left", this.textBaseline = "alphabetic", this.canvas = t;
                var e = "width:" + t.clientWidth + "px;height:" + t.clientHeight + "px;overflow:hidden;position:absolute", i = t.ownerDocument.createElement("div");
                i.style.cssText = e, t.appendChild(i);
                var o = i.cloneNode(!1);
                o.style.backgroundColor = "#fff", o.style.filter = "alpha(opacity=0)", t.appendChild(o), this.element_ = i, this.scaleX_ = 1, this.scaleY_ = 1, this.lineScale_ = 1
            }

            function b(t, e, i, o) {
                t.currentPath_.push({type: "bezierCurveTo", cp1x: e.x, cp1y: e.y, cp2x: i.x, cp2y: i.y, x: o.x, y: o.y}), t.currentX_ = o.x, t.currentY_ = o.y
            }

            function T(t, e) {
                var i = f(t.strokeStyle), o = i.color, s = i.alpha * t.globalAlpha, r = t.lineScale_ * t.lineWidth;
                1 > r && (s *= r), e.push("<g_vml_:stroke", ' opacity="', s, '"', ' joinstyle="', t.lineJoin, '"', ' miterlimit="', t.miterLimit, '"', ' endcap="', v(t.lineCap), '"', ' weight="', r, 'px"', ' color="', o, '" />')
            }

            function S(t, e, i, o) {
                var s = t.fillStyle, r = t.scaleX_, n = t.scaleY_, a = o.x - i.x, h = o.y - i.y;
                if (s instanceof E) {
                    var l = 0, d = {x: 0, y: 0}, c = 0, p = 1;
                    if ("gradient" == s.type_) {
                        var u = s.x0_ / r, g = s.y0_ / n, m = s.x1_ / r, _ = s.y1_ / n, y = C(t, u, g), v = C(t, m, _), x = v.x - y.x, b = v.y - y.y;
                        l = 180 * Math.atan2(x, b) / Math.PI, 0 > l && (l += 360), 1e-6 > l && (l = 0)
                    } else {
                        var y = C(t, s.x0_, s.y0_);
                        d = {x: (y.x - i.x) / a, y: (y.y - i.y) / h}, a /= r * N, h /= n * N;
                        var T = I.max(a, h);
                        c = 2 * s.r0_ / T, p = 2 * s.r1_ / T - c
                    }
                    var S = s.colors_;
                    S.sort(function (t, e) {
                        return t.offset - e.offset
                    });
                    for (var z = S.length, w = S[0].color, A = S[z - 1].color, M = S[0].alpha * t.globalAlpha, k = S[z - 1].alpha * t.globalAlpha, P = [], O = 0; z > O; O++) {
                        var R = S[O];
                        P.push(R.offset * p + c + " " + R.color)
                    }
                    e.push('<g_vml_:fill type="', s.type_, '"', ' method="none" focus="100%"', ' color="', w, '"', ' color2="', A, '"', ' colors="', P.join(","), '"', ' opacity="', k, '"', ' g_o_:opacity2="', M, '"', ' angle="', l, '"', ' focusposition="', d.x, ",", d.y, '" />')
                } else if (s instanceof L) {
                    if (a && h) {
                        var D = -i.x, H = -i.y;
                        e.push("<g_vml_:fill", ' position="', D / a * r * r, ",", H / h * n * n, '"', ' type="tile"', ' src="', s.src_, '" />')
                    }
                } else {
                    var B = f(t.fillStyle), F = B.color, Y = B.alpha * t.globalAlpha;
                    e.push('<g_vml_:fill color="', F, '" opacity="', Y, '" />')
                }
            }

            function C(t, e, i) {
                var o = t.m_;
                return{x: N * (e * o[0][0] + i * o[1][0] + o[2][0]) - B, y: N * (e * o[0][1] + i * o[1][1] + o[2][1]) - B}
            }

            function z(t) {
                return isFinite(t[0][0]) && isFinite(t[0][1]) && isFinite(t[1][0]) && isFinite(t[1][1]) && isFinite(t[2][0]) && isFinite(t[2][1])
            }

            function w(t, e, i) {
                if (z(e) && (t.m_ = e, t.scaleX_ = Math.sqrt(e[0][0] * e[0][0] + e[0][1] * e[0][1]), t.scaleY_ = Math.sqrt(e[1][0] * e[1][0] + e[1][1] * e[1][1]), i)) {
                    var o = e[0][0] * e[1][1] - e[0][1] * e[1][0];
                    t.lineScale_ = H(D(o))
                }
            }

            function E(t) {
                this.type_ = t, this.x0_ = 0, this.y0_ = 0, this.r0_ = 0, this.x1_ = 0, this.y1_ = 0, this.r1_ = 0, this.colors_ = []
            }

            function L(t, e) {
                switch (M(t), e) {
                    case"repeat":
                    case null:
                    case"":
                        this.repetition_ = "repeat";
                        break;
                    case"repeat-x":
                    case"repeat-y":
                    case"no-repeat":
                        this.repetition_ = e;
                        break;
                    default:
                        A("SYNTAX_ERR")
                }
                this.src_ = t.src, this.width_ = t.width, this.height_ = t.height
            }

            function A(t) {
                throw new k(t)
            }

            function M(t) {
                t && 1 == t.nodeType && "IMG" == t.tagName || A("TYPE_MISMATCH_ERR"), "complete" != t.readyState && A("INVALID_STATE_ERR")
            }

            function k(t) {
                this.code = this[t], this.message = t + ": DOM Exception " + this.code
            }

            var I = Math, P = I.round, O = I.sin, R = I.cos, D = I.abs, H = I.sqrt, N = 10, B = N / 2, F = (+navigator.userAgent.match(/MSIE ([\d.]+)?/)[1], Array.prototype.slice);
            s(document);
            var Y = {init: function (t) {
                var i = t || document;
                i.createElement("canvas"), i.attachEvent("onreadystatechange", e(this.init_, this, i))
            }, init_: function (t) {
                for (var e = t.getElementsByTagName("canvas"), i = 0; i < e.length; i++)this.initElement(e[i])
            }, initElement: function (e) {
                if (!e.getContext) {
                    e.getContext = t, s(e.ownerDocument), e.innerHTML = "", e.attachEvent("onpropertychange", r), e.attachEvent("onresize", n);
                    var i = e.attributes;
                    i.width && i.width.specified ? e.style.width = i.width.nodeValue + "px" : e.width = e.clientWidth, i.height && i.height.specified ? e.style.height = i.height.nodeValue + "px" : e.height = e.clientHeight
                }
                return e
            }};
            Y.init();
            for (var W = [], X = 0; 16 > X; X++)for (var G = 0; 16 > G; G++)W[16 * X + G] = X.toString(16) + G.toString(16);
            var q = {aliceblue: "#F0F8FF", antiquewhite: "#FAEBD7", aquamarine: "#7FFFD4", azure: "#F0FFFF", beige: "#F5F5DC", bisque: "#FFE4C4", black: "#000000", blanchedalmond: "#FFEBCD", blueviolet: "#8A2BE2", brown: "#A52A2A", burlywood: "#DEB887", cadetblue: "#5F9EA0", chartreuse: "#7FFF00", chocolate: "#D2691E", coral: "#FF7F50", cornflowerblue: "#6495ED", cornsilk: "#FFF8DC", crimson: "#DC143C", cyan: "#00FFFF", darkblue: "#00008B", darkcyan: "#008B8B", darkgoldenrod: "#B8860B", darkgray: "#A9A9A9", darkgreen: "#006400", darkgrey: "#A9A9A9", darkkhaki: "#BDB76B", darkmagenta: "#8B008B", darkolivegreen: "#556B2F", darkorange: "#FF8C00", darkorchid: "#9932CC", darkred: "#8B0000", darksalmon: "#E9967A", darkseagreen: "#8FBC8F", darkslateblue: "#483D8B", darkslategray: "#2F4F4F", darkslategrey: "#2F4F4F", darkturquoise: "#00CED1", darkviolet: "#9400D3", deeppink: "#FF1493", deepskyblue: "#00BFFF", dimgray: "#696969", dimgrey: "#696969", dodgerblue: "#1E90FF", firebrick: "#B22222", floralwhite: "#FFFAF0", forestgreen: "#228B22", gainsboro: "#DCDCDC", ghostwhite: "#F8F8FF", gold: "#FFD700", goldenrod: "#DAA520", grey: "#808080", greenyellow: "#ADFF2F", honeydew: "#F0FFF0", hotpink: "#FF69B4", indianred: "#CD5C5C", indigo: "#4B0082", ivory: "#FFFFF0", khaki: "#F0E68C", lavender: "#E6E6FA", lavenderblush: "#FFF0F5", lawngreen: "#7CFC00", lemonchiffon: "#FFFACD", lightblue: "#ADD8E6", lightcoral: "#F08080", lightcyan: "#E0FFFF", lightgoldenrodyellow: "#FAFAD2", lightgreen: "#90EE90", lightgrey: "#D3D3D3", lightpink: "#FFB6C1", lightsalmon: "#FFA07A", lightseagreen: "#20B2AA", lightskyblue: "#87CEFA", lightslategray: "#778899", lightslategrey: "#778899", lightsteelblue: "#B0C4DE", lightyellow: "#FFFFE0", limegreen: "#32CD32", linen: "#FAF0E6", magenta: "#FF00FF", mediumaquamarine: "#66CDAA", mediumblue: "#0000CD", mediumorchid: "#BA55D3", mediumpurple: "#9370DB", mediumseagreen: "#3CB371", mediumslateblue: "#7B68EE", mediumspringgreen: "#00FA9A", mediumturquoise: "#48D1CC", mediumvioletred: "#C71585", midnightblue: "#191970", mintcream: "#F5FFFA", mistyrose: "#FFE4E1", moccasin: "#FFE4B5", navajowhite: "#FFDEAD", oldlace: "#FDF5E6", olivedrab: "#6B8E23", orange: "#FFA500", orangered: "#FF4500", orchid: "#DA70D6", palegoldenrod: "#EEE8AA", palegreen: "#98FB98", paleturquoise: "#AFEEEE", palevioletred: "#DB7093", papayawhip: "#FFEFD5", peachpuff: "#FFDAB9", peru: "#CD853F", pink: "#FFC0CB", plum: "#DDA0DD", powderblue: "#B0E0E6", rosybrown: "#BC8F8F", royalblue: "#4169E1", saddlebrown: "#8B4513", salmon: "#FA8072", sandybrown: "#F4A460", seagreen: "#2E8B57", seashell: "#FFF5EE", sienna: "#A0522D", skyblue: "#87CEEB", slateblue: "#6A5ACD", slategray: "#708090", slategrey: "#708090", snow: "#FFFAFA", springgreen: "#00FF7F", steelblue: "#4682B4", tan: "#D2B48C", thistle: "#D8BFD8", tomato: "#FF6347", turquoise: "#40E0D0", violet: "#EE82EE", wheat: "#F5DEB3", whitesmoke: "#F5F5F5", yellowgreen: "#9ACD32"}, V = {}, Z = {style: "normal", variant: "normal", weight: "normal", size: 12, family: "微软雅黑"}, U = {}, Q = {butt: "flat", round: "round"}, j = x.prototype;
            j.clearRect = function () {
                this.textMeasureEl_ && (this.textMeasureEl_.removeNode(!0), this.textMeasureEl_ = null), this.element_.innerHTML = ""
            }, j.beginPath = function () {
                this.currentPath_ = []
            }, j.moveTo = function (t, e) {
                var i = C(this, t, e);
                this.currentPath_.push({type: "moveTo", x: i.x, y: i.y}), this.currentX_ = i.x, this.currentY_ = i.y
            }, j.lineTo = function (t, e) {
                var i = C(this, t, e);
                this.currentPath_.push({type: "lineTo", x: i.x, y: i.y}), this.currentX_ = i.x, this.currentY_ = i.y
            }, j.bezierCurveTo = function (t, e, i, o, s, r) {
                var n = C(this, s, r), a = C(this, t, e), h = C(this, i, o);
                b(this, a, h, n)
            }, j.quadraticCurveTo = function (t, e, i, o) {
                var s = C(this, t, e), r = C(this, i, o), n = {x: this.currentX_ + 2 / 3 * (s.x - this.currentX_), y: this.currentY_ + 2 / 3 * (s.y - this.currentY_)}, a = {x: n.x + (r.x - this.currentX_) / 3, y: n.y + (r.y - this.currentY_) / 3};
                b(this, n, a, r)
            }, j.arc = function (t, e, i, o, s, r) {
                i *= N;
                var n = r ? "at" : "wa", a = t + R(o) * i - B, h = e + O(o) * i - B, l = t + R(s) * i - B, d = e + O(s) * i - B;
                a != l || r || (a += .125);
                var c = C(this, t, e), p = C(this, a, h), u = C(this, l, d);
                this.currentPath_.push({type: n, x: c.x, y: c.y, radius: i, xStart: p.x, yStart: p.y, xEnd: u.x, yEnd: u.y})
            }, j.rect = function (t, e, i, o) {
                this.moveTo(t, e), this.lineTo(t + i, e), this.lineTo(t + i, e + o), this.lineTo(t, e + o), this.closePath()
            }, j.strokeRect = function (t, e, i, o) {
                var s = this.currentPath_;
                this.beginPath(), this.moveTo(t, e), this.lineTo(t + i, e), this.lineTo(t + i, e + o), this.lineTo(t, e + o), this.closePath(), this.stroke(), this.currentPath_ = s
            }, j.fillRect = function (t, e, i, o) {
                var s = this.currentPath_;
                this.beginPath(), this.moveTo(t, e), this.lineTo(t + i, e), this.lineTo(t + i, e + o), this.lineTo(t, e + o), this.closePath(), this.fill(), this.currentPath_ = s
            }, j.createLinearGradient = function (t, e, i, o) {
                var s = new E("gradient");
                return s.x0_ = t, s.y0_ = e, s.x1_ = i, s.y1_ = o, s
            }, j.createRadialGradient = function (t, e, i, o, s, r) {
                var n = new E("gradientradial");
                return n.x0_ = t, n.y0_ = e, n.r0_ = i, n.x1_ = o, n.y1_ = s, n.r1_ = r, n
            }, j.drawImage = function (t) {
                var e, i, o, s, r, n, a, h, l = t.runtimeStyle.width, d = t.runtimeStyle.height;
                t.runtimeStyle.width = "auto", t.runtimeStyle.height = "auto";
                var c = t.width, p = t.height;
                if (t.runtimeStyle.width = l, t.runtimeStyle.height = d, 3 == arguments.length)e = arguments[1], i = arguments[2], r = n = 0, a = o = c, h = s = p; else if (5 == arguments.length)e = arguments[1], i = arguments[2], o = arguments[3], s = arguments[4], r = n = 0, a = c, h = p; else {
                    if (9 != arguments.length)throw Error("Invalid number of arguments");
                    r = arguments[1], n = arguments[2], a = arguments[3], h = arguments[4], e = arguments[5], i = arguments[6], o = arguments[7], s = arguments[8]
                }
                var u = C(this, e, i), g = [], f = 10, m = 10, _ = v = 1;
                if (g.push(" <g_vml_:group", ' coordsize="', N * f, ",", N * m, '"', ' coordorigin="0,0"', ' style="width:', f, "px;height:", m, "px;position:absolute;"), 1 != this.m_[0][0] || this.m_[0][1] || 1 != this.m_[1][1] || this.m_[1][0]) {
                    var y = [], _ = this.scaleX_, v = this.scaleY_;
                    y.push("M11=", this.m_[0][0] / _, ",", "M12=", this.m_[1][0] / v, ",", "M21=", this.m_[0][1] / _, ",", "M22=", this.m_[1][1] / v, ",", "Dx=", P(u.x / N), ",", "Dy=", P(u.y / N), "");
                    var x = u, b = C(this, e + o, i), T = C(this, e, i + s), S = C(this, e + o, i + s);
                    x.x = I.max(x.x, b.x, T.x, S.x), x.y = I.max(x.y, b.y, T.y, S.y), g.push("padding:0 ", P(x.x / N), "px ", P(x.y / N), "px 0;filter:progid:DXImageTransform.Microsoft.Matrix(", y.join(""), ", SizingMethod='clip');")
                } else g.push("top:", P(u.y / N), "px;left:", P(u.x / N), "px;");
                g.push(' ">'), (r || n) && g.push('<div style="overflow: hidden; width:', Math.ceil((o + r * o / a) * _), "px;", " height:", Math.ceil((s + n * s / h) * v), "px;", " filter:progid:DxImageTransform.Microsoft.Matrix(Dx=", -r * o / a * _, ",Dy=", -n * s / h * v, ');">'), g.push('<div style="width:', Math.round(_ * c * o / a), "px;", " height:", Math.round(v * p * s / h), "px;", " filter:"), this.globalAlpha < 1 && g.push(" progid:DXImageTransform.Microsoft.Alpha(opacity=" + 100 * this.globalAlpha + ")"), g.push(" progid:DXImageTransform.Microsoft.AlphaImageLoader(src=", t.src, ',sizingMethod=scale)">'), (r || n) && g.push("</div>"), g.push("</div></div>"), this.element_.insertAdjacentHTML("BeforeEnd", g.join(""))
            }, j.stroke = function (t) {
                var e = [], i = 10, o = 10;
                e.push("<g_vml_:shape", ' filled="', !!t, '"', ' style="position:absolute;width:', i, "px;height:", o, 'px;"', ' coordorigin="0,0"', ' coordsize="', N * i, ",", N * o, '"', ' stroked="', !t, '"', ' path="');
                for (var s = {x: null, y: null}, r = {x: null, y: null}, n = 0; n < this.currentPath_.length; n++) {
                    var a, h = this.currentPath_[n];
                    switch (h.type) {
                        case"moveTo":
                            a = h, e.push(" m ", P(h.x), ",", P(h.y));
                            break;
                        case"lineTo":
                            e.push(" l ", P(h.x), ",", P(h.y));
                            break;
                        case"close":
                            e.push(" x "), h = null;
                            break;
                        case"bezierCurveTo":
                            e.push(" c ", P(h.cp1x), ",", P(h.cp1y), ",", P(h.cp2x), ",", P(h.cp2y), ",", P(h.x), ",", P(h.y));
                            break;
                        case"at":
                        case"wa":
                            e.push(" ", h.type, " ", P(h.x - this.scaleX_ * h.radius), ",", P(h.y - this.scaleY_ * h.radius), " ", P(h.x + this.scaleX_ * h.radius), ",", P(h.y + this.scaleY_ * h.radius), " ", P(h.xStart), ",", P(h.yStart), " ", P(h.xEnd), ",", P(h.yEnd))
                    }
                    h && ((null == s.x || h.x < s.x) && (s.x = h.x), (null == r.x || h.x > r.x) && (r.x = h.x), (null == s.y || h.y < s.y) && (s.y = h.y), (null == r.y || h.y > r.y) && (r.y = h.y))
                }
                e.push(' ">'), t ? S(this, e, s, r) : T(this, e), e.push("</g_vml_:shape>"), this.element_.insertAdjacentHTML("beforeEnd", e.join(""))
            }, j.fill = function () {
                this.stroke(!0)
            }, j.closePath = function () {
                this.currentPath_.push({type: "close"})
            }, j.save = function () {
                var t = {};
                l(this, t), this.aStack_.push(t), this.mStack_.push(this.m_), this.m_ = h(a(), this.m_)
            }, j.restore = function () {
                this.aStack_.length && (l(this.aStack_.pop(), this), this.m_ = this.mStack_.pop())
            }, j.translate = function (t, e) {
                var i = [
                    [1, 0, 0],
                    [0, 1, 0],
                    [t, e, 1]
                ];
                w(this, h(i, this.m_), !1)
            }, j.rotate = function (t) {
                var e = R(t), i = O(t), o = [
                    [e, i, 0],
                    [-i, e, 0],
                    [0, 0, 1]
                ];
                w(this, h(o, this.m_), !1)
            }, j.scale = function (t, e) {
                var i = [
                    [t, 0, 0],
                    [0, e, 0],
                    [0, 0, 1]
                ];
                w(this, h(i, this.m_), !0)
            }, j.transform = function (t, e, i, o, s, r) {
                var n = [
                    [t, e, 0],
                    [i, o, 0],
                    [s, r, 1]
                ];
                w(this, h(n, this.m_), !0)
            }, j.setTransform = function (t, e, i, o, s, r) {
                var n = [
                    [t, e, 0],
                    [i, o, 0],
                    [s, r, 1]
                ];
                w(this, n, !0)
            }, j.drawText_ = function (t, e, o, s, r) {
                var n = this.m_, a = 1e3, h = 0, l = a, d = {x: 0, y: 0}, c = [], p = _(m(this.font), this.element_), u = y(p), g = this.element_.currentStyle, f = this.textAlign.toLowerCase();
                switch (f) {
                    case"left":
                    case"center":
                    case"right":
                        break;
                    case"end":
                        f = "ltr" == g.direction ? "right" : "left";
                        break;
                    case"start":
                        f = "rtl" == g.direction ? "right" : "left";
                        break;
                    default:
                        f = "left"
                }
                switch (this.textBaseline) {
                    case"hanging":
                    case"top":
                        d.y = p.size / 1.75;
                        break;
                    case"middle":
                        break;
                    default:
                    case null:
                    case"alphabetic":
                    case"ideographic":
                    case"bottom":
                        d.y = -p.size / 2.25
                }
                switch (f) {
                    case"right":
                        h = a, l = .05;
                        break;
                    case"center":
                        h = l = a / 2
                }
                var v = C(this, e + d.x, o + d.y);
                c.push('<g_vml_:line from="', -h, ' 0" to="', l, ' 0.05" ', ' coordsize="100 100" coordorigin="0 0"', ' filled="', !r, '" stroked="', !!r, '" style="position:absolute;width:1px;height:1px;">'), r ? T(this, c) : S(this, c, {x: -h, y: 0}, {x: l, y: p.size});
                var x = n[0][0].toFixed(3) + "," + n[1][0].toFixed(3) + "," + n[0][1].toFixed(3) + "," + n[1][1].toFixed(3) + ",0,0", b = P(v.x / N) + "," + P(v.y / N);
                c.push('<g_vml_:skew on="t" matrix="', x, '" ', ' offset="', b, '" origin="', h, ' 0" />', '<g_vml_:path textpathok="true" />', '<g_vml_:textpath on="true" string="', i(t), '" style="v-text-align:', f, ";font:", i(u), '" /></g_vml_:line>'), this.element_.insertAdjacentHTML("beforeEnd", c.join(""))
            }, j.fillText = function (t, e, i, o) {
                this.drawText_(t, e, i, o, !1)
            }, j.strokeText = function (t, e, i, o) {
                this.drawText_(t, e, i, o, !0)
            }, j.measureText = function (t) {
                if (!this.textMeasureEl_) {
                    var e = '<span style="position:absolute;top:-20000px;left:0;padding:0;margin:0;border:none;white-space:pre;"></span>';
                    this.element_.insertAdjacentHTML("beforeEnd", e), this.textMeasureEl_ = this.element_.lastChild
                }
                var i = this.element_.ownerDocument;
                return this.textMeasureEl_.innerHTML = "", this.textMeasureEl_.style.font = this.font, this.textMeasureEl_.appendChild(i.createTextNode(t)), {width: this.textMeasureEl_.offsetWidth}
            }, j.clip = function () {
            }, j.arcTo = function () {
            }, j.createPattern = function (t, e) {
                return new L(t, e)
            }, E.prototype.addColorStop = function (t, e) {
                e = f(e), this.colors_.push({offset: t, color: e.color, alpha: e.alpha})
            };
            var K = k.prototype = new Error;
            K.INDEX_SIZE_ERR = 1, K.DOMSTRING_SIZE_ERR = 2, K.HIERARCHY_REQUEST_ERR = 3, K.WRONG_DOCUMENT_ERR = 4, K.INVALID_CHARACTER_ERR = 5, K.NO_DATA_ALLOWED_ERR = 6, K.NO_MODIFICATION_ALLOWED_ERR = 7, K.NOT_FOUND_ERR = 8, K.NOT_SUPPORTED_ERR = 9, K.INUSE_ATTRIBUTE_ERR = 10, K.INVALID_STATE_ERR = 11, K.SYNTAX_ERR = 12, K.INVALID_MODIFICATION_ERR = 13, K.NAMESPACE_ERR = 14, K.INVALID_ACCESS_ERR = 15, K.VALIDATION_ERR = 16, K.TYPE_MISMATCH_ERR = 17, G_vmlCanvasManager = Y, CanvasRenderingContext2D = x, CanvasGradient = E, CanvasPattern = L, DOMException = k
        }(), G_vmlCanvasManager
    }), i("zrender/mixin/Eventful", ["require"], function () {
        var t = function () {
            this._handlers = {}
        };
        return t.prototype.one = function (t, e, i) {
            var o = this._handlers;
            return e && t ? (o[t] || (o[t] = []), o[t].push({h: e, one: !0, ctx: i || this}), this) : this
        }, t.prototype.bind = function (t, e, i) {
            var o = this._handlers;
            return e && t ? (o[t] || (o[t] = []), o[t].push({h: e, one: !1, ctx: i || this}), this) : this
        }, t.prototype.unbind = function (t, e) {
            var i = this._handlers;
            if (!t)return this._handlers = {}, this;
            if (e) {
                if (i[t]) {
                    for (var o = [], s = 0, r = i[t].length; r > s; s++)i[t][s].h != e && o.push(i[t][s]);
                    i[t] = o
                }
                i[t] && 0 === i[t].length && delete i[t]
            } else delete i[t];
            return this
        }, t.prototype.dispatch = function (t) {
            if (this._handlers[t]) {
                var e = arguments, i = e.length;
                i > 3 && (e = Array.prototype.slice.call(e, 1));
                for (var o = this._handlers[t], s = o.length, r = 0; s > r;) {
                    switch (i) {
                        case 1:
                            o[r].h.call(o[r].ctx);
                            break;
                        case 2:
                            o[r].h.call(o[r].ctx, e[1]);
                            break;
                        case 3:
                            o[r].h.call(o[r].ctx, e[1], e[2]);
                            break;
                        default:
                            o[r].h.apply(o[r].ctx, e)
                    }
                    o[r].one ? (o.splice(r, 1), s--) : r++
                }
            }
            return this
        }, t.prototype.dispatchWithContext = function (t) {
            if (this._handlers[t]) {
                var e = arguments, i = e.length;
                i > 4 && (e = Array.prototype.slice.call(e, 1, e.length - 1));
                for (var o = e[e.length - 1], s = this._handlers[t], r = s.length, n = 0; r > n;) {
                    switch (i) {
                        case 1:
                            s[n].h.call(o);
                            break;
                        case 2:
                            s[n].h.call(o, e[1]);
                            break;
                        case 3:
                            s[n].h.call(o, e[1], e[2]);
                            break;
                        default:
                            s[n].h.apply(o, e)
                    }
                    s[n].one ? (s.splice(n, 1), r--) : n++
                }
            }
            return this
        }, t
    }), i("zrender/tool/log", ["require", "../config"], function (t) {
        var e = t("../config");
        return function () {
            if (0 !== e.debugMode)if (1 == e.debugMode)for (var t in arguments)throw new Error(arguments[t]); else if (e.debugMode > 1)for (var t in arguments)console.log(arguments[t])
        }
    }), i("zrender/tool/guid", [], function () {
        var t = 2311;
        return function () {
            return"zrender__" + t++
        }
    }), i("zrender/Handler", ["require", "./config", "./tool/env", "./tool/event", "./tool/util", "./tool/vector", "./tool/matrix", "./mixin/Eventful"], function (t) {
        "use strict";
        function e(t, e) {
            return function (i) {
                return t.call(e, i)
            }
        }

        function i(t, e) {
            return function (i, o, s) {
                return t.call(e, i, o, s)
            }
        }

        function o(t) {
            for (var i = u.length; i--;) {
                var o = u[i];
                t["_" + o + "Handler"] = e(g[o], t)
            }
        }

        function s(t, e, i) {
            if (this._draggingTarget && this._draggingTarget.id == t.id || t.isSilent())return!1;
            var o = this._event;
            if (t.isCover(e, i)) {
                t.hoverable && this.storage.addHover(t);
                for (var s = t.parent; s;) {
                    if (s.clipShape && !s.clipShape.isCover(this._mouseX, this._mouseY))return!1;
                    s = s.parent
                }
                return this._lastHover != t && (this._processOutShape(o), this._processDragLeave(o), this._lastHover = t, this._processDragEnter(o)), this._processOverShape(o), this._processDragOver(o), this._hasfound = 1, !0
            }
            return!1
        }

        var r = t("./config"), n = t("./tool/env"), a = t("./tool/event"), h = t("./tool/util"), l = t("./tool/vector"), d = t("./tool/matrix"), c = r.EVENT, p = t("./mixin/Eventful"), u = ["resize", "click", "dblclick", "mousewheel", "mousemove", "mouseout", "mouseup", "mousedown", "touchstart", "touchend", "touchmove"], g = {resize: function (t) {
            t = t || window.event, this._lastHover = null, this._isMouseDown = 0, this.dispatch(c.RESIZE, t)
        }, click: function (t) {
            t = this._zrenderEventFixed(t);
            var e = this._lastHover;
            (e && e.clickable || !e) && this._clickThreshold < 5 && this._dispatchAgency(e, c.CLICK, t), this._mousemoveHandler(t)
        }, dblclick: function (t) {
            t = t || window.event, t = this._zrenderEventFixed(t);
            var e = this._lastHover;
            (e && e.clickable || !e) && this._clickThreshold < 5 && this._dispatchAgency(e, c.DBLCLICK, t), this._mousemoveHandler(t)
        }, mousewheel: function (t) {
            t = this._zrenderEventFixed(t);
            var e = t.wheelDelta || -t.detail, i = e > 0 ? 1.1 : 1 / 1.1, o = this.painter.getLayers(), s = !1;
            for (var r in o)if ("hover" !== r) {
                var n = o[r], h = n.position;
                if (n.zoomable) {
                    n.__zoom = n.__zoom || 1;
                    var l = n.__zoom;
                    l *= i, l = Math.max(Math.min(n.maxZoom, l), n.minZoom), i = l / n.__zoom, n.__zoom = l, h[0] -= (this._mouseX - h[0]) * (i - 1), h[1] -= (this._mouseY - h[1]) * (i - 1), n.scale[0] *= i, n.scale[1] *= i, n.dirty = !0, s = !0, a.stop(t)
                }
            }
            s && this.painter.refresh(), this._dispatchAgency(this._lastHover, c.MOUSEWHEEL, t), this._mousemoveHandler(t)
        }, mousemove: function (t) {
            if (!this.painter.isLoading()) {
                this._clickThreshold++, t = this._zrenderEventFixed(t), this._lastX = this._mouseX, this._lastY = this._mouseY, this._mouseX = a.getX(t), this._mouseY = a.getY(t);
                var e = this._mouseX - this._lastX, i = this._mouseY - this._lastY;
                this._processDragStart(t), this._hasfound = 0, this._event = t, this._iterateAndFindHover(), this._hasfound || ((!this._draggingTarget || this._lastHover && this._lastHover != this._draggingTarget) && (this._processOutShape(t), this._processDragLeave(t)), this._lastHover = null, this.storage.delHover(), this.painter.clearHover());
                var o = "default";
                if (this._draggingTarget)this.storage.drift(this._draggingTarget.id, e, i), this._draggingTarget.modSelf(), this.storage.addHover(this._draggingTarget); else if (this._isMouseDown) {
                    var s = this.painter.getLayers(), r = !1;
                    for (var n in s)if ("hover" !== n) {
                        var h = s[n];
                        h.panable && (o = "move", h.position[0] += e, h.position[1] += i, r = !0, h.dirty = !0)
                    }
                    r && this.painter.refresh()
                }
                this._draggingTarget || this._hasfound && this._lastHover.draggable ? o = "move" : this._hasfound && this._lastHover.clickable && (o = "pointer"), this.root.style.cursor = o, this._dispatchAgency(this._lastHover, c.MOUSEMOVE, t), (this._draggingTarget || this._hasfound || this.storage.hasHoverShape()) && this.painter.refreshHover()
            }
        }, mouseout: function (t) {
            t = this._zrenderEventFixed(t);
            var e = t.toElement || t.relatedTarget;
            if (e != this.root)for (; e && 9 != e.nodeType;) {
                if (e == this.root)return void this._mousemoveHandler(t);
                e = e.parentNode
            }
            t.zrenderX = this._lastX, t.zrenderY = this._lastY, this.root.style.cursor = "default", this._isMouseDown = 0, this._processOutShape(t), this._processDrop(t), this._processDragEnd(t), this.painter.isLoading() || this.painter.refreshHover(), this.dispatch(c.GLOBALOUT, t)
        }, mousedown: function (t) {
            return this._clickThreshold = 0, 2 == this._lastDownButton ? (this._lastDownButton = t.button, void(this._mouseDownTarget = null)) : (this._lastMouseDownMoment = new Date, t = this._zrenderEventFixed(t), this._isMouseDown = 1, this._mouseDownTarget = this._lastHover, this._dispatchAgency(this._lastHover, c.MOUSEDOWN, t), void(this._lastDownButton = t.button))
        }, mouseup: function (t) {
            t = this._zrenderEventFixed(t), this.root.style.cursor = "default", this._isMouseDown = 0, this._clickThreshold = 0, this._mouseDownTarget = null, this._dispatchAgency(this._lastHover, c.MOUSEUP, t), this._processDrop(t), this._processDragEnd(t)
        }, touchstart: function (t) {
            t = this._zrenderEventFixed(t, !0), this._lastTouchMoment = new Date, this._mobildFindFixed(t), this._mousedownHandler(t)
        }, touchmove: function (t) {
            t = this._zrenderEventFixed(t, !0), this._mousemoveHandler(t), this._isDragging && a.stop(t)
        }, touchend: function (t) {
            t = this._zrenderEventFixed(t, !0), this._mouseupHandler(t);
            var e = new Date;
            e - this._lastTouchMoment < c.touchClickDelay && (this._mobildFindFixed(t), this._clickHandler(t), e - this._lastClickMoment < c.touchClickDelay / 2 && (this._dblclickHandler(t), this._lastHover && this._lastHover.clickable && a.stop(t)), this._lastClickMoment = e), this.painter.clearHover()
        }}, f = function (t, e, r) {
            p.call(this), this.root = t, this.storage = e, this.painter = r, this._lastX = this._lastY = this._mouseX = this._mouseY = 0, this._findHover = i(s, this), this._domHover = r.getDomHover(), o(this), window.addEventListener ? (window.addEventListener("resize", this._resizeHandler), n.os.tablet || n.os.phone ? (t.addEventListener("touchstart", this._touchstartHandler), t.addEventListener("touchmove", this._touchmoveHandler), t.addEventListener("touchend", this._touchendHandler)) : (t.addEventListener("click", this._clickHandler), t.addEventListener("dblclick", this._dblclickHandler), t.addEventListener("mousewheel", this._mousewheelHandler), t.addEventListener("mousemove", this._mousemoveHandler), t.addEventListener("mousedown", this._mousedownHandler), t.addEventListener("mouseup", this._mouseupHandler)), t.addEventListener("DOMMouseScroll", this._mousewheelHandler), t.addEventListener("mouseout", this._mouseoutHandler)) : (window.attachEvent("onresize", this._resizeHandler), t.attachEvent("onclick", this._clickHandler), t.ondblclick = this._dblclickHandler, t.attachEvent("onmousewheel", this._mousewheelHandler), t.attachEvent("onmousemove", this._mousemoveHandler), t.attachEvent("onmouseout", this._mouseoutHandler), t.attachEvent("onmousedown", this._mousedownHandler), t.attachEvent("onmouseup", this._mouseupHandler))
        };
        f.prototype.on = function (t, e) {
            return this.bind(t, e), this
        }, f.prototype.un = function (t, e) {
            return this.unbind(t, e), this
        }, f.prototype.trigger = function (t, e) {
            switch (t) {
                case c.RESIZE:
                case c.CLICK:
                case c.DBLCLICK:
                case c.MOUSEWHEEL:
                case c.MOUSEMOVE:
                case c.MOUSEDOWN:
                case c.MOUSEUP:
                case c.MOUSEOUT:
                    this["_" + t + "Handler"](e)
            }
        }, f.prototype.dispose = function () {
            var t = this.root;
            window.removeEventListener ? (window.removeEventListener("resize", this._resizeHandler), n.os.tablet || n.os.phone ? (t.removeEventListener("touchstart", this._touchstartHandler), t.removeEventListener("touchmove", this._touchmoveHandler), t.removeEventListener("touchend", this._touchendHandler)) : (t.removeEventListener("click", this._clickHandler), t.removeEventListener("dblclick", this._dblclickHandler), t.removeEventListener("mousewheel", this._mousewheelHandler), t.removeEventListener("mousemove", this._mousemoveHandler), t.removeEventListener("mousedown", this._mousedownHandler), t.removeEventListener("mouseup", this._mouseupHandler)), t.removeEventListener("DOMMouseScroll", this._mousewheelHandler), t.removeEventListener("mouseout", this._mouseoutHandler)) : (window.detachEvent("onresize", this._resizeHandler), t.detachEvent("onclick", this._clickHandler), t.detachEvent("dblclick", this._dblclickHandler), t.detachEvent("onmousewheel", this._mousewheelHandler), t.detachEvent("onmousemove", this._mousemoveHandler), t.detachEvent("onmouseout", this._mouseoutHandler), t.detachEvent("onmousedown", this._mousedownHandler), t.detachEvent("onmouseup", this._mouseupHandler)), this.root = this._domHover = this.storage = this.painter = null, this.un()
        }, f.prototype._processDragStart = function (t) {
            var e = this._lastHover;
            if (this._isMouseDown && e && e.draggable && !this._draggingTarget && this._mouseDownTarget == e) {
                if (e.dragEnableTime && new Date - this._lastMouseDownMoment < e.dragEnableTime)return;
                var i = e;
                this._draggingTarget = i, this._isDragging = 1, i.invisible = !0, this.storage.mod(i.id), this._dispatchAgency(i, c.DRAGSTART, t), this.painter.refresh()
            }
        }, f.prototype._processDragEnter = function (t) {
            this._draggingTarget && this._dispatchAgency(this._lastHover, c.DRAGENTER, t, this._draggingTarget)
        }, f.prototype._processDragOver = function (t) {
            this._draggingTarget && this._dispatchAgency(this._lastHover, c.DRAGOVER, t, this._draggingTarget)
        }, f.prototype._processDragLeave = function (t) {
            this._draggingTarget && this._dispatchAgency(this._lastHover, c.DRAGLEAVE, t, this._draggingTarget)
        }, f.prototype._processDrop = function (t) {
            this._draggingTarget && (this._draggingTarget.invisible = !1, this.storage.mod(this._draggingTarget.id), this.painter.refresh(), this._dispatchAgency(this._lastHover, c.DROP, t, this._draggingTarget))
        }, f.prototype._processDragEnd = function (t) {
            this._draggingTarget && (this._dispatchAgency(this._draggingTarget, c.DRAGEND, t), this._lastHover = null), this._isDragging = 0, this._draggingTarget = null
        }, f.prototype._processOverShape = function (t) {
            this._dispatchAgency(this._lastHover, c.MOUSEOVER, t)
        }, f.prototype._processOutShape = function (t) {
            this._dispatchAgency(this._lastHover, c.MOUSEOUT, t)
        }, f.prototype._dispatchAgency = function (t, e, i, o) {
            var s = "on" + e, r = {type: e, event: i, target: t, cancelBubble: !1}, n = t;
            for (o && (r.dragged = o); n && (n[s] && (r.cancelBubble = n[s](r)), n.dispatch(e, r), n = n.parent, !r.cancelBubble););
            t ? r.cancelBubble || this.dispatch(e, r) : o || this.dispatch(e, {type: e, event: i})
        }, f.prototype._iterateAndFindHover = function () {
            var t = d.create();
            return function () {
                for (var e, i, o = this.storage.getShapeList(), s = [0, 0], r = o.length - 1; r >= 0; r--) {
                    var n = o[r];
                    if (e !== n.zlevel && (i = this.painter.getLayer(n.zlevel, i), s[0] = this._mouseX, s[1] = this._mouseY, i.needTransform && (d.invert(t, i.transform), l.applyTransform(s, s, t))), this._findHover(n, s[0], s[1]))break
                }
            }
        }();
        var m = [
            {x: 10},
            {x: -20},
            {x: 10, y: 10},
            {y: -20}
        ];
        return f.prototype._mobildFindFixed = function (t) {
            this._lastHover = null, this._mouseX = t.zrenderX, this._mouseY = t.zrenderY, this._event = t, this._iterateAndFindHover();
            for (var e = 0; !this._lastHover && e < m.length; e++) {
                var i = m[e];
                i.x && (this._mouseX += i.x), i.y && (this._mouseX += i.y), this._iterateAndFindHover()
            }
            this._lastHover && (t.zrenderX = this._mouseX, t.zrenderY = this._mouseY)
        }, f.prototype._zrenderEventFixed = function (t, e) {
            if (t.zrenderFixed)return t;
            if (e) {
                var i = "touchend" != t.type ? t.targetTouches[0] : t.changedTouches[0];
                if (i) {
                    var o = this.root.getBoundingClientRect();
                    t.zrenderX = i.clientX - o.left, t.zrenderY = i.clientY - o.top
                }
            } else {
                t = t || window.event;
                var s = t.toElement || t.relatedTarget || t.srcElement || t.target;
                s && s != this._domHover && (t.zrenderX = ("undefined" != typeof t.offsetX ? t.offsetX : t.layerX) + s.offsetLeft, t.zrenderY = ("undefined" != typeof t.offsetY ? t.offsetY : t.layerY) + s.offsetTop)
            }
            return t.zrenderFixed = 1, t
        }, h.merge(f.prototype, p.prototype, !0), f
    }), i("zrender/Painter", ["require", "./config", "./tool/util", "./tool/log", "./tool/matrix", "./loadingEffect/Base", "./mixin/Transformable", "./shape/Image"], function (t) {
        "use strict";
        function e() {
            return!1
        }

        function i() {
        }

        function o(t, e, i) {
            var o = document.createElement(e), s = i._width, r = i._height;
            return o.style.position = "absolute", o.style.left = 0, o.style.top = 0, o.style.width = s + "px", o.style.height = r + "px", o.setAttribute("width", s * d), o.setAttribute("height", r * d), o.setAttribute("data-zr-dom-id", t), o
        }

        var s = t("./config"), r = t("./tool/util"), n = t("./tool/log"), a = t("./tool/matrix"), h = t("./loadingEffect/Base"), l = t("./mixin/Transformable"), d = window.devicePixelRatio || 1;
        d = Math.max(d, 1);
        var c = window.G_vmlCanvasManager, p = function (t, i) {
            this.root = t, this.storage = i, t.innerHTML = "", this._width = this._getWidth(), this._height = this._getHeight();
            var s = document.createElement("div");
            this._domRoot = s, s.style.position = "relative", s.style.overflow = "hidden", s.style.width = this._width + "px", s.style.height = this._height + "px", t.appendChild(s), this._layers = {}, this._zlevelList = [], this._layerConfig = {}, this._loadingEffect = new h({}), this.shapeToImage = this._createShapeToImageProcessor(), this._bgDom = o("bg", "div", this), s.appendChild(this._bgDom), this._bgDom.onselectstart = e, this._bgDom.style["-webkit-user-select"] = "none", this._bgDom.style["user-select"] = "none", this._bgDom.style["-webkit-touch-callout"] = "none";
            var r = new u("_zrender_hover_", this);
            this._layers.hover = r, s.appendChild(r.dom), r.initContext(), r.dom.onselectstart = e, r.dom.style["-webkit-user-select"] = "none", r.dom.style["user-select"] = "none", r.dom.style["-webkit-touch-callout"] = "none", this.refreshNextFrame = null
        };
        p.prototype.render = function (t) {
            return this.isLoading() && this.hideLoading(), this.refresh(t, !0), this
        }, p.prototype.refresh = function (t, e) {
            var i = this.storage.getShapeList(!0);
            return this._paintList(i, e), "function" == typeof t && t(), this
        }, p.prototype._paintList = function (t, e) {
            "undefined" == typeof e && (e = !1), this._updateLayerStatus(t);
            var i, o, r;
            for (var h in this._layers)"hover" !== h && (this._layers[h].unusedCount++, this._layers[h].updateTransform());
            for (var l = [], d = 0, p = t.length; p > d; d++) {
                var u = t[d];
                if (o !== u.zlevel && (i && (i.needTransform && r.restore(), r.flush && r.flush()), i = this.getLayer(u.zlevel), r = i.ctx, o = u.zlevel, i.unusedCount = 0, (i.dirty || e) && i.clear(), i.needTransform && (r.save(), i.setTransform(r))), u.__startClip && !c) {
                    var g = u.__startClip;
                    if (r.save(), g.needTransform) {
                        var f = g.transform;
                        a.invert(l, f), r.transform(f[0], f[1], f[2], f[3], f[4], f[5])
                    }
                    if (r.beginPath(), g.buildPath(r, g.style), r.clip(), g.needTransform) {
                        var f = l;
                        r.transform(f[0], f[1], f[2], f[3], f[4], f[5])
                    }
                }
                if ((i.dirty || e) && !u.invisible && (!u.onbrush || u.onbrush && !u.onbrush(r, !1)))if (s.catchBrushException)try {
                    u.brush(r, !1, this.refreshNextFrame)
                } catch (m) {
                    n(m, "brush error of " + u.type, u)
                } else u.brush(r, !1, this.refreshNextFrame);
                u.__stopClip && !c && r.restore(), u.__dirty = !1
            }
            i && (i.needTransform && r.restore(), r.flush && r.flush());
            for (var h in this._layers)if ("hover" !== h) {
                var _ = this._layers[h];
                _.dirty = !1, 1 == _.unusedCount && _.clear()
            }
        }, p.prototype.getLayer = function (t) {
            var e = this._layers[t];
            if (!e) {
                var i = this._zlevelList.length, o = null, s = -1;
                if (i > 0 && t > this._zlevelList[0]) {
                    for (s = 0; i - 1 > s && !(this._zlevelList[s] < t && this._zlevelList[s + 1] > t); s++);
                    o = this._layers[this._zlevelList[s]]
                }
                this._zlevelList.splice(s + 1, 0, t), e = new u(t, this);
                var n = o ? o.dom : this._bgDom;
                n.nextSibling ? n.parentNode.insertBefore(e.dom, n.nextSibling) : n.parentNode.appendChild(e.dom), e.initContext(), this._layers[t] = e, this._layerConfig[t] && r.merge(e, this._layerConfig[t], !0), e.updateTransform()
            }
            return e
        }, p.prototype.getLayers = function () {
            return this._layers
        }, p.prototype._updateLayerStatus = function (t) {
            var e = this._layers, i = {};
            for (var o in e)"hover" !== o && (i[o] = e[o].elCount, e[o].elCount = 0);
            for (var s = 0, r = t.length; r > s; s++) {
                var n = t[s], a = n.zlevel, h = e[a];
                if (h) {
                    if (h.elCount++, h.dirty)continue;
                    h.dirty = n.__dirty
                }
            }
            for (var o in e)"hover" !== o && i[o] !== e[o].elCount && (e[o].dirty = !0)
        }, p.prototype.refreshShapes = function (t, e) {
            for (var i = 0, o = t.length; o > i; i++) {
                var s = t[i];
                s.modSelf()
            }
            return this.refresh(e), this
        }, p.prototype.setLoadingEffect = function (t) {
            return this._loadingEffect = t, this
        }, p.prototype.clear = function () {
            for (var t in this._layers)"hover" != t && this._layers[t].clear();
            return this
        }, p.prototype.modLayer = function (t, e) {
            if (e) {
                this._layerConfig[t] ? r.merge(this._layerConfig[t], e, !0) : this._layerConfig[t] = e;
                var i = this._layers[t];
                i && r.merge(i, this._layerConfig[t], !0)
            }
        }, p.prototype.delLayer = function (t) {
            var e = this._layers[t];
            e && (this.modLayer(t, {position: e.position, rotation: e.rotation, scale: e.scale}), e.dom.parentNode.removeChild(e.dom), delete this._layers[t], this._zlevelList.splice(r.indexOf(this._zlevelList, t), 1))
        }, p.prototype.refreshHover = function () {
            this.clearHover();
            for (var t = this.storage.getHoverShapes(!0), e = 0, i = t.length; i > e; e++)this._brushHover(t[e]);
            var o = this._layers.hover.ctx;
            return o.flush && o.flush(), this.storage.delHover(), this
        }, p.prototype.clearHover = function () {
            var t = this._layers.hover;
            return t && t.clear(), this
        }, p.prototype.showLoading = function (t) {
            return this._loadingEffect && this._loadingEffect.stop(), t && this.setLoadingEffect(t), this._loadingEffect.start(this), this.loading = !0, this
        }, p.prototype.hideLoading = function () {
            return this._loadingEffect.stop(), this.clearHover(), this.loading = !1, this
        }, p.prototype.isLoading = function () {
            return this.loading
        }, p.prototype.resize = function () {
            var t = this._domRoot;
            t.style.display = "none";
            var e = this._getWidth(), i = this._getHeight();
            if (t.style.display = "", this._width != e || i != this._height) {
                this._width = e, this._height = i, t.style.width = e + "px", t.style.height = i + "px";
                for (var o in this._layers)this._layers[o].resize(e, i);
                this.refresh(null, !0)
            }
            return this
        }, p.prototype.clearLayer = function (t) {
            var e = this._layers[t];
            e && e.clear()
        }, p.prototype.dispose = function () {
            this.isLoading() && this.hideLoading(), this.root.innerHTML = "", this.root = this.storage = this._domRoot = this._layers = null
        }, p.prototype.getDomHover = function () {
            return this._layers.hover.dom
        }, p.prototype.toDataURL = function (t, e, i) {
            if (c)return null;
            var r = o("image", "canvas", this);
            this._bgDom.appendChild(r);
            var a = r.getContext("2d");
            1 != d && a.scale(d, d), a.fillStyle = e || "#fff", a.rect(0, 0, this._width * d, this._height * d), a.fill();
            var h = this;
            this.storage.iterShape(function (t) {
                if (!t.invisible && (!t.onbrush || t.onbrush && !t.onbrush(a, !1)))if (s.catchBrushException)try {
                    t.brush(a, !1, h.refreshNextFrame)
                } catch (e) {
                    n(e, "brush error of " + t.type, t)
                } else t.brush(a, !1, h.refreshNextFrame)
            }, {normal: "up", update: !0});
            var l = r.toDataURL(t, i);
            return a = null, this._bgDom.removeChild(r), l
        }, p.prototype.getWidth = function () {
            return this._width
        }, p.prototype.getHeight = function () {
            return this._height
        }, p.prototype._getWidth = function () {
            var t = this.root, e = t.currentStyle || document.defaultView.getComputedStyle(t);
            return((t.clientWidth || parseInt(e.width, 10)) - parseInt(e.paddingLeft, 10) - parseInt(e.paddingRight, 10)).toFixed(0) - 0
        }, p.prototype._getHeight = function () {
            var t = this.root, e = t.currentStyle || document.defaultView.getComputedStyle(t);
            return((t.clientHeight || parseInt(e.height, 10)) - parseInt(e.paddingTop, 10) - parseInt(e.paddingBottom, 10)).toFixed(0) - 0
        }, p.prototype._brushHover = function (t) {
            var e = this._layers.hover.ctx;
            if (!t.onbrush || t.onbrush && !t.onbrush(e, !0)) {
                var i = this.getLayer(t.zlevel);
                if (i.needTransform && (e.save(), i.setTransform(e)), s.catchBrushException)try {
                    t.brush(e, !0, this.refreshNextFrame)
                } catch (o) {
                    n(o, "hoverBrush error of " + t.type, t)
                } else t.brush(e, !0, this.refreshNextFrame);
                i.needTransform && e.restore()
            }
        }, p.prototype._shapeToImage = function (e, i, o, s, r) {
            var n = document.createElement("canvas"), a = n.getContext("2d"), r = window.devicePixelRatio || 1;
            n.style.width = o + "px", n.style.height = s + "px", n.setAttribute("width", o * r), n.setAttribute("height", s * r), a.clearRect(0, 0, o * r, s * r);
            var h = {position: i.position, rotation: i.rotation, scale: i.scale};
            i.position = [0, 0, 0], i.rotation = 0, i.scale = [1, 1], i && i.brush(a, !1);
            var l = t("./shape/Image"), d = new l({id: e, style: {x: 0, y: 0, image: n}});
            return null != h.position && (d.position = i.position = h.position), null != h.rotation && (d.rotation = i.rotation = h.rotation), null != h.scale && (d.scale = i.scale = h.scale), d
        }, p.prototype._createShapeToImageProcessor = function () {
            if (c)return i;
            var t = this;
            return function (e, i, o, s) {
                return t._shapeToImage(e, i, o, s, d)
            }
        };
        var u = function (t, i) {
            this.dom = o(t, "canvas", i), this.dom.onselectstart = e, this.dom.style["-webkit-user-select"] = "none", this.dom.style["user-select"] = "none", this.dom.style["-webkit-touch-callout"] = "none", c && c.initElement(this.dom), this.domBack = null, this.ctxBack = null, this.painter = i, this.unusedCount = 0, this.config = null, this.dirty = !0, this.elCount = 0, this.clearColor = 0, this.motionBlur = !1, this.lastFrameAlpha = .7, this.zoomable = !1, this.panable = !1, this.maxZoom = 1 / 0, this.minZoom = 0, l.call(this)
        };
        return u.prototype.initContext = function () {
            this.ctx = this.dom.getContext("2d"), 1 != d && this.ctx.scale(d, d)
        }, u.prototype.createBackBuffer = function () {
            c || (this.domBack = o("back-" + this.id, "canvas", this.painter), this.ctxBack = this.domBack.getContext("2d"), 1 != d && this.ctxBack.scale(d, d))
        }, u.prototype.resize = function (t, e) {
            this.dom.style.width = t + "px", this.dom.style.height = e + "px", this.dom.setAttribute("width", t * d), this.dom.setAttribute("height", e * d), 1 != d && this.ctx.scale(d, d), this.domBack && (this.domBack.setAttribute("width", t * d), this.domBack.setAttribute("height", e * d), 1 != d && this.ctxBack.scale(d, d))
        }, u.prototype.clear = function () {
            var t = this.dom, e = this.ctx, i = t.width, o = t.height, s = this.clearColor && !c, r = this.motionBlur && !c, n = this.lastFrameAlpha;
            if (r && (this.domBack || this.createBackBuffer(), this.ctxBack.globalCompositeOperation = "copy", this.ctxBack.drawImage(t, 0, 0, i / d, o / d)), s ? (e.save(), e.fillStyle = this.config.clearColor, e.fillRect(0, 0, i / d, o / d), e.restore()) : e.clearRect(0, 0, i / d, o / d), r) {
                var a = this.domBack;
                e.save(), e.globalAlpha = n, e.drawImage(a, 0, 0, i / d, o / d), e.restore()
            }
        }, r.merge(u.prototype, l.prototype), p
    }), i("zrender/Storage", ["require", "./tool/util", "./Group"], function (t) {
        "use strict";
        function e(t, e) {
            return t.zlevel == e.zlevel ? t.z == e.z ? t.__renderidx - e.__renderidx : t.z - e.z : t.zlevel - e.zlevel
        }

        var i = t("./tool/util"), o = t("./Group"), s = {hover: !1, normal: "down", update: !1}, r = function () {
            this._elements = {}, this._hoverElements = [], this._roots = [], this._shapeList = [], this._shapeListOffset = 0
        };
        return r.prototype.iterShape = function (t, e) {
            if (e || (e = s), e.hover)for (var i = 0, o = this._hoverElements.length; o > i; i++) {
                var r = this._hoverElements[i];
                if (r.updateTransform(), t(r))return this
            }
            switch (e.update && this.updateShapeList(), e.normal) {
                case"down":
                    for (var o = this._shapeList.length; o--;)if (t(this._shapeList[o]))return this;
                    break;
                default:
                    for (var i = 0, o = this._shapeList.length; o > i; i++)if (t(this._shapeList[i]))return this
            }
            return this
        }, r.prototype.getHoverShapes = function (t) {
            for (var i = [], o = 0, s = this._hoverElements.length; s > o; o++) {
                i.push(this._hoverElements[o]);
                var r = this._hoverElements[o].hoverConnect;
                if (r) {
                    var n;
                    r = r instanceof Array ? r : [r];
                    for (var a = 0, h = r.length; h > a; a++)n = r[a].id ? r[a] : this.get(r[a]), n && i.push(n)
                }
            }
            if (i.sort(e), t)for (var o = 0, s = i.length; s > o; o++)i[o].updateTransform();
            return i
        }, r.prototype.getShapeList = function (t) {
            return t && this.updateShapeList(), this._shapeList
        }, r.prototype.updateShapeList = function () {
            this._shapeListOffset = 0;
            for (var t = 0, i = this._roots.length; i > t; t++) {
                var o = this._roots[t];
                this._updateAndAddShape(o)
            }
            this._shapeList.length = this._shapeListOffset;
            for (var t = 0, i = this._shapeList.length; i > t; t++)this._shapeList[t].__renderidx = t;
            this._shapeList.sort(e)
        }, r.prototype._updateAndAddShape = function (t, e) {
            if (!t.ignore)if (t.updateTransform(), "group" == t.type) {
                t.clipShape && (t.clipShape.parent = t, t.clipShape.updateTransform(), e ? (e = e.slice(), e.push(t.clipShape)) : e = [t.clipShape]);
                for (var i = 0; i < t._children.length; i++) {
                    var o = t._children[i];
                    o.__dirty = t.__dirty || o.__dirty, this._updateAndAddShape(o, e)
                }
                t.__dirty = !1
            } else t.__clipShapes = e, this._shapeList[this._shapeListOffset++] = t
        }, r.prototype.mod = function (t, e) {
            var o = this._elements[t];
            if (o && (o.modSelf(), e))if (e.parent || e._storage || e.__startClip) {
                var s = {};
                for (var r in e)"parent" != r && "_storage" != r && "__startClip" != r && e.hasOwnProperty(r) && (s[r] = e[r]);
                i.merge(o, s, !0)
            } else i.merge(o, e, !0);
            return this
        }, r.prototype.drift = function (t, e, i) {
            var o = this._elements[t];
            return o && (o.needTransform = !0, "horizontal" === o.draggable ? i = 0 : "vertical" === o.draggable && (e = 0), (!o.ondrift || o.ondrift && !o.ondrift(e, i)) && o.drift(e, i)), this
        }, r.prototype.addHover = function (t) {
            return t.updateNeedTransform(), this._hoverElements.push(t), this
        }, r.prototype.delHover = function () {
            return this._hoverElements = [], this
        }, r.prototype.hasHoverShape = function () {
            return this._hoverElements.length > 0
        }, r.prototype.addRoot = function (t) {
            t instanceof o && t.addChildrenToStorage(this), this.addToMap(t), this._roots.push(t)
        }, r.prototype.delRoot = function (t) {
            if ("undefined" == typeof t) {
                for (var e = 0; e < this._roots.length; e++) {
                    var s = this._roots[e];
                    s instanceof o && s.delChildrenFromStorage(this)
                }
                return this._elements = {}, this._hoverElements = [], this._roots = [], this._shapeList = [], void(this._shapeListOffset = 0)
            }
            if (t instanceof Array)for (var e = 0, r = t.length; r > e; e++)this.delRoot(t[e]); else {
                var n;
                n = "string" == typeof t ? this._elements[t] : t;
                var a = i.indexOf(this._roots, n);
                a >= 0 && (this.delFromMap(n.id), this._roots.splice(a, 1), n instanceof o && n.delChildrenFromStorage(this))
            }
        }, r.prototype.addToMap = function (t) {
            return t instanceof o && (t._storage = this), t.modSelf(), this._elements[t.id] = t, this
        }, r.prototype.get = function (t) {
            return this._elements[t]
        }, r.prototype.delFromMap = function (t) {
            var e = this._elements[t];
            return e && (delete this._elements[t], e instanceof o && (e._storage = null)), this
        }, r.prototype.dispose = function () {
            this._elements = this._renderList = this._roots = this._hoverElements = null
        }, r
    }), i("zrender/animation/Animation", ["require", "./Clip", "../tool/color", "../tool/util", "../tool/event"], function (t) {
        "use strict";
        function e(t, e) {
            return t[e]
        }

        function i(t, e, i) {
            t[e] = i
        }

        function o(t, e, i) {
            return(e - t) * i + t
        }

        function s(t, e, i, s, r) {
            var n = t.length;
            if (1 == r)for (var a = 0; n > a; a++)s[a] = o(t[a], e[a], i); else for (var h = t[0].length, a = 0; n > a; a++)for (var l = 0; h > l; l++)s[a][l] = o(t[a][l], e[a][l], i)
        }

        function r(t) {
            switch (typeof t) {
                case"undefined":
                case"string":
                    return!1
            }
            return"undefined" != typeof t.length
        }

        function n(t, e, i, o, s, r, n, h, l) {
            var d = t.length;
            if (1 == l)for (var c = 0; d > c; c++)h[c] = a(t[c], e[c], i[c], o[c], s, r, n); else for (var p = t[0].length, c = 0; d > c; c++)for (var u = 0; p > u; u++)h[c][u] = a(t[c][u], e[c][u], i[c][u], o[c][u], s, r, n)
        }

        function a(t, e, i, o, s, r, n) {
            var a = .5 * (i - t), h = .5 * (o - e);
            return(2 * (e - i) + a + h) * n + (-3 * (e - i) - 2 * a - h) * r + a * s + e
        }

        function h(t) {
            if (r(t)) {
                var e = t.length;
                if (r(t[0])) {
                    for (var i = [], o = 0; e > o; o++)i.push(f.call(t[o]));
                    return i
                }
                return f.call(t)
            }
            return t
        }

        function l(t) {
            return t[0] = Math.floor(t[0]), t[1] = Math.floor(t[1]), t[2] = Math.floor(t[2]), "rgba(" + t.join(",") + ")"
        }

        var d = t("./Clip"), c = t("../tool/color"), p = t("../tool/util"), u = t("../tool/event").Dispatcher, g = window.requestAnimationFrame || window.msRequestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function (t) {
            setTimeout(t, 16)
        }, f = Array.prototype.slice, m = function (t) {
            t = t || {}, this.stage = t.stage || {}, this.onframe = t.onframe || function () {
            }, this._clips = [], this._running = !1, this._time = 0, u.call(this)
        };
        m.prototype = {add: function (t) {
            this._clips.push(t)
        }, remove: function (t) {
            var e = p.indexOf(this._clips, t);
            e >= 0 && this._clips.splice(e, 1)
        }, _update: function () {
            for (var t = (new Date).getTime(), e = t - this._time, i = this._clips, o = i.length, s = [], r = [], n = 0; o > n; n++) {
                var a = i[n], h = a.step(t);
                h && (s.push(h), r.push(a))
            }
            this.stage.update && this.stage.update();
            for (var n = 0; o > n;)i[n]._needsRemove ? (i[n] = i[o - 1], i.pop(), o--) : n++;
            o = s.length;
            for (var n = 0; o > n; n++)r[n].fire(s[n]);
            this._time = t, this.onframe(e), this.dispatch("frame", e)
        }, start: function () {
            function t() {
                e._running && (e._update(), g(t))
            }

            var e = this;
            this._running = !0, this._time = (new Date).getTime(), g(t)
        }, stop: function () {
            this._running = !1
        }, clear: function () {
            this._clips = []
        }, animate: function (t, e) {
            e = e || {};
            var i = new _(t, e.loop, e.getter, e.setter);
            return i.animation = this, i
        }, constructor: m}, p.merge(m.prototype, u.prototype, !0);
        var _ = function (t, o, s, r) {
            this._tracks = {}, this._target = t, this._loop = o || !1, this._getter = s || e, this._setter = r || i, this._clipCount = 0, this._delay = 0, this._doneList = [], this._onframeList = [], this._clipList = []
        };
        return _.prototype = {when: function (t, e) {
            for (var i in e)this._tracks[i] || (this._tracks[i] = [], 0 !== t && this._tracks[i].push({time: 0, value: h(this._getter(this._target, i))})), this._tracks[i].push({time: parseInt(t, 10), value: e[i]});
            return this
        }, during: function (t) {
            return this._onframeList.push(t), this
        }, start: function (t) {
            var e = this, i = this._setter, h = this._getter, p = "spline" === t, u = function () {
                if (e._clipCount--, 0 === e._clipCount) {
                    e._tracks = {};
                    for (var t = e._doneList.length, i = 0; t > i; i++)e._doneList[i].call(e)
                }
            }, g = function (g, f) {
                var m = g.length;
                if (m) {
                    var _ = g[0].value, y = r(_), v = !1, x = y && r(_[0]) ? 2 : 1;
                    g.sort(function (t, e) {
                        return t.time - e.time
                    });
                    var b;
                    if (m) {
                        b = g[m - 1].time;
                        for (var T = [], S = [], C = 0; m > C; C++) {
                            T.push(g[C].time / b);
                            var z = g[C].value;
                            "string" == typeof z && (z = c.toArray(z), 0 === z.length && (z[0] = z[1] = z[2] = 0, z[3] = 1), v = !0), S.push(z)
                        }
                        var w, C, E, L, A, M, k, I = 0, P = 0;
                        if (v)var O = [0, 0, 0, 0];
                        var R = function (t, r) {
                            if (P > r) {
                                for (w = Math.min(I + 1, m - 1), C = w; C >= 0 && !(T[C] <= r); C--);
                                C = Math.min(C, m - 2)
                            } else {
                                for (C = I; m > C && !(T[C] > r); C++);
                                C = Math.min(C - 1, m - 2)
                            }
                            I = C, P = r;
                            var d = T[C + 1] - T[C];
                            if (0 !== d) {
                                if (E = (r - T[C]) / d, p)if (A = S[C], L = S[0 === C ? C : C - 1], M = S[C > m - 2 ? m - 1 : C + 1], k = S[C > m - 3 ? m - 1 : C + 2], y)n(L, A, M, k, E, E * E, E * E * E, h(t, f), x); else {
                                    var c;
                                    v ? (c = n(L, A, M, k, E, E * E, E * E * E, O, 1), c = l(O)) : c = a(L, A, M, k, E, E * E, E * E * E), i(t, f, c)
                                } else if (y)s(S[C], S[C + 1], E, h(t, f), x); else {
                                    var c;
                                    v ? (s(S[C], S[C + 1], E, O, 1), c = l(O)) : c = o(S[C], S[C + 1], E), i(t, f, c)
                                }
                                for (C = 0; C < e._onframeList.length; C++)e._onframeList[C](t, r)
                            }
                        }, D = new d({target: e._target, life: b, loop: e._loop, delay: e._delay, onframe: R, ondestroy: u});
                        t && "spline" !== t && (D.easing = t), e._clipList.push(D), e._clipCount++, e.animation.add(D)
                    }
                }
            };
            for (var f in this._tracks)g(this._tracks[f], f);
            return this
        }, stop: function () {
            for (var t = 0; t < this._clipList.length; t++) {
                var e = this._clipList[t];
                this.animation.remove(e)
            }
            this._clipList = []
        }, delay: function (t) {
            return this._delay = t, this
        }, done: function (t) {
            return t && this._doneList.push(t), this
        }}, m
    }), i("zrender/tool/vector", [], function () {
        var t = "undefined" == typeof Float32Array ? Array : Float32Array, e = {create: function (e, i) {
            var o = new t(2);
            return o[0] = e || 0, o[1] = i || 0, o
        }, copy: function (t, e) {
            return t[0] = e[0], t[1] = e[1], t
        }, set: function (t, e, i) {
            return t[0] = e, t[1] = i, t
        }, add: function (t, e, i) {
            return t[0] = e[0] + i[0], t[1] = e[1] + i[1], t
        }, scaleAndAdd: function (t, e, i, o) {
            return t[0] = e[0] + i[0] * o, t[1] = e[1] + i[1] * o, t
        }, sub: function (t, e, i) {
            return t[0] = e[0] - i[0], t[1] = e[1] - i[1], t
        }, len: function (t) {
            return Math.sqrt(this.lenSquare(t))
        }, lenSquare: function (t) {
            return t[0] * t[0] + t[1] * t[1]
        }, mul: function (t, e, i) {
            return t[0] = e[0] * i[0], t[1] = e[1] * i[1], t
        }, div: function (t, e, i) {
            return t[0] = e[0] / i[0], t[1] = e[1] / i[1], t
        }, dot: function (t, e) {
            return t[0] * e[0] + t[1] * e[1]
        }, scale: function (t, e, i) {
            return t[0] = e[0] * i, t[1] = e[1] * i, t
        }, normalize: function (t, i) {
            var o = e.len(i);
            return 0 === o ? (t[0] = 0, t[1] = 0) : (t[0] = i[0] / o, t[1] = i[1] / o), t
        }, distance: function (t, e) {
            return Math.sqrt((t[0] - e[0]) * (t[0] - e[0]) + (t[1] - e[1]) * (t[1] - e[1]))
        }, distanceSquare: function (t, e) {
            return(t[0] - e[0]) * (t[0] - e[0]) + (t[1] - e[1]) * (t[1] - e[1])
        }, negate: function (t, e) {
            return t[0] = -e[0], t[1] = -e[1], t
        }, lerp: function (t, e, i, o) {
            return t[0] = e[0] + o * (i[0] - e[0]), t[1] = e[1] + o * (i[1] - e[1]), t
        }, applyTransform: function (t, e, i) {
            var o = e[0], s = e[1];
            return t[0] = i[0] * o + i[2] * s + i[4], t[1] = i[1] * o + i[3] * s + i[5], t
        }, min: function (t, e, i) {
            return t[0] = Math.min(e[0], i[0]), t[1] = Math.min(e[1], i[1]), t
        }, max: function (t, e, i) {
            return t[0] = Math.max(e[0], i[0]), t[1] = Math.max(e[1], i[1]), t
        }};
        return e.length = e.len, e.lengthSquare = e.lenSquare, e.dist = e.distance, e.distSquare = e.distanceSquare, e
    }), i("zrender/tool/matrix", [], function () {
        var t = "undefined" == typeof Float32Array ? Array : Float32Array, e = {create: function () {
            var i = new t(6);
            return e.identity(i), i
        }, identity: function (t) {
            return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = 0, t[5] = 0, t
        }, copy: function (t, e) {
            return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t
        }, mul: function (t, e, i) {
            return t[0] = e[0] * i[0] + e[2] * i[1], t[1] = e[1] * i[0] + e[3] * i[1], t[2] = e[0] * i[2] + e[2] * i[3], t[3] = e[1] * i[2] + e[3] * i[3], t[4] = e[0] * i[4] + e[2] * i[5] + e[4], t[5] = e[1] * i[4] + e[3] * i[5] + e[5], t
        }, translate: function (t, e, i) {
            return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4] + i[0], t[5] = e[5] + i[1], t
        }, rotate: function (t, e, i) {
            var o = e[0], s = e[2], r = e[4], n = e[1], a = e[3], h = e[5], l = Math.sin(i), d = Math.cos(i);
            return t[0] = o * d + n * l, t[1] = -o * l + n * d, t[2] = s * d + a * l, t[3] = -s * l + d * a, t[4] = d * r + l * h, t[5] = d * h - l * r, t
        }, scale: function (t, e, i) {
            var o = i[0], s = i[1];
            return t[0] = e[0] * o, t[1] = e[1] * s, t[2] = e[2] * o, t[3] = e[3] * s, t[4] = e[4] * o, t[5] = e[5] * s, t
        }, invert: function (t, e) {
            var i = e[0], o = e[2], s = e[4], r = e[1], n = e[3], a = e[5], h = i * n - r * o;
            return h ? (h = 1 / h, t[0] = n * h, t[1] = -r * h, t[2] = -o * h, t[3] = i * h, t[4] = (o * a - n * s) * h, t[5] = (r * s - i * a) * h, t) : null
        }, mulVector: function (t, e, i) {
            var o = e[0], s = e[2], r = e[4], n = e[1], a = e[3], h = e[5];
            return t[0] = i[0] * o + i[1] * s + r, t[1] = i[0] * n + i[1] * a + h, t
        }};
        return e
    }), i("zrender/loadingEffect/Base", ["require", "../tool/util", "../shape/Text", "../shape/Rectangle"], function (t) {
        function e(t) {
            this.setOptions(t)
        }

        var i = t("../tool/util"), o = t("../shape/Text"), s = t("../shape/Rectangle"), r = "Loading...", n = "normal 16px Arial";
        return e.prototype.createTextShape = function (t) {
            return new o({highlightStyle: i.merge({x: this.canvasWidth / 2, y: this.canvasHeight / 2, text: r, textAlign: "center", textBaseline: "middle", textFont: n, color: "#333", brushType: "fill"}, t, !0)})
        }, e.prototype.createBackgroundShape = function (t) {
            return new s({highlightStyle: {x: 0, y: 0, width: this.canvasWidth, height: this.canvasHeight, brushType: "fill", color: t}})
        }, e.prototype.start = function (t) {
            function e(e) {
                t.storage.addHover(e)
            }

            function i() {
                t.refreshHover()
            }

            this.canvasWidth = t._width, this.canvasHeight = t._height, this.loadingTimer = this._start(e, i)
        }, e.prototype._start = function () {
            return setInterval(function () {
            }, 1e4)
        }, e.prototype.stop = function () {
            clearInterval(this.loadingTimer)
        }, e.prototype.setOptions = function (t) {
            this.options = t || {}
        }, e.prototype.adjust = function (t, e) {
            return t <= e[0] ? t = e[0] : t >= e[1] && (t = e[1]), t
        }, e.prototype.getLocation = function (t, e, i) {
            var o = null != t.x ? t.x : "center";
            switch (o) {
                case"center":
                    o = Math.floor((this.canvasWidth - e) / 2);
                    break;
                case"left":
                    o = 0;
                    break;
                case"right":
                    o = this.canvasWidth - e
            }
            var s = null != t.y ? t.y : "center";
            switch (s) {
                case"center":
                    s = Math.floor((this.canvasHeight - i) / 2);
                    break;
                case"top":
                    s = 0;
                    break;
                case"bottom":
                    s = this.canvasHeight - i
            }
            return{x: o, y: s, width: e, height: i}
        }, e
    }), i("zrender/mixin/Transformable", ["require", "../tool/matrix", "../tool/vector"], function (t) {
        "use strict";
        function e(t) {
            return t > -n && n > t
        }

        function i(t) {
            return t > n || -n > t
        }

        var o = t("../tool/matrix"), s = t("../tool/vector"), r = [0, 0], n = 5e-5, a = function () {
            this.position || (this.position = [0, 0]), "undefined" == typeof this.rotation && (this.rotation = [0, 0, 0]), this.scale || (this.scale = [1, 1, 0, 0]), this.needLocalTransform = !1, this.needTransform = !1
        };
        return a.prototype = {constructor: a, updateNeedTransform: function () {
            this.needLocalTransform = i(this.rotation[0]) || i(this.position[0]) || i(this.position[1]) || i(this.scale[0] - 1) || i(this.scale[1] - 1)
        }, updateTransform: function () {
            if (this.updateNeedTransform(), this.needTransform = this.parent ? this.needLocalTransform || this.parent.needTransform : this.needLocalTransform, this.needTransform) {
                var t = this.transform || o.create();
                if (o.identity(t), this.needLocalTransform) {
                    if (i(this.scale[0]) || i(this.scale[1])) {
                        r[0] = -this.scale[2] || 0, r[1] = -this.scale[3] || 0;
                        var e = i(r[0]) || i(r[1]);
                        e && o.translate(t, t, r), o.scale(t, t, this.scale), e && (r[0] = -r[0], r[1] = -r[1], o.translate(t, t, r))
                    }
                    if (this.rotation instanceof Array) {
                        if (0 !== this.rotation[0]) {
                            r[0] = -this.rotation[1] || 0, r[1] = -this.rotation[2] || 0;
                            var e = i(r[0]) || i(r[1]);
                            e && o.translate(t, t, r), o.rotate(t, t, this.rotation[0]), e && (r[0] = -r[0], r[1] = -r[1], o.translate(t, t, r))
                        }
                    } else 0 !== this.rotation && o.rotate(t, t, this.rotation);
                    (i(this.position[0]) || i(this.position[1])) && o.translate(t, t, this.position)
                }
                this.transform = t, this.parent && this.parent.needTransform && (this.needLocalTransform ? o.mul(this.transform, this.parent.transform, this.transform) : o.copy(this.transform, this.parent.transform))
            }
        }, setTransform: function (t) {
            if (this.needTransform) {
                var e = this.transform;
                t.transform(e[0], e[1], e[2], e[3], e[4], e[5])
            }
        }, lookAt: function () {
            var t = s.create();
            return function (i) {
                this.transform || (this.transform = o.create());
                var r = this.transform;
                s.sub(t, i, this.position), e(t[0]) && e(t[1]) || (s.normalize(t, t), r[2] = t[0] * this.scale[1], r[3] = t[1] * this.scale[1], r[0] = t[1] * this.scale[0], r[1] = -t[0] * this.scale[0], r[4] = this.position[0], r[5] = this.position[1], this.decomposeTransform())
            }
        }(), decomposeTransform: function () {
            if (this.transform) {
                var t = this.transform, e = t[0] * t[0] + t[1] * t[1], o = this.position, s = this.scale, r = this.rotation;
                i(e - 1) && (e = Math.sqrt(e));
                var n = t[2] * t[2] + t[3] * t[3];
                i(n - 1) && (n = Math.sqrt(n)), o[0] = t[4], o[1] = t[5], s[0] = e, s[1] = n, s[2] = s[3] = 0, r[0] = Math.atan2(-t[1] / n, t[0] / e), r[1] = r[2] = 0
            }
        }}, a
    }), i("zrender/shape/Text", ["require", "../tool/area", "./Base", "../tool/util"], function (t) {
        var e = t("../tool/area"), i = t("./Base"), o = function (t) {
            i.call(this, t)
        };
        return o.prototype = {type: "text", brush: function (t, i) {
            var o = this.style;
            if (i && (o = this.getHighlightStyle(o, this.highlightStyle || {})), "undefined" != typeof o.text && o.text !== !1) {
                t.save(), this.doClip(t), this.setContext(t, o), this.setTransform(t), o.textFont && (t.font = o.textFont), t.textAlign = o.textAlign || "start", t.textBaseline = o.textBaseline || "middle";
                var s, r = (o.text + "").split("\n"), n = e.getTextHeight("国", o.textFont), a = this.getRect(o), h = o.x;
                s = "top" == o.textBaseline ? a.y : "bottom" == o.textBaseline ? a.y + n : a.y + n / 2;
                for (var l = 0, d = r.length; d > l; l++) {
                    if (o.maxWidth)switch (o.brushType) {
                        case"fill":
                            t.fillText(r[l], h, s, o.maxWidth);
                            break;
                        case"stroke":
                            t.strokeText(r[l], h, s, o.maxWidth);
                            break;
                        case"both":
                            t.fillText(r[l], h, s, o.maxWidth), t.strokeText(r[l], h, s, o.maxWidth);
                            break;
                        default:
                            t.fillText(r[l], h, s, o.maxWidth)
                    } else switch (o.brushType) {
                        case"fill":
                            t.fillText(r[l], h, s);
                            break;
                        case"stroke":
                            t.strokeText(r[l], h, s);
                            break;
                        case"both":
                            t.fillText(r[l], h, s), t.strokeText(r[l], h, s);
                            break;
                        default:
                            t.fillText(r[l], h, s)
                    }
                    s += n
                }
                t.restore()
            }
        }, getRect: function (t) {
            if (t.__rect)return t.__rect;
            var i = e.getTextWidth(t.text, t.textFont), o = e.getTextHeight(t.text, t.textFont), s = t.x;
            "end" == t.textAlign || "right" == t.textAlign ? s -= i : "center" == t.textAlign && (s -= i / 2);
            var r;
            return r = "top" == t.textBaseline ? t.y : "bottom" == t.textBaseline ? t.y - o : t.y - o / 2, t.__rect = {x: s, y: r, width: i, height: o}, t.__rect
        }}, t("../tool/util").inherits(o, i), o
    }), i("zrender/shape/Rectangle", ["require", "./Base", "../tool/util"], function (t) {
        var e = t("./Base"), i = function (t) {
            e.call(this, t)
        };
        return i.prototype = {type: "rectangle", _buildRadiusPath: function (t, e) {
            var i, o, s, r, n = e.x, a = e.y, h = e.width, l = e.height, d = e.radius;
            "number" == typeof d ? i = o = s = r = d : d instanceof Array ? 1 === d.length ? i = o = s = r = d[0] : 2 === d.length ? (i = s = d[0], o = r = d[1]) : 3 === d.length ? (i = d[0], o = r = d[1], s = d[2]) : (i = d[0], o = d[1], s = d[2], r = d[3]) : i = o = s = r = 0;
            var c;
            i + o > h && (c = i + o, i *= h / c, o *= h / c), s + r > h && (c = s + r, s *= h / c, r *= h / c), o + s > l && (c = o + s, o *= l / c, s *= l / c), i + r > l && (c = i + r, i *= l / c, r *= l / c), t.moveTo(n + i, a), t.lineTo(n + h - o, a), 0 !== o && t.quadraticCurveTo(n + h, a, n + h, a + o), t.lineTo(n + h, a + l - s), 0 !== s && t.quadraticCurveTo(n + h, a + l, n + h - s, a + l), t.lineTo(n + r, a + l), 0 !== r && t.quadraticCurveTo(n, a + l, n, a + l - r), t.lineTo(n, a + i), 0 !== i && t.quadraticCurveTo(n, a, n + i, a)
        }, buildPath: function (t, e) {
            e.radius ? this._buildRadiusPath(t, e) : (t.moveTo(e.x, e.y), t.lineTo(e.x + e.width, e.y), t.lineTo(e.x + e.width, e.y + e.height), t.lineTo(e.x, e.y + e.height), t.lineTo(e.x, e.y)), t.closePath()
        }, getRect: function (t) {
            if (t.__rect)return t.__rect;
            var e;
            return e = "stroke" == t.brushType || "fill" == t.brushType ? t.lineWidth || 1 : 0, t.__rect = {x: Math.round(t.x - e / 2), y: Math.round(t.y - e / 2), width: t.width + e, height: t.height + e}, t.__rect
        }}, t("../tool/util").inherits(i, e), i
    }), i("zrender/tool/area", ["require", "./util", "./curve"], function (t) {
        "use strict";
        function e(t) {
            return t %= I, 0 > t && (t += I), t
        }

        function i(t, e, i, r) {
            if (!e || !t)return!1;
            var n = t.type;
            C = C || z.getContext();
            var a = o(t, e, i, r);
            if ("undefined" != typeof a)return a;
            if (t.buildPath && C.isPointInPath)return s(t, C, e, i, r);
            switch (n) {
                case"ellipse":
                    return!0;
                case"trochoid":
                    var h = "out" == e.location ? e.r1 + e.r2 + e.d : e.r1 - e.r2 + e.d;
                    return u(e, i, r, h);
                case"rose":
                    return u(e, i, r, e.maxr);
                default:
                    return!1
            }
        }

        function o(t, e, i, o) {
            var s = t.type;
            switch (s) {
                case"bezier-curve":
                    return"undefined" == typeof e.cpX2 ? h(e.xStart, e.yStart, e.cpX1, e.cpY1, e.xEnd, e.yEnd, e.lineWidth, i, o) : a(e.xStart, e.yStart, e.cpX1, e.cpY1, e.cpX2, e.cpY2, e.xEnd, e.yEnd, e.lineWidth, i, o);
                case"line":
                    return n(e.xStart, e.yStart, e.xEnd, e.yEnd, e.lineWidth, i, o);
                case"broken-line":
                    return d(e.pointList, e.lineWidth, i, o);
                case"ring":
                    return c(e.x, e.y, e.r0, e.r, i, o);
                case"circle":
                    return u(e.x, e.y, e.r, i, o);
                case"sector":
                    var r = e.startAngle * Math.PI / 180, l = e.endAngle * Math.PI / 180;
                    return e.clockWise || (r = -r, l = -l), g(e.x, e.y, e.r0, e.r, r, l, !e.clockWise, i, o);
                case"path":
                    return b(e.pathArray, Math.max(e.lineWidth, 5), e.brushType, i, o);
                case"polygon":
                case"star":
                case"isogon":
                    return f(e.pointList, i, o);
                case"text":
                    var m = e.__rect || t.getRect(e);
                    return p(m.x, m.y, m.width, m.height, i, o);
                case"rectangle":
                case"image":
                    return p(e.x, e.y, e.width, e.height, i, o)
            }
        }

        function s(t, e, i, o, s) {
            return e.beginPath(), t.buildPath(e, i), e.closePath(), e.isPointInPath(o, s)
        }

        function r(t, e, o, s) {
            return!i(t, e, o, s)
        }

        function n(t, e, i, o, s, r, n) {
            if (0 === s)return!1;
            var a = Math.max(s, 5), h = 0, l = t;
            if (n > e + a && n > o + a || e - a > n && o - a > n || r > t + a && r > i + a || t - a > r && i - a > r)return!1;
            if (t === i)return Math.abs(r - t) <= a / 2;
            h = (e - o) / (t - i), l = (t * o - i * e) / (t - i);
            var d = h * r - n + l, c = d * d / (h * h + 1);
            return a / 2 * a / 2 >= c
        }

        function a(t, e, i, o, s, r, n, a, h, l, d) {
            if (0 === h)return!1;
            var c = Math.max(h, 5);
            if (d > e + c && d > o + c && d > r + c && d > a + c || e - c > d && o - c > d && r - c > d && a - c > d || l > t + c && l > i + c && l > s + c && l > n + c || t - c > l && i - c > l && s - c > l && n - c > l)return!1;
            var p = w.cubicProjectPoint(t, e, i, o, s, r, n, a, l, d, null);
            return c / 2 >= p
        }

        function h(t, e, i, o, s, r, n, a, h) {
            if (0 === n)return!1;
            var l = Math.max(n, 5);
            if (h > e + l && h > o + l && h > r + l || e - l > h && o - l > h && r - l > h || a > t + l && a > i + l && a > s + l || t - l > a && i - l > a && s - l > a)return!1;
            var d = w.quadraticProjectPoint(t, e, i, o, s, r, a, h, null);
            return l / 2 >= d
        }

        function l(t, i, o, s, r, n, a, h, l) {
            if (0 === a)return!1;
            var d = Math.max(a, 5);
            h -= t, l -= i;
            var c = Math.sqrt(h * h + l * l);
            if (c - d > o || o > c + d)return!1;
            if (Math.abs(s - r) >= I)return!0;
            if (n) {
                var p = s;
                s = e(r), r = e(p)
            } else s = e(s), r = e(r);
            s > r && (r += I);
            var u = Math.atan2(l, h);
            return 0 > u && (u += I), u >= s && r >= u || u + I >= s && r >= u + I
        }

        function d(t, e, i, o) {
            for (var e = Math.max(e, 10), s = 0, r = t.length - 1; r > s; s++) {
                var a = t[s][0], h = t[s][1], l = t[s + 1][0], d = t[s + 1][1];
                if (n(a, h, l, d, e, i, o))return!0
            }
            return!1
        }

        function c(t, e, i, o, s, r) {
            var n = (s - t) * (s - t) + (r - e) * (r - e);
            return o * o > n && n > i * i
        }

        function p(t, e, i, o, s, r) {
            return s >= t && t + i >= s && r >= e && e + o >= r
        }

        function u(t, e, i, o, s) {
            return i * i > (o - t) * (o - t) + (s - e) * (s - e)
        }

        function g(t, e, i, o, s, r, n, a, h) {
            return l(t, e, (i + o) / 2, s, r, n, o - i, a, h)
        }

        function f(t, e, i) {
            for (var o = t.length, s = 0, r = 0, n = o - 1; o > r; r++) {
                var a = t[n][0], h = t[n][1], l = t[r][0], d = t[r][1];
                s += m(a, h, l, d, e, i), n = r
            }
            return 0 !== s
        }

        function m(t, e, i, o, s, r) {
            if (r > e && r > o || e > r && o > r)return 0;
            if (o == e)return 0;
            var n = e > o ? 1 : -1, a = (r - e) / (o - e), h = a * (i - t) + t;
            return h > s ? n : 0
        }

        function _() {
            var t = O[0];
            O[0] = O[1], O[1] = t
        }

        function y(t, e, i, o, s, r, n, a, h, l) {
            if (l > e && l > o && l > r && l > a || e > l && o > l && r > l && a > l)return 0;
            var d = w.cubicRootAt(e, o, r, a, l, P);
            if (0 === d)return 0;
            for (var c, p, u = 0, g = -1, f = 0; d > f; f++) {
                var m = P[f], y = w.cubicAt(t, i, s, n, m);
                h > y || (0 > g && (g = w.cubicExtrema(e, o, r, a, O), O[1] < O[0] && g > 1 && _(), c = w.cubicAt(e, o, r, a, O[0]), g > 1 && (p = w.cubicAt(e, o, r, a, O[1]))), u += 2 == g ? m < O[0] ? e > c ? 1 : -1 : m < O[1] ? c > p ? 1 : -1 : p > a ? 1 : -1 : m < O[0] ? e > c ? 1 : -1 : c > a ? 1 : -1)
            }
            return u
        }

        function v(t, e, i, o, s, r, n, a) {
            if (a > e && a > o && a > r || e > a && o > a && r > a)return 0;
            var h = w.quadraticRootAt(e, o, r, a, P);
            if (0 === h)return 0;
            var l = w.quadraticExtremum(e, o, r);
            if (l >= 0 && 1 >= l) {
                for (var d = 0, c = w.quadraticAt(e, o, r, l), p = 0; h > p; p++) {
                    var u = w.quadraticAt(t, i, s, P[p]);
                    u > n || (d += P[p] < l ? e > c ? 1 : -1 : c > r ? 1 : -1)
                }
                return d
            }
            var u = w.quadraticAt(t, i, s, P[0]);
            return u > n ? 0 : e > r ? 1 : -1
        }

        function x(t, i, o, s, r, n, a, h) {
            if (h -= i, h > o || -o > h)return 0;
            var l = Math.sqrt(o * o - h * h);
            if (P[0] = -l, P[1] = l, Math.abs(s - r) >= I) {
                s = 0, r = I;
                var d = n ? 1 : -1;
                return a >= P[0] + t && a <= P[1] + t ? d : 0
            }
            if (n) {
                var l = s;
                s = e(r), r = e(l)
            } else s = e(s), r = e(r);
            s > r && (r += I);
            for (var c = 0, p = 0; 2 > p; p++) {
                var u = P[p];
                if (u + t > a) {
                    var g = Math.atan2(h, u), d = n ? 1 : -1;
                    0 > g && (g = I + g), (g >= s && r >= g || g + I >= s && r >= g + I) && (g > Math.PI / 2 && g < 1.5 * Math.PI && (d = -d), c += d)
                }
            }
            return c
        }

        function b(t, e, i, o, s) {
            var r = 0, d = 0, c = 0, p = 0, u = 0, g = !0, f = !0;
            i = i || "fill";
            for (var _ = "stroke" === i || "both" === i, b = "fill" === i || "both" === i, T = 0; T < t.length; T++) {
                var S = t[T], C = S.points;
                if (g || "M" === S.command) {
                    if (T > 0 && (b && (r += m(d, c, p, u, o, s)), 0 !== r))return!0;
                    p = C[C.length - 2], u = C[C.length - 1], g = !1, f && "A" !== S.command && (f = !1, d = p, c = u)
                }
                switch (S.command) {
                    case"M":
                        d = C[0], c = C[1];
                        break;
                    case"L":
                        if (_ && n(d, c, C[0], C[1], e, o, s))return!0;
                        b && (r += m(d, c, C[0], C[1], o, s)), d = C[0], c = C[1];
                        break;
                    case"C":
                        if (_ && a(d, c, C[0], C[1], C[2], C[3], C[4], C[5], e, o, s))return!0;
                        b && (r += y(d, c, C[0], C[1], C[2], C[3], C[4], C[5], o, s)), d = C[4], c = C[5];
                        break;
                    case"Q":
                        if (_ && h(d, c, C[0], C[1], C[2], C[3], e, o, s))return!0;
                        b && (r += v(d, c, C[0], C[1], C[2], C[3], o, s)), d = C[2], c = C[3];
                        break;
                    case"A":
                        var z = C[0], w = C[1], E = C[2], L = C[3], A = C[4], M = C[5], k = Math.cos(A) * E + z, I = Math.sin(A) * L + w;
                        f ? (f = !1, p = k, u = I) : r += m(d, c, k, I);
                        var P = (o - z) * L / E + z;
                        if (_ && l(z, w, L, A, A + M, 1 - C[7], e, P, s))return!0;
                        b && (r += x(z, w, L, A, A + M, 1 - C[7], P, s)), d = Math.cos(A + M) * E + z, c = Math.sin(A + M) * L + w;
                        break;
                    case"z":
                        if (_ && n(d, c, p, u, e, o, s))return!0;
                        g = !0
                }
            }
            return b && (r += m(d, c, p, u, o, s)), 0 !== r
        }

        function T(t, e) {
            var i = t + ":" + e;
            if (E[i])return E[i];
            C = C || z.getContext(), C.save(), e && (C.font = e), t = (t + "").split("\n");
            for (var o = 0, s = 0, r = t.length; r > s; s++)o = Math.max(C.measureText(t[s]).width, o);
            return C.restore(), E[i] = o, ++A > k && (A = 0, E = {}), o
        }

        function S(t, e) {
            var i = t + ":" + e;
            if (L[i])return L[i];
            C = C || z.getContext(), C.save(), e && (C.font = e), t = (t + "").split("\n");
            var o = (C.measureText("国").width + 2) * t.length;
            return C.restore(), L[i] = o, ++M > k && (M = 0, L = {}), o
        }

        var C, z = t("./util"), w = t("./curve"), E = {}, L = {}, A = 0, M = 0, k = 5e3, I = 2 * Math.PI, P = [-1, -1, -1], O = [-1, -1];
        return{isInside: i, isOutside: r, getTextWidth: T, getTextHeight: S, isInsidePath: b, isInsidePolygon: f, isInsideSector: g, isInsideCircle: u, isInsideLine: n, isInsideRect: p, isInsideBrokenLine: d, isInsideCubicStroke: a, isInsideQuadraticStroke: h}
    }), i("zrender/shape/Base", ["require", "../tool/matrix", "../tool/guid", "../tool/util", "../tool/log", "../mixin/Transformable", "../mixin/Eventful", "../tool/area", "../tool/color"], function (t) {
        function e(e, o, s, r, n, a, h) {
            n && (e.font = n), e.textAlign = a, e.textBaseline = h;
            var l = i(o, s, r, n, a, h);
            o = (o + "").split("\n");
            var d = t("../tool/area").getTextHeight("国", n);
            switch (h) {
                case"top":
                    r = l.y;
                    break;
                case"bottom":
                    r = l.y + d;
                    break;
                default:
                    r = l.y + d / 2
            }
            for (var c = 0, p = o.length; p > c; c++)e.fillText(o[c], s, r), r += d
        }

        function i(e, i, o, s, r, n) {
            var a = t("../tool/area"), h = a.getTextWidth(e, s), l = a.getTextHeight("国", s);
            switch (e = (e + "").split("\n"), r) {
                case"end":
                case"right":
                    i -= h;
                    break;
                case"center":
                    i -= h / 2
            }
            switch (n) {
                case"top":
                    break;
                case"bottom":
                    o -= l * e.length;
                    break;
                default:
                    o -= l * e.length / 2
            }
            return{x: i, y: o, width: h, height: l * e.length}
        }

        var o = window.G_vmlCanvasManager, s = t("../tool/matrix"), r = t("../tool/guid"), n = t("../tool/util"), a = t("../tool/log"), h = t("../mixin/Transformable"), l = t("../mixin/Eventful"), d = function (t) {
            t = t || {}, this.id = t.id || r();
            for (var e in t)this[e] = t[e];
            this.style = this.style || {}, this.highlightStyle = this.highlightStyle || null, this.parent = null, this.__dirty = !0, this.__clipShapes = [], h.call(this), l.call(this)
        };
        d.prototype.invisible = !1, d.prototype.ignore = !1, d.prototype.zlevel = 0, d.prototype.draggable = !1, d.prototype.clickable = !1, d.prototype.hoverable = !0, d.prototype.z = 0, d.prototype.brush = function (t, e) {
            var i = this.beforeBrush(t, e);
            switch (t.beginPath(), this.buildPath(t, i), i.brushType) {
                case"both":
                    t.fill();
                case"stroke":
                    i.lineWidth > 0 && t.stroke();
                    break;
                default:
                    t.fill()
            }
            this.drawText(t, i, this.style), this.afterBrush(t)
        }, d.prototype.beforeBrush = function (t, e) {
            var i = this.style;
            return this.brushTypeOnly && (i.brushType = this.brushTypeOnly), e && (i = this.getHighlightStyle(i, this.highlightStyle || {}, this.brushTypeOnly)), "stroke" == this.brushTypeOnly && (i.strokeColor = i.strokeColor || i.color), t.save(), this.doClip(t), this.setContext(t, i), this.setTransform(t), i
        }, d.prototype.afterBrush = function (t) {
            t.restore()
        };
        var c = [
            ["color", "fillStyle"],
            ["strokeColor", "strokeStyle"],
            ["opacity", "globalAlpha"],
            ["lineCap", "lineCap"],
            ["lineJoin", "lineJoin"],
            ["miterLimit", "miterLimit"],
            ["lineWidth", "lineWidth"],
            ["shadowBlur", "shadowBlur"],
            ["shadowColor", "shadowColor"],
            ["shadowOffsetX", "shadowOffsetX"],
            ["shadowOffsetY", "shadowOffsetY"]
        ];
        d.prototype.setContext = function (t, e) {
            for (var i = 0, o = c.length; o > i; i++) {
                var s = c[i][0], r = e[s], n = c[i][1];
                "undefined" != typeof r && (t[n] = r)
            }
        };
        var p = s.create();
        return d.prototype.doClip = function (t) {
            if (this.__clipShapes && !o)for (var e = 0; e < this.__clipShapes.length; e++) {
                var i = this.__clipShapes[e];
                if (i.needTransform) {
                    var r = i.transform;
                    s.invert(p, r), t.transform(r[0], r[1], r[2], r[3], r[4], r[5])
                }
                if (t.beginPath(), i.buildPath(t, i.style), t.clip(), i.needTransform) {
                    var r = p;
                    t.transform(r[0], r[1], r[2], r[3], r[4], r[5])
                }
            }
        }, d.prototype.getHighlightStyle = function (e, i, o) {
            var s = {};
            for (var r in e)s[r] = e[r];
            var n = t("../tool/color"), a = n.getHighlightColor();
            "stroke" != e.brushType ? (s.strokeColor = a, s.lineWidth = (e.lineWidth || 1) + this.getHighlightZoom(), s.brushType = "both") : "stroke" != o ? (s.strokeColor = a, s.lineWidth = (e.lineWidth || 1) + this.getHighlightZoom()) : s.strokeColor = i.strokeColor || n.mix(e.strokeColor, n.toRGB(a));
            for (var r in i)"undefined" != typeof i[r] && (s[r] = i[r]);
            return s
        }, d.prototype.getHighlightZoom = function () {
            return"text" != this.type ? 6 : 2
        }, d.prototype.drift = function (t, e) {
            this.position[0] += t, this.position[1] += e
        }, d.prototype.getTansform = function () {
            var t = [];
            return function (e, i) {
                var o = [e, i];
                return this.needTransform && this.transform && (s.invert(t, this.transform), s.mulVector(o, t, [e, i, 1]), e == o[0] && i == o[1] && this.updateNeedTransform()), o
            }
        }(), d.prototype.buildPath = function () {
            a("buildPath not implemented in " + this.type)
        }, d.prototype.getRect = function () {
            a("getRect not implemented in " + this.type)
        }, d.prototype.isCover = function (e, i) {
            var o = this.getTansform(e, i);
            e = o[0], i = o[1];
            var s = this.style.__rect;
            return s || (s = this.style.__rect = this.getRect(this.style)), e >= s.x && e <= s.x + s.width && i >= s.y && i <= s.y + s.height ? t("../tool/area").isInside(this, this.style, e, i) : !1
        }, d.prototype.drawText = function (t, i, o) {
            if ("undefined" != typeof i.text && i.text !== !1) {
                var s = i.textColor || i.color || i.strokeColor;
                t.fillStyle = s;
                var r, n, a, h, l = 10, d = i.textPosition || this.textPosition || "top";
                switch (d) {
                    case"inside":
                    case"top":
                    case"bottom":
                    case"left":
                    case"right":
                        if (this.getRect) {
                            var c = (o || i).__rect || this.getRect(o || i);
                            switch (d) {
                                case"inside":
                                    a = c.x + c.width / 2, h = c.y + c.height / 2, r = "center", n = "middle", "stroke" != i.brushType && s == i.color && (t.fillStyle = "#fff");
                                    break;
                                case"left":
                                    a = c.x - l, h = c.y + c.height / 2, r = "end", n = "middle";
                                    break;
                                case"right":
                                    a = c.x + c.width + l, h = c.y + c.height / 2, r = "start", n = "middle";
                                    break;
                                case"top":
                                    a = c.x + c.width / 2, h = c.y - l, r = "center", n = "bottom";
                                    break;
                                case"bottom":
                                    a = c.x + c.width / 2, h = c.y + c.height + l, r = "center", n = "top"
                            }
                        }
                        break;
                    case"start":
                    case"end":
                        var p, u, g, f;
                        if ("undefined" != typeof i.pointList) {
                            var m = i.pointList;
                            if (m.length < 2)return;
                            var _ = m.length;
                            switch (d) {
                                case"start":
                                    p = m[0][0], u = m[1][0], g = m[0][1], f = m[1][1];
                                    break;
                                case"end":
                                    p = m[_ - 2][0], u = m[_ - 1][0], g = m[_ - 2][1], f = m[_ - 1][1]
                            }
                        } else p = i.xStart || 0, u = i.xEnd || 0, g = i.yStart || 0, f = i.yEnd || 0;
                        switch (d) {
                            case"start":
                                r = u > p ? "end" : "start", n = f > g ? "bottom" : "top", a = p, h = g;
                                break;
                            case"end":
                                r = u > p ? "start" : "end", n = f > g ? "top" : "bottom", a = u, h = f
                        }
                        l -= 4, p != u ? a -= "end" == r ? l : -l : r = "center", g != f ? h -= "bottom" == n ? l : -l : n = "middle";
                        break;
                    case"specific":
                        a = i.textX || 0, h = i.textY || 0, r = "start", n = "middle"
                }
                null != a && null != h && e(t, i.text, a, h, i.textFont, i.textAlign || r, i.textBaseline || n)
            }
        }, d.prototype.modSelf = function () {
            this.__dirty = !0, this.style && (this.style.__rect = null), this.highlightStyle && (this.highlightStyle.__rect = null)
        }, d.prototype.isSilent = function () {
            return!(this.hoverable || this.draggable || this.clickable || this.onmousemove || this.onmouseover || this.onmouseout || this.onmousedown || this.onmouseup || this.onclick || this.ondragenter || this.ondragover || this.ondragleave || this.ondrop)
        }, n.merge(d.prototype, h.prototype, !0), n.merge(d.prototype, l.prototype, !0), d
    }), i("zrender/tool/curve", ["require", "./vector"], function (t) {
        function e(t) {
            return t > -f && f > t
        }

        function i(t) {
            return t > f || -f > t
        }

        function o(t, e, i, o, s) {
            var r = 1 - s;
            return r * r * (r * t + 3 * s * e) + s * s * (s * o + 3 * r * i)
        }

        function s(t, e, i, o, s) {
            var r = 1 - s;
            return 3 * (((e - t) * r + 2 * (i - e) * s) * r + (o - i) * s * s)
        }

        function r(t, i, o, s, r, n) {
            var a = s + 3 * (i - o) - t, h = 3 * (o - 2 * i + t), l = 3 * (i - t), d = t - r, c = h * h - 3 * a * l, p = h * l - 9 * a * d, u = l * l - 3 * h * d, g = 0;
            if (e(c) && e(p))if (e(h))n[0] = 0; else {
                var f = -l / h;
                f >= 0 && 1 >= f && (n[g++] = f)
            } else {
                var y = p * p - 4 * c * u;
                if (e(y)) {
                    var v = p / c, f = -h / a + v, x = -v / 2;
                    f >= 0 && 1 >= f && (n[g++] = f), x >= 0 && 1 >= x && (n[g++] = x)
                } else if (y > 0) {
                    var b = Math.sqrt(y), T = c * h + 1.5 * a * (-p + b), S = c * h + 1.5 * a * (-p - b);
                    T = 0 > T ? -Math.pow(-T, _) : Math.pow(T, _), S = 0 > S ? -Math.pow(-S, _) : Math.pow(S, _);
                    var f = (-h - (T + S)) / (3 * a);
                    f >= 0 && 1 >= f && (n[g++] = f)
                } else {
                    var C = (2 * c * h - 3 * a * p) / (2 * Math.sqrt(c * c * c)), z = Math.acos(C) / 3, w = Math.sqrt(c), E = Math.cos(z), f = (-h - 2 * w * E) / (3 * a), x = (-h + w * (E + m * Math.sin(z))) / (3 * a), L = (-h + w * (E - m * Math.sin(z))) / (3 * a);
                    f >= 0 && 1 >= f && (n[g++] = f), x >= 0 && 1 >= x && (n[g++] = x), L >= 0 && 1 >= L && (n[g++] = L)
                }
            }
            return g
        }

        function n(t, o, s, r, n) {
            var a = 6 * s - 12 * o + 6 * t, h = 9 * o + 3 * r - 3 * t - 9 * s, l = 3 * o - 3 * t, d = 0;
            if (e(h)) {
                if (i(a)) {
                    var c = -l / a;
                    c >= 0 && 1 >= c && (n[d++] = c)
                }
            } else {
                var p = a * a - 4 * h * l;
                if (e(p))n[0] = -a / (2 * h); else if (p > 0) {
                    var u = Math.sqrt(p), c = (-a + u) / (2 * h), g = (-a - u) / (2 * h);
                    c >= 0 && 1 >= c && (n[d++] = c), g >= 0 && 1 >= g && (n[d++] = g)
                }
            }
            return d
        }

        function a(t, e, i, o, s, r) {
            var n = (e - t) * s + t, a = (i - e) * s + e, h = (o - i) * s + i, l = (a - n) * s + n, d = (h - a) * s + a, c = (d - l) * s + l;
            r[0] = t, r[1] = n, r[2] = l, r[3] = c, r[4] = c, r[5] = d, r[6] = h, r[7] = o
        }

        function h(t, e, i, s, r, n, a, h, l, d, c) {
            var p, u = .005, m = 1 / 0;
            y[0] = l, y[1] = d;
            for (var _ = 0; 1 > _; _ += .05) {
                v[0] = o(t, i, r, a, _), v[1] = o(e, s, n, h, _);
                var b = g.distSquare(y, v);
                m > b && (p = _, m = b)
            }
            m = 1 / 0;
            for (var T = 0; 32 > T && !(f > u); T++) {
                var S = p - u, C = p + u;
                v[0] = o(t, i, r, a, S), v[1] = o(e, s, n, h, S);
                var b = g.distSquare(v, y);
                if (S >= 0 && m > b)p = S, m = b; else {
                    x[0] = o(t, i, r, a, C), x[1] = o(e, s, n, h, C);
                    var z = g.distSquare(x, y);
                    1 >= C && m > z ? (p = C, m = z) : u *= .5
                }
            }
            return c && (c[0] = o(t, i, r, a, p), c[1] = o(e, s, n, h, p)), Math.sqrt(m)
        }

        function l(t, e, i, o) {
            var s = 1 - o;
            return s * (s * t + 2 * o * e) + o * o * i
        }

        function d(t, e, i, o) {
            return 2 * ((1 - o) * (e - t) + o * (i - e))
        }

        function c(t, o, s, r, n) {
            var a = t - 2 * o + s, h = 2 * (o - t), l = t - r, d = 0;
            if (e(a)) {
                if (i(h)) {
                    var c = -l / h;
                    c >= 0 && 1 >= c && (n[d++] = c)
                }
            } else {
                var p = h * h - 4 * a * l;
                if (e(p)) {
                    var c = -h / (2 * a);
                    c >= 0 && 1 >= c && (n[d++] = c)
                } else if (p > 0) {
                    var u = Math.sqrt(p), c = (-h + u) / (2 * a), g = (-h - u) / (2 * a);
                    c >= 0 && 1 >= c && (n[d++] = c), g >= 0 && 1 >= g && (n[d++] = g)
                }
            }
            return d
        }

        function p(t, e, i) {
            var o = t + i - 2 * e;
            return 0 === o ? .5 : (t - e) / o
        }

        function u(t, e, i, o, s, r, n, a, h) {
            var d, c = .005, p = 1 / 0;
            y[0] = n, y[1] = a;
            for (var u = 0; 1 > u; u += .05) {
                v[0] = l(t, i, s, u), v[1] = l(e, o, r, u);
                var m = g.distSquare(y, v);
                p > m && (d = u, p = m)
            }
            p = 1 / 0;
            for (var _ = 0; 32 > _ && !(f > c); _++) {
                var b = d - c, T = d + c;
                v[0] = l(t, i, s, b), v[1] = l(e, o, r, b);
                var m = g.distSquare(v, y);
                if (b >= 0 && p > m)d = b, p = m; else {
                    x[0] = l(t, i, s, T), x[1] = l(e, o, r, T);
                    var S = g.distSquare(x, y);
                    1 >= T && p > S ? (d = T, p = S) : c *= .5
                }
            }
            return h && (h[0] = l(t, i, s, d), h[1] = l(e, o, r, d)), Math.sqrt(p)
        }

        var g = t("./vector"), f = 1e-4, m = Math.sqrt(3), _ = 1 / 3, y = g.create(), v = g.create(), x = g.create();
        return{cubicAt: o, cubicDerivativeAt: s, cubicRootAt: r, cubicExtrema: n, cubicSubdivide: a, cubicProjectPoint: h, quadraticAt: l, quadraticDerivativeAt: d, quadraticRootAt: c, quadraticExtremum: p, quadraticProjectPoint: u}
    }), i("zrender/Group", ["require", "./tool/guid", "./tool/util", "./mixin/Transformable", "./mixin/Eventful"], function (t) {
        var e = t("./tool/guid"), i = t("./tool/util"), o = t("./mixin/Transformable"), s = t("./mixin/Eventful"), r = function (t) {
            t = t || {}, this.id = t.id || e();
            for (var i in t)this[i] = t[i];
            this.type = "group", this.clipShape = null, this._children = [], this._storage = null, this.__dirty = !0, o.call(this), s.call(this)
        };
        return r.prototype.ignore = !1, r.prototype.children = function () {
            return this._children.slice()
        }, r.prototype.childAt = function (t) {
            return this._children[t]
        }, r.prototype.addChild = function (t) {
            t != this && t.parent != this && (t.parent && t.parent.removeChild(t), this._children.push(t), t.parent = this, this._storage && this._storage !== t._storage && (this._storage.addToMap(t), t instanceof r && t.addChildrenToStorage(this._storage)))
        }, r.prototype.removeChild = function (t) {
            var e = i.indexOf(this._children, t);
            this._children.splice(e, 1), t.parent = null, this._storage && (this._storage.delFromMap(t.id), t instanceof r && t.delChildrenFromStorage(this._storage))
        }, r.prototype.eachChild = function (t, e) {
            for (var i = !!e, o = 0; o < this._children.length; o++) {
                var s = this._children[o];
                i ? t.call(e, s) : t(s)
            }
        }, r.prototype.traverse = function (t, e) {
            for (var i = !!e, o = 0; o < this._children.length; o++) {
                var s = this._children[o];
                i ? t.call(e, s) : t(s), "group" === s.type && s.traverse(t, e)
            }
        }, r.prototype.addChildrenToStorage = function (t) {
            for (var e = 0; e < this._children.length; e++) {
                var i = this._children[e];
                t.addToMap(i), "group" === i.type && i.addChildrenToStorage(t)
            }
        }, r.prototype.delChildrenFromStorage = function (t) {
            for (var e = 0; e < this._children.length; e++) {
                var i = this._children[e];
                t.delFromMap(i.id), "group" === i.type && i.delChildrenFromStorage(t)
            }
        }, r.prototype.modSelf = function () {
            this.__dirty = !0
        }, i.merge(r.prototype, o.prototype, !0), i.merge(r.prototype, s.prototype, !0), r
    }), i("zrender/animation/Clip", ["require", "./easing"], function (t) {
        function e(t) {
            this._targetPool = t.target || {}, this._targetPool instanceof Array || (this._targetPool = [this._targetPool]), this._life = t.life || 1e3, this._delay = t.delay || 0, this._startTime = (new Date).getTime() + this._delay, this._endTime = this._startTime + 1e3 * this._life, this.loop = "undefined" == typeof t.loop ? !1 : t.loop, this.gap = t.gap || 0, this.easing = t.easing || "Linear", this.onframe = t.onframe, this.ondestroy = t.ondestroy, this.onrestart = t.onrestart
        }

        var i = t("./easing");
        return e.prototype = {step: function (t) {
            var e = (t - this._startTime) / this._life;
            if (!(0 > e)) {
                e = Math.min(e, 1);
                var o = "string" == typeof this.easing ? i[this.easing] : this.easing, s = "function" == typeof o ? o(e) : e;
                return this.fire("frame", s), 1 == e ? this.loop ? (this.restart(), "restart") : (this._needsRemove = !0, "destroy") : null
            }
        }, restart: function () {
            var t = (new Date).getTime(), e = (t - this._startTime) % this._life;
            this._startTime = (new Date).getTime() - e + this.gap, this._needsRemove = !1
        }, fire: function (t, e) {
            for (var i = 0, o = this._targetPool.length; o > i; i++)this["on" + t] && this["on" + t](this._targetPool[i], e)
        }, constructor: e}, e
    }), i("zrender/animation/easing", [], function () {
        var t = {Linear: function (t) {
            return t
        }, QuadraticIn: function (t) {
            return t * t
        }, QuadraticOut: function (t) {
            return t * (2 - t)
        }, QuadraticInOut: function (t) {
            return(t *= 2) < 1 ? .5 * t * t : -.5 * (--t * (t - 2) - 1)
        }, CubicIn: function (t) {
            return t * t * t
        }, CubicOut: function (t) {
            return--t * t * t + 1
        }, CubicInOut: function (t) {
            return(t *= 2) < 1 ? .5 * t * t * t : .5 * ((t -= 2) * t * t + 2)
        }, QuarticIn: function (t) {
            return t * t * t * t
        }, QuarticOut: function (t) {
            return 1 - --t * t * t * t
        }, QuarticInOut: function (t) {
            return(t *= 2) < 1 ? .5 * t * t * t * t : -.5 * ((t -= 2) * t * t * t - 2)
        }, QuinticIn: function (t) {
            return t * t * t * t * t
        }, QuinticOut: function (t) {
            return--t * t * t * t * t + 1
        }, QuinticInOut: function (t) {
            return(t *= 2) < 1 ? .5 * t * t * t * t * t : .5 * ((t -= 2) * t * t * t * t + 2)
        }, SinusoidalIn: function (t) {
            return 1 - Math.cos(t * Math.PI / 2)
        }, SinusoidalOut: function (t) {
            return Math.sin(t * Math.PI / 2)
        }, SinusoidalInOut: function (t) {
            return.5 * (1 - Math.cos(Math.PI * t))
        }, ExponentialIn: function (t) {
            return 0 === t ? 0 : Math.pow(1024, t - 1)
        }, ExponentialOut: function (t) {
            return 1 === t ? 1 : 1 - Math.pow(2, -10 * t)
        }, ExponentialInOut: function (t) {
            return 0 === t ? 0 : 1 === t ? 1 : (t *= 2) < 1 ? .5 * Math.pow(1024, t - 1) : .5 * (-Math.pow(2, -10 * (t - 1)) + 2)
        }, CircularIn: function (t) {
            return 1 - Math.sqrt(1 - t * t)
        }, CircularOut: function (t) {
            return Math.sqrt(1 - --t * t)
        }, CircularInOut: function (t) {
            return(t *= 2) < 1 ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t -= 2) * t) + 1)
        }, ElasticIn: function (t) {
            var e, i = .1, o = .4;
            return 0 === t ? 0 : 1 === t ? 1 : (!i || 1 > i ? (i = 1, e = o / 4) : e = o * Math.asin(1 / i) / (2 * Math.PI), -(i * Math.pow(2, 10 * (t -= 1)) * Math.sin(2 * (t - e) * Math.PI / o)))
        }, ElasticOut: function (t) {
            var e, i = .1, o = .4;
            return 0 === t ? 0 : 1 === t ? 1 : (!i || 1 > i ? (i = 1, e = o / 4) : e = o * Math.asin(1 / i) / (2 * Math.PI), i * Math.pow(2, -10 * t) * Math.sin(2 * (t - e) * Math.PI / o) + 1)
        }, ElasticInOut: function (t) {
            var e, i = .1, o = .4;
            return 0 === t ? 0 : 1 === t ? 1 : (!i || 1 > i ? (i = 1, e = o / 4) : e = o * Math.asin(1 / i) / (2 * Math.PI), (t *= 2) < 1 ? -.5 * i * Math.pow(2, 10 * (t -= 1)) * Math.sin(2 * (t - e) * Math.PI / o) : i * Math.pow(2, -10 * (t -= 1)) * Math.sin(2 * (t - e) * Math.PI / o) * .5 + 1)
        }, BackIn: function (t) {
            var e = 1.70158;
            return t * t * ((e + 1) * t - e)
        }, BackOut: function (t) {
            var e = 1.70158;
            return--t * t * ((e + 1) * t + e) + 1
        }, BackInOut: function (t) {
            var e = 2.5949095;
            return(t *= 2) < 1 ? .5 * t * t * ((e + 1) * t - e) : .5 * ((t -= 2) * t * ((e + 1) * t + e) + 2)
        }, BounceIn: function (e) {
            return 1 - t.BounceOut(1 - e)
        }, BounceOut: function (t) {
            return 1 / 2.75 > t ? 7.5625 * t * t : 2 / 2.75 > t ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : 2.5 / 2.75 > t ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375
        }, BounceInOut: function (e) {
            return.5 > e ? .5 * t.BounceIn(2 * e) : .5 * t.BounceOut(2 * e - 1) + .5
        }};
        return t
    }), i("echarts/component/base", ["require", "../config", "../util/ecData", "../util/ecQuery", "../util/number", "zrender/tool/util", "zrender/tool/env"], function (t) {
        function e(t, e, s, r, n) {
            this.ecTheme = t, this.messageCenter = e, this.zr = s, this.option = r, this.series = r.series, this.myChart = n, this.component = n.component, this._zlevelBase = this.getZlevelBase(), this.shapeList = [], this.effectList = [];
            var a = this;
            a._onlegendhoverlink = function (t) {
                if (a.legendHoverLink)for (var e, s = t.target, r = a.shapeList.length - 1; r >= 0; r--)e = a.type == i.CHART_TYPE_PIE || a.type == i.CHART_TYPE_FUNNEL ? o.get(a.shapeList[r], "name") : (o.get(a.shapeList[r], "series") || {}).name, e != s || a.shapeList[r].invisible || a.zr.addHoverShape(a.shapeList[r])
            }, e && e.bind(i.EVENT.LEGEND_HOVERLINK, this._onlegendhoverlink)
        }

        var i = t("../config"), o = t("../util/ecData"), s = t("../util/ecQuery"), r = t("../util/number"), n = t("zrender/tool/util");
        return e.prototype = {canvasSupported: t("zrender/tool/env").canvasSupported, getZlevelBase: function (t) {
            switch (t = t || this.type + "") {
                case i.COMPONENT_TYPE_GRID:
                case i.COMPONENT_TYPE_AXIS_CATEGORY:
                case i.COMPONENT_TYPE_AXIS_VALUE:
                case i.COMPONENT_TYPE_POLAR:
                    return 0;
                case i.CHART_TYPE_LINE:
                case i.CHART_TYPE_BAR:
                case i.CHART_TYPE_SCATTER:
                case i.CHART_TYPE_PIE:
                case i.CHART_TYPE_RADAR:
                case i.CHART_TYPE_MAP:
                case i.CHART_TYPE_K:
                case i.CHART_TYPE_CHORD:
                case i.CHART_TYPE_GUAGE:
                case i.CHART_TYPE_FUNNEL:
                case i.CHART_TYPE_EVENTRIVER:
                    return 2;
                case i.COMPONENT_TYPE_LEGEND:
                case i.COMPONENT_TYPE_DATARANGE:
                case i.COMPONENT_TYPE_DATAZOOM:
                case i.COMPONENT_TYPE_TIMELINE:
                case i.COMPONENT_TYPE_ROAMCONTROLLER:
                    return 4;
                case i.CHART_TYPE_ISLAND:
                    return 5;
                case i.COMPONENT_TYPE_TOOLBOX:
                case i.COMPONENT_TYPE_TITLE:
                    return 6;
                case i.COMPONENT_TYPE_TOOLTIP:
                    return 8;
                default:
                    return 0
            }
        }, reformOption: function (t) {
            return n.merge(t || {}, n.clone(this.ecTheme[this.type] || {}))
        }, reformCssArray: function (t) {
            if (!(t instanceof Array))return[t, t, t, t];
            switch (t.length + "") {
                case"4":
                    return t;
                case"3":
                    return[t[0], t[1], t[2], t[1]];
                case"2":
                    return[t[0], t[1], t[0], t[1]];
                case"1":
                    return[t[0], t[0], t[0], t[0]];
                case"0":
                    return[0, 0, 0, 0]
            }
        }, getShapeById: function (t) {
            for (var e = 0, i = this.shapeList.length; i > e; e++)if (this.shapeList[e].id === t)return this.shapeList[e];
            return null
        }, getFont: function (t) {
            var e = n.merge(n.clone(t) || {}, this.ecTheme.textStyle);
            return e.fontStyle + " " + e.fontWeight + " " + e.fontSize + "px " + e.fontFamily
        }, getItemStyleColor: function (t, e, i, o) {
            return"function" == typeof t ? t.call(this.myChart, {seriesIndex: e, series: this.series[e], dataIndex: i, data: o}) : t
        }, subPixelOptimize: function (t, e) {
            return t = e % 2 === 1 ? Math.floor(t) + .5 : Math.round(t)
        }, resize: function () {
            this.refresh && this.refresh(), this.clearEffectShape && this.clearEffectShape(!0);
            var t = this;
            setTimeout(function () {
                t.animationEffect && t.animationEffect()
            }, 200)
        }, clear: function () {
            this.clearEffectShape && this.clearEffectShape(), this.zr && this.zr.delShape(this.shapeList), this.shapeList = []
        }, dispose: function () {
            this.onbeforDispose && this.onbeforDispose(), this.clear(), this.shapeList = null, this.effectList = null, this.messageCenter && this.messageCenter.unbind(i.EVENT.LEGEND_HOVERLINK, this._onlegendhoverlink), this.onafterDispose && this.onafterDispose()
        }, query: s.query, deepQuery: s.deepQuery, deepMerge: s.deepMerge, parsePercent: r.parsePercent, parseCenter: r.parseCenter, parseRadius: r.parseRadius, numAddCommas: r.addCommas}, e
    }), i("echarts/chart/base", ["require", "zrender/shape/Image", "../util/shape/Icon", "../util/shape/MarkLine", "../util/shape/Symbol", "../config", "../util/ecData", "../util/ecAnimation", "../util/ecEffect", "../util/accMath", "zrender/tool/util", "zrender/tool/area"], function (t) {
        function e() {
            var t = this;
            this.selectedMap = {}, this.lastShapeList = [], this.shapeHandler = {onclick: function () {
                t.isClick = !0
            }, ondragover: function (e) {
                var i = e.target;
                i.highlightStyle = i.highlightStyle || {};
                var o = i.highlightStyle, s = o.brushTyep, r = o.strokeColor, n = o.lineWidth;
                o.brushType = "stroke", o.strokeColor = t.ecTheme.calculableColor, o.lineWidth = "icon" === i.type ? 30 : 10, t.zr.addHoverShape(i), setTimeout(function () {
                    i.highlightStyle && (i.highlightStyle.brushType = s, i.highlightStyle.strokeColor = r, i.highlightStyle.lineWidth = n)
                }, 20)
            }, ondrop: function (e) {
                null != a.get(e.dragged, "data") && (t.isDrop = !0)
            }, ondragend: function () {
                t.isDragend = !0
            }}
        }

        var i = t("zrender/shape/Image"), o = t("../util/shape/Icon"), s = t("../util/shape/MarkLine"), r = t("../util/shape/Symbol"), n = t("../config"), a = t("../util/ecData"), h = t("../util/ecAnimation"), l = t("../util/ecEffect"), d = t("../util/accMath"), c = t("zrender/tool/util"), p = t("zrender/tool/area");
        return e.prototype = {setCalculable: function (t) {
            return t.dragEnableTime = this.ecTheme.DRAG_ENABLE_TIME, t.ondragover = this.shapeHandler.ondragover, t.ondragend = this.shapeHandler.ondragend, t.ondrop = this.shapeHandler.ondrop, t
        }, ondrop: function (t, e) {
            if (this.isDrop && t.target && !e.dragIn) {
                var i, o = t.target, s = t.dragged, r = a.get(o, "seriesIndex"), h = a.get(o, "dataIndex"), l = this.series, c = this.component.legend;
                if (-1 === h) {
                    if (a.get(s, "seriesIndex") == r)return e.dragOut = e.dragIn = e.needRefresh = !0, void(this.isDrop = !1);
                    i = {value: a.get(s, "value"), name: a.get(s, "name")}, this.type === n.CHART_TYPE_PIE && i.value < 0 && (i.value = 0);
                    for (var p = !1, u = l[r].data, g = 0, f = u.length; f > g; g++)u[g].name === i.name && "-" === u[g].value && (l[r].data[g].value = i.value, p = !0);
                    !p && l[r].data.push(i), c && c.add(i.name, s.style.color || s.style.strokeColor)
                } else i = this.option.series[r].data[h] || "-", null != i.value ? (this.option.series[r].data[h].value = "-" != i.value ? d.accAdd(this.option.series[r].data[h].value, a.get(s, "value")) : a.get(s, "value"), (this.type === n.CHART_TYPE_FUNNEL || this.type === n.CHART_TYPE_PIE) && (c && 1 === c.getRelatedAmount(i.name) && this.component.legend.del(i.name), i.name += this.option.nameConnector + a.get(s, "name"), c && c.add(i.name, s.style.color || s.style.strokeColor))) : this.option.series[r].data[h] = "-" != i ? d.accAdd(this.option.series[r].data[h], a.get(s, "value")) : a.get(s, "value");
                e.dragIn = e.dragIn || !0, this.isDrop = !1;
                var m = this;
                setTimeout(function () {
                    m.zr.trigger("mousemove", t.event)
                }, 300)
            }
        }, ondragend: function (t, e) {
            if (this.isDragend && t.target && !e.dragOut) {
                var i = t.target, o = a.get(i, "seriesIndex"), s = a.get(i, "dataIndex"), r = this.series;
                if (null != r[o].data[s].value) {
                    r[o].data[s].value = "-";
                    var n = r[o].data[s].name;
                    this.component.legend && 0 === this.component.legend.getRelatedAmount(n) && this.component.legend.del(n)
                } else r[o].data[s] = "-";
                e.dragOut = !0, e.needRefresh = !0, this.isDragend = !1
            }
        }, onlegendSelected: function (t, e) {
            var i = t.selected;
            for (var o in this.selectedMap)this.selectedMap[o] != i[o] && (e.needRefresh = !0), this.selectedMap[o] = i[o]
        }, _bulidPosition: function () {
            this._symbol = this.option.symbolList, this._sIndex2ShapeMap = {}, this._sIndex2ColorMap = {}, this.selectedMap = {}, this.xMarkMap = {};
            for (var t, e, i, o, s = this.series, r = {top: [], bottom: [], left: [], right: [], other: []}, a = 0, h = s.length; h > a; a++)s[a].type === this.type && (s[a] = this.reformOption(s[a]), this.legendHoverLink = s[a].legendHoverLink || this.legendHoverLink, t = s[a].xAxisIndex, e = s[a].yAxisIndex, i = this.component.xAxis.getAxis(t), o = this.component.yAxis.getAxis(e), i.type === n.COMPONENT_TYPE_AXIS_CATEGORY ? r[i.getPosition()].push(a) : o.type === n.COMPONENT_TYPE_AXIS_CATEGORY ? r[o.getPosition()].push(a) : r.other.push(a));
            for (var l in r)r[l].length > 0 && this._buildSinglePosition(l, r[l]);
            this.addShapeList()
        }, _buildSinglePosition: function (t, e) {
            var i = this._mapData(e), o = i.locationMap, s = i.maxDataLength;
            if (0 !== s && 0 !== o.length) {
                switch (t) {
                    case"bottom":
                    case"top":
                        this._buildHorizontal(e, s, o, this.xMarkMap);
                        break;
                    case"left":
                    case"right":
                        this._buildVertical(e, s, o, this.xMarkMap);
                        break;
                    case"other":
                        this._buildOther(e, s, o, this.xMarkMap)
                }
                for (var r = 0, n = e.length; n > r; r++)this.buildMark(e[r])
            }
        }, _mapData: function (t) {
            for (var e, i, o, s, r = this.series, a = 0, h = {}, l = "__kener__stack__", d = this.component.legend, c = [], p = 0, u = 0, g = t.length; g > u; u++)e = r[t[u]], o = e.name, this._sIndex2ShapeMap[t[u]] = this._sIndex2ShapeMap[t[u]] || this.query(e, "symbol") || this._symbol[u % this._symbol.length], d ? (this.selectedMap[o] = d.isSelected(o), this._sIndex2ColorMap[t[u]] = d.getColor(o), s = d.getItemShape(o), s && (this.type == n.CHART_TYPE_LINE ? (s.style.iconType = "legendLineIcon", s.style.symbol = this._sIndex2ShapeMap[t[u]]) : e.itemStyle.normal.barBorderWidth > 0 && (s.style.x += 1, s.style.y += 1, s.style.width -= 2, s.style.height -= 2, s.style.strokeColor = s.highlightStyle.strokeColor = e.itemStyle.normal.barBorderColor, s.highlightStyle.lineWidth = 3, s.style.brushType = "both"), d.setItemShape(o, s))) : (this.selectedMap[o] = !0, this._sIndex2ColorMap[t[u]] = this.zr.getColor(t[u])), this.selectedMap[o] && (i = e.stack || l + t[u], null == h[i] ? (h[i] = a, c[a] = [t[u]], a++) : c[h[i]].push(t[u])), p = Math.max(p, e.data.length);
            return{locationMap: c, maxDataLength: p}
        }, _calculMarkMapXY: function (t, e, i) {
            for (var o = this.series, s = 0, r = e.length; r > s; s++)for (var n = 0, a = e[s].length; a > n; n++) {
                var h = e[s][n], l = "xy" == i ? 0 : "";
                if ("-1" != i.indexOf("x")) {
                    t[h]["counter" + l] > 0 && (t[h]["average" + l] = (t[h]["sum" + l] / t[h]["counter" + l]).toFixed(2) - 0);
                    var d = this.component.xAxis.getAxis(o[h].xAxisIndex || 0).getCoord(t[h]["average" + l]);
                    t[h]["averageLine" + l] = [
                        [d, this.component.grid.getYend()],
                        [d, this.component.grid.getY()]
                    ], t[h]["minLine" + l] = [
                        [t[h]["minX" + l], this.component.grid.getYend()],
                        [t[h]["minX" + l], this.component.grid.getY()]
                    ], t[h]["maxLine" + l] = [
                        [t[h]["maxX" + l], this.component.grid.getYend()],
                        [t[h]["maxX" + l], this.component.grid.getY()]
                    ], t[h].isHorizontal = !1
                }
                if (l = "xy" == i ? 1 : "", "-1" != i.indexOf("y")) {
                    t[h]["counter" + l] > 0 && (t[h]["average" + l] = (t[h]["sum" + l] / t[h]["counter" + l]).toFixed(2) - 0);
                    var c = this.component.yAxis.getAxis(o[h].yAxisIndex || 0).getCoord(t[h]["average" + l]);
                    t[h]["averageLine" + l] = [
                        [this.component.grid.getX(), c],
                        [this.component.grid.getXend(), c]
                    ], t[h]["minLine" + l] = [
                        [this.component.grid.getX(), t[h]["minY" + l]],
                        [this.component.grid.getXend(), t[h]["minY" + l]]
                    ], t[h]["maxLine" + l] = [
                        [this.component.grid.getX(), t[h]["maxY" + l]],
                        [this.component.grid.getXend(), t[h]["maxY" + l]]
                    ], t[h].isHorizontal = !0
                }
            }
        }, addLabel: function (t, e, i, o, s) {
            var r = [i, e], n = this.deepMerge(r, "itemStyle.normal.label"), a = this.deepMerge(r, "itemStyle.emphasis.label"), h = n.textStyle || {}, l = a.textStyle || {};
            return n.show && (t.style.text = this._getLabelText(e, i, o, "normal"), t.style.textPosition = null == n.position ? "horizontal" === s ? "right" : "top" : n.position, t.style.textColor = h.color, t.style.textFont = this.getFont(h)), a.show && (t.highlightStyle.text = this._getLabelText(e, i, o, "emphasis"), t.highlightStyle.textPosition = n.show ? t.style.textPosition : null == a.position ? "horizontal" === s ? "right" : "top" : a.position, t.highlightStyle.textColor = l.color, t.highlightStyle.textFont = this.getFont(l)), t
        }, _getLabelText: function (t, e, i, o) {
            var s = this.deepQuery([e, t], "itemStyle." + o + ".label.formatter");
            s || "emphasis" !== o || (s = this.deepQuery([e, t], "itemStyle.normal.label.formatter"));
            var r = null != e ? null != e.value ? e.value : e : "-";
            return s ? "function" == typeof s ? s.call(this.myChart, t.name, i, r) : "string" == typeof s ? (s = s.replace("{a}", "{a0}").replace("{b}", "{b0}").replace("{c}", "{c0}"), s = s.replace("{a0}", t.name).replace("{b0}", i).replace("{c0}", this.numAddCommas(r))) : void 0 : this.numAddCommas(r)
        }, buildMark: function (t) {
            var e = this.series[t];
            this.selectedMap[e.name] && (e.markPoint && this._buildMarkPoint(t), e.markLine && this._buildMarkLine(t))
        }, _buildMarkPoint: function (t) {
            for (var e, i, o = (this.markAttachStyle || {})[t], s = this.series[t], r = this.getZlevelBase(), a = c.clone(s.markPoint), h = 0, l = a.data.length; l > h; h++)e = a.data[h], i = this.getMarkCoord(t, e), a.data[h].x = null != e.x ? e.x : i[0], a.data[h].y = null != e.y ? e.y : i[1], !e.type || "max" !== e.type && "min" !== e.type || (a.data[h].value = i[3], a.data[h].name = e.name || e.type, a.data[h].symbolSize = a.data[h].symbolSize || p.getTextWidth(i[3], this.getFont()) / 2 + 5);
            for (var d = this._markPoint(t, a), h = 0, l = d.length; l > h; h++) {
                d[h].zlevel = r + 1;
                for (var u in o)d[h][u] = c.clone(o[u]);
                this.shapeList.push(d[h])
            }
            if (this.type === n.CHART_TYPE_FORCE || this.type === n.CHART_TYPE_CHORD)for (var h = 0, l = d.length; l > h; h++)this.zr.addShape(d[h])
        }, _buildMarkLine: function (t) {
            for (var e, i, o = (this.markAttachStyle || {})[t], s = this.series[t], r = this.getZlevelBase(), a = c.clone(s.markLine), h = 0, l = a.data.length; l > h; h++)e = a.data[h], !e.type || "max" !== e.type && "min" !== e.type && "average" !== e.type ? i = [this.getMarkCoord(t, e[0]), this.getMarkCoord(t, e[1])] : (i = this.getMarkCoord(t, e), a.data[h] = [c.clone(e), {}], a.data[h][0].name = e.name || e.type, a.data[h][0].value = i[3], i = i[2], e = [
                {},
                {}
            ]), null != i && null != i[0] && null != i[1] && (a.data[h][0].x = null != e[0].x ? e[0].x : i[0][0], a.data[h][0].y = null != e[0].y ? e[0].y : i[0][1], a.data[h][1].x = null != e[1].x ? e[1].x : i[1][0], a.data[h][1].y = null != e[1].y ? e[1].y : i[1][1]);
            for (var d = this._markLine(t, a), h = 0, l = d.length; l > h; h++) {
                d[h].zlevel = r + 1;
                for (var p in o)d[h][p] = c.clone(o[p]);
                this.shapeList.push(d[h])
            }
            if (this.type === n.CHART_TYPE_FORCE || this.type === n.CHART_TYPE_CHORD)for (var h = 0, l = d.length; l > h; h++)this.zr.addShape(d[h])
        }, _markPoint: function (t, e) {
            var i = this.series[t], o = this.component;
            c.merge(e, this.ecTheme.markPoint), e.name = i.name;
            var s, r, h, l, d, p, u, g = [], f = e.data, m = o.dataRange, _ = o.legend, y = this.zr.getWidth(), v = this.zr.getHeight();
            if (e.large)s = this.getLargeMarkPoingShape(t, e), s._mark = "largePoint", s && g.push(s); else for (var x = 0, b = f.length; b > x; x++)null != f[x].x && null != f[x].y && (h = null != f[x] && null != f[x].value ? f[x].value : "", _ && (r = _.getColor(i.name)), m && (r = isNaN(h) ? r : m.getColor(h), l = [f[x], e], d = this.deepQuery(l, "itemStyle.normal.color") || r, p = this.deepQuery(l, "itemStyle.emphasis.color") || d, null == d && null == p) || (r = null == r ? this.zr.getColor(t) : r, f[x].tooltip = f[x].tooltip || e.tooltip || {trigger: "item"}, f[x].name = null != f[x].name ? f[x].name : "", f[x].value = h, s = this.getSymbolShape(e, t, f[x], x, f[x].name, this.parsePercent(f[x].x, y), this.parsePercent(f[x].y, v), "pin", r, "rgba(0,0,0,0)", "horizontal"), s._mark = "point", u = this.deepMerge([f[x], e], "effect"), u.show && (s.effect = u), i.type === n.CHART_TYPE_MAP && (s._geo = this.getMarkGeo(f[x])), a.pack(s, i, t, f[x], x, f[x].name, h), g.push(s)));
            return g
        }, _markLine: function (t, e) {
            var i = this.series[t], o = this.component;
            c.merge(e, this.ecTheme.markLine), e.symbol = e.symbol instanceof Array ? e.symbol.length > 1 ? e.symbol : [e.symbol[0], e.symbol[0]] : [e.symbol, e.symbol], e.symbolSize = e.symbolSize instanceof Array ? e.symbolSize.length > 1 ? e.symbolSize : [e.symbolSize[0], e.symbolSize[0]] : [e.symbolSize, e.symbolSize], e.symbolRotate = e.symbolRotate instanceof Array ? e.symbolRotate.length > 1 ? e.symbolRotate : [e.symbolRotate[0], e.symbolRotate[0]] : [e.symbolRotate, e.symbolRotate], e.name = i.name;
            for (var s, r, h, l, d, p, u, g, f = [], m = e.data, _ = o.dataRange, y = o.legend, v = this.zr.getWidth(), x = this.zr.getHeight(), b = 0, T = m.length; T > b; b++)null != m[b][0].x && null != m[b][0].y && null != m[b][1].x && null != m[b][1].y && (r = y ? y.getColor(i.name) : this.zr.getColor(t), g = this.deepMerge(m[b]), h = null != g && null != g.value ? g.value : "", _ && (r = isNaN(h) ? r : _.getColor(h), l = [g, e], d = this.deepQuery(l, "itemStyle.normal.color") || r, p = this.deepQuery(l, "itemStyle.emphasis.color") || d, null == d && null == p) || (m[b][0].tooltip = g.tooltip || {trigger: "item"}, m[b][0].name = null != m[b][0].name ? m[b][0].name : "", m[b][1].name = null != m[b][1].name ? m[b][1].name : "", m[b][0].value = null != m[b][0].value ? m[b][0].value : "", s = this.getLineMarkShape(e, t, m[b], b, this.parsePercent(m[b][0].x, v), this.parsePercent(m[b][0].y, x), this.parsePercent(m[b][1].x, v), this.parsePercent(m[b][1].y, x), r), s._mark = "line", u = this.deepMerge([g, e], "effect"), u.show && (s.effect = u), i.type === n.CHART_TYPE_MAP && (s._geo = [this.getMarkGeo(m[b][0]), this.getMarkGeo(m[b][1])]), a.pack(s, i, t, m[b][0], b, m[b][0].name + ("" !== m[b][1].name ? " > " + m[b][1].name : ""), h), f.push(s)));
            return f
        }, getMarkCoord: function () {
            return[0, 0]
        }, getSymbolShape: function (t, e, s, r, n, h, l, d, c, p, u) {
            var g = [s, t], f = null != s ? null != s.value ? s.value : s : "-";
            d = this.deepQuery(g, "symbol") || d;
            var m = this.deepQuery(g, "symbolSize");
            m = "function" == typeof m ? m(f) : m;
            var _ = this.deepQuery(g, "symbolRotate"), y = this.deepMerge(g, "itemStyle.normal"), v = this.deepMerge(g, "itemStyle.emphasis"), x = null != y.borderWidth ? y.borderWidth : y.lineStyle && y.lineStyle.width;
            null == x && (x = d.match("empty") ? 2 : 0);
            var b = null != v.borderWidth ? v.borderWidth : v.lineStyle && v.lineStyle.width;
            null == b && (b = x + 2);
            var T = new o({style: {iconType: d.replace("empty", "").toLowerCase(), x: h - m, y: l - m, width: 2 * m, height: 2 * m, brushType: "both", color: d.match("empty") ? p : this.getItemStyleColor(y.color, e, r, s) || c, strokeColor: y.borderColor || this.getItemStyleColor(y.color, e, r, s) || c, lineWidth: x}, highlightStyle: {color: d.match("empty") ? p : this.getItemStyleColor(v.color, e, r, s), strokeColor: v.borderColor || y.borderColor || this.getItemStyleColor(y.color, e, r, s) || c, lineWidth: b}, clickable: this.deepQuery(g, "clickable")});
            return d.match("image") && (T.style.image = d.replace(new RegExp("^image:\\/\\/"), ""), T = new i({style: T.style, highlightStyle: T.highlightStyle, clickable: this.deepQuery(g, "clickable")})), null != _ && (T.rotation = [_ * Math.PI / 180, h, l]), d.match("star") && (T.style.iconType = "star", T.style.n = d.replace("empty", "").replace("star", "") - 0 || 5), "none" === d && (T.invisible = !0, T.hoverable = !1), T = this.addLabel(T, t, s, n, u), d.match("empty") && (null == T.style.textColor && (T.style.textColor = T.style.strokeColor), null == T.highlightStyle.textColor && (T.highlightStyle.textColor = T.highlightStyle.strokeColor)), a.pack(T, t, e, s, r, n), T._x = h, T._y = l, T._dataIndex = r, T._seriesIndex = e, T
        }, getLineMarkShape: function (t, e, i, o, r, n, a, h, l) {
            var d = null != i[0] ? null != i[0].value ? i[0].value : i[0] : "-", c = null != i[1] ? null != i[1].value ? i[1].value : i[1] : "-", p = [this.query(i[0], "symbol") || t.symbol[0], this.query(i[1], "symbol") || t.symbol[1]], u = [this.query(i[0], "symbolSize") || t.symbolSize[0], this.query(i[1], "symbolSize") || t.symbolSize[1]];
            u[0] = "function" == typeof u[0] ? u[0](d) : u[0], u[1] = "function" == typeof u[1] ? u[1](c) : u[1];
            var g = [this.query(i[0], "symbolRotate") || t.symbolRotate[0], this.query(i[1], "symbolRotate") || t.symbolRotate[1]], f = [i[0], t], m = this.deepMerge(f, "itemStyle.normal");
            m.color = this.getItemStyleColor(m.color, e, o, i);
            var _ = this.deepMerge(f, "itemStyle.emphasis");
            _.color = this.getItemStyleColor(_.color, e, o, i);
            var y = m.lineStyle, v = _.lineStyle, x = y.width;
            null == x && (x = m.borderWidth);
            var b = v.width;
            null == b && (b = null != _.borderWidth ? _.borderWidth : x + 2);
            var T = new s({style: {smooth: t.smooth ? "spline" : !1, symbol: p, symbolSize: u, symbolRotate: g, xStart: r, yStart: n, xEnd: a, yEnd: h, brushType: "both", lineType: y.type, shadowColor: y.shadowColor || y.color || m.borderColor || m.color || l, shadowBlur: y.shadowBlur, shadowOffsetX: y.shadowOffsetX, shadowOffsetY: y.shadowOffsetY, color: m.color || l, strokeColor: y.color || m.borderColor || m.color || l, lineWidth: x, symbolBorderColor: m.borderColor || m.color || l, symbolBorder: m.borderWidth}, highlightStyle: {shadowColor: v.shadowColor, shadowBlur: v.shadowBlur, shadowOffsetX: v.shadowOffsetX, shadowOffsetY: v.shadowOffsetY, color: _.color || m.color || l, strokeColor: v.color || y.color || _.borderColor || m.borderColor || _.color || m.color || l, lineWidth: b, symbolBorderColor: _.borderColor || m.borderColor || _.color || m.color || l, symbolBorder: null == _.borderWidth ? m.borderWidth + 2 : _.borderWidth}, clickable: this.deepQuery(f, "clickable")});
            return T = this.addLabel(T, t, i[0], i[0].name + " : " + i[1].name), T._x = a, T._y = h, T
        }, getLargeMarkPoingShape: function (t, e) {
            var i, o, s, n, a, h, l = this.series[t], d = this.component, c = e.data, p = d.dataRange, u = d.legend, g = [c[0], e];
            if (u && (o = u.getColor(l.name)), !p || (s = null != c[0] ? null != c[0].value ? c[0].value : c[0] : "-", o = isNaN(s) ? o : p.getColor(s), n = this.deepQuery(g, "itemStyle.normal.color") || o, a = this.deepQuery(g, "itemStyle.emphasis.color") || n, null != n || null != a)) {
                o = this.deepMerge(g, "itemStyle.normal").color || o;
                var f = this.deepQuery(g, "symbol") || "circle";
                f = f.replace("empty", "").replace(/\d/g, ""), h = this.deepMerge([c[0], e], "effect");
                var m = window.devicePixelRatio || 1;
                return i = new r({style: {pointList: c, color: o, strokeColor: o, shadowColor: h.shadowColor || o, shadowBlur: (null != h.shadowBlur ? h.shadowBlur : 8) * m, size: this.deepQuery(g, "symbolSize"), iconType: f, brushType: "fill", lineWidth: 1}, draggable: !1, hoverable: !1}), h.show && (i.effect = h), i
            }
        }, backupShapeList: function () {
            this.shapeList && this.shapeList.length > 0 ? (this.lastShapeList = this.shapeList, this.shapeList = []) : this.lastShapeList = []
        }, addShapeList: function () {
            var t, e, i = this.option.animationThreshold / (this.canvasSupported ? 2 : 4), o = this.lastShapeList, s = this.shapeList, r = o.length > 0 ? 500 : this.query(this.option, "animationDuration"), a = this.query(this.option, "animationEasing"), h = {}, l = {};
            if (this.option.animation && !this.option.renderAsImage && s.length < i && !this.motionlessOnce) {
                for (var d = 0, c = o.length; c > d; d++)e = this._getAnimationKey(o[d]), e.match("undefined") ? this.zr.delShape(o[d].id) : (e += o[d].type, h[e] = o[d]);
                for (var d = 0, c = s.length; c > d; d++)e = this._getAnimationKey(s[d]), e.match("undefined") ? this.zr.addShape(s[d]) : (e += s[d].type, l[e] = s[d]);
                for (e in h)l[e] || this.zr.delShape(h[e].id);
                for (e in l)h[e] ? (this.zr.delShape(h[e].id), this._animateMod(h[e], l[e], r, a)) : (t = this.type != n.CHART_TYPE_LINE && this.type != n.CHART_TYPE_RADAR || 0 === e.indexOf("icon") ? 0 : r / 2, this._animateMod(!1, l[e], r, a, t));
                this.zr.refresh(), this.animationEffect()
            } else {
                this.motionlessOnce = !1, this.zr.delShape(o);
                for (var d = 0, c = s.length; c > d; d++)this.zr.addShape(s[d])
            }
        }, _getAnimationKey: function (t) {
            return this.type != n.CHART_TYPE_MAP ? a.get(t, "seriesIndex") + "_" + a.get(t, "dataIndex") + (t._mark ? t._mark : "") + (this.type === n.CHART_TYPE_RADAR ? a.get(t, "special") : "") : a.get(t, "seriesIndex") + "_" + a.get(t, "dataIndex") + (t._mark ? t._mark : "undefined")
        }, _animateMod: function (t, e, i, o, s) {
            switch (e.type) {
                case"broken-line":
                case"half-smooth-polygon":
                    h.pointList(this.zr, t, e, i, o);
                    break;
                case"rectangle":
                    h.rectangle(this.zr, t, e, i, o);
                    break;
                case"icon":
                    h.icon(this.zr, t, e, i, o, s);
                    break;
                case"candle":
                    i > 500 ? h.candle(this.zr, t, e, i, o) : this.zr.addShape(e);
                    break;
                case"ring":
                case"sector":
                case"circle":
                    i > 500 ? h.ring(this.zr, t, e, i + (a.get(e, "dataIndex") || 0) % 20 * 100, o) : "sector" === e.type ? h.sector(this.zr, t, e, i, o) : this.zr.addShape(e);
                    break;
                case"text":
                    h.text(this.zr, t, e, i, o);
                    break;
                case"polygon":
                    i > 500 ? h.polygon(this.zr, t, e, i, o) : h.pointList(this.zr, t, e, i, o);
                    break;
                case"ribbon":
                    h.ribbon(this.zr, t, e, i, o);
                    break;
                case"gauge-pointer":
                    h.gaugePointer(this.zr, t, e, i, o);
                    break;
                case"mark-line":
                    h.markline(this.zr, t, e, i, o);
                    break;
                case"bezier-curve":
                case"line":
                    h.line(this.zr, t, e, i, o);
                    break;
                default:
                    this.zr.addShape(e)
            }
        }, animationMark: function (t, e, i) {
            for (var o = i || this.shapeList, s = 0, r = o.length; r > s; s++)o[s]._mark && this._animateMod(!1, o[s], t, e);
            this.animationEffect(i)
        }, animationEffect: function (t) {
            !t && this.clearEffectShape();
            var e = t || this.shapeList;
            if (null != e) {
                var i = n.EFFECT_ZLEVEL;
                this.canvasSupported && this.zr.modLayer(i, {motionBlur: !0, lastFrameAlpha: .95});
                for (var o, s = 0, r = e.length; r > s; s++)o = e[s], o._mark && o.effect && o.effect.show && l[o._mark] && (l[o._mark](this.zr, this.effectList, o, i), this.effectList[this.effectList.length - 1]._mark = o._mark)
            }
        }, clearEffectShape: function (t) {
            this.zr && this.effectList && this.effectList.length > 0 && (t && this.zr.modLayer(n.EFFECT_ZLEVEL, {motionBlur: !1}), this.zr.delShape(this.effectList)), this.effectList = []
        }, addMark: function (t, e, i) {
            var o = this.series[t];
            if (this.selectedMap[o.name]) {
                var s = 500, r = this.query(this.option, "animationEasing"), n = o[i].data, a = this.shapeList.length;
                if (o[i].data = e.data, this["_build" + i.replace("m", "M")](t), this.option.animation && !this.option.renderAsImage)this.animationMark(s, r, this.shapeList.slice(a)); else {
                    for (var h = a, l = this.shapeList.length; l > h; h++)this.zr.addShape(this.shapeList[h]);
                    this.zr.refresh()
                }
                o[i].data = n
            }
        }, delMark: function (t, e, i) {
            i = i.replace("mark", "").replace("large", "").toLowerCase();
            var o = this.series[t];
            if (this.selectedMap[o.name]) {
                for (var s = !1, r = [this.shapeList, this.effectList], n = 2; n--;)for (var h = 0, l = r[n].length; l > h; h++)if (r[n][h]._mark == i && a.get(r[n][h], "seriesIndex") == t && a.get(r[n][h], "name") == e) {
                    this.zr.delShape(r[n][h].id), r[n].splice(h, 1), s = !0;
                    break
                }
                s && this.zr.refresh()
            }
        }}, e
    }), i("zrender/shape/Circle", ["require", "./Base", "../tool/util"], function (t) {
        "use strict";
        var e = t("./Base"), i = function (t) {
            e.call(this, t)
        };
        return i.prototype = {type: "circle", buildPath: function (t, e) {
            t.arc(e.x, e.y, e.r, 0, 2 * Math.PI, !0)
        }, getRect: function (t) {
            if (t.__rect)return t.__rect;
            var e;
            return e = "stroke" == t.brushType || "fill" == t.brushType ? t.lineWidth || 1 : 0, t.__rect = {x: Math.round(t.x - t.r - e / 2), y: Math.round(t.y - t.r - e / 2), width: 2 * t.r + e, height: 2 * t.r + e}, t.__rect
        }}, t("../tool/util").inherits(i, e), i
    }), i("echarts/util/accMath", [], function () {
        function t(t, e) {
            var i = t.toString(), o = e.toString(), s = 0;
            try {
                s = o.split(".")[1].length
            } catch (r) {
            }
            try {
                s -= i.split(".")[1].length
            } catch (r) {
            }
            return(i.replace(".", "") - 0) / (o.replace(".", "") - 0) * Math.pow(10, s)
        }

        function e(t, e) {
            var i = t.toString(), o = e.toString(), s = 0;
            try {
                s += i.split(".")[1].length
            } catch (r) {
            }
            try {
                s += o.split(".")[1].length
            } catch (r) {
            }
            return(i.replace(".", "") - 0) * (o.replace(".", "") - 0) / Math.pow(10, s)
        }

        function i(t, e) {
            var i = 0, o = 0;
            try {
                i = t.toString().split(".")[1].length
            } catch (s) {
            }
            try {
                o = e.toString().split(".")[1].length
            } catch (s) {
            }
            var r = Math.pow(10, Math.max(i, o));
            return(Math.round(t * r) + Math.round(e * r)) / r
        }

        function o(t, e) {
            return i(t, -e)
        }

        return{accDiv: t, accMul: e, accAdd: i, accSub: o}
    }), i("echarts/util/ecQuery", ["require", "zrender/tool/util"], function (t) {
        function e(t, e) {
            if ("undefined" != typeof t) {
                if (!e)return t;
                e = e.split(".");
                for (var i = e.length, o = 0; i > o;) {
                    if (t = t[e[o]], "undefined" == typeof t)return;
                    o++
                }
                return t
            }
        }

        function i(t, i) {
            for (var o, s = 0, r = t.length; r > s; s++)if (o = e(t[s], i), "undefined" != typeof o)return o
        }

        function o(t, i) {
            for (var o, r = t.length; r--;) {
                var n = e(t[r], i);
                "undefined" != typeof n && ("undefined" == typeof o ? o = s.clone(n) : s.merge(o, n, !0))
            }
            return o
        }

        var s = t("zrender/tool/util");
        return{query: e, deepQuery: i, deepMerge: o}
    }), i("echarts/util/number", [], function () {
        function t(t) {
            return t.replace(/^\s+/, "").replace(/\s+$/, "")
        }

        function e(e, i) {
            return"string" == typeof e ? t(e).match(/%$/) ? parseFloat(e) / 100 * i : parseFloat(e) : e
        }

        function i(t, i) {
            return[e(i[0], t.getWidth()), e(i[1], t.getHeight())]
        }

        function o(t, i) {
            i instanceof Array || (i = [0, i]);
            var o = Math.min(t.getWidth(), t.getHeight()) / 2;
            return[e(i[0], o), e(i[1], o)]
        }

        function s(t) {
            return isNaN(t) ? "-" : (t = (t + "").split("."), t[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, "$1,") + (t.length > 1 ? "." + t[1] : ""))
        }

        return{parsePercent: e, parseCenter: i, parseRadius: o, addCommas: s}
    }), i("echarts/util/shape/Icon", ["require", "zrender/tool/util", "zrender/shape/Star", "zrender/shape/Heart", "zrender/shape/Droplet", "zrender/shape/Image", "zrender/shape/Base"], function (t) {
        function e(t, e) {
            var i = e.x, o = e.y, s = e.width / 16, r = e.height / 16;
            t.moveTo(i, o + e.height), t.lineTo(i + 5 * s, o + 14 * r), t.lineTo(i + e.width, o + 3 * r), t.lineTo(i + 13 * s, o), t.lineTo(i + 2 * s, o + 11 * r), t.lineTo(i, o + e.height), t.moveTo(i + 6 * s, o + 10 * r), t.lineTo(i + 14 * s, o + 2 * r), t.moveTo(i + 10 * s, o + 13 * r), t.lineTo(i + e.width, o + 13 * r), t.moveTo(i + 13 * s, o + 10 * r), t.lineTo(i + 13 * s, o + e.height)
        }

        function i(t, e) {
            var i = e.x, o = e.y, s = e.width / 16, r = e.height / 16;
            t.moveTo(i, o + e.height), t.lineTo(i + 5 * s, o + 14 * r), t.lineTo(i + e.width, o + 3 * r), t.lineTo(i + 13 * s, o), t.lineTo(i + 2 * s, o + 11 * r), t.lineTo(i, o + e.height), t.moveTo(i + 6 * s, o + 10 * r), t.lineTo(i + 14 * s, o + 2 * r), t.moveTo(i + 10 * s, o + 13 * r), t.lineTo(i + e.width, o + 13 * r)
        }

        function o(t, e) {
            var i = e.x, o = e.y, s = e.width / 16, r = e.height / 16;
            t.moveTo(i + 4 * s, o + 15 * r), t.lineTo(i + 9 * s, o + 13 * r), t.lineTo(i + 14 * s, o + 8 * r), t.lineTo(i + 11 * s, o + 5 * r), t.lineTo(i + 6 * s, o + 10 * r), t.lineTo(i + 4 * s, o + 15 * r), t.moveTo(i + 5 * s, o), t.lineTo(i + 11 * s, o), t.moveTo(i + 5 * s, o + r), t.lineTo(i + 11 * s, o + r), t.moveTo(i, o + 2 * r), t.lineTo(i + e.width, o + 2 * r), t.moveTo(i, o + 5 * r), t.lineTo(i + 3 * s, o + e.height), t.lineTo(i + 13 * s, o + e.height), t.lineTo(i + e.width, o + 5 * r)
        }

        function s(t, e) {
            var i = e.x, o = e.y, s = e.width / 16, r = e.height / 16;
            t.moveTo(i, o + 3 * r), t.lineTo(i + 6 * s, o + 3 * r), t.moveTo(i + 3 * s, o), t.lineTo(i + 3 * s, o + 6 * r), t.moveTo(i + 3 * s, o + 8 * r), t.lineTo(i + 3 * s, o + e.height), t.lineTo(i + e.width, o + e.height), t.lineTo(i + e.width, o + 3 * r), t.lineTo(i + 8 * s, o + 3 * r)
        }

        function r(t, e) {
            var i = e.x, o = e.y, s = e.width / 16, r = e.height / 16;
            t.moveTo(i + 6 * s, o), t.lineTo(i + 2 * s, o + 3 * r), t.lineTo(i + 6 * s, o + 6 * r), t.moveTo(i + 2 * s, o + 3 * r), t.lineTo(i + 14 * s, o + 3 * r), t.lineTo(i + 14 * s, o + 11 * r), t.moveTo(i + 2 * s, o + 5 * r), t.lineTo(i + 2 * s, o + 13 * r), t.lineTo(i + 14 * s, o + 13 * r), t.moveTo(i + 10 * s, o + 10 * r), t.lineTo(i + 14 * s, o + 13 * r), t.lineTo(i + 10 * s, o + e.height)
        }

        function n(t, e) {
            var i = e.x, o = e.y, s = e.width / 16, r = e.height / 16, n = e.width / 2;
            t.lineWidth = 1.5, t.arc(i + n, o + n, n - s, 0, 2 * Math.PI / 3), t.moveTo(i + 3 * s, o + e.height), t.lineTo(i + 0 * s, o + 12 * r), t.lineTo(i + 5 * s, o + 11 * r), t.moveTo(i, o + 8 * r), t.arc(i + n, o + n, n - s, Math.PI, 5 * Math.PI / 3), t.moveTo(i + 13 * s, o), t.lineTo(i + e.width, o + 4 * r), t.lineTo(i + 11 * s, o + 5 * r)
        }

        function a(t, e) {
            var i = e.x, o = e.y, s = e.width / 16, r = e.height / 16;
            t.moveTo(i, o), t.lineTo(i, o + e.height), t.lineTo(i + e.width, o + e.height), t.moveTo(i + 2 * s, o + 14 * r), t.lineTo(i + 7 * s, o + 6 * r), t.lineTo(i + 11 * s, o + 11 * r), t.lineTo(i + 15 * s, o + 2 * r)
        }

        function h(t, e) {
            var i = e.x, o = e.y, s = e.width / 16, r = e.height / 16;
            t.moveTo(i, o), t.lineTo(i, o + e.height), t.lineTo(i + e.width, o + e.height), t.moveTo(i + 3 * s, o + 14 * r), t.lineTo(i + 3 * s, o + 6 * r), t.lineTo(i + 4 * s, o + 6 * r), t.lineTo(i + 4 * s, o + 14 * r), t.moveTo(i + 7 * s, o + 14 * r), t.lineTo(i + 7 * s, o + 2 * r), t.lineTo(i + 8 * s, o + 2 * r), t.lineTo(i + 8 * s, o + 14 * r), t.moveTo(i + 11 * s, o + 14 * r), t.lineTo(i + 11 * s, o + 9 * r), t.lineTo(i + 12 * s, o + 9 * r), t.lineTo(i + 12 * s, o + 14 * r)
        }

        function l(t, e) {
            var i = e.x, o = e.y, s = e.width - 2, r = e.height - 2, n = Math.min(s, r) / 2;
            o += 2, t.moveTo(i + n + 3, o + n - 3), t.arc(i + n + 3, o + n - 3, n - 1, 0, -Math.PI / 2, !0), t.lineTo(i + n + 3, o + n - 3), t.moveTo(i + n, o), t.lineTo(i + n, o + n), t.arc(i + n, o + n, n, -Math.PI / 2, 2 * Math.PI, !0), t.lineTo(i + n, o + n), t.lineWidth = 1.5
        }

        function d(t, e) {
            var i = e.x, o = e.y, s = e.width / 16, r = e.height / 16;
            o -= r, t.moveTo(i + 1 * s, o + 2 * r), t.lineTo(i + 15 * s, o + 2 * r), t.lineTo(i + 14 * s, o + 3 * r), t.lineTo(i + 2 * s, o + 3 * r), t.moveTo(i + 3 * s, o + 6 * r), t.lineTo(i + 13 * s, o + 6 * r), t.lineTo(i + 12 * s, o + 7 * r), t.lineTo(i + 4 * s, o + 7 * r), t.moveTo(i + 5 * s, o + 10 * r), t.lineTo(i + 11 * s, o + 10 * r), t.lineTo(i + 10 * s, o + 11 * r), t.lineTo(i + 6 * s, o + 11 * r), t.moveTo(i + 7 * s, o + 14 * r), t.lineTo(i + 9 * s, o + 14 * r), t.lineTo(i + 8 * s, o + 15 * r), t.lineTo(i + 7 * s, o + 15 * r)
        }

        function c(t, e) {
            var i = e.x, o = e.y, s = e.width, r = e.height, n = s / 16, a = r / 16, h = 2 * Math.min(n, a);
            t.moveTo(i + n + h, o + a + h), t.arc(i + n, o + a, h, Math.PI / 4, 3 * Math.PI), t.lineTo(i + 7 * n - h, o + 6 * a - h), t.arc(i + 7 * n, o + 6 * a, h, Math.PI / 4 * 5, 4 * Math.PI), t.arc(i + 7 * n, o + 6 * a, h / 2, Math.PI / 4 * 5, 4 * Math.PI), t.moveTo(i + 7 * n - h / 2, o + 6 * a + h), t.lineTo(i + n + h, o + 14 * a - h), t.arc(i + n, o + 14 * a, h, -Math.PI / 4, 2 * Math.PI), t.moveTo(i + 7 * n + h / 2, o + 6 * a), t.lineTo(i + 14 * n - h, o + 10 * a - h / 2), t.moveTo(i + 16 * n, o + 10 * a), t.arc(i + 14 * n, o + 10 * a, h, 0, 3 * Math.PI), t.lineWidth = 1.5
        }

        function p(t, e) {
            var i = e.x, o = e.y, s = e.width, r = e.height, n = Math.min(s, r) / 2;
            t.moveTo(i + s, o + r / 2), t.arc(i + n, o + n, n, 0, 2 * Math.PI), t.arc(i + n, o, n, Math.PI / 4, Math.PI / 5 * 4), t.arc(i, o + n, n, -Math.PI / 3, Math.PI / 3), t.arc(i + s, o + r, n, Math.PI, Math.PI / 2 * 3), t.lineWidth = 1.5
        }

        function u(t, e) {
            for (var i = e.x, o = e.y, s = e.width, r = e.height, n = Math.round(r / 3), a = 3; a--;)t.rect(i, o + n * a + 2, s, 2)
        }

        function g(t, e) {
            for (var i = e.x, o = e.y, s = e.width, r = e.height, n = Math.round(s / 3), a = 3; a--;)t.rect(i + n * a, o, 2, r)
        }

        function f(t, e) {
            var i = e.x, o = e.y, s = e.width / 16;
            t.moveTo(i + s, o), t.lineTo(i + s, o + e.height), t.lineTo(i + 15 * s, o + e.height), t.lineTo(i + 15 * s, o), t.lineTo(i + s, o), t.moveTo(i + 3 * s, o + 3 * s), t.lineTo(i + 13 * s, o + 3 * s), t.moveTo(i + 3 * s, o + 6 * s), t.lineTo(i + 13 * s, o + 6 * s), t.moveTo(i + 3 * s, o + 9 * s), t.lineTo(i + 13 * s, o + 9 * s), t.moveTo(i + 3 * s, o + 12 * s), t.lineTo(i + 9 * s, o + 12 * s)
        }

        function m(t, e) {
            var i = e.x, o = e.y, s = e.width / 16, r = e.height / 16;
            t.moveTo(i, o), t.lineTo(i, o + e.height), t.lineTo(i + e.width, o + e.height), t.lineTo(i + e.width, o), t.lineTo(i, o), t.moveTo(i + 4 * s, o), t.lineTo(i + 4 * s, o + 8 * r), t.lineTo(i + 12 * s, o + 8 * r), t.lineTo(i + 12 * s, o), t.moveTo(i + 6 * s, o + 11 * r), t.lineTo(i + 6 * s, o + 13 * r), t.lineTo(i + 10 * s, o + 13 * r), t.lineTo(i + 10 * s, o + 11 * r), t.lineTo(i + 6 * s, o + 11 * r)
        }

        function _(t, e) {
            var i = e.x, o = e.y, s = e.width, r = e.height;
            t.moveTo(i, o + r / 2), t.lineTo(i + s, o + r / 2), t.moveTo(i + s / 2, o), t.lineTo(i + s / 2, o + r)
        }

        function y(t, e) {
            var i = e.width / 2, o = e.height / 2, s = Math.min(i, o);
            t.moveTo(e.x + i + s, e.y + o), t.arc(e.x + i, e.y + o, s, 0, 2 * Math.PI), t.closePath()
        }

        function v(t, e) {
            t.rect(e.x, e.y, e.width, e.height), t.closePath()
        }

        function x(t, e) {
            var i = e.width / 2, o = e.height / 2, s = e.x + i, r = e.y + o, n = Math.min(i, o);
            t.moveTo(s, r - n), t.lineTo(s + n, r + n), t.lineTo(s - n, r + n), t.lineTo(s, r - n), t.closePath()
        }

        function b(t, e) {
            var i = e.width / 2, o = e.height / 2, s = e.x + i, r = e.y + o, n = Math.min(i, o);
            t.moveTo(s, r - n), t.lineTo(s + n, r), t.lineTo(s, r + n), t.lineTo(s - n, r), t.lineTo(s, r - n), t.closePath()
        }

        function T(t, e) {
            var i = e.x, o = e.y, s = e.width / 16;
            t.moveTo(i + 8 * s, o), t.lineTo(i + s, o + e.height), t.lineTo(i + 8 * s, o + e.height / 4 * 3), t.lineTo(i + 15 * s, o + e.height), t.lineTo(i + 8 * s, o), t.closePath()
        }

        function S(e, i) {
            var o = t("zrender/shape/Star"), s = i.width / 2, r = i.height / 2;
            o.prototype.buildPath(e, {x: i.x + s, y: i.y + r, r: Math.min(s, r), n: i.n || 5})
        }

        function C(e, i) {
            var o = t("zrender/shape/Heart");
            o.prototype.buildPath(e, {x: i.x + i.width / 2, y: i.y + .2 * i.height, a: i.width / 2, b: .8 * i.height})
        }

        function z(e, i) {
            var o = t("zrender/shape/Droplet");
            o.prototype.buildPath(e, {x: i.x + .5 * i.width, y: i.y + .5 * i.height, a: .5 * i.width, b: .8 * i.height})
        }

        function w(t, e) {
            var i = e.x, o = e.y - e.height / 2 * 1.5, s = e.width / 2, r = e.height / 2, n = Math.min(s, r);
            t.arc(i + s, o + r, n, Math.PI / 5 * 4, Math.PI / 5), t.lineTo(i + s, o + r + 1.5 * n), t.closePath()
        }

        function E(e, i, o) {
            var s = t("zrender/shape/Image");
            this._imageShape = this._imageShape || new s({style: {}});
            for (var r in i)this._imageShape.style[r] = i[r];
            this._imageShape.brush(e, !1, o)
        }

        function L(t) {
            M.call(this, t)
        }

        var A = t("zrender/tool/util"), M = t("zrender/shape/Base");
        return L.prototype = {type: "icon", iconLibrary: {mark: e, markUndo: i, markClear: o, dataZoom: s, dataZoomReset: r, restore: n, lineChart: a, barChart: h, pieChart: l, funnelChart: d, forceChart: c, chordChart: p, stackChart: u, tiledChart: g, dataView: f, saveAsImage: m, cross: _, circle: y, rectangle: v, triangle: x, diamond: b, arrow: T, star: S, heart: C, droplet: z, pin: w, image: E}, brush: function (e, i, o) {
            var s = i ? this.highlightStyle : this.style;
            s = s || {};
            var r = s.iconType || this.style.iconType;
            if ("image" === r) {
                var n = t("zrender/shape/Image");
                n.prototype.brush.call(this, e, i, o)
            } else {
                var s = this.beforeBrush(e, i);
                switch (e.beginPath(), this.buildPath(e, s, o), s.brushType) {
                    case"both":
                        e.fill();
                    case"stroke":
                        s.lineWidth > 0 && e.stroke();
                        break;
                    default:
                        e.fill()
                }
                this.drawText(e, s, this.style), this.afterBrush(e)
            }
        }, buildPath: function (t, e, i) {
            this.iconLibrary[e.iconType] ? this.iconLibrary[e.iconType].call(this, t, e, i) : (t.moveTo(e.x, e.y), t.lineTo(e.x + e.width, e.y), t.lineTo(e.x + e.width, e.y + e.height), t.lineTo(e.x, e.y + e.height), t.lineTo(e.x, e.y), t.closePath())
        }, getRect: function (t) {
            return t.__rect ? t.__rect : (t.__rect = {x: Math.round(t.x), y: Math.round(t.y - ("pin" == t.iconType ? t.height / 2 * 1.5 : 0)), width: t.width, height: t.height}, t.__rect)
        }, isCover: function (t, e) {
            var i = this.getTansform(t, e);
            t = i[0], e = i[1];
            var o = this.style.__rect;
            o || (o = this.style.__rect = this.getRect(this.style));
            var s = o.height < 8 || o.width < 8 ? 4 : 0;
            return t >= o.x - s && t <= o.x + o.width + s && e >= o.y - s && e <= o.y + o.height + s ? !0 : !1
        }}, A.inherits(L, M), L
    }), i("echarts/util/shape/MarkLine", ["require", "zrender/shape/Base", "./Icon", "zrender/shape/Line", "zrender/shape/BrokenLine", "zrender/tool/matrix", "zrender/tool/area", "zrender/shape/util/dashedLineTo", "zrender/shape/util/smoothSpline", "zrender/tool/util"], function (t) {
        function e(t) {
            i.call(this, t)
        }

        var i = t("zrender/shape/Base"), o = t("./Icon"), s = t("zrender/shape/Line"), r = new s({}), n = t("zrender/shape/BrokenLine"), a = new n({}), h = t("zrender/tool/matrix"), l = t("zrender/tool/area"), d = t("zrender/shape/util/dashedLineTo"), c = t("zrender/shape/util/smoothSpline"), p = t("zrender/tool/util");
        return e.prototype = {type: "mark-line", brush: function (t, e) {
            var i = this.style;
            e && (i = this.getHighlightStyle(i, this.highlightStyle || {})), t.save(), this.setContext(t, i), this.setTransform(t), t.save(), t.beginPath(), this.buildLinePath(t, i, this.style.lineWidth || 1), t.stroke(), t.restore(), this.brushSymbol(t, i, 0), this.brushSymbol(t, i, 1), this.drawText(t, i, this.style), t.restore()
        }, buildLinePath: function (t, e, i) {
            var o = e.pointList || this.getPointList(e);
            e.pointList = o;
            var s = Math.min(e.pointList.length, Math.round(e.pointListLength || e.pointList.length));
            if (e.lineType && "solid" != e.lineType) {
                if ("dashed" == e.lineType || "dotted" == e.lineType)if ("spline" !== e.smooth) {
                    var r = i * ("dashed" == e.lineType ? 5 : 1);
                    t.moveTo(o[0][0], o[0][1]);
                    for (var n = 1; s > n; n++)d(t, o[n - 1][0], o[n - 1][1], o[n][0], o[n][1], r)
                } else for (var n = 1; s > n; n += 2)t.moveTo(o[n - 1][0], o[n - 1][1]), t.lineTo(o[n][0], o[n][1])
            } else {
                t.moveTo(o[0][0], o[0][1]);
                for (var n = 1; s > n; n++)t.lineTo(o[n][0], o[n][1])
            }
        }, brushSymbol: function (t, e, i) {
            if ("none" != e.symbol[i]) {
                t.save(), t.beginPath(), t.lineWidth = e.symbolBorder, t.strokeStyle = e.symbolBorderColor, e.iconType = e.symbol[i].replace("empty", "").toLowerCase(), e.symbol[i].match("empty") && (t.fillStyle = "#fff");
                var s, r = Math.min(e.pointList.length, Math.round(e.pointListLength || e.pointList.length)), n = 0 === i ? e.pointList[0][0] : e.pointList[r - 1][0], a = 0 === i ? e.pointList[0][1] : e.pointList[r - 1][1], l = "undefined" != typeof e.symbolRotate[i] ? e.symbolRotate[i] - 0 : 0;
                if (0 !== l && (s = h.create(), h.identity(s), (n || a) && h.translate(s, s, [-n, -a]), h.rotate(s, s, l * Math.PI / 180), (n || a) && h.translate(s, s, [n, a]), t.transform.apply(t, s)), "arrow" == e.iconType && 0 === l)this.buildArrawPath(t, e, i); else {
                    var d = e.symbolSize[i];
                    e.x = n - d, e.y = a - d, e.width = 2 * d, e.height = 2 * d, o.prototype.buildPath(t, e)
                }
                t.closePath(), t.fill(), t.stroke(), t.restore()
            }
        }, buildArrawPath: function (t, e, i) {
            var o = Math.min(e.pointList.length, Math.round(e.pointListLength || e.pointList.length)), s = 2 * e.symbolSize[i], r = e.pointList[0][0], n = e.pointList[o - 1][0], a = e.pointList[0][1], h = e.pointList[o - 1][1], l = 0;
            "spline" === e.smooth && (l = .2);
            var d = Math.atan(Math.abs((h - a) / (r - n)));
            0 === i ? n > r ? h > a ? d = 2 * Math.PI - d + l : d += l : h > a ? d += Math.PI - l : d = Math.PI - d - l : r > n ? a > h ? d = 2 * Math.PI - d + l : d += l : a > h ? d += Math.PI - l : d = Math.PI - d - l;
            var c = Math.PI / 8, p = 0 === i ? r : n, u = 0 === i ? a : h, g = [
                [p + s * Math.cos(d - c), u - s * Math.sin(d - c)],
                [p + .6 * s * Math.cos(d), u - .6 * s * Math.sin(d)],
                [p + s * Math.cos(d + c), u - s * Math.sin(d + c)]
            ];
            t.moveTo(p, u);
            for (var f = 0, m = g.length; m > f; f++)t.lineTo(g[f][0], g[f][1]);
            t.lineTo(p, u)
        }, getPointList: function (t) {
            var e = [
                [t.xStart, t.yStart],
                [t.xEnd, t.yEnd]
            ];
            if ("spline" === t.smooth) {
                var i = e[1][0], o = e[1][1];
                e[3] = [i, o], e[1] = this.getOffetPoint(e[0], e[3]), e[2] = this.getOffetPoint(e[3], e[0]), e = c(e, !1), e[e.length - 1] = [i, o]
            }
            return e
        }, getOffetPoint: function (t, e) {
            var i, o = Math.sqrt(Math.round((t[0] - e[0]) * (t[0] - e[0]) + (t[1] - e[1]) * (t[1] - e[1]))) / 3, s = [t[0], t[1]], r = .2;
            if (t[0] != e[0] && t[1] != e[1]) {
                var n = (e[1] - t[1]) / (e[0] - t[0]);
                i = Math.atan(n)
            } else i = t[0] == e[0] ? (t[1] <= e[1] ? 1 : -1) * Math.PI / 2 : 0;
            var a, h;
            return t[0] <= e[0] ? (i -= r, a = Math.round(Math.cos(i) * o), h = Math.round(Math.sin(i) * o), s[0] += a, s[1] += h) : (i += r, a = Math.round(Math.cos(i) * o), h = Math.round(Math.sin(i) * o), s[0] -= a, s[1] -= h), s
        }, getRect: function (t) {
            if (t.__rect)return t.__rect;
            var e = t.lineWidth || 1;
            return t.__rect = {x: Math.min(t.xStart, t.xEnd) - e, y: Math.min(t.yStart, t.yEnd) - e, width: Math.abs(t.xStart - t.xEnd) + e, height: Math.abs(t.yStart - t.yEnd) + e}, t.__rect
        }, isCover: function (t, e) {
            var i = this.getTansform(t, e);
            t = i[0], e = i[1];
            var o = this.style.__rect;
            return o || (o = this.style.__rect = this.getRect(this.style)), t >= o.x && t <= o.x + o.width && e >= o.y && e <= o.y + o.height ? "spline" !== this.style.smooth ? l.isInside(r, this.style, t, e) : l.isInside(a, this.style, t, e) : !1
        }}, p.inherits(e, i), e
    }), i("echarts/util/shape/Symbol", ["require", "zrender/shape/Base", "zrender/shape/Polygon", "zrender/tool/util", "./normalIsCover"], function (t) {
        function e(t) {
            i.call(this, t)
        }

        var i = t("zrender/shape/Base"), o = t("zrender/shape/Polygon"), s = new o({}), r = t("zrender/tool/util");
        return e.prototype = {type: "symbol", buildPath: function (t, e) {
            var i = e.pointList, o = i.length;
            if (0 !== o)for (var s, r, n, a, h, l = 1e4, d = Math.ceil(o / l), c = i[0]instanceof Array, p = e.size ? e.size : 2, u = p, g = p / 2, f = 2 * Math.PI, m = 0; d > m; m++) {
                t.beginPath(), s = m * l, r = s + l, r = r > o ? o : r;
                for (var _ = s; r > _; _++)if (e.random && (n = e["randomMap" + _ % 20] / 100, u = p * n * n, g = u / 2), c ? (a = i[_][0], h = i[_][1]) : (a = i[_].x, h = i[_].y), 3 > u)t.rect(a - g, h - g, u, u); else switch (e.iconType) {
                    case"circle":
                        t.moveTo(a, h), t.arc(a, h, g, 0, f, !0);
                        break;
                    case"diamond":
                        t.moveTo(a, h - g), t.lineTo(a + g / 3, h - g / 3), t.lineTo(a + g, h), t.lineTo(a + g / 3, h + g / 3), t.lineTo(a, h + g), t.lineTo(a - g / 3, h + g / 3), t.lineTo(a - g, h), t.lineTo(a - g / 3, h - g / 3), t.lineTo(a, h - g);
                        break;
                    default:
                        t.rect(a - g, h - g, u, u)
                }
                if (t.closePath(), d - 1 > m)switch (e.brushType) {
                    case"both":
                        t.fill(), e.lineWidth > 0 && t.stroke();
                        break;
                    case"stroke":
                        e.lineWidth > 0 && t.stroke();
                        break;
                    default:
                        t.fill()
                }
            }
        }, getRect: function (t) {
            return t.__rect || s.getRect(t)
        }, isCover: t("./normalIsCover")}, r.inherits(e, i), e
    }), i("echarts/util/ecAnimation", ["require", "zrender/tool/util", "zrender/shape/Polygon"], function (t) {
        function e(t, e, i, o, s) {
            var r, n = i.style.pointList, a = n.length;
            if (!e) {
                if (r = [], "vertical" != i._orient)for (var h = n[0][1], l = 0; a > l; l++)r[l] = [n[l][0], h]; else for (var d = n[0][0], l = 0; a > l; l++)r[l] = [d, n[l][1]];
                "half-smooth-polygon" == i.type && (r[a - 1] = g.clone(n[a - 1]), r[a - 2] = g.clone(n[a - 2])), e = {style: {pointList: r}}
            }
            r = e.style.pointList;
            var c = r.length;
            i.style.pointList = c == a ? r : a > c ? r.concat(n.slice(c)) : r.slice(0, a), t.addShape(i), t.animate(i.id, "style").when(o, {pointList: n}).start(s)
        }

        function i(t, e) {
            for (var i = arguments.length, o = 2; i > o; o++) {
                var s = arguments[o];
                t.style[s] = e.style[s]
            }
        }

        function o(t, e, o, s, r) {
            var n = o.style;
            e || (e = {position: o.position, style: {x: n.x, y: "vertical" == o._orient ? n.y + n.height : n.y, width: "vertical" == o._orient ? n.width : 0, height: "vertical" != o._orient ? n.height : 0}});
            var a = n.x, h = n.y, l = n.width, d = n.height, c = [o.position[0], o.position[1]];
            i(o, e, "x", "y", "width", "height"), o.position = e.position, t.addShape(o), (c[0] != e.position[0] || c[1] != e.position[1]) && t.animate(o.id, "").when(s, {position: c}).start(r), t.animate(o.id, "style").when(s, {x: a, y: h, width: l, height: d}).start(r)
        }

        function s(t, e, i, o, s) {
            if (!e) {
                var r = i.style.y;
                e = {style: {y: [r[0], r[0], r[0], r[0]]}}
            }
            var n = i.style.y;
            i.style.y = e.style.y, t.addShape(i), t.animate(i.id, "style").when(o, {y: n}).start(s)
        }

        function r(t, e, i, o, s) {
            var r = i.style.x, n = i.style.y, a = i.style.r0, h = i.style.r;
            "r" != i._animationAdd ? (i.style.r0 = 0, i.style.r = 0, i.rotation = [2 * Math.PI, r, n], t.addShape(i), t.animate(i.id, "style").when(o, {r0: a, r: h}).start(s), t.animate(i.id, "").when(Math.round(o / 3 * 2), {rotation: [0, r, n]}).start(s)) : (i.style.r0 = i.style.r, t.addShape(i), t.animate(i.id, "style").when(o, {r0: a}).start(s))
        }

        function n(t, e, o, s, r) {
            e || (e = "r" != o._animationAdd ? {style: {startAngle: o.style.startAngle, endAngle: o.style.startAngle}} : {style: {r0: o.style.r}});
            var n = o.style.startAngle, a = o.style.endAngle;
            i(o, e, "startAngle", "endAngle"), t.addShape(o), t.animate(o.id, "style").when(s, {startAngle: n, endAngle: a}).start(r)
        }

        function a(t, e, o, s, r) {
            e || (e = {style: {x: "left" == o.style.textAlign ? o.style.x + 100 : o.style.x - 100, y: o.style.y}});
            var n = o.style.x, a = o.style.y;
            i(o, e, "x", "y"), t.addShape(o), t.animate(o.id, "style").when(s, {x: n, y: a}).start(r)
        }

        function h(e, i, o, s, r) {
            var n = t("zrender/shape/Polygon").prototype.getRect(o.style), a = n.x + n.width / 2, h = n.y + n.height / 2;
            o.scale = [.1, .1, a, h], e.addShape(o), e.animate(o.id, "").when(s, {scale: [1, 1, a, h]}).start(r)
        }

        function l(t, e, o, s, r) {
            e || (e = {style: {source0: 0, source1: o.style.source1 > 0 ? 360 : -360, target0: 0, target1: o.style.target1 > 0 ? 360 : -360}});
            var n = o.style.source0, a = o.style.source1, h = o.style.target0, l = o.style.target1;
            e.style && i(o, e, "source0", "source1", "target0", "target1"), t.addShape(o), t.animate(o.id, "style").when(s, {source0: n, source1: a, target0: h, target1: l}).start(r)
        }

        function d(t, e, i, o, s) {
            e || (e = {style: {angle: i.style.startAngle}});
            var r = i.style.angle;
            i.style.angle = e.style.angle, t.addShape(i), t.animate(i.id, "style").when(o, {angle: r}).start(s)
        }

        function c(t, e, i, s, r, n) {
            if (i.style._x = i.style.x, i.style._y = i.style.y, i.style._width = i.style.width, i.style._height = i.style.height, e)o(t, e, i, s, r); else {
                var a = i._x || 0, h = i._y || 0;
                i.scale = [.01, .01, a, h], t.addShape(i), t.animate(i.id, "").delay(n).when(s, {scale: [1, 1, a, h]}).start(r || "QuinticOut")
            }
        }

        function p(t, e, o, s, r) {
            e || (e = {style: {xStart: o.style.xStart, yStart: o.style.yStart, xEnd: o.style.xStart, yEnd: o.style.yStart}});
            var n = o.style.xStart, a = o.style.xEnd, h = o.style.yStart, l = o.style.yEnd;
            i(o, e, "xStart", "xEnd", "yStart", "yEnd"), t.addShape(o), t.animate(o.id, "style").when(s, {xStart: n, xEnd: a, yStart: h, yEnd: l}).start(r)
        }

        function u(t, e, i, o, s) {
            i.style.smooth ? e ? t.addShape(i) : (i.style.pointListLength = 1, t.addShape(i), i.style.pointList = i.style.pointList || i.getPointList(i.style), t.animate(i.id, "style").when(o, {pointListLength: i.style.pointList.length}).start(s || "QuinticOut")) : (i.style.pointList = e ? e.style.pointList : [
                [i.style.xStart, i.style.yStart],
                [i.style.xStart, i.style.yStart]
            ], t.addShape(i), t.animate(i.id, "style").when(o, {pointList: [
                [i.style.xStart, i.style.yStart],
                [i._x || 0, i._y || 0]
            ]}).start(s || "QuinticOut"))
        }

        var g = t("zrender/tool/util");
        return{pointList: e, rectangle: o, candle: s, ring: r, sector: n, text: a, polygon: h, ribbon: l, gaugePointer: d, icon: c, line: p, markline: u}
    }), i("echarts/util/ecEffect", ["require", "../util/ecData", "zrender/shape/Circle", "zrender/shape/Image", "../util/shape/Icon", "../util/shape/Symbol", "zrender/tool/env"], function (t) {
        function e(t, e, i, o) {
            var r = i.effect, h = r.color || i.style.strokeColor || i.style.color, d = r.shadowColor || h, c = r.scaleSize, p = "undefined" != typeof r.shadowBlur ? r.shadowBlur : c, u = new a({zlevel: o, style: {brushType: "stroke", iconType: "pin" != i.style.iconType && "droplet" != i.style.iconType ? i.style.iconType : "circle", x: p + 1, y: p + 1, n: i.style.n, width: i.style._width * c, height: i.style._height * c, lineWidth: 1, strokeColor: h, shadowColor: d, shadowBlur: p}, draggable: !1, hoverable: !1});
            l && (u.style.image = t.shapeToImage(u, u.style.width + 2 * p + 2, u.style.height + 2 * p + 2).style.image, u = new n({zlevel: u.zlevel, style: u.style, draggable: !1, hoverable: !1})), s.clone(i, u), u.position = i.position, e.push(u), t.addShape(u);
            var g = window.devicePixelRatio || 1, f = (u.style.width / g - i.style._width) / 2;
            u.style.x = i.style._x - f, u.style.y = i.style._y - f;
            var m = 100 * (r.period + 10 * Math.random());
            t.modShape(i.id, {invisible: !0});
            var _ = u.style.x + u.style.width / 2 / g, y = u.style.y + u.style.height / 2 / g;
            t.modShape(u.id, {scale: [.1, .1, _, y]}), t.animate(u.id, "", r.loop).when(m, {scale: [1, 1, _, y]}).done(function () {
                i.effect.show = !1, t.delShape(u.id)
            }).start()
        }

        function i(t, e, i, o) {
            var s = i.effect, r = s.color || i.style.strokeColor || i.style.color, n = s.scaleSize, a = s.shadowColor || r, l = "undefined" != typeof s.shadowBlur ? s.shadowBlur : 2 * n, d = window.devicePixelRatio || 1, c = new h({zlevel: o, position: i.position, scale: i.scale, style: {pointList: i.style.pointList, iconType: i.style.iconType, color: r, strokeColor: r, shadowColor: a, shadowBlur: l * d, random: !0, brushType: "fill", lineWidth: 1, size: i.style.size}, draggable: !1, hoverable: !1});
            e.push(c), t.addShape(c), t.modShape(i.id, {invisible: !0});
            for (var p = Math.round(100 * s.period), u = {}, g = {}, f = 0; 20 > f; f++)c.style["randomMap" + f] = 0, u = {}, u["randomMap" + f] = 100, g = {}, g["randomMap" + f] = 0, c.style["randomMap" + f] = 100 * Math.random(), t.animate(c.id, "style", !0).when(p, u).when(2 * p, g).when(3 * p, u).when(4 * p, u).delay(Math.random() * p * f).start()
        }

        function o(t, e, i, o) {
            var a, h = i.effect, d = h.color || i.style.strokeColor || i.style.color, c = h.shadowColor || i.style.strokeColor || d, p = i.style.lineWidth * h.scaleSize, u = "undefined" != typeof h.shadowBlur ? h.shadowBlur : p, g = new r({zlevel: o, style: {x: u, y: u, r: p, color: d, shadowColor: c, shadowBlur: u}, draggable: !1, hoverable: !1});
            l ? (g.style.image = t.shapeToImage(g, 2 * (p + u), 2 * (p + u)).style.image, g = new n({zlevel: g.zlevel, style: g.style, draggable: !1, hoverable: !1}), a = u) : a = 0, s.clone(i, g), g.position = i.position, e.push(g), t.addShape(g), g.style.x = i.style.xStart - a, g.style.y = i.style.yStart - a;
            var f = (i.style.xStart - i.style.xEnd) * (i.style.xStart - i.style.xEnd) + (i.style.yStart - i.style.yEnd) * (i.style.yStart - i.style.yEnd), m = Math.round(Math.sqrt(Math.round(f * h.period * h.period)));
            if (i.style.smooth) {
                var _ = i.style.pointList || i.getPointList(i.style), y = _.length;
                m = Math.round(m / y);
                for (var v = t.animate(g.id, "style", h.loop), x = Math.ceil(y / 8), b = 0; y - x > b; b += x)v.when(m * (b + 1), {x: _[b][0] - a, y: _[b][1] - a});
                v.when(m * y, {x: _[y - 1][0] - a, y: _[y - 1][1] - a}), v.done(function () {
                    i.effect.show = !1, t.delShape(g.id)
                }), v.start("spline")
            } else t.animate(g.id, "style", h.loop).when(m, {x: i._x - a, y: i._y - a}).done(function () {
                i.effect.show = !1, t.delShape(g.id)
            }).start()
        }

        var s = t("../util/ecData"), r = t("zrender/shape/Circle"), n = t("zrender/shape/Image"), a = t("../util/shape/Icon"), h = t("../util/shape/Symbol"), l = t("zrender/tool/env").canvasSupported;
        return{point: e, largePoint: i, line: o}
    }), i("zrender/shape/Star", ["require", "../tool/math", "./Base", "../tool/util"], function (t) {
        var e = t("../tool/math"), i = e.sin, o = e.cos, s = Math.PI, r = t("./Base"), n = function (t) {
            r.call(this, t)
        };
        return n.prototype = {type: "star", buildPath: function (t, e) {
            var r = e.n;
            if (r && !(2 > r)) {
                var n = e.x, a = e.y, h = e.r, l = e.r0;
                null == l && (l = r > 4 ? h * o(2 * s / r) / o(s / r) : h / 3);
                var d = s / r, c = -s / 2, p = n + h * o(c), u = a + h * i(c);
                c += d;
                var g = e.pointList = [];
                g.push([p, u]);
                for (var f, m = 0, _ = 2 * r - 1; _ > m; m++)f = m % 2 === 0 ? l : h, g.push([n + f * o(c), a + f * i(c)]), c += d;
                g.push([p, u]), t.moveTo(g[0][0], g[0][1]);
                for (var m = 0; m < g.length; m++)t.lineTo(g[m][0], g[m][1]);
                t.closePath()
            }
        }, getRect: function (t) {
            if (t.__rect)return t.__rect;
            var e;
            return e = "stroke" == t.brushType || "fill" == t.brushType ? t.lineWidth || 1 : 0, t.__rect = {x: Math.round(t.x - t.r - e / 2), y: Math.round(t.y - t.r - e / 2), width: 2 * t.r + e, height: 2 * t.r + e}, t.__rect
        }}, t("../tool/util").inherits(n, r), n
    }), i("zrender/shape/Heart", ["require", "./Base", "./util/PathProxy", "zrender/tool/area", "../tool/util"], function (t) {
        "use strict";
        var e = t("./Base"), i = t("./util/PathProxy"), o = t("zrender/tool/area"), s = function (t) {
            e.call(this, t), this._pathProxy = new i
        };
        return s.prototype = {type: "heart", buildPath: function (t, e) {
            var o = this._pathProxy || new i;
            o.begin(t), o.moveTo(e.x, e.y), o.bezierCurveTo(e.x + e.a / 2, e.y - 2 * e.b / 3, e.x + 2 * e.a, e.y + e.b / 3, e.x, e.y + e.b), o.bezierCurveTo(e.x - 2 * e.a, e.y + e.b / 3, e.x - e.a / 2, e.y - 2 * e.b / 3, e.x, e.y), o.closePath()
        }, getRect: function (t) {
            return t.__rect ? t.__rect : (this._pathProxy.isEmpty() || this.buildPath(null, t), this._pathProxy.fastBoundingRect())
        }, isCover: function (t, e) {
            var i = this.getTansform(t, e);
            t = i[0], e = i[1];
            var s = this.getRect(this.style);
            return t >= s.x && t <= s.x + s.width && e >= s.y && e <= s.y + s.height ? o.isInsidePath(this._pathProxy.pathCommands, this.style.lineWidth, this.style.brushType, t, e) : void 0
        }}, t("../tool/util").inherits(s, e), s
    }), i("zrender/shape/Droplet", ["require", "./Base", "./util/PathProxy", "zrender/tool/area", "../tool/util"], function (t) {
        "use strict";
        var e = t("./Base"), i = t("./util/PathProxy"), o = t("zrender/tool/area"), s = function (t) {
            e.call(this, t), this._pathProxy = new i
        };
        return s.prototype = {type: "droplet", buildPath: function (t, e) {
            var o = this._pathProxy || new i;
            o.begin(t), o.moveTo(e.x, e.y + e.a), o.bezierCurveTo(e.x + e.a, e.y + e.a, e.x + 3 * e.a / 2, e.y - e.a / 3, e.x, e.y - e.b), o.bezierCurveTo(e.x - 3 * e.a / 2, e.y - e.a / 3, e.x - e.a, e.y + e.a, e.x, e.y + e.a), o.closePath()
        }, getRect: function (t) {
            return t.__rect ? t.__rect : (this._pathProxy.isEmpty() || this.buildPath(null, t), this._pathProxy.fastBoundingRect())
        }, isCover: function (t, e) {
            var i = this.getTansform(t, e);
            t = i[0], e = i[1];
            var s = this.getRect(this.style);
            return t >= s.x && t <= s.x + s.width && e >= s.y && e <= s.y + s.height ? o.isInsidePath(this._pathProxy.pathCommands, this.style.lineWidth, this.style.brushType, t, e) : void 0
        }}, t("../tool/util").inherits(s, e), s
    }), i("zrender/tool/math", [], function () {
        function t(t, e) {
            return Math.sin(e ? t * s : t)
        }

        function e(t, e) {
            return Math.cos(e ? t * s : t)
        }

        function i(t) {
            return t * s
        }

        function o(t) {
            return t / s
        }

        var s = Math.PI / 180;
        return{sin: t, cos: e, degreeToRadian: i, radianToDegree: o}
    }), i("zrender/shape/util/PathProxy", ["require", "../../tool/vector"], function (t) {
        var e = t("../../tool/vector"), i = function (t, e) {
            this.command = t, this.points = e || null
        }, o = function () {
            this.pathCommands = [], this._ctx = null, this._min = [], this._max = []
        };
        return o.prototype.fastBoundingRect = function () {
            var t = this._min, i = this._max;
            t[0] = t[1] = 1 / 0, i[0] = i[1] = -1 / 0;
            for (var o = 0; o < this.pathCommands.length; o++) {
                var s = this.pathCommands[o], r = s.points;
                switch (s.command) {
                    case"M":
                        e.min(t, t, r), e.max(i, i, r);
                        break;
                    case"L":
                        e.min(t, t, r), e.max(i, i, r);
                        break;
                    case"C":
                        for (var n = 0; 6 > n; n += 2)t[0] = Math.min(t[0], t[0], r[n]), t[1] = Math.min(t[1], t[1], r[n + 1]), i[0] = Math.max(i[0], i[0], r[n]), i[1] = Math.max(i[1], i[1], r[n + 1]);
                        break;
                    case"Q":
                        for (var n = 0; 4 > n; n += 2)t[0] = Math.min(t[0], t[0], r[n]), t[1] = Math.min(t[1], t[1], r[n + 1]), i[0] = Math.max(i[0], i[0], r[n]), i[1] = Math.max(i[1], i[1], r[n + 1]);
                        break;
                    case"A":
                        var a = r[0], h = r[1], l = r[2], d = r[3];
                        t[0] = Math.min(t[0], t[0], a - l), t[1] = Math.min(t[1], t[1], h - d), i[0] = Math.max(i[0], i[0], a + l), i[1] = Math.max(i[1], i[1], h + d)
                }
            }
            return{x: t[0], y: t[1], width: i[0] - t[0], height: i[1] - t[1]}
        }, o.prototype.begin = function (t) {
            return this._ctx = t || null, this.pathCommands.length = 0, this
        }, o.prototype.moveTo = function (t, e) {
            return this.pathCommands.push(new i("M", [t, e])), this._ctx && this._ctx.moveTo(t, e), this
        }, o.prototype.lineTo = function (t, e) {
            return this.pathCommands.push(new i("L", [t, e])), this._ctx && this._ctx.lineTo(t, e), this
        }, o.prototype.bezierCurveTo = function (t, e, o, s, r, n) {
            return this.pathCommands.push(new i("C", [t, e, o, s, r, n])), this._ctx && this._ctx.bezierCurveTo(t, e, o, s, r, n), this
        }, o.prototype.quadraticCurveTo = function (t, e, o, s) {
            return this.pathCommands.push(new i("Q", [t, e, o, s])), this._ctx && this._ctx.quadraticCurveTo(t, e, o, s), this
        }, o.prototype.arc = function (t, e, o, s, r, n) {
            return this.pathCommands.push(new i("A", [t, e, o, o, s, r - s, 0, n ? 0 : 1])), this._ctx && this._ctx.arc(t, e, o, s, r, n), this
        }, o.prototype.arcTo = function (t, e, i, o, s) {
            return this._ctx && this._ctx.arcTo(t, e, i, o, s), this
        }, o.prototype.rect = function (t, e, i, o) {
            return this._ctx && this._ctx.rect(t, e, i, o), this
        }, o.prototype.closePath = function () {
            return this.pathCommands.push(new i("z")), this._ctx && this._ctx.closePath(), this
        }, o.prototype.isEmpty = function () {
            return 0 === this.pathCommands.length
        }, o.PathSegment = i, o
    }), i("zrender/shape/Line", ["require", "./Base", "./util/dashedLineTo", "../tool/util"], function (t) {
        var e = t("./Base"), i = t("./util/dashedLineTo"), o = function (t) {
            this.brushTypeOnly = "stroke", this.textPosition = "end", e.call(this, t)
        };
        return o.prototype = {type: "line", buildPath: function (t, e) {
            if (e.lineType && "solid" != e.lineType) {
                if ("dashed" == e.lineType || "dotted" == e.lineType) {
                    var o = (e.lineWidth || 1) * ("dashed" == e.lineType ? 5 : 1);
                    i(t, e.xStart, e.yStart, e.xEnd, e.yEnd, o)
                }
            } else t.moveTo(e.xStart, e.yStart), t.lineTo(e.xEnd, e.yEnd)
        }, getRect: function (t) {
            if (t.__rect)return t.__rect;
            var e = t.lineWidth || 1;
            return t.__rect = {x: Math.min(t.xStart, t.xEnd) - e, y: Math.min(t.yStart, t.yEnd) - e, width: Math.abs(t.xStart - t.xEnd) + e, height: Math.abs(t.yStart - t.yEnd) + e}, t.__rect
        }}, t("../tool/util").inherits(o, e), o
    }), i("zrender/shape/BrokenLine", ["require", "./Base", "./util/smoothSpline", "./util/smoothBezier", "./util/dashedLineTo", "./Polygon", "../tool/util"], function (t) {
        var e = t("./Base"), i = t("./util/smoothSpline"), o = t("./util/smoothBezier"), s = t("./util/dashedLineTo"), r = function (t) {
            this.brushTypeOnly = "stroke", this.textPosition = "end", e.call(this, t)
        };
        return r.prototype = {type: "broken-line", buildPath: function (t, e) {
            var r = e.pointList;
            if (!(r.length < 2)) {
                var n = Math.min(e.pointList.length, Math.round(e.pointListLength || e.pointList.length));
                if (e.smooth && "spline" !== e.smooth) {
                    var a = o(r, e.smooth, !1, e.smoothConstraint);
                    t.moveTo(r[0][0], r[0][1]);
                    for (var h, l, d, c = 0; n - 1 > c; c++)h = a[2 * c], l = a[2 * c + 1], d = r[c + 1], t.bezierCurveTo(h[0], h[1], l[0], l[1], d[0], d[1])
                } else if ("spline" === e.smooth && (r = i(r), n = r.length), e.lineType && "solid" != e.lineType) {
                    if ("dashed" == e.lineType || "dotted" == e.lineType) {
                        var p = (e.lineWidth || 1) * ("dashed" == e.lineType ? 5 : 1);
                        t.moveTo(r[0][0], r[0][1]);
                        for (var c = 1; n > c; c++)s(t, r[c - 1][0], r[c - 1][1], r[c][0], r[c][1], p)
                    }
                } else {
                    t.moveTo(r[0][0], r[0][1]);
                    for (var c = 1; n > c; c++)t.lineTo(r[c][0], r[c][1])
                }
            }
        }, getRect: function (e) {
            return t("./Polygon").prototype.getRect(e)
        }}, t("../tool/util").inherits(r, e), r
    }), i("zrender/shape/util/dashedLineTo", [], function () {
        var t = [5, 5];
        return function (e, i, o, s, r, n) {
            if (e.setLineDash)return t[0] = t[1] = n, e.setLineDash(t), e.moveTo(i, o), void e.lineTo(s, r);
            n = "number" != typeof n ? 5 : n;
            var a = s - i, h = r - o, l = Math.floor(Math.sqrt(a * a + h * h) / n);
            a /= l, h /= l;
            for (var d = !0, c = 0; l > c; ++c)d ? e.moveTo(i, o) : e.lineTo(i, o), d = !d, i += a, o += h;
            e.lineTo(s, r)
        }
    }), i("zrender/shape/util/smoothSpline", ["require", "../../tool/vector"], function (t) {
        function e(t, e, i, o, s, r, n) {
            var a = .5 * (i - t), h = .5 * (o - e);
            return(2 * (e - i) + a + h) * n + (-3 * (e - i) - 2 * a - h) * r + a * s + e
        }

        var i = t("../../tool/vector");
        return function (t, o) {
            for (var s = t.length, r = [], n = 0, a = 1; s > a; a++)n += i.distance(t[a - 1], t[a]);
            var h = n / 5;
            h = s > h ? s : h;
            for (var a = 0; h > a; a++) {
                var l, d, c, p = a / (h - 1) * (o ? s : s - 1), u = Math.floor(p), g = p - u, f = t[u % s];
                o ? (l = t[(u - 1 + s) % s], d = t[(u + 1) % s], c = t[(u + 2) % s]) : (l = t[0 === u ? u : u - 1], d = t[u > s - 2 ? s - 1 : u + 1], c = t[u > s - 3 ? s - 1 : u + 2]);
                var m = g * g, _ = g * m;
                r.push([e(l[0], f[0], d[0], c[0], g, m, _), e(l[1], f[1], d[1], c[1], g, m, _)])
            }
            return r
        }
    }), i("zrender/shape/util/smoothBezier", ["require", "../../tool/vector"], function (t) {
        var e = t("../../tool/vector");
        return function (t, i, o, s) {
            var r, n, a, h, l = [], d = [], c = [], p = [], u = !!s;
            if (u) {
                a = [1 / 0, 1 / 0], h = [-1 / 0, -1 / 0];
                for (var g = 0, f = t.length; f > g; g++)e.min(a, a, t[g]), e.max(h, h, t[g]);
                e.min(a, a, s[0]), e.max(h, h, s[1])
            }
            for (var g = 0, f = t.length; f > g; g++) {
                var r, n, m = t[g];
                if (o)r = t[g ? g - 1 : f - 1], n = t[(g + 1) % f]; else {
                    if (0 === g || g === f - 1) {
                        l.push(t[g]);
                        continue
                    }
                    r = t[g - 1], n = t[g + 1]
                }
                e.sub(d, n, r), e.scale(d, d, i);
                var _ = e.distance(m, r), y = e.distance(m, n), v = _ + y;
                0 !== v && (_ /= v, y /= v), e.scale(c, d, -_), e.scale(p, d, y);
                var x = e.add([], m, c), b = e.add([], m, p);
                u && (e.max(x, x, a), e.min(x, x, h), e.max(b, b, a), e.min(b, b, h)), l.push(x), l.push(b)
            }
            return o && l.push(l.shift()), l
        }
    }), i("zrender/shape/Polygon", ["require", "./Base", "./util/smoothSpline", "./util/smoothBezier", "./util/dashedLineTo", "../tool/util"], function (t) {
        var e = t("./Base"), i = t("./util/smoothSpline"), o = t("./util/smoothBezier"), s = t("./util/dashedLineTo"), r = function (t) {
            e.call(this, t)
        };
        return r.prototype = {type: "polygon", brush: function (t, e) {
            var i = this.style;
            e && (i = this.getHighlightStyle(i, this.highlightStyle || {})), t.save(), this.setContext(t, i), this.setTransform(t);
            var o = !1;
            ("fill" == i.brushType || "both" == i.brushType || "undefined" == typeof i.brushType) && (t.beginPath(), "dashed" == i.lineType || "dotted" == i.lineType ? (this.buildPath(t, {lineType: "solid", lineWidth: i.lineWidth, pointList: i.pointList}), o = !1) : (this.buildPath(t, i), o = !0), t.closePath(), t.fill()), i.lineWidth > 0 && ("stroke" == i.brushType || "both" == i.brushType) && (o || (t.beginPath(), this.buildPath(t, i)), t.stroke()), this.drawText(t, i, this.style), t.restore()
        }, buildPath: function (t, e) {
            var r = e.pointList;
            if (!(r.length < 2))if (e.smooth && "spline" !== e.smooth) {
                var n = o(r, e.smooth, !0, e.smoothConstraint);
                t.moveTo(r[0][0], r[0][1]);
                for (var a, h, l, d = r.length, c = 0; d > c; c++)a = n[2 * c], h = n[2 * c + 1], l = r[(c + 1) % d], t.bezierCurveTo(a[0], a[1], h[0], h[1], l[0], l[1])
            } else if ("spline" === e.smooth && (r = i(r, !0)), e.lineType && "solid" != e.lineType) {
                if ("dashed" == e.lineType || "dotted" == e.lineType) {
                    var p = e._dashLength || (e.lineWidth || 1) * ("dashed" == e.lineType ? 5 : 1);
                    e._dashLength = p, t.moveTo(r[0][0], r[0][1]);
                    for (var c = 1, u = r.length; u > c; c++)s(t, r[c - 1][0], r[c - 1][1], r[c][0], r[c][1], p);
                    s(t, r[r.length - 1][0], r[r.length - 1][1], r[0][0], r[0][1], p)
                }
            } else {
                t.moveTo(r[0][0], r[0][1]);
                for (var c = 1, u = r.length; u > c; c++)t.lineTo(r[c][0], r[c][1]);
                t.lineTo(r[0][0], r[0][1])
            }
        }, getRect: function (t) {
            if (t.__rect)return t.__rect;
            for (var e = Number.MAX_VALUE, i = Number.MIN_VALUE, o = Number.MAX_VALUE, s = Number.MIN_VALUE, r = t.pointList, n = 0, a = r.length; a > n; n++)r[n][0] < e && (e = r[n][0]), r[n][0] > i && (i = r[n][0]), r[n][1] < o && (o = r[n][1]), r[n][1] > s && (s = r[n][1]);
            var h;
            return h = "stroke" == t.brushType || "fill" == t.brushType ? t.lineWidth || 1 : 0, t.__rect = {x: Math.round(e - h / 2), y: Math.round(o - h / 2), width: i - e + h, height: s - o + h}, t.__rect
        }}, t("../tool/util").inherits(r, e), r
    }), i("echarts/util/shape/normalIsCover", [], function () {
        return function (t, e) {
            var i = this.getTansform(t, e);
            t = i[0], e = i[1];
            var o = this.style.__rect;
            return o || (o = this.style.__rect = this.getRect(this.style)), t >= o.x && t <= o.x + o.width && e >= o.y && e <= o.y + o.height
        }
    }), i("echarts/component/dataView", ["require", "./base", "../config", "zrender/tool/util", "../component"], function (t) {
        function e(t, e, o, s, r) {
            i.call(this, t, e, o, s, r), this.dom = r.dom, this._tDom = document.createElement("div"), this._textArea = document.createElement("textArea"), this._buttonRefresh = document.createElement("button"), this._buttonClose = document.createElement("button"), this._hasShow = !1, this._zrHeight = o.getHeight(), this._zrWidth = o.getWidth(), this._tDom.className = "echarts-dataview", this.hide(), this.dom.firstChild.appendChild(this._tDom), window.addEventListener ? (this._tDom.addEventListener("click", this._stop), this._tDom.addEventListener("mousewheel", this._stop), this._tDom.addEventListener("mousemove", this._stop), this._tDom.addEventListener("mousedown", this._stop), this._tDom.addEventListener("mouseup", this._stop), this._tDom.addEventListener("touchstart", this._stop), this._tDom.addEventListener("touchmove", this._stop), this._tDom.addEventListener("touchend", this._stop)) : (this._tDom.attachEvent("onclick", this._stop), this._tDom.attachEvent("onmousewheel", this._stop), this._tDom.attachEvent("onmousemove", this._stop), this._tDom.attachEvent("onmousedown", this._stop), this._tDom.attachEvent("onmouseup", this._stop))
        }

        var i = t("./base"), o = t("../config"), s = t("zrender/tool/util");
        return e.prototype = {type: o.COMPONENT_TYPE_DATAVIEW, _lang: ["Data View", "close", "refresh"], _gCssText: "position:absolute;display:block;overflow:hidden;transition:height 0.8s,background-color 1s;-moz-transition:height 0.8s,background-color 1s;-webkit-transition:height 0.8s,background-color 1s;-o-transition:height 0.8s,background-color 1s;z-index:1;left:0;top:0;", hide: function () {
            this._sizeCssText = "width:" + this._zrWidth + "px;height:0px;background-color:#f0ffff;", this._tDom.style.cssText = this._gCssText + this._sizeCssText
        }, show: function (t) {
            this._hasShow = !0;
            var e = this.query(this.option, "toolbox.feature.dataView.lang") || this._lang;
            this.option = t, this._tDom.innerHTML = '<p style="padding:8px 0;margin:0 0 10px 0;border-bottom:1px solid #eee">' + (e[0] || this._lang[0]) + "</p>", this._textArea.style.cssText = "display:block;margin:0 0 8px 0;padding:4px 6px;overflow:auto;width:" + (this._zrWidth - 15) + "px;height:" + (this._zrHeight - 100) + "px;";
            var i = this.query(this.option, "toolbox.feature.dataView.optionToContent");
            this._textArea.value = "function" != typeof i ? this._optionToContent() : i(this.option), this._tDom.appendChild(this._textArea), this._buttonClose.style.cssText = "float:right;padding:1px 6px;", this._buttonClose.innerHTML = e[1] || this._lang[1];
            var o = this;
            this._buttonClose.onclick = function () {
                o.hide()
            }, this._tDom.appendChild(this._buttonClose), this.query(this.option, "toolbox.feature.dataView.readOnly") === !1 ? (this._buttonRefresh.style.cssText = "float:right;margin-right:10px;padding:1px 6px;", this._buttonRefresh.innerHTML = e[2] || this._lang[2], this._buttonRefresh.onclick = function () {
                o._save()
            }, this._tDom.appendChild(this._buttonRefresh), this._textArea.readOnly = !1, this._textArea.style.cursor = "default") : (this._textArea.readOnly = !0, this._textArea.style.cursor = "text"), this._sizeCssText = "width:" + this._zrWidth + "px;height:" + this._zrHeight + "px;background-color:#fff;", this._tDom.style.cssText = this._gCssText + this._sizeCssText
        }, _optionToContent: function () {
            var t, e, i, s, r, n, a = [], h = "";
            if (this.option.xAxis)for (a = this.option.xAxis instanceof Array ? this.option.xAxis : [this.option.xAxis], t = 0, s = a.length; s > t; t++)if ("category" == (a[t].type || "category")) {
                for (n = [], e = 0, i = a[t].data.length; i > e; e++)r = a[t].data[e], n.push("undefined" != typeof r.value ? r.value : r);
                h += n.join(", ") + "\n\n"
            }
            if (this.option.yAxis)for (a = this.option.yAxis instanceof Array ? this.option.yAxis : [this.option.yAxis], t = 0, s = a.length; s > t; t++)if ("category" == a[t].type) {
                for (n = [], e = 0, i = a[t].data.length; i > e; e++)r = a[t].data[e], n.push("undefined" != typeof r.value ? r.value : r);
                h += n.join(", ") + "\n\n"
            }
            var l, d = this.option.series;
            for (t = 0, s = d.length; s > t; t++) {
                for (n = [], e = 0, i = d[t].data.length; i > e; e++)r = d[t].data[e], l = d[t].type == o.CHART_TYPE_PIE || d[t].type == o.CHART_TYPE_MAP ? (r.name || "-") + ":" : "", d[t].type == o.CHART_TYPE_SCATTER && (r = "undefined" != typeof r.value ? r.value : r, r = r.join(", ")), n.push(l + ("undefined" != typeof r.value ? r.value : r));
                h += (d[t].name || "-") + " : \n", h += n.join(d[t].type == o.CHART_TYPE_SCATTER ? "\n" : ", "), h += "\n\n"
            }
            return h
        }, _save: function () {
            var t = this._textArea.value, e = this.query(this.option, "toolbox.feature.dataView.contentToOption");
            if ("function" != typeof e) {
                t = t.split("\n");
                for (var i = [], s = 0, r = t.length; r > s; s++)t[s] = this._trim(t[s]), "" !== t[s] && i.push(t[s]);
                this._contentToOption(i)
            } else e(t, this.option);
            this.hide();
            var n = this;
            setTimeout(function () {
                n.messageCenter && n.messageCenter.dispatch(o.EVENT.DATA_VIEW_CHANGED, null, {option: n.option}, n.myChart)
            }, n.canvasSupported ? 800 : 100)
        }, _contentToOption: function (t) {
            var e, i, s, r, n, a, h, l = [], d = 0;
            if (this.option.xAxis)for (l = this.option.xAxis instanceof Array ? this.option.xAxis : [this.option.xAxis], e = 0, r = l.length; r > e; e++)if ("category" == (l[e].type || "category")) {
                for (a = t[d].split(","), i = 0, s = l[e].data.length; s > i; i++)h = this._trim(a[i] || ""), n = l[e].data[i], "undefined" != typeof l[e].data[i].value ? l[e].data[i].value = h : l[e].data[i] = h;
                d++
            }
            if (this.option.yAxis)for (l = this.option.yAxis instanceof Array ? this.option.yAxis : [this.option.yAxis], e = 0, r = l.length; r > e; e++)if ("category" == l[e].type) {
                for (a = t[d].split(","), i = 0, s = l[e].data.length; s > i; i++)h = this._trim(a[i] || ""), n = l[e].data[i], "undefined" != typeof l[e].data[i].value ? l[e].data[i].value = h : l[e].data[i] = h;
                d++
            }
            var c = this.option.series;
            for (e = 0, r = c.length; r > e; e++)if (d++, c[e].type == o.CHART_TYPE_SCATTER)for (var i = 0, s = c[e].data.length; s > i; i++)a = t[d], h = a.replace(" ", "").split(","), "undefined" != typeof c[e].data[i].value ? c[e].data[i].value = h : c[e].data[i] = h, d++; else {
                a = t[d].split(",");
                for (var i = 0, s = c[e].data.length; s > i; i++)h = (a[i] || "").replace(/.*:/, ""), h = this._trim(h), h = "-" != h && "" !== h ? h - 0 : "-", "undefined" != typeof c[e].data[i].value ? c[e].data[i].value = h : c[e].data[i] = h;
                d++
            }
        }, _trim: function (t) {
            var e = new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+$)", "g");
            return t.replace(e, "")
        }, _stop: function (t) {
            t = t || window.event, t.stopPropagation ? t.stopPropagation() : t.cancelBubble = !0
        }, resize: function () {
            this._zrHeight = this.zr.getHeight(), this._zrWidth = this.zr.getWidth(), this._tDom.offsetHeight > 10 && (this._sizeCssText = "width:" + this._zrWidth + "px;height:" + this._zrHeight + "px;background-color:#fff;", this._tDom.style.cssText = this._gCssText + this._sizeCssText, this._textArea.style.cssText = "display:block;margin:0 0 8px 0;padding:4px 6px;overflow:auto;width:" + (this._zrWidth - 15) + "px;height:" + (this._zrHeight - 100) + "px;")
        }, dispose: function () {
            window.removeEventListener ? (this._tDom.removeEventListener("click", this._stop), this._tDom.removeEventListener("mousewheel", this._stop), this._tDom.removeEventListener("mousemove", this._stop), this._tDom.removeEventListener("mousedown", this._stop), this._tDom.removeEventListener("mouseup", this._stop), this._tDom.removeEventListener("touchstart", this._stop), this._tDom.removeEventListener("touchmove", this._stop), this._tDom.removeEventListener("touchend", this._stop)) : (this._tDom.detachEvent("onclick", this._stop), this._tDom.detachEvent("onmousewheel", this._stop), this._tDom.detachEvent("onmousemove", this._stop), this._tDom.detachEvent("onmousedown", this._stop), this._tDom.detachEvent("onmouseup", this._stop)), this._buttonRefresh.onclick = null, this._buttonClose.onclick = null, this._hasShow && (this._tDom.removeChild(this._textArea), this._tDom.removeChild(this._buttonRefresh), this._tDom.removeChild(this._buttonClose)), this._textArea = null, this._buttonRefresh = null, this._buttonClose = null, this.dom.firstChild.removeChild(this._tDom), this._tDom = null
        }}, s.inherits(e, i), t("../component").define("dataView", e), e
    }), i("echarts/util/shape/Cross", ["require", "zrender/shape/Base", "zrender/shape/Line", "zrender/tool/util", "./normalIsCover"], function (t) {
        function e(t) {
            i.call(this, t)
        }

        var i = t("zrender/shape/Base"), o = t("zrender/shape/Line"), s = t("zrender/tool/util");
        return e.prototype = {type: "cross", buildPath: function (t, e) {
            var i = e.rect;
            e.xStart = i.x, e.xEnd = i.x + i.width, e.yStart = e.yEnd = e.y, o.prototype.buildPath(t, e), e.xStart = e.xEnd = e.x, e.yStart = i.y, e.yEnd = i.y + i.height, o.prototype.buildPath(t, e)
        }, getRect: function (t) {
            return t.rect
        }, isCover: t("./normalIsCover")}, s.inherits(e, i), e
    }), i("zrender/shape/Sector", ["require", "../tool/math", "../tool/computeBoundingBox", "../tool/vector", "./Base", "../tool/util"], function (t) {
        var e = t("../tool/math"), i = t("../tool/computeBoundingBox"), o = t("../tool/vector"), s = t("./Base"), r = o.create(), n = o.create(), a = o.create(), h = o.create(), l = function (t) {
            s.call(this, t)
        };
        return l.prototype = {type: "sector", buildPath: function (t, i) {
            var o = i.x, s = i.y, r = i.r0 || 0, n = i.r, a = i.startAngle, h = i.endAngle, l = i.clockWise || !1;
            a = e.degreeToRadian(a), h = e.degreeToRadian(h), l || (a = -a, h = -h);
            var d = e.cos(a), c = e.sin(a);
            t.moveTo(d * r + o, c * r + s), t.lineTo(d * n + o, c * n + s), t.arc(o, s, n, a, h, !l), t.lineTo(e.cos(h) * r + o, e.sin(h) * r + s), 0 !== r && t.arc(o, s, r, h, a, l), t.closePath()
        }, getRect: function (t) {
            if (t.__rect)return t.__rect;
            var s = t.x, l = t.y, d = t.r0 || 0, c = t.r, p = e.degreeToRadian(t.startAngle), u = e.degreeToRadian(t.endAngle), g = t.clockWise;
            return g || (p = -p, u = -u), d > 1 ? i.arc(s, l, d, p, u, !g, r, a) : (r[0] = a[0] = s, r[1] = a[1] = l), i.arc(s, l, c, p, u, !g, n, h), o.min(r, r, n), o.max(a, a, h), t.__rect = {x: r[0], y: r[1], width: a[0] - r[0], height: a[1] - r[1]}, t.__rect
        }}, t("../tool/util").inherits(l, s), l
    }), i("echarts/util/shape/Candle", ["require", "zrender/shape/Base", "zrender/tool/util", "./normalIsCover"], function (t) {
        function e(t) {
            i.call(this, t)
        }

        var i = t("zrender/shape/Base"), o = t("zrender/tool/util");
        return e.prototype = {type: "candle", _numberOrder: function (t, e) {
            return e - t
        }, buildPath: function (t, e) {
            var i = o.clone(e.y).sort(this._numberOrder);
            t.moveTo(e.x, i[3]), t.lineTo(e.x, i[2]), t.moveTo(e.x - e.width / 2, i[2]), t.rect(e.x - e.width / 2, i[2], e.width, i[1] - i[2]), t.moveTo(e.x, i[1]), t.lineTo(e.x, i[0])
        }, getRect: function (t) {
            if (!t.__rect) {
                var e = 0;
                ("stroke" == t.brushType || "fill" == t.brushType) && (e = t.lineWidth || 1);
                var i = o.clone(t.y).sort(this._numberOrder);
                t.__rect = {x: Math.round(t.x - t.width / 2 - e / 2), y: Math.round(i[3] - e / 2), width: t.width + e, height: i[0] - i[3] + e}
            }
            return t.__rect
        }, isCover: t("./normalIsCover")}, o.inherits(e, i), e
    }), i("zrender/tool/computeBoundingBox", ["require", "./vector", "./curve"], function (t) {
        function e(t, e, i) {
            if (0 !== t.length) {
                for (var o = t[0][0], s = t[0][0], r = t[0][1], n = t[0][1], a = 1; a < t.length; a++) {
                    var h = t[a];
                    h[0] < o && (o = h[0]), h[0] > s && (s = h[0]), h[1] < r && (r = h[1]), h[1] > n && (n = h[1])
                }
                e[0] = o, e[1] = r, i[0] = s, i[1] = n
            }
        }

        function i(t, e, i, o, s, n) {
            var a = [];
            r.cubicExtrema(t[0], e[0], i[0], o[0], a);
            for (var h = 0; h < a.length; h++)a[h] = r.cubicAt(t[0], e[0], i[0], o[0], a[h]);
            var l = [];
            r.cubicExtrema(t[1], e[1], i[1], o[1], l);
            for (var h = 0; h < l.length; h++)l[h] = r.cubicAt(t[1], e[1], i[1], o[1], l[h]);
            a.push(t[0], o[0]), l.push(t[1], o[1]);
            var d = Math.min.apply(null, a), c = Math.max.apply(null, a), p = Math.min.apply(null, l), u = Math.max.apply(null, l);
            s[0] = d, s[1] = p, n[0] = c, n[1] = u
        }

        function o(t, e, i, o, s) {
            var n = r.quadraticExtremum(t[0], e[0], i[0]), a = r.quadraticExtremum(t[1], e[1], i[1]);
            n = Math.max(Math.min(n, 1), 0), a = Math.max(Math.min(a, 1), 0);
            var h = 1 - n, l = 1 - a, d = h * h * t[0] + 2 * h * n * e[0] + n * n * i[0], c = h * h * t[1] + 2 * h * n * e[1] + n * n * i[1], p = l * l * t[0] + 2 * l * a * e[0] + a * a * i[0], u = l * l * t[1] + 2 * l * a * e[1] + a * a * i[1];
            o[0] = Math.min(t[0], i[0], d, p), o[1] = Math.min(t[1], i[1], c, u), s[0] = Math.max(t[0], i[0], d, p), s[1] = Math.max(t[1], i[1], c, u)
        }

        var s = t("./vector"), r = t("./curve"), n = s.create(), a = s.create(), h = s.create(), l = function (t, e, i, o, r, l, d, c) {
            if (n[0] = Math.cos(o) * i + t, n[1] = Math.sin(o) * i + e, a[0] = Math.cos(r) * i + t, a[1] = Math.sin(r) * i + e, s.min(d, n, a), s.max(c, n, a), o %= 2 * Math.PI, 0 > o && (o += 2 * Math.PI), r %= 2 * Math.PI, 0 > r && (r += 2 * Math.PI), o > r && !l ? r += 2 * Math.PI : r > o && l && (o += 2 * Math.PI), l) {
                var p = r;
                r = o, o = p
            }
            for (var u = 0; r > u; u += Math.PI / 2)u > o && (h[0] = Math.cos(u) * i + t, h[1] = Math.sin(u) * i + e, s.min(d, h, d), s.max(c, h, c))
        };
        return e.cubeBezier = i, e.quadraticBezier = o, e.arc = l, e
    }), i("echarts/util/shape/Chain", ["require", "zrender/shape/Base", "./Icon", "zrender/shape/util/dashedLineTo", "zrender/tool/util", "zrender/tool/matrix"], function (t) {
        function e(t) {
            i.call(this, t)
        }

        var i = t("zrender/shape/Base"), o = t("./Icon"), s = t("zrender/shape/util/dashedLineTo"), r = t("zrender/tool/util"), n = t("zrender/tool/matrix");
        return e.prototype = {type: "chain", brush: function (t, e) {
            var i = this.style;
            e && (i = this.getHighlightStyle(i, this.highlightStyle || {})), t.save(), this.setContext(t, i), this.setTransform(t), t.save(), t.beginPath(), this.buildLinePath(t, i), t.stroke(), t.restore(), this.brushSymbol(t, i), t.restore()
        }, buildLinePath: function (t, e) {
            var i = e.x, o = e.y + 5, r = e.width, n = e.height / 2 - 10;
            if (t.moveTo(i, o), t.lineTo(i, o + n), t.moveTo(i + r, o), t.lineTo(i + r, o + n), t.moveTo(i, o + n / 2), e.lineType && "solid" != e.lineType) {
                if ("dashed" == e.lineType || "dotted" == e.lineType) {
                    var a = (e.lineWidth || 1) * ("dashed" == e.lineType ? 5 : 1);
                    s(t, i, o + n / 2, i + r, o + n / 2, a)
                }
            } else t.lineTo(i + r, o + n / 2)
        }, brushSymbol: function (t, e) {
            var i = e.y + e.height / 4;
            t.save();
            for (var s, r = e.chainPoint, n = 0, a = r.length; a > n; n++) {
                if (s = r[n], "none" != s.symbol) {
                    t.beginPath();
                    var h = s.symbolSize;
                    o.prototype.buildPath(t, {iconType: s.symbol, x: s.x - h, y: i - h, width: 2 * h, height: 2 * h, n: s.n}), t.fillStyle = s.isEmpty ? "#fff" : e.strokeColor, t.closePath(), t.fill(), t.stroke()
                }
                s.showLabel && (t.font = s.textFont, t.fillStyle = s.textColor, t.textAlign = s.textAlign, t.textBaseline = s.textBaseline, s.rotation ? (t.save(), this._updateTextTransform(t, s.rotation), t.fillText(s.name, s.textX, s.textY), t.restore()) : t.fillText(s.name, s.textX, s.textY))
            }
            t.restore()
        }, _updateTextTransform: function (t, e) {
            var i = n.create();
            if (n.identity(i), 0 !== e[0]) {
                var o = e[1] || 0, s = e[2] || 0;
                (o || s) && n.translate(i, i, [-o, -s]), n.rotate(i, i, e[0]), (o || s) && n.translate(i, i, [o, s])
            }
            t.transform.apply(t, i)
        }, isCover: function (t, e) {
            var i = this.style;
            return t >= i.x && t <= i.x + i.width && e >= i.y && e <= i.y + i.height ? !0 : !1
        }}, r.inherits(e, i), e
    }), i("zrender/shape/Ring", ["require", "./Base", "../tool/util"], function (t) {
        var e = t("./Base"), i = function (t) {
            e.call(this, t)
        };
        return i.prototype = {type: "ring", buildPath: function (t, e) {
            t.arc(e.x, e.y, e.r, 0, 2 * Math.PI, !1), t.moveTo(e.x + e.r0, e.y), t.arc(e.x, e.y, e.r0, 0, 2 * Math.PI, !0)
        }, getRect: function (t) {
            if (t.__rect)return t.__rect;
            var e;
            return e = "stroke" == t.brushType || "fill" == t.brushType ? t.lineWidth || 1 : 0, t.__rect = {x: Math.round(t.x - t.r - e / 2), y: Math.round(t.y - t.r - e / 2), width: 2 * t.r + e, height: 2 * t.r + e}, t.__rect
        }}, t("../tool/util").inherits(i, e), i
    }), i("echarts/component/axis", ["require", "./base", "zrender/shape/Line", "../config", "../util/ecData", "zrender/tool/util", "zrender/tool/color", "./categoryAxis", "./valueAxis", "../component"], function (t) {
        function e(t, e, o, s, r, n) {
            i.call(this, t, e, o, s, r), this.axisType = n, this._axisList = [], this.refresh(s)
        }

        var i = t("./base"), o = t("zrender/shape/Line"), s = t("../config"), r = t("../util/ecData"), n = t("zrender/tool/util"), a = t("zrender/tool/color");
        return e.prototype = {type: s.COMPONENT_TYPE_AXIS, axisBase: {_buildAxisLine: function () {
            var t = this.option.axisLine.lineStyle.width, e = t / 2, i = {_axisShape: "axisLine", zlevel: this._zlevelBase + 1, hoverable: !1};
            switch (this.option.position) {
                case"left":
                    i.style = {xStart: this.grid.getX() - e, yStart: this.grid.getYend(), xEnd: this.grid.getX() - e, yEnd: this.grid.getY(), lineCap: "round"};
                    break;
                case"right":
                    i.style = {xStart: this.grid.getXend() + e, yStart: this.grid.getYend(), xEnd: this.grid.getXend() + e, yEnd: this.grid.getY(), lineCap: "round"};
                    break;
                case"bottom":
                    i.style = {xStart: this.grid.getX(), yStart: this.grid.getYend() + e, xEnd: this.grid.getXend(), yEnd: this.grid.getYend() + e, lineCap: "round"};
                    break;
                case"top":
                    i.style = {xStart: this.grid.getX(), yStart: this.grid.getY() - e, xEnd: this.grid.getXend(), yEnd: this.grid.getY() - e, lineCap: "round"}
            }
            "" !== this.option.name && (i.style.text = this.option.name, i.style.textPosition = this.option.nameLocation, i.style.textFont = this.getFont(this.option.nameTextStyle), this.option.nameTextStyle.align && (i.style.textAlign = this.option.nameTextStyle.align), this.option.nameTextStyle.baseline && (i.style.textBaseline = this.option.nameTextStyle.baseline), this.option.nameTextStyle.color && (i.style.textColor = this.option.nameTextStyle.color)), i.style.strokeColor = this.option.axisLine.lineStyle.color, i.style.lineWidth = t, this.isHorizontal() ? i.style.yStart = i.style.yEnd = this.subPixelOptimize(i.style.yEnd, t) : i.style.xStart = i.style.xEnd = this.subPixelOptimize(i.style.xEnd, t), i.style.lineType = this.option.axisLine.lineStyle.type, i = new o(i), this.shapeList.push(i)
        }, _axisLabelClickable: function (t, e) {
            return t ? (r.pack(e, void 0, -1, void 0, -1, e.style.text), e.hoverable = !0, e.clickable = !0, e.highlightStyle = {color: a.lift(e.style.color, 1), brushType: "fill"}, e) : e
        }, refixAxisShape: function (t, e) {
            if (this.option.axisLine.onZero) {
                var i;
                if (this.isHorizontal() && null != e)for (var o = 0, s = this.shapeList.length; s > o; o++)"axisLine" === this.shapeList[o]._axisShape ? (this.shapeList[o].style.yStart = this.shapeList[o].style.yEnd = this.subPixelOptimize(e, this.shapeList[o].stylelineWidth), this.zr.modShape(this.shapeList[o].id)) : "axisTick" === this.shapeList[o]._axisShape && (i = this.shapeList[o].style.yEnd - this.shapeList[o].style.yStart, this.shapeList[o].style.yStart = e - i, this.shapeList[o].style.yEnd = e, this.zr.modShape(this.shapeList[o].id));
                if (!this.isHorizontal() && null != t)for (var o = 0, s = this.shapeList.length; s > o; o++)"axisLine" === this.shapeList[o]._axisShape ? (this.shapeList[o].style.xStart = this.shapeList[o].style.xEnd = this.subPixelOptimize(t, this.shapeList[o].stylelineWidth), this.zr.modShape(this.shapeList[o].id)) : "axisTick" === this.shapeList[o]._axisShape && (i = this.shapeList[o].style.xEnd - this.shapeList[o].style.xStart, this.shapeList[o].style.xStart = t, this.shapeList[o].style.xEnd = t + i, this.zr.modShape(this.shapeList[o].id))
            }
        }, getPosition: function () {
            return this.option.position
        }, isHorizontal: function () {
            return"bottom" === this.option.position || "top" === this.option.position
        }}, reformOption: function (t) {
            if (!t || t instanceof Array && 0 === t.length ? t = [
                {type: s.COMPONENT_TYPE_AXIS_VALUE}
            ] : t instanceof Array || (t = [t]), t.length > 2 && (t = [t[0], t[1]]), "xAxis" === this.axisType) {
                (!t[0].position || "bottom" != t[0].position && "top" != t[0].position) && (t[0].position = "bottom"), t.length > 1 && (t[1].position = "bottom" === t[0].position ? "top" : "bottom");
                for (var e = 0, i = t.length; i > e; e++)t[e].type = t[e].type || "category", t[e].xAxisIndex = e, t[e].yAxisIndex = -1
            } else {
                (!t[0].position || "left" != t[0].position && "right" != t[0].position) && (t[0].position = "left"), t.length > 1 && (t[1].position = "left" === t[0].position ? "right" : "left");
                for (var e = 0, i = t.length; i > e; e++)t[e].type = t[e].type || "value", t[e].xAxisIndex = -1, t[e].yAxisIndex = e
            }
            return t
        }, refresh: function (e) {
            var i;
            e && (this.option = e, "xAxis" === this.axisType ? (this.option.xAxis = this.reformOption(e.xAxis), i = this.option.xAxis) : (this.option.yAxis = this.reformOption(e.yAxis), i = this.option.yAxis), this.series = e.series);
            for (var o = t("./categoryAxis"), s = t("./valueAxis"), r = Math.max(i && i.length || 0, this._axisList.length), n = 0; r > n; n++)!this._axisList[n] || !e || i[n] && this._axisList[n].type == i[n].type || (this._axisList[n].dispose && this._axisList[n].dispose(), this._axisList[n] = !1), this._axisList[n] ? this._axisList[n].refresh && this._axisList[n].refresh(i ? i[n] : !1, this.series) : i && i[n] && (this._axisList[n] = "category" === i[n].type ? new o(this.ecTheme, this.messageCenter, this.zr, i[n], this.myChart, this.axisBase) : new s(this.ecTheme, this.messageCenter, this.zr, i[n], this.myChart, this.axisBase, this.series))
        }, getAxis: function (t) {
            return this._axisList[t]
        }, clear: function () {
            for (var t = 0, e = this._axisList.length; e > t; t++)this._axisList[t].dispose && this._axisList[t].dispose();
            this._axisList = []
        }}, n.inherits(e, i), t("../component").define("axis", e), e
    }), i("echarts/component/grid", ["require", "./base", "zrender/shape/Rectangle", "../config", "zrender/tool/util", "../component"], function (t) {
        function e(t, e, o, s, r) {
            i.call(this, t, e, o, s, r), this.refresh(s)
        }

        var i = t("./base"), o = t("zrender/shape/Rectangle"), s = t("../config"), r = t("zrender/tool/util");
        return e.prototype = {type: s.COMPONENT_TYPE_GRID, getX: function () {
            return this._x
        }, getY: function () {
            return this._y
        }, getWidth: function () {
            return this._width
        }, getHeight: function () {
            return this._height
        }, getXend: function () {
            return this._x + this._width
        }, getYend: function () {
            return this._y + this._height
        }, getArea: function () {
            return{x: this._x, y: this._y, width: this._width, height: this._height}
        }, getBbox: function () {
            return[
                [this._x, this._y],
                [this.getXend(), this.getYend()]
            ]
        }, refixAxisShape: function (t) {
            for (var e, i, o, r = t.xAxis._axisList.concat(t.yAxis ? t.yAxis._axisList : []), n = r.length; n--;)o = r[n], o.type == s.COMPONENT_TYPE_AXIS_VALUE && o._min < 0 && o._max >= 0 && (o.isHorizontal() ? e = o.getCoord(0) : i = o.getCoord(0));
            if ("undefined" != typeof e || "undefined" != typeof i)for (n = r.length; n--;)r[n].refixAxisShape(e, i)
        }, refresh: function (t) {
            if (t || this._zrWidth != this.zr.getWidth() || this._zrHeight != this.zr.getHeight()) {
                this.clear(), this.option = t || this.option, this.option.grid = this.reformOption(this.option.grid);
                var e = this.option.grid;
                this._zrWidth = this.zr.getWidth(), this._zrHeight = this.zr.getHeight(), this._x = this.parsePercent(e.x, this._zrWidth), this._y = this.parsePercent(e.y, this._zrHeight);
                var i = this.parsePercent(e.x2, this._zrWidth), s = this.parsePercent(e.y2, this._zrHeight);
                this._width = "undefined" == typeof e.width ? this._zrWidth - this._x - i : this.parsePercent(e.width, this._zrWidth), this._width = this._width <= 0 ? 10 : this._width, this._height = "undefined" == typeof e.height ? this._zrHeight - this._y - s : this.parsePercent(e.height, this._zrHeight), this._height = this._height <= 0 ? 10 : this._height, this._x = this.subPixelOptimize(this._x, e.borderWidth), this._y = this.subPixelOptimize(this._y, e.borderWidth), this.shapeList.push(new o({zlevel: this._zlevelBase, hoverable: !1, style: {x: this._x, y: this._y, width: this._width, height: this._height, brushType: e.borderWidth > 0 ? "both" : "fill", color: e.backgroundColor, strokeColor: e.borderColor, lineWidth: e.borderWidth}})), this.zr.addShape(this.shapeList[0])
            }
        }}, r.inherits(e, i), t("../component").define("grid", e), e
    }), i("echarts/component/dataZoom", ["require", "./base", "zrender/shape/Rectangle", "zrender/shape/Polygon", "../util/shape/Icon", "../config", "../util/date", "zrender/tool/util", "../component"], function (t) {
        function e(t, e, o, s, r) {
            i.call(this, t, e, o, s, r);
            var n = this;
            n._ondrift = function (t, e) {
                return n.__ondrift(this, t, e)
            }, n._ondragend = function () {
                return n.__ondragend()
            }, this._fillerSize = 28, this._handleSize = 8, this._isSilence = !1, this._zoom = {}, this.option.dataZoom = this.reformOption(this.option.dataZoom), this.zoomOption = this.option.dataZoom, this.myChart.canvasSupported || (this.zoomOption.realtime = !1), this._location = this._getLocation(), this._zoom = this._getZoom(), this._backupData(), this.option.dataZoom.show && this._buildShape(), this._syncData()
        }

        var i = t("./base"), o = t("zrender/shape/Rectangle"), s = t("zrender/shape/Polygon"), r = t("../util/shape/Icon"), n = t("../config"), a = t("../util/date"), h = t("zrender/tool/util");
        return e.prototype = {type: n.COMPONENT_TYPE_DATAZOOM, _buildShape: function () {
            this._buildBackground(), this._buildFiller(), this._buildHandle(), this._buildFrame();
            for (var t = 0, e = this.shapeList.length; e > t; t++)this.zr.addShape(this.shapeList[t]);
            this._syncFrameShape()
        }, _getLocation: function () {
            var t, e, i, o, s = this.component.grid;
            return"horizontal" == this.zoomOption.orient ? (i = this.zoomOption.width || s.getWidth(), o = this.zoomOption.height || this._fillerSize, t = null != this.zoomOption.x ? this.zoomOption.x : s.getX(), e = null != this.zoomOption.y ? this.zoomOption.y : this.zr.getHeight() - o - 2) : (i = this.zoomOption.width || this._fillerSize, o = this.zoomOption.height || s.getHeight(), t = null != this.zoomOption.x ? this.zoomOption.x : 2, e = null != this.zoomOption.y ? this.zoomOption.y : s.getY()), {x: t, y: e, width: i, height: o}
        }, _getZoom: function () {
            var t = this.option.series, e = this.option.xAxis;
            !e || e instanceof Array || (e = [e], this.option.xAxis = e);
            var i = this.option.yAxis;
            !i || i instanceof Array || (i = [i], this.option.yAxis = i);
            var o, s, r = [], a = this.zoomOption.xAxisIndex;
            if (e && null == a) {
                o = [];
                for (var h = 0, l = e.length; l > h; h++)("category" == e[h].type || null == e[h].type) && o.push(h)
            } else o = a instanceof Array ? a : null != a ? [a] : [];
            if (a = this.zoomOption.yAxisIndex, i && null == a) {
                s = [];
                for (var h = 0, l = i.length; l > h; h++)"category" == i[h].type && s.push(h)
            } else s = a instanceof Array ? a : null != a ? [a] : [];
            for (var d, h = 0, l = t.length; l > h; h++)if (d = t[h], d.type == n.CHART_TYPE_LINE || d.type == n.CHART_TYPE_BAR || d.type == n.CHART_TYPE_SCATTER || d.type == n.CHART_TYPE_K) {
                for (var c = 0, p = o.length; p > c; c++)if (o[c] == (d.xAxisIndex || 0)) {
                    r.push(h);
                    break
                }
                for (var c = 0, p = s.length; p > c; c++)if (s[c] == (d.yAxisIndex || 0)) {
                    r.push(h);
                    break
                }
                null == this.zoomOption.xAxisIndex && null == this.zoomOption.yAxisIndex && d.data && d.data[0] && d.data[0]instanceof Array && (d.type == n.CHART_TYPE_SCATTER || d.type == n.CHART_TYPE_LINE || d.type == n.CHART_TYPE_BAR) && r.push(h)
            }
            var u = null != this._zoom.start ? this._zoom.start : null != this.zoomOption.start ? this.zoomOption.start : 0, g = null != this._zoom.end ? this._zoom.end : null != this.zoomOption.end ? this.zoomOption.end : 100;
            u > g && (u += g, g = u - g, u -= g);
            var f = Math.round((g - u) / 100 * ("horizontal" == this.zoomOption.orient ? this._location.width : this._location.height));
            return{start: u, end: g, start2: 0, end2: 100, size: f, xAxisIndex: o, yAxisIndex: s, seriesIndex: r, scatterMap: this._zoom.scatterMap || {}}
        }, _backupData: function () {
            this._originalData = {xAxis: {}, yAxis: {}, series: {}};
            for (var t = this.option.xAxis, e = this._zoom.xAxisIndex, i = 0, o = e.length; o > i; i++)this._originalData.xAxis[e[i]] = t[e[i]].data;
            for (var s = this.option.yAxis, r = this._zoom.yAxisIndex, i = 0, o = r.length; o > i; i++)this._originalData.yAxis[r[i]] = s[r[i]].data;
            for (var a, h = this.option.series, l = this._zoom.seriesIndex, i = 0, o = l.length; o > i; i++)a = h[l[i]], this._originalData.series[l[i]] = a.data, a.data && a.data[0] && a.data[0]instanceof Array && (a.type == n.CHART_TYPE_SCATTER || a.type == n.CHART_TYPE_LINE || a.type == n.CHART_TYPE_BAR) && (this._backupScale(), this._calculScatterMap(l[i]))
        }, _calculScatterMap: function (e) {
            this._zoom.scatterMap = this._zoom.scatterMap || {}, this._zoom.scatterMap[e] = this._zoom.scatterMap[e] || {};
            var i = t("../component"), o = i.get("axis"), s = h.clone(this.option.xAxis);
            "category" == s[0].type && (s[0].type = "value"), s[1] && "category" == s[1].type && (s[1].type = "value");
            var r = new o(this.ecTheme, null, !1, {xAxis: s, series: this.option.series}, this, "xAxis"), n = this.option.series[e].xAxisIndex || 0;
            this._zoom.scatterMap[e].x = r.getAxis(n).getExtremum(), r.dispose(), s = h.clone(this.option.yAxis), "category" == s[0].type && (s[0].type = "value"), s[1] && "category" == s[1].type && (s[1].type = "value"), r = new o(this.ecTheme, null, !1, {yAxis: s, series: this.option.series}, this, "yAxis"), n = this.option.series[e].yAxisIndex || 0, this._zoom.scatterMap[e].y = r.getAxis(n).getExtremum(), r.dispose()
        }, _buildBackground: function () {
            var t = this._location.width, e = this._location.height;
            this.shapeList.push(new o({zlevel: this._zlevelBase, hoverable: !1, style: {x: this._location.x, y: this._location.y, width: t, height: e, color: this.zoomOption.backgroundColor}}));
            for (var i = 0, r = this._originalData.xAxis, a = this._zoom.xAxisIndex, h = 0, l = a.length; l > h; h++)i = Math.max(i, r[a[h]].length);
            for (var d = this._originalData.yAxis, c = this._zoom.yAxisIndex, h = 0, l = c.length; l > h; h++)i = Math.max(i, d[c[h]].length);
            for (var p, u = this._zoom.seriesIndex[0], g = this._originalData.series[u], f = Number.MIN_VALUE, m = Number.MAX_VALUE, h = 0, l = g.length; l > h; h++)p = null != g[h] ? null != g[h].value ? g[h].value : g[h] : 0, this.option.series[u].type == n.CHART_TYPE_K && (p = p[1]), isNaN(p) && (p = 0), f = Math.max(f, p), m = Math.min(m, p);
            var _ = f - m, y = [], v = t / (i - (i > 1 ? 1 : 0)), x = e / (i - (i > 1 ? 1 : 0)), b = 1;
            "horizontal" == this.zoomOption.orient && 1 > v ? b = Math.floor(3 * i / t) : "vertical" == this.zoomOption.orient && 1 > x && (b = Math.floor(3 * i / e));
            for (var h = 0, l = i; l > h; h += b)p = null != g[h] ? null != g[h].value ? g[h].value : g[h] : 0, this.option.series[u].type == n.CHART_TYPE_K && (p = p[1]), isNaN(p) && (p = 0), y.push("horizontal" == this.zoomOption.orient ? [this._location.x + v * h, this._location.y + e - 1 - Math.round((p - m) / _ * (e - 10))] : [this._location.x + 1 + Math.round((p - m) / _ * (t - 10)), this._location.y + x * h]);
            "horizontal" == this.zoomOption.orient ? (y.push([this._location.x + t, this._location.y + e]), y.push([this._location.x, this._location.y + e])) : (y.push([this._location.x, this._location.y + e]), y.push([this._location.x, this._location.y])), this.shapeList.push(new s({zlevel: this._zlevelBase, style: {pointList: y, color: this.zoomOption.dataBackgroundColor}, hoverable: !1}))
        }, _buildFiller: function () {
            this._fillerShae = {zlevel: this._zlevelBase, draggable: !0, ondrift: this._ondrift, ondragend: this._ondragend, _type: "filler"}, this._fillerShae.style = "horizontal" == this.zoomOption.orient ? {x: this._location.x + Math.round(this._zoom.start / 100 * this._location.width) + this._handleSize, y: this._location.y, width: this._zoom.size - 2 * this._handleSize, height: this._location.height, color: this.zoomOption.fillerColor, text: ":::", textPosition: "inside"} : {x: this._location.x, y: this._location.y + Math.round(this._zoom.start / 100 * this._location.height) + this._handleSize, width: this._location.width, height: this._zoom.size - 2 * this._handleSize, color: this.zoomOption.fillerColor, text: "::", textPosition: "inside"}, this._fillerShae.highlightStyle = {brushType: "fill", color: "rgba(0,0,0,0)"}, this._fillerShae = new o(this._fillerShae), this.shapeList.push(this._fillerShae)
        }, _buildHandle: function () {
            this._startShape = {zlevel: this._zlevelBase, draggable: !0, style: {iconType: "rectangle", x: this._location.x, y: this._location.y, width: this._handleSize, height: this._handleSize, color: this.zoomOption.handleColor, text: "=", textPosition: "inside"}, highlightStyle: {text: "", brushType: "fill", textPosition: "left"}, ondrift: this._ondrift, ondragend: this._ondragend}, "horizontal" == this.zoomOption.orient ? (this._startShape.style.height = this._location.height, this._endShape = h.clone(this._startShape), this._startShape.style.x = this._fillerShae.style.x - this._handleSize, this._endShape.style.x = this._fillerShae.style.x + this._fillerShae.style.width, this._endShape.highlightStyle.textPosition = "right") : (this._startShape.style.width = this._location.width, this._endShape = h.clone(this._startShape), this._startShape.style.y = this._fillerShae.style.y - this._handleSize, this._startShape.highlightStyle.textPosition = "top", this._endShape.style.y = this._fillerShae.style.y + this._fillerShae.style.height, this._endShape.highlightStyle.textPosition = "bottom"), this._startShape = new r(this._startShape), this._endShape = new r(this._endShape), this.shapeList.push(this._startShape), this.shapeList.push(this._endShape)
        }, _buildFrame: function () {
            var t = this.subPixelOptimize(this._location.x, 1), e = this.subPixelOptimize(this._location.y, 1);
            this._startFrameShape = {zlevel: this._zlevelBase, hoverable: !1, style: {x: t, y: e, width: this._location.width - (t > this._location.x ? 1 : 0), height: this._location.height - (e > this._location.y ? 1 : 0), lineWidth: 1, brushType: "stroke", strokeColor: this.zoomOption.handleColor}}, this._endFrameShape = h.clone(this._startFrameShape), this._startFrameShape = new o(this._startFrameShape), this._endFrameShape = new o(this._endFrameShape), this.shapeList.push(this._startFrameShape), this.shapeList.push(this._endFrameShape)
        }, _syncHandleShape: function () {
            "horizontal" == this.zoomOption.orient ? (this._startShape.style.x = this._fillerShae.style.x - this._handleSize, this._endShape.style.x = this._fillerShae.style.x + this._fillerShae.style.width, this._zoom.start = Math.floor((this._startShape.style.x - this._location.x) / this._location.width * 100), this._zoom.end = Math.ceil((this._endShape.style.x + this._handleSize - this._location.x) / this._location.width * 100)) : (this._startShape.style.y = this._fillerShae.style.y - this._handleSize, this._endShape.style.y = this._fillerShae.style.y + this._fillerShae.style.height, this._zoom.start = Math.floor((this._startShape.style.y - this._location.y) / this._location.height * 100), this._zoom.end = Math.ceil((this._endShape.style.y + this._handleSize - this._location.y) / this._location.height * 100)), this.zr.modShape(this._startShape.id), this.zr.modShape(this._endShape.id), this._syncFrameShape(), this.zr.refresh()
        }, _syncFillerShape: function () {
            var t, e;
            "horizontal" == this.zoomOption.orient ? (t = this._startShape.style.x, e = this._endShape.style.x, this._fillerShae.style.x = Math.min(t, e) + this._handleSize, this._fillerShae.style.width = Math.abs(t - e) - this._handleSize, this._zoom.start = Math.floor((Math.min(t, e) - this._location.x) / this._location.width * 100), this._zoom.end = Math.ceil((Math.max(t, e) + this._handleSize - this._location.x) / this._location.width * 100)) : (t = this._startShape.style.y, e = this._endShape.style.y, this._fillerShae.style.y = Math.min(t, e) + this._handleSize, this._fillerShae.style.height = Math.abs(t - e) - this._handleSize, this._zoom.start = Math.floor((Math.min(t, e) - this._location.y) / this._location.height * 100), this._zoom.end = Math.ceil((Math.max(t, e) + this._handleSize - this._location.y) / this._location.height * 100)), this.zr.modShape(this._fillerShae.id), this._syncFrameShape(), this.zr.refresh()
        }, _syncFrameShape: function () {
            "horizontal" == this.zoomOption.orient ? (this._startFrameShape.style.width = this._fillerShae.style.x - this._location.x, this._endFrameShape.style.x = this._fillerShae.style.x + this._fillerShae.style.width, this._endFrameShape.style.width = this._location.x + this._location.width - this._endFrameShape.style.x) : (this._startFrameShape.style.height = this._fillerShae.style.y - this._location.y, this._endFrameShape.style.y = this._fillerShae.style.y + this._fillerShae.style.height, this._endFrameShape.style.height = this._location.y + this._location.height - this._endFrameShape.style.y), this.zr.modShape(this._startFrameShape.id), this.zr.modShape(this._endFrameShape.id)
        }, _syncShape: function () {
            this.zoomOption.show && ("horizontal" == this.zoomOption.orient ? (this._startShape.style.x = this._location.x + this._zoom.start / 100 * this._location.width, this._endShape.style.x = this._location.x + this._zoom.end / 100 * this._location.width - this._handleSize, this._fillerShae.style.x = this._startShape.style.x + this._handleSize, this._fillerShae.style.width = this._endShape.style.x - this._startShape.style.x - this._handleSize) : (this._startShape.style.y = this._location.y + this._zoom.start / 100 * this._location.height, this._endShape.style.y = this._location.y + this._zoom.end / 100 * this._location.height - this._handleSize, this._fillerShae.style.y = this._startShape.style.y + this._handleSize, this._fillerShae.style.height = this._endShape.style.y - this._startShape.style.y - this._handleSize), this.zr.modShape(this._startShape.id), this.zr.modShape(this._endShape.id), this.zr.modShape(this._fillerShae.id), this._syncFrameShape(), this.zr.refresh())
        }, _syncData: function (t) {
            var e, i, o, s, r;
            for (var a in this._originalData) {
                e = this._originalData[a];
                for (var h in e)r = e[h], null != r && (s = r.length, i = Math.floor(this._zoom.start / 100 * s), o = Math.ceil(this._zoom.end / 100 * s), this.option[a][h].data[0]instanceof Array && this.option[a][h].type != n.CHART_TYPE_K ? (this._setScale(), this.option[a][h].data = this._synScatterData(h, r)) : this.option[a][h].data = r.slice(i, o))
            }
            this._isSilence || !this.zoomOption.realtime && !t || this.messageCenter.dispatch(n.EVENT.DATA_ZOOM, null, {zoom: this._zoom}, this.myChart)
        }, _synScatterData: function (t, e) {
            if (0 === this._zoom.start && 100 == this._zoom.end && 0 === this._zoom.start2 && 100 == this._zoom.end2)return e;
            var i, o, s, r, n, a = [], h = this._zoom.scatterMap[t];
            "horizontal" == this.zoomOption.orient ? (i = h.x.max - h.x.min, o = this._zoom.start / 100 * i + h.x.min, s = this._zoom.end / 100 * i + h.x.min, i = h.y.max - h.y.min, r = this._zoom.start2 / 100 * i + h.y.min, n = this._zoom.end2 / 100 * i + h.y.min) : (i = h.x.max - h.x.min, o = this._zoom.start2 / 100 * i + h.x.min, s = this._zoom.end2 / 100 * i + h.x.min, i = h.y.max - h.y.min, r = this._zoom.start / 100 * i + h.y.min, n = this._zoom.end / 100 * i + h.y.min);
            for (var l, d = 0, c = e.length; c > d; d++)l = e[d].value || e[d], l[0] >= o && l[0] <= s && l[1] >= r && l[1] <= n && a.push(e[d]);
            return a
        }, _setScale: function () {
            var t = 0 !== this._zoom.start || 100 !== this._zoom.end || 0 !== this._zoom.start2 || 100 !== this._zoom.end2, e = {xAxis: this.option.xAxis, yAxis: this.option.yAxis};
            for (var i in e)for (var o = 0, s = e[i].length; s > o; o++)e[i][o].scale = t || e[i][o]._scale
        }, _backupScale: function () {
            var t = {xAxis: this.option.xAxis, yAxis: this.option.yAxis};
            for (var e in t)for (var i = 0, o = t[e].length; o > i; i++)t[e][i]._scale = t[e][i].scale
        }, _getDetail: function () {
            var t = "horizontal" == this.zoomOption.orient ? "xAxis" : "yAxis", e = this._originalData[t];
            for (var i in e) {
                var o = e[i];
                if (null != o) {
                    var s = o.length, r = Math.floor(this._zoom.start / 100 * s), n = Math.ceil(this._zoom.end / 100 * s);
                    return n -= n >= s ? 1 : 0, {start: null != o[r].value ? o[r].value : o[r], end: null != o[n].value ? o[n].value : o[n]}
                }
            }
            var h = this._zoom.seriesIndex[0], l = this.option.series[h][t + "Index"] || 0, d = this.option[t][l].type, c = this._zoom.scatterMap[h][t.charAt(0)].min, p = this._zoom.scatterMap[h][t.charAt(0)].max, u = p - c;
            if ("value" == d)return{start: c + u * this._zoom.start / 100, end: c + u * this._zoom.end / 100};
            if ("time" == d) {
                p = c + u * this._zoom.end / 100, c += u * this._zoom.start / 100;
                var g = a.getAutoFormatter(c, p).formatter;
                return{start: a.format(g, c), end: a.format(g, p)}
            }
            return{start: "", end: ""}
        }, __ondrift: function (t, e, i) {
            this.zoomOption.zoomLock && (t = this._fillerShae);
            var o = "filler" == t._type ? this._handleSize : 0;
            if ("horizontal" == this.zoomOption.orient ? t.style.x + e - o <= this._location.x ? t.style.x = this._location.x + o : t.style.x + e + t.style.width + o >= this._location.x + this._location.width ? t.style.x = this._location.x + this._location.width - t.style.width - o : t.style.x += e : t.style.y + i - o <= this._location.y ? t.style.y = this._location.y + o : t.style.y + i + t.style.height + o >= this._location.y + this._location.height ? t.style.y = this._location.y + this._location.height - t.style.height - o : t.style.y += i, "filler" == t._type ? this._syncHandleShape() : this._syncFillerShape(), this.zoomOption.realtime && this._syncData(), this.zoomOption.showDetail) {
                var s = this._getDetail();
                this._startShape.style.text = this._startShape.highlightStyle.text = s.start, this._endShape.style.text = this._endShape.highlightStyle.text = s.end, this._startShape.style.textPosition = this._startShape.highlightStyle.textPosition, this._endShape.style.textPosition = this._endShape.highlightStyle.textPosition
            }
            return!0
        }, __ondragend: function () {
            this.zoomOption.showDetail && (this._startShape.style.text = this._endShape.style.text = "=", this._startShape.style.textPosition = this._endShape.style.textPosition = "inside", this.zr.modShape(this._startShape.id), this.zr.modShape(this._endShape.id), this.zr.refreshNextFrame()), this.isDragend = !0
        }, ondragend: function (t, e) {
            this.isDragend && t.target && (!this.zoomOption.realtime && this._syncData(), e.dragOut = !0, e.dragIn = !0, this._isSilence || this.zoomOption.realtime || this.messageCenter.dispatch(n.EVENT.DATA_ZOOM, null, {zoom: this._zoom}, this.myChart), e.needRefresh = !1, this.isDragend = !1)
        }, ondataZoom: function (t, e) {
            e.needRefresh = !0
        }, absoluteZoom: function (t) {
            this._zoom.start = t.start, this._zoom.end = t.end, this._zoom.start2 = t.start2, this._zoom.end2 = t.end2, this._syncShape(), this._syncData(!0)
        }, rectZoom: function (t) {
            if (!t)return this._zoom.start = this._zoom.start2 = 0, this._zoom.end = this._zoom.end2 = 100, this._syncShape(), this._syncData(!0), this._zoom;
            var e = this.component.grid.getArea(), i = {x: t.x, y: t.y, width: t.width, height: t.height};
            if (i.width < 0 && (i.x += i.width, i.width = -i.width), i.height < 0 && (i.y += i.height, i.height = -i.height), i.x > e.x + e.width || i.y > e.y + e.height)return!1;
            i.x < e.x && (i.x = e.x), i.x + i.width > e.x + e.width && (i.width = e.x + e.width - i.x), i.y + i.height > e.y + e.height && (i.height = e.y + e.height - i.y);
            var o, s = (i.x - e.x) / e.width, r = 1 - (i.x + i.width - e.x) / e.width, n = 1 - (i.y + i.height - e.y) / e.height, a = (i.y - e.y) / e.height;
            return"horizontal" == this.zoomOption.orient ? (o = this._zoom.end - this._zoom.start, this._zoom.start += o * s, this._zoom.end -= o * r, o = this._zoom.end2 - this._zoom.start2, this._zoom.start2 += o * n, this._zoom.end2 -= o * a) : (o = this._zoom.end - this._zoom.start, this._zoom.start += o * n, this._zoom.end -= o * a, o = this._zoom.end2 - this._zoom.start2, this._zoom.start2 += o * s, this._zoom.end2 -= o * r), this._syncShape(), this._syncData(!0), this._zoom
        }, syncBackupData: function (t) {
            for (var e, i, o = this._originalData.series, s = t.series, r = 0, n = s.length; n > r; r++) {
                i = s[r].data || s[r].eventList, e = o[r] ? Math.floor(this._zoom.start / 100 * o[r].length) : 0;
                for (var a = 0, h = i.length; h > a; a++)o[r] && (o[r][a + e] = i[a])
            }
        }, syncOption: function (t) {
            this.silence(!0), this.option = t, this.option.dataZoom = this.reformOption(this.option.dataZoom), this.zoomOption = this.option.dataZoom, this.myChart.canvasSupported || (this.zoomOption.realtime = !1), this.clear(), this._location = this._getLocation(), this._zoom = this._getZoom(), this._backupData(), this.option.dataZoom && this.option.dataZoom.show && this._buildShape(), this._syncData(), this.silence(!1)
        }, silence: function (t) {
            this._isSilence = t
        }, getRealDataIndex: function (t, e) {
            if (!this._originalData || 0 === this._zoom.start && 100 == this._zoom.end)return e;
            var i = this._originalData.series;
            return i[t] ? Math.floor(this._zoom.start / 100 * i[t].length) + e : -1
        }, resize: function () {
            this.clear(), this._location = this._getLocation(), this._zoom = this._getZoom(), this.option.dataZoom.show && this._buildShape()
        }}, h.inherits(e, i), t("../component").define("dataZoom", e), e
    }), i("echarts/component/categoryAxis", ["require", "./base", "zrender/shape/Text", "zrender/shape/Line", "zrender/shape/Rectangle", "../config", "zrender/tool/util", "zrender/tool/area", "../component"], function (t) {
        function e(t, e, o, s, r, n) {
            if (s.data.length < 1)return void console.error("option.data.length < 1.");
            i.call(this, t, e, o, s, r), this.grid = this.component.grid;
            for (var a in n)this[a] = n[a];
            this.refresh(s)
        }

        var i = t("./base"), o = t("zrender/shape/Text"), s = t("zrender/shape/Line"), r = t("zrender/shape/Rectangle"), n = t("../config"), a = t("zrender/tool/util"), h = t("zrender/tool/area");
        return e.prototype = {type: n.COMPONENT_TYPE_AXIS_CATEGORY, _getReformedLabel: function (t) {
            var e = "undefined" != typeof this.option.data[t].value ? this.option.data[t].value : this.option.data[t], i = this.option.data[t].formatter || this.option.axisLabel.formatter;
            return i && ("function" == typeof i ? e = i.call(this.myChart, e) : "string" == typeof i && (e = i.replace("{value}", e))), e
        }, _getInterval: function () {
            var t = this.option.axisLabel.interval;
            if ("auto" == t) {
                var e = this.option.axisLabel.textStyle.fontSize, i = this.option.data, o = this.option.data.length;
                if (this.isHorizontal())if (o > 3) {
                    var s, r, n = this.getGap(), l = !1, d = Math.floor(.5 / n);
                    for (d = 1 > d ? 1 : d, t = Math.floor(15 / n); !l && o > t;) {
                        t += d, l = !0, s = Math.floor(n * t);
                        for (var c = Math.floor((o - 1) / t) * t; c >= 0; c -= t) {
                            if (0 !== this.option.axisLabel.rotate)r = e; else if (i[c].textStyle)r = h.getTextWidth(this._getReformedLabel(c), this.getFont(a.merge(i[c].textStyle, this.option.axisLabel.textStyle))); else {
                                var p = this._getReformedLabel(c) + "", u = (p.match(/\w/g) || "").length, g = p.length - u;
                                r = u * e * 2 / 3 + g * e
                            }
                            if (r > s) {
                                l = !1;
                                break
                            }
                        }
                    }
                } else t = 1; else if (o > 3) {
                    var n = this.getGap();
                    for (t = Math.floor(11 / n); e > n * t - 6 && o > t;)t++
                } else t = 1
            } else t = t - 0 + 1;
            return t
        }, _buildShape: function () {
            if (this._interval = this._getInterval(), this.option.show) {
                this.option.splitArea.show && this._buildSplitArea(), this.option.splitLine.show && this._buildSplitLine(), this.option.axisLine.show && this._buildAxisLine(), this.option.axisTick.show && this._buildAxisTick(), this.option.axisLabel.show && this._buildAxisLabel();
                for (var t = 0, e = this.shapeList.length; e > t; t++)this.zr.addShape(this.shapeList[t])
            }
        }, _buildAxisTick: function () {
            var t, e = this.option.data.length, i = this.option.axisTick, o = i.length, r = i.lineStyle.color, n = i.lineStyle.width, a = "auto" == i.interval ? this._interval : i.interval - 0 + 1, h = i.onGap, l = h ? this.getGap() / 2 : "undefined" == typeof h && this.option.boundaryGap ? this.getGap() / 2 : 0, d = l > 0 ? -a : 0;
            if (this.isHorizontal())for (var c, p = "bottom" == this.option.position ? i.inside ? this.grid.getYend() - o - 1 : this.grid.getYend() + 1 : i.inside ? this.grid.getY() + 1 : this.grid.getY() - o - 1, u = d; e > u; u += a)c = this.subPixelOptimize(this.getCoordByIndex(u) + (u >= 0 ? l : 0), n), t = {_axisShape: "axisTick", zlevel: this._zlevelBase, hoverable: !1, style: {xStart: c, yStart: p, xEnd: c, yEnd: p + o, strokeColor: r, lineWidth: n}}, this.shapeList.push(new s(t)); else for (var g, f = "left" == this.option.position ? i.inside ? this.grid.getX() + 1 : this.grid.getX() - o - 1 : i.inside ? this.grid.getXend() - o - 1 : this.grid.getXend() + 1, u = d; e > u; u += a)g = this.subPixelOptimize(this.getCoordByIndex(u) - (u >= 0 ? l : 0), n), t = {_axisShape: "axisTick", zlevel: this._zlevelBase, hoverable: !1, style: {xStart: f, yStart: g, xEnd: f + o, yEnd: g, strokeColor: r, lineWidth: n}}, this.shapeList.push(new s(t))
        }, _buildAxisLabel: function () {
            var t, e, i = this.option.data, s = this.option.data.length, r = this.option.axisLabel.rotate, n = this.option.axisLabel.margin, h = this.option.axisLabel.clickable, l = this.option.axisLabel.textStyle;
            if (this.isHorizontal()) {
                var d, c;
                "bottom" == this.option.position ? (d = this.grid.getYend() + n, c = "top") : (d = this.grid.getY() - n, c = "bottom");
                for (var p = 0; s > p; p += this._interval)"" !== this._getReformedLabel(p) && (e = a.merge(i[p].textStyle || {}, l), t = {zlevel: this._zlevelBase, hoverable: !1, style: {x: this.getCoordByIndex(p), y: d, color: e.color, text: this._getReformedLabel(p), textFont: this.getFont(e), textAlign: e.align || "center", textBaseline: e.baseline || c}}, r && (t.style.textAlign = r > 0 ? "bottom" == this.option.position ? "right" : "left" : "bottom" == this.option.position ? "left" : "right", t.rotation = [r * Math.PI / 180, t.style.x, t.style.y]), this.shapeList.push(new o(this._axisLabelClickable(h, t))))
            } else {
                var u, g;
                "left" == this.option.position ? (u = this.grid.getX() - n, g = "right") : (u = this.grid.getXend() + n, g = "left");
                for (var p = 0; s > p; p += this._interval)"" !== this._getReformedLabel(p) && (e = a.merge(i[p].textStyle || {}, l), t = {zlevel: this._zlevelBase, hoverable: !1, style: {x: u, y: this.getCoordByIndex(p), color: e.color, text: this._getReformedLabel(p), textFont: this.getFont(e), textAlign: e.align || g, textBaseline: e.baseline || 0 === p && "" !== this.option.name ? "bottom" : p == s - 1 && "" !== this.option.name ? "top" : "middle"}}, r && (t.rotation = [r * Math.PI / 180, t.style.x, t.style.y]), this.shapeList.push(new o(this._axisLabelClickable(h, t))))
            }
        }, _buildSplitLine: function () {
            var t, e = this.option.data.length, i = this.option.splitLine, o = i.lineStyle.type, r = i.lineStyle.width, n = i.lineStyle.color;
            n = n instanceof Array ? n : [n];
            var a = n.length, h = i.onGap, l = h ? this.getGap() / 2 : "undefined" == typeof h && this.option.boundaryGap ? this.getGap() / 2 : 0;
            if (e -= h || "undefined" == typeof h && this.option.boundaryGap ? 1 : 0, this.isHorizontal())for (var d, c = this.grid.getY(), p = this.grid.getYend(), u = 0; e > u; u += this._interval)d = this.subPixelOptimize(this.getCoordByIndex(u) + l, r), t = {zlevel: this._zlevelBase, hoverable: !1, style: {xStart: d, yStart: c, xEnd: d, yEnd: p, strokeColor: n[u / this._interval % a], lineType: o, lineWidth: r}}, this.shapeList.push(new s(t)); else for (var g, f = this.grid.getX(), m = this.grid.getXend(), u = 0; e > u; u += this._interval)g = this.subPixelOptimize(this.getCoordByIndex(u) - l, r), t = {zlevel: this._zlevelBase, hoverable: !1, style: {xStart: f, yStart: g, xEnd: m, yEnd: g, strokeColor: n[u / this._interval % a], linetype: o, lineWidth: r}}, this.shapeList.push(new s(t))
        }, _buildSplitArea: function () {
            var t, e = this.option.splitArea, i = e.areaStyle.color;
            if (i instanceof Array) {
                var o = i.length, s = this.option.data.length, n = e.onGap, a = n ? this.getGap() / 2 : "undefined" == typeof n && this.option.boundaryGap ? this.getGap() / 2 : 0;
                if (this.isHorizontal())for (var h, l = this.grid.getY(), d = this.grid.getHeight(), c = this.grid.getX(), p = 0; s >= p; p += this._interval)h = s > p ? this.getCoordByIndex(p) + a : this.grid.getXend(), t = {zlevel: this._zlevelBase, hoverable: !1, style: {x: c, y: l, width: h - c, height: d, color: i[p / this._interval % o]}}, this.shapeList.push(new r(t)), c = h; else for (var u, g = this.grid.getX(), f = this.grid.getWidth(), m = this.grid.getYend(), p = 0; s >= p; p += this._interval)u = s > p ? this.getCoordByIndex(p) - a : this.grid.getY(), t = {zlevel: this._zlevelBase, hoverable: !1, style: {x: g, y: u, width: f, height: m - u, color: i[p / this._interval % o]}}, this.shapeList.push(new r(t)), m = u
            } else t = {zlevel: this._zlevelBase, hoverable: !1, style: {x: this.grid.getX(), y: this.grid.getY(), width: this.grid.getWidth(), height: this.grid.getHeight(), color: i}}, this.shapeList.push(new r(t))
        }, refresh: function (t) {
            t && (this.option = this.reformOption(t), this.option.axisLabel.textStyle = a.merge(this.option.axisLabel.textStyle || {}, this.ecTheme.textStyle)), this.clear(), this._buildShape()
        }, getGap: function () {
            var t = this.option.data.length, e = this.isHorizontal() ? this.grid.getWidth() : this.grid.getHeight();
            return this.option.boundaryGap ? e / t : e / (t > 1 ? t - 1 : 1)
        }, getCoord: function (t) {
            for (var e = this.option.data, i = e.length, o = this.getGap(), s = this.option.boundaryGap ? o / 2 : 0, r = 0; i > r; r++) {
                if (e[r] == t || "undefined" != typeof e[r].value && e[r].value == t)return s = this.isHorizontal() ? this.grid.getX() + s : this.grid.getYend() - s;
                s += o
            }
        }, getCoordByIndex: function (t) {
            if (0 > t)return this.isHorizontal() ? this.grid.getX() : this.grid.getYend();
            if (t > this.option.data.length - 1)return this.isHorizontal() ? this.grid.getXend() : this.grid.getY();
            var e = this.getGap(), i = this.option.boundaryGap ? e / 2 : 0;
            return i += t * e, i = this.isHorizontal() ? this.grid.getX() + i : this.grid.getYend() - i
        }, getNameByIndex: function (t) {
            var e = this.option.data[t];
            return"undefined" != typeof e && "undefined" != typeof e.value ? e.value : e
        }, getIndexByName: function (t) {
            for (var e = this.option.data, i = e.length, o = 0; i > o; o++)if (e[o] == t || "undefined" != typeof e[o].value && e[o].value == t)return o;
            return-1
        }, getValueFromCoord: function () {
            return""
        }, isMainAxis: function (t) {
            return t % this._interval === 0
        }}, a.inherits(e, i), t("../component").define("categoryAxis", e), e
    }), i("echarts/component/valueAxis", ["require", "./base", "zrender/shape/Text", "zrender/shape/Line", "zrender/shape/Rectangle", "../config", "../util/date", "zrender/tool/util", "../util/smartSteps", "../util/accMath", "../component"], function (t) {
        function e(t, e, o, s, r, n, a) {
            if (!a || 0 === a.length)return void console.err("option.series.length == 0.");
            i.call(this, t, e, o, s, r), this.series = a, this.grid = this.component.grid;
            for (var h in n)this[h] = n[h];
            this.refresh(s, a)
        }

        var i = t("./base"), o = t("zrender/shape/Text"), s = t("zrender/shape/Line"), r = t("zrender/shape/Rectangle"), n = t("../config"), a = t("../util/date"), h = t("zrender/tool/util");
        return e.prototype = {type: n.COMPONENT_TYPE_AXIS_VALUE, _buildShape: function () {
            if (this._hasData = !1, this._calculateValue(), this._hasData && this.option.show) {
                this.option.splitArea.show && this._buildSplitArea(), this.option.splitLine.show && this._buildSplitLine(), this.option.axisLine.show && this._buildAxisLine(), this.option.axisTick.show && this._buildAxisTick(), this.option.axisLabel.show && this._buildAxisLabel();
                for (var t = 0, e = this.shapeList.length; e > t; t++)this.zr.addShape(this.shapeList[t])
            }
        }, _buildAxisTick: function () {
            var t, e = this._valueList, i = this._valueList.length, o = this.option.axisTick, r = o.length, n = o.lineStyle.color, a = o.lineStyle.width;
            if (this.isHorizontal())for (var h, l = "bottom" === this.option.position ? o.inside ? this.grid.getYend() - r - 1 : this.grid.getYend() + 1 : o.inside ? this.grid.getY() + 1 : this.grid.getY() - r - 1, d = 0; i > d; d++)h = this.subPixelOptimize(this.getCoord(e[d]), a), t = {_axisShape: "axisTick", zlevel: this._zlevelBase, hoverable: !1, style: {xStart: h, yStart: l, xEnd: h, yEnd: l + r, strokeColor: n, lineWidth: a}}, this.shapeList.push(new s(t)); else for (var c, p = "left" === this.option.position ? o.inside ? this.grid.getX() + 1 : this.grid.getX() - r - 1 : o.inside ? this.grid.getXend() - r - 1 : this.grid.getXend() + 1, d = 0; i > d; d++)c = this.subPixelOptimize(this.getCoord(e[d]), a), t = {_axisShape: "axisTick", zlevel: this._zlevelBase, hoverable: !1, style: {xStart: p, yStart: c, xEnd: p + r, yEnd: c, strokeColor: n, lineWidth: a}}, this.shapeList.push(new s(t))
        }, _buildAxisLabel: function () {
            var t, e = this._valueList, i = this._valueList.length, s = this.option.axisLabel.rotate, r = this.option.axisLabel.margin, n = this.option.axisLabel.clickable, a = this.option.axisLabel.textStyle;
            if (this.isHorizontal()) {
                var h, l;
                "bottom" === this.option.position ? (h = this.grid.getYend() + r, l = "top") : (h = this.grid.getY() - r, l = "bottom");
                for (var d = 0; i > d; d++)t = {zlevel: this._zlevelBase, hoverable: !1, style: {x: this.getCoord(e[d]), y: h, color: "function" == typeof a.color ? a.color(e[d]) : a.color, text: this._valueLabel[d], textFont: this.getFont(a), textAlign: a.align || "center", textBaseline: a.baseline || l}}, s && (t.style.textAlign = s > 0 ? "bottom" === this.option.position ? "right" : "left" : "bottom" === this.option.position ? "left" : "right", t.rotation = [s * Math.PI / 180, t.style.x, t.style.y]), this.shapeList.push(new o(this._axisLabelClickable(n, t)))
            } else {
                var c, p;
                "left" === this.option.position ? (c = this.grid.getX() - r, p = "right") : (c = this.grid.getXend() + r, p = "left");
                for (var d = 0; i > d; d++)t = {zlevel: this._zlevelBase, hoverable: !1, style: {x: c, y: this.getCoord(e[d]), color: "function" == typeof a.color ? a.color(e[d]) : a.color, text: this._valueLabel[d], textFont: this.getFont(a), textAlign: a.align || p, textBaseline: a.baseline || 0 === d && "" !== this.option.name ? "bottom" : d === i - 1 && "" !== this.option.name ? "top" : "middle"}}, s && (t.rotation = [s * Math.PI / 180, t.style.x, t.style.y]), this.shapeList.push(new o(this._axisLabelClickable(n, t)))
            }
        }, _buildSplitLine: function () {
            var t, e = this._valueList, i = this._valueList.length, o = this.option.splitLine, r = o.lineStyle.type, n = o.lineStyle.width, a = o.lineStyle.color;
            a = a instanceof Array ? a : [a];
            var h = a.length;
            if (this.isHorizontal())for (var l, d = this.grid.getY(), c = this.grid.getYend(), p = 0; i > p; p++)l = this.subPixelOptimize(this.getCoord(e[p]), n), t = {zlevel: this._zlevelBase, hoverable: !1, style: {xStart: l, yStart: d, xEnd: l, yEnd: c, strokeColor: a[p % h], lineType: r, lineWidth: n}}, this.shapeList.push(new s(t)); else for (var u, g = this.grid.getX(), f = this.grid.getXend(), p = 0; i > p; p++)u = this.subPixelOptimize(this.getCoord(e[p]), n), t = {zlevel: this._zlevelBase, hoverable: !1, style: {xStart: g, yStart: u, xEnd: f, yEnd: u, strokeColor: a[p % h], lineType: r, lineWidth: n}}, this.shapeList.push(new s(t))
        }, _buildSplitArea: function () {
            var t, e = this.option.splitArea.areaStyle.color;
            if (e instanceof Array) {
                var i = e.length, o = this._valueList, s = this._valueList.length;
                if (this.isHorizontal())for (var n, a = this.grid.getY(), h = this.grid.getHeight(), l = this.grid.getX(), d = 0; s >= d; d++)n = s > d ? this.getCoord(o[d]) : this.grid.getXend(), t = {zlevel: this._zlevelBase, hoverable: !1, style: {x: l, y: a, width: n - l, height: h, color: e[d % i]}}, this.shapeList.push(new r(t)), l = n; else for (var c, p = this.grid.getX(), u = this.grid.getWidth(), g = this.grid.getYend(), d = 0; s >= d; d++)c = s > d ? this.getCoord(o[d]) : this.grid.getY(), t = {zlevel: this._zlevelBase, hoverable: !1, style: {x: p, y: c, width: u, height: g - c, color: e[d % i]}}, this.shapeList.push(new r(t)), g = c
            } else t = {zlevel: this._zlevelBase, hoverable: !1, style: {x: this.grid.getX(), y: this.grid.getY(), width: this.grid.getWidth(), height: this.grid.getHeight(), color: e}}, this.shapeList.push(new r(t))
        }, _calculateValue: function () {
            if (isNaN(this.option.min - 0) || isNaN(this.option.max - 0)) {
                for (var t, e, i = {}, o = this.component.legend, s = 0, r = this.series.length; r > s; s++)!(this.series[s].type != n.CHART_TYPE_LINE && this.series[s].type != n.CHART_TYPE_BAR && this.series[s].type != n.CHART_TYPE_SCATTER && this.series[s].type != n.CHART_TYPE_K && this.series[s].type != n.CHART_TYPE_EVENTRIVER || o && !o.isSelected(this.series[s].name) || (t = this.series[s].xAxisIndex || 0, e = this.series[s].yAxisIndex || 0, this.option.xAxisIndex != t && this.option.yAxisIndex != e || !this._calculSum(i, s)));
                var a;
                for (var s in i) {
                    a = i[s];
                    for (var h = 0, l = a.length; l > h; h++)if (!isNaN(a[h])) {
                        this._hasData = !0, this._min = a[h], this._max = a[h];
                        break
                    }
                    if (this._hasData)break
                }
                for (var s in i) {
                    a = i[s];
                    for (var h = 0, l = a.length; l > h; h++)isNaN(a[h]) || (this._min = Math.min(this._min, a[h]), this._max = Math.max(this._max, a[h]))
                }
                var d = Math.abs(this._max - this._min);
                this._min = isNaN(this.option.min - 0) ? this._min - Math.abs(d * this.option.boundaryGap[0]) : this.option.min - 0, this._max = isNaN(this.option.max - 0) ? this._max + Math.abs(d * this.option.boundaryGap[1]) : this.option.max - 0, this._min === this._max && (0 === this._max ? this._max = 1 : this._max > 0 ? this._min = this._max / this.option.splitNumber != null ? this.option.splitNumber : 5 : this._max = this._max / this.option.splitNumber != null ? this.option.splitNumber : 5), "time" != this.option.type ? this._reformValue(this.option.scale) : this._reformTimeValue()
            } else this._hasData = !0, this._min = this.option.min - 0, this._max = this.option.max - 0, "time" != this.option.type ? this._customerValue() : this._reformTimeValue()
        }, _calculSum: function (t, e) {
            var i, o, s = this.series[e].name || "kener";
            if (this.series[e].stack) {
                var r = "__Magic_Key_Positive__" + this.series[e].stack, h = "__Magic_Key_Negative__" + this.series[e].stack;
                t[r] = t[r] || [], t[h] = t[h] || [], t[s] = t[s] || [], o = this.series[e].data;
                for (var l = 0, d = o.length; d > l; l++)i = null != o[l].value ? o[l].value : o[l], "-" !== i && (i -= 0, i >= 0 ? null != t[r][l] ? t[r][l] += i : t[r][l] = i : null != t[h][l] ? t[h][l] += i : t[h][l] = i, this.option.scale && t[s].push(i))
            } else if (t[s] = t[s] || [], this.series[e].type != n.CHART_TYPE_EVENTRIVER) {
                o = this.series[e].data;
                for (var l = 0, d = o.length; d > l; l++)i = null != o[l].value ? o[l].value : o[l], this.series[e].type === n.CHART_TYPE_K ? (t[s].push(i[0]), t[s].push(i[1]), t[s].push(i[2]), t[s].push(i[3])) : i instanceof Array ? (-1 != this.option.xAxisIndex && t[s].push("time" != this.option.type ? i[0] : a.getNewDate(i[0])), -1 != this.option.yAxisIndex && t[s].push("time" != this.option.type ? i[1] : a.getNewDate(i[1]))) : t[s].push(i)
            } else {
                o = this.series[e].eventList;
                for (var l = 0, d = o.length; d > l; l++)for (var c = o[l].evolution, p = 0, u = c.length; u > p; p++)t[s].push(a.getNewDate(c[p].time))
            }
        }, _reformValue: function (e) {
            var i = t("../util/smartSteps"), o = this.option.splitNumber;
            !e && this._min >= 0 && this._max >= 0 && (this._min = 0), !e && this._min <= 0 && this._max <= 0 && (this._max = 0);
            var s = i(this._min, this._max, o);
            o = null != o ? o : s.secs, this.option.splitNumber = o, this._min = s.min, this._max = s.max, this._valueList = s.pnts, this._reformLabelData()
        }, _reformTimeValue: function () {
            var t = null != this.option.splitNumber ? this.option.splitNumber : 5, e = a.getAutoFormatter(this._min, this._max, t), i = e.formatter, o = e.gapValue;
            this._valueList = [a.getNewDate(this._min)];
            var s;
            switch (i) {
                case"week":
                    s = a.nextMonday(this._min);
                    break;
                case"month":
                    s = a.nextNthOnMonth(this._min, 1);
                    break;
                case"quarter":
                    s = a.nextNthOnQuarterYear(this._min, 1);
                    break;
                case"half-year":
                    s = a.nextNthOnHalfYear(this._min, 1);
                    break;
                case"year":
                    s = a.nextNthOnYear(this._min, 1);
                    break;
                default:
                    72e5 >= o ? s = (Math.floor(this._min / o) + 1) * o : (s = a.getNewDate(this._min - -o), s.setHours(6 * Math.round(s.getHours() / 6)), s.setMinutes(0), s.setSeconds(0))
            }
            for (s - this._min < o / 2 && (s -= -o), e = a.getNewDate(s), t *= 1.5; t-- >= 0 && (("month" == i || "quarter" == i || "half-year" == i || "year" == i) && e.setDate(1), !(this._max - e < o / 2));)this._valueList.push(e), e = a.getNewDate(e - -o);
            this._valueList.push(a.getNewDate(this._max)), this._reformLabelData(i)
        }, _customerValue: function () {
            var e = t("../util/accMath"), i = null != this.option.splitNumber ? this.option.splitNumber : 5, o = (this._max - this._min) / i;
            this._valueList = [];
            for (var s = 0; i >= s; s++)this._valueList.push(e.accAdd(this._min, e.accMul(o, s)));
            this._reformLabelData()
        }, _reformLabelData: function (t) {
            this._valueLabel = [];
            var e = this.option.axisLabel.formatter;
            if (e)for (var i = 0, o = this._valueList.length; o > i; i++)"function" == typeof e ? this._valueLabel.push(t ? e.call(this.myChart, this._valueList[i], t) : e.call(this.myChart, this._valueList[i])) : "string" == typeof e && this._valueLabel.push(t ? a.format(e, this._valueList[i]) : e.replace("{value}", this._valueList[i])); else if (t)for (var i = 0, o = this._valueList.length; o > i; i++)this._valueLabel.push(a.format(t, this._valueList[i])); else for (var i = 0, o = this._valueList.length; o > i; i++)this._valueLabel.push(this.numAddCommas(this._valueList[i]))
        }, getExtremum: function () {
            return this._calculateValue(), {min: this._min, max: this._max}
        }, refresh: function (t, e) {
            t && (this.option = this.reformOption(t), this.option.axisLabel.textStyle = h.merge(this.option.axisLabel.textStyle || {}, this.ecTheme.textStyle), this.series = e), this.zr && (this.clear(), this._buildShape())
        }, getCoord: function (t) {
            t = t < this._min ? this._min : t, t = t > this._max ? this._max : t;
            var e;
            return e = this.isHorizontal() ? this.grid.getX() + (t - this._min) / (this._max - this._min) * this.grid.getWidth() : this.grid.getYend() - (t - this._min) / (this._max - this._min) * this.grid.getHeight()
        }, getCoordSize: function (t) {
            return Math.abs(this.isHorizontal() ? t / (this._max - this._min) * this.grid.getWidth() : t / (this._max - this._min) * this.grid.getHeight())
        }, getValueFromCoord: function (t) {
            var e;
            return this.isHorizontal() ? (t = t < this.grid.getX() ? this.grid.getX() : t, t = t > this.grid.getXend() ? this.grid.getXend() : t, e = this._min + (t - this.grid.getX()) / this.grid.getWidth() * (this._max - this._min)) : (t = t < this.grid.getY() ? this.grid.getY() : t, t = t > this.grid.getYend() ? this.grid.getYend() : t, e = this._max - (t - this.grid.getY()) / this.grid.getHeight() * (this._max - this._min)), e.toFixed(2) - 0
        }, isMaindAxis: function (t) {
            for (var e = 0, i = this._valueList.length; i > e; e++)if (this._valueList[e] === t)return!0;
            return!1
        }}, h.inherits(e, i), t("../component").define("valueAxis", e), e
    }), i("echarts/util/date", [], function () {
        function t(t, e, i) {
            i = i > 1 ? i : 2;
            for (var o, s, r, n, a = 0, h = d.length; h > a; a++)if (o = d[a].value, s = Math.ceil(e / o) * o - Math.floor(t / o) * o, Math.round(s / o) <= 1.2 * i) {
                r = d[a].formatter, n = d[a].value;
                break
            }
            return null == r && (r = "year", o = 317088e5, s = Math.ceil(e / o) * o - Math.floor(t / o) * o, n = Math.round(s / (i - 1) / o) * o), {formatter: r, gapValue: n}
        }

        function e(t) {
            return 10 > t ? "0" + t : t
        }

        function i(t, i) {
            ("week" == t || "month" == t || "quarter" == t || "half-year" == t || "year" == t) && (t = "MM - dd\nyyyy");
            var o = l(i), s = o.getFullYear(), r = o.getMonth() + 1, n = o.getDate(), a = o.getHours(), h = o.getMinutes(), d = o.getSeconds();
            return t = t.replace("MM", e(r)), t = t.toLowerCase(), t = t.replace("yyyy", s), t = t.replace("yy", s % 100), t = t.replace("dd", e(n)), t = t.replace("d", n), t = t.replace("hh", e(a)), t = t.replace("h", a), t = t.replace("mm", e(h)), t = t.replace("m", h), t = t.replace("ss", e(d)), t = t.replace("s", d)
        }

        function o(t) {
            return t = l(t), t.setDate(t.getDate() + 8 - t.getDay()), t
        }

        function s(t, e, i) {
            return t = l(t), t.setMonth(Math.ceil((t.getMonth() + 1) / i) * i), t.setDate(e), t
        }

        function r(t, e) {
            return s(t, e, 1)
        }

        function n(t, e) {
            return s(t, e, 3)
        }

        function a(t, e) {
            return s(t, e, 6)
        }

        function h(t, e) {
            return s(t, e, 12)
        }

        function l(t) {
            return t instanceof Date ? t : new Date("string" == typeof t ? t.replace(/-/g, "/") : t)
        }

        var d = [
            {formatter: "hh : mm : ss", value: 1e3},
            {formatter: "hh : mm : ss", value: 5e3},
            {formatter: "hh : mm : ss", value: 1e4},
            {formatter: "hh : mm : ss", value: 15e3},
            {formatter: "hh : mm : ss", value: 3e4},
            {formatter: "hh : mm\nMM - dd", value: 6e4},
            {formatter: "hh : mm\nMM - dd", value: 3e5},
            {formatter: "hh : mm\nMM - dd", value: 6e5},
            {formatter: "hh : mm\nMM - dd", value: 9e5},
            {formatter: "hh : mm\nMM - dd", value: 18e5},
            {formatter: "hh : mm\nMM - dd", value: 36e5},
            {formatter: "hh : mm\nMM - dd", value: 72e5},
            {formatter: "hh : mm\nMM - dd", value: 216e5},
            {formatter: "hh : mm\nMM - dd", value: 432e5},
            {formatter: "MM - dd\nyyyy", value: 864e5},
            {formatter: "week", value: 6048e5},
            {formatter: "month", value: 26784e5},
            {formatter: "quarter", value: 8208e6},
            {formatter: "half-year", value: 16416e6},
            {formatter: "year", value: 32832e6}
        ];
        return{getAutoFormatter: t, getNewDate: l, format: i, nextMonday: o, nextNthPerNmonth: s, nextNthOnMonth: r, nextNthOnQuarterYear: n, nextNthOnHalfYear: a, nextNthOnYear: h}
    }), i("echarts/util/smartSteps", [], function () {
        function t(t) {
            return w.log(M(t)) / w.LN10
        }

        function e(t) {
            return w.pow(10, t)
        }

        function i(t) {
            return t === L(t)
        }

        function o(t, e, o, s) {
            v = s || {}, x = v.steps || C, b = v.secs || z, o = E(+o || 0) % 99, t = +t || 0, e = +e || 0, T = S = 0, "min"in v && (t = +v.min || 0, T = 1), "max"in v && (e = +v.max || 0, S = 1), t > e && (e = [t, t = e][0]);
            var r = e - t;
            if (T && S)return y(t, e, o);
            if ((o || 5) > r) {
                if (i(t) && i(e))return u(t, e, o);
                if (0 === r)return g(t, e, o)
            }
            return l(t, e, o)
        }

        function s(t, i, o, s) {
            s = s || 0;
            var a = r((i - t) / o, -1), h = r(t, -1, 1), l = r(i, -1), d = w.min(a.e, h.e, l.e);
            n(a, {c: 0, e: d}), n(h, a, 1), n(l, a), s += d, t = h.c, i = l.c;
            for (var c = (i - t) / o, p = e(s), u = 0, g = [], f = o + 1; f--;)g[f] = (t + c * f) * p;
            if (0 > s) {
                u = m(p), c = +(c * p).toFixed(u), t = +(t * p).toFixed(u), i = +(i * p).toFixed(u);
                for (var f = g.length; f--;)g[f] = g[f].toFixed(u), 0 === +g[f] && (g[f] = "0")
            } else t *= p, i *= p, c *= p;
            return b = 0, x = 0, v = 0, {min: t, max: i, secs: o, step: c, fix: u, exp: s, pnts: g}
        }

        function r(o, s, r) {
            s = E(s % 10) || 2, 0 > s && (i(o) ? s = ("" + M(o)).replace(/0+$/, "").length || 1 : (o = o.toFixed(15).replace(/0+$/, ""), s = o.replace(".", "").replace(/^[-0]+/, "").length, o = +o));
            var n = L(t(o)) - s + 1, a = +(o * e(-n)).toFixed(15) || 0;
            return a = r ? L(a) : A(a), !a && (n = 0), ("" + M(a)).length > s && (n += 1, a /= 10), {c: a, e: n}
        }

        function n(t, i, o) {
            var s = i.e - t.e;
            s && (t.e += s, t.c *= e(-s), t.c = o ? L(t.c) : A(t.c))
        }

        function a(t, e, i) {
            t.e < e.e ? n(e, t, i) : n(t, e, i)
        }

        function h(t, e) {
            e = e || C, t = r(t);
            for (var i = t.c, o = 0; i > e[o];)o++;
            if (!e[o])for (i /= 10, t.e += 1, o = 0; i > e[o];)o++;
            return t.c = e[o], t
        }

        function l(t, e, o) {
            var a, l = o || +b.slice(-1), g = h((e - t) / l, x), m = r(e - t), y = r(t, -1, 1), v = r(e, -1);
            if (n(m, g), n(y, g, 1), n(v, g), o ? a = c(y, v, l) : l = d(y, v), i(t) && i(e) && t * e >= 0) {
                if (l > e - t)return u(t, e, l);
                l = p(t, e, o, y, v, l)
            }
            var C = f(t, e, y.c, v.c);
            return y.c = C[0], v.c = C[1], (T || S) && _(t, e, y, v), s(y.c, v.c, l, v.e)
        }

        function d(t, i) {
            for (var o, s, r, n, a = [], l = b.length; l--;)o = b[l], s = h((i.c - t.c) / o, x), s = s.c * e(s.e), r = L(t.c / s) * s, n = A(i.c / s) * s, a[l] = {min: r, max: n, step: s, span: n - r};
            return a.sort(function (t, e) {
                return t.span - e.span
            }), a = a[0], o = a.span / a.step, t.c = a.min, i.c = a.max, 3 > o ? 2 * o : o
        }

        function c(t, i, o) {
            for (var s, r, n = i.c, a = (i.c - t.c) / o - 1; n > t.c;)a = h(a + 1, x), a = a.c * e(a.e), s = a * o, r = A(i.c / a) * a, n = r - s;
            var l = t.c - n, d = r - i.c, c = l - d;
            return c >= 2 * a && (c = L(c / a) * a, n += c, r += c), t.c = n, i.c = r, a
        }

        function p(t, o, s, r, n, a) {
            var h = n.c - r.c, l = h / a * e(n.e);
            if (!i(l) && (l = L(l), h = l * a, o - t > h && (l += 1, h = l * a, !s && l * (a - 1) >= o - t && (a -= 1, h = l * a)), h >= o - t)) {
                var d = h - (o - t);
                r.c = E(t - d / 2), n.c = E(o + d / 2), r.e = 0, n.e = 0
            }
            return a
        }

        function u(t, e, i) {
            if (i = i || 5, T)e = t + i; else if (S)t = e - i; else {
                var o = i - (e - t), r = E(t - o / 2), n = E(e + o / 2), a = f(t, e, r, n);
                t = a[0], e = a[1]
            }
            return s(t, e, i)
        }

        function g(t, e, i) {
            i = i || 5;
            var o = w.min(M(e / i), i) / 2.1;
            return T ? e = t + o : S ? t = e - o : (t -= o, e += o), l(t, e, i)
        }

        function f(t, e, i, o) {
            return t >= 0 && 0 > i ? (o -= i, i = 0) : 0 >= e && o > 0 && (i -= o, o = 0), [i, o]
        }

        function m(t) {
            return t = (+t).toFixed(15).split("."), t.pop().replace(/0+$/, "").length
        }

        function _(t, e, i, o) {
            if (T) {
                var s = r(t, 4, 1);
                i.e - s.e > 6 && (s = {c: 0, e: i.e}), a(i, s), a(o, s), o.c += s.c - i.c, i.c = s.c
            } else if (S) {
                var n = r(e, 4);
                o.e - n.e > 6 && (n = {c: 0, e: o.e}), a(i, n), a(o, n), i.c += n.c - o.c, o.c = n.c
            }
        }

        function y(t, e, i) {
            var o = i ? [i] : b, a = e - t;
            if (0 === a)return e = r(e, 3), i = o[0], e.c = E(e.c + i / 2), s(e.c - i, e.c, i, e.e);
            M(e / a) < 1e-6 && (e = 0), M(t / a) < 1e-6 && (t = 0);
            var h, l, d, c = [
                [5, 10],
                [10, 2],
                [50, 10],
                [100, 2]
            ], p = [], u = [], g = r(e - t, 3), f = r(t, -1, 1), m = r(e, -1);
            n(f, g, 1), n(m, g), a = m.c - f.c, g.c = a;
            for (var _ = o.length; _--;) {
                i = o[_], h = A(a / i), l = h * i - a, d = 3 * (l + 3), d += 2 * (i - o[0] + 2), i % 5 === 0 && (d -= 10);
                for (var y = c.length; y--;)h % c[y][0] === 0 && (d /= c[y][1]);
                u[_] = [i, h, l, d].join(), p[_] = {secs: i, step: h, delta: l, score: d}
            }
            return p.sort(function (t, e) {
                return t.score - e.score
            }), p = p[0], f.c = E(f.c - p.delta / 2), m.c = E(m.c + p.delta / 2), s(f.c, m.c, p.secs, g.e)
        }

        var v, x, b, T, S, C = [10, 25, 50], z = [4, 5, 6], w = Math, E = w.round, L = w.floor, A = w.ceil, M = w.abs;
        return o
    }), i("echarts/chart/line", ["require", "../component/base", "./base", "zrender/shape/BrokenLine", "../util/shape/Icon", "../util/shape/HalfSmoothPolygon", "../component/axis", "../component/grid", "../component/dataZoom", "../config", "../util/ecData", "zrender/tool/util", "zrender/tool/color", "../chart"], function (t) {
        function e(t, e, i, r, n) {
            o.call(this, t, e, i, r, n), s.call(this), this.refresh(r)
        }

        function i(t, e, i) {
            var o = e.x, s = e.y, r = e.width, a = e.height, h = a / 2;
            e.symbol.match("empty") && (t.fillStyle = "#fff"), e.brushType = "both";
            var l = e.symbol.replace("empty", "").toLowerCase();
            l.match("star") ? (h = l.replace("star", "") - 0 || 5, s -= 1, l = "star") : ("rectangle" === l || "arrow" === l) && (o += (r - a) / 2, r = a);
            var d = "";
            if (l.match("image") && (d = l.replace(new RegExp("^image:\\/\\/"), ""), l = "image", o += Math.round((r - a) / 2) - 1, r = a += 2), l = n.prototype.iconLibrary[l]) {
                var c = e.x, p = e.y;
                t.moveTo(c, p + h), t.lineTo(c + 5, p + h), t.moveTo(c + e.width - 5, p + h), t.lineTo(c + e.width, p + h);
                var u = this;
                l(t, {x: o + 4, y: s + 4, width: r - 8, height: a - 8, n: h, image: d}, function () {
                    u.modSelf(), i()
                })
            } else t.moveTo(o, s + h), t.lineTo(o + r, s + h)
        }

        var o = t("../component/base"), s = t("./base"), r = t("zrender/shape/BrokenLine"), n = t("../util/shape/Icon"), a = t("../util/shape/HalfSmoothPolygon");
        t("../component/axis"), t("../component/grid"), t("../component/dataZoom");
        var h = t("../config"), l = t("../util/ecData"), d = t("zrender/tool/util"), c = t("zrender/tool/color");
        return e.prototype = {type: h.CHART_TYPE_LINE, _buildShape: function () {
            this.finalPLMap = {}, this._bulidPosition()
        }, _buildHorizontal: function (t, e, i, o) {
            for (var s, r, n, a, h, l, d, c, p, u, g = this.series, f = i[0][0], m = g[f], _ = m.xAxisIndex, y = this.component.xAxis.getAxis(_), v = {}, x = 0, b = e; b > x && null != y.getNameByIndex(x); x++) {
                n = y.getCoordByIndex(x);
                for (var T = 0, S = i.length; S > T; T++) {
                    s = g[i[T][0]].yAxisIndex || 0, r = this.component.yAxis.getAxis(s), l = h = c = d = r.getCoord(0);
                    for (var C = 0, z = i[T].length; z > C; C++)f = i[T][C], m = g[f], p = m.data[x], u = null != p ? null != p.value ? p.value : p : "-", v[f] = v[f] || [], o[f] = o[f] || {min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY, sum: 0, counter: 0, average: 0}, "-" !== u ? (u >= 0 ? (h -= C > 0 ? r.getCoordSize(u) : l - r.getCoord(u), a = h) : 0 > u && (d += C > 0 ? r.getCoordSize(u) : r.getCoord(u) - c, a = d), v[f].push([n, a, x, y.getNameByIndex(x), n, l]), o[f].min > u && (o[f].min = u, o[f].minY = a, o[f].minX = n), o[f].max < u && (o[f].max = u, o[f].maxY = a, o[f].maxX = n), o[f].sum += u, o[f].counter++) : v[f].length > 0 && (this.finalPLMap[f] = this.finalPLMap[f] || [], this.finalPLMap[f].push(v[f]), v[f] = [])
                }
                h = this.component.grid.getY();
                for (var w, T = 0, S = i.length; S > T; T++)for (var C = 0, z = i[T].length; z > C; C++)f = i[T][C], m = g[f], p = m.data[x], u = null != p ? null != p.value ? p.value : p : "-", "-" == u && this.deepQuery([p, m, this.option], "calculable") && (w = this.deepQuery([p, m], "symbolSize"), h += 2 * w + 5, a = h, this.shapeList.push(this._getCalculableItem(f, x, y.getNameByIndex(x), n, a, "horizontal")))
            }
            for (var E in v)v[E].length > 0 && (this.finalPLMap[E] = this.finalPLMap[E] || [], this.finalPLMap[E].push(v[E]), v[E] = []);
            this._calculMarkMapXY(o, i, "y"), this._buildBorkenLine(t, this.finalPLMap, y, "horizontal")
        }, _buildVertical: function (t, e, i, o) {
            for (var s, r, n, a, h, l, d, c, p, u, g = this.series, f = i[0][0], m = g[f], _ = m.yAxisIndex, y = this.component.yAxis.getAxis(_), v = {}, x = 0, b = e; b > x && null != y.getNameByIndex(x); x++) {
                a = y.getCoordByIndex(x);
                for (var T = 0, S = i.length; S > T; T++) {
                    s = g[i[T][0]].xAxisIndex || 0, r = this.component.xAxis.getAxis(s), l = h = c = d = r.getCoord(0);
                    for (var C = 0, z = i[T].length; z > C; C++)f = i[T][C], m = g[f], p = m.data[x], u = null != p ? null != p.value ? p.value : p : "-", v[f] = v[f] || [], o[f] = o[f] || {min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY, sum: 0, counter: 0, average: 0}, "-" !== u ? (u >= 0 ? (h += C > 0 ? r.getCoordSize(u) : r.getCoord(u) - l, n = h) : 0 > u && (d -= C > 0 ? r.getCoordSize(u) : c - r.getCoord(u), n = d), v[f].push([n, a, x, y.getNameByIndex(x), l, a]), o[f].min > u && (o[f].min = u, o[f].minX = n, o[f].minY = a), o[f].max < u && (o[f].max = u, o[f].maxX = n, o[f].maxY = a), o[f].sum += u, o[f].counter++) : v[f].length > 0 && (this.finalPLMap[f] = this.finalPLMap[f] || [], this.finalPLMap[f].push(v[f]), v[f] = [])
                }
                h = this.component.grid.getXend();
                for (var w, T = 0, S = i.length; S > T; T++)for (var C = 0, z = i[T].length; z > C; C++)f = i[T][C], m = g[f], p = m.data[x], u = null != p ? null != p.value ? p.value : p : "-", "-" == u && this.deepQuery([p, m, this.option], "calculable") && (w = this.deepQuery([p, m], "symbolSize"), h -= 2 * w + 5, n = h, this.shapeList.push(this._getCalculableItem(f, x, y.getNameByIndex(x), n, a, "vertical")))
            }
            for (var E in v)v[E].length > 0 && (this.finalPLMap[E] = this.finalPLMap[E] || [], this.finalPLMap[E].push(v[E]), v[E] = []);
            this._calculMarkMapXY(o, i, "x"), this._buildBorkenLine(t, this.finalPLMap, y, "vertical")
        }, _buildOther: function (t, e, i, o) {
            for (var s, r, n = this.series, a = {}, h = 0, l = i.length; l > h; h++)for (var d = 0, c = i[h].length; c > d; d++) {
                var p = i[h][d], u = n[p], g = u.xAxisIndex || 0;
                s = this.component.xAxis.getAxis(g);
                var f = u.yAxisIndex || 0;
                r = this.component.yAxis.getAxis(f);
                var m = r.getCoord(0);
                a[p] = a[p] || [], o[p] = o[p] || {min0: Number.POSITIVE_INFINITY, min1: Number.POSITIVE_INFINITY, max0: Number.NEGATIVE_INFINITY, max1: Number.NEGATIVE_INFINITY, sum0: 0, sum1: 0, counter0: 0, counter1: 0, average0: 0, average1: 0};
                for (var _ = 0, y = u.data.length; y > _; _++) {
                    var v = u.data[_], x = null != v ? null != v.value ? v.value : v : "-";
                    if (x instanceof Array) {
                        var b = s.getCoord(x[0]), T = r.getCoord(x[1]);
                        a[p].push([b, T, _, x[0], b, m]), o[p].min0 > x[0] && (o[p].min0 = x[0], o[p].minY0 = T, o[p].minX0 = b), o[p].max0 < x[0] && (o[p].max0 = x[0], o[p].maxY0 = T, o[p].maxX0 = b), o[p].sum0 += x[0], o[p].counter0++, o[p].min1 > x[1] && (o[p].min1 = x[1], o[p].minY1 = T, o[p].minX1 = b), o[p].max1 < x[1] && (o[p].max1 = x[1], o[p].maxY1 = T, o[p].maxX1 = b), o[p].sum1 += x[1], o[p].counter1++
                    }
                }
            }
            for (var S in a)a[S].length > 0 && (this.finalPLMap[S] = this.finalPLMap[S] || [], this.finalPLMap[S].push(a[S]), a[S] = []);
            this._calculMarkMapXY(o, i, "xy"), this._buildBorkenLine(t, this.finalPLMap, s, "other")
        }, _buildBorkenLine: function (t, e, i, o) {
            for (var s, n = "other" == o ? "horizontal" : o, h = this.series, p = t.length - 1; p >= 0; p--) {
                var u = t[p], g = h[u], f = e[u];
                if (g.type === this.type && null != f)for (var m = this._getBbox(u, n), _ = this._sIndex2ColorMap[u], y = this.query(g, "itemStyle.normal.lineStyle.width"), v = this.query(g, "itemStyle.normal.lineStyle.type"), x = this.query(g, "itemStyle.normal.lineStyle.color"), b = this.getItemStyleColor(this.query(g, "itemStyle.normal.color"), u, -1), T = null != this.query(g, "itemStyle.normal.areaStyle"), S = this.query(g, "itemStyle.normal.areaStyle.color"), C = 0, z = f.length; z > C; C++) {
                    var w = f[C], E = "other" != o && this._isLarge(n, w);
                    if (E)w = this._getLargePointList(n, w); else for (var L = 0, A = w.length; A > L; L++)s = g.data[w[L][2]], (this.deepQuery([s, g, this.option], "calculable") || this.deepQuery([s, g], "showAllSymbol") || "categoryAxis" === i.type && i.isMainAxis(w[L][2]) && "none" != this.deepQuery([s, g], "symbol")) && this.shapeList.push(this._getSymbol(u, w[L][2], w[L][3], w[L][0], w[L][1], n));
                    var M = new r({zlevel: this._zlevelBase, style: {miterLimit: y, pointList: w, strokeColor: x || b || _, lineWidth: y, lineType: v, smooth: this._getSmooth(g.smooth), smoothConstraint: m, shadowColor: this.query(g, "itemStyle.normal.lineStyle.shadowColor"), shadowBlur: this.query(g, "itemStyle.normal.lineStyle.shadowBlur"), shadowOffsetX: this.query(g, "itemStyle.normal.lineStyle.shadowOffsetX"), shadowOffsetY: this.query(g, "itemStyle.normal.lineStyle.shadowOffsetY")}, hoverable: !1, _main: !0, _seriesIndex: u, _orient: n});
                    if (l.pack(M, h[u], u, 0, C, h[u].name), this.shapeList.push(M), T) {
                        var k = new a({zlevel: this._zlevelBase, style: {miterLimit: y, pointList: d.clone(w).concat([
                            [w[w.length - 1][4], w[w.length - 1][5]],
                            [w[0][4], w[0][5]]
                        ]), brushType: "fill", smooth: this._getSmooth(g.smooth), smoothConstraint: m, color: S ? S : c.alpha(_, .5)}, highlightStyle: {brushType: "fill"}, hoverable: !1, _main: !0, _seriesIndex: u, _orient: n});
                        l.pack(k, h[u], u, 0, C, h[u].name), this.shapeList.push(k)
                    }
                }
            }
        }, _getBbox: function (t, e) {
            var i = this.component.grid.getBbox(), o = this.xMarkMap[t];
            return null != o.minX0 ? [
                [Math.min(o.minX0, o.maxX0, o.minX1, o.maxX1), Math.min(o.minY0, o.maxY0, o.minY1, o.maxY1)],
                [Math.max(o.minX0, o.maxX0, o.minX1, o.maxX1), Math.max(o.minY0, o.maxY0, o.minY1, o.maxY1)]
            ] : ("horizontal" === e ? (i[0][1] = Math.min(o.minY, o.maxY), i[1][1] = Math.max(o.minY, o.maxY)) : (i[0][0] = Math.min(o.minX, o.maxX), i[1][0] = Math.max(o.minX, o.maxX)), i)
        }, _isLarge: function (t, e) {
            return e.length < 2 ? !1 : "horizontal" === t ? Math.abs(e[0][0] - e[1][0]) < .5 : Math.abs(e[0][1] - e[1][1]) < .5
        }, _getLargePointList: function (t, e) {
            var i;
            i = "horizontal" === t ? this.component.grid.getWidth() : this.component.grid.getHeight();
            for (var o = e.length, s = [], r = 0; i > r; r++)s[r] = e[Math.floor(o / i * r)];
            return s
        }, _getSmooth: function (t) {
            return t ? .3 : 0
        }, _getCalculableItem: function (t, e, i, o, s, r) {
            var n = this.series, a = n[t].calculableHolderColor || this.ecTheme.calculableHolderColor, h = this._getSymbol(t, e, i, o, s, r);
            return h.style.color = a, h.style.strokeColor = a, h.rotation = [0, 0], h.hoverable = !1, h.draggable = !1, h.style.text = void 0, h
        }, _getSymbol: function (t, e, i, o, s, r) {
            var n = this.series, a = n[t], h = a.data[e], l = this.getSymbolShape(a, t, h, e, i, o, s, this._sIndex2ShapeMap[t], this._sIndex2ColorMap[t], "#fff", "vertical" === r ? "horizontal" : "vertical");
            return l.zlevel = this._zlevelBase + 1, this.deepQuery([h, a, this.option], "calculable") && (this.setCalculable(l), l.draggable = !0), l
        }, getMarkCoord: function (t, e) {
            var i = this.series[t], o = this.xMarkMap[t], s = this.component.xAxis.getAxis(i.xAxisIndex), r = this.component.yAxis.getAxis(i.yAxisIndex);
            if (e.type && ("max" === e.type || "min" === e.type || "average" === e.type)) {
                var n = null != e.valueIndex ? e.valueIndex : null != o.maxX0 ? "1" : "";
                return[o[e.type + "X" + n], o[e.type + "Y" + n], o[e.type + "Line" + n], o[e.type + n]]
            }
            return["string" != typeof e.xAxis && s.getCoordByIndex ? s.getCoordByIndex(e.xAxis || 0) : s.getCoord(e.xAxis || 0), "string" != typeof e.yAxis && r.getCoordByIndex ? r.getCoordByIndex(e.yAxis || 0) : r.getCoord(e.yAxis || 0)]
        }, refresh: function (t) {
            t && (this.option = t, this.series = t.series), this.backupShapeList(), this._buildShape()
        }, ontooltipHover: function (t, e) {
            for (var i, o, s = t.seriesIndex, r = t.dataIndex, n = s.length; n--;)if (i = this.finalPLMap[s[n]])for (var a = 0, h = i.length; h > a; a++) {
                o = i[a];
                for (var l = 0, d = o.length; d > l; l++)r === o[l][2] && e.push(this._getSymbol(s[n], o[l][2], o[l][3], o[l][0], o[l][1], "horizontal"))
            }
        }, addDataAnimation: function (t) {
            for (var e = this.series, i = {}, o = 0, s = t.length; s > o; o++)i[t[o][0]] = t[o];
            for (var r, n, a, h, l, d, c, o = this.shapeList.length - 1; o >= 0; o--)if (l = this.shapeList[o]._seriesIndex, i[l] && !i[l][3]) {
                if (this.shapeList[o]._main && this.shapeList[o].style.pointList.length > 1) {
                    if (d = this.shapeList[o].style.pointList, n = Math.abs(d[0][0] - d[1][0]), h = Math.abs(d[0][1] - d[1][1]), c = "horizontal" === this.shapeList[o]._orient, i[l][2]) {
                        if ("half-smooth-polygon" === this.shapeList[o].type) {
                            var p = d.length;
                            this.shapeList[o].style.pointList[p - 3] = d[p - 2], this.shapeList[o].style.pointList[p - 3][c ? 0 : 1] = d[p - 4][c ? 0 : 1], this.shapeList[o].style.pointList[p - 2] = d[p - 1]
                        }
                        this.shapeList[o].style.pointList.pop(), c ? (r = n, a = 0) : (r = 0, a = -h)
                    } else {
                        if (this.shapeList[o].style.pointList.shift(), "half-smooth-polygon" === this.shapeList[o].type) {
                            var u = this.shapeList[o].style.pointList.pop();
                            c ? u[0] = d[0][0] : u[1] = d[0][1], this.shapeList[o].style.pointList.push(u)
                        }
                        c ? (r = -n, a = 0) : (r = 0, a = h)
                    }
                    this.zr.modShape(this.shapeList[o].id, {style: {pointList: this.shapeList[o].style.pointList}}, !0)
                } else {
                    if (i[l][2] && this.shapeList[o]._dataIndex === e[l].data.length - 1) {
                        this.zr.delShape(this.shapeList[o].id);
                        continue
                    }
                    if (!i[l][2] && 0 === this.shapeList[o]._dataIndex) {
                        this.zr.delShape(this.shapeList[o].id);
                        continue
                    }
                }
                this.shapeList[o].position = [0, 0], this.zr.animate(this.shapeList[o].id, "").when(500, {position: [r, a]}).start()
            }
        }}, n.prototype.iconLibrary.legendLineIcon = i, d.inherits(e, s), d.inherits(e, o), t("../chart").define("line", e), e
    }), i("echarts/util/shape/HalfSmoothPolygon", ["require", "zrender/shape/Base", "zrender/shape/util/smoothBezier", "zrender/tool/util", "zrender/shape/Polygon"], function (t) {
        function e(t) {
            i.call(this, t)
        }

        var i = t("zrender/shape/Base"), o = t("zrender/shape/util/smoothBezier"), s = t("zrender/tool/util");
        return e.prototype = {type: "half-smooth-polygon", buildPath: function (e, i) {
            var s = i.pointList;
            if (!(s.length < 2))if (i.smooth) {
                var r = o(s.slice(0, -2), i.smooth, !1, i.smoothConstraint);
                e.moveTo(s[0][0], s[0][1]);
                for (var n, a, h, l = s.length, d = 0; l - 3 > d; d++)n = r[2 * d], a = r[2 * d + 1], h = s[d + 1], e.bezierCurveTo(n[0], n[1], a[0], a[1], h[0], h[1]);
                e.lineTo(s[l - 2][0], s[l - 2][1]), e.lineTo(s[l - 1][0], s[l - 1][1]), e.lineTo(s[0][0], s[0][1])
            } else t("zrender/shape/Polygon").prototype.buildPath(e, i)
        }}, s.inherits(e, i), e
    }), i("echarts/chart/bar", ["require", "../component/base", "./base", "zrender/shape/Rectangle", "../component/axis", "../component/grid", "../component/dataZoom", "../config", "../util/ecData", "zrender/tool/util", "zrender/tool/color", "../chart"], function (t) {
        function e(t, e, s, r, n) {
            i.call(this, t, e, s, r, n), o.call(this), this.refresh(r)
        }

        var i = t("../component/base"), o = t("./base"), s = t("zrender/shape/Rectangle");
        t("../component/axis"), t("../component/grid"), t("../component/dataZoom");
        var r = t("../config"), n = t("../util/ecData"), a = t("zrender/tool/util"), h = t("zrender/tool/color");
        return e.prototype = {type: r.CHART_TYPE_BAR, _buildShape: function () {
            this._bulidPosition()
        }, _buildNormal: function (t, e, i, o, r) {
            for (var n, a, h, l, d, c, p, u, g, f, m, _, y = this.series, v = i[0][0], x = y[v], b = x.xAxisIndex, T = x.yAxisIndex, S = "horizontal" == r ? this.component.xAxis.getAxis(b) : this.component.yAxis.getAxis(T), C = this._mapSize(S, i), z = C.gap, w = C.barGap, E = C.barWidthMap, L = C.barMaxWidthMap, A = C.barWidth, M = C.barMinHeightMap, k = C.interval, I = 0, P = e; P > I && null != S.getNameByIndex(I); I++) {
                "horizontal" == r ? l = S.getCoordByIndex(I) - z / 2 : d = S.getCoordByIndex(I) + z / 2;
                for (var O = 0, R = i.length; R > O; O++) {
                    T = y[i[O][0]].yAxisIndex || 0, b = y[i[O][0]].xAxisIndex || 0, n = "horizontal" == r ? this.component.yAxis.getAxis(T) : this.component.xAxis.getAxis(b), p = c = g = u = n.getCoord(0);
                    for (var D = 0, H = i[O].length; H > D; D++)if (v = i[O][D], x = y[v], m = x.data[I], _ = null != m ? null != m.value ? m.value : m : "-", o[v] = o[v] || {min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY, sum: 0, counter: 0, average: 0}, "-" !== _) {
                        _ > 0 ? (a = D > 0 ? n.getCoordSize(_) : "horizontal" == r ? p - n.getCoord(_) : n.getCoord(_) - p, 1 === H && M[v] > a && (a = M[v]), "horizontal" == r ? (c -= a, d = c) : (l = c, c += a)) : 0 > _ ? (a = D > 0 ? n.getCoordSize(_) : "horizontal" == r ? n.getCoord(_) - g : g - n.getCoord(_), 1 === H && M[v] > a && (a = M[v]), "horizontal" == r ? (d = u, u += a) : (u -= a, l = u)) : (a = 0, "horizontal" == r ? (c -= a, d = c) : (l = c, c += a));
                        var h = Math.min(L[v] || Number.MAX_VALUE, E[v] || A);
                        o[v][I] = "horizontal" == r ? l + h / 2 : d - h / 2, o[v].min > _ && (o[v].min = _, "horizontal" == r ? (o[v].minY = d, o[v].minX = o[v][I]) : (o[v].minX = l + a, o[v].minY = o[v][I])), o[v].max < _ && (o[v].max = _, "horizontal" == r ? (o[v].maxY = d, o[v].maxX = o[v][I]) : (o[v].maxX = l + a, o[v].maxY = o[v][I])), o[v].sum += _, o[v].counter++, I % k === 0 && (f = this._getBarItem(v, I, S.getNameByIndex(I), l, d - ("horizontal" == r ? 0 : h), "horizontal" == r ? h : a, "horizontal" == r ? a : h, "horizontal" == r ? "vertical" : "horizontal"), this.shapeList.push(new s(f)))
                    }
                    for (var D = 0, H = i[O].length; H > D; D++)v = i[O][D], x = y[v], m = x.data[I], _ = null != m ? null != m.value ? m.value : m : "-", "-" == _ && this.deepQuery([m, x, this.option], "calculable") && ("horizontal" == r ? (c -= this.ecTheme.island.r, d = c) : (l = c, c += this.ecTheme.island.r), h = Math.min(L[v] || Number.MAX_VALUE, E[v] || A), f = this._getBarItem(v, I, S.getNameByIndex(I), l + .5, d + .5 - ("horizontal" == r ? 0 : h), ("horizontal" == r ? h : this.ecTheme.island.r) - 1, ("horizontal" == r ? this.ecTheme.island.r : h) - 1, "horizontal" == r ? "vertical" : "horizontal"), f.hoverable = !1, f.draggable = !1, f.style.lineWidth = 1, f.style.brushType = "stroke", f.style.strokeColor = x.calculableHolderColor || this.ecTheme.calculableHolderColor, this.shapeList.push(new s(f)));
                    "horizontal" == r ? l += h + w : d -= h + w
                }
            }
            this._calculMarkMapXY(o, i, "horizontal" == r ? "y" : "x")
        }, _buildHorizontal: function (t, e, i, o) {
            return this._buildNormal(t, e, i, o, "horizontal")
        }, _buildVertical: function (t, e, i, o) {
            return this._buildNormal(t, e, i, o, "vertical")
        }, _buildOther: function (t, e, i, o) {
            for (var r = this.series, n = 0, a = i.length; a > n; n++)for (var h = 0, l = i[n].length; l > h; h++) {
                var d = i[n][h], c = r[d], p = c.xAxisIndex || 0, u = this.component.xAxis.getAxis(p), g = u.getCoord(0), f = c.yAxisIndex || 0, m = this.component.yAxis.getAxis(f), _ = m.getCoord(0);
                o[d] = o[d] || {min0: Number.POSITIVE_INFINITY, min1: Number.POSITIVE_INFINITY, max0: Number.NEGATIVE_INFINITY, max1: Number.NEGATIVE_INFINITY, sum0: 0, sum1: 0, counter0: 0, counter1: 0, average0: 0, average1: 0};
                for (var y = 0, v = c.data.length; v > y; y++) {
                    var x = c.data[y], b = null != x ? null != x.value ? x.value : x : "-";
                    if (b instanceof Array) {
                        var T, S, C = u.getCoord(b[0]), z = m.getCoord(b[1]), w = [x, c], E = this.deepQuery(w, "barWidth") || 10, L = this.deepQuery(w, "barHeight");
                        null != L ? (T = "horizontal", b[0] > 0 ? (E = C - g, C -= E) : E = b[0] < 0 ? g - C : 0, S = this._getBarItem(d, y, b[0], C, z - L / 2, E, L, T)) : (T = "vertical", b[1] > 0 ? L = _ - z : b[1] < 0 ? (L = z - _, z -= L) : L = 0, S = this._getBarItem(d, y, b[0], C - E / 2, z, E, L, T)), this.shapeList.push(new s(S)), C = u.getCoord(b[0]), z = m.getCoord(b[1]), o[d].min0 > b[0] && (o[d].min0 = b[0], o[d].minY0 = z, o[d].minX0 = C), o[d].max0 < b[0] && (o[d].max0 = b[0], o[d].maxY0 = z, o[d].maxX0 = C), o[d].sum0 += b[0], o[d].counter0++, o[d].min1 > b[1] && (o[d].min1 = b[1], o[d].minY1 = z, o[d].minX1 = C), o[d].max1 < b[1] && (o[d].max1 = b[1], o[d].maxY1 = z, o[d].maxX1 = C), o[d].sum1 += b[1], o[d].counter1++
                    }
                }
            }
            this._calculMarkMapXY(o, i, "xy")
        }, _mapSize: function (t, e, i) {
            var o, s, r = this._findSpecialBarSzie(e, i), n = r.barWidthMap, a = r.barMaxWidthMap, h = r.barMinHeightMap, l = r.sBarWidthCounter, d = r.sBarWidthTotal, c = r.barGap, p = r.barCategoryGap, u = 1;
            if (e.length != l) {
                if (i)o = t.getGap(), c = 0, s = Math.floor(o / e.length), 0 >= s && (u = Math.floor(e.length / o), s = 1); else if (o = "string" == typeof p && p.match(/%$/) ? Math.floor(t.getGap() * (100 - parseFloat(p)) / 100) : t.getGap() - p, "string" == typeof c && c.match(/%$/) ? (c = parseFloat(c) / 100, s = Math.floor((o - d) / ((e.length - 1) * c + e.length - l)), c = Math.floor(s * c)) : (c = parseFloat(c), s = Math.floor((o - d - c * (e.length - 1)) / (e.length - l))), 0 >= s)return this._mapSize(t, e, !0)
            } else if (o = l > 1 ? "string" == typeof p && p.match(/%$/) ? Math.floor(t.getGap() * (100 - parseFloat(p)) / 100) : t.getGap() - p : d, s = 0, c = l > 1 ? Math.floor((o - d) / (l - 1)) : 0, 0 > c)return this._mapSize(t, e, !0);
            return this._recheckBarMaxWidth(e, n, a, h, o, s, c, u)
        }, _findSpecialBarSzie: function (t, e) {
            for (var i, o, s, r, n = this.series, a = {}, h = {}, l = {}, d = 0, c = 0, p = 0, u = t.length; u > p; p++)for (var g = {barWidth: !1, barMaxWidth: !1}, f = 0, m = t[p].length; m > f; f++) {
                var _ = t[p][f], y = n[_];
                if (!e) {
                    if (g.barWidth)a[_] = i; else if (i = this.query(y, "barWidth"), null != i) {
                        a[_] = i, c += i, d++, g.barWidth = !0;
                        for (var v = 0, x = f; x > v; v++) {
                            var b = t[p][v];
                            a[b] = i
                        }
                    }
                    if (g.barMaxWidth)h[_] = o; else if (o = this.query(y, "barMaxWidth"), null != o) {
                        h[_] = o, g.barMaxWidth = !0;
                        for (var v = 0, x = f; x > v; v++) {
                            var b = t[p][v];
                            h[b] = o
                        }
                    }
                }
                l[_] = this.query(y, "barMinHeight"), s = null != s ? s : this.query(y, "barGap"), r = null != r ? r : this.query(y, "barCategoryGap")
            }
            return{barWidthMap: a, barMaxWidthMap: h, barMinHeightMap: l, sBarWidth: i, sBarMaxWidth: o, sBarWidthCounter: d, sBarWidthTotal: c, barGap: s, barCategoryGap: r}
        }, _recheckBarMaxWidth: function (t, e, i, o, s, r, n, a) {
            for (var h = 0, l = t.length; l > h; h++) {
                var d = t[h][0];
                i[d] && i[d] < r && (s -= r - i[d])
            }
            return{barWidthMap: e, barMaxWidthMap: i, barMinHeightMap: o, gap: s, barWidth: r, barGap: n, interval: a}
        }, _getBarItem: function (t, e, i, o, s, r, a, l) {
            var d, c = this.series, p = c[t], u = p.data[e], g = this._sIndex2ColorMap[t], f = [u, p], m = this.deepQuery(f, "itemStyle.normal.color") || g, _ = this.deepQuery(f, "itemStyle.emphasis.color"), y = this.deepMerge(f, "itemStyle.normal"), v = y.barBorderWidth, x = this.deepMerge(f, "itemStyle.emphasis");
            if (d = {zlevel: this._zlevelBase, clickable: this.deepQuery(f, "clickable"), style: {x: o, y: s, width: r, height: a, brushType: "both", color: this.getItemStyleColor(m, t, e, u), radius: y.barBorderRadius, lineWidth: v, strokeColor: y.barBorderColor}, highlightStyle: {color: this.getItemStyleColor(_, t, e, u), radius: x.barBorderRadius, lineWidth: x.barBorderWidth, strokeColor: x.barBorderColor}, _orient: l}, d.highlightStyle.color = d.highlightStyle.color || ("string" == typeof d.style.color ? h.lift(d.style.color, -.3) : d.style.color), v > 0 && d.style.height > v && d.style.width > v ? (d.style.y += v / 2, d.style.height -= v, d.style.x += v / 2, d.style.width -= v) : d.style.brushType = "fill", d.highlightStyle.textColor = d.highlightStyle.color, d = this.addLabel(d, p, u, i, l), "insideLeft" === d.style.textPosition || "insideRight" === d.style.textPosition || "insideTop" === d.style.textPosition || "insideBottom" === d.style.textPosition) {
                var b = 5;
                switch (d.style.textPosition) {
                    case"insideLeft":
                        d.style.textX = d.style.x + b, d.style.textY = d.style.y + d.style.height / 2, d.style.textAlign = "left", d.style.textBaseline = "middle";
                        break;
                    case"insideRight":
                        d.style.textX = d.style.x + d.style.width - b, d.style.textY = d.style.y + d.style.height / 2, d.style.textAlign = "right", d.style.textBaseline = "middle";
                        break;
                    case"insideTop":
                        d.style.textX = d.style.x + d.style.width / 2, d.style.textY = d.style.y + b / 2, d.style.textAlign = "center", d.style.textBaseline = "top";
                        break;
                    case"insideBottom":
                        d.style.textX = d.style.x + d.style.width / 2, d.style.textY = d.style.y + d.style.height - b / 2, d.style.textAlign = "center", d.style.textBaseline = "bottom"
                }
                d.style.textPosition = "specific", d.style.textColor = d.style.textColor || "#fff"
            }
            return this.deepQuery([u, p, this.option], "calculable") && (this.setCalculable(d), d.draggable = !0), n.pack(d, c[t], t, c[t].data[e], e, i), d
        }, getMarkCoord: function (t, e) {
            var i, o, s = this.series[t], r = this.xMarkMap[t], n = this.component.xAxis.getAxis(s.xAxisIndex), a = this.component.yAxis.getAxis(s.yAxisIndex);
            if (!e.type || "max" !== e.type && "min" !== e.type && "average" !== e.type)if (r.isHorizontal) {
                i = "string" == typeof e.xAxis && n.getIndexByName ? n.getIndexByName(e.xAxis) : e.xAxis || 0;
                var h = r[i];
                h = null != h ? h : "string" != typeof e.xAxis && n.getCoordByIndex ? n.getCoordByIndex(e.xAxis || 0) : n.getCoord(e.xAxis || 0), o = [h, a.getCoord(e.yAxis || 0)]
            } else {
                i = "string" == typeof e.yAxis && a.getIndexByName ? a.getIndexByName(e.yAxis) : e.yAxis || 0;
                var l = r[i];
                l = null != l ? l : "string" != typeof e.yAxis && a.getCoordByIndex ? a.getCoordByIndex(e.yAxis || 0) : a.getCoord(e.yAxis || 0), o = [n.getCoord(e.xAxis || 0), l]
            } else {
                var d = null != e.valueIndex ? e.valueIndex : null != r.maxX0 ? "1" : "";
                o = [r[e.type + "X" + d], r[e.type + "Y" + d], r[e.type + "Line" + d], r[e.type + d]]
            }
            return o
        }, refresh: function (t) {
            t && (this.option = t, this.series = t.series), this.backupShapeList(), this._buildShape()
        }, addDataAnimation: function (t) {
            for (var e = this.series, i = {}, o = 0, s = t.length; s > o; o++)i[t[o][0]] = t[o];
            for (var r, a, h, l, d, c, p, o = this.shapeList.length - 1; o >= 0; o--)if (c = n.get(this.shapeList[o], "seriesIndex"), i[c] && !i[c][3] && "rectangle" === this.shapeList[o].type) {
                if (p = n.get(this.shapeList[o], "dataIndex"), d = e[c], i[c][2] && p === d.data.length - 1) {
                    this.zr.delShape(this.shapeList[o].id);
                    continue
                }
                if (!i[c][2] && 0 === p) {
                    this.zr.delShape(this.shapeList[o].id);
                    continue
                }
                "horizontal" === this.shapeList[o]._orient ? (l = this.component.yAxis.getAxis(d.yAxisIndex || 0).getGap(), h = i[c][2] ? -l : l, r = 0) : (a = this.component.xAxis.getAxis(d.xAxisIndex || 0).getGap(), r = i[c][2] ? a : -a, h = 0), this.shapeList[o].position = [0, 0], this.zr.animate(this.shapeList[o].id, "").when(500, {position: [r, h]}).start()
            }
        }}, a.inherits(e, o), a.inherits(e, i), t("../chart").define("bar", e), e
    }), i("echarts/chart/pie", ["require", "../component/base", "./base", "zrender/shape/Text", "zrender/shape/Ring", "zrender/shape/Circle", "zrender/shape/Sector", "zrender/shape/BrokenLine", "../config", "../util/ecData", "zrender/tool/util", "zrender/tool/math", "zrender/tool/color", "../chart"], function (t) {
        function e(t, e, s, r, n) {
            i.call(this, t, e, s, r, n), o.call(this);
            var a = this;
            a.shapeHandler.onmouseover = function (t) {
                var e = t.target, i = d.get(e, "seriesIndex"), o = d.get(e, "dataIndex"), s = d.get(e, "special"), r = [e.style.x, e.style.y], n = e.style.startAngle, h = e.style.endAngle, l = ((h + n) / 2 + 360) % 360, c = e.highlightStyle.color, p = a.getLabel(i, o, s, r, l, c, !0);
                p && a.zr.addHoverShape(p);
                var u = a.getLabelLine(i, o, r, e.style.r0, e.style.r, l, c, !0);
                u && a.zr.addHoverShape(u)
            }, this.refresh(r)
        }

        var i = t("../component/base"), o = t("./base"), s = t("zrender/shape/Text"), r = t("zrender/shape/Ring"), n = t("zrender/shape/Circle"), a = t("zrender/shape/Sector"), h = t("zrender/shape/BrokenLine"), l = t("../config"), d = t("../util/ecData"), c = t("zrender/tool/util"), p = t("zrender/tool/math"), u = t("zrender/tool/color");
        return e.prototype = {type: l.CHART_TYPE_PIE, _buildShape: function () {
            var t = this.series, e = this.component.legend;
            this.selectedMap = {}, this._selected = {};
            var i, o, s;
            this._selectedMode = !1;
            for (var a, h = 0, c = t.length; c > h; h++)if (t[h].type === l.CHART_TYPE_PIE) {
                if (t[h] = this.reformOption(t[h]), this.legendHoverLink = t[h].legendHoverLink || this.legendHoverLink, a = t[h].name || "", this.selectedMap[a] = e ? e.isSelected(a) : !0, !this.selectedMap[a])continue;
                i = this.parseCenter(this.zr, t[h].center), o = this.parseRadius(this.zr, t[h].radius), this._selectedMode = this._selectedMode || t[h].selectedMode, this._selected[h] = [], this.deepQuery([t[h], this.option], "calculable") && (s = {zlevel: this._zlevelBase, hoverable: !1, style: {x: i[0], y: i[1], r0: o[0] <= 10 ? 0 : o[0] - 10, r: o[1] + 10, brushType: "stroke", lineWidth: 1, strokeColor: t[h].calculableHolderColor || this.ecTheme.calculableHolderColor}}, d.pack(s, t[h], h, void 0, -1), this.setCalculable(s), s = o[0] <= 10 ? new n(s) : new r(s), this.shapeList.push(s)), this._buildSinglePie(h), this.buildMark(h)
            }
            this.addShapeList()
        }, _buildSinglePie: function (t) {
            for (var e, i = this.series, o = i[t], s = o.data, r = this.component.legend, n = 0, a = 0, h = 0, l = Number.NEGATIVE_INFINITY, d = [], c = 0, p = s.length; p > c; c++)e = s[c].name, this.selectedMap[e] = r ? r.isSelected(e) : !0, this.selectedMap[e] && !isNaN(s[c].value) && (0 !== +s[c].value ? n++ : a++, h += +s[c].value, l = Math.max(l, +s[c].value));
            if (0 !== h) {
                for (var u, g, f, m, _, y, v = 100, x = o.clockWise, b = (o.startAngle.toFixed(2) - 0 + 360) % 360, T = o.minAngle || .01, S = 360 - T * n - .01 * a, C = o.roseType, c = 0, p = s.length; p > c; c++)if (e = s[c].name, this.selectedMap[e] && !isNaN(s[c].value)) {
                    if (g = r ? r.getColor(e) : this.zr.getColor(c), v = s[c].value / h, u = "area" != C ? x ? b - v * S - (0 !== v ? T : .01) : v * S + b + (0 !== v ? T : .01) : x ? b - 360 / p : 360 / p + b, u = u.toFixed(2) - 0, v = (100 * v).toFixed(2), f = this.parseCenter(this.zr, o.center), m = this.parseRadius(this.zr, o.radius), _ = +m[0], y = +m[1], "radius" === C ? y = s[c].value / l * (y - _) * .8 + .2 * (y - _) + _ : "area" === C && (y = Math.sqrt(s[c].value / l) * (y - _) + _), x) {
                        var z;
                        z = b, b = u, u = z
                    }
                    this._buildItem(d, t, c, v, s[c].selected, f, _, y, b, u, g), x || (b = u)
                }
                this._autoLabelLayout(d, f, y);
                for (var c = 0, p = d.length; p > c; c++)this.shapeList.push(d[c]);
                d = null
            }
        }, _buildItem: function (t, e, i, o, s, r, n, a, h, l, c) {
            var p = this.series, u = ((l + h) / 2 + 360) % 360, g = this.getSector(e, i, o, s, r, n, a, h, l, c);
            d.pack(g, p[e], e, p[e].data[i], i, p[e].data[i].name, o), t.push(g);
            var f = this.getLabel(e, i, o, r, u, c, !1), m = this.getLabelLine(e, i, r, n, a, u, c, !1);
            m && (d.pack(m, p[e], e, p[e].data[i], i, p[e].data[i].name, o), t.push(m)), f && (d.pack(f, p[e], e, p[e].data[i], i, p[e].data[i].name, o), f._labelLine = m, t.push(f))
        }, getSector: function (t, e, i, o, s, r, n, h, l, d) {
            var c = this.series, g = c[t], f = g.data[e], m = [f, g], _ = this.deepMerge(m, "itemStyle.normal") || {}, y = this.deepMerge(m, "itemStyle.emphasis") || {}, v = this.getItemStyleColor(_.color, t, e, f) || d, x = this.getItemStyleColor(y.color, t, e, f) || ("string" == typeof v ? u.lift(v, -.2) : v), b = {zlevel: this._zlevelBase, clickable: this.deepQuery(m, "clickable"), style: {x: s[0], y: s[1], r0: r, r: n, startAngle: h, endAngle: l, brushType: "both", color: v, lineWidth: _.borderWidth, strokeColor: _.borderColor, lineJoin: "round"}, highlightStyle: {color: x, lineWidth: y.borderWidth, strokeColor: y.borderColor, lineJoin: "round"}, _seriesIndex: t, _dataIndex: e};
            if (o) {
                var T = ((b.style.startAngle + b.style.endAngle) / 2).toFixed(2) - 0;
                b.style._hasSelected = !0, b.style._x = b.style.x, b.style._y = b.style.y;
                var S = this.query(g, "selectedOffset");
                b.style.x += p.cos(T, !0) * S, b.style.y -= p.sin(T, !0) * S, this._selected[t][e] = !0
            } else this._selected[t][e] = !1;
            return this._selectedMode && (b.onclick = this.shapeHandler.onclick), this.deepQuery([f, g, this.option], "calculable") && (this.setCalculable(b), b.draggable = !0), (this._needLabel(g, f, !0) || this._needLabelLine(g, f, !0)) && (b.onmouseover = this.shapeHandler.onmouseover), b = new a(b)
        }, getLabel: function (t, e, i, o, r, n, a) {
            var h = this.series, l = h[t], d = l.data[e];
            if (this._needLabel(l, d, a)) {
                var u, g, f, m = a ? "emphasis" : "normal", _ = c.merge(c.clone(d.itemStyle) || {}, l.itemStyle), y = _[m].label, v = y.textStyle || {}, x = o[0], b = o[1], T = this.parseRadius(this.zr, l.radius), S = "middle";
                y.position = y.position || _.normal.label.position, "center" === y.position ? (u = x, g = b, f = "center") : "inner" === y.position || "inside" === y.position ? (T = (T[0] + T[1]) / 2, u = Math.round(x + T * p.cos(r, !0)), g = Math.round(b - T * p.sin(r, !0)), n = "#fff", f = "center") : (T = T[1] - -_[m].labelLine.length, u = Math.round(x + T * p.cos(r, !0)), g = Math.round(b - T * p.sin(r, !0)), f = r >= 90 && 270 >= r ? "right" : "left"), "center" != y.position && "inner" != y.position && "inside" != y.position && (u += "left" === f ? 20 : -20), d.__labelX = u - ("left" === f ? 5 : -5), d.__labelY = g;
                var C = new s({zlevel: this._zlevelBase + 1, hoverable: !1, style: {x: u, y: g, color: v.color || n, text: this.getLabelText(t, e, i, m), textAlign: v.align || f, textBaseline: v.baseline || S, textFont: this.getFont(v)}, highlightStyle: {brushType: "fill"}});
                return C._radius = T, C._labelPosition = y.position || "outer", C._rect = C.getRect(C.style), C._seriesIndex = t, C._dataIndex = e, C
            }
        }, getLabelText: function (t, e, i, o) {
            var s = this.series, r = s[t], n = r.data[e], a = this.deepQuery([n, r], "itemStyle." + o + ".label.formatter");
            return a ? "function" == typeof a ? a.call(this.myChart, r.name, n.name, n.value, i) : "string" == typeof a ? (a = a.replace("{a}", "{a0}").replace("{b}", "{b0}").replace("{c}", "{c0}").replace("{d}", "{d0}"), a = a.replace("{a0}", r.name).replace("{b0}", n.name).replace("{c0}", n.value).replace("{d0}", i)) : void 0 : n.name
        }, getLabelLine: function (t, e, i, o, s, r, n, a) {
            var l = this.series, d = l[t], u = d.data[e];
            if (this._needLabelLine(d, u, a)) {
                var g = a ? "emphasis" : "normal", f = c.merge(c.clone(u.itemStyle) || {}, d.itemStyle), m = f[g].labelLine, _ = m.lineStyle || {}, y = i[0], v = i[1], x = s, b = this.parseRadius(this.zr, d.radius)[1] - -m.length, T = p.cos(r, !0), S = p.sin(r, !0);
                return new h({zlevel: this._zlevelBase + 1, hoverable: !1, style: {pointList: [
                    [y + x * T, v - x * S],
                    [y + b * T, v - b * S],
                    [u.__labelX, u.__labelY]
                ], strokeColor: _.color || n, lineType: _.type, lineWidth: _.width}, _seriesIndex: t, _dataIndex: e})
            }
        }, _needLabel: function (t, e, i) {
            return this.deepQuery([e, t], "itemStyle." + (i ? "emphasis" : "normal") + ".label.show")
        }, _needLabelLine: function (t, e, i) {
            return this.deepQuery([e, t], "itemStyle." + (i ? "emphasis" : "normal") + ".labelLine.show")
        }, _autoLabelLayout: function (t, e, i) {
            for (var o = [], s = [], r = 0, n = t.length; n > r; r++)("outer" === t[r]._labelPosition || "outside" === t[r]._labelPosition) && (t[r]._rect._y = t[r]._rect.y, t[r]._rect.x < e[0] ? o.push(t[r]) : s.push(t[r]));
            this._layoutCalculate(o, e, i, -1), this._layoutCalculate(s, e, i, 1)
        }, _layoutCalculate: function (t, e, i, o) {
            function s(e, i, o) {
                for (var s = e; i > s; s++)if (t[s]._rect.y += o, t[s].style.y += o, t[s]._labelLine && (t[s]._labelLine.style.pointList[1][1] += o, t[s]._labelLine.style.pointList[2][1] += o), s > e && i > s + 1 && t[s + 1]._rect.y > t[s]._rect.y + t[s]._rect.height)return void r(s, o / 2);
                r(i - 1, o / 2)
            }

            function r(e, i) {
                for (var o = e; o >= 0 && (t[o]._rect.y -= i, t[o].style.y -= i, t[o]._labelLine && (t[o]._labelLine.style.pointList[1][1] -= i, t[o]._labelLine.style.pointList[2][1] -= i), !(o > 0 && t[o]._rect.y > t[o - 1]._rect.y + t[o - 1]._rect.height)); o--);
            }

            function n(t, e, i, o, s) {
                for (var r, n, a, h = i[0], l = i[1], d = s > 0 ? e ? Number.MAX_VALUE : 0 : e ? Number.MAX_VALUE : 0, c = 0, p = t.length; p > c; c++)n = Math.abs(t[c]._rect.y - l), a = t[c]._radius - o, r = o + a > n ? Math.sqrt((o + a + 20) * (o + a + 20) - Math.pow(t[c]._rect.y - l, 2)) : Math.abs(t[c]._rect.x + (s > 0 ? 0 : t[c]._rect.width) - h), e && r >= d && (r = d - 10), !e && d >= r && (r = d + 10), t[c]._rect.x = t[c].style.x = h + r * s, t[c]._labelLine.style.pointList[2][0] = h + (r - 5) * s, t[c]._labelLine.style.pointList[1][0] = h + (r - 20) * s, d = r
            }

            t.sort(function (t, e) {
                return t._rect.y - e._rect.y
            });
            for (var a, h = 0, l = t.length, d = [], c = [], p = 0; l > p; p++)a = t[p]._rect.y - h, 0 > a && s(p, l, -a, o), h = t[p]._rect.y + t[p]._rect.height;
            this.zr.getHeight() - h < 0 && r(l - 1, h - this.zr.getHeight());
            for (var p = 0; l > p; p++)t[p]._rect.y >= e[1] ? c.push(t[p]) : d.push(t[p]);
            n(c, !0, e, i, o), n(d, !1, e, i, o)
        }, reformOption: function (t) {
            var e = c.merge;
            return t = e(t || {}, this.ecTheme.pie), t.itemStyle.normal.label.textStyle = e(t.itemStyle.normal.label.textStyle || {}, this.ecTheme.textStyle), t.itemStyle.emphasis.label.textStyle = e(t.itemStyle.emphasis.label.textStyle || {}, this.ecTheme.textStyle), t
        }, refresh: function (t) {
            t && (this.option = t, this.series = t.series), this.backupShapeList(), this._buildShape()
        }, addDataAnimation: function (t) {
            for (var e = this.series, i = {}, o = 0, s = t.length; s > o; o++)i[t[o][0]] = t[o];
            var r = {}, n = {}, a = {}, h = this.shapeList;
            this.shapeList = [];
            for (var d, c, p, u = {}, o = 0, s = t.length; s > o; o++)d = t[o][0], c = t[o][2], p = t[o][3], e[d] && e[d].type === l.CHART_TYPE_PIE && (c ? (p || (r[d + "_" + e[d].data.length] = "delete"), u[d] = 1) : p ? u[d] = 0 : (r[d + "_-1"] = "delete", u[d] = -1), this._buildSinglePie(d));
            for (var g, f, o = 0, s = this.shapeList.length; s > o; o++)switch (d = this.shapeList[o]._seriesIndex, g = this.shapeList[o]._dataIndex, f = d + "_" + g, this.shapeList[o].type) {
                case"sector":
                    r[f] = this.shapeList[o];
                    break;
                case"text":
                    n[f] = this.shapeList[o];
                    break;
                case"broken-line":
                    a[f] = this.shapeList[o]
            }
            this.shapeList = [];
            for (var m, o = 0, s = h.length; s > o; o++)if (d = h[o]._seriesIndex, i[d]) {
                if (g = h[o]._dataIndex + u[d], f = d + "_" + g, m = r[f], !m)continue;
                if ("sector" === h[o].type)"delete" != m ? this.zr.animate(h[o].id, "style").when(400, {startAngle: m.style.startAngle, endAngle: m.style.endAngle}).start() : this.zr.animate(h[o].id, "style").when(400, u[d] < 0 ? {startAngle: h[o].style.startAngle} : {endAngle: h[o].style.endAngle}).start(); else if ("text" === h[o].type || "broken-line" === h[o].type)if ("delete" === m)this.zr.delShape(h[o].id); else switch (h[o].type) {
                    case"text":
                        m = n[f], this.zr.animate(h[o].id, "style").when(400, {x: m.style.x, y: m.style.y}).start();
                        break;
                    case"broken-line":
                        m = a[f], this.zr.animate(h[o].id, "style").when(400, {pointList: m.style.pointList}).start()
                }
            }
            this.shapeList = h
        }, onclick: function (t) {
            var e = this.series;
            if (this.isClick && t.target) {
                this.isClick = !1;
                for (var i, o = t.target, s = o.style, r = d.get(o, "seriesIndex"), n = d.get(o, "dataIndex"), a = 0, h = this.shapeList.length; h > a; a++)if (this.shapeList[a].id === o.id) {
                    if (r = d.get(o, "seriesIndex"), n = d.get(o, "dataIndex"), s._hasSelected)o.style.x = o.style._x, o.style.y = o.style._y, o.style._hasSelected = !1, this._selected[r][n] = !1; else {
                        var c = ((s.startAngle + s.endAngle) / 2).toFixed(2) - 0;
                        o.style._hasSelected = !0, this._selected[r][n] = !0, o.style._x = o.style.x, o.style._y = o.style.y, i = this.query(e[r], "selectedOffset"), o.style.x += p.cos(c, !0) * i, o.style.y -= p.sin(c, !0) * i
                    }
                    this.zr.modShape(o.id, o)
                } else this.shapeList[a].style._hasSelected && "single" === this._selectedMode && (r = d.get(this.shapeList[a], "seriesIndex"), n = d.get(this.shapeList[a], "dataIndex"), this.shapeList[a].style.x = this.shapeList[a].style._x, this.shapeList[a].style.y = this.shapeList[a].style._y, this.shapeList[a].style._hasSelected = !1, this._selected[r][n] = !1, this.zr.modShape(this.shapeList[a].id, this.shapeList[a]));
                this.messageCenter.dispatch(l.EVENT.PIE_SELECTED, t.event, {selected: this._selected, target: d.get(o, "name")}, this.myChart), this.zr.refresh()
            }
        }}, c.inherits(e, o), c.inherits(e, i), t("../chart").define("pie", e), e
    });
    var o = e("zrender");
    o.tool = {color: e("zrender/tool/color"), math: e("zrender/tool/math"), util: e("zrender/tool/util"), vector: e("zrender/tool/vector"), area: e("zrender/tool/area"), event: e("zrender/tool/event")}, o.animation = {Animation: e("zrender/animation/Animation"), Cip: e("zrender/animation/Clip"), easing: e("zrender/animation/easing")};
    var s = e("echarts");
    s.config = e("echarts/config"), s.util = {mapData: {params: ""}},  e("echarts/chart/line"), e("echarts/chart/bar"), e("echarts/chart/pie"), t.echarts = s, t.zrender = o
}(window);