/**
 * CI pipeline for xiaofeng-blog.
 *
 * Runs the same checks as GitHub Actions — lint, typecheck, tests with
 * coverage, and the prerendered production build — inside a Node container,
 * so `dagger call check` locally gives the same result as CI.
 */
import { argument, Container, dag, Directory, func, object } from "@dagger.io/dagger";

// Keep in sync with NODE_VERSION in the Dockerfile.
const NODE_IMAGE = "node:24-slim";

@object()
export class XiaofengBlog {
  source: Directory;

  constructor(
    @argument({
      defaultPath: "/",
      ignore: ["node_modules", ".git", ".output", "dist", "coverage", ".vitest", ".dagger", ".env"],
    })
    source: Directory,
  ) {
    this.source = source;
  }

  /**
   * Node container with dependencies installed and the source mounted.
   *
   * Lockfile and manifest are copied before the rest of the source so the
   * `npm ci` layer is reused until dependencies change.
   */
  @func()
  base(): Container {
    return (
      dag
        .container()
        .from(NODE_IMAGE)
        .withEnvVariable("CI", "true")
        // The `prepare` script runs `vp config`, which installs git hooks and
        // fails without git; the slim image has none and CI doesn't need hooks.
        .withEnvVariable("VP_GIT_HOOKS", "0")
        .withMountedCache("/root/.npm", dag.cacheVolume("xiaofeng-blog-npm"))
        .withWorkdir("/app")
        .withFile("package.json", this.source.file("package.json"))
        .withFile("package-lock.json", this.source.file("package-lock.json"))
        .withExec(["npm", "ci", "--no-audit", "--no-fund"])
        .withDirectory("/app", this.source)
    );
  }

  /** Lint with Oxlint (type-aware) via Vite+. */
  @func()
  async lint(): Promise<string> {
    return this.base().withExec(["npx", "vp", "lint"]).stdout();
  }

  /** Type check with tsc. */
  @func()
  async typecheck(): Promise<string> {
    return this.base().withExec(["npm", "run", "typecheck"]).stdout();
  }

  /** Run the test suite with coverage thresholds enforced. */
  @func()
  async test(): Promise<string> {
    return this.base().withExec(["npx", "vp", "test", "run", "--coverage"]).stdout();
  }

  /** Build and prerender the site; returns the Nitro `.output` directory. */
  @func()
  build(): Directory {
    return this.base().withExec(["npx", "vp", "build"]).directory("/app/.output");
  }

  /** Run lint, typecheck, tests and build in parallel. Fails if any step fails. */
  @func()
  async check(): Promise<string> {
    await Promise.all([this.lint(), this.typecheck(), this.test(), this.build().sync()]);
    return "lint, typecheck, test and build passed";
  }
}
