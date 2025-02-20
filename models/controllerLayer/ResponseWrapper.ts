/**
 * A class for representing a mutable HTTP response
 */
export default class ResponseWrapper {
  public body: ReadableStream | Uint8Array | string | null = null;
  public headers: Map<string, string> = new Map<string, string>();
  public status: number | null = null;

  /**
   * Convert the response wrapper to a response
   * @returns The HTTP response
   */
  public toResponse() {
    return new Response(this.body, {
      status: this.status ?? 200,
      headers: new Headers(Object.fromEntries(this.headers)),
    });
  }
}
