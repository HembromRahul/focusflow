import { useEffect, useState } from "react";

function SplashScreen({ onFinish }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
    setTimeout(() => onFinish(), 2000);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center z-50">
      <h1
        className={`
          text-zinc-300
          text-[5rem] md:text-[7rem]
          font-semibold
          tracking-[-0.04em]
          transition-all duration-[1200ms]
          ease-[cubic-bezier(0.22,1,0.36,1)]
          ${animate ? "opacity-100 scale-100" : "opacity-0 scale-90"}
        `}
      >
        Flow
      </h1>
    </div>
  );
}

export default SplashScreen;
