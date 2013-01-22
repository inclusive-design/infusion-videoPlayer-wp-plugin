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
            videoFormats: ["video/webm", "video/mp4", "video/ogg", "video/ogv", "video/youtube"],
            videoFormatNames: ["video/webm", "video/mp4", "video/ogg", "video/ogv", "video/youtube"],
            captionFormats: ["text/amarajson", "text/vtt"],
            captionFormatNames: ["Amara", "VTT"],
            transcriptFormats: ["text/amarajson", "text/JSONcc"],
            transcriptFormatNames: ["Amara", "JSONcc"],
            languageCodes: ["en", "fr", "es"],
            languageNames: ["English", "French", "Spanish"]
        },
        selectors: {
            // selectors for the form
            videoUrl: "#infvpc-videoUrl",
            videoTitle: "#infvpc-videoTitle",
            videoFormat: "#infvpc-videoFormat",
            captionUrl: "#infvpc-captionUrl",
            captionName: "#infvpc-captionName",
            captionFormat: "#infvpc-captionFormat",
            captionLang: "#infvpc-captionLang",
            transcriptUrl: "#infvpc-transcriptUrl",
            transcriptName: "#infvpc-transcriptName",
            transcriptFormat: "#infvpc-transcriptFormat",
            transcriptLang: "#infvpc-transcriptLang",
            transcriptList: ".infvpc-transcriptList",

            // other selectors
            captionList: ".infvpc-captionList",
            addAnotherCaption: ".infvpc-addAnotherCaption",
            captionTemplate: ".infvpc-captionTemplate",
            captionFormatChooser: ".infvpc-captionFormatChooser",
            captionFormatForm: ".infvpc-captionFormatForm",
            captionFormAmara: ".infvpc-captionFormAmara",
            captionFormVtt: ".infvpc-captionFormVtt",
            transcriptFormatChooser: ".infvpc-transcriptFormatChooser",
            transcriptFormatForm: ".infvpc-transcriptFormatForm",
            transcriptFormAmara: ".infvpc-transcriptFormAmara",
            transcriptFormVtt: ".infvpc-transcriptFormVtt",
            addAnotherTranscript: ".infvpc-addAnotherTranscript",
            insertIntoPost: ".infvpc-insert"
        },
        repeatingSelectors: [],
        selectorsToIgnore: ["addAnotherTranscript", "captionList", "captionFormatChooser", "transcriptFormatChooser", "captionTemplate", "captionFormatForm", "transcriptFormatForm", "transcriptList", "transcriptTemplate", "insertIntoPost"],
        produceTree: "infusion_vp.videoPlayerPlugin.produceTree",
        styles: {
            captionFormAmara: "infvp-captionFormAmara",
            captionFormVtt: "infvp-captionFormVtt",
            transcriptFormAmara: "infvp-transcriptFormAmara",
            transcriptFormJson: "infvp-transcriptFormJson"
        }
    });

    infusion_vp.videoPlayerPlugin.produceTree = function (that) {
        var tree = {
            videoTitle: "${videoTitle}",
            videoUrl: "${videoUrl}",
            videoFormat: {
                selection: "${videoFormat}",
                optionlist: "${videoFormats}",
                optionnames: "${videoFormatNames}"
            },
            captionUrl: "${captionUrl}",
            captionLang: {
                selection: "${captionLang}",
                optionlist: "${languageCodes}",
                optionnames: "${languageNames}"
            },
            captionName: {
                selection: "${captionName}",
                optionlist: "${attachedCaptionFiles}",
                optionnames: "${attachedCaptionFiles}"
            },
            captionFormat: {
                selection: "${captionFormat}",
                optionlist: "${captionFormats}",
                optionnames: "${captionFormatNames}"
            },
            transcriptUrl: "${transcriptUrl}",
            transcriptLang: {
                selection: "${transcriptLang}",
                optionlist: "${languageCodes}",
                optionnames: "${languageNames}"
            },
            transcriptName: {
                selection: "${transcriptName}",
                optionlist: "${attachedTranscriptFiles}",
                optionnames: "${attachedTranscriptFiles}"
            },
            transcriptFormat: {
                selection: "${transcriptFormat}",
                optionlist: "${transcriptFormats}",
                optionnames: "${transcriptFormatNames}"
            }
        };
        return tree;
    };

    infusion_vp.videoPlayerPlugin.preInit = function (that) {
        // these are currently arrays of string file names
        that.model.attachedCaptionFiles = phpVars.captionList;
        that.model.attachedTranscriptFiles = phpVars.transcriptList;
    };

    infusion_vp.videoPlayerPlugin.finalInit = function (that) {
        that.locate("insertIntoPost").click(function () {
            infusion_vp.videoPlayerPlugin.insertVideoPlayer(that);
        });

        that.captionTemplate = that.locate("captionTemplate").clone();
        that.locate("addAnotherCaption").click(function () {
            var copy = that.captionTemplate.clone().removeClass("infvpc-captionTemplate"); // *********
            that.locate("captionList").append(copy);
        });

        // TODO: These toggles won't toggle if the same radio button is pressed twice
        that.locate("captionFormatChooser").click(function () {
            that.locate("captionFormatForm").toggleClass(that.options.styles.captionFormAmara).toggleClass(that.options.styles.captionFormVtt);
        });
        that.locate("transcriptFormatChooser").click(function () {
            that.locate("transcriptFormatForm").toggleClass(that.options.styles.transcriptFormAmara).toggleClass(that.options.styles.transcriptFormJson)
        });

    };

    infusion_vp.videoPlayerPlugin.insertVideoPlayer = function (that) {
        var htmlString = "<div class='infvpc-video-player'></div>\n<script>";
        
        var captionLangLabel = $("#infvpc-captionLang option:selected").text().trim();
        var transcriptLangLabel = $("#infvpc-transcriptLang option:selected").text().trim();
    
        var opts = {
            video: {
                sources: [{
                    src: that.model.videoUrl,
                    type: that.model.videoFormat
                }],
                captions: [{
                    src: that.model.captionUrl,
                    type: that.model.captionFormat.selection,
                    srclang: that.model.captionLang.selection,
                    label: captionLangLabel
                }],
                transcripts: [{
                    src: that.model.transcriptUrl,
                    type: that.model.transcriptFormat.selection,
                    srclang: that.model.transcriptLang.selection,
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
        htmlString += "var opts = " + fluid.prettyPrintJSON(opts) + ";\n";

        htmlString += "fluid.videoPlayer('.infvpc-video-player', opts);";

        htmlString += "</script>";
        parent.send_to_editor(htmlString);
    };
})(jQuery);
