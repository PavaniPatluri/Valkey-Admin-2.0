"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"

// Dynamically import the WebGL canvas to prevent SSR crashes
const ShaderGradientCanvas = dynamic(
  () => import("shadergradient").then((mod) => mod.ShaderGradientCanvas),
  { ssr: false }
)

const ShaderGradient = dynamic(
  () => import("shadergradient").then((mod) => mod.ShaderGradient),
  { ssr: false }
)

export function LiveBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#030014]">
      <Suspense fallback={<div className="absolute inset-0 bg-[#030014]" />}>
        <ShaderGradientCanvas
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          <ShaderGradient
            control="query"
            urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1.2&cAzimuthAngle=180&cDistance=3.6&cPolarAngle=90&cameraZoom=1&color1=%231d4ed8&color2=%236b21a8&color3=%230f172a&envPreset=city&format=gif&fov=45&frameRate=10&grain=on&lightType=3d&pixelDensity=1&positionX=-1.4&positionY=0&positionZ=0&range=disabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=10&rotationZ=50&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1.3&uFrequency=5.5&uSpeed=0.15&uStrength=4&uTime=0&wireframe=false"
          />
        </ShaderGradientCanvas>
      </Suspense>
      {/* Fallback dark overlay just in case the shader is too bright */}
      <div className="absolute inset-0 bg-[#030014]/20 pointer-events-none" />
    </div>
  )
}
