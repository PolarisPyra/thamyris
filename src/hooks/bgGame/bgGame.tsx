import React, { useEffect, useRef, useState } from "react";

import { motion } from "framer-motion";

import "./bgGame.css";

const LANES = 7;
const LANE_COLORS = ["#FF4136", "#2ECC40", "#0074D9", "#FF4136", "#2ECC40", "#0074D9"];
const NOTE_SPEED = 100;

type Note = {
	id: number;
	lane: number;
	position: number;
	color: string;
	timestamp: number;
};

const BgGame = () => {
	const [notes, setNotes] = useState<Note[]>([]);
	const trackRef = useRef<any>(null);
	const gameTimerRef = useRef<any>(null);
	const noteGeneratorRef = useRef<any>(null);

	useEffect(() => {
		startGame();

		return () => {
			clearInterval(noteGeneratorRef.current);
			clearTimeout(gameTimerRef.current);
		};
	}, []);

	const startGame = () => {
		setNotes([]);

		noteGeneratorRef.current = setInterval(() => {
			generateNote();
		}, 250) as any;
	};

	const generateNote = () => {
		const lane = Math.floor(Math.random() * LANES);
		const id = Date.now() + Math.random();

		setNotes(
			(prevNotes) =>
				[
					...prevNotes,
					{
						id,
						lane,
						color: LANE_COLORS[lane - 1],
						timestamp: Date.now(),
					},
				] as any
		);

		// Remove the note after it passes the hit zone
		setTimeout(() => {
			setNotes((prevNotes) => {
				const noteIndex = prevNotes.findIndex((note: any) => note.id === id);
				if (noteIndex !== -1) {
					return prevNotes.filter((note: any) => note.id !== id);
				}
				return prevNotes;
			});
		}, NOTE_SPEED + 3000); // A little buffer time
	};

	return (
		<div className="rhythm-game">
			<motion.div className="track-container" ref={trackRef}>
				<motion.div className="track">
					{Array.from({ length: LANES + 1 }).map((_, index) => {
						return (
							<motion.div
								key={`divider-${index}`}
								className="lane-divider"
								style={{
									...(index > 3
										? { left: `calc(${(index / LANES) * 100}% + 5%)` }
										: { left: `calc(${(index / LANES) * 100}% - 5%)` }),
									backgroundColor: index > 0 && index < LANES ? LANE_COLORS[index - 1] : "#FFA500",
								}}
							/>
						);
					})}
					<motion.div className="hit-line" />
					{notes.map((note) => (
						<motion.div
							key={note.id}
							className="note"
							style={{
								...(note.lane > 3
									? { left: `calc(${(note.lane / LANES) * 100}% + 5%)` }
									: { left: `calc(${(note.lane / LANES) * 100}% - 5%)` }),
								marginLeft: "-20px",
							}}
							initial={{ y: 0 }}
							animate={{
								y: "10000%",
								transition: {
									duration: NOTE_SPEED / 40,
									ease: "linear",
								},
							}}
							onUpdate={() => {
								// Update note position for hit detection (0-100%)
								const elem = document.querySelector(`[data-note-id="${note.id}"]`);
								if (elem) {
									const trackHeight = trackRef.current.clientHeight;
									const noteTop = elem.getBoundingClientRect().top;
									const trackTop = trackRef.current.getBoundingClientRect().top;
									const relativePosition = ((noteTop - trackTop) / trackHeight) * 100;

									setNotes((prev) => prev.map((n) => (n.id === note.id ? { ...n, position: relativePosition } : n)));
								}
							}}
							data-note-id={note.id}
						>
							<motion.div className="note-circle" style={{ backgroundColor: note.color }} />
						</motion.div>
					))}
				</motion.div>
			</motion.div>
		</div>
	);
};

export const useBgGame = () => {
	const [showBgGame, setShowBgGame] = useState(true);
	return { showBgGame, setShowBgGame };
};

export default BgGame;
