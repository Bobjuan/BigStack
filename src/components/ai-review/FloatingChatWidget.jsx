import React, { useState, useRef } from 'react';
import RandomQuestionsChat from './RandomQuestionsChat';
import './PokerChatbot.css';

const CHIP_ANIMATION_DURATION = 200; // ms
const CARD_ANIMATION_DURATION = 300; // ms, matches 0.3s in CSS
const DEFAULT_WIDTH = 370;
const DEFAULT_HEIGHT = 500;
const NAVBAR_HEIGHT = 64; // px
const BOTTOM_MARGIN = 24; // px

const FloatingChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [buttonAnim, setButtonAnim] = useState(false);
  const [closing, setClosing] = useState(false);
  const [dimensions, setDimensions] = useState({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT });
  const [resizing, setResizing] = useState(null); // 'top', 'left', 'corner', or null
  const [offset, setOffset] = useState({ top: null, bottom: BOTTOM_MARGIN }); // for vertical position when resizing top
  const startPos = useRef({ x: 0, y: 0, width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT, top: null, bottom: BOTTOM_MARGIN });
  const resizingRef = useRef(null);
  const dimensionsRef = useRef(dimensions);
  const offsetRef = useRef(offset);

  React.useEffect(() => {
    dimensionsRef.current = dimensions;
  }, [dimensions]);
  React.useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);

  const handleOpen = () => {
    setButtonAnim(true);
    setTimeout(() => {
      setButtonAnim(false);
      setOpen(true);
    }, CHIP_ANIMATION_DURATION);
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, CARD_ANIMATION_DURATION);
  };

  // --- Resizing logic ---
  const onResizeMove = (e) => {
    if (!resizingRef.current) return;
    let newWidth = dimensionsRef.current.width;
    let newTop = offsetRef.current.top;
    let newBottom = offsetRef.current.bottom;
    if (resizingRef.current === 'left' || resizingRef.current === 'corner') {
      newWidth = Math.max(DEFAULT_WIDTH, startPos.current.width - (e.clientX - startPos.current.x));
    }
    if (resizingRef.current === 'top' || resizingRef.current === 'corner') {
      const deltaY = e.clientY - startPos.current.y;
      let candidateTop = startPos.current.top + deltaY;
      // Clamp so top edge never goes above NAVBAR_HEIGHT
      candidateTop = Math.max(NAVBAR_HEIGHT, candidateTop);
      // Clamp so bottom edge never goes below BOTTOM_MARGIN
      const maxTop = window.innerHeight - BOTTOM_MARGIN - DEFAULT_HEIGHT;
      candidateTop = Math.min(candidateTop, maxTop);
      newTop = candidateTop;
      newBottom = BOTTOM_MARGIN;
    }
    setDimensions({ width: newWidth, height: dimensionsRef.current.height });
    if (resizingRef.current === 'top' || resizingRef.current === 'corner') {
      setOffset({ top: newTop, bottom: newBottom });
    }
  };

  const onResizeEnd = () => {
    setResizing(null);
    resizingRef.current = null;
    document.removeEventListener('mousemove', onResizeMove);
    document.removeEventListener('mouseup', onResizeEnd);
  };

  const onResizeStart = (e, direction) => {
    e.preventDefault();
    setResizing(direction);
    resizingRef.current = direction;
    // Calculate current top offset
    const rect = e.target.closest('.floating-widget-root')?.getBoundingClientRect() || e.target.parentElement.getBoundingClientRect();
    const currentTop = rect ? rect.top : window.innerHeight - BOTTOM_MARGIN - DEFAULT_HEIGHT;
    startPos.current = {
      x: e.clientX,
      y: e.clientY,
      width: dimensionsRef.current.width,
      height: dimensionsRef.current.height,
      top: currentTop,
      bottom: BOTTOM_MARGIN,
    };
    setOffset({ top: currentTop, bottom: BOTTOM_MARGIN });
    document.addEventListener('mousemove', onResizeMove);
    document.addEventListener('mouseup', onResizeEnd);
  };
  // --- End resizing logic ---

  // Calculate style for popup position
  const popupStyle = {
    width: dimensions.width,
    maxWidth: '95vw',
    minWidth: DEFAULT_WIDTH,
    minHeight: DEFAULT_HEIGHT,
    userSelect: resizing ? 'none' : 'auto',
    right: 24,
    top: offset.top == null ? 'auto' : offset.top,
    bottom: offset.bottom,
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <>
      {/* Floating Button */}
      {!open && !closing && (
        <button
          onClick={handleOpen}
          className={`fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg poker-chip-anim ${buttonAnim ? 'poker-chip-bounce-spin' : ''}`}
          aria-label="Open chat"
        >
          <i className="fas fa-comments text-2xl"></i>
        </button>
      )}

      {/* Chat Popup */}
      {(open || closing) && (
        <div
          className={`floating-widget-root fixed z-50 bg-[#1b1f2b] rounded-xl shadow-2xl border border-gray-700 flex flex-col ${closing ? 'poker-popup-slide-out' : 'poker-popup-slide-in'}`}
          style={popupStyle}
        >
          {/* Resizer handles */}
          {/* Visual indicator for corner resize */}
          <div className="absolute top-0 left-0 w-4 h-4 z-60 pointer-events-none flex items-start justify-start">
            <svg width="16" height="16" className="block" style={{opacity:0.7}}>
              <line x1="2" y1="14" x2="14" y2="2" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" />
              <line x1="6" y1="14" x2="14" y2="6" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div
            className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize z-50 bg-transparent"
            onMouseDown={(e) => onResizeStart(e, 'corner')}
            style={{ zIndex: 60 }}
          />
          <div
            className="absolute top-0 left-3 right-0 h-3 cursor-n-resize z-50 bg-transparent"
            onMouseDown={(e) => onResizeStart(e, 'top')}
            style={{ zIndex: 60 }}
          />
          <div
            className="absolute top-3 left-0 bottom-0 w-3 cursor-w-resize z-50 bg-transparent"
            onMouseDown={(e) => onResizeStart(e, 'left')}
            style={{ zIndex: 60 }}
          />
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700 bg-[#23273a] rounded-t-xl select-none">
            <span className="font-semibold text-white">Poker AI Assistant</span>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white text-xl"
              aria-label="Close chat"
            >
              &times;
            </button>
          </div>
          <div className="flex-1 overflow-hidden rounded-none min-h-[320px]">
            <RandomQuestionsChat isWidget />
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatWidget; 