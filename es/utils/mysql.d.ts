import "dotenv/config";
import mysql from "mysql2/promise";
interface SaveTaskRes {
    taskId: string;
    pageId: number;
    taskType: string;
    env: string;
    result: any;
    from: string;
}
export declare const saveTaskRes: (res: SaveTaskRes) => Promise<mysql.RowDataPacket[] | mysql.RowDataPacket[][] | mysql.OkPacket | mysql.OkPacket[] | mysql.ResultSetHeader>;
export declare const saveReport: ({ record, md5 }: {
    record: any;
    md5: any;
}) => Promise<mysql.RowDataPacket[] | mysql.RowDataPacket[][] | mysql.OkPacket | mysql.OkPacket[] | mysql.ResultSetHeader>;
export declare const saveFile: ({ name, file, mimeType }: {
    name: any;
    file: any;
    mimeType: any;
}) => Promise<mysql.RowDataPacket[] | mysql.RowDataPacket[][] | mysql.OkPacket | mysql.OkPacket[] | mysql.ResultSetHeader>;
export declare const downLoadFile: (name: any) => Promise<any>;
export declare const fileIsExist: (name: any) => Promise<boolean>;
export declare const renameFile: (origin: any, target: any) => Promise<mysql.RowDataPacket[] | mysql.RowDataPacket[][] | mysql.OkPacket | mysql.OkPacket[] | mysql.ResultSetHeader>;
export declare const copyFile: (from: any, to: any) => Promise<mysql.RowDataPacket[] | mysql.RowDataPacket[][] | mysql.OkPacket | mysql.OkPacket[] | mysql.ResultSetHeader>;
export declare const deleteFile: (name: any) => Promise<mysql.RowDataPacket[] | mysql.RowDataPacket[][] | mysql.OkPacket | mysql.OkPacket[] | mysql.ResultSetHeader>;
export declare const queryUrlContentMd5: (url: any, proxyID?: number) => Promise<string[]>;
export declare const upsertUrlContentMd5: (url: any, proxyID: number, currentMD5: any, preMD5: any) => Promise<mysql.RowDataPacket[] | mysql.RowDataPacket[][] | mysql.OkPacket | mysql.OkPacket[] | mysql.ResultSetHeader>;
export declare const queryConf: (key: any) => Promise<any>;
export declare const upsertConf: (key: any, value: any) => Promise<mysql.RowDataPacket[] | mysql.RowDataPacket[][] | mysql.OkPacket | mysql.OkPacket[] | mysql.ResultSetHeader>;
export {};
