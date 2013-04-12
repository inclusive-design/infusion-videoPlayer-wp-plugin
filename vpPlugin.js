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
                tracks: []
            },
            captions: {
                tracks: [],
                src: "",
                srcLang: "",
                lang: ""                
            },
            transcripts: {
                tracks: [],
                src: "",
                srcLang: "",
                file: "",
                lang: ""
            }
        },
        selectors: {
            title: ".vppc-videoTitle",
            insert: ".vppc-insert"
        },
        invokers: {
            insertIntoPost: {
                funcName: "fluid.vpPlugin.insertIntoPost",
                args: ["{vpPlugin}"]
            },
            convertTracksToString: "fluid.vpPlugin.convertTracksToString"
        },
        components: {
            videoForm: {
                type: "fluid.vpPlugin.trackForm",
                container: ".vppc-videoForm",
                options: {
                    model: {
                        type: "video/mp4"
                    },
                    strings: {
                        title: "Video Sources",
                        urlTitle: "Add Video"
                    },
                    supportedValues: {
                        languageCodes: null,
                        languageNames: null,
                        types: ["video/webm", "video/mp4", "video/ogg", "video/ogv", "video/youtube"],
                        typeLabels: ["WEBM", "MP4", "OGG", "OGV", "YouTube"]
                    }
                }
            },
            videoList: {
                type: "fluid.vpPlugin.trackList",
                container: ".vppc-videoList",
                options: {
                    model: "{vpPlugin}.model",
                    applier:  "{vpPlugin}.applier",
                    events: {
                        onAddTrack: "{videoForm}.events.onAddTrack",
                        afterTrackAdded: "{videoForm}.events.afterTrackAdded"
                    },
                    modelPath: "sources",
                    fields: ["src", "type"]
                }
            },
            captionForm: {
                type: "fluid.vpPlugin.trackForm",
                container: ".vppc-captionForm",
                options: {
                    strings: {
                        title: "Captions",
                        fileTitle: "Add WebVTT Caption",
                        fileLabel: "Choose Caption:"
                    },
                    supportedValues: {
                        types: ["text/amarajson", "text/vtt"],
                        typeLabels: ["Amara", "VTT"]
                    },
                    fileUrls: phpVars.captions.fileUrls,
                    fileNames: phpVars.captions.fileNames
                }
            },
            captionList: {
                type: "fluid.vpPlugin.trackList",
                container: ".vppc-captionList",
                options: {
                    model: "{vpPlugin}.model",
                    applier:  "{vpPlugin}.applier",
                    events: {
                        onAddTrack: "{captionForm}.events.onAddTrack",
                        afterTrackAdded: "{captionForm}.events.afterTrackAdded"
                    },
                    modelPath: "captions",
                    fields: ["src", "type", "srclang", "langLabel"]
                }
            },
            transcriptForm: {
                type: "fluid.vpPlugin.trackForm",
                container: ".vppc-transcriptForm",
                options: {
                    strings: {
                        title: "Transcripts",
                        fileTitle: "Add JSON-CC Transcript",
                        fileLabel: "Choose Transcript:"
                    },
                    fileUrls: phpVars.transcripts.fileUrls,
                    fileNames: phpVars.transcripts.fileNames
                }
            },
            transcriptList: {
                type: "fluid.vpPlugin.trackList",
                container: ".vppc-transcriptList",
                options: {
                    model: "{vpPlugin}.model",
                    applier:  "{vpPlugin}.applier",
                    events: {
                        onAddTrack: "{transcriptForm}.events.onAddTrack",
                        afterTrackAdded: "{transcriptForm}.events.afterTrackAdded"
                    },
                    modelPath: "transcripts",
                    fields: ["src", "type", "srclang", "langLabel"]
                }
            }
        }
    });

    fluid.vpPlugin.finalInit = function (that) {
        that.locate("insert").click(function () {
            that.insertIntoPost();
        });
    };
    
    /**
     * Convert a track list from the model into strings that can be embedded in the WordPress
     * plugin shortcode
     * 
     * @param {Object} trackArray   the array of tracks
     * @param {Object} prefix       the string prefix (based on the type of track, e.g. 'src', 'caption')
     */
    fluid.vpPlugin.convertTracksToString = function (trackArray, prefix) {
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

    /**
     * Convert the information from the form into string format and insert it into the post, in
     * the WordPress 'shortcode' format.
     */
    fluid.vpPlugin.insertIntoPost = function (that) {
        var shortCodeString = "\n[videoPlayer id='vp-" + fluid.allocateGuid() + "' ";

        var videoTitle = that.locate("title").val();
        if (videoTitle) {
            shortCodeString += " title='" + videoTitle + "'";
        }

        shortCodeString += that.convertTracksToString(that.model.sources.tracks, "sources");
        shortCodeString += that.convertTracksToString(that.model.captions.tracks, "captions");
        shortCodeString += that.convertTracksToString(that.model.transcripts.tracks, "transcripts");

        shortCodeString += " uiosetting='" + phpVars.addUIOsetting + "']\n";
        parent.send_to_editor(shortCodeString);
    };
})(jQuery);
