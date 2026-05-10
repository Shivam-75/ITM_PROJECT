const Loader = () => {
  return (
    <div className="flex  ">
      {/* Loader Container */}
      <div className="relative flex items-center justify-center w-[50px] h-[50px] perspective-[780px]">
        {/* Text */}
        <span className="absolute text-lg font-bold text-blue-800 z-10">
          Loading...
        </span>

        {/* Ring 1 */}
        <div className="absolute inset-0 rounded-full border-b-[7px] border-red-800 animate-rotate1"></div>

        {/* Ring 2 */}
        <div className="absolute inset-0 rounded-full border-r-[7px] border-blue-800 animate-rotate2"></div>

        {/* Ring 3 */}
        <div className="absolute inset-0 rounded-full border-t-[7px] border-rose-800 animate-rotate3"></div>
      </div>

      {/* Keyframes */}
      <style>
        {`
          @keyframes rotate1 {
            0% {
              transform: rotateX(45deg) rotateY(-45deg) rotateZ(0deg);
            }
            100% {
              transform: rotateX(45deg) rotateY(-45deg) rotateZ(360deg);
            }
          }

          @keyframes rotate2 {
            0% {
              transform: rotateX(45deg) rotateY(45deg) rotateZ(0deg);
            }
            100% {
              transform: rotateX(45deg) rotateY(45deg) rotateZ(360deg);
            }
          }

          @keyframes rotate3 {
            0% {
              transform: rotateX(-60deg) rotateY(0deg) rotateZ(0deg);
            }
            100% {
              transform: rotateX(-60deg) rotateY(0deg) rotateZ(360deg);
            }
          }

          .animate-rotate1 {
            animation: rotate1 1.15s linear infinite;
          }

          .animate-rotate2 {
            animation: rotate2 1.15s linear infinite 0.1s;
          }

          .animate-rotate3 {
            animation: rotate3 1.15s linear infinite 0.15s;
          }
        `}
      </style>
    </div>
  );
};

export default Loader;



