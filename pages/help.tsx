/* eslint-disable react/no-unescaped-entities */
import { Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";
import { logEvent } from "firebase/analytics";
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
          <h2>HoshimiStage</h2>

          <h3>Overview</h3>
          <p>
            For those who have a willingness to form powerful units when the official have launched
            of new Lives, they must dig deeper into how a Live is going to work under the hood
            and what's happenning at some specific nodes. To that end, a number of trials and errors
            are good enough for those Lives which are rechallengeable. However, when things come to
            Lives within such as PvP and League, every Live is crucial and irreversible that you
            would never like to do things thoughtlessly. Besides, as is well known to all of us
            managers, the in-game Live log is an extremely nonsense which not only reveals us
            unclear skill activating timing but also makes for terribly viewing experiences,
            as a result, one's imagination perhaps can be considered as the merely option to be
            relied upon.<br />

            Having wasted a great bunch of time forming parties every time a new Live quest has
            launched off again and again, I realized if there is a tool which can visualize all
            the events at every node, things would be much easier.
          </p>
          <p>
            That, is why I decided to stand up HoshimiStage in the first place.
          </p>
          <p>
            HoshimiStage <span className="line-through">(a.k.a. sakura-love)</span> is a
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

          <h3>How to use</h3>
          <p>
            Nothing fancy. Select your desired quest, team up your party by simply
            dragging and dropping, adjust their parameters if needed, click A & SP
            node to toggle whether it should be activated, and click Simulate button
            to see the result.<br />

            You can observe each node by hovering your cursor on it.
          </p>

          <h3>FAQ</h3>

          <h4>Are the results reliable?</h4>
          <p>
            Nope. I mean,
          </p>

          <h4>Why using 4-2-1-3-5 lane order? It's pretty unfriendly</h4>
          <p>
            It all boils down to the official. Having they used this styled order
            in the databases, I had no choice but to obey it.
          </p>

          <h4>But I like having to use 1-2-3-4-5! Give me that!</h4>
          <p>I LIKE TOO! Well anyway, their product, they are the bosses aren't they?</p>

          <h4>Why not build a mobile layout?</h4>
          <p>
            Since each node in a lane is extremely tiny (about 4px), I
            personally doubt that whether one can observe it precisely
            without the help of using a cursor.
            <span className="line-through"> Okay I admit that's just
              an excuse, the truth is, I am lazy.
            </span>
          </p>


          <h3>Miscellaneous</h3>
          <h4>Open source homepage</h4>
          <Link href="https://github.com/MalitsPlus/HoshimiStage">https://github.com/MalitsPlus/HoshimiStage</Link>
          <h4>License</h4>
          <Link href="https://www.apache.org/licenses/LICENSE-2.0">Apache-2.0 license</Link>
          <p>Hoshimi-Production  logo is from <br />
            <Link href="https://github.com/765Pro-Hoshimi/IDOLY-PRIDE-Logo">765Pro-Hoshimi/IDOLY-PRIDE-Logo</Link>
          </p>
        </article>
      </div>
    </>
  )
}
