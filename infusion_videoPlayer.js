/*
Copyright 2013 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

/*global jQuery, window, fluid*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var infusion_vp = infusion_vp || {};

(function ($) {

    fluid.defaults("infusion_vp.videoPlayerPlugin", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        renderOnInit: true,
        rendererOptions: {
//debugMode: true,
            autoBind: true
        },
        preInitFunction: "infusion_vp.videoPlayerPlugin.preInit",
        finalInitFunction: "infusion_vp.videoPlayerPlugin.finalInit",
        model: {
            languageCodes: ["en", "fr", "es"],
            languageNames: ["English", "French", "Spanish"],
            supportedVideoFormats: ["video/webm", "video/mp4", "video/ogg", "video/ogv", "video/youtube"],
            supportedVideoFormatNames: ["video/webm", "video/mp4", "video/ogg", "video/ogv", "video/youtube"],
            supportedCaptionFormats: ["text/amarajson", "text/vtt"],
            supportedCaptionFormatNames: ["Amara", "VTT"],
            supportedTranscriptFormats: ["text/amarajson", "JSONcc"],
            supportedTranscriptFormatNames: ["Amara", "JSONcc"],

            sources: [],
            captions: [],
            transcripts: [],

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
            captionUrl: "#infvpc-captionUrl",
            captionName: "#infvpc-captionName",
            "infvpc-captionLang": "#infvpc-captionLang",
            transcriptUrl: "#infvpc-transcriptUrl",
            transcriptName: "#infvpc-transcriptName",
            "infvpc-transcriptLang": "#infvpc-transcriptLang",
            // TODO: Really need to remove all the duplication around captions vs transcripts
            captionListRow: ".infvpc-captionList-row",
            captionListRowName: ".infvpc-captionList-name",
            captionListRowLang: ".infvpc-captionList-lang",
            captionListRowFormat: ".infvpc-captionList-format",
            transcriptListRow: ".infvpc-transcriptList-row",
            transcriptListRowName: ".infvpc-transcriptList-name",
            transcriptListRowLang: ".infvpc-transcriptList-lang",
            transcriptListRowFormat: ".infvpc-transcriptList-format",
            captionFormatChooserRow: ".infvpc-captionFormatChooserRow",
            captionFormatChooserButton: ".infvpc-captionFormatChooser",
            captionFormatChooserLabel: ".infvpc-captionFormatChooserLabel",
            transcriptFormatChooserRow: ".infvpc-transcriptFormatChooserRow",
            transcriptFormatChooserButton: ".infvpc-transcriptFormatChooser",
            transcriptFormatChooserLabel: ".infvpc-transcriptFormatChooserLabel",

            // other selectors
            captionList: ".infvpc-captionList",
            addThisCaption: ".infvpc-addThisCaption",
            captionFormatForm: ".infvpc-captionFormatForm",
            captionFormAmara: ".infvpc-captionFormAmara",
            captionFormVtt: ".infvpc-captionFormVtt",
            transcriptFormatForm: ".infvpc-transcriptFormatForm",
            transcriptFormAmara: ".infvpc-transcriptFormAmara",
            transcriptFormVtt: ".infvpc-transcriptFormVtt",
            addThisTranscript: ".infvpc-addThisTranscript",
            insertIntoPost: ".infvpc-insert"
        },
        repeatingSelectors: ["captionFormatChooserRow", "transcriptFormatChooserRow", "videoFormatListRow", "captionListRow", "transcriptListRow"],
        selectorsToIgnore: ["captionList", "captionFormatForm",
                            "transcriptFormatForm",
                            "addThisCaption", "addThisTranscript", "addThisVideoFormat", "insertIntoPost"],
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
        }
    });

    infusion_vp.videoPlayerPlugin.produceTree = function (that) {
        var tree = {
            videoTitle: "${videoTitle}",
            videoUrl: "${videoUrl}",
            videoFormat: {
                selection: "${videoFormat}",
                optionlist: "${supportedVideoFormats}",
                optionnames: "${supportedVideoFormatNames}"
            },
            expander: [{
                type: "fluid.renderer.selection.inputs",
                rowID: "captionFormatChooserRow",
                labelID: "captionFormatChooserLabel",
                inputID: "captionFormatChooserButton",
                selectID: "captionFormatChooser",
                tree: {
                    selection: "${captionsFormat}",
                    optionlist: "${supportedCaptionFormats}",
                    optionnames: "${supportedCaptionFormatNames}"
                }
            },
            {
                type: "fluid.renderer.selection.inputs",
                rowID: "transcriptFormatChooserRow",
                labelID: "transcriptFormatChooserLabel",
                inputID: "transcriptFormatChooserButton",
                selectID: "transcriptFormatChooser",
                tree: {
                    selection: "${transcriptsFormat}",
                    optionlist: "${supportedTranscriptFormats}",
                    optionnames: "${supportedTranscriptFormatNames}"
                }
            },{
                type: "fluid.renderer.repeat",
                repeatID: "videoFormatListRow",
                controlledBy: "sources",
                pathAs: "videoFormat",
                tree: {
                    videoFormatListRowUrl: "${{videoFormat}.src}",
                    videoFormatListRowFormat: "${{videoFormat}.format}"
                }
            },{
                type: "fluid.renderer.repeat",
                repeatID: "captionListRow",
                controlledBy: "captions",
                pathAs: "caption",
                tree: {
                    captionListRowName: "${{caption}.src}",
                    captionListRowLang: "${{caption}.lang}",
                    captionListRowFormat: "${{caption}.format}"
                }
            },{
                type: "fluid.renderer.repeat",
                repeatID: "transcriptListRow",
                controlledBy: "transcripts",
                pathAs: "transcript",
                tree: {
                    transcriptListRowName: "${{transcript}.src}",
                    transcriptListRowLang: "${{transcript}.lang}",
                    transcriptListRowFormat: "${{transcript}.format}"
                }
            }],
            captionUrl: "${captionsUrl}",
            "infvpc-captionLang": {
                selection: "${captionsLang}",
                optionlist: "${languageCodes}",
                optionnames: "${languageNames}"
            },
            captionName: {
                selection: "${captionsName}",
                optionlist: "${captionFileUrls}",
                optionnames: "${captionFileNames}"
            },
            transcriptUrl: "${transcriptsUrl}",
            "infvpc-transcriptLang": {
                selection: "${transcriptsLang}",
                optionlist: "${languageCodes}",
                optionnames: "${languageNames}"
            },
            transcriptName: {
                selection: "${transcriptsName}",
                optionlist: "${transcriptFileUrls}",
                optionnames: "${transcriptFileNames}"
            }
        };
        return tree;
    };

    infusion_vp.videoPlayerPlugin.addItemToTrackList = function (that, trackType, modelPathsToReset) {
        var trackList = fluid.copy(that.model[trackType]);
        trackList.push({
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

        // TODO: Need a better way to deal with default formats and languages
        that.locate("addThisCaption").click(function () {
            infusion_vp.videoPlayerPlugin.addItemToTrackList(that, "captions",
                {"captionsLang": "en",
                 "captionsFormat": "text/amarajson",
                 "captionsUrl": null,
                 "captionsName": null}
            );
        });
        that.locate("addThisTranscript").click(function () {
            infusion_vp.videoPlayerPlugin.addItemToTrackList(that, "transcripts",
                {"transcriptsLang": "en",
                 "transcriptsFormat": "text/amarajson",
                 "transcriptsUrl": null,
                 "transcriptsName": null}
            );
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
        if (!changeRequest.value[changeRequest.value.length - 1].src) {
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
        if (that.model.sources.length === 0) {
            // need to fire something that will trigger a message
            console.log("You must provide at least one video URL.")
            return;
        }

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
        fluid.each(that.model.sources, function(entry, index) {
            opts.video.sources[index] = {
                src: entry.src,
                type: entry.format
            };
        });
        fluid.each(that.model.captions, function(entry, index) {
            opts.video.captions[index] = {
                src: entry.src,
                type: entry.format,
                srclang: entry.lang,
                label: entry.langLabel
            };
        });
        fluid.each(that.model.transcripts, function(entry, index) {
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
