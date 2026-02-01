import { useNavigate } from 'react-router-dom';
import TextType from './TextType';
import './Home.css';
import './HeroAnimation.css';

export default function Hero() {
  const navigate = useNavigate();
  console.log('Hero component rendered');

  return (
    <section className="hero-section">
      {/* Animated background with neural network effect */}
      <div className="hero-bg">
        <div className="animated-gradient"></div>
        <div className="neural-network">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="neural-node" style={{
              animationDelay: `${i * 0.1}s`
            }}></div>
          ))}
        </div>
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`
            }}></div>
          ))}
        </div>
        <div className="glow-orb glow-orb-1"></div>
        <div className="glow-orb glow-orb-2"></div>
      </div>
  
      <div className="hero-content">
        <div className="hero-badge">
          ✨ THE PREMIER TECH EVENT
        </div>

        <h1 className="hero-title" style={{ color: 'white', fontSize: '3rem' }}>
          AI ITRI NTIC EVENT 2026
        </h1>

        <p className="hero-subtitle" style={{ color: 'white', fontSize: '1.5rem' }}>
          <TextType 
              text={["Don't follow the future", "reinvent it !"]}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor
              cursorCharacter="_"
              deletingSpeed={50}
              variableSpeedEnabled={false}
              variableSpeedMin={60}
              variableSpeedMax={120}
              cursorBlinkDuration={0.5}
          />
        </p>

        <p className="hero-location" style={{ color: 'white', fontSize: '1.1rem' }}>
          📍 Tanger, Morocco
        </p>

        <div className="hero-buttons">
          <button
            className="btn btn-primary-gradient"
            onClick={() => navigate('/reservation')}
            style={{ padding: '14px 32px', borderRadius: '50px', border: 'none', backgroundColor: '#006AD7', color: 'white', cursor: 'pointer' }}
          >
            Reserve Your Seat
          </button>
          <button
            className="btn btn-outline-white"
            onClick={() => navigate('/program')}
            style={{ padding: '14px 32px', borderRadius: '50px', border: '2px solid white', backgroundColor: 'transparent', color: 'white', cursor: 'pointer' }}
          >
            View Program
          </button>
        </div>
      </div>
    </section>
  );
}
