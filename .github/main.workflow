workflow "Test, build, publish" {
  resolves = [
    "Publish",
    "Has tag",
  ]
  on = "push"
}

action "Install" {
  uses = "actions/npm@e7aaefed7c9f2e83d493ff810f17fa5ccd7ed437"
  args = "install"
}

action "Test" {
  uses = "actions/npm@e7aaefed7c9f2e83d493ff810f17fa5ccd7ed437"
  needs = ["Install"]
  args = "test"
}

action "Master" {
  uses = "actions/bin/filter@b2bea0749eed6beb495a8fa194c071847af60ea1"
  needs = ["Test"]
  args = "branch master"
}

action "Build" {
  uses = "actions/npm@e7aaefed7c9f2e83d493ff810f17fa5ccd7ed437"
  needs = ["Master"]
  args = "build"
}

action "Has tag" {
  uses = "actions/bin/filter@8075e145e58d8ad0392cb3ff6c30a00fa07dcf8d"
  needs = ["Build"]
  args = "tag v*"
}

action "Publish" {
  uses = "actions/npm@e7aaefed7c9f2e83d493ff810f17fa5ccd7ed437"
  needs = ["Has tag"]
  secrets = ["NPM_AUTH_TOKEN"]
  args = "publish --access public"
}
