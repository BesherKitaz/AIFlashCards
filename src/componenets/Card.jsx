import React, { useState, useRef, useEffect } from "react";
import '../css/card.css'



const CardSide = ({ side, cardFlipped, setCardFlipped, text }) => {
    return (
        <div className={`card-${side} d-flex flex-column space-between pt-5 p-3 p-md-4 p-lg-5`}> 
            <div>
                {text}
            </div>
            <div>
                <button onClick={() => setCardFlipped(!cardFlipped)} className="cardButton">
                    Reveal Answer
                </button>
            </div>
        </div>
    )
}

export default function Card({ topMargin, shouldSlideLeft, shouldSlideRight, question, answer }) {
    const [cardFlipped, setCardFlipped] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: topMargin }); // Initial position
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [thrown, setThrown] = useState(false);
    const offset = useRef({ x: 0, y: 0 });
    const initialMouseX = useRef(0);
    const positionRef = useRef(position);

    const SWIPE_THRESHOLD = 600; // px, adjust as needed

    useEffect(() => {
        if (shouldSlideLeft) {
            setRotation(-30); // or +30 for right swipe
            setPosition(prev => ({
                x: prev.x - 1500,
                y: prev.y,  
            }));
        }
        if (shouldSlideRight) {
            setRotation(30); // or -30 for left swipe
            setPosition(prev => ({
                x: prev.x + 1500,
                y: prev.y,
            }));
        }
    }, [shouldSlideLeft, shouldSlideRight]);

    const handleMouseDown = (e) => {
        setIsMouseDown(true);
        setDragging(true);
        // Calculate offset between mouse and card
        offset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };
        initialMouseX.current = e.clientX;
        // Prevent text selection while dragging
        document.body.style.userSelect = "none";
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (dragging) {
                setPosition({
                    x: e.clientX - offset.current.x,
                    y: e.clientY - offset.current.y,
                });
                // Calculate horizontal drag distance from initial mouse X
                const deltaX = e.clientX - initialMouseX.current;
                // Clamp angle between -30deg and +30deg
                const maxAngle = 60;
                const angle = Math.max(-maxAngle, Math.min(maxAngle, deltaX / 30));
                setRotation(angle);
            }
        };

        const handleMouseUp = () => {
            setIsMouseDown(false);
            setDragging(false);

            // Use the ref for latest position
            console.log(positionRef.current.x);
            console.log(typeof positionRef.current.x);

            if (Math.abs(positionRef.current.x) > SWIPE_THRESHOLD || Math.abs(rotation) > 30) {
                setThrown(true);
                setRotation(rotation * 2);
                setPosition(prev => ({
                    x: prev.x,
                    y: window.innerHeight
                }));
            } else {
                setRotation(0);
                setPosition({
                    x: 0,
                    y: topMargin,
                });
            }
            document.body.style.userSelect = "";
        };

        if (dragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [dragging, topMargin]);

    useEffect(() => {
        positionRef.current = position;
    }, [position]);

    return (
        <div
            className={`card${isMouseDown ? ' rotating' : ''}`}
            style={{
                top: position.y,
                left: position.x,
                transform: `rotate(${rotation}deg)`,
            }}
            onMouseDown={handleMouseDown}
        >
            <div className={`card-inner${cardFlipped ? ' flipped' : ''}`} >
                <CardSide side="front" cardFlipped={cardFlipped} setCardFlipped={setCardFlipped} text={question} />
                <CardSide side="back" cardFlipped={cardFlipped} setCardFlipped={setCardFlipped} text={answer} />
            </div>
        </div>
    )
}