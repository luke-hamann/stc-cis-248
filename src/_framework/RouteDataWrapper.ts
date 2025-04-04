export default class RouteData {
  private _routeDataMap: Map<string, string>;

  public constructor(matches: string[], mappings: [number, string][]) {
    this._routeDataMap = new Map<string, string>();
    for (const [index, keyName] of mappings) {
      this._routeDataMap.set(keyName, matches[index]);
    }
  }

  public getString(key: string): string | null {
    return this._routeDataMap.get(key) ?? null;
  }
}
