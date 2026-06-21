export function ValkeyLogo({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <mask id="valkey-mask">
          <rect x="0" y="0" width="100" height="100" fill="white" />
          
          {/* Inner Hexagon Cutout */}
          <polygon 
            points="50,18 77.7,34 77.7,66 50,82 22.3,66 22.3,34" 
            fill="none" 
            stroke="black" 
            strokeWidth="9.5" 
            strokeLinejoin="miter" 
          />
          
          {/* Center Circle Ring Cutout */}
          <circle 
            cx="50" cy="50" r="14" 
            fill="none" stroke="black" strokeWidth="9.5" 
          />
          
          {/* Vertical stem cutout */}
          <line 
            x1="50" y1="64" x2="50" y2="82" 
            stroke="black" strokeWidth="9.5" 
          />
          
          {/* Diagonal cut at bottom-left */}
          <line 
            x1="25" y1="64.5" x2="-5" y2="81.8" 
            stroke="black" strokeWidth="9.5" 
          />
        </mask>
      </defs>

      {/* Main Base Hexagon */}
      <polygon 
        points="50,4 89.8,27 89.8,73 50,96 10.2,73 10.2,27" 
        mask="url(#valkey-mask)"
      />
    </svg>
  )
}
