/**
 * CI pipeline for xiaofeng-blog.
 *
 * Runs the same checks as GitHub Actions — format, lint, typecheck, tests with
 * coverage, and the prerendered production build — so `dagger call check`
 * locally gives the same result as CI.
 */
import { argument, Container, dag, Directory, func, object } from "@dagger.io/dagger";

// Keep in sync with NODE_VERSION / BUN_VERSION in the Dockerfile and
// "packageManager" in package.json.
const NODE_IMAGE = "node:24-slim";
const BUN_IMAGE = "oven/bun:1.4.4-slim";

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
   * Node container with Bun added, dependencies installed and the source
   * mounted. Bun installs and runs scripts; the Vite build runs under Node
   * (the TanStack Start prerenderer needs it), matching the Dockerfile.
   *
   * Manifest and lockfile are copied before the rest of the source so the
   * install layer is reused until dependencies change.
   */
  @func()
  base(): Container {
    return dag
      .container()
      .from(NODE_IMAGE)
      .withFile("/usr/local/bin/bun", dag.container().from(BUN_IMAGE).file("/usr/local/bin/bun"))
      .withEnvVariable("CI", "true")
      .withMountedCache("/root/.bun/install/cache", dag.cacheVolume("xiaofeng-blog-bun"))
      .withWorkdir("/app")
      .withFile("package.json", this.source.file("package.json"))
      .withFile("bun.lock", this.source.file("bun.lock"))
      .withExec(["bun", "install", "--frozen-lockfile"])
      .withDirectory("/app", this.source);
  }

  /** Check formatting with Bun's built-in formatter. */
  @func()
  async format(): Promise<string> {
    return this.base().withExec(["bun", "fmt", "--check"]).stdout();
  }

  /** Lint with Oxlint (type-aware). */
  @func()
  async lint(): Promise<string> {
    return this.base().withExec(["bun", "run", "lint"]).stdout();
  }

  /** Type check with Bun's built-in checker. */
  @func()
  async typecheck(): Promise<string> {
    return this.base().withExec(["bun", "run", "typecheck"]).stdout();
  }

  /** Run the test suite with coverage thresholds enforced. */
  @func()
  async test(): Promise<string> {
    return this.base().withExec(["bun", "run", "test:coverage"]).stdout();
  }

  /** Build and prerender the site; returns the Nitro `.output` directory. */
  @func()
  build(): Directory {
    return this.base().withExec(["bun", "run", "build"]).directory("/app/.output");
  }

  /** Run format, lint, typecheck, tests and build in parallel. Fails if any step fails. */
  @func()
  async check(): Promise<string> {
    await Promise.all([
      this.format(),
      this.lint(),
      this.typecheck(),
      this.test(),
      this.build().sync(),
    ]);
    return "format, lint, typecheck, test and build passed";
  }
}
