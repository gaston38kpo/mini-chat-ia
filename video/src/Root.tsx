import { Composition, Folder } from "remotion";
import { DURATIONS, FPS, HEIGHT, WIDTH } from "./theme";
import { MainVideo, MAIN_VIDEO_DURATION } from "./video/MainVideo";
import { S01Intro } from "./scenes/S01Intro";
import { S02AppForm } from "./scenes/S02AppForm";
import { S03UseLocalChat } from "./scenes/S03UseLocalChat";
import { S04LmStudioClient } from "./scenes/S04LmStudioClient";
import { S05TokensBack } from "./scenes/S05TokensBack";

export function RemotionRoot() {
    return (
        <>
            <Folder name="Escenas">
                <Composition
                    id="S01Intro"
                    component={S01Intro}
                    durationInFrames={DURATIONS.s01}
                    fps={FPS}
                    width={WIDTH}
                    height={HEIGHT}
                />
                <Composition
                    id="S02AppForm"
                    component={S02AppForm}
                    durationInFrames={DURATIONS.s02}
                    fps={FPS}
                    width={WIDTH}
                    height={HEIGHT}
                />
                <Composition
                    id="S03UseLocalChat"
                    component={S03UseLocalChat}
                    durationInFrames={DURATIONS.s03}
                    fps={FPS}
                    width={WIDTH}
                    height={HEIGHT}
                />
                <Composition
                    id="S04LmStudioClient"
                    component={S04LmStudioClient}
                    durationInFrames={DURATIONS.s04}
                    fps={FPS}
                    width={WIDTH}
                    height={HEIGHT}
                />
                <Composition
                    id="S05TokensBack"
                    component={S05TokensBack}
                    durationInFrames={DURATIONS.s05}
                    fps={FPS}
                    width={WIDTH}
                    height={HEIGHT}
                />
            </Folder>

            <Composition
                id="MainVideo"
                component={MainVideo}
                durationInFrames={MAIN_VIDEO_DURATION}
                fps={FPS}
                width={WIDTH}
                height={HEIGHT}
            />
        </>
    );
}
