function ETHIc(props) {
  if (props.onClick) {
    return (
      <button onClick={props.onClick} className="linkButton" type="button">
        <svg
          width={props.size}
          height={props.size}
          viewBox="0 0 188 236"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill={props.color}
            d="M187.2,120.9c0-0.1,0.1-0.1,0.1-0.2c0.1-0.3,0.2-0.5,0.3-0.8c0-0.1,0-0.1,0.1-0.2c0.1-0.3,0.2-0.6,0.2-0.8c0,0,0,0,0,0 c0-0.3,0.1-0.6,0.1-0.9c0,0,0-0.1,0-0.1c0-0.3,0-0.6-0.1-0.9c0-0.1,0-0.1,0-0.2c-0.1-0.3-0.1-0.6-0.2-0.9c0,0,0,0,0-0.1 c-0.1-0.2-0.1-0.3-0.2-0.5c0-0.1-0.1-0.2-0.1-0.3c0-0.1-0.1-0.1-0.1-0.2c-0.1-0.3-0.3-0.5-0.5-0.7c0,0,0,0,0,0l-88-112c0,0,0,0,0,0 c-0.1-0.1-0.2-0.3-0.3-0.4c0,0,0-0.1-0.1-0.1c-0.1-0.1-0.3-0.3-0.5-0.4c0,0-0.1-0.1-0.1-0.1c-0.1-0.1-0.2-0.2-0.4-0.3 c-0.1,0-0.1-0.1-0.2-0.1c-0.1-0.1-0.3-0.1-0.4-0.2c-0.1,0-0.1-0.1-0.2-0.1c-0.1-0.1-0.3-0.1-0.4-0.2c-0.1,0-0.1,0-0.2-0.1 c-0.1,0-0.3-0.1-0.4-0.1c-0.1,0-0.1,0-0.2,0c-0.2,0-0.3-0.1-0.5-0.1c-0.1,0-0.1,0-0.2,0c-0.2,0-0.4,0-0.7,0c-0.2,0-0.4,0-0.7,0 c-0.1,0-0.1,0-0.2,0c-0.2,0-0.3,0-0.5,0.1c-0.1,0-0.1,0-0.2,0c-0.1,0-0.3,0.1-0.4,0.1c-0.1,0-0.1,0-0.2,0.1 c-0.1,0.1-0.3,0.1-0.4,0.2c-0.1,0-0.1,0.1-0.2,0.1c-0.1,0.1-0.3,0.1-0.4,0.2c-0.1,0-0.1,0.1-0.2,0.1c-0.1,0.1-0.3,0.2-0.4,0.3 c0,0-0.1,0.1-0.1,0.1c-0.2,0.1-0.3,0.3-0.5,0.4c0,0-0.1,0.1-0.1,0.1c-0.1,0.1-0.2,0.3-0.3,0.4c0,0,0,0,0,0l-88,112c0,0,0,0,0,0 c-0.2,0.2-0.3,0.5-0.5,0.8c0,0-0.1,0.1-0.1,0.1c0,0.1-0.1,0.2-0.1,0.3c-0.1,0.2-0.1,0.3-0.2,0.5c0,0,0,0,0,0 c-0.1,0.3-0.2,0.6-0.2,0.9c0,0,0,0.1,0,0.1c0,0.3-0.1,0.6-0.1,0.9c0,0,0,0.1,0,0.1c0,0.3,0,0.6,0.1,0.9c0,0,0,0,0,0 c0,0.3,0.1,0.6,0.2,0.9c0,0.1,0,0.1,0,0.2c0.1,0.3,0.2,0.5,0.3,0.8c0,0,0.1,0.1,0.1,0.1c0.1,0.3,0.3,0.5,0.5,0.8c0,0,0,0,0,0l88,112 c0,0,0,0,0,0c0.1,0.1,0.2,0.3,0.3,0.4c0,0,0.1,0.1,0.1,0.1c0.1,0.1,0.3,0.3,0.5,0.4c0,0,0.1,0.1,0.1,0.1c0.1,0.1,0.3,0.2,0.4,0.3 c0.1,0,0.1,0.1,0.2,0.1c0.1,0.1,0.3,0.1,0.4,0.2c0.1,0,0.1,0.1,0.2,0.1c0.1,0.1,0.3,0.1,0.4,0.2c0.1,0,0.1,0,0.2,0.1 c0.1,0,0.3,0.1,0.4,0.1c0.1,0,0.1,0,0.2,0c0.2,0,0.3,0.1,0.5,0.1c0.1,0,0.1,0,0.2,0c0.2,0,0.4,0,0.7,0s0.4,0,0.7,0 c0.1,0,0.1,0,0.2,0c0.2,0,0.3,0,0.5-0.1c0.1,0,0.1,0,0.2,0c0.2,0,0.3-0.1,0.5-0.1c0.1,0,0.1,0,0.2-0.1c0.1-0.1,0.3-0.1,0.4-0.2 c0.1,0,0.1-0.1,0.2-0.1c0.1-0.1,0.3-0.1,0.4-0.2c0.1,0,0.1-0.1,0.2-0.1c0.1-0.1,0.3-0.2,0.4-0.3c0,0,0.1-0.1,0.1-0.1 c0.2-0.1,0.3-0.3,0.5-0.4c0,0,0-0.1,0.1-0.1c0.1-0.1,0.2-0.3,0.4-0.4c0,0,0,0,0,0l88-112c0,0,0,0,0,0 C186.9,121.4,187.1,121.2,187.2,120.9z M100,23.3l72.6,92.4l-72.6,33V23.3z M88,148.7l-72.6-33L88,23.3V148.7z M88,161.9v50.8 l-62.1-79L88,161.9z M100,161.9l62.1-28.2l-62.1,79V161.9z"
          />
        </svg>
      </button>
    );
  }

  return (
    <svg
      width={props.size}
      height={props.size}
      viewBox="0 0 188 236"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill={props.color}
        d="M187.2,120.9c0-0.1,0.1-0.1,0.1-0.2c0.1-0.3,0.2-0.5,0.3-0.8c0-0.1,0-0.1,0.1-0.2c0.1-0.3,0.2-0.6,0.2-0.8c0,0,0,0,0,0 c0-0.3,0.1-0.6,0.1-0.9c0,0,0-0.1,0-0.1c0-0.3,0-0.6-0.1-0.9c0-0.1,0-0.1,0-0.2c-0.1-0.3-0.1-0.6-0.2-0.9c0,0,0,0,0-0.1 c-0.1-0.2-0.1-0.3-0.2-0.5c0-0.1-0.1-0.2-0.1-0.3c0-0.1-0.1-0.1-0.1-0.2c-0.1-0.3-0.3-0.5-0.5-0.7c0,0,0,0,0,0l-88-112c0,0,0,0,0,0 c-0.1-0.1-0.2-0.3-0.3-0.4c0,0,0-0.1-0.1-0.1c-0.1-0.1-0.3-0.3-0.5-0.4c0,0-0.1-0.1-0.1-0.1c-0.1-0.1-0.2-0.2-0.4-0.3 c-0.1,0-0.1-0.1-0.2-0.1c-0.1-0.1-0.3-0.1-0.4-0.2c-0.1,0-0.1-0.1-0.2-0.1c-0.1-0.1-0.3-0.1-0.4-0.2c-0.1,0-0.1,0-0.2-0.1 c-0.1,0-0.3-0.1-0.4-0.1c-0.1,0-0.1,0-0.2,0c-0.2,0-0.3-0.1-0.5-0.1c-0.1,0-0.1,0-0.2,0c-0.2,0-0.4,0-0.7,0c-0.2,0-0.4,0-0.7,0 c-0.1,0-0.1,0-0.2,0c-0.2,0-0.3,0-0.5,0.1c-0.1,0-0.1,0-0.2,0c-0.1,0-0.3,0.1-0.4,0.1c-0.1,0-0.1,0-0.2,0.1 c-0.1,0.1-0.3,0.1-0.4,0.2c-0.1,0-0.1,0.1-0.2,0.1c-0.1,0.1-0.3,0.1-0.4,0.2c-0.1,0-0.1,0.1-0.2,0.1c-0.1,0.1-0.3,0.2-0.4,0.3 c0,0-0.1,0.1-0.1,0.1c-0.2,0.1-0.3,0.3-0.5,0.4c0,0-0.1,0.1-0.1,0.1c-0.1,0.1-0.2,0.3-0.3,0.4c0,0,0,0,0,0l-88,112c0,0,0,0,0,0 c-0.2,0.2-0.3,0.5-0.5,0.8c0,0-0.1,0.1-0.1,0.1c0,0.1-0.1,0.2-0.1,0.3c-0.1,0.2-0.1,0.3-0.2,0.5c0,0,0,0,0,0 c-0.1,0.3-0.2,0.6-0.2,0.9c0,0,0,0.1,0,0.1c0,0.3-0.1,0.6-0.1,0.9c0,0,0,0.1,0,0.1c0,0.3,0,0.6,0.1,0.9c0,0,0,0,0,0 c0,0.3,0.1,0.6,0.2,0.9c0,0.1,0,0.1,0,0.2c0.1,0.3,0.2,0.5,0.3,0.8c0,0,0.1,0.1,0.1,0.1c0.1,0.3,0.3,0.5,0.5,0.8c0,0,0,0,0,0l88,112 c0,0,0,0,0,0c0.1,0.1,0.2,0.3,0.3,0.4c0,0,0.1,0.1,0.1,0.1c0.1,0.1,0.3,0.3,0.5,0.4c0,0,0.1,0.1,0.1,0.1c0.1,0.1,0.3,0.2,0.4,0.3 c0.1,0,0.1,0.1,0.2,0.1c0.1,0.1,0.3,0.1,0.4,0.2c0.1,0,0.1,0.1,0.2,0.1c0.1,0.1,0.3,0.1,0.4,0.2c0.1,0,0.1,0,0.2,0.1 c0.1,0,0.3,0.1,0.4,0.1c0.1,0,0.1,0,0.2,0c0.2,0,0.3,0.1,0.5,0.1c0.1,0,0.1,0,0.2,0c0.2,0,0.4,0,0.7,0s0.4,0,0.7,0 c0.1,0,0.1,0,0.2,0c0.2,0,0.3,0,0.5-0.1c0.1,0,0.1,0,0.2,0c0.2,0,0.3-0.1,0.5-0.1c0.1,0,0.1,0,0.2-0.1c0.1-0.1,0.3-0.1,0.4-0.2 c0.1,0,0.1-0.1,0.2-0.1c0.1-0.1,0.3-0.1,0.4-0.2c0.1,0,0.1-0.1,0.2-0.1c0.1-0.1,0.3-0.2,0.4-0.3c0,0,0.1-0.1,0.1-0.1 c0.2-0.1,0.3-0.3,0.5-0.4c0,0,0-0.1,0.1-0.1c0.1-0.1,0.2-0.3,0.4-0.4c0,0,0,0,0,0l88-112c0,0,0,0,0,0 C186.9,121.4,187.1,121.2,187.2,120.9z M100,23.3l72.6,92.4l-72.6,33V23.3z M88,148.7l-72.6-33L88,23.3V148.7z M88,161.9v50.8 l-62.1-79L88,161.9z M100,161.9l62.1-28.2l-62.1,79V161.9z"
      />
    </svg>
  );
}

export default ETHIc;
