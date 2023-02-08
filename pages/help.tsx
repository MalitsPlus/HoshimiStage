/* eslint-disable react/no-unescaped-entities */
import { Alert, Badge } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";
import { logEvent } from "firebase/analytics";
import { t } from "i18next";
import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import { analytics } from "../src/firebase/firebase";

export default function Help() {
  useEffect(() => {
    logEvent(analytics, "open_help")
  }, [])
  return (
    <>
      <Head>
        <title>Hoshimi Stage - Help</title>
      </Head>
      <div className="px-4 py-4">
        <article className="prose lg:prose-xl prose-zinc dark:prose-invert">
          <h1>HoshimiStage</h1>

          <h2>Overview</h2>
          <p>
            For those who have a willingness to form powerful units when the official have launched
            out new Lives, they must dig deeper into how a Live is going to work under the hood
            and what's happenning at some specific nodes. To that end, a number of trials and errors
            are good enough for those Lives which are rechallengeable. However, when things come to
            Lives within such as PvP and League, every single Live is crucial and irreversible that you
            would never like to do things thoughtlessly. Besides, as is well known to all of us
            managers, the in-game Live log is <span
              className="text-pink-500">an extremely nonsense</span> which not only
            reveals us unclear skill activating timing but also makes for terrible viewing experiences,
            as a result, one's imagination perhaps can be considered as the merely option to be
            relied upon.
          </p>
          <p>
            Having wasted a great bunch of time forming parties every time a new Live quest has
            launched out again and again, I realized if there is a tool which can visualize all
            the events at every node, things would be much easier.
          </p>
          <p>
            That, is why I decided to stand up HoshimiStage in the first place.
          </p>
          <p className="font-medium">
            <span className="text-sky-500">HoshimiStage </span>
            <span className="line-through">(a.k.a. sakura-love)</span> is a
            web-based application used for simulating in-game Live and visualizing what
            happened at every note for players to pick their party more instinctively.
          </p>
          <Alert icon={<IconAlertCircle size={16} />} title={<div className="text-base">Notice</div>} color="pink">
            <div className="text-base">
              HoshimiStage is a fan-made application, neither this project nor the
              developer has connection with the official affiliation.
              The copyright of game data and assets are belong to QualiArts, Inc.
            </div>
          </Alert>

          <h2>How to use</h2>
          <p>
            Nothing fancy. Select your desired quest, team up your party by simply
            dragging and dropping, adjust their parameters if needed, click A & SP
            node to toggle whether it should be activated, and click Simulate button
            to see the result.<br />

            You can observe each node by hovering your cursor on it.
          </p>

          <h2>FAQ</h2>

          <h3>Are the results reliable?</h3>
          <p>Nope.</p>
          <p>
            I mean, just like any other programs, even if I have been trying my best
            to make the results match the in-game outputs accurately, there may still have
            bugs that I didn't notice, besides, <span className="underline decoration-pink-500">
              you should never easily trust any data that outside original game application.</span>

          </p>
          <p>
            However, if you find bugs or notice something that doesn't
            seem to match in-game result, don't hesitate to <Link
              href="https://github.com/MalitsPlus/HoshimiStage/issues/new">open a tick</Link>,
            your contribution will definitely makes HoshimiStage become better.
          </p>

          <h3>Do I have to adjust parameters completely match my unit?</h3>
          <p>
            Generally speaking, beacause HoshimiStage has no feature to calculate score, you needn't
            to adjust parameters to completely match your card.
          </p>
          <p>
            But parameters do play a role in some other crucial vectors. For example, vo/vi/da will
            affect skill target being selected when the target clause describes like "the highest Dance
            friendly target"; mental will affect passive skills activating order; stamina will affect
            the skill chance privileges in a Live Battle... In a word, except for score calculation,
            every thing works follow the game system. That said, <span className="underline decoration-pink-500">
              the more accurately you adjust the parameters match your unit, the more correct result you will get.</span>
          </p>

          <h3>What do labels within efficacy flow lines mean?</h3>
          <div className="grid grid-cols-[minmax(0px,_1fr)_minmax(0px,_5fr)] items-center gap-2">
            <div>
              <Badge mr={4} variant="filled" className="normal-case">{t("Included")}</Badge>
            </div>
            <p>
              This efficacy exists <span className="underline decoration-pink-500 decoration-4">beforehand
              </span> performing a beat action, which means this beat will
              be affected by the efficacy.
            </p>
            <div>
              <Badge mr={4} variant="filled" color="pink" className="normal-case">{t("Unincluded")}</Badge>
            </div>
            <p>
              This efficacy exists <span className="underline decoration-pink-500 decoration-4">after
              </span> performing a beat action, which means this beat will
              not be affected by the efficacy.
            </p>
            <div>
              <Badge mr={4} variant="filled" color="grape" className="normal-case">{t("Instant")}</Badge>
            </div>
            <p>
              This efficacy instantly takes effect and has no continuous influence.
            </p>
            <div>
              <Badge mr={4} variant="filled" color="violet" className="normal-case">{t("Migrated")}</Badge>
            </div>
            <p>
              This efficacy was once possessed by someone else but is now transferred to the current target.
            </p>
            <div>
              <Badge mr={4} variant="filled" color="orange" className="normal-case">{t("Adjusted")}</Badge>
            </div>
            <p>
              This efficacy was adjusted by some other effects (such as grade strengthening and duration increasing).
            </p>
          </div>

          <h3>Why using 4-2-1-3-5 lane order? It's pretty unfriendly</h3>
          <p>
            It all boils down to the official. Having they used this styled order
            in the databases, I had no choice but to follow it.
          </p>

          <h3>But I like having to use 1-2-3-4-5! Give me that!</h3>
          <p>I LIKE TOO! Well anyway, their product, they are the bosses aren't they?</p>

          <h3>Why not build a mobile layout?</h3>
          <p>
            Since each node in a lane is extremely tiny (about 4px), I
            personally doubt that whether one can observe it precisely
            without the help of using a cursor.
            <span className="line-through"> Okay I admit that's just
              an excuse, the truth is, I am lazy.
            </span>
          </p>

          <h2>Miscellaneous</h2>
          <p>
            License: <Link
              href="https://www.apache.org/licenses/LICENSE-2.0">Apache-2.0 license</Link>
          </p>
          <p>
            Open source homepage: <Link
              href="https://github.com/MalitsPlus/HoshimiStage">https://github.com/MalitsPlus/HoshimiStage</Link>
          </p>
          <p>
            Hoshimi-Production logos: <Link
              href="https://github.com/765Pro-Hoshimi/IDOLY-PRIDE-Logo">765Pro-Hoshimi/IDOLY-PRIDE-Logo</Link>
          </p>
        </article>
      </div>
    </>
  )
}
