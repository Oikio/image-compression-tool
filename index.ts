import { mkdir, readFile, readdir } from 'fs/promises'
import sharp from 'sharp'

const quality = process.argv[2] ? parseInt(process.argv[2]) : 100
const x = process.argv[3] ? parseInt(process.argv[3]) : 0
const y = process.argv[4] ? parseInt(process.argv[4]) : 0

const main = async () => {
  await mkdir('out', { recursive: true })
  await mkdir('in', { recursive: true })

  const filePaths = (await readdir('in')).filter(
    path => path.endsWith('.png') || path.endsWith('.svg')
  )

  await Promise.all(
    filePaths.map(async path => {
      const file = await readFile(`in/${path}`)

      const sharpImage = sharp(file)

      if (x && y) sharpImage.resize(x, y)

      sharpImage.png({
        compressionLevel: 9,
        palette: true,
        quality
      })

      console.log(`>>> ${path}: `, `${Buffer.byteLength(await sharpImage.toBuffer()) / 1024}kb`)

      await sharpImage.toFile(`out/${path.replace('.svg', '.png')}`)
    })
  )
}

main()
