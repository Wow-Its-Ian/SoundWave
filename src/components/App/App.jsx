import React, { useEffect, useState } from 'react';
import * as Tone from 'tone';
import '../../scss/index.scss';

const scaleC = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const scaleKeyboard = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const scales = {
	KEYBOARD: scaleKeyboard,
	C: scaleC
};

function App() {
	useEffect(() => {
		const newSynth = new Tone.PolySynth(Tone.Synth).toDestination();
		setSynth(newSynth);
	}, []);

	const [synth, setSynth] = useState(null);
	const [toneStarted, setToneStarted] = useState(false);
	const [playingScale, setPlayingScale] = useState(scales.KEYBOARD);
	const [playingOctave, setPlayingOctave] = useState(4);

	function playNote(note) {
		if(!synth) {
			return;
		}

		if(!toneStarted) {
			Tone.start();
			setToneStarted(true);
		}

		const now = Tone.now();

		synth.triggerAttackRelease(note, '4n', now);
		// synth.triggerAttackRelease(noteChange({note: note, change: 2}), '4n', now);
		// synth.triggerAttackRelease(noteChange({note: note, change: 4}), '4n', now);
	}

	function noteChange({scale = playingScale, note, change}) {
		if(!note || !change) {
			console.log('no note or change');

			return note;
		}

		const [scaleNote, octave] = note.split('');
		const octaveNumber = parseInt(octave);
		const indexAfterChange = (scale.indexOf(scaleNote) + change);
		const octaveChange = Math.floor(indexAfterChange / scale.length);
		const loopedIndex = (scale.indexOf(scaleNote) + change) % scale.length;
		const newNote = scale[loopedIndex] + (octaveNumber + octaveChange);

		return newNote;
	}

	return (
		<div className="container">
			<div className="intro-container">
				<h1>SoundWave</h1>
				<h3>So far, just a keyboard</h3>
			</div>

			<div className="piano-container">
				<div className='piano-keys-list'>
					{
						playingScale?.map((note, index) => {
							let noteToPlay = `${playingScale[index]}${playingOctave}`;
							
							return (
								<button className={`piano-keys ${noteToPlay.includes('#') ? 'black-key' : 'white-key'}`} key={noteToPlay} onClick={() => playNote(noteToPlay)}>
									<div className="note-name">{noteToPlay}</div>
								</button>
							);
						})
					}
			
					<button className={`piano-keys ${playingScale[0].includes('#') ? 'black-key' : 'white-key'}`} onClick={() => playNote(playingScale[0] + (playingOctave + 1))}>
						<div className="note-name">{playingScale[0] + (playingOctave + 1)}</div>
					</button>
				</div>
			</div>
		</div>
	);
}

export default App;