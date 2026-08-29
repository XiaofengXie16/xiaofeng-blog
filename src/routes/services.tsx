import { createFileRoute } from "@tanstack/react-router";
import { FloatingOrbs, GridLines, NoiseOverlay } from "~/components/effects/FloatingOrbs";
import { pageMeta } from "~/constants/site";

const LINKEDIN_URL = "https://www.linkedin.com/in/xiaofengxie16/";
const RYZER_URL = "https://github.com/XiaofengXie16/ryzer";

export const Route = createFileRoute("/services")({
  head: () =>
    pageMeta({
      title: "Playwright Speed & Flake Audit | Xiaofeng Xie",
      description:
        "A fixed-scope engineering audit for teams losing time to slow or flaky Playwright end-to-end tests.",
      path: "/services",
    }),
  component: Services,
});

const deliverables = [
  {
    code: "01",
    title: "A trustworthy baseline",
    body: "Repeatable local and CI measurements for duration, retries, failures, worker utilization, and the slowest flows.",
  },
  {
    code: "02",
    title: "Root-cause findings",
    body: "A ranked diagnosis of timing races, state leakage, brittle selectors, expensive setup, and avoidable browser work.",
  },
  {
    code: "03",
    title: "Working fixes",
    body: "A review-ready pull request addressing the highest-value issues, with before-and-after evidence for every claim.",
  },
  {
    code: "04",
    title: "A durable playbook",
    body: "Clear guardrails for retries, isolation, fixtures, artifacts, and performance budgets so the suite stays healthy.",
  },
];

const fitSignals = [
  "Your Playwright suite takes long enough that engineers avoid running it.",
  "Retries keep CI green, but nobody trusts what they are hiding.",
  "A handful of tests fail only under load, in parallel, or in CI.",
  "You want evidence before considering a runner or architecture change.",
];

function Services() {
  return (
    <div className="relative overflow-hidden">
      <FloatingOrbs />
      <GridLines />
      <NoiseOverlay />
      <div className="scan-line" />

      <section className="relative px-6 pb-24 pt-24 md:pb-32 md:pt-32">
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="mb-8 inline-flex items-center gap-3 border border-neon-green/30 bg-neon-green/5 px-4 py-2">
            <span className="status-dot" />
            <span className="terminal-text text-xs tracking-[0.22em] text-neon-green">
              FOUNDING PILOT // ONE SLOT
            </span>
          </div>

          <div className="grid items-end gap-12 lg:grid-cols-[1.35fr_0.65fr]">
            <div>
              <p className="terminal-text mb-5 text-sm tracking-[0.28em] text-primary">
                PLAYWRIGHT SPEED + FLAKE AUDIT
              </p>
              <h1 className="max-w-4xl text-5xl font-black tracking-tight text-text-main sm:text-6xl md:text-7xl">
                Stop paying for slow, flaky E2E feedback.
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-text-muted md:text-xl">
                In five business days, I will measure your Playwright suite, isolate its most
                expensive failure modes, and deliver a focused pull request with verified
                improvements.
              </p>
            </div>

            <div className="cyber-card hud-corners p-6">
              <p className="terminal-text text-xs tracking-[0.22em] text-primary">PILOT SCOPE</p>
              <div className="mt-5 text-4xl font-black text-text-main">$1,500</div>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                Fixed fee · one repository · up to 25 representative tests · five business days
              </p>
              <div className="my-6 h-px bg-linear-to-r from-primary/50 to-transparent" />
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="neon-button block w-full text-center"
              >
                MESSAGE ME ON LINKEDIN
              </a>
              <p className="terminal-text mt-4 text-center text-[10px] tracking-wider text-text-muted">
                START WITH A 15-MINUTE FIT CHECK
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-y border-primary/10 bg-surface/30 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="terminal-text text-xs tracking-[0.25em] text-secondary">
              WHAT YOU RECEIVE
            </p>
            <h2 className="mt-4 text-3xl font-bold text-text-main md:text-4xl">
              Evidence first. Changes second.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {deliverables.map((item) => (
              <article
                key={item.code}
                className="cyber-card group p-7 transition-colors hover:border-primary/40"
              >
                <div className="flex items-start gap-5">
                  <span className="terminal-text text-sm text-primary/60">[{item.code}]</span>
                  <div>
                    <h3 className="text-xl font-bold text-text-main group-hover:text-primary">
                      {item.title}
                    </h3>
                    <p className="mt-3 leading-7 text-text-muted">{item.body}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-6 py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div>
            <p className="terminal-text text-xs tracking-[0.25em] text-accent">GOOD FIT WHEN</p>
            <h2 className="mt-4 text-3xl font-bold text-text-main">The suite is costing trust.</h2>
            <ul className="mt-8 space-y-4">
              {fitSignals.map((signal) => (
                <li
                  key={signal}
                  className="flex gap-4 border-l border-accent/30 pl-5 text-text-muted"
                >
                  <span className="terminal-text text-accent">&gt;</span>
                  <span className="leading-7">{signal}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="cyber-card hud-corners p-8 md:p-10">
            <p className="terminal-text text-xs tracking-[0.25em] text-primary">WHY I CAN HELP</p>
            <h2 className="mt-4 text-3xl font-bold text-text-main">
              I built the runner to test the assumptions.
            </h2>
            <p className="mt-6 leading-7 text-text-muted">
              I am the author of Ryzer, an open-source Chromium test runner built around
              renderer-side waits, deterministic isolation, compiled browser transactions, and
              dependency-aware incremental execution.
            </p>
            <p className="mt-4 leading-7 text-text-muted">
              Its published matched harness measured a 2.43× cold-run median and a 3.27× warm-run
              median versus Playwright on the development machine. Those are workload-specific
              results—not a promise about your suite. The audit exists to find out what your
              evidence supports.
            </p>
            <a
              href={RYZER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="terminal-text mt-7 inline-flex items-center gap-2 text-sm text-primary hover:text-primary-hover"
            >
              INSPECT THE SOURCE + BENCHMARKS <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      <section className="relative px-6 pb-28">
        <div className="mx-auto max-w-6xl border border-primary/20 bg-primary/5 p-8 text-center md:p-12">
          <p className="terminal-text text-xs tracking-[0.25em] text-primary">NEXT STEP</p>
          <h2 className="mt-4 text-3xl font-bold text-text-main md:text-4xl">
            Bring one CI run and one test you do not trust.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-text-muted">
            I will tell you whether a focused five-day audit is likely to pay for itself. If the
            evidence says no, I will say so.
          </p>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="neon-button mt-8 inline-block"
          >
            REQUEST THE FOUNDING PILOT
          </a>
        </div>
      </section>
    </div>
  );
}
