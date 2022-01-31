import { createFFmpeg } from '@ffmpeg/ffmpeg';


let ffmpeg: any;


const factory = async (): Promise<any> => {
    if (!ffmpeg) {
        ffmpeg = createFFmpeg({ log: true });
    }

    if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
    }

    return ffmpeg;
};

const read = (i: string): any => {
    try {
        return ffmpeg.FS('readFile', `segment${i}.ts`);
    }
    catch {}

    return false;
};

const segment = (i: number): string => {
    if (i < 10) {
        return `00${i}`;
    }
    else if (i < 100) {
        return `0${i}`;
    }

    return `${i}`;
};


export default { factory, read, segment };
export { factory, read, segment };
