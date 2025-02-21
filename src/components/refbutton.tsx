import React from 'react';
import styled from 'styled-components';
import {RotateCcw} from "lucide-react"

const RefButton = () => {
  return (
    <StyledWrapper>
      <div className="container">
        <button className="button"><RotateCcw size={20} className="text-cyan-400" /></button>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  button {
    font-size: 1.4em;
    padding: 0.6em 0.8em;
    border-radius: 30px;
    border: none;
    background-color: #000;
    color: #fff;
    cursor: pointer;
    box-shadow: 2px 2px 3px #000000b4;
  }

  .container {
    position: relative;
    padding: 3px;
    background: linear-gradient(90deg, #03a9f4, #f441a5);
    border-radius: 30px;
    transition: all 0.4s ease;
  }

  .container::before {
    content: "";
    position: absolute;
    inset: 0;
    margin: auto;
    border-radius: 0.9em;
    z-index: -10;
    filter: blur(0);
    transition: filter 0.4s ease;
  }

  .container:hover::before {
    background: linear-gradient(90deg, #03a9f4, #f441a5);
    filter: blur(1.2em);
  }
  .container:active::before {
    filter: blur(0.2em);
  }`;

export default RefButton;
