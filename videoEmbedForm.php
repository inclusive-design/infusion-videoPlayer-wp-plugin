    <div>
        <label for="infvpc-video_title">Video Title:</label>
        <input type='text' id='infvpc-video_title' />
    </div>
    <div>
        <label for="infvpc-video_url">Video URL:</label>
        <input type='text' id='infvpc-video_url' />
        <labelfor="infvpc-video_format">Format:</label>
        <select id="infvpc-video_format">
            <option value="video/webm">video/webm</option>
            <option value="video/mp4">video/mp4</option>
            <option value="video/ogg">video/ogg</option>
            <option value="video/ogv">video/ogv</option>
            <option value="video/youtube">video/youtube</option>
        </select>
    </div>

    <h2>Captions</h2>
    <div class="infvpc-caption-list">
        <div class="infvpc-caption-template">
            <button class="infvpc-delete-caption">del</button>
            <label class="vp-label"  for="infvpc-caption_url">Caption URL:</label>
            <input type='text' id='infvpc-caption_url' />
            <label for="caption_lang">Language:</label>
            <select id="infvpc-caption_lang">
                <option value="en">English</option>
                <option value="fr">French</option>
            </select>
            <label for="infvpc-caption_format">Format:</label>
            <select id="infvpc-caption_format">
                <option value="text/vtt">text/vtt</option>
                <option value="text/amarajson">text/amarajson</option>
            </select>
        </div>
    </div>
    <button class="infvpc-add-another-caption">Add another caption</button>

    <h2>Transcripts</h2>
    <div class="infvpc-transcript-list">
        <div class="infvpc-transcript-template">
            <label for="infvpc-transcript_url">Transcript URL:</label>
            <input type='text' id='infvpc-transcript_url' />
            <label for="infvpc-transcript_lang">Language:</label>
            <select id="infvpc-transcript_lang">
                <option value="en">English</option>
                <option value="fr">French</option>
            </select>
            <label for="infvpc-transcript_format">Format:</label>
            <select id="infvpc-transcript_format">
                <option value="text/vtt">text/vtt</option>
                <option value="text/amarajson">text/amarajson</option>
            </select>
        </div>
    </div>
    <button class="infvpc-add-another-transcript">Add another transcript</button>

    <div>
        <input class="infvpc-insert" type="button" name="insertonlybutton" id="insertonlybutton" class="button" value="Insert into Post"  />
    </div>

    <script>infusion_vp.initializeVideoPlayerPlugin();</script>
