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
    infusion_vp.initializeVideoPlayerPlugin = function () {
        $(".infvpc-insert").click(infusion_vp.insertVideoPlayer);

        var captionTemplate = $(".infvpc-caption-template").clone();
        $(".infvpc-add-another-caption").click(function () {
            var copy = captionTemplate.clone().removeClass("infvpc-caption-template");
            $(".infvpc-caption-list").append(copy);

        });
    };
    infusion_vp.insertVideoPlayer = function () {
        var htmlString = "<div class='infvpc-video-player'></div>\n<script>";
        
        var videoUrl = $("#infvpc-video_url").val();
        var videoFormat = $("#infvpc-video_format").val();
        var captionUrl = $("#infvpc-caption_url").val();
        var captionFormat = $("#infvpc-caption_format").val();
        var captionLang = $("#infvpc-caption_lang").val();
        var captionLangLabel = $("#infvpc-caption_lang option:selected").text().trim();
        var transcriptUrl = $("#infvpc-transcript_url").val();
        var transcriptFormat = $("#infvpc-transcript_format").val();
        var transcriptLang = $("#infvpc-transcript_lang").val();
        var transcriptLangLabel = $("#infvpc-transcript_lang option:selected").text().trim();
    
        var opts = {
            video: {
                sources: [{
                    src: videoUrl,
                    type: videoFormat
                }],
                captions: [{
                    src: captionUrl,
                    type: captionFormat,
                    srclang: captionLang,
                    label: captionLangLabel
                }],
                transcripts: [{
                    src: transcriptUrl,
                    type: transcriptFormat,
                    srclang: transcriptLang,
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
