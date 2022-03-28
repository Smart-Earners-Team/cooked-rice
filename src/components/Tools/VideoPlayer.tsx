import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player/file";
import videoSrc from "../../media/cooked-rice-animation.mp4";
type SupportedVideo = {
  src: string;
  type: string;
}[];

type StatePlayerRef = React.MutableRefObject<ReactPlayer>["current"];
interface LamboDriverVideoProps {
  canStartEngine: () => boolean;
}

// const prefix =
//   "https://github.com/Smart-Earners-Team/tieto-evry-corporation/blob/main/src/media/games/lamborghini-driver/";

const supportedVideos: SupportedVideo = [
  { src: videoSrc, type: "video/mp4" },
//   { src: prefix + "cooked-rice-animation.webm", type: "video/webm" },
//   { src: prefix + "cooked-rice-animation.3gp", type: "video/3gp" },
//   { src: prefix + "cooked-rice-animation.avi", type: "video/avi" },
//   { src: prefix + "cooked-rice-animation.flv", type: "video/flv" },
//   { src: prefix + "cooked-rice-animation.mov", type: "video/mov" },
//   { src: prefix + "cooked-rice-animation.ogg", type: "video/ogg" },
];
/* const supportedVideos: SupportedVideo = [
  { src: prefix + "cooked-rice-animation.webm?raw=true", type: "video/webm" },
  { src: prefix + "cooked-rice-animation.3gp?raw=true", type: "video/3gp" },
  { src: prefix + "cooked-rice-animation.avi?raw=true", type: "video/avi" },
  { src: prefix + "cooked-rice-animation.flv?raw=true", type: "video/flv" },
  { src: prefix + "cooked-rice-animation.mov?raw=true", type: "video/mov" },
  { src: prefix + "cooked-rice-animation.ogg?raw=true", type: "video/ogg" },
]; */

export default function VideoPlayer({ canStartEngine }: LamboDriverVideoProps) {
  const [player, setPlayer] = useState<StatePlayerRef | null>(null);

  const videoRef = useRef<ReactPlayer | null>(null);

  /* In cases when users have not interacted with the document.
  This effect is also used to trigger another attempt to play the video */
  const playIfNotTouched = useCallback(() => {
    if (player !== null && canStartEngine()) {
      const p = getPlayer(player);
      if (p && !p.played) {
        p.play();
      }
    }
  }, [player, canStartEngine]);

  useEffect(() => {
    document.addEventListener("mouseenter", playIfNotTouched);
    return () => document.removeEventListener("mouseenter", playIfNotTouched);
  });

  // set the ref.current to state when they become available
  useEffect(() => {
    if (videoRef.current) {
      setPlayer(videoRef.current);
    }
  }, [videoRef]);

  const getPlayer = (refObject: StatePlayerRef) => {
    const { getInternalPlayer } = refObject;
    // Return HTMLAudio element
    const ele = getInternalPlayer();
    return ele as HTMLAudioElement;
  };

  const startEngine = async (player: ReactPlayer) => {
    const canStart = canStartEngine();
    if (canStart) getPlayer(player).play();
  };

  // Runs only once when the first player has ended
  const handleFirstPlayerEnded = useCallback(() => {
    if (player !== null) {
      const p = getPlayer(player);
      p.loop = true;
      startEngine(player);
    }
  }, [player]);

  // Stop engine if we cannot start because of some conditions
  const checkCanStart = useCallback(() => {
    const canStart = canStartEngine();
    // this runs only for the first video
    if (player !== null) {
      const p = getPlayer(player);
      if (canStart && p) {
        p.play();
      }
      // check for player.played because some browsers do not allow
      // playing a video if the user has not interacted with the document
      else if (!canStart && p && p.played) {
        p.pause();
        p.currentTime = 0;
      }
    }
  }, [canStartEngine, player]);
  checkCanStart();

  return (
    /* Responsive player 
    Set width and height to 100% and wrap the player in a fixed aspect ratio box to get a
    responsive player: see https://css-tricks.com/aspect-ratio-boxes */
    <React.Fragment>
      <div className="w-full bg-gray-300 relative pointer-events-none">
        <ReactPlayer
          url={supportedVideos}
          className="pointer-event-none"
          width="100%"
          height="100%"
          onEnded={handleFirstPlayerEnded}
          ref={(player) => (videoRef.current = player)}
          pip={false}
          muted={true}
          onPlay={checkCanStart}
        />
      </div>
    </React.Fragment>
  );
}
