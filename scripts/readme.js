import fs from 'fs'
import path from 'path'

function updateSourceEnclosures (readmePath) {
  const readmeContent = fs.readFileSync(readmePath, 'utf8')
  const sourceRegex = /<!-- SOURCE (.*?) -->([\s\S]*?)<!-- SOURCE END -->/g

  const updatedContent = readmeContent.replace(sourceRegex, (match, filePath) => {
    try {
      const fileContent = fs.readFileSync(filePath.trim(), 'utf8')
      return `<!-- SOURCE ${filePath} -->\n\`\`\`${path.extname(filePath).slice(1)}\n${fileContent}\n\`\`\`\n<!-- SOURCE END -->`
    } catch (err) {
      console.error(`Error reading file ${filePath}:`, err.message)
      return match
    }
  })

  fs.writeFileSync(readmePath, updatedContent, 'utf8')
  console.log('README.md has been updated.')
}

const readmePath = path.resolve(import.meta.dirname, '../README.md')
updateSourceEnclosures(readmePath)
