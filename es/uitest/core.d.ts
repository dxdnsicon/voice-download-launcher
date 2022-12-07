interface SingleEventProps {
    eventItem: EventItem;
    Fcase_id: string;
    Fcase_history_id: string;
    index: number;
    pageItem: UiTestConfig['pageItem'];
    master_taskid: PageDetails['master_taskid'];
}
declare const _default: (page: any, { eventItem, Fcase_id, Fcase_history_id, index, pageItem, master_taskid }: SingleEventProps) => Promise<eventResultItem>;
export default _default;
