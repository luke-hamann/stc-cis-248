/** Encapsulates data for an HTTP response
 *
 * Fetch Response objects are immutable.
 * This class allows the values for the outgoing response to be mutated before finally constructing and sending the response.
 */
export default class ResponseWrapper {
  /** The response body */
  public body: ReadableStream | Uint8Array | ArrayBuffer | string | null = null;

  /** The response headers */
  public headers: Map<string, string> = new Map<string, string>();

  /** The response status code */
  public status: number | null = null;

  /** Converts the response wrapper to a response
   * @returns The HTTP response
   */
  public toResponse() {
    return new Response(this.body, {
      status: this.status ?? 200,
      headers: new Headers(Object.fromEntries(this.headers)),
    });
  }
}
