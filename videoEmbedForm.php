<div class="embed-video-player-form">
    <h2>Video</h2>
    <div>
        <label for="infvpc-videoTitle">Video Title:</label>
        <input type='text' id='infvpc-videoTitle' />
    </div>
	<table class="infvpc-videoFormatList infvp-videoFormat" border="0">
		<tr class="infvpc-videoFormatList-row">
			<td><button type="button" class="infvpc-deleteVideoFormat">del</button></td>
			<td class="infvpc-videoFormatList-url">url</td>
			<td class="infvpc-videoFormatList-format">format</td>
		</tr>
	</table>
    <div>
        <label for="infvpc-videoUrl">Video URL:</label>
        <input type='text' id='infvpc-videoUrl' />
        <label for="infvpc-videoFormat">Format:</label>
        <select id="infvpc-videoFormat">
            <option value="">options not loaded yet</option>
        </select>
    </div>
    <button class="infvpc-addThisVideoFormat">Add this video format</button>

    <h2>Captions</h2>
	<table class="infvpc-captionList infvp-captionList" border="0">
		<tr class="infvpc-captionList-row">
			<td><button type="button" class="infvpc-deleteCaption">del</button></td>
			<td class="infvpc-captionList-name">name</td>
			<td class="infvpc-captionList-lang">language</td>
			<td class="infvpc-captionList-format">format</td>
		</tr>
	</table>

	<span class="infvpc-captionFormatChooserRow">
	    <label class="infvpc-captionFormatChooserLabel" for="infvpc-captionFormatChooserId">label</label>
	    <input type="radio" class="infvpc-captionFormatChooser" id="infvpc-captionFormatChooserId" >
	</span>

	<div class="infvpc-captionFormatForm infvp-captionFormatForm infvp-captionFormAmara">
		<div class="infvp-captionFormAmara">
            <label  for="infvpc-captionUrl">Caption URL:</label>
            <input type='text' id='infvpc-captionUrl' />
		</div>
		<div class="infvp-captionFormVtt">
            <label  for="infvpc-captionName">Caption File Name:</label>
            <select id="infvpc-captionName">
				<option value="">options not loaded yet</option>
            </select>
		</div>
        <label for="infvpc-captionLang">Language:</label>
        <select id="infvpc-captionLang">
			<option value="">options not loaded yet</option>
        </select>
	</div>

    <button class="infvpc-addThisCaption">Add this caption</button>

    <h2>Transcripts</h2>
	<table class="infvpc-transcriptList infvp-transcriptList" border="0">
		<tr class="infvpc-transcriptList-row">
			<td><button type="button" class="infvpc-deleteTranscript">del</button></td>
			<td class="infvpc-transcriptList-name">name</td>
			<td class="infvpc-transcriptList-lang">language</td>
			<td class="infvpc-transcriptList-format">format</td>
		</tr>
	</table>

	<span class="infvpc-transcriptFormatChooserRow">
	    <label class="infvpc-transcriptFormatChooserLabel" for="infvpc-transcriptFormatChooserId">label</label>
	    <input type="radio" class="infvpc-transcriptFormatChooser" id="infvpc-transcriptFormatChooserId" >
	</span>

	<div class="infvpc-transcriptFormatForm infvp-transcriptFormatForm infvp-transcriptFormAmara">
		<div class="infvp-transcriptFormAmara">
            <label  for="infvpc-transcriptUrl">Transcript URL:</label>
            <input type='text' id='infvpc-transcriptUrl' />
		</div>
		<div class="infvp-transcriptFormJson">
            <label  for="infvpc-transcriptName">Transcript File Name:</label>
            <select id="infvpc-transcriptName">
				<option value="">options not loaded yet</option>
            </select>
		</div>
        <label for="infvpc-transcriptLang">Language:</label>
        <select id="infvpc-transcriptLang">
			<option value="">options not loaded yet</option>
        </select>
	</div>

    <button class="infvpc-addThisTranscript">Add this transcript</button>

    <h2>Tracks</h2>
	<div class="infvpc-trackList-test">
		<table class="infvpc-trackList infvp-transcriptList" border="0">
			<tr class="infvpc-trackList-trackRow">
				<td><button type="button" class="infvpc-trackList-addTrack">del</button></td>
				<td class="infvpc-trackList-trackSrc">name</td>
				<td class="infvpc-trackList-trackLang">language</td>
				<td class="infvpc-trackList-trackFormat">format</td>
			</tr>
		</table>

		<span class="infvpc-trackList-formatRow">
		    <label class="infvpc-trackList-formatLabel" for="infvpc-trackList-formatInput">label</label>
		    <input type="radio" id="infvpc-trackList-formatInput" >
		</span>

		<div class="infvpc-trackList-formatform infvp-trackList-formatform infvp-trackList-urlForm">
			<div class="infvp-trackList-urlForm">
	            <label  for="infvpc-trackList-srcInputUrl">Track URL:</label>
	            <input type='text' id='infvpc-trackList-srcInputUrl' />
			</div>
			<div class="infvp-trackList-uploadedFileForm">
	            <label  for="infvpc-trackList-srcInputFile">Track File Name:</label>
	            <select id="infvpc-trackList-srcInputFile">
					<option value="">options not loaded yet</option>
	            </select>
			</div>
	        <label for="srcLangInput">Language:</label>
	        <select id="srcLangInput">
				<option value="">options not loaded yet</option>
	        </select>
		</div>

	    <button class="infvpc-trackList-addTrack">Add this track</button>
	</div>

    <div>
        <input class="infvpc-insert" type="button" name="insertonlybutton" id="insertonlybutton" class="button" value="Insert into Post"  />
    </div>
</div>

<script>infusion_vp.videoPlayerPlugin(".embed-video-player-form");</script>
