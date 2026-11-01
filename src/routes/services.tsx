import { createFileRoute } from "@tanstack/react-router";
import { pageMeta } from "~/constants/site";
import { Cloud, Grain } from "~/components/design/Atmosphere";
import { ArrowRight } from "~/components/design/Section";

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

const primaryButton =
  "inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full bg-ink px-[26px] font-medium text-white no-underline hover:bg-indigo-deep";

function Services() {
  return (
    <>
      <section className="relative overflow-hidden bg-linear-to-b from-[#8E9BE6] via-[#C9C2EC] via-45% to-[#F6CFAE] pb-24">
        <Cloud
          style={{
            width: 560,
            height: 180,
            left: -80,
            top: 160,
            background: "#F9D9BC",
            opacity: 0.85,
          }}
        />
        <Cloud
          style={{
            width: 460,
            height: 150,
            right: -60,
            top: 300,
            background: "#FBE3CC",
            opacity: 0.75,
            animationDuration: "33s",
          }}
        />
        <Grain />
        <div className="relative z-[2] mx-auto grid max-w-[1240px] items-end gap-12 px-5 pt-44 sm:px-8 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="flex flex-col gap-5">
            <p className="glow m-0 -rotate-2 self-start font-hand text-[30px] text-[#F4F7FF]">
              founding pilot · one slot
            </p>
            <p className="m-0 text-[13px] font-semibold tracking-[0.18em] text-indigo uppercase">
              Playwright speed + flake audit
            </p>
            <h1 className="m-0 text-[48px] leading-[1.02] font-medium tracking-[-0.045em] text-olive sm:text-[76px]">
              Stop paying for slow, flaky E2E feedback.
            </h1>
            <p className="m-0 max-w-[640px] text-xl leading-relaxed text-ink-soft">
              In five business days, I will measure your Playwright suite, isolate its most
              expensive failure modes, and deliver a focused pull request with verified
              improvements.
            </p>
          </div>
          <div className="glass flex flex-col gap-4 rounded-[36px] p-8">
            <p className="m-0 text-[13px] font-semibold tracking-[0.12em] text-muted uppercase">
              Pilot scope
            </p>
            <p className="m-0 text-5xl font-medium tracking-[-0.03em]">$1,500</p>
            <p className="m-0 text-[15px] leading-relaxed text-ink-soft">
              Fixed fee · one repository · up to 25 representative tests · five business days
            </p>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${primaryButton} mt-2`}
            >
              Message me on LinkedIn
            </a>
            <p className="m-0 text-center font-hand text-xl text-violet">
              start with a 15-minute fit check
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-cream py-24">
        <Grain opacity={0.12} />
        <div className="relative mx-auto flex max-w-[1240px] flex-col gap-12 px-5 sm:px-8">
          <div className="flex max-w-2xl flex-col gap-2.5">
            <p className="m-0 font-hand text-[28px] text-rust">what you receive</p>
            <h2 className="m-0 text-[40px] leading-none font-medium tracking-[-0.035em] sm:text-[56px]">
              Evidence first. Changes second.
            </h2>
          </div>
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-5 p-0">
            {deliverables.map((item) => (
              <li key={item.code} className="glass lift flex flex-col gap-3 rounded-[28px] p-7">
                <span className="font-hand text-[26px] text-rust">{item.code}</span>
                <h3 className="m-0 text-[22px] font-medium tracking-[-0.02em]">{item.title}</h3>
                <p className="m-0 leading-relaxed text-ink-soft">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-linear-to-b from-cream to-lilac py-24">
        <div className="mx-auto grid max-w-[1240px] gap-12 px-5 sm:px-8 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2.5">
              <p className="m-0 font-hand text-[28px] text-violet">good fit when</p>
              <h2 className="m-0 text-4xl font-medium tracking-[-0.03em]">
                The suite is costing trust.
              </h2>
            </div>
            <ul className="m-0 flex list-none flex-col gap-4 p-0">
              {fitSignals.map((signal) => (
                <li key={signal} className="glass rounded-[22px] px-6 py-5 text-lg leading-normal">
                  {signal}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2.5">
              <p className="m-0 font-hand text-[28px] text-moss">why I can help</p>
              <h2 className="m-0 text-4xl font-medium tracking-[-0.03em]">
                I built the runner to test the assumptions.
              </h2>
            </div>
            <p className="m-0 font-serif text-xl leading-relaxed text-ink-soft">
              I am the author of Ryzer, an open-source Chromium test runner built around
              renderer-side waits, deterministic isolation, compiled browser transactions, and
              dependency-aware incremental execution.
            </p>
            <p className="m-0 font-serif text-xl leading-relaxed text-ink-soft">
              Its published matched harness measured a 2.43× cold-run median and a 3.27× warm-run
              median versus Playwright on the development machine. Those are workload-specific
              results—not a promise about your suite. The audit exists to find out what your
              evidence supports.
            </p>
            <a
              href={RYZER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 self-start py-2 font-medium text-indigo hover:text-indigo-deep"
            >
              Inspect the source and benchmarks <ArrowRight />
            </a>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_50%_20%,#262A5C_0%,#11122A_60%,#08081A_100%)] py-28 text-center text-moon">
        <Grain opacity={0.08} screen />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6 px-5">
          <p className="glow m-0 -rotate-2 font-hand text-5xl text-[#F4F7FF]">next step</p>
          <h2 className="m-0 text-4xl font-medium tracking-[-0.03em] text-white sm:text-5xl">
            Bring one CI run and one test you do not trust.
          </h2>
          <p className="m-0 text-lg leading-relaxed text-moon-muted">
            I will tell you whether a focused five-day audit is likely to pay for itself. If the
            evidence says no, I will say so.
          </p>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[52px] items-center rounded-full bg-moon px-[26px] font-medium text-night no-underline hover:bg-white"
          >
            Request the founding pilot
          </a>
        </div>
      </section>
    </>
  );
}
