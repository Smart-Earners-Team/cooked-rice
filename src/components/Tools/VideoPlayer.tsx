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

const supportedVideos: SupportedVideo = [{ src: videoSrc, type: "video/mp4" }];

function VideoPlayer({ canStartEngine }: LamboDriverVideoProps) {
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
    document.addEventListener("mouseover", playIfNotTouched);
    return () => document.removeEventListener("mouseover", playIfNotTouched);
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
          // Let us pray the user has interacted with the document at this time
          // 6 secs
        setTimeout(() => p.play(), 6000);
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
      <div className="w-full bg-black relative pointer-events-none">
        <ReactPlayer
          url={supportedVideos}
          className="pointer-event-none"
          width="100%"
          height="100%"
          onEnded={handleFirstPlayerEnded}
          ref={(player) => (videoRef.current = player)}
          pip={false}
          loop={true}
          onPlay={checkCanStart}
        />
      </div>
    </React.Fragment>
  );
}

export default React.memo(VideoPlayer);
