const fs = require('fs')
const request = require('request')
const progress = require('request-progress')

export interface downloadState {
  percent: number,
  speed: number, //the download speed in bytes/sec
  size: {
    total: number,
    transferred: number
  },
  time: {
    elapsed: number // the total elapsed seconds since the start
    remaining: number //the remaining seconds to finished
  }
}

export const download = (
  sourceUrl: string,
  targetUrl: string, //Directory where to save the downloaded file.
  onProgress: (state: downloadState) => void,
  onError: (error: any) => void,
  onEnd:()=>void
): void => {
  progress(request(sourceUrl))
    .on('progress', (state: downloadState) => {
      onProgress && onProgress(state)
    })
    .on('error', (err: any) => {
      onError && onError(err)
    })
    .on('end', () => { onEnd && onEnd() })
    .pipe(fs.createWriteStream(targetUrl));
}
