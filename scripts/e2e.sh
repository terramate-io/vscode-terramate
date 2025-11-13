#!/usr/bin/env bash
# Copyright 2025 Terramate GmbH
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
set -o errexit
set -o nounset

export CODE_TESTS_PATH="$(pwd)/out/test"
export CODE_TESTS_WORKSPACE="$(pwd)/testFixture"
export CODE_TESTS_VERSION_CONSTRAINT="$(npm pkg get engines.vscode | tr -d '"')"
export CODE_TESTS_VERSION=""

# Add terramate-ls from bin/ directory (if installed via make deps)
export PATH=$PATH:`pwd`/bin

if [ $# -ge 1 ]; then
    export CODE_TESTS_VERSION="$1"
fi

# Pass remaining args to mocha (for --grep filtering)
shift 2>/dev/null || true
export CODE_TESTS_MOCHA_ARGS="$*"

echo "VERSION=$CODE_TESTS_VERSION"
echo "CONSTRAINT=$CODE_TESTS_VERSION_CONSTRAINT"

node "$(pwd)/out/test/runTest"
