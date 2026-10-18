// Runs before `npm install`. CI uses the version in .nvmrc (22); 24 is verified locally too.
const SUPPORTED_MAJORS = [22, 24]
const major = Number(process.versions.node.split('.')[0])

if (!SUPPORTED_MAJORS.includes(major)) {
  console.error(
    `Node ${SUPPORTED_MAJORS.join(' or ')} is required (found ${process.versions.node}). Run \`nvm use\` to switch to the version in .nvmrc.`,
  )
  process.exit(1)
}
