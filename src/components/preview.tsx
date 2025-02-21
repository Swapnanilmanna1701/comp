//import LetterSwapForward from "@/fancy/components/text/letter-swap-forward-anim"
import LetterSwapPingPong from "@/components/pingpong"

export default function Preview() {
  return (
    <div className="  rounded-lg bg-transparent text-xl md:text-3xl  flex flex-col items-center justify-center font-calendas">
      <div className=" p-0 text-[#ffffff] rounded-xl align-text-top  gap-y-1 md:gap-y-2 flex flex-col">
        
        <LetterSwapPingPong
          label="Explore The Infinity With Cazz AI"
          staggerFrom={"center"}
          reverse={false}
          className="font-overusedGrotesk font-bold"
        />
        
      </div>
    </div>
  )
}
