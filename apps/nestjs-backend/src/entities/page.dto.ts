export class PageDto<T> {
  readonly content: T[];

  readonly pageNo: number;

  readonly pageSize: number;

  readonly totalPages: number;

  readonly totalElements: number;

  readonly last: boolean;

  constructor({ content, pageNo, pageSize, totalPages, totalElements, last }) {
    this.content = content;
    this.pageNo = pageNo;
    this.pageSize = pageSize;
    this.totalPages = totalPages;
    this.totalElements = totalElements;
    this.last = last;
  }
}
