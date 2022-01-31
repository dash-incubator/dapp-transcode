import { storage } from '@dash-incubator/dapp-sdk';
import { fetchFile } from '@ffmpeg/ffmpeg';
import { factory, read, segment } from './ffmpeg';


const transcode = async (file: File): Promise<string> => {
    let data: { content: string, path: string }[] = [],
        ffmpeg = await factory();

    ffmpeg.FS('writeFile', file.name, await fetchFile(file));

    await ffmpeg.run(
        '-i',
        file.name,
        '-strict',
        '-2',
        '-profile:v',
        'baseline',
        '-level',
        '3.0',
        '-start_number',
        '0',
        '-hls_list_size',
        '0',
        '-hls_segment_filename',
        'segment%03d.ts',
        '-f',
        'hls',
        'segments.m3u8'
    );

    data.push({
        content: ffmpeg.FS('readFile', 'segments.m3u8'),
        path: 'segments.m3u8'
    });

    let content,
        i = 0;

    while (content = read(segment(i))) {
        data.push({
            content: content,
            path: `segment${segment(i)}.ts`
        });

        i++;
    }

    return await storage.ipfs.upload.data(data);
};


export default { transcode };
