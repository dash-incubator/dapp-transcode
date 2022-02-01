import { fetchFile } from '@ffmpeg/ffmpeg';
import { factory, read, segment } from './ffmpeg';
import { Data } from './types';


const transcode = async (file: File): Promise<Data> => {
    let data: Data = [],
        ffmpeg = await factory();

    ffmpeg.FS('writeFile', file.name, await fetchFile(file));

    await ffmpeg.run(
        '-y',
        '-i',
        file.name,
        '-c:a',
        'libmp3lame',
        '-q:a',
        '0',
        '-map',
        '0:0',
        '-f',
        'segment',
        '-segment_time',
        '10',
        '-segment_list',
        'segments.m3u8',
        '-segment_format',
        'mpegts',
        'segment%03d.ts'
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

    return data;
};


export default { transcode };
