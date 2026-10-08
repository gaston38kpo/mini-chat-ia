import { Fragment, type ComponentType } from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { DURATIONS, TRANSITION_DURATION } from "../theme";
import { S01Intro } from "../scenes/S01Intro";
import { S02AppForm } from "../scenes/S02AppForm";
import { S03UseLocalChat } from "../scenes/S03UseLocalChat";
import { S04LmStudioClient } from "../scenes/S04LmStudioClient";
import { S05TokensBack } from "../scenes/S05TokensBack";

const SCENES: { name: string; component: ComponentType; duration: number }[] = [
    { name: "S01Intro", component: S01Intro, duration: DURATIONS.s01 },
    { name: "S02AppForm", component: S02AppForm, duration: DURATIONS.s02 },
    { name: "S03UseLocalChat", component: S03UseLocalChat, duration: DURATIONS.s03 },
    { name: "S04LmStudioClient", component: S04LmStudioClient, duration: DURATIONS.s04 },
    { name: "S05TokensBack", component: S05TokensBack, duration: DURATIONS.s05 },
];

/**
 * OJO: la duracion de un TransitionSeries es la SUMA de las escenas MENOS la
 * suma de las transiciones. Por eso restamos: 1080 - (15 x 4) = 1020 frames.
 */
export const MAIN_VIDEO_DURATION =
    SCENES.reduce((sum, scene) => sum + scene.duration, 0) -
    TRANSITION_DURATION * (SCENES.length - 1);

/** El video completo: las cinco escenas unidas con fundidos. */
export function MainVideo() {
    return (
        <TransitionSeries>
            {SCENES.map((scene, index) => {
                const Scene = scene.component;

                return (
                    <Fragment key={scene.name}>
                        <TransitionSeries.Sequence durationInFrames={scene.duration}>
                            <Scene />
                        </TransitionSeries.Sequence>
                        {index < SCENES.length - 1 ? (
                            <TransitionSeries.Transition
                                presentation={fade()}
                                timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
                            />
                        ) : null}
                    </Fragment>
                );
            })}
        </TransitionSeries>
    );
}
