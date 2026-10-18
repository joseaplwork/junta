# Specs

One file per feature, written before the code: `NNN-short-slug.md`, numbered
in order (`001-payment-tracking.md`). Copy [\_template.md](_template.md).

A spec is ready for implementation when:

- every business decision it relies on is answered, here or in
  `docs/domain.md`;
- every acceptance criterion can be checked by a test or by a command;
- it lists the generator commands to run, or says why none apply.

Keep the spec after the feature ships. Tick its acceptance criteria and set
its status to `done`. It is the record of why the code looks the way it does.
