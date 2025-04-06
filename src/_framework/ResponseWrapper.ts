/** Encapsulates data in an HTTP Request
 *
 * Fetch Request objects are immutable.
 * This class allows the values for the outgoing response to be mutated before finally constructing and sending the response.
 */
export default class ResponseWrapper {
  /** The body of the response */
  public body: ReadableStream | Uint8Array | ArrayBuffer | string | null = null;

  /** The headers of the response */
  public headers: Map<string, string> = new Map<string, string>();

  /** The status code of the response */
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
