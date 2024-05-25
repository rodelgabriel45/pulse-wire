const PulseSvg = (props) => (
  <svg
    width={100}
    height={100}
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="100" height="100" fill="none" />
    <circle cx="50" cy="50" r="45" fill="#1DA1F2" />
    <path
      d="M35 55C35 50 40 45 50 45C60 45 65 50 65 55C65 60 60 65 50 65C40 65 35 60 35 55Z"
      fill="white"
    />
    <path
      d="M50 25C53.3137 25 56 27.6863 56 31C56 34.3137 53.3137 37 50 37C46.6863 37 44 34.3137 44 31C44 27.6863 46.6863 25 50 25Z"
      fill="white"
    />
    <path
      d="M50 63L50 88"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M37 71L50 88L63 71"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M50 88L50 63"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);
export default PulseSvg;
