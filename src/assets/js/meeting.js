window.LoadVideo = function () {
    // function ShowDialog(url) {
    //                          var iWidth=300; //窗口宽度
    //                         var iHeight=200;//窗口高度
    //                         var iTop=(window.screen.height-iHeight)/2;
    //                         var iLeft=(window.screen.width-iWidth)/2;
    //         window.open(url,"Detail","Scrollbars=no,Toolbar=no,Location=no,Direction=no,Resizeable=no,
    //         Width="+iWidth+" ,Height="+iHeight+",top="+iTop+",left="+iLeft);
    //     }
    $(function () {
        var resolution = Cookies.get("resolution") || "480p",
            maxFrameRate = Number(Cookies.get("maxFrameRate") || 15),
            //maxBitRate        = Number(Cookies.get("maxBitRate") || 750),
            channel = Cookies.get("roomName"),
            key = Cookies.get("vendorKey"),
            remoteStreamList = [],
            client = AgoraRTC.createRtcClient(),
            disableAudio = false,
            disableVideo = false,
            hideLocalStream = false,
            fullscreenEnabled = false,
            recordingServiceUrl = 'https://recordtest.agorabeckon.com:9002/agora/recording/genToken?channelname=' + channel,
            recording = false,
            uid,
            localStream,
            queryRecordingHandler,
            lastLocalStreamId,
            isMixed = false,
            isShared = false,
            displayShareList = false,
            isShowShareList = false;
        // alert("channel:"+channel+"\t key:"+key)
        var secret = Cookies.get("secretKey"),
            type = Cookies.get("encryptionType"),
            mode = Cookies.get("mode");

        if (!key) {
            $.alert("No vendor key specified.");
            return;
        }


        /* Joining channel */
        (function initAgoraRTC() {
            client.init(key, function (obj) {
                console.log("AgoraRTC client initialized");

                if (secret) {
                    client.setEncryptionSecret(secret);
                }
                if (mode) {
                    client.setChannelProfile(mode, function () {
                        console.log('setChannelProfile is success');
                    }, function () {
                        console.log('setChannelProfile is faild');
                    });
                }
                try {
                    client.setEncryptionMode(type);
                } catch (err) {
                    console.log(err);
                }

                client.join(key, channel, 0, function (uid) {
                    console.log("User " + uid + " join channel successfully");
                    console.log("Timestamp: " + Date.now());
                    localStream = initLocalStream(uid);
                    lastLocalStreamId = localStream.getId();
                    console.log("lastLocalStreamId:" + lastLocalStreamId);
                });

                // alert(0);
                client.getDevices(function (devices) {
                    // alert(1);
                    var devLength = devices.length;
                    console.log("zq");
                    console.log(devices);
                });
                // alert(2);
            }, function (err) {
                console.log(err);
                if (err) {
                    switch (err.reason) {
                        case 'CLOSE_BEFORE_OPEN':
                            var message = '<div class="alertinfo" style="background:#fff;color:#000;">使用语音/视频功能，你需要运行该媒体代理<ul><li> 如果您没有安装，请访问网址 <a style="font-weight:bold;" href="' + err.agentInstallUrl + '">AgoraWebAgent</a>安装它。如果遇到问题，请参阅 <a style="font-weight:bold;" href="' + err.agentInstallGuideUrl + '">安装指南。</a></li><li>如果您已经安装它，请双击图标来运行此应用程序。</li><li>如果已运行，请检查Internet连接是否工作。</li></ul></div>';
                            $.alert(message);
                            break;
                        case 'ALREADY_IN_USE':
                            $.alert(" 该视频通话已经运行在另一个AgoraWebAgent.exe中,请退出AgoraWebAgent.exe重登  ");  //Agora Video Call is running on another tab already.

                            break;
                        case "INVALID_CHANNEL_NAME":
                            $.alert("中文:无效的频道名 ,汉子字符不允许为频道名称 ");  //英文:Invalid channel name, Chinese characters are not allowed in channel name.
                            break;
                    }
                }
            });
        }());

        subscribeStreamEvents();  //流事件  视频流 client.on()
        subscribeMouseClickEvents(); //所有的鼠标点击
        subscribeMouseHoverEvents(); //所有鼠标悬浮
        // subscribeWindowResizeEvent(); //调整window大小
        $("#room-name-meeting").html(channel);  //显示房间的编号
        attachExitFullscreenEvent();
        selectdevice();
        function selectdevice() {

        }
        client.getDevices(function (devices) {
            // alert("*******zhangqinag**********");
            console.log("-------cdcdcdcdc----------");
            localStorage.setItem("ceshi", JSON.stringify(devices));
            let str = ""
            // for(let i=0;i<devices.length;i++){
            //     str+="<div>1111</div>"
            // }
            // console.log($('.divice'));
            // $('template .divice').html("<div>1111</div>");
            console.log(devices);
        }, function (err) {
            alert(err);
            $('.foot-box .divice').append("<div>1231231</div>");

            console.log("------234444444444444444444444-cdcdcdcdc----------");
        })
        // Initialize and display stream end

        // Utility functions definition
        function generateVideoProfile(resolution, frameRate) {
            var result = "480P_2";
            switch (resolution) {
                case '120p':
                    result = "120P";
                    break;
                case '240p':
                    result = "240P";
                    break;
                case '360p':
                    result = "360P";
                    break;
                case '480p':
                    if (frameRate === 15) {
                        result = "480P";
                    } else {
                        result = "480P_2";
                    }
                    break;
                case '720p':
                    if (frameRate === 15) {
                        result = "720P";
                    } else {
                        result = "720P_2";
                    }
                    break;
                case '1080p':
                    if (frameRate === 15) {
                        result = "1080P";
                    } else {
                        result = "1080P_2";
                    }
                    break;
                default:
                    // 480p, 30
                    // Do nothing
                    break;
            }
            return result;
        }

        function attachExitFullscreenEvent() {
            if (document.addEventListener) {
                document.addEventListener('webkitfullscreenchange', exitHandler, false);
                document.addEventListener('mozfullscreenchange', exitHandler, false);
                document.addEventListener('fullscreenchange', exitHandler, false);
                document.addEventListener('MSFullscreenChange', exitHandler, false);
            }

            function exitHandler() {
                if (document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement !== null) {
                    /* Run code on exit */
                    if (screenfull.enabled) {
                        fullscreenEnabled = screenfull.isFullscreen;
                    }
                }
            }
        }

        function initLocalStream(id, callback) {
            var videoProfile = generateVideoProfile(resolution, maxFrameRate);
            uid = id;
            if (localStream) {
                // local stream exist already
                client.unpublish(localStream, function (err) {
                    console.log("Unpublish failed with error: ", err);
                });
                localStream.close();
            }
            localStream = AgoraRTC.createStream({
                streamID: uid,
                audio: true,
                video: true,
                screen: false,
                local: true
            });
            //localStream.setVideoResolution(resolution);
            //localStream.setVideoFrameRate([maxFrameRate, maxFrameRate]);
            //localStream.setVideoBitRate([maxBitRate, maxBitRate]);
            localStream.setVideoProfile(videoProfile);

            localStream.init(function () {
                console.log("Get UserMedia successfully");
                console.log(localStream);

                var size = calculateVideoSize();
                if (remoteStreamList.length === 0) {
                    // alert('qqqqqqqq');
                    removeStream_liud("otherView");
                    displayStream_liud('agora-local', localStream, 'list-group-item', 'otherView', 'video-container-multiple');
                } else if (remoteStreamList.length === 1) {
                    $("div[id^='agora-local']").remove();
                    displayStream('agora-local', localStream, 160, 120, 'local-partner-video', 'otherView');
                } else if (remoteStreamList.length === 3) {
                    // TODO FIXME
                }

                toggleFullscreenButton(false);
                toggleExpensionButton(false);
                client.publish(localStream, function (err) {
                    console.log("Timestamp: " + Date.now());
                    console.log("Publish local stream error: " + err);
                });
                client.on('stream-published');

                // workaround to remove bottom bar
                $("div[id^='bar_']").remove();

            }, function (err) {
                console.log("Local stream init failed.", err);
                displayInfo("Please check camera or audio devices on your computer, then try again.");
                $(".info").append("<div class='back'><a href='index.html'>Back</a></div>");
            });
            return localStream;
        }

        //信息显示页面
        function displayInfo(info) {
            $(".info").append("<p>" + info + "</p>")
        };

        //全局设置
        (function (global) {
            'use strict';
            // existing version for noConflict()
            var _Base64 = global.Base64;
            var version = "2.1.9";
            // if node.js, we use Buffer
            var buffer;
            if (typeof module !== 'undefined' && module.exports) {
                try {
                    buffer = require('buffer').Buffer;
                } catch (err) { }
            }
            // constants
            var b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
            var b64tab = function (bin) {
                var t = {};
                for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
                return t;
            }(b64chars);
            var fromCharCode = String.fromCharCode;
            // encoder stuff
            var cb_utob = function (c) {
                if (c.length < 2) {
                    var cc = c.charCodeAt(0);
                    return cc < 0x80 ? c : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6)) + fromCharCode(0x80 | (cc & 0x3f))) : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f)) + fromCharCode(0x80 | ((cc >>> 6) & 0x3f)) + fromCharCode(0x80 | (cc & 0x3f)));
                } else {
                    var cc = 0x10000 + (c.charCodeAt(0) - 0xD800) * 0x400 + (c.charCodeAt(1) - 0xDC00);
                    return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07)) + fromCharCode(0x80 | ((cc >>> 12) & 0x3f)) + fromCharCode(0x80 | ((cc >>> 6) & 0x3f)) + fromCharCode(0x80 | (cc & 0x3f)));
                }
            };
            var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
            var utob = function (u) {
                return u.replace(re_utob, cb_utob);
            };
            var cb_encode = function (ccc) {
                var padlen = [0, 2, 1][ccc.length % 3],
                    ord = ccc.charCodeAt(0) << 16 | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8) | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
                    chars = [
                        b64chars.charAt(ord >>> 18),
                        b64chars.charAt((ord >>> 12) & 63),
                        padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
                        padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
                    ];
                return chars.join('');
            };
            var btoa = global.btoa ? function (b) {
                return global.btoa(b);
            } : function (b) {
                return b.replace(/[\s\S]{1,3}/g, cb_encode);
            };
            var _encode = buffer ? function (u) {
                return (u.constructor === buffer.constructor ? u : new buffer(u))
                    .toString('base64')
            } : function (u) {
                return btoa(utob(u))
            };
            var encode = function (u, urisafe) {
                return !urisafe ? _encode(String(u)) : _encode(String(u)).replace(/[+\/]/g, function (m0) {
                    return m0 == '+' ? '-' : '_';
                }).replace(/=/g, '');
            };
            var encodeURI = function (u) {
                return encode(u, true)
            };
            // decoder stuff
            var re_btou = new RegExp([
                '[\xC0-\xDF][\x80-\xBF]',
                '[\xE0-\xEF][\x80-\xBF]{2}',
                '[\xF0-\xF7][\x80-\xBF]{3}'
            ].join('|'), 'g');
            var cb_btou = function (cccc) {
                switch (cccc.length) {
                    case 4:
                        var cp = ((0x07 & cccc.charCodeAt(0)) << 18) | ((0x3f & cccc.charCodeAt(1)) << 12) | ((0x3f & cccc.charCodeAt(2)) << 6) | (0x3f & cccc.charCodeAt(3)),
                            offset = cp - 0x10000;
                        return (fromCharCode((offset >>> 10) + 0xD800) + fromCharCode((offset & 0x3FF) + 0xDC00));
                    case 3:
                        return fromCharCode(
                            ((0x0f & cccc.charCodeAt(0)) << 12) | ((0x3f & cccc.charCodeAt(1)) << 6) | (0x3f & cccc.charCodeAt(2))
                        );
                    default:
                        return fromCharCode(
                            ((0x1f & cccc.charCodeAt(0)) << 6) | (0x3f & cccc.charCodeAt(1))
                        );
                }
            };
            var btou = function (b) {
                return b.replace(re_btou, cb_btou);
            };
            var cb_decode = function (cccc) {
                var len = cccc.length,
                    padlen = len % 4,
                    n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0) | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0) | (len > 2 ? b64tab[cccc.charAt(2)] << 6 : 0) | (len > 3 ? b64tab[cccc.charAt(3)] : 0),
                    chars = [
                        fromCharCode(n >>> 16),
                        fromCharCode((n >>> 8) & 0xff),
                        fromCharCode(n & 0xff)
                    ];
                chars.length -= [0, 0, 2, 1][padlen];
                return chars.join('');
            };
            var atob = global.atob ? function (a) {
                return global.atob(a);
            } : function (a) {
                return a.replace(/[\s\S]{1,4}/g, cb_decode);
            };
            var _decode = buffer ? function (a) {
                return (a.constructor === buffer.constructor ? a : new buffer(a, 'base64')).toString();
            } : function (a) {
                return btou(atob(a))
            };
            var decode = function (a) {
                return _decode(
                    String(a).replace(/[-_]/g, function (m0) {
                        return m0 == '-' ? '+' : '/'
                    })
                        .replace(/[^A-Za-z0-9\+\/]/g, '')
                );
            };
            var noConflict = function () {
                var Base64 = global.Base64;
                global.Base64 = _Base64;
                return Base64;
            };
            // export Base64
            global.Base64 = {
                VERSION: version,
                atob: atob,
                btoa: btoa,
                fromBase64: decode,
                toBase64: encode,
                utob: utob,
                encode: encode,
                encodeURI: encodeURI,
                btou: btou,
                decode: decode,
                noConflict: noConflict
            };
            // if ES5 is available, make Base64.extendString() available
            if (typeof Object.defineProperty === 'function') {
                var noEnum = function (v) {
                    return { value: v, enumerable: false, writable: true, configurable: true };
                };
                global.Base64.extendString = function () {
                    Object.defineProperty(
                        String.prototype, 'fromBase64', noEnum(function () {
                            return decode(this)
                        }));
                    Object.defineProperty(
                        String.prototype, 'toBase64', noEnum(function (urisafe) {
                            return encode(this, urisafe)
                        }));
                    Object.defineProperty(
                        String.prototype, 'toBase64URI', noEnum(function () {
                            return encode(this, true)
                        }));
                };
            }
            // that's it!
            if (global['Meteor']) {
                Base64 = global.Base64; // for normal export in Meteor.js
            }
        })(window);


        //从视频列表中移除视频
        function removeStreamFromList(id) {
            var index, tmp;
            for (index = 0; index < remoteStreamList.length; index += 1) {
                var tmp = remoteStreamList[index];
                if (tmp.id === id) {
                    var toRemove = remoteStreamList.splice(index, 1);
                    if (toRemove.length === 1) {
                        //delete toRemove[1];
                        console.log("stream stopping..." + toRemove[0].stream.getId());
                        toRemove[0].stream.stop();
                        return true;
                    }
                }
            }
            return false;
        }

        //移除流
        //        function removeStream(tagId, streamId) {
        //            var streamDiv = $("#" + tagId + streamId);
        //            if (streamDiv && streamDiv.length > 0) {
        //                streamDiv.remove();
        //            }
        //        }

        function removeStream_liud(idName) {
            var streamDiv = $("#" + idName);
            if (streamDiv && streamDiv.length > 0) {
                streamDiv.remove();
            }
        }

        //将远程视频流添加视频流列表
        function addToRemoteStreamList(stream, videoEnabled, audioEnabled) {
            if (stream) {
                remoteStreamList.push({
                    id: stream.getId(),
                    stream: stream,
                    videoEnabled: videoEnabled,
                    audioEnabled: audioEnabled
                });
            }
        }

        //溢出已经存在的元素
        //        function removeElementIfExist(tagId, uid) {
        //            $("#" + tagId + uid).remove();
        //        }

        function removeElementIfExist(idName) {
            // alert("开始移除div");
            // alert("移開視頻div:"+idName);
            $("#" + idName).remove();
            //   alert("移除成功");
        }

        //显示视频流,当一个远程视频已经被订阅的时候调用这个方法显示
        function displayStream(tagId, stream, width, height, className, parentNodeId) {
            // cleanup, if network connection interrupted, user cannot receive any events.
            // after reconnecting, the same node id is reused,
            // so remove html node with same id if exist.

            removeElementIfExist(tagId, stream.getId());

            var $container;
            if (parentNodeId) {
                $container = $("#" + parentNodeId);
            } else {
                $container = $("#video-container-multiple");
            }

            // mixed mode
            if (isMixed) {
                width = 192;
                height = 120;
                className = 'video-item';
            } else {
                className += ' video-item';
            }

            var styleStr = 'width:' + width + 'px; height:' + height + 'px;';

            if (className.indexOf('local-partner-video') > -1) {
                var videoWidth = $('#wrapper').height() * 4 / 3;
                var right = (1200 - videoWidth) / 2 + 12;

                styleStr += 'top:12px; right:' + right + 'px;';
            }

            $container.append('<div id="' + tagId + stream.getId() + '" class="' + className + '" data-stream-id="' + stream.getId() + '" style="' + styleStr + '"></div>');

            // $("#" + tagId + stream.getId()).css();
            stream.play(tagId + stream.getId());

        }

        //显示视频流,当一个远程视频已经被订阅的时候调用这个方法显示
        // displayStream_liud('agora-local', localStream,'list-group-item', 'other1View','video-container-multiple');
        function displayStream_liud(tagId, stream, className, idName, parentNodeId) {
            // cleanup, if network connection interrupted, user cannot receive any events.
            // after reconnecting, the same node id is reused,
            // so remove html node with same id if exist.
            var idNameStr = idName + stream.getId();
            var videoDiv = document.getElementById(idNameStr);
            // alert("displayStream_liud:"+videoDiv);
            if (videoDiv) {
                // alert("移除的視頻流"+stream.getId());
                removeElementIfExist(idNameStr);
            }
            var $container = $("#" + parentNodeId);
            // 视频的样式


            // var styleStr = 'width:400px !important; height:300px !important;display:inline-block !important';
            $container.append('<li id="' + idNameStr + '" class="' + className + '" data-stream-id="' + stream.getId() + '"></li>');
            // alert("zhang"+videoDiv);


            stream.play(idNameStr);

            replaceLI();
        }

        function replaceLI() {
            // 初始化第一个li
            let $firstli = $('#video-container-multiple  li:first');
            $firstli.addClass('videoActive');
            console.log($firstli);
            $('#video-container-multiple li ').not('#video-container-multiple li.videoActive').css({
                width: '204px',
                height: '136px'
            })
            $('#video-container-multiple li div canvas').css({
                width: "100%",
                height: "100%"
            })
            console.log($firstli);
            $('#video-container-multiple').on('click', 'li', function () {
                let cl = $(this).attr('class').indexOf('videoActive');
                $(this).addClass('videoActive').siblings().removeClass('videoActive');
                $canvas = $(this).children('div').children('canvas')
                // $canvasWidth = $canvas.css('width');
                // let a = $(this).hasClass('activeVideo');
                // console.log(a);
                if ($(this).hasClass('videoActive')) {
                    $canvas.css({
                        width: '100%',
                        height: '100%'
                    });
                }
                $('#video-container-multiple li ').not('#video-container-multiple li.videoActive ').css({
                    width: '204px',
                    height: '136px'
                })
                $('#video-container-multiple li div canvas').not('#video-container-multiple li.videoActive div canvas').css({
                    width: '100%',
                    height: '100%'
                })
            })

        }
        //暂时无用
        function addPlaceholderDiv(parentNodeId, width, height) {
            var placehoder = $("#placeholder-div");
            if (placehoder.length === 0 && !isMixed) {
                $("#" + parentNodeId).append("<div id='placeholder-div' style='width:" + width + "px;height:" + height + "px' class='col-sm-6 remote-partner-video-multiple'></div>");
            }
        }

        //在 显示视频的最外层div上动态添加两个div 用户显示视频位置的规则
        function addNewRows(parentNodeId) {
            var row1 = $("#video-row1"),
                row2 = $("#video-row2");
            if (row1 && row1.length === 0) {
                $("#" + parentNodeId).append("<div id='video-row1' class='row'></div>");
            }

            if (row2 && row2.length === 0) {
                $("#" + parentNodeId).append("<div id='video-row2' class='row'></div>");
            }
        }

        //显示按钮用的
        function toggleFullscreenButton(show, parent) {
            if (parent) {
                $(parent + " .fullscreen-button").parent().toggle(show);
                $(parent + " .fullscreen-button, " + parent + " .fullscreen-button>img").toggle(show);
            } else {
                $("#video-container .fullscreen-button").parent().toggle(show);
                $("#video-container .fullscreen-button, #video-container .fullscreen-button>img").toggle(show);
            }
        }
        //显示按钮用的
        function toggleExpensionButton(show, parent) {
            if (parent) {
                $(parent + " .expension-button").parent().toggle(show);
                $(parent + " .expension-button, " + parent + " .expension-button>img").toggle(show);
            } else {
                // var reference = $('.local-partner-video')
                //     top = '0px',
                //     rigjt = '0px';

                // if(reference[0]){
                //     var top = reference.css('top');
                //     var right = reference.css('right');
                // }
                //显示或隐藏被选元素  true:显示  false:隐藏
                $("#video-container .expension-button")
                    .parent()
                    // .css({
                    //     'position' : 'absolute',
                    //     'top' : top,
                    //     'right' : right,
                    //     'zIndex': 10
                    // })
                    .toggle(show);
                $("#video-container .expension-button, #video-container .expension-button>img").toggle(show);
            }
        }

        function addingMuteSpeakIcon(streamId) {
            $("#agora-remote" + streamId).append("<a class='remote-mute-speak-icon' data-stream-id='" + streamId + "' href='#'><img src='images/icon_mute.png'></a>");

            $(".remote-mute-speak-icon").off("click").on("click", function (e) {
                var streamId = Number($(e.target).parent().data("stream-id"));
                var index, length, obj;
                for (index = 0, length = remoteStreamList.length; index < length; index += 1) {
                    obj = remoteStreamList[index];
                    if (obj.id === streamId) {
                        if (obj.audioEnabled) {
                            obj.stream.disableAudio();
                            obj.audioEnabled = false;
                            $(e.target).attr("src", "images/icon_speak.png");
                        } else {
                            obj.stream.enableAudio();
                            obj.audioEnabled = true;
                            $(e.target).attr("src", "images/icon_mute.png");
                        }
                    }
                }
            });
        }

        function showStreamOnPeerLeave(streamId) {
            // alert("进入视频离开方法");
            var size;
            var removed = removeStreamFromList(Number(streamId));
            if (!removed) {
                return;
            }

            // $("#otherView"+streamId)
            removeElementIfExist("otherView" + streamId);
            if (remoteStreamList.length === 0) {
                client.leave();
                // document.cookie("mysp",0);
                localStorage.setItem("mysp", 0);
                //              size = calculateVideoSize(false);
                displayStream_liud('agora-local', localStream, 'list-group-item', 'otherView', 'video-container-multiple');

                toggleFullscreenButton(false);
                toggleExpensionButton(false);
            } else if (remoteStreamList.length === 1) {
                clearAllStream();
                size = calculateVideoSize(false);
                displayStream_liud('agora-local', localStream, 'list-group-item', 'otherView', 'video-container-multiple');
                displayStream_liud('agora-remote', remoteStreamList[0].stream, 'list-group-item', 'otherView', 'video-container-multiple');
                toggleFullscreenButton(true);  //全屏的时候显示
                toggleExpensionButton(true); //扩展图标
            } else if (remoteStreamList.length === 2) {
                clearAllStream();
                // size = calculateVideoSize(true);
                displayStream_liud('agora-local', localStream, 'list-group-item', 'otherView', 'video-container-multiple');
                displayStream_liud('agora-remote', remoteStreamList[0].stream, 'list-group-item', 'otherView', 'video-container-multiple');
                displayStream_liud('agora-remote', remoteStreamList[1].stream, 'list-group-item', 'otherView', 'video-container-multiple');

                addPlaceholderDiv("video-row2", size.width, size.height);
            } else if (remoteStreamList.length === 3) {
                clearAllStream();

                displayStream_liud('agora-local', localStream, 'list-group-item', 'otherView', 'video-container-multiple');
                displayStream_liud('agora-local', remoteStreamList[0].stream, 'list-group-item', 'otherView', 'video-container-multiple');
                displayStream_liud('agora-remote', remoteStreamList[1].stream, 'list-group-item', 'otherView', 'video-container-multiple');
                displayStream_liud('agora-remote', remoteStreamList[2].stream, 'list-group-item', 'otherView', 'video-container-multiple');

                // addNewRows("video-container-multiple");
                //size = calculateVideoSize(true);

            } else if (remoteStreamList.length === 4) {
                clearAllStream();
                size = calculateVideoSize(true);
                displayStream_liud('agora-remote', remoteStreamList[0].stream, 'list-group-item', 'otherView', 'video-container-multiple');
                displayStream_liud('agora-remote', remoteStreamList[1].stream, 'list-group-item', 'otherView', 'video-container-multiple');
                displayStream_liud('agora-remote', remoteStreamList[2].stream, 'list-group-item', 'otherView', 'video-container-multiple');
                displayStream_liud('agora-remote', remoteStreamList[3].stream, 'list-group-item', 'otherView', 'video-container-multiple');
                remoteStreamList[3].stream.enableVideo();

            } else {
                //removeStream('agora-remote', streamId);
                removeStream_liud("other1View");
            }

            // workaround to remove bottom bar
            $("div[id^='bar_']").remove();
        }
        //张强---
        function showStreamOnPeerAdded(stream) {
            // alert("进入视频新增方法");
            var size;

            if (remoteStreamList.length === 0) {
                // alert('asdasdasd')
                clearAllStream();
                //size = calculateVideoSize(false);
                displayStream_liud('agora-local', localStream, 'list-group-item', 'otherView', 'video-container-multiple');
                displayStream_liud('agora-remote', stream, 'list-group-item', 'otherView', 'video-container-multiple');
                var x = document.getElementById("otherView" + stream.getId);
                // alert("本地视频Div:"+x);
                var x1 = document.getElementById("otherView" + localStream.getId);
                // alert("远程视频所在Div:"+x1);

                toggleFullscreenButton(true);
                toggleExpensionButton(true);
            } else if (remoteStreamList.length === 1) {
                clearAllStream();
                // alert("remoteStreamList.lenght===1");
                displayStream_liud('agora-local', localStream, 'list-group-item', 'otherView', 'video-container-multiple');
                displayStream_liud('agora-remote', stream, 'list-group-item', 'otherView', 'video-container-multiple');
                displayStream_liud('agora-remote', remoteStreamList[0].stream, 'list-group-item', 'otherView', 'video-container-multiple');
                var x = document.getElementById("other1View");
                // alert("本地视频Div:"+x);
                var x1 = document.getElementById("other2View");
                // alert("远程视频1所在Div:"+x1);
                var x2 = document.getElementById("other3View");
                // alert("远程视频2所在Div:"+x2);

                addPlaceholderDiv("video-row2", 200, 200);
                toggleFullscreenButton(false);
                toggleExpensionButton(false);
            } else if (remoteStreamList.length === 2) {
                clearAllStream();
                // alert("remoteStreamList.lenght===2");
                displayStream_liud('agora-local', localStream, 'list-group-item', 'otherView', 'video-container-multiple');
                displayStream_liud('agora-remote', stream, 'list-group-item', 'otherView', 'video-container-multiple');
                displayStream_liud('agora-remote', remoteStreamList[0].stream, 'list-group-item', 'otherView', 'video-container-multiple');
                displayStream_liud('agora-remote', remoteStreamList[1].stream, 'list-group-item', 'otherView', 'video-container-multiple');
                var x = document.getElementById("other1View");
                // alert("本地视频Div:"+x);
                var x1 = document.getElementById("other2View");
                // alert("远程视频1所在Div:"+x1);
                var x2 = document.getElementById("other3View");
                // alert("远程视频2所在Div:"+x2);
                var x3 = document.getElementById("other4View");
                // alert("远程视频2所在Div:"+x3);
            } else if (remoteStreamList.length === 3) {
                clearAllStream();
                // alert("remoteStreamList.lenght===3");
                displayStream_liud('agora-local', remoteStreamList[0].stream, 'list-group-item', 'otherView', 'video-container-multiple');
                displayStream_liud('agora-remote', remoteStreamList[1].stream, 'list-group-item', 'otherView', 'video-container-multiple');
                displayStream_liud('agora-remote', remoteStreamList[2].stream, 'list-group-item', 'otherView', 'video-container-multiple');
                displayStream_liud('agora-remote', stream, 'list-group-item', 'otherView', 'video-container-multiple');
                var x = document.getElementById("otherView");
                // alert("本地视频Div:"+x);
                var x1 = document.getElementById("otherView");
                // alert("远程视频1所在Div:"+x1);
                var x2 = document.getElementById("otherView");
                // alert("远程视频2所在Div:"+x2);
                var x3 = document.getElementById("otherView");
                // alert("远程视频2所在Div:"+x3);

            } else if (remoteStreamList.length === 4) {
                clearAllStream();


                // row 1
                displayStream("agora-remote", remoteStreamList[0].stream, 200, 200, "remote-partner-video-multiple col-sm-6", "other1View");
                displayStream("agora-remote", remoteStreamList[1].stream, 200, 200, "remote-partner-video-multiple col-sm-6", "other2View");
                // row 2
                displayStream("agora-remote", remoteStreamList[2].stream, 200, 200, "remote-partner-video-multiple col-sm-6", "other3View");
                displayStream("agora-remote", remoteStreamList[3].stream, 200, 200, "remote-partner-video-multiple col-sm-6", "other4View");

                // we only allow 4 vidwo streams to display at the same time
                createAudioContainer();
                stream.disableVideo();
                displayStream("agora-remote", stream, 0, 0, "", "audio-container");
            } else {
                stream.disableVideo();
                displayStream("agora-remote", stream, 0, 0, "", "audio-container");
            }
            // alert("addToRemoteStreamList列表开始增加1个视频");
            addToRemoteStreamList(stream, true, true);
            // alert("addToRemoteStreamList列表结束增加1个视频"+"---现在集合的大小为:" + remoteStreamList.length);
            // workaround to remove bottom bar
            $("div[id^='bar_']").remove();
        }


        function stopLocalAndRemoteStreams() {
            if (localStream) {
                localStream.stop();
            }
            var index, length;
            for (index = 0, length = remoteStreamList.length; index < length; index += 1) {
                remoteStreamList[index].stream.stop();
            }
        }

        function clearAllStream() {
            stopLocalAndRemoteStreams();
            $("#video-container-multiple").empty();
        }

        function createAudioContainer() {
            var container = $("#audio-container");
            if (container && container.length > 0) {
                return;
            }
            $("#video-container-multiple").append("<div id='audio-container' style='display: none;'></div>");
        }

        function subscribeStreamEvents() {

            //新增的视频设置视频的订阅
            client.on('stream-added', function (evt) {
                var stream = evt.stream;
                console.log("New stream added: " + stream.getId());
                console.log("Timestamp: " + Date.now());
                console.log("Subscribe ", stream);
                client.subscribe(stream, function (err) {
                    console.log("Subscribe stream failed", err);
                });
            });

            //视频离开的时候
            client.on('peer-leave', function (evt) {
                console.log("Peer has left: " + evt.uid);
                console.log("Timestamp: " + Date.now());
                console.log("视频离开的时候---peer-leave---> showStreamOnPeerLeave(evt.uid);:" + evt.uid);
                showStreamOnPeerLeave(evt.uid);
                //updateRoomInfo();
            });

            //将视频的订阅显示到div
            client.on('stream-subscribed', function (evt) {
                var stream = evt.stream;
                console.log("Got stream-subscribed event");
                console.log("Timestamp: " + Date.now());
                console.log("Subscribe remote stream successfully: " + stream.getId());
                console.log(evt);
                showStreamOnPeerAdded(stream);
                //updateRoomInfo();
            });

            client.on("stream-removed", function (evt) {
                var stream = evt.stream;
                console.log("Stream removed: " + evt.stream.getId());
                console.log("Timestamp: " + Date.now());
                console.log("流离开的时候调用showStreamOnPeerLeave(evt.stream.getId());-------:" + evt);
                showStreamOnPeerLeave(evt.stream.getId());
                //updateRoomInfo();
            });
        }

        //订阅window调整窗口大小事件
        function subscribeWindowResizeEvent() {
            var videoSize;
            $(window).resize(function (e) {
                if (fullscreenEnabled) {
                    return;
                }
                //判断值和类型是否相等
                if (remoteStreamList.length === 0 || remoteStreamList.length === 1) {
                    videoSize = calculateVideoSize(false);
                } else {
                    videoSize = calculateVideoSize(true);
                }
                resizeStreamOnPage(videoSize);
            });
        }

        //重置视频流在页面上的显示
        function resizeStreamOnPage(size) {
            if (!size) {
                return;
            }

            clearAllStream();
            var width = size.width,
                height = size.height;

            if (remoteStreamList.length === 0) {
                displayStream_liud('agora-local', localStream, 'list-group-item', 'otherView', 'video-container-multiple');
                toggleFullscreenButton(false);
                toggleExpensionButton(false);
            } else if (remoteStreamList.length === 1) {
                displayStream_liud('agora-local', localStream, 'list-group-item', 'otherView', 'video-container-multiple');
                displayStream_liud('agora-remote', remoteStreamList[0].stream, 'list-group-item', 'otherView', 'video-container-multiple');

            } else if (remoteStreamList.length === 2) {
                displayStream_liud('agora-remote', localStream, 'list-group-item', 'otherView', 'video-container-multiple');
                displayStream_liud('agora-local', remoteStreamList[0].stream, 'list-group-item', 'otherView', 'video-container-multiple');
                displayStream_liud('agora-remote', remoteStreamList[1].stream, 'list-group-item', 'otherView', 'video-container-multiple');
                addPlaceholderDiv("other4View", size.width, size.height);
                toggleFullscreenButton(false);
                toggleExpensionButton(false);
            } else if (remoteStreamList.length === 3) {
                displayStream_liud('agora-remote', localStream, 'list-group-item', 'otherView', 'video-container-multiple');
                displayStream_liud('agora-local', remoteStreamList[0].stream, 'list-group-item', 'otherView', 'video-container-multiple');
                displayStream_liud('agora-remote', remoteStreamList[1].stream, 'list-group-item', 'otherView', 'video-container-multiple');
                displayStream_liud('agora-remote', remoteStreamList[2].stream, 'list-group-item', 'otherView', 'video-container-multiple');

            } else if (remoteStreamList.length === 4) {
                displayStream_liud('agora-remote', remoteStreamList[0].stream, 'list-group-item', 'otherView', 'video-container-multiple');
                displayStream_liud('agora-local', remoteStreamList[1].stream, 'list-group-item', 'otherView', 'video-container-multiple');
                displayStream_liud('agora-remote', remoteStreamList[2].stream, 'list-group-item', 'otherView', 'video-container-multiple');
                displayStream_liud('agora-remote', remoteStreamList[3].stream, 'list-group-item', 'otherView', 'video-container-multiple');

            } else {  //仅仅只允许四个视频
                displayStream_liud('agora-remote', remoteStreamList[0].stream, 'list-group-item', 'otherView', 'video-container-multiple');
                displayStream_liud('agora-local', remoteStreamList[1].stream, 'list-group-item', 'otherView', 'video-container-multiple');
                displayStream_liud('agora-remote', remoteStreamList[2].stream, 'list-group-item', 'otherView', 'video-container-multiple');
                displayStream_liud('agora-remote', remoteStreamList[3].stream, 'list-group-item', 'otherView', 'video-container-multiple');

                // we only allow 4 video streams to display at the same time 
                createAudioContainer();
                stream.disableVideo();
                displayStream("agora-remote", stream, "list-group-item", "other1View", "audio-container");
            }

            // workaround to remove bottom bar
            $("div[id^='bar_']").remove();
        }


        //分辨率数组
        function getResolutionArray(reso) {
            switch (reso) {
                case "120p":
                    return [160, 120];
                case "240p":
                    return [320, 240];
                case "360p":
                    return [640, 360];
                case "480p":
                    return [640, 480];
                case "720p":
                    return [1280, 720];
                case "1080p":
                    return [1920, 1080];
                default:
                    return [1280, 720];
            }
        }

        //计算调整多个视频的显示位置
        function calculateVideoSize(multiple) {
            var viewportWidth = $(window).width(),  // $(window).height()当前可见区域的大小
                viewportHeight = $(window).height(),
                curResolution = getResolutionArray(resolution),  //得到分辨率
                width,
                height,
                newWidth,
                newHeight,
                ratioWindow,  //window分辨率
                ratioVideo;  //视频分辨率

            if (multiple) {
                width = viewportWidth / 2 - 50;
                height = viewportHeight / 2 - 40;
            } else {
                width = viewportWidth - 100;
                height = viewportHeight - 80;
            }
            ratioWindow = width / height;
            ratioVideo = curResolution[0] / curResolution[1];
            if (ratioVideo > ratioWindow) {
                // calculate by width
                newWidth = width;
                newHeight = width * curResolution[1] / curResolution[0];
            } else {
                // calculate by height
                newHeight = height;
                newWidth = height * curResolution[0] / curResolution[1];
            }

            newWidth = Math.max(newWidth, 160);
            newHeight = Math.max(newHeight, 120);
            return {
                width: newWidth,
                height: newHeight
            };
        }

        //订阅鼠标悬停事件
        function subscribeMouseHoverEvents() {
            //先移除hover事件再添加hover悬浮事件
            $(".record-video-button").off("hover").hover(function (e) {
                if (recording) {
                    $(e.target).attr("src", "images/btn_record_pause_touch.png");
                } else {
                    $(e.target).attr("src", "images/btn_record_touch.png");
                }
            }, function (e) {
                if (recording) {
                    $(e.target).attr("src", "images/btn_record_pause.png");
                } else {
                    $(e.target).attr("src", "images/btn_record.png");
                }
            });
            $(".mute-button").off("hover").hover(function (e) {
                if (disableAudio) {
                    $(e.target).attr("src", "images/@2x.png");
                } else {
                    $(e.target).attr("src", "images/btn_mute_touch.png");
                }
            }, function (e) {
                if (disableAudio) {
                    $(e.target).attr("src", "images/btn_mute_touch.png");
                } else {
                    $(e.target).attr("src", "images/btn_mute@2x.png");
                }
            });

            $(".switch-audio-button").off("hover").hover(function (e) {
                if (disableVideo) {
                    $(e.target).attr("src", "images/btn_video_touchpush@2x.png");
                } else {
                    $(e.target).attr("src", "images/btn_voice_touchpush@2x.png");
                }
            }, function (e) {
                if (disableVideo) {
                    $(e.target).attr("src", "images/btn_video@2x.png");
                } else {
                    $(e.target).attr("src", "images/btn_voice@2x.png");
                }
            });

            $(".fullscreen-button").off("hover").hover(function (e) {
                if (fullscreenEnabled) {
                    $(e.target).attr("src", "images/btn_maximize_blue_touchpush@2x.png");
                } else {
                    $(e.target).attr("src", "images/btn_maximize_touchpush@2x.png");
                }
            }, function (e) {
                if (screenfull.isFullscreen) {
                    $(e.target).attr("src", "images/btn_maximize_blue@2x.png");
                } else {
                    $(e.target).attr("src", "images/btn_maximize@2x.png");
                }
            });

            $(".end-call-button").off("hover").hover(function (e) {
                $(e.target).attr("src", "images/btn_endcall_touchpush@2x.png");
            }, function (e) {
                $(e.target).attr("src", "images/btn_endcall@2x.png");
            });


            $(".expension-button").off("hover").hover(function (e) {
                if (hideLocalStream) {
                    $(e.target).attr("src", "images/btn_expansion.png");
                } else {
                    $(e.target).attr("src", "images/btn_expansion_touch.png");
                }
            }, function (e) {
                if (hideLocalStream) {
                    $(e.target).attr("src", "images/btn_expansion_touch.png");
                } else {
                    $(e.target).attr("src", "images/btn_expansion.png");
                }
            });

            $(".mute-button").off("hover").hover(function (e) {
                if (disableAudio) {
                    $(e.target).attr("src", "images/btn_mute_blue_touchpush@2x.png");
                } else {
                    $(e.target).attr("src", "images/btn_mute_touchpush@2x.png");
                }
            }, function (e) {
                if (disableAudio) {
                    $(e.target).attr("src", "images/btn_mute_blue@2x.png");
                } else {
                    $(e.target).attr("src", "images/btn_mute@2x.png");
                }
            });

            $(".escreen-sharing-button").off("hover").hover(function (e) {
                if (isShared) {
                    $(e.target).attr("src", "images/btn_screen_sharing_blue_touchpush@2x.png");
                } else {
                    $(e.target).attr("src", "images/btn_screen_sharing_touchpush@2x.png");
                }
            }, function (e) {
                if (isShared) {
                    $(e.target).attr("src", "images/btn_screen_sharing_blue@2x.png");
                } else {
                    $(e.target).attr("src", "images/btn_screen_sharing@2x.png");
                }
            });

            $(".whiteboard-button").off("hover").hover(function (e) {
                if (disableAudio) {
                    $(e.target).attr("src", "images/btn_whiteboard@2x.png");
                } else {
                    $(e.target).attr("src", "images/btn_whiteboard_touchpush@2x.png");
                }
            }, function (e) {
                if (disableAudio) {
                    $(e.target).attr("src", "images/btn_whiteboard_touchpush@2x.png");
                } else {
                    $(e.target).attr("src", "images/btn_whiteboard@2x.png");
                }
            });

            $(".video-container").off("mouseover").mousemove(function (e) {
                $(".toolbar").addClass("toolbar-hover");
                if (window.mousemoveTimeoutHandler) {
                    window.clearTimeout(window.mousemoveTimeoutHandler);
                }
                window.mousemoveTimeoutHandler = setTimeout(function () {
                    $(".toolbar").removeClass("toolbar-hover");
                }, 5000);
            });

            $('.toolbar a').click(function () {
                var isShareBtn = $(this).hasClass('escreen-sharing-button');
                if (!isShareBtn && displayShareList == 'block') {
                    $('.escreen-sharing-button').trigger('click');
                }
            });

            // $(".toolbar img").off("hover").hover(function(e) {
            //     $(this).filter(':not(:animated)').animate({ width: "70px", height: "70px" });
            // }, function() {
            //     $(this).animate({ width: "50px", height: "50px" });
            // });
        }

        //订阅鼠标点击事件
        function subscribeMouseClickEvents() {
            $(".record-video-button").off('click').click(function (e) {
                // Be defensive always
                if (!client) {
                    return;
                }

                if (recording) {
                    //if (queryRecordingHandler) {
                    //clearInterval(queryRecordingHandler);
                    //queryRecordingHandler = undefined;
                    //}
                    $.get(recordingServiceUrl + "&uid=" + uid)
                        .done(function (data) {
                            console.log(data);
                            client.stopRecording(data, function (data) {
                                $(e.target).attr("src", "images/btn_record.png");
                                // toggle recording flag
                                recording = !recording;
                                console.log(data);
                            }, function (err) {
                                console.log(err);
                                $.alert("Failed to start recording, please try again or contact admin.");
                            });
                        })
                        .fail(function (err) {
                            console.log(err);
                            $.alert("Failed to get recording key, please try again.");
                        });
                } else {
                    $.get(recordingServiceUrl + "&uid=" + uid)
                        .done(function (data) {
                            console.log(data);
                            client.startRecording(data, function (data) {
                                $(e.target).attr("src", "images/btn_record_pause.png");
                                // toggle recording flag
                                recording = !recording;
                                console.log(data);
                            }, function (err) {
                                console.log(err);
                                $.alert("Failed to start recording, please try again or contact admin.");
                            });
                        })
                        .fail(function (err) {
                            console.log(err);
                            $.alert("Failed to get recording key, please try again.");
                        });
                    if (!queryRecordingHandler) {
                        queryRecordingHandler = setInterval(function () {
                            client.queryRecordingStatus(function (result) {
                                console.log(result);
                                switch (result.status) {
                                    case 0:
                                        // recording has been stopped
                                        recording = false;
                                        $(e.target).attr("src", "images/btn_record.png");
                                        break;
                                    case 1:
                                        // recording now
                                        recording = true;
                                        $(e.target).attr("src", "images/btn_record_pause.png");
                                        break;
                                }
                            });
                        }, 3000);
                    }
                }
            });

            // Adding events handlers
            $(".mute-button,.list-switch-audio-btn").off("click").on("click", function (e) {
                disableAudio = !disableAudio;

                var target = $(this),
                    isMixed = target.hasClass('list-switch-audio-btn'),
                    mixedClassName = 'list-switch-audio-disable-btn';

                if (disableAudio) {

                    if (isMixed) {
                        target.addClass(mixedClassName);
                    } else {
                        target.attr("src", "images/btn_mute_touch.png");
                    }
                    localStream.disableAudio();
                } else {
                    if (isMixed) {
                        target.removeClass(mixedClassName);
                    } else {
                        target.attr("src", "images/btn_mute@2x.png");
                    }
                    localStream.enableAudio();
                }

                // if (disableAudio) {
                //     localStream.disableAudio();
                //     $(e.target).attr("src", "images/btn_mute_touch.png");
                // } else {
                //     localStream.enableAudio();
                //     $(e.target).attr("src", "images/btn_mute@2x.png");
                // }
            });

            $(".switch-audio-button").off("click").click(function (e) {
                disableVideo = !disableVideo;
                if (disableVideo) {
                    localStream.disableVideo();
                    $(e.target).attr("src", "images/btn_video.png");
                    $("#stream" + localStream.getId()).css({ display: 'none' });
                    $("#stream" + lastLocalStreamId).css({ display: 'none' });
                    /**
                     * 
                     * 
                     * 
                     * 
                     * 
                     * 
                     * 
                     * 
                     *需要修改 
                     * 
                     * 
                     * */


                    var aa = "otherView" + stream.getId();
                    // $("")
                    // 这个地方好像需要修改
                    $("#player_" + localStream.getId()).css({
                        "background-color": "#4b4b4b",
                        "background-image": "url(images/icon_default.png)",
                        "background-repeat": "no-repeat",
                        "background-position": "center center"
                    });
                    $("#player_" + lastLocalStreamId).css({
                        "background-color": '#4b4b4b',
                        "background-image": "url(images/icon_default.png)",
                        "background-repeat": "no-repeat",
                        "background-position": "center center"
                    });
                } else {
                    localStream.enableVideo();
                    $(e.target).attr("src", "images/btn_voice.png");
                    $("#stream" + localStream.getId()).css({ display: 'block' });
                    $("#stream" + lastLocalStreamId).css({ display: 'block' });
                }
            });

            $(".fullscreen-button").off("click").click(function (e) {
                var target;
                fullscreenEnabled = !fullscreenEnabled;
                if (screenfull.enabled) {
                    if (screenfull.isFullscreen) {
                        screenfull.exit();
                        $(e.target).attr("src", "images/btn_maximize.png");
                    } else {
                        var videoWrapper = $("div[id^='agora-remote']")[0];
                        target = $(videoWrapper).find("canvas")[0];
                        screenfull.request(target);
                        $(e.target).attr("src", "images/btn_reduction.png");
                    }
                } else {
                    // TODO will we provide fallback for older browsers??
                }
            });
            //移除 所有类下的click事件然后在添加click事件
            $(".expension-button").off("click").click(function (e) {
                hideLocalStream = !hideLocalStream;

                if (hideLocalStream) {
                    $("div[id^='agora-local']").remove();
                } else {
                    displayStream("agora-local", localStream, 160, 120, 'local-partner-video');
                }
                // workaround to remove bottom bar
                $("div[id^='bar_']").remove();
            });

            $(".end-call-button,.list-hang-up-btn").click(function (e) {
                client.leave();
                // window.location.href = "index.html";
            });

            // screen share event
            var shareListContainer = $('#js_ShareScreenList'),
                shareScreenListArrow = $('#js_ShareScreenListArrow');

            $(".escreen-sharing-button").click(function (e) {

                if (isShared) {
                    client.stopScreenSharing(function (e) {
                        isShared = false;
                        console.log("stopScreenSharingFailure:" + e);
                    }, function (e) {
                        console.log(e)
                    });
                }

                isShowShareList = !isShowShareList;

                displayShareList = isShowShareList ? "block" : "none";

                var offset = $(this).parent().offset(),
                    count = 0;

                client.getWindows(function (data) {
                    var strHtml = '';
                    for (var i = 0, len = data.length; i < len; i++) {
                        if ($.trim(data[i].title) != '') {
                            count++;
                            strHtml += "<li data-id=" + data[i].windowId + ">" + window.Base64.decode(data[i].title) + "</li>";
                        }
                    }

                    if (count > 12) {
                        count = 12
                    }

                    shareListContainer.find('ul').html(strHtml);

                    shareListContainer.css({
                        "left": '-70px',
                        "top": '-225px',
                        "display": displayShareList,
                        "overflow-y": "scroll",
                        "overflow-x": 'hidden',
                        "background": " rgba(255, 255, 255, 0.6)",
                    });

                    shareScreenListArrow.css({
                        "left": offset.left + 21,
                        "top": offset.top - 30,
                        "display": displayShareList
                    });
                });

            });

            shareListContainer.on('click', 'li', function () {

                client.startScreenSharing($(this).data('id'), function (e) {

                    isShared = true;
                    shareListContainer.hide();
                    shareScreenListArrow.hide();
                    console.log("startScreenSharingFailure:" + e);
                    // replaceLI();
                    $('#video-container-multiple li.videoActive div canvas').css({
                        width: '100%',
                        height: '100%'
                    })
                }, function (e) {
                    console.log(e)
                });
            });

            var videoContainerMultiple = $('#video-container-multiple');

            $(".whiteboard-button").click(function (e) {
                // hidden video
                $('.video-side-bar').show();

                $('.toolbar').hide();

                isMixed = true;

                videoContainerMultiple.addClass('to-side');

                var canvas = videoContainerMultiple.find('canvas'),
                    horizontalScale = 190 / 118,
                    verticalScale = 118 / 190;

                for (var i = 0, len = canvas.length; i < len; i++) {
                    var canvasWidth = canvas.eq(i).attr('width'),
                        canvasHeight = canvas.eq(i).attr('height'),
                        isHorizontal = canvasWidth > canvasHeight ? true : false,
                        currentScale = canvasWidth / canvasHeight;


                    if (isHorizontal) {
                        if (currentScale > horizontalScale) {
                            var canvasDisplayWidth = 190,
                                canvasDisplayHeight = Math.floor(canvasDisplayHeight / currentScale);
                        } else {
                            var canvasDisplayHeight = 118,
                                canvasDisplayWidth = Math.floor(currentScale * canvasDisplayHeight);
                        }
                    } else {
                        if (currentScale > verticalScale) {
                            var canvasDisplayHeight = 118,
                                canvasDisplayWidth = Math.floor(currentScale * canvasDisplayHeight);
                        } else {
                            var canvasDisplayWidth = 190,
                                canvasDisplayHeight = Math.floor(canvasDisplayHeight / currentScale);
                        }
                    }

                    canvas.eq(i).data({ style: canvas.eq(i).attr('style') })
                        .css({
                            // width: canvasDisplayWidth,
                            // height: canvasDisplayHeight
                            width: 180,
                            height: canvasDisplayHeight
                        });

                }

                // load white board 屏幕分辨率
                var resolution = Cookies.get("resolution") || "480p",
                    maxFrameRate = Number(Cookies.get("maxFrameRate") || 15),
                    maxBitRate = Number(Cookies.get("maxBitRate") || 750),
                    channel = Cookies.get("roomName"),
                    client = AgoraRTC.Client({}),
                    remoteStreamList = [],
                    localStream;
                var hostParams = {
                    key: key,
                    cname: channel,
                    role: 'host',
                    width: 1024,
                    height: 768,
                    container: "whiteboard-container"
                };
                /* Call AgoraWhiteBoardApi */
                Agora.Whiteboard.join(hostParams);  //注释掉
            });

            // End mixed-mode
            $(".list-close-btn").click(function (e) {

                $('.video-side-bar').hide();

                $('.toolbar').show();

                isMixed = false;

                $('#whiteboard-container').empty();

                var canvas = videoContainerMultiple.find('canvas');
                for (var i = 0, len = canvas.length; i < len; i++) {
                    canvas.eq(i).attr('style', canvas.eq(i).data('style'));
                }

                videoContainerMultiple.removeClass('to-side');

            });
        }
    });
}