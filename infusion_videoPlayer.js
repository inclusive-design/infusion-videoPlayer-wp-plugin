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
            autoBind: true,
debugMode: true
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

            videoFormats: [],
            captionLang: "en",
            transcriptLang: "en",
            captionFormat: "text/amarajson",
            captionList: [],
            transcriptFormat: "text/amarajson",
            transcriptList: []
        },
        selectors: {
            // selectors for the form
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
                    selection: "${captionFormat}",
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
                    selection: "${transcriptFormat}",
                    optionlist: "${supportedTranscriptFormats}",
                    optionnames: "${supportedTranscriptFormatNames}"
                }
            },{
                type: "fluid.renderer.repeat",
                repeatID: "videoFormatListRow",
                controlledBy: "videoFormats",
                pathAs: "videoFormat",
                tree: {
                    videoFormatListRowUrl: "${{videoFormat}.url}",
                    videoFormatListRowFormat: "${{videoFormat}.format}"
                }
            },{
                type: "fluid.renderer.repeat",
                repeatID: "captionListRow",
                controlledBy: "captionList",
                pathAs: "caption",
                tree: {
                    captionListRowName: "${{caption}.ident}",
                    captionListRowLang: "${{caption}.lang}",
                    captionListRowFormat: "${{caption}.format}"
                }
            },{
                type: "fluid.renderer.repeat",
                repeatID: "transcriptListRow",
                controlledBy: "transcriptList",
                pathAs: "transcript",
                tree: {
                    transcriptListRowName: "${{transcript}.ident}",
                    transcriptListRowLang: "${{transcript}.lang}",
                    transcriptListRowFormat: "${{transcript}.format}"
                }
            }],
            captionUrl: "${captionUrl}",
            "infvpc-captionLang": {
                selection: "${captionLang}",
                optionlist: "${languageCodes}",
                optionnames: "${languageNames}"
            },
            captionName: {
                selection: "${captionName}",
                optionlist: "${captionFileUrls}",
                optionnames: "${captionFileNames}"
            },
            transcriptUrl: "${transcriptUrl}",
            "infvpc-transcriptLang": {
                selection: "${transcriptLang}",
                optionlist: "${languageCodes}",
                optionnames: "${languageNames}"
            },
            transcriptName: {
                selection: "${transcriptName}",
                optionlist: "${transcriptFileUrls}",
                optionnames: "${transcriptFileNames}"
            }
        };
        return tree;
    };

    infusion_vp.videoPlayerPlugin.addItemToTrackList = function (that, trackType, modelPathsToReset) {
        var trackList = that.model[trackType + "List"];
        trackList.push({
            lang: that.model[trackType + "Lang"],
            langLabel: $("option:selected", that.locate("infvpc-captionLang")).text().trim(),
            format: that.model[trackType + "Format"],
            ident: (that.model[trackType + "Format"] === "text/amarajson" ? that.model[trackType + "Url"] : that.model[trackType + "Name"])
        });
        that.applier.requestChange(trackType + "List", trackList);

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
            var videoFormats = that.model.videoFormats;
            videoFormats.push({
                url: that.model.videoUrl,
                format: that.model.videoFormat
            });
            that.applier.requestChange("videoFormats", videoFormats);

            // reset the form
            that.applier.requestChange("videoUrl", null);
            that.applier.requestChange("videoFormat", null);

            // redraw the interface
            that.refreshView();
        });

        that.locate("addThisCaption").click(function () {
            infusion_vp.videoPlayerPlugin.addItemToTrackList(that, "caption",
                {"captionLang": null,
                 "captionFormat": "text/amarajson",
                 "captionUrl": null,
                 "captionName": null}
            );
        });
        that.locate("addThisTranscript").click(function () {
            infusion_vp.videoPlayerPlugin.addItemToTrackList(that, "transcript",
                {"transcriptLang": null,
                 "transcriptFormat": "text/amarajson",
                 "transcriptUrl": null,
                 "transcriptName": null}
            );
        });

        that.applier.modelChanged.addListener("captionFormat", function (model, oldModel, changeRequest) {
            that.locate("captionFormatForm").removeClass(that.options.styles.captionForm[oldModel.captionFormat]).addClass(that.options.styles.captionForm[model.captionFormat]);
        });
        that.applier.modelChanged.addListener("transcriptFormat", function (model, oldModel, changeRequest) {
            that.locate("transcriptFormatForm").removeClass(that.options.styles.transcriptForm[oldModel.transcriptFormat]).addClass(that.options.styles.transcriptForm[model.transcriptFormat]);
        });
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

        that.model.captionName = that.model.captionFileUrls[0];
        that.model.transcriptName = that.model.transcriptFileUrls[0];
    };

    infusion_vp.videoPlayerPlugin.finalInit = function (that) {

    };

    infusion_vp.videoPlayerPlugin.insertVideoPlayer = function (that) {
        var htmlString = "<div class='infvpc-video-player'></div>\n<script>";
        
        var captionLangLabel = $("option:selected", that.locate("infvpc-captionLang")).text().trim();
        var transcriptLangLabel = $("option:selected", that.locate("infvpc-transcriptLang")).text().trim();
    
        var opts = {
            videoTitle: that.model.videoTitle,
            video: {
                sources: [{
                    src: that.model.videoUrl,
                    type: that.model.videoFormat
                }],
                captions: [{
                    src: that.model.captionUrl,
                    type: that.model.captionFormat,
                    srclang: that.model.captionLang,
                    label: captionLangLabel
                }],
                transcripts: [{
                    src: that.model.transcriptUrl,
                    type: that.model.transcriptFormat,
                    srclang: that.model.transcriptLang,
                    label: transcriptLangLabel
                }]
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
        if (that.model.captionFormat === "text/vtt") {
            opts.video.captions[0].src = that.model.captionName;
        }
        if (that.model.transcriptFormat === "JSONcc") {
            opts.video.transcripts[0].src = that.model.transcriptName;
        }

        htmlString += "var opts = " + fluid.prettyPrintJSON(opts) + ";\n";

        htmlString += "fluid.videoPlayer('.infvpc-video-player', opts);";

        htmlString += "</script>";
        parent.send_to_editor(htmlString);
    };
})(jQuery);
