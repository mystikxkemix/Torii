import Parser from "rss-parser";

export enum DelayType {
  hours,
}

function convertDelayType(delayType: DelayType): number {
  switch (delayType) {
    case DelayType.hours:
      return 60 * 60 * 1000;
  }

  return 0;
}

export class RssFeed {
  private _url: string;
  private _delayNumber: number;
  private _delayType: DelayType;
  private _lastUpdate: Date;
  private _parser: Parser;

  constructor(
    url: string,
    delayNumber: number,
    delayType: DelayType,
    lastUpdate: Date
  ) {
    this._url = url;
    this._delayNumber = delayNumber;
    this._delayType = delayType;
    this._lastUpdate = lastUpdate;
    this._parser = new Parser();
  }

  public async update() {
    this.startDelay();
    const feed = await this._parser.parseURL(this._url);
    this._lastUpdate = new Date();
  }

  private startDelay() {
    const delayTime = convertDelayType(this._delayType) * this._delayNumber;
    setTimeout(() => {
      this.update();
    }, delayTime);
  }
}
