import React, { useEffect, useState } from 'react';
import * as Tone from "tone";
import '../../scss/index.scss';

const scaleC = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const scales = {
	C: scaleC
};

function App() {
	useEffect(() => {
		const newSynth = new Tone.PolySynth(Tone.Synth).toDestination();
		setSynth(newSynth);
	}, []);

	const [synth, setSynth] = useState(null);
	const [toneStarted, setToneStarted] = useState(false);
	const [playingScale, setPlayingScale] = useState(scales.C);
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

		synth.triggerAttackRelease(note, "1n", now);
		synth.triggerAttackRelease(noteChange({note: note, change: 2}), "1n", now);
		synth.triggerAttackRelease(noteChange({note: note, change: 4}), "1n", now);
	}

	function noteChange({scale = playingScale, note, change}) {
		if(!note || !change) {
			console.log('no note or change');

			return note;
		}

		const [scaleNote, octave] = note.split('');
		const octaveNumber = parseInt(octave);

		const octaveChange = Math.floor(change / playingScale.length);

		const loopedIndex = (playingScale.indexOf(scaleNote) + change) % playingScale.length;

		const newNote = playingScale[loopedIndex] + (octaveNumber + octaveChange);
		console.log('newNote: ', newNote);
		return newNote;
	}

	return (
		<div>
			{

				playingScale?.map((note, index) => {
					let noteToPlay = `${playingScale[index]}${playingOctave}`;
					console.log('noteToPlay: ', noteToPlay);

					return (
						<button key={noteToPlay} onClick={() => playNote(noteToPlay)}>{noteToPlay}</button>
					);
				})
			}
	
			<button onClick={() => playNote(playingScale[0] + (playingOctave + 1))}>{playingScale[0] + (playingOctave + 1)}</button>
		</div>
	);
}

export default App;