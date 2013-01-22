<div class="embed-video-player-form">
    <div>
        <label for="infvpc-videoTitle">Video Title:</label>
        <input type='text' id='infvpc-videoTitle' />
    </div>
    <div>
        <label for="infvpc-videoUrl">Video URL:</label>
        <input type='text' id='infvpc-videoUrl' />
        <label for="infvpc-videoFormat">Format:</label>
        <select id="infvpc-videoFormat">
            <option value="">options not loaded yet</option>
        </select>
    </div>

    <h2>Captions</h2>
    <label>
	    <input type="radio" class="infvpc-captionFormatChooser" name="captionType" id="amaraCaption" checked="checked">Amara
	</label>
    <label>
	    <input type="radio" class="infvpc-captionFormatChooser" name="captionType" id="vttCaption">VTT
	</label>

	<div class="infvpc-captionFormatForm infvp-captionFormatForm infvp-captionFormAmara">
		<div class="infvp-captionFormAmara">
            <label  for="infvpc-captionUrl">Caption URL:</label>
            <input type='text' id='infvpc-captionUrl' />
            <label for="infvpc-captionLang">Language:</label>
            <select id="infvpc-captionLang">
				<option value="">options not loaded yet</option>
            </select>
		</div>
		<div class="infvp-captionFormVtt">
            <label  for="infvpc-captionName">Caption File Name:</label>
            <select id="infvpc-captionName">
				<option value="">options not loaded yet</option>
            </select>
            <label for="infvpc-captionFormat">Format:</label>
	        <select id="infvpc-captionFormat">
	            <option value="">options not loaded yet</option>
	        </select>
		</div>
	</div>

    <div class="infvpc-captionList">
        <div class="infvpc-captionTemplate">
            <button class="infvpc-delete-caption">del</button>
        </div>
    </div>
    <button class="infvpc-addAnotherCaption">Add another caption</button>

    <h2>Transcripts</h2>
    <label>
	    <input type="radio" class="infvpc-transcriptFormatChooser" name="transcriptType" id="amaraTranscript" checked="checked">Amara
	</label>
    <label>
	    <input type="radio" class="infvpc-transcriptFormatChooser" name="transcriptType" id="jsonTranscript">JSONcc
	</label>

	<div class="infvpc-transcriptFormatForm infvp-transcriptFormatForm infvp-transcriptFormAmara">
		<div class="infvp-transcriptFormAmara">
            <label  for="infvpc-transcriptUrl">Transcript URL:</label>
            <input type='text' id='infvpc-transcriptUrl' />
            <label for="infvpc-transcriptLang">Language:</label>
            <select id="infvpc-transcriptLang">
				<option value="">options not loaded yet</option>
            </select>
		</div>
		<div class="infvp-transcriptFormJson">
            <label  for="infvpc-transcriptName">Transcript File Name:</label>
            <select id="infvpc-transcriptName">
				<option value="">options not loaded yet</option>
            </select>
            <label for="infvpc-transcriptFormat">Format:</label>
	        <select id="infvpc-transcriptFormat">
	            <option value="">options not loaded yet</option>
	        </select>
		</div>
	</div>

    <button class="infvpc-addAnotherTranscript">Add another transcript</button>


    <div>
        <input class="infvpc-insert" type="button" name="insertonlybutton" id="insertonlybutton" class="button" value="Insert into Post"  />
    </div>
</div>

<script>infusion_vp.videoPlayerPlugin(".embed-video-player-form");</script>
