workspace(
    name = "chat",
    managed_directories = {"@npm": ["node_modules"]},
)

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

# https://github.com/bazelbuild/bazel-skylib/releases
http_archive(
    name = "bazel_skylib",
    sha256 = "1c531376ac7e5a180e0237938a2536de0c54d93f5c278634818e0efc952dd56c",
    urls = [
        "https://github.com/bazelbuild/bazel-skylib/releases/download/1.0.3/bazel-skylib-1.0.3.tar.gz",
        "https://mirror.bazel.build/github.com/bazelbuild/bazel-skylib/releases/download/1.0.3/bazel-skylib-1.0.3.tar.gz",
    ],
)

load("@bazel_skylib//:workspace.bzl", "bazel_skylib_workspace")

bazel_skylib_workspace()

# https://github.com/bazelbuild/rules_nodejs/releases
http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "6142e9586162b179fdd570a55e50d1332e7d9c030efd853453438d607569721d",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/3.0.0/rules_nodejs-3.0.0.tar.gz"],
)

# https://github.com/bazelbuild/rules_sass
http_archive(
    name = "io_bazel_rules_sass",
    patch_args = ["-p1"],
    # We need the latest rules_sass to get the --bazel_patch_module_resolver behavior
    # However it seems to have a bug, so we patch back to the prior dart-sass version.
    # See https://github.com/bazelbuild/rules_sass/issues/127
    patches = ["@build_bazel_rules_nodejs//:rules_sass.issue127.patch"],
    sha256 = "8392cf8910db2b1dc3b488ea18113bfe4fd666037bf8ec30d2a3f08fc602a6d8",
    strip_prefix = "rules_sass-1.30.0",
    urls = [
        "https://github.com/bazelbuild/rules_sass/archive/1.30.0.zip",
        "https://mirror.bazel.build/github.com/bazelbuild/rules_sass/archive/1.30.0.zip",
    ],
)

load("@build_bazel_rules_nodejs//:index.bzl", "yarn_install")

yarn_install(
    name = "npm",
    package_json = "//:package.json",
    quiet = False,
    yarn_lock = "//:yarn.lock",
)

load("@io_bazel_rules_sass//sass:sass_repositories.bzl", "sass_repositories")

sass_repositories()

# https://github.com/bazelbuild/rules_webtesting/releases
http_archive(
    name = "io_bazel_rules_webtesting",
    sha256 = "9bb461d5ef08e850025480bab185fd269242d4e533bca75bfb748001ceb343c3",
    urls = ["https://github.com/bazelbuild/rules_webtesting/releases/download/0.3.3/rules_webtesting.tar.gz"],
)
