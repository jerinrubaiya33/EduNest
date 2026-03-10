import React from 'react';
import styled from 'styled-components'; // Add this import
import { ArrowRight } from 'lucide-react';

const SIZE_MAP = {
  xxs: {
    maxWidth: '112px',
    height: '30px',
    fontSize: '12px',
    padding: '0.3em 0.65em',
  },
  xs: {
    maxWidth: '105px',
    height: '32px',
    fontSize: '13px',
    padding: '0.4em 0.7em',
  },
  sm: {
    maxWidth: '132px',
    height: '36px',
    fontSize: '14px',
    padding: '0.5em 0.85em',
  },
  md: {
    maxWidth: '165px',
    height: '44px',
    fontSize: '15px',
    padding: '0.625em 1em',
  },
  lg: {
    maxWidth: '210px',
    height: '50px',
    fontSize: '16px',
    padding: '0.7em 1.15em',
  },
};

const AnimatedButton = ({
  onClick,
  type = 'button',
  disabled = false,
  size = 'md',
  primaryText = 'View Course',
  secondaryText = "Let's Go!",
  showArrow = false,
  fullWidth = false,
  primaryTextColor = '#ffffff',
  secondaryTextColor = '#ffffff',
  className = '',
}) => {
  const activeSize = SIZE_MAP[size] || SIZE_MAP.md;

  return (
    <StyledWrapper
      className={className}
      $height={activeSize.height}
      $maxWidth={activeSize.maxWidth}
      $fontSize={activeSize.fontSize}
      $padding={activeSize.padding}
      $fullWidth={fullWidth}
      $primaryTextColor={primaryTextColor}
      $secondaryTextColor={secondaryTextColor}
      $disabled={disabled}
    >
      <button type={type} onClick={onClick} disabled={disabled}>
        <div>
          <span>
            <p className='button-text'>
              {primaryText}
              {showArrow ? <ArrowRight size={16} strokeWidth={2.5} /> : null}
            </p>
          </span>
        </div>
        <div>
          <span>
            <p className='text-center'>{secondaryText}</p>
          </span>
        </div>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  width: ${(props) => (props.$fullWidth ? '100%' : 'fit-content')};

  button {
    outline: 0;
    border: 0;
    display: flex;
    flex-direction: column;
    width: ${(props) => (props.$fullWidth ? '100%' : props.$maxWidth)};
    max-width: ${(props) => (props.$fullWidth ? '100%' : props.$maxWidth)};
    height: ${(props) => props.$height};
    border-radius: 0.2em;
    overflow: hidden;
    cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
    opacity: ${(props) => (props.$disabled ? 0.7 : 1)};
  }

  button div {
    transform: translateY(0px);
    width: 100%;
  }

  button,
  button div {
    transition: 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  button div span {
    display: flex;
    align-items: center;
    justify-content: center;
    height: ${(props) => props.$height};
    padding: ${(props) => props.$padding};
  }

  button div:nth-child(1) p {
    width: 100%;
    text-align: center;
    color: ${(props) => props.$primaryTextColor};
  }

  button div:nth-child(1) {
    background-color: #184ef0;
  }

  button div:nth-child(2) {
    background-color: #f97316;
  }

  button div:nth-child(2) span {
    justify-content: center;
  }

  button div:nth-child(2) p {
    width: 100%;
    text-align: center;
    color: ${(props) => props.$secondaryTextColor};
  }

  button:hover div {
    transform: translateY(calc(-1 * ${(props) => props.$height}));
  }

  button:disabled:hover div {
    transform: translateY(0);
  }

  button p {
    font-size: ${(props) => props.$fontSize};
    font-weight: bold;
  }

  button .button-text {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  button:active {
    transform: scale(0.95);
  }
`;

export default AnimatedButton;
