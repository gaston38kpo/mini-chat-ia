import { Composition } from "remotion";
import { FPS, HEIGHT, WIDTH } from "./theme";
import { MainVideo } from "./video/MainVideo";
import { MAIN_VIDEO_DURATION } from "./video/steps";

export function RemotionRoot() {
    return (
        <Composition
            id="MainVideo"
            component={MainVideo}
            durationInFrames={MAIN_VIDEO_DURATION}
            fps={FPS}
            width={WIDTH}
            height={HEIGHT}
        />
    );
}
