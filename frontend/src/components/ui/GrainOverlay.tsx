export const GrainOverlay = () => {
    return (
        <div className="pointer-events-none fixed inset-0 z-[50] opacity-20 mix-blend-overlay">
            <div
                className="absolute inset-0 h-full w-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/Noise.png')] [mask-image:radial-gradient(ellipse_at_center,transparent_0%,black_100%)]"
                style={{ animation: "grain 8s steps(10) infinite" }}
            />
            <style>{`
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -10%); }
          20% { transform: translate(-15%, 5%); }
          30% { transform: translate(7%, -25%); }
          40% { transform: translate(-5%, 25%); }
          50% { transform: translate(-15%, 10%); }
          60% { transform: translate(15%, 0%); }
          70% { transform: translate(0%, 15%); }
          80% { transform: translate(3%, 35%); }
          90% { transform: translate(-10%, 10%); }
        }
      `}</style>
        </div>
    );
};
