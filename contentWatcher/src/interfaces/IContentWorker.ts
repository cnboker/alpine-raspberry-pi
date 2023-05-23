export  enum LogLevel {
    INFO = 0,
    WARN = 1,
    ERROR = 2
}
/*
1. 定时轮询监视是否有新的通知
2. 如果有更新通知，并根据通知类型做相应处理
*/
export interface IContentWorker {
    contentNotify: IContentNotify;
    //callback:异步任务完成通知
    execute(callback: (message:string) => void): void;
    log(level: LogLevel, message: string): void;
}

export interface IContentNotify {
    //通知监控
    watch(): void;

    //接受截屏通知
    onSnapshot(callback: () => void): void;
}

export enum DownloadStatus {
    Origin = 0,
    Success = 1,
    Failure = 2,
    Begin = 3
}
//资源数据
export interface IResourceInfo {
    resourceUrl: string,
    status?: DownloadStatus, //0 origin, 1 success, 2. failure, 3. begin
    ticket: number,
    completed: boolean
}

//资源下载器
export interface IFileDownloader {
    //资源列表
    fileList: IResourceInfo[];
    //开始下载
    download(fileList: IResourceInfo[]): void;
    onOneDownloadComplete: (file: IResourceInfo) => void
    //下载完成
    onDownloadComplete: (fileList: IResourceInfo[]) => void
    //取消所有下载
    cancel(): void;
}
