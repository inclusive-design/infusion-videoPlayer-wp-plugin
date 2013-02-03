/*
Copyright 2013 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

/*global jQuery, phpVars*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var fluid = fluid || {};

(function ($) {

    /**************************************************************
     * 
     */
    fluid.defaults("fluid.vpPlugin", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        finalInitFunction: "fluid.vpPlugin.finalInit",
        selectors: {
            title: ".vppc-videoTitle",
            cancel: ".vppc-cancel",
            insert: ".vppc-insert"
        },
        model: {
            sources: {
                tracks: [],
                fields: ["src", "type"]
            },
            captions: {
                tracks: [],
                fields: ["src", "type", "srclang", "langLabel"],
                src: "",
                srcLang: "",
                lang: ""                
            },
            transcripts: {
                tracks: [],
                fields: ["src", "type", "srclang", "langLabel"],
                src: "",
                srcLang: "",
                file: "",
                lang: ""
            }
        },
        invokers: {
            insertIntoPost: {
                funcName: "fluid.vpPlugin.insertIntoPost",
                args: ["{vpPlugin}"]
            }
        },
        components: {
            videoForm: {
                type: "fluid.vpPlugin.trackForm",
                container: ".vppc-videoForm",
                options: {
                    model: "{vpPlugin}.model",
                    applier:  "{vpPlugin}.applier",
                    modelPath: "sources",
                    strings: {
                        title: "Video Sources",
                        urlTitle: "Add Video"
                    },
                    supportedValues: {
                        languageCodes: ["md", "kg"],
                        languageNames: ["Mandarin", "Klingon"],
                        types: ["video/webm", "video/mp4", "video/ogg", "video/ogv", "video/youtube"],
                        typeLabels: ["WEBM", "MP4", "OGG", "OGV", "YouTube"]
                    },
                    invokers: {
                        addUploadedFiles: "fluid.identity",
                        addFileSubtree: "fluid.identity",
                        addLangSubtree: "fluid.identity",
                        injectPrompt: "fluid.identity"
                    }
                }
            },
            videoList: {
                type: "fluid.vpPlugin.trackList",
                container: ".vppc-videoList",
                options: {
                    model: "{vpPlugin}.model",
                    applier:  "{vpPlugin}.applier",
                    modelPath: "sources"
                }
            },
            captionForm: {
                type: "fluid.vpPlugin.trackForm",
                container: ".vppc-captionForm",
                options: {
                    model: "{vpPlugin}.model",
                    applier:  "{vpPlugin}.applier",
                    modelPath: "captions",
                    strings: {
                        title: "Captions",
                        fileTitle: "Add WebVTT Caption",
                        fileLabel: "Choose Caption:"
                    },
                    supportedValues: {
                        languageCodes: ["md", "kg"],
                        languageNames: ["Mandarin", "Klingon"],
                        types: ["text/amarajson", "text/vtt"],
                        typeLabels: ["Amara", "VTT"]
                    },
                    stylesForTypes: {
                        "text/amarajson": "amara",
                        "text/vtt": "nonAmara"
                    }
                }
            },
            captionList: {
                type: "fluid.vpPlugin.trackList",
                container: ".vppc-captionList",
                options: {
                    model: "{vpPlugin}.model",
                    applier:  "{vpPlugin}.applier",
                    modelPath: "captions"
                }
            },
            transcriptForm: {
                type: "fluid.vpPlugin.trackForm",
                container: ".vppc-transcriptForm",
                options: {
                    model: "{vpPlugin}.model",
                    applier:  "{vpPlugin}.applier",
                    modelPath: "transcripts",
                    strings: {
                        title: "Transcripts",
                        fileTitle: "Add JSON-CC Transcript",
                        fileLabel: "Choose Transcript:"
                    }
                }
            },
            transcriptList: {
                type: "fluid.vpPlugin.trackList",
                container: ".vppc-transcriptList",
                options: {
                    model: "{vpPlugin}.model",
                    applier:  "{vpPlugin}.applier",
                    modelPath: "transcripts"
                }
            }
        }
    });

    fluid.vpPlugin.finalInit = function (that) {
        that.locate("cancel").click(function () {
            
        });
        that.locate("insert").click(function () {
            that.insertIntoPost();
        });
    };
    
    fluid.vpPlugin.insertIntoPost = function (that) {
        var opts = {
            videoTitle: that.locate("title").val(),
            video: {
                sources: [],
                captions: [],
                transcripts: []
            },
            templates: {
                videoPlayer: {
                    href: phpVars.pluginUrl + "/lib/videoPlayer/html/videoPlayer_template.html"
                },
                menuButton: {
                    href: phpVars.pluginUrl + "/lib/videoPlayer/html/menuButton_template.html"
                }
            }
        };
        fluid.each(that.model.sources.tracks, function (entry, index) {
            opts.video.sources[index] = {
                src: entry.src,
                type: entry.type
            };
        });
        fluid.each(that.model.captions.tracks, function (entry, index) {
            opts.video.captions[index] = {
                src: entry.src,
                type: entry.type,
                srclang: entry.srclang,
                label: entry.langLabel
            };
        });
        fluid.each(that.model.transcripts.tracks, function (entry, index) {
            opts.video.transcripts[index] = {
                src: entry.src,
                type: entry.type,
                srclang: entry.srclang,
                label: entry.langLabel
            };
        });

        var htmlString = "<div class='infvpc-video-player'></div>\n<script>";
        htmlString += "var opts = " + fluid.prettyPrintJSON(opts) + ";\n";
        htmlString += "fluid.videoPlayer('.infvpc-video-player', opts);";
        htmlString += "</script>";

        parent.send_to_editor(htmlString);
    };

})(jQuery);
