type RabbitMarkProps = {
  className?: string;
  color?: string;
  title?: string;
};

// Vectorized from public/images/logo.png (rabbit-head mark, cropped to its
// tight bounding box, traced with potrace). Vector paths stay crisp at any
// size, so this is safe to use as a giant hero element.
export function RabbitMark({
  className = "",
  color = "#F12032",
  title = "Red Rabbit",
}: RabbitMarkProps) {
  return (
    <svg
      viewBox="0 0 174 267"
      className={className}
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <g transform="translate(0,267) scale(0.1,-0.1)">
        <path
          fill={color}
          fillRule="evenodd"
          stroke="none"
          d="M0 1335 l0 -1335 503 0 c626 1 693 8 877 98 172 84 290 230 337 417
24 98 24 325 -1 415 -60 222 -232 402 -431 451 -28 6 -52 13 -54 15 -2 1 81
112 183 246 139 182 194 262 218 318 31 72 33 80 33 210 0 164 -15 220 -90
330 -42 62 -153 170 -175 170 -3 0 -179 -272 -390 -605 -212 -332 -388 -604
-392 -605 -5 0 -8 156 -8 346 0 387 -3 414 -68 539 -51 99 -163 208 -263 258
-76 37 -184 66 -246 67 l-33 0 0 -1335z m1036 -308 c276 -140 177 -553 -131
-551 -144 1 -254 94 -286 243 -21 97 33 225 119 285 90 62 204 71 298 23z"
        />
      </g>
    </svg>
  );
}
