var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// <stdin>
var stdin_exports = {};
__export(stdin_exports, {
  assets: () => assets_manifest_default,
  entry: () => entry,
  routes: () => routes
});

// node_modules/@remix-run/dev/compiler/shims/react.ts
var React = __toESM(require("react"));

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
var import_react = require("@remix-run/react");
var import_server = require("react-dom/server");
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  let markup = (0, import_server.renderToString)(/* @__PURE__ */ React.createElement(import_react.RemixServer, {
    context: remixContext,
    url: request.url
  }));
  responseHeaders.set("Content-Type", "text/html");
  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders
  });
}

// route:/Users/xiaofengxie/Project/xiaofeng-blog/app/root.tsx
var root_exports = {};
__export(root_exports, {
  default: () => App,
  links: () => links,
  meta: () => meta
});
var import_react2 = require("@remix-run/react");

// app/styles/app.css
var app_default = "/build/_assets/app-EY22FZYI.css";

// route:/Users/xiaofengxie/Project/xiaofeng-blog/app/root.tsx
var meta = () => ({
  charset: "utf-8",
  title: "Xiaofeng Xie",
  viewport: "width=device-width,initial-scale=1"
});
function links() {
  return [{ rel: "stylesheet", href: app_default }];
}
function App() {
  return /* @__PURE__ */ React.createElement("html", {
    lang: "en"
  }, /* @__PURE__ */ React.createElement("head", null, /* @__PURE__ */ React.createElement(import_react2.Meta, null), /* @__PURE__ */ React.createElement(import_react2.Links, null)), /* @__PURE__ */ React.createElement("body", null, /* @__PURE__ */ React.createElement(import_react2.Outlet, null), /* @__PURE__ */ React.createElement(import_react2.ScrollRestoration, null), /* @__PURE__ */ React.createElement(import_react2.Scripts, null), /* @__PURE__ */ React.createElement(import_react2.LiveReload, null)));
}

// route:/Users/xiaofengxie/Project/xiaofeng-blog/app/routes/index.tsx
var routes_exports = {};
__export(routes_exports, {
  default: () => Index
});
var import_remix_utils = require("remix-utils");

// assets/images/linkedin.svg
var linkedin_default = "/build/_assets/linkedin-FFGSU5M3.svg";

// assets/images/github.svg
var github_default = "/build/_assets/github-R4QX3TXX.svg";

// app/components/ColorSegment/ColorSegment.tsx
var import_react3 = __toESM(require("react"));

// app/components/ColorSegment/draw.js
var drawSegment = () => {
  let c = document.getElementsByTagName("canvas")[0], x = c.getContext("2d"), pr = window.devicePixelRatio || 1, w = window.innerWidth, h = window.innerHeight, f = 90, q, m = Math, r = 0, u = m.PI * 2, v = m.cos, z = m.random;
  c.width = w * pr;
  c.height = h * pr;
  x.scale(pr, pr);
  x.globalAlpha = 0.6;
  function i() {
    x.clearRect(0, 0, w, h);
    q = [
      { x: 0, y: h * 0.7 + f },
      { x: 0, y: h * 0.7 - f }
    ];
    while (q[1].x < w + f)
      d(q[0], q[1]);
  }
  function d(i2, j) {
    x.beginPath();
    x.moveTo(i2.x, i2.y);
    x.lineTo(j.x, j.y);
    var k = j.x + (z() * 2 - 0.25) * f, n = y(j.y);
    x.lineTo(k, n);
    x.closePath();
    r -= u / -50;
    x.fillStyle = "#" + (v(r) * 127 + 128 << 16 | v(r + u / 3) * 127 + 128 << 8 | v(r + u / 3 * 2) * 127 + 128).toString(16);
    x.fill();
    q[0] = q[1];
    q[1] = { x: k, y: n };
  }
  function y(p) {
    var t = p + (z() * 2 - 1.1) * f;
    return t > h || t < 0 ? y(p) : t;
  }
  document.onclick = i;
  document.ontouchstart = i;
  i();
};

// app/components/ColorSegment/ColorSegment.tsx
var ColorSegment = () => {
  import_react3.default.useLayoutEffect(() => drawSegment());
  return /* @__PURE__ */ import_react3.default.createElement("canvas", {
    className: "absolute top-0 w-full h-full"
  });
};
var ColorSegment_default = ColorSegment;

// route:/Users/xiaofengxie/Project/xiaofeng-blog/app/routes/index.tsx
var import_react4 = __toESM(require("react"));
function Index() {
  return /* @__PURE__ */ import_react4.default.createElement("div", {
    className: "w-screen h-screen bg-black"
  }, /* @__PURE__ */ import_react4.default.createElement("main", {
    className: "flex justify-center items-center h-full flex-col gap-12"
  }, /* @__PURE__ */ import_react4.default.createElement("section", {
    className: "flex justify-center items-center flex-col gap-10"
  }, /* @__PURE__ */ import_react4.default.createElement("h1", {
    className: "text-white text-3xl md:text-5xl font-mono"
  }, "Read,Think and Code"), /* @__PURE__ */ import_react4.default.createElement("h2", {
    className: "text-white text-3xl font-cursive"
  }, "Xiaofeng Xie")), /* @__PURE__ */ import_react4.default.createElement("section", {
    className: "flex gap-20 z-10"
  }, /* @__PURE__ */ import_react4.default.createElement("a", {
    href: "https://www.linkedin.com/in/markxie/"
  }, /* @__PURE__ */ import_react4.default.createElement("img", {
    src: linkedin_default,
    className: "w-12 h-12",
    alt: "linkedin"
  })), /* @__PURE__ */ import_react4.default.createElement("a", {
    href: "https://github.com/XiaofengXie16"
  }, /* @__PURE__ */ import_react4.default.createElement("img", {
    src: github_default,
    className: "w-12 h-12",
    alt: "github"
  }))), /* @__PURE__ */ import_react4.default.createElement(import_remix_utils.ClientOnly, {
    fallback: /* @__PURE__ */ import_react4.default.createElement("p", null, "Loading...")
  }, () => /* @__PURE__ */ import_react4.default.createElement(ColorSegment_default, null))));
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { "version": "ba7bfdcc", "entry": { "module": "/build/entry.client-KZBKIOCL.js", "imports": ["/build/_shared/chunk-6JK2KUM6.js", "/build/_shared/chunk-IYRIQ6PI.js"] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "module": "/build/root-CXPYSMYP.js", "imports": void 0, "hasAction": false, "hasLoader": false, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/index": { "id": "routes/index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "module": "/build/routes/index-7FH74IIQ.js", "imports": void 0, "hasAction": false, "hasLoader": false, "hasCatchBoundary": false, "hasErrorBoundary": false } }, "url": "/build/manifest-BA7BFDCC.js" };

// server-entry-module:@remix-run/dev/server-build
var entry = { module: entry_server_exports };
var routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/index": {
    id: "routes/index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: routes_exports
  }
};
module.exports = __toCommonJS(stdin_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assets,
  entry,
  routes
});
//# sourceMappingURL=index.js.map
