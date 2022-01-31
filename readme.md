# Dash dApp Transcode

## Usage
Pass an audio or video file to their respective `transcode` methods.

```
import { audio, video } from '@dash-incubator/dapp-transcode';


let content = '';


// If transcoding audio use
content = await audio.trancode(<file>);

// If transcoding video use
content = await video.trancode(<file>);
```

Each method returns the CID ( IPFS Content ID ) of the directory storing the transcoded content.
Read the 'segments.m3u8' file within the CID directory to begin playback.
