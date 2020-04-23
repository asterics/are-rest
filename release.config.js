const { release_comment } = process.env;
const successComment =
  release_comment === "true"
    ? ":tada: This issue has been resolved in version ${nextRelease.version} :tada:\n\nThe release is available on [GitHub release](<github_release_url>)"
    : false;

module.exports = {
  repositoryUrl: "https://github.com/sabicalija/rest",
  tagFormat: "v${version}",
  plugins: [
    [
      "@semantic-release/npm",
      {
        // npmPublish: false
        // tarballDir: "dist"
      }
    ],
    [
      "@semantic-release/github",
      {
        assets: [{ path: "*.tgz", label: "AsTeRICS REST" }],
        successComment
      }
    ],
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "angular",
        releaseRules: [{ type: "docs", scope: "README", release: "patch" }, { type: "major", release: "major" }],
        parserOpts: {
          noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES"]
        }
      }
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "angular",
        parserOpts: {
          noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES", "BREAKING"]
        },
        writerOpts: {
          commitsSort: ["subject", "scope"]
        }
      }
    ],
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md"
      }
    ],
    [
      "@semantic-release/exec",
      {
        // prepareCmd: "node src/scripts/semantic-release/prepare.js ${nextRelease.version} ${options.branch} ${commits.length} ${Date.now()}"
      }
    ]
  ],
  dryRun: false,
  ci: false
};
