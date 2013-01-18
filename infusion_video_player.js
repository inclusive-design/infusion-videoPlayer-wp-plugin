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
    infusion_vp.insertVideoPlayer = function () {
        var htmlString = "";
        
        var videoUrl = $("#video_url").val();
        var videoFormat = $("#video_format").val();
        var captionUrl = $("#caption_url").val();
        var captionFormat = $("#caption_format").val();
        var captionLang = $("#caption_lang").val();
        var captionLangLabel = $("#caption_lang option:selected").text().trim();
        var transcriptUrl = $("#transcript_url").val();
        var transcriptFormat = $("#transcript_format").val();
        var transcriptLang = $("#transcript_lang").val();
        var transcriptLangLabel = $("#transcript_lang option:selected").text().trim();
    
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
            }
        };
        htmlString = "<script>var opts = " + fluid.prettyPrintJSON(opts) + "</script>";
    
        parent.send_to_editor(htmlString);
    };
})(jQuery);
