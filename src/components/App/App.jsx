import React, { useEffect, useState, useEffectEvent } from 'react';
import * as Tone from 'tone';
import '../../scss/index.scss';

const scaleC = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const scaleKeyboard = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const keyboardToPiano = {
	// WHITE KEYS
	z: 'C',
	x: 'D',
	c: 'E',
	v: 'F',
	b: 'G',
	n: 'A',
	m: 'B',
	// BLACK KEYS
	s: 'C#',
	d: 'D#',
	g: 'F#',
	h: 'G#',
	j: 'A#',
};

const scales = {
	KEYBOARD: scaleKeyboard,
	C: scaleC
};

const App = () => {
	useEffect(() => {
		const newSynth = new Tone.PolySynth(Tone.Synth).toDestination();
		setSynth(newSynth);
	}, []);

	useEffect(() => {
		// Add the event listener when the component mounts
		document.addEventListener('keydown', handleKeyDown);

		// Add the event listener when the component mounts
		document.addEventListener('keyup', handleKeyUp);

		// Remove the event listener when the component unmounts (cleanup)
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('keyup', handleKeyUp);
		};
  }, [handleKeyDown, handleKeyUp]); // Re-run effect only if handleKeyDown or handleKeyUp changes

	const [synth, setSynth] = useState(null);
	const [toneStarted, setToneStarted] = useState(false);
	const [playingScale, setPlayingScale] = useState(scales.KEYBOARD);
	const [playingOctave, setPlayingOctave] = useState(4);
	const [playingNotes, setPlayingNotes] = useState([]);

	const handleKeyDown = useEffectEvent((event) => {
		if (keyboardToPiano[event.key]) {
			const note = `${keyboardToPiano[event.key]}${playingOctave}`;

			if(playingNotes.includes(note)) {
				return;
			}

			startNote(note);
		} else if(event.key === ',') {
			const note = `${playingScale[0]}${playingOctave + 1}`;

			if(playingNotes.includes(note)) {
				return;
			}

			startNote(note);
		} else if(event.key === 'ArrowUp') {
			stopAllNotes();

			if(playingOctave < 8) {
				setPlayingOctave(playingOctave + 1);
			}
		} else if(event.key === 'ArrowDown') {
			stopAllNotes();

			if(playingOctave > 1) {
				setPlayingOctave(playingOctave - 1);
			}
		} else if(parseInt(event.key) && parseInt(event.key) > 0 && parseInt(event.key) < 9) {
			setPlayingOctave(parseInt(event.key));
		}
	}, []); // Use useCallback for a stable function reference

	const handleKeyUp = useEffectEvent((event) => {
		if (keyboardToPiano[event.key]) {
			const note = `${keyboardToPiano[event.key]}${playingOctave}`;
			stopNote(note);
		} else if(event.key === ',') {
			const note = `${playingScale[0]}${playingOctave + 1}`;
			stopNote(note);
		}
	}, []);

	const playNote = (note) => {
		if(!synth) {
			return;
		}

		if(playingNotes.includes(note)) {
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

		setPlayingNotes([...playingNotes, note]);
	};

	const startNote = (note) => {
		if(!synth) {
			return;
		}

		if(playingNotes.includes(note)) {
			return;
		}

		if(!toneStarted) {
			Tone.start();
			setToneStarted(true);
		}

		const now = Tone.now();
		synth.triggerAttackRelease(note, now);

		setPlayingNotes([...playingNotes, note]);
	};

	const stopNote = (note) => {
		const now = Tone.now();
		synth.triggerRelease(note, now);

		setPlayingNotes(playingNotes.filter((playingNote) => playingNote !== note));
	};

	const stopAllNotes = () => {
		playingNotes.forEach((note) => {
			stopNote(note);
		});
	};

	const noteChange = ({scale = playingScale, note, change}) => {
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
	};

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
};

export default App;