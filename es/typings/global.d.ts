export declare enum MessageType {
    ABNORMALRESOURCE = "abnormalresource",
    LARGERESOURCE = "largeresource",
    SSRERROR = "ssrerror",
    EMPTYPAGE = "emptypage",
    PAGEERROR = "pageerror"
}
export declare enum MessageDuration {
    DEFAULT = 21600000,
    ABNORMALRESOURCE = 3600000,
    SSRERROR = 600000,
    EMPTYPAGE = 0
}
