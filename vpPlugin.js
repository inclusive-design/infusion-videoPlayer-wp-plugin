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
     * Root component for the VideoPlayer plugin form
     */
    fluid.defaults("fluid.vpPlugin", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        finalInitFunction: "fluid.vpPlugin.finalInit",
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
        selectors: {
            title: ".vppc-videoTitle",
            cancel: ".vppc-cancel",
            insert: ".vppc-insert"
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
    
    var convertTracksToString = function (trackArray, prefix) {
        var togo = "";
        var strs = {};
        // determine which fields exist, create base strings for each shortcode attribute
        fluid.each(trackArray[0], function (val, name) {
            strs[name] = "";
        });
        // construct individual shortcode attributes
        fluid.each(trackArray, function (entry, index) {
            fluid.each(strs, function (val, name) {
                strs[name] += entry[name] + ",";
            });
        });
        // strip the final ',' and add to string
        fluid.each(strs, function (val, name) {
            strs[name] = strs[name].substring(0, strs[name].length - 1);
            togo += fluid.stringTemplate(" %0%1='%2'", [prefix, name, strs[name]]);
        });
        return togo;
    };

    fluid.vpPlugin.insertIntoPost = function (that) {
        var shortCodeString = "\n[videoPlayer id='vp-" + fluid.allocateGuid() + "' ";

        var videoTitle = that.locate("title").val();
        if (videoTitle) {
            shortCodeString += " title='" + videoTitle + "'";
        }

        shortCodeString += convertTracksToString(that.model.sources.tracks, "sources");
        shortCodeString += convertTracksToString(that.model.captions.tracks, "captions");
        shortCodeString += convertTracksToString(that.model.transcripts.tracks, "transcripts");

        shortCodeString += " uiosetting='" + phpVars.addUIOsetting + "']\n";
        parent.send_to_editor(shortCodeString);
    };

})(jQuery);
