export function Logo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="50" fill="hsl(var(--primary))" />
      <polygon points="40 70, 20 70, 30 40" fill="hsl(var(--primary-foreground))" />
      <polygon points="80 70, 60 70, 70 40" fill="hsl(var(--primary-foreground))" />
    </svg>
  );
}
