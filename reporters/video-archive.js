// @ts-check
const { spawn } = require('node:child_process');
const fs = require('node:fs/promises');
const path = require('node:path');
const ffmpegPath = require('ffmpeg-static');

const RECORDINGS_DIR = path.resolve(process.cwd(), 'recordings');

function projectName(test) {
  let suite = test.parent;
  while (suite && suite.type !== 'project') suite = suite.parent;
  return suite?.title;
}

function transcodeHalfSpeed(inputPath, outputPath) {
  if (!ffmpegPath) {
    throw new Error('ffmpeg-static did not provide an FFmpeg executable for video slow-motion processing.');
  }

  return new Promise((resolve, reject) => {
    const process = spawn(ffmpegPath, [
      '-hide_banner',
      '-loglevel', 'error',
      '-y',
      '-i', inputPath,
      '-vf', 'setpts=2*PTS',
      '-an',
      '-c:v', 'libvpx',
      '-deadline', 'realtime',
      '-cpu-used', '5',
      '-b:v', '1M',
      '-crf', '32',
      outputPath,
    ], { stdio: ['ignore', 'ignore', 'pipe'] });

    let errorOutput = '';
    process.stderr.setEncoding('utf8');
    process.stderr.on('data', (chunk) => { errorOutput += chunk; });
    process.on('error', reject);
    process.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg failed (${code}): ${errorOutput.trim()}`));
    });
  });
}

class VideoArchiveReporter {
  constructor() {
    this.count = 0;
  }

  /** @param {import('@playwright/test/reporter').TestCase} test @param {import('@playwright/test/reporter').TestResult} result */
  async onTestEnd(test, result) {
    if (projectName(test) !== 'chromium') return;
    if (result.status === 'skipped') return;
    const video = result.attachments.find((attachment) => attachment.name === 'video' && attachment.path);
    if (!video?.path) {
      console.warn(`No Playwright video attachment was produced for "${test.title}".`);
      return;
    }

    await fs.mkdir(RECORDINGS_DIR, { recursive: true });
    const timestamp = result.startTime.toISOString().replace(/[:.]/g, '-');
    const title = test.titlePath().slice(2).join(' - ');
    const caseId = title.match(/\bTC-\d+\b/i)?.[0]?.toUpperCase() || 'TC-UNKNOWN';
    const attempt = result.retry + 1;
    const baseName = `${caseId}_attempt-${attempt}_${timestamp}`;
    const destination = path.join(RECORDINGS_DIR, `${baseName}.webm`);
    const temporaryOutput = path.join(RECORDINGS_DIR, `${baseName}.slow.webm`);
    try {
      await transcodeHalfSpeed(video.path, temporaryOutput);
      await fs.rename(temporaryOutput, destination);
    } catch (error) {
      await fs.rm(temporaryOutput, { force: true });
      throw new Error(`Could not archive 0.5x Chromium recording for "${test.title}".`, { cause: error });
    }
    this.count += 1;
    console.log(`Archived 0.5x Chromium test video: ${path.relative(process.cwd(), destination)}`);
  }

  onEnd() {
    console.log(`Archived ${this.count} Playwright video(s) with on-screen captions to ${RECORDINGS_DIR}.`);
  }
}

module.exports = VideoArchiveReporter;
