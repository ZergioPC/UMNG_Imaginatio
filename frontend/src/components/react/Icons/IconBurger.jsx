export default function IconBurger({ color = "currentColor" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      stroke={color}
      fill="none"
    >
      <path
        d="M4 6H20M4 12H20M4 18H20"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}