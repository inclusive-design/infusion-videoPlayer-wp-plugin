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
	<div class="infvpc-captionList-new">
		<table class="infvpc-trackList infvp-transcriptList" border="0">
			<tr class="infvpc-trackList-trackRow">
				<td><button type="button" class="infvpc-trackList-trackDelete">del</button></td>
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
	            <input type='text' id='infvpc-trackList-srcInputUrl' class='infvpc-trackList-srcInputUrl' />
			</div>
			<div class="infvp-trackList-uploadedFileForm">
	            <label  for="infvpc-trackList-srcInputFile">Track File Name:</label>
	            <select id="infvpc-trackList-srcInputFile" class="infvpc-trackList-srcInputFile">
					<option value="">options not loaded yet</option>
	            </select>
			</div>
	        <label for="infvpc-trackList-srcLangInput">Language:</label>
	        <select id="infvpc-trackList-srcLangInput" class="infvpc-trackList-srcLangInput">
				<option value="">options not loaded yet</option>
	        </select>
		</div>

	    <button class="infvpc-trackList-addTrack">Add this caption</button>
	</div>

    <h2>Transcripts</h2>
	<div class="infvpc-transcriptList-new">
		<table class="infvpc-trackList infvp-transcriptList" border="0">
			<tr class="infvpc-trackList-trackRow">
				<td><button type="button" class="infvpc-trackList-trackDelete">del</button></td>
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
	            <input type='text' id='infvpc-trackList-srcInputUrl' class='infvpc-trackList-srcInputUrl' />
			</div>
			<div class="infvp-trackList-uploadedFileForm">
	            <label  for="infvpc-trackList-srcInputFile">Track File Name:</label>
	            <select id="infvpc-trackList-srcInputFile" class="infvpc-trackList-srcInputFile">
					<option value="">options not loaded yet</option>
	            </select>
			</div>
	        <label for="infvpc-trackList-srcLangInput">Language:</label>
	        <select id="infvpc-trackList-srcLangInput" class="infvpc-trackList-srcLangInput">
				<option value="">options not loaded yet</option>
	        </select>
		</div>

	    <button class="infvpc-trackList-addTrack">Add this transcript</button>
	</div>

    <div>
        <input class="infvpc-insert" type="button" name="insertonlybutton" id="insertonlybutton" class="button" value="Insert into Post"  />
    </div>
</div>

<script>infusion_vp.videoPlayerPlugin(".embed-video-player-form");</script>
