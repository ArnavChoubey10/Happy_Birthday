import { gsap } from "gsap";
import { useEffect, useState } from "react";
import "./CelebrationPage.css";
import Confetti from "./Confetti";

// ✅ Get Name From URL
const params = new URLSearchParams(window.location.search);
const recipientName = params.get("name") || "My Friend";

// Generate heart positions
const generateHeartPositions = () =>
  [...Array(15)].map(() => ({
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 4,
  }));

const heartPositions = generateHeartPositions();

function CelebrationPage({ onComplete, musicPlayerRef }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const [activatedButtons, setActivatedButtons] = useState({
    lights: false,
    music: false,
    decorate: false,
    balloons: false,
    message: false,
  });
  const [lightsOn, setLightsOn] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // QNA Slides (Updated with Name 🎂)
  const slides = [
    {
      icon: "✨",
      text: `It's Your Special Day ${recipientName}!`,
      type: "announcement",
    },
    {
      icon: "✨",
      text: `Do you wanna see what I made for you, ${recipientName}?`,
      type: "question",
      options: [
        { text: "Yes!", value: "yes" },
        { text: "No", value: "no" },
      ],
    },
    {
      icon: "✨",
      text: `Have a look at it, ${recipientName} 😎`,
      type: "announcement",
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      gsap.to(".slide-content", {
        opacity: 0,
        y: -30,
        duration: 0.4,
        onComplete: () => {
          setCurrentSlide(currentSlide + 1);
          gsap.fromTo(
            ".slide-content",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.5 }
          );
        },
      });
    } else {
      gsap.to(".slides-container", {
        opacity: 0,
        scale: 0.9,
        duration: 0.5,
        onComplete: () => setShowButtons(true),
      });
    }
  };

  const handleAnswer = (value) => {
    if (value === "no") {
      gsap.to(".question-options", {
        x: -20,
        duration: 0.1,
        yoyo: true,
        repeat: 5,
      });
    } else {
      handleNext();
    }
  };

  const showLightsButton = true;
  const showMusicButton = activatedButtons.lights;
  const showDecorateButton = activatedButtons.music;
  const showBalloonsButton = activatedButtons.decorate;
  const showMessageButton = activatedButtons.balloons;

  useEffect(() => {
    if (showButtons) {
      gsap.fromTo(
        ".celebration-buttons",
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
      );
    }
  }, [showButtons]);

  const handleButtonClick = (buttonType) => {
    if (activatedButtons[buttonType]) return;

    const button = document.querySelector(`[data-button="${buttonType}"]`);

    gsap.to(button, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
    });

    setActivatedButtons((prev) => ({ ...prev, [buttonType]: true }));

    if (buttonType === "lights") {
      setLightsOn(true);
      gsap.to(".celebration-page", {
        background:
          "linear-gradient(135deg, #1a0a1f 0%, #2d1b3d 50%, #1f0f29 100%)",
        duration: 1.5,
      });
      return;
    }

    if (buttonType === "music") {
      if (musicPlayerRef && musicPlayerRef.current) {
        musicPlayerRef.current.play();
      }
    }

    setTimeout(() => {
      const decoration = document.querySelector(`.decoration-${buttonType}`);

      if (!decoration) return;

      if (buttonType === "balloons") {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }

      gsap.fromTo(
        decoration,
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 1 }
      );
    }, 200);

    if (buttonType === "message") {
      setTimeout(() => onComplete && onComplete(), 1500);
    }
  };

  return (
    <div className={`celebration-page ${lightsOn ? "lights-on" : ""}`}>
      {showConfetti && <Confetti />}

      <div className="floating-hearts-bg">
        {heartPositions.map((pos, i) => (
          <div
            key={i}
            className="heart-float"
            style={{
              left: `${pos.left}%`,
              animationDelay: `${pos.delay}s`,
              animationDuration: `${pos.duration}s`,
            }}
          >
            💗
          </div>
        ))}
      </div>

      {!showButtons && (
        <div className="slides-container">
          <div className="slide-content">
            <div className="slide-icon">{slides[currentSlide].icon}</div>
            <h2 className="slide-text">{slides[currentSlide].text}</h2>

            {slides[currentSlide].type === "question" ? (
              <div className="question-options">
                {slides[currentSlide].options.map((option, index) => (
                  <button
                    key={index}
                    className={`option-button ${
                      option.value === "yes" ? "yes-button" : "no-button"
                    }`}
                    onClick={() => handleAnswer(option.value)}
                  >
                    {option.text} {option.value === "yes" && "👆"}
                  </button>
                ))}
              </div>
            ) : (
              <button className="next-button" onClick={handleNext}>
                {currentSlide < slides.length - 1 ? "Next" : "Let's Go! 🎉"}
              </button>
            )}
          </div>

          <div className="slide-progress">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`progress-dot ${
                  index === currentSlide ? "active" : ""
                } ${index < currentSlide ? "completed" : ""}`}
              />
            ))}
          </div>
        </div>
      )}

      {showButtons && (
        <>
          <div className="celebration-buttons">
            <h2 className="celebration-title">
              Let’s Celebrate, {recipientName}! 🎉
            </h2>
            <p className="celebration-subtitle">
              Click the buttons to decorate
            </p>

            <div className="buttons-grid">
              {showLightsButton && !activatedButtons.lights && (
                <button
                  className="action-button lights-button"
                  data-button="lights"
                  onClick={() => handleButtonClick("lights")}
                >
                  💡 Turn On the Lights
                </button>
              )}

              {showMusicButton && !activatedButtons.music && (
                <button
                  className="action-button music-button"
                  data-button="music"
                  onClick={() => handleButtonClick("music")}
                >
                  🎵 Play Music
                </button>
              )}

              {showDecorateButton && !activatedButtons.decorate && (
                <button
                  className="action-button decorate-button"
                  data-button="decorate"
                  onClick={() => handleButtonClick("decorate")}
                >
                  🎨 Decorate
                </button>
              )}

              {showBalloonsButton && !activatedButtons.balloons && (
                <button
                  className="action-button balloons-button"
                  data-button="balloons"
                  onClick={() => handleButtonClick("balloons")}
                >
                  🎈 Fly the Balloons
                </button>
              )}

              {showMessageButton && (
                <button
                  className="action-button message-button"
                  data-button="message"
                  onClick={() => handleButtonClick("message")}
                >
                  💌 I Have a Message for You {recipientName}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CelebrationPage;
