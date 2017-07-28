function AgoraRender() {
	function e(e, t, n, r, o) {
		a.activeTexture(a.TEXTURE0), a.bindTexture(a.TEXTURE_2D, u), a.texImage2D(a.TEXTURE_2D, 0, a.LUMINANCE, e, t, 0, a.LUMINANCE, a.UNSIGNED_BYTE, n);
		var i = a.getError();
		i != a.NO_ERROR && console.log("upload y plane ", e, t, n.byteLength, " error", i), a.activeTexture(a.TEXTURE1), a.bindTexture(a.TEXTURE_2D, d), a.texImage2D(a.TEXTURE_2D, 0, a.LUMINANCE, e / 2, t / 2, 0, a.LUMINANCE, a.UNSIGNED_BYTE, r);
		var i = a.getError();
		i != a.NO_ERROR && console.log("upload u plane ", e, t, r.byteLength, "  error", i), a.activeTexture(a.TEXTURE2), a.bindTexture(a.TEXTURE_2D, f), a.texImage2D(a.TEXTURE_2D, 0, a.LUMINANCE, e / 2, t / 2, 0, a.LUMINANCE, a.UNSIGNED_BYTE, o);
		var i = a.getError();
		i != a.NO_ERROR && console.log("upload v plane ", e, t, o.byteLength, "  error", i)
	}
	function t(e) {
		e && v.gl && v.gl.deleteBuffer(e)
	}
	function n(e) {
		e && v.gl && v.gl.deleteTexture(e)
	}
	function r(e, t, n, r, i, s) {
		// console.log(n,"---------------------------",r,"*************************",i), 
		v.clientWidth = e.clientWidth,
			v.clientHeight = e.clientHeight,
			v.view = e, v.mirrorView = t,
			v.canvasUpdated = !1,
			v.container = document.createElement("div"),
			v.container.style.width = "100%",
			v.container.style.height = "100%",
			v.container.style.display = "flex",
			v.container.style.justifyContent = "center",
			v.container.style.alignItems = "center",
			v.view.appendChild(v.container),
			v.canvas = document.createElement("canvas"),
			0 == i || 180 == i ?
				(v.canvas.width = 400, v.canvas.height = 300):
				(v.canvas.width = 400, v.canvas.height = 300),
				
			v.initWidth = n, v.initHeight = r,
			v.initRotation = i,
			v.mirrorView && (v.canvas.style.transform = "rotateY(180deg)"),
			v.container.appendChild(v.canvas);
		try {
			a = v.canvas.getContext("webgl") || v.canvas.getContext("experimental-webgl")
		} catch (l) {
			console.log(l)
		}
		return a ? (a.clearColor(0, 0, 0, 1), a.enable(a.DEPTH_TEST), a.depthFunc(a.LEQUAL), a.clear(a.COLOR_BUFFER_BIT | a.DEPTH_BUFFER_BIT), c = createProgramFromSources(a, [AgoraRTC.vertexShaderSource, AgoraRTC.yuvShaderSource]), a.useProgram(c), void o()) : (a = void 0, void s({
			error: "Browser not support! No WebGL detected."
		}))
	}
	function o() {
		s = a.getAttribLocation(c, "a_position"), l = a.getAttribLocation(c, "a_texCoord"), m = a.createBuffer(), g = a.createBuffer(), a.activeTexture(a.TEXTURE0), u = a.createTexture(), a.bindTexture(a.TEXTURE_2D, u), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_S, a.CLAMP_TO_EDGE), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_T, a.CLAMP_TO_EDGE), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, a.NEAREST), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MAG_FILTER, a.NEAREST), a.activeTexture(a.TEXTURE1), d = a.createTexture(), a.bindTexture(a.TEXTURE_2D, d), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_S, a.CLAMP_TO_EDGE), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_T, a.CLAMP_TO_EDGE), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, a.NEAREST), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MAG_FILTER, a.NEAREST), a.activeTexture(a.TEXTURE2), f = a.createTexture(), a.bindTexture(a.TEXTURE_2D, f), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_S, a.CLAMP_TO_EDGE), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_T, a.CLAMP_TO_EDGE), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, a.NEAREST), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MAG_FILTER, a.NEAREST);
		var e = a.getUniformLocation(c, "Ytex");
		a.uniform1i(e, 0);
		var t = a.getUniformLocation(c, "Utex");
		a.uniform1i(t, 1);
		var n = a.getUniformLocation(c, "Vtex");
		a.uniform1i(n, 2)
	}
	function i(e, t, n) {
		// console.log(e,t,n,"--------------------mxl--------------------------")
		if (!v.canvasUpdated) {
			v.canvas.style.width = "100%", v.canvas.style.height = "100%";
			try {
				// v.canvas.style.width = v.clientHeight * t / n + "px" : v.clientWidth / v.clientHeight < t / n && (v.canvas.style.height = v.clientWidth * n / t + "px") : v.clientHeight / v.clientWidth > t / n ? v.canvas.style.height = v.clientWidth * t / n + "px" : v.clientHeight / v.clientWidth < t / n && (v.canvas.style.width = v.clientHeight * n / t + "px")
				0 === e || 180 === e ?
					v.clientWidth / v.clientHeight > t / n ?
						v.canvas.style.width = 180 + "px !important" :
						v.canvas.style.width = 180 + "px !important" && (v.canvas.style.height = 140 + "px") :
					v.canvas.style.width = 180 + "px !important" ?
						v.canvas.style.height = 140 + "px" :
						v.canvas.style.width = 180 + "px !important" && (v.canvas.style.width = 180 + "px ")
			} catch (r) {
				return console.log("updateCanvas 00001 gone " + v.canvas), console.log(v), void console.error(r)
			}
			a.bindBuffer(a.ARRAY_BUFFER, m), a.enableVertexAttribArray(s), a.vertexAttribPointer(s, 2, a.FLOAT, !1, 0, 0);
			var o = {
				x: 0,
				y: 0
			},
				i = {
					x: t,
					y: 0
				},
				l = {
					x: t,
					y: n
				},
				u = {
					x: 0,
					y: n
				},
				d = o,
				f = i,
				g = l,
				E = u;
			switch (e) {
				case 0:
					break;
				case 90:
					d = i, f = l, g = u, E = o;
					break;
				case 180:
					d = l, f = u, g = o, E = i;
					break;
				case 270:
					d = u, f = o, g = i, E = l
			}
			a.bufferData(a.ARRAY_BUFFER, new Float32Array([d.x, d.y, f.x, f.y, E.x, E.y, E.x, E.y, f.x, f.y, g.x, g.y]), a.STATIC_DRAW);
			var A = a.getUniformLocation(c, "u_resolution");
			a.uniform2f(A, t, n), v.canvasUpdated = !0
		}
	}
	var a = void 0,
		c = void 0,
		s = void 0,
		l = void 0,
		u = void 0,
		d = void 0,
		f = void 0,
		g = void 0,
		m = void 0,
		v = {
			view: void 0,
			mirrorView: !1,
			container: void 0,
			canvas: void 0,
			renderImageCount: 0,
			initWidth: 0,
			initHeight: 0,
			initRotation: 0,
			canvasUpdated: !1,
			clientWidth: 0,
			clientHeight: 0
		};
	return v.start = function (e, t) {
		r(e, v.mirrorView, e.clientWidth, e.clientHeight, v.initRotation, t)
	}, v.stop = function () {
		a = void 0, c = void 0, s = void 0, l = void 0, n(u), n(d), n(f), u = void 0, d = void 0, f = void 0, t(g), t(m), g = void 0, m = void 0, v.container && v.container.removeChild(v.canvas), v.view && v.view.removeChild(v.container), v.canvas = void 0, v.container = void 0, v.view = void 0, v.mirrorView = !1
	}, v.renderImage = function (t) {
		if (a) {
			if (t.width != v.initWidth || t.height != v.initHeight || t.rotation != v.initRotation || t.mirror != v.mirrorView) {
				var n = v.view;
				v.stop(), console.log("init canvas " + t.width + "*" + t.height + " rotation " + t.rotation), r(n, t.mirror, t.width, t.height, t.rotation, function (e) {
					console.error("init canvas " + t.width + "*" + t.height + " rotation " + t.rotation + " failed. " + e)
				})
			}
			a.bindBuffer(a.ARRAY_BUFFER, g);
			var o = t.width + t.left + t.right,
				c = t.height + t.top + t.bottom;
			a.bufferData(a.ARRAY_BUFFER, new Float32Array([t.left / o, t.bottom / c, 1 - t.right / o, t.bottom / c, t.left / o, 1 - t.top / c, t.left / o, 1 - t.top / c, 1 - t.right / o, t.bottom / c, 1 - t.right / o, 1 - t.top / c]), a.STATIC_DRAW), a.enableVertexAttribArray(l), a.vertexAttribPointer(l, 2, a.FLOAT, !1, 0, 0), e(o, c, t.yplane, t.uplane, t.vplane), i(t.rotation, t.width, t.height), a.drawArrays(a.TRIANGLES, 0, 6), v.renderImageCount += 1
		}
	}, v
}
var AgoraRTC = function () {
	"use strict";
	var e = {};
	return Object.defineProperties(e, {
		version: {
			get: function () {
				return "1.8.1"
			}
		},
		name: {
			get: function () {
				return "AgoraWebSDK"
			}
		}
	}), e
} ();
AgoraRTC.secureAgentUrl = "wss://localhost.agora.io:8921/", AgoraRTC.agentUrl = "ws://127.0.0.1:8922/", AgoraRTC.getAgentUrl = function () {
	return "https:" === location.protocol ? AgoraRTC.secureAgentUrl : AgoraRTC.agentUrl
}, AgoraRTC.macAgentInstallUrl = "http://download.agora.io/sdk/release/AgoraWebAgent-1.8.1.pkg", AgoraRTC.winAgentInstallUrl = "http://download.agora.io/sdk/release/AgoraWebAgentSetup-1.8.1.exe", AgoraRTC.enAgentInstallGuideUrl = "http://download.agora.io/install-guide-en.html", AgoraRTC.cnAgentInstallGuideUrl = "http://download.agora.io/install-guide-cn.html", AgoraRTC.vertexShaderSource = "attribute vec2 a_position;attribute vec2 a_texCoord;uniform vec2 u_resolution;varying vec2 v_texCoord;void main() {vec2 zeroToOne = a_position / u_resolution;   vec2 zeroToTwo = zeroToOne * 2.0;   vec2 clipSpace = zeroToTwo - 1.0;   gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);v_texCoord = a_texCoord;}", AgoraRTC.yuvShaderSource = "precision mediump float;uniform sampler2D Ytex;uniform sampler2D Utex,Vtex;varying vec2 v_texCoord;void main(void) {  float nx,ny,r,g,b,y,u,v;  mediump vec4 txl,ux,vx;  nx=v_texCoord[0];  ny=v_texCoord[1];  y=texture2D(Ytex,vec2(nx,ny)).r;  u=texture2D(Utex,vec2(nx,ny)).r;  v=texture2D(Vtex,vec2(nx,ny)).r;  y=1.1643*(y-0.0625);  u=u-0.5;  v=v-0.5;  r=y+1.5958*v;  g=y-0.39173*u-0.81290*v;  b=y+2.017*u;  gl_FragColor=vec4(r,g,b,1.0);}", AgoraRTC.videoStreamSource = 'function onSuccess(){postMessage({type:"init",result:!0})}function onFailure(a){postMessage(a)}function sendMessage(a){"videoStat"!=a.command&&console.log(JSON.stringify(a)),that.stream&&that.stream.readyState==WebSocket.OPEN&&that.stream.send(JSON.stringify(a))}var that={};that.stream=void 0,that.init=function(a){return that.stream&&that.stream.readyState===WebSocket.OPEN?(console.warn("stream "+that.getId()+" has been initialized already"),void onSuccess()):(that.local=a.local,that.profile=a.videoProfile,that.stream=new WebSocket(a.url),that.stream.onopen=function(a){console.log((that.local?"local":"remote")+" Stream "),console.log(a),that.profile&&sendMessage({command:"setVideoProfile",profile:that.profile.profile,swapWidthAndHeight:that.profile.swapWidthAndHeight}),that.stream.binaryType="arraybuffer",onSuccess()},that.stream.onclose=function(a){console.log(that.local?"local":"remote"," Stream ",a),that.stream=void 0,onFailure({type:a.type,code:a.code,reason:a.reason})},that.stream.onerror=function(a){console.log(that.local?"local":"remote"," Stream ",a),onFailure({type:a.type,code:a.code,reason:a.reason})},void(that.stream.onmessage=function(a){"string"==typeof a.data?console.log(that.local?"local":"remote"," message from agent ",a.data):a.data instanceof ArrayBuffer?postMessage({type:"message",data:a.data}):a.data instanceof Blob&&console.warn("Blob image data is not supported")}))},that.close=function(){that.stream&&(that.stream.onmessage=void 0,that.stream.close()),that.stream=void 0},self.addEventListener("message",function(a){var b=a.data;switch(b.type){case"init":that.init(b);break;case"send":sendMessage(b.message);break;case"close":that.close()}},!1);';
var AgoraCall = function (e, t) {
	e && e(t)
},
	L = {
		VideoProfiles: {
			Profile120P: "120P",
			Profile120P_3: "120P_3",
			Profile96P: "96P",
			Profile48P: "48P",
			Profile180P: "180P",
			Profile180P_3: "180P_3",
			Profile180P_4: "180P_4",
			Profile240P: "240P",
			Profile240P_3: "240P_3",
			Profile240P_4: "240P_4",
			Profile360P: "360P",
			Profile360P_3: "360P_3",
			Profile360P_4: "360P_4",
			Profile360P_6: "360P_6",
			Profile360P_7: "360P_7",
			Profile360P_8: "360P_8",
			Profile480P: "480P",
			Profile480P_3: "480P_3",
			Profile480P_4: "480P_4",
			Profile480P_6: "480P_6",
			Profile480P_8: "480P_8",
			Profile480P_9: "480P_9",
			Profile720P: "720P",
			Profile720P_3: "720P_3",
			Profile720P_5: "720P_5",
			Profile720P_6: "720P_6"
		},
		ErrorCode: {
			NO_ERROR: 0,
			FAILED: 1,
			INVALID_ARGUMENT: 2,
			NOT_READY: 3,
			NOT_SUPPORTED: 4,
			REFUSED: 5,
			BUFFER_TOO_SMALL: 6,
			NOT_INITIALIZED: 7,
			INVALID_VIEW: 8,
			NO_PERMISSION: 9,
			TIMEDOUT: 10,
			CANCELED: 11,
			TOO_OFTEN: 12,
			BIND_SOCKET: 13,
			NET_DOWN: 14,
			NET_NOBUFS: 15,
			INIT_VIDEO: 16,
			JOIN_CHANNEL_REJECTED: 17,
			LEAVE_CHANNEL_REJECTED: 18,
			ALREADY_IN_USE: 19,
			INVALID_APP_ID: 101,
			INVALID_CHANNEL_NAME: 102,
			CHANNEL_KEY_EXPIRED: 109,
			INVALID_CHANNEL_KEY: 110,
			CONNECTION_INTERRUPTED: 111,
			CONNECTION_LOST: 112,
			LOAD_MEDIA_ENGINE: 1001,
			START_CALL: 1002,
			START_CAMERA: 1003,
			START_VIDEO_RENDER: 1004,
			ADM_GENERAL_ERROR: 1005,
			ADM_JAVA_RESOURCE: 1006,
			ADM_SAMPLE_RATE: 1007,
			ADM_INIT_PLAYOUT: 1008,
			ADM_START_PLAYOUT: 1009,
			ADM_STOP_PLAYOUT: 1010,
			ADM_INIT_RECORDING: 1011,
			ADM_START_RECORDING: 1012,
			ADM_STOP_RECORDING: 1013,
			ADM_RUNTIME_PLAYOUT_ERROR: 1015,
			ADM_RUNTIME_RECORDING_ERROR: 1017,
			ADM_RECORD_AUDIO_FAILED: 1018,
			ADM_INIT_LOOPBACK: 1022,
			ADM_START_LOOPBACK: 1023,
			VDM_CAMERA_NOT_AUTHORIZED: 1501
		}
	};
