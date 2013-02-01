/*
Copyright 2013 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

/*global jQuery, fluid, phpVars*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var infusion_vp = infusion_vp || {};

(function ($) {

    fluid.defaults("infusion_vp.videoPlayerPlugin", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        components: {
            captionList: {
                type: "infusion_vp.videoPlayerPlugin.trackList",
                container: ".infvpc-captionList",
                options: {
                    supportedValues: {
                        languageCodes: ["en", "fr", "es"],
                        languageNames: ["English", "French", "Spanish"],
                        types: ["text/amarajson", "text/vtt"],
                        typeLabels: ["Amara", "VTT"]
                    },
                    styles: {
                        "text/amarajson": "infvp-trackList-urlForm",
                        "text/vtt": "infvp-trackList-uploadedFileForm"
                    },
                    listeners: {
                        onDeleteRow: {
                            listener: "infusion_vp.videoPlayerPlugin.trackList.deleteRow",
                            args: ["{trackList}", "{arguments}.0"]
                        }
                    }
                }
            },
            transcriptList: {
                type: "infusion_vp.videoPlayerPlugin.trackList",
                container: ".infvpc-transcriptList",
                options: {
                    supportedValues: {
                        languageCodes: ["en", "fr", "es", "md"],
                        languageNames: ["English", "French", "Spanish", "Mandarin"],
                        types: ["text/amarajson", "JSONcc"],
                        typeLabels: ["Amara", "JSONcc"]
                    },
                    styles: {
                        "text/amarajson": "infvp-trackList-urlForm",
                        "JSONcc": "infvp-trackList-uploadedFileForm"
                    },
                    listeners: {
                        onDeleteRow: {
                            listener: "infusion_vp.videoPlayerPlugin.trackList.deleteRow",
                            args: ["{trackList}", "{arguments}.0"]
                        }
                    }
                }
            }
        },
        renderOnInit: true,
        rendererOptions: {
//debugMode: true,
            autoBind: true
        },
        preInitFunction: "infusion_vp.videoPlayerPlugin.preInit",
        finalInitFunction: "infusion_vp.videoPlayerPlugin.finalInit",
        model: {
            sources: [],

            // initialize some defaults
            videoFormat: "video/webm",
            captionsFormat: "text/amarajson",
            captionsLang: "en",
            transcriptsFormat: "text/amarajson",
            transcriptsLang: "en"
        },
        selectors: {
            // selectors for the forms
            videoUrl: "#infvpc-videoUrl",
            videoTitle: "#infvpc-videoTitle",
            videoFormat: "#infvpc-videoFormat",
            videoFormatListRow: ".infvpc-videoFormatList-row",
            videoFormatListRowUrl: ".infvpc-videoFormatList-url",
            videoFormatListRowFormat: ".infvpc-videoFormatList-format",
            addThisVideoFormat: ".infvpc-addThisVideoFormat",

            // other selectors
            deleteVideoFormat: ".infvpc-deleteVideoFormat",
            insertIntoPost: ".infvpc-insert"
        },
        repeatingSelectors: ["captionFormatChooserRow", "transcriptFormatChooserRow", "videoFormatListRow", "captionListRow", "transcriptListRow"],
        selectorsToIgnore: ["infvpc-captionList", "infvpc-transcriptList", "deleteVideoFormat", "addThisVideoFormat", "insertIntoPost"],
        produceTree: "infusion_vp.videoPlayerPlugin.produceTree",
        styles: {
            captionForm: {
                "text/amarajson":  "infvp-captionFormAmara",
                "text/vtt":  "infvp-captionFormVtt"
            },
            transcriptForm: {
                "text/amarajson":  "infvp-transcriptFormAmara",
                "JSONcc":  "infvp-transcriptFormJson"
            }
        },
        listeners: {
            afterRender: {
                listener: "infusion_vp.videoPlayerPlugin.bindDOMEvents",
                args: ["{videoPlayerPlugin}"]
            }
        },
        supportedValues: {
            languageCodes: ["en", "fr", "es"],
            languageNames: ["English", "French", "Spanish"],
            videoFormats: ["video/webm", "video/mp4", "video/ogg", "video/ogv", "video/youtube"],
            videoFormatNames: ["video/webm", "video/mp4", "video/ogg", "video/ogv", "video/youtube"]
        }
    });

    infusion_vp.videoPlayerPlugin.produceTree = function (that) {
        var tree = {
            videoTitle: "${videoTitle}",
            videoUrl: "${videoUrl}",
            videoFormat: {
                selection: "${videoFormat}",
                optionlist: that.options.supportedValues.videoFormats,
                optionnames: that.options.supportedValues.videoFormatNames
            },
            expander: [
            {
                type: "fluid.renderer.repeat",
                repeatID: "videoFormatListRow",
                controlledBy: "sources",
                pathAs: "videoFormat",
                tree: {
                    videoFormatListRowUrl: "${{videoFormat}.src}",
                    videoFormatListRowFormat: "${{videoFormat}.format}"
                }
            }
            ]
        };
        return tree;
    };

    infusion_vp.videoPlayerPlugin.addItemToTrackList = function (that, trackType, modelPathsToReset) {
        var trackList = fluid.copy(that.model[trackType]);
        trackList.push({
            index: trackList.length,
            lang: that.model[trackType + "Lang"],
            langLabel: $("option:selected", that.locate("infvpc-captionLang")).text().trim(),
            format: that.model[trackType + "Format"],
            src: (that.model[trackType + "Format"] === "text/amarajson" ? that.model[trackType + "Url"] : that.model[trackType + "Name"])
        });
        that.applier.requestChange(trackType, trackList);

        // reset the form
        fluid.each(modelPathsToReset, function (value, key) {
            that.applier.requestChange(key, value);
        });

        // redraw the interface
        that.refreshView();
    };

    infusion_vp.videoPlayerPlugin.bindDOMEvents = function (that) {
        that.locate("insertIntoPost").click(function () {
            infusion_vp.videoPlayerPlugin.insertVideoPlayer(that);
        });

        that.locate("addThisVideoFormat").click(function () {
            var sources = fluid.copy(that.model.sources);
            sources.push({
                src: that.model.videoUrl,
                format: that.model.videoFormat
            });
            that.applier.requestChange("sources", sources);

            // reset the form
            that.applier.requestChange("videoUrl", null);
            that.applier.requestChange("videoFormat", "video/webm");

            // redraw the interface
            that.refreshView();
        });

        that.applier.guards.addListener("sources", infusion_vp.videoPlayerPlugin.validateUrl);
        that.applier.guards.addListener("captions", infusion_vp.videoPlayerPlugin.validateUrl);
        that.applier.guards.addListener("transcripts", infusion_vp.videoPlayerPlugin.validateUrl);

        that.applier.modelChanged.addListener("captionsFormat", function (model, oldModel, changeRequest) {
            that.locate("captionFormatForm").removeClass(that.options.styles.captionForm[oldModel.captionsFormat]).addClass(that.options.styles.captionForm[model.captionsFormat]);
        });
        that.applier.modelChanged.addListener("transcriptsFormat", function (model, oldModel, changeRequest) {
            that.locate("transcriptFormatForm").removeClass(that.options.styles.transcriptForm[oldModel.transcriptsFormat]).addClass(that.options.styles.transcriptForm[model.transcriptsFormat]);
        });
    };

    /*
     * Check that the URL field of the object being added to the array is not empty
     */
    infusion_vp.videoPlayerPlugin.validateUrl = function (model, changeRequest) {
        if ((changeRequest.value.length > 0) && (!changeRequest.value[changeRequest.value.length - 1].src)) {
            // need to fire something that will trigger a message; need to distinguish which field
            console.log("sorry, you need to specify an URL for this");
            return false;
        }
    };

    infusion_vp.videoPlayerPlugin.preInit = function (that) {
        // these are currently arrays of string file names
        that.model.captionFileNames = phpVars.captionFileNames;
        that.model.captionFileUrls = phpVars.captionFileUrls;
        that.model.transcriptFileNames = phpVars.transcriptFileNames;
        that.model.transcriptFileUrls = phpVars.transcriptFileUrls;

        // TODO: This is a hack: need a better solution
        if (that.model.captionFileNames.length === 0) {
            that.model.captionFileNames = ["No caption files uploaded yet"];
            that.model.captionFileUrls = ["nothing here yet"];
        }
        if (that.model.transcriptFileNames.length === 0) {
            that.model.transcriptFileNames = ["No transcript files uploaded yet"];
            that.model.transcriptFileUrls = ["nothing here yet"];
        }

        that.model.captionsName = that.model.captionFileUrls[0];
        that.model.transcriptsName = that.model.transcriptFileUrls[0];
    };

    infusion_vp.videoPlayerPlugin.finalInit = function (that) {

    };

    infusion_vp.videoPlayerPlugin.insertVideoPlayer = function (that) {
/*
        if (that.model.sources.length === 0) {
            // need to fire something that will trigger a message
            console.log("You must provide at least one video URL.");
            return;
        }
*/

        var opts = {
            videoTitle: that.model.videoTitle,
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
        fluid.each(that.model.sources, function (entry, index) {
            opts.video.sources[index] = {
                src: entry.src,
                type: entry.format
            };
        });
        fluid.each(that.captionList.model.tracks, function (entry, index) {
            opts.video.captions[index] = {
                src: entry.src,
                type: entry.format,
                srclang: entry.lang,
                label: entry.langLabel
            };
        });
        fluid.each(that.transcriptList.model.tracks, function (entry, index) {
            opts.video.transcripts[index] = {
                src: entry.src,
                type: entry.format,
                srclang: entry.lang,
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