AgoraRTC.EventDispatcher = function (e) {
	"use strict";
	var t = {};
	return e.dispatcher = {}, e.dispatcher.eventListeners = {}, t.addEventListener = function (t, n) {
		e.dispatcher.eventListeners[t] = n, e.dispatcher.eventListeners[t] || delete e.dispatcher.eventListeners[t]
	}, t.on = t.addEventListener, t.dispatchEvent = function (t) {
		e.dispatcher.eventListeners.hasOwnProperty(t.type) && e.dispatcher.eventListeners[t.type](t)
	}, t
}, AgoraRTC.BasicEvent = function (e) {
	"use strict";
	var t = {};
	return t.type = e.type, t
}, AgoraRTC.StreamEvent = function (e) {
	"use strict";
	var t = AgoraRTC.BasicEvent(e);
	return t.stream = e.stream, t.msg = e.msg, t
}, AgoraRTC.ClientEvent = function (e) {
	"use strict";
	var t = AgoraRTC.BasicEvent(e);
	return t.uid = e.uid, t.attr = e.attr, t.streams = e.streams, t
}, AgoraRTC.MediaEvent = function (e) {
	"use strict";
	var t = AgoraRTC.BasicEvent(e);
	return t.msg = e.msg, t
}, AgoraRTC.Signal = function (e) {
	function t(e) {
		console.log(e)
	}
	var n = AgoraRTC.EventDispatcher(e);
	return n.connection = new WebSocket(e.url), n.sendMessage = function (e, t) {
		n.connection.readyState == WebSocket.OPEN ? n.connection.send(JSON.stringify(e)) : (console.log("connection to agent lost."), t({
			error: "not connected"
		}))
	}, n.close = function () {
		n.onEvent = t, n.connection.onopen = void 0, n.connection.onclose = void 0, n.connection.onerror = void 0, n.connection.onmessage = void 0, n.connection.close()
	}, n.connection.onopen = function (e) {
		console.log(e), n.dispatchEvent(AgoraRTC.MediaEvent({
			type: "onopen",
			event: e
		}))
	}, n.connection.onclose = function (t) {
		console.log(t), AgoraCall(e.onFailure, t)
	}, n.connection.onerror = function (t) {
		console.log(t), AgoraCall(e.onFailure, t)
	}, n.onEvent = t, n.connection.onmessage = function (e) {
		console.log(e);
		var t = JSON.parse(e.data);
		t.hasOwnProperty("command") ? n.dispatchEvent(AgoraRTC.MediaEvent({
			type: t.command,
			msg: t
		})) : t.hasOwnProperty("event") && n.onEvent(t)
	}, n
}, AgoraRTC.Stream = function (e) {
	function t() {
		i = void 0, a = void 0, c = void 0, s = void 0
	}
	function n(e, t) {
		return {
			width: e,
			height: t
		}
	}
	function r(e) {
		var t = e.data;
		switch (t.type) {
			case "init":
				o.oninit(t);
				break;
			case "close":
				o.onclose(t);
				break;
			case "error":
				o.onerror(t);
				break;
			case "message":
				o.onmessage(t.data)
		}
	}
	var o = AgoraRTC.EventDispatcher(e);
	o.stream = void 0, o.render = void 0, o.interval = void 0, o.lastRenderCount = 0, o.profile = void 0, o.latency = 0;
	var i = void 0,
		a = void 0,
		c = void 0,
		s = void 0;
	o.init = function (t, n) {
		if (o.stream) return console.warn("stream " + o.getId() + " has been initialized already"), void t();
		var i = new Blob([AgoraRTC.videoStreamSource], {
			type: "application/javascript"
		});
		o.stream = new Worker(URL.createObjectURL(i)), o.oninit = function (r) {
			console.log((e.local ? "local" : "remote") + " Stream "), console.log(r), r.result === !0 ? t() : n()
		}, o.onclose = function (t) {
			window.clearInterval(o.interval), console.log(e.local ? "local" : "remote", " Stream ", t), o.stream = void 0
		}, o.onerror = function (t) {
			window.clearInterval(o.interval), console.log(e.local ? "local" : "remote", " Stream ", t), n(t)
		}, o.onmessage = function (t) {
			"string" == typeof t ? console.log(e.local ? "local" : "remote", " message from agent ", t) : t instanceof ArrayBuffer ? o.render && o.drawImage(t) : t instanceof Blob && console.warn("Blob image data is not supported")
		}, o.stream.addEventListener("message", r, !1), o.stream.postMessage({
			type: "init",
			local: e.local,
			url: AgoraRTC.getAgentUrl(),
			videoProfile: o.profile
		})
	}, o.close = function () {
		window.clearInterval(o.interval), o.stream && (o.stream.removeEventListener("message", r), o.stream.postMessage({
			type: "close"
		})), o.stream = void 0, o.stop()
	}, o.play = function (t, n) {
		var r = document.getElementById(t);
		o.stop(), o.render = AgoraRender(), o.render.start(r, n), e.local ? o.stream.postMessage({
			type: "send",
			message: {
				command: "preview",
				uid: e.streamID,
				audio: e.audio !== !1,
				video: e.video !== !1,
				screen: e.screen === !0,
				viewWidth: r.clientWidth,
				viewHeight: r.clientHeight
			}
		}) : o.stream.postMessage({
			type: "send",
			message: {
				command: "subscribe",
				uid: e.streamID,
				viewWidth: r.clientWidth,
				viewHeight: r.clientHeight
			}
		}), o.interval && window.clearInterval(o.interval), o.interval = window.setInterval(function () {
			if (o.render) {
				var t = o.render.renderImageCount - o.lastRenderCount;
				o.stream.postMessage({
					type: "send",
					message: {
						command: "videoStat",
						uid: e.streamID,
						fps: t,
						frameCount: o.lastRenderCount,
						latency: o.latency
					}
				}), o.lastRenderCount = o.render.renderImageCount, o.latency = 0
			}
		}, 1e3)
	}, o.stop = function () {
		o.render && o.render.stop(), o.render = void 0, o.lastRenderCount = 0
	}, o.bindClient = function (e) {
		o.client = e
	}, o.enableAudio = function (e) {
		return o.client.enableAudio(o, e)
	}, o.disableAudio = function (e) {
		return o.client.disableAudio(o, e)
	}, o.enableVideo = function (e) {
		return o.client.enableVideo(o, e)
	}, o.disableVideo = function (e) {
		return o.client.disableVideo(o, e)
	}, o.getId = function () {
		return e.streamID
	}, o.drawImage = function (e) {
		if (!i) return i = e, void (20 != i.byteLength && (console.error("invalid image header " + e.byteLength), t()));
		if (!a) return a = e, void (20 === a.byteLength && (console.error("invalid image header " + e.byteLength + " " + a.byteLength), t()));
		if (!c) return c = e, void (20 === c.byteLength && (console.error("invalid image header " + e.byteLength + " " + a.byteLength + " " + c.byteLength), t()));
		if (!s) {
			if (s = e, a.byteLength != 4 * c.byteLength || c.byteLength != s.byteLength) return console.error("invalid image header " + e.byteLength + " " + a.byteLength + " " + c.byteLength + " " + s.byteLength), void t();
			var n = new DataView(i),
				r = (n.getUint8(0), n.getUint8(1)),
				l = n.getUint16(2),
				u = n.getUint16(4),
				d = n.getUint16(6),
				f = n.getUint16(8),
				g = n.getUint16(10),
				m = n.getUint16(12),
				v = n.getUint16(14),
				E = n.getUint32(16);
			o.render.renderImage({
				mirror: r,
				width: l,
				height: u,
				left: d,
				top: f,
				right: g,
				bottom: m,
				rotation: v,
				yplane: new Uint8Array(a),
				uplane: new Uint8Array(c),
				vplane: new Uint8Array(s)
			});
			var A = (4294967295 & Date.now()) >>> 0,
				h = A - E;
			h > o.latency && (o.latency = h), t()
		}
	}, o.setVideoProfile = function (e) {
		return o.profile = {}, ("string" == typeof e || "object" == typeof e) && (e.hasOwnProperty("profile") && (o.profile.profile = e.profile), e.hasOwnProperty("swapWidthAndHeight") ? o.profile.swapWidthAndHeight = e.swapWidthAndHeight !== !1 : o.profile.swapWidthAndHeight = !1, "string" == typeof e && (o.profile.profile = e), o.stream && o.stream.postMessage({
			type: "send",
			message: {
				command: "setVideoProfile",
				profile: o.profile.profile,
				swapWidthAndHeight: o.profile.swapWidthAndHeight
			}
		}), !0)
	};
	({
		"true": !0,
		unspecified: !0,
		"120p": n(160, 120),
		"240p": n(320, 240),
		"360p": n(640, 360),
		"480p": n(640, 480),
		"720p": n(1280, 720),
		"1080p": n(1920, 1080),
		"4k": n(3840, 2160)
	});
	return o
}, AgoraRTC.createStream = function (e) {
	return AgoraRTC.Stream(e)
}, AgoraRTC.Client = function (e) {
	"use strict";

	function t(e) {
		if (s.signalOpen) {
			console.log("signal connection lost.");
			var t = {
				reason: "LOST_CONNECTION_TO_AGENT",
				type: "error",
				eventType: e.type,
				code: e.code
			};
			return AgoraCall(s.onFailure, t), void s.dispatchEvent(t)
		}
		if ("error" !== e.type) {
			var t = {
				reason: "CLOSE_BEFORE_OPEN",
				type: "error",
				eventType: e.type,
				code: e.code,
				agentInstallUrl: i(),
				agentInstallGuideUrl: a()
			};
			AgoraCall(s.onFailure, t), s.dispatchEvent(t)
		}
	}
	function n(e, t, n) {
		s.signal.on(e.command, function (e) {
			AgoraCall(t, e), console.log(e)
		}), s.signal.sendMessage(e, function (e) {
			console.log(e), e.reason = "CONNECTION_TO_AGENT_ERROR", AgoraCall(n, e)
		})
	}
	function r(e) {
		var t = e.msg;
		s.remoteStreams.hasOwnProperty(t.uid) && (s.remoteStreams[t.uid].close(), delete s.remoteStreams[t.uid], console.log("remote streams after peer leave ", s.remoteStreams)), s.dispatchEvent(AgoraRTC.ClientEvent({
			type: "peer-leave",
			uid: t.uid
		}))
	}
	function o(e) {
		var t = e.msg;
		if (!s.remoteStreams.hasOwnProperty(t.uid)) {
			var n = AgoraRTC.Stream({
				streamID: t.uid,
				local: !1,
				audio: t.audio,
				video: t.video,
				screen: t.screen
			});
			n.bindClient(s), s.remoteStreams[t.uid] = n
		}
		s.dispatchEvent(AgoraRTC.StreamEvent({
			type: "stream-added",
			stream: s.remoteStreams[t.uid]
		})), console.log("remote streams", s.remoteStreams)
	}
	function i() {
		return navigator.appVersion.indexOf("Mac") != -1 ? AgoraRTC.macAgentInstallUrl : AgoraRTC.winAgentInstallUrl
	}
	function a() {
		var e = navigator.language || navigator.userLanguage;
		return e.indexOf("zh") != -1 ? AgoraRTC.cnAgentInstallGuideUrl : AgoraRTC.enAgentInstallGuideUrl
	}
	function c() {
		s.localStream && s.localStream.close(), s.localStream = void 0;
		for (var e in s.remoteStreams) s.remoteStreams.hasOwnProperty(e) && (s.remoteStreams[e].close(), delete s.remoteStreams[e])
	}
	var s = AgoraRTC.EventDispatcher(e);
	return s.signal = void 0, s.localStream = void 0, s.remoteStreams = {}, s.signalOpen = !1, s.agentUrl = AgoraRTC.getAgentUrl(), s.init = function (r, o, c) {
		function l(t, r) {
			n({
				command: "initialize",
				appId: e.appId
			}, function (e) {
				var n = e.msg;
				return 1 != n.code ? (s.signal.close(), s.signal = void 0, void u(n.code, "initialize")) : void AgoraCall(t, n)
			}, r)
		}
		function u(e, t) {
			var n = f(e);
			n || (n = "UNKNOWN_ERROR"), d({
				reason: n,
				type: "error",
				eventType: t,
				code: e
			})
		}
		function d(e) {
			AgoraCall(c, e), s.dispatchEvent(e)
		}
		function f(e) {
			for (var t in L.ErrorCode) if (L.ErrorCode.hasOwnProperty(t) && L.ErrorCode[t] === e) return String(t);
			return null
		}
		if (e.appId = r, s.onFailure = c, !s.signal) {
			try {
				s.signal = AgoraRTC.Signal({
					url: s.agentUrl,
					onFailure: t
				})
			} catch (g) {
				return console.log("create signal connection failed" + g), void AgoraCall(c, g)
			}
			s.signal.on("onopen", function (e) {
				s.signalOpen = !0, s.signal.onEvent = function (e) {
					if ("error" === e.event) {
						var t = f(e.code);
						t && (e.reason = t)
					} else "onUserMuteAudio" === e.event ? e.event = "peer-mute-audio" : "onUserMuteVideo" === e.event && (e.event = "peer-mute-video");
					s.dispatchEvent(AgoraRTC.MediaEvent({
						type: e.event,
						msg: e
					}))
				}, s.getVersion(function (e) {
					if ("1.6.0" == e.version || "1.6.1" == e.version || "1.7.0" == e.version || "1.7.1" == e.version || "1.7.2" == e.version || "1.7.3" == e.version || "1.7.4" == e.version || "1.8.0" == e.version || "1.8.1" == e.version) return void l(o, c);
					var t = {
						reason: "INCOMPATIBLE_WEBAGENT",
						type: "error",
						version: AgoraRTC.version,
						agentVersion: e.version,
						agentInstallUrl: i(),
						agentInstallGuideUrl: a()
					};
					s.dispatchEvent(t)
				}, function (e) {
					var t = {
						reason: "INCOMPATIBLE_WEBAGENT",
						type: "error",
						version: AgoraRTC.version,
						agentVersion: e.version,
						agentInstallUrl: i(),
						agentInstallGuideUrl: a()
					};
					s.dispatchEvent(t)
				})
			})
		}
		s.signalOpen && l(o, c), s.signal.on("onError", function (e) {
			var t = e.msg;
			u(t.code, "error")
		}), console.log(s.signal)
	}, s.renewChannelKey = function (e, t, r) {
		n({
			command: "renewChannelKey",
			channelKey: e
		}, function (e) {
			var n = e.msg;
			return n.code === !0 ? void AgoraCall(t, n) : void AgoraCall(r, n)
		}, r)
	}, s.join = function (e, t, i, a, c) {
		return t.length > 64 ? void c(L.ErrorCode.INVALID_CHANNEL_NAME) : void n({
			command: "joinChannel",
			channelKey: e,
			channelName: t,
			uid: i
		}, function (e) {
			s.signal.on("onAddVideoStream", o), s.signal.on("onPeerLeave", r);
			var t = e.msg;
			return 1 == t.code ? (t.uid || (t.uid = 0), void AgoraCall(a, t.uid)) : t.code == L.ErrorCode.JOIN_CHANNEL_REJECTED ? (console.error("Command joinChannel has been rejected by agent. Is this user joined a channel already?"), void AgoraCall(c, t.code)) : void AgoraCall(c, t.code)
		}, c)
	}, s.leave = function (e, t) {
		c(), n({
			command: "leaveChannel"
		}, function (n) {
			var r = n.msg;
			return r.code === !0 ? void AgoraCall(e, r) : r.code == L.ErrorCode.LEAVE_CHANNEL_REJECTED ? (console.error("Command leaveChannel has been rejected by agent. Is this user not in a channel?"), void AgoraCall(e, r)) : void AgoraCall(t, {
				code: r.code
			})
		}, function (e) {
			console.log("leave channel failed", e)
		})
	}, s.publish = function (e, t, r) {
		s.localStream = e, n({
			command: "unmuteLocal"
		}, function (e) {
			var n = e.msg;
			return 1 != n.code ? void AgoraCall(r, {
				code: n.code
			}) : void AgoraCall(t, n)
		}, r), e.bindClient(s)
	}, s.unpublish = function (e, t, r) {
		n({
			command: "muteLocal"
		}, function (e) {
			var n = e.msg;
			return 1 != n.code ? void AgoraCall(r, {
				code: n.code
			}) : void AgoraCall(t, n)
		}, function (e) {
			AgoraCall(r, {
				error: e
			})
		})
	}, s.subscribe = function (e, t) {
		e.init(function () {
			s.dispatchEvent(AgoraRTC.StreamEvent({
				type: "stream-subscribed",
				stream: e
			}))
		}, function (e) {
			AgoraCall(t, e)
		})
	}, s.unsubscribe = function (e, t) {
		return console.log("remote streams", s.remoteStreams), void 0 == s.remoteStreams[e] ? void AgoraCall(t, {
			error: "no such stream"
		}) : (s.remoteStreams[e].close(), void delete s.remoteStreams[e])
	}, s.enableAudio = function (e, t) {
		return n({
			command: "enableAudio",
			streamID: e.getId()
		}, function (e) {
			var n = e.msg;
			t && AgoraCall(t, n.code === !0)
		}, t), !0
	}, s.disableAudio = function (e, t) {
		return n({
			command: "disableAudio",
			streamID: e.getId()
		}, function (e) {
			var n = e.msg;
			t && AgoraCall(t, n.code === !0)
		}, t), !0
	}, s.enableVideo = function (e, t) {
		return n({
			command: "enableVideo",
			streamID: e.getId()
		}, function (e) {
			var n = e.msg;
			t && AgoraCall(t, n.code === !0)
		}, t), !0
	}, s.disableVideo = function (e, t) {
		return n({
			command: "disableVideo",
			streamID: e.getId()
		}, function (e) {
			var n = e.msg;
			t && AgoraCall(t, n.code === !0)
		}, t), !0
	}, s.getDevices = function (e) {
		n({
			command: "getDevices"
		}, function (t) {
			var n = t.msg.devices;
			AgoraCall(e, n)
		}, e), s.signal.on("getDevices")
	}, s.selectDevice = function (e, t) {
		n({
			command: "selectDevice",
			device: e
		}, function (e) {
			console.log(e)
		}, t)
	}, s.startRecording = function (e, t, r) {
		n({
			command: "startRecording",
			recordingKey: e
		}, function (e) {
			var n = e.msg;
			n.code === !0 ? AgoraCall(t, n) : AgoraCall(r, n)
		}, r)
	}, s.stopRecording = function (e, t, r) {
		n({
			command: "stopRecording",
			recordingKey: e
		}, function (e) {
			var n = e.msg;
			n.code === !0 ? AgoraCall(t, n) : AgoraCall(r, n)
		}, r)
	}, s.queryRecordingStatus = function (e) {
		n({
			command: "queryRecordingStatus"
		}, function (t) {
			e(t.msg)
		}, e)
	}, s.close = function () {
		c(), s.signal && (s.signal.close(), s.signal = void 0)
	}, s.getVersion = function (e, t) {
		n({
			command: "getVersion"
		}, function (n) {
			var r = n.msg;
			r.code === !0 ? AgoraCall(e, r) : AgoraCall(t, r)
		}, t)
	}, s.setParameters = function (e) {
		n({
			command: "setParameters",
			parameters: JSON.stringify(e)
		})
	}, s.setEncryptionMode = function (e) {
		n({
			command: "setEncryptionMode",
			mode: e
		})
	}, s.setEncryptionSecret = function (e) {
		n({
			command: "setEncryptionSecret",
			secret: e
		})
	}, s.getWindows = function (e) {
		n({
			command: "getWindows"
		}, function (t) {
			var n = t.msg.windows;
			AgoraCall(e, n)
		}, e)
	}, s.startScreenSharing = function (e, t, r) {
		n({
			command: "startScreenSharing",
			window: e
		}, t, r)
	}, s.setScreenSharingWindow = function (e, t, r) {
		n({
			command: "setScreenSharingWindow",
			window: e
		}, t, r)
	}, s.stopScreenSharing = function (e, t) {
		n({
			command: "stopScreenSharing"
		}, e, t)
	}, s.setChannelProfile = function (e, t, r) {
		n({
			command: "setChannelProfile",
			profile: e
		}, t, r)
	}, s.setClientRole = function (e, t, r, o) {
		t || (t = ""), n({
			command: "setClientRole",
			role: e,
			key: t
		}, r, o)
	}, s.enableDualStreamMode = function (e, t, r) {
		n({
			command: "enableDualStreamMode",
			enabled: e
		}, t, r)
	}, s
}, AgoraRTC.createRtcClient = function () {
	return AgoraRTC.Client({})
}, AgoraRTC.createLiveClient = function () {
	return AgoraRTC.Client({})
}, function (e, t) {
	if ("function" == typeof define && define.amd) define([], t);
	else {
		var n = t.call(e);
		Object.keys(n).forEach(function (t) {
			e[t] = n[t]
		})
	}
} (this, function () {
	function e(e) {
		F.console && (F.console.error ? F.console.error(e) : F.console.log && F.console.log(e))
	}
	function t(e) {
		return e = e || F, e !== e.top
	}
	function n(e) {
		return '<table style="background-color: #8CE; width: 100%; height: 100%;"><tr><td align="center"><div style="display: table-cell; vertical-align: middle;"><div style="">' + e + "</div></div></td></tr></table>"
	}
	function r(e, t) {
		for (var n = ["webgl", "experimental-webgl"], r = null, o = 0; o < n.length; ++o) {
			try {
				r = e.getContext(n[o], t)
			} catch (i) { }
			if (r) break
		}
		return r
	}
	function o(e, t) {
		function o(t) {
			var r = e.parentNode;
			r && (r.innerHTML = n(t))
		}
		if (!F.WebGLRenderingContext) return o(B), null;
		var i = r(e, t);
		return i || o(W), i
	}
	function i() {
		t() && (document.body.className = "iframe")
	}
	function a(e, n, r) {
		var a = r || {};
		if (t()) {
			if (i(), !a.dontResize && a.resize !== !1) {
				var c = e.clientWidth,
					s = e.clientHeight;
				e.width = c, e.height = s
			}
		} else if (!a.noTitle && a.title !== !1) {
			var l = document.title,
				u = document.createElement("h1");
			u.innerText = l, document.body.insertBefore(u, document.body.children[0])
		}
		var d = o(e, n);
		return d
	}
	function c(t, n, r, o) {
		var i = o || e,
			a = t.createShader(r);
		t.shaderSource(a, n), t.compileShader(a);
		var c = t.getShaderParameter(a, t.COMPILE_STATUS);
		if (!c) {
			var s = t.getShaderInfoLog(a);
			return i("*** Error compiling shader '" + a + "':" + s), t.deleteShader(a), null
		}
		return a
	}
	function s(t, n, r, o, i) {
		var a = i || e,
			c = t.createProgram();
		n.forEach(function (e) {
			t.attachShader(c, e)
		}), r && obj_attrib.forEach(function (e, n) {
			t.bindAttribLocation(c, o ? o[n] : n, e)
		}), t.linkProgram(c);
		var s = t.getProgramParameter(c, t.LINK_STATUS);
		if (!s) {
			var l = t.getProgramInfoLog(c);
			return a("Error in program linking:" + l), t.deleteProgram(c), null
		}
		return c
	}
	function l(e, t, n, r) {
		var o, i = "",
			a = document.getElementById(t);
		if (!a) throw "*** Error: unknown script element" + t;
		if (i = a.text, !n) if ("x-shader/x-vertex" === a.type) o = e.VERTEX_SHADER;
		else if ("x-shader/x-fragment" === a.type) o = e.FRAGMENT_SHADER;
		else if (o !== e.VERTEX_SHADER && o !== e.FRAGMENT_SHADER) throw "*** Error: unknown shader type";
		return c(e, i, n ? n : o, r)
	}
	function u(e, t, n, r, o) {
		for (var i = [], a = 0; a < t.length; ++a) i.push(l(e, t[a], e[V[a]], o));
		return s(e, i, n, r, o)
	}
	function d(e, t, n, r, o) {
		for (var i = [], a = 0; a < t.length; ++a) i.push(c(e, t[a], e[V[a]], o));
		return s(e, i, n, r, o)
	}
	function f(e, t) {
		return t === e.SAMPLER_2D ? e.TEXTURE_2D : t === e.SAMPLER_CUBE ? e.TEXTURE_CUBE_MAP : void 0
	}
	function g(e, t) {
		function n(t, n) {
			var o = e.getUniformLocation(t, n.name),
				i = n.type,
				a = n.size > 1 && "[0]" === n.name.substr(-3);
			if (i === e.FLOAT && a) return function (t) {
				e.uniform1fv(o, t)
			};
			if (i === e.FLOAT) return function (t) {
				e.uniform1f(o, t)
			};
			if (i === e.FLOAT_VEC2) return function (t) {
				e.uniform2fv(o, t)
			};
			if (i === e.FLOAT_VEC3) return function (t) {
				e.uniform3fv(o, t)
			};
			if (i === e.FLOAT_VEC4) return function (t) {
				e.uniform4fv(o, t)
			};
			if (i === e.INT && a) return function (t) {
				e.uniform1iv(o, t)
			};
			if (i === e.INT) return function (t) {
				e.uniform1i(o, t)
			};
			if (i === e.INT_VEC2) return function (t) {
				e.uniform2iv(o, t)
			};
			if (i === e.INT_VEC3) return function (t) {
				e.uniform3iv(o, t)
			};
			if (i === e.INT_VEC4) return function (t) {
				e.uniform4iv(o, t)
			};
			if (i === e.BOOL) return function (t) {
				e.uniform1iv(o, t)
			};
			if (i === e.BOOL_VEC2) return function (t) {
				e.uniform2iv(o, t)
			};
			if (i === e.BOOL_VEC3) return function (t) {
				e.uniform3iv(o, t)
			};
			if (i === e.BOOL_VEC4) return function (t) {
				e.uniform4iv(o, t)
			};
			if (i === e.FLOAT_MAT2) return function (t) {
				e.uniformMatrix2fv(o, !1, t)
			};
			if (i === e.FLOAT_MAT3) return function (t) {
				e.uniformMatrix3fv(o, !1, t)
			};
			if (i === e.FLOAT_MAT4) return function (t) {
				e.uniformMatrix4fv(o, !1, t)
			};
			if ((i === e.SAMPLER_2D || i === e.SAMPLER_CUBE) && a) {
				for (var c = [], s = 0; s < info.size; ++s) c.push(r++);
				return function (t, n) {
					return function (r) {
						e.uniform1iv(o, n), r.forEach(function (r, o) {
							e.activeTexture(e.TEXTURE0 + n[o]), e.bindTexture(t, r)
						})
					}
				} (f(e, i), c)
			}
			if (i === e.SAMPLER_2D || i === e.SAMPLER_CUBE) return function (t, n) {
				return function (r) {
					e.uniform1i(o, n), e.activeTexture(e.TEXTURE0 + n), e.bindTexture(t, r)
				}
			} (f(e, i), r++);
			throw "unknown type: 0x" + i.toString(16)
		}
		for (var r = 0, o = {}, i = e.getProgramParameter(t, e.ACTIVE_UNIFORMS), a = 0; a < i; ++a) {
			var c = e.getActiveUniform(t, a);
			if (!c) break;
			var s = c.name;
			"[0]" === s.substr(-3) && (s = s.substr(0, s.length - 3));
			var l = n(t, c);
			o[s] = l
		}
		return o
	}
	function m(e, t) {
		Object.keys(t).forEach(function (n) {
			var r = e[n];
			r && r(t[n])
		})
	}
	function v(e, t) {
		function n(t) {
			return function (n) {
				e.bindBuffer(e.ARRAY_BUFFER, n.buffer), e.enableVertexAttribArray(t), e.vertexAttribPointer(t, n.numComponents || n.size, n.type || e.FLOAT, n.normalize || !1, n.stride || 0, n.offset || 0)
			}
		}
		for (var r = {}, o = e.getProgramParameter(t, e.ACTIVE_ATTRIBUTES), i = 0; i < o; ++i) {
			var a = e.getActiveAttrib(t, i);
			if (!a) break;
			var c = e.getAttribLocation(t, a.name);
			r[a.name] = n(c)
		}
		return r
	}
	function E(e, t) {
		Object.keys(t).forEach(function (n) {
			var r = e[n];
			r && r(t[n])
		})
	}
	function A(e, t, n, r, o) {
		t = t.map(function (e) {
			var t = document.getElementById(e);
			return t ? t.text : e
		});
		var i = d(e, t, n, r, o);
		if (!i) return null;
		var a = g(e, i),
			c = v(e, i);
		return {
			program: i,
			uniformSetters: a,
			attribSetters: c
		}
	}
	function h(e, t, n) {
		E(t, n.attribs), n.indices && e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, n.indices)
	}
	function T(e, t) {
		for (var n = 0; n < H.length; ++n) {
			var r = H[n] + t,
				o = e.getExtension(r);
			if (o) return o
		}
	}
	function p(e, t) {
		t = t || 1;
		var n = e.clientWidth * t,
			r = e.clientHeight * t;
		return (e.width !== n || e.height !== r) && (e.width = n, e.height = r, !0)
	}
	function R(e, t) {
		var n = 0;
		return e.push = function () {
			for (var t = 0; t < arguments.length; ++t) {
				var r = arguments[t];
				if (r instanceof Array || r.buffer && r.buffer instanceof ArrayBuffer) for (var o = 0; o < r.length; ++o) e[n++] = r[o];
				else e[n++] = r
			}
		}, e.reset = function (e) {
			n = e || 0
		}, e.numComponents = t, Object.defineProperty(e, "numElements", {
			get: function () {
				return this.length / this.numComponents | 0
			}
		}), e
	}
	function _(e, t, n) {
		var r = n || Float32Array;
		return R(new r(e * t), e)
	}
	function C(e, t, n, r) {
		n = n || e.ARRAY_BUFFER;
		var o = e.createBuffer();
		return e.bindBuffer(n, o), e.bufferData(n, t, r || e.STATIC_DRAW), o
	}
	function y(e) {
		return "indices" !== e
	}
	function b(e) {
		var t = {};
		return Object.keys(e).filter(y).forEach(function (e) {
			t["a_" + e] = e
		}), t
	}
	function P(e, t) {
		if (t instanceof Int8Array) return e.BYTE;
		if (t instanceof Uint8Array) return e.UNSIGNED_BYTE;
		if (t instanceof Int16Array) return e.SHORT;
		if (t instanceof Uint16Array) return e.UNSIGNED_SHORT;
		if (t instanceof Int32Array) return e.INT;
		if (t instanceof Uint32Array) return e.UNSIGNED_INT;
		if (t instanceof Float32Array) return e.FLOAT;
		throw "unsupported typed array type"
	}
	function S(e) {
		return e instanceof Int8Array || e instanceof Uint8Array
	}
	function I(e) {
		return e.buffer && e.buffer instanceof ArrayBuffer
	}
	function U(e, t) {
		var n;
		if (n = e.indexOf("coord") >= 0 ? 2 : e.indexOf("color") >= 0 ? 4 : 3, t % n > 0) throw "can not guess numComponents. You should specify it.";
		return n
	}
	function L(e, t) {
		if (I(e)) return e;
		Array.isArray(e) && (e = {
			data: e
		}), e.numComponents || (e.numComponents = U(t, e.length));
		var n = e.type;
		n || "indices" === t && (n = Uint16Array);
		var r = _(e.numComponents, e.data.length / e.numComponents | 0, n);
		return r.push(e.data), r
	}
	function N(e, t, n) {
		var r = n || b(t),
			o = {};
		return Object.keys(r).forEach(function (n) {
			var i = r[n],
				a = L(t[i], i);
			o[n] = {
				buffer: C(e, a),
				numComponents: a.numComponents || U(i),
				type: P(e, a),
				normalize: S(a)
			}
		}), o
	}
	function O(e) {
		var t = Object.keys(e)[0],
			n = e[t];
		return I(n) ? n.numElements : n.data.length / n.numComponents
	}
	function D(e, t, n) {
		var r = {
			attribs: N(e, t, n)
		},
			o = t.indices;
		return o ? (o = L(o, "indices"), r.indices = C(e, o, e.ELEMENT_ARRAY_BUFFER), r.numElements = o.length) : r.numElements = O(t), r
	}
	function w(e, t) {
		var n = {};
		return Object.keys(t).forEach(function (r) {
			var o = "indices" === r ? e.ELEMENT_ARRAY_BUFFER : e.ARRAY_BUFFER,
				i = L(t[r], name);
			n[r] = C(e, i, o)
		}), t.indices ? n.numElements = t.indices.length : t.position && (n.numElements = t.position.length / 3), n
	}
	function x(e, t, n, r, o) {
		var i = n.indices,
			a = void 0 === r ? n.numElements : r;
		o = void 0 === o ? o : 0, i ? e.drawElements(t, a, e.UNSIGNED_SHORT, o) : e.drawArrays(t, o, a)
	}
	function M(e, t) {
		var n = null,
			r = null;
		t.forEach(function (t) {
			var o = t.programInfo,
				i = t.bufferInfo,
				a = !1;
			o !== n && (n = o, e.useProgram(o.program), a = !0), (a || i !== r) && (r = i, h(e, o.attribSetters, i)), m(o.uniformSetters, t.uniforms), x(e, e.TRIANGLES, i)
		})
	}
	var F = this,
		B = 'This page requires a browser that supports WebGL.<br/><a href="http://get.webgl.org">Click here to upgrade your browser.</a>',
		W = 'It doesn\'t appear your computer can support WebGL.<br/><a href="http://get.webgl.org/troubleshooting/">Click here for more information.</a>',
		V = ["VERTEX_SHADER", "FRAGMENT_SHADER"],
		H = ["", "MOZ_", "OP_", "WEBKIT_"];
	return {
		createAugmentedTypedArray: _,
		createAttribsFromArrays: N,
		createBuffersFromArrays: w,
		createBufferInfoFromArrays: D,
		createAttributeSetters: v,
		createProgram: s,
		createProgramFromScripts: u,
		createProgramFromSources: d,
		createProgramInfo: A,
		createUniformSetters: g,
		drawBufferInfo: x,
		drawObjectList: M,
		getWebGLContext: a,
		updateCSSIfInIFrame: i,
		getExtensionWithKnownPrefixes: T,
		resizeCanvasToDisplaySize: p,
		setAttributes: E,
		setBuffersAndAttributes: h,
		setUniforms: m,
		setupWebGL: o
	}
});